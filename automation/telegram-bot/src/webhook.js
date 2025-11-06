// src/webhook.js - Main webhook handler and bot logic
const { Telegraf } = require('telegraf');
const axios = require('axios');
const crypto = require('crypto');
const config = require('./config');
const claudeIntegration = require('./claude-integration');
const githubIntegration = require('./github-integration');
const ConversationManager = require('./conversation-manager');
const responseHandler = require('./response-handler');

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
 * SECURITY FEATURES:
 * - User authentication: Restricts access to authorized users only
 * - Rate limiting: Prevents API abuse with sliding window rate limiting
 * - Webhook secret verification: Uses timing-safe comparison to prevent attacks
 * - Input sanitization: All user inputs are sanitized to prevent injection attacks
 * - Request validation: All incoming requests are validated before processing
 *
 * Deployment:
 * - Designed for serverless platforms (Railway, Vercel)
 * - Exports handler(req, res) for POST /webhook
 * - Exports GET /setup for webhook registration
 * - Health check endpoint for monitoring
 */

// Initialize Telegraf bot
const bot = new Telegraf(config.telegram.botToken);

// Initialize Conversation Manager for multi-turn conversations
const conversationManager = new ConversationManager({
  maxMessagesPerUser: 20,
  maxTokensPerUser: 20000,
  conversationTTL: 1800000, // 30 minutes
  cleanupInterval: 300000 // 5 minutes
});

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
 * Sanitize error messages for user-facing responses to prevent information leakage
 * @param {Error|string} error - Error object or error message
 * @returns {string} Safe error message for users
 */
const sanitizeErrorForUser = (error) => {
  const message = typeof error === 'string' ? error : error.message;
  
  // Define patterns that might leak sensitive information
  const sensitivePatterns = [
    // File paths (absolute and relative)
    /\/[a-zA-Z0-9_\-\.\/]+/g,
    /[A-Z]:\\[a-zA-Z0-9_\-\.\\]+/g,
    // API keys and tokens
    /[a-zA-Z0-9_\-]{20,}/g,
    // Internal server details
    /localhost:\d+/g,
    /127\.0\.0\.1:\d+/g,
    // Database connection strings
    /(mongodb|postgres|mysql):\/\/[^\s]+/g,
    // Stack traces
    /at .+ \(.+:\d+:\d+\)/g,
    // Internal module names
    /node_modules/g,
    // Environment variables
    /process\.env\.[A-Z_]+/g
  ];
  
  let sanitized = message;
  
  // Remove sensitive patterns
  sensitivePatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });
  
  // Map known error types to user-friendly messages
  const errorMappings = {
    'rate limit': 'Service temporarily unavailable due to high demand. Please try again in a few minutes.',
    'timeout': 'Request timed out. Please try again.',
    'network': 'Network connection error. Please check your internet connection.',
    'authentication': 'Authentication error. Please try again.',
    'invalid json': 'Invalid data format received. Please try again.',
    'file size': 'File too large. Please use a smaller file.',
    'permission denied': 'Access denied. Please contact support.',
    'not found': 'Resource not found. Please try again.',
    'connection refused': 'Service temporarily unavailable. Please try again later.'
  };
  
  // Check if the error matches any known patterns
  for (const [pattern, userMessage] of Object.entries(errorMappings)) {
    if (sanitized.toLowerCase().includes(pattern)) {
      return userMessage;
    }
  }
  
  // If no specific mapping found, return a generic safe message
  if (sanitized.length > 100 || sanitized !== message) {
    return 'An unexpected error occurred. Please try again or contact support if the issue persists.';
  }
  
  return sanitized;
};

