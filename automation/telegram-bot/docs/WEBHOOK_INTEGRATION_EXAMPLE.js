/**
 * WEBHOOK INTEGRATION EXAMPLE
 *
 * This file shows how to integrate the Easter Egg Configuration System
 * into the existing webhook.js photo handler.
 *
 * BEFORE: Messages hardcoded in webhook.js (lines 836-842)
 * AFTER: Clean integration with configuration system
 */

// ============================================================================
// IMPORTS
// ============================================================================

const easterEggManager = require('./easter-egg-manager');
const cooldownManager = require('./easter-egg-cooldown-manager');

// ============================================================================
// PHOTO HANDLER - BEFORE (Current Implementation)
// ============================================================================

bot.on('photo', async (ctx) => {
  const userId = ctx.from.id;

  try {
    // ... file download and validation ...

    // Step 3: Easter egg - detect if image contains a person without food
    const detectionResult = await claudeIntegration.detectPersonInImage(imageBuffer, mimeType);

    // OLD WAY: Hardcoded messages and logic
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

    // ... continue with nutrition extraction ...
  } catch (error) {
    // ... error handling ...
  }
});

// ============================================================================
// PHOTO HANDLER - AFTER (With Configuration System)
// ============================================================================

bot.on('photo', async (ctx) => {
  const userId = ctx.from.id;

  try {
    // ... file download and validation ...

    // Step 3: Detect image content
    const detectionResult = await claudeIntegration.detectPersonInImage(imageBuffer, mimeType);

    // NEW WAY: Use easter egg manager
    const easterEggResult = easterEggManager.evaluateDetection(detectionResult, userId);

    // Step 4: Handle easter egg if triggered and not on cooldown
    if (easterEggResult.shouldTrigger && easterEggResult.canTrigger) {
      // Get random message from configuration
      const message = easterEggResult.getMessage();

      // Send easter egg message
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        message
      );

      // Record trigger (updates cooldown)
      easterEggResult.recordTrigger();

      // Check if this easter egg blocks nutrition extraction
      if (easterEggResult.blocksNutritionExtraction) {
        console.log(`[Easter Egg] Triggered: ${easterEggResult.easterEggId} for user ${userId}`);
        return; // Stop here - don't extract nutrition
      }

      // If companion easter egg (like celebration or midnight munchies),
      // we continue to nutrition extraction below
      console.log(`[Easter Egg] Companion triggered: ${easterEggResult.easterEggId}`);
    }

    // Handle cooldown case (easter egg would trigger but user is on cooldown)
    if (easterEggResult.shouldTrigger && !easterEggResult.canTrigger) {
      console.log(`[Easter Egg] On cooldown: ${easterEggResult.easterEggId} for user ${userId}`);
      console.log(`[Easter Egg] Next available: ${easterEggResult.cooldownInfo.nextAvailable}`);
      // Continue to nutrition extraction (don't show easter egg)
    }

    // Step 5: Continue with nutrition extraction
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMsg.message_id,
      null,
      '🤖 Analyzing image with AI...'
    );

    const result = await claudeIntegration.processImage(imageBuffer, mimeType);

    if (!result.success) {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        `❌ Could not extract nutrition data from image.\n\n${result.message || 'Please try with a clearer photo or send a text description instead.'}`
      );
      return;
    }

    // ... rest of nutrition extraction ...

  } catch (error) {
    // ... error handling ...
  }
});

// ============================================================================
// COMPANION EASTER EGG EXAMPLE (Midnight Munchies)
// ============================================================================

