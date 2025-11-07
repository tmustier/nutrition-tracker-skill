## Cote de Boeuf, Ex-Dairy, 30 days age (Maset)

```yaml
id: cote_de_boeuf_ex_dairy_30_days_maset_v1
version: 2
last_verified: 2025-11-06
source:
  venue: Maset, Marylebone (London)
  menu_page: "https://www.maset.london/"
  evidence:
  - "UK butcher data: Cote de Boeuf typical weight 600-800g (Tesco, Sainsbury's, independent butchers)"
  - "Thomas Joseph Butchery: Ex-dairy beef characteristics - well-marbled, grass-fed, yellowish fat"
  - "USDA FoodData Central: Beef ribeye nutrition data scaled for 525g cooked weight"
  - "Restaurant preparation: Grilled with butter basting (typical French steakhouse method)"
  - "Cooking loss: 25% for grilled ribeye (USDA cooking yields data)"
  - "Grass-fed beef omega-3 research: ~100mg total omega-3 per 100g, 90mg ALA, EPA/DHA present"
  - "Component analysis: 700g raw beef → 525g cooked + 30g butter + 5g herbs + 3.5g salt = 565g total"
aliases:
- "Cote de Boeuf"
- "Bone-in Ribeye"
- "Ex-dairy Cote de Boeuf"
category: main
portion:
  description: "full sharing portion (for 2)"
  est_weight_g: 565
  notes: "Thick-cut bone-in ribeye from ex-dairy cow, 30-day dry-aged, grilled and basted with butter, herbs (thyme, rosemary, garlic), finishing salt"
assumptions:
  salt_scheme: "normal"
  oil_type: "butter"
  prep: "700g raw ex-dairy ribeye (30-day aged) grilled to medium-rare with 25% cooking loss → 525g cooked; basted with 30g butter, fresh thyme & rosemary, crushed garlic; finished with ~3.5g sea salt"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 1759
  protein_g: 136.5
  fat_g: 134.7
  sat_fat_g: 60.1
  mufa_g: 56.9
  pufa_g: 6.2
  trans_fat_g: 1.6
  cholesterol_mg: 507
  # Carbohydrates
  carbs_total_g: 0.4
  carbs_available_g: 0.3
  sugar_g: 0.1
  fiber_total_g: 0.1
  fiber_soluble_g: 0.0
  fiber_insoluble_g: 0.1
  polyols_g: 0.0
  # Minerals
  sodium_mg: 1717
  potassium_mg: 1792
  iodine_ug: 47
  magnesium_mg: 126
  calcium_mg: 101
  iron_mg: 13.1
  zinc_mg: 28.9
  vitamin_c_mg: 0.5
  manganese_mg: 0.05
  copper_mg: 0.42
  selenium_ug: 147
  chromium_ug: 11
  molybdenum_ug: 0
  phosphorus_mg: 1057
  chloride_mg: 2644.0
  sulfur_g: 1.365
  # Vitamins
  vitamin_a_ug: 219
  vitamin_d_ug: 0.9
  vitamin_e_mg: 2.0
  vitamin_k_ug: 10.0
  vitamin_b1_mg: 0.42
  vitamin_b2_mg: 0.95
  vitamin_b3_mg: 37.8
  vitamin_b5_mg: 3.15
  vitamin_b6_mg: 2.63
  vitamin_b7_ug: 15.8
  vitamin_b9_ug: 52.5
  vitamin_b12_ug: 11.6
  choline_mg: 299
  # Fatty acids
  omega3_epa_mg: 53
  omega3_dha_mg: 11
  omega3_ala_g: 0.26
  omega6_la_g: 2.10
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - "No official nutrition data from Maset (new restaurant, opened Oct 2025)"
  - "Weight estimated from UK market standards for sharing Cote de Boeuf (600-800g range)"
  - "Ex-dairy marbling estimated 15-20% higher fat than standard grass-fed beef"
  - "Micronutrients scaled from USDA FoodData Central for grass-fed beef ribeye"
  - "Confidence: HIGH for macros (±10%), MEDIUM for minerals/B-vitamins (±20-30%), LOW for ultra-trace elements"
notes:
- "Cote de Boeuf = French term for bone-in ribeye, premium steakhouse cut"
- "Ex-dairy beef: From retired dairy cows, well-marbled from 5+ years on pasture, yellowish fat from grass-fed diet"
- "30-day dry aging: Concentrates flavor and nutrients by ~15% water loss, intensifies beefy taste"
- "Component breakdown: 525g cooked beef (1418 kcal, 136.5g P, 110.3g F) + 30g butter (215 kcal, 24.4g F) + herbs/salt"
- "Cooking loss: 700g raw → 525g cooked (25% loss typical for grilled ribeye)"
- "Restaurant preparation: High-heat grill/sear, butter basting with thyme, rosemary, garlic (classic French method)"
- "Butter adds: 219µg vitamin A, 15.5g saturated fat, 61mg cholesterol"
- "Grass-fed omega-3: Ex-dairy beef provides ALA (260mg), EPA (53mg), DHA (11mg) - higher than grain-fed"
- "Sodium: 315mg natural in beef + 2mg butter + 1400mg finishing salt = 1717mg total"
- "Chloride: 394mg from beef + 2135mg from salt = 2529mg total"
- "Fat profile: 45% saturated (ex-dairy + butter), 42% MUFA, 5% PUFA, trace trans (natural ruminant)"
- "Atwater validation: 4×136.5 + 9×134.7 + 4×0.3 + 2×0.1 + 2.4×0.0 = 1759 kcal (matches stored energy)"
- "Energy consistency principle: Energy equals Atwater(macros). Since macros are scaled from USDA 'cooked, grilled' values (which already account for fat dripping), no further adjustment is applied"
- "Excellent source of: Protein (80% daily target), zinc (29mg), selenium (147µg), B-vitamins (B3, B6, B12)"
- "USER ATE HALF: For logging purposes, scale all values by 0.5"
change_log:

  - timestamp: "2025-11-06T23:28:46+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.01 (animal)."
- timestamp: 2025-11-05T00:00:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "Initial comprehensive entry for Maset Cote de Boeuf with complete 52-field nutrition profile"
  fields_changed: ["all fields"]
  sources:
  - url: "https://www.maset.london/"
    note: "Maset restaurant website (French Mediterranean, Occitan cuisine, opened Oct 2025)"
  - url: "https://www.tesco.com/groceries/en-GB/products/322052405"
    note: "Tesco Cote de Boeuf 600-800g sharing steak (UK market standard)"
  - url: "https://thomasjosephbutchery.co.uk/blogs/blog/ex-dairy-beef-why-it-should-be-on-your-plate"
    note: "Ex-dairy beef characteristics: marbling, grass-fed, 12+ months retirement"
  - url: "https://fdc.nal.usda.gov/"
    note: "USDA FoodData Central: Beef ribeye macro/micronutrient profiles"
  - url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11397233/"
    note: "Nutrient Analysis of Raw and Cooked USDA Prime Beef Cuts (2024 study)"
  - url: "https://www.ars.usda.gov/ARSUserFiles/80400525/Data/retn/USDA_CookingYields_MeatPoultry.pdf"
    note: "USDA cooking yields: 25% loss for grilled ribeye"
  - url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8728510/"
    note: "Fatty acid composition of grass-fed beef: omega-3, omega-6 profiles"
  - url: "component_analysis"
    note: "700g raw beef (25% cooking loss) + 30g butter + 5g herbs + 3.5g finishing salt = 565g total dish"
- timestamp: 2025-11-06T00:00:00+00:00
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "Corrected energy calculation to match Atwater formula. Energy was 1,633 kcal but macros (136.5g P, 134.7g F, 0.3g C, 0.1g fiber) yield 1,759 kcal. Root cause: agent incorrectly applied additional 8% energy reduction for 'fat dripping' after using USDA cooked values - this is double-counting since USDA 'cooked, grilled' already measures meat after fat dripping. Established principle: energy must always equal Atwater(macros) for consistency."
  fields_changed: ["energy_kcal", "version", "last_verified"]
  sources: []
```
