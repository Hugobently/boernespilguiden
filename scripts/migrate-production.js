// Run production database migration
// Adds parent info columns to Media table

const { PrismaClient } = require('@prisma/client');

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!POSTGRES_URL) {
  console.error('❌ Error: POSTGRES_URL or DATABASE_URL not set');
  console.error('Please run: export POSTGRES_URL="postgres://..."');
  process.exit(1);
}

console.log('🔌 Connecting to database...');

// Create Prisma client with production database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: POSTGRES_URL,
    },
  },
});

async function runMigration() {
  console.log('🚀 Running database migration...\n');

  const migrations = [
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "parentInfo" TEXT',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "parentTip" TEXT',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "pros" TEXT[] DEFAULT \'{}\'',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "cons" TEXT[] DEFAULT \'{}\'',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasViolence" BOOLEAN NOT NULL DEFAULT false',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasScaryContent" BOOLEAN NOT NULL DEFAULT false',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasLanguage" BOOLEAN NOT NULL DEFAULT false',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasEducational" BOOLEAN NOT NULL DEFAULT false',
  ];

  try {
    for (const sql of migrations) {
      try {
        await prisma.$executeRawUnsafe(sql);
        const shortSql = sql.length > 70 ? sql.substring(0, 70) + '...' : sql;
        console.log('✓', shortSql);
      } catch (error) {
        if (error.message && error.message.includes('already exists')) {
          console.log('⏭️  Column already exists, skipping');
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ Verifying columns...\n');

    // Verify columns were added
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'Media'
      AND column_name IN ('parentInfo', 'parentTip', 'pros', 'cons', 'hasViolence', 'hasScaryContent', 'hasLanguage', 'hasEducational')
      ORDER BY column_name
    `;

    console.log('New columns in Media table:');
    console.table(result);

    console.log('\n✅ Migration complete!');
    console.log('✅ All 8 columns added successfully!\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
