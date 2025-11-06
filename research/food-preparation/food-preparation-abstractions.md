# Food Preparation Variation Abstractions
## Design Document for Nutrition Tracking System

**Author:** Claude Sonnet 4.5
**Date:** 2025-11-06
**Status:** Design Proposal
**System Context:** 76-dish food bank, 52-nutrient schema, component-based estimation methodology

---

## Executive Summary

This document proposes a **three-tier system** for handling food preparation variations in nutrition tracking:

1. **Tier 1 (Simple Mode):** Store final prepared dishes as-is (current approach) - handles 70% of use cases
2. **Tier 2 (Ingredient Mode):** Reference base ingredients with preparation metadata - handles 25% of use cases
3. **Tier 3 (Recipe Mode):** Multi-step preparation with compound adjustments - handles 5% of edge cases

**Core Philosophy:** **Explicit over implicit.** Every preparation adjustment must be traceable, auditable, and documented with confidence levels.

---

## 1. Data Model Design

### 1.1 Core Abstractions

```yaml
# Three fundamental concepts:
# 1. Base Food Item (raw or standardized reference state)
# 2. Preparation Method (transformation applied)
# 3. Prepared Dish (final consumed product)

# OPTION A: Current Approach (Tier 1 - Simple Mode)
# Store final prepared dish directly
id: grilled_salmon_fillet_shk_v1
category: main
per_portion:
  energy_kcal: 260
  protein_g: 28.0
  # ... all 52 nutrients in final prepared state

# OPTION B: New Approach (Tier 2 - Ingredient Mode)
# Store base ingredient + preparation metadata
id: salmon_atlantic_farmed_raw_150g_base_v1
category: ingredient_base
per_portion_raw:  # Base nutrition in raw state
  energy_kcal: 206
  protein_g: 22.1
  # ... all 52 nutrients
preparation_profiles:
  - method_id: grilled_light_oil
    yield_factor: 0.75  # 25% moisture loss
    adjustments:
      add_oil_g: 5  # Added during cooking
      retention_factors:
        vitamin_c: 0.75
        vitamin_b1: 0.85
    per_portion_prepared:  # Final calculated values
      energy_kcal: 260
      protein_g: 28.0  # 22.1g / 0.75 = 29.5g per 100g cooked weight

# OPTION C: Recipe Mode (Tier 3 - Complex Dishes)
id: chilli_poached_eggs_leto_v1
category: main
recipe:
  base_components:
    - ingredient_id: egg_large_raw_50g_v1
      quantity: 2
      prep_method: poached
    - ingredient_id: kale_raw_100g_v1
      quantity: 50
      prep_method: sauteed_olive_oil
    - ingredient_id: sourdough_bread_raw_v1
      quantity: 60
      prep_method: toasted
  cooking_medium:
    - type: butter
      amount_g: 22.2
      disposition: absorbed  # vs 'discarded' for deep-frying oil
  finishing:
    - type: salt
      amount_g: 1.76  # 0.5% of total weight
  per_portion_final:  # Computed from components
    energy_kcal: 597.4
    # ... 52 nutrients
```

### 1.2 Preparation Method Taxonomy

```yaml
# Core preparation methods organized by transformation type
preparation_methods:

  # THERMAL METHODS
  thermal:
    dry_heat:
      - id: grilled
        temperature: 200-260C
        typical_duration: 10-20min
        moisture_loss: 20-30%
        nutrient_effects:
          protein: stable
          fat: rendering (for fatty meats)
          vitamin_c: 15-30% loss
          b_vitamins: 10-25% loss
          minerals: concentration (due to moisture loss)

      - id: roasted
        temperature: 180-220C
        typical_duration: 20-60min
        moisture_loss: 15-25%

      - id: baked
        temperature: 160-200C
        typical_duration: 15-45min
        moisture_loss: 10-20%

      - id: pan_fried
        temperature: 150-190C
        oil_absorption: 5-15% of food weight
        moisture_loss: 15-25%

      - id: deep_fried
        temperature: 170-190C
        oil_absorption: 8-25% of food weight
        moisture_loss: 30-40%

    moist_heat:
      - id: boiled
        temperature: 100C
        moisture_change: 0-10% absorption
        nutrient_effects:
          water_soluble_vitamins: 25-50% leaching (if water discarded)
          minerals: 10-30% leaching (if water discarded)

      - id: steamed
        temperature: 100C
        moisture_change: 0-5% condensation
        nutrient_effects:
          water_soluble_vitamins: 10-25% loss
          minerals: 5-15% loss

      - id: poached
        temperature: 70-85C
        moisture_change: 0-5% absorption

      - id: braised
        temperature: 85-95C
        duration: 60-180min
        collagen_conversion: high (for tough cuts)

      - id: pressure_cooked
        temperature: 115-121C
        duration_reduction: 60-70% vs conventional
        nutrient_retention: improved vs boiling

  # MECHANICAL METHODS
  mechanical:
    - id: chopped
      nutrient_impact: none (immediate consumption)
      oxidation_risk: medium (vitamin C if exposed >30min)

    - id: pureed
      nutrient_impact: none
      bioavailability_change: improved for some nutrients

    - id: juiced
      fiber_removal: 80-95%
      vitamin_retention: 90-95% (immediate)

  # PRESERVATION METHODS
  preservation:
    - id: canned
      heat_treatment: high
      nutrient_effects:
        fat_soluble_vitamins: 5-20% loss
        vitamin_c: 50-85% loss
        b_vitamins: 20-40% loss
        minerals: stable (but may leach to liquid)

    - id: frozen
      blanching_required: vegetables (yes), fruits (no)
      nutrient_effects:
        freezing_impact: minimal (<5% loss)
        blanching_impact: 10-30% water-soluble vitamin loss

  # COMBINATION METHODS
  combination:
    - id: stir_fried
      oil_type: high smoke point oils
      temperature: 190-230C
      duration: 3-8min
      oil_absorption: 5-10%
      moisture_loss: 10-15%
      nutrient_effects:
        vitamins: better retention (short duration, high heat)
        minerals: concentration
```

### 1.3 Adjustment Factor System

```yaml
# Four types of adjustments applied in specific order:

adjustment_types:

  # 1. YIELD FACTORS (apply first)
  # Account for weight changes during preparation
  yield:
    definition: "Ratio of prepared weight to raw weight"
    examples:
      raw_to_grilled_chicken: 0.75  # 25% moisture loss
      raw_to_boiled_pasta: 2.4      # 140% water absorption
      raw_to_steamed_broccoli: 0.90 # 10% moisture loss
    nutrient_impact: "Concentrates or dilutes all nutrients"
    formula: "nutrient_per_100g_cooked = nutrient_per_100g_raw / yield_factor"

  # 2. RETENTION FACTORS (apply second)
  # Account for nutrient degradation/leaching
  retention:
    definition: "Fraction of nutrient remaining after preparation"
    examples:
      vitamin_c_boiled_10min: 0.70   # 30% destroyed
      vitamin_b1_grilled: 0.85       # 15% destroyed
      folate_steamed: 0.80           # 20% lost
    nutrient_impact: "Multiplicative reduction"
    formula: "nutrient_final = nutrient_raw × retention_factor"

  # 3. ADDITION FACTORS (apply third)
  # Account for ingredients added during cooking
  addition:
    definition: "Mass of cooking medium absorbed by food"
    examples:
      olive_oil_pan_frying: 8g per 100g food
      butter_sauteing: 5g per 100g food
      deep_fry_oil_battered: 15g per 100g food
      salt_finishing: 0.5-1.0g per 100g food
    nutrient_impact: "Add complete nutrient profile of medium"
    formula: "nutrient_final = nutrient_food + nutrient_medium × (medium_g / 100)"

  # 4. SUBTRACTION FACTORS (apply fourth)
  # Account for components removed/discarded
  subtraction:
    definition: "Mass or nutrients lost via discarding"
    examples:
      meat_rendering_fat_drained: 5-15g per 100g cooked
      deep_fry_oil_not_consumed: 50-70% of absorbed oil drains off
      boiling_water_discarded: 25-50% water-soluble vitamins
      skin_removed_poultry: fat content -40%
    nutrient_impact: "Subtract specific nutrient fractions"
    formula: "nutrient_final = nutrient_total - nutrient_discarded"
```

