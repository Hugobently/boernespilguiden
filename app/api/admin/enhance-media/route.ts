// Admin API Route - Enhance Media Descriptions with AI
// Batch process to enhance TMDB descriptions

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { enhanceMediaDescriptionWithRetry } from '@/lib/services/ai-enhance';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface EnhanceStats {
  total: number;
  enhanced: number;
  skipped: number;
  failed: number;
  errors: Array<{ title: string; error: string }>;
}

export async function POST(request: Request) {
  // Auth check
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const limit = body.limit || 10; // Process 10 at a time by default
    const forceReprocess = body.force || false; // Re-enhance even if already done

    // Find media that needs enhancement
    const mediaToEnhance = await prisma.media.findMany({
      where: {
        isActive: true,
        description: { not: null },
        ...(forceReprocess
          ? {}
          : {
              OR: [
                { parentInfo: null },
                { pros: { equals: [] } },
              ],
            }),
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const stats: EnhanceStats = {
      total: mediaToEnhance.length,
      enhanced: 0,
      skipped: 0,
      failed: 0,
      errors: [],
    };

    for (const media of mediaToEnhance) {
      try {
        // Skip if no description
        if (!media.description) {
          stats.skipped++;
          continue;
        }

        // Get release year
        const releaseYear = media.releaseDate
          ? new Date(media.releaseDate).getFullYear()
          : undefined;

        // Call AI enhancement
        const enhanced = await enhanceMediaDescriptionWithRetry({
          title: media.title,
          originalTitle: media.originalTitle || undefined,
          type: media.type as 'MOVIE' | 'SERIES',
          description: media.description,
          genres: media.genres,
          ageMin: media.ageMin || undefined,
          ageMax: media.ageMax || undefined,
          releaseYear,
          isDanish: media.isDanish,
          hasDanishAudio: media.hasDanishAudio || undefined,
          source: media.source || undefined,
        });

        // Update media with enhanced content
        await prisma.media.update({
          where: { id: media.id },
          data: {
            description: enhanced.description,
            parentInfo: enhanced.parentInfo,
            parentTip: enhanced.parentTip,
            pros: enhanced.pros,
            cons: enhanced.cons,
            hasViolence: enhanced.hasViolence,
            hasScaryContent: enhanced.hasScaryContent,
            hasLanguage: enhanced.hasLanguage,
            hasEducational: enhanced.hasEducational,
          },
        });

        stats.enhanced++;

        // Rate limiting - wait 2 seconds between requests to avoid hitting API limits
        await sleep(2000);
      } catch (error) {
        const err = error as Error;
        console.error(`Failed to enhance ${media.title}:`, error);
        stats.failed++;
        stats.errors.push({
          title: media.title,
          error: err.message,
        });

        // Continue with next item even if this one failed
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error('Enhancement batch failed:', error);
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

// GET endpoint to check enhancement status
export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Count media with/without enhancements
    const [total, withParentInfo, withPros] = await Promise.all([
      prisma.media.count({ where: { isActive: true } }),
      prisma.media.count({ where: { isActive: true, parentInfo: { not: null } } }),
      prisma.media.count({ where: { isActive: true, pros: { isEmpty: false } } }),
    ]);

    return NextResponse.json({
      total,
      withParentInfo,
      withPros,
      needsEnhancement: total - withParentInfo,
      percentComplete: total > 0 ? Math.round((withParentInfo / total) * 100) : 0,
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
}
