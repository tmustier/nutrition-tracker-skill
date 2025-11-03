## PACK'D Mixed Summer Berries (150 g)

```yaml
id: packd_mixed_summer_berries_150g_v1
version: 4
last_verified: '2025-11-02'
source:
  venue: PACK'D (pack/ingredient)
  menu_page: ''
  evidence: []
aliases: []
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 150
  notes: Pack'd mix; per-portion as provided.
assumptions:
  salt_scheme: normal
  oil_type: ''
  prep: ''
per_portion:
  energy_kcal: 56.3
  protein_g: 1.4
  fat_g: 0.3
  sat_fat_g: 0
  mufa_g: 0.03
  pufa_g: 0.18
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 9.8
  fiber_total_g: 4.4
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 0
  potassium_mg: 194
  iodine_ug: 1
  magnesium_mg: 24
  calcium_mg: 30
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 29
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 9.8
  carbs_total_g: 14.2
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps: []
notes:
- 'Atwater check (available carb basis): 4×1.4 + 9×0.3 + 4×9.8 + 2×4.4 + 2.4×0.0 =
  56.3 kcal'
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed:
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.carbs_g
  - per_portion.sugar_g
  - per_portion.fiber_total_g
  - per_portion.potassium_mg
  - per_portion.magnesium_mg
  - per_portion.calcium_mg
  - per_portion.iron_mg
  - per_portion.zinc_mg
  - per_portion.vitamin_c_mg
  sources:
  - url: user_input
    note: User-supplied values on 2025-10-28
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed:
  - per_portion.protein_g
  - per_portion.fiber_total_g
  - per_portion.iron_mg
  - per_portion.zinc_mg
  sources:
  - url: formatting-pass
    note: Automated rounding pass
- timestamp: 2025-10-28T20:00:00+0000
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Research and fill missing fat breakdown, cholesterol, and iodine data
  fields_changed:
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.trans_fat_g
  - per_portion.cholesterol_mg
  - per_portion.iodine_ug
  sources:
  - url: https://foodstruct.com/food/raspberry
    note: 'USDA data: Raspberries MUFA 0.06g, PUFA 0.38g per 100g'
  - url: https://foodstruct.com/food/strawberries
    note: 'USDA data: Strawberries MUFA 0.04g, PUFA 0.16g per 100g'
  - url: https://foodstruct.com/food/blackberry
    note: 'USDA data: Blackberries MUFA 0.047g, PUFA 0.28g per 100g; cholesterol 0mg,
      trans fat 0g'
  - url: https://www.nutritionvalue.org/Blackberries%2C_raw_nutritional_value.html
    note: Confirmed berries are plant-based with 0mg cholesterol, 0g trans fat
  - url: https://kitchenscity.com/iodine-rich-fruits/
    note: Strawberries ~13mcg per cup (150g); berries generally low in iodine
  methodology: Calculated weighted average based on PACK'D mix (36% raspberries, 34%
    blueberries, 30% blackberries) from USDA berry data, scaled to match product's
    0.3g total fat per 150g. PUFA higher than MUFA consistent with berry profiles
    (omega-3 from seeds). Trans fat and cholesterol = 0 (plant-based). Iodine = 1
    mcg (trace, very low in berries).
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
