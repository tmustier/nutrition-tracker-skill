## Greek Yogurt 0% Fat - 200 g

```yaml
id: greek_yogurt_0pct_200g_v1
schema_version: 2
version: 1
last_verified: 2025-11-03
source:
  venue: pack/ingredient
  menu_page: 
  evidence:
aliases:
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 200
  notes: Plain 0% fat Greek yogurt.
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: 
per_portion:
  energy_kcal: 117.6
  protein_g: 20.4
  fat_g: 0.8
  sat_fat_g: 0.2
  mufa_g: 0.2
  pufa_g: 0.04
  trans_fat_g: 0
  cholesterol_mg: 10
  sugar_g: 6.4
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 72
  potassium_mg: 282
  iodine_ug: 36
  magnesium_mg: 22
  calcium_mg: 200
  iron_mg: 0
  zinc_mg: 1
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0
  carbs_available_g: 7.2
  carbs_total_g: 7.2
  copper_mg: 0
  selenium_ug: 0
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 0
  chloride_mg: 0
  sulfur_g: 0
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0
  vitamin_b2_mg: 0
  vitamin_b3_mg: 0
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0
  vitamin_b7_ug: 0
  vitamin_b9_ug: 0
  vitamin_b12_ug: 0
  choline_mg: 0
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
  gaps:
notes:
- Atwater check (available carb basis): 4×20.4 + 9×0.8 + 4×7.2 + 2×0.0 + 2.4×0.0 = 117.6 kcal
change_log:
- timestamp: '2025-11-03T08:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Initial creation based on USDA and typical 0% fat Greek yogurt nutritional data
  fields_changed: [all]
  sources: [{note: 'USDA FoodData Central - Greek yogurt, nonfat, plain. Per 100g: Energy ~59
      kcal, Protein ~10.2g, Fat ~0.4g, Carbohydrate ~3.6g (all as sugars from lactose),
      Calcium ~100mg, Potassium ~141mg. Scaled to 200g portion.', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/170903/nutrients'}]
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
```
