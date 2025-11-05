## Pickled Cabbage / Sauerkraut (Zima)

```yaml
id: sauerkraut_zima_v1
schema_version: 2
version: 3
last_verified: 2025-11-05
source:
  venue: Zima, Soho, London
  menu_page: 
  evidence:
  - User-provided nutrition data for full portion (~180g)
  - Traditional fermented cabbage dish, high sodium from brine
aliases:
- Pickled Cabbage
- Sauerkraut
category: side
portion:
  description: restaurant side portion
  est_weight_g: 180
  notes: fermented cabbage in brine; very high sodium content typical of pickled vegetables
assumptions:
  salt_scheme: heavy
  oil_type: none
  prep: traditional fermentation in salted brine
per_portion:
  energy_kcal: 48.4
  protein_g: 1.6
  fat_g: 0.2
  sat_fat_g: 0.1
  mufa_g: 0.1
  pufa_g: 0.1
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 3
  fiber_total_g: 4.5
  fiber_soluble_g: 0.9
  fiber_insoluble_g: 3.6
  sodium_mg: 1080
  potassium_mg: 306
  iodine_ug: 0
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0.27
  polyols_g: 0
  carbs_available_g: 7.8
  carbs_total_g: 12.3
  copper_mg: 0.17
  selenium_ug: 1.1
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 36.0
  chloride_mg: 0
  sulfur_g: 0
  vitamin_a_ug: 1.8
  vitamin_d_ug: 0
  vitamin_e_mg: 0.25
  vitamin_k_ug: 23.4
  vitamin_b1_mg: 0.04
  vitamin_b2_mg: 0.04
  vitamin_b3_mg: 0.25
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0.23
  vitamin_b7_ug: 0
  vitamin_b9_ug: 43.2
  vitamin_b12_ug: 0
  choline_mg: 18.7
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
  - Fat breakdown (0.3g = 0.1 sat + 0.1 MUFA + 0.1 PUFA) exceeds stated total_fat (0.2g); using values as provided
  - Missing micronutrients: calcium, magnesium, iron, zinc, vitamin C (fermented vegetables typically contain these)
  - vitamin_b5_mg and vitamin_b7_ug not available in USDA source
notes:
- High sodium (1080mg) typical of fermented/pickled vegetables in brine
- Good fiber content (4.5g) with 0.9g soluble, 3.6g insoluble
- Low calorie density (40 kcal per 180g portion)
- Atwater check (available carb basis): 4×1.6 + 9×0.2 + 4×7.8 + 2×4.5 + 2.4×0.0 = 48.4 kcal
- Excellent source of vitamin K (23.4 μg per portion, ~26% DV) typical of fermented cruciferous vegetables
- Provides folate (43.2 μg), choline (18.7 mg), and trace amounts of B-vitamins from fermentation
- Negligible vitamin D and B12 (plant-based food), no EPA/DHA (not from marine sources)
change_log:
- timestamp: 2025-10-30 12:00:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Initial population from user-provided nutrition data for Zima restaurant dish
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
  per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g, per_portion.cholesterol_mg,
  per_portion.carbs_g, per_portion.sugar_g, per_portion.fiber_total_g, per_portion.fiber_soluble_g,
  per_portion.fiber_insoluble_g, per_portion.sodium_mg, per_portion.potassium_mg,
  portion.est_weight_g]
  sources: [{note: User-supplied nutrition data for Zima pickled cabbage on 2025-10-30, url: user_input}]
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
- timestamp: '2025-11-05T20:30:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Enriched with 17 priority nutrients from USDA FoodData Central (FDC ID 169279)
  fields_changed: [version, last_verified, per_portion.vitamin_a_ug, per_portion.vitamin_d_ug,
    per_portion.vitamin_e_mg, per_portion.vitamin_k_ug, per_portion.vitamin_b1_mg,
    per_portion.vitamin_b2_mg, per_portion.vitamin_b3_mg, per_portion.vitamin_b6_mg,
    per_portion.vitamin_b9_ug, per_portion.vitamin_b12_ug, per_portion.choline_mg,
    per_portion.phosphorus_mg, per_portion.copper_mg, per_portion.selenium_ug,
    per_portion.manganese_mg, per_portion.omega3_epa_mg, per_portion.omega3_dha_mg,
    notes, quality.gaps]
  sources:
    - note: 'USDA FoodData Central: Sauerkraut, canned, solids and liquids (FDC ID: 169279)'
      url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/169279/nutrients'
    - note: 'Nutrivore nutrient database (USDA-derived values per 100g)'
      url: 'https://nutrivore.com/foods/sauerkraut-nutrients/'
```
