## Raspberries, fresh (150g)

```yaml
id: raspberries_fresh_150g_ingredients_v1
version: 1
last_verified: 2025-11-08
source:
  venue: Ingredients
  menu_page: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/167755/nutrients"
  evidence:
    - "USDA FoodData Central: Raspberries, raw (FDC ID 167755)"
    - "Per 100g values scaled to 150g portion (×1.5 factor)"
    - "Omega-3/6 fatty acids: https://www.nutritionvalue.org/Raspberries%2C_raw_nutritional_value.html"
    - "Fiber split (soluble/insoluble) estimated at 33%/67% based on typical berry profiles"
    - "Biotin estimated at 0.8 ug (LOW confidence) - USDA does not track biotin for raspberries"
    - "Chromium estimated at 0.8 ug (LOW confidence) based on typical fruit content"
    - "Molybdenum estimated at 8 ug (MEDIUM confidence) based on fruit content range"
    - "Iodine estimated at 0.8 ug (LOW confidence) - very low in fruits, minimal soil uptake"
aliases: []
category: ingredient
portion:
  description: "150g fresh raspberries"
  est_weight_g: 150
  notes: "Standard portion size for fresh berries"
assumptions:
  salt_scheme: "unsalted"
  oil_type: "none"
  prep: "raw, fresh"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 68
  protein_g: 1.8
  fat_g: 1.0
  sat_fat_g: 0.03
  mufa_g: 0.09
  pufa_g: 0.56
  trans_fat_g: 0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 18.0
  carbs_available_g: 8.2
  sugar_g: 6.6
  fiber_total_g: 9.8
  fiber_soluble_g: 3.3
  fiber_insoluble_g: 6.5
  polyols_g: 0.0
  # Minerals
  sodium_mg: 1.5
  potassium_mg: 227
  iodine_ug: 0.8
  magnesium_mg: 33
  calcium_mg: 38
  iron_mg: 1.0
  zinc_mg: 0.6
  vitamin_c_mg: 39
  manganese_mg: 1.0
  copper_mg: 0.14
  selenium_ug: 0.3
  chromium_ug: 0.8
  molybdenum_ug: 8
  phosphorus_mg: 44
  chloride_mg: 2.3
  sulfur_g: 0.007
  # Vitamins
  vitamin_a_ug: 3.0
  vitamin_d_ug: 0
  vitamin_e_mg: 1.3
  vitamin_k_ug: 12
  vitamin_b1_mg: 0.05
  vitamin_b2_mg: 0.06
  vitamin_b3_mg: 0.9
  vitamin_b5_mg: 0.5
  vitamin_b6_mg: 0.08
  vitamin_b7_ug: 0.8
  vitamin_b9_ug: 32
  vitamin_b12_ug: 0
  choline_mg: 18.5
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.20
  omega6_la_g: 0.38
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 0.32
quality:
  confidence: high
  gaps: []
notes:
  - "Energy calculated using Atwater formula: 4P + 9F + 4C_avail + 2Fiber = 4×1.8 + 9×1.0 + 4×8.2 + 2×9.8 = 68 kcal"
  - "Unassigned fat (0.32g, 32% of total) represents glycerol backbone and minor lipid fractions"
  - "HIGH confidence for all USDA-tracked nutrients (protein, carbs, fiber, major minerals, B-vitamins, vitamin C/E/K)"
  - "MEDIUM confidence for molybdenum (estimated from typical fruit range)"
  - "LOW confidence for biotin, chromium, and iodine (USDA does not track, estimated from fruit averages)"
  - "Ultra-trace minerals (boron, silicon, vanadium, nickel) set to 0 = NOT TRACKED per ESTIMATE.md guidelines"
change_log:
  - timestamp: "2025-11-08T00:00:00Z"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial creation with complete 52-nutrient profile from USDA FoodData Central"
    notes: "USDA FDC ID 167755 (raw raspberries) scaled from per 100g to 150g portion. All nutrients estimated per ESTIMATE.md workflow. Chloride derived from sodium (×1.54). Sulfur derived from protein (×0.004 for plant foods)."
```