### 1.4 Reference State Decision Framework

**Question:** Should base nutrition be raw, cooked, or both?

**Answer:** **Depends on the ingredient category** (pragmatic approach)

```yaml
reference_state_rules:

  always_raw:
    categories: [fresh_produce, meats, poultry, fish, eggs]
    rationale: "USDA provides comprehensive raw data; users can choose prep"
    examples:
      - salmon_atlantic_farmed_150g_raw_v1
      - chicken_breast_skinless_150g_raw_v1
      - broccoli_florets_100g_raw_v1

  always_cooked:
    categories: [grains, legumes, pasta]
    rationale: "Never consumed raw; cooked is the reference state"
    examples:
      - white_rice_cooked_150g_v1  # NOT raw rice
      - chickpeas_boiled_100g_v1
      - pasta_penne_boiled_100g_v1

  vendor_prepared:
    categories: [restaurant_dishes, packaged_meals]
    rationale: "Preparation method fixed by vendor; store as-is"
    examples:
      - grilled_salmon_fillet_shk_v1  # Already grilled by SHK
      - beef_stroganoff_buckwheat_zima_v1  # Recipe-specific prep

  both_states:
    categories: [commonly_eaten_raw_or_cooked]
    rationale: "Create separate entries for each preparation"
    examples:
      - spinach_raw_100g_v1
      - spinach_steamed_100g_v1  # Different entry
      - carrot_raw_100g_v1
      - carrot_boiled_100g_v1
```

### 1.5 Schema Extensions (Backward Compatible)

```yaml
# MINIMAL ADDITIONS to existing schema:

# Current schema (unchanged):
id: grilled_salmon_fillet_shk_v1
category: main
portion:
  description: "grilled salmon fillet"
  est_weight_g: 150
assumptions:
  salt_scheme: normal
  oil_type: ""
  prep: ""  # Currently free-text, unused

# NEW: Enhanced prep field structure (optional, backward compatible)
preparation:
  # For Tier 1 (Simple Mode) - leave empty or null
  # For Tier 2 (Ingredient Mode) - populate
  base_ingredient_id: salmon_atlantic_farmed_raw_100g_base_v1
  base_weight_raw_g: 200  # 200g raw → 150g cooked (0.75 yield)
  method_id: grilled_light_oil
  method_details:
    temperature: 220C
    duration_min: 12
    oil_type: olive
    oil_amount_g: 5
  yield_factor: 0.75
  adjustments_applied:
    retention_factors:
      vitamin_c_mg: 0.75
      vitamin_b1_mg: 0.85
      vitamin_b6_mg: 0.90
    additions:
      - type: olive_oil
        amount_g: 5
        absorbed_pct: 100
      - type: salt
        amount_g: 0.75
  calculation_confidence: medium
  calculation_notes: "Retention factors from USDA Table of Nutrient Retention Factors Release 6"

# For Tier 3 (Recipe Mode) - complex dishes
recipe:
  components:
    - ingredient_id: egg_large_raw_50g_v1
      quantity: 2
      prep_method_id: poached
      base_weight_g: 100
      cooked_weight_g: 100
    - ingredient_id: sourdough_bread_slice_60g_v1
      quantity: 1
      prep_method_id: toasted_light
      base_weight_g: 60
      cooked_weight_g: 57
  cooking_additions:
    - butter: 22.2g (absorbed)
    - salt: 1.76g (finishing)
  total_weight_g: 352
  calculation_method: component_summation
  energy_validation:
    calculated: 597.4
    atwater_check: 597.4
    variance_pct: 0.0
```

---

## 2. Preparation Method Hierarchy & Grouping

### 2.1 Methods by Similarity (Shared Adjustment Factors)

```yaml
# Methods that can share similar adjustment profiles:

dry_heat_family:
  methods: [grilled, broiled, roasted, baked]
  shared_characteristics:
    moisture_loss: 15-30%
    fat_rendering: medium-high (for fatty foods)
    maillard_reaction: yes
    vitamin_c_loss: 15-30%
    b_vitamin_loss: 10-25%
  key_differences:
    grilled: higher temperature, shorter time, char risk
    broiled: heat from above, similar to grilled
    roasted: moderate temp, longer time, even cooking
    baked: enclosed heat, moisture retention better

pan_cooking_family:
  methods: [pan_fried, sauteed, stir_fried]
  shared_characteristics:
    oil_absorption: 5-15%
    moisture_loss: 10-20%
    high_heat: yes
    quick_cooking: yes
  key_differences:
    pan_fried: more oil, longer contact
    sauteed: less oil, frequent movement
    stir_fried: minimal oil, constant movement, very high heat

moist_heat_family:
  methods: [boiled, simmered, poached, steamed]
  shared_characteristics:
    moisture_change: minimal to slight increase
    water_soluble_vitamin_leaching: 10-50% (if liquid discarded)
    mineral_leaching: 5-30% (if liquid discarded)
    fat_loss: none
  key_differences:
    boiled: 100C, vigorous, highest leaching
    simmered: 85-95C, gentle, moderate leaching
    poached: 70-85C, very gentle, lowest leaching
    steamed: 100C, no liquid contact, minimal leaching

deep_cooking_family:
  methods: [deep_fried, tempura, battered_fried]
  shared_characteristics:
    oil_absorption: 8-25%
    moisture_loss: 30-40%
    crispy_exterior: yes
    vitamin_degradation: high (vitamin C: 40-60% loss)
  key_differences:
    deep_fried: standard coating
    tempura: light batter, less oil absorption
    battered_fried: thick batter, highest oil absorption
```

### 2.2 Three-Level Hierarchy

```yaml
preparation_hierarchy:

  level_1_super_categories:
    - thermal: "Heat-based cooking"
    - mechanical: "Physical transformation without heat"
    - preservation: "Long-term storage methods"
    - combination: "Multiple methods applied"

  level_2_method_families:
    thermal:
      - dry_heat: "No water/steam involved"
      - moist_heat: "Water/steam-based"
      - fat_heat: "Oil/fat as primary medium"
    mechanical:
      - cutting: "Size reduction"
      - mixing: "Combining ingredients"
      - extracting: "Separating components"

  level_3_specific_methods:
    dry_heat:
      - grilled: "Direct high heat, grill marks"
      - broiled: "Overhead high heat"
      - roasted: "Oven, dry heat, 180-220C"
      - baked: "Oven, enclosed, 160-200C"
      - toasted: "Dry heat, browning exterior"
    moist_heat:
      - boiled: "Submerged, 100C"
      - simmered: "Submerged, 85-95C"
      - poached: "Submerged, 70-85C"
      - steamed: "Steam heat, no liquid contact"
      - pressure_cooked: "High pressure, 115-121C"
    fat_heat:
      - pan_fried: "Shallow oil, medium heat"
      - deep_fried: "Submerged in oil, high heat"
      - sauteed: "Minimal oil, high heat, movement"
      - stir_fried: "Minimal oil, very high heat, constant movement"
```

