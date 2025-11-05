# Nutrition Schema Versions

## Introduction

This document defines the evolution of the nutrition data schema used in the nutrition tracking project. The schema versioning system ensures data consistency, enables backward compatibility, and provides clear migration paths as the nutritional database expands.

### Versioning Approach

- **Schema Version 1 (Legacy)**: Core 24 nutrients covering essential macronutrients, major minerals, and basic micronutrients
- **Schema Version 2 (Current)**: Expanded 51 nutrients with comprehensive vitamin profiles, trace minerals, and fatty acid breakdown
- **Optional Extensions**: Ultra-trace minerals for advanced tracking (4 additional fields)

All schemas use a structured `per_portion` format where:
- **0 means TRUE ZERO** (confirmed absence, not placeholder)
- **NULL/missing means UNKNOWN** (data not yet available)
- All numeric values must be non-negative
- Units are embedded in field names for clarity

---

## Schema Version 1 (Legacy)

**Active Period**: Project start → 2025-11-05
**Total Fields**: 24 core nutrients

### Complete Field List

#### Core Macronutrients (8 fields)
| Field Name | Unit | Description |
|------------|------|-------------|
| `energy_kcal` | kcal | Total energy content (kilocalories) |
| `protein_g` | g | Total protein |
| `fat_g` | g | Total fat |
| `sat_fat_g` | g | Saturated fatty acids |
| `mufa_g` | g | Monounsaturated fatty acids (MUFA) |
| `pufa_g` | g | Polyunsaturated fatty acids (PUFA) |
| `trans_fat_g` | g | Trans fatty acids |
| `cholesterol_mg` | mg | Dietary cholesterol |

#### Carbohydrates (7 fields)
| Field Name | Unit | Description |
|------------|------|-------------|
| `carbs_total_g` | g | Total carbohydrates |
| `carbs_available_g` | g | Available (digestible) carbohydrates |
| `sugar_g` | g | Total sugars |
| `fiber_total_g` | g | Total dietary fiber |
| `fiber_soluble_g` | g | Soluble fiber |
| `fiber_insoluble_g` | g | Insoluble fiber |
| `polyols_g` | g | Sugar alcohols (erythritol, xylitol, etc.) |

#### Minerals (8 fields)
| Field Name | Unit | Description |
|------------|------|-------------|
| `sodium_mg` | mg | Sodium |
| `potassium_mg` | mg | Potassium |
| `calcium_mg` | mg | Calcium |
| `magnesium_mg` | mg | Magnesium |
| `iron_mg` | mg | Iron |
| `zinc_mg` | mg | Zinc |
| `manganese_mg` | mg | Manganese |
| `iodine_ug` | µg | Iodine |

#### Vitamins (1 field)
| Field Name | Unit | Description |
|------------|------|-------------|
| `vitamin_c_mg` | mg | Vitamin C (ascorbic acid) |

### Schema V1 Limitations

- **Incomplete vitamin coverage**: Only vitamin C tracked
- **Missing trace minerals**: No copper, selenium, phosphorus, etc.
- **No fatty acid breakdown**: PUFA not split into omega-3/omega-6
- **Limited for RDA tracking**: Cannot assess full micronutrient adequacy

---

## Schema Version 2 (Current)

**Active Since**: 2025-11-05
**Total Fields**: 49 required nutrients

### Complete Field List

#### 1. Core Macronutrients (9 fields)
| Field Name | Unit | Description | Status |
|------------|------|-------------|--------|
| `energy_kcal` | kcal | Total energy content | Existing |
| `protein_g` | g | Total protein | Existing |
| `fat_g` | g | Total fat | Existing |
| `sat_fat_g` | g | Saturated fatty acids | Existing |
| `mufa_g` | g | Monounsaturated fatty acids | Existing |
| `pufa_g` | g | Polyunsaturated fatty acids | Existing |
| `trans_fat_g` | g | Trans fatty acids | Existing |
| `cholesterol_mg` | mg | Dietary cholesterol | Existing |
| `water_g` | g | Water content | **NEW** |

