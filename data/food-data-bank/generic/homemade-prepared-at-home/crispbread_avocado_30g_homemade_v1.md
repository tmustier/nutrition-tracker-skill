## Crispbread with Avocado

```yaml
id: crispbread_avocado_30g_homemade_v1
version: 1
last_verified: 2025-11-05
source:
  venue: Homemade / Prepared at Home
  menu_page: ""
  evidence:
    - "Calculated from component ingredients"
    - "amisa_buckwheat_crispbread_5g_v1"
    - "avocado_fresh_75g_generic-ingredients_v1"
aliases: []
category: ingredient
portion:
  description: "1 topped crispbread"
  est_weight_g: 30
  notes: "One Amisa buckwheat crispbread (5g) topped with 25g fresh avocado and sprinkle of salt"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: "fresh assembly"
per_portion:
  energy_kcal: 57.3
  protein_g: 1.0
  fat_g: 3.8
  sat_fat_g: 0.5
  mufa_g: 2.5
  pufa_g: 0.5
  trans_fat_g: 0.0
  cholesterol_mg: 0
  carbs_total_g: 5.9
  carbs_available_g: 3.9
  sugar_g: 0.3
  fiber_total_g: 2.1
  fiber_soluble_g: 0.5
  fiber_insoluble_g: 1.6
  polyols_g: 0.0
  sodium_mg: 106
  potassium_mg: 121
  iodine_ug: 0
  magnesium_mg: 7
  calcium_mg: 3
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 2.7
  manganese_mg: 0
  copper_mg: 0
  selenium_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  omega3_ala_g: 0
  omega3_dha_mg: 0
  omega3_epa_mg: 0
  omega6_la_g: 0
  chloride_mg: 0
  phosphorus_mg: 0
  sulfur_g: 0
  chromium_ug: 0
  molybdenum_ug: 0
  boron_mg: 0
  nickel_ug: 0
  silicon_mg: 0
  vanadium_ug: 0
  vitamin_a_ug: 0
  vitamin_k_ug: 0
  choline_mg: 0
  vitamin_b1_mg: 0
  vitamin_b2_mg: 0
  vitamin_b3_mg: 0
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0
  vitamin_b7_ug: 0
  vitamin_b9_ug: 0
  vitamin_b12_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "Copper, selenium, vitamin D, vitamin E not tracked in source ingredients"
    - "Avocado portion estimated at 25g per crispbread based on Nov 3 pattern"
notes:
  - "**Component breakdown (per topped crispbread):**"
  - "  • 5g Amisa buckwheat crispbread (amisa_buckwheat_crispbread_5g_v1)"
  - "  • 25g fresh Hass avocado (scaled from avocado_fresh_75g_generic-ingredients_v1 by factor 0.333)"
  - "  • ~80mg added sodium from salt sprinkle"
  - "**Weight assumptions:**"
  - "  • Base crispbread: 5g (confirmed product weight)"
  - "  • Avocado portion: 25g per crispbread (estimated from Nov 3 log pattern: 75g avocado ÷ 4 crispbreads = 18.75g, rounded up to 25g for practical measuring)"
  - "  • Total topped weight: ~30g"
  - "**Salt addition:**"
  - "  • User reported 'sprinkle of salt' on each crispbread"
  - "  • Estimated at 80mg sodium per crispbread (240mg total for 3 crispbreads consumed on Nov 5)"
  - "  • Equivalent to ~200mg table salt (0.2g) per topped crispbread"
  - "**Reference to Nov 3 log:**"
  - "  • Pattern: 4 crispbreads + 40g trout + 75g avocado + olive oil (combined meal)"
  - "  • Suggests 18.75g avocado per crispbread when combined with other toppings"
  - "  • Today's version uses 25g avocado as standalone topping (no trout/oil), providing more substantial portion"
  - "**Nutrition calculation method:**"
  - "  • Crispbread: Direct values from packaged product data"
  - "  • Avocado: USDA-based values scaled by 1/3 (25g from 75g portion)"
  - "  • Salt: Added 80mg sodium to total"
  - "  • All 24 nutrition fields summed from components"
  - "**Atwater energy verification:**"
  - "  • Formula: 4×P + 9×F + 4×carbs_available + 2×fiber + 2.4×polyols"
  - "  • Calculation: 4×1.0 + 9×3.8 + 4×3.9 + 2×2.1 + 2.4×0.0 = 58.0 kcal"
  - "  • Reported: 57.3 kcal (0.7 kcal difference due to rounding, within acceptable margin)"
change_log:
  - timestamp: "2025-11-05T00:00:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Initial homemade recipe creation for daily snack tracking"
    fields_changed:
      - "all fields"
    sources:
      - url: "component_calculation"
        note: "Combined nutrition from amisa_buckwheat_crispbread_5g_v1 + avocado_fresh_75g_generic-ingredients_v1 (scaled to 25g) + 80mg added sodium"
```
