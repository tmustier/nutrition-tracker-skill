// tests/setup.js - Jest setup file for Telegram bot tests

require('dotenv').config({ path: '.env.test' });

// Mock environment variables for testing
process.env.TELEGRAM_BOT_TOKEN = 'mock_bot_token';
process.env.ANTHROPIC_API_KEY = 'mock_claude_api_key';
process.env.GITHUB_TOKEN = 'mock_github_token';
process.env.GITHUB_OWNER = 'test_owner';
process.env.GITHUB_REPO = 'test_repo';
process.env.GITHUB_BRANCH = 'daily-logs';
process.env.WEBHOOK_URL = 'https://test-webhook.example.com';
process.env.USDA_API_KEY = 'mock_usda_key';
process.env.NODE_ENV = 'test';

// Increase timeout for integration tests
jest.setTimeout(30000);

// Global test utilities
global.mockTelegramUpdate = (overrides = {}) => ({
  update_id: 123456,
  message: {
    message_id: 789,
    from: {
      id: 123456789,
      is_bot: false,
      first_name: 'Test',
      username: 'testuser',
    },
    chat: {
      id: 123456789,
      first_name: 'Test',
      username: 'testuser',
      type: 'private',
    },
    date: Math.floor(Date.now() / 1000),
    text: 'Test message',
    ...overrides.message,
  },
  ...overrides,
});

global.mockNutritionData = {
  energy_kcal: 250,
  protein_g: 25.0,
  fat_g: 10.0,
  sat_fat_g: 3.0,
  mufa_g: 5.0,
  pufa_g: 2.0,
  trans_fat_g: 0.0,
  cholesterol_mg: 50,
  sugar_g: 2.0,
  fiber_total_g: 1.0,
  fiber_soluble_g: 0.5,
  fiber_insoluble_g: 0.5,
  carbs_total_g: 15.0,
  carbs_available_g: 14.0,
  sodium_mg: 400,
  potassium_mg: 300,
  iodine_ug: 10,
  magnesium_mg: 25,
  calcium_mg: 50,
  iron_mg: 2,
  zinc_mg: 3,
  vitamin_c_mg: 5,
  manganese_mg: 1,
  polyols_g: 0.0,
};

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  // Clear any nock interceptors
  if (require.cache[require.resolve('nock')]) {
    require('nock').cleanAll();
  }
});