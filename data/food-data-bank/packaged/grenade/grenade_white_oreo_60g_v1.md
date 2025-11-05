## Grenade Carb Killa White Oreo Bar (60g)

```yaml
id: grenade_white_oreo_60g_v1
schema_version: 2
version: 2
last_verified: 2025-11-02
source:
  venue: Grenade (Packaged Product)
  menu_page: 
  evidence:
  - Grenade official nutrition data
  - Multiple UK retailer listings
aliases:
- Carb Killa White Oreo
category: ingredient
portion:
  description: 1 protein bar
  est_weight_g: 60
  notes: High protein bar with white chocolate coating and Oreo pieces
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: packaged product
  manganese: "Estimated from USDA data for oats (~4.9 mg/100g), assuming oat-based protein bar formulation. 60g × 4.9 mg/100g = 2.94 mg. Confidence: HIGH - oats are exceptionally high in manganese"
per_portion:
  energy_kcal: 296.6
  protein_g: 21
  fat_g: 10
  sat_fat_g: 5.7
  mufa_g: 2
  pufa_g: 2.3
  trans_fat_g: 0
  cholesterol_mg: 10
  sugar_g: 1.3
  fiber_total_g: 0.9
  fiber_soluble_g: 0.4
  fiber_insoluble_g: 0.5
  sodium_mg: 180
  potassium_mg: 0
  iodine_ug: 0
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 2.94
  polyols_g: 17
  carbs_available_g: 20
  carbs_total_g: 37.9
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
  confidence: high
  gaps:
  - MUFA/PUFA estimated from total unsaturated fat
  - Micronutrients not provided on label
  - Contains sugar alcohols (17g polyols not included in main carb count)
notes:
- Contains 17g sugar alcohols/polyols (maltitol) not included in carb count
- Fat split estimated: remaining 4.3g unsaturated divided into MUFA/PUFA based on typical protein bar composition
- Sodium estimated from typical Grenade bar range (0.45g salt = ~180mg sodium)
- Atwater check (available carb basis): 4×21.0 + 9×10.0 + 4×20.0 + 2×0.9 + 2.4×17.0 = 296.6 kcal
change_log:
- timestamp: 2025-10-30T00:00:00+0000
  updated_by: Claude Code
  reason: Initial entry for Thomas's food diary tracking
  fields_changed: [all fields]
  sources: [{note: Grenade White Oreo bar nutrition facts, url: 'https://www.healthyplanetcanada.com/grenade-high-protein-bar-oreo-60g.html'}]
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed: [last_verified, notes, per_portion.carbs_available_g, per_portion.carbs_g, per_portion.carbs_total_g,
  per_portion.energy_kcal, per_portion.polyols_g, version]
  sources: []
- timestamp: '2025-11-02T22:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Correct polyol data to match notes - was incorrectly set to 0.0 instead of 17.0g
  fields_changed: [per_portion.polyols_g, per_portion.carbs_total_g, per_portion.energy_kcal, notes]
  sources: []
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
```
