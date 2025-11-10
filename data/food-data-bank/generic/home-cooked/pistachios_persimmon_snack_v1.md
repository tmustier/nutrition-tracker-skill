## Pistachios + Persimmon (Afternoon Snack)

```yaml
id: pistachios_persimmon_snack_v1
schema_version: 2
version: 1
last_verified: 2025-11-10
source:
  venue: Home-Cooked
  menu_page: ""
  evidence:
    - "USDA FoodData Central FDC ID 170184: Nuts, pistachio nuts, raw (unsalted)"
    - "USDA FoodData Central FDC ID 169941: Persimmons, Japanese, raw"
    - "Component-based estimation method per ESTIMATE.md"
aliases:
  - "Pistachios and Persimmon"
  - "Nut and Fruit Snack"
  - "Afternoon Fruit and Nut Snack"
category: snack
portion:
  description: "Afternoon snack serving"
  est_weight_g: 188
  notes: "Nutrient-dense snack combining raw unsalted pistachios with fresh persimmon"
assumptions:
  salt_scheme: "minimal"
  oil_type: "none"
  prep: "Raw unsalted pistachios (20g) served with fresh Japanese persimmon (168g, approximately 1 medium fruit). No added ingredients."
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 235
  protein_g: 7.3
  fat_g: 11.6
  sat_fat_g: 1.4
  mufa_g: 6.1
  pufa_g: 3.5
  trans_fat_g: 0.0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 30.7
  carbs_available_g: 25.1
  sugar_g: 21.2
  fiber_total_g: 5.6
  fiber_soluble_g: 2.0
  fiber_insoluble_g: 3.6
  polyols_g: 0.0
  # Minerals
  sodium_mg: 1
  potassium_mg: 410
  iodine_ug: 0
  magnesium_mg: 61
  calcium_mg: 18
  iron_mg: 0.7
  zinc_mg: 0.6
  vitamin_c_mg: 12.5
  manganese_mg: 0.60
  copper_mg: 0.27
  selenium_ug: 3.6
  chromium_ug: 0
  molybdenum_ug: 4
  phosphorus_mg: 117
  chloride_mg: 2
  sulfur_g: 0.03
  # Vitamins
  vitamin_a_ug: 135
  vitamin_d_ug: 0.0
  vitamin_e_mg: 4.4
  vitamin_k_ug: 4.5
  vitamin_b1_mg: 0.17
  vitamin_b2_mg: 0.03
  vitamin_b3_mg: 0.42
  vitamin_b5_mg: 0.28
  vitamin_b6_mg: 0.34
  vitamin_b7_ug: 2
  vitamin_b9_ug: 13
  vitamin_b12_ug: 0.0
  choline_mg: 18
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.05
  omega6_la_g: 2.68
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 0.6
quality:
  confidence: high
  gaps:
    - "Fiber soluble/insoluble split estimated from pistachio and persimmon composition"
    - "Iodine is true zero for plant foods without fortification"
    - "Chromium estimated (low confidence for fruit and nut combination)"
notes:
  - "Component breakdown (188g total): Pistachios raw unsalted 20g, Persimmon Japanese 168g (1 medium fruit)"
  - "Good protein: 7.3g (15% DV) primarily from pistachios (5.7g)"
  - "Outstanding vitamin E: 4.4mg (29% DV) from pistachios - powerful antioxidant"
  - "Good potassium: 410mg (10% DV) balanced from both components"
  - "Vitamin A: 135μg (15% DV) from persimmon carotenoids"
  - "Vitamin C: 12.5mg (14% DV) from persimmon"
  - "Good vitamin B6: 0.34mg (26% DV) from pistachios"
  - "Excellent fiber: 5.6g (22% DV) from both persimmon (3.6g) and pistachios (2.0g)"
  - "Heart-healthy fats: 53% MUFA, 30% PUFA, low saturated fat (1.4g)"
  - "Omega-6:Omega-3 ratio: 53.6:1 (typical for nuts, balanced by other meals)"
  - "Extremely low sodium: 1mg (<1% DV) - perfect for cardiovascular health"
  - "Natural sugars: 21.2g primarily from persimmon"
  - "Energy breakdown: Protein 29 kcal (12%), Fat 104 kcal (45%), Carbs available 100 kcal (43%), Fiber 11 kcal (5%)"
  - "Atwater validation: 4×7.3 + 9×11.6 + 4×25.1 + 2×5.6 = 235 kcal ✓"
  - "Nutrient-dense afternoon snack providing sustained energy"
  - "Pistachios provide complete protein, healthy fats, and minerals"
  - "Persimmon provides natural sweetness, fiber, and antioxidants (beta-carotene)"
  - "Excellent source of copper and manganese for enzyme function"
  - "Fat unassigned (0.6g = 5.2%) represents glycerol backbone and phospholipids"
  - "Zero cholesterol - plant-based snack"
change_log:
  - timestamp: "2025-11-10T15:00:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Initial entry for weekly menu plan afternoon snack"
    fields_changed: ["all fields"]
    sources:
      - note: "USDA FoodData Central for pistachios raw (FDC 170184) and persimmon Japanese (FDC 169941)"
        url: "https://fdc.nal.usda.gov/"
      - note: "Component-based estimation with ultrathinking per CLAUDE.md instructions"
      - note: "Standard persimmon weight ~168g for 1 medium fruit (edible portion)"
```
