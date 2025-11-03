#!/usr/bin/env python3
"""
Fix all null values in food bank nutrition files.

This script:
- Scans all .md files in data/food-data-bank/ recursively
- Replaces ALL null values in per_portion section with 0
- Preserves est_weight_g as null (it's metadata in the portion section)
- Preserves file formatting, comments, and structure
- Reports files processed, nulls replaced, and any errors

Requires: pyyaml
"""
import sys
import re
from pathlib import Path
from typing import Tuple, Optional, Dict, List

try:
    import yaml
except ImportError:
    sys.stderr.write("This script requires PyYAML. Install with: pip install pyyaml\n")
    sys.exit(1)


class NullFixStats:
    """Track statistics for null value fixes."""
    def __init__(self):
        self.files_scanned = 0
        self.files_processed = 0
        self.files_modified = 0
        self.files_skipped = 0
        self.files_errored = 0
        self.nulls_replaced = 0
        self.errors: List[Tuple[str, str]] = []
        self.modified_files: List[Tuple[str, int]] = []


def scan_data_bank(data_bank_dir: Path) -> List[Path]:
    """
    Scan data bank directory and return all dish files.

    Args:
        data_bank_dir: Path to the data bank directory

    Returns:
        List of Path objects for all .md files (excluding README, RESEARCH, index)
    """
    files = []

    # Find all .md files recursively
    for filepath in sorted(data_bank_dir.rglob('*.md')):
        # Skip README, RESEARCH, and index files
        if filepath.name in ['README.md', 'RESEARCH.md', 'index.md']:
            continue
        files.append(filepath)

    return files


def extract_yaml_boundaries(content: str) -> Optional[Tuple[int, int]]:
    """
    Find the start and end positions of the YAML block in the markdown content.

    Args:
        content: The full file content

    Returns:
        Tuple of (start_pos, end_pos) or None if not found
    """
    try:
        yaml_start = content.index('```yaml')
        yaml_content_start = yaml_start + 7  # len('```yaml')
        yaml_end = content.index('```', yaml_content_start)
        return (yaml_content_start, yaml_end)
    except ValueError:
        return None


def parse_yaml_block(yaml_text: str) -> Optional[Dict]:
    """
    Parse YAML text to validate structure.

    Args:
        yaml_text: The YAML block text

    Returns:
        Parsed dictionary or None if parsing fails
    """
    try:
        return yaml.safe_load(yaml_text)
    except yaml.YAMLError as e:
        return None


def fix_nulls_in_per_portion(yaml_text: str, data: Dict) -> Tuple[str, int]:
    """
    Replace null values in per_portion section with 0.

    This function uses line-by-line processing to preserve formatting and comments
    while replacing null values only in the per_portion section.

    Args:
        yaml_text: The YAML block text
        data: Parsed YAML dictionary (for validation)

    Returns:
        Tuple of (modified_yaml_text, nulls_replaced_count)
    """
    if 'per_portion' not in data:
        return yaml_text, 0

    lines = yaml_text.split('\n')
    modified_lines = []
    nulls_replaced = 0
    in_per_portion = False
    indent_level = None

    for line in lines:
        original_line = line

        # Detect section boundaries
        # We're looking for "per_portion:" at the start (possibly with leading whitespace)
        if re.match(r'^(\s*)per_portion:\s*$', line):
            in_per_portion = True
            # Extract indentation level of per_portion
            match = re.match(r'^(\s*)per_portion:', line)
            if match:
                indent_level = len(match.group(1))
            modified_lines.append(line)
            continue

        # Check if we're leaving per_portion section
        # We leave when we hit another top-level section (derived, quality, etc.)
        if in_per_portion and indent_level is not None:
            # Check if this line is at the same or lower indentation level as per_portion
            if line.strip() and not line.startswith(' ' * (indent_level + 2)):
                # This is a new section at the same level as per_portion
                if re.match(r'^(\s*)(derived|quality|notes|change_log|source|portion|assumptions|aliases|category|version|id|last_verified):', line):
                    in_per_portion = False

        # Replace null values if we're in per_portion section
        if in_per_portion:
            # Match lines like "  field_name: null" (with any amount of indentation)
            # but not lines that are comments or other structures
            match = re.match(r'^(\s+\w+):\s+null\s*$', line)
            if match:
                # Replace "null" with "0"
                line = re.sub(r':\s+null\s*$', ': 0', line)
                if line != original_line:
                    nulls_replaced += 1

        modified_lines.append(line)

    modified_yaml = '\n'.join(modified_lines)
    return modified_yaml, nulls_replaced


