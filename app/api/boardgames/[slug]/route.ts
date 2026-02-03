import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: { slug: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params;

    const game = await prisma.boardGame.findUnique({
      where: { slug },
    });

    if (!game) {
      return NextResponse.json(
        { success: false, error: 'Board game not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields for response (pros/cons are now native arrays)
    const parsedGame = {
      ...game,
      categories: JSON.parse(game.categories || '[]'),
      skills: JSON.parse(game.skills || '[]'),
      themes: JSON.parse(game.themes || '[]'),
      pros: game.pros, // Already an array
      cons: game.cons, // Already an array
    };

    // Get related board games (same age group or categories)
    const relatedGames = await prisma.boardGame.findMany({
      where: {
        AND: [
          { slug: { not: slug } },
          {
            OR: [
              { ageGroup: game.ageGroup },
              { categories: { contains: JSON.parse(game.categories || '[]')[0] || '' } },
            ],
          },
        ],
      },
      orderBy: [{ editorChoice: 'desc' }, { rating: 'desc' }],
      take: 4,
    });

    return NextResponse.json({
      success: true,
      data: parsedGame,
      related: relatedGames,
    });
  } catch (error) {
    console.error('Error fetching board game:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch board game' },
      { status: 500 }
    );
  }
}
