import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Cap the connection pool for direct postgres:// URLs. Static generation
// runs many pages in parallel worker processes, and Prisma's default pool
// (cpus * 2 + 1 per process) exhausts the database's connection limit.
function withConnectionLimit(url: string | undefined): string | undefined {
  if (!url || !url.startsWith('postgres') || url.includes('connection_limit')) {
    return url;
  }
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}connection_limit=3&pool_timeout=30`;
}

// Same fallback order as scripts/deploy-db-sync.js, so the build and the
// seed sync always agree on which database they talk to
const databaseUrl =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DIRECT_URL;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    datasourceUrl: withConnectionLimit(databaseUrl),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
