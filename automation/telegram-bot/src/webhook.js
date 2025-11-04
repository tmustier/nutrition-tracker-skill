// src/webhook.js - Main webhook handler and bot logic
const { Telegraf } = require('telegraf');
const axios = require('axios');
const config = require('./config');
const claudeIntegration = require('./claude-integration');
const githubIntegration = require('./github-integration');

/**
 * Telegram Bot for Nutrition Tracking
 *
 * This webhook handler integrates all modules to provide a complete
 * nutrition tracking experience via Telegram.
 *
 * Features:
 * - Text message processing: Food descriptions -> Claude/USDA -> GitHub
 * - Photo processing: Screenshots -> Claude Vision -> GitHub
 * - Daily summaries: /today command to see progress vs targets
 * - Help and onboarding: /start and /help commands
 *
 * Deployment:
 * - Designed for serverless platforms (Railway, Vercel)
 * - Exports handler(req, res) for POST /webhook
 * - Exports GET /setup for webhook registration
 * - Health check endpoint for monitoring
 */

// Initialize Telegraf bot
const bot = new Telegraf(config.telegram.botToken);

// ============================================================================
// COMMAND HANDLERS
// ============================================================================

/**
 * /start - Welcome message with usage examples
 */
bot.command('start', async (ctx) => {
  const welcomeMessage = `👋 Welcome to Nutrition Tracker!

I help you track everything you eat with precise nutrition data.

**How to use:**
• Just tell me what you ate (e.g., "200g grilled chicken breast")
• Send a screenshot of a menu or nutrition label
• Use /today to see your daily totals

**Examples:**
• "2 poached eggs with sourdough"
• "Salmon poke bowl from ITSU"
• "150g banana, 30g almonds"

**Commands:**
/today - See today's totals vs targets
/week - Weekly summary (coming soon)
/help - Show detailed help

Let's get started! Tell me what you ate.`;

  await ctx.reply(welcomeMessage);
});

/**
 * /help - Detailed instructions and examples
 */
bot.command('help', async (ctx) => {
  const helpMessage = `📖 **How Nutrition Tracker Works**

**1. Text Messages**
Describe what you ate and I'll estimate the nutrition:
• "Just had 200g grilled chicken breast"
• "Oats with banana and almonds"
• "Pret chicken & avocado sandwich"

I'll use USDA data for generic foods and Claude AI for restaurant/branded items.

**2. Screenshots**
Send photos of:
• Menu items with descriptions
• Nutrition labels
• Restaurant nutrition information

I'll extract the data automatically.

**3. Daily Tracking**
• All entries are logged to GitHub automatically
• Use /today to see your progress
• Data is organized by date for easy analysis

**4. Targets (Rest Day)**
• Energy: 2500 kcal
• Protein: 170g min
• Fat: 70g min
• Carbs: 250g min
• Fiber: 40g min

**Tips:**
✓ Include quantities (e.g., "200g", "2 eggs", "1 bowl")
✓ Mention cooking method (grilled, fried, raw)
✓ Specify brands or restaurants for accuracy
✓ Add context in parentheses (e.g., "chicken (with skin)")

Need help? Just ask!`;

  await ctx.reply(helpMessage);
});

/**
 * /today - Display today's totals vs targets
 */
bot.command('today', async (ctx) => {
  try {
    // Send initial processing message
    const processingMsg = await ctx.reply('📊 Calculating today\'s totals...');

    // Get totals from GitHub
    const totals = await githubIntegration.getTodaysTotals();

    // Get targets from claude-integration (uses health profile)
    const targets = claudeIntegration.getTargets('rest'); // TODO: Detect training vs rest day

    // Calculate remaining macros
    const remaining = {
      energy_kcal: Math.max(0, targets.energy_kcal - totals.energy_kcal),
      protein_g: Math.max(0, targets.protein_g - totals.protein_g),
      fat_g: Math.max(0, targets.fat_g - totals.fat_g),
      carbs_g: Math.max(0, targets.carbs_g - totals.carbs_total_g),
      fiber_g: Math.max(0, targets.fiber_g - totals.fiber_total_g),
    };

    // Calculate percentages
    const energyPercent = Math.round((totals.energy_kcal / targets.energy_kcal) * 100);
    const proteinPercent = Math.round((totals.protein_g / targets.protein_g) * 100);

    // Build summary message
    const summaryMessage = `📊 **Today's Summary** (${totals.date})

**Entries:** ${totals.entries} meals, ${totals.items} items

**Macros vs Targets:**
🔥 Energy: ${totals.energy_kcal}/${targets.energy_kcal} kcal (${energyPercent}%)
💪 Protein: ${totals.protein_g}/${targets.protein_g}g (${proteinPercent}%)
🥑 Fat: ${totals.fat_g}/${targets.fat_g}g
🌾 Carbs: ${totals.carbs_total_g}/${targets.carbs_g}g
  └─ Available: ${totals.carbs_available_g}g
  └─ Fiber: ${totals.fiber_total_g}/${targets.fiber_g}g
  └─ Sugar: ${totals.sugar_g}g

**Remaining Today:**
• ${remaining.energy_kcal} kcal
• ${remaining.protein_g}g protein
• ${remaining.fat_g}g fat
• ${remaining.carbs_g}g carbs

**Key Minerals:**
• Sodium: ${totals.sodium_mg}mg
• Potassium: ${totals.potassium_mg}mg
• Calcium: ${totals.calcium_mg}mg
• Iron: ${totals.iron_mg}mg
• Zinc: ${totals.zinc_mg}mg

${energyPercent >= 90 ? '✅ Energy target nearly met!' : ''}
${proteinPercent >= 100 ? '✅ Protein target achieved!' : ''}`;

    // Update the processing message with results
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMsg.message_id,
      null,
      summaryMessage
    );
  } catch (error) {
    console.error('Error in /today command:', error);
    await ctx.reply('❌ Error calculating totals. Please try again or contact support.');
  }
});

