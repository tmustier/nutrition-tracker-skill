#!/usr/bin/env python3
"""
Shared venue categorization logic.

Used by both new_dish_from_template.py and validate_venue_config.py
to ensure consistent categorization of venues.
"""

import re


def slugify(text):
    """Convert text to URL-friendly slug format."""
    # Convert to lowercase
    text = text.lower()
    # Replace spaces and special chars with hyphens
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    # Remove leading/trailing hyphens
    text = text.strip('-')
    return text


def categorize_venue(venue_display_name):
    """
    Intelligently categorize a venue based on its name using heuristic pattern matching.

    This is the fallback categorization when a venue is not in the config file.

    Returns:
        tuple: (category_type, folder_name)
        where category_type is one of: 'packaged', 'venues', 'generic'

    Rules (in order of precedence):
    1. Packaged product indicators → 'packaged'
    2. Generic category keywords with specific folder mapping
    3. Shop/store indicators → 'generic' (checked BEFORE location keywords)
    4. Restaurant/venue indicators → 'venues'
    5. Location-based keywords → 'venues'
    6. Brand indicators → 'packaged'
    7. Name structure analysis (caps, numbers, business suffixes)
    8. Default → 'generic'
    """
    venue_lower = venue_display_name.lower()

    # Packaged product indicators
    if '(packaged product)' in venue_lower or '(pack/ingredient)' in venue_lower:
        return ('packaged', slugify(venue_display_name))

    # Generic category keywords with specific folder mapping
    if any(kw in venue_lower for kw in ['ingredient', 'generic', 'homemade', 'bakery', 'grocery', 'supplement']):
        # Map to specific generic subfolder
        if 'bakery' in venue_lower:
            return ('generic', 'bakery')
        elif 'ingredient' in venue_lower or venue_lower == 'generic':
            return ('generic', 'ingredients')
        elif 'homemade' in venue_lower or 'home' in venue_lower:
            return ('generic', 'home-cooked')
        elif 'grocery' in venue_lower:
            return ('generic', 'grocery')
        elif 'supplement' in venue_lower:
            return ('generic', 'supplements')
        elif 'pub' in venue_lower:
            return ('generic', 'pub-bar')
        elif 'fresh' in venue_lower or 'fruit' in venue_lower or 'produce' in venue_lower:
            return ('generic', 'fresh-produce')
        else:
            return ('generic', 'ingredients')

    # Shop/store indicators → generic category (check BEFORE location keywords)
    # This prevents "Whole Foods Market" from being classified as venue
    shop_patterns = [
        'shop', 'store', 'market', 'supermarket', 'mart', 'grocer', 'deli',
        'boutique', 'emporium', 'trading', 'retail', 'wholesale'
    ]
    if any(pattern in venue_lower for pattern in shop_patterns):
        return ('generic', slugify(venue_display_name))

    # Restaurant/venue indicators → venues category
    restaurant_patterns = [
        'restaurant', 'cafe', 'coffee', 'bistro', 'grill', 'kitchen', 'bar', 'pub', 'tavern',
        'trattoria', 'brasserie', 'canteen', 'eatery', 'diner', 'pizzeria', 'steakhouse',
        'pizza', 'burger', 'sushi', 'noodle', 'ramen', 'curry', 'thai', 'chinese',
        'indian', 'italian', 'japanese', 'korean', 'vietnamese', 'mexican',
        'bbq', 'barbecue', 'gourmet', 'dining', 'bites', 'eats', 'plates'
    ]
    if any(pattern in venue_lower for pattern in restaurant_patterns):
        return ('venues', slugify(venue_display_name))

    # UK/international location indicators → probably a venue
    location_keywords = [
        'london', 'manchester', 'birmingham', 'soho', 'mayfair', 'shoreditch',
        'farringdon', 'marylebone', 'kings cross', 'covent garden', 'chelsea',
        'camden', 'hackney', 'islington', 'street', 'road', 'square', 'market'
    ]
    if any(loc in venue_lower for loc in location_keywords):
        return ('venues', slugify(venue_display_name))

    # Packaged brand indicators → packaged category
    brand_patterns = [
        r'\bltd\b', r'\blimited\b', r'\binc\b', r'\bcorp\b', r'\bco\b',
        r'\bbrand', r'\bfoods?\b', r'\bproducts?\b', r'\bindustries\b',
        r'\borganics?\b', r'\bnutrition\b', r'\bhealth\b'
    ]
    if any(re.search(pattern, venue_lower) for pattern in brand_patterns):
        # Check if it's actually a product brand (not just coincidental match)
        words = venue_display_name.split()
        # Short capitalized names (1-2 words) are usually brands
        if len(words) <= 2 and all(w[0].isupper() for w in words if w):
            return ('packaged', slugify(venue_display_name))

    # Smart fallback based on name structure
    words = venue_display_name.split()

    # Single word, all caps → likely a brand
    if len(words) == 1 and venue_display_name.isupper():
        return ('packaged', slugify(venue_display_name))

    # Contains numbers or version indicators → likely a packaged product
    if any(char.isdigit() for char in venue_display_name) or 'v.' in venue_lower or 'version' in venue_lower:
        return ('packaged', slugify(venue_display_name))

    # Multi-word with formal business structure (e.g., "Pine Foods Ltd") → packaged
    if len(words) >= 2 and any(w.lower() in ['ltd', 'limited', 'inc', 'corp', 'co.'] for w in words):
        return ('packaged', slugify(venue_display_name))

    # Check if name suggests it's a venue (has location or establishment words)
    venue_suggesting_words = ['house', 'palace', 'corner', 'place', 'hall', 'room', 'club']
    if any(word in venue_lower for word in venue_suggesting_words):
        return ('venues', slugify(venue_display_name))

    # Default: Use generic as safe fallback (most flexible)
    # Works well for shops, retailers, and ambiguous cases
    return ('generic', slugify(venue_display_name))


def can_auto_categorize(folder_name, actual_category):
    """
    Check if a folder can be correctly auto-categorized.

    Args:
        folder_name: The folder name (slugified venue name)
        actual_category: The actual category the folder is in ('venues', 'packaged', 'generic')

    Returns:
        bool: True if auto-categorization would place it in the correct category
    """
    # Convert folder name back to display name for categorization
    # (Best effort - replace hyphens with spaces and title case)
    display_name = folder_name.replace('-', ' ').title()

    predicted_category, _ = categorize_venue(display_name)

    return predicted_category == actual_category
