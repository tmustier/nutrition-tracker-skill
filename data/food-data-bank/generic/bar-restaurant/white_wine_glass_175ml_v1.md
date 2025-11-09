## White Wine (Large Glass)

```yaml
id: white_wine_glass_175ml_v1
schema_version: 2
version: 1
last_verified: 2025-11-09
source:
  venue: Bar/Restaurant - Generic
  menu_page:
  evidence:
  - UK standard "large glass" serving (175ml)
  - USDA FoodData Central #174837 - White wine
  - Typical 12.5% ABV
aliases:
- White Wine
- Wine (White)
- Dry White Wine
category: drink
portion:
  description: 1 large glass (175ml / ~5.9 fl oz)
  est_weight_g: 175
  notes: "UK standard large glass serving of white wine"
assumptions:
  salt_scheme: normal
  oil_type:
  prep: Chilled white wine, dry style, 12.5% ABV
per_portion:
  energy_kcal: 128
  protein_g: 0.12
  fat_g: 0
  sat_fat_g: 0
  mufa_g: 0
  pufa_g: 0
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 1.05
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 7
  potassium_mg: 126
  iodine_ug: 2
  magnesium_mg: 18
  calcium_mg: 16
  iron_mg: 0.63
  zinc_mg: 0.25
  vitamin_c_mg: 0
  manganese_mg: 0.2
  polyols_g: 0
  carbs_available_g: 1.05
  carbs_total_g: 1.05
  copper_mg: 0.02
  selenium_ug: 0.35
  chromium_ug: 0
  molybdenum_ug: 7
  phosphorus_mg: 32
  chloride_mg: 11
  sulfur_g: 0.0005
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.01
  vitamin_b2_mg: 0.03
  vitamin_b3_mg: 0.16
  vitamin_b5_mg: 0.08
  vitamin_b6_mg: 0.07
  vitamin_b7_ug: 1.4
  vitamin_b9_ug: 0
  vitamin_b12_ug: 0
  choline_mg: 9.1
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0
  omega6_la_g: 0
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  alcohol_g: 17.4
  alcohol_energy_kcal: 122
quality:
  confidence: high
  gaps:
notes:
- Standard UK large glass: 175ml at 12.5% ABV = ~17.4g alcohol
- Alcohol contributes ~122 kcal (7 kcal/g), carbs contribute ~6 kcal
- Total energy: 128 kcal per glass
- Very low sugar (1.05g) - dry white wine
- Based on USDA FoodData Central #174837 (white wine)
- Atwater check (available carb basis): 4×0.12 + 9×0.0 + 4×1.05 + 2×0.0 + 2.4×0.0 = 4.7 kcal (macro component only)
change_log:
- timestamp: 2025-11-09T00:00:00+00:00
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial entry for tracking white wine consumed on 2025-11-07
  fields_changed: [all fields]
  sources:
    - note: "USDA FoodData Central #174837 - Alcoholic beverage, wine, table, white"
      url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/174837/nutrients"
```