---

## 3. Calculation Strategies & Order of Operations

### 3.1 Three Calculation Paths

```yaml
calculation_paths:

  path_1_simple_mode:
    use_case: "Restaurant dish, vendor-prepared, preparation fixed"
    approach: "Store final prepared nutrition directly"
    steps:
      1: "Research final prepared dish nutrition (Deliveroo, PDF, USDA)"
      2: "Populate all 52 nutrient fields in prepared state"
      3: "Document preparation in notes/assumptions"
      4: "Validate energy with Atwater formula"
    example: grilled_salmon_fillet_shk_v1
    complexity: LOW
    accuracy: MEDIUM-HIGH (depends on source quality)

  path_2_ingredient_mode:
    use_case: "Home cooking, user chooses preparation method"
    approach: "Store base ingredient + preparation profiles"
    steps:
      1: "Look up raw ingredient base nutrition (USDA)"
      2: "Apply yield factor for weight change"
      3: "Apply retention factors for nutrient degradation"
      4: "Add cooking medium nutrition (oil, butter, etc.)"
      5: "Subtract discarded components (if any)"
      6: "Validate energy with Atwater formula"
    example: chicken_breast_raw_150g → grilled_with_olive_oil
    complexity: MEDIUM
    accuracy: HIGH (transparent calculations)

  path_3_recipe_mode:
    use_case: "Complex multi-component dishes"
    approach: "Component summation with per-component preparation"
    steps:
      1: "Break dish into identifiable components"
      2: "For each component, apply Path 1 or Path 2"
      3: "Sum all component nutrients"
      4: "Add finishing ingredients (salt, garnishes)"
      5: "Validate energy with Atwater formula"
      6: "Compare to vendor data if available (±8% tolerance)"
    example: chilli_poached_eggs_leto_v1
    complexity: HIGH
    accuracy: VERY HIGH (granular tracking)
```

### 3.2 Order of Operations (Detailed)

```yaml
preparation_calculation_order:

  step_0_baseline:
    action: "Obtain raw nutrient values per 100g"
    source: "USDA FoodData Central, food bank base ingredient"
    output: "N₀ = {protein: 22.1g, fat: 13.4g, ...} per 100g raw"

  step_1_portion_scaling:
    action: "Scale to raw portion weight"
    formula: "N₁ = N₀ × (raw_weight_g / 100)"
    example: "Salmon 200g raw: protein = 22.1 × 2.0 = 44.2g"
    output: "Nutrients for raw portion"

  step_2_yield_adjustment:
    action: "Account for weight change during cooking"
    formula: "cooked_weight = raw_weight × yield_factor"
    example: "200g raw × 0.75 = 150g cooked"
    nutrient_concentration: "N₂ = N₁ / yield_factor"
    rationale: "Same nutrients in less mass → concentration"
    output: "Nutrients per cooked portion (before degradation)"

  step_3_retention_adjustment:
    action: "Apply nutrient-specific retention factors"
    formula: "N₃[nutrient] = N₂[nutrient] × retention[nutrient]"
    example: "Vitamin C: 15mg × 0.75 = 11.25mg after grilling"
    selective: "Only apply to heat-sensitive nutrients"
    stable_nutrients:
      - protein (denatured but mass conserved)
      - fat (unless rendered and drained)
      - minerals (concentrated unless leached)
    degradable_nutrients:
      - vitamin_c (15-60% loss depending on method)
      - vitamin_b1 (10-30% loss)
      - vitamin_b9 (20-40% loss)
    output: "Nutrients after cooking losses"

  step_4_addition_adjustment:
    action: "Add cooking medium absorbed"
    formula: "N₄ = N₃ + (N_medium × medium_weight_g / 100)"
    example: "5g olive oil adds: fat +5g, vitamin_e +0.7mg"
    components:
      oil_absorption: "Olive oil, butter, etc."
      finishing_salt: "0.5% of final weight default"
      marinades_absorbed: "Soy sauce, vinegar, etc."
    output: "Nutrients after additions"

  step_5_subtraction_adjustment:
    action: "Remove discarded components"
    formula: "N₅ = N₄ - N_discarded"
    examples:
      - "Deep fry oil drainage: Remove 60% of absorbed oil"
      - "Meat rendering: Subtract drained fat"
      - "Pasta water: Subtract leached starch (if measuring drained)"
    output: "Final prepared nutrients"

  step_6_energy_validation:
    action: "Verify with available-carb Atwater formula"
    formula: "E = 4×P + 9×F + 4×C_avail + 2×Fiber + 2.4×Polyols"
    tolerance: "±5-8% acceptable (measurement uncertainty)"
    if_outside_tolerance:
      - "Re-check raw values"
      - "Re-check yield factor"
      - "Re-check oil absorption"
      - "Document variance in notes if verified correct"
    output: "Validated energy_kcal"

  step_7_documentation:
    action: "Record all assumptions and confidence"
    required_fields:
      - preparation.method_id
      - preparation.yield_factor (source)
      - preparation.adjustments_applied (specific factors)
      - quality.confidence (HIGH/MEDIUM/LOW)
      - notes (calculation details)
    output: "Auditable preparation record"
```

### 3.3 Propagation Through Recipes

```yaml
recipe_propagation_logic:

  scenario: "Multi-ingredient dish with varied preparations"
  example: "Chicken stir-fry with vegetables"

  components:
    - ingredient: chicken_breast_raw
      weight_raw: 150g
      prep: diced_stir_fried
      calculations:
        yield_factor: 0.80 (20% moisture loss)
        oil_absorbed: 6g peanut oil
        retention:
          vitamin_b6: 0.85

    - ingredient: broccoli_raw
      weight_raw: 100g
      prep: cut_stir_fried
      calculations:
        yield_factor: 0.90 (10% moisture loss)
        oil_absorbed: 3g peanut oil
        retention:
          vitamin_c: 0.70 (30% loss from high heat)

    - ingredient: bell_pepper_raw
      weight_raw: 80g
      prep: sliced_stir_fried
      calculations:
        yield_factor: 0.85
        oil_absorbed: 3g peanut oil
        retention:
          vitamin_c: 0.75

    - ingredient: soy_sauce
      weight: 15g
      prep: none (added at end)
      calculations:
        no_adjustments: true

  aggregation_method:
    step_1: "Calculate each component independently"
    step_2: "Sum all nutrients across components"
    step_3: "Add shared cooking medium (oil already accounted per-component)"
    step_4: "Add finishing ingredients (salt, sesame oil, etc.)"
    step_5: "Validate total energy"

  final_output:
    total_weight_cooked: 315g
    energy_kcal: 387
    protein_g: 38.2
    vitamin_c_mg: 68  # Sum of degraded amounts from each vegetable
    confidence: medium
    notes: "Vitamin C retention varies by component surface area and heat exposure time. Using conservative 70-75% retention for all vegetables."
```

---

## 4. User Experience Considerations

### 4.1 When to Specify Preparation Method

```yaml
specification_triggers:

  always_required:
    - "Home cooking with raw ingredients"
    - "User explicitly asks to compare preparation methods"
    - "Logging for recipe development/optimization"
    example: "I'm grilling chicken tonight, how much protein?"

  optional_but_recommended:
    - "Generic ingredients consumed in typical preparation"
    - "Portion size varies significantly by preparation"
    example: "Ate some carrots" → prompt: "Raw or cooked?"

  never_required:
    - "Restaurant dishes (preparation is fixed)"
    - "Packaged prepared foods"
    - "Dishes already in food bank in prepared state"
    example: "Had the grilled salmon from SHK" → use existing entry
```

### 4.2 Defaults & Assumptions

