#!/usr/bin/env python3
"""
Unit tests for the nutrient migration script (migrate_nutrients_v1_to_v2.py).
Tests migration logic, data preservation, idempotency, and edge cases.
"""
import sys
import tempfile
import shutil
import unittest
from pathlib import Path
from datetime import datetime

# Add scripts directory to path
scripts_dir = Path(__file__).parent.parent / "scripts"
sys.path.insert(0, str(scripts_dir))

import yaml
from migrate_nutrients_v1_to_v2 import (
    NEW_NUTRIENTS,
    needs_migration,
    parse_yaml_block,
    build_yaml_text,
    migrate_file,
    MIGRATION_DATE,
    MIGRATION_AUTHOR,
    MIGRATION_CHANGE,
)


class TestNewNutrientsConstant(unittest.TestCase):
    """Tests for NEW_NUTRIENTS constant and migration parameters."""

    def test_new_nutrients_count(self):
        """Test that NEW_NUTRIENTS contains exactly 28 nutrients."""
        self.assertEqual(len(NEW_NUTRIENTS), 28)

    def test_new_nutrients_format(self):
        """Test that all NEW_NUTRIENTS entries are properly formatted."""
        for nutrient_name, default_value in NEW_NUTRIENTS:
            self.assertIsInstance(nutrient_name, str)
            self.assertGreater(len(nutrient_name), 0)
            self.assertTrue(nutrient_name.endswith(('_mg', '_ug', '_g')))
            self.assertEqual(default_value, 0)

    def test_new_nutrients_unique(self):
        """Test that all nutrient names are unique."""
        names = [name for name, _ in NEW_NUTRIENTS]
        self.assertEqual(len(names), len(set(names)))

    def test_migration_constants(self):
        """Test migration constants are properly defined."""
        self.assertIsInstance(MIGRATION_DATE, str)
        self.assertIsInstance(MIGRATION_AUTHOR, str)
        self.assertIsInstance(MIGRATION_CHANGE, str)
        self.assertGreater(len(MIGRATION_CHANGE), 50)  # Should be a meaningful description


class TestNeedsMigration(unittest.TestCase):
    """Tests for needs_migration function."""

    def test_needs_migration_no_schema_version(self):
        """Test that files without schema_version need migration."""
        data = {"id": "test", "per_portion": {}}
        needs_mig, reason = needs_migration(data)
        self.assertTrue(needs_mig)
        self.assertIn("schema_version missing", reason)

    def test_needs_migration_schema_v1(self):
        """Test that schema_version 1 needs migration."""
        data = {"id": "test", "schema_version": 1, "per_portion": {}}
        needs_mig, reason = needs_migration(data)
        self.assertTrue(needs_mig)
        self.assertIn("schema_version: 1 < 2", reason)

    def test_no_migration_schema_v2(self):
        """Test that schema_version 2 doesn't need migration."""
        data = {"id": "test", "schema_version": 2, "per_portion": {}}
        needs_mig, reason = needs_migration(data)
        self.assertFalse(needs_mig)
        self.assertIn("Already migrated (schema_version: 2)", reason)

    def test_no_migration_schema_v3(self):
        """Test that schema_version 3+ doesn't need migration."""
        data = {"id": "test", "schema_version": 3, "per_portion": {}}
        needs_mig, reason = needs_migration(data)
        self.assertFalse(needs_mig)
        self.assertIn("Already migrated (schema_version: 3)", reason)

    def test_needs_migration_schema_v0(self):
        """Test that schema_version 0 needs migration."""
        data = {"id": "test", "schema_version": 0, "per_portion": {}}
        needs_mig, reason = needs_migration(data)
        self.assertTrue(needs_mig)
        self.assertIn("schema_version: 0 < 2", reason)


