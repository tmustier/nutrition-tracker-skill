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
    - "Standard pita bread: 60g (6.5 inch), but Miznon's described as significantly larger and fluffier"
    - "Estimated weight: 90g (50% larger than standard) based on size descriptions and photos"
    - "USDA FoodData Central 172816 (enriched white pita bread) for nutritional composition"
    - "Nutritional values scaled from USDA per 100g to 90g portion"
    - "Web research: hot-dinners.com, tripadvisor.com, miznon.co.uk"
aliases: []
category: side
portion:
  description: "1 pita bread (served with hummus plate)"
  est_weight_g: 90
  notes: "Famous fluffy pita from Miznon Soho - significantly larger than standard pita bread"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: "Fresh-baked pita bread, slightly charred at edges, pillowy soft interior"
per_portion:  # Schema v2: 52 nutrient fields (90g portion)
  # Macronutrients
  energy_kcal: 248
  protein_g: 8.2
  fat_g: 1.1
  sat_fat_g: 0.2
  mufa_g: 0.1
  pufa_g: 0.5
  trans_fat_g: 0.0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 50.1
  carbs_available_g: 48.2
  sugar_g: 0.9
  fiber_total_g: 1.9
  fiber_soluble_g: 0.6
  fiber_insoluble_g: 1.3
  polyols_g: 0.0
  # Minerals
  sodium_mg: 482
  potassium_mg: 108
  iodine_ug: 2.0
  magnesium_mg: 23
  calcium_mg: 77
  iron_mg: 2.3
  zinc_mg: 0.8
  vitamin_c_mg: 0.0
  manganese_mg: 0.4
  copper_mg: 0.15
  selenium_ug: 24
  chromium_ug: 3
  molybdenum_ug: 9
  phosphorus_mg: 87
  chloride_mg: 742.3
  sulfur_g: 0.033
  # Vitamins
  vitamin_a_ug: 0
  vitamin_d_ug: 0.0
  vitamin_e_mg: 0.2
  vitamin_k_ug: 0.7
  vitamin_b1_mg: 0.45
  vitamin_b2_mg: 0.27
  vitamin_b3_mg: 3.6
  vitamin_b5_mg: 0.27
  vitamin_b6_mg: 0.04
  vitamin_b7_ug: 2.7
  vitamin_b9_ug: 69
  vitamin_b12_ug: 0.0
  choline_mg: 9.0
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.04
  omega6_la_g: 0.36
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
  - "Pita described in reviews as 'volleyball-sized', 'ridiculously fluffy', with 'pillow-like quality'"
  - "Weight estimated at 90g (50% larger than standard 60g pita) based on size descriptions"
  - "Nutritional profile based on USDA enriched white pita bread, scaled to 90g"
  - "Enriched flour provides B-vitamins: thiamin, riboflavin, niacin, folate, plus iron"
  - "Plant-based: zero cholesterol, zero B12, zero EPA/DHA"
  - "Carbs are primarily starch from wheat flour, minimal sugar"
  - "Low fat content typical of bread (no added oils beyond minimal dough fat)"
  - "Chloride derived from sodium (×1.54), sulfur from protein (×0.004 for plant protein)"
  - "User consumed 1/3 with hummus at dinner, 2/3 as snack later"
change_log:
  - timestamp: "2025-11-07T12:30:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial creation with complete 52-nutrient profile"
    notes: "Researched Miznon Soho pita (volleyball-sized, famous fluffy pita). Estimated 90g based on size descriptions. Used USDA FoodData Central 172816 (enriched white pita) scaled to 90g. Populated all macros, micros, B-vitamins from enriched flour, minerals, fatty acids. Chloride = sodium × 1.54 (482 × 1.54 = 742.3mg). Sulfur = protein × 0.004 for plant protein (8.2 × 0.004 = 0.033g). Energy validates: 4×8.2 + 9×1.1 + 4×48.2 + 2×1.9 = 32.8 + 9.9 + 192.8 + 3.8 = 239.3 kcal, adjusted to 248 kcal based on USDA data (within ±4% tolerance). Ultra-trace minerals set to 0 per ESTIMATE.md (not tracked)."
```
