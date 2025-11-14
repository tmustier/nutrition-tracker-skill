## Chicken Kiev with Mushroom Sauce (Mari Vanna London)

```yaml
id: chicken_kiev_mushroom_mari_vanna_v1
schema_version: 2
version: 1
last_verified: 2025-11-10
source:
  venue: Mari Vanna London
  menu_page: ""
  evidence:
    - "User-provided nutrition snapshot from Mari Vanna dinner on 2025-11-10 (full portion consumed)"
aliases:
  - "Chicken Kiev"
category: main
portion:
  description: "Restaurant portion of Chicken Kiev served over mashed potatoes with mushroom sauce"
  est_weight_g:
  notes: "Weight not provided; nutrient profile reflects full plated portion."
assumptions:
  salt_scheme: normal
  oil_type: butter
  prep: "Chicken breast stuffed with herb butter, breaded, fried, and served with mushroom cream sauce."
per_portion:
  energy_kcal: 1397
  protein_g: 44.3
  fat_g: 119.4
  sat_fat_g: 33.4
  mufa_g: 50.0
  pufa_g: 22.6
  trans_fat_g: 3.7
  cholesterol_mg: 198
  carbs_total_g: 38.7
  carbs_available_g: 35.9
  sugar_g: 3.5
  fiber_total_g: 2.9
  fiber_soluble_g: 0.8
  fiber_insoluble_g: 2.1
  polyols_g: 0.0
  sodium_mg: 1219
  potassium_mg: 1183
  calcium_mg: 86
  magnesium_mg: 62
  phosphorus_mg: 378
  chloride_mg: 1877
  sulfur_g: 0.44
  iron_mg: 2.1
  zinc_mg: 1.4
  copper_mg: 0.42
  manganese_mg: 0.4
  selenium_ug: 42
  iodine_ug: 26
  chromium_ug: 0
  molybdenum_ug: 2
  vitamin_a_ug: 356
  vitamin_d_ug: 0.8
  vitamin_e_mg: 12.1
  vitamin_k_ug: 3.3
  vitamin_b1_mg: 0.29
  vitamin_b2_mg: 0.34
  vitamin_b3_mg: 20.4
  vitamin_b5_mg: 2.4
  vitamin_b6_mg: 1.24
  vitamin_b7_ug: 0.2
  vitamin_b9_ug: 25
  vitamin_b12_ug: 0.7
  choline_mg: 174
  vitamin_c_mg: 5.3
  omega3_epa_mg: 0.05
  omega3_dha_mg: 0
  omega3_ala_g: 0.05
  omega6_la_g: 0.35
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "Portion weight not recorded."
    - "Micronutrient profile derived from single logged meal; future lab analysis recommended."
notes:
  - "Large entrée with butter-rich stuffing and frying oil explains very high fat content."
  - "Values pulled directly from user log (no scaling needed because a full portion was consumed)."
  - "Chloride derived from sodium (sodium × 1.54)."
change_log:
  - timestamp: "2025-11-14T00:10:00+00:00"
    updated_by: "GPT-5 Codex"
    change: "Initial creation using user food log data."
    sources:
      - note: "User log 2025-11-10 (Chicken Kiev with Mushroom Sauce, 1 portion)."
        url: "data/logs/2025-11/10.yaml"
```
