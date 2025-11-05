## Beef Stroganoff with Buckwheat (Zima Soho)

```yaml
id: beef_stroganoff_buckwheat_zima_v1
schema_version: 2
version: 2
last_verified: 2025-11-02
source:
  venue: Zima, Soho, London
  menu_page: 
  evidence:
  - User-provided nutrition data: 562 kcal, 37.2g protein, 36.7g carbs, 28.9g fat per full portion
  - Dish includes 150g cooked buckwheat groats per main
  - Pan-fried beef in creamy sauce with buckwheat and pickle garnish
  - Russian/Eastern European style stroganoff with sour cream sauce
aliases:
- Beef Stroganoff
category: main
portion:
  description: restaurant main portion
  est_weight_g:
  notes: Pan-fried beef strips in creamy sauce, served with 150g cooked buckwheat groats and pickle slices
assumptions:
  salt_scheme: normal
  oil_type: butter or neutral oil
  prep: Pan-fried beef strips in sour cream-based sauce, buckwheat groats cooked separately, garnished with pickles Manganese (1.9mg) from 150g cooked buckwheat (≈50g dry at 3.7mg/100g)
per_portion:
  energy_kcal: 565.3
  protein_g: 37.2
  fat_g: 28.9
  sat_fat_g: 12.2
  mufa_g: 10.2
  pufa_g: 2.8
  trans_fat_g: 0.4
  cholesterol_mg: 115
  sugar_g: 2.7
  fiber_total_g: 4.8
  fiber_soluble_g: 1.5
  fiber_insoluble_g: 3.3
  sodium_mg: 806
  potassium_mg: 557
  iodine_ug: 28
  magnesium_mg: 77
  calcium_mg: 58
  iron_mg: 3.2
  zinc_mg: 5.4
  vitamin_c_mg: 1.8
  manganese_mg: 1.9
  polyols_g: 0
  carbs_available_g: 36.7
  carbs_total_g: 41.5
  copper_mg: 0.47
  selenium_ug: 39
  chromium_ug: 2
  molybdenum_ug: 27
  phosphorus_mg: 408
  chloride_mg: 800
  sulfur_g: 0.37
  vitamin_a_ug: 224
  vitamin_d_ug: 0.3
  vitamin_e_mg: 0.7
  vitamin_k_ug: 2.9
  vitamin_b1_mg: 0.14
  vitamin_b2_mg: 0.51
  vitamin_b3_mg: 8.0
  vitamin_b5_mg: 2.0
  vitamin_b6_mg: 0.66
  vitamin_b7_ug: 4
  vitamin_b9_ug: 31
  vitamin_b12_ug: 3.3
  choline_mg: 85
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.02
  omega6_la_g: 0.36
  boron_mg: 0.1
  silicon_mg: 0.5
  vanadium_ug: 0.5
  nickel_ug: 0.5
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 3.3
quality:
  confidence: high
  gaps:
  - Micronutrients (magnesium, calcium, iron, zinc, vitamin_c) not provided
  - Iodine estimated from beef and sour cream in sauce (MEDIUM confidence)
  - Manganese estimated from buckwheat groats (HIGH confidence)
notes:
- Fat split: sat(12.2) + trans(0.4) + MUFA(10.2) + PUFA(2.8) = 25.6g; total fat 28.9g leaves 3.3g unassigned
- Includes 150g cooked buckwheat per portion
- High protein from beef, moderate fat from sour cream sauce
- Trans fat likely from dairy (natural ruminant TFAs)
- Atwater check (available carb basis): 4×37.2 + 9×28.9 + 4×36.7 + 2×4.8 + 2.4×0.0 = 565.3 kcal
change_log:
- timestamp: 2025-10-30 00:00:00+00:00
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Initial entry from user-provided complete nutrition data for Zima Soho Beef Stroganoff
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
  per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g, per_portion.cholesterol_mg,
  per_portion.carbs_g, per_portion.sugar_g, per_portion.fiber_total_g, per_portion.fiber_soluble_g,
  per_portion.fiber_insoluble_g, per_portion.sodium_mg, per_portion.potassium_mg]
  sources: [{note: User-provided nutrition data for Zima Soho Beef Stroganoff with buckwheat
      on 2025-10-30, url: user_input}]
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
- timestamp: '2025-11-05T16:30:00+00:00'
  updated_by: 'Agent 2: Claude Code (Sonnet 4.5)'
  reason: 'Phase 3 enrichment: Added complete USDA nutrient data for 25 migrated fields using component-based calculation'
  fields_changed: [magnesium_mg, calcium_mg, iron_mg, zinc_mg, vitamin_c_mg, copper_mg, selenium_ug, chromium_ug, molybdenum_ug, phosphorus_mg, chloride_mg, sulfur_mg, vitamin_a_ug, vitamin_d_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b7_ug, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_epa_mg, omega3_dha_mg, omega3_ala_g, omega6_la_g, boron_mg, silicon_mg, vanadium_ug, nickel_ug]
  sources: [{note: 'USDA FDC #174032 (beef loin cooked): B vitamins (B12 2.64µg/100g), selenium 26.5µg/100g, phosphorus 213mg/100g, zinc 4.5mg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'USDA FDC #170855 (sour cream): vitamin A 243µg/100g, calcium 116mg/100g, B2, B5, B12', url: 'https://fdc.nal.usda.gov/'}, {note: 'USDA FDC #170279 (buckwheat cooked): magnesium 51mg/100g, copper 0.15mg/100g, molybdenum 18µg/100g, phosphorus 70mg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'USDA FDC #169251 (mushrooms cooked): B vitamins, copper 0.50mg/100g, selenium 12.3µg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'Component-weighted calculation: 120g beef + 50g sour cream + 150g buckwheat + 30g mushrooms + 15g butter', url: component_analysis}]
```