class TestParseYamlBlock(unittest.TestCase):
    """Tests for parse_yaml_block function."""

    def test_parse_valid_yaml_block(self):
        """Test parsing valid YAML block from markdown."""
        content = """# Test Dish

Some description.

```yaml
id: test_dish
schema_version: 1
per_portion:
  energy_kcal: 100
  protein_g: 10
```

More content after.
"""
        yaml_start, yaml_end, data = parse_yaml_block(content)
        
        self.assertIsNotNone(yaml_start)
        self.assertIsNotNone(yaml_end)
        self.assertIsNotNone(data)
        self.assertEqual(data["id"], "test_dish")
        self.assertEqual(data["schema_version"], 1)
        self.assertEqual(data["per_portion"]["energy_kcal"], 100)

    def test_parse_yaml_block_no_yaml(self):
        """Test parsing content without YAML block."""
        content = "# Test Dish\n\nJust text content."
        yaml_start, yaml_end, data = parse_yaml_block(content)
        
        self.assertIsNone(yaml_start)
        self.assertIsNone(yaml_end)
        self.assertIsNone(data)

    def test_parse_malformed_yaml(self):
        """Test parsing malformed YAML."""
        content = """# Test Dish

```yaml
id: test_dish
per_portion:
  energy_kcal: invalid: yaml: structure
```
"""
        yaml_start, yaml_end, data = parse_yaml_block(content)
        
        self.assertIsNone(yaml_start)
        self.assertIsNone(yaml_end)
        self.assertIsNone(data)

    def test_parse_yaml_unicode(self):
        """Test parsing YAML with Unicode characters."""
        content = """# Test Dish with Unicode: café

```yaml
id: test_café_dish
description: "Café latte ☕"
per_portion:
  energy_kcal: 100
```
"""
        yaml_start, yaml_end, data = parse_yaml_block(content)
        
        self.assertIsNotNone(yaml_start)
        self.assertIsNotNone(yaml_end)
        self.assertIsNotNone(data)
        self.assertEqual(data["id"], "test_café_dish")
        self.assertIn("☕", data["description"])


class TestAddNewNutrientsLogic(unittest.TestCase):
    """Tests for add_new_nutrients logic embedded in migrate_file."""

    def test_add_new_nutrients_to_empty_section(self):
        """Test adding nutrients to empty per_portion section."""
        data = {"per_portion": {}}
        
        # Simulate the logic from migrate_file
        per_portion = data.get('per_portion', {})
        added_nutrients = []
        
        for nutrient_name, default_value in NEW_NUTRIENTS:
            if nutrient_name not in per_portion:
                per_portion[nutrient_name] = default_value
                added_nutrients.append(nutrient_name)
        
        data['per_portion'] = per_portion
        
        self.assertEqual(len(added_nutrients), 28)
        for name, _ in NEW_NUTRIENTS:
            self.assertEqual(data['per_portion'][name], 0)

    def test_add_new_nutrients_preserve_existing(self):
        """Test that existing nutrients are preserved."""
        existing_nutrients = {
            "energy_kcal": 150,
            "protein_g": 20,
            "fat_g": 5,
            "copper_mg": 1.5,  # This NEW_NUTRIENT already exists
        }
        data = {"per_portion": existing_nutrients.copy()}
        
        # Simulate the logic from migrate_file
        per_portion = data.get('per_portion', {})
        added_nutrients = []
        
        for nutrient_name, default_value in NEW_NUTRIENTS:
            if nutrient_name not in per_portion:
                per_portion[nutrient_name] = default_value
                added_nutrients.append(nutrient_name)
        
        data['per_portion'] = per_portion
        
        # Should preserve existing values
        self.assertEqual(data['per_portion']['energy_kcal'], 150)
        self.assertEqual(data['per_portion']['protein_g'], 20)
        self.assertEqual(data['per_portion']['fat_g'], 5)
        self.assertEqual(data['per_portion']['copper_mg'], 1.5)  # Preserved, not overwritten
        
        # Should add 27 new nutrients (28 - 1 existing)
        self.assertEqual(len(added_nutrients), 27)
        self.assertNotIn('copper_mg', added_nutrients)

    def test_add_new_nutrients_all_exist(self):
        """Test adding nutrients when all already exist."""
        existing_nutrients = {name: 5.0 for name, _ in NEW_NUTRIENTS}
        data = {"per_portion": existing_nutrients.copy()}
        
        # Simulate the logic from migrate_file
        per_portion = data.get('per_portion', {})
        added_nutrients = []
        
        for nutrient_name, default_value in NEW_NUTRIENTS:
            if nutrient_name not in per_portion:
                per_portion[nutrient_name] = default_value
                added_nutrients.append(nutrient_name)
        
        data['per_portion'] = per_portion
        
        # Should add no nutrients
        self.assertEqual(len(added_nutrients), 0)
        # Should preserve all existing values
        for name, _ in NEW_NUTRIENTS:
            self.assertEqual(data['per_portion'][name], 5.0)


