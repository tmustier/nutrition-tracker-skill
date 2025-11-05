## Protein Granola Yogurt (SHK)

```yaml
id: protein_granola_yogurt_shk_v1
schema_version: 2
version: 1
last_verified: 2025-11-05
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: "Page 71, Protein Pots section"
  evidence:
    - "SHK nutrition PDF (11046802_aa_2025-10-30.pdf, page 71): 264 kcal, 35g P, 18g C, 7.6g F"
    - "Ingredients listed: Greek Yogurt with berry protein, chia seeds and homemade granola"
    - "Marked DF (Dairy Free) with Soya allergen suggests soy-based yogurt alternative"
    - "Component estimation: ~140g dairy-free yogurt, ~28g berry protein powder, ~10g chia seeds, ~20g granola"
aliases: []
category: dessert
portion:
  description: "protein pot serving"
  est_weight_g: 210
  notes: "Dairy-free yogurt base with berry protein powder, chia seeds, and house granola; high-protein formulation"
assumptions:
  salt_scheme: "light"
  oil_type: "granola likely made with vegetable/sunflower oil"
  prep: "cold assembly; protein powder mixed into yogurt base"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 290.6
  protein_g: 35
  fat_g: 7.6
  sat_fat_g: 1.5
  mufa_g: 2.0
  pufa_g: 3.9
  trans_fat_g: 0.1
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 23.1
  carbs_available_g: 18
  sugar_g: 12
  fiber_total_g: 5.1
  fiber_soluble_g: 2.6
  fiber_insoluble_g: 2.5
  polyols_g: 0.0
  # Minerals
  sodium_mg: 125
  potassium_mg: 465
  iodine_ug: 12
  magnesium_mg: 95
  calcium_mg: 230
  iron_mg: 3.6
  zinc_mg: 2.6
  vitamin_c_mg: 2
  manganese_mg: 0.8
  copper_mg: 0.3
  selenium_ug: 13
  chromium_ug: 2
  molybdenum_ug: 11
  phosphorus_mg: 360
  chloride_mg: 195
  sulfur_g: 0.42
  # Vitamins
  vitamin_a_ug: 18
  vitamin_d_ug: 0.6
  vitamin_e_mg: 1.6
  vitamin_k_ug: 6
  vitamin_b1_mg: 0.16
  vitamin_b2_mg: 0.27
  vitamin_b3_mg: 2.1
  vitamin_b5_mg: 0.52
  vitamin_b6_mg: 0.17
  vitamin_b7_ug: 9
  vitamin_b9_ug: 28
  vitamin_b12_ug: 0.85
  choline_mg: 38
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 1.85
  omega6_la_g: 0.62
  # Ultra-trace minerals
  boron_mg: 0.32
  silicon_mg: 2.1
  vanadium_ug: 6
  nickel_ug: 11
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "Exact protein powder formulation unknown (assumed whey/pea blend at ~78% protein)"
    - "Granola recipe unknown (assumed oat base with honey/maple, standard UK formulation)"
    - "Dairy-free yogurt type inferred from DF marking and soya allergen (likely soy yogurt)"
    - "Berry protein flavor may contain small amounts of freeze-dried berry powder (minimal nutritional impact)"
notes:
  - "Atwater check (available carb basis): 4×35.0 + 9×7.6 + 4×18.0 + 2×5.1 + 2.4×0.0 = 140.0 + 68.4 + 72.0 + 10.2 = 290.6 kcal"
  - "Venue-provided label energy: 264 kcal (SHK PDF page 71). Differs from calculated by 10% - venue likely uses simplified 4-4-9 without fiber energy factor"
  - "Per ESTIMATE.md policy: Stored calculated energy (290.6 kcal) due to >8% variance from label value"
  - "Exceptionally high protein (35g) achieved via berry protein powder (~28g serving = ~22g protein) plus soy yogurt (~140g = ~5g), chia seeds (~10g = ~1.7g), and granola (~20g = ~2g)"
  - "Chia seeds contribute high ALA omega-3 (~1.85g from 10g chia at 17.8g/100g USDA value)"
  - "Marked DF (Dairy Free) despite 'Greek Yogurt' description; allergen list confirms soya-based alternative"
  - "Component weight estimation (210g total): dairy-free yogurt 140g + protein powder 28g + chia 10g + granola 20g + berry mix 12g"
  - "Fat split: Chia seeds (3.1g), granola oils (2.5g), protein powder (1.0g), soy yogurt (1.0g) = 7.6g total"
  - "Fiber from chia seeds (3.4g) and oat granola (1.7g) = 5.1g total"
  - "Micronutrients scaled from USDA profiles: soy yogurt plain, pea protein isolate, chia seeds dried, granola oat-based"
change_log:
  - timestamp: 2025-11-05T00:00:00+0000
    updated_by: 'LLM: Claude Sonnet 4.5'
    reason: Initial population from SHK PDF nutrition data with component-based micronutrient estimation
    fields_changed: [all nutrient fields, portion.est_weight_g, portion.notes, assumptions, source.evidence, quality]
    sources:
      - note: "SHK nutrition PDF page 71"
        url: "vendor_provided"
      - note: "USDA FoodData Central for component profiles (soy yogurt, pea protein, chia seeds, oat granola)"
        url: "https://fdc.nal.usda.gov/"
```
