[← Phase 2 Code](04-phase2-telegram-code.md) | [↑ Table of Contents](README.md) | [Next: Phase 3 Enhancements →](06-phase3-enhancements.md)

---

### 2.3 Deploy to Railway (or Vercel)

#### 2.3.1 Prepare for Deployment

**Create deployment configuration**:

**File**: `railway.json` (Railway-specific config)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**File**: `vercel.json` (Vercel-specific config)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

**Time**: 5 minutes

#### 2.3.2 Deploy to Railway

**Steps**:

1. **Create Railway account**: https://railway.app/
2. **Install Railway CLI** (optional):
   ```bash
   npm install -g @railway/cli
   railway login
   ```
3. **Create new project**:
   - Via web: Click "New Project" → "Deploy from GitHub repo"
   - Via CLI: `railway init` (in telegram-bot directory)
4. **Connect GitHub repository**:
   - Authorize Railway to access your repo
   - Select `nutrition-tracker-skill` repository
   - Set root directory to `/automation/telegram-bot`
5. **Configure environment variables**:
   - In Railway dashboard: Project → Variables
   - Add all variables from `.env.example`:
     - `TELEGRAM_BOT_TOKEN`
     - `ANTHROPIC_API_KEY`
     - `GITHUB_TOKEN`
     - `USDA_API_KEY`
     - `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`
     - `WEBHOOK_URL` (will be: `https://your-app.railway.app`)
6. **Deploy**:
   - Railway auto-deploys on push to main
   - Or manually: Click "Deploy" in dashboard
7. **Get deployment URL**:
   - Railway assigns a URL like: `https://your-app.railway.app`
   - Copy this URL
   - Update `WEBHOOK_URL` environment variable with this URL
   - Redeploy
8. **Set up webhook**:
   - Visit: `https://your-app.railway.app/setup`
   - Should see: `{"message":"Webhook set","url":"https://your-app.railway.app/webhook"}`

**Success Criteria**:
- ✅ Railway project created and deployed
- ✅ All environment variables set
- ✅ Webhook successfully registered with Telegram
- ✅ Health check endpoint returns 200 OK

**Time**: 20 minutes

#### 2.3.3 Alternative: Deploy to Vercel

**Steps** (if using Vercel instead of Railway):

1. **Create Vercel account**: https://vercel.com/
2. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   vercel login
   ```
3. **Deploy**:
   ```bash
   cd /home/user/nutrition-tracker-skill/automation/telegram-bot
   vercel
   ```
4. **Follow prompts**:
   - Link to existing project or create new
   - Set project name
   - Confirm settings
5. **Set environment variables**:
   ```bash
   vercel env add TELEGRAM_BOT_TOKEN
   vercel env add ANTHROPIC_API_KEY
   vercel env add GITHUB_TOKEN
   vercel env add USDA_API_KEY
   # ... (add all variables)
   ```
6. **Redeploy with env vars**:
   ```bash
   vercel --prod
   ```
7. **Get URL and set webhook**:
   - Vercel provides URL like: `https://your-app.vercel.app`
   - Visit: `https://your-app.vercel.app/setup`

**Note**: Vercel has a 10-second timeout for serverless functions, which may be too short for Claude API calls. Railway is recommended for this reason.

**Time**: 15 minutes

---

### 2.4 Test End-to-End

#### 2.4.1 Test Basic Food Logging

**Test Case 1: Generic Food (USDA Lookup)**

1. Open Telegram
2. Find your bot (@your_bot_username)
3. Send message: "200g grilled chicken breast"
4. Expected:
   - Bot replies with "🔍 Processing..."
   - Updates to "💾 Logging to database..."
   - Final message shows:
     - Logged food name
     - Nutrition breakdown (kcal, protein, fat, carbs)
     - Today's totals
     - Remaining targets
5. Verify in GitHub:
   - Go to `daily-logs` branch
   - Check `data/logs/YYYY-MM/DD.yaml`
   - Should see new entry with timestamp and nutrition data

**Test Case 2: Restaurant Dish (Claude Estimation)**

1. Send message: "Salmon poke bowl from L'ETO"
2. Expected:
   - Bot processes with Claude (might take 3-5 seconds)
   - Returns estimated nutrition
   - Logs to GitHub
3. Verify:
   - Check log file has entry
   - Note might be lower confidence than USDA data

