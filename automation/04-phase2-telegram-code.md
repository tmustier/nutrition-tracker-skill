[← Phase 2 Setup](03-phase2-telegram-setup.md) | [↑ Table of Contents](README.md) | [Next: Phase 2 Deployment →](05-phase2-telegram-deployment.md)

---

#### 2.2.3 Create USDA API Integration

**File**: `src/usda-api.js`

```javascript
// src/usda-api.js
const axios = require('axios');
const config = require('./config');

class UsdaApi {
  constructor() {
    this.baseUrl = config.usda.baseUrl;
    this.apiKey = config.usda.apiKey;
  }

  /**
   * Search for foods by query string
   * @param {string} query - Search term (e.g., "chicken breast")
   * @param {number} pageSize - Number of results to return (default: 5)
   * @returns {Promise<Array>} Array of food items
   */
  async searchFoods(query, pageSize = 5) {
    try {
      const response = await axios.get(`${this.baseUrl}/foods/search`, {
        params: {
          api_key: this.apiKey,
          query: query,
          dataType: 'Foundation,SR Legacy', // Most reliable data types
          pageSize: pageSize,
        },
      });

      return response.data.foods || [];
    } catch (error) {
      console.error('USDA API search error:', error.message);
      throw new Error('Failed to search USDA database');
    }
  }

  /**
   * Get detailed nutrition information for a specific food by FDC ID
   * @param {number} fdcId - FoodData Central ID
   * @returns {Promise<Object>} Detailed food information
   */
  async getFoodDetails(fdcId) {
    try {
      const response = await axios.get(`${this.baseUrl}/food/${fdcId}`, {
        params: {
          api_key: this.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error('USDA API detail error:', error.message);
      throw new Error('Failed to get food details from USDA');
    }
  }

  /**
   * Parse USDA nutrition data into our standard format
   * @param {Object} usdaFood - USDA food object
   * @param {number} grams - Serving size in grams
   * @returns {Object} Standardized nutrition object
   */
  parseNutrition(usdaFood, grams = 100) {
    const nutrients = {};

    // USDA uses nutrient IDs, map them to our field names
    const nutrientMapping = {
      1008: 'energy_kcal',
      1003: 'protein_g',
      1004: 'fat_g',
      1258: 'sat_fat_g',
      1292: 'mufa_g',
      1293: 'pufa_g',
      1257: 'trans_fat_g',
      1253: 'cholesterol_mg',
      2000: 'sugar_g',
      1079: 'fiber_total_g',
      1005: 'carbs_total_g',
      1093: 'sodium_mg',
      1092: 'potassium_mg',
      1095: 'zinc_mg',
      1162: 'vitamin_c_mg',
      1089: 'iron_mg',
      1087: 'calcium_mg',
      1090: 'magnesium_mg',
    };

    // Extract nutrients from USDA data
    if (usdaFood.foodNutrients) {
      usdaFood.foodNutrients.forEach(nutrient => {
        const fieldName = nutrientMapping[nutrient.nutrientId];
        if (fieldName) {
          // Scale to requested serving size
          const value = (nutrient.value || 0) * (grams / 100);
          nutrients[fieldName] = parseFloat(value.toFixed(2));
        }
      });
    }

    // Fill in missing required fields with 0
    const requiredFields = [
      'energy_kcal', 'protein_g', 'fat_g', 'sat_fat_g', 'mufa_g', 'pufa_g',
      'trans_fat_g', 'cholesterol_mg', 'sugar_g', 'fiber_total_g',
      'fiber_soluble_g', 'fiber_insoluble_g', 'carbs_total_g',
      'carbs_available_g', 'sodium_mg', 'potassium_mg', 'iodine_ug',
      'magnesium_mg', 'calcium_mg', 'iron_mg', 'zinc_mg', 'vitamin_c_mg',
      'manganese_mg', 'polyols_g'
    ];

    requiredFields.forEach(field => {
      if (!(field in nutrients)) {
        nutrients[field] = 0;
      }
    });

    // Calculate derived fields
    if (!nutrients.carbs_available_g) {
      nutrients.carbs_available_g = Math.max(0,
        nutrients.carbs_total_g - nutrients.fiber_total_g - nutrients.polyols_g
      );
    }

    return nutrients;
  }

  /**
   * Quick lookup: search and return best match with nutrition data
   * @param {string} query - Food description (e.g., "200g chicken breast grilled")
   * @returns {Promise<Object>} Nutrition data and metadata
   */
  async quickLookup(query) {
    // Extract quantity and unit if present
    const quantityMatch = query.match(/(\d+)\s*(g|grams?|oz|ounces?|lb|pounds?)/i);
    let grams = 100; // Default serving size

    if (quantityMatch) {
      const amount = parseInt(quantityMatch[1]);
      const unit = quantityMatch[2].toLowerCase();

      // Convert to grams
      if (unit.startsWith('oz')) {
        grams = amount * 28.35;
      } else if (unit.startsWith('lb') || unit.startsWith('pound')) {
        grams = amount * 453.592;
      } else {
        grams = amount;
      }
    }

    // Search for food
    const results = await this.searchFoods(query, 5);

    if (results.length === 0) {
      return {
        success: false,
        message: 'No USDA data found for this food',
      };
    }

    // Get best match (first result is usually most relevant)
    const bestMatch = results[0];
    const details = await this.getFoodDetails(bestMatch.fdcId);
    const nutrition = this.parseNutrition(details, grams);

    return {
      success: true,
      food_name: bestMatch.description,
      fdc_id: bestMatch.fdcId,
      serving_grams: grams,
      nutrition: nutrition,
      source: 'USDA FoodData Central',
      confidence: 'high',
    };
  }
}

module.exports = new UsdaApi();
```

