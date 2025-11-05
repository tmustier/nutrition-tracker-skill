## Orange 'Jaffa Cake' Slice with Crème Fraîche (The Eagle, Farringdon)

```yaml
id: orange_jaffa_cake_slice_creme_fraiche_eagle_farringdon_v1
schema_version: 2
version: 3
last_verified: 2025-11-02
source:
  venue: The Eagle, Farringdon (London)
  menu_page: "https://theeaglefarringdon.co.uk/"
  evidence:
  - Venue dessert board observed 2025-11-01
  - Component estimate for sponge cake with orange jelly, dark chocolate glaze, and crème fraîche
  - GPT-5 Pro refined portion estimate logged 2025-11-01 14:13
aliases:
- Orange Jaffa Cake with Crème Fraîche
category: dessert
portion:
  description: 1 plated slice with crème fraîche
  est_weight_g: 170
  notes: Approx. 140g orange sponge slice with orange jelly & chocolate glaze plus 30g crème fraîche
assumptions:
  salt_scheme: light
  oil_type: butter
  prep: Citrus sponge layered with orange jelly, dipped in dark chocolate and served with a dollop of crème fraîche
per_portion:
  energy_kcal: 630.2
  protein_g: 7
  fat_g: 37
  sat_fat_g: 17
  mufa_g: 12
  pufa_g: 2.3
  trans_fat_g: 0.3
  cholesterol_mg: 126
  sugar_g: 46
  fiber_total_g: 2.6
  fiber_soluble_g: 0.6
  fiber_insoluble_g: 2
  sodium_mg: 385
  potassium_mg: 255
  iodine_ug: 0
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0
  carbs_available_g: 66
  carbs_total_g: 68.6
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
  confidence: medium
  gaps:
  - Slice size varies depending on cake pan
  - Chocolate thickness inferred from similar desserts
  - Micronutrient profile not detailed
notes:
- Component breakdown: ~140g orange sponge with jelly and chocolate glaze plus 30g full-fat crème fraîche (~170g plate)
- Sugar load concentrated in sponge syrup and orange jelly
- Fat split reflects butter + crème fraîche saturated fat with cocoa butter MUFA
- Energy cross-check: 66g carbs, 7.0g protein, 37.0g fat → ≈630 kcal
- Contains gluten, egg, dairy
- Atwater check (available carb basis): 4×7.0 + 9×37.0 + 4×66.0 + 2×2.6 + 2.4×0.0 = 630.2 kcal
change_log:
- timestamp: 2025-11-02T12:05:00+0000
  updated_by: 'LLM: GPT-5 Codex'
  reason: Initial estimate for Orange 'Jaffa Cake' slice with crème fraîche at The Eagle
  fields_changed: [all fields]
  sources: [{note: "User asked to add Orange 'Jaffa Cake' dessert with cr\xE8me fra\xEEche to\
      \ food bank", url: user_request}, {note: "Component model combining sponge,\
      \ chocolate glaze, orange jelly, and cr\xE8me fra\xEEche", url: gpt_component_estimate}]
- timestamp: 2025-11-02T14:00:00+0000
  updated_by: 'LLM: GPT-5 Codex'
  reason: Scaled portion and macros to align with GPT-5 Pro refined estimate
  fields_changed: [portion.est_weight_g, portion.notes, per_portion, derived.energy_from_macros_kcal,
  source.evidence, notes]
  sources: [{note: "GPT-5 Pro estimate shared 2025-11-01 14:13 with larger slice weight and cr\xE8\
      me fra\xEEche portion", url: user_follow_up}]
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
