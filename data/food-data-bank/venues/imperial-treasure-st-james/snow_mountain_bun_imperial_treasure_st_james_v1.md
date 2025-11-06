## Snow Mountain Bun (Imperial Treasure St. James)

```yaml
id: snow_mountain_bun_imperial_treasure_st_james_v1
schema_version: 2
version: 1
last_verified: 2025-11-02
source:
  venue: Snow Mountain Bun (Imperial Treasure St. James)
  menu_page: 
  evidence:
  - Imperial Treasure UK Facebook: Baked Snow Mountain Bun with Ibérico Char Siu Pork
  - Snow mountain bun recipes: hangrywifey.wixsite.com, namethedish.com
  - Char siu nutrition data from multiple sources (280-440 kcal/100g range)
  - Sweet bread nutrition: 290-367 kcal/100g (various sources)
  - Component-based estimation: 47g dough + 24g filling + 7g topping = 78g total
aliases:
- Baked BBQ Pork Bun
- Snow Cap Bun
- Crispy Char Siu Bao
category: dessert
portion:
  description: 1 piece
  est_weight_g: 78
  notes: Estimated from typical dim sum baked char siu bao (60-80g range), fine dining portion
assumptions:
  salt_scheme: normal
  oil_type: butter
  prep: baked with snow mountain topping (butter-flour-sugar crust)
  iodine_estimation: "Estimated from dairy components: dough contains ~15g milk (47g × 32% = 6 μg @ 40 μg/100g), topping contains ~3.5g butter (0.4 μg @ 10 μg/100g), filling contains 24g pork (1.2 μg @ 5 μg/100g). Total: 7.6 μg rounded to 8 μg. Confidence: MEDIUM (dairy-based estimate)."
per_portion:
  energy_kcal: 250
  protein_g: 9.3
  fat_g: 10
  sat_fat_g: 4.4
  mufa_g: 3.9
  pufa_g: 1.1
  trans_fat_g: 0.1
  cholesterol_mg: 25
  sugar_g: 8.2
  fiber_total_g: 0.9
  fiber_soluble_g: 0.3
  fiber_insoluble_g: 0.6
  sodium_mg: 318
  potassium_mg: 90
  iodine_ug: 8
  magnesium_mg: 12
  calcium_mg: 45
  iron_mg: 1.2
  zinc_mg: 0.6
  vitamin_c_mg: 0
  manganese_mg: 0.4
  polyols_g: 0
  carbs_available_g: 30.8
  carbs_total_g: 31.7
  copper_mg: 0.02
  selenium_ug: 10
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 111
  chloride_mg: 0
  sulfur_g: 0.0
  vitamin_a_ug: 49
  vitamin_d_ug: 0.1
  vitamin_e_mg: 0.1
  vitamin_k_ug: 0.5
  vitamin_b1_mg: 0.5
  vitamin_b2_mg: 0.3
  vitamin_b3_mg: 4.2
  vitamin_b5_mg: 0.4
  vitamin_b6_mg: 0.16
  vitamin_b7_ug: 1
  vitamin_b9_ug: 87
  vitamin_b12_ug: 0.2
  choline_mg: 24
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
  - iodine
  - manganese
  - fiber split
notes:
- Component breakdown: Enriched dough 47g (~300 kcal/100g), Ibérico char siu filling 24g (~280 kcal/100g), snow mountain topping 7g (~580 kcal/100g)
- Dough: sweet bread base with flour, milk, sugar, butter, yeast (141 kcal, 4.2g P, 2.8g F, 25.4g C)
- Filling: premium BBQ pork with sweet sauce (67 kcal, 4.8g P, 4.3g F, 3.4g C)
- Topping: butter-flour-sugar crust creates snow-like appearance (41 kcal, 0.3g P, 3.2g F, 2.7g C)
- Atwater validation: 4×9.3 + 4×30.8 + 9×10.0 = 250.4 kcal (within 0.2% of stated)
- Fat breakdown validated: 4.4 + 3.9 + 1.1 + 0.1 = 9.5g of 10.0g total (0.5g unassigned)
- User consumed 1 piece from portion of 3 at Imperial Treasure St. James
change_log:
- timestamp: 2025-11-02
  reason: Initial entry for Snow Mountain Bun using component-based estimation
  fields_changed: [all fields]
  evidence: Research from Imperial Treasure UK social media, recipe sites, and nutrition databases
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
- timestamp: "2025-11-05T13:05:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5 (Agent 3)"
  reason: "Schema v2 enrichment: Complete nutrient profile for snow mountain bun (BBQ pork 24g + enriched flour dough 47g + butter topping 7g). Added 18 missing nutrients. B-vitamins excellent from pork and enriched flour (B1=0.5mg, B3=4.2mg, B9=87µg). Vitamin A (49µg from butter topping), phosphorus (111mg), choline (24mg from pork), selenium (10µg)."
  fields_changed:
  - per_portion.manganese_mg
  - per_portion.copper_mg
  - per_portion.selenium_ug
  - per_portion.phosphorus_mg
  - per_portion.vitamin_a_ug
  - per_portion.vitamin_d_ug
  - per_portion.vitamin_e_mg
  - per_portion.vitamin_k_ug
  - per_portion.vitamin_b1_mg
  - per_portion.vitamin_b2_mg
  - per_portion.vitamin_b3_mg
  - per_portion.vitamin_b5_mg
  - per_portion.vitamin_b6_mg
  - per_portion.vitamin_b7_ug
  - per_portion.vitamin_b9_ug
  - per_portion.vitamin_b12_ug
  - per_portion.choline_mg
  - version
  sources:
  - url: https://fdc.nal.usda.gov/
    note: "USDA data for components: Roasted pork (24g) provides B1=0.14mg, B2=0.07mg, B3=1.4mg, B5=0.2mg, B6=0.14mg, B12=0.2µg, phosphorus=60mg, choline=24mg, selenium=10µg, copper=0.02mg. Enriched flour dough (47g) adds B1=0.37mg, B2=0.23mg, B3=2.8mg, B9=86µg, phosphorus=51mg, manganese=0.4mg. Butter topping (7g) contributes vitamin A=48µg. Confidence: HIGH (USDA pork + flour components)"
```
