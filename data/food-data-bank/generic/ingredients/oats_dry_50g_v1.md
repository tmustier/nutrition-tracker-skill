## Oats - dry (50 g)

```yaml
id: oats_dry_50g_v1
schema_version: 2
version: 5
last_verified: 2025-11-05
source:
  venue: pack/ingredient
  menu_page: 
  evidence:
aliases:
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 50
  notes: Dry rolled oats.
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: 
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
  fiber_soluble_g: 2
  fiber_insoluble_g: 3.3
  sodium_mg: 1
  potassium_mg: 215
  iodine_ug: 1
  magnesium_mg: 69
  calcium_mg: 27
  iron_mg: 2
  zinc_mg: 2
  vitamin_c_mg: 0
  manganese_mg: 2.5
  polyols_g: 0
  carbs_available_g: 33.2
  carbs_total_g: 38.5
  copper_mg: 0.3
  selenium_ug: 14
  chromium_ug: 7
  molybdenum_ug: 80
  phosphorus_mg: 262
  chloride_mg: 0
  sulfur_mg: 0
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0.2
  vitamin_k_ug: 1
  vitamin_b1_mg: 0.4
  vitamin_b2_mg: 0.1
  vitamin_b3_mg: 0.5
  vitamin_b5_mg: 0.67
  vitamin_b6_mg: 0.1
  vitamin_b7_ug: 10
  vitamin_b9_ug: 28
  vitamin_b12_ug: 0
  choline_mg: 20
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.06
  omega6_la_g: 1.2
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
- Atwater check (available carb basis): 4×8.5 + 9×3.5 + 4×33.2 + 2×5.3 + 2.4×0.0 = 208.9 kcal
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
  per_portion.carbs_g, per_portion.sugar_g, per_portion.fiber_total_g, per_portion.sodium_mg,
  per_portion.potassium_mg, per_portion.iodine_ug, per_portion.magnesium_mg, per_portion.calcium_mg,
  per_portion.iron_mg, per_portion.zinc_mg]
  sources: [{note: User-supplied values on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed: [per_portion.potassium_mg, per_portion.iron_mg]
  sources: [{note: Automated rounding pass, url: formatting-pass}]
- timestamp: 2025-10-28T21:30:00+0000
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Fill in missing fat breakdown and micronutrients from USDA FoodData Central
  fields_changed: [per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g, per_portion.cholesterol_mg,
  per_portion.vitamin_c_mg]
  sources: [{note: 'USDA data for rolled oats: MUFA 2.178g/100g, PUFA 2.535g/100g scaled to 50g
      portion. Trans fat 0g, cholesterol 0mg (plant-based), vitamin C 0mg (trace)',
    url: USDA FoodData Central}]
- timestamp: 2025-10-29T00:00:00+0000
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Populate missing fiber split and manganese from USDA nutritional database
  fields_changed: [per_portion.fiber_soluble_g, per_portion.fiber_insoluble_g, per_portion.manganese_mg]
  sources: [{note: 'Oat beta-glucan (soluble fiber) ~4g/100g, insoluble ~6g/100g; manganese ~3.8mg/100g
      scaled to 50g portion', url: USDA FoodData Central}]
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
- timestamp: '2025-11-05T12:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Enrich with 17 priority nutrients from USDA FoodData Central (FDC IDs 2346396, 169705, SR Legacy)
  fields_changed: [per_portion.vitamin_d_ug, per_portion.choline_mg, per_portion.vitamin_b9_ug, per_portion.vitamin_b12_ug,
  per_portion.phosphorus_mg, per_portion.copper_mg, per_portion.selenium_ug, per_portion.manganese_mg,
  per_portion.vitamin_a_ug, per_portion.vitamin_e_mg, per_portion.vitamin_k_ug, per_portion.vitamin_b1_mg,
  per_portion.vitamin_b2_mg, per_portion.vitamin_b3_mg, per_portion.vitamin_b6_mg, per_portion.omega3_epa_mg,
  per_portion.omega3_dha_mg, last_verified, version]
  sources: [{note: 'USDA FoodData Central: rolled oats, whole grain, raw. Per 100g values: B1 0.76mg,
  B2 0.14mg, B3 0.96mg, B6 0.12mg, B9 56µg, B12 0µg (plant-based), phosphorus 523mg, copper 0.63mg,
  selenium 28.9µg, manganese 4.9mg, vitamin E 0.425mg, vitamin K 2.0µg, choline 40.4mg.
  Vitamins A, D naturally absent in oats. EPA/DHA 0mg (plant-based, oats contain ALA not EPA/DHA).
  All values scaled to 50g portion.', url: 'USDA FoodData Central (fdc.nal.usda.gov), nutritionvalue.org, foodstruct.com, nutrivore.com'}]
- timestamp: '2025-11-05T17:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Enrich with 6 additional nutrients from USDA FoodData Central and research literature
  fields_changed: [per_portion.vitamin_b5_mg, per_portion.vitamin_b7_ug, per_portion.chromium_ug,
    per_portion.molybdenum_ug, per_portion.omega3_ala_g, per_portion.omega6_la_g, version]
  sources: [{note: 'USDA FoodData Central per 100g: B5 (pantothenic acid) 1.348mg, chromium ~14µg, molybdenum 160µg, 18:3 n-3 ALA 0.111g, 18:2 n-6 LA 2.424g. Biotin 20µg from research literature (USDA does not track biotin comprehensively). All values scaled to 50g portion: B5 0.67mg, B7 10µg, chromium 7µg, molybdenum 80µg, ALA 0.06g, LA 1.2g.', url: 'USDA FoodData Central (nutritionvalue.org), biotin research literature'}]
```
