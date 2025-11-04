[↑ Table of Contents](README.md) | [Next: Phase 1 Foundation →](02-phase1-foundation.md)

---

# Nutrition Tracker Automation Implementation Guide

**Status**: Design Phase
**Last Updated**: 2025-11-04
**Estimated Implementation Time**: 2-3 weeks
**Monthly Operating Cost**: ~$1.50

---

## Executive Summary

### Problem Statement

This nutrition tracking system currently faces three operational pain points:

1. **403 Website Blocking**: Claude Code gets blocked (403 errors) when fetching nutrition data from many useful websites (Deliveroo, restaurant sites) due to anti-bot detection
2. **Manual PR Overhead**: Every food log or data bank update requires manual PR creation and approval, creating friction in the logging workflow
3. **Interface Limitation**: Currently requires Claude Code Web or iOS app; would benefit from text/iMessage interface (like Poke by Interaction Co) for frictionless logging from anywhere

### Solution Overview

We will implement three interconnected components:

**Component 1: Enhanced Data Sources (Week 1)**
- Install USDA FoodData Central MCP Server for 600k+ validated food items (FREE)
- Document screenshot fallback method for blocked websites
- Provides workaround for 70-80% of data retrieval issues

**Component 2: Automated PR Workflow (Week 1)**
- Implement GitHub Actions for daily batch commits
- Auto-create and auto-merge PRs for food logs
- Reduces manual overhead from multiple PRs/day to zero manual intervention

**Component 3: Telegram Messaging Interface (Week 2-3)**
- Build Telegram bot with Claude API integration
- Enable food logging via text message from any device
- Integrate with GitHub for automated commits
- Support image uploads for screenshot-based nutrition extraction

### Expected Outcomes

- **Time Savings**: Eliminate 30-50 minutes/day of PR management overhead
- **Accessibility**: Log food from anywhere via text (phone, desktop, tablet)
- **Data Coverage**: Access 600k+ USDA foods + screenshot fallback for restaurants
- **Cost**: $1.50/month (Claude API usage only)
- **Reliability**: 95-100% success rate for nutrition data retrieval

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERFACES                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Claude Code CLI ←─→ USDA MCP Server ─→ FoodData Central API  │
│                                                                 │
│  Telegram App ───→ Telegram Bot ───→ Claude API               │
│                         ↓                  ↓                    │
│                    USDA API         Claude Vision API          │
│                         ↓                  ↓                    │
│                    GitHub API (commits to daily-logs branch)   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    GIT REPOSITORY                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  daily-logs branch ←── [Food logs accumulate throughout day]   │
│         ↓                                                       │
│  GitHub Actions (cron: 23:45 UTC daily)                        │
│         ↓                                                       │
│  Auto-commit changes                                            │
│         ↓                                                       │
│  Create/update PR to main branch                               │
│         ↓                                                       │
│  Enable auto-merge                                              │
│         ↓                                                       │
│  Validation runs (validate.yml)                                │
│         ↓                                                       │
│  Auto-merge on success ──→ main branch                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Examples

#### Example 1: Logging Food via Telegram (Generic Ingredient)

```
1. User texts bot: "Just had 200g grilled chicken breast"
2. Telegram webhook receives message → serverless function
3. Function calls Claude API with nutrition skill context
4. Claude recognizes "chicken breast" as generic ingredient
5. Bot code queries USDA FoodData Central API
6. Returns: Chicken breast, grilled, 200g = 330 kcal, 62g protein, 7.2g fat
7. Bot code writes to data/logs/2025-11/04.yaml
8. Commits to daily-logs branch via GitHub API
9. Responds to user: "Logged ✓. Chicken breast: 330 kcal, 62g protein. Today: 1,200/2,500 kcal, 95/170g protein."
```

#### Example 2: Logging Food via Telegram (Restaurant Dish - Screenshot)

```
1. User sends screenshot of Deliveroo menu showing "Salmon Poke Bowl - 450 kcal"
2. Telegram webhook receives image → serverless function
3. Function calls Claude Vision API with image
4. Claude extracts: "Salmon Poke Bowl, ~450 kcal" (partial data)
5. Claude estimates remaining macros based on similar dishes in data bank
6. Bot code writes complete entry to data/logs/2025-11/04.yaml
7. Commits to daily-logs branch
8. Responds with nutritional breakdown and daily totals
```

#### Example 3: Daily Batch Automation

```
1. 23:45 UTC: GitHub Actions cron trigger fires
2. Checkout daily-logs branch
3. git-auto-commit-action detects changes in data/logs/**/*.yaml
4. Commits: "chore: Daily nutrition logs - 2025-11-04"
5. gh CLI checks if PR exists (daily-logs → main)
6. If not exists: Creates PR with label "automerge:food-log"
7. Enables auto-merge (squash mode)
8. validate.yml workflow runs (validates YAML structure)
9. On success: PR auto-merges to main
10. daily-logs branch stays open for next day's logs
```

### Component Descriptions

**USDA FoodData Central MCP Server**
- Purpose: Provide access to 600,000+ validated food items with complete nutritional profiles
- Technology: MCP (Model Context Protocol) server running locally or remotely
- Integration: Direct use within Claude Code CLI via MCP framework
- Cost: FREE (USDA API is public domain)
- Coverage: Generic ingredients, many packaged foods, some restaurant chains

**Telegram Bot**
- Purpose: Provide text-based interface for food logging from any device
- Technology: Node.js serverless function (Railway/Vercel), Telegram Bot API, Claude API
- Features:
  - Text input for food descriptions
  - Image upload for screenshot-based nutrition extraction
  - Daily summary queries
  - Direct commits to GitHub repository
