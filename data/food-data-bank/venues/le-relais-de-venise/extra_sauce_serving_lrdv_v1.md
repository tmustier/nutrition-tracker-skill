## Extra Sauce Serving (Le Relais De Venise)

```yaml
id: extra_sauce_serving_lrdv_v1
version: 1
schema_version: 2
last_verified: "2025-11-10"

source:
  venue: Le Relais De Venise L'Entrecôte, London
  menu_page: "Optional extra serving of secret sauce"
  evidence:
    - "ChatGPT 5 Pro analysis dated 2025-11-10"
    - "USDA FoodData Central nutrient data"

aliases:
  - "extra sauce"
  - "additional sauce"
  - "heavy sauce"

category: side

portion:
  description: "Additional 30g serving of the restaurant's secret butter-herb sauce"
  est_weight_g: 30
  notes: "The secret sauce is butter-based with tarragon, parsley, shallot, anchovy/capers, mustard, walnuts, stock, and egg yolk. Going from 'light pour' (~30g) to 'heavy pour' (~60g) means two servings. Each additional 30g adds significant saturated fat and calories."

assumptions:
  salt_scheme: normal
  oil_type: "butter base"
  prep: "Sauce prepared fresh, served warm"

per_portion:
  energy_kcal: 166
  protein_g: 1.5
  fat_g: 17.9
  sat_fat_g: 10.7
  mufa_g: 4.7
  pufa_g: 1.3
  trans_fat_g: 0.66
  cholesterol_mg: 77
  carbs_total_g: 0.7
  carbs_available_g: 0.5
  sugar_g: 0.2
  fiber_total_g: 0.2
  fiber_soluble_g: 0.05
  fiber_insoluble_g: 0.15
  polyols_g: 0.0
  sodium_mg: 205
  potassium_mg: 41
  calcium_mg: 18
  magnesium_mg: 6
  iron_mg: 0.34
  zinc_mg: 0.20
  manganese_mg: 0.04
  iodine_ug: 2
  copper_mg: 0.03
  selenium_ug: 3
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 27
  chloride_mg: 312
  sulfur_g: 0.024
  vitamin_c_mg: 2.8
  vitamin_b1_mg: 0.013
  vitamin_b2_mg: 0.032
  vitamin_b3_mg: 0.45
  vitamin_b5_mg: 0.15
  vitamin_b6_mg: 0.029
  vitamin_b7_ug: 2
  vitamin_b9_ug: 10
  vitamin_b12_ug: 0.10
  choline_mg: 31
  vitamin_a_ug: 159
  vitamin_d_ug: 0.4
  vitamin_e_mg: 0.62
  vitamin_k_ug: 34
  omega3_epa_mg: 15
  omega3_dha_mg: 27
  omega3_ala_g: 0.16
  omega6_la_g: 0.94
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
  - "Atwater check (available carb basis): 4×1.5 + 9×17.9 + 4×0.5 + 2×0.2 = 6.0 + 161.1 + 2.0 + 0.4 = 169.5 kcal vs stated 166 kcal (2.1% variance - acceptable)"
  - "Sauce composition modeled on Paris Eater reconstruction: ~67% butter (20g), 10% egg yolk (3g), 7% anchovies (2g), 7% shallots (2g), 7% herbs (2g), 3% walnuts (1g)"
  - "Each 30g serving adds ~11g saturated fat - more than half the daily recommended limit"
  - "Contains marine omega-3s (EPA 15mg, DHA 27mg) from anchovies"
  - "Rich in vitamin A (159µg, 18% DV) from butter and vitamin K (34µg, 28% DV) from fresh herbs"
  - "High sodium content (205mg) from butter and anchovies"

change_log:
  - timestamp: "2025-11-10T13:35:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial creation based on ChatGPT 5 Pro meal analysis and USDA nutrient data"
    fields_changed: []
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/173410/nutrients"
        note: "USDA FDC 173410 - Butter, salted (primary component)"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/172184/nutrients"
        note: "USDA FDC 172184 - Egg yolk, raw"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/174183/nutrients"
        note: "USDA FDC 174183 - Anchovies, canned in oil"
```
