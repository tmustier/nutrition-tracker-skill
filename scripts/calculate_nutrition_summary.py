#!/usr/bin/env python3
"""Calculate nutrition totals and averages from daily logs."""

import yaml
from pathlib import Path
from collections import defaultdict

# Files to process (excluding today - Nov 3)
log_files = [
    "data/logs/2025-10/30.yaml",
    "data/logs/2025-10/31.yaml",
    "data/logs/2025-11/01.yaml",
    "data/logs/2025-11/02.yaml",
]

# Initialize totals dictionary
totals = defaultdict(float)
counts = defaultdict(int)  # Track non-null counts for averaging
day_types = []  # Track day types for accurate target calculation

# Process each log file
for log_file in log_files:
    with open(log_file, 'r') as f:
        data = yaml.safe_load(f)

    # Track day type
    day_types.append(data.get('day_type', 'rest'))

    # Process each entry
    for entry in data.get('entries', []):
        # Process each item in the entry
        for item in entry.get('items', []):
            nutrition = item.get('nutrition', {})

            # Sum up all nutrition values
            for key, value in nutrition.items():
                if value is not None:
                    totals[key] += value
                    counts[key] += 1

# Calculate averages (divide by number of days)
num_days = len(log_files)
averages = {}
for key, total in totals.items():
    averages[key] = total / num_days

# Format and print the table
print("\n" + "="*80)
print("NUTRITION SUMMARY - 4 DAYS (Oct 30 - Nov 2, 2025)")
print("="*80)
print()

# Energy and macros
print("MACRONUTRIENTS")
print("-" * 80)
print(f"{'Nutrient':<30} {'4-Day Total':>15} {'Daily Average':>15}")
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
print(f"{'Nutrient':<30} {'4-Day Total':>15} {'Daily Average':>15}")
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
print(f"{'Nutrient':<30} {'4-Day Total':>15} {'Daily Average':>15}")
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
print(f"{'Nutrient':<30} {'4-Day Total':>15} {'Daily Average':>15}")
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
print(f"{'Nutrient':<30} {'4-Day Total':>15} {'Daily Average':>15}")
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

targets = {
    'energy_kcal': {'rest_day_max': 2500, 'training_day_max': 2900},
    'protein_g_min': 170,
    'fat_g_min': 70,
    'carbs_g_min': 250,
    'fiber_g_min': 40,
    'sat_fat_g_max': 20,
    'sodium_mg_max': 2300,
}

# Calculate average energy target based on actual day types
avg_target_kcal = (num_rest_days * 2500 + num_training_days * 2900) / num_days
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
