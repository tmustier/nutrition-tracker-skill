## Lucozade Sport Orange (500ml)

```yaml
id: lucozade_sport_orange_500ml_generic_v1
schema_version: 2
version: 1
last_verified: 2025-11-09
source:
  venue: Lucozade Sport (Packaged Product)
  menu_page: "https://www.lucozadesport.com/"
  evidence:
  - "UK supermarket listings (Tesco, Sainsbury's, Morrisons) - nutrition per 100ml and per 500ml bottle"
  - "Product ingredients: Water, Glucose Syrup, Citric Acid, Sodium Citrate, Acacia Gum, Potassium Sorbate, Ascorbic Acid, Aspartame, Acesulfame K, Flavouring, Vitamins (Niacin, Pantothenic Acid, B6, B12), Beta Carotene"
  - "Multiple UK retailer product pages confirming 140 kcal, 32.5g carbs, 18g sugars, 250mg sodium, 380mg potassium per 500ml"
aliases:
- Lucozade Sport Orange
- Lucozade Sport Body Fuel Orange
category: drink
portion:
  description: "1 bottle (500ml)"
  est_weight_g: 500
  notes: "Isotonic sports drink with electrolytes and B vitamins. Contains sweeteners (aspartame, acesulfame K)."
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: "Packaged beverage - isotonic formulation with glucose syrup, electrolytes, and vitamin fortification"
  usda_proxy: "Micronutrients estimated using typical isotonic sports drink composition and ingredient list. Ascorbic acid (antioxidant, not primary fortification): 15mg estimated. Beta carotene (colour): ~600µg providing ~50µg vitamin A RAE. Acacia gum (stabiliser): minimal fiber ~0.2g. Trace minerals from water and ingredients estimated at minimal levels. B-vitamin fortification confirmed from label (B3, B5, B6, B12). Confidence: HIGH for labeled nutrients (macros, B vitamins, electrolytes), MEDIUM for vitamin C and A (ingredient-based), LOW for trace minerals."
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 140
  protein_g: 0.1
  fat_g: 0.1
  sat_fat_g: 0
  mufa_g: 0
  pufa_g: 0
  trans_fat_g: 0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 32.7
  carbs_available_g: 32.5
  sugar_g: 18.0
  fiber_total_g: 0.2
  fiber_soluble_g: 0.15
  fiber_insoluble_g: 0.05
  polyols_g: 0.0
  # Minerals
  sodium_mg: 250
  potassium_mg: 380
  iodine_ug: 0.5
  magnesium_mg: 7
  calcium_mg: 10
  iron_mg: 0.2
  zinc_mg: 0.1
  vitamin_c_mg: 15
  manganese_mg: 0.05
  copper_mg: 0.02
  selenium_ug: 0.5
  chromium_ug: 0.5
  molybdenum_ug: 0.5
  phosphorus_mg: 5
  chloride_mg: 385
  sulfur_g: 0.001
  # Vitamins
  vitamin_a_ug: 50
  vitamin_d_ug: 0
  vitamin_e_mg: 0.5
  vitamin_k_ug: 0.5
  vitamin_b1_mg: 0.05
  vitamin_b2_mg: 0.05
  vitamin_b3_mg: 2.72
  vitamin_b5_mg: 1.02
  vitamin_b6_mg: 0.24
  vitamin_b7_ug: 0.5
  vitamin_b9_ug: 2
  vitamin_b12_ug: 0.43
  choline_mg: 1
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0
  omega6_la_g: 0
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: "0 (negligible fat content)"
quality:
  confidence: high
  gaps:
  - "Trace minerals (Cu, Se, Cr, Mo, Mn, I) estimated at minimal levels - not provided on label"
  - "Vitamin C estimated from ascorbic acid antioxidant ingredient (not fortification level)"
  - "Vitamin A estimated from beta carotene colour ingredient"
  - "Minimal fiber from acacia gum stabiliser"
notes:
- "UK formulation with reduced sugar (uses glucose syrup + sweeteners: aspartame and acesulfame K)"
- "Isotonic sports drink designed for hydration during exercise - provides carbohydrates and electrolytes"
- "Per 100ml: 28 kcal, 6.5g carbs, 3.6g sugars, 50mg sodium, 76mg potassium"
- "Fortified with B vitamins: Niacin (17% RI), B5 (17% RI), B6 (17% RI), B12 (17% RI)"
- "Energy validation: 4×0.1 + 9×0.1 + 4×32.5 + 2×0.2 = 131.7 kcal (calculated) vs 140 kcal (label). Variance: 5.9% - acceptable given rounding and trace components"
- "Carbohydrate breakdown: UK label shows available carbs (32.5g). Total carbs = available + fiber = 32.7g"
- "Contains source of phenylalanine (from aspartame)"
change_log:
- timestamp: "2025-11-09T00:00:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  change: "Initial complete entry with all 52 nutrient fields populated"
  fields_changed: [all fields]
  sources:
  - note: "UK supermarket nutrition labels (Tesco, Sainsbury's, Morrisons)"
    url: "https://www.tesco.com/groceries/en-GB/products/255231748"
  - note: "Lucozade Sport official product page"
    url: "https://www.lucozadesport.com/product/lucozade-sport/orange/lucozade-sport-orange/46/"
  methodology: "Primary data from UK product labels for macros, sugars, electrolytes, and B vitamins. Vitamin C estimated from ascorbic acid ingredient (antioxidant use ~15mg). Vitamin A estimated from beta carotene colour (~50µg RAE). Trace minerals estimated at minimal levels typical for sports drinks without specific fortification. Fiber from acacia gum stabiliser (0.2g). Chloride calculated from sodium (×1.54). Sulfur calculated from trace protein (×0.01)."
```
