"""Validate food preparation nutrition adjustments.

This module provides validation functions to ensure that cooking adjustments
(retention factors, yield factors) produce physically and nutritionally plausible
results.

Usage:
    from validate_preparation_block import validate_preparation_block

    is_valid, errors = validate_preparation_block(preparation_data)
"""

from typing import Dict, List, Tuple, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def validate_preparation_block(
    preparation_data: Dict,
    strict: bool = False,
    energy_tolerance: float = 0.03
) -> Tuple[bool, List[str]]:
    """
    Validate a complete food preparation block.

    Checks:
    1. Required fields present
    2. Plausible yield factors (0.1-4.0)
    3. Energy balance (within ±3% by default)
    4. Retention factors in valid ranges (0.0-3.0)
    5. Nutrient values are non-negative
    6. Cooking method is recognized

    Args:
        preparation_data: Dictionary containing:
            - raw_weight: Raw weight in grams
            - cooked_weight: Cooked weight in grams
            - raw_nutrients: Dict of raw nutrient values
            - cooked_nutrients: Dict of cooked nutrient values
            - method: Cooking method name
        strict: If True, warnings become errors
        energy_tolerance: Acceptable energy balance deviation (default 0.03 = 3%)

    Returns:
        Tuple of (is_valid, error_messages)
        - is_valid: True if all checks pass
        - error_messages: List of validation error/warning messages

    Example:
        >>> data = {
        ...     'raw_weight': 200,
        ...     'cooked_weight': 150,
        ...     'raw_nutrients': {'protein_g': 46, 'energy_kcal': 220},
        ...     'cooked_nutrients': {'protein_g': 45, 'energy_kcal': 218},
        ...     'method': 'grilled'
        ... }
        >>> is_valid, errors = validate_preparation_block(data)
        >>> is_valid
        True
    """
    errors = []
    warnings = []

    # 1. Check required fields
    required_fields = ['raw_weight', 'cooked_weight', 'raw_nutrients', 'cooked_nutrients', 'method']
    for field in required_fields:
        if field not in preparation_data:
            errors.append(f"Missing required field: {field}")

    if errors:
        return False, errors

    # Extract data
    raw_weight = preparation_data['raw_weight']
    cooked_weight = preparation_data['cooked_weight']
    raw_nutrients = preparation_data['raw_nutrients']
    cooked_nutrients = preparation_data['cooked_nutrients']
    method = preparation_data['method']

    # 2. Validate types
    if not isinstance(raw_weight, (int, float)):
        errors.append(f"raw_weight must be numeric, got {type(raw_weight)}")
    if not isinstance(cooked_weight, (int, float)):
        errors.append(f"cooked_weight must be numeric, got {type(cooked_weight)}")
    if not isinstance(raw_nutrients, dict):
        errors.append(f"raw_nutrients must be dict, got {type(raw_nutrients)}")
    if not isinstance(cooked_nutrients, dict):
        errors.append(f"cooked_nutrients must be dict, got {type(cooked_nutrients)}")
    if not isinstance(method, str):
        errors.append(f"method must be string, got {type(method)}")

    if errors:
        return False, errors

    # 3. Validate weights are positive
    if raw_weight <= 0:
        errors.append(f"raw_weight must be positive, got {raw_weight}")
    if cooked_weight <= 0:
        errors.append(f"cooked_weight must be positive, got {cooked_weight}")

    # 4. Check yield factor is plausible
    if raw_weight > 0:
        yield_factor = cooked_weight / raw_weight

        if yield_factor < 0.1:
            errors.append(
                f"Implausible yield factor {yield_factor:.3f} (cooked/raw). "
                f"Minimum expected: 0.1 (90% loss)"
            )
        elif yield_factor > 4.0:
            errors.append(
                f"Implausible yield factor {yield_factor:.3f} (cooked/raw). "
                f"Maximum expected: 4.0 (4x weight gain)"
            )
        elif yield_factor < 0.3 or yield_factor > 3.5:
            warnings.append(
                f"Unusual yield factor {yield_factor:.3f}. "
                f"Typical range: 0.3-3.5"
            )

    # 5. Validate energy balance
    raw_energy = raw_nutrients.get('energy_kcal', raw_nutrients.get('calories'))
    cooked_energy = cooked_nutrients.get('energy_kcal', cooked_nutrients.get('calories'))

    if raw_energy and cooked_energy:
        if raw_energy > 0:
            energy_change = abs(cooked_energy - raw_energy) / raw_energy

            if energy_change > energy_tolerance:
                errors.append(
                    f"Energy balance check failed: {raw_energy:.1f} -> {cooked_energy:.1f} kcal "
                    f"(change: {energy_change:.1%}, tolerance: {energy_tolerance:.1%}). "
                    f"Energy should be conserved during cooking."
                )
            elif energy_change > energy_tolerance / 2:
                warnings.append(
                    f"Energy change {energy_change:.1%} approaching tolerance "
                    f"({energy_tolerance:.1%})"
                )

    # 6. Check for negative nutrient values
    for nutrient, value in {**raw_nutrients, **cooked_nutrients}.items():
        if isinstance(value, (int, float)) and value < 0:
            errors.append(f"Negative nutrient value: {nutrient} = {value}")

    # 7. Validate implied retention factors
    for nutrient in raw_nutrients:
        if nutrient in cooked_nutrients:
            raw_val = raw_nutrients[nutrient]
            cooked_val = cooked_nutrients[nutrient]

            if isinstance(raw_val, (int, float)) and isinstance(cooked_val, (int, float)):
                if raw_val > 0:
                    # Account for weight change in retention calculation
                    # retention = (cooked_amount / raw_amount) * (cooked_weight / raw_weight)
                    implied_retention = cooked_val / raw_val

                    if implied_retention < 0:
                        errors.append(
                            f"{nutrient}: negative retention factor {implied_retention:.3f}"
                        )
                    elif implied_retention > 3.0:
                        warnings.append(
                            f"{nutrient}: unusually high retention factor {implied_retention:.3f}. "
                            f"Max typical: 3.0 (e.g., beta-carotene)"
                        )

    # 8. Validate cooking method
    valid_methods = [
        'raw', 'grilled', 'grilling', 'baked', 'baking', 'roasted', 'roasting',
        'boiled', 'boiling', 'steamed', 'steaming', 'fried', 'frying',
        'pan_fried', 'sauteed', 'sauteing', 'stir_fried', 'stir_frying',
        'braised', 'braising', 'stewed', 'stewing', 'poached', 'poaching',
        'microwaved', 'microwaving', 'pressure_cooked', 'slow_cooked',
        'broiled', 'broiling', 'blanched', 'blanching', 'air_fried'
    ]

    method_normalized = method.lower().replace('-', '_').replace(' ', '_')
    if method_normalized not in valid_methods:
        warnings.append(
            f"Unrecognized cooking method: '{method}'. "
            f"This may indicate a typo or non-standard method."
        )

    # 9. Check for matching nutrient keys
    raw_keys = set(raw_nutrients.keys())
    cooked_keys = set(cooked_nutrients.keys())

    missing_in_cooked = raw_keys - cooked_keys
    missing_in_raw = cooked_keys - raw_keys

    if missing_in_cooked:
        warnings.append(
            f"Nutrients in raw but not cooked: {missing_in_cooked}"
        )
    if missing_in_raw:
        warnings.append(
            f"Nutrients in cooked but not raw: {missing_in_raw}"
        )

    # Combine errors and warnings
    all_messages = []
    if errors:
        all_messages.extend([f"ERROR: {e}" for e in errors])
    if warnings:
        if strict:
            all_messages.extend([f"ERROR: {w}" for w in warnings])
            errors.extend(warnings)
        else:
            all_messages.extend([f"WARNING: {w}" for w in warnings])

    is_valid = len(errors) == 0

    if is_valid and not warnings:
        logger.info("Validation passed: All checks OK")
    elif is_valid:
        logger.info(f"Validation passed with {len(warnings)} warnings")
    else:
        logger.error(f"Validation failed with {len(errors)} errors")

    return is_valid, all_messages


