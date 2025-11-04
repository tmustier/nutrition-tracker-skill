# Nutrition Tracker Automation Implementation Guide

**Status**: Implementation Phase
**Last Updated**: 2025-11-04

## Merged already
- [x] 1.1 USDA FoodData Central Setup
- [x] 1.2 Daily Batch PR Automation

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
- Install USDA FoodData Central MCP Server for 600k+ validated food items (FREE)`
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

## Phase 1: Foundation (Week 1)

**Goals**:
- Enable USDA nutrition lookups in Claude Code
- Automate daily PR workflow
- Solve pain points #1 and #2

**Time Estimate**: 4-6 hours total

---

### 1.1 USDA FoodData Central Setup

#### 1.1.1 Register for USDA API Key

**Steps**:
1. Visit https://fdc.nal.usda.gov/api-key-signup.html
2. Fill out form:
   - Name: Your name
   - Email: Your email
   - Organization: Personal / Individual (or leave blank)
   - Intended Use: "Personal nutrition tracking and research"
3. Submit form
4. Check email for API key (arrives within minutes)
5. Save API key securely (you'll need it in next step)

**Time**: 5 minutes

#### 1.1.2 Install USDA MCP Server

**Option A: Using npm (Recommended)**

```bash
# Install globally
npm install -g @jlfwong/food-data-central-mcp-server

# Or install as dev dependency in this repo
npm install --save-dev @jlfwong/food-data-central-mcp-server
```

**Option B: Using alternative Python MCP server**

```bash
# Clone repository
git clone https://github.com/zen-apps/mcp-nutrition-tools.git
cd mcp-nutrition-tools

# Install dependencies
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env and add: USDA_API_KEY=your_key_here
```

**Time**: 5 minutes

#### 1.1.3 Configure Claude Code to Use MCP Server

**Location**: Claude Code MCP configuration file (depends on installation)

**For Claude Desktop** (if using Claude Desktop instead of Claude Code CLI):
1. Open Claude Desktop settings
2. Navigate to "Developer" → "Model Context Protocol"
3. Add new MCP server:
   ```json
   {
     "food-data-central": {
       "command": "npx",
       "args": [
         "@jlfwong/food-data-central-mcp-server",
         "--api-key",
         "YOUR_USDA_API_KEY"
       ]
     }
   }
   ```
4. Restart Claude Desktop

**For Claude Code CLI**:
- Check Claude Code documentation for MCP server configuration
- Typically in `~/.config/claude-code/mcp-servers.json` or similar
- Add similar configuration as above

**Alternative: Direct API Usage** (if MCP installation is problematic):
- Use USDA API directly via HTTP requests
- API documentation: https://fdc.nal.usda.gov/api-guide.html
- Endpoint: `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=YOUR_KEY&query=chicken+breast`
- Response includes full nutritional data

**Time**: 10 minutes

#### 1.1.4 Test USDA Lookup

**Test Cases**:

```bash
# Test 1: Search for chicken breast
curl "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=YOUR_KEY&query=chicken+breast&dataType=Foundation,SR%20Legacy&pageSize=5"

# Expected: Returns list of chicken breast items with FDC IDs

# Test 2: Get detailed nutrition for specific food
curl "https://api.nal.usda.gov/fdc/v1/food/171477?api_key=YOUR_KEY"

# Expected: Returns complete nutritional breakdown for FDC ID 171477
```

**Via Claude Code** (if MCP server configured):
1. Open Claude Code
2. Ask: "Use the USDA Food Data Central to look up nutritional information for 200g grilled chicken breast"
3. Expected: Claude uses MCP server to query API and returns detailed nutrition data

**Success Criteria**:
- ✅ API returns valid JSON responses
- ✅ Nutritional data includes all required fields (protein, fat, carbs, micronutrients)
- ✅ Claude Code can access USDA data via MCP (if configured)

**Time**: 10 minutes

#### 1.1.5 Document Screenshot Fallback Method

Since direct image upload to Claude Code CLI is not currently supported, we'll document the screenshot method for use via Telegram bot (implemented in Phase 2).

**Create documentation file**:

```bash
# Add to a venue's RESEARCH.md file as an example
echo "
## Screenshot Method for Blocked Websites

If a website blocks automated access (403 errors), use this fallback:

1. **Manual Screenshot**:
   - Open website/app on your device (e.g., Deliveroo app)
   - Navigate to menu item with nutrition information
   - Take screenshot (ensure nutrition facts are visible and legible)

2. **Via Telegram Bot** (after Phase 2 implementation):
   - Send screenshot to Telegram bot
   - Bot will use Claude Vision to extract nutrition data
   - Structured data will be logged automatically

3. **Via Claude Code Web/iOS**:
   - Upload screenshot directly to Claude Code
   - Ask Claude to extract nutrition data
   - Manually log the extracted data

**Best Practices**:
- Ensure good lighting and focus
- Include full nutrition label if available
- Capture portion size information
- Note the date (nutrition info can change)
" >> data/food-data-bank/venues/jean-georges-connaught/RESEARCH.md
```

**Time**: 10 minutes

---

### 1.2 Daily Batch PR Automation

#### 1.2.1 Create Long-Lived daily-logs Branch

**Steps**:

```bash
# Navigate to repository
cd /home/user/nutrition-tracker-skill

# Ensure we're on main and up-to-date
git checkout main
git pull origin main

# Create new branch for daily logs
git checkout -b daily-logs

# Push to remote to create remote branch
git push -u origin daily-logs

# Verify branch exists
git branch -a | grep daily-logs
```

**Success Criteria**:
- ✅ Local branch `daily-logs` exists
- ✅ Remote branch `origin/daily-logs` exists
- ✅ Branch is up-to-date with main

**Time**: 5 minutes

#### 1.2.2 Create GitHub Actions Workflow for Daily Batch Commits

**File**: `.github/workflows/daily-food-log-commit.yml`

**Content**:

```yaml
name: Daily Food Log Batch

on:
  # Run daily at 23:45 UTC (configurable)
  schedule:
    - cron: '45 23 * * *'

  # Allow manual trigger for testing or immediate commits
  workflow_dispatch:
    inputs:
      custom_message:
        description: 'Custom commit message (optional)'
        required: false
        type: string

