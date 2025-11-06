## Sea Bass Fillet with Salsa Verde (Simple Health Kitchen)

```yaml
id: sea_bass_fillet_salsa_verde_shk_v1
version: 2
schema_version: 2
last_verified: 2025-11-05
source:
  venue: Simple Health Kitchen, Baker Street (London)
  menu_page: ""
  evidence:
    - "Simple Health Kitchen Nutrition PDF (Joel's Food and Beverage Label-14.pdf, page 28)"
    - "USDA FoodData Central for sea bass micronutrients (scaled to portion)"
aliases: []
category: main
portion:
  description: "grilled sea bass fillet with skin on"
  est_weight_g: 150
  notes: "PDF lists 'lemon juice dressing' but user mentioned 'salsa verde' - using PDF data"
assumptions:
  salt_scheme: "normal"
  oil_type: "olive_oil"
  prep: "grilled"
per_portion:
  energy_kcal: 184
  protein_g: 25.3
  fat_g: 7.4
  sat_fat_g: 1.8
  mufa_g: 3.9
  pufa_g: 1.5
  trans_fat_g: 0.0
  cholesterol_mg: 62
  carbs_total_g: 4.0
  carbs_available_g: 4.0
  sugar_g: 1.2
  fiber_total_g: 0.0
  fiber_soluble_g: 0.0
  fiber_insoluble_g: 0.0
  polyols_g: 0.0
  sodium_mg: 320
  potassium_mg: 380
  iodine_ug: 8
  magnesium_mg: 57
  calcium_mg: 15
  iron_mg: 1
  zinc_mg: 1
  vitamin_c_mg: 8
  manganese_mg: 0.02
  copper_mg: 0.04
  selenium_ug: 49
  vitamin_d_ug: 8
  vitamin_e_mg: 1
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 267
  chloride_mg: 0
  sulfur_g: 0.0
  vitamin_a_ug: 33
  vitamin_k_ug: 0
  vitamin_b1_mg: 0.13
  vitamin_b2_mg: 0.04
  vitamin_b3_mg: 2.7
  vitamin_b5_mg: 0.9
  vitamin_b6_mg: 0.37
  vitamin_b7_ug: 0
  vitamin_b9_ug: 11
  vitamin_b12_ug: 4.6
  choline_mg: 64
  omega3_epa_mg: 231
  omega3_dha_mg: 788
  omega3_ala_g: 0
  omega6_la_g: 0.1
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: medium
  gaps:
    - "Label energy (149 kcal) differs from Atwater calculation (183.8 kcal); may indicate measurement variance or rounding in original source"
notes:
  - "Macros from Simple Health Kitchen PDF: 25.3g P, 7.4g F, 4g C"
  - "PDF label energy: 149 kcal (differs from calculated value by 23%)"
  - "Atwater calculated energy: 4×25.3 + 9×7.4 + 4×4.0 + 2×0.0 = 183.8 kcal → stored as 184 kcal"
  - "Micronutrients estimated from USDA sea bass (cooked, ~107g) plus minimal dressing contribution"
  - "Fat breakdown estimated: olive oil dressing (~5g) + fish fat (~2.4g)"
  - "Carbs from lemon juice dressing (4g available carbs, minimal fiber)"
  - "Allergens listed in PDF: Fish, Sulphides"
change_log:
  - timestamp: "2025-11-03T12:45:00+00:00"
    updated_by: "LLM: Claude Sonnet 4.5"
    reason: "Initial population from Simple Health Kitchen nutrition PDF"
    fields_changed:
      - "all per_portion fields"
      - "source.evidence"
      - "portion.est_weight_g"
      - "assumptions"
    sources:
      - url: "Simple Health Kitchen PDF"
        note: "Page 28 - Sea Bass Fillet with lemon juice dressing"
  - timestamp: "2025-11-05T20:15:00+00:00"
    updated_by: "Claude Code Agent 5 (Sonnet 4.5)"
    reason: "Phase 3 enrichment: Added 15 missing nutrients from USDA sea bass data"
    fields_changed:
      - version
      - last_verified
      - manganese_mg (0 → 0.02)
      - copper_mg (0 → 0.04)
      - phosphorus_mg (0 → 267)
      - vitamin_a_ug (0 → 33)
      - vitamin_b1_mg (0 → 0.13)
      - vitamin_b2_mg (0 → 0.04)
      - vitamin_b3_mg (0 → 2.7)
      - vitamin_b5_mg (0 → 0.9)
      - vitamin_b6_mg (0 → 0.37)
      - vitamin_b9_ug (0 → 11)
      - vitamin_b12_ug (0 → 4.6)
      - choline_mg (0 → 64)
      - omega3_epa_mg (0 → 231)
      - omega3_dha_mg (0 → 788)
      - omega6_la_g (0 → 0.1)
    sources:
      - url: "https://foodstruct.com/food/fish-bass-striped-cooked-dryheat"
        note: "USDA-derived sea bass nutrition per 100g, scaled by 1.05x for ~105g fish portion"
      - note: "Scaling factor from selenium: 49µg (current) ÷ 47µg/100g (USDA) = 1.04 ≈ 1.05x"
      - note: "Excellent source of omega-3: EPA 231mg + DHA 788mg = 1019mg total per portion"
```
