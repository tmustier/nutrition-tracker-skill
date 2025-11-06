#!/usr/bin/env python3
"""
Merge food logs from multiple Claude branches into daily-logs branch.

This script discovers claude/* branches, extracts food log files, merges them
intelligently (concatenating entries by timestamp), and outputs the merged files
to the daily-logs working tree for the GitHub Actions workflow to commit.

Usage:
    python scripts/merge_food_logs.py

Exit codes:
    0 - Success (files merged successfully)
    1 - Conflicts detected (manual resolution required)
    2 - Errors (YAML parse failures, validation errors)
"""

import subprocess
import sys
import yaml
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Tuple
from collections import defaultdict
import json

class MergeConflict(Exception):
    """Raised when a merge conflict requires manual resolution."""
    pass

class ValidationError(Exception):
    """Raised when a log file fails schema validation."""
    pass

def run_git_command(cmd: List[str]) -> str:
    """Run a git command and return stdout."""
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"❌ Git command failed: {' '.join(cmd)}", file=sys.stderr)
        print(f"   Error: {e.stderr}", file=sys.stderr)
        raise

def get_remote_name() -> str:
    """
    Get the primary remote name (usually 'origin').

    Returns:
        Remote name, defaults to 'origin' if it exists, otherwise first remote
    """
    remotes = run_git_command(['git', 'remote']).split('\n')
    remotes = [r.strip() for r in remotes if r.strip()]

    if not remotes:
        raise RuntimeError("No git remotes found")

    return 'origin' if 'origin' in remotes else remotes[0]

def discover_claude_branches(remote: str) -> List[Tuple[str, str]]:
    """
    Discover all claude/* branches.

    Args:
        remote: Git remote name (e.g., 'origin')

    Returns:
        List of (branch_name, sha) tuples
    """
    print("🔍 Discovering claude/* branches...")

    output = run_git_command(['git', 'ls-remote', '--heads', remote, 'claude/*'])

    if not output:
        print("   No claude/* branches found")
        return []

    branches = []
    for line in output.split('\n'):
        if not line.strip():
            continue
        sha, ref = line.split('\t')
        branch_name = ref.replace('refs/heads/', '')
        branches.append((branch_name, sha))

    print(f"   Found {len(branches)} claude/* branches")
    return branches

def get_log_files_from_branch(branch: str, remote: str) -> Dict[str, str]:
    """
    Get all food log files from a branch.

    Args:
        branch: Branch name (e.g., 'claude/...')
        remote: Git remote name (e.g., 'origin')

    Returns:
        Dict mapping file paths to blob SHAs
    """
    try:
        output = run_git_command([
            'git', 'ls-tree', '-r', f'{remote}/{branch}', 'data/logs/'
        ])
    except subprocess.CalledProcessError:
        # Branch doesn't have data/logs/ directory
        return {}

    log_files = {}
    for line in output.split('\n'):
        if not line.strip():
            continue
        # Format: mode type sha\tpath
        parts = line.split()
        if len(parts) < 4:
            continue

        mode, obj_type, sha = parts[0], parts[1], parts[2]
        path = parts[3] if len(parts) == 4 else ' '.join(parts[3:])

        # Only include .yaml files, exclude SCHEMA.md
        if path.endswith('.yaml') and 'SCHEMA' not in path:
            log_files[path] = sha

    return log_files

def extract_file_content(branch: str, file_path: str, remote: str) -> str:
    """
    Extract file content from a branch using git show.

    Args:
        branch: Branch name (e.g., 'claude/...')
        file_path: Path to file in repo
        remote: Git remote name (e.g., 'origin')
    """
    try:
        content = run_git_command([
            'git', 'show', f'{remote}/{branch}:{file_path}'
        ])
        return content
    except subprocess.CalledProcessError:
        print(f"⚠️  Failed to extract {file_path} from {branch}", file=sys.stderr)
        raise

