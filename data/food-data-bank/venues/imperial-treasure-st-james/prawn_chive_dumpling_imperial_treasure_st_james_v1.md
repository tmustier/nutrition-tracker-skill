## Prawn & Chive Dumpling (Imperial Treasure St. James)

```yaml
id: prawn_chive_dumpling_imperial_treasure_st_james_v1
schema_version: 2
version: 2
last_verified: 2025-11-05
source:
  venue: Prawn & Chive Dumpling (Imperial Treasure St. James)
  menu_page: "https://www.imperialtreasure.com/uk/"
  evidence:
  - Component-based estimation using Ping Pong prawn & chive dumpling as benchmark (43 kcal/piece, 25g)
  - Ping Pong data: https://shop.pingpongdimsum.com/products/prawn-and-chive-dumpling (257.5 kcal for 6 pieces)
  - Imperial Treasure review mentions juicy prawns wrapped in delicate, translucent skins: https://www.london-unattached.com/imperial-treasure-london-review/
  - Typical prawn/chive dumpling weight 20-25g per piece from commercial products (Royal Gourmet: 300g for 12 pieces = 25g/piece)
  - USDA data for raw shrimp (FDC 175179): ~85 kcal/100g, 20g protein, 1g fat
  - USDA data for chives (Allium tuberosum): ~21 kcal/100g, 1.6g protein, 3.8g carbs
  - Wheat starch wrapper: ~350 kcal/100g, 85% carbs based on starch composition
aliases:
category: main
portion:
  description: 1 piece
  est_weight_g: 26
  notes: Estimated 26g based on Ping Pong benchmark (25g) with slight upward adjustment for upscale venue
assumptions:
  salt_scheme: normal
  oil_type: vegetable oil and sesame oil blend (typical for Chinese dumplings)
  prep: steamed dumpling with translucent wheat starch wrapper, prawn and chive filling
per_portion:
  energy_kcal: 45
  protein_g: 2
  fat_g: 1.6
  sat_fat_g: 0.2
  mufa_g: 0.9
  pufa_g: 0.4
  trans_fat_g: 0
  cholesterol_mg: 30
  sugar_g: 0.2
  fiber_total_g: 0.1
  fiber_soluble_g: 0
  fiber_insoluble_g: 0.1
  sodium_mg: 310
  potassium_mg: 20
  iodine_ug: 2
  magnesium_mg: 5
  calcium_mg: 10
  iron_mg: 0.2
  zinc_mg: 0.2
  vitamin_c_mg: 1
  manganese_mg: 0.1
  polyols_g: 0
  carbs_available_g: 5.6
  carbs_total_g: 5.6
  copper_mg: 0.038
  selenium_ug: 5
  chromium_ug: 0.7
  molybdenum_ug: 1
  phosphorus_mg: 32
  chloride_mg: 477.0
  sulfur_g: 0.008
  vitamin_a_ug: 5
  vitamin_d_ug: 0.1
  vitamin_e_mg: 0.25
  vitamin_k_ug: 17
  vitamin_b1_mg: 0.029
  vitamin_b2_mg: 0.024
  vitamin_b3_mg: 0.61
  vitamin_b5_mg: 0.046
  vitamin_b6_mg: 0.019
  vitamin_b7_ug: 1.5
  vitamin_b9_ug: 8.2
  vitamin_b12_ug: 0.15
  choline_mg: 11
  omega3_epa_mg: 19
  omega3_dha_mg: 16
  omega3_ala_g: 0.004
  omega6_la_g: 0.412
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - No direct Imperial Treasure nutrition data available
  - Some micronutrients estimated from component averages
  estimated_nutrients:
  - name: fiber_soluble_g
    value: 0
    confidence: low
    method: Total fiber 0.1g from chives. Split using general_plant_foods ratio (30% soluble). 0.1g × 30% = 0.03g, rounds to 0.0g
  - name: fiber_insoluble_g
    value: 0.1
    confidence: low
    method: Total fiber 0.1g from chives. Split using general_plant_foods ratio (70% insoluble). 0.1g × 70% = 0.07g, rounds to 0.1g
notes:
- Component breakdown (26g total): Prawns 11g (9.4 kcal, 2.2g P, 0.1g F), wheat starch wrapper 6g (21 kcal, 5.1g C), Chinese chives 2g (0.4 kcal, 0.08g C), vegetable/sesame oil 1.3g (11.7 kcal, 1.3g F), soy sauce & seasonings 1.7g (1.4 kcal, 0.15g P, 180mg Na), finishing salt 0.13g (52mg Na)
- Atwater validation: 4×2.0 + 4×5.6 + 9×1.6 = 8.0 + 22.4 + 14.4 = 44.8 kcal (within 0.4% of stated 45 kcal)
- Fat split based on typical vegetable oil (70% MUFA, 25% PUFA) and sesame oil (40% MUFA/PUFA) blend plus trace shrimp fat
- Sodium: 110mg intrinsic (prawns), 180mg from soy sauce, 52mg finishing salt per 0.5% salt_scheme = 342mg, rounded to 310mg accounting for dilution during steaming
- Imperial Treasure is Michelin Guide listed, upscale Cantonese restaurant at 9 Waterloo Place, St Jamess, London
- Portion consumed: 1 piece out of a typical serving of 3 pieces per order
change_log:

  - timestamp: "2025-11-06T23:28:46+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
  - timestamp: 2025-11-02
    reason: Initial entry - component-based estimation for dim sum dish
    fields_changed: [all fields]
    evidence: Comprehensive research using Ping Pong London benchmark, USDA component data, recipe analysis, and upscale venue adjustment
  - date: 2025-11-05
    updated_by: automated_migration_v1_to_v2
    change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
    minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
    acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
    fields initialized to 0.'
  - timestamp: '2025-11-05T14:55:00+00:00'
    updated_by: 'Agent 4: Claude Code (Sonnet 4.5)'
    reason: 'Comprehensive nutrient enrichment for 26g dumpling using component-based USDA data (11g prawns, 6g wheat starch wrapper, 2g Chinese chives, 1.3g oil, 1.7g seasonings)'
    fields_changed: [copper_mg, selenium_ug, chromium_ug, molybdenum_ug, phosphorus_mg, chloride_mg, sulfur_mg, vitamin_a_ug, vitamin_d_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b7_ug, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_epa_mg, omega3_dha_mg, omega3_ala_g, omega6_la_g, version, last_verified]
    sources:
    - note: 'USDA FoodData Central - Shrimp/prawn raw (FDC 175179): selenium 38µg/100g, phosphorus 224mg/100g, B12, EPA 171mg/100g, DHA 144mg/100g'
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/175179'
  - note: 'USDA FoodData Central - Chinese chives (Allium tuberosum): vitamin A, K from greens'
    url: 'https://fdc.nal.usda.gov/'
  - note: 'USDA FoodData Central - Wheat starch wrapper: enriched B vitamins'
    url: 'https://fdc.nal.usda.gov/'
  - note: 'Component aggregation for 26g dumpling. Ultra-trace elements remain 0 (insufficient data). Notable: EPA/DHA present from prawns, vitamin K from chives.'
    url: 'component_analysis'
```
