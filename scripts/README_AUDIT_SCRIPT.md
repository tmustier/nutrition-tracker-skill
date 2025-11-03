# Nutrition Estimation Opportunities Audit Script

## Overview

`audit_estimation_opportunities.py` is a comprehensive script that scans all food bank files to identify nutrients currently set to 0 that could/should be estimated using the reference YAML files.

## Features

- **Scans all food bank files** (data/food-data-bank/**/*.md)
- **Identifies estimation opportunities** for:
  - Fiber splits (soluble/insoluble)
  - Iodine
  - Manganese
  - Copper
  - Selenium
  - Vitamin D
  - Vitamin E
  - Other B-vitamins (future enhancement)

- **Prioritizes opportunities**:
  - **HIGH**: Fiber splits (when total > 0), iodine in dairy/seafood, manganese in nuts/grains, copper in shellfish/liver/nuts
  - **MEDIUM**: Iodine in eggs/meat, vitamin D in fatty fish/eggs, vitamin E in nuts/seeds
  - **LOW**: Selenium (high variability), trace minerals in various foods

- **Provides suggested values** based on:
  - Food category matching
  - Portion weight
  - Reference YAML data
  - USDA availability

## Usage

### Basic Usage

```bash
python scripts/audit_estimation_opportunities.py
```

This generates `estimation_opportunities_report.json` in the current directory.

### Custom Output

```bash
python scripts/audit_estimation_opportunities.py --output reports/my_audit.json
```

### Pretty-Printed JSON

```bash
python scripts/audit_estimation_opportunities.py --pretty
```

### Summary Only (No JSON File)

```bash
python scripts/audit_estimation_opportunities.py --summary-only
```

## Output Format

### JSON Structure

```json
{
  "metadata": {
    "generated_at": "2025-11-03",
    "base_path": "/home/user/nutrition-tracker-skill",
    "references_loaded": {
      "fiber_split": true,
      "iodine": true,
      "micronutrient": true
    }
  },
  "summary": {
    "total_files_scanned": 65,
    "files_needing_estimation": 40,
    "total_opportunities": 95,
    "opportunities_by_priority": {
      "high": 75,
      "medium": 16,
      "low": 4
    },
    "opportunities_by_nutrient": {
      "fiber_soluble_g": 29,
      "fiber_insoluble_g": 29,
      "iodine_ug": 11,
      "manganese_mg": 7,
      "copper_mg": 8,
      "selenium_ug": 4,
      "vitamin_d_ug": 4,
      "vitamin_e_mg": 3
    }
  },
  "files": [
    {
      "path": "data/food-data-bank/generic/ingredients/hazelnuts_30g_v1.md",
      "file_id": "hazelnuts_30g_v1",
      "food_category": "generic_ingredient",
      "food_description": "fixed pack portion",
      "portion_weight_g": 30,
      "primary_ingredients": ["raw; unsalted"],
      "priority_counts": {
        "high": 4,
        "medium": 1,
        "low": 0
      },
      "opportunities": [
        {
          "nutrient": "fiber_soluble_g",
          "current_value": 0,
          "suggested_value": 0.6,
          "confidence": "high",
          "reason": "Total fiber is 2.9g, nuts_seeds.tree_nuts category ratio 20% soluble",
          "priority": "high",
          "source_reference": "FIBER-SPLIT-ESTIMATION-REFERENCE.yaml",
          "usda_available": true
        }
      ]
    }
  ]
}
```

### Example Output

```
================================================================================
NUTRITION ESTIMATION OPPORTUNITIES AUDIT
================================================================================

Scanning food bank: /home/user/nutrition-tracker-skill/data/food-data-bank
Found 65 markdown files

================================================================================
SUMMARY
================================================================================
Total files scanned:       65
Files needing estimation:  40
Total opportunities:       95

Opportunities by priority:
  HIGH    :  75
  MEDIUM  :  16
  LOW     :   4

Opportunities by nutrient:
  fiber_soluble_g          :  29
  fiber_insoluble_g        :  29
  iodine_ug                :  11
  copper_mg                :   8
  manganese_mg             :   7
  selenium_ug              :   4
  vitamin_d_ug             :   4
  vitamin_e_mg             :   3

Top 5 files with most opportunities:
1. hazelnuts_30g_v1
   Path: data/food-data-bank/generic/ingredients/hazelnuts_30g_v1.md
   Priorities: H=4 M=1 L=0

2. almond_croissant_generic_v1
   Path: data/food-data-bank/generic/bakery/almond_croissant_generic_v1.md
   Priorities: H=3 M=1 L=0
```

