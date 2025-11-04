#!/usr/bin/env python3
"""
USDA FoodData Central API Client

Provides easy access to 600,000+ food items with complete nutritional profiles.
"""

import os
import sys
import json
import requests
from typing import Dict, List, Optional
from pathlib import Path


class UsdaApiClient:
    """Client for USDA FoodData Central API"""

    BASE_URL = "https://api.nal.usda.gov/fdc/v1"

    # Nutrient ID to field name mapping (USDA uses numeric IDs)
    NUTRIENT_MAPPING = {
        1008: 'energy_kcal',
        1003: 'protein_g',
        1004: 'fat_g',
        1258: 'sat_fat_g',
        1292: 'mufa_g',
        1293: 'pufa_g',
        1257: 'trans_fat_g',
        1253: 'cholesterol_mg',
        2000: 'sugar_g',
        1079: 'fiber_total_g',
        1082: 'fiber_soluble_g',
        1084: 'fiber_insoluble_g',
        1005: 'carbs_total_g',
        1093: 'sodium_mg',
        1092: 'potassium_mg',
        1100: 'iodine_ug',
        1090: 'magnesium_mg',
        1087: 'calcium_mg',
        1089: 'iron_mg',
        1095: 'zinc_mg',
        1162: 'vitamin_c_mg',
        1101: 'manganese_mg',
    }

    # Required fields for our nutrition schema (all 24 fields)
    REQUIRED_FIELDS = [
        'energy_kcal', 'protein_g', 'fat_g', 'sat_fat_g', 'mufa_g', 'pufa_g',
        'trans_fat_g', 'cholesterol_mg', 'sugar_g', 'fiber_total_g',
        'fiber_soluble_g', 'fiber_insoluble_g', 'carbs_total_g',
        'carbs_available_g', 'sodium_mg', 'potassium_mg', 'iodine_ug',
        'magnesium_mg', 'calcium_mg', 'iron_mg', 'zinc_mg', 'vitamin_c_mg',
        'manganese_mg', 'polyols_g'
    ]

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize USDA API client

        Args:
            api_key: USDA API key. If None, will look for USDA_API_KEY env var
        """
        self.api_key = api_key or os.environ.get('USDA_API_KEY')
        if not self.api_key:
            raise ValueError(
                "USDA API key required. Set USDA_API_KEY environment variable "
                "or pass api_key parameter. Get a free key at: "
                "https://fdc.nal.usda.gov/api-key-signup.html"
            )

    def search_foods(self, query: str, page_size: int = 25,
                     data_types: List[str] = None) -> List[Dict]:
        """
        Search for foods by query string

        Args:
            query: Search term (e.g., "chicken breast")
            page_size: Number of results to return (default: 25)
            data_types: USDA data types to search. Default: Foundation, SR Legacy

        Returns:
            List of food items with basic info
        """
        if data_types is None:
            data_types = ['Foundation', 'SR Legacy']

        params = {
            'api_key': self.api_key,
            'query': query,
            'dataType': ','.join(data_types),
            'pageSize': page_size,
        }

        try:
            response = requests.get(f"{self.BASE_URL}/foods/search", params=params)
            response.raise_for_status()
            data = response.json()

            # Validate response structure
            if not isinstance(data, dict):
                print(f"Error: Invalid response format (expected dict, got {type(data).__name__})", file=sys.stderr)
                return []

            foods = data.get('foods', [])
            if not isinstance(foods, list):
                print(f"Error: Invalid 'foods' format (expected list, got {type(foods).__name__})", file=sys.stderr)
                return []

            return foods
        except requests.exceptions.RequestException as e:
            print(f"Error searching USDA database: {e}", file=sys.stderr)
            return []
        except (ValueError, KeyError) as e:
            print(f"Error parsing USDA response: {e}", file=sys.stderr)
            return []

    def get_food_details(self, fdc_id: int) -> Optional[Dict]:
        """
        Get detailed nutrition information for a specific food

        Args:
            fdc_id: FoodData Central ID

        Returns:
            Detailed food information including all nutrients
        """
        params = {'api_key': self.api_key}

        try:
            response = requests.get(f"{self.BASE_URL}/food/{fdc_id}", params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error getting food details: {e}", file=sys.stderr)
            return None

    def parse_nutrition(self, usda_food: Dict, serving_grams: float = 100) -> Dict:
        """
        Parse USDA nutrition data into our standard format

        Args:
            usda_food: USDA food object from get_food_details()
            serving_grams: Serving size in grams (default: 100g)

        Returns:
            Dictionary with standardized nutrition fields (per_portion format)
        """
        nutrients = {}

        # Extract nutrients from USDA data
        if 'foodNutrients' in usda_food:
            for nutrient in usda_food['foodNutrients']:
                nutrient_id = nutrient.get('nutrient', {}).get('id') or nutrient.get('nutrientId')
                if nutrient_id in self.NUTRIENT_MAPPING:
                    field_name = self.NUTRIENT_MAPPING[nutrient_id]
                    # USDA data is per 100g, scale to serving size
                    value = nutrient.get('amount', 0)
                    scaled_value = value * (serving_grams / 100)
                    nutrients[field_name] = round(scaled_value, 2)

        # Fill in missing required fields with 0
        for field in self.REQUIRED_FIELDS:
            if field not in nutrients:
                nutrients[field] = 0

        # Calculate derived fields
        # carbs_available = carbs_total - fiber - polyols
        if nutrients.get('carbs_available_g') == 0:
            nutrients['carbs_available_g'] = max(0, round(
                nutrients.get('carbs_total_g', 0) -
                nutrients.get('fiber_total_g', 0) -
                nutrients.get('polyols_g', 0), 2
            ))

        return nutrients

    def quick_lookup(self, query: str) -> Optional[Dict]:
        """
        Quick lookup: search and return best match with nutrition data

        Args:
            query: Food description (e.g., "200g chicken breast grilled")

        Returns:
            Dict with food name, serving info, and complete nutrition data
        """
        # Extract quantity and unit if present
        serving_grams = self._extract_serving_size(query)

        # Search for food
        results = self.search_foods(query, page_size=5)

        if not results:
            return None

        # Get best match (first result is usually most relevant)
        best_match = results[0]
        fdc_id = best_match.get('fdcId')

        # Validate fdcId exists and is valid
        if not fdc_id or not isinstance(fdc_id, (int, str)):
            print(f"Error: Invalid or missing fdcId in search result", file=sys.stderr)
            return None

        # Get detailed nutrition data
        details = self.get_food_details(fdc_id)
        if not details:
            return None

        # Parse nutrition
        nutrition = self.parse_nutrition(details, serving_grams)

        return {
            'success': True,
            'food_name': best_match.get('description', 'Unknown food'),
            'fdc_id': fdc_id,
            'serving_grams': serving_grams,
            'per_portion': nutrition,
            'source': 'USDA FoodData Central',
            'confidence': 'high',
            'data_type': best_match.get('dataType', 'Unknown'),
        }

    def _extract_serving_size(self, query: str) -> float:
        """
        Extract serving size from query string

        Args:
            query: Food description (e.g., "200g chicken breast")

        Returns:
            Serving size in grams (default: 100g)
        """
        import re

        # Match patterns like "200g", "2.5 oz", "1 lb"
        patterns = [
            (r'(\d+\.?\d*)\s*g(?:rams?)?', 1.0),  # grams
            (r'(\d+\.?\d*)\s*oz(?:unces?)?', 28.35),  # ounces to grams
            (r'(\d+\.?\d*)\s*(?:lbs?|pounds?)', 453.592),  # pounds to grams
        ]

        for pattern, multiplier in patterns:
            match = re.search(pattern, query, re.IGNORECASE)
            if match:
                amount = float(match.group(1))
                return round(amount * multiplier, 1)

        # Default to 100g if no serving size specified
        return 100.0

    def format_nutrition_summary(self, nutrition: Dict, food_name: str = "") -> str:
        """
        Format nutrition data as human-readable summary

        Args:
            nutrition: Nutrition data dictionary
            food_name: Name of the food (optional)

        Returns:
            Formatted string with nutrition information
        """
        lines = []
        if food_name:
            lines.append(f"\n{food_name}")
            lines.append("=" * len(food_name))

        # Macros
        lines.append(f"\nEnergy: {nutrition.get('energy_kcal', 0):.0f} kcal")
        lines.append(f"Protein: {nutrition.get('protein_g', 0):.1f}g")
        lines.append(f"Fat: {nutrition.get('fat_g', 0):.1f}g")
        lines.append(f"  - Saturated: {nutrition.get('sat_fat_g', 0):.1f}g")
        lines.append(f"  - Monounsaturated: {nutrition.get('mufa_g', 0):.1f}g")
        lines.append(f"  - Polyunsaturated: {nutrition.get('pufa_g', 0):.1f}g")
        lines.append(f"  - Trans: {nutrition.get('trans_fat_g', 0):.1f}g")
        lines.append(f"Carbs (total): {nutrition.get('carbs_total_g', 0):.1f}g")
        lines.append(f"  - Available: {nutrition.get('carbs_available_g', 0):.1f}g")
        lines.append(f"  - Sugar: {nutrition.get('sugar_g', 0):.1f}g")
        lines.append(f"  - Fiber: {nutrition.get('fiber_total_g', 0):.1f}g")

        # Key micronutrients
        lines.append(f"\nKey Micronutrients:")
        lines.append(f"Sodium: {nutrition.get('sodium_mg', 0):.0f}mg")
        lines.append(f"Potassium: {nutrition.get('potassium_mg', 0):.0f}mg")
        lines.append(f"Calcium: {nutrition.get('calcium_mg', 0):.0f}mg")
        lines.append(f"Iron: {nutrition.get('iron_mg', 0):.1f}mg")
        lines.append(f"Magnesium: {nutrition.get('magnesium_mg', 0):.0f}mg")
        lines.append(f"Zinc: {nutrition.get('zinc_mg', 0):.1f}mg")
        lines.append(f"Vitamin C: {nutrition.get('vitamin_c_mg', 0):.1f}mg")

        return "\n".join(lines)


def main():
    """Command-line interface for USDA API client"""
    import argparse

    parser = argparse.ArgumentParser(
        description='USDA FoodData Central API Client',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Search for chicken breast
  python scripts/usda/client.py search "chicken breast"

  # Get detailed info for specific food (FDC ID)
  python scripts/usda/client.py details 171477

  # Quick lookup with serving size
  python scripts/usda/client.py lookup "200g grilled chicken breast"

  # Get nutrition data as JSON
  python scripts/usda/client.py lookup "2 eggs scrambled" --json
        """
    )

    parser.add_argument('command', choices=['search', 'details', 'lookup'],
                        help='Command to execute')
    parser.add_argument('query', help='Search query or FDC ID')
    parser.add_argument('--json', action='store_true',
                        help='Output as JSON')
    parser.add_argument('--api-key', help='USDA API key (or set USDA_API_KEY env var)')

    args = parser.parse_args()

    try:
        client = UsdaApiClient(api_key=args.api_key)

        if args.command == 'search':
            results = client.search_foods(args.query)
            if args.json:
                print(json.dumps(results, indent=2))
            else:
                print(f"\nFound {len(results)} results for '{args.query}':\n")
                for i, food in enumerate(results[:10], 1):
                    print(f"{i}. {food.get('description')} (FDC ID: {food.get('fdcId')})")
                    print(f"   Type: {food.get('dataType')}")
                    print()

        elif args.command == 'details':
            fdc_id = int(args.query)
            details = client.get_food_details(fdc_id)
            if args.json:
                print(json.dumps(details, indent=2))
            else:
                if details:
                    nutrition = client.parse_nutrition(details)
                    summary = client.format_nutrition_summary(
                        nutrition,
                        details.get('description', '')
                    )
                    print(summary)
                else:
                    print("Food not found")

        elif args.command == 'lookup':
            result = client.quick_lookup(args.query)
            if args.json:
                print(json.dumps(result, indent=2))
            else:
                if result:
                    print(f"\nServing: {result['serving_grams']}g")
                    print(f"Source: {result['source']} (FDC ID: {result['fdc_id']})")
                    print(f"Confidence: {result['confidence']}")
                    summary = client.format_nutrition_summary(
                        result['per_portion'],
                        result['food_name']
                    )
                    print(summary)
                else:
                    print("No results found")

    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nAborted")
        sys.exit(0)


if __name__ == '__main__':
    main()
