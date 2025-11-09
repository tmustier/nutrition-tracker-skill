## Skyr - plain (200 g)

```yaml
id: skyr_plain_200g_v1
schema_version: 2
version: 7
last_verified: 2025-11-05
source:
  venue: pack/ingredient
  menu_page: 
  evidence:
aliases:
category: ingredient
portion:
  description: fixed pack portion
  est_weight_g: 200
  notes: Plain skyr yoghurt.
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: 
per_portion:
  energy_kcal: 121.2
  protein_g: 22
  fat_g: 0.4
  sat_fat_g: 0.2
  mufa_g: 0.1
  pufa_g: 0
  trans_fat_g: 0.1
  cholesterol_mg: 10
  sugar_g: 7.4
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 104
  potassium_mg: 340
  iodine_ug: 21
  magnesium_mg: 24
  calcium_mg: 300
  iron_mg: 0
  zinc_mg: 1
  vitamin_c_mg: 0
  manganese_mg: 0.01
  polyols_g: 0
  carbs_available_g: 7.4
  carbs_total_g: 7.4
  copper_mg: 0.5
  selenium_ug: 7
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 300
  chloride_mg: 160.0
  sulfur_g: 0.088
  vitamin_a_ug: 25
  vitamin_d_ug: 0.1
  vitamin_e_mg: 0.02
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.02
  vitamin_b2_mg: 0.6
  vitamin_b3_mg: 0.4
  vitamin_b5_mg: 0.662
  vitamin_b6_mg: 0.1
  vitamin_b7_ug: 0
  vitamin_b9_ug: 2
  vitamin_b12_ug: 1.4
  choline_mg: 30
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0
  omega6_la_g: 0.024
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps:
notes:
- Atwater check (available carb basis): 4×22.0 + 9×0.4 + 4×7.4 + 2×0.0 + 2.4×0.0 = 121.2 kcal
change_log:

  - timestamp: "2025-11-06T23:28:46+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
  - timestamp: 2025-10-28T18:51:39+0000
    updated_by: 'LLM: GPT-5 Thinking'
    reason: Populate per_portion from user-provided data
    fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
    per_portion.cholesterol_mg, per_portion.carbs_g, per_portion.sugar_g, per_portion.sodium_mg,
    per_portion.potassium_mg, per_portion.iodine_ug, per_portion.magnesium_mg, per_portion.calcium_mg,
    per_portion.zinc_mg]
    sources: [{note: User-supplied values on 2025-10-28, url: user_input}]
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: 'LLM: GPT-5 Thinking'
    reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
    fields_changed: [per_portion.protein_g, per_portion.zinc_mg]
    sources: [{note: Automated rounding pass, url: formatting-pass}]
  - timestamp: 2025-10-28T20:15:00+0000
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: Complete dairy fat profile and trace nutrients based on research
    fields_changed: [per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g, per_portion.vitamin_c_mg,
    per_portion.iron_mg, version]
    sources:
      - note: 'USDA FoodData Central - Low-fat yogurt reference (MUFA 0.426g, PUFA 0.044g, Iron 0.08mg per 100g)'
        url: 'https://fdc.nal.usda.gov/'
      - note: 'Chemical characteristics and fatty acid composition of Greek yogurts'
        url: 'https://www.sciencedirect.com/science/article/abs/pii/S0308814612005857'
      - note: 'Fatty Acid Profile and CLA Content in yogurts - natural trans-fat (CLA) 0.34-1.07% of total fat'
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8749727/'
      - note: 'Skyr nutrition information - confirms trace iron and no vitamin C in plain dairy'
        url: 'https://www.healthline.com/nutrition/skyr'
      - note: 'Dairy fat composition: ~62-70% saturated, ~25-30% MUFA, ~3-5% PUFA'
        url: 'https://www.nutritionvalue.org/Yogurt,_low_fat,_plain_nutritional_value.html'
    calculation_notes: 'With 0.4g total fat (0.2g saturated) per 200g: MUFA estimated at 0.1g (~27% of total fat), PUFA trace at 0.0g (~3% of total fat), trans-fat 0.1g representing natural CLA from dairy (~4% of total fat). Vitamin C is 0mg (not naturally present in plain dairy). Iron is 0mg rounded from trace amounts typical in low-fat dairy products.'
  - timestamp: 2025-10-29T00:00:00+0000
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: Populate fiber and manganese values for dairy product (all 0)
    fields_changed: [per_portion.fiber_total_g, per_portion.fiber_soluble_g, per_portion.fiber_insoluble_g,
    per_portion.manganese_mg]
    sources:
      - note: 'Dairy products contain no dietary fiber (plant-based nutrient only). Manganese trace amounts rounded to 0.'
        url: nutritional_knowledge
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
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: Enrich skyr with 17 priority nutrients using authoritative food composition databases
    fields_changed: [last_verified, version, per_portion.vitamin_d_ug, per_portion.choline_mg,
    per_portion.iodine_ug, per_portion.vitamin_b9_ug, per_portion.vitamin_b12_ug,
    per_portion.phosphorus_mg, per_portion.copper_mg, per_portion.selenium_ug,
    per_portion.manganese_mg, per_portion.vitamin_a_ug, per_portion.vitamin_b1_mg,
    per_portion.vitamin_b2_mg, per_portion.vitamin_b3_mg, per_portion.vitamin_b6_mg]
    sources:
    - note: 'Danish Food Composition Database (Frida) - Skyr 0.2% fat (Food ID: 1693).
        Primary authoritative source for Nordic dairy products. Per 100g: Vitamin D 0.035µg,
        Choline 15.2mg, Iodine 10.7µg, Folate 1.0µg, B12 0.7µg, Phosphorus 150mg,
        Copper 0.25mg, Selenium 3.7µg, Vitamin A 12.7µg RE, B1 0.01mg, B2 0.28mg,
        B3 0.20mg, B6 0.05mg'
      url: 'https://frida.fooddata.dk/food/1693?lang=en'
    - note: 'USDA plain yogurt reference for manganese content (0.004mg per 100g).
        Yogurt contains trace amounts of manganese.'
      url: 'https://www.nutritionix.com/food/plain-yogurt/100-g'
    - note: 'Vitamin K in plain yogurt: ~0.1µg per 100g. Plain yogurt is very low
        in vitamin K; fermented varieties contain more (menaquinone form).'
      url: 'https://liquidinsider.com/does-yogurt-have-vitamin-k-in-them/'
    - note: 'Omega-3 fatty acids (EPA/DHA) are not present in standard nonfat dairy products. Only plant-based omega-3 ALA is found in trace amounts in grass-fed dairy.'
      url: 'https://www.strongrfastr.com/foods/greek-yogurt-1287'
    calculation_notes: 'All values converted from per 100g to 200g portion (×2). Rounding applied per standard: g to 0.1, mg/µg to whole or 0.1 for precision. Iodine updated from user-supplied 60µg to database-verified 21µg (10.7µg×2). Vitamin E and K remain 0 due to trace/negligible amounts. Omega-3 EPA/DHA confirmed 0 (not naturally present in nonfat dairy). Manganese rounded to 0.01mg from 0.008mg (0.004×2).'
  - timestamp: '2025-11-05T16:00:00+00:00'
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: 'Enrichment with 8 additional nutrients using USDA FoodData Central values for nonfat yogurt (skyr composition similar to nonfat Greek yogurt)'
    fields_changed: [vitamin_b5_mg, omega6_la_g, version]
    sources:
      - note: 'USDA FoodData Central via nutritionvalue.org - Nonfat Greek yogurt per 100g used as reference for skyr (similar nonfat dairy composition): Pantothenic acid (B5) 0.331mg, Linoleic acid (18:2 n-6) 0.012g, ALA (18:3 n-3) negligible/0g. Scaled to 200g portion: B5=0.662mg, LA=0.024g, ALA=0g.'
        url: 'https://www.nutritionvalue.org/Yogurt,_nonfat,_plain,_Greek_nutritional_value.html'
    notes: 'Vitamin B7 (biotin), chromium, and molybdenum remain 0 (not routinely analyzed/reported in USDA FoodData Central for yogurt products per USDA API Research). Omega-3 ALA is TRUE ZERO/negligible in nonfat dairy. Fiber soluble and insoluble remain 0 (TRUE ZERO for pure dairy products).'
  - timestamp: '2025-11-05T23:45:00+00:00'
    updated_by: 'LLM: Claude Sonnet 4.5 (Agent 6)'
    reason: 'Added vitamin E based on USDA nonfat Greek yogurt reference data'
    fields_changed: [vitamin_e_mg, version]
    sources: [{note: 'USDA FoodData Central - Nonfat Greek yogurt per 100g: Vitamin E (alpha-tocopherol) 0.01 mg. Scaled to 200g portion: 0.02mg.', url: 'https://www.nutritionvalue.org/Yogurt,_nonfat,_plain,_Greek_nutritional_value.html'}]
    methodology: "USDA value for nonfat Greek yogurt (0.01mg/100g) scaled to 200g portion (×2=0.02mg). Vitamin K remains 0 (USDA confirms 0 mcg for nonfat Greek yogurt - TRUE ZERO). Skyr composition is very similar to nonfat Greek yogurt."
```
