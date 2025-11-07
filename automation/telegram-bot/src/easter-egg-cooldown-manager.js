// src/easter-egg-cooldown-manager.js
/**
 * Easter Egg Cooldown Manager for Telegram Bot
 *
 * Tracks per-user, per-easter-egg-type cooldowns to prevent spam and
 * maintain surprise/delight factor of easter eggs.
 *
 * ARCHITECTURE & DEPLOYMENT:
 * - In-memory storage using JavaScript Maps (no external database)
 * - Leverages Node.js single-threaded event loop for atomic operations
 * - In serverless/multi-instance deployments: each instance has isolated memory
 * - State is lost on server restart/redeploy - cooldowns not persisted
 * - For production persistence, consider Redis or database-backed storage
 *
 * CONCURRENCY SAFETY:
 * - Atomic check-and-set operations prevent race conditions
 * - Per-user tracking ensures isolated state
 * - Automatic cleanup prevents memory leaks
 * - Operations are atomic within a single Node.js instance
 *
 * MEMORY MANAGEMENT:
 * - LRU eviction when hitting user limit (default: 1000 users)
 * - Automatic cleanup of expired cooldowns (every 5 minutes)
 * - Efficient storage: only timestamps (numbers), not full date objects
 * - Separate tracking for last access to support LRU eviction
 *
 * EASTER EGG TYPES & COOLDOWNS:
 * - person_without_food: 7 days (most common, longer cooldown)
 * - pet: 3 days
 * - empty_plate: 2 days
 * - midnight_munchies: 12 hours (time-specific, shorter cooldown)
 * - celebration: 30 days (rare event, longest cooldown)
 * - non_food_item: 7 days
 * - shopping_scene: 3 days
 * - screenshot: 2 days
 * - empty_packaging: 2 days
 */

/**
 * Configuration for Easter Egg Cooldown Manager
 * These values can be overridden via environment variables for production tuning
 */
const CONFIG = {
  // Maximum number of users to track cooldowns for (LRU eviction when exceeded)
  MAX_COOLDOWN_ENTRIES: parseInt(process.env.MAX_COOLDOWN_ENTRIES) || 1000,

  // Cleanup interval in milliseconds (5 minutes)
  // More frequent than conversation cleanup since cooldowns can be short (12 hours)
  COOLDOWN_CLEANUP_INTERVAL_MS: parseInt(process.env.COOLDOWN_CLEANUP_INTERVAL_MS) || 5 * 60 * 1000,

  // Cooldown durations per easter egg type (milliseconds)
  // Can be overridden individually via environment variables
  COOLDOWN_PERSON_WITHOUT_FOOD: parseInt(process.env.COOLDOWN_PERSON_WITHOUT_FOOD) || 7 * 24 * 60 * 60 * 1000,
  COOLDOWN_PET: parseInt(process.env.COOLDOWN_PET) || 3 * 24 * 60 * 60 * 1000,
  COOLDOWN_EMPTY_PLATE: parseInt(process.env.COOLDOWN_EMPTY_PLATE) || 2 * 24 * 60 * 60 * 1000,
  COOLDOWN_MIDNIGHT_MUNCHIES: parseInt(process.env.COOLDOWN_MIDNIGHT_MUNCHIES) || 12 * 60 * 60 * 1000,
  COOLDOWN_CELEBRATION: parseInt(process.env.COOLDOWN_CELEBRATION) || 30 * 24 * 60 * 60 * 1000,
  COOLDOWN_NON_FOOD_ITEM: parseInt(process.env.COOLDOWN_NON_FOOD_ITEM) || 7 * 24 * 60 * 60 * 1000,
  COOLDOWN_SHOPPING_SCENE: parseInt(process.env.COOLDOWN_SHOPPING_SCENE) || 3 * 24 * 60 * 60 * 1000,
  COOLDOWN_SCREENSHOT: parseInt(process.env.COOLDOWN_SCREENSHOT) || 2 * 24 * 60 * 60 * 1000,
  COOLDOWN_EMPTY_PACKAGING: parseInt(process.env.COOLDOWN_EMPTY_PACKAGING) || 2 * 24 * 60 * 60 * 1000
};

