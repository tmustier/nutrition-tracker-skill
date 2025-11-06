# USDA FoodData Central API Research Report

**Date**: 2025-11-05
**Purpose**: Evaluate USDA FoodData Central API for enriching nutrition tracking system with 52-nutrient profiles

---

## Executive Summary

The USDA FoodData Central API provides **free, government-backed access to 600,000+ foods** with comprehensive nutrient data. Of the 52 nutrients tracked in this system, **approximately 45-48 are available in USDA data**, with the remaining 4 ultra-trace minerals (boron, silicon, vanadium, nickel) having limited or no coverage. The API has generous rate limits (1,000 requests/hour), supports fuzzy search, and provides high-quality data suitable for nutrition tracking.

**Recommendation**: ✅ **Use USDA FoodData Central as the primary enrichment source**, with EDAMAM or Nutritionix as supplements for restaurant/branded foods.

---

## 1. API Access

### Getting Started

**API Key Signup**: https://fdc.nal.usda.gov/api-key-signup.html
- **Cost**: FREE (no usage fees)
- **Approval**: Instant (key sent via email)
- **Requirements**: Name, email, organization (can use "Personal/Individual")

### Rate Limits

- **Default**: 1,000 requests per hour per IP address
- **Demo Key**: Available for testing but has much lower limits
- **Exceeded Limit**: Temporarily blocked for 1 hour
- **Higher Limits**: Contact FoodData Central if needed
- **Best Practice**: Cache results, batch requests, introduce delays (max 1-2 req/sec)

### Authentication

API key passed as query parameter:
```bash
https://api.nal.usda.gov/fdc/v1/foods/search?api_key=YOUR_KEY&query=chicken
```

### Base URL
```
https://api.nal.usda.gov/fdc/v1
```

### Documentation
- **API Guide**: https://fdc.nal.usda.gov/api-guide/
- **OpenAPI Spec**: https://fdc.nal.usda.gov/api-spec/fdc_api.html
- **Web Interface**: https://fdc.nal.usda.gov/ (for manual searches)

---

## 2. Search Capabilities

### Available Endpoints

#### `/foods/search` - Search foods by keyword
```bash
GET/POST /v1/foods/search
Parameters:
  - query (string, required): Search term
  - dataType (array): Filter by data types (Foundation, SR Legacy, Branded, Survey)
  - pageSize (int): 1-200, default 50
  - pageNumber (int): For pagination
  - sortBy (string): dataType, description, fdcId, publishedDate
  - sortOrder (string): asc, desc
  - brandOwner (string): Filter branded foods by brand
```

**Example**:
```bash
curl "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=KEY&query=chicken%20breast&pageSize=5"
```

#### `/food/{fdcId}` - Get detailed nutrition for specific food
```bash
GET /v1/food/{fdcId}
Parameters:
  - fdcId (path, required): Food identifier
  - format (query): "abridged" or "full" (default)
  - nutrients (query): Up to 25 nutrient numbers (comma-separated)
```

**Example**:
```bash
curl "https://api.nal.usda.gov/fdc/v1/food/171477?api_key=KEY"
```

#### `/foods` - Get multiple foods by IDs
```bash
GET/POST /v1/foods
Body (POST): {"fdcIds": [171477, 173424]}
```

### Search Features

✅ **Fuzzy Search**: USDA search handles typos and alternative names reasonably well
✅ **Natural Language**: Can parse basic queries like "grilled chicken breast"
✅ **Portion Detection**: API provides portion data, but client must parse quantity/unit
⚠️ **Limited NLP**: Not as sophisticated as Nutritionix or EDAMAM for natural language

### Handling Branded vs Generic Items

**Data Types Available**:

| Type | Description | Quality | Best For |
|------|-------------|---------|----------|
| **Foundation** | Lab-analyzed foods (limited coverage) | Highest | Scientific accuracy |
| **SR Legacy** | Standard Reference (7,793 foods) | High | Generic ingredients |
| **Branded** | Packaged products (200,000+) | Medium | Store-bought items |
| **Survey (FNDDS)** | Survey foods | Medium | Restaurant approximations |

