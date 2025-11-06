// src/github-integration.js
const axios = require('axios');
const yaml = require('js-yaml');
const config = require('./config');

/**
 * GitHub API Integration for Nutrition Tracking
 *
 * This module handles all interactions with the GitHub repository for logging
 * nutrition data. It reads/writes YAML log files using the GitHub Contents API.
 *
 * Key responsibilities:
 * - Generate correct file paths based on current date (data/logs/YYYY-MM/DD.yaml)
 * - Read existing log files or create new ones with proper structure
 * - Append new nutrition entries with atomic updates (using file SHA)
 * - Commit changes to the daily-logs branch (NOT main)
 * - Calculate daily totals from all logged entries
 */
class GitHubIntegration {
  constructor() {
    this.token = config.github.token;
    this.owner = config.github.owner;
    this.repo = config.github.repo;
    this.branch = config.github.branch;
    this.apiUrl = 'https://api.github.com';

    // Retry configuration for race condition handling
    this.MAX_RETRIES = 5;
    this.INITIAL_RETRY_DELAY_MS = 100;
    this.MAX_RETRY_DELAY_MS = 2000;
    
    // Rate limiting for GitHub API (5000 requests per hour = ~83 per minute)
    this.rateLimitRequests = [];
    this.rateLimitWindow = 60 * 1000; // 1 minute
    this.maxRequestsPerMinute = 80; // Conservative limit
    this.BACKOFF_MULTIPLIER = 2;

    // Validate required configuration
    if (!this.token) {
      throw new Error('GitHub token is required (GITHUB_TOKEN env var)');
    }
    if (!this.owner || !this.repo) {
      throw new Error('GitHub owner and repo are required');
    }
  }

