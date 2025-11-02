---
name: nutrition-tracker
description: >
  Personal nutrition tracking skill for Thomas. Use when analyzing meals, estimating
  nutrients from venue sources (menus, PDFs, photos), comparing to Thomas's targets,
  logging what was eaten, querying nutrition history, and updating a versioned Data Bank
  with change logs.
license: Apache-2.0
---

# Nutrition Tracker

## Purpose (plain)
Keep a trustworthy, versioned nutrition notebook for Thomas. Look up dishes, fill in missing
nutrients from evidence, compare totals to his daily targets, and save edits with an audit trail.
No jargon, no mystery—just reproducible numbers and clear assumptions.

## When to use
- Compute nutrition for a dish, meal, or day.
- Log what was eaten (replaces manual entry in separate apps).
- Query nutrition history: today's totals, weekly trends, rolling averages.
- Add or update a dish in the Data Bank.
- Validate the Data Bank for consistency before committing to GitHub.
- Summarize progress vs rest‑day/training‑day targets and suggest next foods.

## Files in this skill
- `data/food-data-bank.md` — Source of truth for dishes (append‑only, versioned).
- `data/logs/` — Nutrition logs organized by date (`YYYY-MM/DD.yaml`). See `data/logs/SCHEMA.md` for format.
- `references/health-profile.yaml` — Daily targets and monitored fields.
- `scripts/validate_data_bank.py` — Consistency checks (energy math, fat split, sodium↔salt, missing fields).
- `scripts/new_dish_from_template.py` — Append a new schema block (quick start for new dishes).

> Packaging and validation of skills follow the **skill‑creator** guidance; see that skill’s docs
> for `init_skill.py` / `package_skill.py` usage. This skill stays lean and defers heavy logic to scripts.

## Complete workflow for adding dishes

**CRITICAL: Follow this complete workflow when adding new dishes. Do NOT skip steps.**

1. **Research thoroughly** (use multiple sources):
   - Start with delivery platforms (Deliveroo/Uber Eats) for calorie counts and ingredient lists
   - Search for venue PDFs, allergen menus, nutrition guides
   - Look at photos (venue website, Google Maps, social media) to estimate portions
   - Check reviews for portion size hints ("massive", "small", etc.)
   - Search for chef recipes, prep videos, or ingredient breakdowns
   - **Be creative**: if standard sources fail, use comparable dishes, USDA data, or ingredient analysis
   - **Goal**: Fill in ALL nutrition fields, not just calories and macros

2. **Create template and populate data**:
   - Use `scripts/new_dish_from_template.py` to create the YAML block
   - Fill in ALL available fields: macros, micronutrients, MUFA/PUFA breakdown
   - For estimated values, document your reasoning in `assumptions` and `notes`
   - Add comprehensive `source.evidence` with URLs and methods used
   - Update `change_log` with timestamp and what you added

3. **Update the index**:
   - Add dish to the index in `data/food-data-bank.md` under `# Dishes Index`
   - Add section header (e.g., `## Dish Name (Venue)`) before the YAML block
   - Keep index alphabetically organized by venue, then by dish

4. **Validate before committing**:
   - Run `python scripts/validate_data_bank.py data/food-data-bank.md`
   - Fix any errors (energy math, fat splits, sodium/salt)
   - Re-run validation until ALL items pass
   - Carbs: ensure `carbs_available_g` (net), `carbs_total_g`, and `polyols_g` are present; UK/EU sources already list available carbs—derive totals as `available + fibre (+ polyols)` (see `ESTIMATE.md`).

5. **Document research findings** (if applicable):
   - Add learnings, tips, or venue-specific guidance to `references/research-notes.md`
   - Include useful research methods, data sources, or estimation techniques

6. **Commit with clear message**:
   - Commit changes with descriptive message
   - Include calorie counts and what was added in the commit message

**Do NOT default to generic values. If exact data is unavailable, use ingredient-based estimation and document your method.**

## Core procedures

### A) Lookup & summarize a dish
1. Search `data/food-data-bank.md` by `id` or name.
2. Read `per_portion` values. If any are `null`, trigger **B) Add / Update** for the missing bits.
3. Show a compact table and % of daily targets from `references/health-profile.yaml`.
4. If multiple dishes are logged, sum totals and re‑check vs targets.

### B) Add / Update a dish (evidence‑first)
Always write down what was used. Put links/notes under `source.evidence`.

**For Simple Health Kitchen (SHK):**
- **Check both**: the **Deliveroo** page (names, **ingredient list**, photos) **and** the **SHK Calories PDF**
  (kcal and P/C/F). Names may differ slightly; match the prep, not just the label.
- **Anchor macros** (kcal, protein, carbs, fat) to the SHK source that exactly matches the dish:
  - If the PDF has the **exact same item**, prefer it for macros.
  - If the PDF lists a **different prep** (e.g., *Roasted Sweet Potatoes* vs *Wedges*), prefer Deliveroo macros
    for the dish actually ordered.
