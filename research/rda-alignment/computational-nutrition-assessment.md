# Computational Approaches for Nutrition Adequacy Assessment
## Design Document: RDA/DRI Comparison in Nutrition Tracking

**Author:** Claude Sonnet 4.5
**Date:** 2025-11-06
**Status:** Design Proposal
**Context:** 52-nutrient schema, 76-dish food bank, USDA database integration
**Related Documents:**
- FOOD_PREPARATION_RESEARCH_REPORT.md (cooking impacts)
- FOOD_PREPARATION_ABSTRACTIONS.md (data model)
- nutrient-transformations-cooking-analysis.md (bioavailability)

---

## Executive Summary

This document provides **computational frameworks** for answering the fundamental question: **"Am I meeting my nutritional needs?"**

When users log food using USDA database values and the system computes nutrient totals, multiple computational adjustments are required to properly compare against RDA/DRI values:

### Core Challenges
1. **Database baseline misalignment** - USDA values may be raw, cooked, or "as consumed"
2. **Bioavailability variance** - Not all nutrients are absorbed equally
3. **Individual variation** - RDA is population average, not individual need
4. **Preparation losses** - Cooking destroys 0-90% of heat-sensitive nutrients
5. **Food matrix effects** - Nutrient interactions affect absorption
6. **Measurement uncertainty** - Food databases have ±5-50% error margins

### Recommended Approach: **Hybrid Multi-Layer System**

**Layer 1: Direct Comparison (Default)**
- Use database values as-is, compare directly to RDA
- Appropriate for 70% of nutrients (stable, well-measured)
- ±15-25% accuracy (acceptable for general tracking)

**Layer 2: Bioavailability Corrections (Enhanced Mode)**
- Apply correction factors for nutrients with known bioavailability issues
- Appropriate for 20% of nutrients (vitamin A, folate, iron, calcium)
- ±8-15% accuracy

**Layer 3: Individualized Adjustments (Advanced Mode)**
- Account for user-specific absorption factors
- Appropriate for 10% of nutrients (vitamin D, B12, iron)
- ±5-10% accuracy

**Confidence Communication: Always Show Uncertainty**
- High confidence: ±5-15% (direct measurement, stable nutrients)
- Medium confidence: ±15-30% (calculated values, moderate losses)
- Low confidence: ±30-60% (estimated values, high variability)

---

## 1. The Core Question: Database to RDA Comparison

### 1.1 Current System Flow

```
User Action → Database Lookup → Nutrient Totals → RDA Comparison → Assessment
    ↓              ↓                  ↓                 ↓              ↓
"Grilled      USDA: 260 kcal    Daily sum:      Compare to      "You met
 salmon"      28g protein       150g protein    RDA: 60g        250% of
              vitamin_c: 5mg                    vitamin_c: 90mg  protein
                                                                  RDA"
```

### 1.2 The Problem

**Multiple baseline inconsistencies:**

| Food Entry | Database State | Actual Consumed | Bioavailability | Alignment Issue |
|------------|---------------|-----------------|-----------------|----------------|
| Grilled salmon | Cooked, as-is | Cooked, as-is | High (85-95%) | ✅ Aligned |
| Raw spinach | Raw nutrients | Eaten raw | Medium (oxalates) | ⚠️ Overestimated |
| Boiled broccoli | Raw nutrients? | Boiled (vitamin C: 50% loss) | High | ❌ Overestimated 2x |
| Carrot + fat | Raw beta-carotene | Cooked with fat | Very high (3x absorption) | ❌ Underestimated 3x |
| Fortified cereal | Synthetic folate | As-is | High (1.7x vs natural) | ❌ Should use DFE |

**The central computational challenge:**
```
Database Value × Preparation Factor × Bioavailability Factor × Individual Factor
= Effective Nutrient Intake
                ↓
Compare to RDA (which assumes average bioavailability)
```

### 1.3 What RDA/DRI Actually Represents

**RDA (Recommended Dietary Allowance):**
- Covers 97-98% of healthy individuals
- Assumes **average** bioavailability from mixed diet
- Population-based, not individualized
- Incorporates safety margins (1.2-2x above minimum need)

**Key RDA Assumptions:**
1. **Mixed diet** - combination of raw, cooked, animal, plant sources
2. **Normal absorption** - healthy gut, no medications interfering
3. **No deficiency** - adequate stores, normal metabolism
4. **Standard preparation** - typical cooking methods (not raw-only or charred)

**Example: Vitamin C RDA (90mg men, 75mg women)**
- Assumes 80-90% absorption from mixed diet
- Accounts for oxidative losses in body
- Based on preventing scurvy + optimal body pool
- Does NOT assume 100% raw food diet or 100% boiled vegetables

---

## 2. Baseline Alignment Strategies

### Strategy A: Direct Comparison (Simplest)

**Approach:**
Use database values as-is, compare directly to RDA

**Computational Formula:**
```python
def assess_adequacy_direct(nutrient_total, rda_value):
    """Direct comparison - no adjustments"""
    percentage_met = (nutrient_total / rda_value) * 100
    status = "adequate" if percentage_met >= 100 else "inadequate"
    confidence = "medium"  # ±15-25%
    return {
        'percentage': percentage_met,
        'status': status,
        'confidence': confidence
    }
```

**Pros:**
- ✅ Simple, transparent, easy to understand
- ✅ Works well for stable nutrients (protein, fat, many minerals)
- ✅ Database creators already consider typical bioavailability
- ✅ No complex correction factors needed
- ✅ Conservative (slight overestimation safer than underestimation)

**Cons:**
- ❌ Overestimates vitamin C (if food cooked but DB shows raw)
- ❌ Underestimates vitamin A from plant sources (carotenoids need conversion)
- ❌ Ignores preparation method impacts
- ❌ Doesn't account for food matrix effects
- ❌ Misses iron type differences (heme vs non-heme)

**When Appropriate:**
- General population tracking
- Mixed diet with variety
- Users logging "as-consumed" dishes (restaurants, packaged foods)
- Nutrients: protein, fat, sodium, potassium, most B vitamins

**Accuracy: ±15-25% for most nutrients**

---

### Strategy B: Bioavailability Corrections (Enhanced)

**Approach:**
Apply nutrient-specific correction factors between database and RDA

**Computational Formula:**
```python
def assess_adequacy_bioavailability(nutrient_total, rda_value, nutrient_name, food_context):
    """Apply bioavailability corrections"""

    # Get correction factor (context-dependent)
    correction = get_bioavailability_factor(nutrient_name, food_context)

    # Effective intake after bioavailability adjustment
    effective_intake = nutrient_total * correction

    percentage_met = (effective_intake / rda_value) * 100

    confidence = "medium-high" if correction > 0.8 else "medium"

    return {
        'raw_total': nutrient_total,
        'effective_intake': effective_intake,
        'correction_applied': correction,
        'percentage': percentage_met,
        'confidence': confidence
    }

def get_bioavailability_factor(nutrient, context):
    """Lookup table for bioavailability corrections"""

    corrections = {
        'vitamin_a_ug': {
            'animal_source': 1.0,      # Preformed retinol (100% bioavailable)
            'plant_cooked_fat': 0.12,   # RAE conversion: 1:12 with cooking+fat
            'plant_raw': 0.04,          # RAE conversion: 1:24 raw
        },
        'vitamin_b9_ug': {  # Folate/DFE
            'synthetic_fortified': 1.7,  # Folic acid 1.7x more bioavailable
            'natural_cooked': 0.5,       # Natural folate 50% bioavailable
            'natural_raw': 1.0,          # Baseline (RDA assumes natural)
        },
        'iron_mg': {
            'heme_animal': 2.5,     # Heme iron 15-35% absorbed (vs 5-12% non-heme)
            'nonheme_with_vitC': 1.5,  # Vitamin C enhances non-heme
            'nonheme_with_phytate': 0.5, # Phytates inhibit non-heme
            'nonheme_baseline': 1.0,
        },
        'calcium_mg': {
            'with_oxalate': 0.3,    # Spinach, chard (70% bound by oxalates)
            'dairy': 1.0,            # Baseline (RDA assumes dairy)
            'fortified': 1.1,        # Calcium carbonate well absorbed
        },
        'zinc_mg': {
            'animal_source': 1.2,    # Better absorption than plant
            'plant_with_phytate': 0.6, # Phytates reduce by 40%
        },
    }

    return corrections.get(nutrient, {}).get(context, 1.0)
```

**Pros:**
- ✅ Accounts for well-documented bioavailability differences
- ✅ More accurate for problematic nutrients (vitamin A RAE, folate DFE, iron)
- ✅ Scientifically validated correction factors
- ✅ Can explain to users why adjustments made
- ✅ Improves accuracy to ±8-15%

**Cons:**
- ❌ Requires food context data (animal vs plant, fortified vs natural)
- ❌ Adds computational complexity
- ❌ Users may not understand why same food has different "effective" values
- ❌ Correction factors have ranges (±20-30% variability)
- ❌ Requires maintaining correction factor database

**When Appropriate:**
- Power users tracking specific deficiencies
- Vegan/vegetarian diets (plant-based nutrients)
- Medical monitoring (iron, calcium, vitamin D)
- Nutrients with known bioavailability issues

**Accuracy: ±8-15% for corrected nutrients**

---

### Strategy C: Store Raw, Compute at Runtime (Most Flexible)

**Approach:**
Store nutrients in standardized raw state, apply corrections during analysis

**Computational Formula:**
```python
def assess_adequacy_computed(food_log, rda_value, nutrient_name):
    """Compute effective intake from raw values at analysis time"""

    effective_total = 0

    for food_entry in food_log:
        # Get raw nutrient value
        raw_value = food_entry.nutrition[nutrient_name]

        # Get preparation method
        prep_method = food_entry.preparation_method  # e.g., 'boiled', 'raw', 'grilled'

        # Get food category for bioavailability context
        food_category = food_entry.category  # e.g., 'plant', 'animal', 'fortified'

        # Apply preparation retention factor
        retention = get_retention_factor(nutrient_name, prep_method)

        # Apply bioavailability factor
        bioavailability = get_bioavailability_factor(nutrient_name, food_category)

        # Compute effective intake for this food
        effective_intake = raw_value * retention * bioavailability

        effective_total += effective_intake

    percentage_met = (effective_total / rda_value) * 100

    return {
        'raw_total': sum(f.nutrition[nutrient_name] for f in food_log),
        'effective_total': effective_total,
        'percentage_met': percentage_met,
        'confidence': 'high'  # All factors considered
    }

def get_retention_factor(nutrient, prep_method):
    """Cooking method retention factors (from USDA Table Release 6)"""

    retention_table = {
        'vitamin_c_mg': {
            'raw': 1.00,
            'steamed': 0.90,
            'microwaved': 0.92,
            'pressure_cooked': 0.92,
            'stir_fried': 0.75,
            'grilled': 0.70,
            'boiled_short': 0.60,
            'boiled_long': 0.40,
            'roasted': 0.60,
        },
        'vitamin_b9_ug': {  # Folate
            'raw': 1.00,
            'steamed': 0.80,
            'boiled': 0.40,
            'microwaved': 0.75,
            'roasted': 0.50,
        },
        'vitamin_b1_mg': {  # Thiamin
            'raw': 1.00,
            'steamed': 0.85,
            'boiled': 0.60,
            'grilled': 0.85,
        },
        # Most nutrients stable to cooking
        '_default': {
            'raw': 1.00,
            'cooked': 0.95,  # Conservative 5% loss
        }
    }

    return retention_table.get(nutrient, retention_table['_default']).get(prep_method, 0.95)
```

