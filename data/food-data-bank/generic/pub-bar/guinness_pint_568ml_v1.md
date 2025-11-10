## Guinness Draught (Pint, 568ml)

```yaml
id: guinness_pint_568ml_v1
schema_version: 2
version: 4
last_verified: 2025-11-05
source:
  venue: Pub/Bar - Generic
  menu_page: 
  evidence:
  - Guinness official nutrition data: 210 kcal, 1.9g protein, 18g carbs per pint (568ml)
  - Standard UK/Ireland pint serving (568ml / 20 fl oz)
  - 4.2% ABV (alcohol by volume)
aliases:
- Guinness
- Guinness Draught
- Pint of Guinness
category: drink
portion:
  description: 1 pint (568ml / 20 fl oz)
  est_weight_g: 568
  notes: Standard draught Guinness served in pint glass
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: Draught beer, nitrogen widget pour
per_portion:
  energy_kcal: 79.6
  protein_g: 1.9
  fat_g: 0
  sat_fat_g: 0
  mufa_g: 0
  pufa_g: 0
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 0
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 28
  potassium_mg: 200
  iodine_ug: 5
  magnesium_mg: 28
  calcium_mg: 34
  iron_mg: 0.6
  zinc_mg: 0.1
  vitamin_c_mg: 0
  manganese_mg: 0.2
  polyols_g: 0
  carbs_available_g: 18
  carbs_total_g: 18
  copper_mg: 0.06
  selenium_ug: 3.4
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 80
  chloride_mg: 43.0
  sulfur_g: 0.008
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.06
  vitamin_b2_mg: 0.17
  vitamin_b3_mg: 2.9
  vitamin_b5_mg: 0.23
  vitamin_b6_mg: 0.28
  vitamin_b7_ug: 5.7
  vitamin_b9_ug: 34
  vitamin_b12_ug: 0.11
  choline_mg: 12
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.003
  omega6_la_g: 0.006
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  alcohol_g: 19
  alcohol_energy_kcal: 133
quality:
  confidence: high
  gaps:
notes:
- Standard pint: 568ml at 4.2% ABV = ~19g alcohol
- Alcohol contributes ~133 kcal (7 kcal/g), macros contribute ~80 kcal
- Total energy: 210 kcal per pint
- Very low sugar content due to fermentation process
- Minimal fat content in beer
- Nitrogen pour creates characteristic creamy head and smooth mouthfeel
- Contains barley (gluten), yeast, hops, roasted barley
- Distinctive dark color from roasted unmalted barley
- Iron content notable due to dark roasted grains
- Atwater check (available carb basis): 4×1.9 + 9×0.0 + 4×18.0 + 2×0.0 + 2.4×0.0 = 79.6 kcal
- 'B vitamins (B1, B2, B3, B6, B9, B12) derived from barley malt and brewing yeast'
- 'Choline content: 12mg per pint from yeast and malt sources (typical for beer)'
- 'Phosphorus (80mg) and trace minerals (copper, selenium) from barley and water'
- 'Fat-soluble vitamins (A, D, E, K) and omega-3 fatty acids absent or negligible in beer'
- 'Iodine content: ~5µg per pint (USDA iodine database: 0.9µg/100ml mean)'
- 'Most nutrient values calculated from USDA FDC #168746 (regular beer) scaled to 568ml'
- 'B5 (Pantothenic acid): 0.23mg per pint (0.04mg/100ml × 5.68 = 0.23mg) - from brewing yeast and barley'
- 'B7 (Biotin): 5.7µg per pint (1.0µg/100ml × 5.68 = 5.7µg) - from yeast fermentation'
- 'Omega-6 LA: 0.006g per pint (trace amounts from barley, 0.001g/100ml × 5.68)'
- 'Omega-3 ALA: 0.003g per pint (trace amounts from barley, 0.0005g/100ml × 5.68)'
change_log:

  - timestamp: "2025-11-06T23:28:46+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
  - timestamp: "2025-11-05T16:00:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "CRITICAL FIX: Corrected choline scaling error"
    fields_changed:
    - "choline_mg: 57 → 12 (corrected from 3-4× overestimate; typical beer contains 10-15mg/pint)"
  - timestamp: 2025-10-31T17:00:00+0000
    updated_by: Claude Code (Sonnet 4.5)
    reason: Initial entry for tracking Guinness consumption
    fields_changed: [all fields]
    sources: [{note: 'Official Guinness nutrition data: 210 kcal, 1.9g protein, 18g carbs per pint',
    url: 'https://www.guinness.com'}, {note: 'User tracking two pints consumed at
      17:20 and 17:50', url: user_request}]
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
  - timestamp: '2025-11-05T12:00:00+00:00'
    updated_by: 'Claude Code (Sonnet 4.5)'
    reason: 'Enriched 17 priority nutrients using USDA FoodData Central data'
    fields_changed: [version, last_verified, iodine_ug, phosphorus_mg, copper_mg, selenium_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b6_mg, vitamin_b9_ug, vitamin_b12_ug, choline_mg, notes]
    sources:
    - note: 'USDA FoodData Central #168746 - Alcoholic beverage, beer, regular, all'
      url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/168746/nutrients'
    - note: 'Foodstruct.com beer nutrition data (USDA-derived) per 100g'
      url: 'https://foodstruct.com/food/beer'
    - note: 'USDA, FDA, ODS-NIH Database for Iodine Content: beer mean 0.9 µg/100ml'
      url: 'https://www.ars.usda.gov/ARSUSERFILES/80400535/DATA/IODINE/'
    - note: 'Values scaled from per 100ml/100g to 568ml pint (multiplier: 5.68x)'
      calculation: 'Example: B3 (niacin) 0.51mg/100ml × 5.68 = 2.9mg per pint'
  - timestamp: '2025-11-05T18:00:00+00:00'
    updated_by: 'Claude Code (Sonnet 4.5)'
    reason: 'Additional nutrient enrichment: B5, B7, omega-6 LA, omega-3 ALA with USDA values'
    fields_changed: [version, vitamin_b5_mg, vitamin_b7_ug, omega6_la_g, omega3_ala_g, notes]
    sources:
    - note: 'USDA FoodData Central #168746 - Regular beer nutrient data'
      url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/168746/nutrients'
    - note: 'Foodstruct.com beer nutrition (USDA-derived): B5=0.04mg/100ml, choline=10mg/100ml'
      url: 'https://foodstruct.com/food/beer'
    - note: 'Brewing yeast contributes B5 and B7; barley provides trace fatty acids'
      calculation: 'B5: 0.04mg/100ml × 5.68 = 0.23mg; B7: 1.0µg/100ml × 5.68 = 5.7µg; LA: 0.001g/100ml × 5.68 = 0.006g; ALA: 0.0005g/100ml × 5.68 = 0.003g'
```
