## Fried Rice (Restaurant-Style Bowl)

```yaml
id: fried_rice_bowl_300g_v1
schema_version: 2
version: 1
last_verified: 2025-11-09
source:
  venue: Home/Restaurant - Chinese
  menu_page:
  evidence:
  - Typical restaurant fried rice bowl serving
  - USDA FoodData Central for component ingredients
  - Recipe analysis: rice, egg, vegetables, soy sauce, oil
aliases:
- Fried Rice
- Chinese Fried Rice
- Egg Fried Rice
category: food
portion:
  description: 1 bowl (~300g cooked)
  est_weight_g: 300
  notes: "Restaurant-style fried rice with egg, mixed vegetables, soy sauce"
assumptions:
  salt_scheme: high
  oil_type: vegetable
  prep: Wok-fried with oil, includes cooked rice, scrambled egg, vegetables, soy sauce
per_portion:
  energy_kcal: 507
  protein_g: 10.8
  fat_g: 23.1
  sat_fat_g: 3.5
  mufa_g: 9.5
  pufa_g: 8.8
  trans_fat_g: 0.1
  cholesterol_mg: 124
  sugar_g: 2.1
  fiber_total_g: 1.8
  fiber_soluble_g: 0.3
  fiber_insoluble_g: 1.5
  sodium_mg: 1170
  potassium_mg: 165
  iodine_ug: 12
  magnesium_mg: 30
  calcium_mg: 36
  iron_mg: 1.8
  zinc_mg: 1.2
  vitamin_c_mg: 3
  manganese_mg: 0.72
  polyols_g: 0
  carbs_available_g: 60.9
  carbs_total_g: 62.7
  copper_mg: 0.18
  selenium_ug: 19.5
  chromium_ug: 2
  molybdenum_ug: 15
  phosphorus_mg: 147
  chloride_mg: 1802
  sulfur_g: 0.043
  vitamin_a_ug: 62
  vitamin_d_ug: 0.9
  vitamin_e_mg: 3.3
  vitamin_k_ug: 12
  vitamin_b1_mg: 0.21
  vitamin_b2_mg: 0.24
  vitamin_b3_mg: 2.4
  vitamin_b5_mg: 0.84
  vitamin_b6_mg: 0.21
  vitamin_b7_ug: 12
  vitamin_b9_ug: 54
  vitamin_b12_ug: 0.48
  choline_mg: 102
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.9
  omega6_la_g: 7.8
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
  gaps: Exact recipe and oil amount estimated from typical preparations
notes:
- "Component breakdown (300g total): White rice cooked (210g), egg scrambled (30g raw = ~50g cooked), mixed vegetables (30g), vegetable oil (24g), soy sauce (6g)"
- High sodium content (1,170mg = 51% DV) from soy sauce
- Moderate protein (10.8g) primarily from egg and rice
- High fat (23.1g) from cooking oil and egg
- Energy breakdown: 507 kcal (carbs 244 kcal, fat 208 kcal, protein 43 kcal, fiber 4 kcal)
- Vitamin E and omega-6 LA primarily from vegetable oil
- Choline (102mg) from egg
- Based on USDA FoodData Central component analysis
- Atwater check (available carb basis): 4×10.8 + 9×23.1 + 4×60.9 + 2×1.8 + 2.4×0.0 = 495 kcal ≈ 507 kcal
change_log:
- timestamp: 2025-11-09T00:00:00+00:00
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial entry for tracking restaurant-style fried rice consumed on 2025-11-07
  fields_changed: [all fields]
  sources:
    - note: "USDA FoodData Central for rice, egg, vegetables, soy sauce"
      url: "https://fdc.nal.usda.gov/"
    - note: "Recipe analysis based on typical restaurant fried rice composition"
```