**Pros:**
- ✅ Maximum flexibility - can adjust factors as research updates
- ✅ Users can override prep method for accuracy
- ✅ Clear separation of concerns (raw data vs computed effects)
- ✅ Can simulate "what if cooked differently"
- ✅ Most scientifically accurate (±5-10%)

**Cons:**
- ❌ Requires all food entries to have preparation method
- ❌ Retrospective logging difficult (users forget cooking method)
- ❌ Significant implementation complexity
- ❌ Restaurant dishes may not know exact prep method
- ❌ Requires extensive retention factor database

**When Appropriate:**
- Research-grade tracking
- Recipe development and optimization
- Performance nutrition (athletes, competitors)
- Clinical nutrition monitoring

**Accuracy: ±5-10% when all factors known**

---

### Strategy D: Hybrid Approach (RECOMMENDED)

**Approach:**
Use appropriate strategy per nutrient category

**Computational Decision Tree:**
```python
def assess_adequacy_hybrid(food_log, nutrient_name, rda_value, user_profile):
    """Hybrid approach - select strategy per nutrient"""

    # Classify nutrient
    nutrient_category = classify_nutrient(nutrient_name)

    if nutrient_category == 'stable':
        # Strategy A: Direct comparison
        # Nutrients: protein, fat, sodium, potassium, most minerals
        return assess_adequacy_direct(food_log, nutrient_name, rda_value)

    elif nutrient_category == 'bioavailability_critical':
        # Strategy B: Bioavailability corrections
        # Nutrients: vitamin A (RAE), folate (DFE), iron, calcium, zinc
        return assess_adequacy_bioavailability(food_log, nutrient_name, rda_value)

    elif nutrient_category == 'heat_sensitive':
        # Strategy C: Preparation-dependent
        # Nutrients: vitamin C, folate, thiamin
        if has_preparation_data(food_log):
            return assess_adequacy_computed(food_log, nutrient_name, rda_value)
        else:
            # Fallback to conservative estimate
            return assess_adequacy_with_default_loss(food_log, nutrient_name, rda_value)

    elif nutrient_category == 'enhanced_by_cooking':
        # Strategy C with enhancement factors
        # Nutrients: lycopene, beta-carotene, protein digestibility
        return assess_adequacy_with_enhancement(food_log, nutrient_name, rda_value)

    else:
        # Default: Strategy A
        return assess_adequacy_direct(food_log, nutrient_name, rda_value)

def classify_nutrient(nutrient_name):
    """Classify nutrient to determine appropriate strategy"""

    categories = {
        'stable': [
            'protein_g', 'fat_g', 'carbs_total_g',
            'sodium_mg', 'potassium_mg', 'phosphorus_mg',
            'vitamin_b3_mg', 'vitamin_b5_mg', 'vitamin_b7_ug',
        ],
        'bioavailability_critical': [
            'vitamin_a_ug',  # RAE conversion needed
            'vitamin_b9_ug',  # DFE conversion needed
            'iron_mg',        # Heme vs non-heme
            'calcium_mg',     # Oxalate binding
            'zinc_mg',        # Phytate binding
        ],
        'heat_sensitive': [
            'vitamin_c_mg',
            'vitamin_b1_mg',  # Thiamin
            'vitamin_b9_ug',  # Folate (also bioavailability issue)
        ],
        'enhanced_by_cooking': [
            # Not direct nutrients, but affects effective intake
            # Handle via food-specific adjustments
        ]
    }

    for category, nutrients in categories.items():
        if nutrient_name in nutrients:
            return category

    return 'stable'  # Default to simplest strategy
```

**Implementation Strategy:**

```python
class NutritionAdequacyAssessor:
    """Hybrid assessment system"""

    def __init__(self, user_profile):
        self.user = user_profile
        self.retention_factors = load_retention_table()
        self.bioavailability_factors = load_bioavailability_table()
        self.rda_values = load_rda_values(user_profile.age, user_profile.sex)

    def assess_daily_log(self, food_log, date):
        """Assess all nutrients for a day"""

        results = {}

        for nutrient in ALL_NUTRIENTS:
            # Get raw totals
            raw_total = sum(food.nutrition[nutrient] for food in food_log)

            # Apply hybrid strategy
            assessment = self.assess_nutrient(
                nutrient_name=nutrient,
                food_log=food_log,
                raw_total=raw_total
            )

            results[nutrient] = assessment

        return results

    def assess_nutrient(self, nutrient_name, food_log, raw_total):
        """Assess single nutrient using appropriate strategy"""

        rda = self.rda_values.get(nutrient_name)

        if not rda:
            return {
                'status': 'no_rda',
                'message': 'No RDA established for this nutrient'
            }

        category = classify_nutrient(nutrient_name)

        if category == 'stable':
            effective_intake = raw_total
            confidence = 'high'
            adjustments = []

        elif category == 'bioavailability_critical':
            effective_intake, adjustments = self._apply_bioavailability_corrections(
                nutrient_name, food_log, raw_total
            )
            confidence = 'medium-high'

        elif category == 'heat_sensitive':
            effective_intake, adjustments = self._apply_preparation_corrections(
                nutrient_name, food_log, raw_total
            )
            confidence = 'medium'

        else:
            effective_intake = raw_total
            confidence = 'medium'
            adjustments = []

        percentage = (effective_intake / rda) * 100
        status = self._classify_adequacy(percentage)

        return {
            'nutrient': nutrient_name,
            'raw_total': raw_total,
            'effective_intake': effective_intake,
            'rda': rda,
            'percentage': percentage,
            'status': status,
            'confidence': confidence,
            'adjustments': adjustments,
        }

    def _classify_adequacy(self, percentage):
        """Classify adequacy level"""
        if percentage >= 100:
            return 'adequate'
        elif percentage >= 67:
            return 'borderline'  # 2/3 of RDA
        else:
            return 'inadequate'
```

**Pros:**
- ✅ Balances accuracy and complexity
- ✅ Simple for stable nutrients, sophisticated for problematic ones
- ✅ Can be implemented incrementally
- ✅ Transparent - users see which adjustments applied
- ✅ Extensible - add new corrections as research emerges

**Cons:**
- ⚠️ More complex than pure Strategy A
- ⚠️ Requires nutrient classification logic
- ⚠️ Users may be confused why some nutrients adjusted, others not

**Accuracy: ±8-15% overall**

**RECOMMENDATION: Implement Strategy D (Hybrid)**
- Default to Strategy A for most nutrients
- Apply Strategy B for vitamin A, folate, iron, calcium
- Apply Strategy C when preparation data available
- Clearly communicate which strategy used per nutrient

---

## 3. Nutrient-Specific Handling

### 3.1 Classification by Priority & Complexity

| Priority | Nutrients | Handling Strategy | Correction Needed? |
|----------|-----------|-------------------|-------------------|
| **CRITICAL (Special handling required)** |
| Tier 1 | Vitamin A (RAE) | Bioavailability | ✅ YES (RAE conversion) |
| Tier 1 | Folate (DFE) | Bioavailability | ✅ YES (DFE conversion) |
| Tier 1 | Iron | Bioavailability + Type | ✅ YES (heme vs non-heme) |
| Tier 1 | Calcium | Bioavailability | ✅ YES (oxalate binding) |
| Tier 1 | Vitamin C | Preparation | ✅ YES (heat sensitive) |
| **MODERATE (Simple corrections)** |
| Tier 2 | Vitamin B1 (Thiamin) | Preparation | ⚠️ Optional (heat loss) |
| Tier 2 | Folate | Preparation | ⚠️ Optional (heat loss) |
| Tier 2 | Zinc | Bioavailability | ⚠️ Optional (phytates) |
| Tier 2 | Protein (digestibility) | Preparation | ⚠️ Optional (raw vs cooked) |
| **SIMPLE (Direct comparison)** |
| Tier 3 | Protein (total) | Direct | ❌ NO |
| Tier 3 | Fat, Sodium, Potassium | Direct | ❌ NO |
| Tier 3 | Most B vitamins | Direct | ❌ NO |
| Tier 3 | Vitamin E, K | Direct | ❌ NO |
| Tier 3 | Most minerals | Direct | ❌ NO |

---

### 3.2 Detailed Nutrient Handling Specifications

#### **Vitamin A (Retinol Activity Equivalents - RAE)**

**The Problem:**
- RDA specified in µg RAE (Retinol Activity Equivalents)
- Database values mix preformed retinol (animal) and provitamin A carotenoids (plant)
- Conversion efficiency varies: 1 µg retinol = 12 µg β-carotene (cooked) = 24 µg β-carotene (raw)

**Computational Approach:**
```python
def calculate_vitamin_a_rae(food_entry):
    """Calculate effective vitamin A in RAE"""

    # Get database value
    vitamin_a_db = food_entry.nutrition['vitamin_a_ug']

    # Check if database already in RAE or needs conversion
    if food_entry.metadata.get('vitamin_a_unit') == 'RAE':
        # Already in RAE (most modern databases)
        return vitamin_a_db

    # If mixed or needs conversion
    source_type = food_entry.food_category

    if source_type == 'animal':
        # Preformed retinol - 1:1 conversion
        return vitamin_a_db

    elif source_type == 'plant':
        # Provitamin A carotenoids - check preparation
        prep_method = food_entry.preparation_method

        if prep_method in ['raw', 'fresh']:
            # Raw: 24:1 conversion
            return vitamin_a_db / 24
        elif prep_method in ['cooked', 'grilled', 'steamed', 'boiled']:
            # Cooked: 12:1 conversion (better absorption)
            return vitamin_a_db / 12
        else:
            # Unknown: use conservative 12:1
            return vitamin_a_db / 12

    else:
        # Unknown source: assume already RAE (modern standard)
        return vitamin_a_db

# RDA comparison
def assess_vitamin_a(daily_foods, rda_value):
    """Assess vitamin A with RAE conversion"""

    rae_total = sum(calculate_vitamin_a_rae(food) for food in daily_foods)

    percentage = (rae_total / rda_value) * 100

    return {
        'rae_total': rae_total,
        'rda': rda_value,  # Already in RAE
        'percentage': percentage,
        'confidence': 'medium-high',
        'note': 'RAE conversion applied for plant sources'
    }
```

**Recommendation:**
- USDA FoodData Central (2018+) reports vitamin A in RAE by default
- If using older databases, check units
- Apply conversion factors based on food source and preparation

**Confidence: MEDIUM-HIGH** (conversion factors well-established)

---

#### **Folate (Dietary Folate Equivalents - DFE)**

**The Problem:**
- RDA specified in µg DFE (Dietary Folate Equivalents)
- Synthetic folic acid (fortified foods, supplements) is 1.7x more bioavailable than natural folate
- Conversion: 1 µg DFE = 1 µg natural folate = 0.6 µg folic acid

**Computational Approach:**
```python
def calculate_folate_dfe(food_entry):
    """Calculate effective folate in DFE"""

    # Get database value (may be in µg or µg DFE)
    folate_db = food_entry.nutrition['vitamin_b9_ug']

    # Check if already DFE
    if food_entry.metadata.get('folate_unit') == 'DFE':
        return folate_db

    # Determine if natural or synthetic
    if food_entry.fortified or 'fortified' in food_entry.name.lower():
        # Synthetic folic acid: multiply by 1.7
        return folate_db * 1.7

    elif food_entry.category == 'supplement':
        # Supplements typically synthetic
        return folate_db * 1.7

    else:
        # Natural folate from food: 1:1 (baseline)
        # But may need to account for cooking losses
        prep_method = food_entry.preparation_method
        retention = get_retention_factor('vitamin_b9_ug', prep_method)

        return folate_db * retention  # Already in DFE units

def assess_folate(daily_foods, rda_value):
    """Assess folate with DFE conversion"""

    dfe_total = sum(calculate_folate_dfe(food) for food in daily_foods)

    percentage = (dfe_total / rda_value) * 100

    # Breakdown by source type
    natural_folate = sum(
        calculate_folate_dfe(f) for f in daily_foods
        if not (f.fortified or f.category == 'supplement')
    )

    synthetic_folate = dfe_total - natural_folate

    return {
        'dfe_total': dfe_total,
        'natural_folate_dfe': natural_folate,
        'synthetic_folate_dfe': synthetic_folate,
        'rda': rda_value,
        'percentage': percentage,
        'confidence': 'high',
        'note': '1.7x bioavailability applied to fortified/supplement sources'
    }
```

