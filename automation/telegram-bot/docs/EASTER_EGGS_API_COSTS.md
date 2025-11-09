# Easter Egg System: API Cost Analysis

## Overview

The easter egg system adds scene detection to every photo processed by the Telegram bot. This document analyzes the cost implications and provides recommendations for cost optimization.

## Cost Impact

### Token Usage Increase

**Without scene detection:**
- Base nutrition extraction prompt: ~2,000 tokens
- Typical photo: ~1,000 image tokens
- **Total per photo:** ~3,000 tokens

**With scene detection (current):**
- Base nutrition extraction prompt: ~2,000 tokens
- Scene detection extension: ~300-400 tokens
- Typical photo: ~1,000 image tokens
- **Total per photo:** ~3,400 tokens

### Percentage Increase

- **Input tokens:** +13-20% increase
- **Output tokens:** Minimal change (scene detection adds ~50-100 tokens)
- **Overall cost increase:** ~15% per photo

### Cost Projections

Based on Claude Sonnet 4.5 pricing (as of 2025-01):
- Input: $3 per million tokens
- Output: $15 per million tokens

#### Low Volume (10 photos/day, 1 user)
- **Without scene detection:** ~3,000 tokens × 10 × 30 = 900K tokens/month = **$2.70/month**
- **With scene detection:** ~3,400 tokens × 10 × 30 = 1.02M tokens/month = **$3.10/month**
- **Increase:** +$0.40/month (15%)

#### Medium Volume (50 photos/day, 5 users)
- **Without scene detection:** ~3,000 tokens × 50 × 30 = 4.5M tokens/month = **$13.50/month**
- **With scene detection:** ~3,400 tokens × 50 × 30 = 5.1M tokens/month = **$15.50/month**
- **Increase:** +$2/month (15%)

#### High Volume (100 photos/day, 20 users)
- **Without scene detection:** ~3,000 tokens × 100 × 30 = 9M tokens/month = **$27/month**
- **With scene detection:** ~3,400 tokens × 100 × 30 = 10.2M tokens/month = **$31/month**
- **Increase:** +$4/month (15%)

#### Very High Volume (1000 photos/day, 100+ users)
- **Without scene detection:** ~3,000 tokens × 1,000 × 30 = 90M tokens/month = **$270/month**
- **With scene detection:** ~3,400 tokens × 1,000 × 30 = 102M tokens/month = **$310/month**
- **Increase:** +$40/month (15%)

## Cost Optimization Strategies

### 1. Prompt Caching (Recommended)

Anthropic's prompt caching can reduce input token costs by up to 90% for repeated prompts.

**Implementation:**
```javascript
// Cache the scene detection instructions
const cachedPrompt = {
  system: [
    { type: "text", text: baseNutritionPrompt, cache_control: { type: "ephemeral" } },
    { type: "text", text: sceneDetectionPrompt, cache_control: { type: "ephemeral" } }
  ]
};
```

**Savings:**
- Cached tokens cost: $0.30 per million (90% reduction)
- Uncached tokens cost: $3 per million
- **Potential savings:** 40-60% reduction in total cost for high-volume users

**Status:** Not yet implemented (requires anthropic SDK update)

### 2. Conditional Scene Detection

Only run scene detection when confidence is low or user explicitly requests easter eggs.

**Implementation:**
```javascript
// Only add scene detection if:
// - User has easter eggs enabled in settings
// - OR initial extraction returned low confidence
// - OR image quality is questionable
```

**Savings:** 50-70% reduction in scene detection overhead (depending on user preferences)

**Trade-off:** Some easter eggs may not trigger if scene detection is skipped

**Status:** Not yet implemented

### 3. Model Selection

Use Claude Haiku for scene detection only, then Sonnet for nutrition extraction.

**Implementation:**
```javascript
// Two-pass approach:
// 1. Haiku for fast scene detection (~10x cheaper)
// 2. Sonnet for accurate nutrition extraction
```

**Savings:** Scene detection cost reduced by 90%, overall cost reduced by ~10%

**Trade-off:** Additional API call adds ~200-300ms latency

