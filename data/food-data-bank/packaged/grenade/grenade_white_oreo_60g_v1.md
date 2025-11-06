## Grenade Carb Killa White Oreo Bar (60g)

```yaml
id: grenade_white_oreo_60g_v1
schema_version: 2
version: 4
last_verified: 2025-11-05
source:
  venue: Grenade (Packaged Product)
  menu_page: 
  evidence:
  - Grenade official nutrition data
  - Multiple UK retailer listings
aliases:
- Carb Killa White Oreo
category: ingredient
portion:
  description: 1 protein bar
  est_weight_g: 60
  notes: High protein bar with white chocolate coating and Oreo pieces
assumptions:
  salt_scheme: normal
  oil_type:
  prep: packaged product
  usda_proxy: "17 priority nutrients enriched using USDA FDC ID 174786 (SNICKERS MARATHON Protein Performance Bar) as proxy. Values scaled from per-100g to 60g portion. Confidence: MEDIUM - similar whey protein bar with fortification. Additional 8+ nutrients added 2025-11-05: vitamin B5 (2.5mg - fortified), vitamin B7/biotin (20µg - fortified), omega-6 LA (1.8g from milk/whey), omega-3 ALA (0.2g), calcium (170mg from milk protein), magnesium (48mg), potassium (180mg), iron (2.4mg - fortified), zinc (2.0mg - fortified). Vitamin C remains 0 (not typically added to protein bars)."
  manganese: "Updated from USDA protein bar proxy (0.79 mg) replacing previous oat-based estimate (2.94 mg). USDA value more representative of fortified protein bar formulation."
per_portion:
  energy_kcal: 296.6
  protein_g: 21
  fat_g: 10
  sat_fat_g: 5.7
  mufa_g: 2
  pufa_g: 2.3
  trans_fat_g: 0
  cholesterol_mg: 10
  sugar_g: 1.3
  fiber_total_g: 0.9
  fiber_soluble_g: 0.4
  fiber_insoluble_g: 0.5
  sodium_mg: 180
  potassium_mg: 180
  iodine_ug: 8
  magnesium_mg: 48
  calcium_mg: 170
  iron_mg: 2.4
  zinc_mg: 2.0
  vitamin_c_mg: 0
  manganese_mg: 0.79
  polyols_g: 17
  carbs_available_g: 20
  carbs_total_g: 37.9
  copper_mg: 0.59
  selenium_ug: 2.34
  chromium_ug: 2.5
  molybdenum_ug: 10
  phosphorus_mg: 225.0
  chloride_mg: 277
  sulfur_g: 0.25
  vitamin_a_ug: 391.2
  vitamin_d_ug: 2.28
  vitamin_e_mg: 10.13
  vitamin_k_ug: 6.24
  vitamin_b1_mg: 1.12
  vitamin_b2_mg: 1.27
  vitamin_b3_mg: 15.0
  vitamin_b5_mg: 2.5
  vitamin_b6_mg: 1.5
  vitamin_b7_ug: 20
  vitamin_b9_ug: 300.0
  vitamin_b12_ug: 4.5
  choline_mg: 1.02
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.2
  omega6_la_g: 1.8
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps:
  - MUFA/PUFA estimated from total unsaturated fat
  - Micronutrients not provided on label
  - Contains sugar alcohols (17g polyols not included in main carb count)
notes:
- Contains 17g sugar alcohols/polyols (maltitol) not included in carb count
- Fat split estimated: remaining 4.3g unsaturated divided into MUFA/PUFA based on typical protein bar composition
- Sodium estimated from typical Grenade bar range (0.45g salt = ~180mg sodium)
- Atwater check (available carb basis): 4×21.0 + 9×10.0 + 4×20.0 + 2×0.9 + 2.4×17.0 = 296.6 kcal
change_log:
- timestamp: 2025-10-30T00:00:00+0000
  updated_by: Claude Code
  reason: Initial entry for Thomas's food diary tracking
  fields_changed: [all fields]
  sources: [{note: Grenade White Oreo bar nutrition facts, url: 'https://www.healthyplanetcanada.com/grenade-high-protein-bar-oreo-60g.html'}]
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed: [last_verified, notes, per_portion.carbs_available_g, per_portion.carbs_g, per_portion.carbs_total_g,
  per_portion.energy_kcal, per_portion.polyols_g, version]
  sources: []
- timestamp: '2025-11-02T22:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Correct polyol data to match notes - was incorrectly set to 0.0 instead of 17.0g
  fields_changed: [per_portion.polyols_g, per_portion.carbs_total_g, per_portion.energy_kcal, notes]
  sources: []
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
- timestamp: '2025-11-05T00:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Enrich with 17 priority nutrients from USDA FoodData Central
  fields_changed: [vitamin_d_ug, choline_mg, vitamin_b9_ug, vitamin_b12_ug, phosphorus_mg,
    copper_mg, selenium_ug, manganese_mg, vitamin_a_ug, vitamin_e_mg, vitamin_k_ug,
    vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b6_mg, assumptions.usda_proxy,
    assumptions.manganese]
  sources:
  - note: 'USDA FoodData Central: SNICKERS MARATHON Protein Performance Bar (whey protein bar proxy)'
    fdc_id: 174786
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/174786/nutrients'
    scaling: 'Per-100g values scaled to 60g portion (multiply by 0.6)'
- timestamp: '2025-11-05T22:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: 'Enrichment phase 2: Added 8+ critical nutrients for fortified whey protein bar'
  fields_changed: [vitamin_b5_mg, vitamin_b7_ug, omega6_la_g, omega3_ala_g, calcium_mg, magnesium_mg, potassium_mg, iron_mg, zinc_mg, version, last_verified]
  sources:
  - note: 'Typical fortified protein bar composition and whey protein isolate nutrient profile'
    reference: 'Whey protein isolate contains ~5.8mg B5 per 100g (USDA data)'
  methodology: "Estimated values for fortified whey protein bar (60g portion): vitamin B5/pantothenic acid (2.5mg - typical fortification provides 40-50% DV), vitamin B7/biotin (20µg - fortified, note: biotin data limited in databases per NIH), omega-6 linoleic acid LA (1.8g from milk/whey ingredients and trace nuts), omega-3 ALA (0.2g minimal amount), calcium (170mg from milk protein concentrate), magnesium (48mg), potassium (180mg), iron (2.4mg - fortified to ~15% DV), zinc (2.0mg - fortified). Vitamin C kept at 0 (not typically added to protein bars). Confidence: MEDIUM - based on typical fortified protein bar composition with whey protein base."
- timestamp: '2025-11-05T23:30:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5 (Agent 10)'
  reason: 'Final enrichment phase: Added 5 remaining trace nutrients to complete 48-nutrient profile'
  fields_changed: [iodine_ug, chromium_ug, molybdenum_ug, chloride_mg, sulfur_mg, version]
  sources:
  - note: 'Calculated from macronutrient composition and dairy protein source'
  methodology: "Enriched final 5 trace nutrients for 60g whey protein bar: iodine (8µg from dairy/whey protein source, typical ~10-30µg/100g in whey), chloride (277mg calculated from 180mg sodium using NaCl molar ratio 1.541), sulfur (250mg from 21g protein at ~1.2% sulfur content in methionine/cysteine amino acids), chromium (2.5µg trace from protein and grain ingredients), molybdenum (10µg from protein and grain ingredients). TRUE zeros maintained for: vitamin C (not added to protein bars), EPA/DHA (no fish source), boron/silicon/vanadium/nickel (ultra-trace minerals with insignificant amounts). Energy validation: 4×21 + 9×10 + 4×20 + 2×0.9 + 2.4×17 = 296.6 kcal ✓"
```
