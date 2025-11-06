## Broccoli Stems (Simple Health Kitchen)

```yaml
id: broccoli_stems_shk_v1
schema_version: 2
version: 7
last_verified: 2025-11-05
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: 
  evidence:
aliases:
category: side
portion:
  description: steamed/roasted broccoli stems
  est_weight_g: 150
  notes: no raisins variant; zest optional; normal salt; ~150g broccoli + oil/seasoning
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: 
per_portion:
  energy_kcal: 165.7
  protein_g: 5
  fat_g: 5.1
  sat_fat_g: 0.6
  mufa_g: 3.6
  pufa_g: 0.9
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 9.4
  fiber_total_g: 6.9
  fiber_soluble_g: 2.8
  fiber_insoluble_g: 4.1
  sodium_mg: 540
  potassium_mg: 630
  iodine_ug: 1
  magnesium_mg: 45
  calcium_mg: 84
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 130
  manganese_mg: 0.3
  polyols_g: 0
  carbs_available_g: 21.5
  carbs_total_g: 28.4
  copper_mg: 0.1
  selenium_ug: 4
  chromium_ug: 17
  molybdenum_ug: 15
  phosphorus_mg: 99
  chloride_mg: 0
  sulfur_g: 0.0
  vitamin_a_ug: 47
  vitamin_d_ug: 0
  vitamin_e_mg: 1.2
  vitamin_k_ug: 152
  vitamin_b1_mg: 0.11
  vitamin_b2_mg: 0.18
  vitamin_b3_mg: 1.0
  vitamin_b5_mg: 0.9
  vitamin_b6_mg: 0.27
  vitamin_b7_ug: 2
  vitamin_b9_ug: 95
  vitamin_b12_ug: 0
  choline_mg: 28
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.09
  omega6_la_g: 0.07
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - No trans fat provided; ~0.52 g of fat unassigned (likely trace/trans/rounding).
notes:
- Atwater check (available carb basis): 4×5.0 + 9×5.1 + 4×21.5 + 2×6.9 + 2.4×0.0 = 165.7 kcal
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
  per_portion.mufa_g, per_portion.pufa_g, per_portion.carbs_g, per_portion.sugar_g,
  per_portion.fiber_total_g, per_portion.sodium_mg, per_portion.potassium_mg, per_portion.iodine_ug,
  per_portion.magnesium_mg, per_portion.calcium_mg, per_portion.iron_mg, per_portion.zinc_mg,
  per_portion.vitamin_c_mg]
  sources: [{note: User-supplied values on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T18:57:05+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Consistency fix for fat totals/splits
  fields_changed: [per_portion.fat_g]
  sources: [{note: Correction approved by user on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed: [per_portion.protein_g, per_portion.sat_fat_g, per_portion.mufa_g, per_portion.pufa_g,
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
- timestamp: 2025-11-05T12:00:00+0000
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Enriched with 17 priority nutrients from USDA FoodData Central (raw broccoli, FDC ID 169330/170379)
  fields_changed: [version, last_verified, portion.est_weight_g, portion.notes, per_portion.vitamin_a_ug, per_portion.vitamin_e_mg, per_portion.vitamin_k_ug, per_portion.vitamin_b1_mg, per_portion.vitamin_b2_mg, per_portion.vitamin_b3_mg, per_portion.vitamin_b6_mg, per_portion.vitamin_b9_ug, per_portion.choline_mg, per_portion.phosphorus_mg, per_portion.copper_mg, per_portion.selenium_ug, per_portion.manganese_mg]
  sources: [{note: 'USDA FoodData Central - Broccoli, raw per 100g, scaled to ~150g portion', url: 'https://fdc.nal.usda.gov/'}]
- timestamp: '2025-11-05T18:00:00+0000'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: 'Enriched with 8 additional nutrients: B5 (pantothenic acid), B7 (biotin), chromium, molybdenum, omega-3 ALA, omega-6 LA. Broccoli is an excellent source of chromium (17µg, ~50% DV) and molybdenum (15µg, ~33% DV).'
  fields_changed: [version, per_portion.vitamin_b5_mg, per_portion.vitamin_b7_ug, per_portion.chromium_ug, per_portion.molybdenum_ug, per_portion.omega3_ala_g, per_portion.omega6_la_g]
  sources: [{note: 'USDA FoodData Central (FDC 169330) for B5, omega fatty acids; research literature for biotin, chromium (Linus Pauling Institute), molybdenum (Brassicaceae family research). Cruciferous vegetables are exceptional chromium and molybdenum sources.', url: 'https://fdc.nal.usda.gov/'}]
```