jobs:
  commit-and-pr:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write

    steps:
      - name: Checkout daily-logs branch
        uses: actions/checkout@v4
        with:
          ref: daily-logs
          fetch-depth: 0

      - name: Configure git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

      - name: Merge latest main to avoid conflicts
        run: |
          git fetch origin main
          git merge origin/main --no-edit || {
            echo "Merge conflict detected. Manual intervention required."
            exit 1
          }

      - name: Check for changes
        id: check_changes
        run: |
          if [[ -n $(git status --porcelain data/logs/) ]]; then
            echo "has_changes=true" >> $GITHUB_OUTPUT
          else
            echo "has_changes=false" >> $GITHUB_OUTPUT
          fi

      - name: Commit changes
        if: steps.check_changes.outputs.has_changes == 'true'
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: ${{ inputs.custom_message || format('chore: Daily nutrition logs - {0}', github.event.schedule && 'auto' || 'manual') }}
          branch: daily-logs
          file_pattern: 'data/logs/**/*.yaml'
          commit_user_name: github-actions[bot]
          commit_user_email: github-actions[bot]@users.noreply.github.com

      - name: Create or update PR
        if: steps.check_changes.outputs.has_changes == 'true'
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          # Check if PR already exists
          PR_NUMBER=$(gh pr list --base main --head daily-logs --json number --jq '.[0].number')

          if [ -z "$PR_NUMBER" ]; then
            echo "Creating new PR..."
            gh pr create \
              --title "Daily Food Logs - $(date +%Y-%m-%d)" \
              --body "🍽️ **Automated daily batch commit of food logs**

              This PR contains food logs from the daily-logs branch.

              ## Summary
              - Branch: \`daily-logs\`
              - Automated via GitHub Actions
              - Validation will run before merge

              ## Safe to Auto-Merge
              This PR is automatically created and will auto-merge once validation passes.

              ---
              *Generated by [daily-food-log-commit workflow](../.github/workflows/daily-food-log-commit.yml)*" \
              --label "automerge:food-log" \
              --base main \
              --head daily-logs

            # Get the newly created PR number
            PR_NUMBER=$(gh pr list --base main --head daily-logs --json number --jq '.[0].number')
          else
            echo "PR #$PR_NUMBER already exists, it will be automatically updated."
          fi

          # Enable auto-merge (squash merge to keep main history clean)
          if [ -n "$PR_NUMBER" ]; then
            gh pr merge $PR_NUMBER --auto --squash || echo "Auto-merge may already be enabled or checks haven't started yet"
          fi

      - name: Summary
        if: steps.check_changes.outputs.has_changes == 'true'
        run: |
          echo "✅ Successfully committed changes and created/updated PR"
          echo "PR will auto-merge once validation passes"

      - name: No changes
        if: steps.check_changes.outputs.has_changes == 'false'
        run: |
          echo "ℹ️ No changes detected in data/logs/, skipping commit"
```

**Create the file**:

```bash
# Create the workflow file
cat > .github/workflows/daily-food-log-commit.yml << 'EOF'
[paste content above]
EOF

# Commit the workflow
git add .github/workflows/daily-food-log-commit.yml
git commit -m "feat: Add daily batch commit workflow for food logs"
git push origin main
```

**Time**: 15 minutes

#### 1.2.3 Create Manual Commit Workflow (Optional but Recommended)

This allows you to trigger commits manually when needed (e.g., mid-day if you want to merge early).

**File**: `.github/workflows/manual-log-commit.yml`

**Content**:

```yaml
name: Manual Food Log Commit

on:
  workflow_dispatch:
    inputs:
      commit_message:
        description: 'Commit message (optional - will use timestamp if empty)'
        required: false
        type: string

jobs:
  commit:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout daily-logs branch
        uses: actions/checkout@v4
        with:
          ref: daily-logs

      - name: Commit changes
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: ${{ inputs.commit_message || format('chore: Manual food log commit - {0}', github.run_id) }}
          branch: daily-logs
          file_pattern: 'data/logs/**/*.yaml'
          commit_user_name: github-actions[bot]
          commit_user_email: github-actions[bot]@users.noreply.github.com
```

**Create the file**:

```bash
cat > .github/workflows/manual-log-commit.yml << 'EOF'
[paste content above]
EOF

git add .github/workflows/manual-log-commit.yml
git commit -m "feat: Add manual commit workflow for food logs"
git push origin main
```

**Time**: 5 minutes

#### 1.2.4 Update Validation Workflow (Optional Optimization)

Your existing `validate.yml` workflow runs on all PR changes. We can optimize it to skip full validation for log-only changes (since logs are append-only and less risky than data bank changes).

**File**: `.github/workflows/validate.yml` (existing file, update)

**Add this job**:

```yaml
  # Add after existing jobs
  quick-validate-logs:
    if: contains(github.event.pull_request.labels.*.name, 'automerge:food-log')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install pyyaml
      - name: Quick YAML validation (logs only)
        run: |
          # Simple YAML syntax check (faster than full validation)
          python -c "
          import yaml
          import sys
          from pathlib import Path

          errors = []
          for log_file in Path('data/logs').rglob('*.yaml'):
              try:
                  with open(log_file) as f:
                      yaml.safe_load(f)
              except Exception as e:
                  errors.append(f'{log_file}: {e}')

          if errors:
              print('YAML validation errors:')
              for err in errors:
                  print(err)
              sys.exit(1)
          else:
              print('✅ All log files are valid YAML')
          "
```

**Note**: Only implement this optimization if you find the full validation takes too long. The existing validation is safer.

**Time**: 10 minutes (optional)

#### 1.2.5 Test the Workflow

**Test 1: Manual Trigger**

```bash
# 1. Checkout daily-logs branch
git checkout daily-logs

# 2. Create a test log entry
mkdir -p data/logs/2025-11/test
cat > data/logs/2025-11/test/99.yaml << 'EOF'
date: 2025-11-99
day_type: rest

entries:
  - timestamp: "2025-11-99T12:00:00+00:00"
    items:
      - name: "Test Food Item"
        food_bank_id: null
        quantity: 1
        unit: portion
        nutrition:
          energy_kcal: 100
          protein_g: 10
          fat_g: 5
          sat_fat_g: 1
          mufa_g: 2
          pufa_g: 1
          trans_fat_g: 0
          cholesterol_mg: 0
          sugar_g: 2
          fiber_total_g: 3
          fiber_soluble_g: 1
          fiber_insoluble_g: 2
          carbs_total_g: 15
          carbs_available_g: 10
          sodium_mg: 100
          potassium_mg: 200
          iodine_ug: 0
          magnesium_mg: 50
          calcium_mg: 100
          iron_mg: 2
          zinc_mg: 1
          vitamin_c_mg: 10
          manganese_mg: 0
          polyols_g: 0
    notes: "Test entry for workflow validation"
EOF

# 3. DON'T commit yet - let workflow handle it

# 4. Trigger manual workflow
gh workflow run manual-log-commit.yml --ref daily-logs \
  -f commit_message="test: Validate daily batch workflow"

# 5. Watch workflow execution
gh run watch

# 6. Check if commit was created
git fetch origin daily-logs
git log origin/daily-logs --oneline -n 5
```