```yaml
default_assumptions:

  when_unspecified:
    vegetables:
      preparation: raw
      rationale: "Most commonly consumed raw in UK (salads)"
      exceptions: [potatoes, beans, lentils] → assume cooked

    meats_poultry_fish:
      preparation: grilled_or_baked
      rationale: "Never consumed raw (UK context)"
      oil_amount: 5g per 100g (light coating)

    grains_pasta:
      preparation: boiled_plain
      rationale: "Standard preparation, no oil"

    eggs:
      preparation: hard_boiled
      rationale: "Most common for nutrition tracking"
      prompt_if_unclear: "Fried eggs absorbed significant oil - confirm preparation?"

  oil_absorption_defaults:
    grilled: 3-5g per 100g food
    baked: 2-4g per 100g food
    pan_fried: 8-12g per 100g food
    stir_fried: 6-10g per 100g food
    deep_fried: 15-25g per 100g food (post-draining)

  salt_defaults:
    light: 0.3% of total weight
    normal: 0.5% of total weight
    heavy: 0.8% of total weight
    unsalted: 0g
```

### 4.3 Complexity vs Accuracy Tradeoffs

```yaml
accuracy_tiers:

  tier_1_quick_logging:
    accuracy: ±15-20%
    effort: minimal
    method: "Use existing food bank entry or closest match"
    best_for: "Daily tracking, approximate calorie counting"
    example: "Grilled chicken breast → use grilled_chicken_breast_shk_v1"

  tier_2_standard_tracking:
    accuracy: ±8-12%
    effort: low-moderate
    method: "Raw ingredient + single preparation method"
    best_for: "Regular nutrition tracking, macro targets"
    example: "150g raw chicken → apply 'grilled_light_oil' profile"

  tier_3_precise_tracking:
    accuracy: ±5-8%
    effort: moderate
    method: "Component-based with documented adjustments"
    best_for: "Recipe development, competition prep, medical diets"
    example: "Chilli poached eggs: eggs + kale + bread + butter (all calculated)"

  tier_4_research_grade:
    accuracy: ±3-5%
    effort: high
    method: "Lab analysis or detailed ingredient weighing + verified factors"
    best_for: "Scientific research, clinical trials"
    example: "Weigh all components pre/post cooking, use published retention factors"

  recommendation:
    default: tier_2_standard_tracking
    upgrade_to_tier_3_when:
      - "Creating reusable recipes"
      - "Hitting specific micronutrient targets"
      - "Troubleshooting unexpected results"
    downgrade_to_tier_1_when:
      - "Traveling, limited data access"
      - "Social eating, unknown preparation"
      - "Tracking for trends only (not absolute values)"
```

### 4.4 Quick Logging vs Recipe Mode

```yaml
mode_comparison:

  quick_logging_mode:
    ui_flow:
      1: "Search existing food bank"
      2: "Select closest match"
      3: "Adjust portion if needed"
      4: "Log with timestamp"
    preparation_handling: "Implicit (embedded in dish name)"
    example_query: "Grilled salmon, 1 portion"
    time_cost: "15-30 seconds"
    use_case: "80% of daily logging"

  recipe_mode:
    ui_flow:
      1: "Create new recipe or modify existing"
      2: "Add components (search food bank for each)"
      3: "Specify preparation for each component"
      4: "Add cooking additions (oil, salt, etc.)"
      5: "Auto-calculate total nutrition"
      6: "Save as reusable recipe"
      7: "Log as single meal entry"
    preparation_handling: "Explicit per component"
    example_query: "Create recipe: Chicken stir-fry (chicken 150g grilled, broccoli 100g steamed, ...)"
    time_cost: "3-5 minutes (first time), 20 seconds (reuse)"
    use_case: "20% of logging (home-cooked meals, meal prep)"

  hybrid_approach:
    concept: "Quick log with optional refinement"
    ui_flow:
      1: "Quick log: 'Grilled chicken 150g' (uses default grilled profile)"
      2: "If needed, tap 'Refine' to adjust oil amount, temperature, etc."
      3: "Adjustments auto-recalculate nutrients"
    best_of_both: "Fast default, powerful when needed"
```

---

## 5. Practical Implementation

### 5.1 Required Data Tables

```yaml
# Five core data tables needed:

table_1_base_ingredients:
  purpose: "Raw food nutrition reference"
  schema: |
    id: salmon_atlantic_farmed_raw_100g_base_v1
    category: ingredient_base
    per_100g_raw:
      energy_kcal: 206
      protein_g: 22.1
      # ... all 52 nutrients
    source: USDA FoodData Central #175167
  size: "~500-1000 ingredients (core foods)"
  priority: "HIGH - foundation for calculations"

table_2_preparation_methods:
  purpose: "Cooking method definitions & effects"
  schema: |
    id: grilled_medium_heat
    category: dry_heat
    temperature_range: [200, 260]
    typical_duration_min: [10, 20]
    yield_factors:
      meat_poultry: 0.70-0.80
      fish: 0.75-0.85
      vegetables: 0.85-0.95
    oil_absorption_g_per_100g: 3-5
    retention_factors:
      protein_g: 1.00
      fat_g: 0.85 (if excess fat rendered & drained)
      vitamin_c_mg: 0.70-0.85
      vitamin_b1_mg: 0.85-0.90
      # ... other heat-sensitive nutrients
  size: "~30-50 method profiles"
  priority: "HIGH - enables Tier 2"

table_3_cooking_mediums:
  purpose: "Oils, fats, liquids added during cooking"
  schema: |
    id: olive_oil_extra_virgin
    per_100g:
      energy_kcal: 884
      fat_g: 100
      mufa_g: 73
      vitamin_e_mg: 14.4
      # ... all relevant nutrients
    typical_absorption_rates:
      grilling: 3-5g per 100g food
      pan_frying: 8-12g per 100g food
      deep_frying: 15-25g per 100g food (post-draining)
  size: "~20-30 common mediums"
  priority: "MEDIUM - enhances accuracy"

table_4_prepared_dishes:
  purpose: "Final consumed products (current food bank)"
  schema: "Existing 52-nutrient schema (unchanged)"
  size: "76 dishes (current), growing"
  priority: "EXISTING - maintain backward compatibility"

table_5_nutrient_retention_factors:
  purpose: "Lookup table for nutrient stability by method"
  schema: |
    nutrient: vitamin_c_mg
    preparation_methods:
      - method: boiled_10min
        retention: 0.60-0.75
        source: USDA Table of Nutrient Retention Factors Release 6
      - method: steamed_10min
        retention: 0.75-0.85
      - method: grilled
        retention: 0.70-0.80
      - method: raw
        retention: 1.00
    food_category_modifiers:
      cruciferous_vegetables: -0.05 (more sensitive)
      root_vegetables: +0.05 (more stable)
  size: "~15-20 key nutrients × ~30 methods = ~500 entries"
  priority: "MEDIUM - improves Tier 2/3 accuracy"
  source: "USDA Retention Factors Release 6, scientific literature"
```

### 5.2 What Can Be Automated vs Needs User Input

