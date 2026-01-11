#!/bin/bash

# Quick fix runner - runs all fixes with sensible defaults
# Usage:
#   ./scripts/quick-fix.sh              # Live run
#   ./scripts/quick-fix.sh --dry-run    # Test run

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🚀 Quick Fix Runner for Børnespilguiden"
echo ""
echo "This will run all three fix scripts:"
echo "  1. Fix media images (DR Ramasjang, etc.)"
echo "  2. Fix game images (Khan Academy, Minecraft, etc.)"
echo "  3. Fetch streaming content (Filmstriben, Apple TV+, TV 2 Play)"
echo ""

# Check for dry-run flag
if [[ "$1" == "--dry-run" ]]; then
    echo "🔍 DRY RUN MODE - No changes will be made"
    echo ""
    read -p "Press Enter to continue..."
    exec "$SCRIPT_DIR/run-all-fixes.sh" --dry-run
else
    echo "⚠️  LIVE MODE - Changes will be made to the database"
    echo ""
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 1
    fi
    exec "$SCRIPT_DIR/run-all-fixes.sh"
fi