**Expected Result**:
- ✅ Workflow completes successfully
- ✅ Commit appears on daily-logs branch
- ✅ Test file is committed

**Test 2: Scheduled Trigger (Simulate)**

Since we can't easily test the scheduled run (would have to wait until 23:45 UTC), we'll trigger it manually to simulate:

```bash
# Trigger the daily batch workflow manually
gh workflow run daily-food-log-commit.yml --ref daily-logs

# Watch execution
gh run watch

# Check if PR was created
gh pr list --base main --head daily-logs

# Check PR details
gh pr view <PR_NUMBER>
```

**Expected Result**:
- ✅ Workflow completes successfully
- ✅ PR is created from daily-logs to main
- ✅ PR has label "automerge:food-log"
- ✅ Auto-merge is enabled
- ✅ Validation workflow runs
- ✅ PR merges automatically after validation passes

**Test 3: Clean Up Test Data**

```bash
# Remove test data
git checkout daily-logs
rm -rf data/logs/2025-11/test
git add data/logs/2025-11/test
git commit -m "chore: Remove test data"
git push origin daily-logs

# Close test PR if it's still open
gh pr close <PR_NUMBER> --delete-branch=false
```

**Success Criteria for Phase 1**:
- ✅ USDA API key obtained and working
- ✅ USDA MCP server installed and configured (or direct API access documented)
- ✅ Can query USDA database for nutrition information
- ✅ daily-logs branch created and pushed
- ✅ Daily batch commit workflow created and tested
- ✅ Manual commit workflow created and tested
- ✅ Workflows successfully create commits and PRs
- ✅ Auto-merge works after validation passes

**Time**: 1-2 hours total for all testing

---

## Phase 2: Telegram Bot (Week 2-3)

**Goals**:
- Create Telegram bot for text-based food logging
- Integrate with Claude API for nutrition processing
- Enable screenshot uploads for blocked websites
- Automate git commits via GitHub API
- Solve pain point #3

**Time Estimate**: 8-12 hours total

---

### 2.1 Create Telegram Bot

#### 2.1.1 Set Up Bot via BotFather

**Steps**:

1. Open Telegram app (on any device)
2. Search for "@BotFather" (official bot creation tool)
3. Start chat with BotFather: `/start`
4. Create new bot: `/newbot`
5. Follow prompts:
   - Bot display name: "Thomas Nutrition Tracker" (or your preferred name)
   - Bot username: Must end in "bot", e.g., "thomas_nutrition_bot" (must be unique)
6. BotFather responds with:
   - Bot token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
   - Save this token securely - you'll need it for deployment
7. Set bot description (optional):
   ```
   /setdescription
   Select your bot
   Enter: "Personal nutrition tracking assistant. Log food, get nutrition breakdowns, track daily progress."
   ```
8. Set bot commands (optional but recommended):
   ```
   /setcommands
   Select your bot
   Enter:
   start - Start the bot
   help - Show help message
   today - Get today's nutrition summary
   week - Get this week's summary
   cancel - Cancel current operation
   ```

**Save**:
- Bot username: `@your_bot_username`
- Bot token: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

**Time**: 5 minutes

#### 2.1.2 Test Bot Connection

```bash
# Test that bot token works
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe

# Expected response:
# {"ok":true,"result":{"id":123456789,"is_bot":true,"first_name":"Thomas Nutrition Tracker","username":"thomas_nutrition_bot"}}
```

**Success Criteria**:
- ✅ Bot created with unique username
- ✅ Token received from BotFather
- ✅ API call to getMe returns bot information

**Time**: 5 minutes

---

### 2.2 Build Serverless Function

#### 2.2.1 Create Project Structure

```bash
# Navigate to automation folder
cd /home/user/nutrition-tracker-skill/automation

# Create bot project
mkdir telegram-bot
cd telegram-bot

# Initialize Node.js project
npm init -y

# Install dependencies
npm install telegraf axios dotenv js-yaml

# Install dev dependencies
npm install --save-dev @types/node

# Create project structure
mkdir src
touch src/webhook.js
touch src/claude-integration.js
touch src/github-integration.js
touch src/usda-api.js
touch src/config.js
touch .env.example
touch .env
touch README.md
```

**Time**: 5 minutes

#### 2.2.2 Create Configuration File

**File**: `src/config.js`

```javascript
// src/config.js
require('dotenv').config();

module.exports = {
  // Telegram Configuration
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    webhookUrl: process.env.WEBHOOK_URL, // Will be provided by Railway/Vercel
  },

  // Anthropic Claude API
  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
    maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS) || 4096,
  },

  // GitHub Configuration
  github: {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER || 'tmustier',
    repo: process.env.GITHUB_REPO || 'nutrition-tracker-skill',
    branch: process.env.GITHUB_BRANCH || 'daily-logs',
  },

  // USDA FoodData Central API
  usda: {
    apiKey: process.env.USDA_API_KEY,
    baseUrl: 'https://api.nal.usda.gov/fdc/v1',
  },

  // Nutrition Skill Context (embedded SKILL.md content)
  skillContext: `You are a nutrition tracking assistant for Thomas. Your task is to help log food intake and provide nutrition analysis.

## Your Capabilities:
1. Estimate nutrition for foods (generic ingredients via USDA API, or restaurant dishes via data bank)
2. Log food consumption to YAML files
3. Provide daily nutrition summaries
4. Track progress against targets

## User Profile:
- Name: Thomas
- Age: 30
- Height: 183cm
- Weight: ~85kg
- Targets (from references/health-profile.yaml):
  - Rest day: 2,500 kcal max
  - Training day: 2,900 kcal max
  - Protein: 170g minimum
  - Fat: 70g minimum
  - Carbs: 250g minimum
  - Fiber: 40g minimum

## Workflow:
When user messages you with food they ate:
1. Parse the food description
2. Check if it's a generic ingredient → query USDA API
3. Check if it's a known restaurant dish → reference data bank
4. If unknown → estimate based on similar foods
5. Return structured JSON with complete nutrition data (all 24 fields required)
6. Bot will then log to YAML and commit to GitHub

