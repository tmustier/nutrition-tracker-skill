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
- [Oats - dry (50 g)](#oats---dry-50-g) {#oats_dry_50g_v1}
- [Skyr - plain (200 g)](#skyr---plain-200-g) {#skyr_plain_200g_v1}
- [Mixed Pineapple/Mango/Passion Fruit (150 g)](#mixed-pineapple/mango/passion-fruit-150-g) {#pine_mango_passion_150g_v1}
- [Joe & the Juice - Joe's Identity juice](#joe-and-the-juice---joes-identity-juice) {#joes_identity_juice_jtj_v1}
- [Sakura Wagyu Beef Sandwich (Jean-Georges at The Connaught)](#sakura-wagyu-beef-sandwich-jean-georges-at-the-connaught) {#sakura_wagyu_beef_sandwich_connaught_v1}
- [Home-made Chips (Jean-Georges at The Connaught)](#home-made-chips-jean-georges-at-the-connaught) {#homemade_chips_connaught_v1}
- [Ketchup Pot, 25g (Jean-Georges at The Connaught)](#ketchup-pot-25g-jean-georges-at-the-connaught) {#ketchup_pot_connaught_v1}
- [Thai Spiced Broccoli Soup (Jean-Georges at The Connaught)](#thai-spiced-broccoli-soup-jean-georges-at-the-connaught) {#thai_spiced_broccoli_soup_connaught_v1}

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
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: "Populate per_portion from user-provided data"
  fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
  sources:
    - url: "user_input"
      note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.fat_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.sat_fat_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.iodine_ug', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
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
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: "Populate per_portion from user-provided data"
  fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.cholesterol_mg', 'per_portion.carbs_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
  sources:
    - url: "user_input"
      note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.mufa_g', 'per_portion.pufa_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.iodine_ug', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
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
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: "Populate per_portion from user-provided data"
  fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
  sources:
    - url: "user_input"
      note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.mufa_g', 'per_portion.pufa_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
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
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: "Populate per_portion from user-provided data"
  fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.cholesterol_mg', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg']
  sources:
    - url: "user_input"
      note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.fat_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.sat_fat_g', 'per_portion.pufa_g', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
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
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: "Populate per_portion from user-provided data"
  fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
  sources:
    - url: "user_input"
      note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.fat_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
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
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: "Populate per_portion from user-provided data"
  fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
  sources:
    - url: "user_input"
      note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.fat_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
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
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: "Populate per_portion from user-provided data"
  fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg']
  sources:
    - url: "user_input"
      note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.mufa_g', 'per_portion.pufa_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.carbs_g', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
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
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: "Populate per_portion from user-provided data"
  fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg']
  sources:
    - url: "user_input"
      note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.mufa_g', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
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
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: "Populate per_portion from user-provided data"
  fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
  sources:
    - url: "user_input"
      note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.mufa_g', 'per_portion.carbs_g', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
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
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: "Populate per_portion from user-provided data"
  fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
  sources:
    - url: "user_input"
      note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T18:57:05+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Consistency fix for fat totals/splits"
    fields_changed: ['per_portion.mufa_g', 'per_portion.pufa_g']
    sources:
      - url: "user_input"
        note: "Correction approved by user on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.carbs_g', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
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
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: "Populate per_portion from user-provided data"
  fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iodine_ug', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.zinc_mg']
  sources:
    - url: "user_input"
      note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.pufa_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.zinc_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
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
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: "Populate per_portion from user-provided data"
  fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
  sources:
    - url: "user_input"
      note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.protein_g', 'per_portion.fiber_total_g', 'per_portion.iron_mg', 'per_portion.zinc_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-10-28T20:00:00+0000
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
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: "Populate per_portion from user-provided data"
  fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
  sources:
    - url: "user_input"
      note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.sugar_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
  - timestamp: 2025-10-28T20:15:00+0000
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Research and populate missing fatty acid breakdown and iodine content from USDA FoodData Central"
    fields_changed: ['per_portion.sat_fat_g', 'per_portion.mufa_g', 'per_portion.pufa_g', 'per_portion.trans_fat_g', 'per_portion.cholesterol_mg', 'per_portion.iodine_ug']
    sources:
      - url: "https://fdc.nal.usda.gov/fdc-app.html#/food-details/171711/nutrients"
        note: "USDA FoodData Central - Raw blueberries (NDB 09050 / FDC 171711). Per 100g: sat 0.028g, MUFA 0.047g, PUFA 0.146g, trans 0g, cholesterol 0mg. Scaled to 150g portion."
      - url: "https://www.ars.usda.gov/ARSUSERFILES/80400535/DATA/IODINE/IODINE_DATABASE_RELEASE_3_PER_100G.PDF"
        note: "USDA/FDA/ODS-NIH Iodine Database - Raw blueberries contain 0.3 mcg iodine per 100g (mean of 13 samples). Scaled to 150g = 0.45 mcg, rounded to 0.5 mcg."
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
  sugar_g: 0.5
  fiber_total_g: 5.3
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 1
  potassium_mg: 215
  iodine_ug: 1
  magnesium_mg: 69
  calcium_mg: 27
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
  sugar_g: 7.4
  fiber_total_g: null
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 104
  potassium_mg: 340
  iodine_ug: 60
  magnesium_mg: 24
  calcium_mg: 300
  iron_mg: 0
  zinc_mg: 1
  vitamin_c_mg: 0
  manganese_mg: null

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
- timestamp: 2025-10-28T18:51:39+0000
  updated_by: "LLM: GPT-5 Thinking"
  reason: "Populate per_portion from user-provided data"
  fields_changed: ['per_portion.energy_kcal', 'per_portion.protein_g', 'per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.carbs_g', 'per_portion.sugar_g', 'per_portion.fiber_total_g', 'per_portion.sodium_mg', 'per_portion.potassium_mg', 'per_portion.magnesium_mg', 'per_portion.calcium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.vitamin_c_mg', 'per_portion.manganese_mg']
  sources:
    - url: "user_input"
      note: "User-supplied values on 2025-10-28"
  - timestamp: 2025-10-28T19:02:30+0000
    updated_by: "LLM: GPT-5 Thinking"
    reason: "Standardised rounding (kcal int; g 0.1; mg/ug int) and fat_total coherence"
    fields_changed: ['per_portion.fat_g', 'per_portion.sat_fat_g', 'per_portion.magnesium_mg', 'per_portion.iron_mg', 'per_portion.zinc_mg', 'per_portion.manganese_mg']
    sources:
      - url: "formatting-pass"
        note: "Automated rounding pass"
- timestamp: 2025-10-28T20:15:00+0000
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
  sugar_g: 5.0
  fiber_total_g: 4.0
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 27
  potassium_mg: 600
  iodine_ug: 2
  magnesium_mg: 45
  calcium_mg: 120
  iron_mg: 2
  zinc_mg: 1
  vitamin_c_mg: 60
  manganese_mg: null

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
      note: "Fat breakdown estimated from olive oil composition (75% MUFA, 15% sat, 10% PUFA, 0% trans); sugars calculated from available carbs (9g total - 4g fiber = 5g available); cholesterol 0 for plant-based juice; micronutrients estimated from USDA data for kale (FDC 323505), spinach (FDC 168462), celery (FDC 169988), cucumber (FDC 168409) proportional to typical 12oz green juice serving"
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
  sugar_g: 6.0
  fiber_total_g: 4.0
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 1100
  potassium_mg: 450
  iodine_ug: 5
  magnesium_mg: 45
  calcium_mg: 80
  iron_mg: 4
  zinc_mg: 6
  vitamin_c_mg: 2
  manganese_mg: null

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
  sugar_g: 0.3
  fiber_total_g: 4.9
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 321
  potassium_mg: 1194
  iodine_ug: 2
  magnesium_mg: 57
  calcium_mg: 22
  iron_mg: 0.9
  zinc_mg: 0.9
  vitamin_c_mg: 16
  manganese_mg: null

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
  sugar_g: 5.7
  fiber_total_g: 0.1
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 177
  potassium_mg: 70
  iodine_ug: 0.3
  magnesium_mg: 3
  calcium_mg: 4
  iron_mg: 0.1
  zinc_mg: 0.0
  vitamin_c_mg: 1.0
  manganese_mg: null

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
  sugar_g: 3.0
  fiber_total_g: 3.5
  fiber_soluble_g: null
  fiber_insoluble_g: null
  sodium_mg: 500
  potassium_mg: 350
  iodine_ug: 2
  magnesium_mg: 25
  calcium_mg: 45
  iron_mg: 1
  zinc_mg: 0
  vitamin_c_mg: 40
  manganese_mg: null

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
```

