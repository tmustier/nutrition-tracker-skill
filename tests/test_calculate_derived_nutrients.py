#!/usr/bin/env python3
"""
Unit tests for calculate_derived_nutrients.py

Tests the core calculation functions and category inference logic.
"""

import unittest
from pathlib import Path
import sys

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from calculate_derived_nutrients import calculate_chloride, calculate_sulfur, infer_food_category


class TestChlorideCalculation(unittest.TestCase):
    """Test chloride calculation from sodium."""

    def test_zero_sodium(self):
        """Zero sodium should give zero chloride."""
        self.assertEqual(calculate_chloride(0), 0)

    def test_basic_calculation(self):
        """Test basic NaCl stoichiometry (×1.54)."""
        # 100mg sodium → 154mg chloride
        self.assertEqual(calculate_chloride(100), 154)

    def test_typical_values(self):
        """Test realistic sodium values."""
        # Typical restaurant dish: 800mg sodium
        self.assertEqual(calculate_chloride(800), 1232)

        # Low-sodium food: 50mg sodium
        self.assertEqual(calculate_chloride(50), 77)

        # High-sodium food: 1500mg sodium
        self.assertEqual(calculate_chloride(1500), 2310)

    def test_rounding(self):
        """Chloride should be rounded to nearest integer."""
        # 1mg sodium → 1.54mg chloride → rounds to 2mg
        self.assertEqual(calculate_chloride(1), 2)

        # 1000mg sodium → 1540mg chloride (exact)
        self.assertEqual(calculate_chloride(1000), 1540)


class TestSulfurCalculation(unittest.TestCase):
    """Test sulfur calculation from protein."""

    def test_zero_protein(self):
        """Zero protein should give zero sulfur."""
        self.assertEqual(calculate_sulfur(0, 'meat'), 0)
        self.assertEqual(calculate_sulfur(0, 'plant'), 0)

    def test_animal_products(self):
        """Animal products use 1% factor."""
        # 10g protein → 0.1g sulfur
        self.assertEqual(calculate_sulfur(10, 'meat'), 0.1)
        self.assertEqual(calculate_sulfur(10, 'fish'), 0.1)
        self.assertEqual(calculate_sulfur(10, 'eggs'), 0.1)
        self.assertEqual(calculate_sulfur(10, 'dairy'), 0.1)
        self.assertEqual(calculate_sulfur(10, 'whey'), 0.1)

    def test_plant_products(self):
        """Plant products use 0.4% factor."""
        # 10g protein → 0.04g sulfur
        self.assertEqual(calculate_sulfur(10, 'plant'), 0.04)
        self.assertEqual(calculate_sulfur(10, 'grains'), 0.04)
        self.assertEqual(calculate_sulfur(10, 'vegetables'), 0.04)

    def test_typical_values(self):
        """Test realistic protein values."""
        # Chicken breast: 30g protein (animal)
        self.assertEqual(calculate_sulfur(30, 'meat'), 0.3)

        # Tofu: 15g protein (plant)
        self.assertEqual(calculate_sulfur(15, 'plant'), 0.06)

        # Salmon: 25g protein (fish)
        self.assertEqual(calculate_sulfur(25, 'fish'), 0.25)

    def test_rounding(self):
        """Sulfur should be rounded to 3 decimal places."""
        # 8.5g protein (plant) → 0.034g sulfur
        self.assertEqual(calculate_sulfur(8.5, 'plant'), 0.034)

        # 5.5g protein (animal) → 0.055g sulfur
        self.assertEqual(calculate_sulfur(5.5, 'meat'), 0.055)


class TestCategoryInference(unittest.TestCase):
    """Test food category inference from file paths."""

    def test_meat_detection(self):
        """Test meat category detection."""
        path = Path('data/food-data-bank/venues/zima/beef_stroganoff.md')
        data = {'id': 'beef_stroganoff_v1'}
        self.assertEqual(infer_food_category(path, data), 'meat')

        path = Path('data/food-data-bank/generic/chicken_breast.md')
        self.assertEqual(infer_food_category(path, data), 'meat')

    def test_fish_detection(self):
        """Test fish category detection."""
        path = Path('data/food-data-bank/generic/salmon_fillet.md')
        data = {'id': 'salmon_fillet_v1'}
        self.assertEqual(infer_food_category(path, data), 'fish')

        path = Path('data/food-data-bank/venues/shk/grilled_tuna.md')
        self.assertEqual(infer_food_category(path, data), 'fish')

    def test_eggs_detection(self):
        """Test eggs category detection."""
        path = Path('data/food-data-bank/generic/egg_hard_boiled.md')
        data = {'id': 'egg_hard_boiled_v1'}
        self.assertEqual(infer_food_category(path, data), 'eggs')

    def test_dairy_detection(self):
        """Test dairy category detection."""
        path = Path('data/food-data-bank/generic/greek_yogurt.md')
        data = {'id': 'greek_yogurt_v1'}
        self.assertEqual(infer_food_category(path, data), 'dairy')

        path = Path('data/food-data-bank/generic/cheese_cheddar.md')
        self.assertEqual(infer_food_category(path, data), 'dairy')

    def test_whey_detection(self):
        """Test whey protein detection."""
        path = Path('data/food-data-bank/packaged/optimum-nutrition/whey_protein.md')
        data = {'id': 'on_whey_v1'}
        self.assertEqual(infer_food_category(path, data), 'whey')

    def test_plant_default(self):
        """Test that unknown categories default to plant."""
        path = Path('data/food-data-bank/generic/oats.md')
        data = {'id': 'oats_dry_50g_v1'}
        self.assertEqual(infer_food_category(path, data), 'plant')

        path = Path('data/food-data-bank/generic/random_food.md')
        self.assertEqual(infer_food_category(path, data), 'plant')

    def test_edge_case_vegan_fish(self):
        """Test edge case: vegan fish alternative (would be misclassified)."""
        # This is a known limitation documented in ESTIMATE.md
        path = Path('data/food-data-bank/generic/vegan_fish_alternative.md')
        data = {'id': 'vegan_fish_v1'}

        # Currently would be classified as fish (limitation)
        # In future, could add manual category field to schema
        result = infer_food_category(path, data)
        self.assertEqual(result, 'fish')  # Known misclassification


class TestIntegration(unittest.TestCase):
    """Integration tests for realistic scenarios."""

    def test_high_protein_animal_dish(self):
        """Test calculations for high-protein animal dish."""
        # Grilled chicken: 30g protein, 600mg sodium
        chloride = calculate_chloride(600)
        sulfur = calculate_sulfur(30, 'meat')

        self.assertEqual(chloride, 924)  # 600 × 1.54
        self.assertEqual(sulfur, 0.3)    # 30 × 0.01

    def test_low_protein_plant_dish(self):
        """Test calculations for low-protein plant dish."""
        # Salad: 2g protein, 50mg sodium
        chloride = calculate_chloride(50)
        sulfur = calculate_sulfur(2, 'plant')

        self.assertEqual(chloride, 77)    # 50 × 1.54
        self.assertEqual(sulfur, 0.008)   # 2 × 0.004

    def test_zero_sodium_high_protein(self):
        """Test unsalted high-protein food."""
        # Unsalted grilled chicken: 25g protein, 0mg sodium
        chloride = calculate_chloride(0)
        sulfur = calculate_sulfur(25, 'meat')

        self.assertEqual(chloride, 0)
        self.assertEqual(sulfur, 0.25)


if __name__ == '__main__':
    unittest.main()
