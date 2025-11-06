// src/conversation-manager.js
/**
 * Conversation Manager for Telegram Bot
 *
 * Handles conversation state and prevents race conditions when users send
 * multiple messages concurrently.
 *
 * CONCURRENCY SAFETY:
 * - Atomic lock acquisition prevents duplicate processing
 * - Per-user locks ensure isolated processing
 * - Automatic lock cleanup prevents memory leaks
 *
 * SECURITY:
 * - All conversation history is sanitized before storage
 * - User isolation prevents cross-contamination
 * - Lock timeout prevents indefinite blocking
 *
 * MEMORY MANAGEMENT:
 * - Token-based conversation limits (20,000 tokens per conversation)
 * - Automatic message trimming when token limit exceeded
 * - Minimum 5 messages retained for context continuity
 * - Per-message token counting for efficient tracking
 */

const claudeIntegration = require('./claude-integration');
const { encoding_for_model } = require('tiktoken');

class ConversationManager {
  constructor() {
    // Per-user processing locks to prevent race conditions
    // Map<userId: string, lockTimestamp: number>
    this.processingLocks = new Map();

    // Conversation history storage (if needed in future)
    // Map<userId: string, messages: Array<{role, content, timestamp, tokens}>>
    this.conversations = new Map();

    // Token count tracking per conversation
    // Map<userId: string, totalTokens: number>
    this.conversationTokens = new Map();

    // Lock timeout configuration (30 seconds max processing time)
    this.lockTimeout = 30000;

    // DoS Protection: Maximum total conversations allowed globally
    this.maxTotalConversations = 1000;

    // Token limit configuration
    this.maxTokensPerConversation = 20000; // 20K tokens per conversation
    this.minMessagesRetained = 5; // Always keep at least 5 messages for context

    // Initialize tiktoken encoder for Claude (using GPT-4's encoding as approximation)
    // cl100k_base is the encoding used by GPT-4, which is similar to Claude's tokenizer
    try {
      this.tokenEncoder = encoding_for_model('gpt-4');
      console.log('[ConversationManager] Token encoder initialized successfully');
    } catch (error) {
      console.error('[ConversationManager] Failed to initialize token encoder:', error.message);
      this.tokenEncoder = null;
    }

    // Start periodic cleanup of stale locks
    this.startLockCleanup();
  }

  /**
   * Acquire processing lock for a user (ATOMIC OPERATION)
   *
   * CRITICAL: This operation is atomic to prevent race conditions.
   * Two concurrent requests for the same user will not both succeed.
   *
   * @param {string|number} userId - Telegram user ID
   * @returns {boolean} True if lock acquired, false if already processing
   */
  acquireLock(userId) {
    const userIdStr = String(userId);
    const now = Date.now();

    // ATOMIC CHECK-AND-SET: Get the current lock timestamp
    const existingLock = this.processingLocks.get(userIdStr);

    // If lock exists and hasn't timed out, deny acquisition
    if (existingLock && (now - existingLock < this.lockTimeout)) {
      console.log(`[ConversationManager] Lock acquisition failed for user ${userIdStr}: already processing`);
      return false;
    }

    // If lock doesn't exist or has timed out, acquire it atomically
    // This is safe because JavaScript is single-threaded; the get() and set()
    // operations cannot be interleaved by another request
    this.processingLocks.set(userIdStr, now);
    console.log(`[ConversationManager] Lock acquired for user ${userIdStr}`);
    return true;
  }

  /**
   * Release processing lock for a user
   *
   * @param {string|number} userId - Telegram user ID
   */
  releaseLock(userId) {
    const userIdStr = String(userId);
    const wasLocked = this.processingLocks.delete(userIdStr);

    if (wasLocked) {
      console.log(`[ConversationManager] Lock released for user ${userIdStr}`);
    } else {
      console.warn(`[ConversationManager] Attempted to release non-existent lock for user ${userIdStr}`);
    }
  }

  /**
   * Check if user has an active processing lock
   *
   * @param {string|number} userId - Telegram user ID
   * @returns {boolean} True if user is currently being processed
   */
  isLocked(userId) {
    const userIdStr = String(userId);
    const lockTimestamp = this.processingLocks.get(userIdStr);

    if (!lockTimestamp) {
      return false;
    }

    // Check if lock has timed out
    const now = Date.now();
    if (now - lockTimestamp >= this.lockTimeout) {
      // Lock has timed out, clean it up
      this.processingLocks.delete(userIdStr);
      console.warn(`[ConversationManager] Lock timeout for user ${userIdStr}, cleaned up stale lock`);
      return false;
    }

    return true;
  }

