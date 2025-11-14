## Mezcalita (Mezcal Margarita)

```yaml
id: mezcalita_cocktail_generic_bar_v1
schema_version: 2
version: 1
last_verified: 2025-11-14
source:
  venue: Generic - Bar/Restaurant
  menu_page: ""
  evidence:
  - "Standard mezcalita recipe: 2 oz mezcal, 1 oz lime juice, 0.5 oz Cointreau, 0.5 oz agave syrup"
  - "USDA FoodData Central FDC ID 174815 (Distilled spirits, 80 proof) for mezcal"
  - "USDA FoodData Central FDC ID 168156 (Lime juice, raw)"
  - "Cointreau official nutrition data (40% ABV, 335 kcal/100g, 26.1g carbs/100g)"
  - "USDA FoodData Central FDC ID 170277 (Agave syrup)"
  - "Recipe sources: Cookie and Kate, Mezcalum, Difford's Guide (2025)"
aliases:
- Mezcalita
- Mezcal Margarita
category: drink
portion:
  description: "1 standard mezcalita (~4 oz / 123g)"
  est_weight_g: 123
  notes: "Classic mezcalita: mezcal, lime juice, orange liqueur, agave syrup, optional Tajín rim"
assumptions:
  salt_scheme: normal
  oil_type: ""
  prep: "Mixed cocktail, served on the rocks with optional Tajín/salt rim"
  nutrient_source: "Component-based calculation from USDA FoodData Central values for each ingredient"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 255
  protein_g: 0.2
  fat_g: 0.1
  sat_fat_g: 0
  mufa_g: 0
  pufa_g: 0
  trans_fat_g: 0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 22.1
  carbs_available_g: 21.9
  sugar_g: 18.1
  fiber_total_g: 0.2
  fiber_soluble_g: 0
  fiber_insoluble_g: 0.2
  polyols_g: 0.0
  # Minerals
  sodium_mg: 202
  potassium_mg: 38
  iodine_ug: 0
  magnesium_mg: 3
  calcium_mg: 5
  iron_mg: 0.08
  zinc_mg: 0.05
  vitamin_c_mg: 13
  manganese_mg: 0.02
  copper_mg: 0.03
  selenium_ug: 0.4
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 7
  chloride_mg: 311
  sulfur_g: 0.001
  # Vitamins
  vitamin_a_ug: 2.2
  vitamin_d_ug: 0
  vitamin_e_mg: 0.3
  vitamin_k_ug: 5
  vitamin_b1_mg: 0.04
  vitamin_b2_mg: 0.04
  vitamin_b3_mg: 0.2
  vitamin_b5_mg: 0.04
  vitamin_b6_mg: 0.06
  vitamin_b7_ug: 0.2
  vitamin_b9_ug: 9
  vitamin_b12_ug: 0
  choline_mg: 4.3
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.001
  omega6_la_g: 0.002
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  alcohol_g: 23.6
  alcohol_energy_kcal: 165
quality:
  confidence: medium
  gaps: []
notes:
- "Recipe breakdown (123g total):"
- "- Mezcal: 60ml (56.4g) @ 40% ABV = 18.9g alcohol contributing ~132 kcal"
- "- Lime juice: 30ml (31g fresh) = ~8 kcal, 2.6g carbs, 9.3mg vitamin C"
- "- Cointreau: 15ml (14.25g) @ 40% ABV = 4.7g alcohol + 3.7g sugar = ~48 kcal"
- "- Agave syrup: 15ml (20.4g) = ~62 kcal, 15.6g carbs (13.9g sugars)"
- "- Tajín rim: 0.5g = ~200mg sodium"
- ""
- "Total alcohol: 23.6g contributing 165 kcal (7 kcal/g)"
- "Total carbs: 21.9g available + 0.2g fiber = 22.1g total"
- "Total energy: 255 kcal (165 from alcohol + 90 from macros)"
- ""
- "Atwater verification (available carb basis):"
- "4×0.2 + 9×0.1 + 4×21.9 + 2×0.2 + 7×23.6 = 0.8 + 0.9 + 87.6 + 0.4 + 165.2 = 255 kcal ✓"
- ""
- "Micronutrient sources:"
- "- Vitamin C (13mg): primarily from lime juice (9.3mg) + agave (3.6mg)"
- "- B vitamins: combined from lime juice, agave syrup, and trace amounts from spirits"
- "- Minerals: lime juice contributes most potassium (36mg), calcium, and magnesium"
- "- Vitamin K (5µg): primarily from agave syrup"
- "- Choline (4.3mg): from lime juice (1.6mg) and agave (2.7mg)"
- "- Fatty acids: trace amounts from lime juice only (spirits contain no lipids)"
- ""
- "Variations:"
- "- Some recipes use 1.5 oz mezcal instead of 2 oz (reduces calories by ~40 kcal)"
- "- Recipes without agave syrup reduce calories by ~60 kcal and carbs by ~16g"
- "- Orange juice addition (some recipes) would increase vitamin C and carbs"
- "- Tajín rim vs plain salt: Tajín adds minimal chili spice, similar sodium"
- ""
- "Chloride (311mg): calculated from sodium (202mg × 1.54 NaCl ratio)"
- "Sulfur (0.001g): calculated from protein (0.2g × 0.004 plant-based factor)"
change_log:
  - timestamp: "2025-11-14T00:00:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Initial entry - comprehensive nutrition estimation for mezcalita cocktail"
    fields_changed: [all fields]
    sources:
      - note: "USDA FoodData Central #174815 - Distilled spirits, 80 proof (for mezcal component)"
        url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/174815/nutrients"
      - note: "USDA FoodData Central #168156 - Lime juice, raw"
        url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/168156/nutrients"
      - note: "USDA FoodData Central #170277 - Agave syrup"
        url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170277/nutrients"
      - note: "Cointreau official nutrition data (40% ABV)"
        url: "https://www.cointreau.com/us/en/what-nutritional-value"
      - note: "Recipe research: Cookie and Kate, Mezcalum, Difford's Guide, Tequila O'Clock"
        calculation: "Component-based: scaled USDA per-100g values to recipe proportions (60ml mezcal, 30ml lime, 15ml Cointreau, 15ml agave, 0.5g Tajín)"
    details: "Complete 52-nutrient profile using component analysis. All micronutrients scaled from USDA data. Alcohol content: 23.6g (21.6% ABV). Recipe based on standard mezcalita proportions researched from multiple cocktail sources."
```
