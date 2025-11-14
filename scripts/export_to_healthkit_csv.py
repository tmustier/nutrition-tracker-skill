#!/usr/bin/env python3
"""
Export nutrition log data to Apple HealthKit CSV format.

Creates two CSV files:
1. per_item_nutrition.csv - Every logged item with its nutrition
2. per_day_nutrition.csv - Daily totals aggregated from per-item data
"""

import argparse
import csv
import sys
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import yaml

PROJECT_ROOT = Path(__file__).parent.parent


def parse_date(value: str) -> date:
    """Parse YYYY-MM-DD strings into date objects."""
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError as exc:
        raise argparse.ArgumentTypeError(
            f"Invalid date '{value}'. Use YYYY-MM-DD."
        ) from exc


def date_range(start: date, end: date):
    """Yield each date between start and end (inclusive)."""
    days = (end - start).days
    for offset in range(days + 1):
        yield start + timedelta(days=offset)


def parse_args() -> argparse.Namespace:
    """Configure and parse CLI arguments."""
    parser = argparse.ArgumentParser(
        description="Export nutrition logs to HealthKit CSV format."
    )
    parser.add_argument(
        "--start-date",
        type=parse_date,
        help="Start date (YYYY-MM-DD). Must be used with --end-date.",
    )
    parser.add_argument(
        "--end-date",
        type=parse_date,
        help="End date (YYYY-MM-DD). Must be used with --start-date.",
    )
    parser.add_argument(
        "--days",
        type=int,
        default=7,
        help="Number of past days to export when no explicit range is provided (default: 7).",
    )
    parser.add_argument(
        "--logs-dir",
        type=Path,
        default=PROJECT_ROOT / "data" / "logs",
        help="Path to the logs directory (default: %(default)s).",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=PROJECT_ROOT / "exports",
        help="Directory where CSV files will be written (default: %(default)s).",
    )

    args = parser.parse_args()

    if (args.start_date and not args.end_date) or (args.end_date and not args.start_date):
        parser.error("Both --start-date and --end-date must be supplied together.")

    if args.start_date and args.end_date and args.start_date > args.end_date:
        parser.error("--start-date must be earlier than or equal to --end-date.")

    if args.days < 1:
        parser.error("--days must be at least 1.")

    return args


def resolve_date_range(args: argparse.Namespace) -> Tuple[date, date]:
    """Determine the date range to export."""
    if args.start_date and args.end_date:
        return args.start_date, args.end_date

    end_date = date.today() - timedelta(days=1)
    start_date = end_date - timedelta(days=args.days - 1)
    return start_date, end_date


def locate_log_files(logs_dir: Path, start_date: date, end_date: date) -> List[Path]:
    """Return a list of log files covering the requested date range."""
    log_files: List[Path] = []
    missing_dates: List[str] = []

    for current_date in date_range(start_date, end_date):
        month_dir = logs_dir / current_date.strftime("%Y-%m")
        log_path = month_dir / f"{current_date.strftime('%d')}.yaml"

        if log_path.exists():
            log_files.append(log_path)
        else:
            missing_dates.append(str(current_date))

    if missing_dates:
        print(f"⚠️ No log file found for: {', '.join(missing_dates)}")

    return log_files


@dataclass(frozen=True)
class NutrientColumn:
    """Describe a nutrient column in the export."""

    header: str
    field: Optional[str]
    multiplier: float = 1.0


