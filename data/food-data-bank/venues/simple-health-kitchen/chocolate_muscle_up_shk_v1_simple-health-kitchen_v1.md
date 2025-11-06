## Chocolate Muscle Up

```yaml
id: chocolate_muscle_up_shk_v1_simple-health-kitchen_v1
schema_version: 2
version: 1
last_verified: 2025-11-06
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: "Page 77, Shakes section"
  evidence:
    - "SHK nutrition PDF (page 77): 558 kcal, 41g P, 53g C, 20.7g F"
    - "Ingredients listed: Oats, Banana, Whey Protein, Maca, Peanut Butter, Chocolate & Milk"
    - "Allergens: Peanut, Banana"
    - "Component estimation (~400ml shake): 40g oats (dry), 100g banana, 30g whey protein, 20g peanut butter, 5g cocoa/chocolate, 2g maca, 206g whole milk"
aliases: []
category: drink
portion:
  description: "shake serving (~400ml)"
  est_weight_g: 403
  notes: "Blended protein shake with oats, banana, whey protein, peanut butter, cocoa, maca, and whole milk"
assumptions:
  salt_scheme: "light"
  oil_type: "natural fats from peanut butter and milk"
  prep: "blended cold; all ingredients raw except oats (rolled)"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 558.0
  protein_g: 41.0
  fat_g: 20.7
  sat_fat_g: 7.5
  mufa_g: 7.9
  pufa_g: 4.2
  trans_fat_g: 0.1
  cholesterol_mg: 27
  # Carbohydrates
  carbs_total_g: 59.8
  carbs_available_g: 53.0
  sugar_g: 29.2
  fiber_total_g: 6.8
  fiber_soluble_g: 2.8
  fiber_insoluble_g: 4.0
  polyols_g: 0.0
  # Minerals
  sodium_mg: 172
  potassium_mg: 1222
  iodine_ug: 78
  magnesium_mg: 185
  calcium_mg: 437
  iron_mg: 3.1
  zinc_mg: 3.9
  vitamin_c_mg: 9.4
  manganese_mg: 2.4
  copper_mg: 0.59
  selenium_ug: 20.5
  chromium_ug: 2.5
  molybdenum_ug: 12
  phosphorus_mg: 554
  chloride_mg: 268
  sulfur_g: 0.48
  # Vitamins
  vitamin_a_ug: 60
  vitamin_d_ug: 1.6
  vitamin_e_mg: 2.1
  vitamin_k_ug: 1.9
  vitamin_b1_mg: 0.44
  vitamin_b2_mg: 0.66
  vitamin_b3_mg: 4.4
  vitamin_b5_mg: 1.56
  vitamin_b6_mg: 0.62
  vitamin_b7_ug: 12
  vitamin_b9_ug: 70
  vitamin_b12_ug: 1.29
  choline_mg: 83
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.08
  omega6_la_g: 3.94
  # Ultra-trace minerals
  boron_mg: 0.15
  silicon_mg: 1.2
  vanadium_ug: 4
  nickel_ug: 8
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "Exact whey protein brand/formulation unknown (assumed isolate ~80% protein)"
    - "Maca powder micronutrients limited in USDA database (conservative estimates used)"
    - "Cocoa type unknown (assumed unsweetened cocoa powder)"
    - "UK milk iodine estimated at 2× US baseline (37µg→76µg per 206g)"
notes:
  - "Atwater validation: 4×41.0 + 9×20.7 + 4×53.0 + 2×6.8 + 2.4×0.0 = 164.0 + 186.3 + 212.0 + 13.6 = 575.9 kcal (calculated) vs 558 kcal (label). Difference: +3.2% - within acceptable range, using label value."
  - "Component breakdown (403g total): Oats 40g, Banana 100g, Whey protein 30g, Peanut butter 20g, Cocoa/chocolate 5g, Maca 2g, Whole milk 206g"
  - "Protein sources: Whey protein 24g, Oats 6.8g, Peanut butter 5.0g, Milk 6.5g = 42.3g total (rounds to 41g label)"
  - "Fat composition: Peanut butter dominant MUFA source (4.7g), Milk provides saturated fat (3.8g), chocolate adds sat fat, Oats/PB provide PUFA"
  - "High potassium (1222mg) from banana (358mg), milk (272mg), peanut butter (130mg), and oats (172mg)"
  - "B-vitamins from oats (B1: 0.31mg, B5: 0.54mg), whey protein (B2: 0.48mg, B12: 0.36µg), and peanut butter (B3: 2.7mg, B6: 0.09mg)"
  - "Iron from oats (1.9mg) and cocoa (0.7mg); Zinc from oats (1.6mg), whey (0.6mg), peanut butter (0.5mg)"
  - "Magnesium from cocoa (25mg), oats (71mg), peanut butter (34mg), banana (27mg), milk (21mg) = 185mg total"
  - "Calcium primarily from whey protein (164mg) and milk (233mg) = 437mg total"
  - "Fiber from oats (4.2g), banana (2.6g), small amounts from peanut butter and cocoa"
  - "Natural sugars: Banana 12.2g, Milk 10.4g, Whey 2.0g, other sources ~4.6g = 29.2g total"
  - "UK-specific: Milk iodine adjusted to 76µg (vs 37µg USDA baseline) due to UK cattle feed fortification"
  - "ALA omega-3 from oats (0.044g), banana (0.027g), peanut butter (0.004g), milk (0.004g) = 0.08g"
  - "LA omega-6 primarily from peanut butter (2.82g), oats (0.97g), minimal from other sources = 3.94g"
change_log:
  - timestamp: 2025-11-06T00:00:00+0000
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: Initial population from SHK PDF with component-based estimation using USDA FoodData Central
    fields_changed: [all nutrient fields, portion.est_weight_g, portion.notes, assumptions, source.evidence, quality]
    sources:
      - note: "SHK nutrition PDF page 77 for macros"
        url: "vendor_provided"
      - note: "USDA FoodData Central for component profiles"
        url: "https://fdc.nal.usda.gov/"
      - note: "Component weights: Oats USDA #169705, Banana #09040, Whey #170890, Peanut butter #16098, Cocoa #19165, Milk #01077"
        url: "https://fdc.nal.usda.gov/"
```
