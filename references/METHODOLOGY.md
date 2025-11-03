# General Research Methodology & Best Practices

This document contains general methodology learnings and best practices that apply across all venues. For venue-specific research notes, see the RESEARCH.md files in each venue folder.

## Research Sources

### Primary Sources
- Deliveroo UK (calorie counts are legally required)
- Uber Eats UK
- Venue websites and nutrition PDFs
- Packaged product labels

### Secondary Sources
- USDA FoodData Central
- MyFoodData.com (USDA-derived with full breakdowns)
- Comparable dishes from similar venues

## Standard Portions

- Eggs: 50g each
- Bread slice: 60g (50-70g range)
- Yogurt: 100-120g for restaurant servings
- Cooked vegetables: 50-80g portions
- Restaurant soup: ~300g serving

## Component-Based Estimation

When a dish has multiple identifiable components:
1. List all components from ingredient list
2. Estimate weights for known components
3. Calculate nutritional sub-totals using USDA/MyFoodData
4. Solve for unknown component (usually fat/oil) to close calorie gap
5. Apply finishing salt (0.5% of dish weight)
6. Validate with Atwater formula (±5-8% tolerance)

## Validation Checks

- **Energy**: `4×protein + 9×fat + 4×carbs_available + 2×fibre + 2.4×polyols` should match ±5-8%
- **Fat split**: `sat + MUFA + PUFA + trans ≤ total_fat`
- **Sodium↔salt**: `salt_g = sodium_mg × 2.5 / 1000`
- **No negative values**
- **Carbs relationship**: `carbs_total = carbs_available + fiber + polyols`

## Fatty Acid Profiles

### Common oils
- Olive oil: ~73% MUFA, ~11% PUFA, ~14% SFA
- Coconut: ~83% SFA, ~6% MUFA, ~2% PUFA
- Butter: ~51% SFA, ~21% MUFA, ~3% PUFA

### Common proteins
- Wagyu beef: ~40% MUFA, ~20% PUFA of total fat
- Chicken: ~45% MUFA, ~21% PUFA of total fat
- Salmon: ~29% MUFA, ~40% PUFA of total fat

## Documentation Standards

- Document all estimation methods in `notes` field
- Record all sources in `source.evidence`
- Use `change_log` to track all updates
- State assumptions clearly in `assumptions` field
- Flag confidence level in `quality.confidence`

## Common Pitfalls

- Overestimating bread portions (use 60g, not 100g)
- Underestimating restaurant butter/oil usage
- Forgetting finishing salt calculation
- Using total carbs when source is UK/EU (they report available carbs)
- Not validating energy calculation
