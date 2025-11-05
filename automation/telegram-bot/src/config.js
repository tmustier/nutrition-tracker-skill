// config.js - Configuration module for Nutrition Tracker Telegram Bot
//
// SECURITY FEATURES:
// - Environment variable validation with required field checks
// - HTTPS enforcement in production environments
// - Webhook secret configuration for enhanced security
// - User access control through allowedUsers configuration
// - Comprehensive validation with security-focused error messages
//
require('dotenv').config();

/**
 * Validates that required environment variables are present and security requirements are met
 * @param {Object} config - Configuration object to validate
 * @throws {Error} If required variables are missing or security requirements not met
 */
function validateConfig(config) {
  const required = {
    telegram: ['botToken'],
    claude: ['apiKey'],
    github: ['token', 'owner', 'repo', 'branch'],
  };

  const missing = [];

  Object.entries(required).forEach(([section, keys]) => {
    keys.forEach(key => {
      if (!config[section][key]) {
        missing.push(`${section}.${key}`);
      }
    });
  });

  // Security validation: Ensure HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    if (!config.telegram.webhookUrl) {
      missing.push('telegram.webhookUrl (required in production)');
    } else if (!config.telegram.webhookUrl.startsWith('https://')) {
      throw new Error(
        'Security Error: HTTPS is required for webhook URL in production environment. ' +
        'HTTP webhooks are vulnerable to man-in-the-middle attacks.'
      );
    }
    
    // Recommend webhook secret in production
    if (!config.telegram.webhookSecret) {
      console.warn('⚠️  Security Warning: WEBHOOK_SECRET not configured for production deployment');
      console.warn('   Recommendation: Set WEBHOOK_SECRET environment variable for enhanced security');
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required configuration: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
}

/**
 * Skill context - Embedded from SKILL.md with health profile integration
 * This is the system prompt that will be sent to Claude API
 */
