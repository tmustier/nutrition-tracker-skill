# Dual Environment Setup: Testing & Production

This guide explains how to run separate testing and production environments for the Telegram nutrition tracking bot.

## Overview

- **Testing Environment**: Local development with ngrok + test bot → commits to `daily-logs-test`
- **Production Environment**: Railway deployment + production bot → commits to `daily-logs`
- **Both can run simultaneously** without conflicts

## Prerequisites

- Node.js installed locally
- ngrok account (free tier works)
- Railway account
- Two Telegram bots from @BotFather
- GitHub Personal Access Token with repo write access
- Claude API key
- USDA API key

---

## Part 1: Testing Environment Setup (Local)

### Step 1: Create Test Telegram Bot

```bash
# In Telegram, message @BotFather
/newbot

# Follow prompts:
# Name: Your Nutrition Test Bot (or similar)
# Username: your_nutrition_test_bot (must end in 'bot')

# Save the bot token
```

### Step 2: Set Up ngrok

```bash
# Install ngrok auth token (first time only)
npx ngrok config add-authtoken YOUR_NGROK_TOKEN

# Start ngrok (keep this terminal open)
cd automation/telegram-bot
npx ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok-free.app)
```

### Step 3: Configure Local Environment

Create `automation/telegram-bot/.env`:

```bash
# Copy from example
cp .env.example .env

# Edit with your values:
# Testing Configuration
TELEGRAM_BOT_TOKEN=your_test_bot_token_here
WEBHOOK_URL=https://your-ngrok-url.ngrok-free.app
WEBHOOK_SECRET=generate_with_crypto_random_bytes
NODE_ENV=development

# API Keys (same for both environments)
ANTHROPIC_API_KEY=your_claude_api_key
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=16000
CLAUDE_EXTENDED_THINKING=true
CLAUDE_THINKING_BUDGET=10000

# GitHub Configuration
GITHUB_TOKEN=your_github_pat
GITHUB_OWNER=tmustier
GITHUB_REPO=nutrition-tracking
GITHUB_BRANCH=daily-logs-test  # Important: Use test branch

# USDA API
USDA_API_KEY=your_usda_key

# User whitelist
ALLOWED_USERS=your_user_id,another_user_id
```

### Step 4: Start Local Bot

```bash
# In automation/telegram-bot directory
npm install
npm run dev

# Register webhook
curl http://localhost:3000/setup

# Should see: {"success":true,...}
```

### Step 5: Test the Bot

1. Open Telegram and find your test bot
2. Send: `/start`
3. Send: `150g chicken breast`
4. Bot should respond with nutrition data
5. Check GitHub: Commit should appear in `daily-logs-test` branch

---

## Part 2: Production Environment Setup (Railway)

### Step 1: Prepare Production Bot

Use your existing production Telegram bot, or create a new one:

```bash
# In Telegram, message @BotFather
/newbot

# Follow prompts for production bot
# Save the bot token
```

### Step 2: Deploy to Railway

#### Option A: Via Railway Dashboard

