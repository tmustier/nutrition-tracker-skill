#!/usr/bin/env python3
"""
Extract a single fenced YAML dish block by id from the monolithic Data Bank.
Uses the index file if present, otherwise falls back to a regex search.

Usage:
  python scripts/bank_extract_block.py --bank data/food-data-bank.md --id grilled_salmon_fillet_shk_v1
"""
import sys, re, json
from pathlib import Path

def load_index(bank_path: Path):
    idx_path = Path(str(bank_path) + ".index.json")
    if idx_path.exists():
        try:
            return json.loads(idx_path.read_text(encoding="utf-8"))
        except Exception:
            return None
    return None

def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--bank", required=True, help="Path to monolithic Data Bank, e.g., data/food-data-bank.md")
    ap.add_argument("--id", required=True, help="Dish id to extract (e.g., grilled_salmon_fillet_shk_v1)")
    args = ap.parse_args()

    bank_path = Path(args.bank)
    text = bank_path.read_text(encoding="utf-8")

    idx = load_index(bank_path)
    start = end = None
    if idx:
        for b in idx.get("blocks", []):
            if b.get("id") == args.id:
                start = b["start"]; end = b["end"]; break

    if start is None:
        m = re.search(r"```yaml\s*id:\s*"+re.escape(args.id)+r"\s*[\s\S]*?```", text, re.M)
        if not m:
            sys.stderr.write(f"[extract] Block with id={args.id} not found in {bank_path}\n")
            sys.exit(2)
        start, end = m.start(), m.end()

    sys.stdout.write(text[start:end])

if __name__ == "__main__":
    main()
