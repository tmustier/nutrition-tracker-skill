# Nutrient Estimation Summary: Executive Findings

**Date:** 2025-11-03
**Full Guides:**
- `NUTRIENT-ESTIMATION-GUIDE.md` (comprehensive methodology)
- `FIBER-SPLIT-ESTIMATION-REFERENCE.yaml` (soluble/insoluble ratios)
- `IODINE-ESTIMATION-REFERENCE.yaml` (iodine content by category)
- `MICRONUTRIENT-ESTIMATION-REFERENCE.yaml` (minerals & vitamins)

---

## TL;DR: The "Always Estimate" Philosophy

**Core Principle:** Every nutrient deserves an estimate. Never leave values null or skip nutrients arbitrarily.

**Three-Part Approach:**
1. **Estimate everything** using best available data (USDA, category averages, scientific ratios)
2. **Use 0 only for TRUE ZEROS** (scientifically impossible: cholesterol in plants, iodine in pure oils)
3. **Document confidence** (high/medium/low) for transparency

**Why this matters:**
- Null values break aggregation and tracking
- Even rough estimates (with low confidence) are better than unknowns
- Category-based ranges provide reasonable fallback values
- TRUE ZEROS are scientifically defensible, not guesses

**Quick reference decision:**
- Have USDA data? → Use it (high confidence)
- Know food category? → Use category range (medium confidence)
- Pure ingredient? → Use composition profile (medium confidence)
- Scientifically impossible? → Use 0 (TRUE ZERO, high confidence)

**Estimated time per dish:**
- Packaged (with label): 15-20 minutes (all nutrients)
- Restaurant (with Deliveroo): 45-60 minutes (all nutrients)
- Generic ingredient (USDA): 10 minutes (copy all available)

---

## Confidence-Based Estimation Framework

### HIGH CONFIDENCE Estimates

**When to assign:**
- Direct USDA/McCance data for exact food item
- Mandatory label values (EU regulations)
- Venue calorie counts (legally required accuracy)
- TRUE ZEROS (scientifically impossible values)
- Well-established composition profiles (olive oil fatty acids)

**Examples:**
- `protein_g: 6.5` (from USDA raspberries data) - HIGH
- `cholesterol_mg: 0` (in plant-based food) - HIGH (TRUE ZERO)
- `iodine_ug: 0` (in olive oil, no iodine source) - HIGH (TRUE ZERO)
- `energy_kcal: 592` (from Dishoom Deliveroo) - HIGH

### MEDIUM CONFIDENCE Estimates

**When to assign:**
- Category-based ranges (grains: 1-3mg iron per 100g)
- Composition profiles for mixed dishes
- Component-based calculations with one unknown
- Regional averages with known variability
- Cooking adjustments (-25 to -50% vitamin C)

**Examples:**
- `iodine_ug: 85` (yogurt, UK dairy category average) - MEDIUM
- `fiber_soluble_g: 1.2` (oats, 40% soluble ratio) - MEDIUM
- `iron_mg: 2.1` (whole grain bread, category range) - MEDIUM
- `vitamin_c_mg: 30` (cooked vegetables, -50% adjustment) - MEDIUM

### LOW CONFIDENCE Estimates

**When to assign:**
- Educated guesses with limited data
- Extreme soil/feed variability (selenium, iodine in plants)
- Complex processing effects unknown
- Multiple unknowns in component method
- Extrapolation from distant food categories

**Examples:**
- `selenium_ug: 2` (leafy greens, highly variable) - LOW
- `iodine_ug: 12` (restaurant bread, unknown salt type) - LOW
- `manganese_mg: 0.3` (mixed dish, sparse data) - LOW

**How to document:** Use `quality.confidence` and `quality.gaps` fields in YAML

---

## TRUE ZEROS: When 0 is Scientifically Correct

**Definition:** Values that are biologically/chemically impossible, not "unknown"

### Common TRUE ZEROS by Category

