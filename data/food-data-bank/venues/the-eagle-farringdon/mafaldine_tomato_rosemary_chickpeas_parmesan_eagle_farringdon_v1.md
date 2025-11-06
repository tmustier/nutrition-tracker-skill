## Mafaldine with Tomato, Rosemary, Chickpeas & Parmesan (The Eagle, Farringdon)

```yaml
id: mafaldine_tomato_rosemary_chickpeas_parmesan_eagle_farringdon_v1
schema_version: 2
version: 3
last_verified: 2025-11-02
source:
  venue: The Eagle, Farringdon (London)
  menu_page: "https://theeaglefarringdon.co.uk/"
  evidence:
  - GPT-5 Codex component build based on pasta, tomato sauce, chickpeas, olive oil, parmesan
  - Portion sizing inferred from Eagle pasta mains (~380-400g cooked pasta)
  - User dining notes from 2025-11-01 visit
aliases:
- Mafaldine with Tomato & Chickpeas
- Mafaldine Pomodoro e Ceci
- Mafaldine with Rosemary & Parmesan
category: main
portion:
  description: 1 plated serving
  est_weight_g: 645
  notes: Approx. 280g cooked mafaldine + 150g chickpeas + 180g crushed tomatoes + garnishes
assumptions:
  salt_scheme: normal (≈0.6g finishing salt)
  oil_type: extra-virgin olive oil
  prep: Mafaldine tossed in tomato-rosemary sauce with chickpeas, finished with olive oil and parmesan
per_portion:
  energy_kcal: 1008.2
  protein_g: 39.6
  fat_g: 27.2
  sat_fat_g: 6.3
  mufa_g: 13.8
  pufa_g: 4.5
  trans_fat_g: 0
  cholesterol_mg: 13.6
  sugar_g: 18.5
  fiber_total_g: 19.9
  fiber_soluble_g: 6.3
  fiber_insoluble_g: 13.6
  sodium_mg: 807
  potassium_mg: 1108
  iodine_ug: 8
  magnesium_mg: 120
  calcium_mg: 180
  iron_mg: 6.5
  zinc_mg: 3.5
  vitamin_c_mg: 35
  manganese_mg: 1.8
  polyols_g: 0
  carbs_available_g: 141.3
  carbs_total_g: 161.2
  copper_mg: 0.8
  selenium_ug: 95
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 420
  chloride_mg: 0
  sulfur_g: 0.0
  vitamin_a_ug: 85
  vitamin_d_ug: 0
  vitamin_e_mg: 3.2
  vitamin_k_ug: 18
  vitamin_b1_mg: 0.9
  vitamin_b2_mg: 0.4
  vitamin_b3_mg: 6.5
  vitamin_b5_mg: 1.2
  vitamin_b6_mg: 0.6
  vitamin_b7_ug: 0
  vitamin_b9_ug: 320
  vitamin_b12_ug: 0.2
  choline_mg: 85
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.2
  omega6_la_g: 2.5
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
  - Saturated fat and micronutrients inferred from components
  - Actual salt level varies by chef seasoning
  - Portion weight estimated from typical serving size
notes:
- Component breakdown: 280g cooked mafaldine, 150g cooked chickpeas, 180g crushed tomatoes, 15g olive oil, 20g parmesan
- Seasoning assumed to include ≈0.6g finishing salt plus inherent sodium from parmesan and canned ingredients
- Higher fiber (≈20g) from chickpeas and pasta supports training-day carb goals
- Fat split reflects olive oil MUFA dominance with moderate saturated fat from parmesan
- Energy cross-check: 141.3g carbs, 39.6g protein, 27.2g fat → ~957 kcal from macros
- Suitable for vegetarian diet; contains dairy
- Sodium moderate for a pasta main (~0.8g)
- Atwater check (available carb basis): 4×39.6 + 9×27.2 + 4×141.3 + 2×19.9 + 2.4×0.0 = 1008.2 kcal
change_log:
- timestamp: 2025-11-01T18:30:00+0000
  updated_by: 'LLM: GPT-5 Codex'
  reason: Initial macro-rich estimate for pasta ordered at The Eagle
  fields_changed: [all fields]
  sources: [{note: 'User considering Mafaldine with Tomato, Rosemary, Chickpeas & Parmesan on
      2025-11-01', url: user_request}, {note: GPT-5 Codex component model with 2g
      finishing salt assumption, url: gpt_culinary_estimate}]
- timestamp: 2025-11-02T10:00:00+0000
  updated_by: 'LLM: GPT-5 Codex'
  reason: Aligned macros and sodium with refined portion model from user research notes
  fields_changed: [version, last_verified, portion.est_weight_g, assumptions.salt_scheme, per_portion.energy_kcal,
  per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g, per_portion.mufa_g,
  per_portion.pufa_g, per_portion.cholesterol_mg, per_portion.carbs_g, per_portion.sugar_g,
  per_portion.fiber_total_g, per_portion.fiber_soluble_g, per_portion.fiber_insoluble_g,
  per_portion.sodium_mg, per_portion.potassium_mg, derived.energy_from_macros_kcal,
  notes]
  sources: [{note: Portion and macro breakdown supplied by user on 2025-11-02, url: user_provided_best_effort_estimate}]
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
- timestamp: '2025-11-05T19:15:00+00:00'
  updated_by: 'Claude Code (Sonnet 4.5) - Agent 1'
  reason: 'Enriched with nutrient estimates based on pasta dish components: cooked mafaldine (~280g enriched pasta), chickpeas (~150g), crushed tomatoes (~180g), olive oil (~15g), parmesan (~20g). Populated 22 nutrients from 0 to estimated values: magnesium (120 mg from chickpeas/pasta), calcium (180 mg from parmesan), iron (6.5 mg from enriched pasta/chickpeas), zinc (3.5 mg), vitamin C (35 mg from tomatoes), manganese (1.8 mg from chickpeas), copper (0.8 mg), selenium (95 mcg from pasta/chickpeas), phosphorus (420 mg), vitamin A (85 mcg from tomatoes/parmesan), vitamin E (3.2 mg from olive oil), vitamin K (18 mcg), B-vitamins (B1: 0.9 mg enriched pasta, B2: 0.4 mg, B3: 6.5 mg, B5: 1.2 mg, B6: 0.6 mg from chickpeas, B9: 320 mcg from chickpeas/pasta, B12: 0.2 mcg from parmesan), choline (85 mg), iodine (8 mcg), omega-3 ALA (0.2 g), omega-6 LA (2.5 g from olive oil). Confidence: MEDIUM (±20-40% - multi-component pasta dish).'
  fields_changed: [iodine_ug, magnesium_mg, calcium_mg, iron_mg, zinc_mg, vitamin_c_mg, manganese_mg, copper_mg, selenium_ug, phosphorus_mg, vitamin_a_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_ala_g, omega6_la_g]
  sources:
  - note: 'Component-based estimation: enriched pasta, chickpeas, tomatoes, olive oil, parmesan. Based on USDA data for individual ingredients.'
    url: 'https://fdc.nal.usda.gov/'
    confidence: 'MEDIUM - multi-component vegetarian pasta dish'
```
