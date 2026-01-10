#!/bin/bash
# Helper script to save POSTGRES_URL to .env for future use

echo "🔑 Save POSTGRES_URL to .env"
echo ""
echo "Please paste your POSTGRES_URL from Vercel:"
echo "(Get it from: https://vercel.com/halfgoods-projects/boernespilguiden/settings/environment-variables)"
echo ""
read -p "POSTGRES_URL: " POSTGRES_URL

if [[ ! "$POSTGRES_URL" =~ ^postgresql:// ]]; then
    echo "❌ Invalid URL. Must start with postgresql://"
    exit 1
fi

# Add to .env file
if grep -q "^POSTGRES_URL=" .env 2>/dev/null; then
    # Update existing line
    sed -i "s|^POSTGRES_URL=.*|POSTGRES_URL=\"$POSTGRES_URL\"|" .env
    echo "✅ Updated POSTGRES_URL in .env"
else
    # Add new line
    echo "" >> .env
    echo "# Production Postgres Database" >> .env
    echo "POSTGRES_URL=\"$POSTGRES_URL\"" >> .env
    echo "✅ Added POSTGRES_URL to .env"
fi

echo ""
echo "🚀 Ready to run enhancement!"
echo "Run: bash scripts/run-enhancement-batches.sh"
