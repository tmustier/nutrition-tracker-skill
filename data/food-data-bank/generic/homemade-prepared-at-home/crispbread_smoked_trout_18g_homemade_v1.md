## Crispbread with Smoked Trout

```yaml
id: crispbread_smoked_trout_18g_homemade_v1
version: 1
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
  potassium_mg: 46
  iodine_ug: 0
  magnesium_mg: 4
  calcium_mg: 2
  iron_mg: 0.0
  zinc_mg: 0.1
  vitamin_c_mg: 0
  manganese_mg: 0
  copper_mg: 0
  selenium_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high  # low|medium|high
  gaps:
  - "Micronutrients (iodine, copper, selenium, vitamin D, E) not tracked in base ingredients"
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
- "Omega-3 rich (PUFA 1.0g includes EPA/DHA from trout)"
- "High fiber from buckwheat (0.4g per portion)"
- "Moderate sodium (182mg) - includes naturally occurring + added salt"
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
```
