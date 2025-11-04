#!/usr/bin/env python3
"""
YAML Standardization Script for Food Data Bank

This script standardizes YAML formatting in markdown files:
1. Converts single quotes to double quotes for string values
2. Converts inline arrays to block-style format
3. Preserves numbers, nulls, and formulas
4. Errors on double quotes inside strings (manual handling required)

Usage:
    python standardize_yaml.py [file1.md file2.md ...]
    python standardize_yaml.py --validate-only [file1.md ...]
    python standardize_yaml.py --all  # Process all files in data/food-data-bank/
"""

import re
import sys
import yaml
from pathlib import Path
from typing import List, Tuple


def extract_yaml_from_markdown(content: str) -> Tuple[str, str, str]:
    """
    Extract YAML block from markdown content.
    Returns: (before_yaml, yaml_content, after_yaml)
    """
    pattern = r'^(.*?)```yaml\n(.*?)\n```(.*)$'
    match = re.match(pattern, content, re.DOTALL)
    if not match:
        raise ValueError("No YAML block found in markdown")
    return match.group(1), match.group(2), match.group(3)


def standardize_yaml_formatting(yaml_content: str) -> str:
    """
    Standardize YAML formatting:
    - Convert single quotes to double quotes
    - Convert inline arrays to block-style
    - Preserve numbers, nulls, formulas
    """
    lines = yaml_content.split('\n')
    result = []

    for line in lines:
        # Skip empty lines
        if not line.strip():
            result.append(line)
            continue

        # Skip lines that are already list items
        if line.strip().startswith('- '):
            # Convert single quotes to double quotes in list items
            if "'" in line:
                # Check for embedded double quotes (should error)
                if '"' in line:
                    raise ValueError(f"Line contains both single and double quotes: {line}")
                line = convert_single_to_double_quotes(line)
            result.append(line)
            continue

        # Check if line has a key-value pair
        if ': ' in line:
            key_part, value_part = line.split(': ', 1)
            indent = len(line) - len(line.lstrip())

            # Handle inline arrays
            if value_part.strip().startswith('['):
                # Convert inline array to block-style
                block_lines = convert_inline_array_to_block(key_part, value_part, indent)
                result.extend(block_lines)
                continue

            # Handle string values with single quotes
            if value_part.strip().startswith("'"):
                # Check for embedded double quotes (should error)
                if '"' in value_part:
                    raise ValueError(f"Line contains both single and double quotes: {line}")
                value_part = convert_single_to_double_quotes(value_part)

            result.append(f"{key_part}: {value_part}")
        else:
            result.append(line)

    return '\n'.join(result)


def convert_single_to_double_quotes(text: str) -> str:
    """
    Convert single quotes to double quotes in string values.
    Preserves the content, just changes the quote style.
    """
    # Match single-quoted strings
    pattern = r"'([^']*)'"

    def replace_quotes(match):
        content = match.group(1)
        # Check if content contains double quotes (should error)
        if '"' in content:
            raise ValueError(f"String contains double quotes: {content}")
        return f'"{content}"'

    return re.sub(pattern, replace_quotes, text)


def convert_inline_array_to_block(key_part: str, value_part: str, indent: int) -> List[str]:
    """
    Convert inline array to block-style format.

    Examples:
        aliases: [] -> aliases: []
        evidence: ["a", "b"] -> evidence:\n  - "a"\n  - "b"
    """
    value = value_part.strip()

    # Handle empty arrays - keep them as []
    if value == '[]':
        return [f"{key_part}: []"]

    # Parse the array
    # Match array items (quoted strings or other values)
    pattern = r'\[(.*?)\]'
    match = re.match(pattern, value)
    if not match:
        return [f"{key_part}: {value_part}"]

    inner = match.group(1).strip()
    if not inner:
        return [f"{key_part}: []"]

    # Split items by comma (respecting quotes)
    items = split_array_items(inner)

    # Convert single quotes to double quotes in items
    items = [convert_single_to_double_quotes(item.strip()) if "'" in item else item.strip()
             for item in items]

    # Build block-style array
    indent_str = ' ' * indent
    result = [f"{key_part}:"]
    for item in items:
        result.append(f"{indent_str}  - {item}")

    return result


def split_array_items(array_content: str) -> List[str]:
    """
    Split array items by comma, respecting quoted strings.
    """
    items = []
    current = []
    in_quote = False
    quote_char = None

    for char in array_content:
        if char in ('"', "'") and (not in_quote or char == quote_char):
            in_quote = not in_quote
            quote_char = char if in_quote else None
            current.append(char)
        elif char == ',' and not in_quote:
            items.append(''.join(current).strip())
            current = []
        else:
            current.append(char)

    if current:
        items.append(''.join(current).strip())

    return [item for item in items if item]


def validate_yaml(yaml_content: str) -> bool:
    """
    Validate that YAML can be parsed correctly.
    """
    try:
        yaml.safe_load(yaml_content)
        return True
    except yaml.YAMLError as e:
        print(f"YAML validation error: {e}")
        return False


def process_file(file_path: Path, validate_only: bool = False) -> bool:
    """
    Process a single markdown file to standardize YAML formatting.
    Returns True if successful, False otherwise.
    """
    try:
        # Read file
        content = file_path.read_text()

        # Extract YAML
        before, yaml_content, after = extract_yaml_from_markdown(content)

        # Validate current YAML
        if not validate_yaml(yaml_content):
            print(f"❌ {file_path}: Current YAML is invalid")
            return False

        if validate_only:
            print(f"✓ {file_path}: YAML is valid")
            return True

        # Standardize
        standardized_yaml = standardize_yaml_formatting(yaml_content)

        # Validate standardized YAML
        if not validate_yaml(standardized_yaml):
            print(f"❌ {file_path}: Standardized YAML is invalid")
            return False

        # Write back
        new_content = f"{before}```yaml\n{standardized_yaml}\n```{after}"
        file_path.write_text(new_content)

        print(f"✓ {file_path}: Standardized successfully")
        return True

    except Exception as e:
        print(f"❌ {file_path}: Error - {e}")
        return False


def main():
    import argparse

    parser = argparse.ArgumentParser(description='Standardize YAML formatting in food data bank files')
    parser.add_argument('files', nargs='*', help='Files to process')
    parser.add_argument('--all', action='store_true', help='Process all files in data/food-data-bank/')
    parser.add_argument('--validate-only', action='store_true', help='Only validate, do not modify files')

    args = parser.parse_args()

    # Determine files to process
    if args.all:
        base_path = Path('data/food-data-bank')
        files = sorted(base_path.rglob('*.md'))
    elif args.files:
        files = [Path(f) for f in args.files]
    else:
        print("Error: Provide files or use --all flag")
        sys.exit(1)

    # Process files
    success_count = 0
    fail_count = 0

    for file_path in files:
        if process_file(file_path, args.validate_only):
            success_count += 1
        else:
            fail_count += 1

    # Summary
    print(f"\n{'Validation' if args.validate_only else 'Processing'} complete:")
    print(f"  ✓ Success: {success_count}")
    print(f"  ❌ Failed: {fail_count}")

    sys.exit(0 if fail_count == 0 else 1)


if __name__ == '__main__':
    main()
