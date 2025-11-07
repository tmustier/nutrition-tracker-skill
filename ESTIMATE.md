# Nutrition Estimation Guidelines

## ⚠️ Schema v2 Migration: Critical Context for Historical Data

### Important: 0 vs Unknown Values in Migrated Records

When the nutrition tracking system expanded from 24 to 52 nutrient fields (Schema v1 → v2 migration on 2025-11-05), **28 new nutrient fields** were added to all existing food bank records. These fields were automatically initialized to `0` during migration.

**For the 28 nutrients added during v2 migration, `0` does NOT mean "confirmed zero"** - it means **"unknown/not yet researched"**.

#### The 28 "Unknown" Nutrients Requiring Historical Research:
1. **Trace Minerals (7)**: `copper_mg`, `selenium_ug`, `chromium_ug`, `molybdenum_ug`, `phosphorus_mg`, `chloride_mg`*, `sulfur_g`*
2. **B-Complex Vitamins (9)**: `vitamin_b1_mg`, `vitamin_b2_mg`, `vitamin_b3_mg`, `vitamin_b5_mg`, `vitamin_b6_mg`, `vitamin_b7_ug`, `vitamin_b9_ug`, `vitamin_b12_ug`, `choline_mg`
3. **Fat-Soluble Vitamins (4)**: `vitamin_a_ug`, `vitamin_d_ug`, `vitamin_e_mg`, `vitamin_k_ug`
4. **Specific Fatty Acids (4)**: `omega3_epa_mg`, `omega3_dha_mg`, `omega3_ala_mg`, `omega6_la_mg`
5. **Ultra-Trace Minerals (4)**: `boron_mg`, `silicon_mg`, `vanadium_ug`, `nickel_ug` - **NOT TRACKED** (see section below)

*Chloride and sulfur are **derived/calculated** from sodium and protein respectively (see Derived Nutrients section below).

### 🎯 Research Priority for Historical Records

**HIGH PRIORITY** - Update These First:
- **B-vitamins** (B1, B2, B3, B6, B9, B12) - Critical for metabolism tracking
- **Vitamin D, A, E** - Common deficiencies, high impact
- **Selenium, copper** - Important trace minerals with narrow ranges
- **Omega-3 fatty acids** (EPA, DHA, ALA) - Anti-inflammatory tracking

**Future Claude Instructions**: For any pre-2025-11-05 food bank record showing `0` for B-vitamins, vitamin A/D/E, selenium, or copper: These are migration placeholders requiring research, NOT confirmed zeros. Prioritize updating these nutrients using USDA FoodData Central.

---

# 5-Step Workflow: Research, Create, Validate, Document, Commit

## Table of Contents

