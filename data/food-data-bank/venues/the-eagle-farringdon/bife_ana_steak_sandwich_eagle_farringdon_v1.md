## Bife Ana Steak Sandwich (The Eagle, Farringdon)

```yaml
id: bife_ana_steak_sandwich_eagle_farringdon_v1
version: 3
last_verified: '2025-11-02'
source:
  venue: The Eagle, Farringdon (London)
  menu_page: https://theeaglefarringdon.co.uk/
  evidence:
  - 'Guardian recipe (Eagle cookbook): 500g steak for 2 sandwiches = 250g raw per
    sandwich'
  - 'USDA cooking yields: 80% yield for grilled sirloin (250g raw → 200g cooked)'
  - GPT-5 Pro detailed component analysis with restaurant preparation factors
aliases:
- Bife Ana
- Eagle Steak Sandwich
- Portuguese Steak Sandwich
- Rump Steak Sandwich
category: main
portion:
  description: 1 signature steak sandwich
  est_weight_g: 360
  notes: 'Portuguese-style sandwich: 200g cooked rump/sirloin in 90g crusty roll with
    onions, lettuce, marinade reduction'
assumptions:
  salt_scheme: normal
  oil_type: olive oil (marinade and pan juices soaking into bread)
  prep: 250g raw rump marinated in wine, garlic, chili, bay, parsley, oregano; seared;
    2 Tbsp olive oil from marinade + pan reduction soaked into roll; ~60g onion, 10g
    lettuce; restaurant seasoning ~1.5% of meat weight
per_portion:
  energy_kcal: 853.7
  protein_g: 69.4
  fat_g: 39.5
  sat_fat_g: 8.5
  mufa_g: 24.3
  pufa_g: 3.3
  trans_fat_g: 0.0
  cholesterol_mg: 164
  sugar_g: 4.8
  fiber_total_g: 3.7
  fiber_soluble_g: 1.1
  fiber_insoluble_g: 2.6
  sodium_mg: 1910
  potassium_mg: 1070
  iodine_ug: 0
  magnesium_mg: 65
  calcium_mg: 45
  iron_mg: 5.5
  zinc_mg: 8.5
  vitamin_c_mg: 3
  manganese_mg: 0
  polyols_g: 0.0
  carbs_available_g: 53.3
  carbs_total_g: 57.0
derived:
  salt_g_from_sodium: = per_portion.sodium_mg * 2.5 / 1000
quality:
  confidence: medium
  gaps:
  - No official nutritional data from venue
  - Menu changes daily - availability not guaranteed
  - Micronutrient estimates from component ingredients
  - 'Sodium varies by chef seasoning style: light 1,420mg, base 1,910mg, heavy 2,400mg'
  - Actual portion may vary
notes:
- London's first gastropub (est. 1991) - legendary signature dish
- 'Menu chalked daily, changes twice per day - call ahead to confirm availability:
  020 7837 1353'
- 'Component breakdown (base case): 200g cooked sirloin (366 kcal, 61g P, 11.6g F),
  90g Portuguese roll (235 kcal, 47g C, 8g P), 2 Tbsp olive oil (238 kcal, 27g F),
  60g onion + 10g lettuce (25 kcal, 6-7g C)'
- 'Marinade: onion, garlic, dried chili, bay leaf, parsley, oregano, red wine, olive
  oil'
- 'Cooking method: steak marinated several hours, seared in very hot pan, pan juices
  reduced and soaked into bread'
- 'Fat profile: olive oil-forward with MUFA ~24.3g (62% of total fat), PUFA ~3.3g,
  saturated ~8.5g'
- 'Sodium variability: Light seasoning (1.0% meat) = 1,420mg; Base (1.5%) = 1,910mg;
  Heavy (2.0%) = 2,400mg'
- Bread contributes ~310mg sodium baseline; most sodium from chef's salt seasoning
- 'Fiber: ~2.4-2.9g insoluble from roll, ~0.8-1.3g soluble from onion'
- 'High protein meal: 69.4g = 41% of 170g daily target'
- 'Sodium warning: Base case at 83% of 2,300mg daily limit; heavy seasoning would
  exceed limit'
- 'Potassium: 1,070mg = 27% of 4,000mg target (pair with K-rich sides to boost)'
- Portuguese-inspired preparation (Bife Ana = beef version of traditional pork bifana)
- The sauce/reduction is where most extra oil and salt enter the sandwich
- 'Atwater check (available carb basis): 4×69.4 + 9×39.5 + 4×53.3 + 2×3.7 + 2.4×0.0
  = 853.7 kcal'
change_log:
- timestamp: 2025-11-01T08:45:00+0000
  updated_by: Claude Code (Sonnet 4.5)
  reason: Initial entry for The Eagle's signature steak sandwich - user planning visit
    to venue
  fields_changed:
  - all fields
  sources:
  - url: https://theeaglefarringdon.co.uk/
    note: Official venue website
  - url: https://gastroportugal.com/prego-no-pao/
    note: Portuguese steak sandwich nutritional baseline (~715 kcal)
  - url: https://fdc.nal.usda.gov/
    note: USDA FoodData Central for rump steak, bread, olive oil component values
  - url: user_request
    note: User researching for upcoming visit on 2025-11-01
- timestamp: 2025-11-01T09:35:00+0000
  updated_by: Claude Code (Sonnet 4.5)
  reason: Updated with GPT-5 Pro detailed analysis - significantly more accurate than
    initial estimate
  fields_changed:
  - version
  - per_portion.energy_kcal
  - per_portion.protein_g
  - per_portion.fat_g
  - per_portion.sat_fat_g
  - per_portion.mufa_g
  - per_portion.pufa_g
  - per_portion.carbs_g
  - per_portion.sugar_g
  - per_portion.fiber_total_g
  - per_portion.fiber_soluble_g
  - per_portion.fiber_insoluble_g
  - per_portion.sodium_mg
  - per_portion.potassium_mg
  - per_portion.cholesterol_mg
  - per_portion.trans_fat_g
  - quality.confidence
  - quality.gaps
  - portion.est_weight_g
  - assumptions.prep
  sources:
  - url: https://www.theguardian.com/lifeandstyle/2010/sep/25/portuguese-steak-sandwich-recipe
    note: 'Guardian published Eagle cookbook recipe: 500g steak for 2 sandwiches'
  - url: https://www.ars.usda.gov/ARSUserFiles/80400525/Data/retn/retn06.pdf
    note: 'USDA cooking yields: 80% for grilled sirloin'
  - url: gpt5_pro_analysis
    note: 'GPT-5 Pro component-based analysis: 200g cooked sirloin + 90g roll + 2
      Tbsp oil + onion/lettuce + restaurant salt seasoning. Major corrections: calories
      750→866, sodium 650→1,910mg, protein 55→69.4g'
- timestamp: '2025-11-02T19:20:00+00:00'
  updated_by: 'LLM: GPT-5 Codex'
  reason: Standardise carbohydrate fields and recompute available-carb energy
  fields_changed:
  - last_verified
  - notes
  - per_portion.carbs_available_g
  - per_portion.carbs_g
  - per_portion.carbs_total_g
  - per_portion.energy_kcal
  - per_portion.polyols_g
  - version
  sources: []
```
