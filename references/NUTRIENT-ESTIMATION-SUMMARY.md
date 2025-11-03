# Nutrient Estimation Summary: Executive Findings

**Date:** 2025-11-03
**Full Guide:** `NUTRIENT-ESTIMATION-GUIDE.md`

---

## TL;DR: Strategic Priorities

**Focus your effort on:**
1. **Tier 1 nutrients** (9 critical nutrients) - always estimate
2. **Component-based method** for restaurant dishes - anchor to Deliveroo calories
3. **Set to 0 safely:** iodine, fiber soluble/insoluble, manganese (document as unknown)
4. **Validate everything** with Atwater formula (±5-8% tolerance)

**Estimated time per dish:**
- Packaged (with label): 10 minutes
- Restaurant (with Deliveroo): 30-45 minutes
- Generic ingredient (USDA): 5 minutes

---

## Three-Tier System for Nutrient Estimation

### TIER 1: Essential & Estimable (ALWAYS ESTIMATE)

**Critical for health tracking and Atwater calculations:**

| Nutrient | Why Critical | Method |
|----------|-------------|---------|
| Energy (kcal) | Atwater calculation | Calculate: 4P+9F+4C_avail+2fiber+2.4polyols |
| Protein (g) | Target tracked | Recipe calculation |
| Fat (g) | Target tracked | Recipe calculation |
| Carbs available (g) | Atwater input | UK labels show this; US: subtract fiber |
| Carbs total (g) | Relationship check | Calculate: available+fiber+polyols |
| Fiber total (g) | Target tracked, Atwater | Component lookup |
| Saturated fat (g) | Max limit tracked | Mandatory on labels, or use profiles |
| Sodium (mg) | Max limit tracked | 0.5% dish weight + intrinsic |
| Sugar (g) | Monitoring | Component lookup |

**Time investment:** 15-30 minutes per dish
**Impact:** Makes or breaks daily tracking

### TIER 2: Important but Harder (ESTIMATE WHEN FEASIBLE)

**Tracked in monitoring, good for patterns:**

| Nutrient | Estimation Approach | Accuracy |
|----------|-------------------|----------|
| MUFA (g) | Fatty acid profiles (olive ~73%, butter ~21%) | Medium |
| PUFA (g) | Fatty acid profiles (olive ~11%, butter ~3%) | Medium |
| Trans fat (g) | Trace in UK foods post-2018 | Medium-Low |
| Cholesterol (mg) | Animal products only, well-documented | High |
| Potassium (mg) | Component lookup | Medium |
| Calcium (mg) | Dairy/fortified foods | Medium |
| Iron (mg) | Meat/plant sources | Medium |
| Zinc (mg) | Meat/shellfish | Medium |
| Vitamin C (mg) | Fruits/veg (adjust for cooking -25 to -50%) | High |
| Magnesium (mg) | Whole grains, nuts | Medium |

**Fatty Acid Quick Reference:**
- Olive oil: 73% MUFA / 11% PUFA / 14% SFA
- Butter: 21% MUFA / 3% PUFA / 51% SFA
- Salmon: 29% MUFA / 40% PUFA of total fat

**Time investment:** +10-15 minutes per dish
**Impact:** Better long-term health insights

### TIER 3: Very Hard, OK to Skip (SET TO 0, DOCUMENT)

**Nearly impossible without lab analysis:**

| Nutrient | Why Impossible | Safe Default |
|----------|---------------|--------------|
| Iodine (µg) | Soil variability, processing | 0 (except dairy, seafood, iodized salt) |
| Selenium (µg) | Extreme soil/feed variability | 0 (except Brazil nuts, seafood) |
| Fiber soluble (g) | Requires AOAC 2011.25 analysis | 0 (unless USDA data) |
| Fiber insoluble (g) | Requires specific analysis | 0 (unless USDA data) |
| Manganese (mg) | Not widely documented | 0 or trace |

**Research finding:** Selenium "particularly difficult to assess... plants highly sensitive to soil concentrations, leading to great variation" - NCBI

