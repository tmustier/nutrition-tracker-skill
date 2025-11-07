# Sodium-to-Potassium Ratio Tracking Guide

## Overview

This guide explains the critical difference between **molar ratio** and **mass ratio** for sodium-to-potassium (Na:K) tracking, and why tracking the molar ratio is essential for cardiovascular health.

## The Critical Difference

### Molar Ratio (mmol:mmol) - THE HEALTH METRIC
- **WHO Recommendation**: ≤1.0 for optimal cardiovascular health
- **What it measures**: Equal numbers of sodium and potassium molecules/ions
- **Why it matters**: Biological processes work at the molecular level - your body responds to the number of Na+ and K+ ions, not their mass
- **Conversion formulas**:
  - Na (mmol) = Na (mg) / 22.99
  - K (mmol) = K (mg) / 39.10

### Mass Ratio (mg:mg) - FOR REFERENCE ONLY
- **What it measures**: Raw mass of sodium vs potassium
- **Why it's misleading**: Potassium atoms are heavier than sodium atoms (39.10 vs 22.99 atomic mass units)
- **The trap**: A 1:1 mass ratio (1000mg Na : 1000mg K) actually means 1.7:1 molar ratio - way over the ideal!

## Real Example: November 6, 2025

The data clearly demonstrates why molar ratio matters:

```
Sodium:    4982mg = 216.7 mmol
Potassium: 4927mg = 126.0 mmol

Mass Ratio:  1.01 (looks great!)
Molar Ratio: 1.72 (way over ideal!)
```

**The Problem**: Even though the mass ratio is nearly perfect at 1:1, the molar ratio shows you're consuming 72% more sodium ions than potassium ions at the molecular level.

## Why This Matters for Health

1. **Blood Pressure Regulation**: Na+ and K+ ions compete for the same receptors in your kidneys and blood vessels
2. **Cellular Function**: Cell membranes use Na-K pumps that work with ion counts, not mass
3. **Cardiovascular Risk**: Studies show molar Na:K ratio >1.0 significantly increases cardiovascular disease risk
4. **WHO Guidelines**: Based on molar ratios from epidemiological studies

## To Achieve Ideal Molar Ratio ≤1.0

Since potassium is heavier (1.7x the atomic weight of sodium), you need approximately:

- **For equal molar amounts (1:1)**: ~1700mg K per 1000mg Na
- **To offset 2300mg Na (daily max)**: Need ~3900mg K minimum
- **Current UK average**: 2400mg Na, 2400mg K = 1.7:1 molar ratio (poor!)

## Foods High in Potassium (per 100g)

- Sweet potato: 337mg
- Avocado: 485mg
- Banana: 358mg
- Spinach (cooked): 466mg
- White beans: 561mg
- Lentils: 369mg
- Salmon: 363mg

## Implementation in This System

### In `health-profile.yaml`:
```yaml
monitoring:
  na_k_molar_ratio: true   # Track the health metric
  na_k_mass_ratio: true    # Track for reference
```

### In Nutrition Summary Script:
The `calculate_nutrition_summary.py` script now displays:
- Sodium and potassium in both mg and mmol
- Molar ratio with WHO ideal comparison
- Mass ratio for reference
- Warning when molar ratio >1.0

## References

- World Health Organization (2012). "Guideline: Sodium intake for adults and children"
- World Health Organization (2012). "Guideline: Potassium intake for adults and children"
- Cook NR, et al. (2009). "Joint effects of sodium and potassium intake on subsequent cardiovascular disease: the Trials of Hypertension Prevention follow-up study." Arch Intern Med.
- Yang Q, et al. (2011). "Sodium and potassium intake and mortality among US adults: prospective data from the Third National Health and Nutrition Examination Survey." Arch Intern Med.

## Quick Reference

| Metric | Formula | Target | Why Track |
|--------|---------|--------|-----------|
| **Molar Ratio** | (Na mg / 22.99) ÷ (K mg / 39.10) | ≤1.0 | **PRIMARY health metric** |
| Mass Ratio | Na mg ÷ K mg | ~0.59 for 1:1 molar | Reference only |

**Remember**: Your body counts molecules, not grams!
