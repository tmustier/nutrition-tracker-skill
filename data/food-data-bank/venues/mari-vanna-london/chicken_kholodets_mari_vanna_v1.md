## Chicken Kholodets (Mari Vanna London)

```yaml
id: chicken_kholodets_mari_vanna_v1
schema_version: 2
version: 1
last_verified: 2025-11-10
source:
  venue: Mari Vanna London
  menu_page: ""
  evidence:
    - "User-provided nutrition snapshot from Mari Vanna dinner on 2025-11-10 (half-portion consumed)"
    - "Scaled to full portion for food bank snapshot"
aliases:
  - "Chicken aspic"
  - "Kholodets"
category: appetizer
portion:
  description: "Restaurant portion of chicken kholodets with mustard and horseradish"
  est_weight_g: 185
  notes: "Estimated 185g portion; gelatinous terrine served cold with condiments."
assumptions:
  salt_scheme: normal
  oil_type:
  prep: "Slow-cooked chicken in gelatin-rich broth, chilled with vegetables and aromatics."
per_portion:
  energy_kcal: 185.7
  protein_g: 28.2
  fat_g: 6.3
  sat_fat_g: 1.4
  mufa_g: 2.8
  pufa_g: 1.2
  trans_fat_g: 0
  cholesterol_mg: 44
  carbs_total_g: 4.2
  carbs_available_g: 3.9
  sugar_g: 0.2
  fiber_total_g: 0.3
  fiber_soluble_g: 0.1
  fiber_insoluble_g: 0.2
  polyols_g: 0.0
  sodium_mg: 510
  potassium_mg: 285
  calcium_mg: 12
  magnesium_mg: 20
  phosphorus_mg: 155
  chloride_mg: 785
  sulfur_g: 0.282
  iron_mg: 0.4
  zinc_mg: 0.5
  copper_mg: 0.04
  manganese_mg: 0.01
  selenium_ug: 23
  iodine_ug: 2
  chromium_ug: 0.2
  molybdenum_ug: 0.1
  vitamin_a_ug: 7
  vitamin_d_ug: 0.08
  vitamin_e_mg: 0.16
  vitamin_k_ug: 0.16
  vitamin_b1_mg: 0.09
  vitamin_b2_mg: 0.13
  vitamin_b3_mg: 7.5
  vitamin_b5_mg: 1.1
  vitamin_b6_mg: 0.55
  vitamin_b7_ug: 1.8
  vitamin_b9_ug: 3
  vitamin_b12_ug: 0.16
  choline_mg: 16
  vitamin_c_mg: 0.9
  omega3_epa_mg: 0
  omega3_dha_mg: 0.3
  omega3_ala_g: 0.02
  omega6_la_g: 0.5
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "Portion weight unknown; nutrient profile is per restaurant serving only."
    - "Micronutrients derived from tracked data; would benefit from direct lab verification."
notes:
  - "Values scaled from half-portion consumed on 2025-11-10."
  - "High protein / low carbohydrate cold terrine made from chicken meat and collagen-rich broth."
  - "Sodium reflects savory aspic plus mustard/horseradish condiments."
change_log:
  - timestamp: "2025-11-14T00:05:00+00:00"
    updated_by: "GPT-5 Codex"
    change: "Initial creation using scaled user food log."
    sources:
      - note: "User log 2025-11-10 (Chicken Kholodets, 0.5 portion)."
        url: "data/logs/2025-11/10.yaml"
```