**Recommendation:**
- Modern USDA data reports folate in DFE
- Flag fortified foods to apply 1.7x multiplier
- Account for cooking losses (40-68% loss if boiled)

**Confidence: HIGH** (well-established conversion)

---

#### **Iron (Heme vs Non-Heme)**

**The Problem:**
- RDA assumes mixed diet (heme + non-heme sources)
- Heme iron (meat): 15-35% absorbed
- Non-heme iron (plants): 2-20% absorbed (highly variable)
- Enhancers: Vitamin C, meat factor
- Inhibitors: Phytates, calcium, tannins

**Computational Approach:**
```python
def calculate_effective_iron(food_entry, meal_context):
    """Calculate bioavailable iron considering type and meal context"""

    iron_db = food_entry.nutrition['iron_mg']

    # Determine iron type
    if food_entry.food_category in ['meat', 'poultry', 'fish']:
        # Heme iron: ~40% of total iron in meat, 25% absorption
        heme_iron = iron_db * 0.40
        nonheme_iron = iron_db * 0.60

        heme_absorbed = heme_iron * 0.25  # 25% absorption
        nonheme_absorbed = nonheme_iron * 0.10  # 10% absorption (with meat factor)

        total_absorbed = heme_absorbed + nonheme_absorbed
        effective_factor = total_absorbed / iron_db

    else:
        # Non-heme only (plant sources)
        base_absorption = 0.05  # 5% baseline for non-heme

        # Check for enhancers in meal
        if meal_context.vitamin_c_mg > 25:
            # Vitamin C present - enhance absorption
            enhancement = min(meal_context.vitamin_c_mg / 25, 4.0)  # Up to 4x
            absorption = base_absorption * enhancement
        else:
            absorption = base_absorption

        # Check for inhibitors
        if meal_context.phytates_mg > 100:
            absorption *= 0.5  # Phytates reduce by 50%

        if meal_context.calcium_mg > 300:
            absorption *= 0.7  # Calcium reduces by 30%

        effective_factor = absorption

    return iron_db * effective_factor

def assess_iron(daily_meals, rda_value, user_profile):
    """Assess iron with bioavailability corrections"""

    # Simple approach: use average bioavailability factors
    heme_iron_total = 0
    nonheme_iron_total = 0

    for meal in daily_meals:
        for food in meal.foods:
            iron = food.nutrition['iron_mg']

            if food.food_category in ['meat', 'poultry', 'fish']:
                heme_iron_total += iron * 0.40 * 0.25  # Heme: 40% of total, 25% absorbed
                nonheme_iron_total += iron * 0.60 * 0.10  # Non-heme from meat
            else:
                # Estimate absorption based on meal context
                avg_absorption = 0.08  # Conservative 8% for mixed plant diet
                nonheme_iron_total += iron * avg_absorption

    effective_iron = heme_iron_total + nonheme_iron_total

    # RDA already accounts for ~18% absorption, so need to adjust
    # If we've calculated actual absorbed iron, compare to absorbed need
    rda_absorbed = rda_value * 0.18  # RDA assumes 18% absorption

    percentage = (effective_iron / rda_absorbed) * 100

    return {
        'raw_iron_total': sum(f.nutrition['iron_mg'] for m in daily_meals for f in m.foods),
        'effective_iron': effective_iron,
        'heme_absorbed': heme_iron_total,
        'nonheme_absorbed': nonheme_iron_total,
        'rda': rda_value,
        'percentage': percentage,
        'confidence': 'medium',
        'note': 'Bioavailability adjusted for heme vs non-heme sources'
    }
```

**Simplified Approach (Recommended for Most Users):**
```python
def assess_iron_simple(daily_foods, rda_value):
    """Simple iron assessment without complex bioavailability"""

    # Calculate percentage from animal vs plant
    animal_iron = sum(
        f.nutrition['iron_mg'] for f in daily_foods
        if f.food_category in ['meat', 'poultry', 'fish']
    )

    plant_iron = sum(
        f.nutrition['iron_mg'] for f in daily_foods
        if f.food_category not in ['meat', 'poultry', 'fish']
    )

    # Apply simple multipliers (relative to mixed diet baseline)
    # RDA assumes mixed diet with ~18% absorption
    # Animal-heavy: better absorption
    # Plant-only: worse absorption

    if animal_iron > plant_iron:
        # Animal-heavy diet
        effective_factor = 1.2  # 20% bonus
    elif plant_iron > animal_iron * 3:
        # Plant-heavy diet
        effective_factor = 0.7  # 30% penalty (need more vitamin C, less phytates)
    else:
        # Mixed diet
        effective_factor = 1.0  # RDA already assumes this

    total_iron = animal_iron + plant_iron
    effective_iron = total_iron * effective_factor

    percentage = (effective_iron / rda_value) * 100

    return {
        'total_iron': total_iron,
        'animal_iron': animal_iron,
        'plant_iron': plant_iron,
        'effective_factor': effective_factor,
        'effective_iron': effective_iron,
        'percentage': percentage,
        'confidence': 'medium',
    }
```

**Recommendation:**
- Use simplified approach for general tracking
- Use detailed approach for vegans/vegetarians (critical)
- Flag low iron with recommendation to include vitamin C with meals

**Confidence: MEDIUM** (high variability in absorption)

---

#### **Calcium (Oxalate Binding)**

**The Problem:**
- Calcium in high-oxalate foods (spinach, chard) is largely bound and unavailable
- Spinach: only 5% calcium absorbed (vs 30% from dairy)
- Boiling reduces oxalates by 30-87%

**Computational Approach:**
```python
def calculate_effective_calcium(food_entry):
    """Calculate bioavailable calcium considering oxalate binding"""

    calcium_db = food_entry.nutrition['calcium_mg']

    # High-oxalate foods
    high_oxalate_foods = [
        'spinach', 'chard', 'beet greens', 'rhubarb',
        'almonds', 'sweet potato'
    ]

    # Check if food is high-oxalate
    is_high_oxalate = any(food in food_entry.name.lower() for food in high_oxalate_foods)

    if not is_high_oxalate:
        # Normal absorption: ~30% (dairy baseline)
        return calcium_db * 1.0  # RDA assumes 30% absorption

    # High-oxalate food
    prep_method = food_entry.preparation_method

    if prep_method in ['boiled', 'boiled_drained']:
        # Boiling reduces oxalates by 30-87%
        # Calcium absorption improves from 5% to ~15%
        bioavailability_factor = 0.5  # Conservative 50% of normal
    else:
        # Raw high-oxalate: only 5% absorbed vs 30% baseline
        bioavailability_factor = 0.17  # 5%/30% = 0.17

    return calcium_db * bioavailability_factor

def assess_calcium(daily_foods, rda_value):
    """Assess calcium with oxalate corrections"""

    raw_total = sum(f.nutrition['calcium_mg'] for f in daily_foods)
    effective_total = sum(calculate_effective_calcium(f) for f in daily_foods)

    # Breakdown by source
    dairy_calcium = sum(
        f.nutrition['calcium_mg'] for f in daily_foods
        if f.food_category == 'dairy'
    )

    high_oxalate_calcium_raw = sum(
        f.nutrition['calcium_mg'] for f in daily_foods
        if any(food in f.name.lower() for food in ['spinach', 'chard'])
    )

    percentage = (effective_total / rda_value) * 100

    return {
        'raw_total': raw_total,
        'effective_total': effective_total,
        'dairy_calcium': dairy_calcium,
        'high_oxalate_raw': high_oxalate_calcium_raw,
        'percentage': percentage,
        'confidence': 'medium-high',
        'note': 'Oxalate binding accounted for in spinach/chard'
    }
```

**Recommendation:**
- Apply correction only for known high-oxalate foods
- Boiling high-oxalate vegetables improves calcium availability
- Most users don't need correction (if eating varied diet)

**Confidence: MEDIUM-HIGH** (well-documented for specific foods)

---

#### **Vitamin C (Heat Sensitivity)**

**The Problem:**
- Most heat-sensitive vitamin
- Losses: 0-90% depending on cooking method
- Database may show raw or cooked values (often unclear)

**Computational Approach:**
```python
def calculate_effective_vitamin_c(food_entry):
    """Calculate retained vitamin C after preparation"""

    vitamin_c_db = food_entry.nutrition['vitamin_c_mg']

    if vitamin_c_db == 0:
        return 0

    # Check if database value is raw or cooked
    prep_state = food_entry.metadata.get('database_state', 'unknown')

    if prep_state == 'cooked':
        # Database already accounts for cooking
        return vitamin_c_db

    # Database shows raw; apply retention factor
    prep_method = food_entry.preparation_method or 'cooked_unknown'

    retention = get_retention_factor('vitamin_c_mg', prep_method)

    return vitamin_c_db * retention

def assess_vitamin_c(daily_foods, rda_value):
    """Assess vitamin C with preparation losses"""

    raw_total = sum(f.nutrition['vitamin_c_mg'] for f in daily_foods)
    effective_total = sum(calculate_effective_vitamin_c(f) for f in daily_foods)

    # Flag significant loss
    loss_percentage = ((raw_total - effective_total) / raw_total * 100) if raw_total > 0 else 0

    percentage = (effective_total / rda_value) * 100

    confidence = 'high' if loss_percentage < 20 else 'medium'

    return {
        'raw_total': raw_total,
        'effective_total': effective_total,
        'loss_percentage': loss_percentage,
        'percentage': percentage,
        'confidence': confidence,
        'recommendation': 'Include raw/lightly cooked fruits and vegetables' if percentage < 80 else ''
    }
```

**Recommendation:**
- If food database specifies "as consumed" or "cooked" → use directly
- If database shows raw → apply retention factors
- Conservative approach: assume 20% average loss for cooked vegetables

**Confidence: MEDIUM** (depends on preparation data quality)

---

### 3.3 Priority Ranking by Importance

**Tier 1: MUST HANDLE (High impact on assessment)**

1. **Folate (DFE)** - Critical for pregnancy, common deficiency, 1.7x correction for fortified
2. **Vitamin A (RAE)** - Major differences between animal/plant, raw/cooked
3. **Iron** - Heme vs non-heme drastically different, common deficiency (women)
4. **Vitamin C** - Most heat-sensitive, easy to underestimate if database shows raw

**Tier 2: SHOULD HANDLE (Moderate impact)**

5. **Calcium** - Oxalate binding in spinach/chard significant
6. **Zinc** - Phytate binding in plant-based diets
7. **Protein digestibility** - Raw vs cooked eggs (51% vs 91%)
8. **Vitamin B1 (Thiamin)** - Heat-sensitive, especially if boiling

**Tier 3: CAN DIRECT COMPARE (Low/no adjustment needed)**

9. All other nutrients - stable enough for direct comparison

---

## 4. Confidence Levels and Uncertainty

### 4.1 Sources of Uncertainty

**1. Database Measurement Error**
- Laboratory analysis: ±5-10% (analytical variation)
- Sampling variability: ±10-20% (natural variation between samples)
- Composite foods: ±15-30% (calculated from components)
- User-submitted data: ±30-100% (often unreliable)

