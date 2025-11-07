## Profiteroles, Chocolate, Chestnut Cream (Maset)

```yaml
id: profiteroles_chocolate_chestnut_cream_maset_v1
version: 1
schema_version: 2
last_verified: 2025-11-05
source:
  venue: Maset, Marylebone (London)
  menu_page: https://www.maset.london/
  evidence:
  - "Dessert observed at Maset, Marylebone, October 2025"
  - "Review description: 'small, purposeful punctuation marks' (The Infatuation)"
  - "Component estimation: choux pastry shells (55g) + chestnut cream filling (60g) + chocolate sauce (25g)"
  - "USDA FoodData Central: Cream puff shell (FDC 174986), Roasted chestnuts (FDC 170190), Dark chocolate"
  - "Portion estimate from French restaurant standards (3-4 profiteroles typical)"
aliases:
- "Profiteroles au Chocolat et Crème de Marron"
category: dessert
portion:
  description: "4 small profiteroles"
  est_weight_g: 140
  notes: "Small profiteroles with chestnut cream filling and chocolate sauce"
assumptions:
  salt_scheme: "light"
  oil_type: "butter"
  prep: "Choux pastry shells filled with sweetened chestnut cream (crème de marron), drizzled with dark chocolate ganache"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 419.6
  protein_g: 6.4
  fat_g: 18.9
  sat_fat_g: 10.8
  mufa_g: 4.9
  pufa_g: 0.7
  trans_fat_g: 0.05
  cholesterol_mg: 117
  # Carbohydrates
  carbs_total_g: 57.5
  carbs_available_g: 54.0
  sugar_g: 25.3
  fiber_total_g: 3.5
  fiber_soluble_g: 1.2
  fiber_insoluble_g: 2.3
  polyols_g: 0.0
  # Minerals
  sodium_mg: 210
  potassium_mg: 513
  iodine_ug: 8
  magnesium_mg: 38.7
  calcium_mg: 45
  iron_mg: 3.4
  zinc_mg: 1.17
  vitamin_c_mg: 15.6
  manganese_mg: 1.08
  copper_mg: 0.61
  selenium_ug: 7.2
  chromium_ug: 0.2
  molybdenum_ug: 2
  phosphorus_mg: 174
  chloride_mg: 323.0
  sulfur_g: 0.026
  # Vitamins
  vitamin_a_ug: 14
  vitamin_d_ug: 0.15
  vitamin_e_mg: 1.0
  vitamin_k_ug: 5.9
  vitamin_b1_mg: 0.28
  vitamin_b2_mg: 0.26
  vitamin_b3_mg: 2.11
  vitamin_b5_mg: 0.66
  vitamin_b6_mg: 0.33
  vitamin_b7_ug: 4
  vitamin_b9_ug: 51
  vitamin_b12_ug: 0.09
  choline_mg: 41
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.03
  omega6_la_g: 0.3
  # Ultra-trace minerals
  boron_mg: 0.15
  silicon_mg: 0.2
  vanadium_ug: 0.05
  nickel_ug: 0.1
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - "Exact chestnut cream recipe unknown (commercial crème de marron assumed)"
  - "Chocolate sauce composition estimated (70% dark chocolate ganache)"
  - "Portion size inferred from review descriptions and French restaurant standards"
notes:
- "Component breakdown (140g total): 55g choux pastry shells + 60g chestnut cream filling + 25g dark chocolate sauce"
- "Choux pastry made with eggs, butter, flour, milk per standard French recipe"
- "Chestnut cream: sweetened crème de marron (chestnut purée + sugar)"
- "Chocolate sauce: dark chocolate ganache (70% cocoa with cream)"
- "Sugar content (25.3g) primarily from sweetened chestnut cream (19.2g) and chocolate (5g)"
- "Vitamin C (15.6mg) predominantly from chestnuts, which uniquely contain vitamin C among nuts"
- "Manganese (1.08mg) and copper (0.61mg) from chestnuts and dark chocolate"
- "Iron (3.4mg) from dark chocolate and eggs in choux pastry"
- "B vitamins from eggs and flour in choux pastry, plus B6 and folate from chestnuts"
- "Atwater validation: 4×6.4 + 9×18.9 + 4×54.0 + 2×3.5 = 418.7 kcal (within 1 kcal)"
- "Contains: gluten (wheat flour), eggs, dairy (butter, cream)"
change_log:

  - timestamp: "2025-11-06T23:28:46+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
- timestamp: 2025-11-05T21:25:00+00:00
  updated_by: "LLM: Claude Code (Sonnet 4.5)"
  reason: "Initial creation with complete 52-nutrient estimation for Maset profiteroles"
  fields_changed:
  - all fields
  sources:
  - url: https://www.theinfatuation.com/london/reviews/maset
    note: "Review describing profiteroles as 'small, purposeful punctuation marks'"
  - url: https://fdc.nal.usda.gov/
    note: "USDA FoodData Central for choux pastry (FDC 174986), roasted chestnuts (FDC 170190), and dark chocolate micronutrients"
  - url: https://tools.myfooddata.com/
    note: "Comprehensive micronutrient profiles for all components"
  - url: component_estimation
    note: "Component-based calculation: 55g choux (332 kcal/100g) + 60g chestnut cream (245 kcal/100g) + 25g chocolate ganache (360 kcal/100g)"
```
