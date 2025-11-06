## Whole Wheat Pesto Pasta (Simple Health Kitchen)

```yaml
id: whole_wheat_pesto_pasta_shk_v1
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
  description: side serving
  est_weight_g:
  notes: pesto includes oil, nuts; salting normal
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: 
per_portion:
  energy_kcal: 216.3
  protein_g: 6.3
  fat_g: 7.9
  sat_fat_g: 1.2
  mufa_g: 4.7
  pufa_g: 1.9
  trans_fat_g: 0.1
  cholesterol_mg: 0
  sugar_g: 2.4
  fiber_total_g: 4
  fiber_soluble_g: 0.6
  fiber_insoluble_g: 3.4
  sodium_mg: 600
  potassium_mg: 235
  iodine_ug: 0
  magnesium_mg: 56
  calcium_mg: 66
  iron_mg: 2
  zinc_mg: 1
  vitamin_c_mg: 3
  manganese_mg: 3
  polyols_g: 0
  carbs_available_g: 28
  carbs_total_g: 32
  copper_mg: 0.22
  selenium_ug: 27
  chromium_ug: 2
  molybdenum_ug: 28
  phosphorus_mg: 104
  chloride_mg: 52
  sulfur_g: 0.068
  vitamin_a_ug: 16
  vitamin_d_ug: 0
  vitamin_e_mg: 0.9
  vitamin_k_ug: 18
  vitamin_b1_mg: 0.10
  vitamin_b2_mg: 0.05
  vitamin_b3_mg: 0.7
  vitamin_b5_mg: 0.33
  vitamin_b6_mg: 0.08
  vitamin_b7_ug: 1.3
  vitamin_b9_ug: 11
  vitamin_b12_ug: 0.03
  choline_mg: 9
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.04
  omega6_la_g: 1.5
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  estimated_nutrients:
  - name: fiber_soluble_g
    value: 0.6
    confidence: high
    method: Total fiber 4.0g from whole wheat pasta. Split using grains.wheat_bran ratio (15% soluble). 4.0g × 15% = 0.6g
  - name: fiber_insoluble_g
    value: 3.4
    confidence: high
    method: Total fiber 4.0g from whole wheat pasta. Split using grains.wheat_bran ratio (85% insoluble). 4.0g × 85% = 3.4g
  - name: manganese_mg
    value: 3
    confidence: medium
    method: Whole grains ~3.0-4.0 mg/100g. Estimated 100g whole wheat pasta equivalent contributes ~3.0 mg total. USDA data for whole wheat products.
notes:
- Atwater check (available carb basis): 4×6.3 + 9×7.9 + 4×28.0 + 2×4.0 + 2.4×0.0 = 216.3 kcal
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
  per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g, per_portion.carbs_g,
  per_portion.sugar_g, per_portion.fiber_total_g, per_portion.sodium_mg, per_portion.potassium_mg,
  per_portion.magnesium_mg, per_portion.calcium_mg, per_portion.iron_mg, per_portion.zinc_mg,
  per_portion.vitamin_c_mg]
  sources: [{note: User-supplied values on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T18:57:05+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Consistency fix for fat totals/splits
  fields_changed: [per_portion.mufa_g, per_portion.pufa_g]
  sources: [{note: Correction approved by user on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed: [per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g, per_portion.carbs_g,
  per_portion.sugar_g, per_portion.fiber_total_g, per_portion.iron_mg, per_portion.zinc_mg,
  per_portion.vitamin_c_mg]
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
- timestamp: '2025-11-05T15:00:00+00:00'
  updated_by: 'Agent 4: Claude Code (Sonnet 4.5)'
  reason: 'Comprehensive nutrient enrichment for whole wheat pesto pasta side using component-based USDA data (whole wheat pasta ~100g, pesto ~20g with basil, pine nuts, parmesan, olive oil)'
  fields_changed: [copper_mg, selenium_ug, chromium_ug, molybdenum_ug, phosphorus_mg, chloride_mg, sulfur_mg, vitamin_a_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b7_ug, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_ala_g, omega6_la_g, version, last_verified]
  sources:
  - note: 'USDA FoodData Central - Whole wheat pasta cooked (FDC 168890): selenium 26µg/100g, copper 0.17mg/100g, molybdenum 27µg/100g, phosphorus, B vitamins'
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/168890'
  - note: 'USDA FoodData Central - Basil fresh: vitamin K 415µg/100g, vitamin A'
    url: 'https://fdc.nal.usda.gov/'
  - note: 'USDA FoodData Central - Pine nuts: omega-6 LA, vitamin E, copper'
    url: 'https://fdc.nal.usda.gov/'
  - note: 'Component aggregation for pasta with pesto. Vitamin D remains 0 (plant-based). B12 trace from parmesan. EPA/DHA remain 0 (no fish). Ultra-trace elements remain 0 (insufficient data).'
    url: 'component_analysis'
```
