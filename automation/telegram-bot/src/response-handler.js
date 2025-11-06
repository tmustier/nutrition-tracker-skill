/**
 * Response Type Handler
 *
 * Detects and handles different types of Claude responses:
 * - Nutrition JSON data (should be logged to GitHub)
 * - Conversational responses (clarifications, questions, general chat)
 * - Mixed responses (text + JSON)
 */

/**
 * Response types
 */
const ResponseType = {
  NUTRITION_DATA: 'nutrition_data',
  CONVERSATIONAL: 'conversational',
  MIXED: 'mixed',
  ERROR: 'error'
};

/**
 * Detect the type of Claude's response
 * @param {string} responseText - The full text response from Claude
 * @returns {Object} { type: ResponseType, hasJSON: boolean, hasText: boolean }
 */
function detectResponseType(responseText) {
  if (!responseText || typeof responseText !== 'string') {
    return {
      type: ResponseType.ERROR,
      hasJSON: false,
      hasText: false,
      confidence: 1.0
    };
  }

  // Check for JSON code block
  const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
  const hasJSON = jsonMatch !== null;

  // Check for substantial text outside JSON block
  let textOutsideJSON = responseText;
  if (hasJSON) {
    textOutsideJSON = responseText.replace(/```json\n[\s\S]*?\n```/g, '').trim();
  }

  const hasSubstantialText = textOutsideJSON.length > 20; // More than just a brief intro

  // Classify response type
  if (hasJSON && !hasSubstantialText) {
    return {
      type: ResponseType.NUTRITION_DATA,
      hasJSON: true,
      hasText: false,
      confidence: 1.0
    };
  }

  if (hasJSON && hasSubstantialText) {
    return {
      type: ResponseType.MIXED,
      hasJSON: true,
      hasText: true,
      confidence: 1.0
    };
  }

  // No JSON - check if it looks conversational
  const conversationalPatterns = [
    /\?$/m, // Ends with question
    /could you (clarify|specify|tell me|provide)/i,
    /what (did you|do you|type of|kind of)/i,
    /which (one|item|dish)/i,
    /can you (provide|give|tell)/i,
    /(i need|i\'m not sure|unclear|ambiguous)/i,
    /please (specify|clarify|provide|tell)/i
  ];

  const looksConversational = conversationalPatterns.some(pattern =>
    pattern.test(responseText)
  );

  return {
    type: ResponseType.CONVERSATIONAL,
    hasJSON: false,
    hasText: true,
    confidence: looksConversational ? 0.9 : 0.7
  };
}

/**
 * Extract JSON nutrition data from response
 * @param {string} responseText - The full text response
 * @returns {Object|null} Parsed JSON object or null if not found
 */
function extractJSON(responseText) {
  try {
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch || !jsonMatch[1]) {
      return null;
    }

    return JSON.parse(jsonMatch[1]);
  } catch (error) {
    console.error('Failed to extract JSON from response:', error.message);
    return null;
  }
}

/**
 * Extract conversational text from response (excluding JSON blocks)
 * @param {string} responseText - The full text response
 * @returns {string} Text with JSON blocks removed
 */
function extractConversationalText(responseText) {
  if (!responseText) return '';

  // Remove JSON code blocks
  let text = responseText.replace(/```json\n[\s\S]*?\n```/g, '').trim();

  // Remove any remaining code blocks
  text = text.replace(/```[\s\S]*?```/g, '').trim();

  return text;
}

/**
 * Format a response for Telegram based on its type
 * @param {Object} detection - Result from detectResponseType()
 * @param {string} responseText - Full response text
 * @param {Object|null} nutritionData - Parsed nutrition data (if any)
 * @returns {Object} { shouldLog: boolean, telegramMessage: string, data: Object }
 */
