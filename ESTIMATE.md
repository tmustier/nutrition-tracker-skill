# Carbohydrate Estimation Protocol

**Updated:** 2025-11-02  
**Scope:** Applies to every dish, ingredient, and log entry in this skill.

---

## 1. Terminology & Required Fields

Every per-portions block now tracks carbohydrate data with three explicit fields:

| Field | Meaning | Default precision |
| --- | --- | --- |
| `carbs_total_g` | Label-style total carbohydrate (includes fibre + polyols) | 0.1 g |
| `carbs_available_g` | Digestible / “available” carbohydrate (a.k.a. net carbs) | 0.1 g |
| `polyols_g` | Sugar alcohol mass; 0.0 if none or unknown | 0.1 g |

- `per_portion.carbs_g` remains for backward compatibility but should mirror `carbs_available_g`.
- `fiber_total_g` continues to represent total dietary fibre (soluble + insoluble).
- Relationship check: `carbs_total_g = carbs_available_g + fiber_total_g + polyols_g` (within rounding).

---

## 2. Source Classification

1. **UK / EU labels & venue data (Deliveroo, Tesco, SHK, etc.)**
   - Labels already report *available* carbohydrate.
   - Record the printed value in both `carbs_available_g` and `carbs_g`.
   - Derive `carbs_total_g = carbs_available_g + fiber_total_g + polyols_g`.

2. **US / Canada sources (USDA FDC, MyFitnessPal US, Nutritionix, etc.)**
   - Labels list *total* carbohydrate.
   - Copy the label into `carbs_total_g`.
   - Subtract fibre and any polyols to obtain `carbs_available_g`.
   - Update `carbs_g` to match `carbs_available_g`.
   - Flag the change in the dish `change_log` with source notes.

3. **Ambiguous / mixed sources**
   - Check the change log and notes—if “net carbs” or “available carbs” is mentioned, treat as UK/EU style.
   - Otherwise default to US handling and document assumptions.

---

## 3. Polyol Treatment

- When a label lists specific sugar alcohols, record them in `polyols_g`.
- If multiple polyols are present and their masses differ, add a note describing the breakdown.
- Energy factors (default unless more precise data are available):
  - Maltitol, sorbitol, xylitol: **2.4 kcal/g**
  - Erythritol: **0.2 kcal/g**
  - Other polyols: reference EU guideline tables; if unknown, fall back to 2.4 kcal/g and document.

---

## 4. Energy Recalculation Checklist

Use the UK/EU convention:

```
energy_from_macros_kcal =
    4 * protein_g
  + 9 * fat_g
  + 4 * carbs_available_g
  + 2 * fiber_total_g
  + polyol_factor * polyols_g
```

- `polyol_factor` is 2.4 kcal/g unless the note specifies another value.
- Always recompute `derived.energy_from_macros_kcal` after updating carbs.
- If the recomputed energy falls within ±8% of the recorded kcal, keep the original label energy. Otherwise:
  1. Confirm source classification.
  2. Adjust the label energy with a comment in `change_log`.

---

## 5. Change Log Requirements

Whenever carbohydrate fields change:

1. Bump `version` (if editing a dish) and update `last_verified`.
2. Add a `change_log` entry with:
   - ISO timestamp (Europe/London)
   - `updated_by`
   - `reason` (e.g., “Converted USDA total carbs to UK available convention”)
   - `fields_changed` including the new carb fields and any energy updates
   - `sources` referencing the label, USDA record, or calculation note

---

## 6. Daily Log Alignment

- Logs should mirror the dish data: include `carbs_total_g`, `carbs_available_g`, and `polyols_g` for each entry.
- When scaling a dish (e.g., half-portion), scale all carbohydrate fields proportionally.
- Custom log-only items follow the same rules as dishes—classify the source first, then populate the three fields and recompute energy.

---

## 7. Validation Script Expectations

The validator (`scripts/validate_data_bank.py`) assumes:

- `carbs_available_g` is present when `carbs_total_g` is present.
- `carbs_total_g ≈ carbs_available_g + fiber_total_g + polyols_g`.
- Energy checks leverage the available-carb formula above.

Any violations emit warnings to catch regressions before committing.
