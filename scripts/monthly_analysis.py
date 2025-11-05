#!/usr/bin/env python3
"""
Monthly Nutrition Analysis Script
Generates comprehensive monthly reports with meal frequency analysis and markdown dashboards.
"""

import yaml
import sys
from pathlib import Path
from datetime import datetime, time
from collections import defaultdict
from typing import Dict, List, Tuple, Any, Optional
import statistics

# Project root
PROJECT_ROOT = Path(__file__).parent.parent
LOGS_DIR = PROJECT_ROOT / "data" / "logs"
HEALTH_PROFILE = PROJECT_ROOT / "references" / "health-profile.yaml"
ANALYSIS_DIR = PROJECT_ROOT / "data" / "analysis" / "monthly"


def load_health_profile() -> Dict:
    """Load health profile with targets."""
    with open(HEALTH_PROFILE, 'r') as f:
        return yaml.safe_load(f)


def classify_meal_time(timestamp_str: str) -> str:
    """
    Classify meal based on timestamp.
    Breakfast: 05:00-10:59
    Lunch: 11:00-15:59
    Dinner: 16:00-22:59
    Late night: 23:00-04:59
    """
    dt = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
    hour = dt.hour

    if 5 <= hour < 11:
        return "breakfast"
    elif 11 <= hour < 16:
        return "lunch"
    elif 16 <= hour < 23:
        return "dinner"
    else:
        return "late_night"


def is_alcoholic(item_name: str) -> bool:
    """Check if an item is likely alcoholic."""
    alcoholic_keywords = [
        'beer', 'lager', 'ale', 'ipa', 'stout', 'porter', 'guinness',
        'wine', 'champagne', 'prosecco', 'cava',
        'vodka', 'gin', 'rum', 'whisky', 'whiskey', 'tequila', 'brandy',
        'cocktail', 'martini', 'margarita', 'mojito',
        'cider', 'perry',
        'sake', 'soju',
        'liqueur', 'aperitif'
    ]
    item_lower = item_name.lower()
    return any(keyword in item_lower for keyword in alcoholic_keywords)


def parse_daily_log(log_file: Path) -> Dict:
    """Parse a single daily log file with detailed timing and item analysis."""
    with open(log_file, 'r') as f:
        data = yaml.safe_load(f)

    # Calculate daily totals
    daily_totals = defaultdict(float)
    meal_times = []
    items_consumed = []
    alcoholic_items = []
    entry_details = []

    for entry in data.get('entries', []):
        timestamp = entry.get('timestamp', '')
        meal_times.append(timestamp)

        entry_items = []
        for item in entry.get('items', []):
            item_name = item.get('name', '')
            if not item_name:  # Skip items without names
                continue
            items_consumed.append(item_name)
            entry_items.append(item_name)

            # Track alcoholic items
            if is_alcoholic(item_name):
                alcoholic_items.append({
                    'name': item_name,
                    'timestamp': timestamp,
                    'energy_kcal': item.get('nutrition', {}).get('energy_kcal', 0)
                })

            nutrition = item.get('nutrition', {})

            # Sum up all nutrients
            for nutrient, value in nutrition.items():
                if value is not None and isinstance(value, (int, float)):
                    daily_totals[nutrient] += value

        entry_details.append({
            'timestamp': timestamp,
            'items': entry_items
        })

    # Classify meals
    meal_classification = defaultdict(int)
    for ts in meal_times:
        meal_type = classify_meal_time(ts)
        meal_classification[meal_type] += 1

    # Calculate eating window if we have timestamps
    eating_window_hours = None
    first_meal_time = None
    last_meal_time = None

    if meal_times:
        timestamps = [datetime.fromisoformat(ts.replace('Z', '+00:00')) for ts in meal_times]
        timestamps.sort()
        first_meal_time = timestamps[0].strftime('%H:%M')
        last_meal_time = timestamps[-1].strftime('%H:%M')

        if len(timestamps) > 1:
            time_diff = timestamps[-1] - timestamps[0]
            eating_window_hours = time_diff.total_seconds() / 3600

    return {
        'date': data.get('date'),
        'day_type': data.get('day_type'),
        'totals': dict(daily_totals),
        'meals': dict(meal_classification),
        'num_entries': len(data.get('entries', [])),
        'items': items_consumed,
        'alcoholic_items': alcoholic_items,
        'entry_details': entry_details,
        'eating_window_hours': eating_window_hours,
        'first_meal_time': first_meal_time,
        'last_meal_time': last_meal_time
    }


def generate_bar_chart(value: float, max_value: float, width: int = 40, target: Optional[float] = None) -> str:
    """Generate an ASCII bar chart."""
    if max_value == 0:
        percentage = 0
    else:
        percentage = min(100, (value / max_value) * 100)

    filled = int((percentage / 100) * width)
    bar = "█" * filled + "░" * (width - filled)

    # Add target marker if provided
    if target and max_value > 0:
        target_pos = int((target / max_value) * width)
        if target_pos < len(bar):
            bar = bar[:target_pos] + "│" + bar[target_pos+1:]

    return f"{bar} {value:.1f}"


def generate_compliance_indicator(actual: float, target_min: Optional[float] = None,
                                  target_max: Optional[float] = None) -> str:
    """Generate a visual compliance indicator."""
    if target_min is not None and actual < target_min:
        gap = target_min - actual
        return f"⚠️  UNDER by {gap:.1f}"
    elif target_max is not None and actual > target_max:
        over = actual - target_max
        return f"⚠️  OVER by {over:.1f}"
    else:
        return "✅ ON TARGET"


def calculate_statistics(values: List[float]) -> Dict[str, float]:
    """Calculate basic statistics."""
    if not values:
        return {'mean': 0, 'median': 0, 'stdev': 0, 'min': 0, 'max': 0}

    return {
        'mean': statistics.mean(values),
        'median': statistics.median(values),
        'stdev': statistics.stdev(values) if len(values) > 1 else 0,
        'min': min(values),
        'max': max(values)
    }