**Current practice check:**
- 40 of your files have `iodine_ug: 0` ✓ Appropriate
- 49 of your files have `fiber_soluble_g: 0` ✓ Appropriate

**Time investment:** Don't waste time
**Impact:** Minimal (not reliably trackable anyway)

---

## Estimation by Food Type

### 1. Packaged Products (10 min)

**UK/EU Mandatory Labels:**
- Energy, Protein, Fat, Sat fat, Carbs (available), Sugars, Salt ✓

**Estimation Steps:**
1. Copy label values for Tier 1 nutrients
2. Calculate energy with Atwater (don't trust label if >8% off)
3. Convert salt to sodium: `salt_g × 400 = sodium_mg`
4. Estimate MUFA/PUFA from ingredients list (check primary fat)
5. Set unknowns to 0: iodine, fiber soluble/insoluble
6. Add micros only if fortified or obvious source (dairy→calcium)

### 2. Restaurant Dishes (30-45 min)

**UK Law (April 2022):** Chains >250 employees must show calories on Deliveroo/Uber Eats

**Component-Based Method:**
1. **Anchor to venue calorie count** (legally required accuracy)
2. **List components** from ingredient list
3. **Estimate known weights:** eggs 50g, bread 60g, yogurt 100-120g
4. **Calculate sub-totals** using USDA profiles
5. **Solve for unknown** (usually butter/oil) to close calorie gap
6. **Apply finishing salt:** 0.5% of dish weight for "normal" scheme
7. **Validate Atwater:** ±5-8% tolerance

**Example (Chilli Poached Eggs):**
- Venue lists 592 kcal
- Components: 2 eggs (100g) + yogurt (120g) + bread (60g) + kale (50g) + UNKNOWN butter
- Known components: 379 kcal
- Solve: 592-379 = 213 kcal → ~30g butter
- Add finishing salt: 352g dish × 0.5% = 1.76g salt
- Result: HIGH confidence estimate

### 3. Generic Items (5 min)

**Use USDA FoodData Central or McCance:**
1. Find exact match (raw raspberries, grilled salmon)
2. Adjust for preparation (raw→cooked -25% for meat)
3. Scale to portion consumed
4. Copy all available nutrients
5. Add finishing salt if restaurant

**Your raspberries_150g_v1 example:**
- USDA FDC 167755: complete Tier 1 & 2 data ✓
- Iodine: 0 (not measured) ✓
- Fiber soluble/insoluble: 0 (not in basic nutrients) ✓
- **This is correct handling**

---

## Critical Don'ts: Common Errors to Avoid

### ❌ DON'T: Use US Total Carbs for UK Foods

**Problem:** US labels show total carbs (includes fiber), UK shows available carbs

**Correct approach:**
- UK label "Carbohydrates 20g" → `carbs_available_g: 20`
- Calculate `carbs_total_g = 20 + fiber + polyols`
- NEVER copy US total to UK available!

### ❌ DON'T: Forget Fiber in Atwater Calculation

**Problem:** Fiber contributes 2 kcal/g, not 0

**Correct formula:**
```
energy = 4P + 9F + 4(available_carbs) + 2(fiber) + 2.4(polyols)
```

**Example:** 10g fiber = 20 kcal difference (significant!)

### ❌ DON'T: Ignore Polyols in Sugar-Free Products

**Problem:** Your Grenade bar has 17g polyols = 41 kcal!

**Check:** Look for "sugar alcohols," "maltitol," "sorbitol" on labels

### ❌ DON'T: Estimate Everything to Perfection

**Problem:** Diminishing returns on time investment

**Better approach:**
- Frequently eaten: invest 45-60 min for completeness
- One-off dish: 15-20 min for Tier 1 only
- Document confidence level appropriately

---

## Validation Checklist (Before Committing)

**Required Checks:**
- [ ] **Atwater formula** matches venue/label within ±5-8%
- [ ] **Carbs relationship:** `total ≈ available + fiber + polyols`
- [ ] **Fat split:** `sat + MUFA + PUFA + trans ≤ total_fat`
- [ ] **Sodium/salt:** reasonable for food type (restaurant 600-1500mg typical)
- [ ] **Zeros justified:** documented in `quality.gaps` or `notes`
- [ ] **Run validation script:** `python scripts/validate_data_bank.py`

**Red Flags (Investigate):**
- Energy >10% off venue/label value
- Sodium >2000mg (verify heavy salt scheme)
- Fat split sum >110% of total fat
- Cholesterol >0 in plant-based food
- Missing any Tier 1 nutrient

---

## Decision Tree: Quick Reference

```
New dish to add?
│
├─ Packaged with label? → Use label (10 min) → Tier 1 + estimate MUFA/PUFA
│
├─ Restaurant with Deliveroo calories? → Component method (30-45 min) → Tier 1 + Tier 2 from ingredients
│
├─ Simple ingredient? → USDA lookup (5 min) → Copy all available nutrients
│
└─ Complex, no data? → Best judgment (60 min) → Tier 1 only, set confidence=low
```

---

## Impact on Your Health Tracking

### Critical Tier 1 Effects:

| If Missing... | Impact on Tracking |
|--------------|-------------------|
| Energy | Can't track daily calorie target (2500/2900 kcal) |
| Protein | Can't track 170g minimum target |
| Fat | Can't track 70g minimum target |
| Carbs | Can't track 250g minimum target |
| Fiber | Can't track 40g minimum target |
| Sat fat | Can't track 20g maximum limit |
| Sodium | Can't track 2300mg maximum limit |

**Result:** Missing any Tier 1 nutrient = incomplete daily tracking

### Tier 2 Monitoring Benefits:

- **MUFA, PUFA:** Fat quality assessment (omega balance)
- **Potassium:** Balances sodium (health marker)
- **Calcium, Iron, Zinc, Magnesium:** Micronutrient adequacy
- **Vitamin C:** Antioxidant status

**Result:** Better long-term health insights, but day-to-day tracking still works without these

---

## Tools & Resources

### Primary Databases (In Order of Use):

1. **Deliveroo/Uber Eats** - Venue calorie counts (mandatory since April 2022)
2. **Product labels** - UK/EU mandatory nutrients
3. **USDA FoodData Central** - https://fdc.nal.usda.gov/ (most complete)
4. **MyFoodData** - https://tools.myfooddata.com/ (user-friendly USDA)
5. **UK McCance & Widdowson** - https://www.gov.uk/.../cofid (UK-specific foods)

### Your Internal Tools:

- **Validation:** `scripts/validate_data_bank.py` (run before commit)
- **New dish:** `scripts/new_dish_from_template.py` (creates file structure)
- **Full methodology:** `ESTIMATE.md` (detailed workflow)
- **This guide:** `references/NUTRIENT-ESTIMATION-GUIDE.md` (comprehensive reference)

---

## Final Recommendations

### What to Do Now:

1. **For new dishes:** Follow Tier 1→Tier 2→Tier 3 priority
2. **For existing dishes with zeros:**
   - Iodine, fiber soluble/insoluble at 0? Leave as-is (appropriate) ✓
   - Other Tier 2 nutrients at 0? Estimate when you next update those dishes
3. **Time management:**
   - Frequently eaten: full Tier 1+2 estimation
   - One-off: Tier 1 only, document as "low confidence"
4. **Documentation:** Always fill `quality.gaps` field when setting Tier 3 to 0

### Red Flags to Watch:

- Energy calculations off by >10% → recheck carbs (available vs total)
- Many dishes missing MUFA/PUFA → estimate when updating (use oil type from ingredients)
- Tier 1 nutrients at 0 → never acceptable, always estimate

### Success Metrics:

- ✓ All dishes have complete Tier 1 nutrients
- ✓ Energy validates via Atwater (±5-8%)
- ✓ 80%+ of dishes have Tier 2 nutrients (MUFA, PUFA, key minerals)
- ✓ Tier 3 at 0 with documentation in `quality.gaps`
- ✓ Daily tracking shows complete macro/micro targets

---

**Next Steps:** Review NUTRIENT-ESTIMATION-GUIDE.md for detailed methodologies, formulas, and examples.
