## Tiramisu Yogurt Pot (170g)

```yaml
id: tiramisu_yogurt_pot_170g_generic-ingredients_v1
version: 1
schema_version: 2
last_verified: 2025-11-04
source:
  venue: Generic Ingredients
  menu_page: ""
  evidence:
  - "USDA FoodData Central - Yogurt, whole milk, plain (FDC ID 1097558): 61 kcal, 3.5g protein, 3.3g fat, 4.7g carbs per 100g"
  - "USDA FoodData Central - Cocoa powder, unsweetened (FDC ID 169593): 228 kcal, 19.6g protein, 13.7g fat, 57.9g carbs, 33.2g fiber per 100g"
  - "Light + Fit Tiramisu Greek Yogurt: 80 kcal per 150g (reference for flavor profile)"
  - "Chobani Coffee & Cream Greek Yogurt: 160 kcal per 150g (reference for creamy version)"
  - "Müller Light Tiramisu: 50 kcal per 100g (reference for UK market)"
  - "Component-based estimation: 155g whole milk yogurt + 2.5g cocoa powder + 0.5g coffee powder + 12g added sugars = 170g total"
aliases:
- Coffee yogurt dessert pot
- Tiramisu flavored yogurt
category: ingredient
portion:
  description: "standard yogurt pot"
  est_weight_g: 170
  notes: "Whole milk yogurt base with tiramisu flavoring (coffee and cocoa) and added sugars"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: "Component model: whole milk yogurt 155g (91%), cocoa powder 2.5g (1.5%), coffee powder 0.5g (0.3%), added sugars 12g (7%). UK dairy iodine levels assumed for yogurt base."
per_portion:
  energy_kcal: 153
  protein_g: 5.9
  fat_g: 5.4
  sat_fat_g: 3.3
  mufa_g: 1.3
  pufa_g: 0.2
  trans_fat_g: 0.2
  cholesterol_mg: 20
  carbs_total_g: 20.7
  carbs_available_g: 19.9
  sugar_g: 19.3
  fiber_total_g: 0.8
  fiber_soluble_g: 0.2
  fiber_insoluble_g: 0.6
  polyols_g: 0.0
  sodium_mg: 75
  potassium_mg: 278
  iodine_ug: 39
  magnesium_mg: 31
  calcium_mg: 191
  iron_mg: 0
  zinc_mg: 1
  vitamin_c_mg: 0
  manganese_mg: 0
  copper_mg: 0.1
  selenium_ug: 3
  vitamin_d_ug: 0.1
  vitamin_e_mg: 0.1
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 0
  chloride_mg: 0
  sulfur_g: 0
  vitamin_a_ug: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0
  vitamin_b2_mg: 0
  vitamin_b3_mg: 0
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0
  vitamin_b7_ug: 0
  vitamin_b9_ug: 0
  vitamin_b12_ug: 0
  choline_mg: 0
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0
  omega6_la_g: 0
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 0.4
quality:
  confidence: medium
  gaps:
  - "Fiber split (soluble/insoluble) estimated from typical cocoa powder composition"
  - "Vitamin E from yogurt and cocoa (trace amounts)"
  - "Selenium from dairy base (USDA typical range)"
notes:
- "Composite model representing generic tiramisu-flavored yogurt pot with whole milk base"
- "Energy matches multiple commercial references: between low-fat versions (80-88 kcal per 150-175g) and creamy versions (160 kcal per 150g)"
- "Atwater check (available carb basis): 4×5.9 + 9×5.4 + 4×19.9 + 2×0.8 + 2.4×0.0 = 153.4 kcal"
- "Iodine: UK dairy fortification levels (155g yogurt × 0.25 µg/g = 39 µg)"
- "Natural trans fat from dairy (ruminant source, primarily CLA)"
- "Cocoa contributes: magnesium (+12mg), potassium (+38mg), iron (+0.3mg), fiber (+0.8g)"
- "Sugar content: 7.3g natural lactose + 12g added sugars = 19.3g total"
- "Fiber from cocoa powder only; dairy products contain no dietary fiber"
change_log:
- timestamp: "2025-11-04T12:00:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "Initial creation using component-based estimation from USDA data and commercial product research"
  fields_changed:
  - all
  sources:
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/1097558/nutrients
    note: "USDA FoodData Central - Yogurt, whole milk, plain"
  - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/169593/nutrients
    note: "USDA FoodData Central - Cocoa powder, unsweetened, dry"
  - url: https://www.lightandfit.com/light-yogurt/greek-yogurt/tiramisu/
    note: "Light + Fit Tiramisu Greek Yogurt - 80 kcal, 12g protein per 150g"
  - url: https://www.muller.co.uk/our-brands/mullerlight/mullerlight/tiramisu-flavour
    note: "Müller Light Tiramisu - 50 kcal per 100g, fat-free, high protein"
```
