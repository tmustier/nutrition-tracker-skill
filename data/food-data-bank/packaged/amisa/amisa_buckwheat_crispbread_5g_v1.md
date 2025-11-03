## Amisa Buckwheat Crispbread (per piece, 5g)

```yaml
id: amisa_buckwheat_crispbread_5g_v1
version: 4
last_verified: '2025-11-03'
source:
  venue: Amisa (Packaged Product)
  menu_page: ''
  evidence:
  - Amisa official UK product page
  - Multiple UK retailer listings (Tesco, Ocado, Holland & Barrett)
aliases:
- Amisa Organic Gluten Free Buckwheat Crispbread
category: ingredient
portion:
  description: 1 crispbread slice
  est_weight_g: 5
  notes: 'Organic, gluten-free, only 2 ingredients: buckwheat flour (98.5%) + sea
    salt (1.5%)'
assumptions:
  salt_scheme: light
  oil_type: ''
  prep: baked crispbread
per_portion:
  energy_kcal: 17.3
  protein_g: 0.5
  fat_g: 0.1
  sat_fat_g: 0.0
  mufa_g: 0.1
  pufa_g: 0.0
  trans_fat_g: 0.0
  cholesterol_mg: 0
  sugar_g: 0.1
  fiber_total_g: 0.4
  fiber_soluble_g: 0.1
  fiber_insoluble_g: 0.3
  sodium_mg: 24
  potassium_mg: 0
  iodine_ug: 0
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 3.4
  carbs_total_g: 3.8
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: high
  gaps:
  - Fat split estimated from buckwheat composition
  - Micronutrients not labeled
notes:
- 'Scaled from per 100g values: 340 kcal, 10.8g P, 2.7g F (0.63g sat), 68.2g C, 1.3g
  sugar, 8.4g fiber, 1.2g salt (480mg sodium)'
- Weight per crispbread confirmed at 5g by user
- 120g package contains 24 crispbreads
- Vegan, organic, gluten-free certified
- 'Atwater check (available carb basis): 4×0.5 + 9×0.1 + 4×3.4 + 2×0.4 + 2.4×0.0 =
  17.3 kcal'
change_log:
- timestamp: 2025-10-30T00:00:00+0000
  updated_by: Claude Code
  reason: Initial entry for Thomas's food diary tracking
  fields_changed:
  - all fields
  sources:
  - url: https://amisa.co.uk/products/amisa-organic-gluten-free-buckwheat-crispbread/
    note: Amisa buckwheat crispbread nutrition (per 100g)
- timestamp: 2025-10-30T00:00:00+0000
  updated_by: Claude Code
  reason: Corrected weight from 8g to 5g per crispbread based on user confirmation;
    recalculated all nutrition values
  fields_changed:
  - portion.est_weight_g
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.carbs_g
  - per_portion.fiber_total_g
  - per_portion.sodium_mg
  - id
  sources:
  - url: user_correction
    note: User confirmed crispbread weight is 5g per piece
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed:
  - last_verified
  - notes
  - per_portion.carbs_available_g
  - per_portion.carbs_g
  - per_portion.carbs_total_g
  - per_portion.energy_kcal
  - per_portion.polyols_g
  - version
  sources: []
- timestamp: '2025-11-03T00:00:00+00:00'
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Phase 2 nutrient estimation - fiber split for buckwheat crispbread
  fields_changed:
  - per_portion.fiber_soluble_g
  - per_portion.fiber_insoluble_g
  - last_verified
  - version
  sources:
  - url: references/FIBER-SPLIT-ESTIMATION-REFERENCE.yaml
    note: Used grains.quinoa category for ancient grains (25% soluble, 75% insoluble, LOW confidence)
  methodology: 'Applied ancient grains (quinoa/buckwheat) fiber split ratio to total fiber 0.4g: soluble = 0.4 × 0.25 = 0.1g, insoluble = 0.4 × 0.75 = 0.3g. Buckwheat is a pseudo-cereal similar to quinoa. Product is 98.5% buckwheat flour. Low confidence estimate due to limited specific data on buckwheat fiber composition, but more specific than general plant foods category.'
```
