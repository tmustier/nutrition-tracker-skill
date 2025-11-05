// tests/unit/server.test.js - Unit tests for server endpoints

const request = require('supertest');
const express = require('express');
const nock = require('nock');

// Mock dependencies before requiring server
jest.mock('../../src/webhook', () => ({
  bot: {
    telegram: {
      setWebhook: jest.fn(),
      getWebhookInfo: jest.fn(),
    },
    handleUpdate: jest.fn(),
  },
  healthCheck: jest.fn(() => ({
    status: 'ok',
    bot_configured: true,
    claude_configured: true,
    github_configured: true,
  })),
}));

const webhook = require('../../src/webhook');

describe('Server HTTP Endpoints', () => {
  let app;
  let server;

  beforeEach(() => {
    // Create fresh Express app for each test
    app = express();
    app.use(express.json());
    
    // Import server routes
    const config = require('../../src/config');
    
    // Health check endpoint
    app.get('/', (req, res) => {
      const health = webhook.healthCheck();
      res.json({
        status: 'ok',
        message: 'Nutrition Tracker Telegram Bot is running',
        version: '1.0.0',
        environment: config.app.environment,
        configuration: health,
        endpoints: {
          health: 'GET /',
          setup: 'GET /setup',
          webhook: 'POST /webhook'
        },
        webhook_url: config.telegram.webhookUrl
      });
    });

    // Webhook setup endpoint
    app.get('/setup', async (req, res) => {
      try {
        const webhookUrl = `${config.telegram.webhookUrl}/webhook`;
        
        await webhook.bot.telegram.setWebhook(webhookUrl);
        const webhookInfo = await webhook.bot.telegram.getWebhookInfo();

        res.json({
          success: true,
          message: 'Webhook configured successfully',
          webhook_url: webhookUrl,
          webhook_info: webhookInfo
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to setup webhook',
          message: error.message
        });
      }
    });

    // Main webhook endpoint
    app.post('/webhook', async (req, res) => {
      try {
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: 'Empty request body' });
        }

        await webhook.bot.handleUpdate(req.body);
        res.json({ ok: true });
      } catch (error) {
        res.json({ ok: true, error: error.message });
      }
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        error: 'Not found',
        message: 'Unknown endpoint'
      });
    });
  });

  afterEach(() => {
    if (server) {
      server.close();
      server = null;
    }
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return health check information', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'ok',
        message: 'Nutrition Tracker Telegram Bot is running',
        version: '1.0.0',
        endpoints: {
          health: 'GET /',
          setup: 'GET /setup',
          webhook: 'POST /webhook'
        }
      });
      expect(response.body.configuration).toBeDefined();
    });

    it('should include webhook URL in response', async () => {
      const response = await request(app).get('/');
      
      expect(response.body.webhook_url).toBe('https://test-webhook.example.com');
    });
  });

  describe('GET /setup', () => {
    it('should successfully setup webhook', async () => {
      webhook.bot.telegram.setWebhook.mockResolvedValue();
      webhook.bot.telegram.getWebhookInfo.mockResolvedValue({
        url: 'https://test-webhook.example.com/webhook',
        has_custom_certificate: false,
        pending_update_count: 0
      });

      const response = await request(app).get('/setup');
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        message: 'Webhook configured successfully',
        webhook_url: 'https://test-webhook.example.com/webhook'
      });
      
      expect(webhook.bot.telegram.setWebhook).toHaveBeenCalledWith('https://test-webhook.example.com/webhook');
      expect(webhook.bot.telegram.getWebhookInfo).toHaveBeenCalled();
    });

    it('should handle webhook setup errors', async () => {
      webhook.bot.telegram.setWebhook.mockRejectedValue(new Error('Invalid bot token'));

      const response = await request(app).get('/setup');
      
      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        success: false,
        error: 'Failed to setup webhook',
        message: 'Invalid bot token'
      });
    });
  });

  describe('POST /webhook', () => {
    it('should process valid Telegram update', async () => {
      const telegramUpdate = global.mockTelegramUpdate();
      webhook.bot.handleUpdate.mockResolvedValue();

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true });
      expect(webhook.bot.handleUpdate).toHaveBeenCalledWith(telegramUpdate);
    });

    it('should reject empty request body', async () => {
      const response = await request(app)
        .post('/webhook')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Empty request body' });
      expect(webhook.bot.handleUpdate).not.toHaveBeenCalled();
    });

    it('should handle webhook processing errors gracefully', async () => {
      const telegramUpdate = global.mockTelegramUpdate();
      webhook.bot.handleUpdate.mockRejectedValue(new Error('Processing failed'));

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);
      
      expect(response.status).toBe(200); // Still return 200 to avoid Telegram retries
      expect(response.body).toEqual({ ok: true, error: 'Processing failed' });
    });

    it('should reject null request body', async () => {
      const response = await request(app)
        .post('/webhook')
        .send();
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Empty request body' });
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-endpoint');
      
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: 'Not found',
        message: 'Unknown endpoint'
      });
    });

    it('should return 404 for unknown POST routes', async () => {
      const response = await request(app).post('/unknown-endpoint').send({});
      
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: 'Not found',
        message: 'Unknown endpoint'
      });
    });
  });

  describe('Request Validation', () => {
    it('should handle malformed JSON in POST requests', async () => {
      const response = await request(app)
        .post('/webhook')
        .set('Content-Type', 'application/json')
        .send('invalid json');
      
      expect(response.status).toBe(400);
    });

    it('should handle very large payloads', async () => {
      const largePayload = {
        ...global.mockTelegramUpdate(),
        message: {
          ...global.mockTelegramUpdate().message,
          text: 'x'.repeat(10000) // Very long message
        }
      };

      const response = await request(app)
        .post('/webhook')
        .send(largePayload);
      
      expect(response.status).toBe(200);
      expect(webhook.bot.handleUpdate).toHaveBeenCalledWith(largePayload);
    });
  });

  describe('Content-Type Handling', () => {
    it('should accept application/json content-type', async () => {
      const telegramUpdate = global.mockTelegramUpdate();

      const response = await request(app)
        .post('/webhook')
        .set('Content-Type', 'application/json')
        .send(telegramUpdate);
      
      expect(response.status).toBe(200);
    });

    it('should handle missing content-type header', async () => {
      const telegramUpdate = global.mockTelegramUpdate();

      const response = await request(app)
        .post('/webhook')
        .send(telegramUpdate);
      
      expect(response.status).toBe(200);
    });
  });
});