## Basque Cheesecake (Maison Estelle)

```yaml
id: basque_cheesecake_maison-estelle_v1
version: 1
last_verified: 2025-11-15
source:
  venue: Maison Estelle - Basque Restaurant
  menu_page: "https://maisonestelle.com/"
  evidence:
    - "Recipe research: La Viña original Basque cheesecake recipe (San Sebastian) - 1kg cream cheese, 350-400g sugar, 480-500ml heavy cream, 5-7 eggs, 30-35g flour"
    - "Source: Spanish Sabores (https://spanishsabores.com/burnt-basque-cheesecake-recipe/), America's Test Kitchen La Viña recipe, Food52 La Viña recipe"
    - "Portion sizing: Whole cake 2000g yields 12-14 slices → 143-167g per slice. Upscale restaurant estimate: 145g"
    - "Source: Various bakery portion data, restaurant nutrition info showing 100-125g standard servings"
    - "Nutrition calculations: USDA FoodData Central per-ingredient profiles"
    - "Cream cheese: FDC 173418 (350 kcal, 34g fat, 6.15g protein per 100g)"
    - "Heavy cream: FDC 170859 (340 kcal, 36g fat, 3g protein per 100g)"
    - "Whole eggs: FDC 171287 (143 kcal, 12.6g protein, 9.5g fat per 100g)"
    - "All-purpose flour enriched: FDC 168936 (364 kcal, 10.3g protein per 100g)"
    - "UK dairy iodine: BDA guidance - UK milk/dairy 2-3× higher than EU (30-50 µg/100g dairy)"
    - "B-vitamin profiles: USDA FoodData Central complete nutrient profiles for cream cheese, eggs, enriched flour"
    - "Micronutrient validation: MyFoodData.com nutrition facts tools, NutritionValue.org USDA-referenced data"
aliases: []
category: dessert
portion:
  description: "1 full slice as served"
  est_weight_g: 145
  notes: "Typical upscale restaurant portion. Basque cheesecake has no crust - burnt top with creamy center."
assumptions:
  salt_scheme: "unsalted"
  oil_type: ""
  prep: "Traditional La Viña style: high heat bake (200°C) creates characteristic burnt top. Minimal flour (just for binding)."
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 525
  protein_g: 8.5
  fat_g: 39.8
  sat_fat_g: 23.5
  mufa_g: 10.6
  pufa_g: 1.8
  trans_fat_g: 0
  cholesterol_mg: 201
  # Carbohydrates
  carbs_total_g: 34.3
  carbs_available_g: 34.2
  sugar_g: 31.3
  fiber_total_g: 0.1
  fiber_soluble_g: 0
  fiber_insoluble_g: 0.1
  polyols_g: 0.0
  # Minerals
  sodium_mg: 273
  potassium_mg: 164
  iodine_ug: 40
  magnesium_mg: 11
  calcium_mg: 106
  iron_mg: 0.8
  zinc_mg: 0.8
  vitamin_c_mg: 0.4
  manganese_mg: 0.02
  copper_mg: 0.04
  selenium_ug: 11
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 144
  chloride_mg: 420
  sulfur_g: 0.09
  # Vitamins
  vitamin_a_ug: 416
  vitamin_d_ug: 1.2
  vitamin_e_mg: 0.8
  vitamin_k_ug: 2.7
  vitamin_b1_mg: 0.06
  vitamin_b2_mg: 0.34
  vitamin_b3_mg: 0.3
  vitamin_b5_mg: 1.0
  vitamin_b6_mg: 0.08
  vitamin_b7_ug: 6
  vitamin_b9_ug: 26
  vitamin_b12_ug: 0.6
  choline_mg: 82
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.20
  omega6_la_g: 1.22
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: []
notes:
  - "Atwater check (available carb basis): 4×8.5 + 9×39.8 + 4×34.2 + 2×0.1 = 34 + 358.2 + 136.8 + 0.2 = 529 kcal (within ±1% of 525)"
  - "Component-based estimation from traditional La Viña recipe proportions scaled to 145g slice"
change_log:
  - timestamp: "2025-11-15T12:00:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial comprehensive nutrition estimate for Basque cheesecake using component analysis"
    notes: "Slice composition (145g): cream cheese 72.5g (50%), heavy cream 36.2g (25%), sugar 27.2g (19%), eggs 21.7g (15%), flour 2.4g (2%). Based on traditional La Viña recipe ratios (1kg cream cheese, 375g sugar, 500g cream, 300g eggs, 32g flour → 2000g whole cake). All 52 nutrients calculated from USDA FoodData Central per-ingredient profiles. UK dairy iodine estimates used (2-3× higher than EU). Chloride derived from sodium (×1.54), sulfur from protein (×0.01 for animal products). Confidence: MEDIUM."
```