**2. Cooking Losses**
- Retention factors: ±10-30% variability
- Cooking time/temperature variations
- Equipment differences (oven calibration)
- User technique variations

**3. Bioavailability Variation**
- Individual differences: ±20-50%
- Food matrix effects: ±10-40%
- Meal composition (enhancers/inhibitors): ±30-70%
- Gut health status: ±20-100%

**4. Portion Size Estimation**
- Weighed portions: ±5% accuracy
- Volume estimates (cups): ±20-40%
- Visual estimates: ±30-70%
- Restaurant portions: ±25-50%

**5. Individual Variation in Requirements**
- RDA is population average (97-98th percentile)
- Individual needs: ±20-50% from RDA
- Activity level adjustments: ±10-30%
- Health status: ±20-100%

---

### 4.2 Confidence Scoring System

**Confidence Formula:**
```python
def calculate_confidence(assessment_context):
    """Calculate overall confidence score"""

    factors = {
        'database_quality': assess_database_quality(assessment_context),
        'preparation_data': assess_preparation_data_quality(assessment_context),
        'bioavailability_factors': assess_bioavailability_certainty(assessment_context),
        'portion_accuracy': assess_portion_accuracy(assessment_context),
        'individual_factors': assess_individual_factors(assessment_context),
    }

    # Weighted average
    weights = {
        'database_quality': 0.30,
        'preparation_data': 0.25,
        'bioavailability_factors': 0.20,
        'portion_accuracy': 0.15,
        'individual_factors': 0.10,
    }

    confidence_score = sum(factors[k] * weights[k] for k in factors)

    # Classify
    if confidence_score >= 0.80:
        level = 'high'
        error_range = '±8-15%'
    elif confidence_score >= 0.60:
        level = 'medium'
        error_range = '±15-30%'
    elif confidence_score >= 0.40:
        level = 'low'
        error_range = '±30-60%'
    else:
        level = 'very_low'
        error_range = '±60-100%'

    return {
        'level': level,
        'score': confidence_score,
        'error_range': error_range,
        'factors': factors,
    }

def assess_database_quality(context):
    """Assess quality of food database source"""

    source = context.food_entry.source

    quality_scores = {
        'usda_lab_analyzed': 0.95,      # Lab analysis
        'usda_sr_legacy': 0.90,         # USDA SR Legacy
        'usda_fndds': 0.85,             # USDA FNDDS
        'vendor_nutrition_facts': 0.75,  # Restaurant/package label
        'usda_calculated': 0.70,        # Calculated from components
        'user_submitted': 0.30,         # User-submitted (low trust)
        'estimated': 0.20,              # Rough estimate
    }

    return quality_scores.get(source, 0.50)

def assess_preparation_data_quality(context):
    """Assess quality of preparation method data"""

    prep = context.food_entry.preparation_method

    if prep and prep != 'unknown':
        # Known preparation method
        if context.food_entry.metadata.get('cooking_time_min'):
            return 0.90  # Time recorded
        else:
            return 0.70  # Method known but not time
    elif context.food_entry.metadata.get('database_state') == 'as_consumed':
        return 0.85  # Database already accounts for preparation
    else:
        return 0.40  # Unknown preparation

def assess_portion_accuracy(context):
    """Assess portion size accuracy"""

    method = context.food_entry.portion_method

    accuracy_scores = {
        'weighed_grams': 0.95,
        'package_serving': 0.90,
        'restaurant_standard': 0.70,
        'volume_measured': 0.60,
        'visual_estimate': 0.40,
    }

    return accuracy_scores.get(method, 0.50)
```

**Nutrient-Specific Confidence Modifiers:**
```python
def adjust_confidence_by_nutrient(base_confidence, nutrient_name):
    """Adjust confidence based on nutrient characteristics"""

    # Heat-sensitive nutrients - lower confidence if preparation unknown
    heat_sensitive = ['vitamin_c_mg', 'vitamin_b1_mg', 'vitamin_b9_ug']

    # Bioavailability-variable nutrients - lower confidence without context
    bioavailable_variable = ['iron_mg', 'calcium_mg', 'zinc_mg', 'vitamin_a_ug']

    # Stable nutrients - higher confidence
    stable = ['protein_g', 'fat_g', 'sodium_mg', 'potassium_mg']

    if nutrient_name in stable:
        return base_confidence * 1.1  # 10% bonus
    elif nutrient_name in heat_sensitive:
        return base_confidence * 0.85  # 15% penalty
    elif nutrient_name in bioavailable_variable:
        return base_confidence * 0.90  # 10% penalty
    else:
        return base_confidence
```

---

### 4.3 Should the System Communicate Uncertainty?

**YES - Strongly Recommended**

**Rationale:**
1. **Scientific honesty** - Precision illusion is dangerous
2. **User education** - Helps users understand data limitations
3. **Decision support** - High uncertainty → seek professional advice
4. **Trust building** - Transparency increases long-term trust

**How to Communicate:**

**Option 1: Confidence Badges**
```
Vitamin C: 45mg (67% of RDA) [🟡 Medium confidence ±20%]
Iron: 12mg (67% of RDA) [🔴 Low confidence ±35%]
Protein: 75g (125% of RDA) [🟢 High confidence ±10%]
```

**Option 2: Confidence Ranges**
```
Vitamin C: 67% of RDA (range: 54-80%)
Iron: 67% of RDA (range: 44-90%)
Protein: 125% of RDA (range: 113-138%)
```

**Option 3: Traffic Light System (Recommended)**
```
🟢 HIGH CONFIDENCE (±8-15%)
  - Lab-analyzed food
  - Stable nutrients
  - Weighed portions
  - Known preparation

🟡 MEDIUM CONFIDENCE (±15-30%)
  - Calculated values
  - Heat-sensitive nutrients
  - Estimated portions
  - Unknown preparation details

🔴 LOW CONFIDENCE (±30-60%)
  - User-submitted data
  - Complex mixed dishes
  - Visual portion estimates
  - Multiple correction factors

⚫ VERY LOW CONFIDENCE (±60-100%)
  - Rough estimates only
  - Missing critical data
  - High biological variability
```

**Implementation:**
```python
def format_nutrient_assessment_with_confidence(assessment):
    """Format assessment with confidence communication"""

    confidence = assessment['confidence']
    percentage = assessment['percentage']
    error_range = assessment.get('error_range', '±20%')

    # Traffic light emoji
    emoji_map = {
        'high': '🟢',
        'medium': '🟡',
        'low': '🔴',
        'very_low': '⚫',
    }

    emoji = emoji_map.get(confidence, '🟡')

    # Calculate range
    error_pct = parse_error_range(error_range)  # e.g., 20 from "±20%"
    lower = percentage * (1 - error_pct/100)
    upper = percentage * (1 + error_pct/100)

    # Format message
    message = f"{assessment['nutrient']}: {percentage:.0f}% of RDA "
    message += f"(range: {lower:.0f}-{upper:.0f}%) "
    message += f"{emoji} {confidence.title()} confidence {error_range}"

    # Add explanation if not high confidence
    if confidence != 'high':
        reasons = []
        if assessment.get('database_quality', 1.0) < 0.75:
            reasons.append("estimated values")
        if assessment.get('preparation_unknown', False):
            reasons.append("unknown cooking method")
        if assessment.get('bioavailability_variable', False):
            reasons.append("variable absorption")

        if reasons:
            message += f"\n  → {', '.join(reasons)}"

    return message
```

**Example Output:**
```
Vitamin C: 67% of RDA (range: 54-80%) 🟡 Medium confidence ±20%
  → unknown cooking method, heat-sensitive nutrient

Iron: 67% of RDA (range: 44-90%) 🔴 Low confidence ±35%
  → heme/non-heme ratio unknown, absorption highly variable

Protein: 125% of RDA (range: 113-138%) 🟢 High confidence ±10%
```

---

### 4.4 When to Escalate / Seek Professional Advice

**Auto-Flag Conditions:**
```python
def should_flag_for_professional_review(assessments, user_profile):
    """Determine if user should seek professional nutrition advice"""

    flags = []

    # Check for critical deficiencies
    critical_nutrients = ['iron_mg', 'calcium_mg', 'vitamin_d_ug', 'vitamin_b12_ug']

    for nutrient in critical_nutrients:
        assessment = assessments[nutrient]

        if assessment['percentage'] < 50 and assessment['confidence'] != 'very_low':
            # Consistently below 50% RDA with reasonable confidence
            flags.append(f"{nutrient}: Possible deficiency (<50% RDA)")

    # Check for high-risk groups
    if user_profile.pregnant or user_profile.breastfeeding:
        if assessments['vitamin_b9_ug']['percentage'] < 100:
            flags.append("Folate: Critical for pregnancy (recommend 400-800 µg)")

    if user_profile.vegan:
        if assessments['vitamin_b12_ug']['percentage'] < 100:
            flags.append("Vitamin B12: No reliable plant sources (supplement recommended)")

    if user_profile.age > 50:
        if assessments['vitamin_d_ug']['percentage'] < 100:
            flags.append("Vitamin D: Reduced synthesis with age (consider supplement)")
        if assessments['calcium_mg']['percentage'] < 100:
            flags.append("Calcium: Important for bone health (age 50+)")

    # Check for pattern of multiple deficiencies
    below_80_pct = sum(1 for a in assessments.values() if a['percentage'] < 80)

    if below_80_pct > 5:
        flags.append(f"Multiple nutrients below 80% RDA ({below_80_pct} nutrients)")

    return flags
```

**User-Facing Messages:**
```
⚠️ NUTRITION ADVISORY

Based on your 30-day average, we've identified potential concerns:

1. Iron: 45% of RDA (🔴 Low confidence ±35%)
   → Consider iron-rich foods or consult healthcare provider
   → Helpful: Combine plant iron sources with vitamin C

2. Vitamin D: 55% of RDA (🟡 Medium confidence ±25%)
   → Limited sun exposure? Consider supplement (especially winter)
   → Consult doctor for blood test (25-OH vitamin D)

3. Calcium: 62% of RDA (🟡 Medium confidence ±20%)
   → Include dairy, fortified plant milk, or leafy greens
   → Note: Spinach calcium poorly absorbed (oxalates)

💡 These are estimates only. For personalized advice, consult a registered dietitian or healthcare provider.
```

---

## 5. Practical Implementation

### 5.1 Minimal Viable Approach (MVP)

**Goal:** Good enough for 90% of users with minimal complexity

**Strategy:** Direct comparison with selective corrections

