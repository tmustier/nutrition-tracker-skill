# Easter Egg Configuration System - Design Document

## Executive Summary

A comprehensive configuration system for managing easter eggs (special bot responses) in the nutrition tracking Telegram bot. This system centralizes all easter egg definitions, making it easy to add, remove, or modify easter eggs without changing core bot logic.

**Current Problem:**
- Messages hardcoded in `/automation/telegram-bot/src/webhook.js` (lines 836-842)
- Only one easter egg type implemented (`person_without_food`)
- Hard to add new types
- No easy enable/disable mechanism
- Configuration scattered across multiple files

**Solution:**
- Centralized configuration in `easter-egg-config.js`
- Manager class for clean API (`easter-egg-manager.js`)
- Integration with existing cooldown system
- Simple 5-line webhook integration
- No code changes needed to add new easter eggs

---

## Design Overview

### Architecture

```
webhook.js (Integration)
    ↓
easter-egg-manager.js (Business Logic)
    ↓           ↓
easter-egg-config.js    easter-egg-cooldown-manager.js
(Configuration)         (State Management)
```

### Three-Tier Design

#### 1. Configuration Layer (`easter-egg-config.js`)
- **Purpose**: Define all easter egg types, messages, criteria
- **Responsibilities**:
  - Store easter egg type definitions
  - Provide helper functions to access config
  - Support environment variable overrides
  - No business logic, pure configuration

#### 2. Management Layer (`easter-egg-manager.js`)
- **Purpose**: Business logic for evaluating and triggering easter eggs
- **Responsibilities**:
  - Evaluate detection results
  - Check detection criteria
  - Integrate with cooldown system
  - Provide clean API for webhook
  - Handle priority ordering
  - Generate messages

#### 3. State Layer (`easter-egg-cooldown-manager.js`)
- **Purpose**: Track cooldown state (already exists)
- **Responsibilities**:
  - Per-user, per-type cooldown tracking
  - LRU eviction for memory management
  - Automatic cleanup of expired cooldowns
  - Provide cooldown status queries

---

## File Structure

```
automation/telegram-bot/
├── src/
│   ├── easter-egg-config.js              ← NEW: Configuration
│   ├── easter-egg-manager.js             ← NEW: Manager
│   ├── easter-egg-cooldown-manager.js    ← EXISTS: Cooldown tracking
│   └── webhook.js                        ← MODIFY: Integration
├── docs/
│   ├── EASTER_EGG_SYSTEM.md             ← NEW: Full documentation
│   ├── QUICK_START.md                    ← NEW: Quick reference
│   ├── WEBHOOK_INTEGRATION_EXAMPLE.js    ← NEW: Code examples
│   └── ARCHITECTURE_DIAGRAM.md           ← NEW: Visual diagrams
└── tests/
    └── unit/
        └── easter-egg-cooldown-manager.test.js  ← EXISTS
```

---

## Key Features

### 1. Easy to Add New Easter Eggs ✅

**Before:**
- Edit webhook.js
- Add if/else logic
- Hardcode messages
- Risk breaking existing code

**After:**
- Edit `easter-egg-config.js` only
- Add one object definition
- No code changes elsewhere

**Example:**
```javascript
// In easter-egg-config.js
my_new_easter_egg: {
  id: 'my_new_easter_egg',
  displayName: 'My New Easter Egg',
  enabled: true,
  cooldownDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
  priority: 5,
  blocksNutritionExtraction: true,
  detectionCriteria: {
    has_something: true,
    min_something_confidence: 'high',
  },
  messages: [
    "Fun message 1 😄",
    "Fun message 2 🎉",
  ],
  metadata: {
    category: 'wrong_content',
    tags: ['tag1', 'tag2'],
  }
}
```

### 2. Easy to Disable Easter Eggs ✅

**Global disable:**
```bash
EASTER_EGGS_ENABLED=false
```

**Per-type disable:**
```javascript
person_without_food: {
  enabled: false,  // ← Just set to false
  // ... rest of config
}
```

### 3. Easy to Change Messages ✅

**Before:**
```javascript
// Scattered in webhook.js
const messages = ["Message 1", "Message 2", ...];
```

