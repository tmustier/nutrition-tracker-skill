## Sunflower Seeds, 30 g

```yaml
id: sunflower_seeds_30g_v1
version: 3
last_verified: '2025-11-02'
source:
  venue: pack/ingredient
  menu_page: ''
  evidence: []
aliases: []
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 30
  notes: hulled; unsalted
assumptions:
  salt_scheme: normal
  oil_type: ''
  prep: ''
per_portion:
  energy_kcal: 193.5
  protein_g: 6.2
  fat_g: 15.5
  sat_fat_g: 1.4
  mufa_g: 3.0
  pufa_g: 10.9
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 0.8
  fiber_total_g: 2.6
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 3
  potassium_mg: 194
  iodine_ug: 0
  magnesium_mg: 98
  calcium_mg: 23
  iron_mg: 2
  zinc_mg: 2
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 6.0
  carbs_total_g: 8.6
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: high
  gaps: []
notes:
- 'Atwater check (available carb basis): 4×6.2 + 9×15.5 + 4×6.0 + 2×2.6 + 2.4×0.0
  = 193.5 kcal'
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
  sources:
  - url: user_input
    note: User-supplied values on 2025-10-28
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed:
  - per_portion.mufa_g
  - per_portion.carbs_g
  - per_portion.iron_mg
  - per_portion.zinc_mg
  - per_portion.vitamin_c_mg
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
  - per_portion.polyols_g
  - version
  sources: []
```
