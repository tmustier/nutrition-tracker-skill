# Easter Egg System - Quick Start

## 5-Minute Overview

### What It Does
Centralized configuration system for managing special bot responses (easter eggs) when users send unexpected content (selfies, pets, empty plates, etc.).

### Key Features
- ✅ **No code changes to add new easter eggs** - just edit config
- ✅ **Easy enable/disable** - per type or globally
- ✅ **Automatic cooldowns** - prevent spam
- ✅ **Message randomization** - keep it fresh
- ✅ **Priority system** - control which easter egg triggers first
- ✅ **Blocking vs Companion** - some block nutrition, some enhance it

---

## Quick Integration

### Step 1: Import the manager
```javascript
const easterEggManager = require('./easter-egg-manager');
```

### Step 2: Replace old detection logic
**Before:**
```javascript
if (detectionResult.has_person && !detectionResult.has_food) {
  const messages = ["Message 1", "Message 2"];
  await ctx.reply(messages[0]);
  return;
}
```

**After:**
```javascript
const result = easterEggManager.evaluateDetection(detectionResult, userId);

if (result.shouldTrigger && result.canTrigger) {
  await ctx.reply(result.getMessage());
  result.recordTrigger();

  if (result.blocksNutritionExtraction) {
    return; // Stop here
  }
}
```

### Step 3: Done!
That's it. The system handles everything else.

---

## Add a New Easter Egg

Edit `/home/user/nutrition-tracking/automation/telegram-bot/src/easter-egg-config.js`:

```javascript
const EASTER_EGG_TYPES = {
  // ... existing easter eggs ...

  my_new_easter_egg: {
    id: 'my_new_easter_egg',
    displayName: 'My New Easter Egg',
    description: 'What triggers this',

    enabled: true,
    cooldownDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
    priority: 5,
    blocksNutritionExtraction: true,

    detectionCriteria: {
      has_something: true,
      has_food: false,
      min_something_confidence: 'high',
    },

    messages: [
      "Message 1 with emojis 😄",
      "Message 2 with emojis 🎉",
    ],

    metadata: {
      category: 'wrong_content',
      tags: ['tag1', 'tag2'],
    }
  },
};
```

No changes to webhook.js needed!

---

## Quick Reference

### Available Easter Eggs

| Easter Egg | Blocks Nutrition? | Cooldown | Priority |
|------------|-------------------|----------|----------|
| celebration | ❌ No (companion) | 30 days | 10 |
| midnight_munchies | ❌ No (companion) | 12 hours | 9 |
| person_without_food | ✅ Yes | 7 days | 8 |
| pet | ✅ Yes | 3 days | 7 |
| empty_plate | ✅ Yes | 2 days | 6 |
| non_food_item | ✅ Yes | 7 days | 5 |
| shopping_scene | ✅ Yes | 3 days | 4 |
| screenshot_meme | ✅ Yes | 2 days | 3 |
| empty_packaging | ✅ Yes | 2 days | 2 |

### Detection Criteria Examples

```javascript
// Simple boolean check
detectionCriteria: {
  has_person: true,
  has_food: false,
}

// With confidence thresholds
detectionCriteria: {
  has_person: true,
  min_person_confidence: 'high', // Must be 'high' confidence
  has_food: false,
  min_no_food_confidence: 'high', // VERY sure no food
}

// Time-based
detectionCriteria: {
  has_food: true,
  time_window: { start: 22, end: 4 }, // 10pm - 4am
}

// Complex conditions
detectionCriteria: {
  is_screenshot: true,
  has_nutrition_label: false, // Screenshot but NOT nutrition label
  min_screenshot_confidence: 'high',
}
```

### Common Operations

```javascript
// Check if user can see specific easter egg
const eligibility = easterEggManager.checkEligibility('person_without_food', userId);
if (!eligibility.eligible) {
  console.log(eligibility.reason);
}

// Get user's cooldown status
const status = easterEggManager.getUserCooldownStatus(userId);
for (const [eggId, info] of Object.entries(status)) {
  console.log(`${info.easterEggName}: ${info.onCooldown ? 'On cooldown' : 'Available'}`);
}

// Manual trigger (testing)
const result = easterEggManager.manualTrigger('person_without_food', userId);
console.log(result.message);

// Clear cooldowns (testing)
easterEggManager.clearUserCooldowns(userId);

// Get statistics
const stats = easterEggManager.getStats();
console.log(`Enabled: ${stats.enabled}, Blocking: ${stats.blocking}`);
```

---

## Disable Easter Eggs

