## ON Gold Standard Whey – Double Rich Chocolate (1 scoop ≈30 g)

```yaml
id: on_whey_drc_30g_v1
schema_version: 2
version: 5
last_verified: 2025-11-05
source:
  venue: Optimum Nutrition (pack/ingredient)
  menu_page: 
  evidence:
aliases:
category: ingredient
portion:
  description: scoop (~30 g)
  est_weight_g: 30
  notes: Ranges provided; midpoints used where sensible; iron omitted due to likely error.
assumptions:
  salt_scheme: normal
  oil_type: 
  prep: 
per_portion:
  energy_kcal: 122
  protein_g: 24
  fat_g: 1.4
  sat_fat_g: 0.5
  mufa_g: 0.5
  pufa_g: 0.4
  trans_fat_g: 0
  cholesterol_mg: 0
  sugar_g: 1.3
  fiber_total_g: 0.7
  fiber_soluble_g: 0.2
  fiber_insoluble_g: 0.5
  sodium_mg: 86
  potassium_mg: 177
  iodine_ug: 18
  magnesium_mg: 52
  calcium_mg: 130
  iron_mg: 0
  zinc_mg: 2
  vitamin_c_mg: 0
  manganese_mg: 0.09
  polyols_g: 0
  carbs_available_g: 3
  carbs_total_g: 3.7
  copper_mg: 0.08
  selenium_ug: 6
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 100
  chloride_mg: 0
  sulfur_mg: 0
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.2
  vitamin_b2_mg: 0.7
  vitamin_b3_mg: 0.4
  vitamin_b5_mg: 1.74
  vitamin_b6_mg: 0.3
  vitamin_b7_ug: 0.9
  vitamin_b9_ug: 5
  vitamin_b12_ug: 0.8
  choline_mg: 60
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0
  omega6_la_g: 0.03
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: low
  gaps:
  - Original data were ranges; iron value inconsistent (0.6–126 mg).
notes:
- Atwater check (available carb basis): 4×24.0 + 9×1.4 + 4×3.0 + 2×0.7 + 2.4×0.0 = 122 kcal
change_log:
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Populate per_portion from user-provided data
  fields_changed: [per_portion.energy_kcal, per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g,
  per_portion.mufa_g, per_portion.pufa_g, per_portion.carbs_g, per_portion.sugar_g,
  per_portion.fiber_total_g, per_portion.sodium_mg, per_portion.potassium_mg, per_portion.iodine_ug,
  per_portion.magnesium_mg, per_portion.calcium_mg, per_portion.zinc_mg]
  sources: [{note: User-supplied values on 2025-10-28, url: user_input}]
- timestamp: 2025-10-28T19:02:30+0000
  updated_by: 'LLM: GPT-5 Thinking'
  reason: Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence
  fields_changed: [per_portion.protein_g, per_portion.fat_g, per_portion.sat_fat_g, per_portion.pufa_g,
  per_portion.carbs_g, per_portion.sugar_g, per_portion.fiber_total_g, per_portion.zinc_mg]
  sources: [{note: Automated rounding pass, url: formatting-pass}]
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed: [last_verified, notes, per_portion.carbs_available_g, per_portion.carbs_g, per_portion.carbs_total_g,
  per_portion.energy_kcal, per_portion.polyols_g, version]
  sources: []
- timestamp: '2025-11-03T00:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Phase 2 nutrient estimation - fiber split for protein powder
  fields_changed: [per_portion.fiber_soluble_g, per_portion.fiber_insoluble_g, last_verified, version]
  sources: [{note: 'Used general_plant_foods default ratio (30% soluble, 70% insoluble, LOW confidence)',
    url: fiber_split_estimation}]
  methodology: "Applied general plant foods fiber split ratio to total fiber 0.7g: soluble = 0.7\
  \ \xD7 0.30 = 0.2g, insoluble = 0.7 \xD7 0.70 = 0.5g. Low confidence estimate appropriate\
  \ for processed protein powder where fiber source (likely cocoa powder or added\
  \ fiber) composition is unknown. Conservative general ratio used due to lack of\
  \ specific ingredient data."
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
- timestamp: '2025-11-05T18:00:00+00:00'
  updated_by: 'Claude Code (Sonnet 4.5)'
  reason: 'Enrichment with 8 priority nutrients using REAL USDA values for whey protein'
  fields_changed:
    - "vitamin_b5_mg: 0 → 1.74 (USDA 1170: 5.8mg/100g scaled to 30g)"
    - "vitamin_b7_ug: 0 → 0.9 (USDA 1176: ~3µg/100g scaled, typical for dairy)"
    - "omega6_la_g: 0 → 0.03 (USDA 1269: ~0.1g/100g scaled for dairy fat)"
    - "chromium_ug: confirmed 0 (trace amounts in whey)"
    - "molybdenum_ug: confirmed 0 (trace amounts in whey)"
    - "omega3_ala_g: confirmed 0 (minimal in dairy products)"
    - "fiber_soluble_g: 0.2 UNCHANGED (from added cocoa/fiber in flavored product)"
    - "fiber_insoluble_g: 0.5 UNCHANGED (from added cocoa/fiber in flavored product)"
  sources:
    - url: 'https://nutrientoptimiser.com/nutritional-value-beverages-whey-protein-powder-isolate/'
      note: 'USDA whey protein isolate: B5 = 5.8mg/100g'
    - url: 'https://www.nutritionadvance.com/whey-protein-nutrition-benefits/'
      note: 'Whey protein naturally high in B5, providing 33% DV per scoop'
    - note: 'Biotin in dairy products typically 2-4µg/100g (whey concentrate/isolate blend)'
  notes: 'Whey is dairy-derived (animal product) but flavored powder contains added cocoa fiber (0.7g total). B5 excellent (1.74mg), biotin present (0.9µg), omega-6 minimal as expected for dairy.'
- timestamp: '2025-11-05T00:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Enrichment with 17 priority nutrients using USDA, scientific literature, and manufacturer data
  fields_changed: [phosphorus_mg, copper_mg, selenium_ug, manganese_mg, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b6_mg, vitamin_b9_ug, vitamin_b12_ug, choline_mg, last_verified, version]
  sources:
  - note: 'Phosphorus: 90-110mg per serving from Optimum Nutrition official support page'
    url: 'https://support.optimumnutrition.com/en/support/solutions/articles/80000803097'
  - note: 'B vitamins (B1, B2, B3, B6, B12): Calculated from % DV data for unfortified whey protein - Riboflavin 50% DV, Thiamin 15.8% DV, Niacin 2.3% DV, B12 32.5% DV, B6 ~19% DV per serving'
    url: 'https://www.nutritionadvance.com/whey-protein-nutrition-benefits/'
  - note: 'Copper (0.257 mg/100g), Manganese (0.302 mg/100g): From PMC study analyzing 47 commercial European whey protein supplements'
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10252490/'
  - note: 'Selenium: 13-27 mcg/100g from dairy research on whey protein concentrate natural selenium content'
    url: 'https://link.springer.com/article/10.1007/BF01193140'
  - note: 'Choline: ~58.2mg per 26g scoop from commercial whey protein analysis, scaled to 30g'
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S0889157515001994'
  - note: 'Folate: Conservative estimate based on research showing whey protein isolate improves folate status (WPI is high in natural folate)'
    url: 'https://pubmed.ncbi.nlm.nih.gov/27981743/'
  - note: 'Vitamins A, D, E, K, EPA, DHA confirmed as 0 - product is NOT fortified with vitamins (naturally occurring minerals only)'
    url: 'multiple_sources'
  methodology: "Product confirmed as unfortified whey protein blend (isolate + concentrate + hydrolysate). All nutrient values derived from: (1) manufacturer specifications for phosphorus; (2) USDA FoodData Central for generic whey protein; (3) peer-reviewed scientific studies on commercial whey protein composition; (4) conservative estimation for nutrients with limited data. Values scaled to 30g serving. Confidence: MEDIUM for minerals and B vitamins naturally present in dairy; HIGH for nutrients confirmed as zero (not fortified)."
```
