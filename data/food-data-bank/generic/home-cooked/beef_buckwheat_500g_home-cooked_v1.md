## Ground Beef & Buckwheat (Home)

```yaml
id: beef_buckwheat_500g_home-cooked_v1
schema_version: 2
version: 1
last_verified: 2025-11-09
source:
  venue: Home-Cooked
  menu_page: ""
  evidence:
    - "USDA FoodData Central FDC ID 171790: Beef, ground, 95% lean / 5% fat, raw"
    - "USDA FoodData Central FDC ID 170685: Buckwheat groats, roasted, dry"
    - "USDA FoodData Central for vegetables (carrots, onions, celery, tomato puree)"
    - "USDA FoodData Central FDC ID 171413: Olive oil"
    - "Oh Grate vegan parmesan product label (per 100g: 531kcal, 42.4g fat, 18.6g carbs, 20g protein)"
    - "Component-based estimation method per ESTIMATE.md"
aliases:
  - "Beef and Buckwheat"
  - "Ground Beef Buckwheat Bowl"
category: main
portion:
  description: "500g serving of home-cooked ground beef and buckwheat dish"
  est_weight_g: 500
  notes: "Ragu-style dish with 5% fat ground beef, buckwheat, soffrito vegetables, olive oil, and condiments"
assumptions:
  salt_scheme: "normal"
  oil_type: "olive oil"
  prep: "Ground beef (500g raw, 5% fat) pan-cooked with soffrito (carrots, onions, celery), olive oil, buckwheat groats (200g dry), tomato puree, Oh Grate vegan parmesan, mushroom XO sauce, and seasonings. Total dish yield ~1,435g; 500g portion = 34.8% of total."
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 701
  protein_g: 48.9
  fat_g: 29.2
  sat_fat_g: 6.8
  mufa_g: 16.9
  pufa_g: 3.6
  trans_fat_g: 0.4
  cholesterol_mg: 108
  # Carbohydrates
  carbs_total_g: 66.4
  carbs_available_g: 55.2
  sugar_g: 5.5
  fiber_total_g: 11.0
  fiber_soluble_g: 3.9
  fiber_insoluble_g: 7.1
  polyols_g: 0.0
  # Minerals
  sodium_mg: 525
  potassium_mg: 1191
  iodine_ug: 8
  magnesium_mg: 232
  calcium_mg: 78
  iron_mg: 7.0
  zinc_mg: 11.4
  vitamin_c_mg: 8.5
  manganese_mg: 1.44
  copper_mg: 0.83
  selenium_ug: 39
  chromium_ug: 1
  molybdenum_ug: 2
  phosphorus_mg: 657
  chloride_mg: 808
  sulfur_g: 0.42
  # Vitamins
  vitamin_a_ug: 451
  vitamin_d_ug: 0.2
  vitamin_e_mg: 3.7
  vitamin_k_ug: 25
  vitamin_b1_mg: 0.38
  vitamin_b2_mg: 1.01
  vitamin_b3_mg: 14.5
  vitamin_b5_mg: 2.4
  vitamin_b6_mg: 1.15
  vitamin_b7_ug: 11
  vitamin_b9_ug: 74
  vitamin_b12_ug: 4.7
  choline_mg: 173
  # Fatty acids
  omega3_epa_mg: 14
  omega3_dha_mg: 3
  omega3_ala_g: 0.37
  omega6_la_g: 3.2
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 1.5
quality:
  confidence: medium
  gaps:
    - "Fiber soluble/insoluble split estimated at typical 35/65 ratio"
    - "Sugar content estimated from vegetable components (USDA data)"
    - "Iodine estimated (low confidence for buckwheat and vegetables)"
notes:
  - "Component breakdown (total dish ~1,435g): 500g ground beef (5% fat, cooks to ~375g), 200g dry buckwheat (cooks to ~600g), soffrito vegetables ~400g raw (2 carrots, 1 onion, 2 celery ribs), 35g olive oil, condiments ~100g (tomato puree 30g, Oh Grate 25g, mushroom XO sauce 15g, seasonings 30g)"
  - "500g portion = 34.8% of total dish yield"
  - "Excellent protein source: 48.9g (29% DV) from beef, buckwheat, and cashews in Oh Grate"
  - "Outstanding zinc: 11.4mg (103% DV) from beef"
  - "High magnesium: 232mg (55% DV) from buckwheat"
  - "Good phosphorus: 657mg (53% DV) distributed across beef and buckwheat"
  - "Vitamin A: 451μg (50% DV) primarily from carrots"
  - "Heart-healthy fats: 58% MUFA from olive oil"
  - "Omega-6:Omega-3 ratio: 8.6:1 (good balance)"
  - "Energy breakdown: Protein 196 kcal (28%), Fat 263 kcal (37%), Carbs available 221 kcal (32%), Fiber 22 kcal (3%)"
  - "Atwater validation: 4×48.9 + 9×29.2 + 4×55.2 + 2×11.0 = 701 kcal ✓"
  - "Component-scaled energy: 709 kcal; Atwater: 701 kcal (1.1% variance, using Atwater per Energy Consistency Principle)"
  - "Fat unassigned (1.5g = 5.1%) represents glycerol backbone and phospholipids"
change_log:
  - timestamp: "2025-11-09T22:00:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Initial entry for ground beef and buckwheat dish consumed on 2025-11-09"
    fields_changed: ["all fields"]
    sources:
      - note: "USDA FoodData Central for beef (FDC 171790), buckwheat (FDC 170685), vegetables, and olive oil"
        url: "https://fdc.nal.usda.gov/"
      - note: "Oh Grate vegan parmesan product label nutrition"
      - note: "Component-based estimation with parallel agent ultrathinking per CLAUDE.md instructions"
```