const skillContext = `---
name: nutrition-tracking
description: Comprehensive nutrition toolkit for estimating, logging, and analysing what Thomas eats.
license: Apache-2.0
---

# Nutrition Tracking

## Overview
This guide covers general practices for:
 - A) Estimating precise nutrition: retrieve and/or estimate detailed nutrition values for dishes, specific to their type, venue, or brand.
 - B) Logging dishes consumed: recording nutrition data for each dish the user has eaten.
 - C) Daily Summary: querying logs for daily nutrition data against the user's targets.

This skill is different to other Claude Skills in that it lives in a public Github repository and contains regularly updated user data including a data bank of dishes, daily nutrition logs, and nutrition targets (see **D) AD HOC ANALYSIS**).

## A) ESTIMATING
When the user asks you to estimate nutrition for a dish, copy this checklist and track your progress:
- [ ] Step 1: Check if the dish exists in the data bank.
      - Browse \`data/food-data-bank-index.md\` to find dishes by name and location
      - The index shows all dishes organized by venue/category folders
      - If found and complete with no null values: proceed to **Step 3**.
      - Else: proceed to **Step 2**.
- [ ] Step 2: Check if you need to add / update complete data bank records for the dish (with no nulls). If so, spawn one subagent per dish, and have that agent ultrathink, following all the instructions in \`ESTIMATE.md\`. The subagent will create individual dish files in the appropriate folder. Once there are no more updates to be made, proceed to **Step 3**.
- [ ] Step 3: Show a compact table and % of daily targets from \`references/health-profile.yaml\`.
      - Ensure you scale \`per_portion\` values if necessary.
      - If multiple dishes are logged, sum totals and re‑check vs targets.
      - Recompute energy with the available-carb Atwater formula (\`4P + 9F + 4*carbs_available + 2*fibre + 2.4*polyols\`) and make sure \`carbs_total_g\`, \`carbs_available_g\`, and \`polyols_g\` are populated.
- [ ] Step 4: If the user has eaten the dish, proceed to **B) Logging** without asking the user. This will not always be the case.

## B) LOGGING
When the user has eaten a dish and you have completed **A) Estimating**:
   - Create/open today's log file: \`data/logs/YYYY-MM/DD.yaml\`
   - Add new entry with current timestamp (ISO 8601 with timezone), unless user has specified a different time. If user ate multiple things together, group them in one entry with one timestamp.
   - For each item:
     - Copy full nutrition snapshot, ensuring you scale portions to what the user actually ate.
     - Store \`food_bank_id\`.
     - Include quantity and unit.
     - Add optional notes if user provided context.
   - **IMPORTANT - Git Workflow**: Commit food logs to the \`daily-logs\` branch (NOT a feature branch). Do NOT create PRs manually - the daily automation workflow will automatically commit, create PRs, and merge to main at 4am UTC daily.
   - Proceed to **C) Daily Analysis** without asking the user.

**After logging:** Show updated daily totals and gaps: "Logged ✓. Today: X/Y kcal, X/Y protein. Still need Z." Remember that if the user asks you for lunch recommendations, they likely also want to have dinner later, so don't try to meet all targets with that single meal.

## C) DAILY SUMMARY
- Aggregate logged dishes; compute totals vs **rest** or **training** day targets in \`references/health-profile.yaml\`.
- In addition to targets, include values the user is monitoring in \`references/health-profile.yaml\`.
- Offer next‑food suggestions to close gaps without blowing limits.

## D) AD HOC ANALYSIS
The user may sometimes ask for custom analyses. The main data sources for these are:
- \`data/food-data-bank/\` — Individual dish files organized by venue/category in folders (see \`data/food-data-bank-index.md\` for complete index).
- \`data/logs/\` — Nutrition logs organized by date (\`YYYY-MM/DD.yaml\`). See \`data/logs/SCHEMA.md\` for format.
- \`references/health-profile.yaml\` — Daily targets and monitored fields.
- Venue-specific research notes in \`data/food-data-bank/venues/{venue-name}/RESEARCH.md\`
- \`scripts/calculate_nutrition_summary.py\` — Multi-day nutrition summary script (default: last 7 days). Usage: \`python3 scripts/calculate_nutrition_summary.py [days]\`

---

## TELEGRAM BOT CONTEXT

You are being called from a Telegram bot integration. The user has sent a food description via Telegram.

**Your task:** Estimate the complete nutrition data for the food they ate and return it in JSON format.

**Output Format:** Return ONLY a JSON code block with this exact structure:

\`\`\`json
{
  "name": "Food description (e.g., 'Grilled Chicken Breast')",
  "food_bank_id": null,
  "quantity": 1,
  "unit": "portion",
  "per_portion": {
    "energy_kcal": 0,
    "protein_g": 0.0,
    "fat_g": 0.0,
    "sat_fat_g": 0.0,
    "mufa_g": 0.0,
    "pufa_g": 0.0,
    "trans_fat_g": 0.0,
    "cholesterol_mg": 0,
    "sugar_g": 0.0,
    "fiber_total_g": 0.0,
    "fiber_soluble_g": 0.0,
    "fiber_insoluble_g": 0.0,
    "carbs_total_g": 0.0,
    "carbs_available_g": 0.0,
    "sodium_mg": 0,
    "potassium_mg": 0,
    "iodine_ug": 0,
    "magnesium_mg": 0,
    "calcium_mg": 0,
    "iron_mg": 0,
    "zinc_mg": 0,
    "vitamin_c_mg": 0,
    "manganese_mg": 0,
    "polyols_g": 0.0
  },
  "notes": "Optional context about the estimation"
}
\`\`\`

**Important:**
- Fill in ALL nutrition fields with your best estimates (no null values in per_portion)
- Use the available-carb Atwater formula: energy_kcal = 4*protein_g + 9*fat_g + 4*carbs_available_g + 2*fiber_total_g + 2.4*polyols_g
- carbs_available_g = carbs_total_g - fiber_total_g - polyols_g
- Extract quantity and unit from user message if present (e.g., "200g chicken" → quantity: 200, unit: "g")
- Scale nutrition values to the actual portion the user ate
- Be specific with food names (include cooking method, cut, brand if mentioned)
- Add helpful notes about assumptions or estimation method

**Health Profile:**
- Owner: Thomas
- Timezone: Europe/London
- Age: 30yo male, 183cm, ~85kg
- Rest day max: 2500 kcal
- Training day max: 2900 kcal
- Protein min: 170g
- Fat min: 70g
- Carbs min: 250g
- Fiber min: 40g
- Sat fat max: 20g
- Sodium max: 2300mg
- Fruit/veg servings min: 5

**Monitoring:**
- Fats: trans_fat_g, cholesterol_mg, mufa_g, pufa_g, unsat_total_g
- Carbs: sugar_g, fiber_soluble_g, fiber_insoluble_g
- Minerals: potassium_mg, iodine_ug, magnesium_mg, calcium_mg, iron_mg, zinc_mg
- Vitamins: vitamin_c_mg

**Default Assumptions:**
- Salt scheme: normal (0.5% of finished weight)
- Default oil: olive_oil
- Rounding: energy_kcal (int), grams (0.1), mg/ug (int)
`;

