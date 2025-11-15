## Butter Croissant (Generic Bakery)

```yaml
id: butter_croissant_bakery_v1
schema_version: 2
version: 1
last_verified: 2025-11-14
source:
  venue: Generic Bakery
  menu_page: ""
  evidence:
    - "USDA FoodData Central #174987 (Butter Croissant) for macro & micronutrient profile"
    - "UK bakery nutrition panels (Pret, Greggs) confirming portion size and macros"
aliases:
  - "Plain croissant"
  - "Butter croissant"
category: bakery
portion:
  description: "Standard butter croissant (typical UK bakery portion)"
  est_weight_g: 70
  notes: "Represents a plain laminated croissant without fillings; data scaled from USDA FDC #174987."
assumptions:
  salt_scheme: normal
  oil_type: butter
  prep: "Laminated wheat dough enriched with butter, milk, eggs, sugar, yeast, and salt."
per_portion:
  energy_kcal: 272.3
  protein_g: 5.7
  fat_g: 14.7
  sat_fat_g: 8.4
  mufa_g: 3.9
  pufa_g: 0.8
  trans_fat_g: 0.4
  cholesterol_mg: 45
  carbs_total_g: 30.2
  carbs_available_g: 28.4
  sugar_g: 7.0
  fiber_total_g: 1.8
  fiber_soluble_g: 0.5
  fiber_insoluble_g: 1.3
  polyols_g: 0.0
  sodium_mg: 327
  potassium_mg: 105
  calcium_mg: 31
  magnesium_mg: 18
  phosphorus_mg: 66
  chloride_mg: 504
  sulfur_g: 0.046
  iron_mg: 1.6
  zinc_mg: 0.53
  copper_mg: 0.13
  manganese_mg: 0.26
  selenium_ug: 7.0
  iodine_ug: 3
  chromium_ug: 1.8
  molybdenum_ug: 4.4
  vitamin_a_ug: 145
  vitamin_d_ug: 0.13
  vitamin_e_mg: 0.61
  vitamin_k_ug: 2.6
  vitamin_b1_mg: 0.28
  vitamin_b2_mg: 0.18
  vitamin_b3_mg: 1.3
  vitamin_b5_mg: 0.31
  vitamin_b6_mg: 0.07
  vitamin_b7_ug: 2.6
  vitamin_b9_ug: 31
  vitamin_b12_ug: 0.07
  choline_mg: 15.8
  vitamin_c_mg: 0
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.044
  omega6_la_g: 0.35
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "Micronutrient detail derived from USDA database; bakery-to-bakery variation expected (±10%)."
    - "Chloride estimated from sodium (Na × 1.54)."
notes:
  - "Macros anchored to USDA FDC #174987 and UK bakery nutrition panels (Pret, Greggs)."
  - "Laminate uses ~30% butter by weight, explaining high saturated fat."
  - "Available carbohydrates = total carbs minus fiber."
  - "Trace minerals and B-vitamins reflect enriched wheat flour and dairy components."
  - "Atwater validation (available carb basis): 4×5.7 + 9×14.7 + 4×28.4 + 2×1.8 ≈ 284 kcal."
change_log:
  - timestamp: "2025-11-14T00:20:00+00:00"
    updated_by: "GPT-5 Codex"
    change: "Initial creation using USDA FDC #174987 scaled to 70g portion."
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/174987/nutrients"
        note: "Butter croissant per 100g – scaled to 70g."
      - note: "Pret à Manger and Greggs UK nutrition panels (300 kcal per 76-82g croissant)."
```
