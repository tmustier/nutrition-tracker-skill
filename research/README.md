# Nutrition Tracking Research

This directory contains comprehensive research reports on food preparation effects on nutrition and proper computational approaches for nutritional assessment.

## Structure

### `food-preparation/`
Research on how food preparation (cooking, processing) affects nutritional content:

- **`nutrient-transformations-cooking-analysis.md`** - Chemical and structural nutrient changes during cooking (bioavailability enhancement, vitamin degradation, anti-nutrient reduction). Includes retention factors by cooking method.

- **`cooking-medium-transfer-analysis.md`** - Oil absorption rates, nutrient leaching into cooking water, brining/marinating mechanics. Quantitative data on how cooking mediums are partially absorbed or lost.

- **`weight-water-content-changes-analysis.md`** - Weight changes from water loss/gain and fat rendering. Raw-to-cooked conversion factors and their impact on nutrition calculations.

- **`food-preparation-research-report.md`** - Survey of how USDA, international databases (UK, Australia, EU), and nutrition tracking apps handle food preparation variations. Includes retention factor methodologies and recipe calculation standards.

- **`food-preparation-abstractions.md`** - System design document proposing abstractions for tracking food preparation in a nutrition system. Includes data models, adjustment mechanisms (yield factors, retention factors, additions, subtractions), and implementation roadmap.

### `rda-alignment/`
Research on aligning food database values with RDA/DRI nutritional guidelines:

- **`as-consumed-vs-as-purchased-report.md`** - Analysis of whether RDAs are based on raw or cooked foods. Examines NHANES survey methodology, USDA FNDDS database design, and the proper baseline for comparing intake to nutritional guidelines.

- **`computational-nutrition-assessment.md`** - Comprehensive design document for computing "% of Daily Value" correctly. Includes bioavailability factors, nutrient-specific handling (RAE, DFE, iron types), confidence levels, and implementation strategies. Provides concrete algorithms for accurate nutritional adequacy assessment.

### `implementation-starter-kit/`
Code templates, test cases, and system documentation:

- **`validation-warnings.md`** - Comprehensive documentation of validation warning types, acceptable issues, and validation formulas. Snapshot from the v2 schema migration explaining warning categories and running validation scripts.

### Project History & API Research

- **`usda-api-research.md`** - Comprehensive research on USDA FoodData Central API including nutrient ID mappings, API usage patterns, coverage information, and practical reference guide for USDA data integration.

- **`nutrient-extension-summary.md`** - Project completion report documenting the Schema v1 → v2 migration (24 → 52 nutrient fields). Includes migration statistics, git commits, design decisions, and historical context for schema evolution.

## Key Findings Summary

### Food Preparation Effects (6 mechanisms)

1. **Nutrient Transformation** - Bioavailability changes (lycopene +200-500%), vitamin degradation (C: -50-60% boiling), free sugar conversion
2. **Cooking Medium Partially Transferred** - Oil absorption (10-50%), salt from brining, nutrient leaching
3. **Cooking Medium Partially Consumed** - Rendered fat discarded (bacon: -315 kcal), pan residue
4. **Weight Changes** - Water loss concentrates (chicken: 100g→75g), water gain dilutes (pasta: 100g→250g)
5. **Trimming/Refuse** - Bones, peels, drained liquid
6. **Temperature-Dependent Thresholds** - Maillard reactions, digestibility changes

### RDA Alignment

- **RDAs already account for bioavailability** - They tell you how much to *consume* to get enough *absorbed*
- **RDAs are based on "as-consumed" foods** - Match NHANES survey data (cooked/prepared)
- **USDA databases report total content** - Not bioavailable amounts (except sometimes folate in DFE)
- **Apply selective corrections only** - Vitamin A (RAE), Folate (DFE), Iron (heme vs non-heme)
- **Show uncertainty** - Confidence levels: ±8-15% (high) to ±30-60% (low)

### Four Adjustment Types for Tracking

1. **Yield Factor** - Weight changes from cooking (raw_weight × yield = cooked_weight)
2. **Retention Factor** - Nutrient degradation from heat (nutrient × retention%)
3. **Addition Factor** - Cooking medium absorbed (+ oil, salt)
4. **Subtraction Factor** - Components discarded (- rendered fat, cooking water)

## Related Documentation

- **[/ESTIMATE.md](/ESTIMATE.md)** - Nutrient estimation methodology, confidence levels, component-based calculation workflow, and validation formulas
- **[/SKILL.md](/SKILL.md)** - Overall nutrition tracking workflow, agent guidelines, and project skill documentation
- **[/data/food-data-bank-index.md](/data/food-data-bank-index.md)** - Browse all dishes in the food database by venue and category
- **[/data/logs/SCHEMA.md](/data/logs/SCHEMA.md)** - Daily nutrition log format, field definitions, and data structure specifications
- **[/references/health-profile.yaml](/references/health-profile.yaml)** - User targets (RDA/DRI values), monitoring fields, and health goals configuration
- **[/scripts/validate_data_bank.py](/scripts/validate_data_bank.py)** - Validation tool for checking energy math, fat splits, sodium calculations, and data integrity
- **[/scripts/new_dish_from_template.py](/scripts/new_dish_from_template.py)** - Tool for creating new dish files with proper structure in the correct venue folder

## Implementation Recommendations

### Minimal Viable Approach
- Track foods as-consumed (cooked/prepared state)
- Apply vitamin A (RAE) and folate (DFE) conversions
- Distinguish heme vs non-heme iron for vegetarian diets
- Show confidence levels with all % Daily Value calculations

### Enhanced Features
- Retention factors for vitamin C based on cooking method
- Yield factors for raw-to-cooked weight conversions
- Bioavailability adjustments for plant-based diets (iron, zinc)
- Meal composition analysis (enhancers/inhibitors)

### Power User Features
- Custom retention factor overrides
- Multi-stage preparation tracking
- Individual absorption calibration from biomarkers
- Full uncertainty quantification

## Research Methodology

All reports synthesize data from:
- USDA FoodData Central and retention factor tables
- National Academies DRI reports
- FAO/WHO expert consultations
- Peer-reviewed nutritional science literature (2014-2025)
- International food composition databases (EuroFIR, UK CoFID, Australia NUTTAB)
- Professional nutrition software standards (ESHA Genesis R&D, Cronometer)

## Related Files

- `/SKILL.md` - Project skill guidelines
- `/ESTIMATE.md` - Estimation guidelines (likely complementary)
- `/data/foods/` - Actual food database YAML files
