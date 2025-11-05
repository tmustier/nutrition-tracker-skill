# Databank Schema Migration: v1 to v2

## Overview

This migration script (`migrate_nutrients_v1_to_v2.py`) upgrades all databank files from schema version 1 to version 2 by adding 28 new nutrient fields to support comprehensive nutritional tracking.

## What Gets Added

### Schema Version
- `schema_version: 2` field at the top level

### New Nutrient Fields (28 total)

All fields are added to the `per_portion` section with default value of `0`:

**Minerals (7 fields)**
- `copper_mg`: Copper in milligrams
- `selenium_ug`: Selenium in micrograms
- `chromium_ug`: Chromium in micrograms
- `molybdenum_ug`: Molybdenum in micrograms
- `phosphorus_mg`: Phosphorus in milligrams
- `chloride_mg`: Chloride in milligrams
- `sulfur_g`: Sulfur in grams

**Vitamins (11 fields)**
- `vitamin_a_ug`: Vitamin A in micrograms
- `vitamin_d_ug`: Vitamin D in micrograms
- `vitamin_e_mg`: Vitamin E in milligrams
- `vitamin_k_ug`: Vitamin K in micrograms
- `vitamin_b1_mg`: Thiamine (B1) in milligrams
- `vitamin_b2_mg`: Riboflavin (B2) in milligrams
- `vitamin_b3_mg`: Niacin (B3) in milligrams
- `vitamin_b5_mg`: Pantothenic acid (B5) in milligrams
- `vitamin_b6_mg`: Pyridoxine (B6) in milligrams
- `vitamin_b7_ug`: Biotin (B7) in micrograms
- `vitamin_b9_ug`: Folate (B9) in micrograms
- `vitamin_b12_ug`: Cobalamin (B12) in micrograms
- `choline_mg`: Choline in milligrams

**Fatty Acids (4 fields)**
- `omega3_epa_mg`: EPA (Eicosapentaenoic acid) in milligrams
- `omega3_dha_mg`: DHA (Docosahexaenoic acid) in milligrams
- `omega3_ala_g`: ALA (Alpha-linolenic acid) in grams
- `omega6_la_g`: LA (Linoleic acid) in grams

**Ultra-trace Minerals (4 fields)**
- `boron_mg`: Boron in milligrams
- `silicon_mg`: Silicon in milligrams
- `vanadium_ug`: Vanadium in micrograms
- `nickel_ug`: Nickel in micrograms

### Change Log Entry

A new entry is added to the `change_log` section:

```yaml
- date: "2025-11-05"
  updated_by: "automated_migration_v1_to_v2"
  change: "Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline; minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; fatty acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). All new fields initialized to 0."
```

## Usage

### Prerequisites

```bash
pip install pyyaml
```

### Basic Commands

#### 1. Dry Run (Recommended First Step)
Shows what would be changed without modifying any files:

```bash
python scripts/migrate_nutrients_v1_to_v2.py --dry-run
```

#### 2. Dry Run with Verbose Output
Shows detailed information about each file:

```bash
python scripts/migrate_nutrients_v1_to_v2.py --dry-run --verbose
```

#### 3. Run Full Migration
Executes the migration, creates backup branch, and validates results:

```bash
python scripts/migrate_nutrients_v1_to_v2.py
```

#### 4. Run Migration with Verbose Logging
Useful for debugging or detailed tracking:

```bash
python scripts/migrate_nutrients_v1_to_v2.py --verbose
```

### Advanced Options

#### Skip Backup Branch Creation
If you don't want to create a git backup branch:

```bash
python scripts/migrate_nutrients_v1_to_v2.py --skip-backup
```

#### Skip Validation
If you want to skip the post-migration validation step:

```bash
python scripts/migrate_nutrients_v1_to_v2.py --skip-validation
```

#### Custom Data Bank Directory
To migrate files in a different directory:

```bash
python scripts/migrate_nutrients_v1_to_v2.py --data-bank-dir /path/to/custom/directory
```

## Migration Process

The script follows these steps:

1. **Git Backup** (unless `--skip-backup`): Creates a backup branch with timestamp
2. **File Discovery**: Recursively finds all `.md` files in `data/food-data-bank/`
3. **Processing**: For each file:
   - Parses YAML front matter
   - Checks if migration is needed (skips if already migrated)
   - Adds `schema_version: 2`
   - Adds 28 new nutrient fields with default value `0`
   - Adds migration entry to `change_log`
   - Preserves all existing data and formatting
