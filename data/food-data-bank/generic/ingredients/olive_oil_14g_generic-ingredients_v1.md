## Olive Oil (14g)

```yaml
id: olive_oil_14g_generic-ingredients_v1
version: 1
last_verified: 2025-11-03
source:
  venue: Generic Ingredients
  menu_page: ""
  evidence:
    - "USDA FoodData Central - Oil, olive, extra virgin"
    - "FDC ID: 748967"
aliases:
  - "Extra Virgin Olive Oil"
  - "EVOO"
category: ingredient
portion:
  description: "1 tablespoon (~1 tbsp)"
  est_weight_g: 14
  notes: "Extra virgin olive oil"
assumptions:
  salt_scheme: "unsalted"
  oil_type: "olive_oil"
  prep: "raw"
per_portion:
  energy_kcal: 123.8
  protein_g: 0.0
  fat_g: 14.0
  sat_fat_g: 1.9
  mufa_g: 10.4
  pufa_g: 1.5
  trans_fat_g: 0
  cholesterol_mg: 0
  carbs_total_g: 0.0
  carbs_available_g: 0.0
  sugar_g: 0.0
  fiber_total_g: 0.0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  polyols_g: 0.0
  sodium_mg: 0
  potassium_mg: 0
  iodine_ug: 0
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  vitamin_e_mg: 2.0
quality:
  confidence: high
  gaps:
    - "Vitamin E content estimated from typical EVOO composition"
notes:
  - "Scaled from USDA per 100g values: 884 kcal, 0g P, 100g F (13.8g sat, 72.9g MUFA, 10.5g PUFA), 0g C"
  - "1 tablespoon = ~13.5g, rounded to 14g for convenience"
  - "Predominantly monounsaturated fatty acids (74% oleic acid)"
  - "Rich in polyphenols and vitamin E (antioxidants)"
  - "Heart-healthy fat, Mediterranean diet staple"
  - "Zero carbs, zero protein, pure fat"
  - "Atwater check (available carb basis): 4×0.0 + 9×14.0 + 4×0.0 + 2×0.0 + 2.4×0.0 = 126.0 kcal (≈123.8 accounting for rounding)"
change_log:
  - timestamp: "2025-11-03T10:35:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Initial population with USDA nutrition data for 7g portion (1/2 tablespoon)"
    fields_changed:
      - "all fields"
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/748967/nutrients"
        note: "USDA FoodData Central - Olive oil, extra virgin"
  - timestamp: "2025-11-03T09:10:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Updated default portion from 1/2 tbsp (7g) to 1 tbsp (14g) for databank consistency"
    fields_changed:
      - "portion.description"
      - "portion.est_weight_g"
      - "all per_portion nutrition values"
      - "id"
      - "derived.vitamin_e_mg"
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/748967/nutrients"
        note: "USDA FoodData Central - Olive oil, extra virgin"
```
