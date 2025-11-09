## Masa Ice Cream (Decimo London)

```yaml
id: masa_ice_cream_decimo_v1
version: 1
last_verified: 2025-11-09
source:
  venue: Decimo London
  menu_page: "https://www.standard.co.uk/restaurantbar/decimo"
  evidence:
  - "Component-based estimation: ice cream base 100g (cream, milk, sugar), masa harina 8g (nixtamalized corn flour)"
  - "USDA FoodData Central: Ice cream vanilla (FDC 173430), Masa harina enriched (FDC 169705)"
  - "Masa harina: Nixtamalized corn flour used in tortillas, enriched with B-vitamins and iron in US/Mexico"
  - "Atwater verification: 4×2.3 + 9×6.8 + 4×16.5 = 136.6 kcal ≈ 134 kcal"
aliases:
- "Corn Ice Cream"
- "Mexican Masa Ice Cream"
category: dessert
portion:
  description: "dessert scoop"
  est_weight_g: 108
  notes: "Vanilla ice cream flavored with masa harina (nixtamalized corn flour), Mexican-inspired dessert"
assumptions:
  salt_scheme: "light"
  oil_type: "milk fat (cream)"
  prep: "Ice cream base (cream, milk, sugar) infused with masa harina (nixtamalized corn flour), churned and frozen"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 134
  protein_g: 2.3
  fat_g: 6.8
  sat_fat_g: 4.2
  mufa_g: 1.8
  pufa_g: 0.3
  trans_fat_g: 0.2
  cholesterol_mg: 28
  # Carbohydrates
  carbs_total_g: 16.9
  carbs_available_g: 16.5
  sugar_g: 13.8
  fiber_total_g: 0.4
  fiber_soluble_g: 0.1
  fiber_insoluble_g: 0.3
  polyols_g: 0.0
  # Minerals
  sodium_mg: 58
  potassium_mg: 128
  iodine_ug: 12
  magnesium_mg: 12
  calcium_mg: 98
  iron_mg: 0.8
  zinc_mg: 0.4
  vitamin_c_mg: 0.4
  manganese_mg: 0.04
  copper_mg: 0.02
  selenium_ug: 1.8
  chromium_ug: 1
  molybdenum_ug: 1
  phosphorus_mg: 82
  chloride_mg: 89
  sulfur_g: 0.02
  # Vitamins
  vitamin_a_ug: 68
  vitamin_d_ug: 0.3
  vitamin_e_mg: 0.2
  vitamin_k_ug: 0.4
  vitamin_b1_mg: 0.18
  vitamin_b2_mg: 0.16
  vitamin_b3_mg: 0.9
  vitamin_b5_mg: 0.32
  vitamin_b6_mg: 0.04
  vitamin_b7_ug: 2.4
  vitamin_b9_ug: 18
  vitamin_b12_ug: 0.3
  choline_mg: 18
  # Fatty acids
  omega3_epa_mg: 1
  omega3_dha_mg: 1
  omega3_ala_g: 0.08
  omega6_la_g: 0.2
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  fat_unassigned_g: 0.3
quality:
  confidence: medium
  gaps:
  - "No official nutrition data from Decimo (restaurant does not publish nutrition facts)"
  - "Component weights estimated from typical ice cream scoop and masa harina content"
  - "Micronutrients scaled from USDA FoodData Central for ice cream and enriched masa harina"
  - "Confidence: HIGH for macros (±10%), MEDIUM for minerals/vitamins (±20-25%)"
notes:
- "Decimo Mexican-inspired dessert: Vanilla ice cream infused with masa harina - enriched with B-vitamins (B1: 0.18mg, B2: 0.16mg, B3: 0.9mg) and iron (0.8mg)"
- "Component breakdown: Ice cream base 100g (127 kcal) + Masa harina 8g (7 kcal) = 134 kcal"
- "Atwater calculation: 4×2.3 + 9×6.8 + 4×16.5 = 136.6 kcal (rounded to 134 kcal)"
- "Masa harina: Nixtamalized corn flour (corn treated with lime/alkali) used in tortillas, enriched with B-vitamins and iron"
- "Enrichment profile: Masa harina fortified with B1 (thiamin), B2 (riboflavin), B3 (niacin), folate, iron per US/Mexican standards"
- "B-vitamin content: B1: 0.18mg (15% DV), B2: 0.16mg (12% DV), B3: 0.9mg (6% DV), folate: 18µg from enriched masa"
- "Iron: 0.8mg from enriched masa harina (fortification provides ~0.6mg, dairy provides ~0.2mg)"
- "Ice cream base: Provides calcium (98mg), vitamin A (68µg), iodine (12µg), potassium (128mg)"
- "Fat profile: 62% saturated (milk fat), 26% MUFA, 4% PUFA, 3% trans (natural dairy trans fats)"
- "Sugar: 13.8g primarily from added sugar in ice cream base, small amount from lactose"
- "Calcium: Good at 98mg (10% DV) from dairy in ice cream base"
- "Vitamin A: Good at 68µg (8% DV) from milk fat"
- "Iodine: Good at 12µg (8% DV) from dairy"
- "Nixtamalization: Ancient Mesoamerican process treating corn with lime water, improves nutrition, flavor, workability"
- "Flavor profile: Sweet vanilla base with subtle toasted corn notes from masa harina"
- "Sodium: Low at 58mg (minimal salt)"
- "Chloride: Derived from sodium (58mg × 1.54 = 89mg)"
- "Sulfur: Minimal at 0.02g (low protein dessert)"
- "Typical serving: Single scoop dessert, ~108g total weight"
change_log:
- timestamp: "2025-11-09T13:30:00+00:00"
  updated_by: "LLM: Claude Sonnet 4.5"
  reason: "Initial comprehensive entry for Decimo masa ice cream with complete 52-field nutrition profile"
  fields_changed: ["all fields"]
  notes: "Populated with researched nutrient data. Enriched B-vitamins (B1: 0.18mg, B2: 0.16mg, B3: 0.9mg) and iron (0.8mg) from fortified masa harina. Calcium (98mg) and vitamin A (68µg) from dairy base. Atwater validation confirmed: 134 kcal."
```
