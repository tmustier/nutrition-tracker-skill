#!/usr/bin/env python3
"""
Unit tests for scripts/merge_food_logs.py

Tests cover:
- Schema validation
- Single branch merging
- Multi-branch merging without conflicts
- Duplicate timestamp handling
- Conflicting metadata (date, day_type)
- Invalid YAML handling
- State tracking
"""

import pytest
import sys
from pathlib import Path
from datetime import datetime, timezone
import tempfile
import json

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from merge_food_logs import (
    validate_log_schema,
    merge_log_files,
    MergeConflict,
    ValidationError,
    load_processed_state,
    save_processed_state,
)


class TestSchemaValidation:
    """Test validate_log_schema function."""

    def test_valid_log(self):
        """Test that a valid log passes validation."""
        log_data = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': '2024-01-15T08:00:00Z',
                    'items': [
                        {
                            'name': 'Oatmeal',
                            'quantity': 100,
                            'unit': 'g',
                            'nutrition': {
                                'calories': 389,
                                'protein': 16.9,
                                'carbs': 66.3,
                                'fat': 6.9
                            }
                        }
                    ]
                }
            ]
        }
        errors = validate_log_schema(log_data, 'test.yaml')
        assert errors == []

    def test_missing_required_field(self):
        """Test that missing required fields are caught."""
        log_data = {
            'date': '2024-01-15',
            # Missing 'day_type' and 'entries'
        }
        errors = validate_log_schema(log_data, 'test.yaml')
        assert 'Missing required field: day_type' in errors
        assert 'Missing required field: entries' in errors

    def test_invalid_day_type(self):
        """Test that invalid day_type is caught."""
        log_data = {
            'date': '2024-01-15',
            'day_type': 'invalid',
            'entries': []
        }
        errors = validate_log_schema(log_data, 'test.yaml')
        assert any('day_type must be' in e for e in errors)

    def test_entries_not_list(self):
        """Test that entries must be a list."""
        log_data = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': 'not a list'
        }
        errors = validate_log_schema(log_data, 'test.yaml')
        assert 'entries must be a list' in errors

    def test_missing_timestamp(self):
        """Test that missing timestamp is caught."""
        log_data = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'items': []
                }
            ]
        }
        errors = validate_log_schema(log_data, 'test.yaml')
        assert 'Entry 0 missing timestamp' in errors

    def test_invalid_timestamp(self):
        """Test that invalid timestamp format is caught."""
        log_data = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': 'not-a-timestamp',
                    'items': []
                }
            ]
        }
        errors = validate_log_schema(log_data, 'test.yaml')
        assert any('invalid timestamp' in e for e in errors)

    def test_missing_item_fields(self):
        """Test that missing item fields are caught."""
        log_data = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': '2024-01-15T08:00:00Z',
                    'items': [
                        {
                            'name': 'Test'
                            # Missing quantity, unit, nutrition
                        }
                    ]
                }
            ]
        }
        errors = validate_log_schema(log_data, 'test.yaml')
        assert 'Entry 0, item 0 missing: quantity' in errors
        assert 'Entry 0, item 0 missing: unit' in errors
        assert 'Entry 0, item 0 missing: nutrition' in errors

    def test_null_nutrition_value(self):
        """Test that null nutrition values are rejected."""
        log_data = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': '2024-01-15T08:00:00Z',
                    'items': [
                        {
                            'name': 'Test',
                            'quantity': 100,
                            'unit': 'g',
                            'nutrition': {
                                'calories': None,
                                'protein': 10
                            }
                        }
                    ]
                }
            ]
        }
        errors = validate_log_schema(log_data, 'test.yaml')
        assert any('calories is null' in e for e in errors)

    def test_negative_nutrition_value(self):
        """Test that negative nutrition values are rejected."""
        log_data = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': '2024-01-15T08:00:00Z',
                    'items': [
                        {
                            'name': 'Test',
                            'quantity': 100,
                            'unit': 'g',
                            'nutrition': {
                                'calories': -100,
                                'protein': 10
                            }
                        }
                    ]
                }
            ]
        }
        errors = validate_log_schema(log_data, 'test.yaml')
        assert any('calories must be >= 0' in e for e in errors)