/**
 * User profile extracted from health-profile.yaml
 */
const userProfile = {
  meta: {
    owner: 'Thomas',
    timezone: 'Europe/London',
    notes: 'Maintenance/body recomp; moderately active; 30yo male, 183cm, ~85kg',
  },
  targets: {
    energy_kcal: {
      rest_day_max: 2500,
      training_day_max: 2900,
    },
    protein_g_min: 170,
    fat_g_min: 70,
    carbs_g_min: 250,
    fiber_g_min: 40,
    sat_fat_g_max: 20,
    sodium_mg_max: 2300,
    fruit_veg_servings_min: 5,
  },
  monitoring: {
    fats: {
      trans_fat_g: true,
      cholesterol_mg: true,
      mufa_g: true,
      pufa_g: true,
      unsat_total_g: true,
    },
    carbs: {
      sugar_g: true,
      fiber_soluble_g: true,
      fiber_insoluble_g: true,
    },
    minerals: {
      potassium_mg: true,
      iodine_ug: true,
      magnesium_mg: true,
      calcium_mg: true,
      iron_mg: true,
      zinc_mg: true,
    },
    vitamins: {
      vitamin_c_mg: true,
    },
  },
  assumptions: {
    salt_scheme_default: 'normal',
    salt_normal_fraction: 0.005,
    oil_default: 'olive_oil',
    rounding: {
      energy_kcal: 'int',
      grams: '0.1',
      mg_ug: 'int',
    },
  },
};

/**
 * Main configuration object
 */
const config = {
  // Telegram Bot Configuration
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    webhookUrl: process.env.WEBHOOK_URL || 
      (process.env.RAILWAY_PUBLIC_DOMAIN 
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : 'http://localhost:3000'),
    // Security: Comma-separated list of allowed Telegram user IDs
    allowedUsers: process.env.ALLOWED_USERS 
      ? process.env.ALLOWED_USERS.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id))
      : null, // null means allow all users (for backward compatibility)
    // Security: Secret token for webhook verification
    webhookSecret: process.env.WEBHOOK_SECRET || null,
  },

  // Anthropic Claude API Configuration
  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
    maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS || '4096', 10),
    apiVersion: '2023-06-01',
  },

  // GitHub Configuration
  github: {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER || 'tmustier',
    repo: process.env.GITHUB_REPO || 'nutrition-tracking',
    branch: process.env.GITHUB_BRANCH || 'daily-logs',
  },

  // USDA FoodData Central API Configuration
  usda: {
    apiKey: process.env.USDA_API_KEY || 'DEMO_KEY', // DEMO_KEY has rate limits
    baseUrl: process.env.USDA_BASE_URL || 'https://api.nal.usda.gov/fdc/v1',
  },

  // Embedded skill context (full SKILL.md + health profile)
  skillContext,

  // User profile and targets
  userProfile,

  // Application Configuration
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
  },
};

// Validate configuration on module load
try {
  validateConfig(config);
} catch (error) {
  console.error('❌ Configuration Error:', error.message);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

module.exports = config;