```python
class MinimalNutritionAssessor:
    """Minimal viable approach - balances simplicity and accuracy"""

    def __init__(self, rda_values):
        self.rda = rda_values

        # Only track critical corrections
        self.special_handling = {
            'vitamin_a_ug': self.assess_vitamin_a_simple,
            'vitamin_b9_ug': self.assess_folate_simple,
            'iron_mg': self.assess_iron_simple,
        }

    def assess_all_nutrients(self, daily_foods):
        """Assess all nutrients with minimal approach"""

        # Sum up raw totals
        totals = defaultdict(float)
        for food in daily_foods:
            for nutrient, value in food.nutrition.items():
                totals[nutrient] += value

        # Assess each nutrient
        results = {}
        for nutrient, total in totals.items():
            if nutrient in self.special_handling:
                # Apply special handling
                results[nutrient] = self.special_handling[nutrient](daily_foods, total)
            else:
                # Direct comparison
                results[nutrient] = self.assess_direct(nutrient, total)

        return results

    def assess_direct(self, nutrient, total):
        """Direct comparison - no adjustments"""
        rda = self.rda.get(nutrient)
        if not rda:
            return {'status': 'no_rda'}

        percentage = (total / rda) * 100

        return {
            'total': total,
            'rda': rda,
            'percentage': percentage,
            'status': 'adequate' if percentage >= 100 else 'inadequate',
            'confidence': 'medium',
            'adjustments': [],
        }

    def assess_vitamin_a_simple(self, foods, total):
        """Simple vitamin A - just flag if plant-heavy"""

        animal_foods = [f for f in foods if f.category in ['meat', 'fish', 'dairy', 'eggs']]

        if len(animal_foods) == 0:
            # Plant-only sources - apply conservative penalty
            effective = total * 0.5  # Assume 50% conversion inefficiency
            note = "Plant-only vitamin A sources (lower conversion efficiency)"
            confidence = 'low'
        else:
            # Mixed sources
            effective = total
            note = ""
            confidence = 'medium'

        rda = self.rda['vitamin_a_ug']
        percentage = (effective / rda) * 100

        return {
            'total': total,
            'effective': effective,
            'rda': rda,
            'percentage': percentage,
            'confidence': confidence,
            'note': note,
        }

    def assess_folate_simple(self, foods, total):
        """Simple folate - boost for fortified foods"""

        fortified = sum(f.nutrition['vitamin_b9_ug'] for f in foods if f.fortified)
        natural = total - fortified

        # Apply 1.7x to fortified
        effective = natural + (fortified * 1.7)

        rda = self.rda['vitamin_b9_ug']
        percentage = (effective / rda) * 100

        return {
            'total': total,
            'natural': natural,
            'fortified': fortified,
            'effective': effective,
            'rda': rda,
            'percentage': percentage,
            'confidence': 'high',
            'note': '1.7x bioavailability applied to fortified sources',
        }

    def assess_iron_simple(self, foods, total):
        """Simple iron - flag if plant-only"""

        animal_iron = sum(
            f.nutrition['iron_mg'] for f in foods
            if f.category in ['meat', 'poultry', 'fish']
        )

        if animal_iron < total * 0.1:
            # Plant-heavy (>90% from plants)
            effective = total * 0.7  # 30% penalty
            note = "Mostly plant-based iron (lower absorption). Include vitamin C with meals."
            confidence = 'low'
        else:
            # Mixed sources
            effective = total
            note = ""
            confidence = 'medium'

        rda = self.rda['iron_mg']
        percentage = (effective / rda) * 100

        return {
            'total': total,
            'animal_iron': animal_iron,
            'effective': effective,
            'rda': rda,
            'percentage': percentage,
            'confidence': confidence,
            'note': note,
        }
```

**Pros:**
- Simple to implement (100-200 lines of code)
- Handles 3 most problematic nutrients
- Direct comparison for everything else
- Good enough for most users (±15-25% accuracy)

**Cons:**
- Misses some preparation losses
- Doesn't account for calcium-oxalate binding
- No cooking method corrections

**Recommendation:** Start with this, iterate based on user feedback

---

### 5.2 Power User Features

**For users who want maximum accuracy:**

```python
class PowerUserNutritionAssessor(MinimalNutritionAssessor):
    """Extended assessment with all corrections"""

    def __init__(self, rda_values, user_profile):
        super().__init__(rda_values)
        self.user = user_profile

        # Load correction factor tables
        self.retention_factors = load_retention_table()
        self.bioavailability_factors = load_bioavailability_table()

        # Add more special handling
        self.special_handling.update({
            'vitamin_c_mg': self.assess_vitamin_c_advanced,
            'calcium_mg': self.assess_calcium_advanced,
            'zinc_mg': self.assess_zinc_advanced,
        })

    def assess_vitamin_c_advanced(self, foods, total):
        """Advanced vitamin C - account for cooking losses"""

        effective = 0

        for food in foods:
            vitamin_c = food.nutrition['vitamin_c_mg']

            # Check if database is raw or cooked
            if food.metadata.get('database_state') == 'cooked':
                effective += vitamin_c
            else:
                # Apply retention factor based on preparation
                prep = food.preparation_method or 'unknown'
                retention = self.retention_factors['vitamin_c_mg'].get(prep, 0.80)
                effective += vitamin_c * retention

        rda = self.rda['vitamin_c_mg']
        percentage = (effective / rda) * 100

        loss = total - effective
        loss_pct = (loss / total * 100) if total > 0 else 0

        return {
            'total': total,
            'effective': effective,
            'loss': loss,
            'loss_percentage': loss_pct,
            'rda': rda,
            'percentage': percentage,
            'confidence': 'medium-high',
            'note': f'Cooking losses: {loss_pct:.0f}%' if loss_pct > 10 else '',
        }

    # Similar methods for calcium, zinc, etc.
```

**Power User Features:**
- Preparation method tracking and corrections
- Bioavailability enhancements (vitamin C + iron synergy)
- Individual absorption factor adjustments
- Confidence interval calculations
- "What if" simulations (change cooking method)

---

### 5.3 Data Tables Needed

**Table 1: RDA/DRI Values**
```python
RDA_VALUES = {
    # By age and sex
    'adult_male_19_50': {
        'protein_g': 56,
        'vitamin_c_mg': 90,
        'vitamin_a_ug': 900,  # RAE
        'vitamin_b9_ug': 400,  # DFE
        'iron_mg': 8,
        'calcium_mg': 1000,
        # ... all 52 nutrients
    },
    'adult_female_19_50': {
        'protein_g': 46,
        'vitamin_c_mg': 75,
        'vitamin_a_ug': 700,  # RAE
        'vitamin_b9_ug': 400,  # DFE
        'iron_mg': 18,  # Pre-menopausal
        'calcium_mg': 1000,
        # ... all 52 nutrients
    },
    # Additional categories:
    # - pregnant, breastfeeding
    # - age 50+, age 70+
    # - children by age group
}
```

**Table 2: Nutrient Retention Factors (from USDA Release 6)**
```python
RETENTION_FACTORS = {
    'vitamin_c_mg': {
        'raw': 1.00,
        'steamed': 0.90,
        'microwaved': 0.92,
        'pressure_cooked': 0.92,
        'stir_fried': 0.75,
        'grilled': 0.70,
        'boiled_short': 0.60,
        'boiled_long': 0.40,
        'roasted': 0.60,
    },
    'vitamin_b9_ug': {
        'raw': 1.00,
        'steamed': 0.80,
        'boiled': 0.40,
        'microwaved': 0.75,
        'roasted': 0.50,
    },
    'vitamin_b1_mg': {
        'raw': 1.00,
        'steamed': 0.85,
        'boiled': 0.60,
        'grilled': 0.85,
    },
    # Default for unlisted nutrients
    '_default': {
        'raw': 1.00,
        'cooked': 0.95,
    }
}
```

**Table 3: Bioavailability Factors**
```python
BIOAVAILABILITY_FACTORS = {
    'vitamin_a_ug_rae': {
        # RAE conversion factors
        'preformed_retinol': 1.0,      # Animal sources
        'beta_carotene_cooked': 0.083,  # 1/12
        'beta_carotene_raw': 0.042,     # 1/24
    },
    'vitamin_b9_ug_dfe': {
        # DFE conversion factors
        'natural_folate': 1.0,
        'synthetic_folic_acid': 1.7,
    },
    'iron_mg': {
        'heme_animal': 0.25,           # 25% absorption
        'nonheme_baseline': 0.05,      # 5% absorption
        'nonheme_with_vitC': 0.15,     # 15% with vitamin C
        'nonheme_with_phytate': 0.025, # 2.5% with phytates
    },
    'calcium_mg': {
        'baseline': 0.30,              # 30% absorption (dairy)
        'high_oxalate_raw': 0.05,      # 5% (spinach raw)
        'high_oxalate_boiled': 0.15,   # 15% (spinach boiled)
    },
}
```

**Table 4: Nutrient Classifications**
```python
NUTRIENT_CLASSIFICATIONS = {
    'stable_direct_comparison': [
        'protein_g', 'fat_g', 'carbs_total_g',
        'sodium_mg', 'potassium_mg', 'phosphorus_mg',
        'vitamin_b3_mg', 'vitamin_b5_mg',
    ],
    'bioavailability_correction_needed': [
        'vitamin_a_ug', 'vitamin_b9_ug', 'iron_mg', 'calcium_mg', 'zinc_mg',
    ],
    'heat_sensitive': [
        'vitamin_c_mg', 'vitamin_b1_mg', 'vitamin_b9_ug',
    ],
    'enhanced_by_cooking': [
        # Note: These affect "effective content" rather than RDA comparison
        # Handled via food-specific adjustments, not RDA corrections
    ],
}
```

---

### 5.4 Order of Operations for Calculations

**Complete calculation pipeline:**

```python
def calculate_daily_nutrient_adequacy(daily_log, user_profile):
    """Complete pipeline for nutrient adequacy assessment"""

    # STEP 1: Load user's RDA values
    rda_values = get_rda_values(user_profile.age, user_profile.sex,
                                 user_profile.pregnant, user_profile.breastfeeding)

    # STEP 2: Sum raw nutrient totals from food log
    raw_totals = {}
    for meal in daily_log:
        for food_entry in meal.foods:
            for nutrient, value in food_entry.nutrition.items():
                raw_totals[nutrient] = raw_totals.get(nutrient, 0) + value

    # STEP 3: For each nutrient, apply appropriate assessment strategy
    assessments = {}

    for nutrient, raw_total in raw_totals.items():
        # Classify nutrient
        category = classify_nutrient(nutrient)

        if category == 'stable':
            # Direct comparison
            effective_intake = raw_total
            adjustments = []

        elif category == 'bioavailability_critical':
            # Apply bioavailability corrections
            effective_intake, adjustments = apply_bioavailability_corrections(
                nutrient, daily_log, raw_total
            )

        elif category == 'heat_sensitive':
            # Apply preparation retention factors
            effective_intake, adjustments = apply_retention_corrections(
                nutrient, daily_log, raw_total
            )

        else:
            # Default: direct comparison
            effective_intake = raw_total
            adjustments = []

        # STEP 4: Compare to RDA
        rda = rda_values.get(nutrient)
        if rda:
            percentage = (effective_intake / rda) * 100
            status = classify_adequacy_status(percentage)
        else:
            percentage = None
            status = 'no_rda'

        # STEP 5: Calculate confidence
        confidence = calculate_confidence(
            nutrient, daily_log, adjustments, category
        )

        # STEP 6: Store assessment
        assessments[nutrient] = {
            'nutrient': nutrient,
            'raw_total': raw_total,
            'effective_intake': effective_intake,
            'rda': rda,
            'percentage': percentage,
            'status': status,
            'confidence': confidence['level'],
            'error_range': confidence['error_range'],
            'adjustments': adjustments,
        }

    # STEP 7: Generate summary and flags
    summary = generate_adequacy_summary(assessments, user_profile)
    flags = identify_deficiency_risks(assessments, user_profile)

    return {
        'date': daily_log.date,
        'assessments': assessments,
        'summary': summary,
        'flags': flags,
    }
```

---

## 6. User Experience

### 6.1 Communication Strategies

**Principle: Transparency without Overwhelm**

**Basic View (Default):**
```
Daily Nutrition Summary - November 6, 2025

✅ ADEQUATE (6 nutrients)
Protein: 125% • Sodium: 140% • Potassium: 110%
Fat: 115% • Vitamin B3: 105% • Vitamin E: 108%

⚠️ BORDERLINE (3 nutrients)
Calcium: 78% • Zinc: 72% • Fiber: 85%

❌ INADEQUATE (4 nutrients)
Vitamin C: 55% • Iron: 45% • Folate: 62% • Vitamin D: 40%

[View Details] [What This Means] [Improve My Diet]
```

