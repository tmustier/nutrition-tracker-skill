## Chocolate Pistachio Praline Bar (half bar, 22g)

```yaml
id: pistachio_praline_bar_half_londons-chocolate_v1
version: 1
last_verified: 2025-11-04
source:
  venue: London's Chocolate Company
  menu_page: ""
  evidence:
  - "Product label nutrition (full bar = 44g): Energy 2452KJ/598Kcal, Fat 47.3g (sat 18.9g), Carbs 29.8g (sugars 30.1g - label error noted), Protein 12.2g, Salt 0.1g"
  - "Ingredients: Organic cocoa beans, raw unrefined cane sugar, cocoa butter, pistachios (NUTS), salt"
  - "Scaled to half bar (22g) by dividing all values by 2"
  - "Micronutrients estimated from USDA data for dark chocolate (70-85% cocoa) and pistachios"
aliases:
- "London's Chocolate Pistachio Praline half bar"
category: ingredient
portion:
  description: "half bar (22g)"
  est_weight_g: 22
  notes: "Half of a 44g chocolate bar with pistachios"
assumptions:
  salt_scheme: "normal"
  oil_type: "cocoa butter"
  prep: "packaged product"
  carbs_adjustment: "Label shows carbs 29.8g with sugars 30.1g (impossible). Assumed label error - used 30.1g for available carbs in calculations to be conservative."
  fiber: "Estimated at 2.0g per 44g bar (1.0g per 22g) based on typical dark chocolate (1-1.5g) and pistachio content (0.5-1g). Confidence: MEDIUM"
  fatty_acids: "MUFA/PUFA split estimated from cocoa butter (~73% oleic acid/MUFA) and pistachio profiles (~55% MUFA, ~32% PUFA of total fat). Confidence: MEDIUM"
  micronutrients_method: "Estimated from USDA FoodData Central for dark chocolate 70-85% cocoa (FDC ID 170273) and raw pistachios (FDC ID 170184), proportionally scaled to estimated ingredient composition (~60% cocoa/cocoa butter, ~20% sugar, ~15% pistachios, ~5% other). Confidence: MEDIUM"
  magnesium: "Dark chocolate (70-85%) contains ~228mg/100g, pistachios ~121mg/100g. Estimated 40mg for 22g based on ~18g cocoa/cocoa butter + ~3g pistachios. Confidence: MEDIUM-HIGH"
  iron: "Dark chocolate contains ~11.9mg/100g. Estimated 2.0mg for 22g portion. Confidence: MEDIUM"
  copper: "Both cocoa (~1.8mg/100g) and pistachios (~1.3mg/100g) are excellent sources. Estimated 0.4mg for 22g. Confidence: MEDIUM"
  potassium: "Estimated from cocoa (~715mg/100g) and pistachios (~1025mg/100g). Estimated 180mg for 22g. Confidence: MEDIUM"
per_portion:
  energy_kcal: 299.0
  protein_g: 6.1
  fat_g: 23.65
  sat_fat_g: 9.45
  mufa_g: 9.0
  pufa_g: 5.2
  trans_fat_g: 0.0
  cholesterol_mg: 0
  carbs_total_g: 16.1
  carbs_available_g: 15.1
  sugar_g: 15.1
  fiber_total_g: 1.0
  fiber_soluble_g: 0.3
  fiber_insoluble_g: 0.7
  polyols_g: 0.0
  sodium_mg: 20
  potassium_mg: 180
  iodine_ug: 0
  magnesium_mg: 40
  calcium_mg: 25
  iron_mg: 2.0
  zinc_mg: 1.0
  vitamin_c_mg: 0
  manganese_mg: 0.5
  copper_mg: 0.4
  selenium_ug: 2
  vitamin_d_ug: 0
  vitamin_e_mg: 1.5
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - "Fiber split (soluble/insoluble) estimated from typical cocoa fiber composition"
  - "MUFA/PUFA split estimated from cocoa butter and pistachio fatty acid profiles"
  - "Micronutrients estimated from ingredient analysis using USDA proxies"
  - "Label inconsistency noted: sugars (30.1g) > total carbs (29.8g) for 44g bar"
notes:
- "Pack nutrition for full 44g bar: 598 kcal, 12.2g protein, 47.3g fat (18.9g sat), 29.8g carbs (30.1g sugars - label error), 0.1g salt"
- "All values scaled by exactly 0.5 (half bar = 22g)"
- "Label shows impossible carb/sugar ratio - used 30.1g as available carbs, estimated 2g fiber for full bar"
- "Ingredients rich in magnesium, iron, copper from cocoa; vitamin E from pistachios"
- "Plant-based product: 0mg cholesterol, 0µg vitamin D, 0µg iodine, 0mg vitamin C"
- "Atwater validation: 4×6.1 + 9×23.65 + 4×15.1 + 2×1.0 = 299.45 kcal (within 0.2% of stated 299 kcal)"
change_log:
- timestamp: "2025-11-04T20:00:00+00:00"
  updated_by: "Claude Code (Sonnet 4.5)"
  reason: "Initial entry - complete nutrition estimation for London's Chocolate Pistachio Praline Bar (half bar, 22g)"
  fields_changed:
  - all fields
  sources:
  - note: "Pack label data provided by user, scaled from 44g to 22g"
  - note: "Micronutrients estimated using USDA FoodData Central: Dark Chocolate 70-85% (FDC 170273) and Pistachios raw (FDC 170184)"
  - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170273/"
    note: "USDA data for dark chocolate micronutrients"
  - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170184/"
    note: "USDA data for pistachio micronutrients"
```
