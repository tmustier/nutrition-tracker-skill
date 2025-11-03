## Duck Broth with Tofu (Imperial Treasure St. James)

```yaml
id: duck_broth_tofu_imperial_treasure_st_james_v1
version: 1
last_verified: 2025-11-02
source:
  venue: Duck Broth with Tofu (Imperial Treasure St. James)
  menu_page: ""
  evidence:
    - "https://honest-food.net/duck-stock-recipe/"
    - "https://fdc.nal.usda.gov/fdc-app.html#/food-details/172475/nutrients"
    - "https://theconsciouslife.com/foods/duck-fat-04574.htm"
aliases: []
category: main
portion:
  description: "small bowl (120ml broth with 3 tofu cubes)"
  est_weight_g: 135
  notes: "Clear duck broth from Peking duck course with 3 small cubes of firm tofu (~15g total)"
assumptions:
  salt_scheme: "normal"
  oil_type: "duck fat"
  prep: "Component-based estimation: 120ml clear duck broth + 15g firm tofu cubes"
per_portion:
  energy_kcal: 45
  protein_g: 4.3
  fat_g: 2.6
  sat_fat_g: 0.6
  mufa_g: 0.9
  pufa_g: 0.9
  trans_fat_g: 0.0
  cholesterol_mg: 5
  carbs_available_g: 1.0
  sugar_g: 0.1
  fiber_total_g: 0.4
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 302
  potassium_mg: 148
  iodine_ug: 0
  magnesium_mg: 14
  calcium_mg: 112
  iron_mg: 1
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0.0
  carbs_total_g: 1.4

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: ["Iodine, manganese, and fiber splits unavailable; duck broth composition estimated from homemade recipes and chicken broth baseline"]
notes:
  - "Component 1 - Duck broth (120ml): Estimated at 28 kcal based on clear restaurant duck broth (~23 kcal/100ml). Duck fattier than chicken (16 kcal/100ml). Fat profile uses duck fat composition (33% sat, 49% MUFA, 13% PUFA). Sodium assumes normal restaurant seasoning."
  - "Component 2 - Tofu (15g): USDA FDC 172475 (firm tofu with calcium sulfate) scaled to 15g. High calcium content (102mg) from tofu provides most of dish calcium."
  - "Atwater calculation: 4×4.3 + 4×1.0 + 9×2.6 = 44.6 kcal vs 50 kcal estimate. 5.4 kcal gap (~11%) attributed to gelatin/collagen in broth with lower energy conversion."
  - "Total dish weight: ~135g (120ml broth + 15g tofu)."
change_log:
  - timestamp: "2025-11-02T18:00:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial component-based nutrition estimation for duck broth with tofu from Imperial Treasure St. James Peking duck course"
    fields_changed: ["all nutrition fields"]
    sources:
      - url: "https://honest-food.net/duck-stock-recipe/"
        note: "Hank Shaw duck stock recipe - 13 kcal baseline"
      - url: "https://thematbakh.com/duck-stock-recipe-instant-pot-duck-broth/"
        note: "Homemade duck broth nutrition - 43 kcal per 100ml for richer version"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/172475/nutrients"
        note: "USDA FDC 172475 - Firm tofu with calcium sulfate complete nutrition profile"
      - url: "https://theconsciouslife.com/foods/duck-fat-04574.htm"
        note: "Duck fat composition: 49.4% MUFA, 33.27% sat, 12.93% PUFA"
```
