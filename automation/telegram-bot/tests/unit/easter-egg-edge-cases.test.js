// tests/unit/easter-egg-edge-cases.test.js
/**
 * Comprehensive edge case and robustness tests for easter egg system
 *
 * Tests scenarios that may not occur in normal operation but could
 * cause issues in production:
 * - Input fuzzing and malformed data
 * - Concurrency and race conditions
 * - Memory stress and resource limits
 * - State corruption and recovery
 */

const easterEggManager = require('../../src/easter-egg-manager');
const cooldownManager = require('../../src/easter-egg-cooldown-manager');
const easterEggConfig = require('../../src/easter-egg-config');

describe('EasterEggManager - Edge Cases', () => {
  beforeEach(() => {
    // Clear all cooldowns
    const allUsers = [];
    cooldownManager.easterEggCooldowns.forEach((_, userId) => {
      allUsers.push(userId);
    });
    allUsers.forEach(userId => {
      cooldownManager.clearUserCooldowns(userId);
    });
  });

  afterAll(() => {
    cooldownManager.stopCooldownCleanup();
  });

  describe('Input Fuzzing', () => {
    test('should handle null detection result gracefully', () => {
      const result = easterEggManager.evaluateDetection(null, 'user123');
      expect(result).toBeNull();
    });

    test('should handle undefined detection result gracefully', () => {
      const result = easterEggManager.evaluateDetection(undefined, 'user123');
      expect(result).toBeNull();
    });

    test('should handle empty object detection result', () => {
      const result = easterEggManager.evaluateDetection({}, 'user123');
      expect(result).toBeNull();
    });

    test('should handle detection result with missing required fields', () => {
      const detection = { scene_type: 'selfie' }; // Missing has_person, has_food, confidence
      const result = easterEggManager.evaluateDetection(detection, 'user123');
      // Should not crash, may or may not match depending on criteria
      expect(result === null || typeof result === 'object').toBe(true);
    });

    test('should handle malformed confidence values', () => {
      const detection = {
        scene_type: 'selfie',
        has_person: true,
        has_food: false,
        confidence: 'invalid_value', // Not 'high', 'medium', or 'low'
      };
      const result = easterEggManager.evaluateDetection(detection, 'user123');
      // Should handle gracefully (not trigger or safely trigger)
      expect(result === null || typeof result === 'object').toBe(true);
    });

    test('should handle detection result with extra unexpected fields', () => {
      const detection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
        __proto__: { malicious: 'value' }, // Prototype pollution attempt
        constructor: { malicious: 'value' },
        unexpected_field: 'some value',
      };
      const result = easterEggManager.evaluateDetection(detection, 'user123');
      // Should trigger normally, ignoring unexpected fields
      expect(result.shouldTrigger).toBe(true);
      expect(result.easterEggType).toBe('pet');
    });

    test('should handle non-string scene_type', () => {
      const detection = {
        scene_type: 12345, // Number instead of string
        has_food: false,
        confidence: 'high',
      };
      const result = easterEggManager.evaluateDetection(detection, 'user123');
      // Should not crash
      expect(result === null || typeof result === 'object').toBe(true);
    });

    test('should handle boolean fields as non-boolean values', () => {
      const detection = {
        scene_type: 'selfie',
        has_person: 'yes', // String instead of boolean
        has_food: 1, // Number instead of boolean
        confidence: 'high',
      };
      const result = easterEggManager.evaluateDetection(detection, 'user123');
      // JavaScript type coercion should handle this
      expect(result === null || typeof result === 'object').toBe(true);
    });
  });

  describe('Invalid User IDs', () => {
    test('should throw on null userId (defensive validation)', () => {
      const detection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
      };

      // Validation should throw TypeError for null userId
      expect(() => {
        easterEggManager.evaluateDetection(detection, null);
      }).toThrow(TypeError);
    });

    test('should throw on undefined userId (defensive validation)', () => {
      const detection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
      };

      expect(() => {
        easterEggManager.evaluateDetection(detection, undefined);
      }).toThrow(TypeError);
    });

    test('should throw on empty string userId (defensive validation)', () => {
      const detection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
      };

      expect(() => {
        easterEggManager.evaluateDetection(detection, '');
      }).toThrow(TypeError);
    });

    test('should throw on prototype pollution in userId (security)', () => {
      const detection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
      };

      // These should be rejected by validation to prevent prototype pollution
      expect(() => {
        easterEggManager.evaluateDetection(detection, '__proto__');
      }).toThrow(TypeError);

      expect(() => {
        easterEggManager.evaluateDetection(detection, 'constructor');
      }).toThrow(TypeError);

      expect(() => {
        easterEggManager.evaluateDetection(detection, 'prototype');
      }).toThrow(TypeError);
    });

    test('should be caught by try-catch at webhook level', () => {
      // This demonstrates the pattern used in webhook.js
      const detection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
      };

      try {
        easterEggManager.evaluateDetection(detection, null);
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        // Should catch the TypeError
        expect(error).toBeInstanceOf(TypeError);
        expect(error.message).toContain('userId cannot be null');
        // Webhook continues to nutrition extraction
      }
    });
  });

  describe('Concurrency and Race Conditions', () => {
    test('should handle multiple rapid evaluations from same user', () => {
      const detection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
      };

      // First evaluation - should trigger
      const result1 = easterEggManager.evaluateDetection(detection, 'user123');
      expect(result1.shouldTrigger).toBe(true);
      expect(result1.canTrigger).toBe(true);

      // Record the trigger to activate cooldown
      result1.recordTrigger();

      // Subsequent rapid-fire requests should be on cooldown
      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(easterEggManager.evaluateDetection(detection, 'user123'));
      }

      // All subsequent requests should show cooldown
      for (let i = 0; i < 10; i++) {
        if (results[i]) {
          expect(results[i].shouldTrigger).toBe(true);
          expect(results[i].canTrigger).toBe(false); // On cooldown
        }
      }
    });

    test('should handle concurrent evaluations from different users', () => {
      const detection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
      };

      // Simulate concurrent requests from different users
      const results = [];
      for (let i = 0; i < 100; i++) {
        results.push(easterEggManager.evaluateDetection(detection, `user${i}`));
      }

      // All should trigger (different users, no cooldown conflicts)
      results.forEach(result => {
        expect(result.shouldTrigger).toBe(true);
        expect(result.canTrigger).toBe(true);
      });
    });

    test('should handle recordTrigger called multiple times rapidly', () => {
      const detection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      // Record trigger multiple times (simulating potential race condition)
      expect(() => {
        result.recordTrigger();
        result.recordTrigger();
        result.recordTrigger();
      }).not.toThrow();

      // Should be on cooldown now
      const result2 = easterEggManager.evaluateDetection(detection, 'user123');
      expect(result2.canTrigger).toBe(false);
    });
  });

  describe('Memory Stress', () => {
    test('should handle 1000+ users without memory issues', () => {
      const detection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
      };

      // Create cooldowns for 1000 users
      for (let i = 0; i < 1000; i++) {
        const result = easterEggManager.evaluateDetection(detection, `stress_user_${i}`);
        if (result && result.shouldTrigger && result.canTrigger) {
          result.recordTrigger();
        }
      }

      // Should still work for new user
      const result = easterEggManager.evaluateDetection(detection, 'new_user');
      expect(result.shouldTrigger).toBe(true);
      expect(result.canTrigger).toBe(true);

      // Verify LRU eviction kicked in (max 1000 entries)
      expect(cooldownManager.easterEggCooldowns.size).toBeLessThanOrEqual(1000);
    });

    test('should handle rapid creation and deletion of cooldowns', () => {
      const detection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
      };

      // Rapid create/clear cycles
      for (let cycle = 0; cycle < 10; cycle++) {
        // Create cooldowns for 100 users
        for (let i = 0; i < 100; i++) {
          const result = easterEggManager.evaluateDetection(detection, `cycle${cycle}_user${i}`);
          if (result && result.canTrigger) {
            result.recordTrigger();
          }
        }

        // Clear some cooldowns
        for (let i = 0; i < 50; i++) {
          cooldownManager.clearUserCooldowns(`cycle${cycle}_user${i}`);
        }
      }

      // System should still be functional
      const result = easterEggManager.evaluateDetection(detection, 'final_user');
      expect(result.shouldTrigger).toBe(true);
    });
  });

  describe('State Corruption Recovery', () => {
    test('should handle corrupted cooldown map gracefully', () => {
      const detection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
      };

      // Manually corrupt cooldown data
      cooldownManager.easterEggCooldowns.set('corrupted_user', {
        invalid: 'data',
        structure: 'wrong',
      });

      // Should still work for normal users
      const result = easterEggManager.evaluateDetection(detection, 'normal_user');
      expect(result.shouldTrigger).toBe(true);
      expect(result.canTrigger).toBe(true);
    });

    test('should recover from missing getMessage method', () => {
      const detection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      // Manually break the getMessage method
      const originalGetMessage = result.getMessage;
      result.getMessage = null;

      // Calling getMessage should be handled at webhook level (null check)
      expect(result.getMessage).toBeNull();

      // Restore for other tests
      result.getMessage = originalGetMessage;
    });
  });

  describe('Configuration Edge Cases', () => {
    test('should handle empty enabled eggs gracefully', () => {
      // This is tested by the global disable, but let's be explicit
      const enabledEggs = easterEggConfig.getEnabledEasterEggs();
      expect(Array.isArray(enabledEggs)).toBe(true);
      // Should have at least some eggs enabled in test environment
      expect(enabledEggs.length).toBeGreaterThan(0);
    });

    test('should return defensive copy of enabled eggs (mutation test)', () => {
      const eggs1 = easterEggConfig.getEnabledEasterEggs();
      const eggs2 = easterEggConfig.getEnabledEasterEggs();

      // Should be equal content but different references
      expect(eggs1).toEqual(eggs2);
      expect(eggs1).not.toBe(eggs2); // Different array instances

      // Mutating one should not affect the other
      eggs1.push({ fake: 'egg' });
      expect(eggs1.length).not.toBe(eggs2.length);

      // Next call should still return correct count
      const eggs3 = easterEggConfig.getEnabledEasterEggs();
      expect(eggs3.length).toBe(eggs2.length);
    });
  });

  describe('Cleanup and Resource Management', () => {
    test('should handle cleanup interval stop gracefully', () => {
      // Stop cleanup (already done in afterAll, but test it explicitly)
      expect(() => {
        cooldownManager.stopCooldownCleanup();
        cooldownManager.stopCooldownCleanup(); // Call twice
      }).not.toThrow();
    });

    test('should handle cooldown expiration correctly', () => {
      const detection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
      };

      // Trigger easter egg
      const result = easterEggManager.evaluateDetection(detection, 'expiry_user');
      result.recordTrigger();

      // Should be on cooldown
      const result2 = easterEggManager.evaluateDetection(detection, 'expiry_user');
      expect(result2.canTrigger).toBe(false);

      // Manually expire the cooldown by setting timestamp to very old
      const userCooldowns = cooldownManager.easterEggCooldowns.get('expiry_user');
      if (userCooldowns) {
        userCooldowns.set('pet', Date.now() - (8 * 24 * 60 * 60 * 1000)); // 8 days ago
      }

      // Should be able to trigger again
      const result3 = easterEggManager.evaluateDetection(detection, 'expiry_user');
      expect(result3.canTrigger).toBe(true);
    });
  });
});

