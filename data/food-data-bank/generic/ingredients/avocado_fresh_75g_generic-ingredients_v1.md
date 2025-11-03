## Avocado (Fresh, 75g)

```yaml
id: avocado_fresh_75g_generic-ingredients_v1
version: 1
last_verified: 2025-11-03
source:
  venue: Generic Ingredients
  menu_page: ""
  evidence:
    - "USDA FoodData Central - Avocado, raw, California (Hass)"
    - "FDC ID: 171706"
aliases: []
category: ingredient
portion:
  description: "1/2 of one medium avocado (edible flesh only)"
  est_weight_g: 75
  notes: "Fresh Hass avocado, pit and skin removed"
assumptions:
  salt_scheme: "unsalted"
  oil_type: ""
  prep: "raw"
    from FIBER-SPLIT-ESTIMATION-REFERENCE.yaml; avocados have unique fiber composition
    with predominantly insoluble cellulose and hemicellulose. Confidence MEDIUM.
per_portion:
  energy_kcal: 120.0
  protein_g: 1.5
  fat_g: 11.0
  sat_fat_g: 1.6
  mufa_g: 7.3
  pufa_g: 1.4
  trans_fat_g: 0
  cholesterol_mg: 0
  carbs_total_g: 6.4
  carbs_available_g: 1.4
  sugar_g: 0.5
  fiber_total_g: 5.0
  fiber_soluble_g: 1.2
  fiber_insoluble_g: 3.8
  polyols_g: 0.0
  sodium_mg: 5
  potassium_mg: 364
  iodine_ug: 0
  magnesium_mg: 21
  calcium_mg: 9
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 8
  manganese_mg: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps: []
notes:
  - "Scaled from USDA per 100g values: 160 kcal, 2.0g P, 14.7g F (2.1g sat, 9.8g MUFA, 1.8g PUFA), 8.5g C, 6.7g fiber, 0.7g sugar"
  - "Average medium Hass avocado: ~150g edible flesh, so 75g = 1/2 portion"
  - "Rich in heart-healthy monounsaturated fats (oleic acid)"
  - "Excellent source of potassium (364mg per 75g)"
  - "Good source of fiber (5.0g per 75g)"
  - "Contains vitamins K, E, C, and B vitamins"
  - "Low in sodium, naturally unsalted"
  - "Atwater check (available carb basis): 4×1.5 + 9×11.0 + 4×1.4 + 2×5.0 + 2.4×0.0 = 120.6 kcal"
change_log:
  - timestamp: "2025-11-03T10:30:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Initial population with USDA nutrition data for 56g portion (3/8 avocado)"
    fields_changed:
      - "all fields"
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/171706/nutrients"
        note: "USDA FoodData Central - Avocado, raw, California"
  - timestamp: "2025-11-03T09:10:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Updated default portion from 3/8 (56g) to 1/2 avocado (75g) for databank consistency"
    fields_changed:
      - "portion.description"
      - "portion.est_weight_g"
      - "all per_portion nutrition values"
      - "id"
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/171706/nutrients"
        note: "USDA FoodData Central - Avocado, raw, California"
```
