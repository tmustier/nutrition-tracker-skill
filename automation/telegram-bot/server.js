// server.js - Express server for Nutrition Tracker Telegram Bot
//
// This server provides webhook endpoints for local development and Railway deployment.
// It integrates with the webhook handler module to process Telegram updates.
//
// Endpoints:
// - GET /         - Health check
// - GET /setup    - Register webhook with Telegram
// - POST /webhook - Process Telegram updates
//
// Compatible with:
// - Local development with ngrok
// - Railway deployment (auto-detects RAILWAY_PUBLIC_DOMAIN)
// - Other cloud platforms via WEBHOOK_URL env var

const config = require('./src/config');
const webhook = require('./src/webhook');

// Try to load Express, fallback to http if not available
let app;
let useExpress = false;

try {
  const express = require('express');
  app = express();
  app.use(express.json());
  useExpress = true;
  console.log('✓ Using Express.js');
} catch (error) {
  console.log('⚠️  Express not installed, using built-in http module');
  console.log('   Run: npm install express  (recommended for production)');
}

const PORT = config.app.port;
const WEBHOOK_URL = config.telegram.webhookUrl;

// ============================================================================
// REQUEST LOGGING MIDDLEWARE
// ============================================================================

/**
 * Log all incoming requests for debugging
 */
function logRequest(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);

  // Log request body for POST requests (truncated)
  if (req.method === 'POST' && req.body) {
    const bodyPreview = JSON.stringify(req.body).substring(0, 200);
    console.log(`  Body: ${bodyPreview}${bodyPreview.length >= 200 ? '...' : ''}`);
  }

  if (next) next();
}

// ============================================================================
// ROUTE HANDLERS
// ============================================================================

/**
 * GET / - Health check endpoint
 * Returns bot status and available endpoints
 */
function handleHealthCheck(req, res) {
  logRequest(req, res);

  const health = webhook.healthCheck();

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
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
    webhook_url: WEBHOOK_URL
  }, null, 2));
}

/**
 * GET /setup - Webhook setup endpoint
 * Registers the webhook URL with Telegram's servers
 */
async function handleSetup(req, res) {
  logRequest(req, res);

  try {
    const webhookUrl = `${WEBHOOK_URL}/webhook`;

    console.log(`\n🔧 Setting up webhook...`);
    console.log(`   URL: ${webhookUrl}`);

    // Call Telegram API to set webhook
    await webhook.bot.telegram.setWebhook(webhookUrl);

    // Get webhook info to confirm
    const webhookInfo = await webhook.bot.telegram.getWebhookInfo();

    console.log('✓ Webhook setup successful');
    console.log(`   Pending updates: ${webhookInfo.pending_update_count}`);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'Webhook configured successfully',
      webhook_url: webhookUrl,
      webhook_info: {
        url: webhookInfo.url,
        has_custom_certificate: webhookInfo.has_custom_certificate,
        pending_update_count: webhookInfo.pending_update_count,
        last_error_date: webhookInfo.last_error_date,
        last_error_message: webhookInfo.last_error_message
      }
    }, null, 2));
  } catch (error) {
    console.error('❌ Webhook setup failed:', error.message);

    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: 'Failed to setup webhook',
      message: error.message,
      help: 'Ensure TELEGRAM_BOT_TOKEN is valid and WEBHOOK_URL is publicly accessible'
    }, null, 2));
  }
}

/**
 * POST /webhook - Main webhook handler
 * Processes incoming Telegram updates
 */
async function handleWebhook(req, res) {
  logRequest(req, res);

  try {
    // Validate request has a body
    if (!req.body || Object.keys(req.body).length === 0) {
      console.warn('⚠️  Received webhook request with empty body');
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Empty request body' }));
      return;
    }

    // Process update through Telegraf
    await webhook.bot.handleUpdate(req.body);

    // Respond to Telegram immediately
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
  } catch (error) {
    console.error('❌ Webhook handler error:', error);

    // Still send 200 to Telegram to avoid retries
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      error: error.message
    }));
  }
}

/**
 * 404 handler for unknown routes
 */
function handleNotFound(req, res) {
  logRequest(req, res);

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Not found',
    message: 'Unknown endpoint',
    available_endpoints: {
      health: 'GET /',
      setup: 'GET /setup',
      webhook: 'POST /webhook'
    }
  }, null, 2));
}

// ============================================================================
// SERVER SETUP - EXPRESS OR HTTP
// ============================================================================

