[← Operations Guide](07-operations.md) | [↑ Table of Contents](README.md)

---

## Appendices

### Appendix A: API Documentation Links

- **Claude API**: https://docs.anthropic.com/en/api/getting-started
- **Claude Vision API**: https://docs.anthropic.com/en/docs/build-with-claude/vision
- **Telegram Bot API**: https://core.telegram.org/bots/api
- **Telegraf Documentation**: https://telegraf.js.org/
- **USDA FoodData Central API**: https://fdc.nal.usda.gov/api-guide.html
- **GitHub REST API**: https://docs.github.com/en/rest
- **Railway Documentation**: https://docs.railway.app/
- **Vercel Documentation**: https://vercel.com/docs

### Appendix B: Cost Calculator

**Monthly Cost Formula**:

```
Claude API Cost = (Input Tokens × $3 / 1M) + (Output Tokens × $15 / 1M)

For 300 food logs/month:
- Average input per log: 500 tokens (skill context + user message)
- Average output per log: 200 tokens (nutrition JSON response)

Input cost: 300 × 500 × $3 / 1M = $0.45
Output cost: 300 × 200 × $15 / 1M = $0.90

Total: $1.35/month

With 50 screenshot processings/month (Vision API):
- Additional input: 50 × 2000 × $3 / 1M = $0.30

Grand Total: ~$1.65/month
```

**Cost Optimization**:

1. **Enable Prompt Caching** (90% savings on repeated context):
   ```javascript
   // Mark skill context as cacheable
   system: [
     {
       type: 'text',
       text: config.skillContext,
       cache_control: { type: 'ephemeral' }
     }
   ]
   ```
   New cost: ~$0.50-0.75/month

2. **Use Haiku for Simple Queries**:
   - Detect simple ingredients: "200g chicken"
   - Use Haiku instead of Sonnet: $0.25/$1.25 per million tokens
   - Save ~75% on simple logs

3. **Batch Processing**:
   - Group multiple food items in one message
   - Reduces API calls

**Optimized Monthly Cost**: $0.50-1.00/month

### Appendix C: Security Best Practices

**API Key Management**:
- ✅ Store in environment variables (never commit to git)
- ✅ Use different tokens for dev/prod
- ✅ Rotate tokens annually
- ✅ Set up billing alerts on Anthropic/GitHub
- ✅ Use Railway/Vercel secrets (encrypted at rest)

**GitHub Token Permissions**:
- ✅ Use fine-grained tokens with minimal scope (repo only)
- ✅ Set expiration date (90 days recommended)
- ✅ Regenerate if compromised
- ✅ Use deploy keys for read-only access where possible

**Telegram Bot Security**:
- ✅ Keep bot token secret
- ✅ Only share bot with trusted users (you)
- ✅ Set bot to private (via BotFather settings)
- ✅ Implement user allowlist:
   ```javascript
   const ALLOWED_USERS = [123456789]; // Your Telegram user ID

   bot.use((ctx, next) => {
     if (ALLOWED_USERS.includes(ctx.from?.id)) {
       return next();
     }
     return ctx.reply('⛔ Unauthorized');
   });
   ```

**Data Privacy**:
- ✅ Food logs contain personal health data
- ✅ Use private GitHub repository
- ✅ Don't log sensitive PII in Railway logs
- ✅ Claude API doesn't store data (per Anthropic policy)
- ✅ Telegram messages are encrypted in transit

**Railway/Vercel Security**:
- ✅ Enable automatic deployments only from protected branches
- ✅ Use environment-specific secrets
- ✅ Set up deployment protection rules
- ✅ Monitor access logs

### Appendix D: Migration Path from Telegram to iMessage

If you later decide to switch from Telegram to iMessage, here's the migration strategy:

**Similarities** (no code changes needed):
- Claude API integration (same)
- GitHub integration (same)
- USDA API integration (same)
- Core logic (same)

**Changes Required**:
1. Replace Telegram API with iMessage API (via Mac Messages MCP)
2. Update webhook handler to receive iMessage format
3. Deploy to always-on Mac instead of Railway
4. Update message formatting for iMessage

**Estimated Migration Time**: 4-6 hours

**Cost Change**: $0 (no Railway needed, iMessage is free)

**Recommendation**: Keep Telegram bot running alongside iMessage during transition for redundancy.

---

## Conclusion

This implementation guide provides everything needed to:

1. ✅ Enable USDA nutrition lookups (600k+ foods)
2. ✅ Automate PR workflow (zero manual overhead)
3. ✅ Build Telegram bot for text-based logging
4. ✅ Support screenshot uploads for blocked websites
5. ✅ Deploy to production (Railway)
6. ✅ Monitor and maintain the system

**Expected Timeline**:
- **Phase 1** (Foundation): 4-6 hours
- **Phase 2** (Telegram Bot): 8-12 hours
- **Total**: 12-18 hours over 2-3 weeks

**Expected Outcome**:
- Save 30-50 minutes/day on manual PR workflow
- Log food from anywhere in <30 seconds via text
- 95-100% success rate on nutrition data retrieval
- Total cost: ~$1.50/month

**Next Steps**:
1. Start with Phase 1 (USDA + Daily PR automation)
2. Test for 1-2 days to validate approach
3. Proceed to Phase 2 (Telegram bot)
4. Monitor for 1-2 weeks
5. Consider Phase 3 enhancements as needed

For questions or issues during implementation, refer to the Troubleshooting section or review the relevant API documentation in Appendix A.

---

**Document Version**: 1.0
**Last Updated**: 2025-11-04
**Status**: Ready for Implementation

---

## Navigation

- [← Previous: Operations Guide](07-operations.md)
- [↑ Table of Contents](README.md)
- [🏠 Back to Start](README.md)

**Implementation Guides**:
- [Phase 1: Foundation](02-phase1-foundation.md)
- [Phase 2: Telegram Bot Setup](03-phase2-telegram-setup.md)
- [Phase 2: Code](04-phase2-telegram-code.md)
- [Phase 2: Deployment](05-phase2-telegram-deployment.md)
