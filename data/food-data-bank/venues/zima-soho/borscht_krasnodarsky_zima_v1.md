## Borscht Krasnodarsky with Beef (Zima Soho)

```yaml
id: borscht_krasnodarsky_zima_v1
version: 3
last_verified: "2025-11-03"
source:
  venue: Zima, Soho, London
  menu_page: https://zimarestaurant.co.uk/
  evidence:
  - User-provided nutrition data for full portion including all sides
  - Traditional beetroot soup with beef, served with sour cream (~30g), salo (~20g
    cured pork fat), and 1 slice Borodinsky rye bread (~32g)
  - Complete dish nutrition from venue analysis
aliases:
- Borscht with Beef
- Krasnodarsky Borscht
category: main
portion:
  description: restaurant portion with traditional sides
  est_weight_g: 382
  notes: Bowl of borscht (~300ml) with beef, served with sour cream (~30g), salo (~20g),
    and 1 slice Borodinsky rye bread (~32g)
assumptions:
  salt_scheme: normal
  oil_type: traditional preparation
  prep: Traditional Russian beetroot soup with beef, served with sour cream, cured
    pork fat (salo), and Borodinsky rye bread on the side
per_portion:
  energy_kcal: 469.1
  protein_g: 8.1
  fat_g: 32.5
  sat_fat_g: 13.5
  mufa_g: 14.3
  pufa_g: 3.3
  trans_fat_g: 0.4
  cholesterol_mg: 87
  sugar_g: 9.3
  fiber_total_g: 5.3
  fiber_soluble_g: 2.3
  fiber_insoluble_g: 3.0
  sodium_mg: 931
  potassium_mg: 595
  iodine_ug: 19
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 33.4
  carbs_total_g: 38.7
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
  fat_unassigned_g: 1.0
quality:
  confidence: high
  gaps:
  - micronutrients (iodine, magnesium, calcium, iron, zinc, vitamin_c, manganese)
    not provided
notes:
- 447 kcal total for complete dish with all sides
- Borscht bowl approximately 300ml
- "Sides: sour cream ~30g, salo ~20g, Borodinsky rye bread ~32g (1 slice)"
- Estimated total dish weight 382g (300g soup + 30g sour cream + 20g salo + 32g bread)
- Traditional Russian preparation with beef and beetroot
- Salo is traditional Ukrainian/Russian cured pork fat
- Borodinsky rye is a dark rye bread with coriander and molasses
- 'Atwater check (available carb basis): 4×8.1 + 9×32.5 + 4×33.4 + 2×5.3 + 2.4×0.0
  = 469.1 kcal'
change_log:
- timestamp: 2025-10-30 00:00:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Initial entry for Zima Soho borscht with complete nutrition data from venue
    analysis
  fields_changed:
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.trans_fat_g
  - per_portion.cholesterol_mg
  - per_portion.carbs_g
  - per_portion.sugar_g
  - per_portion.fiber_total_g
  - per_portion.fiber_soluble_g
  - per_portion.fiber_insoluble_g
  - per_portion.sodium_mg
  - per_portion.potassium_mg
  - portion.est_weight_g
  sources:
  - url: https://zimarestaurant.co.uk/
    note: Zima restaurant, Soho, London - traditional Russian cuisine
  - url: user_input
    note: Complete nutrition data provided for full portion including borscht, sour
      cream, salo, and Borodinsky rye bread
- timestamp: "2025-11-02T19:20:00+00:00"
  updated_by: "LLM: GPT-5 Codex"
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed:
  - derived.energy_from_macros_kcal
  - last_verified
  - notes
  - per_portion.carbs_available_g
  - per_portion.carbs_g
  - per_portion.carbs_total_g
  - per_portion.energy_kcal
  - per_portion.polyols_g
  - version
  sources: []
- timestamp: "2025-11-03T15:44:11+00:00"
  updated_by: "LLM: Claude Code"
  reason: Add iodine estimate from beef and salo (LOW priority nutrient completion)
  fields_changed:
  - last_verified
  - per_portion.iodine_ug
  - version
  sources:
  - url: https://fdc.nal.usda.gov/
    note: "USDA FoodData Central: Meat typically ~5 µg/100g. 382g dish with beef in soup + 20g salo, estimated meat content = 19µg. Confidence: LOW-MEDIUM (meat is minor iodine source, portion estimate has uncertainty)"
```
