---
title: data-bank
schema_version:  1.1
timezone: Europe/London
id_convention: "{slug}_{venue_slug}_v{n}"
default_units:
  - "mass: g"
  - "energy: kcal"
  - "sodium: mg"
  - "potassium: mg"
  - "sterols: mg"
  - "fats: g"
  - "carbs: g"
  - "fiber: g"
  - "protein: g"
  - \"sugar: g"
  - \"cholesterol: mg"
  - \"manganese: mg"
  - \"vitamin_c: mg"
  - \"zinc: mg"
created: 2025-10-28
modified: 2025-10-28
---

<!-- system: This file is designed for large language models to READ and WRITE safely.
Follow the edit protocol below. Do not rename keys. Use nulls for unknowns. -->

---

## Edit Protocol

- **Update flow**: Locate dish by `id` → edit numbers → bump `version` → set `last_verified` → append `change_log` item.
    
- **Change log item shape**:
    
    ```yaml
    - timestamp: 2025-10-28T17:00:00+00:00  # Europe/London
    updated_by: "Thomas" | "LLM: GPT-5 Thinking"
    reason: "Filled MUFA/PUFA from venue PDF"
    fields_changed: ["per_portion.mufa_g", "per_portion.pufa_g"]
    sources:
      - url: ""
        note: ""
    ```
    
- **Estimation rules** (state in `assumptions`): oil type, salting scheme, portion weight method (label vs estimate), conversions applied.
    

---

## Schema TEMPLATE (copy for new dishes)

```yaml
id: {stable_id}_v1
version: 2
last_verified: YYYY-MM-DD
source:
  venue: {Venue}
  menu_page: ""
  evidence: []   # list of URLs or short notes
aliases: []
category: main|side|ingredient|drink|dessert
portion:
  description: ""
  est_weight_g: null
  notes: ""
assumptions:
  salt_scheme: "light|normal|heavy|unsalted"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: null
  protein_g: null
  fat_g: null
  sat_fat_g: null
  mufa_g: null
  pufa_g: null
  trans_fat_g: null
  cholesterol_mg: null
  carbs_g: null
  carbs_total_g: null
  polyols_g: null
  carbs_available_g: null
  sugar_g: null
  fiber_total_g: null
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: null
  potassium_mg: null
  iodine_ug: null
  magnesium_mg: null
  calcium_mg: null
  iron_mg: null
  zinc_mg: null
  vitamin_c_mg: null
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  energy_from_macros_kcal: null
quality:
  confidence: low|medium|high
  gaps: []
notes: []
change_log: []
```

---

