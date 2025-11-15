#!/usr/bin/env python3
"""
Set `per_portion.energy_kcal` to the available-carb Atwater result (plus alcohol).

Usage:
    python3 scripts/fix_food_bank_energy.py [--root data/food-data-bank] [--tolerance 5]

Any entry whose recorded kcal differs from the computed value by more than the
specified tolerance will be updated in-place (only the `energy_kcal` line).
"""

from __future__ import annotations

import argparse
import math
import re
from pathlib import Path
from typing import Dict

import yaml


def extract_yaml_block(path: Path) -> dict:
    text = path.read_text()
    match = re.search(r"```yaml\s*(.*?)```", text, flags=re.S)
    if not match:
        raise ValueError(f"No yaml block in {path}")
    return yaml.safe_load(match.group(1))


def compute_energy(per: Dict[str, float], derived: Dict[str, float] | None = None) -> float:
    def num(val):
        return float(val or 0)

    protein = num(per.get("protein_g"))
    fat = num(per.get("fat_g"))
    carbs_available = num(per.get("carbs_available_g"))
    fiber = num(per.get("fiber_total_g"))
    polyols = num(per.get("polyols_g"))

    alcohol_source = per.get("alcohol_g", 0)
    if not alcohol_source and derived:
        alcohol_source = derived.get("alcohol_g", 0)
    alcohol = num(alcohol_source)

    return (
        4 * protein
        + 9 * fat
        + 4 * carbs_available
        + 2 * fiber
        + 2.4 * polyols
        + 7 * alcohol
    )


def format_kcal(value: float) -> str:
    value = round(value, 1)
    if math.isclose(value, round(value)):
        return str(int(round(value)))
    return f"{value:.1f}".rstrip("0").rstrip(".")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        type=Path,
        default=Path("data/food-data-bank"),
        help="Root directory of food bank entries.",
    )
    parser.add_argument(
        "--tolerance",
        type=float,
        default=5.0,
        help="Minimum kcal delta required to trigger an update.",
    )
    args = parser.parse_args()

    updated = 0
    for md_file in sorted(args.root.rglob("*.md")):
        try:
            data = extract_yaml_block(md_file)
        except Exception:
            continue

        per = data.get("per_portion")
        if not isinstance(per, dict):
            continue

        recorded = per.get("energy_kcal")
        if recorded is None:
            continue
        try:
            recorded_val = float(recorded)
        except (TypeError, ValueError):
            continue

        computed = compute_energy(per, data.get("derived") or {})
        if not math.isfinite(computed):
            continue

        delta = abs(recorded_val - computed)
        if delta <= args.tolerance:
            continue

        new_value = format_kcal(computed)
        text = md_file.read_text()
        new_text, count = re.subn(
            r"(energy_kcal:\s*)([-+]?\d*\.?\d+)",
            r"\g<1>" + new_value,
            text,
            count=1,
        )
        if count != 1:
            print(f"[WARN] Could not update {md_file} (energy line not found).")
            continue
        md_file.write_text(new_text)
        updated += 1
        print(f"Updated {md_file}: {recorded_val:.2f} -> {new_value}")

    print(f"\nTotal entries updated: {updated}")


if __name__ == "__main__":
    main()
