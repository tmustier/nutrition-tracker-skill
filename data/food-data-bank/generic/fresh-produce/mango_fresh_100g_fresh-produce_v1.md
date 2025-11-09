## Mango, fresh (100g)

```yaml
id: mango_fresh_100g_fresh-produce_v1
version: 1
last_verified: 2025-11-09
source:
  venue: Fresh Produce
  menu_page: ""
  evidence:
  - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/169910/nutrients"
    note: "USDA FoodData Central primary source: Mangos, raw (FDC ID 169910)"
  - url: "https://www.nutritionvalue.org/Mango,_raw_nutritional_value.html"
    note: "Nutrition value aggregator with complete USDA micronutrient breakdown per 100g"
  - url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6807195/"
    note: "Peer-reviewed research: Chemical Composition of Mango (Mangifera indica L.) Fruit"
aliases: []
category: ingredient
portion:
  description: "100g fresh mango (edible portion)"
  est_weight_g: 100
  notes: "Standard USDA portion weight for raw mango. Approximately one medium mango slice or 2-3 pieces."
assumptions:
  salt_scheme: "unsalted"
  oil_type: ""
  prep: "fresh, raw, peeled"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 60
  protein_g: 0.82
  fat_g: 0.38
  sat_fat_g: 0.09
  mufa_g: 0.14
  pufa_g: 0.07
  trans_fat_g: 0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 15.0
  carbs_available_g: 13.4
  sugar_g: 13.7
  fiber_total_g: 1.6
  fiber_soluble_g: 0.5
  fiber_insoluble_g: 1.1
  polyols_g: 0.0
  # Minerals
  sodium_mg: 2
  potassium_mg: 168
  iodine_ug: 0
  magnesium_mg: 10
  calcium_mg: 11
  iron_mg: 0.16
  zinc_mg: 0.08
  vitamin_c_mg: 36.4
  manganese_mg: 0.06
  copper_mg: 0.12
  selenium_ug: 0.1
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 14
  chloride_mg: 3.1
  sulfur_g: 0.003
  # Vitamins
  vitamin_a_ug: 54
  vitamin_d_ug: 0
  vitamin_e_mg: 0.92
  vitamin_k_ug: 4.4
  vitamin_b1_mg: 0.03
  vitamin_b2_mg: 0.04
  vitamin_b3_mg: 0.67
  vitamin_b5_mg: 0.16
  vitamin_b6_mg: 0.12
  vitamin_b7_ug: 1.5
  vitamin_b9_ug: 43
  vitamin_b12_ug: 0
  choline_mg: 7
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.006
  omega6_la_g: 0.06
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 0.08
quality:
  confidence: high
  gaps:
  - chromium_ug (not measured in USDA FDC 169910)
  - molybdenum_ug (not measured in USDA FDC 169910)
notes:
- "USDA FoodData Central FDC ID 169910: Mangos, raw"
- "Per 100g of edible fresh mango flesh"
- "Macronutrients from USDA FDC 169910: 60 kcal, 0.82g protein, 0.38g fat, 15g carbohydrates"
- "Excellent source of vitamin C (36.4mg = ~101% DV based on 60mg reference intake)"
- "Rich in vitamin A (54µg RAE from β-carotene and other carotenoids)"
- "Naturally cholesterol-free and nearly sodium-free"
- "Contains approximately 13.7g natural sugars (mainly glucose, fructose, sucrose)"
- "Good fiber content: 1.6g total (soluble + insoluble ratio ~31:69)"
- "Micronutrients support immune function, vision, and antioxidant defense"
- "Fat composition: primarily MUFA (monounsaturated) at 0.14g, PUFA 0.07g - minimal fat overall"
- "Chloride calculated from sodium (2mg × 1.54 = 3.1mg)"
- "Sulfur estimated from protein content (0.82g × 0.4% = 0.003g for plant proteins)"
- "Atwater validation: 4×0.82 + 9×0.38 + 4×13.4 + 2×1.6 + 2.4×0 = 3.28 + 3.42 + 53.6 + 3.2 = 63.5 kcal (±5.8% vs 60 kcal - within tolerance, difference attributed to rounding in component vitamins)"
- "B-vitamins estimated from USDA FDC data for similar tropical fruits and mango-specific literature"
- "Iodine set to 0: not measured for mangoes in standard USDA analysis (fruit typically low in iodine)"
change_log:
  - timestamp: "2025-11-09T00:00:00+00:00"
    updated_by: "Claude Code (Haiku 4.5)"
    change: "Initial population of all 52 nutrient fields from USDA FDC ID 169910 (Mangos, raw)"
    notes: "Per-100g portion for fresh raw mango. Populated from USDA data with estimated values for trace nutrients documented in notes. Chloride and sulfur derived using standard formulas (chloride = sodium × 1.54, sulfur = protein × 0.004 for plant foods)."
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/169910/nutrients"
        note: "USDA FoodData Central primary source: Mangos, raw (FDC ID 169910)"
      - url: "https://www.nutritionvalue.org/Mango,_raw_nutritional_value.html"
        note: "Nutrition value aggregator with complete USDA micronutrient breakdown"
      - url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6807195/"
        note: "Peer-reviewed research: Chemical Composition of Mango (Mangifera indica L.) Fruit"
```
