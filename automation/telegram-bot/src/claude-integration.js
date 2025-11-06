// src/claude-integration.js
const axios = require('axios');
const config = require('./config');
const usdaApi = require('./usda-api');

/**
 * Sanitizes user input to prevent prompt injection attacks
 *
 * SECURITY CRITICAL: This function MUST be called on ALL user input before:
 * 1. Sending to Claude API
 * 2. Storing in conversation history (if implemented)
 * 3. Including in any prompt or context
 *
 * IMPORTANT: Sanitize ONCE at the entry point, then use the sanitized version
 * throughout the request lifecycle. Never store both sanitized and unsanitized
 * versions as this defeats the security measure.
 *
 * @param {string} input - Raw user input
 * @returns {string} Sanitized input safe for Claude prompts
 */
const sanitizePromptInput = (input) => {
  if (typeof input !== 'string') {
    return String(input);
  }

  // Define patterns that could be used for prompt injection
  const dangerous = [
    /ignore (previous|all|earlier) (instructions|directions|commands)/gi,
    /system:/gi,
    /assistant:/gi,
    // Removed /```json/gi - this breaks legitimate JSON code fences that Claude uses
    // Users saying "```json" in messages is not a security risk
    /<\/?[^>]+(>|$)/gi, // HTML tags
    /\[INST\]/gi, // Instruction markers
    /\[\/INST\]/gi,
    /human:/gi,
    /ai:/gi,
  ];

  let sanitized = input;
  dangerous.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Remove control characters that could be used for injection
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Truncate to prevent context stuffing attacks
  return sanitized.substring(0, 1000);
};

/**
 * Claude API Integration for Nutrition Tracking
 *
 * This module provides methods to:
 * 1. Process food logs using Claude API with USDA fallback
 * 2. Process images/screenshots using Claude Vision API
 * 3. Generate daily summaries
 *
 * SECURITY FEATURES:
 * - Prompt injection protection: User input is sanitized before being sent to Claude API
 * - Input validation: All user inputs are validated and truncated to prevent abuse
 * - Rate limiting: Handled at the webhook level to prevent API abuse
 * - Error handling: Detailed errors are logged but not exposed to users
 *
 * The skill context is embedded from SKILL.md to ensure Claude understands
 * the complete nutrition tracking workflow.
 */

// Embedded skill context from /Users/thomasmustier/nutrition-tracking/SKILL.md
const SKILL_CONTEXT = `# Nutrition Tracking

## Overview
This guide covers general practices for:
 - A) Estimating precise nutrition: retrieve and/or estimate detailed nutrition values for dishes, specific to their type, venue, or brand.
 - B) Logging dishes consumed: recording nutrition data for each dish the user has eaten.
 - C) Daily Summary: querying logs for daily nutrition data against the user's targets.

## A) ESTIMATING
When the user asks you to estimate nutrition for a dish:
- Check if you need to estimate complete nutrition data (with no nulls)
- Show a compact table and % of daily targets from health profile
- Ensure you scale per_portion values if necessary
- Recompute energy with the available-carb Atwater formula (4P + 9F + 4*carbs_available + 2*fiber + 2.4*polyols)
- Return structured JSON with all 24 required nutrition fields

## Required Nutrition Fields (ALL must be present, NO nulls):
- energy_kcal (integer)
- protein_g, fat_g, sat_fat_g, mufa_g, pufa_g, trans_fat_g (0.1g precision)
- cholesterol_mg (integer)
- sugar_g, fiber_total_g, fiber_soluble_g, fiber_insoluble_g (0.1g precision)
- carbs_total_g, carbs_available_g (0.1g precision)
- polyols_g (0.0 if none)
- sodium_mg, potassium_mg, iodine_ug (integer)
- magnesium_mg, calcium_mg, iron_mg, zinc_mg, vitamin_c_mg, manganese_mg (integer or 0.1g precision)

## Estimation Philosophy:
- NEVER use null - always estimate with documented confidence
- 0 = TRUE ZERO (scientifically impossible, e.g., cholesterol in plants)
- All other values = actual measurement or estimate
- Use USDA FoodData Central for closest match, scale to portion
- Validate energy: 4P + 9F + 4C_avail + 2fiber + 2.4polyols (tolerance ±5-8%)

## UK vs US Labels:
- UK/EU labels report available carbs → use directly for carbs_available_g
- US labels report total carbs → subtract fiber and polyols to get available
- carbs_total_g = carbs_available_g + fiber_total_g + polyols_g

## Conversation Handling:
When this is a multi-turn conversation (indicated by conversation history):
- Handle follow-up questions: If the user is asking for clarification, corrections, or adjustments to previous estimates, provide a conversational response
- Handle clarifications/corrections: If the user provides additional details (e.g., "actually it was 200g not 150g"), recalculate and provide updated estimates
- Response types:
  - Return JSON when: Initial nutrition estimation request, or when user explicitly asks for final/complete data
  - Return conversational text when: User is asking questions, seeking clarification, making corrections, or discussing options
- When returning conversational text (no JSON), still be helpful and informative about nutrition, but indicate this is an intermediate response

## Response Format:
Return JSON in the following structure:
\`\`\`json
{
  "name": "Dish Name",
  "food_bank_id": null,
  "quantity": 1,
  "unit": "portion",
  "per_portion": {
    "energy_kcal": 450,
    "protein_g": 25.0,
    "fat_g": 15.0,
    "sat_fat_g": 5.0,
    "mufa_g": 7.0,
    "pufa_g": 2.5,
    "trans_fat_g": 0.0,
    "cholesterol_mg": 75,
    "sugar_g": 5.0,
    "fiber_total_g": 3.0,
    "fiber_soluble_g": 1.0,
    "fiber_insoluble_g": 2.0,
    "carbs_total_g": 45.0,
    "carbs_available_g": 42.0,
    "sodium_mg": 500,
    "potassium_mg": 350,
    "iodine_ug": 10,
    "magnesium_mg": 50,
    "calcium_mg": 100,
    "iron_mg": 2,
    "zinc_mg": 3,
    "vitamin_c_mg": 15,
    "manganese_mg": 0.5,
    "polyols_g": 0.0
  },
  "notes": "Optional preparation details or source notes"
}
\`\`\``;

