## Cherry Vareniki - Full Tray (Zima, Soho)

```yaml
id: cherry_vareniki_zima_v1
schema_version: 2
version: 2
last_verified: 2025-11-02
source:
  venue: Zima, Soho, London
  menu_page: 
  evidence:
  - User-provided nutrition data for full tray (~200g)
aliases:
- Cherry dumplings
category: dessert
portion:
  description: full tray
  est_weight_g: 200
  notes: Traditional Ukrainian dumplings filled with cherries; sweet dessert dish
assumptions:
  salt_scheme: light
  oil_type: 
  prep: boiled dumplings with cherry filling
per_portion:
  energy_kcal: 388.2
  protein_g: 9
  fat_g: 5.8
  sat_fat_g: 1
  mufa_g: 2.5
  pufa_g: 2.3
  trans_fat_g: 0.1
  cholesterol_mg: 10
  sugar_g: 14
  fiber_total_g: 4
  fiber_soluble_g: 1
  fiber_insoluble_g: 3
  sodium_mg: 130
  potassium_mg: 200
  iodine_ug: 4
  magnesium_mg: 22
  calcium_mg: 30
  iron_mg: 3.9
  zinc_mg: 0.8
  vitamin_c_mg: 5
  manganese_mg: 0.6
  polyols_g: 0
  carbs_available_g: 73
  carbs_total_g: 77
  copper_mg: 0.2
  selenium_ug: 32
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 124
  chloride_mg: 200.0
  sulfur_g: 0.036
  vitamin_a_ug: 56
  vitamin_d_ug: 0.3
  vitamin_e_mg: 0.2
  vitamin_k_ug: 1.0
  vitamin_b1_mg: 0.6
  vitamin_b2_mg: 0.3
  vitamin_b3_mg: 4.7
  vitamin_b5_mg: 0.1
  vitamin_b6_mg: 0.1
  vitamin_b7_ug: 0
  vitamin_b9_ug: 148
  vitamin_b12_ug: 0.1
  choline_mg: 56
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.02
  omega6_la_g: 1.2
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_breakdown_sum_g: 5.9
  unsaturated_fat_g: 4.8
quality:
  confidence: medium
  gaps: []
notes:
- Full tray approximately 200g
- Sweet dessert dish from Zima restaurant featuring traditional Ukrainian cherry-filled dumplings
- Fat breakdown (sat 1.0g + MUFA 2.5g + PUFA 2.3g + trans 0.1g = 5.9g) matches total fat 5.8g within rounding
- Unsaturated total (MUFA + PUFA) = 4.8g as expected
- Atwater check (available carb basis): 4×9.0 + 9×5.8 + 4×73.0 + 2×4.0 + 2.4×0.0 = 388.2 kcal
change_log:

  - timestamp: "2025-11-06T23:28:47+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
  - timestamp: 2025-10-30 12:00:00+00:00
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: Initial creation from user-provided nutrition data for Cherry vareniki from Zima restaurant
    fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
    per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g, per_portion.cholesterol_mg,
    per_portion.carbs_g, per_portion.sugar_g, per_portion.fiber_total_g, per_portion.fiber_soluble_g,
    per_portion.fiber_insoluble_g, per_portion.sodium_mg, per_portion.potassium_mg,
    portion.est_weight_g]
    sources: [{note: 'User-provided nutrition data for Cherry vareniki from Zima restaurant, Soho,
      London (full tray ~200g)', url: ''}]
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
  - timestamp: '2025-11-05T18:15:00+00:00'
    updated_by: 'Claude Code (Sonnet 4.5) - Agent 1'
    reason: 'Enriched with complete nutrient data using component-based estimation (wheat dough ~130g + cherry filling ~70g). Populated 22 nutrients from 0 to estimated values based on USDA data for ingredients: enriched wheat flour (~80g), eggs (~15g), sweet cherries (~50g), sugar (~20g). Key nutrients added: magnesium (22 mg), calcium (30 mg), iron (3.9 mg), zinc (0.8 mg), vitamin C (5 mg), manganese (0.6 mg), copper (0.2 mg), selenium (32 mcg), phosphorus (124 mg), vitamin A (56 mcg), vitamin D (0.3 mcg), vitamin E (0.2 mg), vitamin K (1.0 mcg), B-vitamins (B1: 0.6 mg, B2: 0.3 mg, B3: 4.7 mg, B5: 0.1 mg, B6: 0.1 mg, B9: 148 mcg, B12: 0.1 mcg), choline (56 mg), iodine (4 mcg from egg), omega-3 ALA (0.02 g), omega-6 LA (1.2 g). Confidence: MEDIUM (±20-40% due to ingredient-based estimation).'
    fields_changed: [iodine_ug, magnesium_mg, calcium_mg, iron_mg, zinc_mg, vitamin_c_mg, manganese_mg, copper_mg, selenium_ug, phosphorus_mg, vitamin_a_ug, vitamin_d_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_ala_g, omega6_la_g]
    sources:
    - note: 'Component-based estimation: wheat flour (80g USDA enriched all-purpose), eggs (15g USDA FDC 171287), sweet cherries (50g USDA FDC 171719), sugar (20g)'
    url: 'https://fdc.nal.usda.gov/'
    confidence: 'MEDIUM - ingredient-based calculation'
```
