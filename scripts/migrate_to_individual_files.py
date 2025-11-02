#!/usr/bin/env python3
"""
Migrate food-data-bank.md to individual dish files organized by venue.

This script:
1. Parses the monolithic food-data-bank.md
2. Creates a folder structure organized by venue type
3. Splits each dish into its own file
4. Preserves all data including headers, YAML, and metadata
"""

import re
import yaml
from pathlib import Path
from collections import defaultdict


def slugify(text):
    """Convert text to a filesystem-safe slug."""
    # Convert to lowercase
    slug = text.lower()
    # Remove special characters, keeping only alphanumeric and spaces
    slug = re.sub(r'[^\w\s-]', '', slug)
    # Replace spaces and multiple hyphens with single hyphen
    slug = re.sub(r'[-\s]+', '-', slug)
    # Clean up
    slug = slug.strip('-')
    return slug


def categorize_venue(venue):
    """Determine the category and folder for a venue.

    Returns: (category, folder_name)
    """
    venue_lower = venue.lower()

    # Restaurant venues
    if 'simple health kitchen' in venue_lower:
        return ('venues', 'simple-health-kitchen')
    elif 'connaught' in venue_lower or 'jean-georges' in venue_lower:
        return ('venues', 'jean-georges-connaught')
    elif 'leto' in venue_lower or "l'eto" in venue_lower:
        return ('venues', 'leto-caffe-soho')
    elif 'zima' in venue_lower:
        return ('venues', 'zima-soho')
    elif 'eagle' in venue_lower and 'farringdon' in venue_lower:
        return ('venues', 'the-eagle-farringdon')
    elif 'imperial treasure' in venue_lower:
        return ('venues', 'imperial-treasure-st-james')
    elif 'joe' in venue_lower and 'juice' in venue_lower:
        return ('venues', 'joe-and-the-juice')
    elif 'third space' in venue_lower or 'natural fitness food' in venue_lower:
        return ('venues', 'third-space-nff')

    # Packaged products
    elif 'grenade' in venue_lower:
        return ('packaged', 'grenade')
    elif 'amisa' in venue_lower:
        return ('packaged', 'amisa')
    elif 'yarden' in venue_lower:
        return ('packaged', 'yarden')
    elif 'optimum nutrition' in venue_lower:
        return ('packaged', 'optimum-nutrition')
    elif "pack'd" in venue_lower:
        return ('packaged', 'packd')
    elif 'rot front' in venue_lower or 'rotfront' in venue_lower:
        return ('packaged', 'rot-front')
    elif 'daylesford' in venue_lower:
        return ('packaged', 'daylesford-organic')

    # Generic categories
    elif 'pack/ingredient' in venue_lower or venue_lower == 'pack/ingredient':
        return ('generic', 'ingredients')
    elif 'generic bakery' in venue_lower:
        return ('generic', 'bakery')
    elif 'generic - bar/restaurant' in venue_lower:
        return ('generic', 'bar-restaurant')
    elif 'generic - grocery' in venue_lower:
        return ('generic', 'grocery')
    elif 'generic - supplement' in venue_lower:
        return ('generic', 'supplements')
    elif 'pub/bar' in venue_lower:
        return ('generic', 'pub-bar')
    elif 'fresh fruit' in venue_lower or 'clementine' in venue_lower:
        return ('generic', 'fresh-produce')

    # Fallback
    else:
        print(f"WARNING: Unknown venue category for: {venue}")
        return ('uncategorized', slugify(venue))


def extract_header_and_yaml(text, start_idx):
    """Extract a dish header and its YAML block.

    Returns: (header, yaml_text, end_idx) or None if not found
    """
    lines = text.split('\n')

    if start_idx >= len(lines):
        return None

    # Get the header
    header = lines[start_idx].strip()
    if not header.startswith('## '):
        return None

    # Find the YAML block
    yaml_start = None
    yaml_end = None

    for i in range(start_idx + 1, len(lines)):
        line = lines[i]

        if line.strip() == '```yaml' and yaml_start is None:
            yaml_start = i
        elif line.strip() == '```' and yaml_start is not None:
            yaml_end = i
            break
        elif line.startswith('## ') and yaml_start is None:
            # Hit next dish without finding YAML
            return None

    if yaml_start is None or yaml_end is None:
        return None

    # Extract YAML content (including fences)
    yaml_text = '\n'.join(lines[yaml_start:yaml_end+1])

    return (header, yaml_text, yaml_end + 1)


