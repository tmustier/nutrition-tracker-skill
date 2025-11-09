## Mapo Tofu with Ground Meat (3 Helpings)

```yaml
id: mapo_tofu_ground_meat_300g_v1
schema_version: 2
version: 1
last_verified: 2025-11-09
source:
  venue: Home/Restaurant - Chinese (Sichuan)
  menu_page:
  evidence:
  - Traditional mapo tofu recipe with ground meat
  - USDA FoodData Central for component ingredients
  - Sichuan-style preparation with doubanjiang and Sichuan peppercorns
aliases:
- Mapo Tofu
- Ma Po Tofu
- Spicy Tofu with Ground Meat
category: food
portion:
  description: 3 helpings (~300g total)
  est_weight_g: 300
  notes: "Sichuan-style mapo tofu: soft tofu, ground pork/beef, doubanjiang, Sichuan peppercorns, oil"
assumptions:
  salt_scheme: high
  oil_type: vegetable
  prep: Wok-cooked with doubanjiang, garlic, ginger, Sichuan peppercorns, cooking oil
per_portion:
  energy_kcal: 543
  protein_g: 28.8
  fat_g: 44.1
  sat_fat_g: 11.5
  mufa_g: 19.8
  pufa_g: 10.8
  trans_fat_g: 0.3
  cholesterol_mg: 72
  sugar_g: 1.2
  fiber_total_g: 3.0
  fiber_soluble_g: 0.6
  fiber_insoluble_g: 2.4
  sodium_mg: 2356
  potassium_mg: 465
  iodine_ug: 8
  magnesium_mg: 123
  calcium_mg: 423
  iron_mg: 5.1
  zinc_mg: 3.9
  vitamin_c_mg: 2
  manganese_mg: 1.23
  polyols_g: 0
  carbs_available_g: 5.0
  carbs_total_g: 8.0
  copper_mg: 0.54
  selenium_ug: 27
  chromium_ug: 3
  molybdenum_ug: 45
  phosphorus_mg: 345
  chloride_mg: 3628
  sulfur_g: 0.115
  vitamin_a_ug: 12
  vitamin_d_ug: 0.3
  vitamin_e_mg: 4.2
  vitamin_k_ug: 15
  vitamin_b1_mg: 0.45
  vitamin_b2_mg: 0.21
  vitamin_b3_mg: 6.6
  vitamin_b5_mg: 0.81
  vitamin_b6_mg: 0.48
  vitamin_b7_ug: 9
  vitamin_b9_ug: 45
  vitamin_b12_ug: 1.8
  choline_mg: 135
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 1.2
  omega6_la_g: 9.3
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  alcohol_g: 0
  alcohol_energy_kcal: 0
quality:
  confidence: medium
  gaps: Exact recipe proportions estimated from typical Sichuan mapo tofu
notes:
- "Component breakdown (300g total): Soft tofu (180g), ground pork (60g), vegetable oil (36g), doubanjiang (15g), aromatics and peppercorns (9g)"
- Very high sodium (2,356mg = 102% DV) from doubanjiang and soy sauce
- Excellent protein source (28.8g) from tofu and ground meat
- High fat (44.1g) from cooking oil and ground pork
- Rich in calcium (423mg) and iron (5.1mg) from tofu
- High magnesium (123mg) and manganese (1.23mg) from tofu
- Spicy, numbing flavor from Sichuan peppercorns (málà)
- Energy breakdown: 543 kcal (fat 397 kcal, protein 115 kcal, carbs 20 kcal, fiber 6 kcal)
- Based on USDA FoodData Central component analysis
- Atwater check (available carb basis): 4×28.8 + 9×44.1 + 4×5.0 + 2×3.0 + 2.4×0.0 = 528 kcal ≈ 543 kcal
change_log:
- timestamp: 2025-11-09T00:00:00+00:00
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial entry for tracking mapo tofu with ground meat consumed on 2025-11-07
  fields_changed: [all fields]
  sources:
    - note: "USDA FoodData Central for tofu, ground pork, oils"
      url: "https://fdc.nal.usda.gov/"
    - note: "CalorieSlism mapo tofu baseline data"
    - note: "Traditional Sichuan recipe analysis with doubanjiang"
```
