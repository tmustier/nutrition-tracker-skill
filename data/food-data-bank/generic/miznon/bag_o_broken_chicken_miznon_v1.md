## Bag 'O' Broken Chicken (Miznon)

```yaml
id: bag_o_broken_chicken_miznon_v1
version: 1
last_verified: 2025-11-07
source:
  venue: Miznon
  menu_page: "https://miznon.co.uk/"
  evidence:
    - "Component-based estimation using USDA FoodData Central"
    - "USDA FDC 171481: Chicken, broilers or fryers, thigh, meat only, cooked, roasted (220g)"
    - "USDA FDC 173570: Mayonnaise, regular (35g) - aioli approximation"
    - "USDA FDC 172687: Pita bread, white (85g)"
    - "USDA FDC 169414: Onions, spring or scallions, raw (15g)"
    - "USDA FDC 170148: Seeds, sesame seeds, whole, dried (3g) - za'atar approximation"
    - "Typical Middle Eastern chicken pita portions: 350-400g, 500-700 kcal (source: Nutritionix, various restaurant data)"
    - "User consumed 1/2 of full bag"
aliases:
  - "Broken Chicken Pita"
  - "Rotisserie Broken Chicken"
category: main
portion:
  description: "1/2 bag (user portion)"
  est_weight_g: 179
  notes: "Full bag estimated at 358g based on component analysis. User ate half portion."
assumptions:
  salt_scheme: "normal"
  oil_type: "olive oil (in aioli)"
  prep: "Plancha roasted chicken thigh meat, garlic aioli (mayo-based), za'atar spice blend, spring onions, served in white pita bread"
per_portion:  # Schema v2: 52 nutrient fields - FOR 1/2 BAG (USER PORTION)
  # Macronutrients
  energy_kcal: 477
  protein_g: 32.9
  fat_g: 26.4
  sat_fat_g: 5.5
  mufa_g: 8.4
  pufa_g: 10.6
  trans_fat_g: 0.0
  cholesterol_mg: 109
  # Carbohydrates
  carbs_total_g: 24.7
  carbs_available_g: 23.4
  sugar_g: 1.0
  fiber_total_g: 1.3
  fiber_soluble_g: 0.0
  fiber_insoluble_g: 0.0
  polyols_g: 0.0
  # Minerals
  sodium_mg: 788
  potassium_mg: 326
  iodine_ug: 5
  magnesium_mg: 38
  calcium_mg: 55
  iron_mg: 2.7
  zinc_mg: 3.1
  vitamin_c_mg: 1.4
  manganese_mg: 0.28
  copper_mg: 0.14
  selenium_ug: 33.0
  chromium_ug: 2.0
  molybdenum_ug: 8.0
  phosphorus_mg: 252
  chloride_mg: 1213
  sulfur_g: 0.33
  # Vitamins
  vitamin_a_ug: 29
  vitamin_d_ug: 0.3
  vitamin_e_mg: 1.3
  vitamin_k_ug: 26
  vitamin_b1_mg: 0.24
  vitamin_b2_mg: 0.15
  vitamin_b3_mg: 8.1
  vitamin_b5_mg: 1.1
  vitamin_b6_mg: 0.29
  vitamin_b7_ug: 4.0
  vitamin_b9_ug: 51
  vitamin_b12_ug: 0.37
  choline_mg: 75
  # Fatty acids
  omega3_epa_mg: 5
  omega3_dha_mg: 8
  omega3_ala_g: 0.9
  omega6_la_g: 9.4
  # Ultra-trace minerals (not tracked per ESTIMATE.md guidelines)
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "Fiber soluble/insoluble breakdown not available in USDA data for all components"
    - "Iodine estimated conservatively (chicken 3μg, pita 2μg per half portion)"
    - "Vitamin D estimated from chicken only (0.3μg per half portion)"
    - "Chromium and molybdenum estimated from grain and protein content"
    - "Biotin (B7) estimated from egg content in aioli and chicken"
notes:
  - "Full bag components (358g total): Chicken thigh roasted 220g, aioli 35g, pita bread 85g, spring onions 15g, za'atar 3g"
  - "User consumed exactly 1/2 bag (179g), all values scaled accordingly"
  - "Aioli approximated using USDA mayonnaise data (garlic contributes negligible macros)"
  - "Za'atar approximated using sesame seeds (main caloric component of blend; thyme and sumac contribute minimal calories)"
  - "Finishing salt estimated at 0.5% of total weight (1.79g for full bag = 716mg sodium added)"
  - "Total sodium includes: chicken intrinsic (185mg), aioli (217mg), pita (456mg), spring onions (2mg), finishing salt (716mg)"
  - "Energy validation (1/2 portion): 4×32.9 + 9×26.4 + 4×23.4 + 2×1.3 = 131.6 + 237.6 + 93.6 + 2.6 = 465.4 kcal (vs recorded 477 kcal = 2.4% difference, within ±5% tolerance)"
  - "Omega-3 EPA/DHA from chicken (thigh has trace amounts from feed), ALA from aioli (soybean oil component) and sesame in za'atar"
  - "Omega-6 LA primarily from aioli (high in polyunsaturated fat, predominantly linoleic acid)"
  - "Chloride derived: 788mg sodium × 1.54 = 1213mg"
  - "Sulfur derived: 32.9g protein × 0.01 (animal protein) = 0.33g"
change_log:
  - timestamp: "2025-11-07T15:30:00Z"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial creation with complete 52-nutrient profile using component-based USDA estimation"
    notes: "Components scaled from USDA FDC data: chicken thigh roasted (220g → 110g for half), mayonnaise for aioli (35g → 17.5g), pita bread (85g → 42.5g), spring onions (15g → 7.5g), za'atar/sesame (3g → 1.5g). Finishing salt 0.5% of weight. All micronutrients summed from component profiles. Energy validated within 2.4% of Atwater formula."
```
