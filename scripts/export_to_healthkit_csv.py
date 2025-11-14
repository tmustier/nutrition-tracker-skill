#!/usr/bin/env python3
"""
Export nutrition log data to Apple HealthKit CSV format.

Creates two CSV files:
1. per_item_nutrition.csv - Every logged item with its nutrition
2. per_day_nutrition.csv - Daily totals aggregated from per-item data
"""

import argparse
import csv
import logging
import sys
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

import yaml

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MAX_DAYS = 3650  # ~10 years
MAX_LOG_FILE_BYTES = 10 * 1024 * 1024  # 10 MB
INTERNAL_DATE_KEY = '_log_date'

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
LOGGER = logging.getLogger("healthkit_export")
MISSING_FIELDS_REPORTED: Set[str] = set()
NON_NUMERIC_KEYS = {'timestamp', 'food name', 'food id', INTERNAL_DATE_KEY}


def _resolve_user_path(path: Path) -> Path:
    """Resolve user-provided paths relative to PROJECT_ROOT when necessary."""
    expanded = path.expanduser()
    if expanded.is_absolute():
        return expanded.resolve()
    return (PROJECT_ROOT / expanded).resolve()


def ensure_safe_directory(path: Path, *, name: str, must_exist: bool) -> Path:
    """
    Ensure a user-supplied directory path stays inside PROJECT_ROOT and isn't a symlink.

    Args:
        path: Raw user-supplied path
        name: Argument name (for error messaging)
        must_exist: Whether the directory must already exist
    """
    resolved = _resolve_user_path(path)

    try:
        resolved.relative_to(PROJECT_ROOT)
    except ValueError:
        raise ValueError(f"{name} must be within {PROJECT_ROOT}. Got: {resolved}")

    if resolved.exists():
        if not resolved.is_dir():
            raise ValueError(f"{name} must be a directory. Got: {resolved}")
        if resolved.is_symlink():
            raise ValueError(f"{name} cannot be a symlink. Got: {resolved}")
    elif must_exist:
        raise ValueError(f"{name} does not exist: {resolved}")

    return resolved


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
        help=(
            "Number of past days to export when no explicit range is provided "
            "(default: 7, ending yesterday)."
        ),
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
    if args.days > MAX_DAYS:
        parser.error(f"--days cannot exceed {MAX_DAYS}.")

    return args


def resolve_date_range(args: argparse.Namespace) -> Tuple[date, date]:
    """Determine the date range to export."""
    if args.start_date and args.end_date:
        start_date, end_date = args.start_date, args.end_date
    else:
        end_date = date.today() - timedelta(days=1)
        start_date = end_date - timedelta(days=args.days - 1)

    total_days = (end_date - start_date).days + 1
    if total_days > MAX_DAYS:
        raise ValueError(
            f"Date range is too large ({total_days} days). Maximum supported is {MAX_DAYS} days."
        )

    return start_date, end_date


def locate_log_files(logs_dir: Path, start_date: date, end_date: date) -> List[Path]:
    """Return a list of log files covering the requested date range."""
    log_files: List[Path] = []
    missing_dates: List[str] = []

    for current_date in date_range(start_date, end_date):
        month_dir = logs_dir / current_date.strftime("%Y-%m")
        log_path = month_dir / f"{current_date.strftime('%d')}.yaml"

        if not log_path.exists():
            missing_dates.append(str(current_date))
            continue

        if log_path.is_symlink():
            raise ValueError(f"Refusing to follow symlinked log file: {log_path}")

        if log_path.is_file():
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


