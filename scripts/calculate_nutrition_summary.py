#!/usr/bin/env python3
"""Calculate nutrition totals and averages from daily logs.

By default, analyzes the last 7 days (excluding today).
Usage: python3 calculate_nutrition_summary.py [days]
Example: python3 calculate_nutrition_summary.py 14  # Last 14 days
"""

import sys
import yaml
from pathlib import Path
from collections import defaultdict
from datetime import datetime, timedelta


def load_health_profile_targets():
    """Load target values from health-profile.yaml."""
    health_profile_path = Path("references/health-profile.yaml")

    if not health_profile_path.exists():
        print(f"Error: Health profile not found at {health_profile_path}", file=sys.stderr)
        sys.exit(1)

    try:
        with open(health_profile_path, 'r') as f:
            profile = yaml.safe_load(f)

        # Validate structure
        if not isinstance(profile, dict):
            print(f"Error: Health profile has invalid structure in {health_profile_path}", file=sys.stderr)
            sys.exit(1)

        if 'targets' not in profile:
            print(f"Error: 'targets' section missing in {health_profile_path}", file=sys.stderr)
            sys.exit(1)

        return profile['targets']

    except yaml.YAMLError as e:
        print(f"Error: Failed to parse {health_profile_path}: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: Failed to read health profile from {health_profile_path}: {e}", file=sys.stderr)
        sys.exit(1)


# Get number of days from command line argument (default: 7)
num_days_to_analyze = 7
if len(sys.argv) > 1:
    try:
        num_days_to_analyze = int(sys.argv[1])
        # Validate range (1-365 days)
        if num_days_to_analyze < 1 or num_days_to_analyze > 365:
            print(f"Error: Number of days must be between 1 and 365. Got: {num_days_to_analyze}", file=sys.stderr)
            sys.exit(1)
    except ValueError:
        print(f"Error: Invalid number of days '{sys.argv[1]}'. Must be an integer.", file=sys.stderr)
        sys.exit(1)

# Load health profile targets
targets = load_health_profile_targets()

# Get today's date (excluding today from analysis)
today = datetime.now().date()

# Find all log files
log_dir = Path("data/logs")
log_files_with_dates = []

for year_month_dir in sorted(log_dir.iterdir()):
    if not year_month_dir.is_dir():
        continue

    for log_file in year_month_dir.glob("*.yaml"):
        # Parse date from file structure: data/logs/YYYY-MM/DD.yaml
        try:
            year_month = year_month_dir.name  # e.g., "2025-10"
            day = log_file.stem  # e.g., "30"
            file_date = datetime.strptime(f"{year_month}-{day}", "%Y-%m-%d").date()

            # Exclude today
            if file_date < today:
                log_files_with_dates.append((file_date, log_file))
        except ValueError:
            continue  # Skip files that don't match expected format

# Sort by date (most recent first) and take last X days
log_files_with_dates.sort(reverse=True)
log_files_to_process = log_files_with_dates[:num_days_to_analyze]

# Sort chronologically for processing
log_files_to_process.sort()

if not log_files_to_process:
    print("No log files found to process.")
    sys.exit(1)

# Initialize totals dictionary
totals = defaultdict(float)
counts = defaultdict(int)  # Track non-null counts for averaging
day_types = []  # Track day types for accurate target calculation
dates_processed = []

