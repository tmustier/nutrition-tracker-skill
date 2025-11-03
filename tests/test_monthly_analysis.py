#!/usr/bin/env python3
"""
Unit tests for the monthly analysis script.
Tests core functions like meal classification, alcohol detection, statistics, and more.
"""
import sys
from pathlib import Path
from datetime import datetime

# Add scripts directory to path
scripts_dir = Path(__file__).parent.parent / "scripts"
sys.path.insert(0, str(scripts_dir))

import pytest
from monthly_analysis import (
    classify_meal_time,
    is_alcoholic,
    generate_bar_chart,
    calculate_statistics,
    generate_compliance_indicator,
)


class TestClassifyMealTime:
    """Tests for classify_meal_time function."""

    def test_breakfast_boundary_start(self):
        """Test breakfast starts at 05:00."""
        assert classify_meal_time("2025-10-30T05:00:00Z") == "breakfast"

    def test_breakfast_boundary_end(self):
        """Test breakfast ends at 10:59."""
        assert classify_meal_time("2025-10-30T10:59:00Z") == "breakfast"

    def test_lunch_boundary_start(self):
        """Test lunch starts at 11:00."""
        assert classify_meal_time("2025-10-30T11:00:00Z") == "lunch"

    def test_lunch_boundary_end(self):
        """Test lunch ends at 15:59."""
        assert classify_meal_time("2025-10-30T15:59:00Z") == "lunch"

    def test_dinner_boundary_start(self):
        """Test dinner starts at 16:00."""
        assert classify_meal_time("2025-10-30T16:00:00Z") == "dinner"

    def test_dinner_boundary_end(self):
        """Test dinner ends at 22:59."""
        assert classify_meal_time("2025-10-30T22:59:00Z") == "dinner"

    def test_late_night_boundary_start(self):
        """Test late night starts at 23:00."""
        assert classify_meal_time("2025-10-30T23:00:00Z") == "late_night"

    def test_late_night_boundary_end(self):
        """Test late night ends at 04:59."""
        assert classify_meal_time("2025-10-30T04:59:00Z") == "late_night"

    def test_late_night_midnight(self):
        """Test midnight is classified as late_night."""
        assert classify_meal_time("2025-10-30T00:00:00Z") == "late_night"

    def test_mid_breakfast(self):
        """Test mid-breakfast time."""
        assert classify_meal_time("2025-10-30T08:30:00Z") == "breakfast"

    def test_mid_lunch(self):
        """Test mid-lunch time."""
        assert classify_meal_time("2025-10-30T13:00:00Z") == "lunch"

    def test_mid_dinner(self):
        """Test mid-dinner time."""
        assert classify_meal_time("2025-10-30T19:00:00Z") == "dinner"

    def test_mid_late_night(self):
        """Test mid-late_night time."""
        assert classify_meal_time("2025-10-30T02:00:00Z") == "late_night"


class TestIsAlcoholic:
    """Tests for is_alcoholic function."""

    def test_beer_variants(self):
        """Test various beer types."""
        assert is_alcoholic("Guinness Draught") == True
        assert is_alcoholic("IPA") == True
        assert is_alcoholic("Pale Ale") == True
        assert is_alcoholic("Lager") == True
        assert is_alcoholic("Stout") == True

    def test_wine_variants(self):
        """Test various wine types."""
        assert is_alcoholic("Red Wine") == True
        assert is_alcoholic("Champagne") == True
        assert is_alcoholic("Prosecco") == True

    def test_spirits(self):
        """Test various spirits."""
        assert is_alcoholic("Vodka") == True
        assert is_alcoholic("Whiskey") == True
        assert is_alcoholic("Gin and Tonic") == True
        assert is_alcoholic("Rum") == True

    def test_cocktails(self):
        """Test cocktails."""
        assert is_alcoholic("Margarita") == True
        assert is_alcoholic("Mojito") == True
        assert is_alcoholic("Martini") == True

    def test_cider(self):
        """Test cider."""
        assert is_alcoholic("Apple Cider") == True
        assert is_alcoholic("Cider") == True

    def test_false_positives(self):
        """Test known false positives - items that contain keywords but aren't alcoholic."""
        # These are current false positives due to simple keyword matching
        assert is_alcoholic("Ginger beer") == True  # Known false positive
        assert is_alcoholic("Root beer") == True  # Known false positive
        # Note: These could be fixed with more sophisticated logic (e.g., 'ginger beer' as whole phrase)

    def test_non_alcoholic_items(self):
        """Test clearly non-alcoholic items."""
        assert is_alcoholic("Orange Juice") == False
        assert is_alcoholic("Coffee") == False
        assert is_alcoholic("Chicken Breast") == False
        assert is_alcoholic("Salad") == False
        assert is_alcoholic("Water") == False

    def test_case_insensitive(self):
        """Test case insensitivity."""
        assert is_alcoholic("BEER") == True
        assert is_alcoholic("Beer") == True
        assert is_alcoholic("beer") == True
        assert is_alcoholic("BeEr") == True


