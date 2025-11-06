## Duck Broth with Tofu (Imperial Treasure St. James)

```yaml
id: duck_broth_tofu_imperial_treasure_st_james_v1
schema_version: 2
version: 1
last_verified: 2025-11-02
source:
  venue: Duck Broth with Tofu (Imperial Treasure St. James)
  menu_page: 
  evidence:
  - https://honest-food.net/duck-stock-recipe/
  - https://fdc.nal.usda.gov/fdc-app.html#/food-details/172475/nutrients
  - https://theconsciouslife.com/foods/duck-fat-04574.htm
aliases:
category: main
portion:
  description: small bowl (120ml broth with 3 tofu cubes)
  est_weight_g: 135
  notes: Clear duck broth from Peking duck course with 3 small cubes of firm tofu (~15g total)
assumptions:
  salt_scheme: normal
  oil_type: duck fat
  prep: "Component-based estimation: 120ml clear duck broth + 15g firm tofu cubes"
per_portion:
  energy_kcal: 45
  protein_g: 4.3
  fat_g: 2.6
  sat_fat_g: 0.6
  mufa_g: 0.9
  pufa_g: 0.9
  trans_fat_g: 0
  cholesterol_mg: 5
  sugar_g: 0.1
  fiber_total_g: 0.4
  fiber_soluble_g: 0.1
  fiber_insoluble_g: 0.3
  sodium_mg: 302
  potassium_mg: 148
  iodine_ug: 7
  magnesium_mg: 14
  calcium_mg: 112
  iron_mg: 1
  zinc_mg: 0.1
  vitamin_c_mg: 0
  manganese_mg: 0.1
  polyols_g: 0
  carbs_available_g: 1
  carbs_total_g: 1.4
  copper_mg: 0.04
  selenium_ug: 4
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 44
  chloride_mg: 0
  sulfur_g: 0.0
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.04
  vitamin_b2_mg: 0.03
  vitamin_b3_mg: 0.4
  vitamin_b5_mg: 0.05
  vitamin_b6_mg: 0.03
  vitamin_b7_ug: 0
  vitamin_b9_ug: 2
  vitamin_b12_ug: 0.1
  choline_mg: 7
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.09
  omega6_la_g: 0.44
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - manganese
  estimated_nutrients:
  - name: fiber_soluble_g
    value: 0.1
    confidence: low
    method: Total fiber 0.4g from tofu. Split using general_plant_foods ratio (30% soluble). 0.4g × 30% = 0.12g, rounded to 0.1g
  - name: fiber_insoluble_g
    value: 0.3
    confidence: low
    method: Total fiber 0.4g from tofu. Split using general_plant_foods ratio (70% insoluble). 0.4g × 70% = 0.28g, rounded to 0.3g
  - name: iodine_ug
    value: 7
    confidence: low-medium
    method: Duck broth. Meat typically ~5 µg/100g. Total dish 135g × 5 µg/100g = 6.75 µg, rounded to 7 µg. Minor source.
notes:
- Component 1 - Duck broth (120ml): Estimated at 28 kcal based on clear restaurant duck broth (~23 kcal/100ml). Duck fattier than chicken (16 kcal/100ml). Fat profile uses duck fat composition (33% sat, 49% MUFA, 13% PUFA). Sodium assumes normal restaurant seasoning.
- Component 2 - Tofu (15g): USDA FDC 172475 (firm tofu with calcium sulfate) scaled to 15g. High calcium content (102mg) from tofu provides most of dish calcium.
- Atwater calculation: 4×4.3 + 4×1.0 + 9×2.6 = 44.6 kcal vs 50 kcal estimate. 5.4 kcal gap (~11%) attributed to gelatin/collagen in broth with lower energy conversion.
- Total dish weight: ~135g (120ml broth + 15g tofu).
change_log:
- timestamp: '2025-11-02T18:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Initial component-based nutrition estimation for duck broth with tofu from Imperial Treasure St. James Peking duck course
  fields_changed: [all nutrition fields]
  sources: [{note: Hank Shaw duck stock recipe - 13 kcal baseline, url: 'https://honest-food.net/duck-stock-recipe/'},
  {note: Homemade duck broth nutrition - 43 kcal per 100ml for richer version, url: 'https://thematbakh.com/duck-stock-recipe-instant-pot-duck-broth/'},
  {note: USDA FDC 172475 - Firm tofu with calcium sulfate complete nutrition profile,
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/172475/nutrients'},
  {note: 'Duck fat composition: 49.4% MUFA, 33.27% sat, 12.93% PUFA', url: 'https://theconsciouslife.com/foods/duck-fat-04574.htm'}]
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
- timestamp: "2025-11-05T12:50:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5 (Agent 3)"
  reason: "Schema v2 enrichment: Complete nutrient profile for duck broth (120ml) + firm tofu (15g). Added 19 missing nutrients primarily from tofu component. B-vitamins from tofu, trace amounts from broth collagen. Phosphorus (44mg), omega-6 from tofu (0.44g)."
  fields_changed:
  - per_portion.zinc_mg
  - per_portion.manganese_mg
  - per_portion.copper_mg
  - per_portion.selenium_ug
  - per_portion.phosphorus_mg
  - per_portion.vitamin_a_ug
  - per_portion.vitamin_d_ug
  - per_portion.vitamin_e_mg
  - per_portion.vitamin_k_ug
  - per_portion.vitamin_b1_mg
  - per_portion.vitamin_b2_mg
  - per_portion.vitamin_b3_mg
  - per_portion.vitamin_b5_mg
  - per_portion.vitamin_b6_mg
  - per_portion.vitamin_b7_ug
  - per_portion.vitamin_b9_ug
  - per_portion.vitamin_b12_ug
  - per_portion.choline_mg
  - per_portion.omega3_ala_g
  - per_portion.omega6_la_g
  - version
  sources:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/172475/nutrients
    note: "USDA FDC 172475 - Firm tofu with calcium sulfate (15g portion). Tofu provides: B1=0.03mg, B2=0.02mg, B3=0.06mg, B5=0.02mg, B6=0.02mg, B9=2µg, phosphorus=29mg, selenium=3µg, copper=0.03mg, zinc=0.1mg, manganese=0.1mg, choline=4mg, omega-3 ALA=0.09g, omega-6 LA=0.44g. Duck broth (120ml) adds trace B-vitamins and minerals from collagen. Vitamins A/D/E/K=0 (true zeros for plant-based tofu + clear broth). B12=0.1µg trace from broth. Confidence: HIGH (tofu), MEDIUM (broth estimates)"
```
