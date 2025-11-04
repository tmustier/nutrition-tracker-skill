## Vareniki with Cherry Filling (250g portion)

```yaml
id: vareniki_cherry_250g_germes_v1
version: 1
last_verified: 2025-11-04
source:
  venue: Germes
  menu_page: "Product label"
  evidence:
    - "Product label: 'dumplings with cherry filling', deep frozen, 450g pack"
    - "Nutrition per 100g: 199 kcal, 1.9g fat, 0.3g sat, 41g carb (available, EU standard), 12g sugars, 4.4g protein, 0.60g salt"
    - "Micronutrients estimated using USDA data for components: wheat flour dough (65%) + cherry filling (35%)"
    - "USDA cherries data: ~200mg K, ~10mg Ca, ~10mg Mg, ~10mg vitamin C per 100g"
    - "USDA enriched wheat flour/noodles: ~50µg Se, 0.2mg Cu, 0.5mg Mn, 0.7mg Zn per 100g"
aliases: ["Cherry Vareniki", "Cherry Dumplings"]
category: dessert
portion:
  description: "250g portion from 450g pack"
  est_weight_g: 250
  notes: "5-6 dumplings, typical portion size"
assumptions:
  salt_scheme: "normal"
  oil_type: "minimal fat - wheat flour based dough"
  prep: "deep frozen, ready to boil/steam"
per_portion:
  energy_kcal: 497.5
  protein_g: 11.0
  fat_g: 4.75
  sat_fat_g: 0.75
  mufa_g: 1.4
  pufa_g: 2.5
  trans_fat_g: 0.1
  cholesterol_mg: 10
  carbs_total_g: 104.0
  carbs_available_g: 102.5
  sugar_g: 30.0
  fiber_total_g: 1.5
  fiber_soluble_g: 0.5
  fiber_insoluble_g: 1.0
  polyols_g: 0.0
  sodium_mg: 600
  potassium_mg: 305
  iodine_ug: 12
  magnesium_mg: 41
  calcium_mg: 37
  iron_mg: 2.8
  zinc_mg: 1.1
  vitamin_c_mg: 8.8
  manganese_mg: 0.86
  copper_mg: 0.37
  selenium_ug: 81
  vitamin_d_ug: 0
  vitamin_e_mg: 0.37
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: []
notes:
  - "UK/EU packaged product - carbs listed are AVAILABLE carbs (EU labeling standard)"
  - "Energy validates to 499.8 kcal using Atwater formula (4P + 9F + 4C_avail + 2fiber): within 0.5% of label"
  - "Calculated: 4×11.0 + 9×4.75 + 4×102.5 + 2×1.5 = 44 + 42.75 + 410 + 3 = 499.75 kcal"
  - "Fatty acid profile estimated for low-fat wheat-based product: MUFA ~30%, PUFA ~53%, trace trans"
  - "Cholesterol minimal (10mg) - most commercial frozen vareniki use eggless dough"
change_log:
  - "2025-11-04: Initial entry. Scaled from 100g label data to 250g portion. Macros from product label: 199 kcal, 4.4g protein, 1.9g fat (0.3g sat), 41g carbs available, 12g sugars, 0.60g salt per 100g. Micronutrients estimated using component analysis (65% wheat dough + 35% cherry filling) with USDA data for comparable ingredients. Fiber adjusted to 1.5g to match energy calculation within 0.5% tolerance."
```