1. Go to [railway.app](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `tmustier/nutrition-tracking`
4. Set **Root Directory**: `automation/telegram-bot`
5. Railway will auto-detect Node.js and deploy

#### Option B: Via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
cd automation/telegram-bot
railway link

# Deploy
railway up
```

### Step 3: Configure Railway Environment Variables

In Railway Dashboard → Your Service → Variables tab, add:

```bash
# Production Configuration
TELEGRAM_BOT_TOKEN=your_production_bot_token
# WEBHOOK_URL is auto-detected from RAILWAY_PUBLIC_DOMAIN
WEBHOOK_SECRET=generate_new_random_secret
NODE_ENV=production

# API Keys (same as testing)
ANTHROPIC_API_KEY=your_claude_api_key
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=16000
CLAUDE_EXTENDED_THINKING=true
CLAUDE_THINKING_BUDGET=10000

# GitHub Configuration
GITHUB_TOKEN=your_github_pat
GITHUB_OWNER=tmustier
GITHUB_REPO=nutrition-tracking
GITHUB_BRANCH=daily-logs  # Important: Use production branch

# USDA API
USDA_API_KEY=your_usda_key

# User whitelist
ALLOWED_USERS=your_user_id,another_user_id
```

### Step 4: Get Railway URL

1. Railway Dashboard → Settings → Networking
2. Click "Generate Domain"
3. Copy the URL (e.g., `https://nutrition-bot-production.up.railway.app`)

### Step 5: Register Production Webhook

```bash
# Visit the setup endpoint
curl https://your-app.railway.app/setup

# Or visit in browser:
# https://your-app.railway.app/setup

# Should see: {"success":true,...}
```

### Step 6: Test Production Bot

1. Open Telegram and find your production bot
2. Send: `/start`
3. Send: `150g chicken breast`
4. Bot should respond with nutrition data
5. Check GitHub: Commit should appear in `daily-logs` branch

---

## Part 3: Ongoing Usage

### Development Workflow

1. **Testing new features**:
   - Run local bot with ngrok
   - Test with test bot
   - Commits go to `daily-logs-test`
   - Can test freely without affecting production

2. **Production use**:
   - Railway bot always running
   - Use production bot for real food logging
   - Commits go to `daily-logs`

3. **Both run simultaneously**:
   - Different bot tokens
   - Different webhook URLs
   - Different GitHub branches
   - No conflicts!

### Switching Between Environments

#### To test locally:
```bash
cd automation/telegram-bot

# Start ngrok in one terminal
npx ngrok http 3000

# Update WEBHOOK_URL in .env with ngrok URL

# Start bot in another terminal
npm run dev

# Register webhook
curl http://localhost:3000/setup

# Use test bot in Telegram
```

#### To deploy updates to production:
```bash
# Commit and push changes
git add .
git commit -m "Your changes"
git push

# Railway auto-deploys from GitHub
# Or use: railway up
```

---

## Part 4: Monitoring and Logs

### Local Logs

```bash
# Bot logs appear in terminal where you ran `npm run dev`
# Look for:
# - "Processing food log from user..."
# - "Successfully committed log entry"
# - Any errors
```

### Railway Logs

```bash
# Via Dashboard:
# Railway Dashboard → Your Service → Deployments → View Logs

# Via CLI:
railway logs

# Look for same log patterns as local
```

### GitHub Commits

- **Testing**: Check `daily-logs-test` branch
- **Production**: Check `daily-logs` branch

---

## Part 5: Troubleshooting

### Bot Not Responding (Local)

```bash
# Check if ngrok is running
# Check if local server is running (npm run dev)
# Check logs for errors
# Re-register webhook: curl http://localhost:3000/setup
```

### Bot Not Responding (Production)

```bash
# Check Railway deployment status
railway status

# Check Railway logs for errors
railway logs

# Re-register webhook: curl https://your-app.railway.app/setup
```

### Wrong Branch Commits

- **Check `.env` locally**: Should have `GITHUB_BRANCH=daily-logs-test`
- **Check Railway vars**: Should have `GITHUB_BRANCH=daily-logs`

### Timeout Errors with Extended Thinking

- Extended thinking can take up to 120 seconds
- Ensure Railway doesn't have a shorter timeout configured
- Check Railway logs for timeout errors

### Webhook Conflicts

If only one bot works at a time:
- **Problem**: Using same bot token for both environments
- **Solution**: Create separate test bot with @BotFather

---

## Part 6: Cost Estimates

### Testing Environment (Local)
- Ngrok: Free tier (1 connection)
- Local compute: Free
- API calls: ~$0.10-0.50/day if testing actively

### Production Environment (Railway)
- Railway: $5 credit/month (covers bot hosting)
- Claude API: ~$1-2/month for regular logging
- GitHub Actions: Free (within limits)
- Total: **~$1-2/month** (if under Railway free credit)

---

## Part 7: Security Best Practices

1. **Never commit `.env` files**
   - Already in `.gitignore`
   - Rotate keys if accidentally exposed

2. **Use WEBHOOK_SECRET**
   - Prevents unauthorized webhook requests
   - Generate unique secret for each environment

3. **Restrict ALLOWED_USERS**
   - Only allow trusted Telegram user IDs
   - Check logs for unauthorized access attempts

4. **Rotate GitHub PAT**
   - Use fine-grained tokens with minimal permissions
   - Set expiration dates
   - Rotate every 90 days

---

## Quick Reference

| Aspect | Testing | Production |
|--------|---------|------------|
| Bot Token | Test bot from @BotFather | Production bot |
| Webhook URL | ngrok URL | Railway auto-detect |
| GitHub Branch | `daily-logs-test` | `daily-logs` |
| Location | Local + ngrok | Railway |
| NODE_ENV | `development` | `production` |
| Can run together? | ✅ Yes | ✅ Yes |

---

## Support

For issues or questions:
- Check Railway logs: `railway logs`
- Check GitHub Actions for automation issues
- Review Telegram bot logs in terminal/Railway
- Verify all environment variables are set correctly