class EasterEggCooldownManager {
  constructor() {
    // Per-user, per-easter-egg-type cooldown tracking
    // Map<userId: string, Map<easterEggType: string, lastTriggerTimestamp: number>>
    this.easterEggCooldowns = new Map();

    // LRU tracking: Map<userId: string, lastAccessTimestamp: number>
    // Used to evict least recently used entries when hitting memory limits
    this.cooldownLastAccess = new Map();

    // Cooldown durations per easter egg type (milliseconds)
    this.cooldownDurations = {
      person_without_food: CONFIG.COOLDOWN_PERSON_WITHOUT_FOOD,
      pet: CONFIG.COOLDOWN_PET,
      empty_plate: CONFIG.COOLDOWN_EMPTY_PLATE,
      midnight_munchies: CONFIG.COOLDOWN_MIDNIGHT_MUNCHIES,
      celebration: CONFIG.COOLDOWN_CELEBRATION,
      non_food_item: CONFIG.COOLDOWN_NON_FOOD_ITEM,
      shopping_scene: CONFIG.COOLDOWN_SHOPPING_SCENE,
      screenshot: CONFIG.COOLDOWN_SCREENSHOT,
      empty_packaging: CONFIG.COOLDOWN_EMPTY_PACKAGING
    };

    // Load configuration from CONFIG object (supports environment variables)
    this.maxCooldownEntries = CONFIG.MAX_COOLDOWN_ENTRIES;
    this.cleanupInterval = CONFIG.COOLDOWN_CLEANUP_INTERVAL_MS;

    console.log('[EasterEggCooldownManager] Initialized with config:', {
      maxCooldownEntries: this.maxCooldownEntries,
      cleanupInterval: this.cleanupInterval,
      cooldownDurations: this.cooldownDurations
    });

    // Start periodic cleanup of expired cooldowns
    this.startCooldownCleanup();
  }

  /**
   * Check if easter egg is on cooldown for a user (ATOMIC OPERATION)
   *
   * CRITICAL: This operation is atomic to prevent race conditions.
   * Returns cooldown status and remaining time if on cooldown.
   *
   * @param {string|number} userId - Telegram user ID
   * @param {string} easterEggType - Type of easter egg (e.g., 'person_without_food')
   * @returns {Object} { onCooldown: boolean, remainingMs: number, lastTriggered: Date|null, nextAvailable: Date|null }
   */
  checkEasterEggCooldown(userId, easterEggType) {
    const userIdStr = String(userId);
    const now = Date.now();

    // Update LRU access time (atomic operation)
    this.cooldownLastAccess.set(userIdStr, now);

    // Get user's cooldown map
    const userCooldowns = this.easterEggCooldowns.get(userIdStr);

    // If no cooldowns tracked for this user, not on cooldown
    if (!userCooldowns) {
      console.log(`[EasterEggCooldownManager] No cooldowns tracked for user ${userIdStr}, type ${easterEggType}`);
      return {
        onCooldown: false,
        remainingMs: 0,
        lastTriggered: null,
        nextAvailable: null
      };
    }

    // Get last trigger timestamp for this easter egg type
    const lastTrigger = userCooldowns.get(easterEggType);

    // If never triggered, not on cooldown
    if (!lastTrigger) {
      console.log(`[EasterEggCooldownManager] Easter egg ${easterEggType} never triggered for user ${userIdStr}`);
      return {
        onCooldown: false,
        remainingMs: 0,
        lastTriggered: null,
        nextAvailable: null
      };
    }

    // Calculate cooldown expiration
    const cooldownDuration = this.getCooldownDuration(easterEggType);
    const expirationTime = lastTrigger + cooldownDuration;
    const remainingMs = expirationTime - now;

    if (remainingMs > 0) {
      // Still on cooldown
      console.log(`[EasterEggCooldownManager] Easter egg ${easterEggType} on cooldown for user ${userIdStr}: ${Math.round(remainingMs / 1000)}s remaining`);
      return {
        onCooldown: true,
        remainingMs,
        lastTriggered: new Date(lastTrigger),
        nextAvailable: new Date(expirationTime)
      };
    }

    // Cooldown expired
    console.log(`[EasterEggCooldownManager] Easter egg ${easterEggType} cooldown expired for user ${userIdStr}`);
    return {
      onCooldown: false,
      remainingMs: 0,
      lastTriggered: new Date(lastTrigger),
      nextAvailable: null
    };
  }