def analyze_month(year: int, month: int) -> Dict:
    """Analyze all logs for a given month."""
    month_dir = LOGS_DIR / f"{year:04d}-{month:02d}"

    if not month_dir.exists():
        return None

    # Load health profile
    profile = load_health_profile()
    targets = profile.get('targets', {})

    # Parse all daily logs
    daily_data = []
    log_files = sorted(month_dir.glob("*.yaml"))

    for log_file in log_files:
        try:
            data = parse_daily_log(log_file)
            daily_data.append(data)
        except Exception as e:
            print(f"Error parsing {log_file}: {e}", file=sys.stderr)
            continue

    if not daily_data:
        return None

    # Aggregate analysis
    analysis = {
        'year': year,
        'month': month,
        'month_name': datetime(year, month, 1).strftime('%B'),
        'days_logged': len(daily_data),
        'profile': profile,
        'daily_data': daily_data,
        'summary': {}
    }

    # Calculate monthly aggregates - All 52 nutrients
    nutrients = [
        # Macronutrients and energy
        'energy_kcal', 'protein_g', 'fat_g', 'carbs_total_g', 'fiber_total_g',
        # Fat types
        'sat_fat_g', 'mufa_g', 'pufa_g', 'trans_fat_g', 'cholesterol_mg',
        # Carbohydrate types
        'carbs_available_g', 'fiber_soluble_g', 'fiber_insoluble_g', 'sugar_g', 'polyols_g',
        # Major minerals
        'sodium_mg', 'potassium_mg', 'calcium_mg', 'magnesium_mg', 'phosphorus_mg', 'chloride_mg', 'sulfur_g',
        # Trace minerals
        'iron_mg', 'zinc_mg', 'copper_mg', 'manganese_mg', 'selenium_ug', 'iodine_ug', 'chromium_ug', 'molybdenum_ug',
        # Ultra-trace minerals
        'boron_mg', 'silicon_mg', 'vanadium_ug', 'nickel_ug',
        # Fat-soluble vitamins
        'vitamin_a_ug', 'vitamin_d_ug', 'vitamin_e_mg', 'vitamin_k_ug',
        # Water-soluble vitamins
        'vitamin_c_mg', 'vitamin_b1_mg', 'vitamin_b2_mg', 'vitamin_b3_mg', 'vitamin_b5_mg',
        'vitamin_b6_mg', 'vitamin_b7_ug', 'vitamin_b9_ug', 'vitamin_b12_ug', 'choline_mg',
        # Fatty acids
        'omega3_epa_mg', 'omega3_dha_mg', 'omega3_ala_g', 'omega6_la_g'
    ]

    summary = {}
    for nutrient in nutrients:
        values = [day['totals'].get(nutrient, 0) for day in daily_data]
        summary[nutrient] = calculate_statistics(values)

    # Compliance analysis
    compliance = {
        'protein_min': sum(1 for d in daily_data if d['totals'].get('protein_g', 0) >= targets.get('protein_g_min', 0)),
        'fat_min': sum(1 for d in daily_data if d['totals'].get('fat_g', 0) >= targets.get('fat_g_min', 0)),
        'carbs_min': sum(1 for d in daily_data if d['totals'].get('carbs_total_g', 0) >= targets.get('carbs_g_min', 0)),
        'fiber_min': sum(1 for d in daily_data if d['totals'].get('fiber_total_g', 0) >= targets.get('fiber_g_min', 0)),
        'sat_fat_max': sum(1 for d in daily_data if d['totals'].get('sat_fat_g', 0) <= targets.get('sat_fat_g_max', 0)),
        'sodium_max': sum(1 for d in daily_data if d['totals'].get('sodium_mg', 0) <= targets.get('sodium_mg_max', 0)),
    }

    # Energy compliance (separate for rest/training)
    rest_days = [d for d in daily_data if d.get('day_type') == 'rest']
    training_days = [d for d in daily_data if d.get('day_type') == 'training']

    # Safe access to energy targets with fallback
    energy_targets = targets.get('energy_kcal', {})
    rest_day_max = energy_targets.get('rest_day_max', float('inf'))
    training_day_max = energy_targets.get('training_day_max', float('inf'))

    compliance['energy_rest'] = sum(1 for d in rest_days if d['totals'].get('energy_kcal', 0) <= rest_day_max)
    compliance['energy_training'] = sum(1 for d in training_days if d['totals'].get('energy_kcal', 0) <= training_day_max)

    analysis['summary'] = summary
    analysis['compliance'] = compliance
    analysis['rest_days'] = len(rest_days)
    analysis['training_days'] = len(training_days)

    # Meal frequency analysis
    meal_frequency = {
        'breakfast': sum(1 for d in daily_data if d['meals'].get('breakfast', 0) > 0),
        'lunch': sum(1 for d in daily_data if d['meals'].get('lunch', 0) > 0),
        'dinner': sum(1 for d in daily_data if d['meals'].get('dinner', 0) > 0),
        'late_night': sum(1 for d in daily_data if d['meals'].get('late_night', 0) > 0),
    }
    analysis['meal_frequency'] = meal_frequency

    # Food diversity
    all_items = []
    for day in daily_data:
        all_items.extend(day['items'])

    from collections import Counter
    item_counts = Counter(all_items)
    analysis['unique_foods'] = len(item_counts)
    analysis['top_foods'] = item_counts.most_common(10)

    # Meal timing analysis
    eating_windows = [d['eating_window_hours'] for d in daily_data if d.get('eating_window_hours') is not None]
    first_meals = [d['first_meal_time'] for d in daily_data if d.get('first_meal_time')]
    last_meals = [d['last_meal_time'] for d in daily_data if d.get('last_meal_time')]

    analysis['timing'] = {
        'avg_eating_window': statistics.mean(eating_windows) if eating_windows else 0,
        'eating_windows': eating_windows,
        'first_meals': first_meals,
        'last_meals': last_meals
    }

    # Alcohol analysis
    all_alcoholic_items = []
    alcohol_days = 0
    for day in daily_data:
        alcoholic = day.get('alcoholic_items', [])
        if alcoholic:
            alcohol_days += 1
            all_alcoholic_items.extend(alcoholic)

    # Estimate alcohol content (rough: 1 pint beer ~150 kcal = ~12-14g alcohol, ~1 standard drink)
    # For beverages around 80-150 kcal, assume ~1 drink
    alcohol_drinks_estimated = []
    for item in all_alcoholic_items:
        kcal = item.get('energy_kcal', 0)
        # Rough estimation: 80-180 kcal per drink
        if kcal > 0:
            drinks = max(1, kcal / 120)  # Assume ~120 kcal per drink average
        else:
            drinks = 1
        alcohol_drinks_estimated.append(drinks)

    analysis['alcohol'] = {
        'total_items': len(all_alcoholic_items),
        'days_with_alcohol': alcohol_days,
        'days_without_alcohol': len(daily_data) - alcohol_days,
        'estimated_drinks': sum(alcohol_drinks_estimated),
        'alcoholic_items': all_alcoholic_items
    }

    # Sugar analysis
    sugar_values = [day['totals'].get('sugar_g', 0) for day in daily_data]
    carb_values = [day['totals'].get('carbs_total_g', 0) for day in daily_data]
    energy_values = [day['totals'].get('energy_kcal', 0) for day in daily_data]

    sugar_pct_of_carbs = []
    sugar_per_1000kcal = []

    for i, sugar in enumerate(sugar_values):
        if carb_values[i] > 0:
            sugar_pct_of_carbs.append((sugar / carb_values[i]) * 100)
        if energy_values[i] > 0:
            sugar_per_1000kcal.append((sugar / energy_values[i]) * 1000)

    analysis['sugar_analysis'] = {
        'avg_sugar_g': statistics.mean(sugar_values) if sugar_values else 0,
        'avg_sugar_pct_of_carbs': statistics.mean(sugar_pct_of_carbs) if sugar_pct_of_carbs else 0,
        'avg_sugar_per_1000kcal': statistics.mean(sugar_per_1000kcal) if sugar_per_1000kcal else 0,
        'max_sugar_day': max(sugar_values) if sugar_values else 0,
        'days_over_50g': sum(1 for s in sugar_values if s > 50),
        'days_over_25g': sum(1 for s in sugar_values if s > 25)
    }

    return analysis


def _generate_executive_summary(analysis: Dict) -> List[str]:
    """Generate the executive summary section."""
    lines = []
    lines.append("## 📈 EXECUTIVE SUMMARY")
    lines.append("")
    lines.append(f"```")
    lines.append(f"📅 Days Logged:        {analysis['days_logged']} days")
    lines.append(f"🏋️  Training Days:      {analysis['training_days']} days")
    lines.append(f"😴 Rest Days:          {analysis['rest_days']} days")

    # Calculate compliance percentage (exclude energy checks as they're context-dependent)
    compliance = analysis['compliance']
    nutrient_checks = ['protein_min', 'fat_min', 'carbs_min', 'fiber_min', 'sat_fat_max', 'sodium_max']
    total_checks = sum(compliance[key] for key in nutrient_checks)
    max_checks = analysis['days_logged'] * 6
    compliance_pct = (total_checks / max_checks * 100) if max_checks > 0 else 0

    lines.append(f"🎯 Overall Compliance: {compliance_pct:.1f}%")
    lines.append(f"🍽️  Unique Foods:       {analysis['unique_foods']} items")
    lines.append(f"```")
    lines.append("")
    return lines


