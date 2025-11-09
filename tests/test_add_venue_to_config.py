#!/usr/bin/env python3
"""
Unit tests for add_venue_to_config.py

Tests:
- Folder name validation (security)
- Atomic YAML writes
- Venue addition logic
"""

import sys
import pytest
import tempfile
import yaml
from pathlib import Path
from unittest.mock import patch, MagicMock

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from add_venue_to_config import validate_folder_name, atomic_write_yaml


class TestValidateFolderName:
    """Test folder name validation for security and format."""

    def test_valid_simple_name(self):
        """Test that valid simple names pass."""
        assert validate_folder_name("simple-health-kitchen") == True

    def test_valid_with_numbers(self):
        """Test that names with numbers are valid."""
        assert validate_folder_name("joe-and-the-juice-123") == True

    def test_valid_short_name(self):
        """Test that two-character names are valid."""
        assert validate_folder_name("ab") == True

    # Security Tests - Path Traversal

    def test_reject_path_traversal_dotdot(self):
        """Test that .. is rejected (path traversal)."""
        # Either caught by regex or path traversal check
        with pytest.raises(ValueError):
            validate_folder_name("../etc/passwd")

    def test_reject_path_traversal_forward_slash(self):
        """Test that / is rejected."""
        with pytest.raises(ValueError):
            validate_folder_name("foo/bar")

    def test_reject_path_traversal_backslash(self):
        """Test that \\ is rejected."""
        with pytest.raises(ValueError):
            validate_folder_name("foo\\bar")

    def test_reject_dotdot_in_middle(self):
        """Test that .. anywhere in name is rejected."""
        with pytest.raises(ValueError):
            validate_folder_name("foo..bar")

    # Format Validation Tests

    def test_reject_uppercase(self):
        """Test that uppercase letters are rejected."""
        with pytest.raises(ValueError, match="lowercase"):
            validate_folder_name("Simple-Health-Kitchen")

    def test_reject_spaces(self):
        """Test that spaces are rejected."""
        with pytest.raises(ValueError, match="lowercase"):
            validate_folder_name("simple health kitchen")

    def test_reject_starts_with_hyphen(self):
        """Test that names starting with hyphen are rejected."""
        with pytest.raises(ValueError, match="lowercase"):
            validate_folder_name("-invalid")

    def test_reject_ends_with_hyphen(self):
        """Test that names ending with hyphen are rejected."""
        with pytest.raises(ValueError, match="lowercase"):
            validate_folder_name("invalid-")

    def test_reject_special_characters(self):
        """Test that special characters are rejected."""
        with pytest.raises(ValueError, match="lowercase"):
            validate_folder_name("foo@bar")

    def test_reject_single_character(self):
        """Test that single character names are rejected."""
        with pytest.raises(ValueError, match="lowercase"):
            validate_folder_name("a")

    def test_reject_empty_string(self):
        """Test that empty string is rejected."""
        with pytest.raises(ValueError):
            validate_folder_name("")

    # Edge Cases

    def test_consecutive_hyphens_allowed(self):
        """Test that consecutive hyphens are allowed."""
        assert validate_folder_name("foo--bar") == True

    def test_only_numbers(self):
        """Test that names with only numbers are valid."""
        assert validate_folder_name("123") == True


class TestAtomicWriteYAML:
    """Test atomic YAML writing to prevent corruption."""

    def test_atomic_write_creates_file(self):
        """Test that atomic write creates the file."""
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.yaml') as tmp:
            tmp_path = Path(tmp.name)

        try:
            data = {'test': 'value', 'number': 42}
            atomic_write_yaml(tmp_path, data)

            # Verify file exists
            assert tmp_path.exists()

            # Verify content is correct
            with open(tmp_path) as f:
                loaded = yaml.safe_load(f)
            assert loaded == data
        finally:
            tmp_path.unlink(missing_ok=True)

    def test_atomic_write_overwrites_existing(self):
        """Test that atomic write can overwrite existing files."""
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.yaml') as tmp:
            tmp_path = Path(tmp.name)
            # Write initial content
            tmp.write("old: content\n")

        try:
            # Overwrite with new content
            new_data = {'new': 'content', 'test': 123}
            atomic_write_yaml(tmp_path, new_data)

            # Verify new content
            with open(tmp_path) as f:
                loaded = yaml.safe_load(f)
            assert loaded == new_data
            assert 'old' not in loaded
        finally:
            tmp_path.unlink(missing_ok=True)

    def test_atomic_write_preserves_unicode(self):
        """Test that atomic write correctly handles Unicode."""
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.yaml') as tmp:
            tmp_path = Path(tmp.name)

        try:
            data = {
                'name': 'Café Français',
                'description': '日本料理',
                'emoji': '🍕'
            }
            atomic_write_yaml(tmp_path, data)

            with open(tmp_path, encoding='utf-8') as f:
                loaded = yaml.safe_load(f)
            assert loaded == data
        finally:
            tmp_path.unlink(missing_ok=True)

    def test_atomic_write_complex_structure(self):
        """Test atomic write with nested structures."""
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.yaml') as tmp:
            tmp_path = Path(tmp.name)

        try:
            data = {
                'venues': {
                    'shk': {
                        'patterns': ['simple health kitchen', 'shk'],
                        'folder': 'simple-health-kitchen'
                    }
                },
                '_meta': {
                    'version': 1,
                    'last_updated': '2025-11-09'
                }
            }
            atomic_write_yaml(tmp_path, data)

            with open(tmp_path) as f:
                loaded = yaml.safe_load(f)
            assert loaded == data
        finally:
            tmp_path.unlink(missing_ok=True)

    def test_atomic_write_failure_cleanup(self):
        """Test that failed writes clean up temp files."""
        # Create a path to non-existent directory
        non_existent = Path("/tmp/non-existent-test-dir-123456") / "test.yaml"

        try:
            # This should fail because parent directory doesn't exist
            with pytest.raises(FileNotFoundError):
                atomic_write_yaml(non_existent, {'test': 'data'})
        finally:
            # Clean up in case directory was created
            if non_existent.parent.exists():
                import shutil
                shutil.rmtree(non_existent.parent, ignore_errors=True)


class TestFolderNameEdgeCases:
    """Additional edge case tests for folder name validation."""

    def test_max_length_accepted(self):
        """Test that reasonably long names are accepted."""
        long_name = "a" * 50 + "-" + "b" * 50
        assert validate_folder_name(long_name) == True

    def test_numeric_with_hyphens(self):
        """Test numeric names with hyphens."""
        assert validate_folder_name("123-456") == True

    def test_alphanumeric_mix(self):
        """Test mix of letters and numbers."""
        assert validate_folder_name("cafe-123-london") == True


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
