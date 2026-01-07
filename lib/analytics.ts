// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export type AnalyticsEventType =
  | 'page_view'
  | 'game_click'
  | 'affiliate_click'
  | 'search_query'
  | 'filter_applied'
  | 'category_view'
  | 'download_click';

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  timestamp: number;
  sessionId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface GameClickEvent {
  gameSlug: string;
  gameTitle: string;
  gameType: 'digital' | 'board';
  source: 'card' | 'search' | 'related' | 'featured' | 'category';
  position?: number;
}

export interface AffiliateClickEvent {
  gameSlug: string;
  gameTitle: string;
  platform: 'appstore' | 'playstore' | 'amazon' | 'affiliate' | 'website';
  url: string;
}

export interface SearchQueryEvent {
  query: string;
  resultsCount: number;
  filters?: {
    ageGroup?: string;
    adFree?: boolean;
    free?: boolean;
    offline?: boolean;
  };
}

export interface CategoryViewEvent {
  category: string;
  ageGroup?: string;
  gameType: 'digital' | 'board';
  gamesCount: number;
}

// ============================================================================
// ANALYTICS STORAGE (Client-side)
// ============================================================================

const STORAGE_KEY = 'boernespilguiden_analytics';
const MAX_EVENTS = 100;

function getStoredEvents(): AnalyticsEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function storeEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;

  try {
    const events = getStoredEvents();
    events.push(event);

    // Keep only the last MAX_EVENTS
    const trimmedEvents = events.slice(-MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedEvents));
  } catch {
    // Ignore storage errors
  }
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// ============================================================================
// TRACKING FUNCTIONS
// ============================================================================

/**
 * Track a game card click
 */
export function trackGameClick(event: GameClickEvent): void {
  const analyticsEvent: AnalyticsEvent = {
    type: 'game_click',
    timestamp: Date.now(),
    sessionId: getSessionId(),
    data: event,
  };

  storeEvent(analyticsEvent);

  // Send to analytics endpoint (if configured)
  sendToAnalytics(analyticsEvent);
}

/**
 * Track an affiliate/download link click
 */
export function trackAffiliateClick(event: AffiliateClickEvent): void {
  const analyticsEvent: AnalyticsEvent = {
    type: 'affiliate_click',
    timestamp: Date.now(),
    sessionId: getSessionId(),
    data: event,
  };

  storeEvent(analyticsEvent);
  sendToAnalytics(analyticsEvent);
}

/**
 * Track a search query
 */
export function trackSearchQuery(event: SearchQueryEvent): void {
  const analyticsEvent: AnalyticsEvent = {
    type: 'search_query',
    timestamp: Date.now(),
    sessionId: getSessionId(),
    data: event,
  };

  storeEvent(analyticsEvent);
  sendToAnalytics(analyticsEvent);
}

/**
 * Track a category page view
 */
export function trackCategoryView(event: CategoryViewEvent): void {
  const analyticsEvent: AnalyticsEvent = {
    type: 'category_view',
    timestamp: Date.now(),
    sessionId: getSessionId(),
    data: event,
  };

  storeEvent(analyticsEvent);
  sendToAnalytics(analyticsEvent);
}

/**
 * Track a page view
 */
export function trackPageView(path: string, title: string): void {
  const analyticsEvent: AnalyticsEvent = {
    type: 'page_view',
    timestamp: Date.now(),
    sessionId: getSessionId(),
    data: { path, title },
  };

  storeEvent(analyticsEvent);
  sendToAnalytics(analyticsEvent);
}

// ============================================================================
// ANALYTICS SENDER
// ============================================================================

async function sendToAnalytics(event: AnalyticsEvent): Promise<void> {
  // Only send in production or if analytics endpoint is configured
  const analyticsEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;

  if (!analyticsEndpoint) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event.type, event.data);
    }
    return;
  }

  try {
    await fetch(analyticsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
      // Use keepalive to ensure the request completes even if the page unloads
      keepalive: true,
    });
  } catch (error) {
    // Silently fail - analytics should never break the app
    if (process.env.NODE_ENV === 'development') {
      console.error('[Analytics Error]', error);
    }
  }
}

// ============================================================================
// ANALYTICS AGGREGATION (for display)
// ============================================================================

export interface AnalyticsSummary {
  totalEvents: number;
  gameClicks: { slug: string; title: string; count: number }[];
  affiliateClicks: { slug: string; platform: string; count: number }[];
  popularSearches: { query: string; count: number }[];
  categoryViews: { category: string; count: number }[];
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const events = getStoredEvents();

  // Count game clicks
  const gameClickCounts: Record<string, { title: string; count: number }> = {};
  events
    .filter((e) => e.type === 'game_click')
    .forEach((e) => {
      const data = e.data as GameClickEvent;
      if (!gameClickCounts[data.gameSlug]) {
        gameClickCounts[data.gameSlug] = { title: data.gameTitle, count: 0 };
      }
      gameClickCounts[data.gameSlug].count++;
    });

  // Count affiliate clicks
  const affiliateClickCounts: Record<string, { platform: string; count: number }> = {};
  events
    .filter((e) => e.type === 'affiliate_click')
    .forEach((e) => {
      const data = e.data as AffiliateClickEvent;
      const key = `${data.gameSlug}-${data.platform}`;
      if (!affiliateClickCounts[key]) {
        affiliateClickCounts[key] = { platform: data.platform, count: 0 };
      }
      affiliateClickCounts[key].count++;
    });

  // Count search queries
  const searchCounts: Record<string, number> = {};
  events
    .filter((e) => e.type === 'search_query')
    .forEach((e) => {
      const data = e.data as SearchQueryEvent;
      const query = data.query.toLowerCase().trim();
      searchCounts[query] = (searchCounts[query] || 0) + 1;
    });

  // Count category views
  const categoryCounts: Record<string, number> = {};
  events
    .filter((e) => e.type === 'category_view')
    .forEach((e) => {
      const data = e.data as CategoryViewEvent;
      categoryCounts[data.category] = (categoryCounts[data.category] || 0) + 1;
    });

  return {
    totalEvents: events.length,
    gameClicks: Object.entries(gameClickCounts)
      .map(([slug, { title, count }]) => ({ slug, title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    affiliateClicks: Object.entries(affiliateClickCounts)
      .map(([key, { platform, count }]) => ({
        slug: key.split('-')[0],
        platform,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    popularSearches: Object.entries(searchCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    categoryViews: Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  };
}

// ============================================================================
// CLEAR ANALYTICS (for testing/privacy)
// ============================================================================

export function clearAnalytics(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