def validate_retention_factor(
    retention_factor: float,
    nutrient_name: str
) -> Tuple[bool, Optional[str]]:
    """
    Validate a single retention factor value.

    Args:
        retention_factor: Retention factor to validate
        nutrient_name: Name of nutrient for context

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not isinstance(retention_factor, (int, float)):
        return False, f"Retention factor must be numeric, got {type(retention_factor)}"

    if retention_factor < 0:
        return False, f"{nutrient_name}: Retention factor cannot be negative ({retention_factor})"

    if retention_factor > 3.0:
        return False, (
            f"{nutrient_name}: Retention factor {retention_factor} exceeds maximum "
            f"plausible value (3.0). Even nutrients with increased bioavailability "
            f"(e.g., beta-carotene) rarely exceed 3.0."
        )

    return True, None


def validate_yield_factor(
    yield_factor: float,
    food_category: str
) -> Tuple[bool, Optional[str]]:
    """
    Validate a single yield factor value.

    Args:
        yield_factor: Yield factor to validate
        food_category: Food category for context

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not isinstance(yield_factor, (int, float)):
        return False, f"Yield factor must be numeric, got {type(yield_factor)}"

    if yield_factor <= 0:
        return False, f"{food_category}: Yield factor must be positive ({yield_factor})"

    if yield_factor < 0.1:
        return False, (
            f"{food_category}: Yield factor {yield_factor} too low. "
            f"Even extreme dehydration rarely goes below 0.1"
        )

    if yield_factor > 4.0:
        return False, (
            f"{food_category}: Yield factor {yield_factor} too high. "
            f"Even dry grains/legumes rarely exceed 4.0 when cooked."
        )

    return True, None


