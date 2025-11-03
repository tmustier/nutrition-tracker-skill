## Oats - dry (50 g)

```yaml
id: oats_dry_50g_v1
version: 4
last_verified: "2025-11-02"
source:
  venue: pack/ingredient
  menu_page: ""
  evidence: []
aliases: []
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 50
  notes: Dry rolled oats.
assumptions:
  salt_scheme: normal
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 208.9
  protein_g: 8.5
  fat_g: 3.5
  sat_fat_g: 0.6
  mufa_g: 1.1
  pufa_g: 1.3
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 0.5
  fiber_total_g: 5.3
  fiber_soluble_g: 2.0
  fiber_insoluble_g: 3.3
  sodium_mg: 1
  potassium_mg: 215
  iodine_ug: 1
  magnesium_mg: 69
  calcium_mg: 27
  iron_mg: 2
  zinc_mg: 2
  vitamin_c_mg: 0
  manganese_mg: 2
  polyols_g: 0.0
  carbs_available_g: 33.2
  carbs_total_g: 38.5
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: high
  gaps: []
notes:
- 'Atwater check (available carb basis): 4×8.5 + 9×3.5 + 4×33.2 + 2×5.3 + 2.4×0.0
  = 208.9 kcal'
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
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
  - per_portion.iodine_ug
  - per_portion.magnesium_mg
  - per_portion.calcium_mg
  - per_portion.iron_mg
  - per_portion.zinc_mg
  sources:
  - url: user_input
    note: User-supplied values on 2025-10-28
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed:
  - per_portion.potassium_mg
  - per_portion.iron_mg
  sources:
  - url: formatting-pass
    note: Automated rounding pass
- timestamp: 2025-10-28T21:30:00+0000
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Fill in missing fat breakdown and micronutrients from USDA FoodData Central
  fields_changed:
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.trans_fat_g
  - per_portion.cholesterol_mg
  - per_portion.vitamin_c_mg
  sources:
  - url: USDA FoodData Central
    note: 'USDA data for rolled oats: MUFA 2.178g/100g, PUFA 2.535g/100g scaled to
      50g portion. Trans fat 0g, cholesterol 0mg (plant-based), vitamin C 0mg (trace)'
- timestamp: 2025-10-29T00:00:00+0000
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Populate missing fiber split and manganese from USDA nutritional database
  fields_changed:
  - per_portion.fiber_soluble_g
  - per_portion.fiber_insoluble_g
  - per_portion.manganese_mg
  sources:
  - url: USDA FoodData Central
    note: Oat beta-glucan (soluble fiber) ~4g/100g, insoluble ~6g/100g; manganese
      ~3.8mg/100g scaled to 50g portion
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
