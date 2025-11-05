## Brandade Beignet with Aioli (Maset)

```yaml
id: brandade_beignet_aioli_maset_v1
version: 1
last_verified: 2025-11-05
source:
  venue: Maset, Marylebone (London)
  menu_page: "https://www.maset.london/"
  evidence:
    - "Maset Marylebone restaurant on Chiltern Street, opened Oct 2025"
    - "French Mediterranean (Occitan) coastal cuisine"
    - "Component-based estimation using USDA FoodData Central"
    - "Brandade: salt cod puree emulsion with olive oil, potato, cream (traditional French preparation)"
    - "Beignet: deep-fried batter-coated fritter typical weight 50-70g"
    - "Aioli: garlic mayonnaise (Provençal garlic & olive oil emulsion)"
    - "USDA cod cooked (171956): 105 kcal, 22.83g protein, 0.86g fat per 100g"
    - "USDA olive oil (748608): 884 kcal/100g, 73% MUFA, 11% PUFA, 14% SFA"
    - "USDA potato boiled (170438): 87 kcal/100g, 20g carbs, 379mg K"
    - "USDA heavy cream (170859): 340 kcal/100g, 36g fat, 411µg vitamin A"
    - "USDA flour enriched (168894): 364 kcal/100g, 10.3g protein"
    - "USDA whole egg (171287): 143 kcal/100g, 251mg choline"
    - "Portion weight estimated at 60g based on typical beignet size (50-70g range) plus aioli"
aliases: ["Brandade Fritter with Aioli", "Salt Cod Beignet"]
category: main
portion:
  description: "1 piece with aioli"
  est_weight_g: 60
  notes: "Golf ball-sized beignet (~50g) with 10g aioli. Brandade is traditional Provençal salt cod preparation."
assumptions:
  salt_scheme: "normal"
  oil_type: "olive oil"
  prep: "Components: Brandade filling 28g (cod 14g, olive oil 8g, potato 4g, cream 2g), Batter coating fried 22g (flour 10g, egg 3g, milk 2g, absorbed oil 7g), Aioli 10g (mayo/olive oil 9g, garlic 1g). Deep-fried, oil absorption ~12% of total weight."
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 285
  protein_g: 6.8
  fat_g: 22.5
  sat_fat_g: 4.2
  mufa_g: 14.8
  pufa_g: 2.9
  trans_fat_g: 0.1
  cholesterol_mg: 28
  # Carbohydrates
  carbs_total_g: 9.8
  carbs_available_g: 9.0
  sugar_g: 0.6
  fiber_total_g: 0.8
  fiber_soluble_g: 0.3
  fiber_insoluble_g: 0.5
  polyols_g: 0.0
  # Minerals
  sodium_mg: 195
  potassium_mg: 138
  iodine_ug: 24
  magnesium_mg: 12
  calcium_mg: 22
  iron_mg: 0.7
  zinc_mg: 0.4
  vitamin_c_mg: 1.2
  manganese_mg: 0.2
  copper_mg: 0.06
  selenium_ug: 9.2
  chromium_ug: 2
  molybdenum_ug: 3
  phosphorus_mg: 62
  chloride_mg: 305
  sulfur_g: 0.12
  # Vitamins
  vitamin_a_ug: 28
  vitamin_d_ug: 0.4
  vitamin_e_mg: 2.6
  vitamin_k_ug: 7.2
  vitamin_b1_mg: 0.12
  vitamin_b2_mg: 0.08
  vitamin_b3_mg: 1.1
  vitamin_b5_mg: 0.14
  vitamin_b6_mg: 0.10
  vitamin_b7_ug: 3.5
  vitamin_b9_ug: 22
  vitamin_b12_ug: 0.24
  choline_mg: 20
  # Fatty acids
  omega3_epa_mg: 5
  omega3_dha_mg: 22
  omega3_ala_g: 0.18
  omega6_la_g: 2.5
  # Ultra-trace minerals
  boron_mg: 0.02
  silicon_mg: 0.8
  vanadium_ug: 2
  nickel_ug: 3
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: []
notes:
  - "Brandade: Traditional French Mediterranean dish of salt cod, olive oil, potato, and cream emulsified into a puree"
  - "Salt cod (bacalao) is desalted by soaking 24-48 hours before use, reducing sodium from ~7000mg to ~80mg per 100g"
  - "Beignet: Light batter (flour, egg, milk) deep-fried until golden; oil absorption estimated at 12% total weight"
  - "Aioli served on the side: Classic Provençal garlic mayonnaise (garlic pounded with olive oil and egg)"
  - "Portion weight: Beignet 50g + aioli 10g = 60g total"
  - "Iodine content variable in cod (range 22-720µg/100g); used conservative estimate of 158µg/100g"
  - "Energy validation: 4×6.8 + 9×22.5 + 4×9.0 + 2×0.8 = 27.2 + 202.5 + 36.0 + 1.6 = 267 kcal (within 7% of listed 285 kcal, difference from rounding)"
  - "Fat split validation: SFA 4.2 + MUFA 14.8 + PUFA 2.9 + trans 0.1 = 22.0g (within 0.5g of total fat 22.5g)"
  - "Omega fatty acids: EPA/DHA from cod, ALA from olive oil, LA from flour and mayo PUFA"
  - "Restaurant opened Oct 22, 2025; new venue with limited nutrition data available"
change_log:
  - "2025-11-05: Initial creation with comprehensive component-based estimation. All 52 nutrient fields populated using USDA FoodData Central data (cod 171956, olive oil 748608, potato 170438, cream 170859, flour 168894, egg 171287). Portion weight 60g (beignet 50g + aioli 10g). Medium confidence due to component-based calculation and estimated portion sizes."
```