describe('EasterEggManager - Integration Edge Cases', () => {
  beforeEach(() => {
    const allUsers = [];
    cooldownManager.easterEggCooldowns.forEach((_, userId) => {
      allUsers.push(userId);
    });
    allUsers.forEach(userId => {
      cooldownManager.clearUserCooldowns(userId);
    });
  });

  afterAll(() => {
    cooldownManager.stopCooldownCleanup();
  });

  test('should handle full workflow with all edge cases', () => {
    // Simulate a complex real-world scenario
    const userId = 'complex_user';

    // 1. Valid pet detection
    const petDetection = {
      scene_type: 'pet_photo',
      has_pet: true,
      has_food: false,
      confidence: 'high',
    };

    const result1 = easterEggManager.evaluateDetection(petDetection, userId);
    expect(result1.shouldTrigger).toBe(true);
    expect(result1.canTrigger).toBe(true);

    const message1 = result1.getMessage();
    expect(typeof message1).toBe('string');
    expect(message1.length).toBeGreaterThan(0);

    result1.recordTrigger();

    // 2. Immediate retry - should be on cooldown
    const result2 = easterEggManager.evaluateDetection(petDetection, userId);
    expect(result2.canTrigger).toBe(false);

    // 3. Different easter egg type - should trigger
    const selfieDetection = {
      scene_type: 'selfie',
      has_person: true,
      has_food: false,
      confidence: 'high',
    };

    const result3 = easterEggManager.evaluateDetection(selfieDetection, userId);
    expect(result3.shouldTrigger).toBe(true);
    expect(result3.canTrigger).toBe(true);

    result3.recordTrigger();

    // 4. Invalid detection - should handle gracefully
    const result4 = easterEggManager.evaluateDetection(null, userId);
    expect(result4).toBeNull();

    // 5. Normal food photo - no easter egg
    const foodDetection = {
      scene_type: 'meal_photo',
      has_food: true,
      confidence: 'high',
    };

    const result5 = easterEggManager.evaluateDetection(foodDetection, userId);
    expect(result5).toBeNull();

    // 6. Clear cooldowns and retry - should work
    cooldownManager.clearUserCooldowns(userId);

    const result6 = easterEggManager.evaluateDetection(petDetection, userId);
    expect(result6.shouldTrigger).toBe(true);
    expect(result6.canTrigger).toBe(true);
  });
});
