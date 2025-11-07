## Grilled Chicken Breast (L'ETO Soho)

```yaml
id: grilled_chicken_breast_leto_soho_v1
version: 3
schema_version: 2
last_verified: "2025-11-02"
source:
  venue: L'ETO Caffe, Soho, London
  menu_page: https://deliveroo.co.uk/menu/london/soho/l-eto-caffe-soho
  evidence:
  - "Deliveroo listing: 135 kcal"
  - "Component-based: 86g cooked chicken breast scaled from USDA profile"
  - Finishing salt per skill salt_scheme (0.5% of weight)
aliases:
- Chicken Breast
category: side
portion:
  description: restaurant portion
  est_weight_g: 86
  notes: Plain grilled chicken breast, no sauce
assumptions:
  salt_scheme: normal
  oil_type: minimal or none
  prep: grilled, no skin, finishing salt 0.5% of weight (0.43g salt)
per_portion:
  energy_kcal: 135.6
  protein_g: 27.6
  fat_g: 2.8
  sat_fat_g: 0.9
  mufa_g: 1.1
  pufa_g: 0.7
  trans_fat_g: 0.0
  cholesterol_mg: 100
  sugar_g: 0.0
  fiber_total_g: 0.0
  fiber_soluble_g: 0.0
  fiber_insoluble_g: 0.0
  sodium_mg: 212
  potassium_mg: 295
  iodine_ug: 4
  magnesium_mg: 27
  calcium_mg: 15
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 0
  manganese_mg: 0
  copper_mg: 0.04
  polyols_g: 0.0
  carbs_available_g: 0.0
  carbs_total_g: 0.0
  selenium_ug: 24
  chromium_ug: 2
  molybdenum_ug: 1
  phosphorus_mg: 196
  chloride_mg: 326.0
  sulfur_g: 0.276
  vitamin_a_ug: 4
  vitamin_d_ug: 0.1
  vitamin_e_mg: 0.23
  vitamin_k_ug: 0.6
  vitamin_b1_mg: 0.06
  vitamin_b2_mg: 0.10
  vitamin_b3_mg: 11.8
  vitamin_b5_mg: 1.08
  vitamin_b6_mg: 0.55
  vitamin_b7_ug: 3
  vitamin_b9_ug: 3
  vitamin_b12_ug: 0.29
  choline_mg: 73
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.01
  omega6_la_g: 0.52
  boron_mg: 0.01
  silicon_mg: 0.1
  vanadium_ug: 0.1
  nickel_ug: 0.1
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
  finishing_salt_g: 0.43
  fat_unassigned_g: 0.1
quality:
  confidence: high
  gaps:
  - Copper estimated from USDA chicken breast values (HIGH confidence)
notes:
- 135 kcal from Deliveroo
- 86g portion calculated from USDA 157 kcal/100g profile
- Plain chicken has zero carbs
- "Atwater check (available carb basis): 4×27.6 + 9×2.8 + 4×0.0 + 2×0.0 + 2.4×0.0 = 135.6 kcal"
change_log:

  - timestamp: "2025-11-06T23:28:46+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.01 (animal)."
- timestamp: 2025-10-29 12:00:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Initial population from Deliveroo calorie count + reference macros from Whataburger
  fields_changed:
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.trans_fat_g
  - per_portion.cholesterol_mg
  - per_portion.carbs_g
  - per_portion.sugar_g
  - per_portion.fiber_total_g
  - per_portion.fiber_soluble_g
  - per_portion.fiber_insoluble_g
  - per_portion.sodium_mg
  - per_portion.potassium_mg
  - per_portion.iodine_ug
  - per_portion.magnesium_mg
  - per_portion.calcium_mg
  - per_portion.iron_mg
  - per_portion.zinc_mg
  - per_portion.vitamin_c_mg
  - per_portion.manganese_mg
  - portion.est_weight_g
  sources:
  - url: https://deliveroo.co.uk/menu/london/soho/l-eto-caffe-soho
    note: "L'ETO Caffe Soho Deliveroo listing: 135 kcal"
  - url: https://www.mynetdiary.com/food/calories-in-grilled-chicken-breast-by-whataburger-serving-34958765-0.html
    note: "Whataburger grilled chicken breast: 135 kcal, 24g protein, 2g carbs, 2.5g fat"
  - url: https://fdc.nal.usda.gov/
    note: "USDA FoodData Central: chicken breast micronutrients (potassium 320mg, magnesium 27mg, zinc 1mg, iron 1mg, cholesterol ~70mg per 100g)"
- timestamp: 2025-10-29 12:30:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Corrected values based on GPT-5 component analysis with precise portion weight (86g) and proper salt accounting
  fields_changed:
  - version
  - portion.est_weight_g
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.cholesterol_mg
  - per_portion.carbs_g
  - per_portion.sodium_mg
  - per_portion.potassium_mg
  - assumptions.salt_scheme
  - assumptions.prep
  - derived.energy_from_macros_kcal
  - derived.finishing_salt_g
  - derived.fat_unassigned_g
  - quality.confidence
  sources:
  - url: https://tools.myfooddata.com/nutrition-facts/100009715/100g
    note: "MyFoodData chicken breast cooked: scaled to 86g to match 135 kcal anchor"
- timestamp: "2025-11-02T19:20:00+00:00"
  updated_by: "LLM: GPT-5 Codex"
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed:
  - derived.energy_from_macros_kcal
  - last_verified
  - notes
  - per_portion.carbs_available_g
  - per_portion.carbs_g
  - per_portion.carbs_total_g
  - per_portion.energy_kcal
  - per_portion.polyols_g
  - version
  sources: []
- timestamp: '2025-11-05T17:00:00+00:00'
  updated_by: 'Agent 2: Claude Code (Sonnet 4.5)'
  reason: 'Phase 3 enrichment: Added complete USDA nutrient data for 21 migrated fields'
  fields_changed: [selenium_ug, chromium_ug, molybdenum_ug, phosphorus_mg, chloride_mg, sulfur_mg, vitamin_a_ug, vitamin_d_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b7_ug, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_epa_mg, omega3_dha_mg, omega3_ala_g, omega6_la_g, boron_mg, silicon_mg, vanadium_ug, nickel_ug]
  sources: [{note: 'USDA FDC #171477 (chicken breast cooked): B vitamins (B3 13.7mg/100g, B5 1.26mg/100g, B6 0.64mg/100g, B12 0.34µg/100g), selenium 27.6µg/100g, phosphorus 228mg/100g, choline 85.3mg/100g, vitamin E 0.27mg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'Values scaled to 86g portion: plain grilled chicken breast with minimal oil and finishing salt (0.43g salt = 172mg sodium)', url: component_analysis}]
```
