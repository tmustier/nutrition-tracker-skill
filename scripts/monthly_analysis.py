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


def parse_daily_log(log_file: Path) -> Dict:
    """Parse a single daily log file."""
    with open(log_file, 'r') as f:
        data = yaml.safe_load(f)

    # Calculate daily totals
    daily_totals = defaultdict(float)
    meal_times = []
    items_consumed = []

    for entry in data.get('entries', []):
        timestamp = entry.get('timestamp', '')
        meal_times.append(timestamp)

        for item in entry.get('items', []):
            items_consumed.append(item.get('name'))
            nutrition = item.get('nutrition', {})

            # Sum up all nutrients
            for nutrient, value in nutrition.items():
                if value is not None and isinstance(value, (int, float)):
                    daily_totals[nutrient] += value

    # Classify meals
    meal_classification = defaultdict(int)
    for ts in meal_times:
        meal_type = classify_meal_time(ts)
        meal_classification[meal_type] += 1

    return {
        'date': data.get('date'),
        'day_type': data.get('day_type'),
        'totals': dict(daily_totals),
        'meals': dict(meal_classification),
        'num_entries': len(data.get('entries', [])),
        'items': items_consumed
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

    # Calculate monthly aggregates
    nutrients = [
        'energy_kcal', 'protein_g', 'fat_g', 'carbs_total_g', 'fiber_total_g',
        'sat_fat_g', 'mufa_g', 'pufa_g', 'sugar_g', 'sodium_mg', 'potassium_mg',
        'calcium_mg', 'iron_mg', 'magnesium_mg', 'zinc_mg', 'vitamin_c_mg'
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

    compliance['energy_rest'] = sum(1 for d in rest_days if d['totals'].get('energy_kcal', 0) <= targets['energy_kcal']['rest_day_max'])
    compliance['energy_training'] = sum(1 for d in training_days if d['totals'].get('energy_kcal', 0) <= targets['energy_kcal']['training_day_max'])

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

    return analysis


def generate_markdown_report(analysis: Dict) -> str:
    """Generate comprehensive markdown report."""
    if not analysis:
        return "# No data available\n"

    year = analysis['year']
    month = analysis['month']
    month_name = analysis['month_name']
    days_logged = analysis['days_logged']
    profile = analysis['profile']
    targets = profile.get('targets', {})
    summary = analysis['summary']
    compliance = analysis['compliance']
    meal_freq = analysis['meal_frequency']

    # Calculate overall compliance rate
    total_checks = sum(compliance.values())
    max_checks = days_logged * 6  # 6 main targets
    compliance_pct = (total_checks / max_checks * 100) if max_checks > 0 else 0

    report = []

    # Header
    report.append(f"# 📊 MONTHLY NUTRITION ANALYSIS")
    report.append(f"## {month_name} {year}")
    report.append("")
    report.append("━" * 80)
    report.append("")

    # Executive Summary
    report.append("## 📈 EXECUTIVE SUMMARY")
    report.append("")
    report.append(f"```")
    report.append(f"📅 Days Logged:        {days_logged} days")
    report.append(f"🏋️  Training Days:      {analysis['training_days']} days")
    report.append(f"😴 Rest Days:          {analysis['rest_days']} days")
    report.append(f"🎯 Overall Compliance: {compliance_pct:.1f}%")
    report.append(f"🍽️  Unique Foods:       {analysis['unique_foods']} items")
    report.append(f"```")
    report.append("")

    # Meal Frequency Dashboard
    report.append("## 🍽️ MEAL FREQUENCY ANALYSIS")
    report.append("")
    report.append("| Meal Type | Days Logged | % of Days | Status |")
    report.append("|-----------|-------------|-----------|--------|")

    for meal_type in ['breakfast', 'lunch', 'dinner', 'late_night']:
        count = meal_freq.get(meal_type, 0)
        pct = (count / days_logged * 100) if days_logged > 0 else 0

        # Status indicator
        if meal_type == 'late_night':
            status = "⚠️ Watch" if count > days_logged * 0.3 else "✅"
        else:
            status = "⚠️ Missing meals" if pct < 90 and meal_type != 'late_night' else "✅"

        report.append(f"| {meal_type.title()} | {count}/{days_logged} | {pct:.1f}% | {status} |")

    report.append("")

    # Key insights
    missing_meals = []
    if meal_freq.get('breakfast', 0) < days_logged:
        missing_meals.append(f"**Breakfast** missing on {days_logged - meal_freq.get('breakfast', 0)} days")
    if meal_freq.get('lunch', 0) < days_logged:
        missing_meals.append(f"**Lunch** missing on {days_logged - meal_freq.get('lunch', 0)} days")
    if meal_freq.get('dinner', 0) < days_logged:
        missing_meals.append(f"**Dinner** missing on {days_logged - meal_freq.get('dinner', 0)} days")

    if missing_meals:
        report.append("### ⚠️ Missing Meals Detected")
        report.append("")
        for msg in missing_meals:
            report.append(f"- {msg}")
        report.append("")

    # Target Achievement Dashboard
    report.append("## 🎯 TARGET ACHIEVEMENT")
    report.append("")

    # Macronutrients
    report.append("### Macronutrients")
    report.append("")

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

        report.append(f"**{label}** (target: {target_val}{key.split('_')[-1]})")
        report.append(f"```")
        report.append(f"Average:  {bar}")
        report.append(f"Range:    {summary[key]['min']:.1f} - {summary[key]['max']:.1f}")
        report.append(f"Status:   {status}")
        report.append(f"```")
        report.append("")

    # Energy
    report.append("### Energy")
    report.append("")
    avg_energy = summary['energy_kcal']['mean']
    rest_target = targets['energy_kcal']['rest_day_max']
    training_target = targets['energy_kcal']['training_day_max']

    report.append(f"**Daily Energy** (Rest: {rest_target} kcal | Training: {training_target} kcal)")
    report.append(f"```")
    bar = generate_bar_chart(avg_energy, training_target * 1.2)
    report.append(f"Average:  {bar}")
    report.append(f"Range:    {summary['energy_kcal']['min']:.0f} - {summary['energy_kcal']['max']:.0f} kcal")
    report.append(f"```")
    report.append("")

    # Limits (things to stay under)
    report.append("### Limits (Stay Under)")
    report.append("")

    limit_targets = [
        ('Saturated Fat', 'sat_fat_g', targets.get('sat_fat_g_max'), 'max'),
        ('Sodium', 'sodium_mg', targets.get('sodium_mg_max'), 'max'),
    ]

    for label, key, target_val, target_type in limit_targets:
        avg = summary[key]['mean']
        status = generate_compliance_indicator(avg, target_max=target_val)
        bar = generate_bar_chart(avg, target_val * 1.5, target=target_val)

        report.append(f"**{label}** (max: {target_val}{key.split('_')[-1]})")
        report.append(f"```")
        report.append(f"Average:  {bar}")
        report.append(f"Range:    {summary[key]['min']:.1f} - {summary[key]['max']:.1f}")
        report.append(f"Status:   {status}")
        report.append(f"```")
        report.append("")

    # Micronutrients
    report.append("## 🔬 MICRONUTRIENT AVERAGES")
    report.append("")
    report.append("| Nutrient | Daily Average | Range |")
    report.append("|----------|---------------|-------|")

    micronutrients = [
        ('Potassium', 'potassium_mg', 'mg'),
        ('Calcium', 'calcium_mg', 'mg'),
        ('Magnesium', 'magnesium_mg', 'mg'),
        ('Iron', 'iron_mg', 'mg'),
        ('Zinc', 'zinc_mg', 'mg'),
        ('Vitamin C', 'vitamin_c_mg', 'mg'),
    ]

    for label, key, unit in micronutrients:
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

        if day_type == 'rest':
            energy_ok = energy <= targets['energy_kcal']['rest_day_max']
        else:
            energy_ok = energy <= targets['energy_kcal']['training_day_max']

        status = "✅" if (protein_ok and fiber_ok and energy_ok and meal_count == 3) else "⚠️"

        report.append(f"| {date} | {day_type.title()[:4]} | {energy:.0f} | {protein:.0f}g | {fiber:.1f}g | {meal_count}/3 | {status} |")

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
    report.append(f"*Report generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*")

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