```yaml
automated_calculations:

  fully_automated:
    - "Energy calculation from macros (Atwater formula)"
    - "Carb relationship validation (total = available + fiber + polyols)"
    - "Fat split summation check (sat + MUFA + PUFA ≤ total)"
    - "Nutrient concentration from yield factor"
    - "Cooking medium nutrient addition"
    - "Recipe component summation"
    - "Confidence scoring based on data source quality"

  semi_automated_with_defaults:
    - "Oil absorption (suggest defaults, user can override)"
    - "Salt addition (suggest 0.5%, user can override)"
    - "Yield factor (suggest from table, user can override)"
    - "Retention factors (suggest from table, user can override)"

  requires_user_input:
    - "Which preparation method was used"
    - "Portion size consumed (raw or cooked weight)"
    - "Whether cooking liquid/fat was consumed or discarded"
    - "Any custom ingredients not in database"
    - "Confidence in portion size estimate"

  AI_assisted_estimation:
    - "Portion weight from photo analysis"
    - "Ingredient list from dish name/description"
    - "Likely preparation method from venue type"
    - "Component breakdown for complex dishes"
    - "Missing nutrient estimation from similar foods"
```

### 5.3 Edge Cases & Error Handling

```yaml
edge_case_handling:

  case_1_unknown_preparation:
    scenario: "User logs 'chicken' without specifying method"
    handling:
      1: "Prompt: 'How was it prepared?' (grilled/baked/fried/other)"
      2: "If no response, default to 'grilled' with medium confidence"
      3: "Flag entry as 'prep_assumed' for review"
    rationale: "Grilled is most common for chicken in tracked context"

  case_2_partial_oil_consumption:
    scenario: "Deep fried food, user ate some but oil drained off"
    handling:
      1: "Calculate oil absorption during frying (15-25g per 100g)"
      2: "Apply drainage factor: 40-60% consumed (default 50%)"
      3: "Document assumption: 'Assumes 50% of absorbed oil drained'"
      4: "Mark confidence: LOW"
    rationale: "Impossible to measure precisely; use conservative estimate"

  case_3_mixed_cooking_methods:
    scenario: "Chicken breast: boiled then pan-fried"
    handling:
      1: "Apply methods sequentially in order"
      2: "Boiled: yield 0.85, water-soluble vitamin leaching 30%"
      3: "Pan-fried: yield 0.95 (already cooked), oil absorption +8g"
      4: "Final yield: 0.85 × 0.95 = 0.81"
      5: "Document: 'Sequential prep: boiled (10min) → pan-fried (5min)'"
    rationale: "Order matters; each method transforms previous state"

  case_4_cooking_liquid_consumed:
    scenario: "Soup/stew where boiling water is part of dish"
    handling:
      1: "DO NOT apply leaching loss factors"
      2: "Nutrients leached into liquid remain in final dish"
      3: "Apply only heat degradation retention factors"
      4: "Add any evaporated water concentration effect"
    rationale: "Leaching is transfer, not loss (if liquid consumed)"

  case_5_nutrient_data_unavailable:
    scenario: "Base ingredient lacks data for new schema nutrients"
    handling:
      1: "Check USDA for missing nutrients"
      2: "If unavailable, use proxy from similar food"
      3: "Document proxy: 'Vitamin B6 estimated from similar fish'"
      4: "Mark confidence: LOW for that nutrient"
      5: "Set to 0 only if scientifically impossible (e.g., B12 in plants)"
    rationale: "Maintains 'no nulls' policy with documented estimates"

  case_6_yield_factor_exceeds_bounds:
    scenario: "Calculated yield >1.0 for dry cooking method"
    handling:
      1: "Flag error: 'Yield factor >1.0 invalid for grilling'"
      2: "Suggest: Check raw weight vs cooked weight"
      3: "If user confirms, override with note: 'User verified weight gain (unlikely)'"
    rationale: "Dry heat cannot add mass; likely measurement error"

  case_7_energy_validation_fails:
    scenario: "Atwater calculation differs from source by >15%"
    handling:
      1: "Flag warning: 'Energy mismatch: calculated 350 vs source 420'"
      2: "Prompt: 'Re-check macros? Likely errors: carbs, fiber, polyols'"
      3: "If user confirms macros correct, document variance"
      4: "Store calculated energy per policy (prioritize Atwater)"
    rationale: "Source data may use simplified 4-4-9 formula"
```

---

## 6. Concrete Examples

### Example 1: Simple Grilled Chicken (Tier 2)

```yaml
# USER INPUT:
query: "I grilled 150g raw chicken breast with olive oil, how much protein?"

# SYSTEM FLOW:
step_1_lookup_base:
  ingredient: chicken_breast_skinless_boneless_raw_100g_base_v1
  raw_nutrition_per_100g:
    energy_kcal: 120
    protein_g: 22.5
    fat_g: 2.6
    # ... 49 more nutrients

step_2_select_prep_profile:
  method: grilled_medium_heat
  yield_factor: 0.75 (25% moisture loss)
  oil_absorption: 5g per 100g food
  retention_factors:
    protein_g: 1.00
    fat_g: 1.00 (chicken is lean, minimal rendering)
    vitamin_b6_mg: 0.85

step_3_calculate:
  raw_weight: 150g
  cooked_weight: 150 × 0.75 = 112.5g

  # Protein (concentrated by moisture loss):
  protein_raw: 22.5g/100g × 150g = 33.75g
  protein_cooked_concentrated: 33.75g / 0.75 = 45g per 112.5g cooked
  protein_after_retention: 45g × 1.00 = 45g (stable)

  # Fat (from chicken + added oil):
  fat_chicken_raw: 2.6g/100g × 150g = 3.9g
  fat_chicken_cooked: 3.9g / 0.75 = 5.2g
  fat_oil_added: 5g/100g × 112.5g cooked = 5.6g
  fat_total: 5.2 + 5.6 = 10.8g

  # Energy:
  energy_chicken: 120 × 1.5 / 0.75 = 240 kcal
  energy_oil: 5.6g × 8.84 kcal/g = 49.5 kcal
  energy_total: 289.5 kcal

step_4_response:
  answer: "45g protein, 290 kcal total"
  confidence: HIGH
  assumptions: "25% moisture loss (standard), 5g olive oil absorbed per 100g cooked weight"
  suggestion: "Would you like to save this as 'Grilled Chicken Breast 150g' for quick reuse?"
```

### Example 2: Complex Recipe - Chicken Stir-Fry (Tier 3)

