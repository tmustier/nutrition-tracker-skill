## Sparkling Tea, Non-Alcoholic (Generic)

```yaml
id: sparkling_tea_nonalcoholic_generic_v1
version: 1
last_verified: 2025-11-14
source:
  venue: Generic
  menu_page: ""
  evidence:
    - "Primary reference: TÖST Sparkling White Tea (https://tostbeverages.com/products/tost-750ml)"
    - "TÖST nutrition per 240ml: 45 kcal, 10g carbs, 10g sugar (https://www.nutritionvalue.org/Sparkling_white_tea_by_TOST_566163_nutritional_value.html)"
    - "Scaled to 250ml standard glass serving"
    - "Tea minerals from USDA FoodData Central - Green Tea Brewed (FDC #171917)"
    - "Research on tea mineral content: https://pmc.ncbi.nlm.nih.gov/articles/PMC7967157/"
    - "Cross-referenced multiple brands: Saicho (22-34 cal/125ml), HopTea (0-50 cal), Three Spirit Spark (25 cal/125ml)"
aliases:
  - "NA sparkling tea"
  - "alcohol-free sparkling tea"
  - "sparkling white tea"
category: drink
portion:
  description: "standard glass"
  est_weight_g: 250
  notes: "Typical serving size for a glass of sparkling beverage; based on TÖST and similar premium sparkling tea brands"
assumptions:
  salt_scheme: "unsalted"
  oil_type: "n/a"
  prep: "Commercial sparkling tea beverage, lightly sweetened with agave or similar natural sweetener"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 42
  protein_g: 0.0
  fat_g: 0.0
  sat_fat_g: 0.0
  mufa_g: 0.0
  pufa_g: 0.0
  trans_fat_g: 0.0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 10.4
  carbs_available_g: 10.4
  sugar_g: 10.4
  fiber_total_g: 0.0
  fiber_soluble_g: 0.0
  fiber_insoluble_g: 0.0
  polyols_g: 0.0
  # Minerals
  sodium_mg: 2
  potassium_mg: 13
  iodine_ug: 0
  magnesium_mg: 3
  calcium_mg: 8
  iron_mg: 0.05
  zinc_mg: 0.03
  vitamin_c_mg: 1.5
  manganese_mg: 0.3
  copper_mg: 0.03
  selenium_ug: 0.1
  chromium_ug: 0.2
  molybdenum_ug: 0.1
  phosphorus_mg: 2
  chloride_mg: 3
  sulfur_g: 0.0
  # Vitamins
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0.0
  vitamin_k_ug: 0.0
  vitamin_b1_mg: 0.0
  vitamin_b2_mg: 0.0
  vitamin_b3_mg: 0.0
  vitamin_b5_mg: 0.0
  vitamin_b6_mg: 0.0
  vitamin_b7_ug: 0.0
  vitamin_b9_ug: 0.0
  vitamin_b12_ug: 0.0
  choline_mg: 0.0
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.0
  omega6_la_g: 0.0
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
  - "Profile represents typical lightly-sweetened commercial sparkling tea (e.g., TÖST, Saicho, Three Spirit)"
  - "Sweetness level: 10.4g sugar per 250ml glass, primarily from natural sweeteners (agave, fruit juice)"
  - "Caffeine content not tracked in nutrient schema, but white tea typically contains 15-30mg per cup"
  - "Mineral content scaled from USDA brewed tea data; actual content may vary by brand and tea type"
  - "Unsweetened varieties (HopTea, Sound Organic) would have ~0 calories and 0g carbs"
  - "Validation: Energy (42 kcal) = 4×10.4g carbs = 41.6 kcal (within tolerance). TÖST label shows 47 kcal likely including organic acids, but using Atwater-consistent value for database."
change_log:
  - timestamp: "2025-11-14T00:00:00Z"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial creation - complete nutrition profile for non-alcoholic sparkling tea"
    notes: "Research-based estimate using TÖST as primary reference (250ml serving, 10.4g carbs/sugar). Energy adjusted to 42 kcal (Atwater formula) vs label 47 kcal (includes organic acids). Minerals scaled from USDA brewed tea data. Represents typical lightly-sweetened commercial sparkling tea product."
```
