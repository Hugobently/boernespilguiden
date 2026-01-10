#!/bin/bash
# Run database migration
# Usage: ./scripts/run-migration.sh

# Check if POSTGRES_URL is set
if [ -z "$POSTGRES_URL" ]; then
    echo "❌ Error: POSTGRES_URL environment variable not set"
    echo ""
    echo "Please set it first:"
    echo "  export POSTGRES_URL='postgres://...'"
    echo ""
    echo "You can find POSTGRES_URL in Vercel:"
    echo "  Storage → prisma-postgres-boernespilguiden → POSTGRES_URL"
    exit 1
fi

echo "🚀 Running database migration..."
echo ""

psql "$POSTGRES_URL" << 'EOF'
-- Migration: Add Parent Info columns to Media table
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "parentInfo" TEXT;
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "parentTip" TEXT;
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "pros" TEXT[] DEFAULT '{}';
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "cons" TEXT[] DEFAULT '{}';
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasViolence" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasScaryContent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasLanguage" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasEducational" BOOLEAN NOT NULL DEFAULT false;

-- Verify columns were added
\echo ''
\echo '✅ Verifying new columns:'
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Media'
AND column_name IN ('parentInfo', 'parentTip', 'pros', 'cons', 'hasViolence', 'hasScaryContent', 'hasLanguage', 'hasEducational')
ORDER BY column_name;
EOF

echo ""
echo "✅ Migration complete!"
