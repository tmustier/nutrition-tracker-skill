## Raspberries - 150 g

```yaml
id: raspberries_150g_v1
version: 1
last_verified: '2025-11-03'
source:
  venue: pack/ingredient
  menu_page: ''
  evidence: []
aliases: []
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 150
  notes: Fresh raspberries.
assumptions:
  salt_scheme: normal
  oil_type: ''
  prep: ''
per_portion:
  energy_kcal: 65.4
  protein_g: 1.8
  fat_g: 1.0
  sat_fat_g: 0.03
  mufa_g: 0.09
  pufa_g: 0.57
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 6.6
  fiber_total_g: 9.8
  fiber_soluble_g: 3.4
  fiber_insoluble_g: 6.4
  sodium_mg: 2
  potassium_mg: 227
  iodine_ug: 0
  magnesium_mg: 33
  calcium_mg: 38
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 39
  manganese_mg: 1
  polyols_g: 0.0
  carbs_available_g: 7.4
  carbs_total_g: 17.2
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: high
  gaps: []
notes:
- 'Atwater check (available carb basis): 4×1.8 + 9×1.0 + 4×7.4 + 2×9.8 + 2.4×0.0 = 65.4 kcal'
change_log:
- timestamp: '2025-11-03T08:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Initial creation based on USDA FoodData Central nutritional data
  fields_changed:
  - all
  sources:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/167755/nutrients
    note: 'USDA FoodData Central - Raspberries, raw (FDC ID: 167755). Per 100g: Energy 52 kcal, Protein 1.2g, Fat 0.65g (Saturated 0.019g, MUFA 0.064g, PUFA 0.375g), Carbohydrate 11.94g, Fiber 6.5g, Sugars 4.42g, Calcium 25mg, Iron 0.69mg, Magnesium 22mg, Potassium 151mg, Zinc 0.42mg, Vitamin C 26.2mg, Manganese 0.67mg. Scaled to 150g portion.'
```
