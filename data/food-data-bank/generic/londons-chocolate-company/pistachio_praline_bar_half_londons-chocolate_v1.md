## Chocolate Pistachio Praline Bar (half bar, 22g)

```yaml
id: pistachio_praline_bar_half_londons-chocolate_v1
version: 2
schema_version: 2
last_verified: 2025-11-05
source:
  venue: London's Chocolate Company
  menu_page: ""
  evidence:
  - "Product label nutrition PER 100g: Energy 2452KJ/598Kcal, Fat 47.3g (sat 18.9g), Carbs 29.8g (sugars 30.1g), Protein 12.2g, Salt 0.1g"
  - "Bar weight: 44g full bar, 22g half bar"
  - "Ingredients: Organic cocoa beans, raw unrefined cane sugar, cocoa butter, pistachios (NUTS), salt"
  - "Scaled to 22g portion: multiply per-100g values by 0.22"
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
  carbs_adjustment: "Label per 100g shows carbs 29.8g with sugars 30.1g - likely typo, used 29.8g for calculations. Estimated 6.5g fiber per 100g (typical for 70-85% dark chocolate with nuts)."
  fiber: "Estimated at 6.5g per 100g (1.4g per 22g) based on typical dark chocolate 70%+ (5-7g/100g) and pistachio content. Confidence: MEDIUM"
  fatty_acids: "MUFA/PUFA split estimated from cocoa butter (~73% oleic acid/MUFA) and pistachio profiles (~55% MUFA, ~32% PUFA of total fat). Confidence: MEDIUM"
  micronutrients_method: "Estimated from USDA FoodData Central for dark chocolate 70-85% cocoa (FDC ID 170273) and raw pistachios (FDC ID 170184), proportionally scaled to estimated ingredient composition (~60% cocoa/cocoa butter, ~20% sugar, ~15% pistachios, ~5% other). Component-based calculation: weighted average (60% × chocolate nutrients + 15% × pistachio nutrients) scaled to 22g portion. 17 priority nutrients enriched 2025-11-05. Confidence: MEDIUM"
  magnesium: "Dark chocolate (70-85%) contains ~228mg/100g. Estimated 50mg/100g for this bar (with sugar dilution), scaled to 11mg for 22g. Confidence: MEDIUM"
  iron: "Dark chocolate contains ~11.9mg/100g. Estimated 9mg/100g for this bar, scaled to 2.0mg for 22g. Confidence: MEDIUM"
  copper: "Both cocoa (~1.77mg/100g) and pistachios (~1.3mg/100g) are excellent sources. Component-based: (60%×1.77 + 15%×1.3) = 1.26mg/100g, scaled to 0.28mg for 22g. Confidence: MEDIUM"
  potassium: "Estimated from cocoa (~715mg/100g) and pistachios. Estimated 350mg/100g, scaled to 77mg for 22g. Confidence: MEDIUM"
per_portion:
  energy_kcal: 131.6
  protein_g: 2.7
  fat_g: 10.4
  sat_fat_g: 4.2
  mufa_g: 4.0
  pufa_g: 2.1
  trans_fat_g: 0.0
  cholesterol_mg: 0
  carbs_total_g: 8.0
  carbs_available_g: 6.6
  sugar_g: 6.6
  fiber_total_g: 1.4
  fiber_soluble_g: 0.4
  fiber_insoluble_g: 1.0
  polyols_g: 0.0
  sodium_mg: 9
  potassium_mg: 77
  iodine_ug: 0
  magnesium_mg: 11
  calcium_mg: 11
  iron_mg: 2.0
  zinc_mg: 0.7
  vitamin_c_mg: 0
  manganese_mg: 0.30
  copper_mg: 0.28
  selenium_ug: 1.1
  vitamin_d_ug: 0
  vitamin_e_mg: 0.17
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 56.8
  chloride_mg: 0
  sulfur_mg: 0
  vitamin_a_ug: 1.1
  vitamin_k_ug: 1.0
  vitamin_b1_mg: 0.033
  vitamin_b2_mg: 0.016
  vitamin_b3_mg: 0.18
  vitamin_b5_mg: 0.07
  vitamin_b6_mg: 0.061
  vitamin_b7_ug: 1.0
  vitamin_b9_ug: 1.7
  vitamin_b12_ug: 0
  choline_mg: 4.4
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.01
  omega6_la_g: 0.69
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
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
- "Pack nutrition is PER 100g: 598 kcal, 12.2g protein, 47.3g fat (18.9g sat), 29.8g carbs, 0.1g salt"
- "Bar weight: Full bar 44g = 263 kcal, Half bar 22g = 131.6 kcal"
- "All values scaled from per-100g by multiplying by 0.22 for 22g portion"
- "Estimated 6.5g fiber per 100g typical for high-cocoa dark chocolate with nuts"
- "Ingredients rich in magnesium, iron, copper from cocoa; vitamin E from pistachios"
- "Plant-based product: 0mg cholesterol, 0µg vitamin D, 0µg iodine, 0mg vitamin C"
- "Atwater validation: 4×2.7 + 9×10.4 + 4×6.6 + 2×1.4 = 132.8 kcal (within 1% of calculated 131.6 kcal)"
change_log:
- timestamp: "2025-11-04T20:00:00+00:00"
  updated_by: "Claude Code (Sonnet 4.5)"
  reason: "Initial entry - complete nutrition estimation for London's Chocolate Pistachio Praline Bar (half bar, 22g)"
  fields_changed:
  - all fields
  sources:
  - note: "Pack label data provided by user, scaled from per-100g to 22g"
  - note: "Micronutrients estimated using USDA FoodData Central: Dark Chocolate 70-85% (FDC 170273) and Pistachios raw (FDC 170184)"
  - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170273/"
    note: "USDA data for dark chocolate micronutrients"
  - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170184/"
    note: "USDA data for pistachio micronutrients"
- timestamp: "2025-11-04T20:45:00+00:00"
  updated_by: "Claude Code (Sonnet 4.5)"
  reason: "CORRECTION: Label nutrition was per 100g, not per 44g bar. Recalculated all values by multiplying per-100g values by 0.22 instead of dividing 44g values by 2. Energy corrected from 299 to 132 kcal for 22g portion."
  fields_changed:
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.carbs_total_g
  - per_portion.carbs_available_g
  - per_portion.sugar_g
  - per_portion.fiber_total_g
  - per_portion.sodium_mg
  - per_portion.potassium_mg
  - per_portion.magnesium_mg
  - per_portion.calcium_mg
  - per_portion.zinc_mg
  - per_portion.vitamin_e_mg
  - per_portion.copper_mg
  - per_portion.manganese_mg
  - assumptions
  - notes
  sources: []
- timestamp: "2025-11-05T15:30:00+00:00"
  updated_by: "Claude Code (Sonnet 4.5)"
  reason: "Enriched with 17 priority nutrients using component-based estimation from USDA FoodData Central"
  fields_changed:
  - phosphorus_mg
  - vitamin_d_ug
  - choline_mg
  - iodine_ug
  - vitamin_b9_ug
  - vitamin_b12_ug
  - copper_mg
  - selenium_ug
  - manganese_mg
  - vitamin_a_ug
  - vitamin_e_mg
  - vitamin_k_ug
  - vitamin_b1_mg
  - vitamin_b2_mg
  - vitamin_b3_mg
  - vitamin_b6_mg
  - omega3_epa_mg
  - omega3_dha_mg
  sources:
  - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170273/nutrients"
    note: "USDA FDC ID 170273: Dark Chocolate 70-85% cacao solids (per 100g nutrient data)"
  - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170184/nutrients"
    note: "USDA FDC ID 170184: Raw Pistachios (per 100g nutrient data)"
  - note: "Method: Weighted average (60% chocolate + 15% pistachio) scaled to 22g portion. Plant-based product: vitamin D, B12, choline, iodine, EPA, DHA are 0 or trace."
- timestamp: "2025-11-05T18:45:00+00:00"
  updated_by: "Claude Code (Sonnet 4.5)"
  reason: "Component-based enrichment: B5, B7, choline, omega-6 LA, omega-3 ALA"
  fields_changed: [version, last_verified, vitamin_b5_mg, vitamin_b7_ug, choline_mg, omega6_la_g, omega3_ala_g]
  sources:
  - url: "https://www.nutritionvalue.org/Chocolate%2C_70-85%25_cacao_solids%2C_dark_nutritional_value.html"
    note: "USDA dark chocolate 70-85% per 100g: B5=0.42mg, LA=1.20g, ALA=0.035g, choline~15mg"
    component_calculation: "Chocolate (60%×22g=13.2g): B5=0.42×0.132=0.055mg; LA=1.20×0.132=0.158g; ALA=0.035×0.132=0.005g; choline=15×0.132=2.0mg"
  - note: "USDA pistachios per 100g: B5=0.54mg, B7=30µg, LA=16.14g, ALA=0.26g, choline=72mg"
    component_calculation: "Pistachios (15%×22g=3.3g): B5=0.54×0.033=0.018mg; B7=30×0.033=0.99µg; LA=16.14×0.033=0.533g; ALA=0.26×0.033=0.009g; choline=72×0.033=2.4mg"
  - note: "Component-based totals for 22g bar (60% chocolate + 15% pistachios + 20% sugar + 5% other)"
    calculation: "B5: 0.055+0.018=0.073≈0.07mg; B7: 0.04+0.99=1.03≈1.0µg; LA: 0.158+0.533=0.691≈0.69g; ALA: 0.005+0.009=0.014≈0.01g; Choline: 2.0+2.4=4.4mg"
  - note: "Pistachios contribute 77% of linoleic acid (0.533g of 0.69g total) and 96% of biotin (0.99µg of 1.0µg total)"
```