**After:**
```javascript
// Centralized in easter-egg-config.js
messages: [
  "Message 1",
  "Message 2",
  "Message 3",
  // Add/remove/edit as needed
],
```

### 4. Type-Safe ✅

Clear structure with JSDoc type definitions:
```javascript
/**
 * @typedef {Object} EasterEggConfig
 * @property {string} id - Unique identifier
 * @property {string} displayName - Human-readable name
 * @property {boolean} enabled - Is this easter egg active?
 * @property {number} cooldownDuration - Cooldown in milliseconds
 * @property {number} priority - Priority (1-10, higher = first)
 * @property {boolean} blocksNutritionExtraction - Block nutrition?
 * @property {Object} detectionCriteria - Conditions to trigger
 * @property {string[]} messages - Array of possible messages
 * @property {Object} metadata - Additional configuration
 */
```

### 5. Maintainable ✅

**Centralized configuration:**
- All easter eggs in one file
- Easy to review
- Easy to audit
- Version control friendly

**Clean separation of concerns:**
- Configuration ≠ Business Logic ≠ State Management
- Each layer has single responsibility
- Easy to test in isolation

**Extensible:**
- Add A/B testing
- Add personalization
- Add analytics
- Add dynamic cooldowns

---

## Easter Egg Types

### Currently Implemented

| ID | Display Name | Cooldown | Blocks? | Status |
|----|--------------|----------|---------|--------|
| person_without_food | Person Photo | 7 days | Yes | ✅ Implemented |

### Planned (Ready to Enable)

| ID | Display Name | Cooldown | Blocks? | Status |
|----|--------------|----------|---------|--------|
| celebration | Celebration | 30 days | No | 📋 Configured |
| midnight_munchies | Midnight Munchies | 12 hours | No | 📋 Configured |
| pet | Pet Photo | 3 days | Yes | 📋 Configured |
| empty_plate | Empty Plate | 2 days | Yes | 📋 Configured |
| non_food_item | Non-Food Item | 7 days | Yes | 📋 Configured |
| shopping_scene | Shopping Scene | 3 days | Yes | 📋 Configured |
| screenshot_meme | Screenshot/Meme | 2 days | Yes | 📋 Configured |
| empty_packaging | Empty Packaging | 2 days | Yes | 📋 Configured |

### Blocking vs Companion

**Blocking Easter Eggs** (`blocksNutritionExtraction: true`)
- Show easter egg message ONLY
- Don't attempt nutrition extraction
- User must send different photo
- Examples: person photos, pets, empty plates

**Companion Easter Eggs** (`blocksNutritionExtraction: false`)
- Show easter egg message + extract nutrition
- Add fun/contextual message to nutrition data
- Examples: celebrations, midnight munchies

---

## Configuration Structure

### Global Configuration

```javascript
GLOBAL_CONFIG = {
  enabled: true,  // Master switch for ALL easter eggs
  defaultCooldownMs: 7 * 24 * 60 * 60 * 1000,  // Default 7 days
  defaultMinConfidence: 'high',
  logTriggers: true,  // Log to console when triggered
  maxCooldownEntries: 1000,  // Memory management
}
```

### Easter Egg Configuration

```javascript
{
  // Identity
  id: 'unique_identifier',
  displayName: 'Human Readable Name',
  description: 'What triggers this easter egg',

  // Behavior
  enabled: true,  // Enable/disable this specific type
  cooldownDuration: 7 * 24 * 60 * 60 * 1000,  // Milliseconds
  priority: 5,  // 1-10, higher = checks first
  blocksNutritionExtraction: true,  // Block or companion?

  // Detection
  detectionCriteria: {
    has_person: true,  // Boolean flags
    has_food: false,
    min_person_confidence: 'high',  // Confidence thresholds
    time_window: { start: 22, end: 4 },  // Time-based (optional)
  },

  // Messages
  messages: [
    "Message option 1 with emojis 😄",
    "Message option 2 with emojis 🎉",
    // Randomly selected when triggered
  ],

  // Metadata
  metadata: {
    category: 'wrong_content',  // wrong_content, timing, wrong_format, fun
    tags: ['person', 'selfie', 'no_food'],
    isPrefixMessage: false,  // For companion easter eggs
  }
}
```

---

## API Usage

