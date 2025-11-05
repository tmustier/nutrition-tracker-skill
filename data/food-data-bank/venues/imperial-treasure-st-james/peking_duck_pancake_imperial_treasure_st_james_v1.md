## Peking Duck Pancake (Imperial Treasure St. James)

```yaml
id: peking_duck_pancake_imperial_treasure_st_james_v1
schema_version: 2
version: 1
last_verified: 2025-11-02
source:
  venue: Peking Duck Pancake (Imperial Treasure St. James)
  menu_page: 
  evidence:
  - USDA roasted duck (meat and skin): 337 kcal, 18.99g protein, 28.35g fat (10g sat, 12.9g MUFA, 3.65g PUFA) per 100g - https://tools.myfooddata.com/nutrition-facts/172411/wt1
  - Hoisin sauce USDA: 35 kcal, 7g carbs, 4g sugar, 258mg sodium per 16g (1 tbsp) - https://www.nutritionvalue.org/Hoisin_sauce_41420250_nutritional_value.html
  - Mandarin pancake: 128 kcal, 19g carbs, 2g protein, 4g fat per pancake (~35g) - https://www.snapcalorie.com/nutrition/peking_duck_pancake_nutrition.html
  - USDA cucumber: 15 kcal, 3.63g carbs per 100g - https://www.recipal.com/ingredients/2998-nutrition-facts-calories-protein-carbs-fat-cucumber-with-peel-raw
  - USDA spring onion: 32 kcal, 7.4g carbs, 1.83g protein per 100g - https://www.nutritionvalue.org/Onions,_raw,_spring_or_scallions_(includes_tops_and_bulb)_nutritional_value.html
  - USDA sesame oil: 884 kcal, 100g fat (14g sat, 40g MUFA, 42g PUFA) per 100g - https://foodstruct.com/food/sesame-oil
  - Component-based estimation method per ESTIMATE.md guidelines
aliases:
category: main
portion:
  description: 1 assembled pancake
  est_weight_g: 68
  notes: Typical Peking duck pancake with duck meat, wrapper, hoisin sauce, cucumber, and spring onion
assumptions:
  salt_scheme: light
  oil_type: sesame oil
  prep: "Component-based estimation: 35g roasted duck meat and skin, 15g mandarin pancake wrapper, 8g hoisin sauce, 5g cucumber, 3g spring onion, 2g sesame oil for cooking wrapper"
per_portion:
  energy_kcal: 210
  protein_g: 7.6
  fat_g: 13.6
  sat_fat_g: 4.2
  mufa_g: 6
  pufa_g: 2.6
  trans_fat_g: 0
  cholesterol_mg: 30
  sugar_g: 2
  fiber_total_g: 0.1
  fiber_soluble_g: 0
  fiber_insoluble_g: 0.1
  sodium_mg: 179
  potassium_mg: 77
  iodine_ug: 3
  magnesium_mg: 6
  calcium_mg: 2
  iron_mg: 0.9
  zinc_mg: 0.7
  vitamin_c_mg: 1
  manganese_mg: 0.02
  polyols_g: 0
  carbs_available_g: 12
  carbs_total_g: 12
  copper_mg: 0.08
  selenium_ug: 5
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 79
  chloride_mg: 0
  sulfur_mg: 0
  vitamin_a_ug: 5
  vitamin_d_ug: 0.1
  vitamin_e_mg: 0.3
  vitamin_k_ug: 1
  vitamin_b1_mg: 0.1
  vitamin_b2_mg: 0.15
  vitamin_b3_mg: 2.0
  vitamin_b5_mg: 0.5
  vitamin_b6_mg: 0.07
  vitamin_b7_ug: 1
  vitamin_b9_ug: 9
  vitamin_b12_ug: 0.1
  choline_mg: 20
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
  - cholesterol
  - potassium
  - magnesium
  - manganese
  estimated_nutrients:
  - name: fiber_soluble_g
    value: 0
    confidence: medium
    method: Total fiber 0.1g split using vegetables.squashes ratio (33% soluble). 0.1g × 33% = 0.033g, rounds to 0.0g
  - name: fiber_insoluble_g
    value: 0.1
    confidence: medium
    method: Total fiber 0.1g split using vegetables.squashes ratio (67% insoluble). 0.1g × 67% = 0.067g, rounds to 0.1g
  - name: iodine_ug
    value: 3
    confidence: low-medium
    method: Duck meat 35g. Meat typically ~5 µg/100g. Total dish 68g × 5 µg/100g = 3.4 µg, rounded to 3 µg
notes:
- Rigorous component-based estimation following ESTIMATE.md methodology
- All components based on USDA or reliable nutrition databases
- Duck: 35g roasted meat with skin (337 kcal/100g, 28.35g fat, 18.99g protein)
- Pancake wrapper: 15g mandarin pancake (scaled from 128 kcal per 35g pancake)
- Hoisin sauce: 8g (half tablespoon, 35 kcal per 16g)
- Vegetables: 5g cucumber + 3g spring onion
- Sesame oil: 2g for cooking wrapper (40% MUFA, 42% PUFA)
- Total weight: 68g per assembled pancake
- Atwater validation: 4×7.6 + 4×12.0 + 9×13.6 = 200.8 kcal (4.4% discrepancy, within ±5% tolerance)
- Salt scheme: light (primary sodium from hoisin sauce, 129mg + ~50mg from wrapper = 179mg total)
change_log:
- timestamp: 2025-11-02
  reason: Initial entry - component-based estimation for Peking duck pancake
  fields_changed: [all fields]
  evidence: Complete USDA-based analysis of all components with detailed fatty acid breakdown
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
- timestamp: "2025-11-05T12:55:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5 (Agent 3)"
  reason: "Schema v2 enrichment: Complete nutrient profile for Peking duck pancake (35g duck + 15g pancake + condiments). Added 19 missing nutrients from duck meat and enriched flour. B-vitamins rich from duck (B3=2.0mg, B5=0.5mg). Corrected cholesterol to 30mg (duck contains cholesterol). Phosphorus (79mg), choline (20mg)."
  fields_changed:
  - per_portion.cholesterol_mg
  - per_portion.potassium_mg
  - per_portion.magnesium_mg
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
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/172409/nutrients
    note: "USDA FDC 172409 - Duck, domesticated, meat and skin, cooked, roasted (35g). Duck provides: B1=0.06mg, B2=0.1mg, B3=1.7mg, B5=0.4mg, B6=0.06mg, B12=0.1µg, phosphorus=55mg, choline=18mg, selenium=5µg, copper=0.08mg, vitamin A=5µg, D=0.1µg, E=0.2mg, K=1µg, potassium=77mg, magnesium=6mg, cholesterol=30mg. Pancake (15g enriched flour) adds: B1=0.03mg, B2=0.05mg, B3=0.24mg, B9=6µg, phosphorus=24mg. Confidence: HIGH (USDA duck + pancake components)"
```
