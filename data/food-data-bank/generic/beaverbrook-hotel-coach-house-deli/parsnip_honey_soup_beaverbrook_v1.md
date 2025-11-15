## Parsnip and Honey Soup (Beaverbrook)

```yaml
id: parsnip_honey_soup_beaverbrook_v1
version: 1
last_verified: 2025-11-15
source:
  venue: Beaverbrook Hotel - Coach House Deli
  menu_page: "https://www.beaverbrook.co.uk/"
  evidence:
    - "Component-based estimation using USDA FoodData Central"
    - "Upscale hotel spa deli soup portion: 280mL (295g)"
    - "Main components: parsnips (120g), heavy cream (40g), honey (8g), olive oil drizzle (8g), butter (5g), vegetable stock (100g), aromatics"
    - "USDA sources: Parsnips cooked, heavy cream, honey, olive oil"
aliases:
  - "Parsnip Soup"
  - "Honey Parsnip Soup"
category: main
portion:
  description: "bowl (280mL)"
  est_weight_g: 295
  notes: "Creamy parsnip and honey soup with olive oil finishing drizzle. Served at Beaverbrook Hotel Coach House Deli."
assumptions:
  salt_scheme: "normal"
  oil_type: "olive oil, butter"
  prep: "Parsnips roasted with honey, blended with cream and vegetable stock, finished with olive oil drizzle. Components: 120g cooked parsnips, 40g heavy cream, 8g honey, 8g olive oil (top), 5g butter, 100g vegetable stock, 10g onion, seasoning."
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 370
  protein_g: 3.0
  fat_g: 26.8
  sat_fat_g: 12.7
  mufa_g: 11.1
  pufa_g: 1.6
  trans_fat_g: 0.2
  cholesterol_mg: 40
  # Carbohydrates
  carbs_total_g: 31.9
  carbs_available_g: 26.6
  sugar_g: 12.0
  fiber_total_g: 5.3
  fiber_soluble_g: 1.8
  fiber_insoluble_g: 3.5
  polyols_g: 0.0
  # Minerals
  sodium_mg: 869
  potassium_mg: 525
  iodine_ug: 2.6
  magnesium_mg: 30
  calcium_mg: 65
  iron_mg: 0.65
  zinc_mg: 0.4
  vitamin_c_mg: 12
  manganese_mg: 0.54
  copper_mg: 0.12
  selenium_ug: 1.6
  chromium_ug: 1.0
  molybdenum_ug: 2.0
  phosphorus_mg: 88
  chloride_mg: 1338
  sulfur_g: 0.03
  # Vitamins
  vitamin_a_ug: 195
  vitamin_d_ug: 0.84
  vitamin_e_mg: 2.5
  vitamin_k_ug: 9.6
  vitamin_b1_mg: 0.14
  vitamin_b2_mg: 0.13
  vitamin_b3_mg: 0.77
  vitamin_b5_mg: 0.81
  vitamin_b6_mg: 0.14
  vitamin_b7_ug: 0.7
  vitamin_b9_ug: 55
  vitamin_b12_ug: 0.08
  choline_mg: 17
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.12
  omega6_la_g: 1.23
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps:
    - "Portion size estimated from upscale hotel deli standards (MEDIUM confidence)"
    - "B7 (biotin) estimated from component averages (MEDIUM confidence)"
notes:
  - "Energy: 370 kcal. Atwater validation: 4×3.0 + 9×26.8 + 4×26.6 + 2×5.3 = 370.2 kcal (±0.1%)"
  - "Component breakdown: 120g roasted parsnips, 40g heavy cream, 8g honey, 8g olive oil drizzle, 5g butter (sautéing), 100g vegetable stock, 10g onion aromatics"
  - "Fat breakdown: 47% saturated (cream, butter), 41% MUFA (olive oil, butter), 6% PUFA (olive oil)"
  - "High fiber 5.3g from parsnips (4.4g/100g fiber content)"
  - "Natural sweetness from parsnips and honey - 12g total sugar"
  - "Vitamin A 195µg from cream and butter (dairy-based)"
  - "Folate 55µg from parsnips (good source)"
  - "Chloride derived: 869mg sodium × 1.54 = 1338mg"
  - "Sulfur calculated: 3.0g protein × 0.01 (mixed animal/plant) = 0.03g"
  - "Omega-6/omega-3 ratio: 10.3:1 (from olive oil predominance)"
  - "Portion size 280mL/295g typical for upscale hotel spa/deli soup service"
change_log:
  - timestamp: "2025-11-15T00:00:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial population with complete 52-nutrient estimation"
    notes: "Component-based analysis using USDA FoodData Central. Components: parsnips (cooked), heavy cream, honey, olive oil, butter, vegetable stock. Portion estimated at 280mL for upscale venue. All micronutrients scaled from USDA per-100g values. Confidence: HIGH (±10-15%)."
```