// Health profile targets from /Users/thomasmustier/nutrition-tracking/references/health-profile.yaml
const HEALTH_PROFILE = {
  meta: {
    owner: "Thomas",
    timezone: "Europe/London",
    notes: "Maintenance/body recomp; moderately active; 30yo male, 183cm, ~85kg"
  },
  targets: {
    energy_kcal: {
      rest_day_max: 2500,
      training_day_max: 2900
    },
    protein_g_min: 170,
    fat_g_min: 70,
    carbs_g_min: 250,
    fiber_g_min: 40,
    sat_fat_g_max: 20,
    sodium_mg_max: 2300,
    fruit_veg_servings_min: 5
  },
  monitoring: {
    fats: {
      trans_fat_g: true,
      cholesterol_mg: true,
      mufa_g: true,
      pufa_g: true
    },
    carbs: {
      sugar_g: true,
      fiber_soluble_g: true,
      fiber_insoluble_g: true
    },
    minerals: {
      potassium_mg: true,
      iodine_ug: true,
      magnesium_mg: true,
      calcium_mg: true,
      iron_mg: true,
      zinc_mg: true
    },
    vitamins: {
      vitamin_c_mg: true
    }
  }
};

class ClaudeIntegration {
  constructor() {
    this.apiKey = config.claude.apiKey;
    this.model = config.claude.model || 'claude-sonnet-4-20250514';
    this.maxTokens = config.claude.maxTokens || 16000;
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
    this.extendedThinking = config.claude.extendedThinking || { enabled: false, budgetTokens: 10000 };

    // Rate limiting for Claude API (50 requests per minute)
    this.rateLimitRequests = [];
    this.rateLimitWindow = 60 * 1000; // 1 minute
    this.maxRequestsPerMinute = 50;

    // ProfileManager for per-user health profiles (injected via setProfileManager)
    this.profileManager = null;
  }

  /**
   * Set ProfileManager instance (dependency injection)
   * MUST be called before using processFoodLog or getTargets with userId
   * @param {ProfileManager} profileManager - ProfileManager instance
   */
  setProfileManager(profileManager) {
    this.profileManager = profileManager;
    console.log('[ClaudeIntegration] ProfileManager injected - per-user profiles enabled');
  }

