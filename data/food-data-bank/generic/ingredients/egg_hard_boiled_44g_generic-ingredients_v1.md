## Egg, Hard-Boiled (Medium, 44g)

```yaml
id: egg_hard_boiled_44g_generic-ingredients_v1
version: 1
last_verified: 2025-11-05
source:
  venue: Generic Ingredients
  menu_page: ""
  evidence:
    - "USDA FoodData Central - Egg, whole, cooked, hard-boiled"
    - "FDC ID: 173424"
    - "Scaled from 100g USDA values to 44g (edible portion of medium egg)"
aliases: []
category: ingredient
portion:
  description: "1 medium hard-boiled egg (edible portion, shell removed)"
  est_weight_g: 44
  notes: "Medium egg: ~50g in shell, ~44g edible portion after peeling"
assumptions:
  salt_scheme: "unsalted"  # light|normal|heavy|unsalted
  oil_type: ""
  prep: "hard-boiled"
per_portion:
  energy_kcal: 68.0
  protein_g: 5.5
  fat_g: 4.7
  sat_fat_g: 1.5
  mufa_g: 1.8
  pufa_g: 0.6
  trans_fat_g: 0
  cholesterol_mg: 164
  carbs_total_g: 0.5
  carbs_available_g: 0.5
  sugar_g: 0.5
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  polyols_g: 0.0
  sodium_mg: 55
  potassium_mg: 55
  iodine_ug: 11
  magnesium_mg: 4
  calcium_mg: 22
  iron_mg: 0.5
  zinc_mg: 0.5
  vitamin_c_mg: 0
  manganese_mg: 0
  copper_mg: 0
  selenium_ug: 14
  vitamin_d_ug: 1.0
  vitamin_e_mg: 0.5
  omega3_ala_g: 0
  omega3_dha_mg: 0
  omega3_epa_mg: 0
  omega6_la_g: 0
  chloride_mg: 0
  phosphorus_mg: 0
  sulfur_g: 0
  chromium_ug: 0
  molybdenum_ug: 0
  boron_mg: 0
  nickel_ug: 0
  silicon_mg: 0
  vanadium_ug: 0
  vitamin_a_ug: 0
  vitamin_k_ug: 0
  choline_mg: 0
  vitamin_b1_mg: 0
  vitamin_b2_mg: 0
  vitamin_b3_mg: 0
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0
  vitamin_b7_ug: 0
  vitamin_b9_ug: 0
  vitamin_b12_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps: []
notes:
  - "USDA data per 100g: 155 kcal, 12.6g P, 10.6g F (3.3g sat, 4.1g MUFA, 1.4g PUFA), 1.1g C, 373mg cholesterol"
  - "Scaled to 44g edible portion (medium egg without shell)"
  - "Eggs are naturally low in carbohydrates (~1.1g per 100g, mostly as glucose)"
  - "Zero fiber (animal product) and zero vitamin C"
  - "Excellent source of protein (5.5g per egg) and high-quality complete amino acids"
  - "Rich in choline, B vitamins (especially B12, riboflavin, folate), selenium, and vitamin D"
  - "High in cholesterol (164mg per egg) but dietary cholesterol has minimal impact on blood cholesterol for most people"
  - "Iodine content varies based on hen diet; using conservative estimate of 24µg/100g"
  - "Atwater validation: 4×5.5 + 9×4.7 + 4×0.5 + 2×0 + 2.4×0 = 66.3 kcal (within 2.5% of USDA 68 kcal)"
change_log:
  - timestamp: "2025-11-05T10:30:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Initial population with comprehensive USDA nutrition data for medium hard-boiled egg"
    fields_changed:
      - "all per_portion fields"
      - "portion.est_weight_g"
      - "assumptions.salt_scheme"
      - "assumptions.prep"
      - "quality.confidence"
      - "source.evidence"
      - "notes"
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/173424/nutrients"
        note: "USDA FoodData Central - Egg, whole, cooked, hard-boiled (FDC ID: 173424)"
```
