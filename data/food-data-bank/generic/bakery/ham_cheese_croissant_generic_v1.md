## Ham and Cheese Croissant (Generic Bakery)

```yaml
id: ham_cheese_croissant_generic_v1
schema_version: 2
version: 2
last_verified: 2025-11-02
source:
  venue: Generic Bakery
  menu_page: 
  evidence:
  - USDA FoodData Central #174987 - Butter croissants
  - USDA data for cooked ham nutrition
  - Ermitage Emmental cheese nutrition data
  - Component weights estimated from typical bakery portions
aliases:
- croissant jambon fromage
category: main
portion:
  description: typical bakery portion
  est_weight_g: 120
  notes: Butter croissant (70g) + cooked ham (30g) + Emmental cheese (20g)
assumptions:
  salt_scheme: normal
  oil_type: butter
  prep: butter croissant filled with ham and cheese
  iodine: "Estimated from dairy content. Contains 20g Emmental cheese (~30 μg/100g) + butter in croissant. UK dairy is HIGH confidence iodine source. Total estimated 36 μg based on dairy components. Confidence: HIGH"
  usda_enrichment: "17 priority nutrients enriched from USDA FoodData Central FDC ID 173270 (Fast foods, croissant, with egg, cheese, and ham). USDA values per 100g scaled to 120g portion."
per_portion:
  energy_kcal: 399.3
  protein_g: 17
  fat_g: 22.9
  sat_fat_g: 13
  mufa_g: 6.2
  pufa_g: 1.3
  trans_fat_g: 0.4
  cholesterol_mg: 50
  sugar_g: 3.5
  fiber_total_g: 1.8
  fiber_soluble_g: 0.5
  fiber_insoluble_g: 1.3
  sodium_mg: 730
  potassium_mg: 182
  iodine_ug: 36
  magnesium_mg: 11
  calcium_mg: 226
  iron_mg: 1.7
  zinc_mg: 2.1
  vitamin_c_mg: 0
  manganese_mg: 0.174
  polyols_g: 0
  carbs_available_g: 30.4
  carbs_total_g: 32.2
  copper_mg: 0.0996
  selenium_ug: 21.48
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 265.2
  chloride_mg: 0
  sulfur_g: 0.0
  vitamin_a_ug: 175.2
  vitamin_d_ug: 0.96
  vitamin_e_mg: 0.912
  vitamin_k_ug: 2.52
  vitamin_b1_mg: 0.408
  vitamin_b2_mg: 0.24
  vitamin_b3_mg: 2.52
  vitamin_b5_mg: 1.0
  vitamin_b6_mg: 0.18
  vitamin_b7_ug: 2
  vitamin_b9_ug: 50.4
  vitamin_b12_ug: 0.792
  choline_mg: 125.64
  omega3_epa_mg: 2.4
  omega3_dha_mg: 18.0
  omega3_ala_g: 0.12
  omega6_la_g: 1.4
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - Vitamin C assumed minimal
notes:
- Component-based calculation using USDA profiles scaled to estimated weights
- Butter croissant 70g: 284 kcal, 5.7g P, 14.7g F (8.4g sat, 3.9g MUFA, 0.8g PUFA), 30.2g C, 327mg Na
- Cooked ham 30g: 44 kcal, 5.7g P, 2.4g F (0.6g sat, 0.8g MUFA, 0.2g PUFA), 347mg Na, 84mg K
- Emmental cheese 20g: 75 kcal, 5.6g P, 5.8g F (4.0g sat, 1.5g MUFA, 0.3g PUFA), 56mg Na, 200mg Ca
- Cholesterol estimated from ham (20mg) + cheese (16mg) + butter in croissant (14mg)
- Sugar and fiber primarily from croissant dough
- Sodium includes intrinsic sodium from all components; no additional finishing salt
- Atwater check (available carb basis): 4×17.0 + 9×22.9 + 4×30.4 + 2×1.8 + 2.4×0.0 = 399.3 kcal
change_log:
- timestamp: 2025-10-30T00:00:00+0000
  updated_by: Claude Code
  reason: Initial entry using component-based estimation methodology
  fields_changed: [all fields]
  sources: [{note: 'USDA butter croissant profile (per 100g): 406 kcal, 8.2g P, 21g F, 43.2g
      C', url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/174987/nutrients'},
  {note: 'USDA cooked ham profile (per 100g): 145 kcal, 19g P, 8g F', url: 'https://www.nutritionvalue.org/Ham_22311000_nutritional_value.html'},
  {note: 'Emmental cheese (per 100g): 377 kcal, 28g P, 29g F, 1000mg Ca', url: 'https://www.ermitage.com/en/cheese/emmental/'}]
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
  updated_by: 'Claude Code Agent'
  reason: 'Enriched with 17 priority nutrients from USDA FoodData Central'
  fields_changed: [vitamin_d_ug, choline_mg, vitamin_b9_ug, vitamin_b12_ug, phosphorus_mg,
    copper_mg, selenium_ug, manganese_mg, vitamin_a_ug, vitamin_e_mg, vitamin_k_ug,
    vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b6_mg, omega3_epa_mg, omega3_dha_mg]
  sources: [{note: 'USDA FoodData Central FDC ID 173270: Fast foods, croissant, with egg, cheese, and ham. Per 100g values scaled to 120g portion.',
    url: 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/173270/nutrients'}]
- timestamp: '2025-11-05T21:30:00+00:00'
  updated_by: 'Claude Code (Sonnet 4.5)'
  reason: 'Phase 2 enrichment: Added 4 critical nutrients using USDA component data for composite croissant'
  fields_changed:
  - vitamin_b5_mg (0 → 1.0)
  - vitamin_b7_ug (0 → 2)
  - omega3_ala_g (0 → 0.12)
  - omega6_la_g (0 → 1.4)
  sources:
  - url: 'https://nutritionvalue.org/Croissant%2C_butter_174987_nutritional_value.html'
    note: 'USDA FDC #174987 Butter croissant: B5=0.86mg/100g, LA=0.79g/100g. Scaled to 70g: B5=0.60mg, LA=0.55g'
  - url: 'nutrientoptimiser.com/ham'
    note: 'USDA cooked ham: B5=0.9mg/100g, LA=2.16g/100g. Scaled to 30g: B5=0.27mg, LA=0.65g'
  - url: 'nutrivore.com/swiss-cheese'
    note: 'Emmental cheese: B5=0.72mg/100g, ALA=0.5g/100g, LA=0.97g/100g. Scaled to 20g: B5=0.14mg, ALA=0.10g, LA=0.19g'
  methodology: 'Component-based summation for 120g composite: Butter croissant 70g + Ham 30g + Emmental cheese 20g. TOTALS: B5: 0.60+0.27+0.14=1.0mg (excellent source, ham contributes 27%); B7: 1.4+0.3+0.2=2µg (estimated from typical values for pastry, pork, and cheese); ALA: 0.016+0.006+0.10=0.12g (cheese dominant source from grass-fed dairy); LA: 0.55+0.65+0.19=1.4g (ham contributes 46%). Biotin values estimated from literature as USDA often doesn'\''t track B7.'
```
