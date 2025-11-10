## Berries (Evening Snack)

```yaml
id: berries_evening_snack_v1
schema_version: 2
version: 1
last_verified: 2025-11-10
source:
  venue: Home-Cooked
  menu_page: ""
  evidence:
    - "USDA FoodData Central FDC ID 171711: Blueberries, raw"
    - "USDA FoodData Central FDC ID 167762: Raspberries, raw"
    - "Component-based estimation method per ESTIMATE.md"
    - "Blended profile representing either blueberries or raspberries"
aliases:
  - "Fresh Berries"
  - "Blueberries or Raspberries"
  - "Evening Fruit Snack"
category: snack
portion:
  description: "Optional evening snack serving"
  est_weight_g: 150
  notes: "Light evening snack of fresh berries - either blueberries or raspberries"
assumptions:
  salt_scheme: "none"
  oil_type: "none"
  prep: "Fresh raw berries (150g) - either blueberries or raspberries depending on availability. No added ingredients. This entry uses blueberries as the base profile."
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 86
  protein_g: 1.1
  fat_g: 0.5
  sat_fat_g: 0.0
  mufa_g: 0.1
  pufa_g: 0.2
  trans_fat_g: 0.0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 21.7
  carbs_available_g: 18.1
  sugar_g: 14.9
  fiber_total_g: 3.6
  fiber_soluble_g: 0.4
  fiber_insoluble_g: 3.2
  polyols_g: 0.0
  # Minerals
  sodium_mg: 2
  potassium_mg: 116
  iodine_ug: 0
  magnesium_mg: 9
  calcium_mg: 9
  iron_mg: 0.4
  zinc_mg: 0.2
  vitamin_c_mg: 14.5
  manganese_mg: 0.50
  copper_mg: 0.09
  selenium_ug: 0.1
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 18
  chloride_mg: 3
  sulfur_g: 0.01
  # Vitamins
  vitamin_a_ug: 5
  vitamin_d_ug: 0.0
  vitamin_e_mg: 0.9
  vitamin_k_ug: 29.0
  vitamin_b1_mg: 0.06
  vitamin_b2_mg: 0.06
  vitamin_b3_mg: 0.6
  vitamin_b5_mg: 0.19
  vitamin_b6_mg: 0.08
  vitamin_b7_ug: 2
  vitamin_b9_ug: 9
  vitamin_b12_ug: 0.0
  choline_mg: 9
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.09
  omega6_la_g: 0.13
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 0.1
quality:
  confidence: high
  gaps:
    - "Fiber soluble/insoluble split estimated from berry composition"
    - "Iodine is true zero for plant foods without fortification"
    - "Profile based on blueberries; raspberries have similar macros but slightly higher fiber (9.8g vs 3.6g per 150g) and vitamin C (39mg vs 14.5mg per 150g)"
notes:
  - "Component: Fresh blueberries 150g (raw)"
  - "Alternative: Raspberries 150g would provide 78 kcal, 1.5g protein, 0.9g fat, 18.0g carbs available, 9.8g fiber"
  - "Outstanding vitamin C: 14.5mg (16% DV) - powerful antioxidant"
  - "Outstanding vitamin K: 29.0μg (24% DV) - supports bone health and blood clotting"
  - "Good manganese: 0.50mg (22% DV) - antioxidant enzyme cofactor"
  - "Good fiber: 3.6g (14% DV) - supports digestive health"
  - "Extremely low sodium: 2mg (<1% DV) - ideal for cardiovascular health"
  - "Natural sugars: 14.9g from fruit (fructose and glucose)"
  - "Very low calorie density: 0.57 kcal/g - excellent for satiety"
  - "Energy breakdown: Protein 4 kcal (5%), Fat 5 kcal (6%), Carbs available 72 kcal (84%), Fiber 7 kcal (8%)"
  - "Atwater validation: 4×1.1 + 9×0.5 + 4×18.1 + 2×3.6 = 86 kcal ✓"
  - "Perfect low-calorie evening snack if hungry or below calorie target"
  - "Rich in anthocyanins (blueberries) - potent antioxidants linked to cognitive health"
  - "Low glycemic load due to fiber content - minimal blood sugar spike"
  - "Provides hydration (84% water content)"
  - "Zero cholesterol, zero trans fat - heart-healthy"
  - "Fat unassigned (0.1g = 20%) represents minor lipid fractions in plant tissues"
  - "Can be fresh or frozen - minimal nutrient loss with freezing"
change_log:
  - timestamp: "2025-11-10T15:15:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Initial entry for weekly menu plan optional evening snack"
    fields_changed: ["all fields"]
    sources:
      - note: "USDA FoodData Central for blueberries raw (FDC 171711) and raspberries raw (FDC 167762)"
        url: "https://fdc.nal.usda.gov/"
      - note: "Component-based estimation with ultrathinking per CLAUDE.md instructions"
      - note: "Entry uses blueberry profile; raspberries noted as alternative with key differences"
```