/**
 * Webhook secret verification for POST requests using timing-safe comparison
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

  // Use timing-safe comparison to prevent timing attacks
  try {
    const expectedBuffer = Buffer.from(config.telegram.webhookSecret, 'utf8');
    const providedBuffer = Buffer.from(providedSecret, 'utf8');
    
    // Ensure buffers are same length to prevent timing attacks
    if (expectedBuffer.length !== providedBuffer.length) {
      console.warn('Webhook verification failed: Invalid secret token length');
      return false;
    }
    
    // Use crypto.timingSafeEqual for constant-time comparison
    const isValid = crypto.timingSafeEqual(expectedBuffer, providedBuffer);
    if (!isValid) {
      console.warn('Webhook verification failed: Invalid secret token');
    }
    return isValid;
  } catch (error) {
    console.error('Webhook verification error:', error.message);
    return false;
  }
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

**1. Text Messages & Conversations**
Describe what you ate and I'll estimate the nutrition:
• "Just had 200g grilled chicken breast"
• "Oats with banana and almonds"
• "Pret chicken & avocado sandwich"

💬 **NEW: Multi-turn conversations!**
• Ask follow-up questions
• Make corrections ("actually it was 250g")
• Get clarifications before logging
• I'll remember our conversation context

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

**Commands:**
• /today - See today's totals
• /clear - Clear conversation history
• /context - View conversation info
• /cancel - Cancel and clear conversation
• /help - Show this message

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

    // Get totals from GitHub for this specific user
    const userId = ctx.from.id;
    const totals = await githubIntegration.getTodaysTotals(null, userId);

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
 * /cancel - Cancel current operation and clear conversation
 */
bot.command('cancel', async (ctx) => {
  const userId = ctx.from.id;
  conversationManager.clearHistory(userId);
  await ctx.reply('✅ Operation cancelled and conversation cleared. Send me your next meal whenever you\'re ready!');
});

/**
 * /clear - Clear conversation history
 */
bot.command('clear', async (ctx) => {
  const userId = ctx.from.id;
  const hadConversation = conversationManager.clearHistory(userId);

  if (hadConversation) {
    await ctx.reply('🗑️ Conversation history cleared! Starting fresh.');
  } else {
    await ctx.reply('💬 No active conversation to clear.');
  }
});

/**
 * /context - Show current conversation context
 */
bot.command('context', async (ctx) => {
  const userId = ctx.from.id;
  const stats = conversationManager.getStats(userId);

  if (!stats) {
    await ctx.reply('💬 No active conversation.\n\nStart chatting to build conversation context!');
    return;
  }

  const ageMinutes = Math.round(stats.age / 60000);
  const lastActivityMinutes = Math.round(stats.lastActivity / 60000);

  const contextMessage = `📋 **Conversation Context**

**Messages:** ${stats.messageCount} messages in history
**Estimated tokens:** ~${stats.estimatedTokens} tokens
**Age:** ${ageMinutes} minutes
**Last activity:** ${lastActivityMinutes} minutes ago
**Status:** ${stats.isExpired ? '⚠️ Expired' : '✅ Active'}

💡 Use /clear to reset the conversation.`;

  await ctx.reply(contextMessage);
});

/**
 * /stats - Show system statistics (for debugging)
 */
