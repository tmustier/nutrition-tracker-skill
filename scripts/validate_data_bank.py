#!/usr/bin/env python3
"""
Validate all nutrition dish files in the Data Bank:
- Parse YAML from individual dish files
- Check available-carb energy, fat split, sodium<->salt coherence
- Flag missing keys and negative numbers
- Auto-regenerates the index file after validation
Outputs a human-readable summary and a JSON report to stdout.
Requires: pyyaml
"""
import sys, re, json, subprocess
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor, as_completed
from multiprocessing import cpu_count
try:
    import yaml
except Exception as e:
    sys.stderr.write("This script requires PyYAML. Install with: pip install pyyaml\n")
    raise

# Validation constants with rationale:
# - TOL_ENERGY_PCT: ±8% tolerance for energy calculations to account for rounding in
#   macronutrient values and natural variation in Atwater factors (4-4-9 rule)
# - CARB_TOL_G: 0.2g tolerance for carbohydrate totals to allow for rounding errors
#   when summing available carbs, fiber, and polyols
# - FIBER_KCAL_PER_G: UK/EU convention for fiber energy content (2 kcal/g)
# - POLYOL_KCAL_PER_G: Standard energy value for sugar alcohols/polyols (2.4 kcal/g)
TOL_ENERGY_PCT = 0.08
CARB_TOL_G = 0.2
FIBER_KCAL_PER_G = 2.0
POLYOL_KCAL_PER_G = 2.4

# Required nutrient fields in per_portion - ALL dishes must have these fields
# (0 means TRUE ZERO, not placeholder)
# Schema version 2: Extended to 51 nutrient fields
REQUIRED_NUTRIENTS = [
    # Energy & Core Macronutrients
    'energy_kcal',
    'protein_g',
    'fat_g',
    'carbs_total_g',
    'carbs_available_g',

    # Fat Breakdown
    'sat_fat_g',
    'mufa_g',
    'pufa_g',
    'trans_fat_g',
    'cholesterol_mg',

    # Omega Fatty Acids
    'omega3_ala_g',
    'omega3_dha_mg',
    'omega3_epa_mg',
    'omega6_la_g',

    # Carbohydrate Breakdown
    'sugar_g',
    'fiber_total_g',
    'fiber_soluble_g',
    'fiber_insoluble_g',
    'polyols_g',

    # Major Minerals
    'calcium_mg',
    'chloride_mg',
    'magnesium_mg',
    'phosphorus_mg',
    'potassium_mg',
    'sodium_mg',
    'sulfur_g',

    # Trace Minerals
    'chromium_ug',
    'copper_mg',
    'iodine_ug',
    'iron_mg',
    'manganese_mg',
    'molybdenum_ug',
    'selenium_ug',
    'zinc_mg',

    # Ultra-Trace Elements
    'boron_mg',
    'nickel_ug',
    'silicon_mg',
    'vanadium_ug',

    # Fat-Soluble Vitamins
    'vitamin_a_ug',
    'vitamin_d_ug',
    'vitamin_e_mg',
    'vitamin_k_ug',

    # B-Complex Vitamins
    'choline_mg',
    'vitamin_b1_mg',
    'vitamin_b2_mg',
    'vitamin_b3_mg',
    'vitamin_b5_mg',
    'vitamin_b6_mg',
    'vitamin_b7_ug',
    'vitamin_b9_ug',
    'vitamin_b12_ug',

    # Vitamin C
    'vitamin_c_mg',
]

