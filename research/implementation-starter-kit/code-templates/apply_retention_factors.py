"""Apply USDA retention factors to nutrients based on cooking method.

This module implements the application of nutrient retention factors from the
USDA Table of Nutrient Retention Factors, Release 6 (2007). Retention factors
represent the fraction of nutrients that remain in food after cooking.

Usage:
    from apply_retention_factors import apply_retention_factors

    cooked_nutrients = apply_retention_factors(
        raw_nutrients={'protein_g': 50, 'vitamin_c_mg': 20},
        cooking_method='grilled',
        retention_table=retention_data
    )
"""

from typing import Dict, Optional, Union
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def apply_retention_factors(
    nutrients: Dict[str, float],
    cooking_method: str,
    retention_table: Dict[str, Dict[str, float]],
    strict: bool = False
) -> Dict[str, float]:
    """
    Apply retention factors to nutrient values based on cooking method.

    This function multiplies each nutrient value by its corresponding retention
    factor for the specified cooking method. Nutrients not found in the retention
    table are preserved unchanged (retention factor = 1.0) unless strict mode is enabled.

    Args:
        nutrients: Dictionary mapping nutrient names to raw values.
                  Example: {'protein_g': 50, 'vitamin_c_mg': 20, 'energy_kcal': 200}
        cooking_method: Standardized cooking method name (e.g., 'grilled', 'boiled').
                       Must match a method in the retention table.
        retention_table: Dictionary mapping nutrient names to cooking methods to
                        retention factors. Format:
                        {'vitamin_c': {'grilled': 0.75, 'boiled': 0.45}, ...}
        strict: If True, raises ValueError when nutrient not found in table.
               If False (default), uses 1.0 retention factor with warning.

    Returns:
        Dictionary with same keys as input, with values multiplied by retention factors.

    Raises:
        ValueError: If cooking_method not found in table, or if strict=True and
                   nutrient not found in table.
        TypeError: If inputs are not of expected types.

    Example:
        >>> retention_table = {
        ...     'vitamin_c': {'grilled': 0.75, 'boiled': 0.45},
        ...     'protein': {'grilled': 0.98, 'boiled': 1.00}
        ... }
        >>> nutrients = {'vitamin_c_mg': 40, 'protein_g': 50}
        >>> result = apply_retention_factors(nutrients, 'grilled', retention_table)
        >>> result
        {'vitamin_c_mg': 30.0, 'protein_g': 49.0}
    """
    # Input validation
    if not isinstance(nutrients, dict):
        raise TypeError(f"nutrients must be dict, got {type(nutrients)}")
    if not isinstance(cooking_method, str):
        raise TypeError(f"cooking_method must be str, got {type(cooking_method)}")
    if not isinstance(retention_table, dict):
        raise TypeError(f"retention_table must be dict, got {type(retention_table)}")

    if not nutrients:
        logger.warning("Empty nutrients dictionary provided")
        return {}

    # Normalize cooking method to lowercase for matching
    cooking_method_normalized = cooking_method.lower().replace('-', '_').replace(' ', '_')

    # Apply retention factors
    adjusted_nutrients = {}

    for nutrient_key, raw_value in nutrients.items():
        # Validate nutrient value
        if not isinstance(raw_value, (int, float)):
            logger.warning(f"Non-numeric value for {nutrient_key}: {raw_value}, skipping")
            continue

        # Extract base nutrient name (remove unit suffix like _mg, _g, _ug)
        # Example: 'vitamin_c_mg' -> 'vitamin_c'
        nutrient_base = _extract_nutrient_base(nutrient_key)

        # Get retention factor
        retention_factor = _get_retention_factor(
            nutrient_base,
            cooking_method_normalized,
            retention_table,
            strict
        )

        # Apply retention factor
        adjusted_value = raw_value * retention_factor
        adjusted_nutrients[nutrient_key] = adjusted_value

        # Log significant changes
        if abs(retention_factor - 1.0) > 0.1:  # >10% change
            logger.debug(
                f"{nutrient_key}: {raw_value:.2f} -> {adjusted_value:.2f} "
                f"(retention: {retention_factor:.2%})"
            )

    return adjusted_nutrients


def _extract_nutrient_base(nutrient_key: str) -> str:
    """
    Extract base nutrient name from key with unit suffix.

    Examples:
        'vitamin_c_mg' -> 'vitamin_c'
        'protein_g' -> 'protein'
        'folate_ug_dfe' -> 'folate'
        'energy_kcal' -> 'energy'

    Args:
        nutrient_key: Nutrient key with unit suffix

    Returns:
        Base nutrient name without unit
    """
    # Common unit suffixes to remove
    unit_suffixes = ['_g', '_mg', '_ug', '_mcg', '_kcal', '_kj', '_iu', '_dfe', '_rae']

    nutrient_base = nutrient_key.lower()

    # Remove unit suffixes (process longer suffixes first)
    for suffix in sorted(unit_suffixes, key=len, reverse=True):
        if nutrient_base.endswith(suffix):
            nutrient_base = nutrient_base[:-len(suffix)]
            break

    return nutrient_base


