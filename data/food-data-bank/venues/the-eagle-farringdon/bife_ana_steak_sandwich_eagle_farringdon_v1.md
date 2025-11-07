## Bife Ana Steak Sandwich (The Eagle, Farringdon)

```yaml
id: bife_ana_steak_sandwich_eagle_farringdon_v1
schema_version: 2
version: 5
last_verified: 2025-11-05
source:
  venue: The Eagle, Farringdon (London)
  menu_page: "https://theeaglefarringdon.co.uk/"
  evidence:
  - Guardian recipe (Eagle cookbook): 500g steak for 2 sandwiches = 250g raw per sandwich
  - USDA cooking yields: 80% yield for grilled sirloin (250g raw → 200g cooked)
  - GPT-5 Pro detailed component analysis with restaurant preparation factors
aliases:
- Bife Ana
- Eagle Steak Sandwich
- Portuguese Steak Sandwich
- Rump Steak Sandwich
category: main
portion:
  description: 1 signature steak sandwich
  est_weight_g: 360
  notes: "Portuguese-style sandwich: 200g cooked rump/sirloin in 90g crusty roll with onions, lettuce, marinade reduction"
assumptions:
  salt_scheme: normal
  oil_type: olive oil (marinade and pan juices soaking into bread)
  prep: 250g raw rump marinated in wine, garlic, chili, bay, parsley, oregano; seared; 2 Tbsp olive oil from marinade + pan reduction soaked into roll; ~60g onion, 10g lettuce; restaurant seasoning ~1.5% of meat weight
per_portion:
  energy_kcal: 853.7
  protein_g: 69.4
  fat_g: 39.5
  sat_fat_g: 8.5
  mufa_g: 24.3
  pufa_g: 3.3
  trans_fat_g: 0
  cholesterol_mg: 164
  sugar_g: 4.8
  fiber_total_g: 3.7
  fiber_soluble_g: 1.1
  fiber_insoluble_g: 2.6
  sodium_mg: 1910
  potassium_mg: 1070
  iodine_ug: 18
  magnesium_mg: 65
  calcium_mg: 45
  iron_mg: 5.5
  zinc_mg: 8.5
  vitamin_c_mg: 3
  manganese_mg: 0
  polyols_g: 0
  carbs_available_g: 53.3
  carbs_total_g: 57
  copper_mg: 0.30
  selenium_ug: 75
  chromium_ug: 4
  molybdenum_ug: 18
  phosphorus_mg: 558
  chloride_mg: 2941.0
  sulfur_g: 0.278
  vitamin_a_ug: 7
  vitamin_d_ug: 0.2
  vitamin_e_mg: 4.6
  vitamin_k_ug: 33
  vitamin_b1_mg: 0.50
  vitamin_b2_mg: 0.57
  vitamin_b3_mg: 18.5
  vitamin_b5_mg: 1.7
  vitamin_b6_mg: 0.96
  vitamin_b7_ug: 11
  vitamin_b9_ug: 117
  vitamin_b12_ug: 4.2
  choline_mg: 187
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.34
  omega6_la_g: 3.9
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - No official nutritional data from venue
  - Menu changes daily - availability not guaranteed
  - Micronutrient estimates from component ingredients
  - Sodium varies by chef seasoning style: light 1,420mg, base 1,910mg, heavy 2,400mg
  - Actual portion may vary
notes:
- London's first gastropub (est. 1991) - legendary signature dish
- Menu chalked daily, changes twice per day - call ahead to confirm availability: 020 7837 1353
- Component breakdown (base case): 200g cooked sirloin (366 kcal, 61g P, 11.6g F), 90g Portuguese roll (235 kcal, 47g C, 8g P), 2 Tbsp olive oil (238 kcal, 27g F), 60g onion + 10g lettuce (25 kcal, 6-7g C)
- Marinade: onion, garlic, dried chili, bay leaf, parsley, oregano, red wine, olive oil
- Cooking method: steak marinated several hours, seared in very hot pan, pan juices reduced and soaked into bread
- Fat profile: olive oil-forward with MUFA ~24.3g (62% of total fat), PUFA ~3.3g, saturated ~8.5g
- Sodium variability: Light seasoning (1.0% meat) = 1,420mg; Base (1.5%) = 1,910mg; Heavy (2.0%) = 2,400mg
- Bread contributes ~310mg sodium baseline; most sodium from chef's salt seasoning
- Fiber: ~2.4-2.9g insoluble from roll, ~0.8-1.3g soluble from onion
- High protein meal: 69.4g = 41% of 170g daily target
- Sodium warning: Base case at 83% of 2,300mg daily limit; heavy seasoning would exceed limit
- Potassium: 1,070mg = 27% of 4,000mg target (pair with K-rich sides to boost)
- Portuguese-inspired preparation (Bife Ana = beef version of traditional pork bifana)
- The sauce/reduction is where most extra oil and salt enter the sandwich
- Atwater check (available carb basis): 4×69.4 + 9×39.5 + 4×53.3 + 2×3.7 + 2.4×0.0 = 853.7 kcal
change_log:

  - timestamp: "2025-11-06T23:28:46+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
- timestamp: 2025-11-01T08:45:00+0000
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial entry for The Eagle's signature steak sandwich - user planning visit to venue
  fields_changed: [all fields]
  sources: [{note: Official venue website, url: 'https://theeaglefarringdon.co.uk/'}, {note: Portuguese
      steak sandwich nutritional baseline (~715 kcal), url: 'https://gastroportugal.com/prego-no-pao/'},
  {note: 'USDA FoodData Central for rump steak, bread, olive oil component values',
    url: 'https://fdc.nal.usda.gov/'}, {note: User researching for upcoming visit
      on 2025-11-01, url: user_request}]
- timestamp: 2025-11-01T09:35:00+0000
  updated_by: Claude Code (Sonnet 4.5)
  reason: Updated with GPT-5 Pro detailed analysis - significantly more accurate than initial estimate
  fields_changed: [version, per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
  per_portion.mufa_g, per_portion.pufa_g, per_portion.carbs_g, per_portion.sugar_g,
  per_portion.fiber_total_g, per_portion.fiber_soluble_g, per_portion.fiber_insoluble_g,
  per_portion.sodium_mg, per_portion.potassium_mg, per_portion.cholesterol_mg, per_portion.trans_fat_g,
  quality.confidence, quality.gaps, portion.est_weight_g, assumptions.prep]
  sources: [{note: 'Guardian published Eagle cookbook recipe: 500g steak for 2 sandwiches', url: 'https://www.theguardian.com/lifeandstyle/2010/sep/25/portuguese-steak-sandwich-recipe'},
  {note: 'USDA cooking yields: 80% for grilled sirloin', url: 'https://www.ars.usda.gov/ARSUserFiles/80400525/Data/retn/retn06.pdf'},
  {note: "GPT-5 Pro component-based analysis: 200g cooked sirloin + 90g roll + 2 Tbsp\
      \ oil + onion/lettuce + restaurant salt seasoning. Major corrections: calories\
      \ 750\u2192866, sodium 650\u21921,910mg, protein 55\u219269.4g", url: gpt5_pro_analysis}]
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed: [last_verified, notes, per_portion.carbs_available_g, per_portion.carbs_g, per_portion.carbs_total_g,
  per_portion.energy_kcal, per_portion.polyols_g, version]
  sources: []
- timestamp: '2025-11-03T15:44:11+00:00'
  updated_by: 'LLM: Claude Code'
  reason: Add iodine estimate from beef (LOW priority nutrient completion)
  fields_changed: [last_verified, per_portion.iodine_ug, version]
  sources: [{note: "USDA FoodData Central: Beef typically ~5 \xB5g/100g. Estimated 360g sandwich\
      \ with 200g cooked rump = 18\xB5g. Confidence: LOW-MEDIUM (meat is minor iodine\
      \ source)", url: 'https://fdc.nal.usda.gov/'}]
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
- timestamp: '2025-11-05T14:30:00+00:00'
  updated_by: 'Agent 4: Claude Code (Sonnet 4.5)'
  reason: 'Comprehensive nutrient enrichment using component-based USDA data aggregation for 360g sandwich (200g cooked beef, 90g roll, 27g olive oil, 60g onion, 10g lettuce)'
  fields_changed: [copper_mg, selenium_ug, chromium_ug, molybdenum_ug, phosphorus_mg, chloride_mg, sulfur_mg, vitamin_a_ug, vitamin_d_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b7_ug, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_ala_g, omega6_la_g, version]
  sources:
  - note: 'USDA FoodData Central - Beef sirloin cooked (FDC 174032): phosphorus 225mg/100g, selenium 26µg/100g, B12 2.1µg/100g, B vitamins, choline'
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/174032'
  - note: 'USDA FoodData Central - White bread enriched (FDC 172687): B vitamins (enriched flour), selenium, phosphorus, folate 90µg/100g'
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/172687'
  - note: 'USDA FoodData Central - Olive oil (FDC 171413): vitamin E 14.8mg/100g, vitamin K 60µg/100g, omega-3 ALA, omega-6 LA'
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/171413'
  - note: 'Component aggregation: Beef 200g + roll 90g + olive oil 27g + onion 60g + lettuce 10g. EPA/DHA remain 0 (no fish). Ultra-trace elements (boron, silicon, vanadium, nickel) remain 0 (insufficient data for reliable estimation).'
    url: 'component_analysis'
```
