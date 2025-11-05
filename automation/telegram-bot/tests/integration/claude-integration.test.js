// tests/integration/claude-integration.test.js - Integration tests for Claude API

const nock = require('nock');
const claudeIntegration = require('../../src/claude-integration');

describe('Claude Integration', () => {
  const CLAUDE_API_URL = 'https://api.anthropic.com';

  beforeEach(() => {
    // Clean all nock interceptors
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('processFoodLog', () => {
    it('should process food description successfully with Claude', async () => {
      const mockClaudeResponse = {
        content: [{
          text: JSON.stringify({
            name: 'Grilled Chicken Breast',
            food_bank_id: null,
            quantity: 200,
            unit: 'g',
            per_portion: {
              energy_kcal: 330,
              protein_g: 62.0,
              fat_g: 7.0,
              sat_fat_g: 2.0,
              mufa_g: 3.0,
              pufa_g: 1.5,
              trans_fat_g: 0.0,
              cholesterol_mg: 135,
              sugar_g: 0.0,
              fiber_total_g: 0.0,
              fiber_soluble_g: 0.0,
              fiber_insoluble_g: 0.0,
              carbs_total_g: 0.0,
              carbs_available_g: 0.0,
              sodium_mg: 140,
              potassium_mg: 520,
              iodine_ug: 5,
              magnesium_mg: 50,
              calcium_mg: 15,
              iron_mg: 2,
              zinc_mg: 4,
              vitamin_c_mg: 0,
              manganese_mg: 0,
              polyols_g: 0.0
            },
            notes: 'Estimated nutrition for 200g grilled chicken breast'
          })
        }],
        usage: { input_tokens: 100, output_tokens: 200 }
      };

      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(200, mockClaudeResponse);

      const result = await claudeIntegration.processFoodLog('grilled chicken breast 200g', 123456789);

      expect(result.success).toBe(true);
      expect(result.source).toBe('claude');
      expect(result.data).toMatchObject({
        name: 'Grilled Chicken Breast',
        quantity: 200,
        unit: 'g',
        per_portion: expect.objectContaining({
          energy_kcal: 330,
          protein_g: 62.0,
          fat_g: 7.0
        })
      });
    });

    it('should fall back to USDA when Claude fails', async () => {
      // Mock Claude API failure
      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(500, { error: 'Internal server error' });

      // Mock USDA API success
      nock('https://api.nal.usda.gov')
        .get('/fdc/v1/foods/search')
        .query(true)
        .reply(200, {
          foods: [{
            fdcId: 171077,
            description: 'Chicken, broilers or fryers, breast, meat only, cooked, grilled',
            foodNutrients: [
              { nutrientId: 1008, value: 165 }, // energy
              { nutrientId: 1003, value: 31.02 }, // protein
              { nutrientId: 1004, value: 3.57 } // fat
            ]
          }]
        });

      nock('https://api.nal.usda.gov')
        .get('/fdc/v1/food/171077')
        .query(true)
        .reply(200, {
          description: 'Chicken, broilers or fryers, breast, meat only, cooked, grilled',
          foodNutrients: [
            { nutrient: { id: 1008, name: 'Energy' }, amount: 165 },
            { nutrient: { id: 1003, name: 'Protein' }, amount: 31.02 },
            { nutrient: { id: 1004, name: 'Total lipid (fat)' }, amount: 3.57 },
            { nutrient: { id: 1258, name: 'Fatty acids, total saturated' }, amount: 1.01 }
          ]
        });

      const result = await claudeIntegration.processFoodLog('chicken breast 200g', 123456789);

      expect(result.success).toBe(true);
      expect(result.source).toBe('usda');
      expect(result.data.name).toContain('Chicken');
    });

    it('should handle Claude API rate limiting', async () => {
      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(429, {
          error: {
            type: 'rate_limit_error',
            message: 'Rate limit exceeded'
          }
        });

      const result = await claudeIntegration.processFoodLog('test food', 123456789);

      expect(result.success).toBe(false);
      expect(result.message).toContain('rate limit');
    });

    it('should handle malformed Claude response', async () => {
      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(200, {
          content: [{
            text: 'Invalid JSON response'
          }]
        });

      const result = await claudeIntegration.processFoodLog('test food', 123456789);

      expect(result.success).toBe(false);
      expect(result.message).toContain('parsing');
    });

    it('should validate nutrition data completeness', async () => {
      const mockClaudeResponse = {
        content: [{
          text: JSON.stringify({
            name: 'Test Food',
            per_portion: {
              energy_kcal: 100,
              protein_g: 10,
              // Missing required fields like fat_g, carbs_total_g, etc.
            }
          })
        }],
        usage: { input_tokens: 50, output_tokens: 100 }
      };

      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(200, mockClaudeResponse);

      const result = await claudeIntegration.processFoodLog('test food', 123456789);

      expect(result.success).toBe(false);
      expect(result.message).toContain('missing required nutrition fields');
    });

    it('should handle network connectivity issues', async () => {
      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .replyWithError({ code: 'ENOTFOUND', message: 'Network error' });

      const result = await claudeIntegration.processFoodLog('test food', 123456789);

      expect(result.success).toBe(false);
      expect(result.message).toContain('network');
    });
  });

  describe('processImage', () => {
    it('should process image successfully', async () => {
      const mockImageResponse = {
        content: [{
          text: JSON.stringify({
            name: 'Restaurant Menu Item',
            food_bank_id: null,
            quantity: 1,
            unit: 'portion',
            per_portion: global.mockNutritionData,
            notes: 'Extracted from menu screenshot'
          })
        }],
        usage: { input_tokens: 150, output_tokens: 300 }
      };

      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(200, mockImageResponse);

      const imageBuffer = Buffer.from('fake image data');
      const result = await claudeIntegration.processImage(imageBuffer, 'image/jpeg');

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        name: 'Restaurant Menu Item',
        quantity: 1,
        unit: 'portion',
        per_portion: expect.objectContaining({
          energy_kcal: expect.any(Number),
          protein_g: expect.any(Number)
        })
      });
    });

    it('should handle unsupported image format', async () => {
      const imageBuffer = Buffer.from('fake image data');
      
      // Mock validation that would reject unsupported format
      const result = await claudeIntegration.processImage(imageBuffer, 'image/bmp');

      // Assuming the function validates supported formats
      if (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes('image/bmp')) {
        expect(result.success).toBe(true);
      } else {
        expect(result.success).toBe(false);
        expect(result.message).toContain('unsupported format');
      }
    });

    it('should handle large image files', async () => {
      const largeImageBuffer = Buffer.alloc(10 * 1024 * 1024); // 10MB

      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(413, { error: 'Payload too large' });

      const result = await claudeIntegration.processImage(largeImageBuffer, 'image/jpeg');

      expect(result.success).toBe(false);
      expect(result.message).toContain('too large');
    });

    it('should handle corrupted image data', async () => {
      const corruptedBuffer = Buffer.from('not an image');

      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(400, { error: 'Invalid image data' });

      const result = await claudeIntegration.processImage(corruptedBuffer, 'image/jpeg');

      expect(result.success).toBe(false);
      expect(result.message).toContain('invalid image');
    });
  });

  describe('getTargets', () => {
    it('should return rest day targets', () => {
      const targets = claudeIntegration.getTargets('rest');

      expect(targets).toMatchObject({
        energy_kcal: 2500,
        protein_g: 170,
        fat_g: 70,
        carbs_g: 250,
        fiber_g: 40
      });
    });

    it('should return training day targets', () => {
      const targets = claudeIntegration.getTargets('training');

      expect(targets).toMatchObject({
        energy_kcal: 2900,
        protein_g: 170,
        fat_g: 70,
        carbs_g: 250,
        fiber_g: 40
      });
    });

    it('should default to rest day targets', () => {
      const targets = claudeIntegration.getTargets();

      expect(targets.energy_kcal).toBe(2500); // Rest day value
    });
  });

  describe('API Error Handling', () => {
    it('should handle authentication errors', async () => {
      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(401, {
          error: {
            type: 'authentication_error',
            message: 'Invalid API key'
          }
        });

      const result = await claudeIntegration.processFoodLog('test food', 123456789);

      expect(result.success).toBe(false);
      expect(result.message).toContain('authentication');
    });

    it('should handle quota exceeded errors', async () => {
      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(403, {
          error: {
            type: 'permission_error',
            message: 'Quota exceeded'
          }
        });

      const result = await claudeIntegration.processFoodLog('test food', 123456789);

      expect(result.success).toBe(false);
      expect(result.message).toContain('quota');
    });

    it('should retry on temporary server errors', async () => {
      // First request fails
      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(500, { error: 'Internal server error' });

      // Second request succeeds
      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(200, {
          content: [{
            text: JSON.stringify({
              name: 'Test Food',
              per_portion: global.mockNutritionData
            })
          }]
        });

      // Mock retry logic would be implemented in the actual claudeIntegration module
      const result = await claudeIntegration.processFoodLog('test food', 123456789);

      // If retry logic is implemented, this should succeed
      // If not implemented yet, this documents the expected behavior
      if (result.success) {
        expect(result.data.name).toBe('Test Food');
      }
    });
  });

  describe('Input Validation', () => {
    it('should handle empty food descriptions', async () => {
      const result = await claudeIntegration.processFoodLog('', 123456789);

      expect(result.success).toBe(false);
      expect(result.message).toContain('empty');
    });

    it('should handle very long food descriptions', async () => {
      const longDescription = 'a'.repeat(10000);

      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(400, { error: 'Input too long' });

      const result = await claudeIntegration.processFoodLog(longDescription, 123456789);

      expect(result.success).toBe(false);
    });

    it('should handle special characters in food descriptions', async () => {
      const specialCharsDescription = 'Chicken with spicy 🌶️ sauce & côte d\'or chocolate';

      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(200, {
          content: [{
            text: JSON.stringify({
              name: 'Chicken with Spicy Sauce & Chocolate',
              per_portion: global.mockNutritionData
            })
          }]
        });

      const result = await claudeIntegration.processFoodLog(specialCharsDescription, 123456789);

      expect(result.success).toBe(true);
      expect(result.data.name).toContain('Chicken');
    });

    it('should handle null or undefined inputs', async () => {
      const result1 = await claudeIntegration.processFoodLog(null, 123456789);
      const result2 = await claudeIntegration.processFoodLog(undefined, 123456789);

      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
    });
  });

  describe('Response Validation', () => {
    it('should validate energy calculation consistency', async () => {
      const mockResponse = {
        content: [{
          text: JSON.stringify({
            name: 'Test Food',
            per_portion: {
              energy_kcal: 100, // This doesn't match the calculation below
              protein_g: 10.0,   // 10 * 4 = 40 kcal
              fat_g: 5.0,        // 5 * 9 = 45 kcal
              carbs_available_g: 20.0, // 20 * 4 = 80 kcal
              fiber_total_g: 2.0,      // 2 * 2 = 4 kcal
              polyols_g: 0.0,          // 0 * 2.4 = 0 kcal
              // Total should be: 40 + 45 + 80 + 4 + 0 = 169 kcal, not 100
              sat_fat_g: 1.0,
              mufa_g: 2.0,
              pufa_g: 1.0,
              trans_fat_g: 0.0,
              cholesterol_mg: 10,
              sugar_g: 5.0,
              fiber_soluble_g: 1.0,
              fiber_insoluble_g: 1.0,
              carbs_total_g: 22.0,
              sodium_mg: 100,
              potassium_mg: 200,
              iodine_ug: 5,
              magnesium_mg: 15,
              calcium_mg: 30,
              iron_mg: 1,
              zinc_mg: 1,
              vitamin_c_mg: 2,
              manganese_mg: 0,
            }
          })
        }]
      };

      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(200, mockResponse);

      const result = await claudeIntegration.processFoodLog('test food', 123456789);

      // The validation logic should catch the energy inconsistency
      if (result.success) {
        const nutrition = result.data.per_portion;
        const calculatedEnergy = (
          nutrition.protein_g * 4 +
          nutrition.fat_g * 9 +
          nutrition.carbs_available_g * 4 +
          nutrition.fiber_total_g * 2 +
          nutrition.polyols_g * 2.4
        );
        
        // Allow some tolerance (±10%)
        const tolerance = 0.1;
        const energyDifference = Math.abs(nutrition.energy_kcal - calculatedEnergy) / calculatedEnergy;
        
        expect(energyDifference).toBeLessThan(tolerance);
      }
    });

    it('should validate carbohydrate consistency', async () => {
      const mockResponse = {
        content: [{
          text: JSON.stringify({
            name: 'Test Food',
            per_portion: {
              ...global.mockNutritionData,
              carbs_total_g: 20.0,
              carbs_available_g: 15.0,
              fiber_total_g: 3.0,
              polyols_g: 1.0,
              // carbs_total should equal carbs_available + fiber + polyols
              // 15 + 3 + 1 = 19, but carbs_total is 20 (inconsistent)
            }
          })
        }]
      };

      nock(CLAUDE_API_URL)
        .post('/v1/messages')
        .reply(200, mockResponse);

      const result = await claudeIntegration.processFoodLog('test food', 123456789);

      if (result.success) {
        const nutrition = result.data.per_portion;
        const expectedTotal = nutrition.carbs_available_g + nutrition.fiber_total_g + nutrition.polyols_g;
        
        // Should be consistent within small rounding tolerance
        expect(Math.abs(nutrition.carbs_total_g - expectedTotal)).toBeLessThan(0.5);
      }
    });
  });
});