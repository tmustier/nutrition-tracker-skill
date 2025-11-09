## Thick-Cut Frites (Maset)

```yaml
id: thick_cut_frites_maset_v1
version: 1
last_verified: 2025-11-05
source:
  venue: Maset, Marylebone (London)
  menu_page: "https://www.maset.london/"
  evidence:
  - "UK restaurant frites portion standards: 180-240g (McCain data, UK pubs)"
  - "French restaurant style: thick-cut frites (13mm width, Belgian/French standard)"
  - "Component analysis: 364g raw potato (45% water loss → 200g) + 20g absorbed oil (9.1% of final weight) + 1.1g finishing salt = 221g total"
  - "USDA FoodData Central FDC 170027: Russet potato nutrition (raw)"
  - "Thick-cut frites oil absorption: 8-12% (lower surface-area-to-volume ratio vs thin fries)"
  - "Standard frying oil absorption: 10-25%, thick-cut at lower end due to reduced surface area"
  - "Research: Oil uptake inversely related to fry thickness (Food Science literature)"
  - "French restaurant frying medium: vegetable/sunflower oil (standard commercial practice)"
aliases:
- "Frites"
- "French Fries"
- "Thick Cut Chips"
category: side
portion:
  description: "side portion (full serving)"
  est_weight_g: 220
  notes: "Thick-cut Belgian/French style frites (13mm width), double-fried for crispy exterior and fluffy interior, finished with sea salt"
assumptions:
  salt_scheme: "normal"
  oil_type: "vegetable/sunflower oil"
  prep: "364g raw russet potatoes, cut into 13mm thick batons, double-fried (160°C blanch, 180°C finish) resulting in 45% water loss → 200g dehydrated potato structure, absorbing 20g vegetable oil (9.1% of final weight, characteristic of thick-cut frites), finished with 1.1g sea salt (0.5% of dish weight)"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 465
  protein_g: 7.8
  fat_g: 20.3
  sat_fat_g: 2.3
  mufa_g: 5.0
  pufa_g: 12.7
  trans_fat_g: 0.02
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 65.8
  carbs_available_g: 61.1
  sugar_g: 3.0
  fiber_total_g: 4.7
  fiber_soluble_g: 0.6
  fiber_insoluble_g: 4.1
  polyols_g: 0.0
  # Minerals
  sodium_mg: 462
  potassium_mg: 1518
  iodine_ug: 3.6
  magnesium_mg: 84
  calcium_mg: 44
  iron_mg: 2.8
  zinc_mg: 1.1
  vitamin_c_mg: 33.1
  manganese_mg: 0.56
  copper_mg: 0.40
  selenium_ug: 1.1
  chromium_ug: 3.6
  molybdenum_ug: 14.6
  phosphorus_mg: 207
  chloride_mg: 711.0
  sulfur_g: 0.031
  # Vitamins
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 9.0
  vitamin_k_ug: 8.6
  vitamin_b1_mg: 0.29
  vitamin_b2_mg: 0.12
  vitamin_b3_mg: 3.88
  vitamin_b5_mg: 1.07
  vitamin_b6_mg: 1.09
  vitamin_b7_ug: 0.7
  vitamin_b9_ug: 58
  vitamin_b12_ug: 0
  choline_mg: 44.0
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.04
  omega6_la_g: 12.7
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
  - "Portion weight estimated from UK restaurant standards (180-240g range)"
  - "Oil absorption rate (9.1%) based on thick-cut research literature (8-12% range)"
  - "Frying oil type assumed as vegetable/sunflower blend (standard French restaurant practice)"
  - "Confidence: HIGH for macros (±10%), MEDIUM for major minerals/vitamins (±20%), LOW for ultra-trace elements"
notes:
- "Thick-cut frites: 13mm width typical for French/Belgian style (vs 6-9mm for thin fries)"
- "Surface area to volume ratio determines oil absorption: thick-cut frites absorb ~40% LESS oil than thin fries"
- "Component breakdown: 364g raw potato → 200g after 45% water loss during frying + 20g absorbed oil + 1.1g salt = 221g"
- "Double-frying technique: 160°C blanch (gelatinizes starch, creates structure) + 180°C finish (crispy exterior)"
- "Oil absorption occurs during cooling phase as steam escapes and creates micro-voids that draw in oil"
- "Vitamin C retention: ~33mg (from 33.1mg in raw potatoes). Heat-sensitive but partially preserved in rapid high-temp frying"
- "Vitamin E: 9.0mg primarily from absorbed vegetable oil (sunflower oil contains 45-90mg/100g)"
- "Potassium: 1,518mg excellent source (32% of 4,700mg daily target)"
- "Vitamin B6: 1.09mg (potato is naturally rich source, ~77% of 1.4mg daily target)"
- "Omega-6 to Omega-3 ratio: 318:1 (high due to vegetable oil; 12.7g LA vs 0.04g ALA)"
- "Fiber: 4.7g includes resistant starch formed during cooling after first fry"
- "Carbs available: 61.1g (carbs_total 65.8g - fiber 4.7g = 61.1g)"
- "Salt: 1.16g finishing salt (= 462mg sodium × 2.5 / 1000)"
- "Chloride: 864mg (196mg from potato + 668mg from 1.1g salt)"
- "Zero cholesterol (plant-based), zero B12 (plant-based), zero vitamin A (white potato)"
- "Atwater validation: 4×7.8 + 9×20.3 + 4×61.1 + 2×4.7 + 2.4×0 = 468 kcal (±0.6% vs 465 kcal stated)"
- "USER ATE 2/3 PORTION: For logging, scale all values by 0.667 (e.g., 465 kcal × 0.667 = 310 kcal)"
change_log:

  - timestamp: "2025-11-06T23:28:46+00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × 0.004 (plant)."
  - timestamp: 2025-11-05T21:55:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial comprehensive entry for Maset thick-cut frites with complete 52-field nutrition profile using component-based estimation"
    fields_changed: ["all fields"]
    sources:
    - url: "https://www.maset.london/"
    note: "Maset restaurant website (French Mediterranean, Marylebone)"
  - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/170027/nutrients"
    note: "USDA FDC 170027: Russet potato, raw, flesh and skin (complete micronutrient profile)"
  - url: "https://www.researchgate.net/publication/264512271_Structural_changes_and_shrinkage_of_potato_during_frying"
    note: "Potato water loss during frying: 39-45% weight loss"
  - url: "https://www.sciencedirect.com/science/article/abs/pii/S0963996923014540"
    note: "Oil absorption in French fries by surface profiles: thickness affects uptake"
  - url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9655203/"
    note: "Heat transfer and water evaporation in French fries: oil uptake analysis"
  - url: "https://www.zavamed.com/uk/portion-size-compared.html"
    note: "UK pub frites portions: 180-240g per serving (McCain data)"
  - url: "https://recipesformen.com/frites-belges/"
    note: "Belgian frites thickness standards: 10-13mm width"
  - url: "component_analysis"
    note: "364g raw potato (45% loss) + 20g vegetable oil (9.1% absorption) + 1.1g salt = 221g total"
```