bot.on('photo', async (ctx) => {
  const userId = ctx.from.id;

  try {
    // ... detection ...

    const easterEggResult = easterEggManager.evaluateDetection(detectionResult, userId);

    // Handle companion easter egg (doesn't block nutrition extraction)
    let easterEggPrefix = '';

    if (easterEggResult.shouldTrigger && easterEggResult.canTrigger) {
      if (!easterEggResult.blocksNutritionExtraction) {
        // This is a companion easter egg - save message as prefix
        easterEggPrefix = easterEggResult.getMessage();
        easterEggResult.recordTrigger();
        console.log(`[Easter Egg] Companion: ${easterEggResult.easterEggId}`);
      } else {
        // Blocking easter egg
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          processingMsg.message_id,
          null,
          easterEggResult.getMessage()
        );
        easterEggResult.recordTrigger();
        return;
      }
    }

    // ... nutrition extraction ...

    // Prepare success message
    const successMessage = `${easterEggPrefix}✅ **Logged: ${nutritionData.name}**

📊 **This meal:**
• ${nutrition.energy_kcal} kcal
• ${nutrition.protein_g}g protein
• ${nutrition.fat_g}g fat
• ${nutrition.carbs_total_g}g carbs

📈 **Today's totals:**
• ${totals.energy_kcal}/${targets.energy_kcal} kcal
• ${totals.protein_g}/${targets.protein_g}g protein

🤖 Extracted using Claude Vision AI`;

    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMsg.message_id,
      null,
      successMessage
    );

  } catch (error) {
    // ... error handling ...
  }
});

// ============================================================================
// ADMIN COMMANDS
// ============================================================================

// Check user's easter egg status
bot.command('eastereggs', async (ctx) => {
  const userId = ctx.from.id;

  try {
    // Get all cooldown statuses
    const status = easterEggManager.getUserCooldownStatus(userId);

    let message = '🥚 **Your Easter Egg Status**\n\n';

    for (const [eggId, info] of Object.entries(status)) {
      message += `**${info.easterEggName}**\n`;

      if (info.onCooldown) {
        const hoursRemaining = Math.ceil(info.remainingMs / (60 * 60 * 1000));
        message += `  ⏳ On cooldown (${hoursRemaining}h remaining)\n`;
        message += `  📅 Available: ${info.nextAvailable.toLocaleString()}\n`;
      } else {
        message += `  ✅ Available\n`;
      }

      message += '\n';
    }

    await ctx.reply(message, { parse_mode: 'Markdown' });

  } catch (error) {
    console.error('Error checking easter egg status:', error);
    await ctx.reply('❌ Error checking easter egg status.');
  }
});

// Get easter egg statistics (admin only)
bot.command('eggstats', async (ctx) => {
  const userId = ctx.from.id;

  // TODO: Add admin check
  // if (!isAdmin(userId)) return;

  try {
    const stats = easterEggManager.getStats();
    const cooldownStats = cooldownManager.getCooldownStats();

    const message = `📊 **Easter Egg Statistics**

**Configuration:**
• Total easter eggs: ${stats.total}
• Enabled: ${stats.enabled}
• Disabled: ${stats.disabled}
• Blocking: ${stats.blocking}
• Companion: ${stats.companion}
• Global enabled: ${stats.globalEnabled}

**Categories:**
• Wrong content: ${stats.categories.wrong_content}
• Timing: ${stats.categories.timing}
• Wrong format: ${stats.categories.wrong_format}
• Fun: ${stats.categories.fun}

**Cooldowns:**
• Users tracked: ${cooldownStats.totalUsers}
• Active cooldowns: ${cooldownStats.activeCooldowns}
• Total cooldowns: ${cooldownStats.totalCooldowns}

**By Type:**
${Object.entries(cooldownStats.cooldownsByType)
  .map(([type, count]) => `• ${type}: ${count}`)
  .join('\n')}`;

    await ctx.reply(message, { parse_mode: 'Markdown' });

  } catch (error) {
    console.error('Error getting easter egg stats:', error);
    await ctx.reply('❌ Error getting statistics.');
  }
});

