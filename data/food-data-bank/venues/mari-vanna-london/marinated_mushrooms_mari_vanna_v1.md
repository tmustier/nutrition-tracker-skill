## Marinated Mushrooms (Mari Vanna London)

```yaml
id: marinated_mushrooms_mari_vanna_v1
schema_version: 2
version: 1
last_verified: 2025-11-10
source:
  venue: Mari Vanna London
  menu_page: ""
  evidence:
    - "User-provided nutrition snapshot from Mari Vanna dinner on 2025-11-10 (1/6 portion consumed)"
    - "Scaled to full portion for food bank snapshot"
aliases:
  - "Pickled mushrooms"
category: side
portion:
  description: "Family-style plate of marinated wild mushrooms"
  est_weight_g: 250
  notes: "Estimated 250g portion; served as sharable starter with oil marinade."
assumptions:
  salt_scheme: normal
  oil_type: sunflower oil
  prep: "Wild mushrooms marinated in sunflower oil, vinegar, garlic, and herbs."
per_portion:
  energy_kcal: 245.49
  protein_g: 6.1122
  fat_g: 20.9418
  sat_fat_g: 3.1062
  mufa_g: 14.9298
  pufa_g: 2.505
  trans_fat_g: 0.2004
  cholesterol_mg: 0
  carbs_total_g: 11.022
  carbs_available_g: 5.511
  sugar_g: 4.2084
  fiber_total_g: 5.6112
  fiber_soluble_g: 1.8036
  fiber_insoluble_g: 3.8076
  polyols_g: 0.0
  sodium_mg: 1016.028
  potassium_mg: 904.806
  calcium_mg: 11.022
  magnesium_mg: 26.052
  phosphorus_mg: 179.358
  chloride_mg: 1564.122
  sulfur_g: 0.0240
  iron_mg: 2.2044
  zinc_mg: 0.9018
  copper_mg: 0.8417
  manganese_mg: 0.3006
  selenium_ug: 28.056
  iodine_ug: 22.044
  chromium_ug: 0
  molybdenum_ug: 0
  vitamin_a_ug: 15.03
  vitamin_d_ug: 0.7014
  vitamin_e_mg: 2.9058
  vitamin_k_ug: 12.024
  vitamin_b1_mg: 0.2004
  vitamin_b2_mg: 1.002
  vitamin_b3_mg: 10.02
  vitamin_b5_mg: 3.9078
  vitamin_b6_mg: 0.3006
  vitamin_b7_ug: 4.2084
  vitamin_b9_ug: 47.094
  vitamin_b12_ug: 0
  choline_mg: 45.09
  vitamin_c_mg: 5.6112
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.0100
  omega6_la_g: 2.2044
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "Portion weight unknown; high sodium likely from marinade."
    - "Trace minerals (Cr, Mo, ultra-trace elements) not available from source data."
notes:
  - "Values scaled from 1/6 portion recorded in user log."
  - "High fat content reflects sunflower-oil marinade."
  - "Sodium and chloride elevated due to brine."
  - "Fiber-rich thanks to mushrooms and herbs."
change_log:
  - timestamp: "2025-11-14T00:08:00+00:00"
    updated_by: "GPT-5 Codex"
    change: "Initial creation using scaled user food log."
    sources:
      - note: "User log 2025-11-10 (Marinated Mushrooms, 1/6 portion)."
        url: "data/logs/2025-11/10.yaml"
```