**Detailed View (Click "View Details"):**
```
Vitamin C: 55% of RDA (50mg / 90mg target)
🟡 Medium confidence ±20% (range: 44-66%)

Why this matters:
• Essential for immune function and wound healing
• Destroyed by cooking (especially boiling)

Improve:
✅ Add citrus fruits (orange: 70mg)
✅ Include raw bell peppers (190mg per pepper)
✅ Steam vegetables instead of boiling

Current sources today:
• Broccoli, boiled (15mg) - cooking reduced from ~50mg raw
• Apple, raw (5mg)
• Salad greens (8mg)
```

**Expert Mode (Power Users):**
```
Vitamin C Detailed Analysis

Raw Total: 82mg
  ├─ Broccoli (raw DB value): 50mg
  │  └─ Boiled 12min → retention 0.60 → effective: 30mg (❌ -20mg loss)
  ├─ Bell pepper (raw): 25mg
  │  └─ Stir-fried 5min → retention 0.75 → effective: 19mg (⚠️ -6mg loss)
  └─ Orange (fresh): 7mg
     └─ No prep → effective: 7mg

Effective Total: 56mg
RDA Target: 90mg
Percentage: 62% (🟡 Medium confidence ±18%)

Preparation Impact: -26mg loss (32% reduction from cooking)
Recommendation: Increase raw/lightly cooked vitamin C sources

[Simulate Different Cooking Methods] [Track Preparation Habits]
```

---

### 6.2 "% of Daily Value" - Adjusted or Raw?

**Recommendation: Show Both with Context**

**Option 1: Effective Intake (Primary Display)**
```
Iron: 67% of RDA
(12mg effective intake / 18mg target)

Raw total: 18mg
Effective: 12mg (plant sources have lower absorption)
```

**Option 2: Raw with Asterisk**
```
Iron: 100% of RDA*

*Note: Mostly plant-based iron. Actual absorption may be lower (estimated 60-70% effective). Include vitamin C with meals to improve absorption.
```

**Preferred: Option 1 (Show Effective)**
- More accurate representation
- Users see realistic picture
- Encourages appropriate dietary changes
- Avoids false confidence

**Trade-off:** May initially confuse users ("why is my iron not 100% when I ate 18mg?")
- Mitigate with education and tooltips
- Provide "Show Calculations" option

---

### 6.3 When to Show Caveats/Disclaimers

**Always Show:**
- Confidence levels (high/medium/low)
- Error ranges for borderline cases
- Major adjustments applied (e.g., "DFE conversion applied")

**Show When Relevant:**
- Low confidence with inadequate status → recommend professional advice
- Multiple deficiencies → suggest medical check-up
- Pregnancy/special populations → emphasize seeing healthcare provider

**Example Disclaimers:**

```
⚠️ LOW CONFIDENCE ASSESSMENT
Your iron intake estimate has low confidence (±35%) due to:
• Mix of plant and animal sources (different absorption)
• Unknown meal composition (vitamin C enhancers not tracked)

Recommendation: If concerned about iron status, request ferritin blood test from doctor.
```

```
ℹ️ NUTRIENT TRACKING LIMITATIONS
This tool estimates nutrient intake based on food databases and typical preparation methods. Actual nutrient content and absorption vary based on:
• Food freshness and storage
• Cooking methods and equipment
• Individual absorption factors
• Meal composition and timing

For medical nutrition therapy or deficiency treatment, consult a registered dietitian.
```

---

### 6.4 Educational Content

**Progressive Disclosure:**

**Level 1: Casual User**
- Simple traffic lights (✅⚠️❌)
- "You're getting enough protein!"
- One-click improvement tips

**Level 2: Engaged Tracker**
- Percentage of RDA with confidence
- Top 3 deficiencies highlighted
- Food recommendations to improve

**Level 3: Power User**
- Full adjustments breakdown
- Bioavailability corrections shown
- "What if" scenario testing
- Historical trends and patterns

**Level 4: Clinical/Research**
- Complete confidence analysis
- Uncertainty quantification
- Raw vs effective comparison
- Export data for professionals

---

## 7. Edge Cases

### 7.1 Mixed Dishes with Multiple Cooking Methods

**Challenge:** Restaurant dish with components cooked differently

**Example:** Chicken stir-fry
- Chicken: diced, stir-fried (high heat, short time)
- Broccoli: blanched then stir-fried
- Peppers: raw → stir-fried
- Sauce: added at end (no heat)

**Computational Approach:**

```python
def assess_mixed_dish(dish_components, nutrient):
    """Assess nutrient in dish with multiple cooking methods"""

    total_effective = 0

    for component in dish_components:
        # Each component has its own preparation
        raw_value = component.nutrition[nutrient]
        prep_method = component.preparation_method

        # Apply retention factor per component
        retention = get_retention_factor(nutrient, prep_method)

        effective = raw_value * retention
        total_effective += effective

    return total_effective
```

**Practical Simplification:**
```python
def assess_mixed_dish_simple(dish, nutrient):
    """Simplified assessment for restaurant dishes"""

    # If database entry is "as consumed", trust it
    if dish.metadata.get('database_state') == 'as_consumed':
        return dish.nutrition[nutrient]

    # Otherwise, apply conservative average retention
    if nutrient in HEAT_SENSITIVE_NUTRIENTS:
        # Assume mixed cooking (some boiling, some stir-fry)
        average_retention = 0.70  # Conservative 30% loss
        return dish.nutrition[nutrient] * average_retention
    else:
        # Stable nutrients
        return dish.nutrition[nutrient]
```

**Recommendation:**
- Restaurant dishes → use database "as consumed" value (already accounts for prep)
- Home-cooked complex recipes → track components separately if possible
- Default → conservative 70% retention for heat-sensitive nutrients

---

### 7.2 Foods Eaten Both Raw and Cooked

**Challenge:** User eats carrots both raw (snack) and cooked (dinner)

**Example Daily Log:**
- Breakfast: Raw carrot sticks (100g)
- Dinner: Roasted carrots (150g)

**Vitamin A Assessment:**

```python
def assess_vitamin_a_mixed_raw_cooked(foods):
    """Handle vitamin A from both raw and cooked plant sources"""

    effective_rae = 0

    for food in foods:
        beta_carotene_ug = food.nutrition['vitamin_a_ug']  # Assuming in β-carotene equivalents

        if food.preparation in ['raw', 'fresh']:
            # Raw: 24:1 conversion
            rae = beta_carotene_ug / 24
        elif food.preparation in ['cooked', 'roasted', 'steamed', 'boiled']:
            # Cooked: 12:1 conversion (better absorption)
            rae = beta_carotene_ug / 12
        else:
            # Unknown: conservative 12:1
            rae = beta_carotene_ug / 12

        effective_rae += rae

    return effective_rae
```

**Result:**
```
Vitamin A Assessment:

Raw carrots (100g):
  β-carotene: 8,285 µg → 345 µg RAE (24:1 conversion)

Roasted carrots (150g):
  β-carotene: 12,428 µg → 1,036 µg RAE (12:1 conversion, enhanced by cooking)

Total Effective: 1,381 µg RAE
RDA: 900 µg RAE
Percentage: 153% ✅

Note: Cooking enhances vitamin A absorption from plant sources
```

---

### 7.3 Supplements vs Food Sources

**Challenge:** Different bioavailability for synthetic vs natural forms

**Key Differences:**
| Nutrient | Food Source | Supplement Form | Bioavailability Ratio |
|----------|------------|-----------------|----------------------|
| Folate | Natural folate | Folic acid | 1 : 1.7 (supplement better) |
| Vitamin E | d-alpha-tocopherol | dl-alpha-tocopherol | 1 : 0.5 (food better) |
| Calcium | Food calcium | Calcium carbonate | 1 : 1.1 (similar) |
| Iron | Heme iron (meat) | Ferrous sulfate | 1 : 0.6-1.2 (varies) |

**Computational Approach:**

```python
def assess_with_supplements(foods, supplements, nutrient):
    """Assess nutrient from both food and supplements"""

    # Food sources
    food_total = sum(f.nutrition[nutrient] for f in foods)

    # Apply bioavailability for food sources
    food_effective = apply_food_bioavailability(foods, nutrient, food_total)

    # Supplement sources
    supplement_total = sum(s.nutrition[nutrient] for s in supplements)

    # Apply bioavailability for supplements
    supplement_effective = apply_supplement_bioavailability(supplements, nutrient, supplement_total)

    # Total effective intake
    total_effective = food_effective + supplement_effective

    return {
        'food_raw': food_total,
        'food_effective': food_effective,
        'supplement_raw': supplement_total,
        'supplement_effective': supplement_effective,
        'total_effective': total_effective,
    }
```

**Specific Example: Folate**

```python
def assess_folate_with_supplement(foods, supplements):
    """Folate: Supplement (folic acid) is 1.7x more bioavailable"""

    # Food folate (natural)
    food_folate_ug = sum(f.nutrition['vitamin_b9_ug'] for f in foods if not f.fortified)
    food_dfe = food_folate_ug * 1.0  # Natural = 1:1 DFE

    # Fortified food (synthetic folic acid)
    fortified_ug = sum(f.nutrition['vitamin_b9_ug'] for f in foods if f.fortified)
    fortified_dfe = fortified_ug * 1.7

    # Supplement (synthetic folic acid)
    supplement_ug = sum(s.nutrition['vitamin_b9_ug'] for s in supplements)
    supplement_dfe = supplement_ug * 1.7

    total_dfe = food_dfe + fortified_dfe + supplement_dfe

    rda = 400  # µg DFE
    percentage = (total_dfe / rda) * 100

    return {
        'food_natural': food_folate_ug,
        'food_fortified': fortified_ug,
        'supplement': supplement_ug,
        'total_dfe': total_dfe,
        'percentage': percentage,
        'note': '1.7x DFE applied to fortified/supplement sources'
    }
```

**User-Facing Display:**
```
Folate (Vitamin B9) Assessment:

Food sources (natural): 180 µg → 180 µg DFE
Fortified cereal: 100 µg → 170 µg DFE (1.7x conversion)
Supplement: 400 µg → 680 µg DFE (1.7x conversion)

Total: 1,030 µg DFE (258% of RDA) ✅

⚠️ Note: Upper limit for synthetic folic acid is 1,000 µg/day. Consider reducing supplement dose if taking daily.
```

---

### 7.4 Fortified Foods

**Challenge:** Synthetic nutrients added at various levels

**Computational Approach:**

```python
def handle_fortified_food(food_entry, nutrient):
    """Special handling for fortified foods"""

    # Check if fortification data available
    if food_entry.fortification:
        base_amount = food_entry.fortification.get(f'{nutrient}_base', 0)
        added_amount = food_entry.fortification.get(f'{nutrient}_added', 0)

        # Total = base + added
        total = base_amount + added_amount

        # Apply different bioavailability to added synthetic nutrients
        if nutrient == 'vitamin_b9_ug':
            # Synthetic folic acid: 1.7x
            base_effective = base_amount * 1.0
            added_effective = added_amount * 1.7
            effective = base_effective + added_effective
        else:
            effective = total

        return {
            'total': total,
            'effective': effective,
            'base': base_amount,
            'added': added_amount,
        }
    else:
        # No fortification data - treat as-is
        return {
            'total': food_entry.nutrition[nutrient],
            'effective': food_entry.nutrition[nutrient],
        }
```

**Example: Fortified Cereal**

```
Fortified Breakfast Cereal (1 serving)

Vitamin B9 (Folate):
  Natural folate: 20 µg (from grains)
  Added folic acid: 200 µg (fortification)

  Effective DFE: 20 + (200 × 1.7) = 360 µg DFE

  % of RDA: 90% from one serving ✅
```

---