## Use Cases

### 1. Parallel Processing Workflow

Use the JSON output to distribute estimation work:

```python
import json

with open('estimation_opportunities_report.json') as f:
    report = json.load(f)

# Get high-priority files
high_priority_files = [
    f for f in report['files']
    if f['priority_counts']['high'] > 0
]

# Process in batches
batch_size = 10
for i in range(0, len(high_priority_files), batch_size):
    batch = high_priority_files[i:i+batch_size]
    # Assign to worker
```

### 2. Tracking Progress

After estimating nutrients in a file, re-run the audit to see updated counts:

```bash
python scripts/audit_estimation_opportunities.py --summary-only
```

### 3. Prioritizing Work

Focus on high-priority opportunities first:

```bash
jq '.files[] | select(.priority_counts.high > 0) | {file_id, path, priority_counts}' \
   reports/estimation_opportunities_audit.json
```

### 4. Finding Specific Nutrients

Find all iodine estimation opportunities:

```bash
jq '.files[] | select(.opportunities[] | .nutrient == "iodine_ug") | {file_id, path}' \
   reports/estimation_opportunities_audit.json
```

## Reference Files Used

The script uses three reference YAML files:

1. **FIBER-SPLIT-ESTIMATION-REFERENCE.yaml**
   - Provides soluble/insoluble fiber ratios by food category
   - High confidence for most whole foods
   - Based on Marlett et al. 2002 study and USDA data

2. **IODINE-ESTIMATION-REFERENCE.yaml**
   - UK-specific iodine content ranges
   - High confidence for dairy (primary UK source)
   - Medium confidence for seafood and eggs
   - Low confidence for plant foods (soil-dependent)

3. **MICRONUTRIENT-ESTIMATION-REFERENCE.yaml**
   - Selenium, manganese, copper, vitamin D, vitamin E, B-vitamins
   - Confidence levels vary by nutrient and food type
   - USDA availability flags indicate data quality

## Priority Guidelines

### HIGH Priority (Estimate ASAP)

- **Fiber splits** where `total_fiber > 0` but `soluble/insoluble = 0`
- **Iodine = 0** in dairy products (NEVER acceptable)
- **Iodine = 0** in seafood/egg dishes
- **Manganese = 0** in nuts, whole grains (USDA has reliable data)
- **Copper = 0** in shellfish, liver, nuts

### MEDIUM Priority (Estimate when feasible)

- **Iodine = 0** in meat/grain dishes
- **Vitamin D = 0** in fatty fish, eggs
- **Vitamin E = 0** in nut/seed/oil dishes
- **B-vitamins = 0** where USDA has data

### LOW Priority (Estimate if convenient)

- **Selenium = 0** in seafood/meat (high variability)
- **Trace minerals** in various foods

## Future Enhancements

- [ ] Add B-vitamin estimation logic (B6, B12, folate, thiamin, riboflavin, niacin, B5)
- [ ] Add confidence scoring based on ingredient matching quality
- [ ] Export to CSV format for spreadsheet analysis
- [ ] Group files by venue/brand for batch processing
- [ ] Add "skip" flags for foods where estimation is not recommended
- [ ] Integration with USDA API for real-time data lookups

## Notes

- Files with `est_weight_g: null` default to 100g for calculations
- The script handles YAML extraction from markdown code blocks
- Files are sorted by priority (high → medium → low) in the output
- Research files (RESEARCH.md) are automatically skipped

## Contact

For questions or issues, refer to the main nutrition tracker documentation.
