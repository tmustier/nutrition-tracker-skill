#!/usr/bin/env python3
"""
Calculate derived nutrients (chloride, sulfur) from other nutrients.

This script enriches food bank entries with calculated chloride and sulfur values
based on their sodium and protein content.

Usage:
    python scripts/calculate_derived_nutrients.py [--dry-run] [--file path/to/file.md]

Examples:
    # Dry run (show what would be changed, don't modify files)
    python scripts/calculate_derived_nutrients.py --dry-run

    # Process all files in food bank
    python scripts/calculate_derived_nutrients.py

    # Process single file
    python scripts/calculate_derived_nutrients.py --file data/food-data-bank/generic/ingredients/oats_dry_50g_v1.md
"""

import argparse
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Tuple, Optional

import yaml


def calculate_chloride(sodium_mg: float) -> float:
    """
    Calculate chloride from sodium using NaCl stoichiometry.

    Chloride MW: 35.45 g/mol
    Sodium MW: 22.99 g/mol
    Ratio: 35.45 / 22.99 = 1.54

    Confidence: MEDIUM (±10-15%)
    Assumes sodium primarily from table salt (NaCl).
    Other sodium sources (sodium bicarbonate, MSG) would slightly overestimate.

    Args:
        sodium_mg: Sodium content in milligrams

    Returns:
        Chloride content in milligrams (rounded to nearest integer)
    """
    if sodium_mg == 0:
        return 0
    return round(sodium_mg * 1.54, 0)


def calculate_sulfur(protein_g: float, food_category: str) -> float:
    """
    Calculate sulfur from protein content based on amino acid composition.

    Sulfur-containing amino acids (methionine, cysteine):
    - Animal products: ~1.0% of protein by weight
    - Plant products: ~0.4% of protein by weight

    Confidence: MEDIUM (±15-25%)
    Varies by specific amino acid profile.

    Args:
        protein_g: Protein content in grams
        food_category: Food category (meat, fish, eggs, dairy, plant, etc.)

    Returns:
        Sulfur content in grams (rounded to 3 decimal places)
    """
    if protein_g == 0:
        return 0

    # Animal product categories have higher sulfur amino acid content
    animal_categories = ['meat', 'fish', 'seafood', 'poultry', 'eggs', 'dairy', 'cheese', 'yogurt', 'whey']

    # Check if any animal category keyword is in the food_category string
    is_animal = any(keyword in food_category.lower() for keyword in animal_categories)

    if is_animal:
        sulfur_g = protein_g * 0.01  # 1.0% for animal products
    else:
        sulfur_g = protein_g * 0.004  # 0.4% for plant products

    return round(sulfur_g, 3)


def infer_food_category(file_path: Path, dish_data: dict) -> str:
    """
    Infer food category from file path and dish metadata.

    Args:
        file_path: Path to the food file
        dish_data: Parsed YAML data

    Returns:
        Inferred category string (e.g., 'meat', 'plant', 'dairy')
    """
    # Check file path for category hints
    path_str = str(file_path).lower()

    # Check for animal products in path
    if any(keyword in path_str for keyword in ['meat', 'beef', 'pork', 'lamb', 'chicken', 'turkey', 'duck']):
        return 'meat'
    if any(keyword in path_str for keyword in ['fish', 'salmon', 'tuna', 'cod', 'trout', 'seafood', 'shrimp']):
        return 'fish'
    if 'egg' in path_str:
        return 'eggs'
    if any(keyword in path_str for keyword in ['dairy', 'milk', 'yogurt', 'cheese']):
        return 'dairy'
    if any(keyword in path_str for keyword in ['whey', 'protein']):
        return 'whey'

    # Check dish ID or description for hints
    dish_id = dish_data.get('id', '').lower()
    if any(keyword in dish_id for keyword in ['meat', 'beef', 'chicken', 'fish', 'salmon', 'egg', 'dairy', 'yogurt']):
        # Try to extract specific category
        if 'fish' in dish_id or 'salmon' in dish_id or 'tuna' in dish_id:
            return 'fish'
        if 'meat' in dish_id or 'beef' in dish_id or 'chicken' in dish_id:
            return 'meat'
        if 'egg' in dish_id:
            return 'eggs'
        if 'dairy' in dish_id or 'yogurt' in dish_id:
            return 'dairy'

    # Default to plant
    return 'plant'


def parse_yaml_with_comments(file_path: Path) -> Tuple[dict, str]:
    """
    Parse YAML file while preserving original formatting.

    Args:
        file_path: Path to YAML file

    Returns:
        Tuple of (parsed_dict, original_content)
    """
    content = file_path.read_text(encoding='utf-8')

    # Extract YAML block (between ```yaml markers)
    yaml_match = re.search(r'```yaml\n(.*?)\n```', content, re.DOTALL)
    if not yaml_match:
        raise ValueError(f"No YAML block found in {file_path}")

    yaml_content = yaml_match.group(1)
    data = yaml.safe_load(yaml_content)

    return data, content