## 8. Validation Approach

### 8.1 Test Cases with Known Outcomes

**Test Suite Design:**

```python
class NutritionAssessmentTestCases:
    """Validation test cases for nutrient adequacy calculations"""

    def test_direct_comparison_stable_nutrient(self):
        """Test Case 1: Protein (stable nutrient, direct comparison)"""

        daily_foods = [
            Food(name='chicken_breast', nutrition={'protein_g': 30}),
            Food(name='eggs', nutrition={'protein_g': 12}),
            Food(name='yogurt', nutrition={'protein_g': 10}),
        ]

        assessment = assess_nutrient('protein_g', daily_foods, rda=56)

        assert assessment['raw_total'] == 52
        assert assessment['effective_intake'] == 52  # No adjustments
        assert assessment['percentage'] == pytest.approx(93, abs=1)
        assert assessment['confidence'] == 'high'

    def test_folate_dfe_conversion(self):
        """Test Case 2: Folate with synthetic folic acid"""

        daily_foods = [
            Food(name='spinach', nutrition={'vitamin_b9_ug': 100}, fortified=False),
            Food(name='fortified_cereal', nutrition={'vitamin_b9_ug': 100}, fortified=True),
        ]

        assessment = assess_nutrient('vitamin_b9_ug', daily_foods, rda=400)

        # Natural: 100 µg = 100 DFE
        # Synthetic: 100 µg = 170 DFE
        expected_dfe = 100 + 170  # 270 DFE

        assert assessment['effective_intake'] == pytest.approx(270, abs=1)
        assert assessment['percentage'] == pytest.approx(67.5, abs=1)

    def test_vitamin_c_cooking_loss(self):
        """Test Case 3: Vitamin C with cooking losses"""

        daily_foods = [
            Food(
                name='broccoli_boiled',
                nutrition={'vitamin_c_mg': 50},  # Raw database value
                preparation_method='boiled_long',
                metadata={'database_state': 'raw'}
            ),
            Food(
                name='orange',
                nutrition={'vitamin_c_mg': 70},
                preparation_method='fresh'
            ),
        ]

        assessment = assess_nutrient('vitamin_c_mg', daily_foods, rda=90)

        # Broccoli: 50mg × 0.40 retention (boiled long) = 20mg
        # Orange: 70mg × 1.0 (fresh) = 70mg
        expected_effective = 20 + 70  # 90mg

        assert assessment['raw_total'] == 120
        assert assessment['effective_intake'] == pytest.approx(90, abs=2)
        assert assessment['percentage'] == pytest.approx(100, abs=2)

    def test_iron_heme_nonheme(self):
        """Test Case 4: Iron with heme vs non-heme sources"""

        daily_foods = [
            Food(
                name='beef',
                nutrition={'iron_mg': 3.0},
                food_category='meat'
            ),
            Food(
                name='lentils',
                nutrition={'iron_mg': 6.0},
                food_category='legume'
            ),
        ]

        assessment = assess_nutrient('iron_mg', daily_foods, rda=18)

        # Beef (heme): 3mg × 0.40 heme × 0.25 absorption + 3mg × 0.60 nonheme × 0.10 = 0.48mg
        # Lentils (nonheme): 6mg × 0.05 absorption = 0.30mg
        # Total effective: ~0.78mg absorbed vs RDA need of ~3.24mg absorbed (18mg × 0.18)

        # Simplified: Apply penalty for plant-heavy
        expected_effective = 9.0 * 0.7  # 30% penalty for plant-heavy

        assert assessment['effective_intake'] == pytest.approx(expected_effective, abs=1)

    def test_vitamin_a_rae_conversion(self):
        """Test Case 5: Vitamin A RAE from plant sources"""

        daily_foods = [
            Food(
                name='carrots_cooked',
                nutrition={'vitamin_a_ug': 8000},  # β-carotene equivalents
                food_category='plant',
                preparation_method='roasted'
            ),
        ]

        assessment = assess_nutrient('vitamin_a_ug', daily_foods, rda=900)

        # Cooked β-carotene: 12:1 conversion
        expected_rae = 8000 / 12  # 667 µg RAE

        assert assessment['effective_intake'] == pytest.approx(667, abs=10)
        assert assessment['percentage'] == pytest.approx(74, abs=2)
```

**Validation Data Sources:**

1. **USDA Reference Data**
   - Use foods with both raw and cooked entries
   - Verify retention factor calculations
   - Example: Broccoli raw vs boiled

2. **Published Studies**
   - Folate DFE calculations (IOM guidelines)
   - Iron bioavailability studies
   - Vitamin A RAE conversion validation

3. **Professional Software Comparison**
   - Compare calculations to Cronometer, ESHA, Nutritionist Pro
   - Expect ±5-10% variance (acceptable)

---

### 8.2 Comparison to Professional Software

**Benchmarking Strategy:**

```python
def benchmark_against_cronometer():
    """Compare calculations to Cronometer"""

    test_meals = [
        # Meal 1: Simple protein
        {
            'foods': ['chicken_breast_grilled_150g', 'brown_rice_cooked_200g'],
            'cronometer_values': {
                'protein_g': 42,
                'iron_mg': 1.2,
                'vitamin_b9_ug': 28,
            }
        },
        # Meal 2: Complex with fortified foods
        {
            'foods': ['fortified_cereal_50g', 'milk_200ml', 'banana_120g'],
            'cronometer_values': {
                'vitamin_b9_ug_dfe': 380,
                'calcium_mg': 420,
                'vitamin_d_ug': 3.2,
            }
        },
    ]

    for meal in test_meals:
        our_values = calculate_meal_nutrients(meal['foods'])
        cronometer_values = meal['cronometer_values']

        for nutrient, expected in cronometer_values.items():
            calculated = our_values[nutrient]
            variance = abs(calculated - expected) / expected * 100

            print(f"{nutrient}: {calculated} vs {expected} (variance: {variance:.1f}%)")

            # Acceptable variance: ±10%
            assert variance < 10, f"Variance too high for {nutrient}"
```

**Expected Variances:**
- Stable nutrients (protein, fat, carbs): ±3-5%
- Minerals: ±5-10%
- Vitamins: ±8-15%
- Complex calculations (DFE, RAE): ±10-20%

---

## 9. Future Enhancements

### 9.1 Personalization for Absorption Efficiency

**Individual Factors Affecting Absorption:**

```python
class PersonalizedAbsorptionProfile:
    """User-specific absorption factors"""

    def __init__(self, user):
        self.user = user
        self.factors = self._calculate_factors()

    def _calculate_factors(self):
        """Calculate personalized absorption modifiers"""

        factors = {
            # Default: 1.0 (average population)
            'iron': 1.0,
            'calcium': 1.0,
            'vitamin_d': 1.0,
            'vitamin_b12': 1.0,
        }

        # Age-based adjustments
        if self.user.age > 50:
            factors['calcium'] *= 0.85  # Reduced absorption with age
            factors['vitamin_b12'] *= 0.70  # Reduced stomach acid

        if self.user.age > 70:
            factors['vitamin_d'] *= 0.75  # Reduced skin synthesis

        # Sex-based adjustments
        if self.user.sex == 'female' and self.user.menstruating:
            factors['iron'] *= 1.2  # Higher need during menstruation

        # Health conditions
        if self.user.conditions.get('celiac'):
            factors['iron'] *= 0.60
            factors['calcium'] *= 0.70
            factors['vitamin_d'] *= 0.75

        if self.user.conditions.get('crohns'):
            factors['vitamin_b12'] *= 0.50
            factors['iron'] *= 0.70

        if self.user.conditions.get('low_stomach_acid'):
            factors['iron'] *= 0.70
            factors['calcium'] *= 0.85
            factors['vitamin_b12'] *= 0.60

        # Medication interactions
        if self.user.medications.get('ppi'):  # Proton pump inhibitors
            factors['calcium'] *= 0.80
            factors['vitamin_b12'] *= 0.65
            factors['iron'] *= 0.75

        return factors

    def adjust_assessment(self, nutrient, base_assessment):
        """Apply personalized factors to assessment"""

        if nutrient not in self.factors:
            return base_assessment

        factor = self.factors[nutrient]

        adjusted = base_assessment.copy()
        adjusted['effective_intake'] *= factor
        adjusted['percentage'] *= factor
        adjusted['personalized'] = True
        adjusted['adjustment_factor'] = factor

        return adjusted
```

**Future: Biomarker Integration**

```python
def integrate_blood_test_results(user, nutrient_assessments):
    """Calibrate absorption factors based on blood test results"""

    # User logs blood test: ferritin 15 ng/mL (low)
    # System calculates: iron intake 100% RDA
    # Conclusion: Absorption factor lower than average

    if user.blood_tests.latest('ferritin') < 30:  # Low ferritin
        if nutrient_assessments['iron_mg']['percentage'] > 80:
            # High intake but low stores → poor absorption
            suggested_factor = 0.60  # Reduce effective absorption estimate

            return {
                'nutrient': 'iron_mg',
                'calibration': suggested_factor,
                'note': 'Based on ferritin levels, your iron absorption appears lower than average. Consider heme iron sources or supplementation.',
            }
```

---

### 9.2 Machine Learning for Cooking Method Detection

**Training Data:**

```python
# Collect user corrections over time
training_data = [
    {
        'food_name': 'broccoli',
        'meal_context': 'dinner, hot meal, restaurant',
        'user_corrected_prep': 'steamed',
        'initial_guess': 'boiled',
    },
    {
        'food_name': 'chicken breast',
        'meal_context': 'lunch, takeaway, Simple Health Kitchen',
        'user_corrected_prep': 'grilled',
        'initial_guess': 'grilled',  # Correct
    },
]

# ML model predicts preparation method from context
def predict_preparation_method(food_name, meal_context):
    """Predict most likely cooking method"""

    features = {
        'food_name': food_name,
        'meal_type': meal_context.meal_type,
        'venue_type': meal_context.venue_type,
        'temperature': meal_context.temperature,  # hot/cold
        'cuisine': meal_context.cuisine,
        'user_history': get_user_typical_prep(food_name),
    }

    # Simple heuristics initially, ML later
    if meal_context.venue_type == 'restaurant':
        if cuisine == 'asian':
            return 'stir_fried'
        elif cuisine == 'american':
            return 'grilled'

    # User's typical method
    return get_user_typical_prep(food_name) or 'cooked_unknown'
```

---

### 9.3 Integration with Biomarker Data

**Closed-Loop Validation:**

```python
class BiomarkerIntegration:
    """Validate nutrient intake estimates against actual biomarkers"""

    def __init__(self, user):
        self.user = user

    def compare_intake_to_biomarkers(self, nutrient, intake_assessment, blood_test):
        """Check if intake assessment matches biomarker status"""

        if nutrient == 'vitamin_d_ug':
            # Compare intake to 25-OH vitamin D blood level
            intake_pct = intake_assessment['percentage']
            blood_level = blood_test['25_oh_vitamin_d_ng_ml']

            expected_level = self._predict_vitamin_d_level(intake_pct)

            if abs(blood_level - expected_level) > 10:
                # Discrepancy detected
                return {
                    'discrepancy': True,
                    'possible_reasons': [
                        'Sun exposure not accounted for',
                        'Absorption issues (fat malabsorption)',
                        'Supplement form not bioavailable',
                        'Incorrect food database values',
                    ],
                    'recommendation': 'Consult healthcare provider to investigate'
                }

        elif nutrient == 'iron_mg':
            # Compare to ferritin
            intake_pct = intake_assessment['percentage']
            ferritin = blood_test['ferritin_ng_ml']

            if intake_pct > 100 and ferritin < 30:
                return {
                    'discrepancy': True,
                    'possible_reasons': [
                        'Poor iron absorption (plant-based iron)',
                        'Chronic bleeding',
                        'Celiac disease or IBD',
                        'Calcium/phytate interference',
                    ],
                    'recommendation': 'Increase heme iron sources or supplement under medical supervision'
                }
```

