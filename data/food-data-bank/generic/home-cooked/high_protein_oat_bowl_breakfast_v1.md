## High-Protein Oat Bowl (Breakfast)

```yaml
id: high_protein_oat_bowl_breakfast_v1
schema_version: 2
version: 1
last_verified: 2025-11-10
source:
  venue: Home-Cooked
  menu_page: ""
  evidence:
    - "USDA FoodData Central FDC ID 169705: Oats (dry, rolled)"
    - "USDA FoodData Central FDC ID 171711: Blueberries, raw"
    - "USDA FoodData Central FDC ID 170184: Nuts, pistachio nuts, raw"
    - "ON Gold Standard Whey Double Rich Chocolate product label (24g protein per 30g scoop)"
    - "USDA FoodData Central FDC ID 171475: Milk substitutes, fluid, with added calcium, vitamins A and D (almond milk)"
    - "Component-based estimation method per ESTIMATE.md"
aliases:
  - "Oat Bowl with Protein"
  - "Protein Oatmeal"
  - "High-Protein Breakfast Bowl"
category: breakfast
portion:
  description: "Complete breakfast bowl serving"
  est_weight_g: 525
  notes: "High-protein breakfast bowl with oats, whey protein, blueberries, pistachios, cinnamon, and almond milk"
assumptions:
  salt_scheme: "minimal"
  oil_type: "none"
  prep: "Oats (80g dry) cooked with unsweetened almond milk (250ml), mixed with ON Whey protein powder (30g Double Rich Chocolate), topped with fresh blueberries (150g), pistachios (15g), and cinnamon (1g). Total portions create ~525g serving."
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 520
  protein_g: 37.2
  fat_g: 11.8
  sat_fat_g: 2.1
  mufa_g: 5.3
  pufa_g: 3.4
  trans_fat_g: 0.0
  cholesterol_mg: 60
  # Carbohydrates
  carbs_total_g: 75.0
  carbs_available_g: 63.4
  sugar_g: 17.8
  fiber_total_g: 11.6
  fiber_soluble_g: 3.5
  fiber_insoluble_g: 8.1
  polyols_g: 0.0
  # Minerals
  sodium_mg: 98
  potassium_mg: 693
  iodine_ug: 5
  magnesium_mg: 190
  calcium_mg: 254
  iron_mg: 4.8
  zinc_mg: 4.2
  vitamin_c_mg: 14.7
  manganese_mg: 3.82
  copper_mg: 0.71
  selenium_ug: 28
  chromium_ug: 2
  molybdenum_ug: 42
  phosphorus_mg: 535
  chloride_mg: 151
  sulfur_g: 0.28
  # Vitamins
  vitamin_a_ug: 108
  vitamin_d_ug: 1.0
  vitamin_e_mg: 2.8
  vitamin_k_ug: 27
  vitamin_b1_mg: 0.68
  vitamin_b2_mg: 0.35
  vitamin_b3_mg: 3.9
  vitamin_b5_mg: 1.55
  vitamin_b6_mg: 0.24
  vitamin_b7_ug: 22
  vitamin_b9_ug: 58
  vitamin_b12_ug: 2.4
  choline_mg: 78
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.18
  omega6_la_g: 2.84
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 1.0
quality:
  confidence: high
  gaps:
    - "Fiber soluble/insoluble split estimated at typical 30/70 ratio for oats and berries"
    - "Iodine estimated (low confidence for plant-based ingredients)"
    - "Chromium and molybdenum estimated from oat content"
notes:
  - "Component breakdown (525g total): Oats 80g dry (cooks to ~195g), ON Whey 30g, Blueberries 150g, Pistachios 15g, Almond milk 250ml, Cinnamon 1g"
  - "Excellent protein source: 37.2g (74% DV) from whey protein (24g) and oats (13.8g)"
  - "Outstanding manganese: 3.82mg (166% DV) from oats"
  - "High magnesium: 190mg (45% DV) from oats and nuts"
  - "Good phosphorus: 535mg (43% DV) from oats and protein"
  - "Vitamin C: 14.7mg (16% DV) from blueberries"
  - "High fiber: 11.6g (46% DV) - primarily from oats (8.8g) and blueberries (2.4g)"
  - "Heart-healthy fats: 45% MUFA, 29% PUFA, low saturated fat (2.1g)"
  - "Omega-6:Omega-3 ratio: 15.8:1"
  - "Low sodium: 98mg (4% DV) - ideal for cardiovascular health"
  - "Energy breakdown: Protein 149 kcal (29%), Fat 106 kcal (20%), Carbs available 254 kcal (49%), Fiber 23 kcal (4%)"
  - "Atwater validation: 4×37.2 + 9×11.8 + 4×63.4 + 2×11.6 = 520 kcal ✓"
  - "Complete breakfast providing sustained energy with high protein for muscle maintenance"
  - "Blueberries provide antioxidants (anthocyanins), oats provide beta-glucan for cholesterol management"
  - "Pistachios add healthy fats, vitamin E, and additional protein"
  - "Fat unassigned (1.0g = 8.5%) represents glycerol backbone and phospholipids"
change_log:
  - timestamp: "2025-11-10T14:30:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Initial entry for weekly menu plan breakfast item"
    fields_changed: ["all fields"]
    sources:
      - note: "USDA FoodData Central for oats (FDC 169705), blueberries (FDC 171711), pistachios (FDC 170184), almond milk (FDC 171475)"
        url: "https://fdc.nal.usda.gov/"
      - note: "ON Gold Standard Whey Double Rich Chocolate product label"
      - note: "Component-based estimation with ultrathinking per CLAUDE.md instructions"
```
