// tests/unit/easter-egg-manager.test.js
const easterEggManager = require('../../src/easter-egg-manager'); // Singleton instance
const cooldownManager = require('../../src/easter-egg-cooldown-manager');

describe('EasterEggManager', () => {
  beforeEach(() => {
    // Clear cooldowns before each test
    const allUsers = [];
    cooldownManager.easterEggCooldowns.forEach((_, userId) => {
      allUsers.push(userId);
    });
    allUsers.forEach(userId => {
      cooldownManager.clearUserCooldowns(userId);
    });
  });

  describe('evaluateDetection', () => {
    test('should trigger person_without_food easter egg for selfie', () => {
      const detection = {
        scene_type: 'selfie',
        has_person: true,
        has_food: false,
        confidence: 'high',
        details: 'Person taking a selfie'
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      expect(result.shouldTrigger).toBe(true);
      expect(result.canTrigger).toBe(true);
      expect(result.easterEggType).toBe('person_without_food');
      expect(result.blocksNutritionExtraction).toBe(true);
    });

    test('should trigger pet easter egg for pet photo', () => {
      const detection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
        details: 'Dog photo'
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      expect(result.shouldTrigger).toBe(true);
      expect(result.canTrigger).toBe(true);
      expect(result.easterEggType).toBe('pet');
      expect(result.blocksNutritionExtraction).toBe(true);
    });

    test('should NOT trigger for meal photo', () => {
      const detection = {
        scene_type: 'meal_photo',
        has_food: true,
        confidence: 'high',
        details: 'Plate of pasta'
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      expect(result).toBeNull(); // No easter egg matches = null
    });

    test('should NOT trigger for person eating (food present)', () => {
      const detection = {
        scene_type: 'person_eating',
        has_person: true,
        has_food: true,
        confidence: 'high',
        details: 'Person eating burger'
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      expect(result).toBeNull(); // No easter egg matches = null
    });

    test('should NOT trigger for medium confidence', () => {
      const detection = {
        scene_type: 'selfie',
        has_person: true,
        has_food: false,
        confidence: 'medium', // Not high confidence
        details: 'Unclear selfie'
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      expect(result).toBeNull(); // No easter egg matches = null (confidence too low)
    });

    test('should trigger celebration (companion easter egg)', () => {
      const detection = {
        scene_type: 'celebration',
        is_celebration: true,
        has_food: true,
        confidence: 'high',
        details: 'Birthday cake with candles'
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      expect(result.shouldTrigger).toBe(true);
      expect(result.canTrigger).toBe(true);
      expect(result.easterEggType).toBe('celebration');
      expect(result.blocksNutritionExtraction).toBe(false); // Companion - doesn't block
    });

    test('should respect cooldowns', () => {
      const detection = {
        scene_type: 'selfie',
        has_person: true,
        has_food: false,
        confidence: 'high',
        details: 'Person taking a selfie'
      };

      // First trigger should work
      const result1 = easterEggManager.evaluateDetection(detection, 'user123');
      expect(result1.shouldTrigger).toBe(true);
      expect(result1.canTrigger).toBe(true);

      // Record the trigger
      result1.recordTrigger();

      // Second trigger should be on cooldown
      const result2 = easterEggManager.evaluateDetection(detection, 'user123');
      expect(result2.shouldTrigger).toBe(true);
      expect(result2.canTrigger).toBe(false); // On cooldown
    });

    test('should return random message from available messages', () => {
      const detection = {
        scene_type: 'selfie',
        has_person: true,
        has_food: false,
        confidence: 'high',
        details: 'Person taking a selfie'
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');
      const message = result.getMessage();

      // Should return a string
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);

      // Should contain expected text (person_without_food messages)
      expect(
        message.includes('snack') ||
        message.includes('food') ||
        message.includes('nutrition')
      ).toBe(true);
    });

    test('should handle empty_plate scene', () => {
      const detection = {
        scene_type: 'empty_plate',
        has_food: false,
        confidence: 'high',
        details: 'Clean empty plate'
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      expect(result.shouldTrigger).toBe(true);
      expect(result.canTrigger).toBe(true);
      expect(result.easterEggType).toBe('empty_plate');
      expect(result.blocksNutritionExtraction).toBe(true);
    });

    test('should handle shopping scene', () => {
      const detection = {
        scene_type: 'shopping',
        is_shopping_scene: true,
        confidence: 'high',
        details: 'Grocery store aisle'
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      expect(result.shouldTrigger).toBe(true);
      expect(result.canTrigger).toBe(true);
      expect(result.easterEggType).toBe('shopping_scene');
      expect(result.blocksNutritionExtraction).toBe(true);
    });

    test('should handle screenshot/digital content', () => {
      const detection = {
        scene_type: 'screenshot',
        is_digital_content: true,
        confidence: 'high',
        details: 'Food on TV screen'
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      expect(result.shouldTrigger).toBe(true);
      expect(result.canTrigger).toBe(true);
      expect(result.easterEggType).toBe('screenshot_meme');
      expect(result.blocksNutritionExtraction).toBe(true);
    });

    test('should handle fake food', () => {
      const detection = {
        scene_type: 'fake_food',
        is_fake_food: true,
        has_food: false,
        confidence: 'high',
        details: 'Soap shaped like cupcake'
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      expect(result.shouldTrigger).toBe(true);
      expect(result.canTrigger).toBe(true);
      expect(result.easterEggType).toBe('non_food_item');
      expect(result.blocksNutritionExtraction).toBe(true);
    });
  });

  describe('_checkDetectionCriteria', () => {
    test('should match scene_type correctly', () => {
      const easterEgg = {
        detectionCriteria: {
          scene_type: 'selfie',
          min_confidence: 'high'
        }
      };

      const detection1 = { scene_type: 'selfie', confidence: 'high' };
      const detection2 = { scene_type: 'meal_photo', confidence: 'high' };

      expect(easterEggManager._checkDetectionCriteria(easterEgg, detection1)).toBe(true);
      expect(easterEggManager._checkDetectionCriteria(easterEgg, detection2)).toBe(false);
    });

    test('should match boolean flags correctly', () => {
      const easterEgg = {
        detectionCriteria: {
          has_person: true,
          has_food: false
        }
      };

      const detection1 = { has_person: true, has_food: false };
      const detection2 = { has_person: true, has_food: true };
      const detection3 = { has_person: false, has_food: false };

      expect(easterEggManager._checkDetectionCriteria(easterEgg, detection1)).toBe(true);
      expect(easterEggManager._checkDetectionCriteria(easterEgg, detection2)).toBe(false);
      expect(easterEggManager._checkDetectionCriteria(easterEgg, detection3)).toBe(false);
    });

    test('should check confidence threshold correctly', () => {
      const easterEgg = {
        detectionCriteria: {
          scene_type: 'selfie',
          min_confidence: 'high'
        }
      };

      const highConf = { scene_type: 'selfie', confidence: 'high' };
      const mediumConf = { scene_type: 'selfie', confidence: 'medium' };
      const lowConf = { scene_type: 'selfie', confidence: 'low' };

      expect(easterEggManager._checkDetectionCriteria(easterEgg, highConf)).toBe(true);
      expect(easterEggManager._checkDetectionCriteria(easterEgg, mediumConf)).toBe(false);
      expect(easterEggManager._checkDetectionCriteria(easterEgg, lowConf)).toBe(false);
    });

    test('should handle multiple criteria (AND logic)', () => {
      const easterEgg = {
        detectionCriteria: {
          scene_type: 'selfie',
          has_person: true,
          has_food: false,
          min_confidence: 'high'
        }
      };

      const allMatch = {
        scene_type: 'selfie',
        has_person: true,
        has_food: false,
        confidence: 'high'
      };

      const missingOne = {
        scene_type: 'selfie',
        has_person: true,
        has_food: true, // Wrong!
        confidence: 'high'
      };

      expect(easterEggManager._checkDetectionCriteria(easterEgg, allMatch)).toBe(true);
      expect(easterEggManager._checkDetectionCriteria(easterEgg, missingOne)).toBe(false);
    });
  });

  // =========================================================================
  // CRITICAL TESTS FROM PR REVIEW
  // =========================================================================

  describe('Blocking vs Companion Easter Eggs', () => {
    test('blocking easter egg (person_without_food) should block nutrition extraction', () => {
      const detection = {
        scene_type: 'selfie',
        has_person: true,
        has_food: false,
        confidence: 'high'
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      expect(result.shouldTrigger).toBe(true);
      expect(result.easterEggType).toBe('person_without_food');
      expect(result.blocksNutritionExtraction).toBe(true); // BLOCKS
    });

    test('companion easter egg (celebration) should NOT block nutrition extraction', () => {
      const detection = {
        scene_type: 'celebration',
        is_celebration: true,
        has_food: true,
        confidence: 'high'
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      expect(result.shouldTrigger).toBe(true);
      expect(result.easterEggType).toBe('celebration');
      expect(result.blocksNutritionExtraction).toBe(false); // COMPANION - does not block
    });

    test('empty_packaging should NOT block nutrition extraction (P0 fix validation)', () => {
      const detection = {
        scene_type: 'empty_packaging',
        is_empty_packaging: true,
        has_food: false,
        confidence: 'high'
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      expect(result.shouldTrigger).toBe(true);
      expect(result.easterEggType).toBe('empty_packaging');
      expect(result.blocksNutritionExtraction).toBe(false); // P0 FIX: Should not block!
    });

    test('all blocking easter eggs should have blocksNutritionExtraction: true', () => {
      const blockingTypes = ['person_without_food', 'pet', 'empty_plate',
                             'non_food_item', 'shopping_scene', 'screenshot_meme'];

      blockingTypes.forEach(type => {
        const easterEgg = require('../../src/easter-egg-config').getEasterEggById(type);
        expect(easterEgg.blocksNutritionExtraction).toBe(true);
      });
    });

    test('all companion easter eggs should have blocksNutritionExtraction: false', () => {
      const companionTypes = ['celebration', 'midnight_munchies', 'empty_packaging'];

      companionTypes.forEach(type => {
        const easterEgg = require('../../src/easter-egg-config').getEasterEggById(type);
        expect(easterEgg.blocksNutritionExtraction).toBe(false);
      });
    });
  });

  describe('Time Window Easter Eggs', () => {
    beforeEach(() => {
      // Clear any existing cooldowns
      const allUsers = [];
      cooldownManager.easterEggCooldowns.forEach((_, userId) => {
        allUsers.push(userId);
      });
      allUsers.forEach(userId => {
        cooldownManager.clearUserCooldowns(userId);
      });
    });

    test('midnight_munchies should trigger between 10pm-4am', () => {
      const detection = {
        has_food: true,
        confidence: 'high'
      };

      // Mock current hour to 11 PM (23:00)
      const originalDate = global.Date;
      global.Date = class extends originalDate {
        getHours() {
          return 23; // 11 PM
        }
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      // Restore original Date
      global.Date = originalDate;

      expect(result.shouldTrigger).toBe(true);
      expect(result.easterEggType).toBe('midnight_munchies');
      expect(result.blocksNutritionExtraction).toBe(false); // Companion
    });

    test('midnight_munchies should trigger at 2am (within window)', () => {
      const detection = {
        has_food: true,
        confidence: 'high'
      };

      // Mock current hour to 2 AM
      const originalDate = global.Date;
      global.Date = class extends originalDate {
        getHours() {
          return 2; // 2 AM
        }
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      // Restore original Date
      global.Date = originalDate;

      expect(result.shouldTrigger).toBe(true);
      expect(result.easterEggType).toBe('midnight_munchies');
    });

    test('midnight_munchies should NOT trigger at 5pm (outside window)', () => {
      const detection = {
        has_food: true,
        confidence: 'high'
      };

      // Mock current hour to 5 PM (17:00)
      const originalDate = global.Date;
      global.Date = class extends originalDate {
        getHours() {
          return 17; // 5 PM
        }
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      // Restore original Date
      global.Date = originalDate;

      // Should not trigger midnight_munchies (wrong time)
      // Might trigger nothing or a different easter egg
      if (result !== null && result.shouldTrigger) {
        expect(result.easterEggType).not.toBe('midnight_munchies');
      }
    });
  });

  describe('Priority System', () => {
    test('celebration (priority 10) should trigger before person_without_food (priority 8)', () => {
      // Scene with both person AND celebration indicators
      const detection = {
        scene_type: 'celebration',
        is_celebration: true,
        has_person: true,
        has_food: true,
        confidence: 'high'
      };

      const result = easterEggManager.evaluateDetection(detection, 'user123');

      // Should trigger celebration (higher priority) not person_without_food
      expect(result.shouldTrigger).toBe(true);
      expect(result.easterEggType).toBe('celebration');
      expect(result.priority).toBe(10);
    });
  });

  describe('Environment Variable Configuration', () => {
    test('should respect EASTER_EGGS_ENABLED environment variable', () => {
      // This test verifies the config loads correctly
      // The actual env var is set at startup, but we can test the config structure
      const config = require('../../src/easter-egg-config');

      // Config should be loaded
      expect(config.GLOBAL_CONFIG).toBeDefined();
      expect(config.GLOBAL_CONFIG.enabled).toBeDefined();
      expect(typeof config.GLOBAL_CONFIG.enabled).toBe('boolean');
    });

    test('should have configurable cooldown durations via env vars', () => {
      const config = require('../../src/easter-egg-config');

      // All easter eggs should have cooldownDuration configured
      Object.values(config.EASTER_EGG_TYPES).forEach(easterEgg => {
        expect(easterEgg.cooldownDuration).toBeDefined();
        expect(typeof easterEgg.cooldownDuration).toBe('number');
        expect(easterEgg.cooldownDuration).toBeGreaterThan(0);
      });
    });

    test('should use time constants (DAYS, HOURS) correctly', () => {
      const config = require('../../src/easter-egg-config');

      // Verify person_without_food uses 7 days
      const person = config.getEasterEggById('person_without_food');
      expect(person.cooldownDuration).toBe(7 * 24 * 60 * 60 * 1000);

      // Verify midnight_munchies uses 12 hours
      const midnight = config.getEasterEggById('midnight_munchies');
      expect(midnight.cooldownDuration).toBe(12 * 60 * 60 * 1000);

      // Verify celebration uses 30 days
      const celebration = config.getEasterEggById('celebration');
      expect(celebration.cooldownDuration).toBe(30 * 24 * 60 * 60 * 1000);
    });

    test('getBlockingSceneTypes should extract from config dynamically', () => {
      const config = require('../../src/easter-egg-config');

      const blockingTypes = config.getBlockingSceneTypes();

      // Should return an array
      expect(Array.isArray(blockingTypes)).toBe(true);

      // Should include blocking types
      expect(blockingTypes).toContain('selfie');
      expect(blockingTypes).toContain('pet_photo');
      expect(blockingTypes).toContain('empty_plate');

      // Should NOT include companion types
      expect(blockingTypes).not.toContain('celebration'); // celebration is companion
      expect(blockingTypes).not.toContain('empty_packaging'); // empty_packaging is companion (P0 fix)
    });

    test('should correctly identify blocking vs companion easter eggs', () => {
      const config = require('../../src/easter-egg-config');

      // Blocking eggs
      expect(config.blocksNutritionExtraction('person_without_food')).toBe(true);
      expect(config.blocksNutritionExtraction('pet')).toBe(true);
      expect(config.blocksNutritionExtraction('empty_plate')).toBe(true);

      // Companion eggs
      expect(config.blocksNutritionExtraction('celebration')).toBe(false);
      expect(config.blocksNutritionExtraction('midnight_munchies')).toBe(false);
      expect(config.blocksNutritionExtraction('empty_packaging')).toBe(false); // P0 fix
    });

    test('all easter eggs should have required configuration fields', () => {
      const config = require('../../src/easter-egg-config');

      Object.values(config.EASTER_EGG_TYPES).forEach(easterEgg => {
        // Required fields
        expect(easterEgg.id).toBeDefined();
        expect(easterEgg.displayName).toBeDefined();
        expect(easterEgg.enabled).toBeDefined();
        expect(easterEgg.cooldownDuration).toBeDefined();
        expect(easterEgg.priority).toBeDefined();
        expect(easterEgg.blocksNutritionExtraction).toBeDefined();
        expect(easterEgg.detectionCriteria).toBeDefined();
        expect(easterEgg.messages).toBeDefined();

        // Type checks
        expect(typeof easterEgg.id).toBe('string');
        expect(typeof easterEgg.enabled).toBe('boolean');
        expect(typeof easterEgg.cooldownDuration).toBe('number');
        expect(typeof easterEgg.priority).toBe('number');
        expect(typeof easterEgg.blocksNutritionExtraction).toBe('boolean');
        expect(Array.isArray(easterEgg.messages)).toBe(true);
        expect(easterEgg.messages.length).toBeGreaterThan(0);
      });
    });
  });
});
