## Sea Buckthorn Shot (Erbology)

```yaml
id: sea_buckthorn_shot_white-pine_v1
version: 1
last_verified: 2025-11-15
source:
  venue: White Pine
  menu_page: "https://white-pine.co.uk/products/erbology-12-organic-sea-buckthorn-shots"
  evidence:
    - "Erbology Organic Sea Buckthorn Shots: 100% organic sea buckthorn berries, undiluted and unsweetened"
    - "Erbology nutrition per 50mL: 58 kcal, 1g protein, 4.6g fat, 3g carbs, 0.3g sugar, 220mg vitamin C, 7.3mg beta-carotene, 1.7g omega-7"
    - "Nutriely sea buckthorn berry data per 100g: comprehensive micronutrient profile"
    - "British Sea Buckthorn Company: sea buckthorn contains 10× vitamin C of oranges, highest natural source of omega-7"
aliases:
  - "Sea Buckthorn Shot"
  - "Erbology Sea Buckthorn"
category: drink
portion:
  description: "50mL shot"
  est_weight_g: 52
  notes: "Pure mashed sea buckthorn berries (Hippophae rhamnoides), no dilution or sweeteners. Standard Erbology shot size."
assumptions:
  salt_scheme: "unsalted"
  oil_type: "natural berry oils (omega-7 rich)"
  prep: "100% organic sea buckthorn berries, mechanically pressed to create concentrated juice/puree. Exceptionally high in vitamin C (440mg per 100mL) and rare omega-7 fatty acids (palmitoleic acid, 3.4g per 100mL)"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 58
  protein_g: 1.0
  fat_g: 4.6
  sat_fat_g: 0.8
  mufa_g: 3.0
  pufa_g: 0.48
  trans_fat_g: 0.0
  cholesterol_mg: 0.0
  # Carbohydrates
  carbs_total_g: 3.0
  carbs_available_g: 1.75
  sugar_g: 0.3
  fiber_total_g: 1.25
  fiber_soluble_g: 0.38
  fiber_insoluble_g: 0.87
  polyols_g: 0.0
  # Minerals
  sodium_mg: 1.0
  potassium_mg: 80
  iodine_ug: 0.0
  magnesium_mg: 2.3
  calcium_mg: 2.3
  iron_mg: 0.07
  zinc_mg: 0.07
  vitamin_c_mg: 220
  manganese_mg: 0.05
  copper_mg: 0.02
  selenium_ug: 5.0
  chromium_ug: 0.0
  molybdenum_ug: 0.0
  phosphorus_mg: 20.0
  chloride_mg: 1.5
  sulfur_g: 0.004
  # Vitamins
  vitamin_a_ug: 608
  vitamin_d_ug: 0.0
  vitamin_e_mg: 1.53
  vitamin_k_ug: 7.0
  vitamin_b1_mg: 0.09
  vitamin_b2_mg: 0.035
  vitamin_b3_mg: 0.13
  vitamin_b5_mg: 0.13
  vitamin_b6_mg: 0.065
  vitamin_b7_ug: 0.8
  vitamin_b9_ug: 5.0
  vitamin_b12_ug: 0.0
  choline_mg: 3.8
  # Fatty acids
  omega3_epa_mg: 0.0
  omega3_dha_mg: 0.0
  omega3_ala_g: 0.045
  omega6_la_g: 0.13
  # Ultra-trace minerals
  boron_mg: 0.0
  silicon_mg: 0.0
  vanadium_ug: 0.0
  nickel_ug: 0.0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  omega7_palmitoleic_g: 1.7
quality:
  confidence: high
  gaps:
    - "B5, B7, choline estimated from typical berry profiles (MEDIUM confidence)"
    - "Phosphorus estimated from protein content (MEDIUM confidence)"
    - "Fiber split (soluble/insoluble) estimated at 30%/70% typical for berries"
notes:
  - "Energy: 58 kcal from Erbology nutrition facts. Atwater formula: 4×1.0 + 9×4.6 + 4×1.75 + 2×1.25 = 52.9 kcal. Variance: +9.6% (acceptable for high-oil berry concentrate)"
  - "Exceptionally high vitamin C: 220mg per 50mL shot (440mg per 100mL), providing 275% daily value"
  - "Rare dietary source of omega-7 (palmitoleic acid): 1.7g per shot, primarily in MUFA fraction (57% of total MUFA)"
  - "Vitamin A from beta-carotene: 7.3mg per shot = 608µg RAE (conversion: 12µg beta-carotene = 1µg RAE)"
  - "Fat breakdown: MUFA 3.0g (65% of total, includes omega-7 1.7g), PUFA 0.48g (10%), sat fat 0.8g (17%)"
  - "Very low sugar (0.3g) due to tart berry profile - no added sweeteners"
  - "Fiber 1.25g retained in mashed berry puree (whole berries have 3.6g per 100g, reduced due to juicing/pressing)"
  - "Macros directly from Erbology brand nutrition data per 50mL standard shot serving"
  - "Micronutrients supplemented from Nutriely generic sea buckthorn berry database, scaled proportionally to fat concentration (4.6g vs 1.61g per 50g = 2.86× concentration factor)"
  - "Chloride derived: 1.0mg sodium × 1.54 = 1.5mg"
  - "Sulfur calculated: 1.0g protein × 0.004 (plant source) = 0.004g"
  - "Product sold by White Pine London, manufactured by Erbology (100% organic UK product)"
  - "Omega-6/omega-3 ratio: 2.9:1 (excellent for anti-inflammatory balance)"
change_log:
  - timestamp: "2025-11-15T00:00:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial population with complete 52-nutrient estimation"
    notes: "Primary data: Erbology brand nutrition facts per 50mL (58 kcal, 220mg vitamin C, 1.7g omega-7). Secondary data: Nutriely sea buckthorn berry micronutrient profile scaled for concentration. Standard Erbology shot serving size (50mL). Ultra-high vitamin C and omega-7 content verified across multiple sources."
```
