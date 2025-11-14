## Strawberries, raw (100g)

```yaml
id: strawberries_raw_100g_fresh-produce_v1
schema_version: 2
version: 1
last_verified: 2025-11-14
source:
  venue: Fresh Produce
  menu_page: ""
  evidence:
    - "USDA FoodData Central (Strawberries, raw) – FDC ID 1102654"
    - "NutritionValue.org – Strawberry nutrient breakdown per 100g"
aliases:
  - "fresh strawberries"
category: ingredient
portion:
  description: "100g raw strawberries"
  est_weight_g: 100
  notes: "Approximately 4 large strawberries or 1¼ cups sliced."
assumptions:
  salt_scheme: unsalted
  oil_type: ""
  prep: "fresh, raw, stems removed"
per_portion:
  energy_kcal: 32
  protein_g: 0.67
  fat_g: 0.30
  sat_fat_g: 0.015
  mufa_g: 0.043
  pufa_g: 0.155
  trans_fat_g: 0
  cholesterol_mg: 0
  carbs_total_g: 7.68
  carbs_available_g: 5.68
  sugar_g: 4.89
  fiber_total_g: 2.00
  fiber_soluble_g: 0.6
  fiber_insoluble_g: 1.4
  polyols_g: 0.0
  sodium_mg: 1
  potassium_mg: 153
  calcium_mg: 16
  magnesium_mg: 13
  phosphorus_mg: 24
  chloride_mg: 1.54
  sulfur_g: 0.0027
  iron_mg: 0.41
  zinc_mg: 0.14
  copper_mg: 0.048
  manganese_mg: 0.386
  selenium_ug: 0.4
  iodine_ug: 0
  chromium_ug: 0
  molybdenum_ug: 0
  vitamin_a_ug: 1
  vitamin_d_ug: 0
  vitamin_e_mg: 0.29
  vitamin_k_ug: 2.2
  vitamin_b1_mg: 0.024
  vitamin_b2_mg: 0.022
  vitamin_b3_mg: 0.386
  vitamin_b5_mg: 0.125
  vitamin_b6_mg: 0.047
  vitamin_b7_ug: 1.5
  vitamin_b9_ug: 24
  vitamin_b12_ug: 0
  choline_mg: 5.7
  vitamin_c_mg: 58.8
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.02
  omega6_la_g: 0.09
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps: []
notes:
  - "Standard USDA per-100g values for fresh strawberries; values rounded to two decimals where appropriate."
  - "Carbohydrate split uses measured sugars and fiber (7.68g total – 2.0g fiber = 5.68g available)."
  - "Chloride derived from sodium (×1.54)."
  - "Sulfur estimated as 0.4% of plant protein."
  - "Excellent vitamin C source (≈65% DV)."
change_log:
  - timestamp: "2025-11-14T00:25:00+00:00"
    updated_by: "GPT-5 Codex"
    change: "Initial creation using USDA FDC data."
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/1102654/nutrients"
        note: "USDA FoodData Central – Strawberries, raw."
      - url: "https://www.nutritionvalue.org/Strawberries,_raw_nutritional_value.html"
        note: "Cross-check for micronutrients and rounding."
```