**Time**: 30 minutes

#### 2.2.4 Create Claude API Integration

**File**: `src/claude-integration.js`

```javascript
// src/claude-integration.js
const axios = require('axios');
const config = require('./config');
const usdaApi = require('./usda-api');

class ClaudeIntegration {
  constructor() {
    this.apiKey = config.claude.apiKey;
    this.model = config.claude.model;
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
  }

  /**
   * Process food logging request with Claude API
   * @param {string} userMessage - User's food description
   * @param {string} userId - Telegram user ID (for context)
   * @returns {Promise<Object>} Processed nutrition data
   */
  async processFoodLog(userMessage, userId) {
    try {
      // First, try USDA quick lookup for generic foods
      const keywords = ['chicken', 'beef', 'salmon', 'rice', 'oats', 'egg', 'milk', 'bread', 'banana', 'apple'];
      const isGenericFood = keywords.some(kw => userMessage.toLowerCase().includes(kw));

      let usdaResult = null;
      if (isGenericFood) {
        try {
          usdaResult = await usdaApi.quickLookup(userMessage);
          if (usdaResult.success) {
            console.log(`USDA lookup successful for: ${userMessage}`);
            return {
              success: true,
              source: 'usda',
              data: usdaResult,
            };
          }
        } catch (error) {
          console.log('USDA lookup failed, falling back to Claude:', error.message);
        }
      }

      // If USDA didn't work, use Claude for estimation
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          max_tokens: config.claude.maxTokens,
          system: config.skillContext,
          messages: [
            {
              role: 'user',
              content: `I just ate: ${userMessage}\n\nPlease estimate the complete nutrition data and return it in the JSON format specified in your instructions. If this is a generic ingredient and you couldn't find it in USDA, make your best estimate based on standard nutrition databases.`,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
          },
        }
      );

      // Extract JSON from Claude's response
      const claudeText = response.data.content[0].text;
      const jsonMatch = claudeText.match(/```json\n([\s\S]*?)\n```/);

      if (jsonMatch) {
        const nutritionData = JSON.parse(jsonMatch[1]);
        return {
          success: true,
          source: 'claude',
          data: nutritionData,
        };
      } else {
        // If Claude didn't return JSON, return the text response
        return {
          success: false,
          message: 'Could not parse nutrition data from Claude response',
          raw_response: claudeText,
        };
      }
    } catch (error) {
      console.error('Claude API error:', error.response?.data || error.message);
      throw new Error('Failed to process food log with Claude');
    }
  }

  /**
   * Process image (screenshot) with Claude Vision API
   * @param {Buffer} imageBuffer - Image data
   * @param {string} mimeType - Image MIME type (e.g., 'image/jpeg')
   * @returns {Promise<Object>} Extracted nutrition data
   */
  async processImage(imageBuffer, mimeType) {
    try {
      const base64Image = imageBuffer.toString('base64');

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          max_tokens: config.claude.maxTokens,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: mimeType,
                    data: base64Image,
                  },
                },
                {
                  type: 'text',
                  text: 'This is a screenshot of a menu item or nutrition label. Please extract all available nutrition information and return it in JSON format with these fields: name, serving_size, energy_kcal, protein_g, fat_g, carbs_total_g, and any other nutrients visible. If some nutrients are not shown, estimate them based on the food type.',
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
          },
        }
      );

      const claudeText = response.data.content[0].text;
      const jsonMatch = claudeText.match(/```json\n([\s\S]*?)\n```/);

      if (jsonMatch) {
        const extractedData = JSON.parse(jsonMatch[1]);
        return {
          success: true,
          source: 'claude_vision',
          data: extractedData,
        };
      } else {
        return {
          success: false,
          message: 'Could not extract structured data from image',
          raw_response: claudeText,
        };
      }
    } catch (error) {
      console.error('Claude Vision API error:', error.response?.data || error.message);
      throw new Error('Failed to process image with Claude Vision');
    }
  }

  /**
   * Get daily summary
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<string>} Summary message
   */
  async getDailySummary(date) {
    // This would read the log file and calculate totals
    // For now, return a placeholder
    return `Daily summary for ${date} - Feature coming soon!`;
  }
}