```yaml
# USER INPUT:
query: "I made chicken stir-fry: 150g chicken, 100g broccoli, 80g peppers, 2 tbsp peanut oil, soy sauce"

# SYSTEM FLOW:
step_1_component_breakdown:
  components:
    - chicken_breast_raw: 150g → diced, stir-fried
    - broccoli_florets_raw: 100g → chopped, stir-fried
    - bell_pepper_red_raw: 80g → sliced, stir-fried
    - peanut_oil: 28g (2 tbsp)
    - soy_sauce: 15g (1 tbsp)

step_2_calculate_each_component:

  chicken:
    raw: 150g
    yield: 0.80 (20% moisture loss, high heat)
    cooked: 120g
    oil_absorbed: 6g (5g/100g × 120g)
    protein: 22.5g/100g × 150g / 0.80 = 42.2g
    fat: (2.6g/100g × 150g / 0.80) + 6g oil = 10.9g
    energy: (120 kcal/100g × 150g / 0.80) + (6g × 8.84) = 225 + 53 = 278 kcal

  broccoli:
    raw: 100g
    yield: 0.90 (10% moisture loss)
    cooked: 90g
    oil_absorbed: 3g
    protein: 2.8g/100g × 100g / 0.90 = 3.1g
    carbs_avail: 4.0g/100g × 100g / 0.90 = 4.4g
    vitamin_c: 89mg/100g × 100g / 0.90 × 0.70 (30% degraded) = 69mg
    energy: (34 kcal/100g × 100g / 0.90) + (3g × 8.84) = 38 + 27 = 65 kcal

  bell_pepper:
    raw: 80g
    yield: 0.85
    cooked: 68g
    oil_absorbed: 2.5g
    protein: 1.0g/100g × 80g / 0.85 = 0.94g
    vitamin_c: 128mg/100g × 80g / 0.85 × 0.75 = 90mg
    energy: (31 kcal/100g × 80g / 0.85) + (2.5g × 8.84) = 29 + 22 = 51 kcal

  peanut_oil_remaining:
    total: 28g
    absorbed_in_food: 6 + 3 + 2.5 = 11.5g
    remaining_in_wok: 28 - 11.5 = 16.5g (not consumed)
    calories_consumed_from_oil: 11.5g × 8.84 = 102 kcal (already in components)

  soy_sauce:
    weight: 15g
    protein: 1.3g
    sodium: 900mg
    energy: 8 kcal

step_3_aggregate:
  total_weight_cooked: 120 + 90 + 68 + 15 = 293g
  total_energy: 278 + 65 + 51 + 8 = 402 kcal
  total_protein: 42.2 + 3.1 + 0.94 + 1.3 = 47.5g
  total_fat: 10.9 + 3 + 2.5 + 0 = 16.4g
  total_carbs_avail: 0 + 4.4 + 5.1 + 1.0 = 10.5g
  total_vitamin_c: 0 + 69 + 90 + 0 = 159mg
  total_sodium: (chicken 90mg) + (broccoli 30mg) + (pepper 3mg) + (soy 900mg) = 1023mg

step_4_validate:
  atwater_check: 4×47.5 + 9×16.4 + 4×10.5 + 2×4.2 = 190 + 148 + 42 + 8 = 388 kcal
  calculated: 402 kcal
  variance: (402-388)/402 = 3.5% ✓ VALID
  note: "Slight variance from rounding and vitamin C energy contribution"

step_5_save_recipe:
  offer: "Save as reusable recipe 'Chicken Stir-Fry (homemade)' for future quick logging?"
  if_yes:
    create: chicken_stir_fry_homemade_v1
    allows_scaling: true (user can log 0.5 portion, 1.5 portions, etc.)
```

### Example 3: Edge Case - Deep Fried Fish with Partial Oil Drainage (Tier 3)

```yaml
# USER INPUT:
query: "Battered fish from fish & chips shop, ~200g portion, crispy"

# SYSTEM CHALLENGES:
unknown_variables:
  - Raw fish weight before battering
  - Batter thickness & composition
  - Oil type used
  - How much oil drained vs consumed
  - Exact frying time/temperature

# SYSTEM APPROACH (Component Estimation):
step_1_assumptions:
  fish_type: cod (UK fish & chips standard)
  raw_fish_weight: 140g (reverse calculate from typical 200g final)
  batter_weight_raw: 40g (flour-based, ~25% of final weight)
  yield_fish: 0.85 (15% moisture loss)
  yield_batter: 1.20 (absorbs oil)
  oil_type: vegetable_oil_generic
  oil_absorption_gross: 20g (15% of final weight)
  oil_drainage: 40% (drained to paper, but significant remains)
  oil_consumed: 12g (60% of absorbed)

step_2_calculate_fish_component:
  cod_raw: 140g
  cod_cooked: 140g × 0.85 = 119g
  protein: 18.0g/100g × 140g / 0.85 = 29.6g
  fat_intrinsic: 0.7g/100g × 140g / 0.85 = 1.15g
  energy_fish_alone: 82 kcal/100g × 140g / 0.85 = 135 kcal

step_3_calculate_batter_component:
  batter_dry: 40g (flour, egg, milk, baking powder)
  batter_after_frying: 40g × 1.20 = 48g (absorbed oil)
  protein_batter: 4g
  carbs_batter: 28g
  energy_batter_base: 130 kcal

step_4_calculate_oil_component:
  oil_consumed: 12g
  energy_oil: 12g × 8.84 = 106 kcal
  fat_oil: 12g

step_5_aggregate:
  total_weight: 119 + 48 = 167g (measured 200g includes some oil on surface)
  energy_total: 135 + 130 + 106 = 371 kcal
  protein_total: 29.6 + 4 = 33.6g
  fat_total: 1.15 + 12 = 13.2g
  carbs_total: 0 + 28 = 28g

step_6_confidence_assessment:
  confidence: LOW
  reasons:
    - "Fish species assumed (cod typical but unknown)"
    - "Batter composition estimated (standard UK recipe)"
    - "Oil drainage highly variable (40% drainage is mid-range estimate)"
    - "Final weight includes oil film on surface (hard to measure)"

  variance_range:
    energy: 330-420 kcal (±15%)
    protein: 30-36g (±10%)
    fat: 10-18g (±30% - most uncertain)

  documentation:
    notes: "Deep fried battered fish: assumed cod, standard batter, 40% oil drainage (conservative). High uncertainty due to variable oil consumption. Energy could range 330-420 kcal."
    assumptions: "cod_raw: 140g, batter: 40g, oil absorbed: 20g gross (12g consumed, 8g drained)"
    quality.confidence: LOW
    quality.gaps: ["exact fish species", "batter recipe", "oil drainage %"]

step_7_recommendation:
  suggest_to_user: "For more accuracy, consider takeaway dishes with published nutrition data, or home-cooked alternatives with controlled oil."
```

### Example 4: Boiled Pasta with Discarded Water (Tier 2)

```yaml
# USER INPUT:
query: "100g dry pasta, boiled and drained"

# KEY QUESTION: Water discarded or consumed?
answer: "Discarded (standard for pasta)"

# SYSTEM FLOW:
step_1_base_nutrition:
  pasta_penne_dry_per_100g:
    energy_kcal: 371
    protein_g: 13.0
    carbs_total_g: 75.0
    carbs_available_g: 68.5
    fiber_g: 3.0

step_2_preparation_profile:
  method: boiled_drained
  water_temperature: 100C
  duration: 10-12min

  yield_factor: 2.4 (pasta absorbs 140% its weight in water)
  # 100g dry → 240g cooked

  nutrient_leaching:
    carbs_available: 0.95 (5% starch leached to water, discarded)
    b_vitamins: 0.80 (20% leached to water, discarded)
    minerals: 0.90 (10% leached to water, discarded)
    protein: 1.00 (not leached)
    fiber: 1.00 (not leached)

  nutrient_degradation:
    vitamin_b1: 0.90 (10% heat degradation on top of leaching)
    folate: 0.85 (15% heat degradation)

step_3_calculate:
  # Weight increase (water absorption):
  cooked_weight: 100g × 2.4 = 240g

  # Carbs (leached):
  carbs_avail_start: 68.5g
  carbs_avail_after_leaching: 68.5g × 0.95 = 65.1g
  carbs_avail_per_100g_cooked: 65.1g / 240g × 100g = 27.1g per 100g cooked

  # Protein (not leached, but diluted):
  protein_start: 13.0g
  protein_per_100g_cooked: 13.0g / 240g × 100g = 5.4g per 100g cooked

  # Energy (adjusted for carb loss):
  energy_lost_to_leaching: 68.5g - 65.1g = 3.4g carbs × 4 kcal = 13.6 kcal
  energy_cooked_total: 371 - 13.6 = 357.4 kcal for 240g cooked
  energy_per_100g_cooked: 357.4 / 240 × 100 = 149 kcal per 100g cooked

step_4_validate:
  atwater_check: 4×5.4 + 9×1.5 + 4×27.1 + 2×1.25 = 21.6 + 13.5 + 108.4 + 2.5 = 146 kcal
  calculated: 149 kcal
  variance: 2% ✓ VALID

step_5_key_insight:
  observation: "Pasta gains weight (water) but loses small amount of carbs to water"
  net_effect: "Dilution is primary effect (371→149 kcal per 100g)"
  user_implication: "Log by cooked weight (240g cooked) or dry weight (100g dry), NOT both!"
```

