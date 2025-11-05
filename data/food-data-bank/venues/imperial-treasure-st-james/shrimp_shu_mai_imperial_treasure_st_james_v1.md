## Shrimp Shu Mai (Imperial Treasure St. James)

```yaml
id: shrimp_shu_mai_imperial_treasure_st_james_v1
schema_version: 2
version: 2
last_verified: 2025-11-05
source:
  venue: Shrimp Shu Mai (Imperial Treasure St. James)
  menu_page: "https://deliveroo.co.uk/menu/london/st-james's/imperial-treasure-fine-chinese-cuisine"
  evidence:
  - Imperial Treasure Fine Chinese Cuisine, 9 Waterloo Place, St Jamess, London SW1Y 4BE
  - Component-based estimation: 10g shrimp + 3g pork + 5g wrapper + 2g shiitake + 1.5g water chestnuts + 1.5g seasonings
  - USDA raw shrimp data: 85 kcal, 20g protein, 0.5g fat, 119mg sodium per 100g
  - USDA ground pork (medium fat): 263 kcal, 17g protein, 20g fat per 100g
  - Commercial shu mai reference: 24-33 kcal per piece (Nissui 25 kcal, Ajinomoto 30 kcal per piece)
  - Restaurant shu mai sodium: typically 50-200mg per piece per research
  - Fine dining portion estimated at 23g per piece based on reviews describing well-filled dim sum
  - Tripadvisor reviews: https://www.tripadvisor.com/Restaurant_Review-g186338-d15237477-Reviews-Imperial_Treasure_Fine_Chinese_Cuisine-London_England.html
aliases:
- siew mai
- siu mai
category: main
portion:
  description: 1 piece
  est_weight_g: 23
  notes: Traditional Cantonese dim sum with shrimp and pork filling in wheat wrapper, steamed
assumptions:
  salt_scheme: normal
  oil_type: sesame oil in filling
  prep: Steamed, filling contains shrimp, pork, shiitake mushroom, water chestnuts, sesame oil, soy sauce, ginger, scallion
  iodine: "Estimated from shrimp content (~10g). Using shellfish range (prawns 25-45 μg/100g, typical 35 μg/100g). Confidence: MEDIUM. Shrimp provides primary iodine contribution"
per_portion:
  energy_kcal: 43
  protein_g: 3.1
  fat_g: 1.5
  sat_fat_g: 0.3
  mufa_g: 0.6
  pufa_g: 0.4
  trans_fat_g: 0
  cholesterol_mg: 15
  sugar_g: 0.2
  fiber_total_g: 0.3
  fiber_soluble_g: 0.1
  fiber_insoluble_g: 0.2
  sodium_mg: 140
  potassium_mg: 25
  iodine_ug: 9
  magnesium_mg: 6
  calcium_mg: 8
  iron_mg: 0.3
  zinc_mg: 0.1
  vitamin_c_mg: 0.2
  manganese_mg: 0.02
  polyols_g: 0
  carbs_available_g: 4.5
  carbs_total_g: 4.8
  copper_mg: 0.047
  selenium_ug: 6
  chromium_ug: 0.7
  molybdenum_ug: 1
  phosphorus_mg: 36
  chloride_mg: 46
  sulfur_mg: 28
  vitamin_a_ug: 0
  vitamin_d_ug: 0.15
  vitamin_e_mg: 0.11
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.044
  vitamin_b2_mg: 0.030
  vitamin_b3_mg: 0.73
  vitamin_b5_mg: 0.09
  vitamin_b6_mg: 0.031
  vitamin_b7_ug: 1.4
  vitamin_b9_ug: 5.6
  vitamin_b12_ug: 0.16
  choline_mg: 11
  omega3_epa_mg: 17
  omega3_dha_mg: 15
  omega3_ala_g: 0.001
  omega6_la_g: 0.052
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - No official menu nutrition data available
  - Portion weight estimated from reviews and fine dining standards
notes:
- Component breakdown: Primary filling is shrimp (10g) with pork (3g) for texture and fat, wrapped in wheat wrapper (5g). Includes shiitake mushroom (2g), water chestnuts (1.5g), and seasonings (1.5g including sesame oil and soy sauce).
- Calorie density: 1.87 kcal/g, which is higher than commercial frozen products (1.67 kcal/g) but appropriate for fine dining with premium ingredients and more protein.
- Atwater validation: 4×3.1 + 4×4.5 + 9×1.5 = 43.9 kcal ✓
- Fat split validation: 0.3 + 0.6 + 0.4 = 1.3g of 1.5g accounted (0.2g unassigned due to rounding)
- Sodium includes: 12mg intrinsic from shrimp, 2mg from pork, 18mg from wrapper, 34mg from soy sauce, ~74mg from additional seasoning salt
- Imperial Treasure is a Michelin-recognized Cantonese fine dining restaurant; their dim sum is noted for quality ingredients and generous filling
change_log:
- timestamp: 2025-11-02
  reason: Initial entry created using component-based estimation methodology
  fields_changed: [all fields]
  evidence: Comprehensive research including Imperial Treasure reviews, USDA component data, commercial product benchmarking, and traditional Cantonese recipes
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
- timestamp: '2025-11-05T14:50:00+00:00'
  updated_by: 'Agent 4: Claude Code (Sonnet 4.5)'
  reason: 'Comprehensive nutrient enrichment for 23g shu mai using component-based USDA data (10g shrimp, 3g pork, 5g wheat wrapper, 2g shiitake, 1.5g water chestnuts, 1.5g seasonings)'
  fields_changed: [copper_mg, selenium_ug, chromium_ug, molybdenum_ug, phosphorus_mg, chloride_mg, sulfur_mg, vitamin_d_ug, vitamin_e_mg, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b7_ug, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_epa_mg, omega3_dha_mg, omega3_ala_g, omega6_la_g, version, last_verified]
  sources:
  - note: 'USDA FoodData Central - Shrimp raw (FDC 175179): selenium 38µg/100g, phosphorus 224mg/100g, B12 1.4µg/100g, EPA 171mg/100g, DHA 144mg/100g, choline'
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/175179'
  - note: 'USDA FoodData Central - Pork ground medium fat: B vitamins, minerals, trace vitamin D'
    url: 'https://fdc.nal.usda.gov/'
  - note: 'USDA FoodData Central - Wheat flour wrapper: enriched B vitamins, selenium'
    url: 'https://fdc.nal.usda.gov/'
  - note: 'Component aggregation for 23g dumpling. Vitamin A and K remain 0 (no significant plant content). Ultra-trace elements remain 0 (insufficient data).'
    url: 'component_analysis'
```