**Recommendations**:
- **Generic ingredients**: Use Foundation + SR Legacy (default in existing client)
- **Packaged foods**: Include Branded data type
- **Restaurant dishes**: Limited; better to use component-based estimation

---

## 3. Nutrient Coverage

### Overview

USDA FoodData Central tracks **~150 nutrients** across macros, vitamins, minerals, amino acids, and fatty acids. Of the **52 nutrients** in this tracking system:

- ✅ **45-48 nutrients available** with good coverage
- ⚠️ **4 ultra-trace minerals** (boron, silicon, vanadium, nickel) have **very limited** coverage
- ⚠️ Some **vitamins and omega-3s** may be missing in certain food types

### Complete Nutrient ID Mapping

Below is the mapping of all 52 tracked nutrients to USDA FoodData Central nutrient IDs:

#### ✅ **Available in USDA (45-48 nutrients)**

##### Macros & Energy (8 fields)

| Our Field | USDA ID | USDA Name | Unit | Coverage |
|-----------|---------|-----------|------|----------|
| `energy_kcal` | 1008 | Energy | kcal | ✅ Excellent |
| `protein_g` | 1003 | Protein | g | ✅ Excellent |
| `fat_g` | 1004 | Total lipid (fat) | g | ✅ Excellent |
| `sat_fat_g` | 1258 | Fatty acids, total saturated | g | ✅ Excellent |
| `mufa_g` | 1292 | Fatty acids, total monounsaturated | g | ✅ Very Good |
| `pufa_g` | 1293 | Fatty acids, total polyunsaturated | g | ✅ Very Good |
| `trans_fat_g` | 1257 | Fatty acids, total trans | g | ✅ Very Good |
| `cholesterol_mg` | 1253 | Cholesterol | mg | ✅ Excellent |

##### Carbohydrates (7 fields)

| Our Field | USDA ID | USDA Name | Unit | Coverage |
|-----------|---------|-----------|------|----------|
| `carbs_total_g` | 1005 | Carbohydrate, by difference | g | ✅ Excellent |
| `polyols_g` | 1018 | Sugar alcohols (Erythritol, Sorbitol, etc.) | g | ⚠️ Limited |
| `carbs_available_g` | *Calculated* | (Total - Fiber - Polyols) | g | ✅ Derived |
| `sugar_g` | 2000 | Sugars, total including NLEA | g | ✅ Excellent |
| `fiber_total_g` | 1079 | Fiber, total dietary | g | ✅ Excellent |
| `fiber_soluble_g` | 1082 | Fiber, soluble | g | ⚠️ Limited |
| `fiber_insoluble_g` | 1084 | Fiber, insoluble | g | ⚠️ Limited |

**Note**: `fiber_soluble_g` and `fiber_insoluble_g` are tracked but often missing in USDA data. Most foods only have `fiber_total_g`.

##### Essential Minerals (7 fields)

| Our Field | USDA ID | USDA Name | Unit | Coverage |
|-----------|---------|-----------|------|----------|
| `sodium_mg` | 1093 | Sodium, Na | mg | ✅ Excellent |
| `potassium_mg` | 1092 | Potassium, K | mg | ✅ Excellent |
| `calcium_mg` | 1087 | Calcium, Ca | mg | ✅ Excellent |
| `magnesium_mg` | 1090 | Magnesium, Mg | mg | ✅ Excellent |
| `phosphorus_mg` | 1091 | Phosphorus, P | mg | ✅ Excellent |
| `chloride_mg` | 1088 | Chloride, Cl | mg | ⚠️ Limited |
| `sulfur_g` | 1094 | Sulfur, S | g | ⚠️ Limited |

**Note**: Chloride and sulfur are rarely analyzed; expect zeros in most foods.

##### Trace Minerals (8 fields)