| Nutrient | TRUE ZERO When | Examples |
|----------|---------------|----------|
| **Cholesterol** | Plant-based foods (no animal products) | Fruits, vegetables, grains, oils, nuts |
| **Iodine** | Pure oils, sugar, pure starches | Olive oil, sunflower oil, white sugar |
| **Vitamin B12** | Plant foods (unless fortified) | Vegetables, fruits, grains (natural) |
| **Vitamin D** | Non-fortified plant foods | Raw vegetables, grains, fruits |
| **Lactose** | Dairy-free products | Plant milks, aged cheese (hydrolyzed) |

**How to use:**
- Set `nutrient: 0` in YAML
- Document in `notes: "TRUE ZERO: no animal products"`
- Confidence level: HIGH (scientifically certain)

**NOT TRUE ZEROS (require estimation):**
- Iodine in dairy → estimate using category (UK: 20-150µg per 100g)
- Fiber in processed foods → estimate from base ingredients
- Minerals in mixed dishes → estimate from components
- Vitamins after cooking → adjust raw values, don't zero out

---

## Quick Lookup Tables

### Iodine Content by Food Category

**Use when USDA data unavailable. See `IODINE-ESTIMATION-REFERENCE.yaml` for full details.**

| Food Category | Range (µg/100g) | Typical Value | Confidence |
|---------------|-----------------|---------------|------------|
| **Seaweed** | 1500-8000 | 3000 | LOW (extreme variability) |
| **White fish** | 80-150 | 110 | MEDIUM |
| **Dairy (UK)** | 20-150 | 85 | MEDIUM |
| **Eggs** | 40-60 | 50 | MEDIUM |
| **Meat** | 5-20 | 10 | MEDIUM |
| **Grains (fortified)** | 10-45 | 25 | MEDIUM |
| **Vegetables** | 1-10 | 3 | LOW (soil dependent) |
| **Fruits** | 1-5 | 2 | LOW (soil dependent) |
| **Pure oils** | 0 | 0 | HIGH (TRUE ZERO) |

**Special cases:**
- **Iodized salt:** 4500µg per 100g (UK fortification)
- **UK dairy:** Higher than global average due to farming practices
- **Restaurant salt:** Assume non-iodized unless stated

### Fiber Split Ratios (Soluble:Insoluble)

**Use when only total fiber known. See `FIBER-SPLIT-ESTIMATION-REFERENCE.yaml` for full details.**

| Food Type | Soluble % | Insoluble % | Typical Example |
|-----------|-----------|-------------|-----------------|
| **Oats** | 40% | 60% | 3g total → 1.2g sol, 1.8g insol |
| **Beans/Lentils** | 35% | 65% | 5g total → 1.75g sol, 3.25g insol |
| **Fruits (with skin)** | 30% | 70% | 2g total → 0.6g sol, 1.4g insol |
| **Root vegetables** | 30% | 70% | 2.5g total → 0.75g sol, 1.75g insol |
| **Leafy greens** | 25% | 75% | 1g total → 0.25g sol, 0.75g insol |
| **Whole grains** | 25% | 75% | 3g total → 0.75g sol, 2.25g insol |
| **Nuts** | 20% | 80% | 3g total → 0.6g sol, 2.4g insol |

**Validation:** `soluble_g + insoluble_g = fiber_total_g` (must match exactly)

### Mineral & Vitamin Category Ranges

**Use when USDA data unavailable. See `MICRONUTRIENT-ESTIMATION-REFERENCE.yaml` for full details.**

