## Guinness Draught (Pint, 568ml)

```yaml
id: guinness_pint_568ml_v1
schema_version: 2
version: 2
last_verified: 2025-11-02
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
  iodine_ug: 3
  magnesium_mg: 28
  calcium_mg: 34
  iron_mg: 0.6
  zinc_mg: 0.1
  vitamin_c_mg: 0
  manganese_mg: 0.2
  polyols_g: 0
  carbs_available_g: 18
  carbs_total_g: 18
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
change_log:
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
```
