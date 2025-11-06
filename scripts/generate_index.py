#!/usr/bin/env python3
"""
Generate food-data-bank index from individual dish files.

This script scans the food-data-bank directory structure and generates
an index file organized by venue/category folders.

The index is auto-generated and should not be manually edited.
"""

import sys
import yaml
import subprocess
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict


def slugify_anchor(text):
    """Convert dish header to markdown anchor format.

    Examples:
        "Sweet Potato Wedges (Simple Health Kitchen)" -> "sweet-potato-wedges-simple-health-kitchen"
        "Pistachios, 30 g" -> "pistachios-30-g"
    """
    import re
    anchor = text.lower()
    anchor = re.sub(r'[^\w\s-]', '', anchor)
    anchor = re.sub(r'[-\s]+', '-', anchor)
    anchor = anchor.strip('-')
    return anchor


def parse_dish_file(filepath):
    """Parse a dish file and extract metadata.

    Returns: dict with 'name', 'id', 'filepath', 'category_path' or None on error
    """
    content = filepath.read_text(encoding='utf-8')
    lines = content.split('\n')

    # Extract header (## Dish Name)
    dish_name = None
    for line in lines:
        if line.startswith('## '):
            dish_name = line[3:].strip()
            break

    if not dish_name:
        return None

    # Extract YAML block
    try:
        yaml_start = content.index('```yaml') + 7
        yaml_end = content.index('```', yaml_start)
        yaml_content = content[yaml_start:yaml_end].strip()
        data = yaml.safe_load(yaml_content)

        # Get category path (e.g., "venues/simple-health-kitchen")
        try:
            rel_path = filepath.relative_to(filepath.parents[2])  # relative to food-data-bank/
            category_path = str(rel_path.parent)
        except (ValueError, IndexError):
            # File is at unexpected depth - skip it
            print(f"Warning: Skipping {filepath.name} (unexpected file depth)")
            return None

        return {
            'name': dish_name,
            'id': data.get('id', 'unknown'),
            'filepath': filepath,
            'category_path': category_path,
            'category': data.get('category', 'unknown')
        }
    except Exception as e:
        # Log the error for debugging
        try:
            # Try to get relative path from food-data-bank/
            rel_path = filepath.relative_to(filepath.parents[2])
        except (ValueError, IndexError):
            # Fallback to just filename if relative path fails
            rel_path = filepath.name
        print(f"Warning: Failed to parse {rel_path}: {e}", file=sys.stderr)
        return None


def scan_data_bank(data_bank_dir):
    """Scan the food-data-bank directory and extract all dishes.

    Returns: tuple of (list of dish metadata dicts, list of failed file paths)
    """
    dishes = []
    failed_files = []

    # Find all .md files recursively
    for filepath in sorted(data_bank_dir.rglob('*.md')):
        # Skip README and RESEARCH files
        if filepath.name in ['README.md', 'RESEARCH.md', 'index.md']:
            continue

        dish_data = parse_dish_file(filepath)
        if dish_data:
            dishes.append(dish_data)
        else:
            # Track files that failed to parse
            failed_files.append(filepath)

    return dishes, failed_files


def organize_by_category(dishes):
    """Organize dishes by their category path.

    Returns: dict mapping category_path -> list of dishes
    """
    organized = defaultdict(list)

    for dish in dishes:
        organized[dish['category_path']].append(dish)

    return organized


def format_category_name(category_path):
    """Convert category path to readable name.

    Examples:
        'venues/simple-health-kitchen' -> 'Simple Health Kitchen'
        'packaged/grenade' -> 'Grenade'
        'generic/ingredients' -> 'Generic Ingredients'
    """
    parts = category_path.split('/')
    if len(parts) == 2:
        category_type, folder_name = parts

        # Convert folder name to title case
        name = folder_name.replace('-', ' ').title()

        # Add category prefix for generic items
        if category_type == 'generic':
            return f"Generic: {name}"
        elif category_type == 'packaged':
            return f"Packaged: {name}"
        else:
            return name

    return category_path


