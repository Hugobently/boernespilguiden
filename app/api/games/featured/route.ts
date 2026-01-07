import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const ageGroup = searchParams.get('ageGroup');

    const where: Record<string, unknown> = {
      OR: [{ featured: true }, { editorChoice: true }],
    };

    if (ageGroup) {
      where.ageGroup = ageGroup;
    }

    const games = await prisma.game.findMany({
      where,
      orderBy: [
        { editorChoice: 'desc' },
        { featured: 'desc' },
        { rating: 'desc' },
      ],
      take: Math.min(limit, 50),
    });

    // Separate editor's choice and featured
    const editorChoice = games.filter((g) => g.editorChoice);
    const featured = games.filter((g) => g.featured && !g.editorChoice);

    return NextResponse.json({
      success: true,
      data: {
        editorChoice,
        featured,
        all: games,
      },
    });
  } catch (error) {
    console.error('Error fetching featured games:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured games' },
      { status: 500 }
    );
  }
}