module.exports = new ClaudeIntegration();
```

**Time**: 30 minutes

#### 2.2.5 Create GitHub Integration

**File**: `src/github-integration.js`

```javascript
// src/github-integration.js
const axios = require('axios');
const yaml = require('js-yaml');
const config = require('./config');

class GitHubIntegration {
  constructor() {
    this.token = config.github.token;
    this.owner = config.github.owner;
    this.repo = config.github.repo;
    this.branch = config.github.branch;
    this.apiUrl = 'https://api.github.com';
  }

  /**
   * Get current date in YYYY-MM-DD format (UTC)
   * @returns {string} Date string
   */
  getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Get file path for today's log
   * @returns {string} Path to log file
   */
  getLogFilePath() {
    const date = this.getCurrentDate();
    const [year, month, day] = date.split('-');
    return `data/logs/${year}-${month}/${day}.yaml`;
  }

  /**
   * Read existing log file or create new one
   * @returns {Promise<Object>} Log data and file SHA (for updates)
   */
  async getOrCreateLogFile() {
    const path = this.getLogFilePath();
    const url = `${this.apiUrl}/repos/${this.owner}/${this.repo}/contents/${path}`;

    try {
      // Try to read existing file
      const response = await axios.get(url, {
        headers: {
          Authorization: `token ${this.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          ref: this.branch,
        },
      });

      // Decode content
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      const logData = yaml.load(content);

      return {
        exists: true,
        sha: response.data.sha,
        data: logData,
        path: path,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        // File doesn't exist, create new log structure
        const date = this.getCurrentDate();
        return {
          exists: false,
          sha: null,
          data: {
            date: date,
            day_type: 'rest', // Default, can be updated
            entries: [],
          },
          path: path,
        };
      } else {
        console.error('Error reading log file:', error.message);
        throw error;
      }
    }
  }

  /**
   * Append new entry to log file
   * @param {Object} nutritionData - Nutrition data to log
   * @returns {Promise<Object>} Commit result
   */
  async appendLogEntry(nutritionData) {
    try {
      // Get current log file
      const logFile = await this.getOrCreateLogFile();

      // Create new entry
      const now = new Date();
      const timestamp = now.toISOString();

      const newEntry = {
        timestamp: timestamp,
        items: [
          {
            name: nutritionData.name,
            food_bank_id: nutritionData.food_bank_id || null,
            quantity: nutritionData.quantity || 1,
            unit: nutritionData.unit || 'portion',
            nutrition: nutritionData.per_portion || nutritionData.nutrition,
          },
        ],
        notes: nutritionData.notes || null,
      };

      // Append to entries
      logFile.data.entries.push(newEntry);

      // Convert back to YAML
      const yamlContent = yaml.dump(logFile.data, {
        lineWidth: -1, // Don't wrap lines
        noRefs: true,
      });

      // Commit to GitHub
      const url = `${this.apiUrl}/repos/${this.owner}/${this.repo}/contents/${logFile.path}`;
      const commitMessage = `chore: Log food entry - ${nutritionData.name}`;

      const response = await axios.put(
        url,
        {
          message: commitMessage,
          content: Buffer.from(yamlContent).toString('base64'),
          branch: this.branch,
          sha: logFile.sha, // Required for updates, null for new files
        },
        {
          headers: {
            Authorization: `token ${this.token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      return {
        success: true,
        commit_sha: response.data.commit.sha,
        commit_url: response.data.commit.html_url,
      };
    } catch (error) {
      console.error('Error committing to GitHub:', error.response?.data || error.message);
      throw new Error('Failed to commit log entry to GitHub');
    }
  }

  /**
   * Calculate today's totals from log entries
   * @returns {Promise<Object>} Totals for today
   */
  async getTodaysTotals() {
    try {
      const logFile = await this.getOrCreateLogFile();

      if (!logFile.exists || logFile.data.entries.length === 0) {
        return {
          entries: 0,
          energy_kcal: 0,
          protein_g: 0,
          fat_g: 0,
          carbs_total_g: 0,
        };
      }

      // Sum up all entries
      const totals = {
        entries: logFile.data.entries.length,
        energy_kcal: 0,
        protein_g: 0,
        fat_g: 0,
        carbs_total_g: 0,
      };

      logFile.data.entries.forEach(entry => {
        entry.items.forEach(item => {
          const nutrition = item.nutrition;
          totals.energy_kcal += nutrition.energy_kcal || 0;
          totals.protein_g += nutrition.protein_g || 0;
          totals.fat_g += nutrition.fat_g || 0;
          totals.carbs_total_g += nutrition.carbs_total_g || 0;
        });
      });

      // Round to 1 decimal place
      Object.keys(totals).forEach(key => {
        if (typeof totals[key] === 'number') {
          totals[key] = Math.round(totals[key] * 10) / 10;
        }
      });

      return totals;
    } catch (error) {
      console.error('Error calculating totals:', error.message);
      return {
        entries: 0,
        energy_kcal: 0,
        protein_g: 0,
        fat_g: 0,
        carbs_total_g: 0,
      };
    }
  }
}

module.exports = new GitHubIntegration();
```

**Time**: 30 minutes

#### 2.2.6 Create Main Webhook Handler

**File**: `src/webhook.js`

```javascript
// src/webhook.js
const { Telegraf } = require('telegraf');
const axios = require('axios');
const config = require('./config');
const claudeIntegration = require('./claude-integration');
const githubIntegration = require('./github-integration');

// Initialize bot
const bot = new Telegraf(config.telegram.botToken);

// Start command
bot.command('start', async (ctx) => {
  await ctx.reply(
    '🍽️ Welcome to Thomas Nutrition Tracker!\n\n' +
    'Send me what you ate, and I\'ll log it for you.\n\n' +
    'Examples:\n' +
    '• "Just had 200g grilled chicken breast"\n' +
    '• "2 poached eggs with sourdough at L\'ETO"\n' +
    '• Send a screenshot of a menu for nutrition extraction\n\n' +
    'Commands:\n' +
    '/today - Get today\'s summary\n' +
    '/help - Show this help message'
  );
});

// Help command
bot.command('help', async (ctx) => {
  await ctx.reply(
    '📖 How to use:\n\n' +
    '1. Text me what you ate (e.g., "salmon poke bowl")\n' +
    '2. Send a screenshot of nutrition info\n' +
    '3. Use /today to see your daily totals\n\n' +
    'I\'ll automatically log everything to your nutrition tracker!'
  );
});

// Today's summary command
bot.command('today', async (ctx) => {
  try {
    await ctx.reply('📊 Calculating today\'s totals...');

    const totals = await githubIntegration.getTodaysTotals();
    const targets = {
      energy_kcal: 2500, // Rest day default
      protein_g: 170,
      fat_g: 70,
      carbs_total_g: 250,
    };

    const remaining = {
      energy_kcal: Math.max(0, targets.energy_kcal - totals.energy_kcal),
      protein_g: Math.max(0, targets.protein_g - totals.protein_g),
    };

    const message =
      `📊 Today's Totals (${totals.entries} entries)\n\n` +
      `✅ Energy: ${totals.energy_kcal}/${targets.energy_kcal} kcal\n` +
      `✅ Protein: ${totals.protein_g}/${targets.protein_g}g\n` +
      `✅ Fat: ${totals.fat_g}/${targets.fat_g}g\n` +
      `✅ Carbs: ${totals.carbs_total_g}/${targets.carbs_total_g}g\n\n` +
      `📉 Still need:\n` +
      `• ${remaining.energy_kcal} kcal\n` +
      `• ${remaining.protein_g}g protein`;

    await ctx.reply(message);
  } catch (error) {
    console.error('Error in /today command:', error);
    await ctx.reply('❌ Error calculating totals. Please try again.');
  }
});

// Handle text messages (food logging)
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  const userId = ctx.from.id;

  // Ignore commands
  if (userMessage.startsWith('/')) {
    return;
  }

  try {
    // Send "processing" message
    const processingMsg = await ctx.reply('🔍 Processing...');

    // Process with Claude/USDA
    const result = await claudeIntegration.processFoodLog(userMessage, userId);

    if (!result.success) {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        '❌ Could not process food log. Please try again with more details.'
      );
      return;
    }

    // Extract nutrition data
    let nutritionData;
    if (result.source === 'usda') {
      nutritionData = {
        name: result.data.food_name,
        quantity: result.data.serving_grams,
        unit: 'g',
        food_bank_id: null,
        per_portion: result.data.nutrition,
      };
    } else if (result.source === 'claude') {
      nutritionData = result.data.nutrition;
    }

    // Commit to GitHub
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMsg.message_id,
      null,
      '💾 Logging to database...'
    );

    const commitResult = await githubIntegration.appendLogEntry(nutritionData);

    // Get updated totals
    const totals = await githubIntegration.getTodaysTotals();
    const targets = { energy_kcal: 2500, protein_g: 170 };
    const remaining = {
      energy_kcal: Math.max(0, targets.energy_kcal - totals.energy_kcal),
      protein_g: Math.max(0, targets.protein_g - totals.protein_g),
    };

    // Send success message
    const successMessage =
      `✅ Logged: ${nutritionData.name}\n\n` +
      `📊 This meal:\n` +
      `• ${nutritionData.per_portion.energy_kcal} kcal\n` +
      `• ${nutritionData.per_portion.protein_g}g protein\n` +
      `• ${nutritionData.per_portion.fat_g}g fat\n` +
      `• ${nutritionData.per_portion.carbs_total_g}g carbs\n\n` +
      `📈 Today's totals:\n` +
      `• ${totals.energy_kcal}/${targets.energy_kcal} kcal\n` +
      `• ${totals.protein_g}/${targets.protein_g}g protein\n\n` +
      `📉 Still need: ${remaining.energy_kcal} kcal, ${remaining.protein_g}g protein`;

    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMsg.message_id,
      null,
      successMessage
    );
  } catch (error) {
    console.error('Error processing text message:', error);
    await ctx.reply('❌ Error logging food. Please try again or contact support.');
  }
});

