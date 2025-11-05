## Crispbread with Chavroux Goat's Cheese

```yaml
id: crispbread_goat_cheese_29g_homemade_v1
version: 1
schema_version: 2
last_verified: 2025-11-05
source:
  venue: Homemade / Prepared at Home
  menu_page: ""
  evidence:
    - "Component data: amisa_buckwheat_crispbread_5g_v1 (5g)"
    - "Component data: chavroux_mild_creamy_goat_cheese_12g_chavroux_v1 (24g = 2 slices)"
    - "Calculation: Sum of component nutrition values"
aliases: []
category: ingredient
portion:
  description: "1 topped crispbread (5g crispbread + 24g Chavroux cheese)"
  est_weight_g: 29
  notes: "No added salt - cheese provides sufficient sodium (120mg total from 96mg cheese + 24mg crispbread)"
assumptions:
  salt_scheme: "packaged"
  oil_type: ""
  prep: "Fresh assembly: 1 Amisa buckwheat crispbread topped with 2 slices Chavroux mild & creamy goat's cheese"
  micronutrient_estimation: "Component-based: 17 priority nutrients calculated by summing USDA data for buckwheat flour (scaled to 5g crispbread) and soft goat cheese (scaled to 24g portion)"
per_portion:
  energy_kcal: 53.3
  protein_g: 2.5
  fat_g: 2.9
  sat_fat_g: 2.2
  mufa_g: 0.5
  pufa_g: 0.2
  trans_fat_g: 0.0
  cholesterol_mg: 12
  carbs_total_g: 4.4
  carbs_available_g: 4.0
  sugar_g: 0.7
  fiber_total_g: 0.4
  fiber_soluble_g: 0.1
  fiber_insoluble_g: 0.3
  polyols_g: 0.0
  sodium_mg: 120
  potassium_mg: 38
  iodine_ug: 4
  magnesium_mg: 6
  calcium_mg: 72
  iron_mg: 0.4
  zinc_mg: 0.2
  vitamin_c_mg: 0.0
  manganese_mg: 0.1
  copper_mg: 0.2
  selenium_ug: 1
  vitamin_d_ug: 0.1
  vitamin_e_mg: 0.1
  omega3_ala_g: 0
  omega3_dha_mg: 0
  omega3_epa_mg: 0
  omega6_la_g: 0
  chloride_mg: 0
  phosphorus_mg: 78
  sulfur_g: 0
  chromium_ug: 0
  molybdenum_ug: 0
  boron_mg: 0
  nickel_ug: 0
  silicon_mg: 0
  vanadium_ug: 0
  vitamin_a_ug: 69
  vitamin_k_ug: 0.5
  choline_mg: 4.6
  vitamin_b1_mg: 0.05
  vitamin_b2_mg: 0.10
  vitamin_b3_mg: 0.5
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0.10
  vitamin_b7_ug: 0
  vitamin_b9_ug: 6
  vitamin_b12_ug: 0.05
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps:
    - "Micronutrients from crispbread (potassium, minerals, vitamins) not labeled on package - treated as zero"
    - "MUFA/PUFA split for cheese estimated from typical goat cheese fatty acid profile"
notes:
  - "**Component breakdown (29g total):**"
  - "  • 1 Amisa buckwheat crispbread: 5g (17.3 kcal, 0.5g protein, 0.1g fat, 3.8g total carbs, 0.4g fiber, 24mg sodium)"
  - "  • 2 slices Chavroux mild & creamy goat's cheese: 24g total (36 kcal, 2.0g protein, 2.8g fat, 0.6g carbs, 96mg sodium)"
  - ""
  - "**Preparation notes:**"
  - "  • NO added salt (user explicitly noted this) - total sodium 120mg comes from natural content in ingredients"
  - "  • Crispbread: Organic gluten-free buckwheat (98.5%) with light sea salt (1.5%)"
  - "  • Cheese: Premium French goat's cheese (12% fat), mild & creamy variety"
  - ""
  - "**Nutrition highlights:**"
  - "  • Good source of calcium (72mg = 9% DV) from goat's cheese"
  - "  • Complete protein (2.5g) with all essential amino acids from dairy"
  - "  • Low in added salt - 120mg sodium (0.30g salt equivalent)"
  - "  • Gluten-free, suitable for celiac/gluten-sensitive individuals"
  - "  • Goat cheese naturally lower in lactose than cow's milk cheese"
  - ""
  - "**Atwater validation:** 4×2.5 + 9×2.9 + 4×4.0 + 2×0.4 + 2.4×0.0 = 10.0 + 26.1 + 16.0 + 0.8 + 0.0 = 52.9 kcal (within 0.7% of stated 53.3 kcal)"
  - ""
  - "**Macronutrient split:** 19% protein, 49% fat, 30% carbs (available carb basis), 2% fiber"
change_log:
  - timestamp: "2025-11-05T10:52:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Initial entry - homemade recipe combining Amisa buckwheat crispbread with Chavroux goat's cheese"
    fields_changed:
      - "all fields"
    evidence:
      - source: "amisa_buckwheat_crispbread_5g_v1"
        note: "Component 1: 5g crispbread providing 17.3 kcal, 0.5g protein, 3.8g carbs, 0.4g fiber, 24mg sodium"
      - source: "chavroux_mild_creamy_goat_cheese_12g_chavroux_v1"
        note: "Component 2: 24g cheese (2×12g slices) providing 36 kcal, 2.0g protein, 2.8g fat, 96mg sodium"
      - note: "All nutrition values calculated by summing component portions - no added ingredients"
  - timestamp: "2025-11-05T15:30:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Enrichment with 17 priority nutrients using component-based USDA estimation"
    fields_changed:
      - "vitamin_d_ug (0.2→0.1)"
      - "vitamin_a_ug (0→69)"
      - "vitamin_e_mg (0.0→0.1)"
      - "vitamin_k_ug (0→0.5)"
      - "vitamin_b1_mg (0→0.05)"
      - "vitamin_b2_mg (0→0.10)"
      - "vitamin_b3_mg (0→0.5)"
      - "vitamin_b6_mg (0→0.10)"
      - "vitamin_b9_ug (0→6)"
      - "vitamin_b12_ug (0→0.05)"
      - "choline_mg (0→4.6)"
      - "phosphorus_mg (0→78)"
      - "selenium_ug (0→1)"
      - "manganese_mg (0.0→0.1)"
    evidence:
      - source: "USDA FoodData Central - Buckwheat flour, whole-groat"
        url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/718368/nutrients"
        note: "5g crispbread nutrients: 17mg phosphorus, 0.03mg copper, 0.4µg selenium, 0.12mg manganese, B-vitamins, 3µg folate, 1.0mg choline"
      - source: "USDA FoodData Central - Cheese, goat, soft type (FDC 173435)"
        url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/173435/nutrients"
        note: "24g goat cheese nutrients: 69µg vitamin A, 0.1µg vitamin D, 61mg phosphorus, 0.18mg copper, 0.7µg selenium, 0.05µg B12, 3.6mg choline, B-vitamins"
      - note: "Component-based method: Summed scaled nutrient values from both components (5g buckwheat crispbread + 24g soft goat cheese)"
      - note: "Iodine already estimated at 4µg from UK dairy fortification (all from cheese component)"
```
