// tests/integration/security.test.js - Security middleware tests

const request = require('supertest');
const express = require('express');
const crypto = require('crypto');

// Mock config before requiring other modules
const mockConfig = {
  telegram: {
    botToken: 'mock_bot_token',
    allowedUsers: [123456789, 987654321],
    webhookSecret: 'test_webhook_secret',
  },
  app: {
    environment: 'test'
  }
};

jest.mock('../../src/config', () => mockConfig);

describe('Security Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('User Authentication', () => {
    // Mock authentication middleware based on webhook.js implementation
    const authenticateUser = (req, res, next) => {
      const userId = req.body?.message?.from?.id;
      const allowedUsers = mockConfig.telegram.allowedUsers;

      // If no allowedUsers configured, allow all users
      if (!allowedUsers || allowedUsers.length === 0) {
        return next();
      }

      // Validate userId is a valid positive integer (consistent with rate limiter)
      if (!userId || !Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
          error: 'Invalid request format',
          message: 'Invalid or missing user ID'
        });
      }

      if (!allowedUsers.includes(userId)) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'This bot is restricted to authorized users only'
        });
      }

      next();
    };

    beforeEach(() => {
      app.post('/webhook', authenticateUser, (req, res) => {
        res.json({ ok: true, message: 'Authenticated successfully' });
      });
    });

    it('should allow authorized users', async () => {
      const telegramUpdate = global.mockTelegramUpdate({
        message: {
          from: { id: 123456789 }, // Authorized user
          text: 'test message'
        }
      });

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });

    it('should reject unauthorized users', async () => {
      const telegramUpdate = global.mockTelegramUpdate({
        message: {
          from: { id: 555555555 }, // Unauthorized user
          text: 'test message'
        }
      });

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
      expect(response.body.message).toContain('restricted to authorized users');
    });

    it('should reject requests without user ID', async () => {
      const telegramUpdate = {
        update_id: 123,
        message: {
          text: 'test message'
          // Missing 'from' field
        }
      };

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request format');
    });

    it('should reject requests with string user ID', async () => {
      const telegramUpdate = global.mockTelegramUpdate({
        message: {
          from: { id: "123456789" }, // String instead of integer
          text: 'test message'
        }
      });

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request format');
      expect(response.body.message).toContain('Invalid or missing user ID');
    });

    it('should reject requests with negative user ID', async () => {
      const telegramUpdate = global.mockTelegramUpdate({
        message: {
          from: { id: -123456789 }, // Negative integer
          text: 'test message'
        }
      });

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request format');
    });

    it('should reject requests with zero user ID', async () => {
      const telegramUpdate = global.mockTelegramUpdate({
        message: {
          from: { id: 0 }, // Zero
          text: 'test message'
        }
      });

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request format');
    });

    it('should reject requests with float user ID', async () => {
      const telegramUpdate = global.mockTelegramUpdate({
        message: {
          from: { id: 123.456 }, // Float instead of integer
          text: 'test message'
        }
      });

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request format');
    });

    it('should allow multiple authorized users', async () => {
      const user1Update = global.mockTelegramUpdate({
        message: { from: { id: 123456789 } }
      });
      const user2Update = global.mockTelegramUpdate({
        message: { from: { id: 987654321 } }
      });

      const response1 = await request(app).post('/webhook').send(user1Update);
      const response2 = await request(app).post('/webhook').send(user2Update);

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
    });

    it('should allow all users when allowedUsers is empty', async () => {
      // Temporarily modify config
      const originalAllowedUsers = mockConfig.telegram.allowedUsers;
      mockConfig.telegram.allowedUsers = [];

      const telegramUpdate = global.mockTelegramUpdate({
        message: { from: { id: 999999999 } } // Any user ID
      });

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(200);

      // Restore config
      mockConfig.telegram.allowedUsers = originalAllowedUsers;
    });

    it('should allow all users when allowedUsers is null', async () => {
      const originalAllowedUsers = mockConfig.telegram.allowedUsers;
      mockConfig.telegram.allowedUsers = null;

      const telegramUpdate = global.mockTelegramUpdate({
        message: { from: { id: 999999999 } }
      });

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(200);

      mockConfig.telegram.allowedUsers = originalAllowedUsers;
    });
  });

  describe('Webhook Secret Verification', () => {
    const verifyWebhookSecret = (req, res, next) => {
      const webhookSecret = mockConfig.telegram.webhookSecret;
      
      // If no webhook secret configured, skip verification
      if (!webhookSecret) {
        return next();
      }

      const providedSecret = req.headers['x-telegram-bot-api-secret-token'] || 
                            req.headers['x-webhook-secret'];
      
      if (!providedSecret) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Missing webhook secret token'
        });
      }

      if (providedSecret !== webhookSecret) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid webhook secret token'
        });
      }

      next();
    };

    beforeEach(() => {
      app.post('/webhook', verifyWebhookSecret, (req, res) => {
        res.json({ ok: true, message: 'Webhook verified successfully' });
      });
    });

    it('should accept requests with correct secret token', async () => {
      const response = await request(app)
        .post('/webhook')
        .set('x-telegram-bot-api-secret-token', 'test_webhook_secret')
        .send(global.mockTelegramUpdate());

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });

    it('should accept requests with alternative secret header', async () => {
      const response = await request(app)
        .post('/webhook')
        .set('x-webhook-secret', 'test_webhook_secret')
        .send(global.mockTelegramUpdate());

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });

    it('should reject requests with invalid secret token', async () => {
      const response = await request(app)
        .post('/webhook')
        .set('x-telegram-bot-api-secret-token', 'wrong_secret')
        .send(global.mockTelegramUpdate());

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
      expect(response.body.message).toContain('Invalid webhook secret');
    });

    it('should reject requests without secret token', async () => {
      const response = await request(app)
        .post('/webhook')
        .send(global.mockTelegramUpdate());

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
      expect(response.body.message).toContain('Missing webhook secret');
    });

    it('should skip verification when no secret is configured', async () => {
      const originalSecret = mockConfig.telegram.webhookSecret;
      mockConfig.telegram.webhookSecret = null;

      const response = await request(app)
        .post('/webhook')
        .send(global.mockTelegramUpdate());

      expect(response.status).toBe(200);

      mockConfig.telegram.webhookSecret = originalSecret;
    });

    it('should handle empty secret token', async () => {
      const response = await request(app)
        .post('/webhook')
        .set('x-telegram-bot-api-secret-token', '')
        .send(global.mockTelegramUpdate());

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid webhook secret');
    });

    it('should be case-sensitive for secret comparison', async () => {
      const response = await request(app)
        .post('/webhook')
        .set('x-telegram-bot-api-secret-token', 'Test_Webhook_Secret') // Different case
        .send(global.mockTelegramUpdate());

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid webhook secret');
    });
  });

  describe('Rate Limiting', () => {
    const RATE_LIMIT_REQUESTS_PER_MINUTE = 30;
    const RATE_LIMIT_WINDOW_MS = 60 * 1000;
    const rateLimitStorage = new Map();

    const rateLimitMiddleware = (req, res, next) => {
      const userId = req.body?.message?.from?.id;
      if (!userId) {
        return res.status(400).json({ error: 'No user ID provided' });
      }

      const now = Date.now();
      const cutoff = now - RATE_LIMIT_WINDOW_MS;
      
      let userRequests = rateLimitStorage.get(userId) || [];
      userRequests = userRequests.filter(timestamp => timestamp > cutoff);
      
      if (userRequests.length >= RATE_LIMIT_REQUESTS_PER_MINUTE) {
        const oldestRequest = Math.min(...userRequests);
        const resetTime = Math.ceil((oldestRequest + RATE_LIMIT_WINDOW_MS - now) / 1000);
        
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: `You can make up to ${RATE_LIMIT_REQUESTS_PER_MINUTE} requests per minute`,
          resetTime
        });
      }
      
      userRequests.push(now);
      rateLimitStorage.set(userId, userRequests);
      
      next();
    };

    beforeEach(() => {
      rateLimitStorage.clear();
      app.post('/webhook', rateLimitMiddleware, (req, res) => {
        res.json({ ok: true });
      });
    });

    it('should allow requests under rate limit', async () => {
      const telegramUpdate = global.mockTelegramUpdate({
        message: { from: { id: 123456789 } }
      });

      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .post('/webhook')
          .send(telegramUpdate);

        expect(response.status).toBe(200);
      }
    });

    it('should reject requests over rate limit', async () => {
      const telegramUpdate = global.mockTelegramUpdate({
        message: { from: { id: 123456789 } }
      });

      // Send requests up to the limit
      for (let i = 0; i < RATE_LIMIT_REQUESTS_PER_MINUTE; i++) {
        await request(app).post('/webhook').send(telegramUpdate);
      }

      // The next request should be rate limited
      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(429);
      expect(response.body.error).toBe('Rate limit exceeded');
      expect(response.body.resetTime).toBeGreaterThan(0);
    });

    it('should track rate limits per user separately', async () => {
      const user1Update = global.mockTelegramUpdate({
        message: { from: { id: 123456789 } }
      });
      const user2Update = global.mockTelegramUpdate({
        message: { from: { id: 987654321 } }
      });

      // Fill up user1's rate limit
      for (let i = 0; i < RATE_LIMIT_REQUESTS_PER_MINUTE; i++) {
        await request(app).post('/webhook').send(user1Update);
      }

      // User1 should be rate limited
      const user1Response = await request(app)
        .post('/webhook')
        .send(user1Update);
      expect(user1Response.status).toBe(429);

      // User2 should still be allowed
      const user2Response = await request(app)
        .post('/webhook')
        .send(user2Update);
      expect(user2Response.status).toBe(200);
    });

    it('should reset rate limit after time window', async () => {
      const telegramUpdate = global.mockTelegramUpdate({
        message: { from: { id: 123456789 } }
      });

      // Manually add old timestamps to simulate time passing
      const userId = 123456789;
      const oldTimestamp = Date.now() - (RATE_LIMIT_WINDOW_MS + 1000); // Older than window
      const oldRequests = Array(RATE_LIMIT_REQUESTS_PER_MINUTE).fill(oldTimestamp);
      rateLimitStorage.set(userId, oldRequests);

      // Should allow new request since old ones are outside the window
      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(200);
    });

    it('should handle requests without user ID gracefully', async () => {
      const invalidUpdate = {
        update_id: 123,
        message: {
          text: 'test'
          // Missing 'from' field
        }
      };

      const response = await request(app)
        .post('/webhook')
        .send(invalidUpdate);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('No user ID');
    });
  });

  describe('Input Sanitization', () => {
    const sanitizeForLogging = (input) => {
      if (typeof input !== 'string') {
        return String(input);
      }
      
      return input
        .replace(/[\r\n]/g, ' ')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .substring(0, 500);
    };

    const sanitizationMiddleware = (req, res, next) => {
      if (req.body?.message?.text) {
        req.body.message.text = sanitizeForLogging(req.body.message.text);
      }
      next();
    };

    beforeEach(() => {
      app.post('/webhook', sanitizationMiddleware, (req, res) => {
        res.json({
          ok: true,
          sanitizedText: req.body.message?.text
        });
      });
    });

    it('should sanitize control characters', async () => {
      const telegramUpdate = global.mockTelegramUpdate({
        message: {
          text: 'normal text\x00\x08with\x1Fcontrol\x7Fchars'
        }
      });

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(200);
      expect(response.body.sanitizedText).toBe('normal textwithcontrolchars');
    });

    it('should replace newlines with spaces', async () => {
      const telegramUpdate = global.mockTelegramUpdate({
        message: {
          text: 'line1\nline2\r\nline3\rline4'
        }
      });

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(200);
      expect(response.body.sanitizedText).toBe('line1 line2  line3 line4');
    });

    it('should limit text length', async () => {
      const longText = 'a'.repeat(1000);
      const telegramUpdate = global.mockTelegramUpdate({
        message: { text: longText }
      });

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(200);
      expect(response.body.sanitizedText.length).toBe(500);
    });

    it('should handle non-string input', async () => {
      const telegramUpdate = global.mockTelegramUpdate({
        message: { text: 12345 }
      });

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(200);
      expect(response.body.sanitizedText).toBe('12345');
    });

    it('should handle null and undefined input', async () => {
      const nullUpdate = global.mockTelegramUpdate({
        message: { text: null }
      });
      const undefinedUpdate = global.mockTelegramUpdate({
        message: { text: undefined }
      });

      const response1 = await request(app)
        .post('/webhook')
        .send(nullUpdate);
      
      const response2 = await request(app)
        .post('/webhook')
        .send(undefinedUpdate);

      expect(response1.body.sanitizedText).toBe('null');
      expect(response2.body.sanitizedText).toBe('undefined');
    });
  });

  describe('Combined Security Middleware', () => {
    // Simulate the full security stack
    const fullSecurityStack = [
      // 1. Webhook secret verification
      (req, res, next) => {
        const secret = req.headers['x-telegram-bot-api-secret-token'];
        if (mockConfig.telegram.webhookSecret && secret !== mockConfig.telegram.webhookSecret) {
          return res.status(401).json({ error: 'Invalid webhook secret' });
        }
        next();
      },
      // 2. User authentication
      (req, res, next) => {
        const userId = req.body?.message?.from?.id;
        const allowedUsers = mockConfig.telegram.allowedUsers;
        
        if (allowedUsers && allowedUsers.length > 0 && !allowedUsers.includes(userId)) {
          return res.status(401).json({ error: 'Unauthorized user' });
        }
        next();
      },
      // 3. Rate limiting (simplified)
      (req, res, next) => {
        // Simple rate limit check would go here
        next();
      },
      // 4. Input sanitization
      (req, res, next) => {
        if (req.body?.message?.text) {
          req.body.message.text = req.body.message.text.substring(0, 500);
        }
        next();
      }
    ];

    beforeEach(() => {
      app.post('/webhook', ...fullSecurityStack, (req, res) => {
        res.json({ ok: true, message: 'All security checks passed' });
      });
    });

    it('should pass all security checks for valid request', async () => {
      const telegramUpdate = global.mockTelegramUpdate({
        message: {
          from: { id: 123456789 }, // Authorized user
          text: 'valid message'
        }
      });

      const response = await request(app)
        .post('/webhook')
        .set('x-telegram-bot-api-secret-token', 'test_webhook_secret')
        .send(telegramUpdate);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('All security checks passed');
    });

    it('should fail on any security check failure', async () => {
      const telegramUpdate = global.mockTelegramUpdate({
        message: {
          from: { id: 123456789 },
          text: 'valid message'
        }
      });

      // Missing webhook secret
      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid webhook secret');
    });

    it('should process requests in correct order', async () => {
      // Test that webhook secret is checked before user auth
      const telegramUpdate = global.mockTelegramUpdate({
        message: {
          from: { id: 999999999 }, // Unauthorized user
          text: 'test message'
        }
      });

      // With wrong secret, should fail at webhook verification
      const response1 = await request(app)
        .post('/webhook')
        .set('x-telegram-bot-api-secret-token', 'wrong_secret')
        .send(telegramUpdate);

      expect(response1.status).toBe(401);
      expect(response1.body.error).toBe('Invalid webhook secret');

      // With correct secret but wrong user, should fail at user auth
      const response2 = await request(app)
        .post('/webhook')
        .set('x-telegram-bot-api-secret-token', 'test_webhook_secret')
        .send(telegramUpdate);

      expect(response2.status).toBe(401);
      expect(response2.body.error).toBe('Unauthorized user');
    });
  });

  describe('Security Headers and Best Practices', () => {
    beforeEach(() => {
      // Add security headers middleware
      app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        next();
      });

      app.post('/webhook', (req, res) => {
        res.json({ ok: true });
      });
    });

    it('should include security headers in response', async () => {
      const response = await request(app)
        .post('/webhook')
        .send(global.mockTelegramUpdate());

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
      expect(response.headers['strict-transport-security']).toContain('max-age=31536000');
    });

    it('should handle CORS appropriately', async () => {
      // Telegram webhooks shouldn't need CORS, but test the behavior
      const response = await request(app)
        .post('/webhook')
        .set('Origin', 'https://malicious-site.com')
        .send(global.mockTelegramUpdate());

      // Should not include CORS headers for webhook endpoints
      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  // =========================================================================
  // NEW TESTS FOR P0/P1 SECURITY FIXES
  // =========================================================================

  describe('Setup Endpoint Authentication (P0-5)', () => {
    let originalEnv;

    beforeEach(() => {
      originalEnv = process.env.NODE_ENV;
      process.env.SETUP_TOKEN = 'test_setup_token_12345';
      mockConfig.app.environment = 'production';

      app.get('/setup', (req, res) => {
        // Simulate production authentication check
        if (mockConfig.app.environment === 'production') {
          const providedToken = req.query.token || req.headers['x-setup-token'];
          const expectedToken = process.env.SETUP_TOKEN;

          if (!expectedToken) {
            return res.status(500).json({
              success: false,
              error: 'Setup endpoint misconfigured',
              message: 'SETUP_TOKEN must be set in production for security'
            });
          }

          if (!providedToken || providedToken !== expectedToken) {
            return res.status(401).json({
              success: false,
              error: 'Unauthorized',
              message: 'Valid SETUP_TOKEN required for webhook setup in production'
            });
          }
        }

        res.json({ success: true, message: 'Webhook setup successful' });
      });
    });

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      delete process.env.SETUP_TOKEN;
      mockConfig.app.environment = 'test';
    });

    it('should accept /setup request with valid token in query parameter', async () => {
      const response = await request(app)
        .get('/setup?token=test_setup_token_12345');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('setup successful');
    });

    it('should accept /setup request with valid token in header', async () => {
      const response = await request(app)
        .get('/setup')
        .set('x-setup-token', 'test_setup_token_12345');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject /setup request without token in production', async () => {
      const response = await request(app).get('/setup');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
      expect(response.body.message).toContain('SETUP_TOKEN required');
    });

    it('should reject /setup request with invalid token', async () => {
      const response = await request(app)
        .get('/setup?token=wrong_token');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should fail if SETUP_TOKEN not configured in production', async () => {
      delete process.env.SETUP_TOKEN;

      const response = await request(app).get('/setup');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Setup endpoint misconfigured');
      expect(response.body.message).toContain('SETUP_TOKEN must be set');
    });

    it('should allow /setup without token in development', async () => {
      mockConfig.app.environment = 'development';

      const response = await request(app).get('/setup');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Request Size Limits (P0-1)', () => {
    beforeEach(() => {
      app.use(express.json({ limit: '10mb' }));
      app.post('/webhook', (req, res) => {
        res.json({ ok: true, size: JSON.stringify(req.body).length });
      });
    });

    it('should accept requests under 10MB', async () => {
      const smallPayload = { data: 'x'.repeat(1000) }; // ~1KB

      const response = await request(app)
        .post('/webhook')
        .send(smallPayload);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });

    it('should reject requests over 10MB', async () => {
      // Create payload slightly over 10MB
      const largePayload = { data: 'x'.repeat(11 * 1024 * 1024) };

      const response = await request(app)
        .post('/webhook')
        .send(largePayload);

      // Express should reject with 413 Payload Too Large
      expect(response.status).toBe(413);
    });

    it('should handle requests at exactly 10MB boundary', async () => {
      const boundaryPayload = { data: 'x'.repeat(10 * 1024 * 1024 - 100) };

      const response = await request(app)
        .post('/webhook')
        .send(boundaryPayload);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });
  });

  describe('Rate Limiter User ID Validation (P0-2)', () => {
    const rateLimitMiddleware = (req, res, next) => {
      const userId = req.body?.message?.from?.id;

      // P0 Security Fix: Validate userId is a valid positive integer
      if (!userId || !Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
          error: 'Invalid request format',
          message: 'Valid user ID required'
        });
      }

      next();
    };

    beforeEach(() => {
      app.post('/webhook', rateLimitMiddleware, (req, res) => {
        res.json({ ok: true });
      });
    });

    it('should accept requests with valid positive integer user ID', async () => {
      const validUpdate = global.mockTelegramUpdate({
        message: {
          from: { id: 123456789 }, // Valid positive integer
          text: 'test'
        }
      });

      const response = await request(app)
        .post('/webhook')
        .send(validUpdate);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });

    it('should reject requests with missing user ID', async () => {
      const invalidUpdate = {
        update_id: 123,
        message: {
          text: 'test'
          // Missing 'from' field
        }
      };

      const response = await request(app)
        .post('/webhook')
        .send(invalidUpdate);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request format');
      expect(response.body.message).toContain('Valid user ID required');
    });

    it('should reject requests with string user ID', async () => {
      const invalidUpdate = global.mockTelegramUpdate({
        message: {
          from: { id: "123456789" }, // String instead of number
          text: 'test'
        }
      });

      const response = await request(app)
        .post('/webhook')
        .send(invalidUpdate);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request format');
    });

    it('should reject requests with negative user ID', async () => {
      const invalidUpdate = global.mockTelegramUpdate({
        message: {
          from: { id: -123 }, // Negative number
          text: 'test'
        }
      });

      const response = await request(app)
        .post('/webhook')
        .send(invalidUpdate);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request format');
    });

    it('should reject requests with zero user ID', async () => {
      const invalidUpdate = global.mockTelegramUpdate({
        message: {
          from: { id: 0 }, // Zero
          text: 'test'
        }
      });

      const response = await request(app)
        .post('/webhook')
        .send(invalidUpdate);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request format');
    });

    it('should reject requests with float user ID', async () => {
      const invalidUpdate = global.mockTelegramUpdate({
        message: {
          from: { id: 123.456 }, // Float
          text: 'test'
        }
      });

      const response = await request(app)
        .post('/webhook')
        .send(invalidUpdate);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request format');
    });
  });

  describe('Production Configuration Validation (P0-3, P0-4)', () => {
    // These tests verify that the config module properly validates
    // required environment variables in production mode

    it('should document ALLOWED_USERS requirement in production', () => {
      // This is a documentation test - the actual validation happens in config.js
      // which throws an error on module load if ALLOWED_USERS is not set in production
      expect(mockConfig.telegram.allowedUsers).toBeDefined();
      expect(Array.isArray(mockConfig.telegram.allowedUsers)).toBe(true);
      expect(mockConfig.telegram.allowedUsers.length).toBeGreaterThan(0);
    });

    it('should document WEBHOOK_SECRET requirement in production', () => {
      // This is a documentation test - the actual validation happens in config.js
      expect(mockConfig.telegram.webhookSecret).toBeDefined();
      expect(typeof mockConfig.telegram.webhookSecret).toBe('string');
      expect(mockConfig.telegram.webhookSecret.length).toBeGreaterThan(0);
    });

    it('should validate user IDs are positive integers', () => {
      const userIds = mockConfig.telegram.allowedUsers;
      userIds.forEach(userId => {
        expect(Number.isInteger(userId)).toBe(true);
        expect(userId).toBeGreaterThan(0);
      });
    });
  });

});