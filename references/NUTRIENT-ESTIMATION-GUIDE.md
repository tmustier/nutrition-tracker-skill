# Nutrient Estimation Guide: Methods for Estimating Missing Values

**Date:** 2025-11-03
**Purpose:** Comprehensive guide on methods, priorities, and strategies for estimating missing nutrient values in food composition data

---

## Executive Summary

This guide provides evidence-based methods for estimating missing nutrient values, balancing accuracy with practical effort. Based on research into USDA FoodData Central, UK McCance & Widdowson methodologies, and current food labeling practices, it categorizes nutrients by estimation difficulty and provides specific strategies for different food types.

**Key Insight:** Not all missing values need estimation. Strategic prioritization based on health impact, Atwater calculations, and tracked targets optimizes effort while maintaining data quality.

---

## 1. STANDARD FOOD COMPOSITION APPROACHES

### 1.1 USDA FoodData Central Methodology

**Three-Method Approach for Missing Values:**

1. **Calculation** - Computational methods using:
   - Recipe calculations (70% of FNDDS codes generated this way)
   - Fatty acid profile calculations from total fat
   - Protein from nitrogen × conversion factors
   - Energy from Atwater factors

2. **Matching to Similar Foods** - Borrowing values from:
   - Similar FDC codes with complete data
   - Same food prepared differently (raw vs cooked)
   - Generic versions of branded products

3. **Zero Assumption** - When appropriate:
   - Constituent analytically shown to be absent
   - Amount below detection/quantification limits
   - Nutritionally insignificant amounts

**Important Distinction:** USDA uses 60% calculated/imputed values for nutrients not in Foundation Foods database, indicating that extensive estimation is standard practice.

### 1.2 UK McCance & Widdowson Approach

**Data Hierarchy:**
- Direct analytical surveys (preferred)
- Manufacturer data (validated)
- Recipe calculations for prepared foods
- Updated historical data (reviewed for current formulations)

**Notation System:**
- Direct values: no brackets
- Estimated values: (round brackets)
- Trace amounts: "trace" designation preferred over zero
- Protein: calculated from total nitrogen × food-specific factors

**Key Principle:** All foods reviewed to ensure values represent current consumption patterns, with updates reflecting reformulation initiatives (reduced salt, sugar, fat).

### 1.3 Recipe Calculation Methods

**Component-Based Estimation Process:**

1. **Identify all components** from ingredient list
2. **Estimate component weights**:
   - Use standard portions (eggs 50g, bread 60g, restaurant yogurt 100-120g)
   - Leave one component (usually fat/oil) as "closing variable"
3. **Calculate sub-totals** using USDA/McCance profiles for each component
4. **Solve for unknown component** to match known calorie total
5. **Apply finishing salt** (0.5% of dish weight for "normal" scheme)
6. **Validate with Atwater formula** (±5-8% tolerance)

**Example:** See `/home/user/nutrition-tracker-skill/ESTIMATE.md` lines 103-126 for worked calculation of Chilli Poached Eggs.

---

## 2. FEASIBILITY BY NUTRIENT TYPE

### TIER 1: Essential & Estimable (HIGH PRIORITY)

**These nutrients can be reliably estimated and are critical for health tracking:**

| Nutrient | Estimation Method | Accuracy | Data Sources |
|----------|------------------|----------|--------------|
| **Energy (kcal)** | Atwater calculation | Very High | Always calculate: 4P + 9F + 4C_avail + 2fiber + 2.4polyols |
| **Protein (g)** | Recipe calculation | High | USDA/McCance per ingredient; predictable in most foods |
| **Fat total (g)** | Recipe calculation | High | Sum of ingredients; visible fat estimable |
| **Carbs total (g)** | Recipe calculation | High | UK/EU labels show available carbs; calculate total |
| **Carbs available (g)** | Calculation/Label | Very High | UK/EU labels directly; US: subtract fiber from total |
| **Saturated fat (g)** | Fatty acid profiles | High | Known ratios for common oils/fats; mandatory on labels |
| **Fiber total (g)** | Component lookup | High | Well-documented in databases; estimate from plant content |
| **Sodium (mg)** | Salt calculation | High | 0.5% dish weight for restaurant; labels for packaged |
| **Sugar (g)** | Component lookup | High | Well-documented; visible ingredients (fruit, added sugar) |

