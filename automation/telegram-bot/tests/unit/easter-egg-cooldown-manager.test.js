// tests/unit/easter-egg-cooldown-manager.test.js - Comprehensive tests for EasterEggCooldownManager

// Mock the cleanup interval to prevent actual timers during tests
jest.useFakeTimers();

// Import after mocking
const cooldownManager = require('../../src/easter-egg-cooldown-manager');

describe('EasterEggCooldownManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    // Clear all cooldowns between tests
    cooldownManager.easterEggCooldowns.clear();
    cooldownManager.cooldownLastAccess.clear();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Easter Egg Type Configuration', () => {
    it('should have correct cooldown durations for all easter egg types', () => {
      const expectedDurations = {
        person_without_food: 7 * 24 * 60 * 60 * 1000,  // 7 days
        pet: 3 * 24 * 60 * 60 * 1000,                   // 3 days
        empty_plate: 2 * 24 * 60 * 60 * 1000,           // 2 days
        midnight_munchies: 12 * 60 * 60 * 1000,         // 12 hours
        celebration: 30 * 24 * 60 * 60 * 1000,          // 30 days
        non_food_item: 7 * 24 * 60 * 60 * 1000,         // 7 days
        shopping_scene: 3 * 24 * 60 * 60 * 1000,        // 3 days
        screenshot: 2 * 24 * 60 * 60 * 1000,            // 2 days
        empty_packaging: 2 * 24 * 60 * 60 * 1000        // 2 days
      };

      for (const [type, expectedDuration] of Object.entries(expectedDurations)) {
        expect(cooldownManager.getCooldownDuration(type)).toBe(expectedDuration);
      }
    });

    it('should return default cooldown for unknown easter egg type', () => {
      const unknownType = 'unknown_easter_egg';
      const defaultDuration = 7 * 24 * 60 * 60 * 1000; // 7 days

      const duration = cooldownManager.getCooldownDuration(unknownType);
      expect(duration).toBe(defaultDuration);
    });
  });

  describe('Cooldown Checking', () => {
    it('should return not on cooldown for user with no history', () => {
      const userId = 123456;
      const easterEggType = 'person_without_food';

      const result = cooldownManager.checkEasterEggCooldown(userId, easterEggType);

      expect(result).toEqual({
        onCooldown: false,
        remainingMs: 0,
        lastTriggered: null,
        nextAvailable: null
      });
    });

    it('should return not on cooldown for never-triggered easter egg', () => {
      const userId = 123456;

      // Record a different easter egg type
      cooldownManager.recordEasterEggTrigger(userId, 'pet');

      // Check a different type that was never triggered
      const result = cooldownManager.checkEasterEggCooldown(userId, 'person_without_food');

      expect(result).toEqual({
        onCooldown: false,
        remainingMs: 0,
        lastTriggered: null,
        nextAvailable: null
      });
    });

    it('should return on cooldown immediately after trigger', () => {
      const userId = 123456;
      const easterEggType = 'person_without_food';

      // Record trigger
      cooldownManager.recordEasterEggTrigger(userId, easterEggType);

      // Check immediately
      const result = cooldownManager.checkEasterEggCooldown(userId, easterEggType);

      expect(result.onCooldown).toBe(true);
      expect(result.remainingMs).toBeGreaterThan(0);
      expect(result.lastTriggered).toBeInstanceOf(Date);
      expect(result.nextAvailable).toBeInstanceOf(Date);
    });

    it('should calculate correct remaining time for active cooldown', () => {
      const userId = 123456;
      const easterEggType = 'midnight_munchies'; // 12 hours cooldown

      // Record trigger
      cooldownManager.recordEasterEggTrigger(userId, easterEggType);

      // Advance time by 6 hours
      jest.advanceTimersByTime(6 * 60 * 60 * 1000);

      const result = cooldownManager.checkEasterEggCooldown(userId, easterEggType);

      expect(result.onCooldown).toBe(true);
      // Should have approximately 6 hours remaining (with small margin for execution time)
      expect(result.remainingMs).toBeGreaterThan(5.9 * 60 * 60 * 1000);
      expect(result.remainingMs).toBeLessThan(6.1 * 60 * 60 * 1000);
    });

    it('should return not on cooldown after expiration', () => {
      const userId = 123456;
      const easterEggType = 'midnight_munchies'; // 12 hours cooldown

      // Record trigger
      cooldownManager.recordEasterEggTrigger(userId, easterEggType);

      // Advance time past cooldown period
      jest.advanceTimersByTime(13 * 60 * 60 * 1000);

      const result = cooldownManager.checkEasterEggCooldown(userId, easterEggType);

      expect(result.onCooldown).toBe(false);
      expect(result.remainingMs).toBe(0);
      expect(result.lastTriggered).toBeInstanceOf(Date);
      expect(result.nextAvailable).toBeNull();
    });

    it('should handle multiple easter egg types independently per user', () => {
      const userId = 123456;

      // Record triggers for different types
      cooldownManager.recordEasterEggTrigger(userId, 'person_without_food');
      jest.advanceTimersByTime(1000); // Small delay
      cooldownManager.recordEasterEggTrigger(userId, 'pet');

      // Both should be on cooldown
      expect(cooldownManager.checkEasterEggCooldown(userId, 'person_without_food').onCooldown).toBe(true);
      expect(cooldownManager.checkEasterEggCooldown(userId, 'pet').onCooldown).toBe(true);

      // Advance time past pet cooldown (3 days) but not person cooldown (7 days)
      jest.advanceTimersByTime(4 * 24 * 60 * 60 * 1000);

      // Pet cooldown should be expired, person should still be active
      expect(cooldownManager.checkEasterEggCooldown(userId, 'pet').onCooldown).toBe(false);
      expect(cooldownManager.checkEasterEggCooldown(userId, 'person_without_food').onCooldown).toBe(true);
    });

    it('should isolate cooldowns between different users', () => {
      const userId1 = 111111;
      const userId2 = 222222;
      const easterEggType = 'person_without_food';

      // Record trigger for user1 only
      cooldownManager.recordEasterEggTrigger(userId1, easterEggType);

      // User1 should be on cooldown, user2 should not
      expect(cooldownManager.checkEasterEggCooldown(userId1, easterEggType).onCooldown).toBe(true);
      expect(cooldownManager.checkEasterEggCooldown(userId2, easterEggType).onCooldown).toBe(false);
    });
  });

  describe('Recording Easter Egg Triggers', () => {
    it('should record trigger timestamp correctly', () => {
      const userId = 123456;
      const easterEggType = 'person_without_food';
      const beforeRecord = Date.now();

      cooldownManager.recordEasterEggTrigger(userId, easterEggType);

      const result = cooldownManager.checkEasterEggCooldown(userId, easterEggType);
      const afterRecord = Date.now();

      expect(result.lastTriggered.getTime()).toBeGreaterThanOrEqual(beforeRecord);
      expect(result.lastTriggered.getTime()).toBeLessThanOrEqual(afterRecord);
    });

    it('should update cooldown when triggering same easter egg twice', () => {
      const userId = 123456;
      const easterEggType = 'midnight_munchies'; // 12 hours

      // First trigger
      cooldownManager.recordEasterEggTrigger(userId, easterEggType);
      const firstCheck = cooldownManager.checkEasterEggCooldown(userId, easterEggType);

      // Advance time by 11 hours (still on cooldown)
      jest.advanceTimersByTime(11 * 60 * 60 * 1000);

      // Check cooldown before second trigger (should be nearly expired)
      const beforeSecondTrigger = cooldownManager.checkEasterEggCooldown(userId, easterEggType);
      expect(beforeSecondTrigger.remainingMs).toBeLessThan(2 * 60 * 60 * 1000); // Less than 2 hours

      // Second trigger (should reset cooldown)
      cooldownManager.recordEasterEggTrigger(userId, easterEggType);
      const secondCheck = cooldownManager.checkEasterEggCooldown(userId, easterEggType);

      // After second trigger, should have nearly full cooldown period again
      expect(secondCheck.remainingMs).toBeGreaterThanOrEqual(firstCheck.remainingMs);
      expect(secondCheck.remainingMs).toBeGreaterThanOrEqual(11.9 * 60 * 60 * 1000);
    });

    it('should handle unknown easter egg type with default cooldown', () => {
      const userId = 123456;
      const unknownType = 'unknown_easter_egg';

      // Should not throw error
      expect(() => {
        cooldownManager.recordEasterEggTrigger(userId, unknownType);
      }).not.toThrow();

      // Should use default 7-day cooldown
      const result = cooldownManager.checkEasterEggCooldown(userId, unknownType);
      expect(result.onCooldown).toBe(true);
    });

    it('should update LRU access time on record', () => {
      const userId = 123456;
      const easterEggType = 'person_without_food';

      cooldownManager.recordEasterEggTrigger(userId, easterEggType);
      const accessTime = cooldownManager.cooldownLastAccess.get(String(userId));

      expect(accessTime).toBeDefined();
      expect(accessTime).toBeGreaterThan(0);
    });
  });

  describe('User Cooldown Management', () => {
    it('should clear all cooldowns for a user', () => {
      const userId = 123456;

      // Record multiple easter eggs
      cooldownManager.recordEasterEggTrigger(userId, 'person_without_food');
      cooldownManager.recordEasterEggTrigger(userId, 'pet');
      cooldownManager.recordEasterEggTrigger(userId, 'empty_plate');

      // Verify they're on cooldown
      expect(cooldownManager.checkEasterEggCooldown(userId, 'person_without_food').onCooldown).toBe(true);
      expect(cooldownManager.checkEasterEggCooldown(userId, 'pet').onCooldown).toBe(true);

      // Clear all cooldowns
      cooldownManager.clearUserCooldowns(userId);

      // Verify they're all cleared
      expect(cooldownManager.checkEasterEggCooldown(userId, 'person_without_food').onCooldown).toBe(false);
      expect(cooldownManager.checkEasterEggCooldown(userId, 'pet').onCooldown).toBe(false);
      expect(cooldownManager.checkEasterEggCooldown(userId, 'empty_plate').onCooldown).toBe(false);
    });

    it('should handle clearing cooldowns for user with no cooldowns', () => {
      const userId = 123456;

      // Should not throw error
      expect(() => {
        cooldownManager.clearUserCooldowns(userId);
      }).not.toThrow();
    });

    it('should get all active cooldowns for a user', () => {
      const userId = 123456;

      // Record multiple easter eggs
      cooldownManager.recordEasterEggTrigger(userId, 'person_without_food');
      cooldownManager.recordEasterEggTrigger(userId, 'pet');

      const cooldowns = cooldownManager.getUserCooldowns(userId);

      expect(Object.keys(cooldowns)).toHaveLength(2);
      expect(cooldowns.person_without_food).toBeDefined();
      expect(cooldowns.person_without_food.isActive).toBe(true);
      expect(cooldowns.pet).toBeDefined();
      expect(cooldowns.pet.isActive).toBe(true);
    });

    it('should return empty object for user with no cooldowns', () => {
      const userId = 123456;

      const cooldowns = cooldownManager.getUserCooldowns(userId);

      expect(cooldowns).toEqual({});
    });
  });

  describe('Cleanup and Eviction', () => {
    it('should clean up expired cooldowns', () => {
      const userId = 123456;
      const shortCooldownType = 'midnight_munchies'; // 12 hours
      const longCooldownType = 'person_without_food'; // 7 days

      // Record both
      cooldownManager.recordEasterEggTrigger(userId, shortCooldownType);
      cooldownManager.recordEasterEggTrigger(userId, longCooldownType);

      // Advance time past short cooldown but not long cooldown
      jest.advanceTimersByTime(13 * 60 * 60 * 1000);

      // Run cleanup
      cooldownManager.cleanupExpiredCooldowns();

      // Short cooldown should be removed, long cooldown should remain
      const userCooldowns = cooldownManager.easterEggCooldowns.get(String(userId));
      expect(userCooldowns.has(shortCooldownType)).toBe(false);
      expect(userCooldowns.has(longCooldownType)).toBe(true);
    });

    it('should remove user entry when all cooldowns expired', () => {
      const userId = 123456;
      const easterEggType = 'midnight_munchies'; // 12 hours

      // Record trigger
      cooldownManager.recordEasterEggTrigger(userId, easterEggType);

      // Advance time past cooldown
      jest.advanceTimersByTime(13 * 60 * 60 * 1000);

      // Run cleanup
      cooldownManager.cleanupExpiredCooldowns();

      // User should be completely removed
      expect(cooldownManager.easterEggCooldowns.has(String(userId))).toBe(false);
      expect(cooldownManager.cooldownLastAccess.has(String(userId))).toBe(false);
    });

    it('should evict LRU entry when hitting max entries', () => {
      // Set low limit for testing
      const originalLimit = cooldownManager.maxCooldownEntries;
      cooldownManager.maxCooldownEntries = 3;

      // Add 3 users
      cooldownManager.recordEasterEggTrigger(111111, 'person_without_food');
      jest.advanceTimersByTime(1000);
      cooldownManager.recordEasterEggTrigger(222222, 'person_without_food');
      jest.advanceTimersByTime(1000);
      cooldownManager.recordEasterEggTrigger(333333, 'person_without_food');

      // Access user 222222 to make it more recently used
      jest.advanceTimersByTime(1000);
      cooldownManager.checkEasterEggCooldown(222222, 'person_without_food');

      // Add 4th user (should evict user 111111, which is LRU)
      jest.advanceTimersByTime(1000);
      cooldownManager.recordEasterEggTrigger(444444, 'person_without_food');

      // User 111111 should be evicted (was LRU)
      expect(cooldownManager.easterEggCooldowns.has('111111')).toBe(false);
      // Others should remain
      expect(cooldownManager.easterEggCooldowns.has('222222')).toBe(true);
      expect(cooldownManager.easterEggCooldowns.has('333333')).toBe(true);
      expect(cooldownManager.easterEggCooldowns.has('444444')).toBe(true);

      // Restore original limit
      cooldownManager.maxCooldownEntries = originalLimit;
    });

    it('should update LRU on cooldown check', () => {
      const userId1 = 111111;
      const userId2 = 222222;

      // Record for both users
      cooldownManager.recordEasterEggTrigger(userId1, 'person_without_food');
      const initialAccess1 = cooldownManager.cooldownLastAccess.get(String(userId1));

      jest.advanceTimersByTime(1000);
      cooldownManager.recordEasterEggTrigger(userId2, 'person_without_food');

      // Check user1 (should update LRU)
      jest.advanceTimersByTime(1000);
      cooldownManager.checkEasterEggCooldown(userId1, 'person_without_food');
      const updatedAccess1 = cooldownManager.cooldownLastAccess.get(String(userId1));

      // LRU time should be updated
      expect(updatedAccess1).toBeGreaterThan(initialAccess1);
    });
  });

  describe('Statistics and Monitoring', () => {
    it('should return correct statistics for empty state', () => {
      const stats = cooldownManager.getCooldownStats();

      expect(stats).toEqual({
        totalUsers: 0,
        totalCooldowns: 0,
        activeCooldowns: 0,
        expiredCooldowns: 0,
        cooldownsByType: {},
        maxCooldownEntries: cooldownManager.maxCooldownEntries,
        cleanupInterval: cooldownManager.cleanupInterval,
        memoryUsage: {
          usersTracked: 0,
          lruEntriesTracked: 0
        }
      });
    });

    it('should return correct statistics with active cooldowns', () => {
      const userId1 = 111111;
      const userId2 = 222222;

      // Record multiple cooldowns
      cooldownManager.recordEasterEggTrigger(userId1, 'person_without_food');
      cooldownManager.recordEasterEggTrigger(userId1, 'pet');
      cooldownManager.recordEasterEggTrigger(userId2, 'empty_plate');

      const stats = cooldownManager.getCooldownStats();

      expect(stats.totalUsers).toBe(2);
      expect(stats.totalCooldowns).toBe(3);
      expect(stats.activeCooldowns).toBe(3);
      expect(stats.expiredCooldowns).toBe(0);
      expect(stats.cooldownsByType).toEqual({
        person_without_food: 1,
        pet: 1,
        empty_plate: 1
      });
    });

    it('should distinguish between active and expired cooldowns in stats', () => {
      const userId = 123456;

      // Record short cooldown
      cooldownManager.recordEasterEggTrigger(userId, 'midnight_munchies'); // 12 hours
      // Record long cooldown
      cooldownManager.recordEasterEggTrigger(userId, 'person_without_food'); // 7 days

      // Advance time past short cooldown
      jest.advanceTimersByTime(13 * 60 * 60 * 1000);

      const stats = cooldownManager.getCooldownStats();

      expect(stats.totalCooldowns).toBe(2);
      expect(stats.activeCooldowns).toBe(1); // Only person_without_food is active
      expect(stats.expiredCooldowns).toBe(1); // midnight_munchies is expired
      expect(stats.cooldownsByType).toEqual({
        person_without_food: 1
      });
    });
  });

  describe('Type Conversion and Edge Cases', () => {
    it('should handle userId as number', () => {
      const userId = 123456; // Number

      cooldownManager.recordEasterEggTrigger(userId, 'person_without_food');
      const result = cooldownManager.checkEasterEggCooldown(userId, 'person_without_food');

      expect(result.onCooldown).toBe(true);
    });

    it('should handle userId as string', () => {
      const userId = '123456'; // String

      cooldownManager.recordEasterEggTrigger(userId, 'person_without_food');
      const result = cooldownManager.checkEasterEggCooldown(userId, 'person_without_food');

      expect(result.onCooldown).toBe(true);
    });

    it('should treat numeric and string userId as same user', () => {
      const userIdNum = 123456;
      const userIdStr = '123456';

      // Record with number
      cooldownManager.recordEasterEggTrigger(userIdNum, 'person_without_food');

      // Check with string (should be on cooldown)
      const result = cooldownManager.checkEasterEggCooldown(userIdStr, 'person_without_food');

      expect(result.onCooldown).toBe(true);
    });
  });
});
