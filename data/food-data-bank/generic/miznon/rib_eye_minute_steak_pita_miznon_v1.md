## Rib Eye Minute Steak In-A-Pita (Miznon)

```yaml
id: rib_eye_minute_steak_pita_miznon_v1
version: 1
last_verified: 2025-11-07
source:
  venue: Miznon
  menu_page: "https://miznon.co.uk/menu/"
  evidence:
  - "Deliveroo UK: Miznon Soho - Rib Eye Minute Steak pita (thin rib eye slices, tahini, tomato salsa, red onion, pickles)"
  - "Israeli pita bread typical weight: 100-110g (veredguttman.com Israeli pita recipes)"
  - "Restaurant pita sandwiches: tahini 1-2 tbsp (~20g typical for pita fillings)"
  - "Component-based estimation: pita 100g, steak 100g, tahini 20g, tomato 30g, pickle 15g, onion 10g, salsa 25g, finishing salt 2.5g"
  - "USDA FoodData Central: Beef ribeye grilled (FDC 172164), Pita bread white (FDC 172816), Tahini (FDC 170189), Raw tomatoes (FDC 170457)"
  - "Nutrition data scaled from USDA values per 100g for each component"
  - "Grass-fed beef micronutrient profile scaled from Maset Cote de Boeuf reference dish"
  - "Miznon menu descriptions: 'Roasted thin slices of rib-eye steak, tomato, pickle, tahini, red onion, spicy salsa in a Pita'"
aliases:
- "Minute Steak Pita"
- "Rib Eye Pita"
- "Steak In-A-Pita"
category: main
portion:
  description: "single pita sandwich"
  est_weight_g: 302.5
  notes: "Israeli-style pita filled with thin-sliced grilled rib eye steak, tahini, tomato, pickles, red onion, spicy salsa, finishing salt"
assumptions:
  salt_scheme: "normal"
  oil_type: "beef fat + tahini (sesame oil)"
  prep: "Thin rib eye slices grilled/seared, assembled in Israeli pita (100g) with tahini (20g), fresh tomato (30g), pickles (15g), red onion (10g), spicy salsa (25g), finishing salt (2.5g)"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 706
  protein_g: 39.3
  fat_g: 33.2
  sat_fat_g: 10.7
  mufa_g: 13.2
  pufa_g: 6.3
  trans_fat_g: 0.3
  cholesterol_mg: 80
  # Carbohydrates
  carbs_total_g: 65.0
  carbs_available_g: 60.2
  sugar_g: 4.5
  fiber_total_g: 4.8
  fiber_soluble_g: 1.1
  fiber_insoluble_g: 3.7
  polyols_g: 0.0
  # Minerals
  sodium_mg: 2002
  potassium_mg: 681
  iodine_ug: 10
  magnesium_mg: 76
  calcium_mg: 243
  iron_mg: 5.7
  zinc_mg: 7.4
  vitamin_c_mg: 6.9
  manganese_mg: 0.86
  copper_mg: 0.57
  selenium_ug: 60.5
  chromium_ug: 2
  molybdenum_ug: 6
  phosphorus_mg: 432
  chloride_mg: 3083
  sulfur_g: 0.39
  # Vitamins
  vitamin_a_ug: 62
  vitamin_d_ug: 0.2
  vitamin_e_mg: 1.4
  vitamin_k_ug: 17.3
  vitamin_b1_mg: 0.59
  vitamin_b2_mg: 0.39
  vitamin_b3_mg: 11.4
  vitamin_b5_mg: 1.17
  vitamin_b6_mg: 0.62
  vitamin_b7_ug: 5.2
  vitamin_b9_ug: 119
  vitamin_b12_ug: 2.2
  choline_mg: 81
  # Fatty acids
  omega3_epa_mg: 10
  omega3_dha_mg: 2
  omega3_ala_g: 0.058
  omega6_la_g: 5.5
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - "No official nutrition data from Miznon (restaurant does not publish nutrition facts)"
  - "Component weights estimated from photos, Israeli pita standards, and typical restaurant pita sandwich portions"
  - "Rib eye steak weight estimated at 100g cooked (typical for restaurant pita filling)"
  - "Micronutrients scaled from USDA FoodData Central per component"
  - "Confidence: HIGH for macros (±10-15%), MEDIUM for minerals/vitamins (±20-30%)"
notes:
- "Miznon signature dish: Thin-sliced minute steak seared quickly (hence 'minute'), served in fresh Israeli pita"
- "Israeli pita: Thicker, softer, doughier than American/Greek pita (~100g vs 60g)"
- "Component breakdown: Pita 100g (275 kcal) + Steak 100g (270 kcal) + Tahini 20g (119 kcal) + Vegetables 80g (19 kcal) = 706 kcal total (Atwater-standardized)"
- "Tahini contribution: High calcium (128mg from 20g tahini), phosphorus (115mg), copper (0.32mg), omega-6 (4.6g)"
- "Rib eye profile: Excellent protein source (26g per 100g), zinc (5.5mg), selenium (28µg), B-vitamins (B3, B6, B12)"
- "Fat profile: 32% saturated (beef + tahini), 40% MUFA (beef fat), 19% PUFA (tahini-rich), 1% trans (natural beef)"
- "Sodium: Moderate-high at 2,002mg (536mg pita + 181mg pickles + 200mg salsa + 1,000mg finishing salt + 85mg other)"
- "⚠️ High sodium: 2002mg represents 87% of daily maximum (2300mg). Main contributors: finishing salt (1000mg), pita (536mg), pickles (181mg). Consider for sodium-restricted diets."
- "Chloride: Derived from sodium (2002mg × 1.54 = 3,083mg)"
- "Sulfur: Derived from protein (39.3g × 0.01 = 0.39g, animal protein factor)"
- "Carbs: 92% from pita bread (56.8g of 65g total), 7% from tahini, 1% from vegetables"
- "Fiber: 48% from pita (2.3g), 29% from tahini (1.4g), 23% from vegetables (1.1g)"
- "Atwater calculation: 4×39.3 + 9×33.2 + 4×60.2 + 2×4.8 = 706.4 kcal (rounded to 706 kcal)"
- "Energy standardization: Per ESTIMATE.md, USDA-based estimates use Atwater formula for consistency"
- "B-vitamin profile: Strong B3 (11.4mg from beef 7.2mg + pita 2.8mg + tahini 1.0mg), B6 (0.62mg primarily beef), B12 (2.2µg beef only)"
- "Omega fatty acids: EPA/DHA from beef (10mg/2mg), ALA minimal (58mg), omega-6 LA high (5.5g primarily from tahini)"
- "Typical serving: One pita sandwich as main course, ~300g total weight"
change_log:
- timestamp: "2025-11-07T21:30:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "PR review improvement: Standardize energy to Atwater calculation for consistency"
  fields_changed: ["energy_kcal"]
  notes: "Energy consistency principle from ESTIMATE.md: Since all values are USDA-based estimates (not label data), energy must equal Atwater formula result. Updated from 683 to 706 kcal (Atwater: 4×39.3 + 9×33.2 + 4×60.2 + 2×4.8 = 706.4 kcal)."
- timestamp: "2025-11-07T15:45:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "Initial comprehensive entry for Miznon Rib Eye Minute Steak pita with complete 52-field nutrition profile"
  fields_changed: ["all fields"]
  sources:
  - url: "https://deliveroo.co.uk/menu/London/soho/miznon-soho"
    note: "Deliveroo UK - Miznon Soho menu (ingredient list, dish description)"
  - url: "https://miznon.co.uk/menu/"
    note: "Miznon UK official website and menu"
  - url: "https://veredguttman.com/israeli-style-pita-bread/"
    note: "Israeli pita bread typical weight 100-110g (authentic recipe source)"
  - url: "https://fdc.nal.usda.gov/"
    note: "USDA FoodData Central: Complete nutrient profiles for beef ribeye (grilled), pita bread, tahini, tomatoes"
  - url: "https://foodstruct.com/food/rib-eye-steak"
    note: "Beef rib eye nutritional data (23.7g protein, 21.8g fat per 100g cooked)"
  - url: "https://tools.myfooddata.com/nutrition-facts/170189/wt1"
    note: "Tahini (sesame butter) complete nutrition: 595 kcal, high calcium, copper, selenium per 100g"
  - url: "https://www.nutritionvalue.org/Pickles%2C_sour%2C_cucumber_nutritional_value.html"
    note: "Pickled cucumber nutrition: 11 kcal, 1208mg sodium per 100g"
  - url: "https://www.nutritionvalue.org/Onions%2C_raw%2C_red_790577_nutritional_value.html"
    note: "Red onion raw nutrition: 40 kcal, vitamin C, B6, folate per 100g"
  - url: "component_analysis"
    note: "100g pita + 100g grilled rib eye + 20g tahini + 30g tomato + 15g pickle + 10g red onion + 25g spicy salsa + 2.5g finishing salt = 302.5g total"
  - url: "reference_dish"
    note: "Cote de Boeuf (Maset) used as reference for beef micronutrient scaling (grass-fed beef profile)"
```