## Response Format:
Always respond with JSON in this format:
\`\`\`json
{
  "success": true,
  "message": "Logged ✓. [Food name]: [kcal] kcal, [protein]g protein. Today: [total_kcal]/[target] kcal, [total_protein]/170g protein. Still need [remaining_kcal] kcal, [remaining_protein]g protein.",
  "nutrition": {
    "name": "Food name",
    "quantity": 1,
    "unit": "portion",
    "food_bank_id": null,
    "per_portion": {
      "energy_kcal": 0,
      "protein_g": 0,
      ... [all 24 required fields]
    }
  }
}
\`\`\`

Be concise and helpful. If unsure, ask clarifying questions.`,
};
```

**Time**: 10 minutes

#### 2.2.3 Create USDA API Integration

**File**: `src/usda-api.js`

```javascript
// src/usda-api.js
const axios = require('axios');
const config = require('./config');

class UsdaApi {
  constructor() {
    this.baseUrl = config.usda.baseUrl;
    this.apiKey = config.usda.apiKey;
  }

  /**
   * Search for foods by query string
   * @param {string} query - Search term (e.g., "chicken breast")
   * @param {number} pageSize - Number of results to return (default: 5)
   * @returns {Promise<Array>} Array of food items
   */
  async searchFoods(query, pageSize = 5) {
    try {
      const response = await axios.get(`${this.baseUrl}/foods/search`, {
        params: {
          api_key: this.apiKey,
          query: query,
          dataType: 'Foundation,SR Legacy', // Most reliable data types
          pageSize: pageSize,
        },
      });

      return response.data.foods || [];
    } catch (error) {
      console.error('USDA API search error:', error.message);
      throw new Error('Failed to search USDA database');
    }
  }

  /**
   * Get detailed nutrition information for a specific food by FDC ID
   * @param {number} fdcId - FoodData Central ID
   * @returns {Promise<Object>} Detailed food information
   */
  async getFoodDetails(fdcId) {
    try {
      const response = await axios.get(`${this.baseUrl}/food/${fdcId}`, {
        params: {
          api_key: this.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error('USDA API detail error:', error.message);
      throw new Error('Failed to get food details from USDA');
    }
  }

  /**
   * Parse USDA nutrition data into our standard format
   * @param {Object} usdaFood - USDA food object
   * @param {number} grams - Serving size in grams
   * @returns {Object} Standardized nutrition object
   */
  parseNutrition(usdaFood, grams = 100) {
    const nutrients = {};

    // USDA uses nutrient IDs, map them to our field names
    const nutrientMapping = {
      1008: 'energy_kcal',
      1003: 'protein_g',
      1004: 'fat_g',
      1258: 'sat_fat_g',
      1292: 'mufa_g',
      1293: 'pufa_g',
      1257: 'trans_fat_g',
      1253: 'cholesterol_mg',
      2000: 'sugar_g',
      1079: 'fiber_total_g',
      1005: 'carbs_total_g',
      1093: 'sodium_mg',
      1092: 'potassium_mg',
      1095: 'zinc_mg',
      1162: 'vitamin_c_mg',
      1089: 'iron_mg',
      1087: 'calcium_mg',
      1090: 'magnesium_mg',
    };

    // Extract nutrients from USDA data
    if (usdaFood.foodNutrients) {
      usdaFood.foodNutrients.forEach(nutrient => {
        const fieldName = nutrientMapping[nutrient.nutrientId];
        if (fieldName) {
          // Scale to requested serving size
          const value = (nutrient.value || 0) * (grams / 100);
          nutrients[fieldName] = parseFloat(value.toFixed(2));
        }
      });
    }

    // Fill in missing required fields with 0
    const requiredFields = [
      'energy_kcal', 'protein_g', 'fat_g', 'sat_fat_g', 'mufa_g', 'pufa_g',
      'trans_fat_g', 'cholesterol_mg', 'sugar_g', 'fiber_total_g',
      'fiber_soluble_g', 'fiber_insoluble_g', 'carbs_total_g',
      'carbs_available_g', 'sodium_mg', 'potassium_mg', 'iodine_ug',
      'magnesium_mg', 'calcium_mg', 'iron_mg', 'zinc_mg', 'vitamin_c_mg',
      'manganese_mg', 'polyols_g'
    ];

    requiredFields.forEach(field => {
      if (!(field in nutrients)) {
        nutrients[field] = 0;
      }
    });

    // Calculate derived fields
    if (!nutrients.carbs_available_g) {
      nutrients.carbs_available_g = Math.max(0,
        nutrients.carbs_total_g - nutrients.fiber_total_g - nutrients.polyols_g
      );
    }

    return nutrients;
  }

  /**
   * Quick lookup: search and return best match with nutrition data
   * @param {string} query - Food description (e.g., "200g chicken breast grilled")
   * @returns {Promise<Object>} Nutrition data and metadata
   */
  async quickLookup(query) {
    // Extract quantity and unit if present
    const quantityMatch = query.match(/(\d+)\s*(g|grams?|oz|ounces?|lb|pounds?)/i);
    let grams = 100; // Default serving size

    if (quantityMatch) {
      const amount = parseInt(quantityMatch[1]);
      const unit = quantityMatch[2].toLowerCase();

      // Convert to grams
      if (unit.startsWith('oz')) {
        grams = amount * 28.35;
      } else if (unit.startsWith('lb') || unit.startsWith('pound')) {
        grams = amount * 453.592;
      } else {
        grams = amount;
      }
    }

    // Search for food
    const results = await this.searchFoods(query, 5);

    if (results.length === 0) {
      return {
        success: false,
        message: 'No USDA data found for this food',
      };
    }

    // Get best match (first result is usually most relevant)
    const bestMatch = results[0];
    const details = await this.getFoodDetails(bestMatch.fdcId);
    const nutrition = this.parseNutrition(details, grams);

    return {
      success: true,
      food_name: bestMatch.description,
      fdc_id: bestMatch.fdcId,
      serving_grams: grams,
      nutrition: nutrition,
      source: 'USDA FoodData Central',
      confidence: 'high',
    };
  }
}

module.exports = new UsdaApi();
```

**Time**: 30 minutes

#### 2.2.4 Create Claude API Integration

**File**: `src/claude-integration.js`

```javascript
// src/claude-integration.js
const axios = require('axios');
const config = require('./config');
const usdaApi = require('./usda-api');

class ClaudeIntegration {
  constructor() {
    this.apiKey = config.claude.apiKey;
    this.model = config.claude.model;
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
  }

  /**
   * Process food logging request with Claude API
   * @param {string} userMessage - User's food description
   * @param {string} userId - Telegram user ID (for context)
   * @returns {Promise<Object>} Processed nutrition data
   */
  async processFoodLog(userMessage, userId) {
    try {
      // First, try USDA quick lookup for generic foods
      const keywords = ['chicken', 'beef', 'salmon', 'rice', 'oats', 'egg', 'milk', 'bread', 'banana', 'apple'];
      const isGenericFood = keywords.some(kw => userMessage.toLowerCase().includes(kw));

      let usdaResult = null;
      if (isGenericFood) {
        try {
          usdaResult = await usdaApi.quickLookup(userMessage);
          if (usdaResult.success) {
            console.log(`USDA lookup successful for: ${userMessage}`);
            return {
              success: true,
              source: 'usda',
              data: usdaResult,
            };
          }
        } catch (error) {
          console.log('USDA lookup failed, falling back to Claude:', error.message);
        }
      }

      // If USDA didn't work, use Claude for estimation
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          max_tokens: config.claude.maxTokens,
          system: config.skillContext,
          messages: [
            {
              role: 'user',
              content: `I just ate: ${userMessage}\n\nPlease estimate the complete nutrition data and return it in the JSON format specified in your instructions. If this is a generic ingredient and you couldn't find it in USDA, make your best estimate based on standard nutrition databases.`,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
          },
        }
      );

      // Extract JSON from Claude's response
      const claudeText = response.data.content[0].text;
      const jsonMatch = claudeText.match(/```json\n([\s\S]*?)\n```/);

      if (jsonMatch) {
        const nutritionData = JSON.parse(jsonMatch[1]);
        return {
          success: true,
          source: 'claude',
          data: nutritionData,
        };
      } else {
        // If Claude didn't return JSON, return the text response
        return {
          success: false,
          message: 'Could not parse nutrition data from Claude response',
          raw_response: claudeText,
        };
      }
    } catch (error) {
      console.error('Claude API error:', error.response?.data || error.message);
      throw new Error('Failed to process food log with Claude');
    }
  }

  /**
   * Process image (screenshot) with Claude Vision API
   * @param {Buffer} imageBuffer - Image data
   * @param {string} mimeType - Image MIME type (e.g., 'image/jpeg')
   * @returns {Promise<Object>} Extracted nutrition data
   */
  async processImage(imageBuffer, mimeType) {
    try {
      const base64Image = imageBuffer.toString('base64');

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          max_tokens: config.claude.maxTokens,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: mimeType,
                    data: base64Image,
                  },
                },
                {
                  type: 'text',
                  text: 'This is a screenshot of a menu item or nutrition label. Please extract all available nutrition information and return it in JSON format with these fields: name, serving_size, energy_kcal, protein_g, fat_g, carbs_total_g, and any other nutrients visible. If some nutrients are not shown, estimate them based on the food type.',
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
          },
        }
      );

