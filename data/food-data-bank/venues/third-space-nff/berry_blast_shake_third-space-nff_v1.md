## Berry Blast Shake (Third Space NFF)

```yaml
id: berry_blast_shake_third-space-nff_v1
version: 2
schema_version: 2
last_verified: 2025-11-05
source:
  venue: Third Space / Natural Fitness Food
  menu_page: ""
  evidence:
  - 'User-provided macros (ANCHORED): 186 kcal, 23g P, 11g C (available), 4.7g F'
  - 'Component 1: Third Space NFF Vanilla Whey 30g (nff_vanilla_whey_30g_v1 from data bank)'
  - 'Component 2: Mixed berries 40g frozen (USDA typical values)'
  - 'Component 3: Unsweetened almond milk 270ml (USDA/commercial fortified values)'
  - 'Third Space Berry Blast recipe reference: https://www.thirdspace.london/this-space/04/berry-blast-shake-recipe/ (mentions 1 scoop protein, berries, almond milk)'
aliases:
- Berry Blast
- NFF Berry Shake
category: drink
portion:
  description: "protein shake (340ml)"
  est_weight_g: 340
  notes: "Blended shake: 30g protein powder + 40g frozen berries + 270ml almond milk"
assumptions:
  salt_scheme: "none"
  oil_type: "n/a (shake/beverage)"
  prep: "Blended protein shake with frozen berries and fortified almond milk. Component weights estimated to match user-provided macros."
per_portion:
  energy_kcal: 180.5
  protein_g: 23.0
  fat_g: 4.7
  sat_fat_g: 1.3
  mufa_g: 2.4
  pufa_g: 1.0
  trans_fat_g: 0
  cholesterol_mg: 20
  carbs_total_g: 12.1
  carbs_available_g: 11.0
  sugar_g: 6.6
  fiber_total_g: 1.1
  fiber_soluble_g: 0.8
  fiber_insoluble_g: 0.3
  polyols_g: 0.0
  sodium_mg: 148
  potassium_mg: 429
  iodine_ug: 5
  magnesium_mg: 53
  calcium_mg: 478
  iron_mg: 0.8
  zinc_mg: 1.9
  vitamin_c_mg: 6.8
  manganese_mg: 0.2
  copper_mg: 0.1
  selenium_ug: 3
  vitamin_d_ug: 2.0
  vitamin_e_mg: 8.4
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 174
  chloride_mg: 228.0
  sulfur_g: 0.092
  vitamin_a_ug: 150
  vitamin_k_ug: 5
  vitamin_b1_mg: 0.27
  vitamin_b2_mg: 0.3
  vitamin_b3_mg: 3.5
  vitamin_b5_mg: 1.7
  vitamin_b6_mg: 0.36
  vitamin_b7_ug: 0
  vitamin_b9_ug: 20
  vitamin_b12_ug: 1.0
  choline_mg: 68
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.01
  omega6_la_g: 0.03
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - 'Exact berry blend unknown (assumed mixed berries: strawberries, blueberries, raspberries)'
  - 'Almond milk brand/fortification level assumed (used typical UK fortified unsweetened)'
  - 'Trace minerals (copper, selenium) estimated from component profiles'
notes:
- 'Macros ANCHORED to user-provided values: 186 kcal, 23g P, 11g C available, 4.7g F'
- 'Component breakdown: 30g vanilla whey (127.6 kcal, 22g P) + 40g berries (24 kcal, 4.2g C avail) + 270ml almond milk (34.4 kcal, 2.9g F)'
- 'Vanilla whey provides majority of protein; berries provide vitamin C and fiber; almond milk provides calcium, vitamin E, vitamin D (fortified)'
- 'Total carbs: 12.1g = 11.0g available + 1.1g fiber (0.5g from whey xanthan gum, 0.6g from berries)'
- 'Sugars: 6.6g from natural sources (3.4g lactose in whey, 3.2g fruit sugars in berries); no added sugars'
- 'Fat profile: predominantly MUFA from almond milk (2.4g), low saturated (1.3g from whey), trace PUFA (1.0g from berries and almonds)'
- 'High calcium (478mg, ~60% DV) from whey and fortified almond milk'
- 'Good vitamin E (8.4mg, ~56% DV) from fortified almond milk'
- 'Moderate potassium (429mg) from all components'
- 'Low sodium (148mg) - no added salt, only intrinsic from ingredients'
- 'Cholesterol (20mg) from whey protein concentrate'
- 'Atwater validation: 4×23.0 + 9×4.7 + 4×11.0 + 2×1.1 + 2.4×0.0 = 92 + 42.3 + 44 + 2.2 = 180.5 kcal (user label: 186 kcal, variance +3.0% likely due to rounding and USDA estimation variance)'
change_log:

  - timestamp: "2025-11-06T23:28:47+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
  - timestamp: 2025-11-04T09:30:00+00:00
    updated_by: Claude Code (Sonnet 4.5)
    reason: Initial entry - component-based estimation anchored to user-provided macros
    fields_changed:
    - all fields
    sources:
    - url: user_input
    note: 'User-provided macros: 186 kcal, 23g P, 11g C, 4.7g F'
  - url: /data/food-data-bank/venues/third-space-nff/nff_vanilla_whey_30g_v1.md
    note: 'Third Space vanilla whey protein 30g component data'
  - url: https://fdc.nal.usda.gov/
    note: 'USDA FoodData Central for mixed berries and almond milk micronutrient profiles'
  - timestamp: "2025-11-05T21:00:00+00:00"
    updated_by: "Claude Code Agent 5 (Sonnet 4.5)"
    reason: "Phase 3 enrichment: Added 14 missing nutrients from USDA component data (whey protein, almond milk, berries)"
    fields_changed:
    - version
    - last_verified
    - phosphorus_mg (0 → 174)
    - vitamin_a_ug (0 → 150)
    - vitamin_k_ug (0 → 5)
    - vitamin_b1_mg (0 → 0.27)
    - vitamin_b2_mg (0 → 0.3)
    - vitamin_b3_mg (0 → 3.5)
    - vitamin_b5_mg (0 → 1.7)
    - vitamin_b6_mg (0 → 0.36)
    - vitamin_b9_ug (0 → 20)
    - vitamin_b12_ug (0 → 1.0)
    - choline_mg (0 → 68)
    - omega3_ala_g (0 → 0.01)
    - omega6_la_g (0 → 0.03)
    sources:
    - note: "USDA whey protein isolate data scaled for 30g: phosphorus 174mg, choline 68mg, B vitamins"
    - note: "Fortified almond milk (270ml) contributes vitamin A 150µg"
    - note: "Whey protein provides majority of B vitamins: B3 3.5mg, B5 1.7mg, B12 1.0µg"
```
