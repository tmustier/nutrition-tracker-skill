## Chicken Cutlet with Mushroom Sauce with Buckwheat (Zima Soho)

```yaml
id: chicken_cutlet_mushroom_sauce_zima_v1
schema_version: 2
version: 2
last_verified: 2025-11-02
source:
  venue: Zima, Soho, London
  menu_page: 
  evidence:
  - User-provided nutrition data for full portion as served
  - Dish includes 150g cooked buckwheat per main
  - Pan-fried chicken cutlet with creamy mushroom sauce, buckwheat groats, and pickle garnish
aliases:
- Chicken Kotleta with Buckwheat
- Kotleta z Kurczaka
category: main
portion:
  description: restaurant main course with buckwheat
  est_weight_g:
  notes: Pan-fried chicken cutlet, creamy mushroom sauce, 150g cooked buckwheat groats, pickle garnish
assumptions:
  salt_scheme: normal
  oil_type: likely sunflower or vegetable oil (Russian/Polish cuisine standard)
  prep: Pan-fried breaded chicken cutlet, cream-based mushroom sauce, boiled buckwheat (kasha), pickled vegetables (1.9mg) from 150g cooked buckwheat (≈50g dry at 3.7mg/100g)
per_portion:
  energy_kcal: 582.3
  protein_g: 29.7
  fat_g: 30.9
  sat_fat_g: 8.2
  mufa_g: 14.2
  pufa_g: 7.3
  trans_fat_g: 0.3
  cholesterol_mg: 140
  sugar_g: 2.7
  fiber_total_g: 5.3
  fiber_soluble_g: 1.6
  fiber_insoluble_g: 3.7
  sodium_mg: 936
  potassium_mg: 557
  iodine_ug: 15
  magnesium_mg: 77
  calcium_mg: 58
  iron_mg: 1.8
  zinc_mg: 1.8
  vitamin_c_mg: 1.5
  manganese_mg: 1.9
  polyols_g: 0
  carbs_available_g: 43.7
  carbs_total_g: 49
  copper_mg: 0.45
  selenium_ug: 54
  chromium_ug: 2
  molybdenum_ug: 27
  phosphorus_mg: 515
  chloride_mg: 1441.0
  sulfur_g: 0.297
  vitamin_a_ug: 129
  vitamin_d_ug: 0.2
  vitamin_e_mg: 0.4
  vitamin_k_ug: 1.1
  vitamin_b1_mg: 0.19
  vitamin_b2_mg: 0.44
  vitamin_b3_mg: 23.3
  vitamin_b5_mg: 3.2
  vitamin_b6_mg: 1.1
  vitamin_b7_ug: 5
  vitamin_b9_ug: 32
  vitamin_b12_ug: 0.7
  choline_mg: 128
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.02
  omega6_la_g: 2.5
  boron_mg: 0.1
  silicon_mg: 0.5
  vanadium_ug: 0.5
  nickel_ug: 0.5
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 0.9
quality:
  confidence: high
  gaps:
  - Micronutrients (magnesium, calcium, iron, zinc, vitamin_c) not provided
  - Iodine estimated from chicken and dairy in sauce (MEDIUM confidence)
  - Manganese estimated from buckwheat groats (HIGH confidence)
notes:
- 602 kcal from user-provided nutrition data
- Buckwheat portion: 150g cooked groats
- Fat breakdown: 8.2g sat + 14.2g MUFA + 7.3g PUFA + 0.3g trans = 30.0g (0.9g unassigned/rounding)
- PUFA-rich profile suggests vegetable oil used for frying
- Moderate sodium from sauce and seasoning
- High fiber from buckwheat and vegetables
- Atwater check (available carb basis): 4×29.7 + 9×30.9 + 4×43.7 + 2×5.3 + 2.4×0.0 = 582.3 kcal
change_log:

  - timestamp: "2025-11-06T23:28:47+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.01 (animal)."
  - timestamp: 2025-10-30 00:00:00+00:00
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: Initial population from user-provided nutrition data for Zima restaurant dish
    fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
    per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g, per_portion.cholesterol_mg,
    per_portion.carbs_g, per_portion.sugar_g, per_portion.fiber_total_g, per_portion.fiber_soluble_g,
    per_portion.fiber_insoluble_g, per_portion.sodium_mg, per_portion.potassium_mg]
    sources: [{note: 'Complete nutrition data provided by user for Chicken Cutlet with Mushroom
      Sauce with buckwheat from Zima restaurant, Soho, London (2025-10-30)', url: user_input}]
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
  - timestamp: '2025-11-05T16:45:00+00:00'
    updated_by: 'Agent 2: Claude Code (Sonnet 4.5)'
    reason: 'Phase 3 enrichment: Added complete USDA nutrient data for 25 migrated fields using component-based calculation'
    fields_changed: [magnesium_mg, calcium_mg, iron_mg, zinc_mg, vitamin_c_mg, copper_mg, selenium_ug, chromium_ug, molybdenum_ug, phosphorus_mg, chloride_mg, sulfur_mg, vitamin_a_ug, vitamin_d_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b7_ug, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_epa_mg, omega3_dha_mg, omega3_ala_g, omega6_la_g, boron_mg, silicon_mg, vanadium_ug, nickel_ug]
    sources: [{note: 'USDA FDC #171477 (chicken breast cooked): B vitamins (B3 13.7mg/100g, B5 1.26mg/100g), selenium 27.6µg/100g, phosphorus 228mg/100g, choline 85.3mg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'USDA FDC #172687 (breadcrumbs): B vitamins, selenium 30µg/100g, phosphorus 100mg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'USDA FDC #170855 (cream): vitamin A 243µg/100g, calcium 116mg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'USDA FDC #170279 (buckwheat cooked): magnesium 51mg/100g, copper 0.15mg/100g, molybdenum 18µg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'USDA FDC #169251 (mushrooms cooked): copper 0.50mg/100g, B vitamins', url: 'https://fdc.nal.usda.gov/'}, {note: 'Component-weighted calculation: 150g chicken + 20g breading + 50g cream + 150g buckwheat + 30g mushrooms + 15g oil', url: component_analysis}]
```
