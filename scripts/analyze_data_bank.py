#!/usr/bin/env python3
"""
Analyze food-data-bank.md to extract all dishes with their venues.
This helps us understand the structure before migration.
"""

import re
import yaml
from pathlib import Path
from collections import defaultdict


def parse_yaml_blocks(text):
    """Extract all YAML blocks from the markdown file."""
    blocks = []
    fence = re.compile(r"```yaml\s*(.*?)```", re.S | re.M)
    for m in fence.finditer(text):
        raw = m.group(1).strip()
        try:
            y = yaml.safe_load(raw)
            if isinstance(y, dict) and 'id' in y:
                blocks.append((raw, y))
        except Exception as e:
            print(f"Warning: Failed to parse YAML block: {e}")
    return blocks


def extract_dish_headers(text):
    """Extract dish headers (## Name) from the markdown file."""
    headers = []
    lines = text.split('\n')

    for i, line in enumerate(lines):
        # Look for dish headers (## Name)
        if line.startswith('## ') and not line.startswith('## Edit') and not line.startswith('## Schema'):
            dish_name = line[3:].strip()
            # Skip documentation sections
            if dish_name not in ['Edit Protocol', 'Schema TEMPLATE (copy for new dishes)']:
                headers.append((i, dish_name))

    return headers


def analyze_venues(blocks):
    """Analyze venue distribution."""
    venue_counts = defaultdict(int)
    venue_dishes = defaultdict(list)

    for raw, data in blocks:
        venue = data.get('source', {}).get('venue', 'Unknown')
        dish_id = data.get('id', 'unknown')
        venue_counts[venue] += 1
        venue_dishes[venue].append(dish_id)

    return venue_counts, venue_dishes


def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    data_bank_path = project_root / 'data' / 'food-data-bank.md'

    if not data_bank_path.exists():
        print(f"Error: Could not find {data_bank_path}")
        return 1

    print(f"Reading from: {data_bank_path}\n")
    text = data_bank_path.read_text(encoding='utf-8')

    # Extract headers
    headers = extract_dish_headers(text)
    print(f"Found {len(headers)} dish headers\n")

    # Parse YAML blocks
    blocks = parse_yaml_blocks(text)
    print(f"Found {len(blocks)} valid YAML blocks\n")

    # Analyze venues
    venue_counts, venue_dishes = analyze_venues(blocks)

    print("=" * 80)
    print("VENUE DISTRIBUTION")
    print("=" * 80)
    for venue, count in sorted(venue_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"{count:3d} dishes | {venue}")

    print("\n" + "=" * 80)
    print("DETAILED VENUE BREAKDOWN")
    print("=" * 80)
    for venue in sorted(venue_counts.keys()):
        print(f"\n{venue}:")
        for dish_id in venue_dishes[venue]:
            print(f"  - {dish_id}")

    return 0


if __name__ == '__main__':
    exit(main())
