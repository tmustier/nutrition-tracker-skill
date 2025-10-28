---
name: nutrition-tracker
description: >
  Personal nutrition tracking skill for Thomas. Use when analyzing meals, estimating
  nutrients from venue sources (menus, PDFs, photos), comparing to Thomas’s targets,
  and updating a versioned Data Bank with change logs.
license: Personal use only
---

# Nutrition Tracker

## Purpose (plain)
Keep a trustworthy, versioned nutrition notebook for Thomas. Look up dishes, fill in missing
nutrients from evidence, compare totals to his daily targets, and save edits with an audit trail.
No jargon, no mystery—just reproducible numbers and clear assumptions.

## When to use
- Compute nutrition for a dish, meal, or day.
- Add or update a dish in the Data Bank.
- Validate the Data Bank for consistency before committing to GitHub.
- Summarize progress vs rest‑day/training‑day targets and suggest next foods.

## Files in this skill
- `data/food-data-bank.md` — Source of truth for dishes (append‑only, versioned).
- `references/health-profile.yaml` — Daily targets and monitored fields.
- `scripts/validate_data_bank.py` — Consistency checks (energy math, fat split, sodium↔salt, missing fields).
- `scripts/new_dish_from_template.py` — Append a new schema block (quick start for new dishes).

> Packaging and validation of skills follow the **skill‑creator** guidance; see that skill’s docs
> for `init_skill.py` / `package_skill.py` usage. This skill stays lean and defers heavy logic to scripts.

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

**Standard assumptions (write them in `assumptions`):**
- `salt_scheme: "normal"` → add ~**0.5% of finished dish weight** as salt (≈ **sodium_mg = salt_g * 400**).
- `oil_type:` venue norm (e.g., olive oil for SHK). Use typical FA split (~73% MUFA / ~11% PUFA / ~14% SFA).
- Portion weight → labeled value if present; otherwise an estimate with a one‑line rationale.

**Consistency checks (before saving):**
- **Energy (Atwater)**: `kcal ≈ 4*protein + 4*carbs + 9*fat` (tolerance ±5–8%). Explain any gap.
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

## Scratchpad
When relevant, write timestamped notes on tips and tricks you have learned in this section