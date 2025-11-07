# Easter Egg Cooldown System - Integration Instructions

## Quick Integration Guide

This document provides step-by-step instructions to integrate the cooldown system into the existing webhook.js file.

## Step 1: Import the Cooldown Manager

**File:** `/home/user/nutrition-tracking/automation/telegram-bot/src/webhook.js`

**Location:** Add after line 8 (after `conversationManager` import)

```javascript
// src/webhook.js - Main webhook handler and bot logic
const { Telegraf } = require('telegraf');
const axios = require('axios');
const crypto = require('crypto');
const config = require('./config');
const claudeIntegration = require('./claude-integration');
const githubIntegration = require('./github-integration');
const conversationManager = require('./conversation-manager');
const responseHandler = require('./response-handler');
const cooldownManager = require('./easter-egg-cooldown-manager'); // ← ADD THIS LINE
```

## Step 2: Modify Easter Egg Detection Logic

**File:** `/home/user/nutrition-tracking/automation/telegram-bot/src/webhook.js`

**Location:** Around line 831-856 (where the current easter egg code is)

### Current Code (lines 831-856):

```javascript
// Step 3: Easter egg - detect if image contains a person without food
const detectionResult = await claudeIntegration.detectPersonInImage(imageBuffer, mimeType);

if (detectionResult.success && detectionResult.has_person && !detectionResult.has_food) {
  // Easter egg triggered! Person detected but no food
  const easterEggMessages = [
    "👀 Looks like an absolute snack, but I'm not sure we have nutrition data for that! 😄\n\nMaybe try sending a photo of some actual food? 🍕",
    "🙋 I see someone looking great, but where's the food? 😊\n\nI'm here to track meals, not selfies! Send me something delicious instead! 🥗",
    "👤 Well hello there! You look fantastic, but I need actual food to analyze! 😅\n\nTry sending a meal photo or nutrition label! 🍽️",
    "😄 That's definitely a person and not a pizza! While you're clearly a snack, I need actual food to track nutrition! 🍔",
    "🤳 Nice photo! But I'm a nutrition bot, not a photographer! 📸\n\nSend me a meal or nutrition label and I'll help you track it! 🥙"
  ];

  // Pick a random easter egg message
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

### Replace With:

```javascript
// Step 3: Easter egg - detect if image contains a person without food
const detectionResult = await claudeIntegration.detectPersonInImage(imageBuffer, mimeType);

if (detectionResult.success && detectionResult.has_person && !detectionResult.has_food) {
  // Check cooldown before triggering easter egg
  const cooldownCheck = cooldownManager.checkEasterEggCooldown(userId, 'person_without_food');

  if (cooldownCheck.onCooldown) {
    // On cooldown - skip easter egg, continue with normal processing
    const remainingHours = Math.round(cooldownCheck.remainingMs / (60 * 60 * 1000));
    console.log(`[Easter Egg] person_without_food on cooldown for user ${userId} (${remainingHours}h remaining)`);

    // Fall through to normal image processing (Step 4 below)
  } else {
    // Not on cooldown - trigger easter egg!
    const easterEggMessages = [
      "👀 Looks like an absolute snack, but I'm not sure we have nutrition data for that! 😄\n\nMaybe try sending a photo of some actual food? 🍕",
      "🙋 I see someone looking great, but where's the food? 😊\n\nI'm here to track meals, not selfies! Send me something delicious instead! 🥗",
      "👤 Well hello there! You look fantastic, but I need actual food to analyze! 😅\n\nTry sending a meal photo or nutrition label! 🍽️",
      "😄 That's definitely a person and not a pizza! While you're clearly a snack, I need actual food to track nutrition! 🍔",
      "🤳 Nice photo! But I'm a nutrition bot, not a photographer! 📸\n\nSend me a meal or nutrition label and I'll help you track it! 🥙"
    ];

    // Pick a random easter egg message
    const randomMessage = easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];

    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMsg.message_id,
      null,
      randomMessage
    );

    // Record trigger to start cooldown
    cooldownManager.recordEasterEggTrigger(userId, 'person_without_food');

    console.log(`[Easter Egg] Triggered person_without_food for user ${userId}, cooldown started (7 days)`);
    return; // Don't process for nutrition
  }
}
```

## Step 3: Optional - Add Admin Commands

**File:** `/home/user/nutrition-tracking/automation/telegram-bot/src/webhook.js`

**Location:** Add near other bot commands (e.g., after `/today` command)

```javascript
// View active cooldowns
bot.command('cooldowns', async (ctx) => {
  const userId = ctx.from.id;

  // Check authorization
  if (!authorizedUsers.includes(userId)) {
    await ctx.reply("Sorry, you are not authorized to use this bot.");
    return;
  }

  const cooldowns = cooldownManager.getUserCooldowns(userId);

  if (Object.keys(cooldowns).length === 0) {
    await ctx.reply("✅ You have no active cooldowns! All easter eggs are available.");
    return;
  }

  let message = "🕐 Your active cooldowns:\n\n";
  for (const [type, info] of Object.entries(cooldowns)) {
    if (info.isActive) {
      const hoursRemaining = Math.ceil(info.remainingMs / (60 * 60 * 1000));
      const daysRemaining = Math.floor(hoursRemaining / 24);

      if (daysRemaining > 0) {
        message += `• ${type}: ${daysRemaining}d ${hoursRemaining % 24}h remaining\n`;
      } else {
        message += `• ${type}: ${hoursRemaining}h remaining\n`;
      }
    }
  }

  await ctx.reply(message);
});

