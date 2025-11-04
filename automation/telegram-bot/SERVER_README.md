# Telegram Bot Server Documentation

## Overview

The `server.js` file provides a production-ready Express.js server for the Nutrition Tracker Telegram Bot. It handles webhook requests from Telegram, processes nutrition data via Claude API, and logs to GitHub.

## File Structure

```
/Users/thomasmustier/nutrition-tracking/automation/telegram-bot/
├── server.js                   # Main Express server (this file)
├── src/
│   ├── webhook.js             # Telegram bot handlers
│   ├── claude-integration.js  # Claude API integration
│   ├── github-integration.js  # GitHub logging
│   ├── config.js              # Configuration management
│   └── usda-api.js            # USDA FoodData Central
├── package.json
└── .env                       # Environment variables
```

## Quick Start

### 1. Install Dependencies

```bash
cd /Users/thomasmustier/nutrition-tracking/automation/telegram-bot
npm install
```

This will install:
- `express` - Web server framework
- `telegraf` - Telegram Bot API
- `axios` - HTTP client
- `dotenv` - Environment variables
- `js-yaml` - YAML parser

### 2. Configure Environment

Create `.env` file with required variables:

```env
# Required
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
ANTHROPIC_API_KEY=your_claude_api_key_here
GITHUB_TOKEN=your_github_token_here

# Optional (with defaults)
GITHUB_OWNER=tmustier
GITHUB_REPO=nutrition-tracking
GITHUB_BRANCH=daily-logs
PORT=3000
NODE_ENV=development
WEBHOOK_URL=http://localhost:3000
```

### 3. Run Locally (Development)

```bash
# Start server with auto-reload
npm run dev

# Or without auto-reload
npm start
```

### 4. Set Up Webhook

For **local development with ngrok**:

```bash
# In a separate terminal, start ngrok
ngrok http 3000

# Update .env with ngrok URL
WEBHOOK_URL=https://your-ngrok-url.ngrok.io

# Visit setup endpoint
curl http://localhost:3000/setup
```

For **Railway deployment**:

1. Deploy to Railway (webhook URL auto-detected)
2. Visit `https://your-app.railway.app/setup`
3. Webhook is now registered with Telegram

## API Endpoints

### GET /

**Health check endpoint**

Returns server status and configuration.

**Response:**
```json
{
  "status": "ok",
  "message": "Nutrition Tracker Telegram Bot is running",
  "version": "1.0.0",
  "environment": "development",
  "configuration": {
    "bot_configured": true,
    "claude_configured": true,
    "github_configured": true
  },
  "endpoints": {
    "health": "GET /",
    "setup": "GET /setup",
    "webhook": "POST /webhook"
  },
  "webhook_url": "http://localhost:3000"
}
```

### GET /setup

**Webhook registration endpoint**

Registers the webhook URL with Telegram's servers. Call this once when deploying or when changing webhook URLs.

**Response:**
```json
{
  "success": true,
  "message": "Webhook configured successfully",
  "webhook_url": "https://your-domain.com/webhook",
  "webhook_info": {
    "url": "https://your-domain.com/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "last_error_date": null,
    "last_error_message": null
  }
}
```

### POST /webhook

**Main webhook handler**

Receives and processes Telegram updates. This endpoint is called by Telegram's servers when users interact with your bot.

**Request:** Telegram update object (sent by Telegram)

**Response:**
```json
{
  "ok": true
}
```

## Deployment

### Railway Deployment

1. **Connect Repository**
   - Go to Railway.app
   - Create new project from GitHub repo
   - Select `automation/telegram-bot` as root directory

2. **Set Environment Variables**
   ```
   TELEGRAM_BOT_TOKEN=...
   ANTHROPIC_API_KEY=...
   GITHUB_TOKEN=...
   GITHUB_OWNER=tmustier
   GITHUB_REPO=nutrition-tracking
   GITHUB_BRANCH=daily-logs
   NODE_ENV=production
   ```

3. **Deploy**
   - Railway auto-detects `package.json` and runs `npm start`
   - Public domain is auto-assigned (e.g., `your-app.railway.app`)
   - `RAILWAY_PUBLIC_DOMAIN` env var is automatically set

4. **Register Webhook**
   - Visit `https://your-app.railway.app/setup`
   - Webhook is now active

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd /Users/thomasmustier/nutrition-tracking/automation/telegram-bot
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add TELEGRAM_BOT_TOKEN
   vercel env add ANTHROPIC_API_KEY
   vercel env add GITHUB_TOKEN
   ```

4. **Register Webhook**
   Visit `https://your-project.vercel.app/setup`

### Other Platforms (Heroku, DigitalOcean, etc.)

The server is platform-agnostic and works anywhere Node.js is supported.

