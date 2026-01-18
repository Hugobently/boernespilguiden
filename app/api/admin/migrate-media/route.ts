// Migration Route - Add new columns to existing Media table
// Safe to run multiple times - only adds columns if they don't exist

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Add parent info columns if they don't exist
    const migrations = [
      `ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "parentInfo" TEXT`,
      `ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "parentTip" TEXT`,
      `ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "pros" TEXT[] DEFAULT '{}'`,
      `ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "cons" TEXT[] DEFAULT '{}'`,
      `ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasViolence" BOOLEAN NOT NULL DEFAULT false`,
      `ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasScaryContent" BOOLEAN NOT NULL DEFAULT false`,
      `ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasLanguage" BOOLEAN NOT NULL DEFAULT false`,
      `ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "hasEducational" BOOLEAN NOT NULL DEFAULT false`,
    ];

    for (const migration of migrations) {
      try {
        await prisma.$executeRawUnsafe(migration);
      } catch (error) {
        const err = error as { message: string };
        // Ignore "column already exists" errors
        if (!err.message.includes('already exists')) {
          throw error;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Media table migrated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as { message: string };
    console.error('Migration failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
