# Telegram Bot Implementation - Next Steps

## ✅ COMPLETED WORK

### Phase 1: Foundation (100% Complete)
- ✅ daily-logs branch created and pushed to GitHub
- ✅ USDA Python client already implemented
- ✅ Daily automation workflow already production-ready
- ✅ Comprehensive documentation structure in place

### Phase 2: Telegram Bot (100% Code Complete)
All core implementation has been completed and committed:

#### Core Modules (6 modules)
- ✅ `src/config.js` - Configuration management with embedded skill context (293 lines)
- ✅ `src/usda-api.js` - USDA FoodData Central integration (218 lines)
- ✅ `src/claude-integration.js` - Claude API with Vision support (463 lines)
- ✅ `src/github-integration.js` - GitHub commits to daily-logs branch (467 lines)
- ✅ `src/webhook.js` - Telegraf bot with all handlers (517 lines)
- ✅ `server.js` - Express server for Railway/Vercel (419 lines)

#### Configuration Files
- ✅ `package.json` - Dependencies (telegraf, axios, js-yaml, express, dotenv)
- ✅ `.env.example` - Environment variable template
- ✅ `.gitignore` - Excludes .env and node_modules
- ✅ `railway.json` - Railway deployment config
- ✅ `vercel.json` - Vercel deployment config (alternative)

#### Testing & Verification
- ✅ `test/test-github-integration.js` - Integration tests
- ✅ `test/verify-module.js` - Module validation
- ✅ `verify-setup.js` - Setup verification script

#### Documentation
- ✅ `README.md` - Complete setup and usage guide (1,043 lines)
- ✅ `DEPLOYMENT_GUIDE.md` - Step-by-step deployment
- ✅ `SERVER_README.md` - Server API documentation
- ✅ `IMPLEMENTATION_SUMMARY.md` - Technical details
- ✅ `GITHUB-INTEGRATION-QUICKSTART.md` - Quick reference
- ✅ `src/CLAUDE_INTEGRATION_README.md` - Claude API docs
- ✅ `src/CONFIG_USAGE.md` - Configuration guide
- ✅ `src/QUICK_START.md` - Quick start reference
- ✅ `src/github-integration.README.md` - GitHub API reference

**Total**: 25 files, 7,825 lines of code and documentation

**Commit**: `cb3716a` - "feat: Implement complete Telegram bot for nutrition tracking"

---

## 🚀 DEPLOYMENT STEPS (Required Before Bot Works)

The code is complete but needs configuration and deployment. Follow these steps:

### Step 1: Obtain API Keys (30 minutes)

#### 1.1 Create Telegram Bot
```bash
# In Telegram app, message @BotFather
/newbot
# Follow prompts:
# - Name: Thomas Nutrition Tracker (or your choice)
# - Username: thomas_nutrition_bot (must end in 'bot')
# Save the bot token (format: 123456789:ABCdef...)
```

**Set commands** (optional):
```
/setcommands
start - Start the bot
help - Show help message
today - Get today's nutrition summary
week - Get this week's summary
cancel - Cancel current operation
```

#### 1.2 Get Claude API Key
```bash
# Visit https://console.anthropic.com/
# Create account or log in
# Navigate to API Keys section
# Create new API key
# Save securely (starts with sk-ant-...)
```

#### 1.3 Create GitHub Personal Access Token
```bash
# Visit https://github.com/settings/tokens?type=beta
# Click "Generate new token (fine-grained)"
# Repository access: tmustier/nutrition-tracking
# Permissions: Contents (Read and write)
# Expiration: 90 days (recommended)
# Generate and save token (starts with github_pat_...)
```

#### 1.4 Get USDA API Key
```bash
# Visit https://fdc.nal.usda.gov/api-key-signup.html
# Fill out form with email
# Receive API key via email (instant)
# Save key
```

### Step 2: Local Testing (Optional, 30 minutes)

#### 2.1 Install Dependencies
```bash
cd automation/telegram-bot
npm install
```

#### 2.2 Create .env File
```bash
cp .env.example .env
# Edit .env with your API keys:
nano .env
```

