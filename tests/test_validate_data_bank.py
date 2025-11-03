#!/usr/bin/env python3
"""
Unit tests for the data bank validation script.
Tests energy calculations, carbohydrate relationships, and validation logic.
"""
import sys
from pathlib import Path

# Add scripts directory to path
scripts_dir = Path(__file__).parent.parent / "scripts"
sys.path.insert(0, str(scripts_dir))

import pytest
from validate_data_bank import (
    available_energy_kcal,
    approx_equal,
    check_block,
    FIBER_KCAL_PER_G,
    POLYOL_KCAL_PER_G,
    TOL_ENERGY_PCT,
    CARB_TOL_G,
    REQUIRED_NUTRIENTS,
)


class TestEnergyCalculation:
    """Tests for available_energy_kcal function."""

    def test_basic_energy_calculation(self):
        """Test standard 4-4-9 Atwater calculation with available carbs."""
        # 4×10 + 9×5 + 4×20 = 165 kcal
        result = available_energy_kcal(protein=10, fat=5, carbs_available=20, fibre=None, polyols=None)
        assert result == 165.0

    def test_energy_with_fiber(self):
        """Test energy calculation including fiber at 2 kcal/g."""
        # 4×10 + 9×5 + 4×20 + 2×5 = 175 kcal
        result = available_energy_kcal(protein=10, fat=5, carbs_available=20, fibre=5, polyols=None)
        assert result == 175.0

    def test_energy_with_polyols(self):
        """Test energy calculation including polyols at 2.4 kcal/g."""
        # 4×21 + 9×10 + 4×20 + 2×0.9 + 2.4×17 = 296.6 kcal (Grenade bar)
        result = available_energy_kcal(protein=21, fat=10, carbs_available=20, fibre=0.9, polyols=17)
        assert abs(result - 296.6) < 0.1

    def test_energy_with_none_inputs(self):
        """Test that None inputs return None."""
        assert available_energy_kcal(None, 5, 20, 5, 0) is None
        assert available_energy_kcal(10, None, 20, 5, 0) is None
        assert available_energy_kcal(10, 5, None, 5, 0) is None

    def test_energy_with_zero_values(self):
        """Test zero-carb food energy calculation."""
        # 4×27.6 + 9×2.8 = 135.6 kcal (grilled chicken)
        result = available_energy_kcal(protein=27.6, fat=2.8, carbs_available=0, fibre=0, polyols=0)
        assert abs(result - 135.6) < 0.1


class TestApproxEqual:
    """Tests for approx_equal helper function."""

    def test_equal_within_tolerance(self):
        """Test values within tolerance are considered equal."""
        assert approx_equal(10.0, 10.1, tol=0.2) is True
        assert approx_equal(10.0, 9.9, tol=0.2) is True

    def test_not_equal_outside_tolerance(self):
        """Test values outside tolerance are not equal."""
        assert approx_equal(10.0, 10.3, tol=0.2) is False
        assert approx_equal(10.0, 9.6, tol=0.2) is False

    def test_none_values(self):
        """Test None values return False."""
        assert approx_equal(None, 10.0, tol=0.2) is False
        assert approx_equal(10.0, None, tol=0.2) is False
        assert approx_equal(None, None, tol=0.2) is False


