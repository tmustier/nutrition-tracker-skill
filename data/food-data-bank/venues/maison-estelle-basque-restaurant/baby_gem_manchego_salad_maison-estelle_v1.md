## Baby Gem, Sundried Tomatoes, Manchego & Pine Nuts (Maison Estelle)

```yaml
id: baby_gem_manchego_salad_maison-estelle_v1
version: 1
last_verified: 2025-11-15
source:
  venue: Maison Estelle - Basque Restaurant
  menu_page: ""
  evidence:
    - "Component-based estimation using USDA FoodData Central"
    - "Baby gem lettuce: USDA FDC 169247 (Lettuce, cos or romaine, raw)"
    - "Pine nuts: USDA FDC 170591 (Nuts, pine nuts, dried)"
    - "Sun-dried tomatoes: USDA FDC 169384 (Tomatoes, sun-dried, packed in oil, drained)"
    - "Olive oil: USDA FDC 171413 (Oil, olive, salad or cooking)"
    - "Manchego cheese: Based on commercial manchego nutrition data (~420 kcal, 25g P, 35g F per 100g)"
    - "Portion sizes estimated from restaurant salad standards and user description (6 baby gem quarters)"
aliases: []
category: side
portion:
  description: "full salad portion (6 baby gem quarters)"
  est_weight_g: 203
  notes: "Component breakdown: 130g baby gem lettuce (6 quarters from ~1.5 heads), 22g manchego cheese (shaved), 18g sun-dried tomatoes (oil-packed), 12g pine nuts, 16g olive oil, 5g sherry vinegar"
assumptions:
  salt_scheme: "light"
  oil_type: "extra virgin olive oil"
  prep: "Baby gem lettuce quartered lengthwise, dressed with Spanish-style vinaigrette (olive oil + sherry vinegar), topped with shaved manchego, oil-packed sun-dried tomatoes, and toasted pine nuts"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 387
  protein_g: 9.7
  fat_g: 34.8
  sat_fat_g: 8.7
  mufa_g: 17.3
  pufa_g: 6.7
  trans_fat_g: 0
  cholesterol_mg: 23
  # Carbohydrates
  carbs_total_g: 11.0
  carbs_available_g: 6.7
  sugar_g: 5.0
  fiber_total_g: 4.2
  fiber_soluble_g: 1.3
  fiber_insoluble_g: 2.9
  polyols_g: 0.0
  # Minerals
  sodium_mg: 190
  potassium_mg: 725
  iodine_ug: 5
  magnesium_mg: 71
  calcium_mg: 288
  iron_mg: 2.4
  zinc_mg: 2.2
  vitamin_c_mg: 24
  manganese_mg: 1.4
  copper_mg: 0.30
  selenium_ug: 4
  chromium_ug: 1
  molybdenum_ug: 3
  phosphorus_mg: 243
  chloride_mg: 293
  sulfur_g: 0.07
  # Vitamins
  vitamin_a_ug: 625
  vitamin_d_ug: 0.1
  vitamin_e_mg: 4.1
  vitamin_k_ug: 155
  vitamin_b1_mg: 0.17
  vitamin_b2_mg: 0.27
  vitamin_b3_mg: 1.6
  vitamin_b5_mg: 0.36
  vitamin_b6_mg: 0.17
  vitamin_b7_ug: 2
  vitamin_b9_ug: 190
  vitamin_b12_ug: 0.4
  choline_mg: 22
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.13
  omega6_la_g: 5.7
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 2.1  # Glycerol backbone and minor lipid fractions (6% of total fat)
quality:
  confidence: medium
  gaps:
    - "Soluble/insoluble fiber ratio estimated from typical vegetable profiles"
    - "Manchego micronutrients (B vitamins, selenium) estimated from sheep cheese averages"
    - "Chromium, molybdenum, biotin estimated (low confidence on trace amounts)"
notes:
  - "Component-based estimation method used throughout"
  - "Baby gem lettuce portions: 6 quarters = approximately 1.5 heads at 80-90g each = 130g total"
  - "Pine nuts portion (12g) is typical restaurant garnish amount, not the higher amounts seen in home recipes"
  - "Sun-dried tomatoes are oil-packed variety, drained weight estimated at 18g"
  - "Spanish-style vinaigrette: 3:1 ratio olive oil to sherry vinegar (16g oil + 5g vinegar)"
  - "Manchego cheese shaved/grated: 22g provides structure and umami without overwhelming the salad"
  - "Energy validates to Atwater formula: 4×9.7 + 9×34.8 + 4×6.7 + 2×4.2 = 387 kcal ✓"
change_log:
  - timestamp: "2025-11-15T00:00:00Z"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial creation with complete nutrition profile (all 52 fields)"
    notes: "Used USDA FoodData Central for all components. Chloride derived from sodium (×1.54). Sulfur derived from protein (animal 1%, plant 0.4%). Component weights: 130g lettuce, 22g manchego, 18g sun-dried tomatoes, 12g pine nuts, 16g olive oil, 5g sherry vinegar. Total weight 203g."
```