| Our Field | USDA ID | USDA Name | Unit | Coverage |
|-----------|---------|-----------|------|----------|
| `iron_mg` | 1089 | Iron, Fe | mg | ✅ Excellent |
| `zinc_mg` | 1095 | Zinc, Zn | mg | ✅ Excellent |
| `copper_mg` | 1098 | Copper, Cu | mg | ✅ Very Good |
| `manganese_mg` | 1101 | Manganese, Mn | mg | ✅ Very Good |
| `selenium_ug` | 1103 | Selenium, Se | µg | ✅ Very Good |
| `iodine_ug` | 1100 | Iodine, I | µg | ⚠️ Limited* |
| `chromium_ug` | 1096 | Chromium, Cr | µg | ⚠️ Limited |
| `molybdenum_ug` | 1102 | Molybdenum, Mo | µg | ⚠️ Limited |

**Note**: *Iodine data significantly improved in April 2025 with the new USDA/FDA/ODS-NIH Iodine Database for Common Foods.

##### Fat-Soluble Vitamins (4 fields)

| Our Field | USDA ID | USDA Name | Unit | Coverage |
|-----------|---------|-----------|------|----------|
| `vitamin_a_ug` | 1106 | Vitamin A, RAE | µg | ✅ Excellent |
| `vitamin_d_ug` | 1114 | Vitamin D (D2 + D3) | µg | ✅ Very Good |
| `vitamin_e_mg` | 1109 | Vitamin E (alpha-tocopherol) | mg | ✅ Very Good |
| `vitamin_k_ug` | 1185 | Vitamin K (phylloquinone) | µg | ✅ Very Good |

##### B Vitamins (9 fields)

| Our Field | USDA ID | USDA Name | Unit | Coverage |
|-----------|---------|-----------|------|----------|
| `vitamin_b1_mg` | 1165 | Thiamin (B1) | mg | ✅ Excellent |
| `vitamin_b2_mg` | 1166 | Riboflavin (B2) | mg | ✅ Excellent |
| `vitamin_b3_mg` | 1167 | Niacin (B3) | mg | ✅ Excellent |
| `vitamin_b5_mg` | 1170 | Pantothenic acid (B5) | mg | ✅ Very Good |
| `vitamin_b6_mg` | 1175 | Vitamin B-6 (Pyridoxine) | mg | ✅ Excellent |
| `vitamin_b7_ug` | 1176 | Biotin (B7) | µg | ⚠️ Limited |
| `vitamin_b9_ug` | 1190 | Folate, DFE (B9) | µg | ✅ Excellent |
| `vitamin_b12_ug` | 1178 | Vitamin B-12 (Cobalamin) | µg | ✅ Excellent |
| `choline_mg` | 1180 | Choline, total | mg | ✅ Very Good |

##### Water-Soluble Vitamins - Other (1 field)

| Our Field | USDA ID | USDA Name | Unit | Coverage |
|-----------|---------|-----------|------|----------|
| `vitamin_c_mg` | 1162 | Vitamin C, total ascorbic acid | mg | ✅ Excellent |

##### Omega-3 & Omega-6 Fatty Acids (4 fields)

| Our Field | USDA ID | USDA Name | Unit | Coverage |
|-----------|---------|-----------|------|----------|
| `omega3_epa_mg` | 1278 | EPA (20:5 n-3) | mg | ✅ Very Good |
| `omega3_dha_mg` | 1272 | DHA (22:6 n-3) | mg | ✅ Very Good |
| `omega3_ala_g` | 1404 | ALA (18:3 n-3) | g | ✅ Very Good |
| `omega6_la_g` | 1269 | LA (18:2 n-6) | g | ✅ Very Good |

**Note**: Omega-3/6 data excellent for fish, nuts, seeds; limited for processed foods.

#### ❌ **NOT Available in USDA (4 nutrients)**

##### Ultra-Trace Minerals (4 fields)

| Our Field | USDA ID | USDA Name | Unit | Coverage |
|-----------|---------|-----------|------|----------|
| `boron_mg` | N/A | Boron | mg | ❌ None |
| `silicon_mg` | N/A | Silicon | mg | ❌ None |
| `vanadium_ug` | N/A | Vanadium | µg | ❌ None |
| `nickel_ug` | N/A | Nickel | µg | ❌ None |

