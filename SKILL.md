---
name: nutrition-tracker-skill
description: Comprehensive nutrition toolkit for estimating, logging, and analysing what Thomas eats.
license: Apache-2.0
---

# Nutrition Tracking

## Overview
This guide covers general practices for:
 - A) Estimating precise nutrition: retrieve and/or estimate detailed nutrition values for dishes, specific to their type, venue, or brand.
 - B) Logging dishes consumed: recording nutrition data for each dish the user has eaten.
 - C) Daily Summary: querying logs for daily nutrition data against the user's targets.

This skill is different to other Claude Skills in that it lives in a public Github repository and contains regularly updated user data including a data bank of dishes, daily nutrition logs, and nutrition targets  (see **D) AD HOC ANALYSIS**).

## A) ESTIMATING
When the user asks you to estimate nutrition for a dish:
- [ ] Step 1: Check if the dish exists in `data/food-data-bank.md`. 
      - Search by `id` or name using the upfront index (large file).
      - If found and complete with no null values: proceed to **Step 3**.
      - Else: proceed to **Step 2**.
- [ ] Step 2: Add / Update complete records for the dish if necessary using `ESTIMATE.md`. If there is more than one dish, parallelize with one subagent per dish.
- [ ] Step 3: Show a compact table and % of daily targets from `references/health-profile.yaml`.
      - Ensure you scale `per_portion` values if necessary.
      - If multiple dishes are logged, sum totals and re‑check vs targets.
- [ ] Step 4: If the user has eaten the dish, trigger **B) Logging**. This will not always be the case.

## B) LOGGING
When the user has eaten a dish and you have completed **A) Estimating**:
   - Create/open today's log file: `data/logs/YYYY-MM/DD.yaml`
   - Add new entry with current timestamp (ISO 8601 with timezone), unless user has specified a different time. If user ate multiple things together, group them in one entry with one timestamp.
   - For each item:
     - Copy full nutrition snapshot, ensuring you scale portions to what the user actually ate.
     - Store `food_bank_id`.
     - Include quantity and unit.
     - Add optional notes if user provided context.
   - Trigger **C) Daily Analysis**.

**After logging:** Show updated daily totals and gaps: "Logged ✓. Today: X/Y kcal, X/Y protein. Still need Z."

## C) DAILY SUMMARY
- Aggregate logged dishes; compute totals vs **rest** or **training** day targets in `references/health-profile.yaml`.
- In addition to targets, include values the user is monitoring in `references/health-profile.yaml`.
- Offer next‑food suggestions to close gaps without blowing limits.

## D) AD HOC ANALYSIS
The user may sometimes ask for custom analyses. The main data sources for these are:
- `data/food-data-bank.md` — large source of truth for dishes, with upfront index.
- `data/logs/` — Nutrition logs organized by date (`YYYY-MM/DD.yaml`). See `data/logs/SCHEMA.md` for format.
- `references/health-profile.yaml` — Daily targets and monitored fields.