NUTRIENT_COLUMNS: List[NutrientColumn] = [
    NutrientColumn('calcium (mg)', 'calcium_mg'),
    NutrientColumn('carbohydrate (g)', 'carbs_total_g'),
    NutrientColumn('chloride (mg)', 'chloride_mg'),
    NutrientColumn('cholesterol (mg)', 'cholesterol_mg'),
    NutrientColumn('chromium (mcg)', 'chromium_ug'),
    NutrientColumn('copper (mg)', 'copper_mg'),
    NutrientColumn('energy consumed (kcal)', 'energy_kcal'),
    NutrientColumn('monounsaturated (g)', 'mufa_g'),
    NutrientColumn('polyunsaturated (g)', 'pufa_g'),
    NutrientColumn('saturated fat (g)', 'sat_fat_g'),
    NutrientColumn('total fat (g)', 'fat_g'),
    NutrientColumn('fiber (g)', 'fiber_total_g'),
    NutrientColumn('folate (mcg)', 'vitamin_b9_ug'),
    NutrientColumn('iodine (mcg)', 'iodine_ug'),
    NutrientColumn('iron (mg)', 'iron_mg'),
    NutrientColumn('magnesium (mg)', 'magnesium_mg'),
    NutrientColumn('manganese (mg)', 'manganese_mg'),
    NutrientColumn('molybdenum (mcg)', 'molybdenum_ug'),
    NutrientColumn('niacin (mg)', 'vitamin_b3_mg'),
    NutrientColumn('pantothenic (mg)', 'vitamin_b5_mg'),
    NutrientColumn('phosphorus (mg)', 'phosphorus_mg'),
    NutrientColumn('potassium (mg)', 'potassium_mg'),
    NutrientColumn('protein (g)', 'protein_g'),
    NutrientColumn('riboflavin (mg)', 'vitamin_b2_mg'),
    NutrientColumn('selenium (mcg)', 'selenium_ug'),
    NutrientColumn('sodium (mg)', 'sodium_mg'),
    NutrientColumn('sugar (g)', 'sugar_g'),
    NutrientColumn('thiamin (mg)', 'vitamin_b1_mg'),
    NutrientColumn('vitamin a (mcg)', 'vitamin_a_ug'),
    NutrientColumn('vitamin b12 (mcg)', 'vitamin_b12_ug'),
    NutrientColumn('vitamin b6 (mg)', 'vitamin_b6_mg'),
    NutrientColumn('vitamin c (mg)', 'vitamin_c_mg'),
    NutrientColumn('vitamin d (mcg)', 'vitamin_d_ug'),
    NutrientColumn('vitamin e (mg)', 'vitamin_e_mg'),
    NutrientColumn('vitamin k (mcg)', 'vitamin_k_ug'),
    NutrientColumn('zinc (mg)', 'zinc_mg'),
    NutrientColumn('alcoholic beverages (g)', None, 0.0),
    NutrientColumn('biotin (mcg)', 'vitamin_b7_ug'),
]


def convert_nutrition_to_healthkit(nutrition: Dict[str, Any]) -> Dict[str, float]:
    """
    Convert nutrition data from YAML format to HealthKit CSV format.

    Values remain in their original units from the nutrition logs. Each CSV
    column header makes the target unit explicit (g, mg, or mcg).

    Args:
        nutrition: Dictionary with nutrition data from YAML log

    Returns:
        Dictionary with HealthKit column names and converted values
    """

    result: Dict[str, float] = {}
    for column in NUTRIENT_COLUMNS:
        if column.field is None:
            value = 0
        else:
            value = nutrition.get(column.field, 0) * column.multiplier
        result[column.header] = value

    return result


def get_healthkit_columns() -> List[str]:
    """Return ordered list of HealthKit CSV column headers."""
    return ['timestamp', 'food name', 'food id'] + [col.header for col in NUTRIENT_COLUMNS]


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

    args = parse_args()
    start_date, end_date = resolve_date_range(args)

    logs_dir = args.logs_dir
    output_dir = args.output_dir
    output_dir.mkdir(exist_ok=True)

    print(f"Processing logs from: {logs_dir}")
    print(f"Date range: {start_date} → {end_date}")
    print(f"Output directory: {output_dir}")

    log_files = locate_log_files(logs_dir, start_date, end_date)

    if not log_files:
        print("No log files found in the requested range. Nothing to export.")
        sys.exit(1)

    print(f"Found {len(log_files)} log file(s)")

    # Process all log files
    all_items = []
    for log_file in log_files:
        print(f"Processing: {log_file.relative_to(logs_dir)}")
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
    print(f"  1. {per_item_csv.relative_to(PROJECT_ROOT)}")
    print(f"  2. {per_day_csv.relative_to(PROJECT_ROOT)}")


if __name__ == '__main__':
    main()
