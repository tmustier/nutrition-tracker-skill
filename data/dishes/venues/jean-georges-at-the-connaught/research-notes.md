# 2025-10-28: Jean-Georges at The Connaught research

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
