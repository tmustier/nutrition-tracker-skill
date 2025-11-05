## Banana (Raw, 150g)

```yaml
id: banana_raw_150g_v1
schema_version: 2
version: 3
last_verified: 2025-11-05
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
  manganese_mg: 0.45
  polyols_g: 0
  carbs_available_g: 34.3
  carbs_total_g: 38.2
  copper_mg: 0.12
  selenium_ug: 1.5
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 33
  chloride_mg: 0
  sulfur_mg: 0
  vitamin_a_ug: 4.5
  vitamin_d_ug: 0
  vitamin_e_mg: 0.2
  vitamin_k_ug: 0.8
  vitamin_b1_mg: 0.05
  vitamin_b2_mg: 0.11
  vitamin_b3_mg: 1.0
  vitamin_b5_mg: 0.50
  vitamin_b6_mg: 0.6
  vitamin_b7_ug: 0.3
  vitamin_b9_ug: 30
  vitamin_b12_ug: 0
  choline_mg: 14.6
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.012
  omega6_la_g: 0.07
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
- timestamp: '2025-11-05T16:00:00+00:00'
  updated_by: Claude Code (Sonnet 4.5)
  reason: Second enrichment with 4 additional priority nutrients from USDA FoodData Central
  fields_changed: [vitamin_b5_mg, vitamin_b7_ug, omega3_ala_g, omega6_la_g]
  sources:
  - note: 'USDA FoodData Central - Bananas, raw (FDC ID 173944): Pantothenic acid 0.33mg/100g, LA 0.046g/100g'
    url: 'https://www.nutritionvalue.org/Bananas%2C_raw_nutritional_value.html'
  - note: 'Biotin content: 0.2μg/100g (most commonly reported value across multiple sources)'
    url: 'https://wholefoodcatalog.info/nutrient/vitamin_b7(biotin)/fruits/'
  - note: 'ALA omega-3: ~0.008g/100g (7.6mg per 100g from nutritional research)'
    url: 'https://www.myfooddata.com/articles/foods-high-in-ALA.php'
  data_notes: 'Scaled from per-100g to 150g portion. Chromium and molybdenum remain 0 (not measured/reported in USDA database for bananas).'
- timestamp: 2025-11-01T09:00:00+0000
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
- timestamp: '2025-11-05T00:00:00+00:00'
  updated_by: 'Claude Code (Sonnet 4.5)'
  reason: 'Enriched banana data with 17 priority nutrients from USDA FoodData Central #173944'
  fields_changed: [version, last_verified, per_portion.vitamin_a_ug, per_portion.vitamin_e_mg,
    per_portion.vitamin_k_ug, per_portion.vitamin_b1_mg, per_portion.vitamin_b2_mg,
    per_portion.vitamin_b3_mg, per_portion.vitamin_b6_mg, per_portion.vitamin_b9_ug,
    per_portion.choline_mg, per_portion.phosphorus_mg, per_portion.copper_mg, per_portion.selenium_ug,
    per_portion.manganese_mg]
  sources:
  - note: 'USDA FoodData Central - Bananas, raw (FDC #173944): Per 100g values converted
      to 150g portion'
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/173944/nutrients'
  - note: 'USDA Database for the Choline Content of Common Foods: Choline 9.7mg/100g'
    url: 'https://www.ars.usda.gov/ARSUserFiles/80400525/data/choline/choln02.pdf'
  notes: 'B-complex vitamins: B1=0.031mg, B2=0.073mg, B3=0.665mg, B6=0.4mg, B9=20mcg
    per 100g. Fat-soluble: A=3mcg, E=0.1mg, K=0.5mcg per 100g. Minerals: P=22mg, Cu=0.078mg,
    Se=1mcg, Mn=0.3mg per 100g. Choline=9.7mg per 100g. Vitamin D, B12, EPA, DHA=0
    (not present in bananas).'
```
