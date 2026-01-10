// Add ALL missing columns to Media table
const { PrismaClient } = require('@prisma/client');

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: { db: { url: POSTGRES_URL } },
});

async function main() {
  console.log('🚀 Adding ALL missing columns to Media table...\n');

  const migrations = [
    // Language columns (from earlier)
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasDanishAudio" BOOLEAN',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasDanishSubtitles" BOOLEAN',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "availableLanguages" TEXT[] DEFAULT \'{}\'',

    // Parent info columns (new)
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "parentInfo" TEXT',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "parentTip" TEXT',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "pros" TEXT[] DEFAULT \'{}\'',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "cons" TEXT[] DEFAULT \'{}\'',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasViolence" BOOLEAN NOT NULL DEFAULT false',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasScaryContent" BOOLEAN NOT NULL DEFAULT false',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasLanguage" BOOLEAN NOT NULL DEFAULT false',
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasEducational" BOOLEAN NOT NULL DEFAULT false',
  ];

  for (const sql of migrations) {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log('✓', sql.substring(0, 75) + '...');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⏭️  Already exists, skipping');
      } else {
        console.error('✗', error.message);
      }
    }
  }

  console.log('\n✅ All columns added!\n');

  // Verify
  const result = await prisma.$queryRaw`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'Media'
    AND column_name IN (
      'hasDanishAudio', 'hasDanishSubtitles', 'availableLanguages',
      'parentInfo', 'parentTip', 'pros', 'cons',
      'hasViolence', 'hasScaryContent', 'hasLanguage', 'hasEducational'
    )
    ORDER BY column_name
  `;

  console.table(result);
  console.log(`\n✅ Total: ${result.length} columns verified\n`);

  await prisma.$disconnect();
}

main();
