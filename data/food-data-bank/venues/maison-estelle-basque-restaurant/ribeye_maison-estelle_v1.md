## Ribeye Steak (Maison Estelle)

```yaml
id: ribeye_maison-estelle_v1
version: 2
schema_version: 2
last_verified: 2025-11-15
source:
  venue: Maison Estelle - Basque Restaurant
  menu_page: ""
  evidence:
    - "USDA FoodData Central - Beef, ribeye, cooked, grilled (https://foodstruct.com/food/rib-eye-steak)"
    - "USDA base data per 100g: 291 kcal, 23.7g protein, 21.8g fat"
    - "Portion estimation: 300g cooked weight based on upscale London restaurant research"
    - "Cut at 45 Park Lane: 340g ribeye; Bife: 250g; Boha: 283g; Industry standard: 250-350g"
    - "Basque-style ribeye at upscale venue estimated at 300g (individual portion, not traditional 1kg chuletón)"
    - "Finishing salt: 1.5g (0.5% of 300g total weight) = 600mg sodium"
    - "Fatty acids from grain-fed beef research: ALA ~40mg/100g, LA ~285mg/100g"
    - "Trace nutrients estimated from typical beef composition where USDA data unavailable"
aliases: []
category: main
portion:
  description: "full restaurant portion"
  est_weight_g: 300
  notes: "High-quality ribeye steak, grilled. This is the FULL portion as served (user ate 2/3). Basque-style preparation with finishing salt."
assumptions:
  salt_scheme: "normal"
  oil_type: "minimal - ribeye cooked in its own fat"
  prep: "Grilled ribeye with finishing salt, Basque-style preparation. Grain-fed beef assumption (typical for UK upscale restaurants). Well-marbled, high-quality cut."
  copper_estimation: "USDA ribeye data: 0.08mg/100g × 300g = 0.24mg. High confidence (±5-15%)."
  chromium_estimation: "Beef typical: ~2µg/100g × 300g = 6µg. Medium confidence (±20-40%)."
  molybdenum_estimation: "Beef typical: ~5µg/100g × 300g = 15µg. Medium confidence (±20-40%)."
  iodine_estimation: "Beef trace: ~5µg/100g × 300g = 15µg. Medium confidence (±20-40%)."
  biotin_estimation: "Beef typical: ~3µg/100g × 300g = 9µg. Medium confidence (±20-40%)."
  omega_fatty_acids: "Grain-fed beef: ALA ~40mg/100g, LA ~285mg/100g. EPA/DHA essentially zero in beef. Medium confidence (±20-40%)."
  fat_split_adjustment: "Trans fat adjusted to 1.5g (0.5g/100g) to reflect naturally occurring CLA in beef. MUFA adjusted to 31.5g. Total fat split: 65.1g (99.5% of 65.4g total fat). Remaining 0.3g is glycerol backbone and phospholipids."
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 873
  protein_g: 71.1
  fat_g: 65.4
  sat_fat_g: 29.1
  mufa_g: 31.5
  pufa_g: 3.0
  trans_fat_g: 1.5
  cholesterol_mg: 240
  # Carbohydrates
  carbs_total_g: 0.0
  carbs_available_g: 0.0
  sugar_g: 0.0
  fiber_total_g: 0.0
  fiber_soluble_g: 0.0
  fiber_insoluble_g: 0.0
  polyols_g: 0.0
  # Minerals
  sodium_mg: 762
  potassium_mg: 780
  iodine_ug: 15
  magnesium_mg: 66
  calcium_mg: 33
  iron_mg: 6.6
  zinc_mg: 17.7
  vitamin_c_mg: 0.0
  manganese_mg: 0.24
  copper_mg: 0.24
  selenium_ug: 90
  chromium_ug: 6
  molybdenum_ug: 15
  phosphorus_mg: 456
  chloride_mg: 1173
  sulfur_g: 0.71
  # Vitamins
  vitamin_a_ug: 24
  vitamin_d_ug: 0.6
  vitamin_e_mg: 0.3
  vitamin_k_ug: 4.8
  vitamin_b1_mg: 0.21
  vitamin_b2_mg: 0.87
  vitamin_b3_mg: 14.7
  vitamin_b5_mg: 1.62
  vitamin_b6_mg: 1.44
  vitamin_b7_ug: 9
  vitamin_b9_ug: 18
  vitamin_b12_ug: 6.3
  choline_mg: 147
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.12
  omega6_la_g: 0.86
  # Ultra-trace minerals (not tracked per ESTIMATE.md)
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "Chromium, molybdenum, iodine, biotin estimated from typical beef values (±20-40%)"
    - "Portion size estimated at 300g based on upscale London restaurant research (±15-20%)"
    - "Fatty acids from grain-fed beef literature (±20-40%)"
notes:
  - "USDA data scaled to 300g cooked portion (middle-upper range for upscale London steakhouses)"
  - "Sodium includes intrinsic (162mg) + finishing salt (600mg) = 762mg total"
  - "Finishing salt: 1.5g (0.5% of 300g dish weight)"
  - "Atwater validation: 4×71.1 + 9×65.4 + 4×0 + 2×0 + 2.4×0 = 873 kcal ✓"
  - "Basque-style ribeye emphasizes high-quality, well-marbled beef with simple preparation"
  - "Private members club in Mayfair - upscale individual portion, not traditional 1kg Basque chuletón"
  - "This is the FULL portion estimate; user ate 2/3 of this amount"
change_log:
  - timestamp: "2025-11-15T12:00:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial comprehensive nutrient estimation for Maison Estelle ribeye"
    notes: "All 52 nutrient fields populated using USDA FoodData Central for beef ribeye (cooked, grilled) scaled to 300g portion. Finishing salt added. Chloride derived from sodium (×1.54). Sulfur derived from protein (×0.01 for animal). Trace nutrients estimated from typical beef composition where USDA data unavailable."
    sources:
      - url: "https://foodstruct.com/food/rib-eye-steak"
        note: "USDA ribeye nutrition data per 100g"
      - url: "https://www.hot-dinners.com/Features/Hot-Dinners-recommends/best-steak-restaurants-london"
        note: "London upscale steakhouse portion research"
      - url: "https://www.bascofinefoods.com/spanish-recipes/basque-txuleton-steak-recipe/"
        note: "Basque chuletón preparation and characteristics"
      - url: "component_analysis"
        note: "300g portion estimate based on Cut at 45 Park Lane (340g), Bife (250g), Boha (283g), and industry standards for upscale restaurants"
```
