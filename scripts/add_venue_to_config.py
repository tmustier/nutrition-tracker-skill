#!/usr/bin/env python3
"""
Helper script to add new venue to configuration.

Makes it easy to add venues to venue-mappings.yaml without manually editing YAML.
"""

import yaml
from pathlib import Path
from datetime import datetime
import sys
import re
import tempfile
import shutil


def validate_folder_name(folder_name):
    """Validate folder name is safe and follows conventions."""
    if not re.match(r'^[a-z0-9][a-z0-9-]*[a-z0-9]$', folder_name):
        raise ValueError(
            f"Invalid folder name '{folder_name}'. "
            "Must be lowercase letters, numbers, and hyphens only "
            "(starting and ending with alphanumeric)."
        )
    # Prevent path traversal
    if '..' in folder_name or '/' in folder_name or '\\' in folder_name:
        raise ValueError(f"Folder name contains invalid path characters")
    return True


def atomic_write_yaml(filepath, data):
    """Write YAML atomically using temp file + rename to prevent corruption."""
    filepath = Path(filepath)
    with tempfile.NamedTemporaryFile(
        mode='w',
        dir=filepath.parent,
        delete=False,
        prefix=f'.{filepath.name}.',
        suffix='.tmp'
    ) as tmp:
        tmp_path = Path(tmp.name)
        try:
            yaml.dump(data, tmp, default_flow_style=False, sort_keys=False, allow_unicode=True)
            tmp.flush()
            # Ensure data is written to disk
            import os
            os.fsync(tmp.fileno())
        except Exception:
            tmp_path.unlink(missing_ok=True)
            raise

    # Atomic rename (POSIX guarantees atomicity)
    shutil.move(str(tmp_path), str(filepath))


def add_venue(category_type, folder_name, patterns, display_name="", notes="", venue_type=""):
    """Add a new venue to the configuration file."""
    # Validate folder name format
    validate_folder_name(folder_name)

    config_path = Path(__file__).parent.parent / 'data' / 'venue-mappings.yaml'

    if not config_path.exists():
        print(f"Error: Config file not found: {config_path}")
        sys.exit(1)

    with open(config_path) as f:
        config = yaml.safe_load(f)

    # Check if venue already exists
    if folder_name in config.get(category_type, {}):
        print(f"Warning: Venue '{folder_name}' already exists in {category_type}")
        overwrite = input("Overwrite? (y/n): ")
        if overwrite.lower() != 'y':
            print("Aborted")
            return

    # Add new venue
    if category_type not in config:
        config[category_type] = {}

    config[category_type][folder_name] = {
        'patterns': patterns,
        'folder': folder_name
    }

    if display_name:
        config[category_type][folder_name]['display_name'] = display_name
    if notes:
        config[category_type][folder_name]['notes'] = notes
    if venue_type:
        config[category_type][folder_name]['type'] = venue_type

    # Update metadata
    if '_meta' not in config:
        config['_meta'] = {}
    config['_meta']['last_updated'] = datetime.now().strftime('%Y-%m-%d')

    # Write back atomically to prevent corruption
    atomic_write_yaml(config_path, config)

    print(f"✓ Added '{folder_name}' to {category_type}")
    print(f"  Patterns: {', '.join(patterns)}")
    if display_name:
        print(f"  Display name: {display_name}")


if __name__ == "__main__":
    import argparse

    ap = argparse.ArgumentParser(
        description="Add venue to configuration",
        epilog="""
Examples:
  # Add a restaurant
  %(prog)s venues dishoom --patterns "dishoom" \\
    --display-name "Dishoom" --notes "Indian restaurant chain, multiple UK locations"

  # Add a packaged brand
  %(prog)s packaged clif-bar --patterns "clif bar" "clif" \\
    --display-name "Clif Bar" --type "energy_bar"

  # Add a generic category
  %(prog)s generic street-food --patterns "street food" "street-food" \\
    --notes "Generic street food items"
        """,
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    ap.add_argument("category_type", choices=["venues", "packaged", "generic"],
                    help="Category type")
    ap.add_argument("folder_name",
                    help="Folder name (lowercase, hyphenated)")
    ap.add_argument("--patterns", nargs="+", required=True,
                    help="Search patterns (e.g., 'decimo' 'decimo london')")
    ap.add_argument("--display-name", default="",
                    help="Display name for the venue")
    ap.add_argument("--notes", default="",
                    help="Additional notes about the venue")
    ap.add_argument("--type", default="",
                    help="Type/category (for packaged products: sports_nutrition, dairy, etc.)")

    args = ap.parse_args()

    add_venue(
        args.category_type,
        args.folder_name,
        args.patterns,
        args.display_name,
        args.notes,
        args.type
    )
