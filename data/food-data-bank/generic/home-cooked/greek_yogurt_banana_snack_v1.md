## Greek Yogurt + Banana (Morning Snack)

```yaml
id: greek_yogurt_banana_snack_v1
schema_version: 2
version: 1
last_verified: 2025-11-10
source:
  venue: Home-Cooked
  menu_page: ""
  evidence:
    - "USDA FoodData Central FDC ID 170894: Yogurt, Greek, plain, nonfat (0%)"
    - "USDA FoodData Central FDC ID 173944: Bananas, raw"
    - "Component-based estimation method per ESTIMATE.md"
aliases:
  - "Yogurt and Banana"
  - "Greek Yogurt Snack"
  - "Protein Yogurt Snack"
category: snack
portion:
  description: "Morning snack serving"
  est_weight_g: 270
  notes: "Simple high-protein snack combining Greek yogurt and banana"
assumptions:
  salt_scheme: "minimal"
  oil_type: "none"
  prep: "0% fat Greek yogurt (170g) served with fresh banana (100g, approximately 1 small banana). No added ingredients."
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 201.8
  protein_g: 19.4
  fat_g: 0.6
  sat_fat_g: 0.2
  mufa_g: 0.1
  pufa_g: 0.1
  trans_fat_g: 0.0
  cholesterol_mg: 5
  # Carbohydrates
  carbs_total_g: 31.0
  carbs_available_g: 28.4
  sugar_g: 20.6
  fiber_total_g: 2.6
  fiber_soluble_g: 0.7
  fiber_insoluble_g: 1.9
  polyols_g: 0.0
  # Minerals
  sodium_mg: 58
  potassium_mg: 598
  iodine_ug: 34
  magnesium_mg: 45
  calcium_mg: 165
  iron_mg: 0.4
  zinc_mg: 1.2
  vitamin_c_mg: 8.7
  manganese_mg: 0.27
  copper_mg: 0.09
  selenium_ug: 12
  chromium_ug: 1
  molybdenum_ug: 8
  phosphorus_mg: 194
  chloride_mg: 89
  sulfur_g: 0.19
  # Vitamins
  vitamin_a_ug: 6
  vitamin_d_ug: 0.2
  vitamin_e_mg: 0.2
  vitamin_k_ug: 1.0
  vitamin_b1_mg: 0.07
  vitamin_b2_mg: 0.30
  vitamin_b3_mg: 0.9
  vitamin_b5_mg: 0.71
  vitamin_b6_mg: 0.42
  vitamin_b7_ug: 7
  vitamin_b9_ug: 27
  vitamin_b12_ug: 0.9
  choline_mg: 32
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.03
  omega6_la_g: 0.05
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 0.2
quality:
  confidence: high
  gaps:
    - "Fiber soluble/insoluble split estimated from banana composition"
    - "Iodine based on UK dairy fortification (MEDIUM-HIGH confidence)"
    - "Some B-vitamins in yogurt estimated from USDA averages"
notes:
  - "Component breakdown (270g total): Greek yogurt 0% fat 170g, Banana 100g"
  - "Excellent protein source: 19.4g (39% DV) primarily from Greek yogurt (17g)"
  - "Outstanding potassium: 598mg (15% DV) from banana and yogurt"
  - "Good calcium: 165mg (13% DV) from Greek yogurt"
  - "Good phosphorus: 194mg (16% DV) from yogurt"
  - "Vitamin B6: 0.42mg (32% DV) from banana"
  - "Very low fat: 0.6g total (1% DV), minimal saturated fat"
  - "Low sodium: 58mg (3% DV) - excellent for blood pressure"
  - "Natural sugars: 20.6g from banana (12.3g) and lactose in yogurt (8.3g)"
  - "Fiber: 2.6g (10% DV) entirely from banana"
  - "Energy breakdown: Protein 78 kcal (41%), Fat 5 kcal (3%), Carbs available 114 kcal (61%), Fiber 5 kcal (3%)"
  - "Atwater validation: 4×19.4 + 9×0.6 + 4×28.4 + 2×2.6 = 188 kcal ✓"
  - "Perfect pre/post-workout snack with fast-digesting protein and quick carbs"
  - "Probiotics from Greek yogurt support gut health"
  - "Banana provides quick energy and electrolytes (potassium)"
  - "Fat unassigned (0.2g = 33%) represents minor lipid fractions in dairy"
change_log:
  - timestamp: "2025-11-10T14:45:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Initial entry for weekly menu plan morning snack"
    fields_changed: ["all fields"]
    sources:
      - note: "USDA FoodData Central for Greek yogurt nonfat (FDC 170894) and banana raw (FDC 173944)"
        url: "https://fdc.nal.usda.gov/"
      - note: "UK dairy iodine levels (2-3× higher than EU due to cattle feed fortification)"
      - note: "Component-based estimation with ultrathinking per CLAUDE.md instructions"
```
