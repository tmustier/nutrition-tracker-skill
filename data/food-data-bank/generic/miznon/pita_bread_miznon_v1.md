## Pita (Miznon)

```yaml
id: pita_bread_miznon_v1
version: 1
last_verified: 2025-11-07
source:
  venue: Miznon
  menu_page: "Miznon Soho (with 'the best hummus plate')"
  evidence:
    - "Miznon Soho London - pita described as 'volleyball-sized', 'ridiculously fluffy', 'pillow-like quality'"
    - "Eyal Shani's (Miznon's chef) pita recipe: small pitas are 60g (12cm diameter)"
    - "Standard pita pocket: 60g (6.5 inch diameter)"
    - "'Fluffy' and 'volleyball' refer to shape/texture (round, puffy, airy), NOT oversized weight"
    - "USDA FoodData Central 172816 (enriched white pita bread) for nutritional composition"
    - "Nutritional values scaled from USDA per 100g to 60g portion"
    - "Web research: hot-dinners.com, tripadvisor.com, miznon.co.uk, veredguttman.com"
aliases: []
category: side
portion:
  description: "1 pita bread (served with hummus plate)"
  est_weight_g: 60
  notes: "Famous fluffy pita from Miznon Soho - standard pita pocket size, thick and airy texture"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: "Fresh-baked pita bread, slightly charred at edges, pillowy soft interior"
per_portion:  # Schema v2: 52 nutrient fields (60g portion)
  # Macronutrients
  energy_kcal: 165
  protein_g: 5.5
  fat_g: 0.7
  sat_fat_g: 0.13
  mufa_g: 0.07
  pufa_g: 0.33
  trans_fat_g: 0.0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 33.4
  carbs_available_g: 32.1
  sugar_g: 0.6
  fiber_total_g: 1.3
  fiber_soluble_g: 0.4
  fiber_insoluble_g: 0.9
  polyols_g: 0.0
  # Minerals
  sodium_mg: 321
  potassium_mg: 72
  iodine_ug: 1
  magnesium_mg: 15
  calcium_mg: 51
  iron_mg: 2
  zinc_mg: 1
  vitamin_c_mg: 0.0
  manganese_mg: 0.27
  copper_mg: 0.10
  selenium_ug: 16
  chromium_ug: 2
  molybdenum_ug: 6
  phosphorus_mg: 58
  chloride_mg: 495
  sulfur_g: 0.02
  # Vitamins
  vitamin_a_ug: 0
  vitamin_d_ug: 0.0
  vitamin_e_mg: 0.1
  vitamin_k_ug: 0.5
  vitamin_b1_mg: 0.30
  vitamin_b2_mg: 0.18
  vitamin_b3_mg: 2.4
  vitamin_b5_mg: 0.18
  vitamin_b6_mg: 0.03
  vitamin_b7_ug: 2
  vitamin_b9_ug: 46
  vitamin_b12_ug: 0.0
  choline_mg: 6.0
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.03
  omega6_la_g: 0.24
  # Ultra-trace minerals (not tracked per ESTIMATE.md)
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
  - "Miznon is famous for their fresh pita bread - baked to order, served warm"
  - "Pita described as 'volleyball-sized', 'ridiculously fluffy', 'pillow-like' - refers to round shape and airy texture"
  - "Weight confirmed at 60g (standard pita pocket size) - 'fluffy' describes texture, not oversized weight"
  - "Eyal Shani's recipe confirms small pitas are 60g (12cm diameter), large are 80g"
  - "Nutritional profile based on USDA enriched white pita bread, scaled to 60g"
  - "Enriched flour provides B-vitamins: thiamin, riboflavin, niacin, folate, plus iron"
  - "Plant-based: zero cholesterol, zero B12, zero EPA/DHA"
  - "Carbs are primarily starch from wheat flour, minimal sugar"
  - "Low fat content typical of bread (no added oils beyond minimal dough fat)"
  - "Chloride derived from sodium (×1.54), sulfur from protein (×0.004 for plant protein)"
  - "User consumed 1/3 with hummus at dinner, 2/3 as snack later"
change_log:
  - timestamp: "2025-11-07T16:45:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "CORRECTION: Updated weight from 90g to 60g (standard pita pocket size)"
    notes: "User correctly identified pita is standard pocket size, not oversized. Research confirmed: Eyal Shani's (Miznon chef) recipe shows small pitas are 60g (12cm). 'Fluffy' and 'volleyball' descriptions refer to round shape and airy texture, NOT weight. Rescaled all nutrition values from 90g to 60g (×0.667). Chloride = sodium × 1.54 (321 × 1.54 = 495mg). Sulfur = protein × 0.004 for plant protein (5.5 × 0.004 = 0.022g). Energy validates: 4×5.5 + 9×0.7 + 4×32.1 + 2×1.3 = 22.0 + 6.3 + 128.4 + 2.6 = 159.3 kcal, adjusted to 165 kcal based on USDA data (within ±4% tolerance)."
  - timestamp: "2025-11-07T12:30:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial creation with complete 52-nutrient profile"
    notes: "Researched Miznon Soho pita (volleyball-sized, famous fluffy pita). Initially estimated 90g based on misinterpreting size descriptions. Used USDA FoodData Central 172816 (enriched white pita) scaled to 90g. Populated all macros, micros, B-vitamins from enriched flour, minerals, fatty acids."
```
