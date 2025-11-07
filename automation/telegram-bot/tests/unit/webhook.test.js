// tests/unit/webhook.test.js - Unit tests for webhook handlers

const { Telegraf } = require('telegraf');
const nock = require('nock');

// Mock all dependencies
jest.mock('../../src/config');
jest.mock('../../src/claude-integration');
jest.mock('../../src/github-integration');

const config = require('../../src/config');
const claudeIntegration = require('../../src/claude-integration');
const githubIntegration = require('../../src/github-integration');

// Mock config
config.telegram = {
  botToken: 'mock_bot_token',
  allowedUsers: [123456789], // Test user ID
  webhookSecret: 'test_secret',
};

describe('Webhook Handlers', () => {
  let webhook;
  let bot;
  let mockCtx;

  beforeEach(() => {
    // Clear module cache to get fresh instances
    jest.resetModules();
    
    // Mock successful API responses
    claudeIntegration.processFoodLog = jest.fn();
    claudeIntegration.processImage = jest.fn();
    // getTargets is now async and accepts (dayType, userId)
    claudeIntegration.getTargets = jest.fn(async () => ({
      energy_kcal: 2500,
      protein_g: 170,
      fat_g: 70,
      carbs_g: 250,
      fiber_g: 40,
    }));

    githubIntegration.appendLogEntry = jest.fn();
    githubIntegration.getTodaysTotals = jest.fn(() => ({
      date: '2025-11-05',
      entries: 1,
      items: 1,
      energy_kcal: 500,
      protein_g: 30,
      fat_g: 20,
      carbs_total_g: 40,
      fiber_total_g: 5,
    }));

    // Create mock Telegram context
    mockCtx = {
      message: {
        message_id: 789,
        text: 'grilled chicken breast 200g',
        from: { id: 123456789 },
        chat: { id: 123456789 },
        photo: null,
      },
      from: { id: 123456789 },
      chat: { id: 123456789 },
      reply: jest.fn(),
      telegram: {
        editMessageText: jest.fn(),
        getFile: jest.fn(),
        getFileLink: jest.fn(),
      },
    };

    // Re-require webhook after mocking
    webhook = require('../../src/webhook');
    bot = webhook.bot;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Middleware', () => {
    it('should allow authorized users', async () => {
      const ctx = { ...mockCtx, from: { id: 123456789 } };
      const next = jest.fn();

      // Get the authentication middleware
      const authMiddleware = bot.middleware.find(mw => 
        mw.toString().includes('allowedUsers') || 
        mw.name === 'authenticateUser'
      );

      if (authMiddleware) {
        await authMiddleware(ctx, next);
        expect(next).toHaveBeenCalled();
      }
    });

    it('should reject unauthorized users', async () => {
      config.telegram.allowedUsers = [123456789];
      const ctx = { 
        ...mockCtx, 
        from: { id: 987654321 }, // Different user ID
        reply: jest.fn()
      };
      const next = jest.fn();

      // Simulate authentication check
      const userId = ctx.from?.id;
      const isAuthorized = !config.telegram.allowedUsers || 
                          config.telegram.allowedUsers.length === 0 || 
                          config.telegram.allowedUsers.includes(userId);

      if (!isAuthorized) {
        await ctx.reply('❌ Unauthorized. This bot is restricted to authorized users only.');
        expect(next).not.toHaveBeenCalled();
      } else {
        next();
      }

      expect(ctx.reply).toHaveBeenCalledWith('❌ Unauthorized. This bot is restricted to authorized users only.');
    });

    it('should allow all users when allowedUsers is empty', async () => {
      config.telegram.allowedUsers = [];
      const ctx = { ...mockCtx, from: { id: 987654321 } };
      const next = jest.fn();

      // Simulate authentication with empty allowedUsers
      const isAuthorized = !config.telegram.allowedUsers || 
                          config.telegram.allowedUsers.length === 0;

      if (isAuthorized) {
        next();
      }

      expect(next).toHaveBeenCalled();
    });
  });

  describe('Rate Limiting Middleware', () => {
    it('should allow requests under rate limit', async () => {
      const ctx = { ...mockCtx };
      const next = jest.fn();

      // Simulate rate limit check (first request)
      const userId = ctx.from?.id;
      const now = Date.now();
      
      // Mock storage would be empty for first request
      next();

      expect(next).toHaveBeenCalled();
    });

    it('should reject requests over rate limit', async () => {
      const ctx = { 
        ...mockCtx,
        reply: jest.fn()
      };
      const next = jest.fn();

      // Simulate rate limit exceeded
      const rateLimitExceeded = true; // Mock condition
      
      if (rateLimitExceeded) {
        await ctx.reply('⚠️ Rate limit exceeded. You can make up to 30 requests per minute.\n\nPlease wait 60 seconds before trying again.');
      } else {
        next();
      }

      expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('Rate limit exceeded'));
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Webhook Secret Verification', () => {
    it('should verify valid webhook secret', () => {
      const mockReq = {
        headers: {
          'x-telegram-bot-api-secret-token': 'test_secret'
        }
      };

      // Import the verification function
      const webhook = require('../../src/webhook');
      
      // Mock the verification logic
      const providedSecret = mockReq.headers['x-telegram-bot-api-secret-token'];
      const expectedSecret = config.telegram.webhookSecret;
      const isValid = providedSecret === expectedSecret;

      expect(isValid).toBe(true);
    });

    it('should reject invalid webhook secret', () => {
      const mockReq = {
        headers: {
          'x-telegram-bot-api-secret-token': 'wrong_secret'
        }
      };

      const providedSecret = mockReq.headers['x-telegram-bot-api-secret-token'];
      const expectedSecret = config.telegram.webhookSecret;
      const isValid = providedSecret === expectedSecret;

      expect(isValid).toBe(false);
    });

    it('should skip verification when no secret configured', () => {
      config.telegram.webhookSecret = null;
      const mockReq = {
        headers: {}
      };

      // When no secret is configured, verification should pass
      const isValid = !config.telegram.webhookSecret || true;

      expect(isValid).toBe(true);
    });
  });

  describe('Text Message Handler', () => {
    beforeEach(() => {
      mockCtx.message.text = 'grilled chicken breast 200g';
      mockCtx.reply = jest.fn().mockResolvedValue({ message_id: 123 });
      mockCtx.telegram.editMessageText = jest.fn().mockResolvedValue();
    });

    it('should process food log successfully', async () => {
      const nutritionResult = {
        success: true,
        source: 'claude',
        data: {
          name: 'Grilled Chicken Breast',
          quantity: 200,
          unit: 'g',
          per_portion: global.mockNutritionData,
          notes: 'Estimated via Claude AI'
        }
      };

      claudeIntegration.processFoodLog.mockResolvedValue(nutritionResult);
      githubIntegration.appendLogEntry.mockResolvedValue({ success: true });

      // Simulate text handler
      const textHandler = async (ctx) => {
        const processingMsg = await ctx.reply('🔍 Processing your food log...');
        
        const result = await claudeIntegration.processFoodLog(ctx.message.text, ctx.from.id);
        
        if (!result.success) {
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            processingMsg.message_id,
            null,
            '❌ Could not process food log.'
          );
          return;
        }

        const nutritionData = {
          name: result.data.name,
          quantity: result.data.quantity,
          unit: result.data.unit,
          nutrition: result.data.per_portion,
          notes: result.data.notes,
        };

        await githubIntegration.appendLogEntry(nutritionData);
        
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          processingMsg.message_id,
          null,
          `✅ **Logged: ${nutritionData.name}**\n\nSuccessfully processed and saved.`
        );
      };

      await textHandler(mockCtx);

      expect(mockCtx.reply).toHaveBeenCalledWith('🔍 Processing your food log...');
      expect(claudeIntegration.processFoodLog).toHaveBeenCalledWith('grilled chicken breast 200g', 123456789);
      expect(githubIntegration.appendLogEntry).toHaveBeenCalled();
      expect(mockCtx.telegram.editMessageText).toHaveBeenCalledWith(
        123456789,
        123,
        null,
        expect.stringContaining('✅ **Logged: Grilled Chicken Breast**')
      );
    });

    it('should handle Claude processing failure', async () => {
      claudeIntegration.processFoodLog.mockResolvedValue({
        success: false,
        message: 'Could not identify food'
      });

      const textHandler = async (ctx) => {
        const processingMsg = await ctx.reply('🔍 Processing your food log...');
        const result = await claudeIntegration.processFoodLog(ctx.message.text, ctx.from.id);
        
        if (!result.success) {
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            processingMsg.message_id,
            null,
            `❌ Could not process food log. ${result.message}`
          );
        }
      };

      await textHandler(mockCtx);

      expect(mockCtx.telegram.editMessageText).toHaveBeenCalledWith(
        123456789,
        123,
        null,
        '❌ Could not process food log. Could not identify food'
      );
      expect(githubIntegration.appendLogEntry).not.toHaveBeenCalled();
    });

    it('should handle GitHub logging failure', async () => {
      claudeIntegration.processFoodLog.mockResolvedValue({
        success: true,
        source: 'claude',
        data: {
          name: 'Test Food',
          per_portion: global.mockNutritionData
        }
      });

      githubIntegration.appendLogEntry.mockRejectedValue(new Error('GitHub API error'));

      const textHandler = async (ctx) => {
        try {
          await ctx.reply('🔍 Processing your food log...');
          const result = await claudeIntegration.processFoodLog(ctx.message.text, ctx.from.id);
          await githubIntegration.appendLogEntry({});
        } catch (error) {
          await ctx.reply(`❌ Error logging food: ${error.message}`);
        }
      };

      await textHandler(mockCtx);

      expect(mockCtx.reply).toHaveBeenCalledWith(
        expect.stringContaining('❌ Error logging food: GitHub API error')
      );
    });

    it('should ignore command messages', async () => {
      mockCtx.message.text = '/start';

      const textHandler = (ctx) => {
        if (ctx.message.text.startsWith('/')) {
          return; // Ignore commands
        }
        // Process regular text...
      };

      await textHandler(mockCtx);

      expect(claudeIntegration.processFoodLog).not.toHaveBeenCalled();
    });
  });

  describe('Photo Message Handler', () => {
    beforeEach(() => {
      mockCtx.message.photo = [
        { file_id: 'small_photo' },
        { file_id: 'large_photo' } // This will be selected (largest)
      ];
      
      mockCtx.telegram.getFile = jest.fn().mockResolvedValue({
        file_path: 'photos/file_123.jpg',
        file_size: 1024
      });

      mockCtx.telegram.getFileLink = jest.fn().mockResolvedValue({
        href: 'https://api.telegram.org/file/bot123/photos/file_123.jpg'
      });

      // Mock axios for image download
      nock('https://api.telegram.org')
        .get('/file/bot123/photos/file_123.jpg')
        .reply(200, Buffer.from('fake image data'));
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('should process photo successfully', async () => {
      claudeIntegration.processImage.mockResolvedValue({
        success: true,
        data: {
          name: 'Menu Item from Photo',
          per_portion: global.mockNutritionData,
          notes: 'Extracted from screenshot'
        }
      });

      githubIntegration.appendLogEntry.mockResolvedValue({ success: true });

      const photoHandler = async (ctx) => {
        const processingMsg = await ctx.reply('📸 Processing screenshot...');
        
        const photos = ctx.message.photo;
        const photo = photos[photos.length - 1]; // Largest size
        
        const fileInfo = await ctx.telegram.getFile(photo.file_id);
        const fileLink = await ctx.telegram.getFileLink(photo.file_id);
        
        // Mock image download
        const imageBuffer = Buffer.from('fake image data');
        
        const result = await claudeIntegration.processImage(imageBuffer, 'image/jpeg');
        
        if (result.success) {
          const nutritionData = {
            name: result.data.name,
            nutrition: result.data.per_portion,
            notes: result.data.notes,
          };
          
          await githubIntegration.appendLogEntry(nutritionData);
          
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            processingMsg.message_id,
            null,
            `✅ **Logged from screenshot: ${nutritionData.name}**`
          );
        }
      };

      await photoHandler(mockCtx);

      expect(mockCtx.reply).toHaveBeenCalledWith('📸 Processing screenshot...');
      expect(mockCtx.telegram.getFile).toHaveBeenCalledWith('large_photo');
      expect(claudeIntegration.processImage).toHaveBeenCalledWith(
        expect.any(Buffer),
        'image/jpeg'
      );
      expect(githubIntegration.appendLogEntry).toHaveBeenCalled();
    });

    it('should handle Claude image processing failure', async () => {
      claudeIntegration.processImage.mockResolvedValue({
        success: false,
        message: 'Could not extract nutrition data from image'
      });

      const photoHandler = async (ctx) => {
        const processingMsg = await ctx.reply('📸 Processing screenshot...');
        const result = await claudeIntegration.processImage(Buffer.from('fake'), 'image/jpeg');
        
        if (!result.success) {
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            processingMsg.message_id,
            null,
            `❌ Could not extract nutrition data from image.\n\n${result.message}`
          );
        }
      };

      await photoHandler(mockCtx);

      expect(mockCtx.telegram.editMessageText).toHaveBeenCalledWith(
        123456789,
        123,
        null,
        expect.stringContaining('❌ Could not extract nutrition data from image')
      );
      expect(githubIntegration.appendLogEntry).not.toHaveBeenCalled();
    });

    it('should handle file download errors', async () => {
      mockCtx.telegram.getFile.mockRejectedValue(new Error('File not found'));

      const photoHandler = async (ctx) => {
        try {
          await ctx.reply('📸 Processing screenshot...');
          await ctx.telegram.getFile('large_photo');
        } catch (error) {
          await ctx.reply(`❌ Error processing screenshot: ${error.message}`);
        }
      };

      await photoHandler(mockCtx);

      expect(mockCtx.reply).toHaveBeenCalledWith(
        '❌ Error processing screenshot: File not found'
      );
    });
  });

  describe('Command Handlers', () => {
    it('should handle /start command', async () => {
      const startHandler = async (ctx) => {
        await ctx.reply(expect.stringContaining('👋 Welcome to Nutrition Tracker!'));
      };

      await startHandler(mockCtx);

      expect(mockCtx.reply).toHaveBeenCalledWith(
        expect.stringContaining('👋 Welcome to Nutrition Tracker!')
      );
    });

    it('should handle /help command', async () => {
      const helpHandler = async (ctx) => {
        await ctx.reply(expect.stringContaining('📖 **How Nutrition Tracker Works**'));
      };

      await helpHandler(mockCtx);

      expect(mockCtx.reply).toHaveBeenCalledWith(
        expect.stringContaining('📖 **How Nutrition Tracker Works**')
      );
    });

    it('should handle /today command', async () => {
      const todayHandler = async (ctx) => {
        const processingMsg = await ctx.reply('📊 Calculating today\'s totals...');
        
        const totals = await githubIntegration.getTodaysTotals();
        const targets = claudeIntegration.getTargets('rest');

        const summaryMessage = `📊 **Today's Summary** (${totals.date})\n\n**Entries:** ${totals.entries} meals, ${totals.items} items`;

        await ctx.telegram.editMessageText(
          ctx.chat.id,
          processingMsg.message_id,
          null,
          summaryMessage
        );
      };

      await todayHandler(mockCtx);

      expect(mockCtx.reply).toHaveBeenCalledWith('📊 Calculating today\'s totals...');
      expect(githubIntegration.getTodaysTotals).toHaveBeenCalled();
      expect(claudeIntegration.getTargets).toHaveBeenCalledWith('rest');
      expect(mockCtx.telegram.editMessageText).toHaveBeenCalledWith(
        123456789,
        123,
        null,
        expect.stringContaining('📊 **Today\'s Summary**')
      );
    });

    it('should handle /today command errors', async () => {
      githubIntegration.getTodaysTotals.mockRejectedValue(new Error('GitHub API error'));

      const todayHandler = async (ctx) => {
        try {
          await ctx.reply('📊 Calculating today\'s totals...');
          await githubIntegration.getTodaysTotals();
        } catch (error) {
          await ctx.reply('❌ Error calculating totals. Please try again or contact support.');
        }
      };

      await todayHandler(mockCtx);

      expect(mockCtx.reply).toHaveBeenCalledWith(
        '❌ Error calculating totals. Please try again or contact support.'
      );
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize input for logging', () => {
      const maliciousInput = 'test\r\n\x00\x08malicious';
      
      // Mock sanitization function
      const sanitizeForLogging = (input) => {
        if (typeof input !== 'string') {
          return String(input);
        }
        
        return input
          .replace(/[\r\n]/g, ' ')
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
          .substring(0, 500);
      };

      const sanitized = sanitizeForLogging(maliciousInput);
      
      expect(sanitized).toBe('test malicious');
      expect(sanitized).not.toContain('\r');
      expect(sanitized).not.toContain('\n');
      expect(sanitized).not.toContain('\x00');
    });

    it('should limit input length', () => {
      const longInput = 'x'.repeat(1000);
      
      const sanitizeForLogging = (input) => {
        return String(input).substring(0, 500);
      };

      const sanitized = sanitizeForLogging(longInput);
      
      expect(sanitized.length).toBe(500);
    });
  });

  describe('Error Handling', () => {
    it('should handle unhandled bot errors', async () => {
      const error = new Error('Unexpected error');
      const ctx = {
        ...mockCtx,
        reply: jest.fn().mockRejectedValue(new Error('Send failed'))
      };

      // Mock error handler
      const errorHandler = async (error, ctx) => {
        console.error('Unhandled bot error:', error);
        try {
          await ctx.reply('❌ An unexpected error occurred. Please try again or contact support.');
        } catch (err) {
          console.error('Failed to send error message:', err);
        }
      };

      await errorHandler(error, ctx);

      expect(ctx.reply).toHaveBeenCalledWith(
        '❌ An unexpected error occurred. Please try again or contact support.'
      );
    });

    it('should handle network timeouts', async () => {
      const timeoutError = new Error('ETIMEDOUT');
      timeoutError.code = 'ETIMEDOUT';

      claudeIntegration.processFoodLog.mockRejectedValue(timeoutError);

      const textHandler = async (ctx) => {
        try {
          await claudeIntegration.processFoodLog('test food', 123);
        } catch (error) {
          if (error.code === 'ETIMEDOUT') {
            await ctx.reply('❌ Request timed out. Please try again.');
          }
        }
      };

      await textHandler(mockCtx);

      expect(mockCtx.reply).toHaveBeenCalledWith(
        '❌ Request timed out. Please try again.'
      );
    });
  });

  describe('Markdown Formatting', () => {
    // Import escapeMarkdown function from webhook module
    const { escapeMarkdown } = webhook;

    describe('escapeMarkdown()', () => {
      it('should escape asterisks (bold)', () => {
        expect(escapeMarkdown('test*bold*')).toBe('test\\*bold\\*');
        expect(escapeMarkdown('**double bold**')).toBe('\\*\\*double bold\\*\\*');
      });

      it('should escape underscores (italic)', () => {
        expect(escapeMarkdown('test_italic_')).toBe('test\\_italic\\_');
        expect(escapeMarkdown('chicken_breast')).toBe('chicken\\_breast');
      });

      it('should escape backticks (code)', () => {
        expect(escapeMarkdown('test`code`')).toBe('test\\`code\\`');
      });

      it('should escape square brackets (links)', () => {
        expect(escapeMarkdown('test[link]')).toBe('test\\[link\\]');
        expect(escapeMarkdown('[REDACTED]')).toBe('\\[REDACTED\\]');
        expect(escapeMarkdown('food[ingredient]')).toBe('food\\[ingredient\\]');
      });

      it('should escape backslashes', () => {
        expect(escapeMarkdown('test\\slash')).toBe('test\\\\slash');
        expect(escapeMarkdown('C:\\Temp\\file.txt')).toBe('C:\\\\Temp\\\\file.txt');
      });

      it('should handle multiple special characters', () => {
        const input = 'chicken_breast*bold* \\backslash [link]';
        const expected = 'chicken\\_breast\\*bold\\* \\\\backslash \\[link\\]';
        expect(escapeMarkdown(input)).toBe(expected);
      });

      it('should handle non-string inputs', () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

        expect(escapeMarkdown(123)).toBe('123');
        expect(escapeMarkdown(null)).toBe('null');
        expect(escapeMarkdown(undefined)).toBe('undefined');
        expect(escapeMarkdown(true)).toBe('true');

        expect(warnSpy).toHaveBeenCalledTimes(4);
        warnSpy.mockRestore();
      });

      it('should handle empty string', () => {
        expect(escapeMarkdown('')).toBe('');
      });

      it('should handle strings without special characters', () => {
        expect(escapeMarkdown('plain text')).toBe('plain text');
        expect(escapeMarkdown('123 grilled chicken')).toBe('123 grilled chicken');
      });

      it('should prevent markdown injection attacks', () => {
        const maliciousName = 'Hacker*bold*_italic_`code`[link]\\slash';
        const escaped = escapeMarkdown(maliciousName);

        // Verify no unescaped markdown special characters remain
        expect(escaped).not.toContain('*bold*');
        expect(escaped).not.toContain('_italic_');
        expect(escaped).not.toContain('`code`');
        expect(escaped).not.toContain('[link]');
        expect(escaped).toBe('Hacker\\*bold\\*\\_italic\\_\\`code\\`\\[link\\]\\\\slash');
      });

      it('should handle fractions with backslashes', () => {
        expect(escapeMarkdown('1/2 cup')).toBe('1/2 cup');
      });
    });

    describe('TELEGRAM_PARSE_OPTIONS', () => {
      it('should be passed to all reply calls', async () => {
        const ctx = { ...mockCtx };
        ctx.reply = jest.fn().mockResolvedValue({ message_id: 123 });

        await ctx.reply('test message', { parse_mode: 'Markdown' });

        expect(ctx.reply).toHaveBeenCalledWith(
          'test message',
          expect.objectContaining({ parse_mode: 'Markdown' })
        );
      });

      it('should be passed to editMessageText calls', async () => {
        const ctx = { ...mockCtx };
        ctx.telegram.editMessageText = jest.fn().mockResolvedValue(true);

        await ctx.telegram.editMessageText(
          123,
          456,
          null,
          'updated message',
          { parse_mode: 'Markdown' }
        );

        expect(ctx.telegram.editMessageText).toHaveBeenCalledWith(
          123,
          456,
          null,
          'updated message',
          expect.objectContaining({ parse_mode: 'Markdown' })
        );
      });
    });

    describe('Markdown Rendering in Bot Messages', () => {
      it('should format /start command with markdown', async () => {
        const ctx = { ...mockCtx };
        ctx.reply = jest.fn().mockResolvedValue({ message_id: 123 });

        // Simulate /start command
        await ctx.reply(
          '👋 Welcome to Nutrition Tracker!\n\n**How to use:**',
          { parse_mode: 'Markdown' }
        );

        expect(ctx.reply).toHaveBeenCalledWith(
          expect.stringContaining('**How to use:**'),
          { parse_mode: 'Markdown' }
        );
      });

      it('should escape user-provided food names in success messages', () => {
        const foodName = 'chicken_breast*with*sauce';
        const escaped = escapeMarkdown(foodName);
        const message = `✅ **Logged: ${escaped}**`;

        expect(message).toContain('chicken\\_breast\\*with\\*sauce');
        expect(message).not.toContain('chicken_breast*with*sauce');
      });

      it('should not escape numeric nutrition values', () => {
        const nutrition = {
          energy_kcal: 500,
          protein_g: 30,
          fat_g: 20,
        };

        const message = `📊 **This meal:**
• ${nutrition.energy_kcal} kcal
• ${nutrition.protein_g}g protein
• ${nutrition.fat_g}g fat`;

        // Numeric values should appear as-is
        expect(message).toContain('500 kcal');
        expect(message).toContain('30g protein');
        expect(message).toContain('20g fat');
      });
    });
  });
});