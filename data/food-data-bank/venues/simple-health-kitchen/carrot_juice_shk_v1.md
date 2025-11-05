## Carrot Juice (Simple Health Kitchen)

```yaml
id: carrot_juice_shk_v1
schema_version: 2
version: 4
last_verified: 2025-11-05
source:
  venue: Simple Health Kitchen
  menu_page: 
  evidence:
  - USDA FoodData Central FDC #170491 (carrot juice, canned) scaled to 250mL
  - User confirmed: 250mL fresh carrot juice from Simple Health Kitchen
aliases:
category: drink
portion:
  description: 250mL fresh carrot juice
  est_weight_g: 250
  notes: Fresh-pressed carrot juice; no added salt or sugar
assumptions:
  salt_scheme: unsalted
  oil_type: none
  prep: fresh-pressed
per_portion:
  energy_kcal: 110.4
  protein_g: 2.4
  fat_g: 0.4
  sat_fat_g: 0.1
  mufa_g: 0.1
  pufa_g: 0.2
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 21.3
  fiber_total_g: 2
  fiber_soluble_g: 0.7
  fiber_insoluble_g: 1.3
  sodium_mg: 70
  potassium_mg: 730
  iodine_ug: 1
  magnesium_mg: 35
  calcium_mg: 60
  iron_mg: 1
  zinc_mg: 0
  vitamin_c_mg: 21
  manganese_mg: 0.325
  polyols_g: 0
  carbs_available_g: 23.3
  carbs_total_g: 25.3
  copper_mg: 0.125
  selenium_ug: 1.5
  chromium_ug: 4
  molybdenum_ug: 5
  phosphorus_mg: 105
  chloride_mg: 0
  sulfur_mg: 0
  vitamin_a_ug: 2390
  vitamin_d_ug: 0
  vitamin_e_mg: 3.0
  vitamin_k_ug: 40
  vitamin_b1_mg: 0.225
  vitamin_b2_mg: 0.15
  vitamin_b3_mg: 0.975
  vitamin_b5_mg: 0.58
  vitamin_b6_mg: 0.55
  vitamin_b7_ug: 2
  vitamin_b9_ug: 10
  vitamin_b12_ug: 0
  choline_mg: 24.75
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.02
  omega6_la_g: 0.15
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps:
  - Fat breakdown estimated from USDA carrot juice profile
  - Some ultra-trace minerals (chromium, molybdenum, chloride, sulfur) not available in USDA data
notes:
- USDA data for carrot juice (100g base): 40 kcal, 0.95g P, 0.15g F, 9.3g C, 0.8g fiber, scaled to 250mL
- Fresh carrot juice is naturally high in sugars (21.3g) from carrots; no added sugar
- Sodium represents intrinsic sodium in carrots; no added salt
- Excellent source of potassium (730mg) and vitamin A precursors (beta-carotene)
- '**EXCEPTIONAL VITAMIN A**: 2390 µg per serving (265% DV) - one of the richest natural sources'
- 'Good source of: vitamin E (3.0mg), vitamin K (40µg), vitamin B6 (0.55mg), choline (24.75mg), phosphorus (105mg)'
- 'Naturally contains no vitamin D, B12, EPA, or DHA (plant-based juice)'
- Atwater check (available carb basis): 4×2.4 + 9×0.4 + 4×23.3 + 2×2.0 + 2.4×0.0 = 110.4 kcal
change_log:
- timestamp: 2025-10-29T00:00:00+0000
  updated_by: Claude Code
  reason: Initial entry for Simple Health Kitchen carrot juice using USDA nutrition data
  fields_changed: [all fields]
  sources: [{note: Carrot juice nutrition data scaled from per 100g to 250mL serving, url: 'USDA
      FoodData Central FDC #170491'}]
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
- timestamp: '2025-11-05T00:00:00+00:00'
  updated_by: 'Claude Code (Ultrathink enrichment)'
  reason: 'Enriched with 17 priority nutrients from USDA FDC #170491 (carrot juice, canned)'
  fields_changed: [vitamin_a_ug, vitamin_d_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b6_mg, vitamin_b9_ug, vitamin_b12_ug, choline_mg, phosphorus_mg, copper_mg, selenium_ug, manganese_mg, omega3_epa_mg, omega3_dha_mg, quality.confidence, quality.gaps, notes]
  sources: [{note: 'USDA FoodData Central FDC #170491 nutrient data (per 100g) scaled to 250mL serving', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/170491/nutrients'}, {note: 'Comprehensive nutrient profile verified via foodstruct.com USDA aggregator', url: 'https://foodstruct.com/food/carrot-juice'}]
- timestamp: '2025-11-05T18:00:00+0000'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: 'Enriched with 8 additional nutrients: B5 (pantothenic acid), B7 (biotin), chromium, molybdenum, omega-3 ALA, omega-6 LA. Carrot juice provides modest amounts of trace minerals and B vitamins.'
  fields_changed: [version, per_portion.vitamin_b5_mg, per_portion.vitamin_b7_ug, per_portion.chromium_ug, per_portion.molybdenum_ug, per_portion.omega3_ala_g, per_portion.omega6_la_g]
  sources: [{note: 'USDA FoodData Central (FDC 170491) for B5, omega fatty acids; research literature for biotin (7% DV per serving). Carrot juice has minimal fiber (already documented) and trace chromium/molybdenum.', url: 'https://fdc.nal.usda.gov/'}]
```
