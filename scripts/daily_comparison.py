#!/usr/bin/env python3
"""
Daily Nutrition Comparison Script
Displays days as rows, nutrients as columns with statistical outlier detection.

Usage:
    python3 daily_comparison.py 2025-11                     # All days in November
    python3 daily_comparison.py 2025-11 --days 7             # Last 7 days
    python3 daily_comparison.py 2025-11 --nutrients energy_kcal,protein_g  # Specific nutrients
"""

import yaml
import sys
import argparse
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Optional
import statistics

# Project root
PROJECT_ROOT = Path(__file__).parent.parent
LOGS_DIR = PROJECT_ROOT / "data" / "logs"
HEALTH_PROFILE = PROJECT_ROOT / "references" / "health-profile.yaml"

# All 52 tracked nutrients
ALL_NUTRIENTS = [
    'energy_kcal', 'protein_g', 'fat_g', 'carbs_total_g', 'fiber_total_g',
    'sat_fat_g', 'mufa_g', 'pufa_g', 'trans_fat_g', 'cholesterol_mg',
    'carbs_available_g', 'fiber_soluble_g', 'fiber_insoluble_g', 'sugar_g', 'polyols_g',
    'sodium_mg', 'potassium_mg', 'calcium_mg', 'magnesium_mg', 'phosphorus_mg', 'chloride_mg', 'sulfur_g',
    'iron_mg', 'zinc_mg', 'copper_mg', 'manganese_mg', 'selenium_ug', 'iodine_ug', 'chromium_ug', 'molybdenum_ug',
    'boron_mg', 'silicon_mg', 'vanadium_ug', 'nickel_ug',
    'vitamin_a_ug', 'vitamin_d_ug', 'vitamin_e_mg', 'vitamin_k_ug',
    'vitamin_c_mg', 'vitamin_b1_mg', 'vitamin_b2_mg', 'vitamin_b3_mg', 'vitamin_b5_mg',
    'vitamin_b6_mg', 'vitamin_b7_ug', 'vitamin_b9_ug', 'vitamin_b12_ug', 'choline_mg',
    'omega3_epa_mg', 'omega3_dha_mg', 'omega3_ala_g', 'omega6_la_g'
]

# Default nutrients for overview (if not in focus mode)
DEFAULT_DISPLAY_NUTRIENTS = [
    'energy_kcal', 'protein_g', 'fat_g', 'carbs_total_g', 'fiber_total_g',
    'sat_fat_g', 'sugar_g', 'sodium_mg', 'potassium_mg'
]

# Mapping from logged nutrient names to health profile target names
# Used when nutrient name in logs differs from health profile
NUTRIENT_TARGET_MAP = {
    'carbs_total_g': 'carbs_g',
    'fiber_total_g': 'fiber_g',
}


def load_health_profile() -> Dict:
    """Load health profile with user-defined targets."""
    if not HEALTH_PROFILE.exists():
        return {'targets': {}}

    try:
        with open(HEALTH_PROFILE, 'r') as f:
            profile = yaml.safe_load(f)
        return profile if profile else {'targets': {}}
    except Exception as e:
        print(f"Warning: Could not load health profile: {e}", file=sys.stderr)
        return {'targets': {}}


def parse_daily_log(log_file: Path) -> Optional[Dict]:
    """Parse a single daily log file and return totals."""
    with open(log_file, 'r') as f:
        data = yaml.safe_load(f)

    if not isinstance(data, dict):
        return None

    # Calculate daily totals
    daily_totals = defaultdict(float)

    for entry in data.get('entries', []):
        if not isinstance(entry, dict):
            continue

        for item in entry.get('items', []):
            if not isinstance(item, dict):
                continue

            nutrition = item.get('nutrition', {})
            if not isinstance(nutrition, dict):
                continue

            for nutrient, value in nutrition.items():
                if value is not None and isinstance(value, (int, float)):
                    daily_totals[nutrient] += value

    return {
        'date': data.get('date'),
        'day_type': data.get('day_type', 'rest'),
        'totals': dict(daily_totals)
    }


def calculate_statistics(values: List[float]) -> Optional[Dict]:
    """Calculate statistics for a list of values."""
    if not values or len(values) < 2:
        return None

    # Filter out zeros to avoid skewing stats
    non_zero_values = [v for v in values if v > 0]
    if len(non_zero_values) < 2:
        return None

    return {
        'mean': statistics.mean(non_zero_values),
        'median': statistics.median(non_zero_values),
        'stdev': statistics.stdev(non_zero_values),
        'min': min(non_zero_values),
        'max': max(non_zero_values),
        'count': len(non_zero_values)
    }


