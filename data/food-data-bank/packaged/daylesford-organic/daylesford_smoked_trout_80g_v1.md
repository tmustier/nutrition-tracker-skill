## Smoked Trout (Daylesford, 80g)

```yaml
id: daylesford_smoked_trout_80g_v1
version: 3
last_verified: "2025-11-02"
source:
  venue: Daylesford Organic
  menu_page: https://www.daylesford.com/
  evidence:
  - "Product: Daylesford Smoked Trout (200g pack, Batch 6997, Use by 12.11.25)"
  - Dry salted & cold smoked on West Coast of Scotland
  - "Ingredients: Trout (96%), Salt, Sugar"
  - Official product label nutrition facts
aliases:
- Daylesford Trout
- Smoked Rainbow Trout
- Cold Smoked Trout
category: main
portion:
  description: 2 slices smoked trout
  est_weight_g: 80
  notes: Pond reared farmed rainbow trout, cold smoked, thinly sliced
assumptions:
  salt_scheme: normal
  oil_type: ""
  prep: Dry salted and cold smoked - traditional Scottish method
per_portion:
  energy_kcal: 161.4
  protein_g: 17.4
  fat_g: 10.2
  sat_fat_g: 1.8
  mufa_g: 2.5
  pufa_g: 5.9
  trans_fat_g: 0
  cholesterol_mg: 50
  sugar_g: 0.0
  fiber_total_g: 0.0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 480
  potassium_mg: 280
  iodine_ug: 0
  magnesium_mg: 24
  calcium_mg: 10
  iron_mg: 0.3
  zinc_mg: 0.4
  vitamin_c_mg: 0
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 0.0
  carbs_total_g: 0.0
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
  omega_3_total_g: 1.4
  epa_g: 0.4
  dha_g: 0.8
quality:
  confidence: high
  gaps:
  - Fat breakdown (MUFA/PUFA) estimated from typical rainbow trout composition
  - Micronutrients estimated from USDA rainbow trout data
  - Omega-3 breakdown estimated from farmed rainbow trout composition
notes:
- Rainbow trout (Oncorhynchus mykiss) - pond reared, farmed, Scottish origin
- 'Per 100g (from label): 202 kcal, 21.8g protein, 12.8g fat (2.3g sat), <0.1g carbs,
  1.5g salt'
- Higher fat content (12.8g/100g) than typical smoked trout - premium farmed product
- Cold smoked process preserves omega-3 fatty acids better than hot smoking
- Excellent source of complete protein (17.4g per 80g portion)
- Rich in omega-3 fatty acids (~1.4g total, including ~0.4g EPA and ~0.8g DHA)
- Very high in vitamin B12 (~6µg per 80g, ~250% DV) - estimated
- Good source of vitamin D (~120 IU per 80g) - estimated
- High in selenium (~10µg per 80g) - estimated
- Phosphorus content ~200mg per 80g - estimated
- "Sodium: 480mg per 80g (from 1.2g salt)"
- Sugar listed in ingredients but negligible in final product (<0.1g/100g)
- PUFA includes omega-3 (EPA+DHA) and some omega-6
- Zero carb, keto-friendly protein source
- Store refrigerated 0-5°C, consume within 3 days once opened
- May contain bones - check before eating
- 'Atwater check (available carb basis): 4×17.4 + 9×10.2 + 4×0.0 + 2×0.0 + 2.4×0.0
  = 161.4 kcal'
change_log:
- timestamp: 2025-11-01T09:00:00+0000
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial entry for Daylesford smoked trout - user consumed on crispbread
    for breakfast
  fields_changed:
  - all fields
  sources:
  - url: https://www.ocado.com/products/daylesford-smoked-trout-619556011
    note: Daylesford Smoked Trout product listing
  - url: https://fdc.nal.usda.gov/
    note: USDA FoodData Central smoked trout baseline values
  - url: user_request
    note: User consumed 80g (2 slices) Daylesford smoked trout on 2025-11-01 at 09:00
- timestamp: 2025-11-01T09:30:00+0000
  updated_by: Claude Code (Sonnet 4.5)
  reason: Updated with actual product label nutrition facts - corrected major underestimation
    of calories and fat
  fields_changed:
  - version
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.carbs_g
  - per_portion.sugar_g
  - per_portion.sodium_mg
  - derived.omega_3_total_g
  - derived.epa_g
  - derived.dha_g
  - quality.confidence
  - quality.gaps
  sources:
  - url: product_label
    note: 'Daylesford Smoked Trout 200g pack label: 202 kcal, 21.8g protein, 12.8g
      fat (2.3g sat), <0.1g carbs per 100g. Batch 6997, use by 12.11.25'
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
```