class TestBuildYamlText(unittest.TestCase):
    """Tests for build_yaml_text function."""

    def test_build_yaml_preserves_order(self):
        """Test that YAML building preserves key order."""
        data = {
            "id": "test_dish",
            "schema_version": 2,
            "per_portion": {
                "energy_kcal": 100,
                "protein_g": 10,
                "copper_mg": 0,  # Should appear in correct position
            }
        }
        
        yaml_text = build_yaml_text(data)
        lines = yaml_text.split('\n')
        
        # Check that schema_version comes after id
        id_line = next(i for i, line in enumerate(lines) if line.startswith('id:'))
        schema_line = next(i for i, line in enumerate(lines) if line.startswith('schema_version:'))
        self.assertGreater(schema_line, id_line)
        
        # Check that per_portion nutrients are in order
        per_portion_start = next(i for i, line in enumerate(lines) if line.startswith('per_portion:'))
        energy_line = next(i for i, line in enumerate(lines) if 'energy_kcal:' in line)
        protein_line = next(i for i, line in enumerate(lines) if 'protein_g:' in line)
        copper_line = next(i for i, line in enumerate(lines) if 'copper_mg:' in line)
        
        self.assertGreater(energy_line, per_portion_start)
        self.assertGreater(protein_line, energy_line)
        self.assertGreater(copper_line, protein_line)  # copper_mg should come much later in order

    def test_build_yaml_numeric_formatting(self):
        """Test that numeric values are formatted correctly."""
        data = {
            "id": "test_dish",
            "per_portion": {
                "energy_kcal": 100.0,
                "protein_g": 10,
                "copper_mg": 0,
            }
        }
        
        yaml_text = build_yaml_text(data)
        
        # Integer values should not have .0
        self.assertIn("energy_kcal: 100", yaml_text)
        self.assertIn("protein_g: 10", yaml_text)
        self.assertIn("copper_mg: 0", yaml_text)

    def test_build_yaml_string_handling(self):
        """Test that strings with special characters are handled correctly."""
        data = {
            "id": "test_dish",
            "notes": ["Contains: sugar, milk"],
            "description": "A dish with special chars: éñ"
        }
        
        yaml_text = build_yaml_text(data)
        
        # Should handle unicode and special characters
        self.assertIn("éñ", yaml_text)
        self.assertIn("Contains: sugar, milk", yaml_text)