### Simple Usage

```javascript
const easterEggManager = require('./easter-egg-manager');

// Evaluate detection result
const result = easterEggManager.evaluateDetection(detectionResult, userId);

if (result.shouldTrigger && result.canTrigger) {
  // Get message
  const message = result.getMessage();

  // Send to user
  await ctx.reply(message);

  // Record trigger (updates cooldown)
  result.recordTrigger();

  // Check if should stop
  if (result.blocksNutritionExtraction) {
    return; // Don't extract nutrition
  }
}

// Continue with nutrition extraction...
```

### Advanced Usage

```javascript
// Check specific easter egg eligibility
const eligibility = easterEggManager.checkEligibility('person_without_food', userId);
if (!eligibility.eligible) {
  console.log(`Reason: ${eligibility.reason}`);
  console.log(`Next available: ${eligibility.cooldownInfo.nextAvailable}`);
}

// Get user's cooldown status for all easter eggs
const status = easterEggManager.getUserCooldownStatus(userId);
for (const [eggId, info] of Object.entries(status)) {
  console.log(`${info.easterEggName}: ${info.onCooldown ? 'On cooldown' : 'Available'}`);
}

// Manual trigger (for testing)
const result = easterEggManager.manualTrigger('person_without_food', userId);

// Clear cooldowns (for testing)
easterEggManager.clearUserCooldowns(userId);

// Get statistics
const stats = easterEggManager.getStats();
console.log(`Enabled: ${stats.enabled}, Blocking: ${stats.blocking}`);
```

---

## Detection Criteria

### Boolean Flags

```javascript
detectionCriteria: {
  has_person: true,  // Must have person
  has_food: false,   // Must NOT have food
  has_pet: true,     // Must have pet
}
```

### Confidence Thresholds

```javascript
detectionCriteria: {
  has_person: true,
  min_person_confidence: 'high',  // 'high' | 'medium' | 'low'
  has_food: false,
  min_no_food_confidence: 'high',  // Be VERY sure no food
}
```

Confidence levels: `'high'` > `'medium'` > `'low'`

### Time Windows

```javascript
detectionCriteria: {
  has_food: true,
  time_window: { start: 22, end: 4 },  // 10pm - 4am (24h format)
}
```

Handles crossing midnight automatically.

### Complex Criteria

```javascript
detectionCriteria: {
  is_screenshot: true,
  has_nutrition_label: false,  // Screenshot but NOT nutrition label
  min_screenshot_confidence: 'high',
}
```

All conditions must be satisfied (AND logic).

---

## Priority System

Priority determines which easter egg checks first when multiple match.

**Higher priority = Checks first = Triggers first**

### Priority Guidelines

- **Priority 10**: Special occasions (celebrations)
- **Priority 9**: Fun additions (midnight munchies)
- **Priority 8**: Common scenarios (person photos)
- **Priority 7**: Common scenarios (pets)
- **Priority 6**: Medium common (empty plates)
- **Priority 5**: Less common (non-food items)
- **Priority 4**: Less common (shopping scenes)
- **Priority 3**: Rare (screenshots)
- **Priority 2**: Rare (empty packaging)
- **Priority 1**: Very rare

### Why Priority Matters

```javascript
// User sends birthday cake photo at 11pm

// Without priority system:
// - midnight_munchies could trigger (11pm)
// - celebration could trigger (birthday cake)
// Result: Inconsistent behavior

// With priority system:
// 1. Check celebration (priority 10) → MATCH! ✓
// 2. Don't check lower priorities
// Result: celebration triggers (correct!)
```

---

## Cooldown System

### How It Works

1. **User triggers easter egg**
   ```javascript
   result.recordTrigger(); // Records timestamp
   ```

2. **System stores timestamp**
   ```javascript
   // In memory: Map<userId, Map<easterEggType, timestamp>>
   12345: {
     person_without_food: 1699564800000,
     pet: 1699478400000,
   }
   ```

3. **Next time, check cooldown**
   ```javascript
   const cooldown = cooldownManager.checkEasterEggCooldown(userId, easterEggType);
   // Returns: { onCooldown, remainingMs, lastTriggered, nextAvailable }
   ```

