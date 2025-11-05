#!/usr/bin/env python3
"""
Update existing log files to include all 52 nutrient fields.
Adds missing nutrients with value 0 to maintain schema v2 consistency.
"""

import yaml
from pathlib import Path
from datetime import datetime

# All 52 required nutrients in schema v2 (in desired order)
REQUIRED_NUTRIENTS = [
    # Energy & Core Macros
    'energy_kcal', 'protein_g', 'fat_g', 'carbs_total_g', 'carbs_available_g',
    # Fat Breakdown
    'sat_fat_g', 'mufa_g', 'pufa_g', 'trans_fat_g', 'cholesterol_mg',
    # Carb Breakdown
    'sugar_g', 'fiber_total_g', 'fiber_soluble_g', 'fiber_insoluble_g', 'polyols_g',
    # Major Minerals
    'sodium_mg', 'potassium_mg', 'calcium_mg', 'magnesium_mg', 'phosphorus_mg', 'chloride_mg', 'sulfur_g',
    # Trace Minerals
    'iron_mg', 'zinc_mg', 'copper_mg', 'manganese_mg', 'selenium_ug', 'iodine_ug', 'chromium_ug', 'molybdenum_ug',
    # Ultra-trace
    'boron_mg', 'silicon_mg', 'vanadium_ug', 'nickel_ug',
    # Fat-Soluble Vitamins
    'vitamin_a_ug', 'vitamin_d_ug', 'vitamin_e_mg', 'vitamin_k_ug',
    # B-Complex Vitamins
    'vitamin_b1_mg', 'vitamin_b2_mg', 'vitamin_b3_mg', 'vitamin_b5_mg', 'vitamin_b6_mg',
    'vitamin_b7_ug', 'vitamin_b9_ug', 'vitamin_b12_ug', 'choline_mg',
    # Vitamin C
    'vitamin_c_mg',
    # Fatty Acids
    'omega3_epa_mg', 'omega3_dha_mg', 'omega3_ala_g', 'omega6_la_g',
]

def update_nutrition_dict(nutrition):
    """Add missing nutrients to a nutrition dict, maintaining order."""
    # Create new ordered dict with all required nutrients
    updated = {}
    for nutrient in REQUIRED_NUTRIENTS:
        if nutrient in nutrition:
            # Preserve existing value
            updated[nutrient] = nutrition[nutrient]
        else:
            # Add missing nutrient with value 0
            updated[nutrient] = 0
    return updated

def update_log_file(log_path):
    """Update a single log file with new nutrients."""
    print(f"Processing {log_path.name}...")

    # Load YAML
    with open(log_path, 'r') as f:
        data = yaml.safe_load(f)

    if not data or 'entries' not in data:
        print(f"  Skipping - no entries found")
        return False

    updated_items = 0

    # Update each entry
    for entry in data['entries']:
        if 'items' not in entry:
            continue

        for item in entry['items']:
            if 'nutrition' in item:
                original_count = len(item['nutrition'])
                item['nutrition'] = update_nutrition_dict(item['nutrition'])
                new_count = len(item['nutrition'])

                if new_count > original_count:
                    updated_items += 1

    # Write back
    with open(log_path, 'w') as f:
        yaml.dump(data, f, default_flow_style=False, sort_keys=False, allow_unicode=True)

    print(f"  ✓ Updated {updated_items} items")
    return True

def main():
    # Use relative path from script location
    logs_dir = Path(__file__).parent.parent / "data" / "logs"

    # Find all .yaml files
    log_files = sorted(logs_dir.rglob("*.yaml"))

    if not log_files:
        print("No log files found!")
        return

    print(f"Found {len(log_files)} log files to update\n")

    success = 0
    for log_file in log_files:
        if log_file.name == 'SCHEMA.md':
            continue

        try:
            if update_log_file(log_file):
                success += 1
        except Exception as e:
            print(f"  ERROR: {e}")

    print(f"\n{'=' * 80}")
    print(f"Updated {success}/{len(log_files)} log files")
    print(f"{'=' * 80}")

if __name__ == "__main__":
    main()
