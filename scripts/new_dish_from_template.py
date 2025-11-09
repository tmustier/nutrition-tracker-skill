#!/usr/bin/env python3
"""
Create a new dish file in the appropriate folder based on venue.

- Determines the correct folder from venue categorization
- Creates individual dish file with header and YAML template
- Sets id, version, last_verified, venue, category, and portion description
- Auto-regenerates the index file after adding the dish
"""
import sys, re
from pathlib import Path
from datetime import datetime, timezone


SCHEMA_TEMPLATE = """id: {stable_id}
version: 1
last_verified: {today}
source:
  venue: {venue_name}
  menu_page: ""
  evidence: []   # list of URLs or short notes
aliases: []
category: {category}
portion:
  description: "{portion_desc}"
  est_weight_g: null
  notes: ""
assumptions:
  salt_scheme: "normal"  # light|normal|heavy|unsalted
  oil_type: ""
  prep: ""
per_portion:  # Schema v2: 52 nutrient fields
  # Macronutrients
  energy_kcal: 0
  protein_g: 0
  fat_g: 0
  sat_fat_g: 0
  mufa_g: 0
  pufa_g: 0
  trans_fat_g: 0
  cholesterol_mg: 0
  # Carbohydrates
  carbs_total_g: 0
  carbs_available_g: 0
  sugar_g: 0
  fiber_total_g: 0
  fiber_soluble_g: 0
  fiber_insoluble_g: 0
  polyols_g: 0.0
  # Minerals
  sodium_mg: 0
  potassium_mg: 0
  iodine_ug: 0
  magnesium_mg: 0
  calcium_mg: 0
  iron_mg: 0
  zinc_mg: 0
  vitamin_c_mg: 0
  manganese_mg: 0
  copper_mg: 0
  selenium_ug: 0
  chromium_ug: 0
  molybdenum_ug: 0
  phosphorus_mg: 0
  chloride_mg: 0
  sulfur_g: 0
  # Vitamins
  vitamin_a_ug: 0
  vitamin_d_ug: 0
  vitamin_e_mg: 0
  vitamin_k_ug: 0
  vitamin_b1_mg: 0
  vitamin_b2_mg: 0
  vitamin_b3_mg: 0
  vitamin_b5_mg: 0
  vitamin_b6_mg: 0
  vitamin_b7_ug: 0
  vitamin_b9_ug: 0
  vitamin_b12_ug: 0
  choline_mg: 0
  # Fatty acids
  omega3_epa_mg: 0
  omega3_dha_mg: 0
  omega3_ala_g: 0
  omega6_la_g: 0
  # Ultra-trace minerals
  boron_mg: 0
  silicon_mg: 0
  vanadium_ug: 0
  nickel_ug: 0
derived:
  salt_g_from_sodium: "= per_portion.sodium_mg * 2.5 / 1000"
quality:
  confidence: low  # low|medium|high
  gaps: []
notes: []
change_log: []
"""


def slugify(text):
    """Convert text to a filesystem-safe slug."""
    slug = text.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    slug = slug.strip('-')
    return slug


def categorize_venue(venue_display_name):
    """Determine the category and folder for a venue.

    Returns: (category, folder_name) tuple
    """
    venue_lower = venue_display_name.lower()

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
    elif 'third space' in venue_lower or 'natural fitness food' in venue_lower or 'nff' in venue_lower:
        return ('venues', 'third-space-nff')
    elif 'decimo' in venue_lower:
        return ('venues', 'decimo-london')
    elif 'miznon' in venue_lower:
        return ('venues', 'miznon')
    elif 'maset' in venue_lower:
        return ('venues', 'maset')

    # Packaged products
    elif 'grenade' in venue_lower:
        return ('packaged', 'grenade')
    elif 'amisa' in venue_lower:
        return ('packaged', 'amisa')
    elif 'yarden' in venue_lower:
        return ('packaged', 'yarden')
    elif 'optimum nutrition' in venue_lower:
        return ('packaged', 'optimum-nutrition')
    elif "pack'd" in venue_lower or 'packd' in venue_lower:
        return ('packaged', 'packd')
    elif 'rot front' in venue_lower or 'rotfront' in venue_lower:
        return ('packaged', 'rot-front')
    elif 'daylesford' in venue_lower:
        return ('packaged', 'daylesford-organic')
    elif 'lucozade' in venue_lower:
        return ('packaged', 'lucozade')
    elif 'lindt' in venue_lower:
        return ('packaged', 'lindt')
    elif 'chavroux' in venue_lower:
        return ('packaged', 'chavroux')
    elif 'st helens farm' in venue_lower or 'st-helens-farm' in venue_lower:
        return ('packaged', 'st-helens-farm')
    elif 'londons chocolate' in venue_lower or 'london\'s chocolate' in venue_lower:
        return ('packaged', 'londons-chocolate-company')
    elif 'germes' in venue_lower:
        return ('packaged', 'germes')
    elif 'zuppe' in venue_lower:
        return ('packaged', 'zuppe')

    # Generic categories
    elif 'ingredient' in venue_lower or venue_lower == 'generic':
        return ('generic', 'ingredients')
    elif 'bakery' in venue_lower:
        return ('generic', 'bakery')
    elif 'bar' in venue_lower or 'restaurant' in venue_lower:
        return ('generic', 'bar-restaurant')
    elif 'grocery' in venue_lower or 'supermarket' in venue_lower:
        return ('generic', 'grocery')
    elif 'supplement' in venue_lower:
        return ('generic', 'supplements')
    elif 'pub' in venue_lower:
        return ('generic', 'pub-bar')
    elif 'fresh' in venue_lower or 'fruit' in venue_lower or 'produce' in venue_lower:
        return ('generic', 'fresh-produce')

    # Default: create a new folder based on slugified venue name
    print(f"Warning: Unknown venue category for '{venue_display_name}', using generic categorization")
    return ('generic', slugify(venue_display_name))


