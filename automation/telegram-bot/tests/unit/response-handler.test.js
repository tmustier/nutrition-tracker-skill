// tests/unit/response-handler.test.js - Comprehensive tests for Response Handler

const {
  ResponseType,
  detectResponseType,
  extractJSON,
  extractConversationalText,
  formatResponse,
  detectIntent,
  isClarification,
  isQuestion,
  isFoodLogging
} = require('../../src/response-handler');

describe('Response Handler', () => {
  describe('Response Type Detection', () => {
    describe('detectResponseType()', () => {
      it('should detect pure nutrition data response', () => {
        const response = `\`\`\`json
{
  "name": "Chicken Breast",
  "energy_kcal": 165
}
\`\`\``;

        const result = detectResponseType(response);

        expect(result.type).toBe(ResponseType.NUTRITION_DATA);
        expect(result.hasJSON).toBe(true);
        expect(result.hasText).toBe(false);
        expect(result.confidence).toBe(1.0);
      });

      it('should detect mixed response (text + JSON)', () => {
        const response = `I found the nutrition data for you. Here are the details:

\`\`\`json
{
  "name": "Chicken Breast",
  "energy_kcal": 165
}
\`\`\``;

        const result = detectResponseType(response);

        expect(result.type).toBe(ResponseType.MIXED);
        expect(result.hasJSON).toBe(true);
        expect(result.hasText).toBe(true);
        expect(result.confidence).toBe(1.0);
      });

      it('should detect conversational response with question', () => {
        const response = 'Could you clarify the portion size?';

        const result = detectResponseType(response);

        expect(result.type).toBe(ResponseType.CONVERSATIONAL);
        expect(result.hasJSON).toBe(false);
        expect(result.hasText).toBe(true);
        expect(result.confidence).toBe(0.9);
      });

      it('should detect conversational response without obvious pattern', () => {
        const response = 'I understand you want to log your meal.';

        const result = detectResponseType(response);

        expect(result.type).toBe(ResponseType.CONVERSATIONAL);
        expect(result.hasJSON).toBe(false);
        expect(result.hasText).toBe(true);
        expect(result.confidence).toBe(0.7);
      });

      it('should detect error for null response', () => {
        const result = detectResponseType(null);

        expect(result.type).toBe(ResponseType.ERROR);
        expect(result.hasJSON).toBe(false);
        expect(result.hasText).toBe(false);
      });

      it('should detect error for undefined response', () => {
        const result = detectResponseType(undefined);

        expect(result.type).toBe(ResponseType.ERROR);
      });

      it('should detect error for non-string response', () => {
        const result = detectResponseType(12345);

        expect(result.type).toBe(ResponseType.ERROR);
      });

      it('should handle empty string as error', () => {
        const result = detectResponseType('');

        // Empty string is treated as error since it's not a valid response
        expect(result.type).toBe(ResponseType.ERROR);
      });

      it('should distinguish between brief intro and substantial text', () => {
        const briefResponse = `Here:
\`\`\`json
{"name": "Test"}
\`\`\``;

        const substantialResponse = `I found comprehensive nutrition information for your meal. The data includes all macros and micronutrients.
\`\`\`json
{"name": "Test"}
\`\`\``;

        expect(detectResponseType(briefResponse).type).toBe(ResponseType.NUTRITION_DATA);
        expect(detectResponseType(substantialResponse).type).toBe(ResponseType.MIXED);
      });

      it('should handle multiple JSON blocks', () => {
        const response = `First item:
\`\`\`json
{"name": "Item 1"}
\`\`\`
Second item:
\`\`\`json
{"name": "Item 2"}
\`\`\``;

        const result = detectResponseType(response);

        expect(result.type).toBe(ResponseType.MIXED);
        expect(result.hasJSON).toBe(true);
      });

      it('should recognize conversational patterns', () => {
        const patterns = [
          'Could you clarify the portion?',
          'What type of chicken did you have?',
          'Which brand was it?',
          'Can you provide more details?',
          "I'm not sure about the quantity.",
          'Please specify the cooking method.'
        ];

        patterns.forEach(pattern => {
          const result = detectResponseType(pattern);
          expect(result.type).toBe(ResponseType.CONVERSATIONAL);
          expect(result.confidence).toBeGreaterThanOrEqual(0.7);
        });
      });
    });
  });

  describe('JSON Extraction', () => {
    describe('extractJSON()', () => {
      it('should extract valid JSON from code block', () => {
        const response = `\`\`\`json
{
  "name": "Chicken Breast",
  "energy_kcal": 165,
  "protein_g": 31.0
}
\`\`\``;

        const result = extractJSON(response);

        expect(result).toEqual({
          name: 'Chicken Breast',
          energy_kcal: 165,
          protein_g: 31.0
        });
      });

      it('should return null for response without JSON', () => {
        const response = 'Just plain text without JSON';

        const result = extractJSON(response);

        expect(result).toBeNull();
      });

      it('should return null for malformed JSON', () => {
        const response = `\`\`\`json
{
  "name": "Test",
  "invalid":
}
\`\`\``;

        const result = extractJSON(response);

        expect(result).toBeNull();
      });

      it('should handle JSON with nested objects', () => {
        const response = `\`\`\`json
{
  "name": "Meal",
  "nutrition": {
    "macros": {
      "protein": 25
    }
  }
}
\`\`\``;

        const result = extractJSON(response);

        expect(result).toMatchObject({
          name: 'Meal',
          nutrition: {
            macros: {
              protein: 25
            }
          }
        });
      });

      it('should handle JSON arrays', () => {
        const response = `\`\`\`json
[
  {"name": "Item 1"},
  {"name": "Item 2"}
]
\`\`\``;

        const result = extractJSON(response);

        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
      });

      it('should extract first JSON block if multiple exist', () => {
        const response = `\`\`\`json
{"name": "First"}
\`\`\`
Some text
\`\`\`json
{"name": "Second"}
\`\`\``;

        const result = extractJSON(response);

        expect(result).toEqual({ name: 'First' });
      });

      it('should handle JSON with special characters', () => {
        const response = `\`\`\`json
{
  "name": "Chicken (grilled)",
  "notes": "Contains: eggs, milk"
}
\`\`\``;

        const result = extractJSON(response);

        expect(result).toMatchObject({
          name: 'Chicken (grilled)',
          notes: 'Contains: eggs, milk'
        });
      });

      it('should handle JSON with unicode characters', () => {
        const response = `\`\`\`json
{
  "name": "Café au lait ☕",
  "emoji": "🍕"
}
\`\`\``;

        const result = extractJSON(response);

        expect(result.name).toBe('Café au lait ☕');
        expect(result.emoji).toBe('🍕');
      });

      it('should return null for empty JSON block', () => {
        const response = `\`\`\`json
\`\`\``;

        const result = extractJSON(response);

        expect(result).toBeNull();
      });
    });
  });

  describe('Conversational Text Extraction', () => {
    describe('extractConversationalText()', () => {
      it('should extract text excluding JSON blocks', () => {
        const response = `Here are the details:
\`\`\`json
{"name": "Test"}
\`\`\`
Hope this helps!`;

        const result = extractConversationalText(response);

        expect(result).toContain('Here are the details');
        expect(result).toContain('Hope this helps');
        expect(result).not.toContain('json');
        expect(result).not.toContain('Test');
      });

      it('should remove all code blocks', () => {
        const response = `Text before
\`\`\`json
{"json": "block"}
\`\`\`
Text middle
\`\`\`
code block
\`\`\`
Text after`;

        const result = extractConversationalText(response);

        expect(result).toContain('Text before');
        expect(result).toContain('Text middle');
        expect(result).toContain('Text after');
        expect(result).not.toContain('json');
        expect(result).not.toContain('code block');
      });

      it('should return empty string for null input', () => {
        const result = extractConversationalText(null);
        expect(result).toBe('');
      });

      it('should return empty string for undefined input', () => {
        const result = extractConversationalText(undefined);
        expect(result).toBe('');
      });

      it('should handle response with only JSON', () => {
        const response = `\`\`\`json
{"name": "Test"}
\`\`\``;

        const result = extractConversationalText(response);

        expect(result).toBe('');
      });

      it('should preserve line breaks in text', () => {
        const response = `Line 1
Line 2
Line 3`;

        const result = extractConversationalText(response);

        expect(result).toContain('Line 1');
        expect(result).toContain('Line 2');
        expect(result).toContain('Line 3');
      });

      it('should trim whitespace', () => {
        const response = `   Text with spaces   `;

        const result = extractConversationalText(response);

        expect(result).toBe('Text with spaces');
      });
    });
  });

  describe('Response Formatting', () => {
    describe('formatResponse()', () => {
      it('should format nutrition data response', () => {
        const detection = {
          type: ResponseType.NUTRITION_DATA,
          hasJSON: true,
          hasText: false
        };
        const nutritionData = { name: 'Chicken', energy_kcal: 165 };

        const result = formatResponse(detection, '', nutritionData);

        expect(result).toMatchObject({
          shouldLog: true,
          shouldRespond: true,
          telegramMessage: null,
          data: nutritionData,
          conversationalText: null
        });
      });

      it('should format mixed response', () => {
        const detection = {
          type: ResponseType.MIXED,
          hasJSON: true,
          hasText: true
        };
        const responseText = `Here's the data:
\`\`\`json
{"name": "Test"}
\`\`\``;
        const nutritionData = { name: 'Test' };

        const result = formatResponse(detection, responseText, nutritionData);

        expect(result).toMatchObject({
          shouldLog: true,
          shouldRespond: true,
          data: nutritionData
        });
        expect(result.conversationalText).toContain("Here's the data");
        expect(result.conversationalText).not.toContain('json');
      });

      it('should format conversational response', () => {
        const detection = {
          type: ResponseType.CONVERSATIONAL,
          hasJSON: false,
          hasText: true
        };
        const responseText = 'Could you clarify the portion size?';

        const result = formatResponse(detection, responseText);

        expect(result).toMatchObject({
          shouldLog: false,
          shouldRespond: true,
          telegramMessage: responseText,
          data: null,
          conversationalText: responseText
        });
      });

      it('should format error response', () => {
        const detection = {
          type: ResponseType.ERROR,
          hasJSON: false,
          hasText: false
        };

        const result = formatResponse(detection, '');

        expect(result).toMatchObject({
          shouldLog: false,
          shouldRespond: true,
          data: null,
          conversationalText: null
        });
        expect(result.telegramMessage).toContain('invalid response');
      });

      it('should handle unknown response type', () => {
        const detection = {
          type: 'UNKNOWN_TYPE',
          hasJSON: false,
          hasText: false
        };

        const result = formatResponse(detection, '');

        expect(result).toMatchObject({
          shouldLog: false,
          shouldRespond: true,
          data: null
        });
        expect(result.telegramMessage).toContain('went wrong');
      });
    });
  });

  describe('Intent Detection', () => {
    describe('isClarification()', () => {
      it('should detect clarification starting with "no"', () => {
        expect(isClarification('No, I meant 200g')).toBe(true);
        expect(isClarification('no, that was wrong')).toBe(true);
      });

      it('should detect clarification starting with "actually"', () => {
        expect(isClarification('Actually, it was grilled')).toBe(true);
        expect(isClarification('actually, I had 2 eggs')).toBe(true);
      });

      it('should detect clarification starting with "wait"', () => {
        expect(isClarification('Wait, I made a mistake')).toBe(true);
        expect(isClarification('wait, let me correct that')).toBe(true);
      });

      it('should detect correction patterns', () => {
        expect(isClarification('Correction: it was 300g')).toBe(true);
        expect(isClarification('I meant 2 portions')).toBe(true);
        expect(isClarification('Sorry, I misspoke')).toBe(true);
        expect(isClarification('Sorry that was wrong')).toBe(true);
      });

      it('should detect quantity corrections', () => {
        expect(isClarification('not 100g, 200g')).toBe(true);
        expect(isClarification('Not 2 eggs, just 1')).toBe(true);
      });

      it('should detect replacement patterns', () => {
        expect(isClarification('make that 3 portions')).toBe(true);
        expect(isClarification('change that to 150g')).toBe(true);
        expect(isClarification('change it to grilled')).toBe(true);
        expect(isClarification('instead of fried, grilled')).toBe(true);
      });

      it('should not detect regular statements as clarifications', () => {
        expect(isClarification('I had chicken for lunch')).toBe(false);
        expect(isClarification('200g chicken breast')).toBe(false);
        expect(isClarification('What should I eat?')).toBe(false);
      });
    });

    describe('isQuestion()', () => {
      it('should detect questions starting with question words', () => {
        expect(isQuestion('What should I eat?')).toBe(true);
        expect(isQuestion('When did you eat lunch?')).toBe(true);
        expect(isQuestion('Where can I find nutrition info?')).toBe(true);
        expect(isQuestion('Who made this meal?')).toBe(true);
        expect(isQuestion('Why is protein important?')).toBe(true);
        expect(isQuestion('How much protein do I need?')).toBe(true);
      });

      it('should detect questions starting with auxiliary verbs', () => {
        expect(isQuestion('Did you log breakfast?')).toBe(true);
        expect(isQuestion('Do you have nutrition data?')).toBe(true);
        expect(isQuestion('Does this have gluten?')).toBe(true);
        expect(isQuestion('Can you help me?')).toBe(true);
        expect(isQuestion('Could you clarify?')).toBe(true);
        expect(isQuestion('Should I eat more protein?')).toBe(true);
        expect(isQuestion('Would you recommend this?')).toBe(true);
        expect(isQuestion('Will this help me?')).toBe(true);
      });

      it('should detect questions ending with question mark', () => {
        expect(isQuestion('This is a question?')).toBe(true);
        expect(isQuestion('Really?')).toBe(true);
      });

      it('should detect specific question patterns', () => {
        expect(isQuestion('How much protein is in this?')).toBe(true);
        expect(isQuestion('How many calories?')).toBe(true);
        expect(isQuestion('What is the serving size?')).toBe(true);
        expect(isQuestion('Tell me about chicken')).toBe(true);
        expect(isQuestion('Show me the nutrition data')).toBe(true);
      });

      it('should not detect statements as questions', () => {
        expect(isQuestion('I had chicken for lunch')).toBe(false);
        expect(isQuestion('200g grilled chicken')).toBe(false);
        expect(isQuestion('No, that was wrong')).toBe(false);
      });
    });

    describe('isFoodLogging()', () => {
      it('should detect food logging with quantity prefix', () => {
        expect(isFoodLogging('200g chicken breast')).toBe(true);
        expect(isFoodLogging('2 eggs')).toBe(true);
        expect(isFoodLogging('150 grams rice')).toBe(true);
        expect(isFoodLogging('3 kg potatoes')).toBe(true);
        expect(isFoodLogging('100 ml milk')).toBe(true);
        expect(isFoodLogging('2 tbsp olive oil')).toBe(true);
      });

      it('should detect food logging with action verbs', () => {
        expect(isFoodLogging('I ate chicken')).toBe(true);
        expect(isFoodLogging('Had eggs for breakfast')).toBe(true);
        expect(isFoodLogging('Just eating some rice')).toBe(true);
        expect(isFoodLogging('Consumed a protein shake')).toBe(true);
        expect(isFoodLogging('Drank orange juice')).toBe(true);
      });

      it('should detect food logging with meal types', () => {
        expect(isFoodLogging('For breakfast I had oats')).toBe(true);
        expect(isFoodLogging('My lunch was salad')).toBe(true);
        expect(isFoodLogging('Dinner tonight: pasta')).toBe(true);
        expect(isFoodLogging('Quick snack: apple')).toBe(true);
        expect(isFoodLogging('This meal contains chicken')).toBe(true);
      });

      it('should detect food logging with common food items', () => {
        expect(isFoodLogging('Chicken breast with vegetables')).toBe(true);
        expect(isFoodLogging('Grilled fish')).toBe(true);
        expect(isFoodLogging('Brown rice and beans')).toBe(true);
        expect(isFoodLogging('Whole wheat bread')).toBe(true);
        expect(isFoodLogging('Two eggs scrambled')).toBe(true);
        // Note: Some items like 'Greek yogurt' may not match patterns without context
        expect(isFoodLogging('Had Greek yogurt')).toBe(true); // With action verb
        expect(isFoodLogging('Cheddar cheese sandwich')).toBe(true);
        expect(isFoodLogging('Mixed vegetables')).toBe(true);
        expect(isFoodLogging('Fresh fruit salad')).toBe(true);
      });

      it('should detect food logging with articles', () => {
        expect(isFoodLogging('A chicken breast')).toBe(true);
        expect(isFoodLogging('An apple')).toBe(true);
        expect(isFoodLogging('The pasta I ordered')).toBe(true);
        expect(isFoodLogging('Some rice')).toBe(true);
      });

      it('should not detect questions as food logging', () => {
        expect(isFoodLogging('What should I eat?')).toBe(false);
        expect(isFoodLogging('How many calories?')).toBe(false);
      });
    });

    describe('detectIntent()', () => {
      it('should detect clarification intent with conversation history', () => {
        const intent = detectIntent('No, I meant 200g', true);
        expect(intent).toBe('clarification');
      });

      it('should not detect clarification without conversation history', () => {
        const intent = detectIntent('No, I meant 200g', false);
        expect(intent).not.toBe('clarification');
      });

      it('should detect question intent', () => {
        const intent = detectIntent('What should I eat?', false);
        expect(intent).toBe('question');
      });

      it('should detect food logging intent', () => {
        const intent = detectIntent('200g chicken breast', false);
        expect(intent).toBe('food_logging');
      });

      it('should default to food logging for ambiguous input', () => {
        const intent = detectIntent('Something ambiguous', false);
        expect(intent).toBe('food_logging');
      });

      it('should handle null message', () => {
        const intent = detectIntent(null, false);
        expect(intent).toBe('unknown');
      });

      it('should handle undefined message', () => {
        const intent = detectIntent(undefined, false);
        expect(intent).toBe('unknown');
      });

      it('should handle non-string message', () => {
        const intent = detectIntent(12345, false);
        expect(intent).toBe('unknown');
      });

      it('should handle empty string', () => {
        const intent = detectIntent('', false);
        expect(intent).toBe('unknown'); // Empty string returns unknown
      });

      it('should prioritize clarification over other intents when history exists', () => {
        const intent = detectIntent('Actually, what I meant to ask is...', true);
        expect(intent).toBe('clarification');
      });

      it('should prioritize question over food logging', () => {
        const intent = detectIntent('Did you have chicken?', false);
        expect(intent).toBe('question');
      });

      it('should handle complex mixed messages', () => {
        // Question format but food-like content
        const intent1 = detectIntent('Can I log 200g chicken?', false);
        expect(intent1).toBe('question'); // Question takes precedence

        // Clarification in active conversation
        const intent2 = detectIntent('Wait, I ate 200g chicken', true);
        expect(intent2).toBe('clarification');

        // Pure food logging
        const intent3 = detectIntent('Grilled chicken with rice', false);
        expect(intent3).toBe('food_logging');
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle very long responses', () => {
      const longText = 'a'.repeat(10000);
      const response = `${longText}\n\`\`\`json\n{"test": "data"}\n\`\`\``;

      const detection = detectResponseType(response);
      expect(detection.type).toBe(ResponseType.MIXED);

      const json = extractJSON(response);
      expect(json).toEqual({ test: 'data' });

      const text = extractConversationalText(response);
      expect(text).toHaveLength(10000);
    });

    it('should handle responses with no newlines', () => {
      const response = '```json{"name":"Test"}```';
      const json = extractJSON(response);

      // This should fail because format requires newlines
      expect(json).toBeNull();
    });

    it('should handle nested code blocks', () => {
      const response = `\`\`\`json
{
  "code": "\`\`\`nested\`\`\`"
}
\`\`\``;

      const json = extractJSON(response);
      expect(json).toBeTruthy();
    });

    it('should handle special regex characters in messages', () => {
      const messages = [
        'I had [200g] chicken',
        'Cost: $10.99',
        'Rating: 5/5',
        'Email: test@example.com'
      ];

      messages.forEach(msg => {
        expect(() => detectIntent(msg, false)).not.toThrow();
      });
    });

    it('should handle unicode in intent detection', () => {
      expect(isFoodLogging('🍕 Pizza')).toBe(false); // No clear pattern
      expect(isQuestion('¿Qué comiste?')).toBe(true); // Spanish question
    });

    it('should handle multi-line messages', () => {
      const message = `I had chicken
and also rice
with vegetables`;

      const intent = detectIntent(message, false);
      expect(intent).toBe('food_logging');
    });

    it('should handle messages with only whitespace', () => {
      const intent = detectIntent('   \n\t  ', false);
      expect(intent).toBe('food_logging'); // Default
    });
  });

  describe('ResponseType Constants', () => {
    it('should export all response types', () => {
      expect(ResponseType.NUTRITION_DATA).toBe('nutrition_data');
      expect(ResponseType.CONVERSATIONAL).toBe('conversational');
      expect(ResponseType.MIXED).toBe('mixed');
      expect(ResponseType.ERROR).toBe('error');
    });
  });
});