def load_log_yaml(log_path: Path) -> Dict[str, Any]:
    """Load a YAML log file with basic safety checks."""
    size_bytes = log_path.stat().st_size
    if size_bytes > MAX_LOG_FILE_BYTES:
        raise ValueError(
            f"{log_path} is {size_bytes:,} bytes which exceeds the {MAX_LOG_FILE_BYTES:,} byte limit."
        )

    with open(log_path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    if data is None:
        raise ValueError(f"{log_path} is empty or contains only comments.")

    if not isinstance(data, dict):
        raise ValueError(f"{log_path} must contain a YAML object at the top level.")

    return data


def set_file_permissions(path: Path) -> None:
    """Apply restrictive permissions to exported CSV files where possible."""
    try:
        path.chmod(0o640)
    except PermissionError:
        LOGGER.warning("Insufficient permissions to set mode 640 on %s.", path)
    except OSError as exc:
        LOGGER.warning("Unable to adjust permissions on %s: %s", path, exc)


def convert_nutrition_to_healthkit(
    nutrition: Dict[str, Any],
    *,
    source: str,
) -> Dict[str, float]:
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
            if column.field not in nutrition:
                if column.field not in MISSING_FIELDS_REPORTED:
                    LOGGER.warning(
                        "Missing nutrient '%s' in %s; defaulting to 0.",
                        column.field,
                        source,
                    )
                    MISSING_FIELDS_REPORTED.add(column.field)
                value = 0
            else:
                value = nutrition[column.field] * column.multiplier
        result[column.header] = value

    return result


def normalize_timestamp(value: Any, *, log_path: Path) -> Tuple[str, str]:
    """Validate and normalize ISO8601 timestamps and return (timestamp, date)."""
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{log_path} contains an entry with a missing timestamp.")

    cleaned = value.strip()
    if cleaned.endswith('Z'):
        cleaned = f"{cleaned[:-1]}+00:00"

    try:
        parsed = datetime.fromisoformat(cleaned)
    except ValueError as exc:
        raise ValueError(f"{log_path} contains invalid timestamp '{value}'.") from exc

    return parsed.isoformat(), parsed.date().isoformat()


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
    log_data = load_log_yaml(log_path)
    entries = log_data.get('entries', [])
    if not isinstance(entries, list):
        raise ValueError(f"{log_path} has malformed 'entries'; expected a list.")

    items_data: List[Dict[str, Any]] = []

    for entry in entries:
        if not isinstance(entry, dict):
            raise ValueError(f"{log_path} contains a non-object entry.")

        timestamp, entry_date = normalize_timestamp(entry.get('timestamp'), log_path=log_path)

        items = entry.get('items', [])
        if not isinstance(items, list):
            raise ValueError(f"{log_path} has an entry with malformed 'items'; expected a list.")

        for item in items:
            if not isinstance(item, dict):
                raise ValueError(f"{log_path} contains a non-object item entry.")

            nutrition = item.get('nutrition', {})
            if not isinstance(nutrition, dict):
                raise ValueError(f"{log_path} contains an item with malformed 'nutrition'.")

            context = f"{log_path.name}:{item.get('name', 'unknown item')}"
            healthkit_nutrition = convert_nutrition_to_healthkit(nutrition, source=context)

            row: Dict[str, Any] = {
                'timestamp': timestamp,
                'food name': str(item.get('name', '') or ''),
                'food id': item.get('food_bank_id', '') or '',
                INTERNAL_DATE_KEY: entry_date,
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
        date = item.get(INTERNAL_DATE_KEY)
        if not isinstance(date, str):
            raise ValueError("Per-item data missing internal date key.")

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
            if key in NON_NUMERIC_KEYS:
                continue
            if key not in daily_totals[date]:
                daily_totals[date][key] = 0
            daily_totals[date][key] += value

    # Convert to sorted list
    return [daily_totals[date] for date in sorted(daily_totals.keys())]


def main():
    """Main execution function."""

    args = parse_args()
    try:
        start_date, end_date = resolve_date_range(args)
    except ValueError as exc:
        print(f"Error: {exc}")
        sys.exit(2)

    try:
        logs_dir = ensure_safe_directory(args.logs_dir, name="--logs-dir", must_exist=True)
        output_dir = ensure_safe_directory(args.output_dir, name="--output-dir", must_exist=False)
    except ValueError as exc:
        print(f"Error: {exc}")
        sys.exit(2)

    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Processing logs from: {logs_dir}")
    print(f"Date range: {start_date} → {end_date}")
    print(f"Output directory: {output_dir}")

    try:
        log_files = locate_log_files(logs_dir, start_date, end_date)
    except ValueError as exc:
        print(f"Error: {exc}")
        sys.exit(2)

    if not log_files:
        print("No log files found in the requested range. Nothing to export.")
        sys.exit(1)

    print(f"Found {len(log_files)} log file(s)")

    # Process all log files
    all_items = []
    for log_file in log_files:
        print(f"Processing: {log_file.relative_to(logs_dir)}")
        try:
            items = process_log_file(log_file)
        except ValueError as exc:
            print(f"Error while processing {log_file}: {exc}")
            sys.exit(2)
        all_items.extend(items)

    print(f"Extracted {len(all_items)} items total")

    # Get column headers
    columns = get_healthkit_columns()

    # Write per-item CSV
    per_item_csv = output_dir / 'per_item_nutrition.csv'
    with open(per_item_csv, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(all_items)
    set_file_permissions(per_item_csv)

    print(f"✓ Created: {per_item_csv}")
    print(f"  {len(all_items)} rows")

    # Create per-day totals
    daily_totals = create_per_day_totals(all_items)

    # Write per-day CSV
    per_day_csv = output_dir / 'per_day_nutrition.csv'
    with open(per_day_csv, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(daily_totals)
    set_file_permissions(per_day_csv)

    print(f"✓ Created: {per_day_csv}")
    print(f"  {len(daily_totals)} rows")

    print("\n✅ Export complete!")
    print(f"\nFiles created:")
    print(f"  1. {per_item_csv.relative_to(PROJECT_ROOT)}")
    print(f"  2. {per_day_csv.relative_to(PROJECT_ROOT)}")


if __name__ == '__main__':
    main()