def process_file(filepath: Path, stats: NullFixStats, dry_run: bool = False) -> bool:
    """
    Process a single markdown file to fix null values in per_portion section.

    Args:
        filepath: Path to the file to process
        stats: Statistics object to update
        dry_run: If True, don't write changes to disk

    Returns:
        True if file was modified, False otherwise
    """
    stats.files_scanned += 1

    try:
        # Read file content
        content = filepath.read_text(encoding='utf-8')

        # Extract YAML boundaries
        boundaries = extract_yaml_boundaries(content)
        if not boundaries:
            stats.files_skipped += 1
            stats.errors.append((str(filepath), "No YAML block found"))
            return False

        yaml_start, yaml_end = boundaries
        yaml_text = content[yaml_start:yaml_end].strip()

        # Parse YAML to validate structure
        data = parse_yaml_block(yaml_text)
        if not data:
            stats.files_skipped += 1
            stats.errors.append((str(filepath), "Failed to parse YAML"))
            return False

        # Check if file has an id (basic validation)
        if not isinstance(data, dict) or 'id' not in data:
            stats.files_skipped += 1
            stats.errors.append((str(filepath), "Invalid YAML structure (no 'id' field)"))
            return False

        stats.files_processed += 1

        # Fix nulls in per_portion section
        modified_yaml, nulls_replaced = fix_nulls_in_per_portion(yaml_text, data)

        if nulls_replaced == 0:
            # No changes needed
            return False

        # Update statistics
        stats.nulls_replaced += nulls_replaced
        stats.files_modified += 1
        stats.modified_files.append((str(filepath), nulls_replaced))

        if not dry_run:
            # Reconstruct file content with modified YAML
            # Ensure there's a newline after ```yaml and before ```
            new_content = content[:yaml_start] + '\n' + modified_yaml + '\n' + content[yaml_end:]

            # Validate the new YAML can be parsed
            try:
                new_data = parse_yaml_block(modified_yaml)
                if not new_data:
                    raise ValueError("Modified YAML cannot be parsed")
            except Exception as e:
                stats.errors.append((str(filepath), f"Modified YAML validation failed: {e}"))
                stats.files_modified -= 1
                stats.nulls_replaced -= nulls_replaced
                return False

            # Write back to file
            filepath.write_text(new_content, encoding='utf-8')

        return True

    except Exception as e:
        stats.files_errored += 1
        stats.errors.append((str(filepath), f"Unexpected error: {e}"))
        return False


def print_summary(stats: NullFixStats, dry_run: bool = False):
    """
    Print summary statistics.

    Args:
        stats: Statistics object
        dry_run: Whether this was a dry run
    """
    print("\n" + "=" * 80)
    print("NULL VALUE FIX REPORT")
    if dry_run:
        print("(DRY RUN - NO CHANGES WRITTEN)")
    print("=" * 80)
    print(f"Files scanned:        {stats.files_scanned}")
    print(f"Files processed:      {stats.files_processed}")
    print(f"Files modified:       {stats.files_modified}")
    print(f"Files skipped:        {stats.files_skipped}")
    print(f"Files with errors:    {stats.files_errored}")
    print(f"Total nulls replaced: {stats.nulls_replaced}")
    print()

    if stats.modified_files:
        print("=" * 80)
        print("MODIFIED FILES")
        print("=" * 80)
        for filepath, null_count in stats.modified_files:
            print(f"  {filepath}")
            print(f"    → Replaced {null_count} null value(s)")
        print()

    if stats.errors:
        print("=" * 80)
        print("ERRORS AND WARNINGS")
        print("=" * 80)
        for filepath, error in stats.errors:
            print(f"  {filepath}")
            print(f"    → {error}")
        print()

    print("=" * 80)
    if stats.files_errored > 0:
        print("RESULT: COMPLETED WITH ERRORS")
    elif stats.files_modified > 0:
        print(f"RESULT: SUCCESS - {stats.files_modified} file(s) modified, {stats.nulls_replaced} null(s) replaced")
    else:
        print("RESULT: SUCCESS - No null values found in per_portion sections")
    print("=" * 80)


def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Fix all null values in food bank nutrition files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Fix all nulls in default data bank directory
  %(prog)s

  # Dry run to see what would be changed
  %(prog)s --dry-run

  # Fix nulls in specific directory
  %(prog)s /path/to/data/food-data-bank

  # Verbose output with dry run
  %(prog)s --dry-run --verbose
        """
    )

    parser.add_argument(
        'data_bank_dir',
        nargs='?',
        default=None,
        help='Path to the data bank directory (default: data/food-data-bank)'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be changed without writing to files'
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Print detailed progress information'
    )

    args = parser.parse_args()

    # Determine path
    if args.data_bank_dir:
        path = Path(args.data_bank_dir)
    else:
        script_dir = Path(__file__).parent
        path = script_dir.parent / 'data' / 'food-data-bank'

    if not path.exists():
        print(f"Error: Data bank directory not found: {path}", file=sys.stderr)
        return 1

    if not path.is_dir():
        print(f"Error: Path is not a directory: {path}", file=sys.stderr)
        return 1

    print(f"Scanning: {path}")
    if args.dry_run:
        print("Mode: DRY RUN (no changes will be written)")
    print()

    # Scan for files
    files = scan_data_bank(path)
    print(f"Found {len(files)} markdown file(s) to process")
    print()

    # Process each file
    stats = NullFixStats()

    for filepath in files:
        if args.verbose:
            print(f"Processing: {filepath}")

        modified = process_file(filepath, stats, dry_run=args.dry_run)

        if args.verbose:
            if modified:
                print(f"  → Modified (replaced nulls)")
            else:
                print(f"  → No changes needed")

    # Print summary
    print_summary(stats, dry_run=args.dry_run)

    # Exit with appropriate code
    if stats.files_errored > 0:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