def _get_retention_factor(
    nutrient_base: str,
    cooking_method: str,
    retention_table: Dict[str, Dict[str, float]],
    strict: bool
) -> float:
    """
    Get retention factor for a nutrient and cooking method.

    Args:
        nutrient_base: Base nutrient name (e.g., 'vitamin_c')
        cooking_method: Cooking method (e.g., 'grilled')
        retention_table: Retention factor lookup table
        strict: If True, raise error when not found; if False, return 1.0

    Returns:
        Retention factor (0.0 to ~3.0, typically 0.4 to 1.0)

    Raises:
        ValueError: If strict=True and nutrient/method not found
    """
    # Check if nutrient exists in table
    if nutrient_base not in retention_table:
        if strict:
            raise ValueError(
                f"Nutrient '{nutrient_base}' not found in retention table. "
                f"Available: {list(retention_table.keys())}"
            )
        else:
            logger.debug(
                f"Nutrient '{nutrient_base}' not in retention table, "
                f"using default retention factor 1.0"
            )
            return 1.0

    nutrient_methods = retention_table[nutrient_base]

    # Check if cooking method exists for this nutrient
    if cooking_method not in nutrient_methods:
        # Try common variations
        method_variations = [
            cooking_method,
            cooking_method.replace('_', ''),
            cooking_method.replace('_', '-'),
        ]

        for variant in method_variations:
            if variant in nutrient_methods:
                return float(nutrient_methods[variant])

        if strict:
            raise ValueError(
                f"Cooking method '{cooking_method}' not found for nutrient "
                f"'{nutrient_base}'. Available: {list(nutrient_methods.keys())}"
            )
        else:
            # Use 'raw' as default if available, otherwise 1.0
            if 'raw' in nutrient_methods:
                return float(nutrient_methods['raw'])
            else:
                logger.warning(
                    f"No retention factor for '{nutrient_base}' + '{cooking_method}', "
                    f"using 1.0"
                )
                return 1.0

    retention_factor = float(nutrient_methods[cooking_method])

    # Validate retention factor is plausible
    if not (0.0 <= retention_factor <= 3.0):
        logger.warning(
            f"Unusual retention factor {retention_factor} for "
            f"{nutrient_base}/{cooking_method}"
        )

    return retention_factor


def apply_retention_with_energy_check(
    nutrients: Dict[str, float],
    cooking_method: str,
    retention_table: Dict[str, Dict[str, float]],
    tolerance: float = 0.05
) -> Dict[str, float]:
    """
    Apply retention factors and verify energy balance is maintained.

    Energy (calories) should be conserved during cooking (within measurement error).
    This function applies retention factors and checks that energy changes are
    within acceptable tolerance.

    Args:
        nutrients: Raw nutrient values including energy
        cooking_method: Cooking method
        retention_table: Retention factor table
        tolerance: Acceptable energy change fraction (default 0.05 = 5%)

    Returns:
        Adjusted nutrients

    Raises:
        ValueError: If energy balance check fails
    """
    raw_energy = nutrients.get('energy_kcal', nutrients.get('calories', 0))

    adjusted = apply_retention_factors(nutrients, cooking_method, retention_table)

    cooked_energy = adjusted.get('energy_kcal', adjusted.get('calories', 0))

    if raw_energy > 0 and cooked_energy > 0:
        energy_change = abs(cooked_energy - raw_energy) / raw_energy

        if energy_change > tolerance:
            raise ValueError(
                f"Energy balance check failed: {raw_energy:.1f} kcal -> "
                f"{cooked_energy:.1f} kcal (change: {energy_change:.1%}, "
                f"tolerance: {tolerance:.1%})"
            )

    return adjusted


if __name__ == "__main__":
    # Example usage
    print("=" * 60)
    print("USDA Retention Factor Application Example")
    print("=" * 60)

    # Example retention table (simplified)
    retention_data = {
        'vitamin_c': {
            'raw': 1.00,
            'grilled': 0.75,
            'boiled': 0.45,
            'steaming': 0.80,
        },
        'protein': {
            'raw': 1.00,
            'grilled': 0.98,
            'boiled': 1.00,
            'steaming': 1.00,
        },
        'folate': {
            'raw': 1.00,
            'grilled': 0.80,
            'boiled': 0.50,
            'steaming': 0.70,
        },
        'iron': {
            'raw': 1.00,
            'grilled': 1.00,
            'boiled': 1.00,
            'steaming': 1.00,
        }
    }

    # Raw chicken breast nutrients (per 200g)
    raw_nutrients = {
        'protein_g': 46.0,
        'vitamin_c_mg': 0.0,
        'folate_ug': 8.0,
        'iron_mg': 0.8,
        'energy_kcal': 220
    }

    print("\nRaw Chicken Breast (200g):")
    for nutrient, value in raw_nutrients.items():
        print(f"  {nutrient}: {value}")

    # Apply grilling
    print("\n" + "-" * 60)
    print("After Grilling:")
    print("-" * 60)

    cooked_nutrients = apply_retention_factors(
        raw_nutrients,
        'grilled',
        retention_data
    )

    for nutrient, value in cooked_nutrients.items():
        raw_value = raw_nutrients[nutrient]
        change = ((value - raw_value) / raw_value * 100) if raw_value else 0
        print(f"  {nutrient}: {value:.2f} (change: {change:+.1f}%)")

    # Compare multiple cooking methods
    print("\n" + "=" * 60)
    print("Comparison Across Cooking Methods")
    print("=" * 60)

    methods = ['grilled', 'boiled', 'steaming']

    for method in methods:
        cooked = apply_retention_factors(raw_nutrients, method, retention_data)
        print(f"\n{method.capitalize()}:")
        print(f"  Vitamin C: {cooked['vitamin_c_mg']:.2f} mg")
        print(f"  Folate: {cooked['folate_ug']:.2f} µg")
        print(f"  Protein: {cooked['protein_g']:.2f} g")
        print(f"  Iron: {cooked['iron_mg']:.2f} mg")

    print("\n" + "=" * 60)
