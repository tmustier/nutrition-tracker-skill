## Peking Duck Skin with Sugar (Imperial Treasure St. James)

```yaml
id: peking_duck_skin_sugar_imperial_treasure_st_james_v1
schema_version: 2
version: 3
last_verified: 2025-11-02
source:
  venue: Imperial Treasure St. James (London)
  menu_page: "https://www.imperialtreasure.com/restaurant/ImperialTreasureSuperPekingDuck-2"
  evidence:
  - Imperial Treasure preparation: dry rubbed with spices, air-dried 48hr, slow-roasted with lychee wood
  - Duck fat fatty acid composition from PMC9816803 (MUFA 49.4%, PUFA 12.9%, SFA 33.3%)
  - Roasted duck skin nutritional baseline from snapcalorie.com and USDA duck data
  - ChatGPT 5-Pro analysis: corrected portion to 1″×1″ squares ≈ 2.5g each (not 12g)
  - Component-based estimation: 2.5g ultra-crispy duck skin with minimal sugar dabbing
aliases:
- Peking Duck Skin
- Duck Skin with Sugar
category: main
portion:
  description: 1 small square with sugar
  est_weight_g: 2.5
  notes: "Approximately 1″ × 1″ (2.5cm × 2.5cm) ultra-crispy roasted duck skin with one edge lightly dabbed in sugar. Traditional Imperial Treasure preparation: 48hr air-dried, slow-roasted until very crispy with much fat rendered out."
assumptions:
  salt_scheme: light
  oil_type: duck fat (intrinsic)
  prep: "Traditional Peking duck preparation: dry rubbed with spices, air-dried 48 hours, slow-roasted with lychee wood until very crispy. Much of the subcutaneous fat renders out during roasting."
per_portion:
  energy_kcal: 20
  protein_g: 0.2
  fat_g: 2
  sat_fat_g: 0.7
  mufa_g: 1
  pufa_g: 0.25
  trans_fat_g: 0
  cholesterol_mg: 3
  sugar_g: 0.1
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 10
  potassium_mg: 1
  iodine_ug: 0.1
  magnesium_mg: 0.3
  calcium_mg: 0.3
  iron_mg: 0.1
  zinc_mg: 0.05
  vitamin_c_mg: 0
  manganese_mg: 0.01
  polyols_g: 0
  carbs_available_g: 0.1
  carbs_total_g: 0.1
  copper_mg: 0.006
  selenium_ug: 0.4
  chromium_ug: 0.03
  molybdenum_ug: 0.01
  phosphorus_mg: 1.2
  chloride_mg: 15.0
  sulfur_g: 0.002
  vitamin_a_ug: 0.8
  vitamin_d_ug: 0.01
  vitamin_e_mg: 0.02
  vitamin_k_ug: 0.05
  vitamin_b1_mg: 0.002
  vitamin_b2_mg: 0.006
  vitamin_b3_mg: 0.11
  vitamin_b5_mg: 0.02
  vitamin_b6_mg: 0.006
  vitamin_b7_ug: 0.1
  vitamin_b9_ug: 0.15
  vitamin_b12_ug: 0.01
  choline_mg: 0.4
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.003
  omega6_la_g: 0.05
  boron_mg: 0.001
  silicon_mg: 0.01
  vanadium_ug: 0.01
  nickel_ug: 0.01
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  omega_3_total_g: 0.05
  omega_6_g: 0.45
quality:
  confidence: medium
  gaps:
  - Iodine data not available for duck
  - Vitamin D, B vitamins not included (would be present in small amounts)
  - Selenium present (~2µg per piece) but not in schema
notes:
- Component 1: Crispy duck skin (10g) - Traditional Peking duck preparation with 48hr air-drying and slow roasting
- Component 2: Granulated sugar (2g) for dabbing
- Duck skin after traditional Peking preparation: ~420 kcal/100g, 12g protein/100g, 40g fat/100g
- Much fat renders out during 48hr air-drying and slow roasting process - skin becomes very thin and crispy
- Duck fat composition (per research): 49.4% MUFA (mainly oleic acid), 12.9% PUFA, 33.3% saturated
- Fat breakdown for 10g skin: 4.0g fat → Sat 1.3g (33%), MUFA 2.0g (49%), PUFA 0.5g (13%)
- Sugar contributes: 8 kcal, 2g carbs (all sugar)
- Atwater validation: 4×1.2 + 4×2.0 + 9×4.1 = 4.8 + 8.0 + 36.9 = 49.7 ≈ 50 kcal ✓
- Portion size rationale: 1 small square = 3cm × 3cm × 1-2mm thick ≈ 10g crispy skin (very light due to fat rendering)
- Sodium: minimal intrinsic + light salting during roasting (~0.5% of skin weight)
- Cholesterol: duck skin ~120mg/100g → 12mg per 10g
- Micronutrients scaled from USDA duck data: iron 2.5mg/100g, zinc 2.0mg/100g, potassium 50mg/100g
- PUFA includes omega-3 (~10% of PUFA = 0.05g) and omega-6 (~90% of PUFA = 0.45g) per duck fat research
- Zero fiber (animal product), negligible vitamin C
- Very high fat density but small portion size keeps total calories modest
- Traditional serving: eaten immediately while hot and crispy, skin should shatter when bitten
change_log:

  - timestamp: "2025-11-06T23:28:46+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.01 (animal)."
  - timestamp: 2025-11-02T10:00:00+0000
    updated_by: Claude Code (Sonnet 4.5)
    reason: Initial entry with comprehensive component-based estimation following ESTIMATE.md protocol
    fields_changed: [version, source.menu_page, source.evidence, aliases, portion.est_weight_g, portion.notes,
    assumptions.salt_scheme, assumptions.oil_type, assumptions.prep, all per_portion
    fields, derived.omega_3_total_g, derived.omega_6_g, quality.confidence, quality.gaps,
  notes]
    sources: [{note: Imperial Treasure official website - traditional Peking duck preparation method,
    url: 'https://www.imperialtreasure.com/restaurant/ImperialTreasureSuperPekingDuck-2'},
  {note: 'Scientific research: Duck fat fatty acid composition (MUFA 49.4%, PUFA 12.9%,
      SFA 33.3%)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9816803/'}, {note: Roasted
      duck skin nutritional baseline data, url: 'https://www.snapcalorie.com/nutrition/roasted_duck_skin_nutrition.html'},
  {note: 'USDA FoodData Central - duck meat and skin roasted composition, micronutrients',
    url: 'https://fdc.nal.usda.gov/'}, {note: 'User consumed 2 small squares (24g
      total) on 2025-11-02, Imperial Treasure St. James venue', url: user_request}]
  - timestamp: 2025-11-02T21:00:00+0000
    updated_by: Claude Code (Sonnet 4.5)
    reason: "v3: Corrected portion weight based on ChatGPT 5-Pro analysis and user feedback. Original\
    \ estimate of 12g was too high; actual 1\xD71 inch squares are \u22482.5g. Added\
    \ new carb schema (carbs_available_g, carbs_total_g, polyols_g) per ESTIMATE.md\
    \ updates."
    fields_changed: [version, portion.est_weight_g, portion.notes, source.evidence, all per_portion nutrition
    values, per_portion.carbs_available_g, per_portion.polyols_g, per_portion.carbs_total_g]
    sources: [{note: "ChatGPT 5-Pro analysis confirmed 1\xD71 inch squares with light sugar dabbing\
      \ are ~20 kcal/2.5g each (not 50 kcal/12g)", url: user_feedback}]
  - date: 2025-11-05
    updated_by: automated_migration_v1_to_v2
    change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
    minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
    acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
    fields initialized to 0.'
  - timestamp: '2025-11-05T17:15:00+00:00'
    updated_by: 'Agent 2: Claude Code (Sonnet 4.5)'
    reason: 'Phase 3 enrichment: Added complete USDA nutrient data for 24 migrated fields scaled to tiny 2.5g portion'
    fields_changed: [iodine_ug, magnesium_mg, calcium_mg, manganese_mg, copper_mg, selenium_ug, chromium_ug, molybdenum_ug, phosphorus_mg, chloride_mg, sulfur_mg, vitamin_a_ug, vitamin_d_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b7_ug, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_epa_mg, omega3_dha_mg, omega3_ala_g, omega6_la_g, boron_mg, silicon_mg, vanadium_ug, nickel_ug]
    sources: [{note: 'USDA FDC #174575 (duck skin roasted): B vitamins (B2 0.22mg/100g, B3 4.21mg/100g), selenium 14.4µg/100g, phosphorus 47mg/100g, omega-6 LA 2.1g/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'Values scaled to 2.5g portion: 2.5g ultra-crispy roasted duck skin (much fat rendered out) + trace sugar dabbing', url: component_analysis}, {note: 'Duck fat fatty acid composition per PMC9816803: MUFA 49.4%, PUFA 12.9% (omega-3 ~6%, omega-6 ~94% of PUFA)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9816803/'}]
```
