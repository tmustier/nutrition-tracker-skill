# Nutrition Tracker Skill

A rigorous, evidence-based personal nutrition tracking system designed for use with LLM assistants. Track meals, analyze nutrients, and maintain a versioned database of restaurant dishes with full transparency on data sources and estimation methods.

## What is this?

This is a **Claude Code skill** (also usable with other LLMs) that maintains a personal nutrition database with:

- **Restaurant dish nutrition data** with full macro/micronutrient breakdowns
- **Evidence-based methodology** documenting every source and assumption
- **Component-based estimation** for complex dishes using USDA data
- **Versioned change logs** for every data update
- **Validation scripts** ensuring data consistency (Atwater energy calculations, fat splits, sodium/salt ratios)

Perfect for anyone who wants to track nutrition rigorously while eating out frequently.

## Key Features

- **Comprehensive tracking**: Not just calories and macros, but also MUFA/PUFA breakdown, micronutrients (sodium, potassium, iodine, magnesium, calcium, iron, zinc, vitamin C)
- **Evidence trail**: Every dish includes source URLs, estimation methods, and documented assumptions
- **Component-based calculation**: For multi-ingredient dishes, estimate each component weight and solve for unknowns (typically butter/oil) to match venue calorie counts
- **Validation**: Built-in checks for energy math (Atwater formula), fat split coherence, sodium/salt ratios
- **Append-only history**: Full change log for every dish update with timestamps and reasoning

## Repository Structure

```
nutrition-tracker-skill/
├── SKILL.md                          # Main skill documentation and methodology
├── data/
│   └── food-data-bank.md            # Versioned nutrition database (YAML format)
├── references/
│   └── health-profile.yaml          # Daily nutrition targets and monitoring fields
├── scripts/
│   ├── validate_data_bank.py        # Validate consistency (Atwater, fat splits, etc.)
│   └── new_dish_from_template.py    # Create new dish entries from template
└── LICENSE                           # Apache 2.0
```

## How It Works

### 1. Research Phase
When adding a new dish, the LLM:
- Searches delivery platforms (Deliveroo, Uber Eats) for calorie counts and ingredients
- Looks for venue PDFs, nutrition guides, allergen menus
- Analyzes photos to estimate portion sizes
- Checks reviews for portion hints
- Uses component-based estimation for complex dishes

### 2. Component-Based Estimation

For multi-ingredient dishes (e.g., "Chilli Poached Eggs with garlic yogurt, sourdough, kale, chilli butter"):

1. **List components** from ingredient list
2. **Estimate known weights** (eggs: 50g each, bread: 60g, yogurt: 120g, veg: 50g)
3. **Calculate sub-totals** using USDA/MyFoodData profiles
4. **Solve for unknown** (usually butter/oil) to close calorie gap with venue's listed calories
5. **Calculate complete macros** including sat/MUFA/PUFA splits
6. **Apply finishing salt** (0.5% of dish weight) plus intrinsic sodium
7. **Validate** with Atwater formula (within ±5%)

Example: [See SKILL.md lines 136-158 for worked example]

### 3. Data Storage

All dishes stored in `data/food-data-bank.md` with:
- Full macro/micronutrient profiles
- Source evidence and URLs
- Estimation assumptions documented
- Version history and change logs
- Validation status

### 4. Validation

Run `python scripts/validate_data_bank.py data/food-data-bank.md` to check:
- Energy math: `kcal ≈ 4×protein + 4×carbs + 9×fat` (±5-8% tolerance)
- Fat split: `sat + MUFA + PUFA + trans ≤ total fat`
- Sodium/salt ratio: `salt_g = sodium_mg × 2.5 / 1000`
- No negative values or missing required fields

## Usage with LLMs

This skill is designed to be used with Claude Code or other LLM assistants. Simply reference the skill when:

- **Logging meals**: "I had the Chilli Poached Eggs from L'ETO"
- **Adding dishes**: "Add the Grilled Salmon from Simple Health Kitchen"
- **Checking progress**: "How am I doing vs my protein target today?"
- **Updating data**: "Update the carbs for dish XYZ based on new evidence"

The LLM will:
1. Search the data bank
2. Calculate totals vs your targets (from `references/health-profile.yaml`)
3. Research and add missing dishes with full evidence
4. Validate before committing changes

## Example Dishes

Current database includes:
- Simple Health Kitchen (SHK) meals with delivery platform data
- Jean-Georges at The Connaught fine dining items
- L'ETO Soho dishes with component-based calculations
- [See data/food-data-bank.md for full list]

## Why This Approach?

**Transparency**: Every number has a documented source or estimation method. No black-box calculations.

**Rigor**: Component-based methodology prevents common errors (overestimating bread, underestimating fats, forgetting finishing salt).

**Accuracy**: Validation catches inconsistencies before they corrupt your tracking.

**LLM-friendly**: Structured YAML format with clear edit protocols makes it safe for AI assistants to read and write.

## Personal Context

This database tracks nutrition for a 30-year-old active male (183cm, ~85kg) doing body recomp with targets:
- Rest days: ≤2500 kcal
- Training days: ≤2900 kcal
- Protein: ≥170g
- Sat fat: ≤20g
- Sodium: ≤2300mg

Your mileage may vary! Update `references/health-profile.yaml` with your own targets.

## Getting Started

1. **Clone this repo**
2. **Update health profile**: Edit `references/health-profile.yaml` with your targets
3. **Use with your LLM**: Reference SKILL.md when logging meals
4. **Add dishes**: LLM will research and add new dishes using the methodology
5. **Validate**: Run `python scripts/validate_data_bank.py data/food-data-bank.md`
6. **Commit**: Keep your data versioned with clear commit messages

## Methodology Highlights

See `SKILL.md` for complete methodology, including:
- Component-based calculation checklist (lines 249-263)
- Standard assumptions for salt schemes and oil types (lines 160-163)
- Edit protocol for versioned changes (lines 172-177)
- Validation requirements (lines 165-170)

### Key Learnings (from Scratchpad)

**Critical errors to avoid**:
- Don't overestimate bread portions (use 60g, not 100g)
- Don't underestimate restaurant butter/oil usage
- Don't forget finishing salt (0.5% dish weight) PLUS intrinsic sodium
- Don't guess component weights—work backwards from calorie anchor

**Real impact**: Initial estimates for L'ETO Chilli Poached Eggs had carbs 54% too high and sodium 81% underestimated, which would have given false confidence about daily targets.

## Contributing

This is a personal nutrition database, but the methodology and scripts are open for anyone to use. Feel free to:
- Fork for your own tracking
- Adapt the methodology
- Submit PRs for script improvements or validation logic

Just note: The actual dish data is specific to London restaurants I frequent—you'll want to build your own database for your locations.

## License

Apache 2.0 - See LICENSE file for details.

## Disclaimer

This is a personal tracking tool. Nutrition data is estimated and may not be 100% accurate. Consult a registered dietitian or nutritionist for professional dietary advice.