def parse_data_bank(data_bank_path):
    """Parse the data bank file and extract all dishes.

    Returns: list of dicts with 'header', 'yaml_text', 'yaml_data'
    """
    text = data_bank_path.read_text(encoding='utf-8')
    lines = text.split('\n')

    dishes = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Look for dish headers
        if line.startswith('## '):
            dish_name = line[3:].strip()

            # Skip documentation sections
            if dish_name in ['Edit Protocol', 'Schema TEMPLATE (copy for new dishes)']:
                i += 1
                continue

            # Extract this dish
            result = extract_header_and_yaml(text, i)
            if result:
                header, yaml_text, end_idx = result

                # Parse YAML to get metadata
                yaml_content = yaml_text.split('```yaml')[1].split('```')[0].strip()
                try:
                    yaml_data = yaml.safe_load(yaml_content)

                    dishes.append({
                        'header': header,
                        'yaml_text': yaml_text,
                        'yaml_data': yaml_data,
                        'dish_name': dish_name
                    })

                    i = end_idx
                    continue
                except Exception as e:
                    print(f"Warning: Failed to parse YAML for {dish_name}: {e}")

        i += 1

    return dishes


def create_dish_file(dish, output_dir):
    """Create an individual dish file."""
    dish_id = dish['yaml_data'].get('id', 'unknown')

    # Create filename from dish ID
    filename = f"{dish_id}.md"
    filepath = output_dir / filename

    # Create file content with header and YAML
    content = f"{dish['header']}\n\n{dish['yaml_text']}\n"

    # Write file
    filepath.write_text(content, encoding='utf-8')

    return filepath


def migrate(data_bank_path, output_base_dir):
    """Perform the migration."""
    print("Starting migration...")
    print(f"Source: {data_bank_path}")
    print(f"Destination: {output_base_dir}\n")

    # Parse all dishes
    dishes = parse_data_bank(data_bank_path)
    print(f"Found {len(dishes)} dishes to migrate\n")

    # Group by venue category
    venue_groups = defaultdict(list)

    for dish in dishes:
        venue = dish['yaml_data'].get('source', {}).get('venue', 'Unknown')
        category, folder = categorize_venue(venue)
        venue_groups[(category, folder)].append(dish)

    # Create directory structure and write files
    created_files = []

    for (category, folder), dishes_list in sorted(venue_groups.items()):
        # Create directory
        output_dir = output_base_dir / category / folder
        output_dir.mkdir(parents=True, exist_ok=True)

        print(f"Creating {category}/{folder}/ ({len(dishes_list)} dishes)")

        # Create each dish file
        for dish in dishes_list:
            filepath = create_dish_file(dish, output_dir)
            created_files.append(filepath)
            print(f"  ✓ {filepath.name}")

    print(f"\n✓ Migration complete!")
    print(f"  Total files created: {len(created_files)}")
    print(f"  Total directories: {len(venue_groups)}")

    return created_files, venue_groups


def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    data_bank_path = project_root / 'data' / 'food-data-bank.md'
    output_base_dir = project_root / 'data' / 'food-data-bank'

    if not data_bank_path.exists():
        print(f"Error: Could not find {data_bank_path}")
        return 1

    # Perform migration
    created_files, venue_groups = migrate(data_bank_path, output_base_dir)

    # Print summary
    print("\n" + "=" * 80)
    print("MIGRATION SUMMARY")
    print("=" * 80)
    for (category, folder), dishes in sorted(venue_groups.items()):
        print(f"{category}/{folder}: {len(dishes)} dishes")

    return 0


if __name__ == '__main__':
    exit(main())
