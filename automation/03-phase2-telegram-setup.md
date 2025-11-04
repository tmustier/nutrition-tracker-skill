[← Phase 1 Foundation](02-phase1-foundation.md) | [↑ Table of Contents](README.md) | [Next: Phase 2 Code →](04-phase2-telegram-code.md)

---

## Phase 2: Telegram Bot (Week 2-3)

**Goals**:
- Create Telegram bot for text-based food logging
- Integrate with Claude API for nutrition processing
- Enable screenshot uploads for blocked websites
- Automate git commits via GitHub API
- Solve pain point #3

**Time Estimate**: 8-12 hours total

---

### 2.1 Create Telegram Bot

#### 2.1.1 Set Up Bot via BotFather

**Steps**:

1. Open Telegram app (on any device)
2. Search for "@BotFather" (official bot creation tool)
3. Start chat with BotFather: `/start`
4. Create new bot: `/newbot`
5. Follow prompts:
   - Bot display name: "Thomas Nutrition Tracker" (or your preferred name)
   - Bot username: Must end in "bot", e.g., "thomas_nutrition_bot" (must be unique)
6. BotFather responds with:
   - Bot token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
   - Save this token securely - you'll need it for deployment
7. Set bot description (optional):
   ```
   /setdescription
   Select your bot
   Enter: "Personal nutrition tracking assistant. Log food, get nutrition breakdowns, track daily progress."
   ```
8. Set bot commands (optional but recommended):
   ```
   /setcommands
   Select your bot
   Enter:
   start - Start the bot
   help - Show help message
   today - Get today's nutrition summary
   week - Get this week's summary
   cancel - Cancel current operation
   ```

**Save**:
- Bot username: `@your_bot_username`
- Bot token: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

**Time**: 5 minutes

#### 2.1.2 Test Bot Connection

```bash
# Test that bot token works
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe

# Expected response:
# {"ok":true,"result":{"id":123456789,"is_bot":true,"first_name":"Thomas Nutrition Tracker","username":"thomas_nutrition_bot"}}
```

**Success Criteria**:
- ✅ Bot created with unique username
- ✅ Token received from BotFather
- ✅ API call to getMe returns bot information

**Time**: 5 minutes

---

### 2.2 Build Serverless Function

#### 2.2.1 Create Project Structure

```bash
# Navigate to automation folder
cd /home/user/nutrition-tracker-skill/automation

# Create bot project
mkdir telegram-bot
cd telegram-bot

# Initialize Node.js project
npm init -y

# Install dependencies
npm install telegraf axios dotenv js-yaml

# Install dev dependencies
npm install --save-dev @types/node

# Create project structure
mkdir src
touch src/webhook.js
touch src/claude-integration.js
touch src/github-integration.js
touch src/usda-api.js
touch src/config.js
touch .env.example
touch .env
touch README.md
```

**Time**: 5 minutes

#### 2.2.2 Create Configuration File

**File**: `src/config.js`

```javascript
// src/config.js
require('dotenv').config();

module.exports = {
  // Telegram Configuration
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    webhookUrl: process.env.WEBHOOK_URL, // Will be provided by Railway/Vercel
  },

  // Anthropic Claude API
  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
    maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS) || 4096,
  },

  // GitHub Configuration
  github: {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER || 'tmustier',
    repo: process.env.GITHUB_REPO || 'nutrition-tracker-skill',
    branch: process.env.GITHUB_BRANCH || 'daily-logs',
  },

  // USDA FoodData Central API
  usda: {
    apiKey: process.env.USDA_API_KEY,
    baseUrl: 'https://api.nal.usda.gov/fdc/v1',
  },

  // Nutrition Skill Context (embedded SKILL.md content)
  skillContext: `You are a nutrition tracking assistant for Thomas. Your task is to help log food intake and provide nutrition analysis.

## Your Capabilities:
1. Estimate nutrition for foods (generic ingredients via USDA API, or restaurant dishes via data bank)
2. Log food consumption to YAML files
3. Provide daily nutrition summaries
4. Track progress against targets

## User Profile:
- Name: Thomas
- Age: 30
- Height: 183cm
- Weight: ~85kg
- Targets (from references/health-profile.yaml):
  - Rest day: 2,500 kcal max
  - Training day: 2,900 kcal max
  - Protein: 170g minimum
  - Fat: 70g minimum
  - Carbs: 250g minimum
  - Fiber: 40g minimum

## Workflow:
When user messages you with food they ate:
1. Parse the food description
2. Check if it's a generic ingredient → query USDA API
3. Check if it's a known restaurant dish → reference data bank
4. If unknown → estimate based on similar foods
5. Return structured JSON with complete nutrition data (all 24 fields required)
6. Bot will then log to YAML and commit to GitHub

## Response Format:
Always respond with JSON in this format:
\`\`\`json
{
  "success": true,
  "message": "Logged ✓. [Food name]: [kcal] kcal, [protein]g protein. Today: [total_kcal]/[target] kcal, [total_protein]/170g protein. Still need [remaining_kcal] kcal, [remaining_protein]g protein.",
  "nutrition": {
    "name": "Food name",
    "quantity": 1,
    "unit": "portion",
    "food_bank_id": null,
    "per_portion": {
      "energy_kcal": 0,
      "protein_g": 0,
      ... [all 24 required fields]
    }
  }
}
\`\`\`

Be concise and helpful. If unsure, ask clarifying questions.`,
};
```

**Time**: 10 minutes

---

## Navigation

- [← Previous: Phase 1 Foundation](02-phase1-foundation.md)
- [↑ Table of Contents](README.md)
- [Next: Phase 2 Code →](04-phase2-telegram-code.md)

**Related Sections**:
- [Prerequisites: Telegram Account](01-overview-and-planning.md#required-accounts)
- [Code Implementation](04-phase2-telegram-code.md)
- [Troubleshooting Bot Issues](07-operations.md#issue-bot-not-responding-to-messages)
