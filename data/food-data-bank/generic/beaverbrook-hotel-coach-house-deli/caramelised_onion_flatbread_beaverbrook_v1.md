## Caramelised Onion Flatbread (Beaverbrook)

```yaml
id: caramelised_onion_flatbread_beaverbrook_v1
version: 1
last_verified: 2025-11-15
source:
  venue: Beaverbrook Hotel - Coach House Deli
  menu_page: "https://www.beaverbrook.co.uk/"
  evidence:
    - "Component-based estimation using USDA FoodData Central"
    - "Full flatbread portion: 368g total weight"
    - "Components: stone-baked flatbread base (140g), caramelised onions (45g), Rosary ash goat's cheese (60g), fresh figs (100g/2 figs), wild rocket (15g), olive oil (8g)"
    - "USDA sources: Flatbread/naan, onions cooked, soft goat cheese, fresh figs, arugula, olive oil"
aliases:
  - "Goat Cheese Flatbread"
  - "Fig and Onion Flatbread"
category: main
portion:
  description: "flatbread"
  est_weight_g: 368
  notes: "Stone-fired artisan flatbread with caramelised onions, Rosary ash goat's cheese, fresh figs, and wild rocket. Served at Beaverbrook Hotel Coach House Deli."
assumptions:
  salt_scheme: "normal"
  oil_type: "olive oil, butter"
  prep: "Stone-oven flatbread base topped with butter-caramelised onions, soft Rosary ash goat's cheese (UK artisan with edible ash coating), sliced fresh figs, wild rocket garnish, olive oil drizzle. Components: 140g flatbread, 45g caramelised onions (from ~135g raw), 60g goat cheese, 100g figs, 15g rocket, 8g olive oil."
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 736
  protein_g: 25.8
  fat_g: 31.4
  sat_fat_g: 11.2
  mufa_g: 14.8
  pufa_g: 3.9
  trans_fat_g: 0.1
  cholesterol_mg: 42
  # Carbohydrates
  carbs_total_g: 89.6
  carbs_available_g: 82.4
  sugar_g: 22.8
  fiber_total_g: 7.2
  fiber_soluble_g: 2.1
  fiber_insoluble_g: 5.1
  polyols_g: 0.0
  # Minerals
  sodium_mg: 548
  potassium_mg: 618
  iodine_ug: 12
  magnesium_mg: 64
  calcium_mg: 228
  iron_mg: 4.2
  zinc_mg: 2.8
  vitamin_c_mg: 8.4
  manganese_mg: 0.68
  copper_mg: 0.32
  selenium_ug: 18.6
  chromium_ug: 12
  molybdenum_ug: 14
  phosphorus_mg: 324
  chloride_mg: 844
  sulfur_g: 0.36
  # Vitamins
  vitamin_a_ug: 168
  vitamin_d_ug: 1.2
  vitamin_e_mg: 2.8
  vitamin_k_ug: 42
  vitamin_b1_mg: 0.38
  vitamin_b2_mg: 0.44
  vitamin_b3_mg: 3.8
  vitamin_b5_mg: 1.12
  vitamin_b6_mg: 0.26
  vitamin_b7_ug: 4.2
  vitamin_b9_ug: 78
  vitamin_b12_ug: 0.12
  choline_mg: 38
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.18
  omega6_la_g: 3.6
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium-high
  gaps:
    - "Portion size estimated from upscale hotel deli standards (MEDIUM confidence)"
    - "B7 (biotin) estimated from component averages (MEDIUM confidence)"
    - "Rosary ash goat cheese nutrients estimated from soft fresh goat cheese USDA profile"
notes:
  - "Energy: 736 kcal. Atwater validation: 4×25.8 + 9×31.4 + 4×82.4 + 2×7.2 = 729.8 kcal (±0.8%)"
  - "Component breakdown: 140g stone-baked flatbread, 45g caramelised onions (from 135g raw with 67% reduction), 60g Rosary ash goat's cheese, 100g fresh figs (2 medium), 15g wild rocket, 8g olive oil drizzle"
  - "Fat breakdown: 36% saturated (goat cheese, butter in onions), 47% MUFA (olive oil), 12% PUFA (olive oil, seeds in figs)"
  - "High calcium 228mg from goat cheese (soft fresh cheese is calcium-rich)"
  - "Good fiber 7.2g from flatbread (whole grain), figs (high fiber fruit), and rocket"
  - "Sugar 22.8g: natural from figs (16g), caramelised onions (5g), flatbread (2g)"
  - "Vitamin K 42µg from rocket/arugula (excellent source of vitamin K)"
  - "Folate 78µg from figs, rocket, and fortified flatbread"
  - "Iron 4.2mg from flatbread (fortified flour) and figs"
  - "Chloride derived: 548mg sodium × 1.54 = 844mg"
  - "Sulfur calculated: 25.8g protein × 0.014 (mixed animal/plant) = 0.36g"
  - "Omega-6/omega-3 ratio: 20:1 (from olive oil and seed oils)"
  - "Rosary ash goat's cheese: UK artisan soft fresh cheese with edible vegetable ash coating (decorative and traditional preservation method)"
change_log:
  - timestamp: "2025-11-15T00:00:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial population with complete 52-nutrient estimation"
    notes: "Component-based analysis using USDA FoodData Central. Components: flatbread (stone-baked artisan), caramelised onions, Rosary ash goat cheese, fresh figs, wild rocket, olive oil. Portion estimated at 368g for upscale venue individual flatbread. All micronutrients scaled from USDA per-100g values. Confidence: MEDIUM-HIGH (±15-20%)."
```
