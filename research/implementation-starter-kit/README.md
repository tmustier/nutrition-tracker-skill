# Implementation Starter Kit

A comprehensive toolkit for implementing food preparation adjustments in the nutrition tracking system. This kit provides production-ready data tables, code templates, and test cases based on USDA research and established nutritional science.

## Overview

When food is cooked, its nutritional content changes due to:
1. **Nutrient retention**: Heat-sensitive vitamins degrade during cooking
2. **Yield changes**: Water loss (meats) or gain (pasta, rice) affects concentration
3. **Bioavailability**: Some nutrients become more accessible after cooking

This starter kit provides the tools to accurately adjust raw food nutrition data to reflect cooked values.

## Quick Start

### 1. Load Data Tables
```python
import yaml

# Load retention factors
with open('data-tables/retention-factors.yaml') as f:
    retention_factors = yaml.safe_load(f)

# Load yield factors
with open('data-tables/yield-factors.yaml') as f:
    yield_factors = yaml.safe_load(f)

# Load RDA values
with open('data-tables/rda-values.yaml') as f:
    rda_values = yaml.safe_load(f)
```

### 2. Apply Adjustments
```python
from code_templates.apply_retention_factors import apply_retention_factors
from code_templates.calculate_yield_adjustment import calculate_yield_adjustment

# Example: 200g raw chicken breast, grilled
raw_weight = 200  # grams
raw_nutrients = {
    'protein_g': 46.0,
    'vitamin_c_mg': 0.0,
    'folate_ug': 8.0,
    'energy_kcal': 220
}

# Step 1: Calculate cooked weight
cooked_weight = calculate_yield_adjustment(
    raw_weight, 'chicken_breast', 'grilled', yield_factors
)

# Step 2: Apply retention factors
cooked_nutrients = apply_retention_factors(
    raw_nutrients, 'grilled', retention_factors['retention_factors']
)

# Step 3: Adjust for concentration due to weight change
concentration_factor = cooked_weight / raw_weight
for nutrient in cooked_nutrients:
    if nutrient != 'energy_kcal':  # Energy should be calculated separately
        cooked_nutrients[nutrient] *= concentration_factor
```

### 3. Validate Results
```python
from code_templates.validate_preparation_block import validate_preparation_block

is_valid, errors = validate_preparation_block({
    'raw_weight': raw_weight,
    'cooked_weight': cooked_weight,
    'raw_nutrients': raw_nutrients,
    'cooked_nutrients': cooked_nutrients,
    'method': 'grilled'
})

if not is_valid:
    print(f"Validation errors: {errors}")
```

### 4. Calculate % Daily Value
```python
from code_templates.compute_percent_dv import compute_percent_dv

percent_dv = compute_percent_dv(
    cooked_nutrients,
    'adult_male_19_50',
    rda_values
)
print(f"This meal provides {percent_dv['protein_g']:.1f}% of daily protein needs")
```

## Directory Structure

```
implementation-starter-kit/
├── README.md                        # This file
├── data-tables/
│   ├── retention-factors.yaml       # Nutrient retention by cooking method
│   ├── yield-factors.yaml           # Raw-to-cooked weight conversion
│   ├── cooking-methods.yaml         # Taxonomy of cooking methods
│   └── rda-values.yaml              # RDA/DRI by demographic group
├── code-templates/
│   ├── apply_retention_factors.py   # Apply USDA retention factors
│   ├── calculate_yield_adjustment.py # Calculate weight changes
│   ├── compute_percent_dv.py        # Calculate % daily value
│   └── validate_preparation_block.py # Validate nutrition adjustments
└── test-cases/
    ├── grilled-chicken-test.yaml    # Complete example: grilled chicken
    ├── pasta-boiled-test.yaml       # Example: boiled pasta
    └── stir-fry-recipe-test.yaml    # Complex example: multi-ingredient stir-fry
```

## Data Tables

### retention-factors.yaml
Contains USDA Table of Nutrient Retention Factors data for major nutrients and cooking methods. Organized by nutrient with method-specific multipliers.

**Key insights:**
- Water-soluble vitamins (C, B-vitamins) have high losses in boiling
- Fat-soluble vitamins are more stable
- Minerals are stable unless boiling water is discarded
- Protein remains largely stable across cooking methods

### yield-factors.yaml
Raw-to-cooked weight conversion factors derived from USDA Table of Cooking Yields.

**Key principles:**
- Meats lose water: yield factors typically 0.65-0.85
- Grains gain water: yield factors typically 2.0-3.5
- Vegetables vary by water content: 0.50-0.95

### cooking-methods.yaml
Standardized taxonomy of cooking methods with temperature ranges and typical durations.

### rda-values.yaml
Recommended Dietary Allowances (RDA) and Adequate Intakes (AI) from the Dietary Reference Intakes (DRI) reports.

## Code Templates

All Python templates include:
- Type hints for better IDE support
- Comprehensive docstrings
- Error handling for edge cases
- Example usage in `__main__` block
- Production-ready code quality

### apply_retention_factors.py
Core logic for applying USDA retention factors to nutrient values based on cooking method.

### calculate_yield_adjustment.py
Calculates the cooked weight of food based on raw weight and cooking method.

