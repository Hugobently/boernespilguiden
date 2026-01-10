#!/bin/bash
# Wrapper script to run AI enhancement in batches
# This script helps set up environment and run enhancements

set -e

echo "🚀 Børnespilguiden - AI Enhancement Batch Runner"
echo ""

# Check if POSTGRES_URL is set
if [ -z "$POSTGRES_URL" ]; then
    echo "❌ POSTGRES_URL is not set in environment"
    echo ""
    echo "Please set the production database URL from Vercel:"
    echo "1. Go to https://vercel.com/halfgoods-projects/boernespilguiden/settings/environment-variables"
    echo "2. Copy the POSTGRES_URL value"
    echo "3. Run this script with:"
    echo "   export POSTGRES_URL='postgresql://...' && ./scripts/run-enhancement-batches.sh"
    echo ""
    exit 1
fi

# Check if ANTHROPIC_API_KEY is set
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "📝 Loading ANTHROPIC_API_KEY from .env..."
    export ANTHROPIC_API_KEY=$(grep '^ANTHROPIC_API_KEY=' .env | cut -d'"' -f2)
fi

if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ ANTHROPIC_API_KEY not found"
    exit 1
fi

echo "✅ Environment configured"
echo ""

# Run first batch
echo "🔄 Running Batch 1: 35 items"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
node scripts/test-enhancement.js 35

echo ""
echo "✅ Batch 1 complete!"
echo ""
echo "⏸️  Waiting 5 seconds before Batch 2..."
sleep 5

# Run second batch
echo ""
echo "🔄 Running Batch 2: 35 items"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
node scripts/test-enhancement.js 35

echo ""
echo "✅ Both batches complete!"
echo ""
echo "📊 Final Status:"
echo "Run this command to check total enhanced:"
echo "  POSTGRES_URL='...' node scripts/check-enhancement-status.js"
