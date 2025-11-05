#!/usr/bin/env python3
"""Calculate nutrition totals and averages from daily logs.

By default, analyzes the last 7 days (including today).
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

# Get today's date (including today in analysis)
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

            # Include up to and including today
            if file_date <= today:
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

# Helper function for progressive disclosure
def should_display_nutrient(field, totals, targets):
    """Display nutrient if it has non-zero value OR has a defined target."""
    if field in totals and totals[field] > 0:
        return True
    # Check if field has any target defined (min, max, or exact)
    if field in targets:
        return True
    # Check for special target structures
    base_field = field.replace('_kcal', '').replace('_g', '').replace('_mg', '').replace('_ug', '')
    if base_field in targets:
        return True
    return False

def print_section(title, fields, totals, averages, targets, period_label):
    """Print a nutrition section with progressive disclosure."""
    # Filter fields to display
    fields_to_display = [(field, label) for field, label in fields
                         if should_display_nutrient(field, totals, targets)]

    if not fields_to_display:
        return  # Skip empty sections

    print(title)
    print("-" * 80)
    print(f"{'Nutrient':<30} {f'{period_label} Total':>15} {'Daily Average':>15}")
    print("-" * 80)

    for field, label in fields_to_display:
        if field in totals:
            print(f"{label:<30} {totals[field]:>15.1f} {averages[field]:>15.1f}")

    print()

# Define all nutrient sections
macro_fields = [
    ('energy_kcal', 'Energy (kcal)'),
    ('protein_g', 'Protein (g)'),
    ('fat_g', 'Fat (g)'),
    ('carbs_total_g', 'Carbohydrates - Total (g)'),
    ('carbs_available_g', 'Carbohydrates - Available (g)'),
    ('fiber_total_g', 'Fiber - Total (g)'),
]

fat_fields = [
    ('sat_fat_g', 'Saturated Fat (g)'),
    ('mufa_g', 'MUFA (g)'),
    ('pufa_g', 'PUFA (g)'),
    ('trans_fat_g', 'Trans Fat (g)'),
    ('cholesterol_mg', 'Cholesterol (mg)'),
]

carb_fields = [
    ('sugar_g', 'Sugar (g)'),
    ('fiber_soluble_g', 'Fiber - Soluble (g)'),
    ('fiber_insoluble_g', 'Fiber - Insoluble (g)'),
    ('polyols_g', 'Polyols (g)'),
]

minerals_major_fields = [
    ('sodium_mg', 'Sodium (mg)'),
    ('potassium_mg', 'Potassium (mg)'),
    ('calcium_mg', 'Calcium (mg)'),
    ('magnesium_mg', 'Magnesium (mg)'),
    ('phosphorus_mg', 'Phosphorus (mg)'),
    ('chloride_mg', 'Chloride (mg)'),
    ('sulfur_g', 'Sulfur (g)'),
]

minerals_trace_fields = [
    ('iron_mg', 'Iron (mg)'),
    ('zinc_mg', 'Zinc (mg)'),
    ('copper_mg', 'Copper (mg)'),
    ('manganese_mg', 'Manganese (mg)'),
    ('selenium_ug', 'Selenium (μg)'),
    ('iodine_ug', 'Iodine (μg)'),
    ('chromium_ug', 'Chromium (μg)'),
    ('molybdenum_ug', 'Molybdenum (μg)'),
]

minerals_ultratrace_fields = [
    ('boron_mg', 'Boron (mg)'),
    ('silicon_mg', 'Silicon (mg)'),
    ('vanadium_ug', 'Vanadium (μg)'),
    ('nickel_ug', 'Nickel (μg)'),
]

vitamins_b_complex_fields = [
    ('vitamin_b1_mg', 'Vitamin B1 - Thiamin (mg)'),
    ('vitamin_b2_mg', 'Vitamin B2 - Riboflavin (mg)'),
    ('vitamin_b3_mg', 'Vitamin B3 - Niacin (mg)'),
    ('vitamin_b5_mg', 'Vitamin B5 - Pantothenic Acid (mg)'),
    ('vitamin_b6_mg', 'Vitamin B6 - Pyridoxine (mg)'),
    ('vitamin_b7_ug', 'Vitamin B7 - Biotin (μg)'),
    ('vitamin_b9_ug', 'Vitamin B9 - Folate (μg)'),
    ('vitamin_b12_ug', 'Vitamin B12 - Cobalamin (μg)'),
    ('choline_mg', 'Choline (mg)'),
]

vitamins_fat_soluble_fields = [
    ('vitamin_a_ug', 'Vitamin A (μg)'),
    ('vitamin_d_ug', 'Vitamin D (μg)'),
    ('vitamin_e_mg', 'Vitamin E (mg)'),
    ('vitamin_k_ug', 'Vitamin K (μg)'),
    ('vitamin_c_mg', 'Vitamin C (mg)'),
]

fatty_acids_omega_fields = [
    ('omega3_epa_mg', 'Omega-3 EPA (mg)'),
    ('omega3_dha_mg', 'Omega-3 DHA (mg)'),
    ('omega3_ala_g', 'Omega-3 ALA (g)'),
    ('omega6_la_g', 'Omega-6 LA (g)'),
]

# Print all sections with progressive disclosure
print_section("MACRONUTRIENTS", macro_fields, totals, averages, targets, period_label)
print_section("FAT BREAKDOWN", fat_fields, totals, averages, targets, period_label)
print_section("CARBOHYDRATE BREAKDOWN", carb_fields, totals, averages, targets, period_label)
print_section("MINERALS (Major)", minerals_major_fields, totals, averages, targets, period_label)
print_section("MINERALS (Trace)", minerals_trace_fields, totals, averages, targets, period_label)
print_section("MINERALS (Ultra-trace)", minerals_ultratrace_fields, totals, averages, targets, period_label)
print_section("VITAMINS (B-Complex)", vitamins_b_complex_fields, totals, averages, targets, period_label)
print_section("VITAMINS (Fat-Soluble)", vitamins_fat_soluble_fields, totals, averages, targets, period_label)
print_section("FATTY ACIDS (Omega)", fatty_acids_omega_fields, totals, averages, targets, period_label)

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
