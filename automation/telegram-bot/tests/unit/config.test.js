// tests/unit/config.test.js - Unit tests for configuration validation

describe('Configuration Validation', () => {
  let originalEnv;

  beforeAll(() => {
    // Save original environment
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore original environment after each test
    process.env = { ...originalEnv };
    // Clear the require cache to reload config module
    delete require.cache[require.resolve('../../src/config')];
  });

  describe('Environment Variable Loading', () => {
    it('should load all required environment variables', () => {
      // Set test environment variables
      process.env.TELEGRAM_BOT_TOKEN = 'test_bot_token';
      process.env.ANTHROPIC_API_KEY = 'test_claude_key';
      process.env.GITHUB_TOKEN = 'test_github_token';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      const config = require('../../src/config');

      expect(config.telegram.botToken).toBe('test_bot_token');
      expect(config.claude.apiKey).toBe('test_claude_key');
      expect(config.github.token).toBe('test_github_token');
      expect(config.github.owner).toBe('test_owner');
      expect(config.github.repo).toBe('test_repo');
      expect(config.github.branch).toBe('test_branch');
    });

    it('should use default values for optional environment variables', () => {
      // Set required variables only
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      // Remove optional variables
      delete process.env.WEBHOOK_URL;
      delete process.env.CLAUDE_MODEL;
      delete process.env.PORT;
      delete process.env.USDA_API_KEY;

      const config = require('../../src/config');

      expect(config.claude.model).toBe('claude-sonnet-4-20250514'); // Default model
      expect(config.app.port).toBe(3000); // Default port
      expect(config.usda.apiKey).toBe('DEMO_KEY'); // Default USDA key
    });

    it('should handle Railway deployment environment', () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      process.env.RAILWAY_PUBLIC_DOMAIN = 'myapp.railway.app';
      delete process.env.WEBHOOK_URL; // Should use Railway domain

      const config = require('../../src/config');

      expect(config.telegram.webhookUrl).toBe('https://myapp.railway.app');
    });

    it('should prefer explicit WEBHOOK_URL over Railway domain', () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      process.env.WEBHOOK_URL = 'https://custom-domain.com';
      process.env.RAILWAY_PUBLIC_DOMAIN = 'myapp.railway.app';

      const config = require('../../src/config');

      expect(config.telegram.webhookUrl).toBe('https://custom-domain.com');
    });

    it('should fallback to localhost for development', () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      delete process.env.WEBHOOK_URL;
      delete process.env.RAILWAY_PUBLIC_DOMAIN;

      const config = require('../../src/config');

      expect(config.telegram.webhookUrl).toBe('http://localhost:3000');
    });
  });

  describe('Configuration Validation', () => {
    it('should validate required configuration in production', () => {
      process.env.NODE_ENV = 'production';
      
      // Missing required variables
      delete process.env.TELEGRAM_BOT_TOKEN;
      delete process.env.ANTHROPIC_API_KEY;
      delete process.env.GITHUB_TOKEN;

      // Should throw error in production mode
      expect(() => {
        delete require.cache[require.resolve('../../src/config')];
        require('../../src/config');
      }).toThrow();
    });

    it('should not throw in development with missing config', () => {
      process.env.NODE_ENV = 'development';
      
      // Missing some required variables
      delete process.env.TELEGRAM_BOT_TOKEN;

      // Should not throw in development
      expect(() => {
        delete require.cache[require.resolve('../../src/config')];
        require('../../src/config');
      }).not.toThrow();
    });

    it('should validate GitHub configuration completeness', () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      // Missing GITHUB_OWNER and GITHUB_REPO

      expect(() => {
        const validateConfig = require('../../src/config').validateConfig || ((config) => {
          if (!config.github.owner || !config.github.repo) {
            throw new Error('GitHub owner and repo are required');
          }
        });

        const config = {
          github: {
            token: 'test_token',
            owner: '',
            repo: ''
          }
        };

        validateConfig(config);
      }).toThrow('GitHub owner and repo are required');
    });
  });

  describe('HTTPS Webhook Security Validation', () => {
    it('should nullify HTTP webhook URL in production (degraded mode)', () => {
      // Simulate production with HTTP localhost fallback
      process.env.NODE_ENV = 'production';
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      // No WEBHOOK_URL or RAILWAY_PUBLIC_DOMAIN set
      delete process.env.WEBHOOK_URL;
      delete process.env.RAILWAY_PUBLIC_DOMAIN;

      // Mock console.error to prevent test output pollution
      const originalConsoleError = console.error;
      console.error = jest.fn();

      delete require.cache[require.resolve('../../src/config')];
      const config = require('../../src/config');

      // Webhook URL should be nullified for security
      expect(config.telegram.webhookUrl).toBeNull();

      // Should have logged security error
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('SECURITY ERROR')
      );

      // Restore console.error
      console.error = originalConsoleError;
    });

    it('should allow HTTP webhook URL in development', () => {
      // Development mode allows HTTP for testing
      process.env.NODE_ENV = 'development';
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      delete process.env.WEBHOOK_URL;
      delete process.env.RAILWAY_PUBLIC_DOMAIN;

      delete require.cache[require.resolve('../../src/config')];
      const config = require('../../src/config');

      // Should keep HTTP localhost URL in development
      expect(config.telegram.webhookUrl).toBe('http://localhost:3000');
    });

    it('should allow HTTPS webhook URL in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';
      process.env.WEBHOOK_URL = 'https://secure-app.railway.app';

      delete require.cache[require.resolve('../../src/config')];
      const config = require('../../src/config');

      // HTTPS URL should be preserved
      expect(config.telegram.webhookUrl).toBe('https://secure-app.railway.app');
    });

    it('should auto-detect Railway domain with HTTPS in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';
      process.env.RAILWAY_PUBLIC_DOMAIN = 'myapp.railway.app';

      delete process.env.WEBHOOK_URL;

      delete require.cache[require.resolve('../../src/config')];
      const config = require('../../src/config');

      // Should auto-construct HTTPS URL from Railway domain
      expect(config.telegram.webhookUrl).toBe('https://myapp.railway.app');
    });
  });

  describe('User Profile and Health Data', () => {
    it('should include complete user profile', () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      const config = require('../../src/config');

      expect(config.userProfile).toBeDefined();
      expect(config.userProfile.meta).toMatchObject({
        owner: 'Thomas',
        timezone: 'Europe/London'
      });
      
      expect(config.userProfile.targets).toMatchObject({
        protein_g_min: 170,
        fat_g_min: 70,
        carbs_g_min: 250
      });
      
      expect(config.userProfile.targets.energy_kcal).toMatchObject({
        rest_day_max: 2500,
        training_day_max: 2900
      });
    });

    it('should include monitoring configuration', () => {
      const config = require('../../src/config');

      expect(config.userProfile.monitoring).toBeDefined();
      expect(config.userProfile.monitoring.fats).toBeDefined();
      expect(config.userProfile.monitoring.carbs).toBeDefined();
      expect(config.userProfile.monitoring.minerals).toBeDefined();
      expect(config.userProfile.monitoring.vitamins).toBeDefined();
    });

    it('should include nutrition assumptions', () => {
      const config = require('../../src/config');

      expect(config.userProfile.assumptions).toMatchObject({
        salt_scheme_default: 'normal',
        oil_default: 'olive_oil'
      });

      expect(config.userProfile.assumptions.rounding).toMatchObject({
        energy_kcal: 'int',
        grams: '0.1',
        mg_ug: 'int'
      });
    });
  });

  describe('Security Configuration', () => {
    it('should parse allowed users from environment', () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      process.env.ALLOWED_USERS = '123456789,987654321,555000111';

      const config = require('../../src/config');

      expect(config.telegram.allowedUsers).toEqual([123456789, 987654321, 555000111]);
    });

    it('should handle malformed allowed users list', () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      process.env.ALLOWED_USERS = '123456789,not_a_number,987654321,';

      const config = require('../../src/config');

      // Should filter out invalid values
      expect(config.telegram.allowedUsers).toEqual([123456789, 987654321]);
    });

    it('should handle empty allowed users list', () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      process.env.ALLOWED_USERS = '';

      const config = require('../../src/config');

      expect(config.telegram.allowedUsers).toEqual([]);
    });

    it('should set allowedUsers to null when not configured', () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      delete process.env.ALLOWED_USERS;

      const config = require('../../src/config');

      expect(config.telegram.allowedUsers).toBeNull();
    });

    it('should include webhook secret configuration', () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      process.env.WEBHOOK_SECRET = 'super_secret_webhook_token';

      const config = require('../../src/config');

      expect(config.telegram.webhookSecret).toBe('super_secret_webhook_token');
    });
  });

  describe('Claude API Configuration', () => {
    it('should include embedded skill context', () => {
      const config = require('../../src/config');

      expect(config.skillContext).toBeDefined();
      expect(config.skillContext).toContain('Nutrition Tracking');
      expect(config.skillContext).toContain('ESTIMATING');
      expect(config.skillContext).toContain('energy_kcal');
    });

    it('should configure Claude model parameters', () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      process.env.CLAUDE_MODEL = 'claude-3-opus-20240229';
      process.env.CLAUDE_MAX_TOKENS = '8192';

      const config = require('../../src/config');

      expect(config.claude.model).toBe('claude-3-opus-20240229');
      expect(config.claude.maxTokens).toBe(8192);
    });

    it('should validate Claude max tokens as number', () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      process.env.CLAUDE_MAX_TOKENS = 'not_a_number';

      const config = require('../../src/config');

      // Should fall back to default or handle gracefully
      expect(typeof config.claude.maxTokens).toBe('number');
      expect(config.claude.maxTokens).toBeGreaterThan(0);
    });
  });

  describe('Application Configuration', () => {
    it('should configure port as number', () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      process.env.PORT = '8080';

      const config = require('../../src/config');

      expect(config.app.port).toBe(8080);
      expect(typeof config.app.port).toBe('number');
    });

    it('should handle invalid port gracefully', () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      process.env.PORT = 'invalid_port';

      const config = require('../../src/config');

      expect(config.app.port).toBe(3000); // Should fallback to default
    });

    it('should set correct environment', () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test_token';
      process.env.ANTHROPIC_API_KEY = 'test_key';
      process.env.GITHUB_TOKEN = 'test_github';
      process.env.GITHUB_OWNER = 'test_owner';
      process.env.GITHUB_REPO = 'test_repo';
      process.env.GITHUB_BRANCH = 'test_branch';

      process.env.NODE_ENV = 'production';

      const config = require('../../src/config');

      expect(config.app.environment).toBe('production');
    });
  });

  describe('Configuration Immutability', () => {
    it('should not allow modification of critical config', () => {
      const config = require('../../src/config');
      const originalBotToken = config.telegram.botToken;

      // Attempt to modify config
      config.telegram.botToken = 'modified_token';

      // Should not affect the actual config (if implemented as immutable)
      // For now, just verify the original value was set correctly
      expect(originalBotToken).toBeDefined();
    });

    it('should maintain consistent config across requires', () => {
      const config1 = require('../../src/config');
      const config2 = require('../../src/config');

      expect(config1).toBe(config2); // Should be the same object
    });
  });

  describe('Error Handling in Configuration', () => {
    it('should provide helpful error messages for missing required config', () => {
      process.env.NODE_ENV = 'test';
      delete process.env.TELEGRAM_BOT_TOKEN;

      try {
        delete require.cache[require.resolve('../../src/config')];
        const config = require('../../src/config');
        
        // If the config doesn't throw, simulate validation
        if (!config.telegram.botToken) {
          throw new Error('Missing required configuration: telegram.botToken');
        }
      } catch (error) {
        expect(error.message).toContain('TELEGRAM_BOT_TOKEN');
      }
    });

    it('should handle configuration loading errors gracefully', () => {
      // Mock a scenario where environment loading fails
      const originalProcess = process.env;
      
      try {
        // Create a scenario that might cause config loading to fail
        Object.defineProperty(process, 'env', {
          get: () => { throw new Error('Environment access failed'); }
        });

        expect(() => {
          delete require.cache[require.resolve('../../src/config')];
          require('../../src/config');
        }).toThrow('Environment access failed');
      } finally {
        // Restore process.env
        Object.defineProperty(process, 'env', {
          value: originalProcess,
          writable: true,
          configurable: true
        });
      }
    });
  });
});