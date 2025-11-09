## Black Rice with Coconut Milk & Honey, 350g

```yaml
id: black_rice_coconut_milk_honey_350g_home-cooked_v1
version: 1
last_verified: 2025-11-09
source:
  venue: Home Cooked
  menu_page: "Component-based estimation"
  evidence:
    - "Black rice (117g dry → 350g cooked): USDA FoodData Central brown rice as proxy, adjusted for black rice characteristics (higher protein, iron, anthocyanins)"
    - "Coconut milk (150g): USDA FDC ID 170173 - Nuts, coconut milk, canned (230 kcal, 24g fat, 2.3g protein per 100g)"
    - "Honey (12g): USDA FDC ID 169640 - Honey (304 kcal, 82.3g carbs per 100g)"
    - "Cooking ratio research: Black rice expands 3× when cooked (1:3 ratio), absorbs coconut milk + water"
    - "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170173/nutrients"
    - "https://fdc.nal.usda.gov/fdc-app.html#/food-details/169640/nutrients"
    - "https://foodstruct.com/food/honey (honey complete nutrients)"
    - "Black rice cooking ratio sources: foodhow.com, mariaushakova.com"
aliases: []
category: main
portion:
  description: "350g cooked bowl (black rice cooked with coconut milk and honey)"
  est_weight_g: 350
  notes: "117g dry black rice + 150g coconut milk + 12g honey + 71g water. Rice absorbs liquid during cooking, incorporating coconut milk fats and honey sugars into final dish."
assumptions:
  salt_scheme: "unsalted"
  oil_type: "coconut fat (from coconut milk)"
  prep: "boiled/simmered - rice absorbs coconut milk-water mixture with honey"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 828
  protein_g: 13.5
  fat_g: 39.5
  sat_fat_g: 32.6
  mufa_g: 3.3
  pufa_g: 1.8
  trans_fat_g: 0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 109.0
  carbs_available_g: 100.4
  sugar_g: 14.8
  fiber_total_g: 8.6
  fiber_soluble_g: 3.0
  fiber_insoluble_g: 5.6
  polyols_g: 0.0
  # Minerals
  sodium_mg: 29
  potassium_mg: 715
  iodine_ug: 2
  magnesium_mg: 223
  calcium_mg: 52
  iron_mg: 7.9
  zinc_mg: 3.3
  vitamin_c_mg: 4.3
  manganese_mg: 5.7
  copper_mg: 0.74
  selenium_ug: 36
  chromium_ug: 2
  molybdenum_ug: 15
  phosphorus_mg: 541
  chloride_mg: 45
  sulfur_g: 0.054
  # Vitamins
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 1.6
  vitamin_k_ug: 2.3
  vitamin_b1_mg: 0.51
  vitamin_b2_mg: 0.12
  vitamin_b3_mg: 7.2
  vitamin_b5_mg: 2.0
  vitamin_b6_mg: 0.65
  vitamin_b7_ug: 5
  vitamin_b9_ug: 44
  vitamin_b12_ug: 0
  choline_mg: 47.8
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.02
  omega6_la_g: 1.55
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 1.8
quality:
  confidence: medium
  gaps:
    - "Black rice micronutrient data estimated from USDA brown rice as proxy (no specific USDA cooked black rice entry with complete nutrients)"
    - "Iodine estimated LOW confidence (2μg) - very low in grains, coconut, honey"
    - "Chromium estimated LOW confidence (2μg) - whole grains contain trace amounts"
    - "Molybdenum estimated MEDIUM confidence (15μg) - whole grains are good source"
    - "Biotin estimated MEDIUM confidence (5μg) - from rice and coconut milk"
    - "Exact coconut milk type unknown - assumed full-fat canned (USDA 170173)"
notes:
  - "Atwater energy validation: 4×13.5 + 9×39.5 + 4×100.4 + 2×8.6 = 54 + 355.5 + 401.6 + 17.2 = 828.3 kcal ✓"
  - "Component energy breakdown: Black rice 433 kcal + Coconut milk 345 kcal + Honey 37 kcal = 815 kcal"
  - "Cooking process: 117g dry black rice expands to ~350g cooked by absorbing 233g liquid (150g coconut milk + 71g water + 12g honey)"
  - "Black rice characteristics: Higher protein (8.5-9% vs 7-8% brown rice), 2-3× iron due to anthocyanins, rich in manganese and magnesium"
  - "Coconut milk fat profile: 83% saturated (lauric acid predominant), 6% MUFA, 2% PUFA per ESTIMATE.md guidelines"
  - "Unassigned fat (1.8g, 4.6% of total) represents glycerol backbone and minor lipid fractions not classified as SFA/MUFA/PUFA"
  - "Fiber split estimated at 35% soluble / 65% insoluble based on whole grain + coconut profiles"
  - "HIGH confidence: Macros (protein, fat, carbs, fiber) from component scaling"
  - "MEDIUM confidence: Major minerals (Fe, Zn, Mg, Mn, Cu, P, K) and B-vitamins from USDA component data"
  - "LOW confidence: Iodine, chromium (very low in all components, soil-dependent)"
  - "Chloride derived from sodium × 1.54 (NaCl ratio). Sulfur derived from protein × 0.004 (plant-based foods)"
  - "Vitamin B12 = 0 (no animal products), Vitamin A/D = 0 (no significant sources)"
  - "Black rice cooked with coconut milk creates creamy texture; honey adds subtle sweetness (~3.4% of total weight)"
  - "Component weight estimation rationale: Standard rice cooking absorbs 2-2.5× its weight in liquid; 117g rice + 233g liquid = 350g total"
change_log:
  - timestamp: "2025-11-09T00:00:00Z"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial creation with complete 52-nutrient profile from component-based estimation"
    notes: "Components: Black rice 117g dry (USDA brown rice proxy, adjusted for black rice characteristics) + Coconut milk 150g (USDA FDC 170173) + Honey 12g (USDA FDC 169640). All nutrients calculated from USDA data scaled to component weights. Chloride derived from sodium (×1.54). Sulfur derived from protein (×0.004 for plant foods). Ultra-trace minerals (boron, silicon, vanadium, nickel) set to 0 = NOT TRACKED per ESTIMATE.md. Energy validated via Atwater formula."
```
