#!/usr/bin/env python3
"""
Comprehensive Nutrition Estimation Opportunities Audit

Scans all food bank files to identify nutrients set to 0 that could/should be estimated
using the reference YAML files (FIBER-SPLIT, IODINE, MICRONUTRIENT).

Usage:
    python scripts/audit_estimation_opportunities.py [--output report.json]
"""

import argparse
import json
import re
import yaml
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from collections import defaultdict
from dataclasses import dataclass, asdict


@dataclass
class EstimationOpportunity:
    """Represents a single nutrient estimation opportunity"""
    nutrient: str
    current_value: float
    suggested_value: Optional[float]
    confidence: str
    reason: str
    priority: str
    source_reference: str
    usda_available: bool = False


@dataclass
class FileAudit:
    """Audit results for a single food file"""
    path: str
    file_id: str
    food_category: str
    food_description: str
    portion_weight_g: Optional[float]
    primary_ingredients: List[str]
    opportunities: List[EstimationOpportunity]

    @property
    def priority_counts(self) -> Dict[str, int]:
        counts = {'high': 0, 'medium': 0, 'low': 0}
        for opp in self.opportunities:
            counts[opp.priority] += 1
        return counts


class NutritionAuditAnalyzer:
    """Main analyzer class"""

    def __init__(self, base_path: Path):
        self.base_path = base_path
        self.references_path = base_path / "references"
        self.food_bank_path = base_path / "data" / "food-data-bank"

        # Load reference files
        self.fiber_ref = self._load_yaml(self.references_path / "FIBER-SPLIT-ESTIMATION-REFERENCE.yaml")
        self.iodine_ref = self._load_yaml(self.references_path / "IODINE-ESTIMATION-REFERENCE.yaml")
        self.micronutrient_ref = self._load_yaml(self.references_path / "MICRONUTRIENT-ESTIMATION-REFERENCE.yaml")

    def _load_yaml(self, path: Path) -> Dict:
        """Load YAML file"""
        with open(path, 'r') as f:
            return yaml.safe_load(f)

    def _extract_yaml_from_markdown(self, content: str) -> Optional[Dict]:
        """Extract YAML block from markdown file"""
        # Find YAML code block
        match = re.search(r'```yaml\n(.*?)\n```', content, re.DOTALL)
        if match:
            try:
                return yaml.safe_load(match.group(1))
            except yaml.YAMLError as e:
                print(f"YAML parse error: {e}")
                return None
        return None

    def _categorize_food(self, file_path: Path, data: Dict) -> Tuple[str, List[str]]:
        """
        Categorize food and extract primary ingredients

        Returns: (category, primary_ingredients_list)
        Categories: generic_ingredient, packaged, venue
        """
        path_str = str(file_path)

        # Determine category from path
        if '/generic/ingredients/' in path_str or '/generic-ingredients/' in path_str:
            category = "generic_ingredient"
        elif '/packaged/' in path_str:
            category = "packaged"
        elif '/venues/' in path_str:
            category = "venue"
        elif '/generic/' in path_str:
            category = "generic"
        else:
            category = "unknown"

        # Extract ingredients from file description/notes
        ingredients = []

        # Try to extract from portion notes
        portion_notes = data.get('portion', {}).get('notes', '')
        if portion_notes:
            ingredients.append(portion_notes)

        # Try to extract from general notes
        notes = data.get('notes', [])
        if isinstance(notes, list) and notes:
            ingredients.extend([str(n) for n in notes[:2]])  # First 2 notes

        # Extract from file name/ID
        file_id = data.get('id', '')
        if file_id:
            # Parse ID for ingredient hints
            id_parts = file_id.split('_')
            ingredients.append(' '.join(id_parts[:3]))

        return category, ingredients[:3]  # Limit to 3 ingredients

    def _identify_fiber_opportunities(self, data: Dict, category: str, ingredients: List[str]) -> List[EstimationOpportunity]:
        """Identify fiber split estimation opportunities"""
        opportunities = []
        per_portion = data.get('per_portion', {})

        total_fiber = per_portion.get('fiber_total_g', 0)
        soluble = per_portion.get('fiber_soluble_g', 0)
        insoluble = per_portion.get('fiber_insoluble_g', 0)

        # HIGH PRIORITY: Fiber splits where total > 0 but splits = 0
        if total_fiber > 0 and soluble == 0 and insoluble == 0:
            # Try to match food category from fiber reference
            suggested_ratio = self._get_fiber_ratio(data, ingredients)

            if suggested_ratio:
                soluble_est = round(total_fiber * suggested_ratio['soluble_percent'] / 100, 1)
                insoluble_est = round(total_fiber * suggested_ratio['insoluble_percent'] / 100, 1)

                opportunities.append(EstimationOpportunity(
                    nutrient="fiber_soluble_g",
                    current_value=0,
                    suggested_value=soluble_est,
                    confidence=suggested_ratio['confidence'],
                    reason=f"Total fiber is {total_fiber}g, {suggested_ratio['category']} category ratio {suggested_ratio['soluble_percent']}% soluble",
                    priority="high",
                    source_reference="FIBER-SPLIT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))

                opportunities.append(EstimationOpportunity(
                    nutrient="fiber_insoluble_g",
                    current_value=0,
                    suggested_value=insoluble_est,
                    confidence=suggested_ratio['confidence'],
                    reason=f"Total fiber is {total_fiber}g, {suggested_ratio['category']} category ratio {suggested_ratio['insoluble_percent']}% insoluble",
                    priority="high",
                    source_reference="FIBER-SPLIT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))

        return opportunities

    def _get_fiber_ratio(self, data: Dict, ingredients: List[str]) -> Optional[Dict]:
        """Get fiber ratio from reference based on food description"""
        if not self.fiber_ref or 'food_categories' not in self.fiber_ref:
            return None

        # Combine all text for matching
        text = ' '.join(ingredients).lower()
        file_id = data.get('id', '').lower()
        all_text = text + ' ' + file_id

        # Match against fiber reference categories
        categories = self.fiber_ref['food_categories']

        # Check specific foods first
        for cat_name, cat_data in categories.items():
            if 'subcategories' in cat_data:
                for subcat_name, subcat_data in cat_data['subcategories'].items():
                    foods = subcat_data.get('foods', [])
                    for food in foods:
                        if food.lower() in all_text:
                            return {
                                'category': f"{cat_name}.{subcat_name}",
                                'soluble_percent': subcat_data['ratios']['soluble_percent'],
                                'insoluble_percent': subcat_data['ratios']['insoluble_percent'],
                                'confidence': subcat_data.get('confidence', 'medium')
                            }

        # Fallback to broader category matching
        if any(word in all_text for word in ['oat', 'oatmeal', 'porridge']):
            return {'category': 'grains.oats', 'soluble_percent': 45, 'insoluble_percent': 55, 'confidence': 'high'}
        elif any(word in all_text for word in ['raspberry', 'raspberries', 'blackberry', 'blackberries', 'strawberry', 'blueberry']):
            return {'category': 'fruits.berries', 'soluble_percent': 35, 'insoluble_percent': 65, 'confidence': 'high'}
        elif any(word in all_text for word in ['bean', 'lentil', 'chickpea']):
            return {'category': 'legumes', 'soluble_percent': 30, 'insoluble_percent': 70, 'confidence': 'high'}
        elif any(word in all_text for word in ['almond', 'walnut', 'hazelnut', 'pistachio', 'cashew']):
            return {'category': 'nuts_seeds.tree_nuts', 'soluble_percent': 20, 'insoluble_percent': 80, 'confidence': 'high'}
        elif any(word in all_text for word in ['broccoli', 'cauliflower', 'cabbage']):
            return {'category': 'vegetables.cruciferous', 'soluble_percent': 30, 'insoluble_percent': 70, 'confidence': 'high'}
        elif any(word in all_text for word in ['spinach', 'kale', 'lettuce']):
            return {'category': 'vegetables.leafy_greens', 'soluble_percent': 25, 'insoluble_percent': 75, 'confidence': 'high'}

        # Default fallback
        return {'category': 'general_plant_foods', 'soluble_percent': 30, 'insoluble_percent': 70, 'confidence': 'low'}

    def _identify_iodine_opportunities(self, data: Dict, category: str, ingredients: List[str]) -> List[EstimationOpportunity]:
        """Identify iodine estimation opportunities"""
        opportunities = []
        per_portion = data.get('per_portion', {})

        iodine = per_portion.get('iodine_ug', 0)

        if iodine == 0:
            # Check if this is a dairy/seafood/egg product (HIGH PRIORITY)
            text = ' '.join(ingredients).lower()
            file_id = data.get('id', '').lower()
            all_text = text + ' ' + file_id

            portion_weight = data.get('portion', {}).get('est_weight_g') or 100

            # HIGH PRIORITY: Dairy products
            if any(word in all_text for word in ['milk', 'yogurt', 'yoghurt', 'cheese', 'dairy', 'skyr']):
                dairy_type = None
                if 'yogurt' in all_text or 'yoghurt' in all_text or 'skyr' in all_text:
                    dairy_type = 'yogurt'
                    typical_per_100g = 70
                elif 'cheese' in all_text:
                    dairy_type = 'cheese'
                    typical_per_100g = 30
                elif 'milk' in all_text:
                    dairy_type = 'milk'
                    typical_per_100g = 40

                if dairy_type:
                    suggested = round(typical_per_100g * (portion_weight / 100))
                    opportunities.append(EstimationOpportunity(
                        nutrient="iodine_ug",
                        current_value=0,
                        suggested_value=suggested,
                        confidence="high",
                        reason=f"UK {dairy_type} is primary iodine source (~{typical_per_100g} µg/100g). NEVER set dairy iodine to 0.",
                        priority="high",
                        source_reference="IODINE-ESTIMATION-REFERENCE.yaml",
                        usda_available=True
                    ))

            # HIGH PRIORITY: Seafood
            elif any(word in all_text for word in ['fish', 'salmon', 'cod', 'haddock', 'tuna', 'mackerel', 'sardine', 'seafood', 'prawn', 'shrimp']):
                fish_type = 'white_fish' if any(w in all_text for w in ['cod', 'haddock']) else 'fatty_fish'
                typical_per_100g = 130 if fish_type == 'white_fish' else 40
                suggested = round(typical_per_100g * (portion_weight / 100))
                opportunities.append(EstimationOpportunity(
                    nutrient="iodine_ug",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="medium",
                    reason=f"{fish_type.replace('_', ' ').title()} typically ~{typical_per_100g} µg/100g",
                    priority="high",
                    source_reference="IODINE-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))

            # MEDIUM PRIORITY: Eggs
            elif any(word in all_text for word in ['egg', 'omelette', 'scrambled']):
                typical_per_100g = 26
                suggested = round(typical_per_100g * (portion_weight / 100))
                opportunities.append(EstimationOpportunity(
                    nutrient="iodine_ug",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="medium",
                    reason=f"Eggs typically ~{typical_per_100g} µg/100g (concentrated in yolk)",
                    priority="medium",
                    source_reference="IODINE-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))

            # MEDIUM PRIORITY: Meat
            elif any(word in all_text for word in ['beef', 'chicken', 'pork', 'meat', 'steak']):
                typical_per_100g = 5
                suggested = round(typical_per_100g * (portion_weight / 100))
                opportunities.append(EstimationOpportunity(
                    nutrient="iodine_ug",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="low-medium",
                    reason=f"Meat typically ~{typical_per_100g} µg/100g (minor source)",
                    priority="medium",
                    source_reference="IODINE-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))

        return opportunities

    def _identify_micronutrient_opportunities(self, data: Dict, category: str, ingredients: List[str]) -> List[EstimationOpportunity]:
        """Identify trace mineral and vitamin estimation opportunities"""
        opportunities = []
        per_portion = data.get('per_portion', {})

        text = ' '.join(ingredients).lower()
        file_id = data.get('id', '').lower()
        all_text = text + ' ' + file_id
        portion_weight = data.get('portion', {}).get('est_weight_g') or 100

        # MANGANESE - HIGH PRIORITY for nuts/grains
        manganese = per_portion.get('manganese_mg', 0)
        if manganese == 0:
            if any(word in all_text for word in ['hazelnut', 'hazelnuts']):
                suggested = round(6.2 * (portion_weight / 100), 2)
                opportunities.append(EstimationOpportunity(
                    nutrient="manganese_mg",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="high",
                    reason="Hazelnuts ~6.2 mg/100g (USDA data available)",
                    priority="high",
                    source_reference="MICRONUTRIENT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))
            elif any(word in all_text for word in ['oat', 'oatmeal']):
                suggested = round(4.9 * (portion_weight / 100), 2)
                opportunities.append(EstimationOpportunity(
                    nutrient="manganese_mg",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="high",
                    reason="Oats ~4.9 mg/100g (USDA data available)",
                    priority="high",
                    source_reference="MICRONUTRIENT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))
            elif any(word in all_text for word in ['almond', 'pecan', 'walnut', 'pistachio']):
                suggested = round(2.3 * (portion_weight / 100), 2)
                opportunities.append(EstimationOpportunity(
                    nutrient="manganese_mg",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="high",
                    reason="Tree nuts ~2.3 mg/100g average (USDA data available)",
                    priority="high",
                    source_reference="MICRONUTRIENT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))
            elif any(word in all_text for word in ['brown rice', 'quinoa', 'whole wheat']):
                suggested = round(3.0 * (portion_weight / 100), 2)
                opportunities.append(EstimationOpportunity(
                    nutrient="manganese_mg",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="high",
                    reason="Whole grains ~3.0 mg/100g average (USDA data available)",
                    priority="medium",
                    source_reference="MICRONUTRIENT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))

        # COPPER - HIGH PRIORITY for shellfish/liver/nuts
        # Note: Using 'copper_mg' but checking if it exists in schema
        copper = per_portion.get('copper_mg', 0)
        if copper == 0:
            if any(word in all_text for word in ['liver', 'offal']):
                suggested = round(12.0 * (portion_weight / 100), 2)
                opportunities.append(EstimationOpportunity(
                    nutrient="copper_mg",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="high",
                    reason="Liver ~12.0 mg/100g (HIGHEST source, USDA data available)",
                    priority="high",
                    source_reference="MICRONUTRIENT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))
            elif any(word in all_text for word in ['oyster', 'mussel', 'shellfish']):
                suggested = round(7.6 * (portion_weight / 100), 2)
                opportunities.append(EstimationOpportunity(
                    nutrient="copper_mg",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="high",
                    reason="Shellfish ~7.6 mg/100g (USDA data available)",
                    priority="high",
                    source_reference="MICRONUTRIENT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))
            elif any(word in all_text for word in ['cashew', 'sunflower seed', 'almond', 'walnut', 'hazelnut']):
                suggested = round(1.5 * (portion_weight / 100), 2)
                opportunities.append(EstimationOpportunity(
                    nutrient="copper_mg",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="high",
                    reason="Nuts/seeds ~1.5 mg/100g average (USDA data available)",
                    priority="high",
                    source_reference="MICRONUTRIENT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))

        # SELENIUM - MEDIUM PRIORITY for seafood/meat/eggs
        selenium = per_portion.get('selenium_ug', 0)
        if selenium == 0:
            if any(word in all_text for word in ['brazil nut']):
                suggested = round(1917 * (portion_weight / 100))
                opportunities.append(EstimationOpportunity(
                    nutrient="selenium_ug",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="medium",
                    reason="Brazil nuts ~1917 µg/100g (EXTREME variability, use with caution)",
                    priority="medium",
                    source_reference="MICRONUTRIENT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))
            elif any(word in all_text for word in ['tuna', 'salmon', 'cod', 'fish', 'seafood']):
                suggested = round(50 * (portion_weight / 100))
                opportunities.append(EstimationOpportunity(
                    nutrient="selenium_ug",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="medium",
                    reason="Fish ~50 µg/100g average (USDA data available)",
                    priority="low",
                    source_reference="MICRONUTRIENT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))
            elif any(word in all_text for word in ['egg']):
                suggested = round(31 * (portion_weight / 100))
                opportunities.append(EstimationOpportunity(
                    nutrient="selenium_ug",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="medium",
                    reason="Eggs ~31 µg/100g (USDA data available)",
                    priority="low",
                    source_reference="MICRONUTRIENT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))

        # VITAMIN D - MEDIUM PRIORITY for fatty fish/eggs/fortified dairy
        vitamin_d = per_portion.get('vitamin_d_ug', 0)
        if vitamin_d == 0:
            if any(word in all_text for word in ['salmon', 'mackerel', 'sardine', 'herring']):
                suggested = round(13 * (portion_weight / 100), 1)
                opportunities.append(EstimationOpportunity(
                    nutrient="vitamin_d_ug",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="high",
                    reason="Fatty fish ~13 µg/100g (HIGHEST natural source, USDA data)",
                    priority="medium",
                    source_reference="MICRONUTRIENT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))
            elif any(word in all_text for word in ['egg']):
                suggested = round(1.8 * (portion_weight / 100), 1)
                opportunities.append(EstimationOpportunity(
                    nutrient="vitamin_d_ug",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="medium-high",
                    reason="Eggs ~1.8 µg/100g (in yolk, USDA data)",
                    priority="medium",
                    source_reference="MICRONUTRIENT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))

        # VITAMIN E - MEDIUM PRIORITY for nuts/seeds/oils
        vitamin_e = per_portion.get('vitamin_e_mg', 0)
        if vitamin_e == 0:
            if any(word in all_text for word in ['almond']):
                suggested = round(25.6 * (portion_weight / 100), 1)
                opportunities.append(EstimationOpportunity(
                    nutrient="vitamin_e_mg",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="high",
                    reason="Almonds ~25.6 mg/100g (USDA data available)",
                    priority="medium",
                    source_reference="MICRONUTRIENT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))
            elif any(word in all_text for word in ['hazelnut']):
                suggested = round(15.0 * (portion_weight / 100), 1)
                opportunities.append(EstimationOpportunity(
                    nutrient="vitamin_e_mg",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="high",
                    reason="Hazelnuts ~15.0 mg/100g (USDA data available)",
                    priority="medium",
                    source_reference="MICRONUTRIENT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))
            elif any(word in all_text for word in ['sunflower seed']):
                suggested = round(35.0 * (portion_weight / 100), 1)
                opportunities.append(EstimationOpportunity(
                    nutrient="vitamin_e_mg",
                    current_value=0,
                    suggested_value=suggested,
                    confidence="high",
                    reason="Sunflower seeds ~35.0 mg/100g (USDA data available)",
                    priority="medium",
                    source_reference="MICRONUTRIENT-ESTIMATION-REFERENCE.yaml",
                    usda_available=True
                ))

        return opportunities

    def analyze_file(self, file_path: Path) -> Optional[FileAudit]:
        """Analyze a single food file"""
        try:
            with open(file_path, 'r') as f:
                content = f.read()

            data = self._extract_yaml_from_markdown(content)
            if not data:
                return None

            # Skip research files
            if file_path.name == 'RESEARCH.md':
                return None

            # Categorize food
            category, ingredients = self._categorize_food(file_path, data)

            # Collect all estimation opportunities
            opportunities = []
            opportunities.extend(self._identify_fiber_opportunities(data, category, ingredients))
            opportunities.extend(self._identify_iodine_opportunities(data, category, ingredients))
            opportunities.extend(self._identify_micronutrient_opportunities(data, category, ingredients))

            # Only return if there are opportunities
            if not opportunities:
                return None

            portion = data.get('portion', {})
            return FileAudit(
                path=str(file_path.relative_to(self.base_path)),
                file_id=data.get('id', 'unknown'),
                food_category=category,
                food_description=portion.get('description', 'unknown'),
                portion_weight_g=portion.get('est_weight_g'),
                primary_ingredients=ingredients,
                opportunities=opportunities
            )

        except Exception as e:
            print(f"Error analyzing {file_path}: {e}")
            return None

    def analyze_all(self) -> Dict[str, Any]:
        """Analyze all food bank files"""
        print(f"Scanning food bank: {self.food_bank_path}")

        # Find all .md files
        all_files = list(self.food_bank_path.rglob("*.md"))
        print(f"Found {len(all_files)} markdown files")

        file_audits = []
        for file_path in all_files:
            audit = self.analyze_file(file_path)
            if audit:
                file_audits.append(audit)

        # Calculate summary statistics
        total_opportunities = sum(len(fa.opportunities) for fa in file_audits)
        opportunities_by_priority = {'high': 0, 'medium': 0, 'low': 0}
        opportunities_by_nutrient = defaultdict(int)

        for audit in file_audits:
            for opp in audit.opportunities:
                opportunities_by_priority[opp.priority] += 1
                opportunities_by_nutrient[opp.nutrient] += 1

        # Prepare report
        report = {
            'metadata': {
                'generated_at': '2025-11-03',
                'base_path': str(self.base_path),
                'references_loaded': {
                    'fiber_split': bool(self.fiber_ref),
                    'iodine': bool(self.iodine_ref),
                    'micronutrient': bool(self.micronutrient_ref)
                }
            },
            'summary': {
                'total_files_scanned': len(all_files),
                'files_needing_estimation': len(file_audits),
                'total_opportunities': total_opportunities,
                'opportunities_by_priority': dict(opportunities_by_priority),
                'opportunities_by_nutrient': dict(opportunities_by_nutrient)
            },
            'files': [
                {
                    'path': fa.path,
                    'file_id': fa.file_id,
                    'food_category': fa.food_category,
                    'food_description': fa.food_description,
                    'portion_weight_g': fa.portion_weight_g,
                    'primary_ingredients': fa.primary_ingredients,
                    'priority_counts': fa.priority_counts,
                    'opportunities': [
                        {
                            'nutrient': opp.nutrient,
                            'current_value': opp.current_value,
                            'suggested_value': opp.suggested_value,
                            'confidence': opp.confidence,
                            'reason': opp.reason,
                            'priority': opp.priority,
                            'source_reference': opp.source_reference,
                            'usda_available': opp.usda_available
                        }
                        for opp in fa.opportunities
                    ]
                }
                for fa in file_audits
            ]
        }

        # Sort files by priority (high first)
        report['files'].sort(
            key=lambda x: (
                -x['priority_counts']['high'],
                -x['priority_counts']['medium'],
                -x['priority_counts']['low']
            )
        )

        return report


def main():
    parser = argparse.ArgumentParser(
        description="Audit nutrition estimation opportunities across food bank"
    )
    parser.add_argument(
        '--output',
        '-o',
        default='estimation_opportunities_report.json',
        help='Output JSON file path (default: estimation_opportunities_report.json)'
    )
    parser.add_argument(
        '--pretty',
        action='store_true',
        help='Pretty-print JSON output'
    )
    parser.add_argument(
        '--summary-only',
        action='store_true',
        help='Only show summary statistics'
    )

    args = parser.parse_args()

    # Determine base path
    script_dir = Path(__file__).parent
    base_path = script_dir.parent

    print("=" * 80)
    print("NUTRITION ESTIMATION OPPORTUNITIES AUDIT")
    print("=" * 80)
    print()

    # Run analysis
    analyzer = NutritionAuditAnalyzer(base_path)
    report = analyzer.analyze_all()

    # Print summary
    print()
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    summary = report['summary']
    print(f"Total files scanned:       {summary['total_files_scanned']}")
    print(f"Files needing estimation:  {summary['files_needing_estimation']}")
    print(f"Total opportunities:       {summary['total_opportunities']}")
    print()
    print("Opportunities by priority:")
    for priority in ['high', 'medium', 'low']:
        count = summary['opportunities_by_priority'].get(priority, 0)
        print(f"  {priority.upper():8s}: {count:3d}")
    print()
    print("Opportunities by nutrient:")
    for nutrient, count in sorted(summary['opportunities_by_nutrient'].items(), key=lambda x: -x[1]):
        print(f"  {nutrient:25s}: {count:3d}")
    print()

    if not args.summary_only:
        # Write full report
        output_path = Path(args.output)
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2 if args.pretty else None)

        print(f"Full report written to: {output_path}")
        print(f"File size: {output_path.stat().st_size / 1024:.1f} KB")
        print()

        # Show top 5 files with most opportunities
        print("Top 5 files with most opportunities:")
        for i, file_data in enumerate(report['files'][:5], 1):
            print(f"{i}. {file_data['file_id']}")
            print(f"   Path: {file_data['path']}")
            print(f"   Priorities: H={file_data['priority_counts']['high']} "
                  f"M={file_data['priority_counts']['medium']} "
                  f"L={file_data['priority_counts']['low']}")
            print()

    print("=" * 80)
    print("AUDIT COMPLETE")
    print("=" * 80)


if __name__ == '__main__':
    main()
