# Claude Integration - Quick Start Guide

## Module Overview

The `claude-integration.js` module provides complete Claude API integration for nutrition tracking with USDA fallback.

## File Locations

```
/Users/thomasmustier/nutrition-tracking/automation/telegram-bot/src/
├── claude-integration.js          # Main Claude API integration (463 lines)
├── usda-api.js                   # USDA FoodData Central API (218 lines)
├── config.js                     # Configuration management (293 lines)
├── CLAUDE_INTEGRATION_README.md  # Full documentation
└── QUICK_START.md               # This file
```

## Basic Usage

### 1. Import the Module

```javascript
const claudeIntegration = require('./src/claude-integration');
```

### 2. Process Text Input

```javascript
// User says: "I just ate 200g grilled chicken breast"
const result = await claudeIntegration.processFoodLog(
  "200g grilled chicken breast",
  "user123"
);

console.log(result);
// {
//   success: true,
//   source: 'usda',  // or 'claude'
//   data: {
//     name: "Chicken, breast, grilled",
//     quantity: 200,
//     unit: "g",
//     per_portion: {
//       energy_kcal: 330,
//       protein_g: 62.0,
//       ... all 24 fields
//     }
//   }
// }
```

### 3. Process Images

```javascript
const fs = require('fs');
const imageBuffer = fs.readFileSync('nutrition-label.jpg');

const result = await claudeIntegration.processImage(
  imageBuffer,
  'image/jpeg'
);

if (result.success) {
  console.log('Extracted:', result.data.name);
  console.log('Calories:', result.data.per_portion.energy_kcal);
}
```

### 4. Get Daily Targets

```javascript
// No API call required
const targets = claudeIntegration.getTargets('rest');
console.log(targets);
// {
//   energy_kcal: 2500,
//   protein_g: 170,
//   fat_g: 70,
//   carbs_g: 250,
//   fiber_g: 40
// }
```

## All 24 Nutrition Fields

Every response includes these fields (NO NULLS):

```
energy_kcal, protein_g, fat_g, sat_fat_g, mufa_g, pufa_g,
trans_fat_g, cholesterol_mg, sugar_g, fiber_total_g,
fiber_soluble_g, fiber_insoluble_g, carbs_total_g,
carbs_available_g, sodium_mg, potassium_mg, iodine_ug,
magnesium_mg, calcium_mg, iron_mg, zinc_mg, vitamin_c_mg,
manganese_mg, polyols_g
```

## Configuration

Create `.env` file:

```env
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=4096
TELEGRAM_BOT_TOKEN=...
GITHUB_TOKEN=...
USDA_API_KEY=DEMO_KEY
```

## Error Handling

```javascript
try {
  const result = await claudeIntegration.processFoodLog(message, userId);
  
  if (!result.success) {
    console.error('Failed:', result.message);
    return;
  }
  
  // Success - process result
  console.log('Logged:', result.data.name);
  
} catch (error) {
  if (error.message.includes('Invalid Claude API key')) {
    console.error('API key issue - check .env');
  } else if (error.message.includes('rate limit')) {
    console.error('Too many requests - wait and retry');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Key Features

1. **USDA First Strategy**
   - Generic foods (chicken, rice, eggs) → Try USDA first
   - USDA fails or branded items → Use Claude API
   - All responses standardized to 24 fields

2. **Energy Validation**
   - Formula: `4P + 9F + 4C_avail + 2fiber + 2.4polyols`
   - Auto-corrects if USDA energy differs by >10%

3. **No Null Values**
   - Missing data → Estimated with confidence
   - True zeros → Only for scientifically impossible (e.g., cholesterol in plants)

4. **Embedded Context**
   - Full SKILL.md as system prompt
   - Health profile targets from health-profile.yaml
   - User profile (Thomas, 30yo, 183cm, 85kg)

## Testing

```bash
# Load module test (no API calls)
cd /Users/thomasmustier/nutrition-tracking/automation/telegram-bot
node -e "
  const ci = require('./src/claude-integration');
  console.log('Targets:', ci.getTargets('rest'));
"

# Full test (requires API keys)
node -e "
  const ci = require('./src/claude-integration');
  ci.processFoodLog('100g oats', 'test').then(r => console.log(r));
"
```

## Integration with Telegram Bot

```javascript
const { Telegraf } = require('telegraf');
const claudeIntegration = require('./src/claude-integration');
const githubIntegration = require('./src/github-integration');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Handle text messages
bot.on('text', async (ctx) => {
  const result = await claudeIntegration.processFoodLog(
    ctx.message.text,
    ctx.from.id
  );
  
  if (result.success) {
    await githubIntegration.appendLogEntry(result.data);
    await ctx.reply(`✅ Logged: ${result.data.name}`);
  } else {
    await ctx.reply('❌ Could not process. Try again?');
  }
});

// Handle images
bot.on('photo', async (ctx) => {
  const photo = ctx.message.photo[ctx.message.photo.length - 1];
  const fileLink = await ctx.telegram.getFileLink(photo.file_id);
  
  const response = await axios.get(fileLink.href, {
    responseType: 'arraybuffer'
  });
  
  const result = await claudeIntegration.processImage(
    Buffer.from(response.data),
    'image/jpeg'
  );
  
  if (result.success) {
    await githubIntegration.appendLogEntry(result.data);
    await ctx.reply(`✅ Logged: ${result.data.name}`);
  }
});

bot.launch();
```

## Next Steps

1. **Set up .env file** with API keys
2. **Test with simple inputs** (e.g., "100g chicken")
3. **Integrate with Telegram bot** webhook handler
4. **Deploy to production** (Railway/Vercel)

## Documentation

- **Full details:** `CLAUDE_INTEGRATION_README.md`
- **Config usage:** `CONFIG_USAGE.md`

## Support

Common issues:
- Missing API key → Check `.env` file
- Module load error → Run `npm install`
- Rate limits → Wait and retry
- Invalid JSON response → Check Claude API status

## License

Apache-2.0