def _generate_meal_frequency_section(analysis: Dict) -> List[str]:
    """Generate meal frequency analysis section."""
    lines = []
    meal_freq = analysis['meal_frequency']
    days_logged = analysis['days_logged']

    lines.append("## 🍽️ MEAL FREQUENCY ANALYSIS")
    lines.append("")
    lines.append("| Meal Type | Days Logged | % of Days | Status |")
    lines.append("|-----------|-------------|-----------|--------|")

    for meal_type in ['breakfast', 'lunch', 'dinner', 'late_night']:
        count = meal_freq.get(meal_type, 0)
        pct = (count / days_logged * 100) if days_logged > 0 else 0

        # Status indicator
        if meal_type == 'late_night':
            status = "⚠️ Watch" if count > days_logged * 0.3 else "✅"
        else:
            status = "⚠️ Missing meals" if pct < 90 and meal_type != 'late_night' else "✅"

        lines.append(f"| {meal_type.title()} | {count}/{days_logged} | {pct:.1f}% | {status} |")

    lines.append("")

    # Key insights
    missing_meals = []
    if meal_freq.get('breakfast', 0) < days_logged:
        missing_meals.append(f"**Breakfast** missing on {days_logged - meal_freq.get('breakfast', 0)} days")
    if meal_freq.get('lunch', 0) < days_logged:
        missing_meals.append(f"**Lunch** missing on {days_logged - meal_freq.get('lunch', 0)} days")
    if meal_freq.get('dinner', 0) < days_logged:
        missing_meals.append(f"**Dinner** missing on {days_logged - meal_freq.get('dinner', 0)} days")

    if missing_meals:
        lines.append("### ⚠️ Missing Meals Detected")
        lines.append("")
        for msg in missing_meals:
            lines.append(f"- {msg}")
        lines.append("")

    return lines


def _generate_meal_timing_section(analysis: Dict) -> List[str]:
    """Generate meal timing and eating patterns section."""
    lines = []
    timing = analysis.get('timing', {})
    avg_window = timing.get('avg_eating_window', 0)
    first_meals = timing.get('first_meals', [])
    last_meals = timing.get('last_meals', [])

    lines.append("## ⏰ MEAL TIMING & EATING PATTERNS")
    lines.append("")
    lines.append(f"```")
    if avg_window > 0:
        lines.append(f"Average Eating Window:  {avg_window:.1f} hours")
    if first_meals:
        earliest = min(first_meals)
        latest_first = max(first_meals)
        lines.append(f"First Meal Range:       {earliest} - {latest_first}")
    if last_meals:
        earliest_last = min(last_meals)
        latest = max(last_meals)
        lines.append(f"Last Meal Range:        {earliest_last} - {latest}")
    lines.append(f"```")
    lines.append("")

    # Interpretation
    if avg_window > 0:
        if avg_window < 10:
            lines.append(f"✅ **Tight eating window** (~{avg_window:.1f}h): This time-restricted pattern may support metabolic health and circadian rhythms.")
        elif avg_window < 12:
            lines.append(f"✅ **Moderate eating window** (~{avg_window:.1f}h): Balanced approach with adequate fasting period.")
        else:
            lines.append(f"ℹ️ **Extended eating window** (~{avg_window:.1f}h): Consider consolidating meals for better metabolic benefits.")
    lines.append("")

    return lines


def _generate_target_achievement_section(analysis: Dict, targets: Dict) -> List[str]:
    """Generate target achievement section with macros, energy, and limits."""
    lines = []
    summary = analysis['summary']

    lines.append("## 🎯 TARGET ACHIEVEMENT")
    lines.append("")

    # Macronutrients
    lines.append("### Macronutrients")
    lines.append("")

    macro_targets = [
        ('Protein', 'protein_g', targets.get('protein_g_min'), 'min'),
        ('Fat', 'fat_g', targets.get('fat_g_min'), 'min'),
        ('Carbs', 'carbs_total_g', targets.get('carbs_g_min'), 'min'),
        ('Fiber', 'fiber_total_g', targets.get('fiber_g_min'), 'min'),
    ]

    for label, key, target_val, target_type in macro_targets:
        avg = summary[key]['mean']

        if target_type == 'min':
            status = generate_compliance_indicator(avg, target_min=target_val)
        else:
            status = generate_compliance_indicator(avg, target_max=target_val)

        bar = generate_bar_chart(avg, target_val * 1.5 if target_type == 'min' else target_val * 2, target=target_val)

        lines.append(f"**{label}** (target: {target_val}{key.split('_')[-1]})")
        lines.append(f"```")
        lines.append(f"Average:  {bar}")
        lines.append(f"Range:    {summary[key]['min']:.1f} - {summary[key]['max']:.1f}")
        lines.append(f"Status:   {status}")
        lines.append(f"```")
        lines.append("")

    # Energy
    lines.append("### Energy")
    lines.append("")
    avg_energy = summary['energy_kcal']['mean']
    # Safe access to energy targets
    energy_targets = targets.get('energy_kcal', {})
    rest_target = energy_targets.get('rest_day_max', 2000)
    training_target = energy_targets.get('training_day_max', 2500)

    lines.append(f"**Daily Energy** (Rest: {rest_target} kcal | Training: {training_target} kcal)")
    lines.append(f"```")
    bar = generate_bar_chart(avg_energy, training_target * 1.2)
    lines.append(f"Average:  {bar}")
    lines.append(f"Range:    {summary['energy_kcal']['min']:.0f} - {summary['energy_kcal']['max']:.0f} kcal")
    lines.append(f"```")
    lines.append("")

    # Limits (things to stay under)
    lines.append("### Limits (Stay Under)")
    lines.append("")

    limit_targets = [
        ('Saturated Fat', 'sat_fat_g', targets.get('sat_fat_g_max'), 'max'),
        ('Sodium', 'sodium_mg', targets.get('sodium_mg_max'), 'max'),
    ]

    for label, key, target_val, target_type in limit_targets:
        avg = summary[key]['mean']
        status = generate_compliance_indicator(avg, target_max=target_val)
        bar = generate_bar_chart(avg, target_val * 1.5, target=target_val)

        lines.append(f"**{label}** (max: {target_val}{key.split('_')[-1]})")
        lines.append(f"```")
        lines.append(f"Average:  {bar}")
        lines.append(f"Range:    {summary[key]['min']:.1f} - {summary[key]['max']:.1f}")
        lines.append(f"Status:   {status}")
        lines.append(f"```")
        lines.append("")

    return lines