# Compile polyol detection regex once at module level (performance optimization)
# This pattern matches polyol mentions in notes like:
#   - "Contains 2.5 g of maltitol"
#   - "15g polyols"
#   - "Sugar alcohol: 3.2 g"
#
# Pattern breakdown:
#   - \b(\d+\.?\d*)\s*g\b  : Captures amount with 'g' unit (e.g., "2.5 g", "15g")
#   - .*?                  : Non-greedy match of any text between amount and polyol term
#   - \b(polyol|...)       : Captures polyol type keyword
#
# Known limitations (edge cases this pattern may miss):
#   - Amounts without explicit 'g' unit: "contains 5 polyols"
#   - Alternative formats: "polyol content: 2.5" or "2.5% polyols"
#   - Spelled-out numbers: "two grams of maltitol"
#   - Multiple polyol types in one phrase: "1.5g maltitol and 1g erythritol"
#   - Reversed order: "erythritol 2.5g" (pattern expects amount before polyol term)
#
# Future improvements: Consider adding reversed pattern or unit-optional matching
POLYOL_PATTERN = re.compile(
    r'\b(\d+\.?\d*)\s*g\b.*?\b(polyol|maltitol|erythritol|xylitol|sorbitol|sugar\s+alcohol)',
    re.IGNORECASE
)


def parse_yaml_from_file(filepath):
    """Parse YAML block from a dish markdown file.

    Returns: (raw_yaml_text, parsed_dict) or (None, None) if parsing fails
    """
    try:
        content = filepath.read_text(encoding='utf-8')

        # Find YAML block
        yaml_start = content.index('```yaml') + 7
        yaml_end = content.index('```', yaml_start)
        yaml_text = content[yaml_start:yaml_end].strip()

        # Parse YAML
        data = yaml.safe_load(yaml_text)

        return (yaml_text, data)
    except Exception as e:
        print(f"Warning: Failed to parse {filepath.name}: {e}", file=sys.stderr)
        return (None, None)


def scan_data_bank(data_bank_dir):
    """Scan data bank directory and return all dish files.

    Returns: list of (filepath, raw_yaml, parsed_dict) tuples
    """
    blocks = []

    # Find all .md files recursively
    for filepath in sorted(data_bank_dir.rglob('*.md')):
        # Skip README and RESEARCH files
        if filepath.name in ['README.md', 'RESEARCH.md', 'index.md']:
            continue

        raw, data = parse_yaml_from_file(filepath)
        if data and isinstance(data, dict) and 'id' in data:
            blocks.append((filepath, raw, data))

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


def check_block(y, filepath):
    """Validate a single dish block.

    Returns: dict with 'id', 'filepath', 'issues', 'warnings', 'passes'
    """
    issues = []
    warnings = []
    passes = []

    if not isinstance(y, dict) or "id" not in y:
        issues.append("Block missing top-level mapping or 'id'.")
        return {
            "id": None,
            "filepath": str(filepath),
            "issues": issues,
            "warnings": warnings,
            "passes": passes
        }

    bid = y.get("id")

    # Cross-check notes for polyol mentions
    notes = y.get("notes", [])
    # Handle notes as list of strings, list of dicts, or a single string
    if isinstance(notes, list):
        notes_text = ' '.join(str(n) if not isinstance(n, dict) else n.get('note', '') for n in notes)
    else:
        notes_text = str(notes) if notes else ""
    polyol_mentions = POLYOL_PATTERN.findall(notes_text)

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

    # Completeness check - ensure all required fields are present
    for required_field in REQUIRED_NUTRIENTS:
        if required_field not in pp:
            issues.append(f"Missing required field in per_portion: {required_field}")

    # Negative checks
    for key, val in pp.items():
        if isinstance(val, (int, float)) and val < 0:
            issues.append(f"Negative per_portion value: {key} = {val}")

    # Null checks - NO nulls allowed in per_portion (all values must be 0 or positive)
    for key, val in pp.items():
        if val is None:
            issues.append(f"NULL value not allowed in per_portion: {key} must be 0 or a positive number")

    # Type validation - nutrient fields must be numeric (int or float)
    for key, val in pp.items():
        if val is not None and not isinstance(val, (int, float)):
            issues.append(f"Invalid type for {key}: expected number, got {type(val).__name__} (value: {val})")

    return {
        "id": bid,
        "filepath": str(filepath),
        "issues": issues,
        "warnings": warnings,
        "passes": passes
    }


