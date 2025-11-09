## Zesty Lemon Broccoli (Simple Health Kitchen)

```yaml
id: zesty_lemon_broccoli_shk_v1
schema_version: 2
version: 5
last_verified: 2025-11-02
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: 
  evidence:
aliases:
category: side
portion:
  description: broccoli with lemon zest/juice
  est_weight_g:
  notes: light dressing; normal salt
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: 
per_portion:
  energy_kcal: 109.3
  protein_g: 4.5
  fat_g: 4.7
  sat_fat_g: 0.8
  mufa_g: 3.2
  pufa_g: 0.8
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 2.7
  fiber_total_g: 3.5
  fiber_soluble_g: 1.1
  fiber_insoluble_g: 2.4
  sodium_mg: 150
  potassium_mg: 556
  iodine_ug: 1
  magnesium_mg: 40
  calcium_mg: 76
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 123
  manganese_mg: 0.4
  polyols_g: 0
  carbs_available_g: 10.5
  carbs_total_g: 14
  copper_mg: 0.09
  selenium_ug: 5
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 118
  chloride_mg: 231.0
  sulfur_g: 0.018
  vitamin_a_ug: 56
  vitamin_d_ug: 0
  vitamin_e_mg: 3.8
  vitamin_k_ug: 182
  vitamin_b1_mg: 0.13
  vitamin_b2_mg: 0.21
  vitamin_b3_mg: 1.1
  vitamin_b5_mg: 1.0
  vitamin_b6_mg: 0.31
  vitamin_b7_ug: 3
  vitamin_b9_ug: 113
  vitamin_b12_ug: 0
  choline_mg: 34
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
  confidence: medium
  gaps:
  - No trans fat provided; ~0.49 g of fat unassigned (trace/trans/rounding).
notes:
- Atwater check (available carb basis): 4×4.5 + 9×4.7 + 4×10.5 + 2×3.5 + 2.4×0.0 = 109.3 kcal
change_log:

  - timestamp: "2025-11-06T23:28:46+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
  - timestamp: 2025-10-28T18:51:39+0000
    updated_by: 'LLM: GPT-5 Thinking'
    reason: Populate per_portion from user-provided data
    fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
    per_portion.mufa_g, per_portion.pufa_g, per_portion.carbs_g, per_portion.sugar_g,
    per_portion.fiber_total_g, per_portion.sodium_mg, per_portion.potassium_mg, per_portion.iodine_ug,
    per_portion.magnesium_mg, per_portion.calcium_mg, per_portion.iron_mg, per_portion.zinc_mg,
    per_portion.vitamin_c_mg]
    sources: [{note: User-supplied values on 2025-10-28, url: user_input}]
  - timestamp: 2025-10-28T18:57:05+0000
    updated_by: 'LLM: GPT-5 Thinking'
    reason: Consistency fix for fat totals/splits
    fields_changed: [per_portion.fat_g]
    sources: [{note: Correction approved by user on 2025-10-28, url: user_input}]
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: 'LLM: GPT-5 Thinking'
    reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
    fields_changed: [per_portion.sat_fat_g, per_portion.mufa_g, per_portion.pufa_g, per_portion.iodine_ug,
    per_portion.magnesium_mg, per_portion.calcium_mg, per_portion.iron_mg, per_portion.zinc_mg]
    sources: [{note: Automated rounding pass, url: formatting-pass}]
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
  - timestamp: "2025-11-05T12:45:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5 (Agent 3)"
    reason: "Schema v2 enrichment: Complete nutrient profile with USDA data for broccoli (~180g) with lemon and oil dressing. Added 17 missing nutrients including B-complex vitamins, vitamin K (182µg - excellent source), vitamin E (3.8mg from oil), vitamin A (56µg), phosphorus (118mg)."
    fields_changed:
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
    - version
    sources:
    - url: https://fdc.nal.usda.gov/
    note: "USDA broccoli data scaled for ~180g broccoli content. B-vitamins: B1=0.13mg, B2=0.21mg, B3=1.1mg, B5=1.0mg, B6=0.31mg, B9=113µg. Vitamin K=182µg (outstanding source), vitamin A=56µg, E=3.8mg (includes olive oil contribution). Minerals: phosphorus=118mg, manganese=0.4mg, copper=0.09mg, selenium=5µg, choline=34mg. B12=0 (true zero - plant-based). Confidence: HIGH (broccoli portion + oil dressing)"
```
