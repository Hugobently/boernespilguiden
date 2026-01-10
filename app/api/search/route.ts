import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  parseSearchQuery,
  buildPrismaWhereClause,
  buildBoardGameWhereClause,
  type ParsedSearchQuery,
} from '@/lib/search';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q') || '';
    const type = searchParams.get('type'); // 'digital', 'board', 'media', or null for all
    const limit = parseInt(searchParams.get('limit') || '20');

    // Parse the search query using intelligent parser
    const parsed: ParsedSearchQuery = parseSearchQuery(query);

    // If no meaningful filters were extracted, require at least some input
    const hasFilters =
      parsed.minAge !== null ||
      parsed.ageGroup !== null ||
      parsed.categories.length > 0 ||
      parsed.skills.length > 0 ||
      parsed.themes.length > 0 ||
      parsed.hasAds !== null ||
      parsed.hasInAppPurchases !== null ||
      parsed.isOfflineCapable !== null ||
      parsed.priceModel !== null ||
      parsed.searchTerms.length > 0;

    if (!hasFilters && !query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Build where clauses
    const digitalWhere = buildPrismaWhereClause(parsed);
    const boardWhere = buildBoardGameWhereClause(parsed);

    // Execute searches based on type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let digitalGames: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let boardGames: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let media: any[] = [];

    // Determine limit distribution
    const itemsPerType = type ? limit : Math.ceil(limit / 3);

    if (type !== 'board' && type !== 'media') {
      digitalGames = await prisma.game.findMany({
        where: digitalWhere,
        orderBy: [
          { editorChoice: 'desc' },
          { rating: 'desc' },
        ],
        take: type === 'digital' ? limit : itemsPerType,
      });
    }

    if (type !== 'digital' && type !== 'media') {
      boardGames = await prisma.boardGame.findMany({
        where: boardWhere,
        orderBy: [
          { editorChoice: 'desc' },
          { rating: 'desc' },
        ],
        take: type === 'board' ? limit : itemsPerType,
      });
    }

    // Search Film & Serier
    if (type !== 'digital' && type !== 'board') {
      const mediaWhere: any = {};

      // Simple text search in title and description
      if (parsed.searchTerms.length > 0) {
        const searchText = parsed.searchTerms.join(' ');
        mediaWhere.OR = [
          { title: { contains: searchText, mode: 'insensitive' } },
          { description: { contains: searchText, mode: 'insensitive' } },
        ];
      }

      media = await prisma.media.findMany({
        where: mediaWhere,
        orderBy: [
          { releaseDate: 'desc' },
        ],
        take: type === 'media' ? limit : itemsPerType,
        select: {
          id: true,
          slug: true,
          title: true,
          posterUrl: true,
          type: true,
          isDanish: true,
          hasDanishAudio: true,
          ageRating: true,
        },
      });
    }

    // Combine results with type indicator
    const combined = [
      ...digitalGames.map((g) => ({ ...g, gameType: 'digital' as const })),
      ...boardGames.map((g) => ({ ...g, gameType: 'board' as const })),
      ...media.map((m) => ({ ...m, gameType: 'media' as const })),
    ];

    return NextResponse.json({
      success: true,
      data: {
        digital: digitalGames,
        board: boardGames,
        media: media,
        combined,
      },
      query: {
        original: query,
        parsed: {
          minAge: parsed.minAge,
          maxAge: parsed.maxAge,
          ageGroup: parsed.ageGroup,
          targetGender: parsed.targetGender,
          categories: parsed.categories,
          skills: parsed.skills,
          themes: parsed.themes,
          hasAds: parsed.hasAds,
          hasInAppPurchases: parsed.hasInAppPurchases,
          isOfflineCapable: parsed.isOfflineCapable,
          priceModel: parsed.priceModel,
          searchTerms: parsed.searchTerms,
        },
      },
      counts: {
        digital: digitalGames.length,
        board: boardGames.length,
        media: media.length,
        total: combined.length,
      },
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
