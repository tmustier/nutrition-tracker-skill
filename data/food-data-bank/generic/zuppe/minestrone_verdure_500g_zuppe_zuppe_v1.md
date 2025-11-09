## Minestrone di Verdure, 500g (Zuppe)

```yaml
id: minestrone_verdure_500g_zuppe_zuppe_v1
version: 1
schema_version: 2
last_verified: 2025-11-08
source:
  venue: Zuppe
  menu_page: "https://zuppeltd.co.uk/"
  evidence:
    - "Product label (Zuppe Ltd Minestrone di Verdure 1kg pack, 500g portion consumed)"
    - "Ingredients: Water, Minestrone Mix (34.6%) (Potatoes, Cauliflower, Leeks, Tomatoes, Peas, Carrots, CELERY, Beans, Savoy Cabbage, Borlotti's, Courgettes, Basil), Onion, Chopped Tomatoes, Tomato Paste, Pasta Ditali Lisci (Durum WHEAT), Carrots, Organic Vegetable Bouillon, Extra Virgin Olive Oil, Garlic, Parsley, Basil, Black Pepper"
    - "Allergens: Celery, Wheat. Vegan product."
    - "Label macros per 100g: 42 kcal, 0.9g fat (0.2g saturates), 6.5g carbs (available), 2.3g sugar, 2.0g protein, 0.86g salt"
    - "USDA FoodData Central: Vegetable soup profiles (FDC ID 173026, 174304)"
    - "USDA FoodData Central: Minestrone soup with pasta and beans for micronutrient profiles"
    - "Component analysis: Tomatoes (vitamin A, C, potassium), carrots (vitamin A), beans (iron, folate, molybdenum), pasta (B vitamins), olive oil (vitamin E, MUFA), leafy greens (vitamin K, folate)"
    - "UK labeling: Carbs on label are AVAILABLE carbs (excludes fiber)"
aliases: []
category: main
portion:
  description: "500g portion (half of 1kg pack, before heating)"
  est_weight_g: 500
  notes: "Fresh soup from Zuppe Ltd. Contains 34.6% minestrone vegetable mix plus additional vegetables, pasta, and EVOO. Vegan product. Portion is 500g of unheated soup from 1kg pack."
assumptions:
  salt_scheme: "heavy"
  oil_type: "extra virgin olive oil (primary), rapeseed/sunflower oil (in bouillon)"
  prep: "Fresh soup, unheated. Contains cooked pasta and vegetables in tomato-vegetable broth base with EVOO"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 210
  protein_g: 10.0
  fat_g: 4.5
  sat_fat_g: 1.0
  mufa_g: 2.8
  pufa_g: 0.7
  trans_fat_g: 0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 40.0
  carbs_available_g: 32.5
  sugar_g: 11.5
  fiber_total_g: 7.5
  fiber_soluble_g: 2.6
  fiber_insoluble_g: 4.9
  polyols_g: 0.0
  # Minerals
  sodium_mg: 1720
  potassium_mg: 1100
  iodine_ug: 15
  magnesium_mg: 125
  calcium_mg: 175
  iron_mg: 4.5
  zinc_mg: 3.0
  vitamin_c_mg: 45
  manganese_mg: 1.5
  copper_mg: 0.75
  selenium_ug: 10
  chromium_ug: 5
  molybdenum_ug: 50
  phosphorus_mg: 300
  chloride_mg: 2649
  sulfur_g: 0.04
  # Vitamins
  vitamin_a_ug: 1000
  vitamin_d_ug: 0
  vitamin_e_mg: 2.5
  vitamin_k_ug: 85
  vitamin_b1_mg: 0.3
  vitamin_b2_mg: 0.2
  vitamin_b3_mg: 2.2
  vitamin_b5_mg: 1.5
  vitamin_b6_mg: 0.6
  vitamin_b7_ug: 7
  vitamin_b9_ug: 100
  vitamin_b12_ug: 0
  choline_mg: 75
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.15
  omega6_la_g: 0.5
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: []
notes:
  - "UK label handling: Label carbs (6.5g/100g) are AVAILABLE carbs per UK regulations. Fiber estimated separately at 1.5g/100g based on vegetable/pasta content."
  - "Total carbs calculation: 32.5g available + 7.5g fiber = 40.0g total carbs for 500g portion"
  - "Atwater validation (available carb basis): 4×10.0 + 9×4.5 + 4×32.5 + 2×7.5 = 40 + 40.5 + 130 + 15 = 225.5 kcal. Label shows 210 kcal (~7% lower). Difference attributed to high water content (soup base), potential resistant starch from pasta, and label measurement methodology. Within acceptable ±8% tolerance per ESTIMATE.md."
  - "Macros source: Product label (100g values × 5 for 500g portion). Energy: 42×5=210 kcal, Protein: 2.0×5=10.0g, Fat: 0.9×5=4.5g (sat 0.2×5=1.0g), Carbs available: 6.5×5=32.5g, Sugar: 2.3×5=11.5g, Salt: 0.86×5=4.3g (=1720mg sodium)"
  - "Fat breakdown: EVOO dominant (73% MUFA profile) with minor rapeseed/sunflower oil from bouillon. Total 4.5g: SFA 1.0g (label), MUFA 2.8g (62%, EVOO-rich), PUFA 0.7g (16%, trace oils), trans 0g. Total accounted: 4.5g (100%)"
  - "Omega fatty acids: Rapeseed oil in bouillon contributes omega-3 ALA (~0.15g), sunflower oil contributes omega-6 LA (~0.5g). No EPA/DHA (plant-based)"
  - "Cholesterol: 0mg (100% vegan product, confirmed by label)"
  - "Vitamin B12: 0μg (vegan product, no fortification indicated)"
  - "Sodium/chloride: Salt 4.3g = 1720mg sodium. Chloride = 1720 × 1.54 = 2649mg (NaCl molar ratio)"
  - "Sulfur: Plant protein basis = 10.0g protein × 0.004 = 0.04g (40mg). Conservative plant protein sulfur content per ESTIMATE.md"
  - "Vitamin A: Excellent source from tomatoes (chopped tomatoes + tomato paste, high lycopene/beta-carotene), carrots (very high beta-carotene), peas. Estimated 200μg RAE per 100g from USDA vegetable soup profiles scaled by tomato/carrot content. Total 1000μg RAE for 500g (111% RDA)"
  - "Vitamin C: High from cauliflower, tomatoes, cabbage, parsley, peas. ~50% cooking loss assumed. Estimated 9mg per 100g × 5 = 45mg (50% RDA). USDA minestrone: 6-12mg per 100g range"
  - "Vitamin E: Primarily from EVOO (14mg per 100g oil, ~0.5mg per 100g soup) plus vegetables. Estimated 0.5mg per 100g × 5 = 2.5mg"
  - "Vitamin K: From leafy greens (savoy cabbage, basil, parsley) and EVOO. Estimated 17μg per 100g × 5 = 85μg. Leafy greens are excellent vitamin K sources (100-500μg/100g raw)"
  - "Vitamin D: 0μg (plant-based, no mushrooms or fortification)"
  - "B vitamins: B1 from pasta/potatoes/beans (0.06mg/100g × 5 = 0.3mg), B2 from pasta/vegetables (0.04mg/100g × 5 = 0.2mg), B3 from pasta/potatoes (0.44mg/100g × 5 = 2.2mg), B5 from vegetables (0.3mg/100g × 5 = 1.5mg), B6 from potatoes/cauliflower (0.12mg/100g × 5 = 0.6mg), B7 from vegetables/pasta (1.4μg/100g × 5 = 7μg), B9 HIGH from beans/leafy greens (20μg/100g × 5 = 100μg, 25% RDA)"
  - "Choline: From potatoes, beans, cauliflower. Estimated 15mg per 100g × 5 = 75mg"
  - "Potassium: EXCELLENT source from potatoes (dominant), tomatoes, beans. Estimated 220mg per 100g × 5 = 1100mg (23% RDA). Potatoes contribute ~300mg, tomatoes ~120mg, beans ~80mg per 100g soup"
  - "Magnesium: From beans, leafy greens, potatoes. Estimated 25mg per 100g × 5 = 125mg (33% RDA)"
  - "Calcium: From vegetables (cabbage, celery), beans, water hardness. Estimated 35mg per 100g × 5 = 175mg (17% RDA)"
  - "Iron: Very good source from beans (borlotti beans - high), pasta, leafy greens. Estimated 0.9mg per 100g × 5 = 4.5mg (32% RDA for men). Note: Non-heme iron from plant sources"
  - "Zinc: From beans and pasta. Estimated 0.6mg per 100g × 5 = 3.0mg (27% RDA for men)"
  - "Copper: From beans and vegetables. Estimated 0.15mg per 100g × 5 = 0.75mg (83% RDA)"
  - "Manganese: From beans, vegetables, pasta. Estimated 0.3mg per 100g × 5 = 1.5mg (65% RDA for men)"
  - "Selenium: From pasta (wheat), vegetables. Low in plant foods. Estimated 2μg per 100g × 5 = 10μg (18% RDA)"
  - "Phosphorus: From pasta, beans, potatoes. Estimated 60mg per 100g × 5 = 300mg (43% RDA)"
  - "Iodine: Very low in plant foods. Not from iodized salt (Italian-style product likely uses sea salt). Estimated 3μg per 100g × 5 = 15μg (10% RDA). LOW confidence - soil-dependent"
  - "Chromium: Trace from vegetables and whole grains. Estimated 1μg per 100g × 5 = 5μg. LOW confidence"
  - "Molybdenum: EXCELLENT source from beans (borlotti beans). Estimated 10μg per 100g × 5 = 50μg (111% RDA). Beans are among the best molybdenum sources"
  - "Fiber estimation: Vegetable soup with pasta and beans typically 1.5-2g fiber per 100g per USDA data. Conservative estimate 1.5g per 100g × 5 = 7.5g (27% RDA). Sources: vegetables (cellulose), pasta (wheat bran), beans (soluble/insoluble fiber)"
  - "Ultra-trace minerals (boron, silicon, vanadium, nickel): Set to 0 per ESTIMATE.md guidelines (not tracked, no USDA data, soil-dependent)"
  - "Component contributors: Potatoes (potassium, B6, vitamin C), tomatoes (vitamin A/C, potassium, lycopene), carrots (vitamin A), beans (iron, zinc, folate, molybdenum, protein, fiber), pasta (B vitamins, selenium, protein), leafy greens (vitamin K, folate, calcium), EVOO (vitamin E, MUFA), celery (vitamin K), cauliflower (vitamin C), peas (protein, folate, vitamin C)"
  - "Vegan nutrient profile: Zero cholesterol, zero B12, plant-based iron/zinc (lower bioavailability), good omega-3 ALA from rapeseed oil but no EPA/DHA"
  - "High sodium warning: 1720mg sodium (75% RDA) from 4.3g salt. This is a HIGH salt product per UK labeling (>1.5g salt per 100g). Consider dilution or pairing with low-sodium foods"
  - "Strengths: Excellent vitamin A (111% RDA), very good potassium (23% RDA), good iron (32% RDA), excellent molybdenum (111% RDA), very good copper (83% RDA), good folate (25% RDA), high fiber (27% RDA)"
  - "Limitations: Very high sodium (75% RDA in one meal), zero vitamin D, zero B12, low selenium (18% RDA), low iodine (10% RDA)"
change_log:
  - timestamp: "2025-11-08T17:30:00+00:00"
    updated_by: "LLM: Claude Code (Sonnet 4.5)"
    reason: "Initial creation with complete 52-nutrient analysis from product label and USDA component data"
    fields_changed:
      - all_fields
    sources:
      - url: "https://zuppeltd.co.uk/"
        note: "Zuppe Ltd official website, UK-based fresh soup company"
      - url: "product_label"
        note: "Zuppe Minestrone di Verdure 1kg pack: Macros per 100g, ingredient list, allergens. UK labeling (available carbs)"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/173026/nutrients"
        note: "USDA Vegetable soup, canned, condensed (FDC ID 173026) - micronutrient reference"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/174304/nutrients"
        note: "USDA Minestrone soup, canned, ready-to-serve (FDC ID 174304) - micronutrient reference"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/169292/nutrients"
        note: "USDA Tomatoes, red, ripe, cooked - vitamin A, C, potassium profiles"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170393/nutrients"
        note: "USDA Carrots, cooked, boiled - vitamin A (beta-carotene) profiles"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/173757/nutrients"
        note: "USDA Kidney beans (proxy for borlotti beans) - iron, folate, molybdenum, protein"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/169722/nutrients"
        note: "USDA Pasta, cooked - B vitamins, selenium profiles"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/171413/nutrients"
        note: "USDA Olive oil, extra virgin - vitamin E, MUFA profile"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170400/nutrients"
        note: "USDA Cabbage, savoy, cooked - vitamin K, folate, calcium"
      - url: "component_analysis"
        note: "Applied ingredient-based estimation: identified all components from label, scaled USDA micronutrient profiles by component contribution, validated macros against label, calculated derived nutrients (chloride from sodium, sulfur from protein)"
    confidence_summary: "MEDIUM confidence overall. HIGH for macros (product label), MEDIUM for most vitamins/minerals (USDA vegetable soup + component scaling), LOW for iodine/chromium (soil-dependent). UK label handling: available carbs confirmed, fiber estimated at 1.5g/100g from USDA soup profiles."
```
