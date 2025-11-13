## Profiteroles - 5 Pieces (Le Relais De Venise)

```yaml
id: profiteroles_5pc_lrdv_v1
version: 3
schema_version: 2
last_verified: "2025-11-13"

source:
  venue: Le Relais De Venise L'Entrecôte, London
  menu_page: "Dessert menu"
  evidence:
    - "ChatGPT 5 Pro analysis dated 2025-11-10"
    - "USDA FoodData Central nutrient data"
    - "Customer photos confirm ice-cream filled choux with chocolate sauce"

aliases:
  - "profiteroles"
  - "cream puffs"
  - "choux dessert"

category: dessert

portion:
  description: "5 small profiteroles: choux pastry shells filled with vanilla ice cream, topped with dark chocolate sauce"
  est_weight_g: 200
  notes: "Each profiterole: ~10g choux shell + ~20g vanilla ice cream + ~10g dark chocolate. Total per serving: 50g shells + 100g ice cream + 50g dark chocolate = 200g"

assumptions:
  salt_scheme: normal
  oil_type: "butter in choux pastry"
  prep: "Choux baked; ice cream commercial; fudge sauce heated"

per_portion:
  energy_kcal: 672
  protein_g: 11.6
  fat_g: 42.6
  sat_fat_g: 21.9
  mufa_g: 16.1
  pufa_g: 3.5
  trans_fat_g: 0.1
  cholesterol_mg: 120
  carbs_total_g: 61.5
  carbs_available_g: 54.7
  sugar_g: 34.1
  fiber_total_g: 6.8
  fiber_soluble_g: 2.4
  fiber_insoluble_g: 4.4
  polyols_g: 0.0
  sodium_mg: 299
  potassium_mg: 557
  calcium_mg: 165
  magnesium_mg: 114
  iron_mg: 6.0
  zinc_mg: 1.8
  manganese_mg: 0.98
  iodine_ug: 44
  copper_mg: 0.89
  selenium_ug: 8
  chromium_ug: 2
  molybdenum_ug: 3
  phosphorus_mg: 239
  chloride_mg: 548
  sulfur_g: 0.11
  vitamin_c_mg: 0.6
  vitamin_b1_mg: 0.11
  vitamin_b2_mg: 0.26
  vitamin_b3_mg: 0.92
  vitamin_b5_mg: 0.59
  vitamin_b6_mg: 0.09
  vitamin_b7_ug: 8
  vitamin_b9_ug: 44
  vitamin_b12_ug: 0.59
  choline_mg: 83
  vitamin_a_ug: 262
  vitamin_d_ug: 0.9
  vitamin_e_mg: 1.5
  vitamin_k_ug: 12
  omega3_epa_mg: 5
  omega3_dha_mg: 8
  omega3_ala_g: 0.07
  omega6_la_g: 3.5
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"

quality:
  confidence: medium
  gaps: []

notes:
  - "Atwater check (available carb basis): 4×11.6 + 9×42.6 + 4×54.7 + 2×6.8 = 46.4 + 383.4 + 218.8 + 13.6 = 662.2 kcal vs stated 672 kcal (1.5% variance - excellent accuracy)"
  - "Component breakdown: (1) 50g choux shells - USDA FDC 174986; (2) 100g vanilla ice cream - USDA FDC 167575; (3) 50g dark chocolate 70-85% - USDA FDC 170273"
  - "High sugar content (34.1g) - primarily from ice cream and dark chocolate"
  - "Very high saturated fat (21.9g, 110% of daily limit) from dark chocolate, dairy and butter"
  - "Good source of calcium (165mg, 16% DV) and magnesium (114mg, 27% DV) from ice cream and dark chocolate"
  - "Rich in vitamin A (262µg, 29% DV) from eggs and dairy"
  - "UK dairy products have higher iodine content (~100µg/100g ice cream) vs US (~20µg/100g)"
  - "Previous energy variance resolved by upgrading chocolate reference from syrup (FDC 174117) to dark chocolate (FDC 170273)"
  - "ChatGPT noted: User ate 4 out of 5 profiteroles = 80% of this portion = 538 kcal, 9.3g protein, 34.1g fat"

change_log:
  - timestamp: "2025-11-13T12:00:00+00:00"
    updated_by: "LLM: Claude Sonnet 4"
    reason: "Replaced chocolate syrup (USDA FDC 174117) with dark chocolate 70-85% (USDA FDC 170273) for more accurate chocolate component representation. Recalculated all nutrient values based on component-weighted analysis: 50g choux + 100g vanilla ice cream + 50g dark chocolate"
    fields_changed:
      - per_portion.energy_kcal
      - per_portion.protein_g
      - per_portion.fat_g
      - per_portion.sat_fat_g
      - per_portion.mufa_g
      - per_portion.pufa_g
      - per_portion.trans_fat_g
      - per_portion.cholesterol_mg
      - per_portion.carbs_total_g
      - per_portion.carbs_available_g
      - per_portion.sugar_g
      - per_portion.fiber_total_g
      - per_portion.sodium_mg
      - per_portion.potassium_mg
      - per_portion.calcium_mg
      - per_portion.magnesium_mg
      - per_portion.iron_mg
      - per_portion.zinc_mg
      - per_portion.manganese_mg
      - per_portion.iodine_ug
      - per_portion.copper_mg
      - per_portion.selenium_ug
      - per_portion.chromium_ug
      - per_portion.molybdenum_ug
      - per_portion.phosphorus_mg
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170273/nutrients"
        note: "USDA FDC 170273 - Dark chocolate 70-85% cacao solids (complete nutrient profile)"
  - timestamp: "2025-11-10T14:00:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Validation fix: Corrected carbs_total_g from 56.8 to 57.0 for mathematical consistency (carbs_available + fiber + polyols = 55.9 + 1.1 + 0.0)"
    fields_changed:
      - per_portion.carbs_total_g
    sources: []
  - timestamp: "2025-11-10T13:45:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial creation based on ChatGPT 5 Pro meal analysis and USDA nutrient data"
    fields_changed: []
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/174986/nutrients"
        note: "USDA FDC 174986 - Cream puff shell"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/167575/nutrients"
        note: "USDA FDC 167575 - Ice cream, vanilla"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170273/nutrients"
        note: "USDA FDC 170273 - Dark chocolate 70-85% cacao solids"
```
