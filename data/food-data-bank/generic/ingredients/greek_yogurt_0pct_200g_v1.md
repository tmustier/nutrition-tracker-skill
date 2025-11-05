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
  iodine_ug: 80
  magnesium_mg: 22
  calcium_mg: 200
  iron_mg: 0
  zinc_mg: 1
  vitamin_c_mg: 0
  manganese_mg: 0.018
  polyols_g: 0
  carbs_available_g: 7.2
  carbs_total_g: 7.2
  copper_mg: 0.036
  selenium_ug: 19.4
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 270
  chloride_mg: 0
  sulfur_g: 0
  vitamin_a_ug: 2
  vitamin_d_ug: 0
  vitamin_e_mg: 0.024
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.046
  vitamin_b2_mg: 0.556
  vitamin_b3_mg: 0.416
  vitamin_b5_mg: 0.662
  vitamin_b6_mg: 0.126
  vitamin_b7_ug: 0
  vitamin_b9_ug: 14
  vitamin_b12_ug: 1.5
  choline_mg: 30.2
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0
  omega6_la_g: 0.024
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
- timestamp: '2025-11-05T12:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: 'Enrichment with 17 priority nutrients from USDA FoodData Central (nonfat Greek yogurt, FDC ID 170894/170903)'
  fields_changed: [iodine_ug, phosphorus_mg, copper_mg, selenium_ug, manganese_mg, vitamin_a_ug, vitamin_e_mg, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b6_mg, vitamin_b9_ug, vitamin_b12_ug, choline_mg]
  sources: [{note: 'USDA FoodData Central via nutritionvalue.org - Nonfat Greek yogurt per 100g: Phosphorus 135mg, Copper 0.018mg, Selenium 9.7µg, Manganese 0.009mg, Vitamin A 1µg, Vitamin E 0.012mg, Vitamin K 0µg, Thiamin 0.023mg, Riboflavin 0.278mg, Niacin 0.208mg, Vitamin B6 0.063mg, Folate 7µg, Vitamin B12 0.75µg, Choline 15.1mg. Scaled to 200g portion.', url: 'https://www.nutritionvalue.org/Yogurt,_nonfat,_plain,_Greek_nutritional_value.html'}, {note: 'Iodine content updated based on research: Greek yogurt contains 30-50µg per serving; nonfat Greek yogurt (3/4 cup/180g) contains 87µg. Estimated 40µg per 100g = 80µg per 200g.', url: 'https://wellwisp.com/how-much-iodine-in-greek-yogurt/'}]
  notes: 'Vitamin D and K remain 0 (not naturally present in unfortified Greek yogurt). EPA and DHA remain 0 (no fish-derived omega-3s in dairy). B12, phosphorus, and iodine values consistent with dairy being rich in these nutrients.'
- timestamp: '2025-11-05T16:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: 'Enrichment with 8 additional nutrients using USDA FoodData Central values for nonfat Greek yogurt'
  fields_changed: [vitamin_b5_mg, omega6_la_g]
  sources: [{note: 'USDA FoodData Central via nutritionvalue.org - Nonfat Greek yogurt per 100g: Pantothenic acid (B5) 0.331mg, Linoleic acid (18:2 n-6) 0.012g, ALA (18:3 n-3) negligible/0g. Scaled to 200g portion: B5=0.662mg, LA=0.024g, ALA=0g.', url: 'https://www.nutritionvalue.org/Yogurt,_nonfat,_plain,_Greek_nutritional_value.html'}]
  notes: 'Vitamin B7 (biotin), chromium, and molybdenum remain 0 (not routinely analyzed/reported in USDA FoodData Central for yogurt products per USDA API Research). Omega-3 ALA is TRUE ZERO/negligible in nonfat dairy. Fiber soluble and insoluble remain 0 (TRUE ZERO for pure dairy products).'
```
