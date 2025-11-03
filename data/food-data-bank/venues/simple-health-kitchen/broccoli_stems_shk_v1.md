## Broccoli Stems (Simple Health Kitchen)

```yaml
id: broccoli_stems_shk_v1
version: 5
last_verified: '2025-11-02'
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: ''
  evidence: []
aliases: []
category: side
portion:
  description: steamed/roasted broccoli stems
  est_weight_g: null
  notes: no raisins variant; zest optional; normal salt
assumptions:
  salt_scheme: normal
  oil_type: ''
  prep: ''
  fiber_split: 'Estimated using dried fruits category ratio (40% soluble / 60% insoluble) from FIBER-SPLIT-ESTIMATION-REFERENCE.yaml. High sugar (9.4g) and fiber (6.9g) content indicates dried fruit component in addition to broccoli stems: HIGH confidence. Calculation: 6.9g total × 40% = 2.8g soluble, remainder 4.1g insoluble.'
per_portion:
  energy_kcal: 165.7
  protein_g: 5.0
  fat_g: 5.1
  sat_fat_g: 0.6
  mufa_g: 3.6
  pufa_g: 0.9
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 9.4
  fiber_total_g: 6.9
  fiber_soluble_g: 2.8
  fiber_insoluble_g: 4.1
  sodium_mg: 540
  potassium_mg: 630
  iodine_ug: 1
  magnesium_mg: 45
  calcium_mg: 84
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 130
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 21.5
  carbs_total_g: 28.4
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps:
  - No trans fat provided; ~0.52 g of fat unassigned (likely trace/trans/rounding).
notes:
- 'Atwater check (available carb basis): 4×5.0 + 9×5.1 + 4×21.5 + 2×6.9 + 2.4×0.0
  = 165.7 kcal'
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
  - per_portion.mufa_g
  - per_portion.pufa_g
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
  - per_portion.polyols_g
  - version
  sources: []
```