if (useExpress) {
  // ========================================
  // EXPRESS.JS ROUTING
  // ========================================

  // Add request logging middleware
  app.use((req, res, next) => {
    logRequest(req, res);
    next();
  });

  // Health check
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
      webhook_url: WEBHOOK_URL
    });
  });

  // Webhook setup
  app.get('/setup', async (req, res) => {
    try {
      const webhookUrl = `${WEBHOOK_URL}/webhook`;

      console.log(`\n🔧 Setting up webhook...`);
      console.log(`   URL: ${webhookUrl}`);

      await webhook.bot.telegram.setWebhook(webhookUrl);
      const webhookInfo = await webhook.bot.telegram.getWebhookInfo();

      console.log('✓ Webhook setup successful');
      console.log(`   Pending updates: ${webhookInfo.pending_update_count}`);

      res.json({
        success: true,
        message: 'Webhook configured successfully',
        webhook_url: webhookUrl,
        webhook_info: {
          url: webhookInfo.url,
          has_custom_certificate: webhookInfo.has_custom_certificate,
          pending_update_count: webhookInfo.pending_update_count,
          last_error_date: webhookInfo.last_error_date,
          last_error_message: webhookInfo.last_error_message
        }
      });
    } catch (error) {
      console.error('❌ Webhook setup failed:', error.message);
      res.status(500).json({
        success: false,
        error: 'Failed to setup webhook',
        message: error.message,
        help: 'Ensure TELEGRAM_BOT_TOKEN is valid and WEBHOOK_URL is publicly accessible'
      });
    }
  });

  // Main webhook endpoint
  app.post('/webhook', async (req, res) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        console.warn('⚠️  Received webhook request with empty body');
        return res.status(400).json({ error: 'Empty request body' });
      }

      await webhook.bot.handleUpdate(req.body);
      res.json({ ok: true });
    } catch (error) {
      console.error('❌ Webhook handler error:', error);
      // Still send 200 to avoid Telegram retries
      res.json({ ok: true, error: error.message });
    }
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not found',
      message: 'Unknown endpoint',
      available_endpoints: {
        health: 'GET /',
        setup: 'GET /setup',
        webhook: 'POST /webhook'
      }
    });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error('Express error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: err.message
    });
  });

  // Start Express server
  app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 Nutrition Tracker Telegram Bot Server');
    console.log('='.repeat(60));
    console.log(`Environment:  ${config.app.environment}`);
    console.log(`Port:         ${PORT}`);
    console.log(`Webhook URL:  ${WEBHOOK_URL}`);
    console.log(`Bot Token:    ${config.telegram.botToken ? '✓ Configured' : '❌ Missing'}`);
    console.log(`Claude API:   ${config.claude.apiKey ? '✓ Configured' : '❌ Missing'}`);
    console.log(`GitHub API:   ${config.github.token ? '✓ Configured' : '❌ Missing'}`);
    console.log('='.repeat(60));
    console.log('\n📡 Endpoints:');
    console.log(`   Health:  http://localhost:${PORT}/`);
    console.log(`   Setup:   http://localhost:${PORT}/setup`);
    console.log(`   Webhook: http://localhost:${PORT}/webhook`);
    console.log('\n💡 Next steps:');
    console.log('   1. Visit /setup to register webhook with Telegram');
    console.log('   2. Send a message to your bot on Telegram');
    console.log('   3. Check this console for logs');
    console.log('\n' + '='.repeat(60) + '\n');
  });

} else {
  // ========================================
  // BUILT-IN HTTP MODULE (FALLBACK)
  // ========================================

  const http = require('http');

  // Simple JSON body parser
  function parseBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      req.on('error', reject);
    });
  }

  // Main HTTP server
  const server = http.createServer(async (req, res) => {
    // Parse request body for POST requests
    if (req.method === 'POST') {
      try {
        await parseBody(req);
      } catch (error) {
        console.error('Failed to parse request body:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }
    }

    // Route handlers
    if (req.method === 'GET' && req.url === '/') {
      handleHealthCheck(req, res);
    } else if (req.method === 'GET' && req.url === '/setup') {
      await handleSetup(req, res);
    } else if (req.method === 'POST' && req.url === '/webhook') {
      await handleWebhook(req, res);
    } else {
      handleNotFound(req, res);
    }
  });

  // Start HTTP server
  server.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 Nutrition Tracker Telegram Bot Server');
    console.log('='.repeat(60));
    console.log(`Environment:  ${config.app.environment}`);
    console.log(`Port:         ${PORT}`);
    console.log(`Webhook URL:  ${WEBHOOK_URL}`);
    console.log(`Bot Token:    ${config.telegram.botToken ? '✓ Configured' : '❌ Missing'}`);
    console.log(`Claude API:   ${config.claude.apiKey ? '✓ Configured' : '❌ Missing'}`);
    console.log(`GitHub API:   ${config.github.token ? '✓ Configured' : '❌ Missing'}`);
    console.log('='.repeat(60));
    console.log('\n⚠️  Using built-in http module (Express not installed)');
    console.log('   Recommendation: npm install express');
    console.log('\n📡 Endpoints:');
    console.log(`   Health:  http://localhost:${PORT}/`);
    console.log(`   Setup:   http://localhost:${PORT}/setup`);
    console.log(`   Webhook: http://localhost:${PORT}/webhook`);
    console.log('\n💡 Next steps:');
    console.log('   1. Visit /setup to register webhook with Telegram');
    console.log('   2. Send a message to your bot on Telegram');
    console.log('   3. Check this console for logs');
    console.log('\n' + '='.repeat(60) + '\n');
  });
}

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

process.on('SIGTERM', () => {
  console.log('\n📴 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n📴 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
