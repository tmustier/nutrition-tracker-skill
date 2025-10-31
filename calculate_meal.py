#!/usr/bin/env python3
"""
Calculate nutrition for today's Zima meal with precise measurements
"""

# Full portion nutrition from food bank
chicken_cutlet_full = {
    "energy_kcal": 602,
    "protein_g": 29.7,
    "fat_g": 30.9,
    "sat_fat_g": 8.2,
    "mufa_g": 14.2,
    "pufa_g": 7.3,
    "trans_fat_g": 0.3,
    "cholesterol_mg": 140,
    "carbs_g": 43.7,
    "sugar_g": 2.7,
    "fiber_total_g": 5.3,
    "fiber_soluble_g": 1.6,
    "fiber_insoluble_g": 3.7,
    "sodium_mg": 936,
    "potassium_mg": 557,
}

# Notes from food bank: full portion includes 150g cooked buckwheat
# So 0.5 portion would be 75g buckwheat

# Standard cooked buckwheat nutrition per 100g (from USDA)
buckwheat_per_100g = {
    "energy_kcal": 92,
    "protein_g": 3.4,
    "fat_g": 0.6,
    "sat_fat_g": 0.1,
    "mufa_g": 0.2,
    "pufa_g": 0.2,
    "trans_fat_g": 0.0,
    "cholesterol_mg": 0,
    "carbs_g": 20.0,
    "sugar_g": 0.9,
    "fiber_total_g": 2.7,
    "fiber_soluble_g": 0.8,
    "fiber_insoluble_g": 1.9,
    "sodium_mg": 4,
    "potassium_mg": 88,
}

# Measurements from today's consolidated container:
# - 70g chicken meat (separated)
# - 259g remaining contents (buckwheat + sauce + extra buckwheat?)

print("="*60)
print("ANALYSIS: Consolidated Zima Chicken Container")
print("="*60)

# The 0.5 portion of Chicken Cutlet should include:
# - ~70g cooked chicken meat (matches measurement!)
# - ~75g cooked buckwheat (from 150g in full portion)
# - ~25-30g mushroom sauce

print("\n0.5 portion Chicken Cutlet breakdown:")
print(f"  Expected buckwheat in dish: ~75g")
print(f"  Measured remaining contents: 259g")
print(f"  Difference: {259 - 75}g = likely extra buckwheat + sauce")

# Let's estimate sauce weight at ~30g
# That leaves 259 - 30 = 229g of buckwheat total
# Which means 229 - 75 = 154g extra buckwheat

sauce_weight_g = 30
buckwheat_from_dish_g = 75
total_buckwheat_g = 259 - sauce_weight_g
extra_buckwheat_g = total_buckwheat_g - buckwheat_from_dish_g

print(f"\nEstimated breakdown of 259g:")
print(f"  Buckwheat from dish: {buckwheat_from_dish_g}g")
print(f"  Extra buckwheat: {extra_buckwheat_g}g")
print(f"  Mushroom sauce: {sauce_weight_g}g")
print(f"  Total: {buckwheat_from_dish_g + extra_buckwheat_g + sauce_weight_g}g")

# Calculate nutrition
# Approach: Use 0.5 portion of full dish, but adjust for extra buckwheat

print("\n" + "="*60)
print("NUTRITION CALCULATION")
print("="*60)

# Method 1: Use 0.5 portion + calculate extra buckwheat separately
result = {}
for key in chicken_cutlet_full:
    result[key] = chicken_cutlet_full[key] * 0.5

# Add extra buckwheat (154g)
extra_buckwheat_ratio = extra_buckwheat_g / 100
for key in buckwheat_per_100g:
    if key in result:
        result[key] += buckwheat_per_100g[key] * extra_buckwheat_ratio

print("\nChicken + Buckwheat (consolidated container - 70g meat + 259g contents):")
for key, value in result.items():
    if value is not None:
        print(f"  {key}: {value:.1f}")

# Sauerkraut 0.25 portion
print("\n" + "="*60)
print("Sauerkraut (0.25 portion):")
sauerkraut_full = {
    "energy_kcal": 40,
    "protein_g": 1.6,
    "fat_g": 0.2,
    "sat_fat_g": 0.1,
    "mufa_g": 0.1,
    "pufa_g": 0.1,
    "trans_fat_g": 0.0,
    "cholesterol_mg": 0,
    "carbs_g": 7.8,
    "sugar_g": 3.0,
    "fiber_total_g": 4.5,
    "fiber_soluble_g": 0.9,
    "fiber_insoluble_g": 3.6,
    "sodium_mg": 1080,
    "potassium_mg": 306,
}

sauerkraut_quarter = {k: v * 0.25 for k, v in sauerkraut_full.items()}
for key, value in sauerkraut_quarter.items():
    print(f"  {key}: {value:.1f}")

# Vinegret 90g (full portion is ~180g based on sauerkraut weight estimate)
print("\n" + "="*60)
print("Vinegret (90g, excluding bread):")
vinegret_with_bread_full = {
    "energy_kcal": 233,
    "protein_g": 5.7,
    "fat_g": 6.1,
    "sat_fat_g": 1.2,
    "mufa_g": 2.0,
    "pufa_g": 3.8,
    "trans_fat_g": 0.0,
    "cholesterol_mg": 0,
    "carbs_g": 35.5,
    "sugar_g": 7.5,
    "fiber_total_g": 6.9,
    "fiber_soluble_g": 3.1,
    "fiber_insoluble_g": 3.8,
    "sodium_mg": 493,
    "potassium_mg": 403,
}

# Need to subtract the bread (1 slice rye ~32g)
# Standard rye bread per 32g slice: ~85 kcal, 2.8g protein, 0.9g fat, 15.5g carbs
rye_bread_slice = {
    "energy_kcal": 85,
    "protein_g": 2.8,
    "fat_g": 0.9,
    "sat_fat_g": 0.2,
    "mufa_g": 0.2,
    "pufa_g": 0.4,
    "trans_fat_g": 0.0,
    "cholesterol_mg": 0,
    "carbs_g": 15.5,
    "sugar_g": 2.5,
    "fiber_total_g": 2.1,
    "fiber_soluble_g": 0.8,
    "fiber_insoluble_g": 1.3,
    "sodium_mg": 185,
    "potassium_mg": 68,
}

vinegret_salad_only = {}
for key in vinegret_with_bread_full:
    vinegret_salad_only[key] = vinegret_with_bread_full[key] - rye_bread_slice.get(key, 0)

# The vinegret salad (no bread) is approximately 148 kcal for the full portion
# User had 90g, need to estimate full salad weight
# Assuming full salad is ~180g, user had 90g = 0.5 portion of salad
vinegret_90g = {k: v * 0.5 for k, v in vinegret_salad_only.items()}
for key, value in vinegret_90g.items():
    print(f"  {key}: {value:.1f}")

print("\n" + "="*60)
print("TOTAL MEAL NUTRITION:")
print("="*60)

total = {}
for key in result:
    total[key] = result[key] + sauerkraut_quarter.get(key, 0) + vinegret_90g.get(key, 0)

for key, value in total.items():
    if value is not None:
        print(f"  {key}: {value:.1f}")
