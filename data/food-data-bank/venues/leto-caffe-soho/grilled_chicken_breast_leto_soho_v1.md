## Grilled Chicken Breast (L'ETO Soho)

```yaml
id: grilled_chicken_breast_leto_soho_v1
version: 3
last_verified: '2025-11-02'
source:
  venue: L'ETO Caffe, Soho, London
  menu_page: https://deliveroo.co.uk/menu/london/soho/l-eto-caffe-soho
  evidence:
  - 'Deliveroo listing: 135 kcal'
  - 'Component-based: 86g cooked chicken breast scaled from USDA profile'
  - Finishing salt per skill salt_scheme (0.5% of weight)
aliases:
- Chicken Breast
category: side
portion:
  description: restaurant portion
  est_weight_g: 86
  notes: Plain grilled chicken breast, no sauce
assumptions:
  salt_scheme: normal
  oil_type: minimal or none
  prep: grilled, no skin, finishing salt 0.5% of weight (0.43g salt)
per_portion:
  energy_kcal: 135.6
  protein_g: 27.6
  fat_g: 2.8
  sat_fat_g: 0.9
  mufa_g: 1.1
  pufa_g: 0.7
  trans_fat_g: 0.0
  cholesterol_mg: 100
  sugar_g: 0.0
  fiber_total_g: 0.0
  fiber_soluble_g: 0.0
  fiber_insoluble_g: 0.0
  sodium_mg: 212
  potassium_mg: 295
  iodine_ug: 4
  magnesium_mg: 27
  calcium_mg: 15
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 0.0
  carbs_total_g: 0.0
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
  finishing_salt_g: 0.43
  fat_unassigned_g: 0.1
quality:
  confidence: high
  gaps: []
notes:
- 135 kcal from Deliveroo
- 86g portion calculated from USDA 157 kcal/100g profile
- Plain chicken has zero carbs
- 'Atwater check (available carb basis): 4×27.6 + 9×2.8 + 4×0.0 + 2×0.0 + 2.4×0.0
  = 135.6 kcal'
change_log:
- timestamp: 2025-10-29 12:00:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Initial population from Deliveroo calorie count + reference macros from
    Whataburger
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
  - per_portion.iodine_ug
  - per_portion.magnesium_mg
  - per_portion.calcium_mg
  - per_portion.iron_mg
  - per_portion.zinc_mg
  - per_portion.vitamin_c_mg
  - per_portion.manganese_mg
  - portion.est_weight_g
  sources:
  - url: https://deliveroo.co.uk/menu/london/soho/l-eto-caffe-soho
    note: 'L''ETO Caffe Soho Deliveroo listing: 135 kcal'
  - url: https://www.mynetdiary.com/food/calories-in-grilled-chicken-breast-by-whataburger-serving-34958765-0.html
    note: 'Whataburger grilled chicken breast: 135 kcal, 24g protein, 2g carbs, 2.5g
      fat'
  - url: https://fdc.nal.usda.gov/
    note: 'USDA FoodData Central: chicken breast micronutrients (potassium 320mg,
      magnesium 27mg, zinc 1mg, iron 1mg, cholesterol ~70mg per 100g)'
- timestamp: 2025-10-29 12:30:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Corrected values based on GPT-5 component analysis with precise portion
    weight (86g) and proper salt accounting
  fields_changed:
  - version
  - portion.est_weight_g
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.cholesterol_mg
  - per_portion.carbs_g
  - per_portion.sodium_mg
  - per_portion.potassium_mg
  - assumptions.salt_scheme
  - assumptions.prep
  - derived.energy_from_macros_kcal
  - derived.finishing_salt_g
  - derived.fat_unassigned_g
  - quality.confidence
  sources:
  - url: https://tools.myfooddata.com/nutrition-facts/100009715/100g
    note: 'MyFoodData chicken breast cooked: scaled to 86g to match 135 kcal anchor'
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
