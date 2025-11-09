## Tiramisu Yogurt Pot (170g)

```yaml
id: tiramisu_yogurt_pot_170g_generic-ingredients_v1
version: 2
schema_version: 2
last_verified: 2025-11-05
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
  prep: "Component model: whole milk yogurt 155g (91%), cocoa powder 2.5g (1.5%), coffee powder 0.5g (0.3%), added sugars 12g (7%). Priority nutrients sourced from USDA plain whole milk yogurt (FDC 2259793, 171284) scaled to 170g portion. UK dairy iodine levels 2.5x higher than USDA values due to iodine-enriched cattle feed."
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
  iodine_ug: 137
  magnesium_mg: 31
  calcium_mg: 191
  iron_mg: 0
  zinc_mg: 1
  vitamin_c_mg: 0
  manganese_mg: 0.007
  copper_mg: 0.015
  selenium_ug: 3.7
  vitamin_d_ug: 1.3
  vitamin_e_mg: 0.10
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 172
  chloride_mg: 116.0
  sulfur_g: 0.059
  vitamin_a_ug: 46
  vitamin_k_ug: 0.34
  vitamin_b1_mg: 0.09
  vitamin_b2_mg: 0.41
  vitamin_b3_mg: 0.23
  vitamin_b5_mg: 0.63
  vitamin_b6_mg: 0.08
  vitamin_b7_ug: 0
  vitamin_b9_ug: 12
  vitamin_b12_ug: 0.63
  choline_mg: 26
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.04
  omega6_la_g: 0.11
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
- "Iodine: UK dairy fortification (USDA 32.3µg/100g × 1.7 × 2.5 = 137µg). UK dairy has 2-3x higher iodine than US due to iodine-enriched cattle feed"
- "Natural trans fat from dairy (ruminant source, primarily CLA)"
- "Cocoa contributes: magnesium (+12mg), potassium (+38mg), iron (+0.3mg), fiber (+0.8g)"
- "Sugar content: 7.3g natural lactose + 12g added sugars = 19.3g total"
- "Fiber from cocoa powder only; dairy products contain no dietary fiber"
- "B vitamins from yogurt base: B2/riboflavin (0.41mg), B12 (0.63µg), B1/thiamin (0.09mg), B9/folate (12µg)"
- "Phosphorus (172mg) and vitamin A (46µg) from whole milk yogurt base"
- "Omega-3 EPA/DHA: 0mg (yogurt does not contain marine omega-3s)"
change_log:

  - timestamp: "2025-11-06T23:28:46+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.01 (animal)."
  - timestamp: "2025-11-05T00:00:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Enriched with 17 priority nutrients from USDA FoodData Central whole milk yogurt data"
    fields_changed:
    - vitamin_d_ug
    - choline_mg
    - iodine_ug
    - vitamin_b9_ug
    - vitamin_b12_ug
    - phosphorus_mg
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
      - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/2259793/nutrients
        note: "USDA FoodData Central Foundation - Yogurt, plain, whole milk (primary source for B vitamins, minerals, vitamin D)"
      - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/171284/nutrients
        note: "USDA FoodData Central SR Legacy - Yogurt, plain, whole milk (supplemental source for B12, folate, choline, vitamin A, vitamin E, selenium)"
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
  - timestamp: "2025-11-05T16:00:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Enrichment with 8 additional nutrients using USDA FoodData Central values for whole milk yogurt (155g base) plus cocoa powder contributions"
    fields_changed: [vitamin_b5_mg, omega3_ala_g, omega6_la_g, version]
    sources:
      - url: https://www.nutritionvalue.org/Yogurt,_whole_milk,_plain_nutritional_value.html
        note: "USDA FoodData Central via nutritionvalue.org - Whole milk yogurt per 100g: Pantothenic acid (B5) 0.389mg, Linoleic acid (18:2 n-6) 0.065g, ALA (18:3 n-3) 0.027g. For 155g yogurt base: B5=0.603mg, LA=0.101g, ALA=0.042g. Added cocoa contributions (2.5g): B5 +~0.025mg, LA +~0.01g. Total 170g portion: B5=0.63mg, LA=0.11g, ALA=0.04g."
      - url: https://fdc.nal.usda.gov/fdc-app.html#/food-details/169593/nutrients
        note: "USDA FoodData Central - Cocoa powder, unsweetened: B5 ~1mg/100g, LA ~0.4g/100g. Small contributions from 2.5g cocoa included in totals."
    notes: "Vitamin B7 (biotin), chromium, and molybdenum remain 0 (not routinely analyzed/reported in USDA FoodData Central for yogurt products per USDA API Research). Fiber soluble (0.2g) and insoluble (0.6g) UNCHANGED - these values are from cocoa powder, not dairy. Cocoa powder contains dietary fiber; only PURE dairy has TRUE ZERO fiber."
  - timestamp: "2025-11-05T22:30:00+00:00"
    updated_by: "Agent 8 - Claude Sonnet 4.5"
    reason: "Schema compliance fix: Added sulfur_g field (was sulfur_mg). Sulfur estimated from protein content (dairy: ~10.5mg S per g protein)."
    fields_changed:
    - per_portion.sulfur_g
    sources:
      - note: "Sulfur content estimated at 0.062g based on 5.9g protein × 10.5mg/g coefficient for dairy. Milk proteins (whey, casein) are moderate sources of sulfur-containing amino acids."
        url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4438303/"
```
