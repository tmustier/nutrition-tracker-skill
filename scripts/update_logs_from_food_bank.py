#!/usr/bin/env python3
"""Synchronize nutrition logs with food bank data.

Dry-run by default. When --apply is passed, nutrition blocks for items with a
food_bank_id are regenerated from the authoritative food-bank record (scaled to
quantity/unit) and written back to the YAML log. Items lacking food_bank_id are
listed for manual follow-up.
"""
from __future__ import annotations

import argparse
import re
import shutil
from collections import defaultdict
from dataclasses import dataclass
from decimal import Decimal, getcontext
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple

import yaml

getcontext().prec = 28

EXPECTED_FIELDS: Sequence[str] = [
    "energy_kcal",
    "protein_g",
    "fat_g",
    "sat_fat_g",
    "mufa_g",
    "pufa_g",
    "trans_fat_g",
    "cholesterol_mg",
    "carbs_total_g",
    "carbs_available_g",
    "sugar_g",
    "fiber_total_g",
    "fiber_soluble_g",
    "fiber_insoluble_g",
    "polyols_g",
    "sodium_mg",
    "potassium_mg",
    "calcium_mg",
    "magnesium_mg",
    "phosphorus_mg",
    "chloride_mg",
    "sulfur_g",
    "iron_mg",
    "zinc_mg",
    "copper_mg",
    "manganese_mg",
    "selenium_ug",
    "iodine_ug",
    "chromium_ug",
    "molybdenum_ug",
    "vitamin_a_ug",
    "vitamin_d_ug",
    "vitamin_e_mg",
    "vitamin_k_ug",
    "vitamin_b1_mg",
    "vitamin_b2_mg",
    "vitamin_b3_mg",
    "vitamin_b5_mg",
    "vitamin_b6_mg",
    "vitamin_b7_ug",
    "vitamin_b9_ug",
    "vitamin_b12_ug",
    "choline_mg",
    "vitamin_c_mg",
    "omega3_epa_mg",
    "omega3_dha_mg",
    "omega3_ala_g",
    "omega6_la_g",
    "boron_mg",
    "silicon_mg",
    "vanadium_ug",
    "nickel_ug",
]

MASS_UNITS = {
    "g",
    "gram",
    "grams",
    "kg",
    "kilogram",
    "kilograms",
    "ml",
    "milliliter",
    "milliliters",
    "l",
    "liter",
    "litre",
    "litres",
    "oz",
    "ounce",
    "ounces",
}

DISCREPANCY_THRESHOLD = Decimal("0.0001")


@dataclass
class ItemChange:
    timestamp: str
    name: str
    fields_changed: List[str]


@dataclass
class ManualItem:
    file: Path
    timestamp: str
    name: str
    quantity: str
    unit: str
    zero_fields: List[str]
    notes: Optional[str]


class FoodBankIndex:
    def __init__(self, root: Path) -> None:
        self.root = root
        self._index: Dict[str, Path] = {}
        self._cache: Dict[str, dict] = {}
        self._build_index()

    def _build_index(self) -> None:
        for path in self.root.rglob("*.md"):
            entry_id = self._extract_id(path)
            if entry_id:
                self._index[entry_id] = path

    @staticmethod
    def _extract_id(path: Path) -> Optional[str]:
        inside_block = False
        with path.open() as handle:
            for line in handle:
                stripped = line.strip()
                if stripped.startswith("```yaml"):
                    inside_block = True
                    continue
                if inside_block and stripped.startswith("```"):
                    break
                if inside_block and stripped.startswith("id:"):
                    return stripped.split(":", 1)[1].strip()
        return None

    def get(self, entry_id: str) -> dict:
        if entry_id in self._cache:
            return self._cache[entry_id]
        path = self._index.get(entry_id)
        if not path:
            raise KeyError(f"Food bank entry '{entry_id}' not found")
        text = path.read_text()
        match = re.search(r"```yaml\s*(.*?)```", text, re.S)
        if not match:
            raise ValueError(f"No YAML block found in {path}")
        data = yaml.safe_load(match.group(1))
        self._cache[entry_id] = data
        return data


