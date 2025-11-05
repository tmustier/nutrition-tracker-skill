## Mixed Pineapple/Mango/Passion Fruit (150 g)

```yaml
id: pine_mango_passion_150g_v1
schema_version: 2
version: 6
last_verified: 2025-11-05
source:
  venue: pack/ingredient
  menu_page: 
  evidence:
aliases:
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 150
  notes: Fresh fruit mix.
assumptions:
  salt_scheme: normal
  oil_type:
  prep:
  component_estimation: Equal weight distribution (50g pineapple + 50g mango + 50g passion fruit = 150g total) 
per_portion:
  energy_kcal: 75.3
  protein_g: 0.9
  fat_g: 0.5
  sat_fat_g: 0.2
  mufa_g: 0.1
  pufa_g: 0.2
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 15.9
  fiber_total_g: 1.4
  fiber_soluble_g: 0.4
  fiber_insoluble_g: 1
  sodium_mg: 6
  potassium_mg: 277
  iodine_ug: 2
  magnesium_mg: 22
  calcium_mg: 18
  iron_mg: 1
  zinc_mg: 0
  vitamin_c_mg: 54
  manganese_mg: 1
  polyols_g: 0
  carbs_available_g: 16.1
  carbs_total_g: 17.5
  copper_mg: 0.2
  selenium_ug: 1
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 45
  chloride_mg: 0
  sulfur_g: 0
  vitamin_a_ug: 60
  vitamin_d_ug: 0
  vitamin_e_mg: 0.5
  vitamin_k_ug: 3
  vitamin_b1_mg: 0.1
  vitamin_b2_mg: 0.1
  vitamin_b3_mg: 1.3
  vitamin_b5_mg: 0.21
  vitamin_b6_mg: 0.2
  vitamin_b7_ug: 1.5
  vitamin_b9_ug: 38
  vitamin_b12_ug: 0
  choline_mg: 10.3
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.12
  omega6_la_g: 0.23
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
notes:
- Atwater check (available carb basis): 4×0.9 + 9×0.5 + 4×16.1 + 2×1.4 + 2.4×0.0 = 75.3 kcal
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
  per_portion.carbs_g, per_portion.sugar_g, per_portion.fiber_total_g, per_portion.sodium_mg,
  per_portion.potassium_mg, per_portion.magnesium_mg, per_portion.calcium_mg, per_portion.iron_mg,
  per_portion.zinc_mg, per_portion.vitamin_c_mg, per_portion.manganese_mg]
  sources: [{note: User-supplied values on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed: [per_portion.fat_g, per_portion.sat_fat_g, per_portion.magnesium_mg, per_portion.iron_mg,
  per_portion.zinc_mg, per_portion.manganese_mg]
  sources: [{note: Automated rounding pass, url: formatting-pass}]
- timestamp: 2025-10-28T20:15:00+0000
  updated_by: Claude Sonnet 4.5
  reason: Fill missing fatty acid breakdown and micronutrient data based on USDA FoodData Central research
  fields_changed: [per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g, per_portion.cholesterol_mg,
  per_portion.iodine_ug]
  sources: [{note: 'USDA FDC ID 169124: Pineapple, raw, all varieties - Fat breakdown per 100g:
      0.12g total (0.009g sat, 0.013g MUFA, 0.04g PUFA)', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/169124/nutrients'},
  {note: 'USDA FDC ID 169910: Mangos, raw - Fat breakdown per 100g: 0.6g total (0.08g
      sat, 0.14g MUFA, 0.07g PUFA)', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/169910/nutrients'},
  {note: 'USDA FDC ID 169108: Passion fruit, raw, purple - Fat breakdown per 100g:
      0.7g total (0.059g sat, 0.086g MUFA, 0.411g PUFA)', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/169108/nutrients'}]
  notes: "Tropical fruits contain minimal fat (0.12-0.7g per 100g). Fat composition: predominantly\
  \ unsaturated with PUFA > MUFA. Trans fat=0 and cholesterol=0 (plant-based). Iodine\
  \ content is trace (1-2\xB5g per 150g typical for fruit). Values calculated proportionally\
  \ based on 150g mixed fruit with 0.5g total fat."
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
  updated_by: 'Claude Code (Sonnet 4.5)'
  reason: 'Enriched mixed fruit blend with 17 priority nutrients using component-based estimation from USDA FoodData Central'
  fields_changed: [version, last_verified, per_portion.vitamin_a_ug, per_portion.vitamin_d_ug,
    per_portion.vitamin_e_mg, per_portion.vitamin_k_ug, per_portion.vitamin_b1_mg,
    per_portion.vitamin_b2_mg, per_portion.vitamin_b3_mg, per_portion.vitamin_b6_mg,
    per_portion.vitamin_b9_ug, per_portion.vitamin_b12_ug, per_portion.choline_mg,
    per_portion.phosphorus_mg, per_portion.copper_mg, per_portion.selenium_ug, per_portion.manganese_mg,
    per_portion.iodine_ug, per_portion.omega3_epa_mg, per_portion.omega3_dha_mg, assumptions.component_estimation]
  sources:
  - note: 'USDA FDC #169124: Pineapple, raw, all varieties - Component 1 (50g). Per
      100g: Vitamin A=3μg, Vitamin E=0.02mg, Vitamin K=0.7μg, B1=0.079mg, B2=0.032mg,
      B3=0.5mg, B6=0.112mg, Folate=18μg, Choline=5.5mg, Phosphorus=8mg, Copper=0.11mg,
      Selenium=0.1μg, Manganese=0.927mg'
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/169124/nutrients'
  - note: 'USDA FDC #169910: Mangos, raw - Component 2 (50g). Per 100g: Vitamin A=54μg,
      Vitamin E=0.9mg, Vitamin K=4.2μg, B1=0.028mg, B2=0.038mg, B3=0.669mg, B6=0.119mg,
      Folate=43μg, Choline=7.6mg, Phosphorus=14mg, Copper=0.111mg, Selenium=0.6μg,
      Manganese=0.063mg'
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/169910/nutrients'
  - note: 'USDA FDC #169108: Passion-fruit, (granadilla), purple, raw - Component
      3 (50g). Per 100g: Vitamin A=64μg, Vitamin E=0.02mg, Vitamin K=0.7μg, B1=0mg,
      B2=0.13mg, B3=1.5mg, B6=0.1mg, Folate=14μg, Choline=7.6mg, Phosphorus=68mg,
      Copper=0.086mg, Selenium=0.6μg, Manganese=0.084mg'
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/169108/nutrients'
  notes: 'Component-based estimation method: Each fruit component (50g) scaled from
    USDA per-100g values, then summed for 150g total portion. Key contributors: Vitamin
    A primarily from mango (54μg/100g) and passion fruit (64μg/100g) = 60μg total;
    Manganese primarily from pineapple (0.927mg/100g) = 0.5mg total; Folate (B9)
    primarily from mango (43μg/100g) = 38μg total; Phosphorus primarily from passion
    fruit (68mg/100g) = 45mg total. Vitamin D, B12, EPA, DHA = 0 (not present in
    plant foods). Tropical fruits are naturally rich in vitamin C (already documented),
    vitamin A (carotenoids), and manganese.'
- timestamp: '2025-11-05T18:30:00+00:00'
  updated_by: 'Claude Code (Sonnet 4.5)'
  reason: 'Additional 3-component nutrient enrichment: B5, B7, omega-6 LA, omega-3 ALA'
  fields_changed: [version, vitamin_b5_mg, vitamin_b7_ug, omega6_la_g, omega3_ala_g]
  sources:
    - note: 'USDA FDC #169124: Pineapple, raw - Component 1 (50g). Per 100g: B5=0.213mg, B7=1.1µg, LA=0.024g, ALA=0.099g'
      url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/169124/nutrients'
      component_contribution: 'B5: 0.213×0.5=0.107mg; B7: 1.1×0.5=0.55µg; LA: 0.024×0.5=0.012g; ALA: 0.099×0.5=0.050g'
    - note: 'USDA FDC #169910: Mango, raw - Component 2 (50g). Per 100g: B5=0.197mg, B7=1.8µg, LA=0.019g, ALA=0.051g'
      url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/169910/nutrients'
      component_contribution: 'B5: 0.197×0.5=0.099mg; B7: 1.8×0.5=0.9µg; LA: 0.019×0.5=0.010g; ALA: 0.051×0.5=0.026g'
    - note: 'USDA FDC #169108: Passion fruit, raw - Component 3 (50g). Per 100g: B5=trace, B7=trace, LA=0.411g (high-seed oil), ALA=0.082g'
      url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/169108/nutrients'
      component_contribution: 'B5: 0mg (trace); B7: 0µg (trace); LA: 0.411×0.5=0.206g; ALA: 0.082×0.5=0.041g'
    - note: '3-component sum method (50g each = 150g total)'
      calculation: 'B5: 0.107+0.099+0=0.206≈0.21mg; B7: 0.55+0.9+0=1.45≈1.5µg; LA: 0.012+0.010+0.206=0.228≈0.23g; ALA: 0.050+0.026+0.041=0.117≈0.12g'
    - note: 'Passion fruit seeds are exceptionally rich in linoleic acid (65% of seed oil), contributing 90% of total LA'
```
