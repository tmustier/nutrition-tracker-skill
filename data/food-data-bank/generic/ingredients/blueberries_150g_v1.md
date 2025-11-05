## Blueberries - 150 g

```yaml
id: blueberries_150g_v1
schema_version: 2
version: 4
last_verified: 2025-11-02
source:
  venue: pack/ingredient
  menu_page: 
  evidence:
aliases:
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 150
  notes: Fresh blueberries.
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: 
per_portion:
  energy_kcal: 102
  protein_g: 1
  fat_g: 0.4
  sat_fat_g: 0.04
  mufa_g: 0.07
  pufa_g: 0.22
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 15
  fiber_total_g: 3.6
  fiber_soluble_g: 1.3
  fiber_insoluble_g: 2.3
  sodium_mg: 2
  potassium_mg: 116
  iodine_ug: 0.5
  magnesium_mg: 9
  calcium_mg: 9
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 15
  manganese_mg: 0
  polyols_g: 0
  carbs_available_g: 21.8
  carbs_total_g: 25.4
  copper_mg: 0
  selenium_ug: 0
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 0
  chloride_mg: 0
  sulfur_g: 0
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0
  vitamin_b2_mg: 0
  vitamin_b3_mg: 0
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0
  vitamin_b7_ug: 0
  vitamin_b9_ug: 0
  vitamin_b12_ug: 0
  choline_mg: 0
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0
  omega6_la_g: 0
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps:
notes:
- Atwater check (available carb basis): 4×1.0 + 9×0.4 + 4×21.8 + 2×3.6 + 2.4×0.0 = 102 kcal
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.carbs_g,
  per_portion.sugar_g, per_portion.fiber_total_g, per_portion.sodium_mg, per_portion.potassium_mg,
  per_portion.magnesium_mg, per_portion.calcium_mg, per_portion.iron_mg, per_portion.zinc_mg,
  per_portion.vitamin_c_mg]
  sources: [{note: User-supplied values on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.sugar_g, per_portion.sodium_mg,
  per_portion.potassium_mg, per_portion.iron_mg, per_portion.zinc_mg, per_portion.vitamin_c_mg]
  sources: [{note: Automated rounding pass, url: formatting-pass}]
- timestamp: 2025-10-28T20:15:00+0000
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Research and populate missing fatty acid breakdown and iodine content from USDA FoodData Central
  fields_changed: [per_portion.sat_fat_g, per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g,
  per_portion.cholesterol_mg, per_portion.iodine_ug]
  sources: [{note: 'USDA FoodData Central - Raw blueberries (NDB 09050 / FDC 171711). Per 100g:
      sat 0.028g, MUFA 0.047g, PUFA 0.146g, trans 0g, cholesterol 0mg. Scaled to 150g
      portion.', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/171711/nutrients'},
  {note: 'USDA/FDA/ODS-NIH Iodine Database - Raw blueberries contain 0.3 mcg iodine
      per 100g (mean of 13 samples). Scaled to 150g = 0.45 mcg, rounded to 0.5 mcg.',
    url: 'https://www.ars.usda.gov/ARSUSERFILES/80400535/DATA/IODINE/IODINE_DATABASE_RELEASE_3_PER_100G.PDF'}]
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed: [last_verified, notes, per_portion.carbs_available_g, per_portion.carbs_g, per_portion.carbs_total_g,
  per_portion.energy_kcal, per_portion.polyols_g, version]
  sources: []
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
```