class TestMergeLogFiles:
    """Test merge_log_files function."""

    def test_merge_single_branch(self):
        """Test that a single branch file is returned as-is."""
        log_data = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': '2024-01-15T08:00:00Z',
                    'items': [
                        {
                            'name': 'Oatmeal',
                            'quantity': 100,
                            'unit': 'g',
                            'nutrition': {'calories': 389, 'protein': 16.9, 'carbs': 66.3, 'fat': 6.9}
                        }
                    ]
                }
            ]
        }
        files_by_branch = {'claude/branch1': log_data}
        result = merge_log_files(files_by_branch, 'test.yaml')
        assert result == log_data

    def test_merge_multiple_branches_no_conflicts(self):
        """Test merging multiple branches with different timestamps."""
        log1 = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': '2024-01-15T08:00:00Z',
                    'items': [
                        {
                            'name': 'Breakfast',
                            'quantity': 100,
                            'unit': 'g',
                            'nutrition': {'calories': 300, 'protein': 10, 'carbs': 40, 'fat': 5}
                        }
                    ]
                }
            ]
        }
        log2 = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': '2024-01-15T12:00:00Z',
                    'items': [
                        {
                            'name': 'Lunch',
                            'quantity': 200,
                            'unit': 'g',
                            'nutrition': {'calories': 500, 'protein': 20, 'carbs': 50, 'fat': 15}
                        }
                    ]
                }
            ]
        }
        files_by_branch = {
            'claude/branch1': log1,
            'claude/branch2': log2
        }
        result = merge_log_files(files_by_branch, 'test.yaml')

        # Should have both entries, sorted by timestamp
        assert len(result['entries']) == 2
        assert result['entries'][0]['timestamp'] == '2024-01-15T08:00:00Z'
        assert result['entries'][1]['timestamp'] == '2024-01-15T12:00:00Z'
        assert result['date'] == '2024-01-15'
        assert result['day_type'] == 'rest'

    def test_merge_duplicate_timestamps(self):
        """Test merging entries with duplicate timestamps."""
        log1 = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': '2024-01-15T08:00:00Z',
                    'items': [
                        {
                            'name': 'Eggs',
                            'quantity': 2,
                            'unit': 'whole',
                            'nutrition': {'calories': 140, 'protein': 12, 'carbs': 1, 'fat': 10}
                        }
                    ]
                }
            ]
        }
        log2 = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': '2024-01-15T08:00:00Z',
                    'items': [
                        {
                            'name': 'Toast',
                            'quantity': 2,
                            'unit': 'slices',
                            'nutrition': {'calories': 160, 'protein': 5, 'carbs': 30, 'fat': 2}
                        }
                    ]
                }
            ]
        }
        files_by_branch = {
            'claude/branch1': log1,
            'claude/branch2': log2
        }
        result = merge_log_files(files_by_branch, 'test.yaml')

        # Should have one entry with merged items
        assert len(result['entries']) == 1
        assert result['entries'][0]['timestamp'] == '2024-01-15T08:00:00Z'
        assert len(result['entries'][0]['items']) == 2
        # Check both items are present
        item_names = [item['name'] for item in result['entries'][0]['items']]
        assert 'Eggs' in item_names
        assert 'Toast' in item_names

    def test_merge_duplicate_items_deduplication(self):
        """Test that duplicate items (same name, quantity, unit) are deduplicated."""
        log1 = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': '2024-01-15T08:00:00Z',
                    'items': [
                        {
                            'name': 'Eggs',
                            'quantity': 2,
                            'unit': 'whole',
                            'nutrition': {'calories': 140, 'protein': 12, 'carbs': 1, 'fat': 10}
                        }
                    ]
                }
            ]
        }
        log2 = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': '2024-01-15T08:00:00Z',
                    'items': [
                        {
                            'name': 'Eggs',
                            'quantity': 2,
                            'unit': 'whole',
                            'nutrition': {'calories': 140, 'protein': 12, 'carbs': 1, 'fat': 10}
                        }
                    ]
                }
            ]
        }
        files_by_branch = {
            'claude/branch1': log1,
            'claude/branch2': log2
        }
        result = merge_log_files(files_by_branch, 'test.yaml')

        # Should have one entry with deduplicated items
        assert len(result['entries']) == 1
        assert len(result['entries'][0]['items']) == 1
        assert result['entries'][0]['items'][0]['name'] == 'Eggs'

    def test_merge_conflicting_dates(self):
        """Test that conflicting dates raise MergeConflict."""
        log1 = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': []
        }
        log2 = {
            'date': '2024-01-16',  # Different date!
            'day_type': 'rest',
            'entries': []
        }
        files_by_branch = {
            'claude/branch1': log1,
            'claude/branch2': log2
        }

        with pytest.raises(MergeConflict) as exc_info:
            merge_log_files(files_by_branch, 'test.yaml')

        assert 'Date mismatch' in str(exc_info.value)

    def test_merge_conflicting_day_types(self):
        """Test that conflicting day_type raises MergeConflict."""
        log1 = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': []
        }
        log2 = {
            'date': '2024-01-15',
            'day_type': 'training',  # Different day_type!
            'entries': []
        }
        files_by_branch = {
            'claude/branch1': log1,
            'claude/branch2': log2
        }

        with pytest.raises(MergeConflict) as exc_info:
            merge_log_files(files_by_branch, 'test.yaml')

        assert 'day_type conflict' in str(exc_info.value)

    def test_merge_with_notes(self):
        """Test that notes are merged correctly."""
        log1 = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': '2024-01-15T08:00:00Z',
                    'items': [],
                    'notes': 'Breakfast at home'
                }
            ]
        }
        log2 = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': '2024-01-15T08:00:00Z',
                    'items': [],
                    'notes': 'Had coffee'
                }
            ]
        }
        files_by_branch = {
            'claude/branch1': log1,
            'claude/branch2': log2
        }
        result = merge_log_files(files_by_branch, 'test.yaml')

        # Notes should be merged with separator
        assert 'notes' in result['entries'][0]
        notes = result['entries'][0]['notes']
        assert 'Breakfast at home' in notes
        assert 'Had coffee' in notes
        assert ' | ' in notes

    def test_merge_duplicate_notes_deduplication(self):
        """Test that duplicate notes are deduplicated."""
        log1 = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': '2024-01-15T08:00:00Z',
                    'items': [],
                    'notes': 'Same note'
                }
            ]
        }
        log2 = {
            'date': '2024-01-15',
            'day_type': 'rest',
            'entries': [
                {
                    'timestamp': '2024-01-15T08:00:00Z',
                    'items': [],
                    'notes': 'Same note'
                }
            ]
        }
        files_by_branch = {
            'claude/branch1': log1,
            'claude/branch2': log2
        }
        result = merge_log_files(files_by_branch, 'test.yaml')

        # Should have only one instance of the note
        assert result['entries'][0]['notes'] == 'Same note'


