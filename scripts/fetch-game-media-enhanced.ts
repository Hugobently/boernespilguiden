/**
 * Enhanced Game Media Fetcher
 *
 * Fetches screenshots from multiple sources:
 * 1. iTunes Search API (primary for iOS)
 * 2. Google Play Store scraping (primary for Android)
 * 3. Official game websites (fallback)
 * 4. YouTube video thumbnails (fallback)
 * 5. Steam/Epic Games Store (for PC games)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { games0to3, games3to6, games7to10, games11to15, GameSeedData } from '../data/games-seed';

// ============================================
// TYPES
// ============================================

interface MediaResult {
  slug: string;
  title: string;
  screenshots: string[];
  videoUrl: string;
  source: string;
  needsReview: boolean;
}

interface YouTubeSearchResult {
  videoId: string;
  title: string;
  thumbnailUrl: string;
}

// ============================================
// CONFIGURATION
// ============================================

const OUTPUT_CSV = path.join(process.cwd(), 'scripts', 'output', 'media-enhanced.csv');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// ============================================
// UTILITY FUNCTIONS
// ============================================

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchUrl(url: string, options: any = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const requestOptions = {
      method: options.method || 'GET',
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: {
        'User-Agent': USER_AGENT,
        ...options.headers
      },
      timeout: 15000
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

// ============================================
// ITUNES SEARCH API
// ============================================

async function fetchFromiTunes(appStoreUrl: string): Promise<MediaResult | null> {
  try {
    // Extract app ID from URL
    const match = appStoreUrl.match(/id(\d+)/);
    if (!match) {
      throw new Error('No app ID found in URL');
    }

    const appId = match[1];

    // Try multiple regions
    const regions = ['us', 'dk', 'gb'];

    for (const region of regions) {
      try {
        const apiUrl = `https://itunes.apple.com/lookup?id=${appId}&country=${region}`;
        const response = await fetchUrl(apiUrl);
        const data = JSON.parse(response);

        if (data.results && data.results.length > 0) {
          const app = data.results[0];
          const screenshots = app.screenshotUrls || app.ipadScreenshotUrls || [];

          if (screenshots.length > 0) {
            return {
              slug: '',
              title: app.trackName,
              screenshots: screenshots.slice(0, 5),
              videoUrl: app.previewUrl || '',
              source: 'iTunes',
              needsReview: true
            };
          }
        }
      } catch (err) {
        // Try next region
        continue;
      }
    }

    throw new Error('App not found in any region');
  } catch (error) {
    return null;
  }
}

// ============================================
// YOUTUBE THUMBNAILS
// ============================================

async function searchYouTubeThumbnails(gameTitle: string): Promise<string[]> {
  try {
    // Search for gameplay videos on YouTube
    const searchQuery = encodeURIComponent(`${gameTitle} gameplay kids`);
    const searchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

    const html = await fetchUrl(searchUrl);

    // Extract video IDs from the page
    const videoIdMatches = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/g);

    if (!videoIdMatches || videoIdMatches.length === 0) {
      return [];
    }

    // Get unique video IDs
    const videoIds = Array.from(new Set(
      videoIdMatches
        .map(match => match.match(/"videoId":"([a-zA-Z0-9_-]{11})"/)![1])
    )).slice(0, 3); // Take top 3 videos

    // Generate thumbnail URLs (maxresdefault for best quality)
    const thumbnails = videoIds.map(videoId =>
      `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
    );

    return thumbnails;
  } catch (error) {
    console.error(`YouTube search error: ${error}`);
    return [];
  }
}

// ============================================
// WEBSITE SCRAPING
// ============================================

async function fetchFromWebsite(websiteUrl: string): Promise<string[]> {
  try {
    const html = await fetchUrl(websiteUrl);

    // Look for common screenshot patterns
    const screenshots: string[] = [];

    // Pattern 1: og:image meta tags
    const ogImageMatches = html.match(/<meta property="og:image" content="([^"]+)"/g);
    if (ogImageMatches) {
      ogImageMatches.forEach(match => {
        const url = match.match(/content="([^"]+)"/)?.[1];
        if (url && !url.includes('logo') && !url.includes('icon')) {
          screenshots.push(url);
        }
      });
    }

    // Pattern 2: Common screenshot class names
    const screenshotMatches = html.match(/<img[^>]+class="[^"]*screenshot[^"]*"[^>]+src="([^"]+)"/gi);
    if (screenshotMatches) {
      screenshotMatches.forEach(match => {
        const url = match.match(/src="([^"]+)"/)?.[1];
        if (url) {
          screenshots.push(url);
        }
      });
    }

    // Pattern 3: Gallery images
    const galleryMatches = html.match(/<img[^>]+class="[^"]*gallery[^"]*"[^>]+src="([^"]+)"/gi);
    if (galleryMatches) {
      galleryMatches.forEach(match => {
        const url = match.match(/src="([^"]+)"/)?.[1];
        if (url) {
          screenshots.push(url);
        }
      });
    }

    // Make URLs absolute if they're relative
    const finalScreenshots = screenshots
      .map(url => {
        if (url.startsWith('//')) return 'https:' + url;
        if (url.startsWith('/')) {
          const baseUrl = new URL(websiteUrl);
          return baseUrl.origin + url;
        }
        return url;
      })
      .filter((url, index, self) => self.indexOf(url) === index) // Remove duplicates
      .slice(0, 5);

    return finalScreenshots;
  } catch (error) {
    return [];
  }
}

// ============================================
// PLAY STORE SCRAPING
// ============================================

async function fetchFromPlayStore(playStoreUrl: string): Promise<string[]> {
  try {
    const html = await fetchUrl(playStoreUrl);

    const screenshots: string[] = [];

    // Look for high-res image URLs
    const imageMatches = html.match(/https:\/\/play-lh\.googleusercontent\.com\/[^"\s]+/g);

    if (imageMatches) {
      imageMatches.forEach(url => {
        // Filter out small icons and badges
        if (!url.includes('=w48-h16') &&
            !url.includes('=w96-h32') &&
            !url.includes('=w240-h480') &&
            !url.includes('=s64') &&
            !url.includes('=s128')) {

          // Convert to high-res format
          let cleanUrl = url.split('=')[0];

          // Add high-res parameters
          if (!cleanUrl.includes('=')) {
            cleanUrl += '=w1920-h1080-rw';
          }

          screenshots.push(cleanUrl);
        }
      });
    }

    return Array.from(new Set(screenshots)).slice(0, 5);
  } catch (error) {
    return [];
  }
}

// ============================================
// MAIN PROCESSING
// ============================================

async function processGame(game: GameSeedData): Promise<MediaResult> {
  const result: MediaResult = {
    slug: game.slug,
    title: game.title,
    screenshots: [],
    videoUrl: '',
    source: 'none',
    needsReview: false
  };

  console.log(`\nProcessing: ${game.title}`);

  // Try iTunes first
  if (game.appStoreUrl) {
    console.log('  Trying iTunes...');
    const itunesResult = await fetchFromiTunes(game.appStoreUrl);
    if (itunesResult && itunesResult.screenshots.length > 0) {
      result.screenshots = itunesResult.screenshots;
      result.videoUrl = itunesResult.videoUrl;
      result.source = 'iTunes';
      result.needsReview = true;
      console.log(`  ✓ Found ${result.screenshots.length} screenshots from iTunes`);
      return result;
    }
  }

  // Try Play Store
  if (game.playStoreUrl && result.screenshots.length === 0) {
    console.log('  Trying Play Store...');
    await delay(500); // Rate limiting
    const playStoreScreenshots = await fetchFromPlayStore(game.playStoreUrl);
    if (playStoreScreenshots.length > 0) {
      result.screenshots = playStoreScreenshots;
      result.source = 'PlayStore';
      result.needsReview = true;
      console.log(`  ✓ Found ${result.screenshots.length} screenshots from Play Store`);
      return result;
    }
  }

  // Try official website
  if (game.websiteUrl && result.screenshots.length === 0) {
    console.log('  Trying official website...');
    await delay(500);
    const websiteScreenshots = await fetchFromWebsite(game.websiteUrl);
    if (websiteScreenshots.length > 0) {
      result.screenshots = websiteScreenshots;
      result.source = 'Website';
      result.needsReview = true;
      console.log(`  ✓ Found ${result.screenshots.length} screenshots from website`);
      return result;
    }
  }

  // Try YouTube thumbnails as last resort
  if (result.screenshots.length === 0) {
    console.log('  Trying YouTube thumbnails...');
    await delay(1000); // More conservative rate limiting for YouTube
    const youtubeThumbnails = await searchYouTubeThumbnails(game.title);
    if (youtubeThumbnails.length > 0) {
      result.screenshots = youtubeThumbnails;
      result.source = 'YouTube';
      result.needsReview = true;
      console.log(`  ✓ Found ${result.screenshots.length} thumbnails from YouTube`);
      return result;
    }
  }

  console.log('  ✗ No screenshots found');
  return result;
}

async function processAllGames(): Promise<MediaResult[]> {
  const allGames = [
    ...games0to3,
    ...games3to6,
    ...games7to10,
    ...games11to15
  ];

  console.log(`\n📱 Processing ${allGames.length} games...\n`);

  const results: MediaResult[] = [];

  for (const game of allGames) {
    const result = await processGame(game);
    results.push(result);

    // Progress indicator
    if ((results.length % 10) === 0) {
      const withScreenshots = results.filter(r => r.screenshots.length > 0).length;
      console.log(`\n   Progress: ${results.length}/${allGames.length} games processed`);
      console.log(`   Screenshots found: ${withScreenshots}/${results.length}\n`);
    }

    // Rate limiting between games
    await delay(300);
  }

  return results;
}

// ============================================
// CSV EXPORT
// ============================================

function exportToCSV(results: MediaResult[]): void {
  const rows: string[] = [
    'slug,title,source,screenshot1,screenshot2,screenshot3,screenshot4,screenshot5,needsReview,approved,notes'
  ];

  results.forEach(result => {
    const screenshots = result.screenshots.slice(0, 5);
    while (screenshots.length < 5) screenshots.push('');

    const row = [
      result.slug,
      result.title,
      result.source,
      ...screenshots,
      result.needsReview ? 'yes' : 'no',
      result.screenshots.length > 0 ? 'pending' : 'no',
      ''
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');

    rows.push(row);
  });

  fs.writeFileSync(OUTPUT_CSV, rows.join('\n'), 'utf-8');
  console.log(`\n✅ Results saved to: ${OUTPUT_CSV}\n`);
}

// ============================================
// REPORT
// ============================================

function generateReport(results: MediaResult[]): void {
  const withScreenshots = results.filter(r => r.screenshots.length > 0);
  const bySource = {
    iTunes: results.filter(r => r.source === 'iTunes').length,
    PlayStore: results.filter(r => r.source === 'PlayStore').length,
    Website: results.filter(r => r.source === 'Website').length,
    YouTube: results.filter(r => r.source === 'YouTube').length,
    none: results.filter(r => r.source === 'none').length
  };

  console.log('\n' + '='.repeat(60));
  console.log('ENHANCED FETCH REPORT');
  console.log('='.repeat(60));
  console.log(`Total games processed: ${results.length}`);
  console.log(`Games with screenshots: ${withScreenshots.length} (${Math.round(withScreenshots.length/results.length*100)}%)`);
  console.log(`Games without screenshots: ${results.length - withScreenshots.length}`);
  console.log(`\nBy source:`);
  console.log(`  - iTunes: ${bySource.iTunes}`);
  console.log(`  - Play Store: ${bySource.PlayStore}`);
  console.log(`  - Official Website: ${bySource.Website}`);
  console.log(`  - YouTube: ${bySource.YouTube}`);
  console.log(`  - None found: ${bySource.none}`);
  console.log('='.repeat(60) + '\n');
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n🎮 ENHANCED GAME MEDIA FETCHER\n');
  console.log('This script fetches screenshots from multiple sources:\n');
  console.log('1. iTunes Search API (iOS apps)');
  console.log('2. Google Play Store (Android apps)');
  console.log('3. Official game websites');
  console.log('4. YouTube video thumbnails\n');

  const results = await processAllGames();
  exportToCSV(results);
  generateReport(results);

  console.log('Next steps:');
  console.log('1. Review the CSV file: scripts/output/media-enhanced.csv');
  console.log('2. Approve games by changing "pending" to "yes" in the approved column');
  console.log('3. Run: npm run update:media\n');
}

main()
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  })
  .finally(() => {
    console.log('Done!');
    process.exit(0);
  });
