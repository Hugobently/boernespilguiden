import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Query parameters
    const ageGroup = searchParams.get('ageGroup');
    const minAge = searchParams.get('minAge');
    const maxAge = searchParams.get('maxAge');
    const categories = searchParams.get('categories'); // comma-separated
    const skills = searchParams.get('skills'); // comma-separated
    const themes = searchParams.get('themes'); // comma-separated
    const hasAds = searchParams.get('hasAds');
    const hasInAppPurchases = searchParams.get('hasInAppPurchases');
    const isOfflineCapable = searchParams.get('isOfflineCapable');
    const priceModel = searchParams.get('priceModel');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'rating';
    const order = searchParams.get('order') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const featured = searchParams.get('featured');
    const editorChoice = searchParams.get('editorChoice');

    // Build where clause
    const where: Record<string, unknown> = {};

    // Age filtering
    if (ageGroup) {
      where.ageGroup = ageGroup;
    }
    if (minAge) {
      const parsedMinAge = parseInt(minAge, 10);
      if (!isNaN(parsedMinAge)) {
        where.minAge = { lte: parsedMinAge };
      }
    }
    if (maxAge) {
      const parsedMaxAge = parseInt(maxAge, 10);
      if (!isNaN(parsedMaxAge)) {
        where.maxAge = { gte: parsedMaxAge };
      }
    }

    // Boolean filters (searchParams.get returns null if not present, string if present)
    if (hasAds !== null) {
      where.hasAds = hasAds === 'true';
    }
    if (hasInAppPurchases !== null) {
      where.hasInAppPurchases = hasInAppPurchases === 'true';
    }
    if (isOfflineCapable !== null) {
      where.isOfflineCapable = isOfflineCapable === 'true';
    }

    // Price model
    if (priceModel) {
      where.priceModel = priceModel;
    }

    // Featured/Editor's choice
    if (featured === 'true') {
      where.featured = true;
    }
    if (editorChoice === 'true') {
      where.editorChoice = true;
    }

    // Text search (case-insensitive for PostgreSQL)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { categories: { contains: search, mode: 'insensitive' } },
        { skills: { contains: search, mode: 'insensitive' } },
        { themes: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Category/skill/theme filtering (JSON string contains)
    if (categories) {
      const categoryList = categories.split(',').map(c => c.trim().toLowerCase());
      where.AND = where.AND || [];
      (where.AND as unknown[]).push({
        OR: categoryList.map(cat => ({ categories: { contains: cat } })),
      });
    }
    if (skills) {
      const skillList = skills.split(',').map(s => s.trim().toLowerCase());
      where.AND = where.AND || [];
      (where.AND as unknown[]).push({
        OR: skillList.map(skill => ({ skills: { contains: skill } })),
      });
    }
    if (themes) {
      const themeList = themes.split(',').map(t => t.trim().toLowerCase());
      where.AND = where.AND || [];
      (where.AND as unknown[]).push({
        OR: themeList.map(theme => ({ themes: { contains: theme } })),
      });
    }

    // Build orderBy
    const validSortFields = ['rating', 'title', 'minAge', 'price', 'createdAt'];
    const sortField = validSortFields.includes(sort) ? sort : 'rating';
    const orderBy = { [sortField]: order === 'asc' ? 'asc' : 'desc' };

    // Fetch games
    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        orderBy: [
          { editorChoice: 'desc' },
          { featured: 'desc' },
          orderBy,
        ],
        take: Math.min(limit, 100),
        skip: offset,
      }),
      prisma.game.count({ where }),
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
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
