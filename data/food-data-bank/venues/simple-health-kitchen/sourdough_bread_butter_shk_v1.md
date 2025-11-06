## Sourdough Bread with Butter (SHK)

```yaml
id: sourdough_bread_butter_shk_v1
version: 1
last_verified: 2025-11-06
source:
  venue: Simple Health Kitchen
  menu_page: "SHK Calories PDF (page 15)"
  evidence:
    - "SHK PDF: 155 kcal, 4g protein, 22g carbs (UK available), 5g fat, V, allergens: Gluten & Milk"
    - "Component analysis: ~45g sourdough bread + ~5g salted butter"
    - "USDA FoodData Central 172675 (French/Vienna bread includes sourdough) for bread micronutrients"
    - "USDA FoodData Central 173410 (salted butter) for butter micronutrients"
    - "Macros anchored to SHK PDF per ESTIMATE.md guidelines; micronutrients scaled from USDA"
aliases: []
category: side
portion:
  description: "1 serving (1 slice bread with butter)"
  est_weight_g: 50
  notes: "Small slice of sourdough bread (~45g) with ~5g butter"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: "Sourdough bread with salted butter"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 155
  protein_g: 4.0
  fat_g: 5.0
  sat_fat_g: 2.8
  mufa_g: 1.2
  pufa_g: 0.5
  trans_fat_g: 0.2
  cholesterol_mg: 11
  # Carbohydrates
  carbs_total_g: 23.0
  carbs_available_g: 22.0
  sugar_g: 0.5
  fiber_total_g: 1.0
  fiber_soluble_g: 0.3
  fiber_insoluble_g: 0.7
  polyols_g: 0.0
  # Minerals
  sodium_mg: 303
  potassium_mg: 54
  iodine_ug: 2.0
  magnesium_mg: 15
  calcium_mg: 25
  iron_mg: 1.8
  zinc_mg: 0.5
  vitamin_c_mg: 0.0
  manganese_mg: 0.3
  copper_mg: 0.1
  selenium_ug: 13
  chromium_ug: 1
  molybdenum_ug: 3
  phosphorus_mg: 50
  chloride_mg: 480
  sulfur_g: 0.05
  # Vitamins
  vitamin_a_ug: 34
  vitamin_d_ug: 0.05
  vitamin_e_mg: 0.1
  vitamin_k_ug: 0.3
  vitamin_b1_mg: 0.32
  vitamin_b2_mg: 0.19
  vitamin_b3_mg: 2.2
  vitamin_b5_mg: 0.2
  vitamin_b6_mg: 0.05
  vitamin_b7_ug: 1.4
  vitamin_b9_ug: 77
  vitamin_b12_ug: 0.01
  choline_mg: 5.4
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.03
  omega6_la_g: 0.35
  # Ultra-trace minerals
  boron_mg: 0.05
  silicon_mg: 0.5
  vanadium_ug: 0.5
  nickel_ug: 1
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps: []
notes:
  - "UK label reports available carbs (22g), total carbs include fiber (23g total)"
  - "Allergens: Gluten (bread), Milk (butter)"
  - "Vegetarian"
  - "B-vitamins from enriched sourdough flour (thiamin, riboflavin, niacin, folate)"
  - "Vitamin A, D, E, K from butter"
  - "Iron and selenium from enriched flour"
change_log:
  - "2025-11-06: Initial creation with complete 52-nutrient profile based on SHK PDF (page 15) and USDA component analysis"
```
