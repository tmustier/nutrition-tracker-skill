# YAML Parsing Errors Blocking 70% of Food Bank Validation

## Summary

**Critical data quality issue**: 71 out of 101 food bank entries (70%) cannot be validated due to YAML parsing errors in the `change_log` section. This prevents the validator from checking energy calculations, nutrient coherence, and the newly implemented fiber split validation.

## Impact

### Current State
```
Total food bank entries:           101
├─ Successfully validated:          30 (30%)
└─ YAML parsing failures:           71 (70%) ⚠️ CRITICAL
```

### Consequences
- **Validation coverage**: Only 30% of food bank can be validated
- **Data quality risk**: Entries with potential errors cannot be detected
- **Maintenance burden**: New validation rules (e.g., fiber split) cannot check most entries
- **CI/CD impact**: Cannot implement strict validation as pre-commit hook due to high failure rate

## Root Cause

### Technical Details

The YAML parser expects `change_log` to be a properly indented list under a mapping key, but many entries have incorrect indentation that causes parsing to fail.

**Error message pattern:**
```
expected <block end>, but found '-'
  in "<unicode string>", line 107, column 1:
    - timestamp: 2025-11-05T00:00:00 ...
    ^
```

### Incorrect Format (70% of files)
```yaml
notes:
  - "Some note here"
change_log:
- timestamp: "2025-11-05T00:00:00"     # ❌ WRONG: dash not indented
  updated_by: "LLM: Claude Sonnet 4.5"
  change: "Description"
```

The parser sees `notes` as a mapping with a list, then expects the mapping to end. When it encounters the non-indented `-` at the start of line, it fails because it's not valid at the current indentation level.

### Correct Format (30% of files)
```yaml
notes:
  - "Some note here"
change_log:
  - timestamp: "2025-11-05T00:00:00"   # ✅ CORRECT: list properly indented under change_log key
    updated_by: "LLM: Claude Sonnet 4.5"
    change: "Description"
  - timestamp: "2025-11-06T00:00:00"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients"
```

## Affected Files

### Sample of Affected Files (71 total)
```
data/food-data-bank/generic/bakery/almond_croissant_generic_v1.md
data/food-data-bank/generic/bakery/ham_cheese_croissant_generic_v1.md
data/food-data-bank/generic/fresh-produce/banana_raw_150g_v1.md
data/food-data-bank/generic/fresh-produce/avocado_fresh_75g_generic-ingredients_v1.md
data/food-data-bank/generic/fresh-produce/blueberries_150g_v1.md
data/food-data-bank/generic/fresh-produce/clementine_fresh_fruit_v1.md
data/food-data-bank/generic/fresh-produce/kiwi_small_70g_generic-fresh-produce_v1.md
data/food-data-bank/generic/fresh-produce/persimmon_fresh_fruit_generic_v1.md
data/food-data-bank/packaged/fage/greek_yogurt_0pct_200g_v1.md
data/food-data-bank/generic/nuts-seeds/hazelnuts_30g_v1.md
data/food-data-bank/generic/grains/oats_dry_50g_v1.md
... (61 more files)
```

### How to Find All Affected Files
```bash
python3 scripts/validate_data_bank.py 2>&1 | grep "Failed to parse" | awk '{print $4}'
```

## Proposed Solution

### Option 1: Automated Fix Script (Recommended)

Create a script to fix all `change_log` formatting issues:

```python
#!/usr/bin/env python3
"""Fix change_log indentation in all food bank entries."""

import os
import re
from pathlib import Path

def fix_change_log_indentation(content: str) -> str:
    """
    Fix change_log formatting by ensuring list items are indented.

    Pattern:
    - Find 'change_log:\n' followed by non-indented '-'
    - Add 2 spaces before each '-' and its continuation lines
    """
    lines = content.split('\n')
    fixed_lines = []
    in_change_log = False

    for i, line in enumerate(lines):
        if line.strip() == 'change_log:':
            in_change_log = True
            fixed_lines.append(line)
        elif in_change_log:
            # Check if we've exited change_log section (next top-level key or end of YAML)
            if line and not line[0].isspace() and not line.startswith('-'):
                in_change_log = False
                fixed_lines.append(line)
            # Fix non-indented list items
            elif line.startswith('-') or (line.startswith('  ') and not line.startswith('    ')):
                # Add proper indentation (2 spaces for list items under change_log)
                if line.startswith('-'):
                    fixed_lines.append('  ' + line)
                else:
                    fixed_lines.append(line)
            else:
                fixed_lines.append(line)
        else:
            fixed_lines.append(line)

    return '\n'.join(fixed_lines)

def main():
    food_bank_dir = Path('data/food-data-bank')
    fixed_count = 0

    for md_file in food_bank_dir.rglob('*.md'):
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()

        fixed_content = fix_change_log_indentation(content)

        if fixed_content != content:
            with open(md_file, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            fixed_count += 1
            print(f"Fixed: {md_file}")

    print(f"\nTotal files fixed: {fixed_count}")

if __name__ == '__main__':
    main()
```

**Usage:**
```bash
python3 scripts/fix_change_log_formatting.py
python3 scripts/validate_data_bank.py  # Verify fixes
```

### Option 2: Manual Fix with sed (Quick but less robust)

```bash
# Find all affected files and fix in-place
find data/food-data-bank -name "*.md" -exec sed -i '/^change_log:$/,/^[a-z_]*:$/ {
  /^- timestamp:/s/^/  /
  /^  [a-z_]*:/s/^/  /
}' {} +
```

**⚠️ Warning**: Test on a few files first before running on entire food bank.

### Option 3: Schema Validator with Auto-fix

Enhance `validate_data_bank.py` to:
1. Detect YAML parsing errors
2. Attempt auto-fix using Option 1 logic
3. Re-validate
4. Report files that couldn't be auto-fixed

## Validation After Fix

After fixing, expect:
- **Parsing success rate**: 100% (up from 30%)
- **New validation coverage**: All 71 previously unparseable entries can now be checked
- **Potential new warnings**: Entries may have data quality issues that were previously undetectable

## Priority Assessment

**Priority: P0 - Critical**

### Rationale
1. **Blocks 70% of validation**: Cannot ensure data quality for most entries
2. **Accumulating technical debt**: New entries may continue pattern if not fixed
3. **Prevents CI/CD improvement**: Cannot implement strict pre-commit validation
4. **Low-hanging fruit**: Purely formatting issue, no data changes required
5. **High ROI**: Single script run fixes 71 files instantly

### Recommended Timeline
- **Week 1**: Implement and test fix script on 5-10 sample files
- **Week 2**: Run on full food bank, commit fixes
- **Week 3**: Add pre-commit hook to prevent recurrence

## Additional Context

### Discovery
This issue was discovered while implementing fiber split validation. The validator successfully processes 30 entries and identified 2 legitimate data errors (8% failure rate among validated entries), but couldn't check the remaining 71 entries due to YAML parsing failures.

### Files Successfully Validated (30 files that follow correct format)
These serve as reference examples:
- `data/food-data-bank/generic/home-cooked/black_rice_coconut_milk_honey_350g_home-cooked_v1.md`
- `data/food-data-bank/generic/ingredients/raspberries_fresh_150g_ingredients_v1.md`
- `data/food-data-bank/generic/miznon/bag_o_broken_chicken_miznon_v1.md` (recently fixed)
- `data/food-data-bank/venues/panzers/salmon_sushi_set_panzers_v1.md` (recently fixed)

### Related Issues
- Fiber split validation (recently implemented) is working correctly but limited to 30% coverage
- Energy calculation validation similarly limited
- Omega fatty acid validation similarly limited

## Acceptance Criteria

- [ ] All 71 YAML parsing errors resolved
- [ ] `python3 scripts/validate_data_bank.py` reports 100% parsing success
- [ ] No data changes (only formatting)
- [ ] All existing passing entries still pass validation
- [ ] New validation coverage: 101/101 entries (100%)
- [ ] Documentation updated with correct `change_log` format
- [ ] (Optional) Pre-commit hook added to prevent recurrence

---

**Estimated Effort**: 2-4 hours (script development + testing + review)
**Risk**: Low (formatting-only changes, easily reversible with git)
**Impact**: High (unlocks full validation coverage)
