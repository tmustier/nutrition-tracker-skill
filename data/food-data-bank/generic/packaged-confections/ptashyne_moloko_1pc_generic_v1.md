## Ptashyne Moloko (Bird's Milk) Candy (1 piece)

```yaml
id: ptashyne_moloko_1pc_generic_v1
schema_version: 2
version: 1
last_verified: 2025-11-11
source:
  venue: Packaged Confections
  menu_page: ""
  evidence:
    - "USDA FoodData Central - Chocolate Coated Marshmallows (FDC ID: 172723)"
    - "https://foods.fatsecret.com/calories-nutrition/usda/chocolate-coated-marshmallows"
    - "USDA FoodData Central - Candies, marshmallows (FDC ID: 167995)"
    - "https://www.nutritionvalue.org/Candies%2C_marshmallows_nutritional_value.html"
    - "USDA FoodData Central - Candies, milk chocolate (FDC ID: 167587)"
    - "https://www.nutritionvalue.org/Candies%2C_milk_chocolate_nutritional_value.html"
aliases:
  - "Пташине молоко"
  - "Bird's Milk Candy"
  - "Ptichye Moloko"
category: ingredient
portion:
  description: "1 piece (~15g)"
  est_weight_g: 15
  notes: "Traditional Ukrainian confection with marshmallow/soufflé interior coated in chocolate"
assumptions:
  salt_scheme: "light"
  oil_type: "milk_chocolate"
  prep: "chocolate-coated confection"
  composition: "Estimated 35% chocolate coating (5.25g), 65% marshmallow filling (9.75g) based on typical chocolate-covered marshmallow structure"
  estimation_method: "Primary source: USDA FDC 172723 (chocolate coated marshmallows) scaled to 15g. Micronutrients estimated using weighted component analysis: 35% milk chocolate (FDC 167587) + 65% marshmallow (FDC 167995)"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 63.2
  protein_g: 0.6
  fat_g: 2.5
  sat_fat_g: 0.7
  mufa_g: 1.4
  pufa_g: 0.3
  trans_fat_g: 0
  cholesterol_mg: 1.2
  # Carbohydrates
  carbs_total_g: 10.2
  carbs_available_g: 9.9
  sugar_g: 6.7
  fiber_total_g: 0.3
  fiber_soluble_g: 0.1
  fiber_insoluble_g: 0.2
  polyols_g: 0.0
  # Minerals
  sodium_mg: 25.2
  potassium_mg: 27.3
  iodine_ug: 0.5
  magnesium_mg: 3.5
  calcium_mg: 10.8
  iron_mg: 0.38
  zinc_mg: 0.13
  vitamin_c_mg: 0.02
  manganese_mg: 0.03
  copper_mg: 0.02
  selenium_ug: 0.4
  chromium_ug: 0.3
  molybdenum_ug: 0.5
  phosphorus_mg: 11.8
  chloride_mg: 38.8
  sulfur_g: 0.006
  # Vitamins
  vitamin_a_ug: 1.1
  vitamin_d_ug: 0.1
  vitamin_e_mg: 0.03
  vitamin_k_ug: 0.3
  vitamin_b1_mg: 0.006
  vitamin_b2_mg: 0.017
  vitamin_b3_mg: 0.022
  vitamin_b5_mg: 0.025
  vitamin_b6_mg: 0.003
  vitamin_b7_ug: 0.3
  vitamin_b9_ug: 0.6
  vitamin_b12_ug: 0.04
  choline_mg: 2.4
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.003
  omega6_la_g: 0.08
  # Ultra-trace minerals (not tracked)
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 0.1
quality:
  confidence: medium
  gaps: []
notes:
  - "Ptashyne Moloko (Пташине молоко / Bird's Milk) is a traditional Ukrainian/Soviet confection with a light marshmallow or soufflé center coated in chocolate"
  - "Estimated 15g per piece based on typical single-serve confection size"
  - "Macronutrients scaled from USDA FDC 172723 (chocolate coated marshmallows): 421 kcal, 4g P, 16.9g F, 67.7g C per 100g"
  - "Fatty acid breakdown from USDA data: 4.7g sat, 9.3g MUFA, 1.9g PUFA per 100g"
  - "Micronutrients estimated using weighted component analysis: 35% chocolate (5.25g) + 65% marshmallow (9.75g)"
  - "Chocolate component contributes most minerals (calcium, magnesium, iron, phosphorus) and B-vitamins"
  - "Marshmallow component is primarily sugar and gelatin with minimal micronutrients"
  - "Cholesterol calculated from milk chocolate component: 23mg per 100g chocolate × 5.25g = 1.2mg"
  - "Chloride derived from sodium: 25.2mg × 1.54 = 38.8mg"
  - "Sulfur derived from protein: 0.6g × 0.01 = 0.006g (assuming mixed animal/plant protein from milk and gelatin)"
  - "Iodine very low due to minimal dairy content in coating"
  - "B-vitamins present primarily from milk solids in chocolate coating"
  - "Fat-soluble vitamins (A, D, E, K) present in trace amounts from chocolate"
  - "Atwater validation: 4×0.6 + 9×2.5 + 4×9.9 + 2×0.3 + 2.4×0.0 = 2.4 + 22.5 + 39.6 + 0.6 = 65.1 kcal (within 3% of 63.2 kcal, acceptable variation)"
change_log:
  - timestamp: '2025-11-11T12:00:00+00:00'
    updated_by: 'LLM: Claude Sonnet 4.5'
    change: 'Initial creation with complete nutrient profile for Ukrainian Ptashyne Moloko candy (1 piece, 15g)'
    notes: 'Populated all 52 nutrient fields using USDA FDC 172723 as primary source for macros (chocolate coated marshmallows), with micronutrients estimated from weighted component analysis (35% milk chocolate FDC 167587 + 65% marshmallow FDC 167995). Confidence: MEDIUM (±20-40%) due to estimation of micronutrients from components rather than direct analysis of this specific Ukrainian candy variant.'
    fields_changed: ['all fields']
    sources:
      - note: 'USDA FoodData Central - Chocolate Coated Marshmallows'
        fdc_id: 172723
        url: 'https://foods.fatsecret.com/calories-nutrition/usda/chocolate-coated-marshmallows'
      - note: 'USDA FoodData Central - Candies, marshmallows'
        fdc_id: 167995
        url: 'https://www.nutritionvalue.org/Candies%2C_marshmallows_nutritional_value.html'
      - note: 'USDA FoodData Central - Candies, milk chocolate'
        fdc_id: 167587
        url: 'https://www.nutritionvalue.org/Candies%2C_milk_chocolate_nutritional_value.html'
```
