import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// ============================================================================
// ANALYTICS API
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();

    // Store event in database
    await prisma.analyticsEvent.create({
      data: {
        type: event.type,
        sessionId: event.sessionId || null,
        data: JSON.stringify(event.data),
        timestamp: new Date(event.timestamp),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    // Always return success to not break the client
    return NextResponse.json({ success: true });
  }
}

// ============================================================================
// GET ANALYTICS SUMMARY
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);

    const since = new Date();
    since.setDate(since.getDate() - days);

    const events = await prisma.analyticsEvent.findMany({
      where: {
        timestamp: { gte: since },
      },
      orderBy: { timestamp: 'desc' },
    });

    // Aggregate data
    const gameClicks: Record<string, number> = {};
    const affiliateClicks: Record<string, number> = {};
    const searchQueries: Record<string, number> = {};
    const categoryViews: Record<string, number> = {};

    events.forEach((event) => {
      const data = JSON.parse(event.data);

      switch (event.type) {
        case 'game_click':
          gameClicks[data.gameSlug] = (gameClicks[data.gameSlug] || 0) + 1;
          break;
        case 'affiliate_click':
          const key = `${data.gameSlug}:${data.platform}`;
          affiliateClicks[key] = (affiliateClicks[key] || 0) + 1;
          break;
        case 'search_query':
          const query = data.query.toLowerCase().trim();
          searchQueries[query] = (searchQueries[query] || 0) + 1;
          break;
        case 'category_view':
          categoryViews[data.category] = (categoryViews[data.category] || 0) + 1;
          break;
      }
    });

    // Sort and limit
    const topGameClicks = Object.entries(gameClicks)
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    const topAffiliateClicks = Object.entries(affiliateClicks)
      .map(([key, count]) => {
        const [slug, platform] = key.split(':');
        return { slug, platform, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    const topSearchQueries = Object.entries(searchQueries)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    const topCategoryViews = Object.entries(categoryViews)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        period: { days, since: since.toISOString() },
        totalEvents: events.length,
        gameClicks: topGameClicks,
        affiliateClicks: topAffiliateClicks,
        searchQueries: topSearchQueries,
        categoryViews: topCategoryViews,
      },
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
