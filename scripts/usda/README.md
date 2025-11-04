# USDA FoodData Central API Client

Easy access to 600,000+ food items with complete nutritional profiles from the USDA database.

## Quick Start

### 1. Get Your API Key (Free, takes 5 minutes)

1. Visit: https://fdc.nal.usda.gov/api-key-signup.html
2. Fill out the form:
   - **Name**: Your name
   - **Email**: Your email
   - **Organization**: Personal / Individual
   - **Intended Use**: "Personal nutrition tracking"
3. Submit and check your email for the API key

### 2. Configure API Key

**Option A: Environment Variable** (Recommended)

```bash
export USDA_API_KEY="your_api_key_here"
```

Or add to your `.bashrc`/`.zshrc`:

```bash
echo 'export USDA_API_KEY="your_api_key_here"' >> ~/.bashrc
source ~/.bashrc
```

**Option B: Config File**

```bash
cd scripts/usda
cp config.example.sh config.sh
# Edit config.sh and add your API key
source config.sh
```

### 3. Test It

```bash
# Search for a food
python3 scripts/usda/client.py search "chicken breast"

# Quick lookup with serving size
python3 scripts/usda/client.py lookup "200g grilled chicken breast"
```

## Usage

### Search for Foods

```bash
python3 scripts/usda/client.py search "salmon"
```

Output:
```
Found 25 results for 'salmon':

1. Salmon, Atlantic, farmed, raw (FDC ID: 175168)
   Type: SR Legacy

2. Salmon, sockeye, raw (FDC ID: 175171)
   Type: SR Legacy
...
```

### Get Detailed Nutrition (by FDC ID)

```bash
python3 scripts/usda/client.py details 175168
```

Output:
```
Salmon, Atlantic, farmed, raw
================================

Energy: 206 kcal
Protein: 20.4g
Fat: 13.4g
  - Saturated: 3.1g
  - Monounsaturated: 4.2g
  - Polyunsaturated: 4.4g
  - Trans: 0.0g
Carbs (total): 0.0g
  - Available: 0.0g
  - Sugar: 0.0g
  - Fiber: 0.0g

Key Micronutrients:
Sodium: 59mg
Potassium: 363mg
Calcium: 9mg
Iron: 0.3mg
...
```

### Quick Lookup (Smart Serving Size Detection)

```bash
python3 scripts/usda/client.py lookup "200g grilled chicken breast"
```

Automatically detects:
- Serving size: `200g` (supports g, oz, lb)
- Food item: "chicken breast"
- Cooking method: "grilled" (searches for cooked versions)

Output includes complete nutrition data scaled to your serving size.

### JSON Output (for scripting)

```bash
python3 scripts/usda/client.py lookup "2 eggs scrambled" --json
```

Returns JSON with all 24 required nutrition fields:

```json
{
  "success": true,
  "food_name": "Egg, whole, cooked, scrambled",
  "fdc_id": 173424,
  "serving_grams": 100.0,
  "per_portion": {
    "energy_kcal": 149,
    "protein_g": 9.99,
    "fat_g": 10.98,
    "sat_fat_g": 3.29,
    ...
  },
  "source": "USDA FoodData Central",
  "confidence": "high"
}
```

## Python API Usage

```python
from scripts.usda.client import UsdaApiClient

# Initialize client (uses USDA_API_KEY env var)
client = UsdaApiClient()

# Or pass API key directly
client = UsdaApiClient(api_key="your_key")

# Quick lookup
result = client.quick_lookup("200g grilled chicken breast")

if result:
    print(f"Food: {result['food_name']}")
    print(f"Energy: {result['per_portion']['energy_kcal']} kcal")
    print(f"Protein: {result['per_portion']['protein_g']}g")

# Search for foods
results = client.search_foods("banana")
for food in results[:5]:
    print(f"{food['description']} (FDC ID: {food['fdcId']})")

# Get detailed info
details = client.get_food_details(fdc_id=173424)
nutrition = client.parse_nutrition(details, serving_grams=200)
```

## Features