  /**
   * Count tokens in a text string
   *
   * Uses tiktoken to accurately count tokens similar to how Claude counts them.
   * Falls back to word-based approximation if encoder is not available.
   *
   * @param {string} text - Text to count tokens for
   * @returns {number} Number of tokens
   */
  countTokens(text) {
    if (!text || typeof text !== 'string') {
      return 0;
    }

    // If encoder is available, use tiktoken for accurate counting
    if (this.tokenEncoder) {
      try {
        const tokens = this.tokenEncoder.encode(text);
        return tokens.length;
      } catch (error) {
        console.error('[ConversationManager] Token encoding error:', error.message);
        // Fall through to approximation
      }
    }

    // Fallback: Rough approximation (1 token ≈ 4 characters on average)
    // This is less accurate but better than nothing
    return Math.ceil(text.length / 4);
  }

  /**
   * Get total token count for a conversation
   *
   * @param {string|number} userId - Telegram user ID
   * @returns {number} Total tokens in the conversation
   */
  getConversationTokenCount(userId) {
    const userIdStr = String(userId);
    return this.conversationTokens.get(userIdStr) || 0;
  }

  /**
   * Trim conversation messages to stay within token limit
   *
   * Removes messages from the beginning of the conversation (oldest first)
   * while respecting the minimum message retention policy.
   *
   * @param {string|number} userId - Telegram user ID
   */
  trimConversationByTokens(userId) {
    const userIdStr = String(userId);
    const conversation = this.conversations.get(userIdStr);

    if (!conversation || conversation.length <= this.minMessagesRetained) {
      // Don't trim if we're at or below minimum message count
      return;
    }

    let totalTokens = this.conversationTokens.get(userIdStr) || 0;

    // Keep removing oldest messages until we're under the limit
    // but always preserve at least minMessagesRetained messages
    while (totalTokens > this.maxTokensPerConversation &&
           conversation.length > this.minMessagesRetained) {
      const removedMessage = conversation.shift();
      totalTokens -= (removedMessage.tokens || 0);

      console.log(`[ConversationManager] Trimmed message for user ${userIdStr} ` +
                  `(${removedMessage.tokens} tokens). New total: ${totalTokens} tokens, ` +
                  `${conversation.length} messages`);
    }

    // Update the stored token count
    this.conversationTokens.set(userIdStr, totalTokens);
  }

  /**
   * Add message to conversation history
   *
   * SECURITY: All user messages MUST be sanitized before storing
   * MEMORY: Automatically trims conversation if token limit exceeded
   *
   * @param {string|number} userId - Telegram user ID
   * @param {string} role - Message role ('user' or 'assistant')
   * @param {string} content - Message content (must be sanitized if from user)
   * @param {boolean} sanitize - Whether to sanitize content (default: true for user messages)
   */
  addMessage(userId, role, content, sanitize = true) {
    const userIdStr = String(userId);

    // SECURITY: Sanitize user input to prevent prompt injection
    const finalContent = (role === 'user' && sanitize)
      ? claudeIntegration.sanitizePromptInput(content)
      : content;

    // Count tokens for this message
    const messageTokens = this.countTokens(finalContent);

    // DoS PROTECTION: Check if we've hit the global conversation limit
    if (!this.conversations.has(userIdStr) && this.conversations.size >= this.maxTotalConversations) {
      console.warn(`[ConversationManager] Global conversation limit reached (${this.maxTotalConversations}), evicting oldest conversation`);
      this.evictOldestConversation();
    }

    // Get or create conversation history for this user
    if (!this.conversations.has(userIdStr)) {
      this.conversations.set(userIdStr, []);
      this.conversationTokens.set(userIdStr, 0);
    }

    const conversation = this.conversations.get(userIdStr);

    // Add message with token count
    conversation.push({
      role,
      content: finalContent,
      timestamp: new Date().toISOString(),
      tokens: messageTokens
    });

    // Update total token count
    const currentTokens = this.conversationTokens.get(userIdStr) || 0;
    this.conversationTokens.set(userIdStr, currentTokens + messageTokens);

    console.log(`[ConversationManager] Added ${role} message to conversation for user ${userIdStr} ` +
                `(${messageTokens} tokens, total: ${currentTokens + messageTokens} tokens, ` +
                `${conversation.length} messages)`);

    // Trim conversation if it exceeds token limit
    // This ensures we stay within the 20K token budget
    if (this.conversationTokens.get(userIdStr) > this.maxTokensPerConversation) {
      console.log(`[ConversationManager] Token limit exceeded for user ${userIdStr}, trimming conversation...`);
      this.trimConversationByTokens(userIdStr);
    }
  }