def _generate_diet_quality_section(analysis: Dict, targets: Dict) -> List[str]:
    """Generate diet quality score and comprehensive assessment."""
    lines = []
    summary = analysis['summary']
    days_logged = analysis['days_logged']
    meal_freq = analysis['meal_frequency']

    # Calculate average values for analysis
    avg_sat = summary['sat_fat_g']['mean']
    avg_mufa = summary['mufa_g']['mean']
    avg_pufa = summary['pufa_g']['mean']
    avg_total_fat = summary['fat_g']['mean']
    avg_sodium = summary['sodium_mg']['mean']
    avg_potassium = summary['potassium_mg']['mean']
    na_k_ratio = avg_sodium / avg_potassium if avg_potassium > 0 else 999
    sat_pct = (avg_sat / avg_total_fat * 100) if avg_total_fat > 0 else 0

    sugar_data = analysis.get('sugar_analysis', {})
    avg_sugar = sugar_data.get('avg_sugar_g', 0)

    alcohol_data = analysis.get('alcohol', {})
    days_with_alcohol = alcohol_data.get('days_with_alcohol', 0)
    total_drinks = alcohol_data.get('estimated_drinks', 0)

    timing = analysis.get('timing', {})
    avg_window = timing.get('avg_eating_window', 0)

    lines.append("## 📝 OVERALL DIET COMMENTARY")
    lines.append("")

    # Calculate diet quality score (0-100)
    score_components = []

    # Protein compliance (0-15 points)
    protein_avg = summary['protein_g']['mean']
    protein_target = targets.get('protein_g_min', 170)
    protein_score = min(15, (protein_avg / protein_target) * 15)
    score_components.append(protein_score)

    # Fiber adequacy (0-15 points)
    fiber_avg = summary['fiber_total_g']['mean']
    fiber_target = targets.get('fiber_g_min', 40)
    fiber_score = min(15, (fiber_avg / fiber_target) * 15)
    score_components.append(fiber_score)

    # Fat quality (0-15 points) - higher unsaturated fat ratio is better
    unsat_to_sat_ratio = (avg_mufa + avg_pufa) / avg_sat if avg_sat > 0 else 1
    fat_quality_score = min(15, unsat_to_sat_ratio * 5)
    score_components.append(fat_quality_score)

    # Sodium control (0-15 points)
    sodium_target = targets.get('sodium_mg_max', 2300)
    sodium_score = 15 if avg_sodium <= sodium_target else max(0, 15 - ((avg_sodium - sodium_target) / 100))
    score_components.append(sodium_score)

    # Sugar control (0-10 points)
    sugar_score = 10 if avg_sugar < 25 else (5 if avg_sugar < 50 else max(0, 10 - ((avg_sugar - 50) / 5)))
    score_components.append(sugar_score)

    # Meal consistency (0-10 points)
    meal_consistency_score = (meal_freq.get('breakfast', 0) + meal_freq.get('lunch', 0) + meal_freq.get('dinner', 0)) / (days_logged * 3) * 10
    score_components.append(meal_consistency_score)

    # Food diversity (0-10 points)
    diversity_score = min(10, (analysis['unique_foods'] / days_logged) * 2)
    score_components.append(diversity_score)

    # Micronutrient adequacy (0-10 points) - based on potassium, calcium, magnesium
    potassium_adequacy = min(1, summary['potassium_mg']['mean'] / 3500)  # RDA ~3500mg
    calcium_adequacy = min(1, summary['calcium_mg']['mean'] / 1000)  # RDA ~1000mg
    magnesium_adequacy = min(1, summary['magnesium_mg']['mean'] / 400)  # RDA ~400mg
    micronutrient_score = (potassium_adequacy + calcium_adequacy + magnesium_adequacy) / 3 * 10
    score_components.append(micronutrient_score)

    total_score = sum(score_components)

    # Generate commentary
    lines.append("### Diet Quality Score")
    lines.append("")

    score_bar = generate_bar_chart(total_score, 100, width=50)
    lines.append(f"```")
    lines.append(f"Overall Score: {score_bar}")
    lines.append(f"```")
    lines.append("")

    if total_score >= 85:
        quality_rating = "⭐⭐⭐⭐⭐ EXCELLENT"
        quality_desc = "Your diet demonstrates outstanding nutritional quality with strong compliance across all key metrics."
    elif total_score >= 70:
        quality_rating = "⭐⭐⭐⭐ VERY GOOD"
        quality_desc = "Your diet shows very good nutritional quality with room for minor improvements."
    elif total_score >= 55:
        quality_rating = "⭐⭐⭐ GOOD"
        quality_desc = "Your diet has a solid foundation but would benefit from addressing several areas."
    elif total_score >= 40:
        quality_rating = "⭐⭐ NEEDS IMPROVEMENT"
        quality_desc = "Your diet requires attention in multiple areas to support your health and fitness goals."
    else:
        quality_rating = "⭐ SIGNIFICANT CHANGES NEEDED"
        quality_desc = "Your current dietary pattern needs substantial improvement across most nutritional areas."

    lines.append(f"**{quality_rating}** ({total_score:.0f}/100)")
    lines.append("")
    lines.append(quality_desc)
    lines.append("")

    # Detailed commentary
    lines.append("### Comprehensive Assessment")
    lines.append("")

    # Macronutrient balance
    protein_pct = (summary['protein_g']['mean'] * 4 / summary['energy_kcal']['mean'] * 100) if summary['energy_kcal']['mean'] > 0 else 0
    fat_pct = (summary['fat_g']['mean'] * 9 / summary['energy_kcal']['mean'] * 100) if summary['energy_kcal']['mean'] > 0 else 0
    carb_pct = (summary['carbs_total_g']['mean'] * 4 / summary['energy_kcal']['mean'] * 100) if summary['energy_kcal']['mean'] > 0 else 0

    lines.append("**Macronutrient Distribution:**")
    lines.append(f"- Protein: {protein_pct:.0f}% of calories ({summary['protein_g']['mean']:.1f}g/day)")
    lines.append(f"- Fat: {fat_pct:.0f}% of calories ({summary['fat_g']['mean']:.1f}g/day)")
    lines.append(f"- Carbohydrates: {carb_pct:.0f}% of calories ({summary['carbs_total_g']['mean']:.1f}g/day)")
    lines.append("")

    # Macro balance assessment
    if 25 <= protein_pct <= 35:
        lines.append(f"✅ Protein intake is well-optimized for muscle maintenance and body composition goals.")
    elif protein_pct < 25:
        lines.append(f"📈 Protein could be increased to better support training and recovery.")
    else:
        lines.append(f"ℹ️ Very high protein intake - ensure adequate hydration and kidney function monitoring.")
    lines.append("")

    # Diet pattern analysis
    lines.append("**Dietary Pattern Analysis:**")

    strengths = []
    concerns = []

    # Identify strengths
    if meal_consistency_score >= 9:
        strengths.append("Excellent meal timing consistency")
    if fiber_score >= 13:
        strengths.append("Outstanding fiber intake")
    if protein_score >= 13:
        strengths.append("Excellent protein intake")
    if na_k_ratio < 1:
        strengths.append("Optimal sodium:potassium ratio")
    if fat_quality_score >= 12:
        strengths.append("High-quality fat sources")
    if sugar_score >= 8:
        strengths.append("Well-controlled sugar intake")
    if diversity_score >= 8:
        strengths.append("Excellent dietary variety")

    # Identify concerns
    if fiber_score < 10:
        concerns.append("Insufficient fiber intake")
    if protein_score < 12:
        concerns.append("Suboptimal protein for goals")
    if sodium_score < 10:
        concerns.append("Elevated sodium levels")
    if sat_pct > 33:
        concerns.append("High saturated fat percentage")
    if sugar_score < 5:
        concerns.append("Excessive sugar consumption")
    if meal_consistency_score < 7:
        concerns.append("Inconsistent meal timing")
    if days_with_alcohol > days_logged * 0.5:
        concerns.append("Frequent alcohol consumption")

    if strengths:
        lines.append("")
        lines.append("**Strengths:**")
        for strength in strengths:
            lines.append(f"- ✅ {strength}")

    if concerns:
        lines.append("")
        lines.append("**Areas for Improvement:**")
        for concern in concerns:
            lines.append(f"- ⚠️ {concern}")

    lines.append("")

    # Health implications
    lines.append("**Health & Performance Implications:**")
    lines.append("")

    # Provide contextualized insights
    implications = []

    protein_target = targets.get('protein_g_min', 170)
    if protein_avg >= protein_target * 0.95:
        implications.append("✅ **Muscle preservation:** Protein intake supports lean mass maintenance during body recomposition.")
    else:
        implications.append("⚠️ **Muscle risk:** Suboptimal protein may compromise muscle retention, especially in caloric deficit or intense training.")

    if fiber_avg >= 35:
        implications.append("✅ **Gut health:** High fiber intake supports beneficial gut bacteria, digestive health, and stable blood sugar.")
    else:
        implications.append("ℹ️ **Digestive health:** Increasing fiber would benefit gut microbiome, satiety, and metabolic health.")

    if na_k_ratio < 1:
        implications.append("✅ **Cardiovascular health:** Excellent sodium:potassium balance supports healthy blood pressure.")
    else:
        implications.append("⚠️ **Blood pressure:** Elevated sodium:potassium ratio may increase cardiovascular strain. Add more fruits and vegetables.")

    if sat_pct > 33:
        implications.append("⚠️ **Heart health:** High saturated fat intake may negatively impact cholesterol profiles. Emphasize unsaturated fats from nuts, avocados, fatty fish, and olive oil.")

    if avg_window > 0 and avg_window < 12:
        implications.append("✅ **Metabolic health:** Time-restricted eating pattern may enhance insulin sensitivity and fat oxidation.")

    if days_with_alcohol > 0:
        drinks_per_week = (total_drinks / days_logged) * 7
        if drinks_per_week > 14:
            implications.append("⚠️ **Recovery impact:** High alcohol consumption can impair muscle recovery, sleep quality, and fat metabolism.")
        elif drinks_per_week > 7:
            implications.append("ℹ️ **Training optimization:** Moderate alcohol intake may affect training performance and recovery. Consider timing around workout days.")

    for implication in implications:
        lines.append(implication)

    lines.append("")

    return lines