def process_single_file(filepath):
    """Process a single file for parallel execution.

    Returns: validation result dict or None if parsing fails
    """
    raw, data = parse_yaml_from_file(filepath)
    if data and isinstance(data, dict) and 'id' in data:
        return check_block(data, filepath)
    return None


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Validate all nutrition dish files in the Data Bank")
    parser.add_argument("data_bank_dir", nargs='?', default=None, help="Path to the data bank directory (default: data/food-data-bank)")
    parser.add_argument("--no-index", action="store_true", help="Skip automatic index regeneration")
    parser.add_argument("--parallel", action="store_true", help="Use parallel processing for validation (faster for large food banks)")
    parser.add_argument("--jobs", type=int, default=None, help="Number of parallel jobs (default: CPU count)")
    args = parser.parse_args()

    # Determine path
    if args.data_bank_dir:
        path = Path(args.data_bank_dir)
    else:
        script_dir = Path(__file__).parent
        path = script_dir.parent / 'data' / 'food-data-bank'

    if not path.exists():
        print(f"Error: Data bank directory not found: {path}", file=sys.stderr)
        return 1

    print(f"Scanning: {path}")

    # Find all dish files
    dish_files = []
    for filepath in sorted(path.rglob('*.md')):
        if filepath.name not in ['README.md', 'RESEARCH.md', 'index.md']:
            dish_files.append(filepath)

    report = {"directory": str(path), "checked": 0, "results": []}

    # Process files (parallel or sequential)
    if args.parallel:
        # Parallel processing
        max_workers = args.jobs if args.jobs else cpu_count()
        print(f"Using parallel processing with {max_workers} workers...")

        with ProcessPoolExecutor(max_workers=max_workers) as executor:
            # Submit all files for processing
            future_to_file = {executor.submit(process_single_file, fp): fp for fp in dish_files}

            # Collect results as they complete
            for future in as_completed(future_to_file):
                result = future.result()
                if result:
                    report["results"].append(result)
                    report["checked"] += 1
    else:
        # Sequential processing (original behavior)
        blocks = scan_data_bank(path)
        for filepath, raw, y in blocks:
            res = check_block(y, filepath)
            report["results"].append(res)
            report["checked"] += 1

    # Human summary
    print("\n" + "=" * 80)
    print("DATA BANK VALIDATION REPORT")
    print("=" * 80)
    print(f"Directory: {path}")
    print(f"Dishes checked: {report['checked']}")
    print()

    for res in report["results"]:
        print(f"## {res['id']}")
        print(f"   File: {res['filepath']}")
        for p in res["passes"]:
            print(f"  ✓ PASS: {p}")
        for w in res["warnings"]:
            print(f"  ⚠ WARN: {w}")
        for i in res["issues"]:
            print(f"  ✗ FAIL: {i}")
        print()

    print("=" * 80)
    print("JSON REPORT")
    print("=" * 80)
    print(json.dumps(report, indent=2))

    # Check for critical issues (exit code for CI/CD)
    has_issues = any(res['issues'] for res in report['results'])
    has_warnings = any(res['warnings'] for res in report['results'])

    # Auto-regenerate index after successful validation (unless --no-index is specified)
    if not args.no_index:
        script_dir = Path(__file__).parent
        generate_index_script = script_dir / "generate_index.py"

        if generate_index_script.exists():
            print("\n" + "=" * 80)
            print("INDEX GENERATION")
            print("=" * 80)
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
    else:
        print("\n# Index regeneration skipped (--no-index flag)")

    # Exit with non-zero status if critical issues found
    print("\n" + "=" * 80)
    if has_issues:
        print("VALIDATION RESULT: FAILED (critical issues found)")
        print("=" * 80)
        sys.exit(1)
    elif has_warnings:
        print("VALIDATION RESULT: PASSED with warnings")
        print("=" * 80)
        sys.exit(0)
    else:
        print("VALIDATION RESULT: PASSED")
        print("=" * 80)
        sys.exit(0)


if __name__ == "__main__":
    main()
