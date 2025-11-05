## Crispbread with Smoked Trout

```yaml
id: crispbread_smoked_trout_18g_homemade_v1
version: 1
schema_version: 2
last_verified: 2025-11-05
source:
  venue: Homemade / Prepared at Home
  menu_page: ""
  evidence: []   # list of URLs or short notes
aliases: []
category: ingredient
portion:
  description: "1 topped crispbread (5g crispbread + 13g smoked trout)"
  est_weight_g: 18
  notes: "Composite: 5g Amisa buckwheat crispbread + 13g Daylesford smoked trout + sprinkle of salt (80mg sodium)"
assumptions:
  salt_scheme: "normal"  # light|normal|heavy|unsalted
  oil_type: ""
  prep: "Crispbread topped with cold smoked trout, seasoned with additional salt"
  nutrient_estimation: "Component-based: summed nutrients from enriched source files (crispbread 5g + smoked trout 13g scaled from 80g)"
per_portion:
  energy_kcal: 43.5
  protein_g: 3.3
  fat_g: 1.8
  sat_fat_g: 0.3
  mufa_g: 0.5
  pufa_g: 1.0
  trans_fat_g: 0.0
  cholesterol_mg: 8
  carbs_total_g: 3.8
  carbs_available_g: 3.4
  sugar_g: 0.1
  fiber_total_g: 0.4
  fiber_soluble_g: 0.1
  fiber_insoluble_g: 0.3
  polyols_g: 0.0
  sodium_mg: 182
  potassium_mg: 75
  iodine_ug: 3.2
  magnesium_mg: 17
  calcium_mg: 4
  iron_mg: 0.25
  zinc_mg: 0.23
  vitamin_c_mg: 0
  manganese_mg: 0.21
  copper_mg: 0.05
  selenium_ug: 2.0
  vitamin_d_ug: 0.5
  vitamin_e_mg: 0.042
  omega3_ala_g: 0.006
  omega3_dha_mg: 104.0
  omega3_epa_mg: 52.0
  omega6_la_g: 0.04
  chloride_mg: 0
  phosphorus_mg: 48.7
  sulfur_g: 0
  chromium_ug: 0
  molybdenum_ug: 0
  boron_mg: 0
  nickel_ug: 0
  silicon_mg: 0
  vanadium_ug: 0
  vitamin_a_ug: 2.2
  vitamin_k_ug: 0.36
  choline_mg: 11.2
  vitamin_b1_mg: 0.067
  vitamin_b2_mg: 0.052
  vitamin_b3_mg: 0.89
  vitamin_b5_mg: 0.23
  vitamin_b6_mg: 0.055
  vitamin_b7_ug: 0.9
  vitamin_b9_ug: 4.4
  vitamin_b12_ug: 1.0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high  # low|medium|high
  gaps:
  - "Ultra-trace minerals (chromium, molybdenum, boron, silicon, vanadium, nickel) not available in USDA data"
  - "Fiber split (soluble/insoluble) estimated from crispbread component"
notes:
- "**Component Breakdown (per topped crispbread):**"
- "1. Amisa buckwheat crispbread: 5g (from amisa_buckwheat_crispbread_5g_v1)"
- "2. Daylesford smoked trout: 13g (scaled from daylesford_smoked_trout_80g_v1 at 13/80 = 0.1625)"
- "3. Added sea salt: ~80mg sodium (sprinkle per crispbread)"
- "**Weight Calculation Rationale:**"
- "Based on Nov 3 log pattern: 4 crispbreads with 40g trout and 75g avocado combined"
- "This suggests ~10g trout per crispbread minimum when including avocado"
- "Conservative estimate of 13g trout per crispbread for trout-only version (no avocado)"
- "Total weight: 5g (crispbread) + 13g (trout) = 18g per portion"
- "**Sodium Calculation:**"
- "User noted 'sprinkle of salt' added to each of 3 crispbreads"
- "Estimated total added salt for 3 portions: ~240mg sodium"
- "Per portion: 240mg ÷ 3 = 80mg added sodium"
- "Total sodium: 24mg (crispbread) + 78mg (13g trout) + 80mg (added salt) = 182mg"
- "**Nutrition Calculations:**"
- "Crispbread (5g): All values from amisa_buckwheat_crispbread_5g_v1"
- "Smoked trout (13g): All values scaled from 80g portion by factor 0.1625"
- "  - Energy: 161.4 kcal × 0.1625 = 26.2 kcal"
- "  - Protein: 17.4g × 0.1625 = 2.8g"
- "  - Fat: 10.2g × 0.1625 = 1.7g (sat 0.3g, MUFA 0.4g, PUFA 1.0g)"
- "  - Sodium: 480mg × 0.1625 = 78mg"
- "  - Potassium: 280mg × 0.1625 = 46mg"
- "  - Other minerals scaled proportionally"
- "Added salt: +80mg sodium only"
- "**Combined Totals:**"
- "Energy: 17.3 + 26.2 = 43.5 kcal"
- "Protein: 0.5 + 2.8 = 3.3g | Fat: 0.1 + 1.7 = 1.8g | Carbs: 3.8 + 0.0 = 3.8g"
- "Sodium: 24 + 78 + 80 = 182mg (equivalent to 0.46g salt)"
- "Atwater validation: 4×3.3 + 9×1.8 + 4×3.4 + 2×0.4 = 43.8 kcal ✓"
- "**Nutritional Profile:**"
- "Good source of complete protein (3.3g) from smoked trout"
- "Low calorie, nutrient-dense combination"
- "Gluten-free buckwheat base"
- "Omega-3 rich: 156mg total EPA+DHA (52mg EPA, 104mg DHA) from smoked trout"
- "High fiber from buckwheat (0.4g per portion)"
- "Moderate sodium (182mg) - includes naturally occurring + added salt"
- "Rich in B vitamins from trout: B12 (1.0µg), B3 (0.89mg), B1 (0.067mg), B2 (0.052mg), B6 (0.055mg)"
- "Good source of vitamin D (0.5µg) and choline (11.2mg) from trout"
- "Contains selenium (2.0µg), phosphorus (48.7mg), and iodine (3.2µg)"
change_log:
- timestamp: "2025-11-05T00:00:00+00:00"
  updated_by: "Claude Code (Sonnet 4.5)"
  reason: "Initial creation of homemade composite recipe - crispbread with smoked trout"
  fields_changed:
  - all fields
  sources:
  - url: "amisa_buckwheat_crispbread_5g_v1"
    note: "Nutrition data for 5g buckwheat crispbread component"
  - url: "daylesford_smoked_trout_80g_v1"
    note: "Nutrition data for smoked trout, scaled to 13g portion"
  - url: "user_food_log_2025-11-03"
    note: "Reference pattern: 4 crispbreads with 40g trout + 75g avocado"
  - url: "user_food_log_2025-11-05"
    note: "Today's meal: 3 crispbreads with smoked trout, sprinkle of salt added"
  methodology: "Calculated composite nutrition by summing: (1) 5g crispbread nutrition directly from source, (2) 13g smoked trout scaled from 80g portion (factor 0.1625), (3) estimated 80mg added sodium from salt sprinkle. Trout portion estimate based on conservative interpretation of Nov 3 consumption pattern. Energy validated using Atwater factors."
- timestamp: "2025-11-05T16:00:00+00:00"
  updated_by: "Claude Code (Sonnet 4.5)"
  reason: "Enriched with 17 priority nutrients using component-based estimation from enriched source files"
  fields_changed:
  - vitamin_d_ug
  - choline_mg
  - iodine_ug
  - vitamin_b9_ug
  - vitamin_b12_ug
  - phosphorus_mg
  - copper_mg
  - selenium_ug
  - manganese_mg
  - vitamin_a_ug
  - vitamin_e_mg
  - vitamin_k_ug
  - vitamin_b1_mg
  - vitamin_b2_mg
  - vitamin_b3_mg
  - vitamin_b6_mg
  - omega3_epa_mg
  - omega3_dha_mg
  - quality.gaps
  - notes
  sources:
  - url: "amisa_buckwheat_crispbread_5g_v1"
    note: "Source file for crispbread component (5g): used enriched nutrient data from FDC ID 170687 (USDA buckwheat flour, whole-groat)"
  - url: "daylesford_smoked_trout_80g_v1"
    note: "Source file for smoked trout component (13g scaled from 80g): used enriched nutrient data from USDA rainbow trout profile"
  methodology: "Component-based nutrient estimation: (1) Extracted 17 priority nutrients from enriched source files amisa_buckwheat_crispbread_5g_v1 and daylesford_smoked_trout_80g_v1. (2) Scaled smoked trout nutrients from 80g to 13g (factor: 0.1625). (3) Summed nutrients from both components: crispbread (5g) + smoked trout (13g). Key nutrients: Omega-3 EPA (52mg) and DHA (104mg) from trout; B vitamins (B12: 1.0µg, B3: 0.89mg) from trout; vitamin D (0.5µg) from trout; phosphorus (48.7mg) and selenium (2.0µg) from both components; choline (11.2mg) primarily from trout. Component files were previously enriched with USDA FoodData Central data."
- timestamp: "2025-11-05T20:00:00+00:00"
  updated_by: "Claude Code (Sonnet 4.5)"
  reason: "Phase 2 enrichment: Added 8 critical nutrients using REAL USDA values from enriched component files. FIXED incorrect mineral summations from previous enrichment."
  fields_changed:
  - vitamin_b5_mg (0 → 0.23)
  - vitamin_b7_ug (0 → 0.9)
  - omega3_ala_g (0 → 0.006)
  - omega6_la_g (0 → 0.04)
  - calcium_mg (2 → 4, CORRECTED sum)
  - magnesium_mg (4 → 17, CORRECTED sum)
  - potassium_mg (46 → 75, CORRECTED sum)
  - iron_mg (0.0 → 0.25, CORRECTED sum)
  - zinc_mg (0.1 → 0.23, CORRECTED sum)
  sources:
  - url: "amisa_buckwheat_crispbread_5g_v1"
    note: "Crispbread 5g: B5=0.022mg, B7=0µg, ALA=0.004g, LA=0.035g, Ca=2mg, Mg=13mg, K=29mg, Fe=0.20mg, Zn=0.16mg"
  - url: "daylesford_smoked_trout_80g_v1"
    note: "Trout 13g (scaled from 80g × 0.1625): B5=0.208mg, B7=0.91µg, ALA=0.0016g, LA=0.0097g, Ca=1.6mg, Mg=3.9mg, K=45.5mg, Fe=0.049mg, Zn=0.065mg"
  methodology: "Component-based summation: Buckwheat (5g) + Smoked trout (13g from 80g portion). Calculations: B5: 0.022+0.208=0.23mg; B7: 0+0.91=0.9µg (biotin from fish); ALA: 0.004+0.0016=0.006g; LA: 0.035+0.0097=0.04g; Ca: 2+1.6=4mg; Mg: 13+3.9=17mg; K: 29+45.5=75mg; Fe: 0.20+0.049=0.25mg; Zn: 0.16+0.065=0.23mg. Previous enrichment had incomplete mineral summations - now corrected with proper component addition."
```