// Handle images (screenshots)
bot.on('photo', async (ctx) => {
  try {
    await ctx.reply('📸 Processing screenshot...');

    // Get highest resolution photo
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const fileId = photo.file_id;

    // Download photo
    const fileLink = await ctx.telegram.getFileLink(fileId);
    const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);

    // Process with Claude Vision
    const result = await claudeIntegration.processImage(imageBuffer, 'image/jpeg');

    if (!result.success) {
      await ctx.reply('❌ Could not extract nutrition data from image. Please try with a clearer photo or text description.');
      return;
    }

    // Log the extracted data (similar flow as text messages)
    await ctx.reply('💾 Logging extracted data...');

    const nutritionData = result.data;
    await githubIntegration.appendLogEntry(nutritionData);

    const totals = await githubIntegration.getTodaysTotals();
    const targets = { energy_kcal: 2500, protein_g: 170 };

    await ctx.reply(
      `✅ Logged from screenshot: ${nutritionData.name}\n\n` +
      `📊 ${nutritionData.energy_kcal} kcal, ${nutritionData.protein_g}g protein\n\n` +
      `Today: ${totals.energy_kcal}/${targets.energy_kcal} kcal, ${totals.protein_g}/${targets.protein_g}g protein`
    );
  } catch (error) {
    console.error('Error processing photo:', error);
    await ctx.reply('❌ Error processing screenshot. Please try again.');
  }
});

