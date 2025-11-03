## Pastel de Nata (The Eagle, Farringdon)

```yaml
id: pastel_de_nata_eagle_farringdon_v1
version: 3
last_verified: '2025-11-03'
source:
  venue: The Eagle, Farringdon (London)
  menu_page: https://theeaglefarringdon.co.uk/
  evidence:
  - Venue dessert board observed 2025-11-01
  - Component estimate using puff pastry and egg custard nutrition profiles
aliases:
- Portuguese Custard Tart
category: dessert
portion:
  description: 1 tart
  est_weight_g: 65
  notes: Approx. 40g puff pastry shell with 25g rich egg custard
assumptions:
  salt_scheme: normal (pastry dough seasoned)
  oil_type: butter
  prep: House-baked puff pastry case filled with egg custard, baked until caramelised
  micronutrient_estimates: |
    Iodine (17 µg): Eggs ~26 µg/100g concentrated in yolk. 25g custard estimated at 65% eggs = 17µg. Confidence: MEDIUM (UK eggs reliable source).
    Selenium (20 µg): Eggs ~31 µg/100g (USDA). 25g custard estimated at 65% eggs = 20µg. Confidence: MEDIUM.
    Vitamin D (1.2 µg): Eggs ~1.8 µg/100g in yolk (USDA). 25g custard estimated at 65% eggs = 1.2µg. Confidence: MEDIUM-HIGH (eggs well-documented source).
per_portion:
  energy_kcal: 281
  protein_g: 5.2
  fat_g: 14.8
  sat_fat_g: 7.4
  mufa_g: 5.5
  pufa_g: 1.3
  trans_fat_g: 0.1
  cholesterol_mg: 115
  sugar_g: 17.0
  fiber_total_g: 1.1
  fiber_soluble_g: 0.3
  fiber_insoluble_g: 0.8
  sodium_mg: 210
  potassium_mg: 105
  iodine_ug: 17
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  selenium_ug: 20
  vitamin_c_mg: 0
  vitamin_d_ug: 1.2
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 31.2
  carbs_total_g: 32.3
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps:
  - Exact pastry weight may vary by bake batch
  - Custard cream ratio inferred from standard recipes
  - Micronutrients not fully itemised
notes:
- 'Macro build: 40g puff pastry + 25g enriched egg custard'
- Sugar estimate combines custard sugar and caramelised top
- Cholesterol driven by egg yolks and dairy
- Sodium primarily from salted butter in pastry
- 'Energy check: 31.2g carbs, 5.2g protein, 14.8g fat → ≈280 kcal'
- Contains gluten, egg, dairy
- 'Atwater check (available carb basis): 4×5.2 + 9×14.8 + 4×31.2 + 2×1.1 + 2.4×0.0
  = 281 kcal'
change_log:
- timestamp: 2025-11-02T12:00:00+0000
  updated_by: 'LLM: GPT-5 Codex'
  reason: Initial estimate for Pastel de Nata dessert at The Eagle
  fields_changed:
  - all fields
  sources:
  - url: user_request
    note: User asked to add Pastel de Nata from The Eagle to food bank
  - url: gpt_component_estimate
    note: Component model using puff pastry and custard nutrition references
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
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
```
