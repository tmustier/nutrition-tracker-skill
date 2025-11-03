## Lemon & Herb Chicken Breast (Simple Health Kitchen)

```yaml
id: lemon_herb_chicken_breast_shk_v1
version: 5
last_verified: '2025-11-02'
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: ''
  evidence: []
aliases: []
category: main
portion:
  description: grilled chicken breast
  est_weight_g: null
  notes: lemon & herb marinade; normal salt
assumptions:
  salt_scheme: normal
  oil_type: ''
  prep: ''
per_portion:
  energy_kcal: 161.1
  protein_g: 36.0
  fat_g: 1.9
  sat_fat_g: 0.6
  mufa_g: 0.8
  pufa_g: 0.5
  trans_fat_g: null
  cholesterol_mg: 130
  sugar_g: null
  fiber_total_g: 0.0
  fiber_soluble_g: 0.0
  fiber_insoluble_g: 0.0
  sodium_mg: 275
  potassium_mg: 385
  iodine_ug: 1
  magnesium_mg: 36
  calcium_mg: 7
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: null
  manganese_mg: null
  polyols_g: 0.0
  carbs_available_g: 0.0
  carbs_total_g: 0.0
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps:
  - No carbs/fibre provided; trans fat not provided; ~0.09 g of fat unassigned (trace/trans).
notes:
- 'Atwater check (available carb basis): 4×36.0 + 9×1.9 + 4×0.0 + 2×0.0 + 2.4×0.0 = 161.1 kcal'
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed:
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.cholesterol_mg
  - per_portion.sodium_mg
  - per_portion.potassium_mg
  - per_portion.iodine_ug
  - per_portion.magnesium_mg
  - per_portion.calcium_mg
  - per_portion.iron_mg
  - per_portion.zinc_mg
  sources:
  - url: user_input
    note: User-supplied values on 2025-10-28
- timestamp: 2025-10-28T18:57:05+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Consistency fix for fat totals/splits
  fields_changed:
  - per_portion.fat_g
  sources:
  - url: user_input
    note: Correction approved by user on 2025-10-28
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed:
  - per_portion.protein_g
  - per_portion.sat_fat_g
  - per_portion.pufa_g
  - per_portion.iodine_ug
  - per_portion.magnesium_mg
  - per_portion.calcium_mg
  - per_portion.iron_mg
  - per_portion.zinc_mg
  sources:
  - url: formatting-pass
    note: Automated rounding pass
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
  - per_portion.fiber_insoluble_g
  - per_portion.fiber_soluble_g
  - per_portion.fiber_total_g
  - per_portion.polyols_g
  - version
  sources: []
```
