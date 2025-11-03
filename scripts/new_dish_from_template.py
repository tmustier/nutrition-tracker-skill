#!/usr/bin/env python3
"""Create a new dish file from the shared template."""

from __future__ import annotations

import argparse
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Optional

try:
    import yaml
except ImportError as exc:  # pragma: no cover - configuration error
    sys.stderr.write("PyYAML is required. Install with: pip install pyyaml\n")
    raise

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DISHES_ROOT = PROJECT_ROOT / "data" / "dishes"
DEFAULT_TEMPLATE = DEFAULT_DISHES_ROOT / "schema" / "dish-template.yaml"
DEFAULT_VENUES_CONFIG = DEFAULT_DISHES_ROOT / "venues.yaml"
DEFAULT_INDEX_SCRIPT = PROJECT_ROOT / "scripts" / "generate_index.py"

CATEGORY_CHOICES = ["main", "side", "ingredient", "drink", "dessert"]


def load_venue_config(path: Path) -> Dict[str, Dict[str, str]]:
    if not path.exists():
        return {}
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    venues = data.get("venues", {})
    result: Dict[str, Dict[str, str]] = {}
    for slug, info in venues.items():
        if isinstance(info, dict):
            result[slug] = {k: str(v) for k, v in info.items()}
    return result


def build_id(
    dish_slug: str,
    scope: str,
    version: int,
    venue_id_slug: Optional[str],
    explicit_id: Optional[str],
) -> str:
    if explicit_id:
        return explicit_id
    if scope == "generic":
        return f"{dish_slug}_v{version}"
    if not venue_id_slug:
        raise ValueError("Missing venue id slug; provide --venue-slug or configure it in venues.yaml")
    return f"{dish_slug}_{venue_id_slug}_v{version}"


def escape_quotes(value: str) -> str:
    return value.replace('"', '\"')


