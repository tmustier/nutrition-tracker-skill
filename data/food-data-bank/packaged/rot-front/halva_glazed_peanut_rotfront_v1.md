## Rot Front Glazed Peanut Halva (1 piece, ~25g)

```yaml
id: halva_glazed_peanut_rotfront_v1
schema_version: 2
version: 3
last_verified: 2025-11-05
source:
  venue: Rot Front
  menu_page: 
  evidence:
  - FatSecret — Рот Фронт Халва глазированная, per-piece entry (25g)
  - FatSecret — 100g entry shows 530 kcal; P14g; F32g; C44g; fibre 5.6g
  - Parma.am product page: peanut base 44%, glaze 30%; 528 kcal/100g
  - Generic halva datasets for mineral scaling (FitAudit, FoodStruct)
aliases:
- Халва глазированная
- Glazed Halva
category: dessert
portion:
  description: 1 piece (~25g)
  est_weight_g: 25
  notes: Individual wrapped piece; actual weight varies 23-27g per ChatGPT analysis
assumptions:
  salt_scheme: normal
  oil_type: peanut-based halva with confectioner's chocolate glaze
  prep: Commercial halva; peanut mass ~44% + chocolate glaze ~30%
  usda_scaling: Priority nutrients sourced from USDA FoodData Central "Candies, sesame crunch" (FDC ID 169588); scaled from per-100g to 25g portion
per_portion:
  energy_kcal: 135.1
  protein_g: 3.5
  fat_g: 8.25
  sat_fat_g: 1.4
  mufa_g: 3
  pufa_g: 3.85
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 9.4
  fiber_total_g: 1.4
  fiber_soluble_g: 0.2
  fiber_insoluble_g: 1.2
  sodium_mg: 50
  potassium_mg: 75
  iodine_ug: 0
  magnesium_mg: 55
  calcium_mg: 8
  iron_mg: 1.1
  zinc_mg: 1.1
  vitamin_c_mg: 0
  manganese_mg: 0.4
  polyols_g: 0
  carbs_available_g: 11
  carbs_total_g: 12.4
  copper_mg: 0.24
  selenium_ug: 1
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 103
  chloride_mg: 0
  sulfur_g: 0
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0.04
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.11
  vitamin_b2_mg: 0.04
  vitamin_b3_mg: 0.93
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0.12
  vitamin_b7_ug: 0
  vitamin_b9_ug: 12.75
  vitamin_b12_ug: 0
  choline_mg: 4.18
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
  - MUFA/PUFA estimated from typical halva FA profile
  - Soluble/insoluble fiber split from peanut ratios (~94% insoluble)
  - Minerals scaled from generic halva datasets
  - Potassium range 50-100mg
  - Vitamin C not available
notes:
- Branded per-piece nutrition from FatSecret: 133 kcal, 8.25g fat (1.4g sat), 11g carbs, 9.35g sugar, 3.5g protein
- 100g macros cluster: 528-560 kcal, 32-33g fat, 44-48g carbs, 14g protein across multiple sources
- Fibre 5.6g/100g → 1.4g/25g; split using peanut profile (94% insoluble / 6% soluble)
- MUFA/PUFA split (3.0g / 3.85g) constrained so SFA+MUFA+PUFA = total fat; typical of peanut-based halva
- Minerals scaled from generic halva composition (FitAudit): K~187mg/100g, Mg~218mg/100g, Ca~33mg/100g
- Sodium ~195mg/100g in generic halva → ~49mg/25g, rounded to 50mg
- Ingredients: peanut mass 44%, confectioner's chocolate glaze 30% (varies by batch)
- Atwater check (available carb basis): 4×3.5 + 9×8.2 + 4×11.0 + 2×1.4 + 2.4×0.0 = 135.1 kcal
change_log:
- timestamp: 2025-10-30T19:35:00+0000
  updated_by: Claude Code (via ChatGPT estimation)
  reason: Initial entry with ChatGPT nutrition analysis cross-checked against multiple databases
  fields_changed: [all fields]
  sources: [{note: FatSecret branded and generic halva entries, url: 'https://www.fatsecret.com/calories-nutrition/generic/halva'},
  {note: Parma.am product page with ingredient breakdown, url: 'https://parma.am/en/product/rot-front-glazed-halva-2/'},
  {note: FitAudit generic halva mineral composition, url: 'https://fitaudit.ru/food/halva'}]
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
- timestamp: '2025-11-05T00:00:00+00:00'
  updated_by: Claude Code (USDA enrichment)
  reason: 'Enriched with 14 priority nutrients from USDA FoodData Central'
  fields_changed: [version, last_verified, per_portion.phosphorus_mg, per_portion.copper_mg, per_portion.selenium_ug, per_portion.manganese_mg, per_portion.vitamin_e_mg, per_portion.vitamin_b1_mg, per_portion.vitamin_b2_mg, per_portion.vitamin_b3_mg, per_portion.vitamin_b6_mg, per_portion.vitamin_b9_ug, per_portion.choline_mg, assumptions.usda_scaling]
  sources: [{note: 'USDA FoodData Central: Candies, sesame crunch (FDC ID 169588)', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/169588/nutrients'}]
  notes: 'Nutrients scaled from per-100g to 25g portion. Not available in USDA data: iodine, vitamin A, vitamin D, vitamin K, vitamin B12, omega-3 EPA, omega-3 DHA (remain at 0).'
```