4. **Automatic cleanup**
   - Every 5 minutes: Remove expired cooldowns
   - LRU eviction: If > 1000 users tracked
   - Memory efficient

### Cooldown Durations

| Easter Egg | Duration | Reasoning |
|------------|----------|-----------|
| celebration | 30 days | Rare event, very long |
| person_without_food | 7 days | Common, prevent annoyance |
| non_food_item | 7 days | Common, prevent annoyance |
| pet | 3 days | Less common |
| shopping_scene | 3 days | Less common |
| empty_plate | 2 days | Quick, might reoccur |
| screenshot_meme | 2 days | Quick, might reoccur |
| empty_packaging | 2 days | Quick, might reoccur |
| midnight_munchies | 12 hours | Time-based, short |

### Environment Variable Overrides

```bash
# Override cooldown durations (in milliseconds)
COOLDOWN_PERSON_WITHOUT_FOOD=604800000   # 7 days
COOLDOWN_PET=259200000                    # 3 days
COOLDOWN_CELEBRATION=2592000000           # 30 days
# ... etc
```

---

## Integration with Existing Code

### Current Implementation (webhook.js lines 831-856)

```javascript
// Step 3: Easter egg - detect if image contains a person without food
const detectionResult = await claudeIntegration.detectPersonInImage(imageBuffer, mimeType);

if (detectionResult.success && detectionResult.has_person && !detectionResult.has_food) {
  // Easter egg triggered! Person detected but no food
  const easterEggMessages = [
    "👀 Looks like an absolute snack...",
    "🙋 I see someone looking great...",
    // ... 5 hardcoded messages
  ];

  const randomMessage = easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];

  await ctx.telegram.editMessageText(
    ctx.chat.id,
    processingMsg.message_id,
    null,
    randomMessage
  );

  console.log(`Easter egg triggered for user ${userId}: Person detected without food`);
  return; // Don't process for nutrition
}
```

### New Implementation (5 lines)

```javascript
const easterEggManager = require('./easter-egg-manager');

// Step 3: Detect image content
const detectionResult = await claudeIntegration.detectPersonInImage(imageBuffer, mimeType);

// Step 4: Check for easter eggs
const easterEggResult = easterEggManager.evaluateDetection(detectionResult, userId);

if (easterEggResult.shouldTrigger && easterEggResult.canTrigger) {
  await ctx.telegram.editMessageText(
    ctx.chat.id,
    processingMsg.message_id,
    null,
    easterEggResult.getMessage()
  );

  easterEggResult.recordTrigger();

  if (easterEggResult.blocksNutritionExtraction) {
    console.log(`Easter egg triggered: ${easterEggResult.easterEggId}`);
    return;
  }
}

// Step 5: Continue with nutrition extraction...
```

**Benefits:**
- ✅ Cleaner code
- ✅ No hardcoded messages
- ✅ Supports all easter egg types
- ✅ Cooldown management built in
- ✅ Easy to extend

---

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
    expect(result.getMessage()).toBeTruthy();
  });

  it('should respect cooldowns', () => {
    const userId = 12345;

    // First trigger
    const result1 = easterEggManager.manualTrigger('person_without_food', userId);
    expect(result1.message).toBeTruthy();

    // Second trigger immediately - should be on cooldown
    const eligibility = easterEggManager.checkEligibility('person_without_food', userId);
    expect(eligibility.eligible).toBe(false);
    expect(eligibility.reason).toBe('On cooldown');
  });

  it('should prioritize higher priority easter eggs', () => {
    // If multiple easter eggs match, highest priority triggers
    const detectionResult = {
      detections: {
        is_celebration: true,
        has_food: true,
      },
      confidence: {
        is_celebration: 'high',
      }
    };

    // Also matches midnight_munchies if between 10pm-4am
    // But celebration (priority 10) should win over midnight_munchies (priority 9)

    const result = easterEggManager.evaluateDetection(detectionResult, 12345);
    expect(result.easterEggId).toBe('celebration');
  });
});
```

### Integration Tests

```javascript
describe('Webhook Integration', () => {
  it('should handle person photo without food', async () => {
    const imageBuffer = /* mock image */;
    const detectionResult = await claudeIntegration.detectPersonInImage(imageBuffer, 'image/jpeg');

    expect(detectionResult.has_person).toBe(true);
    expect(detectionResult.has_food).toBe(false);

    const eggResult = easterEggManager.evaluateDetection(detectionResult, userId);

    expect(eggResult.shouldTrigger).toBe(true);
    expect(eggResult.blocksNutritionExtraction).toBe(true);
  });
});
```

---

## Monitoring & Analytics

### Statistics

```javascript
const stats = easterEggManager.getStats();
console.log(stats);

