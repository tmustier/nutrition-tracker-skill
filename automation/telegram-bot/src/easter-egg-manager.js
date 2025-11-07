/**
 * Easter Egg Manager
 *
 * High-level API for managing easter eggs in the nutrition tracking bot.
 * This class provides:
 * - Simple API for detecting and triggering easter eggs
 * - Integration with cooldown system
 * - Detection result evaluation
 * - Message generation
 * - Logging and analytics
 *
 * USAGE EXAMPLE:
 * ```javascript
 * const easterEggManager = require('./easter-egg-manager');
 *
 * // Evaluate detection result
 * const result = easterEggManager.evaluateDetection(detectionResult, userId);
 *
 * if (result.shouldTrigger && result.canTrigger) {
 *   // Get message and send
 *   const message = result.getMessage();
 *   await ctx.reply(message);
 *
 *   // Record trigger
 *   result.recordTrigger();
 * }
 * ```
 */

const easterEggConfig = require('./easter-egg-config');
const cooldownManager = require('./easter-egg-cooldown-manager');

class EasterEggManager {
  constructor() {
    console.log('[EasterEggManager] Initialized');
    console.log('[EasterEggManager] Stats:', easterEggConfig.getStats());
  }

  /**
   * Evaluate a detection result to determine which easter egg (if any) should trigger
   *
   * @param {Object} detectionResult - Detection result from image analysis
   * @param {number} userId - Telegram user ID
   * @returns {Object|null} Evaluation result with trigger decision and helper methods, or null if no easter egg triggered
   */
  evaluateDetection(detectionResult, userId) {
    // Input validation
    if (!detectionResult || typeof detectionResult !== 'object') {
      console.log('[EasterEggManager] Invalid detection result');
      return null;
    }

    // Quick exit if easter eggs globally disabled
    if (!easterEggConfig.isGloballyEnabled()) {
      console.log('[EasterEggManager] Easter eggs globally disabled');
      return null;
    }

    // Get all enabled easter eggs sorted by priority
    const enabledEggs = easterEggConfig.getEnabledEasterEggs();

    if (enabledEggs.length === 0) {
      console.log('[EasterEggManager] No easter eggs enabled');
      return null;
    }

    // Evaluate each easter egg in priority order
    for (const easterEgg of enabledEggs) {
      const matches = this._checkDetectionCriteria(easterEgg, detectionResult);

      if (matches) {
        // Check cooldown status
        const cooldownStatus = cooldownManager.checkEasterEggCooldown(userId, easterEgg.id);

        console.log(`[EasterEggManager] Easter egg ${easterEgg.id} matches detection criteria`);
        console.log(`[EasterEggManager] Cooldown status:`, cooldownStatus);

        return this._createResult(easterEgg, userId, cooldownStatus);
      }
    }

    // No easter egg matched
    console.log('[EasterEggManager] No easter eggs matched detection criteria');
    return null;
  }