// Export for serverless deployment
module.exports = {
  // Railway/Vercel entry point
  handler: async (req, res) => {
    try {
      // Set webhook on first deployment
      if (req.method === 'GET' && req.url === '/setup') {
        const webhookUrl = config.telegram.webhookUrl + '/webhook';
        await bot.telegram.setWebhook(webhookUrl);
        res.status(200).json({ message: 'Webhook set', url: webhookUrl });
        return;
      }

      // Handle webhook updates
      if (req.method === 'POST' && req.url === '/webhook') {
        await bot.handleUpdate(req.body);
        res.status(200).json({ ok: true });
        return;
      }

      res.status(404).json({ error: 'Not found' });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Express.js compatibility (optional)
  expressHandler: async (req, res) => {
    await module.exports.handler(req, res);
  },
};
```

**Time**: 45 minutes

#### 2.2.7 Create Environment Configuration

**File**: `.env.example`

```bash
# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
WEBHOOK_URL=https://your-app.railway.app

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=4096

# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=tmustier
GITHUB_REPO=nutrition-tracker-skill
GITHUB_BRANCH=daily-logs

# USDA FoodData Central API
USDA_API_KEY=your_usda_api_key
```

**File**: `.gitignore` (add to project)

```
node_modules/
.env
.DS_Store
*.log
```

**Create your actual .env file**:
```bash
cp .env.example .env
# Edit .env and fill in your actual values
```

**Time**: 5 minutes

#### 2.2.8 Create package.json Scripts

**File**: `package.json` (update scripts section)

```json
{
  "name": "nutrition-tracker-telegram-bot",
  "version": "1.0.0",
  "description": "Telegram bot for nutrition tracking with Claude AI",
  "main": "src/webhook.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "node test/test-usda.js"
  },
  "keywords": ["telegram", "bot", "nutrition", "claude", "ai"],
  "author": "Thomas Mustier",
  "license": "Apache-2.0",
  "dependencies": {
    "telegraf": "^4.12.2",
    "axios": "^1.6.0",
    "dotenv": "^16.0.3",
    "js-yaml": "^4.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "nodemon": "^3.0.0"
  }
}
```

**Time**: 5 minutes

#### 2.2.9 Create Local Test Server (for development)

**File**: `server.js` (for local testing)

```javascript
// server.js - Local development server
require('dotenv').config();
const express = require('express');
const { handler } = require('./src/webhook');

const app = express();
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Nutrition Tracker Bot is running' });
});

