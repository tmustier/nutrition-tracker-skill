## Mixed Pineapple/Mango/Passion Fruit (150 g)

```yaml
id: pine_mango_passion_150g_v1
version: 4
last_verified: '2025-11-02'
source:
  venue: pack/ingredient
  menu_page: ''
  evidence: []
aliases: []
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 150
  notes: Fresh fruit mix.
assumptions:
  salt_scheme: normal
  oil_type: ''
  prep: ''
    from FIBER-SPLIT-ESTIMATION-REFERENCE.yaml; mixed pineapple/mango/passion fruit.
    Confidence MEDIUM.
per_portion:
  energy_kcal: 75.3
  protein_g: 0.9
  fat_g: 0.5
  sat_fat_g: 0.2
  mufa_g: 0.1
  pufa_g: 0.2
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 15.9
  fiber_total_g: 1.4
  fiber_soluble_g: 0.4
  fiber_insoluble_g: 1.0
  sodium_mg: 6
  potassium_mg: 277
  iodine_ug: 1
  magnesium_mg: 22
  calcium_mg: 18
  iron_mg: 1
  zinc_mg: 0
  vitamin_c_mg: 54
  manganese_mg: 1
  polyols_g: 0.0
  carbs_available_g: 16.1
  carbs_total_g: 17.5
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps: []
notes:
- 'Atwater check (available carb basis): 4×0.9 + 9×0.5 + 4×16.1 + 2×1.4 + 2.4×0.0
  = 75.3 kcal'
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed:
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
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
  - per_portion.manganese_mg
  sources:
  - url: user_input
    note: User-supplied values on 2025-10-28
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed:
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.magnesium_mg
  - per_portion.iron_mg
  - per_portion.zinc_mg
  - per_portion.manganese_mg
  sources:
  - url: formatting-pass
    note: Automated rounding pass
- timestamp: 2025-10-28T20:15:00+0000
  updated_by: Claude Sonnet 4.5
  reason: Fill missing fatty acid breakdown and micronutrient data based on USDA FoodData
    Central research
  fields_changed:
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.trans_fat_g
  - per_portion.cholesterol_mg
  - per_portion.iodine_ug
  sources:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/169124/nutrients
    note: 'USDA FDC ID 169124: Pineapple, raw, all varieties - Fat breakdown per 100g:
      0.12g total (0.009g sat, 0.013g MUFA, 0.04g PUFA)'
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/169910/nutrients
    note: 'USDA FDC ID 169910: Mangos, raw - Fat breakdown per 100g: 0.6g total (0.08g
      sat, 0.14g MUFA, 0.07g PUFA)'
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/169108/nutrients
    note: 'USDA FDC ID 169108: Passion fruit, raw, purple - Fat breakdown per 100g:
      0.7g total (0.059g sat, 0.086g MUFA, 0.411g PUFA)'
  notes: 'Tropical fruits contain minimal fat (0.12-0.7g per 100g). Fat composition:
    predominantly unsaturated with PUFA > MUFA. Trans fat=0 and cholesterol=0 (plant-based).
    Iodine content is trace (1-2µg per 150g typical for fruit). Values calculated
    proportionally based on 150g mixed fruit with 0.5g total fat.'
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed:
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