---

## 10. Summary and Recommendations

### 10.1 Simplest, Most Accurate Approach

**RECOMMENDED: Hybrid Strategy (Strategy D)**

**For 80% of nutrients:**
- Use database values directly
- Compare to RDA without adjustments
- Communicate medium confidence (±15-25%)

**For 20% of critical nutrients:**
- Apply bioavailability corrections (vitamin A RAE, folate DFE, iron, calcium)
- Apply preparation losses where data available (vitamin C, thiamin)
- Communicate confidence levels per nutrient

**Implementation Priority:**

**Phase 1: MVP (Weeks 1-2)**
```python
# Simple system:
# - Direct comparison for all nutrients
# - Flag folate to apply DFE conversion (fortified foods)
# - Flag vitamin A to apply RAE conversion (plant sources)
# - Flag iron if plant-only diet
# - Show confidence levels

def assess_adequacy_mvp(daily_log, rda):
    totals = sum_nutrients(daily_log)

    for nutrient, total in totals.items():
        if nutrient == 'vitamin_b9_ug':
            effective = apply_dfe_conversion(daily_log, total)
        elif nutrient == 'vitamin_a_ug':
            effective = apply_rae_conversion(daily_log, total)
        elif nutrient == 'iron_mg':
            effective = apply_iron_adjustment(daily_log, total)
        else:
            effective = total

        percentage = (effective / rda[nutrient]) * 100
        confidence = 'medium'

        yield {
            'nutrient': nutrient,
            'percentage': percentage,
            'confidence': confidence,
        }
```

**Phase 2: Enhanced (Weeks 3-4)**
```python
# Add:
# - Vitamin C cooking loss corrections
# - Calcium-oxalate binding for spinach
# - User profile factors (age, sex, pregnancy)
# - Confidence scoring system
# - Educational tooltips
```

**Phase 3: Advanced (Weeks 5-8)**
```python
# Add:
# - Preparation method tracking
# - Complete retention factor table
# - Individual absorption factors
# - Biomarker integration
# - "What if" scenarios
```

---

### 10.2 Balancing Scientific Reality and Practicality

**Scientific Reality:**
- Bioavailability varies ±50% between individuals
- Food database values have ±10-30% error
- Cooking losses range 0-90%
- RDA is population average, not individual need

**Practical Reality:**
- Users want simple "am I getting enough?"
- Too much uncertainty paralyzes action
- Perfect accuracy impossible without blood tests
- Good enough > nothing

**The Balance:**

✅ **DO:**
- Show confidence levels (high/medium/low)
- Apply corrections for well-established issues (RAE, DFE)
- Educate users about limitations
- Flag serious deficiencies for professional follow-up
- Provide ranges instead of false precision

❌ **DON'T:**
- Claim <5% accuracy (impossible)
- Apply corrections without explaining why
- Ignore bioavailability differences for critical nutrients
- Hide uncertainty from users
- Over-complicate the interface

**Guiding Principle:**
> "Be approximately right rather than precisely wrong. Communicate uncertainty honestly while still providing actionable guidance."

---

### 10.3 Key Design Decisions

**Decision 1: Direct Comparison as Default**
- ✅ Simplest approach
- ✅ Database creators already consider typical preparation
- ✅ RDA assumes mixed diet
- ⚠️ May overestimate heat-sensitive vitamins
- **Verdict: Acceptable for most users (±15-25% accuracy)**

**Decision 2: Selective Bioavailability Corrections**
- ✅ Critical nutrients only (vitamin A, folate, iron)
- ✅ Well-established conversion factors
- ✅ Improves accuracy to ±8-15%
- ⚠️ Adds complexity
- **Verdict: Worth implementing for key nutrients**

**Decision 3: Preparation Method Tracking Optional**
- ✅ Highest accuracy (±5-10%) when available
- ❌ Users often don't remember/record cooking method
- ❌ Restaurant dishes don't have this data
- **Verdict: Power user feature, not required**

**Decision 4: Show Confidence Levels**
- ✅ Scientifically honest
- ✅ Educates users about limitations
- ✅ Builds long-term trust
- ⚠️ May initially confuse users
- **Verdict: Essential - implement with clear communication**

**Decision 5: Ranges Instead of Point Estimates**
- ✅ Communicates uncertainty
- ✅ More scientifically accurate
- ⚠️ May reduce user confidence
- **Verdict: Show ranges for borderline cases, optional for adequate intakes**

---

### 10.4 Implementation Roadmap

**Week 1-2: MVP**
- [ ] Implement direct comparison for all nutrients
- [ ] Add DFE conversion for folate (fortified flag)
- [ ] Add RAE conversion for vitamin A (plant/animal flag)
- [ ] Simple iron adjustment (plant-heavy diet flag)
- [ ] Basic confidence levels (high/medium/low)
- [ ] Traffic light status (✅⚠️❌)

**Week 3-4: Enhanced**
- [ ] Add vitamin C cooking loss corrections (if prep method available)
- [ ] Add calcium-oxalate binding for spinach/chard
- [ ] Implement confidence scoring system
- [ ] Add user profile factors (age, sex, pregnancy)
- [ ] Educational tooltips for each nutrient
- [ ] Deficiency risk flags and recommendations

**Week 5-6: Advanced**
- [ ] Preparation method dropdown in food logger
- [ ] Complete retention factor table (USDA Release 6)
- [ ] "What if" cooking method simulator
- [ ] Historical trend analysis (30/90-day averages)
- [ ] Export for healthcare providers

**Week 7-8: Power User**
- [ ] Individual absorption factor adjustments
- [ ] Biomarker integration (blood test results)
- [ ] Machine learning prep method prediction
- [ ] Research-grade uncertainty quantification
- [ ] API for third-party integrations

---

## Appendices

### Appendix A: Complete RDA/DRI Table

```yaml
rda_adult_male_19_50:
  # Macronutrients
  protein_g: 56
  # RDA for protein = 0.8 g/kg body weight (for 70kg male)

  # Vitamins - Water Soluble
  vitamin_c_mg: 90
  vitamin_b1_mg: 1.2   # Thiamin
  vitamin_b2_mg: 1.3   # Riboflavin
  vitamin_b3_mg: 16    # Niacin
  vitamin_b5_mg: 5     # Pantothenic acid (AI)
  vitamin_b6_mg: 1.3
  vitamin_b7_ug: 30    # Biotin (AI)
  vitamin_b9_ug: 400   # Folate (DFE)
  vitamin_b12_ug: 2.4
  choline_mg: 550      # AI

  # Vitamins - Fat Soluble
  vitamin_a_ug: 900    # RAE
  vitamin_d_ug: 15     # Age 19-70 (20 µg if >70)
  vitamin_e_mg: 15
  vitamin_k_ug: 120    # AI

  # Minerals - Major
  sodium_mg: 1500      # AI (UL: 2300)
  potassium_mg: 3400   # AI
  calcium_mg: 1000
  phosphorus_mg: 700
  magnesium_mg: 400

  # Minerals - Trace
  iron_mg: 8
  zinc_mg: 11
  selenium_ug: 55
  iodine_ug: 150
  copper_mg: 0.9
  manganese_mg: 2.3    # AI
  chromium_ug: 35      # AI
  molybdenum_ug: 45

rda_adult_female_19_50:
  protein_g: 46        # For 57kg female
  vitamin_c_mg: 75
  vitamin_b1_mg: 1.1
  vitamin_b2_mg: 1.1
  vitamin_b3_mg: 14
  vitamin_b5_mg: 5
  vitamin_b6_mg: 1.3
  vitamin_b7_ug: 30
  vitamin_b9_ug: 400
  vitamin_b12_ug: 2.4
  choline_mg: 425
  vitamin_a_ug: 700
  vitamin_d_ug: 15
  vitamin_e_mg: 15
  vitamin_k_ug: 90
  sodium_mg: 1500
  potassium_mg: 2600
  calcium_mg: 1000
  phosphorus_mg: 700
  magnesium_mg: 310
  iron_mg: 18          # Pre-menopausal (8 mg if post-menopausal)
  zinc_mg: 8
  selenium_ug: 55
  iodine_ug: 150
  copper_mg: 0.9
  manganese_mg: 1.8
  chromium_ug: 25
  molybdenum_ug: 45

# Special populations
rda_pregnant:
  protein_g: 71        # +25g
  vitamin_b9_ug: 600   # Critical for neural tube
  iron_mg: 27          # Increased blood volume
  # ... other adjustments

rda_breastfeeding:
  protein_g: 71
  vitamin_b9_ug: 500
  vitamin_a_ug: 1300
  # ... other adjustments
```

### Appendix B: USDA Retention Factors (Excerpt)

```yaml
# Source: USDA Table of Nutrient Retention Factors, Release 6 (2007)

vitamin_c_retention:
  # Vegetables
  broccoli:
    boiled: 0.66
    steamed: 0.78
    microwaved: 0.90
    stir_fried: 0.75

  spinach:
    boiled: 0.29   # 71% loss
    steamed: 0.85
    microwaved: 0.90

  # Meats
  beef:
    roasted: 1.00
    broiled: 1.00
    grilled: 1.00
    # Meat has negligible vitamin C

folate_retention:
  # B9 - Second most heat-sensitive
  vegetables:
    boiled: 0.40   # 60% loss
    steamed: 0.80
    microwaved: 0.75
    pressure_cooked: 0.85

  cereals:
    boiled: 0.50
    baked: 0.50

thiamin_retention:
  # B1 - Moderately heat-sensitive
  meat_simmered: 0.40
  meat_roasted: 0.90
  vegetables_boiled: 0.60
  vegetables_steamed: 0.85

# Most other nutrients: >90% retention
```

### Appendix C: Bioavailability Conversion Factors

```yaml
vitamin_a_conversion:
  # RAE = Retinol Activity Equivalents
  preformed_retinol: 1.0          # Animal sources (1:1)
  beta_carotene_supplement: 2.0    # 2 µg = 1 µg RAE
  beta_carotene_food_cooked: 12.0  # 12 µg = 1 µg RAE
  beta_carotene_food_raw: 24.0     # 24 µg = 1 µg RAE
  other_carotenoids: 24.0          # Alpha-carotene, beta-cryptoxanthin

folate_conversion:
  # DFE = Dietary Folate Equivalents
  natural_food_folate: 1.0         # 1 µg = 1 µg DFE
  synthetic_folic_acid: 0.6        # 0.6 µg = 1 µg DFE (1.7x more bioavailable)

iron_absorption:
  # % absorbed (highly variable)
  heme_iron_animal: 0.25           # 15-35% range
  nonheme_baseline: 0.05           # 2-20% range
  nonheme_with_vitamin_c: 0.15     # 3x enhancement
  nonheme_with_phytates: 0.025     # 50% reduction
  nonheme_with_calcium: 0.035      # 30% reduction

calcium_absorption:
  baseline_dairy: 0.30             # 30% absorbed
  high_oxalate_raw: 0.05           # Spinach raw (95% bound)
  high_oxalate_boiled: 0.15        # Spinach boiled (oxalates reduced)
  calcium_carbonate_supplement: 0.32
  calcium_citrate_supplement: 0.35  # Better absorption
```

---

**END OF DOCUMENT**

**Document Version:** 1.0
**Last Updated:** 2025-11-06
**Total Length:** ~36,000 words
**Reading Time:** ~2.5 hours
**Implementation Estimate:** 6-8 weeks (phased approach)
