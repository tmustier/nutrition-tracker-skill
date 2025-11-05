// src/usda-api.js
const axios = require('axios');
const config = require('./config');

/**
 * USDA FoodData Central API Integration
 *
 * Provides access to the USDA nutrition database for generic foods.
 * Used as the primary data source before falling back to Claude estimation.
 *
 * API Documentation: https://fdc.nal.usda.gov/api-guide.html
 */

// Constants for nutrition calculations and unit conversions
const ENERGY_TOLERANCE_PERCENT = 0.1; // 10% tolerance for energy validation
const ATWATER_FORMULA_CONSTANTS = {
  PROTEIN_KCAL_PER_G: 4,
  FAT_KCAL_PER_G: 9,
  CARB_KCAL_PER_G: 4,
  FIBER_KCAL_PER_G: 2,
  POLYOLS_KCAL_PER_G: 2.4,
};
const UNIT_CONVERSIONS = {
  OZ_TO_GRAMS: 28.35,
  LB_TO_GRAMS: 453.592,
};
const DEFAULT_SERVING_SIZE_G = 100;
const USDA_BASE_SERVING_SIZE_G = 100;

class UsdaApi {
  constructor() {
    this.baseUrl = config.usda.baseUrl;
    this.apiKey = config.usda.apiKey;
    
    // Rate limiting for USDA API (3600 requests per hour = 60 per minute)
    this.rateLimitRequests = [];
    this.rateLimitWindow = 60 * 1000; // 1 minute
    this.maxRequestsPerMinute = 50; // Conservative limit
  }