  /**
   * Evict the oldest conversation (LRU eviction)
   * Called when global conversation limit is reached
   */
  evictOldestConversation() {
    let oldestUserId = null;
    let oldestTimestamp = Infinity;

    for (const [userId, messages] of this.conversations) {
      if (messages.length === 0) {
        this.conversations.delete(userId);
        this.conversationTokens.delete(userId); // CRITICAL: Also delete token count to prevent memory leak
        return;
      }

      const lastMessage = messages[messages.length - 1];
      const timestamp = new Date(lastMessage.timestamp).getTime();

      if (timestamp < oldestTimestamp) {
        oldestTimestamp = timestamp;
        oldestUserId = userId;
      }
    }

    if (oldestUserId) {
      this.conversations.delete(oldestUserId);
      this.conversationTokens.delete(oldestUserId); // CRITICAL: Also delete token count to prevent memory leak
      console.log(`[ConversationManager] Evicted oldest conversation for user ${oldestUserId}`);
    }
  }

  /**
   * Get conversation history for a user
   *
   * @param {string|number} userId - Telegram user ID
   * @returns {Array} Array of message objects with {role, content, timestamp}
   */
  getConversation(userId) {
    const userIdStr = String(userId);
    return this.conversations.get(userIdStr) || [];
  }

  /**
   * Clear conversation history for a user
   *
   * @param {string|number} userId - Telegram user ID
   */
  clearConversation(userId) {
    const userIdStr = String(userId);
    this.conversations.delete(userIdStr);
    this.conversationTokens.delete(userIdStr);
    console.log(`[ConversationManager] Cleared conversation history for user ${userIdStr}`);
  }

  /**
   * Start periodic cleanup of stale locks and old conversations
   * Runs every minute to prevent memory leaks
   */
  startLockCleanup() {
    setInterval(() => {
      this.cleanupStaleLocks();
      this.cleanupOldConversations();
    }, 60000); // Every minute
  }

  /**
   * Clean up locks that have timed out
   */
  cleanupStaleLocks() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [userId, lockTimestamp] of this.processingLocks) {
      if (now - lockTimestamp >= this.lockTimeout) {
        this.processingLocks.delete(userId);
        cleanedCount++;
        console.warn(`[ConversationManager] Cleaned up stale lock for user ${userId}`);
      }
    }

    if (cleanedCount > 0) {
      console.log(`[ConversationManager] Cleaned up ${cleanedCount} stale lock(s)`);
    }
  }

  /**
   * Clean up conversations that haven't been active for 24 hours
   */
  cleanupOldConversations() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    let cleanedCount = 0;

    for (const [userId, messages] of this.conversations) {
      if (messages.length === 0) {
        this.conversations.delete(userId);
        this.conversationTokens.delete(userId); // CRITICAL: Also delete token count to prevent memory leak
        cleanedCount++;
        continue;
      }

      // Check timestamp of most recent message
      const lastMessage = messages[messages.length - 1];
      const lastTimestamp = new Date(lastMessage.timestamp).getTime();

      if (now - lastTimestamp >= maxAge) {
        this.conversations.delete(userId);
        this.conversationTokens.delete(userId); // CRITICAL: Also delete token count to prevent memory leak
        cleanedCount++;
        console.log(`[ConversationManager] Cleaned up old conversation for user ${userId}`);
      }
    }

    if (cleanedCount > 0) {
      console.log(`[ConversationManager] Cleaned up ${cleanedCount} old conversation(s)`);
    }
  }

  /**
   * Get manager statistics for monitoring
   *
   * @returns {Object} Statistics about locks, conversations, and token usage
   */
  getStats() {
    const totalMessages = Array.from(this.conversations.values())
      .reduce((sum, messages) => sum + messages.length, 0);

    const totalTokens = Array.from(this.conversationTokens.values())
      .reduce((sum, tokens) => sum + tokens, 0);

    // Calculate average tokens per conversation
    const avgTokensPerConversation = this.conversations.size > 0
      ? Math.round(totalTokens / this.conversations.size)
      : 0;

    // Find max tokens in any single conversation
    const maxTokens = this.conversations.size > 0
      ? Math.max(...Array.from(this.conversationTokens.values()))
      : 0;

    return {
      activeLocks: this.processingLocks.size,
      activeConversations: this.conversations.size,
      lockTimeout: this.lockTimeout,
      totalMessages,
      totalTokens,
      avgTokensPerConversation,
      maxTokens,
      maxTokensPerConversation: this.maxTokensPerConversation,
      minMessagesRetained: this.minMessagesRetained,
      tokenEncoderAvailable: !!this.tokenEncoder
    };
  }
}

// Export singleton instance
module.exports = new ConversationManager();
