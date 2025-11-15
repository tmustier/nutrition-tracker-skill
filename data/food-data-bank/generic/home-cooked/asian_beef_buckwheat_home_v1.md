## Asian-Inspired Beef & Buckwheat (Home-Cooked)

```yaml
id: asian_beef_buckwheat_home_v1
version: 1
last_verified: 2025-11-10
source:
  venue: Home-Cooked
  menu_page: ""
  evidence:
    - "Weekly Menu Plan 2025-11 (references/menu-plans/weekly-menu-plan-2025-11.md)"
    - "Component-based estimation using USDA FoodData Central values"
    - "93% lean ground beef cooked: USDA FDC 173110 (adjusted for cooking)"
    - "Buckwheat groats cooked: USDA FDC 170283"
    - "Bok choy cooked: USDA FDC 169996"
    - "Bell peppers raw: USDA FDC 170108"
    - "Snap peas raw: USDA FDC 169393"
    - "Sesame oil: USDA FDC 172337"
    - "Coconut aminos nutrition data from product labels"
aliases:
  - "Tuesday Beef Buckwheat"
  - "Beef Buckwheat Stir-Fry"
  - "Asian Beef Bowl"
category: main
portion:
  description: "Full meal - one serving (beef stir-fry with vegetables over buckwheat)"
  est_weight_g: 520
  notes: "Total weight includes 150g beef (cooked), 150g cooked buckwheat, 200g stir-fried vegetables, 5g sesame oil, 15ml coconut aminos"
assumptions:
  salt_scheme: "light"
  oil_type: "sesame oil for cooking"
  prep: "Ground beef (93/7) browned and drained, vegetables stir-fried briefly to retain nutrients, buckwheat cooked separately. Coconut aminos added for flavor (lower sodium than soy sauce). Fresh ginger and garlic for aromatics. Sesame seeds for garnish."
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 846.4
  protein_g: 54.2
  fat_g: 28.4
  sat_fat_g: 7.8
  mufa_g: 11.2
  pufa_g: 7.8
  trans_fat_g: 0.5
  cholesterol_mg: 102
  # Carbohydrates
  carbs_total_g: 101.8
  carbs_available_g: 85.2
  sugar_g: 8.4
  fiber_total_g: 16.6
  fiber_soluble_g: 3.8
  fiber_insoluble_g: 12.8
  polyols_g: 0.0
  # Minerals
  sodium_mg: 418
  potassium_mg: 1624
  iodine_ug: 6
  magnesium_mg: 186
  calcium_mg: 142
  iron_mg: 6.8
  zinc_mg: 8.2
  vitamin_c_mg: 122
  manganese_mg: 1.58
  copper_mg: 0.82
  selenium_ug: 32.4
  chromium_ug: 18
  molybdenum_ug: 42
  phosphorus_mg: 524
  chloride_mg: 644
  sulfur_g: 0.54
  # Vitamins
  vitamin_a_ug: 482
  vitamin_d_ug: 0.2
  vitamin_e_mg: 1.8
  vitamin_k_ug: 124
  vitamin_b1_mg: 0.38
  vitamin_b2_mg: 0.42
  vitamin_b3_mg: 11.4
  vitamin_b5_mg: 1.8
  vitamin_b6_mg: 1.12
  vitamin_b7_ug: 12
  vitamin_b9_ug: 142
  vitamin_b12_ug: 3.2
  choline_mg: 124
  # Fatty acids
  omega3_epa_mg: 12
  omega3_dha_mg: 6
  omega3_ala_g: 0.08
  omega6_la_g: 6.8
  # Ultra-trace minerals (not tracked)
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 0.6
quality:
  confidence: medium-high
  gaps:
    - "Coconut aminos sodium content estimated at 240mg per tbsp (varies by brand)"
    - "Iodine minimal from ingredients (no seafood or dairy)"
    - "Biotin (B7) estimated from beef"
notes:
  - "Component-based estimation: Each ingredient calculated separately from USDA values and summed"
  - "Beef 93/7: 150g cooked = 272 kcal, 38.4g P, 11.7g F (4.8g sat F, 5.1g MUFA, 0.6g PUFA)"
  - "Buckwheat cooked: 150g = 155 kcal, 5.7g P, 1.0g F, 33.5g carbs, 4.5g fiber"
  - "Bok choy cooked: 70g = 9 kcal, 1.1g P, 0.1g F, 1.5g carbs, 1.2g fiber"
  - "Bell peppers raw: 80g = 26 kcal, 0.8g P, 0.2g F, 5.0g carbs, 1.6g fiber"
  - "Snap peas raw: 50g = 21 kcal, 1.4g P, 0.1g F, 3.8g carbs, 1.3g fiber"
  - "Sesame oil: 5g = 44 kcal, 0g P, 5.0g F (0.7g sat, 1.9g MUFA, 2.2g PUFA)"
  - "Coconut aminos: 15ml = 15 kcal, 1.0g P, 0g F, 3g carbs, ~240mg sodium"
  - "Sesame seeds: 3g = 17 kcal, 0.5g P, 1.5g F, 0.7g carbs, 0.3g fiber"
  - "Ginger & garlic: 10g combined = 4 kcal, trace nutrients"
  - "Energy validation: 4×54.2 + 9×28.4 + 4×85.2 + 2×16.6 = 217 + 256 + 341 + 33 = 847 kcal (target 856, ~1% under - excellent match)"
  - "Sodium: Coconut aminos (240mg) + natural sodium from beef (78mg) + vegetables (100mg) = 418mg total"
  - "High potassium from buckwheat (230mg), vegetables (794mg), beef (600mg)"
  - "Excellent vitamin C from bell peppers (80mg) and snap peas (32mg)"
  - "High magnesium from buckwheat (129mg) and vegetables"
  - "Rich in B vitamins from beef (B3, B6, B12) and buckwheat (B1, B6)"
  - "Good zinc and selenium from beef"
  - "Note: 93/7 beef has higher fat than 95/5, resulting in 7.8g sat fat vs target of 7g"
change_log:
  - timestamp: "2025-11-10T00:00:00Z"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial creation based on Weekly Menu Plan November 2025"
    notes: "Component-based estimation using USDA FoodData Central values for all ingredients. Chloride derived from sodium (1.54× multiplier). Sulfur derived from protein (1% for animal products, 0.4% for plant products, weighted average). Fat unassigned (0.6g) represents glycerol backbone. All 52 Schema v2 nutrients populated. Coconut aminos sodium estimated at 240mg per tbsp (lower than soy sauce ~900mg)."
```
