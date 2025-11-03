#!/usr/bin/env python3
"""Generate the food data bank index from per-dish YAML files."""

from __future__ import annotations

import argparse
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Tuple

try:
    import yaml
except ImportError as exc:  # pragma: no cover - configuration error
    sys.stderr.write("PyYAML is required. Install with: pip install pyyaml\n")
    raise

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DISHES_ROOT = PROJECT_ROOT / "data" / "dishes"
DEFAULT_VENUES_CONFIG = DEFAULT_DISHES_ROOT / "venues.yaml"
DEFAULT_INDEX_PATH = PROJECT_ROOT / "data" / "food-data-bank-index.md"


def slug_to_title(slug: str) -> str:
    """Convert a slug to a human-readable title."""
    return slug.replace("-", " ").title()


def load_venue_config(path: Path) -> Tuple[Dict[str, str], str]:
    """Return mapping of venue folder slug -> display name, and generic label."""
    if not path.exists():
        return {}, "Generic Items"

    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    venues = data.get("venues", {})
    display_map: Dict[str, str] = {}
    for slug, info in venues.items():
        if isinstance(info, dict):
            display_map[slug] = info.get("display_name", slug_to_title(slug))
        elif isinstance(info, str):
            display_map[slug] = info
    generic_cfg = data.get("generic", {})
    if isinstance(generic_cfg, dict):
        generic_display = generic_cfg.get("display_name", "Generic Items")
    elif isinstance(generic_cfg, str):
        generic_display = generic_cfg
    else:
        generic_display = "Generic Items"
    return display_map, generic_display


def iter_dish_files(root: Path) -> Iterable[Path]:
    """Yield YAML files for dishes under the given root."""
    for path in sorted(root.rglob("*.yaml")):
        rel_parts = path.relative_to(root).parts
        if not rel_parts:
            continue
        if rel_parts[0] not in {"venues", "generic"}:
            continue  # skip schema/templates, etc.
        yield path


def load_dish(path: Path) -> Dict:
    """Load a dish YAML file."""
    text = path.read_text(encoding="utf-8")
    data = yaml.safe_load(text) or {}
    if not isinstance(data, dict):
        raise ValueError(f"File {path} does not contain a mapping")
    return data


def build_index(dishes_root: Path, venue_display: Dict[str, str], generic_display: str) -> Tuple[str, Dict[str, List[Dict]], List[Dict]]:
    """Collect dish metadata grouped by venue and generics."""
    venues: Dict[str, List[Dict]] = defaultdict(list)
    generic_items: List[Dict] = []

    for dish_path in iter_dish_files(dishes_root):
        rel = dish_path.relative_to(dishes_root)
        parts = rel.parts
        try:
            dish_data = load_dish(dish_path)
        except Exception as exc:
            raise RuntimeError(f"Failed to parse {dish_path}: {exc}") from exc

        name = dish_data.get("name")
        dish_id = dish_data.get("id")
        if not name or not dish_id:
            raise RuntimeError(f"Dish file {dish_path} is missing required fields 'name' or 'id'")

        entry = {
            "name": name,
            "id": dish_id,
            "path": dish_path,
        }

        if parts[0] == "generic":
            generic_items.append(entry)
        else:
            if len(parts) < 2:
                raise RuntimeError(f"Unexpected dish path layout: {dish_path}")
            venue_slug = parts[1]
            venues[venue_slug].append(entry)

    for slug in venues:
        venues[slug].sort(key=lambda item: item["name"].lower())
    generic_items.sort(key=lambda item: item["name"].lower())

    total = sum(len(items) for items in venues.values()) + len(generic_items)
    return total, venues, generic_items


def format_index(
    total_dishes: int,
    venues: Dict[str, List[Dict]],
    generic_items: List[Dict],
    venue_display: Dict[str, str],
    generic_display: str,
    output_path: Path,
) -> str:
    """Render the markdown index."""
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    lines: List[str] = [
        "---",
        "title: Food Data Bank Index",
        "description: Auto-generated index of dishes organised by venue",
        f"generated: {timestamp}",
        "---",
        "",
        "# Food Data Bank Index",
        "",
        "This index reflects the per-dish YAML files stored under `data/dishes`.",
        "",
        "> **Note**: Auto-generated. Run `python scripts/generate_index.py` after editing dishes.",
        "",
        f"Total dishes: {total_dishes}",
        "",
    ]

    if venues:
        lines.append("## Venues")
        lines.append("")
        for slug in sorted(venues, key=lambda s: venue_display.get(s, slug_to_title(s)).lower()):
            display_name = venue_display.get(slug, slug_to_title(slug))
            items = venues[slug]
            lines.append(f"### {display_name} ({len(items)} items)")
            lines.append("")
            for item in items:
                rel_link = item["path"].relative_to(output_path.parent).as_posix()
                lines.append(f"- [{item['name']}](./{rel_link}) {{#{item['id']}}}")
            lines.append("")

    lines.append(f"## {generic_display} ({len(generic_items)} items)")
    lines.append("")
    for item in generic_items:
        rel_link = item["path"].relative_to(output_path.parent).as_posix()
        lines.append(f"- [{item['name']}](./{rel_link}) {{#{item['id']}}}")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("*Generated automatically from per-dish YAML files.*")
    lines.append("")
    return "\n".join(lines)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate the food data bank index")
    parser.add_argument(
        "--dishes-root",
        type=Path,
        default=DEFAULT_DISHES_ROOT,
        help="Directory containing per-dish YAML files (default: data/dishes)",
    )
    parser.add_argument(
        "--venues-config",
        type=Path,
        default=DEFAULT_VENUES_CONFIG,
        help="YAML file describing venue display names (default: data/dishes/venues.yaml)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_INDEX_PATH,
        help="Destination markdown file for the index (default: data/food-data-bank-index.md)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    dishes_root = args.dishes_root.resolve()
    output_path = args.output.resolve()
    venues_config = args.venues_config.resolve()

    if not dishes_root.exists():
        sys.stderr.write(f"Dishes root not found: {dishes_root}\n")
        return 1

    venue_display, generic_display = load_venue_config(venues_config)

    total, venues, generic_items = build_index(dishes_root, venue_display, generic_display)
    content = format_index(total, venues, generic_items, venue_display, generic_display, output_path)
    output_path.write_text(content, encoding="utf-8")
    print(f"✓ Generated index with {total} dishes → {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
