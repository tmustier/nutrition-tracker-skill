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
// CONSTANTS
// ============================================================================

// Nutrition calculation constants
const NUTRITION_ROUNDING_FACTOR = 10; // For rounding to 1 decimal place
const TARGET_ACHIEVEMENT_THRESHOLDS = {
  ENERGY_NEARLY_MET_PERCENT: 90, // 90% of energy target
  PROTEIN_ACHIEVED_PERCENT: 100, // 100% of protein target
};

// Input sanitization constants
const MAX_LOG_MESSAGE_LENGTH = 500;

// Rate limiting warning threshold
const RATE_LIMIT_WARNING_THRESHOLD = 0.8; // Warn at 80% of limit

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Detect MIME type from file path extension
 * @param {string} filePath - File path from Telegram (e.g., "photos/file_123.jpg")
 * @returns {string} MIME type (defaults to image/jpeg for unknown types)
 */
const detectMimeTypeFromPath = (filePath) => {
  if (!filePath) {
    console.warn('No file path provided, defaulting to image/jpeg');
    return 'image/jpeg';
  }

  // Extract extension from file path
  const extension = filePath.split('.').pop()?.toLowerCase();
  
  // Map common image extensions to MIME types
  const mimeTypeMap = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'tiff': 'image/tiff',
    'tif': 'image/tiff',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'heic': 'image/heic',
    'heif': 'image/heif',
  };

  const mimeType = mimeTypeMap[extension] || 'image/jpeg';
  
  if (!mimeTypeMap[extension]) {
    console.warn(`Unknown file extension '${extension}', defaulting to image/jpeg`);
  }

  return mimeType;
};

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Rate limiting configuration and storage
 */
const RATE_LIMIT_REQUESTS_PER_MINUTE = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const rateLimitStorage = new Map(); // userId -> array of request timestamps

/**
 * Clean up old rate limit entries periodically
 */
const cleanupRateLimit = () => {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  
  for (const [userId, timestamps] of rateLimitStorage) {
    const validTimestamps = timestamps.filter(ts => ts > cutoff);
    
    if (validTimestamps.length === 0) {
      rateLimitStorage.delete(userId);
    } else {
      rateLimitStorage.set(userId, validTimestamps);
    }
  }
};

// Clean up rate limit storage every 5 minutes
setInterval(cleanupRateLimit, 5 * 60 * 1000);

/**
 * Rate limiting middleware - Prevents API abuse by limiting requests per user
 * @param {Object} ctx - Telegraf context
 * @param {Function} next - Next middleware function
 */