**Why Tier 1 Matters:**
- Required for Atwater energy calculation
- All are tracked in health-profile.yaml targets
- Impact daily macro tracking
- Available on most UK/EU labels (mandatory nutrients)

### TIER 2: Important but Harder (MEDIUM PRIORITY)

**These require more specialized knowledge but are trackable:**

| Nutrient | Estimation Method | Accuracy | Challenge |
|----------|------------------|----------|-----------|
| **MUFA (g)** | Fatty acid profiles | Medium | Requires knowing oil type; standard ratios exist |
| **PUFA (g)** | Fatty acid profiles | Medium | Similar to MUFA; olive ~11%, butter ~3% |
| **Trans fat (g)** | Profile lookup | Medium-Low | Natural (dairy/meat) vs industrial; trace in most UK foods |
| **Cholesterol (mg)** | Component lookup | High | Animal products only; well-documented values |
| **Potassium (mg)** | Component lookup | Medium | Well-documented for whole foods; less for processed |
| **Calcium (mg)** | Component lookup | Medium | Dairy, fortified foods well-documented |
| **Iron (mg)** | Component lookup | Medium | Meat/plant sources differ (heme vs non-heme) |
| **Zinc (mg)** | Component lookup | Medium | Concentrated in meat, shellfish, legumes |
| **Vitamin C (mg)** | Component lookup | High | Fruits/veg well-documented; destroyed by cooking |
| **Magnesium (mg)** | Component lookup | Medium | Whole grains, nuts well-documented |

**Fatty Acid Profile Standards (from METHODOLOGY.md):**
- **Olive oil:** ~73% MUFA, ~11% PUFA, ~14% SFA
- **Butter:** ~51% SFA, ~21% MUFA, ~3% PUFA
- **Salmon:** ~29% MUFA, ~40% PUFA of total fat
- **Chicken:** ~45% MUFA, ~21% PUFA of total fat

**Why Tier 2 Matters:**
- MUFA, PUFA tracked in monitoring section of health-profile.yaml
- Potassium, calcium, iron, zinc, vitamin C, magnesium all tracked
- Can be estimated from ingredient profiles with reasonable accuracy
- Available as optional nutrients on some labels

### TIER 3: Nice-to-Have but Very Hard (LOW PRIORITY)

**These are nearly impossible to estimate accurately without laboratory analysis:**

| Nutrient | Why Hard to Estimate | Safe Default |
|----------|---------------------|--------------|
| **Iodine (µg)** | Highly variable by soil content, processing, salt type | 0 (except dairy, seafood, iodized salt) |
| **Selenium (µg)** | Extreme variability by soil (plants), feed (animals) | 0 (except Brazil nuts, seafood) |
| **Fiber soluble (g)** | Requires specific analysis; not on labels | 0 (unless USDA data available) |
| **Fiber insoluble (g)** | Requires specific analysis; not on labels | 0 (unless USDA data available) |
| **Manganese (mg)** | Not widely documented; variable content | 0 or trace |
| **Copper (mg)** | Less commonly tracked | 0 or trace |
| **Vitamin D (µg)** | Limited natural sources; fortification variable | 0 (except fatty fish, fortified dairy) |
| **Vitamin E (mg)** | Degraded by processing; not on labels | 0 (except nuts, seeds, oils) |
| **B-vitamins (various)** | Multiple forms; processing affects content | 0 (or lookup fortified foods) |

**Research Finding:**
- Selenium: "Particularly difficult to assess... plants highly sensitive to soil concentrations, leading to great variation" (NCBI)
- Iodine: Varies by salt type (iodized vs sea salt), soil content, dairy processing
- Soluble/insoluble fiber: Requires AOAC 2011.25 method; most databases only have total fiber

**Current Practice in Your System:**
- 40 files have `iodine_ug: 0`
- 49 files have `fiber_soluble_g: 0`
- This is appropriate for nutrients that are truly unknown

---

## 3. ESTIMATION STRATEGIES BY FOOD TYPE