// Clear cooldowns (admin/testing only)
bot.command('cleareggs', async (ctx) => {
  const userId = ctx.from.id;

  // TODO: Add admin check or testing environment check
  // if (!isAdmin(userId) && process.env.NODE_ENV !== 'test') return;

  try {
    easterEggManager.clearUserCooldowns(userId);
    await ctx.reply('✅ All easter egg cooldowns cleared!');
  } catch (error) {
    console.error('Error clearing cooldowns:', error);
    await ctx.reply('❌ Error clearing cooldowns.');
  }
});

// ============================================================================
// TESTING HELPERS
// ============================================================================

/**
 * Test specific easter egg
 */
async function testEasterEgg(eggId, userId, ctx) {
  try {
    // Check eligibility
    const eligibility = easterEggManager.checkEligibility(eggId, userId);

    if (!eligibility.eligible) {
      await ctx.reply(`❌ Cannot trigger ${eggId}: ${eligibility.reason}`);
      if (eligibility.cooldownInfo.nextAvailable) {
        await ctx.reply(`Next available: ${eligibility.cooldownInfo.nextAvailable}`);
      }
      return;
    }

    // Manual trigger
    const result = easterEggManager.manualTrigger(eggId, userId);

    await ctx.reply(`🎯 **Test: ${result.easterEggName}**\n\n${result.message}`);

    console.log(`[Test] Triggered ${eggId} for user ${userId}`);

  } catch (error) {
    console.error('Error testing easter egg:', error);
    await ctx.reply(`❌ Error: ${error.message}`);
  }
}

// Test command
bot.command('testegg', async (ctx) => {
  const args = ctx.message.text.split(' ');

  if (args.length < 2) {
    await ctx.reply('Usage: /testegg <egg_id>\n\nAvailable IDs:\n' +
      '• person_without_food\n' +
      '• pet\n' +
      '• empty_plate\n' +
      '• midnight_munchies\n' +
      '• celebration\n' +
      '... etc');
    return;
  }

  const eggId = args[1];
  const userId = ctx.from.id;

  await testEasterEgg(eggId, userId, ctx);
});

// ============================================================================
// BENEFITS OF NEW SYSTEM
// ============================================================================

/**
 * BENEFITS:
 *
 * 1. EASY TO ADD NEW EASTER EGGS
 *    - Just add to easter-egg-config.js
 *    - No changes to webhook.js
 *
 * 2. EASY TO DISABLE
 *    - Set enabled: false in config
 *    - Or use environment variable: EASTER_EGGS_ENABLED=false
 *
 * 3. EASY TO CHANGE MESSAGES
 *    - Edit messages array in config
 *    - No searching through code
 *
 * 4. TYPE-SAFE
 *    - Clear structure and validation
 *    - JSDoc type definitions
 *
 * 5. MAINTAINABLE
 *    - Centralized configuration
 *    - Separation of concerns
 *    - Easy to test
 *
 * 6. COOLDOWN MANAGEMENT
 *    - Automatic cooldown tracking
 *    - Per-user, per-type cooldowns
 *    - Memory-efficient LRU eviction
 *
 * 7. ANALYTICS-READY
 *    - Logging built in
 *    - Statistics available
 *    - Easy to add tracking
 *
 * 8. EXTENSIBLE
 *    - Support for A/B testing
 *    - Personalization ready
 *    - Dynamic behavior possible
 */

// ============================================================================
// COMPARISON
// ============================================================================

/**
 * OLD SYSTEM:
 * ✗ Messages hardcoded in webhook.js
 * ✗ Logic scattered across files
 * ✗ Hard to add new easter eggs
 * ✗ No cooldown management
 * ✗ No statistics or monitoring
 * ✗ Limited to one easter egg type
 *
 * NEW SYSTEM:
 * ✓ Centralized configuration
 * ✓ Clean separation of concerns
 * ✓ Easy to add/remove/modify
 * ✓ Built-in cooldown management
 * ✓ Statistics and monitoring
 * ✓ Support for multiple types
 * ✓ Blocking and companion modes
 * ✓ Priority system
 * ✓ Environment variable overrides
 * ✓ Testing helpers included
 */

module.exports = {
  testEasterEgg,
};
