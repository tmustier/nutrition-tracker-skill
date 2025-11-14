## Russian Blinis with Salmon (Mari Vanna London)

```yaml
id: russian_blinis_salmon_mari_vanna_v1
schema_version: 2
version: 1
last_verified: 2025-11-10
source:
  venue: Mari Vanna London
  menu_page: ""
  evidence:
    - "User-provided nutrition snapshot from Mari Vanna dinner on 2025-11-10 (3/4 portion consumed)"
    - "Scaled to full portion (4/4) for food bank snapshot"
aliases:
  - "Salmon blinis"
  - "Blinis with smoked salmon and sour cream"
category: appetizer
portion:
  description: "Restaurant portion (stack of buckwheat blinis topped with smoked salmon and sour cream)"
  est_weight_g:
  notes: "Weight not provided; nutrient profile derived directly from user-tracked data scaled to a full portion."
assumptions:
  salt_scheme: normal
  oil_type: butter
  prep: "Buckwheat blinis cooked in butter, topped with sour cream, dill, and smoked salmon."
per_portion:
  energy_kcal: 614
  protein_g: 36.9
  fat_g: 34.1
  sat_fat_g: 14.5
  mufa_g: 9.2
  pufa_g: 5.0
  trans_fat_g: 0
  cholesterol_mg: 357
  carbs_total_g: 40.1
  carbs_available_g: 39.5
  sugar_g: 5.0
  fiber_total_g: 0.41
  fiber_soluble_g: 0.10
  fiber_insoluble_g: 0.31
  polyols_g: 0.0
  sodium_mg: 690
  potassium_mg: 596
  calcium_mg: 177
  magnesium_mg: 50
  phosphorus_mg: 456
  chloride_mg: 1063
  sulfur_g: 0.37
  iron_mg: 2.3
  zinc_mg: 2.1
  copper_mg: 0.18
  manganese_mg: 0.28
  selenium_ug: 91
  iodine_ug: 146
  chromium_ug: 2
  molybdenum_ug: 8
  vitamin_a_ug: 262
  vitamin_d_ug: 13.5
  vitamin_e_mg: 2.3
  vitamin_k_ug: 1.3
  vitamin_b1_mg: 0.21
  vitamin_b2_mg: 0.68
  vitamin_b3_mg: 5.4
  vitamin_b5_mg: 2.1
  vitamin_b6_mg: 0.78
  vitamin_b7_ug: 18.2
  vitamin_b9_ug: 63
  vitamin_b12_ug: 3.4
  choline_mg: 308
  vitamin_c_mg: 1.1
  omega3_epa_mg: 0.64
  omega3_dha_mg: 0.64
  omega3_ala_g: 0.0
  omega6_la_g: 2.0
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "Portion weight not recorded; values are per restaurant serving only."
    - "Micronutrient profile inherited from tracked data (mix of smoked salmon, sour cream, blinis); further lab validation pending."
notes:
  - "Nutrient profile scaled from 3/4 portion consumed (user food log on 2025-11-10) to full portion."
  - "High protein and omega-3 content driven by smoked salmon."
  - "Sodium reflects brined fish plus salted batter."
  - "Carbohydrates primarily from buckwheat/wheat batter."
  - "Atwater validation (available-carb method): 4×36.9 + 9×34.1 + 4×39.5 + 2×0.41 ≈ 613 kcal (matches stored energy)."
change_log:
  - timestamp: "2025-11-14T00:00:00+00:00"
    updated_by: "GPT-5 Codex"
    change: "Initial creation using scaled user log data for Mari Vanna dinner."
    notes: "Scaled 3/4-portion nutrition snapshot recorded on 2025-11-10 to represent a full restaurant portion."
    sources:
      - note: "User food log entry on 2025-11-10 (Russian Blinis with Salmon, 0.75 portion)."
        url: "data/logs/2025-11/10.yaml"
```
