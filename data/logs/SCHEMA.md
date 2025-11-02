# Nutrition Log Schema

Logs are organized by date: `YYYY-MM/DD.yaml`

Example: `2025-10/30.yaml` contains all meals eaten on 2025-10-30.

## File Structure

```yaml
# data/logs/2025-10/30.yaml
date: 2025-10-30
day_type: rest  # rest|training (determines which targets to compare against)

entries:
  - timestamp: "2025-10-30T08:15:00+00:00"  # ISO 8601 with timezone
    items:
      - name: "Chilli Poached Eggs"
        food_bank_id: chilli_poached_eggs_leto_v2  # null if not in food bank
        quantity: 1
        unit: portion  # portion|g|ml|etc
        nutrition:
          # Snapshot of nutrition at time of logging
          # Copy all non-null fields from food bank entry
          energy_kcal: 597.4
          protein_g: 30.4
          fat_g: 34.2
          sat_fat_g: 10.5
          mufa_g: 16.8
          pufa_g: 4.3
          trans_fat_g: 0.1
          cholesterol_mg: 398
          carbs_total_g: 43.7
          polyols_g: 0.0
          carbs_available_g: 40.3
          sugar_g: 5.2
          fiber_total_g: 6.8
          fiber_soluble_g: null
          fiber_insoluble_g: null
          sodium_mg: 1543
          potassium_mg: 730
          iodine_ug: null
          magnesium_mg: 85
          calcium_mg: 180
          iron_mg: 3.2
          zinc_mg: 2.1
          vitamin_c_mg: 12
          manganese_mg: null

      - name: "Orange juice"
        food_bank_id: null  # estimated, not in food bank
        quantity: 250
        unit: ml
        nutrition:
          energy_kcal: 102.8
          protein_g: 1.7
          fat_g: 0.2
          carbs_total_g: 25.8
          polyols_g: 0.0
          carbs_available_g: 23.4
          sugar_g: 21.0
          fiber_total_g: 2.4
          # ... (include all available fields)

    notes: "breakfast at home"  # optional context

  - timestamp: "2025-10-30T13:00:00+00:00"
    items:
      - name: "Salmon with roasted vegetables"
        food_bank_id: salmon_roasted_veg_shk_v1
        quantity: 1
        unit: portion
        nutrition:
          energy_kcal: 420
          protein_g: 35.0
          # ...
    notes: ""
```

## Key Principles

1. **Snapshot nutrition data**: Copy full nutrition from food bank at time of logging. This ensures historical accuracy even if food bank entries are updated later.

2. **Reference food bank**: Store `food_bank_id` to track source. Set to `null` for estimated/manual entries.

3. **Flexible items**: Each entry (meal) can have multiple items. Track quantity and unit for each.
4. **Energy derived from nutrients**: Store `energy_kcal` as the available-carb Atwater result (`4P + 9F + 4*carbs_available + 2*fibre + 2.4*polyols`) to stay aligned with the food bank.
5. **Timestamping**: One timestamp per entry (meal level), not per item.
6. **Day type**: Track rest vs training day for proper target comparison.
7. **Notes**: Optional context at entry level (location, how you felt, etc.).

## Querying

**Today's totals:**
- Read `YYYY-MM/DD.yaml` for today
- Sum `nutrition` across all items in all entries
- Compare to targets from `references/health-profile.yaml`

**Weekly trends:**
- Read last 7 log files
- Sum nutrition per day
- Calculate daily averages
- Compare to targets
- Show compliance rate (days hitting targets)

**Rolling 7-day average:**
- Read last 7 log files
- Total nutrition across all days
- Divide by 7
- Compare to daily targets
