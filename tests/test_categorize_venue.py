#!/usr/bin/env python3
"""
Unit tests for venue categorization system.

Tests the 3-tier categorization strategy:
1. Explicit CLI overrides
2. Config file lookup
3. Heuristic fallback
"""

import sys
import pytest
from pathlib import Path
from unittest.mock import patch, MagicMock

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from new_dish_from_template import categorize_venue, load_venue_mappings, slugify


class TestSlugify:
    """Test the slugify function."""

    def test_basic_slugify(self):
        assert slugify("Simple Health Kitchen") == "simple-health-kitchen"

    def test_special_characters_removed(self):
        assert slugify("Joe & The Juice") == "joe-the-juice"

    def test_multiple_spaces_collapsed(self):
        assert slugify("The   Eagle    Farringdon") == "the-eagle-farringdon"

    def test_strip_hyphens(self):
        assert slugify("-test-") == "test"

    def test_lowercase_conversion(self):
        assert slugify("UPPERCASE") == "uppercase"


class TestLoadVenueMappings:
    """Test loading venue configuration."""

    def test_load_mappings_success(self):
        """Test successful loading of venue mappings."""
        mappings = load_venue_mappings()
        assert mappings is not None
        assert 'venues' in mappings
        assert 'packaged' in mappings
        assert 'generic' in mappings

    def test_mappings_structure(self):
        """Test that mappings have expected structure."""
        mappings = load_venue_mappings()

        # Check venues
        assert 'simple-health-kitchen' in mappings['venues']
        shk = mappings['venues']['simple-health-kitchen']
        assert 'patterns' in shk
        assert 'folder' in shk
        assert shk['folder'] == 'simple-health-kitchen'

        # Check packaged
        assert 'grenade' in mappings['packaged']

        # Check generic
        assert 'home-cooked' in mappings['generic']


