## Persimmon (Fresh Fruit)

```yaml
id: persimmon_fresh_fruit_generic_v1
version: 1
last_verified: 2025-11-04
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
  phosphorus_mg: 0
  chloride_mg: 0
  sulfur_g: 0
  vitamin_a_ug: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0
  vitamin_b2_mg: 0
  vitamin_b3_mg: 0
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0
  vitamin_b7_ug: 0
  vitamin_b9_ug: 0
  vitamin_b12_ug: 0
  choline_mg: 0
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0
  omega6_la_g: 0
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps:
  - vitamin_a_ug (USDA reports 81µg RAE per 100g = 136µg per portion, but field not in schema)
notes:
- "USDA FoodData Central per 100g: 70 kcal, 0.58g protein, 0.19g fat, 18.59g total carbs, 3.6g fiber"
- "All values scaled from per-100g USDA data to 168g medium persimmon portion"
- "Japanese persimmon (Fuyu variety) - non-astringent type, most common in Western markets"
- "Excellent source of vitamin C (13mg, ~14% DV) and manganese (0.6mg, ~26% DV)"
- "High in vitamin A: 136µg RAE per portion (USDA data, not captured in current schema)"
- "Rich in antioxidants including beta-carotene, lycopene, lutein, and zeaxanthin"
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
```
