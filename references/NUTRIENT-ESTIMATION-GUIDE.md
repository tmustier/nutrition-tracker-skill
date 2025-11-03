# Nutrient Estimation Guide: Always Estimate, Never Use Zero as a Placeholder

**Date:** 2025-11-03
**Purpose:** Comprehensive guide for estimating missing nutrient values using confidence-based frameworks and reference data

---

## Executive Summary

**Core Philosophy: A low-confidence estimate is always better than 0 (unless 0 is scientifically true).**

This guide establishes a confidence-based estimation framework that eliminates the use of zero as a placeholder for unknown values. Every nutrient should be estimated to the best of our ability using available data sources, with the confidence level documented. Zero should ONLY be used when scientifically accurate (e.g., cholesterol in plants, fiber in meat, B12 in unfortified plants).

**Key Principle:** Missing data ≠ Zero data. All nutrients have some value in real foods. Our job is to estimate that value and document our confidence level.

---

## 1. CONFIDENCE-BASED ESTIMATION FRAMEWORK

### 1.1 The Four Confidence Levels

**HIGH CONFIDENCE (±5-15% error)**
- **Time Investment:** 5-15 minutes
- **Data Sources:**
  - Direct nutrition labels (UK/EU mandatory nutrients)
  - USDA Foundation Foods with direct analytical data
  - UK McCance & Widdowson analytical surveys
  - Manufacturer-provided data for specific products
- **When to Use:** Primary macros, mandatory label nutrients, well-documented foods
- **Example:** Packaged yogurt with complete label - all listed nutrients are HIGH confidence

**MEDIUM CONFIDENCE (±20-40% error)**
- **Time Investment:** 15-30 minutes
- **Data Sources:**
  - USDA component lookup with preparation adjustments
  - Recipe calculations from known ingredients
  - Comparable food matching (similar product, different brand)
  - Fatty acid profiles from oil type identification
- **When to Use:** Restaurant dishes with ingredient lists, cooked preparations, estimated component weights
- **Example:** Restaurant pasta dish - calculate from estimated pasta (200g), sauce components, cheese (30g)

**LOW CONFIDENCE (±50-100% error)**
- **Time Investment:** 5-10 minutes
- **Data Sources:**
  - Category average ranges (see `/references/iodine-content-by-category.yaml`)
  - Nutrient ratios from food type (see `/references/fiber-split-ratio-reference.yaml`)
  - Broad food group estimates
  - Extrapolation from similar foods with adjustments
- **When to Use:** Trace nutrients, highly variable nutrients, limited information available
- **Example:** Iodine in restaurant vegetable curry - use category range for "vegetables, non-iodine-rich"

**TRUE ZERO (100% certainty)**
- **Time Investment:** Instant (scientific fact)
- **Scientific Basis:**
  - Nutrient chemically impossible in food type
  - Confirmed absence (e.g., animal-specific nutrients in pure plant foods)
