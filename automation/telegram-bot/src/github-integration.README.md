# GitHub Integration Module

## Overview

The `github-integration.js` module provides a complete interface for logging nutrition data to the GitHub repository using the GitHub Contents API. It handles reading, writing, and managing YAML log files according to the schema defined in `/Users/thomasmustier/nutrition-tracking/data/logs/SCHEMA.md`.

## Features

- **Date-based file organization**: Automatically generates file paths in format `data/logs/YYYY-MM/DD.yaml`
- **Atomic updates**: Uses GitHub file SHA for conflict-free commits
- **YAML parsing/generation**: Converts between JavaScript objects and YAML format
- **Nutrition validation**: Ensures all 24 required nutrition fields are present
- **Daily totals**: Aggregates nutrition across all logged entries
- **Error handling**: Comprehensive error messages for debugging
- **Branch isolation**: Commits to `daily-logs` branch (not main)

## API Reference

### Class: `GitHubIntegration`

A singleton class that manages all GitHub interactions.

#### Constructor

```javascript
const githubIntegration = require('./github-integration');
```

The constructor validates required configuration from environment variables:
- `GITHUB_TOKEN` (required)
- `GITHUB_OWNER` (optional, defaults to 'tmustier')
- `GITHUB_REPO` (optional, defaults to 'nutrition-tracking')
- `GITHUB_BRANCH` (optional, defaults to 'daily-logs')

#### Methods

##### `getCurrentDate()`

Returns the current date in UTC format (YYYY-MM-DD).

```javascript
const date = githubIntegration.getCurrentDate();
// => "2025-11-04"
```

**Returns:** `string` - Date in YYYY-MM-DD format

---

##### `getLogFilePath(date?)`

Constructs the file path for a log file.

```javascript
const path = githubIntegration.getLogFilePath();
// => "data/logs/2025-11/04.yaml"

const customPath = githubIntegration.getLogFilePath('2025-10-30');
// => "data/logs/2025-10/30.yaml"
```

**Parameters:**
- `date` (optional): Date string in YYYY-MM-DD format. Defaults to today.

**Returns:** `string` - File path in repository

---

##### `getOrCreateLogFile(date?)`

Reads an existing log file from GitHub, or returns a new log structure if the file doesn't exist.

```javascript
const logFile = await githubIntegration.getOrCreateLogFile();
// => {
//      exists: true,
//      sha: 'abc123...',
//      data: { date: '2025-11-04', day_type: 'rest', entries: [...] },
//      path: 'data/logs/2025-11/04.yaml'
//    }
```

**Parameters:**
- `date` (optional): Date string in YYYY-MM-DD format. Defaults to today.

**Returns:** `Promise<Object>` - Log file object with:
- `exists` (boolean): Whether the file was found
- `sha` (string|null): File SHA for atomic updates (null for new files)
- `data` (Object): Parsed YAML content
- `path` (string): File path in repo

**Errors:**
- Throws if GitHub API request fails (except 404)
- Returns new structure on 404 (file not found)

---

##### `appendLogEntry(nutritionData, timestamp?)`

Appends a new nutrition entry to today's log file and commits to GitHub.

```javascript
const result = await githubIntegration.appendLogEntry({
  name: 'Grilled chicken breast',
  food_bank_id: 'chicken_breast_grilled_v1',
  quantity: 200,
  unit: 'g',
  nutrition: {
    energy_kcal: 330,
    protein_g: 62,
    fat_g: 7,
    // ... all 24 required fields
  },
  notes: 'Post-workout meal'
});
// => {
//      success: true,
//      commit_sha: 'def456...',
//      commit_url: 'https://github.com/...',
//      file_path: 'data/logs/2025-11/04.yaml'
//    }
```

**Parameters:**
- `nutritionData` (Object): Nutrition data to log
  - `name` (string, required): Food name
  - `food_bank_id` (string|null): Reference to food bank entry
  - `quantity` (number, optional): Amount consumed (default: 1)
  - `unit` (string, optional): Unit of measurement (default: 'portion')
  - `nutrition` (Object, required): Complete nutrition object with all 24 fields
  - `notes` (string|null, optional): Optional notes about the meal
- `timestamp` (string, optional): ISO 8601 timestamp. Defaults to current time.

**Returns:** `Promise<Object>` - Commit result with:
- `success` (boolean): Whether the commit succeeded
- `commit_sha` (string): SHA of the commit
- `commit_url` (string): GitHub URL to view the commit
- `file_path` (string): Path to the log file

**Errors:**
- Throws if `nutritionData.name` or `nutritionData.nutrition` is missing
- Throws if GitHub authentication fails (401)
- Throws if repository not found (404)
- Throws if commit conflict occurs (409)
- Validates and fills missing nutrition fields with 0

---

##### `getTodaysTotals(date?)`

Calculates daily nutrition totals from all logged entries.

