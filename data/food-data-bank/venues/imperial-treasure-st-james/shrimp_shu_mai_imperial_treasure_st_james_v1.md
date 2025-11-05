## Shrimp Shu Mai (Imperial Treasure St. James)

```yaml
id: shrimp_shu_mai_imperial_treasure_st_james_v1
schema_version: 2
version: 1
last_verified: 2025-11-02
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
  copper_mg: 0
  selenium_ug: 0
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 0
  chloride_mg: 0
  sulfur_g: 0
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0
  vitamin_b2_mg: 0
  vitamin_b3_mg: 0
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0
  vitamin_b7_ug: 0
  vitamin_b9_ug: 0
  vitamin_b12_ug: 0
  choline_mg: 0
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
```