// Clear cooldowns (for testing/debugging)
bot.command('clearcooldowns', async (ctx) => {
  const userId = ctx.from.id;

  // Check authorization
  if (!authorizedUsers.includes(userId)) {
    await ctx.reply("Sorry, you are not authorized to use this bot.");
    return;
  }

  cooldownManager.clearUserCooldowns(userId);
  await ctx.reply("✅ All your cooldowns have been cleared!");
});

// View statistics (admin only - add user ID check if needed)
bot.command('cooldownstats', async (ctx) => {
  const userId = ctx.from.id;

  // Check authorization
  if (!authorizedUsers.includes(userId)) {
    await ctx.reply("Sorry, you are not authorized to use this bot.");
    return;
  }

  const stats = cooldownManager.getCooldownStats();

  let message = `📊 **Cooldown Statistics**\n\n`;
  message += `👥 Total users tracked: ${stats.totalUsers}\n`;
  message += `⏰ Active cooldowns: ${stats.activeCooldowns}\n`;
  message += `💾 Memory usage: ~${Math.round(stats.totalUsers * 192 / 1024)}KB\n\n`;

  if (Object.keys(stats.cooldownsByType).length > 0) {
    message += `**Cooldowns by type:**\n`;
    for (const [type, count] of Object.entries(stats.cooldownsByType)) {
      message += `• ${type}: ${count}\n`;
    }
  }

  await ctx.reply(message);
});
```

## Step 4: Update Help Command (Optional)

**File:** `/home/user/nutrition-tracking/automation/telegram-bot/src/webhook.js`

**Location:** Find the `/help` command and add cooldown commands

```javascript
bot.command('help', async (ctx) => {
  const helpMessage = `
🤖 **Nutrition Tracking Bot**

**Basic Commands:**
/start - Start using the bot
/help - Show this help message
/today - View today's nutrition summary

**Tracking:**
📝 Send a text description of your food
📸 Send a photo of your meal or nutrition label

**Cooldowns:** (New!)
/cooldowns - View your active easter egg cooldowns
/clearcooldowns - Clear all your cooldowns

**How it works:**
1. Send a food description or photo
2. I'll analyze the nutrition
3. I'll log it to your GitHub repository
4. Use /today to see your progress!

Need help? Just send a message!
`;

  await ctx.reply(helpMessage);
});
```

## Step 5: Add Health Check Endpoint (Optional)

**File:** `/home/user/nutrition-tracking/automation/telegram-bot/server.js`

**Location:** Add a new endpoint for monitoring

```javascript
// Health check with cooldown statistics
app.get('/health', (req, res) => {
  const conversationStats = conversationManager.getStats();
  const cooldownStats = cooldownManager.getCooldownStats();

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    conversations: {
      activeLocks: conversationStats.activeLocks,
      activeConversations: conversationStats.activeConversations,
      totalTokens: conversationStats.totalTokens
    },
    cooldowns: {
      totalUsers: cooldownStats.totalUsers,
      activeCooldowns: cooldownStats.activeCooldowns,
      memoryUsage: `${Math.round(cooldownStats.totalUsers * 192 / 1024)}KB`,
      byType: cooldownStats.cooldownsByType
    }
  });
});
```

## Step 6: Configure Environment Variables (Optional)

**File:** `.env` or deployment configuration

```bash
# Easter Egg Cooldown Configuration
MAX_COOLDOWN_ENTRIES=1000              # Max users to track (default: 1000)
COOLDOWN_CLEANUP_INTERVAL_MS=300000    # Cleanup every 5 minutes (default)

