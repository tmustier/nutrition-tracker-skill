#!/usr/bin/env python3
"""
Audit food-bank entries for nutrition completeness and Atwater alignment.

Checks every Markdown entry in data/food-data-bank/, ensuring:
  * All 52 schema fields exist (and are numeric) inside `per_portion`.
  * Energy values match the available-carb Atwater formula:
        energy = 4P + 9F + 4*carbs_available + 2*fiber_total + 2.4*polyols

Usage:
    python3 scripts/audit_food_bank.py [--root data/food-data-bank]

Outputs two tables summarizing missing-field entries and Atwater mismatches.
"""

from __future__ import annotations

import argparse
import math
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Sequence

import yaml

EXPECTED_FIELDS: Sequence[str] = [
    # Macros & Energy
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
    # Essential Minerals
    "sodium_mg",
    "potassium_mg",
    "calcium_mg",
    "magnesium_mg",
    "phosphorus_mg",
    "chloride_mg",
    "sulfur_g",
    # Trace Minerals
    "iron_mg",
    "zinc_mg",
    "copper_mg",
    "manganese_mg",
    "selenium_ug",
    "iodine_ug",
    "chromium_ug",
    "molybdenum_ug",
    # Fat-Soluble Vitamins
    "vitamin_a_ug",
    "vitamin_d_ug",
    "vitamin_e_mg",
    "vitamin_k_ug",
    # B Vitamins
    "vitamin_b1_mg",
    "vitamin_b2_mg",
    "vitamin_b3_mg",
    "vitamin_b5_mg",
    "vitamin_b6_mg",
    "vitamin_b7_ug",
    "vitamin_b9_ug",
    "vitamin_b12_ug",
    "choline_mg",
    # Water-Soluble Vitamins
    "vitamin_c_mg",
    # Omega fatty acids
    "omega3_epa_mg",
    "omega3_dha_mg",
    "omega3_ala_g",
    "omega6_la_g",
    # Ultra-trace minerals
    "boron_mg",
    "silicon_mg",
    "vanadium_ug",
    "nickel_ug",
]


@dataclass
class MissingFields:
    path: Path
    entry_id: str
    missing: List[str]


@dataclass
class AtwaterIssue:
    path: Path
    entry_id: str
    recorded: float
    computed: float
    delta: float


def extract_yaml_block(path: Path) -> dict:
    text = path.read_text()
    match = re.search(r"```yaml\s*(.*?)```", text, flags=re.S)
    if not match:
        raise ValueError(f"No yaml block in {path}")
    return yaml.safe_load(match.group(1))


def is_number(value) -> bool:
    if isinstance(value, (int, float)):
        return True
    if isinstance(value, str):
        try:
            float(value)
            return True
        except ValueError:
            return False
    return False


def compute_atwater(per: Dict[str, float], derived: Dict[str, float] | None = None) -> float:
    protein = float(per.get("protein_g", 0) or 0)
    fat = float(per.get("fat_g", 0) or 0)
    carbs_available = float(per.get("carbs_available_g", 0) or 0)
    fiber = float(per.get("fiber_total_g", 0) or 0)
    polyols = float(per.get("polyols_g", 0) or 0)
    alcohol_source = per.get("alcohol_g", 0)
    if not alcohol_source and derived:
        alcohol_source = derived.get("alcohol_g", 0)
    alcohol = float(alcohol_source or 0)
    return (
        4 * protein
        + 9 * fat
        + 4 * carbs_available
        + 2 * fiber
        + 2.4 * polyols
        + 7 * alcohol
    )


def audit_food_bank(root: Path, tolerance: float = 5.0):
    missing_reports: List[MissingFields] = []
    atwater_reports: List[AtwaterIssue] = []

    for md_file in sorted(root.rglob("*.md")):
        try:
            data = extract_yaml_block(md_file)
        except Exception as exc:
            print(f"[WARN] Skipping {md_file}: {exc}")
            continue

        entry_id = data.get("id", md_file.stem)
        per = data.get("per_portion")
        if not per or not isinstance(per, dict):
            missing_reports.append(
                MissingFields(md_file, entry_id, ["per_portion missing"])
            )
            continue

        missing = [
            field for field in EXPECTED_FIELDS if field not in per or not is_number(per.get(field))
        ]
        if missing:
            missing_reports.append(MissingFields(md_file, entry_id, missing))

        recorded_energy = per.get("energy_kcal")
        if is_number(recorded_energy):
            computed_energy = compute_atwater(per, data.get("derived") or {})
            recorded_value = float(recorded_energy)
            if not math.isfinite(computed_energy):
                continue
            diff = abs(recorded_value - computed_energy)
            if diff > tolerance:
                atwater_reports.append(
                    AtwaterIssue(
                        md_file,
                        entry_id,
                        recorded_value,
                        computed_energy,
                        recorded_value - computed_energy,
                    )
                )

    return missing_reports, atwater_reports


def render_missing(missing_reports: List[MissingFields]) -> str:
    if not missing_reports:
        return "No missing fields detected.\n"
    lines = ["=== Missing Fields ==="]
    for report in missing_reports:
        fields = ", ".join(report.missing[:10])
        if len(report.missing) > 10:
            fields += ", ..."
        lines.append(f"{report.path} ({report.entry_id}): {len(report.missing)} missing -> {fields}")
    return "\n".join(lines) + "\n"


def render_atwater(atwater_reports: List[AtwaterIssue]) -> str:
    if not atwater_reports:
        return "All entries pass the Atwater check.\n"
    lines = ["=== Atwater Mismatches ==="]
    for issue in atwater_reports:
        lines.append(
            f"{issue.path} ({issue.entry_id}): recorded={issue.recorded:.2f} kcal, "
            f"computed={issue.computed:.2f} kcal, delta={issue.delta:+.2f} kcal"
        )
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        type=Path,
        default=Path("data/food-data-bank"),
        help="Root directory containing food-bank Markdown files.",
    )
    parser.add_argument(
        "--tolerance",
        type=float,
        default=5.0,
        help="Allowed kcal difference between recorded and computed energy.",
    )
    args = parser.parse_args()

    missing, atwater = audit_food_bank(args.root, args.tolerance)
    print(render_missing(missing))
    print(render_atwater(atwater))


if __name__ == "__main__":
    main()
