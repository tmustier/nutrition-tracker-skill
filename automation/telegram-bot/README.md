# Nutrition Tracker Telegram Bot

A comprehensive Telegram bot for tracking nutrition via mobile, powered by Claude AI and integrated with GitHub for persistent data storage. Log meals via text, images, or nutrition labels and get instant feedback with automatic calculation of 24+ nutrition fields.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Usage Guide](#usage-guide)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Cost Breakdown](#cost-breakdown)
- [Troubleshooting](#troubleshooting)
- [API Integration Details](#api-integration-details)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Functionality
- **Text-based food logging**: "I just ate 200g grilled chicken breast"
- **Image recognition**: Upload photos of nutrition labels or meals
- **Smart nutrition estimation**: AI-powered with USDA FoodData Central fallback
- **24 nutrition fields**: Complete macro and micronutrient tracking
- **Daily summaries**: View progress against personalized targets
- **GitHub integration**: All logs automatically committed and versioned
- **Real-time validation**: Energy calculated via Atwater formula

### Advanced Features
- Automatic portion scaling based on user input
- Support for branded foods and restaurant dishes
- No-null policy: All nutrition fields estimated with confidence
- Timezone-aware timestamps (Europe/London)
- Daily automated PRs and merges (4am UTC)
- User whitelist support for private deployment

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User (Telegram)                          │
│                    Text / Image Messages                        │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Telegram Bot API                            │
│                  (Webhooks via Railway/Vercel)                  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Bot Application Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │   config.js  │  │  webhook.js  │  │  Telegraf Engine   │    │
│  │  (Settings)  │  │  (Handler)   │  │  (Bot Framework)   │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
└────────────────┬────────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐   ┌─────────────────────┐
│  USDA API    │   │   Claude AI API     │
│  (Generic    │   │  (Complex foods &   │
│   foods)     │   │   image analysis)   │
└──────┬───────┘   └──────────┬──────────┘
       │                      │
       └──────────┬───────────┘
                  ▼
         ┌────────────────────┐
         │  Nutrition Data    │
         │  (24 fields/JSON)  │
         └─────────┬──────────┘
                   │
                   ▼
         ┌────────────────────┐
         │   GitHub API       │
         │  (Contents API)    │
         │  Branch: daily-logs│
         └─────────┬──────────┘
                   │
                   ▼
         ┌────────────────────┐
         │  data/logs/        │
         │  YYYY-MM/DD.yaml   │
         └────────────────────┘
```

### Data Flow

1. **User Input**: User sends message or image via Telegram
2. **Processing**:
   - Text → USDA API (if generic food) → Claude API (if needed)
   - Image → Claude Vision API
3. **Validation**: 24 nutrition fields validated, energy checked via Atwater formula
4. **Storage**: Entry logged to GitHub in YAML format
5. **Feedback**: User receives confirmation with nutrition summary

---

## Prerequisites

### Required Accounts & Services

1. **Telegram Bot**
   - Telegram account
   - BotFather access

2. **API Keys**
   - Anthropic API key (Claude AI)
   - GitHub Personal Access Token
   - USDA FoodData Central API key (optional, DEMO_KEY available)

3. **Development Environment**
   - Node.js >= 18.0.0
   - npm or yarn
   - Git

4. **Deployment Platform** (Choose one)
   - Railway account (recommended)
   - Vercel account (alternative)

---

## Setup Instructions

### Step 1: Create Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow the prompts
3. Choose a name (e.g., "Thomas Nutrition Tracker")
4. Choose a username (e.g., "thomas_nutrition_bot")
5. Copy the bot token (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

**Optional: Set bot commands**
```
/start - Start the bot and get welcome message
/help - Show usage instructions
/today - View today's nutrition summary
/week - View weekly nutrition summary
```

### Step 2: Obtain API Keys

#### Anthropic Claude API
1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to API Keys
4. Generate a new key
5. Copy the key (format: `sk-ant-...`)

**Model used**: `claude-sonnet-4-20250514`
**Cost**: ~$3 per 1M input tokens, ~$15 per 1M output tokens

#### GitHub Personal Access Token
1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Name: "Nutrition Tracker Bot"
4. Scopes: Check `repo` (Full control of private repositories)
5. Generate and copy the token (format: `ghp_...`)

#### USDA FoodData Central API (Optional)
1. Visit [fdc.nal.usda.gov/api-key-signup.html](https://fdc.nal.usda.gov/api-key-signup.html)
2. Fill out the registration form
3. Check your email for the API key
4. Or use `DEMO_KEY` (rate-limited to 1000 requests/hour)

### Step 3: Clone and Install

```bash
# Navigate to the project directory
cd /path/to/nutrition-tracking/automation/telegram-bot

# Install dependencies
npm install

# Verify installation
node -c src/config.js
```

**Dependencies installed:**
- `telegraf` (^4.12.2) - Telegram Bot framework
- `axios` (^1.6.0) - HTTP client
- `dotenv` (^16.0.3) - Environment variables
- `js-yaml` (^4.1.0) - YAML parsing

### Step 4: Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Telegram Configuration
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
WEBHOOK_URL=https://your-app.railway.app

# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-your-key-here
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=4096

# GitHub Configuration
GITHUB_TOKEN=ghp_your-token-here
GITHUB_OWNER=tmustier
GITHUB_REPO=nutrition-tracking
GITHUB_BRANCH=daily-logs

# USDA FoodData Central API
USDA_API_KEY=DEMO_KEY

# Optional: User Whitelist (comma-separated Telegram user IDs)
# ALLOWED_USERS=123456789,987654321
```

**Getting your Telegram User ID:**
1. Message [@userinfobot](https://t.me/userinfobot)
2. Copy your user ID
3. Add to `ALLOWED_USERS` for private bot access

### Step 5: Test Locally

```bash
# Start development server
npm run dev

# In another terminal, test the module
node -e "
  const ci = require('./src/claude-integration');
  console.log('Targets:', ci.getTargets('rest'));
"

# Test GitHub integration (requires valid token)
node test/test-github-integration.js
```

---

## Usage Guide

### Starting the Bot

1. Open Telegram
2. Search for your bot by username (e.g., @thomas_nutrition_bot)
3. Click "Start" or send `/start`

### Logging Food (Text)

Simply describe what you ate:

**Examples:**
```
200g grilled chicken breast
→ Logged: Chicken, breast, grilled
   330 kcal, 62.0g protein, 7.3g fat

Salmon poke bowl from Itsu
→ Logged: Salmon poke bowl (Itsu)
   520 kcal, 38.0g protein, 22.0g fat

2 poached eggs with sourdough toast
→ Logged: Poached eggs with sourdough toast
   350 kcal, 18.0g protein, 12.0g fat
```

**Tips:**
- Include quantities (200g, 1 portion, 2 slices)
- Mention cooking methods (grilled, fried, boiled)
- Include brand/venue names (Pret, Tesco, Itsu)
- Be specific (chicken breast, not just chicken)

### Logging Food (Screenshots)

Take a photo of a nutrition label or upload an existing image:

1. Take photo in Telegram or select from gallery
2. Send to the bot
3. Bot will analyze and extract all nutrition data
4. Receives confirmation with detected values

**Supported formats:**
- Nutrition labels (UK, EU, US)
- Restaurant menus with nutrition info
- Meal photos (AI estimates nutrition)

### Bot Commands

#### `/start`
Initializes the bot and shows welcome message with usage instructions.

#### `/help`
Displays detailed help including:
- How to log food
- Example messages
- Supported formats
- Available commands

#### `/today`
Shows today's nutrition summary:
```
📊 Today's Summary (2025-11-04)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Energy: 1,847 / 2,500 kcal (74%)
Protein: 142.3 / 170g (84%)
Fat: 58.2 / 70g (83%)
Carbs: 185.4 / 250g (74%)
Fiber: 28.5 / 40g (71%)

📝 3 meals logged, 7 items total
🎯 Remaining: 653 kcal, 27.7g protein
```

#### `/week`
Shows 7-day nutrition summary with daily breakdowns and weekly averages.

### Understanding Responses

When you log food, you'll receive:

1. **Confirmation**: "Logged: {food name}"
2. **Source indicator**:
   - (USDA) = Data from USDA FoodData Central
   - (Claude) = AI-estimated by Claude
3. **Key nutrition**: Calories, protein, fat
4. **Daily progress**: Current totals vs targets

**Example response:**
```
✅ Logged: Grilled Chicken Breast (USDA)

📊 330 kcal | 62.0g protein | 7.3g fat

Today: 1,450 / 2,500 kcal (58%)
       125 / 170g protein (74%)
```

---

## Development Guide

### Project Structure

```
telegram-bot/
├── src/
│   ├── claude-integration.js      # Claude AI integration (463 lines)
│   ├── usda-api.js                # USDA FoodData API (218 lines)
│   ├── github-integration.js      # GitHub logging (463 lines)
│   ├── config.js                  # Configuration management (293 lines)
│   ├── CLAUDE_INTEGRATION_README.md
│   ├── github-integration.README.md
│   └── QUICK_START.md
├── test/
│   ├── test-github-integration.js # Integration tests
│   └── verify-module.js           # Module verification
├── .env.example                   # Environment template
├── .gitignore
├── package.json
├── railway.json                   # Railway deployment config
├── vercel.json                    # Vercel deployment config
└── README.md                      # This file
```

### Code Structure Explanation

#### `config.js` - Configuration Management
- Loads environment variables via dotenv
- Validates required configuration
- Exports config object with typed values
- Embeds SKILL.md context for Claude
- Contains user profile and health targets

#### `claude-integration.js` - AI Processing
- `processFoodLog(message, userId)`: Process text input
- `processImage(buffer, mimeType)`: Analyze images
- `getDailySummary(date)`: Generate daily reports
- `getTargets(dayType)`: Get rest/training targets

**Key features:**
- USDA-first strategy for generic foods
- Claude API fallback for complex/branded items
- Energy validation via Atwater formula
- 24-field nutrition structure enforcement

#### `usda-api.js` - USDA Integration
- `searchFood(query)`: Search USDA database
- `getFoodDetails(fdcId)`: Get detailed nutrition
- Nutrient mapping to 24-field structure
- Portion scaling and unit conversion

#### `github-integration.js` - Data Persistence
- `appendLogEntry(data, timestamp)`: Log to GitHub
- `getTodaysTotals(date)`: Aggregate daily nutrition
- `getCurrentDate()`: UTC date formatting
- `getLogFilePath(date)`: Path generation

**Log structure:**
```yaml
date: 2025-11-04
day_type: rest
entries:
  - timestamp: "2025-11-04T12:30:00Z"
    items:
      - name: "Grilled Chicken Breast"
        food_bank_id: null
        quantity: 200
        unit: "g"
        nutrition:
          energy_kcal: 330
          # ... all 24 fields
```

### Local Testing with ngrok

For local development with webhook testing:

1. **Install ngrok**
   ```bash
   brew install ngrok  # macOS
   # or download from ngrok.com
   ```

2. **Start local server**
   ```bash
   npm run dev
   # Server runs on http://localhost:3000
   ```

3. **Create tunnel**
   ```bash
   ngrok http 3000
   # Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
   ```

4. **Update webhook URL**
   ```bash
   # Add to .env
   WEBHOOK_URL=https://abc123.ngrok.io
   ```

5. **Test with Telegram**
   - Send messages to your bot
   - View logs in terminal
   - Inspect ngrok web interface at http://localhost:4040

### Running Tests

```bash
# Basic module tests (no API calls)
node test/test-github-integration.js

# Module structure verification
node test/verify-module.js

# Syntax check
node -c src/claude-integration.js
node -c src/github-integration.js
node -c src/config.js

# Manual integration test (requires API keys)
node -e "
  const ci = require('./src/claude-integration');
  ci.processFoodLog('100g oats', 'test')
    .then(r => console.log(JSON.stringify(r, null, 2)))
    .catch(e => console.error(e.message));
"
```

### Adding Features

**Example: Add weekly summary command**

1. Create handler in webhook file:
```javascript
bot.command('week', async (ctx) => {
  const summary = await getWeeklySummary();
  await ctx.reply(formatWeeklySummary(summary));
});
```

2. Implement logic in `github-integration.js`:
```javascript
async getWeeklySummary() {
  const dates = getLast7Days();
  const totals = await Promise.all(
    dates.map(date => this.getTodaysTotals(date))
  );
  return aggregateWeekly(totals);
}
```

3. Test locally with ngrok
4. Deploy to production

---

## Deployment

### Option 1: Railway (Recommended)

Railway provides easy Node.js hosting with automatic HTTPS and webhooks.

#### Initial Setup

1. **Create Railway account**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `nutrition-tracking` repo

3. **Configure build**
   ```json
   // railway.json already configured:
   {
     "build": { "builder": "NIXPACKS" },
     "deploy": {
       "startCommand": "node server.js",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

4. **Set environment variables**
   - Go to project settings
   - Add all variables from `.env`:
     - `TELEGRAM_BOT_TOKEN`
     - `ANTHROPIC_API_KEY`
     - `GITHUB_TOKEN`
     - `GITHUB_OWNER`
     - `GITHUB_REPO`
     - `GITHUB_BRANCH`
     - `USDA_API_KEY`
     - `ALLOWED_USERS` (optional)

5. **Deploy**
   - Railway auto-deploys on git push
   - Copy the public URL (e.g., `https://nutrition-bot.railway.app`)

6. **Set webhook URL**
   ```bash
   # Update in Railway environment variables
   WEBHOOK_URL=https://your-app.railway.app
   ```

7. **Redeploy** to apply webhook URL

#### Ongoing Deployment

```bash
# Make changes locally
git add .
git commit -m "feat: Add weekly summary"
git push

# Railway automatically:
# 1. Detects push
# 2. Builds new image
# 3. Deploys without downtime
# 4. Restarts service
```

**Railway Features:**
- Automatic HTTPS
- Environment variable management
- Zero-downtime deployments
- Build/deploy logs
- Metrics and monitoring
- $5/month free credit

### Option 2: Vercel

Vercel is optimized for serverless functions.

#### Setup Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd /path/to/telegram-bot
   vercel
   ```

4. **Configure environment variables**
   ```bash
   vercel env add TELEGRAM_BOT_TOKEN
   vercel env add ANTHROPIC_API_KEY
   vercel env add GITHUB_TOKEN
   # ... add all variables
   ```

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

**Configuration** (`vercel.json`):
```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/server.js" }
  ]
}
```

**Vercel Features:**
- Serverless architecture
- Edge network (fast worldwide)
- Free tier available
- Git integration
- Preview deployments

**Note**: Vercel has 10-second execution limit on free tier. Consider Railway for long-running processes.

### Webhook Configuration

After deployment, configure the Telegram webhook:

```bash
# Get your deployment URL
WEBHOOK_URL="https://your-app.railway.app"

# Set webhook
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${WEBHOOK_URL}/webhook\"}"

# Verify webhook
curl "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo"
```

**Expected response:**
```json
{
  "ok": true,
  "result": {
    "url": "https://your-app.railway.app/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "max_connections": 40
  }
}
```

### Monitoring

**Railway:**
- View logs: Project → Deployments → Logs
- Metrics: Project → Metrics
- Alerts: Project → Settings → Notifications

**Vercel:**
- Functions: Project → Functions
- Logs: Project → Logs
- Analytics: Project → Analytics

---

## Cost Breakdown

### API Costs

#### Anthropic Claude API
- **Model**: Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- **Input**: $3 per 1M tokens
- **Output**: $15 per 1M tokens

**Estimated usage per food log:**
- Input: ~1,500 tokens (skill context + user message)
- Output: ~500 tokens (JSON nutrition response)

**Monthly estimates** (20 logs/day, 600 logs/month):
- Input: 600 × 1,500 = 900K tokens → $2.70
- Output: 600 × 500 = 300K tokens → $4.50
- **Total: ~$7.20/month**

#### USDA FoodData Central
- **Free** with API key
- **Rate limit**: 1,000 requests/hour, 10,000/day
- **DEMO_KEY**: 1,000 requests/hour (sufficient for personal use)

#### GitHub API
- **Free** for personal repositories
- **Rate limit**: 5,000 requests/hour (authenticated)
- **Usage**: ~2 requests per food log (GET + PUT)

### Hosting Costs

#### Railway
- **Free tier**: $5/month credit
- **After free credit**: $0.000463/GB-hour
- **Estimated**: $0-5/month for light usage

#### Vercel
- **Free tier**: 100GB-hours/month
- **After free tier**: $20/month pro plan
- **Estimated**: $0/month for personal use

### Telegram Bot API
- **Free** (no costs)

### Total Monthly Cost Estimate
- **Minimal usage** (5-10 logs/day): $0-3/month
- **Regular usage** (20 logs/day): $7-12/month
- **Heavy usage** (50+ logs/day): $20-30/month

**Cost optimization tips:**
1. Use USDA API first (free) before Claude
2. Cache common foods locally
3. Batch daily summaries instead of per-log
4. Use Railway free tier for hosting

---

## Troubleshooting

### Common Issues

#### "Invalid bot token"
**Cause**: Incorrect or expired Telegram bot token

**Solution:**
1. Check `TELEGRAM_BOT_TOKEN` in `.env`
2. Verify token with BotFather
3. Regenerate token if needed
4. Restart server after updating

#### "Claude API authentication failed"
**Cause**: Invalid or missing Anthropic API key

**Solution:**
1. Check `ANTHROPIC_API_KEY` in `.env`
2. Verify key at console.anthropic.com
3. Ensure key starts with `sk-ant-`
4. Check billing/usage limits

#### "GitHub authentication failed"
**Cause**: Invalid token or insufficient permissions

**Solution:**
1. Check `GITHUB_TOKEN` in `.env`
2. Verify token at github.com/settings/tokens
3. Ensure `repo` scope is enabled
4. Regenerate if expired

#### "Repository not found"
**Cause**: Wrong owner/repo or access denied

**Solution:**
1. Verify `GITHUB_OWNER` and `GITHUB_REPO`
2. Ensure repository exists
3. Check token has access to repo
4. Verify branch name (`daily-logs`)

#### "Missing nutrition fields"
**Cause**: Incomplete data from USDA or Claude

**Solution:**
1. Check logs for specific missing fields
2. Verify SKILL context is loaded
3. Test with simple foods first ("100g chicken")
4. Report issue with example if persistent

#### "Rate limit exceeded"
**Cause**: Too many API requests

**Solution:**
- **Claude**: Wait 60 seconds, reduce frequency
- **USDA**: Use API key instead of DEMO_KEY
- **GitHub**: Unlikely with normal usage, check for loops

#### "Webhook not receiving messages"
**Cause**: Webhook URL not set or incorrect

**Solution:**
1. Verify webhook with getWebhookInfo
2. Check `WEBHOOK_URL` in environment
3. Ensure HTTPS (not HTTP)
4. Test with curl or Postman
5. Check server logs for errors

#### "Energy validation failed"
**Cause**: Nutrition values don't match Atwater formula

**Solution:**
- This is informational, not an error
- Bot auto-corrects if difference >10%
- May indicate data quality issues
- Review source (USDA vs Claude)

### Debugging

**Enable verbose logging:**
```javascript
// In config.js
app: {
  logLevel: 'debug'  // Change from 'info'
}
```

**View Railway logs:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# View logs
railway logs
```

**Test individual modules:**
```bash
# Test config loading
node -e "const c = require('./src/config'); console.log(c.telegram.botToken ? 'OK' : 'FAIL');"

# Test USDA API
node -e "
  const usda = require('./src/usda-api');
  usda.searchFood('chicken').then(r => console.log(r.foods.length));
"

# Test Claude integration
node -e "
  const ci = require('./src/claude-integration');
  ci.processFoodLog('100g rice', 'test').then(console.log);
"
```

### Getting Help

1. **Check documentation**
   - `src/CLAUDE_INTEGRATION_README.md`
   - `src/github-integration.README.md`
   - `GITHUB-INTEGRATION-QUICKSTART.md`

2. **Review logs**
   - Railway/Vercel deployment logs
   - Local terminal output
   - ngrok inspector (local testing)

3. **Test with simple inputs**
   - "100g chicken"
   - "1 apple"
   - "200g rice"

4. **Verify environment**
   - All required variables set
   - Valid API keys
   - Correct repository access

---

## API Integration Details

### Telegram Bot API

**Webhook endpoint**: `POST /webhook`

**Incoming message format:**
```json
{
  "message": {
    "message_id": 123,
    "from": {
      "id": 123456789,
      "first_name": "Thomas"
    },
    "text": "200g grilled chicken"
  }
}
```

**Response format:**
```json
{
  "method": "sendMessage",
  "chat_id": 123456789,
  "text": "✅ Logged: Grilled Chicken Breast\n\n📊 330 kcal | 62g protein"
}
```

### Claude API

**Model**: `claude-sonnet-4-20250514`
**Endpoint**: `https://api.anthropic.com/v1/messages`
**API Version**: `2023-06-01`

**Request structure:**
```javascript
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 4096,
  system: "Full SKILL.md context...",
  messages: [{
    role: "user",
    content: "200g grilled chicken breast"
  }]
}
```

**Response structure:**
```json
{
  "name": "Grilled Chicken Breast",
  "quantity": 200,
  "unit": "g",
  "per_portion": {
    "energy_kcal": 330,
    "protein_g": 62.0,
    // ... all 24 fields
  }
}
```

### USDA FoodData Central API

**Base URL**: `https://api.nal.usda.gov/fdc/v1`
**Authentication**: API key in query parameter

**Search endpoint:**
```
GET /foods/search?api_key={key}&query=chicken+breast&pageSize=5
```

**Response** (simplified):
```json
{
  "foods": [{
    "fdcId": 171477,
    "description": "Chicken, broilers or fryers, breast, meat only, grilled",
    "foodNutrients": [
      { "nutrientId": 1008, "value": 165 },  // Energy
      { "nutrientId": 1003, "value": 31 }    // Protein
    ]
  }]
}
```

### GitHub Contents API

**Base URL**: `https://api.github.com/repos/{owner}/{repo}`
**Authentication**: Bearer token in header

**Get file:**
```
GET /contents/{path}?ref={branch}
Authorization: Bearer {token}
```

**Update file:**
```
PUT /contents/{path}
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "chore: Log food entry",
  "content": "{base64_encoded_yaml}",
  "sha": "{file_sha}",
  "branch": "daily-logs"
}
```

### Required Nutrition Fields (24 Total)

All API responses include these fields:

| Field | Unit | Precision | Description |
|-------|------|-----------|-------------|
| `energy_kcal` | kcal | integer | Total calories |
| `protein_g` | g | 0.1 | Protein |
| `fat_g` | g | 0.1 | Total fat |
| `sat_fat_g` | g | 0.1 | Saturated fat |
| `mufa_g` | g | 0.1 | Monounsaturated fat |
| `pufa_g` | g | 0.1 | Polyunsaturated fat |
| `trans_fat_g` | g | 0.1 | Trans fat |
| `cholesterol_mg` | mg | integer | Cholesterol |
| `carbs_total_g` | g | 0.1 | Total carbohydrates |
| `carbs_available_g` | g | 0.1 | Available carbs (total - fiber - polyols) |
| `sugar_g` | g | 0.1 | Sugars |
| `fiber_total_g` | g | 0.1 | Total dietary fiber |
| `fiber_soluble_g` | g | 0.1 | Soluble fiber |
| `fiber_insoluble_g` | g | 0.1 | Insoluble fiber |
| `polyols_g` | g | 0.1 | Sugar alcohols |
| `sodium_mg` | mg | integer | Sodium |
| `potassium_mg` | mg | integer | Potassium |
| `iodine_ug` | μg | integer | Iodine |
| `magnesium_mg` | mg | integer | Magnesium |
| `calcium_mg` | mg | integer | Calcium |
| `iron_mg` | mg | integer | Iron |
| `zinc_mg` | mg | integer | Zinc |
| `vitamin_c_mg` | mg | integer | Vitamin C |
| `manganese_mg` | mg | 0.1 | Manganese |

**Energy validation** (Atwater formula):
```
energy_kcal = 4×protein_g + 9×fat_g + 4×carbs_available_g + 2×fiber_total_g + 2.4×polyols_g
```

**Tolerance**: ±5-8%

---

## Contributing

Contributions are welcome! This project follows standard GitHub workflow.

### Development Workflow

1. **Fork the repository**
   ```bash
   # On GitHub, click "Fork"
   git clone https://github.com/YOUR_USERNAME/nutrition-tracking.git
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Test locally**
   ```bash
   npm run dev
   node test/test-github-integration.js
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: Add your feature description"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create pull request on GitHub
   ```

### Code Style Guidelines

- **JavaScript**: ES6+ syntax
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Comments**: JSDoc style for functions
- **Naming**: camelCase for variables, PascalCase for classes

**Example:**
```javascript
/**
 * Process food log text and return nutrition data
 * @param {string} message - User's food description
 * @param {string} userId - Telegram user ID
 * @returns {Promise<Object>} Nutrition data with 24 fields
 */
async function processFoodLog(message, userId) {
  // Implementation
}
```

### Testing Guidelines

- Test all new features before submitting PR
- Include test file if adding new modules
- Verify backward compatibility
- Test error handling paths

### Documentation

- Update README.md for user-facing changes
- Update module READMEs for API changes
- Add inline comments for complex logic
- Include examples in documentation

---

## License

```
Copyright 2025 Thomas Mustier

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

See [LICENSE](/LICENSE) for full text.

---

## Quick Links

- **GitHub Repository**: [tmustier/nutrition-tracking](https://github.com/tmustier/nutrition-tracking)
- **Telegram Bot API**: [core.telegram.org/bots/api](https://core.telegram.org/bots/api)
- **Anthropic Claude**: [console.anthropic.com](https://console.anthropic.com/)
- **USDA FoodData Central**: [fdc.nal.usda.gov](https://fdc.nal.usda.gov/)
- **Railway**: [railway.app](https://railway.app)
- **Vercel**: [vercel.com](https://vercel.com)

---

## Acknowledgments

- **Anthropic** for Claude AI API
- **USDA** for FoodData Central database
- **Telegraf** for excellent Telegram bot framework
- **Railway/Vercel** for deployment platforms

---

**Built with Claude Code** | Last updated: 2025-11-04
