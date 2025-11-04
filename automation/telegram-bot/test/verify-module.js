// Quick verification that module exports work correctly
// This doesn't test actual GitHub API calls

console.log('Verifying github-integration module...\n');

// Test 1: Check if module can be loaded with missing env vars
console.log('Test 1: Module loading with missing GITHUB_TOKEN');
try {
  delete process.env.GITHUB_TOKEN;
  const gh = require('../src/github-integration');
  console.log('  ✗ FAIL - Should have thrown error for missing token\n');
} catch (error) {
  if (error.message.includes('GitHub token is required')) {
    console.log('  ✓ PASS - Correctly validates missing token\n');
  } else {
    console.log(`  ✗ FAIL - Wrong error: ${error.message}\n`);
  }
}

// Test 2: Check module structure with mock env
console.log('Test 2: Module structure with valid config');
process.env.GITHUB_TOKEN = 'mock_token_for_testing';
process.env.GITHUB_OWNER = 'test_owner';
process.env.GITHUB_REPO = 'test_repo';
process.env.GITHUB_BRANCH = 'test_branch';

// Need to clear require cache to reload module
delete require.cache[require.resolve('../src/github-integration')];
delete require.cache[require.resolve('../src/config')];

const gh = require('../src/github-integration');

console.log('  Module type:', typeof gh);
console.log('  Is instance:', gh.constructor.name === 'GitHubIntegration');

const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(gh))
  .filter(m => m !== 'constructor');
console.log('  Public methods:', methods.join(', '));

const expectedMethods = [
  'getCurrentDate',
  'getLogFilePath',
  'getOrCreateLogFile',
  'appendLogEntry',
  'getTodaysTotals'
];

const hasAllMethods = expectedMethods.every(m => methods.includes(m));
console.log(`  ✓ ${hasAllMethods ? 'PASS - All required methods present' : 'FAIL - Missing methods'}\n`);

// Test 3: Verify method signatures work
console.log('Test 3: Method functionality (without API calls)');

try {
  const date = gh.getCurrentDate();
  console.log(`  getCurrentDate(): ${date}`);
  console.log(`  ✓ Date format looks correct: ${/^\d{4}-\d{2}-\d{2}$/.test(date)}\n`);
} catch (error) {
  console.log(`  ✗ FAIL - ${error.message}\n`);
}

try {
  const path = gh.getLogFilePath('2025-11-04');
  console.log(`  getLogFilePath('2025-11-04'): ${path}`);
  console.log(`  ✓ Path format looks correct: ${path === 'data/logs/2025-11/04.yaml'}\n`);
} catch (error) {
  console.log(`  ✗ FAIL - ${error.message}\n`);
}

console.log('════════════════════════════════════════');
console.log('Module structure verification complete!');
console.log('════════════════════════════════════════\n');