#### 2. Carbohydrates (7 fields)
| Field Name | Unit | Description | Status |
|------------|------|-------------|--------|
| `carbs_total_g` | g | Total carbohydrates | Existing |
| `carbs_available_g` | g | Available (digestible) carbs | Existing |
| `sugar_g` | g | Total sugars | Existing |
| `fiber_total_g` | g | Total dietary fiber | Existing |
| `fiber_soluble_g` | g | Soluble fiber | Existing |
| `fiber_insoluble_g` | g | Insoluble fiber | Existing |
| `polyols_g` | g | Sugar alcohols | Existing |

#### 3. Minerals - Major (4 fields)
| Field Name | Unit | Description | Status |
|------------|------|-------------|--------|
| `sodium_mg` | mg | Sodium | Existing |
| `potassium_mg` | mg | Potassium | Existing |
| `calcium_mg` | mg | Calcium | Existing |
| `magnesium_mg` | mg | Magnesium | Existing |

#### 4. Minerals - Trace (8 fields)
| Field Name | Unit | Description | Status |
|------------|------|-------------|--------|
| `iron_mg` | mg | Iron | Existing |
| `zinc_mg` | mg | Zinc | Existing |
| `manganese_mg` | mg | Manganese | Existing |
| `iodine_ug` | µg | Iodine | Existing |
| `copper_mg` | mg | Copper | **NEW** |
| `selenium_ug` | µg | Selenium | **NEW** |
| `chromium_ug` | µg | Chromium | **NEW** |
| `molybdenum_ug` | µg | Molybdenum | **NEW** |

#### 5. Minerals - Additional (3 fields)
| Field Name | Unit | Description | Status |
|------------|------|-------------|--------|
| `phosphorus_mg` | mg | Phosphorus | **NEW** |
| `chloride_mg` | mg | Chloride | **NEW** |
| `sulfur_g` | g | Sulfur | **NEW** |

#### 6. Vitamins - Water Soluble (10 fields)
| Field Name | Unit | Description | Status |
|------------|------|-------------|--------|
| `vitamin_c_mg` | mg | Vitamin C (ascorbic acid) | Existing |
| `vitamin_b1_mg` | mg | Vitamin B1 (thiamine) | **NEW** |
| `vitamin_b2_mg` | mg | Vitamin B2 (riboflavin) | **NEW** |
| `vitamin_b3_mg` | mg | Vitamin B3 (niacin) | **NEW** |
| `vitamin_b5_mg` | mg | Vitamin B5 (pantothenic acid) | **NEW** |
| `vitamin_b6_mg` | mg | Vitamin B6 (pyridoxine) | **NEW** |
| `vitamin_b7_ug` | µg | Vitamin B7 (biotin) | **NEW** |
| `vitamin_b9_ug` | µg | Vitamin B9 (folate/folic acid) | **NEW** |
| `vitamin_b12_ug` | µg | Vitamin B12 (cobalamin) | **NEW** |
| `choline_mg` | mg | Choline | **NEW** |

#### 7. Vitamins - Fat Soluble (4 fields)
| Field Name | Unit | Description | Status |
|------------|------|-------------|--------|
| `vitamin_a_ug` | µg | Vitamin A (retinol equivalents) | **NEW** |
| `vitamin_d_ug` | µg | Vitamin D (calciferol) | **NEW** |
| `vitamin_e_mg` | mg | Vitamin E (alpha-tocopherol) | **NEW** |
| `vitamin_k_ug` | µg | Vitamin K (phylloquinone) | **NEW** |

#### 8. Fatty Acids - Detailed (4 fields)
| Field Name | Unit | Description | Status |
|------------|------|-------------|--------|
| `omega3_epa_mg` | mg | EPA (eicosapentaenoic acid) | **NEW** |
| `omega3_dha_mg` | mg | DHA (docosahexaenoic acid) | **NEW** |
| `omega3_ala_g` | g | ALA (alpha-linolenic acid) | **NEW** |
| `omega6_la_g` | g | LA (linoleic acid) | **NEW** |