class TestMigrateFile(unittest.TestCase):
    """Tests for migrate_file function using temporary files."""

    def setUp(self):
        """Set up temporary directory for each test."""
        self.temp_dir = Path(tempfile.mkdtemp())

    def tearDown(self):
        """Clean up temporary directory after each test."""
        shutil.rmtree(self.temp_dir)

    def create_test_file(self, content):
        """Helper to create a temporary test file."""
        test_file = self.temp_dir / "test_dish.md"
        test_file.write_text(content, encoding='utf-8')
        return test_file

    def test_migrate_file_success(self):
        """Test successful file migration."""
        content = """# Test Dish

```yaml
id: test_dish_v1
schema_version: 1
per_portion:
  energy_kcal: 100
  protein_g: 10
  fat_g: 5
change_log:
  - date: "2025-01-01"
    updated_by: "test"
    change: "Initial creation"
```

Description of the dish.
"""
        test_file = self.create_test_file(content)
        
        success, message = migrate_file(test_file, dry_run=False, verbose=False)
        
        self.assertTrue(success)
        self.assertIn("Successfully migrated", message)
        
        # Read back and verify
        migrated_content = test_file.read_text(encoding='utf-8')
        yaml_start, yaml_end, data = parse_yaml_block(migrated_content)
        
        self.assertIsNotNone(data)
        self.assertEqual(data["schema_version"], 2)
        self.assertEqual(len(data["change_log"]), 2)  # Original + migration entry
        
        # Check that all 28 new nutrients were added
        new_nutrient_names = [name for name, _ in NEW_NUTRIENTS]
        for name in new_nutrient_names:
            self.assertIn(name, data["per_portion"])
            self.assertEqual(data["per_portion"][name], 0)
        
        # Check that existing values were preserved
        self.assertEqual(data["per_portion"]["energy_kcal"], 100)
        self.assertEqual(data["per_portion"]["protein_g"], 10)
        self.assertEqual(data["per_portion"]["fat_g"], 5)

    def test_migrate_file_preserves_existing_values(self):
        """Test that migration preserves all existing nutrient values."""
        content = """# Test Dish

```yaml
id: test_preservation
schema_version: 1
per_portion:
  energy_kcal: 250.5
  protein_g: 20.3
  fat_g: 12.1
  sat_fat_g: 4.5
  carbs_available_g: 30.2
  fiber_total_g: 5.8
  sodium_mg: 450
  vitamin_c_mg: 25.0
  copper_mg: 1.2
change_log: []
```
"""
        test_file = self.create_test_file(content)
        
        success, message = migrate_file(test_file, dry_run=False, verbose=False)
        
        self.assertTrue(success)
        
        # Read back and verify all original values preserved
        migrated_content = test_file.read_text(encoding='utf-8')
        yaml_start, yaml_end, data = parse_yaml_block(migrated_content)
        
        self.assertEqual(data["per_portion"]["energy_kcal"], 250.5)
        self.assertEqual(data["per_portion"]["protein_g"], 20.3)
        self.assertEqual(data["per_portion"]["fat_g"], 12.1)
        self.assertEqual(data["per_portion"]["sat_fat_g"], 4.5)
        self.assertEqual(data["per_portion"]["carbs_available_g"], 30.2)
        self.assertEqual(data["per_portion"]["fiber_total_g"], 5.8)
        self.assertEqual(data["per_portion"]["sodium_mg"], 450)
        self.assertEqual(data["per_portion"]["vitamin_c_mg"], 25.0)
        self.assertEqual(data["per_portion"]["copper_mg"], 1.2)  # Pre-existing, should be preserved

    def test_migrate_file_idempotent(self):
        """Test that migration is idempotent (safe to run multiple times)."""
        content = """# Test Dish

```yaml
id: test_idempotent
schema_version: 1
per_portion:
  energy_kcal: 100
  protein_g: 10
change_log: []
```
"""
        test_file = self.create_test_file(content)
        
        # First migration
        success1, message1 = migrate_file(test_file, dry_run=False, verbose=False)
        self.assertTrue(success1)
        
        # Read the migrated content
        migrated_content = test_file.read_text(encoding='utf-8')
        yaml_start, yaml_end, data_first = parse_yaml_block(migrated_content)
        
        # Second migration (should be skipped)
        success2, message2 = migrate_file(test_file, dry_run=False, verbose=False)
        self.assertIsNone(success2)  # None indicates skipped
        self.assertIn("Already migrated", message2)
        
        # Content should be unchanged
        content_after_second = test_file.read_text(encoding='utf-8')
        self.assertEqual(content_after_second, migrated_content)
        
        # Change log should still have only 1 entry (migration entry, original was empty)
        yaml_start, yaml_end, data_second = parse_yaml_block(content_after_second)
        self.assertEqual(len(data_second["change_log"]), 1)

    def test_migrate_file_dry_run(self):
        """Test dry-run mode doesn't modify files."""
        content = """# Test Dish

```yaml
id: test_dry_run
schema_version: 1
per_portion:
  energy_kcal: 100
change_log: []
```
"""
        test_file = self.create_test_file(content)
        original_content = test_file.read_text(encoding='utf-8')
        
        success, message = migrate_file(test_file, dry_run=True, verbose=False)
        
        self.assertTrue(success)
        self.assertTrue("DRY-RUN" in message or "Would migrate" in message)
        
        # File should be unchanged
        content_after = test_file.read_text(encoding='utf-8')
        self.assertEqual(content_after, original_content)

    def test_migrate_file_malformed_yaml(self):
        """Test handling of malformed YAML."""
        content = """# Test Dish

```yaml
id: test_malformed
schema_version: 1
per_portion:
  energy_kcal: invalid: yaml: structure
```
"""
        test_file = self.create_test_file(content)
        
        success, message = migrate_file(test_file, dry_run=False, verbose=False)
        
        self.assertFalse(success)
        self.assertIn("Failed to parse YAML", message)

    def test_migrate_file_unicode_handling(self):
        """Test migration with Unicode characters."""
        content = """# Test Dish: Café Latte ☕

```yaml
id: test_café_latte
schema_version: 1
description: "Delicious café latte with steamed milk ☕"
per_portion:
  energy_kcal: 150
  protein_g: 8
change_log: []
```

A wonderful café beverage.
"""
        test_file = self.create_test_file(content)
        
        success, message = migrate_file(test_file, dry_run=False, verbose=False)
        
        self.assertTrue(success)
        
        # Verify Unicode characters are preserved
        migrated_content = test_file.read_text(encoding='utf-8')
        self.assertIn("☕", migrated_content)
        self.assertIn("café", migrated_content)
        
        yaml_start, yaml_end, data = parse_yaml_block(migrated_content)
        self.assertIn("☕", data["description"])

    def test_migrate_file_adds_change_log_entry(self):
        """Test that migration adds proper change log entry."""
        content = """# Test Dish

```yaml
id: test_change_log
schema_version: 1
per_portion:
  energy_kcal: 100
change_log:
  - date: "2025-01-01"
    updated_by: "original_author"
    change: "Initial creation"
```
"""
        test_file = self.create_test_file(content)
        
        success, message = migrate_file(test_file, dry_run=False, verbose=False)
        
        self.assertTrue(success)
        
        migrated_content = test_file.read_text(encoding='utf-8')
        yaml_start, yaml_end, data = parse_yaml_block(migrated_content)
        
        # Should have 2 entries now
        self.assertEqual(len(data["change_log"]), 2)
        
        # Check migration entry
        migration_entry = data["change_log"][-1]
        self.assertEqual(migration_entry["date"], MIGRATION_DATE)
        self.assertEqual(migration_entry["updated_by"], MIGRATION_AUTHOR)
        self.assertIn("Schema migration", migration_entry["change"])
        self.assertTrue("27 new nutrient fields" in migration_entry["change"] or "28 new nutrient fields" in migration_entry["change"])


