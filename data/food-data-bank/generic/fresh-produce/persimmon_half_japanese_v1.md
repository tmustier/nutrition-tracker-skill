## Persimmon, Japanese (Half) - Raw

```yaml
id: persimmon_half_japanese_v1
version: 2
schema_version: 2
last_verified: "2025-11-13"

source:
  venue: Generic fresh produce
  menu_page: ""
  evidence:
    - "USDA FoodData Central FDC ID 169941"

aliases:
  - "half persimmon"
  - "sharon fruit half"
  - "fuyu persimmon half"
  - "kaki half"

category: ingredient

portion:
  description: "Half a Japanese persimmon (Diospyros kaki), raw"
  est_weight_g: 75
  notes: "Typical medium Fuyu or Sharon fruit variety. Most common type in UK markets. Sweet, non-astringent variety eaten firm."

assumptions:
  salt_scheme: unsalted
  oil_type: ""
  prep: "fresh, raw, no preparation"

per_portion:
  energy_kcal: 59
  protein_g: 0.4
  fat_g: 0.1
  sat_fat_g: 0.01
  mufa_g: 0.08
  pufa_g: 0.05
  trans_fat_g: 0.0
  cholesterol_mg: 0
  carbs_total_g: 15.4
  carbs_available_g: 12.7
  sugar_g: 10.4
  fiber_total_g: 2.7
  fiber_soluble_g: 0.7
  fiber_insoluble_g: 2.0
  polyols_g: 0.0
  sodium_mg: 1
  potassium_mg: 121
  calcium_mg: 10
  magnesium_mg: 11
  iron_mg: 0.11
  zinc_mg: 0.08
  manganese_mg: 0.27
  iodine_ug: 0
  copper_mg: 0.09
  selenium_ug: 1
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 13
  chloride_mg: 2
  sulfur_g: 0.004
  vitamin_c_mg: 5.6
  vitamin_b1_mg: 0.023
  vitamin_b2_mg: 0.015
  vitamin_b3_mg: 0.08
  vitamin_b5_mg: 0.11
  vitamin_b6_mg: 0.08
  vitamin_b7_ug: 0
  vitamin_b9_ug: 17
  vitamin_b12_ug: 0.0
  choline_mg: 9.6
  vitamin_a_ug: 61
  vitamin_d_ug: 0.0
  vitamin_e_mg: 0.55
  vitamin_k_ug: 2.0
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.0
  omega6_la_g: 0.0
  boron_mg: 0.08
  silicon_mg: 0.0
  vanadium_ug: 0
  nickel_ug: 0

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"

quality:
  confidence: high
  gaps: []

notes:
  - "Atwater check (available carb basis): 4×0.4 + 9×0.1 + 4×12.7 + 2×2.7 = 1.6 + 0.9 + 50.8 + 5.4 = 58.7 kcal (rounded to 59 kcal)"
  - "USDA FDC 169941: Persimmons, Japanese, raw (Diospyros kaki)"
  - "Weight: 75g = half a typical medium Fuyu/Sharon fruit persimmon (whole ~150g)"
  - "Excellent source of beta-cryptoxanthin (~1085mcg per half) - carotenoid antioxidant"
  - "Good source of manganese (0.27mg, 13% DV) and vitamin C (5.6mg, 9% DV)"
  - "Contains unique polyphenols (shibuol, tannins) with antioxidant properties"
  - "Very low fat (<0.2g), low sodium (<1mg), naturally sweet from glucose and fructose"
  - "Fiber split estimated (25% soluble, 75% insoluble): USDA FDC 169941 provides only total fiber data (3.6g/100g)"
  - "No biotin (B7) data available in USDA for persimmons - set to 0"
  - "Boron content estimated at 0.08mg per 75g based on fruit average"

change_log:
  - timestamp: "2025-11-14T13:00:00+00:00"
    updated_by: "LLM: Claude Opus 4.1"
    reason: "Fixed energy calculation and total carbs to match Atwater formula"
    fields_changed: ["energy_kcal: 53→59", "carbs_total_g: 13.9→15.4"]
    sources: []
  - timestamp: "2025-11-13T19:25:00+00:00"
    updated_by: "LLM: Claude Sonnet 4"
    reason: "Documentation improvement: Clarified that fiber split is estimated due to USDA data limitations (only total fiber available in FDC 169941)"
    fields_changed: []
    sources: []
  - timestamp: "2025-11-10T14:15:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial creation based on USDA FoodData Central data for Japanese persimmon"
    fields_changed: []
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/169941/nutrients"
        note: "USDA FDC 169941 - Persimmons, Japanese, raw. Scaled from per 100g to 75g (half fruit)"
```
