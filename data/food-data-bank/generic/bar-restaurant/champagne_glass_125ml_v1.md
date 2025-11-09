## Champagne (Standard Glass)

```yaml
id: champagne_glass_125ml_v1
schema_version: 2
version: 1
last_verified: 2025-11-09
source:
  venue: Bar/Restaurant - Generic
  menu_page:
  evidence:
  - Standard champagne serving in flute glass (125ml)
  - USDA FoodData Central for champagne/sparkling wine
  - Typical 12% ABV
aliases:
- Champagne
- Sparkling Wine
- Prosecco
category: drink
portion:
  description: 1 glass (125ml / ~4.2 fl oz)
  est_weight_g: 125
  notes: "Standard flute serving of champagne or sparkling wine"
assumptions:
  salt_scheme: normal
  oil_type:
  prep: Chilled sparkling wine, 12% ABV
per_portion:
  energy_kcal: 89
  protein_g: 0.25
  fat_g: 0
  sat_fat_g: 0
  mufa_g: 0
  pufa_g: 0
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 1.5
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 5
  potassium_mg: 95
  iodine_ug: 1
  magnesium_mg: 11
  calcium_mg: 10
  iron_mg: 0.5
  zinc_mg: 0.1
  vitamin_c_mg: 0
  manganese_mg: 0.1
  polyols_g: 0
  carbs_available_g: 1.5
  carbs_total_g: 1.5
  copper_mg: 0.03
  selenium_ug: 0.25
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 18
  chloride_mg: 8
  sulfur_g: 0.001
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.01
  vitamin_b2_mg: 0.04
  vitamin_b3_mg: 0.13
  vitamin_b5_mg: 0.05
  vitamin_b6_mg: 0.05
  vitamin_b7_ug: 0.5
  vitamin_b9_ug: 1.25
  vitamin_b12_ug: 0
  choline_mg: 6.5
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
  alcohol_g: 12
  alcohol_energy_kcal: 84
quality:
  confidence: medium-high
  gaps: Exact champagne variety varies; estimates based on typical 12% ABV
notes:
- Standard serving: 125ml at 12% ABV = ~12g alcohol
- Alcohol contributes ~84 kcal (7 kcal/g), carbs contribute ~5 kcal
- Total energy: 89 kcal per glass
- Very low sugar (1.5g) - brut champagne
- Minimal nutrients except for small amounts of potassium and B vitamins
- Based on USDA FoodData Central champagne/sparkling wine data
- Atwater check (available carb basis): 4×0.25 + 9×0.0 + 4×1.5 + 2×0.0 + 2.4×0.0 = 7 kcal (macro component only)
change_log:
- timestamp: 2025-11-09T00:00:00+00:00
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial entry for tracking champagne consumed on 2025-11-07
  fields_changed: [all fields]
  sources:
    - note: "USDA FoodData Central - Champagne/sparkling wine data"
      url: "https://fdc.nal.usda.gov/"
```
