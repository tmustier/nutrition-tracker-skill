#!/usr/bin/env python3
"""
Generate food-data-bank-index.md from food-data-bank.md

This script extracts all dish headers and IDs from the main data bank file
and generates a separate index file with links to each dish.

The index is auto-generated and should not be manually edited.
"""

import re
from pathlib import Path
from datetime import datetime, timezone


def slugify_anchor(text):
    """Convert dish header to markdown anchor format.

    Examples:
        "Sweet Potato Wedges (Simple Health Kitchen)" -> "sweet-potato-wedges-simple-health-kitchen"
        "Pistachios, 30 g" -> "pistachios-30-g"
        "PACK'D Mixed Summer Berries (150 g)" -> "packd-mixed-summer-berries-150-g"
    """
    # Convert to lowercase
    anchor = text.lower()
    # Replace special characters and spaces with hyphens
    anchor = re.sub(r'[^\w\s-]', '', anchor)  # Remove non-word chars except spaces and hyphens
    anchor = re.sub(r'[-\s]+', '-', anchor)   # Replace spaces and multiple hyphens with single hyphen
    # Clean up
    anchor = anchor.strip('-')
    return anchor


def extract_dishes(data_bank_path):
    """Extract dish information from food-data-bank.md.

    Returns:
        List of dicts with keys: 'name', 'anchor', 'id'
    """
    with open(data_bank_path, 'r', encoding='utf-8') as f:
        content = f.read()

    dishes = []
    lines = content.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i]

        # Look for dish headers (## Name)
        # Skip the documentation headers like "## Edit Protocol" and "## Schema TEMPLATE"
        if line.startswith('## ') and not line.startswith('## Edit') and not line.startswith('## Schema'):
            dish_name = line[3:].strip()  # Remove "## " prefix

            # Skip if this is not a real dish (e.g., documentation sections)
            if dish_name in ['Edit Protocol', 'Schema TEMPLATE (copy for new dishes)']:
                i += 1
                continue

            # Find the YAML block and extract the ID
            dish_id = None
            j = i + 1
            # Look for the YAML block (starts with ```yaml)
            while j < len(lines) and j < i + 10:  # Search within next 10 lines
                if lines[j].strip().startswith('```yaml'):
                    # Found YAML block, now find the ID line
                    k = j + 1
                    while k < len(lines) and not lines[k].strip().startswith('```'):
                        if lines[k].strip().startswith('id:'):
                            dish_id = lines[k].split(':', 1)[1].strip()
                            break
                        k += 1
                    break
                j += 1

            if dish_id:
                anchor = slugify_anchor(dish_name)
                dishes.append({
                    'name': dish_name,
                    'anchor': anchor,
                    'id': dish_id
                })

        i += 1

    return dishes


def generate_index_file(dishes, output_path):
    """Generate the index markdown file."""
    timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')

    content = f"""---
title: Food Data Bank Index
description: Auto-generated index of all dishes in the food data bank
generated: {timestamp}
---

# Food Data Bank Index

> **Note**: This file is auto-generated from `food-data-bank.md`. Do not edit manually.
> Run `python scripts/generate_index.py` to regenerate.

<!-- #todo: Reorder dishes by category or venue for better organization -->

## All Dishes ({len(dishes)} total)

"""

    for dish in dishes:
        # Format: - [Dish Name](#anchor-link) {#dish_id}
        content += f"- [{dish['name']}](#{dish['anchor']}) {{#{dish['id']}}}\n"

    content += "\n---\n\n*Index generated automatically. See [food-data-bank.md](./food-data-bank.md) for full dish details.*\n"

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Generated index with {len(dishes)} dishes")
    print(f"✓ Written to: {output_path}")


def main():
    # Determine paths relative to script location
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    data_bank_path = project_root / 'data' / 'food-data-bank.md'
    index_path = project_root / 'data' / 'food-data-bank-index.md'

    if not data_bank_path.exists():
        print(f"Error: Could not find {data_bank_path}")
        return 1

    print(f"Reading from: {data_bank_path}")
    dishes = extract_dishes(data_bank_path)

    if not dishes:
        print("Warning: No dishes found in data bank!")
        return 1

    generate_index_file(dishes, index_path)
    return 0


if __name__ == '__main__':
    exit(main())
