## Almond Croissant (Generic Bakery)

```yaml
id: almond_croissant_generic_v1
version: 1
last_verified: '2025-11-03'
source:
  venue: Generic Bakery
  menu_page: ''
  evidence:
  - 'USDA FoodData Central #174987 - Butter croissants'
  - 'USDA FoodData Central #170567 - Almonds'
  - Component-based estimation for almond frangipane filling
  - Web research: typical almond croissant weighs 95-140g
aliases:
- croissant aux amandes
category: dessert
portion:
  description: typical bakery portion
  est_weight_g: 110
  notes: 'Butter croissant (70g) + almond frangipane filling (30g) + sliced almonds on top (10g)'
assumptions:
  salt_scheme: light
  oil_type: butter
  prep: butter croissant filled with almond frangipane paste and topped with sliced almonds
per_portion:
  energy_kcal: 506
  protein_g: 10.2
  fat_g: 33.0
  sat_fat_g: 14.5
  mufa_g: 12.5
  pufa_g: 3.5
  trans_fat_g: 0.3
  cholesterol_mg: 65
  sugar_g: 11.3
  fiber_total_g: 4.0
  fiber_soluble_g: 0.8
  fiber_insoluble_g: 3.2
  sodium_mg: 347
  potassium_mg: 173
  iodine_ug: 0
  magnesium_mg: 42
  calcium_mg: 47
  iron_mg: 1.6
  zinc_mg: 0.8
  copper_mg: 0.2
  vitamin_c_mg: 0
  vitamin_e_mg: 5.1
  manganese_mg: 0.4
  polyols_g: 0.0
  carbs_available_g: 38.6
  carbs_total_g: 42.6
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps:
  - Fiber sub-types
  - Iodine
  - Vitamin C assumed minimal
  - Frangipane composition estimated from typical recipes
notes:
- Component-based calculation using USDA profiles scaled to estimated weights
- 'Butter croissant 70g: 284 kcal, 5.7g P, 14.7g F (8.4g sat, 3.9g MUFA, 0.8g PUFA), 30.2g C, 327mg Na'
- 'Almond frangipane 30g (10g almonds + 10g butter + 8g sugar + 2g egg): 164 kcal, 2.4g P, 13.3g F (5.7g sat, 5.4g MUFA, 1.5g PUFA), 10.2g C'
- 'Sliced almonds 10g: 58 kcal, 2.1g P, 5.0g F (0.4g sat, 3.2g MUFA, 1.2g PUFA), 2.2g C, 73mg K, 27mg Mg'
- Cholesterol estimated from butter (50mg) + egg (15mg) in components
- Sugar primarily from frangipane filling (granulated sugar in almond paste)
- Fiber from almond content (ground almonds in frangipane + sliced almonds on top)
- Sodium mainly from croissant dough; light salt scheme as typical bakery pastries have minimal finishing salt
- 'Almonds provide good amounts of: magnesium (42mg), vitamin E (estimated ~4mg), manganese (0.4mg)'
- Trans fat from butter in croissant and frangipane
- 'Typical portion sizes: small bakery 90-100g, large artisanal 120-140g'
- Store at room temperature for same day consumption or freeze for longer storage
- 'Atwater check (available carb basis): 4×10.2 + 9×33.0 + 4×38.6 + 2×4.0 = 500.2 kcal ≈ 506 kcal'
change_log:
- timestamp: 2025-11-03T00:00:00+0000
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial entry using component-based estimation methodology for user consumption
  fields_changed:
  - all fields
  sources:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/174987/nutrients
    note: 'USDA butter croissant profile (per 100g): 406 kcal, 8.2g P, 21g F, 43.2g C'
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/170567/nutrients
    note: 'USDA almonds profile (per 100g): 579 kcal, 21.15g P, 49.93g F (3.8g sat, 31.55g MUFA, 12.33g PUFA), 12.5g fiber'
  - url: https://www.nutritionvalue.org/Nuts%2C_almonds_nutritional_value.html
    note: Complete USDA almond micronutrient data
  - url: user_request
    note: 'User consumed half an almond croissant on 2025-11-03'
```
