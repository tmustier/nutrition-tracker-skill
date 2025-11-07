# Easter Egg Safety System - Quick Reference

## The Golden Rule

**NEVER let an easter egg prevent actual food from being logged.**

When in doubt → Extract nutrition.

---

## Decision Matrix

| Scenario | has_food | Confidence | Action |
|----------|----------|------------|--------|
| Any scenario | TRUE | any | ✅ **Extract nutrition** |
| Any scenario | FALSE | low/medium | ✅ **Extract nutrition** (safety) |
| Any scenario | n/a | low (overall) | ✅ **Extract nutrition** (safety) |
| has_nutrition_label | TRUE | medium/high | ✅ **Extract nutrition** (priority) |
| Detection timeout | n/a | n/a | ✅ **Extract nutrition** (safety) |
| Detection failure | n/a | n/a | ✅ **Extract nutrition** (safety) |
| Easter egg scenario | FALSE | high | 🎉 **Easter egg** (safe) |

---

## Safety Checklist Before Triggering Easter Egg

Before triggering ANY easter egg, verify ALL of these:

- [ ] Overall confidence = HIGH
- [ ] Scenario-specific confidence = HIGH
- [ ] has_food confidence = HIGH (confirming NO food)
- [ ] has_nutrition_label = FALSE (or LOW confidence)
- [ ] Detection succeeded (no timeout/error)
- [ ] Scenario-specific safety checks passed

If ANY check fails → Extract nutrition instead.

---

## Easter Egg Types

### Type 1: Blocking Easter Eggs
These PREVENT nutrition extraction (only if all safety checks pass):

1. **Person without food** - Selfies, portraits (no meal context)
2. **Pet** - Animal photos (not pet food)
3. **Empty plate** - Clean plate (no remnants)
4. **Non-food item** - Soap, decorative candles
5. **Shopping scene** - Grocery aisles, menus (not prepared food)
6. **Screenshot/meme** - Digital content (not nutrition apps)
7. **Empty packaging** - Empty wrappers (no nutrition label visible)

### Type 2: Companion Easter Eggs
These ENHANCE nutrition extraction (never block):

8. **Midnight munchies** - 10pm-4am + has_food → Extract + fun message
9. **Celebration** - Birthday cake → Extract + celebration message

---

## Implementation Pattern

```javascript
// STEP 1: Detect (with timeout)
const detection = await detectEasterEggScenario(imageBuffer, mimeType);

// STEP 2: Apply safety logic
if (detection.should_attempt_nutrition_extraction) {
  await extractNutrition(imageBuffer, mimeType);
}

// STEP 3: Show easter egg (if applicable)
if (detection.should_trigger_easter_egg) {
  await showEasterEgg(detection.easter_egg_scenario);
}

// CRITICAL: Never return early without attempting nutrition extraction
// unless you're absolutely certain (high confidence) there's no food
```

---

## Common Edge Cases

| Scenario | has_person | has_food | Action |
|----------|------------|----------|--------|
| Person eating burger | ✓ | ✓ | Extract (food present) |
| Pet near food bowl | ✓ | ✓ | Extract (food present) |
| Empty plate with sauce | - | ? | Extract (uncertain) |
| Screenshot of nutrition app | - | - | Extract (has_nutrition_label) |
| Birthday cake | - | ✓ | Extract + easter egg |
| Restaurant menu | - | - | Easter egg (high confidence) |
| Empty package with label | - | - | Extract + easter egg |

---

## Timeout Settings

```javascript
{
  easter_egg_detection: 10_000 ms,      // 10 seconds max
  nutrition_extraction: 120_000 ms      // 120 seconds (critical)
}
```

If easter egg detection times out → Skip easter egg, extract nutrition

---

## Confidence Mapping

| Claude Response | Mapped Confidence |
|----------------|------------------|
| "very high", "certain", "clearly", "obviously" | high |
| "probably", "likely", "appears to", "seems to" | medium |
| Everything else | low |

---

## Testing Priorities

### MUST extract nutrition:
- Person eating food
- Food with low/medium detection confidence
- Nutrition labels (any confidence)
- Detection timeout/failure
- Low overall confidence

### Safe to trigger easter egg:
- High confidence person, high confidence no food, no meal context
- High confidence pet, high confidence no food
- High confidence empty plate, no remnants

### Extract + easter egg:
- Birthday cake with candles
- Midnight food (10pm-4am)
- Empty package with visible nutrition label

---

## Monitoring

Log every decision with:
- Detection result (all fields)
- Confidence levels
- Decision reasoning
- Final action taken
- Whether nutrition was extracted
- Whether easter egg was shown

This allows post-hoc analysis of any missed food.

---

## Emergency Override

If users report missed food, immediately:

1. Check logs for detection result
2. Identify which confidence level was wrong
3. Add explicit safety check for that pattern
4. Lower confidence threshold if needed
5. **Bias toward nutrition extraction**

Remember: False positive easter egg (annoying) >> False negative nutrition (data loss)
