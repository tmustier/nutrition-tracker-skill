## Orange 'Jaffa Cake' Slice with Crème Fraîche (The Eagle, Farringdon)

```yaml
id: orange_jaffa_cake_slice_creme_fraiche_eagle_farringdon_v1
version: 3
last_verified: '2025-11-02'
source:
  venue: The Eagle, Farringdon (London)
  menu_page: https://theeaglefarringdon.co.uk/
  evidence:
  - Venue dessert board observed 2025-11-01
  - Component estimate for sponge cake with orange jelly, dark chocolate glaze, and
    crème fraîche
  - GPT-5 Pro refined portion estimate logged 2025-11-01 14:13
aliases:
- Orange Jaffa Cake with Crème Fraîche
category: dessert
portion:
  description: 1 plated slice with crème fraîche
  est_weight_g: 170
  notes: Approx. 140g orange sponge slice with orange jelly & chocolate glaze plus
    30g crème fraîche
assumptions:
  salt_scheme: light
  oil_type: butter
  prep: Citrus sponge layered with orange jelly, dipped in dark chocolate and served
    with a dollop of crème fraîche
per_portion:
  energy_kcal: 630.2
  protein_g: 7.0
  fat_g: 37.0
  sat_fat_g: 17.0
  mufa_g: 12.0
  pufa_g: 2.3
  trans_fat_g: 0.3
  cholesterol_mg: 126
  sugar_g: 46.0
  fiber_total_g: 2.6
  fiber_soluble_g: 0.6
  fiber_insoluble_g: 2.0
  sodium_mg: 385
  potassium_mg: 255
  iodine_ug: 0
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 66.0
  carbs_total_g: 68.6
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps:
  - Slice size varies depending on cake pan
  - Chocolate thickness inferred from similar desserts
  - Micronutrient profile not detailed
notes:
- 'Component breakdown: ~140g orange sponge with jelly and chocolate glaze plus 30g
  full-fat crème fraîche (~170g plate)'
- Sugar load concentrated in sponge syrup and orange jelly
- Fat split reflects butter + crème fraîche saturated fat with cocoa butter MUFA
- 'Energy cross-check: 66g carbs, 7.0g protein, 37.0g fat → ≈630 kcal'
- Contains gluten, egg, dairy
- 'Atwater check (available carb basis): 4×7.0 + 9×37.0 + 4×66.0 + 2×2.6 + 2.4×0.0
  = 630.2 kcal'
change_log:
- timestamp: 2025-11-02T12:05:00+0000
  updated_by: 'LLM: GPT-5 Codex'
  reason: Initial estimate for Orange 'Jaffa Cake' slice with crème fraîche at The
    Eagle
  fields_changed:
  - all fields
  sources:
  - url: user_request
    note: User asked to add Orange 'Jaffa Cake' dessert with crème fraîche to food
      bank
  - url: gpt_component_estimate
    note: Component model combining sponge, chocolate glaze, orange jelly, and crème
      fraîche
- timestamp: 2025-11-02T14:00:00+0000
  updated_by: 'LLM: GPT-5 Codex'
  reason: Scaled portion and macros to align with GPT-5 Pro refined estimate
  fields_changed:
  - portion.est_weight_g
  - portion.notes
  - per_portion
  - derived.energy_from_macros_kcal
  - source.evidence
  - notes
  sources:
  - url: user_follow_up
    note: GPT-5 Pro estimate shared 2025-11-01 14:13 with larger slice weight and
      crème fraîche portion
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