def validate_log_schema(log_data: dict, file_path: str) -> List[str]:
    """
    Validate food log schema.

    Returns:
        List of validation errors (empty if valid)
    """
    errors = []

    # Check required top-level fields
    required_fields = ['date', 'day_type', 'entries']
    for field in required_fields:
        if field not in log_data:
            errors.append(f"Missing required field: {field}")

    # Validate day_type
    if 'day_type' in log_data:
        if log_data['day_type'] not in ['rest', 'training']:
            errors.append(f"day_type must be 'rest' or 'training', got: {log_data['day_type']}")

    # Validate entries
    if 'entries' not in log_data:
        return errors

    if not isinstance(log_data['entries'], list):
        errors.append("entries must be a list")
        return errors

    # Validate each entry
    for i, entry in enumerate(log_data['entries']):
        if not isinstance(entry, dict):
            errors.append(f"Entry {i} must be a dictionary")
            continue

        if 'timestamp' not in entry:
            errors.append(f"Entry {i} missing timestamp")
        else:
            # Validate ISO 8601 format
            try:
                datetime.fromisoformat(entry['timestamp'].replace('Z', '+00:00'))
            except ValueError:
                errors.append(f"Entry {i} has invalid timestamp: {entry['timestamp']}")

        if 'items' not in entry:
            errors.append(f"Entry {i} missing items")
            continue

        if not isinstance(entry['items'], list):
            errors.append(f"Entry {i} items must be a list")
            continue

        # Validate each item
        for j, item in enumerate(entry['items']):
            if not isinstance(item, dict):
                errors.append(f"Entry {i}, item {j} must be a dictionary")
                continue

            # Check required item fields
            required_item_fields = ['name', 'quantity', 'unit', 'nutrition']
            for field in required_item_fields:
                if field not in item:
                    errors.append(f"Entry {i}, item {j} missing: {field}")

            # Validate nutrition object
            if 'nutrition' in item:
                nutrition = item['nutrition']
                if not isinstance(nutrition, dict):
                    errors.append(f"Entry {i}, item {j}: nutrition must be a dictionary")
                    continue

                # Check for null values (forbidden per schema)
                for field, value in nutrition.items():
                    if value is None:
                        errors.append(f"Entry {i}, item {j}: nutrition.{field} is null (must be numeric)")
                    elif not isinstance(value, (int, float)):
                        errors.append(f"Entry {i}, item {j}: nutrition.{field} must be numeric, got {type(value).__name__}")
                    elif value < 0:
                        errors.append(f"Entry {i}, item {j}: nutrition.{field} must be >= 0, got {value}")

    return errors