---

## 7. Power User Features for Complex Cases

### 7.1 Custom Retention Factor Override

```yaml
feature: manual_retention_override
use_case: "User has specific knowledge of cooking conditions"

example_scenario:
  user_input: "I sous vide salmon at 52C for 45min (very gentle)"
  default_profile: grilled (retention_vitamin_b6: 0.85)
  user_override:
    reason: "Sous vide is gentler than grilling, better retention"
    custom_retention_vitamin_b6: 0.95
    source: "Literature: sous vide 52C retains 95% B6 vs 85% grilling"
    confidence: HIGH

  system_response:
    apply_override: true
    document: "Custom retention factor applied: vitamin B6 0.95 (sous vide 52C, user research)"
    allow_save_as_custom_profile: true
    offer_share_to_community: "Share 'sous_vide_52C' profile with other users?"
```

### 7.2 Multi-Stage Preparation

```yaml
feature: sequential_preparation_tracking
use_case: "Food undergoes multiple cooking methods"

example_scenario:
  dish: "Chicken breast: boiled then shredded then pan-fried"

  stage_1_boiling:
    raw_weight: 150g
    method: boiled_15min
    yield: 0.85 (15% moisture to broth)
    cooked_weight: 127.5g
    leaching:
      b_vitamins: 0.80 (20% to broth, assume broth discarded)
      minerals: 0.85

  stage_2_shredding:
    mechanical_only: true
    no_nutrient_impact: true
    weight: 127.5g (unchanged)

  stage_3_pan_frying:
    starting_weight: 127.5g (already cooked)
    method: pan_fried_high_heat
    yield: 0.95 (5% additional moisture loss)
    final_weight: 121g
    oil_absorption: 10g
    retention:
      vitamin_b6: 0.90 (additional 10% loss from high heat)

  final_calculation:
    combined_yield: 0.85 × 1.0 × 0.95 = 0.81
    final_weight: 150g × 0.81 = 121g (matches!)
    vitamin_b6_retention: 0.80 × 1.0 × 0.90 = 0.72 (72% of raw)
    fat_total: (chicken intrinsic / 0.81) + 10g oil = 4.8 + 10 = 14.8g

  documentation:
    preparation.method_sequence:
      - boiled_15min (yield 0.85, broth discarded)
      - mechanical_shred (no impact)
      - pan_fried_high_heat (yield 0.95, oil +10g)
    notes: "Multi-stage prep: boil→shred→fry. Cumulative yield 0.81."
```

### 7.3 Ingredient Substitution Impact Analysis

```yaml
feature: substitution_comparison
use_case: "User wants to compare nutrition impact of ingredient swaps"

example_scenario:
  base_recipe: "Chicken stir-fry with peanut oil"
  substitution_query: "What if I use olive oil instead of peanut oil?"

  original:
    oil: peanut_oil
    amount: 15g
    fat_profile:
      sat: 2.3g
      mufa: 6.2g
      pufa: 4.3g
      omega6_la: 4.1g
    vitamin_e: 2.1mg

  substituted:
    oil: olive_oil_extra_virgin
    amount: 15g
    fat_profile:
      sat: 2.0g
      mufa: 11.0g
      pufa: 1.6g
      omega6_la: 1.4g
    vitamin_e: 2.2mg

  delta_analysis:
    mufa_change: +4.8g (better for heart health)
    pufa_change: -2.7g
    omega6_change: -2.7g (lower omega-6, better omega-3:6 ratio)
    vitamin_e_change: +0.1mg (negligible)
    energy_change: 0 kcal (both pure fats)

  recommendation:
    health_impact: "Positive - higher MUFA, lower omega-6"
    taste_impact: "Different flavor profile (mild vs nutty)"
    cooking_performance: "Both suitable for stir-frying (high smoke point)"
    suggest: "Olive oil substitution improves fatty acid profile without affecting calories"
```

---

## 8. Schema Extension Proposal

### 8.1 Backward-Compatible Additions

```yaml
# Extend existing schema with optional preparation block:

preparation:  # OPTIONAL - only populate for Tier 2/3

  # Tier 2: Single-method preparation
  mode: ingredient_mode  # simple_mode | ingredient_mode | recipe_mode
  base_ingredient_id: salmon_atlantic_farmed_raw_100g_base_v1
  base_weight_raw_g: 200
  method_id: grilled_medium_heat
  method_details:
    temperature_c: 220
    duration_min: 12
    oil_type: olive_extra_virgin
    oil_amount_g: 5
    salt_amount_g: 0.75

  # Calculation metadata:
  yield_factor: 0.75
  cooked_weight_g: 150

  adjustments_applied:
    retention_factors:
      vitamin_c_mg: 0.75
      vitamin_b1_mg: 0.85
      vitamin_b6_mg: 0.90
      folate_ug: 0.80
    additions:
      - ingredient: olive_oil_extra_virgin
        amount_g: 5
        disposition: absorbed
      - ingredient: salt
        amount_g: 0.75
        disposition: added
    subtractions: []  # None for grilled fish

  calculation_confidence: medium
  calculation_method: "USDA base + yield factor + retention table + oil addition"
  calculation_notes: "Retention factors from USDA Table Release 6"

  # Tier 3: Recipe mode
recipe:  # ALTERNATIVE to preparation (mutually exclusive)
  mode: recipe_mode
  components:
    - ingredient_id: egg_large_raw_50g_v1
      quantity: 2
      base_weight_g: 100
      prep_method_id: poached
      cooked_weight_g: 100
      notes: "Eggs don't lose weight when poached"

    - ingredient_id: kale_curly_raw_100g_v1
      quantity: 50
      base_weight_g: 50
      prep_method_id: sauteed_butter
      cooked_weight_g: 45
      notes: "Slight moisture loss"

    - ingredient_id: sourdough_bread_slice_60g_v1
      quantity: 1
      base_weight_g: 60
      prep_method_id: toasted_light
      cooked_weight_g: 57
      notes: "Slight moisture loss from toasting"

  cooking_additions:
    - ingredient: butter_unsalted
      amount_g: 22.2
      disposition: absorbed
      used_for: sauteing_kale

    - ingredient: salt
      amount_g: 1.76
      disposition: finishing
      calculation: "0.5% of total weight (352g)"

  total_weight_raw_g: 232.2
  total_weight_cooked_g: 352
  calculation_method: component_summation

  energy_validation:
    calculated_kcal: 597.4
    atwater_check_kcal: 597.4
    source_label_kcal: null  # No vendor label (homemade)
    variance_pct: 0.0

  recipe_confidence: high
  recipe_notes: "All components weighed; butter amount calculated to close calorie gap"

# Validation rules:
validation:
  mutual_exclusivity:
    rule: "preparation XOR recipe (not both)"
    error: "Dish cannot have both 'preparation' and 'recipe' blocks"

  simple_mode_validation:
    rule: "If mode=simple_mode, preparation and recipe must be null"
    rationale: "Simple mode stores final nutrition directly"

  backward_compatibility:
    rule: "preparation and recipe blocks are optional"
    rationale: "Existing 76 dishes don't have these blocks and remain valid"
```

---

## 9. Recommended Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

```yaml
deliverables:
  1: "Design documentation (this document)"
  2: "Schema v3 proposal with preparation/recipe blocks"
  3: "Base ingredient table (50 core foods: chicken, salmon, broccoli, etc.)"
  4: "Preparation method table (10 core methods: grilled, boiled, steamed, etc.)"
  5: "Cooking medium table (10 items: olive oil, butter, salt, etc.)"

validation:
  - "No breaking changes to existing schema"
  - "All 76 existing dishes still validate"
  - "New blocks are optional and well-documented"

user_impact:
  - "None (no UI changes yet)"
```

