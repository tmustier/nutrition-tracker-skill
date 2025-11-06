/**
 * Conversation Memory Manager
 *
 * Manages multi-turn conversation state for the Telegram nutrition bot.
 * Stores conversation history per user with automatic cleanup and token management.
 */

class ConversationManager {
  constructor(config = {}) {
    // Configuration
    this.maxMessagesPerUser = config.maxMessagesPerUser || 20;
    this.maxTokensPerUser = config.maxTokensPerUser || 20000;
    this.conversationTTL = config.conversationTTL || 1800000; // 30 minutes default
    this.cleanupInterval = config.cleanupInterval || 300000; // 5 minutes

    // Storage: userId -> ConversationState
    this.conversations = new Map();

    // Processing locks to prevent race conditions
    this.processingLocks = new Map();

    // Start periodic cleanup
    this.startCleanup();

    console.log('ConversationManager initialized:', {
      maxMessages: this.maxMessagesPerUser,
      maxTokens: this.maxTokensPerUser,
      ttl: `${this.conversationTTL / 1000}s`,
      cleanupInterval: `${this.cleanupInterval / 1000}s`
    });
  }

  /**
   * Get conversation history for a user
   * @param {number|string} userId - Telegram user ID
   * @returns {Array} Array of message objects with role and content
   */
  getHistory(userId) {
    const conversation = this.conversations.get(String(userId));

    if (!conversation) {
      return [];
    }

    // Check if conversation has expired
    if (this.isExpired(conversation)) {
      console.log(`Conversation expired for user ${userId}, clearing`);
      this.clearHistory(userId);
      return [];
    }

    // Update last access time
    conversation.lastAccess = Date.now();

    return conversation.messages;
  }

  /**
   * Add a message to conversation history
   * @param {number|string} userId - Telegram user ID
   * @param {string} role - Message role ('user' or 'assistant')
   * @param {string} content - Message content
   */
  addMessage(userId, role, content) {
    const userIdStr = String(userId);

    // Get or create conversation
    let conversation = this.conversations.get(userIdStr);
    if (!conversation) {
      conversation = {
        userId: userIdStr,
        messages: [],
        createdAt: Date.now(),
        lastAccess: Date.now(),
        tokenCount: 0
      };
      this.conversations.set(userIdStr, conversation);
      console.log(`Created new conversation for user ${userId}`);
    }

    // Add message
    const message = { role, content, timestamp: Date.now() };
    conversation.messages.push(message);
    conversation.lastAccess = Date.now();

    // Estimate token count (rough approximation: 1 token ≈ 4 characters)
    conversation.tokenCount += Math.ceil(content.length / 4);

    console.log(`Added ${role} message to conversation ${userId} (${conversation.messages.length} messages, ~${conversation.tokenCount} tokens)`);

    // Trim if necessary
    this.trimIfNeeded(userIdStr);
  }

  /**
   * Add user message to history
   * @param {number|string} userId - Telegram user ID
   * @param {string} content - Message content
   */
  addUserMessage(userId, content) {
    this.addMessage(userId, 'user', content);
  }

  /**
   * Add assistant message to history
   * @param {number|string} userId - Telegram user ID
   * @param {string} content - Message content
   */
  addAssistantMessage(userId, content) {
    this.addMessage(userId, 'assistant', content);
  }

  /**
   * Clear conversation history for a user
   * @param {number|string} userId - Telegram user ID
   */
  clearHistory(userId) {
    const userIdStr = String(userId);
    const hadConversation = this.conversations.has(userIdStr);
    this.conversations.delete(userIdStr);

    if (hadConversation) {
      console.log(`Cleared conversation for user ${userId}`);
    }

    return hadConversation;
  }

  /**
   * Check if a conversation has expired
   * @param {Object} conversation - Conversation state object
   * @returns {boolean}
   */
  isExpired(conversation) {
    return (Date.now() - conversation.lastAccess) > this.conversationTTL;
  }