      const claudeText = response.data.content[0].text;
      const jsonMatch = claudeText.match(/```json\n([\s\S]*?)\n```/);

      if (jsonMatch) {
        const extractedData = JSON.parse(jsonMatch[1]);
        return {
          success: true,
          source: 'claude_vision',
          data: extractedData,
        };
      } else {
        return {
          success: false,
          message: 'Could not extract structured data from image',
          raw_response: claudeText,
        };
      }
    } catch (error) {
      console.error('Claude Vision API error:', error.response?.data || error.message);
      throw new Error('Failed to process image with Claude Vision');
    }
  }

  /**
   * Get daily summary
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<string>} Summary message
   */
  async getDailySummary(date) {
    // This would read the log file and calculate totals
    // For now, return a placeholder
    return `Daily summary for ${date} - Feature coming soon!`;
  }
}

module.exports = new ClaudeIntegration();
```

**Time**: 30 minutes

#### 2.2.5 Create GitHub Integration

**File**: `src/github-integration.js`

```javascript
// src/github-integration.js
const axios = require('axios');
const yaml = require('js-yaml');
const config = require('./config');

class GitHubIntegration {
  constructor() {
    this.token = config.github.token;
    this.owner = config.github.owner;
    this.repo = config.github.repo;
    this.branch = config.github.branch;
    this.apiUrl = 'https://api.github.com';
  }

  /**
   * Get current date in YYYY-MM-DD format (UTC)
   * @returns {string} Date string
   */
  getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Get file path for today's log
   * @returns {string} Path to log file
   */
  getLogFilePath() {
    const date = this.getCurrentDate();
    const [year, month, day] = date.split('-');
    return `data/logs/${year}-${month}/${day}.yaml`;
  }

