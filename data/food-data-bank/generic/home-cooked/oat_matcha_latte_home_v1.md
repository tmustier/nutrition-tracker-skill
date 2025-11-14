## Oat Matcha Latte (Home)

```yaml
id: oat_matcha_latte_home_v1
schema_version: 2
version: 1
last_verified: 2025-11-01
source:
  venue: Home
  menu_page: ""
  evidence:
    - "User log (2025-11-01) – 230g latte made with barista oat milk + ceremonial matcha"
    - "Oatly Barista oat drink nutrition (fortified with Ca, D, B12, riboflavin)"
aliases:
  - "Matcha latte with oat milk"
category: drink
portion:
  description: "230g (≈230ml) homemade oat matcha latte"
  est_weight_g: 230
  notes: "Prepared with ~200ml barista oat milk, 30ml water, 2g ceremonial matcha, light maple syrup."
assumptions:
  salt_scheme: light
  oil_type:
  prep: "Whisk ceremonial matcha with hot water, add steamed barista oat milk."
per_portion:
  energy_kcal: 132
  protein_g: 3.5
  fat_g: 4.5
  sat_fat_g: 0.5
  mufa_g: 1.5
  pufa_g: 1.5
  trans_fat_g: 0
  cholesterol_mg: 0
  carbs_total_g: 20.5
  carbs_available_g: 18.0
  sugar_g: 7.0
  fiber_total_g: 2.5
  fiber_soluble_g: 1.0
  fiber_insoluble_g: 1.5
  polyols_g: 0.0
  sodium_mg: 90
  potassium_mg: 180
  calcium_mg: 270
  magnesium_mg: 25
  phosphorus_mg: 210
  chloride_mg: 139
  sulfur_g: 0.014
  iron_mg: 1.5
  zinc_mg: 0.4
  copper_mg: 0.10
  manganese_mg: 0.50
  selenium_ug: 1.0
  iodine_ug: 0
  chromium_ug: 0.3
  molybdenum_ug: 5.0
  vitamin_a_ug: 0
  vitamin_d_ug: 2.0
  vitamin_e_mg: 0.4
  vitamin_k_ug: 2.0
  vitamin_b1_mg: 0.10
  vitamin_b2_mg: 0.30
  vitamin_b3_mg: 0.40
  vitamin_b5_mg: 0.30
  vitamin_b6_mg: 0.05
  vitamin_b7_ug: 1.0
  vitamin_b9_ug: 15
  vitamin_b12_ug: 0.50
  choline_mg: 12.0
  vitamin_c_mg: 0
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.03
  omega6_la_g: 0.20
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "Micronutrient estimates rely on fortified oat milk label data; matcha contributions small but included via manganese/chromium."
notes:
  - "Macro profile matches user log (230g serving)."
  - "Calcium, vitamin D, B12, riboflavin from fortified barista-style oat drink."
  - "Matcha contributes manganese (0.5mg) and trace chromium."
  - "Chloride derived from sodium; sulfur estimated from protein (0.4% of plant protein)."
change_log:
  - timestamp: "2025-11-14T00:30:00+00:00"
    updated_by: "GPT-5 Codex"
    change: "Initial creation using user recipe + fortified oat milk data."
    sources:
      - note: "User log 2025-11-01 (Oat Matcha Latte, 230g)."
        url: "data/logs/2025-11/01.yaml"
      - note: "Oatly Barista oat drink nutrition (per 100ml)."
        url: "https://www.oatly.com/uk/products/barista-oat-drink"
```
