#!/bin/bash
# Simple wrapper to enhance remaining media items
# Handles environment setup and provides clear instructions

echo "🎬 Børnespilguiden - AI Enhancement Runner"
echo ""

# Try to load ANTHROPIC_API_KEY from .env if not set
if [ -z "$ANTHROPIC_API_KEY" ]; then
    if [ -f .env ]; then
        export ANTHROPIC_API_KEY=$(grep '^ANTHROPIC_API_KEY=' .env | cut -d'"' -f2)
        echo "✅ Loaded ANTHROPIC_API_KEY from .env"
    fi
fi

# Check if POSTGRES_URL is set
if [ -z "$POSTGRES_URL" ]; then
    echo "⚠️  POSTGRES_URL not set in environment"
    echo ""
    echo "To run the enhancement, you need the production database URL:"
    echo ""
    echo "1. Get POSTGRES_URL from Vercel:"
    echo "   https://vercel.com/halfgoods-projects/boernespilguiden/settings/environment-variables"
    echo ""
    echo "2. Run this command (replace with your actual URL):"
    echo "   export POSTGRES_URL='postgresql://default:...' && ./scripts/enhance-remaining.sh"
    echo ""
    echo "Or run both batches:"
    echo "   export POSTGRES_URL='postgresql://...' && ./scripts/run-enhancement-batches.sh"
    echo ""
    exit 1
fi

# Check ANTHROPIC_API_KEY
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ ANTHROPIC_API_KEY not found in .env"
    echo "Please add it to your .env file"
    exit 1
fi

echo "✅ All environment variables configured"
echo ""

# Get batch size from argument or default to 35
BATCH_SIZE=${1:-35}

echo "🚀 Starting enhancement batch (${BATCH_SIZE} items)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run the enhancement
node scripts/test-enhancement.js $BATCH_SIZE

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✅ Enhancement batch complete!"
    echo ""
    echo "To check status, run:"
    echo "  export POSTGRES_URL='...' && node scripts/check-enhancement-status.js"
else
    echo ""
    echo "❌ Enhancement failed with exit code $EXIT_CODE"
    echo "Check the error messages above for details"
    exit $EXIT_CODE
fi
