# Railway Deployment Guide

This guide walks you through deploying the Nutrition Tracking Telegram Bot to Railway.

## Prerequisites

1. **Railway account** - Sign up at [railway.app](https://railway.app)
2. **Telegram Bot Token** - Get from [@BotFather](https://t.me/botfather)
3. **Anthropic API Key** - Get from [console.anthropic.com](https://console.anthropic.com)
4. **GitHub Personal Access Token** - Create at [github.com/settings/tokens](https://github.com/settings/tokens) with `repo` scope

## Deployment Steps

### 1. Create New Railway Project

```bash
# From the telegram-bot directory
cd automation/telegram-bot
railway init
```

Or create manually in Railway dashboard.

### 2. Configure Environment Variables

In Railway dashboard, navigate to your project → Variables tab and add:

**Required Variables:**

```bash
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz  # From @BotFather
ANTHROPIC_API_KEY=sk-ant-api03-...                        # From Anthropic
GITHUB_TOKEN=ghp_...                                       # Your GitHub PAT
```

**Optional but Recommended:**

```bash
WEBHOOK_SECRET=your-random-secret-string                   # For webhook security
NODE_ENV=production                                        # Enables strict validation
```

**Pre-configured Defaults (no need to set):**

```bash
GITHUB_OWNER=tmustier                    # Default repository owner
GITHUB_REPO=nutrition-tracking           # Default repository name
GITHUB_BRANCH=daily-logs                 # Default logging branch
```

### 3. Set Webhook URL

Railway will automatically provide a public domain. Once deployed:

**Option A: Auto-detect (Recommended)**
- Leave `WEBHOOK_URL` unset
- Railway sets `RAILWAY_PUBLIC_DOMAIN` automatically
- Bot will use `https://${RAILWAY_PUBLIC_DOMAIN}`

**Option B: Manual**
- Find your Railway domain: `your-app-name.railway.app`
- Set `WEBHOOK_URL=https://your-app-name.railway.app`

### 4. Deploy

```bash
railway up
```

Or connect your GitHub repository in Railway dashboard for automatic deployments.

### 5. Verify Deployment

1. **Check Logs**
   ```bash
   railway logs
   ```

   Look for:
   ```
   🔍 Validating configuration...
      NODE_ENV: production
      RAILWAY_PUBLIC_DOMAIN: your-app.railway.app
      Computed webhook URL: https://your-app.railway.app
   ✅ Configuration validation passed
   🚀 Server running on port 3000
   ```

2. **Test Health Endpoint**
   ```bash
   curl https://your-app.railway.app/
   ```

   Should return:
   ```json
   {
     "status": "ok",
     "message": "Nutrition Tracker Telegram Bot is running",
     "timestamp": "2025-11-05T..."
   }
   ```

3. **Register Webhook**

   Visit: `https://your-app.railway.app/setup`

   Should see:
   ```json
   {
     "success": true,
     "webhookUrl": "https://your-app.railway.app/webhook",
     "message": "Webhook registered successfully"
   }
   ```

4. **Test Bot**

   Send a message to your bot on Telegram:
   ```
   /start
   ```

   If working, bot will respond with a welcome message.

## Troubleshooting

### Bot Crashes on Startup

**Symptom:** Railway restarts container repeatedly (up to 10 times)

**Causes & Solutions:**

1. **Missing Environment Variables**
   ```
   ❌ Configuration Error: Missing required configuration: telegram.botToken
   ```

   **Fix:** Check Railway dashboard → Variables tab and ensure all required variables are set.

2. **HTTPS Validation Error**
   ```
   ❌ Security Error: HTTPS is required for webhook URL in production
   Current webhook URL: http://localhost:3000
   ```

   **Fix:** Set `WEBHOOK_URL=https://your-app.railway.app` or ensure `RAILWAY_PUBLIC_DOMAIN` is set.

3. **Invalid Token Format**
   ```
   Error: 401 Unauthorized
   ```

   **Fix:** Double-check your `TELEGRAM_BOT_TOKEN` from @BotFather.

### Bot Starts but Doesn't Respond

**Symptom:** Bot is running, health check passes, but doesn't respond to Telegram messages

**Causes & Solutions:**

1. **Webhook Not Registered**

   **Fix:** Visit `https://your-app.railway.app/setup` to register webhook.

2. **Webhook Secret Mismatch**

   **Fix:** If you set `WEBHOOK_SECRET`, make sure it matches what's configured in Telegram.

3. **User Not Authorized**

   If you set `ALLOWED_USERS`, only those Telegram user IDs can use the bot.

   **Fix:** Add your Telegram user ID to `ALLOWED_USERS` or remove the variable to allow all users.

### GitHub Logging Fails

**Symptom:** Bot responds but logs aren't saved to GitHub

**Causes & Solutions:**

1. **Invalid GitHub Token**

   **Fix:** Create a new Personal Access Token with `repo` scope at [github.com/settings/tokens](https://github.com/settings/tokens).

2. **Branch Doesn't Exist**

   **Fix:** Create `daily-logs` branch in your repository or change `GITHUB_BRANCH` to an existing branch.

3. **Repository Permissions**

   **Fix:** Ensure your GitHub token has write access to the repository.

## Configuration Reference

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TELEGRAM_BOT_TOKEN` | ✅ | - | Bot token from @BotFather |
| `ANTHROPIC_API_KEY` | ✅ | - | Claude API key |
| `GITHUB_TOKEN` | ✅ | - | GitHub PAT with `repo` scope |
| `WEBHOOK_URL` | ⚠️ | Auto-detect | Full webhook URL (auto-detected on Railway) |
| `WEBHOOK_SECRET` | ❌ | - | Secret for webhook verification |
| `ALLOWED_USERS` | ❌ | All users | Comma-separated Telegram user IDs |
| `NODE_ENV` | ❌ | `development` | Set to `production` for strict validation |
| `GITHUB_OWNER` | ❌ | `tmustier` | GitHub repository owner |
| `GITHUB_REPO` | ❌ | `nutrition-tracking` | GitHub repository name |
| `GITHUB_BRANCH` | ❌ | `daily-logs` | Branch for logging |
| `USDA_API_KEY` | ❌ | `DEMO_KEY` | USDA FoodData Central API key |
| `CLAUDE_MODEL` | ❌ | `claude-sonnet-4-20250514` | Claude model to use |
| `CLAUDE_MAX_TOKENS` | ❌ | `4096` | Max tokens per request |

### Railway Configuration

The bot uses `railway.json` for deployment configuration:

```json
{
  "build": {
    "builder": "RAILPACK"
  },
  "deploy": {
    "startCommand": "node server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

- **Builder:** RAILPACK (Railway's recommended builder)
- **Start Command:** `node server.js` (runs the Express server)
- **Restart Policy:** Restarts on failure, up to 10 times

## Monitoring

### Railway Logs

View real-time logs:
```bash
railway logs
```

### Health Checks

- **Basic:** `GET /` - Returns bot status
- **Webhook Info:** `GET /setup` - Shows and registers webhook
- **Webhook Endpoint:** `POST /webhook` - Receives Telegram updates

### Log Files

Nutrition logs are stored in your GitHub repository:
```
data/logs/YYYY-MM/DD.yaml
```

Example: `data/logs/2025-11/05.yaml`

## Security Best Practices

1. **Use WEBHOOK_SECRET** - Set a random string to verify webhook requests
2. **Restrict Users** - Set `ALLOWED_USERS` to limit who can use the bot
3. **Rotate Tokens** - Periodically regenerate API tokens and update Railway variables
4. **Monitor Logs** - Check Railway logs for unauthorized access attempts
5. **Use HTTPS** - Always use HTTPS webhook URLs (enforced in production)

## Support

- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **Telegram Bot API:** [core.telegram.org/bots/api](https://core.telegram.org/bots/api)
- **Issues:** Create an issue in the GitHub repository

## Migration from NIXPACKS

If you deployed before November 5, 2025, you may be using NIXPACKS. Railway now recommends RAILPACK.

**Migration Steps:**

1. Update `railway.json`:
   ```json
   {
     "build": {
       "builder": "RAILPACK"
     }
   }
   ```

2. Regenerate `package-lock.json`:
   ```bash
   rm package-lock.json
   npm install
   ```

3. Commit and push:
   ```bash
   git add railway.json package-lock.json
   git commit -m "chore: Migrate to RAILPACK builder"
   git push
   ```

4. Redeploy in Railway dashboard
