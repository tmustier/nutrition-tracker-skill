## Sweet Muscat (Dessert Wine Glass)

```yaml
id: sweet_muscat_glass_90ml_v1
schema_version: 2
version: 1
last_verified: 2025-11-09
source:
  venue: Bar/Restaurant - Generic
  menu_page:
  evidence:
  - Dessert wine serving (90ml)
  - USDA FoodData Central for sweet dessert wine
  - Typical 15% ABV, high residual sugar
aliases:
- Sweet Muscat
- Muscat
- Dessert Wine
- Sweet Wine
category: drink
portion:
  description: 1 dessert wine glass (90ml / ~3 fl oz)
  est_weight_g: 90
  notes: "Small serving of sweet muscat dessert wine"
assumptions:
  salt_scheme: normal
  oil_type:
  prep: Chilled sweet muscat, 15% ABV, high residual sugar
per_portion:
  energy_kcal: 135
  protein_g: 0.18
  fat_g: 0
  sat_fat_g: 0
  mufa_g: 0
  pufa_g: 0
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 13.5
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 8
  potassium_mg: 108
  iodine_ug: 1
  magnesium_mg: 9
  calcium_mg: 7
  iron_mg: 0.36
  zinc_mg: 0.09
  vitamin_c_mg: 0
  manganese_mg: 0.1
  polyols_g: 0
  carbs_available_g: 13.5
  carbs_total_g: 13.5
  copper_mg: 0.05
  selenium_ug: 0.2
  chromium_ug: 0
  molybdenum_ug: 3
  phosphorus_mg: 11
  chloride_mg: 12
  sulfur_g: 0.001
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.01
  vitamin_b2_mg: 0.02
  vitamin_b3_mg: 0.09
  vitamin_b5_mg: 0.04
  vitamin_b6_mg: 0.04
  vitamin_b7_ug: 0.9
  vitamin_b9_ug: 0
  vitamin_b12_ug: 0
  choline_mg: 5.9
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
  alcohol_g: 10.7
  alcohol_energy_kcal: 75
quality:
  confidence: medium
  gaps: Exact muscat variety and sugar content varies
notes:
- Dessert wine serving: 90ml at 15% ABV = ~10.7g alcohol
- Alcohol contributes ~75 kcal (7 kcal/g), carbs contribute ~60 kcal
- Total energy: 135 kcal per glass
- High sugar content (13.5g = 15% by volume) typical for sweet muscat
- Smaller serving size (90ml vs 175ml) appropriate for dessert wine
- Based on USDA FoodData Central dessert wine data
- Atwater check (available carb basis): 4×0.18 + 9×0.0 + 4×13.5 + 2×0.0 + 2.4×0.0 = 54.7 kcal (macro component only)
change_log:
- timestamp: 2025-11-09T00:00:00+00:00
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial entry for tracking sweet muscat consumed on 2025-11-07
  fields_changed: [all fields]
  sources:
    - note: "USDA FoodData Central - Dessert wine data"
      url: "https://fdc.nal.usda.gov/"
```
