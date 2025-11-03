## Snow Mountain Bun (Imperial Treasure St. James)

```yaml
id: snow_mountain_bun_imperial_treasure_st_james_v1
version: 1
last_verified: 2025-11-02
source:
  venue: Snow Mountain Bun (Imperial Treasure St. James)
  menu_page: ""
  evidence:
    - "Imperial Treasure UK Facebook: Baked Snow Mountain Bun with Ibérico Char Siu Pork"
    - "Snow mountain bun recipes: hangrywifey.wixsite.com, namethedish.com"
    - "Char siu nutrition data from multiple sources (280-440 kcal/100g range)"
    - "Sweet bread nutrition: 290-367 kcal/100g (various sources)"
    - "Component-based estimation: 47g dough + 24g filling + 7g topping = 78g total"
aliases:
  - "Baked BBQ Pork Bun"
  - "Snow Cap Bun"
  - "Crispy Char Siu Bao"
category: dessert
portion:
  description: "1 piece"
  est_weight_g: 78
  notes: "Estimated from typical dim sum baked char siu bao (60-80g range), fine dining portion"
assumptions:
  salt_scheme: "normal"
  oil_type: "butter"
  prep: "baked with snow mountain topping (butter-flour-sugar crust)"
  iodine_estimation: "Estimated from dairy components: dough contains ~15g milk (47g × 32% = 6 μg @ 40 μg/100g), topping contains ~3.5g butter (0.4 μg @ 10 μg/100g), filling contains 24g pork (1.2 μg @ 5 μg/100g). Total: 7.6 μg rounded to 8 μg. Confidence: MEDIUM (dairy-based estimate)."
per_portion:
  energy_kcal: 250
  protein_g: 9.3
  fat_g: 10.0
  sat_fat_g: 4.4
  mufa_g: 3.9
  pufa_g: 1.1
  trans_fat_g: 0.1
  cholesterol_mg: 25
  carbs_available_g: 30.8
  sugar_g: 8.2
  fiber_total_g: 0.9
  fiber_soluble_g: 0.3
  fiber_insoluble_g: 0.6
  sodium_mg: 318
  potassium_mg: 90
  iodine_ug: 8
  magnesium_mg: 12
  calcium_mg: 45
  iron_mg: 1.2
  zinc_mg: 0.6
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0.0
  carbs_total_g: 31.7

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "iodine"
    - "manganese"
    - "fiber split"
notes:
  - "Component breakdown: Enriched dough 47g (~300 kcal/100g), Ibérico char siu filling 24g (~280 kcal/100g), snow mountain topping 7g (~580 kcal/100g)"
  - "Dough: sweet bread base with flour, milk, sugar, butter, yeast (141 kcal, 4.2g P, 2.8g F, 25.4g C)"
  - "Filling: premium BBQ pork with sweet sauce (67 kcal, 4.8g P, 4.3g F, 3.4g C)"
  - "Topping: butter-flour-sugar crust creates snow-like appearance (41 kcal, 0.3g P, 3.2g F, 2.7g C)"
  - "Atwater validation: 4×9.3 + 4×30.8 + 9×10.0 = 250.4 kcal (within 0.2% of stated)"
  - "Fat breakdown validated: 4.4 + 3.9 + 1.1 + 0.1 = 9.5g of 10.0g total (0.5g unassigned)"
  - "User consumed 1 piece from portion of 3 at Imperial Treasure St. James"
change_log:
  - timestamp: "2025-11-02"
    reason: "Initial entry for Snow Mountain Bun using component-based estimation"
    fields_changed:
      - "all fields"
    evidence: "Research from Imperial Treasure UK social media, recipe sites, and nutrition databases"
```
