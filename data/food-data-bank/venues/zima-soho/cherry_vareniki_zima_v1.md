## Cherry Vareniki - Full Tray (Zima, Soho)

```yaml
id: cherry_vareniki_zima_v1
schema_version: 2
version: 2
last_verified: 2025-11-02
source:
  venue: Zima, Soho, London
  menu_page: 
  evidence:
  - User-provided nutrition data for full tray (~200g)
aliases:
- Cherry dumplings
category: dessert
portion:
  description: full tray
  est_weight_g: 200
  notes: Traditional Ukrainian dumplings filled with cherries; sweet dessert dish
assumptions:
  salt_scheme: light
  oil_type: 
  prep: boiled dumplings with cherry filling
per_portion:
  energy_kcal: 388.2
  protein_g: 9
  fat_g: 5.8
  sat_fat_g: 1
  mufa_g: 2.5
  pufa_g: 2.3
  trans_fat_g: 0.1
  cholesterol_mg: 10
  sugar_g: 14
  fiber_total_g: 4
  fiber_soluble_g: 1
  fiber_insoluble_g: 3
  sodium_mg: 130
  potassium_mg: 200
  iodine_ug: 0
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0
  carbs_available_g: 73
  carbs_total_g: 77
  copper_mg: 0
  selenium_ug: 0
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 0
  chloride_mg: 0
  sulfur_mg: 0
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
  fat_breakdown_sum_g: 5.9
  unsaturated_fat_g: 4.8
quality:
  confidence: medium
  gaps:
  - iodine_ug
  - magnesium_mg
  - calcium_mg
  - iron_mg
  - zinc_mg
  - vitamin_c_mg
  - manganese_mg
notes:
- Full tray approximately 200g
- Sweet dessert dish from Zima restaurant featuring traditional Ukrainian cherry-filled dumplings
- Fat breakdown (sat 1.0g + MUFA 2.5g + PUFA 2.3g + trans 0.1g = 5.9g) matches total fat 5.8g within rounding
- Unsaturated total (MUFA + PUFA) = 4.8g as expected
- Atwater check (available carb basis): 4×9.0 + 9×5.8 + 4×73.0 + 2×4.0 + 2.4×0.0 = 388.2 kcal
change_log:
- timestamp: 2025-10-30 12:00:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Initial creation from user-provided nutrition data for Cherry vareniki from Zima restaurant
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
  per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g, per_portion.cholesterol_mg,
  per_portion.carbs_g, per_portion.sugar_g, per_portion.fiber_total_g, per_portion.fiber_soluble_g,
  per_portion.fiber_insoluble_g, per_portion.sodium_mg, per_portion.potassium_mg,
  portion.est_weight_g]
  sources: [{note: 'User-provided nutrition data for Cherry vareniki from Zima restaurant, Soho,
      London (full tray ~200g)', url: ''}]
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed: [derived.energy_from_macros_kcal, last_verified, notes, per_portion.carbs_available_g,
  per_portion.carbs_g, per_portion.carbs_total_g, per_portion.energy_kcal, per_portion.polyols_g,
  version]
  sources: []
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
```