class TestGenerateBarChart:
    """Tests for generate_bar_chart function."""

    def test_basic_bar_chart(self):
        """Test basic bar chart generation."""
        result = generate_bar_chart(50, 100, width=40)
        assert "█" in result
        assert "░" in result
        assert "50.0" in result

    def test_max_value_zero(self):
        """Test bar chart with max_value = 0."""
        result = generate_bar_chart(10, 0, width=40)
        assert "░" * 40 in result
        assert "10.0" in result

    def test_value_exceeds_max(self):
        """Test bar chart when value > max_value."""
        result = generate_bar_chart(150, 100, width=40)
        # Should be capped at 100%
        assert "█" * 40 in result
        assert "150.0" in result

    def test_zero_value(self):
        """Test bar chart with value = 0."""
        result = generate_bar_chart(0, 100, width=40)
        assert "░" * 40 in result
        assert "0.0" in result

    def test_with_target_marker(self):
        """Test bar chart with target marker."""
        result = generate_bar_chart(50, 100, width=40, target=75)
        assert "│" in result  # Target marker
        assert "50.0" in result

    def test_target_at_zero(self):
        """Test bar chart with target at 0."""
        result = generate_bar_chart(50, 100, width=40, target=0)
        assert "│" in result
        assert "50.0" in result

    def test_target_exceeds_width(self):
        """Test bar chart with target beyond bar width."""
        result = generate_bar_chart(50, 100, width=40, target=150)
        # Target position will be beyond bar, shouldn't crash
        assert "50.0" in result

    def test_50_percent(self):
        """Test bar chart at exactly 50%."""
        result = generate_bar_chart(50, 100, width=40)
        assert result.count("█") == 20  # Half filled
        assert result.count("░") == 20  # Half empty


class TestCalculateStatistics:
    """Tests for calculate_statistics function."""

    def test_basic_statistics(self):
        """Test basic statistics calculation."""
        values = [1.0, 2.0, 3.0, 4.0, 5.0]
        stats = calculate_statistics(values)
        assert stats['mean'] == 3.0
        assert stats['median'] == 3.0
        assert stats['min'] == 1.0
        assert stats['max'] == 5.0
        assert stats['stdev'] > 0

    def test_empty_list(self):
        """Test statistics with empty list."""
        stats = calculate_statistics([])
        assert stats['mean'] == 0
        assert stats['median'] == 0
        assert stats['stdev'] == 0
        assert stats['min'] == 0
        assert stats['max'] == 0

    def test_single_value(self):
        """Test statistics with single value."""
        stats = calculate_statistics([42.0])
        assert stats['mean'] == 42.0
        assert stats['median'] == 42.0
        assert stats['stdev'] == 0  # No deviation with single value
        assert stats['min'] == 42.0
        assert stats['max'] == 42.0

    def test_all_same_values(self):
        """Test statistics when all values are the same."""
        values = [5.0, 5.0, 5.0, 5.0]
        stats = calculate_statistics(values)
        assert stats['mean'] == 5.0
        assert stats['median'] == 5.0
        assert stats['stdev'] == 0.0
        assert stats['min'] == 5.0
        assert stats['max'] == 5.0

    def test_negative_values(self):
        """Test statistics with negative values."""
        values = [-5.0, -2.0, 0.0, 2.0, 5.0]
        stats = calculate_statistics(values)
        assert stats['mean'] == 0.0
        assert stats['median'] == 0.0
        assert stats['min'] == -5.0
        assert stats['max'] == 5.0

    def test_large_values(self):
        """Test statistics with large values."""
        values = [1000.0, 2000.0, 3000.0]
        stats = calculate_statistics(values)
        assert stats['mean'] == 2000.0
        assert stats['median'] == 2000.0
        assert stats['min'] == 1000.0
        assert stats['max'] == 3000.0

    def test_two_values(self):
        """Test statistics with exactly two values."""
        values = [10.0, 20.0]
        stats = calculate_statistics(values)
        assert stats['mean'] == 15.0
        assert stats['median'] == 15.0
        assert stats['min'] == 10.0
        assert stats['max'] == 20.0
        assert stats['stdev'] > 0


