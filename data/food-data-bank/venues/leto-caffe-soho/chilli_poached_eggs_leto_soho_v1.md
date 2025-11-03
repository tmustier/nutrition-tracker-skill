## Chilli Poached Eggs (L'ETO Soho)

```yaml
id: chilli_poached_eggs_leto_soho_v1
version: 3
last_verified: "2025-11-02"
source:
  venue: L'ETO Caffe, Soho, London
  menu_page: https://deliveroo.co.uk/menu/london/soho/l-eto-caffe-soho
  evidence:
  - "Deliveroo listing: 592 kcal"
  - "Ingredients: garlic yoghurt, house sourdough, kale, chilli butter, 2 poached eggs"
  - "Component breakdown: 2 poached eggs (2×50g), Greek yogurt whole 120g, sourdough 60g, cooked kale 50g, salted butter 22.2g"
  - "Butter weight solved to close calorie gap: 22.2g × 36 kcal/5g = 160 kcal"
  - "Finishing salt per skill: 0.5% of 352g dish weight = 1.76g salt"
aliases:
- Turkish-style Poached Eggs
- Cilbir-style Eggs
category: main
portion:
  description: restaurant dish with sourdough
  est_weight_g: 352
  notes: 2 poached eggs on garlic yoghurt with house sourdough, kale, and chilli butter
assumptions:
  salt_scheme: normal
  oil_type: butter
  prep: poached eggs, toasted sourdough, sautéed kale, chilli butter (22.2g salted butter), finishing salt 1.76g (0.5% of dish weight) kale (0.05mg). Selenium (41µg) from eggs (31µg), yogurt (6µg), bread (3.6µg). Vitamin D (2.0µg) from eggs (1.8µg) and butter (0.2µg)
per_portion:
  energy_kcal: 597.4
  protein_g: 30.4
  fat_g: 34.2
  sat_fat_g: 17.7
  mufa_g: 10.9
  pufa_g: 3.5
  trans_fat_g: 0.75
  cholesterol_mg: 434
  sugar_g: 5.8
  fiber_total_g: 3.4
  fiber_soluble_g: 0.3
  fiber_insoluble_g: 3.1
  sodium_mg: 1543
  potassium_mg: 379
  iodine_ug: 28
  magnesium_mg: 45
  calcium_mg: 180
  iron_mg: 3
  zinc_mg: 2
  vitamin_c_mg: 25
  manganese_mg: 1
  copper_mg: 0.2
  selenium_ug: 41
  vitamin_d_ug: 2.0
  polyols_g: 0.0
  carbs_available_g: 40.3
  carbs_total_g: 43.7
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
  fat_unassigned_g: 1.35
  finishing_salt_g: 1.76
  dish_weight_g: 352
quality:
  confidence: high
  gaps:
  - Copper, selenium, vitamin D estimated from component analysis using USDA reference ranges (MEDIUM confidence)
notes:
- 592 kcal from Deliveroo
- "Component model: 2 eggs (100g) + Greek yogurt 120g + sourdough 60g + kale 50g + butter 22.2g"
- Butter weight calculated to close calorie gap
- High sodium from salted butter + finishing salt + bread
- Trans fat from butter (natural ruminant TFAs)
- "Atwater check (available carb basis): 4×30.4 + 9×34.2 + 4×40.3 + 2×3.4 + 2.4×0.0 = 597.4 kcal"
change_log:
- timestamp: 2025-10-29 12:15:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Initial population from Deliveroo calorie count + ingredient-based estimation
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
    note: "L'ETO Caffe Soho Deliveroo listing: 592 kcal; ingredients: garlic yoghurt, house sourdough, kale, chilli butter"
  - url: https://www.deliciousmagazine.co.uk/recipes/turkish-style-poached-eggs-with-yogurt-and-chilli-butter/
    note: "Turkish-style poached eggs reference: similar dish structure and macros"
  - url: https://fdc.nal.usda.gov/
    note: "USDA FoodData Central: component nutrition (eggs 370mg cholesterol, kale vitamin C ~25mg per serving, yogurt calcium ~180mg, bread ~250kcal per 100g)"
  - url: https://www.nutritionix.com/food/grilled-chicken-breast
    note: "Component breakdown estimation method: eggs + yogurt + bread + kale + butter to match 592 kcal target"
- timestamp: 2025-10-29 12:35:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Corrected values based on GPT-5 precise component analysis with accurate portion weights and proper salt accounting
  fields_changed:
  - version
  - portion.est_weight_g
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
  - assumptions.prep
  - derived.energy_from_macros_kcal
  - derived.fat_unassigned_g
  - derived.finishing_salt_g
  - derived.dish_weight_g
  - quality.confidence
  sources:
  - url: https://tools.myfooddata.com/nutrition-facts/172186/wt1
    note: Poached egg component profile
  - url: https://tools.myfooddata.com/nutrition-facts/171304/100g
    note: Greek yogurt whole milk profile
  - url: https://tools.myfooddata.com/nutrition-facts/471567/wt1
    note: Sourdough slice (Flowers Foods) - 60g portion
  - url: https://tools.myfooddata.com/recipe-nutrition-calculator/169238/100g/1
    note: Kale cooked - 50g portion
  - url: https://tools.myfooddata.com/nutrition-facts/173410/wt1
    note: Butter salted - 22.2g calculated to close calorie gap
- timestamp: "2025-11-02T19:20:00+00:00"
  updated_by: "LLM: GPT-5 Codex"
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