**Note**: Omega-3 and omega-6 fatty acids are subsets of PUFA. EPA+DHA+ALA (omega-3) and LA (omega-6) should not exceed `pufa_g` when summed.

#### 9. Ultra-Trace Minerals (4 fields)
| Field Name | Unit | Description | Status |
|------------|------|-------------|--------|
| `boron_mg` | mg | Boron | **NEW** |
| `silicon_mg` | mg | Silicon | **NEW** |
| `vanadium_ug` | µg | Vanadium | **NEW** |
| `nickel_ug` | µg | Nickel | **NEW** |

**Total**: **49 required fields**

---

## Schema Rationale & Benefits

### Why Expand from 24 to 51+ Fields?

#### 1. **Comprehensive RDA Tracking**
- All essential vitamins and minerals now trackable
- Can assess adequacy against dietary reference intakes (DRIs)
- Identify specific micronutrient gaps in diet

#### 2. **Advanced Fatty Acid Analysis**
- Track omega-3 (EPA, DHA, ALA) for cardiovascular health
- Monitor omega-6 (LA, AA) for inflammation markers
- Calculate omega-6:omega-3 ratios
- Essential for Mediterranean/anti-inflammatory diet tracking

#### 3. **Trace Mineral Completeness**
- Copper, selenium, chromium, molybdenum: Essential trace minerals often deficient
- Phosphorus: Critical for bone health (often overlooked)
- Sulfur: Important for amino acid metabolism

#### 4. **B-Complex Vitamin Suite**
- All 8 B vitamins tracked for energy metabolism
- Choline for cognitive health and liver function
- Critical for vegan/vegetarian diet monitoring

#### 5. **Research & Optimization**
- Water content for accurate caloric density calculations
- Ultra-trace minerals for performance optimization
- Detailed fatty acid profiles for anti-inflammatory protocols

---

## Migration Guidance

### For Existing Dishes (Schema V1 → V2)

#### Option 1: Gradual Migration (Recommended)
```yaml
per_portion:
  # Existing V1 fields (24 fields) - KEEP AS-IS
  energy_kcal: 180
  protein_g: 25.0
  # ... all 24 V1 fields ...

  # New V2 fields - ADD INCREMENTALLY
  water_g: 0  # Set to 0 if unknown (will update later)
  vitamin_b1_mg: 0  # Placeholder for future research
  vitamin_b2_mg: 0
  # ... etc
```

#### Option 2: Partial Enhancement
- **Priority 1**: Add B-complex vitamins (most impactful for tracking)
- **Priority 2**: Add fat-soluble vitamins (A, D, E, K)
- **Priority 3**: Add trace minerals (copper, selenium, etc.)
- **Priority 4**: Add detailed fatty acids (EPA, DHA, etc.)

#### Option 3: Full Research & Backfill
- Use USDA FoodData Central API to fetch complete V2 data
- Update dishes incrementally by category (proteins → vegetables → grains)
- Document data sources in `quality.verified_at` field

### For New Dishes (Schema V2)

**All 51 required fields must be populated** (use 0 for confirmed zeros, research for accurate values).

Example workflow:
1. **Search USDA database** for base ingredient
2. **Extract all 51 nutrients** using API or manual lookup
3. **Adjust for preparation** (cooking losses, added ingredients)
4. **Validate** using schema validation tools
5. **Document source** in `quality` section

---

## Backward Compatibility

### Reading V1 Dishes in V2 Context

**Strategy**: Zero-fill missing fields
```python
def normalize_to_v2(dish_data):
    """Normalize V1 dish to V2 schema"""
    v2_fields = SCHEMA_V2_REQUIRED_FIELDS

    for field in v2_fields:
        if field not in dish_data['per_portion']:
            dish_data['per_portion'][field] = 0

    return dish_data
```

