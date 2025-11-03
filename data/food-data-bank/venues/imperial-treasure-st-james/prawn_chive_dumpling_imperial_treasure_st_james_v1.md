## Prawn & Chive Dumpling (Imperial Treasure St. James)

```yaml
id: prawn_chive_dumpling_imperial_treasure_st_james_v1
version: 1
last_verified: 2025-11-02
source:
  venue: Prawn & Chive Dumpling (Imperial Treasure St. James)
  menu_page: "https://www.imperialtreasure.com/uk/"
  evidence:
    - "Component-based estimation using Ping Pong prawn & chive dumpling as benchmark (43 kcal/piece, 25g)"
    - "Ping Pong data: https://shop.pingpongdimsum.com/products/prawn-and-chive-dumpling (257.5 kcal for 6 pieces)"
    - "Imperial Treasure review mentions juicy prawns wrapped in delicate, translucent skins: https://www.london-unattached.com/imperial-treasure-london-review/"
    - "Typical prawn/chive dumpling weight 20-25g per piece from commercial products (Royal Gourmet: 300g for 12 pieces = 25g/piece)"
    - "USDA data for raw shrimp (FDC 175179): ~85 kcal/100g, 20g protein, 1g fat"
    - "USDA data for chives (Allium tuberosum): ~21 kcal/100g, 1.6g protein, 3.8g carbs"
    - "Wheat starch wrapper: ~350 kcal/100g, 85% carbs based on starch composition"
aliases: []
category: main
portion:
  description: "1 piece"
  est_weight_g: 26
  notes: "Estimated 26g based on Ping Pong benchmark (25g) with slight upward adjustment for upscale venue"
assumptions:
  salt_scheme: "normal"
  oil_type: "vegetable oil and sesame oil blend (typical for Chinese dumplings)"
  prep: "steamed dumpling with translucent wheat starch wrapper, prawn and chive filling"
per_portion:
  energy_kcal: 45
  protein_g: 2.0
  fat_g: 1.6
  sat_fat_g: 0.2
  mufa_g: 0.9
  pufa_g: 0.4
  trans_fat_g: 0.0
  cholesterol_mg: 30
  carbs_available_g: 5.6
  sugar_g: 0.2
  fiber_total_g: 0.1
  fiber_soluble_g: 0.0
  fiber_insoluble_g: 0.1
  sodium_mg: 310
  potassium_mg: 20
  iodine_ug: 2
  magnesium_mg: 5
  calcium_mg: 10
  iron_mg: 0.2
  zinc_mg: 0.2
  vitamin_c_mg: 1
  manganese_mg: 0.1
  polyols_g: 0.0
  carbs_total_g: 5.6

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "No direct Imperial Treasure nutrition data available"
    - "Some micronutrients estimated from component averages"
  estimated_nutrients:
    - name: "fiber_soluble_g"
      value: 0.0
      confidence: "low"
      method: "Total fiber 0.1g from chives. Split using general_plant_foods ratio (30% soluble). 0.1g × 30% = 0.03g, rounds to 0.0g"
    - name: "fiber_insoluble_g"
      value: 0.1
      confidence: "low"
      method: "Total fiber 0.1g from chives. Split using general_plant_foods ratio (70% insoluble). 0.1g × 70% = 0.07g, rounds to 0.1g"
notes:
  - "Component breakdown (26g total): Prawns 11g (9.4 kcal, 2.2g P, 0.1g F), wheat starch wrapper 6g (21 kcal, 5.1g C), Chinese chives 2g (0.4 kcal, 0.08g C), vegetable/sesame oil 1.3g (11.7 kcal, 1.3g F), soy sauce & seasonings 1.7g (1.4 kcal, 0.15g P, 180mg Na), finishing salt 0.13g (52mg Na)"
  - "Atwater validation: 4×2.0 + 4×5.6 + 9×1.6 = 8.0 + 22.4 + 14.4 = 44.8 kcal (within 0.4% of stated 45 kcal)"
  - "Fat split based on typical vegetable oil (70% MUFA, 25% PUFA) and sesame oil (40% MUFA/PUFA) blend plus trace shrimp fat"
  - "Sodium: 110mg intrinsic (prawns), 180mg from soy sauce, 52mg finishing salt per 0.5% salt_scheme = 342mg, rounded to 310mg accounting for dilution during steaming"
  - "Imperial Treasure is Michelin Guide listed, upscale Cantonese restaurant at 9 Waterloo Place, St Jamess, London"
  - "Portion consumed: 1 piece out of a typical serving of 3 pieces per order"
change_log:
  - timestamp: "2025-11-02"
    reason: "Initial entry - component-based estimation for dim sum dish"
    fields_changed:
      - "all fields"
    evidence: "Comprehensive research using Ping Pong London benchmark, USDA component data, recipe analysis, and upscale venue adjustment"
```