class TestStateManagement:
    """Test state loading and saving."""

    def test_load_nonexistent_state(self, monkeypatch):
        """Test that loading nonexistent state returns default."""
        with tempfile.TemporaryDirectory() as tmpdir:
            state_file = Path(tmpdir) / '.github' / 'workflows' / 'processed-branches.json'
            monkeypatch.setattr('merge_food_logs.Path', lambda p: state_file.parent / p if p == '.github/workflows/processed-branches.json' else Path(p))

            state = load_processed_state()
            assert state == {'last_run': None, 'processed': {}}

    def test_save_and_load_state(self, monkeypatch):
        """Test that state can be saved and loaded."""
        with tempfile.TemporaryDirectory() as tmpdir:
            state_file = Path(tmpdir) / 'processed-branches.json'

            # Mock the state file path
            def mock_path_init(p):
                if p == '.github/workflows/processed-branches.json':
                    return state_file
                return Path(p)

            import merge_food_logs
            original_path_class = merge_food_logs.Path

            class MockPath:
                def __new__(cls, p):
                    if p == '.github/workflows/processed-branches.json':
                        return state_file
                    return original_path_class(p)

            monkeypatch.setattr(merge_food_logs, 'Path', MockPath)

            # Save state
            test_state = {
                'last_run': '2024-01-15T10:00:00Z',
                'processed': {
                    'claude/branch1': {
                        'sha': 'abc123',
                        'processed_at': '2024-01-15T10:00:00Z',
                        'files_extracted': 5
                    }
                }
            }
            save_processed_state(test_state)

            # Load state
            loaded_state = load_processed_state()
            assert loaded_state == test_state

    def test_load_corrupted_state(self, monkeypatch):
        """Test that corrupted state file returns default."""
        with tempfile.TemporaryDirectory() as tmpdir:
            state_file = Path(tmpdir) / 'processed-branches.json'
            state_file.write_text('{ invalid json }')

            import merge_food_logs
            original_path_class = merge_food_logs.Path

            class MockPath:
                def __new__(cls, p):
                    if p == '.github/workflows/processed-branches.json':
                        return state_file
                    return original_path_class(p)

            monkeypatch.setattr(merge_food_logs, 'Path', MockPath)

            state = load_processed_state()
            assert state == {'last_run': None, 'processed': {}}


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