  /**
   * Build skill context dynamically from user profile
   * @private
   * @param {Object} profile - Health profile object
   * @returns {string} Skill context string with user-specific targets
   */
  _buildSkillContext(profile) {
    const t = profile.targets;
    const m = profile.meta;

    return `# Nutrition Tracking

## Overview
This guide covers general practices for:
 - A) Estimating precise nutrition from mobile photos or text descriptions
 - B) Checking day totals and providing macros-based meal suggestions

Below you'll find step-by-step workflows, field definitions, and key nutrient targets.

---

## Workflow

### A) Mobile Photo or Text Estimation

1. **Receive** – A photo or text description from the user (e.g., "200g chicken breast, roasted sweet potato").
2. **Identify** – What foods/beverages are present and their approximate quantities (in grams or milliliters).
3. **Estimate** – Use built-in knowledge (USDA SR28, branded databases, or general references) to estimate macros (kcal, protein, fat, carbs) and micronutrients.
4. **Format** – Return JSON with all 24 fields. Be precise; avoid rounding excessively. Include cooking method, portion size, and brand if known.
5. **Context** – If user mentions they just ate or are about to eat, confirm the meal name and log accordingly.

### B) Daily Totals & Suggestions

- [ ] Step 1: Confirm a date if the user says "today" or references a different day.
- [ ] Step 2: Pull the logged items from the Git repository (\`data/logs/YYYY-MM/DD.yaml\`). Sum macros across all entries for that day.
- [ ] Step 3: Show a compact table and % of daily targets from \`references/health-profile.yaml\`.
- [ ] Step 4: If user asks for suggestions, recommend remaining macros (e.g., "You need 40g protein, 30g carbs, 500 kcal...").

---

## Daily Targets

**Health Profile:**
- Owner: ${m.owner}
- Timezone: ${m.timezone}
- Notes: ${m.notes}

**Energy & Macros:**
- Rest day max: ${t.energy_kcal.rest_day_max} kcal
- Training day max: ${t.energy_kcal.training_day_max} kcal
- Protein min: ${t.protein_g_min}g
- Fat min: ${t.fat_g_min}g
- Carbs min: ${t.carbs_g_min}g
- Fiber min: ${t.fiber_g_min}g
- Saturated fat max: ${t.sat_fat_g_max}g
- Sodium max: ${t.sodium_mg_max}mg

**Additional Targets:**
- Potassium min: ${t.potassium_mg_min || 3500}mg
- Fruit/veg servings min: ${t.fruit_veg_servings_min || 5}

**Monitoring:**
- Track Na:K ratio, iodine intake, and other micronutrients as specified in profile

---

## Field Definitions (All 24 Fields)

### 1. Identification
- **name**: Descriptive name of the dish or food item
- **per_portion**: Total grams/ml the nutrition data represents

### 2. Macronutrients
- **energy_kcal**: Total kilocalories
- **protein_g**: Protein in grams
- **fat_g**: Total fat in grams
- **carbs_g**: Total carbohydrates in grams

### 3. Fats Breakdown
- **sat_fat_g**: Saturated fat
- **trans_fat_g**: Trans fat
- **cholesterol_mg**: Cholesterol in milligrams
- **mufa_g**: Monounsaturated fatty acids
- **pufa_g**: Polyunsaturated fatty acids
- **unsat_total_g**: Total unsaturated fat

### 4. Carbs & Fiber
- **sugar_g**: Sugars
- **fiber_g**: Dietary fiber
- **fiber_soluble_g**: Soluble fiber
- **fiber_insoluble_g**: Insoluble fiber
- **starch_g**: Starch
- **polyols_g**: Sugar alcohols

### 5. Minerals
- **sodium_mg**: Sodium
- **potassium_mg**: Potassium
- **iodine_ug**: Iodine in micrograms

### 6. Optional
- **notes**: Preparation details, brand, or source notes

---

## Rounding & Assumptions

- **Energy (kcal)**: Round to integer
- **Grams (macros, fiber)**: Round to 0.1g
- **Milligrams/Micrograms**: Round to integer
- **Default salt**: 0.5% by weight (normal scheme)
- **Default oil**: olive_oil

---

## JSON Output Format

\`\`\`json
{
  "name": "Grilled Chicken Breast",
  "per_portion": 200.0,
  "energy_kcal": 330,
  "protein_g": 62.0,
  "fat_g": 7.0,
  "carbs_g": 0.0,
  "sat_fat_g": 2.0,
  "trans_fat_g": 0.0,
  "cholesterol_mg": 165,
  "mufa_g": 2.5,
  "pufa_g": 1.5,
  "unsat_total_g": 4.0,
  "sugar_g": 0.0,
  "fiber_g": 0.0,
  "fiber_soluble_g": 0.0,
  "fiber_insoluble_g": 0.0,
  "starch_g": 0.0,
  "sodium_mg": 145,
  "potassium_mg": 520,
  "iodine_ug": 12,
  "polyols_g": 0.0,
  "notes": "Grilled without oil"
}
\`\`\`

---

## Key Principles

1. **Accuracy**: Use USDA or equivalent databases when possible
2. **Completeness**: Provide all 24 fields, even if some are 0
3. **Context**: Consider cooking methods and preparation
4. **User Intent**: Understand if they're logging a meal or asking for advice
5. **Targets**: Help users meet their ${t.energy_kcal.rest_day_max}-${t.energy_kcal.training_day_max} kcal daily target with proper macro distribution

---

## Repository Context

- **Logs**: \`data/logs/YYYY-MM/DD.yaml\` — Daily nutrition entries with timestamp, items, notes
- **Food Database**: \`data/food-data-bank/\` — Custom foods and branded items for quick lookup
- **References**: \`references/health-profile.yaml\` — Daily targets and monitored fields

---

## Summary

- Aggregate logged dishes; compute totals vs **rest** or **training** day targets in \`references/health-profile.yaml\`.
- For suggestions, recommend meals/snacks that fill the remaining macro needs.
- In addition to targets, include values the user is monitoring in \`references/health-profile.yaml\`.`;
  }

