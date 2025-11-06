"""Compute percentage of Daily Value (%DV) for nutrients.

This module calculates what percentage of the Recommended Dietary Allowance (RDA)
or Adequate Intake (AI) is provided by a given amount of nutrients.

Usage:
    from compute_percent_dv import compute_percent_dv

    percent_dv = compute_percent_dv(
        nutrients={'protein_g': 28, 'vitamin_c_mg': 45},
        demographic='adult_male_19_50',
        rda_table=rda_data
    )
"""

from typing import Dict, Optional, List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def compute_percent_dv(
    nutrients: Dict[str, float],
    demographic: str,
    rda_table: Dict[str, Dict[str, float]],
    return_missing: bool = False
) -> Dict[str, float]:
    """
    Calculate percentage of Daily Value for each nutrient.

    %DV = (amount / RDA) * 100

    Args:
        nutrients: Dictionary of nutrient amounts.
                  Example: {'protein_g': 28, 'vitamin_c_mg': 45}
        demographic: Target demographic group from RDA table.
                    Example: 'adult_male_19_50', 'adult_female_31_50'
        rda_table: RDA/AI values organized by demographic.
                  Format: {'adult_male_19_50': {'protein_g': 56, ...}, ...}
        return_missing: If True, include nutrients not in RDA table with None values

    Returns:
        Dictionary mapping nutrient names to %DV values.
        Example: {'protein_g': 50.0, 'vitamin_c_mg': 50.0}

    Raises:
        ValueError: If demographic not found in RDA table
        TypeError: If inputs not of expected types

    Example:
        >>> rda_table = {
        ...     'adult_male_19_50': {'protein_g': 56, 'vitamin_c_mg': 90}
        ... }
        >>> nutrients = {'protein_g': 28, 'vitamin_c_mg': 45}
        >>> compute_percent_dv(nutrients, 'adult_male_19_50', rda_table)
        {'protein_g': 50.0, 'vitamin_c_mg': 50.0}
    """
    # Input validation
    if not isinstance(nutrients, dict):
        raise TypeError(f"nutrients must be dict, got {type(nutrients)}")
    if not isinstance(demographic, str):
        raise TypeError(f"demographic must be str, got {type(demographic)}")
    if not isinstance(rda_table, dict):
        raise TypeError(f"rda_table must be dict, got {type(rda_table)}")

    # Get RDA values for demographic
    if demographic not in rda_table:
        raise ValueError(
            f"Demographic '{demographic}' not found in RDA table. "
            f"Available: {list(rda_table.keys())}"
        )

    rda_values = rda_table[demographic]

    # Calculate %DV for each nutrient
    percent_dv = {}

    for nutrient, amount in nutrients.items():
        if not isinstance(amount, (int, float)):
            logger.warning(f"Non-numeric value for {nutrient}: {amount}, skipping")
            continue

        if nutrient in rda_values:
            rda_value = rda_values[nutrient]

            if rda_value is None or rda_value == 0:
                # No RDA established (e.g., fat_total_g)
                if return_missing:
                    percent_dv[nutrient] = None
                logger.debug(f"No RDA for {nutrient}, skipping %DV calculation")
                continue

            # Calculate percentage
            pct = (amount / rda_value) * 100
            percent_dv[nutrient] = pct

            # Log if significantly over or under
            if pct < 10:
                logger.debug(f"{nutrient}: {pct:.1f}% of DV (low)")
            elif pct > 200:
                logger.debug(f"{nutrient}: {pct:.1f}% of DV (high)")
        else:
            if return_missing:
                percent_dv[nutrient] = None
            logger.debug(f"Nutrient {nutrient} not in RDA table for {demographic}")

    return percent_dv


def compute_daily_totals(
    meals: List[Dict[str, float]],
    demographic: str,
    rda_table: Dict[str, Dict[str, float]]
) -> Dict[str, Dict[str, float]]:
    """
    Calculate daily nutrient totals and %DV from multiple meals.

    Args:
        meals: List of nutrient dictionaries (one per meal)
        demographic: Target demographic
        rda_table: RDA/AI table

    Returns:
        Dictionary with:
        - 'totals': Total nutrient amounts
        - 'percent_dv': Total %DV for each nutrient
        - 'rda': RDA values for reference

    Example:
        >>> meals = [
        ...     {'protein_g': 25, 'vitamin_c_mg': 20},
        ...     {'protein_g': 30, 'vitamin_c_mg': 15},
        ... ]
        >>> result = compute_daily_totals(meals, 'adult_male_19_50', rda_table)
        >>> result['totals']
        {'protein_g': 55, 'vitamin_c_mg': 35}
        >>> result['percent_dv']
        {'protein_g': 98.2, 'vitamin_c_mg': 38.9}
    """
    # Sum all nutrients across meals
    totals: Dict[str, float] = {}

    for meal in meals:
        for nutrient, amount in meal.items():
            if isinstance(amount, (int, float)):
                totals[nutrient] = totals.get(nutrient, 0) + amount

    # Calculate %DV
    percent_dv = compute_percent_dv(totals, demographic, rda_table)

    # Get RDA values for reference
    rda_values = rda_table[demographic]

    return {
        'totals': totals,
        'percent_dv': percent_dv,
        'rda': rda_values
    }


