// Re-import TMDB content with new filters
// Deletes existing TMDB content and re-imports

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  importTMDBMovies,
  importTMDBSeries,
} from '@/lib/services/tmdb-import';

export async function POST(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Delete existing TMDB content
    const deleted = await prisma.media.deleteMany({
      where: { source: 'TMDB' },
    });

    // Re-import with new filters
    const movies = await importTMDBMovies(50);
    const series = await importTMDBSeries(50);

    return NextResponse.json({
      success: true,
      deleted: deleted.count,
      imported: {
        movies,
        series,
        total: movies + series,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as { message: string };
    console.error('Re-import failed:', error);
    return NextResponse.json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