const rateLimitMiddleware = (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) {
    return next(); // Skip if no user ID (shouldn't happen after auth middleware)
  }

  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  
  // Get or create user's request history
  let userRequests = rateLimitStorage.get(userId) || [];
  
  // Filter out old requests (sliding window)
  userRequests = userRequests.filter(timestamp => timestamp > cutoff);
  
  // Check if user has exceeded rate limit
  if (userRequests.length >= RATE_LIMIT_REQUESTS_PER_MINUTE) {
    const oldestRequest = Math.min(...userRequests);
    const resetTime = Math.ceil((oldestRequest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    
    console.warn(`Rate limit exceeded for user ${userId}: ${userRequests.length}/${RATE_LIMIT_REQUESTS_PER_MINUTE} requests`);
    
    return ctx.reply(
      `⚠️ Rate limit exceeded. You can make up to ${RATE_LIMIT_REQUESTS_PER_MINUTE} requests per minute.\n\n` +
      `Please wait ${resetTime} seconds before trying again.`
    );
  }
  
  // Add current request timestamp
  userRequests.push(now);
  rateLimitStorage.set(userId, userRequests);
  
  // Log rate limit status for monitoring
  if (userRequests.length > RATE_LIMIT_REQUESTS_PER_MINUTE * RATE_LIMIT_WARNING_THRESHOLD) { // Warn at 80% of limit
    console.warn(`User ${userId} approaching rate limit: ${userRequests.length}/${RATE_LIMIT_REQUESTS_PER_MINUTE} requests`);
  }
  
  return next();
};

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

/**
 * User authentication middleware - Checks if user is authorized
 * @param {Object} ctx - Telegraf context
 * @param {Function} next - Next middleware function
 */
const authenticateUser = (ctx, next) => {
  // If no allowedUsers configured, allow all users (backward compatibility)
  if (!config.telegram.allowedUsers || config.telegram.allowedUsers.length === 0) {
    return next();
  }

  const userId = ctx.from?.id;
  if (!userId) {
    console.warn('Authentication failed: No user ID in request');
    return ctx.reply('❌ Authentication error. Please try again.');
  }

  if (!config.telegram.allowedUsers.includes(userId)) {
    console.warn(`Unauthorized access attempt from user ${userId}`);
    return ctx.reply('❌ Unauthorized. This bot is restricted to authorized users only.');
  }

  return next();
};

/**
 * Input sanitization for logging - Prevents log injection attacks
 * @param {string} input - Raw user input
 * @returns {string} Sanitized input safe for logging
 */
const sanitizeForLogging = (input) => {
  if (typeof input !== 'string') {
    return String(input);
  }
  
  // Remove or escape characters that could be used for log injection
  return input
    .replace(/[\r\n]/g, ' ') // Replace newlines with spaces
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .substring(0, MAX_LOG_MESSAGE_LENGTH); // Limit length to prevent log flooding
};

/**
 * Webhook secret verification for POST requests
 * @param {Object} req - HTTP request object
 * @returns {boolean} True if verification passes or no secret configured
 */
const verifyWebhookSecret = (req) => {
  // If no webhook secret configured, skip verification (for backward compatibility)
  if (!config.telegram.webhookSecret) {
    return true;
  }

  const providedSecret = req.headers['x-telegram-bot-api-secret-token'] || 
                        req.headers['x-webhook-secret'];
  
  if (!providedSecret) {
    console.warn('Webhook verification failed: No secret token provided');
    return false;
  }

  if (providedSecret !== config.telegram.webhookSecret) {
    console.warn('Webhook verification failed: Invalid secret token');
    return false;
  }

  return true;
};

// Apply security middleware to all bot interactions
bot.use(authenticateUser);
bot.use(rateLimitMiddleware);

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

${energyPercent >= TARGET_ACHIEVEMENT_THRESHOLDS.ENERGY_NEARLY_MET_PERCENT ? '✅ Energy target nearly met!' : ''}
${proteinPercent >= TARGET_ACHIEVEMENT_THRESHOLDS.PROTEIN_ACHIEVED_PERCENT ? '✅ Protein target achieved!' : ''}`;

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
    console.log(`Processing food log from user ${userId}: ${sanitizeForLogging(userMessage)}`);
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

    // Step 5: Get current totals before committing to avoid race condition
    const currentTotals = await githubIntegration.getTodaysTotals();
    
    // Step 6: Commit the entry
    const commitResult = await githubIntegration.appendLogEntry(nutritionData);
    console.log('Successfully logged entry:', commitResult);

    // Add current meal to totals for immediate accurate display
    const mealNutrition = nutritionData.nutrition;
    const totals = {
      date: currentTotals.date,
      entries: currentTotals.entries + 1,
      items: currentTotals.items + 1,
      energy_kcal: Math.round((currentTotals.energy_kcal + mealNutrition.energy_kcal) * NUTRITION_ROUNDING_FACTOR) / NUTRITION_ROUNDING_FACTOR,
      protein_g: Math.round((currentTotals.protein_g + mealNutrition.protein_g) * NUTRITION_ROUNDING_FACTOR) / NUTRITION_ROUNDING_FACTOR,
      fat_g: Math.round((currentTotals.fat_g + mealNutrition.fat_g) * NUTRITION_ROUNDING_FACTOR) / NUTRITION_ROUNDING_FACTOR,
      carbs_total_g: Math.round((currentTotals.carbs_total_g + mealNutrition.carbs_total_g) * NUTRITION_ROUNDING_FACTOR) / NUTRITION_ROUNDING_FACTOR,
      fiber_total_g: Math.round((currentTotals.fiber_total_g + mealNutrition.fiber_total_g) * NUTRITION_ROUNDING_FACTOR) / NUTRITION_ROUNDING_FACTOR,
    };
    
    const targets = claudeIntegration.getTargets('rest');

    const remaining = {
      energy_kcal: Math.max(0, targets.energy_kcal - totals.energy_kcal),
      protein_g: Math.max(0, targets.protein_g - totals.protein_g),
    };

    // Step 7: Format and send success message
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

    // Get file info from Telegram to detect MIME type
    const fileInfo = await ctx.telegram.getFile(fileId);
    console.log(`File info:`, { file_path: fileInfo.file_path, file_size: fileInfo.file_size });

    // Detect MIME type from file extension
    const mimeType = detectMimeTypeFromPath(fileInfo.file_path);
    console.log(`Detected MIME type: ${mimeType}`);

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

    // Step 4: Process with Claude Vision using detected MIME type
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

    // Step 7: Get current totals before committing to avoid race condition
    const currentTotals = await githubIntegration.getTodaysTotals();
    
    // Step 8: Commit the entry
    const commitResult = await githubIntegration.appendLogEntry(nutritionData);
    console.log('Successfully logged entry from screenshot:', commitResult);

    // Add current meal to totals for immediate accurate display
    const mealNutrition = nutritionData.nutrition;
    const totals = {
      date: currentTotals.date,
      entries: currentTotals.entries + 1,
      items: currentTotals.items + 1,
      energy_kcal: Math.round((currentTotals.energy_kcal + mealNutrition.energy_kcal) * NUTRITION_ROUNDING_FACTOR) / NUTRITION_ROUNDING_FACTOR,
      protein_g: Math.round((currentTotals.protein_g + mealNutrition.protein_g) * NUTRITION_ROUNDING_FACTOR) / NUTRITION_ROUNDING_FACTOR,
      fat_g: Math.round((currentTotals.fat_g + mealNutrition.fat_g) * NUTRITION_ROUNDING_FACTOR) / NUTRITION_ROUNDING_FACTOR,
      carbs_total_g: Math.round((currentTotals.carbs_total_g + mealNutrition.carbs_total_g) * NUTRITION_ROUNDING_FACTOR) / NUTRITION_ROUNDING_FACTOR,
    };
    
    const targets = claudeIntegration.getTargets('rest');

    const remaining = {
      energy_kcal: Math.max(0, targets.energy_kcal - totals.energy_kcal),
      protein_g: Math.max(0, targets.protein_g - totals.protein_g),
    };

    // Step 9: Send success message
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

      // Set webhook with optional secret token for enhanced security
      const webhookOptions = {
        url: webhookUrl,
      };

      if (config.telegram.webhookSecret) {
        webhookOptions.secret_token = config.telegram.webhookSecret;
        console.log('Webhook secret token configured for enhanced security');
      }

      await bot.telegram.setWebhook(webhookOptions.url, {
        secret_token: webhookOptions.secret_token
      });
      console.log(`Webhook set to: ${webhookUrl}`);

      res.status(200).json({
        success: true,
        message: 'Webhook configured successfully',
        webhook_url: webhookUrl,
        secret_configured: !!config.telegram.webhookSecret,
      });
      return;
    }

    // POST /webhook - Handle Telegram updates
    if (req.method === 'POST' && (req.url === '/webhook' || req.url === '/api/webhook')) {
      // Verify webhook secret token for security
      if (!verifyWebhookSecret(req)) {
        console.warn('Unauthorized webhook request - invalid or missing secret token');
        res.status(401).json({ 
          error: 'Unauthorized',
          message: 'Invalid webhook secret token'
        });
        return;
      }

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