  /**
   * Trim conversation history if it exceeds limits
   * @param {string} userId - User ID string
   */
  trimIfNeeded(userId) {
    const conversation = this.conversations.get(userId);
    if (!conversation) return;

    let trimmed = false;

    // Trim by message count
    if (conversation.messages.length > this.maxMessagesPerUser) {
      const excess = conversation.messages.length - this.maxMessagesPerUser;
      conversation.messages = conversation.messages.slice(excess);
      trimmed = true;
      console.log(`Trimmed ${excess} old messages for user ${userId}`);
    }

    // Trim by token count (approximate)
    if (conversation.tokenCount > this.maxTokensPerUser) {
      // Remove oldest messages until under limit
      while (conversation.tokenCount > this.maxTokensPerUser && conversation.messages.length > 2) {
        const removed = conversation.messages.shift();
        conversation.tokenCount -= Math.ceil(removed.content.length / 4);
        trimmed = true;
      }
      console.log(`Trimmed by tokens for user ${userId}, now ~${conversation.tokenCount} tokens`);
    }

    return trimmed;
  }

  /**
   * Acquire a processing lock for a user to prevent race conditions
   * @param {number|string} userId - User ID
   * @returns {boolean} True if lock acquired, false if already locked
   */
  acquireLock(userId) {
    const userIdStr = String(userId);

    if (this.processingLocks.has(userIdStr)) {
      return false;
    }

    this.processingLocks.set(userIdStr, Date.now());
    return true;
  }

  /**
   * Release a processing lock for a user
   * @param {number|string} userId - User ID
   */
  releaseLock(userId) {
    const userIdStr = String(userId);
    this.processingLocks.delete(userIdStr);
  }

  /**
   * Check if a user's messages are currently being processed
   * @param {number|string} userId - User ID
   * @returns {boolean}
   */
  isProcessing(userId) {
    return this.processingLocks.has(String(userId));
  }

  /**
   * Get conversation statistics for a user
   * @param {number|string} userId - User ID
   * @returns {Object|null} Statistics object or null if no conversation
   */
  getStats(userId) {
    const conversation = this.conversations.get(String(userId));

    if (!conversation) {
      return null;
    }

    return {
      messageCount: conversation.messages.length,
      estimatedTokens: conversation.tokenCount,
      age: Date.now() - conversation.createdAt,
      lastActivity: Date.now() - conversation.lastAccess,
      isExpired: this.isExpired(conversation)
    };
  }

  /**
   * Get overall system statistics
   * @returns {Object} System statistics
   */
  getSystemStats() {
    const activeConversations = Array.from(this.conversations.values())
      .filter(conv => !this.isExpired(conv));

    const totalMessages = activeConversations.reduce(
      (sum, conv) => sum + conv.messages.length, 0
    );

    const totalTokens = activeConversations.reduce(
      (sum, conv) => sum + conv.tokenCount, 0
    );

    return {
      activeConversations: activeConversations.length,
      totalConversations: this.conversations.size,
      totalMessages,
      estimatedTotalTokens: totalTokens,
      processingLocks: this.processingLocks.size
    };
  }

  /**
   * Start periodic cleanup of expired conversations
   */
  startCleanup() {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);

    // Don't keep the process alive just for cleanup
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  /**
   * Stop periodic cleanup
   */
  stopCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Clean up expired conversations and stale locks
   */
  cleanup() {
    const now = Date.now();
    let expiredCount = 0;
    let staleLocks = 0;

    // Clean up expired conversations
    for (const [userId, conversation] of this.conversations.entries()) {
      if (this.isExpired(conversation)) {
        this.conversations.delete(userId);
        expiredCount++;
      }
    }

    // Clean up stale processing locks (older than 5 minutes)
    const lockTimeout = 300000; // 5 minutes
    for (const [userId, lockTime] of this.processingLocks.entries()) {
      if (now - lockTime > lockTimeout) {
        this.processingLocks.delete(userId);
        staleLocks++;
      }
    }

    if (expiredCount > 0 || staleLocks > 0) {
      console.log(`Cleanup: removed ${expiredCount} expired conversations, ${staleLocks} stale locks`);
    }
  }

  /**
   * Shutdown the conversation manager gracefully
   */
  shutdown() {
    this.stopCleanup();
    console.log('ConversationManager shutdown complete');
  }
}

module.exports = ConversationManager;
