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
          # ALL nutrition fields must be 0 or positive numbers - NO nulls allowed
          # Use 0 for unmeasured values; qualify estimates in assumptions/notes
          # Schema Version 2: Expanded to 52 nutrient fields

          # Macros & Energy
          energy_kcal: 597.4
          protein_g: 30.4
          fat_g: 34.2
          sat_fat_g: 10.5
          mufa_g: 16.8
          pufa_g: 4.3
          trans_fat_g: 0.1
          cholesterol_mg: 398

          # Carbohydrates
          carbs_total_g: 43.7
          polyols_g: 0.0
          carbs_available_g: 40.3
          sugar_g: 5.2
          fiber_total_g: 6.8
          fiber_soluble_g: 0
          fiber_insoluble_g: 0

          # Essential Minerals
          sodium_mg: 1543
          potassium_mg: 730
          calcium_mg: 180
          magnesium_mg: 85
          phosphorus_mg: 220
          chloride_mg: 2340
          sulfur_g: 0.3

          # Trace Minerals
          iron_mg: 3.2
          zinc_mg: 2.1
          copper_mg: 0.4
          manganese_mg: 0.8
          selenium_ug: 18
          iodine_ug: 45
          chromium_ug: 12
          molybdenum_ug: 8

          # Fat-Soluble Vitamins
          vitamin_a_ug: 280
          vitamin_d_ug: 2.5
          vitamin_e_mg: 4.2
          vitamin_k_ug: 35

          # B Vitamins
          vitamin_b1_mg: 0.3
          vitamin_b2_mg: 0.4
          vitamin_b3_mg: 3.5
          vitamin_b5_mg: 1.2
          vitamin_b6_mg: 0.5
          vitamin_b7_ug: 15
          vitamin_b9_ug: 125
          vitamin_b12_ug: 1.8
          choline_mg: 280

          # Water-Soluble Vitamins (other)
          vitamin_c_mg: 12

          # Omega-3 & Omega-6 Fatty Acids
          omega3_epa_mg: 0
          omega3_dha_mg: 0
          omega3_ala_g: 0.2
          omega6_la_g: 1.8

          # Ultra-Trace Minerals
          boron_mg: 0.5
          silicon_mg: 8
          vanadium_ug: 2
          nickel_ug: 5

      - name: "Orange juice"
        food_bank_id: null  # estimated, not in food bank
        quantity: 250
        unit: ml
        nutrition:
          # All 52 fields shown - use 0 for unmeasured values
          energy_kcal: 102.8
          protein_g: 1.7
          fat_g: 0.2
          sat_fat_g: 0
          mufa_g: 0
          pufa_g: 0.1
          trans_fat_g: 0
          cholesterol_mg: 0
          carbs_total_g: 25.8
          polyols_g: 0.0
          carbs_available_g: 23.4
          sugar_g: 21.0
          fiber_total_g: 2.4
          fiber_soluble_g: 0
          fiber_insoluble_g: 0
          sodium_mg: 2
          potassium_mg: 473
          calcium_mg: 25
          magnesium_mg: 27
          phosphorus_mg: 42
          chloride_mg: 0
          sulfur_g: 0
          iron_mg: 0.5
          zinc_mg: 0.1
          copper_mg: 0.1
          manganese_mg: 0.1
          selenium_ug: 0
          iodine_ug: 0
          chromium_ug: 0
          molybdenum_ug: 0
          vitamin_a_ug: 47
          vitamin_d_ug: 0
          vitamin_e_mg: 0.2
          vitamin_k_ug: 0
          vitamin_b1_mg: 0.2
          vitamin_b2_mg: 0.1
          vitamin_b3_mg: 0.8
          vitamin_b5_mg: 0.5
          vitamin_b6_mg: 0.1
          vitamin_b7_ug: 0
          vitamin_b9_ug: 75
          vitamin_b12_ug: 0
          choline_mg: 0
          vitamin_c_mg: 124
          omega3_epa_mg: 0
          omega3_dha_mg: 0
          omega3_ala_g: 0
          omega6_la_g: 0
          boron_mg: 0
          silicon_mg: 0
          vanadium_ug: 0
          nickel_ug: 0

    notes: "breakfast at home"  # optional context

  - timestamp: "2025-10-30T13:00:00+00:00"
    items:
      - name: "Salmon with roasted vegetables"
        food_bank_id: salmon_roasted_veg_shk_v1
        quantity: 1
        unit: portion
        nutrition:
          # Include all 52 fields (abbreviated for space - follow same order as above)
          energy_kcal: 420
          protein_g: 35.0
          fat_g: 18.5
          sat_fat_g: 3.2
          # ... (remaining 47 fields)
    notes: ""
```

## Key Principles

1. **Snapshot nutrition data**: Copy full nutrition from food bank at time of logging. This ensures historical accuracy even if food bank entries are updated later.

2. **Reference food bank**: Store `food_bank_id` to track source. Set to `null` for estimated/manual entries.

3. **NO null nutrition values**: All nutrition fields must have numeric values (0 or positive). Use 0 for unmeasured/unknown values and document assumptions in notes. This maintains the philosophy that all entries are estimates - nulls defeat the purpose of precise estimation.

4. **Flexible items**: Each entry (meal) can have multiple items. Track quantity and unit for each.

5. **Energy derived from nutrients**: Store `energy_kcal` as the available-carb Atwater result (`4P + 9F + 4*carbs_available + 2*fibre + 2.4*polyols`) to stay aligned with the food bank.

6. **Timestamping**: One timestamp per entry (meal level), not per item.

7. **Day type**: Track rest vs training day for proper target comparison.

8. **Notes**: Optional context at entry level (location, how you felt, etc.).

9. **Schema Version 2 - 52 Nutrient Fields**: As of 2025-11-05, the schema has been expanded from 24 to 52 nutrient fields to provide comprehensive tracking. All 52 fields are organized into 8 categories:
   - **Macros & Energy** (8 fields): energy_kcal, protein_g, fat_g, sat_fat_g, mufa_g, pufa_g, trans_fat_g, cholesterol_mg
   - **Carbohydrates** (7 fields): carbs_total_g, polyols_g, carbs_available_g, sugar_g, fiber_total_g, fiber_soluble_g, fiber_insoluble_g
   - **Essential Minerals** (7 fields): sodium_mg, potassium_mg, calcium_mg, magnesium_mg, phosphorus_mg, chloride_mg, sulfur_g
   - **Trace Minerals** (8 fields): iron_mg, zinc_mg, copper_mg, manganese_mg, selenium_ug, iodine_ug, chromium_ug, molybdenum_ug
   - **Fat-Soluble Vitamins** (4 fields): vitamin_a_ug, vitamin_d_ug, vitamin_e_mg, vitamin_k_ug
   - **B Vitamins** (9 fields): vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b5_mg, vitamin_b6_mg, vitamin_b7_ug, vitamin_b9_ug, vitamin_b12_ug, choline_mg
   - **Water-Soluble Vitamins (other)** (1 field): vitamin_c_mg
   - **Omega-3 & Omega-6 Fatty Acids** (4 fields): omega3_epa_mg, omega3_dha_mg, omega3_ala_g, omega6_la_g
   - **Ultra-Trace Minerals** (4 fields): boron_mg, silicon_mg, vanadium_ug, nickel_ug

   **Backward Compatibility**: Older log entries with only 24 fields remain valid. Analysis tools should handle missing fields by treating them as 0. When updating or creating new entries, always include all 52 fields.

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
