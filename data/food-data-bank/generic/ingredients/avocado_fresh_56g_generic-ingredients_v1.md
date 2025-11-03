## Avocado (Fresh, 56g)

```yaml
id: avocado_fresh_56g_generic-ingredients_v1
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
  description: "3/8 of one medium avocado (edible flesh only)"
  est_weight_g: 56
  notes: "Fresh Hass avocado, pit and skin removed"
assumptions:
  salt_scheme: "unsalted"
  oil_type: ""
  prep: "raw"
per_portion:
  energy_kcal: 89.6
  protein_g: 1.1
  fat_g: 8.2
  sat_fat_g: 1.2
  mufa_g: 5.5
  pufa_g: 1.0
  trans_fat_g: 0
  cholesterol_mg: 0
  carbs_total_g: 4.8
  carbs_available_g: 1.0
  sugar_g: 0.4
  fiber_total_g: 3.8
  fiber_soluble_g: null
  fiber_insoluble_g: null
  polyols_g: 0.0
  sodium_mg: 4
  potassium_mg: 272
  iodine_ug: null
  magnesium_mg: 16
  calcium_mg: 7
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 6
  manganese_mg: null
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps:
    - "Fiber split (soluble/insoluble) not available in USDA data"
notes:
  - "Scaled from USDA per 100g values: 160 kcal, 2.0g P, 14.7g F (2.1g sat, 9.8g MUFA, 1.8g PUFA), 8.5g C, 6.7g fiber, 0.7g sugar"
  - "Average medium Hass avocado: ~150g edible flesh, so 56g = 3/8 portion"
  - "Rich in heart-healthy monounsaturated fats (oleic acid)"
  - "Excellent source of potassium (272mg per 56g)"
  - "Good source of fiber (3.8g per 56g)"
  - "Contains vitamins K, E, C, and B vitamins"
  - "Low in sodium, naturally unsalted"
  - "Atwater check (available carb basis): 4×1.1 + 9×8.2 + 4×1.0 + 2×3.8 + 2.4×0.0 = 89.6 kcal"
change_log:
  - timestamp: "2025-11-03T10:30:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Initial population with USDA nutrition data for 56g portion (3/8 avocado)"
    fields_changed:
      - "all fields"
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/171706/nutrients"
        note: "USDA FoodData Central - Avocado, raw, California"
```