def validate_nutrient_value(
    value: float,
    nutrient_name: str,
    allow_zero: bool = True
) -> Tuple[bool, Optional[str]]:
    """
    Validate a single nutrient value.

    Args:
        value: Nutrient value to validate
        nutrient_name: Name of nutrient
        allow_zero: Whether zero values are acceptable

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not isinstance(value, (int, float)):
        return False, f"{nutrient_name}: Value must be numeric, got {type(value)}"

    if value < 0:
        return False, f"{nutrient_name}: Value cannot be negative ({value})"

    if not allow_zero and value == 0:
        return False, f"{nutrient_name}: Value cannot be zero"

    # Check for unreasonably large values (potential data error)
    max_values = {
        'protein_g': 100,      # per 100g food
        'fat_g': 100,
        'carbohydrate_g': 100,
        'energy_kcal': 900,    # Pure fat is ~900 kcal/100g
        'vitamin_c_mg': 2000,  # Even supplements rarely exceed UL
        'calcium_mg': 2500,
        'iron_mg': 50,
    }

    # Extract base nutrient name
    base = nutrient_name.lower()
    for suffix in ['_g', '_mg', '_ug', '_kcal']:
        base = base.replace(suffix, '')

    if base in max_values and value > max_values[base]:
        return False, (
            f"{nutrient_name}: Value {value} exceeds maximum plausible value "
            f"({max_values[base]}). This may indicate a data entry error."
        )

    return True, None


def generate_validation_report(
    preparation_data: Dict,
    energy_tolerance: float = 0.03
) -> str:
    """
    Generate a detailed validation report.

    Args:
        preparation_data: Preparation block to validate
        energy_tolerance: Energy balance tolerance

    Returns:
        Formatted validation report string
    """
    is_valid, messages = validate_preparation_block(
        preparation_data,
        strict=False,
        energy_tolerance=energy_tolerance
    )

    lines = [
        "=" * 70,
        "FOOD PREPARATION VALIDATION REPORT",
        "=" * 70,
        ""
    ]

    # Summary
    if is_valid:
        lines.append("✓ VALIDATION PASSED")
    else:
        lines.append("✗ VALIDATION FAILED")

    lines.append("")

    # Details
    raw_weight = preparation_data.get('raw_weight', 0)
    cooked_weight = preparation_data.get('cooked_weight', 0)
    method = preparation_data.get('method', 'unknown')

    if raw_weight > 0:
        yield_factor = cooked_weight / raw_weight
        weight_change_pct = ((cooked_weight - raw_weight) / raw_weight) * 100

        lines.append(f"Cooking Method: {method}")
        lines.append(f"Raw Weight:     {raw_weight:.1f}g")
        lines.append(f"Cooked Weight:  {cooked_weight:.1f}g")
        lines.append(f"Yield Factor:   {yield_factor:.3f} ({weight_change_pct:+.1f}%)")
        lines.append("")

    # Energy balance
    raw_nutrients = preparation_data.get('raw_nutrients', {})
    cooked_nutrients = preparation_data.get('cooked_nutrients', {})

    raw_energy = raw_nutrients.get('energy_kcal')
    cooked_energy = cooked_nutrients.get('energy_kcal')

    if raw_energy and cooked_energy:
        energy_change_pct = ((cooked_energy - raw_energy) / raw_energy) * 100
        lines.append(f"Energy Balance:")
        lines.append(f"  Raw:    {raw_energy:.1f} kcal")
        lines.append(f"  Cooked: {cooked_energy:.1f} kcal")
        lines.append(f"  Change: {energy_change_pct:+.1f}%")
        lines.append(f"  Tolerance: ±{energy_tolerance * 100:.1f}%")
        lines.append("")

    # Messages
    if messages:
        lines.append("Issues Found:")
        for msg in messages:
            lines.append(f"  {msg}")
    else:
        lines.append("No issues found.")

    lines.append("")
    lines.append("=" * 70)

    return "\n".join(lines)


if __name__ == "__main__":
    # Example usage
    print("=" * 70)
    print("Food Preparation Validation Examples")
    print("=" * 70)

    # Example 1: Valid preparation
    print("\nExample 1: Valid Grilled Chicken")
    print("-" * 70)

    valid_data = {
        'raw_weight': 200,
        'cooked_weight': 150,
        'raw_nutrients': {
            'protein_g': 46.0,
            'fat_g': 5.0,
            'carbohydrate_g': 0.0,
            'energy_kcal': 220
        },
        'cooked_nutrients': {
            'protein_g': 45.1,  # 98% retention
            'fat_g': 4.25,      # 85% retention (fat drips)
            'carbohydrate_g': 0.0,
            'energy_kcal': 217
        },
        'method': 'grilled'
    }

    is_valid, messages = validate_preparation_block(valid_data)
    print(f"Valid: {is_valid}")
    if messages:
        for msg in messages:
            print(f"  {msg}")

    # Example 2: Energy balance violation
    print("\n" + "=" * 70)
    print("Example 2: Energy Balance Violation")
    print("-" * 70)

    invalid_energy = {
        'raw_weight': 200,
        'cooked_weight': 150,
        'raw_nutrients': {'energy_kcal': 220},
        'cooked_nutrients': {'energy_kcal': 180},  # 18% loss - too much!
        'method': 'grilled'
    }

    is_valid, messages = validate_preparation_block(invalid_energy)
    print(f"Valid: {is_valid}")
    for msg in messages:
        print(f"  {msg}")

    # Example 3: Implausible yield factor
    print("\n" + "=" * 70)
    print("Example 3: Implausible Yield Factor")
    print("-" * 70)

    implausible_yield = {
        'raw_weight': 100,
        'cooked_weight': 500,  # 5x weight gain - impossible!
        'raw_nutrients': {'protein_g': 20},
        'cooked_nutrients': {'protein_g': 20},
        'method': 'boiled'
    }

    is_valid, messages = validate_preparation_block(implausible_yield)
    print(f"Valid: {is_valid}")
    for msg in messages:
        print(f"  {msg}")

    # Example 4: Full validation report
    print("\n" + "=" * 70)
    print(generate_validation_report(valid_data))

    print("=" * 70)