def get_git_metadata():
    """Get git metadata for the index generation.

    Returns: dict with 'commit', 'branch', 'is_ci' or None if not in git repo
    """
    try:
        # Get current commit hash
        commit = subprocess.run(
            ['git', 'rev-parse', '--short', 'HEAD'],
            capture_output=True,
            text=True,
            check=True,
            timeout=10
        ).stdout.strip()

        # Get current branch
        branch = subprocess.run(
            ['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
            capture_output=True,
            text=True,
            check=True,
            timeout=10
        ).stdout.strip()

        # Handle detached HEAD state in CI environments
        import os
        if branch == 'HEAD':
            # In GitHub Actions, fall back to environment variables
            branch = os.environ.get('GITHUB_HEAD_REF') or os.environ.get('GITHUB_REF_NAME') or 'HEAD'

        # Check if running in CI (common CI environment variables)
        is_ci = any(key in os.environ for key in ['CI', 'GITHUB_ACTIONS', 'GITLAB_CI', 'CIRCLECI'])

        return {
            'commit': commit,
            'branch': branch,
            'is_ci': is_ci
        }
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, FileNotFoundError):
        # Not in a git repo, git not available, or git command timed out
        return None


def generate_index_file(dishes, output_path):
    """Generate the index markdown file with rich metadata."""
    # Get current timestamp
    timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')

    # Get git metadata
    git_meta = get_git_metadata()

    # Organize by category
    by_category = organize_by_category(dishes)

    # Sort categories: venues first, then packaged, then generic
    def category_sort_key(cat_path):
        if cat_path.startswith('venues/'):
            return (0, cat_path)
        elif cat_path.startswith('packaged/'):
            return (1, cat_path)
        else:
            return (2, cat_path)

    sorted_categories = sorted(by_category.keys(), key=category_sort_key)

    # Build metadata section
    metadata_lines = [
        "---",
        "title: Food Data Bank Index",
        "description: Auto-generated index of all dishes in the food data bank",
        "generated:",
        f"  timestamp: \"{timestamp}\"",
        f"  dishes_count: {len(dishes)}",
    ]

    if git_meta:
        # Use yaml.safe_dump to properly escape values and prevent YAML injection
        git_metadata = {
            'commit': git_meta['commit'],
            'branch': git_meta['branch'],
            'by': 'CI' if git_meta['is_ci'] else 'local'
        }
        # Dump and indent properly (skip first line which contains {})
        git_yaml = yaml.safe_dump(git_metadata, default_flow_style=False, allow_unicode=True)
        for line in git_yaml.strip().split('\n'):
            metadata_lines.append(f"  {line}")
    else:
        metadata_lines.append("  by: \"local\"")

    metadata_lines.append("---")

    content = '\n'.join(metadata_lines)
    content += f"""

# Food Data Bank Index

> **Note**: This file is auto-generated. Do not edit manually or commit to git (managed by CI).
> To regenerate locally: `python scripts/generate_index.py`

## Overview

Total dishes: {len(dishes)}

- **Venues**: {sum(1 for c in sorted_categories if c.startswith('venues/'))} categories
- **Packaged Products**: {sum(1 for c in sorted_categories if c.startswith('packaged/'))} categories
- **Generic Items**: {sum(1 for c in sorted_categories if c.startswith('generic/'))} categories

---

"""

    # Add each category section
    for category_path in sorted_categories:
        category_dishes = by_category[category_path]
        category_name = format_category_name(category_path)

        content += f"## {category_name}\n\n"
        content += f"*Location: `data/food-data-bank/{category_path}/`*\n\n"
        content += f"**{len(category_dishes)} dishes:**\n\n"

        for dish in sorted(category_dishes, key=lambda d: d['name'].lower()):
            # Format: - [Dish Name](path/to/file.md) {#dish_id}
            rel_path = dish['filepath'].relative_to(output_path.parent)
            content += f"- [{dish['name']}]({rel_path}) {{#{dish['id']}}}\n"

        content += "\n"

    content += "---\n\n"
    content += "*Index generated automatically by scanning the food-data-bank directory structure.*\n"

    output_path.write_text(content, encoding='utf-8')

    print(f"✓ Generated index with {len(dishes)} dishes")
    print(f"✓ Written to: {output_path}")


def main():
    # Determine paths relative to script location
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    data_bank_dir = project_root / 'data' / 'food-data-bank'
    index_path = project_root / 'data' / 'food-data-bank-index.md'

    if not data_bank_dir.exists():
        print(f"Error: Could not find {data_bank_dir}")
        return 1

    print(f"Scanning: {data_bank_dir}")
    dishes, failed_files = scan_data_bank(data_bank_dir)

    if not dishes:
        print("Warning: No dishes found in data bank!")
        return 1

    generate_index_file(dishes, index_path)

    # Report any files that failed to parse
    if failed_files:
        print("\n⚠ Files with parsing errors:")
        for filepath in failed_files:
            print(f"  - {filepath.relative_to(project_root)}")
        print(f"\nTotal parsing failures: {len(failed_files)}")

    return 0


if __name__ == '__main__':
    exit(main())
