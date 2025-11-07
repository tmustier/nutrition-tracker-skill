# Easter Egg Configuration System

## Overview

The Easter Egg Configuration System provides a centralized, maintainable way to manage special responses in the nutrition tracking bot. It makes it easy to add, remove, and modify easter eggs without touching the core webhook logic.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        webhook.js                            │
│                    (Photo handler)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ├─> Detect image content
                       │   (Claude Vision API)
                       │
                       v
┌─────────────────────────────────────────────────────────────┐
│                  easter-egg-manager.js                       │
│           (High-level API for easter eggs)                   │
│                                                               │
│  • evaluateDetection()                                       │
│  • checkEligibility()                                        │
│  • getUserCooldownStatus()                                   │
└──────────────────────┬─────────────┬────────────────────────┘
                       │             │
                       v             v
┌──────────────────────────┐  ┌────────────────────────────────┐
│  easter-egg-config.js    │  │ easter-egg-cooldown-manager.js │
│  (Configuration)         │  │ (State management)             │
│                          │  │                                │
│  • EASTER_EGG_TYPES      │  │  • checkEasterEggCooldown()    │
│  • Messages              │  │  • recordEasterEggTrigger()    │
│  • Criteria              │  │  • getUserCooldowns()          │
│  • Cooldowns             │  │                                │
└──────────────────────────┘  └────────────────────────────────┘
```

## Files

### 1. `easter-egg-config.js`
**Purpose**: Centralized configuration for all easter egg types.

**Contains**:
- `GLOBAL_CONFIG`: Master settings (enable/disable all, defaults)
- `EASTER_EGG_TYPES`: Complete registry of all easter eggs
- Helper functions for accessing configuration

### 2. `easter-egg-manager.js`
**Purpose**: High-level API for evaluating and triggering easter eggs.

**Key Methods**:
- `evaluateDetection(detectionResult, userId)`: Determine which easter egg to trigger
- `checkEligibility(easterEggId, userId)`: Check if user can see specific easter egg
- `getUserCooldownStatus(userId)`: Get all cooldown statuses for user

### 3. `easter-egg-cooldown-manager.js`
**Purpose**: Track and manage cooldowns (already exists).

**Key Methods**:
- `checkEasterEggCooldown(userId, easterEggType)`: Check cooldown status
- `recordEasterEggTrigger(userId, easterEggType)`: Record trigger
- `getUserCooldowns(userId)`: Get user's active cooldowns

## Integration with webhook.js

### Current Implementation (lines 831-856):
```javascript
// Hardcoded in webhook.js
const detectionResult = await claudeIntegration.detectPersonInImage(imageBuffer, mimeType);

if (detectionResult.success && detectionResult.has_person && !detectionResult.has_food) {
  const easterEggMessages = [
    "👀 Looks like an absolute snack...",
    "🙋 I see someone looking great...",
    // ... more messages
  ];
  const randomMessage = easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];
  await ctx.telegram.editMessageText(..., randomMessage);
  return; // Don't process for nutrition
}
```

### New Implementation:
```javascript
const easterEggManager = require('./easter-egg-manager');

// Step 3: Detect image content
const detectionResult = await claudeIntegration.detectPersonInImage(imageBuffer, mimeType);

// Step 4: Check for easter eggs
const easterEggResult = easterEggManager.evaluateDetection(detectionResult, userId);

if (easterEggResult.shouldTrigger && easterEggResult.canTrigger) {
  // Get message
  const message = easterEggResult.getMessage();

  // Send message
  await ctx.telegram.editMessageText(
    ctx.chat.id,
    processingMsg.message_id,
    null,
    message
  );

  // Record trigger (updates cooldown)
  easterEggResult.recordTrigger();

  // Check if we should continue to nutrition extraction
  if (easterEggResult.blocksNutritionExtraction) {
    console.log(`Easter egg triggered: ${easterEggResult.easterEggId}`);
    return; // Don't process for nutrition
  }

  // If companion easter egg, continue to nutrition extraction below
  // (message will be prepended to success message)
}

