## Ketchup Pot, 25g (Jean-Georges at The Connaught)

```yaml
id: ketchup_pot_connaught_v1
schema_version: 2
version: 4
last_verified: 2025-11-02
source:
  venue: Jean-Georges at The Connaught, London
  menu_page: "https://deliveroo.co.uk/menu/london/mayfair/jean-georges-at-the-connaught"
  evidence:
  - Based on Heinz UK ketchup profile (102 kcal per 100g, 23.2g carbs, 22.8g sugar, 1.8g salt/707mg sodium per 100g)
  - Micronutrients from USDA FoodData Central (FDC 168556) for standard tomato ketchup
  - Fatty acid profile from USDA database
  - Scaled to 25g pot
aliases:
category: side
portion:
  description: condiment pot (25g)
  est_weight_g: 25
  notes: Tomato ketchup; assumed Heinz UK profile
assumptions:
  salt_scheme: normal
  oil_type: n/a
  prep: commercial ketchup
per_portion:
  energy_kcal: 24.6
  protein_g: 0.3
  fat_g: 0
  sat_fat_g: 0
  mufa_g: 0
  pufa_g: 0
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 5.7
  fiber_total_g: 0.1
  fiber_soluble_g: 0
  fiber_insoluble_g: 0.1
  sodium_mg: 177
  potassium_mg: 70
  iodine_ug: 0.3
  magnesium_mg: 3
  calcium_mg: 4
  iron_mg: 0.1
  zinc_mg: 0
  vitamin_c_mg: 1
  manganese_mg: 0
  polyols_g: 0
  carbs_available_g: 5.8
  carbs_total_g: 5.9
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
- 25g pot assumed based on typical UK restaurant ketchup portion
- If pot was 30g: add ~5 kcal, +1.2g carbs, +35mg sodium
- Atwater check (available carb basis): 4×0.3 + 9×0.0 + 4×5.8 + 2×0.1 + 2.4×0.0 = 24.6 kcal
change_log:
- timestamp: 2025-10-28 20:00:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Initial population based on Heinz UK ketchup profile scaled to 25g
  fields_changed: [per_100g.energy_kcal, per_100g.protein_g, per_100g.fat_g, per_100g.sat_fat_g, per_100g.carbs_g,
  per_100g.fiber_total_g, per_100g.sodium_mg, per_portion.energy_kcal, per_portion.protein_g,
  per_portion.fat_g, per_portion.sat_fat_g, per_portion.carbs_g, per_portion.fiber_total_g,
  per_portion.sodium_mg, portion.est_weight_g]
  sources: [{note: 'ChatGPT nutritional breakdown provided by Thomas on 2025-10-28, based on
      Heinz UK', url: user_input}]
- timestamp: 2025-10-28 21:30:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Complete missing nutrition data with research-backed values
  fields_changed: [per_100g.mufa_g, per_100g.pufa_g, per_100g.trans_fat_g, per_100g.cholesterol_mg,
  per_100g.sugar_g, per_100g.potassium_mg, per_100g.iodine_ug, per_100g.magnesium_mg,
  per_100g.calcium_mg, per_100g.iron_mg, per_100g.zinc_mg, per_100g.vitamin_c_mg,
  per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g, per_portion.cholesterol_mg,
  per_portion.sugar_g, per_portion.potassium_mg, per_portion.iodine_ug, per_portion.magnesium_mg,
  per_portion.calcium_mg, per_portion.iron_mg, per_portion.zinc_mg, per_portion.vitamin_c_mg]
  sources: [{note: 'Heinz UK tomato ketchup: 22.8g sugar per 100g', url: 'https://www.sainsburys.co.uk/gol-ui/product/heinz-tomato-ketchup-910g'},
  {note: 'USDA FoodData Central FDC 168556: micronutrients (potassium 281mg, calcium
      15mg, iron 0.35mg, magnesium 13mg, zinc 0.17mg, vitamin C 4.1mg per 100g)',
    url: 'https://fdc.nal.usda.gov/food-details/168556/nutrients'}, {note: 'USDA iodine
      database: ~1.2 mcg per 100g ketchup', url: 'https://www.ars.usda.gov/ARSUSERFILES/80400535/DATA/IODINE/'},
  {note: 'Fatty acid profile: MUFA 0.01g, PUFA 0.04g, trans fat 0g, cholesterol 0mg
      per 100g', url: various USDA sources}]
- timestamp: 2025-10-29 00:00:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Populate fiber split and manganese for minimal fiber content
  fields_changed: [per_portion.fiber_soluble_g, per_portion.fiber_insoluble_g, per_portion.manganese_mg]
  sources: [{note: 'Tomato fiber is predominantly insoluble. With 0.1g total, split as 0.0g soluble
      (rounded from ~0.03g), 0.1g insoluble. Manganese trace, rounded to 0.', url: nutritional_research}]
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
```