/**
 * /week - Weekly summary (placeholder)
 */
bot.command('week', async (ctx) => {
  await ctx.reply('📅 Weekly summary feature coming soon!\n\nFor now, use /today to see daily totals.');
});

/**
 * /cancel - Cancel current operation
 */
bot.command('cancel', async (ctx) => {
  await ctx.reply('✅ Operation cancelled. Send me your next meal whenever you\'re ready!');
});

// ============================================================================
// MESSAGE HANDLERS
// ============================================================================

/**
 * Handle text messages - Process food descriptions
 */
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  const userId = ctx.from.id;

  // Ignore commands (already handled above)
  if (userMessage.startsWith('/')) {
    return;
  }

  try {
    // Step 1: Send processing message
    const processingMsg = await ctx.reply('🔍 Processing your food log...');

    // Step 2: Process with Claude/USDA
    console.log(`Processing food log from user ${userId}: ${userMessage}`);
    const result = await claudeIntegration.processFoodLog(userMessage, userId);

    if (!result.success) {
      // Failed to process
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        `❌ Could not process food log. ${result.message || 'Please try again with more details.'}\n\nExample: "200g grilled chicken breast" or "2 scrambled eggs"`
      );
      return;
    }

    // Step 3: Extract nutrition data from result
    let nutritionData;
    if (result.source === 'usda') {
      // USDA result format
      nutritionData = {
        name: result.data.name,
        food_bank_id: null,
        quantity: result.data.quantity,
        unit: result.data.unit,
        nutrition: result.data.per_portion,
        notes: result.data.notes || `Source: ${result.source}`,
      };
    } else if (result.source === 'claude') {
      // Claude result format
      nutritionData = {
        name: result.data.name,
        food_bank_id: result.data.food_bank_id || null,
        quantity: result.data.quantity || 1,
        unit: result.data.unit || 'portion',
        nutrition: result.data.per_portion,
        notes: result.data.notes || `Source: ${result.source}`,
      };
    } else {
      throw new Error(`Unknown result source: ${result.source}`);
    }

    // Step 4: Commit to GitHub
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMsg.message_id,
      null,
      '💾 Logging to database...'
    );

    const commitResult = await githubIntegration.appendLogEntry(nutritionData);
    console.log('Successfully logged entry:', commitResult);

    // Step 5: Get updated totals
    const totals = await githubIntegration.getTodaysTotals();
    const targets = claudeIntegration.getTargets('rest');

    const remaining = {
      energy_kcal: Math.max(0, targets.energy_kcal - totals.energy_kcal),
      protein_g: Math.max(0, targets.protein_g - totals.protein_g),
    };

    // Step 6: Format and send success message
    const nutrition = nutritionData.nutrition;
    const successMessage = `✅ **Logged: ${nutritionData.name}**

📊 **This meal:**
• ${nutrition.energy_kcal} kcal
• ${nutrition.protein_g}g protein
• ${nutrition.fat_g}g fat
• ${nutrition.carbs_total_g}g carbs (${nutrition.carbs_available_g}g available)
• ${nutrition.fiber_total_g}g fiber
• ${nutrition.sugar_g}g sugar

📈 **Today's totals:**
• ${totals.energy_kcal}/${targets.energy_kcal} kcal
• ${totals.protein_g}/${targets.protein_g}g protein
• ${totals.carbs_total_g}g carbs
• ${totals.fiber_total_g}g fiber

📉 **Still need:**
• ${remaining.energy_kcal} kcal
• ${remaining.protein_g}g protein

${result.source === 'usda' ? '📚 Data source: USDA FoodData Central' : '🤖 Data source: Claude AI estimation'}`;

    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMsg.message_id,
      null,
      successMessage
    );
  } catch (error) {
    console.error('Error processing text message:', error);
    await ctx.reply(
      `❌ Error logging food: ${error.message}\n\nPlease try again or contact support if the issue persists.`
    );
  }
});

/**
 * Handle photo messages - Process screenshots
 */
