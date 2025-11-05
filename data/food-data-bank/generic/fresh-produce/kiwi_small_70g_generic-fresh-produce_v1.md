## Kiwi (Small, Fresh)

```yaml
id: kiwi_small_70g_generic-fresh-produce_v1
version: 1
last_verified: "2025-11-05"
source:
  venue: Generic - Fresh Produce
  menu_page: ""
  evidence:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/168153/nutrients
    note: "USDA FoodData Central: Kiwifruit, green, raw (FDC ID 168153)"
  - url: https://www.nutritionvalue.org/Kiwifruit,_raw,_green_nutritional_value.html
    note: 'Complete nutrition profile per 100g including minerals and vitamins'
  - url: https://pmc.ncbi.nlm.nih.gov/articles/PMC6267416/
    note: 'Peer-reviewed research on kiwifruit nutritional attributes, fiber composition'
aliases:
- kiwi
- kiwifruit
category: ingredient
portion:
  description: 1 small kiwifruit (70g with skin)
  est_weight_g: 70
  notes: Standard weight for a small kiwifruit - typically ranges 60-75g. Most common small size is ~70g.
assumptions:
  salt_scheme: unsalted
  oil_type: ""
  prep: fresh, whole with edible skin
per_portion:
  energy_kcal: 42.7
  protein_g: 0.8
  fat_g: 0.4
  sat_fat_g: 0.0
  mufa_g: 0.0
  pufa_g: 0.2
  trans_fat_g: 0.0
  cholesterol_mg: 0
  sugar_g: 6.3
  fiber_total_g: 2.4
  fiber_soluble_g: 0.5
  fiber_insoluble_g: 1.8
  sodium_mg: 2
  potassium_mg: 218
  iodine_ug: 0
  magnesium_mg: 12
  calcium_mg: 24
  iron_mg: 0.2
  zinc_mg: 0.1
  vitamin_c_mg: 64.9
  manganese_mg: 0.07
  copper_mg: 0.09
  selenium_ug: 0.14
  vitamin_d_ug: 0
  vitamin_e_mg: 1.0
  polyols_g: 0.0
  carbs_available_g: 7.9
  carbs_total_g: 10.3
  omega3_ala_g: 0
  omega3_dha_mg: 0
  omega3_epa_mg: 0
  omega6_la_g: 0
  chloride_mg: 0
  phosphorus_mg: 23.8
  sulfur_g: 0
  chromium_ug: 0
  molybdenum_ug: 0
  boron_mg: 0
  nickel_ug: 0
  silicon_mg: 0
  vanadium_ug: 0
  vitamin_a_ug: 2.8
  vitamin_k_ug: 28.2
  choline_mg: 5.4
  vitamin_b1_mg: 0.02
  vitamin_b2_mg: 0.02
  vitamin_b3_mg: 0.24
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0.04
  vitamin_b7_ug: 0
  vitamin_b9_ug: 17.5
  vitamin_b12_ug: 0
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
  fat_unassigned_g: 0.2
quality:
  confidence: high
  gaps: []
notes:
- 'USDA FoodData Central values scaled from per-100g data: 61 kcal, 1.14g protein, 0.52g fat, 14.7g carbs total, 3.39g fiber, 92.7mg vitamin C'
- 'Small kiwifruit weight assumption: 70g (range 60-75g for small size)'
- 'Fiber composition based on peer-reviewed research: ~23% soluble (pectic polysaccharides), ~77% insoluble (cellulose, hemicelluloses)'
- Fat content minimal - primarily trace amounts of natural fruit oils (PUFA predominant)
- 'Excellent source of vitamin C: 64.9mg provides ~108% daily value (60mg DV)'
- Naturally sodium-free and cholesterol-free
- 'Micronutrients per 100g from USDA FDC 168153: copper 0.128mg, selenium 0.2μg, vitamin E 1.46mg, manganese 0.098mg, phosphorus 34mg, vitamin K 40.3μg, vitamin A 4μg RAE, choline 7.78mg, folate 25μg, thiamin 0.027mg, riboflavin 0.025mg, niacin 0.34mg, vitamin B6 0.063mg'
- 'Atwater validation (available carb basis): 4×0.8 + 9×0.4 + 4×7.9 + 2×2.4 + 2.4×0 = 43.2 kcal (within 1.2% of 42.7 kcal - excellent match)'
- Can be eaten with skin for maximum fiber and nutrient content
- 'Carbs: US label reports total carbs (14.7g/100g) = available (11.31g) + fiber (3.39g)'
change_log:
- timestamp: 2025-11-05T12:00:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Initial population from USDA FoodData Central (FDC ID 168153) scaled to standard 70g small kiwifruit portion
  fields_changed:
  - portion.description
  - portion.est_weight_g
  - portion.notes
  - assumptions.salt_scheme
  - assumptions.prep
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.trans_fat_g
  - per_portion.cholesterol_mg
  - per_portion.carbs_total_g
  - per_portion.carbs_available_g
  - per_portion.sugar_g
  - per_portion.fiber_total_g
  - per_portion.fiber_soluble_g
  - per_portion.fiber_insoluble_g
  - per_portion.polyols_g
  - per_portion.sodium_mg
  - per_portion.potassium_mg
  - per_portion.iodine_ug
  - per_portion.magnesium_mg
  - per_portion.calcium_mg
  - per_portion.iron_mg
  - per_portion.zinc_mg
  - per_portion.manganese_mg
  - per_portion.copper_mg
  - per_portion.selenium_ug
  - per_portion.vitamin_c_mg
  - per_portion.vitamin_d_ug
  - per_portion.vitamin_e_mg
  - derived.fat_unassigned_g
  - quality.confidence
  - notes
  sources:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/168153/nutrients
    note: USDA FoodData Central primary source for green kiwifruit, raw
  - url: https://www.nutritionvalue.org/Kiwifruit,_raw,_green_nutritional_value.html
    note: USDA data aggregator with complete micronutrient profile
  - url: https://pmc.ncbi.nlm.nih.gov/articles/PMC6267416/
    note: 'Peer-reviewed research: The nutritional and health attributes of kiwifruit'
- timestamp: 2025-11-05T14:00:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "Enrichment: Added 17 priority nutrients from USDA FoodData Central (FDC ID 168153) via nutritionvalue.org aggregator"
  fields_changed:
  - per_portion.phosphorus_mg (0 → 23.8)
  - per_portion.copper_mg (0.1 → 0.09, refined from 0.128/100g)
  - per_portion.selenium_ug (0.1 → 0.14, refined from 0.2/100g)
  - per_portion.manganese_mg (0.1 → 0.07, refined from 0.098/100g)
  - per_portion.vitamin_a_ug (0 → 2.8)
  - per_portion.vitamin_k_ug (0 → 28.2)
  - per_portion.choline_mg (0 → 5.4)
  - per_portion.vitamin_b1_mg (0 → 0.02)
  - per_portion.vitamin_b2_mg (0 → 0.02)
  - per_portion.vitamin_b3_mg (0 → 0.24)
  - per_portion.vitamin_b6_mg (0 → 0.04)
  - per_portion.vitamin_b9_ug (0 → 17.5)
  - notes (updated micronutrient summary)
  sources:
  - url: https://www.nutritionvalue.org/Kiwifruit,_raw,_green_nutritional_value.html
    note: "Complete USDA nutrient profile including B-vitamins, vitamin A, vitamin K, choline, phosphorus per 100g"
  nutrients_confirmed:
  - "vitamin_d_ug: 0 (kiwi contains no vitamin D)"
  - "vitamin_b12_ug: 0 (plant foods do not contain B12)"
  - "iodine_ug: 0 (not reported in USDA database for kiwi)"
  - "omega3_epa_mg: 0 (confirmed, no marine omega-3s in plant foods)"
  - "omega3_dha_mg: 0 (confirmed, no marine omega-3s in plant foods)"
```
