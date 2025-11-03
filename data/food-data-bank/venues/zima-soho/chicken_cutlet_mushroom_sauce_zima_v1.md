## Chicken Cutlet with Mushroom Sauce with Buckwheat (Zima Soho)

```yaml
id: chicken_cutlet_mushroom_sauce_zima_v1
version: 2
last_verified: '2025-11-02'
source:
  venue: Zima, Soho, London
  menu_page: ''
  evidence:
  - User-provided nutrition data for full portion as served
  - Dish includes 150g cooked buckwheat per main
  - Pan-fried chicken cutlet with creamy mushroom sauce, buckwheat groats, and pickle
    garnish
aliases:
- Chicken Kotleta with Buckwheat
- Kotleta z Kurczaka
category: main
portion:
  description: restaurant main course with buckwheat
  est_weight_g: null
  notes: Pan-fried chicken cutlet, creamy mushroom sauce, 150g cooked buckwheat groats,
    pickle garnish
assumptions:
  salt_scheme: normal
  oil_type: likely sunflower or vegetable oil (Russian/Polish cuisine standard)
  prep: Pan-fried breaded chicken cutlet, cream-based mushroom sauce, boiled buckwheat
    (kasha), pickled vegetables
  micronutrients: Iodine (15µg) from chicken (~7µg) and cream in sauce (~8µg). Manganese
    (1.9mg) from 150g cooked buckwheat (≈50g dry at 3.7mg/100g)
per_portion:
  energy_kcal: 582.3
  protein_g: 29.7
  fat_g: 30.9
  sat_fat_g: 8.2
  mufa_g: 14.2
  pufa_g: 7.3
  trans_fat_g: 0.3
  cholesterol_mg: 140
  sugar_g: 2.7
  fiber_total_g: 5.3
  fiber_soluble_g: 1.6
  fiber_insoluble_g: 3.7
  sodium_mg: 936
  potassium_mg: 557
  iodine_ug: 15
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 1.9
  polyols_g: 0.0
  carbs_available_g: 43.7
  carbs_total_g: 49.0
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
  fat_unassigned_g: 0.9
quality:
  confidence: high
  gaps:
  - Micronutrients (magnesium, calcium, iron, zinc, vitamin_c) not provided
  - Iodine estimated from chicken and dairy in sauce (MEDIUM confidence)
  - Manganese estimated from buckwheat groats (HIGH confidence)
notes:
- 602 kcal from user-provided nutrition data
- 'Buckwheat portion: 150g cooked groats'
- 'Fat breakdown: 8.2g sat + 14.2g MUFA + 7.3g PUFA + 0.3g trans = 30.0g (0.9g unassigned/rounding)'
- PUFA-rich profile suggests vegetable oil used for frying
- Moderate sodium from sauce and seasoning
- High fiber from buckwheat and vegetables
- 'Atwater check (available carb basis): 4×29.7 + 9×30.9 + 4×43.7 + 2×5.3 + 2.4×0.0
  = 582.3 kcal'
change_log:
- timestamp: 2025-10-30 00:00:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Initial population from user-provided nutrition data for Zima restaurant
    dish
  fields_changed:
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.trans_fat_g
  - per_portion.cholesterol_mg
  - per_portion.carbs_g
  - per_portion.sugar_g
  - per_portion.fiber_total_g
  - per_portion.fiber_soluble_g
  - per_portion.fiber_insoluble_g
  - per_portion.sodium_mg
  - per_portion.potassium_mg
  sources:
  - url: user_input
    note: Complete nutrition data provided by user for Chicken Cutlet with Mushroom
      Sauce with buckwheat from Zima restaurant, Soho, London (2025-10-30)
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed:
  - derived.energy_from_macros_kcal
  - last_verified
  - notes
  - per_portion.carbs_available_g
  - per_portion.carbs_g
  - per_portion.carbs_total_g
  - per_portion.energy_kcal
  - per_portion.polyols_g
  - version
  sources: []
```
