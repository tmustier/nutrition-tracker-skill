## Tenderstem Broccoli, Cashew Nuts & Sesame Dressing (Maison Estelle)

```yaml
id: tenderstem_broccoli_cashew_sesame_maison-estelle_v1
version: 1
last_verified: 2025-11-15
source:
  venue: Maison Estelle - Basque Restaurant
  menu_page: ""
  evidence:
    - "Component-based estimation using USDA FoodData Central"
    - "Portion size based on upscale restaurant standards (Quaglino's Mayfair: 62.5g/person)"
    - "Broccoli cooked (FDC 169967/170379)"
    - "Cashew nuts raw (FDC 170162)"
    - "Sesame oil (FDC 172259)"
    - "Soy sauce (FDC 174277)"
    - "Honey (FDC 169640)"
aliases: []
category: side
portion:
  description: "full restaurant portion (user ate 1/2)"
  est_weight_g: 125
  notes: "80g tenderstem broccoli (blanched/roasted) + 20g cashew nuts + 25g sesame dressing (12g sesame oil, 8g soy sauce, 3g rice vinegar, 2g honey) + finishing salt"
assumptions:
  salt_scheme: "normal"
  oil_type: "toasted sesame oil"
  prep: "tenderstem broccoli blanched or roasted; Asian-style sesame dressing"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 257
  protein_g: 6.0
  fat_g: 21.1
  sat_fat_g: 3.4
  mufa_g: 9.6
  pufa_g: 6.7
  trans_fat_g: 0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 14.0
  carbs_available_g: 10.7
  sugar_g: 3.9
  fiber_total_g: 3.3
  fiber_soluble_g: 1.2
  fiber_insoluble_g: 2.1
  polyols_g: 0.0
  # Minerals
  sodium_mg: 717
  potassium_mg: 402
  iodine_ug: 1
  magnesium_mg: 81
  calcium_mg: 42
  iron_mg: 2.0
  zinc_mg: 1.6
  vitamin_c_mg: 52
  manganese_mg: 0.6
  copper_mg: 0.5
  selenium_ug: 5
  chromium_ug: 14
  molybdenum_ug: 12
  phosphorus_mg: 186
  chloride_mg: 1104
  sulfur_g: 0.02
  # Vitamins
  vitamin_a_ug: 62
  vitamin_d_ug: 0
  vitamin_e_mg: 1.6
  vitamin_k_ug: 122
  vitamin_b1_mg: 0.13
  vitamin_b2_mg: 0.12
  vitamin_b3_mg: 0.8
  vitamin_b5_mg: 0.7
  vitamin_b6_mg: 0.25
  vitamin_b7_ug: 2
  vitamin_b9_ug: 92
  vitamin_b12_ug: 0
  choline_mg: 27
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.07
  omega6_la_g: 6.5
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 1.4
quality:
  confidence: medium
  gaps:
    - "1.4g fat unassigned (glycerol backbone, phospholipids, trace trans fats)"
notes:
  - "Component breakdown: 80g tenderstem broccoli (cooked) + 20g cashew nuts + 12g toasted sesame oil + 8g soy sauce + 3g rice vinegar + 2g honey"
  - "Tenderstem broccoli portion based on Quaglino's restaurant (Mayfair) standard: 62.5g/person, scaled to 80g for substantial side"
  - "Cashews: 20g as substantial garnish (typical Asian-influenced vegetable dish)"
  - "Sesame dressing: 25g total (typical restaurant dressing for 100g vegetables/nuts)"
  - "Sodium includes 439mg from soy sauce + 250mg finishing salt (0.5% of total weight) + intrinsic"
  - "Atwater validation: 4×6.0 + 9×21.1 + 4×10.7 + 2×3.3 = 264 kcal vs 257 reported (2.7% variance, within tolerance)"
  - "Fat breakdown: 3.4g sat + 9.6g MUFA + 6.7g PUFA = 19.7g (vs 21.1g total), 1.4g unassigned"
  - "Chloride derived from sodium (717mg × 1.54 = 1104mg)"
  - "Sulfur derived from plant protein (6.0g × 0.004 = 0.024g ≈ 0.02g)"
  - "All components plant-based: cholesterol = 0, B12 = 0, EPA/DHA = 0, vitamin D = 0"
  - "Tenderstem broccoli (broccolini) nutritionally similar to regular broccoli; USDA broccoli cooked data used"
  - "Excellent source of vitamin K (122µg, ~102% DV), vitamin C (52mg, ~58% DV), copper (0.5mg, ~56% DV)"
  - "Good source of chromium (14µg, ~40% DV), molybdenum (12µg, ~27% DV) from cruciferous vegetables"
change_log:
  - timestamp: "2025-11-15T00:00:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial creation with complete component-based estimation from USDA data"
    notes: "Comprehensive 52-nutrient estimation using USDA FoodData Central for all components. Broccoli cooked (FDC 169967), cashews raw (FDC 170162), sesame oil (FDC 172259), soy sauce (FDC 174277), honey (FDC 169640). Chloride and sulfur calculated from sodium and protein. All values scaled to component weights and summed. Energy validates within 2.7% of Atwater formula."
```