| Nutrient | Food Category | Range per 100g | Confidence |
|----------|---------------|----------------|------------|
| **Iron** | Red meat | 2-3 mg | MEDIUM |
| **Iron** | Poultry | 0.8-1.5 mg | MEDIUM |
| **Iron** | Whole grains | 1-3 mg | MEDIUM |
| **Iron** | Leafy greens | 1.5-2.7 mg | MEDIUM |
| **Calcium** | Dairy | 100-300 mg | HIGH |
| **Calcium** | Fortified plant milk | 100-120 mg | HIGH |
| **Calcium** | Leafy greens | 40-150 mg | MEDIUM |
| **Zinc** | Meat | 3-7 mg | MEDIUM |
| **Zinc** | Shellfish | 5-15 mg | MEDIUM |
| **Magnesium** | Nuts | 150-300 mg | MEDIUM |
| **Magnesium** | Whole grains | 80-150 mg | MEDIUM |
| **Vitamin C** | Citrus (raw) | 40-70 mg | HIGH |
| **Vitamin C** | Peppers (raw) | 80-190 mg | HIGH |
| **Vitamin C** | Cooked veg | -50% raw value | MEDIUM |

---

## Estimation Strategies by Data Availability

### Strategy 1: Direct USDA/McCance Lookup (Highest Priority)

**When:** Single ingredient or exact match available

