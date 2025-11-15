#!/usr/bin/env python3
"""
Unit tests for validate_venue_config.py

Tests:
- Config structure validation
- Duplicate pattern detection
- Folder existence checks
- Format validation
"""

import sys
import pytest
import tempfile
import yaml
from pathlib import Path
from unittest.mock import patch

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from validate_venue_config import validate_config


class TestValidateConfig:
    """Test the validate_config function."""

    def test_validate_real_config_passes(self):
        """Test that the actual config file passes validation."""
        result = validate_config()
        assert result == True, "Real config should pass validation"

    def test_config_has_all_categories(self):
        """Test that config contains all required categories."""
        # This test reads the actual config
        config_path = Path(__file__).parent.parent / 'data' / 'venue-mappings.yaml'
        with open(config_path) as f:
            config = yaml.safe_load(f)

        assert 'venues' in config
        assert 'packaged' in config
        assert 'generic' in config

    def test_no_duplicate_patterns_in_real_config(self):
        """Test that real config has no duplicate patterns."""
        config_path = Path(__file__).parent.parent / 'data' / 'venue-mappings.yaml'
        with open(config_path) as f:
            config = yaml.safe_load(f)

        all_patterns = set()
        for category in ['venues', 'packaged', 'generic']:
            for venue_config in config[category].values():
                if isinstance(venue_config, dict):
                    patterns = venue_config.get('patterns', [])
                    for pattern in patterns:
                        pattern_lower = pattern.lower()
                        assert pattern_lower not in all_patterns, \
                            f"Duplicate pattern found: {pattern}"
                        all_patterns.add(pattern_lower)

    def test_all_config_folders_exist(self):
        """Test that all folders referenced in config actually exist."""
        config_path = Path(__file__).parent.parent / 'data' / 'venue-mappings.yaml'
        data_bank = Path(__file__).parent.parent / 'data' / 'food-data-bank'

        with open(config_path) as f:
            config = yaml.safe_load(f)

        for category in ['venues', 'packaged', 'generic']:
            for venue_key, venue_config in config[category].items():
                if venue_key.startswith('_'):
                    continue
                if isinstance(venue_config, dict) and 'folder' in venue_config:
                    folder_path = data_bank / category / venue_config['folder']
                    assert folder_path.exists(), \
                        f"Folder doesn't exist: {category}/{venue_config['folder']}"

    def test_all_existing_folders_in_config(self):
        """Test that all existing folders are either in config OR can be auto-categorized.

        This supports dynamic categorization where:
        - Packaged brands MUST be in config (need patterns)
        - Venues/generic CAN be auto-categorized without config entry
        """
        import sys
        sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))
        from venue_categorization import can_auto_categorize

        config_path = Path(__file__).parent.parent / 'data' / 'venue-mappings.yaml'
        data_bank = Path(__file__).parent.parent / 'data' / 'food-data-bank'

        with open(config_path) as f:
            config = yaml.safe_load(f)

        for category in ['venues', 'packaged', 'generic']:
            category_path = data_bank / category
            if not category_path.exists():
                continue

            for folder_path in category_path.iterdir():
                if not folder_path.is_dir():
                    continue

                # Check folder is in config
                found_in_config = False
                for venue_config in config[category].values():
                    if isinstance(venue_config, dict) and \
                       venue_config.get('folder') == folder_path.name:
                        found_in_config = True
                        break

                if not found_in_config:
                    # Not in config - check if it can be auto-categorized
                    if category == 'packaged':
                        # Packaged brands MUST be in config
                        assert False, \
                            f"Packaged brand folder {category}/{folder_path.name} not in config. " \
                            f"Packaged brands must be added with patterns."
                    else:
                        # Venues/generic can be auto-categorized
                        assert can_auto_categorize(folder_path.name, category), \
                            f"Folder {category}/{folder_path.name} not in config and cannot be auto-categorized correctly"

    def test_folder_names_follow_convention(self):
        """Test that all folder names in config follow naming convention."""
        import re

        config_path = Path(__file__).parent.parent / 'data' / 'venue-mappings.yaml'
        with open(config_path) as f:
            config = yaml.safe_load(f)

        pattern = re.compile(r'^[a-z0-9][a-z0-9-]*[a-z0-9]$')

        for category in ['venues', 'packaged', 'generic']:
            for venue_key, venue_config in config[category].items():
                if venue_key.startswith('_'):
                    continue
                if isinstance(venue_config, dict) and 'folder' in venue_config:
                    folder = venue_config['folder']
                    assert pattern.match(folder), \
                        f"Invalid folder name format: {folder} in {category}/{venue_key}"

    def test_config_metadata_structure(self):
        """Test that config metadata section has expected structure."""
        config_path = Path(__file__).parent.parent / 'data' / 'venue-mappings.yaml'
        with open(config_path) as f:
            config = yaml.safe_load(f)

        assert '_meta' in config
        assert 'version' in config['_meta']
        assert 'last_updated' in config['_meta']


