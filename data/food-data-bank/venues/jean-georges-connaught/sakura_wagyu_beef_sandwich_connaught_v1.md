## Sakura Wagyu Beef Sandwich (Jean-Georges at The Connaught)

```yaml
id: sakura_wagyu_beef_sandwich_connaught_v1
version: 4
schema_version: 2
last_verified: "2025-11-05"
source:
  venue: Jean-Georges at The Connaught, London
  menu_page: https://deliveroo.co.uk/menu/london/mayfair/jean-georges-at-the-connaught
  evidence:
  - "Deliveroo listing: 879 kcal (sandwich only, excludes chips)"
  - "ChatGPT analysis: sandwich weight ~360g, energy density ~2.4 kcal/g"
  - Macros estimated from pain de mie + seared wagyu + dressing composition
aliases: []
category: main
portion:
  description: restaurant serving
  est_weight_g: 360
  notes: Sakura wagyu beef sandwich on pain de mie; served with chips (separate item)
assumptions:
  salt_scheme: normal
  oil_type: likely neutral oil for wagyu searing
  prep: seared wagyu beef on pain de mie with dressing
  copper_estimation: Beef muscle ~0.09mg/100g, refined bread ~0.1mg/100g (USDA data).
    360g sandwich with mixed composition estimated at 0.36mg copper (0.1mg/100g average).
    Medium confidence (±20-40%).
per_portion:
  energy_kcal: 884
  protein_g: 42.0
  fat_g: 44.0
  sat_fat_g: 16.0
  mufa_g: 18.0
  pufa_g: 10.0
  trans_fat_g: 0.2
  cholesterol_mg: 90
  sugar_g: 6.0
  fiber_total_g: 4.0
  fiber_soluble_g: 1.0
  fiber_insoluble_g: 3.0
  sodium_mg: 1100
  potassium_mg: 450
  iodine_ug: 5
  magnesium_mg: 45
  calcium_mg: 80
  iron_mg: 4
  zinc_mg: 6
  vitamin_c_mg: 2
  manganese_mg: 0
  copper_mg: 0.36
  polyols_g: 0.0
  carbs_available_g: 78.0
  carbs_total_g: 82.0
  selenium_ug: 67
  chromium_ug: 4
  molybdenum_ug: 17
  phosphorus_mg: 410
  chloride_mg: 890
  sulfur_g: 0.318
  vitamin_a_ug: 5
  vitamin_d_ug: 0.1
  vitamin_e_mg: 2.1
  vitamin_k_ug: 6
  vitamin_b1_mg: 0.64
  vitamin_b2_mg: 0.60
  vitamin_b3_mg: 15
  vitamin_b5_mg: 1.4
  vitamin_b6_mg: 0.62
  vitamin_b7_ug: 12
  vitamin_b9_ug: 150
  vitamin_b12_ug: 2.5
  choline_mg: 120
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.69
  omega6_la_g: 5.8
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps:
  - ±15-25% variance expected for estimated values
notes:
- Deliveroo shows 879 kcal for sandwich; chips listed separately at 459 kcal
- "Energy density check: 879 kcal / 360g = 2.44 kcal/g (realistic for rich beef sandwich)"
- MUFA/PUFA/micronutrients estimated from wagyu beef + pain de mie composition
- 'Atwater check (available carb basis): 4×42.0 + 9×44.0 + 4×78.0 + 2×4.0 + 2.4×0.0
  = 884 kcal'
change_log:
- timestamp: 2025-10-28 20:00:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Initial population from Deliveroo + ChatGPT nutritional analysis
  fields_changed:
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.carbs_g
  - per_portion.fiber_total_g
  - per_portion.sodium_mg
  - portion.est_weight_g
  sources:
  - url: https://deliveroo.co.uk/menu/london/mayfair/jean-georges-at-the-connaught
    note: "Deliveroo calorie listing: 879 kcal"
  - url: user_input
    note: ChatGPT nutritional breakdown provided by Thomas on 2025-10-28
- timestamp: 2025-10-28 20:20:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Added estimated MUFA/PUFA and micronutrients from ingredient composition
  fields_changed:
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.trans_fat_g
  - per_portion.cholesterol_mg
  - per_portion.sugar_g
  - per_portion.potassium_mg
  - per_portion.iodine_ug
  - per_portion.magnesium_mg
  - per_portion.calcium_mg
  - per_portion.iron_mg
  - per_portion.zinc_mg
  - per_portion.vitamin_c_mg
  sources:
  - url: ingredient_analysis
    note: Estimated from typical wagyu beef + pain de mie bread composition
- timestamp: 2025-10-29 00:00:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Populate fiber split and manganese from bread composition
  fields_changed:
  - per_portion.fiber_soluble_g
  - per_portion.fiber_insoluble_g
  - per_portion.manganese_mg
  sources:
  - url: nutritional_research
    note: 'Fiber from pain de mie bread (refined wheat): ~25% soluble, 75% insoluble.
      Manganese trace in white bread and beef, rounded to 0.'
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
- timestamp: '2025-11-05T14:35:00+00:00'
  updated_by: 'Agent 4: Claude Code (Sonnet 4.5)'
  reason: 'Comprehensive nutrient enrichment using component-based USDA data for 360g wagyu sandwich (wagyu beef ~130g, pain de mie ~140g, neutral oil ~20g, garnish)'
  fields_changed: [selenium_ug, chromium_ug, molybdenum_ug, phosphorus_mg, chloride_mg, sulfur_mg, vitamin_a_ug, vitamin_d_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b7_ug, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_ala_g, omega6_la_g, version, last_verified]
  sources:
  - note: 'USDA FoodData Central - Beef wagyu composition: similar mineral/vitamin profile to regular beef with higher fat content'
    url: 'https://fdc.nal.usda.gov/'
  - note: 'USDA FoodData Central - White bread enriched (pain de mie): B vitamins, selenium, phosphorus, enriched folate'
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/172687'
  - note: 'Component aggregation for 360g sandwich. EPA/DHA remain 0 (no fish). Ultra-trace elements remain 0 (insufficient data). Copper already present at 0.36mg.'
    url: 'component_analysis'
```
