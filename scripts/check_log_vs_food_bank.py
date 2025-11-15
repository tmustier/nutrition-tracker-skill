#!/usr/bin/env python3
"""
Utility for validating nutrition logs against the food data bank.

Features:
- Flags nutrients that are recorded as zero in the logs while the linked
  food-bank entry reports non-zero amounts (after scaling for quantity/unit).
- Lists items without a food_bank_id, highlighting which nutrient fields
  remain at zero so they can be manually reviewed.
"""

from __future__ import annotations

import argparse
import re
from collections import defaultdict
from dataclasses import dataclass
from decimal import Decimal, getcontext
from pathlib import Path
from typing import Dict, List, Optional, Sequence

import yaml

getcontext().prec = 28

EXPECTED_FIELDS: Sequence[str] = [
    # Macros & energy
    "energy_kcal",
    "protein_g",
    "fat_g",
    "sat_fat_g",
    "mufa_g",
    "pufa_g",
    "trans_fat_g",
    "cholesterol_mg",
    # Carbohydrates
    "carbs_total_g",
    "carbs_available_g",
    "sugar_g",
    "fiber_total_g",
    "fiber_soluble_g",
    "fiber_insoluble_g",
    "polyols_g",
    # Essential minerals
    "sodium_mg",
    "potassium_mg",
    "calcium_mg",
    "magnesium_mg",
    "phosphorus_mg",
    "chloride_mg",
    "sulfur_g",
    # Trace minerals
    "iron_mg",
    "zinc_mg",
    "copper_mg",
    "manganese_mg",
    "selenium_ug",
    "iodine_ug",
    "chromium_ug",
    "molybdenum_ug",
    # Fat-soluble vitamins
    "vitamin_a_ug",
    "vitamin_d_ug",
    "vitamin_e_mg",
    "vitamin_k_ug",
    # B vitamins
    "vitamin_b1_mg",
    "vitamin_b2_mg",
    "vitamin_b3_mg",
    "vitamin_b5_mg",
    "vitamin_b6_mg",
    "vitamin_b7_ug",
    "vitamin_b9_ug",
    "vitamin_b12_ug",
    "choline_mg",
    # Water-soluble vitamins
    "vitamin_c_mg",
    # Fatty acids
    "omega3_epa_mg",
    "omega3_dha_mg",
    "omega3_ala_g",
    "omega6_la_g",
    # Ultra-trace minerals
    "boron_mg",
    "silicon_mg",
    "vanadium_ug",
    "nickel_ug",
    # Alcohol (optional)
    "alcohol_g",
    "alcohol_energy_kcal",
]

OPTIONAL_FIELDS = {"alcohol_g", "alcohol_energy_kcal"}

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
class Discrepancy:
    file: Path
    timestamp: str
    name: str
    nutrient: str
    log_value: str
    expected_value: str


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
    """Lazy loader + index for food-bank entries."""

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
        with path.open("r") as handle:
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
            raise KeyError(f"Food bank entry '{entry_id}' not found.")
        text = path.read_text()
        match = re.search(r"```yaml\s*(.*?)```", text, re.S)
        if not match:
            raise ValueError(f"No YAML payload found in {path}.")
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
            raise ValueError("Portion weight missing for gram-based unit.")
        portion_decimal = Decimal(str(portion_weight))
        if portion_decimal.is_zero():
            raise ValueError("Portion weight cannot be zero for gram-based unit.")
        return quantity / portion_decimal
    return quantity


