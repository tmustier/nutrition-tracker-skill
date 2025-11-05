## Chavroux Mild & Creamy Goat's Cheese (12g slice)

```yaml
id: chavroux_mild_creamy_goat_cheese_12g_chavroux_v1
version: 1
schema_version: 2
last_verified: 2025-11-05
source:
  venue: Chavroux (Packaged Product)
  menu_page: ""
  evidence:
    - "French nutrition data: Chavroux fromage de chèvre frais 12% MG: 153 kcal, 12g fat (9g saturated), 8.7g protein, 2.5g carbs, 1g salt per 100g"
    - "Source: https://www.fatsecret.fr/calories-nutrition/chavroux/fromage-de-ch%C3%A8vre/100g"
    - "UK retailer data: Tesco Chavroux Goat's Cheese Log 150G (product 260644617)"
    - "Open Food Facts: Chavroux product entries (barcode 3272770083249)"
    - "Micronutrients from USDA FoodData Central soft goat cheese (FDC 173435) scaled for fresh 12% fat variety"
    - "Calcium, iron, magnesium from goat cheese standard values: 298mg Ca, 1.6mg Fe, 29mg Mg per 100g"
    - "UK dairy iodine content estimated at ~15µg/100g for goat cheese (UK cattle feed fortification)"
    - "Fat breakdown based on typical goat cheese fatty acid profile"
aliases: []
category: ingredient
portion:
  description: "1 slice (12g)"
  est_weight_g: 12
  notes: "Mild & creamy French goat's cheese, 12% fat. User consumed 2 slices = 24g total"
assumptions:
  salt_scheme: "packaged"
  oil_type: ""
  prep: "Fresh soft goat cheese, pasteurised goat's milk"
  nutrient_enrichment: "17 priority nutrients sourced from USDA FoodData Central (FDC ID 173435: Cheese, goat, soft type) and scaled from per-100g to 12g portion. UK dairy iodine content estimated higher than US due to UK cattle feed fortification practices (approximately 2.5x US values for dairy products)."
per_portion:
  energy_kcal: 18
  protein_g: 1.0
  fat_g: 1.4
  sat_fat_g: 1.1
  mufa_g: 0.2
  pufa_g: 0.1
  trans_fat_g: 0.0
  cholesterol_mg: 6
  carbs_total_g: 0.3
  carbs_available_g: 0.3
  sugar_g: 0.3
  fiber_total_g: 0.0
  fiber_soluble_g: 0.0
  fiber_insoluble_g: 0.0
  polyols_g: 0.0
  sodium_mg: 48
  potassium_mg: 19
  iodine_ug: 1.8
  magnesium_mg: 3
  calcium_mg: 36
  iron_mg: 0.2
  zinc_mg: 0.1
  vitamin_c_mg: 0.0
  manganese_mg: 0.01
  copper_mg: 0.09
  selenium_ug: 0.3
  vitamin_d_ug: 0.05
  vitamin_e_mg: 0.02
  omega3_ala_g: 0.01
  omega3_dha_mg: 0
  omega3_epa_mg: 0
  omega6_la_g: 0.04
  chloride_mg: 0
  phosphorus_mg: 31
  sulfur_g: 0
  chromium_ug: 0
  molybdenum_ug: 0
  boron_mg: 0
  nickel_ug: 0
  silicon_mg: 0
  vanadium_ug: 0
  vitamin_a_ug: 35
  vitamin_k_ug: 0.2
  choline_mg: 1.8
  vitamin_b1_mg: 0.01
  vitamin_b2_mg: 0.05
  vitamin_b3_mg: 0.05
  vitamin_b5_mg: 0.08
  vitamin_b6_mg: 0.03
  vitamin_b7_ug: 0
  vitamin_b9_ug: 1.4
  vitamin_b12_ug: 0.02
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps:
    - "MUFA/PUFA split estimated from typical goat cheese fatty acid profile"
    - "Some trace micronutrients estimated from USDA soft goat cheese data"
  estimated_nutrients:
    - name: "mufa_g"
      value: 0.2
      confidence: "medium"
      method: "Total unsaturated fat (0.36g) split based on typical goat cheese profile: ~67% MUFA, ~14% PUFA from goat milk fat composition"
    - name: "pufa_g"
      value: 0.1
      confidence: "medium"
      method: "Total unsaturated fat (0.36g) split based on typical goat cheese profile: ~67% MUFA, ~14% PUFA from goat milk fat composition"
    - name: "cholesterol_mg"
      value: 6
      confidence: "medium"
      method: "Estimated from typical soft goat cheese cholesterol content ~50mg/100g scaled to 12g portion"
    - name: "iodine_ug"
      value: 2
      confidence: "medium"
      method: "UK goat cheese iodine content ~15µg/100g based on UK dairy fortification practices, scaled to 12g portion"
    - name: "vitamin_d_ug"
      value: 0.1
      confidence: "medium"
      method: "USDA soft goat cheese vitamin D ~0.5µg/100g scaled to 12g portion"
notes:
  - "Chavroux is a premium French goat cheese brand (Ile de France Cheese company), widely available in UK supermarkets"
  - "The 'Mild & Creamy' variety is the fresh, pyramid/log format with 12% fat content, lower than aged varieties"
  - "Scaled from per 100g values: 153 kcal, 8.7g protein, 12g fat (9g saturated), 2.5g carbs, 1g salt"
  - "UK labels show available carbohydrates; all carbs in this cheese are available (no fiber in dairy)"
  - "Atwater validation: 4×1.0 + 9×1.4 + 4×0.3 = 4.0 + 12.6 + 1.2 = 17.8 kcal (within 1% of stated 18 kcal)"
  - "Rich in calcium (36mg per slice), providing ~4% of daily calcium needs per 12g slice"
  - "Good source of complete protein with all essential amino acids from goat's milk"
  - "Goat cheese is naturally lower in lactose than cow's cheese and may be better tolerated by some individuals"
change_log:
  - timestamp: "2025-11-05T10:30:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Initial entry - comprehensive research from French nutrition data, UK retailers, and USDA micronutrient profiles"
    fields_changed:
      - "all fields"
    evidence:
      - url: "https://www.fatsecret.fr/calories-nutrition/chavroux/fromage-de-ch%C3%A8vre/100g"
        note: "Primary source for Chavroux 12% fat macronutrients per 100g"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/173435/nutrients"
        note: "USDA FoodData Central - Cheese, goat, soft type for micronutrient profiles"
      - url: "https://www.tesco.com/groceries/en-GB/products/260644617"
        note: "UK retailer verification - Chavroux Goat's Cheese Log available at Tesco"
  - timestamp: "2025-11-05T15:45:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Enriched with 17 priority nutrients from USDA FoodData Central, scaled to 12g portion"
    fields_changed:
      - "vitamin_d_ug: 0.1 → 0.05"
      - "choline_mg: 0 → 1.8"
      - "iodine_ug: 2 → 1.8 (refined UK dairy estimate)"
      - "vitamin_b9_ug: 0 → 1.4"
      - "vitamin_b12_ug: 0 → 0.02"
      - "phosphorus_mg: 0 → 31"
      - "copper_mg: 0.1 → 0.09"
      - "selenium_ug: 0 → 0.3"
      - "manganese_mg: 0.0 → 0.01"
      - "vitamin_a_ug: 0 → 35"
      - "vitamin_e_mg: 0.0 → 0.02"
      - "vitamin_k_ug: 0 → 0.2"
      - "vitamin_b1_mg: 0 → 0.01"
      - "vitamin_b2_mg: 0 → 0.05"
      - "vitamin_b3_mg: 0 → 0.05"
      - "vitamin_b6_mg: 0 → 0.03"
      - "omega3_epa_mg: confirmed 0"
      - "omega3_dha_mg: confirmed 0"
    evidence:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/173435/nutrients"
        note: "USDA FDC ID 173435: Cheese, goat, soft type - all nutrient values scaled from per-100g to 12g portion (multiply by 0.12)"
  - timestamp: "2025-11-05T18:00:00+00:00"
    updated_by: "Claude Code (Sonnet 4.5)"
    reason: "Final enrichment: Added 3 remaining nutrients (B5, ALA, LA) using USDA and goat milk fatty acid research"
    fields_changed:
      - "vitamin_b5_mg: 0 → 0.08"
      - "omega3_ala_g: 0 → 0.01"
      - "omega6_la_g: 0 → 0.04"
    evidence:
      - url: "https://nutrientoptimiser.com/nutritional-value-cheese-goat-soft-type/"
        note: "Soft goat cheese pantothenic acid (B5): 0.7mg per 100g, scaled to 12g = 0.08mg"
      - url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6680990/"
        note: "Goat milk fatty acids research: LA 2.0-3.1% of total fat (used 2.5%), ALA 0.41-0.81% of total fat (used 0.6%). Goat cheese 12% fat: LA=0.3g/100g, ALA=0.072g/100g, scaled to 12g portion"
    notes: "Vitamin B7 (biotin), chromium, and molybdenum remain 0 (not routinely analyzed in cheese per USDA research). Fiber soluble/insoluble remain 0.0 (TRUE ZERO for dairy). All omega-3/6 values now complete."
```
