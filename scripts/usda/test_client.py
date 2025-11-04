#!/usr/bin/env python3
"""
Test script for USDA API client

Run this after setting your USDA_API_KEY to verify everything works.
"""

import sys
from pathlib import Path

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.usda.client import UsdaApiClient


def test_basic_search():
    """Test basic search functionality"""
    print("Test 1: Basic Search")
    print("-" * 50)

    try:
        client = UsdaApiClient()
        results = client.search_foods("chicken breast", page_size=3)

        print(f"✓ Search successful! Found {len(results)} results:")
        for i, food in enumerate(results, 1):
            print(f"  {i}. {food.get('description')} (FDC ID: {food.get('fdcId')})")
        print()
        return True

    except Exception as e:
        print(f"✗ Search failed: {e}")
        print()
        return False


def test_detailed_lookup():
    """Test detailed nutrition lookup"""
    print("Test 2: Detailed Nutrition Lookup")
    print("-" * 50)

    try:
        client = UsdaApiClient()
        # FDC ID 171477 is "Chicken, broilers or fryers, breast, meat only, cooked, roasted"
        details = client.get_food_details(171477)

        if details:
            nutrition = client.parse_nutrition(details, serving_grams=100)
            print(f"✓ Lookup successful for: {details.get('description')}")
            print(f"  Energy: {nutrition['energy_kcal']} kcal")
            print(f"  Protein: {nutrition['protein_g']}g")
            print(f"  Fat: {nutrition['fat_g']}g")
            print(f"  Carbs: {nutrition['carbs_total_g']}g")
            print()
            return True
        else:
            print("✗ Failed to get food details")
            print()
            return False

    except Exception as e:
        print(f"✗ Lookup failed: {e}")
        print()
        return False


def test_quick_lookup():
    """Test quick lookup with serving size"""
    print("Test 3: Quick Lookup with Serving Size")
    print("-" * 50)

    try:
        client = UsdaApiClient()
        result = client.quick_lookup("200g grilled chicken breast")

        if result and result.get('success'):
            print(f"✓ Quick lookup successful!")
            print(f"  Food: {result['food_name']}")
            print(f"  Serving: {result['serving_grams']}g")
            print(f"  Energy: {result['per_portion']['energy_kcal']} kcal")
            print(f"  Protein: {result['per_portion']['protein_g']}g")
            print(f"  Source: {result['source']}")
            print(f"  Confidence: {result['confidence']}")
            print()
            return True
        else:
            print("✗ Quick lookup failed")
            print()
            return False

    except Exception as e:
        print(f"✗ Quick lookup failed: {e}")
        print()
        return False


def test_all_required_fields():
    """Test that all 24 required fields are present"""
    print("Test 4: All Required Fields Present")
    print("-" * 50)

    try:
        client = UsdaApiClient()
        result = client.quick_lookup("banana")

        if not result or not result.get('success'):
            print("✗ Lookup failed")
            print()
            return False

        nutrition = result['per_portion']
        required_fields = client.REQUIRED_FIELDS
        missing_fields = [f for f in required_fields if f not in nutrition]

        if missing_fields:
            print(f"✗ Missing required fields: {', '.join(missing_fields)}")
            print()
            return False
        else:
            print(f"✓ All {len(required_fields)} required fields present!")
            print(f"  Fields: {', '.join(required_fields[:5])}...")
            print()
            return True

    except Exception as e:
        print(f"✗ Test failed: {e}")
        print()
        return False


def main():
    """Run all tests"""
    print("\n" + "=" * 50)
    print("USDA API Client Test Suite")
    print("=" * 50 + "\n")

    # Check API key is set
    import os
    if not os.environ.get('USDA_API_KEY'):
        print("❌ USDA_API_KEY environment variable not set!")
        print("\nPlease set your API key:")
        print("  export USDA_API_KEY='your_key_here'")
        print("\nOr create config.sh:")
        print("  cd scripts/usda")
        print("  cp config.example.sh config.sh")
        print("  # Edit config.sh with your key")
        print("  source config.sh")
        print("\nGet a free API key at:")
        print("  https://fdc.nal.usda.gov/api-key-signup.html\n")
        sys.exit(1)

    print(f"✓ API key is set (starts with: {os.environ['USDA_API_KEY'][:4]}...)\n")

    # Run tests
    tests = [
        test_basic_search,
        test_detailed_lookup,
        test_quick_lookup,
        test_all_required_fields,
    ]

    results = []
    for test_func in tests:
        results.append(test_func())

    # Summary
    print("=" * 50)
    print("Test Summary")
    print("=" * 50)
    passed = sum(results)
    total = len(results)
    print(f"\nPassed: {passed}/{total} tests")

    if passed == total:
        print("\n✅ All tests passed! USDA API client is ready to use.\n")
        print("Quick start:")
        print("  python3 scripts/usda/client.py lookup '200g chicken breast'")
        print("  python3 scripts/usda/client.py search 'salmon'")
        print("\nSee scripts/usda/README.md for full documentation.\n")
        sys.exit(0)
    else:
        print(f"\n❌ {total - passed} test(s) failed. Please check your API key and network connection.\n")
        sys.exit(1)


if __name__ == '__main__':
    main()
