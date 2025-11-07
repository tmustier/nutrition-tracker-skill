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

      expect(result.shouldTrigger).toBe(false);
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

      expect(result.shouldTrigger).toBe(false);
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

      expect(result.shouldTrigger).toBe(false);
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
});