  /**
   * Check if detection result matches easter egg criteria
   *
   * IMPORTANT: This method expects the scene_detection object from Claude Vision
   * (already extracted by webhook.js). The structure is flat:
   * {
   *   has_person: true,
   *   has_food: false,
   *   confidence: "high",  // Single string for entire scene
   *   scene_type: "selfie",
   *   ...
   * }
   *
   * Note: Webhook passes result.scene_detection, NOT the full Claude Vision response.
   *
   * @param {Object} easterEgg - Easter egg configuration
   * @param {Object} detectionResult - scene_detection object from Claude Vision (flat structure)
   * @returns {boolean} True if criteria match
   */
  _checkDetectionCriteria(easterEgg, detectionResult) {
    const criteria = easterEgg.detectionCriteria;

    // Check each criterion
    for (const [key, expectedValue] of Object.entries(criteria)) {
      // Handle overall confidence threshold (scene-level confidence)
      if (key === 'min_confidence') {
        const actualConfidence = detectionResult.confidence;

        if (!actualConfidence) {
          return false; // Confidence not available
        }

        // Check if confidence meets minimum
        if (!this._meetsConfidenceThreshold(actualConfidence, expectedValue)) {
          return false;
        }

        continue;
      }

      // Handle time window check
      if (key === 'time_window') {
        if (!this._checkTimeWindow(expectedValue)) {
          return false;
        }
        continue;
      }

      // Handle scene_type matching
      if (key === 'scene_type') {
        const actualSceneType = detectionResult.scene_type;

        // Support both single value and array of values
        if (Array.isArray(expectedValue)) {
          if (!expectedValue.includes(actualSceneType)) {
            return false;
          }
        } else {
          if (actualSceneType !== expectedValue) {
            return false;
          }
        }
        continue;
      }

      // Handle boolean detection flags (flat structure)
      // Access directly from detectionResult (not detectionResult.detections)
      const actualValue = detectionResult[key];

      if (actualValue !== expectedValue) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if confidence level meets threshold
   *
   * @param {string} actual - Actual confidence ('high', 'medium', 'low')
   * @param {string} required - Required confidence ('high', 'medium', 'low')
   * @returns {boolean} True if meets threshold
   */
  _meetsConfidenceThreshold(actual, required) {
    const confidenceLevels = { high: 3, medium: 2, low: 1 };

    // Validate inputs - fail closed if invalid (don't trigger easter egg)
    if (!actual || typeof actual !== 'string' || !confidenceLevels[actual]) {
      console.warn(`[EasterEggManager] Invalid actual confidence: ${actual}`);
      return false;
    }

    if (!required || typeof required !== 'string' || !confidenceLevels[required]) {
      console.warn(`[EasterEggManager] Invalid required confidence: ${required}`);
      return false;
    }

    return confidenceLevels[actual] >= confidenceLevels[required];
  }

  /**
   * Check if current time is within time window
   *
   * @param {Object} timeWindow - { start: number, end: number } (hours in 24h format)
   * @returns {boolean} True if current time is in window
   */
  _checkTimeWindow(timeWindow) {
    const currentHour = new Date().getHours();
    const { start, end } = timeWindow;

    // Handle window that crosses midnight
    if (start > end) {
      return currentHour >= start || currentHour < end;
    }

    return currentHour >= start && currentHour < end;
  }

  /**
   * Create result object for matched easter egg
   *
   * @param {Object} easterEgg - Easter egg configuration
   * @param {number} userId - Telegram user ID
   * @param {Object} cooldownStatus - Cooldown status from cooldown manager
   * @returns {Object} Result object with trigger decision and helper methods
   */
  _createResult(easterEgg, userId, cooldownStatus) {
    return {
      // Decision flags
      shouldTrigger: true,
      canTrigger: !cooldownStatus.onCooldown,
      blocksNutritionExtraction: easterEgg.blocksNutritionExtraction,

      // Easter egg info
      easterEggId: easterEgg.id,
      easterEggType: easterEgg.id, // Alias for compatibility with tests
      easterEggName: easterEgg.displayName,
      priority: easterEgg.priority,

      // Cooldown info
      onCooldown: cooldownStatus.onCooldown,
      cooldownInfo: {
        remainingMs: cooldownStatus.remainingMs,
        lastTriggered: cooldownStatus.lastTriggered,
        nextAvailable: cooldownStatus.nextAvailable,
      },

      // Helper methods
      getMessage: () => {
        return easterEggConfig.getRandomMessage(easterEgg.id);
      },

      recordTrigger: () => {
        cooldownManager.recordEasterEggTrigger(userId, easterEgg.id);
        console.log(`[EasterEggManager] Recorded trigger for ${easterEgg.id}, user ${userId}`);
      },

      getMetadata: () => {
        return easterEgg.metadata;
      },

      // Full easter egg config (for advanced use)
      config: easterEgg,
    };
  }


  /**
   * Get statistics about easter egg configuration
   * @returns {Object} Configuration statistics
   */
  getStats() {
    return easterEggConfig.getStats();
  }

  /**
   * Get all cooldown durations (for cooldown manager)
   * @returns {Object} Map of easter egg IDs to cooldown durations
   */
  getAllCooldownDurations() {
    return easterEggConfig.getAllCooldownDurations();
  }

  /**
   * Check specific easter egg eligibility for user
   *
   * @param {string} easterEggId - Easter egg identifier
   * @param {number} userId - Telegram user ID
   * @returns {Object} Eligibility info
   */
  checkEligibility(easterEggId, userId) {
    const easterEgg = easterEggConfig.getEasterEggById(easterEggId);

    if (!easterEgg) {
      return {
        eligible: false,
        reason: 'Easter egg not found',
      };
    }

    if (!easterEgg.enabled) {
      return {
        eligible: false,
        reason: 'Easter egg disabled',
      };
    }

    if (!easterEggConfig.isGloballyEnabled()) {
      return {
        eligible: false,
        reason: 'Easter eggs globally disabled',
      };
    }

    const cooldownStatus = cooldownManager.checkEasterEggCooldown(userId, easterEggId);

    return {
      eligible: !cooldownStatus.onCooldown,
      reason: cooldownStatus.onCooldown ? 'On cooldown' : 'Eligible',
      cooldownInfo: {
        onCooldown: cooldownStatus.onCooldown,
        remainingMs: cooldownStatus.remainingMs,
        lastTriggered: cooldownStatus.lastTriggered,
        nextAvailable: cooldownStatus.nextAvailable,
      },
    };
  }

  /**
   * Get user's cooldown status for all easter eggs
   *
   * @param {number} userId - Telegram user ID
   * @returns {Object} Map of easter egg IDs to cooldown status
   */
  getUserCooldownStatus(userId) {
    const cooldowns = cooldownManager.getUserCooldowns(userId);
    const result = {};

    // Get all easter egg types
    const allEggs = Object.values(easterEggConfig.EASTER_EGG_TYPES);

    for (const egg of allEggs) {
      const eggCooldown = cooldowns[egg.id];

      if (eggCooldown) {
        result[egg.id] = {
          easterEggName: egg.displayName,
          onCooldown: eggCooldown.isActive,
          lastTriggered: eggCooldown.lastTriggered,
          nextAvailable: eggCooldown.nextAvailable,
          remainingMs: eggCooldown.remainingMs,
        };
      } else {
        result[egg.id] = {
          easterEggName: egg.displayName,
          onCooldown: false,
          lastTriggered: null,
          nextAvailable: null,
          remainingMs: 0,
        };
      }
    }

    return result;
  }

  /**
   * Clear user's cooldowns (for testing or admin actions)
   *
   * @param {number} userId - Telegram user ID
   */
  clearUserCooldowns(userId) {
    cooldownManager.clearUserCooldowns(userId);
    console.log(`[EasterEggManager] Cleared cooldowns for user ${userId}`);
  }

  /**
   * Manually trigger an easter egg (for testing)
   *
   * @param {string} easterEggId - Easter egg identifier
   * @param {number} userId - Telegram user ID
   * @returns {Object} Result with message and trigger recording
   */
  manualTrigger(easterEggId, userId) {
    const easterEgg = easterEggConfig.getEasterEggById(easterEggId);

    if (!easterEgg) {
      throw new Error(`Easter egg not found: ${easterEggId}`);
    }

    const message = easterEggConfig.getRandomMessage(easterEggId);
    cooldownManager.recordEasterEggTrigger(userId, easterEggId);

    console.log(`[EasterEggManager] Manual trigger: ${easterEggId} for user ${userId}`);

    return {
      easterEggId,
      easterEggName: easterEgg.displayName,
      message,
      blocksNutritionExtraction: easterEgg.blocksNutritionExtraction,
    };
  }
}

// Export singleton instance
module.exports = new EasterEggManager();
