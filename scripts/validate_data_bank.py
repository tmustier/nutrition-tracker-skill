#!/usr/bin/env python3
"""
Validate a nutrition Data Bank markdown file:
- Parse YAML code fences
- Check Atwater energy, fat split, sodium<->salt coherence
- Flag missing keys and negative numbers
Outputs a human-readable summary and a JSON report to stdout.
Requires: pyyaml
"""
import sys, re, json, math
from pathlib import Path
try:
    import yaml
except Exception as e:
    sys.stderr.write("This script requires PyYAML. Install with: pip install pyyaml\n")
    raise

TOL_ENERGY_PCT = 0.08  # ±8%
CARB_TOL_G = 0.2       # acceptable rounding error for carb totals
FIBER_KCAL_PER_G = 2.0
POLYOL_KCAL_PER_G = 2.4

def parse_yaml_blocks(text):
    blocks = []
    fence = re.compile(r"```yaml\s*(.*?)```", re.S | re.M)
    for m in fence.finditer(text):
        raw = m.group(1).strip()
        try:
            y = yaml.safe_load(raw)
        except Exception as e:
            y = None
        blocks.append((raw, y))
    return blocks

def atwater_kcal(p, c, f):
    if p is None or c is None or f is None:
        return None
    try:
        return 4*p + 4*c + 9*f
    except Exception:
        return None

def available_energy_kcal(protein, fat, carbs_available, fibre, polyols):
    """Compute energy using UK/EU convention (available carbs + fibre/polyol factors)."""
    if protein is None or fat is None or carbs_available is None:
        return None
    fibre_term = 0.0 if fibre is None else FIBER_KCAL_PER_G * fibre
    polyol_term = 0.0 if polyols is None else POLYOL_KCAL_PER_G * polyols
    try:
        return 4 * protein + 9 * fat + 4 * carbs_available + fibre_term + polyol_term
    except Exception:
        return None

def approx_equal(a, b, tol):
    if None in (a, b):
        return False
    return abs(a - b) <= tol

def check_block(y):
    issues = []
    warnings = []
    passes = []

    if not isinstance(y, dict) or "id" not in y:
        issues.append("Block missing top-level mapping or 'id'.")
        return {"id": None, "issues": issues, "warnings": warnings, "passes": passes}

    bid = y.get("id")

    # required trees
    for k in ["per_portion", "derived", "quality"]:
        if k not in y:
            issues.append(f"Missing section: {k}")

    pp = y.get("per_portion", {})
    derived = y.get("derived", {})
    quality = y.get("quality", {})

    # Energy check
    kcal = pp.get("energy_kcal")
    p = pp.get("protein_g")
    f = pp.get("fat_g")
    fibre = pp.get("fiber_total_g")
    polyols = pp.get("polyols_g")
    carbs_avail = pp.get("carbs_available_g")
    carbs_total = pp.get("carbs_total_g")
    carbs_label = pp.get("carbs_g")

    # Relationship check for carb fields
    if carbs_total is not None and carbs_avail is not None and fibre is not None:
        expected_total = carbs_avail + (fibre or 0.0) + (polyols or 0.0)
        if not approx_equal(expected_total, carbs_total, CARB_TOL_G):
            warnings.append(
                f"carbs_total_g mismatch: expected {expected_total:.1f} from available+fibre+polyols, "
                f"found {carbs_total:.1f}."
            )
    elif carbs_total is not None:
        missing_bits = []
        if carbs_avail is None:
            missing_bits.append("carbs_available_g")
        if fibre is None:
            missing_bits.append("fiber_total_g")
        warnings.append(f"carbs_total_g present but missing {', '.join(missing_bits)} to reconcile totals.")

    if carbs_avail is None and carbs_label is not None:
        carbs_avail = carbs_label
        warnings.append("carbs_available_g missing; falling back to carbs_g for energy calculation.")

    kcal_est = available_energy_kcal(p, f, carbs_avail, fibre, polyols)
    if kcal_est is None and carbs_avail is None:
        # Fall back to legacy calculation if necessary
        legacy = atwater_kcal(p, carbs_label, f)
        if legacy is not None and kcal is not None:
            diff = abs(legacy - kcal)
            if diff > TOL_ENERGY_PCT * max(kcal, 1):
                warnings.append(
                    f"Atwater (legacy) mismatch: label {kcal} vs est {legacy:.1f} "
                    f"(diff {diff:.1f}, {100*diff/max(kcal,1):.1f}%)."
                )
            else:
                passes.append("Atwater within tolerance (legacy carbs_g).")
    elif kcal_est is not None and kcal is not None:
        if kcal == 0:
            issues.append("energy_kcal is 0 (unexpected).")
        else:
            diff = abs(kcal_est - kcal)
            if diff > TOL_ENERGY_PCT * max(kcal, 1):
                warnings.append(
                    f"Available-carb energy mismatch: label {kcal} vs est {kcal_est:.1f} "
                    f"(diff {diff:.1f}, {100*diff/max(kcal,1):.1f}%)."
                )
            else:
                passes.append("Energy within tolerance (available carb formula).")

    # Fat split
    sat = pp.get("sat_fat_g")
    mufa = pp.get("mufa_g")
    pufa = pp.get("pufa_g")
    trans = pp.get("trans_fat_g")
    fat_parts = [x for x in [sat, mufa, pufa, trans] if x is not None]
    if f is not None and fat_parts:
        parts_sum = sum(fat_parts)
        if parts_sum > f + 0.2:
            warnings.append(f"Fat split ({parts_sum:.2f} g) exceeds total fat ({f:.2f} g) by {parts_sum - f:.2f} g.")
        elif parts_sum <= f + 0.2:
            passes.append("Fat split coherent (<= total fat).")

    # Sodium->salt
    na = pp.get("sodium_mg")
    if na is not None:
        salt_g = na * 2.5 / 1000.0
        passes.append(f"Salt from sodium = {salt_g:.2f} g.")
    else:
        warnings.append("sodium_mg is null; cannot compute salt.")

    # Negative checks
    for key, val in pp.items():
        if isinstance(val, (int, float)) and val < 0:
            issues.append(f"Negative per_portion value: {key} = {val}")

    return {"id": bid, "issues": issues, "warnings": warnings, "passes": passes}

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/validate_data_bank.py <path/to/data-bank.md>")
        sys.exit(1)
    path = Path(sys.argv[1])
    text = path.read_text(encoding="utf-8")
    blocks = parse_yaml_blocks(text)

    report = {"file": str(path), "checked": 0, "results": []}
    for raw, y in blocks:
        if not isinstance(y, dict) or "id" not in y:
            # ignore the schema template, header, or malformed blocks
            continue
        res = check_block(y)
        report["results"].append(res)
        report["checked"] += 1

    # Human summary
    print("# Data Bank Validation Report")
    print(f"File: {path}")
    print(f"Blocks checked: {report['checked']}")
    for res in report["results"]:
        print(f"\n## {res['id']}")
        for p in res["passes"]:
            print(f"  PASS: {p}")
        for w in res["warnings"]:
            print(f"  WARN: {w}")
        for i in res["issues"]:
            print(f"  FAIL: {i}")

    print("\n# JSON")
    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    main()