// Output:
{
  total: 9,
  enabled: 9,
  disabled: 0,
  blocking: 7,
  companion: 2,
  globalEnabled: true,
  categories: {
    wrong_content: 4,
    timing: 2,
    wrong_format: 1,
    fun: 2
  }
}
```

### Cooldown Statistics

```javascript
const cooldownStats = require('./easter-egg-cooldown-manager').getCooldownStats();
console.log(cooldownStats);

// Output:
{
  totalUsers: 45,
  totalCooldowns: 67,
  activeCooldowns: 52,
  expiredCooldowns: 15,
  cooldownsByType: {
    person_without_food: 23,
    pet: 8,
    midnight_munchies: 15,
    celebration: 2,
    // ...
  },
  maxCooldownEntries: 1000,
  memoryUsage: {
    usersTracked: 45,
    lruEntriesTracked: 45
  }
}
```

### Logging

```javascript
// Automatic logging when easter egg triggers
console.log('[EasterEggManager] Easter egg person_without_food matches detection criteria');
console.log('[EasterEggManager] Cooldown status:', cooldownStatus);
console.log('[EasterEggManager] Triggered companion: midnight_munchies');

// Disable logging
EASTER_EGG_LOG_TRIGGERS=false
```

---

## Future Enhancements

### A/B Testing

```javascript
metadata: {
  abTest: {
    enabled: true,
    variants: ['a', 'b'],
    distribution: [0.5, 0.5],  // 50/50 split
    messages: {
      a: ["Variant A message 1", "Variant A message 2"],
      b: ["Variant B message 1", "Variant B message 2"],
    }
  }
}
```

### Personalization

```javascript
messages: [
  (userName) => `Hey ${userName}! That's a great photo, but I need food! 😄`,
  (userName) => `${userName}, you look fantastic! But show me what you ate! 🍕`,
]
```

### Dynamic Cooldowns

```javascript
cooldownDuration: (userId, triggerCount) => {
  // Increase cooldown with repeated triggers
  const baseCooldown = 7 * 24 * 60 * 60 * 1000; // 7 days
  const maxCooldown = 30 * 24 * 60 * 60 * 1000; // 30 days
  return Math.min(triggerCount * baseCooldown, maxCooldown);
}
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

// On trigger:
analytics.track(easterEgg.metadata.analytics);
```

### User Preferences

```javascript
// Allow users to opt-out of specific easter eggs
bot.command('disableegg', async (ctx) => {
  const eggId = ctx.message.text.split(' ')[1];
  await userPreferences.disableEasterEgg(userId, eggId);
  await ctx.reply(`Disabled ${eggId} easter egg for you!`);
});
```

---

## Migration Guide

### Step 1: Install New Files

1. Copy `easter-egg-config.js` to `src/`
2. Copy `easter-egg-manager.js` to `src/`
3. Copy documentation to `docs/`

### Step 2: Update webhook.js

**Find:**
```javascript
// Lines 831-856
const detectionResult = await claudeIntegration.detectPersonInImage(imageBuffer, mimeType);

if (detectionResult.success && detectionResult.has_person && !detectionResult.has_food) {
  // ... hardcoded messages ...
  return;
}
```

**Replace with:**
```javascript
const easterEggManager = require('./easter-egg-manager');

const detectionResult = await claudeIntegration.detectPersonInImage(imageBuffer, mimeType);
const easterEggResult = easterEggManager.evaluateDetection(detectionResult, userId);

