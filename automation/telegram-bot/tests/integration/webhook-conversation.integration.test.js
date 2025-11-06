// tests/integration/webhook-conversation.integration.test.js
// Integration tests for multi-turn conversation feature

const nock = require('nock');

// Mock config before requiring other modules
const mockConfig = {
  telegram: {
    botToken: 'mock_bot_token',
    allowedUsers: [],
    webhookSecret: null,
  },
  claude: {
    apiKey: 'mock_claude_key',
    model: 'claude-3-sonnet-20240229'
  },
  github: {
    token: 'mock_github_token',
    owner: 'test_owner',
    repo: 'test_repo',
    branch: 'daily-logs'
  },
  usda: {
    apiKey: 'mock_usda_key',
    baseUrl: 'https://api.nal.usda.gov/fdc/v1'
  },
  app: {
    environment: 'test'
  }
};

jest.mock('../../src/config', () => mockConfig);

// Import modules after mocking config
const conversationManager = require('../../src/conversation-manager');
const responseHandler = require('../../src/response-handler');
const { bot } = require('../../src/webhook');

describe('Webhook Conversation Integration', () => {
  let mockCtx;

  beforeEach(() => {
    // Clear conversation manager state
    conversationManager.conversations.clear();
    conversationManager.processingLocks.clear();

    // Reset all mocks
    jest.clearAllMocks();
    nock.cleanAll();

    // Create mock Telegraf context
    mockCtx = {
      from: {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser'
      },
      chat: {
        id: 123456789,
        type: 'private'
      },
      message: {
        message_id: 789,
        text: 'Test message'
      },
      reply: jest.fn().mockResolvedValue({ message_id: 999 }),
      telegram: {
        editMessageText: jest.fn().mockResolvedValue(true)
      }
    };
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Full Conversation Flow', () => {
    it('should handle simple food logging with lock management', async () => {
      const userId = mockCtx.from.id;

      // Verify lock is not acquired initially
      expect(conversationManager.isLocked(userId)).toBe(false);

      // Test lock acquisition (simulating webhook handler behavior)
      const lockAcquired = conversationManager.acquireLock(userId);
      expect(lockAcquired).toBe(true);
      expect(conversationManager.isLocked(userId)).toBe(true);

      // Add messages to conversation (simulating processing)
      conversationManager.addMessage(userId, 'user', '200g chicken breast');
      conversationManager.addMessage(userId, 'assistant', 'Logged successfully');

      // Verify conversation history
      const conversation = conversationManager.getConversation(userId);
      expect(conversation).toHaveLength(2);
      expect(conversation[0].role).toBe('user');
      expect(conversation[1].role).toBe('assistant');

      // Release lock (simulating completion of processing)
      conversationManager.releaseLock(userId);
      expect(conversationManager.isLocked(userId)).toBe(false);
    });

    it('should prevent concurrent processing for same user', async () => {
      const userId = mockCtx.from.id;

      // Acquire lock for first message
      const firstLock = conversationManager.acquireLock(userId);
      expect(firstLock).toBe(true);

      // Try to acquire lock again (simulating concurrent request)
      const secondLock = conversationManager.acquireLock(userId);
      expect(secondLock).toBe(false);

      // Verify user is still locked
      expect(conversationManager.isLocked(userId)).toBe(true);

      // Release first lock
      conversationManager.releaseLock(userId);

      // Now should be able to acquire again
      const thirdLock = conversationManager.acquireLock(userId);
      expect(thirdLock).toBe(true);

      conversationManager.releaseLock(userId);
    });

    it('should handle multi-turn conversation with clarifications', async () => {
      const userId = mockCtx.from.id;

      // Turn 1: Initial unclear message
      conversationManager.addMessage(userId, 'user', 'chicken');

      // Turn 1: Claude asks for clarification
      const clarificationResponse = 'Could you specify the portion size and cooking method?';
      conversationManager.addMessage(userId, 'assistant', clarificationResponse);

      const detection1 = responseHandler.detectResponseType(clarificationResponse);
      expect(detection1.type).toBe(responseHandler.ResponseType.CONVERSATIONAL);

      // Turn 2: User provides clarification
      const clarification = '200g grilled chicken breast';
      conversationManager.addMessage(userId, 'user', clarification);

      const intent = responseHandler.detectIntent(clarification, true);
      expect(intent).toBe('food_logging'); // Should detect as food logging

      // Turn 2: Claude provides data
      const dataResponse = '```json\n{"name": "Grilled Chicken Breast", "quantity": 200, "unit": "g", "energy_kcal": 165}\n```';
      conversationManager.addMessage(userId, 'assistant', dataResponse);

      const detection2 = responseHandler.detectResponseType(dataResponse);
      expect(detection2.type).toBe(responseHandler.ResponseType.NUTRITION_DATA);

      // Verify full conversation history
      const conversation = conversationManager.getConversation(userId);
      expect(conversation).toHaveLength(4);
      expect(conversation[0].content).toBe('chicken');
      expect(conversation[1].content).toBe(clarificationResponse);
      expect(conversation[2].content).toBe(clarification);
      expect(conversation[3].content).toBe(dataResponse);
    });

    it('should handle error recovery mid-conversation', async () => {
      const userId = mockCtx.from.id;

      // Add some conversation history
      conversationManager.addMessage(userId, 'user', 'I had chicken');
      conversationManager.addMessage(userId, 'assistant', 'How much chicken?');

      // Simulate error during processing
      conversationManager.acquireLock(userId);

      // Error occurs, but lock should be released
      conversationManager.releaseLock(userId);

      // Conversation history should be preserved
      const conversation = conversationManager.getConversation(userId);
      expect(conversation).toHaveLength(2);

      // User should be able to continue
      const canContinue = conversationManager.acquireLock(userId);
      expect(canContinue).toBe(true);

      conversationManager.addMessage(userId, 'user', '200g');
      expect(conversationManager.getConversation(userId)).toHaveLength(3);

      conversationManager.releaseLock(userId);
    });

    it('should clear conversation on /clear command', async () => {
      const userId = mockCtx.from.id;

      // Build up conversation
      conversationManager.addMessage(userId, 'user', 'Message 1');
      conversationManager.addMessage(userId, 'assistant', 'Response 1');
      conversationManager.addMessage(userId, 'user', 'Message 2');

      expect(conversationManager.getConversation(userId)).toHaveLength(3);

      // Clear conversation (simulating /clear command)
      conversationManager.clearConversation(userId);

      expect(conversationManager.getConversation(userId)).toHaveLength(0);
    });

    it('should handle /cancel command with lock release', async () => {
      const userId = mockCtx.from.id;

      // Start processing
      conversationManager.acquireLock(userId);
      conversationManager.addMessage(userId, 'user', 'Some message');

      // User sends /cancel
      conversationManager.clearConversation(userId);
      conversationManager.releaseLock(userId);

      // Verify state is clean
      expect(conversationManager.isLocked(userId)).toBe(false);
      expect(conversationManager.getConversation(userId)).toHaveLength(0);
    });
  });

  describe('Response Type Handling Integration', () => {
    it('should correctly route nutrition data responses', async () => {
      const nutritionResponse = '```json\n{"name": "Test", "energy_kcal": 100}\n```';

      const detection = responseHandler.detectResponseType(nutritionResponse);
      expect(detection.type).toBe(responseHandler.ResponseType.NUTRITION_DATA);

      const json = responseHandler.extractJSON(nutritionResponse);
      expect(json).toEqual({ name: 'Test', energy_kcal: 100 });

      const formatted = responseHandler.formatResponse(detection, nutritionResponse, json);
      expect(formatted.shouldLog).toBe(true);
      expect(formatted.shouldRespond).toBe(true);
      expect(formatted.data).toEqual(json);
    });

    it('should correctly route conversational responses', async () => {
      const conversationalResponse = 'Could you tell me the portion size?';

      const detection = responseHandler.detectResponseType(conversationalResponse);
      expect(detection.type).toBe(responseHandler.ResponseType.CONVERSATIONAL);

      const formatted = responseHandler.formatResponse(detection, conversationalResponse);
      expect(formatted.shouldLog).toBe(false);
      expect(formatted.shouldRespond).toBe(true);
      expect(formatted.telegramMessage).toBe(conversationalResponse);
    });

    it('should correctly route mixed responses', async () => {
      const mixedResponse = `I found the nutrition data for you:

\`\`\`json
{"name": "Test", "energy_kcal": 100}
\`\`\``;

      const detection = responseHandler.detectResponseType(mixedResponse);
      expect(detection.type).toBe(responseHandler.ResponseType.MIXED);

      const json = responseHandler.extractJSON(mixedResponse);
      expect(json).toBeTruthy();

      const text = responseHandler.extractConversationalText(mixedResponse);
      expect(text).toContain('I found the nutrition data');

      const formatted = responseHandler.formatResponse(detection, mixedResponse, json);
      expect(formatted.shouldLog).toBe(true);
      expect(formatted.conversationalText).toContain('nutrition data');
    });
  });

  describe('Lock Behavior During Processing', () => {
    it('should maintain lock throughout processing lifecycle', async () => {
      const userId = mockCtx.from.id;

      // Acquire lock at start
      expect(conversationManager.acquireLock(userId)).toBe(true);

      // Add user message
      conversationManager.addMessage(userId, 'user', 'Test message');

      // Lock should still be held
      expect(conversationManager.isLocked(userId)).toBe(true);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 10));

      // Lock should still be held
      expect(conversationManager.isLocked(userId)).toBe(true);

      // Add assistant response
      conversationManager.addMessage(userId, 'assistant', 'Response');

      // Release lock at end
      conversationManager.releaseLock(userId);

      expect(conversationManager.isLocked(userId)).toBe(false);
    });

    it('should reject new requests while processing', async () => {
      const userId = mockCtx.from.id;

      // Start processing first request
      const lock1 = conversationManager.acquireLock(userId);
      expect(lock1).toBe(true);

      // Second request arrives
      const lock2 = conversationManager.acquireLock(userId);
      expect(lock2).toBe(false);

      // Second request should see user is locked
      expect(conversationManager.isLocked(userId)).toBe(true);

      // First request completes
      conversationManager.releaseLock(userId);

      // Now second request can proceed
      const lock3 = conversationManager.acquireLock(userId);
      expect(lock3).toBe(true);

      conversationManager.releaseLock(userId);
    });

    it('should handle lock timeout gracefully', async () => {
      const userId = mockCtx.from.id;

      // Set short timeout for test
      conversationManager.lockTimeout = 100;

      // Acquire lock
      conversationManager.acquireLock(userId);

      // Wait for timeout
      await new Promise(resolve => setTimeout(resolve, 150));

      // Lock should have expired
      expect(conversationManager.isLocked(userId)).toBe(false);

      // Should be able to acquire new lock
      expect(conversationManager.acquireLock(userId)).toBe(true);

      conversationManager.releaseLock(userId);

      // Restore original timeout
      conversationManager.lockTimeout = 30000;
    });
  });

  describe('Conversation History Management', () => {
    it('should maintain conversation history across multiple exchanges', async () => {
      const userId = mockCtx.from.id;

      // Exchange 1
      conversationManager.addMessage(userId, 'user', 'I had chicken');
      conversationManager.addMessage(userId, 'assistant', 'How much?');

      // Exchange 2
      conversationManager.addMessage(userId, 'user', '200g');
      conversationManager.addMessage(userId, 'assistant', 'Logged!');

      // Verify history
      const conversation = conversationManager.getConversation(userId);
      expect(conversation).toHaveLength(4);

      // Verify order
      expect(conversation[0].content).toBe('I had chicken');
      expect(conversation[1].content).toBe('How much?');
      expect(conversation[2].content).toBe('200g');
      expect(conversation[3].content).toBe('Logged!');
    });

    it('should respect token-based memory limits', async () => {
      const userId = mockCtx.from.id;

      // Add messages - with token-based limits, all of these should fit
      for (let i = 0; i < 10; i++) {
        conversationManager.addMessage(userId, 'user', `Message ${i}`);
      }

      const conversation = conversationManager.getConversation(userId);

      // Should have all messages if under token limit
      expect(conversation.length).toBeGreaterThanOrEqual(5); // Minimum retained
      expect(conversation.length).toBeLessThanOrEqual(10); // All messages fit

      // Verify messages are in order
      expect(conversation[0].content).toBe('Message 0');
    });

    it('should isolate conversations between different users', async () => {
      const user1 = 111111;
      const user2 = 222222;

      conversationManager.addMessage(user1, 'user', 'User 1 message');
      conversationManager.addMessage(user2, 'user', 'User 2 message');

      const conv1 = conversationManager.getConversation(user1);
      const conv2 = conversationManager.getConversation(user2);

      expect(conv1).toHaveLength(1);
      expect(conv2).toHaveLength(1);
      expect(conv1[0].content).toBe('User 1 message');
      expect(conv2[0].content).toBe('User 2 message');
    });
  });

  describe('Intent Detection in Conversation Context', () => {
    it('should detect clarification in active conversation', () => {
      const clarifications = [
        'No, I meant 200g',
        'Actually, it was grilled',
        'Wait, I made a mistake',
        'Correction: 300g'
      ];

      clarifications.forEach(msg => {
        const intent = responseHandler.detectIntent(msg, true);
        expect(intent).toBe('clarification');
      });
    });

    it('should not detect clarification without conversation history', () => {
      const intent = responseHandler.detectIntent('No, I meant 200g', false);
      expect(intent).not.toBe('clarification');
    });

    it('should detect question intent', () => {
      const questions = [
        'What should I eat?',
        'How much protein do I need?',
        'Can you help me?'
      ];

      questions.forEach(msg => {
        const intent = responseHandler.detectIntent(msg, false);
        expect(intent).toBe('question');
      });
    });

    it('should detect food logging intent', () => {
      const foodLogs = [
        '200g chicken breast',
        'I ate eggs',
        'For breakfast I had oats'
      ];

      foodLogs.forEach(msg => {
        const intent = responseHandler.detectIntent(msg, false);
        expect(intent).toBe('food_logging');
      });
    });
  });

  describe('Error Scenarios', () => {
    it('should handle concurrent requests gracefully', async () => {
      const userId = mockCtx.from.id;

      // First request acquires lock
      const lock1 = conversationManager.acquireLock(userId);
      expect(lock1).toBe(true);

      // Multiple concurrent requests should all fail
      const concurrentAttempts = [
        conversationManager.acquireLock(userId),
        conversationManager.acquireLock(userId),
        conversationManager.acquireLock(userId)
      ];

      concurrentAttempts.forEach(attempt => {
        expect(attempt).toBe(false);
      });

      // Release and verify state
      conversationManager.releaseLock(userId);
      expect(conversationManager.isLocked(userId)).toBe(false);
    });

    it('should handle malformed responses gracefully', async () => {
      const malformedResponses = [
        null,
        undefined,
        '',
        '```json\n{invalid json}\n```',
        'No JSON here'
      ];

      malformedResponses.forEach(response => {
        const detection = responseHandler.detectResponseType(response);
        expect(detection).toBeDefined();
        expect(detection.type).toBeDefined();
      });
    });

    it('should recover from processing errors', async () => {
      const userId = mockCtx.from.id;

      // Start processing
      conversationManager.acquireLock(userId);
      conversationManager.addMessage(userId, 'user', 'Test');

      // Simulate error - but lock is released in finally block
      conversationManager.releaseLock(userId);

      // Conversation should be preserved
      expect(conversationManager.getConversation(userId)).toHaveLength(1);

      // User should be able to retry
      expect(conversationManager.acquireLock(userId)).toBe(true);
      conversationManager.releaseLock(userId);
    });
  });

  describe('Statistics and Monitoring', () => {
    it('should track statistics correctly during conversation', () => {
      const userId1 = 111111;
      const userId2 = 222222;

      // Create some activity
      conversationManager.acquireLock(userId1);
      conversationManager.addMessage(userId1, 'user', 'Message 1');
      conversationManager.addMessage(userId2, 'user', 'Message 2');

      const stats = conversationManager.getStats();

      expect(stats.activeLocks).toBe(1); // Only user1 is locked
      expect(stats.activeConversations).toBe(2);
      expect(stats.totalMessages).toBe(2);

      conversationManager.releaseLock(userId1);
    });

    it('should update stats after cleanup', async () => {
      const userId = 123456;

      // Set short timeouts for testing
      conversationManager.lockTimeout = 100;

      // Create stale lock
      conversationManager.acquireLock(userId);
      await new Promise(resolve => setTimeout(resolve, 150));

      // Cleanup stale locks
      conversationManager.cleanupStaleLocks();

      const stats = conversationManager.getStats();
      expect(stats.activeLocks).toBe(0);

      // Restore
      conversationManager.lockTimeout = 30000;
    });
  });

  describe('Context Command Integration', () => {
    it('should provide accurate conversation context', () => {
      const userId = 123456;

      conversationManager.addMessage(userId, 'user', 'Test 1');
      conversationManager.addMessage(userId, 'assistant', 'Response 1');
      conversationManager.addMessage(userId, 'user', 'Test 2');

      const conversation = conversationManager.getConversation(userId);
      const stats = conversationManager.getStats();

      expect(conversation.length).toBe(3);
      expect(stats.activeConversations).toBeGreaterThan(0);
      expect(stats.totalMessages).toBeGreaterThan(0);
    });
  });
});
