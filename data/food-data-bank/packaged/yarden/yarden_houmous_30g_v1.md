## Yarden Houmous (30g serving)

```yaml
id: yarden_houmous_30g_v1
version: 3
last_verified: "2025-11-03"
source:
  venue: Yarden (Packaged Product)
  menu_page: ""
  evidence:
  - "Tesco product page #250438255"
  - Waitrose product listing
  - FatSecret UK nutritional database
aliases:
- Yarden Hummus
category: ingredient
portion:
  description: dollop / 2 tbsp
  est_weight_g: 30
  notes: Kosher, vegetarian, tahini-based houmous
assumptions:
  salt_scheme: normal
  oil_type: sunflower or olive oil
  prep: packaged tahini-based houmous
per_portion:
  energy_kcal: 105.6
  protein_g: 2.0
  fat_g: 9.6
  sat_fat_g: 1.0
  mufa_g: 4.5
  pufa_g: 4.1
  trans_fat_g: 0.0
  cholesterol_mg: 0
  sugar_g: 0.2
  fiber_total_g: 1.4
  fiber_soluble_g: 0.4
  fiber_insoluble_g: 1.0
  sodium_mg: 120
  potassium_mg: 0
  iodine_ug: 0
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 2.1
  carbs_total_g: 3.5
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps:
  - MUFA/PUFA estimated from typical tahini/oil composition
  - Micronutrients not on label
  - Portion size "dollop" estimated at 30g
notes:
- 'Scaled from per 100g values: 352 kcal, 6.8g P, 32g F (3.2g sat), 7.0g C, 0.6g sugar,
  4.5g fiber, 1.0g salt'
- 30g serving = typical "dollop" or 2 tablespoons
- Fat composition estimated from sesame tahini (high MUFA) + vegetable oil blend
- Contains sesame; may contain eggs, soya, and mustard
- Available at Tesco, Waitrose, Morrisons; 250g tubs
- 'Atwater check (available carb basis): 4×2.0 + 9×9.6 + 4×2.1 + 2×1.4 + 2.4×0.0 =
  105.6 kcal'
change_log:
- timestamp: 2025-10-30T00:00:00+0000
  updated_by: Claude Code
  reason: Initial entry for Thomas's food diary tracking
  fields_changed:
  - all fields
  sources:
  - url: https://www.tesco.com/groceries/en-GB/products/250438255
    note: Yarden Houmous 250g nutrition facts (per 100g)
- timestamp: "2025-11-02T19:20:00+00:00"
  updated_by: "LLM: GPT-5 Codex"
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
- timestamp: "2025-11-03T00:00:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: Phase 2 nutrient estimation - fiber split for chickpea-based houmous
  fields_changed:
  - per_portion.fiber_soluble_g
  - per_portion.fiber_insoluble_g
  - last_verified
  - version
  sources:
  - url: fiber_split_estimation
    note: Used legumes.chickpeas category (32% soluble, 68% insoluble, HIGH confidence)
  methodology: "Applied chickpea fiber split ratio to total fiber 1.4g: soluble = 1.4 × 0.32 = 0.4g, insoluble = 1.4 × 0.68 = 1.0g. Houmous is chickpea-based, making this category highly appropriate. High confidence estimation based on well-documented chickpea fiber composition (30-35% soluble per USDA data, consistent with Marlett et al. 2002)."
```
