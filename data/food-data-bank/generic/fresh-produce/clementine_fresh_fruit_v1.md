## Clementine (Fresh Fruit)

```yaml
id: clementine_fresh_fruit_v1
schema_version: 2
version: 3
last_verified: 2025-11-05
source:
  venue: Clementine (Fresh Fruit)
  menu_page: 
  evidence:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/168195/nutrients
    note: 'USDA FoodData Central: Clementines, raw (FDC ID 168195)'
  - url: https://tools.myfooddata.com/nutrition-facts/168195/wt1
    note: 'MyFoodData USDA aggregation: Complete nutrition profile per 100g and per clementine'
aliases:
- mandarin
- easy peeler
category: ingredient
portion:
  description: 1 medium clementine (~74g)
  est_weight_g: 74
  notes: Standard USDA portion weight for one medium clementine
assumptions:
  salt_scheme: unsalted
  oil_type: 
  prep: fresh, whole, peeled
per_portion:
  energy_kcal: 41.9
  protein_g: 0.6
  fat_g: 0.1
  sat_fat_g: 0
  mufa_g: 0
  pufa_g: 0
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 6.8
  fiber_total_g: 1.3
  fiber_soluble_g: 0.6
  fiber_insoluble_g: 0.7
  sodium_mg: 1
  potassium_mg: 131
  iodine_ug: 0
  magnesium_mg: 7
  calcium_mg: 22
  iron_mg: 0.1
  zinc_mg: 0
  vitamin_c_mg: 36
  manganese_mg: 0.02
  polyols_g: 0
  carbs_available_g: 9
  carbs_total_g: 10.3
  copper_mg: 0.03
  selenium_ug: 0.1
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 15.5
  chloride_mg: 0
  sulfur_g: 0
  vitamin_a_ug: 25.2
  vitamin_d_ug: 0
  vitamin_e_mg: 0.15
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.07
  vitamin_b2_mg: 0.02
  vitamin_b3_mg: 0.47
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0.06
  vitamin_b7_ug: 0
  vitamin_b9_ug: 17.8
  vitamin_b12_ug: 0
  choline_mg: 10.4
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
  fat_unassigned_g: 0.1
quality:
  confidence: high
  gaps:
  - iodine_ug (not measured in USDA data for citrus)
  - vitamin_k_ug (trace amounts only)
  - vitamin_b5_mg (pantothenic acid - not in available sources)
  - vitamin_b7_ug (biotin - rarely analyzed for citrus)
  - chromium_ug (limited USDA coverage)
  - molybdenum_ug (limited USDA coverage)
  - chloride_mg (rarely analyzed)
  - sulfur_g (rarely analyzed)
  - omega3_ala_g (trace/negligible in citrus)
  - omega6_la_g (trace/negligible in citrus)
  - ultra-trace minerals (boron, silicon, vanadium, nickel - not in USDA database)
notes:
- 35 kcal from USDA FoodData Central per medium 74g clementine
- Values scaled from USDA per-100g data: 47 kcal, 0.85g protein, 0.15g fat, 12g carbs, 1.7g fiber
- Fat content negligible (<0.15g) - primarily trace amounts of natural fruit oils
- Excellent source of vitamin C: 36mg provides ~60% daily value
- Naturally sodium-free and cholesterol-free
- Atwater check (available carb basis): 4×0.6 + 9×0.1 + 4×9.0 + 2×1.3 + 2.4×0.0 = 41.9 kcal
change_log:
- timestamp: 2025-10-29 14:00:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Initial population from USDA FoodData Central (FDC ID 168195) scaled to standard 74g portion
  fields_changed: [portion.est_weight_g, assumptions.salt_scheme, assumptions.prep, per_portion.energy_kcal,
  per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g, per_portion.mufa_g,
  per_portion.pufa_g, per_portion.trans_fat_g, per_portion.cholesterol_mg, per_portion.carbs_g,
  per_portion.sugar_g, per_portion.fiber_total_g, per_portion.sodium_mg, per_portion.potassium_mg,
  per_portion.magnesium_mg, per_portion.calcium_mg, per_portion.iron_mg, per_portion.zinc_mg,
  per_portion.vitamin_c_mg, derived.energy_from_macros_kcal, derived.fat_unassigned_g,
  quality.confidence, quality.gaps]
  sources: [{note: 'USDA FoodData Central primary source for clementines, raw', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/168195/nutrients'},
  {note: USDA data aggregator showing per-clementine values (74g portion), url: 'https://tools.myfooddata.com/nutrition-facts/168195/wt1'}]
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
- timestamp: 2025-11-05T20:00:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Enriched with 17 priority nutrients from USDA FoodData Central (FDC ID 168195)
  fields_changed:
  - vitamin_a_ug (0 → 25.2)
  - vitamin_d_ug (remains 0, citrus has no vitamin D)
  - vitamin_e_mg (0 → 0.15)
  - vitamin_k_ug (remains 0, trace only)
  - vitamin_b1_mg (0 → 0.07)
  - vitamin_b2_mg (0 → 0.02)
  - vitamin_b3_mg (0 → 0.47)
  - vitamin_b6_mg (0 → 0.06)
  - vitamin_b9_ug (0 → 17.8)
  - vitamin_b12_ug (remains 0, plant foods contain no B12)
  - choline_mg (0 → 10.4)
  - phosphorus_mg (0 → 15.5)
  - copper_mg (0 → 0.03)
  - selenium_ug (0 → 0.1)
  - manganese_mg (0 → 0.02)
  - iodine_ug (remains 0, not measured for citrus)
  - omega3_epa_mg (remains 0, marine omega-3 only)
  - omega3_dha_mg (remains 0, marine omega-3 only)
  sources:
  - note: 'USDA FoodData Central SR Legacy: Clementines, raw (FDC ID 168195)'
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/168195/nutrients'
  - note: 'Multiple source validation: foodstruct.com, nutritionvalue.org'
    url: 'https://foodstruct.com/food/clementines-raw'
  data_quality: 'Per 100g values from USDA scaled to 74g portion. B-vitamin values consistent
    across multiple aggregators. Vitamin A from provitamin carotenoids (34 µg RAE per 100g).
    EPA/DHA zero (marine omega-3s absent in citrus). Iodine not measured in standard USDA
    citrus analysis.'
```