**Trade-offs**:
- ✅ V1 dishes remain valid and functional
- ✅ No data loss for existing tracked meals
- ⚠️ RDA tracking will show 0% for new nutrients (until backfilled)
- ⚠️ Omega-3/omega-6 ratios will be inaccurate for V1 dishes

### Validation Rules

#### Schema V1 Validation
```python
REQUIRED_NUTRIENTS_V1 = [
    'energy_kcal', 'protein_g', 'fat_g', 'sat_fat_g', 'mufa_g', 'pufa_g',
    'trans_fat_g', 'cholesterol_mg', 'sugar_g', 'fiber_total_g',
    'fiber_soluble_g', 'fiber_insoluble_g', 'sodium_mg', 'potassium_mg',
    'iodine_ug', 'magnesium_mg', 'calcium_mg', 'iron_mg', 'zinc_mg',
    'vitamin_c_mg', 'manganese_mg', 'polyols_g', 'carbs_available_g',
    'carbs_total_g'
]  # 24 fields
```

#### Schema V2 Validation
```python
REQUIRED_NUTRIENTS_V2 = REQUIRED_NUTRIENTS_V1 + [
    # Core macro additions
    'water_g',

    # Trace minerals
    'copper_mg', 'selenium_ug', 'chromium_ug', 'molybdenum_ug',
    'phosphorus_mg', 'chloride_mg', 'sulfur_g',

    # B-complex vitamins
    'vitamin_b1_mg', 'vitamin_b2_mg', 'vitamin_b3_mg', 'vitamin_b5_mg',
    'vitamin_b6_mg', 'vitamin_b7_ug', 'vitamin_b9_ug', 'vitamin_b12_ug',
    'choline_mg',

    # Fat-soluble vitamins
    'vitamin_a_ug', 'vitamin_d_ug', 'vitamin_e_mg', 'vitamin_k_ug',

    # Detailed fatty acids
    'omega3_epa_mg', 'omega3_dha_mg', 'omega3_ala_g',
    'omega6_la_g', 'omega6_aa_mg', 'omega9_oa_g'
]  # 51 fields

OPTIONAL_NUTRIENTS_V2 = [
    'boron_mg', 'silicon_mg', 'vanadium_ug', 'nickel_ug'
]  # 4 fields
```

### Schema Version Detection

Dishes can be automatically classified by checking field presence:
```python
def detect_schema_version(dish):
    pp = dish.get('per_portion', {})

    # Check for V2-specific fields
    v2_indicators = ['vitamin_b1_mg', 'vitamin_a_ug', 'omega3_epa_mg']
    if any(field in pp for field in v2_indicators):
        return 'v2'

    # Check for V1 completeness
    if all(field in pp for field in REQUIRED_NUTRIENTS_V1):
        return 'v1'

    return 'incomplete'
```

---

## Implementation Notes

### Field Requirements

| Schema | Required | Optional | Total |
|--------|----------|----------|-------|
| V1     | 24       | 0        | 24    |
| V2     | 51       | 4        | 55    |

### Zero vs NULL Semantics

- **0**: Confirmed zero (e.g., "egg whites have 0g carbs")
- **NULL/missing**: Unknown (e.g., "vitamin B12 content not researched yet")

This distinction is critical for:
- Accurate RDA percentage calculations (0% vs unknown%)
- Data quality metrics (completeness tracking)
- Migration strategies (which fields need research vs confirmed zeros)

### Quality Indicators

Add schema version to dish metadata:
```yaml
quality:
  schema_version: "v2"
  completeness: 100  # percentage of V2 fields populated
  last_updated: "2025-11-05"
  verified_at: "2025-11-05"
```

---

## Examples

