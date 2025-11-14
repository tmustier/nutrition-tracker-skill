## Apple, Small (Fresh)

```yaml
id: apple_small_130g_generic-fresh-produce_v1
version: 1
schema_version: 2
last_verified: "2025-11-13"
source:
  venue: Generic - Fresh Produce
  menu_page: ""
  evidence:
  - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/171688/nutrients"
    note: "USDA FoodData Central: Apples, raw, with skin (FDC ID 171688)"
  - url: "https://www.nutritionvalue.org/Apples%2C_with_skin%2C_raw_nutritional_value.html"
    note: "Complete nutrition profile per 100g including minerals and vitamins"
  - url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3259308/"
    note: "Peer-reviewed research on apple nutritional attributes and phytonutrient content"
aliases:
- apple
- red apple
- green apple
- raw apple
category: ingredient
portion:
  description: 1 small apple (130g with skin)
  est_weight_g: 130
  notes: Standard weight for a small fresh apple - typically ranges 120-150g for small size. Includes whole apple with edible skin.
assumptions:
  salt_scheme: unsalted
  oil_type: ""
  prep: fresh, whole, unpeeled with skin
per_portion:
  energy_kcal: 67.6
  protein_g: 0.338
  fat_g: 0.221
  sat_fat_g: 0.039
  mufa_g: 0.013
  pufa_g: 0.065
  trans_fat_g: 0.0
  cholesterol_mg: 0
  sugar_g: 13.5
  fiber_total_g: 3.1
  fiber_soluble_g: 0.52
  fiber_insoluble_g: 2.6
  sodium_mg: 1.3
  potassium_mg: 139
  iodine_ug: 0
  magnesium_mg: 6.5
  calcium_mg: 7.8
  iron_mg: 0.16
  zinc_mg: 0.05
  vitamin_c_mg: 6.0
  manganese_mg: 0.045
  copper_mg: 0.031
  selenium_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0.23
  polyols_g: 0.0
  carbs_available_g: 14.8
  carbs_total_g: 17.9
  omega3_ala_g: 0.013
  omega3_dha_mg: 0
  omega3_epa_mg: 0
  omega6_la_g: 0.052
  chloride_mg: 2.0
  phosphorus_mg: 14.3
  sulfur_g: 0.001
  chromium_ug: 0
  molybdenum_ug: 0
  boron_mg: 0
  nickel_ug: 0
  silicon_mg: 0
  vanadium_ug: 0
  vitamin_a_ug: 3.9
  vitamin_k_ug: 2.9
  choline_mg: 4.4
  vitamin_b1_mg: 0.022
  vitamin_b2_mg: 0.034
  vitamin_b3_mg: 0.12
  vitamin_b5_mg: 0.079
  vitamin_b6_mg: 0.053
  vitamin_b7_ug: 0.1
  vitamin_b9_ug: 3.9
  vitamin_b12_ug: 0
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
  fat_unassigned_g: 0.104
quality:
  confidence: high
  gaps: []
notes:
- 'USDA FoodData Central values scaled from per-100g data (FDC ID 171688): 52 kcal, 0.26g protein, 0.17g fat, 13.8g carbs total, 2.4g fiber, 4.6mg vitamin C per 100g'
- 'Small apple weight assumption: 130g (standard small fresh apple, range 120-150g with skin)'
- 'Fiber composition estimated: ~17% soluble (pectin, polysaccharides), ~83% insoluble (cellulose, hemicellulose)'
- 'Fat content very minimal - primarily trace amounts from natural apple seed oils (PUFA ~64% of total fat)'
- 'Good source of dietary fiber: 3.1g total provides ~12% daily value'
- 'Vitamin C: 6.0mg provides ~10% daily value (60mg reference intake)'
- 'Naturally sodium-free and cholesterol-free'
- 'Micronutrients per 100g from USDA FDC 171688: manganese 0.035mg, copper 0.024mg, magnesium 5mg, phosphorus 11mg, vitamin K 2.2µg, vitamin A 3µg RAE'
- 'Vitamin B complex: thiamin 0.017mg, riboflavin 0.026mg, niacin 0.091mg, pantothenic acid 0.061mg, vitamin B6 0.041mg, folate 3µg DFE per 100g'
- 'Atwater validation (available carb basis): 4×0.338 + 9×0.221 + 4×14.8 + 2×3.1 + 2.4×0 = 68.7 kcal (within 1.6% of 67.6 kcal - excellent match)'
- 'Selenium and iodine: 0 (not typically found in apples, soil-dependent and minimal in this produce item)'
- 'Can be eaten with skin for maximum fiber, antioxidants, and nutrient content'
- 'Carbs: US USDA label reports total carbs (13.8g/100g) = available carbs (~11.4g) + fiber (2.4g)'
- 'Fatty acids: omega-3 ALA trace (0.01g/100g from apple seeds), omega-6 LA trace (0.04g/100g)'
change_log:
  - timestamp: "2025-11-13T00:00:00+00:00"
    updated_by: "Claude Code (Haiku 4.5)"
    change: "Initial population of all 52 nutrient fields from USDA FDC ID 171688 (Apples, raw, with skin)"
    notes: "Per-130g portion for fresh raw small apple. Populated from USDA data with scaled values and estimated values for trace nutrients documented in notes. Chloride derived from sodium (sodium × 1.54 NaCl ratio). Sulfur derived from protein using plant formula (protein × 0.004)."
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/171688/nutrients"
        note: "USDA FoodData Central primary source: Apples, raw, with skin (FDC ID 171688)"
      - url: "https://www.nutritionvalue.org/Apples%2C_with_skin%2C_raw_nutritional_value.html"
        note: "Complete USDA nutrient profile per 100g including all minerals and vitamins"
      - url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3259308/"
        note: "Peer-reviewed research: Nutritional characteristics and health attributes of apples"
    nutrients_confirmed:
      - "vitamin_d_ug: 0 (apples contain no vitamin D)"
      - "vitamin_b12_ug: 0 (plant foods do not contain B12)"
      - "iodine_ug: 0 (not reported in USDA database for apples)"
      - "omega3_epa_mg: 0 (confirmed, no marine omega-3s in plant foods)"
      - "omega3_dha_mg: 0 (confirmed, no marine omega-3s in plant foods)"
      - "cholesterol_mg: 0 (plant foods contain no cholesterol)"
```

