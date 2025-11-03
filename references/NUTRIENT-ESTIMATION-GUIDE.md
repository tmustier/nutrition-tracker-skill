# Nutrient Estimation Guide

## Core Principle

**Never use null. Always estimate with documented confidence.**

- `0` = TRUE ZERO (scientifically impossible, e.g., cholesterol in plants, fiber in animal products, B12 in unfortified plants)
- All other values = actual measurement or estimate

## Estimation Process

1. **Search USDA FoodData Central** for closest match
2. **Scale to portion weight** (USDA values are per 100g)
3. **Document source and confidence** in `assumptions` field if non-obvious
4. **Validate energy**: 4P + 9F + 4C_avail + 2fiber + 2.4polyols

## Confidence Levels

- **HIGH** (±5-15%): USDA direct match, nutrition label
- **MEDIUM** (±20-40%): USDA proxy, component calculation, UK dairy iodine
- **LOW** (±50-100%): category average, soil-dependent nutrients

## UK-Specific Note

**Iodine in dairy**: UK cattle feed is fortified, resulting in 2-3× higher iodine than EU. UK dairy is MEDIUM-HIGH confidence for iodine estimates.

## TRUE ZEROS

No estimation needed when value is scientifically zero:
- Cholesterol: plant foods
- B12: unfortified plant foods
- Fiber: pure animal products
- Iodine: pure oils/fats
