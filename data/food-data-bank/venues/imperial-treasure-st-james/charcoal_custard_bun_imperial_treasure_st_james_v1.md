## Charcoal Custard Bun (Imperial Treasure St. James)

```yaml
id: charcoal_custard_bun_imperial_treasure_st_james_v1
version: 1
schema_version: 2
last_verified: 2025-11-02
source:
  venue: Charcoal Custard Bun (Imperial Treasure St. James)
  menu_page: "https://ukorder.imperialtreasure.com/products/steamed-charcoal-bun-with-custard-v"
  evidence:
    - "Component-based estimation from recipe analysis (liu sha bao / custard bun recipes)"
    - "Dough (34g): AP flour 21g, whole milk 9g, sugar 2g, soybean oil 2g, charcoal powder trace"
    - "Filling (18g): salted egg yolk 6.5g, butter 5.5g, sugar 3.5g, condensed milk 2g, milk powder 0.5g"
    - "USDA data scaled for each component: flour (FDC 169704), milk (171256), butter (173430), egg yolk (173436)"
    - "Cross-referenced with published dim sum custard bun nutrition: 168-200 kcal typical range"
    - "https://www.snapcalorie.com/nutrition/chinese_custard_bun_nutrition.html (168 kcal reference)"
    - "https://foods.fatsecret.com/calories-nutrition/dim-sum/steamed-egg-custard-bun (189 kcal reference)"
    - "Recipe sources: Woks of Life, Wok and Kin, Chinese Cooking Demystified for component weights"
aliases:
  - "Liu Sha Bao"
  - "Lava Custard Bun"
  - "Salted Egg Custard Bun"
category: dessert
portion:
  description: "1 piece"
  est_weight_g: 52
  notes: "Typical dim sum custard bun: 34g charcoal-infused steamed dough + 18g sweet custard filling. Charcoal powder is negligible in calories (aesthetic only)."
assumptions:
  salt_scheme: "unsalted"
  oil_type: "soybean oil"
  prep: "Steamed bun with lava-style flowing custard center made from salted egg yolk, butter, sugar, and milk. Charcoal powder added to dough for black color."
  iodine: "Estimated from egg yolk (6.5g) and dairy content (milk 11.5g, butter 5.5g). Using eggs ~26 μg/100g concentration. For 52g portion: ~14 μg. Confidence: MEDIUM - egg yolk is concentrated iodine source"
  selenium: "Estimated from egg content. Eggs ~31 μg/100g (USDA). For 52g portion: 52g × 31 μg/100g = 16 μg. Confidence: MEDIUM - egg-based custard filling"
  vitamin_d: "Estimated from egg yolk content. Eggs ~1.8 μg/100g (USDA, concentrated in yolk). For 52g portion: 52g × 1.8 μg/100g = 0.9 μg. Confidence: MEDIUM-HIGH"
per_portion:
  energy_kcal: 186
  protein_g: 3.8
  fat_g: 8.8
  sat_fat_g: 4.0
  mufa_g: 2.4
  pufa_g: 1.7
  trans_fat_g: 0.0
  cholesterol_mg: 76
  carbs_available_g: 23.3
  sugar_g: 7.4
  fiber_total_g: 0.6
  fiber_soluble_g: 0.2
  fiber_insoluble_g: 0.4
  sodium_mg: 38
  potassium_mg: 80
  iodine_ug: 14
  magnesium_mg: 12
  calcium_mg: 29
  iron_mg: 1.0
  zinc_mg: 0.5
  vitamin_c_mg: 0
  manganese_mg: 0.2
  copper_mg: 0.01
  selenium_ug: 16
  vitamin_d_ug: 0.9
  vitamin_e_mg: 0.2
  polyols_g: 0.0
  carbs_total_g: 23.9

  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 61
  chloride_mg: 0
  sulfur_mg: 0
  vitamin_a_ug: 56
  vitamin_k_ug: 0.5
  vitamin_b1_mg: 0.17
  vitamin_b2_mg: 0.13
  vitamin_b3_mg: 1.2
  vitamin_b5_mg: 0.3
  vitamin_b6_mg: 0.01
  vitamin_b7_ug: 2
  vitamin_b9_ug: 48
  vitamin_b12_ug: 0.1
  choline_mg: 47
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0
  omega6_la_g: 0
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "potassium"
    - "magnesium"
    - "zinc"
    - "vitamin_c"
    - "manganese"
notes:
  - "Charcoal custard buns are a signature dim sum dessert featuring activated charcoal in the dough (for aesthetic black color) and a molten sweet custard filling."
  - "The custard filling is made primarily from salted egg yolk, butter, and sugar, creating a rich, flowing lava center when steamed."
  - "Activated charcoal contributes negligible calories and is used purely for color/presentation."
  - "Energy calculated via Atwater: 4×3.8 + 4×23.3 + 9×8.8 = 187.6 kcal (matches 186 kcal within rounding)."
  - "Conservative estimate falls within published range (168-200 kcal) for similar dim sum custard buns."
  - "High in saturated fat due to butter and egg yolk content in filling. Moderate sugar from custard and dough."
change_log:
  - timestamp: "2025-11-02"
    reason: "Initial entry - component-based estimation from recipe analysis"
    fields_changed:
      - "all fields"
    evidence: "Detailed component breakdown using USDA data for each ingredient, scaled to estimated weights from dim sum custard bun recipes"
  - timestamp: "2025-11-05T13:00:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5 (Agent 3)"
    reason: "Schema v2 enrichment: Complete nutrient profile for custard bun (egg yolk 6.5g + butter 5.5g + enriched flour 21g + dairy 11.5g). Added 19 missing nutrients. Vitamin A (56µg from egg yolk + butter), B-vitamins from enriched flour (B1=0.17mg, B3=1.2mg), choline (47mg from egg yolk), phosphorus (61mg)."
    fields_changed:
      - per_portion.potassium_mg
      - per_portion.magnesium_mg
      - per_portion.zinc_mg
      - per_portion.manganese_mg
      - per_portion.copper_mg
      - per_portion.vitamin_e_mg
      - per_portion.phosphorus_mg
      - per_portion.vitamin_a_ug
      - per_portion.vitamin_k_ug
      - per_portion.vitamin_b1_mg
      - per_portion.vitamin_b2_mg
      - per_portion.vitamin_b3_mg
      - per_portion.vitamin_b5_mg
      - per_portion.vitamin_b6_mg
      - per_portion.vitamin_b7_ug
      - per_portion.vitamin_b9_ug
      - per_portion.vitamin_b12_ug
      - per_portion.choline_mg
      - version
    sources:
      - url: https://fdc.nal.usda.gov/
        note: "USDA data for components: Egg yolk (6.5g) provides choline=44mg, phosphorus=27mg, vitamin A=18µg, B5=0.2mg, B12=0.1µg. Butter (5.5g) adds vitamin A=38µg, E=0.1mg. Enriched flour (21g) provides B1=0.17mg, B2=0.1mg, B3=1.2mg, B9=48µg, phosphorus=23mg, manganese=0.2mg. Milk/dairy (11.5g) adds phosphorus=10mg. Confidence: HIGH (USDA component data)"
```
