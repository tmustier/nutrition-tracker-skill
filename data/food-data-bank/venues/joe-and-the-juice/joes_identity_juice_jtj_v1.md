## Joe & the Juice - Joe’s Identity juice

```yaml
id: joes_identity_juice_jtj_v1
schema_version: 2
version: 4
last_verified: 2025-11-02
source:
  venue: Joe & the Juice
  menu_page: 
  evidence:
aliases:
category: drink
portion:
  description: menu serving
  est_weight_g: 355
  notes: Green juice (12 oz); contains kale, celery, spinach, lemon, cucumber, olive oil. Recipe varies by location.
assumptions:
  salt_scheme: normal
  oil_type: olive
  prep: cold-pressed juice
per_portion:
  energy_kcal: 78
  protein_g: 4
  fat_g: 2
  sat_fat_g: 0.3
  mufa_g: 1.5
  pufa_g: 0.2
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 5
  fiber_total_g: 4
  fiber_soluble_g: 1
  fiber_insoluble_g: 3
  sodium_mg: 27
  potassium_mg: 600
  iodine_ug: 2
  magnesium_mg: 45
  calcium_mg: 120
  iron_mg: 2
  zinc_mg: 1
  vitamin_c_mg: 60
  manganese_mg: 1
  polyols_g: 0
  carbs_available_g: 9
  carbs_total_g: 13
  copper_mg: 0
  selenium_ug: 0
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 0
  chloride_mg: 0
  sulfur_mg: 0
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0
  vitamin_b2_mg: 0
  vitamin_b3_mg: 0
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0
  vitamin_b7_ug: 0
  vitamin_b9_ug: 0
  vitamin_b12_ug: 0
  choline_mg: 0
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
  - Micronutrients estimated from ingredient composition; venue formulations may vary by location.
notes:
- Ingredients confirmed: kale, celery, spinach, lemon, cucumber, olive oil
- Standard serving size is 12 oz (~355ml)
- Atwater check (available carb basis): 4×4.0 + 9×2.0 + 4×9.0 + 2×4.0 + 2.4×0.0 = 78 kcal
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.carbs_g,
  per_portion.fiber_total_g, per_portion.sodium_mg]
  sources: [{note: User-supplied values on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed: [per_portion.protein_g, per_portion.fat_g, per_portion.carbs_g, per_portion.fiber_total_g]
  sources: [{note: Automated rounding pass, url: formatting-pass}]
- timestamp: 2025-10-28T20:30:00+0000
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Research-based population of missing nutrition fields
  fields_changed: [version, portion.est_weight_g, portion.notes, assumptions.oil_type, assumptions.prep,
  per_portion.sat_fat_g, per_portion.mufa_g, per_portion.pufa_g, per_portion.trans_fat_g,
  per_portion.cholesterol_mg, per_portion.sugar_g, per_portion.potassium_mg, per_portion.iodine_ug,
  per_portion.magnesium_mg, per_portion.calcium_mg, per_portion.iron_mg, per_portion.zinc_mg,
  per_portion.vitamin_c_mg, quality.confidence, quality.gaps, notes]
  sources: [{note: 'Official Joe & the Juice product page - confirmed ingredients: kale, celery,
      spinach, lemon, cucumber, olive oil', url: 'https://www.joejuice.com/signature-product/identity-juice'},
  {note: 'Multiple third-party nutrition databases showing 85-90 cal, 8g sugar for
      similar serving; standard serving sizes 12 oz (355ml) or 16 oz (473ml)', url: web_search},
  {note: 'Reference for green juice micronutrient content from kale, spinach, celery',
    url: 'https://www.livmorjuicery.com/post/unlock-the-power-of-green-the-amazing-health-benefits-of-celery-kale-and-spinach-juice'},
  {note: 'Fat breakdown estimated from olive oil composition (75% MUFA, 15% sat, 10%
      PUFA, 0% trans); sugars calculated from available carbs (9g total - 4g fiber
      = 5g available); cholesterol 0 for plant-based juice; micronutrients estimated
      from USDA data for kale (FDC 323505), spinach (FDC 168462), celery (FDC 169988),
      cucumber (FDC 168409) proportional to typical 12oz green juice serving', url: ingredient_analysis}]
- timestamp: 2025-10-29T00:00:00+0000
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Populate fiber split and manganese from leafy green composition
  fields_changed: [per_portion.fiber_soluble_g, per_portion.fiber_insoluble_g, per_portion.manganese_mg]
  sources: [{note: 'Leafy greens (kale, spinach, celery) ~25% soluble, 75% insoluble fiber; kale
      high in manganese (~0.5mg per 100g). Estimated 1.0g soluble, 3.0g insoluble,
      1mg manganese per 355g juice', url: nutritional_research}]
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
```
