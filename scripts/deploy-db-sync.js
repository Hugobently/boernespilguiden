// Syncs the production database with the seed files during Vercel builds.
// `prisma db push` can't run over a prisma:// (Accelerate) connection, so we
// prefer a direct TCP URL (POSTGRES_URL/DIRECT_URL) when DATABASE_URL is
// an Accelerate URL. A sync failure must not block the deploy - the site
// then just keeps serving the existing data.
const { execSync } = require('child_process');

const directUrl = process.env.POSTGRES_URL || process.env.DIRECT_URL;
const dbUrl = process.env.DATABASE_URL;
const url = dbUrl && !dbUrl.startsWith('prisma://') ? dbUrl : directUrl;

if (!url) {
  console.warn('⚠️  No usable database URL (DATABASE_URL/POSTGRES_URL/DIRECT_URL) - skipping DB sync');
  process.exit(0);
}

const env = { ...process.env, DATABASE_URL: url };

try {
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit', env });
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', env });
  console.log('✅ Database synced with seed files');
} catch (error) {
  console.warn('⚠️  DB sync failed - deploying with existing data. Run "npm run db:seed" manually to sync.');
  console.warn(String((error && error.message) || error));
}
