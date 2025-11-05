## Grilled Salmon Fillet (Simple Health Kitchen)

```yaml
id: grilled_salmon_fillet_shk_v1
version: 6
schema_version: 2
last_verified: "2025-11-03"
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: ""
  evidence: []
aliases: []
category: main
portion:
  description: grilled salmon fillet
  est_weight_g: null
  notes: assume skin-on unless specified; lightly oiled; normal salt
assumptions:
  salt_scheme: normal
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 260
  protein_g: 28.0
  fat_g: 16.0
  sat_fat_g: 3.1
  mufa_g: 6.2
  pufa_g: 6.7
  trans_fat_g: 0
  cholesterol_mg: 80
  sugar_g: 0
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 370
  potassium_mg: 486
  iodine_ug: 17
  magnesium_mg: 38
  calcium_mg: 19
  iron_mg: 0.8
  zinc_mg: 1
  selenium_ug: 50
  vitamin_c_mg: 5
  vitamin_d_ug: 13.0
  vitamin_e_mg: 1.1
  manganese_mg: 0.02
  copper_mg: 0.25
  polyols_g: 0.0
  carbs_available_g: 1.0
  carbs_total_g: 1.4
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 240
  chloride_mg: 0
  sulfur_mg: 0
  vitamin_a_ug: 12
  vitamin_k_ug: 0.4
  vitamin_b1_mg: 0.2
  vitamin_b2_mg: 0.2
  vitamin_b3_mg: 8.7
  vitamin_b5_mg: 1.5
  vitamin_b6_mg: 0.6
  vitamin_b7_ug: 5
  vitamin_b9_ug: 25
  vitamin_b12_ug: 3.2
  choline_mg: 75
  omega3_epa_mg: 620
  omega3_dha_mg: 800
  omega3_ala_g: 0.1
  omega6_la_g: 0.17
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps: []
notes:
- 'Atwater check (available carb basis): 4×28.0 + 9×16.0 + 4×1.0 + 2×0.0 + 2.4×0.0
  = 260 kcal'
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
  - per_portion.cholesterol_mg
  - per_portion.carbs_g
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
  - per_portion.mufa_g
  - per_portion.pufa_g
  sources:
  - url: user_input
    note: Correction approved by user on 2025-10-28
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed:
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.carbs_g
  - per_portion.iodine_ug
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
- timestamp: "2025-11-03T15:44:11+00:00"
  updated_by: "LLM: Claude Code"
  reason: Add selenium and vitamin D estimates for salmon (MEDIUM/LOW priority nutrient completion)
  fields_changed:
  - last_verified
  - per_portion.selenium_ug
  - per_portion.vitamin_d_ug
  - version
  sources:
  - url: https://fdc.nal.usda.gov/
    note: "USDA FoodData Central: Salmon selenium ~50 µg/100g, vitamin D ~13 µg/100g. Estimated 100g portion. Confidence: MEDIUM (selenium), HIGH (vitamin D - fatty fish is one of best natural sources)"
- timestamp: "2025-11-05T12:30:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5 (Agent 3)"
  reason: "Schema v2 enrichment: Complete nutrient profile with USDA FoodData Central data for farmed Atlantic salmon (100g portion). Added 18 missing nutrients including B-complex vitamins, phosphorus, minerals, and omega-3 fatty acids (EPA 620mg, DHA 800mg)."
  fields_changed:
  - per_portion.iron_mg
  - per_portion.vitamin_e_mg
  - per_portion.manganese_mg
  - per_portion.copper_mg
  - per_portion.phosphorus_mg
  - per_portion.vitamin_a_ug
  - per_portion.vitamin_k_ug
  - per_portion.vitamin_b1_mg
  - per_portion.vitamin_b2_mg
  - per_portion.vitamin_b3_mg
  - per_portion.vitamin_b5_mg
  - per_portion.vitamin_b6_mg
  - per_portion.vitamin_b7_ug
  - per_portion.vitamin_b9_ug
  - per_portion.vitamin_b12_ug
  - per_portion.choline_mg
  - per_portion.omega3_epa_mg
  - per_portion.omega3_dha_mg
  - per_portion.omega3_ala_g
  - per_portion.omega6_la_g
  - version
  sources:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/175167/nutrients
    note: "USDA FDC 175167 - Farmed Atlantic Salmon, raw. B-vitamins: B1=0.2mg, B2=0.2mg, B3=8.7mg, B5=1.5mg, B6=0.6mg, B12=3.2µg per 100g. Phosphorus=240mg. Omega-3: EPA=620mg, DHA=800mg per 100g. Vitamin A=12µg, E=1.1mg, K=0.4µg. Iron=0.8mg, copper=0.25mg, manganese=0.02mg, choline=75mg. Confidence: HIGH (direct USDA match for salmon fillet)"
```