- ✅ **600,000+ foods** from USDA database
- ✅ **Complete nutrition profiles** (all 24 required fields)
- ✅ **Smart serving size detection** (g, oz, lb)
- ✅ **High confidence data** (validated by USDA)
- ✅ **FREE** (no usage limits)
- ✅ **JSON output** for automation
- ✅ **CLI and Python API**

## Coverage

**Best Coverage**:
- Generic ingredients (chicken, beef, fish, vegetables, fruits, grains)
- Packaged foods with barcodes
- Basic prepared foods (scrambled eggs, grilled meats)

**Limited Coverage**:
- Restaurant-specific dishes (use estimation methods from ESTIMATE.md)
- Complex meals (use component-based estimation)
- Regional/international specialty foods

## Integration with Nutrition Tracker

This client is designed to work seamlessly with the nutrition tracking workflow:

### During Estimation (SKILL.md Step 1)

When estimating nutrition for generic ingredients:

```bash
# Check USDA first for generic foods
python3 scripts/usda/client.py lookup "200g chicken breast" --json > /tmp/nutrition.json
```

### Direct Use in Python Scripts

```python
from scripts.usda.client import UsdaApiClient

client = UsdaApiClient()

# Lookup food
result = client.quick_lookup("oats 50g")

# Use the nutrition data
nutrition_data = result['per_portion']
# nutrition_data now has all 24 required fields
```

## Troubleshooting

### "USDA API key required" Error

**Solution**: Set the environment variable:
```bash
export USDA_API_KEY="your_key_here"
```

Or pass it directly:
```bash
python3 scripts/usda/client.py --api-key "your_key" lookup "chicken"
```

### No Results Found

**Solutions**:
1. Try simpler search terms (e.g., "chicken" instead of "organic free-range chicken breast")
2. Check spelling
3. Try alternative names (e.g., "sweet potato" vs "yam")
4. Use data types filter for more results

### Rate Limiting

USDA API has no documented rate limits for personal use. However, be reasonable:
- Don't make more than 1-2 requests per second
- Cache results for repeated lookups

### Missing Nutrients

Some foods in the USDA database don't have complete micronutrient data. The client will:
- Fill missing fields with `0`
- Mark confidence as appropriate
- You may need to estimate missing nutrients manually

## Data Types

USDA provides several data types with different quality levels:

| Type | Description | Quality | Coverage |
|------|-------------|---------|----------|
| **Foundation** | Lab-analyzed foods | Highest | Limited |
| **SR Legacy** | Standard Reference database | High | Extensive |
| **Branded** | Packaged food products | Medium | Very extensive |
| **Survey (FNDDS)** | Survey foods | Medium | Moderate |

This client defaults to **Foundation** and **SR Legacy** for highest quality data.

## API Reference

### `UsdaApiClient`

#### `search_foods(query, page_size=25, data_types=None)`
Search for foods by query string.

**Parameters**:
- `query` (str): Search term
- `page_size` (int): Number of results (default: 25, max: 200)
- `data_types` (List[str]): Data types to search (default: ['Foundation', 'SR Legacy'])

**Returns**: List of food items with basic info

#### `get_food_details(fdc_id)`
Get detailed nutrition for a specific food by FDC ID.

**Parameters**:
- `fdc_id` (int): FoodData Central ID

**Returns**: Dict with complete food information

#### `parse_nutrition(usda_food, serving_grams=100)`
Convert USDA nutrition data to our standard format.

**Parameters**:
- `usda_food` (Dict): USDA food object from `get_food_details()`
- `serving_grams` (float): Serving size in grams

**Returns**: Dict with all 24 required nutrition fields

#### `quick_lookup(query)`
One-step search, retrieve, and parse nutrition data.

**Parameters**:
- `query` (str): Food description with optional serving size

**Returns**: Dict with food name, serving info, and complete nutrition data

## Links

- **USDA API Documentation**: https://fdc.nal.usda.gov/api-guide.html
- **Get API Key**: https://fdc.nal.usda.gov/api-key-signup.html
- **Food Database Search**: https://fdc.nal.usda.gov/ (web interface)

## Support

For issues with the USDA API client, check:
1. API key is set correctly
2. USDA API service status: https://fdc.nal.usda.gov/
3. Try the direct API in your browser: `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=YOUR_KEY&query=chicken`
