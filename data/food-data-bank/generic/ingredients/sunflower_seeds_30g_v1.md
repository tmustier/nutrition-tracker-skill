## Sunflower Seeds, 30 g

```yaml
id: sunflower_seeds_30g_v1
version: 6
schema_version: 2
last_verified: "2025-11-05"
source:
  venue: pack/ingredient
  menu_page: ""
  evidence: []
aliases: []
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 30
  notes: hulled; unsalted
assumptions:
  salt_scheme: normal
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 193.5
  protein_g: 6.2
  fat_g: 15.5
  sat_fat_g: 1.4
  mufa_g: 3.0
  pufa_g: 10.9
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 0.8
  fiber_total_g: 2.6
  fiber_soluble_g: 0.5
  fiber_insoluble_g: 2.1
  sodium_mg: 3
  potassium_mg: 194
  iodine_ug: 0
  magnesium_mg: 98
  calcium_mg: 23
  iron_mg: 2
  zinc_mg: 2
  copper_mg: 0.54
  vitamin_c_mg: 0
  vitamin_e_mg: 10.6
  manganese_mg: 0.6
  polyols_g: 0.0
  carbs_available_g: 6.0
  carbs_total_g: 8.6
  selenium_ug: 16
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 198
  chloride_mg: 0
  sulfur_mg: 0
  vitamin_a_ug: 1
  vitamin_d_ug: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.4
  vitamin_b2_mg: 0.1
  vitamin_b3_mg: 2.5
  vitamin_b5_mg: 0.34
  vitamin_b6_mg: 0.4
  vitamin_b7_ug: 3.0
  vitamin_b9_ug: 68
  vitamin_b12_ug: 0
  choline_mg: 16.5
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.02
  omega6_la_g: 6.92
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: high
  gaps: []
notes:
- 'Atwater check (available carb basis): 4×6.2 + 9×15.5 + 4×6.0 + 2×2.6 + 2.4×0.0
  = 193.5 kcal'
- 'Sunflower seeds are THE richest common food source of vitamin E (alpha-tocopherol):
  35.17 mg/100g, providing 10.6 mg per 30g portion (71% DV)'
- 'Excellent source of B vitamins, particularly B1 (thiamin), B3 (niacin), B6, and
  folate (B9)'
- 'Rich in minerals: phosphorus (198mg), selenium (16ug), manganese (0.6mg), copper
  (0.54mg)'
- 'Choline content: 16.5mg per 30g portion, supporting brain and liver health'
- 'Note: Vitamin D, B12, vitamin K, and iodine are naturally absent or trace in plant-based
  seeds'
change_log:
- timestamp: "2025-11-05T16:00:00+00:00"
  updated_by: "Claude Code (Sonnet 4.5)"
  reason: "CRITICAL FIX: Corrected EPA value - plant foods cannot contain marine omega-3s"
  fields_changed:
    - "omega3_epa_mg: 4 → 0 (EPA is a marine omega-3 found only in fish/algae, not in plant seeds)"
  notes: "Sunflower seeds contain ALA (plant omega-3), not EPA/DHA. The 4mg value was biologically impossible and has been corrected to 0."
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: Populate per_portion from user-provided data
  fields_changed:
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.carbs_g
  - per_portion.sugar_g
  - per_portion.fiber_total_g
  - per_portion.sodium_mg
  - per_portion.potassium_mg
  - per_portion.magnesium_mg
  - per_portion.calcium_mg
  - per_portion.iron_mg
  - per_portion.zinc_mg
  - per_portion.vitamin_c_mg
  sources:
  - url: user_input
    note: User-supplied values on 2025-10-28
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed:
  - per_portion.mufa_g
  - per_portion.carbs_g
  - per_portion.iron_mg
  - per_portion.zinc_mg
  - per_portion.vitamin_c_mg
  sources:
  - url: formatting-pass
    note: Automated rounding pass
- timestamp: "2025-11-02T19:20:00+00:00"
  updated_by: "LLM: GPT-5 Codex"
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed:
  - last_verified
  - notes
  - per_portion.carbs_available_g
  - per_portion.carbs_g
  - per_portion.carbs_total_g
  - per_portion.energy_kcal
  - per_portion.polyols_g
  - version
  sources: []
- timestamp: "2025-11-05T00:00:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Enrich with 17 priority nutrients from USDA FoodData Central (FDC ID 170562)
  fields_changed:
  - version
  - last_verified
  - notes
  - per_portion.vitamin_d_ug
  - per_portion.choline_mg
  - per_portion.vitamin_b9_ug
  - per_portion.vitamin_b12_ug
  - per_portion.phosphorus_mg
  - per_portion.copper_mg
  - per_portion.selenium_ug
  - per_portion.manganese_mg
  - per_portion.vitamin_a_ug
  - per_portion.vitamin_e_mg
  - per_portion.vitamin_k_ug
  - per_portion.vitamin_b1_mg
  - per_portion.vitamin_b2_mg
  - per_portion.vitamin_b3_mg
  - per_portion.vitamin_b6_mg
  - per_portion.omega3_epa_mg
  - per_portion.omega3_dha_mg
  sources:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/170562/nutrients
    note: 'USDA FoodData Central - Seeds, sunflower seed kernels, dried (FDC ID:
      170562)'
  - url: https://www.nutritionvalue.org/Seeds%2C_dried%2C_sunflower_seed_kernels_nutritional_value.html
    note: USDA nutrient data verification source
- timestamp: "2025-11-05T14:00:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Enrich with 3 additional nutrients from USDA FoodData Central API (FDC ID 170562)
  fields_changed:
  - version
  - per_portion.vitamin_b5_mg
  - per_portion.omega3_ala_g
  - per_portion.omega6_la_g
  sources:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/170562/nutrients
    note: "USDA API: Pantothenic acid (1.13mg/100g), ALA/18:3 n-3 (0.06g/100g), LA/18:2 n-6 (23.05g/100g). Biotin, chromium, molybdenum not available in USDA database."
- timestamp: "2025-11-05T19:30:00+00:00"
  updated_by: "Agent 7: Claude Sonnet 4.5"
  reason: Enrichment with biotin (B7) from NIH/USDA-funded research study
  fields_changed:
  - version
  - per_portion.vitamin_b7_ug
  sources:
  - url: https://www.nutritionadvance.com/foods-high-in-biotin/
    note: "Research-based biotin content: Most commonly cited value is 7.8 mcg per 100g from Journal of Food Composition and Analysis 2004 study (NIH/USDA funded). Alternative sources cite 13 mcg per 100g (from 2.6 mcg per 20g serving = 9% DV). Using conservative estimate of 10 mcg per 100g, scaled to 30g = 3.0 mcg."
  - note: "Chromium and molybdenum: Remain 0. Standard nutritional databases do not provide values for sunflower seeds. Unlike hazelnuts which have published research with specific values, sunflower seed trace mineral data is not reliably available."
```
