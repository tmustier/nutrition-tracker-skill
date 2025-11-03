#!/usr/bin/env python3
"""Validate the per-dish nutrition YAML files."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, Iterable, List

try:
    import yaml
except ImportError as exc:  # pragma: no cover - configuration error
    sys.stderr.write("PyYAML is required. Install with: pip install pyyaml\n")
    raise

# Energy tolerances and constants reused by unit tests
TOL_ENERGY_PCT = 0.08  # ±8%
CARB_TOL_G = 0.2       # acceptable rounding error for carb totals
FIBER_KCAL_PER_G = 2.0
POLYOL_KCAL_PER_G = 2.4

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DISHES_ROOT = PROJECT_ROOT / "data" / "dishes"
DEFAULT_VENUES_CONFIG = DEFAULT_DISHES_ROOT / "venues.yaml"
DEFAULT_INDEX_SCRIPT = PROJECT_ROOT / "scripts" / "generate_index.py"


def available_energy_kcal(protein, fat, carbs_available, fibre, polyols):
    """Compute energy using UK/EU convention (available carbs + fibre/polyols).

    Re-exported for unit tests.
    """
    if protein is None or fat is None or carbs_available is None:
        return None
    fibre_term = 0.0 if fibre is None else FIBER_KCAL_PER_G * fibre
    polyol_term = 0.0 if polyols is None else POLYOL_KCAL_PER_G * polyols
    try:
        return 4 * protein + 9 * fat + 4 * carbs_available + fibre_term + polyol_term
    except Exception:
        return None


def approx_equal(a, b, tol):
    """Return True when |a-b| <= tol; treats None as unequal."""
    if None in (a, b):
        return False
    return abs(a - b) <= tol


def check_block(y):
    """Validate a single dish record (dict). Keeps backwards-compatible output."""
    issues: List[str] = []
    warnings: List[str] = []
    passes: List[str] = []

    if not isinstance(y, dict) or "id" not in y:
        issues.append("Block missing top-level mapping or 'id'.")
        return {"id": None, "issues": issues, "warnings": warnings, "passes": passes}

    bid = y.get("id")

    # required sections
    for key in ("per_portion", "derived", "quality"):
        if key not in y:
            issues.append(f"Missing section: {key}")

    pp = y.get("per_portion", {}) if isinstance(y.get("per_portion"), dict) else {}

    # Energy check inputs
    kcal = pp.get("energy_kcal")
    protein = pp.get("protein_g")
    fat = pp.get("fat_g")
    fibre = pp.get("fiber_total_g")
    polyols = pp.get("polyols_g")
    carbs_avail = pp.get("carbs_available_g")
    carbs_total = pp.get("carbs_total_g")

    # Relationship check for carbs
    if carbs_total is not None and carbs_avail is not None and fibre is not None:
        polyols_value = polyols or 0.0
        expected_total = carbs_avail + (fibre or 0.0) + polyols_value
        if not approx_equal(expected_total, carbs_total, CARB_TOL_G):
            warnings.append(
                "carbs_total_g mismatch: expected "
                f"{expected_total:.1f} from available+fibre+polyols, found {carbs_total:.1f}."
            )
    elif carbs_total is not None:
        missing_bits = []
        if carbs_avail is None:
            missing_bits.append("carbs_available_g")
        if fibre is None:
            missing_bits.append("fiber_total_g")
        warnings.append(
            "carbs_total_g present but missing " + ", ".join(missing_bits) + " to reconcile totals."
        )

    if carbs_avail is None:
        issues.append("Missing carbs_available_g; cannot compute available-carb energy.")

    kcal_est = available_energy_kcal(
        protein if isinstance(protein, (int, float)) else None,
        fat if isinstance(fat, (int, float)) else None,
        carbs_avail if isinstance(carbs_avail, (int, float)) else None,
        fibre if isinstance(fibre, (int, float)) else None,
        polyols if isinstance(polyols, (int, float)) else None,
    )
    if kcal_est is not None and isinstance(kcal, (int, float)):
        if kcal == 0:
            issues.append("energy_kcal is 0 (unexpected).")
        else:
            diff = abs(kcal_est - kcal)
            if diff > TOL_ENERGY_PCT * max(kcal, 1):
                issues.append(
                    "Available-carb energy mismatch: stored "
                    f"{kcal} vs est {kcal_est:.1f} (diff {diff:.1f}, {100 * diff / max(kcal, 1):.1f}%)."
                )
            else:
                passes.append("Energy within tolerance (available carb formula).")
    elif isinstance(kcal, (int, float)) and carbs_avail is not None:
        issues.append("Unable to compute energy: missing protein, fat, or fibre/polyol inputs.")

    # Fat split
    fat_total = fat if isinstance(fat, (int, float)) else None
    sat = pp.get("sat_fat_g")
    mufa = pp.get("mufa_g")
    pufa = pp.get("pufa_g")
    trans = pp.get("trans_fat_g")
    fat_parts = [x for x in (sat, mufa, pufa, trans) if isinstance(x, (int, float))]
    if fat_total is not None and fat_parts:
        parts_sum = sum(fat_parts)
        if parts_sum > fat_total + 0.2:
            warnings.append(
                f"Fat split ({parts_sum:.2f} g) exceeds total fat ({fat_total:.2f} g) by {parts_sum - fat_total:.2f} g."
            )
        else:
            passes.append("Fat split coherent (<= total fat).")

    # Sodium → salt
    sodium = pp.get("sodium_mg")
    if isinstance(sodium, (int, float)):
        salt_g = sodium * 2.5 / 1000.0
        passes.append(f"Salt from sodium = {salt_g:.2f} g.")
    else:
        warnings.append("sodium_mg is null; cannot compute salt.")

    # Negatives
    for key, val in pp.items():
        if isinstance(val, (int, float)) and val < 0:
            issues.append(f"Negative per_portion value: {key} = {val}")

    return {"id": bid, "issues": issues, "warnings": warnings, "passes": passes}


def iter_dish_files(root: Path) -> Iterable[Path]:
    """Yield per-dish YAML files under the given root."""
    for path in sorted(root.rglob("*.yaml")):
        parts = path.relative_to(root).parts
        if not parts:
            continue
        if parts[0] not in {"venues", "generic"}:
            continue
        yield path


def load_dish(path: Path) -> Dict:
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    if not isinstance(data, dict):
        raise ValueError(f"Dish file {path} is not a mapping")
    return data


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate per-dish YAML files")
    parser.add_argument(
        "dishes_root",
        nargs="?",
        default=DEFAULT_DISHES_ROOT,
        type=Path,
        help="Directory containing per-dish YAML files (default: data/dishes)",
    )
    parser.add_argument(
        "--venues-config",
        type=Path,
        default=DEFAULT_VENUES_CONFIG,
        help="Venue configuration file passed to index generation",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    dishes_root: Path = args.dishes_root

    if not dishes_root.exists():
        sys.stderr.write(f"Dishes root not found: {dishes_root}\n")
        return 1

    report = {"root": str(dishes_root), "checked": 0, "results": []}

    print("# Data Bank Validation Report")
    print(f"Dishes root: {dishes_root}")

    for dish_path in iter_dish_files(dishes_root):
        try:
            dish = load_dish(dish_path)
        except Exception as exc:
            print(f"\n## ERROR parsing {dish_path}")
            print(f"  FAIL: {exc}")
            report["results"].append({
                "id": None,
                "name": None,
                "path": str(dish_path.relative_to(dishes_root)),
                "issues": [str(exc)],
                "warnings": [],
                "passes": [],
            })
            report["checked"] += 1
            continue

        res = check_block(dish)
        name = dish.get("name") or res.get("id")
        rel_path = dish_path.relative_to(dishes_root)
        print(f"\n## {name} ({res.get('id')})")
        print(f"File: {rel_path}")
        for item in res.get("passes", []):
            print(f"  PASS: {item}")
        for item in res.get("warnings", []):
            print(f"  WARN: {item}")
        for item in res.get("issues", []):
            print(f"  FAIL: {item}")

        report["results"].append({
            "id": res.get("id"),
            "name": name,
            "path": str(rel_path),
            "issues": res.get("issues", []),
            "warnings": res.get("warnings", []),
            "passes": res.get("passes", []),
        })
        report["checked"] += 1

    print("\n# JSON")
    print(json.dumps(report, indent=2))

    if DEFAULT_INDEX_SCRIPT.exists():
        print("\n# Index Generation")
        cmd = [
            sys.executable,
            str(DEFAULT_INDEX_SCRIPT),
            "--dishes-root",
            str(dishes_root),
        ]
        if args.venues_config:
            cmd.extend(["--venues-config", str(args.venues_config)])
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            if result.stdout.strip():
                print(result.stdout.strip())
            if result.stderr.strip():
                print(result.stderr.strip())
        except subprocess.CalledProcessError as exc:
            print(f"Failed to regenerate index: {exc}")
            if exc.stderr:
                print(exc.stderr)
    else:
        print("\nNote: generate_index.py not found; skipped index regeneration.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