// Step 5: Continue with nutrition extraction...
```

## How to Add a New Easter Egg

### Example: Adding "Extreme Closeup" Easter Egg

**Step 1**: Add configuration to `easter-egg-config.js`

```javascript
const EASTER_EGG_TYPES = {
  // ... existing easter eggs ...

  extreme_closeup: {
    id: 'extreme_closeup',
    displayName: 'Extreme Closeup',
    description: 'User sent extremely zoomed in photo',

    // Configuration
    enabled: true,
    cooldownDuration: 1 * 24 * 60 * 60 * 1000, // 1 day
    priority: 4,
    blocksNutritionExtraction: false, // Might still be food!

    // Detection criteria
    detectionCriteria: {
      is_extreme_closeup: true,
      min_closeup_confidence: 'high',
    },

    // Messages
    messages: [
      "🔍 That's quite the closeup! I can see every detail! 😅\n\nLet me analyze what I can...",
      "📸 Zoomed in really close there! Let me try to figure out what this is! 🤔",
    ],

    // Metadata
    metadata: {
      category: 'fun',
      tags: ['closeup', 'zoom', 'macro'],
      isPrefixMessage: true, // Prepends to nutrition info
    }
  },
};
```

**Step 2**: Update detection logic (if needed)

Add detection for `is_extreme_closeup` in your image analysis:
```javascript
// In claudeIntegration.detectPersonInImage() or similar
detections.is_extreme_closeup = /* detection logic */;
confidence.is_extreme_closeup = 'high';
```

**Step 3**: Test!

```javascript
// Manual test
const easterEggManager = require('./easter-egg-manager');
const result = easterEggManager.manualTrigger('extreme_closeup', userId);
console.log(result.message);
```

That's it! No changes to webhook.js or other files needed.

## Easter Egg Types

### Blocking Easter Eggs
These prevent nutrition extraction (no food detected):

| ID | Display Name | Cooldown | Priority |
|----|--------------|----------|----------|
| `person_without_food` | Person Photo (No Food) | 7 days | 8 |
| `pet` | Pet Photo | 3 days | 7 |
| `empty_plate` | Empty Plate | 2 days | 6 |
| `non_food_item` | Non-Food Item | 7 days | 5 |
| `shopping_scene` | Shopping Scene | 3 days | 4 |
| `screenshot_meme` | Screenshot/Meme | 2 days | 3 |
| `empty_packaging` | Empty Packaging | 2 days | 2 |

### Companion Easter Eggs
These add fun messages but still extract nutrition:

| ID | Display Name | Cooldown | Priority |
|----|--------------|----------|----------|
| `celebration` | Celebration | 30 days | 10 |
| `midnight_munchies` | Midnight Munchies | 12 hours | 9 |

## Configuration Options

### Global Configuration

```javascript
GLOBAL_CONFIG = {
  enabled: true,  // Master switch for all easter eggs
  defaultCooldownMs: 7 * 24 * 60 * 60 * 1000,  // 7 days
  defaultMinConfidence: 'high',
  logTriggers: true,
  maxCooldownEntries: 1000,
}
```

**Environment Variables**:
- `EASTER_EGGS_ENABLED=false` - Disable all easter eggs
- `EASTER_EGG_LOG_TRIGGERS=false` - Disable logging
- `MAX_COOLDOWN_ENTRIES=500` - Limit cooldown tracking

### Per-Easter-Egg Configuration

Each easter egg has:

```javascript
{
  id: 'unique_identifier',
  displayName: 'Human Readable Name',
  description: 'What triggers this',
  enabled: true,  // Enable/disable this specific easter egg
  cooldownDuration: 7 * 24 * 60 * 60 * 1000,  // milliseconds
  priority: 5,  // 1-10, higher = checks first
  blocksNutritionExtraction: true,  // Prevent nutrition extraction?
  detectionCriteria: {
    // Conditions that must be met
    has_person: true,
    has_food: false,
    min_person_confidence: 'high',
  },
  messages: [
    "Message option 1",
    "Message option 2",
  ],
  metadata: {
    category: 'wrong_content',
    tags: ['person', 'selfie'],
    isPrefixMessage: false,  // Prepend to nutrition info?
  }
}
```

### Environment Variable Overrides

Each cooldown can be overridden:
```bash
COOLDOWN_PERSON_WITHOUT_FOOD=604800000  # 7 days in ms
COOLDOWN_PET=259200000  # 3 days in ms
COOLDOWN_EMPTY_PLATE=172800000  # 2 days in ms
# ... etc
```

## Detection Criteria

### Boolean Flags
```javascript
detectionCriteria: {
  has_person: true,  // Must have person
  has_food: false,   // Must NOT have food
}
```

### Confidence Thresholds
```javascript
detectionCriteria: {
  has_person: true,
  min_person_confidence: 'high',  // Confidence must be 'high'
  has_food: false,
  min_no_food_confidence: 'medium',  // Can be 'medium' or 'high'
}
```

Confidence levels: `'high'` > `'medium'` > `'low'`

### Time Windows
```javascript
detectionCriteria: {
  time_window: { start: 22, end: 4 },  // 10pm - 4am
}
```

### Complex Criteria
```javascript
detectionCriteria: {
  is_screenshot: true,
  has_nutrition_label: false,  // Screenshot but NOT nutrition label
  min_screenshot_confidence: 'high',
}
```

## Usage Examples

### Basic Usage

```javascript
const easterEggManager = require('./easter-egg-manager');