def substitute_template(template: str, replacements: Dict[str, str]) -> str:
    content = template
    for placeholder, value in replacements.items():
        content = content.replace(placeholder, value)
    if "{{" in content or "}}" in content:
        raise ValueError("Template substitution incomplete; unresolved placeholder remains")
    return content


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create a new dish from the template")
    parser.add_argument("--name", required=True, help="Full dish name for the `name` field")
    parser.add_argument("--dish-slug", required=True, help="Slug used for the dish portion of the ID")
    parser.add_argument("--category", required=True, choices=CATEGORY_CHOICES)
    parser.add_argument("--portion-desc", default="restaurant portion", help="Portion description text")
    parser.add_argument(
        "--scope",
        choices=["venue", "generic"],
        default="venue",
        help="Whether the dish belongs to a venue folder or the generic library",
    )
    parser.add_argument("--venue", help="Venue folder slug (e.g. simple-health-kitchen)")
    parser.add_argument(
        "--venue-slug",
        help="Venue slug embedded in IDs (e.g. shk). Defaults to venues.yaml mapping when scope=venue",
    )
    parser.add_argument("--source-venue", help="Value for source.venue (default: dish name)")
    parser.add_argument("--id", help="Override the generated dish ID")
    parser.add_argument("--version", type=int, default=1, help="Version for the new record (default: 1)")
    parser.add_argument(
        "--dishes-root",
        type=Path,
        default=DEFAULT_DISHES_ROOT,
        help="Root directory containing per-dish files (default: data/dishes)",
    )
    parser.add_argument(
        "--template",
        type=Path,
        default=DEFAULT_TEMPLATE,
        help="Path to the template YAML file",
    )
    parser.add_argument(
        "--venues-config",
        type=Path,
        default=DEFAULT_VENUES_CONFIG,
        help="Venue configuration file (used to map folder -> id slug)",
    )
    parser.add_argument("--force", action="store_true", help="Overwrite existing file if it exists")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    template_path: Path = args.template
    dishes_root: Path = args.dishes_root

    if not template_path.exists():
        sys.stderr.write(f"Template not found: {template_path}\n")
        return 1
    if not dishes_root.exists():
        sys.stderr.write(f"Dishes root not found: {dishes_root}\n")
        return 1

    venues_cfg = load_venue_config(args.venues_config)
    venue_folder_slug: Optional[str] = None
    venue_id_slug: Optional[str] = args.venue_slug

    if args.scope == "venue":
        if not args.venue and not venue_id_slug:
            sys.stderr.write("Provide --venue or --venue-slug for venue-scoped dishes.\n")
            return 1
        if args.venue:
            venue_folder_slug = args.venue
            config_entry = venues_cfg.get(venue_folder_slug)
            if config_entry:
                configured_id_slug = config_entry.get("id_slug")
                if venue_id_slug and configured_id_slug and venue_id_slug != configured_id_slug:
                    sys.stderr.write(
                        f"Provided --venue-slug '{venue_id_slug}' disagrees with venues.yaml entry '{configured_id_slug}'.\n"
                    )
                    return 1
                venue_id_slug = venue_id_slug or configured_id_slug
            elif not venue_id_slug:
                sys.stderr.write(
                    f"Venue '{venue_folder_slug}' is not defined in venues.yaml and --venue-slug was not provided.\n"
                )
                return 1
        else:
            # venue not provided but venue slug is; look up folder slug via config
            matched = [slug for slug, info in venues_cfg.items() if info.get("id_slug") == venue_id_slug]
            if not matched:
                sys.stderr.write("Could not determine venue folder from --venue-slug; update venues.yaml or use --venue.\n")
                return 1
            if len(matched) > 1:
                sys.stderr.write(
                    f"Multiple venues share id slug '{venue_id_slug}'. Provide --venue to disambiguate.\n"
                )
                return 1
            venue_folder_slug = matched[0]
    else:
        if args.venue or venue_id_slug:
            sys.stderr.write("--venue/--venue-slug are not valid when --scope=generic.\n")
            return 1

    dish_id = build_id(args.dish_slug, args.scope, args.version, venue_id_slug, args.id)

    if args.scope == "venue":
        target_dir = dishes_root / "venues" / venue_folder_slug
    else:
        target_dir = dishes_root / "generic"
    target_dir.mkdir(parents=True, exist_ok=True)
    target_file = target_dir / f"{dish_id}.yaml"

    if target_file.exists() and not args.force:
        sys.stderr.write(f"File already exists: {target_file}. Use --force to overwrite.\n")
        return 1

    template_text = template_path.read_text(encoding="utf-8")
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    source_venue = args.source_venue or args.name

    replacements = {
        "{{NAME}}": escape_quotes(args.name),
        "{{ID}}": dish_id,
        "{{VERSION}}": str(args.version),
        "{{DATE}}": today,
        "{{SOURCE_VENUE}}": escape_quotes(source_venue),
        "{{CATEGORY}}": args.category,
        "{{PORTION_DESC}}": escape_quotes(args.portion_desc),
    }

    content = substitute_template(template_text, replacements)
    target_file.write_text(content + "\n", encoding="utf-8")
    print(f"✓ Created {target_file}")

    if DEFAULT_INDEX_SCRIPT.exists():
        cmd = [
            sys.executable,
            str(DEFAULT_INDEX_SCRIPT),
            "--dishes-root",
            str(dishes_root),
        ]
        if args.venues_config:
            cmd.extend(["--venues-config", str(args.venues_config)])
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            if result.stdout.strip():
                print(result.stdout.strip())
            if result.stderr.strip():
                print(result.stderr.strip())
        except subprocess.CalledProcessError as exc:
            print(f"Warning: index generation failed ({exc}). Run manually: python scripts/generate_index.py")
            if exc.stderr:
                print(exc.stderr)
    else:
        print("Note: generate_index.py not found. Skipped index regeneration.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