def get_nutrient_gaps(
    current_nutrients: Dict[str, float],
    demographic: str,
    rda_table: Dict[str, Dict[str, float]],
    threshold_pct: float = 100.0
) -> Dict[str, Dict[str, float]]:
    """
    Identify nutrients below target threshold.

    Args:
        current_nutrients: Current nutrient amounts
        demographic: Target demographic
        rda_table: RDA/AI table
        threshold_pct: Threshold percentage (default 100% of RDA)

    Returns:
        Dictionary of nutrients below threshold with:
        - 'current': Current amount
        - 'target': RDA amount
        - 'gap': Amount needed to reach threshold
        - 'percent_current': Current %DV

    Example:
        >>> nutrients = {'protein_g': 30, 'vitamin_c_mg': 20}
        >>> gaps = get_nutrient_gaps(nutrients, 'adult_male_19_50', rda_table)
        >>> gaps['protein_g']
        {'current': 30, 'target': 56, 'gap': 26, 'percent_current': 53.6}
    """
    rda_values = rda_table.get(demographic, {})
    percent_dv = compute_percent_dv(current_nutrients, demographic, rda_table)

    gaps = {}

    for nutrient, rda_value in rda_values.items():
        if rda_value is None or rda_value == 0:
            continue

        current = current_nutrients.get(nutrient, 0)
        pct = percent_dv.get(nutrient, 0)

        if pct < threshold_pct:
            target = (threshold_pct / 100) * rda_value
            gap = target - current

            gaps[nutrient] = {
                'current': current,
                'target': target,
                'gap': gap,
                'percent_current': pct,
                'rda': rda_value
            }

    return gaps


def format_percent_dv_report(
    nutrients: Dict[str, float],
    demographic: str,
    rda_table: Dict[str, Dict[str, float]],
    title: str = "Nutrition Report"
) -> str:
    """
    Generate a formatted text report of %DV values.

    Args:
        nutrients: Nutrient amounts
        demographic: Target demographic
        rda_table: RDA/AI table
        title: Report title

    Returns:
        Formatted string report

    Example:
        >>> print(format_percent_dv_report(nutrients, demo, rda_table, "Meal Summary"))
        Nutrition Report
        ================
        Protein:     28.0g   (50.0% of DV, RDA: 56g)
        Vitamin C:   45.0mg  (50.0% of DV, RDA: 90mg)
    """
    percent_dv = compute_percent_dv(nutrients, demographic, rda_table)
    rda_values = rda_table[demographic]

    lines = [
        "=" * 70,
        title,
        "=" * 70,
        ""
    ]

    # Sort nutrients by name for consistent output
    sorted_nutrients = sorted(nutrients.keys())

    for nutrient in sorted_nutrients:
        amount = nutrients[nutrient]

        if nutrient not in percent_dv:
            continue

        pct = percent_dv[nutrient]
        rda = rda_values.get(nutrient)

        # Extract unit from nutrient name
        unit = _extract_unit(nutrient)

        # Format nutrient name
        name = _format_nutrient_name(nutrient)

        # Visual indicator
        if pct < 50:
            indicator = "⚠️  LOW"
        elif pct < 100:
            indicator = "→  MODERATE"
        elif pct < 150:
            indicator = "✓  GOOD"
        else:
            indicator = "✓✓ HIGH"

        line = f"  {name:20s} {amount:7.1f}{unit:4s} ({pct:5.1f}% of DV, RDA: {rda}{unit}) {indicator}"
        lines.append(line)

    lines.append("")
    lines.append("=" * 70)

    return "\n".join(lines)


