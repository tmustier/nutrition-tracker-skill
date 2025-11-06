# GitHub Integration Quick Start

## TL;DR

```javascript
const githubIntegration = require('./src/github-integration');

// Log a meal
await githubIntegration.appendLogEntry({
  name: 'Grilled chicken breast',
  food_bank_id: 'chicken_breast_grilled_v1',
  quantity: 200,
  unit: 'g',
  nutrition: { /* all 24 fields */ },
  notes: 'Post-workout meal'
});

// Get today's totals
const totals = await githubIntegration.getTodaysTotals();
console.log(`Today: ${totals.energy_kcal} kcal, ${totals.protein_g}g protein`);
```

## Setup (One-Time)

1. **Create GitHub Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Generate new token (classic)
   - Scopes: `repo` (full control)
   - Copy token

2. **Configure Environment:**
   ```bash
   # In .env file
   GITHUB_TOKEN=ghp_your_token_here
   GITHUB_OWNER=tmustier
   GITHUB_REPO=nutrition-tracking
   GITHUB_BRANCH=daily-logs
   ```

3. **Test Installation:**
   ```bash
   npm install
   node test/test-github-integration.js
   node test/verify-module.js
   ```

## Core Methods

### `getCurrentDate()`
```javascript
const date = githubIntegration.getCurrentDate();
// => "2025-11-04"
```

### `getLogFilePath(date?)`
```javascript
const path = githubIntegration.getLogFilePath();
// => "data/logs/2025-11/04.yaml"
```

### `appendLogEntry(nutritionData, timestamp?)`
```javascript
const result = await githubIntegration.appendLogEntry({
  name: 'Salmon poke bowl',
  food_bank_id: 'salmon_poke_v2',
  quantity: 1,
  unit: 'portion',
  nutrition: {
    energy_kcal: 520,
    protein_g: 38,
    fat_g: 22,
    // ... (all 24 fields required)
  }
});
// => { success: true, commit_sha: '...', commit_url: '...' }
```

### `getTodaysTotals(date?)`
```javascript
const totals = await githubIntegration.getTodaysTotals();
// => {
//   date: '2025-11-04',
//   entries: 3,
//   items: 5,
//   energy_kcal: 2340.5,
//   protein_g: 165.2,
//   ...
// }
```

## Required Nutrition Fields (24 Total)

```javascript
nutrition: {
  energy_kcal: 0,        // Calories
  protein_g: 0,          // Protein (g)
  fat_g: 0,              // Total fat (g)
  sat_fat_g: 0,          // Saturated fat (g)
  mufa_g: 0,             // Monounsaturated fat (g)
  pufa_g: 0,             // Polyunsaturated fat (g)
  trans_fat_g: 0,        // Trans fat (g)
  cholesterol_mg: 0,     // Cholesterol (mg)
  carbs_total_g: 0,      // Total carbs (g)
  polyols_g: 0,          // Sugar alcohols (g)
  carbs_available_g: 0,  // Available carbs (g)
  sugar_g: 0,            // Sugars (g)
  fiber_total_g: 0,      // Total fiber (g)
  fiber_soluble_g: 0,    // Soluble fiber (g)
  fiber_insoluble_g: 0,  // Insoluble fiber (g)
  sodium_mg: 0,          // Sodium (mg)
  potassium_mg: 0,       // Potassium (mg)
  iodine_ug: 0,          // Iodine (µg)
  magnesium_mg: 0,       // Magnesium (mg)
  calcium_mg: 0,         // Calcium (mg)
  iron_mg: 0,            // Iron (mg)
  zinc_mg: 0,            // Zinc (mg)
  vitamin_c_mg: 0,       // Vitamin C (mg)
  manganese_mg: 0,       // Manganese (mg)
}
```

**Note:** All fields must be present. Use `0` for unknown values (no nulls allowed).

## Common Patterns

### Log with Custom Timestamp
```javascript
const timestamp = new Date('2025-11-04T12:30:00Z').toISOString();
await githubIntegration.appendLogEntry(nutritionData, timestamp);
```

### Check Progress Against Targets
```javascript
const totals = await githubIntegration.getTodaysTotals();
const targets = { energy_kcal: 2500, protein_g: 170 };
const remaining = {
  energy_kcal: Math.max(0, targets.energy_kcal - totals.energy_kcal),
  protein_g: Math.max(0, targets.protein_g - totals.protein_g),
};
console.log(`Still need: ${remaining.energy_kcal} kcal, ${remaining.protein_g}g protein`);
```

