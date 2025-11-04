---
name: nutrition-tracking
description: Comprehensive nutrition toolkit for estimating, logging, and analysing what Thomas eats.
license: Apache-2.0
---

# Nutrition Tracking

## Overview
This guide covers general practices for:
 - A) Estimating precise nutrition: retrieve and/or estimate detailed nutrition values for dishes, specific to their type, venue, or brand.
 - B) Logging dishes consumed: recording nutrition data for each dish the user has eaten.
 - C) Daily Summary: querying logs for daily nutrition data against the user's targets.

This skill is different to other Claude Skills in that it lives in a public Github repository and contains regularly updated user data including a data bank of dishes, daily nutrition logs, and nutrition targets (see **D) AD HOC ANALYSIS**).

## A) ESTIMATING
When the user asks you to estimate nutrition for a dish, copy this checklist and track your progress:
- [ ] Step 1: Check if the dish exists in the data bank.
      - Browse `data/food-data-bank-index.md` to find dishes by name and location
      - The index shows all dishes organized by venue/category folders
      - If found and complete with no null values: proceed to **Step 3**.
      - Else: proceed to **Step 2**.
- [ ] Step 2: Check if you need to add / update complete data bank records for the dish (with no nulls). If so, spawn one subagent per dish, and have that agent ultrathink, following all the instructions in `ESTIMATE.md`. The subagent will create individual dish files in the appropriate folder. Once there are no more updates to be made, proceed to **Step 3**.
- [ ] Step 3: Show a compact table and % of daily targets from `references/health-profile.yaml`.
      - Ensure you scale `per_portion` values if necessary.
      - If multiple dishes are logged, sum totals and re‑check vs targets.
      - Recompute energy with the available-carb Atwater formula (`4P + 9F + 4*carbs_available + 2*fibre + 2.4*polyols`) and make sure `carbs_total_g`, `carbs_available_g`, and `polyols_g` are populated.
- [ ] Step 4: If the user has eaten the dish, proceed to **B) Logging** without asking the user. This will not always be the case.

## B) LOGGING
When the user has eaten a dish and you have completed **A) Estimating**:
   - Create/open today's log file: `data/logs/YYYY-MM/DD.yaml`
   - Add new entry with current timestamp (ISO 8601 with timezone), unless user has specified a different time. If user ate multiple things together, group them in one entry with one timestamp.
   - For each item:
     - Copy full nutrition snapshot, ensuring you scale portions to what the user actually ate.
     - Store `food_bank_id`.
     - Include quantity and unit.
     - Add optional notes if user provided context.
   - **IMPORTANT - Git Workflow**: Commit food logs to your current Claude feature branch (`claude/*`). The daily automation workflow will automatically aggregate logs from all Claude branches at 4am UTC, create a PR from `daily-logs` to `main`, and auto-merge after validation. You can also create PRs immediately if needed.
   - Proceed to **C) Daily Analysis** without asking the user.

**After logging:** Show updated daily totals and gaps: "Logged ✓. Today: X/Y kcal, X/Y protein. Still need Z." Remember that if the user asks you for lunch recommendations, they likely also want to have dinner later, so don't try to meet all targets with that single meal.

## C) DAILY SUMMARY
- Aggregate logged dishes; compute totals vs **rest** or **training** day targets in `references/health-profile.yaml`.
- In addition to targets, include values the user is monitoring in `references/health-profile.yaml`.
- Offer next‑food suggestions to close gaps without blowing limits.

## D) AD HOC ANALYSIS
The user may sometimes ask for custom analyses. The main data sources for these are:
- `data/food-data-bank/` — Individual dish files organized by venue/category in folders (see `data/food-data-bank-index.md` for complete index).
- `data/logs/` — Nutrition logs organized by date (`YYYY-MM/DD.yaml`). See `data/logs/SCHEMA.md` for format.
- `references/health-profile.yaml` — Daily targets and monitored fields.
- Venue-specific research notes in `data/food-data-bank/venues/{venue-name}/RESEARCH.md`
- `scripts/calculate_nutrition_summary.py` — Multi-day nutrition summary script (default: last 7 days). Usage: `python3 scripts/calculate_nutrition_summary.py [days]`