  /**
   * Check and enforce rate limiting for Claude API
   * @returns {boolean} True if request is allowed, false if rate limited
   */
  checkRateLimit() {
    const now = Date.now();
    const cutoff = now - this.rateLimitWindow;
    
    // Remove old requests outside the window
    this.rateLimitRequests = this.rateLimitRequests.filter(timestamp => timestamp > cutoff);
    
    // Check if we've exceeded the limit
    if (this.rateLimitRequests.length >= this.maxRequestsPerMinute) {
      const oldestRequest = Math.min(...this.rateLimitRequests);
      const resetTime = Math.ceil((oldestRequest + this.rateLimitWindow - now) / 1000);
      console.warn(`Claude API rate limit exceeded: ${this.rateLimitRequests.length}/${this.maxRequestsPerMinute} requests per minute`);
      throw new Error(`Claude API rate limit exceeded. Try again in ${resetTime} seconds.`);
    }
    
    // Add current request timestamp
    this.rateLimitRequests.push(now);
    return true;
  }

  /**
   * Process food logging request with Claude API
   * Strategy: Try USDA first for generic foods, fallback to Claude for estimation
   *
   * @param {string} userMessage - User's food description (e.g., "200g chicken breast grilled")
   * @param {string} userId - Telegram user ID (for context/logging)
   * @param {Array<Object>} conversationHistory - Optional array of {role, content} message objects for multi-turn conversations
   * @returns {Promise<Object>} Processed nutrition data with all 24 fields, plus responseText for response type detection
   */
  async processFoodLog(userMessage, userId, conversationHistory = []) {
    try {
      // SECURITY: Sanitize input immediately at entry point to prevent injection attacks
      // This sanitized version is used throughout the request lifecycle
      const sanitizedMessage = sanitizePromptInput(userMessage);

      // Step 0: Load user profile (cached) for dynamic skill context
      const profile = this.profileManager
        ? await this.profileManager.loadProfile(userId)
        : HEALTH_PROFILE; // Fallback to hardcoded profile for backward compatibility

      // Build dynamic skill context with user's targets
      const skillContext = this.profileManager
        ? this._buildSkillContext(profile)
        : SKILL_CONTEXT; // Fallback to hardcoded context

      // Step 1: Try USDA quick lookup for generic foods
      // Check for common generic food keywords
      const genericFoodKeywords = [
        'chicken', 'beef', 'pork', 'lamb', 'turkey', 'salmon', 'tuna', 'cod',
        'rice', 'oats', 'bread', 'pasta', 'potato', 'egg', 'eggs', 'milk',
        'cheese', 'yogurt', 'banana', 'apple', 'orange', 'broccoli', 'spinach',
        'carrot', 'tomato', 'avocado', 'almond', 'walnut', 'cashew'
      ];

      const lowerMessage = sanitizedMessage.toLowerCase();
      // Temporarily disable USDA due to API reliability issues - fallback to Claude for all requests
      const isGenericFood = false; // genericFoodKeywords.some(kw => lowerMessage.includes(kw));

      if (isGenericFood) {
        try {
          console.log(`Attempting USDA lookup for: ${sanitizedMessage}`);
          const usdaResult = await usdaApi.quickLookup(sanitizedMessage);

          if (usdaResult.success) {
            console.log(`✓ USDA lookup successful for: ${sanitizedMessage}`);

            // Transform USDA result to our format
            return {
              success: true,
              source: 'usda',
              data: {
                name: usdaResult.food_name,
                food_bank_id: null,
                quantity: usdaResult.serving_grams,
                unit: 'g',
                per_portion: usdaResult.nutrition,
                notes: `USDA FoodData Central (FDC ID: ${usdaResult.fdc_id})`
              }
            };
          }
        } catch (error) {
          console.log(`USDA lookup failed, falling back to Claude: ${error.message}`);
          // Continue to Claude estimation below
        }
      }

      // Step 2: Use Claude for estimation (either non-generic or USDA failed)
      console.log(`Using Claude API for user ${userId || 'unknown'}: ${sanitizedMessage}`);

      // Check rate limiting before making API call
      this.checkRateLimit();

      // Prepare system prompt based on whether we have conversation history
      let systemPrompt = skillContext;
      let messages = [];

      if (conversationHistory && conversationHistory.length > 0) {
        // Multi-turn conversation mode
        systemPrompt = skillContext + '\n\nThis is a multi-turn conversation. Previous messages are provided in the conversation history. Handle follow-up questions, clarifications, and corrections naturally.';

        // Use the provided conversation history and append the new user message
        messages = [
          ...conversationHistory,
          {
            role: 'user',
            content: sanitizePromptInput(userMessage)
          }
        ];
      } else {
        // Single-turn mode (original behavior)
        messages = [
          {
            role: 'user',
            content: `I just ate: ${sanitizedMessage}

Please estimate the complete nutrition data and return it in the JSON format specified in your instructions.

Requirements:
- Include ALL 24 required nutrition fields (no nulls)
- Use USDA FoodData Central for base estimates if applicable
- Scale values to the portion size mentioned
- Validate energy calculation: 4×protein + 9×fat + 4×carbs_available + 2×fiber + 2.4×polyols
- Document any assumptions or estimation methods in the "notes" field

Return ONLY the JSON object, wrapped in \`\`\`json code fence.`
          }
        ];
      }

      const requestBody = {
        model: this.model,
        max_tokens: this.maxTokens,
        system: systemPrompt,
        messages: messages
      };

      // Add extended thinking if enabled
      if (this.extendedThinking.enabled) {
        requestBody.thinking = {
          type: 'enabled',
          budget_tokens: this.extendedThinking.budgetTokens
        };
      }

      const response = await axios.post(
        this.apiUrl,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          },
          timeout: 120000 // 120 seconds timeout (extended thinking can take longer)
        }
      );