- [5-Step Workflow: Research, Create, Validate, Document, Commit](#5-step-workflow-research-create-validate-document-commit)
- [Command-Line Tools: Validation, Dish Creation, and Index Generation](#command-line-tools-validation-dish-creation-and-index-generation)
- [Quick Reference: Portions, Fatty Acids, Sources, and Validation Formulas](#quick-reference-portions-fatty-acids-sources-and-validation-formulas)
  - [Standard Portion Weights (Eggs, Bread, Vegetables, Soup)](#standard-portion-weights-eggs-bread-vegetables-soup)
  - [Fatty Acid Breakdown for Common Oils and Proteins](#fatty-acid-breakdown-for-common-oils-and-proteins)
  - [Data Source Reliability: Primary (Deliveroo, PDFs) vs. Secondary (USDA)](#data-source-reliability-primary-deliveroo-pdfs-vs-secondary-usda)
  - [Validation Formulas: Energy (Atwater), Fat Splits, Sodium Conversion](#validation-formulas-energy-atwater-fat-splits-sodium-conversion)
- [Nutrient Estimation Philosophy: Never Use Null, Always Estimate with Confidence](#nutrient-estimation-philosophy-never-use-null-always-estimate-with-confidence)
  - [Core Principle: 0 for True Zeros, Estimates for Everything Else. NEVER Use NULL](#core-principle-0-for-true-zeros-estimates-for-everything-else)
  - [4-Step Estimation Process: USDA Lookup, Scale, Document, Validate](#4-step-estimation-process-usda-lookup-scale-document-validate)
  - [Estimation Confidence Levels: HIGH (±5-15%), MEDIUM (±20-40%), LOW (±50-100%)](#estimation-confidence-levels-high-5-15-medium-20-40-low-50-100)
  - [UK-Specific: Dairy Iodine 2-3× Higher Than EU](#uk-specific-dairy-iodine-2-3-higher-than-eu)
  - [When to Use 0: Scientifically Impossible Nutrients](#when-to-use-0-scientifically-impossible-nutrients)
- [Research Documentation: Sources, Evidence, and Venue-Specific Guidelines](#research-documentation-sources-evidence-and-venue-specific-guidelines)
- [Carbohydrate Estimation: 3 Required Fields and UK vs. US Label Handling](#carbohydrate-estimation-3-required-fields-and-uk-vs-us-label-handling)
  - [Three Required Carb Fields: Total, Available, and Polyols](#three-required-carb-fields-total-available-and-polyols)
  - [UK Labels (Available Carbs) vs. US Labels (Total Carbs)](#uk-labels-available-carbs-vs-us-labels-total-carbs)
  - [Polyol Energy Factors: Maltitol 2.4 kcal/g, Erythritol 0.2 kcal/g](#polyol-energy-factors-maltitol-24-kcalg-erythritol-02-kcalg)
  - [Energy Calculation Formula: 4P + 9F + 4C + 2Fiber + 2.4Polyols](#energy-calculation-formula-4p--9f--4c--2fiber--24polyols)

---

**CRITICAL: Follow this complete workflow when adding new dishes. Do NOT skip steps. Complete full estimation workflow without asking the user for details; you can confirm these with the user after you're done.**

1. **Research thoroughly** (use multiple sources):
   - Start with delivery platforms (Deliveroo/Uber Eats) for calorie counts and ingredient lists
   - Search for venue PDFs, allergen menus, nutrition guides
   - Look at photos (venue website, Google Maps, social media) to estimate portions
   - Check reviews for portion size hints ("massive", "small", etc.)
   - Search for chef recipes, prep videos, or ingredient breakdowns
   - **Be creative**: if standard sources fail, use comparable dishes, USDA data, or ingredient analysis
   - **Goal**: Fill in ALL nutrition fields, not just calories and macros

2. **Create dish file and populate data**:
   - Use `scripts/new_dish_from_template.py` to create a new dish file in the appropriate folder:
     ```bash
     python scripts/new_dish_from_template.py \
       --dish_slug dish_name \
       --venue_slug venue_abbreviation \
       --venue_name "Full Venue Name" \
       --display_name "Dish Name (Venue)" \
       --category main
     ```
   - The script auto-detects the venue category and creates the file in the correct location
   - Fill in ALL available fields: macros, micronutrients, MUFA/PUFA breakdown
   - For estimated values, document your reasoning in `assumptions` and `notes`
   - Add comprehensive `source.evidence` with URLs and methods used
   - Update `change_log` with timestamp and what you added

3. **Validate before committing**:
   - Run `python scripts/validate_data_bank.py` (no arguments needed - scans all files)
   - Fix any errors (energy math, fat splits, sodium/salt)
   - Re-run validation until ALL items pass
   - The index (`data/food-data-bank-index.md`) will be auto-generated by the validation script

4. **Document research findings** (if applicable):
   - Add **venue-specific** learnings to the venue's `RESEARCH.md` file
   - Location: `data/food-data-bank/venues/{venue-name}/RESEARCH.md`
   - **ONLY include venue-specific information:**
     - Data sources for this venue (PDFs, Deliveroo quirks, menu websites)
     - Menu characteristics (signature ingredients, portion sizes, cooking styles)
     - Case studies of challenging dishes from this venue
   - **DO NOT include general methodology** (standard portions, validation formulas, fatty acid profiles) - those belong in this document

5. **Commit with clear message**:
   - Commit changes with descriptive message
   - Include calorie counts and what was added in the commit message

**Do NOT default to generic values. If exact data is unavailable, use ingredient-based estimation and document your method.**

---

# Command-Line Tools: Validation, Dish Creation, and Index Generation

**`validate_data_bank.py`**: Validates all dish files (energy math, fat splits, sodium/salt, required keys, negative values). Usage: `python scripts/validate_data_bank.py`

**`new_dish_from_template.py`**: Creates dish file in appropriate venue folder. Usage: `python scripts/new_dish_from_template.py --dish_slug NAME --venue_slug ABBR --venue_name "Full Name" --display_name "Dish (Venue)" --category CATEGORY`

**`generate_index.py`**: Regenerates food bank index (auto-called by validator). Usage: `python scripts/generate_index.py`

---

# Quick Reference: Portions, Fatty Acids, Sources, and Validation Formulas

## Standard Portion Weights (Eggs, Bread, Vegetables, Soup)

| Item | Weight | Notes |
|------|--------|-------|
| Eggs | 50g each | Standard large egg |
| Bread slice | 60g | 50-70g range; NOT 100g |
| Yogurt | 100-120g | Restaurant serving |
| Cooked vegetables | 50-80g | Side portion |
| Restaurant soup | ~300g | Standard bowl |

## Fatty Acid Breakdown for Common Oils and Proteins

**Common Oils:**
- **Olive oil:** ~73% MUFA, ~11% PUFA, ~14% SFA
- **Coconut:** ~83% SFA, ~6% MUFA, ~2% PUFA
- **Butter:** ~51% SFA, ~21% MUFA, ~3% PUFA

**Common Proteins:**
- **Wagyu beef:** ~40% MUFA, ~20% PUFA of total fat
- **Chicken:** ~45% MUFA, ~21% PUFA of total fat
- **Salmon:** ~29% MUFA, ~40% PUFA of total fat

## Data Source Reliability: Primary (Deliveroo, PDFs) vs. Secondary (USDA)

1. **PRIMARY (highest confidence):** Deliveroo UK, Uber Eats UK, venue nutrition PDFs, product labels
2. **SECONDARY (estimate/scale):** USDA FoodData Central, MyFoodData.com, comparable dishes from similar venues

## Validation Formulas: Energy (Atwater), Fat Splits, Sodium Conversion

- **Energy (Atwater):** `4×protein + 9×fat + 4×carbs_available + 2×fiber + 2.4×polyols` (tolerance ±5-8%)
- **Fat split:** `sat + MUFA + PUFA + trans ≤ total_fat`
- **Fat unassigned:** When `(sat + MUFA + PUFA + trans) / total_fat < 0.95` (>5% unassigned), document `fat_unassigned_g` in derived section. Represents glycerol backbone, phospholipids, and other minor lipid fractions not classified as SFA/MUFA/PUFA/trans.
- **Sodium/salt:** `salt_g = sodium_mg × 2.5 / 1000`
- **Finishing salt:** `0.5% of total dish weight` (≈ sodium_mg = salt_g × 400)

### Energy Consistency Principle

**Rule: Energy must always equal Atwater(macros).**

Since we estimate everything from USDA data and scaled component analysis, the energy should always be the mathematical result of the macronutrient values using the Atwater formula. Do not apply additional arbitrary adjustments to energy alone.

**Why this matters:**
- Macros are primary data (measured or scaled from USDA)
- Energy is derived from macros via Atwater formula
- Applying separate adjustments to energy creates inconsistency

**Common mistake to avoid:**
- ❌ Using USDA "cooked" macro values, then reducing energy further for "cooking losses"
- ❌ This double-counts losses since USDA "cooked" values already measure the final cooked product
- ✅ If evidence suggests different energy, reverse-engineer the macros themselves, not energy alone

**Example:** Cote de Boeuf uses USDA ribeye "cooked, grilled" data (already accounts for 25% cooking loss including water evaporation and fat dripping). Macros: 136.5g P, 134.7g F → Energy = 1,759 kcal. Do not reduce energy further.

---

# Nutrient Estimation Philosophy: Never Use Null, Always Estimate with Confidence

## Core Principle: 0 for True Zeros, Estimates for Everything Else. NEVER Use NULL

**Never use null. Always estimate with documented confidence.**

- `0` = TRUE ZERO (scientifically impossible, e.g., cholesterol in plants, fiber in animal products, B12 in unfortified plants)
- All other values = actual measurement or estimate (use USDA proxies, component analysis, or category averages if needed)
- Document estimation method and confidence level in `assumptions`

> **📚 Deep Dive:** Food preparation significantly affects nutrient content through cooking transformations, oil absorption, and water loss/gain. For comprehensive research on these mechanisms and retention factors, see [research/food-preparation/](research/food-preparation/).

## 4-Step Estimation Process: USDA Lookup, Scale, Document, Validate

1. **Search USDA FoodData Central** for closest match
2. **Scale to portion weight** (USDA values are per 100g)
3. **Document source and confidence** in `assumptions` field if non-obvious
4. **Validate energy**: 4P + 9F + 4C_avail + 2fiber + 2.4polyols

> **📚 Deep Dive:** When comparing intake to RDAs/DRIs, remember that RDAs already account for bioavailability and are based on as-consumed foods. For proper computational approaches including RAE, DFE, and confidence levels, see [research/rda-alignment/computational-nutrition-assessment.md](research/rda-alignment/computational-nutrition-assessment.md).

## Estimation Confidence Levels: HIGH (±5-15%), MEDIUM (±20-40%), LOW (±50-100%)

- **HIGH** (±5-15%): USDA direct match, nutrition label
- **MEDIUM** (±20-40%): USDA proxy, component calculation, UK dairy iodine
- **LOW** (±50-100%): category average, soil-dependent nutrients

## UK-Specific: Dairy Iodine 2-3× Higher Than EU

**Iodine in dairy**: UK cattle feed is fortified, resulting in 2-3× higher iodine than EU. UK dairy is MEDIUM-HIGH confidence for iodine estimates. For broader context on bioavailability variations and nutrient-specific handling, see [research/rda-alignment/](research/rda-alignment/).

## When to Use 0: Scientifically Impossible Nutrients

No estimation needed when value is scientifically zero:
- Cholesterol: plant foods
- B12: unfortified plant foods
- Fiber: pure animal products
- Iodine: pure oils/fats

## Ultra-Trace Minerals: NOT TRACKED (Boron, Silicon, Vanadium, Nickel)

**Status**: These 4 nutrients are set to `0` in all food bank entries (meaning **"not tracked"**, not "confirmed zero").

**Nutrients NOT tracked**:
- `boron_mg` - Bone health research, but no RDA established
- `silicon_mg` - Connective tissue/cardiovascular interest, but no RDA
- `vanadium_ug` - Insulin research, but no human requirements
- `nickel_ug` - Not established as essential in humans

**Why NOT tracked** (Decision: Nov 2025):
1. **No USDA coverage** - Not analyzed in FoodData Central or any major food database worldwide
2. **No established RDAs/AIs** - Institute of Medicine (2001): insufficient data for dietary recommendations
3. **Regional variation 10-100×** - Soil type affects content more than food type; cannot estimate without provenance data
4. **Deficiency extremely rare** - No confirmed human deficiency syndromes on normal diets
5. **Industry consensus** - Cronometer, MyFitnessPal, and all major nutrition apps do NOT track these
6. **High estimation risk** - False deficiency signals could lead to unnecessary supplementation

**For users interested in these nutrients**:
- **Boron**: Focus on plant-rich diet (nuts, legumes, fruits, vegetables). Typical intake 1-3mg/day is adequate.
- **Silicon**: Whole grains (oats, barley), green beans, mineral water. Typical intake 20-30mg/day.
- **Vanadium/Nickel**: No established health requirements; adequate in normal varied diet.

**See also**: `/home/user/nutrition-tracking/research/ultra-trace-minerals-decision.md` for full research analysis.

**Future**: If peer-reviewed RDAs are established and food databases improve coverage, these fields can be populated. Schema already supports them (52-nutrient structure in place).

## Derived Nutrients: Chloride and Sulfur

**Status**: CALCULATED from other nutrients (not directly from USDA).

### Chloride (from Sodium)
- **Formula**: `chloride_mg = sodium_mg × 1.54`
- **Rationale**: NaCl mass ratio (Cl: 35.45 g/mol, Na: 22.99 g/mol)
- **Confidence**: MEDIUM (±10-15%)
- **Assumption**: Sodium primarily from table salt; other sodium sources (sodium bicarbonate, MSG) would slightly overestimate
- **When to use**: For any food with sodium >50mg

### Sulfur (from Protein)
- **Formula**:
  - Animal products: `sulfur_g = protein_g × 0.01` (1.0% of protein)
  - Plant products: `sulfur_g = protein_g × 0.004` (0.4% of protein)
- **Rationale**: Sulfur-containing amino acids (methionine, cysteine) content
- **References**:
  - FAO (1991): *Protein Quality Evaluation* - Methionine+cysteine 2.5-3.5% of animal protein by weight
  - Sulfur comprises ~30% of methionine+cysteine molecular weight → 0.8-1.2% of protein
  - Plant proteins: Lower S-amino acid content (1.0-1.5% of protein) → 0.3-0.5% sulfur
  - Conservative estimates: 1.0% (animal), 0.4% (plant)
- **Confidence**: MEDIUM (±15-25%)
- **Variation**: Actual amino acid profile varies by protein source; egg whites are higher (~1.5%), some plant proteins lower
- **When to use**: For any food with protein >1g
- **Limitations**: Category inference based on file path keywords; composite dishes (e.g., vegan fish alternatives) may be misclassified as animal vs plant

**Documentation**: When using derived nutrients, add note to `change_log`:
```yaml
change_log:
  - timestamp: "2025-11-06T..."
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Added chloride (derived from sodium) and sulfur (derived from protein)"
    notes: "Chloride = 1.54 × sodium (NaCl ratio). Sulfur = 1% of protein (animal) or 0.4% (plant)."
```

# Research Documentation: Sources, Evidence, and Venue-Specific Guidelines
Always write down what was used. Put links/notes under `source.evidence`.

> **📚 Deep Dive:** For comprehensive scientific foundations on food preparation effects (cooking transformations, retention factors, weight changes) and proper RDA alignment (bioavailability, confidence levels, nutrient-specific conversions), see [research/](research/).

**For Simple Health Kitchen (SHK):**
- **Check both**: the **Deliveroo** page (names, **ingredient list**, photos) **and** the **SHK Calories PDF**
  (kcal and P/C/F). Names may differ slightly; match the prep, not just the label.
- **Anchor macros** (kcal, protein, carbs, fat) to the SHK source that exactly matches the dish:
  - If the PDF has the **exact same item**, prefer it for macros.
  - If the PDF lists a **different prep** (e.g., *Roasted Sweet Potatoes* vs *Wedges*), prefer Deliveroo macros
    for the dish actually ordered.
- **Use Deliveroo ingredients + photos** to infer: oil type, dressing, toppings, and portion reasonableness.
- **Compute the rest** (sodium, sugars, fibre, vitamins/minerals, MUFA/PUFA/trans) from ingredient profiles
  (e.g., USDA/MyFoodData) **scaled to the anchored macros**.

**For other venues (get creative, but be explicit):**
- Use delivery menus (Deliveroo/Uber Eats/Just Eat), venue PDFs, and **photos** (gallery, socials, Google Maps).
- Read **ingredient lists** and **allergens**; check **reviews** for portion hints (“huge bowl”, “tiny cup”).
- Look for **chef/restaurant recipes** or prep videos that reveal oil type, cooking method, or weights.
- Estimate **portion weight** from photos: plate diameter, container size, standard yields (e.g., pasta ~140–160 g per cup cooked; salmon cooks down ~25% from raw). State the method in `assumptions`.
- If nothing authoritative exists, choose the **closest canonical ingredient profile** and **record the choice**.

**Component-based estimation (REQUIRED for multi-ingredient dishes):**

When a dish has multiple identifiable components, use this method:

1. **List components and estimate known weights** using standard portions (see Quick Reference). Leave one component (usually fat/oil) as the "closing variable"

2. **Calculate sub-totals** for known components using USDA/MyFoodData, then solve for the unknown component to close the calorie gap
   - Example: Known components = 379 kcal, venue lists 592 kcal → 213 kcal gap → butter is ~7.2 kcal/g → ~30g (refined to 22.2g for exact match)

3. **Sum complete macros** from USDA profiles scaled to estimated weights. Add finishing salt (default assumption: 0.5% of total dish weight) to sodium

4. **Validate** energy within ±5-8% using Atwater formula (see Quick Reference). Document method in `notes`

**Example:** Chilli Poached Eggs (L'ETO, 592 kcal): 2 eggs (100g, 140 kcal) + yogurt (120g, 72 kcal) + sourdough (60g, 150 kcal) + kale (50g, 17 kcal) = 379 kcal. Butter: 213 kcal gap → ~30g (refined to 22.2g). Total weight 352g → finishing salt 1.76g = 704mg sodium. Total sodium 1,543mg (includes intrinsic from bread + butter). Validates to 597 kcal (±1%).

---

# Carbohydrate Estimation: 3 Required Fields and UK vs. US Label Handling

**Updated:** 2025-11-02 | **Scope:** All dishes, ingredients, and log entries

## Three Required Carb Fields: Total, Available, and Polyols

Every `per_portion` block must include three carbohydrate fields:

| Field | Meaning | Precision |
| --- | --- | --- |
| `carbs_total_g` | Total carbohydrate (includes fiber + polyols) | 0.1 g |
| `carbs_available_g` | Digestible / "net" carbohydrate | 0.1 g |
| `polyols_g` | Sugar alcohols (0.0 if none) | 0.1 g |

**Relationship:** `carbs_total = carbs_available + fiber + polyols` (within rounding)

**TRUE ZEROS:** For zero-carb animal proteins (meat, poultry, fish), use `0.0` for all carb and fiber fields.

## UK Labels (Available Carbs) vs. US Labels (Total Carbs)

**UK/EU labels** (Deliveroo, Tesco, SHK): Report *available* carbs → record directly in `carbs_available_g`, then derive `carbs_total_g = carbs_available_g + fiber_total_g + polyols_g`

**US/Canada sources** (USDA, Nutritionix): Report *total* carbs → record in `carbs_total_g`, then subtract fiber and polyols to get `carbs_available_g`

**Ambiguous sources:** Check change log for "net carbs" or "available carbs" mentions. If unclear, treat as US handling and document.

## Polyol Energy Factors: Maltitol 2.4 kcal/g, Erythritol 0.2 kcal/g

- Maltitol, sorbitol, xylitol: **2.4 kcal/g**
- Erythritol: **0.2 kcal/g**
- Other polyols: Use EU guidelines or default to 2.4 kcal/g

## Energy Calculation Formula: 4P + 9F + 4C + 2Fiber + 2.4Polyols

Always use: `energy_kcal = 4×protein + 9×fat + 4×carbs_available + 2×fiber + 2.4×polyols`

**Storage policy:** Store calculated energy in `per_portion.energy_kcal`. If venue/label differs by >±8%, note original value in `notes` field and document variance in `change_log`. Confirm source classification (UK vs US) and recheck macros before accepting variance.
