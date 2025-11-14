#!/usr/bin/env python3
"""
Export nutrition log data to Apple HealthKit CSV format.

Creates two CSV files:
1. per_item_nutrition.csv - Every logged item with its nutrition
2. per_day_nutrition.csv - Daily totals aggregated from per-item data
"""

import csv
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any
import yaml


def convert_nutrition_to_healthkit(nutrition: Dict[str, Any]) -> Dict[str, float]:
    """
    Convert nutrition data from YAML format to HealthKit CSV format.

    Handles unit conversions:
    - g to mg (multiply by 1000)
    - ug to mg (divide by 1000)
    - mg to mcg (multiply by 1000)

    Args:
        nutrition: Dictionary with nutrition data from YAML log

    Returns:
        Dictionary with HealthKit column names and converted values
    """

    return {
        # Energy (already in kcal)
        'energy consumed': nutrition.get('energy_kcal', 0),

        # Macros (g to mg)
        'protein': nutrition.get('protein_g', 0) * 1000,
        'carbohydrate': nutrition.get('carbs_total_g', 0) * 1000,
        'total fat': nutrition.get('fat_g', 0) * 1000,
        'saturated fat': nutrition.get('sat_fat_g', 0) * 1000,
        'monounsaturated': nutrition.get('mufa_g', 0) * 1000,
        'polyunsaturated': nutrition.get('pufa_g', 0) * 1000,
        'fiber': nutrition.get('fiber_total_g', 0) * 1000,
        'sugar': nutrition.get('sugar_g', 0) * 1000,

        # Cholesterol (already in mg)
        'cholesterol': nutrition.get('cholesterol_mg', 0),

        # Essential minerals (already in mg)
        'sodium': nutrition.get('sodium_mg', 0),
        'potassium': nutrition.get('potassium_mg', 0),
        'calcium': nutrition.get('calcium_mg', 0),
        'magnesium': nutrition.get('magnesium_mg', 0),
        'phosphorus': nutrition.get('phosphorus_mg', 0),
        'chloride': nutrition.get('chloride_mg', 0),

        # Trace minerals (already in mg)
        'iron': nutrition.get('iron_mg', 0),
        'zinc': nutrition.get('zinc_mg', 0),
        'copper': nutrition.get('copper_mg', 0),
        'manganese': nutrition.get('manganese_mg', 0),

        # Trace minerals (ug to mg)
        'selenium': nutrition.get('selenium_ug', 0) / 1000,

        # Trace minerals (already in mcg = ug)
        'iodine': nutrition.get('iodine_ug', 0),
        'chromium': nutrition.get('chromium_ug', 0),
        'molybdenum': nutrition.get('molybdenum_ug', 0),

        # Fat-soluble vitamins
        'vitamin a': nutrition.get('vitamin_a_ug', 0),  # already in mcg
        'vitamin d': nutrition.get('vitamin_d_ug', 0) / 1000,  # ug to mg
        'vitamin e': nutrition.get('vitamin_e_mg', 0),  # already in mg
        'vitamin k': nutrition.get('vitamin_k_ug', 0),  # already in mcg

        # B vitamins
        'thiamin': nutrition.get('vitamin_b1_mg', 0) * 1000,  # mg to mcg
        'riboflavin': nutrition.get('vitamin_b2_mg', 0) * 1000,  # mg to mcg
        'niacin': nutrition.get('vitamin_b3_mg', 0),  # already in mg
        'pantothenic': nutrition.get('vitamin_b5_mg', 0),  # already in mg
        'vitamin b6': nutrition.get('vitamin_b6_mg', 0),  # already in mg
        'biotin': nutrition.get('vitamin_b7_ug', 0),  # already in mcg
        'folate': nutrition.get('vitamin_b9_ug', 0),  # already in mcg
        'vitamin b12': nutrition.get('vitamin_b12_ug', 0) / 1000,  # ug to mg

        # Vitamin C (already in mg)
        'vitamin c': nutrition.get('vitamin_c_mg', 0),

        # Alcoholic beverages (not tracked in YAML schema)
        'alcoholic beverages': 0
    }


