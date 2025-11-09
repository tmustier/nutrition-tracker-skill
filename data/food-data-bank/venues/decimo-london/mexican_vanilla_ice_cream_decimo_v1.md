## Mexican Vanilla Ice Cream (Decimo London)

```yaml
id: mexican_vanilla_ice_cream_decimo_v1
version: 1
last_verified: 2025-11-09
source:
  venue: Decimo London
  menu_page: "https://www.standard.co.uk/restaurantbar/decimo"
  evidence:
  - "Component-based estimation: premium ice cream base 105g (higher cream content, Mexican vanilla extract)"
  - "USDA FoodData Central: Ice cream vanilla premium (FDC 171284), Mexican vanilla (Vanilla planifolia)"
  - "Mexican vanilla: High-quality vanilla from Veracruz/Oaxaca regions, richer flavor than Madagascar vanilla"
  - "Atwater verification: 4×2.4 + 9×7.4 + 4×15.9 = 139.8 kcal ≈ 140 kcal"
aliases:
- "Vanilla Ice Cream"
- "Premium Vanilla Ice Cream"
category: dessert
portion:
  description: "dessert scoop"
  est_weight_g: 105
  notes: "Premium vanilla ice cream made with authentic Mexican vanilla extract, higher cream content"
assumptions:
  salt_scheme: "light"
  oil_type: "milk fat (heavy cream)"
  prep: "Premium ice cream base (heavy cream, milk, sugar, egg yolks) with Mexican vanilla extract, churned and frozen"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 140
  protein_g: 2.4
  fat_g: 7.4
  sat_fat_g: 4.6
  mufa_g: 2.0
  pufa_g: 0.3
  trans_fat_g: 0.2
  cholesterol_mg: 32
  # Carbohydrates
  carbs_total_g: 16.2
  carbs_available_g: 15.9
  sugar_g: 14.2
  fiber_total_g: 0.3
  fiber_soluble_g: 0.1
  fiber_insoluble_g: 0.2
  polyols_g: 0.0
  # Minerals
  sodium_mg: 54
  potassium_mg: 136
  iodine_ug: 14
  magnesium_mg: 11
  calcium_mg: 102
  iron_mg: 0.2
  zinc_mg: 0.4
  vitamin_c_mg: 0.5
  manganese_mg: 0.02
  copper_mg: 0.02
  selenium_ug: 2.1
  chromium_ug: 1
  molybdenum_ug: 1
  phosphorus_mg: 86
  chloride_mg: 83
  sulfur_g: 0.02
  # Vitamins
  vitamin_a_ug: 84.0
  vitamin_d_ug: 0.4
  vitamin_e_mg: 0.3
  vitamin_k_ug: 0.5
  vitamin_b1_mg: 0.03
  vitamin_b2_mg: 0.18
  vitamin_b3_mg: 0.1
  vitamin_b5_mg: 0.34
  vitamin_b6_mg: 0.04
  vitamin_b7_ug: 2.6
  vitamin_b9_ug: 4
  vitamin_b12_ug: 0.3
  choline_mg: 22
  # Fatty acids
  omega3_epa_mg: 1
  omega3_dha_mg: 1
  omega3_ala_g: 0.09
  omega6_la_g: 0.2
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 0.3
quality:
  confidence: medium
  gaps:
  - "No official nutrition data from Decimo (restaurant does not publish nutrition facts)"
  - "Component weights estimated from typical premium ice cream scoop"
  - "Micronutrients scaled from USDA FoodData Central for premium vanilla ice cream"
  - "Confidence: HIGH for macros (±10%), MEDIUM for minerals/vitamins (±20%)"
notes:
- "Decimo premium dessert: Classic vanilla ice cream with authentic Mexican vanilla - higher fat-soluble vitamins (A: 84µg, D: 0.4µg, E: 0.3mg)"
- "Component breakdown: Premium ice cream base 105g = 140 kcal"
- "Atwater calculation: 4×2.4 + 9×7.4 + 4×15.9 = 139.8 kcal (rounded to 140 kcal)"
- "Mexican vanilla: Vanilla planifolia from Veracruz/Oaxaca regions, considered finest vanilla, deeper/richer flavor than Madagascar"
- "Premium formulation: Higher cream content vs masa ice cream (7.4g vs 6.8g fat), richer mouthfeel, more fat-soluble vitamins"
- "Fat-soluble vitamins: Vitamin A (84µg vs 68µg), vitamin D (0.4µg vs 0.3µg), vitamin E (0.3mg vs 0.2mg) - all higher due to increased cream"
- "Vitamin A: 84µg (9% DV) from milk fat, higher than masa ice cream due to premium cream content"
- "Vitamin D: 0.4µg from dairy, naturally occurring in milk fat"
- "Ice cream base: Heavy cream, whole milk, sugar, egg yolks provide rich texture and nutrition"
- "Calcium: Good at 102mg (10% DV) from dairy"
- "Iodine: Good at 14µg (9% DV) from dairy, slightly higher than masa ice cream"
- "Potassium: 136mg from dairy"
- "Vitamin B2: Good at 0.18mg (14% DV) from dairy (riboflavin)"
- "Vitamin B5: Good at 0.34mg (7% DV) from dairy (pantothenic acid)"
- "Fat profile: 62% saturated (milk fat), 27% MUFA, 4% PUFA, 3% trans (natural dairy)"
- "Sugar: 14.2g primarily from added sugar, small amount from lactose"
- "Cholesterol: 32mg from dairy fat and egg yolks"
- "Vanilla extract: Pure Mexican vanilla (non-alcoholic extract retained in ice cream), provides signature flavor"
- "Flavor notes: Creamy, sweet, rich vanilla with floral/woody notes characteristic of Mexican vanilla beans"
- "Sodium: Low at 54mg (minimal salt)"
- "Chloride: Derived from sodium (54mg × 1.54 = 83mg)"
- "Sulfur: Minimal at 0.02g (low protein dessert)"
- "Comparison: Slightly higher fat (7.4g vs 6.8g) and energy (140 vs 134 kcal) than masa ice cream, no enrichment fortification"
- "Typical serving: Single scoop dessert, ~105g total weight"
change_log:
- timestamp: "2025-11-09T13:45:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "Initial comprehensive entry for Decimo Mexican vanilla ice cream with complete 52-field nutrition profile"
  fields_changed: ["all fields"]
  notes: "Populated with researched nutrient data. Premium vanilla ice cream with higher fat-soluble vitamins (A: 84µg, D: 0.4µg, E: 0.3mg) due to increased cream content. Made with authentic Mexican vanilla extract. Calcium (102mg) and iodine (14µg) from dairy. Atwater validation confirmed: 140 kcal."
```