class TestEdgeCases(unittest.TestCase):
    """Tests for edge cases and error handling."""

    def test_file_not_found(self):
        """Test handling of non-existent files."""
        non_existent_file = Path("/non/existent/file.md")
        
        success, message = migrate_file(non_existent_file, dry_run=False, verbose=False)
        
        self.assertFalse(success)
        self.assertIn("Failed to migrate", message)

    def test_empty_file(self):
        """Test handling of empty files."""
        temp_dir = Path(tempfile.mkdtemp())
        try:
            empty_file = temp_dir / "empty.md"
            empty_file.write_text("", encoding='utf-8')
            
            success, message = migrate_file(empty_file, dry_run=False, verbose=False)
            
            self.assertFalse(success)
            self.assertIn("Failed to parse YAML", message)
        finally:
            shutil.rmtree(temp_dir)

    def test_file_no_yaml_block(self):
        """Test handling of files without YAML blocks."""
        temp_dir = Path(tempfile.mkdtemp())
        try:
            no_yaml_file = temp_dir / "no_yaml.md"
            no_yaml_file.write_text("# Just a regular markdown file\n\nNo YAML here.", encoding='utf-8')
            
            success, message = migrate_file(no_yaml_file, dry_run=False, verbose=False)
            
            self.assertFalse(success)
            self.assertIn("Failed to parse YAML", message)
        finally:
            shutil.rmtree(temp_dir)