- **Use Deliveroo ingredients + photos** to infer: oil type, dressing, toppings, and portion reasonableness.
- **Compute the rest** (sodium, sugars, fibre, vitamins/minerals, MUFA/PUFA/trans) from ingredient profiles
  (e.g., USDA/MyFoodData) **scaled to the anchored macros**.

**For other venues (get creative, but be explicit):**
- Use delivery menus (Deliveroo/Uber Eats/Just Eat), venue PDFs, and **photos** (gallery, socials, Google Maps).
- Read **ingredient lists** and **allergens**; check **reviews** for portion hints (“huge bowl”, “tiny cup”).
- Look for **chef/restaurant recipes** or prep videos that reveal oil type, cooking method, or weights.
- Estimate **portion weight** from photos: plate diameter, container size, standard yields (e.g., pasta ~140–160 g per cup cooked; salmon cooks down ~25% from raw). State the method in `assumptions`.
- If nothing authoritative exists, choose the **closest canonical ingredient profile** and **record the choice**.

**Component-based estimation (REQUIRED for multi-ingredient dishes):**

When a dish has multiple identifiable components (e.g., eggs + yogurt + bread + butter), use this rigorous method:

1. **List all components** from the ingredient list (e.g., "2 poached eggs, garlic yogurt, sourdough, kale, chilli butter")

2. **Estimate weights for known components** using standard portions:
   - Eggs: 50g each (100g for 2 eggs)
   - Yogurt base: 100-120g typical for restaurant
   - Bread slice: 50-70g (NOT 100g - be conservative!)
   - Vegetables: 50-80g cooked portions
   - Leave one component (usually fat/oil/butter) as the "closing variable"

3. **Calculate sub-totals** for known components using USDA/MyFoodData profiles:
   - Example: 2 eggs (140 kcal) + yogurt 120g (72 kcal) + bread 60g (150 kcal) + kale 50g (17 kcal) = 379 kcal

4. **Solve for the unknown component** (usually butter/oil) to close the calorie gap:
   - If venue lists 592 kcal total: 592 - 379 = 213 kcal from butter
   - Butter is ~7.2 kcal/g → 213 ÷ 7.2 = ~30g butter
   - Check reasonableness: 30g (2 tbsp) is plausible for chilli butter

5. **Calculate complete macros** by summing all components with their precise weights:
   - Get USDA profiles for each (protein, fat, carbs, sat fat, MUFA, PUFA, sodium, etc.)
   - Scale each component to its estimated weight
   - Sum all values
   - **Document the calculation method in `notes`**

6. **Apply finishing salt** per salt_scheme (0.5% of total dish weight):
   - Total weight = sum of all components (e.g., 352g)
   - Finishing salt = 352g × 0.005 = 1.76g salt = ~704mg additional sodium
   - Add this to intrinsic sodium from ingredients (bread, salted butter, etc.)

7. **Validate** using the available-carb Atwater formula (`4P + 9F + 4*carbs_available + 2*fibre + 2.4*polyols`): stay within ±5% of venue kcal or document why.

**Example worked calculation:**
```
Dish: Chilli Poached Eggs (L'ETO, 592 kcal listed)
Components: 2 eggs, garlic yogurt, sourdough, kale, chilli butter

Step 1 - Estimate known components:
- 2 poached eggs: 2×50g = 100g → 140 kcal, 12.6g P, 9.5g F, 0.7g C
- Greek yogurt (whole): 120g → 72 kcal, 9.6g P, 3.8g F, 4.8g C
- Sourdough: 60g slice → 150 kcal, 5.4g P, 0.9g F, 29g C
- Kale (cooked): 50g → 17 kcal, 1.6g P, 0.3g F, 3.3g C
Sub-total: 379 kcal, 29.2g P, 14.5g F, 37.8g C

Step 2 - Solve for butter to close calorie gap:
592 - 379 = 213 kcal needed → ~30g butter
(Refine with actual profiles to 22.2g for exact match)

Step 3 - Apply finishing salt:
Dish weight: 352g → salt 1.76g = 704mg sodium
Add intrinsic sodium from bread + butter
TOTAL SODIUM: ~1,543mg

Step 4 - Validate Atwater:
4×30.4 + 9×34.2 + 4×40.3 + 2×3.4 + 2.4×0.0 = 597.4 kcal (≈592 kcal label; note variance)
```

**Standard assumptions (write them in `assumptions`):**
- `salt_scheme: "normal"` → add ~**0.5% of finished dish weight** as salt (≈ **sodium_mg = salt_g * 400**).
- `oil_type:` venue norm (e.g., olive oil for SHK). Use typical FA split (~73% MUFA / ~11% PUFA / ~14% SFA).
- Portion weight → labeled value if present; otherwise an estimate with a one‑line rationale.

