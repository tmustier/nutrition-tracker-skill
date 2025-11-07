/**
 * ProfileManager - Manages user-specific health profiles
 *
 * Handles loading, caching, validation, and persistence of health profiles
 * stored in GitHub at references/health-profiles/{userId}.yaml
 *
 * Security features:
 * - Path traversal prevention
 * - Safe YAML parsing (no code execution)
 * - User ID validation
 * - Rate limiting integration
 * - Race condition protection
 */

const axios = require('axios');
const yaml = require('js-yaml');
const config = require('./config');

class ProfileManager {
  constructor(githubIntegration) {
    this.github = githubIntegration;
    this.cache = new Map(); // userId -> {profile, loadedAt}
    this.TTL = 5 * 60 * 1000; // 5 minutes cache TTL
    this.MAX_CACHE_SIZE = 1000; // Prevent unbounded growth
    this.loadingLocks = new Map(); // userId -> Promise (prevent concurrent loads)

    // Periodic cache cleanup to prevent memory leaks
    this._cleanupInterval = setInterval(() => this._cleanupCache(), 60 * 1000); // Every minute
  }

  /**
   * Validate and normalize userId to prevent security issues
   * @private
   * @param {any} userId - User ID to validate
   * @returns {number} Normalized user ID
   * @throws {Error} If userId is invalid
   */
  _validateAndNormalizeUserId(userId) {
    // Normalize to number
    const normalizedUserId = Number(userId);

    // Validate: must be positive integer
    if (!Number.isInteger(normalizedUserId) || normalizedUserId <= 0) {
      throw new Error(`Invalid userId: must be a positive integer, got ${userId}`);
    }

    // Additional security: check for path traversal attempts in string form
    const userIdStr = String(userId);
    if (userIdStr.includes('/') || userIdStr.includes('\\') || userIdStr.includes('..')) {
      throw new Error('Invalid userId: contains path traversal characters');
    }

    return normalizedUserId;
  }

  /**
   * Load a user's health profile from GitHub or cache
   * @param {number} userId - Telegram user ID
   * @returns {Promise<Object>} Health profile object
   */
  async loadProfile(userId) {
    // Handle missing userId
    if (!userId) {
      console.warn('[ProfileManager] No userId provided, using default profile');
      return this.getDefaultProfile();
    }

    // Validate and normalize userId
    let normalizedUserId;
    try {
      normalizedUserId = this._validateAndNormalizeUserId(userId);
    } catch (error) {
      console.warn(`[ProfileManager] Invalid userId ${userId}: ${error.message}, using default profile`);
      return this.getDefaultProfile();
    }

    // Check cache first
    const cached = this.cache.get(normalizedUserId);
    if (cached && (Date.now() - cached.loadedAt) < this.TTL) {
      console.log(`[ProfileManager] Cache hit for user ${normalizedUserId}`);
      return cached.profile;
    }

    // Check if already loading (prevent duplicate requests)
    // Fixed: Use get() to check atomically
    let loadPromise = this.loadingLocks.get(normalizedUserId);
    if (loadPromise) {
      console.log(`[ProfileManager] Waiting for existing load for user ${normalizedUserId}`);
      return await loadPromise;
    }

    // Create loading promise and set atomically
    loadPromise = this._loadProfileFromGitHub(normalizedUserId);
    this.loadingLocks.set(normalizedUserId, loadPromise);

    try {
      const profile = await loadPromise;
      return profile;
    } finally {
      this.loadingLocks.delete(normalizedUserId);
    }
  }

