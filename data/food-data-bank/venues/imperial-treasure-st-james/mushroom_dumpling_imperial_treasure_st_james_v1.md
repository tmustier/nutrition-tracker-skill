## Mushroom Dumpling (Imperial Treasure St. James)

```yaml
id: mushroom_dumpling_imperial_treasure_st_james_v1
schema_version: 2
version: 1
last_verified: 2025-11-02
source:
  venue: Mushroom Dumpling (Imperial Treasure St. James)
  menu_page: 
  evidence:
  - url: https://deliveroo.co.uk/menu/london/st-jamess/imperial-treasure-fine-chinese-cuisine
    note: Imperial Treasure on Deliveroo - dim sum 3-piece portions
  - url: https://tools.myfooddata.com/nutrition-facts/168437/wt1
    note: 'USDA cooked shiitake: 56 kcal/100g, 1.56g protein, 14.39g carbs'
  - url: https://tools.myfooddata.com/nutrition-facts/171016/wt1
    note: 'USDA sesame oil: 884 kcal/100g, 14.2g SFA, 39.7g MUFA, 41.7g PUFA'
  - url: https://tools.myfooddata.com/nutrition-facts/168572/wt1
    note: 'USDA cooked napa cabbage: 12 kcal/100g'
  - url: https://fdc.nal.usda.gov/
    note: USDA FoodData Central - component nutrition database
aliases:
category: main
portion:
  description: 1 piece
  est_weight_g: 35
  notes: Vegetarian steamed dumpling with mushroom filling. Part of 3-piece portion.
assumptions:
  salt_scheme: light
  oil_type: sesame oil
  prep: steamed
per_portion:
  energy_kcal: 75
  protein_g: 1.5
  fat_g: 3.1
  sat_fat_g: 0.5
  mufa_g: 1.2
  pufa_g: 1.3
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 0.6
  fiber_total_g: 0.6
  fiber_soluble_g: 0.2
  fiber_insoluble_g: 0.4
  sodium_mg: 93
  potassium_mg: 24
  iodine_ug: 0
  magnesium_mg: 5
  calcium_mg: 3
  iron_mg: 0.6
  zinc_mg: 0.2
  vitamin_c_mg: 0.2
  manganese_mg: 0
  polyols_g: 0
  carbs_available_g: 10.5
  carbs_total_g: 11.1
  copper_mg: 0
  selenium_ug: 0
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 0
  chloride_mg: 0
  sulfur_g: 0.0
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
  - iodine_ug
  - manganese_mg
  estimated_nutrients:
  - name: fiber_soluble_g
    value: 0.2
    confidence: low
    method: Total fiber 0.6g from mushrooms, cabbage, and wheat wrapper. Split using general_plant_foods ratio (30% soluble). 0.6g × 30% = 0.18g, rounded to 0.2g
  - name: fiber_insoluble_g
    value: 0.4
    confidence: low
    method: Total fiber 0.6g from mushrooms, cabbage, and wheat wrapper. Split using general_plant_foods ratio (70% insoluble). 0.6g × 70% = 0.42g, rounded to 0.4g
notes:
- Component-based estimation for 1 piece (35g) vegetarian mushroom dumpling
- "Wrapper (13g cooked from ~11g raw wheat flour): 40 kcal, 1.1g P, 0.1g F, 8.4g C"
- "Shiitake mushrooms (13g cooked): 7.3 kcal, 0.2g P, 0.03g F, 1.9g C"
- "Napa cabbage (4g cooked): 0.5 kcal, sesame oil (3g): 26.5 kcal"
- "Soy sauce (1.5g): 0.8 kcal, 0.12g P, 90mg Na, aromatics (0.5g): trace"
- "Atwater validation: 4×1.5 + 4×10.5 + 9×3.1 = 75.9 kcal (within 1%)"
change_log:
  - timestamp: 2025-11-02
    reason: Initial entry - component-based estimation from USDA FoodData Central
    fields_changed: [all fields]
    evidence: Comprehensive component analysis using USDA nutrition data for wheat flour, shiitake mushrooms, napa cabbage, sesame oil, and soy sauce
    methodology: 'Component-based per ESTIMATE.md: Wrapper 13g (40 kcal), Shiitake 13g (7.3 kcal),
    Cabbage 4g (0.5 kcal), Sesame oil 3g (26.5 kcal), Soy sauce 1.5g (0.8 kcal), Aromatics
    0.5g (trace). Total 35g.'
  - date: 2025-11-05
    updated_by: automated_migration_v1_to_v2
    change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
    minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
    acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
    fields initialized to 0.'
```