class TestIntegration(unittest.TestCase):
    """Integration tests combining multiple aspects of migration."""

    def test_full_migration_workflow(self):
        """Test complete migration workflow on a realistic file."""
        temp_dir = Path(tempfile.mkdtemp())
        try:
            # Create a realistic dish file
            content = """# Grilled Chicken Breast

A simple, lean protein source.

```yaml
id: grilled_chicken_breast_100g
schema_version: 1
version: 1
last_verified: "2025-01-01"
source: "nutrition_database"
category: protein
portion: "100g grilled chicken breast"
per_portion:
  energy_kcal: 165
  protein_g: 31.0
  fat_g: 3.6
  sat_fat_g: 1.0
  carbs_available_g: 0.0
  carbs_total_g: 0.0
  fiber_total_g: 0.0
  sodium_mg: 74
  potassium_mg: 256
  calcium_mg: 15
  iron_mg: 1.0
  vitamin_c_mg: 0.0
quality:
  source_reliability: high
  measurement_precision: high
change_log:
  - date: "2025-01-01"
    updated_by: "nutritionist"
    change: "Initial nutritional analysis"
```

Cooking notes: Grill at medium-high heat for 6-8 minutes per side.
"""
            
            test_file = temp_dir / "chicken_breast.md"
            test_file.write_text(content, encoding='utf-8')
            
            # Migrate the file
            success, message = migrate_file(test_file, dry_run=False, verbose=False)
            
            self.assertTrue(success)
            
            # Verify the migration
            migrated_content = test_file.read_text(encoding='utf-8')
            yaml_start, yaml_end, data = parse_yaml_block(migrated_content)
            
            # Check schema version updated
            self.assertEqual(data["schema_version"], 2)
            
            # Check all original values preserved
            self.assertEqual(data["per_portion"]["energy_kcal"], 165)
            self.assertEqual(data["per_portion"]["protein_g"], 31.0)
            self.assertEqual(data["per_portion"]["fat_g"], 3.6)
            self.assertEqual(data["per_portion"]["carbs_available_g"], 0.0)
            
            # Check all 28 new nutrients added
            new_nutrient_names = [name for name, _ in NEW_NUTRIENTS]
            for name in new_nutrient_names:
                self.assertIn(name, data["per_portion"])
                self.assertEqual(data["per_portion"][name], 0)
            
            # Check change log updated
            self.assertEqual(len(data["change_log"]), 2)
            migration_entry = data["change_log"][-1]
            self.assertEqual(migration_entry["date"], MIGRATION_DATE)
            self.assertIn("Schema migration", migration_entry["change"])
            
            # Check that non-YAML content is preserved
            self.assertIn("Cooking notes:", migrated_content)
            self.assertIn("Grill at medium-high heat", migrated_content)

        finally:
            shutil.rmtree(temp_dir)

    def test_migration_preserves_complex_structures(self):
        """Test that migration preserves complex YAML structures."""
        temp_dir = Path(tempfile.mkdtemp())
        try:
            content = """# Complex Dish

```yaml
id: complex_dish
schema_version: 1
aliases:
  - "alternative_name"
  - "another_name"
assumptions:
  - "Organic ingredients"
  - "Standard preparation method"
per_portion:
  energy_kcal: 200
  protein_g: 15
derived:
  protein_density: 0.075
  fat_percentage: 12.5
quality:
  source_reliability: medium
  notes: "Estimated values"
notes:
  - "Contains allergens: milk, nuts"
  - "May contain traces of gluten"
change_log:
  - date: "2025-01-01"
    updated_by: "chef"
    change: "Recipe development"
  - date: "2025-01-02"  
    updated_by: "nutritionist"
    change: "Nutritional analysis"
```
"""
            
            test_file = temp_dir / "complex_dish.md"
            test_file.write_text(content, encoding='utf-8')
            
            success, message = migrate_file(test_file, dry_run=False, verbose=False)
            
            self.assertTrue(success)
            
            migrated_content = test_file.read_text(encoding='utf-8')
            yaml_start, yaml_end, data = parse_yaml_block(migrated_content)
            
            # Check complex structures preserved
            self.assertEqual(len(data["aliases"]), 2)
            self.assertIn("alternative_name", data["aliases"])
            
            self.assertEqual(len(data["assumptions"]), 2)
            self.assertIn("Organic ingredients", data["assumptions"])
            
            self.assertEqual(data["derived"]["protein_density"], 0.075)
            self.assertEqual(data["derived"]["fat_percentage"], 12.5)
            
            self.assertEqual(data["quality"]["source_reliability"], "medium")
            
            self.assertEqual(len(data["notes"]), 2)
            self.assertIn("Contains allergens", data["notes"][0])
            
            # Original change log entries preserved + migration entry
            self.assertEqual(len(data["change_log"]), 3)
            self.assertEqual(data["change_log"][0]["updated_by"], "chef")
            self.assertEqual(data["change_log"][1]["updated_by"], "nutritionist")
            self.assertEqual(data["change_log"][2]["updated_by"], MIGRATION_AUTHOR)

        finally:
            shutil.rmtree(temp_dir)


if __name__ == "__main__":
    unittest.main(verbosity=2)