**Consistency checks (before saving):**
- **Energy (Atwater)**: `kcal ≈ 4*protein + 9*fat + 4*carbs_available + 2*fibre + 2.4*polyols` (tolerance ±5–8%). Explain any gap.
- **Fat split**: `sat + MUFA + PUFA + trans ≤ total fat` (difference = unassigned/rounding).
- **Sodium↔salt**: compute `salt_g_from_sodium = sodium_mg * 2.5 / 1000` in `derived`.
- **No negatives**; keep unknowns as `null`.
- Rounding: kcal integer; grams **1 dp**; mg/µg integers.

**Edit protocol (append‑only):**
1. Locate dish by `id` (or add a new block from the Schema TEMPLATE).
2. Edit values → **bump `version`** → update **`last_verified: 2025-10-28`**.
3. Append a `change_log` item: timestamp, reason, `fields_changed`, and **evidence links**.
4. Never rewrite old change log entries.

### C) Daily summary
- Aggregate logged dishes; compute totals vs **rest** or **training** day targets.
- Report kcal, protein, fat (sat/MUFA/PUFA/trans), carbs (sugar), fibre, sodium (plus salt), potassium,
  cholesterol, iodine, magnesium, calcium, iron, zinc, vitamin C.
- Offer next‑food suggestions to close gaps without blowing limits (esp. sat fat and sodium).

### D) Log a meal
Use this to replace manual entry in external apps. Capture what was eaten with full nutrition snapshot.

**Workflow:**
1. User states what they ate (e.g., "I had the Chilli Poached Eggs from L'ETO")
2. Look up item in food bank OR estimate nutrition if not found
3. Show nutrition + comparison to targets
4. Ask: "Would you like me to log this meal?"
5. If yes:
   - Create/open today's log file: `data/logs/YYYY-MM/DD.yaml`
   - Add new entry with current timestamp (ISO 8601 with timezone)
   - For each item:
     - Copy full nutrition snapshot from food bank (or use estimated values)
     - Store `food_bank_id` (or `null` if estimated)
     - Include quantity and unit
   - Add optional notes if user provided context
   - Calculate and show updated daily totals vs targets

**Log file location:** `data/logs/YYYY-MM/DD.yaml` organized by month subdirectories.

**Day type:** Set to `rest` or `training` based on which targets to compare against (ask user if unclear).

**Multiple items in one meal:** If user ate multiple things together, group them in one entry with one timestamp.

**After logging:** Show updated daily totals and gaps: "Logged ✓. Today: X/Y kcal, X/Y protein. Still need Z."

### E) Query nutrition logs
Read historical logs to answer questions about what was eaten.

**Today's totals:**
1. Read `data/logs/YYYY-MM/DD.yaml` for today
2. Sum nutrition across all items in all entries
3. Compare to targets from `references/health-profile.yaml`
4. Show summary table and remaining gaps

**This week's totals:**
1. Read last 7 daily log files
2. For each day: sum nutrition, compare to targets
3. Calculate daily averages across the week
4. Show compliance: "Hit protein target 6/7 days"
5. Show weekly averages vs targets

**Rolling 7-day average:**
1. Read last 7 log files
2. Sum all nutrition across 7 days
3. Divide by 7 for daily average
4. Compare to daily targets

**Queries supported:**
- "What have I eaten today?"
- "Show today's totals"
- "How much protein have I had so far?"
- "Show this week's nutrition"
- "What's my average protein this week?"
- "Have I been hitting my fiber target?"

**Files:** Logs are in `data/logs/YYYY-MM/DD.yaml`. See `data/logs/SCHEMA.md` for format details.

## CLI helpers (scripts)

### `scripts/validate_data_bank.py`
Validate `data/food-data-bank.md`. Checks:
- Energy math (Atwater), fat‑split coherence, sodium↔salt, missing required keys, negative values.
- Emits a human summary and a JSON report (to stdout).

Usage:
```bash
python scripts/validate_data_bank.py data/food-data-bank.md
```

### `scripts/new_dish_from_template.py`
Append a fresh copy of the Schema TEMPLATE with IDs filled from slugs.

Usage:
```bash
python scripts/new_dish_from_template.py \\
  --bank data/food-data-bank.md \\
  --dish_slug grilled_salmon_fillet \\
  --venue_slug shk \\
  --display_name "Grilled Salmon Fillet (Example Venue)" \\
  --category main \\
  --portion_desc "restaurant portion"
```

The script adds a new YAML block at the end and suggests an index bullet; review and commit the change.

## Style guide (data entry)
- Keep numbers **consistent with evidence** and **state assumptions** in one line.
- Prefer **fewer, better** sources; list them in `source.evidence` (URLs or short notes).
- If Deliveroo vs venue PDF disagree, choose the **exact‑match prep** as the macro anchor and explain.
- Keep language neutral and terse—future‑you will thank current‑you.

## Research notes
For accumulated research findings, methodology lessons, and venue-specific guidance, see `references/research-notes.md`.
