// src/usda-api.js
const axios = require('axios');
const config = require('./config');
const CircuitBreaker = require('./circuit-breaker');

/**
 * USDA FoodData Central API Integration
 *
 * Provides access to the USDA nutrition database for generic foods.
 * Used as the primary data source before falling back to Claude estimation.
 *
 * Features:
 * - Exponential backoff retry logic for transient failures
 * - Circuit breaker pattern for sustained failure protection
 * - Rate limiting to stay within API quotas
 * - Comprehensive error handling and logging
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

    // Circuit breaker initialization
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,           // Open after 5 failures
      failureWindowMs: 60000,        // within 60 seconds
      recoveryTimeoutMs: 120000,     // Wait 2 minutes before testing recovery
      successThreshold: 2,           // Require 2 successes to close circuit
      name: 'USDA-API',              // Name for logging
    });

    console.log('✅ USDA API initialized with circuit breaker and retry protection');
  }

  // ============================================================================
  // CIRCUIT BREAKER INTEGRATION
  // ============================================================================

  /**
   * Execute an API call with circuit breaker protection
   * Wraps the actual API call and handles circuit breaker logic
   */
  async executeWithCircuitBreaker(apiCall) {
    // Check if circuit is OPEN
    if (this.circuitBreaker.isOpen()) {
      this.circuitBreaker.recordRejection();

      const metrics = this.circuitBreaker.getMetrics();
      const error = new Error(
        `USDA API circuit breaker is OPEN - service temporarily unavailable. ` +
        `Recovery testing in ${metrics.nextStateChange?.inSeconds || 0} seconds.`
      );
      error.circuitBreakerOpen = true;
      error.metrics = metrics;

      console.warn('[USDA-API] Request rejected - circuit breaker is OPEN');
      throw error;
    }

    try {
      // Execute the API call
      const result = await apiCall();

      // Record success
      this.circuitBreaker.recordSuccess();

      return result;
    } catch (error) {
      // Record failure
      this.circuitBreaker.recordFailure(error);

      // Log circuit status after failure
      const state = this.circuitBreaker.getState();
      if (state === 'OPEN') {
        console.error('[USDA-API] Circuit breaker opened due to sustained failures');
        console.log(this.circuitBreaker.getStatusSummary());
      }

      throw error;
    }
  }

  /**
   * Get circuit breaker status and metrics
   */
  getCircuitBreakerStatus() {
    return this.circuitBreaker.getMetrics();
  }

  /**
   * Get human-readable circuit breaker status summary
   */
  getCircuitBreakerSummary() {
    return this.circuitBreaker.getStatusSummary();
  }

  /**
   * Manually reset circuit breaker (use with caution)
   */
  resetCircuitBreaker() {
    this.circuitBreaker.reset();
  }

  // ============================================================================
  // RETRY LOGIC WITH EXPONENTIAL BACKOFF
  // ============================================================================

  /**
   * Determines if an error should be retried based on error type
   */
  isRetryableError(error) {
    // Network-level errors (DNS, connection, timeout issues)
    const retryableNetworkCodes = [
      'ECONNRESET',   // Connection reset by peer
      'ETIMEDOUT',    // System-level socket timeout
      'ECONNABORTED', // Axios request timeout (most common timeout case)
      'ENOTFOUND',    // DNS lookup failed
      'ECONNREFUSED', // Connection refused by server
      'ENETUNREACH',  // Network unreachable
      'EAI_AGAIN',    // DNS temporary failure
    ];

    // Check for network errors
    if (error.code && retryableNetworkCodes.includes(error.code)) {
      console.log(`Retryable network error detected: ${error.code}`);
      return true;
    }

    // Check for HTTP 5xx server errors (server-side issues)
    if (error.response?.status) {
      const status = error.response.status;

      // 5xx errors are retryable (server errors)
      if (status >= 500 && status < 600) {
        console.log(`Retryable HTTP error detected: ${status}`);
        return true;
      }

      // 4xx errors are NOT retryable (client errors)
      if (status >= 400 && status < 500) {
        console.log(`Non-retryable HTTP error: ${status} (client error)`);
        return false;
      }
    }

    // All other errors are not retryable
    return false;
  }

  /**
   * Calculate backoff delay with exponential growth and jitter
   * Formula: baseDelay * (2 ^ attempt) * (1 + jitter)
   */
  calculateBackoffDelay(attempt) {
    const baseDelayMs = 1000; // 1 second base delay
    const jitterPercent = 0.2; // ±20% jitter

    // Exponential backoff: 1s, 2s, 4s
    const exponentialDelay = baseDelayMs * Math.pow(2, attempt);

    // Add random jitter to prevent thundering herd
    const jitterMultiplier = 1 + (Math.random() * 2 - 1) * jitterPercent;
    const delayWithJitter = exponentialDelay * jitterMultiplier;

    return Math.round(delayWithJitter);
  }

  /**
   * Retry an async operation with exponential backoff
   * Only retries on network errors and 5xx HTTP errors
   */
  async retryWithBackoff(fn, operationName = 'operation') {
    const maxRetries = 2; // 2 retries = 3 total attempts
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`[Retry ${attempt}/${maxRetries}] Retrying ${operationName}...`);
        }

        const result = await fn();

        if (attempt > 0) {
          console.log(`[Retry ${attempt}/${maxRetries}] ${operationName} succeeded after retry`);
        }

        return result;

      } catch (error) {
        lastError = error;

        // Check if this error is retryable
        const isRetryable = this.isRetryableError(error);

        const errorDetails = {
          attempt: attempt + 1,
          total: maxRetries + 1,
          code: error.code,
          status: error.response?.status,
          message: error.message,
          retryable: isRetryable,
        };

        console.error(`[Attempt ${attempt + 1}/${maxRetries + 1}] ${operationName} failed:`, errorDetails);

        // If not retryable or out of retries, throw immediately
        if (!isRetryable) {
          console.error(`${operationName} failed with non-retryable error. Not retrying.`);
          throw error;
        }

        if (attempt >= maxRetries) {
          console.error(`${operationName} failed after ${maxRetries + 1} attempts. Giving up.`);
          throw error;
        }

        // Calculate backoff delay with jitter
        const delayMs = this.calculateBackoffDelay(attempt);
        console.log(`[Retry ${attempt + 1}/${maxRetries}] Waiting ${delayMs}ms before retry...`);

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    throw lastError;
  }

  // ============================================================================
  // RATE LIMITING
  // ============================================================================

  /**
   * Check and enforce rate limiting for USDA API
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

  // ============================================================================
  // API METHODS WITH PROTECTION
  // ============================================================================

  /**
   * Search for foods by query string
   * Protected by circuit breaker and retry logic
   */
  async searchFoods(query, pageSize = 5) {
    return this.executeWithCircuitBreaker(async () => {
      try {
        // Check rate limiting before making API call
        this.checkRateLimit();

        // Wrap in retry logic
        return await this.retryWithBackoff(
          async () => {
            const response = await axios.get(`${this.baseUrl}/foods/search`, {
              params: {
                api_key: this.apiKey,
                query: query,
                dataType: 'Foundation,SR Legacy',
                pageSize: pageSize,
              },
              timeout: 30000 // 30 seconds timeout
            });

            return response.data.foods || [];
          },
          'USDA food search'
        );
      } catch (error) {
        console.error('USDA API search error:', error.message);
        throw new Error('Failed to search USDA database');
      }
    });
  }

  /**
   * Get detailed nutrition information for a specific food by FDC ID
   * Protected by circuit breaker and retry logic
   */
  async getFoodDetails(fdcId) {
    return this.executeWithCircuitBreaker(async () => {
      try {
        // Check rate limiting before making API call
        this.checkRateLimit();

        // Wrap in retry logic
        return await this.retryWithBackoff(
          async () => {
            const response = await axios.get(`${this.baseUrl}/food/${fdcId}`, {
              params: {
                api_key: this.apiKey,
              },
              timeout: 30000 // 30 seconds timeout
            });

            // Validate response is actual food data, not HTML error page
            if (!response.data || typeof response.data !== 'object' || !response.data.foodNutrients) {
              throw new Error('Invalid response from USDA API - missing foodNutrients');
            }

            return response.data;
          },
          `USDA food details (FDC ID: ${fdcId})`
        );
      } catch (error) {
        console.error('USDA API detail error:', error.message);
        throw new Error('Failed to get food details from USDA');
      }
    });
  }

  // ============================================================================
  // NUTRITION PARSING (unchanged)
  // ============================================================================

  /**
   * Parse USDA nutrition data into our standard 24-field format
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
        // Handle both old and new API response formats
        const nutrientId = nutrient.nutrientId || nutrient.nutrient?.id;
        const nutrientValue = nutrient.value || nutrient.amount;

        const fieldName = nutrientMapping[nutrientId];
        if (fieldName && nutrientValue !== undefined) {
          // Scale to requested serving size (USDA values are per 100g)
          const value = nutrientValue * (grams / USDA_BASE_SERVING_SIZE_G);

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
    if (nutrients.carbs_total_g > 0) {
      nutrients.carbs_available_g = parseFloat(
        Math.max(0, nutrients.carbs_total_g - nutrients.fiber_total_g - nutrients.polyols_g).toFixed(1)
      );
    }

    // Validate energy using Atwater formula
    const calculatedEnergy = Math.round(
      ATWATER_FORMULA_CONSTANTS.PROTEIN_KCAL_PER_G * nutrients.protein_g +
      ATWATER_FORMULA_CONSTANTS.FAT_KCAL_PER_G * nutrients.fat_g +
      ATWATER_FORMULA_CONSTANTS.CARB_KCAL_PER_G * nutrients.carbs_available_g +
      ATWATER_FORMULA_CONSTANTS.FIBER_KCAL_PER_G * nutrients.fiber_total_g +
      ATWATER_FORMULA_CONSTANTS.POLYOLS_KCAL_PER_G * nutrients.polyols_g
    );

    if (!nutrients.energy_kcal || Math.abs(nutrients.energy_kcal - calculatedEnergy) / calculatedEnergy > ENERGY_TOLERANCE_PERCENT) {
      console.log(`Adjusting energy: USDA=${nutrients.energy_kcal}, calculated=${calculatedEnergy}`);
      nutrients.energy_kcal = calculatedEnergy;
    }

    return nutrients;
  }

  /**
   * Quick lookup: search and return best match with nutrition data
   */
  async quickLookup(query) {
    // Extract quantity and unit if present
    const quantityMatch = query.match(/(\d+)\s*(g|grams?|oz|ounces?|lb|pounds?)/i);
    let grams = DEFAULT_SERVING_SIZE_G;

    if (quantityMatch) {
      const amount = parseInt(quantityMatch[1]);
      const unit = quantityMatch[2].toLowerCase();

      const MIN_QUANTITY = 1;
      const MAX_QUANTITY = 10000;

      if (isNaN(amount) || amount < MIN_QUANTITY || amount > MAX_QUANTITY) {
        throw new Error(`Invalid quantity: ${amount}. Must be between ${MIN_QUANTITY} and ${MAX_QUANTITY}.`);
      }

      // Convert to grams
      if (unit.startsWith('oz')) {
        grams = amount * UNIT_CONVERSIONS.OZ_TO_GRAMS;
      } else if (unit.startsWith('lb') || unit.startsWith('pound')) {
        grams = amount * UNIT_CONVERSIONS.LB_TO_GRAMS;
      } else {
        grams = amount;
      }

      const MAX_GRAMS = 50000;
      if (grams > MAX_GRAMS) {
        throw new Error(`Converted quantity too large: ${grams}g. Maximum allowed is ${MAX_GRAMS}g.`);
      }
    }

    // Clean up query for search
    let cleanQuery = query;
    if (quantityMatch) {
      cleanQuery = query.replace(quantityMatch[0], '').trim();
    }

    try {
      // Search for food
      const results = await this.searchFoods(cleanQuery, 5);

      if (results.length === 0) {
        return {
          success: false,
          message: 'No USDA data found for this food',
        };
      }

      // Get best match
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
    } catch (error) {
      // Handle circuit breaker open
      if (error.circuitBreakerOpen) {
        console.warn('USDA API circuit breaker is open, falling back to Claude');
        return {
          success: false,
          message: 'USDA API temporarily unavailable (circuit breaker open)',
          circuitBreakerOpen: true,
        };
      }

      // Handle other errors
      console.error(`USDA lookup failed: ${error.message}`);
      return {
        success: false,
        message: `USDA API failed: ${error.message}`,
      };
    }
  }
}

// Export both singleton instance and class for testing
const instance = new UsdaApi();
module.exports = instance;
module.exports.UsdaApi = UsdaApi;
