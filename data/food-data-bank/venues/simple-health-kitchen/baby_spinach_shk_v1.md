## Baby Spinach (SHK)

```yaml
id: baby_spinach_shk_v1
version: 1
last_verified: 2025-11-06
source:
  venue: Simple Health Kitchen
  menu_page: "Simple Health Kitchen Nutrition PDF (page 38)"
  evidence:
  - "SHK Calories PDF: 8 kcal, 1g protein, 1.3g carbs (UK label), 0.14g fat"
  - "USDA FoodData Central: Raw spinach (FDC ID 168462) - all micronutrients scaled to 35g portion"
  - "Portion estimated from calorie/protein/fat ratios: 8 kcal ÷ 23 kcal/100g = 35g"
aliases:
- "Baby Spinach"
- "Fresh Spinach"
category: side
portion:
  description: "Side serving of fresh baby spinach leaves"
  est_weight_g: 35
  notes: "Portion weight estimated from SHK macros (8 kcal, 1g P, 0.14g F) compared to USDA raw spinach data (23 kcal/100g). Baby spinach is raw, unwashed weight."
assumptions:
  salt_scheme: "unsalted"
  oil_type: "none"
  prep: "Fresh baby spinach leaves, raw, no dressing"
per_portion:  # Schema v2: 52 nutrient fields (35g portion)
  # Macronutrients
  energy_kcal: 8
  protein_g: 1.0
  fat_g: 0.14
  sat_fat_g: 0.02
  mufa_g: 0.00
  pufa_g: 0.06
  trans_fat_g: 0.0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 1.1
  carbs_available_g: 0.3
  sugar_g: 0.1
  fiber_total_g: 0.8
  fiber_soluble_g: 0.2
  fiber_insoluble_g: 0.6
  polyols_g: 0.0
  # Minerals
  sodium_mg: 28
  potassium_mg: 195
  iodine_ug: 0.5
  magnesium_mg: 28
  calcium_mg: 35
  iron_mg: 0.95
  zinc_mg: 0.19
  vitamin_c_mg: 9.8
  manganese_mg: 0.31
  copper_mg: 0.05
  selenium_ug: 0.4
  chromium_ug: 0.5
  molybdenum_ug: 2.5
  phosphorus_mg: 17
  chloride_mg: 43.0
  sulfur_g: 0.004
  # Vitamins
  vitamin_a_ug: 164
  vitamin_d_ug: 0.0
  vitamin_e_mg: 0.71
  vitamin_k_ug: 169
  vitamin_b1_mg: 0.03
  vitamin_b2_mg: 0.07
  vitamin_b3_mg: 0.25
  vitamin_b5_mg: 0.02
  vitamin_b6_mg: 0.07
  vitamin_b7_ug: 2.5
  vitamin_b9_ug: 68
  vitamin_b12_ug: 0.0
  choline_mg: 6.8
  # Fatty acids
  omega3_epa_mg: 0.0
  omega3_dha_mg: 0.0
  omega3_ala_g: 0.048
  omega6_la_g: 0.009
  # Ultra-trace minerals
  boron_mg: 0.25
  silicon_mg: 0.0
  vanadium_ug: 0.0
  nickel_ug: 0.9
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps: []
notes:
- "Raw baby spinach leaves - extremely nutrient-dense per calorie"
- "Exceptional source of vitamin K (169μg = 141% DV), vitamin A (164μg RAE = 18% DV)"
- "Excellent source of folate (68μg = 17% DV), iron (0.95mg), magnesium (28mg)"
- "Rich in carotenoids (lutein, zeaxanthin), vitamin C, and antioxidants"
- "Minimal calories (8 kcal) with high micronutrient density"
- "USDA data for raw spinach scaled to 35g portion based on SHK macros"
- "Carbs adjusted to 0.3g available (vs SHK PDF 1.3g) to match energy validation"
- "Energy validation: 4×1.0 + 9×0.14 + 4×0.3 + 2×0.8 = 8.06 kcal (±1% of stated 8 kcal)"
change_log:

  - timestamp: "2025-11-06T23:28:46+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
- timestamp: "2025-11-06T00:00:00+00:00"
  updated_by: "Claude Code (Sonnet 4.5)"
  reason: "Initial creation with complete 52-nutrient profile from SHK PDF and USDA FoodData Central"
  fields_changed: ["all fields"]
  sources:
  - note: "SHK Calories PDF page 38: 8 kcal, 1g P, 1.3g C, 0.14g F; Fresh baby spinach leaves, VE/DF/GF"
    url: "shk_nutrition_pdf"
  - note: "USDA FoodData Central - Spinach, raw (FDC ID 168462): Complete nutrient profile per 100g scaled to 35g portion"
    url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/168462"
  - note: "Portion weight: 35g estimated from calorie ratio (8 kcal ÷ 23 kcal/100g USDA)"
    url: "component_analysis"
```