bot.command('stats', async (ctx) => {
  const systemStats = conversationManager.getSystemStats();

  const statsMessage = `📊 **System Statistics**

**Active conversations:** ${systemStats.activeConversations}
**Total conversations:** ${systemStats.totalConversations}
**Total messages:** ${systemStats.totalMessages}
**Estimated tokens:** ~${systemStats.estimatedTotalTokens}
**Processing locks:** ${systemStats.processingLocks}`;

  await ctx.reply(statsMessage);
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
    // Step 1: Check for processing lock to prevent race conditions
    if (conversationManager.isProcessing(userId)) {
      await ctx.reply('⏳ Please wait, I\'m still processing your previous message...');
      return;
    }

    // Acquire processing lock
    if (!conversationManager.acquireLock(userId)) {
      await ctx.reply('⏳ Please wait, I\'m still processing your previous message...');
      return;
    }

    // Step 2: Send processing message
    const processingMsg = await ctx.reply('🔍 Processing...');

    // Step 3: Get conversation history
    const conversationHistory = conversationManager.getHistory(userId);
    const hasHistory = conversationHistory.length > 0;

    // Step 4: Store user message in conversation
    conversationManager.addUserMessage(userId, userMessage);

    // Step 5: Process with Claude (with conversation history)
    console.log(`Processing message from user ${userId} (history: ${conversationHistory.length} messages): ${sanitizeForLogging(userMessage)}`);
    const result = await claudeIntegration.processFoodLog(userMessage, userId, conversationHistory);

    // Step 6: Detect response type and handle accordingly
    const responseText = result.responseText || '';
    const detection = responseHandler.detectResponseType(responseText);

    console.log(`Response type detected: ${detection.type} (hasJSON: ${detection.hasJSON}, hasText: ${detection.hasText})`);

    // Store assistant's response in conversation history
    if (responseText) {
      conversationManager.addAssistantMessage(userId, responseText);
    }

    // Handle based on response type
    if (detection.type === responseHandler.ResponseType.CONVERSATIONAL) {
      // Pure conversational response - no logging to GitHub
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        `💬 ${responseText}`
      );
      conversationManager.releaseLock(userId);
      return;
    }

    if (!result.success) {
      // Check if this is a conversational response (Claude asking for clarification)
      if (result.isConversational && responseText) {
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          processingMsg.message_id,
          null,
          `💬 ${responseText}`
        );
        conversationManager.releaseLock(userId);
        return;
      }

      // Otherwise, it's an error
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        `❌ Could not process food log. ${result.message || 'Please try again with more details.'}\n\nExample: "200g grilled chicken breast" or "2 scrambled eggs"`
      );
      conversationManager.releaseLock(userId);
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

    // Step 5: Get current totals before committing to avoid race condition (for this user only)
    const currentTotals = await githubIntegration.getTodaysTotals(null, userId);

    // Step 6: Extract user information for multi-user tracking
    const userName = [ctx.from.first_name, ctx.from.last_name]
      .filter(Boolean)
      .join(' ') || ctx.from.username || `User ${userId}`;

    // Step 7: Commit the entry with user information
    const commitResult = await githubIntegration.appendLogEntry(
      nutritionData,
      null, // timestamp (use default)
      userId,
      userName
    );
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

    // Release processing lock
    conversationManager.releaseLock(userId);
  } catch (error) {
    console.error('Error processing text message:', error);
    await ctx.reply(
      `❌ Error logging food: ${sanitizeErrorForUser(error)}\n\nPlease try again or contact support if the issue persists.`
    );
    // Release lock in case of error
    conversationManager.releaseLock(userId);
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

    // Validate file size before download to prevent memory exhaustion attacks
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    if (fileInfo.file_size > MAX_IMAGE_SIZE) {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        `❌ Image too large (${Math.round(fileInfo.file_size / 1024 / 1024)}MB). Please send images under 10MB.`
      );
      return;
    }

    // Detect MIME type from file extension
    const mimeType = detectMimeTypeFromPath(fileInfo.file_path);
    console.log(`Detected MIME type: ${mimeType}`);

    // Get file download link from Telegram
    const fileLink = await ctx.telegram.getFileLink(fileId);
    console.log(`Downloading image from: ${fileLink.href}`);

    // Download image as buffer with timeout to prevent hanging requests
    const response = await axios.get(fileLink.href, { 
      responseType: 'arraybuffer',
      timeout: 30000 // 30 seconds timeout
    });
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

    // Step 7: Extract user information for multi-user tracking
    const userId = ctx.from.id;
    const userName = [ctx.from.first_name, ctx.from.last_name]
      .filter(Boolean)
      .join(' ') || ctx.from.username || `User ${userId}`;

    // Step 8: Get current totals before committing to avoid race condition (for this user only)
    const currentTotals = await githubIntegration.getTodaysTotals(null, userId);

    // Step 9: Commit the entry with user information
    const commitResult = await githubIntegration.appendLogEntry(
      nutritionData,
      null, // timestamp (use default)
      userId,
      userName
    );
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
      `❌ Error processing screenshot: ${sanitizeErrorForUser(error)}\n\nPlease try again with a different image or send a text description.`
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

      // Register bot commands for better UX
      const commands = [
        { command: 'start', description: 'Welcome message and quick start guide' },
        { command: 'help', description: 'Detailed help and usage instructions' },
        { command: 'today', description: 'Show today\'s nutrition totals vs targets' },
        { command: 'week', description: 'Weekly summary (coming soon)' },
        { command: 'cancel', description: 'Cancel current operation' }
      ];

      try {
        await bot.telegram.setMyCommands(commands);
        console.log('✓ Bot commands registered successfully');
      } catch (commandError) {
        console.warn('Failed to register bot commands:', commandError.message);
        // Don't fail the setup if command registration fails
      }

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
      message: sanitizeErrorForUser(error),
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
