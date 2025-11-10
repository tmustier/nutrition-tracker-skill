## Margarita (Classic)

```yaml
id: margarita_classic_v1
schema_version: 2
version: 4
last_verified: 2025-11-05
source:
  venue: Generic - Bar/Restaurant
  menu_page: 
  evidence:
  - Standard margarita recipe: 1.5 oz tequila, 1 oz triple sec/Cointreau, 1 oz lime juice
  - USDA FoodData Central for component ingredients
  - Typical cocktail nutrition databases
aliases:
- Margarita
- Classic Margarita
- Tequila Margarita
category: drink
portion:
  description: 1 standard margarita (~4 oz / 120ml)
  est_weight_g: 120
  notes: "Classic recipe: tequila, triple sec, lime juice - on the rocks or blended"
assumptions:
  salt_scheme: normal
  oil_type:
  prep: Mixed cocktail, served with or without salt rim
  nutrient_source: USDA FoodData Central FDC ID 168753 (Alcoholic beverage, tequila sunrise, canned) - closest available match for tequila-based cocktails
per_portion:
  energy_kcal: 52.6
  protein_g: 0.1
  fat_g: 0
  sat_fat_g: 0
  mufa_g: 0
  pufa_g: 0
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 11
  fiber_total_g: 0.1
  fiber_soluble_g: 0
  fiber_insoluble_g: 0.1
  sodium_mg: 5
  potassium_mg: 40
  iodine_ug: 0
  magnesium_mg: 3
  calcium_mg: 5
  iron_mg: 0.1
  zinc_mg: 0
  vitamin_c_mg: 12
  manganese_mg: 0.02
  polyols_g: 0
  carbs_available_g: 13
  carbs_total_g: 13.1
  copper_mg: 0.05
  selenium_ug: 0
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 12.0
  chloride_mg: 8.0
  sulfur_g: 0.0
  vitamin_a_ug: 6.0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.046
  vitamin_b2_mg: 0.019
  vitamin_b3_mg: 0.23
  vitamin_b5_mg: 0.065
  vitamin_b6_mg: 0.06
  vitamin_b7_ug: 0.2
  vitamin_b9_ug: 13.2
  vitamin_b12_ug: 0
  choline_mg: 1.5
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.001
  omega6_la_g: 0.003
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  alcohol_g: 24
  alcohol_energy_kcal: 168
quality:
  confidence: medium
  gaps:
notes:
- Standard recipe: 45ml (1.5 oz) tequila @ 40% ABV = ~14g alcohol
- 30ml (1 oz) triple sec @ 40% ABV = ~10g alcohol
- 30ml (1 oz) fresh lime juice = ~10 kcal, 3g carbs, 12mg vitamin C
- Total alcohol: ~24g contributing ~168 kcal (7 kcal/g)
- Carbs from triple sec (~10g sugar) and lime juice (~3g)
- Total energy: ~220 kcal (168 from alcohol + 52 from carbs)
- Variations may include simple syrup (adds ~50 kcal and 12g sugar)
- Salt rim adds negligible calories but ~200-400mg sodium if licked
- Frozen margaritas may contain additional sugar/syrups
- Vitamin C primarily from fresh lime juice
- Atwater check (available carb basis): 4×0.1 + 9×0.0 + 4×13.0 + 2×0.1 + 2.4×0.0 = 52.6 kcal
- 'B5 (Pantothenic acid): 0.065mg from lime juice (30ml × 0.217mg/100ml USDA lime juice value)'
- 'B7 (Biotin): 0.2µg from lime juice (trace amounts, tequila/triple sec provide essentially 0)'
- 'Choline: 1.5mg from lime juice (30ml × 5.1mg/100ml USDA lime juice value)'
- 'Omega-6 LA: 0.003g trace from lime (distilled spirits contain no fatty acids)'
- 'Omega-3 ALA: 0.001g trace from lime (cocktail is ~80% alcohol by volume which has no lipids)'
change_log:

  - timestamp: "2025-11-06T23:28:46+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
  - timestamp: 2025-11-01T00:09:00+0000
    updated_by: Claude Code (Sonnet 4.5)
    reason: Initial entry for tracking margarita consumption
    fields_changed: [all fields]
    sources: [{note: USDA FoodData Central component values, url: 'https://fdc.nal.usda.gov/'},
    {note: User consumed margarita on 2025-11-01, url: user_request}]
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
  - timestamp: '2025-11-05T00:00:00+00:00'
    updated_by: 'Claude Code (Sonnet 4.5)'
    reason: Enriched with 17 priority nutrients from USDA FoodData Central
    fields_changed: [phosphorus_mg, copper_mg, selenium_ug, manganese_mg, vitamin_a_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b6_mg, vitamin_b9_ug, vitamin_b12_ug, version, last_verified]
    sources: [{note: 'USDA FoodData Central - FDC ID 168753 (Alcoholic beverage, tequila sunrise, canned)', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/168753/nutrients'}]
    details: 'Added 10 non-zero nutrients from USDA tequila sunrise data (closest available match): phosphorus (12.0mg), copper (0.05mg), manganese (0.02mg), vitamin A (6.0µg), B1/thiamin (0.046mg), B2/riboflavin (0.019mg), B3/niacin (0.23mg), B6 (0.06mg), B9/folate (13.2µg). Values scaled from USDA per-100ml to 120ml portion. Nutrients not present in USDA data remain at 0: vitamin D, E, K, B12, choline, iodine, omega-3 EPA/DHA.'
  - timestamp: '2025-11-05T18:15:00+00:00'
    updated_by: 'Claude Code (Sonnet 4.5)'
    reason: 'Additional nutrient enrichment: B5, B7, choline, omega-6 LA, omega-3 ALA from lime juice component'
    fields_changed: [version, vitamin_b5_mg, vitamin_b7_ug, choline_mg, omega6_la_g, omega3_ala_g, notes]
    sources:
    - note: 'USDA FoodData Central #167747 - Lime juice, raw'
      url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/167747/nutrients'
    - note: 'Margarita recipe: 45ml tequila + 30ml triple sec + 30ml fresh lime juice (+ 15ml simple syrup)'
      calculation: 'All added nutrients derive from 30ml lime juice component: B5=0.217mg/100ml×0.3=0.065mg; B7=0.6µg/100ml×0.3=0.2µg; Choline=5.1mg/100ml×0.3=1.5mg; LA=0.01g/100ml×0.3=0.003g; ALA=0.003g/100ml×0.3=0.001g'
    - note: 'Distilled spirits (tequila, triple sec) provide essentially no B-vitamins, choline, or fatty acids'
```