class TestCategorizeVenue:
    """Test the main categorize_venue function."""

    # Tier 1: Explicit Overrides

    def test_explicit_override_venues(self):
        """Test explicit category override to venues."""
        category, folder = categorize_venue(
            "Unknown Restaurant",
            override_category_type="venues",
            override_folder_name="unknown-restaurant"
        )
        assert category == "venues"
        assert folder == "unknown-restaurant"

    def test_explicit_override_packaged(self):
        """Test explicit category override to packaged."""
        category, folder = categorize_venue(
            "New Protein Bar",
            override_category_type="packaged"
        )
        assert category == "packaged"
        # Folder name should be slugified from venue name when not specified
        assert folder == "new-protein-bar"

    def test_explicit_override_takes_precedence(self):
        """Test that explicit override takes precedence over config."""
        category, folder = categorize_venue(
            "Simple Health Kitchen",  # Known in config as venues
            override_category_type="packaged",  # But override to packaged
            override_folder_name="test-override"
        )
        assert category == "packaged"
        assert folder == "test-override"

    # Tier 2: Config File Lookup

    def test_known_venue_simple_health_kitchen(self):
        """Test known venue from config - Simple Health Kitchen."""
        category, folder = categorize_venue("Simple Health Kitchen")
        assert category == "venues"
        assert folder == "simple-health-kitchen"

    def test_known_venue_shk_abbreviation(self):
        """Test known venue using abbreviation pattern."""
        category, folder = categorize_venue("SHK")
        assert category == "venues"
        assert folder == "simple-health-kitchen"

    def test_known_venue_decimo(self):
        """Test known venue - Decimo London."""
        category, folder = categorize_venue("Decimo London")
        assert category == "venues"
        assert folder == "decimo-london"

    def test_known_packaged_grenade(self):
        """Test known packaged brand - Grenade."""
        category, folder = categorize_venue("Grenade")
        assert category == "packaged"
        assert folder == "grenade"

    def test_known_packaged_lucozade(self):
        """Test known packaged brand - Lucozade."""
        category, folder = categorize_venue("Lucozade Sport")
        assert category == "packaged"
        assert folder == "lucozade"

    def test_known_generic_home_cooked(self):
        """Test known generic category - home cooked."""
        category, folder = categorize_venue("homemade")
        assert category == "generic"
        assert folder == "home-cooked"

    def test_known_generic_ingredients(self):
        """Test known generic category - ingredients."""
        category, folder = categorize_venue("generic ingredient")
        assert category == "generic"
        assert folder == "ingredients"

    def test_pattern_matching_case_insensitive(self):
        """Test that pattern matching is case-insensitive."""
        category1, folder1 = categorize_venue("simple health kitchen")
        category2, folder2 = categorize_venue("SIMPLE HEALTH KITCHEN")
        category3, folder3 = categorize_venue("Simple Health Kitchen")

        assert category1 == category2 == category3 == "venues"
        assert folder1 == folder2 == folder3 == "simple-health-kitchen"

    def test_pattern_matching_substring(self):
        """Test that patterns match as substrings."""
        # "jean-georges" pattern should match full name
        category, folder = categorize_venue("Jean-Georges at The Connaught, London")
        assert category == "venues"
        assert folder == "jean-georges-connaught"

    # Tier 3: Heuristic Fallback

    def test_heuristic_packaged_product_suffix(self):
        """Test heuristic detection of packaged products by suffix."""
        category, folder = categorize_venue("Some Brand (Packaged Product)")
        assert category == "packaged"
        assert folder == "some-brand-packaged-product"

    def test_heuristic_uk_location_london(self):
        """Test heuristic detection of venues by London location."""
        category, folder = categorize_venue("New Restaurant, London")
        assert category == "venues"
        assert folder == "new-restaurant-london"

    def test_heuristic_uk_location_soho(self):
        """Test heuristic detection of venues by Soho location."""
        category, folder = categorize_venue("Cool Cafe, Soho")
        assert category == "venues"
        assert folder == "cool-cafe-soho"

    def test_heuristic_generic_bakery(self):
        """Test heuristic mapping to bakery subfolder."""
        # "Bakery" keyword alone should map to bakery
        category, folder = categorize_venue("Bakery")
        assert category == "generic"
        assert folder == "bakery"

    def test_heuristic_generic_ingredient(self):
        """Test heuristic mapping to ingredients subfolder."""
        category, folder = categorize_venue("Generic Ingredient")
        assert category == "generic"
        assert folder == "ingredients"

    def test_heuristic_generic_fresh_produce(self):
        """Test heuristic mapping to fresh-produce subfolder."""
        category, folder = categorize_venue("Fresh Fruit")
        assert category == "generic"
        assert folder == "fresh-produce"

    # Tier 4: Generic Fallback

    def test_unknown_venue_generic_fallback(self):
        """Test that unknown venues fall back to generic."""
        category, folder = categorize_venue("Completely Unknown Venue")
        assert category == "generic"
        assert folder == "completely-unknown-venue"

    # Edge Cases

    def test_empty_string(self):
        """Test behavior with empty string."""
        category, folder = categorize_venue("")
        assert category == "generic"
        assert folder == ""

    def test_special_characters_in_venue_name(self):
        """Test handling of special characters."""
        category, folder = categorize_venue("L'ETO Café")
        # Should match leto pattern
        assert category == "venues"
        assert folder == "leto-caffe-soho"

    def test_first_match_wins(self):
        """Test that first matching pattern wins."""
        # If a venue matches multiple patterns, first one should win
        # "Joe & The Juice" matches both joe+juice pattern (venues) and juice keyword
        category, folder = categorize_venue("Joe & The Juice")
        assert category == "venues"  # Should match venues pattern first
        assert folder == "joe-and-the-juice"


class TestIntegration:
    """Integration tests combining multiple components."""

    def test_config_covers_all_actual_venues(self):
        """Test that all actual venue folders are either in config OR can be auto-categorized.

        This supports dynamic categorization where venues can be auto-categorized
        based on intelligent pattern matching without requiring config entries.
        """
        import sys
        sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))
        from venue_categorization import can_auto_categorize

        mappings = load_venue_mappings()
        data_bank = Path(__file__).parent.parent / 'data' / 'food-data-bank'

        # Check venues
        venues_dir = data_bank / 'venues'
        if venues_dir.exists():
            for venue_folder in venues_dir.iterdir():
                if venue_folder.is_dir():
                    # Check this folder is in config
                    found_in_config = False
                    for venue_config in mappings['venues'].values():
                        if isinstance(venue_config, dict) and venue_config.get('folder') == venue_folder.name:
                            found_in_config = True
                            break

                    if not found_in_config:
                        # Not in config - check if it can be auto-categorized correctly
                        assert can_auto_categorize(venue_folder.name, 'venues'), \
                            f"Venue folder {venue_folder.name} not in config and cannot be auto-categorized correctly"

    def test_no_duplicate_folders_across_categories(self):
        """Test that no folder name appears in multiple categories."""
        mappings = load_venue_mappings()
        all_folders = []

        for category in ['venues', 'packaged', 'generic']:
            for venue_config in mappings[category].values():
                if isinstance(venue_config, dict) and 'folder' in venue_config:
                    folder = venue_config['folder']
                    assert folder not in all_folders, f"Duplicate folder: {folder}"
                    all_folders.append(folder)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