def merge_log_files(files_by_branch: Dict[str, dict], file_path: str) -> dict:
    """
    Merge multiple versions of the same log file from different branches.

    Args:
        files_by_branch: Dict mapping branch_name -> log_data
        file_path: The file path being merged (for error messages)

    Returns:
        Merged log data

    Raises:
        MergeConflict: If branches have conflicting metadata
        ValidationError: If any branch has invalid data
    """
    if len(files_by_branch) == 1:
        # Only one branch has this file, no merge needed
        return list(files_by_branch.values())[0]

    print(f"   Merging {len(files_by_branch)} versions of {file_path}")

    # Extract all versions
    versions = list(files_by_branch.items())

    # Use first version as base
    base_branch, base_data = versions[0]
    merged_date = base_data['date']
    merged_day_type = base_data['day_type']

    # Check for metadata conflicts
    for branch, data in versions[1:]:
        if data['date'] != merged_date:
            raise MergeConflict(
                f"Date mismatch in {file_path}: "
                f"{base_branch} has {merged_date}, {branch} has {data['date']}"
            )

        if data['day_type'] != merged_day_type:
            raise MergeConflict(
                f"day_type conflict in {file_path}: "
                f"{base_branch} has {merged_day_type}, {branch} has {data['day_type']}"
            )

    # Merge entries from all branches
    all_entries = []
    for branch, data in versions:
        all_entries.extend(data['entries'])

    # Sort by timestamp
    all_entries.sort(key=lambda e: e['timestamp'])

    # Check for duplicate timestamps and merge items if needed
    merged_entries = []
    entries_by_timestamp = defaultdict(list)

    for entry in all_entries:
        entries_by_timestamp[entry['timestamp']].append(entry)

    for timestamp in sorted(entries_by_timestamp.keys()):
        entries = entries_by_timestamp[timestamp]

        if len(entries) == 1:
            # No duplicates, add as-is
            merged_entries.append(entries[0])
        else:
            # Multiple entries with same timestamp - merge items
            print(f"   ⚠️  REVIEW NEEDED: {len(entries)} entries merged at {timestamp}")
            print(f"       This may indicate duplicate logging. Please verify the merged result.")

            all_items = []
            merged_notes = []

            for entry in entries:
                all_items.extend(entry['items'])
                if 'notes' in entry and entry['notes']:
                    merged_notes.append(entry['notes'])

            # Deduplicate items by comparing key properties
            # Use name, food_bank_id, quantity, unit as unique identifier
            seen_items = {}  # key -> item
            nutrition_conflicts = []
            
            for item in all_items:
                # Create unique key from item properties
                item_key = (
                    item.get('name'),
                    item.get('food_bank_id'),
                    item.get('quantity'),
                    item.get('unit')
                )

                if item_key not in seen_items:
                    seen_items[item_key] = item
                else:
                    # Check if nutrition values differ
                    existing_nutrition = seen_items[item_key].get('nutrition', {})
                    current_nutrition = item.get('nutrition', {})
                    
                    if existing_nutrition != current_nutrition:
                        conflict_msg = f"Same item '{item.get('name')}' has different nutrition values"
                        nutrition_conflicts.append(conflict_msg)
                        print(f"      ⚠️  CONFLICT: {conflict_msg}")
                        print(f"         Existing: {existing_nutrition}")
                        print(f"         New:      {current_nutrition}")
                        print(f"         Using first version found")

            deduplicated_items = list(seen_items.values())
            
            # Add nutrition conflicts to warnings if any found
            if nutrition_conflicts:
                stats.setdefault('warnings', []).extend(nutrition_conflicts)

            # Log if deduplication occurred
            if len(deduplicated_items) < len(all_items):
                print(f"      Deduplicated {len(all_items)} items → {len(deduplicated_items)} unique items")

            merged_entry = {
                'timestamp': timestamp,
                'items': deduplicated_items
            }

            # Deduplicate notes as well
            unique_notes = []
            seen_notes = set()
            for note in merged_notes:
                if note not in seen_notes:
                    unique_notes.append(note)
                    seen_notes.add(note)

            if unique_notes:
                merged_entry['notes'] = ' | '.join(unique_notes)

            merged_entries.append(merged_entry)

    # Build merged log
    merged_log = {
        'date': merged_date,
        'day_type': merged_day_type,
        'entries': merged_entries
    }

    # Validate merged result
    errors = validate_log_schema(merged_log, file_path)
    if errors:
        raise ValidationError(
            f"Merged {file_path} failed validation:\n" + "\n".join(f"  - {e}" for e in errors)
        )

    return merged_log

def load_processed_state() -> dict:
    """
    Load state of previously processed branches.

    P1 Security Fix: Added file locking to prevent race conditions.
    Uses fcntl for exclusive locking to ensure atomic read operations.
    """
    import fcntl
    state_file = Path('.github/workflows/processed-branches.json')
    lock_file = Path('.github/workflows/processed-branches.json.lock')

    # Ensure lock directory exists
    lock_file.parent.mkdir(parents=True, exist_ok=True)

    # Acquire exclusive lock
    with open(lock_file, 'w') as lock:
        try:
            # Wait for lock (blocking)
            fcntl.flock(lock.fileno(), fcntl.LOCK_EX)

            if not state_file.exists():
                return {'last_run': None, 'processed': {}}

            try:
                with open(state_file, 'r') as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError):
                print("⚠️  Warning: Could not load processed-branches.json, starting fresh")
                return {'last_run': None, 'processed': {}}
        finally:
            # Release lock
            fcntl.flock(lock.fileno(), fcntl.LOCK_UN)