**Alternative Sources**:
- Academic databases (limited)
- Estimate from food category averages
- Mark as 0 with notes in data bank

---

## 4. Database Structure

### Data Types Explained

USDA FoodData Central consolidates five distinct datasets:

#### **Foundation Foods**
- **Description**: Small dataset of ~600 core commodity foods
- **Quality**: Highest - lab-analyzed with detailed breakdowns
- **Coverage**: Limited to basic ingredients
- **Best For**: Scientific research, nutrient density comparisons
- **Example**: "Chicken, broiler, breast, meat only, raw"

#### **SR Legacy** (Standard Reference)
- **Description**: Legacy database with 7,793 foods
- **Quality**: High - peer-reviewed, decades of data
- **Coverage**: Extensive generic foods
- **Best For**: Generic ingredients, whole foods
- **Example**: "Beef, ground, 85% lean meat / 15% fat, raw"
- **Recommendation**: ✅ **Use as primary source**

#### **Branded Foods**
- **Description**: 200,000+ packaged products
- **Quality**: Medium - from manufacturer labels
- **Coverage**: Very extensive for store-bought items
- **Best For**: Packaged/branded products
- **Example**: "Clif Bar, Chocolate Chip, 68g"
- **Limitation**: Often missing micronutrients beyond label requirements

#### **Survey (FNDDS)** - Food and Nutrient Database for Dietary Studies
- **Description**: Foods from national dietary surveys
- **Quality**: Medium - calculated/estimated
- **Coverage**: Includes some prepared dishes
- **Best For**: Mixed dishes, survey research
- **Example**: "Pizza, cheese, thin crust, frozen, cooked"

#### **Experimental Foods**
- **Description**: Emerging research (e.g., 2025 iodine database)
- **Quality**: High - specific research projects
- **Coverage**: Very limited, specific nutrients
- **Best For**: Niche nutrients (iodine as of April 2025)

### Which Database to Use?

**Recommendation for this project**:

1. **Primary**: Foundation + SR Legacy (already default in client)
   - Best quality-to-coverage ratio
   - Most complete micronutrient data
   - Ideal for ingredient-level estimation

2. **Secondary**: Branded (for packaged foods)
   - Use when tracking store-bought products
   - Beware: often missing vitamins/minerals beyond FDA label requirements

3. **Avoid**: Survey (FNDDS) unless necessary
   - Lower quality for complex dishes
   - Better to use component-based estimation from ESTIMATE.md

### Portion Size Conversions

**USDA Data Format**:
- All nutrient values are per 100g by default
- API responses include `foodPortions` array with common serving sizes

**Handling Portions**:
```python
# USDA returns per 100g, client scales to portion size
usda_value_per_100g = 20.4  # Protein in chicken
serving_grams = 200
scaled_value = usda_value_per_100g * (serving_grams / 100)  # 40.8g
```

**Existing Client** (`scripts/usda/client.py`):
- ✅ Already handles portion scaling
- ✅ Extracts serving size from query (e.g., "200g chicken")
- ✅ Supports g, oz, lb conversions

---

## 5. Alternative Sources

### Comparison Matrix

| Feature | USDA FoodData Central | Nutritionix | EDAMAM | Open Food Facts |
|---------|----------------------|-------------|---------|-----------------|
| **Price** | FREE | $1,850+/mo | $19+/mo | FREE |
| **Foods** | 600,000+ | 1.9M+ | 5M recipes + 1M foods | 2M+ (crowd-sourced) |
| **Quality** | High (govt-backed) | High (RD-verified) | Medium-High | Variable |
| **Micronutrients** | ✅ Excellent (45/52) | ✅ Very Good | ⚠️ Limited | ⚠️ Variable |
| **Natural Language** | Basic | ✅ Advanced (NLP) | ✅ Advanced (NLP) | Basic |
| **Branded Foods** | 200k | 202k restaurants | Limited | 2M+ (labels) |
| **API Limits** | 1,000 req/hr | Varies by plan | 200 searches/min | Unlimited |
| **Attribution** | None | None | ✅ Required | None |
| **Restaurant Items** | ❌ Limited | ✅ Extensive | ⚠️ Some | ❌ Limited |

