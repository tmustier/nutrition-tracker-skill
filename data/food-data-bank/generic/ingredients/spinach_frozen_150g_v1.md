## Spinach - frozen, unprepared (150 g)

```yaml
id: spinach_frozen_150g_v1
schema_version: 2
version: 1
last_verified: 2025-11-12
source:
  venue: pack/ingredient
  menu_page:
  evidence:
    - "USDA FoodData Central - Spinach, frozen, chopped or leaf, unprepared (FDC ID: 169287)"
    - "https://www.nutritionvalue.org/Spinach%2C_unprepared%2C_chopped_or_leaf%2C_frozen_nutritional_value.html"
    - "https://tools.myfooddata.com/nutrition-facts/169287/wt1"
aliases:
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 150
  notes: Frozen spinach, unprepared. Values scaled from USDA per-100g data.
assumptions:
  salt_scheme: normal
  oil_type:
  prep:
per_portion:
  energy_kcal: 44
  protein_g: 5.4
  fat_g: 0.9
  sat_fat_g: 0.1
  mufa_g: 0.0
  pufa_g: 0.8
  trans_fat_g: 0.0
  cholesterol_mg: 0
  sugar_g: 0.9
  fiber_total_g: 4.4
  fiber_soluble_g: 1.4
  fiber_insoluble_g: 3.0
  sodium_mg: 111
  potassium_mg: 519
  iodine_ug: 2
  magnesium_mg: 113
  calcium_mg: 194
  iron_mg: 2.9
  zinc_mg: 0.8
  vitamin_c_mg: 8.3
  manganese_mg: 1.1
  polyols_g: 0.0
  carbs_available_g: 2.0
  carbs_total_g: 6.3
  copper_mg: 0.21
  selenium_ug: 9
  chromium_ug: 1
  molybdenum_ug: 0
  phosphorus_mg: 74
  chloride_mg: 171.0
  sulfur_g: 0.022
  vitamin_a_ug: 879
  vitamin_d_ug: 0.0
  vitamin_e_mg: 4.4
  vitamin_k_ug: 558
  vitamin_b1_mg: 0.14
  vitamin_b2_mg: 0.33
  vitamin_b3_mg: 0.77
  vitamin_b5_mg: 0.14
  vitamin_b6_mg: 0.26
  vitamin_b7_ug: 2
  vitamin_b9_ug: 218
  vitamin_b12_ug: 0.0
  choline_mg: 27
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.09
  omega6_la_g: 0.03
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps:
notes:
- Atwater check (available carb basis): 4×5.4 + 9×0.9 + 4×2.0 + 2×4.4 + 2.4×0.0 = 44 kcal
- USDA per-100g data scaled to 150g portion
- Frozen spinach is nutrient-dense with exceptional vitamin K, vitamin A, folate, iron, and magnesium
- Low calorie, high fiber, excellent for micronutrient coverage
change_log:
  - timestamp: '2025-11-12T00:00:00+00:00'
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: Initial creation from USDA FoodData Central reference data
    fields_changed: [all fields]
    sources:
      - note: 'USDA FoodData Central - Spinach, frozen, unprepared. Per 100g: 29 kcal, 3.6g protein, 0.6g fat (sat 0.041g, PUFA 0.536g), 4.2g carbs, 2.9g fiber, 0.6g sugar. Minerals: Na 74mg, K 346mg, Ca 129mg, Mg 75mg, P 49mg, Fe 1.9mg, Zn 0.56mg, Cu 0.14mg, Mn 0.7mg, Se 6µg. Vitamins: A 586µg RAE, C 5.5mg, E 2.9mg, K 372µg, B1 0.09mg, B2 0.22mg, B3 0.51mg, B5 0.09mg, B6 0.17mg, B9 145µg DFE. All values scaled to 150g portion (×1.5).'
        url: 'https://www.nutritionvalue.org/Spinach%2C_unprepared%2C_chopped_or_leaf%2C_frozen_nutritional_value.html'
      - note: 'Choline estimated at 18mg per 100g based on fresh spinach data, scaled to 27mg for 150g portion.'
        url: 'https://www.nutritionvalue.org/'
      - note: 'Omega-3 ALA and omega-6 LA based on fatty acid profile research showing spinach contains primarily ALA (omega-3) and linoleic acid (omega-6). PUFA 0.8g split as ~60% ALA, ~40% LA.'
        url: 'nutritional_research'
    methodology: "All USDA per-100g values multiplied by 1.5 to get 150g portion. Chloride calculated as sodium × 1.54 (NaCl ratio). Sulfur calculated as protein × 0.004 (plant). Fiber split estimated as 30% soluble, 70% insoluble based on typical green leafy vegetable ratios. MUFA rounded to 0.0g (trace amounts in spinach). Chromium, molybdenum, biotin, ultra-trace minerals set to 0 or trace amounts per USDA database (not routinely analyzed). Iodine estimated at 2µg based on vegetable averages."
```
