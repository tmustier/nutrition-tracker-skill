[← Phase 3 Enhancements](06-phase3-enhancements.md) | [Next: Reference Materials →](08-reference.md)

---

## Maintenance and Monitoring

### Logging and Debugging

**Railway Logs**:
```bash
# View real-time logs
railway logs --tail

# View logs from last hour
railway logs --since 1h

# Filter by severity
railway logs --level error
```

**GitHub Actions Logs**:
- Go to repository → Actions tab
- Click on workflow run to see detailed logs
- Check each job step for errors

**Telegram Bot Logs**:
- Add structured logging to webhook.js:
  ```javascript
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Food logged successfully',
    userId: ctx.from.id,
    food: nutritionData.name,
  }));
  ```

### Cost Monitoring

**Claude API Usage**:
- Dashboard: https://console.anthropic.com/
- Check "Usage" tab for current month spending
- Set up billing alerts

**Railway Usage**:
- Dashboard shows compute hours and bandwidth
- Free tier: $5 credit/month
- Monitor to ensure staying within limits

**GitHub Actions Minutes**:
- Settings → Billing → Actions minutes
- Free tier: 2,000 minutes/month
- Current usage shown

### Error Alerting

**Option 1: Railway Webhooks**
- Set up webhook for deployment failures
- Sends notification to Slack/Discord/email

**Option 2: GitHub Actions Notifications**
- Configure workflow to send email on failure:
  ```yaml
  - name: Notify on failure
    if: failure()
    uses: dawidd6/action-send-mail@v3
    with:
      server_address: smtp.gmail.com
      # ... email config
  ```

**Option 3: Uptime Monitoring**
- Use UptimeRobot (free) to monitor webhook endpoint
- Alerts via email/SMS if bot goes down

### Regular Maintenance Tasks

**Weekly**:
- Check Railway logs for errors
- Review Claude API spending
- Check GitHub Actions success rate
- Verify daily PRs are merging successfully

**Monthly**:
- Review cost breakdown
- Update dependencies: `npm update`
- Check for Claude API model updates
- Review and clean up old log data if needed

**As Needed**:
- Rotate API keys annually
- Update Telegram bot token if compromised
- Update GitHub token if permissions change

---

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue: Bot Not Responding to Messages

**Symptoms**: Send message to bot, no response

**Debugging Steps**:
1. Check Railway logs: `railway logs --tail`
2. Look for webhook errors
3. Verify webhook is set:
   ```bash
   curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
   ```
4. Check `WEBHOOK_URL` environment variable is correct
5. Re-set webhook: Visit `https://your-app.railway.app/setup`

**Common Causes**:
- Webhook URL incorrect or changed
- Railway deployment failed
- Environment variables not set

**Solution**:
```bash
# Re-deploy with correct webhook URL
railway env set WEBHOOK_URL=https://your-app.railway.app
railway up
# Visit /setup endpoint to register webhook
```

---

#### Issue: USDA API Returning No Results

**Symptoms**: Bot says "No USDA data found" for common foods

**Debugging Steps**:
1. Test API key directly:
   ```bash
   curl "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=YOUR_KEY&query=chicken+breast"
   ```
2. Check response for errors
3. Verify API key hasn't expired

**Common Causes**:
- Invalid or expired API key
- USDA API temporarily down
- Query term too specific

**Solution**:
1. Register new API key at https://fdc.nal.usda.gov/api-key-signup.html
2. Update environment variable:
   ```bash
   railway env set USDA_API_KEY=new_key
   railway restart
   ```
3. If API is down, bot falls back to Claude estimation

---

#### Issue: GitHub Commits Failing

**Symptoms**: Bot processes food but doesn't commit to GitHub

**Debugging Steps**:
1. Check Railway logs for GitHub API errors
2. Verify GitHub token has `repo` scope:
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Click on your token
   - Verify "repo" checkbox is checked
3. Check branch exists:
   ```bash
   git branch -a | grep daily-logs
   ```
4. Test GitHub API manually:
   ```bash
   curl -H "Authorization: token YOUR_TOKEN" \
     https://api.github.com/repos/tmustier/nutrition-tracker-skill/git/refs/heads/daily-logs
   ```

**Common Causes**:
- GitHub token expired or revoked
- Insufficient token permissions
- Branch doesn't exist
- Rate limit exceeded (5,000 requests/hour)

**Solution**:
1. Generate new token with `repo` scope
2. Update environment variable:
   ```bash
   railway env set GITHUB_TOKEN=new_token
   railway restart
   ```
3. Ensure branch exists:
   ```bash
   git push origin daily-logs
   ```

---

#### Issue: Claude API Errors (429 Rate Limit)

**Symptoms**: Bot returns "Failed to process" after long delay

**Debugging Steps**:
1. Check Anthropic console for rate limit status
2. Review logs for 429 errors
3. Check current API usage

**Common Causes**:
- Exceeded rate limit (50 requests/minute for Sonnet)
- Insufficient credits in account

**Solution**:
1. Add retry logic with exponential backoff:
   ```javascript
   async function callClaudeWithRetry(prompt, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await callClaude(prompt);
       } catch (error) {
         if (error.response?.status === 429 && i < maxRetries - 1) {
           await sleep(2 ** i * 1000); // Exponential backoff
           continue;
         }
         throw error;
       }
     }
   }
   ```
2. Add credits to Anthropic account
3. Consider using Haiku for simple queries (cheaper, faster)

---

#### Issue: Daily PR Not Auto-Merging

**Symptoms**: PRs created but not merging automatically

**Debugging Steps**:
1. Check PR status: `gh pr view <PR_NUMBER>`
2. Look for failing checks
3. Check validation workflow logs
4. Verify auto-merge is enabled: `gh pr view <PR_NUMBER> --json autoMergeRequest`

**Common Causes**:
- Validation failing (YAML syntax errors)
- Auto-merge not enabled
- Required checks not configured correctly

**Solution**:
1. Fix validation errors in YAML files
2. Manually enable auto-merge if needed:
   ```bash
   gh pr merge <PR_NUMBER> --auto --squash
   ```
3. Check branch protection settings don't block auto-merge

---

#### Issue: Screenshot Processing Not Working

**Symptoms**: Send image to bot, get error or no response

**Debugging Steps**:
1. Check Claude API supports vision (Sonnet 3.5+ does)
2. Verify image size isn't too large (max 5MB)
3. Check image format is supported (JPEG, PNG, GIF, WebP)
4. Review logs for Vision API errors

**Common Causes**:
- Image too large or unsupported format
- Claude model doesn't support vision
- Poor image quality (text not legible)

**Solution**:
1. Ensure using Claude Sonnet 3.5 or later
2. Ask user to compress image or send clearer photo
3. Add image preprocessing:
   ```javascript
   const sharp = require('sharp');
   const compressedImage = await sharp(imageBuffer)
     .resize(1024, 1024, { fit: 'inside' })
     .jpeg({ quality: 80 })
     .toBuffer();
   ```

---

---

## Navigation

- [← Previous: Phase 3 Enhancements](06-phase3-enhancements.md) (Optional)
- [Next: Reference Materials →](08-reference.md)

**Related Sections**:
- [Telegram Bot Implementation](../telegram-bot/README.md)
- [API Documentation](08-reference.md#appendix-a-api-documentation-links)
- [Security Best Practices](08-reference.md#appendix-c-security-best-practices)
