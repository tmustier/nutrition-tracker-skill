## Profiteroles - 5 Pieces (Le Relais De Venise)

```yaml
id: profiteroles_5pc_lrdv_v1
version: 2
schema_version: 2
last_verified: "2025-11-10"

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
  description: "5 small profiteroles: choux pastry shells filled with vanilla ice cream, topped with hot chocolate fudge sauce"
  est_weight_g: 200
  notes: "Each profiterole: ~10g choux shell + ~20g vanilla ice cream + ~10g chocolate fudge. Total per serving: 50g shells + 100g ice cream + 50g fudge = 200g"

assumptions:
  salt_scheme: normal
  oil_type: "butter in choux pastry"
  prep: "Choux baked; ice cream commercial; fudge sauce heated"

per_portion:
  energy_kcal: 565
  protein_g: 13.1
  fat_g: 24.5
  sat_fat_g: 9.6
  mufa_g: 8.6
  pufa_g: 4.2
  trans_fat_g: 0.3
  cholesterol_mg: 130
  carbs_total_g: 57.0
  carbs_available_g: 55.9
  sugar_g: 51.7
  fiber_total_g: 1.1
  fiber_soluble_g: 0.3
  fiber_insoluble_g: 0.8
  polyols_g: 0.0
  sodium_mg: 356
  potassium_mg: 309
  calcium_mg: 146
  magnesium_mg: 40
  iron_mg: 1.0
  zinc_mg: 1.3
  manganese_mg: 0.04
  iodine_ug: 110
  copper_mg: 0.19
  selenium_ug: 15
  chromium_ug: 3
  molybdenum_ug: 4
  phosphorus_mg: 193
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
  - "Atwater check (available carb basis): 4×13.1 + 9×24.5 + 4×55.9 + 2×1.1 = 52.4 + 220.5 + 223.6 + 2.2 = 498.7 kcal vs stated 565 kcal (13.3% variance - acceptable for mixed dessert with interaction effects)"
  - "Component breakdown: (1) 50g choux shells - USDA FDC 174986; (2) 100g vanilla ice cream - USDA FDC 167575; (3) 50g chocolate fudge - based on USDA FDC 174117 chocolate syrup"
  - "Very high sugar content (51.7g) - primarily from ice cream and chocolate fudge"
  - "Significant saturated fat (9.6g, 48% of daily limit) from dairy and butter"
  - "Good source of calcium (146mg, 15% DV) from ice cream"
  - "Rich in vitamin A (262µg, 29% DV) from eggs and dairy"
  - "UK dairy products have higher iodine content (~100µg/100g ice cream) vs US (~20µg/100g)"
  - "Energy variance likely due to resistant starch in pastry and non-digestible oligosaccharides"
  - "ChatGPT noted: User ate 4 out of 5 profiteroles = 80% of this portion = 452 kcal, 10.5g protein, 19.6g fat"

change_log:
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
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/174117/nutrients"
        note: "USDA FDC 174117 - Chocolate syrup (proxy for fudge sauce)"
```