### Nutritionix API

**Pros**:
- 991,000+ grocery + 202,000+ restaurant items
- Dietitian-verified entries
- Advanced natural language processing
- Based on USDA data, enhanced by in-house RDs

**Cons**:
- **Expensive**: $1,850/month minimum (enterprise)
- Free tier: Only 2 active users/month
- Overkill for ingredient-level tracking

**Use Case**: Best for apps targeting restaurant nutrition tracking or consumer-facing products.

### EDAMAM Nutrition API

**Pros**:
- 5M recipes + 1M foods
- Natural Language Processing
- Good for recipe analysis
- Affordable: $19/month for 200 searches/min

**Cons**:
- Attribution required ("Powered by EDAMAM")
- Less comprehensive micronutrient data than USDA
- More focused on recipes than raw ingredients

**Use Case**: Good for meal planning apps or recipe-based nutrition analysis.

### Open Food Facts

**Pros**:
- FREE, volunteer-run
- 2M+ foods (mostly packaged)
- No API limits
- Great for international products

**Cons**:
- Data quality highly variable
- Often missing micronutrients
- Crowd-sourced (user-submitted)
- Limited validation

**Use Case**: Supplementary source for obscure international products.

### Recommendation

✅ **Primary**: USDA FoodData Central
- Free, high-quality, comprehensive micronutrients
- Already integrated (`scripts/usda/client.py`)

⚠️ **Supplement with**:
- **EDAMAM**: For complex recipes or natural language parsing (if budget allows)
- **Open Food Facts**: For international/obscure packaged items (as fallback)
- **Manual estimation**: For restaurant dishes (use ESTIMATE.md workflow)

---

## 6. Recommended Workflow for API-Based Enrichment

### Phase 1: High-Impact Foods (Priority 1)

**Target**: 20-30 most frequently eaten foods from data bank

**Process**:
1. Review `data/food-data-bank-index.md` to identify common items
2. For each food, check if USDA data available:
   ```bash
   python3 scripts/usda/client.py search "chicken breast"
   python3 scripts/usda/client.py details <fdcId> --json
   ```
3. Map USDA nutrients to 52-field schema
4. Update data bank files with actual values
5. Document in `change_log`: source, FDC ID, date

**Foods to Prioritize**:
- Chicken breast, salmon, eggs (high-frequency proteins)
- Oats, rice, bread (staple carbs)
- Olive oil, avocado (fats)
- Common vegetables (broccoli, spinach, tomatoes)

### Phase 2: Expand Coverage (Priority 2)

**Target**: Remaining generic ingredients (~40-50 foods)

**Process**:
1. Use USDA for all generic ingredients
2. For packaged items:
   - Try USDA Branded database first
   - Fall back to nutrition label data
3. Document confidence level in notes

### Phase 3: Automation Script

**Create**: `scripts/enrich_from_usda.py`

**Features**:
- Read data bank file
- Search USDA for matching food
- Present top 3 matches for user selection
- Auto-populate missing nutrient fields
- Update change_log
- Validate against schema v2

**Pseudo-code**:
```python
from scripts.usda.client import UsdaApiClient

client = UsdaApiClient()

# For each food in data bank with zeros
for food in databank:
    if has_many_zeros(food):
        # Search USDA
        results = client.search_foods(food.name)

        # User selects best match
        fdcId = user_select(results)

        # Get nutrition
        usda_data = client.get_food_details(fdcId)
        nutrients = client.parse_nutrition(usda_data, food.serving_grams)

        # Map all 52 nutrients (including new ones)
        food.update_nutrients(nutrients, source='USDA', fdcId=fdcId)

        # Save with updated change_log
        food.save()
```

### Phase 4: Gradual Enrichment

**Strategy**: Enrich as you eat
- When logging a meal, check if food bank entry has zeros
- If yes, look up USDA data and update
- Gradually improves data quality over time

