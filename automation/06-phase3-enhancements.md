[← Overview](01-overview-and-planning.md) | [Next: Operations Guide →](07-operations.md)

---

## Phase 3: Future Enhancements

**Note**: These are optional enhancements to implement after Phases 1-2 are working well.

---

### 3.1 Migration to iMessage (Optional)

**When to Implement**: If you prefer native iOS integration over cross-platform Telegram

#### Option A: Mac Messages MCP Server

**Prerequisites**:
- Mac running 24/7 (or available when needed)
- macOS with Messages app
- Claude Desktop installed

**Steps**:

1. **Install Mac Messages MCP Server**:
   ```bash
   git clone https://github.com/carterlasalle/mac-messages.git
   cd mac-messages
   pip install -r requirements.txt
   ```

2. **Configure Claude Desktop**:
   - Open Claude Desktop settings
   - Navigate to MCP servers
   - Add Mac Messages server configuration

3. **Adapt Telegram Bot Code**:
   - Replace Telegram API calls with iMessage API
   - Use same Claude integration
   - Same GitHub integration
   - Deploy as always-on service on Mac

4. **Test**:
   - Send iMessage to your own phone number
   - Bot should respond via iMessage
   - Logs should appear in GitHub

**Pros**:
- Native iOS experience
- FREE messaging
- Better integration with Apple ecosystem

**Cons**:
- Requires Mac to be always on
- iOS/Mac only
- More complex setup

**Time**: 4-6 hours

#### Option B: Apple Shortcuts

**Steps**:

1. **Create Shortcut**:
   - Open Shortcuts app
   - Create new shortcut: "Log Food"
   - Add "Text" input
   - Add "Get Contents of URL" action:
     - URL: `https://api.anthropic.com/v1/messages`
     - Method: POST
     - Headers: Include API key
     - Body: JSON with text input
   - Add "Run Script Over SSH" (for git commit)
   - Add "Show Notification" with result

2. **Configure Git Access**:
   - Use Working Copy app for iOS git operations
   - Or use SSH to commit from Mac

3. **Add to Home Screen**:
   - Add shortcut to home screen
   - Or trigger with "Hey Siri, log food"

**Pros**:
- Simple setup
- Voice activation possible
- No server required

**Cons**:
- Manual trigger (not as seamless as messaging)
- Git integration is hacky
- Limited conversation history

**Time**: 2-3 hours

---

### 3.2 Firecrawl MCP Integration (Optional)

**When to Implement**: If you need automated scraping of restaurant websites and Deliveroo

**Steps**:

1. **Sign up for Firecrawl**:
   - Visit: https://firecrawl.dev/
   - Create account
   - Get API key
   - Check pricing tier (free tier available)

2. **Install Firecrawl MCP Server**:
   ```bash
   npm install -g @firecrawl/mcp-server
   ```

3. **Configure in Claude Code**:
   ```json
   {
     "firecrawl": {
       "command": "npx",
       "args": ["@firecrawl/mcp-server"],
       "env": {
         "FIRECRAWL_API_KEY": "your_api_key"
       }
     }
   }
   ```

4. **Update ESTIMATE.md**:
   - Add Firecrawl as data source option
   - Document when to use (restaurant websites, Deliveroo)
   - Add examples

5. **Test**:
   - Ask Claude Code: "Use Firecrawl to extract menu data from https://www.deliveroo.co.uk/menu/london/..."
   - Verify structured data is returned

**Cost**: Check Firecrawl pricing (paid service)

**Success Rate**: 70-85% on heavily protected sites

**Time**: 2-3 hours

---

### 3.3 Conversation History and Context

**Enhancement**: Add stateful conversation to Telegram bot for better UX

**Implementation**:

1. **Add Redis/Upstash for Session Storage**:
   ```bash
   npm install @upstash/redis
   ```

2. **Store Conversation Context**:
   - User's last 5 messages
   - Today's log entries
   - Preferences (rest vs training day)

3. **Enable Follow-up Questions**:
   - User: "Had salmon"
   - Bot: "How much salmon? (e.g., 200g, 1 fillet)"
   - User: "200g"
   - Bot: Logs 200g salmon

**Cost**: Upstash Redis free tier (10,000 commands/day)

**Time**: 3-4 hours

---

### 3.4 Inline Keyboards and Quick Actions

**Enhancement**: Add button-based interactions for common actions

**Implementation**:

1. **Add Inline Keyboard to Responses**:
   ```javascript
   await ctx.reply('Logged ✓. Chicken breast: 330 kcal', {
     reply_markup: {
       inline_keyboard: [
         [
           { text: '📊 Today\'s Summary', callback_data: 'summary_today' },
           { text: '📅 This Week', callback_data: 'summary_week' },
         ],
         [
           { text: '🍽️ Log Another', callback_data: 'log_more' },
           { text: '❌ Undo Last', callback_data: 'undo_last' },
         ],
       ],
     },
   });
   ```

2. **Handle Callback Queries**:
   ```javascript
   bot.on('callback_query', async (ctx) => {
     const action = ctx.callbackQuery.data;
     if (action === 'summary_today') {
       // Show today's summary
     } else if (action === 'undo_last') {
       // Delete last log entry
     }
   });
   ```

**Time**: 2-3 hours

---

### 3.5 Voice Input Support

**Enhancement**: Allow voice messages for food logging

**Implementation**:

1. **Handle Voice Messages**:
   ```javascript
   bot.on('voice', async (ctx) => {
     // Download voice file
     const fileLink = await ctx.telegram.getFileLink(ctx.message.voice.file_id);

     // Transcribe with Whisper API or similar
     const transcription = await whisperApi.transcribe(fileLink);

     // Process as text message
     await processFoodLog(transcription);
   });
   ```

2. **Add Whisper API**:
   - OpenAI Whisper API for speech-to-text
   - Or use Deepgram, AssemblyAI

**Cost**: Whisper API ~$0.006/minute

**Time**: 3-4 hours

---

---

## Navigation

- [← Previous: Overview and Planning](01-overview-and-planning.md)
- [Next: Operations Guide →](07-operations.md)

**Related Sections**:
- [Telegram Bot Implementation](../telegram-bot/README.md) - Extend this code for enhancements
- [Cost Calculator](08-reference.md#appendix-b-cost-calculator) - Estimate costs for new features
- [iMessage Migration Details](08-reference.md#appendix-d-migration-path-from-telegram-to-imessage)