def find_discrepancies(
    logs_dir: Path, food_bank: FoodBankIndex
) -> tuple[List[Discrepancy], List[ManualItem]]:
    discrepancy_rows: List[Discrepancy] = []
    manual_rows: List[ManualItem] = []

    log_files = sorted(p for p in logs_dir.rglob("*.yaml") if p.name != "SCHEMA.md")
    for log_file in log_files:
        data = yaml.safe_load(log_file.read_text())
        entries = data.get("entries") or []
        for entry in entries:
            timestamp = entry.get("timestamp", "unknown")
            entry_notes = entry.get("notes")
            for item in entry.get("items", []) or []:
                name = item.get("name", "unknown")
                nutrition = item.get("nutrition") or {}
                quantity_raw = item.get("quantity", 0)
                try:
                    quantity = Decimal(str(quantity_raw))
                except (ValueError, TypeError, ArithmeticError):
                    quantity = Decimal("0")
                unit = str(item.get("unit", "")).lower()
                food_id = item.get("food_bank_id")
                if food_id:
                    try:
                        fb_entry = food_bank.get(food_id)
                    except (KeyError, ValueError, FileNotFoundError) as exc:
                        discrepancy_rows.append(
                            Discrepancy(
                                log_file,
                                timestamp,
                                name,
                                "food_bank_lookup",
                                "n/a",
                                f"Missing entry: {exc}",
                            )
                        )
                        continue
                    portion = fb_entry.get("portion", {})
                    per_portion = fb_entry.get("per_portion", {})
                    portion_weight = portion.get("est_weight_g")
                    try:
                        factor = scale_factor(quantity, unit, portion_weight)
                    except ValueError as exc:
                        discrepancy_rows.append(
                            Discrepancy(
                                log_file,
                                timestamp,
                                name,
                                "scale_factor",
                                str(quantity_raw),
                                str(exc),
                            )
                        )
                        continue
                    for field in EXPECTED_FIELDS:
                        if field in OPTIONAL_FIELDS:
                            continue
                        log_raw = nutrition.get(field)
                        log_val = decimal_value(log_raw)
                        bank_val = decimal_value(per_portion.get(field)) * factor
                        if bank_val.copy_abs() < DISCREPANCY_THRESHOLD:
                            continue
                        if log_raw is None or log_val == 0:
                            discrepancy_rows.append(
                                Discrepancy(
                                    log_file,
                                    timestamp,
                                    name,
                                    field,
                                    str(log_raw if log_raw is not None else "missing"),
                                    f"{bank_val.normalize()}",
                                )
                            )
                else:
                    zero_fields = [
                        field
                        for field in EXPECTED_FIELDS
                        if field not in OPTIONAL_FIELDS
                        and decimal_value(nutrition.get(field)).is_zero()
                    ]
                    manual_rows.append(
                        ManualItem(
                            file=log_file,
                            timestamp=timestamp,
                            name=name,
                            quantity=str(quantity_raw),
                            unit=item.get("unit", ""),
                            zero_fields=zero_fields,
                            notes=entry_notes,
                        )
                    )
    return discrepancy_rows, manual_rows


def render_table(headers: Sequence[str], rows: Sequence[Sequence[str]]) -> str:
    if not rows:
        return "None.\n"
    widths = [len(h) for h in headers]
    for row in rows:
        for idx, cell in enumerate(row):
            widths[idx] = max(widths[idx], len(str(cell)))
    divider = "-+-".join("-" * w for w in widths)
    output = [" | ".join(h.ljust(widths[i]) for i, h in enumerate(headers)), divider]
    for row in rows:
        output.append(" | ".join(str(cell).ljust(widths[i]) for i, cell in enumerate(row)))
    output.append("")
    return "\n".join(output)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Check nutrition logs for zero-value discrepancies."
    )
    parser.add_argument(
        "--logs-dir",
        default="data/logs",
        help="Directory containing daily nutrition logs (default: data/logs).",
    )
    parser.add_argument(
        "--food-bank-dir",
        default="data/food-data-bank",
        help="Directory containing food bank entries (default: data/food-data-bank).",
    )
    args = parser.parse_args()

    logs_dir = Path(args.logs_dir)
    food_bank_dir = Path(args.food_bank_dir)

    food_bank = FoodBankIndex(food_bank_dir)
    discrepancies, manual_items = find_discrepancies(logs_dir, food_bank)

    discrepancies_rows = [
        (
            row.file.name,
            row.timestamp,
            row.name,
            row.nutrient,
            row.log_value,
            row.expected_value,
        )
        for row in discrepancies
    ]
    manual_rows = [
        (
            item.file.name,
            item.timestamp,
            item.name,
            f"{item.quantity} {item.unit}".strip(),
            ", ".join(item.zero_fields) or "—",
            item.notes or "",
        )
        for item in manual_items
    ]

    print("=== Food-bank vs Log Zero Discrepancies ===")
    print(
        render_table(
            ["log_file", "timestamp", "item", "nutrient", "log_value", "food_bank_value"],
            discrepancies_rows,
        )
    )
    print("=== Items Without food_bank_id (0-valued nutrients) ===")
    print(
        render_table(
            ["log_file", "timestamp", "item", "qty/unit", "zero_fields", "entry_notes"],
            manual_rows,
        )
    )


if __name__ == "__main__":
    main()