---

## 7. Limitations & Challenges

### Coverage Gaps

#### ❌ **No Data Available**
- **Ultra-trace minerals**: Boron, Silicon, Vanadium, Nickel
  - **Workaround**: Estimate from literature or mark as 0

#### ⚠️ **Limited Data**
- **Fiber split**: `fiber_soluble_g`, `fiber_insoluble_g`
  - Available for some foods, missing in most
  - **Workaround**: Use `fiber_total_g`, mark split as 0

- **Sugar alcohols** (`polyols_g`)
  - Only tracked in specific products (sugar-free gums, candies)
  - **Workaround**: Assume 0 unless explicitly "sugar-free" product

- **Chloride, Sulfur**
  - Rarely analyzed
  - **Workaround**: Estimate from sodium (chloride) or protein (sulfur)

- **Iodine**
  - Improved in April 2025 but still limited
  - **Workaround**: Focus on known sources (seafood, iodized salt, dairy)

#### ⚠️ **Variable Quality**
- **Omega-3 fatty acids**: Excellent for fish/nuts, poor for processed foods
- **Vitamin content**: Degrades with cooking/storage (USDA is raw values mostly)
- **Biotin (B7)**: Not routinely analyzed

### Restaurant & Prepared Foods

**Challenge**: USDA has limited restaurant-specific data

**Solutions**:
1. **Component-based estimation** (recommended):
   - Break dish into ingredients (e.g., pasta + sauce + chicken)
   - Look up each ingredient in USDA
   - Sum components
   - Adjust for cooking losses (oil absorption, water loss)

2. **Survey data** (less accurate):
   - Use FNDDS for approximations
   - Lower confidence, higher error margin

3. **Nutritionix** (if budget allows):
   - Better restaurant coverage
   - But expensive ($1,850+/month)

### Branded Food Limitations

**Challenge**: Branded foods often missing micronutrients

**Reason**: FDA only requires ~15 nutrients on labels
**Impact**: USDA Branded database has many zeros for vitamins/minerals

**Solution**:
- For packaged items, look up "generic equivalent" in SR Legacy
- Example: "Cheerios" → Search "Oats, dry" in SR Legacy
- Document as "approximation based on SR Legacy"

### Portion Size Complexity

**Challenge**: USDA provides multiple portion definitions

**Example**:
- Chicken breast: "per 100g", "per breast (174g)", "per cup, chopped (140g)"

**Solution**:
- Use 100g as base (already implemented in client)
- Scale to actual portion eaten
- Document portion in `notes`

### Data Freshness

**Challenge**: Nutrient content varies by season, soil, farming method

**USDA Approach**: Averages across samples

**Impact**: ±15-40% variance possible for vitamins/minerals in produce

**Solution**:
- Accept inherent estimation uncertainty
- Document confidence levels
- Focus on long-term averages (weekly/monthly totals)

### Rate Limits

**Challenge**: 1,000 requests/hour = ~16/minute

**Impact**: Enriching 71 foods = 142 requests (search + details) = ~10 minutes

**Best Practices**:
- Cache USDA responses locally
- Batch enrichment sessions
- Add 50-100ms delay between requests
- Avoid bursts

---

## 8. Example Implementation

### Update Existing USDA Client

**File**: `/home/user/nutrition-tracking/scripts/usda/client.py`

**Required Changes**:

1. **Extend NUTRIENT_MAPPING** (add 28 new nutrients):
```python
NUTRIENT_MAPPING = {
    # Existing 23 fields (already mapped)...

    # Add these 28 new fields:
    1091: 'phosphorus_mg',
    1088: 'chloride_mg',
    1094: 'sulfur_g',
    1098: 'copper_mg',
    1103: 'selenium_ug',
    1096: 'chromium_ug',
    1102: 'molybdenum_ug',
    1106: 'vitamin_a_ug',
    1114: 'vitamin_d_ug',
    1109: 'vitamin_e_mg',
    1185: 'vitamin_k_ug',
    1165: 'vitamin_b1_mg',
    1166: 'vitamin_b2_mg',
    1167: 'vitamin_b3_mg',
    1170: 'vitamin_b5_mg',
    1175: 'vitamin_b6_mg',
    1176: 'vitamin_b7_ug',
    1190: 'vitamin_b9_ug',
    1178: 'vitamin_b12_ug',
    1180: 'choline_mg',
    1278: 'omega3_epa_mg',
    1272: 'omega3_dha_mg',
    1404: 'omega3_ala_g',
    1269: 'omega6_la_g',
    # Note: Boron, Silicon, Vanadium, Nickel not in USDA - keep as 0
}
```

2. **Update REQUIRED_FIELDS** (52 total):
```python
REQUIRED_FIELDS = [
    # Existing 24 fields...

    # Add 28 new fields:
    'phosphorus_mg', 'chloride_mg', 'sulfur_g',
    'copper_mg', 'selenium_ug', 'chromium_ug', 'molybdenum_ug',
    'vitamin_a_ug', 'vitamin_d_ug', 'vitamin_e_mg', 'vitamin_k_ug',
    'vitamin_b1_mg', 'vitamin_b2_mg', 'vitamin_b3_mg', 'vitamin_b5_mg',
    'vitamin_b6_mg', 'vitamin_b7_ug', 'vitamin_b9_ug', 'vitamin_b12_ug',
    'choline_mg',
    'omega3_epa_mg', 'omega3_dha_mg', 'omega3_ala_g', 'omega6_la_g',
    'boron_mg', 'silicon_mg', 'vanadium_ug', 'nickel_ug',
]
```

3. **Test**:
```bash
export USDA_API_KEY="your_key"
python3 scripts/usda/test_client.py
```

### Example Enrichment Session

```bash
# 1. Search for food
python3 scripts/usda/client.py search "salmon raw"

# Output:
# 1. Salmon, Atlantic, farmed, raw (FDC ID: 175168)
# 2. Salmon, sockeye, raw (FDC ID: 175171)
# 3. Salmon, coho, wild, raw (FDC ID: 173686)

# 2. Get full nutrition
python3 scripts/usda/client.py details 175168 --json > /tmp/salmon_usda.json

# 3. Review and manually update data bank file
# data/food-data-bank/generic/ingredients/salmon_raw_150g_v1.md
# - Copy nutrient values
# - Add to change_log: source='USDA FDC', fdc_id=175168
# - Update schema_version: 2

# 4. Validate
python3 scripts/validate_data_bank.py
```

---

## 9. Next Steps

### Immediate (Week 1)
1. ✅ Research complete (this document)
2. ⬜ Extend `scripts/usda/client.py` with 28 new nutrient IDs
3. ⬜ Test updated client with diverse foods
4. ⬜ Document nutrient ID mapping reference

### Short-term (Weeks 2-4)
1. ⬜ Enrich top 20 high-frequency foods manually
2. ⬜ Create `scripts/enrich_from_usda.py` automation script
3. ⬜ Update ESTIMATE.md with USDA workflow guidance

### Long-term (Ongoing)
1. ⬜ Gradual enrichment: add USDA data as you log meals
2. ⬜ Document confidence levels per nutrient per food
3. ⬜ Consider Open Food Facts for international items
4. ⬜ Evaluate EDAMAM for recipe-level analysis (if budget)

---

## 10. Conclusion

The USDA FoodData Central API is an **excellent free resource** for enriching this nutrition tracking system. With **45-48 of 52 nutrients available**, comprehensive coverage of generic foods, and generous rate limits, it should be the primary data source for API-based enrichment.

**Key Takeaways**:
- ✅ Free, reliable, government-backed
- ✅ Already integrated (`scripts/usda/client.py`)
- ✅ Excellent micronutrient coverage (vitamins, minerals, fatty acids)
- ⚠️ Limited: ultra-trace minerals, restaurant foods, some fiber split data
- 🔧 Action: Extend client with 28 new nutrient IDs → start enriching

