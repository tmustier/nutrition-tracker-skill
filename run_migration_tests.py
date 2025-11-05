#!/usr/bin/env python3
"""
Simple test runner for migration tests to demonstrate functionality.
This script runs a subset of the tests to verify the migration logic works.
"""
import sys
import tempfile
import shutil
from pathlib import Path

# Add scripts directory to path
scripts_dir = Path(__file__).parent / "scripts"
sys.path.insert(0, str(scripts_dir))

try:
    from migrate_nutrients_v1_to_v2 import (
        NEW_NUTRIENTS,
        needs_migration,
        parse_yaml_block,
        migrate_file,
        MIGRATION_DATE,
        MIGRATION_AUTHOR,
        MIGRATION_CHANGE,
    )
    print("✅ Successfully imported all migration functions")
except Exception as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)

def test_new_nutrients_count():
    """Test that NEW_NUTRIENTS contains exactly 28 nutrients."""
    actual_count = len(NEW_NUTRIENTS)
    expected_count = 28
    if actual_count == expected_count:
        print(f"✅ NEW_NUTRIENTS count test passed: {actual_count} nutrients")
        return True
    else:
        print(f"❌ NEW_NUTRIENTS count test failed: expected {expected_count}, got {actual_count}")
        return False

def test_needs_migration_logic():
    """Test needs_migration function logic."""
    tests = [
        ({"schema_version": 1}, True, "should need migration for v1"),
        ({"schema_version": 2}, False, "should NOT need migration for v2"),
        ({}, True, "should need migration when schema_version missing"),
    ]
    
    all_passed = True
    for test_data, expected_needs_mig, description in tests:
        needs_mig, reason = needs_migration(test_data)
        if needs_mig == expected_needs_mig:
            print(f"✅ needs_migration test passed: {description}")
        else:
            print(f"❌ needs_migration test failed: {description} - expected {expected_needs_mig}, got {needs_mig}")
            all_passed = False
    
    return all_passed

def test_yaml_parsing():
    """Test YAML parsing functionality."""
    content = """# Test Dish

```yaml
id: test_dish
schema_version: 1
per_portion:
  energy_kcal: 100
  protein_g: 10
```

More content.
"""
    yaml_start, yaml_end, data = parse_yaml_block(content)
    
    if data is not None and data["id"] == "test_dish" and data["schema_version"] == 1:
        print("✅ YAML parsing test passed")
        return True
    else:
        print("❌ YAML parsing test failed")
        return False

def test_file_migration():
    """Test actual file migration."""
    temp_dir = Path(tempfile.mkdtemp())
    try:
        content = """# Test Dish

```yaml
id: test_migration
schema_version: 1
per_portion:
  energy_kcal: 100
  protein_g: 10
change_log: []
```
"""
        test_file = temp_dir / "test.md"
        test_file.write_text(content, encoding='utf-8')
        
        # Migrate the file
        success, message = migrate_file(test_file, dry_run=False, verbose=False)
        
        if not success:
            print(f"❌ File migration test failed: {message}")
            return False
        
        # Verify migration
        migrated_content = test_file.read_text(encoding='utf-8')
        yaml_start, yaml_end, data = parse_yaml_block(migrated_content)
        
        if data is None:
            print("❌ File migration test failed: could not parse migrated YAML")
            return False
        
        # Check schema version updated
        if data["schema_version"] != 2:
            print(f"❌ File migration test failed: schema_version not updated, got {data['schema_version']}")
            return False
        
        # Check new nutrients added
        new_nutrient_names = [name for name, _ in NEW_NUTRIENTS]
        missing_nutrients = []
        for name in new_nutrient_names:
            if name not in data["per_portion"]:
                missing_nutrients.append(name)
        
        if missing_nutrients:
            print(f"❌ File migration test failed: missing nutrients {missing_nutrients}")
            return False
        
        # Check original values preserved
        if data["per_portion"]["energy_kcal"] != 100 or data["per_portion"]["protein_g"] != 10:
            print("❌ File migration test failed: original values not preserved")
            return False
        
        print("✅ File migration test passed")
        return True
        
    except Exception as e:
        print(f"❌ File migration test failed with exception: {e}")
        return False
    finally:
        shutil.rmtree(temp_dir)

def test_idempotency():
    """Test that migration is idempotent."""
    temp_dir = Path(tempfile.mkdtemp())
    try:
        content = """# Test Dish

```yaml
id: test_idempotent
schema_version: 1
per_portion:
  energy_kcal: 100
change_log: []
```
"""
        test_file = temp_dir / "test.md"
        test_file.write_text(content, encoding='utf-8')
        
        # First migration
        success1, message1 = migrate_file(test_file, dry_run=False, verbose=False)
        if not success1:
            print(f"❌ Idempotency test failed on first migration: {message1}")
            return False
        
        # Second migration (should be skipped)
        success2, message2 = migrate_file(test_file, dry_run=False, verbose=False)
        if success2 is not None:  # None indicates skipped
            print(f"❌ Idempotency test failed: second migration was not skipped, got {success2}")
            return False
        
        if "Already migrated" not in message2:
            print(f"❌ Idempotency test failed: wrong skip message '{message2}'")
            return False
        
        print("✅ Idempotency test passed")
        return True
        
    except Exception as e:
        print(f"❌ Idempotency test failed with exception: {e}")
        return False
    finally:
        shutil.rmtree(temp_dir)

def main():
    """Run all tests."""
    print("Running migration tests...")
    print("=" * 50)
    
    tests = [
        test_new_nutrients_count,
        test_needs_migration_logic,
        test_yaml_parsing,
        test_file_migration,
        test_idempotency,
    ]
    
    passed = 0
    total = len(tests)
    
    for test_func in tests:
        try:
            if test_func():
                passed += 1
        except Exception as e:
            print(f"❌ {test_func.__name__} failed with exception: {e}")
    
    print("=" * 50)
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        return 0
    else:
        print("💥 Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())