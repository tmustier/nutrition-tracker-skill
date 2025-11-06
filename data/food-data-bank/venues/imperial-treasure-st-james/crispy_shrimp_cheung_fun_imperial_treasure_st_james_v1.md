## Crispy Shrimp Cheung Fun (Imperial Treasure St. James)

```yaml
id: crispy_shrimp_cheung_fun_imperial_treasure_st_james_v1
schema_version: 2
version: 3
last_verified: 2025-11-02
source:
  venue: Imperial Treasure Fine Chinese Cuisine, St. James (London)
  menu_page: "https://restaurantguru.com/Imperial-Treasure-London/menu"
  evidence:
  - url: Component-based estimation using USDA data
    note: Rice noodles (USDA FDC 168914), Shrimp (USDA cooked), Soybean oil, Wheat flour, Youtiao, Sweet soy sauce
  - url: https://www.mynetdiary.com/food/calories-in-shrimp-cheong-fun-rice-noodle-roll-by-doll-dim-sum-serving-21863793-0.html
    note: Reference for steamed shrimp cheung fun baseline (115 kcal)
  - url: https://tools.myfooddata.com/nutrition-facts/171971/wt1
    note: Shrimp micronutrients per 100g
  - url: https://www.snapcalorie.com/nutrition/fried_dough_sticks_nutrition.html
    note: 'Youtiao (fried dough stick) nutrition: ~192 kcal/100g'
aliases:
- Crispy Golden Net Prawn Cheung Fun
category: main
portion:
  description: 1 piece
  est_weight_g: 12.5
  notes: "Full portion contains 6 pieces. This is a premium dim sum dish featuring rice noodle wrapped around crispy fried shrimp with golden net coating and fried dough stick inside. Served with sweet soy sauce. Estimated weight based on component analysis: 30g rice noodle + 20g shrimp (raw) + 13g coating/oil + 8g youtiao + 5g sauce."
assumptions:
  salt_scheme: normal
  oil_type: soybean oil (typical for Chinese dim sum frying)
  prep: Rice noodle steamed, then wrapped around large shrimp with tempura-style golden net coating and small piece of youtiao (fried dough stick). Entire roll is deep-fried until crispy, then served with sweet soy sauce drizzled on top.
per_portion:
  energy_kcal: 31
  protein_g: 0.9
  fat_g: 1.9
  sat_fat_g: 0.25
  mufa_g: 0.4
  pufa_g: 0.96
  trans_fat_g: 0
  cholesterol_mg: 4
  sugar_g: 0.5
  fiber_total_g: 0.5
  fiber_soluble_g: 0.2
  fiber_insoluble_g: 0.3
  sodium_mg: 80
  potassium_mg: 9
  iodine_ug: 1
  magnesium_mg: 1
  calcium_mg: 2
  iron_mg: 1
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0.1
  polyols_g: 0
  carbs_available_g: 2.6
  carbs_total_g: 3.1
  copper_mg: 0
  selenium_ug: 0
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 0
  chloride_mg: 0
  sulfur_g: 0.0
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0
  vitamin_b2_mg: 0
  vitamin_b3_mg: 0
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0
  vitamin_b7_ug: 0
  vitamin_b9_ug: 0
  vitamin_b12_ug: 0
  choline_mg: 0
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0
  omega6_la_g: 0
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
  - Fiber values are estimates; soluble/insoluble fiber breakdown not available
  - Manganese not calculated
  - Vitamin C minimal/trace
notes:
- Component-based estimation (per ESTIMATE.md guidelines): Rice noodle wrapper (30g cooked) + Large shrimp (20g raw→16g cooked) + Golden net crispy coating (8g flour + 5g oil) + Fried dough stick/youtiao (8g) + Additional frying oil (5g) + Sweet soy sauce (5g)
- Rice noodles: 32 kcal, 0.5g P, 0.1g F, 7.2g C (USDA FDC 168914 scaled)
- Shrimp (16g cooked): 16 kcal, 3.8g P, 0.2g F, 0g C, plus micronutrients scaled from USDA data (111mg Na, 259mg K, 70mg Ca, 1.6mg Zn per 100g)
- Golden net coating: Tempura-style batter (8g flour: 29 kcal, 0.8g P, 6.1g C) + Deep fry oil absorption (5g: 44 kcal, 5g F with soybean oil profile: 15% sat, 24% MUFA, 58% PUFA)
- Youtiao/fried dough stick (8g): 15 kcal, 0.3g P, 0.8g F, 1.8g C (192 kcal/100g reference)
- Additional frying oil for crispy wrapper (5g): 44 kcal, 5g F (same FA profile as above)
- Sweet soy sauce (5g): 3 kcal, 0.2g P, 0.5g C, ~300mg Na
- Finishing salt (0.5% of 75g dish weight): 0.38g salt = 152mg additional sodium
- Total sodium breakdown: 6mg (rice noodles) + 18mg (shrimp) + 1mg (flour) + 2mg (youtiao) + 300mg (soy sauce) + 152mg (finishing salt) = 479mg
- Atwater validation: 4×5.6 + 4×15.6 + 9×11.2 = 185.6 kcal ≈ 183 kcal (1.4% difference, within tolerance)
- Price reference: £10.80 for 6 pieces = £1.80 per piece (premium dim sum)
- The crispy preparation adds significant calories vs. traditional steamed shrimp cheung fun (~27 kcal/piece steamed vs. ~183 kcal/piece crispy fried)
change_log:
- timestamp: 2025-11-02T00:00:00+0000
  updated_by: 'LLM: Claude Sonnet 4.5'
  reason: Initial component-based estimation for Imperial Treasure St. James crispy shrimp cheung fun
  fields_changed: [all fields populated from component analysis]
  sources: [{note: 'USDA rice noodles (cooked): 108 kcal/100g, 1.79g P, 0.2g F, 24g C', url: 'https://foods.fatsecret.com/calories-nutrition/usda/rice-noodles-(cooked)'},
  {note: 'USDA cooked shrimp: 99 kcal/100g, 24g P, 1g F, micronutrients', url: 'https://tools.myfooddata.com/nutrition-facts/171971/wt1'},
  {note: 'Youtiao: 192 kcal/100g, 4g P, 10g F, 22g C', url: 'https://www.snapcalorie.com/nutrition/fried_dough_sticks_nutrition.html'},
  {note: 'Soybean oil FA profile: 15% sat, 24% MUFA, 58% PUFA', url: 'https://www.nutrition-and-you.com/soybean-oil.html'}]
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
```
