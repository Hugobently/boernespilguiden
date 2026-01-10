// Re-import TMDB content with new filters
// Deletes existing TMDB content and re-imports

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  importTMDBMovies,
  importTMDBSeries,
} from '@/lib/services/tmdb-import';

export async function POST(request: Request) {
  // Temporarily disabled auth
  const auth = request.headers.get('authorization');
  console.log('Re-import TMDB started with auth:', auth);

  try {
    // Delete existing TMDB content
    console.log('Deleting existing TMDB content...');
    const deleted = await prisma.media.deleteMany({
      where: { source: 'TMDB' },
    });
    console.log(`Deleted ${deleted.count} TMDB items`);

    // Re-import with new filters
    console.log('Re-importing TMDB content with Danish/Western filters...');
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