- **When to Use:** Only when scientifically justified
- **Examples:**
  - Cholesterol: 0g in plant-based foods (plants don't produce cholesterol)
  - Fiber: 0g in animal products (no cell walls in meat/dairy/eggs)
  - Carbohydrates: 0g in pure fats (oils, pure butter)
  - Vitamin B12: 0µg in unfortified plant foods (only bacteria/animals produce B12)
  - Polyols: 0g in unprocessed natural foods (only in sugar-free products)

### 1.2 Never Use Zero as a Placeholder

**WRONG APPROACH (Previous System):**
```yaml
# ❌ BAD: Using 0 when value is unknown
iodine_ug: 0  # Unknown, so set to 0
selenium_ug: 0  # Not on label, so set to 0
fiber_soluble_g: 0  # Don't have data, so set to 0
```

**CORRECT APPROACH (New System):**
```yaml
# ✅ GOOD: Always estimate with confidence level
iodine_ug: 15  # MEDIUM: Dairy present, using category range 10-20µg
selenium_ug: 8  # LOW: Estimated from meat content, UK average
fiber_soluble_g: 1.2  # LOW: 40% of total fiber per ratio table
```

**Key Distinction:**
- **"Unknown but present"** → Estimate with LOW/MEDIUM confidence
- **"Scientifically impossible"** → Use TRUE ZERO with documentation

### 1.3 Documentation Requirements

Every estimate must include confidence level in the quality tracking:

```yaml
quality:
  confidence: "medium"  # or "high", "low"
  assumptions:
    - "Iodine estimated from 100ml milk + 2 eggs = ~75µg (MEDIUM confidence)"
    - "Selenium estimated at 12µg based on 80g chicken breast (LOW confidence, UK soil)"
    - "Fiber split using 35/65 insoluble/soluble ratio for oats (LOW confidence)"
    - "Manganese estimated at 0.3mg from vegetable content (LOW confidence)"
  gaps:
    - "Vitamin D not estimable (no fortification info), set conservatively to 0.5µg (LOW)"
  data_sources:
    - "Soluble fiber ratio from /references/fiber-split-ratio-reference.yaml"
    - "Iodine range from /references/iodine-content-by-category.yaml"
```

---

## 2. SYSTEMATIC ESTIMATION BY NUTRIENT TYPE

### 2.1 Critical Macros & Energy (ALWAYS HIGH/MEDIUM CONFIDENCE)

| Nutrient | Estimation Method | Confidence | Time | Notes |
|----------|------------------|------------|------|-------|
| **Energy (kcal)** | Atwater calculation | HIGH | 2 min | Always calculate: 4P + 9F + 4C_avail + 2fiber + 2.4polyols |
| **Protein (g)** | Recipe calculation | HIGH | 5-10 min | USDA/McCance per ingredient; predictable |
| **Fat total (g)** | Recipe calculation | HIGH | 5-10 min | Sum of ingredients; visible fat estimable |
| **Carbs available (g)** | Label/calculation | HIGH | 2 min | UK/EU direct; US: subtract fiber from total |
| **Carbs total (g)** | Calculation | HIGH | 2 min | available + fiber + polyols |
| **Fiber total (g)** | Component lookup | HIGH/MEDIUM | 5-10 min | Well-documented; estimate from plant content |
| **Saturated fat (g)** | Fatty acid profiles | HIGH | 5 min | Known ratios for oils/fats; mandatory on labels |
| **Sugar (g)** | Component lookup | HIGH/MEDIUM | 5-10 min | Visible ingredients (fruit, added sugar) |
| **Sodium (mg)** | Salt calculation | MEDIUM | 5 min | 0.5% dish weight + intrinsic from components |

**Why These Matter:**
- Required for Atwater energy validation
- All tracked in health-profile.yaml targets
- Impact daily macro tracking
- Available on most UK/EU labels

**Never Use 0 For These (Exception: TRUE ZEROs only)**
- Protein: even oils have trace protein (0.1g per 100g)
- Fiber: estimate from any plant content (even small amounts)
- Sodium: restaurant dishes ALWAYS have salt (minimum 0.25% scheme)

### 2.2 Fat Quality Indicators (MEDIUM/HIGH CONFIDENCE)

| Nutrient | Estimation Method | Confidence | Time | Reference |
|----------|------------------|------------|------|-----------|
| **MUFA (g)** | Fatty acid profiles | MEDIUM/HIGH | 10 min | Oil type from ingredients → ratio table |
| **PUFA (g)** | Fatty acid profiles | MEDIUM/HIGH | 10 min | Same as MUFA (linked calculation) |
| **Trans fat (g)** | Profile lookup | MEDIUM | 5 min | Natural (dairy/meat) vs industrial; trace in UK |
| **Cholesterol (mg)** | Component lookup | HIGH | 5 min | Animal products only; 0 for plants (TRUE ZERO) |

**Fatty Acid Profile Standards:**
- **Olive oil:** ~73% MUFA, ~11% PUFA, ~14% SFA of total fat
- **Butter:** ~21% MUFA, ~3% PUFA, ~51% SFA of total fat
- **Rapeseed oil:** ~64% MUFA, ~28% PUFA, ~7% SFA of total fat
- **Salmon:** ~29% MUFA, ~40% PUFA, ~15% SFA of total fat
- **Chicken breast:** ~45% MUFA, ~21% PUFA, ~29% SFA of total fat

**Estimation Process:**
1. Calculate unsaturated fat: `unsat = total_fat - sat_fat - trans_fat`
2. Identify primary fat source from ingredients list
3. Apply ratio from table above
4. Document assumption and confidence level

**Time Estimate:** 10 minutes (5 min to identify oil type, 5 min to calculate splits)

### 2.3 Major Minerals (MEDIUM/LOW CONFIDENCE - ALWAYS ESTIMATE)

| Nutrient | Estimation Method | Confidence | Time | When to Use LOW vs MEDIUM |
|----------|------------------|------------|------|--------------------------|
| **Potassium (mg)** | Component lookup | MEDIUM | 10-15 min | HIGH: USDA data available; LOW: rough estimate from food type |
| **Calcium (mg)** | Component lookup | MEDIUM | 10-15 min | HIGH: dairy products; LOW: plant calcium estimates |
| **Iron (mg)** | Component lookup | MEDIUM | 10-15 min | HIGH: meat/fortified foods; LOW: plant-based dishes |
| **Zinc (mg)** | Component lookup | MEDIUM | 10-15 min | HIGH: meat/shellfish; LOW: plant-based sources |
| **Magnesium (mg)** | Component lookup | MEDIUM | 10-15 min | HIGH: nuts/whole grains; LOW: mixed dishes |

**Never Use 0 For These** - They're present in virtually all foods:
- Potassium: Even refined flour has ~100mg per 100g
- Calcium: All foods have trace calcium (bones, water, plants)
- Iron: Universal in plant and animal foods
- Zinc: Present in all protein-containing foods
- Magnesium: Universal in foods (chlorophyll, enzymes)

**Estimation Approach:**
1. **MEDIUM Confidence (Prefer this):**
   - Look up main components in USDA/McCance
   - Calculate weighted average based on component weights
   - Time: 10-15 minutes per mineral

2. **LOW Confidence (When time-limited):**
   - Use food category averages:
     - Meat dishes: ~300mg K, ~15mg Ca, ~2mg Fe, ~3mg Zn, ~25mg Mg per 100g
     - Vegetable dishes: ~250mg K, ~40mg Ca, ~1mg Fe, ~0.5mg Zn, ~20mg Mg per 100g
     - Dairy-based: ~150mg K, ~120mg Ca, ~0.1mg Fe, ~0.5mg Zn, ~12mg Mg per 100g
   - Adjust for portion size
   - Time: 5 minutes per mineral

### 2.4 Iodine (ALWAYS ESTIMATE - USE REFERENCE FILE)

**Reference File:** `/references/iodine-content-by-category.yaml`

**Never Use 0 For Iodine** - Always estimate using category ranges

| Food Category | Estimation Method | Confidence | Time | Range to Use |
|--------------|------------------|------------|------|--------------|
| **Dairy products** | Category range | MEDIUM | 5 min | 20-80µg per 100ml milk; 50-200µg per 100g cheese |
| **Eggs** | Fixed value | HIGH | 1 min | 25µg per egg (standard) |
| **Seafood/seaweed** | Category range | MEDIUM | 5 min | Fish: 50-200µg per 100g; Seaweed: 1000-3000µg per 100g |
| **Meat** | Low estimate | LOW | 3 min | 5-15µg per 100g |
| **Plant foods** | Category minimum | LOW | 3 min | 2-10µg per 100g (highly variable by soil) |
| **Processed with iodized salt** | Calculation | MEDIUM | 5 min | 77µg per 1g salt (full iodization) |

**Estimation Workflow:**
1. **Identify iodine-rich components:**
   - Dairy: Calculate from milk/cheese/yogurt quantity
   - Eggs: Count eggs × 25µg
   - Seafood: Use category range from YAML file

2. **For other foods:**
   - Check YAML file for category range
   - Use conservative mid-point estimate
   - Document as LOW confidence

3. **Salt consideration:**
   - UK: Most restaurant salt is NOT iodized (use 0 from salt)
   - Home cooking: If iodized salt specified, add 77µg per gram

**Example Calculation:**
```
Restaurant omelette (2 eggs, 20g cheese, 5g butter):
- Eggs: 2 × 25µg = 50µg (HIGH confidence)
- Cheese: 20g × 0.40µg/g = 8µg (MEDIUM confidence, mid-range)
- Butter: 5g × 0.10µg/g = 0.5µg (LOW confidence, category minimum)
- Total: 58.5µg → Round to 59µg (MEDIUM overall confidence)
- Time: 5 minutes
```

### 2.5 Selenium (LOW CONFIDENCE - ALWAYS ESTIMATE)

**Challenge:** Extreme soil variability, especially in UK (selenium-poor soil)

| Food Category | Estimation Method | Confidence | Time | UK-Specific Notes |
|--------------|------------------|------------|------|------------------|
| **Seafood** | USDA lookup | MEDIUM | 10 min | Less soil-dependent; use USDA values |
| **Brazil nuts** | Fixed value | HIGH | 1 min | 1917µg per 100g (one nut = ~20µg) |
| **Meat/poultry** | UK-adjusted | LOW | 5 min | Reduce USDA values by 30-50% for UK |
| **Eggs** | Category estimate | MEDIUM | 3 min | 15µg per egg (less variable than plants) |
| **Plant foods (UK)** | Conservative estimate | LOW | 5 min | 0.5-3µg per 100g; TRUE ZERO acceptable if no fortification |

**Acceptable Use of 0:** Selenium in UK-grown plant foods CAN be 0 with documentation:
```yaml
selenium_ug: 0  # TRUE ZERO - UK soil selenium-poor, no fortification (documented)
# OR prefer conservative LOW estimate:
selenium_ug: 1  # LOW confidence - minimal selenium in UK vegetables
```

**Better Practice:** Always estimate LOW rather than 0:
```yaml
selenium_ug: 2  # LOW confidence - conservative UK plant food estimate
```

**Estimation Approach:**
1. **MEDIUM Confidence:**
   - Seafood: Use USDA values directly (less soil-dependent)
   - Eggs: 15µg per egg (relatively stable)
   - Time: 5-10 minutes

2. **LOW Confidence:**
   - Meat: USDA value × 0.4 (UK soil adjustment)
   - Plant foods: 1-2µg per 100g (conservative baseline)
   - Time: 3-5 minutes

### 2.6 Fiber Splits (ALWAYS ESTIMATE - USE REFERENCE FILE)

**Reference File:** `/references/fiber-split-ratio-reference.yaml`

**Never Use 0 For Fiber Splits** - Always estimate from total fiber using ratios

| Food Type | Estimation Method | Confidence | Time | Typical Ratio |
|-----------|------------------|------------|------|---------------|
| **Grains/cereals** | Ratio table | MEDIUM | 5 min | Insoluble:Soluble = 70:30 to 80:20 |
| **Legumes** | Ratio table | MEDIUM | 5 min | Insoluble:Soluble = 65:35 to 70:30 |
| **Vegetables** | Ratio table | MEDIUM | 5 min | Insoluble:Soluble = 60:40 to 70:30 |
| **Fruits** | Ratio table | MEDIUM | 5 min | Insoluble:Soluble = 50:50 to 60:40 |
| **Nuts/seeds** | Ratio table | MEDIUM | 5 min | Insoluble:Soluble = 75:25 to 85:15 |

**Estimation Process:**
1. Determine total fiber (must be known first)
2. Identify primary fiber source (grain, fruit, vegetable, etc.)
3. Look up ratio in `/references/fiber-split-ratio-reference.yaml`
4. Calculate:
   - `fiber_insoluble_g = fiber_total_g × insoluble_ratio`
   - `fiber_soluble_g = fiber_total_g × soluble_ratio`
5. Document as MEDIUM confidence (ratio-based)

**Example:**
```
Oatmeal: 3.0g total fiber
- Look up in YAML: Oats have 35% soluble / 65% insoluble ratio
- fiber_soluble_g: 3.0 × 0.35 = 1.05g → 1.1g
- fiber_insoluble_g: 3.0 × 0.65 = 1.95g → 2.0g
- Note: "MEDIUM confidence - ratio from fiber-split-ratio-reference.yaml"
- Time: 5 minutes
```

**Special Cases:**
- **Mixed dishes:** Use weighted average of component ratios
- **Unknown fiber source:** Use 60:40 (insoluble:soluble) as conservative default
- **USDA has split data:** Use directly (HIGH confidence)

### 2.7 Trace Minerals (LOW CONFIDENCE - ALWAYS ESTIMATE)

| Nutrient | Estimation Method | Confidence | Time | When Present |
|----------|------------------|------------|------|--------------|
| **Manganese (mg)** | Component lookup | LOW/MEDIUM | 10 min | Whole grains, tea, nuts (0.5-2mg per 100g) |
| **Copper (mg)** | Component lookup | LOW/MEDIUM | 10 min | Shellfish, organ meats, nuts (0.1-1mg per 100g) |
| **Chromium (µg)** | Category estimate | LOW | 5 min | Meat, whole grains (1-5µg per 100g) |
| **Molybdenum (µg)** | Category estimate | LOW | 5 min | Legumes, grains (5-50µg per 100g) |

**Never Use 0** - All foods contain trace minerals

**Estimation Approach (when USDA data unavailable):**
1. **HIGH priority foods (rich sources):**
   - Nuts/seeds: Manganese 1-2mg, Copper 0.5-1mg per 100g
   - Whole grains: Manganese 0.5-1mg, Copper 0.2-0.4mg per 100g
   - Legumes: Manganese 0.5-1mg, Copper 0.3-0.6mg per 100g
   - Use MEDIUM confidence if component weights known

2. **LOW priority foods (trace amounts):**
   - Meat/dairy: Manganese 0.01-0.05mg, Copper 0.05-0.15mg per 100g
   - Refined grains: Manganese 0.1-0.3mg, Copper 0.1-0.2mg per 100g
   - Use LOW confidence with conservative estimates

3. **Conservative minimums (when very uncertain):**
   - Any food: Manganese 0.01mg, Copper 0.01mg per 100g (baseline)
   - Better than 0, acknowledges presence

**Time Investment:** 5-10 minutes per mineral (LOW confidence sufficient)

### 2.8 Vitamins (MEDIUM/LOW CONFIDENCE - ALWAYS ESTIMATE)

| Nutrient | Estimation Method | Confidence | Time | Special Considerations |
|----------|------------------|------------|------|----------------------|
| **Vitamin C (mg)** | Component lookup | MEDIUM/HIGH | 10 min | Fruits/veg; degrade 25-50% when cooked |
| **Vitamin A (µg RAE)** | Component lookup | MEDIUM | 10 min | Orange veg, dairy, liver; stable in cooking |
| **Vitamin D (µg)** | Category estimate | LOW | 5 min | Fatty fish (10-20µg), fortified dairy (1-2µg), else 0.1-0.5µg |
| **Vitamin E (mg)** | Component lookup | LOW/MEDIUM | 10 min | Nuts, seeds, oils (5-15mg per 100g); else 0.1-0.5mg |
| **Vitamin K (µg)** | Component lookup | MEDIUM | 10 min | Leafy greens (100-500µg), else 1-10µg |
| **B vitamins** | Component lookup | LOW/MEDIUM | 10-15 min | Variable; fortification important; see below |

**Vitamin C Special Handling:**
- Raw fruits/veg: Use USDA values (HIGH confidence)
- Cooked veg: Reduce by 40% (MEDIUM confidence)
- No fruit/veg: Use 0.5-2mg baseline (LOW confidence) - never pure 0

**Vitamin D Special Handling:**
- Fatty fish: 10-20µg per 100g (MEDIUM confidence)
- Fortified dairy: 1-2µg per 100ml (MEDIUM if fortification confirmed)
- Eggs: 1-2µg per egg (MEDIUM confidence)
- No rich sources: 0.1-0.5µg baseline (LOW confidence)
- TRUE ZERO: Only if confirmed no fortification AND no animal products

**B-Vitamin Complex (estimate all when possible):**
- **B1 (Thiamin):** Whole grains 0.2-0.5mg, meat 0.1-0.3mg per 100g
- **B2 (Riboflavin):** Dairy 0.2-0.4mg, meat 0.2-0.3mg per 100g
- **B3 (Niacin):** Meat 5-10mg, grains 1-3mg per 100g
- **B6 (Pyridoxine):** Meat 0.3-0.5mg, potatoes 0.2-0.3mg per 100g
- **B9 (Folate):** Leafy greens 50-150µg, legumes 100-200µg per 100g
- **B12 (Cobalamin):** Meat 1-5µg, dairy 0.5-1µg per 100g; TRUE ZERO for unfortified plants

**Time Investment:** 10-15 minutes for complete vitamin profile (LOW confidence acceptable)

### 2.9 TRUE ZEROS - Only Use When Scientifically Justified

**Acceptable TRUE ZEROS (document as such):**

| Nutrient | When 0 is TRUE | Documentation Required |
|----------|---------------|----------------------|
| **Cholesterol** | 100% plant-based foods | "TRUE ZERO - plant-based (cholesterol only in animals)" |
| **Fiber** | 100% animal products | "TRUE ZERO - animal product (no fiber in meat/dairy/eggs)" |
| **Carbohydrates** | Pure fats/oils | "TRUE ZERO - pure fat (no carbs in oil/butter)" |
| **Vitamin B12** | Unfortified plant foods | "TRUE ZERO - unfortified plant food (B12 only from bacteria/animals)" |
| **Polyols** | Unprocessed foods | "TRUE ZERO - no sugar alcohols in natural foods" |
| **Trans fat** | Minimal in UK foods | "TRUE ZERO - no hydrogenated oils (UK regulations)" or use 0.01-0.1g |

**Questionable Zeros (prefer LOW estimates):**
- **Iodine:** Better to estimate 2-5µg (LOW) than use 0
- **Selenium:** Better to estimate 1-2µg (LOW) for UK foods than use 0
- **Vitamin D:** Better to estimate 0.2-0.5µg (LOW) than use 0 (unless confirmed no animal products/fortification)
- **Manganese:** Better to estimate 0.01-0.05mg (LOW) than use 0
- **Copper:** Better to estimate 0.01-0.05mg (LOW) than use 0

---

## 3. REFERENCE FILES & SYSTEMATIC WORKFLOW

### 3.1 Reference Data Files (New Resources)

**Location:** `/home/user/nutrition-tracker-skill/references/`

1. **`iodine-content-by-category.yaml`**
   - Purpose: Category ranges for iodine estimation
   - Use when: Estimating iodine in any food
   - Confidence: MEDIUM (dairy/seafood), LOW (other categories)
   - Content: Food categories with µg ranges per 100g

2. **`fiber-split-ratio-reference.yaml`**
   - Purpose: Insoluble:soluble fiber ratios by food type
   - Use when: Total fiber known but split not available
   - Confidence: MEDIUM (ratio-based estimation)
   - Content: Food types with typical percentage splits

3. **`micronutrient-reference-ranges.yaml`** (if exists)
   - Purpose: Category ranges for trace minerals and vitamins
   - Use when: No USDA data available, need conservative estimates
   - Confidence: LOW (category-based)
   - Content: Food categories with typical ranges

**How to Use Reference Files:**
1. Load appropriate YAML file for nutrient
2. Find matching food category
3. Use mid-point of range for MEDIUM confidence
4. Use lower bound for LOW confidence
5. Document source in quality.data_sources

### 3.2 Systematic Estimation Workflow

**STEP 1: Identify Food Type & Available Data (5 min)**
```
Questions to answer:
□ Is nutrition label available? → Use label values (HIGH confidence)
□ Is venue calorie count available? → Anchor to this (Atwater validation)
□ Can I break into components? → Component-based estimation (MEDIUM confidence)
□ Is USDA/McCance match available? → Direct lookup (HIGH/MEDIUM confidence)
□ Is it a complex dish with limited data? → Category estimates (LOW confidence)
```

**STEP 2: Estimate Tier 1 (Critical Macros) (10-20 min)**
```
Required for all entries:
□ Energy (kcal) - Atwater calculation or label
□ Protein (g) - Recipe calculation or label
□ Fat total (g) - Recipe calculation or label
□ Carbs available (g) - UK/EU label or US total - fiber
□ Carbs total (g) - Calculation: available + fiber + polyols
□ Fiber total (g) - Component lookup or label
□ Saturated fat (g) - Fatty acid profiles or label
□ Sodium (mg) - Salt calculation + intrinsic
□ Sugar (g) - Component lookup or label
```

**STEP 3: Estimate Fat Quality (10-15 min)**
```
Important for tracked nutrients:
□ MUFA (g) - Identify oil type → apply ratio
□ PUFA (g) - Linked to MUFA (same ratio table)
□ Trans fat (g) - Natural sources or 0.01-0.1g baseline
□ Cholesterol (mg) - Animal products (lookup) or TRUE ZERO (plants)
□ Polyols (g) - Sugar-free products only, else TRUE ZERO
```

**STEP 4: Estimate Major Minerals (15-20 min)**
```
Never use 0 - always estimate:
□ Potassium (mg) - Component lookup or category estimate
□ Calcium (mg) - Dairy content or category estimate
□ Iron (mg) - Meat content or category estimate
□ Zinc (mg) - Protein sources or category estimate
□ Magnesium (mg) - Whole grains/nuts or category estimate
```

**STEP 5: Estimate Variable Nutrients (15-20 min)**
```
Use reference files:
□ Iodine (µg) - Check dairy/seafood/eggs → /references/iodine-content-by-category.yaml
□ Selenium (µg) - Check seafood/nuts → UK soil adjustment for plants
□ Fiber soluble (g) - Total fiber × ratio from /references/fiber-split-ratio-reference.yaml
□ Fiber insoluble (g) - Total fiber × ratio from /references/fiber-split-ratio-reference.yaml
□ Manganese (mg) - Component lookup or category minimum (0.01-0.05mg)
□ Copper (mg) - Component lookup or category minimum (0.01-0.05mg)
```

**STEP 6: Estimate Vitamins (10-15 min)**
```
Priority vitamins:
□ Vitamin C (mg) - Fruit/veg content, adjust for cooking
□ Vitamin A (µg RAE) - Orange veg, dairy, liver
□ Vitamin D (µg) - Fatty fish, fortified dairy, or baseline 0.2-0.5µg
□ Vitamin E (mg) - Nuts, seeds, oils, or baseline 0.1-0.5mg
□ Vitamin K (µg) - Leafy greens or baseline 1-10µg
□ B vitamins - Component lookup or category estimates
```

**STEP 7: Document & Validate (5-10 min)**
```
Quality tracking:
□ Set overall confidence level (high/medium/low)
□ Document all assumptions in quality.assumptions
□ List data sources (including reference files used)
□ Note any LOW confidence estimates in quality.gaps
□ Validate energy with Atwater formula (±5-8% tolerance)
□ Run validation script: validate_data_bank.py
```

**TOTAL TIME ESTIMATES:**
- **Packaged with label:** 20-30 minutes (most data provided)
- **Restaurant with Deliveroo data:** 45-60 minutes (component-based)
- **Simple ingredient (USDA lookup):** 15-25 minutes (direct lookup + estimates)
- **Complex dish, limited data:** 60-90 minutes (extensive estimation required)

### 3.3 Estimation Decision Tree

```
START: New food entry
│
├─ TIER 1 MACROS (Required - 10-20 min)
│  ├─ Label available? → Copy directly (HIGH confidence)
│  ├─ Venue calories? → Component-based calculation (MEDIUM confidence)
│  └─ USDA match? → Direct lookup (HIGH confidence)
│
├─ FAT QUALITY (Important - 10-15 min)
│  ├─ Label shows MUFA/PUFA? → Copy directly (HIGH confidence)
│  ├─ Can identify oil type? → Apply ratio table (MEDIUM confidence)
│  └─ Unknown oil? → Use mixed oil ratio 50/30 MUFA/PUFA (LOW confidence)
│
├─ MAJOR MINERALS (Important - 15-20 min)
│  ├─ USDA data available? → Component lookup (MEDIUM confidence)
│  ├─ Can estimate from components? → Calculate weighted average (MEDIUM confidence)
│  └─ Limited info? → Category estimates (LOW confidence) - NEVER use 0
│
├─ IODINE (Variable - 5-10 min)
│  ├─ Dairy/eggs/seafood present? → Use category ranges (MEDIUM confidence)
│  ├─ Other foods? → Use /references/iodine-content-by-category.yaml (LOW confidence)
│  └─ NEVER use 0 - always estimate minimum 1-5µg
│
├─ SELENIUM (Variable - 5-10 min)
│  ├─ Seafood/Brazil nuts? → Use USDA values (MEDIUM confidence)
│  ├─ Meat/eggs? → UK-adjusted estimates (LOW confidence)
│  └─ UK plants? → Conservative 1-2µg (LOW confidence) - or documented 0
│
├─ FIBER SPLITS (If fiber present - 5 min)
│  ├─ USDA has split? → Use directly (HIGH confidence)
│  └─ Only total fiber? → Use /references/fiber-split-ratio-reference.yaml (MEDIUM confidence)
│
├─ TRACE MINERALS (Nice to have - 10-15 min)
│  ├─ USDA data available? → Component lookup (MEDIUM confidence)
│  └─ No data? → Category minimums 0.01-0.05mg (LOW confidence) - NEVER use 0
│
└─ VITAMINS (Nice to have - 10-15 min)
   ├─ USDA data available? → Component lookup (MEDIUM confidence)
   ├─ Rich source identified? → Use typical values (MEDIUM confidence)
   └─ No rich source? → Conservative baseline (LOW confidence) - prefer LOW over 0
```

### 3.4 Confidence Level Decision Matrix

| Data Source | Tier 1 Macros | Fat Quality | Major Minerals | Iodine/Selenium | Trace Minerals | Vitamins |
|-------------|--------------|-------------|----------------|----------------|----------------|----------|
| **Direct label** | HIGH | HIGH | HIGH | HIGH | HIGH | HIGH |
| **USDA Foundation** | HIGH | HIGH | MEDIUM | MEDIUM | MEDIUM | MEDIUM |
| **Component calculation** | MEDIUM | MEDIUM | MEDIUM | MEDIUM | LOW | LOW |
| **Category ranges** | LOW | LOW | LOW | LOW | LOW | LOW |
| **Ratio tables** | N/A | MEDIUM | N/A | LOW | N/A | N/A |
| **Conservative minimum** | N/A | LOW | LOW | LOW | LOW | LOW |

---

## 4. NUTRIENT-BY-NUTRIENT DETAILED GUIDANCE

### 4.1 Iodine - ALWAYS ESTIMATE

**Core Principle:** Iodine is in all foods to varying degrees. Never use 0.

**Reference File:** `/references/iodine-content-by-category.yaml`

**Estimation by Food Type:**

**1. HIGH Iodine Foods (MEDIUM Confidence - 5 min)**
- **Dairy products:**
  - Milk: 30-60µg per 100ml (use 45µg midpoint)
  - Cheese: 30-80µg per 100g (use 50µg midpoint)
  - Yogurt: 30-60µg per 100g (use 45µg midpoint)
  - Butter: 5-10µg per 100g (use 7µg midpoint)

- **Eggs:**
  - Whole egg: 24-26µg per egg (use 25µg)
  - Consistent across most sources

- **Seafood:**
  - White fish (cod, haddock): 100-150µg per 100g
  - Oily fish (salmon): 50-100µg per 100g
  - Shellfish (prawns): 30-60µg per 100g
  - Seaweed: 1000-3000µg per 100g (extreme variability)

**2. MEDIUM Iodine Foods (LOW Confidence - 5 min)**
- **Meat:**
  - Beef, pork, chicken: 5-15µg per 100g (use 10µg midpoint)
  - Depends on animal feed (variable)

- **Grains:**
  - Bread: 10-50µg per 100g (UK varies by bakery)
  - Pasta: 5-15µg per 100g
  - Rice: 1-5µg per 100g

**3. LOW Iodine Foods (LOW Confidence - 3 min)**
- **Vegetables:**
  - Most vegetables: 2-10µg per 100g (use 5µg midpoint)
  - Highly variable by soil

- **Fruits:**
  - Most fruits: 1-5µg per 100g (use 3µg midpoint)
  - Very low but not zero

- **Legumes:**
  - Beans, lentils: 2-10µg per 100g (use 5µg midpoint)

**4. Iodized Salt Calculation (MEDIUM Confidence - 2 min)**
- **If iodized salt confirmed:**
  - 77µg iodine per 1g salt (full iodization)
  - UK caveat: Most restaurant salt NOT iodized (use 0 from salt)
  - Home cooking: Only add if specifically iodized salt used

**Worked Examples:**

**Example 1: Restaurant Scrambled Eggs on Toast**
```
Components:
- 2 eggs (100g): 2 × 25µg = 50µg (MEDIUM confidence)
- Toast (60g wheat bread): 60g × 0.20µg/g = 12µg (LOW confidence, mid-range)
- Butter (10g): 10g × 0.07µg/g = 0.7µg (MEDIUM confidence)
- Total: 62.7µg → Round to 63µg
- Confidence: MEDIUM overall
- Time: 5 minutes
```

**Example 2: Vegetable Curry**
```
Components:
- Mixed vegetables (200g): 200g × 0.05µg/g = 10µg (LOW confidence)
- Curry sauce (100g, tomato-based): 100g × 0.03µg/g = 3µg (LOW confidence)
- Rice (150g cooked): 150g × 0.02µg/g = 3µg (LOW confidence)
- Total: 16µg
- Confidence: LOW overall
- Time: 5 minutes
- Note: "Iodine estimated using category minimums from reference file (LOW confidence)"
```

**Example 3: Greek Yogurt Bowl**
```
Components:
- Greek yogurt (150g): 150g × 0.45µg/g = 67.5µg (MEDIUM confidence)
- Blueberries (50g): 50g × 0.03µg/g = 1.5µg (LOW confidence)
- Honey (10g): 10g × 0.02µg/g = 0.2µg (LOW confidence)
- Total: 69.2µg → Round to 69µg
- Confidence: MEDIUM overall (dairy dominates)
- Time: 5 minutes
```

**Key Takeaway:** Even if total iodine is uncertain, estimate based on components. A LOW confidence estimate (±50-100% error) is better than 0.

### 4.2 Selenium - ESTIMATE OR DOCUMENT ZERO

**Core Principle:** Selenium varies extremely by soil. UK foods are selenium-poor.

**When 0 is Acceptable (TRUE ZERO with documentation):**
```yaml
selenium_ug: 0  # TRUE ZERO - UK plant-based food, selenium-poor soil, no fortification documented
```

**Better Practice - Always Estimate:**
```yaml
selenium_ug: 1  # LOW confidence - conservative UK plant food baseline
```

**Estimation by Food Type:**

**1. HIGH Selenium Foods (MEDIUM Confidence - 5-10 min)**
- **Brazil nuts:**
  - 1917µg per 100g (USDA)
  - 1 nut (~5g) = ~96µg (extremely high!)
  - Use HIGH confidence (less soil-dependent)

- **Seafood:**
  - Tuna: 90-100µg per 100g
  - Salmon: 40-50µg per 100g
  - Cod: 30-40µg per 100g
  - Prawns: 40-50µg per 100g
  - Use USDA values (MEDIUM confidence, less soil-dependent)

**2. MEDIUM Selenium Foods (LOW Confidence - 5 min)**
- **Eggs:**
  - 15µg per egg (use consistently)
  - Depends on feed but relatively stable
  - MEDIUM confidence

- **Meat/Poultry (UK-adjusted):**
  - USDA values: 20-40µg per 100g
  - UK adjustment: Multiply by 0.4-0.6 (feed-dependent)
  - Beef: USDA 25µg → UK 10-15µg per 100g
  - Chicken: USDA 30µg → UK 12-18µg per 100g
  - Use LOW confidence (variable by farming)

**3. LOW Selenium Foods - UK Context (LOW Confidence - 3 min)**
- **UK-grown plants:**
  - Vegetables: 0.5-3µg per 100g (UK soil poor)
  - Grains: 1-5µg per 100g (depends on origin)
  - Fruits: 0.1-1µg per 100g
  - **Acceptable to use 0 with documentation** OR
  - **Prefer conservative estimate:** 1-2µg (LOW confidence)

- **Imported foods:**
  - May have higher selenium (US/Canadian grains)
  - Use 2-5µg per 100g (LOW confidence)

**Worked Examples:**

**Example 1: Tuna Salad**
```
Components:
- Tuna (80g): 80g × 0.95µg/g = 76µg (MEDIUM confidence, USDA seafood)
- Mixed salad (100g): 100g × 0.015µg/g = 1.5µg (LOW confidence, UK vegetables)
- Olive oil (10g): 10g × 0.0µg/g = 0µg (TRUE ZERO - pure fat)
- Total: 77.5µg → Round to 78µg
- Confidence: MEDIUM overall (tuna dominates)
- Time: 5 minutes
```

**Example 2: UK Vegetable Soup**
```
Components:
- Mixed vegetables (250g): 250g × 0.02µg/g = 5µg (LOW confidence, UK soil-adjusted)
- Vegetable stock (150ml): 150ml × 0.01µg/g = 1.5µg (LOW confidence)
- Bread roll (60g): 60g × 0.03µg/g = 1.8µg (LOW confidence, UK wheat)
- Total: 8.3µg → Round to 8µg
- Confidence: LOW overall
- Time: 5 minutes
- Alternative: Use 0 with documentation "UK vegetables, selenium-poor soil"
```

**Example 3: Chicken & Rice (UK)**
```
Components:
- Chicken breast (120g): 120g × 0.15µg/g = 18µg (LOW confidence, UK farming × 0.5 USDA)
- White rice (150g): 150g × 0.10µg/g = 15µg (MEDIUM confidence, imported rice)
- Vegetables (80g): 80g × 0.02µg/g = 1.6µg (LOW confidence, UK soil)
- Total: 34.6µg → Round to 35µg
- Confidence: LOW overall (multiple uncertain sources)
- Time: 10 minutes
```

**Key Takeaway:** Selenium 0 is acceptable for UK plant foods WITH documentation, but prefer LOW confidence estimate (1-5µg) when possible.

### 4.3 Fiber Splits - ALWAYS ESTIMATE WITH RATIOS

**Core Principle:** Never use 0 for fiber splits if total fiber is known.

**Reference File:** `/references/fiber-split-ratio-reference.yaml`

**Process (5 minutes):**
1. Ensure total fiber is known
2. Identify primary fiber source
3. Look up ratio in reference file
4. Calculate split
5. Document as MEDIUM confidence (ratio-based)

**Standard Ratios (Insoluble % : Soluble %):**

| Food Type | Insoluble:Soluble | Reference |
|-----------|------------------|-----------|
| **Oats** | 65:35 | YAML file |
| **Wheat (whole)** | 75:25 | YAML file |
| **Wheat (refined)** | 70:30 | YAML file |
| **Rice (brown)** | 85:15 | YAML file |
| **Legumes (beans)** | 65:35 | YAML file |
| **Legumes (lentils)** | 70:30 | YAML file |
| **Vegetables (general)** | 65:35 | YAML file |
| **Vegetables (cruciferous)** | 60:40 | YAML file |
| **Fruits (general)** | 50:50 | YAML file |
| **Fruits (berries)** | 55:45 | YAML file |
| **Fruits (apples/pears)** | 45:55 | YAML file |
| **Nuts** | 80:20 | YAML file |
| **Seeds** | 75:25 | YAML file |

**Mixed Dish Approach:**
- Calculate fiber contribution from each component
- Weight ratios by fiber amount
- Example: 60% wheat (75:25) + 40% vegetables (65:35) = 71:29 overall

**Worked Examples:**

**Example 1: Oatmeal (Simple)**
```
Given:
- fiber_total_g: 4.0g
- Primary source: Oats

Calculation:
- Look up in YAML: Oats = 65% insoluble / 35% soluble
- fiber_insoluble_g: 4.0 × 0.65 = 2.6g
- fiber_soluble_g: 4.0 × 0.35 = 1.4g
- Confidence: MEDIUM (ratio-based from reference file)
- Time: 2 minutes
```

**Example 2: Bean Soup (Simple)**
```
Given:
- fiber_total_g: 6.5g
- Primary source: Kidney beans

Calculation:
- Look up in YAML: Beans = 65% insoluble / 35% soluble
- fiber_insoluble_g: 6.5 × 0.65 = 4.2g
- fiber_soluble_g: 6.5 × 0.35 = 2.3g
- Confidence: MEDIUM (ratio-based from reference file)
- Time: 2 minutes
```

**Example 3: Granola Bar (Mixed)**
```
Given:
- fiber_total_g: 3.0g
- Components: 50% oats, 30% nuts, 20% dried fruit

Calculation method 1 (Weighted average):
- Oats 65:35, Nuts 80:20, Fruit 50:50
- Weighted insoluble%: (0.5 × 65) + (0.3 × 80) + (0.2 × 50) = 66.5%
- fiber_insoluble_g: 3.0 × 0.665 = 2.0g
- fiber_soluble_g: 3.0 × 0.335 = 1.0g
- Confidence: MEDIUM (ratio-based from reference file)
- Time: 5 minutes

Calculation method 2 (Conservative):
- Use dominant source ratio (oats: 65:35)
- fiber_insoluble_g: 3.0 × 0.65 = 2.0g (rounded)
- fiber_soluble_g: 3.0 × 0.35 = 1.0g (rounded)
- Confidence: MEDIUM
- Time: 2 minutes
```

**Example 4: Unknown Fiber Source (Conservative Default)**
```
Given:
- fiber_total_g: 2.5g
- Unknown primary source (mixed dish, unclear components)

Calculation:
- Use conservative default: 60% insoluble / 40% soluble
- fiber_insoluble_g: 2.5 × 0.60 = 1.5g
- fiber_soluble_g: 2.5 × 0.40 = 1.0g
- Confidence: LOW (conservative default ratio)
- Time: 2 minutes
- Note: "Fiber split using 60:40 default ratio (LOW confidence)"
```

**When USDA Has Split Data (Preferred):**
```
Given:
- USDA FDC 168917 (Raspberries) has both splits

Use directly:
- fiber_soluble_g: 0.9g (from USDA)
- fiber_insoluble_g: 5.3g (from USDA)
- fiber_total_g: 6.5g (sum, or use USDA total if slightly different)
- Confidence: HIGH (direct USDA analytical data)
- Time: 1 minute
```

**Key Takeaway:** Always estimate fiber splits using reference ratios. MEDIUM confidence is acceptable. Better than leaving at 0.

### 4.4 Manganese - ESTIMATE OR USE MINIMUM

**Core Principle:** All foods have trace manganese. Never use 0 without documentation.

**Estimation by Food Type (5-10 min):**

**1. HIGH Manganese Foods (MEDIUM Confidence)**
- **Nuts & seeds:**
  - Almonds, hazelnuts: 2-3mg per 100g
  - Pecans, walnuts: 3-4mg per 100g
  - Pumpkin seeds: 4-5mg per 100g
  - Use USDA values (MEDIUM confidence)

- **Whole grains:**
  - Oats: 3-4mg per 100g
  - Brown rice: 1-2mg per 100g
  - Whole wheat bread: 1-2mg per 100g
  - Use USDA values (MEDIUM confidence)

- **Tea:**
  - Brewed tea: 0.4-0.6mg per 100ml
  - Very consistent (MEDIUM confidence)

- **Legumes:**
  - Chickpeas, lentils: 1-2mg per 100g
  - Use USDA values (MEDIUM confidence)

**2. MEDIUM Manganese Foods (LOW Confidence)**
- **Leafy vegetables:**
  - Spinach, kale: 0.5-1mg per 100g
  - Use USDA or estimate 0.7mg (LOW confidence)

- **Other vegetables:**
  - Most vegetables: 0.1-0.5mg per 100g
  - Estimate based on type (LOW confidence)

- **Fruits:**
  - Berries: 0.2-0.5mg per 100g
  - Other fruits: 0.05-0.2mg per 100g
  - Use LOW confidence estimates

**3. LOW Manganese Foods (LOW Confidence)**
- **Meat & fish:**
  - 0.01-0.05mg per 100g
  - Use conservative minimum (LOW confidence)

- **Dairy:**
  - 0.003-0.01mg per 100g
  - Use conservative minimum (LOW confidence)

- **Refined grains:**
  - White rice, white bread: 0.1-0.5mg per 100g
  - Significant loss from refining
  - Use conservative estimate (LOW confidence)

**Conservative Minimums (When Very Uncertain):**
- **Any food:** 0.01mg per 100g (baseline)
- **Plant-based:** 0.05mg per 100g (higher baseline)
- **Whole grain present:** 0.5mg per 100g (moderate baseline)

**Worked Examples:**

**Example 1: Oatmeal with Berries**
```
Components:
- Oats (40g dry): 40g × 3.5mg/100g = 1.4mg (MEDIUM confidence, USDA)
- Blueberries (50g): 50g × 0.3mg/100g = 0.15mg (LOW confidence, estimate)
- Milk (100ml): 100ml × 0.005mg/100ml = 0.005mg (LOW confidence, trace)
- Total: 1.555mg → Round to 1.6mg
- Confidence: MEDIUM overall (oats dominate)
- Time: 5 minutes
```

**Example 2: Restaurant Chicken Salad**
```
Components:
- Chicken breast (120g): 120g × 0.02mg/100g = 0.024mg (LOW confidence, trace)
- Mixed greens (80g): 80g × 0.3mg/100g = 0.24mg (LOW confidence, estimate)
- Vegetables (60g): 60g × 0.2mg/100g = 0.12mg (LOW confidence, estimate)
- Olive oil (10g): 10g × 0.01mg/100g = 0.001mg (LOW confidence, trace)
- Total: 0.385mg → Round to 0.4mg
- Confidence: LOW overall
- Time: 5 minutes
- Note: "Manganese estimated from vegetable content (LOW confidence)"
```

**Example 3: White Rice Dish (Minimal Manganese)**
```
Components:
- White rice (150g): 150g × 0.3mg/100g = 0.45mg (LOW confidence, refined grain)
- Chicken (100g): 100g × 0.02mg/100g = 0.02mg (LOW confidence, trace)
- Sauce (50g): 50g × 0.05mg/100g = 0.025mg (LOW confidence, baseline)
- Total: 0.495mg → Round to 0.5mg
- Confidence: LOW overall
- Time: 5 minutes
- Alternative: Use 0.1mg as conservative baseline if very uncertain
```

**When to Use Conservative Minimum:**
```yaml
# If very uncertain about components:
manganese_mg: 0.1  # LOW confidence - conservative baseline for 300g mixed dish
# Note in assumptions: "Manganese: conservative 0.1mg baseline (LOW confidence, limited data)"
```

**Key Takeaway:** Prefer LOW confidence estimates (0.1-0.5mg) over 0. USDA data available for many whole foods (use MEDIUM confidence).

### 4.5 Copper - ESTIMATE OR USE MINIMUM

**Core Principle:** Similar to manganese - all foods have trace copper. Never use 0.

**Estimation by Food Type (5-10 min):**

**1. HIGH Copper Foods (MEDIUM Confidence)**
- **Shellfish:**
  - Oysters: 3-8mg per 100g (extremely high!)
  - Crab, prawns: 0.5-1mg per 100g
  - Use USDA values (MEDIUM confidence)

- **Organ meats:**
  - Liver: 10-15mg per 100g (extremely high!)
  - Use USDA values (MEDIUM confidence)

- **Nuts & seeds:**
  - Cashews: 2mg per 100g
  - Sunflower seeds: 1.8mg per 100g
  - Almonds: 1mg per 100g
  - Use USDA values (MEDIUM confidence)

- **Legumes:**
  - Lentils, chickpeas: 0.5-0.8mg per 100g
  - Use USDA values (MEDIUM confidence)

**2. MEDIUM Copper Foods (LOW Confidence)**
- **Whole grains:**
  - Brown rice: 0.2mg per 100g
  - Whole wheat: 0.3-0.4mg per 100g
  - Use USDA or estimate (MEDIUM/LOW confidence)

- **Dark chocolate:**
  - 1.5-2mg per 100g
  - Use USDA values (MEDIUM confidence)

- **Mushrooms:**
  - 0.3-0.5mg per 100g
  - Use USDA or estimate (LOW confidence)

**3. LOW Copper Foods (LOW Confidence)**
- **Meat & poultry:**
  - Beef, chicken: 0.05-0.15mg per 100g
  - Use conservative estimate (LOW confidence)

- **Fish:**
  - Most fish: 0.05-0.1mg per 100g
  - Use conservative estimate (LOW confidence)

- **Dairy:**
  - Milk, cheese: 0.01-0.03mg per 100g
  - Use conservative estimate (LOW confidence)

- **Vegetables & fruits:**
  - Most vegetables: 0.05-0.2mg per 100g
  - Most fruits: 0.05-0.1mg per 100g
  - Use conservative estimates (LOW confidence)

**Conservative Minimums (When Very Uncertain):**
- **Any food:** 0.01mg per 100g (baseline)
- **Plant-based:** 0.05mg per 100g (higher baseline)
- **Nuts/seeds present:** 0.5mg per 100g (moderate baseline)

**Worked Examples:**

**Example 1: Lentil Soup**
```
Components:
- Lentils (80g dry weight): 80g × 0.75mg/100g = 0.6mg (MEDIUM confidence, USDA)
- Vegetables (150g): 150g × 0.1mg/100g = 0.15mg (LOW confidence, estimate)
- Vegetable stock (250ml): 250ml × 0.02mg/100ml = 0.05mg (LOW confidence, trace)
- Total: 0.8mg
- Confidence: MEDIUM overall (lentils dominate)
- Time: 5 minutes
```

**Example 2: Grilled Salmon**
```
Components:
- Salmon (150g): 150g × 0.08mg/100g = 0.12mg (LOW confidence, estimate)
- Vegetables (100g): 100g × 0.1mg/100g = 0.1mg (LOW confidence, estimate)
- Olive oil (10g): 10g × 0.0mg/100g = 0mg (TRUE ZERO - pure fat)
- Total: 0.22mg → Round to 0.2mg
- Confidence: LOW overall
- Time: 5 minutes
```

**Example 3: Cashew Stir-Fry**
```
Components:
- Cashews (30g): 30g × 2mg/100g = 0.6mg (MEDIUM confidence, USDA)
- Chicken (100g): 100g × 0.08mg/100g = 0.08mg (LOW confidence, estimate)
- Vegetables (150g): 150g × 0.1mg/100g = 0.15mg (LOW confidence, estimate)
- Rice (150g): 150g × 0.1mg/100g = 0.15mg (LOW confidence, refined grain)
- Total: 0.98mg → Round to 1.0mg
- Confidence: MEDIUM overall (cashews provide significant copper)
- Time: 10 minutes
```

**When to Use Conservative Minimum:**
```yaml
# If very uncertain about components:
copper_mg: 0.05  # LOW confidence - conservative baseline for 250g mixed dish
# Note in assumptions: "Copper: conservative 0.05mg baseline (LOW confidence, limited data)"
```

**Key Takeaway:** Copper more concentrated in specific foods (shellfish, nuts, organ meats). Use LOW confidence estimates (0.05-0.2mg) for general dishes, MEDIUM for high-copper foods.

### 4.6 Vitamin B12 - TRUE ZERO FOR PLANTS

**Core Principle:** B12 only produced by bacteria and bioaccumulates in animals. TRUE ZERO for unfortified plant foods.

**TRUE ZERO Cases (Document as such):**
```yaml
vitamin_b12_ug: 0  # TRUE ZERO - unfortified plant food (B12 only from bacteria/animals)
```

**Estimation by Food Type (5 min):**

**1. HIGH B12 Foods (MEDIUM/HIGH Confidence)**
- **Meat & organ meats:**
  - Liver: 60-85µg per 100g (extremely high!)
  - Beef: 2-3µg per 100g
  - Pork: 0.5-1µg per 100g
  - Chicken: 0.3-0.5µg per 100g
  - Use USDA values (MEDIUM confidence)

- **Fish & seafood:**
  - Clams: 84µg per 100g (extremely high!)
  - Mackerel: 8-12µg per 100g
  - Salmon: 3-4µg per 100g
  - Tuna: 2-3µg per 100g
  - Use USDA values (MEDIUM confidence)

- **Eggs:**
  - Whole egg: 0.5-1µg per egg
  - Use 0.7µg as standard (MEDIUM confidence)

- **Dairy:**
  - Milk: 0.4-0.5µg per 100ml
  - Cheese: 1-2µg per 100g (concentrated)
  - Yogurt: 0.5-1µg per 100g
  - Use USDA values (MEDIUM confidence)

**2. Fortified Plant Foods (MEDIUM Confidence - Check Labels)**
- **Fortified cereals:**
  - Variable: 0.5-6µg per serving
  - Must check specific product label
  - Use label value (HIGH confidence if listed)

- **Fortified plant milks:**
  - Usually fortified: 0.4-1.5µg per 100ml
  - Check label (use HIGH confidence if listed)

- **Nutritional yeast (fortified):**
  - 2-8µg per tablespoon
  - Check packaging (variable fortification)

**3. Unfortified Plant Foods (TRUE ZERO)**
- **All unfortified vegetables, fruits, grains, legumes, nuts, seeds:**
```yaml
vitamin_b12_ug: 0  # TRUE ZERO - plant food (B12 only in animal products/fortified foods)
```

**Worked Examples:**

**Example 1: Scrambled Eggs with Toast**
```
Components:
- 2 eggs (100g): 2 × 0.7µg = 1.4µg (MEDIUM confidence, standard value)
- Toast (60g wheat bread): 0µg (TRUE ZERO - unfortified plant food)
- Butter (10g): 10g × 0.01µg/g = 0.1µg (LOW confidence, trace from dairy)
- Total: 1.5µg
- Confidence: MEDIUM overall (eggs well-documented)
- Time: 3 minutes
```

**Example 2: Salmon with Vegetables**
```
Components:
- Salmon (120g): 120g × 3.5µg/100g = 4.2µg (MEDIUM confidence, USDA)
- Broccoli (100g): 0µg (TRUE ZERO - plant food)
- Rice (150g): 0µg (TRUE ZERO - unfortified grain)
- Total: 4.2µg
- Confidence: MEDIUM overall
- Time: 3 minutes
```

**Example 3: Vegan Buddha Bowl**
```
Components:
- Quinoa (150g): 0µg (TRUE ZERO - plant food)
- Chickpeas (80g): 0µg (TRUE ZERO - plant food)
- Vegetables (150g): 0µg (TRUE ZERO - plant food)
- Tahini (20g): 0µg (TRUE ZERO - plant food)
- Total: 0µg
- Confidence: HIGH (TRUE ZERO confirmed - no animal products or fortification)
- Time: 2 minutes
- Note: "TRUE ZERO - vegan meal with no fortified foods"
```

**Example 4: Fortified Cereal**
```
Given:
- Cereal label states: "50% RDA of B12 per serving (1.5µg)"
- Portion: 40g cereal + 150ml fortified soy milk

Components:
- Cereal (40g): 1.5µg (HIGH confidence - label value)
- Fortified soy milk (150ml): 150ml × 0.38µg/100ml = 0.57µg (HIGH confidence - label value)
- Total: 2.07µg → Round to 2.1µg
- Confidence: HIGH (direct label values)
- Time: 2 minutes
```

**Key Takeaway:** B12 is the ONLY micronutrient where 0 is commonly TRUE ZERO (unfortified plant foods). Always check for fortification. Animal products all contain B12 (estimate if not on label).

### 4.7 Other Vitamins - ALWAYS ESTIMATE

**Core Principle:** Most vitamins present in trace amounts in all foods. Avoid 0 except TRUE ZEROS.

**Quick Reference (10-15 min for full vitamin profile):**

**Vitamin C (5-10 min):**
- **Rich sources:** Citrus (40-60mg/100g), berries (20-40mg/100g), peppers (80-120mg/100g)
- **Moderate:** Cooked veg (10-30mg/100g, reduced from cooking)
- **Low:** Meat/dairy (1-5mg/100g), grains (0.5-2mg/100g)
- **Never pure 0:** Use 0.5-1mg baseline if no rich sources

**Vitamin A as RAE (5-10 min):**
- **Rich sources:** Liver (8000-9000µg/100g!), sweet potato (700-900µg/100g), carrots (800-900µg/100g)
- **Moderate:** Dairy (50-150µg/100g), eggs (140-160µg/100g)
- **Low:** Non-orange vegetables (10-100µg/100g), meat (1-20µg/100g)
- **Never pure 0:** Use 1-5µg baseline

**Vitamin D (5 min):**
- **Rich sources:** Fatty fish (10-20µg/100g), fortified dairy (1-2µg/100ml)
- **Moderate:** Eggs (1-2µg/100g), butter (0.7-1µg/100g)
- **Low:** Mushrooms (0.1-0.5µg/100g if sun-exposed), most other foods (0.1-0.5µg/100g)
- **TRUE ZERO acceptable:** Unfortified plant foods without sun-exposure
- **Better practice:** Use 0.2-0.5µg baseline (LOW confidence)

**Vitamin E (5 min):**
- **Rich sources:** Nuts (5-25mg/100g), seeds (10-35mg/100g), plant oils (10-20mg/100g)
- **Moderate:** Avocado (2mg/100g), spinach (2mg/100g)
- **Low:** Most other foods (0.1-1mg/100g)
- **Never pure 0:** Use 0.1-0.5mg baseline

**Vitamin K (5 min):**
- **Rich sources:** Leafy greens (100-500µg/100g!), cruciferous veg (100-200µg/100g)
- **Moderate:** Other vegetables (10-50µg/100g), plant oils (50-200µg/100g)
- **Low:** Meat/dairy (1-10µg/100g), grains (1-5µg/100g)
- **Never pure 0:** Use 1-5µg baseline

**B-Vitamins Complex (10-15 min for all):**
- **B1 (Thiamin):** Whole grains (0.2-0.5mg/100g), meat (0.1-0.3mg/100g), baseline 0.05mg
- **B2 (Riboflavin):** Dairy (0.2-0.4mg/100g), meat (0.2-0.3mg/100g), baseline 0.05mg
- **B3 (Niacin):** Meat (5-10mg/100g), grains (1-3mg/100g), baseline 0.5mg
- **B5 (Pantothenic acid):** Meat (1-2mg/100g), legumes (1-1.5mg/100g), baseline 0.2mg
- **B6 (Pyridoxine):** Meat (0.3-0.5mg/100g), potatoes (0.2-0.3mg/100g), baseline 0.05mg
- **B9 (Folate):** Leafy greens (50-150µg/100g), legumes (100-200µg/100g), baseline 10µg
- **B12:** See section 4.6 above (TRUE ZERO for unfortified plants)

**Conservative Baseline Approach (Quick - 5 min):**
```yaml
# If very time-limited and no rich sources identified:
vitamin_c_mg: 1.0  # LOW confidence - baseline
vitamin_a_ug_rae: 5  # LOW confidence - baseline
vitamin_d_ug: 0.3  # LOW confidence - baseline (or 0 if confirmed no animal/fortification)
vitamin_e_mg: 0.2  # LOW confidence - baseline
vitamin_k_ug: 5  # LOW confidence - baseline
thiamin_b1_mg: 0.05  # LOW confidence - baseline
riboflavin_b2_mg: 0.05  # LOW confidence - baseline
niacin_b3_mg: 0.5  # LOW confidence - baseline
pyridoxine_b6_mg: 0.05  # LOW confidence - baseline
folate_b9_ug: 10  # LOW confidence - baseline
vitamin_b12_ug: 0  # TRUE ZERO if no animal products/fortification
```

**Key Takeaway:** Vitamins require most research but worthwhile for tracked nutrients. Use LOW confidence baselines rather than 0 when uncertain. Focus on vitamin C (most tracked) first.

---

## 5. PRACTICAL EXAMPLES - COMPLETE WORKFLOWS

### 5.1 Example 1: Restaurant Pasta Carbonara (45-60 min)

**Given Information:**
- Deliveroo calorie count: 820 kcal
- Ingredients list: Pasta, eggs, pancetta, Parmesan, black pepper
- Photo: ~350g total dish

**STEP 1: Anchor to Calories & Identify Components (5 min)**
```
Calorie target: 820 kcal
Component estimates:
- Pasta (cooked): 200g
- Pancetta: 40g
- Eggs: 2 whole (100g)
- Parmesan: 30g
- Olive oil (residual): 10g
```

**STEP 2: Tier 1 Macros (15 min - MEDIUM confidence)**
```
Component breakdown using USDA:
- Pasta (200g): 62g carbs, 10g protein, 1.2g fat, 300 kcal
- Pancetta (40g): 0g carbs, 8g protein, 16g fat, 176 kcal
- Eggs (100g): 1g carbs, 13g protein, 10g fat, 140 kcal
- Parmesan (30g): 1.2g carbs, 12g protein, 9g fat, 129 kcal
- Olive oil (10g): 0g carbs, 0g protein, 10g fat, 90 kcal

Totals:
- protein_g: 43
- fat_g: 46.2
- carbs_available_g: 64.2
- fiber_total_g: 3.0 (from pasta)
- carbs_total_g: 67.2 (available + fiber)

Energy check: (4 × 43) + (9 × 46.2) + (4 × 64.2) + (2 × 3) = 835 kcal
Variance: +15 kcal (+1.8%) ✓ Within tolerance

Sodium: Pancetta (400mg) + Parmesan (180mg) + finishing salt (350g × 0.005 × 400 = 700mg) = 1280mg
saturated_fat_g: Pancetta (6g) + Eggs (3g) + Parmesan (6g) + Oil (1.5g) = 16.5g
sugar_g: Minimal in all components = 1g

Confidence: MEDIUM overall (component-based estimation)
```

**STEP 3: Fat Quality (10 min - MEDIUM confidence)**
```
MUFA calculation:
- Pancetta (40g × 7.2g fat/100g × 50% MUFA): 1.4g
- Eggs (10g fat × 38% MUFA): 3.8g
- Parmesan (9g fat × 20% MUFA): 1.8g
- Olive oil (10g × 73% MUFA): 7.3g
- Total MUFA: 14.3g

PUFA calculation:
- Pancetta (40g × 7.2g fat/100g × 11% PUFA): 0.3g
- Eggs (10g fat × 16% PUFA): 1.6g
- Parmesan (9g fat × 3% PUFA): 0.3g
- Olive oil (10g × 11% PUFA): 1.1g
- Total PUFA: 3.3g

trans_fat_g: 0.1 (natural from dairy/meat, trace)
cholesterol_mg: Eggs (372mg) + Pancetta (30mg) + Parmesan (27mg) = 429mg
polyols_g: 0 (TRUE ZERO - no sugar alcohols)

Confidence: MEDIUM (fatty acid profiles from oil type identification)
```

**STEP 4: Major Minerals (15 min - LOW/MEDIUM confidence)**
```
Potassium (MEDIUM confidence - USDA component lookup):
- Pasta (200g × 44mg/100g): 88mg
- Pancetta (40g × 150mg/100g): 60mg
- Eggs (100g × 138mg/100g): 138mg
- Parmesan (30g × 92mg/100g): 28mg
- Total: 314mg

Calcium (MEDIUM confidence - USDA):
- Pasta (200g × 21mg/100g): 42mg
- Eggs (100g × 56mg/100g): 56mg
- Parmesan (30g × 1184mg/100g): 355mg
- Total: 453mg

Iron (MEDIUM confidence - USDA):
- Pasta (200g × 1.3mg/100g): 2.6mg
- Pancetta (40g × 0.8mg/100g): 0.3mg
- Eggs (100g × 1.75mg/100g): 1.8mg
- Total: 4.7mg

Zinc (MEDIUM confidence - USDA):
- Pasta (200g × 0.5mg/100g): 1.0mg
- Pancetta (40g × 1.5mg/100g): 0.6mg
- Eggs (100g × 1.3mg/100g): 1.3mg
- Parmesan (30g × 2.9mg/100g): 0.9mg
- Total: 3.8mg

Magnesium (MEDIUM confidence - USDA):
- Pasta (200g × 18mg/100g): 36mg
- Pancetta (40g × 10mg/100g): 4mg
- Eggs (100g × 12mg/100g): 12mg
- Parmesan (30g × 44mg/100g): 13mg
- Total: 65mg

Confidence: MEDIUM overall (USDA data available for all components)
```

**STEP 5: Variable Nutrients (15 min - LOW/MEDIUM confidence)**
```
Iodine (MEDIUM confidence - using /references/iodine-content-by-category.yaml):
- Eggs (2 eggs): 2 × 25µg = 50µg
- Parmesan (30g × 0.40µg/g): 12µg
- Pancetta (40g × 0.10µg/g): 4µg
- Total: 66µg
- Confidence: MEDIUM (dairy/eggs well-documented)

Selenium (LOW confidence - UK soil adjustment):
- Pancetta (40g × 0.15µg/g UK-adjusted): 6µg
- Eggs (2 × 15µg): 30µg
- Parmesan (30g × 0.15µg/g): 4.5µg
- Pasta (200g × 0.02µg/g UK wheat): 4µg
- Total: 44.5µg → 45µg
- Confidence: LOW (multiple uncertain sources)

Fiber splits (MEDIUM confidence - using /references/fiber-split-ratio-reference.yaml):
- Total fiber: 3.0g (from pasta)
- Pasta = wheat, ratio 75:25 insoluble:soluble
- fiber_insoluble_g: 3.0 × 0.75 = 2.3g
- fiber_soluble_g: 3.0 × 0.25 = 0.8g
- Confidence: MEDIUM (ratio-based from reference file)

Manganese (LOW confidence - conservative estimates):
- Pasta (200g × 0.5mg/100g): 1.0mg
- Eggs (100g × 0.03mg/100g): 0.03mg
- Other components: trace
- Total: 1.0mg (rounded)
- Confidence: LOW (pasta estimate, others trace)

Copper (LOW confidence - conservative estimates):
- Pasta (200g × 0.15mg/100g): 0.3mg
- Pancetta (40g × 0.08mg/100g): 0.03mg
- Eggs (100g × 0.07mg/100g): 0.07mg
- Total: 0.4mg
- Confidence: LOW (conservative estimates)
```

**STEP 6: Vitamins (15 min - LOW confidence)**
```
Vitamin C (LOW confidence):
- Eggs (100g × 0mg/100g): 0mg (TRUE ZERO - no plant content in eggs)
- No vegetables in dish
- Estimate: 0.5mg baseline (trace in cheese)
- Confidence: LOW

Vitamin A (MEDIUM confidence - USDA):
- Eggs (100g × 160µg/100g): 160µg
- Parmesan (30g × 200µg/100g): 60µg
- Pancetta (40g × 10µg/100g): 4µg
- Total: 224µg
- Confidence: MEDIUM (eggs/dairy well-documented)

Vitamin D (MEDIUM confidence):
- Eggs (2 × 1µg): 2µg
- Parmesan (30g × 0.5µg/100g): 0.15µg
- Total: 2.2µg
- Confidence: MEDIUM (eggs well-documented)

Vitamin E (LOW confidence):
- Olive oil (10g × 14mg/100g): 1.4mg
- Eggs (100g × 1mg/100g): 1mg
- Other: trace
- Total: 2.4mg
- Confidence: LOW (estimates)

Vitamin K (LOW confidence):
- Eggs (100g × 4µg/100g): 4µg
- Parmesan (30g × 2.5µg/100g): 0.8µg
- Other: trace
- Total: 5µg
- Confidence: LOW (conservative)

B-vitamins (skip or use conservative baselines - would add 10 min):
- thiamin_b1_mg: 0.2 (pasta fortification likely)
- riboflavin_b2_mg: 0.4 (eggs, dairy)
- niacin_b3_mg: 3.0 (meat, eggs)
- pyridoxine_b6_mg: 0.2 (meat, eggs)
- folate_b9_ug: 30 (pasta, eggs)
- vitamin_b12_ug: 1.5 (eggs, dairy, meat)
- Confidence: LOW (category estimates)
```

**STEP 7: Document & Validate (5 min)**
```yaml
quality:
  confidence: "medium"
  assumptions:
    - "Component weights estimated from photo and typical portions"
    - "Finishing salt at 0.5% (350g × 0.005 = 1.75g salt)"
    - "Olive oil residual estimated at 10g"
    - "Fatty acid profiles from oil and meat types"
    - "Iodine from eggs (2 × 25µg) and cheese (MEDIUM confidence)"
    - "Selenium UK-adjusted for meat, eggs well-documented (LOW overall)"
    - "Fiber split using wheat ratio 75:25 from reference file"
    - "Trace minerals: manganese and copper estimated (LOW confidence)"
    - "Vitamins: A and D from eggs/dairy (MEDIUM), others LOW confidence"
  gaps:
    - "B-vitamins using conservative category estimates (LOW confidence)"
  data_sources:
    - "USDA FDC for component nutritional profiles"
    - "/references/iodine-content-by-category.yaml for iodine"
    - "/references/fiber-split-ratio-reference.yaml for fiber split"
    - "Deliveroo calorie count (820 kcal) - validated within 1.8%"

validation:
  - atwater_check: "835 kcal calculated vs 820 kcal stated = +1.8% ✓"
  - fat_split_check: "sat (16.5) + MUFA (14.3) + PUFA (3.3) + trans (0.1) = 34.2g vs fat_total (46.2g) = 12g unassigned (acceptable for missing fatty acids)"
  - sodium_check: "1280mg total (intrinsic + finishing salt)"
```

**Total Time: 55 minutes**
**Overall Confidence: MEDIUM**
**Key Nutrients Estimated: ALL (complete profile)**

---

### 5.2 Example 2: UK Packaged Greek Yogurt (20-25 min)

**Given Information:**
- UK label (per 100g): Energy 97 kcal, Protein 9.2g, Carbs 4.8g, Fat 4.5g, Saturates 2.9g, Sugar 4.8g, Salt 0.13g
- Ingredients: Pasteurised milk, yogurt cultures (L. bulgaricus, S. thermophilus)
- Portion consumed: 150g

**STEP 1: Direct Label Values (5 min - HIGH confidence)**
```
Scale to 150g portion:
- energy_kcal: 97 × 1.5 = 145.5 → 146
- protein_g: 9.2 × 1.5 = 13.8
- fat_g: 4.5 × 1.5 = 6.8
- saturated_fat_g: 2.9 × 1.5 = 4.4
- carbs_available_g: 4.8 × 1.5 = 7.2 (UK label = available)
- sugar_g: 4.8 × 1.5 = 7.2 (all carbs are sugar in plain yogurt)
- salt_g: 0.13 × 1.5 = 0.195 → 0.2
- sodium_mg: 0.2 × 400 = 78

Calculate total carbs (no fiber in dairy):
- fiber_total_g: 0.0 (TRUE ZERO - dairy product)
- polyols_g: 0.0 (TRUE ZERO - no sugar alcohols)
- carbs_total_g: 7.2 (same as available, no fiber)

Atwater validation:
(4 × 13.8) + (9 × 6.8) + (4 × 7.2) + (2 × 0) = 145 kcal ✓ Matches label (146 rounded)

Confidence: HIGH (direct label values)
```

**STEP 2: Fat Quality (5 min - MEDIUM confidence)**
```
Label only shows saturated fat. Estimate MUFA/PUFA from dairy profiles:
- Total fat: 6.8g
- Saturated: 4.4g
- Unsaturated: 6.8 - 4.4 = 2.4g

Dairy ratio (approximate): 65% saturated, 30% MUFA, 5% PUFA
Of unsaturated fraction: ~85% MUFA, ~15% PUFA
- MUFA: 2.4 × 0.85 = 2.0g
- PUFA: 2.4 × 0.15 = 0.4g

Check: 4.4 + 2.0 + 0.4 = 6.8g ✓

trans_fat_g: 0.1 (natural trans in dairy, trace)
cholesterol_mg: ~15mg per 100g dairy = 15 × 1.5 = 23mg
polyols_g: 0.0 (TRUE ZERO)

Confidence: MEDIUM (ratio-based from dairy profile)
```

**STEP 3: Major Minerals (10 min - MEDIUM confidence from USDA)**
```
Greek yogurt typical values (USDA per 100g), scale to 150g:

potassium_mg: 141 × 1.5 = 212mg
calcium_mg: 110 × 1.5 = 165mg (Greek yogurt less than regular due to straining)
iron_mg: 0.04 × 1.5 = 0.06 → 0.1mg
zinc_mg: 0.52 × 1.5 = 0.78 → 0.8mg
magnesium_mg: 11 × 1.5 = 17mg

Confidence: MEDIUM (USDA typical values for Greek yogurt)
```

**STEP 4: Variable Nutrients (10 min - MEDIUM/LOW confidence)**
```
Iodine (MEDIUM confidence - /references/iodine-content-by-category.yaml):
- Yogurt category: 30-60µg per 100g
- Use midpoint: 45µg per 100g
- Total: 45 × 1.5 = 68µg
- Confidence: MEDIUM (dairy well-documented for iodine)

Selenium (LOW confidence - UK dairy):
- UK dairy: ~3-5µg per 100g (lower than US due to feed)
- Use conservative: 4µg per 100g
- Total: 4 × 1.5 = 6µg
- Confidence: LOW (UK soil/feed variability)

Fiber splits (TRUE ZERO):
- fiber_soluble_g: 0.0 (TRUE ZERO - dairy)
- fiber_insoluble_g: 0.0 (TRUE ZERO - dairy)

Manganese (LOW confidence):
- Dairy: ~0.004mg per 100g (trace)
- Total: 0.004 × 1.5 = 0.006 → 0.01mg (baseline)
- Confidence: LOW (trace amount)

Copper (LOW confidence):
- Dairy: ~0.009mg per 100g
- Total: 0.009 × 1.5 = 0.014 → 0.01mg
- Confidence: LOW (trace amount)
```

**STEP 5: Vitamins (10 min - MEDIUM confidence from USDA)**
```
vitamin_c_mg: 0.0 (TRUE ZERO - no plant content in plain yogurt)

vitamin_a_ug_rae: 28 × 1.5 = 42µg (MEDIUM confidence, USDA dairy value)

vitamin_d_ug: 0.0 (TRUE ZERO - not fortified, label would state if fortified)
Alternative if uncertain: 0.3 (LOW confidence baseline for dairy)

vitamin_e_mg: 0.04 × 1.5 = 0.06 → 0.1mg (LOW confidence, trace)

vitamin_k_ug: 0.2 × 1.5 = 0.3 → 0.3µg (LOW confidence, trace)

B-vitamins (MEDIUM confidence - dairy well-documented):
- thiamin_b1_mg: 0.029 × 1.5 = 0.04mg
- riboflavin_b2_mg: 0.233 × 1.5 = 0.35mg (dairy rich in B2)
- niacin_b3_mg: 0.208 × 1.5 = 0.31mg
- pantothenic_acid_b5_mg: 0.331 × 1.5 = 0.50mg
- pyridoxine_b6_mg: 0.063 × 1.5 = 0.09 → 0.1mg
- folate_b9_ug: 7 × 1.5 = 11µg
- vitamin_b12_ug: 0.75 × 1.5 = 1.1µg (dairy good source)

Confidence: MEDIUM (USDA Greek yogurt profile)
```

**STEP 6: Document & Validate (5 min)**
```yaml
quality:
  confidence: "high"
  assumptions:
    - "UK label values scaled to 150g portion consumed"
    - "MUFA/PUFA estimated from typical dairy fatty acid profile (85:15 ratio)"
    - "Cholesterol estimated at 15mg per 100g (typical dairy)"
    - "Iodine: 45µg per 100g midpoint from dairy category (MEDIUM confidence)"
    - "Selenium: 4µg per 100g conservative UK dairy estimate (LOW confidence)"
    - "Trace minerals (manganese, copper) using baseline dairy values (LOW confidence)"
    - "Vitamins from USDA Greek yogurt profile (MEDIUM confidence)"
  gaps:
    - "Vitamin D not fortified (TRUE ZERO) - label would state if fortified"
  data_sources:
    - "Fage Total 0% Greek Yogurt UK label (per 100g)"
    - "USDA FDC 170903 (Yogurt, Greek, plain, nonfat) for micronutrients"
    - "/references/iodine-content-by-category.yaml for iodine estimation"

validation:
  - atwater_check: "(4 × 13.8) + (9 × 6.8) + (4 × 7.2) = 145 kcal vs label 146 kcal ✓"
  - fat_split_check: "4.4 + 2.0 + 0.4 + 0.1 = 6.9g vs 6.8g total fat ✓ (rounding)"
  - carbs_check: "UK label shows available carbs; no fiber in dairy (TRUE ZERO)"
```

**Total Time: 25 minutes**
**Overall Confidence: HIGH (label data) with MEDIUM for estimates**
**Key Nutrients Estimated: Fat splits, all micronutrients**

---

### 5.3 Example 3: Restaurant Vegetable Curry (60-70 min)

**Given Information:**
- Deliveroo calorie count: 580 kcal
- Ingredients: Mixed vegetables, coconut milk, curry spices, tomato base, served with rice
- Photo: ~400g curry + 200g rice = 600g total

**STEP 1: Anchor to Calories & Identify Components (10 min)**
```
Calorie target: 580 kcal for full dish
Need to break down curry + rice:

Estimated components:
Curry (400g total):
- Mixed vegetables (200g): onions, peppers, cauliflower, peas
- Coconut milk (100g): primary fat source
- Tomato base (70g)
- Curry spices (5g)
- Garlic, ginger (15g)
- Oil for cooking (10g)

Rice (200g cooked white rice)
```

**STEP 2: Tier 1 Macros - Component Calculation (20 min - MEDIUM confidence)**
```
Curry components (using USDA):
- Mixed vegetables (200g): 14g carbs, 4g protein, 0.4g fat, 72 kcal
- Coconut milk (100g): 6g carbs, 2g protein, 24g fat, 230 kcal
- Tomato base (70g): 4g carbs, 0.6g protein, 0.1g fat, 18 kcal
- Curry spices (5g): 1g carbs, 0.2g protein, 0.2g fat, 8 kcal
- Garlic/ginger (15g): 2g carbs, 0.3g protein, 0g fat, 10 kcal
- Cooking oil (10g): 0g carbs, 0g protein, 10g fat, 90 kcal

Rice (200g cooked):
- White rice (200g): 56g carbs, 5g protein, 0.4g fat, 260 kcal

Subtotal: 688 kcal (108 kcal over target)
Adjustment needed - reduce coconut milk to 70g:
- Coconut milk (70g): 4.2g carbs, 1.4g protein, 16.8g fat, 161 kcal

Revised total:
Curry:
- carbs: 14 + 4.2 + 4 + 1 + 2 = 25.2g
- protein: 4 + 1.4 + 0.6 + 0.2 + 0.3 = 6.5g
- fat: 0.4 + 16.8 + 0.1 + 0.2 + 10 = 27.5g
- kcal: 72 + 161 + 18 + 8 + 10 + 90 = 359 kcal

Rice:
- carbs: 56g, protein: 5g, fat: 0.4g, kcal: 260

Total dish:
- protein_g: 6.5 + 5 = 11.5
- fat_g: 27.5 + 0.4 = 27.9 → 28
- carbs_available_g: 25.2 + 56 = 81.2
- fiber_total_g: 6g (vegetables 4g + rice 0.8g + spices 1.2g)
- carbs_total_g: 81.2 + 6 = 87.2
- polyols_g: 0.0 (TRUE ZERO)

Atwater check: (4 × 11.5) + (9 × 28) + (4 × 81.2) + (2 × 6) = 590 kcal
Variance: +10 kcal (+1.7%) ✓ Within tolerance

saturated_fat_g: Coconut milk (14.8g) + oil (1.5g) = 16.3g
sodium_mg: Vegetables intrinsic (40mg) + tomato (70mg) + finishing salt (600g × 0.005 × 400 = 1200mg) = 1310mg
sugar_g: Vegetables (8g) + tomato (2g) = 10g

Confidence: MEDIUM (component-based with weight adjustments to match calories)
```

**STEP 3: Fat Quality (10 min - MEDIUM confidence)**
```
Coconut milk fatty acids (distinctive profile):
- Total fat from coconut milk: 16.8g
- Coconut oil profile: ~86% SFA, ~6% MUFA, ~2% PUFA
- Already counted saturated: 14.8g
- MUFA from coconut: 16.8 × 0.06 = 1.0g
- PUFA from coconut: 16.8 × 0.02 = 0.3g

Cooking oil (assume vegetable oil):
- Total fat: 10g
- Assume mixed vegetable oil: ~20% SFA, ~50% MUFA, ~30% PUFA
- Already counted saturated: 1.5g
- MUFA from oil: 10 × 0.50 = 5.0g
- PUFA from oil: 10 × 0.30 = 3.0g

Rice fat (minimal):
- MUFA: 0.1g, PUFA: 0.1g (trace)

Totals:
- MUFA: 1.0 + 5.0 + 0.1 = 6.1g
- PUFA: 0.3 + 3.0 + 0.1 = 3.4g
- trans_fat_g: 0.0 (TRUE ZERO - no animal products, no hydrogenated oils)
- cholesterol_mg: 0 (TRUE ZERO - plant-based)

Check: 16.3 + 6.1 + 3.4 + 0 = 25.8g vs 28g total = 2.2g unassigned (acceptable)

Confidence: MEDIUM (coconut distinctive profile, oil type assumed)
```

**STEP 4: Major Minerals (15 min - LOW/MEDIUM confidence)**
```
Potassium (MEDIUM confidence):
- Vegetables (200g × 250mg/100g category average): 500mg
- Coconut milk (70g × 263mg/100g USDA): 184mg
- Tomato (70g × 237mg/100g): 166mg
- Rice (200g × 35mg/100g): 70mg
- Total: 920mg

Calcium (LOW confidence):
- Vegetables (200g × 40mg/100g): 80mg
- Coconut milk (70g × 16mg/100g): 11mg
- Tomato (70g × 10mg/100g): 7mg
- Rice (200g × 10mg/100g): 20mg
- Total: 118mg → 120mg

Iron (LOW confidence):
- Vegetables (200g × 1mg/100g): 2mg
- Coconut milk (70g × 1.6mg/100g): 1.1mg
- Rice (200g × 0.2mg/100g): 0.4mg
- Spices (5g × 10mg/100g): 0.5mg (spices rich in iron)
- Total: 4.0mg

Zinc (LOW confidence):
- Vegetables (200g × 0.5mg/100g): 1.0mg
- Coconut milk (70g × 0.67mg/100g): 0.5mg
- Rice (200g × 0.5mg/100g): 1.0mg
- Total: 2.5mg

Magnesium (MEDIUM confidence):
- Vegetables (200g × 20mg/100g): 40mg
- Coconut milk (70g × 37mg/100g): 26mg
- Rice (200g × 12mg/100g): 24mg
- Total: 90mg

Confidence: LOW overall (many category estimates, limited USDA matching)
```

**STEP 5: Variable Nutrients (15 min - LOW confidence)**
```
Iodine (LOW confidence - /references/iodine-content-by-category.yaml):
- Vegetables (200g × 0.05µg/g): 10µg
- Coconut milk (70g × 0.02µg/g): 1.4µg
- Rice (200g × 0.02µg/g): 4µg
- Total: 15.4µg → 15µg
- Confidence: LOW (plant-based, highly variable)

Selenium (LOW confidence - UK plant foods):
- Vegetables (200g × 0.02µg/g UK soil): 4µg
- Coconut milk (70g × 0.06µg/g): 4.2µg
- Rice (200g × 0.10µg/g imported): 20µg (rice often imported, higher)
- Total: 28.2µg → 28µg
- Confidence: LOW (UK soil variability, rice may be UK or imported)

Fiber splits (MEDIUM confidence - /references/fiber-split-ratio-reference.yaml):
- Total fiber: 6.0g
- Mixed sources: vegetables (4g, 65:35 ratio) + rice (0.8g, 85:15 ratio) + spices (1.2g, 70:30 ratio)
- Weighted calculation:
  - Vegetables: 4g × 0.65 insoluble = 2.6g, 4g × 0.35 soluble = 1.4g
  - Rice: 0.8g × 0.85 insoluble = 0.7g, 0.8g × 0.15 soluble = 0.1g
  - Spices: 1.2g × 0.70 insoluble = 0.8g, 1.2g × 0.30 soluble = 0.4g
- fiber_insoluble_g: 2.6 + 0.7 + 0.8 = 4.1g
- fiber_soluble_g: 1.4 + 0.1 + 0.4 = 1.9g
- Confidence: MEDIUM (ratio-based from reference file)

Manganese (LOW confidence):
- Vegetables (200g × 0.3mg/100g): 0.6mg
- Rice (200g × 0.5mg/100g): 1.0mg
- Spices (5g × 5mg/100g): 0.25mg (spices rich in manganese)
- Total: 1.85mg → 1.9mg
- Confidence: LOW (category estimates)

Copper (LOW confidence):
- Vegetables (200g × 0.1mg/100g): 0.2mg
- Coconut milk (70g × 0.27mg/100g): 0.19mg
- Rice (200g × 0.1mg/100g): 0.2mg
- Total: 0.59mg → 0.6mg
- Confidence: LOW (category estimates)
```

**STEP 6: Vitamins (15 min - LOW confidence)**
```
Vitamin C (MEDIUM confidence - vegetables present, cooking loss):
- Raw vegetables would have ~60mg per 200g
- Cooking loss: 40% = 60 × 0.6 = 36mg
- Tomato: 70g × 14mg/100g = 10mg
- Total: 46mg
- Confidence: MEDIUM (vegetables present, adjusted for cooking)

Vitamin A (MEDIUM confidence - vegetables):
- Peppers, carrots in mix: 200g × 50µg/100g = 100µg (conservative)
- Tomato: 70g × 42µg/100g = 29µg
- Total: 129µg → 130µg
- Confidence: MEDIUM (depends on specific vegetables)

Vitamin D (LOW confidence):
- No fortification, plant-based
- Use baseline: 0.2µg
- Confidence: LOW (baseline, could be TRUE ZERO)

Vitamin E (LOW confidence):
- Coconut milk: 70g × 0.15mg/100g = 0.1mg
- Cooking oil: 10g × 10mg/100g = 1mg
- Vegetables: 200g × 0.5mg/100g = 1mg
- Total: 2.1mg → 2mg
- Confidence: LOW (estimates)

Vitamin K (LOW confidence):
- Vegetables: 200g × 20µg/100g = 40µg (conservative, depends on greens)
- Cooking oil: 10g × 50µg/100g = 5µg
- Total: 45µg
- Confidence: LOW (depends on vegetables)

B-vitamins (LOW confidence - conservative baselines):
- thiamin_b1_mg: 0.2 (vegetables, spices)
- riboflavin_b2_mg: 0.1 (vegetables)
- niacin_b3_mg: 1.5 (vegetables, rice)
- pantothenic_acid_b5_mg: 0.8 (vegetables, coconut)
- pyridoxine_b6_mg: 0.3 (vegetables, rice)
- folate_b9_ug: 50 (vegetables good source)
- vitamin_b12_ug: 0.0 (TRUE ZERO - plant-based, no fortification)

Confidence: LOW overall (many category estimates)
```

**STEP 7: Document & Validate (5 min)**
```yaml
quality:
  confidence: "medium"
  assumptions:
    - "Component weights estimated from photo; coconut milk adjusted to 70g to match 580 kcal target"
    - "Mixed vegetables assumed: onions, peppers, cauliflower, peas (200g total)"
    - "Cooking oil estimated at 10g (not visible, standard restaurant use)"
    - "Finishing salt at 0.5% of 600g dish (3g salt = 1200mg sodium)"
    - "Coconut milk distinctive fatty acid profile (86% SFA, 6% MUFA, 2% PUFA)"
    - "Cooking oil assumed mixed vegetable oil (50% MUFA, 30% PUFA)"
    - "Iodine: LOW confidence, plant-based dish using category minimums (15µg)"
    - "Selenium: LOW confidence, UK soil adjustment for vegetables, rice possibly imported (28µg)"
    - "Fiber split: weighted average of vegetables (65:35), rice (85:15), spices (70:30)"
    - "Vitamin C adjusted for 40% cooking loss (46mg)"
    - "All minerals estimated from components (LOW/MEDIUM confidence)"
  gaps:
    - "Specific vegetables unknown, used conservative category averages"
    - "Oil type assumed (could be rapeseed, sunflower, or mixed)"
    - "B-vitamins using conservative estimates (LOW confidence)"
  data_sources:
    - "USDA FDC for vegetable averages, coconut milk, white rice"
    - "/references/iodine-content-by-category.yaml for iodine (plant-based categories)"
    - "/references/fiber-split-ratio-reference.yaml for fiber split ratios"
    - "Deliveroo calorie count (580 kcal) - validated within 1.7%"

validation:
  - atwater_check: "590 kcal calculated vs 580 kcal stated = +1.7% ✓"
  - fat_split_check: "16.3 + 6.1 + 3.4 = 25.8g vs 28g total = 2.2g unassigned (acceptable)"
  - fiber_split_check: "4.1g + 1.9g = 6.0g vs total 6.0g ✓"
```

**Total Time: 65 minutes**
**Overall Confidence: MEDIUM (component-based) with many LOW estimates**
**Key Nutrients Estimated: ALL (complete profile despite complexity)**
**Note:** This represents the MAXIMUM effort approach. For a quick entry, could skip B-vitamins and some trace minerals, reducing time to ~45 minutes while keeping critical nutrients.

---

## 6. QUICK REFERENCE TABLES

### 6.1 Time Budget by Nutrient Priority

| Priority | Nutrients | Time | Confidence Goal | Methods |
|----------|-----------|------|----------------|---------|
| **CRITICAL** | Energy, Protein, Fat, Carbs, Fiber, Sat Fat, Sodium, Sugar | 10-20 min | HIGH/MEDIUM | Label, component calc, USDA |
| **HIGH** | MUFA, PUFA, Trans fat, Cholesterol, Major minerals (K, Ca, Mg, Fe, Zn) | 15-25 min | MEDIUM | Fatty acid profiles, component lookup |
| **MEDIUM** | Iodine, Selenium, Fiber splits, Vitamin C, Vitamin A | 15-20 min | MEDIUM/LOW | Reference files, category ranges, ratios |
| **LOW** | Trace minerals (Mn, Cu), Other vitamins (D, E, K), B-vitamins | 10-20 min | LOW | USDA when available, baselines otherwise |

**Total Time for Complete Profile:** 50-85 minutes (depending on complexity)
**Minimum for Critical + High:** 25-45 minutes
**Quick Entry (Critical only):** 10-20 minutes

### 6.2 Confidence Level Indicators

| Confidence | Error Range | When to Use | Examples |
|------------|------------|-------------|----------|
| **HIGH** | ±5-15% | Direct label, USDA match, analytical data | Packaged food label values, USDA Foundation Foods exact match |
| **MEDIUM** | ±20-40% | Component lookup, recipe calc, ratio tables | Restaurant dish with component breakdown, fatty acid profiles |
| **LOW** | ±50-100% | Category ranges, broad estimates, conservative mins | Iodine in mixed vegetables, trace minerals in complex dishes |
| **TRUE ZERO** | 0% (certain) | Scientific impossibility | Cholesterol in plants, fiber in meat, B12 in unfortified plants |

### 6.3 Conservative Baseline Values (When Very Uncertain)

Use these LOW confidence baselines rather than 0 when data unavailable:

| Nutrient | Baseline (per 100g typical food) | Use When |
|----------|----------------------------------|----------|
| **Iodine** | 2-5µg | No dairy/seafood/eggs |
| **Selenium** | 1-2µg | UK plant foods |
| **Manganese** | 0.05-0.1mg | No whole grains/nuts |
| **Copper** | 0.05-0.1mg | No nuts/shellfish/legumes |
| **Vitamin C** | 0.5-2mg | No fruits/vegetables |
| **Vitamin A** | 1-5µg RAE | No orange veg/dairy |
| **Vitamin D** | 0.2-0.5µg | No fatty fish/fortified dairy |
| **Vitamin E** | 0.1-0.5mg | No nuts/seeds/oils |
| **Vitamin K** | 1-5µg | No leafy greens |
| **Thiamin (B1)** | 0.05mg | Mixed foods |
| **Riboflavin (B2)** | 0.05mg | No dairy/meat |
| **Niacin (B3)** | 0.5mg | Mixed foods |
| **Pyridoxine (B6)** | 0.05mg | Mixed foods |
| **Folate (B9)** | 10µg | No leafy greens/legumes |

**Important:** These are ABSOLUTE MINIMUMS for LOW confidence. Always prefer component-based estimation when possible.

### 6.4 TRUE ZEROS - Scientific Justifications

| Nutrient | TRUE ZERO When | Documentation Required |
|----------|---------------|----------------------|
| **Cholesterol** | 100% plant-based | "TRUE ZERO - plant-based (cholesterol only in animals)" |
| **Fiber** | Pure animal products (meat, dairy, eggs) | "TRUE ZERO - animal product (no plant cell walls)" |
| **Carbohydrates** | Pure fats/oils | "TRUE ZERO - pure fat (no carbohydrates)" |
| **Vitamin B12** | Unfortified plant foods | "TRUE ZERO - unfortified plant food (B12 only from bacteria/animals)" |
| **Polyols** | Natural unprocessed foods | "TRUE ZERO - no sugar alcohols (only in sugar-free products)" |
| **Trans fat** | No hydrogenated oils, minimal animal products | "TRUE ZERO - UK regulations (or trace 0.01-0.1g natural)" |

### 6.5 Reference File Quick Lookup

| File | Use For | Confidence Level | Access Time |
|------|---------|-----------------|-------------|
| **`iodine-content-by-category.yaml`** | Iodine in all foods | MEDIUM (dairy/seafood), LOW (plants) | 2-5 min |
| **`fiber-split-ratio-reference.yaml`** | Insoluble/soluble fiber splits | MEDIUM (ratio-based) | 2-5 min |
| **USDA FoodData Central** | All nutrients, component lookup | HIGH (Foundation), MEDIUM (Survey) | 5-15 min |
| **UK McCance & Widdowson** | UK-specific foods | HIGH (analytical) | 5-15 min |

---

## 7. CONCLUSION

### Core Principles Summary

1. **Never use 0 as a placeholder** - Always estimate with appropriate confidence level
2. **TRUE ZERO only when scientifically justified** - Document reasoning
3. **A LOW confidence estimate is always better than 0** - Acknowledges nutrient presence
4. **Use reference files systematically** - Iodine, fiber splits, category ranges
5. **Document everything** - Confidence, assumptions, data sources, gaps
6. **Validate with Atwater** - Energy calculation catches errors
7. **Balance effort with impact** - Focus on tracked nutrients first

### Decision Framework

```
Is the nutrient scientifically impossible in this food?
├─ YES → Use 0 (TRUE ZERO) with documentation
└─ NO → Estimate with appropriate confidence:
    ├─ HIGH confidence (±5-15%): Label, USDA direct, analytical data
    ├─ MEDIUM confidence (±20-40%): Component lookup, ratios, recipes
    └─ LOW confidence (±50-100%): Category ranges, conservative baselines
```

### Final Checklist

Every food entry should have:
- [ ] **All macros estimated** (energy, protein, fat, carbs, fiber, sat fat, sodium, sugar) - HIGH/MEDIUM confidence
- [ ] **Fat quality estimated** (MUFA, PUFA, trans, cholesterol) - MEDIUM confidence when feasible
- [ ] **Major minerals estimated** (K, Ca, Mg, Fe, Zn) - MEDIUM/LOW confidence minimum
- [ ] **Iodine estimated** using `/references/iodine-content-by-category.yaml` - MEDIUM/LOW confidence
- [ ] **Selenium estimated** (or documented TRUE ZERO for UK plants) - LOW confidence minimum
- [ ] **Fiber splits estimated** using `/references/fiber-split-ratio-reference.yaml` if total fiber known - MEDIUM confidence
- [ ] **Trace minerals estimated** (Mn, Cu) - LOW confidence baselines acceptable
- [ ] **Key vitamins estimated** (C, A) - MEDIUM/LOW confidence when present
- [ ] **B12 handled correctly** - TRUE ZERO for unfortified plants, estimate for animal products
- [ ] **Confidence level documented** in quality.confidence
- [ ] **Assumptions listed** in quality.assumptions
- [ ] **Data sources recorded** including reference files used
- [ ] **Gaps noted** in quality.gaps for LOW confidence estimates
- [ ] **Atwater validated** (±5-8% tolerance)

### When Estimation is Complete

**Stop estimating when:**
- All tracked nutrients (health-profile.yaml) have estimates
- Energy validates via Atwater
- Confidence documented appropriately
- Time investment exceeds marginal value

**It's OK to have:**
- LOW confidence estimates (document appropriately)
- Conservative baseline values (better than 0)
- Some vitamins/trace minerals with minimal estimates (if not tracked)

**Never OK to have:**
- 0 values without justification (TRUE ZERO or documented reason)
- Missing critical macros (energy, protein, fat, carbs, fiber)
- Undocumented assumptions
- Atwater validation failures (>8% error)

---

**Last Updated:** 2025-11-03
**Philosophy:** "A low-confidence estimate is always better than 0 (unless 0 is scientifically true)"
**Review:** Update when new reference files added or estimation methods refined
