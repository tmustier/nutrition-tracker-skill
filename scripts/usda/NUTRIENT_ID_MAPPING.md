# USDA FoodData Central - Complete Nutrient ID Mapping

**Quick reference for extending the USDA API client to support all 52 nutrients**

---

## Python Dictionary for client.py

```python
# Complete NUTRIENT_MAPPING for scripts/usda/client.py
NUTRIENT_MAPPING = {
    # ===== MACROS & ENERGY (8 fields) =====
    1008: 'energy_kcal',               # Energy
    1003: 'protein_g',                 # Protein
    1004: 'fat_g',                     # Total lipid (fat)
    1258: 'sat_fat_g',                 # Fatty acids, total saturated
    1292: 'mufa_g',                    # Fatty acids, total monounsaturated
    1293: 'pufa_g',                    # Fatty acids, total polyunsaturated
    1257: 'trans_fat_g',               # Fatty acids, total trans
    1253: 'cholesterol_mg',            # Cholesterol

    # ===== CARBOHYDRATES (6 fields + 1 calculated) =====
    1005: 'carbs_total_g',             # Carbohydrate, by difference
    1018: 'polyols_g',                 # Sugar alcohols (erythritol, sorbitol, etc.)
    # carbs_available_g: CALCULATED (total - fiber - polyols)
    2000: 'sugar_g',                   # Sugars, total including NLEA
    1079: 'fiber_total_g',             # Fiber, total dietary
    1082: 'fiber_soluble_g',           # Fiber, soluble
    1084: 'fiber_insoluble_g',         # Fiber, insoluble

    # ===== ESSENTIAL MINERALS (7 fields) =====
    1093: 'sodium_mg',                 # Sodium, Na
    1092: 'potassium_mg',              # Potassium, K
    1087: 'calcium_mg',                # Calcium, Ca
    1090: 'magnesium_mg',              # Magnesium, Mg
    1091: 'phosphorus_mg',             # Phosphorus, P
    1088: 'chloride_mg',               # Chloride, Cl (LIMITED DATA)
    1094: 'sulfur_g',                  # Sulfur, S (LIMITED DATA)

    # ===== TRACE MINERALS (8 fields) =====
    1089: 'iron_mg',                   # Iron, Fe
    1095: 'zinc_mg',                   # Zinc, Zn
    1098: 'copper_mg',                 # Copper, Cu
    1101: 'manganese_mg',              # Manganese, Mn
    1103: 'selenium_ug',               # Selenium, Se
    1100: 'iodine_ug',                 # Iodine, I (IMPROVED 2025, still limited)
    1096: 'chromium_ug',               # Chromium, Cr (LIMITED DATA)
    1102: 'molybdenum_ug',             # Molybdenum, Mo (LIMITED DATA)

    # ===== FAT-SOLUBLE VITAMINS (4 fields) =====
    1106: 'vitamin_a_ug',              # Vitamin A, RAE
    1114: 'vitamin_d_ug',              # Vitamin D (D2 + D3)
    1109: 'vitamin_e_mg',              # Vitamin E (alpha-tocopherol)
    1185: 'vitamin_k_ug',              # Vitamin K (phylloquinone)

    # ===== B VITAMINS (9 fields) =====
    1165: 'vitamin_b1_mg',             # Thiamin (B1)
    1166: 'vitamin_b2_mg',             # Riboflavin (B2)
    1167: 'vitamin_b3_mg',             # Niacin (B3)
    1170: 'vitamin_b5_mg',             # Pantothenic acid (B5)
    1175: 'vitamin_b6_mg',             # Vitamin B-6 (Pyridoxine)
    1176: 'vitamin_b7_ug',             # Biotin (B7) (LIMITED DATA)
    1190: 'vitamin_b9_ug',             # Folate, DFE (B9)
    1178: 'vitamin_b12_ug',            # Vitamin B-12 (Cobalamin)
    1180: 'choline_mg',                # Choline, total

    # ===== WATER-SOLUBLE VITAMINS - OTHER (1 field) =====
    1162: 'vitamin_c_mg',              # Vitamin C, total ascorbic acid

    # ===== OMEGA-3 & OMEGA-6 FATTY ACIDS (4 fields) =====
    1278: 'omega3_epa_mg',             # EPA (20:5 n-3)
    1272: 'omega3_dha_mg',             # DHA (22:6 n-3)
    1404: 'omega3_ala_g',              # ALA (18:3 n-3)
    1269: 'omega6_la_g',               # LA (18:2 n-6) Linoleic acid

    # ===== ULTRA-TRACE MINERALS (4 fields) =====
    # NOT AVAILABLE IN USDA - These will remain 0
    # boron_mg: NOT TRACKED BY USDA
    # silicon_mg: NOT TRACKED BY USDA
    # vanadium_ug: NOT TRACKED BY USDA
    # nickel_ug: NOT TRACKED BY USDA
}
```