**Requirements:**
- Node.js 18+
- Public HTTPS endpoint (required by Telegram)
- Environment variables configured
- `npm install` and `npm start` support

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TELEGRAM_BOT_TOKEN` | ✅ Yes | - | Telegram bot token from @BotFather |
| `ANTHROPIC_API_KEY` | ✅ Yes | - | Claude API key |
| `GITHUB_TOKEN` | ✅ Yes | - | GitHub personal access token |
| `GITHUB_OWNER` | No | `tmustier` | GitHub repository owner |
| `GITHUB_REPO` | No | `nutrition-tracking` | GitHub repository name |
| `GITHUB_BRANCH` | No | `daily-logs` | Branch for logging data |
| `PORT` | No | `3000` | Server port |
| `WEBHOOK_URL` | No | Auto-detected | Public webhook URL |
| `NODE_ENV` | No | `development` | Environment mode |
| `CLAUDE_MODEL` | No | `claude-sonnet-4-20250514` | Claude model ID |
| `USDA_API_KEY` | No | `DEMO_KEY` | USDA API key (optional) |

### Auto-Detection

The server automatically detects deployment environment:

- **Railway**: Uses `RAILWAY_PUBLIC_DOMAIN` if available
- **Local**: Uses `http://localhost:{PORT}`
- **Custom**: Set `WEBHOOK_URL` manually

## Request Flow

### Text Message Flow

1. User sends text message to Telegram bot
2. Telegram sends POST request to `/webhook`
3. Server parses update and calls `webhook.bot.handleUpdate()`
4. Message handler processes text:
   - Checks for generic food keywords
   - Tries USDA API first (if generic)
   - Falls back to Claude API for estimation
5. Nutrition data is logged to GitHub via `github-integration.js`
6. User receives confirmation with nutrition breakdown

### Photo Message Flow

1. User sends photo to Telegram bot
2. Telegram sends POST request to `/webhook` with photo metadata
3. Server downloads photo from Telegram's servers
4. Photo is processed by Claude Vision API
5. Extracted nutrition data is logged to GitHub
6. User receives confirmation

## Error Handling

The server includes comprehensive error handling:

- **Configuration errors**: Validates required env vars on startup
- **Webhook errors**: Catches and logs but returns 200 to prevent retries
- **API errors**: Logs detailed error info and sends user-friendly messages
- **Unhandled rejections**: Logged to console
- **Uncaught exceptions**: Logged and exits gracefully

## Logging

All requests are logged with timestamps:

```
[2025-11-04T23:30:15.123Z] POST /webhook
  Body: {"update_id":123456,"message":{"message_id":1,"from":{"id":12345...
```

Enable verbose logging by setting `LOG_LEVEL=debug` in `.env`.

## Development

### Local Testing

```bash
# Terminal 1: Start server
npm run dev

# Terminal 2: Start ngrok
ngrok http 3000

# Terminal 3: Register webhook
curl http://localhost:3000/setup

# Terminal 4: Send test update
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "update_id": 1,
    "message": {
      "message_id": 1,
      "from": {"id": 123, "first_name": "Test"},
      "chat": {"id": 123, "type": "private"},
      "text": "100g chicken breast"
    }
  }'
```

### Testing Endpoints

```bash
# Health check
curl http://localhost:3000/

# Setup webhook
curl http://localhost:3000/setup

# Test webhook (requires valid Telegram update)
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d @test/sample-update.json
```

## Troubleshooting

### Webhook not receiving updates

1. Check webhook is registered:
   ```bash
   curl http://localhost:3000/setup
   ```

2. Verify webhook URL is publicly accessible:
   ```bash
   curl https://your-domain.com/
   ```

3. Check Telegram webhook info:
   ```bash
   curl https://api.telegram.org/bot{TOKEN}/getWebhookInfo
   ```

### Configuration errors

If you see "Missing required configuration" on startup:

1. Verify `.env` file exists
2. Check all required variables are set
3. Restart server after changes

### Express not found

If you see "Express not installed" warning:

```bash
npm install express
```

The server will work with built-in `http` module, but Express is recommended for production.

## Security

- All API keys are loaded from environment variables
- Webhook endpoint validates request bodies
- HTTPS required for production (Telegram requirement)
- No sensitive data logged in console output
- GitHub token requires minimal permissions (repo scope)

## Performance

- Asynchronous request handling
- Graceful error recovery
- Immediate 200 responses to Telegram (prevents retries)
- Background processing of nutrition estimation

## Support

For issues or questions:
1. Check server logs for errors
2. Verify environment variables
3. Test endpoints manually with curl
4. Check GitHub integration logs
5. Review Claude API usage/limits

## License

Apache-2.0
