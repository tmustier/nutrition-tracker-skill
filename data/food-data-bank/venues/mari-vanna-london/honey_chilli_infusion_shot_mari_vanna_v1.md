## Honey & Chilli Infusion Shot (Mari Vanna London)

```yaml
id: honey_chilli_infusion_shot_mari_vanna_v1
version: 1
last_verified: 2025-11-13
source:
  venue: Mari Vanna London
  menu_page: ""
  evidence:
    - "30ml single measure (UK standard: 25-35ml)"
    - "Infused vodka with honey and chilli flavoring"
    - "Component analysis: 40% ABV vodka + honey infusion"
aliases:
  - Honey Chilli Shot
  - Mari Vanna Infusion Shot
category: drink
portion:
  description: "1 shot (30ml)"
  est_weight_g: 26
  notes: "Single measure shot; 30ml liquid (~24g vodka base) + honey/infusion (~2g)"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: "40% ABV vodka infused with honey and chilli; served as chilled shot"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 89
  protein_g: 0.2
  fat_g: 0
  sat_fat_g: 0
  mufa_g: 0
  pufa_g: 0
  trans_fat_g: 0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 1.2
  carbs_available_g: 1.2
  sugar_g: 1.2
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  polyols_g: 0.0
  # Minerals
  sodium_mg: 1
  potassium_mg: 2
  iodine_ug: 0
  magnesium_mg: 0.2
  calcium_mg: 0.5
  iron_mg: 0.02
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0.01
  copper_mg: 0.01
  selenium_ug: 0.5
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 1
  chloride_mg: 2
  sulfur_g: 0.001
  # Vitamins
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.01
  vitamin_b2_mg: 0.01
  vitamin_b3_mg: 0.02
  vitamin_b5_mg: 0.01
  vitamin_b6_mg: 0.01
  vitamin_b7_ug: 0.3
  vitamin_b9_ug: 0.2
  vitamin_b12_ug: 0
  choline_mg: 0.1
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
  alcohol_g: 12
  alcohol_energy_kcal: 84
quality:
  confidence: medium
  gaps:
    - "Exact honey infusion ratio not publicly available; estimated at ~1.5g honey per 30ml based on typical infusion practices"
    - "Chilli contribution negligible; not quantified"
notes:
  - "30ml single measure shot (UK standard 25-35ml range, using typical 30ml)"
  - "Vodka 40% ABV: 12ml pure alcohol = 12g ethanol at 7 kcal/g = 84 kcal"
  - "Honey infusion ~1.5g per shot: primarily sugars (1.2g carbs contributing 4.8 kcal)"
  - "Total energy: 84 + 4.8 = ~89 kcal (Atwater formula check: 4×0.2 + 9×0 + 4×1.2 + 2×0 = 4.8 kcal macros + 84 kcal alcohol = 88.8 kcal, within tolerance)"
  - "Chilli negligible in nutrition but provides flavor; no quantifiable contribution"
  - "Minor trace vitamins/minerals from honey component (B vitamins, minerals)"
  - "This is likely a premium house infusion; actual sugar content may vary ±30% depending on recipe"
change_log:
  - timestamp: "2025-11-13T00:00:00+00:00"
    updated_by: "Claude Code (Haiku 4.5)"
    reason: "Initial estimation for Mari Vanna London honey & chilli infusion shot"
    fields_changed: [all fields]
    sources:
      - note: "Component analysis: 30ml 40% ABV vodka + ~1.5g honey infusion"
      - note: "USDA FoodData Central for vodka and honey composition"
      - note: "UK measures standard (25-35ml single measure)"
      - note: "Alcohol energy factor: 7 kcal/g"
      - note: "Honey composition: ~80% sugars (glucose/fructose), 17% water, 3% other"
```
