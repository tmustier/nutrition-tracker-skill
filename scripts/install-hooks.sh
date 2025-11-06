#!/bin/bash
# Install optional git hooks for local development
#
# This script installs pre-commit hooks that:
# 1. Regenerate the index locally when dish files change (for preview)
# 2. Prevent accidental commits of the gitignored index file
#
# The index is NOT committed locally - it's managed by CI on the main branch.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOKS_DIR="$REPO_ROOT/.git/hooks"

echo "Installing git hooks..."
echo ""

# Check if we're in a git repository
if [ ! -d "$REPO_ROOT/.git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Install pre-commit hook
if [ -f "$SCRIPT_DIR/hooks/pre-commit" ]; then
    cp "$SCRIPT_DIR/hooks/pre-commit" "$HOOKS_DIR/pre-commit"
    chmod +x "$HOOKS_DIR/pre-commit"
    echo "✅ Installed pre-commit hook"
    echo "   → Regenerates index locally when dish files change"
    echo "   → Prevents accidental commits of index file"
else
    echo "⚠️  Pre-commit hook not found at $SCRIPT_DIR/hooks/pre-commit"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Hook installation complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "What this does:"
echo "  • When you commit dish files, the index is regenerated locally"
echo "  • The index is NOT committed (it's gitignored and managed by CI)"
echo "  • This gives you a local preview of the index"
echo ""
echo "To uninstall:"
echo "  rm $HOOKS_DIR/pre-commit"
echo ""
