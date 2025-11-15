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
import tempfile
from pathlib import Path
from typing import Dict

import yaml


def extract_yaml_block(path: Path) -> dict:
    text = path.read_text(encoding='utf-8')
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

    alcohol_g = per.get("alcohol_g")
    if alcohol_g is None and derived:
        alcohol_g = derived.get("alcohol_g")
    alcohol = num(alcohol_g)

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


def atomic_write_file(file_path: Path, content: str) -> None:
    """Write content to file atomically using temp file + rename."""
    temp_file = None
    try:
        # Create temp file in same directory to ensure atomic move
        with tempfile.NamedTemporaryFile(
            mode='w', 
            dir=file_path.parent, 
            delete=False,
            encoding='utf-8',
            suffix='.tmp'
        ) as f:
            f.write(content)
            temp_file = Path(f.name)
        
        # Atomic move
        temp_file.rename(file_path)
        temp_file = None
        
    except Exception as e:
        # Clean up temp file on error
        if temp_file and temp_file.exists():
            temp_file.unlink()
        raise RuntimeError(f"Failed to write {file_path}: {e}") from e


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
    skipped = 0
    for md_file in sorted(args.root.rglob("*.md")):
        try:
            data = extract_yaml_block(md_file)
        except (ValueError, yaml.YAMLError) as e:
            print(f"[WARN] Skipping {md_file}: {e}")
            skipped += 1
            continue
        except Exception as e:
            print(f"[ERROR] Unexpected error reading {md_file}: {e}")
            skipped += 1
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
        try:
            text = md_file.read_text(encoding='utf-8')
            # Anchor the regex to ensure we're matching the field name, not comments
            new_text, count = re.subn(
                r"(\benergy_kcal:\s*)([-+]?\d*\.?\d+)",
                r"\g<1>" + new_value,
                text,
                count=1,
            )
            if count != 1:
                print(f"[WARN] Could not update {md_file} (energy_kcal field not found).")
                continue
            
            # Use atomic write
            atomic_write_file(md_file, new_text)
            updated += 1
            print(f"Updated {md_file}: {recorded_val:.2f} -> {new_value}")
        except Exception as e:
            print(f"[ERROR] Failed to update {md_file}: {e}")
            continue

    print(f"\nTotal entries updated: {updated}")
    if skipped > 0:
        print(f"Skipped files (errors): {skipped}")


if __name__ == "__main__":
    main()
