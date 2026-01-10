// Daily Cron Update Route
// Køres automatisk via Vercel Cron hver dag kl. 06:00

import { NextResponse } from 'next/server';
import { refreshDRStreamingStatus } from '@/lib/services/dr-import';
import { refreshTMDBStreamingStatus } from '@/lib/services/tmdb-import';
import { generateMissingReviews } from '@/lib/services/review-generator';

export const maxDuration = 60; // Vercel Pro: 60 sek timeout

export async function GET(request: Request) {
  // Verify Vercel cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = {
    drRefreshed: false,
    tmdbUpdated: 0,
    reviewsGenerated: 0,
  };

  try {
    // 1. DR status (fast)
    await refreshDRStreamingStatus();
    stats.drRefreshed = true;

    // 2. TMDB streaming (max 30 to stay under timeout)
    stats.tmdbUpdated = await refreshTMDBStreamingStatus(30);

    // 3. Generate reviews (max 3 per day)
    stats.reviewsGenerated = await generateMissingReviews(3);
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json(
      {
        error: String(error),
        stats,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    stats,
    timestamp: new Date().toISOString(),
  });
}
