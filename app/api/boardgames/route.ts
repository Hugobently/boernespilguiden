import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

function parseIntParam(value: string | null): number | null {
  if (!value) return null;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Query parameters
    const ageGroup = searchParams.get('ageGroup');
    const minAge = parseIntParam(searchParams.get('minAge'));
    const maxAge = parseIntParam(searchParams.get('maxAge'));
    const minPlayers = parseIntParam(searchParams.get('minPlayers'));
    const maxPlayers = parseIntParam(searchParams.get('maxPlayers'));
    const complexity = parseIntParam(searchParams.get('complexity'));
    const categories = searchParams.get('categories'); // comma-separated
    const skills = searchParams.get('skills'); // comma-separated
    const themes = searchParams.get('themes'); // comma-separated
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'rating';
    const order = searchParams.get('order') || 'desc';
    const limit = parseIntParam(searchParams.get('limit')) ?? 20;
    const offset = parseIntParam(searchParams.get('offset')) ?? 0;
    const featured = searchParams.get('featured');
    const editorChoice = searchParams.get('editorChoice');

    // Build where clause
    const where: Record<string, unknown> = {};

    // Age filtering
    if (ageGroup) {
      where.ageGroup = ageGroup;
    }
    if (minAge !== null) {
      where.minAge = { lte: minAge };
    }
    if (maxAge !== null) {
      where.maxAge = { gte: maxAge };
    }

    // Player count filtering
    if (minPlayers !== null) {
      where.minPlayers = { lte: minPlayers };
    }
    if (maxPlayers !== null) {
      where.maxPlayers = { gte: maxPlayers };
    }

    // Complexity filtering
    if (complexity !== null) {
      where.complexity = complexity;
    }

    // Featured/Editor's choice
    if (featured === 'true') {
      where.featured = true;
    }
    if (editorChoice === 'true') {
      where.editorChoice = true;
    }

    // Text search
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { shortDescription: { contains: search } },
        { description: { contains: search } },
        { categories: { contains: search } },
        { skills: { contains: search } },
        { themes: { contains: search } },
      ];
    }

    // Category/skill/theme filtering (JSON string contains)
    if (categories) {
      const categoryList = categories.split(',').map((c) => c.trim().toLowerCase());
      where.AND = where.AND || [];
      (where.AND as unknown[]).push({
        OR: categoryList.map((cat) => ({ categories: { contains: cat } })),
      });
    }
    if (skills) {
      const skillList = skills.split(',').map((s) => s.trim().toLowerCase());
      where.AND = where.AND || [];
      (where.AND as unknown[]).push({
        OR: skillList.map((skill) => ({ skills: { contains: skill } })),
      });
    }
    if (themes) {
      const themeList = themes.split(',').map((t) => t.trim().toLowerCase());
      where.AND = where.AND || [];
      (where.AND as unknown[]).push({
        OR: themeList.map((theme) => ({ themes: { contains: theme } })),
      });
    }

    // Build orderBy
    const validSortFields = ['rating', 'title', 'minAge', 'price', 'playTimeMinutes', 'createdAt'];
    const sortField = validSortFields.includes(sort) ? sort : 'rating';
    const orderBy = { [sortField]: order === 'asc' ? 'asc' : 'desc' };

    // Fetch board games
    const [games, total] = await Promise.all([
      prisma.boardGame.findMany({
        where,
        orderBy: [
          { editorChoice: 'desc' },
          { featured: 'desc' },
          orderBy,
        ],
        take: Math.min(limit, 100),
        skip: offset,
      }),
      prisma.boardGame.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: games,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + games.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching board games:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch board games' },
      { status: 500 }
    );
  }
}
