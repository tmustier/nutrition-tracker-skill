## Elite Greens Shake - Third Space Natural Fitness Food

```yaml
id: elite_greens_nff_v1
schema_version: 2
version: 3
last_verified: 2025-11-05
source:
  venue: Third Space / Natural Fitness Food
  menu_page: 
  evidence:
  - User-provided partial nutrition data: 350 kcal, 8g F, 43g C, 4g Fiber, 25g Protein
  - Ingredient list from Third Space website: cold-pressed juice (2Boost) by 2-Juice featuring Apple, Baby Spinach, Cucumber, Parsley, Lemon & Ginger, with vanilla protein powder, oat milk & banana
  - Natural Fitness Food shake categories (Lean/Fuel) for context
aliases:
- Elite Greens
- 2Boost shake
category: drink
portion:
  description: 1 complete shake
  est_weight_g: 370
  notes: Blended shake containing juice, protein powder, oat milk, and banana
assumptions:
  salt_scheme: normal
  oil_type: oat milk (barista-style, likely contains rapeseed/sunflower oil)
  prep: Cold-blended shake with cold-pressed juice base
per_portion:
  energy_kcal: 352
  protein_g: 25
  fat_g: 8
  sat_fat_g: 1.5
  mufa_g: 3
  pufa_g: 2
  trans_fat_g: 0
  cholesterol_mg: 20
  sugar_g: 26
  fiber_total_g: 4
  fiber_soluble_g: 2.2
  fiber_insoluble_g: 1.8
  sodium_mg: 100
  potassium_mg: 500
  iodine_ug: 5
  magnesium_mg: 50
  calcium_mg: 220
  iron_mg: 1.5
  zinc_mg: 1.5
  vitamin_c_mg: 25
  manganese_mg: 1
  polyols_g: 0
  carbs_available_g: 43
  carbs_total_g: 47
  copper_mg: 0.18
  selenium_ug: 11
  chromium_ug: 5
  molybdenum_ug: 7
  phosphorus_mg: 281
  chloride_mg: 283
  sulfur_mg: 182
  vitamin_a_ug: 157
  vitamin_d_ug: 1.2
  vitamin_e_mg: 0.68
  vitamin_k_ug: 61
  vitamin_b1_mg: 0.13
  vitamin_b2_mg: 0.69
  vitamin_b3_mg: 1.1
  vitamin_b5_mg: 1.68
  vitamin_b6_mg: 0.45
  vitamin_b7_ug: 4.2
  vitamin_b9_ug: 38
  vitamin_b12_ug: 1.2
  choline_mg: 62
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.05
  omega6_la_g: 0.6
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - Fiber breakdown estimated from component analysis
  - Fat subtype breakdown estimated from oat milk composition
  - Micronutrients estimated from ingredient contributions
notes:
- Component breakdown: NFF Vanilla Whey (125 kcal, 22g P, 6.5g C, 1.4g F) + banana ~80g + oat milk ~180ml + 2Boost juice ~130ml
- Fat breakdown (sat 1.5g + MUFA 3.0g + PUFA 2.0g) totals 6.5g, remainder 1.5g likely short-chain/other fats
- Fiber soluble (2.2g) mainly from banana pectin, oat milk beta-glucan, whey xanthan gum
- Fiber insoluble (1.8g) from banana cellulose, oat milk, juice greens
- High potassium from banana (280mg) and juice (150mg)
- Calcium fortified via oat milk (180mg)
- Vitamin C from juice greens, parsley, lemon (18mg) plus banana (7mg)
- Atwater check (available carb basis): 4×25.0 + 9×8.0 + 4×43.0 + 2×4.0 + 2.4×0.0 = 352 kcal
change_log:
- timestamp: 2025-10-31T00:00:00+0000
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial entry with component-based triangulation from user-provided macros and confirmed ingredient list
  fields_changed: [all fields]
  sources: [{note: 'User-provided core nutrition data: 350 kcal, 8g F, 43g C, 4g Fiber, 25g Protein',
    url: user_input}, {note: 'Ingredient list: 2Boost juice (Apple, Baby Spinach,
      Cucumber, Parsley, Lemon, Ginger) + vanilla protein + oat milk + banana', url: 'https://www.thirdspace.london/natural-fitness-food/'},
  {note: NFF Vanilla Whey nutrition data for component analysis, url: 'https://uk-ga.openfoodfacts.org/product/5065003325005/whey-protein-vanilla-natural-fitness-food'}]
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed: [derived.energy_from_macros_kcal, last_verified, notes, per_portion.carbs_available_g,
  per_portion.carbs_g, per_portion.carbs_total_g, per_portion.energy_kcal, per_portion.polyols_g,
  version]
  sources: []
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
- timestamp: '2025-11-05T14:45:00+00:00'
  updated_by: 'Agent 4: Claude Code (Sonnet 4.5)'
  reason: 'Comprehensive nutrient enrichment for 370g shake using component-based USDA data (vanilla whey 30g, banana 80g, oat milk 180ml, 2Boost juice 130ml)'
  fields_changed: [copper_mg, selenium_ug, chromium_ug, molybdenum_ug, phosphorus_mg, chloride_mg, sulfur_mg, vitamin_a_ug, vitamin_d_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b7_ug, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_ala_g, omega6_la_g, version, last_verified]
  sources:
  - note: 'USDA FoodData Central - Whey protein isolate: phosphorus, selenium, B vitamins (B2, B5, B12), choline from dairy'
    url: 'https://fdc.nal.usda.gov/'
  - note: 'USDA FoodData Central - Banana (FDC 173944): vitamin B6 0.37mg/100g, folate, minerals'
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/173944'
  - note: 'UK fortified oat milk: typically fortified with vitamins A, D, B2, B12, calcium. Natural oat ALA omega-3.'
    url: 'product_label_standards'
  - note: 'Component aggregation for 370g shake. B12 from dairy whey and fortified oat milk. EPA/DHA remain 0 (no fish). Ultra-trace elements remain 0 (insufficient data).'
    url: 'component_analysis'
```
