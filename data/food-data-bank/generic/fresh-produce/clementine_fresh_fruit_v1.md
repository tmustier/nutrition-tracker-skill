## Clementine (Fresh Fruit)

```yaml
id: clementine_fresh_fruit_v1
version: 2
last_verified: '2025-11-02'
source:
  venue: Clementine (Fresh Fruit)
  menu_page: ''
  evidence:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/168195/nutrients
    note: 'USDA FoodData Central: Clementines, raw (FDC ID 168195)'
  - url: https://tools.myfooddata.com/nutrition-facts/168195/wt1
    note: 'MyFoodData USDA aggregation: Complete nutrition profile per 100g and per
      clementine'
aliases:
- mandarin
- easy peeler
category: ingredient
portion:
  description: 1 medium clementine (~74g)
  est_weight_g: 74
  notes: Standard USDA portion weight for one medium clementine
assumptions:
  salt_scheme: unsalted
  oil_type: ''
  prep: fresh, whole, peeled
per_portion:
  energy_kcal: 41.9
  protein_g: 0.6
  fat_g: 0.1
  sat_fat_g: 0.0
  mufa_g: 0.0
  pufa_g: 0.0
  trans_fat_g: 0.0
  cholesterol_mg: 0
  sugar_g: 6.8
  fiber_total_g: 1.3
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 1
  potassium_mg: 131
  iodine_ug: null
  magnesium_mg: 7
  calcium_mg: 22
  iron_mg: 0.1
  zinc_mg: 0.0
  vitamin_c_mg: 36
  manganese_mg: null
  polyols_g: 0.0
  carbs_available_g: 9.0
  carbs_total_g: 10.3
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
  fat_unassigned_g: 0.1
quality:
  confidence: high
  gaps:
  - fiber_soluble_g
  - fiber_insoluble_g
  - iodine_ug
  - manganese_mg
notes:
- 35 kcal from USDA FoodData Central per medium 74g clementine
- 'Values scaled from USDA per-100g data: 47 kcal, 0.85g protein, 0.15g fat, 12g carbs,
  1.7g fiber'
- Fat content negligible (<0.15g) - primarily trace amounts of natural fruit oils
- 'Excellent source of vitamin C: 36mg provides ~60% daily value'
- Naturally sodium-free and cholesterol-free
- 'Atwater check (available carb basis): 4×0.6 + 9×0.1 + 4×9.0 + 2×1.3 + 2.4×0.0 =
  41.9 kcal'
change_log:
- timestamp: 2025-10-29 14:00:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Initial population from USDA FoodData Central (FDC ID 168195) scaled to
    standard 74g portion
  fields_changed:
  - portion.est_weight_g
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
  - per_portion.carbs_g
  - per_portion.sugar_g
  - per_portion.fiber_total_g
  - per_portion.sodium_mg
  - per_portion.potassium_mg
  - per_portion.magnesium_mg
  - per_portion.calcium_mg
  - per_portion.iron_mg
  - per_portion.zinc_mg
  - per_portion.vitamin_c_mg
  - derived.energy_from_macros_kcal
  - derived.fat_unassigned_g
  - quality.confidence
  - quality.gaps
  sources:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/168195/nutrients
    note: USDA FoodData Central primary source for clementines, raw
  - url: https://tools.myfooddata.com/nutrition-facts/168195/wt1
    note: USDA data aggregator showing per-clementine values (74g portion)
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed:
  - derived.energy_from_macros_kcal
  - last_verified
  - notes
  - per_portion.carbs_available_g
  - per_portion.carbs_g
  - per_portion.carbs_total_g
  - per_portion.energy_kcal
  - per_portion.polyols_g
  - version
  sources: []
```
