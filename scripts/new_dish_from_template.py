#!/usr/bin/env python3
"""
Append a fresh dish block from the Schema TEMPLATE to the Data Bank.
- Fills id from slugs: {dish_slug}_{venue_slug}_v1
- Sets version: 1, last_verified: today
- Fills source.venue and portion.description
It does not try to fully update the Dishes Index (prints a suggested bullet).
"""
import sys, re
from pathlib import Path
from datetime import datetime, timezone

def load_text(p):
    return Path(p).read_text(encoding="utf-8")

def save_text(p, txt):
    Path(p).write_text(txt, encoding="utf-8")

def get_template(text):
    m = re.search(r"## Schema TEMPLATE.*?```yaml(.*?)```", text, re.S | re.M)
    if not m:
        raise RuntimeError("Schema TEMPLATE not found.")
    return m.group(1)

def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--bank", required=True, help="Path to references/data-bank.md")
    ap.add_argument("--dish_slug", required=True)
    ap.add_argument("--venue_slug", required=True)
    ap.add_argument("--display_name", required=True, help='e.g. "Grilled Salmon Fillet (Venue)"')
    ap.add_argument("--category", required=True, choices=["main","side","ingredient","drink","dessert"])
    ap.add_argument("--portion_desc", default="restaurant portion")
    args = ap.parse_args()

    text = load_text(args.bank)
    templ = get_template(text)

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    stable_id = f"{args.dish_slug}_{args.venue_slug}_v1"

    block = templ
    block = re.sub(r"id:\s*\{stable_id\}_v1", f"id: {stable_id}", block)
    block = re.sub(r"version:\s*\d+", "version: 1", block, count=1)
    block = re.sub(r"last_verified:\s*YYYY-MM-DD", f"last_verified: {today}", block, count=1)
    block = re.sub(r"\{Venue\}", args.display_name, block)
    block = re.sub(r"category:\s*.*", f"category: {args.category}", block)
    block = re.sub(r'description:\s*""', f'description: "{args.portion_desc}"', block)

    # Wrap block in a code fence
    fenced = "\n\n```yaml\n" + block.strip() + "\n```\n"

    # Append to end of file
    new_text = text.rstrip() + fenced + "\n"
    save_text(args.bank, new_text)

    # Suggest index bullet
    print("Appended new dish block.")
    print("Suggested index bullet (add under '# Dishes Index'):\n")
    anchor = f"{{#{stable_id}}}"
    print(f"- [{args.display_name}]({anchor}) {anchor}")

if __name__ == "__main__":
    main()
