## Borscht Krasnodarsky with Beef (Zima Soho)

```yaml
id: borscht_krasnodarsky_zima_v1
schema_version: 2
version: 3
last_verified: 2025-11-03
source:
  venue: Zima, Soho, London
  menu_page: "https://zimarestaurant.co.uk/"
  evidence:
  - User-provided nutrition data for full portion including all sides
  - Traditional beetroot soup with beef, served with sour cream (~30g), salo (~20g cured pork fat), and 1 slice Borodinsky rye bread (~32g)
  - Complete dish nutrition from venue analysis
aliases:
- Borscht with Beef
- Krasnodarsky Borscht
category: main
portion:
  description: restaurant portion with traditional sides
  est_weight_g: 382
  notes: Bowl of borscht (~300ml) with beef, served with sour cream (~30g), salo (~20g), and 1 slice Borodinsky rye bread (~32g)
assumptions:
  salt_scheme: normal
  oil_type: traditional preparation
  prep: Traditional Russian beetroot soup with beef, served with sour cream, cured pork fat (salo), and Borodinsky rye bread on the side
per_portion:
  energy_kcal: 469.1
  protein_g: 8.1
  fat_g: 32.5
  sat_fat_g: 13.5
  mufa_g: 14.3
  pufa_g: 3.3
  trans_fat_g: 0.4
  cholesterol_mg: 87
  sugar_g: 9.3
  fiber_total_g: 5.3
  fiber_soluble_g: 2.3
  fiber_insoluble_g: 3
  sodium_mg: 931
  potassium_mg: 595
  iodine_ug: 19
  magnesium_mg: 35
  calcium_mg: 65
  iron_mg: 2.0
  zinc_mg: 2.5
  vitamin_c_mg: 8
  manganese_mg: 0.3
  polyols_g: 0
  carbs_available_g: 33.4
  carbs_total_g: 38.7
  copper_mg: 0.15
  selenium_ug: 18
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 150
  chloride_mg: 1434.0
  sulfur_g: 0.032
  vitamin_a_ug: 180
  vitamin_d_ug: 0.4
  vitamin_e_mg: 2.5
  vitamin_k_ug: 6
  vitamin_b1_mg: 0.25
  vitamin_b2_mg: 0.2
  vitamin_b3_mg: 3.5
  vitamin_b5_mg: 0.7
  vitamin_b6_mg: 0.3
  vitamin_b7_ug: 0
  vitamin_b9_ug: 45
  vitamin_b12_ug: 0.8
  choline_mg: 45
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.15
  omega6_la_g: 1.8
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 1
quality:
  confidence: medium
  gaps: []
notes:
- 447 kcal total for complete dish with all sides
- Borscht bowl approximately 300ml
- Sides: sour cream ~30g, salo ~20g, Borodinsky rye bread ~32g (1 slice)
- Estimated total dish weight 382g (300g soup + 30g sour cream + 20g salo + 32g bread)
- Traditional Russian preparation with beef and beetroot
- Salo is traditional Ukrainian/Russian cured pork fat
- Borodinsky rye is a dark rye bread with coriander and molasses
- Atwater check (available carb basis): 4×8.1 + 9×32.5 + 4×33.4 + 2×5.3 + 2.4×0.0 = 469.1 kcal
change_log:

  - timestamp: "2025-11-06T23:28:47+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
- timestamp: 2025-10-30 00:00:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Initial entry for Zima Soho borscht with complete nutrition data from venue analysis
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
  per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g, per_portion.cholesterol_mg,
  per_portion.carbs_g, per_portion.sugar_g, per_portion.fiber_total_g, per_portion.fiber_soluble_g,
  per_portion.fiber_insoluble_g, per_portion.sodium_mg, per_portion.potassium_mg,
  portion.est_weight_g]
  sources: [{note: 'Zima restaurant, Soho, London - traditional Russian cuisine', url: 'https://zimarestaurant.co.uk/'},
  {note: 'Complete nutrition data provided for full portion including borscht, sour
      cream, salo, and Borodinsky rye bread', url: user_input}]
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed: [derived.energy_from_macros_kcal, last_verified, notes, per_portion.carbs_available_g,
  per_portion.carbs_g, per_portion.carbs_total_g, per_portion.energy_kcal, per_portion.polyols_g,
  version]
  sources: []
- timestamp: '2025-11-03T15:44:11+00:00'
  updated_by: 'LLM: Claude Code'
  reason: Add iodine estimate from beef and salo (LOW priority nutrient completion)
  fields_changed: [last_verified, per_portion.iodine_ug, version]
  sources: [{note: "USDA FoodData Central: Meat typically ~5 \xB5g/100g. 382g dish with beef\
      \ in soup + 20g salo, estimated meat content = 19\xB5g. Confidence: LOW-MEDIUM\
      \ (meat is minor iodine source, portion estimate has uncertainty)", url: 'https://fdc.nal.usda.gov/'}]
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
- timestamp: '2025-11-05T19:00:00+00:00'
  updated_by: 'Claude Code (Sonnet 4.5) - Agent 1'
  reason: 'Enriched with nutrient estimates based on borscht components: beetroot soup with beef (~300ml), sour cream (~30g), salo/cured pork fat (~20g), Borodinsky rye bread (~32g). Populated 21 nutrients from 0 to estimated values: magnesium (35 mg), calcium (65 mg from sour cream), iron (2.0 mg from beef/beetroot), zinc (2.5 mg from beef), vitamin C (8 mg from beetroot), manganese (0.3 mg), copper (0.15 mg), selenium (18 mcg from beef), phosphorus (150 mg), vitamin A (180 mcg from sour cream/carrots), vitamin D (0.4 mcg from dairy/salo), vitamin E (2.5 mg), vitamin K (6 mcg), B-vitamins (B1: 0.25 mg, B2: 0.2 mg, B3: 3.5 mg from beef, B5: 0.7 mg, B6: 0.3 mg, B9: 45 mcg, B12: 0.8 mcg from beef/dairy), choline (45 mg), omega-3 ALA (0.15 g), omega-6 LA (1.8 g). Iodine (19 mcg) previously populated. Confidence: MEDIUM (±20-40% - multi-component dish with beef and dairy).'
  fields_changed: [magnesium_mg, calcium_mg, iron_mg, zinc_mg, vitamin_c_mg, manganese_mg, copper_mg, selenium_ug, phosphorus_mg, vitamin_a_ug, vitamin_d_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_ala_g, omega6_la_g]
  sources:
  - note: 'Component-based estimation: beef, sour cream, salo, rye bread, beetroot soup. Based on USDA data for individual ingredients.'
    url: 'https://fdc.nal.usda.gov/'
    confidence: 'MEDIUM - complex multi-component dish'
```