def get_healthkit_columns() -> List[str]:
    """Return ordered list of HealthKit CSV column headers."""
    return [
        'timestamp',
        'food name',
        'food id',
        'calcium',
        'carbohydrate',
        'chloride',
        'cholesterol',
        'chromium',
        'copper',
        'energy consumed',
        'monounsaturated',
        'polyunsaturated',
        'saturated fat',
        'total fat',
        'fiber',
        'folate',
        'iodine',
        'iron',
        'magnesium',
        'manganese',
        'molybdenum',
        'niacin',
        'pantothenic',
        'phosphorus',
        'potassium',
        'protein',
        'riboflavin',
        'selenium',
        'sodium',
        'sugar',
        'thiamin',
        'vitamin a',
        'vitamin b12',
        'vitamin b6',
        'vitamin c',
        'vitamin d',
        'vitamin e',
        'vitamin k',
        'zinc',
        'alcoholic beverages',
        'biotin'
    ]


def process_log_file(log_path: Path) -> List[Dict[str, Any]]:
    """
    Process a single YAML log file and extract per-item nutrition data.

    Args:
        log_path: Path to YAML log file

    Returns:
        List of dictionaries, each containing an item's data
    """
    with open(log_path, 'r') as f:
        log_data = yaml.safe_load(f)

    items_data = []

    for entry in log_data.get('entries', []):
        timestamp = entry.get('timestamp', '')

        for item in entry.get('items', []):
            # Convert nutrition to HealthKit format
            healthkit_nutrition = convert_nutrition_to_healthkit(item.get('nutrition', {}))

            # Create row with metadata + nutrition
            row = {
                'timestamp': timestamp,
                'food name': item.get('name', ''),
                'food id': item.get('food_bank_id', '') or '',  # Convert None to empty string
            }
            row.update(healthkit_nutrition)

            items_data.append(row)

    return items_data


def create_per_day_totals(per_item_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Aggregate per-item data into per-day totals.

    Args:
        per_item_data: List of per-item nutrition records

    Returns:
        List of per-day aggregated records
    """
    daily_totals = {}

    for item in per_item_data:
        # Extract date from timestamp
        timestamp = item['timestamp']
        date = timestamp.split('T')[0]  # Get YYYY-MM-DD

        if date not in daily_totals:
            # Initialize with zeros
            daily_totals[date] = {
                'timestamp': date,
                'food name': f'Daily Total - {date}',
                'food id': ''
            }
            # Initialize all nutrition fields to 0
            for col in get_healthkit_columns():
                if col not in ['timestamp', 'food name', 'food id']:
                    daily_totals[date][col] = 0

        # Sum up all nutrition fields
        for key, value in item.items():
            if key not in ['timestamp', 'food name', 'food id']:
                daily_totals[date][key] += value

    # Convert to sorted list
    return [daily_totals[date] for date in sorted(daily_totals.keys())]


def main():
    """Main execution function."""

    # Set up paths
    project_root = Path(__file__).parent.parent
    logs_dir = project_root / 'data' / 'logs'
    output_dir = project_root / 'exports'
    output_dir.mkdir(exist_ok=True)

    print(f"Processing logs from: {logs_dir}")
    print(f"Output directory: {output_dir}")

    # Find all log files in 2025-10 and 2025-11
    log_files = []
    for month_dir in ['2025-10', '2025-11']:
        month_path = logs_dir / month_dir
        if month_path.exists():
            log_files.extend(sorted(month_path.glob('*.yaml')))

    print(f"Found {len(log_files)} log files")

    # Process all log files
    all_items = []
    for log_file in log_files:
        print(f"Processing: {log_file.name}")
        items = process_log_file(log_file)
        all_items.extend(items)

    print(f"Extracted {len(all_items)} items total")

    # Get column headers
    columns = get_healthkit_columns()

    # Write per-item CSV
    per_item_csv = output_dir / 'per_item_nutrition.csv'
    with open(per_item_csv, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        writer.writerows(all_items)

    print(f"✓ Created: {per_item_csv}")
    print(f"  {len(all_items)} rows")

    # Create per-day totals
    daily_totals = create_per_day_totals(all_items)

    # Write per-day CSV
    per_day_csv = output_dir / 'per_day_nutrition.csv'
    with open(per_day_csv, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        writer.writerows(daily_totals)

    print(f"✓ Created: {per_day_csv}")
    print(f"  {len(daily_totals)} rows")

    print("\n✅ Export complete!")
    print(f"\nFiles created:")
    print(f"  1. {per_item_csv.relative_to(project_root)}")
    print(f"  2. {per_day_csv.relative_to(project_root)}")


if __name__ == '__main__':
    main()
