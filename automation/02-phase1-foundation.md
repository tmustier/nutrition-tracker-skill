[← Overview & Planning](01-overview-and-planning.md) | [↑ Table of Contents](README.md) | [Next: Phase 2 Setup →](03-phase2-telegram-setup.md)

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

---

## Navigation

- [← Previous: Overview & Planning](01-overview-and-planning.md)
- [↑ Table of Contents](README.md)
- [Next: Phase 2 Setup →](03-phase2-telegram-setup.md)

**Related Sections**:
- [Prerequisites](01-overview-and-planning.md#prerequisites)
- [Troubleshooting USDA](07-operations.md#issue-usda-api-returning-no-results)
- [Troubleshooting GitHub](07-operations.md#issue-github-commits-failing)
