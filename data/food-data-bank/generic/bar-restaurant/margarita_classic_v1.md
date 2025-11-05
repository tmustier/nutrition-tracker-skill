## Margarita (Classic)

```yaml
id: margarita_classic_v1
schema_version: 2
version: 2
last_verified: 2025-11-02
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
  manganese_mg: 0
  polyols_g: 0
  carbs_available_g: 13
  carbs_total_g: 13.1
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
change_log:
- timestamp: 2025-11-01T00:09:00+0000
...
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
```
