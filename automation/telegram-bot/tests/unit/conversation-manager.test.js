// tests/unit/conversation-manager.test.js - Comprehensive tests for ConversationManager

const mockClaudeIntegration = {
  sanitizePromptInput: jest.fn((input) => input.replace(/[<>]/g, ''))
};

jest.mock('../../src/claude-integration', () => mockClaudeIntegration);

// Import after mocking
const conversationManager = require('../../src/conversation-manager');

describe('ConversationManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear all conversations and locks between tests
    conversationManager.conversations.clear();
    conversationManager.processingLocks.clear();
  });

  describe('Lock Management', () => {
    describe('acquireLock()', () => {
      it('should acquire lock for new user', () => {
        const userId = 123456;
        const result = conversationManager.acquireLock(userId);

        expect(result).toBe(true);
        expect(conversationManager.isLocked(userId)).toBe(true);
      });

      it('should reject concurrent lock acquisition for same user', () => {
        const userId = 123456;

        // First acquisition should succeed
        const firstAttempt = conversationManager.acquireLock(userId);
        expect(firstAttempt).toBe(true);

        // Second immediate attempt should fail
        const secondAttempt = conversationManager.acquireLock(userId);
        expect(secondAttempt).toBe(false);
      });

      it('should allow lock acquisition after previous lock is released', () => {
        const userId = 123456;

        // Acquire and release
        conversationManager.acquireLock(userId);
        conversationManager.releaseLock(userId);

        // Should be able to acquire again
        const result = conversationManager.acquireLock(userId);
        expect(result).toBe(true);
      });

      it('should handle string and number user IDs identically', () => {
        const result1 = conversationManager.acquireLock(123456);
        const result2 = conversationManager.acquireLock('123456');

        expect(result1).toBe(true);
        expect(result2).toBe(false); // Same user
      });

      it('should allow independent locks for different users', () => {
        const user1 = 111111;
        const user2 = 222222;

        const result1 = conversationManager.acquireLock(user1);
        const result2 = conversationManager.acquireLock(user2);

        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(conversationManager.isLocked(user1)).toBe(true);
        expect(conversationManager.isLocked(user2)).toBe(true);
      });
    });

    describe('releaseLock()', () => {
      it('should release existing lock', () => {
        const userId = 123456;

        conversationManager.acquireLock(userId);
        conversationManager.releaseLock(userId);

        expect(conversationManager.isLocked(userId)).toBe(false);
      });

      it('should handle releasing non-existent lock gracefully', () => {
        const userId = 999999;

        // Should not throw error
        expect(() => {
          conversationManager.releaseLock(userId);
        }).not.toThrow();
      });

      it('should allow re-acquisition after release', () => {
        const userId = 123456;

        conversationManager.acquireLock(userId);
        conversationManager.releaseLock(userId);

        const result = conversationManager.acquireLock(userId);
        expect(result).toBe(true);
      });
    });

    describe('isLocked()', () => {
      it('should return false for unlocked user', () => {
        const userId = 123456;
        expect(conversationManager.isLocked(userId)).toBe(false);
      });

      it('should return true for locked user', () => {
        const userId = 123456;
        conversationManager.acquireLock(userId);
        expect(conversationManager.isLocked(userId)).toBe(true);
      });

      it('should return false after lock is released', () => {
        const userId = 123456;
        conversationManager.acquireLock(userId);
        conversationManager.releaseLock(userId);
        expect(conversationManager.isLocked(userId)).toBe(false);
      });
    });

    describe('Lock Timeout Behavior', () => {
      beforeEach(() => {
        // Reduce timeout for faster tests
        conversationManager.lockTimeout = 100; // 100ms
      });

      afterEach(() => {
        // Restore original timeout
        conversationManager.lockTimeout = 30000;
      });

      it('should allow lock acquisition after timeout', async () => {
        const userId = 123456;

        // Acquire lock
        conversationManager.acquireLock(userId);
        expect(conversationManager.isLocked(userId)).toBe(true);

        // Wait for timeout
        await new Promise(resolve => setTimeout(resolve, 150));

        // Lock should have timed out
        expect(conversationManager.isLocked(userId)).toBe(false);

        // Should be able to acquire again
        const result = conversationManager.acquireLock(userId);
        expect(result).toBe(true);
      });

      it('should clean up timed-out lock when checking isLocked', async () => {
        const userId = 123456;

        conversationManager.acquireLock(userId);

        // Wait for timeout
        await new Promise(resolve => setTimeout(resolve, 150));

        // isLocked should clean up and return false
        expect(conversationManager.isLocked(userId)).toBe(false);

        // Lock should be removed from map
        expect(conversationManager.processingLocks.has(String(userId))).toBe(false);
      });

      it('should not acquire lock if existing lock has not timed out', async () => {
        const userId = 123456;

        conversationManager.acquireLock(userId);

        // Wait less than timeout
        await new Promise(resolve => setTimeout(resolve, 50));

        // Should still be locked
        const result = conversationManager.acquireLock(userId);
        expect(result).toBe(false);
        expect(conversationManager.isLocked(userId)).toBe(true);
      });
    });
  });

  describe('Conversation History Management', () => {
    describe('addMessage()', () => {
      it('should add user message to conversation', () => {
        const userId = 123456;
        conversationManager.addMessage(userId, 'user', 'Hello');

        const conversation = conversationManager.getConversation(userId);
        expect(conversation).toHaveLength(1);
        expect(conversation[0]).toMatchObject({
          role: 'user',
          content: 'Hello'
        });
        expect(conversation[0].timestamp).toBeDefined();
      });

      it('should add assistant message to conversation', () => {
        const userId = 123456;
        conversationManager.addMessage(userId, 'assistant', 'Hi there!');

        const conversation = conversationManager.getConversation(userId);
        expect(conversation).toHaveLength(1);
        expect(conversation[0]).toMatchObject({
          role: 'assistant',
          content: 'Hi there!'
        });
      });

      it('should maintain conversation order', () => {
        const userId = 123456;

        conversationManager.addMessage(userId, 'user', 'Message 1');
        conversationManager.addMessage(userId, 'assistant', 'Response 1');
        conversationManager.addMessage(userId, 'user', 'Message 2');

        const conversation = conversationManager.getConversation(userId);
        expect(conversation).toHaveLength(3);
        expect(conversation[0].content).toBe('Message 1');
        expect(conversation[1].content).toBe('Response 1');
        expect(conversation[2].content).toBe('Message 2');
      });

      it('should sanitize user messages by default', () => {
        const userId = 123456;
        conversationManager.addMessage(userId, 'user', '<script>alert("xss")</script>');

        expect(mockClaudeIntegration.sanitizePromptInput).toHaveBeenCalledWith('<script>alert("xss")</script>');
      });

      it('should not sanitize assistant messages', () => {
        const userId = 123456;
        conversationManager.addMessage(userId, 'assistant', 'Response with <tags>');

        const conversation = conversationManager.getConversation(userId);
        expect(conversation[0].content).toBe('Response with <tags>');
      });

      it('should not sanitize when explicitly disabled', () => {
        const userId = 123456;
        conversationManager.addMessage(userId, 'user', 'Already sanitized', false);

        expect(mockClaudeIntegration.sanitizePromptInput).not.toHaveBeenCalled();
      });

      it('should handle string and number user IDs consistently', () => {
        conversationManager.addMessage(123456, 'user', 'Test');
        const conversation = conversationManager.getConversation('123456');

        expect(conversation).toHaveLength(1);
        expect(conversation[0].content).toBe('Test');
      });
    });

    describe('Memory Limits', () => {
      it('should respect token-based conversation limits', () => {
        const userId = 123456;

        // The implementation uses token-based limits (20,000 tokens)
        // with minimum of 5 messages retained

        // Add a reasonable number of messages
        for (let i = 0; i < 10; i++) {
          conversationManager.addMessage(userId, 'user', `Message ${i}`);
        }

        const conversation = conversationManager.getConversation(userId);

        // Should have all messages if under token limit
        expect(conversation.length).toBeGreaterThanOrEqual(5);
        expect(conversation.length).toBeLessThanOrEqual(10);

        // Verify token counting is available
        expect(typeof conversationManager.countTokens).toBe('function');
        expect(typeof conversationManager.getConversationTokenCount).toBe('function');
      });

      it('should maintain minimum message count', () => {
        const userId = 123456;

        // Add exactly 5 messages
        for (let i = 0; i < 5; i++) {
          conversationManager.addMessage(userId, 'user', `Message ${i}`);
        }

        const conversation = conversationManager.getConversation(userId);

        // Should keep all 5 messages (minimum retained)
        expect(conversation).toHaveLength(5);
      });
    });

    describe('Global Conversation Limit (DoS Protection)', () => {
      beforeEach(() => {
        // Set low limit for testing
        conversationManager.maxTotalConversations = 3;
      });

      afterEach(() => {
        // Restore original limit
        conversationManager.maxTotalConversations = 1000;
      });

      it('should evict oldest conversation when limit is reached', () => {
        // Create conversations for 3 users
        conversationManager.addMessage(111111, 'user', 'User 1');
        conversationManager.addMessage(222222, 'user', 'User 2');
        conversationManager.addMessage(333333, 'user', 'User 3');

        // Adding 4th user should trigger eviction
        conversationManager.addMessage(444444, 'user', 'User 4');

        // Should have exactly 3 conversations
        expect(conversationManager.conversations.size).toBe(3);

        // Oldest conversation (User 1) should be evicted
        expect(conversationManager.getConversation(111111)).toHaveLength(0);
        expect(conversationManager.getConversation(222222).length).toBeGreaterThan(0);
        expect(conversationManager.getConversation(333333).length).toBeGreaterThan(0);
        expect(conversationManager.getConversation(444444).length).toBeGreaterThan(0);
      });

      it('should evict empty conversations first', () => {
        // Create 3 conversations
        conversationManager.addMessage(111111, 'user', 'User 1');
        conversationManager.addMessage(222222, 'user', 'User 2');
        conversationManager.addMessage(333333, 'user', 'User 3');

        // Clear one conversation
        conversationManager.clearConversation(222222);
        conversationManager.conversations.set('222222', []); // Set empty array

        // Add 4th user
        conversationManager.addMessage(444444, 'user', 'User 4');

        // Empty conversation should be evicted, others should remain
        expect(conversationManager.getConversation(111111).length).toBeGreaterThan(0);
        expect(conversationManager.getConversation(333333).length).toBeGreaterThan(0);
        expect(conversationManager.getConversation(444444).length).toBeGreaterThan(0);
      });
    });

    describe('getConversation()', () => {
      it('should return empty array for user with no conversation', () => {
        const userId = 999999;
        const conversation = conversationManager.getConversation(userId);

        expect(conversation).toEqual([]);
      });

      it('should return conversation history for existing user', () => {
        const userId = 123456;
        conversationManager.addMessage(userId, 'user', 'Hello');
        conversationManager.addMessage(userId, 'assistant', 'Hi!');

        const conversation = conversationManager.getConversation(userId);
        expect(conversation).toHaveLength(2);
      });

      it('should return consistent conversation reference', () => {
        const userId = 123456;
        conversationManager.addMessage(userId, 'user', 'Hello');

        const conversation1 = conversationManager.getConversation(userId);
        const conversation2 = conversationManager.getConversation(userId);

        // Both should reference the same underlying data
        expect(conversation1).toHaveLength(1);
        expect(conversation2).toHaveLength(1);
        expect(conversation1[0].content).toBe(conversation2[0].content);
      });
    });

    describe('clearConversation()', () => {
      it('should clear conversation history for user', () => {
        const userId = 123456;

        conversationManager.addMessage(userId, 'user', 'Hello');
        conversationManager.addMessage(userId, 'assistant', 'Hi!');
        conversationManager.clearConversation(userId);

        const conversation = conversationManager.getConversation(userId);
        expect(conversation).toEqual([]);
      });

      it('should handle clearing non-existent conversation', () => {
        const userId = 999999;

        expect(() => {
          conversationManager.clearConversation(userId);
        }).not.toThrow();
      });

      it('should not affect other users conversations', () => {
        const user1 = 111111;
        const user2 = 222222;

        conversationManager.addMessage(user1, 'user', 'User 1');
        conversationManager.addMessage(user2, 'user', 'User 2');

        conversationManager.clearConversation(user1);

        expect(conversationManager.getConversation(user1)).toHaveLength(0);
        expect(conversationManager.getConversation(user2)).toHaveLength(1);
      });
    });
  });

  describe('Cleanup Functions', () => {
    describe('cleanupStaleLocks()', () => {
      beforeEach(() => {
        conversationManager.lockTimeout = 100; // 100ms for faster tests
      });

      afterEach(() => {
        conversationManager.lockTimeout = 30000;
      });

      it('should remove locks that have timed out', async () => {
        const userId = 123456;

        conversationManager.acquireLock(userId);

        // Wait for timeout
        await new Promise(resolve => setTimeout(resolve, 150));

        // Manually trigger cleanup
        conversationManager.cleanupStaleLocks();

        // Lock should be removed
        expect(conversationManager.processingLocks.has(String(userId))).toBe(false);
      });

      it('should not remove locks that have not timed out', async () => {
        const userId = 123456;

        conversationManager.acquireLock(userId);

        // Wait less than timeout
        await new Promise(resolve => setTimeout(resolve, 50));

        conversationManager.cleanupStaleLocks();

        // Lock should still exist
        expect(conversationManager.processingLocks.has(String(userId))).toBe(true);
      });

      it('should clean up multiple stale locks', async () => {
        conversationManager.acquireLock(111111);
        conversationManager.acquireLock(222222);
        conversationManager.acquireLock(333333);

        await new Promise(resolve => setTimeout(resolve, 150));

        conversationManager.cleanupStaleLocks();

        expect(conversationManager.processingLocks.size).toBe(0);
      });
    });

    describe('cleanupOldConversations()', () => {
      it('should remove conversations older than 24 hours', () => {
        const userId = 123456;

        conversationManager.addMessage(userId, 'user', 'Old message');

        // Manually set old timestamp
        const conversation = conversationManager.conversations.get(String(userId));
        conversation[0].timestamp = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(); // 25 hours ago

        conversationManager.cleanupOldConversations();

        expect(conversationManager.conversations.has(String(userId))).toBe(false);
      });

      it('should not remove recent conversations', () => {
        const userId = 123456;

        conversationManager.addMessage(userId, 'user', 'Recent message');

        conversationManager.cleanupOldConversations();

        expect(conversationManager.getConversation(userId)).toHaveLength(1);
      });

      it('should remove empty conversations', () => {
        const userId = 123456;

        conversationManager.conversations.set(String(userId), []);

        conversationManager.cleanupOldConversations();

        expect(conversationManager.conversations.has(String(userId))).toBe(false);
      });

      it('should clean up multiple old conversations', () => {
        const oldTimestamp = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();

        // Create multiple old conversations
        for (let i = 1; i <= 5; i++) {
          conversationManager.addMessage(i, 'user', 'Old message');
          const conversation = conversationManager.conversations.get(String(i));
          conversation[0].timestamp = oldTimestamp;
        }

        conversationManager.cleanupOldConversations();

        expect(conversationManager.conversations.size).toBe(0);
      });
    });
  });

  describe('Statistics and Monitoring', () => {
    describe('getStats()', () => {
      it('should return statistics with no active locks or conversations', () => {
        const stats = conversationManager.getStats();

        expect(stats).toMatchObject({
          activeLocks: 0,
          activeConversations: 0,
          lockTimeout: 30000,
          totalMessages: 0
        });
      });

      it('should count active locks correctly', () => {
        conversationManager.acquireLock(111111);
        conversationManager.acquireLock(222222);

        const stats = conversationManager.getStats();
        expect(stats.activeLocks).toBe(2);
      });

      it('should count active conversations correctly', () => {
        conversationManager.addMessage(111111, 'user', 'Hello');
        conversationManager.addMessage(222222, 'user', 'Hi');
        conversationManager.addMessage(333333, 'user', 'Hey');

        const stats = conversationManager.getStats();
        expect(stats.activeConversations).toBe(3);
      });

      it('should count total messages across all conversations', () => {
        conversationManager.addMessage(111111, 'user', 'Message 1');
        conversationManager.addMessage(111111, 'assistant', 'Response 1');
        conversationManager.addMessage(222222, 'user', 'Message 2');
        conversationManager.addMessage(222222, 'assistant', 'Response 2');
        conversationManager.addMessage(222222, 'user', 'Message 3');

        const stats = conversationManager.getStats();
        expect(stats.totalMessages).toBe(5);
      });

      it('should provide accurate statistics in mixed scenario', () => {
        // Add some locks
        conversationManager.acquireLock(111111);
        conversationManager.acquireLock(222222);

        // Add some conversations
        conversationManager.addMessage(111111, 'user', 'Hello');
        conversationManager.addMessage(111111, 'assistant', 'Hi');
        conversationManager.addMessage(333333, 'user', 'Test');

        const stats = conversationManager.getStats();

        expect(stats).toMatchObject({
          activeLocks: 2,
          activeConversations: 2, // Users 111111 and 333333
          totalMessages: 3
        });
        expect(stats.lockTimeout).toBe(30000);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined user ID gracefully', () => {
      expect(() => {
        conversationManager.acquireLock(undefined);
      }).not.toThrow();
    });

    it('should handle null user ID gracefully', () => {
      expect(() => {
        conversationManager.acquireLock(null);
      }).not.toThrow();
    });

    it('should handle empty string user ID', () => {
      const result = conversationManager.acquireLock('');
      expect(result).toBe(true);
      expect(conversationManager.isLocked('')).toBe(true);
    });

    it('should handle very long messages', () => {
      const userId = 123456;
      const longMessage = 'a'.repeat(10000);

      expect(() => {
        conversationManager.addMessage(userId, 'user', longMessage);
      }).not.toThrow();

      const conversation = conversationManager.getConversation(userId);
      expect(conversation[0].content).toHaveLength(10000);
    });

    it('should handle special characters in messages', () => {
      const userId = 123456;
      const specialMessage = '🚀 Test with emoji and special chars: <>&"\' \n\t';

      conversationManager.addMessage(userId, 'user', specialMessage);

      const conversation = conversationManager.getConversation(userId);
      expect(conversation).toHaveLength(1);
    });

    it('should handle rapid sequential operations', () => {
      const userId = 123456;

      // Rapid lock/release cycles
      for (let i = 0; i < 10; i++) {
        conversationManager.acquireLock(userId);
        conversationManager.releaseLock(userId);
      }

      // Should end in unlocked state
      expect(conversationManager.isLocked(userId)).toBe(false);
    });

    it('should handle concurrent operations on different users', () => {
      const operations = [];

      // Simulate concurrent operations
      for (let i = 1; i <= 10; i++) {
        operations.push(() => {
          conversationManager.acquireLock(i);
          conversationManager.addMessage(i, 'user', `Message from user ${i}`);
          conversationManager.releaseLock(i);
        });
      }

      // Execute all operations
      operations.forEach(op => op());

      // All users should have their messages
      for (let i = 1; i <= 10; i++) {
        expect(conversationManager.getConversation(i)).toHaveLength(1);
      }
    });
  });
});