// Setup webhook
app.get('/setup', async (req, res) => {
  await handler(req, res);
});

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  await handler(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Webhook URL: ${process.env.WEBHOOK_URL}/webhook`);
  console.log(`🔧 Setup webhook: GET ${process.env.WEBHOOK_URL}/setup`);
});
```

**Test locally**:
```bash
# Install dependencies
npm install

# Run local server
npm run dev

# In another terminal, use ngrok to expose localhost
npx ngrok http 3000

# Copy the ngrok URL (e.g., https://abc123.ngrok.io)
# Update .env: WEBHOOK_URL=https://abc123.ngrok.io

# Visit: https://abc123.ngrok.io/setup
# This sets the Telegram webhook

# Test by sending a message to your bot in Telegram
```

**Time**: 15 minutes for local testing

---

---

## Navigation

- [← Previous: Phase 2 Setup](03-phase2-telegram-setup.md)
- [↑ Table of Contents](README.md)
- [Next: Phase 2 Deployment →](05-phase2-telegram-deployment.md)

**Related Sections**:
- [Project Structure Setup](03-phase2-telegram-setup.md#221-create-project-structure)
- [Deployment to Railway](05-phase2-telegram-deployment.md#23-deploy-to-railway-or-vercel)
- [Troubleshooting API Errors](07-operations.md)
