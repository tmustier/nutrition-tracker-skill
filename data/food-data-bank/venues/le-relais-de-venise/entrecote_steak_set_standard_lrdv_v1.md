## Entrecôte Steak Set - Standard Service (Le Relais De Venise)

```yaml
id: entrecote_steak_set_standard_lrdv_v1
version: 1
schema_version: 2
last_verified: "2025-11-10"

source:
  venue: Le Relais De Venise L'Entrecôte, London
  menu_page: "Fixed menu - single course format"
  evidence:
    - "ChatGPT 5 Pro analysis dated 2025-11-10"
    - "USDA FoodData Central nutrient data"

aliases:
  - "entrecote set"
  - "first plate"
  - "standard service"

category: main

portion:
  description: "Complete standard service: 175g grilled sirloin steak + green salad with walnuts & vinaigrette + 150g french fries (first serving) + ~30g butter-herb sauce (light pour)"
  est_weight_g: 450
  notes: "This is the standard 'first plate' service before the optional second round of fries. Steak is 8oz raw (~175g cooked). Sauce is the restaurant's secret butter-based sauce with herbs, anchovies, mustard, and walnuts."

assumptions:
  salt_scheme: normal
  oil_type: "vegetable oil for fries; olive oil in vinaigrette; butter base in sauce"
  prep: "steak grilled medium; fries deep-fried; salad tossed with mustard vinaigrette"

per_portion:
  energy_kcal: 1194
  protein_g: 67.7
  fat_g: 76.4
  sat_fat_g: 22.8
  mufa_g: 29.7
  pufa_g: 18.6
  trans_fat_g: 1.46
  cholesterol_mg: 228
  carbs_total_g: 67.5
  carbs_available_g: 59.0
  sugar_g: 2.0
  fiber_total_g: 8.5
  fiber_soluble_g: 1.9
  fiber_insoluble_g: 6.6
  polyols_g: 0.0
  sodium_mg: 649
  potassium_mg: 1701
  calcium_mg: 91
  magnesium_mg: 138
  iron_mg: 6.4
  zinc_mg: 6.7
  manganese_mg: 1.05
  iodine_ug: 45
  copper_mg: 0.99
  selenium_ug: 64
  chromium_ug: 39
  molybdenum_ug: 34
  phosphorus_mg: 763
  chloride_mg: 999
  sulfur_g: 0.70
  vitamin_c_mg: 13.7
  vitamin_b1_mg: 0.49
  vitamin_b2_mg: 0.43
  vitamin_b3_mg: 16.6
  vitamin_b5_mg: 2.1
  vitamin_b6_mg: 1.13
  vitamin_b7_ug: 9
  vitamin_b9_ug: 187
  vitamin_b12_ug: 2.7
  choline_mg: 243
  vitamin_a_ug: 486
  vitamin_d_ug: 1.2
  vitamin_e_mg: 4.8
  vitamin_k_ug: 201
  omega3_epa_mg: 23
  omega3_dha_mg: 30
  omega3_ala_g: 1.71
  omega6_la_g: 15.1
  boron_mg: 0.01
  silicon_mg: 0.02
  vanadium_ug: 0
  nickel_ug: 0

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"

quality:
  confidence: medium
  gaps: []

notes:
  - "Atwater check (available carb basis): 4×67.7 + 9×76.4 + 4×59.0 + 2×8.5 = 270.8 + 687.6 + 236.0 + 17.0 = 1211.4 kcal vs stated 1194 kcal (1.5% variance - acceptable)"
  - "Components: (1) 175g grilled lean sirloin - USDA FDC 168634; (2) Salad with 75g lettuce (FDC 169247) + 15g walnuts (FDC 170187) + 15ml vinaigrette; (3) 150g restaurant fries - USDA FDC 170698; (4) 30g secret sauce - butter-based with herbs/anchovies/mustard"
  - "Steak portion based on NYC Eater report: '8 ounces of steak' for the standard service"
  - "Sauce composition modeled on Paris Eater reconstruction: butter, tarragon, parsley, shallot, anchovy, capers, mustard, walnuts, stock, egg yolk"
  - "Fries are thin-cut pommes allumettes style, deep-fried in vegetable oil"
  - "Notable nutrients: High protein (67.7g), excellent omega-3 ALA from walnuts (1.71g), rich in vitamins A & K from salad, good B-vitamin profile from steak"
  - "This exceeds daily sat fat targets (<20g) at 22.8g but provides 40% of protein target in one meal"

change_log:
  - timestamp: "2025-11-10T13:30:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial creation based on ChatGPT 5 Pro meal analysis and USDA nutrient data from parallel research agents"
    fields_changed: []
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/168634/nutrients"
        note: "USDA FDC 168634 - Beef, top sirloin, cooked"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170698/nutrients"
        note: "USDA FDC 170698 - Fast foods, potato, french fried"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/169247/nutrients"
        note: "USDA FDC 169247 - Romaine lettuce"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170187/nutrients"
        note: "USDA FDC 170187 - Walnuts"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/171413/nutrients"
        note: "USDA FDC 171413 - Olive oil"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/173410/nutrients"
        note: "USDA FDC 173410 - Butter, salted"
```