def save_processed_state(state: dict):
    """
    Save state of processed branches.

    P1 Security Fix: Added file locking to prevent race conditions.
    Uses fcntl for exclusive locking to ensure atomic write operations.
    """
    import fcntl
    state_file = Path('.github/workflows/processed-branches.json')
    lock_file = Path('.github/workflows/processed-branches.json.lock')
    state_file.parent.mkdir(parents=True, exist_ok=True)

    # Acquire exclusive lock
    with open(lock_file, 'w') as lock:
        try:
            # Wait for lock (blocking)
            fcntl.flock(lock.fileno(), fcntl.LOCK_EX)

            # Write state file atomically by writing to temp file then renaming
            temp_file = state_file.with_suffix('.json.tmp')
            with open(temp_file, 'w') as f:
                json.dump(state, f, indent=2)

            # Atomic rename (on Unix systems)
            temp_file.rename(state_file)
        finally:
            # Release lock
            fcntl.flock(lock.fileno(), fcntl.LOCK_UN)

def load_existing_log(file_path: str) -> dict:
    """
    Load existing log file from working tree to preserve manual edits.
    
    Args:
        file_path: Path to log file (e.g., 'data/logs/2024-01/15.yaml')
    
    Returns:
        Log data dict if file exists and is valid, None otherwise
    """
    try:
        log_file = Path(file_path)
        if not log_file.exists():
            return None
            
        # Path traversal protection: ensure file is within data/logs/
        allowed_base = Path.cwd() / 'data' / 'logs'
        resolved_path = log_file.resolve()
        if not str(resolved_path).startswith(str(allowed_base.resolve())):
            print(f"⚠️  Security: Skipping file outside data/logs/: {file_path}")
            return None
            
        with open(log_file, 'r', encoding='utf-8') as f:
            log_data = yaml.safe_load(f)
            
        # Validate the existing log
        errors = validate_log_schema(log_data, file_path)
        if errors:
            print(f"⚠️  Working tree {file_path} has validation errors, skipping")
            for error in errors[:3]:  # Show first 3 errors
                print(f"     - {error}")
            return None
            
        return log_data
        
    except (yaml.YAMLError, IOError, ValueError) as e:
        print(f"⚠️  Could not load existing {file_path}: {e}")
        return None

