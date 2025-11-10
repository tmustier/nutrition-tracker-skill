#!/usr/bin/env python3
"""
Fix change_log indentation issues in food bank YAML files.

This script fixes the YAML parsing errors in 71 food bank entries caused by
inconsistent indentation in the change_log section. The issue occurs when
the calculate_derived_nutrients.py script prepended properly-indented entries
without re-indenting existing entries.

Pattern being fixed:
  BEFORE:
    change_log:
      - timestamp: "2025-11-06..."  # 2-space indent (correct)
        updated_by: "Script"
    - timestamp: "2025-11-05..."    # 0-space indent (WRONG)
      updated_by: "Claude"

  AFTER:
    change_log:
      - timestamp: "2025-11-06..."  # 2-space indent
        updated_by: "Script"
      - timestamp: "2025-11-05..."  # 2-space indent (FIXED)
        updated_by: "Claude"

Usage:
    python3 scripts/fix_change_log_indentation.py [--dry-run] [--file FILE]
"""

import argparse
import re
import sys
from pathlib import Path
from typing import List, Tuple


def fix_change_log_indentation(content: str) -> Tuple[str, int]:
    """
    Fix indentation of change_log entries in file content.

    This function fixes entries that were not indented properly. The pattern is:
    - Non-indented list markers (- timestamp:) -> add 2 spaces
    - Properties with 2 spaces that follow non-indented markers -> add 2 more spaces (total 4)
    - Nested list items under those properties -> add 2 more spaces as well

    Args:
        content: File content as string

    Returns:
        Tuple of (fixed_content, number_of_fixes)
    """
    lines = content.split('\n')
    fixed_lines = []
    in_change_log = False
    in_broken_entry = False  # Track when we're fixing a broken entry
    fixes_count = 0

    for i, line in enumerate(lines):
        # Detect start of change_log section
        if line.strip() == 'change_log:':
            in_change_log = True
            in_broken_entry = False
            fixed_lines.append(line)
            continue

        # Detect end of change_log section
        # Next top-level key (not indented, doesn't start with -)
        if in_change_log and line and not line[0].isspace() and line[0] != '-':
            in_change_log = False
            in_broken_entry = False
            fixed_lines.append(line)
            continue

        if in_change_log:
            # Case 1: Non-indented list item (broken entry starts)
            if line.startswith('- '):
                fixed_lines.append('  ' + line)
                in_broken_entry = True
                fixes_count += 1
            # Case 2: Line with 2-space indent that's part of a broken entry
            # (these are properties of the dict, need to be 4-space indented)
            elif in_broken_entry and line.startswith('  ') and not line.startswith('    '):
                fixed_lines.append('  ' + line)  # Add 2 more spaces
            # Case 3: Properly indented line (2+ spaces at start, or empty line)
            # OR we hit a properly indented list item (starts with '  -')
            elif line.startswith('  - ') or line.strip() == '' or line.startswith('    '):
                # This is a properly indented entry or its properties
                in_broken_entry = False
                fixed_lines.append(line)
            # Case 4: Any other line in change_log
            else:
                fixed_lines.append(line)
        else:
            # Not in change_log section
            fixed_lines.append(line)

    return '\n'.join(fixed_lines), fixes_count


def get_affected_files() -> List[Path]:
    """
    Get all markdown files in the food bank directory.

    Returns:
        List of Path objects for all .md files
    """
    food_bank_dir = Path('data/food-data-bank')

    if not food_bank_dir.exists():
        print(f"Error: Food bank directory not found: {food_bank_dir}")
        sys.exit(1)

    # Get all .md files recursively
    md_files = list(food_bank_dir.rglob('*.md'))

    # Exclude index files
    md_files = [f for f in md_files if f.name != 'food-data-bank-index.md'
                and 'RESEARCH.md' not in str(f)]

    return md_files


def process_file(file_path: Path, dry_run: bool = False) -> Tuple[bool, int]:
    """
    Process a single file to fix change_log indentation.

    Args:
        file_path: Path to the file
        dry_run: If True, don't write changes

    Returns:
        Tuple of (was_modified, fixes_count)
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()

        fixed_content, fixes_count = fix_change_log_indentation(original_content)

        if fixes_count > 0:
            if not dry_run:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)
            return True, fixes_count

        return False, 0

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False, 0


def main():
    parser = argparse.ArgumentParser(
        description='Fix change_log indentation in food bank YAML files'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be changed without modifying files'
    )
    parser.add_argument(
        '--file',
        type=Path,
        help='Process only this specific file'
    )

    args = parser.parse_args()

    # Get files to process
    if args.file:
        if not args.file.exists():
            print(f"Error: File not found: {args.file}")
            sys.exit(1)
        files_to_process = [args.file]
    else:
        files_to_process = get_affected_files()

    print(f"Processing {len(files_to_process)} files...")
    if args.dry_run:
        print("DRY RUN MODE - No files will be modified\n")

    # Process files
    modified_files = []
    total_fixes = 0

    for file_path in files_to_process:
        was_modified, fixes_count = process_file(file_path, args.dry_run)

        if was_modified:
            modified_files.append(file_path)
            total_fixes += fixes_count
            status = "(DRY RUN)" if args.dry_run else "✓"
            print(f"{status} Fixed {fixes_count} entries in: {file_path.relative_to('data/food-data-bank')}")

    # Summary
    print(f"\n{'=' * 60}")
    print(f"Summary:")
    print(f"  Total files scanned:   {len(files_to_process)}")
    print(f"  Files modified:        {len(modified_files)}")
    print(f"  Total entries fixed:   {total_fixes}")

    if args.dry_run:
        print(f"\nThis was a DRY RUN. No files were modified.")
        print(f"Run without --dry-run to apply changes.")
    else:
        print(f"\n✓ All fixes applied successfully!")
        print(f"\nNext steps:")
        print(f"  1. Run validation: python3 scripts/validate_data_bank.py")
        print(f"  2. Review changes: git diff")
        print(f"  3. Commit: git add . && git commit -m 'Fix change_log indentation in {len(modified_files)} files'")


if __name__ == '__main__':
    main()