  /**
   * Read existing log file or create new one
   * @returns {Promise<Object>} Log data and file SHA (for updates)
   */
  async getOrCreateLogFile() {
    const path = this.getLogFilePath();
    const url = `${this.apiUrl}/repos/${this.owner}/${this.repo}/contents/${path}`;

    try {
      // Try to read existing file
      const response = await axios.get(url, {
        headers: {
          Authorization: `token ${this.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          ref: this.branch,
        },
      });

      // Decode content
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      const logData = yaml.load(content);

      return {
        exists: true,
        sha: response.data.sha,
        data: logData,
        path: path,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        // File doesn't exist, create new log structure
        const date = this.getCurrentDate();
        return {
          exists: false,
          sha: null,
          data: {
            date: date,
            day_type: 'rest', // Default, can be updated
            entries: [],
          },
          path: path,
        };
      } else {
        console.error('Error reading log file:', error.message);
        throw error;
      }
    }
  }

  /**
   * Append new entry to log file
   * @param {Object} nutritionData - Nutrition data to log
   * @returns {Promise<Object>} Commit result
   */
  async appendLogEntry(nutritionData) {
    try {
      // Get current log file
      const logFile = await this.getOrCreateLogFile();

      // Create new entry
      const now = new Date();
      const timestamp = now.toISOString();

      const newEntry = {
        timestamp: timestamp,
        items: [
          {
            name: nutritionData.name,
            food_bank_id: nutritionData.food_bank_id || null,
            quantity: nutritionData.quantity || 1,
            unit: nutritionData.unit || 'portion',
            nutrition: nutritionData.per_portion || nutritionData.nutrition,
          },
        ],
        notes: nutritionData.notes || null,
      };

      // Append to entries
      logFile.data.entries.push(newEntry);

      // Convert back to YAML
      const yamlContent = yaml.dump(logFile.data, {
        lineWidth: -1, // Don't wrap lines
        noRefs: true,
      });

      // Commit to GitHub
      const url = `${this.apiUrl}/repos/${this.owner}/${this.repo}/contents/${logFile.path}`;
      const commitMessage = `chore: Log food entry - ${nutritionData.name}`;

      const response = await axios.put(
        url,
        {
          message: commitMessage,
          content: Buffer.from(yamlContent).toString('base64'),
          branch: this.branch,
          sha: logFile.sha, // Required for updates, null for new files
        },
        {
          headers: {
            Authorization: `token ${this.token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      return {
        success: true,
        commit_sha: response.data.commit.sha,
        commit_url: response.data.commit.html_url,
      };
    } catch (error) {
      console.error('Error committing to GitHub:', error.response?.data || error.message);
      throw new Error('Failed to commit log entry to GitHub');
    }
  }

  /**
   * Calculate today's totals from log entries
   * @returns {Promise<Object>} Totals for today
   */
  async getTodaysTotals() {
    try {
      const logFile = await this.getOrCreateLogFile();

      if (!logFile.exists || logFile.data.entries.length === 0) {
        return {
          entries: 0,
          energy_kcal: 0,
          protein_g: 0,
          fat_g: 0,
          carbs_total_g: 0,
        };
      }

      // Sum up all entries
      const totals = {
        entries: logFile.data.entries.length,
        energy_kcal: 0,
        protein_g: 0,
        fat_g: 0,
        carbs_total_g: 0,
      };

      logFile.data.entries.forEach(entry => {
        entry.items.forEach(item => {
          const nutrition = item.nutrition;
          totals.energy_kcal += nutrition.energy_kcal || 0;
          totals.protein_g += nutrition.protein_g || 0;
          totals.fat_g += nutrition.fat_g || 0;
          totals.carbs_total_g += nutrition.carbs_total_g || 0;
        });
      });

      // Round to 1 decimal place
      Object.keys(totals).forEach(key => {
        if (typeof totals[key] === 'number') {
          totals[key] = Math.round(totals[key] * 10) / 10;
        }
      });

      return totals;
    } catch (error) {
      console.error('Error calculating totals:', error.message);
      return {
        entries: 0,
        energy_kcal: 0,
        protein_g: 0,
        fat_g: 0,
        carbs_total_g: 0,
      };
    }
  }
}

module.exports = new GitHubIntegration();
```

**Time**: 30 minutes

#### 2.2.6 Create Main Webhook Handler

**File**: `src/webhook.js`

```javascript
// src/webhook.js
const { Telegraf } = require('telegraf');
const axios = require('axios');
const config = require('./config');
const claudeIntegration = require('./claude-integration');
const githubIntegration = require('./github-integration');

// Initialize bot
const bot = new Telegraf(config.telegram.botToken);

// Start command
bot.command('start', async (ctx) => {
  await ctx.reply(
    '🍽️ Welcome to Thomas Nutrition Tracker!\n\n' +
    'Send me what you ate, and I\'ll log it for you.\n\n' +
    'Examples:\n' +
    '• "Just had 200g grilled chicken breast"\n' +
    '• "2 poached eggs with sourdough at L\'ETO"\n' +
    '• Send a screenshot of a menu for nutrition extraction\n\n' +
    'Commands:\n' +
    '/today - Get today\'s summary\n' +
    '/help - Show this help message'
  );
});

// Help command
bot.command('help', async (ctx) => {
  await ctx.reply(
    '📖 How to use:\n\n' +
    '1. Text me what you ate (e.g., "salmon poke bowl")\n' +
    '2. Send a screenshot of nutrition info\n' +
    '3. Use /today to see your daily totals\n\n' +
    'I\'ll automatically log everything to your nutrition tracker!'
  );
});

// Today's summary command
bot.command('today', async (ctx) => {
  try {
    await ctx.reply('📊 Calculating today\'s totals...');

    const totals = await githubIntegration.getTodaysTotals();
    const targets = {
      energy_kcal: 2500, // Rest day default
      protein_g: 170,
      fat_g: 70,
      carbs_total_g: 250,
    };

    const remaining = {
      energy_kcal: Math.max(0, targets.energy_kcal - totals.energy_kcal),
      protein_g: Math.max(0, targets.protein_g - totals.protein_g),
    };

    const message =
      `📊 Today's Totals (${totals.entries} entries)\n\n` +
      `✅ Energy: ${totals.energy_kcal}/${targets.energy_kcal} kcal\n` +
      `✅ Protein: ${totals.protein_g}/${targets.protein_g}g\n` +
      `✅ Fat: ${totals.fat_g}/${targets.fat_g}g\n` +
      `✅ Carbs: ${totals.carbs_total_g}/${targets.carbs_total_g}g\n\n` +
      `📉 Still need:\n` +
      `• ${remaining.energy_kcal} kcal\n` +
      `• ${remaining.protein_g}g protein`;

    await ctx.reply(message);
  } catch (error) {
    console.error('Error in /today command:', error);
    await ctx.reply('❌ Error calculating totals. Please try again.');
  }
});

// Handle text messages (food logging)
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  const userId = ctx.from.id;

  // Ignore commands
  if (userMessage.startsWith('/')) {
    return;
  }

  try {
    // Send "processing" message
    const processingMsg = await ctx.reply('🔍 Processing...');

    // Process with Claude/USDA
    const result = await claudeIntegration.processFoodLog(userMessage, userId);

    if (!result.success) {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        '❌ Could not process food log. Please try again with more details.'
      );
      return;
    }

    // Extract nutrition data
    let nutritionData;
    if (result.source === 'usda') {
      nutritionData = {
        name: result.data.food_name,
        quantity: result.data.serving_grams,
        unit: 'g',
        food_bank_id: null,
        per_portion: result.data.nutrition,
      };
    } else if (result.source === 'claude') {
      nutritionData = result.data.nutrition;
    }

    // Commit to GitHub
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMsg.message_id,
      null,
      '💾 Logging to database...'
    );

    const commitResult = await githubIntegration.appendLogEntry(nutritionData);

    // Get updated totals
    const totals = await githubIntegration.getTodaysTotals();
    const targets = { energy_kcal: 2500, protein_g: 170 };
    const remaining = {
      energy_kcal: Math.max(0, targets.energy_kcal - totals.energy_kcal),
      protein_g: Math.max(0, targets.protein_g - totals.protein_g),
    };

    // Send success message
    const successMessage =
      `✅ Logged: ${nutritionData.name}\n\n` +
      `📊 This meal:\n` +
      `• ${nutritionData.per_portion.energy_kcal} kcal\n` +
      `• ${nutritionData.per_portion.protein_g}g protein\n` +
      `• ${nutritionData.per_portion.fat_g}g fat\n` +
      `• ${nutritionData.per_portion.carbs_total_g}g carbs\n\n` +
      `📈 Today's totals:\n` +
      `• ${totals.energy_kcal}/${targets.energy_kcal} kcal\n` +
      `• ${totals.protein_g}/${targets.protein_g}g protein\n\n` +
      `📉 Still need: ${remaining.energy_kcal} kcal, ${remaining.protein_g}g protein`;

    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMsg.message_id,
      null,
      successMessage
    );
  } catch (error) {
    console.error('Error processing text message:', error);
    await ctx.reply('❌ Error logging food. Please try again or contact support.');
  }
});

