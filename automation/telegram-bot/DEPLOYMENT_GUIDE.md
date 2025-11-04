# Deployment Guide - Nutrition Tracker Telegram Bot

## Quick Reference

| Component | File | Purpose |
|-----------|------|---------|
| **Server** | `server.js` | Express.js server with webhook endpoints |
| **Webhook Handler** | `src/webhook.js` | Telegram bot logic and message handlers |
| **Claude Integration** | `src/claude-integration.js` | Nutrition estimation via Claude API |
| **GitHub Integration** | `src/github-integration.js` | Log entries to GitHub |
| **Configuration** | `src/config.js` | Centralized config management |

## Architecture Overview

```
User sends message to Telegram
          ↓
Telegram sends webhook POST to /webhook
          ↓
server.js receives request
          ↓
webhook.js processes update
          ↓
┌─────────────────────────────────┐
│ Text Message    │  Photo Message │
├─────────────────┼────────────────┤
│ Extract food    │  Download image│
│ description     │  from Telegram │
│       ↓         │       ↓        │
│ Try USDA API    │  Claude Vision │
│       ↓         │  API extracts  │
│ Fallback to     │  nutrition     │
│ Claude API      │  data          │
└─────────────────┴────────────────┘
          ↓
github-integration.js logs to repo
          ↓
User receives confirmation with totals
```

## Local Development Setup

### Step 1: Clone and Install

```bash
cd /Users/thomasmustier/nutrition-tracking/automation/telegram-bot
npm install
```

### Step 2: Configure Environment

Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
ANTHROPIC_API_KEY=sk-ant-api03-xxx
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
WEBHOOK_URL=http://localhost:3000
```

### Step 3: Start Development Server

```bash
npm run dev
```

You should see:

```
🚀 Nutrition Tracker Telegram Bot Server
============================================================
Environment:  development
Port:         3000
Webhook URL:  http://localhost:3000
Bot Token:    ✓ Configured
Claude API:   ✓ Configured
GitHub API:   ✓ Configured
============================================================
```

### Step 4: Expose with ngrok

In a separate terminal:

```bash
ngrok http 3000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and update `.env`:

```env
WEBHOOK_URL=https://abc123.ngrok.io
```

Restart the server.

### Step 5: Register Webhook

Visit: `http://localhost:3000/setup`

You should see:

```json
{
  "success": true,
  "message": "Webhook configured successfully",
  "webhook_url": "https://abc123.ngrok.io/webhook"
}
```

### Step 6: Test

Send a message to your Telegram bot:

```
100g grilled chicken breast
```

Check server logs for processing:

```
[2025-11-04T23:31:00.000Z] POST /webhook
Processing food log from user 123456: 100g grilled chicken breast
✓ USDA lookup successful for: 100g grilled chicken breast
Successfully logged entry: {...}
```

## Railway Deployment (Production)

Railway is the recommended platform for production deployment.

### Step 1: Prepare Repository

Ensure `server.js` is in the root of `/automation/telegram-bot`:

```bash
cd /Users/thomasmustier/nutrition-tracking/automation/telegram-bot
ls -l server.js  # Should exist
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `tmustier/nutrition-tracking`
5. Set root directory: `automation/telegram-bot`

### Step 3: Configure Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
ANTHROPIC_API_KEY=your_claude_api_key_here
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=tmustier
GITHUB_REPO=nutrition-tracking
GITHUB_BRANCH=daily-logs
NODE_ENV=production
```

**Do NOT set** `WEBHOOK_URL` or `PORT` - Railway auto-configures these.

### Step 4: Deploy

Railway automatically detects `package.json` and runs:

```bash
npm install
npm start
```

Wait for deployment to complete (usually 1-2 minutes).

### Step 5: Get Public URL

In Railway dashboard:

1. Go to **Settings** tab
2. Click "Generate Domain"
3. Copy the domain (e.g., `nutrition-bot-production.railway.app`)

### Step 6: Register Webhook

Visit: `https://nutrition-bot-production.railway.app/setup`

You should see:

```json
{
  "success": true,
  "message": "Webhook configured successfully",
  "webhook_url": "https://nutrition-bot-production.railway.app/webhook"
}
```

### Step 7: Verify

1. Send a test message to your Telegram bot
2. Check Railway logs for processing
3. Verify GitHub commit was created in `daily-logs` branch

## Vercel Deployment (Alternative)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
cd /Users/thomasmustier/nutrition-tracking/automation/telegram-bot
vercel
```

Follow prompts:

- Set up and deploy: **Yes**
- Project name: **nutrition-tracker-bot**
- Directory: **./automation/telegram-bot**
- Override settings: **No**

### Step 3: Set Environment Variables

```bash
vercel env add TELEGRAM_BOT_TOKEN
vercel env add ANTHROPIC_API_KEY
vercel env add GITHUB_TOKEN
```

### Step 4: Register Webhook

Visit: `https://your-project.vercel.app/setup`

## Environment Variables Reference

### Required

