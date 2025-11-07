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
  - "Ingredients: hummus, chickpeas, olive oil, tomato ovaries, spicy salsa (pita served separately)"
  - "Reviews describe as 'huge' and 'generous' portion with loads of olive oil"
  - "User consumed 1/3 of full plate (estimated 390g total, pita NOT included in plate)"
  - "Component breakdown for 1/3 portion: hummus 83g, whole chickpeas 20g, olive oil 8g, tomato 13g, salsa 8g"
  - "Total user portion: 132g (plate only, pita logged separately)"
  - "USDA sources: Hummus commercial (FDC 174289), Chickpeas cooked (FDC 173757), Olive oil (FDC 171413), Tomato raw (FDC 170457)"
aliases:
- Best hummus plate that you will ever eat
- Miznon hummus
category: main
portion:
  description: "1/3 of restaurant plate (pita NOT included)"
  est_weight_g: 132
  notes: "Israeli-style hummus plate with generous olive oil, whole chickpeas, tomato ovaries, green chili salsa. Full plate estimated at 390g (without pita); user ate 1/3 portion (132g). Pita bread served separately - log pita separately."
assumptions:
  salt_scheme: "normal"
  oil_type: "extra virgin olive oil"
  prep: "Hummus base (83g) made from chickpeas and tahini, topped with warm whole chickpeas (20g), generous olive oil drizzle (8g), fresh tomato ovaries/seeds (13g), spicy green chili salsa (8g). Sodium from hummus (340mg/100g commercial) and minimal from other components. Pita bread served separately - not included in this entry."
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 244
  protein_g: 8.7
  fat_g: 16.6
  sat_fat_g: 2.3
  mufa_g: 8.9
  pufa_g: 4.3
  trans_fat_g: 0.0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 18.4
  carbs_available_g: 11.5
  sugar_g: 3.0
  fiber_total_g: 7.0
  fiber_soluble_g: 2.3
  fiber_insoluble_g: 4.7
  polyols_g: 0.0
  # Minerals
  sodium_mg: 283
  potassium_mg: 305
  iodine_ug: 0
  magnesium_mg: 71
  calcium_mg: 58
  iron_mg: 2.6
  zinc_mg: 1.3
  vitamin_c_mg: 9
  manganese_mg: 0.9
  copper_mg: 0.40
  selenium_ug: 3
  chromium_ug: 0
  molybdenum_ug: 12
  phosphorus_mg: 165
  chloride_mg: 435
  sulfur_g: 0.04
  # Vitamins
  vitamin_a_ug: 14
  vitamin_d_ug: 0.0
  vitamin_e_mg: 1.8
  vitamin_k_ug: 9
  vitamin_b1_mg: 0.17
  vitamin_b2_mg: 0.03
  vitamin_b3_mg: 0.4
  vitamin_b5_mg: 0.4
  vitamin_b6_mg: 0.12
  vitamin_b7_ug: 4
  vitamin_b9_ug: 110
  vitamin_b12_ug: 0.0
  choline_mg: 46
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.07
  omega6_la_g: 2.4
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
  fat_unassigned_g: 1.0
  dish_weight_g: 132
quality:
  confidence: medium
  gaps:
  - "Vitamin B7 (biotin) estimated at 4µg (midpoint of 3-5µg range from chickpeas/hummus, USDA data incomplete)"
  - "Iodine set to 0 (trace only) - plant foods have minimal iodine unless grown in iodine-rich soil"
  - "Fiber soluble/insoluble split estimated at 33%/67% based on chickpea fiber profiles"
  - "Molybdenum estimated at 12µg from legume content (chickpeas are rich source)"
notes:
- "CORRECTED 2025-11-07: Removed pita from this entry (was double-counted). Pita must be logged separately."
- "Component-based estimation for 1/3 portion: Hummus 83g + whole chickpeas 20g + olive oil 8g + tomato 13g + salsa 8g = 132g total (NO pita)"
- "Full plate estimated at 390g (without pita) based on 'huge' and 'generous' descriptions in reviews"
- "Hummus provides excellent plant protein and fiber from chickpeas and tahini"
- "High MUFA content from olive oil drizzle and tahini in hummus (73% of fat)"
- "Good source of folate (B9), iron, magnesium, and manganese from chickpeas and tahini"
- "Zero cholesterol - fully plant-based dish"
- "Atwater calculation: 4×8.7 + 9×16.6 + 4×11.5 + 2×7.0 = 34.8 + 149.4 + 46.0 + 14.0 = 244.2 kcal (rounded to 244 kcal)"
- "Energy standardization: Per ESTIMATE.md, USDA-based estimates use Atwater formula for consistency"
change_log:
- timestamp: "2025-11-07T21:30:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "PR review improvement: Standardize energy to Atwater calculation and fix vitamin B7 estimate"
  fields_changed: ["energy_kcal", "vitamin_b7_ug"]
  notes: "Energy consistency principle from ESTIMATE.md: Since all values are USDA-based estimates (not label data), energy must equal Atwater formula result. Updated from 238 to 244 kcal (Atwater: 4×8.7 + 9×16.6 + 4×11.5 + 2×7.0 = 244.2 kcal). Also updated vitamin B7 from 0 to 4µg (midpoint of 3-5µg estimate for chickpeas/hummus)."
- timestamp: "2025-11-07T20:00:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "CRITICAL FIX: Removed 70g pita that was double-counted (pita logged separately by user)"
  fields_changed:
  - "portion.est_weight_g: 202 → 132 (removed 70g pita)"
  - "Subtracted 70g pita nutrition from all 52 fields (scaled from 60g pita × 1.1667)"
  - "energy_kcal: 430 → 238 (-192 kcal, -45%)"
  - "protein_g: 15.1 → 8.7 (-6.4g)"
  - "carbs_total_g: 57.4 → 18.4 (-39.0g)"
  - "sodium_mg: 657 → 283 (-374mg)"
  - "potassium_mg: 389 → 305 (-84mg)"
  - "Updated evidence, portion description, notes, Atwater validation"
  - "molybdenum_ug: 5 → 12 (corrected estimate for chickpeas/hummus only)"
  sources:
  - note: "User correctly identified double-counting: hummus plate entry included pita, but user also logged pita separately (1/3 + 2/3)"
  - note: "Original entry mistakenly included 70g pita in 202g total; corrected to 132g (hummus+chickpeas+oil+tomato+salsa only)"
  - note: "Pita nutrition calculated from pita_bread_miznon_v1.md (60g base) scaled to 70g (×1.1667)"
- timestamp: "2025-11-07T12:30:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "Initial population via comprehensive component-based estimation using USDA data"
  fields_changed:
  - "All 52 nutrition fields populated from component analysis"
  - "version: 1"
  - "portion.est_weight_g: 202 (INCORRECT - included pita)"
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