### Get Historical Data
```javascript
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const date = yesterday.toISOString().split('T')[0];
const totals = await githubIntegration.getTodaysTotals(date);
```

## Error Handling

```javascript
try {
  await githubIntegration.appendLogEntry(nutritionData);
} catch (error) {
  if (error.message.includes('authentication')) {
    // Invalid or expired GitHub token
  } else if (error.message.includes('not found')) {
    // Repository doesn't exist or no access
  } else if (error.message.includes('conflict')) {
    // File was modified by another process - retry
  } else {
    // Other error - check error.message
  }
}
```

## File Structure

Logs are stored as:
```
data/logs/
├── 2025-10/
│   ├── 30.yaml
│   └── 31.yaml
└── 2025-11/
    ├── 01.yaml
    ├── 02.yaml
    ├── 03.yaml
    └── 04.yaml
```

Each file contains:
```yaml
date: 2025-11-04
day_type: rest  # or 'training'
entries:
  - timestamp: "2025-11-04T08:15:00Z"
    items:
      - name: "Food name"
        food_bank_id: "food_id_v1"
        quantity: 1
        unit: "portion"
        nutrition:
          energy_kcal: 520
          # ... all 24 fields
    notes: "Optional context"
```

## Branch Strategy

- **Commits go to:** `daily-logs` branch
- **Do NOT commit to:** `main` branch
- **Automated workflow:** Creates PR and merges to main at 4am UTC daily
- **Commit message format:** `chore: Log food entry - {food name}`

## Testing

```bash
# Run basic tests (no API calls)
node test/test-github-integration.js

# Verify module structure
node test/verify-module.js

# Check syntax
node -c src/github-integration.js
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| "GitHub authentication failed" | Check `GITHUB_TOKEN` in .env |
| "Repository not found" | Verify `GITHUB_OWNER` and `GITHUB_REPO` |
| "Missing nutrition fields" | Ensure all 24 fields are present |
| "Commit conflict" | File was modified - retry the operation |

## Performance

- **API calls per log:** 2 (1 GET + 1 PUT)
- **Rate limit:** 5,000 requests/hour
- **Max logs/hour:** ~2,500
- **Typical entry size:** ~500 bytes
- **Daily file size:** ~10 KB (20 entries)

## Full Documentation

- **API Reference:** [src/github-integration.README.md](src/github-integration.README.md)
- **Implementation Details:** [IMPLEMENTATION-SUMMARY.md](IMPLEMENTATION-SUMMARY.md)
- **Schema Spec:** `/Users/thomasmustier/nutrition-tracking/data/logs/SCHEMA.md`
- **Skill Guide:** `/Users/thomasmustier/nutrition-tracking/SKILL.md`

## Example: Complete Meal Log

```javascript
const githubIntegration = require('./src/github-integration');

async function logBreakfast() {
  try {
    // Log the meal
    const result = await githubIntegration.appendLogEntry({
      name: 'Chilli Poached Eggs',
      food_bank_id: 'chilli_poached_eggs_leto_v2',
      quantity: 1,
      unit: 'portion',
      nutrition: {
        energy_kcal: 597.4,
        protein_g: 30.4,
        fat_g: 34.2,
        sat_fat_g: 10.5,
        mufa_g: 16.8,
        pufa_g: 4.3,
        trans_fat_g: 0.1,
        cholesterol_mg: 398,
        carbs_total_g: 43.7,
        polyols_g: 0.0,
        carbs_available_g: 40.3,
        sugar_g: 5.2,
        fiber_total_g: 6.8,
        fiber_soluble_g: 0,
        fiber_insoluble_g: 0,
        sodium_mg: 1543,
        potassium_mg: 730,
        iodine_ug: 0,
        magnesium_mg: 85,
        calcium_mg: 180,
        iron_mg: 3.2,
        zinc_mg: 2.1,
        vitamin_c_mg: 12,
        manganese_mg: 0,
      },
      notes: 'Breakfast at L\'ETO'
    });

    console.log('✓ Logged successfully');
    console.log(`  Commit: ${result.commit_sha}`);
    console.log(`  URL: ${result.commit_url}`);

    // Get updated totals
    const totals = await githubIntegration.getTodaysTotals();
    console.log(`\n📊 Today's totals:`);
    console.log(`  ${totals.energy_kcal} kcal`);
    console.log(`  ${totals.protein_g}g protein`);
    console.log(`  ${totals.entries} meals logged`);

  } catch (error) {
    console.error('✗ Failed:', error.message);
  }
}

logBreakfast();
```

---

**Ready to use!** See full documentation for advanced usage.
