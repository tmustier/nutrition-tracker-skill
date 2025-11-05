#!/usr/bin/env python3
"""
Migrate all databank files from schema v1 to v2 by adding 27 new nutrient fields.

This script:
- Recursively processes all .md files in data/food-data-bank/
- Adds schema_version: 2 field
- Adds 27 new nutrient fields to per_portion section (all defaulting to 0)
- Preserves all existing data and formatting
- Updates change_log with migration entry
- Validates each file after migration
- Creates backup branch before migration
- Handles errors gracefully with detailed logging

Requirements:
    pip install pyyaml

Usage:
    # Dry run (show what would change without modifying files)
    python migrate_nutrients_v1_to_v2.py --dry-run

    # Run migration with verbose logging
    python migrate_nutrients_v1_to_v2.py --verbose

    # Run migration with both dry-run and verbose
    python migrate_nutrients_v1_to_v2.py --dry-run --verbose

    # Run full migration
    python migrate_nutrients_v1_to_v2.py
"""

import sys
import argparse
import subprocess
from pathlib import Path
from datetime import datetime
import re

try:
    import yaml
except ImportError:
    sys.stderr.write("This script requires PyYAML. Install with: pip install pyyaml\n")
    sys.exit(1)

# New nutrient fields to add to per_portion section (in order)
NEW_NUTRIENTS = [
    ('copper_mg', 0),
    ('selenium_ug', 0),
    ('chromium_ug', 0),
    ('molybdenum_ug', 0),
    ('phosphorus_mg', 0),
    ('chloride_mg', 0),
    ('sulfur_g', 0),
    ('vitamin_a_ug', 0),
    ('vitamin_d_ug', 0),
    ('vitamin_e_mg', 0),
    ('vitamin_k_ug', 0),
    ('vitamin_b1_mg', 0),
    ('vitamin_b2_mg', 0),
    ('vitamin_b3_mg', 0),
    ('vitamin_b5_mg', 0),
    ('vitamin_b6_mg', 0),
    ('vitamin_b7_ug', 0),
    ('vitamin_b9_ug', 0),
    ('vitamin_b12_ug', 0),
    ('choline_mg', 0),
    ('omega3_epa_mg', 0),
    ('omega3_dha_mg', 0),
    ('omega3_ala_g', 0),
    ('omega6_la_g', 0),
    ('boron_mg', 0),
    ('silicon_mg', 0),
    ('vanadium_ug', 0),
    ('nickel_ug', 0),
]

MIGRATION_DATE = "2025-11-05"
MIGRATION_AUTHOR = "automated_migration_v1_to_v2"
MIGRATION_CHANGE = (
    "Schema migration: Added 27 new nutrient fields (vitamins B1-B12, A, D, E, K, choline; "
    "minerals copper, selenium, chromium, molybdenum, phosphorus, chloride, sulfur; "
    "fatty acids EPA, DHA, ALA, LA; ultra-trace boron, silicon, vanadium, nickel). "
    "All new fields initialized to 0."
)


class MigrationStats:
    """Track migration statistics"""
    def __init__(self):
        self.total_files = 0
        self.processed = 0
        self.skipped = 0
        self.failed = 0
        self.errors = []

    def print_summary(self):
        """Print migration summary"""
        print("\n" + "=" * 80)
        print("MIGRATION SUMMARY")
        print("=" * 80)
        print(f"Total files found:     {self.total_files}")
        print(f"Successfully migrated: {self.processed}")
        print(f"Skipped:               {self.skipped}")
        print(f"Failed:                {self.failed}")
        if self.errors:
            print(f"\nErrors ({len(self.errors)}):")
            for error in self.errors:
                print(f"  - {error}")
        print("=" * 80)


def log_verbose(message, verbose=False):
    """Print message only if verbose mode is enabled"""
    if verbose:
        print(f"[VERBOSE] {message}")


def log_info(message):
    """Print informational message"""
    print(f"[INFO] {message}")


def log_error(message):
    """Print error message"""
    print(f"[ERROR] {message}", file=sys.stderr)


