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
          const value = (nutrient.value || 0) * (grams / 100);

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
      4 * nutrients.protein_g +
      9 * nutrients.fat_g +
      4 * nutrients.carbs_available_g +
      2 * nutrients.fiber_total_g +
      2.4 * nutrients.polyols_g
    );

    // Use calculated energy if USDA energy is missing or differs by >10%
    if (!nutrients.energy_kcal || Math.abs(nutrients.energy_kcal - calculatedEnergy) / calculatedEnergy > 0.1) {
      console.log(`Adjusting energy: USDA=${nutrients.energy_kcal}, calculated=${calculatedEnergy}`);
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