  /**
   * Record that an easter egg was triggered for a user (ATOMIC OPERATION)
   *
   * CRITICAL: This operation is atomic. Updates both cooldown timestamp and LRU access time.
   * Automatically handles LRU eviction if needed.
   *
   * @param {string|number} userId - Telegram user ID
   * @param {string} easterEggType - Type of easter egg
   */
  recordEasterEggTrigger(userId, easterEggType) {
    const userIdStr = String(userId);
    const now = Date.now();

    // Validate easter egg type
    if (!this.cooldownDurations[easterEggType]) {
      console.warn(`[EasterEggCooldownManager] Unknown easter egg type: ${easterEggType}`);
      // Allow recording anyway, use default 7-day cooldown
      this.cooldownDurations[easterEggType] = 7 * 24 * 60 * 60 * 1000;
    }

    // LRU EVICTION: Check if we need to evict before adding new entry
    if (!this.easterEggCooldowns.has(userIdStr) &&
        this.easterEggCooldowns.size >= this.maxCooldownEntries) {
      console.warn(`[EasterEggCooldownManager] Max cooldown entries reached (${this.maxCooldownEntries}), evicting LRU entry`);
      this.evictLRUCooldowns();
    }

    // Get or create user's cooldown map
    if (!this.easterEggCooldowns.has(userIdStr)) {
      this.easterEggCooldowns.set(userIdStr, new Map());
    }

    const userCooldowns = this.easterEggCooldowns.get(userIdStr);

    // Record trigger timestamp (atomic operation)
    userCooldowns.set(easterEggType, now);

    // Update LRU access time (atomic operation)
    this.cooldownLastAccess.set(userIdStr, now);

    const durationHours = this.cooldownDurations[easterEggType] / (60 * 60 * 1000);
    console.log(`[EasterEggCooldownManager] Recorded trigger for user ${userIdStr}, type ${easterEggType} (cooldown: ${durationHours}h)`);
  }

  /**
   * Get cooldown duration for a specific easter egg type
   *
   * @param {string} easterEggType - Type of easter egg
   * @returns {number} Cooldown duration in milliseconds
   */
  getCooldownDuration(easterEggType) {
    const duration = this.cooldownDurations[easterEggType];

    if (!duration) {
      console.warn(`[EasterEggCooldownManager] Unknown easter egg type ${easterEggType}, using default 7 days`);
      return 7 * 24 * 60 * 60 * 1000; // Default: 7 days
    }

    return duration;
  }

  /**
   * Clear all cooldowns for a user
   *
   * Useful for testing or administrative actions.
   *
   * @param {string|number} userId - Telegram user ID
   */
  clearUserCooldowns(userId) {
    const userIdStr = String(userId);
    const hadCooldowns = this.easterEggCooldowns.delete(userIdStr);
    this.cooldownLastAccess.delete(userIdStr);

    if (hadCooldowns) {
      console.log(`[EasterEggCooldownManager] Cleared all cooldowns for user ${userIdStr}`);
    } else {
      console.log(`[EasterEggCooldownManager] No cooldowns to clear for user ${userIdStr}`);
    }
  }

  /**
   * Get all active cooldowns for a user (for debugging/admin)
   *
   * @param {string|number} userId - Telegram user ID
   * @returns {Object} Map of easter egg types to cooldown info
   */
  getUserCooldowns(userId) {
    const userIdStr = String(userId);
    const userCooldowns = this.easterEggCooldowns.get(userIdStr);
    const now = Date.now();

    if (!userCooldowns) {
      return {};
    }

    const result = {};
    for (const [easterEggType, lastTrigger] of userCooldowns) {
      const cooldownDuration = this.getCooldownDuration(easterEggType);
      const expirationTime = lastTrigger + cooldownDuration;
      const remainingMs = Math.max(0, expirationTime - now);

      result[easterEggType] = {
        lastTriggered: new Date(lastTrigger),
        nextAvailable: new Date(expirationTime),
        remainingMs,
        isActive: remainingMs > 0
      };
    }

    return result;
  }

