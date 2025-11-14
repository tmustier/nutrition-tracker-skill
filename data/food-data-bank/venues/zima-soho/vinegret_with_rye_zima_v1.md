## Vinegret with 1 slice rye (Zima)

```yaml
id: vinegret_with_rye_zima_v1
schema_version: 2
version: 2
last_verified: 2025-11-02
source:
  venue: Zima, Soho, London
  menu_page: 
  evidence:
  - User-provided nutrition data for full portion as served
  - Traditional Russian beetroot and vegetable salad with 1 slice rye bread (~32g)
aliases:
category: main
portion:
  description: restaurant serving with 1 slice rye bread
  est_weight_g: 283
  notes: Traditional Russian beetroot and vegetable salad dressed with oil; includes 1 slice rye bread (~32g)
assumptions:
  salt_scheme: normal
  oil_type: vegetable oil for dressing
  prep: vegetables dressed with oil
per_portion:
  energy_kcal: 233.5
  protein_g: 5.7
  fat_g: 6.1
  sat_fat_g: 1.2
  mufa_g: 2
  pufa_g: 3.8
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 7.5
  fiber_total_g: 6.9
  fiber_soluble_g: 3.1
  fiber_insoluble_g: 3.8
  sodium_mg: 493
  potassium_mg: 403
  iodine_ug: 5
  magnesium_mg: 45
  calcium_mg: 40
  iron_mg: 2.5
  zinc_mg: 1.0
  vitamin_c_mg: 12
  manganese_mg: 0.5
  polyols_g: 0
  carbs_available_g: 35.5
  carbs_total_g: 42.4
  copper_mg: 0.2
  selenium_ug: 15
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 90
  chloride_mg: 759.0
  sulfur_g: 0.023
  vitamin_a_ug: 450
  vitamin_d_ug: 0
  vitamin_e_mg: 1.5
  vitamin_k_ug: 8
  vitamin_b1_mg: 0.2
  vitamin_b2_mg: 0.1
  vitamin_b3_mg: 1.5
  vitamin_b5_mg: 0.5
  vitamin_b6_mg: 0.3
  vitamin_b7_ug: 0
  vitamin_b9_ug: 80
  vitamin_b12_ug: 0
  choline_mg: 25
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.3
  omega6_la_g: 2.5
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - Fat breakdown (7.0g) slightly exceeds total fat (6.1g) - recorded as provided
notes:
- Includes beetroot, vegetables, and 1 slice rye bread as served
- Plant-based dish, cholesterol correctly 0mg
- Atwater check (available carb basis): 4×5.7 + 9×6.1 + 4×35.5 + 2×6.9 + 2.4×0.0 = 233.5 kcal
change_log:

  - timestamp: "2025-11-06T23:28:47+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
  - timestamp: 2025-10-30 00:00:00+00:00
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: Initial entry from user-provided nutrition data for Zima restaurant dish
    fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
    per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g, per_portion.cholesterol_mg,
    per_portion.carbs_g, per_portion.sugar_g, per_portion.fiber_total_g, per_portion.fiber_soluble_g,
    per_portion.fiber_insoluble_g, per_portion.sodium_mg, per_portion.potassium_mg]
    sources: [{note: 'Complete nutrition data provided by Thomas on 2025-10-30 for Vinegret with
      1 slice rye from Zima, Soho, London', url: user_input}]
  - timestamp: '2025-11-02T19:20:00+00:00'
    updated_by: 'LLM: GPT-5 Codex'
    reason: Standardise carbohydrate fields and recompute available-carb energy
    fields_changed: [last_verified, notes, per_portion.carbs_available_g, per_portion.carbs_g, per_portion.carbs_total_g,
    per_portion.energy_kcal, per_portion.polyols_g, version]
    sources: []
  - date: 2025-11-05
    updated_by: automated_migration_v1_to_v2
    change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
    minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
    acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
    fields initialized to 0.'
  - timestamp: '2025-11-05T18:45:00+00:00'
    updated_by: 'Claude Code (Sonnet 4.5) - Agent 1'
    reason: 'Enriched with nutrient estimates based on typical vinegret components: beetroot, potatoes, carrots, rye bread (~32g), vegetable oil dressing (~10g). Populated 22 nutrients from 0 to estimated values: magnesium (45 mg), calcium (40 mg), iron (2.5 mg), zinc (1.0 mg), vitamin C (12 mg from vegetables), manganese (0.5 mg), copper (0.2 mg), selenium (15 mcg), phosphorus (90 mg), vitamin A (450 mcg from carrots/beetroot), vitamin E (1.5 mg from oil), vitamin K (8 mcg), B-vitamins (B1: 0.2 mg, B2: 0.1 mg, B3: 1.5 mg, B5: 0.5 mg, B6: 0.3 mg, B9: 80 mcg), choline (25 mg), iodine (5 mcg), omega-3 ALA (0.3 g from vegetable oil), omega-6 LA (2.5 g from vegetable oil). Confidence: MEDIUM (±20-40% - component-based estimation for multi-ingredient salad).'
    fields_changed: [iodine_ug, magnesium_mg, calcium_mg, iron_mg, zinc_mg, vitamin_c_mg, manganese_mg, copper_mg, selenium_ug, phosphorus_mg, vitamin_a_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b9_ug, choline_mg, omega3_ala_g, omega6_la_g]
    sources:
    - note: 'Component-based estimation: beetroot, potatoes, carrots, rye bread, vegetable oil. Based on USDA data for individual ingredients.'
    url: 'https://fdc.nal.usda.gov/'
    confidence: 'MEDIUM - multi-component vegetable salad estimation'
```