// Handle images (screenshots)
bot.on('photo', async (ctx) => {
  try {
    await ctx.reply('📸 Processing screenshot...');

    // Get highest resolution photo
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const fileId = photo.file_id;

    // Download photo
    const fileLink = await ctx.telegram.getFileLink(fileId);
    const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);

    // Process with Claude Vision
    const result = await claudeIntegration.processImage(imageBuffer, 'image/jpeg');

    if (!result.success) {
      await ctx.reply('❌ Could not extract nutrition data from image. Please try with a clearer photo or text description.');
      return;
    }

    // Log the extracted data (similar flow as text messages)
    await ctx.reply('💾 Logging extracted data...');

    const nutritionData = result.data;
    await githubIntegration.appendLogEntry(nutritionData);

    const totals = await githubIntegration.getTodaysTotals();
    const targets = { energy_kcal: 2500, protein_g: 170 };

    await ctx.reply(
      `✅ Logged from screenshot: ${nutritionData.name}\n\n` +
      `📊 ${nutritionData.energy_kcal} kcal, ${nutritionData.protein_g}g protein\n\n` +
      `Today: ${totals.energy_kcal}/${targets.energy_kcal} kcal, ${totals.protein_g}/${targets.protein_g}g protein`
    );
  } catch (error) {
    console.error('Error processing photo:', error);
    await ctx.reply('❌ Error processing screenshot. Please try again.');
  }
});

// Export for serverless deployment
module.exports = {
  // Railway/Vercel entry point
  handler: async (req, res) => {
    try {
      // Set webhook on first deployment
      if (req.method === 'GET' && req.url === '/setup') {
        const webhookUrl = config.telegram.webhookUrl + '/webhook';
        await bot.telegram.setWebhook(webhookUrl);
        res.status(200).json({ message: 'Webhook set', url: webhookUrl });
        return;
      }

      // Handle webhook updates
      if (req.method === 'POST' && req.url === '/webhook') {
        await bot.handleUpdate(req.body);
        res.status(200).json({ ok: true });
        return;
      }

      res.status(404).json({ error: 'Not found' });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Express.js compatibility (optional)
  expressHandler: async (req, res) => {
    await module.exports.handler(req, res);
  },
};
```

**Time**: 45 minutes

#### 2.2.7 Create Environment Configuration

**File**: `.env.example`

```bash
# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
WEBHOOK_URL=https://your-app.railway.app

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=4096

# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=tmustier
GITHUB_REPO=nutrition-tracker-skill
GITHUB_BRANCH=daily-logs

# USDA FoodData Central API
USDA_API_KEY=your_usda_api_key
```

**File**: `.gitignore` (add to project)

```
node_modules/
.env
.DS_Store
*.log
```

**Create your actual .env file**:
```bash
cp .env.example .env
# Edit .env and fill in your actual values
```

**Time**: 5 minutes

#### 2.2.8 Create package.json Scripts

**File**: `package.json` (update scripts section)

```json
{
  "name": "nutrition-tracker-telegram-bot",
  "version": "1.0.0",
  "description": "Telegram bot for nutrition tracking with Claude AI",
  "main": "src/webhook.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "node test/test-usda.js"
  },
  "keywords": ["telegram", "bot", "nutrition", "claude", "ai"],
  "author": "Thomas Mustier",
  "license": "Apache-2.0",
  "dependencies": {
    "telegraf": "^4.12.2",
    "axios": "^1.6.0",
    "dotenv": "^16.0.3",
    "js-yaml": "^4.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "nodemon": "^3.0.0"
  }
}
```

**Time**: 5 minutes

#### 2.2.9 Create Local Test Server (for development)

**File**: `server.js` (for local testing)

```javascript
// server.js - Local development server
require('dotenv').config();
const express = require('express');
const { handler } = require('./src/webhook');

const app = express();
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Nutrition Tracker Bot is running' });
});