**Test Case 3: Screenshot Upload**

1. Take screenshot of a menu with nutrition info (or use test image)
2. Send photo to bot
3. Expected:
   - Bot replies "📸 Processing screenshot..."
   - Claude Vision extracts nutrition data
   - Logs to GitHub
   - Confirms with summary
4. Verify:
   - Check log file has entry
   - Nutrition data matches screenshot

**Success Criteria**:
- ✅ All three test cases return valid responses
- ✅ Log files are created/updated in GitHub
- ✅ Commits appear on daily-logs branch
- ✅ Today's totals calculate correctly

**Time**: 20 minutes

#### 2.4.2 Test Daily Summary

1. Send command: `/today`
2. Expected:
   - Bot returns summary with:
     - Number of entries
     - Total kcal, protein, fat, carbs
     - Comparison to targets
     - Remaining amounts
3. Verify numbers match log file calculations

**Time**: 5 minutes

#### 2.4.3 Test Error Handling

1. Send gibberish: "asdfghjkl"
   - Expected: Polite error message asking for clarification
2. Send very complex query: "Mixed tapas plate with 5 items"
   - Expected: Best-effort estimation with disclaimer about accuracy
3. Send image with no visible nutrition info
   - Expected: Error message asking for clearer image

**Time**: 10 minutes

---

### 2.5 Create Documentation

**File**: `automation/telegram-bot/README.md`

```markdown
# Nutrition Tracker Telegram Bot

Text-based interface for logging food to the nutrition tracker via Telegram.

## Features

- 🔍 Automatic nutrition lookup via USDA database (600k+ foods)
- 🤖 Claude AI for estimating restaurant dishes
- 📸 Screenshot processing with Claude Vision
- 💾 Automatic commits to GitHub
- 📊 Daily nutrition summaries
- ⚡ Fast and free (only pays for Claude API usage)

## Architecture

- **Bot Framework**: Telegraf (Node.js)
- **AI Processing**: Anthropic Claude API
- **Data Source**: USDA FoodData Central API
- **Storage**: GitHub (data/logs)
- **Hosting**: Railway (free tier)

## Usage

### Logging Food

Simply text the bot what you ate:

- "200g grilled chicken breast"
- "2 poached eggs with sourdough"
- "Salmon poke bowl from L'ETO"

Or send a screenshot of a menu/nutrition label.

### Commands

- `/start` - Start the bot
- `/help` - Show help message
- `/today` - Get today's nutrition summary
- `/week` - Get this week's summary (coming soon)

## Setup

See `/automation/todo.md` for complete setup instructions.

## Development

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Run locally
npm run dev

# Deploy to Railway
railway up
```

## Cost

- Telegram: FREE
- USDA API: FREE
- Claude API: ~$1.50/month (300 logs)
- Railway hosting: FREE (within free tier limits)

**Total: ~$1.50/month**

## Troubleshooting

### Bot not responding
1. Check Railway logs: `railway logs`
2. Verify webhook is set: Visit `https://your-app.railway.app/setup`
3. Check environment variables are set correctly

### USDA lookups failing
1. Verify API key is valid
2. Check USDA API status: https://fdc.nal.usda.gov/
3. Try direct API call to test: `curl "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=YOUR_KEY&query=chicken"`

### GitHub commits failing
1. Verify GitHub token has `repo` scope
2. Check branch exists: `daily-logs`
3. Verify repository name and owner in config

### Claude API errors
1. Check API key is valid
2. Verify sufficient credits in Anthropic account
3. Check model name is correct: `claude-sonnet-4-20250514`

## Support

For issues, check:
- Railway logs
- GitHub Actions logs
- Telegram bot API status: https://core.telegram.org/bots/api

For questions about implementation, see `/automation/todo.md`.
```

**Time**: 15 minutes

---

---

## Navigation

- [← Previous: Phase 2 Code](04-phase2-telegram-code.md)
- [↑ Table of Contents](README.md)
- [Next: Phase 3 Enhancements →](06-phase3-enhancements.md) (Optional)
- [Operations & Maintenance →](07-operations.md)

**Related Sections**:
- [Source Code Files](04-phase2-telegram-code.md)
- [Troubleshooting Guide](07-operations.md#troubleshooting-guide)
- [Cost Monitoring](07-operations.md#cost-monitoring)
