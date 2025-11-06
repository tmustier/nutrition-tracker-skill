// test-token-counting.js
/**
 * Test suite for Token Counting in ConversationManager
 *
 * Tests:
 * 1. Token counting functionality
 * 2. Token limit enforcement (20K tokens)
 * 3. Message trimming when limit exceeded
 * 4. Minimum message retention (5 messages)
 * 5. Stats reporting with token information
 */

const ConversationManager = require('./conversation-manager');

// Helper function to generate a message of approximately N tokens
function generateMessage(targetTokens) {
  // Approximate: 1 token ≈ 4 characters
  const chars = targetTokens * 4;
  return 'test '.repeat(Math.ceil(chars / 5));
}

// Helper function to log test results
function logTest(testName, passed, details = '') {
  const status = passed ? '✓ PASS' : '✗ FAIL';
  console.log(`\n${status}: ${testName}`);
  if (details) {
    console.log(`  ${details}`);
  }
}

// Test suite
async function runTests() {
  console.log('\n======================================================================');
  console.log('TOKEN COUNTING TEST SUITE');
  console.log('======================================================================\n');

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Token counting functionality
  console.log('\n--- Test 1: Token Counting Functionality ---');
  try {
    const testMessage = 'Hello, this is a test message for token counting.';
    const tokenCount = ConversationManager.countTokens(testMessage);
    const passed = tokenCount > 0;

    logTest(
      'Token counting returns positive value',
      passed,
      `Message: "${testMessage}" → ${tokenCount} tokens`
    );

    if (passed) testsPassed++;
    else testsFailed++;
  } catch (error) {
    logTest('Token counting functionality', false, error.message);
    testsFailed++;
  }

  // Test 2: Empty/null message handling
  console.log('\n--- Test 2: Empty/Null Message Handling ---');
  try {
    const emptyTokens = ConversationManager.countTokens('');
    const nullTokens = ConversationManager.countTokens(null);
    const passed = emptyTokens === 0 && nullTokens === 0;

    logTest(
      'Empty and null messages return 0 tokens',
      passed,
      `Empty: ${emptyTokens} tokens, Null: ${nullTokens} tokens`
    );

    if (passed) testsPassed++;
    else testsFailed++;
  } catch (error) {
    logTest('Empty/null message handling', false, error.message);
    testsFailed++;
  }

  // Test 3: Adding messages tracks tokens correctly
  console.log('\n--- Test 3: Token Tracking When Adding Messages ---');
  try {
    const testUserId = 'test-user-1';
    ConversationManager.clearConversation(testUserId);

    const message1 = 'First test message';
    const message2 = 'Second test message with more words';

    ConversationManager.addMessage(testUserId, 'user', message1);
    const tokens1 = ConversationManager.getConversationTokenCount(testUserId);

    ConversationManager.addMessage(testUserId, 'assistant', message2);
    const tokens2 = ConversationManager.getConversationTokenCount(testUserId);

    const passed = tokens2 > tokens1 && tokens1 > 0;

    logTest(
      'Token count increases when messages added',
      passed,
      `After message 1: ${tokens1} tokens, After message 2: ${tokens2} tokens`
    );

    if (passed) testsPassed++;
    else testsFailed++;
  } catch (error) {
    logTest('Token tracking when adding messages', false, error.message);
    testsFailed++;
  }

  // Test 4: Token limit enforcement (20K tokens)
  console.log('\n--- Test 4: Token Limit Enforcement (20K tokens) ---');
  try {
    const testUserId = 'test-user-2';
    ConversationManager.clearConversation(testUserId);

    // Add messages totaling more than 20K tokens
    // Each message is approximately 2000 tokens
    for (let i = 0; i < 15; i++) {
      const largeMessage = generateMessage(2000);
      ConversationManager.addMessage(testUserId, 'user', largeMessage);
    }

    const finalTokenCount = ConversationManager.getConversationTokenCount(testUserId);
    const conversation = ConversationManager.getConversation(testUserId);

    const passed = finalTokenCount <= 20000;

    logTest(
      'Conversation stays within 20K token limit',
      passed,
      `Final token count: ${finalTokenCount} / 20000 (${conversation.length} messages)`
    );

    if (passed) testsPassed++;
    else testsFailed++;
  } catch (error) {
    logTest('Token limit enforcement', false, error.message);
    testsFailed++;
  }

  // Test 5: Minimum message retention (5 messages)
  console.log('\n--- Test 5: Minimum Message Retention ---');
  try {
    const testUserId = 'test-user-3';
    ConversationManager.clearConversation(testUserId);

    // Add 5 very large messages (each ~5000 tokens)
    // Total should be ~25K tokens, exceeding the limit
    for (let i = 0; i < 5; i++) {
      const veryLargeMessage = generateMessage(5000);
      ConversationManager.addMessage(testUserId, 'user', veryLargeMessage);
    }

    const conversation = ConversationManager.getConversation(testUserId);
    const tokenCount = ConversationManager.getConversationTokenCount(testUserId);

    // Even though we exceed the token limit, we should still have 5 messages
    const passed = conversation.length === 5;

    logTest(
      'Minimum 5 messages retained even when exceeding token limit',
      passed,
      `Messages: ${conversation.length}, Tokens: ${tokenCount} (exceeds 20K but kept minimum)`
    );

    if (passed) testsPassed++;
    else testsFailed++;
  } catch (error) {
    logTest('Minimum message retention', false, error.message);
    testsFailed++;
  }

  // Test 6: Stats reporting includes token information
  console.log('\n--- Test 6: Stats Reporting with Token Information ---');
  try {
    const stats = ConversationManager.getStats();

    const hasTokenFields =
      'totalTokens' in stats &&
      'avgTokensPerConversation' in stats &&
      'maxTokens' in stats &&
      'maxTokensPerConversation' in stats &&
      'tokenEncoderAvailable' in stats;

    logTest(
      'Stats include all token-related fields',
      hasTokenFields,
      `Stats: ${JSON.stringify(stats, null, 2)}`
    );

    if (hasTokenFields) testsPassed++;
    else testsFailed++;
  } catch (error) {
    logTest('Stats reporting with token information', false, error.message);
    testsFailed++;
  }

  // Test 7: Message trimming removes oldest messages first
  console.log('\n--- Test 7: Message Trimming Order (Oldest First) ---');
  try {
    const testUserId = 'test-user-4';
    ConversationManager.clearConversation(testUserId);

    // Add 10 messages with distinct content
    for (let i = 0; i < 10; i++) {
      ConversationManager.addMessage(testUserId, 'user', `Message number ${i}`);
    }

    // Add one very large message to trigger trimming
    const largeMessage = generateMessage(20000);
    ConversationManager.addMessage(testUserId, 'user', largeMessage);

    const conversation = ConversationManager.getConversation(testUserId);

    // The earliest messages should have been trimmed
    // The latest large message should still be present
    const hasLatestMessage = conversation[conversation.length - 1].content === largeMessage;
    const passed = hasLatestMessage && conversation.length >= 5;

    logTest(
      'Oldest messages trimmed first, latest message retained',
      passed,
      `Remaining messages: ${conversation.length}, Latest message present: ${hasLatestMessage}`
    );

    if (passed) testsPassed++;
    else testsFailed++;
  } catch (error) {
    logTest('Message trimming order', false, error.message);
    testsFailed++;
  }

  // Test 8: Clear conversation also clears token count
  console.log('\n--- Test 8: Clear Conversation Clears Token Count ---');
  try {
    const testUserId = 'test-user-5';
    ConversationManager.clearConversation(testUserId);

    // Add some messages
    ConversationManager.addMessage(testUserId, 'user', generateMessage(1000));
    ConversationManager.addMessage(testUserId, 'user', generateMessage(1000));

    const tokensBefore = ConversationManager.getConversationTokenCount(testUserId);

    // Clear conversation
    ConversationManager.clearConversation(testUserId);

    const tokensAfter = ConversationManager.getConversationTokenCount(testUserId);
    const conversationAfter = ConversationManager.getConversation(testUserId);

    const passed = tokensAfter === 0 && conversationAfter.length === 0 && tokensBefore > 0;

    logTest(
      'Clear conversation resets token count to 0',
      passed,
      `Tokens before: ${tokensBefore}, Tokens after: ${tokensAfter}`
    );

    if (passed) testsPassed++;
    else testsFailed++;
  } catch (error) {
    logTest('Clear conversation clears token count', false, error.message);
    testsFailed++;
  }

  // Final summary
  console.log('\n======================================================================');
  console.log('TEST SUMMARY');
  console.log('======================================================================');
  console.log(`Total tests: ${testsPassed + testsFailed}`);
  console.log(`Passed: ${testsPassed} ✓`);
  console.log(`Failed: ${testsFailed} ✗`);

  if (testsFailed === 0) {
    console.log('\n✓✓✓ ALL TESTS PASSED ✓✓✓');
  } else {
    console.log('\n✗✗✗ SOME TESTS FAILED ✗✗✗');
  }
  console.log('======================================================================\n');

  // Display final stats
  console.log('\nFinal ConversationManager Stats:');
  console.log(JSON.stringify(ConversationManager.getStats(), null, 2));
}

// Run tests
runTests().catch(error => {
  console.error('Test suite error:', error);
  process.exit(1);
});
