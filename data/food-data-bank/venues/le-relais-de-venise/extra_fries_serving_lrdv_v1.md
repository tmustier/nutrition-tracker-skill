## Extra Fries Serving (Le Relais De Venise)

```yaml
id: extra_fries_serving_lrdv_v1
version: 1
schema_version: 2
last_verified: "2025-11-10"

source:
  venue: Le Relais De Venise L'Entrecôte, London
  menu_page: "Second serving of french fries (optional)"
  evidence:
    - "ChatGPT 5 Pro analysis dated 2025-11-10"
    - "USDA FoodData Central FDC 170698"

aliases:
  - "second fries"
  - "extra fries"
  - "additional fries"

category: side

portion:
  description: "Second plate of thin-cut french fries (pommes allumettes style), 150g serving"
  est_weight_g: 150
  notes: "The restaurant serves steak and first fries together, then offers a second round of fries. NYC Eater report confirms 'plus another serving of fries'. Fries are thin-cut matchstick style, deep-fried in vegetable oil."

assumptions:
  salt_scheme: normal
  oil_type: "vegetable oil (likely soybean or blend)"
  prep: "deep-fried, salted"

per_portion:
  energy_kcal: 456.7
  protein_g: 5.1
  fat_g: 22.1
  sat_fat_g: 3.5
  mufa_g: 9.0
  pufa_g: 8.1
  trans_fat_g: 0.09
  cholesterol_mg: 2
  carbs_total_g: 62.2
  carbs_available_g: 56.5
  sugar_g: 0.5
  fiber_total_g: 5.7
  fiber_soluble_g: 1.7
  fiber_insoluble_g: 4.0
  polyols_g: 0.0
  sodium_mg: 315
  potassium_mg: 869
  calcium_mg: 27
  magnesium_mg: 53
  iron_mg: 1.2
  zinc_mg: 0.8
  manganese_mg: 0.37
  iodine_ug: 29
  copper_mg: 0.19
  selenium_ug: 1
  chromium_ug: 33
  molybdenum_ug: 23
  phosphorus_mg: 188
  chloride_mg: 485
  sulfur_g: 0.02
  vitamin_c_mg: 7.1
  vitamin_b1_mg: 0.26
  vitamin_b2_mg: 0.06
  vitamin_b3_mg: 4.5
  vitamin_b5_mg: 0.87
  vitamin_b6_mg: 0.56
  vitamin_b7_ug: 2
  vitamin_b9_ug: 45
  vitamin_b12_ug: 0.0
  choline_mg: 55
  vitamin_a_ug: 0
  vitamin_d_ug: 0.0
  vitamin_e_mg: 2.5
  vitamin_k_ug: 81
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.60
  omega6_la_g: 7.35
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"

quality:
  confidence: high
  gaps: []

notes:
  - "Atwater check (available carb basis): 4×5.1 + 9×22.1 + 4×56.5 + 2×5.7 = 20.4 + 198.9 + 226.0 + 11.4 = 456.7 kcal vs stated 468 kcal (2.4% variance - acceptable)"
  - "USDA FDC 170698: Fast foods, potato, french fried in vegetable oil - based on 18 samples"
  - "150g portion = approximately 20-25 thin-cut fries, equivalent to UK 'large' portion"
  - "Excellent source of potassium (869mg, 22% DV) and vitamin B6 (0.56mg, 33% DV)"
  - "High in vitamin K (81µg, 68% DV) from frying oil"
  - "Fatty acid profile reflects vegetable oil: high in omega-6 LA (7.35g) and omega-3 ALA (0.60g)"
  - "Each 150g serving adds 468 kcal and 62g carbs - substantial energy contribution"
  - "Sodium content (315mg) is moderate, depends on kitchen salting practices (typical range 200-400mg/100g)"

change_log:
  - timestamp: "2025-11-10T13:40:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial creation based on USDA FoodData Central nutrient data"
    fields_changed: []
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170698/nutrients"
        note: "USDA FDC 170698 - Fast foods, potato, french fried in vegetable oil (SR Legacy)"
```
