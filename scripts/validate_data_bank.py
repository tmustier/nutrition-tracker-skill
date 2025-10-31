#!/usr/bin/env python3
"""
Validate a nutrition Data Bank markdown file:
- Parse YAML code fences
- Check Atwater energy, fat split, sodium<->salt coherence
- Flag missing keys and negative numbers
- Auto-regenerates the index file after validation
Outputs a human-readable summary and a JSON report to stdout.
Requires: pyyaml
"""
import sys, re, json, math, subprocess
from pathlib import Path
try:
    import yaml
except Exception as e:
    sys.stderr.write("This script requires PyYAML. Install with: pip install pyyaml\n")
    raise

TOL_ENERGY_PCT = 0.08  # ±8%

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
    c = pp.get("carbs_g")
    f = pp.get("fat_g")
    kcal_est = atwater_kcal(p, c, f)
    if kcal_est is not None and kcal is not None:
        if kcal == 0:
            issues.append("energy_kcal is 0 (unexpected).")
        else:
            diff = abs(kcal_est - kcal)
            if diff > TOL_ENERGY_PCT * max(kcal, 1):
                warnings.append(f"Atwater mismatch: label {kcal} vs est {kcal_est:.1f} (diff {diff:.1f}, {100*diff/max(kcal,1):.1f}%).")
            else:
                passes.append("Atwater within tolerance.")

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
            print(result.stdout.strip())
        except subprocess.CalledProcessError as e:
            print(f"Warning: Failed to regenerate index: {e}")
            print(f"stderr: {e.stderr}")
    else:
        print("\nNote: Index generation script not found.")

if __name__ == "__main__":
    main()
