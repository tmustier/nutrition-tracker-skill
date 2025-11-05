## Crispbread with Avocado

```yaml
id: crispbread_avocado_30g_homemade_v1
version: 1
schema_version: 2
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
  enrichment_method: "component-based estimation: buckwheat nutrients from USDA (scaled to 5g) + avocado nutrients from enriched databank file (scaled to 25g)"
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
  potassium_mg: 150
  iodine_ug: 0
  magnesium_mg: 20
  calcium_mg: 5
  iron_mg: 0.2
  zinc_mg: 0.16
  vitamin_c_mg: 2.7
  manganese_mg: 0.10
  copper_mg: 0.098
  selenium_ug: 0.5
  vitamin_d_ug: 0
  vitamin_e_mg: 0.49
  omega3_ala_g: 0.03
  omega3_dha_mg: 0
  omega3_epa_mg: 0
  omega6_la_g: 0.45
  chloride_mg: 0
  phosphorus_mg: 30.9
  sulfur_mg: 0
  chromium_ug: 0
  molybdenum_ug: 0
  boron_mg: 0
  nickel_ug: 0
  silicon_mg: 0
  vanadium_ug: 0
  vitamin_a_ug: 1.8
  vitamin_k_ug: 5.3
  choline_mg: 3.6
  vitamin_b1_mg: 0.022
  vitamin_b2_mg: 0.058
  vitamin_b3_mg: 0.83
  vitamin_b5_mg: 0.39
  vitamin_b6_mg: 0.084
  vitamin_b7_ug: 1.5
  vitamin_b9_ug: 23.8
  vitamin_b12_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "Choline data unavailable for buckwheat component (only avocado contribution included)"
    - "Vitamin E and K data unavailable for buckwheat component (only avocado contribution included)"
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
  - "**Nutrient enrichment (2025-11-05):**"
  - "  • Added 13 of 17 priority nutrients using component-based estimation"
  - "  • Buckwheat data: USDA FoodData Central (per 100g, scaled to 5g)"
  - "  • Avocado data: Enriched databank file (75g portion, scaled to 25g)"
  - "  • Method: Sum individual component contributions"
  - "  • Notable sources: Avocado rich in vitamin E (0.49mg), vitamin K (5.3µg), folate/B9 (23.8µg), vitamin B6 (0.084mg)"
change_log:
  - timestamp: "2025-11-05T20:15:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Phase 2 enrichment: Added 8 critical nutrients using REAL USDA values from enriched component files. FIXED incomplete mineral summations."
    fields_changed:
      - "vitamin_b5_mg (0 → 0.39)"
      - "vitamin_b7_ug (0 → 1.5)"
      - "omega3_ala_g (0 → 0.03)"
      - "omega6_la_g (0 → 0.45)"
      - "calcium_mg (3 → 5, CORRECTED sum)"
      - "magnesium_mg (7 → 20, CORRECTED sum)"
      - "potassium_mg (121 → 150, CORRECTED sum)"
      - "iron_mg (0 → 0.2, CORRECTED sum)"
      - "zinc_mg (0 → 0.16, CORRECTED sum)"
    sources:
      - url: "amisa_buckwheat_crispbread_5g_v1"
        note: "Crispbread 5g: B5=0.022mg, B7=0µg, ALA=0.004g, LA=0.035g, Ca=2mg, Mg=13mg, K=29mg, Fe=0.20mg, Zn=0.16mg"
      - url: "avocado_fresh_75g_generic-ingredients_v1"
        note: "Avocado 25g (scaled from 75g × 0.333): B5=0.366mg, B7=1.5µg, ALA=0.0266g, LA=0.416g, Ca=3mg, Mg=7mg, K=121mg, Fe=0mg, Zn=0mg"
    methodology: "Component-based summation: Buckwheat (5g) + Avocado (25g from 75g portion). Calculations: B5: 0.022+0.366=0.39mg; B7: 0+1.5=1.5µg (biotin from avocado); ALA: 0.004+0.027=0.03g (omega-3 from avocado); LA: 0.035+0.416=0.45g (omega-6 primarily from avocado); Ca: 2+3=5mg; Mg: 13+7=20mg; K: 29+121=150mg; Fe: 0.20+0=0.2mg (from crispbread only); Zn: 0.16+0=0.16mg (from crispbread only). Previous enrichment had incomplete mineral summations - now corrected."
  - timestamp: "2025-11-05T12:00:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Enriched with 17 priority nutrients using component-based estimation"
    fields_changed:
      - "vitamin_a_ug"
      - "vitamin_e_mg"
      - "vitamin_k_ug"
      - "vitamin_b1_mg"
      - "vitamin_b2_mg"
      - "vitamin_b3_mg"
      - "vitamin_b6_mg"
      - "vitamin_b9_ug"
      - "choline_mg"
      - "phosphorus_mg"
      - "copper_mg"
      - "selenium_ug"
      - "manganese_mg"
    sources:
      - url: "https://www.nutritionvalue.org/Buckwheat_nutritional_value.html"
        note: "USDA buckwheat data (per 100g) scaled to 5g crispbread: phosphorus 347mg, copper 1.10mg, selenium 8.3µg, manganese 1.30mg, B vitamins (B1 0.10mg, B2 0.43mg, B3 7.02mg, B6 0.21mg, B9 30µg)"
      - url: "avocado_fresh_75g_generic-ingredients_v1"
        note: "Enriched avocado file scaled from 75g to 25g: vitamin A 1.8µg, vitamin E 0.49mg, vitamin K 5.3µg, choline 3.6mg, plus additional B vitamins, minerals"
    methodology: "Component-based summing: (1) Buckwheat crispbread 5g = USDA per-100g values × 0.05; (2) Avocado 25g = databank 75g values ÷ 3; (3) Sum both components. Plant-based dish: vitamin D, B12, EPA, DHA confirmed as 0. Iodine not tracked in sources."
  - timestamp: "2025-11-05T00:00:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Initial homemade recipe creation for daily snack tracking"
    fields_changed:
      - "all fields"
    sources:
      - url: "component_calculation"
        note: "Combined nutrition from amisa_buckwheat_crispbread_5g_v1 + avocado_fresh_75g_generic-ingredients_v1 (scaled to 25g) + 80mg added sodium"
```