---

## Complete REQUIRED_FIELDS List

```python
REQUIRED_FIELDS = [
    # Macros & Energy (8)
    'energy_kcal', 'protein_g', 'fat_g', 'sat_fat_g', 'mufa_g', 'pufa_g',
    'trans_fat_g', 'cholesterol_mg',

    # Carbohydrates (7)
    'carbs_total_g', 'polyols_g', 'carbs_available_g', 'sugar_g',
    'fiber_total_g', 'fiber_soluble_g', 'fiber_insoluble_g',

    # Essential Minerals (7)
    'sodium_mg', 'potassium_mg', 'calcium_mg', 'magnesium_mg',
    'phosphorus_mg', 'chloride_mg', 'sulfur_g',

    # Trace Minerals (8)
    'iron_mg', 'zinc_mg', 'copper_mg', 'manganese_mg',
    'selenium_ug', 'iodine_ug', 'chromium_ug', 'molybdenum_ug',

    # Fat-Soluble Vitamins (4)
    'vitamin_a_ug', 'vitamin_d_ug', 'vitamin_e_mg', 'vitamin_k_ug',

    # B Vitamins (9)
    'vitamin_b1_mg', 'vitamin_b2_mg', 'vitamin_b3_mg', 'vitamin_b5_mg',
    'vitamin_b6_mg', 'vitamin_b7_ug', 'vitamin_b9_ug', 'vitamin_b12_ug',
    'choline_mg',

    # Water-Soluble Vitamins - Other (1)
    'vitamin_c_mg',

    # Omega Fatty Acids (4)
    'omega3_epa_mg', 'omega3_dha_mg', 'omega3_ala_g', 'omega6_la_g',

    # Ultra-Trace Minerals (4)
    'boron_mg', 'silicon_mg', 'vanadium_ug', 'nickel_ug',
]
```

---

## Coverage Summary

| Category | Total Fields | Available in USDA | Not in USDA | Notes |
|----------|-------------|-------------------|-------------|-------|
| **Macros & Energy** | 8 | 8 ✅ | 0 | Excellent coverage |
| **Carbohydrates** | 7 | 6 ✅ (+ 1 calculated) | 0 | Fiber split limited |
| **Essential Minerals** | 7 | 7 ⚠️ | 0 | Chloride/sulfur limited |
| **Trace Minerals** | 8 | 8 ⚠️ | 0 | Iodine/chromium/molybdenum limited |
| **Fat-Soluble Vitamins** | 4 | 4 ✅ | 0 | Good coverage |
| **B Vitamins** | 9 | 9 ⚠️ | 0 | Biotin (B7) limited |
| **Water-Soluble (Other)** | 1 | 1 ✅ | 0 | Excellent |
| **Omega Fatty Acids** | 4 | 4 ✅ | 0 | Good in fish/nuts |
| **Ultra-Trace Minerals** | 4 | 0 ❌ | 4 | Not tracked by USDA |
| **TOTAL** | **52** | **48** | **4** | **92% coverage** |

**Legend**:
- ✅ Excellent coverage (>80% of foods)
- ⚠️ Limited coverage (20-80% of foods, or specific food types)
- ❌ Not available

---

## Implementation Checklist

### Step 1: Update client.py

- [ ] Replace `NUTRIENT_MAPPING` with complete mapping above (48 nutrients)
- [ ] Replace `REQUIRED_FIELDS` with complete list (52 fields)
- [ ] Update docstrings mentioning "24 fields" → "52 fields"

### Step 2: Update parse_nutrition()

Current implementation already handles missing nutrients correctly:
```python
# Fill in missing required fields with 0
for field in self.REQUIRED_FIELDS:
    if field not in nutrients:
        nutrients[field] = 0
```

✅ No changes needed - will automatically set ultra-trace minerals to 0

### Step 3: Test

```bash
# Set API key
export USDA_API_KEY="your_key_here"

# Run test suite
python3 scripts/usda/test_client.py

# Test a few diverse foods
python3 scripts/usda/client.py lookup "chicken breast 200g" --json
python3 scripts/usda/client.py lookup "salmon 150g" --json
python3 scripts/usda/client.py lookup "spinach 100g" --json
python3 scripts/usda/client.py lookup "banana 150g" --json
```

### Step 4: Verify Output

Check that JSON output includes all 52 fields:
```json
{
  "per_portion": {
    "energy_kcal": 330,
    "protein_g": 62.0,
    ...
    "omega6_la_g": 0.5,
    "boron_mg": 0,        // Expected 0 (not in USDA)
    "silicon_mg": 0,      // Expected 0 (not in USDA)
    "vanadium_ug": 0,     // Expected 0 (not in USDA)
    "nickel_ug": 0        // Expected 0 (not in USDA)
  }
}
```

---

## Data Quality Expectations

