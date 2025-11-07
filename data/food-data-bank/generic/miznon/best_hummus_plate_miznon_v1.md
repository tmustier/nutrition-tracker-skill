## The best hummus plate (Miznon)

```yaml
id: best_hummus_plate_miznon_v1
version: 1
schema_version: 2
last_verified: "2025-11-07"
source:
  venue: Miznon, Soho, London
  menu_page: "https://deliveroo.co.uk/menu/London/soho/miznon-soho"
  evidence:
  - "Deliveroo listing: The best hummus plate £14.40"
  - "Ingredients: hummus, chickpeas, olive oil, tomato ovaries, spicy salsa, pita"
  - "Reviews describe as 'huge' and 'generous' portion with loads of olive oil"
  - "User consumed 1/3 of full plate (estimated 470g total) + 1 pita (70g)"
  - "Component breakdown for 1/3 portion: hummus 83g, whole chickpeas 20g, olive oil 8g, tomato 13g, salsa 8g, pita 70g"
  - "Total user portion: 202g"
  - "USDA sources: Hummus commercial (FDC 174289), Chickpeas cooked (FDC 173757), Olive oil (FDC 171413), Tomato raw (FDC 170457), Pita white (FDC 172816)"
aliases:
- Best hummus plate that you will ever eat
- Miznon hummus
category: main
portion:
  description: "1/3 of restaurant plate with 1 pita bread"
  est_weight_g: 202
  notes: "Israeli-style hummus plate with generous olive oil, whole chickpeas, tomato ovaries, green chili salsa, and pita. Full plate estimated at 470g; user ate 1/3 portion."
assumptions:
  salt_scheme: "normal"
  oil_type: "extra virgin olive oil"
  prep: "Hummus base (83g) made from chickpeas and tahini, topped with warm whole chickpeas (20g), generous olive oil drizzle (8g), fresh tomato ovaries/seeds (13g), spicy green chili salsa (8g), served with 1 white pita bread (70g). Sodium from hummus (340mg/100g commercial), pita bread (530mg/100g), and minimal from other components."
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 430
  protein_g: 15.1
  fat_g: 17.4
  sat_fat_g: 2.4
  mufa_g: 9.0
  pufa_g: 4.7
  trans_fat_g: 0.0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 57.4
  carbs_available_g: 48.9
  sugar_g: 3.7
  fiber_total_g: 8.5
  fiber_soluble_g: 2.8
  fiber_insoluble_g: 5.7
  polyols_g: 0.0
  # Minerals
  sodium_mg: 657
  potassium_mg: 389
  iodine_ug: 1
  magnesium_mg: 88
  calcium_mg: 117
  iron_mg: 4.9
  zinc_mg: 2.5
  vitamin_c_mg: 9
  manganese_mg: 1.2
  copper_mg: 0.52
  selenium_ug: 22
  chromium_ug: 0
  molybdenum_ug: 5
  phosphorus_mg: 233
  chloride_mg: 1012
  sulfur_g: 0.06
  # Vitamins
  vitamin_a_ug: 14
  vitamin_d_ug: 0.0
  vitamin_e_mg: 1.9
  vitamin_k_ug: 10
  vitamin_b1_mg: 0.52
  vitamin_b2_mg: 0.24
  vitamin_b3_mg: 3.2
  vitamin_b5_mg: 0.6
  vitamin_b6_mg: 0.16
  vitamin_b7_ug: 0
  vitamin_b9_ug: 164
  vitamin_b12_ug: 0.0
  choline_mg: 53
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.11
  omega6_la_g: 2.7
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
  fat_unassigned_g: 1.3
  dish_weight_g: 202
quality:
  confidence: medium
  gaps:
  - "Vitamin B7 (biotin) set to 0 - chickpeas contain biotin but USDA data incomplete; estimate 3-5µg"
  - "Iodine trace only - plant foods have minimal iodine unless grown in iodine-rich soil"
  - "Fiber soluble/insoluble split estimated at 33%/67% based on chickpea and grain fiber profiles"
  - "Molybdenum estimated at 5µg from legume content (chickpeas)"
notes:
- "Component-based estimation for 1/3 portion: Hummus 83g + whole chickpeas 20g + olive oil 8g + tomato 13g + salsa 8g + pita 70g = 202g total"
- "Full plate estimated at 470g based on 'huge' and 'generous' descriptions in reviews"
- "Hummus provides excellent plant protein and fiber from chickpeas and tahini"
- "High MUFA content from olive oil drizzle and tahini in hummus"
- "Excellent source of folate (B9) from chickpeas and fortified pita"
- "Good source of iron, magnesium, and manganese from legumes"
- "Zero cholesterol - fully plant-based dish"
- "Atwater validation: 4×15.1 + 9×17.4 + 4×48.9 + 2×8.5 = 429.6 kcal (±0.1%)"
change_log:
- timestamp: "2025-11-07T12:30:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "Initial population via comprehensive component-based estimation using USDA data"
  fields_changed:
  - "All 52 nutrition fields populated from component analysis"
  - "version: 1"
  - "portion.est_weight_g: 202"
  - "schema_version: 2"
  sources:
  - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/174289/nutrients"
    note: "USDA FoodData Central: Hummus, commercial - 83g portion"
  - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/173757/nutrients"
    note: "USDA FoodData Central: Chickpeas, mature seeds, cooked, boiled - 20g portion"
  - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/171413/nutrients"
    note: "USDA FoodData Central: Oil, olive, salad or cooking - 8g portion"
  - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170457/nutrients"
    note: "USDA FoodData Central: Tomatoes, raw - 13g portion"
  - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/172816/nutrients"
    note: "USDA FoodData Central: Bread, pita, white - 70g (1 pita)"
  - url: "https://deliveroo.co.uk/menu/London/soho/miznon-soho"
    note: "Deliveroo menu listing for The best hummus plate (£14.40)"
  - url: "https://www.hot-dinners.com/Gastroblog/Test-drive/miznon-soho-london-restaurant-review"
    note: "Review describing hummus plate as generous with loads of olive oil"
  - url: "https://mountzeroolives.com/recipe/164/miznon-s-hummus"
    note: "Miznon's hummus recipe showing chickpeas, tahini, garlic, olive oil, lemon methodology"
  - note: "Component weight estimation based on 'huge' portion descriptions and Israeli restaurant serving standards"
  - note: "Chloride calculated from sodium (×1.54 for NaCl ratio)"
  - note: "Sulfur calculated from protein (×0.004 for plant sources)"
  - note: "Fiber split (33% soluble / 67% insoluble) based on chickpea and grain profiles"
  - note: "Fatty acid profile: Olive oil provides 73% MUFA; tahini in hummus provides additional MUFA/PUFA; totals account for sesame paste contribution"
```
