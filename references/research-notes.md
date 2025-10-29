# Research Notes & Methodology Learnings

This document captures accumulated research findings, methodology lessons, and venue-specific guidance discovered while adding dishes to the Data Bank. These notes inform future dish additions and help avoid common pitfalls.

---

## 2025-10-28: Jean-Georges at The Connaught research
**Finding nutrition data for high-end restaurants:**
- Deliveroo UK typically shows calorie counts for items (legal requirement)
- Some items may be blocked from web scraping (403 errors) - ask user to check their app
- For items without full nutritional breakdown:
  - Use calorie count as anchor
  - Estimate macros from menu descriptions (e.g., "coconut & lime" → high sat fat from coconut)
  - For soups: estimate ~300g portion for restaurant serving
  - For sandwiches: weigh if possible, or estimate from typical bread + filling weights

**Micronutrient estimation strategy:**
- For beef dishes: high in iron, zinc, potassium, cholesterol (wagyu ~90mg cholesterol per 100g)
- For broccoli-based: high vitamin C (40mg per serving), good potassium, calcium
- For coconut-based: very high saturated fat (~80% of total fat in coconut milk)
- For chips/fries: use McDonald's UK profile as reasonable baseline, scale to match stated calories

**MUFA/PUFA breakdown when not provided:**
- Wagyu beef: MUFA > PUFA (roughly 40% MUFA, 20% PUFA of total fat)
- Restaurant fries: depends on oil used, but typically low sat fat (~2-3g per 450 kcal serving)
- Ketchup: essentially zero fat

**Validation tips:**
- Atwater calculation: protein×4 + carbs×4 + fat×9 should match ±5-8%
- Fat split: sat + MUFA + PUFA + trans should be ≤ total fat
- For soup with coconut: sat fat will be ~75-80% of total fat (this is normal, not an error)
- Document estimation methods clearly in `notes` field for future reference

---

## 2025-10-29: L'ETO Soho - Component-based methodology lessons
**Critical errors to avoid:**
- DON'T overestimate bread portions (use 60g slice, not 100g) - bread slices are typically 50-70g
- DON'T underestimate butter/oil in restaurant dishes - they're generous with fats
- DON'T forget finishing salt (0.5% of dish weight) PLUS intrinsic sodium from ingredients
- DON'T guess at component weights - work backwards from calorie anchor using the "solve for X" method

**Component-based calculation checklist:**
1. List all components from ingredient list
2. Estimate known component weights conservatively (eggs 50g each, yogurt 120g, bread slice 60g, veg 50-80g)
3. Calculate sub-totals for known components using MyFoodData/USDA
4. Solve for unknown component (usually butter/oil) to close calorie gap
5. Get complete profiles for ALL components (including sat/MUFA/PUFA splits)
6. Calculate total dish weight and apply finishing salt (0.5%)
7. Sum all sodium: finishing salt + salted butter + bread + intrinsic sodium
8. Validate with Atwater formula (should be within ±5%)

**Why this matters:**
- L'ETO Chilli Poached Eggs: Initial estimate had carbs 54% too high (62g vs 40.3g) and fat 32% too low (26g vs 34.2g)
- Sodium was 81% underestimated (850mg vs 1,543mg) due to missing finishing salt calculation
- Result: Would have given user false confidence about sat fat budget (actually at 93% of daily max, not 79%)

**Key references for component-based dishes:**
- MyFoodData.com: USDA-derived profiles with full macro/micro breakdowns
- Standard portions: eggs 50g, bread slice 60g, yogurt 100-120g, cooked veg 50-80g
- Butter solving: Use ~7.2 kcal/g to calculate weight needed to close calorie gap