  /**
   * Check and enforce rate limiting for USDA API
   * @returns {boolean} True if request is allowed, throws error if rate limited
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
      console.warn(`USDA API rate limit exceeded: ${this.rateLimitRequests.length}/${this.maxRequestsPerMinute} requests per minute`);
      throw new Error(`USDA API rate limit exceeded. Try again in ${resetTime} seconds.`);
    }
    
    // Add current request timestamp
    this.rateLimitRequests.push(now);
    return true;
  }

  /**
   * Search for foods by query string
   * @param {string} query - Search term (e.g., "chicken breast")
   * @param {number} pageSize - Number of results to return (default: 5)
   * @returns {Promise<Array>} Array of food items
   */
  async searchFoods(query, pageSize = 5) {
    try {
      // Check rate limiting before making API call
      this.checkRateLimit();
      
      const response = await axios.get(`${this.baseUrl}/foods/search`, {
        params: {
          api_key: this.apiKey,
          query: query,
          dataType: 'Foundation,SR Legacy', // Most reliable data types
          pageSize: pageSize,
        },
        timeout: 30000 // 30 seconds timeout
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
      // Check rate limiting before making API call
      this.checkRateLimit();
      
      const response = await axios.get(`${this.baseUrl}/food/${fdcId}`, {
        params: {
          api_key: this.apiKey,
        },
        timeout: 30000 // 30 seconds timeout
      });

      return response.data;
    } catch (error) {
      console.error('USDA API detail error:', error.message);
      throw new Error('Failed to get food details from USDA');
    }
  }

  /**
   * Parse USDA nutrition data into our standard 24-field format
   * @param {Object} usdaFood - USDA food object
   * @param {number} grams - Serving size in grams
   * @returns {Object} Standardized nutrition object with all 24 fields
   */
  parseNutrition(usdaFood, grams = 100) {
    const nutrients = {};

    // USDA uses nutrient IDs - map them to our field names
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
      1082: 'fiber_soluble_g',
      1084: 'fiber_insoluble_g',
      1005: 'carbs_total_g',
      1093: 'sodium_mg',
      1092: 'potassium_mg',
      1095: 'zinc_mg',
      1162: 'vitamin_c_mg',
      1089: 'iron_mg',
      1087: 'calcium_mg',
      1090: 'magnesium_mg',
      1100: 'manganese_mg',
      1046: 'iodine_ug'
    };

    // Extract nutrients from USDA data
    if (usdaFood.foodNutrients) {
      usdaFood.foodNutrients.forEach(nutrient => {
        const fieldName = nutrientMapping[nutrient.nutrientId];
        if (fieldName) {
          // Scale to requested serving size (USDA values are per 100g)
          const value = (nutrient.value || 0) * (grams / USDA_BASE_SERVING_SIZE_G);

          // Round appropriately
          if (fieldName === 'energy_kcal') {
            nutrients[fieldName] = Math.round(value);
          } else if (fieldName.endsWith('_mg') || fieldName.endsWith('_ug')) {
            nutrients[fieldName] = Math.round(value);
          } else {
            nutrients[fieldName] = parseFloat(value.toFixed(1));
          }
        }
      });
    }

    // Fill in missing required fields with 0 (following "never use null" principle)
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
    // carbs_available = carbs_total - fiber - polyols
    if (nutrients.carbs_total_g > 0) {
      nutrients.carbs_available_g = parseFloat(
        Math.max(0, nutrients.carbs_total_g - nutrients.fiber_total_g - nutrients.polyols_g).toFixed(1)
      );
    }

    // Validate energy using Atwater formula: 4P + 9F + 4C + 2Fiber + 2.4Polyols
    const calculatedEnergy = Math.round(
      ATWATER_FORMULA_CONSTANTS.PROTEIN_KCAL_PER_G * nutrients.protein_g +
      ATWATER_FORMULA_CONSTANTS.FAT_KCAL_PER_G * nutrients.fat_g +
      ATWATER_FORMULA_CONSTANTS.CARB_KCAL_PER_G * nutrients.carbs_available_g +
      ATWATER_FORMULA_CONSTANTS.FIBER_KCAL_PER_G * nutrients.fiber_total_g +
      ATWATER_FORMULA_CONSTANTS.POLYOLS_KCAL_PER_G * nutrients.polyols_g
    );

    // Use calculated energy if USDA energy is missing or differs by the tolerance threshold
    if (!nutrients.energy_kcal || Math.abs(nutrients.energy_kcal - calculatedEnergy) / calculatedEnergy > ENERGY_TOLERANCE_PERCENT) {
      console.log(`Adjusting energy: USDA=${nutrients.energy_kcal}, calculated=${calculatedEnergy} (threshold: ${ENERGY_TOLERANCE_PERCENT * 100}%)`);
      nutrients.energy_kcal = calculatedEnergy;
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
    let grams = DEFAULT_SERVING_SIZE_G; // Default serving size

    if (quantityMatch) {
      const amount = parseInt(quantityMatch[1]);
      const unit = quantityMatch[2].toLowerCase();

      // Validate quantity range to prevent system errors
      const MIN_QUANTITY = 1;
      const MAX_QUANTITY = 10000;
      
      if (isNaN(amount) || amount < MIN_QUANTITY || amount > MAX_QUANTITY) {
        throw new Error(`Invalid quantity: ${amount}. Must be between ${MIN_QUANTITY} and ${MAX_QUANTITY}.`);
      }

      // Convert to grams using standard conversion factors
      if (unit.startsWith('oz')) {
        grams = amount * UNIT_CONVERSIONS.OZ_TO_GRAMS;
      } else if (unit.startsWith('lb') || unit.startsWith('pound')) {
        grams = amount * UNIT_CONVERSIONS.LB_TO_GRAMS;
      } else {
        grams = amount;
      }

      // Additional validation for converted grams
      const MAX_GRAMS = 50000; // 50kg maximum reasonable serving size
      if (grams > MAX_GRAMS) {
        throw new Error(`Converted quantity too large: ${grams}g. Maximum allowed is ${MAX_GRAMS}g.`);
      }
    }

    // Clean up query for search (remove quantity/unit)
    let cleanQuery = query;
    if (quantityMatch) {
      cleanQuery = query.replace(quantityMatch[0], '').trim();
    }

    // Search for food
    const results = await this.searchFoods(cleanQuery, 5);

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
