#!/usr/bin/env python3
"""
Convert Imperial Treasure dishes to new carb schema and apply corrections.
"""

import re
import sys
from datetime import datetime, timezone

def convert_dish_carbs(dish_text, dish_id):
    """Convert a single dish from old carbs_g to new schema."""
    lines = dish_text.split('\n')
    output_lines = []

    # Track if we've found carbs_g
    found_carbs = False
    carbs_value = None
    fiber_value = 0.0

    # Special corrections for duck skin and cheung fun
    is_duck_skin = 'peking_duck_skin_sugar' in dish_id
    is_cheung_fun = 'crispy_shrimp_cheung_fun' in dish_id

    if is_duck_skin:
        # Duck skin v3 corrections
        corrections = {
            'version: 2': 'version: 3',
            'est_weight_g: 12': 'est_weight_g: 2.5',
            'energy_kcal: 50': 'energy_kcal: 20',
            'protein_g: 1.2': 'protein_g: 0.2',
            'fat_g: 4.1': 'fat_g: 2.0',
            'sat_fat_g: 1.4': 'sat_fat_g: 0.7',
            'mufa_g: 2.0': 'mufa_g: 1.0',
            'pufa_g: 0.5': 'pufa_g: 0.25',
            'cholesterol_mg: 12': 'cholesterol_mg: 3',
            'carbs_g: 2.0': 'carbs_available_g: 0.1',
            'sugar_g: 2.0': 'sugar_g: 0.1',
            'sodium_mg: 60': 'sodium_mg: 10',
            'potassium_mg: 5': 'potassium_mg: 1',
            'magnesium_mg: 1': 'magnesium_mg: 0',
            'calcium_mg: 1': 'calcium_mg: 0',
            'iron_mg: 0.3': 'iron_mg: 0.1',
            'zinc_mg: 0.2': 'zinc_mg: 0.05',
        }
    elif is_cheung_fun:
        # Cheung fun v3 corrections (per piece = 1/6 of roll)
        corrections = {
            'version: 1': 'version: 3',
            'version: 2': 'version: 3',
            'description: "1 roll': 'description: "1 piece (1/6 of roll)',
            'est_weight_g: 75': 'est_weight_g: 12.5',
            'energy_kcal: 183': 'energy_kcal: 31',
            'protein_g: 5.6': 'protein_g: 0.9',
            'fat_g: 11.2': 'fat_g: 1.9',
            'sat_fat_g: 1.5': 'sat_fat_g: 0.25',
            'mufa_g: 2.4': 'mufa_g: 0.4',
            'pufa_g: 5.8': 'pufa_g: 0.96',
            'cholesterol_mg: 24': 'cholesterol_mg: 4',
            'carbs_g: 15.6': 'carbs_available_g: 2.6',
            'sugar_g: 0.6': 'sugar_g: 0.1',
            'fiber_total_g: 0.6': 'fiber_total_g: 0.1',
            'sodium_mg: 479': 'sodium_mg: 80',
            'potassium_mg: 56': 'potassium_mg: 9',
            'iodine_ug: 3': 'iodine_ug: 1',
            'magnesium_mg: 7': 'magnesium_mg: 1',
            'calcium_mg: 13': 'calcium_mg: 2',
            'iron_mg: 1.0': 'iron_mg: 0.2',
            'zinc_mg: 0.4': 'zinc_mg: 0.1',
        }
    else:
        corrections = {}

    i = 0
    while i < len(lines):
        line = lines[i]

        # Apply special corrections first
        original_line = line
        for old, new in corrections.items():
            if old in line:
                line = line.replace(old, new)

        # Track fiber value for carbs_total calculation
        if 'fiber_total_g:' in line and 'per_portion:' in '\n'.join(lines[max(0,i-10):i]):
            match = re.search(r'fiber_total_g:\s*([\d.]+)', line)
            if match:
                fiber_value = float(match.group(1))

        # Convert carbs_g to new schema
        if 'carbs_g:' in line and 'per_portion:' in '\n'.join(lines[max(0,i-20):i]):
            match = re.search(r'carbs_g:\s*([\d.]+)', line)
            if match:
                carbs_value = float(match.group(1))
                found_carbs = True
                # Replace carbs_g with carbs_available_g
                indent = len(line) - len(line.lstrip())
                output_lines.append(' ' * indent + f'carbs_available_g: {carbs_value}')
                i += 1
                continue

        # Insert new carb fields after manganese (which is typically last in nutrition section)
        if 'manganese_mg:' in line and found_carbs and 'per_portion:' in '\n'.join(lines[max(0,i-30):i]):
            output_lines.append(line)
            indent = len(line) - len(line.lstrip())
            # Add polyols_g and carbs_total_g
            output_lines.append(' ' * indent + 'polyols_g: 0.0')
            carbs_total = carbs_value + fiber_value
            output_lines.append(' ' * indent + f'carbs_total_g: {carbs_total:.1f}')
            found_carbs = False  # Reset flag
            i += 1
            continue

        output_lines.append(line)
        i += 1

    return '\n'.join(output_lines)

def main():
    input_file = 'data/food-data-bank.md'

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all Imperial Treasure dishes
    pattern = r'(## .*?\(Imperial Treasure[^)]*\).*?(?=## |$))'
    dishes = re.findall(pattern, content, re.DOTALL)

    print(f"Found {len(dishes)} Imperial Treasure dishes")

    # Convert each dish
    for dish in dishes:
        # Extract dish ID
        id_match = re.search(r'id:\s*([^\n]+)', dish)
        if id_match:
            dish_id = id_match.group(1).strip()
            print(f"Converting {dish_id}...")
            converted = convert_dish_carbs(dish, dish_id)
            content = content.replace(dish, converted)

    # Write back
    with open(input_file, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Conversion complete!")

if __name__ == '__main__':
    main()
