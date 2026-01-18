// Database Initialization Route
// Run this ONCE to create tables in production database

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {

    // Create Media table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Media" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "tmdbId" INTEGER UNIQUE,
        "drEntityId" TEXT UNIQUE,
        "type" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "originalTitle" TEXT,
        "slug" TEXT NOT NULL UNIQUE,
        "description" TEXT,
        "review" TEXT,
        "posterUrl" TEXT,
        "backdropUrl" TEXT,
        "releaseDate" TIMESTAMP,
        "runtime" INTEGER,
        "ageMin" INTEGER,
        "ageMax" INTEGER,
        "genres" TEXT[],
        "seasons" INTEGER,
        "source" TEXT NOT NULL,
        "isDanish" BOOLEAN NOT NULL DEFAULT false,
        "isNordic" BOOLEAN NOT NULL DEFAULT false,
        "hasDanishAudio" BOOLEAN,
        "hasDanishSubtitles" BOOLEAN,
        "availableLanguages" TEXT[] DEFAULT '{}',
        "parentInfo" TEXT,
        "parentTip" TEXT,
        "pros" TEXT[] DEFAULT '{}',
        "cons" TEXT[] DEFAULT '{}',
        "hasViolence" BOOLEAN NOT NULL DEFAULT false,
        "hasScaryContent" BOOLEAN NOT NULL DEFAULT false,
        "hasLanguage" BOOLEAN NOT NULL DEFAULT false,
        "hasEducational" BOOLEAN NOT NULL DEFAULT false,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "isReviewed" BOOLEAN NOT NULL DEFAULT false,
        "isFeatured" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create StreamingInfo table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "StreamingInfo" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "mediaId" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerId" INTEGER,
        "available" BOOLEAN NOT NULL DEFAULT true,
        "url" TEXT,
        "isFree" BOOLEAN NOT NULL DEFAULT false,
        "lastChecked" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE
      )
    `);

    return NextResponse.json({
      success: true,
      message: 'Database schema created successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as { message: string };
    console.error('Database initialization failed:', error);
    return NextResponse.json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
