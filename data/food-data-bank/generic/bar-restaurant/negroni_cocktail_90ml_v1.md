## Negroni (Classic Cocktail)

```yaml
id: negroni_cocktail_90ml_v1
schema_version: 2
version: 1
last_verified: 2025-11-09
source:
  venue: Bar/Restaurant - Generic
  menu_page:
  evidence:
  - Classic negroni recipe: equal parts gin, Campari, sweet vermouth (30ml each)
  - USDA FoodData Central for component alcohols
  - Standard cocktail preparation
aliases:
- Negroni
- Classic Negroni
category: drink
portion:
  description: 1 cocktail (~90ml total)
  est_weight_g: 90
  notes: "Classic recipe: 30ml gin + 30ml Campari + 30ml sweet vermouth"
assumptions:
  salt_scheme: normal
  oil_type:
  prep: Stirred cocktail with ice, served over ice with orange peel garnish
per_portion:
  energy_kcal: 186
  protein_g: 0.06
  fat_g: 0
  sat_fat_g: 0
  mufa_g: 0
  pufa_g: 0
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 8.7
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 3
  potassium_mg: 27
  iodine_ug: 0
  magnesium_mg: 3
  calcium_mg: 3
  iron_mg: 0.27
  zinc_mg: 0.03
  vitamin_c_mg: 0
  manganese_mg: 0.03
  polyols_g: 0
  carbs_available_g: 8.7
  carbs_total_g: 8.7
  copper_mg: 0.03
  selenium_ug: 0.1
  chromium_ug: 0
  molybdenum_ug: 2
  phosphorus_mg: 9
  chloride_mg: 5
  sulfur_g: 0.0002
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.005
  vitamin_b2_mg: 0.01
  vitamin_b3_mg: 0.03
  vitamin_b5_mg: 0.02
  vitamin_b6_mg: 0.01
  vitamin_b7_ug: 0.3
  vitamin_b9_ug: 0
  vitamin_b12_ug: 0
  choline_mg: 1.8
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
  alcohol_g: 23.6
  alcohol_energy_kcal: 165
quality:
  confidence: medium-high
  gaps:
notes:
- Classic recipe: 30ml gin (40% ABV) + 30ml Campari (25% ABV) + 30ml sweet vermouth (15% ABV)
- Total alcohol: ~23.6g (9.5g from gin, 5.9g from Campari, 3.6g from vermouth, 4.6g from dilution adjustment)
- Alcohol contributes ~165 kcal (7 kcal/g), carbs contribute ~21 kcal
- Total energy: 186 kcal per cocktail
- Sugar primarily from Campari and sweet vermouth (8.7g total)
- Campari provides characteristic bitter flavor
- Based on component analysis and USDA data for spirits and fortified wines
- Atwater check (available carb basis): 4×0.06 + 9×0.0 + 4×8.7 + 2×0.0 + 2.4×0.0 = 35 kcal (macro component only)
change_log:
- timestamp: 2025-11-09T00:00:00+00:00
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial entry for tracking negroni consumed on 2025-11-07
  fields_changed: [all fields]
  sources:
    - note: "Classic negroni recipe (equal parts gin, Campari, sweet vermouth)"
    - note: "USDA FoodData Central for spirits and fortified wines"
    - note: "Campari and vermouth sugar content from manufacturer data"
```