  /**
   * Get current date in YYYY-MM-DD format (UTC)
   *
   * Uses UTC to ensure consistency regardless of where the bot is deployed.
   * This aligns with the log file schema which uses ISO 8601 timestamps.
   *
   * @returns {string} Date string in YYYY-MM-DD format
   */
  getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Check and enforce rate limiting for GitHub API
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
      console.warn(`GitHub API rate limit exceeded: ${this.rateLimitRequests.length}/${this.maxRequestsPerMinute} requests per minute`);
      throw new Error(`GitHub API rate limit exceeded. Try again in ${resetTime} seconds.`);
    }
    
    // Add current request timestamp
    this.rateLimitRequests.push(now);
    return true;
  }

  /**
   * Construct the file path for today's log file
   *
   * Format: data/logs/YYYY-MM/DD.yaml
   * Example: data/logs/2025-11/04.yaml
   *
   * @param {string} [date] - Optional date string (YYYY-MM-DD). Defaults to today.
   * @returns {string} Path to log file
   */
  getLogFilePath(date = null) {
    const targetDate = date || this.getCurrentDate();
    const [year, month, day] = targetDate.split('-');
    return `data/logs/${year}-${month}/${day}.yaml`;
  }

  /**
   * Read existing log file from GitHub, or return structure for new file
   *
   * This method attempts to fetch the log file from the daily-logs branch.
   * If the file doesn't exist (404), it returns a new log structure.
   * The returned object includes the file SHA, which is required for atomic updates.
   *
   * @param {string} [date] - Optional date string (YYYY-MM-DD). Defaults to today.
   * @returns {Promise<Object>} Log file data with structure:
   *   {
   *     exists: boolean,      // true if file was found
   *     sha: string|null,     // File SHA for atomic updates (null for new files)
   *     data: Object,         // Parsed YAML content
   *     path: string          // File path in repo
   *   }
   */
  async getOrCreateLogFile(date = null) {
    const path = this.getLogFilePath(date);
    const url = `${this.apiUrl}/repos/${this.owner}/${this.repo}/contents/${path}`;

    try {
      // Check rate limiting before making API call
      this.checkRateLimit();
      
      // Try to read existing file from daily-logs branch
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          ref: this.branch,
        },
        timeout: 30000 // 30 seconds timeout
      });

      // Decode base64 content and parse YAML
      // P1 Security Fix: Use safeLoad for defense in depth against potential YAML injection
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      const logData = yaml.load(content, { schema: yaml.JSON_SCHEMA });

      return {
        exists: true,
        sha: response.data.sha,
        data: logData,
        path: path,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        // File doesn't exist, create new log structure
        const targetDate = date || this.getCurrentDate();
        return {
          exists: false,
          sha: null,
          data: {
            date: targetDate,
            day_type: 'rest', // Default to rest day - can be updated later
            entries: [],
          },
          path: path,
        };
      } else {
        // Other errors (auth, network, etc.)
        console.error('Error reading log file from GitHub:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message,
          path: path,
        });
        throw new Error(`Failed to read log file: ${error.message}`);
      }
    }
  }

  /**
   * Execute a GitHub API operation with exponential backoff retry logic
   *
   * This helper method handles race conditions when multiple requests try to
   * modify the same file simultaneously (409 conflicts). It implements exponential
   * backoff to reduce contention and increase success rate.
   *
   * @private
   * @param {Function} operation - Async function that performs the GitHub API call
   * @param {string} operationName - Human-readable name for logging purposes
   * @returns {Promise<any>} Result from the successful operation
   * @throws {Error} If all retries are exhausted
   */
  async _retryWithBackoff(operation, operationName) {
    let lastError = null;
    let delay = this.INITIAL_RETRY_DELAY_MS;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const result = await operation();
        
        // Log successful retry if it wasn't the first attempt
        if (attempt > 1) {
          console.log(`${operationName} succeeded on attempt ${attempt}/${this.MAX_RETRIES}`);
        }
        
        return result;
      } catch (error) {
        lastError = error;

        // Only retry on 409 conflicts (race conditions)
        if (error.response?.status !== 409) {
          throw error;
        }

        // Don't retry on the last attempt
        if (attempt === this.MAX_RETRIES) {
          console.error(`${operationName} failed after ${this.MAX_RETRIES} attempts due to persistent race condition`);
          break;
        }

        console.warn(`${operationName} conflict (attempt ${attempt}/${this.MAX_RETRIES}), retrying in ${delay}ms`);

        // Wait with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Calculate next delay with exponential backoff and jitter
        delay = Math.min(
          delay * this.BACKOFF_MULTIPLIER + Math.random() * 100, // Add jitter to reduce thundering herd
          this.MAX_RETRY_DELAY_MS
        );
      }
    }

    // All retries exhausted
    throw new Error(`${operationName} failed after ${this.MAX_RETRIES} attempts: ${lastError.message}`);
  }

  /**
   * Append a new nutrition entry to today's log file
   *
   * This method:
   * 1. Fetches the current log file (or creates new structure)
   * 2. Adds a new entry with timestamp, user info, and nutrition data
   * 3. Converts to YAML
   * 4. Commits to GitHub with atomic update (using file SHA)
   * 5. Implements retry logic with exponential backoff for race condition handling
   *
   * All 24 nutrition fields from SCHEMA.md must be present with numeric values.
   * No null values are allowed - use 0 for unmeasured/unknown values.
   *
   * @param {Object} nutritionData - Nutrition data to log. Expected structure:
   *   {
   *     name: string,              // Food name (e.g., "Grilled chicken breast")
   *     food_bank_id: string|null, // Reference to food bank entry (null if estimated)
   *     quantity: number,          // Amount consumed (e.g., 1, 200)
   *     unit: string,              // Unit of measurement (e.g., "portion", "g", "ml")
   *     nutrition: Object,         // Complete nutrition object with all 24 fields
   *     notes: string|null         // Optional notes about the meal
   *   }
   * @param {string} [timestamp] - Optional ISO 8601 timestamp. Defaults to current time.
   * @param {number} [userId] - Telegram user ID for multi-user tracking
   * @param {string} [userName] - User's display name for multi-user tracking
   * @returns {Promise<Object>} Commit result with structure:
   *   {
   *     success: boolean,
   *     commit_sha: string,
   *     commit_url: string
   *   }
   */
  async appendLogEntry(nutritionData, timestamp = null, userId = null, userName = null) {
    try {
      // Validate required fields
      if (!nutritionData.name) {
        throw new Error('nutritionData.name is required');
      }
      if (!nutritionData.nutrition) {
        throw new Error('nutritionData.nutrition is required');
      }

      // P1 Security Fix: Validate userId is a valid Telegram ID (positive integer or null)
      if (userId !== null && (!Number.isInteger(userId) || userId <= 0)) {
        throw new Error(`Invalid userId: must be a positive integer or null, got ${typeof userId}: ${userId}`);
      }

      // Generate timestamp if not provided
      const entryTimestamp = timestamp || new Date().toISOString();

      // Use retry logic to handle race conditions
      const result = await this._retryWithBackoff(async () => {
        // Get current log file (fresh fetch for each retry to get latest SHA)
        const logFile = await this.getOrCreateLogFile();

        // Create new entry according to SCHEMA.md format
        const newEntry = {
          timestamp: entryTimestamp,
          user_id: userId,
          user_name: userName,
          items: [
            {
              name: nutritionData.name,
              food_bank_id: nutritionData.food_bank_id || null,
              quantity: nutritionData.quantity || 1,
              unit: nutritionData.unit || 'portion',
              nutrition: this._validateNutrition(nutritionData.nutrition),
            },
          ],
          notes: nutritionData.notes || null,
        };

        // Append to entries array
        logFile.data.entries.push(newEntry);

        // Convert to YAML with proper formatting
        const yamlContent = yaml.dump(logFile.data, {
          lineWidth: -1,      // Don't wrap long lines
          noRefs: true,       // Don't use YAML references
          quotingType: '"',   // Use double quotes for strings with special chars
          forceQuotes: false, // Only quote when necessary
        });

        // Commit to GitHub
        const url = `${this.apiUrl}/repos/${this.owner}/${this.repo}/contents/${logFile.path}`;
        const commitMessage = `chore: Log food entry - ${nutritionData.name}`;

        const requestBody = {
          message: commitMessage,
          content: Buffer.from(yamlContent).toString('base64'),
          branch: this.branch,
        };

        // Include SHA for updates (atomic operation)
        if (logFile.sha) {
          requestBody.sha = logFile.sha;
        }

        // Check rate limiting before making API call
        this.checkRateLimit();

        const response = await axios.put(url, requestBody, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/vnd.github.v3+json',
          },
          timeout: 30000 // 30 seconds timeout
        });

        return {
          response,
          logFile
        };
      }, 'GitHub commit');

      console.log('Successfully committed log entry:', {
        file: result.logFile.path,
        commit_sha: result.response.data.commit.sha,
        food: nutritionData.name,
      });

      return {
        success: true,
        commit_sha: result.response.data.commit.sha,
        commit_url: result.response.data.commit.html_url,
        file_path: result.logFile.path,
      };
    } catch (error) {
      console.error('Error committing to GitHub:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      // Provide helpful error messages
      if (error.response?.status === 401) {
        throw new Error('GitHub authentication failed - check GITHUB_TOKEN');
      } else if (error.response?.status === 404) {
        throw new Error(`Repository not found: ${this.owner}/${this.repo}`);
      } else if (error.message.includes('failed after')) {
        // This is from our retry logic
        throw new Error(`Persistent commit conflicts detected - multiple users may be logging simultaneously. Please try again in a few seconds.`);
      } else {
        throw new Error(`Failed to commit log entry: ${error.message}`);
      }
    }
  }

  /**
   * Calculate today's nutrition totals from all logged entries
   *
   * Reads today's log file and sums nutrition values across all items
   * in all entries. Returns aggregated totals for key macros.
   *
   * @param {string} [date] - Optional date string (YYYY-MM-DD). Defaults to today.
   * @param {number} [userId] - Optional user ID to filter entries by specific user
   * @returns {Promise<Object>} Daily totals with structure:
   *   {
   *     date: string,
   *     entries: number,          // Number of meal entries
   *     items: number,            // Total number of food items
   *     energy_kcal: number,
   *     protein_g: number,
   *     fat_g: number,
   *     sat_fat_g: number,
   *     carbs_total_g: number,
   *     carbs_available_g: number,
   *     fiber_total_g: number,
   *     sugar_g: number,
   *     sodium_mg: number,
   *     potassium_mg: number,
   *     calcium_mg: number,
   *     iron_mg: number,
   *     magnesium_mg: number,
   *     zinc_mg: number,
   *     vitamin_c_mg: number
   *   }
   */
  async getTodaysTotals(date = null, userId = null) {
    try {
      const logFile = await this.getOrCreateLogFile(date);
      const targetDate = date || this.getCurrentDate();

      // Return zeros if no entries
      if (!logFile.exists || logFile.data.entries.length === 0) {
        return this._emptyTotals(targetDate);
      }

      // Initialize totals with all tracked fields
      const totals = {
        date: targetDate,
        entries: 0, // Will count as we iterate
        items: 0,
        energy_kcal: 0,
        protein_g: 0,
        fat_g: 0,
        sat_fat_g: 0,
        carbs_total_g: 0,
        carbs_available_g: 0,
        fiber_total_g: 0,
        sugar_g: 0,
        sodium_mg: 0,
        potassium_mg: 0,
        calcium_mg: 0,
        iron_mg: 0,
        magnesium_mg: 0,
        zinc_mg: 0,
        vitamin_c_mg: 0,
      };

      // Sum up nutrition from all entries and items
      // If userId is provided, only count entries for that user
      // P1 Security Fix: Validate userId type consistency before filtering
      if (userId !== null && (!Number.isInteger(userId) || userId <= 0)) {
        console.error(`Invalid userId for filtering: ${userId} (type: ${typeof userId})`);
        return this._emptyTotals(targetDate); // Return zeros for invalid userId
      }

      logFile.data.entries.forEach(entry => {
        // Filter by user if userId is specified
        if (userId !== null) {
          // P1 Security Fix: Use strict equality for both checks to prevent type coercion issues
          if (entry.user_id === null || entry.user_id === undefined) {
            console.warn(`⚠️  Entry without user_id found (timestamp: ${entry.timestamp}). Skipping for user filtering.`);
            return; // Skip entries without user_id
          }
          if (entry.user_id !== userId) {
            return; // Skip entries from other users
          }
        }

        if (!entry.items || !Array.isArray(entry.items)) {
          console.warn('Entry missing items array:', entry);
          return;
        }

        // Count this entry
        totals.entries++;

        entry.items.forEach(item => {
          totals.items++;

          const nutrition = item.nutrition || {};

          // Sum each field (default to 0 if missing)
          totals.energy_kcal += nutrition.energy_kcal || 0;
          totals.protein_g += nutrition.protein_g || 0;
          totals.fat_g += nutrition.fat_g || 0;
          totals.sat_fat_g += nutrition.sat_fat_g || 0;
          totals.carbs_total_g += nutrition.carbs_total_g || 0;
          totals.carbs_available_g += nutrition.carbs_available_g || 0;
          totals.fiber_total_g += nutrition.fiber_total_g || 0;
          totals.sugar_g += nutrition.sugar_g || 0;
          totals.sodium_mg += nutrition.sodium_mg || 0;
          totals.potassium_mg += nutrition.potassium_mg || 0;
          totals.calcium_mg += nutrition.calcium_mg || 0;
          totals.iron_mg += nutrition.iron_mg || 0;
          totals.magnesium_mg += nutrition.magnesium_mg || 0;
          totals.zinc_mg += nutrition.zinc_mg || 0;
          totals.vitamin_c_mg += nutrition.vitamin_c_mg || 0;
        });
      });

      // Round all numeric values to 1 decimal place
      Object.keys(totals).forEach(key => {
        if (typeof totals[key] === 'number' && key !== 'entries' && key !== 'items') {
          totals[key] = Math.round(totals[key] * 10) / 10;
        }
      });

      return totals;
    } catch (error) {
      console.error('Error calculating daily totals:', error.message);

      // Return zeros on error rather than throwing
      // This allows the bot to continue functioning
      return this._emptyTotals(date || this.getCurrentDate());
    }
  }

  /**
   * Validate nutrition object to ensure all required fields are present
   *
   * According to SCHEMA.md, all 24 nutrition fields must be present with
   * numeric values (0 or positive). No null values are allowed.
   *
   * @private
   * @param {Object} nutrition - Nutrition object to validate
   * @returns {Object} Validated nutrition object with all required fields
   * @throws {Error} If nutrition object is missing required fields
   */
  _validateNutrition(nutrition) {
    const requiredFields = [
      'energy_kcal',
      'protein_g',
      'fat_g',
      'sat_fat_g',
      'mufa_g',
      'pufa_g',
      'trans_fat_g',
      'cholesterol_mg',
      'carbs_total_g',
      'polyols_g',
      'carbs_available_g',
      'sugar_g',
      'fiber_total_g',
      'fiber_soluble_g',
      'fiber_insoluble_g',
      'sodium_mg',
      'potassium_mg',
      'iodine_ug',
      'magnesium_mg',
      'calcium_mg',
      'iron_mg',
      'zinc_mg',
      'vitamin_c_mg',
      'manganese_mg',
    ];

    const validated = {};
    const missing = [];

    requiredFields.forEach(field => {
      if (field in nutrition) {
        const value = nutrition[field];

        // Ensure numeric and non-negative
        if (typeof value !== 'number' || value < 0) {
          validated[field] = 0;
          console.warn(`Invalid value for ${field}: ${value}. Setting to 0.`);
        } else {
          validated[field] = value;
        }
      } else {
        // Field is missing - set to 0 but warn
        missing.push(field);
        validated[field] = 0;
      }
    });

    if (missing.length > 0) {
      console.warn('Missing nutrition fields (set to 0):', missing);
    }

    return validated;
  }

  /**
   * Generate empty totals structure
   *
   * @private
   * @param {string} date - Date string in YYYY-MM-DD format
   * @returns {Object} Empty totals object
   */
  _emptyTotals(date) {
    return {
      date: date,
      entries: 0,
      items: 0,
      energy_kcal: 0,
      protein_g: 0,
      fat_g: 0,
      sat_fat_g: 0,
      carbs_total_g: 0,
      carbs_available_g: 0,
      fiber_total_g: 0,
      sugar_g: 0,
      sodium_mg: 0,
      potassium_mg: 0,
      calcium_mg: 0,
      iron_mg: 0,
      magnesium_mg: 0,
      zinc_mg: 0,
      vitamin_c_mg: 0,
    };
  }
}

// Export singleton instance
module.exports = new GitHubIntegration();