if (easterEggResult.shouldTrigger && easterEggResult.canTrigger) {
  await ctx.telegram.editMessageText(
    ctx.chat.id,
    processingMsg.message_id,
    null,
    easterEggResult.getMessage()
  );

  easterEggResult.recordTrigger();

  if (easterEggResult.blocksNutritionExtraction) {
    console.log(`Easter egg triggered: ${easterEggResult.easterEggId}`);
    return;
  }
}
```

### Step 3: Test

1. Test with person photo (should trigger `person_without_food`)
2. Test cooldown (send same photo after - should not trigger)
3. Test different types (if detection logic exists)

### Step 4: Clean Up

Remove old hardcoded messages (lines 836-842).

---

## Documentation

### Available Documents

1. **EASTER_EGG_SYSTEM.md** - Complete documentation
   - Full API reference
   - All configuration options
   - Usage examples
   - Testing guide
   - Troubleshooting

2. **QUICK_START.md** - Quick reference
   - 5-minute overview
   - Quick integration
   - Common operations
   - Troubleshooting tips

3. **WEBHOOK_INTEGRATION_EXAMPLE.js** - Code examples
   - Before/after comparison
   - Integration examples
   - Admin commands
   - Testing helpers

4. **ARCHITECTURE_DIAGRAM.md** - Visual diagrams
   - System architecture
   - Data flow
   - Decision flow
   - Component interactions

5. **EASTER_EGG_CONFIGURATION_DESIGN.md** (this file)
   - Executive summary
   - Design overview
   - Complete reference

---

## Benefits Summary

### For Developers

✅ **Easy to add new easter eggs** - Just edit config
✅ **No code changes to webhook** - Clean separation
✅ **Type-safe** - Clear structure and validation
✅ **Testable** - Test config independently
✅ **Extensible** - Easy to add features

### For Product/Non-Engineers

✅ **Easy to change messages** - Edit array in config
✅ **Easy to enable/disable** - Single flag per type
✅ **Easy to understand** - Self-documenting config
✅ **Safe to modify** - Can't break core logic

### For Operations

✅ **Environment variables** - Override in production
✅ **Monitoring** - Built-in statistics
✅ **Memory efficient** - LRU eviction, automatic cleanup
✅ **No external dependencies** - In-memory storage

---

## Conclusion

The Easter Egg Configuration System provides a clean, maintainable, and extensible solution for managing special bot responses. It separates configuration from code, making it easy to add, remove, or modify easter eggs without touching the core webhook logic.

### Key Achievements

1. ✅ Centralized configuration
2. ✅ Clean API
3. ✅ Automatic cooldown management
4. ✅ Priority system
5. ✅ Blocking and companion modes
6. ✅ Environment variable support
7. ✅ Statistics and monitoring
8. ✅ Comprehensive documentation

### Next Steps

1. Review this design document
2. Integrate into webhook.js
3. Test with existing `person_without_food` easter egg
4. Add new easter egg types as needed
5. Monitor usage and adjust cooldowns

---

## Quick Reference

### Files Created

```
/automation/telegram-bot/src/easter-egg-config.js
/automation/telegram-bot/src/easter-egg-manager.js
/automation/telegram-bot/docs/EASTER_EGG_SYSTEM.md
/automation/telegram-bot/docs/QUICK_START.md
/automation/telegram-bot/docs/WEBHOOK_INTEGRATION_EXAMPLE.js
/automation/telegram-bot/docs/ARCHITECTURE_DIAGRAM.md
/EASTER_EGG_CONFIGURATION_DESIGN.md (this file)
```

### Integration Example

```javascript
// In webhook.js
const easterEggManager = require('./easter-egg-manager');

const result = easterEggManager.evaluateDetection(detectionResult, userId);

if (result.shouldTrigger && result.canTrigger) {
  await ctx.reply(result.getMessage());
  result.recordTrigger();
  if (result.blocksNutritionExtraction) return;
}
```

### Add New Easter Egg

```javascript
// In easter-egg-config.js
my_easter_egg: {
  id: 'my_easter_egg',
  displayName: 'My Easter Egg',
  enabled: true,
  cooldownDuration: 7 * 24 * 60 * 60 * 1000,
  priority: 5,
  blocksNutritionExtraction: true,
  detectionCriteria: { /* ... */ },
  messages: [ /* ... */ ],
  metadata: { /* ... */ }
}
```

---

**Design Version**: 1.0
**Date**: 2025-11-07
**Author**: Claude Code Agent
**Status**: Ready for Implementation ✅