### Schema V1 Dish (Legacy)
```yaml
id: "chicken-breast-grilled-200g"
name: "Grilled Chicken Breast"
portion_size: "200g"

per_portion:
  # V1 fields only (24 fields)
  energy_kcal: 330
  protein_g: 62.0
  fat_g: 7.2
  sat_fat_g: 2.0
  mufa_g: 2.7
  pufa_g: 1.8
  trans_fat_g: 0.0
  cholesterol_mg: 172
  carbs_total_g: 0.0
  carbs_available_g: 0.0
  sugar_g: 0.0
  fiber_total_g: 0.0
  fiber_soluble_g: 0.0
  fiber_insoluble_g: 0.0
  polyols_g: 0.0
  sodium_mg: 150
  potassium_mg: 500
  calcium_mg: 15
  magnesium_mg: 60
  iron_mg: 1.2
  zinc_mg: 2.0
  manganese_mg: 0.03
  iodine_ug: 5
  vitamin_c_mg: 0.0

quality:
  schema_version: "v1"
  completeness: 100
```

### Schema V2 Dish (Current)
```yaml
id: "salmon-atlantic-wild-150g"
name: "Atlantic Wild Salmon"
portion_size: "150g"

per_portion:
  # Core macros (9)
  energy_kcal: 280
  protein_g: 31.5
  fat_g: 17.5
  sat_fat_g: 3.2
  mufa_g: 6.1
  pufa_g: 7.4
  trans_fat_g: 0.0
  cholesterol_mg: 85
  water_g: 98.0

  # Carbohydrates (7)
  carbs_total_g: 0.0
  carbs_available_g: 0.0
  sugar_g: 0.0
  fiber_total_g: 0.0
  fiber_soluble_g: 0.0
  fiber_insoluble_g: 0.0
  polyols_g: 0.0

  # Major minerals (4)
  sodium_mg: 90
  potassium_mg: 490
  calcium_mg: 18
  magnesium_mg: 45

  # Trace minerals (8)
  iron_mg: 0.5
  zinc_mg: 0.9
  manganese_mg: 0.02
  iodine_ug: 75
  copper_mg: 0.15
  selenium_ug: 52
  chromium_ug: 1.2
  molybdenum_ug: 2.5

  # Additional minerals (3)
  phosphorus_mg: 310
  chloride_mg: 85
  sulfur_g: 0.32

  # Water-soluble vitamins (10)
  vitamin_c_mg: 0.0
  vitamin_b1_mg: 0.18
  vitamin_b2_mg: 0.15
  vitamin_b3_mg: 12.5
  vitamin_b5_mg: 1.8
  vitamin_b6_mg: 0.7
  vitamin_b7_ug: 4.2
  vitamin_b9_ug: 38
  vitamin_b12_ug: 4.5
  choline_mg: 112

  # Fat-soluble vitamins (4)
  vitamin_a_ug: 65
  vitamin_d_ug: 16.5
  vitamin_e_mg: 2.1
  vitamin_k_ug: 0.5

  # Detailed fatty acids (6)
  omega3_epa_mg: 750
  omega3_dha_mg: 1100
  omega3_ala_g: 0.15
  omega6_la_g: 0.28
  omega6_aa_mg: 85
  omega9_oa_g: 3.8

quality:
  schema_version: "v2"
  completeness: 100
  source: "USDA FoodData Central (FDC ID: 175168)"
  verified_at: "2025-11-05"
```

---

## Summary

| Aspect | Schema V1 | Schema V2 |
|--------|-----------|-----------|
| **Total Fields** | 24 | 51 (+4 optional) |
| **Vitamins** | 1 (C only) | 14 (all essential) |
| **Minerals** | 8 | 15 (+4 optional) |
| **Fatty Acids** | 4 basic | 10 detailed |
| **Use Case** | Basic tracking | Comprehensive RDA analysis |
| **Data Sources** | Manual entry | USDA API + research |
| **Migration** | N/A | Zero-fill backward compatible |

**Recommendation**: New dishes should use Schema V2 for maximum nutritional insight. Existing V1 dishes can be gradually upgraded as time permits, with priority given to frequently consumed items.

---

**Document Version**: 1.0
**Last Updated**: 2025-11-05
**Maintained By**: Nutrition Tracking Project
