## Hazelnuts, 30 g

```yaml
id: hazelnuts_30g_v1
version: 5
schema_version: 2
last_verified: "2025-11-05"
source:
  venue: pack/ingredient
  menu_page: ""
  evidence: []
aliases: []
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 30
  notes: raw; unsalted
assumptions:
  salt_scheme: normal
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 207.6
  protein_g: 4.5
  fat_g: 18.2
  sat_fat_g: 1.3
  mufa_g: 14.4
  pufa_g: 2.5
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 1.3
  fiber_total_g: 2.9
  fiber_soluble_g: 0.6
  fiber_insoluble_g: 2.3
  sodium_mg: 1
  potassium_mg: 204
  iodine_ug: 1
  magnesium_mg: 49
  calcium_mg: 34
  iron_mg: 1
  zinc_mg: 1
  copper_mg: 0.5
  vitamin_c_mg: 2
  vitamin_e_mg: 4.5
  manganese_mg: 1.9
  polyols_g: 0.0
  carbs_available_g: 5.0
  carbs_total_g: 7.9
  selenium_ug: 1
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 87
  chloride_mg: 0
  sulfur_g: 0
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_k_ug: 4
  vitamin_b1_mg: 0.2
  vitamin_b2_mg: 0.03
  vitamin_b3_mg: 0.5
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0.2
  vitamin_b7_ug: 0
  vitamin_b9_ug: 34
  vitamin_b12_ug: 0
  choline_mg: 14
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0
  omega6_la_g: 0
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: high
  gaps:
  - MUFA/PUFA profile appears atypical for hazelnuts (expected MUFA >> PUFA); values
    recorded as provided.
  - Vitamin B5 (pantothenic acid) not available in USDA data for this entry.
notes:
- 'Atwater check (available carb basis): 4×4.5 + 9×18.2 + 4×5.0 + 2×2.9 + 2.4×0.0
  = 207.6 kcal'
- 'Hazelnuts are exceptionally rich in vitamin E (4.5 mg per 30g = 30% DV) and copper
  (0.5 mg per 30g = 56% DV), making them one of the top dietary sources of these
  nutrients.'
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
  - per_portion.mufa_g
  - per_portion.pufa_g
  sources:
  - url: user_input
    note: Correction approved by user on 2025-10-28
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed:
  - per_portion.carbs_g
  - per_portion.iron_mg
  - per_portion.zinc_mg
  - per_portion.vitamin_c_mg
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
- timestamp: "2025-11-05T00:00:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Enrich with 17 priority nutrients from USDA FoodData Central (FDC ID 170581)
  fields_changed:
  - version
  - last_verified
  - per_portion.vitamin_d_ug
  - per_portion.choline_mg
  - per_portion.iodine_ug
  - per_portion.vitamin_b9_ug
  - per_portion.vitamin_b12_ug
  - per_portion.phosphorus_mg
  - per_portion.copper_mg
  - per_portion.selenium_ug
  - per_portion.manganese_mg
  - per_portion.vitamin_a_ug
  - per_portion.vitamin_e_mg
  - per_portion.vitamin_k_ug
  - per_portion.vitamin_b1_mg
  - per_portion.vitamin_b2_mg
  - per_portion.vitamin_b3_mg
  - per_portion.vitamin_b6_mg
  - per_portion.omega3_epa_mg
  - per_portion.omega3_dha_mg
  - quality.confidence
  - quality.gaps
  sources:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/170581/nutrients
    note: "USDA FoodData Central - Nuts, hazelnuts or filberts (raw). Values converted from per 100g to per 30g."
```
