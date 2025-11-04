// src/claude-integration.js
const axios = require('axios');
const config = require('./config');
const usdaApi = require('./usda-api');

/**
 * Claude API Integration for Nutrition Tracking
 *
 * This module provides methods to:
 * 1. Process food logs using Claude API with USDA fallback
 * 2. Process images/screenshots using Claude Vision API
 * 3. Generate daily summaries
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
    this.maxTokens = config.claude.maxTokens || 4096;
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
  }

  /**
   * Process food logging request with Claude API
   * Strategy: Try USDA first for generic foods, fallback to Claude for estimation
   *
   * @param {string} userMessage - User's food description (e.g., "200g chicken breast grilled")
   * @param {string} userId - Telegram user ID (for context/logging)
   * @returns {Promise<Object>} Processed nutrition data with all 24 fields
   */
  async processFoodLog(userMessage, userId) {
    try {
      // Step 1: Try USDA quick lookup for generic foods
      // Check for common generic food keywords
      const genericFoodKeywords = [
        'chicken', 'beef', 'pork', 'lamb', 'turkey', 'salmon', 'tuna', 'cod',
        'rice', 'oats', 'bread', 'pasta', 'potato', 'egg', 'eggs', 'milk',
        'cheese', 'yogurt', 'banana', 'apple', 'orange', 'broccoli', 'spinach',
        'carrot', 'tomato', 'avocado', 'almond', 'walnut', 'cashew'
      ];

      const lowerMessage = userMessage.toLowerCase();
      const isGenericFood = genericFoodKeywords.some(kw => lowerMessage.includes(kw));

      if (isGenericFood) {
        try {
          console.log(`Attempting USDA lookup for: ${userMessage}`);
          const usdaResult = await usdaApi.quickLookup(userMessage);

          if (usdaResult.success) {
            console.log(`✓ USDA lookup successful for: ${userMessage}`);

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
      console.log(`Using Claude API for: ${userMessage}`);

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          max_tokens: this.maxTokens,
          system: SKILL_CONTEXT,
          messages: [
            {
              role: 'user',
              content: `I just ate: ${userMessage}

Please estimate the complete nutrition data and return it in the JSON format specified in your instructions.

Requirements:
- Include ALL 24 required nutrition fields (no nulls)
- Use USDA FoodData Central for base estimates if applicable
- Scale values to the portion size mentioned
- Validate energy calculation: 4×protein + 9×fat + 4×carbs_available + 2×fiber + 2.4×polyols
- Document any assumptions or estimation methods in the "notes" field

Return ONLY the JSON object, wrapped in \`\`\`json code fence.`
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      // Step 3: Extract JSON from Claude's response
      const claudeText = response.data.content[0].text;
      const jsonMatch = claudeText.match(/```json\n([\s\S]*?)\n```/);

      if (jsonMatch) {
        const nutritionData = JSON.parse(jsonMatch[1]);

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
          data: nutritionData
        };
      } else {
        // Claude didn't return properly formatted JSON
        console.error('Claude response missing JSON block:', claudeText);
        return {
          success: false,
          message: 'Could not parse nutrition data from Claude response',
          raw_response: claudeText.substring(0, 500) // Truncate for safety
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
  async processImage(imageBuffer, mimeType) {
    try {
      console.log(`Processing image with Claude Vision API (${mimeType})`);

      const base64Image = imageBuffer.toString('base64');

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          max_tokens: this.maxTokens,
          system: SKILL_CONTEXT,
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
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      // Extract JSON from Claude's response
      const claudeText = response.data.content[0].text;
      const jsonMatch = claudeText.match(/```json\n([\s\S]*?)\n```/);

      if (jsonMatch) {
        const extractedData = JSON.parse(jsonMatch[1]);

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
   * Get health profile targets
   * Useful for calculating remaining macros in the Telegram bot
   *
   * @param {string} dayType - 'rest' or 'training'
   * @returns {Object} Target values for the day
   */
  getTargets(dayType = 'rest') {
    const energyTarget = dayType === 'training'
      ? HEALTH_PROFILE.targets.energy_kcal.training_day_max
      : HEALTH_PROFILE.targets.energy_kcal.rest_day_max;

    return {
      energy_kcal: energyTarget,
      protein_g: HEALTH_PROFILE.targets.protein_g_min,
      fat_g: HEALTH_PROFILE.targets.fat_g_min,
      carbs_g: HEALTH_PROFILE.targets.carbs_g_min,
      fiber_g: HEALTH_PROFILE.targets.fiber_g_min
    };
  }
}

module.exports = new ClaudeIntegration();