bot.on('photo', async (ctx) => {
  try {
    // Step 1: Send processing message
    const processingMsg = await ctx.reply('📸 Processing screenshot...');

    // Step 2: Download photo
    // Telegram sends multiple photo sizes - get the highest resolution
    const photos = ctx.message.photo;
    const photo = photos[photos.length - 1]; // Largest size
    const fileId = photo.file_id;

    console.log(`Processing photo from user ${ctx.from.id}, file_id: ${fileId}`);

    // Get file download link from Telegram
    const fileLink = await ctx.telegram.getFileLink(fileId);
    console.log(`Downloading image from: ${fileLink.href}`);

    // Download image as buffer
    const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);

    // Step 3: Update processing message
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMsg.message_id,
      null,
      '🤖 Analyzing image with AI...'
    );

    // Step 4: Process with Claude Vision
    const result = await claudeIntegration.processImage(imageBuffer, 'image/jpeg');

    if (!result.success) {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        `❌ Could not extract nutrition data from image.\n\n${result.message || 'Please try with a clearer photo or send a text description instead.'}`
      );
      return;
    }

    // Step 5: Prepare nutrition data
    const nutritionData = {
      name: result.data.name,
      food_bank_id: result.data.food_bank_id || null,
      quantity: result.data.quantity || 1,
      unit: result.data.unit || 'portion',
      nutrition: result.data.per_portion,
      notes: result.data.notes || 'Extracted from screenshot',
    };

    // Step 6: Log to GitHub
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMsg.message_id,
      null,
      '💾 Logging to database...'
    );

    const commitResult = await githubIntegration.appendLogEntry(nutritionData);
    console.log('Successfully logged entry from screenshot:', commitResult);

    // Step 7: Get updated totals
    const totals = await githubIntegration.getTodaysTotals();
    const targets = claudeIntegration.getTargets('rest');

    const remaining = {
      energy_kcal: Math.max(0, targets.energy_kcal - totals.energy_kcal),
      protein_g: Math.max(0, targets.protein_g - totals.protein_g),
    };

    // Step 8: Send success message
    const nutrition = nutritionData.nutrition;
    const successMessage = `✅ **Logged from screenshot: ${nutritionData.name}**

📊 **This meal:**
• ${nutrition.energy_kcal} kcal
• ${nutrition.protein_g}g protein
• ${nutrition.fat_g}g fat
• ${nutrition.carbs_total_g}g carbs

📈 **Today's totals:**
• ${totals.energy_kcal}/${targets.energy_kcal} kcal
• ${totals.protein_g}/${targets.protein_g}g protein

📉 **Still need:**
• ${remaining.energy_kcal} kcal
• ${remaining.protein_g}g protein

🤖 Extracted using Claude Vision AI`;

    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMsg.message_id,
      null,
      successMessage
    );
  } catch (error) {
    console.error('Error processing photo:', error);
    await ctx.reply(
      `❌ Error processing screenshot: ${error.message}\n\nPlease try again with a different image or send a text description.`
    );
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Global error handler for unhandled bot errors
 */
bot.catch((error, ctx) => {
  console.error('Unhandled bot error:', error);
  ctx.reply('❌ An unexpected error occurred. Please try again or contact support.').catch(err => {
    console.error('Failed to send error message:', err);
  });
});

// ============================================================================
// SERVERLESS DEPLOYMENT HANDLERS
// ============================================================================

/**
 * Main webhook handler for serverless platforms (Railway, Vercel, etc.)
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
const handler = async (req, res) => {
  try {
    // GET /setup - Set up webhook with Telegram
    if (req.method === 'GET' && (req.url === '/setup' || req.url === '/api/setup')) {
      console.log('Setting up webhook...');
      const webhookUrl = `${config.telegram.webhookUrl}/webhook`;

      await bot.telegram.setWebhook(webhookUrl);
      console.log(`Webhook set to: ${webhookUrl}`);

      res.status(200).json({
        success: true,
        message: 'Webhook configured successfully',
        webhook_url: webhookUrl,
      });
      return;
    }

    // POST /webhook - Handle Telegram updates
    if (req.method === 'POST' && (req.url === '/webhook' || req.url === '/api/webhook')) {
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
      return;
    }

    // GET / - Health check
    if (req.method === 'GET' && (req.url === '/' || req.url === '/api')) {
      res.status(200).json({
        status: 'ok',
        message: 'Nutrition Tracker Telegram Bot',
        version: '1.0.0',
        endpoints: {
          webhook: '/webhook',
          setup: '/setup',
          health: '/',
        },
      });
      return;
    }

    // 404 - Not found
    res.status(404).json({
      error: 'Not found',
      message: 'Valid endpoints: GET /, GET /setup, POST /webhook',
    });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Main webhook handler (Railway, Vercel, custom serverless)
  handler,

  // Express.js compatibility
  expressHandler: handler,

  // Export bot instance for testing
  bot,

  // Health check function
  healthCheck: () => ({
    status: 'ok',
    bot_configured: !!config.telegram.botToken,
    claude_configured: !!config.claude.apiKey,
    github_configured: !!config.github.token,
  }),
};