def update_chloride_sulfur(file_path: Path, dry_run: bool = False) -> bool:
    """
    Update chloride and sulfur values in a food bank file.

    Args:
        file_path: Path to food file
        dry_run: If True, show changes but don't modify file

    Returns:
        True if file was modified (or would be modified in dry-run), False otherwise
    """
    try:
        data, original_content = parse_yaml_with_comments(file_path)
    except Exception as e:
        print(f"❌ Error parsing {file_path}: {e}")
        return False

    per_portion = data.get('per_portion', {})
    if not per_portion:
        print(f"⚠️  Skipping {file_path}: No per_portion section")
        return False

    # Get current values
    sodium_mg = float(per_portion.get('sodium_mg', 0))
    protein_g = float(per_portion.get('protein_g', 0))
    current_chloride = float(per_portion.get('chloride_mg', 0))
    current_sulfur = float(per_portion.get('sulfur_g', 0))

    # Calculate new values
    new_chloride = calculate_chloride(sodium_mg)
    food_category = infer_food_category(file_path, data)
    new_sulfur = calculate_sulfur(protein_g, food_category)

    # Check if update needed
    chloride_changed = new_chloride != current_chloride
    sulfur_changed = new_sulfur != current_sulfur

    if not chloride_changed and not sulfur_changed:
        return False

    # Show changes
    # Use absolute path for relative_to to work correctly
    try:
        display_path = file_path.absolute().relative_to(Path.cwd().absolute())
    except ValueError:
        display_path = file_path
    print(f"\n{'[DRY RUN] ' if dry_run else ''}📝 {display_path}")
    if chloride_changed:
        print(f"   Chloride: {current_chloride} → {new_chloride} mg (from {sodium_mg} mg sodium)")
    if sulfur_changed:
        print(f"   Sulfur:   {current_sulfur} → {new_sulfur} g (from {protein_g} g protein, category: {food_category})")

    if dry_run:
        return True

    # Update values in YAML content
    new_content = original_content

    # Update chloride
    if chloride_changed:
        # Try to find and replace the chloride line
        chloride_pattern = r'(\s+chloride_mg:\s+)[\d.]+'
        if re.search(chloride_pattern, new_content):
            new_content = re.sub(chloride_pattern, f'\\g<1>{new_chloride}', new_content, count=1)
        else:
            print(f"   ⚠️  Could not find chloride_mg field in file")

    # Update sulfur
    if sulfur_changed:
        # Try to find and replace the sulfur line
        sulfur_pattern = r'(\s+sulfur_g:\s+)[\d.]+'
        if re.search(sulfur_pattern, new_content):
            new_content = re.sub(sulfur_pattern, f'\\g<1>{new_sulfur}', new_content, count=1)
        else:
            print(f"   ⚠️  Could not find sulfur_g field in file")

    # Add change log entry
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S%z")
    # Format timezone properly
    timestamp = timestamp[:-2] + ":" + timestamp[-2:]

    change_log_entry = f"""
  - timestamp: "{timestamp}"
    updated_by: "Script: calculate_derived_nutrients.py"
    change: "Calculated derived nutrients (chloride from sodium, sulfur from protein)"
    notes: "Chloride = sodium × 1.54 (NaCl ratio). Sulfur = protein × {'0.01 (animal)' if food_category in ['meat', 'fish', 'eggs', 'dairy', 'whey'] else '0.004 (plant)'}."
"""

    # Insert change log entry before the closing "---" of YAML block, or before existing change_log if present
    # Find the change_log section
    change_log_match = re.search(r'\nchange_log:\n', new_content)
    if change_log_match:
        # Insert at beginning of change_log
        insert_pos = change_log_match.end()
        new_content = new_content[:insert_pos] + change_log_entry + new_content[insert_pos:]
    else:
        # Add new change_log section before the closing "---"
        yaml_end = re.search(r'\n---\n', new_content)
        if yaml_end:
            insert_pos = yaml_end.start()
            new_content = new_content[:insert_pos] + f"\nchange_log:{change_log_entry}\n" + new_content[insert_pos:]

    # Write updated content
    file_path.write_text(new_content, encoding='utf-8')
    print(f"   ✅ Updated")

    return True


def main():
    parser = argparse.ArgumentParser(
        description='Calculate derived nutrients (chloride, sulfur) for food bank entries',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument('--dry-run', action='store_true',
                        help='Show what would be changed without modifying files')
    parser.add_argument('--file', type=Path,
                        help='Process single file instead of entire food bank')

    args = parser.parse_args()

    # Determine files to process
    if args.file:
        files = [args.file]
        if not files[0].exists():
            print(f"❌ File not found: {args.file}")
            sys.exit(1)
    else:
        # Find all food bank files
        food_bank_dir = Path('data/food-data-bank')
        if not food_bank_dir.exists():
            print(f"❌ Food bank directory not found: {food_bank_dir}")
            sys.exit(1)

        # Find all .md files (excluding README and other docs)
        files = []
        for pattern in ['generic/**/*_v*.md', 'packaged/**/*_v*.md', 'venues/**/*_v*.md']:
            files.extend(food_bank_dir.glob(pattern))

        # Sort for consistent processing order
        files = sorted(files)

    if not files:
        print("⚠️  No food bank files found")
        sys.exit(0)

    print(f"{'🔍 DRY RUN MODE - No files will be modified' if args.dry_run else '🚀 Processing'} {len(files)} file(s)...\n")

    # Process files
    modified_count = 0
    for file_path in files:
        if update_chloride_sulfur(file_path, dry_run=args.dry_run):
            modified_count += 1

    # Summary
    print(f"\n{'─' * 50}")
    if args.dry_run:
        print(f"📊 DRY RUN Summary: {modified_count}/{len(files)} file(s) would be modified")
        print(f"\nRun without --dry-run to apply changes")
    else:
        print(f"✅ Updated {modified_count}/{len(files)} file(s)")
        print(f"\nNext steps:")
        print(f"  1. Review changes: git diff")
        print(f"  2. Validate: python scripts/validate_data_bank.py")
        print(f"  3. Commit: git add data/food-data-bank && git commit")


if __name__ == '__main__':
    main()
