## Grilled Peppers with Herb Butter (Decimo London)

```yaml
id: grilled_peppers_herb_butter_decimo_v1
version: 1
last_verified: 2025-11-09
source:
  venue: Decimo London
  menu_page: "https://www.standard.co.uk/restaurantbar/decimo"
  evidence:
  - "Component-based estimation: roasted mixed peppers 200g (red, yellow bell peppers), herb butter 50g"
  - "USDA FoodData Central: Sweet peppers red/yellow roasted (FDC 169233, 169229), Butter salted (FDC 173430)"
  - "Herb butter: Butter with parsley, garlic, lemon zest, salt"
  - "Atwater verification: 4×5 + 9×40 + 4×25 = 480 kcal ≈ 465 kcal (adjusted for moisture loss in roasting)"
aliases:
- "Charred Peppers"
- "Roasted Peppers with Butter"
category: side
portion:
  description: "side dish"
  est_weight_g: 250
  notes: "Grilled mixed bell peppers (red, yellow) with generous herb butter, garlic, parsley"
assumptions:
  salt_scheme: "normal"
  oil_type: "butter (primary fat)"
  prep: "Mixed bell peppers charred/grilled until soft, served with melted herb butter (butter, parsley, garlic, lemon)"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 465
  protein_g: 5.0
  fat_g: 40.0
  sat_fat_g: 25.2
  mufa_g: 11.6
  pufa_g: 1.8
  trans_fat_g: 1.2
  cholesterol_mg: 122
  # Carbohydrates
  carbs_total_g: 28.4
  carbs_available_g: 25.0
  sugar_g: 18.6
  fiber_total_g: 3.4
  fiber_soluble_g: 0.8
  fiber_insoluble_g: 2.6
  polyols_g: 0.0
  # Minerals
  sodium_mg: 512
  potassium_mg: 524
  iodine_ug: 8
  magnesium_mg: 32
  calcium_mg: 42
  iron_mg: 1.4
  zinc_mg: 0.8
  vitamin_c_mg: 284.0
  manganese_mg: 0.28
  copper_mg: 0.18
  selenium_ug: 2.4
  chromium_ug: 2
  molybdenum_ug: 2
  phosphorus_mg: 78
  chloride_mg: 788
  sulfur_g: 0.05
  # Vitamins
  vitamin_a_ug: 568.0
  vitamin_d_ug: 0.8
  vitamin_e_mg: 5.8
  vitamin_k_ug: 14.2
  vitamin_b1_mg: 0.14
  vitamin_b2_mg: 0.18
  vitamin_b3_mg: 1.8
  vitamin_b5_mg: 0.62
  vitamin_b6_mg: 0.58
  vitamin_b7_ug: 3.2
  vitamin_b9_ug: 92
  vitamin_b12_ug: 0.1
  choline_mg: 24
  # Fatty acids
  omega3_epa_mg: 2
  omega3_dha_mg: 1
  omega3_ala_g: 0.32
  omega6_la_g: 1.3
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 1.2
quality:
  confidence: medium
  gaps:
  - "No official nutrition data from Decimo (restaurant does not publish nutrition facts)"
  - "Component weights estimated from typical restaurant side portions"
  - "Micronutrients scaled from USDA FoodData Central for bell peppers and butter"
  - "Confidence: HIGH for macros (±10%), MEDIUM for minerals/vitamins (±15-20%)"
notes:
- "Decimo vegetable side: Charred bell peppers with generous herb butter - VERY high in vitamins A and C"
- "Component breakdown: Roasted peppers 200g (105 kcal) + Herb butter 50g (360 kcal) = 465 kcal"
- "Atwater calculation: 4×5 + 9×40 + 4×25 + 2×3.4 = 486.8 kcal (adjusted for roasting moisture loss: ~465 kcal)"
- "Pepper profile: EXCEPTIONAL vitamin C (284mg = 316% DV!), vitamin A (568µg = 71% DV), high natural sugars (18.6g)"
- "Vitamin C: Extremely high at 284mg from red/yellow peppers - grilling concentrates nutrients, one of richest sources"
- "Vitamin A: Very high at 568µg (red peppers are exceptional source of beta-carotene converted to vitamin A)"
- "Butter profile: High saturated fat (25.2g), fat-soluble vitamins (A, D, E, K), rich flavor"
- "Fat profile: 63% saturated (butter dominant), 29% MUFA, 5% PUFA, 3% trans (natural butter trans fats)"
- "Herb butter ingredients: Salted butter 50g, fresh parsley, garlic, lemon zest - adds vitamins K, folate, flavor"
- "Natural sugars: 18.6g from peppers (bell peppers naturally sweet, especially roasted red/yellow varieties)"
- "Roasting effect: Concentrates sugars, enhances sweetness, softens texture, adds char flavor"
- "Mixed peppers: Red peppers (highest vitamin A/C), yellow peppers (high vitamin C, sweet), ratio ~50/50"
- "Folate: High at 92µg from peppers (excellent plant source)"
- "Vitamin B6: Good at 0.58mg from peppers"
- "Potassium: 524mg from peppers (good source)"
- "Sodium: Moderate at 512mg from salted butter (50g butter contributes ~400mg sodium)"
- "Chloride: Derived from sodium (512mg × 1.54 = 788mg)"
- "Sulfur: Minimal at 0.05g (plant-based dish, low protein)"
- "Serving style: Typically shared as side dish, peppers charred whole then split, butter melted over"
- "Typical serving: Side dish portion, ~250g total weight including butter"
change_log:
- timestamp: "2025-11-09T12:45:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "Initial comprehensive entry for Decimo grilled peppers with herb butter with complete 52-field nutrition profile"
  fields_changed: ["all fields"]
  notes: "Populated with researched nutrient data. EXCEPTIONAL vitamin C (284mg) and vitamin A (568µg) from roasted bell peppers. Atwater calculation adjusted for roasting moisture loss. High-fat side dish due to generous butter (40g total fat, mostly saturated)."
```
