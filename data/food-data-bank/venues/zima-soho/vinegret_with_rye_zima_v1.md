## Vinegret with 1 slice rye (Zima)

```yaml
id: vinegret_with_rye_zima_v1
version: 2
last_verified: "2025-11-02"
source:
  venue: Zima, Soho, London
  menu_page: ""
  evidence:
  - User-provided nutrition data for full portion as served
  - Traditional Russian beetroot and vegetable salad with 1 slice rye bread (~32g)
aliases: []
category: main
portion:
  description: restaurant serving with 1 slice rye bread
  est_weight_g: null
  notes: Traditional Russian beetroot and vegetable salad dressed with oil; includes
    1 slice rye bread (~32g)
assumptions:
  salt_scheme: normal
  oil_type: vegetable oil for dressing
  prep: vegetables dressed with oil
per_portion:
  energy_kcal: 233.5
  protein_g: 5.7
  fat_g: 6.1
  sat_fat_g: 1.2
  mufa_g: 2.0
  pufa_g: 3.8
  trans_fat_g: 0.0
  cholesterol_mg: 0
  sugar_g: 7.5
  fiber_total_g: 6.9
  fiber_soluble_g: 3.1
  fiber_insoluble_g: 3.8
  sodium_mg: 493
  potassium_mg: 403
  iodine_ug: 0
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 35.5
  carbs_total_g: 42.4
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: high
  gaps:
  - Fat breakdown (7.0g) slightly exceeds total fat (6.1g) - recorded as provided
  - Micronutrients (iodine, magnesium, calcium, iron, zinc, vitamin C, manganese)
    not provided
notes:
- Includes beetroot, vegetables, and 1 slice rye bread as served
- Plant-based dish, cholesterol correctly 0mg
- 'Atwater check (available carb basis): 4×5.7 + 9×6.1 + 4×35.5 + 2×6.9 + 2.4×0.0
  = 233.5 kcal'
change_log:
- timestamp: 2025-10-30 00:00:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Initial entry from user-provided nutrition data for Zima restaurant dish
  fields_changed:
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
  - per_portion.fiber_soluble_g
  - per_portion.fiber_insoluble_g
  - per_portion.sodium_mg
  - per_portion.potassium_mg
  sources:
  - url: user_input
    note: Complete nutrition data provided by Thomas on 2025-10-30 for Vinegret with
      1 slice rye from Zima, Soho, London
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