### Phase 2: Tier 2 Implementation (Weeks 3-4)

```yaml
deliverables:
  1: "Preparation calculation engine"
  2: "Yield factor application logic"
  3: "Retention factor lookup system"
  4: "Oil/salt addition automation"
  5: "Unit tests for calculation accuracy"

validation:
  - "Grilled chicken calculation matches expected values (±5%)"
  - "Boiled pasta yield factor correct (2.4x)"
  - "Deep fried oil absorption calculation reasonable"

user_impact:
  - "Backend only (no UI changes)"
  - "Preparation testing via API/CLI"
```

### Phase 3: UI Integration (Weeks 5-6)

```yaml
deliverables:
  1: "Quick log flow (Tier 1 - unchanged)"
  2: "Ingredient prep selector UI (Tier 2)"
  3: "Preparation method dropdown with common methods"
  4: "Auto-calculation display with breakdown"
  5: "Save custom preparation profiles"

validation:
  - "User can log 'chicken grilled' in <30 seconds"
  - "Nutrition auto-calculates and displays"
  - "User can override defaults (oil amount, etc.)"

user_impact:
  - "New prep selection UI for home cooking"
  - "Faster logging (saved profiles)"
```

### Phase 4: Tier 3 Recipe Mode (Weeks 7-8)

```yaml
deliverables:
  1: "Recipe builder UI"
  2: "Multi-component ingredient selection"
  3: "Per-component preparation assignment"
  4: "Automatic summation and validation"
  5: "Recipe saving and reuse"

validation:
  - "Chilli poached eggs recipe calculates to 597 kcal (matches existing)"
  - "Recipe can be logged as single meal entry"
  - "Recipe portion scaling works (0.5x, 1.5x, etc.)"

user_impact:
  - "Recipe mode for home-cooked meals"
  - "Reusable recipes for meal prep"
```

### Phase 5: Power Features (Weeks 9-10)

```yaml
deliverables:
  1: "Custom retention factor override"
  2: "Multi-stage preparation tracking"
  3: "Ingredient substitution analysis"
  4: "Photo-based portion estimation (AI)"
  5: "Community recipe sharing"

validation:
  - "Sous vide custom profile saves correctly"
  - "Sequential prep (boil→fry) calculates correctly"
  - "Oil substitution shows delta analysis"

user_impact:
  - "Power users can fine-tune calculations"
  - "Recipe sharing community"
```

---

## 10. Success Metrics

### Accuracy Metrics

```yaml
tier_1_simple_mode:
  target_accuracy: ±15%
  measurement: "Compare logged meals to vendor nutrition labels"
  threshold: "80% of entries within ±15%"

tier_2_ingredient_mode:
  target_accuracy: ±8%
  measurement: "Compare calculated nutrition to USDA cooked values"
  threshold: "85% of entries within ±8%"

tier_3_recipe_mode:
  target_accuracy: ±5%
  measurement: "Compare component summation to vendor labels (when available)"
  threshold: "90% of recipes within ±5%"

energy_validation:
  atwater_formula_match: "95% of entries within ±5-8% of Atwater calculation"
  macros_consistency: "99% of entries pass fat split validation (sat+MUFA+PUFA≤total)"
```

### Usability Metrics

```yaml
logging_speed:
  tier_1_quick_log: "<30 seconds per entry"
  tier_2_prep_log: "<60 seconds per entry (first time), <20 seconds (reuse)"
  tier_3_recipe_creation: "<5 minutes per recipe (first time), <30 seconds (reuse)"

user_satisfaction:
  confidence_in_data: "80% of users rate confidence as 'good' or 'excellent'"
  ease_of_use: "75% of users find prep selection 'easy' or 'very easy'"
  feature_adoption: "40% of users try Tier 2, 15% try Tier 3 within first month"

data_quality:
  prep_documentation: "90% of Tier 2/3 entries have documented prep method"
  confidence_tagging: "85% of entries have confidence level set"
  source_citation: "80% of custom calculations cite retention factor source"
```

### System Health Metrics

```yaml
performance:
  calculation_latency: "<100ms for Tier 2, <500ms for Tier 3"
  database_growth: "<10MB per 1000 prep profiles"
  backward_compatibility: "100% of existing 76 dishes remain valid"

maintenance:
  retention_factor_updates: "Quarterly review of USDA retention tables"
  method_profile_expansion: "Add 5-10 new methods per quarter based on user requests"
  edge_case_handling: "<5% of calculations require manual intervention"
```

---

## 11. Conclusion

### Minimal Core Concepts (80/20 Rule)

**Three concepts handle 80% of cases:**

1. **Final Dish** (Tier 1): Store prepared nutrition directly → handles restaurant/packaged foods
2. **Base + Method** (Tier 2): Raw ingredient + preparation profile → handles home cooking
3. **Recipe Components** (Tier 3): Multi-ingredient summation → handles complex dishes

**Four adjustment types handle 95% of calculations:**

1. **Yield factor**: Weight change (concentration/dilution)
2. **Retention factors**: Nutrient degradation
3. **Addition factors**: Cooking medium absorbed
4. **Subtraction factors**: Components discarded

### Elegant System Properties

```yaml
elegance_principles:

  backward_compatible:
    - "All 76 existing dishes remain valid"
    - "No breaking schema changes"
    - "New fields are optional"

  progressive_enhancement:
    - "Simple by default (Tier 1)"
    - "Powerful when needed (Tier 2/3)"
    - "User chooses complexity level"

  explicit_over_implicit:
    - "All calculations documented"
    - "Assumptions stated clearly"
    - "Confidence levels assigned"

  auditable:
    - "Complete calculation trail"
    - "Source citations for retention factors"
    - "Version control for prep profiles"

  extensible:
    - "Easy to add new prep methods"
    - "Custom profiles supported"
    - "Power user overrides available"

  intuitive:
    - "Natural language prep descriptions"
    - "Sensible defaults (grilled chicken)"
    - "Auto-calculation with manual override option"
```

### Making It Intuitive (UX Principles)

1. **Smart Defaults**: "Chicken" → assume grilled (most common in tracked context)
2. **Contextual Prompts**: If user logs "fried chicken", auto-suggest oil amount
3. **Visual Feedback**: Show calculation breakdown ("25% moisture loss, +5g oil = 260 kcal")
4. **Learn from User**: If user always grills with 8g oil, remember this preference
5. **Confidence Transparency**: Always show confidence level (HIGH/MEDIUM/LOW)
6. **Graceful Degradation**: Missing retention factors? Fall back to category average and note it

### Final Recommendation

**Implement incrementally:**

- **Month 1**: Foundation + Tier 2 backend (no UI disruption)
- **Month 2**: Tier 2 UI + user testing
- **Month 3**: Tier 3 recipe mode + power features
- **Month 4+**: Refinement based on real usage patterns

**Prioritize:**

1. Accuracy for Tier 1 (current use case - 70% of logs)
2. Convenience for Tier 2 (home cooking - 25% of logs)
3. Power for Tier 3 (complex cases - 5% of logs)

**Success looks like:**

- Thomas can log restaurant meals as before (no change, Tier 1)
- Thomas can quickly log "grilled chicken 150g" at home (new, Tier 2, <30 sec)
- Thomas can build reusable recipes for meal prep (new, Tier 3, <5 min once)
- All nutrition data is traceable, auditable, and confidence-rated
- System is extensible for future prep methods without schema changes

---

**End of Design Document**
