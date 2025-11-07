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
  iodine_ug: 12
  magnesium_mg: 34
  calcium_mg: 62
  iron_mg: 2.1
  zinc_mg: 0.9
  vitamin_c_mg: 1.5
  manganese_mg: 0.5
  polyols_g: 0
  carbs_available_g: 66
  carbs_total_g: 68.6
  copper_mg: 0.19
  selenium_ug: 23
  chromium_ug: 1
  molybdenum_ug: 8
  phosphorus_mg: 140
  chloride_mg: 593.0
  sulfur_g: 0.028
  vitamin_a_ug: 270
  vitamin_d_ug: 0.7
  vitamin_e_mg: 0.6
  vitamin_k_ug: 1.4
  vitamin_b1_mg: 0.06
  vitamin_b2_mg: 0.14
  vitamin_b3_mg: 0.74
  vitamin_b5_mg: 0.57
  vitamin_b6_mg: 0.04
  vitamin_b7_ug: 3
  vitamin_b9_ug: 23
  vitamin_b12_ug: 0.24
  choline_mg: 47
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.02
  omega6_la_g: 0.3
  boron_mg: 0.05
  silicon_mg: 0.5
  vanadium_ug: 0.5
  nickel_ug: 0.5
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

  - timestamp: "2025-11-06T23:28:47+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
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
- timestamp: '2025-11-05T16:15:00+00:00'
  updated_by: 'Agent 2: Claude Code (Sonnet 4.5)'
  reason: 'Phase 3 enrichment: Added complete USDA nutrient data for 28 migrated fields using component-based calculation for dessert'
  fields_changed: [iodine_ug, magnesium_mg, calcium_mg, iron_mg, zinc_mg, vitamin_c_mg, manganese_mg, copper_mg, selenium_ug, chromium_ug, molybdenum_ug, phosphorus_mg, chloride_mg, sulfur_mg, vitamin_a_ug, vitamin_d_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b7_ug, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_epa_mg, omega3_dha_mg, omega3_ala_g, omega6_la_g, boron_mg, silicon_mg, vanadium_ug, nickel_ug]
  sources: [{note: 'USDA FDC #173424 (eggs): B vitamins, choline 251mg/100g, vitamin A 160µg/100g, selenium 30.8µg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'USDA FDC #173430 (butter): vitamin A 684µg/100g, vitamin E 2.32mg/100g, vitamin K 7µg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'USDA FDC #170273 (dark chocolate 70-85%): copper 1.77mg/100g, magnesium 228mg/100g, phosphorus 308mg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'USDA FDC #170851 (crème fraîche): vitamin A 365µg/100g, calcium 98mg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'Component-weighted calculation: 50g flour + 30g sugar + 20g butter + 15g eggs + 15g orange jelly + 10g chocolate + 30g crème fraîche', url: component_analysis}]
```