def decimal_value(raw: Optional[float]) -> Decimal:
    if raw is None:
        return Decimal("0")
    return Decimal(str(raw))


def scale_factor(quantity: Decimal, unit: str, portion_weight: Optional[float]) -> Decimal:
    if unit in MASS_UNITS:
        if not portion_weight:
            raise ValueError("portion est_weight_g missing for gram-based unit")
        portion_decimal = Decimal(str(portion_weight))
        if portion_decimal.is_zero():
            raise ValueError("portion est_weight_g cannot be zero for gram-based unit")
        return quantity / portion_decimal
    return quantity


def quantize_value(value: Decimal) -> float | int:
    q = value.quantize(Decimal("0.0001"))
    if q == q.to_integral():
        return int(q)
    return float(q.normalize())


def build_scaled_nutrition(per_portion: dict, factor: Decimal) -> Dict[str, float | int]:
    result: Dict[str, float | int] = {}
    for field in EXPECTED_FIELDS:
        scaled = decimal_value(per_portion.get(field)) * factor
        result[field] = quantize_value(scaled)
    return result


def diff_fields(current: dict, updated: dict) -> List[str]:
    diffs: List[str] = []
    for field in EXPECTED_FIELDS:
        cur_val = decimal_value(current.get(field))
        new_val = decimal_value(updated.get(field))
        if current.get(field) is None:
            if new_val.copy_abs() > DISCREPANCY_THRESHOLD:
                diffs.append(field)
            continue
        if (cur_val - new_val).copy_abs() > DISCREPANCY_THRESHOLD:
            diffs.append(field)
    missing_fields = [f for f in EXPECTED_FIELDS if f not in current]
    for field in missing_fields:
        if field not in diffs:
            diffs.append(field)
    return diffs


def zero_fields(nutrition: dict) -> List[str]:
    fields: List[str] = []
    for field in EXPECTED_FIELDS:
        if decimal_value(nutrition.get(field)).is_zero():
            fields.append(field)
    return fields


def iter_log_files(paths: List[Path], logs_dir: Path) -> Iterable[Path]:
    if not paths:
        yield from sorted(logs_dir.rglob("*.yaml"))
        return
    for path in paths:
        if not path.exists():
            continue
        if path.is_dir():
            yield from sorted(path.rglob("*.yaml"))
        elif path.suffix in {".yaml", ".yml"}:
            yield path


def process_file(
    log_path: Path,
    food_bank: FoodBankIndex,
    apply_changes: bool,
    create_backup: bool,
) -> Tuple[List[ItemChange], List[ManualItem]]:
    if log_path.name == "SCHEMA.md":
        return [], []
    data = yaml.safe_load(log_path.read_text())
    entries = data.get("entries") or []
    file_changes: List[ItemChange] = []
    manual_items: List[ManualItem] = []
    for entry in entries:
        timestamp = entry.get("timestamp", "unknown")
        entry_notes = entry.get("notes")
        for item in entry.get("items", []) or []:
            name = item.get("name", "unknown")
            nutrition = item.get("nutrition") or {}
            quantity_raw = item.get("quantity", 0)
            unit = str(item.get("unit", "")).lower()
            try:
                quantity = Decimal(str(quantity_raw))
            except (ValueError, TypeError, ArithmeticError):
                quantity = Decimal("0")
            food_id = item.get("food_bank_id")
            if not food_id:
                manual_items.append(
                    ManualItem(
                        file=log_path,
                        timestamp=timestamp,
                        name=name,
                        quantity=str(quantity_raw),
                        unit=item.get("unit", ""),
                        zero_fields=zero_fields(nutrition),
                        notes=entry_notes,
                    )
                )
                continue
            try:
                fb_entry = food_bank.get(food_id)
            except (KeyError, ValueError, FileNotFoundError) as exc:
                file_changes.append(
                    ItemChange(
                        timestamp=timestamp,
                        name=name,
                        fields_changed=[f"lookup_failed: {exc}"],
                    )
                )
                continue
            per_portion = fb_entry.get("per_portion", {})
            portion_weight = fb_entry.get("portion", {}).get("est_weight_g")
            try:
                factor = scale_factor(quantity, unit, portion_weight)
            except ValueError as exc:
                file_changes.append(
                    ItemChange(
                        timestamp=timestamp,
                        name=name,
                        fields_changed=[f"scale_error: {exc}"],
                    )
                )
                continue
            updated_nutrition = build_scaled_nutrition(per_portion, factor)
            diffs = diff_fields(nutrition, updated_nutrition)
            if diffs:
                file_changes.append(ItemChange(timestamp=timestamp, name=name, fields_changed=diffs))
                if apply_changes:
                    item["nutrition"] = updated_nutrition
    if apply_changes and file_changes:
        if create_backup:
            backup_path = log_path.with_suffix(log_path.suffix + ".bak")
            shutil.copy2(log_path, backup_path)
        with log_path.open("w") as handle:
            yaml.safe_dump(
                data,
                handle,
                sort_keys=False,
                allow_unicode=True,
                default_flow_style=False,
            )
    return file_changes, manual_items