def main():
    """Main entry point."""
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("Food Log Aggregation from Claude Branches")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    # Get remote name
    remote = get_remote_name()

    # Load state
    state = load_processed_state()

    # Discover branches
    branches = discover_claude_branches(remote)

    if not branches:
        print("\n✓ No claude/* branches found, nothing to do")
        return 0

    # Statistics
    stats = {
        'branches_scanned': 0,
        'branches_skipped': 0,
        'files_extracted': 0,
        'files_merged': 0,
        'conflicts': [],
        'errors': [],
        'warnings': []
    }

    # Collect all log files grouped by path
    files_by_path = defaultdict(dict)  # path -> {branch -> (sha, content)}

    for branch_name, branch_sha in branches:
        stats['branches_scanned'] += 1

        # Check if already processed at this SHA
        if branch_name in state['processed']:
            processed_sha = state['processed'][branch_name].get('sha')
            if processed_sha == branch_sha:
                print(f"\n✓ {branch_name}")
                print(f"  Already processed at {branch_sha[:7]}")
                stats['branches_skipped'] += 1
                continue

        print(f"\n📂 {branch_name} ({branch_sha[:7]})")

        # Get log files from this branch
        log_files = get_log_files_from_branch(branch_name, remote)

        if not log_files:
            print("  No log files found")
            stats['branches_skipped'] += 1
            continue

        print(f"  Found {len(log_files)} log files")

        # Extract each file
        for file_path, file_sha in log_files.items():
            try:
                content = extract_file_content(branch_name, file_path, remote)

                # Parse YAML
                log_data = yaml.safe_load(content)

                # Validate
                errors = validate_log_schema(log_data, file_path)
                if errors:
                    error_msg = f"{branch_name}:{file_path} validation failed:\n" + "\n".join(f"    - {e}" for e in errors)
                    print(f"  ❌ {file_path}: Validation errors")
                    stats['errors'].append(error_msg)
                    continue

                # Store for merging
                files_by_path[file_path][branch_name] = log_data
                stats['files_extracted'] += 1
                print(f"  ✓ {file_path}")

            except yaml.YAMLError as e:
                error_msg = f"{branch_name}:{file_path} YAML parse error: {e}"
                print(f"  ❌ {file_path}: YAML error")
                stats['errors'].append(error_msg)
            except Exception as e:
                error_msg = f"{branch_name}:{file_path} unexpected error: {e}"
                print(f"  ❌ {file_path}: Error")
                stats['errors'].append(error_msg)

        # Mark branch as processed
        state['processed'][branch_name] = {
            'sha': branch_sha,
            'processed_at': datetime.now(timezone.utc).isoformat(),
            'files_extracted': len(log_files)
        }

    # Merge files with same path
    print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("Merging files")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    merged_files = {}

    for file_path, files_by_branch in files_by_path.items():
        try:
            # Load existing file from working tree to preserve manual edits
            working_tree_data = load_existing_log(file_path)
            if working_tree_data:
                # Add working tree version to merge candidates
                files_by_branch['working-tree'] = working_tree_data
                print(f"   Including existing working tree version of {file_path}")

            merged_data = merge_log_files(files_by_branch, file_path)
            merged_files[file_path] = merged_data

            if len(files_by_branch) > 1:
                stats['files_merged'] += 1
                print(f"✓ {file_path} (merged from {len(files_by_branch)} sources)")
            else:
                print(f"✓ {file_path}")

        except MergeConflict as e:
            print(f"⚠️  {file_path}: Conflict")
            stats['conflicts'].append(str(e))
        except ValidationError as e:
            print(f"❌ {file_path}: Validation error after merge")
            stats['errors'].append(str(e))

    # Write merged files to disk
    if merged_files:
        print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("Writing merged files")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

        # Define allowed base directory for security
        allowed_base = Path.cwd() / 'data' / 'logs'

        for file_path, log_data in merged_files.items():
            output_path = Path(file_path).resolve()

            # Path traversal protection: ensure file is within data/logs/
            if not str(output_path).startswith(str(allowed_base.resolve())):
                error_msg = f"Security: File path {file_path} attempts to write outside data/logs/"
                print(f"❌ {file_path}: Path traversal detected")
                stats['errors'].append(error_msg)
                continue

            output_path.parent.mkdir(parents=True, exist_ok=True)

            with open(output_path, 'w') as f:
                yaml.dump(log_data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

            print(f"✓ Wrote {file_path}")

    # Update state
    state['last_run'] = datetime.now(timezone.utc).isoformat()
    save_processed_state(state)

    # Print summary
    print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("📊 Summary")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"Branches scanned:  {stats['branches_scanned']}")
    print(f"Branches skipped:  {stats['branches_skipped']}")
    print(f"Files extracted:   {stats['files_extracted']}")
    print(f"Files merged:      {stats['files_merged']}")
    print(f"Conflicts:         {len(stats['conflicts'])}")
    print(f"Warnings:          {len(stats['warnings'])}")
    print(f"Errors:            {len(stats['errors'])}")

    # Print warnings
    if stats['warnings']:
        print("\n⚠️  Warnings (review recommended):")
        for warning in stats['warnings']:
            print(f"  - {warning}")

    # Print conflicts
    if stats['conflicts']:
        print("\n⚠️  Conflicts requiring manual resolution:")
        for conflict in stats['conflicts']:
            print(f"  - {conflict}")

    # Print errors
    if stats['errors']:
        print("\n❌ Errors encountered:")
        for error in stats['errors']:
            print(f"  - {error}")

    # Determine exit code
    if stats['errors']:
        print("\n❌ Exiting with errors")
        return 2
    elif stats['conflicts']:
        print("\n⚠️  Exiting with conflicts")
        return 1
    else:
        print("\n✅ Success!")
        return 0

if __name__ == '__main__':
    sys.exit(main())
