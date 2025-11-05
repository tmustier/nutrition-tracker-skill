## ON Gold Standard Whey – Double Rich Chocolate (1 scoop ≈30 g)

```yaml
id: on_whey_drc_30g_v1
schema_version: 2
version: 4
last_verified: 2025-11-03
source:
  venue: Optimum Nutrition (pack/ingredient)
  menu_page: 
  evidence:
aliases:
category: ingredient
portion:
  description: scoop (~30 g)
  est_weight_g: 30
  notes: Ranges provided; midpoints used where sensible; iron omitted due to likely error.
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: 
per_portion:
  energy_kcal: 122
  protein_g: 24
  fat_g: 1.4
  sat_fat_g: 0.5
  mufa_g: 0.5
  pufa_g: 0.4
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 1.3
  fiber_total_g: 0.7
  fiber_soluble_g: 0.2
  fiber_insoluble_g: 0.5
  sodium_mg: 86
  potassium_mg: 177
  iodine_ug: 18
  magnesium_mg: 52
  calcium_mg: 130
  iron_mg: 0
  zinc_mg: 2
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0
  carbs_available_g: 3
  carbs_total_g: 3.7
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
  confidence: low
  gaps:
  - Original data were ranges; iron value inconsistent (0.6–126 mg).
notes:
- Atwater check (available carb basis): 4×24.0 + 9×1.4 + 4×3.0 + 2×0.7 + 2.4×0.0 = 122 kcal
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
  per_portion.mufa_g, per_portion.pufa_g, per_portion.carbs_g, per_portion.sugar_g,
  per_portion.fiber_total_g, per_portion.sodium_mg, per_portion.potassium_mg, per_portion.iodine_ug,
  per_portion.magnesium_mg, per_portion.calcium_mg, per_portion.zinc_mg]
  sources: [{note: User-supplied values on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed: [per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g, per_portion.pufa_g,
  per_portion.carbs_g, per_portion.sugar_g, per_portion.fiber_total_g, per_portion.zinc_mg]
  sources: [{note: Automated rounding pass, url: formatting-pass}]
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed: [last_verified, notes, per_portion.carbs_available_g, per_portion.carbs_g, per_portion.carbs_total_g,
  per_portion.energy_kcal, per_portion.polyols_g, version]
  sources: []
- timestamp: '2025-11-03T00:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Phase 2 nutrient estimation - fiber split for protein powder
  fields_changed: [per_portion.fiber_soluble_g, per_portion.fiber_insoluble_g, last_verified, version]
  sources: [{note: 'Used general_plant_foods default ratio (30% soluble, 70% insoluble, LOW confidence)',
    url: fiber_split_estimation}]
  methodology: "Applied general plant foods fiber split ratio to total fiber 0.7g: soluble = 0.7\
  \ \xD7 0.30 = 0.2g, insoluble = 0.7 \xD7 0.70 = 0.5g. Low confidence estimate appropriate\
  \ for processed protein powder where fiber source (likely cocoa powder or added\
  \ fiber) composition is unknown. Conservative general ratio used due to lack of\
  \ specific ingredient data."
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
```