def summarize_changes(changes: Dict[Path, List[ItemChange]]) -> str:
    lines = ["=== Proposed updates (dry-run) ==="]
    if not changes:
        lines.append("No differences found.")
        return "\n".join(lines)
    for path in sorted(changes):
        items = changes[path]
        lines.append(f"{path}: {len(items)} item(s) need refresh")
        for item in items:
            sample = ", ".join(item.fields_changed[:5])
            more = "" if len(item.fields_changed) <= 5 else ", ..."
            lines.append(f"  - [{item.timestamp}] {item.name}: {sample}{more}")
    return "\n".join(lines)


def summarize_manual(manual_items: List[ManualItem]) -> str:
    lines = ["=== Items without food_bank_id ==="]
    if not manual_items:
        lines.append("None.")
        return "\n".join(lines)
    for item in manual_items:
        zero_list = ", ".join(item.zero_fields[:8])
        if len(item.zero_fields) > 8:
            zero_list += ", ..."
        qty_unit = f"{item.quantity} {item.unit}".strip()
        lines.append(
            f"{item.file} [{item.timestamp}] {item.name} ({qty_unit}) -> zero fields: {zero_list}"
        )
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "paths",
        nargs="*",
        type=Path,
        help="Specific log files or directories to process (default: all logs)",
    )
    parser.add_argument(
        "--food-bank-dir",
        default="data/food-data-bank",
        type=Path,
        help="Root of food-bank entries (default: data/food-data-bank)",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Persist updates back to log files (default: dry-run)",
    )
    parser.add_argument(
        "--no-backup",
        action="store_true",
        help="Skip writing .bak backups when --apply is used",
    )
    parser.add_argument(
        "--logs-dir",
        default="data/logs",
        type=Path,
        help="Root directory of log files (default: data/logs)",
    )
    args = parser.parse_args()

    food_bank = FoodBankIndex(args.food_bank_dir)
    changes_by_file: Dict[Path, List[ItemChange]] = defaultdict(list)
    manual_items: List[ManualItem] = []
    for log_path in iter_log_files([p for p in args.paths], args.logs_dir):
        file_changes, manual = process_file(
            log_path,
            food_bank,
            apply_changes=args.apply,
            create_backup=not args.no_backup,
        )
        if file_changes:
            changes_by_file[log_path].extend(file_changes)
        manual_items.extend(manual)

    if args.apply:
        print("Updates applied to", len(changes_by_file), "file(s). Backups saved unless disabled.")
    else:
        print(summarize_changes(changes_by_file))
    print()
    print(summarize_manual(manual_items))


if __name__ == "__main__":
    main()