# Cooldown durations (milliseconds) - Optional, defaults shown
COOLDOWN_PERSON_WITHOUT_FOOD=604800000   # 7 days
COOLDOWN_PET=259200000                   # 3 days
COOLDOWN_EMPTY_PLATE=172800000           # 2 days
COOLDOWN_MIDNIGHT_MUNCHIES=43200000      # 12 hours
COOLDOWN_CELEBRATION=2592000000          # 30 days
COOLDOWN_NON_FOOD_ITEM=604800000         # 7 days
COOLDOWN_SHOPPING_SCENE=259200000        # 3 days
COOLDOWN_SCREENSHOT=172800000            # 2 days
COOLDOWN_EMPTY_PACKAGING=172800000       # 2 days
```

## Step 7: Test the Integration

### 7.1 Run Unit Tests

```bash
cd /home/user/nutrition-tracking/automation/telegram-bot
npm test tests/unit/easter-egg-cooldown-manager.test.js
```

Expected output:
```
Test Suites: 1 passed, 1 total
Tests:       27 passed, 27 total
```

### 7.2 Manual Testing

1. **Test cooldown activation:**
   - Send a selfie (person without food)
   - Should show easter egg message
   - Send another selfie immediately
   - Should process as normal food image (on cooldown)

2. **Test cooldown status:**
   - Use `/cooldowns` command
   - Should show "person_without_food: Xd remaining"

3. **Test cooldown clearing:**
   - Use `/clearcooldowns` command
   - Send another selfie
   - Should show easter egg again

4. **Test statistics:**
   - Use `/cooldownstats` command
   - Should show system statistics

### 7.3 Production Testing

1. Deploy to staging environment
2. Test with real Telegram bot
3. Verify cooldowns work as expected
4. Check logs for `[EasterEggCooldownManager]` messages
5. Monitor `/health` endpoint

## Verification Checklist

- [ ] Cooldown manager imported in webhook.js
- [ ] Easter egg detection wrapped with cooldown check
- [ ] `recordEasterEggTrigger()` called after showing easter egg
- [ ] Optional admin commands added
- [ ] Unit tests passing (27/27)
- [ ] Manual testing successful
- [ ] Logs show cooldown activity
- [ ] Health endpoint shows cooldown stats
- [ ] Production deployment successful

## Rollback Plan

If issues occur, simply remove the cooldown check:

```javascript
// Quick rollback: Remove cooldown check
if (detectionResult.success && detectionResult.has_person && !detectionResult.has_food) {
  // Remove cooldown check, keep original code
  const easterEggMessages = [...];
  const randomMessage = easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];
  await ctx.telegram.editMessageText(...);
  console.log(`Easter egg triggered for user ${userId}`);
  return;
}
```

## Support

For issues or questions:

1. Check logs for `[EasterEggCooldownManager]` messages
2. Run tests: `npm test tests/unit/easter-egg-cooldown-manager.test.js`
3. Check statistics: Use `/cooldownstats` command
4. Review documentation:
   - `EASTER_EGG_COOLDOWN_README.md` - Quick start guide
   - `EASTER_EGG_COOLDOWN_DESIGN.md` - Detailed design
   - `EASTER_EGG_COOLDOWN_ARCHITECTURE.md` - Architecture diagrams
   - `EASTER_EGG_COOLDOWN_INTEGRATION.md` - Integration examples

---

**Integration Version:** 1.0
**Last Updated:** 2024-11-07
**Status:** Ready for Integration ✓
