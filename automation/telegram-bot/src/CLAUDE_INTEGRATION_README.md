# Claude API Integration Module

## Overview

The `claude-integration.js` module provides a complete integration with the Anthropic Claude API for nutrition tracking. It implements the full workflow described in `/Users/thomasmustier/nutrition-tracking/SKILL.md` with automatic USDA fallback and comprehensive error handling.

## Features

### 1. Text-based Food Logging (`processFoodLog`)

Processes user text input describing what they ate and returns complete nutrition data.

**Strategy:**
- First attempts USDA FoodData Central lookup for generic foods (chicken, rice, eggs, etc.)
- Falls back to Claude API estimation for branded items, restaurant dishes, or complex meals
- Returns all 24 required nutrition fields with no null values

**Example:**
```javascript
const result = await claudeIntegration.processFoodLog("200g grilled chicken breast", "user123");

// Returns:
{
  success: true,
  source: 'usda', // or 'claude'
  data: {
    name: "Chicken, breast, grilled",
    food_bank_id: null,
    quantity: 200,
    unit: "g",
    per_portion: {
      energy_kcal: 330,
      protein_g: 62.0,
      fat_g: 7.2,
      // ... all 24 fields
    },
    notes: "USDA FoodData Central (FDC ID: 171477)"
  }
}
```

### 2. Image Processing (`processImage`)

Uses Claude Vision API to extract nutrition data from images.

**Use Cases:**
- Nutrition labels
- Menu screenshots
- Restaurant dish photos

**Example:**
```javascript
const imageBuffer = fs.readFileSync('nutrition-label.jpg');
const result = await claudeIntegration.processImage(imageBuffer, 'image/jpeg');

// Returns same structure as processFoodLog
```

### 3. Daily Summary (`getDailySummary`)

Placeholder for generating daily nutrition summaries. Currently returns a template message.

**Example:**
```javascript
const summary = await claudeIntegration.getDailySummary('2025-11-04');

// Returns:
{
  success: true,
  date: '2025-11-04',
  message: 'Daily summary for 2025-11-04 - Feature in development!',
  placeholder_targets: { ... }
}
```

### 4. Get Targets (`getTargets`)

Returns daily nutrition targets based on day type (rest vs training).

**Example:**
```javascript
const restTargets = claudeIntegration.getTargets('rest');
// Returns: { energy_kcal: 2500, protein_g: 170, fat_g: 70, carbs_g: 250, fiber_g: 40 }

const trainingTargets = claudeIntegration.getTargets('training');
// Returns: { energy_kcal: 2900, protein_g: 170, fat_g: 70, carbs_g: 250, fiber_g: 40 }
```

## Required Nutrition Fields (24 total)

Every nutrition response includes all 24 fields with no null values:

| Field | Type | Unit | Example |
|-------|------|------|---------|
| `energy_kcal` | int | kcal | 450 |
| `protein_g` | float | g | 25.0 |
| `fat_g` | float | g | 15.0 |
| `sat_fat_g` | float | g | 5.0 |
| `mufa_g` | float | g | 7.0 |
| `pufa_g` | float | g | 2.5 |
| `trans_fat_g` | float | g | 0.0 |
| `cholesterol_mg` | int | mg | 75 |
| `sugar_g` | float | g | 5.0 |
| `fiber_total_g` | float | g | 3.0 |
| `fiber_soluble_g` | float | g | 1.0 |
| `fiber_insoluble_g` | float | g | 2.0 |
| `carbs_total_g` | float | g | 45.0 |
| `carbs_available_g` | float | g | 42.0 |
| `sodium_mg` | int | mg | 500 |
| `potassium_mg` | int | mg | 350 |
| `iodine_ug` | int | μg | 10 |
| `magnesium_mg` | int | mg | 50 |
| `calcium_mg` | int | mg | 100 |
| `iron_mg` | int | mg | 2 |
| `zinc_mg` | int | mg | 3 |
| `vitamin_c_mg` | int | mg | 15 |
| `manganese_mg` | float | mg | 0.5 |
| `polyols_g` | float | g | 0.0 |

## Energy Validation

All nutrition data is validated using the Atwater formula:

```
energy_kcal = 4×protein_g + 9×fat_g + 4×carbs_available_g + 2×fiber_total_g + 2.4×polyols_g
```

Tolerance: ±5-8%

## Embedded Context

The module embeds the complete skill context from `SKILL.md` and health profile from `health-profile.yaml` to ensure Claude understands:

- Thomas's daily targets (2500 kcal rest / 2900 kcal training)
- Required nutrition fields and validation rules
- Estimation philosophy (never use null, always estimate)
- UK vs US carb label handling
- Atwater energy calculation

## Error Handling

The module provides detailed error messages for common issues:

- `401`: Invalid Claude API key - check configuration
- `429`: Rate limit exceeded - try again later
- `500`: Generic API error with details

## Configuration

Required environment variables (via `config.js`):

```env
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=4096
```

## Dependencies

- `axios`: HTTP client for Claude API
- `config.js`: Configuration management
- `usda-api.js`: USDA FoodData Central integration

## Testing

To test the integration:

```javascript
// Test text input
const result = await claudeIntegration.processFoodLog("100g oats with milk", "test-user");
console.log(JSON.stringify(result, null, 2));

// Test image input
const fs = require('fs');
const imageBuffer = fs.readFileSync('test-image.jpg');
const imageResult = await claudeIntegration.processImage(imageBuffer, 'image/jpeg');
console.log(JSON.stringify(imageResult, null, 2));
```

## Integration with Telegram Bot

The module is designed to be used by the Telegram bot webhook handler:

```javascript
const claudeIntegration = require('./claude-integration');

// In webhook handler
const result = await claudeIntegration.processFoodLog(userMessage, userId);

if (result.success) {
  // Log to GitHub via github-integration.js
  await githubIntegration.appendLogEntry(result.data);
}
```

## Future Enhancements

1. **getDailySummary**: Implement full log file reading and aggregation
2. **Batch Processing**: Support multiple food items in one request
3. **Caching**: Cache recent Claude responses to reduce API calls
4. **Confidence Scoring**: Add confidence levels to estimations
5. **Multi-language Support**: Handle food descriptions in multiple languages

## License

Apache-2.0 - See main repository LICENSE file