def create_backup_branch(verbose=False):
    """Create a backup branch before migration"""
    try:
        # Check if we're in a git repo
        result = subprocess.run(
            ['git', 'rev-parse', '--git-dir'],
            capture_output=True,
            text=True,
            check=False
        )
        if result.returncode != 0:
            log_info("Not in a git repository. Skipping backup branch creation.")
            return False

        # Get current branch name
        result = subprocess.run(
            ['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
            capture_output=True,
            text=True,
            check=True
        )
        current_branch = result.stdout.strip()
        log_verbose(f"Current branch: {current_branch}", verbose)

        # Create backup branch name with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_branch = f"backup_before_migration_v2_{timestamp}"

        # Create backup branch
        result = subprocess.run(
            ['git', 'branch', backup_branch],
            capture_output=True,
            text=True,
            check=True
        )
        log_info(f"Created backup branch: {backup_branch}")
        return True

    except subprocess.CalledProcessError as e:
        log_error(f"Failed to create backup branch: {e}")
        if e.stderr:
            log_error(f"stderr: {e.stderr}")
        return False


def find_databank_files(data_bank_dir, verbose=False):
    """Find all .md files in the data bank directory"""
    files = []
    for filepath in sorted(data_bank_dir.rglob('*.md')):
        # Skip README, RESEARCH, and index files
        if filepath.name in ['README.md', 'RESEARCH.md', 'index.md']:
            log_verbose(f"Skipping {filepath.name}", verbose)
            continue
        files.append(filepath)

    log_info(f"Found {len(files)} databank files to process")
    return files


def parse_yaml_block(content):
    """Extract and parse YAML block from markdown content

    Returns: (yaml_start_pos, yaml_end_pos, parsed_data) or (None, None, None) if parsing fails
    """
    try:
        # Find YAML block boundaries
        yaml_start = content.index('```yaml')
        yaml_block_start = yaml_start + 7  # Length of '```yaml'
        yaml_end = content.index('```', yaml_block_start)

        # Extract YAML text
        yaml_text = content[yaml_block_start:yaml_end].strip()

        # Parse YAML
        data = yaml.safe_load(yaml_text)

        return (yaml_start, yaml_end + 3, data)  # +3 for '```'

    except Exception as e:
        return (None, None, None)


def needs_migration(data, verbose=False):
    """Check if a file needs migration

    Returns: (needs_migration, reason)
    """
    # Check if schema_version is already 2 or higher
    schema_version = data.get('schema_version')
    if schema_version is not None and schema_version >= 2:
        return (False, f"Already migrated (schema_version: {schema_version})")

    # If no schema_version or schema_version < 2, needs migration
    if schema_version is None:
        return (True, "Needs migration (schema_version missing)")
    else:
        return (True, f"Needs migration (schema_version: {schema_version} < 2)")


def serialize_yaml_value(value):
    """Serialize a Python value to YAML format with proper formatting"""
    if value is None:
        return 'null'
    elif isinstance(value, bool):
        return 'true' if value else 'false'
    elif isinstance(value, (int, float)):
        # Keep numeric formatting consistent
        if isinstance(value, float) and value == int(value):
            return str(int(value))
        return str(value)
    elif isinstance(value, str):
        # Handle strings that need quoting
        if ':' in value or value.startswith('-') or '\n' in value:
            return yaml.safe_dump(value, default_flow_style=True).strip()
        return value
    elif isinstance(value, list):
        # Handle lists
        return yaml.safe_dump(value, default_flow_style=True).strip()
    elif isinstance(value, dict):
        # Handle dicts
        return yaml.safe_dump(value, default_flow_style=True).strip()
    else:
        return str(value)


def build_yaml_text(data):
    """Build YAML text from data dict, preserving order and formatting

    This function manually constructs YAML to maintain precise control over
    ordering and formatting, particularly for the per_portion section.
    """
    lines = []

    # Define the expected order of top-level keys
    top_level_order = [
        'id', 'schema_version', 'version', 'last_verified', 'source', 'aliases',
        'category', 'portion', 'assumptions', 'per_portion', 'derived',
        'quality', 'notes', 'change_log'
    ]

    # Define the expected order of per_portion keys (existing + new)
    per_portion_order = [
        'energy_kcal', 'protein_g', 'fat_g', 'sat_fat_g', 'mufa_g', 'pufa_g',
        'trans_fat_g', 'cholesterol_mg', 'sugar_g', 'fiber_total_g',
        'fiber_soluble_g', 'fiber_insoluble_g', 'sodium_mg', 'potassium_mg',
        'iodine_ug', 'magnesium_mg', 'calcium_mg', 'iron_mg', 'zinc_mg',
        'vitamin_c_mg', 'manganese_mg', 'polyols_g', 'carbs_available_g', 'carbs_total_g',
        # New nutrients
        'copper_mg', 'selenium_ug', 'chromium_ug', 'molybdenum_ug',
        'phosphorus_mg', 'chloride_mg', 'sulfur_g', 'vitamin_a_ug',
        'vitamin_d_ug', 'vitamin_e_mg', 'vitamin_k_ug', 'vitamin_b1_mg',
        'vitamin_b2_mg', 'vitamin_b3_mg', 'vitamin_b5_mg', 'vitamin_b6_mg',
        'vitamin_b7_ug', 'vitamin_b9_ug', 'vitamin_b12_ug', 'choline_mg',
        'omega3_epa_mg', 'omega3_dha_mg', 'omega3_ala_g', 'omega6_la_g',
        'boron_mg', 'silicon_mg', 'vanadium_ug', 'nickel_ug'
    ]

    def write_key_value(key, value, indent=0):
        """Write a key-value pair with proper indentation and formatting"""
        prefix = '  ' * indent

        if value is None:
            lines.append(f"{prefix}{key}:")
        elif isinstance(value, dict):
            lines.append(f"{prefix}{key}:")
            # Handle nested dicts
            for nested_key, nested_value in value.items():
                write_key_value(nested_key, nested_value, indent + 1)
        elif isinstance(value, list):
            lines.append(f"{prefix}{key}:")
            for item in value:
                if isinstance(item, dict):
                    # List of dicts (like change_log entries)
                    first_key = True
                    for item_key, item_value in item.items():
                        if first_key:
                            lines.append(f"{prefix}- {item_key}: {serialize_yaml_value(item_value)}")
                            first_key = False
                        else:
                            lines.append(f"{prefix}  {item_key}: {serialize_yaml_value(item_value)}")
                elif isinstance(item, str):
                    # Handle multiline strings in lists
                    if '\n' in item or item.startswith('='):
                        lines.append(f"{prefix}- '{item}'")
                    else:
                        lines.append(f"{prefix}- {item}")
                else:
                    lines.append(f"{prefix}- {serialize_yaml_value(item)}")
        elif isinstance(value, str):
            # Handle strings with special characters
            if '\n' in value or value.startswith('=') or ':' in value:
                # Use quoted string
                escaped_value = value.replace('"', '\\"')
                lines.append(f'{prefix}{key}: "{escaped_value}"')
            else:
                lines.append(f"{prefix}{key}: {value}")
        else:
            lines.append(f"{prefix}{key}: {serialize_yaml_value(value)}")

    # Process top-level keys in order
    for key in top_level_order:
        if key not in data:
            continue

        if key == 'per_portion':
            # Special handling for per_portion to control order
            lines.append('per_portion:')
            per_portion = data['per_portion']

            # Write nutrients in specified order
            for nutrient_key in per_portion_order:
                if nutrient_key in per_portion:
                    value = per_portion[nutrient_key]
                    lines.append(f"  {nutrient_key}: {serialize_yaml_value(value)}")

            # Add any remaining keys not in the order list (shouldn't happen)
            for nutrient_key, value in per_portion.items():
                if nutrient_key not in per_portion_order:
                    lines.append(f"  {nutrient_key}: {serialize_yaml_value(value)}")
        else:
            write_key_value(key, data[key], indent=0)

    # Add any remaining keys not in the order list
    for key, value in data.items():
        if key not in top_level_order:
            write_key_value(key, value, indent=0)

    return '\n'.join(lines)


def migrate_file(filepath, dry_run=False, verbose=False):
    """Migrate a single file

    Returns: (success, message)
    """
    try:
        log_verbose(f"Processing {filepath.name}", verbose)

        # Read file content
        content = filepath.read_text(encoding='utf-8')

        # Parse YAML block
        yaml_start, yaml_end, data = parse_yaml_block(content)

        if data is None:
            return (False, f"Failed to parse YAML block in {filepath.name}")

        # Check if migration is needed
        needs_mig, reason = needs_migration(data, verbose)
        if not needs_mig:
            log_verbose(f"Skipping {filepath.name}: {reason}", verbose)
            return (None, reason)  # None indicates skipped

        log_verbose(f"Migrating {filepath.name}", verbose)

        # Add schema_version if not present
        if 'schema_version' not in data:
            data['schema_version'] = 2
            log_verbose("  Added schema_version: 2", verbose)

        # Add new nutrients to per_portion
        per_portion = data.get('per_portion', {})
        added_nutrients = []

        for nutrient_name, default_value in NEW_NUTRIENTS:
            if nutrient_name not in per_portion:
                per_portion[nutrient_name] = default_value
                added_nutrients.append(nutrient_name)

        data['per_portion'] = per_portion
        log_verbose(f"  Added {len(added_nutrients)} new nutrients", verbose)

        # Add migration entry to change_log
        change_log = data.get('change_log', [])

        migration_entry = {
            'date': MIGRATION_DATE,
            'updated_by': MIGRATION_AUTHOR,
            'change': MIGRATION_CHANGE
        }

        change_log.append(migration_entry)
        data['change_log'] = change_log
        log_verbose("  Added change_log entry", verbose)

        # Build new YAML text
        new_yaml_text = build_yaml_text(data)

        # Reconstruct file content
        before_yaml = content[:yaml_start]
        after_yaml = content[yaml_end:]
        new_content = f"{before_yaml}```yaml\n{new_yaml_text}\n```{after_yaml}"

        if dry_run:
            log_info(f"[DRY-RUN] Would migrate {filepath.name}")
            if verbose:
                print("\n" + "-" * 40)
                print(f"Preview of changes for {filepath.name}:")
                print("-" * 40)
                print(f"Added schema_version: 2")
                print(f"Added {len(added_nutrients)} new nutrients to per_portion")
                print(f"Added change_log entry with date: {MIGRATION_DATE}")
                print("-" * 40 + "\n")
        else:
            # Write migrated content
            filepath.write_text(new_content, encoding='utf-8')
            log_info(f"Migrated {filepath.name}")

        return (True, f"Successfully migrated {filepath.name}")

    except Exception as e:
        error_msg = f"Failed to migrate {filepath.name}: {str(e)}"
        log_error(error_msg)
        return (False, error_msg)


def validate_migrations(data_bank_dir, validate_script_path, verbose=False):
    """Run validation on migrated files"""
    log_info("Running validation on migrated files...")

    try:
        result = subprocess.run(
            [sys.executable, str(validate_script_path), str(data_bank_dir), '--no-index'],
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )

        if verbose:
            print("\n" + "=" * 80)
            print("VALIDATION OUTPUT")
            print("=" * 80)
            print(result.stdout)
            if result.stderr:
                print("STDERR:")
                print(result.stderr)
            print("=" * 80 + "\n")

        if result.returncode == 0:
            log_info("Validation passed!")
            return True
        else:
            log_error(f"Validation failed with exit code {result.returncode}")
            return False

    except subprocess.TimeoutExpired:
        log_error("Validation timed out after 5 minutes")
        return False
    except Exception as e:
        log_error(f"Failed to run validation: {e}")
        return False


def main():
    """Main migration function"""
    parser = argparse.ArgumentParser(
        description="Migrate databank files from schema v1 to v2",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Dry run to see what would change
  python migrate_nutrients_v1_to_v2.py --dry-run

  # Run migration with verbose logging
  python migrate_nutrients_v1_to_v2.py --verbose

  # Run migration with both dry-run and verbose
  python migrate_nutrients_v1_to_v2.py --dry-run --verbose

  # Run full migration
  python migrate_nutrients_v1_to_v2.py
        """
    )

    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would change without modifying files'
    )

    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose logging'
    )

    parser.add_argument(
        '--data-bank-dir',
        type=Path,
        default=None,
        help='Path to data bank directory (default: data/food-data-bank)'
    )

    parser.add_argument(
        '--skip-validation',
        action='store_true',
        help='Skip validation after migration'
    )

    parser.add_argument(
        '--skip-backup',
        action='store_true',
        help='Skip creating backup branch'
    )

    args = parser.parse_args()

    # Determine data bank directory
    if args.data_bank_dir:
        data_bank_dir = args.data_bank_dir
    else:
        script_dir = Path(__file__).parent
        data_bank_dir = script_dir.parent / 'data' / 'food-data-bank'

    if not data_bank_dir.exists():
        log_error(f"Data bank directory not found: {data_bank_dir}")
        return 1

    log_info(f"Data bank directory: {data_bank_dir}")

    if args.dry_run:
        log_info("DRY-RUN MODE: No files will be modified")

    # Create backup branch (unless in dry-run or skip-backup mode)
    if not args.dry_run and not args.skip_backup:
        log_info("Creating backup branch...")
        create_backup_branch(args.verbose)

    # Find all databank files
    files = find_databank_files(data_bank_dir, args.verbose)

    # Initialize stats
    stats = MigrationStats()
    stats.total_files = len(files)

    # Process each file
    for filepath in files:
        success, message = migrate_file(filepath, args.dry_run, args.verbose)

        if success is True:
            stats.processed += 1
        elif success is None:
            stats.skipped += 1
        else:
            stats.failed += 1
            stats.errors.append(message)

    # Print summary
    stats.print_summary()

    # Run validation (unless in dry-run mode or validation is skipped)
    if not args.dry_run and not args.skip_validation:
        script_dir = Path(__file__).parent
        validate_script = script_dir / 'validate_data_bank.py'

        if validate_script.exists():
            validation_passed = validate_migrations(data_bank_dir, validate_script, args.verbose)

            if not validation_passed:
                log_error("Validation failed! Please review the errors above.")
                return 1
        else:
            log_error(f"Validation script not found: {validate_script}")

    # Exit with appropriate code
    if stats.failed > 0:
        log_error(f"Migration completed with {stats.failed} failures")
        return 1

    if args.dry_run:
        log_info("DRY-RUN completed successfully. Run without --dry-run to apply changes.")
    else:
        log_info("Migration completed successfully!")

    return 0


if __name__ == '__main__':
    sys.exit(main())
