#!/usr/bin/env python3
"""
Validate the nutrition Data Bank markdown file:
- Parse YAML code fences
- Check available-carb energy, fat split, sodium<->salt coherence
- Flag missing keys and negative numbers
- Auto-regenerates the index file after validation
Outputs a human-readable summary and a JSON report to stdout.
Requires: pyyaml
"""
import sys, re, json, subprocess
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
        except Exception:
            y = None
        blocks.append((raw, y))
    return blocks

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

    # Cross-check notes for polyol mentions
    notes = y.get("notes", [])
    notes_text = ' '.join(notes) if isinstance(notes, list) else str(notes) if notes else ""
    polyol_pattern = r'\b(\d+\.?\d*)\s*g\b.*?\b(polyol|maltitol|erythritol|xylitol|sorbitol|sugar\s+alcohol)'
    polyol_mentions = re.findall(polyol_pattern, notes_text, re.IGNORECASE)

    # required trees
    for k in ["per_portion", "derived", "quality"]:
        if k not in y:
            issues.append(f"Missing section: {k}")

    pp = y.get("per_portion", {})
    derived = y.get("derived", {})

    # Energy check inputs
    kcal = pp.get("energy_kcal")
    protein = pp.get("protein_g")
    fat = pp.get("fat_g")
    fibre = pp.get("fiber_total_g")
    polyols = pp.get("polyols_g")
    carbs_avail = pp.get("carbs_available_g")
    carbs_total = pp.get("carbs_total_g")

    # Cross-check polyol mentions in notes against polyols_g field
    if polyol_mentions:
        if polyols is None or polyols == 0.0:
            polyol_amounts = [float(m[0]) for m in polyol_mentions]
            warnings.append(
                f"Notes mention polyols ({', '.join(f'{a}g {t}' for a, t in polyol_mentions)}) "
                f"but polyols_g is {polyols}. Consider updating polyols_g field."
            )
        else:
            passes.append(f"Polyol mentions in notes match polyols_g field ({polyols}g).")

    # Zero vs unknown validation for key carb fields
    if carbs_total == 0.0 and carbs_avail is None:
        warnings.append("carbs_total_g is 0.0 but carbs_available_g is null. If confirmed zero-carb, set to 0.0.")
    if polyols == 0.0 and polyol_mentions:
        warnings.append("polyols_g is 0.0 but notes mention polyols. Verify if 0.0 is correct or should be null/actual value.")

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
                    f"Available-carb energy mismatch: stored {kcal} vs est {kcal_est:.1f} "
                    f"(diff {diff:.1f}, {100*diff/max(kcal,1):.1f}%)."
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
    fat_parts = [x for x in [sat, mufa, pufa, trans] if isinstance(x, (int, float))]
    if fat_total is not None and fat_parts:
        parts_sum = sum(fat_parts)
        if parts_sum > fat_total + 0.2:
            warnings.append(f"Fat split ({parts_sum:.2f} g) exceeds total fat ({fat_total:.2f} g) by {parts_sum - fat_total:.2f} g.")
        elif parts_sum < fat_total - 0.5:
            # Fat split is significantly incomplete
            warnings.append(f"Fat split incomplete: {parts_sum:.2f}g accounted for out of {fat_total:.2f}g total (missing {fat_total - parts_sum:.2f}g).")
        elif parts_sum <= fat_total + 0.2:
            passes.append("Fat split coherent (<= total fat).")

    # Sodium->salt
    sodium = pp.get("sodium_mg")
    if isinstance(sodium, (int, float)):
        salt_g = sodium * 2.5 / 1000.0
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

    # Check for critical issues (exit code for CI/CD)
    has_issues = any(res['issues'] for res in report['results'])
    has_warnings = any(res['warnings'] for res in report['results'])

    # Auto-regenerate index after successful validation
    script_dir = Path(__file__).parent
    generate_index_script = script_dir / "generate_index.py"

    if generate_index_script.exists():
        print("\n# Index Generation")
        try:
            result = subprocess.run(
                [sys.executable, str(generate_index_script)],
                capture_output=True,
                text=True,
                check=True
            )
            stdout = result.stdout.strip()
            if stdout:
                print(stdout)
        except subprocess.CalledProcessError as e:
            print(f"Warning: Failed to regenerate index: {e}")
            if e.stderr:
                print(f"stderr: {e.stderr}")
    else:
        print("\nNote: Index generation script not found.")

    # Exit with non-zero status if critical issues found
    if has_issues:
        print("\n# Validation Result: FAILED (critical issues found)")
        sys.exit(1)
    elif has_warnings:
        print("\n# Validation Result: PASSED with warnings")
        sys.exit(0)
    else:
        print("\n# Validation Result: PASSED")
        sys.exit(0)

if __name__ == "__main__":
    main()
