## Banana (Raw, 150g)

```yaml
id: banana_raw_150g_v1
schema_version: 2
version: 2
last_verified: 2025-11-02
source:
  venue: Generic - Grocery/Supermarket
  menu_page: 
  evidence:
  - USDA FoodData Central #173944 - Bananas, raw
  - Standard fresh banana, medium-large size
aliases:
- Banana
- Fresh Banana
- Raw Banana
category: ingredient
portion:
  description: 1 medium-large banana
  est_weight_g: 150
  notes: Raw, unpeeled weight approximately 180-200g; peeled edible portion 150g
assumptions:
  salt_scheme: unsalted
  oil_type: 
  prep: Raw, fresh, unprocessed
per_portion:
  energy_kcal: 155.9
  protein_g: 1.6
  fat_g: 0.5
  sat_fat_g: 0.2
  mufa_g: 0.1
  pufa_g: 0.1
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 18.3
  fiber_total_g: 3.9
  fiber_soluble_g: 0.9
  fiber_insoluble_g: 3
  sodium_mg: 2
  potassium_mg: 537
  iodine_ug: 5
  magnesium_mg: 40
  calcium_mg: 8
  iron_mg: 0.4
  zinc_mg: 0.2
  vitamin_c_mg: 13
  manganese_mg: 0.4
  polyols_g: 0
  carbs_available_g: 34.3
  carbs_total_g: 38.2
  copper_mg: 0
  selenium_ug: 0
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 0
  chloride_mg: 0
  sulfur_g: 0
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
  confidence: high
  gaps:
notes:
- USDA standard reference for raw banana (173944)
- Excellent source of potassium (537mg, ~11% DV) and vitamin B6 (0.6mg, ~42% DV)
- Good source of dietary fiber, primarily resistant starch and pectin
- Contains prebiotic fiber that feeds beneficial gut bacteria
- Vitamin C: ~13mg per 150g serving
- Manganese: ~0.4mg per 150g serving
- Natural sugars include glucose, fructose, and sucrose
- Ripeness affects sugar content - riper bananas have more simple sugars
- Resistant starch content decreases as banana ripens
- Low glycemic index when green/unripe, moderate GI when fully ripe
- Minimal fat content, primarily PUFA and MUFA
- Soluble fiber (~0.9g) mainly pectin, insoluble fiber (~3g) mainly cellulose
- Atwater check (available carb basis): 4×1.6 + 9×0.5 + 4×34.3 + 2×3.9 + 2.4×0.0 = 155.9 kcal
change_log:
- timestamp: 2025-11-01T09:00:00+0000
...
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial entry for banana tracking - user consumed in breakfast smoothie
  fields_changed: [all fields]
  sources: [{note: 'USDA FoodData Central - Bananas, raw', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/173944/nutrients'},
  {note: 'User consumed 150g banana in breakfast smoothie on 2025-11-01 at 09:00',
    url: user_request}]
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
