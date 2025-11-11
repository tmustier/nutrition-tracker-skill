## Choc O'Time Durian Tiramisu Chocolate Almonds (7 pieces)

```yaml
id: choc_o_time_durian_almond_7pc_generic_v1
version: 1
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
  description: "7 chocolate-covered almonds (~25g)"
  est_weight_g: 25
  notes: "Approximately 3.5g per piece. Milk chocolate coating with durian-tiramisu flavoring covering whole almonds."
assumptions:
  salt_scheme: "normal"
  oil_type: "palm kernel (hydrogenated), cocoa butter"
  prep: "Packaged confection, ready to eat"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 139.5
  protein_g: 1.4
  fat_g: 8.3
  sat_fat_g: 5.5
  mufa_g: 2.0
  pufa_g: 0.6
  trans_fat_g: 0.05
  cholesterol_mg: 3
  # Carbohydrates
  carbs_total_g: 14.9
  carbs_available_g: 13.9
  sugar_g: 7.2
  fiber_total_g: 1.0
  fiber_soluble_g: 0.4
  fiber_insoluble_g: 0.6
  polyols_g: 0.0
  # Minerals
  sodium_mg: 9
  potassium_mg: 115
  iodine_ug: 3
  magnesium_mg: 24
  calcium_mg: 47
  iron_mg: 0.7
  zinc_mg: 0.7
  vitamin_c_mg: 0.3
  manganese_mg: 0.2
  copper_mg: 0.16
  selenium_ug: 2
  chromium_ug: 2
  molybdenum_ug: 2
  phosphorus_mg: 66
  chloride_mg: 14
  sulfur_g: 0.01
  # Vitamins
  vitamin_a_ug: 13
  vitamin_d_ug: 0.2
  vitamin_e_mg: 1.2
  vitamin_k_ug: 1.3
  vitamin_b1_mg: 0.07
  vitamin_b2_mg: 0.08
  vitamin_b3_mg: 0.3
  vitamin_b5_mg: 0.15
  vitamin_b6_mg: 0.05
  vitamin_b7_ug: 2
  vitamin_b9_ug: 5
  vitamin_b12_ug: 0.16
  choline_mg: 6
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.002
  omega6_la_g: 0.5
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
  - "Macronutrients scaled from user-provided per 100g values: 558 kcal × 0.25 = 139.5 kcal"
  - "Energy validation (Atwater): 4×1.4 + 9×8.3 + 4×13.9 + 2×1.0 = 5.6 + 74.7 + 55.6 + 2.0 = 137.9 kcal (within -1.1% of stated 139.5 kcal)"
  - "Fiber breakdown: Almonds (3g × 12.3g/100g = 0.37g) + Cocoa powder (1.25g × 33g/100g = 0.41g) + minor from durian = ~1.0g total"
  - "Fat breakdown: Palm kernel is highly saturated (~82% SFA), combined with milk fat → sat_fat 5.5g (66% of total fat)"
  - "MUFA 2.0g primarily from almonds (65% of almond fat is MUFA) and minor cocoa butter contribution"
  - "PUFA 0.6g from almonds (24% of almond fat is PUFA, mainly omega-6 linoleic acid)"
  - "Trans fat 0.05g trace from milk products. Fully hydrogenated palm kernel has no trans fats (only partially hydrogenated oils create trans fats)"
  - "Cholesterol 3mg from milk components (lactose powder, skim milk powder, whey powder total ~7% by weight)"
  - "Vitamin E (1.2mg) elevated due to almonds (25.6mg/100g in USDA data): 3g almonds contribute ~0.77mg, milk chocolate base ~0.4mg"
  - "Potassium, magnesium, phosphorus, copper, manganese: Almond contribution significant despite only 12% content"
  - "B-vitamins primarily from milk components (lactose, whey, skim milk powders)"
  - "Iodine 3µg: UK dairy products have elevated iodine from fortified cattle feed (medium confidence)"
  - "Omega-6 LA (0.5g): Almonds are rich in linoleic acid (12.1g/100g), scaled for 3g almond content"
  - "Omega-3 ALA (0.002g): Trace amounts from almonds"
  - "Chloride 14mg = sodium 9mg × 1.54 (NaCl mass ratio)"
  - "Sulfur 0.01g = protein 1.4g × 0.007 (mixed animal/plant protein factor, dairy components increase from plant baseline)"
change_log:
  - timestamp: "2025-11-11T12:00:00Z"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial entry created with complete 52-nutrient profile for 25g portion (7 pieces)"
    notes: "Macros from user-provided label data (per 100g) scaled to 25g. Micronutrients estimated using component analysis: milk chocolate base (USDA FDC 167587) + 12% almonds (USDA FDC 170567) + 30% palm kernel fat. All estimations documented in notes section."
```
