#!/usr/bin/env python3
"""
Fix Null Values in Nutrition Log Files

This script scans all YAML log files in data/logs/ and replaces all null values
in nutrition sections with 0, while preserving file structure and other fields.

Usage:
    python scripts/fix_nulls_logs.py [--dry-run] [--verbose] [--backup]

Options:
    --dry-run   : Show what would be changed without modifying files
    --verbose   : Print detailed information about changes
    --backup    : Create .bak backup files before modifying
"""

import os
import sys
import yaml
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Any
from collections import defaultdict


class NullFixer:
    """Handles fixing null values in nutrition log files."""

    # Nutrition fields that should have numeric values (not null)
    NUTRITION_FIELDS = {
        'energy_kcal', 'protein_g', 'fat_g', 'sat_fat_g', 'mufa_g', 'pufa_g',
        'trans_fat_g', 'cholesterol_mg', 'sugar_g', 'fiber_total_g',
        'fiber_soluble_g', 'fiber_insoluble_g', 'sodium_mg', 'potassium_mg',
        'iodine_ug', 'magnesium_mg', 'calcium_mg', 'iron_mg', 'zinc_mg',
        'vitamin_c_mg', 'manganese_mg', 'polyols_g', 'carbs_available_g',
        'carbs_total_g'
    }

    def __init__(self, dry_run: bool = False, verbose: bool = False, backup: bool = False):
        """
        Initialize the NullFixer.

        Args:
            dry_run: If True, don't modify files, just report changes
            verbose: If True, print detailed information
            backup: If True, create backup files before modifying
        """
        self.dry_run = dry_run
        self.verbose = verbose
        self.backup = backup

        # Statistics tracking
        self.files_processed = 0
        self.files_modified = 0
        self.total_nulls_fixed = 0
        self.errors = []
        self.file_stats = defaultdict(int)  # nulls per file

    def find_log_files(self, logs_dir: Path) -> List[Path]:
        """
        Find all YAML log files in the logs directory.

        Args:
            logs_dir: Path to the logs directory

        Returns:
            List of Path objects for YAML files
        """
        yaml_files = []

        if not logs_dir.exists():
            raise FileNotFoundError(f"Logs directory not found: {logs_dir}")

        # Recursively find all .yaml files, excluding SCHEMA.md
        for yaml_file in logs_dir.rglob("*.yaml"):
            if yaml_file.name != "SCHEMA.md":
                yaml_files.append(yaml_file)

        return sorted(yaml_files)

    def fix_nutrition_nulls(self, data: Dict[str, Any], file_path: Path) -> Tuple[bool, int]:
        """
        Fix null values in nutrition sections of the data.

        Args:
            data: Parsed YAML data
            file_path: Path to the file (for error reporting)

        Returns:
            Tuple of (modified: bool, nulls_fixed: int)
        """
        modified = False
        nulls_fixed = 0

        try:
            # Navigate to entries
            if 'entries' not in data:
                if self.verbose:
                    print(f"  Warning: No 'entries' key in {file_path}")
                return False, 0

            for entry_idx, entry in enumerate(data['entries']):
                if not isinstance(entry, dict):
                    continue

                # Navigate to items
                if 'items' not in entry:
                    if self.verbose:
                        print(f"  Warning: No 'items' in entry {entry_idx} of {file_path}")
                    continue

                for item_idx, item in enumerate(entry['items']):
                    if not isinstance(item, dict):
                        continue

                    # Navigate to nutrition
                    if 'nutrition' not in item:
                        if self.verbose:
                            print(f"  Warning: No 'nutrition' in item {item_idx} "
                                  f"of entry {entry_idx} in {file_path}")
                        continue

                    nutrition = item['nutrition']
                    if not isinstance(nutrition, dict):
                        continue

                    # Fix null values in nutrition fields
                    for field, value in nutrition.items():
                        # Only fix fields that are in our known nutrition fields
                        if field in self.NUTRITION_FIELDS and value is None:
                            nutrition[field] = 0
                            nulls_fixed += 1
                            modified = True

                            if self.verbose:
                                item_name = item.get('name', 'Unknown')
                                timestamp = entry.get('timestamp', 'Unknown')
                                print(f"    Fixed: {field} in '{item_name}' "
                                      f"(timestamp: {timestamp})")

        except Exception as e:
            error_msg = f"Error processing {file_path}: {str(e)}"
            self.errors.append(error_msg)
            if self.verbose:
                print(f"  ERROR: {error_msg}")

        return modified, nulls_fixed

    def process_file(self, file_path: Path) -> None:
        """
        Process a single YAML file.

        Args:
            file_path: Path to the YAML file
        """
        self.files_processed += 1

        try:
            # Read the file
            with open(file_path, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)

            if data is None:
                if self.verbose:
                    print(f"  Skipping empty file: {file_path}")
                return

            # Fix nulls
            modified, nulls_fixed = self.fix_nutrition_nulls(data, file_path)

            if not modified:
                if self.verbose:
                    print(f"  No changes needed in {file_path}")
                return

            # Track statistics
            self.files_modified += 1
            self.total_nulls_fixed += nulls_fixed
            self.file_stats[str(file_path)] = nulls_fixed

            if self.verbose:
                print(f"  Fixed {nulls_fixed} null value(s) in {file_path}")

            # Write back to file (unless dry-run)
            if not self.dry_run:
                # Create backup if requested
                if self.backup:
                    backup_path = file_path.with_suffix('.yaml.bak')
                    with open(file_path, 'r', encoding='utf-8') as src:
                        with open(backup_path, 'w', encoding='utf-8') as dst:
                            dst.write(src.read())
                    if self.verbose:
                        print(f"    Created backup: {backup_path}")

                # Write modified data
                with open(file_path, 'w', encoding='utf-8') as f:
                    yaml.safe_dump(data, f,
                                   default_flow_style=False,
                                   allow_unicode=True,
                                   sort_keys=False,
                                   indent=2)

                if self.verbose:
                    print(f"    Wrote changes to {file_path}")

        except Exception as e:
            error_msg = f"Error processing file {file_path}: {str(e)}"
            self.errors.append(error_msg)
            print(f"ERROR: {error_msg}", file=sys.stderr)

    def print_summary(self) -> None:
        """Print summary statistics."""
        print("\n" + "=" * 70)
        print("SUMMARY")
        print("=" * 70)
        print(f"Files processed:        {self.files_processed}")
        print(f"Files modified:         {self.files_modified}")
        print(f"Total nulls replaced:   {self.total_nulls_fixed}")
        print(f"Errors encountered:     {len(self.errors)}")

        if self.dry_run:
            print("\nDRY RUN MODE: No files were actually modified")

        if self.files_modified > 0:
            print("\nFiles with changes:")
            for file_path, null_count in sorted(self.file_stats.items()):
                print(f"  {file_path}: {null_count} null(s) fixed")

        if self.errors:
            print("\nErrors:")
            for error in self.errors:
                print(f"  - {error}")

        print("=" * 70)


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Fix null values in nutrition log files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Preview changes without modifying files
  python scripts/fix_nulls_logs.py --dry-run --verbose

  # Fix all null values with backups
  python scripts/fix_nulls_logs.py --backup --verbose

  # Fix all null values (no backups)
  python scripts/fix_nulls_logs.py
        """
    )

    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be changed without modifying files'
    )

    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Print detailed information about changes'
    )

    parser.add_argument(
        '--backup', '-b',
        action='store_true',
        help='Create .bak backup files before modifying'
    )

    args = parser.parse_args()

    # Determine the project root (script is in scripts/, data is in data/)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    logs_dir = project_root / "data" / "logs"

    print("Nutrition Log Null Fixer")
    print("=" * 70)
    print(f"Logs directory: {logs_dir}")
    print(f"Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
    print(f"Verbose: {args.verbose}")
    print(f"Backup: {args.backup}")
    print("=" * 70)

    # Create the fixer
    fixer = NullFixer(dry_run=args.dry_run, verbose=args.verbose, backup=args.backup)

    try:
        # Find all log files
        log_files = fixer.find_log_files(logs_dir)
        print(f"\nFound {len(log_files)} log file(s) to process\n")

        if not log_files:
            print("No log files found. Exiting.")
            return 0

        # Process each file
        for log_file in log_files:
            if args.verbose:
                print(f"\nProcessing: {log_file}")
            fixer.process_file(log_file)

        # Print summary
        fixer.print_summary()

        # Return appropriate exit code
        if fixer.errors:
            return 1
        return 0

    except KeyboardInterrupt:
        print("\n\nInterrupted by user")
        return 130

    except Exception as e:
        print(f"\nFATAL ERROR: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