### Disable All
```bash
# Environment variable
EASTER_EGGS_ENABLED=false

# Or in code
GLOBAL_CONFIG.enabled = false;
```

### Disable Specific Type
```javascript
person_without_food: {
  // ...
  enabled: false, // ← Set to false
  // ...
}
```

---

## Environment Variables

```bash
# Global control
EASTER_EGGS_ENABLED=false          # Disable all easter eggs
EASTER_EGG_LOG_TRIGGERS=false     # Disable trigger logging
MAX_COOLDOWN_ENTRIES=500          # Limit memory usage

# Per-type cooldowns (in milliseconds)
COOLDOWN_PERSON_WITHOUT_FOOD=604800000   # 7 days
COOLDOWN_PET=259200000                    # 3 days
COOLDOWN_EMPTY_PLATE=172800000            # 2 days
COOLDOWN_MIDNIGHT_MUNCHIES=43200000       # 12 hours
COOLDOWN_CELEBRATION=2592000000           # 30 days
# ... etc
```

---

## Testing

### Unit Test
```javascript
const easterEggManager = require('../src/easter-egg-manager');

it('should trigger person_without_food', () => {
  const detectionResult = {
    detections: { has_person: true, has_food: false },
    confidence: { has_person: 'high', has_food: 'high' }
  };

  const result = easterEggManager.evaluateDetection(detectionResult, 12345);

  expect(result.shouldTrigger).toBe(true);
  expect(result.easterEggId).toBe('person_without_food');
});
```

### Manual Test
```javascript
// In bot
bot.command('testegg', async (ctx) => {
  const result = easterEggManager.manualTrigger('person_without_food', ctx.from.id);
  await ctx.reply(result.message);
});
```

---

## Troubleshooting

### Easter Egg Not Triggering?

1. **Check if enabled globally**
   ```javascript
   console.log(easterEggConfig.GLOBAL_CONFIG.enabled); // Should be true
   ```

2. **Check if specific type enabled**
   ```javascript
   console.log(easterEggConfig.getEasterEggById('person_without_food').enabled); // Should be true
   ```

3. **Check detection result**
   ```javascript
   console.log(JSON.stringify(detectionResult, null, 2));
   ```

4. **Check cooldown**
   ```javascript
   const eligibility = easterEggManager.checkEligibility('person_without_food', userId);
   console.log(eligibility); // Check if on cooldown
   ```

5. **Check priority**
   - Higher priority easter eggs check first
   - If multiple match, only highest priority triggers

---

## File Locations

```
automation/telegram-bot/
├── src/
│   ├── easter-egg-config.js              ← Configuration (EDIT THIS)
│   ├── easter-egg-manager.js             ← Manager (use this)
│   ├── easter-egg-cooldown-manager.js    ← Cooldown tracking (already exists)
│   └── webhook.js                        ← Integration point
├── docs/
│   ├── EASTER_EGG_SYSTEM.md             ← Full documentation
│   ├── QUICK_START.md                    ← This file
│   └── WEBHOOK_INTEGRATION_EXAMPLE.js    ← Code examples
└── tests/
    └── unit/
        └── easter-egg-cooldown-manager.test.js
```

---

## Next Steps

1. ✅ **Read this guide** - You're doing it!
2. ✅ **Review examples** - See `WEBHOOK_INTEGRATION_EXAMPLE.js`
3. ✅ **Integrate** - Update webhook.js with new system
4. ✅ **Test** - Try triggering easter eggs
5. ✅ **Add new types** - Edit `easter-egg-config.js`

For detailed documentation, see [`EASTER_EGG_SYSTEM.md`](./EASTER_EGG_SYSTEM.md).

---

## Support

Questions? Issues?
- Check full documentation: `docs/EASTER_EGG_SYSTEM.md`
- Review examples: `docs/WEBHOOK_INTEGRATION_EXAMPLE.js`
- Look at configuration: `src/easter-egg-config.js`
- Review manager code: `src/easter-egg-manager.js`

---

## Summary

**Old way:**
```javascript
// Hardcoded in webhook.js
if (has_person && !has_food) {
  await ctx.reply("Message");
  return;
}
```

**New way:**
```javascript
// Centralized, configurable, maintainable
const result = easterEggManager.evaluateDetection(detectionResult, userId);
if (result.shouldTrigger && result.canTrigger) {
  await ctx.reply(result.getMessage());
  result.recordTrigger();
  if (result.blocksNutritionExtraction) return;
}
```

**To add new easter egg:**
- Edit `easter-egg-config.js` ✅
- No code changes ✅
- No testing needed in webhook.js ✅

That's it! 🎉
