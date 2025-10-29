#!/usr/bin/env python3
"""
Build a byte/line index of fenced YAML dish blocks in a monolithic Data Bank.
Works with files like data/food-data-bank.md that contain many blocks of the form:

```yaml
id: some_dish_id_v1
...
```

Output: <bank_path>.index.json with entries: id, start, end (byte offsets), start_line, end_line.

Usage:
  python scripts/bank_build_index.py data/food-data-bank.md
"""
import sys, re, json
from pathlib import Path

FENCE_RE = re.compile(r"```yaml\s*(.*?)```", re.S | re.M)

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/bank_build_index.py <path/to/food-data-bank.md>")
        sys.exit(1)
    bank_path = Path(sys.argv[1])
    text = bank_path.read_text(encoding="utf-8")

    blocks = []
    for m in FENCE_RE.finditer(text):
        raw = m.group(1)
        # get id
        idm = re.search(r"^\s*id:\s*([A-Za-z0-9_\-]+)", raw, re.M)
        if not idm:
            continue
        bid = idm.group(1).strip()
        # byte offsets
        start = m.start(); end = m.end()
        # line numbers
        pre = text[:start]
        start_line = pre.count("\n") + 1
        end_line = start_line + text[start:end].count("\n")
        blocks.append({"id": bid, "start": start, "end": end, "start_line": start_line, "end_line": end_line})

    out = {"file": str(bank_path), "count": len(blocks), "blocks": blocks}
    out_path = str(bank_path) + ".index.json"
    Path(out_path).write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"Wrote index with {len(blocks)} blocks to {out_path}")

if __name__ == "__main__":
    main()