def get_target_value(nutrient: str, targets: Dict, target_type: str) -> Optional[float]:
    """
    Get target value for a nutrient (min or max).

    Handles mapping from logged nutrient names to health profile target names.
    For example: carbs_total_g → carbs_g_min

    Args:
        nutrient: Logged nutrient name (e.g., 'carbs_total_g')
        targets: Target dictionary from health profile
        target_type: 'min' or 'max'

    Returns:
        Target value if found, None otherwise
    """
    # Special case: energy_kcal has nested structure (rest_day_max, training_day_max)
    # Skip it since we can't determine target without day_type context
    if nutrient == 'energy_kcal':
        return None

    # Map nutrient name if needed (e.g., carbs_total_g → carbs_g)
    mapped_nutrient = NUTRIENT_TARGET_MAP.get(nutrient, nutrient)

    # Try exact match with suffix: carbs_g_min, protein_g_min
    key_with_suffix = f"{mapped_nutrient}_{target_type}"
    if key_with_suffix in targets:
        return targets[key_with_suffix]

    # Try base key without units: carbs_min, protein_min
    base_key = mapped_nutrient.replace('_g', '').replace('_mg', '').replace('_ug', '').replace('_kcal', '')
    base_with_suffix = f"{base_key}_{target_type}"
    if base_with_suffix in targets:
        return targets[base_with_suffix]

    # Direct lookup (for special cases)
    if mapped_nutrient in targets:
        value = targets[mapped_nutrient]
        # Make sure it's not a dict (like energy_kcal might be)
        if isinstance(value, (int, float)):
            return value

    return None


def get_outlier_indicator(value: float, stats: Optional[Dict], targets: Dict, nutrient: str) -> str:
    """
    Get visual indicator for a value based on statistics and optional target.
    Returns: '✓' (good), '⚠️' (warning), '❌' (bad), '' (neutral)
    """
    if value == 0:
        return '·'

    if stats is None:
        return ''

    mean = stats['mean']
    stdev = stats['stdev']

    # Calculate z-score
    if stdev == 0:
        z_score = 0
    else:
        z_score = (value - mean) / stdev

    # Check for major statistical outliers first (±2 SD)
    if abs(z_score) >= 2.0:
        return '❌'

    # Check target compliance using helper function
    target_min = get_target_value(nutrient, targets, 'min')
    target_max = get_target_value(nutrient, targets, 'max')

    # Check if under minimum
    if target_min is not None and value < target_min:
        return '⚠️'

    # Check if over maximum
    if target_max is not None and value > target_max:
        return '⚠️'

    # Check for moderate statistical outliers (±1.5 SD)
    if abs(z_score) >= 1.5:
        return '⚠️'

    return '✓'


def load_daily_data(year: int, month: int, num_days: Optional[int] = None) -> List[Dict]:
    """Load daily logs for a given month or last N days."""
    month_dir = LOGS_DIR / f"{year:04d}-{month:02d}"

    if not month_dir.exists():
        return []

    daily_data = []
    log_files = sorted(month_dir.glob("*.yaml"))

    for log_file in log_files:
        try:
            data = parse_daily_log(log_file)
            if data:
                daily_data.append(data)
        except Exception as e:
            print(f"Warning: Error parsing {log_file}: {e}", file=sys.stderr)
            continue

    # If num_days specified, take last N days
    if num_days and len(daily_data) > num_days:
        daily_data = daily_data[-num_days:]

    return daily_data


def should_display_nutrient(nutrient: str, all_stats: Dict, targets: Dict,
                           focus_nutrients: Optional[List[str]] = None) -> bool:
    """Determine if a nutrient should be displayed."""
    # If focus list provided, only show those
    if focus_nutrients:
        return nutrient in focus_nutrients

    # Show if has meaningful variance in data (CV > 15%)
    if nutrient in all_stats and all_stats[nutrient] is not None:
        stats = all_stats[nutrient]
        if stats['mean'] > 0:
            cv = stats['stdev'] / stats['mean']
            if cv > 0.15:  # Coefficient of variation > 15%
                return True

    # Show if has user-defined target (using helper function)
    if get_target_value(nutrient, targets, 'min') is not None:
        return True
    if get_target_value(nutrient, targets, 'max') is not None:
        return True

    return False


def format_nutrient_value(value: float, nutrient: str) -> str:
    """Format nutrient value based on type."""
    if value == 0:
        return "0"
    elif 'kcal' in nutrient or '_mg' in nutrient or '_ug' in nutrient:
        return f"{value:.0f}"
    else:
        return f"{value:.1f}"