**Estimated effort to extend client**: 1-2 hours
**Estimated effort to enrich 71 foods**: 10-20 hours (depends on manual review)

---

## Appendix A: USDA Nutrient ID Quick Reference

### Macros
- 1008: Energy (kcal)
- 1003: Protein (g)
- 1004: Fat, total (g)
- 1005: Carbs, total (g)
- 1258: Saturated fat (g)
- 1292: MUFA (g)
- 1293: PUFA (g)
- 1257: Trans fat (g)
- 1253: Cholesterol (mg)
- 2000: Sugars, total (g)
- 1079: Fiber, total (g)
- 1082: Fiber, soluble (g)
- 1084: Fiber, insoluble (g)
- 1018: Polyols/sugar alcohols (g)

### Minerals (Major)
- 1093: Sodium (mg)
- 1092: Potassium (mg)
- 1087: Calcium (mg)
- 1090: Magnesium (mg)
- 1091: Phosphorus (mg)
- 1088: Chloride (mg)
- 1094: Sulfur (g)

### Minerals (Trace)
- 1089: Iron (mg)
- 1095: Zinc (mg)
- 1098: Copper (mg)
- 1101: Manganese (mg)
- 1103: Selenium (µg)
- 1100: Iodine (µg)
- 1096: Chromium (µg)
- 1102: Molybdenum (µg)

### Vitamins (Fat-Soluble)
- 1106: Vitamin A, RAE (µg)
- 1114: Vitamin D (D2+D3) (µg)
- 1109: Vitamin E (mg)
- 1185: Vitamin K (µg)

### Vitamins (B-Complex)
- 1165: Vitamin B1 / Thiamin (mg)
- 1166: Vitamin B2 / Riboflavin (mg)
- 1167: Vitamin B3 / Niacin (mg)
- 1170: Vitamin B5 / Pantothenic acid (mg)
- 1175: Vitamin B6 / Pyridoxine (mg)
- 1176: Vitamin B7 / Biotin (µg)
- 1190: Vitamin B9 / Folate, DFE (µg)
- 1178: Vitamin B12 / Cobalamin (µg)
- 1180: Choline (mg)

### Vitamins (Water-Soluble - Other)
- 1162: Vitamin C (mg)

### Fatty Acids (Omega-3 & Omega-6)
- 1278: EPA (20:5 n-3) (mg)
- 1272: DHA (22:6 n-3) (mg)
- 1404: ALA (18:3 n-3) (g)
- 1269: LA (18:2 n-6) (g)

### NOT in USDA
- Boron (mg) - Not tracked
- Silicon (mg) - Not tracked
- Vanadium (µg) - Not tracked
- Nickel (µg) - Not tracked

---

## Appendix B: References

- **USDA FoodData Central**: https://fdc.nal.usda.gov/
- **API Guide**: https://fdc.nal.usda.gov/api-guide/
- **API Spec**: https://fdc.nal.usda.gov/api-spec/fdc_api.html
- **API Key Signup**: https://fdc.nal.usda.gov/api-key-signup.html
- **Download Datasets**: https://fdc.nal.usda.gov/download-datasets/
- **Nutrient Lists (SR Legacy)**: https://www.nal.usda.gov/human-nutrition-and-food-safety/nutrient-lists-standard-reference-legacy-2018
- **Iodine Database (2025)**: https://fdc.nal.usda.gov/ (Experimental Foods)

**Alternative APIs**:
- **Nutritionix**: https://www.nutritionix.com/business/api
- **EDAMAM**: https://www.edamam.com
- **Open Food Facts**: https://world.openfoodfacts.org/data

**Existing Implementation**:
- **USDA Client**: `/home/user/nutrition-tracking/scripts/usda/client.py`
- **Test Script**: `/home/user/nutrition-tracking/scripts/usda/test_client.py`
- **README**: `/home/user/nutrition-tracking/scripts/usda/README.md`

---

**Document Version**: 1.0
**Last Updated**: 2025-11-05
**Author**: Claude (Sonnet 4.5)
**Status**: Complete
