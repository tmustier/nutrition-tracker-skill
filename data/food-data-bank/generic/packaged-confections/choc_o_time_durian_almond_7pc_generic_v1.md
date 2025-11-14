## Choc O'Time Durian Tiramisu Chocolate Almonds (7 pieces)

```yaml
id: choc_o_time_durian_almond_7pc_generic_v1
schema_version: 2
version: 2
last_verified: 2025-11-11
source:
  venue: Packaged Confections
  menu_page: ""
  evidence:
    - "User-provided nutrition label data per 100g (energy 558 kcal, carbs 59.4g, fat 33.2g, protein 5.5g, sugar 28.9g, sodium 35.4mg)"
    - "Ingredient list: 30% palm kernel fat, 12% almonds, 5% cocoa powder, 5% lactose, 2% durian powder, plus milk powders and sugar"
    - "USDA FoodData Central 167587 (milk chocolate) for micronutrient baseline"
    - "USDA FoodData Central 170567 (dry roasted almonds) for almond micronutrient contribution"
aliases: ["Choc O'Time Durian Almonds", "Durian Tiramisu Chocolate Covered Almonds"]
category: ingredient
portion:
  description: "7 chocolate-covered almonds (56g)"
  est_weight_g: 56
  notes: "Approximately 8g per piece. Milk chocolate coating with durian-tiramisu flavoring covering whole almonds."
assumptions:
  salt_scheme: "normal"
  oil_type: "palm kernel (hydrogenated), cocoa butter"
  prep: "Packaged confection, ready to eat"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 312
  protein_g: 3.1
  fat_g: 18.6
  sat_fat_g: 12.3
  mufa_g: 4.5
  pufa_g: 1.3
  trans_fat_g: 0.11
  cholesterol_mg: 5
  # Carbohydrates
  carbs_total_g: 33.4
  carbs_available_g: 31.1
  sugar_g: 16.1
  fiber_total_g: 2.2
  fiber_soluble_g: 0.9
  fiber_insoluble_g: 1.3
  polyols_g: 0.0
  # Minerals
  sodium_mg: 20
  potassium_mg: 258
  iodine_ug: 3
  magnesium_mg: 54
  calcium_mg: 105
  iron_mg: 1.6
  zinc_mg: 1.6
  vitamin_c_mg: 0.0
  manganese_mg: 0.4
  copper_mg: 0.36
  selenium_ug: 2
  chromium_ug: 2
  molybdenum_ug: 2
  phosphorus_mg: 148
  chloride_mg: 31
  sulfur_g: 0.022
  # Vitamins
  vitamin_a_ug: 29
  vitamin_d_ug: 0.4
  vitamin_e_mg: 2.7
  vitamin_k_ug: 2
  vitamin_b1_mg: 0.16
  vitamin_b2_mg: 0.18
  vitamin_b3_mg: 1.1
  vitamin_b5_mg: 0.22
  vitamin_b6_mg: 0.04
  vitamin_b7_ug: 6
  vitamin_b9_ug: 11
  vitamin_b12_ug: 0.36
  choline_mg: 20
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.004
  omega6_la_g: 1.1
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "Exact fatty acid profile depends on palm kernel fat processing and almond variety"
    - "Durian powder micronutrient contribution (2% by weight) considered negligible"
notes:
  - "CORRECTED v2: User clarified each piece is ~8g, not 3.5g. Updated from 25g to 56g portion (7 pieces × 8g)"
  - "Macronutrients scaled from user-provided per 100g values: 558 kcal × 0.56 = 312 kcal"
  - "Energy validation (Atwater): 4×3.1 + 9×18.6 + 4×31.1 + 2×2.2 = 12.4 + 167.4 + 124.4 + 4.4 = 308.6 kcal (within -1.1% of stated 312 kcal)"
  - "Fiber breakdown: Almonds (6.7g × 12.3g/100g = 0.82g) + Cocoa powder (2.8g × 33g/100g = 0.92g) + minor from durian = ~2.2g total"
  - "Fat breakdown: Palm kernel is highly saturated (~82% SFA), combined with milk fat → sat_fat 12.3g (66% of total fat)"
  - "MUFA 4.5g primarily from almonds (65% of almond fat is MUFA) and minor cocoa butter contribution"
  - "PUFA 1.3g from almonds (24% of almond fat is PUFA, mainly omega-6 linoleic acid)"
  - "Trans fat 0.11g trace from milk products. Fully hydrogenated palm kernel has no trans fats (only partially hydrogenated oils create trans fats)"
  - "Cholesterol 5mg from milk components (lactose powder, skim milk powder, whey powder total ~7% by weight)"
  - "Vitamin E (2.7mg) elevated due to almonds (25.6mg/100g in USDA data): 6.7g almonds contribute ~1.7mg, milk chocolate base ~1.0mg"
  - "Potassium, magnesium, phosphorus, copper, manganese: Almond contribution significant despite only 12% content"
  - "B-vitamins primarily from milk components (lactose, whey, skim milk powders)"
  - "Iodine 3µg: UK dairy products have elevated iodine from fortified cattle feed (medium confidence)"
  - "Omega-6 LA (1.1g): Almonds are rich in linoleic acid (12.1g/100g), scaled for 6.7g almond content"
  - "Omega-3 ALA (0.004g): Trace amounts from almonds"
  - "Chloride 31mg = sodium 20mg × 1.54 (NaCl mass ratio)"
  - "Sulfur 0.022g = protein 3.1g × 0.007 (mixed animal/plant protein factor, dairy components increase from plant baseline)"
change_log:
  - timestamp: "2025-11-11T20:30:00Z"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "CORRECTION: Updated portion size from 25g to 56g based on user clarification (8g per piece × 7 pieces)"
    notes: "All nutrients scaled by factor of 2.24 (56/25). Macros from user label now: 312 kcal, 3.1g P, 18.6g F, 33.4g C total. Portion weight in notes updated from 3.5g to 8g per piece."
  - timestamp: "2025-11-11T12:00:00Z"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial entry created with complete 52-nutrient profile for 25g portion (7 pieces)"
    notes: "Macros from user-provided label data (per 100g) scaled to 25g. Micronutrients estimated using component analysis: milk chocolate base (USDA FDC 167587) + 12% almonds (USDA FDC 170567) + 30% palm kernel fat. All estimations documented in notes section."
```