def generate_markdown_report(analysis: Dict) -> str:
    """Generate comprehensive markdown report using modular helper functions."""
    if not analysis:
        return "# No data available\n"

    year = analysis['year']
    month = analysis['month']
    month_name = analysis['month_name']
    profile = analysis['profile']
    targets = profile.get('targets', {})
    summary = analysis['summary']
    days_logged = analysis['days_logged']
    meal_freq = analysis['meal_frequency']

    # Extract commonly used values
    alcohol_data = analysis.get('alcohol', {})
    days_with_alcohol = alcohol_data.get('days_with_alcohol', 0)
    days_without_alcohol = alcohol_data.get('days_without_alcohol', 0)
    total_drinks = alcohol_data.get('estimated_drinks', 0)

    timing = analysis.get('timing', {})
    avg_window = timing.get('avg_eating_window', 0)

    report = []

    # Header
    report.append(f"# 📊 MONTHLY NUTRITION ANALYSIS")
    report.append(f"## {month_name} {year}")
    report.append("")
    report.append("━" * 80)
    report.append("")

    # Use helper functions for major sections
    report.extend(_generate_executive_summary(analysis))
    report.extend(_generate_meal_frequency_section(analysis))
    report.extend(_generate_meal_timing_section(analysis))
    report.extend(_generate_target_achievement_section(analysis, targets))

    # Micronutrients - Comprehensive Analysis
    report.append("## 🔬 MICRONUTRIENT AVERAGES")
    report.append("")

    # B-Complex Vitamins
    report.append("### B-Complex Vitamins")
    report.append("")
    report.append("| Nutrient | Daily Average | Range |")
    report.append("|----------|---------------|-------|")

    b_vitamins = [
        ('Vitamin B1 (Thiamin)', 'vitamin_b1_mg', 'mg'),
        ('Vitamin B2 (Riboflavin)', 'vitamin_b2_mg', 'mg'),
        ('Vitamin B3 (Niacin)', 'vitamin_b3_mg', 'mg'),
        ('Vitamin B5 (Pantothenic Acid)', 'vitamin_b5_mg', 'mg'),
        ('Vitamin B6 (Pyridoxine)', 'vitamin_b6_mg', 'mg'),
        ('Vitamin B7 (Biotin)', 'vitamin_b7_ug', 'μg'),
        ('Vitamin B9 (Folate)', 'vitamin_b9_ug', 'μg'),
        ('Vitamin B12 (Cobalamin)', 'vitamin_b12_ug', 'μg'),
        ('Choline', 'choline_mg', 'mg'),
    ]

    for label, key, unit in b_vitamins:
        if key in summary:
            avg = summary[key]['mean']
            min_val = summary[key]['min']
            max_val = summary[key]['max']
            report.append(f"| {label} | {avg:.1f} {unit} | {min_val:.1f} - {max_val:.1f} |")

    report.append("")

    # Fat-Soluble Vitamins
    report.append("### Fat-Soluble Vitamins")
    report.append("")
    report.append("| Nutrient | Daily Average | Range |")
    report.append("|----------|---------------|-------|")

    fat_sol_vitamins = [
        ('Vitamin A', 'vitamin_a_ug', 'μg'),
        ('Vitamin D', 'vitamin_d_ug', 'μg'),
        ('Vitamin E', 'vitamin_e_mg', 'mg'),
        ('Vitamin K', 'vitamin_k_ug', 'μg'),
        ('Vitamin C', 'vitamin_c_mg', 'mg'),
    ]

    for label, key, unit in fat_sol_vitamins:
        if key in summary:
            avg = summary[key]['mean']
            min_val = summary[key]['min']
            max_val = summary[key]['max']
            report.append(f"| {label} | {avg:.1f} {unit} | {min_val:.1f} - {max_val:.1f} |")

    report.append("")

    # Major Minerals
    report.append("### Major Minerals")
    report.append("")
    report.append("| Nutrient | Daily Average | Range |")
    report.append("|----------|---------------|-------|")

    major_minerals = [
        ('Sodium', 'sodium_mg', 'mg'),
        ('Potassium', 'potassium_mg', 'mg'),
        ('Calcium', 'calcium_mg', 'mg'),
        ('Magnesium', 'magnesium_mg', 'mg'),
        ('Phosphorus', 'phosphorus_mg', 'mg'),
        ('Chloride', 'chloride_mg', 'mg'),
        ('Sulfur', 'sulfur_g', 'g'),
    ]

    for label, key, unit in major_minerals:
        if key in summary:
            avg = summary[key]['mean']
            min_val = summary[key]['min']
            max_val = summary[key]['max']
            report.append(f"| {label} | {avg:.1f} {unit} | {min_val:.1f} - {max_val:.1f} |")

    report.append("")

    # Trace Minerals
    report.append("### Trace Minerals")
    report.append("")
    report.append("| Nutrient | Daily Average | Range |")
    report.append("|----------|---------------|-------|")

    trace_minerals = [
        ('Iron', 'iron_mg', 'mg'),
        ('Zinc', 'zinc_mg', 'mg'),
        ('Copper', 'copper_mg', 'mg'),
        ('Manganese', 'manganese_mg', 'mg'),
        ('Selenium', 'selenium_ug', 'μg'),
        ('Iodine', 'iodine_ug', 'μg'),
        ('Chromium', 'chromium_ug', 'μg'),
        ('Molybdenum', 'molybdenum_ug', 'μg'),
    ]

    for label, key, unit in trace_minerals:
        if key in summary:
            avg = summary[key]['mean']
            min_val = summary[key]['min']
            max_val = summary[key]['max']
            report.append(f"| {label} | {avg:.1f} {unit} | {min_val:.1f} - {max_val:.1f} |")

    report.append("")

    # Ultra-trace Minerals
    report.append("### Ultra-trace Minerals")
    report.append("")
    report.append("| Nutrient | Daily Average | Range |")
    report.append("|----------|---------------|-------|")

    ultratrace_minerals = [
        ('Boron', 'boron_mg', 'mg'),
        ('Silicon', 'silicon_mg', 'mg'),
        ('Vanadium', 'vanadium_ug', 'μg'),
        ('Nickel', 'nickel_ug', 'μg'),
    ]

    for label, key, unit in ultratrace_minerals:
        if key in summary:
            avg = summary[key]['mean']
            min_val = summary[key]['min']
            max_val = summary[key]['max']
            report.append(f"| {label} | {avg:.1f} {unit} | {min_val:.1f} - {max_val:.1f} |")

    report.append("")

    # Essential Fatty Acids
    report.append("### Essential Fatty Acids")
    report.append("")
    report.append("| Nutrient | Daily Average | Range |")
    report.append("|----------|---------------|-------|")

    fatty_acids = [
        ('Omega-3 EPA', 'omega3_epa_mg', 'mg'),
        ('Omega-3 DHA', 'omega3_dha_mg', 'mg'),
        ('Omega-3 ALA', 'omega3_ala_g', 'g'),
        ('Omega-6 LA', 'omega6_la_g', 'g'),
    ]

    for label, key, unit in fatty_acids:
        if key in summary:
            avg = summary[key]['mean']
            min_val = summary[key]['min']
            max_val = summary[key]['max']
            report.append(f"| {label} | {avg:.1f} {unit} | {min_val:.1f} - {max_val:.1f} |")

    report.append("")

    # Fat Quality
    report.append("## 🥑 FAT QUALITY ANALYSIS")
    report.append("")

    avg_sat = summary['sat_fat_g']['mean']
    avg_mufa = summary['mufa_g']['mean']
    avg_pufa = summary['pufa_g']['mean']
    avg_total_fat = summary['fat_g']['mean']

    sat_pct = (avg_sat / avg_total_fat * 100) if avg_total_fat > 0 else 0
    mufa_pct = (avg_mufa / avg_total_fat * 100) if avg_total_fat > 0 else 0
    pufa_pct = (avg_pufa / avg_total_fat * 100) if avg_total_fat > 0 else 0

    report.append(f"```")
    report.append(f"Total Fat:        {avg_total_fat:.1f}g/day")
    report.append(f"Saturated:        {avg_sat:.1f}g ({sat_pct:.1f}%)  {'✅ Good (<33%)' if sat_pct < 33 else '⚠️ High (>33%)'}")
    report.append(f"Monounsaturated:  {avg_mufa:.1f}g ({mufa_pct:.1f}%)")
    report.append(f"Polyunsaturated:  {avg_pufa:.1f}g ({pufa_pct:.1f}%)")
    report.append(f"```")
    report.append("")

    # Sodium:Potassium Ratio
    avg_sodium = summary['sodium_mg']['mean']
    avg_potassium = summary['potassium_mg']['mean']
    na_k_ratio = avg_sodium / avg_potassium if avg_potassium > 0 else 999

    report.append("### Sodium:Potassium Ratio")
    report.append(f"```")
    report.append(f"Ratio: {na_k_ratio:.2f}:1  {'✅ Excellent (<1:1)' if na_k_ratio < 1 else '⚠️ Consider more potassium (target <1:1)'}")
    report.append(f"```")
    report.append("")

    # Sugar Analysis
    report.append("## 🍬 SUGAR ANALYSIS")
    report.append("")

    sugar_data = analysis.get('sugar_analysis', {})
    avg_sugar = sugar_data.get('avg_sugar_g', 0)
    sugar_pct_carbs = sugar_data.get('avg_sugar_pct_of_carbs', 0)
    sugar_density = sugar_data.get('avg_sugar_per_1000kcal', 0)
    max_sugar = sugar_data.get('max_sugar_day', 0)
    days_over_50g = sugar_data.get('days_over_50g', 0)
    days_over_25g = sugar_data.get('days_over_25g', 0)

    report.append(f"```")
    report.append(f"Daily Average:        {avg_sugar:.1f}g")
    report.append(f"% of Total Carbs:     {sugar_pct_carbs:.1f}%")
    report.append(f"Sugar Density:        {sugar_density:.1f}g per 1000 kcal")
    report.append(f"Highest Day:          {max_sugar:.1f}g")
    report.append(f"Days >50g (WHO max):  {days_over_50g}/{analysis['days_logged']}")
    report.append(f"Days >25g (WHO ideal): {days_over_25g}/{analysis['days_logged']}")
    report.append(f"```")
    report.append("")

    # Sugar guidelines interpretation
    if avg_sugar < 25:
        report.append(f"✅ **Excellent sugar control:** Averaging {avg_sugar:.1f}g/day, well under WHO recommended limit of 25g for optimal health.")
    elif avg_sugar < 50:
        report.append(f"✅ **Good sugar intake:** Averaging {avg_sugar:.1f}g/day, within WHO's upper limit of 50g but above the 25g ideal. Room for improvement.")
    else:
        report.append(f"⚠️ **High sugar intake:** Averaging {avg_sugar:.1f}g/day exceeds WHO recommendations (25-50g). Consider reducing added sugars from beverages, sweets, and processed foods.")

    report.append("")

    # Alcohol Analysis
    report.append("## 🍺 ALCOHOL CONSUMPTION")
    report.append("")

    alcohol_data = analysis.get('alcohol', {})
    days_with_alcohol = alcohol_data.get('days_with_alcohol', 0)
    days_without_alcohol = alcohol_data.get('days_without_alcohol', 0)
    total_drinks = alcohol_data.get('estimated_drinks', 0)
    alcoholic_items = alcohol_data.get('alcoholic_items', [])

    if days_with_alcohol > 0:
        avg_drinks_per_week = (total_drinks / days_logged) * 7
        drinks_per_drinking_day = total_drinks / days_with_alcohol if days_with_alcohol > 0 else 0

        report.append(f"```")
        report.append(f"Days with Alcohol:     {days_with_alcohol}/{days_logged}")
        report.append(f"Days Alcohol-Free:     {days_without_alcohol}/{days_logged}")
        report.append(f"Estimated Total:       {total_drinks:.1f} drinks")
        report.append(f"Drinks per Week:       {avg_drinks_per_week:.1f} drinks")
        report.append(f"Per Drinking Day:      {drinks_per_drinking_day:.1f} drinks")
        report.append(f"```")
        report.append("")

        # Health guidelines (CDC: moderate = up to 1/day women, 2/day men)
        if avg_drinks_per_week <= 7:
            report.append(f"✅ **Low consumption:** {avg_drinks_per_week:.1f} drinks/week is within low-risk guidelines.")
        elif avg_drinks_per_week <= 14:
            report.append(f"ℹ️ **Moderate consumption:** {avg_drinks_per_week:.1f} drinks/week. Consider having more alcohol-free days.")
        else:
            report.append(f"⚠️ **High consumption:** {avg_drinks_per_week:.1f} drinks/week exceeds moderate guidelines (7-14 drinks/week). Reducing intake would benefit health.")

        report.append("")

        # List alcoholic items
        if alcoholic_items:
            report.append("### Alcoholic Items Consumed")
            report.append("")
            from collections import Counter
            alcohol_names = [item['name'] for item in alcoholic_items]
            alcohol_counts = Counter(alcohol_names)
            for item, count in alcohol_counts.most_common(5):
                report.append(f"- {item}: {count}x")
            report.append("")
    else:
        report.append(f"```")
        report.append(f"No alcohol consumption detected this month.")
        report.append(f"```")
        report.append("")
        report.append("✅ **Alcohol-free month:** Excellent for health, sleep quality, and body composition goals.")
        report.append("")

    # Food Diversity
    report.append("## 🌈 FOOD DIVERSITY")
    report.append("")
    report.append(f"**Total Unique Items:** {analysis['unique_foods']}")
    report.append("")
    report.append("### Top 10 Most Consumed Foods")
    report.append("")
    report.append("| Rank | Food | Count |")
    report.append("|------|------|-------|")

    for idx, (food, count) in enumerate(analysis['top_foods'], 1):
        report.append(f"| {idx} | {food} | {count}x |")

    report.append("")

    # Daily Breakdown
    report.append("## 📅 DAILY BREAKDOWN")
    report.append("")
    report.append("| Date | Type | Energy | Protein | Fiber | Meals | Status |")
    report.append("|------|------|--------|---------|-------|-------|--------|")

    for day in analysis['daily_data']:
        date = day['date']
        day_type = day['day_type']
        energy = day['totals'].get('energy_kcal', 0)
        protein = day['totals'].get('protein_g', 0)
        fiber = day['totals'].get('fiber_total_g', 0)

        # Count meals
        meal_count = sum(1 for meal in ['breakfast', 'lunch', 'dinner'] if day['meals'].get(meal, 0) > 0)

        # Simple status
        protein_ok = protein >= targets.get('protein_g_min', 0)
        fiber_ok = fiber >= targets.get('fiber_g_min', 0)

        # Safe access to energy targets
        energy_targets = targets.get('energy_kcal', {})
        if day_type == 'rest':
            energy_ok = energy <= energy_targets.get('rest_day_max', float('inf'))
        else:
            energy_ok = energy <= energy_targets.get('training_day_max', float('inf'))

        status = "✅" if (protein_ok and fiber_ok and energy_ok and meal_count == 3) else "⚠️"

        report.append(f"| {date} | {day_type.title()[:4]} | {energy:.0f} | {protein:.0f}g | {fiber:.1f}g | {meal_count}/3 | {status} |")

    report.append("")

    # Overall Diet Commentary
    report.append("## 📝 OVERALL DIET COMMENTARY")
    report.append("")

    # Calculate diet quality score (0-100)
    score_components = []

    # Protein compliance (0-15 points)
    protein_avg = summary['protein_g']['mean']
    protein_target = targets.get('protein_g_min', 170)
    protein_score = min(15, (protein_avg / protein_target) * 15)
    score_components.append(protein_score)

    # Fiber adequacy (0-15 points)
    fiber_avg = summary['fiber_total_g']['mean']
    fiber_target = targets.get('fiber_g_min', 40)
    fiber_score = min(15, (fiber_avg / fiber_target) * 15)
    score_components.append(fiber_score)

    # Fat quality (0-15 points) - higher unsaturated fat ratio is better
    unsat_to_sat_ratio = (avg_mufa + avg_pufa) / avg_sat if avg_sat > 0 else 1
    fat_quality_score = min(15, unsat_to_sat_ratio * 5)
    score_components.append(fat_quality_score)

    # Sodium control (0-15 points)
    sodium_avg = summary['sodium_mg']['mean']
    sodium_target = targets.get('sodium_mg_max', 2300)
    sodium_score = 15 if sodium_avg <= sodium_target else max(0, 15 - ((sodium_avg - sodium_target) / 100))
    score_components.append(sodium_score)

    # Sugar control (0-10 points)
    sugar_score = 10 if avg_sugar < 25 else (5 if avg_sugar < 50 else max(0, 10 - ((avg_sugar - 50) / 5)))
    score_components.append(sugar_score)

    # Meal consistency (0-10 points)
    meal_consistency_score = (meal_freq.get('breakfast', 0) + meal_freq.get('lunch', 0) + meal_freq.get('dinner', 0)) / (days_logged * 3) * 10
    score_components.append(meal_consistency_score)

    # Food diversity (0-10 points)
    diversity_score = min(10, (analysis['unique_foods'] / days_logged) * 2)
    score_components.append(diversity_score)

    # Micronutrient adequacy (0-10 points) - based on potassium, calcium, magnesium
    potassium_adequacy = min(1, summary['potassium_mg']['mean'] / 3500)  # RDA ~3500mg
    calcium_adequacy = min(1, summary['calcium_mg']['mean'] / 1000)  # RDA ~1000mg
    magnesium_adequacy = min(1, summary['magnesium_mg']['mean'] / 400)  # RDA ~400mg
    micronutrient_score = (potassium_adequacy + calcium_adequacy + magnesium_adequacy) / 3 * 10
    score_components.append(micronutrient_score)

    total_score = sum(score_components)

    # Generate commentary
    report.append("### Diet Quality Score")
    report.append("")

    score_bar = generate_bar_chart(total_score, 100, width=50)
    report.append(f"```")
    report.append(f"Overall Score: {score_bar}")
    report.append(f"```")
    report.append("")

    if total_score >= 85:
        quality_rating = "⭐⭐⭐⭐⭐ EXCELLENT"
        quality_desc = "Your diet demonstrates outstanding nutritional quality with strong compliance across all key metrics."
    elif total_score >= 70:
        quality_rating = "⭐⭐⭐⭐ VERY GOOD"
        quality_desc = "Your diet shows very good nutritional quality with room for minor improvements."
    elif total_score >= 55:
        quality_rating = "⭐⭐⭐ GOOD"
        quality_desc = "Your diet has a solid foundation but would benefit from addressing several areas."
    elif total_score >= 40:
        quality_rating = "⭐⭐ NEEDS IMPROVEMENT"
        quality_desc = "Your diet requires attention in multiple areas to support your health and fitness goals."
    else:
        quality_rating = "⭐ SIGNIFICANT CHANGES NEEDED"
        quality_desc = "Your current dietary pattern needs substantial improvement across most nutritional areas."

    report.append(f"**{quality_rating}** ({total_score:.0f}/100)")
    report.append("")
    report.append(quality_desc)
    report.append("")

    # Detailed commentary
    report.append("### Comprehensive Assessment")
    report.append("")

    # Macronutrient balance
    protein_pct = (summary['protein_g']['mean'] * 4 / summary['energy_kcal']['mean'] * 100) if summary['energy_kcal']['mean'] > 0 else 0
    fat_pct = (summary['fat_g']['mean'] * 9 / summary['energy_kcal']['mean'] * 100) if summary['energy_kcal']['mean'] > 0 else 0
    carb_pct = (summary['carbs_total_g']['mean'] * 4 / summary['energy_kcal']['mean'] * 100) if summary['energy_kcal']['mean'] > 0 else 0

    report.append("**Macronutrient Distribution:**")
    report.append(f"- Protein: {protein_pct:.0f}% of calories ({summary['protein_g']['mean']:.1f}g/day)")
    report.append(f"- Fat: {fat_pct:.0f}% of calories ({summary['fat_g']['mean']:.1f}g/day)")
    report.append(f"- Carbohydrates: {carb_pct:.0f}% of calories ({summary['carbs_total_g']['mean']:.1f}g/day)")
    report.append("")

    # Macro balance assessment
    if 25 <= protein_pct <= 35:
        report.append(f"✅ Protein intake is well-optimized for muscle maintenance and body composition goals.")
    elif protein_pct < 25:
        report.append(f"📈 Protein could be increased to better support training and recovery.")
    else:
        report.append(f"ℹ️ Very high protein intake - ensure adequate hydration and kidney function monitoring.")
    report.append("")

    # Diet pattern analysis
    report.append("**Dietary Pattern Analysis:**")

    strengths = []
    concerns = []

    # Identify strengths
    if meal_consistency_score >= 9:
        strengths.append("Excellent meal timing consistency")
    if fiber_score >= 13:
        strengths.append("Outstanding fiber intake")
    if protein_score >= 13:
        strengths.append("Excellent protein intake")
    if na_k_ratio < 1:
        strengths.append("Optimal sodium:potassium ratio")
    if fat_quality_score >= 12:
        strengths.append("High-quality fat sources")
    if sugar_score >= 8:
        strengths.append("Well-controlled sugar intake")
    if diversity_score >= 8:
        strengths.append("Excellent dietary variety")

    # Identify concerns
    if fiber_score < 10:
        concerns.append("Insufficient fiber intake")
    if protein_score < 12:
        concerns.append("Suboptimal protein for goals")
    if sodium_score < 10:
        concerns.append("Elevated sodium levels")
    if sat_pct > 33:
        concerns.append("High saturated fat percentage")
    if sugar_score < 5:
        concerns.append("Excessive sugar consumption")
    if meal_consistency_score < 7:
        concerns.append("Inconsistent meal timing")
    if days_with_alcohol > days_logged * 0.5:
        concerns.append("Frequent alcohol consumption")

    if strengths:
        report.append("")
        report.append("**Strengths:**")
        for strength in strengths:
            report.append(f"- ✅ {strength}")

    if concerns:
        report.append("")
        report.append("**Areas for Improvement:**")
        for concern in concerns:
            report.append(f"- ⚠️ {concern}")

    report.append("")

    # Health implications
    report.append("**Health & Performance Implications:**")
    report.append("")

    # Provide contextualized insights
    implications = []

    if protein_avg >= protein_target * 0.95:
        implications.append("✅ **Muscle preservation:** Protein intake supports lean mass maintenance during body recomposition.")
    else:
        implications.append("⚠️ **Muscle risk:** Suboptimal protein may compromise muscle retention, especially in caloric deficit or intense training.")

    if fiber_avg >= 35:
        implications.append("✅ **Gut health:** High fiber intake supports beneficial gut bacteria, digestive health, and stable blood sugar.")
    else:
        implications.append("ℹ️ **Digestive health:** Increasing fiber would benefit gut microbiome, satiety, and metabolic health.")

    if na_k_ratio < 1:
        implications.append("✅ **Cardiovascular health:** Excellent sodium:potassium balance supports healthy blood pressure.")
    else:
        implications.append("⚠️ **Blood pressure:** Elevated sodium:potassium ratio may increase cardiovascular strain. Add more fruits and vegetables.")

    if sat_pct > 33:
        implications.append("⚠️ **Heart health:** High saturated fat intake may negatively impact cholesterol profiles. Emphasize unsaturated fats from nuts, avocados, fatty fish, and olive oil.")

    if avg_window > 0 and avg_window < 12:
        implications.append("✅ **Metabolic health:** Time-restricted eating pattern may enhance insulin sensitivity and fat oxidation.")

    if days_with_alcohol > 0:
        drinks_per_week = (total_drinks / days_logged) * 7
        if drinks_per_week > 14:
            implications.append("⚠️ **Recovery impact:** High alcohol consumption can impair muscle recovery, sleep quality, and fat metabolism.")
        elif drinks_per_week > 7:
            implications.append("ℹ️ **Training optimization:** Moderate alcohol intake may affect training performance and recovery. Consider timing around workout days.")

    for implication in implications:
        report.append(implication)

    report.append("")

    # Recommendations
    report.append("## 💡 RECOMMENDATIONS")
    report.append("")

    recommendations = []

    # Protein
    if summary['protein_g']['mean'] < targets.get('protein_g_min', 0):
        gap = targets.get('protein_g_min', 0) - summary['protein_g']['mean']
        recommendations.append(f"📈 **Increase protein:** Currently averaging {summary['protein_g']['mean']:.1f}g/day. Target is {targets.get('protein_g_min')}g. Add {gap:.1f}g more daily.")
    else:
        recommendations.append(f"✅ **Protein:** You're crushing it! Averaging {summary['protein_g']['mean']:.1f}g/day (target: {targets.get('protein_g_min')}g).")

    # Fiber
    if summary['fiber_total_g']['mean'] < targets.get('fiber_g_min', 0):
        gap = targets.get('fiber_g_min', 0) - summary['fiber_total_g']['mean']
        recommendations.append(f"📈 **Increase fiber:** Currently averaging {summary['fiber_total_g']['mean']:.1f}g/day. Target is {targets.get('fiber_g_min')}g. Add {gap:.1f}g more daily (vegetables, fruits, whole grains).")

    # Sodium
    if summary['sodium_mg']['mean'] > targets.get('sodium_mg_max', 0):
        over = summary['sodium_mg']['mean'] - targets.get('sodium_mg_max', 0)
        recommendations.append(f"📉 **Reduce sodium:** Currently averaging {summary['sodium_mg']['mean']:.0f}mg/day. Target max is {targets.get('sodium_mg_max')}mg. Reduce by {over:.0f}mg daily.")

    # Meal frequency
    if meal_freq.get('breakfast', 0) < days_logged * 0.9:
        recommendations.append(f"🍳 **Breakfast consistency:** Log breakfast more regularly. Currently logged {meal_freq.get('breakfast', 0)}/{days_logged} days.")

    if meal_freq.get('lunch', 0) < days_logged * 0.9:
        recommendations.append(f"🥗 **Lunch consistency:** Log lunch more regularly. Currently logged {meal_freq.get('lunch', 0)}/{days_logged} days.")

    if meal_freq.get('dinner', 0) < days_logged * 0.9:
        recommendations.append(f"🍽️ **Dinner consistency:** Log dinner more regularly. Currently logged {meal_freq.get('dinner', 0)}/{days_logged} days.")

    # Sodium:potassium
    if na_k_ratio > 1:
        recommendations.append(f"🥦 **Increase potassium:** Your sodium:potassium ratio is {na_k_ratio:.2f}:1. Aim for <1:1 by eating more vegetables, fruits, and legumes.")

    for rec in recommendations:
        report.append(f"- {rec}")

    report.append("")
    report.append("━" * 80)
    report.append("")
    report.append(f"*Report generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC*")

    return "\n".join(report)


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage: monthly_analysis.py YYYY-MM")
        print("Example: monthly_analysis.py 2025-10")
        sys.exit(1)

    # Parse arguments
    year_month = sys.argv[1]
    try:
        year, month = map(int, year_month.split('-'))
    except ValueError:
        print("Error: Invalid date format. Use YYYY-MM")
        sys.exit(1)

    # Validate date ranges to prevent path traversal and invalid dates
    if not (1900 <= year <= 2100):
        print(f"Error: Year {year} out of valid range (1900-2100)")
        sys.exit(1)
    if not (1 <= month <= 12):
        print(f"Error: Month {month} out of valid range (1-12)")
        sys.exit(1)

    # Analyze month
    print(f"Analyzing {year:04d}-{month:02d}...")
    analysis = analyze_month(year, month)

    if not analysis:
        print(f"No data found for {year:04d}-{month:02d}")
        sys.exit(1)

    # Generate report
    report = generate_markdown_report(analysis)

    # Save to file
    ANALYSIS_DIR.mkdir(parents=True, exist_ok=True)
    output_file = ANALYSIS_DIR / f"{year:04d}-{month:02d}.md"

    with open(output_file, 'w') as f:
        f.write(report)

    print(f"✅ Report generated: {output_file}")
    print("")

    # Also print to stdout
    print(report)


if __name__ == "__main__":
    main()
