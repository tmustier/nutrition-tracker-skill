#!/usr/bin/env python3
"""
Validate venue-mappings.yaml against actual folder structure.

Checks:
1. All folders in config exist in the filesystem
2. All folders in filesystem are either in config OR can be auto-categorized correctly
3. No duplicate patterns across different venues
4. YAML is well-formed

Dynamic categorization:
- Packaged brands MUST be in config (need patterns for matching)
- Venues/generic folders can exist without config if they're correctly auto-categorized
- This allows dynamic venue creation without requiring config updates
"""

import yaml
from pathlib import Path
import sys
import re
from venue_categorization import can_auto_categorize


def validate_config():
    """Validate venue configuration against actual folder structure."""
    config_path = Path(__file__).parent.parent / 'data' / 'venue-mappings.yaml'
    data_bank = Path(__file__).parent.parent / 'data' / 'food-data-bank'

    # Check config file exists
    if not config_path.exists():
        print(f"❌ Config file not found: {config_path}")
        return False

    # Load config
    try:
        with open(config_path) as f:
            config = yaml.safe_load(f)
    except yaml.YAMLError as e:
        print(f"❌ YAML parsing error: {e}")
        return False

    errors = []
    warnings = []

    # Track all patterns to detect duplicates
    pattern_to_venue = {}

    # Check config folders exist in filesystem
    for category_type in ['venues', 'packaged', 'generic']:
        if category_type not in config:
            warnings.append(f"Category '{category_type}' not found in config")
            continue

        for venue_key, venue_config in config.get(category_type, {}).items():
            # Skip metadata entries
            if venue_key.startswith('_'):
                continue

            # Validate venue_config structure
            if not isinstance(venue_config, dict):
                errors.append(f"Invalid config for {category_type}/{venue_key}: expected dict, got {type(venue_config)}")
                continue

            if 'folder' not in venue_config:
                errors.append(f"Missing 'folder' key for {category_type}/{venue_key}")
                continue

            folder = venue_config['folder']
            folder_path = data_bank / category_type / folder

            # Validate folder name format
            if not re.match(r'^[a-z0-9][a-z0-9-]*[a-z0-9]$', folder):
                errors.append(
                    f"Invalid folder name '{folder}' in {category_type}/{venue_key}. "
                    "Must be lowercase letters, numbers, and hyphens only "
                    "(starting and ending with alphanumeric)."
                )

            if not folder_path.exists():
                errors.append(f"Config references non-existent folder: {category_type}/{folder}")

            # Check for duplicate patterns (now an error, not warning)
            patterns = venue_config.get('patterns', [])
            for pattern in patterns:
                pattern_lower = pattern.lower()
                if pattern_lower in pattern_to_venue:
                    other_venue = pattern_to_venue[pattern_lower]
                    errors.append(
                        f"Duplicate pattern '{pattern}' found in:\n"
                        f"    1. {other_venue}\n"
                        f"    2. {category_type}/{venue_key}"
                    )
                else:
                    pattern_to_venue[pattern_lower] = f"{category_type}/{venue_key}"

    # Check actual folders are in config OR can be auto-categorized
    for category_type in ['venues', 'packaged', 'generic']:
        category_path = data_bank / category_type

        if not category_path.exists():
            warnings.append(f"Category directory not found: {category_path}")
            continue

        for folder_path in category_path.iterdir():
            if not folder_path.is_dir():
                continue

            folder_name = folder_path.name

            # Check if folder is in config
            found_in_config = False
            for venue_config in config.get(category_type, {}).values():
                if isinstance(venue_config, dict) and venue_config.get('folder') == folder_name:
                    found_in_config = True
                    break

            if not found_in_config:
                # Not in config - check if it can be auto-categorized
                if category_type == 'packaged':
                    # Packaged brands MUST be in config (they need patterns for matching)
                    errors.append(
                        f"Packaged brand folder exists but not in config: {category_type}/{folder_name}\n"
                        f"    Packaged brands must be added to venue-mappings.yaml with patterns.\n"
                        f"    Run: python scripts/add_venue_to_config.py packaged {folder_name} --patterns \"pattern1\" \"pattern2\""
                    )
                elif can_auto_categorize(folder_name, category_type):
                    # Can be auto-categorized correctly - this is fine!
                    # Dynamic categorization allows venues/generic to exist without config
                    pass
                else:
                    # Cannot be auto-categorized to the correct category
                    errors.append(
                        f"Folder exists but cannot be auto-categorized: {category_type}/{folder_name}\n"
                        f"    The folder is in '{category_type}' but auto-categorization would place it elsewhere.\n"
                        f"    Either:\n"
                        f"    1. Move it to the correct category, OR\n"
                        f"    2. Add it to venue-mappings.yaml to override auto-categorization:\n"
                        f"       python scripts/add_venue_to_config.py {category_type} {folder_name} --patterns \"pattern1\""
                    )

    # Print results
    if errors:
        print("❌ Validation errors:")
        for error in errors:
            print(f"  • {error}")

    if warnings:
        print("\n⚠️  Warnings:")
        for warning in warnings:
            print(f"  • {warning}")

    if not errors and not warnings:
        print("✓ Config validation passed")

        # Count folders in config
        config_counts = {
            'venues': len([k for k in config.get('venues', {}).keys() if not k.startswith('_')]),
            'packaged': len([k for k in config.get('packaged', {}).keys() if not k.startswith('_')]),
            'generic': len([k for k in config.get('generic', {}).keys() if not k.startswith('_')])
        }

        # Count folders in filesystem
        fs_counts = {}
        for category_type in ['venues', 'packaged', 'generic']:
            category_path = data_bank / category_type
            if category_path.exists():
                fs_counts[category_type] = len([p for p in category_path.iterdir() if p.is_dir()])
            else:
                fs_counts[category_type] = 0

        # Calculate auto-categorized counts
        auto_counts = {
            cat: fs_counts[cat] - config_counts[cat]
            for cat in ['venues', 'packaged', 'generic']
        }

        print(f"  Venues: {config_counts['venues']} in config + {auto_counts['venues']} auto-categorized = {fs_counts['venues']} total")
        print(f"  Packaged: {config_counts['packaged']} in config (all packaged must be in config)")
        print(f"  Generic: {config_counts['generic']} in config + {auto_counts['generic']} auto-categorized = {fs_counts['generic']} total")
        return True

    if not errors:
        print("\n✓ No errors found (warnings are non-critical)")
        return True

    return False


if __name__ == "__main__":
    success = validate_config()
    sys.exit(0 if success else 1)