**Status:** Not yet implemented (requires refactoring)

### 4. Smart Batching

Batch multiple photos from the same user within a time window.

**Implementation:**
```javascript
// If user sends 3 photos within 5 minutes:
// - Process as single API call
// - Shared scene detection overhead
```

**Savings:** Amortize prompt overhead across multiple photos

**Trade-off:** Delayed processing, more complex code

**Status:** Not yet implemented (low priority)

## Monitoring Recommendations

### Key Metrics to Track

1. **Average tokens per photo**
   - Track input/output token counts
   - Alert if exceeds expected range (3,000-4,000 tokens)

2. **Scene detection trigger rate**
   - % of photos that trigger easter eggs
   - If <5%, consider disabling for cost savings

3. **Monthly API spend**
   - Set budget alerts at $10, $50, $100, $500
   - Track spending velocity ($/day)

4. **Cost per user**
   - Identify high-volume users
   - Consider usage limits for very high consumers

### Monitoring Implementation

```javascript
// In webhook.js, log token usage
console.log('[API_COST]', {
  userId,
  timestamp: new Date().toISOString(),
  inputTokens: result.usage.input_tokens,
  outputTokens: result.usage.output_tokens,
  cachedTokens: result.usage.cache_read_tokens || 0,
  sceneDetection: !!result.scene_detection,
  easterEggTriggered: !!easterEggResult,
});
```

**Analysis:**
```bash
# Daily cost estimate
grep '\[API_COST\]' logs.txt | jq -r '.inputTokens' | awk '{sum+=$1} END {print sum/1000000*3}'
```

## Recommendations by Usage Level

### Personal Use (<10 photos/day)
- **Action:** No optimization needed
- **Cost:** <$5/month
- **Easter eggs:** Keep enabled for fun

### Small Team (10-100 photos/day)
- **Action:** Monitor costs, consider prompt caching
- **Cost:** $5-30/month
- **Easter eggs:** Keep enabled, monitor engagement

### Production (100-1000 photos/day)
- **Action:** Implement prompt caching ASAP
- **Cost:** $30-300/month → $15-150/month with caching
- **Easter eggs:** Consider conditional scene detection

### High Scale (1000+ photos/day)
- **Action:** Full optimization (caching + conditional + monitoring)
- **Cost:** $300+/month → $100-150/month optimized
- **Easter eggs:** Conditional only, or user opt-in

## Current Status

✅ **Implemented:**
- Scene detection in single API call (no extra calls)
- Efficient prompt structure
- LRU caching for cooldowns (prevents duplicate triggers)

❌ **Not Implemented:**
- Prompt caching (biggest savings opportunity)
- Conditional scene detection
- Cost monitoring/alerts
- Multi-model approach

🔄 **In Progress:**
- API cost documentation (this document)
- Token usage logging

## Next Steps

1. **Short-term (1-2 weeks):**
   - Add token usage logging to webhook.js
   - Set up daily cost reports
   - Establish baseline metrics

2. **Medium-term (1-2 months):**
   - Implement prompt caching (60% cost reduction)
   - Add cost alerts and monitoring dashboard
   - Consider conditional scene detection based on user feedback

3. **Long-term (3+ months):**
   - Multi-model approach if latency is acceptable
   - User preferences for easter eggs (opt-in/opt-out)
   - Advanced analytics on cost vs. engagement

## Conclusion

The easter egg system adds **~15% to API costs** in exchange for improved user experience and engagement. For most users, this is acceptable (<$5/month increase).

**For production deployments:**
- Implement prompt caching for **60% cost reduction**
- Monitor token usage and set budget alerts
- Consider conditional scene detection for very high volume

**ROI Consideration:**
If easter eggs improve user retention by even 10-20%, the additional cost is justified. Consider tracking:
- User engagement (messages per user)
- Retention rate (% users active after 30 days)
- Easter egg reaction (user feedback)

To quantify value, run A/B test:
- Group A: Easter eggs enabled (current)
- Group B: Easter eggs disabled
- Measure engagement, retention, satisfaction

If Group A shows meaningful improvement, the 15% cost increase is worth it.