def create_dish_file(dish_id, venue_name, display_name, category, portion_desc, output_dir):
    """Create an individual dish file."""
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')

    # Fill in template
    yaml_content = SCHEMA_TEMPLATE.format(
        stable_id=dish_id,
        today=today,
        venue_name=venue_name,
        category=category,
        portion_desc=portion_desc
    )

    # Create file content with header and YAML
    content = f"## {display_name}\n\n```yaml\n{yaml_content.strip()}\n```\n"

    # Write file
    filename = f"{dish_id}.md"
    filepath = output_dir / filename

    # Check if file already exists to prevent accidental overwrites
    if filepath.exists():
        raise FileExistsError(
            f"Dish file already exists: {filepath}\n"
            f"Refusing to overwrite existing dish data. If you want to update this dish:\n"
            f"  1. Delete the existing file manually if you're sure, or\n"
            f"  2. Edit it directly instead of recreating it, or\n"
            f"  3. Use a different dish_id (e.g., increment version number)"
        )

    filepath.write_text(content, encoding='utf-8')

    return filepath


def regenerate_index():
    """Auto-regenerate the index after adding a dish."""
    script_dir = Path(__file__).parent
    generate_index_script = script_dir / "generate_index.py"

    if generate_index_script.exists():
        print("\n✓ Regenerating index...")
        import subprocess
        try:
            result = subprocess.run(
                [sys.executable, str(generate_index_script)],
                capture_output=True,
                text=True,
                check=True
            )
            print(result.stdout.strip())
        except subprocess.CalledProcessError as e:
            print(f"Warning: Failed to regenerate index: {e}")
            print(f"  You can manually regenerate it by running: python scripts/generate_index.py")
    else:
        print(f"\nNote: Index generation script not found. Run manually: python scripts/generate_index.py")


def main():
    import argparse
    ap = argparse.ArgumentParser(
        description="Create a new dish file in the appropriate venue/category folder"
    )
    ap.add_argument("--dish_slug", required=True, help="Dish slug (e.g., 'grilled_salmon_fillet')")
    ap.add_argument("--venue_slug", required=True, help="Venue slug (e.g., 'shk')")
    ap.add_argument("--venue_name", required=True, help="Full venue name (e.g., 'Simple Health Kitchen, Baker Street (London)')")
    ap.add_argument("--display_name", required=True, help="Display name for header (e.g., 'Grilled Salmon Fillet (SHK)')")
    ap.add_argument("--category", required=True, choices=["main","side","ingredient","drink","dessert"])
    ap.add_argument("--portion_desc", default="restaurant portion", help="Portion description")
    args = ap.parse_args()

    # Determine output directory
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    data_bank_base = project_root / 'data' / 'food-data-bank'

    # Categorize venue and get folder
    category_type, folder_name = categorize_venue(args.venue_name)
    output_dir = data_bank_base / category_type / folder_name

    # Create directory if it doesn't exist
    output_dir.mkdir(parents=True, exist_ok=True)

    # Create dish ID
    dish_id = f"{args.dish_slug}_{args.venue_slug}_v1"

    # Create dish file
    filepath = create_dish_file(
        dish_id,
        args.venue_name,
        args.display_name,
        args.category,
        args.portion_desc,
        output_dir
    )

    print(f"✓ Created new dish file:")
    print(f"  Location: {filepath}")
    print(f"  Category: {category_type}/{folder_name}")
    print(f"  Dish ID: {dish_id}")

    # Regenerate index
    regenerate_index()


if __name__ == "__main__":
    main()