### 3.1 Packaged Products

**What's on UK/EU Labels (Mandatory):**
- Energy (kJ and kcal)
- Protein, Fat, Saturated fat
- Carbohydrates (available), Sugars
- Salt → convert to sodium (salt_g × 400 = sodium_mg)

**What's Optional but Common:**
- Fiber
- MUFA, PUFA, Trans fat
- Vitamins/minerals (if ≥15% NRV per 100g)

**Estimation Strategy:**
1. **Anchor to label values** for mandatory nutrients
2. **Calculate energy** using Atwater (don't trust label if differs >8%)
3. **Estimate MUFA/PUFA** from ingredients list:
   - Check fat sources (palm oil → high SFA; rapeseed → high MUFA)
   - Apply standard ratios based on primary fat
4. **Estimate fiber** if not listed:
   - Look at ingredients (whole grains, inulin, oats = fiber)
   - Check comparable products in database
5. **Minerals/vitamins:**
   - Set to 0 unless fortification claimed
   - Check for dairy (calcium, iodine), meat (iron, zinc)
   - Vitamin C: only if fruit/veg content or fortified

**Zero Assumptions Safe For:**
- Cholesterol in plant-based products
- Fiber in pure protein/fat products (meat, oils)
- Iodine (unless dairy or added iodized salt)
- Vitamin C (unless fruit/veg or fortified)

### 3.2 Restaurant Dishes (Deliveroo/Uber Eats)

**What's Available:**
- **Calorie count** (mandatory for chains >250 employees since April 2022)
- **Ingredients list** (allergen requirements)
- **Photos** (for portion estimation)

**Estimation Strategy:**

1. **Anchor to venue calorie count** (legally required to be accurate)
2. **Component-based calculation:**
   - Break down into identifiable components
   - Estimate weights using standard portions
   - Solve for unknown (usually fat/oil) to close calorie gap
3. **Apply finishing salt:** 0.5% of dish weight for "normal" scheme
4. **Macros from components:**
   - Sum protein, fat, carbs from each component
   - Validate with Atwater formula (±5-8%)
5. **Micronutrients from dominant ingredients:**
   - Vitamin C: if significant veg/fruit content
   - Calcium: if dairy present
   - Iron: if red meat present
   - Otherwise: set to 0

**Example Confidence Levels:**
- Chilli Poached Eggs (L'ETO): HIGH (component breakdown possible)
- Beef Stroganoff (Zima): HIGH for macros, LOW for micros (set to 0)
- Dim sum items: MEDIUM (harder to estimate internal composition)

### 3.3 Generic Items (USDA/McCance Lookup)

**When to Use:**
- Simple ingredients (eggs, butter, vegetables)
- Generic preparations (grilled chicken, steamed broccoli)
- No venue-specific data available

**Estimation Strategy:**

1. **Find exact match in USDA FDC or McCance database**
2. **Adjust for preparation:**
   - Raw → cooked: moisture loss (meat -25%, veg variable)
   - Fried: add oil absorption (10-15% for deep fry)
   - Grilled: add light oil brushing (~5g oil)
3. **Add finishing salt if restaurant:** 0.5% of finished weight
4. **Scale to actual portion consumed**
5. **Copy all available nutrients** (including zeros for known-absent)

**Database Completeness:**
- USDA Foundation Foods: most complete for Tier 1 & 2 nutrients
- McCance 2021: ~3,300 foods, good UK-specific data
- MyFoodData: USDA-derived, user-friendly interface

**Raspberries Example (from your data):**
- USDA FDC 167755: complete data including manganese, vitamin C
- Iodine: 0 (not measured, set to 0)
- Fiber soluble/insoluble: 0 (not in USDA basic nutrients)
- This is appropriate handling

### 3.4 Zero Assumptions: When is 0 Safe?

**TRUE ZEROS (scientifically accurate):**
- Cholesterol in plant foods
- Fiber in animal foods (meat, fish, eggs, dairy)
- Carbohydrates in pure fats (oils, butter)
- Vitamin C in foods without plant content (unless fortified)
- Polyols in non-processed foods (only in sugar-free products)

**SAFE ESTIMATION ZEROS (unknown but likely negligible):**
- Iodine (except dairy, seafood, iodized salt)
- Trans fat in UK foods (since 2018 regulations)
- Manganese in non-plant foods
- Fiber soluble/insoluble when only total fiber known

**PROBLEMATIC ZEROS (should remain null in food bank):**
- Potassium (widely present, just not measured)
- Magnesium (widely present, just not measured)
- Iron when clearly present (meat, fortified cereals)
- Zinc when clearly present (meat, shellfish)

**Your Current Schema Requirement:**
- **Food bank:** Can use `null` for unknown values
- **Daily logs:** Must use 0 (no nulls allowed) - document as estimate

**Best Practice:**
- Food bank: Use `null` when truly unknown, 0 when confirmed zero
- Logs: Copy food bank values (converting nulls to 0), document in notes
- Track confidence in `quality.confidence` field

---

## 4. PRACTICAL PRIORITIES FOR YOUR SYSTEM

### 4.1 Priority Order (What to Estimate First)

**CRITICAL (Always Estimate):**
1. Energy (kcal) - via Atwater calculation
2. Protein (g) - tracked target
3. Fat (g) - tracked target
4. Carbs available (g) - for Atwater calculation
5. Carbs total (g) - relationship check
6. Fiber total (g) - tracked target, affects Atwater
7. Saturated fat (g) - tracked max limit
8. Sodium (mg) - tracked max limit
9. Sugar (g) - tracked in monitoring

**HIGH PRIORITY (Estimate When Feasible):**
10. MUFA (g) - tracked in monitoring
11. PUFA (g) - tracked in monitoring
12. Potassium (mg) - tracked in monitoring
13. Calcium (mg) - tracked in monitoring
14. Magnesium (mg) - tracked in monitoring
15. Iron (mg) - tracked in monitoring
16. Zinc (mg) - tracked in monitoring
17. Vitamin C (mg) - tracked in monitoring
18. Cholesterol (mg) - tracked in monitoring
19. Trans fat (g) - tracked in monitoring

**MEDIUM PRIORITY (If Data Available):**
20. Polyols (g) - needed for Atwater if present
21. Iodine (µg) - tracked, but only estimate for seafood/dairy

**LOW PRIORITY (OK to Leave as 0):**
22. Fiber soluble/insoluble - rarely available
23. Manganese - not critical tracking
24. Unsat_total (MUFA + PUFA) - calculated field

### 4.2 Impact on Health Tracking

**Critical for Daily Target Compliance:**
- Energy, Protein, Fat, Carbs → PRIMARY macros
- Fiber, Saturated fat, Sodium → CONSTRAINT targets
- Missing any of these renders daily tracking incomplete

**Important for Weekly Patterns:**
- MUFA, PUFA → fat quality assessment
- Potassium, Calcium, Iron, Zinc, Vitamin C, Magnesium → micronutrient adequacy
- Sugar → added sugar tracking

**Nice to Have:**
- Cholesterol, Trans fat → long-term health markers
- Iodine → thyroid function (but hard to estimate)

### 4.3 Impact on Atwater Calculations

**Required for Accurate Energy Calculation:**

```
energy_kcal = 4 × protein_g
            + 9 × fat_g
            + 4 × carbs_available_g
            + 2 × fiber_total_g
            + 2.4 × polyols_g
```

**Missing Any of These = Wrong Energy Value:**
- Protein, Fat: obvious impact
- Carbs available: NOT carbs total (common error)
- Fiber: 2 kcal/g contribution (often significant in high-fiber foods)
- Polyols: 2.4 kcal/g (only in sugar-free products)

**Current Practice:**
- All your entries correctly calculate energy
- Tolerance: ±5-8% from venue calorie count acceptable
- Document variance in notes when outside tolerance

**Common Errors to Avoid:**
- Using US "total carbs" instead of UK "available carbs"
- Forgetting fiber's 2 kcal/g contribution
- Ignoring polyols in sugar-free products (17g in Grenade bar!)
- Not accounting for finishing salt in restaurant dishes

### 4.4 Tools & Databases Recommended

**Primary Sources (In Order of Preference):**

1. **Venue-Provided Data:**
   - Deliveroo/Uber Eats calorie counts (mandatory, anchor to these)
   - Venue PDFs (allergen menus, nutrition guides)
   - Manufacturer labels (packaged products)

2. **USDA FoodData Central:**
   - https://fdc.nal.usda.gov/
   - Most complete nutrient profiles
   - Foundation Foods preferred over Survey Foods
   - Use for ingredient lookups

3. **MyFoodData (USDA Interface):**
   - https://tools.myfooddata.com/
   - User-friendly USDA data access
   - Good for quick lookups
   - Shows all nutrients in clear format

4. **UK McCance & Widdowson (CoFID):**
   - https://www.gov.uk/government/publications/composition-of-foods-integrated-dataset-cofid
   - UK-specific foods and preparations
   - ~3,300 foods
   - Better for UK-specific items (digestive biscuits, etc.)

**Calculation Tools:**

5. **Recipe Calculators (For Complex Dishes):**
   - Manual calculation in spreadsheet (most accurate for your workflow)
   - Component-based method (see ESTIMATE.md lines 69-101)
   - Validate with Atwater formula

**Verification Tools:**

6. **Your Validation Script:**
   - `/home/user/nutrition-tracker-skill/scripts/validate_data_bank.py`
   - Checks energy math, fat splits, sodium/salt
   - Run before committing new entries

---

## 5. ESTIMATION WORKFLOW RECOMMENDATIONS

### 5.1 Decision Tree for New Dishes

```
START: New dish to add
│
├─ Is it a packaged product?
│  ├─ YES → Use label values (Section 3.1)
│  │      → Estimate MUFA/PUFA from ingredients
│  │      → Set unknown micros to 0 (unless fortified)
│  └─ NO → Continue
│
├─ Is venue calorie count available (Deliveroo/Uber Eats)?
│  ├─ YES → Component-based estimation (Section 3.2)
│  │      → Anchor to venue calories
│  │      → Solve for unknown component
│  │      → Apply finishing salt
│  │      → Validate Atwater (±5-8%)
│  └─ NO → Continue
│
├─ Is it a simple ingredient or generic item?
│  ├─ YES → USDA/McCance lookup (Section 3.3)
│  │      → Adjust for preparation
│  │      → Scale to portion
│  │      → Copy all available nutrients
│  └─ NO → Continue
│
└─ Complex dish, no data available?
   └─ → Best judgment component estimation
      → Use comparable dishes
      → Document assumptions heavily
      → Set confidence to "low"
      → Flag gaps in quality.gaps field
```

### 5.2 Effort vs. Accuracy Balance

**HIGH EFFORT, HIGH ACCURACY (Worth It):**
- Tier 1 nutrients (always estimate)
- Frequently consumed dishes (high impact)
- Dishes used as recipe components
- Dishes tracked in long-term patterns

**MEDIUM EFFORT, MEDIUM ACCURACY (Usually Worth It):**
- Tier 2 nutrients when data readily available
- Restaurant dishes with ingredient lists
- Generic items with USDA profiles

**LOW EFFORT, LOW ACCURACY (Often Not Worth It):**
- Tier 3 nutrients (set to 0, document as unknown)
- Soluble/insoluble fiber (use 0 unless USDA has it)
- Iodine (0 unless dairy/seafood)
- One-off dishes unlikely to repeat

**Time Estimates:**
- Packaged product (with label): 10 minutes
- Restaurant dish (with Deliveroo data): 30-45 minutes
- Complex dish (limited data): 60-90 minutes
- Generic ingredient (USDA lookup): 5 minutes

### 5.3 Quality Tracking

**Confidence Levels (Already in Your Schema):**

- **HIGH:** Component-based with venue anchor, or direct label data
- **MEDIUM:** USDA lookup with preparation adjustments
- **LOW:** Best-guess estimation, comparable dish matching

**Document in quality.gaps:**
- List specific nutrients set to 0 due to lack of data
- Example: "micronutrients (iodine, magnesium, calcium, iron, zinc, vitamin_c, manganese) not provided"
- This helps future updates and audit trails

**Assumptions Field:**
- Document salt scheme, oil type, prep method
- Note portion estimation methods
- Flag where closing variable method used

---

## 6. SPECIAL CASES & ADVANCED TOPICS

### 6.1 UK vs. US Carbohydrate Convention

**CRITICAL DIFFERENCE:**

- **UK/EU labels:** Show available carbs (digestible)
  - Formula: available_carbs + fiber = total_carbs (approx)

- **US labels:** Show total carbs (includes fiber)
  - Formula: total_carbs - fiber = available_carbs

**Your System (Correct Approach):**
- `carbs_available_g`: digestible carbs (UK convention)
- `carbs_total_g`: includes fiber + polyols
- `polyols_g`: sugar alcohols (separate)
- Relationship: `total ≈ available + fiber + polyols`

**When Using USDA Data:**
1. USDA lists "total carbohydrate" (includes fiber)
2. Copy to `carbs_total_g`
3. Calculate `carbs_available_g = total - fiber - polyols`
4. Document in change_log

### 6.2 Polyols (Sugar Alcohols)

**When Present (Sugar-Free Products):**
- Energy factor: 2.4 kcal/g (maltitol, sorbitol, xylitol)
- Exception: erythritol 0.2 kcal/g
- Must include in Atwater calculation
- Example: Grenade bar has 17g polyols!

**Label Treatment:**
- UK: polyols listed separately from sugars
- Often appears as "of which polyols" under carbohydrates
- May be listed by name (maltitol, sorbitol, etc.)

**If Not Present:**
- Set `polyols_g: 0.0` (explicit zero)
- Most non-processed foods have 0 polyols

### 6.3 Fatty Acid Splits When Total Fat Known

**If Label Shows Only Total Fat & Saturated Fat:**

1. Calculate unsaturated fat: `unsat = total_fat - sat_fat - trans_fat`
2. Identify primary fat source from ingredients:
   - Olive oil dominant → ~73% MUFA, ~11% PUFA of unsat
   - Mixed/unknown → ~50% MUFA, ~30% PUFA of unsat (conservative)
   - Coconut/palm → mostly saturated, minimal unsat
   - Seed oils → ~20% MUFA, ~60% PUFA of unsat
3. Calculate: `MUFA = unsat × ratio_mufa`, `PUFA = unsat × ratio_pufa`
4. Document assumption in notes

**Validation:**
- Sum: `sat + MUFA + PUFA + trans ≤ total_fat`
- Difference = unassigned fat (rounding/other fatty acids)
- Typical unassigned: 1-3g acceptable

### 6.4 Restaurant Salt/Sodium Estimation

**Default Assumption (Your System):**
- "Normal" salt scheme = 0.5% of finished dish weight
- Formula: `finishing_salt_g = dish_weight_g × 0.005`
- Convert to sodium: `sodium_mg = salt_g × 400`

**Add Intrinsic Sodium From:**
- Bread (~200-250mg per slice)
- Cheese (~180mg per 30g)
- Salted butter (~180mg per 30g)
- Processed meats (~300-600mg per 50g)
- Soy sauce (~1000mg per tablespoon)

**Total Sodium = Intrinsic + Finishing Salt**

**Check Reasonableness:**
- Restaurant meals typically 600-1500mg sodium
- If calculated >2000mg, verify or reduce salt assumption
- Light salt scheme: 0.25% of dish weight
- Heavy salt scheme: 0.75% of dish weight

### 6.5 Vitamins in Cooked Foods

**Heat-Sensitive Vitamins (Degradation):**
- Vitamin C: -25% to -50% in cooked vegetables
- B vitamins: -10% to -40% depending on method
- Folate: -50% to -70% in long cooking

**Stable Vitamins:**
- Vitamin A: relatively stable
- Vitamin E: stable in normal cooking
- Vitamin K: stable

**Practical Approach:**
- Use "cooked" values from USDA when available
- If only raw values available, apply degradation factor
- Document assumption in notes
- When in doubt, use cooked value (conservative)

### 6.6 Portion Weight Estimation

**Visual Estimation from Photos:**
- Plate diameter typically 25-28cm
- Fist-size portion ≈ 100-150g
- Palm-size protein ≈ 100-120g
- Cup of cooked grains/pasta ≈ 140-160g
- Bowl of soup ≈ 300-350g

**Standard Yields:**
- Pasta: 100g dry → 240-260g cooked (2.4-2.6× weight gain)
- Rice: 100g dry → 300g cooked (3× weight gain)
- Meat: raw → cooked -25% weight (moisture loss)
- Vegetables: raw → cooked variable (-10% to -50%)

**Validation:**
- Total component weight should be plausible for dish type
- Single-plate meal typically 300-500g
- Soup/curry with rice: 400-600g
- Sandwich with fillings: 150-300g

---

## 7. CONCLUSION & QUICK REFERENCE

### Key Takeaways

1. **Not everything needs estimation:** Focus on Tier 1 nutrients that affect targets and Atwater calculations

2. **Anchor to known values:** Venue calories (Deliveroo), labels (packaged), USDA profiles (ingredients)

3. **Component-based method works:** Break complex dishes into ingredients, solve for unknowns

4. **Zero is OK when justified:** True zeros (cholesterol in plants), unknown Tier 3 nutrients (iodine), confirmed trace amounts

5. **Document everything:** Assumptions, confidence, gaps, sources - enables future refinement

6. **Validate with Atwater:** Energy calculation catches macro estimation errors

### Quick Checklist for New Entries

- [ ] **Tier 1 nutrients** all estimated (energy, protein, fat, carbs, fiber, sat fat, sodium, sugar)
- [ ] **Energy calculated** using Atwater formula (matches venue ±5-8%)
- [ ] **Carbs correctly handled** (available vs total, UK vs US convention)
- [ ] **Salt/sodium** includes both intrinsic and finishing salt
- [ ] **Fatty acids estimated** when oil/fat type known (MUFA, PUFA)
- [ ] **Tier 2 nutrients** estimated where feasible (minerals, vitamins from components)
- [ ] **Tier 3 nutrients** set to 0 with documentation (iodine, fiber soluble/insoluble)
- [ ] **Assumptions documented** (salt_scheme, oil_type, prep, portion estimation)
- [ ] **Quality tracked** (confidence level, gaps listed)
- [ ] **Sources recorded** (URLs, calculation methods, comparable dishes)
- [ ] **Validation passed** (run validate_data_bank.py)

### Priority Matrix

| Food Type | Time Investment | Estimation Priority | Typical Confidence |
|-----------|----------------|---------------------|-------------------|
| **Packaged with label** | 10 min | HIGH (Tier 1 + 2) | HIGH |
| **Restaurant with Deliveroo** | 30-45 min | HIGH (Tier 1 + 2) | HIGH-MEDIUM |
| **Simple ingredient (USDA)** | 5 min | HIGH (Tier 1 + 2) | HIGH |
| **Complex no data** | 60-90 min | MEDIUM (Tier 1 only) | MEDIUM-LOW |
| **One-off dish** | Minimal | LOW (Tier 1 essentials) | LOW |

### When to Stop Estimating

**Stop when:**
- Tier 1 nutrients complete
- Energy validates via Atwater (±5-8%)
- Key tracked nutrients estimated (targets + monitoring)
- Time invested exceeds value (one-off dishes)
- Data quality drops below "medium" confidence

**It's OK to have:**
- Iodine at 0 (except dairy/seafood)
- Fiber soluble/insoluble at 0 (when only total known)
- Some Tier 2 nutrients at 0 (document in gaps)
- Lower confidence for complex dishes

### Resources

- **This guide:** `/home/user/nutrition-tracker-skill/references/NUTRIENT-ESTIMATION-GUIDE.md`
- **Methodology:** `/home/user/nutrition-tracker-skill/references/METHODOLOGY.md`
- **Estimation workflow:** `/home/user/nutrition-tracker-skill/ESTIMATE.md`
- **USDA FDC:** https://fdc.nal.usda.gov/
- **MyFoodData:** https://tools.myfooddata.com/
- **UK McCance:** https://www.gov.uk/government/publications/composition-of-foods-integrated-dataset-cofid

---

**Last Updated:** 2025-11-03
**Review:** Update when new methodologies emerge or health profile targets change