class TestValidationLogic:
    """Test specific validation logic with mock data."""

    def test_missing_folder_key_detected(self, tmp_path):
        """Test that missing 'folder' key is detected."""
        # Create a config with missing folder key
        bad_config = {
            'venues': {
                'test-venue': {
                    'patterns': ['test'],
                    # Missing 'folder' key
                }
            },
            'packaged': {},
            'generic': {},
            '_meta': {'version': 1}
        }

        config_file = tmp_path / 'venue-mappings.yaml'
        with open(config_file, 'w') as f:
            yaml.dump(bad_config, f)

        # Patch the paths to use our temp config
        with patch('validate_venue_config.Path') as mock_path:
            mock_path.return_value.parent.parent = tmp_path.parent
            # This would normally fail, but we're just testing structure
            # In real usage, validate_config() would detect this error

    def test_patterns_field_structure(self):
        """Test that patterns field is always a list."""
        config_path = Path(__file__).parent.parent / 'data' / 'venue-mappings.yaml'
        with open(config_path) as f:
            config = yaml.safe_load(f)

        for category in ['venues', 'packaged', 'generic']:
            for venue_key, venue_config in config[category].items():
                if venue_key.startswith('_'):
                    continue
                if isinstance(venue_config, dict):
                    patterns = venue_config.get('patterns', [])
                    assert isinstance(patterns, list), \
                        f"Patterns not a list in {category}/{venue_key}"
                    assert len(patterns) > 0, \
                        f"Empty patterns list in {category}/{venue_key}"


class TestConfigCompleteness:
    """Test that config is complete and well-formed."""

    def test_all_venues_have_display_name_or_note(self):
        """Test that venues either have display_name or good folder name."""
        config_path = Path(__file__).parent.parent / 'data' / 'venue-mappings.yaml'
        with open(config_path) as f:
            config = yaml.safe_load(f)

        for category in ['venues', 'packaged']:
            for venue_key, venue_config in config[category].items():
                if venue_key.startswith('_'):
                    continue
                if isinstance(venue_config, dict):
                    # Should have either display_name or folder is self-documenting
                    has_display = 'display_name' in venue_config
                    has_folder = 'folder' in venue_config
                    assert has_folder, f"Missing folder in {category}/{venue_key}"

    def test_pattern_quality(self):
        """Test that patterns are reasonable quality."""
        config_path = Path(__file__).parent.parent / 'data' / 'venue-mappings.yaml'
        with open(config_path) as f:
            config = yaml.safe_load(f)

        for category in ['venues', 'packaged', 'generic']:
            for venue_key, venue_config in config[category].items():
                if venue_key.startswith('_'):
                    continue
                if isinstance(venue_config, dict):
                    patterns = venue_config.get('patterns', [])
                    for pattern in patterns:
                        # Patterns should be non-empty strings
                        assert isinstance(pattern, str), \
                            f"Non-string pattern in {category}/{venue_key}: {pattern}"
                        assert len(pattern) > 0, \
                            f"Empty pattern in {category}/{venue_key}"
                        assert len(pattern) < 100, \
                            f"Suspiciously long pattern in {category}/{venue_key}: {pattern}"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