// Evaluate detection result
const result = easterEggManager.evaluateDetection(detectionResult, userId);

if (result.shouldTrigger && result.canTrigger) {
  // Trigger easter egg
  const message = result.getMessage();
  await ctx.reply(message);
  result.recordTrigger();

  // Check if should continue
  if (result.blocksNutritionExtraction) {
    return; // Stop here
  }
}
```

### Check Eligibility

```javascript
const eligibility = easterEggManager.checkEligibility('person_without_food', userId);

if (!eligibility.eligible) {
  console.log(`Cannot trigger: ${eligibility.reason}`);
  console.log(`Next available: ${eligibility.cooldownInfo.nextAvailable}`);
}
```

### Get User Status

```javascript
const status = easterEggManager.getUserCooldownStatus(userId);

for (const [eggId, info] of Object.entries(status)) {
  console.log(`${info.easterEggName}:`);
  console.log(`  On cooldown: ${info.onCooldown}`);
  console.log(`  Last triggered: ${info.lastTriggered}`);
  console.log(`  Next available: ${info.nextAvailable}`);
}
```

### Manual Trigger (Testing)

```javascript
const result = easterEggManager.manualTrigger('person_without_food', userId);
console.log(result.message);
```

### Clear Cooldowns (Testing/Admin)

```javascript
easterEggManager.clearUserCooldowns(userId);
```

## Testing

### Unit Tests

```javascript
const easterEggManager = require('../src/easter-egg-manager');
const easterEggConfig = require('../src/easter-egg-config');

describe('Easter Egg System', () => {
  it('should trigger person_without_food easter egg', () => {
    const detectionResult = {
      detections: {
        has_person: true,
        has_food: false,
      },
      confidence: {
        has_person: 'high',
        has_food: 'high',
      }
    };

    const result = easterEggManager.evaluateDetection(detectionResult, 12345);

    expect(result.shouldTrigger).toBe(true);
    expect(result.easterEggId).toBe('person_without_food');
    expect(result.blocksNutritionExtraction).toBe(true);
  });

  it('should respect cooldowns', () => {
    const userId = 12345;
    const eggId = 'person_without_food';

    // First trigger
    const result1 = easterEggManager.manualTrigger(eggId, userId);
    expect(result1.message).toBeTruthy();

    // Check eligibility immediately after
    const eligibility = easterEggManager.checkEligibility(eggId, userId);
    expect(eligibility.eligible).toBe(false);
    expect(eligibility.reason).toBe('On cooldown');
  });
});
```

### Integration Tests

```javascript
describe('Webhook Integration', () => {
  it('should handle person photo without food', async () => {
    // Mock image with person, no food
    const imageBuffer = /* ... */;

    // Process
    const detectionResult = await claudeIntegration.detectPersonInImage(imageBuffer, 'image/jpeg');
    const eggResult = easterEggManager.evaluateDetection(detectionResult, userId);

    expect(eggResult.shouldTrigger).toBe(true);
    expect(eggResult.blocksNutritionExtraction).toBe(true);
  });
});
```

## Monitoring & Analytics

### Get Statistics

```javascript
const stats = easterEggManager.getStats();

console.log(`Total easter eggs: ${stats.total}`);
console.log(`Enabled: ${stats.enabled}`);
console.log(`Disabled: ${stats.disabled}`);
console.log(`Blocking: ${stats.blocking}`);
console.log(`Companion: ${stats.companion}`);
console.log(`Global enabled: ${stats.globalEnabled}`);
console.log(`Categories:`, stats.categories);
```

### Cooldown Statistics

```javascript
const cooldownStats = require('./easter-egg-cooldown-manager').getCooldownStats();

