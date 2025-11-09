// tests/integration/easter-egg-webhook.test.js
// Integration tests for easter egg system with webhook flow

const nock = require('nock');

// Mock config before requiring other modules
const mockConfig = {
  telegram: {
    botToken: 'mock_bot_token',
    allowedUsers: [],
    webhookSecret: null,
  },
  claude: {
    apiKey: 'mock_claude_key',
    model: 'claude-3-5-sonnet-20241022'
  },
  github: {
    token: 'mock_github_token',
    owner: 'test_owner',
    repo: 'test_repo',
    branch: 'daily-logs'
  },
  usda: {
    apiKey: 'mock_usda_key',
    baseUrl: 'https://api.nal.usda.gov/fdc/v1'
  },
  app: {
    environment: 'test'
  }
};

jest.mock('../../src/config', () => mockConfig);

// Import modules after mocking config
const easterEggManager = require('../../src/easter-egg-manager');
const easterEggCooldownManager = require('../../src/easter-egg-cooldown-manager');
const claudeIntegration = require('../../src/claude-integration');

describe('Easter Egg Webhook Integration', () => {
  let mockCtx;

  beforeEach(() => {
    // Clear cooldown state
    easterEggCooldownManager.easterEggCooldowns.clear();
    easterEggCooldownManager.cooldownLastAccess.clear();

    // Reset all mocks
    jest.clearAllMocks();
    nock.cleanAll();

    // Create mock Telegraf context
    mockCtx = {
      from: {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser'
      },
      chat: {
        id: 123456789,
        type: 'private'
      },
      message: {
        message_id: 789,
        photo: [
          { file_id: 'test_file_id' }
        ]
      },
      reply: jest.fn().mockResolvedValue({ message_id: 999 }),
      telegram: {
        editMessageText: jest.fn().mockResolvedValue(true),
        getFileLink: jest.fn().mockResolvedValue('https://example.com/photo.jpg')
      }
    };
  });

  afterEach(() => {
    nock.cleanAll();
    // Stop cleanup interval to prevent memory leaks in tests
    easterEggCooldownManager.stopCooldownCleanup();
  });

  describe('Blocking Easter Egg (person_without_food)', () => {
    it('should trigger person_without_food easter egg for selfie and block nutrition extraction', () => {
      const userId = mockCtx.from.id;

      // Mock scene detection from Claude Vision
      const mockSceneDetection = {
        scene_type: 'selfie',
        has_person: true,
        has_food: false,
        confidence: 'high',
        details: 'Person taking a selfie',
        should_attempt_nutrition_extraction: false
      };

      // Verify easter egg evaluation
      const easterEggResult = easterEggManager.evaluateDetection(mockSceneDetection, userId);

      expect(easterEggResult).not.toBeNull();
      expect(easterEggResult.shouldTrigger).toBe(true);
      expect(easterEggResult.canTrigger).toBe(true);
      expect(easterEggResult.easterEggType).toBe('person_without_food');
      expect(easterEggResult.blocksNutritionExtraction).toBe(true);
      expect(typeof easterEggResult.getMessage()).toBe('string');
    });

    it('should not trigger easter egg on cooldown', async () => {
      const userId = mockCtx.from.id;

      const mockSceneDetection = {
        scene_type: 'selfie',
        has_person: true,
        has_food: false,
        confidence: 'high',
        details: 'Person taking a selfie'
      };

      // First trigger - should work
      const firstResult = easterEggManager.evaluateDetection(mockSceneDetection, userId);
      expect(firstResult.canTrigger).toBe(true);

      // Record the trigger (simulating actual usage)
      easterEggCooldownManager.recordEasterEggTrigger(userId, 'person_without_food');

      // Second trigger immediately - should be on cooldown
      const secondResult = easterEggManager.evaluateDetection(mockSceneDetection, userId);
      expect(secondResult.shouldTrigger).toBe(true); // Still matches criteria
      expect(secondResult.canTrigger).toBe(false); // But on cooldown
      expect(secondResult.onCooldown).toBe(true);
      expect(secondResult.cooldownInfo.remainingMs).toBeGreaterThan(0);
    });

    it('should handle pet photo easter egg', () => {
      const userId = mockCtx.from.id;

      const mockSceneDetection = {
        scene_type: 'pet_photo',
        has_pet: true,
        has_food: false,
        confidence: 'high',
        details: 'Photo of a dog'
      };

      const result = easterEggManager.evaluateDetection(mockSceneDetection, userId);

      expect(result).not.toBeNull();
      expect(result.shouldTrigger).toBe(true);
      expect(result.canTrigger).toBe(true);
      expect(result.easterEggType).toBe('pet');
      expect(result.blocksNutritionExtraction).toBe(true);
    });

    it('should handle empty_plate easter egg', () => {
      const userId = mockCtx.from.id;

      const mockSceneDetection = {
        scene_type: 'empty_plate',
        has_food: false,
        confidence: 'high',
        details: 'Empty plate after meal'
      };

      const result = easterEggManager.evaluateDetection(mockSceneDetection, userId);

      expect(result).not.toBeNull();
      expect(result.shouldTrigger).toBe(true);
      expect(result.canTrigger).toBe(true);
      expect(result.easterEggType).toBe('empty_plate');
      expect(result.blocksNutritionExtraction).toBe(true);
    });
  });

  describe('Companion Easter Egg (celebration)', () => {
    it('should trigger celebration easter egg AND extract nutrition', () => {
      const userId = mockCtx.from.id;

      // Mock scene detection from Claude Vision - celebration with food
      const mockSceneDetection = {
        scene_type: 'celebration',
        is_celebration: true,
        has_food: true,
        confidence: 'high',
        details: 'Birthday cake with candles',
        should_attempt_nutrition_extraction: true
      };

      // Verify easter egg evaluation
      const easterEggResult = easterEggManager.evaluateDetection(mockSceneDetection, userId);

      expect(easterEggResult).not.toBeNull();
      expect(easterEggResult.shouldTrigger).toBe(true);
      expect(easterEggResult.canTrigger).toBe(true);
      expect(easterEggResult.easterEggType).toBe('celebration');
      expect(easterEggResult.blocksNutritionExtraction).toBe(false); // COMPANION MODE
      expect(typeof easterEggResult.getMessage()).toBe('string');
      expect(easterEggResult.getMessage()).toMatch(/🎉|🎂|🎊|🥳/); // Contains celebration emoji
    });
  });

  describe('Empty Packaging (P0 Fix)', () => {
    it('should allow nutrition extraction for empty_packaging when label is visible', () => {
      const userId = mockCtx.from.id;

      // Mock scene detection - empty packaging WITH visible nutrition label
      const mockSceneDetection = {
        scene_type: 'empty_packaging',
        is_empty_packaging: true,
        has_food: false,
        confidence: 'high',
        details: 'Empty chip bag with visible nutrition label',
        should_attempt_nutrition_extraction: true // Label is visible!
      };

      // Verify easter egg behavior
      const easterEggResult = easterEggManager.evaluateDetection(mockSceneDetection, userId);

      expect(easterEggResult).not.toBeNull();
      expect(easterEggResult.shouldTrigger).toBe(true);
      expect(easterEggResult.easterEggType).toBe('empty_packaging');
      expect(easterEggResult.blocksNutritionExtraction).toBe(false); // P0 FIX: Should not block
    });

    it('should trigger easter egg for empty_packaging without label', () => {
      const userId = mockCtx.from.id;

      // Empty packaging WITHOUT visible label
      const mockSceneDetection = {
        scene_type: 'empty_packaging',
        is_empty_packaging: true,
        has_food: false,
        confidence: 'high',
        details: 'Empty wrapper, no visible label',
        should_attempt_nutrition_extraction: false // No label visible
      };

      const result = easterEggManager.evaluateDetection(mockSceneDetection, userId);

      expect(result).not.toBeNull();
      expect(result.shouldTrigger).toBe(true);
      expect(result.easterEggType).toBe('empty_packaging');
      // Even though config says blocksNutritionExtraction: false,
      // Claude Vision will return nutrition_data: null anyway
    });
  });

  describe('No Easter Egg Triggered', () => {
    it('should return null when no easter egg matches', () => {
      const userId = mockCtx.from.id;

      // Normal meal photo - no easter egg
      const mockSceneDetection = {
        scene_type: 'meal_photo',
        has_food: true,
        has_person: false,
        confidence: 'high',
        details: 'Plate of pasta',
        should_attempt_nutrition_extraction: true
      };

      const result = easterEggManager.evaluateDetection(mockSceneDetection, userId);

      expect(result).toBeNull(); // No easter egg triggered
    });

    it('should not trigger when confidence is too low', () => {
      const userId = mockCtx.from.id;

      // Selfie but low confidence
      const mockSceneDetection = {
        scene_type: 'selfie',
        has_person: true,
        has_food: false,
        confidence: 'low', // Too low!
        details: 'Unclear image'
      };

      const result = easterEggManager.evaluateDetection(mockSceneDetection, userId);

      expect(result).toBeNull(); // Should not trigger with low confidence
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid scene detection gracefully', () => {
      const userId = mockCtx.from.id;

      // Missing required fields
      const invalidSceneDetection = {
        scene_type: 'unknown'
        // Missing other fields
      };

      const result = easterEggManager.evaluateDetection(invalidSceneDetection, userId);

      // Should return null or not crash
      expect(result).toBeNull();
    });

    it('should handle missing userId gracefully', () => {
      const mockSceneDetection = {
        scene_type: 'selfie',
        has_person: true,
        has_food: false,
        confidence: 'high'
      };

      // Should throw when trying to check cooldown (called inside evaluateDetection)
      expect(() => {
        easterEggManager.evaluateDetection(mockSceneDetection, null);
      }).toThrow(); // Should throw validation error from cooldown manager
    });
  });

  describe('Cooldown Expiration', () => {
    it('should allow re-trigger after cooldown expires', async () => {
      const userId = mockCtx.from.id;

      const mockSceneDetection = {
        scene_type: 'selfie',
        has_person: true,
        has_food: false,
        confidence: 'high'
      };

      // First trigger
      const firstResult = easterEggManager.evaluateDetection(mockSceneDetection, userId);
      expect(firstResult).not.toBeNull();
      expect(firstResult.canTrigger).toBe(true);

      // Manually set cooldown to expired timestamp (7 days + 1 second ago)
      const expiredTimestamp = Date.now() - (7 * 24 * 60 * 60 * 1000 + 1000);
      easterEggCooldownManager.easterEggCooldowns.set(
        String(userId),
        new Map([['person_without_food', expiredTimestamp]])
      );

      // Should be able to trigger again since cooldown expired
      const secondResult = easterEggManager.evaluateDetection(mockSceneDetection, userId);
      expect(secondResult).not.toBeNull();
      expect(secondResult.canTrigger).toBe(true);
    });
  });

  describe('Global Disable', () => {
    it('should return null when easter eggs are globally disabled', () => {
      const userId = mockCtx.from.id;

      const mockSceneDetection = {
        scene_type: 'selfie',
        has_person: true,
        has_food: false,
        confidence: 'high'
      };

      // Mock config to disable easter eggs
      const easterEggConfig = require('../../src/easter-egg-config');
      const originalEnabled = easterEggConfig.GLOBAL_CONFIG.enabled;

      // Temporarily disable
      easterEggConfig.GLOBAL_CONFIG.enabled = false;

      const result = easterEggManager.evaluateDetection(mockSceneDetection, userId);

      expect(result).toBeNull();

      // Restore
      easterEggConfig.GLOBAL_CONFIG.enabled = originalEnabled;
    });
  });

  describe('Companion Easter Egg Integration', () => {
    it('should verify companion easter egg does not block nutrition extraction', () => {
      const userId = mockCtx.from.id;

      const mockSceneDetection = {
        scene_type: 'celebration',
        is_celebration: true,
        has_food: true,
        confidence: 'high',
        details: 'Birthday cake with candles'
      };

      const result = easterEggManager.evaluateDetection(mockSceneDetection, userId);

      expect(result).not.toBeNull();
      expect(result.shouldTrigger).toBe(true);
      expect(result.easterEggType).toBe('celebration');
      expect(result.blocksNutritionExtraction).toBe(false); // Key assertion - companion mode
    });

    it('should verify midnight_munchies companion easter egg', () => {
      const userId = mockCtx.from.id;

      // Mock Date to return 11 PM (23:00)
      const realDate = Date;
      const mockDate = new Date('2024-01-15T23:00:00Z');
      global.Date = class extends realDate {
        constructor(...args) {
          if (args.length === 0) {
            return mockDate;
          }
          return new realDate(...args);
        }
        static now() {
          return mockDate.getTime();
        }
      };

      const mockSceneDetection = {
        scene_type: 'meal_photo',
        has_food: true,
        confidence: 'high',
        details: 'Late night snack'
      };

      const result = easterEggManager.evaluateDetection(mockSceneDetection, userId);

      expect(result).not.toBeNull();
      expect(result.shouldTrigger).toBe(true);
      expect(result.easterEggType).toBe('midnight_munchies');
      expect(result.blocksNutritionExtraction).toBe(false); // Companion mode

      // Restore
      global.Date = realDate;
    });
  });
});
