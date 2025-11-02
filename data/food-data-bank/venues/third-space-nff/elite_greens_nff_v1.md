## Elite Greens Shake - Third Space Natural Fitness Food

```yaml
id: elite_greens_nff_v1
version: 2
last_verified: '2025-11-02'
source:
  venue: Third Space / Natural Fitness Food
  menu_page: ''
  evidence:
  - 'User-provided partial nutrition data: 350 kcal, 8g F, 43g C, 4g Fiber, 25g Protein'
  - 'Ingredient list from Third Space website: cold-pressed juice (2Boost) by 2-Juice
    featuring Apple, Baby Spinach, Cucumber, Parsley, Lemon & Ginger, with vanilla
    protein powder, oat milk & banana'
  - Natural Fitness Food shake categories (Lean/Fuel) for context
aliases:
- Elite Greens
- 2Boost shake
category: drink
portion:
  description: 1 complete shake
  est_weight_g: 370
  notes: Blended shake containing juice, protein powder, oat milk, and banana
assumptions:
  salt_scheme: normal
  oil_type: oat milk (barista-style, likely contains rapeseed/sunflower oil)
  prep: Cold-blended shake with cold-pressed juice base
per_portion:
  energy_kcal: 352
  protein_g: 25.0
  fat_g: 8.0
  sat_fat_g: 1.5
  mufa_g: 3.0
  pufa_g: 2.0
  trans_fat_g: 0
  cholesterol_mg: 20
  sugar_g: 26.0
  fiber_total_g: 4.0
  fiber_soluble_g: 2.2
  fiber_insoluble_g: 1.8
  sodium_mg: 100
  potassium_mg: 500
  iodine_ug: 5
  magnesium_mg: 50
  calcium_mg: 220
  iron_mg: 1.5
  zinc_mg: 1.5
  vitamin_c_mg: 25
  manganese_mg: 1.0
  polyols_g: 0.0
  carbs_available_g: 43.0
  carbs_total_g: 47.0
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps:
  - Fiber breakdown estimated from component analysis
  - Fat subtype breakdown estimated from oat milk composition
  - Micronutrients estimated from ingredient contributions
notes:
- 'Component breakdown: NFF Vanilla Whey (125 kcal, 22g P, 6.5g C, 1.4g F) + banana
  ~80g + oat milk ~180ml + 2Boost juice ~130ml'
- Fat breakdown (sat 1.5g + MUFA 3.0g + PUFA 2.0g) totals 6.5g, remainder 1.5g likely
  short-chain/other fats
- Fiber soluble (2.2g) mainly from banana pectin, oat milk beta-glucan, whey xanthan
  gum
- Fiber insoluble (1.8g) from banana cellulose, oat milk, juice greens
- High potassium from banana (280mg) and juice (150mg)
- Calcium fortified via oat milk (180mg)
- Vitamin C from juice greens, parsley, lemon (18mg) plus banana (7mg)
- 'Atwater check (available carb basis): 4×25.0 + 9×8.0 + 4×43.0 + 2×4.0 + 2.4×0.0
  = 352 kcal'
change_log:
- timestamp: 2025-10-31T00:00:00+0000
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial entry with component-based triangulation from user-provided macros
    and confirmed ingredient list
  fields_changed:
  - all fields
  sources:
  - url: user_input
    note: 'User-provided core nutrition data: 350 kcal, 8g F, 43g C, 4g Fiber, 25g
      Protein'
  - url: https://www.thirdspace.london/natural-fitness-food/
    note: 'Ingredient list: 2Boost juice (Apple, Baby Spinach, Cucumber, Parsley,
      Lemon, Ginger) + vanilla protein + oat milk + banana'
  - url: https://uk-ga.openfoodfacts.org/product/5065003325005/whey-protein-vanilla-natural-fitness-food
    note: NFF Vanilla Whey nutrition data for component analysis
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
