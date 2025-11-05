## Avocado (Fresh, 75g)

```yaml
id: avocado_fresh_75g_generic-ingredients_v1
schema_version: 2
version: 1
last_verified: 2025-11-03
source:
  venue: Generic Ingredients
  menu_page: 
  evidence:
  - USDA FoodData Central - Avocado, raw, California (Hass)
  - FDC ID: 171706
aliases:
category: ingredient
portion:
  description: 1/2 of one medium avocado (edible flesh only)
  est_weight_g: 75
  notes: Fresh Hass avocado, pit and skin removed
assumptions:
  salt_scheme: unsalted
  oil_type: 
  prep: raw
per_portion:
  energy_kcal: 120
  protein_g: 1.5
  fat_g: 11
  sat_fat_g: 1.6
  mufa_g: 7.3
  pufa_g: 1.4
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 0.5
  fiber_total_g: 5
  fiber_soluble_g: 1.2
  fiber_insoluble_g: 3.8
  sodium_mg: 5
  potassium_mg: 364
  iodine_ug: 0
  magnesium_mg: 21
  calcium_mg: 9
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 8
  manganese_mg: 0.11
  polyols_g: 0
  carbs_available_g: 1.4
  carbs_total_g: 6.4
  copper_mg: 0.13
  selenium_ug: 0.3
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 40.5
  chloride_mg: 0
  sulfur_g: 0
  vitamin_a_ug: 5.25
  vitamin_d_ug: 0
  vitamin_e_mg: 1.48
  vitamin_k_ug: 15.75
  vitamin_b1_mg: 0.05
  vitamin_b2_mg: 0.11
  vitamin_b3_mg: 1.43
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0.22
  vitamin_b7_ug: 0
  vitamin_b9_ug: 66.75
  vitamin_b12_ug: 0
  choline_mg: 10.65
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
- Scaled from USDA per 100g values: 160 kcal, 2.0g P, 14.7g F (2.1g sat, 9.8g MUFA, 1.8g PUFA), 8.5g C, 6.7g fiber, 0.7g sugar
- Average medium Hass avocado: ~150g edible flesh, so 75g = 1/2 portion
- Rich in heart-healthy monounsaturated fats (oleic acid)
- Excellent source of potassium (364mg per 75g)
- Good source of fiber (5.0g per 75g)
- Contains vitamins K, E, C, and B vitamins
- Low in sodium, naturally unsalted
- Atwater check (available carb basis): 4×1.5 + 9×11.0 + 4×1.4 + 2×5.0 + 2.4×0.0 = 120.6 kcal
- Enriched 2025-11-05 using USDA FoodData Central (FDC ID 171706) for California Hass avocados: Added 15 nutrient values (vitamins A, E, K, B1, B2, B3, B6, B9/folate, choline; minerals phosphorus, copper, selenium, manganese). Vitamin D, B12, EPA, and DHA confirmed as 0 (plant source). Iodine not tracked in USDA database.
change_log:
- timestamp: '2025-11-05T00:00:00+00:00'
  updated_by: Claude Code (Sonnet 4.5)
  reason: Enriched with 15 priority nutrients from USDA FoodData Central
  fields_changed: [vitamin_a_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b6_mg, vitamin_b9_ug, choline_mg, phosphorus_mg, copper_mg, selenium_ug, manganese_mg, omega3_epa_mg, omega3_dha_mg]
  sources: [{note: 'USDA FoodData Central - Avocado, raw, California (Hass) - FDC ID 171706', url: 'https://www.nutritionvalue.org/Avocados%2C_California%2C_raw_nutritional_value.html'}]
- timestamp: '2025-11-03T10:30:00+00:00'
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial population with USDA nutrition data for 56g portion (3/8 avocado)
  fields_changed: [all fields]
  sources: [{note: 'USDA FoodData Central - Avocado, raw, California', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/171706/nutrients'}]
- timestamp: '2025-11-03T09:10:00+00:00'
  updated_by: Claude Code (Sonnet 4.5)
  reason: Updated default portion from 3/8 (56g) to 1/2 avocado (75g) for databank consistency
  fields_changed: [portion.description, portion.est_weight_g, all per_portion nutrition values, id]
  sources: [{note: 'USDA FoodData Central - Avocado, raw, California', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/171706/nutrients'}]
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
```