### ✅ Excellent Coverage (expect data in >80% of foods)
- All macros (protein, fat, carbs, energy)
- Major minerals (sodium, potassium, calcium, magnesium, phosphorus)
- Core trace minerals (iron, zinc)
- Major vitamins (A, D, E, C, B1, B2, B3, B6, B9, B12)

### ⚠️ Good Coverage (expect data in 50-80% of foods)
- MUFA, PUFA, trans fat
- Copper, manganese, selenium
- Vitamin K
- Omega-3/6 fatty acids (variable by food type)

### ⚠️ Limited Coverage (expect data in <50% of foods)
- Fiber soluble/insoluble split (most foods only have fiber_total_g)
- Polyols (only in sugar-free products)
- Chloride, sulfur (rarely analyzed)
- Iodine (improved in 2025 but still limited)
- Chromium, molybdenum (not routinely analyzed)
- Biotin / Vitamin B7 (not routinely analyzed)
- Pantothenic acid / B5 (moderate coverage)
- Choline (moderate coverage)

### ❌ No Coverage (will always be 0 from USDA)
- Boron
- Silicon
- Vanadium
- Nickel

**Recommendation**: Accept these limitations. For missing ultra-trace minerals, estimate from literature or food category averages if critical for user's health tracking.

---

## Alternative Nutrient IDs (for reference)

Some nutrients have multiple IDs in USDA database. Use the primary IDs listed above, but be aware of these alternatives:

| Nutrient | Primary ID | Alternative IDs | Notes |
|----------|-----------|-----------------|-------|
| Energy | 1008 | 2047, 2048 | 1008 = general; 2047/2048 = Atwater-specific |
| Vitamin A | 1106 (RAE) | 1104 (IU), 1105 (retinol) | RAE is preferred |
| Vitamin D | 1114 (D2+D3) | 1110 (ergocalciferol), 1111 (cholecalciferol) | Total D preferred |
| Vitamin E | 1109 | 1124, 1125, 1126, etc. | 1109 = alpha-tocopherol (main form) |
| Folate | 1190 (DFE) | 1177 (food folate), 1186 (folic acid) | DFE accounts for bioavailability |

**Recommendation**: Stick with primary IDs in the mapping above.

---

## Quick API Test Commands

```bash
# Test search endpoint
curl "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=YOUR_KEY&query=chicken%20breast&pageSize=3"

# Test food details endpoint (FDC ID 171477 = Chicken breast, roasted)
curl "https://api.nal.usda.gov/fdc/v1/food/171477?api_key=YOUR_KEY"

# Test with specific nutrients only
curl "https://api.nal.usda.gov/fdc/v1/food/171477?api_key=YOUR_KEY&nutrients=1003,1004,1005,1008"
```

---

## Expected Update Locations

### 1. `/home/user/nutrition-tracking/scripts/usda/client.py`
- Line ~22: Update `NUTRIENT_MAPPING` dictionary
- Line ~49: Update `REQUIRED_FIELDS` list
- Docstrings: Change "24 fields" → "52 fields"

### 2. `/home/user/nutrition-tracking/scripts/usda/test_client.py`
- Line ~113: Update `required_fields = client.REQUIRED_FIELDS` (auto-updates)
- Line ~121: Update print statement "24 required fields" → "52 required fields"

### 3. `/home/user/nutrition-tracking/scripts/usda/README.md`
- Line 173: Change "all 24 required fields" → "all 52 required fields"
- Line 219: Change "nutrition_data now has all 24 required fields" → "all 52 required fields"
- Line 297: Update "Dict with all 24 required nutrition fields" → "all 52 required fields"

---

## Troubleshooting

### "Missing nutrient X in output"
- Check if nutrient ID is in NUTRIENT_MAPPING
- Verify USDA has data for that food (some nutrients are missing in certain foods)
- Expected behavior: Missing nutrients filled with 0

### "Only getting 24 fields instead of 52"
- Verify you've updated REQUIRED_FIELDS to include all 52
- Check parse_nutrition() fills missing fields (should already work)

### "Ultra-trace minerals showing as 0"
- ✅ Expected behavior - USDA doesn't track boron, silicon, vanadium, nickel
- Document in notes: "Ultra-trace minerals not available in USDA database"

### "Fiber split (soluble/insoluble) both 0"
- ⚠️ Expected for many foods - USDA doesn't always analyze fiber split
- Only fiber_total_g available in most cases
- Accept zeros or estimate from category averages

---

## References

- **Full Research Report**: `/home/user/nutrition-tracking/USDA_API_RESEARCH.md`
- **USDA API Guide**: https://fdc.nal.usda.gov/api-guide/
- **Schema Documentation**: `/home/user/nutrition-tracking/data/schemas/VERSIONS.md`
- **Existing Client**: `/home/user/nutrition-tracking/scripts/usda/client.py`

---

**Last Updated**: 2025-11-05
**Status**: Ready for implementation
