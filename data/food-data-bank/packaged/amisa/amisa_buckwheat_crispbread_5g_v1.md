## Amisa Buckwheat Crispbread (per piece, 5g)

```yaml
id: amisa_buckwheat_crispbread_5g_v1
schema_version: 2
version: 6
last_verified: 2025-11-05
source:
  venue: Amisa (Packaged Product)
  menu_page: 
  evidence:
  - Amisa official UK product page
  - Multiple UK retailer listings (Tesco, Ocado, Holland & Barrett)
aliases:
- Amisa Organic Gluten Free Buckwheat Crispbread
category: ingredient
portion:
  description: 1 crispbread slice
  est_weight_g: 5
  notes: "Organic, gluten-free, only 2 ingredients: buckwheat flour (98.5%) + sea salt (1.5%)"
assumptions:
  salt_scheme: light
  oil_type:
  prep: baked crispbread
  nutrient_enrichment: "17 priority nutrients (vitamins B1-B3, B6, B9, E, K; minerals phosphorus, copper, selenium, manganese; choline) sourced from USDA FoodData Central SR Legacy buckwheat flour (FDC ID 170687) and scaled from per-100g to 5g portion. Vitamins A, D, B12, and omega-3 EPA/DHA remain 0 as scientifically appropriate for plant-based product. Additional 8 nutrients added 2025-11-05 - vitamin B5, omega-6 LA (0.035g from buckwheat), omega-3 ALA (0.004g), calcium, magnesium, potassium, iron, zinc. Biotin (B7) not available in USDA data."
per_portion:
  energy_kcal: 17.3
  protein_g: 0.5
  fat_g: 0.1
  sat_fat_g: 0
  mufa_g: 0.1
  pufa_g: 0
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 0.1
  fiber_total_g: 0.4
  fiber_soluble_g: 0.1
  fiber_insoluble_g: 0.3
  sodium_mg: 24
  potassium_mg: 29
  iodine_ug: 0
  magnesium_mg: 13
  calcium_mg: 2
  iron_mg: 0.20
  zinc_mg: 0.16
  vitamin_c_mg: 0
  manganese_mg: 0.102
  polyols_g: 0
  carbs_available_g: 3.4
  carbs_total_g: 3.8
  copper_mg: 0.026
  selenium_ug: 0.285
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 16.85
  chloride_mg: 0
  sulfur_g: 0
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0.016
  vitamin_k_ug: 0.35
  vitamin_b1_mg: 0.021
  vitamin_b2_mg: 0.010
  vitamin_b3_mg: 0.308
  vitamin_b5_mg: 0.022
  vitamin_b6_mg: 0.029
  vitamin_b7_ug: 0
  vitamin_b9_ug: 2.7
  vitamin_b12_ug: 0
  choline_mg: 2.71
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.004
  omega6_la_g: 0.035
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps:
  - Fat split estimated from buckwheat composition
  - Micronutrients not labeled
notes:
- Scaled from per 100g values: 340 kcal, 10.8g P, 2.7g F (0.63g sat), 68.2g C, 1.3g sugar, 8.4g fiber, 1.2g salt (480mg sodium)
- Weight per crispbread confirmed at 5g by user
- 120g package contains 24 crispbreads
- Vegan, organic, gluten-free certified
- Atwater check (available carb basis): 4×0.5 + 9×0.1 + 4×3.4 + 2×0.4 + 2.4×0.0 = 17.3 kcal
change_log:
- timestamp: 2025-10-30T00:00:00+0000
  updated_by: Claude Code
  reason: Initial entry for Thomas's food diary tracking
  fields_changed: [all fields]
  sources: [{note: Amisa buckwheat crispbread nutrition (per 100g), url: 'https://amisa.co.uk/products/amisa-organic-gluten-free-buckwheat-crispbread/'}]
- timestamp: 2025-10-30T00:00:00+0000
  updated_by: Claude Code
  reason: Corrected weight from 8g to 5g per crispbread based on user confirmation; recalculated all nutrition values
  fields_changed: [portion.est_weight_g, per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g,
  per_portion.sat_fat_g, per_portion.carbs_g, per_portion.fiber_total_g, per_portion.sodium_mg,
  id]
  sources: [{note: User confirmed crispbread weight is 5g per piece, url: user_correction}]
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed: [last_verified, notes, per_portion.carbs_available_g, per_portion.carbs_g, per_portion.carbs_total_g,
  per_portion.energy_kcal, per_portion.polyols_g, version]
  sources: []
- timestamp: '2025-11-03T00:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Phase 2 nutrient estimation - fiber split for buckwheat crispbread
  fields_changed: [per_portion.fiber_soluble_g, per_portion.fiber_insoluble_g, last_verified, version]
  sources: [{note: 'Used grains.quinoa category for ancient grains (25% soluble, 75% insoluble,
      LOW confidence)', url: fiber_split_estimation}]
  methodology: "Applied ancient grains (quinoa/buckwheat) fiber split ratio to total fiber 0.4g:\
  \ soluble = 0.4 \xD7 0.25 = 0.1g, insoluble = 0.4 \xD7 0.75 = 0.3g. Buckwheat is\
  \ a pseudo-cereal similar to quinoa. Product is 98.5% buckwheat flour. Low confidence\
  \ estimate due to limited specific data on buckwheat fiber composition, but more\
  \ specific than general plant foods category."
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
- timestamp: '2025-11-05T00:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Enriched with 17 priority nutrients from USDA FoodData Central SR Legacy buckwheat flour
  fields_changed: [phosphorus_mg, copper_mg, selenium_ug, manganese_mg, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b6_mg, vitamin_b9_ug, choline_mg, last_verified, version]
  sources: [{note: 'USDA FoodData Central - Buckwheat flour, whole-groat (SR Legacy)', fdc_id: 170687, url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/170687/nutrients'}]
  methodology: "Scaled USDA per-100g nutrient values to 5g portion size (÷20). Product is 98.5% buckwheat flour, making this an appropriate reference food. Values for vitamin_a_ug, vitamin_d_ug, vitamin_b12_ug, iodine_ug, omega3_epa_mg, and omega3_dha_mg remain 0 as scientifically appropriate for plant-based buckwheat product (no animal-source nutrients)."
- timestamp: '2025-11-05T22:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: 'USDA enrichment phase 2: Added 8 critical nutrients for whole grain buckwheat crispbread'
  fields_changed: [vitamin_b5_mg, omega6_la_g, omega3_ala_g, calcium_mg, magnesium_mg, potassium_mg, iron_mg, zinc_mg, version]
  sources: [{note: 'USDA FoodData Central - Buckwheat flour, whole-groat (SR Legacy)', fdc_id: 170687, url: 'https://nutritionvalue.org/Buckwheat_flour%2C_whole-groat_170687_nutritional_value.html'}]
  methodology: "Scaled USDA per-100g to 5g portion (÷20). Added: vitamin B5/pantothenic acid (0.022 mg from 0.44 mg/100g - good source for whole grains), omega-6 linoleic acid LA (0.035g estimated from PUFA content), omega-3 ALA (0.004g from 0.071g/100g), calcium (2mg from 41mg/100g), magnesium (13mg from 251mg/100g - excellent for pseudo-cereal), potassium (29mg from 577mg/100g), iron (0.20mg from 4.06mg/100g), zinc (0.16mg from 3.12mg/100g). Biotin/B7 not available in USDA data for buckwheat."
```