| Variable | Where to Get | Example |
|----------|--------------|---------|
| `TELEGRAM_BOT_TOKEN` | [@BotFather](https://t.me/botfather) on Telegram | `123456:ABC-DEF...` |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/) | `sk-ant-api03-...` |
| `GITHUB_TOKEN` | [github.com/settings/tokens](https://github.com/settings/tokens) | `ghp_xxxxx...` |

### Optional (with Defaults)

| Variable | Default | Purpose |
|----------|---------|---------|
| `GITHUB_OWNER` | `tmustier` | GitHub username |
| `GITHUB_REPO` | `nutrition-tracking` | Repository name |
| `GITHUB_BRANCH` | `daily-logs` | Branch for logs |
| `PORT` | `3000` | Server port |
| `WEBHOOK_URL` | Auto-detected | Public webhook URL |
| `NODE_ENV` | `development` | Environment mode |
| `CLAUDE_MODEL` | `claude-sonnet-4-20250514` | Claude model |
| `USDA_API_KEY` | `DEMO_KEY` | USDA API key |

## Testing Checklist

### Local Testing

- [ ] Server starts without errors
- [ ] Health check responds at `http://localhost:3000/`
- [ ] Webhook setup succeeds at `/setup`
- [ ] ngrok tunnel is active
- [ ] Test message processes correctly
- [ ] GitHub commit is created
- [ ] User receives confirmation

### Production Testing

- [ ] Deployment succeeds (no build errors)
- [ ] Environment variables are set
- [ ] Public URL is accessible
- [ ] Webhook registration succeeds
- [ ] Test message processes correctly
- [ ] Logs show processing steps
- [ ] GitHub commit is created
- [ ] No errors in production logs

## Troubleshooting

### Problem: Webhook setup returns 401 Unauthorized

**Cause:** Invalid `TELEGRAM_BOT_TOKEN`

**Solution:**
1. Verify token from @BotFather
2. Ensure no extra spaces in `.env`
3. Restart server after updating

### Problem: Claude API returns 401

**Cause:** Invalid `ANTHROPIC_API_KEY`

**Solution:**
1. Check API key at console.anthropic.com
2. Verify key has proper permissions
3. Check for typos in `.env`

### Problem: GitHub logging fails

**Cause:** Invalid token or insufficient permissions

**Solution:**
1. Create new token with `repo` scope
2. Verify repository exists and is accessible
3. Check branch name matches configuration

### Problem: Webhook not receiving updates

**Cause:** URL not publicly accessible

**Solution:**
1. Verify ngrok is running (local dev)
2. Check webhook URL is HTTPS
3. Use `/setup` endpoint to re-register
4. Check Telegram webhook info:
   ```bash
   curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
   ```

### Problem: Express not found

**Solution:**
```bash
npm install express
```

The server will fallback to `http` module, but Express is recommended.

## Monitoring

### Check Server Health

```bash
curl https://your-domain.com/
```

Response should include:

```json
{
  "status": "ok",
  "configuration": {
    "bot_configured": true,
    "claude_configured": true,
    "github_configured": true
  }
}
```

### Check Webhook Status

Visit Telegram API:

```bash
curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
```

Look for:
- `url`: Should match your webhook endpoint
- `pending_update_count`: Should be 0 (or low)
- `last_error_message`: Should be null

### View Logs

**Railway:**
- Go to deployment in Railway dashboard
- Click "View Logs" tab
- Filter by level (info, error, etc.)

**Local:**
- Check console output where server is running

## Performance Considerations

### Request Processing Time

Typical flow takes 2-5 seconds:
- Webhook receive: <100ms
- USDA/Claude API: 1-3s
- GitHub commit: 500ms-1s
- Response to user: <100ms

### Rate Limits

- **Telegram**: No official limit, but avoid >30 msgs/sec
- **Claude API**: Check your plan limits
- **GitHub API**: 5000 requests/hour (authenticated)
- **USDA API**: 1000 requests/hour (DEMO_KEY), unlimited (with key)

### Optimization Tips

1. USDA is faster than Claude - used for generic foods
2. Implement caching for frequent foods (future enhancement)
3. Use webhooks instead of polling (already implemented)
4. Respond to Telegram immediately, process async

## Security Best Practices

1. **Never commit `.env` file** - use `.env.example` instead
2. **Rotate tokens regularly** - especially if compromised
3. **Use HTTPS only** - required by Telegram for webhooks
4. **Validate webhook updates** - already implemented
5. **Limit bot access** - use Telegram's built-in privacy settings
6. **Monitor logs** - watch for unusual activity
7. **Keep dependencies updated** - run `npm audit` regularly

## Support

For issues:
1. Check server logs for errors
2. Verify all environment variables
3. Test endpoints manually with curl
4. Review GitHub Actions logs
5. Check Telegram webhook info

## Next Steps

After successful deployment:

1. **Test thoroughly** - send various types of messages
2. **Monitor logs** - watch first few entries carefully
3. **Set up alerts** - use Railway/Vercel monitoring
4. **Document quirks** - note any food types that need adjustment
5. **Consider enhancements**:
   - Add user authentication
   - Implement food search
   - Add meal planning features
   - Create visualization dashboard

## License

Apache-2.0