```env
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
WEBHOOK_URL=https://YOUR-NGROK-URL.ngrok-free.app
ANTHROPIC_API_KEY=YOUR_CLAUDE_KEY_HERE
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=4096
GITHUB_TOKEN=YOUR_GITHUB_TOKEN_HERE
GITHUB_OWNER=tmustier
GITHUB_REPO=nutrition-tracking
GITHUB_BRANCH=daily-logs
USDA_API_KEY=YOUR_USDA_KEY_HERE
```

#### 2.3 Test Locally with ngrok
```bash
# Terminal 1: Start ngrok
npx ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok-free.app)
# Update WEBHOOK_URL in .env

# Terminal 2: Start bot
npm run dev

# Terminal 3: Register webhook
curl http://localhost:3000/setup

# Test in Telegram:
# Message your bot: "200g chicken breast"
```

### Step 3: Deploy to Railway (Recommended, 20 minutes)

#### 3.1 Create Railway Account
```bash
# Visit https://railway.app/
# Sign up with GitHub
# Free tier: $5 credit/month
```

#### 3.2 Deploy via GitHub
```bash
# In Railway dashboard:
# 1. Click "New Project"
# 2. Select "Deploy from GitHub repo"
# 3. Connect GitHub account
# 4. Select: tmustier/nutrition-tracking
# 5. Set Root Directory: automation/telegram-bot
# 6. Deploy
```

#### 3.3 Configure Environment Variables
```bash
# In Railway dashboard:
# 1. Click on your service
# 2. Go to "Variables" tab
# 3. Add all variables from .env.example:

TELEGRAM_BOT_TOKEN=your_bot_token
ANTHROPIC_API_KEY=your_claude_key
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=4096
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=tmustier
GITHUB_REPO=nutrition-tracking
GITHUB_BRANCH=daily-logs
USDA_API_KEY=your_usda_key

# WEBHOOK_URL auto-detected from RAILWAY_PUBLIC_DOMAIN
# or set manually: WEBHOOK_URL=https://your-app.railway.app
```

#### 3.4 Get Deployment URL
```bash
# In Railway dashboard:
# 1. Go to "Settings" tab
# 2. Under "Networking", click "Generate Domain"
# 3. Copy URL (e.g., https://nutrition-bot-production.up.railway.app)
```

#### 3.5 Register Webhook
```bash
# Visit: https://YOUR-APP.railway.app/setup
# Or curl:
curl https://YOUR-APP.railway.app/setup

# Expected response:
# {
#   "success": true,
#   "webhook_url": "https://YOUR-APP.railway.app/webhook",
#   "webhook_info": {...}
# }
```

#### 3.6 Verify Deployment
```bash
# Health check:
curl https://YOUR-APP.railway.app/

# Expected response:
# {"status": "ok", "message": "Bot is running"}

# Check Railway logs:
# Dashboard → Deployments → View Logs
# Should see: "Server running on port..."
```

### Step 4: Test End-to-End (15 minutes)

#### 4.1 Test Text Logging
```
In Telegram, message your bot:

You: /start
Bot: Welcome message with instructions

You: 200g grilled chicken breast
Bot: ✅ Logged successfully!
     📊 Nutrition Breakdown:
     - Calories: 330 kcal
     - Protein: 62.0g
     ...
```

#### 4.2 Test Screenshot Upload
```
1. Take photo of nutrition facts label
2. Send to bot
3. Bot analyzes with Claude Vision
4. Bot logs to GitHub
5. Bot responds with breakdown
```

#### 4.3 Test Daily Summary
```
You: /today
Bot: 📊 Today's Nutrition Summary
     Total logged: 3 entries
     ...
```

#### 4.4 Verify GitHub Commits
```bash
# Check daily-logs branch:
git fetch origin
git checkout daily-logs
git log --oneline -n 5

# Should see commits like:
# chore: Log food entry - Grilled Chicken Breast
```

#### 4.5 Monitor Automation
```bash
# Wait until 4am UTC or trigger manually:
# Go to: https://github.com/tmustier/nutrition-tracking/actions
# Select: "Daily Food Log Commit and PR"
# Click: "Run workflow"
# Branch: daily-logs

# Verify:
# 1. PR created from daily-logs → main
# 2. Validation passes
# 3. Auto-merge occurs
# 4. Changes appear in main branch
```