  /**
   * Internal method to load profile from GitHub
   * @private
   */
  async _loadProfileFromGitHub(userId) {
    // userId is already validated by loadProfile
    const profilePath = `references/health-profiles/${userId}.yaml`;
    const url = `${this.github.apiUrl}/repos/${this.github.owner}/${this.github.repo}/contents/${profilePath}`;

    try {
      console.log(`[ProfileManager] Loading profile for user ${userId} from GitHub`);

      // Check rate limiting before API call
      this.github.checkRateLimit();

      // Fetch file from GitHub using axios
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.github.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          ref: this.github.branch,
        },
        timeout: 30000 // 30 seconds timeout
      });

      // Decode base64 content
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');

      // SECURITY: Use safe YAML parsing to prevent code execution
      const profile = yaml.load(content, { schema: yaml.SAFE_SCHEMA });

      // Validate profile structure
      this.validateProfile(profile);

      // CRITICAL: Check if saveProfile() ran concurrently during our load
      // If the lock is missing, saveProfile() cleared it while we were loading
      // In this case, don't cache the potentially stale profile
      if (this.loadingLocks.has(userId)) {
        // Safe to cache - no concurrent saveProfile()
        this.cache.set(userId, {
          profile,
          loadedAt: Date.now(),
        });
      } else {
        // Lock was cleared - saveProfile() likely ran concurrently
        console.warn(`[ProfileManager] Not caching user ${userId} - lock missing (concurrent saveProfile?)`);
      }

      console.log(`[ProfileManager] Successfully loaded profile for user ${userId}`);
      return profile;

    } catch (error) {
      // Handle 404 (profile doesn't exist) - expected for new users
      if (error.response?.status === 404) {
        console.info(`[ProfileManager] No profile found for user ${userId}, using default`);
        const defaultProfile = this.getDefaultProfile();

        // Cache the default profile too (prevents repeated 404s)
        // But only if lock still exists (no concurrent saveProfile)
        if (this.loadingLocks.has(userId)) {
          this.cache.set(userId, {
            profile: defaultProfile,
            loadedAt: Date.now(),
          });
        }
        return defaultProfile;
      }

      // Handle authentication errors - critical, don't mask
      if (error.response?.status === 401) {
        console.error('[ProfileManager] GitHub authentication failed - check GITHUB_TOKEN');
        throw new Error('GitHub authentication failed - check GITHUB_TOKEN');
      }

      // Handle permission errors - critical, don't mask
      if (error.response?.status === 403) {
        console.error('[ProfileManager] GitHub API access forbidden - check permissions');
        throw new Error('GitHub API access forbidden - check permissions');
      }

      // Handle rate limiting - temporary, inform caller
      if (error.response?.status === 429) {
        console.error('[ProfileManager] GitHub API rate limit exceeded');
        throw new Error('GitHub API rate limit exceeded - try again later');
      }

      // Handle network/timeout errors - log and throw
      console.error(`[ProfileManager] Error loading profile for user ${userId}:`, {
        message: error.message,
        status: error.response?.status,
        code: error.code
      });
      throw new Error(`Failed to load profile: ${error.message}`);
    }
  }

  /**
   * Save a user's health profile to GitHub with retry logic
   * @param {number} userId - Telegram user ID
   * @param {Object} profile - Health profile object
   * @param {string} commitMessage - Optional commit message
   * @returns {Promise<void>}
   */
  async saveProfile(userId, profile, commitMessage = null) {
    // Validate userId
    let normalizedUserId;
    try {
      normalizedUserId = this._validateAndNormalizeUserId(userId);
    } catch (error) {
      throw new Error(`Cannot save profile: ${error.message}`);
    }

    // Validate profile structure before saving
    this.validateProfile(profile);

    const profilePath = `references/health-profiles/${normalizedUserId}.yaml`;
    const url = `${this.github.apiUrl}/repos/${this.github.owner}/${this.github.repo}/contents/${profilePath}`;
    const message = commitMessage || `Update health profile for user ${normalizedUserId}`;

    // Retry logic for handling 409 conflicts (similar to github-integration.js)
    const maxRetries = 3;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Convert profile to YAML
        const yamlContent = yaml.dump(profile, {
          indent: 2,
          lineWidth: 120,
          noRefs: true,
          sortKeys: true, // Consistent ordering
        });

        // Check rate limiting
        this.github.checkRateLimit();

        // Get current file SHA if it exists (required for updates)
        let sha = null;
        try {
          const existing = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${this.github.token}`,
              Accept: 'application/vnd.github.v3+json',
            },
            params: {
              ref: this.github.branch,
            },
            timeout: 30000
          });
          sha = existing.data.sha;
        } catch (error) {
          // 404 means file doesn't exist yet - that's OK
          if (error.response?.status !== 404) {
            throw error;
          }
        }

        // Create or update file
        await axios.put(url, {
          message,
          content: Buffer.from(yamlContent, 'utf-8').toString('base64'),
          branch: this.github.branch,
          sha, // null if creating new file, existing SHA if updating
        }, {
          headers: {
            Authorization: `Bearer ${this.github.token}`,
            Accept: 'application/vnd.github.v3+json',
          },
          timeout: 30000
        });

        // Success! Invalidate cache to prevent stale data
        this.cache.delete(normalizedUserId);

        // CRITICAL: Also clear loading locks to prevent in-flight loads from caching old data
        this.loadingLocks.delete(normalizedUserId);

        console.log(`[ProfileManager] Successfully saved profile for user ${normalizedUserId}`);
        return;

      } catch (error) {
        lastError = error;

        // Only retry on 409 conflicts (file SHA mismatch)
        if (error.response?.status !== 409) {
          // Non-retryable error
          console.error(`[ProfileManager] Error saving profile for user ${normalizedUserId}:`, {
            message: error.message,
            status: error.response?.status
          });
          throw new Error(`Failed to save profile: ${error.message}`);
        }

        // Retry with exponential backoff
        if (attempt < maxRetries) {
          const backoffMs = 100 * Math.pow(2, attempt - 1); // 100ms, 200ms, 400ms
          console.warn(`[ProfileManager] Conflict saving profile for user ${normalizedUserId}, retrying in ${backoffMs}ms (${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }

    // All retries exhausted
    throw new Error(`Failed to save profile after ${maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Get default/template health profile
   * @returns {Object} Default health profile
   */
  getDefaultProfile() {
    return {
      meta: {
        owner: "New User",
        timezone: "UTC",
        updated: "2025-11-06T00:00:00Z", // Static timestamp - this is a template
        notes: "Default profile - customize with your personal targets"
      },
      targets: {
        energy_kcal: {
          rest_day_max: 2000,
          training_day_max: 2400
        },
        protein_g_min: 150,
        fat_g_min: 60,
        carbs_g_min: 200,
        fiber_g_min: 30,
        sat_fat_g_max: 20,
        sodium_mg_max: 2300,
        potassium_mg_min: 3500,
        fruit_veg_servings_min: 5
      },
      monitoring: {
        na_k_molar_ratio: true,
        na_k_mass_ratio: true,
        iodine_ug: true
      }
    };
  }

  /**
   * Validate health profile structure
   * @param {Object} profile - Profile to validate
   * @throws {Error} If profile is invalid
   */
  validateProfile(profile) {
    if (!profile || typeof profile !== 'object') {
      throw new Error('Profile must be an object');
    }

    // Check required sections
    if (!profile.meta || typeof profile.meta !== 'object') {
      throw new Error('Profile must have meta section');
    }
    if (!profile.targets || typeof profile.targets !== 'object') {
      throw new Error('Profile must have targets section');
    }

    // Validate meta fields
    if (!profile.meta.timezone || typeof profile.meta.timezone !== 'string') {
      throw new Error('Profile meta must have timezone string');
    }
    if (!profile.meta.owner || typeof profile.meta.owner !== 'string') {
      throw new Error('Profile meta must have owner string');
    }

    // Validate energy targets
    const targets = profile.targets;
    if (!targets.energy_kcal || typeof targets.energy_kcal !== 'object') {
      throw new Error('Profile must have energy_kcal object');
    }
    if (!targets.energy_kcal.rest_day_max || !targets.energy_kcal.training_day_max) {
      throw new Error('Profile energy_kcal must have rest_day_max and training_day_max');
    }

    // Validate energy ranges
    if (targets.energy_kcal.rest_day_max < 1000 || targets.energy_kcal.rest_day_max > 10000) {
      throw new Error('rest_day_max must be between 1000 and 10000 kcal');
    }
    if (targets.energy_kcal.training_day_max < 1000 || targets.energy_kcal.training_day_max > 10000) {
      throw new Error('training_day_max must be between 1000 and 10000 kcal');
    }

    // Validate all numeric target fields with field-specific ranges
    const fieldValidations = {
      'protein_g_min': { min: 0, max: 1000, unit: 'g' },
      'fat_g_min': { min: 0, max: 1000, unit: 'g' },
      'carbs_g_min': { min: 0, max: 1000, unit: 'g' },
      'fiber_g_min': { min: 0, max: 200, unit: 'g' },
      'sat_fat_g_max': { min: 0, max: 200, unit: 'g' },
      'sodium_mg_max': { min: 0, max: 10000, unit: 'mg' },
      'potassium_mg_min': { min: 0, max: 10000, unit: 'mg' },
      'fruit_veg_servings_min': { min: 0, max: 20, unit: 'servings' }
    };

    for (const [field, constraints] of Object.entries(fieldValidations)) {
      if (targets[field] === undefined) {
        throw new Error(`Profile targets must have ${field}`);
      }
      const value = targets[field];
      if (typeof value !== 'number' || value < constraints.min || value > constraints.max) {
        throw new Error(`Invalid value for ${field}: must be between ${constraints.min} and ${constraints.max} ${constraints.unit}, got ${value}`);
      }
    }

    // Validate monitoring section exists (but allow flexible structure)
    if (!profile.monitoring || typeof profile.monitoring !== 'object') {
      throw new Error('Profile must have monitoring section');
    }

    return true;
  }

  /**
   * Invalidate cache for a user (call after external profile updates)
   * @param {number} userId - Telegram user ID
   */
  invalidateCache(userId) {
    try {
      const normalizedUserId = this._validateAndNormalizeUserId(userId);
      if (this.cache.has(normalizedUserId)) {
        this.cache.delete(normalizedUserId);
        console.log(`[ProfileManager] Invalidated cache for user ${normalizedUserId}`);
      }
    } catch (error) {
      console.warn(`[ProfileManager] Invalid userId for cache invalidation: ${userId}`);
    }
  }

  /**
   * Clear all cached profiles
   */
  clearCache() {
    this.cache.clear();
    console.log('[ProfileManager] Cleared all profile cache');
  }

  /**
   * Cleanup stale cache entries and enforce size limits (LRU eviction)
   * @private
   */
  _cleanupCache() {
    const now = Date.now();

    // Remove stale entries (beyond TTL)
    let staleCount = 0;
    for (const [userId, cached] of this.cache.entries()) {
      if (now - cached.loadedAt >= this.TTL) {
        this.cache.delete(userId);
        staleCount++;
      }
    }

    if (staleCount > 0) {
      console.log(`[ProfileManager] Cleaned up ${staleCount} stale cache entries`);
    }

    // Enforce max cache size using LRU eviction
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries());
      // Sort by loadedAt (oldest first)
      entries.sort((a, b) => a[1].loadedAt - b[1].loadedAt);

      const toRemove = this.cache.size - this.MAX_CACHE_SIZE;
      for (let i = 0; i < toRemove; i++) {
        this.cache.delete(entries[i][0]);
      }

      console.log(`[ProfileManager] Evicted ${toRemove} entries from cache (LRU)`);
    }
  }

  /**
   * Preload profiles for known users (call on startup)
   * @param {number[]} userIds - Array of user IDs to preload
   */
  async preloadProfiles(userIds) {
    if (!Array.isArray(userIds)) {
      throw new Error('userIds must be an array');
    }

    // Validate and filter user IDs
    const validUserIds = userIds.filter(id => {
      try {
        this._validateAndNormalizeUserId(id);
        return true;
      } catch (error) {
        console.warn(`[ProfileManager] Skipping invalid userId in preload: ${id}`);
        return false;
      }
    });

    console.log(`[ProfileManager] Preloading profiles for ${validUserIds.length} users`);
    const promises = validUserIds.map(userId =>
      this.loadProfile(userId).catch(err => {
        console.warn(`[ProfileManager] Failed to preload profile for user ${userId}:`, err.message);
      })
    );
    await Promise.all(promises);
    console.log('[ProfileManager] Profile preloading complete');
  }

  /**
   * Get cache statistics for monitoring
   * @returns {Object} Cache stats
   */
  getCacheStats() {
    const now = Date.now();
    let fresh = 0;
    let stale = 0;
    let totalSize = 0;
    let totalAge = 0;

    for (const [userId, cached] of this.cache.entries()) {
      const age = now - cached.loadedAt;
      totalAge += age;

      if (age < this.TTL) {
        fresh++;
      } else {
        stale++;
      }

      // Estimate size in bytes
      totalSize += JSON.stringify(cached.profile).length;
    }

    return {
      total: this.cache.size,
      fresh,
      stale,
      totalSizeBytes: totalSize,
      avgAgeMs: this.cache.size > 0 ? totalAge / this.cache.size : 0,
      hitRate: this.cache.size > 0 ? fresh / this.cache.size : 0,
      maxSize: this.MAX_CACHE_SIZE
    };
  }

  /**
   * Cleanup resources (call on shutdown)
   */
  destroy() {
    if (this._cleanupInterval) {
      clearInterval(this._cleanupInterval);
      this._cleanupInterval = null;
    }
    this.clearCache();
    this.loadingLocks.clear();
    console.log('[ProfileManager] Destroyed');
  }
}

module.exports = ProfileManager;