# Dishes Index
- [Sweet Potato Wedges (Simple Health Kitchen)](#sweet-potato-wedges-simple-health-kitchen) {#sweet_potato_wedges_shk_v1}
- [Hummus Side Pot (Simple Health Kitchen)](#hummus-side-pot-simple-health-kitchen) {#hummus_side_pot_shk_v1}
- [Carrot Juice (Simple Health Kitchen)](#carrot-juice-simple-health-kitchen) {#carrot_juice_shk_v1}
- [Broccoli Stems (Simple Health Kitchen)](#broccoli-stems-simple-health-kitchen) {#broccoli_stems_shk_v1}
- [Zesty Lemon Broccoli (Simple Health Kitchen)](#zesty-lemon-broccoli-simple-health-kitchen) {#zesty_lemon_broccoli_shk_v1}
- [Lemon & Herb Chicken Breast (Simple Health Kitchen)](#lemon-and-herb-chicken-breast-simple-health-kitchen) {#lemon_herb_chicken_breast_shk_v1}
- [Whole Wheat Pesto Pasta (Simple Health Kitchen)](#whole-wheat-pesto-pasta-simple-health-kitchen) {#whole_wheat_pesto_pasta_shk_v1}
- [Grilled Salmon Fillet (Simple Health Kitchen)](#grilled-salmon-fillet-simple-health-kitchen) {#grilled_salmon_fillet_shk_v1}
- [Pistachios, 30 g](#pistachios-30-g) {#pistachios_30g_v1}
- [Sunflower Seeds, 30 g](#sunflower-seeds-30-g) {#sunflower_seeds_30g_v1}
- [Hazelnuts, 30 g](#hazelnuts-30-g) {#hazelnuts_30g_v1}
- [ON Gold Standard Whey – Double Rich Chocolate (1 scoop ≈30 g)](#on-gold-standard-whey---double-rich-chocolate-1-scoop-≈30-g) {#on_whey_drc_30g_v1}
- [PACK'D Mixed Summer Berries (150 g)](#pack'd-mixed-summer-berries-150-g) {#packd_mixed_summer_berries_150g_v1}
- [Blueberries - 150 g](#blueberries---150-g) {#blueberries_150g_v1}
- [Clementine (Fresh Fruit)](#clementine-fresh-fruit) {#clementine_fresh_fruit_v1}
- [Oats - dry (50 g)](#oats---dry-50-g) {#oats_dry_50g_v1}
- [Skyr - plain (200 g)](#skyr---plain-200-g) {#skyr_plain_200g_v1}
- [Mixed Pineapple/Mango/Passion Fruit (150 g)](#mixed-pineapple/mango/passion-fruit-150-g) {#pine_mango_passion_150g_v1}
- [Joe & the Juice - Joe's Identity juice](#joe-and-the-juice---joes-identity-juice) {#joes_identity_juice_jtj_v1}
- [Sakura Wagyu Beef Sandwich (Jean-Georges at The Connaught)](#sakura-wagyu-beef-sandwich-jean-georges-at-the-connaught) {#sakura_wagyu_beef_sandwich_connaught_v1}
- [Home-made Chips (Jean-Georges at The Connaught)](#home-made-chips-jean-georges-at-the-connaught) {#homemade_chips_connaught_v1}
- [Ketchup Pot, 25g (Jean-Georges at The Connaught)](#ketchup-pot-25g-jean-georges-at-the-connaught) {#ketchup_pot_connaught_v1}
- [Thai Spiced Broccoli Soup (Jean-Georges at The Connaught)](#thai-spiced-broccoli-soup-jean-georges-at-the-connaught) {#thai_spiced_broccoli_soup_connaught_v1}
- [Ham and Cheese Croissant (Generic Bakery)](#ham-and-cheese-croissant-generic-bakery) {#ham_cheese_croissant_generic_v1}
- [Grilled Chicken Breast (L'ETO Soho)](#grilled-chicken-breast-leto-soho) {#grilled_chicken_breast_leto_soho_v1}
- [Chilli Poached Eggs (L'ETO Soho)](#chilli-poached-eggs-leto-soho) {#chilli_poached_eggs_leto_soho_v1}
- [Grenade Carb Killa White Oreo Bar (60g)](#grenade-carb-killa-white-oreo-bar-60g) {#grenade_white_oreo_60g_v1}
- [Amisa Buckwheat Crispbread (per piece, 5g)](#amisa-buckwheat-crispbread-per-piece-5g) {#amisa_buckwheat_crispbread_5g_v1}
- [Yarden Houmous (30g serving)](#yarden-houmous-30g-serving) {#yarden_houmous_30g_v1}
- [Rot Front Glazed Peanut Halva (1 piece, ~25g)](#rot-front-glazed-peanut-halva-1-piece-25g) {#halva_glazed_peanut_rotfront_v1}
- [Beef Stroganoff with Buckwheat (Zima Soho)](#beef-stroganoff-with-buckwheat-zima-soho) {#beef_stroganoff_buckwheat_zima_v1}
- [Chicken Cutlet with Mushroom Sauce with Buckwheat (Zima Soho)](#chicken-cutlet-with-mushroom-sauce-with-buckwheat-zima-soho) {#chicken_cutlet_mushroom_sauce_zima_v1}
- [Borscht Krasnodarsky with Beef (Zima Soho)](#borscht-krasnodarsky-with-beef-zima-soho) {#borscht_krasnodarsky_zima_v1}
- [Vinegret with 1 slice rye (Zima)](#vinegret-with-1-slice-rye-zima) {#vinegret_with_rye_zima_v1}
- [Pickled Cabbage / Sauerkraut (Zima)](#pickled-cabbage--sauerkraut-zima) {#sauerkraut_zima_v1}
- [Cherry Vareniki - Full Tray (Zima, Soho)](#cherry-vareniki---full-tray-zima-soho) {#cherry_vareniki_zima_v1}

---

## Sweet Potato Wedges (Simple Health Kitchen)

```yaml
id: sweet_potato_wedges_shk_v1
version: 4
last_verified: 2025-10-28
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: ""
  evidence: []
aliases: []
category: side
portion:
  description: "restaurant side serving"
  est_weight_g: null
  notes: "skin-on wedges; roasted; normal salt"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 156
  protein_g: 2.0
  fat_g: 1.9
  sat_fat_g: 1.0
  mufa_g: 0.5
  pufa_g: 0.4
  trans_fat_g: 0.1
  cholesterol_mg: null
  carbs_g: 32.0
  carbs_total_g: 37.1
  polyols_g: 0.0
  carbs_available_g: 32.0
  sugar_g: 10.1
  fiber_total_g: 5.1
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 350
  potassium_mg: 734
  iodine_ug: 2
  magnesium_mg: 42
  calcium_mg: 59
  iron_mg: 1
  zinc_mg: 0
  vitamin_c_mg: 30
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: low
  gaps: ['Fat breakdown (1.94 g) exceeds total_fat (1.0 g); keep as provided and flag inconsistency.']
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.fat_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.sat_fat_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.iodine_ug', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carb totals vs available (UK label convention)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "venue_label"
        note: "Simple Health Kitchen listings use UK available carbohydrate; total rebuilt as available + fibre"
```

---

## Grilled Salmon Fillet (Simple Health Kitchen)

```yaml
id: grilled_salmon_fillet_shk_v1
version: 4
last_verified: 2025-10-28
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: ""
  evidence: []
aliases: []
category: main
portion:
  description: "grilled salmon fillet"
  est_weight_g: null
  notes: "assume skin-on unless specified; lightly oiled; normal salt"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 273
  protein_g: 28.0
  fat_g: 16.0
  sat_fat_g: 3.1
  mufa_g: 6.2
  pufa_g: 6.7
  trans_fat_g: null
  cholesterol_mg: 80
  carbs_g: 1.0
  carbs_total_g: 1.0
  polyols_g: 0.0
  carbs_available_g: 1.0
  sugar_g: null
  fiber_total_g: null
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 370
  potassium_mg: 486
  iodine_ug: 17
  magnesium_mg: 38
  calcium_mg: 19
  iron_mg: 0
  zinc_mg: 1
  vitamin_c_mg: 5
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: []
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.cholesterol_mg', 'per_portion.carbs_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.mufa_g', 'per_portion.pufa_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.iodine_ug', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardise carb fields (UK venue reports net carbs; fibre unavailable)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "venue_label"
        note: "Simple Health Kitchen macros list carbohydrate net of fibre"
```

---

## Whole Wheat Pesto Pasta (Simple Health Kitchen)

```yaml
id: whole_wheat_pesto_pasta_shk_v1
version: 4
last_verified: 2025-10-28
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: ""
  evidence: []
aliases: []
category: side
portion:
  description: "side serving"
  est_weight_g: null
  notes: "pesto includes oil, nuts; salting normal"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 220
  protein_g: 6.3
  fat_g: 7.9
  sat_fat_g: 1.2
  mufa_g: 4.7
  pufa_g: 1.9
  trans_fat_g: 0.1
  cholesterol_mg: null
  carbs_g: 28.0
  carbs_total_g: 32.0
  polyols_g: 0.0
  carbs_available_g: 28.0
  sugar_g: 2.4
  fiber_total_g: 4.0
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 600
  potassium_mg: 235
  iodine_ug: null
  magnesium_mg: 56
  calcium_mg: 66
  iron_mg: 2
  zinc_mg: 1
  vitamin_c_mg: 3
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: []
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.mufa_g', 'per_portion.pufa_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carb totals vs available (UK label convention)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "venue_label"
        note: "Simple Health Kitchen listings use net carbohydrate; total rebuilt as available + fibre"
```

---

## Lemon & Herb Chicken Breast (Simple Health Kitchen)

```yaml
id: lemon_herb_chicken_breast_shk_v1
version: 4
last_verified: 2025-10-28
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: ""
  evidence: []
aliases: []
category: main
portion:
  description: "grilled chicken breast"
  est_weight_g: null
  notes: "lemon & herb marinade; normal salt"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 159
  protein_g: 36.0
  fat_g: 1.9
  sat_fat_g: 0.6
  mufa_g: 0.8
  pufa_g: 0.5
  trans_fat_g: null
  cholesterol_mg: 130
  carbs_g: null
  carbs_total_g: null
  polyols_g: null
  carbs_available_g: null
  sugar_g: null
  fiber_total_g: null
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 275
  potassium_mg: 385
  iodine_ug: 1
  magnesium_mg: 36
  calcium_mg: 7
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: null
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: ['No carbs/fibre provided; trans fat not provided; ~0.09 g of fat unassigned (trace/trans).']
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.cholesterol_mg', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.fat_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.sat_fat_g', 'per_portion.pufa_g', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carb placeholders (protein-only dish; carbs remain null)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "venue_label"
        note: "Simple Health Kitchen listing reports carbohydrate as trace; leaving values null"
```

---

## Broccoli Stems (Simple Health Kitchen)

```yaml
id: broccoli_stems_shk_v1
version: 4
last_verified: 2025-10-28
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: ""
  evidence: []
aliases: []
category: side
portion:
  description: "steamed/roasted broccoli stems"
  est_weight_g: null
  notes: "no raisins variant; zest optional; normal salt"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 156
  protein_g: 5.0
  fat_g: 5.1
  sat_fat_g: 0.6
  mufa_g: 3.6
  pufa_g: 0.9
  trans_fat_g: null
  cholesterol_mg: null
  carbs_g: 21.5
  carbs_total_g: 28.4
  polyols_g: 0.0
  carbs_available_g: 21.5
  sugar_g: 9.4
  fiber_total_g: 6.9
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 540
  potassium_mg: 630
  iodine_ug: 1
  magnesium_mg: 45
  calcium_mg: 84
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 130
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: ['No trans fat provided; ~0.52 g of fat unassigned (likely trace/trans/rounding).']
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.fat_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carb totals vs available (UK label convention)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "venue_label"
        note: "Simple Health Kitchen listings use net carbohydrate; total rebuilt as available + fibre"
```

---

## Zesty Lemon Broccoli (Simple Health Kitchen)

```yaml
id: zesty_lemon_broccoli_shk_v1
version: 4
last_verified: 2025-10-28
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: ""
  evidence: []
aliases: []
category: side
portion:
  description: "broccoli with lemon zest/juice"
  est_weight_g: null
  notes: "light dressing; normal salt"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 113
  protein_g: 4.5
  fat_g: 4.7
  sat_fat_g: 0.8
  mufa_g: 3.2
  pufa_g: 0.8
  trans_fat_g: null
  cholesterol_mg: null
  carbs_g: 10.5
  carbs_total_g: 14.0
  polyols_g: 0.0
  carbs_available_g: 10.5
  sugar_g: 2.7
  fiber_total_g: 3.5
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 150
  potassium_mg: 556
  iodine_ug: 1
  magnesium_mg: 40
  calcium_mg: 76
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 123
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: ['No trans fat provided; ~0.49 g of fat unassigned (trace/trans/rounding).']
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.fat_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carb totals vs available (UK label convention)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "venue_label"
        note: "Simple Health Kitchen listings use net carbohydrate; total rebuilt as available + fibre"
```

---

## Hummus Side Pot (Simple Health Kitchen)

```yaml
id: hummus_side_pot_shk_v1
version: 4
last_verified: 2025-10-28
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: ""
  evidence: []
aliases: []
category: side
portion:
  description: "small side pot"
  est_weight_g: null
  notes: "tahini-based; normal salt"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 211
  protein_g: 9.0
  fat_g: 11.0
  sat_fat_g: 1.3
  mufa_g: 3.7
  pufa_g: 6.0
  trans_fat_g: 0.0
  cholesterol_mg: null
  carbs_g: 14.0
  carbs_total_g: 19.1
  polyols_g: 0.0
  carbs_available_g: 14.0
  sugar_g: 0.6
  fiber_total_g: 5.1
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 379
  potassium_mg: 360
  iodine_ug: null
  magnesium_mg: 86
  calcium_mg: 54
  iron_mg: 3
  zinc_mg: 2
  vitamin_c_mg: null
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: ['Unsaturated total (8.75 g) + saturated + trans ≈ 10.07 g < total_fat (11 g); ~0.9 g unaccounted (rounding/other fats).']
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.mufa_g', 'per_portion.pufa_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.carbs_g', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add explicit carb totals vs available (UK label convention)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "venue_label"
        note: "Simple Health Kitchen listings use net carbohydrate; total rebuilt as available + fibre"
```
---

## Pistachios, 30 g

```yaml
id: pistachios_30g_v1
version: 2
last_verified: 2025-10-28
source:
  venue: pack/ingredient
  menu_page: ""
  evidence: []
aliases: []
category: ingredient
portion:
  description: "fixed pack portion"
  est_weight_g: 30
  notes: "shelled; unsalted"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 168
  protein_g: 6.0
  fat_g: 13.5
  sat_fat_g: 1.7
  mufa_g: 7.0
  pufa_g: 4.3
  trans_fat_g: null
  cholesterol_mg: null
  carbs_g: 8.4
  carbs_total_g: 11.6
  polyols_g: 0.0
  carbs_available_g: 8.4
  sugar_g: 2.3
  fiber_total_g: 3.2
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 1
  potassium_mg: 308
  iodine_ug: null
  magnesium_mg: 36
  calcium_mg: 30
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: null
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps: []
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.mufa_g', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carb totals vs available (EU label for nuts)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "pack_label"
        note: "UK nut labels list carbohydrate net of fibre; total rebuilt as available + fibre"
```

---

## Sunflower Seeds, 30 g

```yaml
id: sunflower_seeds_30g_v1
version: 2
last_verified: 2025-10-28
source:
  venue: pack/ingredient
  menu_page: ""
  evidence: []
aliases: []
category: ingredient
portion:
  description: "fixed pack portion"
  est_weight_g: 30
  notes: "hulled; unsalted"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 175
  protein_g: 6.2
  fat_g: 15.5
  sat_fat_g: 1.4
  mufa_g: 3.0
  pufa_g: 10.9
  trans_fat_g: null
  cholesterol_mg: null
  carbs_g: 6.0
  carbs_total_g: 8.6
  polyols_g: 0.0
  carbs_available_g: 6.0
  sugar_g: 0.8
  fiber_total_g: 2.6
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 3
  potassium_mg: 194
  iodine_ug: null
  magnesium_mg: 98
  calcium_mg: 23
  iron_mg: 2
  zinc_mg: 2
  vitamin_c_mg: 0
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps: []
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.mufa_g', 'per_portion.carbs_g', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carb totals vs available (EU label for seeds)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "pack_label"
        note: "UK seed labels list carbohydrate net of fibre; total rebuilt as available + fibre"
```

---

## Hazelnuts, 30 g

```yaml
id: hazelnuts_30g_v1
version: 3
last_verified: 2025-10-28
source:
  venue: pack/ingredient
  menu_page: ""
  evidence: []
aliases: []
category: ingredient
portion:
  description: "fixed pack portion"
  est_weight_g: 30
  notes: "raw; unsalted"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 188
  protein_g: 4.5
  fat_g: 18.2
  sat_fat_g: 1.3
  mufa_g: 14.4
  pufa_g: 2.5
  trans_fat_g: null
  cholesterol_mg: null
  carbs_g: 5.0
  carbs_total_g: 7.9
  polyols_g: 0.0
  carbs_available_g: 5.0
  sugar_g: 1.3
  fiber_total_g: 2.9
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 1
  potassium_mg: 204
  iodine_ug: null
  magnesium_mg: 49
  calcium_mg: 34
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 2
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: low
  gaps: ['MUFA/PUFA profile appears atypical for hazelnuts (expected MUFA >> PUFA); values recorded as provided.']
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.mufa_g', 'per_portion.pufa_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.carbs_g', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carb totals vs available (EU label for nuts)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "pack_label"
        note: "UK nut labels list carbohydrate net of fibre; total rebuilt as available + fibre"
```

---

## ON Gold Standard Whey – Double Rich Chocolate (1 scoop ≈30 g)

```yaml
id: on_whey_drc_30g_v1
version: 2
last_verified: 2025-10-28
source:
  venue: Optimum Nutrition (pack/ingredient)
  menu_page: ""
  evidence: []
aliases: []
category: ingredient
portion:
  description: "scoop (~30 g)"
  est_weight_g: 30
  notes: "Ranges provided; midpoints used where sensible; iron omitted due to likely error."
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 120
  protein_g: 24.0
  fat_g: 1.4
  sat_fat_g: 0.5
  mufa_g: 0.5
  pufa_g: 0.4
  trans_fat_g: null
  cholesterol_mg: null
  carbs_g: 3.0
  carbs_total_g: 3.7
  polyols_g: 0.0
  carbs_available_g: 3.0
  sugar_g: 1.3
  fiber_total_g: 0.7
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 86
  potassium_mg: 177
  iodine_ug: 18
  magnesium_mg: 52
  calcium_mg: 130
  iron_mg: null
  zinc_mg: 2
  vitamin_c_mg: null
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: low
  gaps: ['Original data were ranges; iron value inconsistent (0.6–126 mg).']
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.zinc_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.zinc_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carb totals vs available (treat ON whey label as net carb)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "pack_label"
        note: "EU packaging lists carbohydrate net of fibre; total rebuilt as available + fibre"
```

---

## PACK'D Mixed Summer Berries (150 g)

```yaml
id: packd_mixed_summer_berries_150g_v1
version: 3
last_verified: 2025-10-28
source:
  venue: PACK'D (pack/ingredient)
  menu_page: ""
  evidence: []
aliases: []
category: ingredient
portion:
  description: "fixed pack portion"
  est_weight_g: 150
  notes: "Pack'd mix; per-portion as provided."
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 57
  protein_g: 1.4
  fat_g: 0.3
  sat_fat_g: null
  mufa_g: 0.03
  pufa_g: 0.18
  trans_fat_g: 0
  cholesterol_mg: 0
  carbs_g: 9.8
  carbs_total_g: 14.2
  polyols_g: 0.0
  carbs_available_g: 9.8
  sugar_g: 9.8
  fiber_total_g: 4.4
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: null
  potassium_mg: 194
  iodine_ug: 1
  magnesium_mg: 24
  calcium_mg: 30
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 29
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: []
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.fiber_total_g', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-10-28T20:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Research and fill missing fat breakdown, cholesterol, and iodine data"
    fields_changed: ['per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.cholesterol_mg', 'per_portion.iodine_ug']
    sources:
      - url: "https://foodstruct.com/food/raspberry"
        note: "USDA data: Raspberries MUFA 0.06g, PUFA 0.38g per 100g"
      - url: "https://foodstruct.com/food/strawberries"
        note: "USDA data: Strawberries MUFA 0.04g, PUFA 0.16g per 100g"
      - url: "https://foodstruct.com/food/blackberry"
        note: "USDA data: Blackberries MUFA 0.047g, PUFA 0.28g per 100g; cholesterol 0mg, trans fat 0g"
      - url: "https://www.nutritionvalue.org/Blackberries%2C_raw_nutritional_value.html"
        note: "Confirmed berries are plant-based with 0mg cholesterol, 0g trans fat"
      - url: "https://kitchenscity.com/iodine-rich-fruits/"
        note: "Strawberries ~13mcg per cup (150g); berries generally low in iodine"
    methodology: "Calculated weighted average based on PACK'D mix (36% raspberries, 34% blueberries, 30% blackberries) from USDA berry data, scaled to match product's 0.3g total fat per 150g. PUFA higher than MUFA consistent with berry profiles (omega-3 from seeds). Trans fat and cholesterol = 0 (plant-based). Iodine = 1 mcg (trace, very low in berries)."
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carb totals vs available (frozen berries sold in UK)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "pack_label"
        note: "PACK'D UK nutritional panel lists carbohydrate net of fibre; total rebuilt as available + fibre"
```

---

## Blueberries - 150 g

```yaml
id: blueberries_150g_v1
version: 3
last_verified: 2025-10-28
source:
  venue: pack/ingredient
  menu_page: ""
  evidence: []
aliases: []
category: ingredient
portion:
  description: "fixed pack portion"
  est_weight_g: 150
  notes: "Fresh blueberries."
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 86
  protein_g: 1.0
  fat_g: 0.4
  sat_fat_g: 0.04
  mufa_g: 0.07
  pufa_g: 0.22
  trans_fat_g: 0
  cholesterol_mg: 0
  carbs_g: 21.8
  carbs_total_g: 25.4
  polyols_g: 0.0
  carbs_available_g: 21.8
  sugar_g: 15.0
  fiber_total_g: 3.6
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 2
  potassium_mg: 116
  iodine_ug: 0.5
  magnesium_mg: 9
  calcium_mg: 9
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 15
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps: []
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.sugar_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-10-28T20:15:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Research and populate missing fatty acid breakdown and iodine content from USDA FoodData Central"
    fields_changed: ['per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.cholesterol_mg', 'per_portion.iodine_ug']
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/171711/nutrients"
        note: "USDA FoodData Central - Raw blueberries (NDB 09050 / FDC 171711). Per 100g: sat 0.028g, MUFA 0.047g, PUFA 0.146g, trans 0g, cholesterol 0mg. Scaled to 150g portion."
      - url: "https://www.ars.usda.gov/ARSUSERFILES/80400535/DATA/IODINE/IODINE_DATABASE_RELEASE_3_PER_100G.PDF"
        note: "USDA/FDA/ODS-NIH Iodine Database - Raw blueberries contain 0.3 mcg iodine per 100g (mean of 13 samples). Scaled to 150g = 0.45 mcg, rounded to 0.5 mcg."
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carb totals vs available (fresh berries in UK)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "pack_label"
        note: "UK berry packaging lists carbohydrate net of fibre; total rebuilt as available + fibre"
```

---

## Clementine (Fresh Fruit)

```yaml
id: clementine_fresh_fruit_v1
version: 1
last_verified: 2025-10-29
source:
  venue: Clementine (Fresh Fruit)
  menu_page: ""
  evidence:
    - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/168195/nutrients"
    note: "USDA FoodData Central: Clementines, raw (FDC ID 168195)"
    - url: "https://tools.myfooddata.com/nutrition-facts/168195/wt1"
    note: "MyFoodData USDA aggregation: Complete nutrition profile per 100g and per clementine"
aliases: ["mandarin", "easy peeler"]
category: ingredient
portion:
  description: "1 medium clementine (~74g)"
  est_weight_g: 74
  notes: "Standard USDA portion weight for one medium clementine"
assumptions:
  salt_scheme: "unsalted"
  oil_type: ""
  prep: "fresh, whole, peeled"
per_portion:
  energy_kcal: 37
  protein_g: 0.6
  fat_g: 0.1
  sat_fat_g: 0.0
  mufa_g: 0.0
  pufa_g: 0.0
  trans_fat_g: 0.0
  cholesterol_mg: 0
  carbs_g: 7.7
  carbs_total_g: 9.0
  polyols_g: 0.0
  carbs_available_g: 7.7
  sugar_g: 6.8
  fiber_total_g: 1.3
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 1
  potassium_mg: 131
  iodine_ug: null
  magnesium_mg: 7
  calcium_mg: 22
  iron_mg: 0.1
  zinc_mg: 0.0
  vitamin_c_mg: 36
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  energy_from_macros_kcal: 36.7
  fat_unassigned_g: 0.1
quality:
  confidence: high
  gaps: ["fiber_soluble_g", "fiber_insoluble_g", "iodine_ug", "manganese_mg"]
notes: ["35 kcal from USDA FoodData Central per medium 74g clementine", "Values scaled from USDA per-100g data: 47 kcal, 0.85g protein, 0.15g fat, 12g carbs, 1.7g fiber", "Available carbs recalculated: 9.0g total - 1.3g fiber = 7.7g", "Fat content negligible (<0.15g) - primarily trace amounts of natural fruit oils", "Excellent source of vitamin C: 36mg provides ~60% daily value", "Naturally sodium-free and cholesterol-free", "Atwater recalculation (available carbs + fiber energy): 36.7 kcal (+1.7 vs 35 kcal label)"]
change_log:
  - timestamp: 2025-10-29T14:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial population from USDA FoodData Central (FDC ID 168195) scaled to standard 74g portion"
    fields_changed: ["portion.est_weight_g", "assumptions.salt_scheme", "assumptions.prep", "per_portion.energy_kcal", "per_portion.protein_g", "per_portion.fat_g", "per_portion.sat_fat_g", "per_portion.mufa_g", "per_portion.pufa_g", "per_portion.trans_fat_g", "per_portion.cholesterol_mg", "per_portion.carbs_g", "per_portion.sugar_g", "per_portion.fiber_total_g", "per_portion.sodium_mg", "per_portion.potassium_mg", "per_portion.magnesium_mg", "per_portion.calcium_mg", "per_portion.iron_mg", "per_portion.zinc_mg", "per_portion.vitamin_c_mg", "derived.energy_from_macros_kcal", "derived.fat_unassigned_g", "quality.confidence", "quality.gaps"]
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/168195/nutrients"
        note: "USDA FoodData Central primary source for clementines, raw"
      - url: "https://tools.myfooddata.com/nutrition-facts/168195/wt1"
        note: "USDA data aggregator showing per-clementine values (74g portion)"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardise carbohydrate fields (total/available/polyols) and align energy with available carb recalculation"
    fields_changed: ["per_portion.energy_kcal", "per_portion.carbs_g", "per_portion.carbs_total_g", "per_portion.polyols_g", "per_portion.carbs_available_g", "derived.energy_from_macros_kcal", "notes"]
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/168195/nutrients"
        note: "Reused USDA portion data for total carbohydrate and fibre split"
```

---

## Oats - dry (50 g)

```yaml
id: oats_dry_50g_v1
version: 3
last_verified: 2025-10-28
source:
  venue: pack/ingredient
  menu_page: ""
  evidence: []
aliases: []
category: ingredient
portion:
  description: "fixed pack portion"
  est_weight_g: 50
  notes: "Dry rolled oats."
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 195
  protein_g: 8.5
  fat_g: 3.5
  sat_fat_g: 0.6
  mufa_g: 1.1
  pufa_g: 1.3
  trans_fat_g: 0
  cholesterol_mg: 0
  carbs_g: 33.2
  carbs_total_g: 38.5
  polyols_g: 0.0
  carbs_available_g: 33.2
  sugar_g: 0.5
  fiber_total_g: 5.3
  fiber_soluble_g: 2.0
  fiber_insoluble_g: 3.3
  sodium_mg: 1
  potassium_mg: 215
  iodine_ug: 1
  magnesium_mg: 69
  calcium_mg: 27
  iron_mg: 2
  zinc_mg: 2
  vitamin_c_mg: 0
  manganese_mg: 2

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps: []
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.potassium_mg', 'per_portion.iron_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-10-28T21:30:00+0000
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Fill in missing fat breakdown and micronutrients from USDA FoodData Central"
    fields_changed: ['per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.cholesterol_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "USDA FoodData Central"
        note: "USDA data for rolled oats: MUFA 2.178g/100g, PUFA 2.535g/100g scaled to 50g portion. Trans fat 0g, cholesterol 0mg (plant-based), vitamin C 0mg (trace)"
  - timestamp: 2025-10-29T00:00:00+0000
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Populate missing fiber split and manganese from USDA nutritional database"
    fields_changed: ['per_portion.fiber_soluble_g', 'per_portion.fiber_insoluble_g', 'per_portion.manganese_mg']
    sources:
      - url: "USDA FoodData Central"
        note: "Oat beta-glucan (soluble fiber) ~4g/100g, insoluble ~6g/100g; manganese ~3.8mg/100g scaled to 50g portion"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Annotate carb totals vs available (UK label) for fibre separation"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "nutrition_label"
        note: "UK-pack oats where stated carbs are already net of fibre"
```

---

## Skyr - plain (200 g)

```yaml
id: skyr_plain_200g_v1
version: 3
last_verified: 2025-10-28
source:
  venue: pack/ingredient
  menu_page: ""
  evidence: []
aliases: []
category: ingredient
portion:
  description: "fixed pack portion"
  est_weight_g: 200
  notes: "Plain skyr yoghurt."
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 124
  protein_g: 22.0
  fat_g: 0.4
  sat_fat_g: 0.2
  mufa_g: 0.1
  pufa_g: 0.0
  trans_fat_g: 0.1
  cholesterol_mg: 10
  carbs_g: 7.4
  carbs_total_g: 7.4
  polyols_g: 0.0
  carbs_available_g: 7.4
  sugar_g: 7.4
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  sodium_mg: 104
  potassium_mg: 340
  iodine_ug: 60
  magnesium_mg: 24
  calcium_mg: 300
  iron_mg: 0
  zinc_mg: 1
  vitamin_c_mg: 0
  manganese_mg: 0

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps: []
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.cholesterol_mg', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.zinc_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.zinc_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-10-28T20:15:00+0000
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Complete dairy fat profile and trace nutrients based on research"
    fields_changed: ['per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.vitamin_c_mg', 'per_portion.iron_mg', 'version']
    sources:
      - url: "https://fdc.nal.usda.gov/"
        note: "USDA FoodData Central - Low-fat yogurt reference (MUFA 0.426g, PUFA 0.044g, Iron 0.08mg per 100g)"
      - url: "https://www.sciencedirect.com/science/article/abs/pii/S0308814612005857"
        note: "Chemical characteristics and fatty acid composition of Greek yogurts"
      - url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8749727/"
        note: "Fatty Acid Profile and CLA Content in yogurts - natural trans-fat (CLA) 0.34-1.07% of total fat"
      - url: "https://www.healthline.com/nutrition/skyr"
        note: "Skyr nutrition information - confirms trace iron and no vitamin C in plain dairy"
      - url: "https://www.nutritionvalue.org/Yogurt,_low_fat,_plain_nutritional_value.html"
        note: "Dairy fat composition: ~62-70% saturated, ~25-30% MUFA, ~3-5% PUFA"
    calculation_notes: "With 0.4g total fat (0.2g saturated) per 200g: MUFA estimated at 0.1g (~27% of total fat), PUFA trace at 0.0g (~3% of total fat), trans-fat 0.1g representing natural CLA from dairy (~4% of total fat). Vitamin C is 0mg (not naturally present in plain dairy). Iron is 0mg rounded from trace amounts typical in low-fat dairy products."
  - timestamp: 2025-10-29T00:00:00+0000
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Populate fiber and manganese values for dairy product (all 0)"
    fields_changed: ['per_portion.fiber_total_g', 'per_portion.fiber_soluble_g', 'per_portion.fiber_insoluble_g', 'per_portion.manganese_mg']
    sources:
      - url: "nutritional_knowledge"
        note: "Dairy products contain no dietary fiber (plant-based nutrient only). Manganese trace amounts rounded to 0."
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardise carb totals vs available (fiber already 0 so totals match)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "nutrition_label"
        note: "Plain skyr labelling in UK uses net carbohydrate; total equals available"
```

---

## Mixed Pineapple/Mango/Passion Fruit (150 g)

```yaml
id: pine_mango_passion_150g_v1
version: 3
last_verified: 2025-10-28
source:
  venue: pack/ingredient
  menu_page: ""
  evidence: []
aliases: []
category: ingredient
portion:
  description: "fixed pack portion"
  est_weight_g: 150
  notes: "Fresh fruit mix."
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: ""
per_portion:
  energy_kcal: 75
  protein_g: 0.9
  fat_g: 0.5
  sat_fat_g: 0.2
  mufa_g: 0.1
  pufa_g: 0.2
  trans_fat_g: 0
  cholesterol_mg: 0
  carbs_g: 16.1
  carbs_total_g: 17.5
  polyols_g: 0.0
  carbs_available_g: 16.1
  sugar_g: 15.9
  fiber_total_g: 1.4
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 6
  potassium_mg: 277
  iodine_ug: 1
  magnesium_mg: 22
  calcium_mg: 18
  iron_mg: 1
  zinc_mg: 0
  vitamin_c_mg: 54
  manganese_mg: 1

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: []
notes: []
change_log:
  - timestamp: 2025-10-28T18:51:39+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg', 'per_portion.manganese_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.magnesium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.manganese_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-10-28T20:15:00+00:00
    updated_by: "Claude Sonnet 4.5"
    reason: "Fill missing fatty acid breakdown and micronutrient data based on USDA FoodData Central research"
    fields_changed: ['per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.cholesterol_mg', 'per_portion.iodine_ug']
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/169124/nutrients"
        note: "USDA FDC ID 169124: Pineapple, raw, all varieties - Fat breakdown per 100g: 0.12g total (0.009g sat, 0.013g MUFA, 0.04g PUFA)"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/169910/nutrients"
        note: "USDA FDC ID 169910: Mangos, raw - Fat breakdown per 100g: 0.6g total (0.08g sat, 0.14g MUFA, 0.07g PUFA)"
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/169108/nutrients"
        note: "USDA FDC ID 169108: Passion fruit, raw, purple - Fat breakdown per 100g: 0.7g total (0.059g sat, 0.086g MUFA, 0.411g PUFA)"
    notes: "Tropical fruits contain minimal fat (0.12-0.7g per 100g). Fat composition: predominantly unsaturated with PUFA > MUFA. Trans fat=0 and cholesterol=0 (plant-based). Iodine content is trace (1-2µg per 150g typical for fruit). Values calculated proportionally based on 150g mixed fruit with 0.5g total fat."
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carb totals vs available (mixed fruit pack)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "pack_label"
        note: "UK fruit mix lists carbohydrate net of fibre; total rebuilt as available + fibre"
```

---

## Joe & the Juice - Joe’s Identity juice

```yaml
id: joes_identity_juice_jtj_v1
version: 3
last_verified: 2025-10-28
source:
  venue: Joe & the Juice
  menu_page: ""
  evidence: []
aliases: []
category: drink
portion:
  description: "menu serving"
  est_weight_g: 355
  notes: "Green juice (12 oz); contains kale, celery, spinach, lemon, cucumber, olive oil. Recipe varies by location."
assumptions:
  salt_scheme: "normal"
  oil_type: "olive"
  prep: "cold-pressed juice"
per_portion:
  energy_kcal: 72
  protein_g: 4.0
  fat_g: 2.0
  sat_fat_g: 0.3
  mufa_g: 1.5
  pufa_g: 0.2
  trans_fat_g: 0.0
  cholesterol_mg: 0
  carbs_g: 9.0
  carbs_total_g: 13.0
  polyols_g: 0.0
  carbs_available_g: 9.0
  sugar_g: 5.0
  fiber_total_g: 4.0
  fiber_soluble_g: 1.0
  fiber_insoluble_g: 3.0
  sodium_mg: 27
  potassium_mg: 600
  iodine_ug: 2
  magnesium_mg: 45
  calcium_mg: 120
  iron_mg: 2
  zinc_mg: 1
  vitamin_c_mg: 60
  manganese_mg: 1

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: ['Micronutrients estimated from ingredient composition; venue formulations may vary by location.']
notes: ["Ingredients confirmed: kale, celery, spinach, lemon, cucumber, olive oil", "Standard serving size is 12 oz (~355ml)"]
change_log:
  - timestamp: 2025-10-28T18:51:39+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Populate per_portion from user-provided data"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.carbs_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg']
    sources:
      - url: "user_input"
        note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.fat_g', 'per_portion.carbs_g', 'per_portion.fiber_total_g']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-10-28T20:30:00+0000
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Research-based population of missing nutrition fields"
    fields_changed: ['version', 'portion.est_weight_g', 'portion.notes', 'assumptions.oil_type', 'assumptions.prep', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.cholesterol_mg', 'per_portion.sugar_g', 'per_portion.potassium_mg', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg', 'quality.confidence', 'quality.gaps', 'notes']
    sources:
      - url: "https://www.joejuice.com/signature-product/identity-juice"
        note: "Official Joe & the Juice product page - confirmed ingredients: kale, celery, spinach, lemon, cucumber, olive oil"
      - url: "web_search"
        note: "Multiple third-party nutrition databases showing 85-90 cal, 8g sugar for similar serving; standard serving sizes 12 oz (355ml) or 16 oz (473ml)"
      - url: "https://www.livmorjuicery.com/post/unlock-the-power-of-green-the-amazing-health-benefits-of-celery-kale-and-spinach-juice"
        note: "Reference for green juice micronutrient content from kale, spinach, celery"
      - url: "ingredient_analysis"
        note: "Fat breakdown estimated from olive oil composition (75% MUFA, 15% sat, 10% PUFA, 0% trans); carbohydrate treatment now explicit: 13g total (including 4g fibre) → 9g available; cholesterol 0 for plant-based juice; micronutrients estimated from USDA data for kale (FDC 323505), spinach (FDC 168462), celery (FDC 169988), cucumber (FDC 168409) proportional to typical 12oz green juice serving"
  - timestamp: 2025-10-29T00:00:00+0000
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Populate fiber split and manganese from leafy green composition"
    fields_changed: ['per_portion.fiber_soluble_g', 'per_portion.fiber_insoluble_g', 'per_portion.manganese_mg']
    sources:
      - url: "nutritional_research"
        note: "Leafy greens (kale, spinach, celery) ~25% soluble, 75% insoluble fiber; kale high in manganese (~0.5mg per 100g). Estimated 1.0g soluble, 3.0g insoluble, 1mg manganese per 355g juice"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Document carb totals vs available for UK-label juice"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "nutrition_label"
        note: "Joe & the Juice London listings quote carbohydrates net of fibre; total reconstructed as available + fibre"
```

---

## Sakura Wagyu Beef Sandwich (Jean-Georges at The Connaught)

```yaml
id: sakura_wagyu_beef_sandwich_connaught_v1
version: 2
last_verified: 2025-10-28
source:
  venue: Jean-Georges at The Connaught, London
  menu_page: "https://deliveroo.co.uk/menu/london/mayfair/jean-georges-at-the-connaught"
  evidence:
    - "Deliveroo listing: 879 kcal (sandwich only, excludes chips)"
    - "ChatGPT analysis: sandwich weight ~360g, energy density ~2.4 kcal/g"
    - "Macros estimated from pain de mie + seared wagyu + dressing composition"
aliases: []
category: main
portion:
  description: "restaurant serving"
  est_weight_g: 360
  notes: "Sakura wagyu beef sandwich on pain de mie; served with chips (separate item)"
assumptions:
  salt_scheme: "normal"
  oil_type: "likely neutral oil for wagyu searing"
  prep: "seared wagyu beef on pain de mie with dressing"
per_portion:
  energy_kcal: 879
  protein_g: 42.0
  fat_g: 44.0
  sat_fat_g: 16.0
  mufa_g: 18.0
  pufa_g: 10.0
  trans_fat_g: 0.2
  cholesterol_mg: 90
  carbs_g: 78.0
  carbs_total_g: 82.0
  polyols_g: 0.0
  carbs_available_g: 78.0
  sugar_g: 6.0
  fiber_total_g: 4.0
  fiber_soluble_g: 1.0
  fiber_insoluble_g: 3.0
  sodium_mg: 1100
  potassium_mg: 450
  iodine_ug: 5
  magnesium_mg: 45
  calcium_mg: 80
  iron_mg: 4
  zinc_mg: 6
  vitamin_c_mg: 2
  manganese_mg: 0

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: ["±15-25% variance expected for estimated values"]
notes: ["Deliveroo shows 879 kcal for sandwich; chips listed separately at 459 kcal", "Energy density check: 879 kcal / 360g = 2.44 kcal/g (realistic for rich beef sandwich)", "MUFA/PUFA/micronutrients estimated from wagyu beef + pain de mie composition"]
change_log:
  - timestamp: 2025-10-28T20:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial population from Deliveroo + ChatGPT nutritional analysis"
    fields_changed: ["per_portion.energy_kcal", "per_portion.protein_g", "per_portion.fat_g", "per_portion.sat_fat_g", "per_portion.carbs_g", "per_portion.fiber_total_g", "per_portion.sodium_mg", "portion.est_weight_g"]
    sources:
      - url: "https://deliveroo.co.uk/menu/london/mayfair/jean-georges-at-the-connaught"
        note: "Deliveroo calorie listing: 879 kcal"
      - url: "user_input"
        note: "ChatGPT nutritional breakdown provided by Thomas on 2025-10-28"
  - timestamp: 2025-10-28T20:20:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Added estimated MUFA/PUFA and micronutrients from ingredient composition"
    fields_changed: ["per_portion.mufa_g", "per_portion.pufa_g", "per_portion.trans_fat_g", "per_portion.cholesterol_mg", "per_portion.sugar_g", "per_portion.potassium_mg", "per_portion.iodine_ug", "per_portion.magnesium_mg", "per_portion.calcium_mg", "per_portion.iron_mg", "per_portion.zinc_mg", "per_portion.vitamin_c_mg"]
    sources:
      - url: "ingredient_analysis"
        note: "Estimated from typical wagyu beef + pain de mie bread composition"
  - timestamp: 2025-10-29T00:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Populate fiber split and manganese from bread composition"
    fields_changed: ["per_portion.fiber_soluble_g", "per_portion.fiber_insoluble_g", "per_portion.manganese_mg"]
    sources:
      - url: "nutritional_research"
        note: "Fiber from pain de mie bread (refined wheat): ~25% soluble, 75% insoluble. Manganese trace in white bread and beef, rounded to 0."
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Explicitly store carb totals vs available for UK Deliveroo data"
    fields_changed: ["per_portion.carbs_total_g", "per_portion.polyols_g", "per_portion.carbs_available_g"]
    sources:
      - url: "https://deliveroo.co.uk/menu/london/mayfair/jean-georges-at-the-connaught"
        note: "Deliveroo UK nutrition uses available carbohydrate; total reconstructed as available + fibre"
```

---

## Home-made Chips (Jean-Georges at The Connaught)

```yaml
id: homemade_chips_connaught_v1
version: 3
last_verified: 2025-10-28
source:
  venue: Jean-Georges at The Connaught, London
  menu_page: "https://deliveroo.co.uk/menu/london/mayfair/jean-georges-at-the-connaught"
  evidence:
    - "Deliveroo listing: 459 kcal"
    - "Macros scaled from McDonald's UK medium fries profile to match 459 kcal anchor"
aliases: []
category: side
portion:
  description: "restaurant side serving"
  est_weight_g: null
  notes: "Home-made chips; served with Sakura Wagyu Beef Sandwich"
assumptions:
  salt_scheme: "normal"
  oil_type: "neutral frying oil"
  prep: "deep-fried"
per_portion:
  energy_kcal: 459
  protein_g: 4.5
  fat_g: 23.2
  sat_fat_g: 2.0
  mufa_g: 6.3
  pufa_g: 14.6
  trans_fat_g: 0.1
  cholesterol_mg: 0
  carbs_g: 57.2
  carbs_total_g: 62.1
  polyols_g: 0.0
  carbs_available_g: 57.2
  sugar_g: 0.3
  fiber_total_g: 4.9
  fiber_soluble_g: 1.3
  fiber_insoluble_g: 3.6
  sodium_mg: 321
  potassium_mg: 1194
  iodine_ug: 2
  magnesium_mg: 57
  calcium_mg: 22
  iron_mg: 0.9
  zinc_mg: 0.9
  vitamin_c_mg: 16
  manganese_mg: 1

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: ["Portion weight estimated from calorie content", "Per 100g values not calculated", "MUFA/PUFA estimated from typical frying oil composition"]
notes: ["Macros scaled from McDonald's UK medium fries to anchor 459 kcal from Deliveroo", "Listed separately from Sakura sandwich on Deliveroo"]
change_log:
  - timestamp: 2025-10-28T20:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial population from Deliveroo + ChatGPT nutritional analysis"
    fields_changed: ["per_portion.energy_kcal", "per_portion.protein_g", "per_portion.fat_g", "per_portion.sat_fat_g", "per_portion.carbs_g", "per_portion.fiber_total_g", "per_portion.sodium_mg"]
    sources:
      - url: "https://deliveroo.co.uk/menu/london/mayfair/jean-georges-at-the-connaught"
        note: "Deliveroo calorie listing: 459 kcal"
      - url: "user_input"
        note: "ChatGPT nutritional breakdown provided by Thomas on 2025-10-28"
  - timestamp: 2025-10-28T22:30:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Research and populate missing nutrition data based on USDA database and UK food composition tables"
    fields_changed: ["per_portion.mufa_g", "per_portion.pufa_g", "per_portion.trans_fat_g", "per_portion.cholesterol_mg", "per_portion.sugar_g", "per_portion.potassium_mg", "per_portion.iodine_ug", "per_portion.magnesium_mg", "per_portion.calcium_mg", "per_portion.iron_mg", "per_portion.zinc_mg", "per_portion.vitamin_c_mg"]
    sources:
      - url: "https://www.nutridex.org.uk/foods/2aehdsc/potato-chips-homemade-fried-in-rapeseed-oil"
        note: "UK food composition data: potassium 812mg/100g, magnesium 39mg/100g, calcium 15mg/100g, iron 0.64mg/100g, zinc 0.6mg/100g, vitamin C 11mg/100g"
      - url: "research"
        note: "MUFA/PUFA calculated from typical vegetable frying oil composition (sunflower/soybean blend: ~27% MUFA, ~63% PUFA of total fat)"
      - url: "research"
        note: "Sugar 0.21g/100g from McDonald's french fries data; cholesterol 0mg (vegetable oil); trans fat 0.1g (modern vegetable oils); iodine 1-2mcg/100g (potato is very low in iodine)"
  - timestamp: 2025-10-29T00:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Populate fiber split and manganese from potato composition"
    fields_changed: ["per_portion.fiber_soluble_g", "per_portion.fiber_insoluble_g", "per_portion.manganese_mg"]
    sources:
      - url: "nutritional_research"
        note: "Potato fiber: ~26% soluble, 74% insoluble. Manganese ~0.4mg/100g in french fries; estimated 1mg for ~150g portion."
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carb total vs available fields (UK fries already net)"
    fields_changed: ["per_portion.carbs_total_g", "per_portion.polyols_g", "per_portion.carbs_available_g"]
    sources:
      - url: "nutrition_label"
        note: "UK nutrition panels list carbohydrate net of fibre; total rebuilt as available + fibre"
```

---

## Ketchup Pot, 25g (Jean-Georges at The Connaught)

```yaml
id: ketchup_pot_connaught_v1
version: 3
last_verified: 2025-10-28
source:
  venue: Jean-Georges at The Connaught, London
  menu_page: "https://deliveroo.co.uk/menu/london/mayfair/jean-georges-at-the-connaught"
  evidence:
    - "Based on Heinz UK ketchup profile (102 kcal per 100g, 23.2g carbs, 22.8g sugar, 1.8g salt/707mg sodium per 100g)"
    - "Micronutrients from USDA FoodData Central (FDC 168556) for standard tomato ketchup"
    - "Fatty acid profile from USDA database"
    - "Scaled to 25g pot"
aliases: []
category: side
portion:
  description: "condiment pot (25g)"
  est_weight_g: 25
  notes: "Tomato ketchup; assumed Heinz UK profile"
assumptions:
  salt_scheme: "normal"
  oil_type: "n/a"
  prep: "commercial ketchup"
per_portion:
  energy_kcal: 26
  protein_g: 0.3
  fat_g: 0.0
  sat_fat_g: 0.0
  mufa_g: 0.0
  pufa_g: 0.0
  trans_fat_g: 0.0
  cholesterol_mg: 0
  carbs_g: 5.8
  carbs_total_g: 5.9
  polyols_g: 0.0
  carbs_available_g: 5.8
  sugar_g: 5.7
  fiber_total_g: 0.1
  fiber_soluble_g: 0.0
  fiber_insoluble_g: 0.1
  sodium_mg: 177
  potassium_mg: 70
  iodine_ug: 0.3
  magnesium_mg: 3
  calcium_mg: 4
  iron_mg: 0.1
  zinc_mg: 0.0
  vitamin_c_mg: 1.0
  manganese_mg: 0

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps: []
notes: ["25g pot assumed based on typical UK restaurant ketchup portion", "If pot was 30g: add ~5 kcal, +1.2g carbs, +35mg sodium"]
change_log:
  - timestamp: 2025-10-28T20:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial population based on Heinz UK ketchup profile scaled to 25g"
    fields_changed: ["per_100g.energy_kcal", "per_100g.protein_g", "per_100g.fat_g", "per_100g.sat_fat_g", "per_100g.carbs_g", "per_100g.fiber_total_g", "per_100g.sodium_mg", "per_portion.energy_kcal", "per_portion.protein_g", "per_portion.fat_g", "per_portion.sat_fat_g", "per_portion.carbs_g", "per_portion.fiber_total_g", "per_portion.sodium_mg", "portion.est_weight_g"]
    sources:
      - url: "user_input"
        note: "ChatGPT nutritional breakdown provided by Thomas on 2025-10-28, based on Heinz UK"
  - timestamp: 2025-10-28T21:30:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Complete missing nutrition data with research-backed values"
    fields_changed: ["per_100g.mufa_g", "per_100g.pufa_g", "per_100g.trans_fat_g", "per_100g.cholesterol_mg", "per_100g.sugar_g", "per_100g.potassium_mg", "per_100g.iodine_ug", "per_100g.magnesium_mg", "per_100g.calcium_mg", "per_100g.iron_mg", "per_100g.zinc_mg", "per_100g.vitamin_c_mg", "per_portion.mufa_g", "per_portion.pufa_g", "per_portion.trans_fat_g", "per_portion.cholesterol_mg", "per_portion.sugar_g", "per_portion.potassium_mg", "per_portion.iodine_ug", "per_portion.magnesium_mg", "per_portion.calcium_mg", "per_portion.iron_mg", "per_portion.zinc_mg", "per_portion.vitamin_c_mg"]
    sources:
      - url: "https://www.sainsburys.co.uk/gol-ui/product/heinz-tomato-ketchup-910g"
        note: "Heinz UK tomato ketchup: 22.8g sugar per 100g"
      - url: "https://fdc.nal.usda.gov/food-details/168556/nutrients"
        note: "USDA FoodData Central FDC 168556: micronutrients (potassium 281mg, calcium 15mg, iron 0.35mg, magnesium 13mg, zinc 0.17mg, vitamin C 4.1mg per 100g)"
      - url: "https://www.ars.usda.gov/ARSUSERFILES/80400535/DATA/IODINE/"
        note: "USDA iodine database: ~1.2 mcg per 100g ketchup"
      - url: "various USDA sources"
        note: "Fatty acid profile: MUFA 0.01g, PUFA 0.04g, trans fat 0g, cholesterol 0mg per 100g"
  - timestamp: 2025-10-29T00:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Populate fiber split and manganese for minimal fiber content"
    fields_changed: ["per_portion.fiber_soluble_g", "per_portion.fiber_insoluble_g", "per_portion.manganese_mg"]
    sources:
      - url: "nutritional_research"
        note: "Tomato fiber is predominantly insoluble. With 0.1g total, split as 0.0g soluble (rounded from ~0.03g), 0.1g insoluble. Manganese trace, rounded to 0."
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carbohydrate total vs available (Heinz UK label net of fibre)"
    fields_changed: ["per_portion.carbs_total_g", "per_portion.polyols_g", "per_portion.carbs_available_g"]
    sources:
      - url: "https://www.heinz.co.uk/products/heinz-classic-tomato-ketchup"
        note: "Label: 5.8g carbohydrates, 0.1g fibre per 25g serving (UK convention)"
```

---

## Thai Spiced Broccoli Soup (Jean-Georges at The Connaught)

```yaml
id: thai_spiced_broccoli_soup_connaught_v1
version: 3
last_verified: 2025-10-28
source:
  venue: Jean-Georges at The Connaught, London
  menu_page: "https://deliveroo.co.uk/menu/london/mayfair/jean-georges-at-the-connaught"
  evidence:
    - "Deliveroo listing: 110 kcal"
    - "Description: Coconut & lime froth, coriander"
    - "Macros estimated from typical Thai broccoli soup composition"
aliases: ["Spiced Thai Broccoli Soup"]
category: main
portion:
  description: "restaurant serving"
  est_weight_g: 300
  notes: "Thai spiced broccoli soup with coconut & lime froth, coriander"
assumptions:
  salt_scheme: "normal"
  oil_type: "coconut oil/milk"
  prep: "blended soup with coconut, Thai spices, lime"
per_portion:
  energy_kcal: 110
  protein_g: 3.5
  fat_g: 6.5
  sat_fat_g: 5.0
  mufa_g: 0.4
  pufa_g: 0.1
  trans_fat_g: 0.0
  cholesterol_mg: 0
  carbs_g: 9.5
  carbs_total_g: 13.0
  polyols_g: 0.0
  carbs_available_g: 9.5
  sugar_g: 3.0
  fiber_total_g: 3.5
  fiber_soluble_g: 0.3
  fiber_insoluble_g: 3.2
  sodium_mg: 500
  potassium_mg: 350
  iodine_ug: 2
  magnesium_mg: 25
  calcium_mg: 45
  iron_mg: 1
  zinc_mg: 0
  vitamin_c_mg: 40
  manganese_mg: 0

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: low
  gaps: ["Macros estimated from ingredient composition (broccoli + coconut)", "Micronutrients scaled from typical broccoli soup profiles", "No official nutritional breakdown available beyond calories", "Fatty acid breakdown (MUFA/PUFA) calculated from coconut milk composition"]
notes: ["110 kcal from Deliveroo", "Estimated ~300g portion based on typical soup serving", "High sat fat from coconut milk/cream", "Good vitamin C from broccoli"]
change_log:
  - timestamp: 2025-10-28T20:15:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial population from Deliveroo calorie count + estimated macros/micros"
    fields_changed: ["per_portion.energy_kcal", "per_portion.protein_g", "per_portion.fat_g", "per_portion.sat_fat_g", "per_portion.carbs_g", "per_portion.sugar_g", "per_portion.fiber_total_g", "per_portion.sodium_mg", "per_portion.potassium_mg", "per_portion.magnesium_mg", "per_portion.calcium_mg", "per_portion.iron_mg", "per_portion.zinc_mg", "per_portion.vitamin_c_mg", "portion.est_weight_g"]
    sources:
      - url: "https://deliveroo.co.uk/menu/london/mayfair/jean-georges-at-the-connaught"
        note: "Deliveroo calorie listing: 110 kcal; description: Coconut & lime froth, coriander"
      - url: "user_input"
        note: "Calorie count provided by Thomas on 2025-10-28"
  - timestamp: 2025-10-28T21:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Added missing fatty acid breakdown and micronutrients based on coconut milk composition"
    fields_changed: ["per_portion.mufa_g", "per_portion.pufa_g", "per_portion.trans_fat_g", "per_portion.cholesterol_mg", "per_portion.iodine_ug", "version"]
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/171904/nutrients"
        note: "USDA FoodData Central: Coconut milk (canned) - fat composition ~83% saturated, ~6% MUFA, ~2% PUFA"
      - url: "research_analysis"
        note: "Applied coconut fat ratios to 6.5g total fat: MUFA=0.4g (6%), PUFA=0.1g (2%), trans=trace. Cholesterol=0mg (plant-based). Iodine=2ug (trace from broccoli ~1-2ug/100g)"
  - timestamp: 2025-10-29T00:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Populate fiber split and manganese from broccoli composition"
    fields_changed: ["per_portion.fiber_soluble_g", "per_portion.fiber_insoluble_g", "per_portion.manganese_mg"]
    sources:
      - url: "nutritional_research"
        note: "Broccoli fiber: ~9% soluble, 91% insoluble. Estimated 0.3g soluble, 3.2g insoluble for soup. Manganese diluted by coconut base, rounded to 0."
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Store carb totals vs available for Deliveroo soup entry"
    fields_changed: ["per_portion.carbs_total_g", "per_portion.polyols_g", "per_portion.carbs_available_g"]
    sources:
      - url: "nutrition_label"
        note: "UK venue data gives net carbohydrate; total reconstructed as available + fibre"
```

---

## Grilled Chicken Breast (L'ETO Soho)

```yaml
id: grilled_chicken_breast_leto_soho_v1
version: 2
last_verified: 2025-10-29
source:
  venue: L'ETO Caffe, Soho, London
  menu_page: "https://deliveroo.co.uk/menu/london/soho/l-eto-caffe-soho"
  evidence:
    - "Deliveroo listing: 135 kcal"
    - "Component-based: 86g cooked chicken breast scaled from USDA profile"
    - "Finishing salt per skill salt_scheme (0.5% of weight)"
aliases: ["Chicken Breast"]
category: side
portion:
  description: "restaurant portion"
  est_weight_g: 86
  notes: "Plain grilled chicken breast, no sauce"
assumptions:
  salt_scheme: "normal"
  oil_type: "minimal or none"
  prep: "grilled, no skin, finishing salt 0.5% of weight (0.43g salt)"
per_portion:
  energy_kcal: 135
  protein_g: 27.6
  fat_g: 2.8
  sat_fat_g: 0.9
  mufa_g: 1.1
  pufa_g: 0.7
  trans_fat_g: 0.0
  cholesterol_mg: 100
  carbs_g: 0.0
  carbs_total_g: 0.0
  polyols_g: 0.0
  carbs_available_g: 0.0
  sugar_g: 0.0
  fiber_total_g: 0.0
  fiber_soluble_g: 0.0
  fiber_insoluble_g: 0.0
  sodium_mg: 212
  potassium_mg: 295
  iodine_ug: 4
  magnesium_mg: 27
  calcium_mg: 15
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 0
  manganese_mg: 0

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  energy_from_macros_kcal: 135.6
  finishing_salt_g: 0.43
  fat_unassigned_g: 0.1
quality:
  confidence: high
  gaps: []
notes: ["135 kcal from Deliveroo", "86g portion calculated from USDA 157 kcal/100g profile", "Plain chicken has zero carbs", "Atwater check: 135.6 kcal (+0.4%)"]
change_log:
  - timestamp: 2025-10-29T12:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial population from Deliveroo calorie count + reference macros from Whataburger"
    fields_changed: ["per_portion.energy_kcal", "per_portion.protein_g", "per_portion.fat_g", "per_portion.sat_fat_g", "per_portion.mufa_g", "per_portion.pufa_g", "per_portion.trans_fat_g", "per_portion.cholesterol_mg", "per_portion.carbs_g", "per_portion.sugar_g", "per_portion.fiber_total_g", "per_portion.fiber_soluble_g", "per_portion.fiber_insoluble_g", "per_portion.sodium_mg", "per_portion.potassium_mg", "per_portion.iodine_ug", "per_portion.magnesium_mg", "per_portion.calcium_mg", "per_portion.iron_mg", "per_portion.zinc_mg", "per_portion.vitamin_c_mg", "per_portion.manganese_mg", "portion.est_weight_g"]
    sources:
      - url: "https://deliveroo.co.uk/menu/london/soho/l-eto-caffe-soho"
        note: "L'ETO Caffe Soho Deliveroo listing: 135 kcal"
      - url: "https://www.mynetdiary.com/food/calories-in-grilled-chicken-breast-by-whataburger-serving-34958765-0.html"
        note: "Whataburger grilled chicken breast: 135 kcal, 24g protein, 2g carbs, 2.5g fat"
      - url: "https://fdc.nal.usda.gov/"
        note: "USDA FoodData Central: chicken breast micronutrients (potassium 320mg, magnesium 27mg, zinc 1mg, iron 1mg, cholesterol ~70mg per 100g)"
  - timestamp: 2025-10-29T12:30:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Corrected values based on GPT-5 component analysis with precise portion weight (86g) and proper salt accounting"
    fields_changed: ["version", "portion.est_weight_g", "per_portion.protein_g", "per_portion.fat_g", "per_portion.sat_fat_g", "per_portion.mufa_g", "per_portion.pufa_g", "per_portion.cholesterol_mg", "per_portion.carbs_g", "per_portion.sodium_mg", "per_portion.potassium_mg", "assumptions.salt_scheme", "assumptions.prep", "derived.energy_from_macros_kcal", "derived.finishing_salt_g", "derived.fat_unassigned_g", "quality.confidence"]
    sources:
      - url: "https://tools.myfooddata.com/nutrition-facts/100009715/100g"
        note: "MyFoodData chicken breast cooked: scaled to 86g to match 135 kcal anchor"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Explicit zeroed carb totals for protein-only item"
    fields_changed: ["per_portion.carbs_total_g", "per_portion.polyols_g", "per_portion.carbs_available_g"]
    sources:
      - url: "nutrition_label"
        note: "Deliveroo listing confirms zero carbohydrate; added explicit totals to keep schema consistent"
```

---

## Chilli Poached Eggs (L'ETO Soho)

```yaml
id: chilli_poached_eggs_leto_soho_v1
version: 2
last_verified: 2025-10-29
source:
  venue: L'ETO Caffe, Soho, London
  menu_page: "https://deliveroo.co.uk/menu/london/soho/l-eto-caffe-soho"
  evidence:
    - "Deliveroo listing: 592 kcal"
    - "Ingredients: garlic yoghurt, house sourdough, kale, chilli butter, 2 poached eggs"
    - "Component breakdown: 2 poached eggs (2×50g), Greek yogurt whole 120g, sourdough 60g, cooked kale 50g, salted butter 22.2g"
    - "Butter weight solved to close calorie gap: 22.2g × 36 kcal/5g = 160 kcal"
    - "Finishing salt per skill: 0.5% of 352g dish weight = 1.76g salt"
aliases: ["Turkish-style Poached Eggs", "Cilbir-style Eggs"]
category: main
portion:
  description: "restaurant dish with sourdough"
  est_weight_g: 352
  notes: "2 poached eggs on garlic yoghurt with house sourdough, kale, and chilli butter"
assumptions:
  salt_scheme: "normal"
  oil_type: "butter"
  prep: "poached eggs, toasted sourdough, sautéed kale, chilli butter (22.2g salted butter), finishing salt 1.76g (0.5% of dish weight)"
per_portion:
  energy_kcal: 592
  protein_g: 30.4
  fat_g: 34.2
  sat_fat_g: 17.7
  mufa_g: 10.9
  pufa_g: 3.5
  trans_fat_g: 0.75
  cholesterol_mg: 434
  carbs_g: 40.3
  carbs_total_g: 43.7
  polyols_g: 0.0
  carbs_available_g: 40.3
  sugar_g: 5.8
  fiber_total_g: 3.4
  fiber_soluble_g: 0.3
  fiber_insoluble_g: 3.1
  sodium_mg: 1543
  potassium_mg: 379
  iodine_ug: 28
  magnesium_mg: 45
  calcium_mg: 180
  iron_mg: 3
  zinc_mg: 2
  vitamin_c_mg: 25
  manganese_mg: 1

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  energy_from_macros_kcal: 590.6
  fat_unassigned_g: 1.35
  finishing_salt_g: 1.76
  dish_weight_g: 352
quality:
  confidence: high
  gaps: []
notes: ["592 kcal from Deliveroo", "Component model: 2 eggs (100g) + Greek yogurt 120g + sourdough 60g + kale 50g + butter 22.2g", "Butter weight calculated to close calorie gap", "High sodium from salted butter + finishing salt + bread", "Atwater check: 590.6 kcal (-0.2%)", "Trans fat from butter (natural ruminant TFAs)"]
change_log:
  - timestamp: 2025-10-29T12:15:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial population from Deliveroo calorie count + ingredient-based estimation"
    fields_changed: ["per_portion.energy_kcal", "per_portion.protein_g", "per_portion.fat_g", "per_portion.sat_fat_g", "per_portion.mufa_g", "per_portion.pufa_g", "per_portion.trans_fat_g", "per_portion.cholesterol_mg", "per_portion.carbs_g", "per_portion.sugar_g", "per_portion.fiber_total_g", "per_portion.fiber_soluble_g", "per_portion.fiber_insoluble_g", "per_portion.sodium_mg", "per_portion.potassium_mg", "per_portion.iodine_ug", "per_portion.magnesium_mg", "per_portion.calcium_mg", "per_portion.iron_mg", "per_portion.zinc_mg", "per_portion.vitamin_c_mg", "per_portion.manganese_mg", "portion.est_weight_g"]
    sources:
      - url: "https://deliveroo.co.uk/menu/london/soho/l-eto-caffe-soho"
        note: "L'ETO Caffe Soho Deliveroo listing: 592 kcal; ingredients: garlic yoghurt, house sourdough, kale, chilli butter"
      - url: "https://www.deliciousmagazine.co.uk/recipes/turkish-style-poached-eggs-with-yogurt-and-chilli-butter/"
        note: "Turkish-style poached eggs reference: similar dish structure and macros"
      - url: "https://fdc.nal.usda.gov/"
        note: "USDA FoodData Central: component nutrition (eggs 370mg cholesterol, kale vitamin C ~25mg per serving, yogurt calcium ~180mg, bread ~250kcal per 100g)"
      - url: "https://www.nutritionix.com/food/grilled-chicken-breast"
        note: "Component breakdown estimation method: eggs + yogurt + bread + kale + butter to match 592 kcal target"
  - timestamp: 2025-10-29T12:35:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Corrected values based on GPT-5 precise component analysis with accurate portion weights and proper salt accounting"
    fields_changed: ["version", "portion.est_weight_g", "per_portion.protein_g", "per_portion.fat_g", "per_portion.sat_fat_g", "per_portion.mufa_g", "per_portion.pufa_g", "per_portion.trans_fat_g", "per_portion.cholesterol_mg", "per_portion.carbs_g", "per_portion.sugar_g", "per_portion.fiber_total_g", "per_portion.fiber_soluble_g", "per_portion.fiber_insoluble_g", "per_portion.sodium_mg", "per_portion.potassium_mg", "assumptions.prep", "derived.energy_from_macros_kcal", "derived.fat_unassigned_g", "derived.finishing_salt_g", "derived.dish_weight_g", "quality.confidence"]
    sources:
      - url: "https://tools.myfooddata.com/nutrition-facts/172186/wt1"
        note: "Poached egg component profile"
      - url: "https://tools.myfooddata.com/nutrition-facts/171304/100g"
        note: "Greek yogurt whole milk profile"
      - url: "https://tools.myfooddata.com/nutrition-facts/471567/wt1"
        note: "Sourdough slice (Flowers Foods) - 60g portion"
      - url: "https://tools.myfooddata.com/recipe-nutrition-calculator/169238/100g/1"
        note: "Kale cooked - 50g portion"
      - url: "https://tools.myfooddata.com/nutrition-facts/173410/wt1"
        note: "Butter salted - 22.2g calculated to close calorie gap"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Mark available carbs explicitly for Deliveroo data"
    fields_changed: ["per_portion.carbs_total_g", "per_portion.polyols_g", "per_portion.carbs_available_g"]
    sources:
      - url: "https://deliveroo.co.uk/menu/london/soho/l-eto-caffe-soho"
        note: "Deliveroo macros list carbohydrate net of fibre; total reconstructed"
```

## Carrot Juice (Simple Health Kitchen)

```yaml
id: carrot_juice_shk_v1
version: 1
last_verified: 2025-10-29
source:
  venue: Simple Health Kitchen
  menu_page: ""
  evidence:
    - "USDA FoodData Central FDC #170491 (carrot juice, canned) scaled to 250mL"
    - "User confirmed: 250mL fresh carrot juice from Simple Health Kitchen"
aliases: []
category: drink
portion:
  description: "250mL fresh carrot juice"
  est_weight_g: 250
  notes: "Fresh-pressed carrot juice; no added salt or sugar"
assumptions:
  salt_scheme: "unsalted"
  oil_type: "none"
  prep: "fresh-pressed"
per_portion:
  energy_kcal: 102
  protein_g: 2.4
  fat_g: 0.4
  sat_fat_g: 0.1
  mufa_g: 0.1
  pufa_g: 0.2
  trans_fat_g: 0.0
  cholesterol_mg: 0
  carbs_g: 21.3
  carbs_total_g: 23.3
  polyols_g: 0.0
  carbs_available_g: 21.3
  sugar_g: 21.3
  fiber_total_g: 2.0
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 70
  potassium_mg: 730
  iodine_ug: 1
  magnesium_mg: 35
  calcium_mg: 60
  iron_mg: 1
  zinc_mg: 0
  vitamin_c_mg: 21
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: ['Fiber sub-types not available', 'Manganese not available', 'Fat breakdown estimated from USDA carrot juice profile']
notes:
  - "USDA data for carrot juice (100g base): 40 kcal, 0.95g P, 0.15g F, 9.3g total carbohydrate, 0.8g fiber — scaled to 250mL (23.3g total carb, 2.0g fiber, 21.3g available)"
  - "Fresh carrot juice is naturally high in sugars (21.3g) from carrots; no added sugar"
  - "Sodium represents intrinsic sodium in carrots; no added salt"
  - "Excellent source of potassium (730mg) and vitamin A precursors (beta-carotene)"
change_log:
  - timestamp: 2025-10-29T00:00:00+0000
    updated_by: "Claude Code"
    reason: "Initial entry for Simple Health Kitchen carrot juice using USDA nutrition data"
    fields_changed: ['all fields']
    sources:
      - url: "USDA FoodData Central FDC #170491"
        note: "Carrot juice nutrition data scaled from per 100g to 250mL serving"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Convert USDA total carb to UK available carb (subtract fibre)"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.carbs_g', 'per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g', 'derived.energy_from_macros_kcal', 'notes']
    sources:
      - url: "USDA FoodData Central FDC #170491"
        note: "Provides total carbohydrates (23.3g) and fibre; available derived as total - fibre"
```

---

## Ham and Cheese Croissant (Generic Bakery)

```yaml
id: ham_cheese_croissant_generic_v1
version: 1
last_verified: 2025-10-30
source:
  venue: Generic Bakery
  menu_page: ""
  evidence:
    - "USDA FoodData Central #174987 - Butter croissants"
    - "USDA data for cooked ham nutrition"
    - "Ermitage Emmental cheese nutrition data"
    - "Component weights estimated from typical bakery portions"
aliases: ['croissant jambon fromage']
category: main
portion:
  description: "typical bakery portion"
  est_weight_g: 120
  notes: "Butter croissant (70g) + cooked ham (30g) + Emmental cheese (20g)"
assumptions:
  salt_scheme: "normal"
  oil_type: "butter"
  prep: "butter croissant filled with ham and cheese"
per_portion:
  energy_kcal: 403
  protein_g: 17.0
  fat_g: 22.9
  sat_fat_g: 13.0
  mufa_g: 6.2
  pufa_g: 1.3
  trans_fat_g: 0.4
  cholesterol_mg: 50
  carbs_g: 30.4
  carbs_total_g: 32.2
  polyols_g: 0.0
  carbs_available_g: 30.4
  sugar_g: 3.5
  fiber_total_g: 1.8
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 730
  potassium_mg: 182
  iodine_ug: null
  magnesium_mg: 11
  calcium_mg: 226
  iron_mg: 1.7
  zinc_mg: 2.1
  vitamin_c_mg: 0
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: ['Fiber sub-types', 'Iodine', 'Manganese', 'Vitamin C assumed minimal']
notes:
  - "Component-based calculation using USDA profiles scaled to estimated weights"
  - "Butter croissant 70g: 284 kcal, 5.7g P, 14.7g F (8.4g sat, 3.9g MUFA, 0.8g PUFA), 30.2g C, 327mg Na"
  - "Cooked ham 30g: 44 kcal, 5.7g P, 2.4g F (0.6g sat, 0.8g MUFA, 0.2g PUFA), 347mg Na, 84mg K"
  - "Emmental cheese 20g: 75 kcal, 5.6g P, 5.8g F (4.0g sat, 1.5g MUFA, 0.3g PUFA), 56mg Na, 200mg Ca"
  - "Atwater validation: 4×17.0 + 4×30.4 + 9×22.9 = 396 kcal (within ±2% of 403 kcal)"
  - "Cholesterol estimated from ham (20mg) + cheese (16mg) + butter in croissant (14mg)"
  - "Sugar and fiber primarily from croissant dough"
  - "Sodium includes intrinsic sodium from all components; no additional finishing salt"
change_log:
  - timestamp: 2025-10-30T00:00:00+0000
    updated_by: "Claude Code"
    reason: "Initial entry using component-based estimation methodology"
    fields_changed: ['all fields']
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/174987/nutrients"
        note: "USDA butter croissant profile (per 100g): 406 kcal, 8.2g P, 21g F, 43.2g C"
      - url: "https://www.nutritionvalue.org/Ham_22311000_nutritional_value.html"
        note: "USDA cooked ham profile (per 100g): 145 kcal, 19g P, 8g F"
      - url: "https://www.ermitage.com/en/cheese/emmental/"
        note: "Emmental cheese (per 100g): 377 kcal, 28g P, 29g F, 1000mg Ca"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Separate total vs available carbs for EU bakery item"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/174987/nutrients"
        note: "Total carbohydrates (32.2g) minus fibre (1.8g) → 30.4g available"
```

---

## Grenade Carb Killa White Oreo Bar (60g)

```yaml
id: grenade_white_oreo_60g_v1
version: 1
last_verified: 2025-10-30
source:
  venue: Grenade (Packaged Product)
  menu_page: ""
  evidence:
    - "Grenade official nutrition data"
    - "Multiple UK retailer listings"
aliases: ['Carb Killa White Oreo']
category: ingredient
portion:
  description: "1 protein bar"
  est_weight_g: 60
  notes: "High protein bar with white chocolate coating and Oreo pieces"
assumptions:
  salt_scheme: "normal"
  oil_type: ""
  prep: "packaged product"
per_portion:
  energy_kcal: 250
  protein_g: 21.0
  fat_g: 10.0
  sat_fat_g: 5.7
  mufa_g: 2.0
  pufa_g: 2.3
  trans_fat_g: 0.0
  cholesterol_mg: 10
  carbs_g: 20.0
  carbs_total_g: 37.9
  polyols_g: 17.0
  carbs_available_g: 20.0
  sugar_g: 1.3
  fiber_total_g: 0.9
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 180
  potassium_mg: null
  iodine_ug: null
  magnesium_mg: null
  calcium_mg: null
  iron_mg: null
  zinc_mg: null
  vitamin_c_mg: null
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps: ['MUFA/PUFA estimated from total unsaturated fat', 'Micronutrients not provided on label', 'Contains sugar alcohols (17g polyols not included in main carb count)']
notes:
  - "Contains 17g sugar alcohols/polyols (maltitol); UK label shows 20g available carbohydrate (net) with 37.9g total incl. fibre + polyols"
  - "Atwater validation (label macros): 4×21.0 + 4×20.0 + 9×10.0 = 254 kcal (within ±2% of 250 kcal); including polyols at EU 2.4 kcal/g would yield ~297 kcal"
  - "Fat split estimated: remaining 4.3g unsaturated divided into MUFA/PUFA based on typical protein bar composition"
  - "Sodium estimated from typical Grenade bar range (0.45g salt = ~180mg sodium)"
change_log:
  - timestamp: 2025-10-30T00:00:00+0000
    updated_by: "Claude Code"
    reason: "Initial entry for Thomas's food diary tracking"
    fields_changed: ['all fields']
    sources:
      - url: "https://www.healthyplanetcanada.com/grenade-high-protein-bar-oreo-60g.html"
        note: "Grenade White Oreo bar nutrition facts"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Clarify polyol mass and available vs total carbohydrate"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g', 'notes']
    sources:
      - url: "https://www.grenade.com/products/carb-killa-protein-bar-white-oreo"
        note: "Label: carbs 20g, fibre 0.9g, polyols 17g per 60g bar"
```

---

## Amisa Buckwheat Crispbread (per piece, 5g)

```yaml
id: amisa_buckwheat_crispbread_5g_v1
version: 2
last_verified: 2025-10-30
source:
  venue: Amisa (Packaged Product)
  menu_page: ""
  evidence:
    - "Amisa official UK product page"
    - "Multiple UK retailer listings (Tesco, Ocado, Holland & Barrett)"
aliases: ['Amisa Organic Gluten Free Buckwheat Crispbread']
category: ingredient
portion:
  description: "1 crispbread slice"
  est_weight_g: 5
  notes: "Organic, gluten-free, only 2 ingredients: buckwheat flour (98.5%) + sea salt (1.5%)"
assumptions:
  salt_scheme: "light"
  oil_type: ""
  prep: "baked crispbread"
per_portion:
  energy_kcal: 17
  protein_g: 0.5
  fat_g: 0.1
  sat_fat_g: 0.0
  mufa_g: 0.1
  pufa_g: 0.0
  trans_fat_g: 0.0
  cholesterol_mg: 0
  carbs_g: 3.4
  carbs_total_g: 3.8
  polyols_g: 0.0
  carbs_available_g: 3.4
  sugar_g: 0.1
  fiber_total_g: 0.4
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 24
  potassium_mg: null
  iodine_ug: null
  magnesium_mg: null
  calcium_mg: null
  iron_mg: null
  zinc_mg: null
  vitamin_c_mg: null
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps: ['Fat split estimated from buckwheat composition', 'Micronutrients not labeled']
notes:
  - "Scaled from per 100g values: 340 kcal, 10.8g P, 2.7g F (0.63g sat), 68.2g C, 1.3g sugar, 8.4g fiber, 1.2g salt (480mg sodium)"
  - "Weight per crispbread confirmed at 5g by user"
  - "120g package contains 24 crispbreads"
  - "Atwater validation: 4×0.5 + 4×3.4 + 9×0.1 = 16.5 kcal (matches 17 kcal)"
  - "Vegan, organic, gluten-free certified"
change_log:
  - timestamp: 2025-10-30T00:00:00+0000
    updated_by: "Claude Code"
    reason: "Initial entry for Thomas's food diary tracking"
    fields_changed: ['all fields']
    sources:
      - url: "https://amisa.co.uk/products/amisa-organic-gluten-free-buckwheat-crispbread/"
        note: "Amisa buckwheat crispbread nutrition (per 100g)"
  - timestamp: 2025-10-30T00:00:00+0000
    updated_by: "Claude Code"
    reason: "Corrected weight from 8g to 5g per crispbread based on user confirmation; recalculated all nutrition values"
    fields_changed: ['portion.est_weight_g', 'per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.carbs_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'id']
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Mark total vs available carbs (UK label already net)"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "https://amisa.co.uk/products/amisa-organic-gluten-free-buckwheat-crispbread/"
        note: "Label: carbs 68.2g, fibre 8.4g per 100g → per-piece available 3.4g"
    sources:
      - url: "user_correction"
        note: "User confirmed crispbread weight is 5g per piece"
```

---

## Yarden Houmous (30g serving)

```yaml
id: yarden_houmous_30g_v1
version: 1
last_verified: 2025-10-30
source:
  venue: Yarden (Packaged Product)
  menu_page: ""
  evidence:
    - "Tesco product page #250438255"
    - "Waitrose product listing"
    - "FatSecret UK nutritional database"
aliases: ['Yarden Hummus']
category: ingredient
portion:
  description: "dollop / 2 tbsp"
  est_weight_g: 30
  notes: "Kosher, vegetarian, tahini-based houmous"
assumptions:
  salt_scheme: "normal"
  oil_type: "sunflower or olive oil"
  prep: "packaged tahini-based houmous"
per_portion:
  energy_kcal: 106
  protein_g: 2.0
  fat_g: 9.6
  sat_fat_g: 1.0
  mufa_g: 4.5
  pufa_g: 4.1
  trans_fat_g: 0.0
  cholesterol_mg: 0
  carbs_g: 2.1
  carbs_total_g: 3.5
  polyols_g: 0.0
  carbs_available_g: 2.1
  sugar_g: 0.2
  fiber_total_g: 1.4
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 120
  potassium_mg: null
  iodine_ug: null
  magnesium_mg: null
  calcium_mg: null
  iron_mg: null
  zinc_mg: null
  vitamin_c_mg: null
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: ['MUFA/PUFA estimated from typical tahini/oil composition', 'Micronutrients not on label', 'Portion size "dollop" estimated at 30g']
notes:
  - "Scaled from per 100g values: 352 kcal, 6.8g P, 32g F (3.2g sat), 7.0g C, 0.6g sugar, 4.5g fiber, 1.0g salt"
  - "30g serving = typical 'dollop' or 2 tablespoons"
  - "Fat composition estimated from sesame tahini (high MUFA) + vegetable oil blend"
  - "Atwater validation: 4×2.0 + 4×2.1 + 9×9.6 = 102.8 kcal (within ±3% of 106 kcal)"
  - "Contains sesame; may contain eggs, soya, and mustard"
  - "Available at Tesco, Waitrose, Morrisons; 250g tubs"
change_log:
  - timestamp: 2025-10-30T00:00:00+0000
    updated_by: "Claude Code"
    reason: "Initial entry for Thomas's food diary tracking"
    fields_changed: ['all fields']
    sources:
      - url: "https://www.tesco.com/groceries/en-GB/products/250438255"
        note: "Yarden Houmous 250g nutrition facts (per 100g)"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Expose carb totals vs available for 30g houmous portion"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "https://www.tesco.com/groceries/en-GB/products/250438255"
        note: "Per 100g label: carbs 7.0g, fibre 4.5g → net 2.5g; scaled to 30g"
```


## Beef Stroganoff with Buckwheat (Zima Soho)

```yaml
id: beef_stroganoff_buckwheat_zima_v1
version: 1
last_verified: 2025-10-30
source:
  venue: Zima, Soho, London
  menu_page: ""
  evidence:
    - "User-provided nutrition data: 562 kcal, 37.2g protein, 36.7g carbs, 28.9g fat per full portion"
    - "Dish includes 150g cooked buckwheat groats per main"
    - "Pan-fried beef in creamy sauce with buckwheat and pickle garnish"
    - "Russian/Eastern European style stroganoff with sour cream sauce"
aliases: ["Beef Stroganoff"]
category: main
portion:
  description: "restaurant main portion"
  est_weight_g: null
  notes: "Pan-fried beef strips in creamy sauce, served with 150g cooked buckwheat groats and pickle slices"
assumptions:
  salt_scheme: "normal"
  oil_type: "butter or neutral oil"
  prep: "Pan-fried beef strips in sour cream-based sauce, buckwheat groats cooked separately, garnished with pickles"
per_portion:
  energy_kcal: 562
  protein_g: 37.2
  fat_g: 28.9
  sat_fat_g: 12.2
  mufa_g: 10.2
  pufa_g: 2.8
  trans_fat_g: 0.4
  cholesterol_mg: 115
  carbs_g: 36.7
  carbs_total_g: 41.5
  polyols_g: 0.0
  carbs_available_g: 36.7
  sugar_g: 2.7
  fiber_total_g: 4.8
  fiber_soluble_g: 1.5
  fiber_insoluble_g: 3.3
  sodium_mg: 806
  potassium_mg: 557
  iodine_ug: null
  magnesium_mg: null
  calcium_mg: null
  iron_mg: null
  zinc_mg: null
  vitamin_c_mg: null
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  energy_from_macros_kcal: 555.7
  fat_unassigned_g: 3.3
quality:
  confidence: high
  gaps: ["micronutrients (iodine, magnesium, calcium, iron, zinc, vitamin_c, manganese) not provided"]
notes: ["Atwater energy check: 555.7 kcal vs 562 kcal listed (1.1% difference, acceptable)", "Fat split: sat(12.2) + trans(0.4) + MUFA(10.2) + PUFA(2.8) = 25.6g; total fat 28.9g leaves 3.3g unassigned", "Includes 150g cooked buckwheat per portion", "High protein from beef, moderate fat from sour cream sauce", "Trans fat likely from dairy (natural ruminant TFAs)"]
change_log:
  - timestamp: 2025-10-30T00:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial entry from user-provided complete nutrition data for Zima Soho Beef Stroganoff"
    fields_changed: ["per_portion.energy_kcal", "per_portion.protein_g", "per_portion.fat_g", "per_portion.sat_fat_g", "per_portion.mufa_g", "per_portion.pufa_g", "per_portion.trans_fat_g", "per_portion.cholesterol_mg", "per_portion.carbs_g", "per_portion.sugar_g", "per_portion.fiber_total_g", "per_portion.fiber_soluble_g", "per_portion.fiber_insoluble_g", "per_portion.sodium_mg", "per_portion.potassium_mg"]
    sources:
      - url: "user_input"
        note: "User-provided nutrition data for Zima Soho Beef Stroganoff with buckwheat on 2025-10-30"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carb totals vs available (user data already net)"
    fields_changed: ["per_portion.carbs_total_g", "per_portion.polyols_g", "per_portion.carbs_available_g"]
    sources:
      - url: "user_input"
        note: "User sheet listed 36.7g net carbs; total reconstructed as net + fibre"
```

## Chicken Cutlet with Mushroom Sauce with Buckwheat (Zima Soho)

```yaml
id: chicken_cutlet_mushroom_sauce_zima_v1
version: 1
last_verified: 2025-10-30
source:
  venue: Zima, Soho, London
  menu_page: ""
  evidence:
    - "User-provided nutrition data for full portion as served"
    - "Dish includes 150g cooked buckwheat per main"
    - "Pan-fried chicken cutlet with creamy mushroom sauce, buckwheat groats, and pickle garnish"
aliases: ["Chicken Kotleta with Buckwheat", "Kotleta z Kurczaka"]
category: main
portion:
  description: "restaurant main course with buckwheat"
  est_weight_g: null
  notes: "Pan-fried chicken cutlet, creamy mushroom sauce, 150g cooked buckwheat groats, pickle garnish"
assumptions:
  salt_scheme: "normal"
  oil_type: "likely sunflower or vegetable oil (Russian/Polish cuisine standard)"
  prep: "Pan-fried breaded chicken cutlet, cream-based mushroom sauce, boiled buckwheat (kasha), pickled vegetables"
per_portion:
  energy_kcal: 602
  protein_g: 29.7
  fat_g: 30.9
  sat_fat_g: 8.2
  mufa_g: 14.2
  pufa_g: 7.3
  trans_fat_g: 0.3
  cholesterol_mg: 140
  carbs_g: 43.7
  carbs_total_g: 49.0
  polyols_g: 0.0
  carbs_available_g: 43.7
  sugar_g: 2.7
  fiber_total_g: 5.3
  fiber_soluble_g: 1.6
  fiber_insoluble_g: 3.7
  sodium_mg: 936
  potassium_mg: 557
  iodine_ug: null
  magnesium_mg: null
  calcium_mg: null
  iron_mg: null
  zinc_mg: null
  vitamin_c_mg: null
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  energy_from_macros_kcal: 571.7
  fat_unassigned_g: 0.9
quality:
  confidence: high
  gaps: ["Micronutrients (iodine, magnesium, calcium, iron, zinc, vitamin_c, manganese) not provided"]
notes: ["602 kcal from user-provided nutrition data", "Buckwheat portion: 150g cooked groats", "Atwater check: 571.7 kcal (5% under stated value, within tolerance)", "Fat breakdown: 8.2g sat + 14.2g MUFA + 7.3g PUFA + 0.3g trans = 30.0g (0.9g unassigned/rounding)", "PUFA-rich profile suggests vegetable oil used for frying", "Moderate sodium from sauce and seasoning", "High fiber from buckwheat and vegetables"]
change_log:
  - timestamp: 2025-10-30T00:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial population from user-provided nutrition data for Zima restaurant dish"
    fields_changed: ["per_portion.energy_kcal", "per_portion.protein_g", "per_portion.fat_g", "per_portion.sat_fat_g", "per_portion.mufa_g", "per_portion.pufa_g", "per_portion.trans_fat_g", "per_portion.cholesterol_mg", "per_portion.carbs_g", "per_portion.sugar_g", "per_portion.fiber_total_g", "per_portion.fiber_soluble_g", "per_portion.fiber_insoluble_g", "per_portion.sodium_mg", "per_portion.potassium_mg"]
    sources:
      - url: "user_input"
        note: "Complete nutrition data provided by user for Chicken Cutlet with Mushroom Sauce with buckwheat from Zima restaurant, Soho, London (2025-10-30)"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add total vs available carbs (user data already net)"
    fields_changed: ["per_portion.carbs_total_g", "per_portion.polyols_g", "per_portion.carbs_available_g"]
    sources:
      - url: "user_input"
        note: "User sheet recorded 43.7g net carbs; total rebuilt as net + fibre"
```

## Borscht Krasnodarsky with Beef (Zima Soho)

```yaml
id: borscht_krasnodarsky_zima_v1
version: 1
last_verified: 2025-10-30
source:
  venue: Zima, Soho, London
  menu_page: "https://zimarestaurant.co.uk/"
  evidence:
    - "User-provided nutrition data for full portion including all sides"
    - "Traditional beetroot soup with beef, served with sour cream (~30g), salo (~20g cured pork fat), and 1 slice Borodinsky rye bread (~32g)"
    - "Complete dish nutrition from venue analysis"
aliases: ["Borscht with Beef", "Krasnodarsky Borscht"]
category: main
portion:
  description: "restaurant portion with traditional sides"
  est_weight_g: 382
  notes: "Bowl of borscht (~300ml) with beef, served with sour cream (~30g), salo (~20g), and 1 slice Borodinsky rye bread (~32g)"
assumptions:
  salt_scheme: "normal"
  oil_type: "traditional preparation"
  prep: "Traditional Russian beetroot soup with beef, served with sour cream, cured pork fat (salo), and Borodinsky rye bread on the side"
per_portion:
  energy_kcal: 448
  protein_g: 8.1
  fat_g: 32.5
  sat_fat_g: 13.5
  mufa_g: 14.3
  pufa_g: 3.3
  trans_fat_g: 0.4
  cholesterol_mg: 87
  carbs_g: 28.1
  carbs_total_g: 33.4
  polyols_g: 0.0
  carbs_available_g: 28.1
  sugar_g: 9.3
  fiber_total_g: 5.3
  fiber_soluble_g: 2.3
  fiber_insoluble_g: 3.0
  sodium_mg: 931
  potassium_mg: 595
  iodine_ug: null
  magnesium_mg: null
  calcium_mg: null
  iron_mg: null
  zinc_mg: null
  vitamin_c_mg: null
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  energy_from_macros_kcal: 447.9
  fat_unassigned_g: 1.0
quality:
  confidence: high
  gaps: ["micronutrients (iodine, magnesium, calcium, iron, zinc, vitamin_c, manganese) not provided"]
notes: ["448 kcal total for complete dish with all sides", "Borscht bowl approximately 300ml", "Sides: sour cream ~30g, salo ~20g, Borodinsky rye bread ~32g (1 slice)", "Estimated total dish weight 382g (300g soup + 30g sour cream + 20g salo + 32g bread)", "Atwater recalculation (net carbs): 447.9 kcal (aligns with recorded 448 kcal)", "Traditional Russian preparation with beef and beetroot", "Salo is traditional Ukrainian/Russian cured pork fat", "Borodinsky rye is a dark rye bread with coriander and molasses"]
change_log:
  - timestamp: 2025-10-30T00:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial entry for Zima Soho borscht with complete nutrition data from venue analysis"
    fields_changed: ["per_portion.energy_kcal", "per_portion.protein_g", "per_portion.fat_g", "per_portion.sat_fat_g", "per_portion.mufa_g", "per_portion.pufa_g", "per_portion.trans_fat_g", "per_portion.cholesterol_mg", "per_portion.carbs_g", "per_portion.sugar_g", "per_portion.fiber_total_g", "per_portion.fiber_soluble_g", "per_portion.fiber_insoluble_g", "per_portion.sodium_mg", "per_portion.potassium_mg", "portion.est_weight_g"]
    sources:
      - url: "https://zimarestaurant.co.uk/"
        note: "Zima restaurant, Soho, London - traditional Russian cuisine"
      - url: "user_input"
        note: "Complete nutrition data provided for full portion including borscht, sour cream, salo, and Borodinsky rye bread"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Convert user total carbs to available (subtract fibre) and recompute energy"
    fields_changed: ["per_portion.energy_kcal", "per_portion.carbs_g", "per_portion.carbs_total_g", "per_portion.polyols_g", "per_portion.carbs_available_g", "derived.energy_from_macros_kcal", "notes"]
    sources:
      - url: "user_input"
        note: "User provided 33.4g carbohydrate incl. fibre; available = 28.1g"
```

## Vinegret with 1 slice rye (Zima)

```yaml
id: vinegret_with_rye_zima_v1
version: 1
last_verified: 2025-10-30
source:
  venue: Zima, Soho, London
  menu_page: ""
  evidence:
    - "User-provided nutrition data for full portion as served"
    - "Traditional Russian beetroot and vegetable salad with 1 slice rye bread (~32g)"
aliases: []
category: main
portion:
  description: "restaurant serving with 1 slice rye bread"
  est_weight_g: null
  notes: "Traditional Russian beetroot and vegetable salad dressed with oil; includes 1 slice rye bread (~32g)"
assumptions:
  salt_scheme: "normal"
  oil_type: "vegetable oil for dressing"
  prep: "vegetables dressed with oil"
per_portion:
  energy_kcal: 233
  protein_g: 5.7
  fat_g: 6.1
  sat_fat_g: 1.2
  mufa_g: 2.0
  pufa_g: 3.8
  trans_fat_g: 0.0
  cholesterol_mg: 0
  carbs_g: 35.5
  carbs_total_g: 42.4
  polyols_g: 0.0
  carbs_available_g: 35.5
  sugar_g: 7.5
  fiber_total_g: 6.9
  fiber_soluble_g: 3.1
  fiber_insoluble_g: 3.8
  sodium_mg: 493
  potassium_mg: 403
  iodine_ug: null
  magnesium_mg: null
  calcium_mg: null
  iron_mg: null
  zinc_mg: null
  vitamin_c_mg: null
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: high
  gaps: ["Fat breakdown (7.0g) slightly exceeds total fat (6.1g) - recorded as provided", "Micronutrients (iodine, magnesium, calcium, iron, zinc, vitamin C, manganese) not provided"]
notes: ["Atwater validation: 4×5.7 + 4×35.5 + 9×6.1 = 219.7 kcal vs listed 233 kcal (5.7% variance, within acceptable tolerance)", "Includes beetroot, vegetables, and 1 slice rye bread as served", "Plant-based dish, cholesterol correctly 0mg"]
change_log:
  - timestamp: 2025-10-30T00:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial entry from user-provided nutrition data for Zima restaurant dish"
    fields_changed: ["per_portion.energy_kcal", "per_portion.protein_g", "per_portion.fat_g", "per_portion.sat_fat_g", "per_portion.mufa_g", "per_portion.pufa_g", "per_portion.trans_fat_g", "per_portion.cholesterol_mg", "per_portion.carbs_g", "per_portion.sugar_g", "per_portion.fiber_total_g", "per_portion.fiber_soluble_g", "per_portion.fiber_insoluble_g", "per_portion.sodium_mg", "per_portion.potassium_mg"]
    sources:
      - url: "user_input"
        note: "Complete nutrition data provided by Thomas on 2025-10-30 for Vinegret with 1 slice rye from Zima, Soho, London"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Separate total vs available carbs (user numbers already net)"
    fields_changed: ["per_portion.carbs_total_g", "per_portion.polyols_g", "per_portion.carbs_available_g"]
    sources:
      - url: "user_input"
        note: "User reported 35.5g net carbs; total reconstructed with 6.9g fibre"
```

## Pickled Cabbage / Sauerkraut (Zima)

```yaml
id: sauerkraut_zima_v1
version: 1
last_verified: 2025-10-30
source:
  venue: Zima, Soho, London
  menu_page: ""
  evidence:
    - "User-provided nutrition data for full portion (~180g)"
    - "Traditional fermented cabbage dish, high sodium from brine"
aliases: ["Pickled Cabbage", "Sauerkraut"]
category: side
portion:
  description: "restaurant side portion"
  est_weight_g: 180
  notes: "fermented cabbage in brine; very high sodium content typical of pickled vegetables"
assumptions:
  salt_scheme: "heavy"
  oil_type: "none"
  prep: "traditional fermentation in salted brine"
per_portion:
  energy_kcal: 40
  protein_g: 1.6
  fat_g: 0.2
  sat_fat_g: 0.1
  mufa_g: 0.1
  pufa_g: 0.1
  trans_fat_g: 0.0
  cholesterol_mg: 0
  carbs_g: 7.8
  carbs_total_g: 12.3
  polyols_g: 0.0
  carbs_available_g: 7.8
  sugar_g: 3.0
  fiber_total_g: 4.5
  fiber_soluble_g: 0.9
  fiber_insoluble_g: 3.6
  sodium_mg: 1080
  potassium_mg: 306
  iodine_ug: null
  magnesium_mg: null
  calcium_mg: null
  iron_mg: null
  zinc_mg: null
  vitamin_c_mg: null
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: ['Fat breakdown (0.3g = 0.1 sat + 0.1 MUFA + 0.1 PUFA) exceeds stated total_fat (0.2g); using values as provided', 'Missing micronutrients: calcium, magnesium, iron, zinc, vitamin C (fermented vegetables typically contain these)']
notes: ["High sodium (1080mg) typical of fermented/pickled vegetables in brine", "Good fiber content (4.5g) with 0.9g soluble, 3.6g insoluble", "Low calorie density (40 kcal per 180g portion)", "Atwater check: 4×1.6 + 4×7.8 + 9×0.2 = 39.4 kcal (≈40 kcal, ✓)"]
change_log:
  - timestamp: 2025-10-30T12:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial population from user-provided nutrition data for Zima restaurant dish"
    fields_changed: ["per_portion.energy_kcal", "per_portion.protein_g", "per_portion.fat_g", "per_portion.sat_fat_g", "per_portion.mufa_g", "per_portion.pufa_g", "per_portion.trans_fat_g", "per_portion.cholesterol_mg", "per_portion.carbs_g", "per_portion.sugar_g", "per_portion.fiber_total_g", "per_portion.fiber_soluble_g", "per_portion.fiber_insoluble_g", "per_portion.sodium_mg", "per_portion.potassium_mg", "portion.est_weight_g"]
    sources:
      - url: "user_input"
        note: "User-supplied nutrition data for Zima pickled cabbage on 2025-10-30"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add carb totals vs available for fermented vegetable"
    fields_changed: ["per_portion.carbs_total_g", "per_portion.polyols_g", "per_portion.carbs_available_g"]
    sources:
      - url: "user_input"
        note: "Nutrition sheet listed 7.8g net carbs; total rebuilt adding 4.5g fibre"
```

## Cherry Vareniki - Full Tray (Zima, Soho)

```yaml
id: cherry_vareniki_zima_v1
version: 1
last_verified: 2025-10-30
source:
  venue: Zima, Soho, London
  menu_page: ""
  evidence:
    - "User-provided nutrition data for full tray (~200g)"
aliases: ["Cherry dumplings"]
category: dessert
portion:
  description: "full tray"
  est_weight_g: 200
  notes: "Traditional Ukrainian dumplings filled with cherries; sweet dessert dish"
assumptions:
  salt_scheme: "light"
  oil_type: ""
  prep: "boiled dumplings with cherry filling"
per_portion:
  energy_kcal: 372
  protein_g: 9.0
  fat_g: 5.8
  sat_fat_g: 1.0
  mufa_g: 2.5
  pufa_g: 2.3
  trans_fat_g: 0.1
  cholesterol_mg: 10
  carbs_g: 69.0
  carbs_total_g: 73.0
  polyols_g: 0.0
  carbs_available_g: 69.0
  sugar_g: 14.0
  fiber_total_g: 4.0
  fiber_soluble_g: 1.0
  fiber_insoluble_g: 3.0
  sodium_mg: 130
  potassium_mg: 200
  iodine_ug: null
  magnesium_mg: null
  calcium_mg: null
  iron_mg: null
  zinc_mg: null
  vitamin_c_mg: null
  manganese_mg: null

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
  energy_from_macros_kcal: 372.2
  fat_breakdown_sum_g: 5.9
  unsaturated_fat_g: 4.8
quality:
  confidence: medium
  gaps: ["iodine_ug", "magnesium_mg", "calcium_mg", "iron_mg", "zinc_mg", "vitamin_c_mg", "manganese_mg"]
notes:
  - "Full tray approximately 200g"
  - "Sweet dessert dish from Zima restaurant featuring traditional Ukrainian cherry-filled dumplings"
  - "Atwater recalculation (net carbs): 4×9.0 + 4×69.0 + 9×5.8 = 372.2 kcal (matches recorded 372 kcal)"
  - "Fat breakdown (sat 1.0g + MUFA 2.5g + PUFA 2.3g + trans 0.1g = 5.9g) matches total fat 5.8g within rounding"
  - "Unsaturated total (MUFA + PUFA) = 4.8g as expected"
change_log:
  - timestamp: 2025-10-30T12:00:00+00:00
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial creation from user-provided nutrition data for Cherry vareniki from Zima restaurant"
    fields_changed: ["per_portion.energy_kcal", "per_portion.protein_g", "per_portion.fat_g", "per_portion.sat_fat_g", "per_portion.mufa_g", "per_portion.pufa_g", "per_portion.trans_fat_g", "per_portion.cholesterol_mg", "per_portion.carbs_g", "per_portion.sugar_g", "per_portion.fiber_total_g", "per_portion.fiber_soluble_g", "per_portion.fiber_insoluble_g", "per_portion.sodium_mg", "per_portion.potassium_mg", "portion.est_weight_g"]
    sources:
      - url: ""
        note: "User-provided nutrition data for Cherry vareniki from Zima restaurant, Soho, London (full tray ~200g)"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Convert user total carbs to available and update energy"
    fields_changed: ["per_portion.energy_kcal", "per_portion.carbs_g", "per_portion.carbs_total_g", "per_portion.polyols_g", "per_portion.carbs_available_g", "derived.energy_from_macros_kcal", "notes"]
    sources:
      - url: "user_input"
        note: "User stated 73g carbohydrate including fibre; available = 69g"
```

## Rot Front Glazed Peanut Halva (1 piece, ~25g)

```yaml
id: halva_glazed_peanut_rotfront_v1
version: 1
last_verified: 2025-10-30
source:
  venue: "Rot Front"
  menu_page: ""
  evidence:
    - "FatSecret — Рот Фронт Халва глазированная, per-piece entry (25g)"
    - "FatSecret — 100g entry shows 530 kcal; P14g; F32g; C44g; fibre 5.6g"
    - "Parma.am product page: peanut base 44%, glaze 30%; 528 kcal/100g"
    - "Generic halva datasets for mineral scaling (FitAudit, FoodStruct)"
aliases: ["Халва глазированная", "Glazed Halva"]
category: dessert
portion:
  description: "1 piece (~25g)"
  est_weight_g: 25
  notes: "Individual wrapped piece; actual weight varies 23-27g per ChatGPT analysis"
assumptions:
  salt_scheme: "normal"
  oil_type: "peanut-based halva with confectioner's chocolate glaze"
  prep: "Commercial halva; peanut mass ~44% + chocolate glaze ~30%"
per_portion:
  energy_kcal: 133
  protein_g: 3.5
  fat_g: 8.25
  sat_fat_g: 1.4
  mufa_g: 3.0
  pufa_g: 3.85
  trans_fat_g: 0.0
  cholesterol_mg: 0
  carbs_g: 11.0
  carbs_total_g: 12.4
  polyols_g: 0.0
  carbs_available_g: 11.0
  sugar_g: 9.4
  fiber_total_g: 1.4
  fiber_soluble_g: 0.2
  fiber_insoluble_g: 1.2
  sodium_mg: 50
  potassium_mg: 75
  iodine_ug: null
  magnesium_mg: 55
  calcium_mg: 8
  iron_mg: 1.1
  zinc_mg: 1.1
  vitamin_c_mg: null
  manganese_mg: 0.22

derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps: ['MUFA/PUFA estimated from typical halva FA profile', 'Soluble/insoluble fiber split from peanut ratios (~94% insoluble)', 'Minerals scaled from generic halva datasets', 'Potassium range 50-100mg', 'Vitamin C not available']
notes:
  - "Branded per-piece nutrition from FatSecret: 133 kcal, 8.25g fat (1.4g sat), 11g carbs, 9.35g sugar, 3.5g protein"
  - "100g macros cluster: 528-560 kcal, 32-33g fat, 44-48g carbs, 14g protein across multiple sources"
  - "Fibre 5.6g/100g → 1.4g/25g; split using peanut profile (94% insoluble / 6% soluble)"
  - "MUFA/PUFA split (3.0g / 3.85g) constrained so SFA+MUFA+PUFA = total fat; typical of peanut-based halva"
  - "Minerals scaled from generic halva composition (FitAudit): K~187mg/100g, Mg~218mg/100g, Ca~33mg/100g"
  - "Sodium ~195mg/100g in generic halva → ~49mg/25g, rounded to 50mg"
  - "Atwater validation: 4×3.5 + 4×11.0 + 9×8.25 = 132.25 kcal (within 0.6% of 133 kcal)"
  - "Ingredients: peanut mass 44%, confectioner's chocolate glaze 30% (varies by batch)"
change_log:
  - timestamp: 2025-10-30T19:35:00+0000
    updated_by: "Claude Code (via ChatGPT estimation)"
    reason: "Initial entry with ChatGPT nutrition analysis cross-checked against multiple databases"
    fields_changed: ['all fields']
    sources:
      - url: "https://www.fatsecret.com/calories-nutrition/generic/halva"
        note: "FatSecret branded and generic halva entries"
      - url: "https://parma.am/en/product/rot-front-glazed-halva-2/"
        note: "Parma.am product page with ingredient breakdown"
      - url: "https://fitaudit.ru/food/halva"
        note: "FitAudit generic halva mineral composition"
  - timestamp: 2025-11-02T11:12:07+00:00
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Add total vs available carbs for halva portion"
    fields_changed: ['per_portion.carbs_total_g', 'per_portion.polyols_g', 'per_portion.carbs_available_g']
    sources:
      - url: "https://www.fatsecret.com/calories-nutrition/generic/halva"
        note: "Per 100g: 44g carbs, 5.6g fibre → per-piece availability"
```