```javascript
const totals = await githubIntegration.getTodaysTotals();
// => {
//      date: '2025-11-04',
//      entries: 3,
//      items: 5,
//      energy_kcal: 2340.5,
//      protein_g: 165.2,
//      fat_g: 78.3,
//      carbs_total_g: 245.6,
//      // ... other tracked nutrients
//    }
```

**Parameters:**
- `date` (optional): Date string in YYYY-MM-DD format. Defaults to today.

**Returns:** `Promise<Object>` - Daily totals with:
- `date` (string): Date in YYYY-MM-DD format
- `entries` (number): Number of meal entries
- `items` (number): Total number of food items
- `energy_kcal` (number): Total calories
- `protein_g` (number): Total protein
- `fat_g` (number): Total fat
- `sat_fat_g` (number): Total saturated fat
- `carbs_total_g` (number): Total carbohydrates
- `carbs_available_g` (number): Total available carbs
- `fiber_total_g` (number): Total fiber
- `sugar_g` (number): Total sugar
- `sodium_mg` (number): Total sodium
- `potassium_mg` (number): Total potassium
- `calcium_mg` (number): Total calcium
- `iron_mg` (number): Total iron
- `magnesium_mg` (number): Total magnesium
- `zinc_mg` (number): Total zinc
- `vitamin_c_mg` (number): Total vitamin C

All numeric values are rounded to 1 decimal place.

**Errors:**
- Returns empty totals (zeros) on error rather than throwing
- Logs errors to console for debugging

---

## Usage Examples

### Example 1: Log a simple meal

```javascript
const githubIntegration = require('./github-integration');

async function logMeal() {
  try {
    const result = await githubIntegration.appendLogEntry({
      name: 'Salmon poke bowl',
      food_bank_id: 'salmon_poke_bowl_v2',
      quantity: 1,
      unit: 'portion',
      nutrition: {
        energy_kcal: 520,
        protein_g: 38,
        fat_g: 22,
        sat_fat_g: 4,
        mufa_g: 12,
        pufa_g: 5,
        trans_fat_g: 0,
        cholesterol_mg: 85,
        carbs_total_g: 48,
        polyols_g: 0,
        carbs_available_g: 44,
        sugar_g: 8,
        fiber_total_g: 4,
        fiber_soluble_g: 0,
        fiber_insoluble_g: 0,
        sodium_mg: 890,
        potassium_mg: 650,
        iodine_ug: 0,
        magnesium_mg: 92,
        calcium_mg: 45,
        iron_mg: 2.8,
        zinc_mg: 1.4,
        vitamin_c_mg: 18,
        manganese_mg: 0,
      },
      notes: 'Lunch at Sticks n Sushi'
    });

    console.log('Success!', result.commit_url);
  } catch (error) {
    console.error('Failed to log meal:', error.message);
  }
}

logMeal();
```

### Example 2: Get daily totals and check progress

```javascript
const githubIntegration = require('./github-integration');

async function checkProgress() {
  try {
    const totals = await githubIntegration.getTodaysTotals();

    const targets = {
      energy_kcal: 2500,
      protein_g: 170,
    };

    const remaining = {
      energy_kcal: Math.max(0, targets.energy_kcal - totals.energy_kcal),
      protein_g: Math.max(0, targets.protein_g - totals.protein_g),
    };

    console.log(`Today: ${totals.energy_kcal}/${targets.energy_kcal} kcal`);
    console.log(`Protein: ${totals.protein_g}/${targets.protein_g}g`);
    console.log(`Still need: ${remaining.energy_kcal} kcal, ${remaining.protein_g}g protein`);
  } catch (error) {
    console.error('Failed to get totals:', error.message);
  }
}

checkProgress();
```

### Example 3: Log a meal with multiple items at once

```javascript
// Note: Currently the API logs single items per entry.
// To log multiple items together, you would need to:
// 1. Get the log file
// 2. Create an entry with multiple items
// 3. Commit manually

// Or call appendLogEntry multiple times with the same timestamp
const githubIntegration = require('./github-integration');

async function logBreakfast() {
  const timestamp = new Date().toISOString();

  await githubIntegration.appendLogEntry({
    name: 'Poached eggs',
    quantity: 2,
    unit: 'eggs',
    nutrition: { /* ... */ }
  }, timestamp);

  await githubIntegration.appendLogEntry({
    name: 'Sourdough toast',
    quantity: 2,
    unit: 'slices',
    nutrition: { /* ... */ }
  }, timestamp);

  // Note: This creates 2 entries with the same timestamp
  // For a single entry with multiple items, you'll need to
  // manually construct the entry structure
}
```

## Required Nutrition Fields

All 24 nutrition fields must be present in the `nutrition` object:

1. `energy_kcal` - Calories
2. `protein_g` - Protein (grams)
3. `fat_g` - Total fat (grams)
4. `sat_fat_g` - Saturated fat (grams)
5. `mufa_g` - Monounsaturated fat (grams)
6. `pufa_g` - Polyunsaturated fat (grams)
7. `trans_fat_g` - Trans fat (grams)
8. `cholesterol_mg` - Cholesterol (milligrams)
9. `carbs_total_g` - Total carbohydrates (grams)
10. `polyols_g` - Polyols/sugar alcohols (grams)
11. `carbs_available_g` - Available carbs (grams)
12. `sugar_g` - Sugars (grams)
13. `fiber_total_g` - Total fiber (grams)
14. `fiber_soluble_g` - Soluble fiber (grams)
15. `fiber_insoluble_g` - Insoluble fiber (grams)
16. `sodium_mg` - Sodium (milligrams)
17. `potassium_mg` - Potassium (milligrams)
18. `iodine_ug` - Iodine (micrograms)
19. `magnesium_mg` - Magnesium (milligrams)
20. `calcium_mg` - Calcium (milligrams)
21. `iron_mg` - Iron (milligrams)
22. `zinc_mg` - Zinc (milligrams)
23. `vitamin_c_mg` - Vitamin C (milligrams)
24. `manganese_mg` - Manganese (milligrams)

**Important:** No null values are allowed. Use `0` for unmeasured/unknown values and document assumptions in the `notes` field.

## Error Handling

The module includes comprehensive error handling:

- **Missing configuration**: Throws on module import if `GITHUB_TOKEN` is missing
- **Missing required data**: Throws if `name` or `nutrition` is missing from `nutritionData`
- **Authentication errors (401)**: Throws with message to check `GITHUB_TOKEN`
- **Repository not found (404)**: Throws with repo name
- **Commit conflicts (409)**: Throws when file was modified by another process
- **Validation errors**: Warns and sets to 0 for invalid/missing nutrition fields

All errors are logged to console with detailed information for debugging.

## Testing

Run the test suite:

```bash
cd /Users/thomasmustier/nutrition-tracking/automation/telegram-bot
node test/test-github-integration.js
```

The test validates:
- Date formatting
- File path generation
- Nutrition field validation
- YAML structure generation
- Daily totals calculation

## Architecture Notes

### Why singleton?

The module exports a singleton instance (`module.exports = new GitHubIntegration()`) to:
- Share configuration across all imports
- Avoid multiple instances with different configs
- Simplify usage (no need to instantiate)

### Why atomic updates?

GitHub's Contents API requires a file SHA for updates to prevent race conditions. The SHA acts as an optimistic lock - if the file was modified by another process, the commit will fail with a 409 conflict error.

### Why daily-logs branch?

Per the SKILL.md instructions, nutrition logs should be committed to the `daily-logs` branch, not main. A separate automation workflow runs at 4am UTC daily to create PRs and merge to main. This keeps the main branch clean and allows for review before merging.

### Why validate nutrition fields?

According to SCHEMA.md, all nutrition fields must be present with numeric values (0 or positive). This maintains the philosophy that all entries are estimates - null values would defeat the purpose of precise estimation.

## Integration with Telegram Bot

The GitHub integration module is designed to be used by the Telegram bot's webhook handler:

```javascript
// In webhook.js
const githubIntegration = require('./github-integration');
const claudeIntegration = require('./claude-integration');

bot.on('text', async (ctx) => {
  // 1. Process with Claude/USDA to get nutrition data
  const result = await claudeIntegration.processFoodLog(ctx.message.text);

  // 2. Log to GitHub
  const commitResult = await githubIntegration.appendLogEntry(result.data);

  // 3. Get updated totals
  const totals = await githubIntegration.getTodaysTotals();

  // 4. Reply to user
  await ctx.reply(`Logged! Today: ${totals.energy_kcal} kcal, ${totals.protein_g}g protein`);
});
```

## Performance Considerations

- Each `appendLogEntry` call makes 3 GitHub API requests:
  1. GET to fetch current file (or 404 if new)
  2. PUT to commit the update
  3. Internally, GitHub validates the SHA

- Rate limits: GitHub API allows 5,000 requests/hour for authenticated users
  - This supports ~1,666 food logs per hour (more than enough)

- File size: YAML log files grow throughout the day
  - Typical entry: ~500 bytes
  - 20 entries/day: ~10 KB
  - Well within GitHub's limits

## Troubleshooting

### "GitHub authentication failed - check GITHUB_TOKEN"

Your `GITHUB_TOKEN` is invalid or expired. Generate a new Personal Access Token:
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Create a new token with `repo` scope
3. Update `.env` file with new token

### "Repository not found"

Check that `GITHUB_OWNER` and `GITHUB_REPO` are correct in your `.env` file.

### "Commit conflict - file was modified by another process"

Another process (or user) modified the file between your read and write. The module will need to retry the operation. This is rare but can happen if multiple bots are running.

### "Missing nutrition fields (set to 0)"

The nutrition data is missing required fields. Check that your Claude/USDA integration is returning all 24 fields. The module will set missing fields to 0 but log a warning.

## License

Apache-2.0