def get_nutrient_label(nutrient: str, max_length: int = 12) -> str:
    """Get shortened, readable label for nutrient."""
    label_map = {
        'energy_kcal': 'Energy',
        'protein_g': 'Protein',
        'fat_g': 'Fat',
        'carbs_total_g': 'Carbs',
        'fiber_total_g': 'Fiber',
        'sat_fat_g': 'Sat Fat',
        'sugar_g': 'Sugar',
        'sodium_mg': 'Sodium',
        'potassium_mg': 'Potassium',
        'calcium_mg': 'Calcium',
        'magnesium_mg': 'Magnesium',
        'vitamin_c_mg': 'Vit C',
        'vitamin_d_ug': 'Vit D',
        'iron_mg': 'Iron',
        'zinc_mg': 'Zinc',
    }

    if nutrient in label_map:
        return label_map[nutrient]

    # Generic shortening
    label = nutrient.replace('_kcal', '').replace('_g', '').replace('_mg', '').replace('_ug', '')
    label = label.replace('_', ' ').title()

    if len(label) > max_length:
        label = label[:max_length]

    return label


def print_comparison_table(daily_data: List[Dict], profile: Dict,
                           focus_nutrients: Optional[List[str]] = None):
    """Print daily comparison table with outlier detection."""
    if not daily_data:
        print("No data available.")
        return

    targets = profile.get('targets', {})

    # Calculate statistics for all nutrients
    all_stats = {}
    for nutrient in ALL_NUTRIENTS:
        values = [day['totals'].get(nutrient, 0) for day in daily_data]
        all_stats[nutrient] = calculate_statistics(values)

    # Determine which nutrients to display
    if focus_nutrients is None:
        # Default key nutrients for overview
        display_nutrients = [n for n in DEFAULT_DISPLAY_NUTRIENTS
                           if should_display_nutrient(n, all_stats, targets, None)]
    else:
        display_nutrients = focus_nutrients

    # Print header
    print("\n" + "=" * 110)
    print(f"DAILY NUTRITION COMPARISON - {daily_data[0]['date']} to {daily_data[-1]['date']} ({len(daily_data)} days)")
    print("=" * 110)
    print()

    # Calculate column widths
    date_width = 12
    type_width = 5
    value_width = 10
    indicator_width = 2

    # Print table header
    print(f"{'Date':<{date_width}} {'Type':<{type_width}}", end='')
    for nutrient in display_nutrients:
        label = get_nutrient_label(nutrient, max_length=10)
        print(f" {label:>{value_width+indicator_width}}", end='')
    print()
    print("-" * 110)

    # Print data rows
    for day in daily_data:
        date_str = day['date']
        day_type = day['day_type'][:4].title()

        print(f"{date_str:<{date_width}} {day_type:<{type_width}}", end='')

        for nutrient in display_nutrients:
            value = day['totals'].get(nutrient, 0)
            stats = all_stats.get(nutrient)

            indicator = get_outlier_indicator(value, stats, targets, nutrient)
            value_str = format_nutrient_value(value, nutrient)

            print(f" {value_str:>{value_width}}{indicator:<{indicator_width}}", end='')

        print()

    print()

    # Print summary statistics
    print("SUMMARY STATISTICS (from your actual data)")
    print("-" * 110)
    print(f"{'Nutrient':<25} {'Mean':>12} {'Median':>12} {'Std Dev':>12} {'Min':>12} {'Max':>12}")
    print("-" * 110)

    for nutrient in display_nutrients:
        stats = all_stats.get(nutrient)
        if stats:
            label = get_nutrient_label(nutrient, max_length=25)
            print(f"{label:<25} {stats['mean']:>12.1f} {stats['median']:>12.1f} "
                  f"{stats['stdev']:>12.1f} {stats['min']:>12.1f} {stats['max']:>12.1f}")

    print()

    # Detect and print significant outliers
    print("SIGNIFICANT OUTLIERS (±1.5 SD from your typical intake)")
    print("-" * 110)

    outlier_found = False
    for day in daily_data:
        day_outliers = []

        for nutrient in ALL_NUTRIENTS:
            stats = all_stats.get(nutrient)
            if not stats:
                continue

            value = day['totals'].get(nutrient, 0)
            if value == 0:
                continue

            mean = stats['mean']
            stdev = stats['stdev']

            if stdev > 0:
                z_score = (value - mean) / stdev

                if abs(z_score) >= 1.5:
                    # Check if has target using helper function
                    target_str = ""
                    target_min = get_target_value(nutrient, targets, 'min')
                    target_max = get_target_value(nutrient, targets, 'max')

                    if target_min is not None:
                        target_str = f" | Target min: {target_min}"
                    elif target_max is not None:
                        target_str = f" | Target max: {target_max}"

                    severity = "❌" if abs(z_score) >= 2.0 else "⚠️"
                    direction = "+" if z_score > 0 else ""

                    day_outliers.append({
                        'nutrient': nutrient,
                        'value': value,
                        'mean': mean,
                        'stdev': stdev,
                        'z_score': z_score,
                        'severity': severity,
                        'direction': direction,
                        'target_str': target_str,
                        'abs_z': abs(z_score)
                    })

        if day_outliers:
            outlier_found = True
            # Sort by severity (highest z-score first)
            day_outliers.sort(key=lambda x: x['abs_z'], reverse=True)

            print(f"\n{day['date']} ({day['day_type'].title()}):")
            for outlier in day_outliers:
                nutrient_label = get_nutrient_label(outlier['nutrient'], max_length=25)
                value_str = format_nutrient_value(outlier['value'], outlier['nutrient'])
                mean_str = format_nutrient_value(outlier['mean'], outlier['nutrient'])
                stdev_str = format_nutrient_value(outlier['stdev'], outlier['nutrient'])

                print(f"  {outlier['severity']} {nutrient_label}: {value_str} "
                      f"(your avg: {mean_str} ± {stdev_str}) "
                      f"[{outlier['direction']}{outlier['z_score']:.2f} SD]{outlier['target_str']}")

    if not outlier_found:
        print("\nNo significant statistical outliers detected. All days within ±1.5 SD of your typical intake.")

    print()
    print("=" * 110)
    print()
    print("Legend: ✓ = Within normal range | ⚠️ = 1.5+ SD or target miss | ❌ = 2+ SD outlier | · = No data")
    print()


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Daily nutrition comparison with outlier detection.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  %(prog)s 2025-11                     # All days in November
  %(prog)s 2025-11 --days 7             # Last 7 days of November
  %(prog)s 2025-11 --nutrients energy_kcal,protein_g,fiber_total_g  # Custom nutrients
  %(prog)s 2025-11 --all                # Show all 52 nutrients (verbose)
        '''
    )
    parser.add_argument('year_month', help='Year-month in YYYY-MM format')
    parser.add_argument('--days', type=int, help='Limit to last N days')
    parser.add_argument('--nutrients', help='Comma-separated list of nutrients to display')
    parser.add_argument('--all', action='store_true', help='Show all 52 tracked nutrients')

    args = parser.parse_args()

    # Parse year-month
    try:
        year, month = map(int, args.year_month.split('-'))
    except ValueError:
        print("Error: Invalid date format. Use YYYY-MM", file=sys.stderr)
        sys.exit(1)

    # Validate date ranges
    if not (1900 <= year <= 2100):
        print(f"Error: Year {year} out of valid range (1900-2100)", file=sys.stderr)
        sys.exit(1)
    if not (1 <= month <= 12):
        print(f"Error: Month {month} out of valid range (1-12)", file=sys.stderr)
        sys.exit(1)

    # Load data
    daily_data = load_daily_data(year, month, args.days)

    if not daily_data:
        print(f"No data found for {year:04d}-{month:02d}", file=sys.stderr)
        sys.exit(1)

    # Parse focus nutrients if provided
    focus_nutrients = None
    if args.nutrients:
        focus_nutrients = [n.strip() for n in args.nutrients.split(',')]

        # Validate provided nutrients
        invalid = [n for n in focus_nutrients if n not in ALL_NUTRIENTS]
        if invalid:
            print(f"Error: Invalid nutrient names: {', '.join(invalid)}", file=sys.stderr)
            print(f"\nValid nutrients include:", file=sys.stderr)
            print(f"  Macros: energy_kcal, protein_g, fat_g, carbs_total_g, fiber_total_g", file=sys.stderr)
            print(f"  Minerals: sodium_mg, potassium_mg, calcium_mg, magnesium_mg, iron_mg, zinc_mg", file=sys.stderr)
            print(f"  Vitamins: vitamin_c_mg, vitamin_d_ug, vitamin_b12_ug, etc.", file=sys.stderr)
            print(f"\nFor full list, use --all flag or see ALL_NUTRIENTS constant in script", file=sys.stderr)
            sys.exit(1)
    elif args.all:
        # Show all 52 nutrients
        focus_nutrients = ALL_NUTRIENTS

    # Load user profile
    profile = load_health_profile()

    # Print comparison table
    print_comparison_table(daily_data, profile, focus_nutrients)


if __name__ == "__main__":
    main()