  /**
   * Start periodic cleanup of expired cooldowns
   * Interval configured via CONFIG.COOLDOWN_CLEANUP_INTERVAL_MS (default: 5 minutes)
   */
  startCooldownCleanup() {
    setInterval(() => {
      this.cleanupExpiredCooldowns();
    }, this.cleanupInterval);

    console.log(`[EasterEggCooldownManager] Started periodic cleanup (interval: ${this.cleanupInterval}ms)`);
  }

  /**
   * Clean up expired cooldowns across all users
   *
   * Removes cooldown entries that have expired (current time > lastTrigger + duration).
   * This reduces memory usage and keeps the maps lean.
   */
  cleanupExpiredCooldowns() {
    const now = Date.now();
    let cleanedUsers = 0;
    let cleanedCooldowns = 0;

    for (const [userId, userCooldowns] of this.easterEggCooldowns) {
      let userCooldownsRemoved = 0;

      // Clean up expired cooldowns for this user
      for (const [easterEggType, lastTrigger] of userCooldowns) {
        const cooldownDuration = this.getCooldownDuration(easterEggType);
        const expirationTime = lastTrigger + cooldownDuration;

        if (now > expirationTime) {
          // Cooldown expired, remove it
          userCooldowns.delete(easterEggType);
          userCooldownsRemoved++;
          cleanedCooldowns++;
        }
      }

      // If user has no remaining cooldowns, remove the user entry entirely
      if (userCooldowns.size === 0) {
        this.easterEggCooldowns.delete(userId);
        this.cooldownLastAccess.delete(userId);
        cleanedUsers++;
      }
    }

    if (cleanedUsers > 0 || cleanedCooldowns > 0) {
      console.log(`[EasterEggCooldownManager] Cleanup: removed ${cleanedCooldowns} expired cooldowns for ${cleanedUsers} users`);
    }
  }

  /**
   * Evict least recently used cooldown entries when hitting limits
   *
   * Called when total users tracked exceeds MAX_COOLDOWN_ENTRIES.
   * Uses LRU (Least Recently Used) eviction policy based on cooldownLastAccess.
   */
  evictLRUCooldowns() {
    // Find the least recently used user
    let lruUserId = null;
    let lruTimestamp = Infinity;

    for (const [userId, lastAccess] of this.cooldownLastAccess) {
      if (lastAccess < lruTimestamp) {
        lruTimestamp = lastAccess;
        lruUserId = userId;
      }
    }

    if (lruUserId) {
      this.easterEggCooldowns.delete(lruUserId);
      this.cooldownLastAccess.delete(lruUserId);
      console.log(`[EasterEggCooldownManager] Evicted LRU cooldowns for user ${lruUserId} (last access: ${new Date(lruTimestamp).toISOString()})`);
    } else {
      console.warn('[EasterEggCooldownManager] LRU eviction failed: no users to evict');
    }
  }

  /**
   * Get statistics about cooldown tracking (for monitoring)
   *
   * @returns {Object} Statistics about cooldowns, memory usage, and configuration
   */
  getCooldownStats() {
    const totalCooldowns = Array.from(this.easterEggCooldowns.values())
      .reduce((sum, userCooldowns) => sum + userCooldowns.size, 0);

    // Count active (non-expired) cooldowns
    const now = Date.now();
    let activeCooldowns = 0;
    const cooldownsByType = {};

    for (const [userId, userCooldowns] of this.easterEggCooldowns) {
      for (const [easterEggType, lastTrigger] of userCooldowns) {
        const cooldownDuration = this.getCooldownDuration(easterEggType);
        const expirationTime = lastTrigger + cooldownDuration;

        if (now < expirationTime) {
          activeCooldowns++;
          cooldownsByType[easterEggType] = (cooldownsByType[easterEggType] || 0) + 1;
        }
      }
    }

    return {
      totalUsers: this.easterEggCooldowns.size,
      totalCooldowns,
      activeCooldowns,
      expiredCooldowns: totalCooldowns - activeCooldowns,
      cooldownsByType,
      maxCooldownEntries: this.maxCooldownEntries,
      cleanupInterval: this.cleanupInterval,
      memoryUsage: {
        usersTracked: this.easterEggCooldowns.size,
        lruEntriesTracked: this.cooldownLastAccess.size
      }
    };
  }
}

// Export singleton instance
module.exports = new EasterEggCooldownManager();
