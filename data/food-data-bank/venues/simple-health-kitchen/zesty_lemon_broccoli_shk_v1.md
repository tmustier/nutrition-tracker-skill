## Zesty Lemon Broccoli (Simple Health Kitchen)

```yaml
id: zesty_lemon_broccoli_shk_v1
version: 5
last_verified: "2025-11-02"
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: ""
  evidence: []
aliases: []
category: side
portion:
  description: broccoli with lemon zest/juice
  est_weight_g: null
  notes: light dressing; normal salt
assumptions:
  salt_scheme: normal
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 109.3
  protein_g: 4.5
  fat_g: 4.7
  sat_fat_g: 0.8
  mufa_g: 3.2
  pufa_g: 0.8
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 2.7
  fiber_total_g: 3.5
  fiber_soluble_g: 1.1
  fiber_insoluble_g: 2.4
  sodium_mg: 150
  potassium_mg: 556
  iodine_ug: 1
  magnesium_mg: 40
  calcium_mg: 76
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 123
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 10.5
  carbs_total_g: 14.0
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps:
  - No trans fat provided; ~0.49 g of fat unassigned (trace/trans/rounding).
notes:
- 'Atwater check (available carb basis): 4×4.5 + 9×4.7 + 4×10.5 + 2×3.5 + 2.4×0.0
  = 109.3 kcal'
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
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
  - per_portion.iodine_ug
  - per_portion.magnesium_mg
  - per_portion.calcium_mg
  - per_portion.iron_mg
  - per_portion.zinc_mg
  - per_portion.vitamin_c_mg
  sources:
  - url: user_input
    note: User-supplied values on 2025-10-28
- timestamp: 2025-10-28T18:57:05+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: Consistency fix for fat totals/splits
  fields_changed:
  - per_portion.fat_g
  sources:
  - url: user_input
    note: Correction approved by user on 2025-10-28
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed:
  - per_portion.sat_fat_g
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.iodine_ug
  - per_portion.magnesium_mg
  - per_portion.calcium_mg
  - per_portion.iron_mg
  - per_portion.zinc_mg
  sources:
  - url: formatting-pass
    note: Automated rounding pass
- timestamp: "2025-11-02T19:20:00+00:00"
  updated_by: "LLM: GPT-5 Codex"
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
