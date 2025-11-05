## Pistachios, 30 g

```yaml
id: pistachios_30g_v1
schema_version: 2
version: 3
last_verified: 2025-11-02
source:
  venue: pack/ingredient
  menu_page: 
  evidence:
aliases:
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 30
  notes: shelled; unsalted
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: 
  manganese: "Estimated from USDA data for tree nuts (~2.3 mg/100g). 30g × 2.3 mg/100g = 0.69 mg. Confidence: HIGH - nuts are excellent manganese source"
per_portion:
  energy_kcal: 185.5
  protein_g: 6
  fat_g: 13.5
  sat_fat_g: 1.7
  mufa_g: 7
  pufa_g: 4.3
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 2.3
  fiber_total_g: 3.2
  fiber_soluble_g: 0.6
  fiber_insoluble_g: 2.6
  sodium_mg: 1
  potassium_mg: 308
  iodine_ug: 0
  magnesium_mg: 36
  calcium_mg: 30
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 0
  manganese_mg: 0.69
  polyols_g: 0
  carbs_available_g: 8.4
  carbs_total_g: 11.6
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
- Atwater check (available carb basis): 4×6.0 + 9×13.5 + 4×8.4 + 2×3.2 + 2.4×0.0 = 185.5 kcal
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
  per_portion.mufa_g, per_portion.pufa_g, per_portion.carbs_g, per_portion.sugar_g,
  per_portion.fiber_total_g, per_portion.sodium_mg, per_portion.potassium_mg, per_portion.magnesium_mg,
  per_portion.calcium_mg, per_portion.iron_mg, per_portion.zinc_mg]
  sources: [{note: User-supplied values on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed: [per_portion.protein_g, per_portion.mufa_g, per_portion.potassium_mg, per_portion.magnesium_mg,
  per_portion.iron_mg, per_portion.zinc_mg]
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
```
