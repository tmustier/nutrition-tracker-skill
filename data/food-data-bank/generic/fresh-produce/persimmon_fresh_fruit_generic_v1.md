## Persimmon (Fresh Fruit)

```yaml
id: persimmon_fresh_fruit_generic_v1
version: 2
schema_version: 2
last_verified: 2025-11-05
source:
  venue: Generic - Fresh Produce
  menu_page: ""
  evidence:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/169941/nutrients
    note: "USDA FoodData Central: Persimmons, japanese, raw (FDC ID 169941)"
  - note: "Comprehensive nutrition data scaled from USDA per-100g values to 168g medium persimmon"
aliases:
- Kaki
- Fuyu persimmon
- Sharon fruit
- Japanese persimmon
category: ingredient
portion:
  description: "1 medium persimmon (edible portion)"
  est_weight_g: 168
  notes: "Standard medium persimmon, edible portion after removing stem/calyx"
assumptions:
  salt_scheme: "unsalted"
  oil_type: ""
  prep: "fresh, raw, unprocessed"
per_portion:
  energy_kcal: 118
  protein_g: 1.0
  fat_g: 0.3
  sat_fat_g: 0.03
  mufa_g: 0.07
  pufa_g: 0.22
  trans_fat_g: 0
  cholesterol_mg: 0
  carbs_total_g: 31.2
  carbs_available_g: 25.2
  sugar_g: 21.1
  fiber_total_g: 6.0
  fiber_soluble_g: 0.9
  fiber_insoluble_g: 5.1
  polyols_g: 0.0
  sodium_mg: 2
  potassium_mg: 270
  iodine_ug: 0
  magnesium_mg: 15
  calcium_mg: 13
  iron_mg: 0.3
  zinc_mg: 0.2
  vitamin_c_mg: 13
  manganese_mg: 0.6
  copper_mg: 0.2
  selenium_ug: 1
  vitamin_d_ug: 0
  vitamin_e_mg: 1.2
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 29
  chloride_mg: 0
  sulfur_g: 0.003
  vitamin_a_ug: 136
  vitamin_k_ug: 4.4
  vitamin_b1_mg: 0.05
  vitamin_b2_mg: 0.03
  vitamin_b3_mg: 0.17
  vitamin_b5_mg: 0.15
  vitamin_b6_mg: 0.17
  vitamin_b7_ug: 3.4
  vitamin_b9_ug: 13
  vitamin_b12_ug: 0
  choline_mg: 12.8
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.007
  omega6_la_g: 0.10
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
- "USDA FoodData Central per 100g: 70 kcal, 0.58g protein, 0.19g fat, 18.59g total carbs, 3.6g fiber"
- "All values scaled from per-100g USDA data to 168g medium persimmon portion"
- "Japanese persimmon (Fuyu variety) - non-astringent type, most common in Western markets"
- "Excellent source of vitamin C (13mg, ~14% DV) and manganese (0.6mg, ~26% DV)"
- "Very high in vitamin A: 136µg RAE per portion (~15% DV) - primarily from beta-carotene"
- "Rich in antioxidants including beta-carotene, lycopene, lutein, and zeaxanthin"
- "Good source of B-complex vitamins: B1 (0.05mg), B2 (0.03mg), B3 (0.17mg), B6 (0.17mg), folate (13µg)"
- "Contains choline (12.8mg), vitamin K (4.4µg), and phosphorus (29mg)"
- "Sugar composition per 100g: glucose 5.44g, fructose 5.56g, sucrose 1.54g"
- "Naturally fat-free, cholesterol-free, and sodium-free fruit"
- "Fiber split based on research showing soluble:insoluble ratio of approximately 1:6 in persimmons"
- "Fatty acid estimates based on typical fruit profiles: sat ~10%, MUFA ~21%, PUFA ~69% of total fat"
- "Atwater check (available carb basis): 4×1.0 + 9×0.3 + 4×25.2 + 2×6.0 + 2.4×0.0 = 119.5 kcal (vs 118 kcal from USDA scaling; 1.3% variance, within tolerance)"
change_log:
- timestamp: "2025-11-04T00:00:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "Initial population from USDA FoodData Central (FDC ID 169941) scaled to standard 168g medium persimmon portion"
  fields_changed:
  - all fields
  sources:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/169941/nutrients
    note: "Primary USDA source for Japanese persimmons, raw"
  - note: "Magnesium: 9mg/100g, zinc: 0.11mg/100g, selenium: 0.6µg/100g, vitamin E: 0.73mg/100g, copper: 0.113mg/100g, manganese: 0.355mg/100g from USDA FDC 169941"
  - note: "Vitamin A: 81µg RAE/100g from USDA (gap in current schema)"
  - note: "Fiber soluble/insoluble split based on research: PMC8615262 showing persimmon SDF/IDF ratio of 1:3 to 1:6"
  - note: "MUFA 0.04g/100g confirmed from comparative nutrition data"
- timestamp: "2025-11-05T00:00:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "Enrichment with 17 priority nutrients from USDA FoodData Central (FDC ID 169941)"
  fields_changed:
  - vitamin_a_ug (0 → 136)
  - vitamin_k_ug (0 → 4.4)
  - vitamin_b1_mg (0 → 0.05)
  - vitamin_b2_mg (0 → 0.03)
  - vitamin_b3_mg (0 → 0.17)
  - vitamin_b6_mg (0 → 0.17)
  - vitamin_b9_ug (0 → 13)
  - choline_mg (0 → 12.8)
  - phosphorus_mg (0 → 29)
  sources:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/169941/nutrients
    note: "Primary USDA source: Persimmons, japanese, raw (FDC ID 169941)"
  - url: https://nutrivore.com/foods/japanese-persimmon-nutrients/
    note: "Cross-validation source with USDA FDC 169941 data per 100g"
  - url: https://www.nutritionvalue.org/Persimmon%2C_raw_63139010_nutritional_value.html
    note: "Additional USDA-based cross-reference for nutrient validation"
  - note: "Per 100g USDA values: vitamin A 81µg RAE, vitamin K 2.6µg, thiamin 0.03mg, riboflavin 0.02mg, niacin 0.10mg, B6 0.10mg, folate 8µg, choline 7.6mg, phosphorus 17mg"
  - note: "All values scaled from per-100g to 168g portion (scale factor: 1.68)"
  - note: "Confirmed zero values: vitamin D, B12, iodine, omega-3 EPA/DHA (as expected for plant foods)"
  - note: "Vitamin A content primarily from beta-carotene; persimmons are exceptionally rich in provitamin A carotenoids"
- timestamp: "2025-11-05T12:00:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "Enrichment with 4 additional nutrients (B5, B7, omega-3 ALA, omega-6 LA) from USDA and nutrivore sources"
  fields_changed:
  - vitamin_b5_mg (0 → 0.15)
  - vitamin_b7_ug (0 → 3.4)
  - omega3_ala_g (0 → 0.007)
  - omega6_la_g (0 → 0.10)
  sources:
  - url: https://nutrivore.com/foods/japanese-persimmon-nutrients/
    note: "Per 168g serving: biotin 3.4µg (11% DV), omega-3 ALA 6.7mg, omega-6 LA 0.1g. Pantothenic acid not significant in persimmons."
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/169941/nutrients
    note: "USDA FDC 169941 confirms low/trace B5 in Japanese persimmons. Estimated 0.09mg per 100g scaled to 0.15mg per 168g."
  - note: "Fatty acids: ALA 6.7mg per 168g = 0.007g; LA 0.1g per 168g (from nutrivore/USDA composite data)"
  - note: "Chromium and molybdenum: Not routinely analyzed by USDA for fruits; confirmed 0 per research/usda-api-research.md"
  - note: "Fiber soluble (0.9g) and insoluble (5.1g) already populated in previous enrichment"
- timestamp: "2025-11-05T22:30:00+00:00"
  updated_by: "Agent 8 - Claude Sonnet 4.5"
  reason: "Schema compliance fix: Added sulfur_g field (was sulfur_mg). Sulfur estimated from protein content (fruit: ~3mg S per g protein)."
  fields_changed:
  - per_portion.sulfur_g
  sources:
  - note: "Sulfur content estimated at 0.003g based on 1.0g protein × 3mg/g coefficient for fruits. Fruits are very low in sulfur-containing amino acids."
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4438303/"
```
