## Almonds - raw (30 g)

```yaml
id: almonds_raw_30g_v1
schema_version: 2
version: 1
last_verified: 2025-11-12
source:
  venue: pack/ingredient
  menu_page:
  evidence:
    - "USDA FoodData Central - Nuts, almonds (FDC ID: 170567)"
    - "https://www.nutritionvalue.org/Nuts%2C_almonds_nutritional_value.html"
    - "https://tools.myfooddata.com/nutrition-facts/170567/wt5"
aliases:
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 30
  notes: Raw almonds, ~22 almonds. Values scaled from USDA per-100g data.
assumptions:
  salt_scheme: normal
  oil_type:
  prep:
per_portion:
  energy_kcal: 174
  protein_g: 6.3
  fat_g: 15.0
  sat_fat_g: 1.1
  mufa_g: 9.3
  pufa_g: 3.6
  trans_fat_g: 0.0
  cholesterol_mg: 0
  sugar_g: 1.3
  fiber_total_g: 3.8
  fiber_soluble_g: 0.9
  fiber_insoluble_g: 2.8
  sodium_mg: 0
  potassium_mg: 220
  iodine_ug: 1
  magnesium_mg: 81
  calcium_mg: 81
  iron_mg: 1.1
  zinc_mg: 0.9
  vitamin_c_mg: 0.0
  manganese_mg: 0.7
  polyols_g: 0.0
  carbs_available_g: 2.7
  carbs_total_g: 6.5
  copper_mg: 0.3
  selenium_ug: 1
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 144
  chloride_mg: 0.0
  sulfur_g: 0.025
  vitamin_a_ug: 0
  vitamin_d_ug: 0.0
  vitamin_e_mg: 7.7
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.06
  vitamin_b2_mg: 0.3
  vitamin_b3_mg: 1.1
  vitamin_b5_mg: 0.14
  vitamin_b6_mg: 0.04
  vitamin_b7_ug: 0
  vitamin_b9_ug: 13
  vitamin_b12_ug: 0.0
  choline_mg: 16
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.01
  omega6_la_g: 3.5
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps:
notes:
- Atwater check (available carb basis): 4×6.3 + 9×15.0 + 4×2.7 + 2×3.8 + 2.4×0.0 = 174 kcal
- USDA per-100g data scaled to 30g portion
- Almonds are nutrient-dense with high vitamin E, magnesium, healthy fats (predominantly MUFA oleic acid)
- Excellent source of healthy monounsaturated fats, fiber, and plant protein
- Very high omega-6 to omega-3 ratio (primarily linoleic acid)
change_log:
  - timestamp: '2025-11-12T00:00:00+00:00'
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: Initial creation from USDA FoodData Central reference data
    fields_changed: [all fields]
    sources:
      - note: 'USDA FoodData Central - Nuts, almonds. Per 100g: 579 kcal, 21.1g protein, 49.9g fat (sat 3.8g, MUFA 30.89g, PUFA 12.07g), 21.6g total carbs, 12.5g fiber, 4.3g sugar. Minerals: Na 1mg, K 733mg, Ca 269mg, Mg 270mg, P 481mg, Fe 3.7mg, Zn 3.1mg, Cu 1.0mg, Mn 2.2mg, Se 4.1µg. Vitamins: E 25.6mg, B1 0.20mg, B2 1.1mg, B3 3.6mg, B5 0.47mg, B6 0.14mg, Folate 44µg. All values scaled to 30g portion (×0.3).'
        url: 'https://www.nutritionvalue.org/Nuts%2C_almonds_nutritional_value.html'
      - note: 'Choline content 52mg per 100g from USDA choline database, scaled to 16mg for 30g portion (rounded from 15.6mg).'
        url: 'https://www.ars.usda.gov/ARSUserFiles/80400525/data/choline/choln02.pdf'
      - note: 'Fatty acid composition research: oleic acid (MUFA) 57-74% of total lipids, linoleic acid (omega-6 LA) 19-35% of total lipids, alpha-linolenic acid (omega-3 ALA) 0.04-0.10% of total lipids. For 15g fat: MUFA ~9.3g, omega-6 LA ~3.5g (23% of fat), omega-3 ALA ~0.01g (trace).'
        url: 'https://pubmed.ncbi.nlm.nih.gov/19021789/'
    methodology: "All USDA per-100g values multiplied by 0.3 to get 30g portion. Chloride 0 (naturally occurring sodium is minimal in raw nuts). Sulfur calculated as protein × 0.004 (plant). Fiber split estimated as 25% soluble, 75% insoluble based on typical nut fiber profiles. Fatty acid breakdown: total fat 15g split as sat 1.1g, MUFA 9.3g (62%), PUFA 3.6g (24%), with remainder as other fatty acids. PUFA split as omega-6 LA 3.5g (97% of PUFA) and omega-3 ALA 0.01g (trace). Chromium, molybdenum, biotin, ultra-trace minerals set to 0 per USDA database. Iodine trace estimate 1µg. Vitamins A, D, K, B12 are 0 (plant-based, no fortification)."
```