### compute_percent_dv.py
Computes percentage of Daily Value (%DV) for nutrients relative to RDA/DRI values.

### validate_preparation_block.py
Validates that cooking adjustments are physically and nutritionally plausible.

**Validation checks:**
- Energy balance (should match within ±3%)
- Plausible yield factors (0.3-4.0)
- Retention factors within valid ranges (0.0-3.0)
- Required fields present

## Test Cases

Each test case provides:
- **Input**: Raw nutrients, portions, cooking method
- **Expected output**: Adjusted cooked nutrients
- **Validation criteria**: Energy balance checks

### grilled-chicken-test.yaml
Single ingredient example demonstrating protein stability and weight loss.

### pasta-boiled-test.yaml
Example of grains gaining water, demonstrating concentration effects.

### stir-fry-recipe-test.yaml
Complex multi-ingredient recipe showing how to handle:
- Multiple foods with different yield factors
- Mixed cooking methods
- Added fats/oils during cooking

## Integration Guidelines

### For Backend Systems

1. **Store both raw and cooked data**
   ```python
   food_entry = {
       'raw': {
           'weight_g': 200,
           'nutrients': {...}
       },
       'preparation': {
           'method': 'grilled',
           'temperature_c': 200,
           'duration_min': 15
       },
       'cooked': {
           'weight_g': 150,
           'nutrients': {...}
       }
   }
   ```

2. **Validate on input**
   - Use `validate_preparation_block.py` to catch data entry errors
   - Log validation warnings for manual review

3. **Track data provenance**
   - Mark whether nutrients are measured or calculated
   - Store retention factor source (USDA Table version)
   - Include calculation timestamp

### For UI/UX

1. **Progressive disclosure**
   - Show simple view: "Grilled Chicken Breast (150g cooked)"
   - Expand to show: "From 200g raw, 25% weight loss"

2. **User-friendly cooking methods**
   - Map detailed methods to common terms
   - Example: "pan_fried_no_coating" → "Pan-fried"

3. **Visual feedback**
   - Highlight nutrients with significant changes
   - Show before/after comparisons for education

### For Recipe Systems

When calculating recipe nutrition:

1. **Calculate each ingredient separately**
   ```python
   for ingredient in recipe.ingredients:
       cooked = apply_cooking_adjustments(
           ingredient.raw_nutrients,
           ingredient.cooking_method
       )
   ```

2. **Account for added ingredients**
   - Cooking oils, butter, marinades
   - These don't undergo the same transformations

3. **Handle composite methods**
   - Stir-fry: quick high-heat (minimal vitamin loss)
   - Braised: searing + slow cooking (liquid retained)

## Scientific References

1. **USDA Table of Nutrient Retention Factors, Release 6 (2007)**
   - Primary source for retention factors
   - Covers 40+ nutrients, 120+ cooking methods

2. **USDA Table of Cooking Yields for Meat and Poultry (2012)**
   - Comprehensive yield factors for proteins
   - Includes various cooking methods and temperatures

3. **Dietary Reference Intakes (DRI) Reports**
   - Institute of Medicine / National Academies
   - RDA, AI, UL values by demographic group

4. **FoodData Central (USDA)**
   - Modern nutrient database
   - Includes some cooked vs. raw comparisons

## Common Pitfalls

### ❌ Don't double-apply adjustments
```python
# WRONG: Applying retention factor twice
cooked = raw * retention_factor * retention_factor
```

### ❌ Don't ignore yield changes
```python
# WRONG: Forgetting that nutrients concentrate when water is lost
cooked_protein = raw_protein * retention_factor
# CORRECT: Account for concentration
cooked_protein = (raw_protein * retention_factor) / (cooked_weight / raw_weight)
```

### ❌ Don't use retention factors for added ingredients
```python
# WRONG: Applying retention to oil added during cooking
oil_cooked = oil_added * retention_factor
# CORRECT: Added ingredients don't transform
oil_cooked = oil_added  # (minus any that's discarded)
```

### ✅ Do validate energy balance
```python
# Energy should be conserved (within measurement error)
energy_difference = abs(cooked_energy - raw_energy) / raw_energy
assert energy_difference < 0.03, "Energy balance check failed"
```

## Extending the System

### Adding New Nutrients

1. Add retention factors to `retention-factors.yaml`
2. Add RDA values to `rda-values.yaml`
3. Update test cases with expected values
4. Run validation suite

### Adding New Cooking Methods

1. Research retention factors from USDA or peer-reviewed sources
2. Add to `cooking-methods.yaml` taxonomy
3. Add method-specific retention factors
4. Measure/research yield factors
5. Create test case
6. Document assumptions

### Adding New Food Categories

1. Research category-specific yield factors
2. Add to `yield-factors.yaml`
3. Consider if retention factors differ (usually don't)
4. Create representative test cases

## License

This implementation kit is based on public domain USDA data and scientific literature. The code templates are provided as-is for use in the nutrition-tracking project.

## Contributing

When adding new data:
1. Cite scientific sources
2. Include confidence estimates
3. Add test cases demonstrating usage
4. Document assumptions and limitations

## Version History

- **v1.0** (2025-11-06): Initial release
  - Core retention factors for 6 nutrient groups
  - Yield factors for 10 common food categories
  - 4 production-ready code templates
  - 3 comprehensive test cases
