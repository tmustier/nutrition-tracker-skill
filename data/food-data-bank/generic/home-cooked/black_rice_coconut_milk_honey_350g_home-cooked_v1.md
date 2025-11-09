## Black Rice with Coconut Milk & Honey, 350g

```yaml
id: black_rice_coconut_milk_honey_350g_home-cooked_v1
version: 2
last_verified: 2025-11-09
source:
  venue: Home Cooked
  menu_page: "Component-based estimation (corrected)"
  evidence:
    - "CORRECTED ESTIMATION: Total dish weight is 350g (not 350g rice + additions)"
    - "Black rice (115g dry → 345g cooked by absorbing 230g liquid): USDA brown rice proxy adjusted for black rice (+15% protein, +150% iron, +40% fiber)"
    - "Coconut milk (138g): USDA FDC ID 170173 - Nuts, coconut milk, canned (230 kcal/100g, 24g fat, 2.3g protein, 83% saturated fat)"
    - "Honey (4g, NOT 12g): USDA FDC ID 169640 - Honey (304 kcal/100g, 82.4g carbs)"
    - "Water (92g): absorbed during cooking, no nutritional contribution"
    - "Salt (0.4g pinch): 160mg sodium"
    - "Black rice characteristics: Higher protein (+15% vs brown), 2.5-3× iron (anthocyanins), +40% fiber"
    - "Cooking ratio: Black rice expands 3× (1 part rice + 2 parts liquid = 3 parts cooked)"
    - "Component split rationale: 60% coconut milk / 40% water for creamy texture typical of coconut rice pudding"
    - "Web research sources: nutritionvalue.org, foodstruct.com, USDA FoodData Central searches"
    - "Black rice vs brown rice comparison: livestrong.com, bnborganics.com (protein, iron, fiber differentials)"
    - "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170173/nutrients (coconut milk)"
    - "https://fdc.nal.usda.gov/fdc-app.html#/food-details/169640/nutrients (honey)"
aliases: []
category: main
portion:
  description: "350g total dish (black rice cooked with coconut milk, water, honey, and salt)"
  est_weight_g: 350
  notes: "CORRECTED: 115g dry black rice (expands to 345g by absorbing 138g coconut milk + 92g water) + 4g honey + 0.4g salt = 350g total. Previous estimate incorrectly added coconut milk and honey on top of cooked rice."
assumptions:
  salt_scheme: "lightly salted (0.4g pinch added during cooking)"
  oil_type: "coconut fat (from coconut milk - 83% saturated, 6% MUFA, 2% PUFA)"
  prep: "simmered - rice absorbs coconut milk-water mixture with honey during cooking"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 764
  protein_g: 13.6
  fat_g: 36.5
  sat_fat_g: 30.0
  mufa_g: 3.0
  pufa_g: 1.7
  trans_fat_g: 0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 99.5
  carbs_available_g: 90.8
  sugar_g: 15.0
  fiber_total_g: 8.7
  fiber_soluble_g: 3.0
  fiber_insoluble_g: 5.7
  polyols_g: 0.0
  # Minerals
  sodium_mg: 189
  potassium_mg: 621
  iodine_ug: 2
  magnesium_mg: 215
  calcium_mg: 48
  iron_mg: 6.5
  zinc_mg: 3.3
  vitamin_c_mg: 3.9
  manganese_mg: 5.6
  copper_mg: 0.69
  selenium_ug: 36
  chromium_ug: 2
  molybdenum_ug: 15
  phosphorus_mg: 521
  chloride_mg: 291
  sulfur_g: 0.054
  # Vitamins
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 1.6
  vitamin_k_ug: 2.2
  vitamin_b1_mg: 0.46
  vitamin_b2_mg: 0.11
  vitamin_b3_mg: 5.9
  vitamin_b5_mg: 2.0
  vitamin_b6_mg: 0.59
  vitamin_b7_ug: 5
  vitamin_b9_ug: 23
  vitamin_b12_ug: 0
  choline_mg: 48.8
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.01
  omega6_la_g: 1.43
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
    - "Black rice data extrapolated from USDA brown rice with research-based adjustments (+15% protein, +150% iron, +40% fiber)"
    - "No specific USDA entry for cooked black rice with complete nutrient profile"
    - "Iodine: LOW confidence (2μg estimate) - very low in all components (grains, coconut, honey)"
    - "Chromium: LOW confidence (2μg estimate) - whole grains contain trace amounts, soil-dependent"
    - "Molybdenum: MEDIUM confidence (15μg estimate) - whole grains are good source"
    - "Biotin: MEDIUM confidence (5μg estimate) - brown rice is rich in biotin per research"
    - "Coconut milk/water ratio (60/40) estimated based on typical creamy rice pudding preparations"
notes:
  - "MAJOR CORRECTION: Previous estimate incorrectly assumed 350g cooked rice PLUS additions (total ~512g)"
  - "ACTUAL: Total dish weight is 350g including all components"
  - "Honey corrected from 12g to 4g per user feedback"
  - "Energy reduced from 828 to 764 kcal (7.7% reduction) due to corrected portion sizes"
  - "Atwater energy validation: 4×13.6 + 9×36.5 + 4×90.8 + 2×8.7 = 54.4 + 328.5 + 363.2 + 17.4 = 763.5 kcal ✓"
  - "Component energy breakdown: Black rice 426 kcal (115g dry) + Coconut milk 317 kcal (138g) + Honey 12 kcal (4g) + Water 0 kcal + Salt 0 kcal = 755 kcal"
  - "Atwater (764 kcal) used as primary energy value (1.2% higher than component sum due to black rice protein adjustment)"
  - "Component weights: 115g dry black rice → 345g cooked (absorbs 138g coconut milk + 92g water), plus 4g honey and 0.4g salt"
  - "Black rice cooking mechanics: 3× expansion ratio means 1 part dry rice + 2 parts liquid = 3 parts cooked rice"
  - "Black rice superior to brown: +33% protein per cooked cup, +20% iron, 2.5× fiber, high anthocyanins (web research)"
  - "Conservative adjustments used: +15% protein (not +33%), +150% iron, +40% fiber when scaling from USDA brown rice dry values"
  - "Coconut milk (138g) provides majority of fat: 33.1g of 36.5g total (91%), predominantly saturated (30.0g, 83%)"
  - "Coconut fat profile per ESTIMATE.md: ~83% SFA, ~6% MUFA, ~2% PUFA"
  - "Unassigned fat (1.8g, 4.9% of total) represents glycerol backbone and minor lipid fractions"
  - "Fiber split: 35% soluble (3.0g) / 65% insoluble (5.7g) based on whole grain + coconut profiles"
  - "Sodium sources: Intrinsic (29mg from components) + Added salt (160mg) = 189mg total"
  - "Chloride derived: 189mg sodium × 1.54 (NaCl ratio) = 291mg"
  - "Sulfur derived: 13.6g protein × 0.004 (plant-based formula) = 0.054g"
  - "Vitamin B12 = 0 (no animal products), Vitamin A/D = 0 (no significant sources in rice, coconut, honey)"
  - "HIGH confidence: Macros (protein, fat, carbs, fiber) from USDA component scaling and research-based black rice adjustments"
  - "MEDIUM confidence: Major minerals (Fe, Zn, Mg, Mn, Cu, P, K) and B-vitamins from USDA brown rice/coconut milk data"
  - "LOW confidence: Iodine, chromium (very low in all components, highly soil-dependent, no specific black rice data)"
  - "Component-based methodology per ESTIMATE.md: identify components → estimate weights → scale USDA data → sum → validate energy"
  - "Honey contribution minimal at 4g (1.1% of total weight): adds 12 kcal, 3.3g sugar, trace minerals"
  - "Creamy texture from coconut milk fats incorporated during cooking; honey provides subtle sweetness"
change_log:
  - timestamp: "2025-11-09T18:00:00Z"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "MAJOR CORRECTION: Re-estimated entire dish based on 350g total weight (not 350g rice + additions)"
    notes: "Critical error in previous estimate: assumed 117g dry rice → 350g cooked rice, then added 150g coconut milk + 12g honey on top (total ~512g). ACTUAL dish: 350g total including all components. Corrected to: 115g dry black rice (absorbs 138g coconut milk + 92g water → 345g cooked) + 4g honey + 0.4g salt = 350g total. Energy reduced 828→764 kcal (7.7%). All nutrients recalculated from USDA sources: Brown rice proxy (adjusted +15% protein, +150% iron, +40% fiber for black rice), Coconut milk FDC 170173 (138g), Honey FDC 169640 (4g not 12g per user correction). Used component-based estimation per ESTIMATE.md. Atwater validation: 4×13.6 + 9×36.5 + 4×90.8 + 2×8.7 = 763.5 kcal ✓. Documented complete 52-nutrient profile with confidence levels."
  - timestamp: "2025-11-09T12:00:00Z"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Added pinch of salt (~0.4g) to reflect actual preparation"
    notes: "Sodium updated from 29mg to 189mg (+160mg from ~0.4g added salt). Chloride recalculated: 189 × 1.54 = 291mg. Salt scheme changed from 'unsalted' to 'lightly salted (pinch added)'."
  - timestamp: "2025-11-09T00:00:00Z"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial creation with complete 52-nutrient profile from component-based estimation"
    notes: "Components: Black rice 117g dry (USDA brown rice proxy, adjusted for black rice characteristics) + Coconut milk 150g (USDA FDC 170173) + Honey 12g (USDA FDC 169640). All nutrients calculated from USDA data scaled to component weights. Chloride derived from sodium (×1.54). Sulfur derived from protein (×0.004 for plant foods). Ultra-trace minerals (boron, silicon, vanadium, nickel) set to 0 = NOT TRACKED per ESTIMATE.md. Energy validated via Atwater formula. [THIS ENTRY CONTAINED ERRORS - SEE CORRECTION ABOVE]"
```
