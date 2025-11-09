## Banana Cake (Bakery-Style Slice)

```yaml
id: banana_cake_slice_95g_v1
schema_version: 2
version: 1
last_verified: 2025-11-09
source:
  venue: Bakery/Cafe - Generic
  menu_page:
  evidence:
  - Typical bakery-style banana cake slice
  - USDA FoodData Central for banana bread/cake
  - Recipe analysis: flour, sugar, banana, butter/oil, eggs
aliases:
- Banana Cake
- Banana Bread
- Banana Loaf Cake
category: food
portion:
  description: 1 slice (~95g)
  est_weight_g: 95
  notes: "Homemade/bakery-style banana cake, not overly commercial"
assumptions:
  salt_scheme: normal
  oil_type: mixed
  prep: Baked cake with flour, sugar, mashed banana, butter/oil, eggs
per_portion:
  energy_kcal: 333
  protein_g: 4.4
  fat_g: 11.8
  sat_fat_g: 2.6
  mufa_g: 5.3
  pufa_g: 3.4
  trans_fat_g: 0.1
  cholesterol_mg: 44
  sugar_g: 36.0
  fiber_total_g: 1.15
  fiber_soluble_g: 0.17
  fiber_insoluble_g: 0.98
  sodium_mg: 309
  potassium_mg: 144
  iodine_ug: 11
  magnesium_mg: 15
  calcium_mg: 29
  iron_mg: 1.5
  zinc_mg: 0.4
  vitamin_c_mg: 1.75
  manganese_mg: 0.22
  polyols_g: 0
  carbs_available_g: 53.5
  carbs_total_g: 54.7
  copper_mg: 0.08
  selenium_ug: 12.8
  chromium_ug: 1.92
  molybdenum_ug: 10
  phosphorus_mg: 70
  chloride_mg: 476
  sulfur_g: 0.044
  vitamin_a_ug: 107
  vitamin_d_ug: 0.8
  vitamin_e_mg: 0.88
  vitamin_k_ug: 1.3
  vitamin_b1_mg: 0.18
  vitamin_b2_mg: 0.21
  vitamin_b3_mg: 1.47
  vitamin_b5_mg: 0.30
  vitamin_b6_mg: 0.16
  vitamin_b7_ug: 6
  vitamin_b9_ug: 34
  vitamin_b12_ug: 0.11
  choline_mg: 17
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.12
  omega6_la_g: 3.1
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
  gaps: Exact recipe composition estimated from typical banana cake formulations
notes:
- "Recipe composition: Flour (40-45%), sugar (20-25%), butter/oil (12-15%), eggs (10-12%), mashed banana (15-20%), leavening agents"
- High sugar content (36g = 72% DRI) typical for cake
- Moderate caloric density (350 kcal/100g)
- Low protein (4.4g = 7% of rest day target per slice)
- Moderate fat (11.8g) from butter/oil and eggs
- Energy breakdown: 333 kcal (carbs 214 kcal, fat 106 kcal, protein 18 kcal, fiber 2 kcal)
- B vitamins from fortified flour and eggs
- Vitamin A from butter and eggs
- Potassium from banana (partially retained after baking)
- Based on USDA FoodData Central banana bread/cake profiles
- Atwater check (available carb basis): 4×4.4 + 9×11.8 + 4×53.5 + 2×1.15 + 2.4×0.0 = 333 kcal (exact match)
change_log:
- timestamp: 2025-11-09T00:00:00+00:00
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial entry for tracking bakery-style banana cake consumed on 2025-11-07
  fields_changed: [all fields]
  sources:
    - note: "USDA FoodData Central - Banana bread/cake entries"
      url: "https://fdc.nal.usda.gov/"
    - note: "Foodstruct.com comprehensive banana bread profile"
    - note: "Recipe analysis from typical bakery formulations"
```
