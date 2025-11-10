## Minestrone with Cannellini Beans, Fennel, Cabbage, Potato & Parmesan (The Eagle, Farringdon)

```yaml
id: minestrone_cannellini_fennel_cabbage_potato_parmesan_eagle_farringdon_v1
schema_version: 2
version: 3
last_verified: 2025-11-02
source:
  venue: The Eagle, Farringdon (London)
  menu_page: "https://theeaglefarringdon.co.uk/"
  evidence:
  - GPT-5 Codex component build using vegetable broth, beans, seasonal vegetables, olive oil
  - Portion estimation from Eagle soup bowls (~750g including broth)
  - User dining notes from 2025-11-01 visit
aliases:
- Minestrone with Cannellini Beans
- Winter Minestrone (Eagle)
- Minestrone with Parmesan
category: soup
portion:
  description: 1 large bowl
  est_weight_g: 525
  notes: Approx. 450ml broth yield with 120g beans, 100g potato, 50g fennel, 80g cabbage, 150g tomatoes, 15g parmesan
assumptions:
  salt_scheme: normal (≈1.8g salt in broth)
  oil_type: extra-virgin olive oil
  prep: Vegetable broth simmered with cannellini beans, fennel, cabbage, potato; finished with olive oil and parmesan
per_portion:
  energy_kcal: 536.6
  protein_g: 23
  fat_g: 15
  sat_fat_g: 4.1
  mufa_g: 8.5
  pufa_g: 1.5
  trans_fat_g: 0
  cholesterol_mg: 10.2
  sugar_g: 14.2
  fiber_total_g: 15.6
  fiber_soluble_g: 5.4
  fiber_insoluble_g: 10.2
  sodium_mg: 1200
  potassium_mg: 1858
  iodine_ug: 6
  magnesium_mg: 95
  calcium_mg: 160
  iron_mg: 5.5
  zinc_mg: 2.8
  vitamin_c_mg: 45
  manganese_mg: 1.2
  polyols_g: 0
  carbs_available_g: 69.6
  carbs_total_g: 85.2
  copper_mg: 0.6
  selenium_ug: 70
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 280
  chloride_mg: 1848.0
  sulfur_g: 0.092
  vitamin_a_ug: 120
  vitamin_d_ug: 0
  vitamin_e_mg: 2.8
  vitamin_k_ug: 85
  vitamin_b1_mg: 0.5
  vitamin_b2_mg: 0.25
  vitamin_b3_mg: 3.5
  vitamin_b5_mg: 0.9
  vitamin_b6_mg: 0.5
  vitamin_b7_ug: 0
  vitamin_b9_ug: 280
  vitamin_b12_ug: 0.15
  choline_mg: 65
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.1
  omega6_la_g: 1.5
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - Venue does not publish nutrition info
  - Micronutrients estimated from component model
  - Actual olive oil drizzle varies
  - Vegetable mix may change daily
notes:
- Component breakdown: 120g cooked cannellini beans, 100g potato, 50g fennel, 80g cabbage, 150g crushed tomatoes, 10g olive oil, 15g parmesan
- Modeled broth uses ≈1.8g salt, aligning with UK soup surveys
- Delivers ~15.6g fiber split 5.4g soluble / 10.2g insoluble
- Sodium higher than previous estimate due to broth and parmesan (≈1.2g)
- Vegetable mix rotates seasonally; macro impact minimal provided bean portion stays constant
- Contains dairy (parmesan); otherwise vegetarian
- Atwater check (available carb basis): 4×23.0 + 9×15.0 + 4×69.6 + 2×15.6 + 2.4×0.0 = 536.6 kcal
change_log:

  - timestamp: "2025-11-06T23:28:46+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
  - timestamp: 2025-11-01T18:34:00+0000
    updated_by: 'LLM: GPT-5 Codex'
    reason: Initial estimate for minestrone bowl at The Eagle
    fields_changed: [all fields]
    sources: [{note: 'User considering Minestrone with Cannellini Beans, Fennel, Cabbage, Potato
      & Parmesan on 2025-11-01', url: user_request}, {note: 'GPT-5 Codex component
      model using 200g beans, 15g olive oil, 10g parmesan', url: gpt_culinary_estimate}]
  - timestamp: 2025-11-02T10:00:00+0000
    updated_by: 'LLM: GPT-5 Codex'
    reason: Updated soup macros to match user-supplied estimate with broth sodium detail
    fields_changed: [version, last_verified, portion.est_weight_g, assumptions.salt_scheme, per_portion.energy_kcal,
    per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g, per_portion.mufa_g,
    per_portion.pufa_g, per_portion.cholesterol_mg, per_portion.carbs_g, per_portion.sugar_g,
    per_portion.fiber_total_g, per_portion.fiber_soluble_g, per_portion.fiber_insoluble_g,
    per_portion.sodium_mg, per_portion.potassium_mg, derived.energy_from_macros_kcal,
    notes]
    sources: [{note: Detailed macro table shared by user on 2025-11-02, url: user_provided_best_effort_estimate}]
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
  - timestamp: '2025-11-05T19:30:00+00:00'
    updated_by: 'Claude Code (Sonnet 4.5) - Agent 1'
    reason: 'Enriched with nutrient estimates based on minestrone components: cannellini beans (~120g), potato (~100g), fennel (~50g), cabbage (~80g), tomatoes (~150g), olive oil (~10g), parmesan (~15g), vegetable broth. Populated 22 nutrients from 0 to estimated values: magnesium (95 mg from beans/vegetables), calcium (160 mg from parmesan/greens), iron (5.5 mg from beans), zinc (2.8 mg), vitamin C (45 mg from cabbage/tomatoes), manganese (1.2 mg), copper (0.6 mg from beans), selenium (70 mcg), phosphorus (280 mg from beans), vitamin A (120 mcg from vegetables), vitamin E (2.8 mg from olive oil), vitamin K (85 mcg from cabbage), B-vitamins (B1: 0.5 mg, B2: 0.25 mg, B3: 3.5 mg, B5: 0.9 mg, B6: 0.5 mg from beans/vegetables, B9: 280 mcg from beans/greens, B12: 0.15 mcg from parmesan), choline (65 mg), iodine (6 mcg), omega-3 ALA (0.1 g), omega-6 LA (1.5 g from olive oil). Confidence: MEDIUM (±20-40% - multi-component vegetable soup).'
    fields_changed: [iodine_ug, magnesium_mg, calcium_mg, iron_mg, zinc_mg, vitamin_c_mg, manganese_mg, copper_mg, selenium_ug, phosphorus_mg, vitamin_a_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_ala_g, omega6_la_g]
    sources:
    - note: 'Component-based estimation: cannellini beans, potato, fennel, cabbage, tomatoes, olive oil, parmesan. Based on USDA data for individual ingredients.'
    url: 'https://fdc.nal.usda.gov/'
    confidence: 'MEDIUM - multi-component vegetable soup'
```
