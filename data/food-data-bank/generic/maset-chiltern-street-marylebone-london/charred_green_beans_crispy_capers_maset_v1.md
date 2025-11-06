## Charred Green Beans, Crispy Capers (Maset)

```yaml
id: charred_green_beans_crispy_capers_maset_v1
schema_version: 2
version: 1
last_verified: 2025-11-05
source:
  venue: Maset, Chiltern Street (Marylebone, London)
  menu_page: "Side dishes section"
  evidence:
    - "Maset restaurant website and reviews (Hot Dinners, Luxuriate Life, The Infatuation) - French Mediterranean coastal cuisine"
    - "Component-based estimation using USDA FoodData Central profiles"
    - "USDA FDC#169141: Green beans, snap, cooked, boiled, drained, without salt"
    - "USDA FDC#173430: Butter, salted (CORRECTED from olive oil per user confirmation)"
    - "USDA FDC#172238: Capers, canned"
    - "Restaurant vegetable side portion standards (ESTIMATE.md): 100-150g typical range"
    - "Recipe research: charred green beans typically use 2 tbsp fat per pound (Food Network, various sources)"
aliases: []
category: side
portion:
  description: "restaurant side serving"
  est_weight_g: 142
  notes: "Charred green beans with crispy fried capers; French preparation with butter"
assumptions:
  salt_scheme: "normal"
  oil_type: "butter (for charring and frying capers)"
  prep: "green beans charred in butter, capers fried crispy, finished with salt"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 130
  protein_g: 2.6
  fat_g: 10.2
  sat_fat_g: 6.3
  mufa_g: 2.5
  pufa_g: 0.6
  trans_fat_g: 0.4
  cholesterol_mg: 26
  # Carbohydrates
  carbs_total_g: 10.0
  carbs_available_g: 4.8
  sugar_g: 4.5
  fiber_total_g: 5.1
  fiber_soluble_g: 1.8
  fiber_insoluble_g: 3.3
  polyols_g: 0.0
  # Minerals
  sodium_mg: 593
  potassium_mg: 258
  iodine_ug: 3
  magnesium_mg: 34
  calcium_mg: 73
  iron_mg: 1.3
  zinc_mg: 0.3
  vitamin_c_mg: 15
  manganese_mg: 0.3
  copper_mg: 0.14
  selenium_ug: 1
  chromium_ug: 1
  molybdenum_ug: 5
  phosphorus_mg: 49
  chloride_mg: 898
  sulfur_g: 0.07
  # Vitamins
  vitamin_a_ug: 130
  vitamin_d_ug: 0.2
  vitamin_e_mg: 0.8
  vitamin_k_ug: 55
  vitamin_b1_mg: 0.10
  vitamin_b2_mg: 0.14
  vitamin_b3_mg: 1.0
  vitamin_b5_mg: 0.12
  vitamin_b6_mg: 0.07
  vitamin_b7_ug: 1
  vitamin_b9_ug: 51
  vitamin_b12_ug: 0.02
  choline_mg: 25
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.15
  omega6_la_g: 0.34
  # Ultra-trace minerals
  boron_mg: 0.48
  silicon_mg: 7.2
  vanadium_ug: 2
  nickel_ug: 6
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "Exact green bean weight estimated from typical restaurant vegetable side portions (100-150g range)"
    - "Butter quantity estimated from standard charring/frying requirements (corrected from initial olive oil assumption)"
    - "Caper quantity estimated from typical garnish proportions in similar dishes"
    - "Fiber split (soluble/insoluble) estimated at 36%/64% based on typical green bean composition"
    - "Some ultra-trace minerals (vanadium, nickel, biotin) estimated from literature values for vegetables"
notes:
  - "Atwater check (available carb basis): 4×2.6 + 9×10.2 + 4×4.8 + 2×5.1 = 10.4 + 91.8 + 19.2 + 10.2 = 131.6 kcal ✓"
  - "Component breakdown (142g total): Green beans cooked 120g + butter salted 12g + capers fried 10g + finishing salt 0.7g"
  - "Green beans contribute: 42 kcal, 2.3g protein, vitamins K (52µg), C (15mg), folate (48µg), minerals (K, Mg, Ca, Fe)"
  - "Butter contributes: 86 kcal, 9.7g fat (62% saturated 6.2g, 25% MUFA 2.5g, 4% PUFA 0.4g), 26mg cholesterol, vitamin A (82µg retinol), vitamin D (0.2µg), sodium (77mg from salted butter)"
  - "Capers contribute: 2 kcal, high sodium (235mg from pickling), vitamin K (2.5µg)"
  - "Finishing salt adds: 280mg sodium, 420mg chloride (0.7g salt = 0.5% of dish weight per ESTIMATE.md standard)"
  - "CRITICAL CORRECTION: Fat profile changed from olive oil to BUTTER - now dominated by saturated fat (62% vs 14%), much lower MUFA (25% vs 71%)"
  - "Fatty acid profile: 62% saturated (mostly palmitic/stearic from butter), 25% MUFA, 6% PUFA (omega-6 LA 0.34g, omega-3 ALA 0.15g), 4% trans (natural ruminant)"
  - "Good source of vitamin K (55µg = 46% DV), vitamin A (130µg = 14% DV from butter retinol + green beans carotenoids), vitamin C (15mg), folate (51µg)"
  - "Moderate-high sodium (593mg) from salted butter (77mg) + capers (235mg) + finishing salt (280mg) + minimal intrinsic (1mg)"
  - "High fiber (5.1g) and low available carbs (4.8g) make this a nutrient-dense, low-glycemic side dish despite butter content"
  - "User consumed approximately HALF of this dish (shared) - adjust portion to 0.5× when logging"
  - "Total weight 142g aligns with restaurant vegetable side standards (100-150g range per ESTIMATE.md)"
  - "BUTTER vs OLIVE OIL: Sat fat +4.4g (+232%), MUFA -7.0g (-74%), cholesterol +26mg, vitamin E -1.4mg, vitamin A +82µg"
change_log:
  - timestamp: 2025-11-05T12:00:00+0000
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: 'CRITICAL CORRECTION: User confirmed dish was cooked in BUTTER, not olive oil - complete recalculation of all affected nutrients'
    fields_changed: [energy_kcal, fat_g, sat_fat_g, mufa_g, pufa_g, trans_fat_g, cholesterol_mg, carbs_total_g, fiber_total_g, fiber_soluble_g, fiber_insoluble_g, sodium_mg, chloride_mg, sulfur_g, vitamin_a_ug, vitamin_d_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b2_mg, vitamin_b5_mg, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_ala_g, omega6_la_g, iodine_ug, iron_mg, copper_mg, molybdenum_ug, nickel_ug, assumptions.oil_type, assumptions.prep, portion.notes, source.evidence, quality.gaps, notes]
    impact: 'Major nutritional change: sat_fat +4.4g (+232%), mufa -7.0g (-74%), cholesterol +26mg, energy -32 kcal, vitamin_a +82µg, vitamin_e -1.4mg. Fat profile changed from Mediterranean (olive oil) to dairy (butter).'
    sources:
      - note: "USDA FoodData Central - Butter, salted FDC#173430"
        url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/173430/nutrients"
      - note: "ESTIMATE.md fat composition reference: Butter ~51% SFA, ~21% MUFA, ~3% PUFA"
        url: "internal"
      - note: "User confirmation: green beans were cooked in butter, not olive oil"
        url: "user_input"
  - timestamp: 2025-11-05T00:00:00+0000
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: Initial population using component-based estimation from USDA FoodData Central
    fields_changed: [all nutrient fields, portion.est_weight_g, portion.notes, assumptions, source.evidence, quality, notes]
    sources:
      - note: "USDA FoodData Central - Green beans cooked FDC#169141"
        url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/169141/nutrients"
      - note: "USDA FoodData Central - Olive oil FDC#171413 (SUPERSEDED - see correction above)"
        url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/171413/nutrients"
      - note: "USDA FoodData Central - Capers canned FDC#172238"
        url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/172238/nutrients"
      - note: "Maset restaurant research (Hot Dinners, Luxuriate Life, The Infatuation)"
        url: "https://www.hot-dinners.com/2025101514569/Gastroblog/Latest-news/maset-french-restaurant-marylebone-london-chiltern-street"
      - note: "Recipe research for charred green beans with capers proportions"
        url: "multiple_culinary_sources"
```
