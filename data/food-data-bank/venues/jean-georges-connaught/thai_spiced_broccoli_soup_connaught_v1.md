## Thai Spiced Broccoli Soup (Jean-Georges at The Connaught)

```yaml
id: thai_spiced_broccoli_soup_connaught_v1
version: 4
schema_version: 2
last_verified: "2025-11-02"
source:
  venue: Jean-Georges at The Connaught, London
  menu_page: https://deliveroo.co.uk/menu/london/mayfair/jean-georges-at-the-connaught
  evidence:
  - "Deliveroo listing: 110 kcal"
  - "Description: Coconut & lime froth, coriander"
  - Macros estimated from typical Thai broccoli soup composition
aliases:
- Spiced Thai Broccoli Soup
category: main
portion:
  description: restaurant serving
  est_weight_g: 300
  notes: Thai spiced broccoli soup with coconut & lime froth, coriander
assumptions:
  salt_scheme: normal
  oil_type: coconut oil/milk
  prep: blended soup with coconut, Thai spices, lime
  copper_estimation: Broccoli contains ~0.1mg copper per 100g (USDA vegetables range).
    300g soup portion estimated at 0.3mg copper total. Medium confidence (±20-40%).
per_portion:
  energy_kcal: 117.5
  protein_g: 3.5
  fat_g: 6.5
  sat_fat_g: 5.0
  mufa_g: 0.4
  pufa_g: 0.1
  trans_fat_g: 0.0
  cholesterol_mg: 0
  sugar_g: 3.0
  fiber_total_g: 3.5
  fiber_soluble_g: 0.3
  fiber_insoluble_g: 3.2
  sodium_mg: 500
  potassium_mg: 350
  iodine_ug: 2
  magnesium_mg: 25
  calcium_mg: 45
  iron_mg: 1
  zinc_mg: 0
  vitamin_c_mg: 40
  manganese_mg: 0
  copper_mg: 0.3
  polyols_g: 0.0
  carbs_available_g: 9.5
  carbs_total_g: 13.0
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
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: low
  gaps:
  - Macros estimated from ingredient composition (broccoli + coconut)
  - Micronutrients scaled from typical broccoli soup profiles
  - No official nutritional breakdown available beyond calories
  - Fatty acid breakdown (MUFA/PUFA) calculated from coconut milk composition
notes:
- 110 kcal from Deliveroo
- Estimated ~300g portion based on typical soup serving
- High sat fat from coconut milk/cream
- Good vitamin C from broccoli
- 'Atwater check (available carb basis): 4×3.5 + 9×6.5 + 4×9.5 + 2×3.5 + 2.4×0.0 =
  117.5 kcal'
change_log:
- timestamp: 2025-10-28 20:15:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Initial population from Deliveroo calorie count + estimated macros/micros
  fields_changed:
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.carbs_g
  - per_portion.sugar_g
  - per_portion.fiber_total_g
  - per_portion.sodium_mg
  - per_portion.potassium_mg
  - per_portion.magnesium_mg
  - per_portion.calcium_mg
  - per_portion.iron_mg
  - per_portion.zinc_mg
  - per_portion.vitamin_c_mg
  - portion.est_weight_g
  sources:
  - url: https://deliveroo.co.uk/menu/london/mayfair/jean-georges-at-the-connaught
    note: 'Deliveroo calorie listing: 110 kcal; description: Coconut & lime froth,
      coriander'
  - url: user_input
    note: Calorie count provided by Thomas on 2025-10-28
- timestamp: 2025-10-28 21:00:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Added missing fatty acid breakdown and micronutrients based on coconut milk
    composition
  fields_changed:
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.trans_fat_g
  - per_portion.cholesterol_mg
  - per_portion.iodine_ug
  - version
  sources:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/171904/nutrients
    note: 'USDA FoodData Central: Coconut milk (canned) - fat composition ~83% saturated,
      ~6% MUFA, ~2% PUFA'
  - url: research_analysis
    note: 'Applied coconut fat ratios to 6.5g total fat: MUFA=0.4g (6%), PUFA=0.1g
      (2%), trans=trace. Cholesterol=0mg (plant-based). Iodine=2ug (trace from broccoli
      ~1-2ug/100g)'
- timestamp: 2025-10-29 00:00:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Populate fiber split and manganese from broccoli composition
  fields_changed:
  - per_portion.fiber_soluble_g
  - per_portion.fiber_insoluble_g
  - per_portion.manganese_mg
  sources:
  - url: nutritional_research
    note: 'Broccoli fiber: ~9% soluble, 91% insoluble. Estimated 0.3g soluble, 3.2g
      insoluble for soup. Manganese diluted by coconut base, rounded to 0.'
- timestamp: "2025-11-02T19:20:00+00:00"
  updated_by: "LLM: GPT-5 Codex"
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed:
  - last_verified
  - notes
  - per_portion.carbs_available_g
  - per_portion.carbs_g
  - per_portion.carbs_total_g
  - per_portion.energy_kcal
  - per_portion.polyols_g
  - version
  sources: []
```