def _extract_unit(nutrient_key: str) -> str:
    """Extract unit suffix from nutrient key."""
    if '_kcal' in nutrient_key:
        return 'kcal'
    elif '_mg' in nutrient_key:
        return 'mg'
    elif '_ug' in nutrient_key or '_mcg' in nutrient_key:
        return 'µg'
    elif '_g' in nutrient_key:
        return 'g'
    elif '_iu' in nutrient_key:
        return 'IU'
    else:
        return ''


def _format_nutrient_name(nutrient_key: str) -> str:
    """Format nutrient key into readable name."""
    # Remove unit suffix
    name = nutrient_key
    for suffix in ['_kcal', '_mg', '_ug', '_mcg', '_g', '_iu', '_dfe', '_rae']:
        name = name.replace(suffix, '')

    # Replace underscores with spaces and title case
    name = name.replace('_', ' ').title()

    # Special cases
    replacements = {
        'Vitamin C': 'Vitamin C',
        'Vitamin B6': 'Vitamin B6',
        'Vitamin B12': 'Vitamin B12',
    }

    for old, new in replacements.items():
        if old in name:
            name = new
            break

    return name


if __name__ == "__main__":
    # Example usage
    print("=" * 70)
    print("Percentage Daily Value Calculation Examples")
    print("=" * 70)

    # Example RDA table (simplified)
    rda_data = {
        'adult_male_19_50': {
            'protein_g': 56,
            'vitamin_c_mg': 90,
            'folate_ug_dfe': 400,
            'iron_mg': 8,
            'calcium_mg': 1000,
            'vitamin_d_ug': 15,
        }
    }

    # Example meal
    meal_nutrients = {
        'protein_g': 28.0,
        'vitamin_c_mg': 45.0,
        'folate_ug_dfe': 100.0,
        'iron_mg': 2.5,
        'calcium_mg': 150.0,
        'vitamin_d_ug': 3.0,
    }

    print("\nSingle Meal Analysis:")
    print("-" * 70)

    percent_dv = compute_percent_dv(
        meal_nutrients,
        'adult_male_19_50',
        rda_data
    )

    for nutrient, pct in percent_dv.items():
        amount = meal_nutrients[nutrient]
        rda = rda_data['adult_male_19_50'][nutrient]
        unit = _extract_unit(nutrient)
        print(f"  {nutrient:20s}: {amount:7.1f}{unit:4s} = {pct:5.1f}% of RDA ({rda}{unit})")

    # Multiple meals example
    print("\n" + "=" * 70)
    print("Daily Total from Multiple Meals")
    print("=" * 70)

    meals = [
        {'protein_g': 25, 'vitamin_c_mg': 20, 'iron_mg': 2},
        {'protein_g': 30, 'vitamin_c_mg': 15, 'iron_mg': 3},
        {'protein_g': 20, 'vitamin_c_mg': 50, 'iron_mg': 2.5},
    ]

    daily = compute_daily_totals(meals, 'adult_male_19_50', rda_data)

    print("\nMeal breakdown:")
    for i, meal in enumerate(meals, 1):
        print(f"  Meal {i}: {meal}")

    print("\nDaily totals:")
    for nutrient, total in daily['totals'].items():
        pct = daily['percent_dv'].get(nutrient, 0)
        rda = daily['rda'].get(nutrient, 0)
        unit = _extract_unit(nutrient)
        status = "✓" if pct >= 100 else "⚠️"
        print(f"  {status} {nutrient:20s}: {total:7.1f}{unit:4s} = {pct:5.1f}% of RDA")

    # Gaps analysis
    print("\n" + "=" * 70)
    print("Nutrient Gaps Analysis")
    print("=" * 70)

    gaps = get_nutrient_gaps(daily['totals'], 'adult_male_19_50', rda_data)

    if gaps:
        print("\nNutrients below 100% RDA:")
        for nutrient, gap_info in gaps.items():
            unit = _extract_unit(nutrient)
            print(f"\n  {nutrient}:")
            print(f"    Current: {gap_info['current']:.1f}{unit} ({gap_info['percent_current']:.1f}%)")
            print(f"    Target:  {gap_info['target']:.1f}{unit}")
            print(f"    Gap:     {gap_info['gap']:.1f}{unit}")
    else:
        print("\n  ✓ All tracked nutrients meet RDA requirements!")

    # Formatted report
    print("\n" + "=" * 70)
    print(format_percent_dv_report(
        meal_nutrients,
        'adult_male_19_50',
        rda_data,
        "Grilled Chicken Breast with Vegetables"
    ))

    print("=" * 70)
