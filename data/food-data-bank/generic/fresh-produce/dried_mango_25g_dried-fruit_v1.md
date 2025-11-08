## Dried Mango, 25g

```yaml
id: dried_mango_25g_dried-fruit_v1
schema_version: 2
version: 1
last_verified: 2025-11-08
source:
  venue: Dried Fruit
  menu_page: ""
  evidence:
    - "USDA FoodData Central - Mango, sweetened, dried (FDC ID: 169091). Primary source for comprehensive nutrient profile."
    - "https://www.nutritionvalue.org/Mango%2C_sweetened%2C_dried_nutritional_value.html - Detailed micronutrient data"
    - "https://pmc.ncbi.nlm.nih.gov/articles/PMC6807195/ - Chemical Composition of Mango research for calcium, manganese verification"
aliases: []
category: ingredient
portion:
  description: "a few slivers (approx 25g)"
  est_weight_g: 25
  notes: "Generic dried mango, lightly sweetened (typical commercial preparation). Portion represents 3-4 thin slivers."
assumptions:
  salt_scheme: "unsalted"
  oil_type: ""
  prep: "Dried mango with light sugar coating (typical commercial product)"
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 80
  protein_g: 0.6
  fat_g: 0.3
  sat_fat_g: 0.07
  mufa_g: 0.11
  pufa_g: 0.06
  trans_fat_g: 0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 19.6
  carbs_available_g: 19.0
  sugar_g: 16.6
  fiber_total_g: 0.6
  fiber_soluble_g: 0.2
  fiber_insoluble_g: 0.4
  polyols_g: 0.0
  # Minerals
  sodium_mg: 41
  potassium_mg: 70
  iodine_ug: 0
  magnesium_mg: 5
  calcium_mg: 10
  iron_mg: 0.06
  zinc_mg: 0.08
  vitamin_c_mg: 10.6
  manganese_mg: 0.25
  copper_mg: 0.08
  selenium_ug: 0.5
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 13
  chloride_mg: 63
  sulfur_g: 0.002
  # Vitamins
  vitamin_a_ug: 17
  vitamin_d_ug: 0
  vitamin_e_mg: 1.0
  vitamin_k_ug: 3.3
  vitamin_b1_mg: 0.016
  vitamin_b2_mg: 0.021
  vitamin_b3_mg: 0.5
  vitamin_b5_mg: 0.2
  vitamin_b6_mg: 0.084
  vitamin_b7_ug: 0
  vitamin_b9_ug: 17
  vitamin_b12_ug: 0
  choline_mg: 5.9
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.01
  omega6_la_g: 0.04
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
    - "Calcium: Estimated at 10mg (USDA source showed 0mg which appears to be missing data; fresh mango 7-16mg/100g × 5× concentration = 35-80mg/100g dried, scaled to 25g). MEDIUM confidence."
    - "Vitamin B5: Estimated at 0.2mg from fresh mango data (0.16-0.2mg/100g) with 5× concentration factor for drying. MEDIUM confidence."
    - "Vitamin B7 (Biotin): Set to 0 (not routinely analyzed by USDA for dried fruits)."
    - "Manganese: Corrected to 0.25mg per 25g (1mg/100g). One source erroneously showed 10mg/100g; verified against research showing dried mango typically 0.8-1.1mg/100g."
    - "Omega-3 ALA: Estimated at 0.01g (conservative estimate; research shows fresh mango has very low ω-3, ~0.7-3.9mg combined ω-3+ω-6 per 100g). Must be consistent with PUFA 0.06g total. MEDIUM confidence."
    - "Omega-6 LA: Estimated at 0.04g (majority of PUFA; linoleic acid is primary polyunsaturated fatty acid in mango). Together with ALA (0.01g) totals 0.05g, which is 83% of PUFA 0.06g. MEDIUM confidence."
    - "Fiber soluble/insoluble split: Estimated at 30%/70% ratio (typical for fruits). No specific data available for dried mango."
notes:
  - "Atwater check (available carb basis): 4×0.6 + 9×0.3 + 4×19.0 + 2×0.6 + 2.4×0.0 = 2.4 + 2.7 + 76.0 + 1.2 = 82.3 kcal (vs 80 kcal reported, -2.8% variance within tolerance)"
  - "Dried mango is HIGHLY concentrated in sugars (66% of weight) and carbohydrates (78% of weight). Natural mango sugars are concentrated during drying; this product has light added sugar (typical commercial preparation)."
  - "Key nutrients: Very high in Vitamin A (17µg = 2% DV from carotenoids), Vitamin C (10.6mg = 12% DV - partially preserved during drying), Vitamin E (1.0mg = 7% DV). Good source of potassium (70mg)."
  - "Drying concentrates nutrients approximately 5× compared to fresh mango (due to ~80% water removal)."
  - "Portion size 'a few slivers' estimated at 25g based on: typical dried mango slice weight 5-8g × 3-4 slices = 15-30g range, using 25g midpoint."
change_log:
  - timestamp: "2025-11-08T16:00:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Initial creation with complete 52-nutrient profile for dried mango (25g portion)"
    fields_changed: [all]
    sources:
      - note: "USDA FoodData Central - Mango, sweetened, dried (FDC ID: 169091). Per 100g: Energy 319 kcal, Protein 2.45g, Fat 1.18g (Saturated 0.287g, MUFA 0.439g, PUFA 0.222g), Total Carbohydrate 78.58g, Fiber 2.4g, Sugars 66.27g, Sodium 162mg, Potassium 279mg, Iron 0.23mg, Magnesium 20mg, Phosphorus 50mg, Zinc 0.3mg, Copper 0.3mg, Selenium 2.1µg. Vitamins: A 67µg, C 42.3mg, E 4.02mg, K 13.2µg, B1 0.062mg, B2 0.085mg, B3 2.0mg, B6 0.334mg, B9 68µg. All values scaled to 25g portion (×0.25)."
        url: "https://www.nutritionvalue.org/Mango%2C_sweetened%2C_dried_nutritional_value.html"
      - note: "Manganese correction: Research literature (PMC6807195) indicates dried mango contains 0.8-1.1mg/100g manganese (not 10mg as one source erroneously reported). Used 1.0mg/100g → 0.25mg/25g."
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6807195/"
      - note: "Calcium estimation: Fresh mango contains 7-16mg/100g (USDA Tommy Atkins, Keitt, Kent, Haden cultivars). With 5× concentration during drying, estimated 35-80mg/100g dried → conservative 40mg/100g used → 10mg/25g."
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6807195/"
      - note: "Vitamin B5 estimation: Fresh mango 0.16-0.2mg/100g (USDA). With 5× concentration → 0.8mg/100g dried → 0.2mg/25g. MEDIUM confidence."
      - note: "Omega fatty acids: Estimated based on PUFA total of 0.06g per 25g (0.222g/100g from USDA). Research shows fresh mango has very low combined ω-3+ω-6 (0.7-3.9mg/100g). For dried mango: ALA (ω-3) ~0.01g and LA (ω-6) ~0.04g per 25g, totaling 0.05g (83% of PUFA). Remaining PUFA likely other polyunsaturated fatty acids. MEDIUM confidence."
      - note: "Chloride (derived): sodium 41mg × 1.54 = 63mg. Sulfur (derived): protein 0.6g × 0.004 (plant coefficient) = 0.0024g ≈ 0.002g."
      - note: "Ultra-trace minerals (boron, silicon, vanadium, nickel): Set to 0 per ESTIMATE.md guidelines (not tracked due to no USDA coverage, no RDAs, high regional variation)."
      - note: "TRUE ZEROS (scientifically absent): Cholesterol, vitamin D, vitamin B12, EPA, DHA, trans fat (plant food with no animal products or hydrogenation)."
      - note: "NOT AVAILABLE in sources: Vitamin B7/biotin (not routinely analyzed by USDA for dried fruits), chromium, molybdenum (not routinely analyzed for fruits), iodine (trace/negligible in plant foods)."
```
