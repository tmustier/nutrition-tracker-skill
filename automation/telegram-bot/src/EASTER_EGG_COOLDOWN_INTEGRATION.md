# Easter Egg Cooldown System - Integration Guide

## Overview

The Easter Egg Cooldown Manager provides a robust, memory-efficient system for tracking cooldowns on easter eggs in the Telegram nutrition bot. It integrates seamlessly with the existing ConversationManager architecture.

## Architecture

### Design Principles

1. **In-Memory Storage**: Uses JavaScript Maps for fast, atomic operations
2. **Thread-Safe**: Leverages Node.js single-threaded event loop
3. **Memory Efficient**: LRU eviction and automatic cleanup of expired cooldowns
4. **User Isolation**: Per-user, per-easter-egg-type tracking
5. **Configurable**: All durations and limits via environment variables

### Data Structures

```javascript
// Primary storage: Map<userId, Map<easterEggType, lastTriggerTimestamp>>
easterEggCooldowns: Map {
  "123456" => Map {
    "person_without_food" => 1699564800000,
    "pet" => 1699478400000
  }
}

// LRU tracking: Map<userId, lastAccessTimestamp>
cooldownLastAccess: Map {
  "123456" => 1699564800000
}
```

## Integration with webhook.js

### Before (No Cooldown)

```javascript
// webhook.js - Easter egg detection
if (detectionResult.success && detectionResult.has_person && !detectionResult.has_food) {
  // Easter egg triggered! Person detected but no food
  const easterEggMessages = [
    "👀 Looks like an absolute snack...",
    // ... more messages
  ];

  const randomMessage = easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];

  await ctx.telegram.editMessageText(
    ctx.chat.id,
    processingMsg.message_id,
    null,
    randomMessage
  );

  console.log(`Easter egg triggered for user ${userId}`);
  return;
}
```

### After (With Cooldown)

```javascript
// webhook.js - Add import at top
const cooldownManager = require('./easter-egg-cooldown-manager');

// webhook.js - Easter egg detection with cooldown
if (detectionResult.success && detectionResult.has_person && !detectionResult.has_food) {
  // Check cooldown before triggering easter egg
  const cooldownCheck = cooldownManager.checkEasterEggCooldown(userId, 'person_without_food');

  if (cooldownCheck.onCooldown) {
    // On cooldown - proceed with normal food analysis
    console.log(`Easter egg on cooldown for user ${userId}, ` +
                `remaining: ${Math.round(cooldownCheck.remainingMs / 1000 / 60)} minutes`);

    // Continue to normal image processing...
    const result = await claudeIntegration.processImage(imageBuffer, mimeType);
    // ... handle result
    return;
  }

  // Not on cooldown - trigger easter egg!
  const easterEggMessages = [
    "👀 Looks like an absolute snack...",
    // ... more messages
  ];

  const randomMessage = easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];

  await ctx.telegram.editMessageText(
    ctx.chat.id,
    processingMsg.message_id,
    null,
    randomMessage
  );

  // IMPORTANT: Record the trigger to start cooldown
  cooldownManager.recordEasterEggTrigger(userId, 'person_without_food');

  console.log(`Easter egg triggered for user ${userId}, cooldown started (7 days)`);
  return;
}
```

## Complete Integration Example

Here's a complete example showing all easter egg types integrated:

```javascript
// webhook.js - Complete easter egg handler function

const cooldownManager = require('./easter-egg-cooldown-manager');

async function handleEasterEgg(ctx, userId, detectionResult, imageBuffer, mimeType, processingMsg) {
  let easterEggType = null;
  let messages = [];

  // Detect easter egg type
  if (detectionResult.has_person && !detectionResult.has_food) {
    easterEggType = 'person_without_food';
    messages = [
      "👀 Looks like an absolute snack, but I'm not sure we have nutrition data for that! 😄\n\nMaybe try sending a photo of some actual food? 🍕",
      "🙋 I see someone looking great, but where's the food? 😊\n\nI'm here to track meals, not selfies! Send me something delicious instead! 🥗"
    ];
  } else if (detectionResult.has_pet) {
    easterEggType = 'pet';
    messages = [
      "🐕 Aww, what a cute pet! But I need actual food to track nutrition! 🐾",
      "🐈 That's adorable, but I'm a nutrition bot, not a pet photo album! Send me some food! 😺"
    ];
  } else if (detectionResult.is_empty_plate) {
    easterEggType = 'empty_plate';
    messages = [
      "🍽️ Looks like someone already ate! Nothing left to track! 😄",
      "🥘 That plate is cleaner than my code! Nothing to analyze here! 😅"
    ];
  } else if (detectionResult.is_midnight_munchies) {
    easterEggType = 'midnight_munchies';
    messages = [
      "🌙 Midnight snack detected! At least you're honest about your late-night cravings! 😴🍕",
      "⏰ 2 AM and snacking? I respect the dedication! Let me track this for you! 🌃"
    ];
  } else if (detectionResult.is_celebration) {
    easterEggType = 'celebration';
    messages = [
      "🎉 Looks like a celebration! Party food is still food - let's track it! 🥳",
      "🎂 Birthday cake? Holiday feast? I'll track it all! 🎊"
    ];
  } else if (detectionResult.is_non_food_item) {
    easterEggType = 'non_food_item';
    messages = [
      "🤔 That's... not food. Try sending something edible! 🍔",
      "❌ I'm pretty sure that's not food! Send me something I can track! 🥗"
    ];
  } else if (detectionResult.is_shopping_scene) {
    easterEggType = 'shopping_scene';
    messages = [
      "🛒 Shopping for groceries? Send me photos after you cook them! 🍳",
      "🏪 Still at the store? Come back when you've made something delicious! 👨‍🍳"
    ];
  } else if (detectionResult.is_screenshot) {
    easterEggType = 'screenshot';
    messages = [
      "📱 That's a screenshot! Send me a real photo of your food! 📸",
      "🖼️ I need actual food photos, not screenshots! 📷"
    ];
  } else if (detectionResult.is_empty_packaging) {
    easterEggType = 'empty_packaging';
    messages = [
      "📦 Empty wrapper detected! Should've sent this before you ate it! 😄",
      "🗑️ All gone already? Send me photos before you finish next time! 😅"
    ];
  }

  // If no easter egg detected, return false to continue normal processing
  if (!easterEggType) {
    return false;
  }

  // Check cooldown
  const cooldownCheck = cooldownManager.checkEasterEggCooldown(userId, easterEggType);

  if (cooldownCheck.onCooldown) {
    // On cooldown - skip easter egg, continue with normal processing
    console.log(`[Easter Egg] ${easterEggType} on cooldown for user ${userId}, ` +
                `remaining: ${formatDuration(cooldownCheck.remainingMs)}`);
    return false; // Continue with normal processing
  }

  // Not on cooldown - trigger easter egg!
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  await ctx.telegram.editMessageText(
    ctx.chat.id,
    processingMsg.message_id,
    null,
    randomMessage
  );

  // Record trigger to start cooldown
  cooldownManager.recordEasterEggTrigger(userId, easterEggType);

  console.log(`[Easter Egg] Triggered ${easterEggType} for user ${userId}, ` +
              `cooldown started (${formatDuration(cooldownManager.getCooldownDuration(easterEggType))})`);

  return true; // Easter egg triggered, don't continue with normal processing
}

// Helper function to format duration for logs
function formatDuration(ms) {
  const hours = Math.floor(ms / (60 * 60 * 1000));
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

// Usage in webhook handler
async function handleImage(ctx, userId, imageBuffer, mimeType, processingMsg) {
  // Step 1: Detect easter eggs
  const detectionResult = await claudeIntegration.detectPersonInImage(imageBuffer, mimeType);

  // Step 2: Check and handle easter eggs with cooldown
  const easterEggTriggered = await handleEasterEgg(
    ctx, userId, detectionResult, imageBuffer, mimeType, processingMsg
  );

  if (easterEggTriggered) {
    return; // Easter egg handled, stop processing
  }

  // Step 3: Continue with normal image processing
  const result = await claudeIntegration.processImage(imageBuffer, mimeType);
  // ... handle result
}
```

## Admin/Debugging Commands

You can add admin commands to manage cooldowns:

```javascript
// Admin command to check user's cooldowns
bot.command('cooldowns', async (ctx) => {
  const userId = ctx.from.id;
  const cooldowns = cooldownManager.getUserCooldowns(userId);

  if (Object.keys(cooldowns).length === 0) {
    await ctx.reply("You have no active cooldowns! All easter eggs are available.");
    return;
  }

  let message = "🕐 Your active cooldowns:\n\n";
  for (const [type, info] of Object.entries(cooldowns)) {
    if (info.isActive) {
      const hoursRemaining = Math.ceil(info.remainingMs / (60 * 60 * 1000));
      message += `• ${type}: ${hoursRemaining}h remaining\n`;
    }
  }

  await ctx.reply(message);
});

// Admin command to clear cooldowns (for testing)
bot.command('clearcooldowns', async (ctx) => {
  const userId = ctx.from.id;
  cooldownManager.clearUserCooldowns(userId);
  await ctx.reply("✅ All your cooldowns have been cleared!");
});

// Admin command to view statistics
bot.command('cooldownstats', async (ctx) => {
  const stats = cooldownManager.getCooldownStats();

  const message = `
📊 Cooldown Statistics:
• Total users tracked: ${stats.totalUsers}
• Active cooldowns: ${stats.activeCooldowns}
• Expired cooldowns: ${stats.expiredCooldowns}

Cooldowns by type:
${Object.entries(stats.cooldownsByType)
  .map(([type, count]) => `• ${type}: ${count}`)
  .join('\n')}

Memory:
• Users tracked: ${stats.memoryUsage.usersTracked}
• LRU entries: ${stats.memoryUsage.lruEntriesTracked}
`;

  await ctx.reply(message);
});
```

## Environment Variables

Configure cooldown behavior via environment variables:

```bash
# Maximum number of users to track (default: 1000)
MAX_COOLDOWN_ENTRIES=2000

# Cleanup interval in milliseconds (default: 5 minutes)
COOLDOWN_CLEANUP_INTERVAL_MS=300000

# Individual cooldown durations (in milliseconds)
COOLDOWN_PERSON_WITHOUT_FOOD=604800000  # 7 days
COOLDOWN_PET=259200000                   # 3 days
COOLDOWN_EMPTY_PLATE=172800000           # 2 days
COOLDOWN_MIDNIGHT_MUNCHIES=43200000      # 12 hours
COOLDOWN_CELEBRATION=2592000000          # 30 days
COOLDOWN_NON_FOOD_ITEM=604800000         # 7 days
COOLDOWN_SHOPPING_SCENE=259200000        # 3 days
COOLDOWN_SCREENSHOT=172800000            # 2 days
COOLDOWN_EMPTY_PACKAGING=172800000       # 2 days
```

## Testing

### Unit Tests

Run unit tests to verify cooldown behavior:

```bash
npm test tests/unit/easter-egg-cooldown-manager.test.js
```

### Manual Testing

1. **Test cooldown activation:**
   ```bash
   # Send a selfie (triggers person_without_food)
   # Should show easter egg message

   # Send another selfie immediately
   # Should process as normal food image (on cooldown)
   ```

2. **Test cooldown expiration:**
   ```bash
   # For testing, temporarily reduce cooldown duration:
   COOLDOWN_PERSON_WITHOUT_FOOD=60000  # 1 minute

   # Send selfie, wait 1 minute, send another
   # Second selfie should trigger easter egg again
   ```

3. **Check cooldown status:**
   ```bash
   # Use /cooldowns command to see active cooldowns
   ```

## Monitoring

Monitor cooldown performance in production:

```javascript
// Add to your monitoring/health check endpoint
app.get('/health', (req, res) => {
  const stats = cooldownManager.getCooldownStats();

  res.json({
    status: 'healthy',
    cooldowns: stats,
    timestamp: new Date().toISOString()
  });
});
```

## Performance Considerations

1. **Memory Usage**: Each user entry uses ~100-200 bytes depending on number of easter eggs triggered
   - 1000 users × 200 bytes = ~200KB (negligible)
   - LRU eviction prevents unbounded growth

2. **Lookup Performance**: O(1) for all operations (Map lookups)
   - `checkEasterEggCooldown`: ~0.1ms
   - `recordEasterEggTrigger`: ~0.1ms

3. **Cleanup Performance**: O(n) where n = total cooldown entries
   - Runs every 5 minutes
   - With 1000 users × 3 cooldowns = 3000 entries
   - Cleanup takes ~10-20ms (negligible impact)

## Migration Guide

If you have existing code without cooldowns:

1. **Install the cooldown manager:**
   ```javascript
   const cooldownManager = require('./easter-egg-cooldown-manager');
   ```

2. **Wrap easter egg triggers:**
   ```javascript
   // Before triggering easter egg:
   const cooldownCheck = cooldownManager.checkEasterEggCooldown(userId, easterEggType);
   if (cooldownCheck.onCooldown) {
     // Skip easter egg, continue normal processing
     return;
   }

   // After triggering easter egg:
   cooldownManager.recordEasterEggTrigger(userId, easterEggType);
   ```

3. **Test thoroughly:**
   - Verify cooldowns work as expected
   - Check that normal processing continues when on cooldown
   - Ensure easter eggs still trigger when off cooldown

## Troubleshooting

### Easter egg not triggering

1. Check if on cooldown:
   ```javascript
   const check = cooldownManager.checkEasterEggCooldown(userId, easterEggType);
   console.log('Cooldown status:', check);
   ```

2. Check cooldown duration:
   ```javascript
   const duration = cooldownManager.getCooldownDuration(easterEggType);
   console.log(`Duration: ${duration}ms (${duration / (24 * 60 * 60 * 1000)} days)`);
   ```

### Memory issues

1. Check statistics:
   ```javascript
   const stats = cooldownManager.getCooldownStats();
   console.log('Total users:', stats.totalUsers);
   console.log('Total cooldowns:', stats.totalCooldowns);
   ```

2. Reduce max entries:
   ```bash
   MAX_COOLDOWN_ENTRIES=500
   ```

3. Increase cleanup frequency:
   ```bash
   COOLDOWN_CLEANUP_INTERVAL_MS=60000  # 1 minute
   ```

## Future Enhancements

Potential improvements for production deployments:

1. **Persistent Storage**: Move to Redis/database for multi-instance deployments
2. **Analytics**: Track easter egg trigger rates and user engagement
3. **A/B Testing**: Test different cooldown durations
4. **User Preferences**: Allow users to opt-out of specific easter eggs
5. **Rate Limiting**: Global rate limiting across all easter eggs per user

## Support

For questions or issues:
- Check logs: `console.log` messages prefixed with `[EasterEggCooldownManager]`
- Run unit tests: `npm test tests/unit/easter-egg-cooldown-manager.test.js`
- Check statistics: `cooldownManager.getCooldownStats()`
