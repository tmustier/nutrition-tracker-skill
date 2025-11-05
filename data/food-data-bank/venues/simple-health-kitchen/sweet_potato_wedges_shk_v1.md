## Sweet Potato Wedges (Simple Health Kitchen)

```yaml
id: sweet_potato_wedges_shk_v1
schema_version: 2
version: 6
last_verified: 2025-11-05
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: 
  evidence:
aliases:
category: side
portion:
  description: restaurant side serving
  est_weight_g:
  notes: skin-on wedges; roasted; normal salt
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: 
per_portion:
  energy_kcal: 163.3
  protein_g: 2
  fat_g: 1.9
  sat_fat_g: 1
  mufa_g: 0.5
  pufa_g: 0.4
  trans_fat_g: 0.1
  cholesterol_mg: 0
  sugar_g: 10.1
  fiber_total_g: 5.1
  fiber_soluble_g: 1.4
  fiber_insoluble_g: 3.7
  sodium_mg: 350
  potassium_mg: 734
  iodine_ug: 2
  magnesium_mg: 42
  calcium_mg: 59
  iron_mg: 1
  zinc_mg: 0
  vitamin_c_mg: 30
  manganese_mg: 0.9
  polyols_g: 0
  carbs_available_g: 32
  carbs_total_g: 37.1
  copper_mg: 0.3
  selenium_ug: 0
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 98
  chloride_mg: 0
  sulfur_g: 0
  vitamin_a_ug: 1744
  vitamin_d_ug: 0
  vitamin_e_mg: 1.3
  vitamin_k_ug: 4
  vitamin_b1_mg: 0.2
  vitamin_b2_mg: 0.2
  vitamin_b3_mg: 2.7
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0.5
  vitamin_b7_ug: 0
  vitamin_b9_ug: 11
  vitamin_b12_ug: 0
  choline_mg: 24
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
  confidence: low
  gaps:
  - Fat breakdown (1.94 g) exceeds total_fat (1.0 g); keep as provided and flag inconsistency.
notes:
- Atwater check (available carb basis): 4×2.0 + 9×1.9 + 4×32.0 + 2×5.1 + 2.4×0.0 = 163.3 kcal
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
  per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g, per_portion.carbs_g,
  per_portion.sugar_g, per_portion.fiber_total_g, per_portion.sodium_mg, per_portion.potassium_mg,
  per_portion.iodine_ug, per_portion.magnesium_mg, per_portion.calcium_mg, per_portion.iron_mg,
  per_portion.zinc_mg, per_portion.vitamin_c_mg]
  sources: [{note: User-supplied values on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T18:57:05+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Consistency fix for fat totals/splits
  fields_changed: [per_portion.fat_g]
  sources: [{note: Correction approved by user on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed: [per_portion.protein_g, per_portion.sat_fat_g, per_portion.pufa_g, per_portion.trans_fat_g,
  per_portion.carbs_g, per_portion.sugar_g, per_portion.iodine_ug, per_portion.iron_mg,
  per_portion.zinc_mg, per_portion.vitamin_c_mg]
  sources: [{note: Automated rounding pass, url: formatting-pass}]
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
- timestamp: '2025-11-05T15:30:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: 'Enriched 17 priority nutrients using USDA FoodData Central (FDC 168483: Sweet potato, cooked, baked in skin, flesh, without salt)'
  fields_changed: [version, last_verified, per_portion.vitamin_a_ug, per_portion.vitamin_e_mg, per_portion.vitamin_k_ug, per_portion.vitamin_b1_mg, per_portion.vitamin_b2_mg, per_portion.vitamin_b3_mg, per_portion.vitamin_b6_mg, per_portion.vitamin_b9_ug, per_portion.choline_mg, per_portion.phosphorus_mg, per_portion.copper_mg, per_portion.manganese_mg]
  sources: [{note: 'USDA FoodData Central FDC ID 168483, scaled from 100g to 181g portion (1.814x factor based on energy match: 163.3 kcal ÷ 90 kcal/100g)', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/168483/nutrients'}]
  notes: 'Vitamin A is exceptionally high (1744 mcg RAE) as expected for sweet potatoes. Selenium (0.4 mcg scaled) rounds to 0. Iodine unchanged (not in USDA dataset). Vitamin D, B12, EPA, DHA remain 0 (plant source). Portion calculation assumes ~181g baked sweet potato with minimal added oil for roasting.'
```