**Process:**
1. Search USDA FoodData Central or McCance database
2. Match exact preparation (raw, cooked, method)
3. Copy ALL available nutrients (don't cherry-pick)
4. Note any missing values in `quality.gaps`
5. Set confidence: HIGH for copied values

**Example:** Raspberries 150g
- USDA FDC 167755 has complete macro + most micros
- Copy all values, scale to 150g portion
- `iodine_ug: 2` (estimate using fruit category, not measured in USDA)
- `fiber_soluble_g: 3.4` (calculate from 35% ratio)
- `fiber_insoluble_g: 6.4` (calculate from 65% ratio)

### Strategy 2: Category-Based Ranges (Common Scenario)

**When:** No exact USDA match, but food category is clear

**Process:**
1. Identify food category (dairy, grains, vegetables, etc.)
2. Consult YAML reference files for category ranges
3. Use typical value or mid-range
4. Set confidence: MEDIUM
5. Document source: "Category-based estimate (UK dairy average)"

**Example:** Greek yogurt (UK, no exact brand data)
- Category: UK dairy
- Iodine: 85µg per 100g (UK dairy typical)
- Calcium: 150mg per 100g (dairy mid-range)
- Confidence: MEDIUM for category-based

### Strategy 3: Component-Based Calculation (Restaurant Dishes)

**When:** Multi-ingredient dish with known calories (Deliveroo)

**Process:**
1. **Anchor to venue calories** (legally required accuracy)
2. List all visible/described components
3. Estimate known weights (eggs 50g, bread 60g, etc.)
4. Calculate knowns from USDA data
5. Solve for unknowns (typically oil/butter) to close calorie gap
6. Aggregate all nutrients from components
7. Add finishing salt (0.5% dish weight for "normal")
8. Validate with Atwater formula (±5-8% tolerance)

**Example:** Dishoom Chilli Poached Eggs (592 kcal)
- Components: 2 eggs (100g) + yogurt (120g) + bread (60g) + kale (50g) + butter (solve)
- Known subtotal: 379 kcal
- Solve: 592 - 379 = 213 kcal → ~30g butter
- Aggregate: sum all nutrients from components
- Iodine: 50µg (eggs) + 102µg (yogurt) + 0µg (butter) = 152µg total
- Confidence: HIGH for macros, MEDIUM for micros

---

## Decision Tree: Choosing Your Estimation Approach

```
New nutrient to estimate?
│
├─ Is it scientifically impossible? (cholesterol in plants, iodine in pure oil)
│  └─ YES → Set to 0 (TRUE ZERO), confidence: HIGH
│  └─ NO → Continue
│
├─ Do you have exact USDA/McCance data?
│  └─ YES → Copy value, confidence: HIGH → DONE
│  └─ NO → Continue
│
├─ Is it a pure ingredient with known composition? (olive oil, butter)
│  └─ YES → Use composition profile, confidence: HIGH → DONE
│  └─ NO → Continue
│
├─ Is it a restaurant dish with venue calories?
│  └─ YES → Component-based method, confidence: HIGH (macros), MEDIUM (micros) → DONE
│  └─ NO → Continue
│
├─ Can you identify food category clearly?
│  └─ YES → Use category range from YAML, confidence: MEDIUM → DONE
│  └─ NO → Continue
│
└─ Last resort: Find closest analog, estimate conservatively, confidence: LOW → DONE
```

**Key principle:** There's ALWAYS a way to estimate. Never skip or leave null.

---

## Validation & Quality Checks

### Required Checks Before Committing

**Mathematical Relationships:**
- [ ] **Atwater formula:** `4P + 9F + 4C_avail + 2fiber + 2.4polyols = energy` (±5-8%)
- [ ] **Carbs relationship:** `total = available + fiber + polyols` (exact)
- [ ] **Fat split:** `sat + MUFA + PUFA + trans ≤ total_fat × 1.05` (allow 5% rounding)
- [ ] **Fiber split:** `soluble + insoluble = fiber_total` (exact)
- [ ] **Sodium/salt:** `sodium_mg ≈ salt_g × 400` (±2%)

**Nutrient Completeness:**
- [ ] All **macronutrients** estimated (protein, fat, carbs, fiber)
- [ ] All **mandatory label nutrients** included (energy, sat fat, sugars, sodium)
- [ ] **Fatty acids** estimated when fat source known
- [ ] **Key minerals** estimated using category ranges (calcium, iron, zinc, potassium, magnesium)
- [ ] **Vitamins** estimated where applicable (C in fruits/veg, B12 in animal products)
- [ ] **Iodine** estimated using category or set to TRUE ZERO
- [ ] **Fiber split** calculated from total using ratios

**Documentation Quality:**
- [ ] `quality.confidence` set appropriately (high/medium/low)
- [ ] `quality.gaps` lists any nutrients set to 0 (if not TRUE ZERO)
- [ ] `notes` explains TRUE ZEROS and estimation methods
- [ ] Sources listed in `references` field

**Run Validation:**
```bash
python scripts/validate_data_bank.py
```

---

## Estimation Priorities: Optimize Your Time

### Always Estimate (Critical for Tracking)

**These nutrients break daily tracking if missing:**
1. Energy (kcal)
2. Protein (g)
3. Fat (g)
4. Carbs available (g)
5. Carbs total (g)
6. Fiber total (g)
7. Saturated fat (g)
8. Sodium (mg)
9. Sugar (g)

**Time investment:** 15-20 minutes
**Impact:** Makes or breaks daily tracking

### Estimate When Possible (Important for Health Insights)

**These enhance health monitoring:**
- MUFA, PUFA (g) - fatty acid quality
- Trans fat (g) - health risk
- Cholesterol (mg) - cardiovascular tracking
- Potassium (mg) - sodium balance
- Calcium (mg) - bone health
- Iron (mg) - anemia prevention
- Zinc (mg) - immune function
- Vitamin C (mg) - antioxidant status
- Magnesium (mg) - metabolic health

**Time investment:** +10-15 minutes
**Impact:** Better long-term patterns and health insights

### Always Attempt (Use Category Ranges)

**These are harder but should never be null:**
- Iodine (µg) - thyroid function
- Selenium (µg) - antioxidant (high variability)
- Fiber soluble/insoluble (g) - digestive health
- Manganese (mg) - trace mineral
- B vitamins - energy metabolism
- Vitamin D (µg) - bone/immune health

**Time investment:** +5-10 minutes (using category ranges)
**Impact:** Complete nutritional profile, no null values

---

## Reference to YAML Lookup Files

### IODINE-ESTIMATION-REFERENCE.yaml

**Use for:** Quick iodine estimates by food category

**Contents:**
- Food category ranges (seaweed, fish, dairy, meat, grains, vegetables)
- UK-specific dairy values (higher than global average)
- Salt fortification levels
- Regional variability notes
- Confidence guidance for each category

**Example usage:**
```
Need iodine for Greek yogurt (UK)?
→ Consult YAML: UK dairy category
→ Use: 85µg per 100g (typical)
→ Confidence: MEDIUM
```

### FIBER-SPLIT-ESTIMATION-REFERENCE.yaml

**Use for:** Calculating soluble/insoluble fiber from total

**Contents:**
- Soluble:insoluble ratios by food type
- Worked examples for common foods
- Validation rules (must sum to total)
- Source references for ratios

**Example usage:**
```
Have: 3.0g total fiber in whole grain bread
→ Consult YAML: Whole grains = 25% soluble, 75% insoluble
→ Calculate: 0.75g soluble, 2.25g insoluble
→ Validate: 0.75 + 2.25 = 3.0 ✓
→ Confidence: MEDIUM
```

### MICRONUTRIENT-ESTIMATION-REFERENCE.yaml

**Use for:** Category-based mineral and vitamin estimates

**Contents:**
- Minerals: calcium, iron, zinc, potassium, magnesium, manganese, selenium
- Vitamins: A, C, D, E, K, B-complex
- Category ranges by food type
- Cooking adjustments (vitamin C losses)
- Confidence guidance

**Example usage:**
```
Need iron for 100g grilled chicken breast (no USDA exact match)?
→ Consult YAML: Poultry category
→ Use: 0.8-1.5 mg per 100g, typical 1.1mg
→ Confidence: MEDIUM
```

---

## Success Metrics

### Quality Indicators (Aim For)

✓ **Zero null values** in nutrient fields (estimate everything)
✓ **TRUE ZEROS documented** in notes (scientifically justified)
✓ **95%+ Atwater validation** within ±5-8% tolerance
✓ **Confidence levels assigned** to all estimates
✓ **All dishes have complete macros** (protein, fat, carbs, fiber, energy)
✓ **80%+ dishes have complete micros** (using category estimates when needed)
✓ **Fiber splits calculated** when total fiber known
✓ **Iodine estimated** for all foods (category-based or TRUE ZERO)

### Daily Tracking Completeness

**With complete estimation:**
- ✓ Daily calorie target trackable (2500/2900 kcal)
- ✓ Protein minimum tracked (170g)
- ✓ Fat minimum tracked (70g)
- ✓ Carbs minimum tracked (250g)
- ✓ Fiber minimum tracked (40g)
- ✓ Sat fat maximum tracked (20g)
- ✓ Sodium maximum tracked (2300mg)
- ✓ Micronutrient patterns visible
- ✓ No broken aggregations from null values

---

## Final Recommendations

### New Philosophy Checklist

When adding any dish:
1. ☑ **Estimate every nutrient** (no skipping, no arbitrary zeros)
2. ☑ **Use TRUE ZEROS appropriately** (scientifically impossible only)
3. ☑ **Apply category ranges** when USDA data unavailable
4. ☑ **Calculate fiber splits** from total using ratios
5. ☑ **Document confidence levels** (high/medium/low)
6. ☑ **Reference YAML files** for quick lookups
7. ☑ **Validate relationships** (Atwater, carbs, fat split, fiber split)
8. ☑ **Run validation script** before committing

### Time Management

**Frequently eaten dishes (>5x/month):**
- Invest 60-75 minutes for complete estimation
- All nutrients, high detail, extensive validation
- Confidence: aim for HIGH on macros, MEDIUM on most micros

**Occasional dishes (1-4x/month):**
- Invest 30-45 minutes for thorough estimation
- All critical nutrients, category ranges for micros
- Confidence: MEDIUM acceptable for many values

**One-off dishes:**
- Invest 20-30 minutes for complete basic estimation
- Use category ranges extensively
- Confidence: LOW acceptable, but still estimate everything

**Key principle:** Even a LOW confidence estimate is better than null/missing data

---

**Next Steps:**

1. Review `NUTRIENT-ESTIMATION-GUIDE.md` for detailed methodologies
2. Consult YAML reference files for quick category lookups
3. Apply "always estimate" philosophy to new dishes
4. Update existing dishes opportunistically (when reviewing/editing)
5. Run validation script regularly to catch gaps

**Remember:** The goal is complete, honest data with appropriate confidence levels—not perfection. Estimate everything, document your confidence, and let the data improve over time.