class TestCarbValidation:
    """Tests for carbohydrate relationship validation."""

    def test_valid_carb_relationship(self):
        """Test valid carb_total = carb_available + fiber + polyols."""
        block = {
            "id": "test_valid_carbs",
            "per_portion": {
                "carbs_total_g": 38.5,
                "carbs_available_g": 33.2,
                "fiber_total_g": 5.3,
                "polyols_g": 0.0,
                "energy_kcal": 208.9,
                "protein_g": 8.5,
                "fat_g": 3.5,
            },
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        # Should not have carb-related warnings
        carb_warnings = [w for w in result["warnings"] if "carbs_total_g" in w]
        assert len(carb_warnings) == 0

    def test_carb_relationship_mismatch(self):
        """Test carb total doesn't match components."""
        block = {
            "id": "test_carb_mismatch",
            "per_portion": {
                "carbs_total_g": 40.0,  # Should be 38.5
                "carbs_available_g": 33.2,
                "fiber_total_g": 5.3,
                "polyols_g": 0.0,
                "energy_kcal": 208.9,
                "protein_g": 8.5,
                "fat_g": 3.5,
            },
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        # Should have carb mismatch warning
        carb_warnings = [w for w in result["warnings"] if "carbs_total_g mismatch" in w]
        assert len(carb_warnings) == 1
        assert "expected 38.5" in carb_warnings[0]

    def test_carb_with_polyols(self):
        """Test carb calculation with polyols (Grenade bar case)."""
        block = {
            "id": "test_polyols",
            "per_portion": {
                "carbs_total_g": 37.9,
                "carbs_available_g": 20.0,
                "fiber_total_g": 0.9,
                "polyols_g": 17.0,
                "energy_kcal": 296.6,
                "protein_g": 21.0,
                "fat_g": 10.0,
            },
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        # Should not have carb-related warnings
        carb_warnings = [w for w in result["warnings"] if "carbs_total_g" in w]
        assert len(carb_warnings) == 0


class TestPolyolCrossCheck:
    """Tests for polyol mention cross-checking."""

    def test_polyol_mention_without_field(self):
        """Test warning when notes mention polyols but field is 0 or null."""
        block = {
            "id": "test_polyol_mention",
            "per_portion": {
                "carbs_total_g": 20.9,
                "carbs_available_g": 20.0,
                "fiber_total_g": 0.9,
                "polyols_g": 0.0,  # Should be 17.0
                "energy_kcal": 255.8,
                "protein_g": 21.0,
                "fat_g": 10.0,
            },
            "derived": {},
            "quality": {},
            "notes": ["Contains 17g sugar alcohols/polyols (maltitol)"],
        }
        result = check_block(block)
        # Should have polyol cross-check warning
        polyol_warnings = [w for w in result["warnings"] if "polyol" in w.lower()]
        assert len(polyol_warnings) >= 1
        assert "17" in polyol_warnings[0]

    def test_polyol_mention_with_correct_field(self):
        """Test pass when notes mention polyols and field is set."""
        block = {
            "id": "test_polyol_correct",
            "per_portion": {
                "carbs_total_g": 37.9,
                "carbs_available_g": 20.0,
                "fiber_total_g": 0.9,
                "polyols_g": 17.0,
                "energy_kcal": 296.6,
                "protein_g": 21.0,
                "fat_g": 10.0,
            },
            "derived": {},
            "quality": {},
            "notes": ["Contains 17g maltitol"],
        }
        result = check_block(block)
        # Should have pass message
        polyol_passes = [p for p in result["passes"] if "polyol" in p.lower()]
        assert len(polyol_passes) >= 1


class TestFatSplitValidation:
    """Tests for fat split validation."""

    def test_fat_split_exceeds_total(self):
        """Test warning when fat components exceed total fat."""
        block = {
            "id": "test_fat_excess",
            "per_portion": {
                "fat_g": 10.0,
                "sat_fat_g": 6.0,
                "mufa_g": 3.0,
                "pufa_g": 2.0,  # Total = 11.0 > 10.0
                "carbs_total_g": 0.0,
                "carbs_available_g": 0.0,
                "fiber_total_g": 0.0,
                "polyols_g": 0.0,
                "energy_kcal": 90.0,
                "protein_g": 0.0,
            },
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        fat_warnings = [w for w in result["warnings"] if "Fat split" in w and "exceeds" in w]
        assert len(fat_warnings) == 1

    def test_fat_split_incomplete(self):
        """Test warning when fat components are significantly incomplete."""
        block = {
            "id": "test_fat_incomplete",
            "per_portion": {
                "fat_g": 10.0,
                "sat_fat_g": 3.0,  # Only 3.0 out of 10.0 accounted for
                "carbs_total_g": 0.0,
                "carbs_available_g": 0.0,
                "fiber_total_g": 0.0,
                "polyols_g": 0.0,
                "energy_kcal": 90.0,
                "protein_g": 0.0,
            },
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        fat_warnings = [w for w in result["warnings"] if "Fat split incomplete" in w]
        assert len(fat_warnings) == 1
        assert "missing 7.0" in fat_warnings[0]

    def test_fat_split_coherent(self):
        """Test pass when fat split is complete and coherent."""
        block = {
            "id": "test_fat_coherent",
            "per_portion": {
                "fat_g": 10.0,
                "sat_fat_g": 4.0,
                "mufa_g": 4.0,
                "pufa_g": 2.0,  # Total = 10.0
                "carbs_total_g": 0.0,
                "carbs_available_g": 0.0,
                "fiber_total_g": 0.0,
                "polyols_g": 0.0,
                "energy_kcal": 90.0,
                "protein_g": 0.0,
            },
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        fat_passes = [p for p in result["passes"] if "Fat split coherent" in p]
        assert len(fat_passes) == 1


class TestEnergyValidation:
    """Tests for energy validation against formula."""

    def test_energy_within_tolerance(self):
        """Test energy calculation within 8% tolerance."""
        block = {
            "id": "test_energy_ok",
            "per_portion": {
                "energy_kcal": 210.0,  # Within 8% of 208.9
                "protein_g": 8.5,
                "fat_g": 3.5,
                "carbs_available_g": 33.2,
                "fiber_total_g": 5.3,
                "polyols_g": 0.0,
                "carbs_total_g": 38.5,
            },
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        energy_issues = [i for i in result["issues"] if "energy mismatch" in i.lower()]
        assert len(energy_issues) == 0

    def test_energy_outside_tolerance(self):
        """Test energy calculation outside 8% tolerance."""
        block = {
            "id": "test_energy_mismatch",
            "per_portion": {
                "energy_kcal": 250.0,  # Way off from 208.9 (>8%)
                "protein_g": 8.5,
                "fat_g": 3.5,
                "carbs_available_g": 33.2,
                "fiber_total_g": 5.3,
                "polyols_g": 0.0,
                "carbs_total_g": 38.5,
            },
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        energy_issues = [i for i in result["issues"] if "energy mismatch" in i.lower()]
        assert len(energy_issues) == 1


class TestZeroVsUnknownValidation:
    """Tests for zero vs unknown (0.0 vs null) validation."""

    def test_zero_carbs_with_null_available(self):
        """Test warning when carbs_total is 0.0 but carbs_available is null."""
        block = {
            "id": "test_zero_vs_null",
            "per_portion": {
                "carbs_total_g": 0.0,
                "carbs_available_g": None,  # Should be 0.0 if confirmed zero-carb
                "fiber_total_g": 0.0,
                "polyols_g": 0.0,
                "energy_kcal": 135.6,
                "protein_g": 27.6,
                "fat_g": 2.8,
            },
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        zero_warnings = [w for w in result["warnings"] if "0.0 but carbs_available_g is null" in w]
        assert len(zero_warnings) == 1


class TestEdgeCases:
    """Tests for edge cases and error handling."""

    def test_missing_id(self):
        """Test handling of block without id."""
        block = {"per_portion": {}, "derived": {}, "quality": {}}
        result = check_block(block)
        assert result["id"] is None
        assert len(result["issues"]) > 0

    def test_missing_sections(self):
        """Test warning for missing required sections."""
        block = {"id": "test_missing_sections"}
        result = check_block(block)
        assert any("Missing section" in i for i in result["issues"])

    def test_negative_values(self):
        """Test detection of negative values."""
        block = {
            "id": "test_negative",
            "per_portion": {
                "protein_g": -5.0,  # Invalid
                "carbs_available_g": 20.0,
                "fat_g": 5.0,
                "energy_kcal": 100.0,
            },
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        negative_issues = [i for i in result["issues"] if "Negative" in i]
        assert len(negative_issues) == 1


class TestMissingRequiredFields:
    """Tests for missing required nutrient fields validation."""

    def test_missing_single_field(self):
        """Test detection of a single missing required field."""
        # Create a block with all required fields except one
        per_portion = {field: 0.0 for field in REQUIRED_NUTRIENTS}
        del per_portion["iodine_ug"]  # Remove one field

        block = {
            "id": "test_missing_iodine",
            "per_portion": per_portion,
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        missing_issues = [i for i in result["issues"] if "Missing required field" in i and "iodine_ug" in i]
        assert len(missing_issues) == 1
        assert "iodine_ug" in missing_issues[0]

    def test_missing_multiple_fields(self):
        """Test detection of multiple missing required fields."""
        block = {
            "id": "test_missing_multiple",
            "per_portion": {
                "energy_kcal": 100.0,
                "protein_g": 10.0,
                "fat_g": 5.0,
                # Missing most other fields
            },
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        missing_issues = [i for i in result["issues"] if "Missing required field" in i]
        # Should have multiple missing field issues
        assert len(missing_issues) > 5

    def test_all_required_fields_present(self):
        """Test that no missing field issues occur when all fields are present."""
        # Create a complete block with all required fields
        per_portion = {field: 0.0 for field in REQUIRED_NUTRIENTS}
        per_portion["energy_kcal"] = 100.0
        per_portion["protein_g"] = 10.0
        per_portion["fat_g"] = 5.0
        per_portion["carbs_available_g"] = 10.0

        block = {
            "id": "test_all_fields",
            "per_portion": per_portion,
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        missing_issues = [i for i in result["issues"] if "Missing required field" in i]
        assert len(missing_issues) == 0

    def test_missing_vs_null_field(self):
        """Test that missing fields are caught separately from null fields."""
        per_portion = {field: 0.0 for field in REQUIRED_NUTRIENTS}
        del per_portion["iodine_ug"]  # Remove field (missing)
        per_portion["vitamin_c_mg"] = None  # Set to null

        block = {
            "id": "test_missing_vs_null",
            "per_portion": per_portion,
            "derived": {},
            "quality": {},
        }
        result = check_block(block)

        # Should have one issue for missing field
        missing_issues = [i for i in result["issues"] if "Missing required field" in i and "iodine_ug" in i]
        assert len(missing_issues) == 1

        # Should have one issue for null field
        null_issues = [i for i in result["issues"] if "NULL value not allowed" in i and "vitamin_c_mg" in i]
        assert len(null_issues) == 1


class TestIntegration:
    """Integration tests for full validation workflow."""

    def test_validate_real_dish_zero_carb(self):
        """Test validation of a zero-carb dish (chicken breast)."""
        block = {
            "id": "test_chicken",
            "per_portion": {
                "energy_kcal": 135.6,
                "protein_g": 27.6,
                "fat_g": 2.8,
                "sat_fat_g": 0.9,
                "mufa_g": 1.1,
                "pufa_g": 0.7,
                "fiber_total_g": 0.0,
                "carbs_available_g": 0.0,
                "carbs_total_g": 0.0,
                "polyols_g": 0.0,
                "sodium_mg": 212,
            },
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        assert len(result["issues"]) == 0
        assert any("Energy within tolerance" in p for p in result["passes"])

    def test_validate_real_dish_with_carbs(self):
        """Test validation of a dish with carbs (oats)."""
        block = {
            "id": "test_oats",
            "per_portion": {
                "energy_kcal": 208.9,
                "protein_g": 8.5,
                "fat_g": 3.5,
                "sat_fat_g": 0.6,
                "fiber_total_g": 5.3,
                "carbs_available_g": 33.2,
                "carbs_total_g": 38.5,
                "polyols_g": 0.0,
                "sodium_mg": 4,
            },
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        assert len(result["issues"]) == 0
        assert any("Energy within tolerance" in p for p in result["passes"])

    def test_validate_real_dish_with_polyols(self):
        """Test validation of a dish with polyols (Grenade bar)."""
        block = {
            "id": "test_grenade",
            "per_portion": {
                "energy_kcal": 296.6,
                "protein_g": 21.0,
                "fat_g": 10.0,
                "sat_fat_g": 4.5,
                "fiber_total_g": 0.9,
                "carbs_available_g": 20.0,
                "carbs_total_g": 37.9,
                "polyols_g": 17.0,
                "sodium_mg": 100,
            },
            "derived": {},
            "quality": {},
            "notes": ["Contains 17g maltitol polyols"]
        }
        result = check_block(block)
        assert len(result["issues"]) == 0
        assert any("Energy within tolerance" in p for p in result["passes"])
        assert any("Polyol mentions in notes match" in p for p in result["passes"])

    def test_validate_missing_carbs_available(self):
        """Test that missing carbs_available_g is caught."""
        block = {
            "id": "test_missing_carbs",
            "per_portion": {
                "energy_kcal": 100.0,
                "protein_g": 10.0,
                "fat_g": 5.0,
                "carbs_total_g": 10.0,
                "fiber_total_g": 2.0,
                "polyols_g": 0.0,
            },
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        assert any("Missing carbs_available_g" in i for i in result["issues"])

    def test_validate_carb_relationship_mismatch(self):
        """Test that carb relationship mismatches are detected."""
        block = {
            "id": "test_carb_mismatch",
            "per_portion": {
                "energy_kcal": 100.0,
                "protein_g": 10.0,
                "fat_g": 5.0,
                "carbs_available_g": 10.0,
                "carbs_total_g": 20.0,  # Should be ~12.0 (10 + 2 + 0)
                "fiber_total_g": 2.0,
                "polyols_g": 0.0,
            },
            "derived": {},
            "quality": {},
        }
        result = check_block(block)
        assert any("carbs_total_g mismatch" in w for w in result["warnings"])

    def test_validate_polyol_note_without_field(self):
        """Test that polyol mentions in notes without polyols_g field trigger warning."""
        block = {
            "id": "test_polyol_note",
            "per_portion": {
                "energy_kcal": 250.0,
                "protein_g": 20.0,
                "fat_g": 10.0,
                "carbs_available_g": 15.0,
                "carbs_total_g": 32.0,
                "fiber_total_g": 1.0,
                "polyols_g": 0.0,  # Should be 16.0
            },
            "derived": {},
            "quality": {},
            "notes": ["Contains 16g erythritol"]
        }
        result = check_block(block)
        assert any("Notes mention polyols" in w for w in result["warnings"])


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