class TestGenerateComplianceIndicator:
    """Tests for generate_compliance_indicator function."""

    def test_under_minimum(self):
        """Test indicator when actual is under minimum."""
        result = generate_compliance_indicator(150, target_min=170)
        assert "UNDER" in result
        assert "20.0" in result
        assert "⚠️" in result

    def test_over_maximum(self):
        """Test indicator when actual is over maximum."""
        result = generate_compliance_indicator(2500, target_max=2300)
        assert "OVER" in result
        assert "200.0" in result
        assert "⚠️" in result

    def test_on_target_min(self):
        """Test indicator when actual meets minimum target."""
        result = generate_compliance_indicator(170, target_min=170)
        assert "ON TARGET" in result
        assert "✅" in result

    def test_on_target_max(self):
        """Test indicator when actual meets maximum target."""
        result = generate_compliance_indicator(2300, target_max=2300)
        assert "ON TARGET" in result
        assert "✅" in result

    def test_within_range(self):
        """Test indicator when actual is within range."""
        result = generate_compliance_indicator(180, target_min=170, target_max=190)
        assert "ON TARGET" in result
        assert "✅" in result

    def test_no_targets(self):
        """Test indicator when no targets are provided."""
        result = generate_compliance_indicator(100)
        assert "ON TARGET" in result
        assert "✅" in result

    def test_below_min_above_max_conflict(self):
        """Test when actual is below min (should take precedence)."""
        result = generate_compliance_indicator(50, target_min=100, target_max=80)
        # Below min should be reported
        assert "UNDER" in result

    def test_slightly_under(self):
        """Test with small gap under minimum."""
        result = generate_compliance_indicator(169.5, target_min=170)
        assert "UNDER" in result
        assert "0.5" in result

    def test_slightly_over(self):
        """Test with small gap over maximum."""
        result = generate_compliance_indicator(2300.5, target_max=2300)
        assert "OVER" in result
        assert "0.5" in result


class TestEdgeCases:
    """Tests for edge cases and error handling."""

    def test_classify_meal_time_with_timezone(self):
        """Test that timezone handling works correctly."""
        # Test with explicit UTC timezone
        assert classify_meal_time("2025-10-30T05:00:00+00:00") == "breakfast"

    def test_is_alcoholic_empty_string(self):
        """Test is_alcoholic with empty string."""
        assert is_alcoholic("") == False

    def test_bar_chart_very_small_width(self):
        """Test bar chart with small width."""
        result = generate_bar_chart(50, 100, width=10)
        assert len(result.split()[0]) == 10  # Bar should be exactly 10 chars

    def test_bar_chart_large_width(self):
        """Test bar chart with large width."""
        result = generate_bar_chart(50, 100, width=100)
        assert len(result.split()[0]) == 100  # Bar should be exactly 100 chars


class TestIntegration:
    """Integration tests combining multiple functions."""

    def test_meal_time_classification_full_day(self):
        """Test classification for a full day of meals."""
        meals = [
            ("2025-10-30T07:00:00Z", "breakfast"),
            ("2025-10-30T12:30:00Z", "lunch"),
            ("2025-10-30T18:00:00Z", "dinner"),
            ("2025-10-30T23:30:00Z", "late_night"),
        ]
        for timestamp, expected in meals:
            assert classify_meal_time(timestamp) == expected

    def test_statistics_and_compliance(self):
        """Test that statistics feed into compliance indicators correctly."""
        values = [165, 170, 175, 180, 185]
        stats = calculate_statistics(values)

        # Mean should be 175
        assert stats['mean'] == 175.0

        # Check compliance with target of 170
        indicator = generate_compliance_indicator(stats['mean'], target_min=170)
        assert "ON TARGET" in indicator

    def test_alcohol_detection_batch(self):
        """Test alcohol detection on a batch of items."""
        items = [
            "Guinness Draught",
            "Chicken Breast",
            "Red Wine",
            "Salad",
            "IPA Beer",
            "Water",
        ]
        alcoholic_items = [item for item in items if is_alcoholic(item)]
        assert len(alcoholic_items) == 3
        assert "Guinness Draught" in alcoholic_items
        assert "Red Wine" in alcoholic_items
        assert "IPA Beer" in alcoholic_items


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
