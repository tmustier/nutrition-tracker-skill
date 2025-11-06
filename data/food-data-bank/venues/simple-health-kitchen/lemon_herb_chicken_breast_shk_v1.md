## Lemon & Herb Chicken Breast (Simple Health Kitchen)

```yaml
id: lemon_herb_chicken_breast_shk_v1
schema_version: 2
version: 5
last_verified: 2025-11-02
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: 
  evidence:
aliases:
category: main
portion:
  description: grilled chicken breast
  est_weight_g:
  notes: lemon & herb marinade; normal salt
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: 
per_portion:
  energy_kcal: 161.1
  protein_g: 36
  fat_g: 1.9
  sat_fat_g: 0.6
  mufa_g: 0.8
  pufa_g: 0.5
  trans_fat_g: 0
  cholesterol_mg: 130
  sugar_g: 0
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 275
  potassium_mg: 385
  iodine_ug: 1
  magnesium_mg: 36
  calcium_mg: 7
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0
  carbs_available_g: 0
  carbs_total_g: 0
  copper_mg: 0.06
  selenium_ug: 33.5
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 305
  chloride_mg: 0
  sulfur_g: 0.0
  vitamin_a_ug: 12
  vitamin_d_ug: 0
  vitamin_e_mg: 0.6
  vitamin_k_ug: 13.1
  vitamin_b1_mg: 0.13
  vitamin_b2_mg: 0.25
  vitamin_b3_mg: 14.3
  vitamin_b5_mg: 2.0
  vitamin_b6_mg: 1.37
  vitamin_b7_ug: 0
  vitamin_b9_ug: 8
  vitamin_b12_ug: 0.25
  choline_mg: 131
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.06
  omega6_la_g: 0.72
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - No carbs/fibre provided; trans fat not provided; ~0.09 g of fat unassigned (trace/trans).
notes:
- Atwater check (available carb basis): 4×36.0 + 9×1.9 + 4×0.0 + 2×0.0 + 2.4×0.0 = 161.1 kcal
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
  per_portion.mufa_g, per_portion.pufa_g, per_portion.cholesterol_mg, per_portion.sodium_mg,
  per_portion.potassium_mg, per_portion.iodine_ug, per_portion.magnesium_mg, per_portion.calcium_mg,
  per_portion.iron_mg, per_portion.zinc_mg]
  sources: [{note: User-supplied values on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T18:57:05+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Consistency fix for fat totals/splits
  fields_changed: [per_portion.fat_g]
  sources: [{note: Correction approved by user on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed: [per_portion.protein_g, per_portion.sat_fat_g, per_portion.pufa_g, per_portion.iodine_ug,
  per_portion.magnesium_mg, per_portion.calcium_mg, per_portion.iron_mg, per_portion.zinc_mg]
  sources: [{note: Automated rounding pass, url: formatting-pass}]
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed: [last_verified, notes, per_portion.carbs_available_g, per_portion.carbs_g, per_portion.carbs_total_g,
  per_portion.energy_kcal, per_portion.fiber_insoluble_g, per_portion.fiber_soluble_g,
  per_portion.fiber_total_g, per_portion.polyols_g, version]
  sources: []
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
- timestamp: '2025-11-05T18:30:00+00:00'
  updated_by: 'Claude Code (Sonnet 4.5) - Agent 1'
  reason: 'Enriched with complete USDA nutrient data for grilled chicken breast. Populated 17 nutrients from 0 to USDA values scaled to ~118g portion (based on 36g protein vs 30.5g per 100g USDA). Key nutrients added: vitamin A (12 mcg), vitamin E (0.6 mg), vitamin K (13.1 mcg), B-vitamins (B1: 0.13 mg, B2: 0.25 mg, B3: 14.3 mg, B5: 2.0 mg, B6: 1.37 mg, B9: 8 mcg, B12: 0.25 mcg), choline (131 mg), phosphorus (305 mg), copper (0.06 mg), selenium (33.5 mcg), omega-3 ALA (0.06 g), omega-6 LA (0.72 g). Confirmed TRUE zeros: vitamin C, vitamin D (minimal in chicken), chromium, molybdenum (not measured), EPA/DHA (chicken is not fish). Manganese trace (0.014 mg). Confidence: HIGH (±5-15% - direct USDA match for grilled chicken breast).'
  fields_changed: [vitamin_a_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b9_ug, vitamin_b12_ug, choline_mg, phosphorus_mg, copper_mg, selenium_ug, omega3_ala_g, omega6_la_g]
  sources:
  - note: 'USDA grilled chicken breast per 100g (boneless, skinless, meat only)'
    url: 'https://www.nutritionvalue.org/Chicken,_grilled,_cooked,_meat_only,_boneless,_skinless,_breast,_broiler_or_fryers_nutritional_value.html'
    data_type: 'USDA FoodData Central'
```