4. **Validation** (unless `--skip-validation`): Runs `validate_data_bank.py` on all migrated files
5. **Summary**: Displays migration statistics

## Safety Features

### Automatic Skipping
The script automatically skips files that:
- Already have `schema_version: 2` or higher
- Already contain any of the new nutrient fields
- Cannot be parsed (with error logging)

### Data Preservation
- All existing data is preserved
- Original formatting is maintained
- YAML structure remains intact
- Change log history is preserved

### Error Handling
- Failed migrations are logged but don't stop the process
- Detailed error messages for debugging
- Summary report shows all successes, skips, and failures

### Validation
- Post-migration validation ensures data integrity
- Uses the existing `validate_data_bank.py` script
- Checks for formatting issues, calculation errors, and missing fields

## Expected Output

### Dry Run Output Example

```
[INFO] Data bank directory: /home/user/nutrition-tracking/data/food-data-bank
[INFO] DRY-RUN MODE: No files will be modified
[INFO] Found 71 databank files to process
[INFO] [DRY-RUN] Would migrate ham_cheese_croissant_generic_v1.md
...
================================================================================
MIGRATION SUMMARY
================================================================================
Total files found:     71
Successfully migrated: 52
Skipped:               19
Failed:                0
================================================================================
[INFO] DRY-RUN completed successfully. Run without --dry-run to apply changes.
```

### Full Migration Output Example

```
[INFO] Data bank directory: /home/user/nutrition-tracking/data/food-data-bank
[INFO] Creating backup branch...
[INFO] Created backup branch: backup_before_migration_v2_20251105_143022
[INFO] Found 71 databank files to process
[INFO] Migrated ham_cheese_croissant_generic_v1.md
...
================================================================================
MIGRATION SUMMARY
================================================================================
Total files found:     71
Successfully migrated: 52
Skipped:               19
Failed:                0
================================================================================
[INFO] Running validation on migrated files...
[INFO] Validation passed!
[INFO] Migration completed successfully!
```

## Troubleshooting

### Issue: "Failed to parse YAML block"
**Cause**: Malformed YAML in the file
**Solution**: Manually fix the YAML syntax in the problematic file

### Issue: Validation fails after migration
**Cause**: Existing data issues or calculation errors
**Solution**: Review the validation output to identify specific issues

### Issue: Git backup branch creation fails
**Cause**: Not in a git repository or git permissions issue
**Solution**: Use `--skip-backup` flag or fix git configuration

## Rollback

If you need to rollback the migration:

1. If backup branch was created:
   ```bash
   git reset --hard backup_before_migration_v2_TIMESTAMP
   ```

2. If no backup branch:
   ```bash
   git reset --hard HEAD~1  # If changes were committed
   git checkout .           # If changes were not committed
   ```

## File Structure Example

### Before Migration
```yaml
id: oats_dry_50g_v1
version: 4
last_verified: "2025-11-02"
# ... other fields ...
per_portion:
  energy_kcal: 208.9
  protein_g: 8.5
  # ... 24 existing nutrients ...
  carbs_total_g: 38.5
# ... rest of file ...
```

### After Migration
```yaml
id: oats_dry_50g_v1
schema_version: 2
version: 4
last_verified: "2025-11-02"
# ... other fields ...
per_portion:
  energy_kcal: 208.9
  protein_g: 8.5
  # ... 24 existing nutrients ...
  carbs_total_g: 38.5
  copper_mg: 0
  selenium_ug: 0
  # ... 28 new nutrients ...
  nickel_ug: 0
# ... rest of file ...
change_log:
  # ... existing entries ...
  - date: "2025-11-05"
    updated_by: "automated_migration_v1_to_v2"
    change: "Schema migration: Added 27 new nutrient fields..."
```

## Notes

- The migration is **idempotent**: Running it multiple times is safe
- Files with `schema_version >= 2` are automatically skipped
- All new nutrient fields default to `0` (not `null`)
- The script processes files recursively through all subdirectories
- RESEARCH.md, README.md, and index.md files are excluded

## Support

For issues or questions:
1. Check the error messages in the migration output
2. Run with `--verbose` flag for detailed logging
3. Review the validation output for specific issues
4. Check the git history for the backup branch timestamp
