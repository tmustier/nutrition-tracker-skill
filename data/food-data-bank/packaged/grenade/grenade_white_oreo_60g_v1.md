## Grenade Carb Killa White Oreo Bar (60g)

```yaml
id: grenade_white_oreo_60g_v1
version: 2
last_verified: '2025-11-02'
source:
  venue: Grenade (Packaged Product)
  menu_page: ''
  evidence:
  - Grenade official nutrition data
  - Multiple UK retailer listings
aliases:
- Carb Killa White Oreo
category: ingredient
portion:
  description: 1 protein bar
  est_weight_g: 60
  notes: High protein bar with white chocolate coating and Oreo pieces
assumptions:
  salt_scheme: normal
  oil_type: ''
  prep: packaged product
per_portion:
  energy_kcal: 296.6
  protein_g: 21.0
  fat_g: 10.0
  sat_fat_g: 5.7
  mufa_g: 2.0
  pufa_g: 2.3
  trans_fat_g: 0.0
  cholesterol_mg: 10
  sugar_g: 1.3
  fiber_total_g: 0.9
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 180
  potassium_mg: null
  iodine_ug: null
  magnesium_mg: null
  calcium_mg: null
  iron_mg: null
  zinc_mg: null
  vitamin_c_mg: null
  manganese_mg: null
  polyols_g: 17.0
  carbs_available_g: 20.0
  carbs_total_g: 37.9
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: high
  gaps:
  - MUFA/PUFA estimated from total unsaturated fat
  - Micronutrients not provided on label
  - Contains sugar alcohols (17g polyols not included in main carb count)
notes:
- Contains 17g sugar alcohols/polyols (maltitol) not included in carb count
- 'Fat split estimated: remaining 4.3g unsaturated divided into MUFA/PUFA based on
  typical protein bar composition'
- Sodium estimated from typical Grenade bar range (0.45g salt = ~180mg sodium)
- 'Atwater check (available carb basis): 4×21.0 + 9×10.0 + 4×20.0 + 2×0.9 + 2.4×17.0
  = 296.6 kcal'
change_log:
- timestamp: 2025-10-30T00:00:00+0000
  updated_by: Claude Code
  reason: Initial entry for Thomas's food diary tracking
  fields_changed:
  - all fields
  sources:
  - url: https://www.healthyplanetcanada.com/grenade-high-protein-bar-oreo-60g.html
    note: Grenade White Oreo bar nutrition facts
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
- timestamp: '2025-11-02T22:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Correct polyol data to match notes - was incorrectly set to 0.0 instead of 17.0g
  fields_changed:
  - per_portion.polyols_g
  - per_portion.carbs_total_g
  - per_portion.energy_kcal
  - notes
  sources: []
```