# Process each log file
for file_date, log_file in log_files_to_process:
    try:
        with open(log_file, 'r') as f:
            data = yaml.safe_load(f)

        # Validate YAML structure
        if not isinstance(data, dict):
            print(f"Warning: Skipping {log_file}: Invalid YAML structure (expected dict, got {type(data).__name__})", file=sys.stderr)
            continue

        # Track day type and date
        day_types.append(data.get('day_type', 'rest'))
        dates_processed.append(file_date)

        # Process each entry
        entries = data.get('entries', [])
        if not isinstance(entries, list):
            print(f"Warning: Skipping entries in {log_file}: 'entries' must be a list (got {type(entries).__name__})", file=sys.stderr)
            continue

        for entry in entries:
            if not isinstance(entry, dict):
                print(f"Warning: Skipping invalid entry in {log_file}: expected dict, got {type(entry).__name__}", file=sys.stderr)
                continue

            # Process each item in the entry
            items = entry.get('items', [])
            if not isinstance(items, list):
                print(f"Warning: Skipping items in entry from {log_file}: 'items' must be a list", file=sys.stderr)
                continue

            for item in items:
                if not isinstance(item, dict):
                    print(f"Warning: Skipping invalid item in {log_file}: expected dict, got {type(item).__name__}", file=sys.stderr)
                    continue

                nutrition = item.get('nutrition', {})
                if not isinstance(nutrition, dict):
                    print(f"Warning: Skipping invalid nutrition data in {log_file}: expected dict, got {type(nutrition).__name__}", file=sys.stderr)
                    continue

                # Sum up all nutrition values
                for key, value in nutrition.items():
                    if value is not None:
                        totals[key] += value
                        counts[key] += 1

    except yaml.YAMLError as e:
        print(f"Warning: Failed to parse {log_file}: {e}", file=sys.stderr)
        continue
    except Exception as e:
        print(f"Warning: Error processing {log_file}: {e}", file=sys.stderr)
        continue

# Check if any valid data was processed
if not dates_processed:
    print("Error: No valid log data found to process after validation.", file=sys.stderr)
    sys.exit(1)

# Calculate averages (divide by number of days actually processed)
num_days = len(dates_processed)
averages = {}
for key, total in totals.items():
    averages[key] = total / num_days

# Format date range for display
date_range = f"{dates_processed[0].strftime('%b %d')} - {dates_processed[-1].strftime('%b %d, %Y')}"
period_label = f"{num_days}-Day"

# Format and print the table
print("\n" + "="*80)
print(f"NUTRITION SUMMARY - {num_days} DAYS ({date_range})")
print("="*80)
print()

# Energy and macros
print("MACRONUTRIENTS")
print("-" * 80)
print(f"{'Nutrient':<30} {f'{period_label} Total':>15} {'Daily Average':>15}")
print("-" * 80)

macro_fields = [
    ('energy_kcal', 'Energy (kcal)'),
    ('protein_g', 'Protein (g)'),
    ('fat_g', 'Fat (g)'),
    ('carbs_total_g', 'Carbohydrates - Total (g)'),
    ('carbs_available_g', 'Carbohydrates - Available (g)'),
    ('fiber_total_g', 'Fiber - Total (g)'),
]

for field, label in macro_fields:
    if field in totals:
        print(f"{label:<30} {totals[field]:>15.1f} {averages[field]:>15.1f}")

print()

# Fat breakdown
print("FAT BREAKDOWN")
print("-" * 80)
print(f"{'Nutrient':<30} {f'{period_label} Total':>15} {'Daily Average':>15}")
print("-" * 80)

fat_fields = [
    ('sat_fat_g', 'Saturated Fat (g)'),
    ('mufa_g', 'MUFA (g)'),
    ('pufa_g', 'PUFA (g)'),
    ('unsat_total_g', 'Unsaturated Fat - Total (g)'),
    ('trans_fat_g', 'Trans Fat (g)'),
    ('cholesterol_mg', 'Cholesterol (mg)'),
]

for field, label in fat_fields:
    if field in totals:
        print(f"{label:<30} {totals[field]:>15.1f} {averages[field]:>15.1f}")

print()

# Carb breakdown
print("CARBOHYDRATE BREAKDOWN")
print("-" * 80)
print(f"{'Nutrient':<30} {f'{period_label} Total':>15} {'Daily Average':>15}")
print("-" * 80)

carb_fields = [
    ('sugar_g', 'Sugar (g)'),
    ('fiber_soluble_g', 'Fiber - Soluble (g)'),
    ('fiber_insoluble_g', 'Fiber - Insoluble (g)'),
    ('polyols_g', 'Polyols (g)'),
]

