# Food Data Bank Structure

- `venues/<slug>/<dish_id>.yaml`: venue-specific dishes with full nutrition records.
- `generic/<dish_id>.yaml`: packaged or non-venue items.
- `venues/<slug>/research-notes.md`: optional venue notes and methodologies.
- `schema/dish-template.yaml`: scaffold used by `scripts/new_dish_from_template.py`.
- `venues.yaml`: display names and ID slug mapping for venues.

Run `python scripts/generate_index.py` after edits to rebuild `data/food-data-bank-index.md`.
