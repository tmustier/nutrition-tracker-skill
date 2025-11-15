## Prawn Croquetas (Maison Estelle)

```yaml
id: prawn_croquetas_maison-estelle_v1
schema_version: 2
version: 1
last_verified: 2025-11-15
source:
  venue: Maison Estelle - Basque Restaurant
  menu_page: "https://maisonestelle.com/"
  evidence:
    - "Research: Spanish prawn croquetas typically 50-60g per piece for upscale restaurants"
    - "Component composition: 17% prawns, 14% butter (commercial artisanal standard)"
    - "USDA FDC #175180: Shrimp, cooked, moist heat (99 kcal, 24g protein per 100g)"
    - "USDA FDC #173430: Butter, salted (717 kcal, 81g fat per 100g)"
    - "USDA FDC #171265: Milk, whole (UK: 60µg iodine/100g, 2-3× higher than EU)"
    - "USDA FDC #168890: Flour, all-purpose, enriched"
    - "USDA FDC #168872: Breadcrumbs, dry, grated, plain"
    - "Deep-fried Spanish croquetas: 10-15% oil absorption typical"
    - "Component-based estimation: bechamel (butter, flour, milk) + prawns + breadcrumb coating + olive oil absorption"
aliases: []
category: side
portion:
  description: "1 piece (tapas portion, part of 3-piece special)"
  est_weight_g: 60
  notes: "Upscale Basque restaurant quality. Special version comes as 3 pieces. Deep-fried Spanish-style croqueta with creamy bechamel filling."
assumptions:
  salt_scheme: "normal"
  oil_type: "olive oil (for frying)"
  prep: "Deep-fried Spanish croqueta. Bechamel filling: butter, flour, whole milk, prawns. Coated in flour, egg wash, breadcrumbs. Oil absorption ~12% during frying (7.5g). Finishing salt 0.5% of weight (0.3g = 120mg sodium)."
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 199
  protein_g: 4.9
  fat_g: 15.5
  sat_fat_g: 5.9
  mufa_g: 7.6
  pufa_g: 1.3
  trans_fat_g: 0.3
  cholesterol_mg: 48
  # Carbohydrates
  carbs_total_g: 10.3
  carbs_available_g: 9.8
  sugar_g: 1.2
  fiber_total_g: 0.4
  fiber_soluble_g: 0.1
  fiber_insoluble_g: 0.3
  polyols_g: 0.0
  # Minerals
  sodium_mg: 240
  potassium_mg: 62
  iodine_ug: 16
  magnesium_mg: 10
  calcium_mg: 42
  iron_mg: 0.7
  zinc_mg: 0.4
  vitamin_c_mg: 0.2
  manganese_mg: 0.09
  copper_mg: 0.06
  selenium_ug: 11
  chromium_ug: 0.4
  molybdenum_ug: 4
  phosphorus_mg: 63
  chloride_mg: 370
  sulfur_g: 0.05
  # Vitamins
  vitamin_a_ug: 70
  vitamin_d_ug: 0.4
  vitamin_e_mg: 1.5
  vitamin_k_ug: 5
  vitamin_b1_mg: 0.10
  vitamin_b2_mg: 0.10
  vitamin_b3_mg: 1.0
  vitamin_b5_mg: 0.2
  vitamin_b6_mg: 0.04
  vitamin_b7_ug: 2
  vitamin_b9_ug: 21
  vitamin_b12_ug: 0.3
  choline_mg: 20
  # Fatty acids
  omega3_epa_mg: 17
  omega3_dha_mg: 16
  omega3_ala_g: 0.11
  omega6_la_g: 1.1
  # Ultra-trace minerals (not tracked)
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 0.4
quality:
  confidence: medium
  gaps:
    - "Exact bechamel recipe (butter-to-milk ratio varies by chef)"
    - "Precise oil absorption during frying (estimated 12% based on 10-15% range)"
    - "Prawn size and quality (assumed high-quality for upscale Mayfair restaurant)"
notes:
  - "Atwater validation: 4×4.9 + 9×15.5 + 4×9.8 + 2×0.4 = 19.6 + 139.5 + 39.2 + 0.8 = 199.1 kcal ≈ 199 kcal (within 0.1%)"
  - "Component breakdown for 60g croqueta: Prawns 10.2g (17%), Butter 8.4g (14%), Milk 19g, Bechamel flour 5g, Breadcrumbs 5g, Coating flour 2.5g, Egg wash 2.4g, Olive oil absorbed 7.5g"
  - "Fat breakdown: Butter 6.8g (4.3 SFA, 1.8 MUFA, 0.25 PUFA, 0.28 trans), Olive oil 7.5g (1.0 SFA, 5.5 MUFA, 0.8 PUFA), Milk/Egg/Breadcrumbs 1.2g. Total: 5.9 + 7.6 + 1.3 + 0.3 = 15.1g (0.4g unassigned = glycerol backbone)"
  - "Sodium sources: Butter 60mg + Breadcrumbs 37mg + Milk/Egg 12mg + Intrinsic prawns 11mg + Finishing salt 120mg (0.5% of weight) = 240mg"
  - "Chloride derived: 240mg sodium × 1.54 = 370mg (NaCl mass ratio)"
  - "Sulfur derived: 4.9g protein × 0.01 (animal) = 0.05g (prawns, milk, egg, butter are animal products)"
  - "Iodine: UK milk contributes 11.4µg (60µg/100g, 2-3× higher than EU), prawns 3.6µg, egg 1.2µg = 16µg total"
  - "Omega-3: Prawns contribute EPA 17mg + DHA 15mg from marine sources. ALA 0.11g from butter/milk/olive oil (plant sources)"
  - "Vitamin A: Butter 58µg + Milk 9µg + Egg 4µg = 70µg RAE (retinol activity equivalents)"
  - "Fiber split: 25% soluble / 75% insoluble (from wheat flour and breadcrumbs)"
  - "Premium restaurant quality: Real butter (not margarine), whole milk bechamel, high prawn content, authentic Spanish deep-frying technique"
  - "For 3-piece special: multiply all values by 3 = 597 kcal, 14.7g protein, 46.5g fat, 29.4g carbs"
change_log:
  - timestamp: "2025-11-15T00:00:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial creation via component-based estimation for Basque restaurant at Maison Estelle, Mayfair"
    fields_changed: ["all fields"]
    sources:
      - url: "https://www.sbs.com.au/food/recipes/prawn-croqueta"
        note: "Spanish prawn croqueta recipe - typical composition and bechamel technique"
      - url: "https://www.spain-recipes.com/prawn-croquettes.html"
        note: "Traditional Spanish croquetas de gambas - 17% prawn content, bechamel ratios"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/175180/nutrients"
        note: "USDA FDC #175180: Shrimp, cooked, moist heat - complete micronutrient profile"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/173430/nutrients"
        note: "USDA FDC #173430: Butter, salted - fatty acid breakdown, vitamin A"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/171265/nutrients"
        note: "USDA FDC #171265: Milk, whole - UK iodine content (2-3× higher than EU)"
      - url: "component_analysis"
        note: "Component-based estimation methodology"
        methodology: "Researched typical Spanish croqueta composition (17% prawns, 14% butter, bechamel base). Estimated 60g per piece for upscale restaurant special version. Broke down components: bechamel filling (butter 8.4g, flour 5g, milk 19g, prawns 10.2g), coating (breadcrumbs 5g, flour 2.5g, egg 2.4g), frying oil absorption 7.5g (12%). Calculated all 52 nutrients from USDA FDC component data scaled to weights. Added finishing salt 0.3g (0.5% of weight). Validated energy within 0.1% using Atwater formula. Confidence: MEDIUM (±25%) due to bechamel recipe variation and oil absorption estimation."
```