      // Step 3: Extract JSON from Claude's response
      // With extended thinking, response may have multiple content blocks (thinking + text)
      // Find the text block (skip thinking blocks)
      const textBlock = response.data.content.find(block => block.type === 'text');
      if (!textBlock || !textBlock.text) {
        console.error('No text content in Claude response:', JSON.stringify(response.data.content));
        throw new Error('No text content in Claude response');
      }

      const claudeText = textBlock.text;
      const jsonMatch = claudeText.match(/```json\n([\s\S]*?)\n```/);

      if (jsonMatch) {
        // Validate and parse JSON safely
        let nutritionData;
        try {
          nutritionData = JSON.parse(jsonMatch[1]);
        } catch (parseError) {
          console.error('JSON parsing error from Claude response:', parseError.message);
          return {
            success: false,
            message: 'Invalid JSON format in Claude response',
            error: parseError.message,
            responseText: claudeText
          };
        }

        // Comprehensive validation of nutrition data structure
        const validationResult = this.validateNutritionData(nutritionData);
        if (!validationResult.valid) {
          console.error('Nutrition data validation failed:', validationResult.errors);
          return {
            success: false,
            message: 'Invalid nutrition data structure from Claude',
            errors: validationResult.errors,
            responseText: claudeText
          };
        }

        // Validate that all required fields are present
        const requiredFields = [
          'energy_kcal', 'protein_g', 'fat_g', 'sat_fat_g', 'mufa_g', 'pufa_g',
          'trans_fat_g', 'cholesterol_mg', 'sugar_g', 'fiber_total_g',
          'fiber_soluble_g', 'fiber_insoluble_g', 'carbs_total_g',
          'carbs_available_g', 'sodium_mg', 'potassium_mg', 'iodine_ug',
          'magnesium_mg', 'calcium_mg', 'iron_mg', 'zinc_mg', 'vitamin_c_mg',
          'manganese_mg', 'polyols_g'
        ];

        const missingFields = requiredFields.filter(
          field => !(field in nutritionData.per_portion)
        );

        if (missingFields.length > 0) {
          console.warn(`Missing nutrition fields: ${missingFields.join(', ')}`);
          // Fill missing fields with 0 as fallback
          missingFields.forEach(field => {
            nutritionData.per_portion[field] = 0;
          });
        }

        return {
          success: true,
          source: 'claude',
          data: nutritionData,
          responseText: claudeText
        };
      } else {
        // Claude didn't return properly formatted JSON - this might be a conversational response
        console.log('Claude response without JSON block (possibly conversational):', claudeText.substring(0, 200));
        return {
          success: false,
          message: 'Could not parse nutrition data from Claude response',
          raw_response: claudeText.substring(0, 500), // Truncate for safety
          responseText: claudeText,
          isConversational: true // Flag to indicate this might be a conversational response
        };
      }
    } catch (error) {
      console.error('Claude API error:', error.response?.data || error.message);

      // Provide more specific error messages
      if (error.response?.status === 401) {
        throw new Error('Invalid Claude API key - check configuration');
      } else if (error.response?.status === 429) {
        throw new Error('Claude API rate limit exceeded - please try again later');
      } else {
        throw new Error(`Failed to process food log with Claude: ${error.message}`);
      }
    }
  }

  /**
   * Process image (screenshot) with Claude Vision API
   * Use cases: nutrition labels, menu screenshots, meal photos
   *
   * @param {Buffer} imageBuffer - Image data
   * @param {string} mimeType - Image MIME type (e.g., 'image/jpeg', 'image/png')
   * @returns {Promise<Object>} Extracted nutrition data with all 24 fields
   */
  async processImage(imageBuffer, mimeType, userId = null) {
    try {
      console.log(`Processing image with Claude Vision API (${mimeType}) for user ${userId || 'unknown'}`);

      // Check rate limiting before making API call
      this.checkRateLimit();

      // Load user profile (cached) for dynamic skill context
      const profile = this.profileManager
        ? await this.profileManager.loadProfile(userId)
        : HEALTH_PROFILE;

      const skillContext = this.profileManager
        ? this._buildSkillContext(profile)
        : SKILL_CONTEXT;

      const base64Image = imageBuffer.toString('base64');

      const requestBody = {
        model: this.model,
        max_tokens: this.maxTokens,
        system: skillContext,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: base64Image
                }
              },
              {
                type: 'text',
                text: `This is a screenshot of a menu item, nutrition label, or food photo.

Please analyze the image and extract/estimate complete nutrition information.

Instructions:
1. If this is a nutrition label: extract all visible values directly
2. If this is a menu item: estimate nutrition based on the description and typical portions
3. If this is a food photo: identify the dish and estimate portions and nutrition

Requirements:
- Include ALL 24 required nutrition fields (no nulls)
- Use visible information from the image as primary source
- Estimate missing fields using USDA data for similar foods
- If multiple items are visible, focus on the main dish or ask which one to analyze
- Validate energy calculation: 4×protein + 9×fat + 4×carbs_available + 2×fiber + 2.4×polyols
- Document extraction method and confidence in the "notes" field

Return ONLY the JSON object, wrapped in \`\`\`json code fence.`
              }
            ]
          }
        ]
      };

      // Add extended thinking if enabled
      if (this.extendedThinking.enabled) {
        requestBody.thinking = {
          type: 'enabled',
          budget_tokens: this.extendedThinking.budgetTokens
        };
      }

      const response = await axios.post(
        this.apiUrl,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          },
          timeout: 120000 // 120 seconds timeout (extended thinking can take longer)
        }
      );

      // Extract JSON from Claude's response
      // With extended thinking, response may have multiple content blocks (thinking + text)
      // Find the text block (skip thinking blocks)
      const textBlock = response.data.content.find(block => block.type === 'text');
      if (!textBlock || !textBlock.text) {
        console.error('No text content in Claude Vision response:', JSON.stringify(response.data.content));
        throw new Error('No text content in Claude Vision response');
      }

      const claudeText = textBlock.text;
      const jsonMatch = claudeText.match(/```json\n([\s\S]*?)\n```/);

      if (jsonMatch) {
        // Validate and parse JSON safely
        let extractedData;
        try {
          extractedData = JSON.parse(jsonMatch[1]);
        } catch (parseError) {
          console.error('JSON parsing error from Claude Vision response:', parseError.message);
          return {
            success: false,
            message: 'Invalid JSON format in Claude Vision response',
            error: parseError.message
          };
        }

        // Comprehensive validation of nutrition data structure
        const validationResult = this.validateNutritionData(extractedData);
        if (!validationResult.valid) {
          console.error('Nutrition data validation failed for image:', validationResult.errors);
          return {
            success: false,
            message: 'Invalid nutrition data structure from Claude Vision',
            errors: validationResult.errors
          };
        }

        // Validate required fields
        const requiredFields = [
          'energy_kcal', 'protein_g', 'fat_g', 'sat_fat_g', 'mufa_g', 'pufa_g',
          'trans_fat_g', 'cholesterol_mg', 'sugar_g', 'fiber_total_g',
          'fiber_soluble_g', 'fiber_insoluble_g', 'carbs_total_g',
          'carbs_available_g', 'sodium_mg', 'potassium_mg', 'iodine_ug',
          'magnesium_mg', 'calcium_mg', 'iron_mg', 'zinc_mg', 'vitamin_c_mg',
          'manganese_mg', 'polyols_g'
        ];

        const missingFields = requiredFields.filter(
          field => !(field in extractedData.per_portion)
        );

        if (missingFields.length > 0) {
          console.warn(`Missing nutrition fields from image: ${missingFields.join(', ')}`);
          // Fill missing fields with 0 as fallback
          missingFields.forEach(field => {
            extractedData.per_portion[field] = 0;
          });
        }

        return {
          success: true,
          source: 'claude_vision',
          data: extractedData
        };
      } else {
        return {
          success: false,
          message: 'Could not extract structured data from image',
          raw_response: claudeText.substring(0, 500)
        };
      }
    } catch (error) {
      console.error('Claude Vision API error:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        throw new Error('Invalid Claude API key - check configuration');
      } else if (error.response?.status === 429) {
        throw new Error('Claude API rate limit exceeded - please try again later');
      } else {
        throw new Error(`Failed to process image with Claude Vision: ${error.message}`);
      }
    }
  }

  /**
   * Get daily summary for a specific date
   * Placeholder for now - can be implemented to read log files and calculate totals
   *
   * @param {string} date - Date in YYYY-MM-DD format (defaults to today)
   * @returns {Promise<string>} Summary message with totals vs targets
   */
  async getDailySummary(date = null) {
    // Use today's date if not specified
    if (!date) {
      const now = new Date();
      date = now.toISOString().split('T')[0];
    }

    // Placeholder implementation
    // In a full implementation, this would:
    // 1. Read the log file for the specified date from data/logs/YYYY-MM/DD.yaml
    // 2. Calculate totals for all entries
    // 3. Compare against health profile targets
    // 4. Generate a formatted summary

    return {
      success: true,
      date: date,
      message: `Daily summary for ${date} - Feature in development!`,
      placeholder_targets: HEALTH_PROFILE.targets
    };
  }

  /**
   * Get health profile targets (NOW ASYNC for per-user profiles)
   * Useful for calculating remaining macros in the Telegram bot
   *
   * @param {string} dayType - 'rest' or 'training'
   * @param {number} userId - Telegram user ID (optional, uses default if null)
   * @returns {Promise<Object>} Target values for the day
   */
  async getTargets(dayType = 'rest', userId = null) {
    // Load user profile (cached)
    const profile = this.profileManager
      ? await this.profileManager.loadProfile(userId)
      : HEALTH_PROFILE; // Fallback to hardcoded profile

    const energyTarget = dayType === 'training'
      ? profile.targets.energy_kcal.training_day_max
      : profile.targets.energy_kcal.rest_day_max;

    return {
      energy_kcal: energyTarget,
      protein_g: profile.targets.protein_g_min,
      fat_g: profile.targets.fat_g_min,
      carbs_g: profile.targets.carbs_g_min,
      fiber_g: profile.targets.fiber_g_min
    };
  }

  /**
   * Comprehensive validation of nutrition data structure from Claude API
   * Prevents malformed JSON from causing crashes or data corruption
   * @param {Object} data - Parsed nutrition data object
   * @returns {Object} Validation result with valid flag and errors array
   */
  validateNutritionData(data) {
    const errors = [];

    // Check basic structure
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      errors.push('Data must be a non-null object');
      return { valid: false, errors };
    }

    // Check required top-level fields
    const requiredTopLevel = ['name', 'per_portion'];
    for (const field of requiredTopLevel) {
      if (!(field in data)) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate name field
    if (data.name && typeof data.name !== 'string') {
      errors.push('Field "name" must be a string');
    }

    // Validate per_portion object
    if (!data.per_portion || typeof data.per_portion !== 'object' || Array.isArray(data.per_portion)) {
      errors.push('Field "per_portion" must be an object');
      return { valid: false, errors };
    }

    // Define all nutrition fields with their validation rules
    const nutritionFields = {
      // Energy (must be non-negative, reasonable range)
      energy_kcal: { type: 'number', min: 0, max: 10000 },
      
      // Macronutrients (must be non-negative)
      protein_g: { type: 'number', min: 0, max: 1000 },
      fat_g: { type: 'number', min: 0, max: 1000 },
      sat_fat_g: { type: 'number', min: 0, max: 1000 },
      mufa_g: { type: 'number', min: 0, max: 1000 },
      pufa_g: { type: 'number', min: 0, max: 1000 },
      trans_fat_g: { type: 'number', min: 0, max: 1000 },
      cholesterol_mg: { type: 'number', min: 0, max: 10000 },
      
      // Carbohydrates
      carbs_total_g: { type: 'number', min: 0, max: 1000 },
      carbs_available_g: { type: 'number', min: 0, max: 1000 },
      sugar_g: { type: 'number', min: 0, max: 1000 },
      fiber_total_g: { type: 'number', min: 0, max: 1000 },
      fiber_soluble_g: { type: 'number', min: 0, max: 1000 },
      fiber_insoluble_g: { type: 'number', min: 0, max: 1000 },
      polyols_g: { type: 'number', min: 0, max: 1000 },
      
      // Minerals (mg)
      sodium_mg: { type: 'number', min: 0, max: 100000 },
      potassium_mg: { type: 'number', min: 0, max: 100000 },
      magnesium_mg: { type: 'number', min: 0, max: 10000 },
      calcium_mg: { type: 'number', min: 0, max: 10000 },
      iron_mg: { type: 'number', min: 0, max: 1000 },
      zinc_mg: { type: 'number', min: 0, max: 1000 },
      manganese_mg: { type: 'number', min: 0, max: 1000 },
      
      // Vitamins and trace elements
      vitamin_c_mg: { type: 'number', min: 0, max: 10000 },
      iodine_ug: { type: 'number', min: 0, max: 10000 }
    };

    // Validate each nutrition field
    for (const [fieldName, rules] of Object.entries(nutritionFields)) {
      if (fieldName in data.per_portion) {
        const value = data.per_portion[fieldName];
        
        // Check type
        if (typeof value !== rules.type) {
          errors.push(`Field "${fieldName}" must be a ${rules.type}, got ${typeof value}`);
          continue;
        }
        
        // Check range for numbers
        if (rules.type === 'number') {
          if (isNaN(value) || !isFinite(value)) {
            errors.push(`Field "${fieldName}" must be a finite number, got ${value}`);
            continue;
          }
          
          if (value < rules.min) {
            errors.push(`Field "${fieldName}" must be >= ${rules.min}, got ${value}`);
          }
          
          if (value > rules.max) {
            errors.push(`Field "${fieldName}" must be <= ${rules.max}, got ${value}`);
          }
        }
      }
    }

    // Validate optional fields if present
    if ('quantity' in data && typeof data.quantity !== 'number') {
      errors.push('Field "quantity" must be a number');
    }
    
    if ('unit' in data && typeof data.unit !== 'string') {
      errors.push('Field "unit" must be a string');
    }
    
    if ('notes' in data && typeof data.notes !== 'string') {
      errors.push('Field "notes" must be a string');
    }

    // Additional business logic validations
    if (data.per_portion.carbs_available_g > data.per_portion.carbs_total_g) {
      errors.push('Available carbs cannot exceed total carbs');
    }

    if (data.per_portion.sat_fat_g + data.per_portion.mufa_g + data.per_portion.pufa_g + data.per_portion.trans_fat_g > data.per_portion.fat_g * 1.1) {
      errors.push('Sum of fat components cannot significantly exceed total fat');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export ClaudeIntegration instance as default export
const claudeIntegration = new ClaudeIntegration();

// Also export sanitizePromptInput for use in other modules
// SECURITY: Use this when storing conversation history or processing user input
claudeIntegration.sanitizePromptInput = sanitizePromptInput;

module.exports = claudeIntegration;