console.log(`Total users tracked: ${cooldownStats.totalUsers}`);
console.log(`Total cooldowns: ${cooldownStats.totalCooldowns}`);
console.log(`Active cooldowns: ${cooldownStats.activeCooldowns}`);
console.log(`By type:`, cooldownStats.cooldownsByType);
```

## Best Practices

### 1. **Always Use High Confidence for Blocking Easter Eggs**
```javascript
// GOOD: High confidence before blocking nutrition
detectionCriteria: {
  has_person: true,
  has_food: false,
  min_person_confidence: 'high',
  min_no_food_confidence: 'high',  // MUST be certain no food
}

// BAD: Low confidence could block valid food
detectionCriteria: {
  has_person: true,
  has_food: false,
  min_person_confidence: 'low',  // Too risky!
}
```

### 2. **Use Appropriate Cooldowns**
- Common scenarios (person photos): Longer cooldowns (7 days)
- Rare scenarios (celebrations): Very long cooldowns (30 days)
- Time-based (midnight munchies): Short cooldowns (12 hours)

### 3. **Priority Ordering**
- Special occasions (celebrations): Highest priority (10)
- Fun additions (midnight munchies): High priority (9)
- Common blocks (person photos): Medium priority (5-8)
- Rare scenarios: Lower priority (1-4)

### 4. **Message Design**
- Be friendly and helpful
- Explain what to do instead
- Include emojis for personality
- Keep it light and fun

### 5. **Testing**
- Test with real detection results
- Verify cooldowns work correctly
- Check both blocking and companion modes
- Test priority ordering

## Troubleshooting

### Easter Egg Not Triggering

1. **Check if globally enabled**
   ```javascript
   console.log(easterEggConfig.GLOBAL_CONFIG.enabled);
   ```

2. **Check if specific egg enabled**
   ```javascript
   console.log(easterEggConfig.getEasterEggById('person_without_food').enabled);
   ```

3. **Check detection criteria**
   ```javascript
   const result = easterEggManager.evaluateDetection(detectionResult, userId);
   console.log(result.reason); // If shouldTrigger is false
   ```

4. **Check cooldown**
   ```javascript
   const eligibility = easterEggManager.checkEligibility('person_without_food', userId);
   console.log(eligibility);
   ```

### Easter Egg Triggering Incorrectly

1. **Review detection criteria**
   - Is confidence threshold too low?
   - Are criteria too broad?

2. **Check priority**
   - Is higher priority egg matching first?

3. **Review logs**
   ```javascript
   // Enable detailed logging
   console.log('[Detection Result]', JSON.stringify(detectionResult, null, 2));
   ```

## Migration Guide

### From Old System to New System

**Before** (webhook.js):
```javascript
if (detectionResult.success && detectionResult.has_person && !detectionResult.has_food) {
  const messages = ["Message 1", "Message 2"];
  const message = messages[Math.floor(Math.random() * messages.length)];
  await ctx.reply(message);
  return;
}
```

**After** (webhook.js):
```javascript
const easterEggManager = require('./easter-egg-manager');
const result = easterEggManager.evaluateDetection(detectionResult, userId);

if (result.shouldTrigger && result.canTrigger) {
  await ctx.reply(result.getMessage());
  result.recordTrigger();

  if (result.blocksNutritionExtraction) {
    return;
  }
}
```

**Migration Steps**:
1. Install new files (easter-egg-config.js, easter-egg-manager.js)
2. Update webhook.js to use easterEggManager
3. Test with existing easter egg (person_without_food)
4. Remove old hardcoded messages
5. Add new easter eggs as needed

## Future Enhancements

### A/B Testing
```javascript
metadata: {
  abTest: {
    enabled: true,
    variants: ['a', 'b'],
    messages: {
      a: ["Message set A1", "Message set A2"],
      b: ["Message set B1", "Message set B2"],
    }
  }
}
```

### Personalization
```javascript
messages: [
  (userName) => `Hey ${userName}! That's a great photo, but...`,
]
```

### Analytics Integration
```javascript
metadata: {
  analytics: {
    category: 'easter_egg',
    action: 'triggered',
    label: 'person_without_food',
  }
}
```

### Dynamic Cooldowns
```javascript
cooldownDuration: (userId, triggerCount) => {
  // Increase cooldown with repeated triggers
  return Math.min(triggerCount * 24 * 60 * 60 * 1000, 30 * 24 * 60 * 60 * 1000);
}
```
