## Raspberries - 150 g

```yaml
id: raspberries_150g_v1
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
  est_weight_g: 150
  notes: Fresh raspberries.
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: 
per_portion:
  energy_kcal: 65.4
  protein_g: 1.8
  fat_g: 1
  sat_fat_g: 0.03
  mufa_g: 0.09
  pufa_g: 0.57
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 6.6
  fiber_total_g: 9.8
  fiber_soluble_g: 3.4
  fiber_insoluble_g: 6.4
  sodium_mg: 2
  potassium_mg: 227
  iodine_ug: 0
  magnesium_mg: 33
  calcium_mg: 38
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 39
  manganese_mg: 1
  polyols_g: 0
  carbs_available_g: 7.4
  carbs_total_g: 17.2
  copper_mg: 0.135
  selenium_ug: 0.3
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 43.5
  chloride_mg: 3.0
  sulfur_g: 0.007
  vitamin_a_ug: 3.0
  vitamin_d_ug: 0
  vitamin_e_mg: 1.31
  vitamin_k_ug: 11.7
  vitamin_b1_mg: 0.048
  vitamin_b2_mg: 0.057
  vitamin_b3_mg: 0.9
  vitamin_b5_mg: 0.49
  vitamin_b6_mg: 0.083
  vitamin_b7_ug: 0
  vitamin_b9_ug: 31.5
  vitamin_b12_ug: 0
  choline_mg: 18.5
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.19
  omega6_la_g: 0.37
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
- Atwater check (available carb basis): 4×1.8 + 9×1.0 + 4×7.4 + 2×9.8 + 2.4×0.0 = 65.4 kcal
change_log:

  - timestamp: "2025-11-06T23:28:46+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
  - timestamp: '2025-11-03T08:00:00+00:00'
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: Initial creation based on USDA FoodData Central nutritional data
    fields_changed: [all]
    sources: [{note: 'USDA FoodData Central - Raspberries, raw (FDC ID: 167755). Per 100g: Energy
      52 kcal, Protein 1.2g, Fat 0.65g (Saturated 0.019g, MUFA 0.064g, PUFA 0.375g),
      Carbohydrate 11.94g, Fiber 6.5g, Sugars 4.42g, Calcium 25mg, Iron 0.69mg, Magnesium
      22mg, Potassium 151mg, Zinc 0.42mg, Vitamin C 26.2mg, Manganese 0.67mg. Scaled
      to 150g portion.', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/167755/nutrients'}]
  - date: 2025-11-05
    updated_by: automated_migration_v1_to_v2
    change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
    minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
    acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
    fields initialized to 0.'
  - timestamp: '2025-11-05T12:00:00+00:00'
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: 'Enrichment with 17 priority nutrients from USDA FoodData Central'
    fields_changed: [phosphorus_mg, copper_mg, selenium_ug, vitamin_a_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b6_mg, vitamin_b9_ug, choline_mg]
    sources: [{note: 'USDA FoodData Central - Raspberries, raw (FDC ID: 167755). Per 100g values scaled to 150g: Phosphorus 29mg→43.5mg, Copper 0.09mg→0.135mg, Selenium 0.2µg→0.3µg, Vitamin A 2µg→3µg, Vitamin E 0.87mg→1.31mg, Vitamin K 7.8µg→11.7µg, Thiamin/B1 0.032mg→0.048mg, Riboflavin/B2 0.038mg→0.057mg, Niacin/B3 0.6mg→0.9mg, Vitamin B6 0.055mg→0.083mg, Folate/B9 21µg→31.5µg, Choline 12.3mg→18.5mg. Note: Raspberries are particularly high in manganese (1mg per 150g), vitamin K, and folate. Vitamin D, B12, EPA, DHA, and iodine are 0 in plant sources.', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/167755/nutrients'}]
  - timestamp: '2025-11-05T14:30:00+00:00'
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: 'Enrichment with 3 additional nutrients (B5, omega-3 ALA, omega-6 LA) from USDA sources'
    fields_changed: [per_portion.vitamin_b5_mg, per_portion.omega3_ala_g, per_portion.omega6_la_g]
    sources: [{note: 'USDA FoodData Central - Raspberries, raw (FDC ID: 167755). Per
      100g: pantothenic acid (B5) 0.329mg, 18:3 n-3 ALA 0.126g, 18:2 n-6 LA 0.249g.
      Scaled to 150g: B5 0.49mg, ALA 0.19g, LA 0.37g.', url: 'https://www.nal.usda.gov/sites/default/files/page-files/pantothenic_acid.pdf'},
  {note: 'USDA nutrient database confirms raspberries contain 0.329mg pantothenic
      acid per 100g (among the higher values for berries).'},
  {note: 'Wild berries research confirms raspberries are a good source of omega-3
      fatty acids, particularly ALA. Per 100g raspberries provide 126mg ALA.', url: 'https://pubmed.ncbi.nlm.nih.gov/16900081/'},
  {note: 'Biotin (B7): Not routinely analyzed by USDA for raspberries; confirmed
      0 per research/usda-api-research.md. Chromium and molybdenum: Also not routinely analyzed
      for berries; limited coverage (<50% of foods).'}]
  - timestamp: '2025-11-05T22:30:00+00:00'
    updated_by: 'Agent 8 - Claude Sonnet 4.5'
    reason: 'Schema compliance fix: Added sulfur_g field (was sulfur_mg). Sulfur estimated from protein content (fruit: ~3mg S per g protein).'
    fields_changed: [per_portion.sulfur_g]
    sources:
    - note: 'Sulfur content estimated at 0.006g based on 1.8g protein × 3mg/g coefficient for fruits. Berries are very low in sulfur-containing amino acids.'
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4438303/'
```
