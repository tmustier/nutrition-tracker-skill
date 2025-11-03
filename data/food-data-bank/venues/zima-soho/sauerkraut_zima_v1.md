## Pickled Cabbage / Sauerkraut (Zima)

```yaml
id: sauerkraut_zima_v1
version: 2
last_verified: "2025-11-02"
source:
  venue: Zima, Soho, London
  menu_page: ""
  evidence:
  - User-provided nutrition data for full portion (~180g)
  - Traditional fermented cabbage dish, high sodium from brine
aliases:
- Pickled Cabbage
- Sauerkraut
category: side
portion:
  description: restaurant side portion
  est_weight_g: 180
  notes: fermented cabbage in brine; very high sodium content typical of pickled vegetables
assumptions:
  salt_scheme: heavy
  oil_type: none
  prep: traditional fermentation in salted brine
per_portion:
  energy_kcal: 48.4
  protein_g: 1.6
  fat_g: 0.2
  sat_fat_g: 0.1
  mufa_g: 0.1
  pufa_g: 0.1
  trans_fat_g: 0.0
  cholesterol_mg: 0
  sugar_g: 3.0
  fiber_total_g: 4.5
  fiber_soluble_g: 0.9
  fiber_insoluble_g: 3.6
  sodium_mg: 1080
  potassium_mg: 306
  iodine_ug: 0
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 7.8
  carbs_total_g: 12.3
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps:
  - Fat breakdown (0.3g = 0.1 sat + 0.1 MUFA + 0.1 PUFA) exceeds stated total_fat
    (0.2g); using values as provided
  - 'Missing micronutrients: calcium, magnesium, iron, zinc, vitamin C (fermented
    vegetables typically contain these)'
notes:
- High sodium (1080mg) typical of fermented/pickled vegetables in brine
- Good fiber content (4.5g) with 0.9g soluble, 3.6g insoluble
- Low calorie density (40 kcal per 180g portion)
- 'Atwater check (available carb basis): 4×1.6 + 9×0.2 + 4×7.8 + 2×4.5 + 2.4×0.0 =
  48.4 kcal'
change_log:
- timestamp: 2025-10-30 12:00:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Initial population from user-provided nutrition data for Zima restaurant
    dish
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
  - portion.est_weight_g
  sources:
  - url: user_input
    note: User-supplied nutrition data for Zima pickled cabbage on 2025-10-30
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
