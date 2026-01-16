// Link Health Check Service
// Validates external links and images for games and media content

import { prisma } from '@/lib/db';

export interface HealthCheckResult {
  totalChecked: number;
  healthy: number;
  broken: number;
  issues: HealthIssue[];
}

export interface HealthIssue {
  type: 'game' | 'boardgame' | 'media';
  slug: string;
  title: string;
  field: string;
  url: string;
  status: number | 'timeout' | 'error';
  message: string;
}

export interface MaintenanceReport {
  timestamp: string;
  gamesWithMissingIcons: number;
  brokenImageUrls: HealthIssue[];
  brokenAppStoreUrls: HealthIssue[];
  mediaWithMissingPosters: number;
  staleContent: { slug: string; title: string; daysSinceUpdate: number }[];
  summary: string;
}

// Check if a URL returns 200 OK
async function checkUrl(url: string, timeout = 5000): Promise<{ ok: boolean; status: number | 'timeout' | 'error' }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BornespilguidenBot/1.0; +https://boernespilguiden.dk)',
      },
    });

    clearTimeout(timeoutId);
    return { ok: response.ok, status: response.status };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { ok: false, status: 'timeout' };
    }
    return { ok: false, status: 'error' };
  }
}

// Check TMDB image URLs (they're generally reliable)
export async function checkTMDBImages(limit = 20): Promise<HealthCheckResult> {
  const result: HealthCheckResult = {
    totalChecked: 0,
    healthy: 0,
    broken: 0,
    issues: [],
  };

  const mediaWithTMDB = await prisma.media.findMany({
    where: {
      posterUrl: { startsWith: 'https://image.tmdb.org' },
    },
    select: {
      slug: true,
      title: true,
      posterUrl: true,
    },
    take: limit,
    orderBy: { updatedAt: 'asc' }, // Check oldest first
  });

  for (const media of mediaWithTMDB) {
    if (!media.posterUrl) continue;
    result.totalChecked++;

    const check = await checkUrl(media.posterUrl);
    if (check.ok) {
      result.healthy++;
    } else {
      result.broken++;
      result.issues.push({
        type: 'media',
        slug: media.slug,
        title: media.title,
        field: 'posterUrl',
        url: media.posterUrl,
        status: check.status,
        message: `TMDB poster returned ${check.status}`,
      });
    }
  }

  return result;
}

// Check local image files exist
export async function checkLocalImages(): Promise<{
  gamesWithMissingIcons: number;
  mediaWithLocalImages: number;
}> {
  const gamesNoIcon = await prisma.game.count({
    where: { iconUrl: null },
  });

  const mediaLocalImages = await prisma.media.count({
    where: { posterUrl: { startsWith: '/images/' } },
  });

  return {
    gamesWithMissingIcons: gamesNoIcon,
    mediaWithLocalImages: mediaLocalImages,
  };
}

// Find content that hasn't been updated in a long time
export async function findStaleContent(daysSince = 30): Promise<{ slug: string; title: string; daysSinceUpdate: number }[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysSince);

  const staleMedia = await prisma.media.findMany({
    where: {
      updatedAt: { lt: cutoffDate },
      isActive: true,
    },
    select: {
      slug: true,
      title: true,
      updatedAt: true,
    },
    take: 20,
    orderBy: { updatedAt: 'asc' },
  });

  return staleMedia.map((m) => ({
    slug: m.slug,
    title: m.title,
    daysSinceUpdate: Math.floor((Date.now() - m.updatedAt.getTime()) / (1000 * 60 * 60 * 24)),
  }));
}

// Main maintenance check function
export async function runMaintenanceCheck(): Promise<MaintenanceReport> {
  const timestamp = new Date().toISOString();

  // Check local images
  const localImageStats = await checkLocalImages();

  // Check TMDB images (sample)
  const tmdbCheck = await checkTMDBImages(15);

  // Find stale content
  const staleContent = await findStaleContent(60);

  // Count media without posters
  const mediaWithMissingPosters = await prisma.media.count({
    where: { posterUrl: null },
  });

  // Generate summary
  const issues: string[] = [];
  if (localImageStats.gamesWithMissingIcons > 0) {
    issues.push(`${localImageStats.gamesWithMissingIcons} spil mangler ikon`);
  }
  if (tmdbCheck.broken > 0) {
    issues.push(`${tmdbCheck.broken} ødelagte TMDB billeder`);
  }
  if (staleContent.length > 0) {
    issues.push(`${staleContent.length} serier ikke opdateret i 60+ dage`);
  }

  const summary = issues.length > 0
    ? `⚠️ Fundet ${issues.length} problemer: ${issues.join(', ')}`
    : '✅ Ingen kritiske problemer fundet';

  return {
    timestamp,
    gamesWithMissingIcons: localImageStats.gamesWithMissingIcons,
    brokenImageUrls: tmdbCheck.issues,
    brokenAppStoreUrls: [], // App Store links need special handling
    mediaWithMissingPosters,
    staleContent,
    summary,
  };
}

// Update games missing icons using iTunes API
export async function fixMissingGameIcons(limit = 10): Promise<number> {
  const gamesWithoutIcons = await prisma.game.findMany({
    where: { iconUrl: null },
    select: { id: true, slug: true, title: true, appStoreUrl: true },
    take: limit,
  });

  let fixed = 0;

  for (const game of gamesWithoutIcons) {
    // Try to get icon from iTunes API using the app ID
    if (game.appStoreUrl) {
      const match = game.appStoreUrl.match(/id(\d+)/);
      if (match) {
        const appId = match[1];
        try {
          const response = await fetch(
            `https://itunes.apple.com/lookup?id=${appId}&country=dk`
          );
          const data = await response.json();

          if (data.results?.[0]?.artworkUrl512) {
            await prisma.game.update({
              where: { id: game.id },
              data: { iconUrl: data.results[0].artworkUrl512 },
            });
            fixed++;
            console.log(`Fixed icon for ${game.slug}: ${data.results[0].artworkUrl512}`);
          }
        } catch (error) {
          console.error(`Failed to fetch icon for ${game.slug}:`, error);
        }
      }
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return fixed;
}
