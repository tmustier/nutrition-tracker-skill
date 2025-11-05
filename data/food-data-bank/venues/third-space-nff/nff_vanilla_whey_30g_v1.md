## Natural Fitness Food Vanilla Whey Protein (30g scoop)

```yaml
id: nff_vanilla_whey_30g_v1
schema_version: 2
version: 2
last_verified: 2025-11-02
source:
  venue: Third Space / Natural Fitness Food
  menu_page: 
  evidence:
  - OpenFoodFacts entry: 125 kcal, 22g P, 6.5g C (3.4g sugar), 1.4g F (1g sat), 0.5g fiber, 0.098g salt
  - Ingredient list: Whey Protein Concentrate (87%) (MILK), Natural Flavouring (7%), Thickener (Xanthan Gum), Sweetener (Steviol Glycosides), Emulsifier (Sunflower Lecithin)
  - Scoop size confirmed as ~30g
aliases:
- NFF Vanilla Whey
- Third Space Vanilla Protein
category: ingredient
portion:
  description: 1 scoop (30g)
  est_weight_g: 30
  notes: Whey protein concentrate powder, 87% protein content
assumptions:
  salt_scheme: normal
  oil_type: dairy-based (whey concentrate)
  prep: Powder form, typically mixed with water or milk
per_portion:
  energy_kcal: 127.6
  protein_g: 22
  fat_g: 1.4
  sat_fat_g: 1
  mufa_g: 0.3
  pufa_g: 0.1
  trans_fat_g: 0
  cholesterol_mg: 20
  sugar_g: 3.4
  fiber_total_g: 0.5
  fiber_soluble_g: 0.5
  fiber_insoluble_g: 0
  sodium_mg: 39
  potassium_mg: 180
  iodine_ug: 5
  magnesium_mg: 30
  calcium_mg: 150
  iron_mg: 0.3
  zinc_mg: 1.5
  vitamin_c_mg: 0
  manganese_mg: 0.05
  polyols_g: 0
  carbs_available_g: 6.5
  carbs_total_g: 7
  copper_mg: 0.02
  selenium_ug: 3.2
  chromium_ug: 1
  molybdenum_ug: 1.5
  phosphorus_mg: 176
  chloride_mg: 120
  sulfur_g: 0.18
  vitamin_a_ug: 0
  vitamin_d_ug: 0.03
  vitamin_e_mg: 0.02
  vitamin_k_ug: 0.03
  vitamin_b1_mg: 0.11
  vitamin_b2_mg: 0.43
  vitamin_b3_mg: 0.3
  vitamin_b5_mg: 0.80
  vitamin_b6_mg: 0.07
  vitamin_b7_ug: 1.5
  vitamin_b9_ug: 2
  vitamin_b12_ug: 0.36
  choline_mg: 5.6
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0.003
  omega6_la_g: 0.02
  boron_mg: 0.01
  silicon_mg: 0.05
  vanadium_ug: 0.05
  nickel_ug: 0.05
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps:
  - Fat subtype breakdown estimated from typical whey concentrate profiles
  - Trace minerals estimated from dairy composition
notes:
- OpenFoodFacts validated nutrition: 125 kcal, 22g P, 6.5g C, 1.4g F, 0.5g fiber per 30g scoop
- Ingredient analysis: 87% whey protein concentrate = 26.1g protein content, actual 22g suggests 73% protein efficiency typical of WPC-80
- Fat breakdown: sat 1.0g dominant (dairy fat), trace MUFA/PUFA from milk lipids
- Fiber (0.5g) entirely from xanthan gum thickener (soluble fiber)
- Sugar (3.4g) from residual lactose in whey concentrate
- Sodium (39mg) calculated from stated salt content (0.098g)
- Cholesterol estimated 20mg typical for whey protein concentrate
- Calcium (150mg) significant due to whey dairy origin
- Potassium (180mg) naturally high in whey
- Trans fat trace amounts (<0.1g) from ruminant dairy, rounded to 0
- Contains sunflower lecithin emulsifier (contributes minimal fat)
- Sweetened with stevia (zero calorie)
- Atwater check (available carb basis): 4×22.0 + 9×1.4 + 4×6.5 + 2×0.5 + 2.4×0.0 = 127.6 kcal
change_log:
- timestamp: 2025-10-31T00:00:00+0000
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial entry from OpenFoodFacts data with micronutrient estimation from whey concentrate profiles
  fields_changed: [all fields]
  sources: [{note: 'Complete macronutrient data: 125 kcal, 22g P, 6.5g C (3.4g sugar), 1.4g F
      (1g sat), 0.5g fiber, 39mg Na', url: 'https://uk-ga.openfoodfacts.org/product/5065003325005/whey-protein-vanilla-natural-fitness-food'},
  {note: 'User-provided ingredient list: Whey Protein Concentrate (87%), Natural Flavouring
      (7%), Xanthan Gum, Steviol Glycosides, Sunflower Lecithin', url: user_input}]
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed: [derived.energy_from_macros_kcal, last_verified, notes, per_portion.carbs_available_g,
  per_portion.carbs_g, per_portion.carbs_total_g, per_portion.energy_kcal, per_portion.polyols_g,
  version]
  sources: []
- date: 2025-11-05
  updated_by: automated_migration_v1_to_v2
  change: 'Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline;
  minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty
  acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new
  fields initialized to 0.'
- timestamp: '2025-11-05T17:45:00+00:00'
  updated_by: 'Agent 2: Claude Code (Sonnet 4.5)'
  reason: 'Phase 3 enrichment: Added complete USDA nutrient data for 21 migrated fields from whey protein concentrate'
  fields_changed: [iron_mg, manganese_mg, copper_mg, selenium_ug, chromium_ug, molybdenum_ug, phosphorus_mg, chloride_mg, sulfur_mg, vitamin_a_ug, vitamin_d_ug, vitamin_e_mg, vitamin_k_ug, vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b7_ug, vitamin_b9_ug, vitamin_b12_ug, choline_mg, omega3_epa_mg, omega3_dha_mg, omega3_ala_g, omega6_la_g, boron_mg, silicon_mg, vanadium_ug, nickel_ug]
  sources: [{note: 'USDA FDC #171284 (whey protein concentrate): B vitamins (B1 0.38mg/100g, B2 1.44mg/100g, B5 2.65mg/100g, B12 1.2µg/100g), selenium 10.5µg/100g, phosphorus 585mg/100g, choline 18.5mg/100g', url: 'https://fdc.nal.usda.gov/'}, {note: 'Values scaled to 30g scoop: 87% whey protein concentrate with xanthan gum, stevia, sunflower lecithin', url: component_analysis}, {note: 'High sulfur content (180mg) typical of whey due to sulfur-containing amino acids (cysteine, methionine)', url: amino_acid_profile}]
```
