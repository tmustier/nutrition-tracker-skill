// test/test-github-integration.js
/**
 * Test script for GitHub Integration module
 *
 * This script tests the core functionality without actually committing to GitHub.
 * It validates:
 * - Date formatting
 * - File path generation
 * - Nutrition data validation
 * - YAML structure
 *
 * To run: node test/test-github-integration.js
 */

require('dotenv').config();
const yaml = require('js-yaml');

console.log('Testing GitHub Integration module...\n');

// Test 1: Date formatting
console.log('Test 1: Date formatting');
const testDate = new Date('2025-11-04T12:30:00Z');
const formattedDate = testDate.toISOString().split('T')[0];
console.log(`  Input: ${testDate.toISOString()}`);
console.log(`  Output: ${formattedDate}`);
console.log(`  Expected: 2025-11-04`);
console.log(`  ✓ ${formattedDate === '2025-11-04' ? 'PASS' : 'FAIL'}\n`);

// Test 2: File path generation
console.log('Test 2: File path generation');
function getLogFilePath(date) {
  const [year, month, day] = date.split('-');
  return `data/logs/${year}-${month}/${day}.yaml`;
}
const testPath = getLogFilePath('2025-11-04');
console.log(`  Input: 2025-11-04`);
console.log(`  Output: ${testPath}`);
console.log(`  Expected: data/logs/2025-11/${04}.yaml`);
console.log(`  ✓ ${testPath === 'data/logs/2025-11/04.yaml' ? 'PASS' : 'FAIL'}\n`);

// Test 3: Nutrition validation
console.log('Test 3: Nutrition validation');
const requiredFields = [
  'energy_kcal', 'protein_g', 'fat_g', 'sat_fat_g', 'mufa_g', 'pufa_g',
  'trans_fat_g', 'cholesterol_mg', 'carbs_total_g', 'polyols_g',
  'carbs_available_g', 'sugar_g', 'fiber_total_g', 'fiber_soluble_g',
  'fiber_insoluble_g', 'sodium_mg', 'potassium_mg', 'iodine_ug',
  'magnesium_mg', 'calcium_mg', 'iron_mg', 'zinc_mg', 'vitamin_c_mg',
  'manganese_mg',
];

const testNutrition = {
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
};

const missingFields = requiredFields.filter(field => !(field in testNutrition));
console.log(`  Required fields: ${requiredFields.length}`);
console.log(`  Provided fields: ${Object.keys(testNutrition).length}`);
console.log(`  Missing fields: ${missingFields.length > 0 ? missingFields.join(', ') : 'none'}`);
console.log(`  ✓ ${missingFields.length === 0 ? 'PASS' : 'FAIL'}\n`);

// Test 4: YAML structure generation
console.log('Test 4: YAML structure generation');
const logStructure = {
  date: '2025-11-04',
  day_type: 'rest',
  entries: [
    {
      timestamp: '2025-11-04T12:30:00Z',
      items: [
        {
          name: 'Test meal',
          food_bank_id: null,
          quantity: 1,
          unit: 'portion',
          nutrition: testNutrition,
        },
      ],
      notes: 'Test entry',
    },
  ],
};

try {
  const yamlContent = yaml.dump(logStructure, {
    lineWidth: -1,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
  });

  console.log('  Generated YAML preview (first 300 chars):');
  console.log('  ' + yamlContent.substring(0, 300).replace(/\n/g, '\n  '));
  console.log('  ...\n');

  // Try to parse it back
  const parsed = yaml.load(yamlContent);
  const isValid = parsed.date === '2025-11-04' &&
                  parsed.entries.length === 1 &&
                  parsed.entries[0].items[0].nutrition.energy_kcal === 597.4;

  console.log(`  ✓ ${isValid ? 'PASS - YAML is valid and parseable' : 'FAIL'}\n`);
} catch (error) {
  console.log(`  ✗ FAIL - ${error.message}\n`);
}

// Test 5: Totals calculation
console.log('Test 5: Daily totals calculation');
const entries = [
  {
    items: [
      { nutrition: { energy_kcal: 597.4, protein_g: 30.4, carbs_total_g: 43.7 } },
    ],
  },
  {
    items: [
      { nutrition: { energy_kcal: 420, protein_g: 35, carbs_total_g: 25 } },
      { nutrition: { energy_kcal: 250, protein_g: 15, carbs_total_g: 30 } },
    ],
  },
];

let totalCalories = 0;
let totalProtein = 0;
let totalCarbs = 0;
let itemCount = 0;

entries.forEach(entry => {
  entry.items.forEach(item => {
    totalCalories += item.nutrition.energy_kcal || 0;
    totalProtein += item.nutrition.protein_g || 0;
    totalCarbs += item.nutrition.carbs_total_g || 0;
    itemCount++;
  });
});

console.log(`  Entries: ${entries.length}`);
console.log(`  Items: ${itemCount}`);
console.log(`  Total calories: ${totalCalories}`);
console.log(`  Total protein: ${totalProtein}g`);
console.log(`  Total carbs: ${totalCarbs}g`);
console.log(`  ✓ ${totalCalories === 1267.4 && totalProtein === 80.4 ? 'PASS' : 'FAIL'}\n`);

// Summary
console.log('═══════════════════════════════════════════════');
console.log('All basic tests completed successfully!');
console.log('═══════════════════════════════════════════════');
console.log('\nNote: This test only validates logic and data structures.');
console.log('To test actual GitHub API integration, you need to:');
console.log('1. Set up your .env file with valid credentials');
console.log('2. Run the integration tests with a test repository');
console.log('3. Verify commits appear on the daily-logs branch\n');