// Setup webhook
app.get('/setup', async (req, res) => {
  await handler(req, res);
});

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  await handler(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Webhook URL: ${process.env.WEBHOOK_URL}/webhook`);
  console.log(`🔧 Setup webhook: GET ${process.env.WEBHOOK_URL}/setup`);
});
```

**Test locally**:
```bash
# Install dependencies
npm install

# Run local server
npm run dev

# In another terminal, use ngrok to expose localhost
npx ngrok http 3000

# Copy the ngrok URL (e.g., https://abc123.ngrok.io)
# Update .env: WEBHOOK_URL=https://abc123.ngrok.io

# Visit: https://abc123.ngrok.io/setup
# This sets the Telegram webhook

# Test by sending a message to your bot in Telegram
```

**Time**: 15 minutes for local testing

---

### 2.3 Deploy to Railway (or Vercel)

#### 2.3.1 Prepare for Deployment

**Create deployment configuration**:

**File**: `railway.json` (Railway-specific config)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**File**: `vercel.json` (Vercel-specific config)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

**Time**: 5 minutes

#### 2.3.2 Deploy to Railway

**Steps**:

1. **Create Railway account**: https://railway.app/
2. **Install Railway CLI** (optional):
   ```bash
   npm install -g @railway/cli
   railway login
   ```
3. **Create new project**:
   - Via web: Click "New Project" → "Deploy from GitHub repo"
   - Via CLI: `railway init` (in telegram-bot directory)
4. **Connect GitHub repository**:
   - Authorize Railway to access your repo
   - Select `nutrition-tracker-skill` repository
   - Set root directory to `/automation/telegram-bot`
5. **Configure environment variables**:
   - In Railway dashboard: Project → Variables
   - Add all variables from `.env.example`:
     - `TELEGRAM_BOT_TOKEN`
     - `ANTHROPIC_API_KEY`
     - `GITHUB_TOKEN`
     - `USDA_API_KEY`
     - `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`
     - `WEBHOOK_URL` (will be: `https://your-app.railway.app`)
6. **Deploy**:
   - Railway auto-deploys on push to main
   - Or manually: Click "Deploy" in dashboard
7. **Get deployment URL**:
   - Railway assigns a URL like: `https://your-app.railway.app`
   - Copy this URL
   - Update `WEBHOOK_URL` environment variable with this URL
   - Redeploy
8. **Set up webhook**:
   - Visit: `https://your-app.railway.app/setup`
   - Should see: `{"message":"Webhook set","url":"https://your-app.railway.app/webhook"}`

**Success Criteria**:
- ✅ Railway project created and deployed
- ✅ All environment variables set
- ✅ Webhook successfully registered with Telegram
- ✅ Health check endpoint returns 200 OK

**Time**: 20 minutes

#### 2.3.3 Alternative: Deploy to Vercel

**Steps** (if using Vercel instead of Railway):

1. **Create Vercel account**: https://vercel.com/
2. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   vercel login
   ```
3. **Deploy**:
   ```bash
   cd /home/user/nutrition-tracker-skill/automation/telegram-bot
   vercel
   ```
4. **Follow prompts**:
   - Link to existing project or create new
   - Set project name
   - Confirm settings
5. **Set environment variables**:
   ```bash
   vercel env add TELEGRAM_BOT_TOKEN
   vercel env add ANTHROPIC_API_KEY
   vercel env add GITHUB_TOKEN
   vercel env add USDA_API_KEY
   # ... (add all variables)
   ```
6. **Redeploy with env vars**:
   ```bash
   vercel --prod
   ```
7. **Get URL and set webhook**:
   - Vercel provides URL like: `https://your-app.vercel.app`
   - Visit: `https://your-app.vercel.app/setup`

**Note**: Vercel has a 10-second timeout for serverless functions, which may be too short for Claude API calls. Railway is recommended for this reason.

**Time**: 15 minutes

---

### 2.4 Test End-to-End

#### 2.4.1 Test Basic Food Logging

**Test Case 1: Generic Food (USDA Lookup)**

1. Open Telegram
2. Find your bot (@your_bot_username)
3. Send message: "200g grilled chicken breast"
4. Expected:
   - Bot replies with "🔍 Processing..."
   - Updates to "💾 Logging to database..."
   - Final message shows:
     - Logged food name
     - Nutrition breakdown (kcal, protein, fat, carbs)
     - Today's totals
     - Remaining targets
5. Verify in GitHub:
   - Go to `daily-logs` branch
   - Check `data/logs/YYYY-MM/DD.yaml`
   - Should see new entry with timestamp and nutrition data

**Test Case 2: Restaurant Dish (Claude Estimation)**

1. Send message: "Salmon poke bowl from L'ETO"
2. Expected:
   - Bot processes with Claude (might take 3-5 seconds)
   - Returns estimated nutrition
   - Logs to GitHub
3. Verify:
   - Check log file has entry
   - Note might be lower confidence than USDA data

**Test Case 3: Screenshot Upload**

1. Take screenshot of a menu with nutrition info (or use test image)
2. Send photo to bot
3. Expected:
   - Bot replies "📸 Processing screenshot..."
   - Claude Vision extracts nutrition data
   - Logs to GitHub
   - Confirms with summary
4. Verify:
   - Check log file has entry
   - Nutrition data matches screenshot

**Success Criteria**:
- ✅ All three test cases return valid responses
- ✅ Log files are created/updated in GitHub
- ✅ Commits appear on daily-logs branch
- ✅ Today's totals calculate correctly

**Time**: 20 minutes

#### 2.4.2 Test Daily Summary

1. Send command: `/today`
2. Expected:
   - Bot returns summary with:
     - Number of entries
     - Total kcal, protein, fat, carbs
     - Comparison to targets
     - Remaining amounts
3. Verify numbers match log file calculations

**Time**: 5 minutes

#### 2.4.3 Test Error Handling

1. Send gibberish: "asdfghjkl"
   - Expected: Polite error message asking for clarification
2. Send very complex query: "Mixed tapas plate with 5 items"
   - Expected: Best-effort estimation with disclaimer about accuracy
3. Send image with no visible nutrition info
   - Expected: Error message asking for clearer image

**Time**: 10 minutes

---

### 2.5 Create Documentation

**File**: `automation/telegram-bot/README.md`

```markdown
# Nutrition Tracker Telegram Bot

Text-based interface for logging food to the nutrition tracker via Telegram.

## Features

- 🔍 Automatic nutrition lookup via USDA database (600k+ foods)
- 🤖 Claude AI for estimating restaurant dishes
- 📸 Screenshot processing with Claude Vision
- 💾 Automatic commits to GitHub
- 📊 Daily nutrition summaries
- ⚡ Fast and free (only pays for Claude API usage)

## Architecture

- **Bot Framework**: Telegraf (Node.js)
- **AI Processing**: Anthropic Claude API
- **Data Source**: USDA FoodData Central API
- **Storage**: GitHub (data/logs)
- **Hosting**: Railway (free tier)

## Usage

### Logging Food

Simply text the bot what you ate:

- "200g grilled chicken breast"
- "2 poached eggs with sourdough"
- "Salmon poke bowl from L'ETO"

Or send a screenshot of a menu/nutrition label.

### Commands

- `/start` - Start the bot
- `/help` - Show help message
- `/today` - Get today's nutrition summary
- `/week` - Get this week's summary (coming soon)

## Setup

See `/automation/todo.md` for complete setup instructions.

## Development

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Run locally
npm run dev

# Deploy to Railway
railway up
```

## Cost

- Telegram: FREE
- USDA API: FREE
- Claude API: ~$1.50/month (300 logs)
- Railway hosting: FREE (within free tier limits)

**Total: ~$1.50/month**

## Troubleshooting

### Bot not responding
1. Check Railway logs: `railway logs`
2. Verify webhook is set: Visit `https://your-app.railway.app/setup`
3. Check environment variables are set correctly

### USDA lookups failing
1. Verify API key is valid
2. Check USDA API status: https://fdc.nal.usda.gov/
3. Try direct API call to test: `curl "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=YOUR_KEY&query=chicken"`

### GitHub commits failing
1. Verify GitHub token has `repo` scope
2. Check branch exists: `daily-logs`
3. Verify repository name and owner in config

### Claude API errors
1. Check API key is valid
2. Verify sufficient credits in Anthropic account
3. Check model name is correct: `claude-sonnet-4-20250514`

## Support

For issues, check:
- Railway logs
- GitHub Actions logs
- Telegram bot API status: https://core.telegram.org/bots/api

For questions about implementation, see `/automation/todo.md`.
```

**Time**: 15 minutes

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