function formatResponse(detection, responseText, nutritionData = null) {
  switch (detection.type) {
    case ResponseType.NUTRITION_DATA:
      // Pure nutrition data - should be logged
      return {
        shouldLog: true,
        shouldRespond: true,
        telegramMessage: null, // Will be generated from nutrition data
        data: nutritionData,
        conversationalText: null
      };

    case ResponseType.MIXED:
      // Both text and data - log the data, respond with text + confirmation
      const conversationalText = extractConversationalText(responseText);
      return {
        shouldLog: true,
        shouldRespond: true,
        telegramMessage: conversationalText, // Will be prepended to nutrition summary
        data: nutritionData,
        conversationalText
      };

    case ResponseType.CONVERSATIONAL:
      // Pure conversation - don't log, just respond
      return {
        shouldLog: false,
        shouldRespond: true,
        telegramMessage: responseText,
        data: null,
        conversationalText: responseText
      };

    case ResponseType.ERROR:
      return {
        shouldLog: false,
        shouldRespond: true,
        telegramMessage: '⚠️ Sorry, I received an invalid response. Please try again.',
        data: null,
        conversationalText: null
      };

    default:
      return {
        shouldLog: false,
        shouldRespond: true,
        telegramMessage: '⚠️ Something went wrong processing the response.',
        data: null,
        conversationalText: null
      };
  }
}

/**
 * Check if a user message looks like a clarification or correction
 * @param {string} message - User's message
 * @returns {boolean}
 */
function isClarification(message) {
  const clarificationPatterns = [
    /^no[,\s]/i,
    /^actually[,\s]/i,
    /^wait[,\s]/i,
    /^correction/i,
    /^i meant/i,
    /^sorry,?\s+(i|that)/i,
    /^not\s+\d+/i, // "not 100g" etc
    /make that/i,
    /change (that|it) to/i,
    /instead of/i
  ];

  return clarificationPatterns.some(pattern => pattern.test(message.trim()));
}

/**
 * Check if a user message looks like a question (not food logging)
 * @param {string} message - User's message
 * @returns {boolean}
 */
function isQuestion(message) {
  const questionPatterns = [
    /^(what|when|where|who|why|how)\s/i,
    /^(did|do|does|can|could|should|would|will)\s/i,
    /\?$/,
    /how (much|many)/i,
    /what (is|are|was|were)/i,
    /tell me (about|what)/i,
    /show me/i
  ];

  return questionPatterns.some(pattern => pattern.test(message.trim()));
}

/**
 * Check if a user message looks like a food logging intent
 * @param {string} message - User's message
 * @returns {boolean}
 */
function isFoodLogging(message) {
  const foodPatterns = [
    /^\d+\s*(g|grams|kg|oz|lb|ml|cup|tbsp|tsp)/i, // Starts with quantity
    /(ate|had|eating|consumed|drank)/i,
    /(breakfast|lunch|dinner|snack|meal)/i,
    /(chicken|beef|fish|rice|pasta|bread|egg|milk|cheese|vegetable|fruit)/i,
    /^(a|an|the|some)\s+/i, // Starts with article
  ];

  return foodPatterns.some(pattern => pattern.test(message.trim()));
}

/**
 * Determine the intent of a user's message
 * @param {string} message - User's message
 * @param {boolean} hasConversationHistory - Whether there's existing conversation
 * @returns {string} Intent: 'food_logging', 'question', 'clarification', 'unknown'
 */
function detectIntent(message, hasConversationHistory = false) {
  if (!message || typeof message !== 'string') {
    return 'unknown';
  }

  const trimmed = message.trim();

  // Check for clarification (only relevant if there's conversation history)
  if (hasConversationHistory && isClarification(trimmed)) {
    return 'clarification';
  }

  // Check for question
  if (isQuestion(trimmed)) {
    return 'question';
  }

  // Check for food logging
  if (isFoodLogging(trimmed)) {
    return 'food_logging';
  }

  // Default to food logging if we're not sure (preserves current behavior)
  return 'food_logging';
}

module.exports = {
  ResponseType,
  detectResponseType,
  extractJSON,
  extractConversationalText,
  formatResponse,
  detectIntent,
  isClarification,
  isQuestion,
  isFoodLogging
};