- Cost: ~$1.50/month (Claude API usage only, Telegram is FREE)

**Daily Batch PR Automation**
- Purpose: Eliminate manual PR creation and approval for food logs
- Technology: GitHub Actions (stefanzweifel/git-auto-commit-action, gh CLI)
- Features:
  - Configurable schedule (default: 23:45 UTC daily)
  - Auto-commit, auto-PR, auto-merge
  - Validates YAML before merge
  - Preserves full git history
- Cost: FREE (GitHub Actions free tier: 2,000 minutes/month)

---

## Prerequisites

### Required Accounts

1. **GitHub Account**
   - Already have: Repository owner access to nutrition-tracker-skill
   - Needed: GitHub token with `repo` and `workflow` scopes (Actions will use built-in GITHUB_TOKEN)

2. **Anthropic Account** (for Telegram bot)
   - Sign up: https://console.anthropic.com/
   - Create API key: https://console.anthropic.com/settings/keys
   - Pricing: https://www.anthropic.com/pricing
   - Recommendation: Start with standard tier (pay-as-you-go)
   - Expected cost: ~$1.50/month for 300 food logs

3. **USDA FoodData Central Account** (FREE)
   - Sign up: https://fdc.nal.usda.gov/api-key-signup.html
   - Takes <5 minutes
   - No credit card required
   - API key sent via email immediately

4. **Telegram Account** (for bot interface)
   - Install: https://telegram.org/
   - Available on iOS, Android, Desktop, Web
   - FREE

5. **BotFather Access** (create Telegram bot)
   - Built into Telegram, search for "@BotFather"
   - FREE

6. **Railway or Vercel Account** (serverless hosting)
   - Railway: https://railway.app/ (free tier: $5 credit/month)
   - Vercel: https://vercel.com/ (free tier: unlimited hobby projects)
   - Recommendation: Railway (better for long-running services)
   - No credit card required for free tier

### Required Tools

1. **git** (already installed, required for repository access)
2. **gh CLI** (GitHub CLI, for PR automation)
   - Install: https://cli.github.com/
   - Verify: `gh --version`
   - Authenticate: `gh auth login`

3. **Node.js 18+** (for Telegram bot development)
   - Install: https://nodejs.org/
   - Verify: `node --version`
   - Recommendation: Use nvm for version management

4. **npm or yarn** (comes with Node.js)
   - Verify: `npm --version`

5. **Claude Code CLI** (already installed and in use)

### Required Permissions

1. **GitHub Repository**
   - Write access to nutrition-tracker-skill
   - Ability to create branches
   - Ability to enable GitHub Actions
   - Ability to configure repository secrets (for Telegram bot deployment)

2. **API Keys to Collect**
   - Anthropic API key (from https://console.anthropic.com/settings/keys)
   - USDA FoodData Central API key (from email after signup)
   - Telegram bot token (from @BotFather)

---

## Cost Breakdown

### Setup Costs (One-Time)

| Item | Cost |
|------|------|
| GitHub account | FREE |
| Anthropic API account | FREE |
| USDA API registration | FREE |
| Telegram account | FREE |
| Railway/Vercel account | FREE |
| Domain (optional, for webhook) | $0 (Railway provides free subdomain) |
| **Total Setup Cost** | **$0** |

### Monthly Operating Costs

| Component | Usage | Unit Cost | Monthly Cost |
|-----------|-------|-----------|--------------|
| **USDA API** | Unlimited | FREE | $0.00 |
| **Telegram messaging** | Unlimited | FREE | $0.00 |
| **GitHub Actions** | ~30 workflow runs/month @ 1-2 min each | FREE (within 2,000 min/month limit) | $0.00 |
| **Railway/Vercel hosting** | Serverless function | FREE (within free tier limits) | $0.00 |
| **Claude API** (estimated for 300 food logs/month) | | | |
| - Input tokens | ~500 tokens/log × 300 = 150k tokens | $3/million | $0.45 |
| - Output tokens | ~200 tokens/log × 300 = 60k tokens | $15/million | $0.90 |
| - Vision API (if using screenshots 50 times/month) | ~2k tokens/image × 50 = 100k tokens | $3/million | $0.30 |
| **Total Monthly Cost** | | | **~$1.65** |

**Note**: Claude API costs are estimates. Actual costs will vary based on:
- Number of food logs per day (estimate assumes ~10/day)
- Complexity of food descriptions (longer descriptions = more tokens)
- Frequency of screenshot uploads vs text input
- Use of prompt caching (can reduce costs by 90% for repeated context)

### Cost Optimization Opportunities

1. **Prompt Caching**: Enable Claude API prompt caching to cache the SKILL.md context (saves 90% on input tokens for repeated requests)
2. **Use Haiku for Simple Logs**: For straightforward logs like "200g chicken breast", use Claude Haiku 3.5 ($0.25/$1.25 per million tokens) instead of Sonnet
3. **Batch Processing**: Group multiple food items in one message to reduce API calls

**Optimized Monthly Cost**: ~$0.50-1.00/month

---

---

## Navigation

- [↑ Table of Contents](README.md)
- [Next: Phase 1 Foundation →](02-phase1-foundation.md)

**Related Sections**:
- [Phase 1: USDA Setup](02-phase1-foundation.md#11-usda-fooddata-central-setup)
- [Phase 2: Telegram Bot](03-phase2-telegram-setup.md)
