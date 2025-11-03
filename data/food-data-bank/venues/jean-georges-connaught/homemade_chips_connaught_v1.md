## Home-made Chips (Jean-Georges at The Connaught)

```yaml
id: homemade_chips_connaught_v1
version: 4
last_verified: '2025-11-02'
source:
  venue: Jean-Georges at The Connaught, London
  menu_page: https://deliveroo.co.uk/menu/london/mayfair/jean-georges-at-the-connaught
  evidence:
  - 'Deliveroo listing: 459 kcal'
  - Macros scaled from McDonald's UK medium fries profile to match 459 kcal anchor
aliases: []
category: side
portion:
  description: restaurant side serving
  est_weight_g: null
  notes: Home-made chips; served with Sakura Wagyu Beef Sandwich
assumptions:
  salt_scheme: normal
  oil_type: neutral frying oil
  prep: deep-fried
  copper_estimation: Potatoes contain ~0.1mg copper per 100g (USDA data). Estimated
    ~150g potato portion = 0.15mg copper total. Medium confidence (±20-40%).
per_portion:
  energy_kcal: 465.4
  protein_g: 4.5
  fat_g: 23.2
  sat_fat_g: 2.0
  mufa_g: 6.3
  pufa_g: 14.6
  trans_fat_g: 0.1
  cholesterol_mg: 0
  sugar_g: 0.3
  fiber_total_g: 4.9
  fiber_soluble_g: 1.3
  fiber_insoluble_g: 3.6
  sodium_mg: 321
  potassium_mg: 1194
  iodine_ug: 2
  magnesium_mg: 57
  calcium_mg: 22
  iron_mg: 0.9
  zinc_mg: 0.9
  vitamin_c_mg: 16
  manganese_mg: 1
  copper_mg: 0.15
  polyols_g: 0.0
  carbs_available_g: 57.2
  carbs_total_g: 62.1
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps:
  - Portion weight estimated from calorie content
  - Per 100g values not calculated
  - MUFA/PUFA estimated from typical frying oil composition
notes:
- Macros scaled from McDonald's UK medium fries to anchor 459 kcal from Deliveroo
- Listed separately from Sakura sandwich on Deliveroo
- 'Atwater check (available carb basis): 4×4.5 + 9×23.2 + 4×57.2 + 2×4.9 + 2.4×0.0
  = 465.4 kcal'
change_log:
- timestamp: 2025-10-28 20:00:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Initial population from Deliveroo + ChatGPT nutritional analysis
  fields_changed:
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.carbs_g
  - per_portion.fiber_total_g
  - per_portion.sodium_mg
  sources:
  - url: https://deliveroo.co.uk/menu/london/mayfair/jean-georges-at-the-connaught
    note: 'Deliveroo calorie listing: 459 kcal'
  - url: user_input
    note: ChatGPT nutritional breakdown provided by Thomas on 2025-10-28
- timestamp: 2025-10-28 22:30:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Research and populate missing nutrition data based on USDA database and
    UK food composition tables
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
  - url: https://www.nutridex.org.uk/foods/2aehdsc/potato-chips-homemade-fried-in-rapeseed-oil
    note: 'UK food composition data: potassium 812mg/100g, magnesium 39mg/100g, calcium
      15mg/100g, iron 0.64mg/100g, zinc 0.6mg/100g, vitamin C 11mg/100g'
  - url: research
    note: 'MUFA/PUFA calculated from typical vegetable frying oil composition (sunflower/soybean
      blend: ~27% MUFA, ~63% PUFA of total fat)'
  - url: research
    note: Sugar 0.21g/100g from McDonald's french fries data; cholesterol 0mg (vegetable
      oil); trans fat 0.1g (modern vegetable oils); iodine 1-2mcg/100g (potato is
      very low in iodine)
- timestamp: 2025-10-29 00:00:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Populate fiber split and manganese from potato composition
  fields_changed:
  - per_portion.fiber_soluble_g
  - per_portion.fiber_insoluble_g
  - per_portion.manganese_mg
  sources:
  - url: nutritional_research
    note: 'Potato fiber: ~26% soluble, 74% insoluble. Manganese ~0.4mg/100g in french
      fries; estimated 1mg for ~150g portion.'
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
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
