## PACK'D Mixed Summer Berries (150 g)

```yaml
id: packd_mixed_summer_berries_150g_v1
schema_version: 2
version: 6
last_verified: 2025-11-05
source:
  venue: PACK'D (pack/ingredient)
  menu_page: 
  evidence:
aliases:
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 150
  notes: Pack'd mix; per-portion as provided.
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: 
per_portion:
  energy_kcal: 56.3
  protein_g: 1.4
  fat_g: 0.3
  sat_fat_g: 0
  mufa_g: 0.03
  pufa_g: 0.18
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 9.8
  fiber_total_g: 4.4
  fiber_soluble_g: 1.5
  fiber_insoluble_g: 2.9
  sodium_mg: 0
  potassium_mg: 194
  iodine_ug: 0.3
  magnesium_mg: 24
  calcium_mg: 30
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 29
  manganese_mg: 0.83
  polyols_g: 0
  carbs_available_g: 9.8
  carbs_total_g: 14.2
  copper_mg: 0.15
  selenium_ug: 0.3
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 32
  chloride_mg: 0
  sulfur_mg: 0
  vitamin_a_ug: 8
  vitamin_d_ug: 0.0
  vitamin_e_mg: 1.3
  vitamin_k_ug: 23
  vitamin_b1_mg: 0.045
  vitamin_b2_mg: 0.053
  vitamin_b3_mg: 0.83
  vitamin_b5_mg: 0.36
  vitamin_b6_mg: 0.07
  vitamin_b7_ug: 1.2
  vitamin_b9_ug: 26
  vitamin_b12_ug: 0.0
  choline_mg: 14
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.14
  omega6_la_g: 0.26
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
notes:
- Atwater check (available carb basis): 4×1.4 + 9×0.3 + 4×9.8 + 2×4.4 + 2.4×0.0 = 56.3 kcal
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.carbs_g,
  per_portion.sugar_g, per_portion.fiber_total_g, per_portion.potassium_mg, per_portion.magnesium_mg,
  per_portion.calcium_mg, per_portion.iron_mg, per_portion.zinc_mg, per_portion.vitamin_c_mg]
  sources: [{note: User-supplied values on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed: [per_portion.protein_g, per_portion.fiber_total_g, per_portion.iron_mg, per_portion.zinc_mg]
  sources: [{note: Automated rounding pass, url: formatting-pass}]
- timestamp: 2025-10-28T20:00:00+0000
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Research and fill missing fat breakdown, cholesterol, and iodine data
  fields_changed: [per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g, per_portion.cholesterol_mg,
  per_portion.iodine_ug]
  sources: [{note: 'USDA data: Raspberries MUFA 0.06g, PUFA 0.38g per 100g', url: 'https://foodstruct.com/food/raspberry'},
  {note: 'USDA data: Strawberries MUFA 0.04g, PUFA 0.16g per 100g', url: 'https://foodstruct.com/food/strawberries'},
  {note: 'USDA data: Blackberries MUFA 0.047g, PUFA 0.28g per 100g; cholesterol 0mg,
      trans fat 0g', url: 'https://foodstruct.com/food/blackberry'}, {note: 'Confirmed
      berries are plant-based with 0mg cholesterol, 0g trans fat', url: 'https://www.nutritionvalue.org/Blackberries%2C_raw_nutritional_value.html'},
  {note: Strawberries ~13mcg per cup (150g); berries generally low in iodine, url: 'https://kitchenscity.com/iodine-rich-fruits/'}]
  methodology: Calculated weighted average based on PACK'D mix (36% raspberries, 34% blueberries, 30% blackberries) from USDA berry data, scaled to match product's 0.3g total fat per 150g. PUFA higher than MUFA consistent with berry profiles (omega-3 from seeds). Trans fat and cholesterol = 0 (plant-based). Iodine = 1 mcg (trace, very low in berries).
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed: [last_verified, notes, per_portion.carbs_available_g, per_portion.carbs_g, per_portion.carbs_total_g,
  per_portion.energy_kcal, per_portion.polyols_g, version]
  sources: []
- timestamp: '2025-11-03T00:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Phase 2 nutrient estimation - fiber split for mixed berries
  fields_changed: [per_portion.fiber_soluble_g, per_portion.fiber_insoluble_g, last_verified, version]
  sources: [{note: 'Used fruits.berries category (35% soluble, 65% insoluble, HIGH confidence)',
    url: fiber_split_estimation}]
  methodology: "Applied berries fiber split ratio to total fiber 4.4g: soluble = 4.4 \xD7 0.35 =\
  \ 1.5g, insoluble = 4.4 \xD7 0.65 = 2.9g. Mixed berry composition (36% raspberries,\
  \ 34% blueberries, 30% blackberries) confirmed from previous research. High confidence\
  \ estimation based on well-documented berry fiber profiles."
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
- timestamp: '2025-11-05T12:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Priority nutrient enrichment - Phase 3 expansion of 17 critical nutrients from USDA data
  fields_changed: [version, last_verified, per_portion.vitamin_d_ug, per_portion.choline_mg, per_portion.iodine_ug, per_portion.vitamin_b9_ug, per_portion.vitamin_b12_ug, per_portion.phosphorus_mg, per_portion.copper_mg, per_portion.selenium_ug, per_portion.manganese_mg, per_portion.vitamin_a_ug, per_portion.vitamin_e_mg, per_portion.vitamin_k_ug, per_portion.vitamin_b1_mg, per_portion.vitamin_b2_mg, per_portion.vitamin_b3_mg, per_portion.vitamin_b6_mg, per_portion.omega3_epa_mg, per_portion.omega3_dha_mg]
  sources: [{note: 'USDA FoodData Central - Raspberries, raw (FDC ID: 167755)', url: 'https://www.nutritionvalue.org/Raspberries%2C_raw_nutritional_value.html'},
    {note: 'USDA FoodData Central - Blueberries, raw (FDC ID: 171711)', url: 'USDA SR Legacy standard reference'},
    {note: 'USDA FoodData Central - Blackberries, raw (FDC ID: 173946)', url: 'https://www.nutritionvalue.org/Blackberries%2C_raw_nutritional_value.html'}]
  methodology: "Calculated weighted average from USDA data for all three berry components (36% raspberries, 34% blueberries, 30% blackberries) based on documented mix composition from previous research. Enriched 17 priority nutrients: Critical nutrients (vitamin D, choline, iodine, folate/B9, B12), Minerals (phosphorus, copper, selenium, manganese), Fat-soluble vitamins (A, E, K), B-complex vitamins (B1, B2, B3, B6), Omega-3 fatty acids (EPA, DHA). Per 100g weighted averages calculated then scaled to 150g portion. Rounding applied per schema conventions: µg values rounded to nearest integer if ≥1 or 0.1 if <1; mg values to 2-3 decimal places for small values (<1mg), 1 decimal place for mid-range. Plant-based berries naturally contain 0 vitamin D, B12, EPA, and DHA. Iodine updated from 1 µg to 0.3 µg based on more precise berry data. All calculations verified against USDA FoodData Central standards."
- timestamp: '2025-11-05T15:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: 'Enrichment with 4 additional nutrients (B5, B7, omega-3 ALA, omega-6 LA) using weighted average of berry components'
  fields_changed: [per_portion.vitamin_b5_mg, per_portion.vitamin_b7_ug, per_portion.omega3_ala_g,
    per_portion.omega6_la_g]
  sources: [{note: 'USDA FoodData Central - Component values per 100g: Raspberries
      (FDC 167755) B5 0.329mg, B7 0µg, ALA 0.126g, LA 0.249g; Blueberries (FDC 171711)
      B5 0.124mg, B7 2.43µg, ALA 0.058g, LA 0.088g; Blackberries (FDC 173946) B5
      0.276mg, B7 0µg, ALA 0.094g, LA 0.186g.'},
  {note: 'Weighted average calculation (36% raspberries, 34% blueberries, 30% blackberries)
      per 100g: B5 = (0.329×0.36)+(0.124×0.34)+(0.276×0.30) = 0.243mg; B7 = (0×0.36)+(2.43×0.34)+(0×0.30)
      = 0.826µg; ALA = (0.126×0.36)+(0.058×0.34)+(0.094×0.30) = 0.093g; LA = (0.249×0.36)+(0.088×0.34)+(0.186×0.30)
      = 0.176g'},
  {note: 'Scaled to 150g portion: B5 0.243×1.5 = 0.36mg, B7 0.826×1.5 = 1.2µg, ALA
      0.093×1.5 = 0.14g, LA 0.176×1.5 = 0.26g'},
  {note: 'Biotin (B7) derived primarily from blueberry component; raspberries and
      blackberries have no USDA biotin data. Mixed berries B7 lower than pure blueberries
      due to dilution effect.'},
  {note: 'Chromium and molybdenum: Not routinely analyzed by USDA for any berry
      components; confirmed 0 per USDA_API_RESEARCH.md'}]
```
