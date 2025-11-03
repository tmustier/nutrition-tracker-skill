## Mafaldine with Tomato, Rosemary, Chickpeas & Parmesan (The Eagle, Farringdon)

```yaml
id: mafaldine_tomato_rosemary_chickpeas_parmesan_eagle_farringdon_v1
version: 3
last_verified: "2025-11-02"
source:
  venue: The Eagle, Farringdon (London)
  menu_page: https://theeaglefarringdon.co.uk/
  evidence:
  - GPT-5 Codex component build based on pasta, tomato sauce, chickpeas, olive oil,
    parmesan
  - Portion sizing inferred from Eagle pasta mains (~380-400g cooked pasta)
  - User dining notes from 2025-11-01 visit
aliases:
- Mafaldine with Tomato & Chickpeas
- Mafaldine Pomodoro e Ceci
- Mafaldine with Rosemary & Parmesan
category: main
portion:
  description: 1 plated serving
  est_weight_g: 645
  notes: Approx. 280g cooked mafaldine + 150g chickpeas + 180g crushed tomatoes +
    garnishes
assumptions:
  salt_scheme: normal (≈0.6g finishing salt)
  oil_type: extra-virgin olive oil
  prep: Mafaldine tossed in tomato-rosemary sauce with chickpeas, finished with olive
    oil and parmesan
per_portion:
  energy_kcal: 1008.2
  protein_g: 39.6
  fat_g: 27.2
  sat_fat_g: 6.3
  mufa_g: 13.8
  pufa_g: 4.5
  trans_fat_g: 0
  cholesterol_mg: 13.6
  sugar_g: 18.5
  fiber_total_g: 19.9
  fiber_soluble_g: 6.3
  fiber_insoluble_g: 13.6
  sodium_mg: 807
  potassium_mg: 1108
  iodine_ug: 0
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 141.3
  carbs_total_g: 161.2
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps:
  - Venue does not publish nutrition info
  - Saturated fat and micronutrients inferred from components
  - Actual salt level varies by chef seasoning
  - Portion weight estimated from typical serving size
notes:
- 'Component breakdown: 280g cooked mafaldine, 150g cooked chickpeas, 180g crushed
  tomatoes, 15g olive oil, 20g parmesan'
- Seasoning assumed to include ≈0.6g finishing salt plus inherent sodium from parmesan
  and canned ingredients
- Higher fiber (≈20g) from chickpeas and pasta supports training-day carb goals
- Fat split reflects olive oil MUFA dominance with moderate saturated fat from parmesan
- "Energy cross-check: 141.3g carbs, 39.6g protein, 27.2g fat → ~957 kcal from macros"
- Suitable for vegetarian diet; contains dairy
- Sodium moderate for a pasta main (~0.8g)
- 'Atwater check (available carb basis): 4×39.6 + 9×27.2 + 4×141.3 + 2×19.9 + 2.4×0.0
  = 1008.2 kcal'
change_log:
- timestamp: 2025-11-01T18:30:00+0000
  updated_by: "LLM: GPT-5 Codex"
  reason: Initial macro-rich estimate for pasta ordered at The Eagle
  fields_changed:
  - all fields
  sources:
  - url: user_request
    note: User considering Mafaldine with Tomato, Rosemary, Chickpeas & Parmesan on
      2025-11-01
  - url: gpt_culinary_estimate
    note: GPT-5 Codex component model with 2g finishing salt assumption
- timestamp: 2025-11-02T10:00:00+0000
  updated_by: "LLM: GPT-5 Codex"
  reason: Aligned macros and sodium with refined portion model from user research
    notes
  fields_changed:
  - version
  - last_verified
  - portion.est_weight_g
  - assumptions.salt_scheme
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.cholesterol_mg
  - per_portion.carbs_g
  - per_portion.sugar_g
  - per_portion.fiber_total_g
  - per_portion.fiber_soluble_g
  - per_portion.fiber_insoluble_g
  - per_portion.sodium_mg
  - per_portion.potassium_mg
  - derived.energy_from_macros_kcal
  - notes
  sources:
  - url: user_provided_best_effort_estimate
    note: Portion and macro breakdown supplied by user on 2025-11-02
- timestamp: "2025-11-02T19:20:00+00:00"
  updated_by: "LLM: GPT-5 Codex"
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed:
  - derived.energy_from_macros_kcal
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
