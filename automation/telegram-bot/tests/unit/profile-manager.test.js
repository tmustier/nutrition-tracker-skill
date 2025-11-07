/**
 * Unit tests for ProfileManager
 * Focus: Security-critical functionality (path traversal, validation, cache limits)
 */

const ProfileManager = require('../../src/profile-manager');

describe('ProfileManager Security Tests', () => {
  let profileManager;
  let mockGithub;

  beforeEach(() => {
    // Mock GitHub integration
    mockGithub = {
      apiUrl: 'https://api.github.com',
      owner: 'test-owner',
      repo: 'test-repo',
      token: 'test-token',
      branch: 'main',
      checkRateLimit: jest.fn(),
    };

    profileManager = new ProfileManager(mockGithub);
  });

  afterEach(() => {
    // Cleanup intervals
    if (profileManager) {
      profileManager.destroy();
    }
  });

  describe('Path Traversal Prevention', () => {
    test('should reject userId with ../', async () => {
      const maliciousId = '../../../etc/passwd';
      const profile = await profileManager.loadProfile(maliciousId);

      // Should return default profile, not attempt to load malicious path
      expect(profile).toEqual(profileManager.getDefaultProfile());
    });

    test('should reject userId with ..', async () => {
      const maliciousId = '..';
      const profile = await profileManager.loadProfile(maliciousId);

      expect(profile).toEqual(profileManager.getDefaultProfile());
    });

    test('should reject userId with forward slash', async () => {
      const maliciousId = '123/456';
      const profile = await profileManager.loadProfile(maliciousId);

      expect(profile).toEqual(profileManager.getDefaultProfile());
    });

    test('should reject userId with backslash', async () => {
      const maliciousId = '123\\456';
      const profile = await profileManager.loadProfile(maliciousId);

      expect(profile).toEqual(profileManager.getDefaultProfile());
    });

    test('should reject negative userId', async () => {
      const profile = await profileManager.loadProfile(-123);

      expect(profile).toEqual(profileManager.getDefaultProfile());
    });

    test('should reject zero userId', async () => {
      const profile = await profileManager.loadProfile(0);

      expect(profile).toEqual(profileManager.getDefaultProfile());
    });

    test('should accept valid positive integer userId', async () => {
      const validId = 123456789;

      // Mock GitHub API call to return 404
      const axios = require('axios');
      jest.spyOn(axios, 'get').mockRejectedValue({
        response: { status: 404 }
      });

      const profile = await profileManager.loadProfile(validId);

      // Should attempt to load and fall back to default
      expect(profile).toEqual(profileManager.getDefaultProfile());
    });
  });

  describe('User ID Validation', () => {
    test('should reject string userId', async () => {
      const profile = await profileManager.loadProfile('not-a-number');

      expect(profile).toEqual(profileManager.getDefaultProfile());
    });

    test('should reject null userId', async () => {
      const profile = await profileManager.loadProfile(null);

      expect(profile).toEqual(profileManager.getDefaultProfile());
    });

    test('should reject undefined userId', async () => {
      const profile = await profileManager.loadProfile(undefined);

      expect(profile).toEqual(profileManager.getDefaultProfile());
    });

    test('should reject array userId', async () => {
      const profile = await profileManager.loadProfile([123]);

      expect(profile).toEqual(profileManager.getDefaultProfile());
    });

    test('should reject object userId', async () => {
      const profile = await profileManager.loadProfile({ id: 123 });

      expect(profile).toEqual(profileManager.getDefaultProfile());
    });

    test('should reject NaN', async () => {
      const profile = await profileManager.loadProfile(NaN);

      expect(profile).toEqual(profileManager.getDefaultProfile());
    });

    test('should reject Infinity', async () => {
      const profile = await profileManager.loadProfile(Infinity);

      expect(profile).toEqual(profileManager.getDefaultProfile());
    });

    test('should reject float userId', async () => {
      const profile = await profileManager.loadProfile(123.456);

      expect(profile).toEqual(profileManager.getDefaultProfile());
    });

    test('should normalize string number to integer', async () => {
      const axios = require('axios');
      jest.spyOn(axios, 'get').mockRejectedValue({
        response: { status: 404 }
      });

      const profile = await profileManager.loadProfile('123');

      // Should normalize and accept
      expect(profile).toEqual(profileManager.getDefaultProfile());
    });
  });

  describe('Profile Validation', () => {
    test('should reject profile without meta section', () => {
      const invalidProfile = {
        targets: { energy_kcal: { rest_day_max: 2000, training_day_max: 2400 } }
      };

      expect(() => profileManager.validateProfile(invalidProfile)).toThrow('Profile must have meta section');
    });

    test('should reject profile without targets section', () => {
      const invalidProfile = {
        meta: { owner: 'Test', timezone: 'UTC' }
      };

      expect(() => profileManager.validateProfile(invalidProfile)).toThrow('Profile must have targets section');
    });

    test('should reject profile without timezone', () => {
      const invalidProfile = {
        meta: { owner: 'Test' },
        targets: { energy_kcal: { rest_day_max: 2000, training_day_max: 2400 } }
      };

      expect(() => profileManager.validateProfile(invalidProfile)).toThrow('Profile meta must have timezone');
    });

    test('should reject profile without owner', () => {
      const invalidProfile = {
        meta: { timezone: 'UTC' },
        targets: { energy_kcal: { rest_day_max: 2000, training_day_max: 2400 } }
      };

      expect(() => profileManager.validateProfile(invalidProfile)).toThrow('Profile meta must have owner');
    });

    test('should reject profile with energy below minimum', () => {
      const invalidProfile = {
        meta: { owner: 'Test', timezone: 'UTC' },
        targets: {
          energy_kcal: { rest_day_max: 500, training_day_max: 600 },
          protein_g_min: 100,
          fat_g_min: 50,
          carbs_g_min: 150,
          fiber_g_min: 25,
          sat_fat_g_max: 15,
          sodium_mg_max: 2000,
          potassium_mg_min: 3000,
          fruit_veg_servings_min: 5
        },
        monitoring: {}
      };

      expect(() => profileManager.validateProfile(invalidProfile)).toThrow('rest_day_max must be between 1000 and 10000 kcal');
    });

    test('should reject profile with energy above maximum', () => {
      const invalidProfile = {
        meta: { owner: 'Test', timezone: 'UTC' },
        targets: {
          energy_kcal: { rest_day_max: 15000, training_day_max: 20000 },
          protein_g_min: 100,
          fat_g_min: 50,
          carbs_g_min: 150,
          fiber_g_min: 25,
          sat_fat_g_max: 15,
          sodium_mg_max: 2000,
          potassium_mg_min: 3000,
          fruit_veg_servings_min: 5
        },
        monitoring: {}
      };

      expect(() => profileManager.validateProfile(invalidProfile)).toThrow('rest_day_max must be between 1000 and 10000 kcal');
    });

    test('should reject profile with negative protein', () => {
      const invalidProfile = {
        meta: { owner: 'Test', timezone: 'UTC' },
        targets: {
          energy_kcal: { rest_day_max: 2000, training_day_max: 2400 },
          protein_g_min: -50,
          fat_g_min: 50,
          carbs_g_min: 150,
          fiber_g_min: 25,
          sat_fat_g_max: 15,
          sodium_mg_max: 2000,
          potassium_mg_min: 3000,
          fruit_veg_servings_min: 5
        },
        monitoring: {}
      };

      expect(() => profileManager.validateProfile(invalidProfile)).toThrow('Invalid value for protein_g_min');
    });

    test('should accept valid profile', () => {
      const validProfile = {
        meta: { owner: 'Test', timezone: 'UTC' },
        targets: {
          energy_kcal: { rest_day_max: 2000, training_day_max: 2400 },
          protein_g_min: 150,
          fat_g_min: 60,
          carbs_g_min: 200,
          fiber_g_min: 30,
          sat_fat_g_max: 20,
          sodium_mg_max: 2300,
          potassium_mg_min: 3500,
          fruit_veg_servings_min: 5
        },
        monitoring: {}
      };

      expect(() => profileManager.validateProfile(validProfile)).not.toThrow();
    });
  });

  describe('Cache Management', () => {
    test('should enforce MAX_CACHE_SIZE limit', async () => {
      const axios = require('axios');

      // Mock 404 responses for all requests
      jest.spyOn(axios, 'get').mockRejectedValue({
        response: { status: 404 }
      });

      // Load profiles to fill cache
      const promises = [];
      for (let i = 1; i <= 1050; i++) {
        promises.push(profileManager.loadProfile(i));
      }
      await Promise.all(promises);

      // Force cleanup
      profileManager._cleanupCache();

      // Check cache size
      const stats = profileManager.getCacheStats();
      expect(stats.total).toBeLessThanOrEqual(1000); // MAX_CACHE_SIZE
    });

    test('should return cache statistics', async () => {
      const axios = require('axios');
      jest.spyOn(axios, 'get').mockRejectedValue({
        response: { status: 404 }
      });

      await profileManager.loadProfile(123);
      await profileManager.loadProfile(456);

      const stats = profileManager.getCacheStats();

      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('fresh');
      expect(stats).toHaveProperty('stale');
      expect(stats).toHaveProperty('totalSizeBytes');
      expect(stats).toHaveProperty('maxSize');
      expect(stats.total).toBeGreaterThanOrEqual(2);
    });

    test('should clear cache on demand', async () => {
      const axios = require('axios');
      jest.spyOn(axios, 'get').mockRejectedValue({
        response: { status: 404 }
      });

      await profileManager.loadProfile(123);

      expect(profileManager.getCacheStats().total).toBeGreaterThan(0);

      profileManager.clearCache();

      expect(profileManager.getCacheStats().total).toBe(0);
    });

    test('should invalidate specific user cache', async () => {
      const axios = require('axios');
      jest.spyOn(axios, 'get').mockRejectedValue({
        response: { status: 404 }
      });

      await profileManager.loadProfile(123);
      await profileManager.loadProfile(456);

      expect(profileManager.getCacheStats().total).toBe(2);

      profileManager.invalidateCache(123);

      expect(profileManager.getCacheStats().total).toBe(1);
    });
  });

  describe('Default Profile', () => {
    test('should return consistent default profile', () => {
      const default1 = profileManager.getDefaultProfile();
      const default2 = profileManager.getDefaultProfile();

      expect(default1).toEqual(default2);
    });

    test('should have static timestamp in default profile', () => {
      const profile = profileManager.getDefaultProfile();

      // Should be a static timestamp, not current time
      expect(profile.meta.updated).toBe('2025-11-06T00:00:00Z');
    });

    test('should have all required fields in default profile', () => {
      const profile = profileManager.getDefaultProfile();

      expect(() => profileManager.validateProfile(profile)).not.toThrow();
    });
  });

  describe('Resource Cleanup', () => {
    test('should cleanup resources on destroy', () => {
      const pm = new ProfileManager(mockGithub);

      // Verify cleanup interval exists
      expect(pm._cleanupInterval).toBeDefined();

      pm.destroy();

      // Verify cleanup interval cleared
      expect(pm._cleanupInterval).toBeNull();

      // Verify cache cleared
      expect(pm.getCacheStats().total).toBe(0);
    });
  });
});
