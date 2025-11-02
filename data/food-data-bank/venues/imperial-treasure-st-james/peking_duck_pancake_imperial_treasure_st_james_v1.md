## Peking Duck Pancake (Imperial Treasure St. James)

```yaml
id: peking_duck_pancake_imperial_treasure_st_james_v1
version: 1
last_verified: 2025-11-02
source:
  venue: Peking Duck Pancake (Imperial Treasure St. James)
  menu_page: ""
  evidence:
    - "USDA roasted duck (meat and skin): 337 kcal, 18.99g protein, 28.35g fat (10g sat, 12.9g MUFA, 3.65g PUFA) per 100g - https://tools.myfooddata.com/nutrition-facts/172411/wt1"
    - "Hoisin sauce USDA: 35 kcal, 7g carbs, 4g sugar, 258mg sodium per 16g (1 tbsp) - https://www.nutritionvalue.org/Hoisin_sauce_41420250_nutritional_value.html"
    - "Mandarin pancake: 128 kcal, 19g carbs, 2g protein, 4g fat per pancake (~35g) - https://www.snapcalorie.com/nutrition/peking_duck_pancake_nutrition.html"
    - "USDA cucumber: 15 kcal, 3.63g carbs per 100g - https://www.recipal.com/ingredients/2998-nutrition-facts-calories-protein-carbs-fat-cucumber-with-peel-raw"
    - "USDA spring onion: 32 kcal, 7.4g carbs, 1.83g protein per 100g - https://www.nutritionvalue.org/Onions,_raw,_spring_or_scallions_(includes_tops_and_bulb)_nutritional_value.html"
    - "USDA sesame oil: 884 kcal, 100g fat (14g sat, 40g MUFA, 42g PUFA) per 100g - https://foodstruct.com/food/sesame-oil"
    - "Component-based estimation method per ESTIMATE.md guidelines"
aliases: []
category: main
portion:
  description: "1 assembled pancake"
  est_weight_g: 68
  notes: "Typical Peking duck pancake with duck meat, wrapper, hoisin sauce, cucumber, and spring onion"
assumptions:
  salt_scheme: "light"
  oil_type: "sesame oil"
  prep: "Component-based estimation: 35g roasted duck meat and skin, 15g mandarin pancake wrapper, 8g hoisin sauce, 5g cucumber, 3g spring onion, 2g sesame oil for cooking wrapper"
per_portion:
  energy_kcal: 210
  protein_g: 7.6
  fat_g: 13.6
  sat_fat_g: 4.2
  mufa_g: 6.0
  pufa_g: 2.6
  trans_fat_g: 0.0
  cholesterol_mg: null
  carbs_available_g: 12.0
  sugar_g: 2.0
  fiber_total_g: 0.1
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 179
  potassium_mg: null
  iodine_ug: null
  magnesium_mg: null
  calcium_mg: 2
  iron_mg: 0.9
  zinc_mg: 0.7
  vitamin_c_mg: 1
  manganese_mg: null
  polyols_g: 0.0
  carbs_total_g: 12.0

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps: ["cholesterol", "potassium", "iodine", "magnesium", "manganese", "fiber_soluble", "fiber_insoluble"]
notes:
  - "Rigorous component-based estimation following ESTIMATE.md methodology"
  - "All components based on USDA or reliable nutrition databases"
  - "Duck: 35g roasted meat with skin (337 kcal/100g, 28.35g fat, 18.99g protein)"
  - "Pancake wrapper: 15g mandarin pancake (scaled from 128 kcal per 35g pancake)"
  - "Hoisin sauce: 8g (half tablespoon, 35 kcal per 16g)"
  - "Vegetables: 5g cucumber + 3g spring onion"
  - "Sesame oil: 2g for cooking wrapper (40% MUFA, 42% PUFA)"
  - "Total weight: 68g per assembled pancake"
  - "Atwater validation: 4×7.6 + 4×12.0 + 9×13.6 = 200.8 kcal (4.4% discrepancy, within ±5% tolerance)"
  - "Salt scheme: light (primary sodium from hoisin sauce, 129mg + ~50mg from wrapper = 179mg total)"
change_log:
  - timestamp: "2025-11-02"
    reason: "Initial entry - component-based estimation for Peking duck pancake"
    fields_changed: ["all fields"]
    evidence: "Complete USDA-based analysis of all components with detailed fatty acid breakdown"
```
