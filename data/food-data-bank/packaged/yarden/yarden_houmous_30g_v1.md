## Yarden Houmous (30g serving)

```yaml
id: yarden_houmous_30g_v1
schema_version: 2
version: 5
last_verified: 2025-11-05
source:
  venue: Yarden (Packaged Product)
  menu_page: 
  evidence:
  - Tesco product page #250438255
  - Waitrose product listing
  - FatSecret UK nutritional database
aliases:
- Yarden Hummus
category: ingredient
portion:
  description: dollop / 2 tbsp
  est_weight_g: 30
  notes: Kosher, vegetarian, tahini-based houmous
assumptions:
  salt_scheme: normal
  oil_type: sunflower or olive oil
  prep: packaged tahini-based houmous
  usda_enrichment: "Priority nutrients from USDA FoodData Central FDC ID 321358 (Hummus, commercial, Foundation), scaled from per 100g to 30g portion. Plant-based nutrients only; B12, vitamin D, EPA, and DHA remain 0 (not naturally present in unfortified chickpea-based foods). Additional 8 nutrients added 2025-11-05 - vitamin B5, omega-6 LA (2.04g - significant from sesame tahini), omega-3 ALA, calcium, magnesium, potassium, iron, zinc. Biotin (B7) not available in USDA data for this food."
per_portion:
  energy_kcal: 105.6
  protein_g: 2
  fat_g: 9.6
  sat_fat_g: 1
  mufa_g: 4.5
  pufa_g: 4.1
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 0.2
  fiber_total_g: 1.4
  fiber_soluble_g: 0.4
  fiber_insoluble_g: 1
  sodium_mg: 120
  potassium_mg: 87
  iodine_ug: 0
  magnesium_mg: 21
  calcium_mg: 12
  iron_mg: 0.73
  zinc_mg: 0.42
  vitamin_c_mg: 0
  manganese_mg: 0.32
  polyols_g: 0
  carbs_available_g: 2.1
  carbs_total_g: 3.5
  copper_mg: 0.10
  selenium_ug: 4.9
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 50
  chloride_mg: 0
  sulfur_mg: 0
  vitamin_a_ug: 0.3
  vitamin_d_ug: 0
  vitamin_e_mg: 0.52
  vitamin_k_ug: 5.2
  vitamin_b1_mg: 0.045
  vitamin_b2_mg: 0.035
  vitamin_b3_mg: 0.28
  vitamin_b5_mg: 0.10
  vitamin_b6_mg: 0.043
  vitamin_b7_ug: 0
  vitamin_b9_ug: 11
  vitamin_b12_ug: 0
  choline_mg: 14
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.20
  omega6_la_g: 2.04
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - MUFA/PUFA estimated from typical tahini/oil composition
  - Micronutrients not on label
  - Portion size "dollop" estimated at 30g
notes:
- Scaled from per 100g values: 352 kcal, 6.8g P, 32g F (3.2g sat), 7.0g C, 0.6g sugar, 4.5g fiber, 1.0g salt
- 30g serving = typical "dollop" or 2 tablespoons
- Fat composition estimated from sesame tahini (high MUFA) + vegetable oil blend
- Contains sesame; may contain eggs, soya, and mustard
- Available at Tesco, Waitrose, Morrisons; 250g tubs
- Atwater check (available carb basis): 4×2.0 + 9×9.6 + 4×2.1 + 2×1.4 + 2.4×0.0 = 105.6 kcal
change_log:
- timestamp: 2025-10-30T00:00:00+0000
  updated_by: Claude Code
  reason: Initial entry for Thomas's food diary tracking
  fields_changed: [all fields]
  sources: [{note: Yarden Houmous 250g nutrition facts (per 100g), url: 'https://www.tesco.com/groceries/en-GB/products/250438255'}]
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed: [last_verified, notes, per_portion.carbs_available_g, per_portion.carbs_g, per_portion.carbs_total_g,
  per_portion.energy_kcal, per_portion.polyols_g, version]
  sources: []
- timestamp: '2025-11-03T00:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Phase 2 nutrient estimation - fiber split for chickpea-based houmous
  fields_changed: [per_portion.fiber_soluble_g, per_portion.fiber_insoluble_g, last_verified, version]
  sources: [{note: 'Used legumes.chickpeas category (32% soluble, 68% insoluble, HIGH confidence)',
    url: fiber_split_estimation}]
  methodology: "Applied chickpea fiber split ratio to total fiber 1.4g: soluble = 1.4 \xD7 0.32 =\
  \ 0.4g, insoluble = 1.4 \xD7 0.68 = 1.0g. Houmous is chickpea-based, making this\
  \ category highly appropriate. High confidence estimation based on well-documented\
  \ chickpea fiber composition (30-35% soluble per USDA data, consistent with Marlett\
  \ et al. 2002)."
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
- timestamp: '2025-11-05T00:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: 'USDA FoodData Central enrichment: Added 13 priority nutrients from Foundation database'
  fields_changed: [vitamin_a_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b6_mg, vitamin_b9_ug, choline_mg, phosphorus_mg, copper_mg, selenium_ug, manganese_mg, last_verified, version]
  sources: [{note: 'USDA FoodData Central - Hummus, commercial (Foundation)', fdc_id: 321358, url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/321358/nutrients'}]
  methodology: "Scaled USDA per-100g values to 30g portion (×0.3). Source: FDC ID 321358 'Hummus, commercial' (Foundation). Found 13 of 17 priority nutrients: vitamin A (0.3 µg), vitamin E (0.52 mg), vitamin K (5.2 µg), thiamin/B1 (0.045 mg), riboflavin/B2 (0.035 mg), niacin/B3 (0.28 mg), vitamin B6 (0.043 mg), folate/B9 (11 µg), choline (14 mg), phosphorus (50 mg), copper (0.10 mg), selenium (4.9 µg), manganese (0.32 mg). Missing nutrients kept at 0: vitamin D, vitamin B12, iodine, EPA, and DHA (not naturally present in unfortified plant-based chickpea foods)."
- timestamp: '2025-11-05T22:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: 'USDA enrichment phase 2: Added 8 critical nutrients including omega-6 LA (critical for tahini-based houmous)'
  fields_changed: [vitamin_b5_mg, omega6_la_g, omega3_ala_g, calcium_mg, magnesium_mg, potassium_mg, iron_mg, zinc_mg, version]
  sources: [{note: 'USDA FoodData Central - Hummus, commercial (Foundation)', fdc_id: 321358, url: 'https://nutritionvalue.org/Hummus%2C_commercial_321358_nutritional_value.html'}]
  methodology: "Scaled USDA per-100g to 30g portion (×0.3). Added: vitamin B5/pantothenic acid (0.10 mg from 0.32 mg/100g), omega-6 linoleic acid LA (2.04g from 6.81g/100g - significant source from sesame tahini), omega-3 ALA (0.20g from 0.65g/100g), calcium (12mg from 41mg/100g), magnesium (21mg from 71mg/100g), potassium (87mg from 289mg/100g), iron (0.73mg from 2.42mg/100g), zinc (0.42mg from 1.39mg/100g). Biotin/B7 not available in USDA data for hummus."
```
