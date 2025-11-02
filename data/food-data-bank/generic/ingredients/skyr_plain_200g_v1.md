## Skyr - plain (200 g)

```yaml
id: skyr_plain_200g_v1
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
  est_weight_g: 200
  notes: Plain skyr yoghurt.
assumptions:
  salt_scheme: normal
  oil_type: ''
  prep: ''
per_portion:
  energy_kcal: 121.2
  protein_g: 22.0
  fat_g: 0.4
  sat_fat_g: 0.2
  mufa_g: 0.1
  pufa_g: 0.0
  trans_fat_g: 0.1
  cholesterol_mg: 10
  sugar_g: 7.4
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 104
  potassium_mg: 340
  iodine_ug: 60
  magnesium_mg: 24
  calcium_mg: 300
  iron_mg: 0
  zinc_mg: 1
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 7.4
  carbs_total_g: 7.4
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: high
  gaps: []
notes:
- 'Atwater check (available carb basis): 4×22.0 + 9×0.4 + 4×7.4 + 2×0.0 + 2.4×0.0
  = 121.2 kcal'
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed:
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.cholesterol_mg
  - per_portion.carbs_g
  - per_portion.sugar_g
  - per_portion.sodium_mg
  - per_portion.potassium_mg
  - per_portion.iodine_ug
  - per_portion.magnesium_mg
  - per_portion.calcium_mg
  - per_portion.zinc_mg
  sources:
  - url: user_input
    note: User-supplied values on 2025-10-28
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed:
  - per_portion.protein_g
  - per_portion.zinc_mg
  sources:
  - url: formatting-pass
    note: Automated rounding pass
- timestamp: 2025-10-28T20:15:00+0000
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Complete dairy fat profile and trace nutrients based on research
  fields_changed:
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.trans_fat_g
  - per_portion.vitamin_c_mg
  - per_portion.iron_mg
  - version
  sources:
  - url: https://fdc.nal.usda.gov/
    note: USDA FoodData Central - Low-fat yogurt reference (MUFA 0.426g, PUFA 0.044g,
      Iron 0.08mg per 100g)
  - url: https://www.sciencedirect.com/science/article/abs/pii/S0308814612005857
    note: Chemical characteristics and fatty acid composition of Greek yogurts
  - url: https://pmc.ncbi.nlm.nih.gov/articles/PMC8749727/
    note: Fatty Acid Profile and CLA Content in yogurts - natural trans-fat (CLA)
      0.34-1.07% of total fat
  - url: https://www.healthline.com/nutrition/skyr
    note: Skyr nutrition information - confirms trace iron and no vitamin C in plain
      dairy
  - url: https://www.nutritionvalue.org/Yogurt,_low_fat,_plain_nutritional_value.html
    note: 'Dairy fat composition: ~62-70% saturated, ~25-30% MUFA, ~3-5% PUFA'
  calculation_notes: 'With 0.4g total fat (0.2g saturated) per 200g: MUFA estimated
    at 0.1g (~27% of total fat), PUFA trace at 0.0g (~3% of total fat), trans-fat
    0.1g representing natural CLA from dairy (~4% of total fat). Vitamin C is 0mg
    (not naturally present in plain dairy). Iron is 0mg rounded from trace amounts
    typical in low-fat dairy products.'
- timestamp: 2025-10-29T00:00:00+0000
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Populate fiber and manganese values for dairy product (all 0)
  fields_changed:
  - per_portion.fiber_total_g
  - per_portion.fiber_soluble_g
  - per_portion.fiber_insoluble_g
  - per_portion.manganese_mg
  sources:
  - url: nutritional_knowledge
    note: Dairy products contain no dietary fiber (plant-based nutrient only). Manganese
      trace amounts rounded to 0.
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
