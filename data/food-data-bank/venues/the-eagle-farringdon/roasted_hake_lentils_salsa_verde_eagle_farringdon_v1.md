## Roasted Hake with Lentils & Salsa Verde (The Eagle, Farringdon)

```yaml
id: roasted_hake_lentils_salsa_verde_eagle_farringdon_v1
schema_version: 2
version: 3
last_verified: 2025-11-02
source:
  venue: The Eagle, Farringdon (London)
  menu_page: "https://theeaglefarringdon.co.uk/"
  evidence:
  - GPT-5 Codex component build using hake fillet, puy lentils, salsa verde
  - Portion inference from Eagle roasted fish mains (~150g cooked fish)
  - User dining notes from 2025-11-01 visit
aliases:
- Roasted Hake with Lentils
- Hake & Lentils with Salsa Verde
category: main
portion:
  description: 1 plated serving
  est_weight_g: 375
  notes: Approx. 170g cooked hake, 180g cooked lentils, 25g salsa verde
assumptions:
  salt_scheme: normal
  oil_type: extra-virgin olive oil
  prep: Pan-roasted hake over braised lentils with herb/anchovy salsa verde
per_portion:
  energy_kcal: 591.7
  protein_g: 56.5
  fat_g: 21.1
  sat_fat_g: 3
  mufa_g: 11.1
  pufa_g: 1.9
  trans_fat_g: 0
  cholesterol_mg: 54.4
  sugar_g: 3.3
  fiber_total_g: 14.5
  fiber_soluble_g: 1.8
  fiber_insoluble_g: 12.8
  sodium_mg: 1015
  potassium_mg: 668
  iodine_ug: 0
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0
  carbs_available_g: 36.7
  carbs_total_g: 51.2
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
quality:
  confidence: medium
  gaps:
  - Venue does not publish nutrition info
  - Fat profile estimated from olive oil + fish
  - Micronutrients not fully modelled
  - Anchovy quantity varies by chef
notes:
- Component breakdown: 170g cooked hake, 180g cooked lentils, 15g olive oil in salsa verde, 8g anchovy, 10g capers
- Anchovy/caper salsa modeled at ~25g, providing majority of sodium
- High-protein option (56.5g ≈33% of 170g target) with modest calories
- Fiber dominated by lentils (soluble ≈1.8g, insoluble ≈12.8g)
- Energy cross-check: 36.7g carbs, 56.5g protein, 21.1g fat → ~563 kcal (rounds to 553 kcal after ingredient rounding)
- Contains fish and anchovies (allergens: fish)
- Atwater check (available carb basis): 4×56.5 + 9×21.1 + 4×36.7 + 2×14.5 + 2.4×0.0 = 591.7 kcal
change_log:
- timestamp: 2025-11-01T18:32:00+0000
  updated_by: 'LLM: GPT-5 Codex'
  reason: Initial estimate for roasted hake main at The Eagle
  fields_changed: [all fields]
  sources: [{note: User considering Roasted Hake with Lentils & Salsa Verde on 2025-11-01, url: user_request},
  {note: 'GPT-5 Codex component model using 150g cooked hake, 180g lentils, 25g olive
      oil', url: gpt_culinary_estimate}]
- timestamp: 2025-11-02T10:00:00+0000
  updated_by: 'LLM: GPT-5 Codex'
  reason: Synced dish macros with refined user portion model including anchovy/caper sodium
  fields_changed: [version, last_verified, portion.est_weight_g, per_portion.energy_kcal, per_portion.protein_g,
  per_portion.fat_g, per_portion.sat_fat_g, per_portion.mufa_g, per_portion.pufa_g,
  per_portion.cholesterol_mg, per_portion.carbs_g, per_portion.sugar_g, per_portion.fiber_total_g,
  per_portion.fiber_soluble_g, per_portion.fiber_insoluble_g, per_portion.sodium_mg,
  per_portion.potassium_mg, notes]
  sources: [{note: Detailed macro table shared by user on 2025-11-02, url: user_provided_best_effort_estimate}]
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
