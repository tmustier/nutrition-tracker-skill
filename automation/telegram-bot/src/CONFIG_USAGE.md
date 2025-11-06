# Configuration Module Usage

## Overview

The `config.js` module provides centralized configuration management for the Telegram bot, including:
- Environment variable loading and validation
- Embedded skill context from SKILL.md
- User health profile and targets
- API credentials and endpoints

## Quick Start

```javascript
const config = require('./config');

// Access Telegram settings
const botToken = config.telegram.botToken;
const webhookUrl = config.telegram.webhookUrl;

// Access Claude API settings
const claudeApiKey = config.claude.apiKey;
const model = config.claude.model; // Default: claude-sonnet-4-20250514

// Access GitHub settings
const repo = `${config.github.owner}/${config.github.repo}`;
const branch = config.github.branch; // Default: daily-logs

// Access user profile
const restDayMax = config.userProfile.targets.energy_kcal.rest_day_max; // 2500
const proteinMin = config.userProfile.targets.protein_g_min; // 170

// Use skill context in Claude API calls
const systemPrompt = config.skillContext;
```

## Configuration Structure

### Telegram
- `botToken`: Telegram Bot API token (from BotFather)
- `webhookUrl`: Public URL for webhook (auto-detected from RAILWAY_PUBLIC_DOMAIN or defaults to localhost)

### Claude API
- `apiKey`: Anthropic API key
- `model`: Claude model to use (default: claude-sonnet-4-20250514)
- `maxTokens`: Maximum tokens per request (default: 4096)
- `apiVersion`: API version (fixed: 2023-06-01)

### GitHub
- `token`: GitHub Personal Access Token
- `owner`: Repository owner (default: tmustier)
- `repo`: Repository name (default: nutrition-tracking)
- `branch`: Target branch for commits (default: daily-logs)

### USDA
- `apiKey`: USDA FoodData Central API key (default: DEMO_KEY - has rate limits)
- `baseUrl`: API base URL (default: https://api.nal.usda.gov/fdc/v1)

### User Profile
Complete health profile with:
- `meta`: Owner, timezone, notes
- `targets`: Energy, protein, fat, carbs, fiber, sodium targets for rest/training days
- `monitoring`: Additional nutrients to track (vitamins, minerals, fats, carbs)
- `assumptions`: Default cooking assumptions (salt, oil, rounding)

### Skill Context
Full embedded skill prompt combining:
- SKILL.md estimation and logging workflow
- Health profile data
- Telegram bot-specific instructions
- JSON output format specification

## Environment Variables

Required variables (must be set in `.env`):
```bash
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
ANTHROPIC_API_KEY=your_anthropic_api_key
GITHUB_TOKEN=your_github_personal_access_token
```

Optional variables (have sensible defaults):
```bash
WEBHOOK_URL=https://your-app.railway.app
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=4096
GITHUB_OWNER=tmustier
GITHUB_REPO=nutrition-tracking
GITHUB_BRANCH=daily-logs
USDA_API_KEY=your_usda_api_key
PORT=3000
NODE_ENV=development
```

## Validation

The module automatically validates required configuration on load:
- In development: Logs error to console but continues
- In production: Exits process with error code 1

Example error:
```
❌ Configuration Error: Missing required configuration: telegram.botToken, claude.apiKey, github.token
Please check your .env file and ensure all required variables are set.
```

## Usage in Other Modules

### Claude Integration
```javascript
const config = require('./config');
const axios = require('axios');

async function callClaude(userMessage) {
  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: config.claude.model,
      max_tokens: config.claude.maxTokens,
      system: config.skillContext, // Embedded skill prompt
      messages: [{ role: 'user', content: userMessage }],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.claude.apiKey,
        'anthropic-version': config.claude.apiVersion,
      },
    }
  );
  return response.data;
}
```

### GitHub Integration
```javascript
const config = require('./config');

function getLogFilePath() {
  const date = new Date().toISOString().split('T')[0];
  const [year, month, day] = date.split('-');
  return `data/logs/${year}-${month}/${day}.yaml`;
}

const apiUrl = `https://api.github.com/repos/${config.github.owner}/${config.github.repo}/contents/${getLogFilePath()}`;
```

### Health Profile Access
```javascript
const config = require('./config');

function calculateRemaining(totals, isDayTraining = false) {
  const targets = config.userProfile.targets;
  const energyTarget = isDayTraining 
    ? targets.energy_kcal.training_day_max 
    : targets.energy_kcal.rest_day_max;
  
  return {
    energy: energyTarget - totals.energy_kcal,
    protein: targets.protein_g_min - totals.protein_g,
  };
}
```

## Testing

Test the configuration:
```bash
cd /Users/thomasmustier/nutrition-tracking/automation/telegram-bot
node -e "const c = require('./src/config'); console.log('Config OK:', c.userProfile.meta.owner);"
```

## Notes

- dotenv is loaded automatically when config is imported
- All defaults align with .env.example
- Skill context is ~6.7KB of embedded instructions
- User profile is complete with all targets and monitoring fields
- Config is exported as a singleton (single shared instance)
