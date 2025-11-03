# Research Notes: L'ETO Caffe, Soho

**Date:** 2025-10-29

## Component-based methodology lessons

### Critical errors to avoid

- DON'T overestimate bread portions (use 60g slice, not 100g) - bread slices are typically 50-70g
- DON'T underestimate butter/oil in restaurant dishes - they're generous with fats
- DON'T forget finishing salt (0.5% of dish weight) PLUS intrinsic sodium from ingredients
- DON'T guess at component weights - work backwards from calorie anchor using the "solve for X" method

### Component-based calculation checklist

1. List all components from ingredient list
2. Estimate known component weights conservatively (eggs 50g each, yogurt 120g, bread slice 60g, veg 50-80g)
3. Calculate sub-totals for known components using MyFoodData/USDA
4. Solve for unknown component (usually butter/oil) to close calorie gap
5. Get complete profiles for ALL components (including sat/MUFA/PUFA splits)
6. Calculate total dish weight and apply finishing salt (0.5%)
7. Sum all sodium: finishing salt + salted butter + bread + intrinsic sodium
8. Validate with Atwater formula (should be within ±5%)

### Why this matters

- L'ETO Chilli Poached Eggs: Initial estimate had carbs 54% too high (62g vs 40.3g) and fat 32% too low (26g vs 34.2g)
- Sodium was 81% underestimated (850mg vs 1,543mg) due to missing finishing salt calculation
- Result: Would have given user false confidence about sat fat budget (actually at 93% of daily max, not 79%)

### Key references for component-based dishes

- MyFoodData.com: USDA-derived profiles with full macro/micro breakdowns
- Standard portions: eggs 50g, bread slice 60g, yogurt 100-120g, cooked veg 50-80g
- Butter solving: Use ~7.2 kcal/g to calculate weight needed to close calorie gap
