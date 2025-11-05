## Chavroux Mild & Creamy Goat's Cheese (12g slice)

```yaml
id: chavroux_mild_creamy_goat_cheese_12g_chavroux_v1
version: 1
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
  iodine_ug: 2
  magnesium_mg: 3
  calcium_mg: 36
  iron_mg: 0.2
  zinc_mg: 0.1
  vitamin_c_mg: 0.0
  manganese_mg: 0.0
  copper_mg: 0.1
  selenium_ug: 0
  vitamin_d_ug: 0.1
  vitamin_e_mg: 0.0
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
```