---

## 📊 SUCCESS CRITERIA

Phase 2 complete when:
- ✅ All code implemented and committed (DONE)
- ✅ All API keys obtained
- ✅ Bot deployed to Railway
- ✅ Webhook registered with Telegram
- ✅ Text logging works (USDA + Claude)
- ✅ Image processing works (Claude Vision)
- ✅ GitHub commits successful
- ✅ Daily summaries accurate
- ✅ Daily automation creates PRs
- ✅ Auto-merge completes successfully
- ✅ Cost within budget (~$1.50/month)

---

## 🎯 ESTIMATED TIME TO DEPLOYMENT

**If you have all API keys ready**: 30-45 minutes
- Railway setup: 10 min
- Environment variables: 5 min
- Webhook registration: 2 min
- Testing: 15-20 min

**If you need to obtain API keys first**: 60-90 minutes
- API keys: 30 min
- Railway setup: 10 min
- Environment variables: 5 min
- Testing: 20-30 min

---

## 💰 MONTHLY COST ESTIMATE

**Free Services** ($0/month):
- Telegram Bot API: Free
- USDA FoodData Central: Free
- GitHub Actions: Free (within 2,000 min/month)
- Railway: Free ($5 credit/month covers bot hosting)

**Paid Services**:
- Claude API: ~$1.00-1.50/month
  - 300 text logs/month: ~$0.94
  - 50 screenshots/month: ~$0.45
  - Can optimize to $0.50-1.00 with prompt caching

**Total**: **~$1.50/month**

With cost optimization (caching, Haiku for simple queries): **~$0.75/month**

---

## 🐛 TROUBLESHOOTING

### Bot not responding
```bash
# Check Railway logs:
railway logs --tail

# Common issues:
# 1. Webhook not registered → Visit /setup endpoint
# 2. Wrong bot token → Check environment variables
# 3. Bot not started → Check Railway deployment status
```

### USDA lookups failing
```bash
# Test API key:
curl "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=YOUR_KEY&query=chicken"

# If 401: API key invalid
# If 403: Rate limit exceeded (unlikely)
# If 500: USDA service down (rare)
```

### GitHub commits failing
```bash
# Test token permissions:
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/tmustier/nutrition-tracking

# Should return repo details, not 401/403

# Verify daily-logs branch exists:
git fetch origin
git branch -a | grep daily-logs
```

### Claude API errors
```bash
# Check API key:
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":100,"messages":[{"role":"user","content":"Hi"}]}'

# Should return valid response, not 401
```

---

## 📚 DOCUMENTATION LOCATIONS

All documentation is in `automation/telegram-bot/`:

- **README.md** - Complete setup and usage guide
- **DEPLOYMENT_GUIDE.md** - Step-by-step deployment
- **NEXT_STEPS.md** - This file
- **src/QUICK_START.md** - Quick reference for development
- **src/CLAUDE_INTEGRATION_README.md** - Claude API details
- **src/CONFIG_USAGE.md** - Configuration guide
- **src/github-integration.README.md** - GitHub API reference
- **SERVER_README.md** - Server endpoints documentation

---

## 🔄 PHASE 3 (Future Enhancements)

Not required for basic functionality, but documented in `automation/06-phase3-enhancements.md`:

- iMessage integration (alternative to Telegram)
- Firecrawl MCP for web scraping
- Conversation history/context
- Inline keyboards
- Voice input support

---

## 📞 GETTING HELP

If you encounter issues:

1. Check troubleshooting section in README.md
2. Review Railway logs for errors
3. Test each API independently
4. Verify all environment variables are set
5. Check GitHub Actions logs for automation issues

For documentation bugs or improvements:
- Open issue at: https://github.com/tmustier/nutrition-tracking/issues

---

**Implementation Status**: ✅ **CODE COMPLETE - READY FOR DEPLOYMENT**

**Next Action**: Obtain API keys and deploy to Railway (see Step 1 above)
