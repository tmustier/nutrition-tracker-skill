## Olive Oil (14g)

```yaml
id: olive_oil_14g_generic-ingredients_v1
schema_version: 2
version: 1
last_verified: 2025-11-03
source:
  venue: Generic Ingredients
  menu_page: 
  evidence:
  - USDA FoodData Central - Oil, olive, extra virgin
  - FDC ID: 748967
aliases:
- Extra Virgin Olive Oil
- EVOO
category: ingredient
portion:
  description: 1 tablespoon (~1 tbsp)
  est_weight_g: 14
  notes: Extra virgin olive oil
assumptions:
  salt_scheme: unsalted
  oil_type: olive_oil
  prep: raw
  usda_source: USDA SR Legacy FDC ID 171413 (Oil, olive, salad or cooking)
  enrichment_note: 'Olive oil is 100% fat - only fat-soluble vitamins E and K present in significant amounts; trace choline (0.04mg). All water-soluble vitamins, minerals, and long-chain omega-3s (EPA/DHA) are 0.'
per_portion:
  energy_kcal: 123.8
  protein_g: 0
  fat_g: 14
  sat_fat_g: 1.9
  mufa_g: 10.4
  pufa_g: 1.5
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 0
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 0
  potassium_mg: 0
  iodine_ug: 0
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0
  carbs_available_g: 0
  carbs_total_g: 0
  copper_mg: 0
  selenium_ug: 0
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 0
  chloride_mg: 0
  sulfur_g: 0
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 2.01
  vitamin_k_ug: 8.43
  vitamin_b1_mg: 0
  vitamin_b2_mg: 0
  vitamin_b3_mg: 0
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0
  vitamin_b7_ug: 0
  vitamin_b9_ug: 0
  vitamin_b12_ug: 0
  choline_mg: 0.04
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
  confidence: high
  gaps: []
notes:
- Scaled from USDA per 100g values: 884 kcal, 0g P, 100g F (13.8g sat, 72.9g MUFA, 10.5g PUFA), 0g C
- USDA micronutrients per 100g: Vitamin E (14.35 mg), Vitamin K (60.2 mcg), all others 0 or trace
- 1 tablespoon = ~13.5g, rounded to 14g for convenience
- Predominantly monounsaturated fatty acids (74% oleic acid)
- Rich in polyphenols and vitamin E (antioxidants)
- Heart-healthy fat, Mediterranean diet staple
- Zero carbs, zero protein, pure fat (100% fat)
- Contains only fat-soluble vitamins E and K in significant amounts; all water-soluble vitamins, minerals (except trace amounts), and long-chain omega-3s (EPA/DHA) are absent
- Atwater check (available carb basis): 4×0.0 + 9×14.0 + 4×0.0 + 2×0.0 + 2.4×0.0 = 126.0 kcal (≈123.8 accounting for rounding)
change_log:
- timestamp: '2025-11-03T10:35:00+00:00'
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial population with USDA nutrition data for 7g portion (1/2 tablespoon)
  fields_changed: [all fields]
  sources: [{note: 'USDA FoodData Central - Olive oil, extra virgin', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/748967/nutrients'}]
- timestamp: '2025-11-03T09:10:00+00:00'
  updated_by: Claude Code (Sonnet 4.5)
  reason: Updated default portion from 1/2 tbsp (7g) to 1 tbsp (14g) for databank consistency
  fields_changed: [portion.description, portion.est_weight_g, all per_portion nutrition values, id,
  derived.vitamin_e_mg]
  sources: [{note: 'USDA FoodData Central - Olive oil, extra virgin', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/748967/nutrients'}]
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
- timestamp: '2025-11-05T14:30:00+00:00'
  updated_by: Claude Code (Sonnet 4.5)
  reason: 'Enriched with 17 priority nutrients from USDA FoodData Central. Updated vitamin E (2.01 mg) and vitamin K (8.43 mcg) from verified USDA data (per 100g: E=14.35mg, K=60.2mcg). Confirmed all other priority nutrients are 0: vitamin D, A, B1, B2, B3, B6, B9, B12, choline, iodine, phosphorus, copper, selenium, manganese, EPA, DHA. Olive oil is 100% fat with only fat-soluble vitamins E and K in significant amounts.'
  fields_changed: [vitamin_e_mg, vitamin_k_ug]
  sources:
  - note: 'USDA nutrient data for olive oil (multiple sources verified)'
    url: 'https://www.zoeharcombe.com/nutrition-data/olive-oil-nutrition-data/'
  - note: 'USDA FoodData Central - Oil, olive, salad or cooking (FDC ID: 171413)'
    url: 'https://fdc.nal.usda.gov/'
- timestamp: '2025-11-05T16:45:00+00:00'
  updated_by: Claude Code (Sonnet 4.5)
  reason: 'Re-verified and enriched 17 priority nutrients from USDA FoodData Central SR Legacy database. Confirmed vitamin E (2.01 mg from 14.35 per 100g) and vitamin K (8.43 mcg from 60.2 per 100g). Updated choline_mg from 0 to 0.04 (from 0.3 per 100g). All other priority nutrients confirmed as 0: vitamin D, A, B1-B12, iodine, phosphorus, copper, selenium, manganese, EPA, DHA. Pure olive oil contains only fat-soluble vitamins E and K in measurable amounts, plus trace choline.'
  fields_changed: [choline_mg]
  sources:
  - note: 'USDA FoodData Central - Oil, olive, salad or cooking'
    fdc_id: 171413
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/171413/nutrients'
    data_type: 'SR Legacy'
```
