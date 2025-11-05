#!/usr/bin/env python3
"""
Fix partially migrated files by adding missing nutrient fields.
"""

import re
import sys
from pathlib import Path

# Files that need fixing (from validation output)
FILES_TO_FIX = [
    "almond_croissant_generic_v1",
    "persimmon_fresh_fruit_generic_v1",
    "vareniki_cherry_250g_germes_v1",
    "hazelnuts_30g_v1",
    "sunflower_seeds_30g_v1",
    "tiramisu_yogurt_pot_170g_generic-ingredients_v1",
    "pistachio_praline_bar_half_londons-chocolate_v1",
    "goat-milk-yogurt-dollops_st-helens-farm_v1",
    "charcoal_custard_bun_imperial_treasure_st_james_v1",
    "homemade_chips_connaught_v1",
    "sakura_wagyu_beef_sandwich_connaught_v1",
    "thai_spiced_broccoli_soup_connaught_v1",
    "chilli_poached_eggs_leto_soho_v1",
    "grilled_chicken_breast_leto_soho_v1",
    "salmon_sushi_set_panzers_v1",
    "grilled_salmon_fillet_shk_v1",
    "sea_bass_fillet_salsa_verde_shk_v1",
    "pastel_de_nata_eagle_farringdon_v1",
    "berry_blast_shake_third-space-nff_v1",
]

# All required nutrients in schema v2
ALL_NUTRIENTS = [
    # Minerals (additional)
    'selenium_ug', 'chromium_ug', 'molybdenum_ug', 'phosphorus_mg', 'chloride_mg', 'sulfur_g',
    # Vitamins (fat-soluble)
    'vitamin_a_ug', 'vitamin_d_ug', 'vitamin_k_ug',
    # Vitamins (B-complex)
    'vitamin_b1_mg', 'vitamin_b2_mg', 'vitamin_b3_mg', 'vitamin_b5_mg', 'vitamin_b6_mg',
    'vitamin_b7_ug', 'vitamin_b9_ug', 'vitamin_b12_ug', 'choline_mg',
    # Fatty acids
    'omega3_epa_mg', 'omega3_dha_mg', 'omega3_ala_g', 'omega6_la_g',
    # Ultra-trace
    'boron_mg', 'silicon_mg', 'vanadium_ug', 'nickel_ug',
]

def find_file(file_id, databank_dir):
    """Find file path for given ID."""
    for md_file in databank_dir.rglob("*.md"):
        content = md_file.read_text()
        if f"id: {file_id}" in content:
            return md_file
    return None

def add_missing_nutrients(file_path):
    """Add missing nutrient fields to a file."""
    print(f"Processing {file_path.name}...")

    content = file_path.read_text()
    lines = content.split('\n')

    # Find per_portion section
    per_portion_start = None
    for i, line in enumerate(lines):
        if line.strip() == 'per_portion:':
            per_portion_start = i
            break

    if per_portion_start is None:
        print(f"  ERROR: No per_portion section found")
        return False

    # Find the end of per_portion (next top-level key)
    per_portion_end = len(lines)
    for i in range(per_portion_start + 1, len(lines)):
        if lines[i] and not lines[i].startswith(' ') and not lines[i].startswith('\t'):
            per_portion_end = i
            break

    # Extract existing nutrients
    existing_nutrients = set()
    for i in range(per_portion_start + 1, per_portion_end):
        line = lines[i].strip()
        if ':' in line:
            nutrient = line.split(':')[0].strip()
            existing_nutrients.add(nutrient)

    # Find missing nutrients
    missing_nutrients = [n for n in ALL_NUTRIENTS if n not in existing_nutrients]

    if not missing_nutrients:
        print(f"  All nutrients present")
        return True

    print(f"  Adding {len(missing_nutrients)} missing nutrients")

    # Find insertion point (before derived section or at end of per_portion)
    insert_line = per_portion_end

    # Build new lines to insert
    new_lines = []
    for nutrient in missing_nutrients:
        new_lines.append(f"  {nutrient}: 0")

    # Insert new lines
    lines = lines[:insert_line] + new_lines + lines[insert_line:]

    # Write back
    file_path.write_text('\n'.join(lines))
    print(f"  ✓ Updated")
    return True

def main():
    databank_dir = Path("/home/user/nutrition-tracking/data/food-data-bank")

    print(f"Fixing {len(FILES_TO_FIX)} partially migrated files...\n")

    success = 0
    for file_id in FILES_TO_FIX:
        file_path = find_file(file_id, databank_dir)
        if file_path:
            if add_missing_nutrients(file_path):
                success += 1
        else:
            print(f"ERROR: Could not find file for {file_id}")

    print(f"\n{'=' * 80}")
    print(f"Fixed {success}/{len(FILES_TO_FIX)} files")
    print(f"{'=' * 80}")

if __name__ == "__main__":
    main()
