#!/usr/bin/env python3
"""
Validate venue-mappings.yaml against actual folder structure.

Checks:
1. All folders in config exist in the filesystem
2. All folders in filesystem are represented in config
3. No duplicate patterns across different venues
4. YAML is well-formed
"""

import yaml
from pathlib import Path
import sys


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

            if not folder_path.exists():
                errors.append(f"Config references non-existent folder: {category_type}/{folder}")

            # Check for duplicate patterns
            patterns = venue_config.get('patterns', [])
            for pattern in patterns:
                pattern_lower = pattern.lower()
                if pattern_lower in pattern_to_venue:
                    other_venue = pattern_to_venue[pattern_lower]
                    warnings.append(f"Duplicate pattern '{pattern}' in {category_type}/{venue_key} and {other_venue}")
                else:
                    pattern_to_venue[pattern_lower] = f"{category_type}/{venue_key}"

    # Check actual folders are in config
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
            found = False
            for venue_config in config.get(category_type, {}).values():
                if isinstance(venue_config, dict) and venue_config.get('folder') == folder_name:
                    found = True
                    break

            if not found:
                errors.append(f"Folder exists but not in config: {category_type}/{folder_name}")

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
        print(f"  Venues: {len([k for k in config.get('venues', {}).keys() if not k.startswith('_')])}")
        print(f"  Packaged: {len([k for k in config.get('packaged', {}).keys() if not k.startswith('_')])}")
        print(f"  Generic: {len([k for k in config.get('generic', {}).keys() if not k.startswith('_')])}")
        return True

    if not errors:
        print("\n✓ No errors found (warnings are non-critical)")
        return True

    return False


if __name__ == "__main__":
    success = validate_config()
    sys.exit(0 if success else 1)