for field, label in carb_fields:
    if field in totals:
        print(f"{label:<30} {totals[field]:>15.1f} {averages[field]:>15.1f}")

print()

# Minerals
print("MINERALS")
print("-" * 80)
print(f"{'Nutrient':<30} {f'{period_label} Total':>15} {'Daily Average':>15}")
print("-" * 80)

mineral_fields = [
    ('sodium_mg', 'Sodium (mg)'),
    ('potassium_mg', 'Potassium (mg)'),
    ('calcium_mg', 'Calcium (mg)'),
    ('magnesium_mg', 'Magnesium (mg)'),
    ('iron_mg', 'Iron (mg)'),
    ('zinc_mg', 'Zinc (mg)'),
    ('iodine_ug', 'Iodine (μg)'),
    ('manganese_mg', 'Manganese (mg)'),
]

for field, label in mineral_fields:
    if field in totals:
        print(f"{label:<30} {totals[field]:>15.1f} {averages[field]:>15.1f}")

print()

# Vitamins
print("VITAMINS")
print("-" * 80)
print(f"{'Nutrient':<30} {f'{period_label} Total':>15} {'Daily Average':>15}")
print("-" * 80)

vitamin_fields = [
    ('vitamin_c_mg', 'Vitamin C (mg)'),
]

for field, label in vitamin_fields:
    if field in totals:
        print(f"{label:<30} {totals[field]:>15.1f} {averages[field]:>15.1f}")

print()
print("="*80)
print()

# Summary vs targets
print("DAILY AVERAGE vs TARGETS")
print("-" * 80)

# Count day types
num_rest_days = day_types.count('rest')
num_training_days = day_types.count('training')
print(f"Day types: {num_training_days} training, {num_rest_days} rest")
print()

# Calculate average energy target based on actual day types
energy_targets = targets.get('energy_kcal', {})
rest_day_kcal = energy_targets.get('rest_day_max', 2500)
training_day_kcal = energy_targets.get('training_day_max', 2900)
avg_target_kcal = (num_rest_days * rest_day_kcal + num_training_days * training_day_kcal) / num_days
print(f"Energy: {averages.get('energy_kcal', 0):.0f} kcal / {avg_target_kcal:.0f} kcal avg target ({averages.get('energy_kcal', 0) / avg_target_kcal * 100:.0f}%)")

# Protein
if 'protein_g' in averages:
    print(f"Protein: {averages['protein_g']:.1f}g / {targets['protein_g_min']}g min ({averages['protein_g'] / targets['protein_g_min'] * 100:.0f}%)")

# Fat
if 'fat_g' in averages:
    print(f"Fat: {averages['fat_g']:.1f}g / {targets['fat_g_min']}g min ({averages['fat_g'] / targets['fat_g_min'] * 100:.0f}%)")

# Carbs
if 'carbs_total_g' in averages:
    print(f"Carbs: {averages['carbs_total_g']:.1f}g / {targets['carbs_g_min']}g min ({averages['carbs_total_g'] / targets['carbs_g_min'] * 100:.0f}%)")

# Fiber
if 'fiber_total_g' in averages:
    print(f"Fiber: {averages['fiber_total_g']:.1f}g / {targets['fiber_g_min']}g min ({averages['fiber_total_g'] / targets['fiber_g_min'] * 100:.0f}%)")

# Sat fat
if 'sat_fat_g' in averages:
    print(f"Saturated Fat: {averages['sat_fat_g']:.1f}g / {targets['sat_fat_g_max']}g max ({averages['sat_fat_g'] / targets['sat_fat_g_max'] * 100:.0f}%)")

# Sodium
if 'sodium_mg' in averages:
    print(f"Sodium: {averages['sodium_mg']:.0f}mg / {targets['sodium_mg_max']}mg max ({averages['sodium_mg'] / targets['sodium_mg_max'] * 100:.0f}%)")

print("="*80)
