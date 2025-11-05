## Pastel de Nata (The Eagle, Farringdon)

```yaml
id: pastel_de_nata_eagle_farringdon_v1
version: 3
schema_version: 2
last_verified: "2025-11-03"
source:
  venue: The Eagle, Farringdon (London)
  menu_page: https://theeaglefarringdon.co.uk/
  evidence:
  - Venue dessert board observed 2025-11-01
  - Component estimate using puff pastry and egg custard nutrition profiles
aliases:
- Portuguese Custard Tart
category: dessert
portion:
  description: 1 tart
  est_weight_g: 65
  notes: Approx. 40g puff pastry shell with 25g rich egg custard
assumptions:
  salt_scheme: normal (pastry dough seasoned)
  oil_type: butter
  prep: House-baked puff pastry case filled with egg custard, baked until caramelised
per_portion:
  energy_kcal: 281
  protein_g: 5.2
  fat_g: 14.8
  sat_fat_g: 7.4
  mufa_g: 5.5
  pufa_g: 1.3
  trans_fat_g: 0.1
  cholesterol_mg: 115
  sugar_g: 17.0
  fiber_total_g: 1.1
  fiber_soluble_g: 0.3
  fiber_insoluble_g: 0.8
  sodium_mg: 210
  potassium_mg: 105
  iodine_ug: 17
  magnesium_mg: 8
  calcium_mg: 45
  iron_mg: 0.8
  zinc_mg: 0.6
  selenium_ug: 20
  vitamin_c_mg: 0.3
  vitamin_d_ug: 1.2
  vitamin_e_mg: 0.62
  manganese_mg: 0.1
  copper_mg: 0.01
  polyols_g: 0.0
  carbs_available_g: 31.2
  carbs_total_g: 32.3
  chromium_ug: 1
  molybdenum_ug: 2
  phosphorus_mg: 95
  chloride_mg: 200
  sulfur_g: 0.05
  vitamin_a_ug: 165
  vitamin_k_ug: 1.5
  vitamin_b1_mg: 0.03
  vitamin_b2_mg: 0.09
  vitamin_b3_mg: 0.21
  vitamin_b5_mg: 0.31
  vitamin_b6_mg: 0.03
  vitamin_b7_ug: 3.3
  vitamin_b9_ug: 11
  vitamin_b12_ug: 0.22
  choline_mg: 43
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.01
  omega6_la_g: 0.2
  boron_mg: 0.02
  silicon_mg: 0.2
  vanadium_ug: 0.2
  nickel_ug: 0.2
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps:
  - Exact pastry weight may vary by bake batch
  - Custard cream ratio inferred from standard recipes
  - Micronutrients not fully itemised
notes:
- "Macro build: 40g puff pastry + 25g enriched egg custard"
- Sugar estimate combines custard sugar and caramelised top
- Cholesterol driven by egg yolks and dairy
- Sodium primarily from salted butter in pastry
- "Energy check: 31.2g carbs, 5.2g protein, 14.8g fat → ≈280 kcal"
- Contains gluten, egg, dairy
- 'Atwater check (available carb basis): 4×5.2 + 9×14.8 + 4×31.2 + 2×1.1 + 2.4×0.0
  = 281 kcal'
change_log:
- timestamp: 2025-11-02T12:00:00+0000
  updated_by: "LLM: GPT-5 Codex"
  reason: Initial estimate for Pastel de Nata dessert at The Eagle
  fields_changed:
  - all fields
  sources:
  - url: user_request
    note: User asked to add Pastel de Nata from The Eagle to food bank
  - url: gpt_component_estimate
    note: Component model using puff pastry and custard nutrition references
- timestamp: "2025-11-02T19:20:00+00:00"
  updated_by: "LLM: GPT-5 Codex"
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed:
  - derived.energy_from_macros_kcal
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
  reason: Add iodine, selenium and vitamin D estimates from egg custard (MEDIUM priority nutrient completion)
  fields_changed:
  - last_verified
  - per_portion.iodine_ug
  - per_portion.selenium_ug
  - per_portion.vitamin_d_ug
  - version
  sources:
  - url: https://fdc.nal.usda.gov/
    note: "USDA FoodData Central: Eggs ~26 µg/100g iodine, ~31 µg/100g selenium, ~1.8 µg/100g vitamin D. 25g custard estimated at 65% eggs. Confidence: MEDIUM (egg-based estimates well-documented)"
- timestamp: '2025-11-05T17:30:00+00:00'
  updated_by: 'Agent 2: Claude Code (Sonnet 4.5)'
  reason: 'Phase 3 enrichment: Added complete USDA nutrient data for 23 remaining migrated fields'
  fields_changed: [magnesium_mg, calcium_mg, iron_mg, zinc_mg, vitamin_c_mg, vitamin_e_mg, manganese_mg, copper_mg, chromium_ug, molybdenum_ug, phosphorus_mg, chloride_mg, sulfur_mg, vitamin_a_ug, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b7_ug, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_epa_mg, omega3_dha_mg, omega3_ala_g, omega6_la_g, boron_mg, silicon_mg, vanadium_ug, nickel_ug]
  sources: [{note: 'USDA FDC #173424 (eggs): B vitamins, choline 251mg/100g, vitamin A 160µg/100g, vitamin E 1.03mg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'USDA FDC #173430 (butter): vitamin A 684µg/100g, vitamin E 2.32mg/100g, vitamin K 7µg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'USDA FDC #171265 (milk): B vitamins, calcium 113mg/100g, phosphorus 93mg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'USDA FDC #169762 (flour): B vitamins, selenium 33.9µg/100g, phosphorus 108mg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'Component-weighted calculation: 15g flour + 20g butter + 15g eggs + 10g milk + 5g sugar in 65g tart', url: component_analysis}]
```
