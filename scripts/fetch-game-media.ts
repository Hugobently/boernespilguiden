/**
 * Media Fetcher Script for Online Games
 *
 * This script automates the fetching of screenshots and videos for games:
 * - Screenshots from iTunes Search API (free, no auth)
 * - Screenshots from Google Play Store (web scraping)
 * - Videos from YouTube Data API (requires YOUTUBE_API_KEY)
 *
 * Outputs CSV file for manual review before updating seed data.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { games0to3, games3to6, games7to10, games11to15, GameSeedData } from '../data/games-seed';

// ============================================
// TYPES
// ============================================

interface iTunesAppData {
  screenshotUrls?: string[];
  ipadScreenshotUrls?: string[];
  previewUrl?: string;
}

interface PlayStoreScreenshots {
  urls: string[];
}

interface YouTubeVideo {
  videoId: string;
  title: string;
  url: string;
  viewCount?: number;
}

interface MediaResult {
  slug: string;
  title: string;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  screenshot1: string;
  screenshot2: string;
  screenshot3: string;
  screenshot4: string;
  screenshot5: string;
  videoUrl: string;
  videoTitle: string;
  source: string;
  needsReview: string;
  error?: string;
}

// ============================================
// CONFIGURATION
// ============================================

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'media-suggestions.csv');

// Rate limiting
const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds between requests
const DELAY_BETWEEN_API_CALLS = 500; // 0.5 seconds for API calls

// ============================================
// UTILITY FUNCTIONS
// ============================================

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          httpsGet(redirectUrl).then(resolve).catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractAppId(appStoreUrl: string): string | null {
  const match = appStoreUrl.match(/id(\d+)/);
  return match ? match[1] : null;
}

function extractPlayStoreId(playStoreUrl: string): string | null {
  const match = playStoreUrl.match(/id=([^&]+)/);
  return match ? match[1] : null;
}

function sanitizeForCSV(str: string): string {
  if (!str) return '';
  // Escape double quotes and wrap in quotes if contains comma, newline, or quote
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// ============================================
// ITUNES SEARCH API
// ============================================

async function fetchFromiTunes(appStoreUrl: string | null): Promise<Partial<MediaResult>> {
  if (!appStoreUrl) {
    return { source: 'none', error: 'No App Store URL' };
  }

  const appId = extractAppId(appStoreUrl);
  if (!appId) {
    return { source: 'none', error: 'Could not extract App ID' };
  }

  try {
    await delay(DELAY_BETWEEN_API_CALLS);
    // Try both US and DK app stores
    let url = `https://itunes.apple.com/lookup?id=${appId}&country=us`;
    let response: string;
    let data: any;

    try {
      response = await httpsGet(url);
      data = JSON.parse(response);
    } catch (e) {
      // Try DK store if US fails
      url = `https://itunes.apple.com/lookup?id=${appId}&country=dk`;
      response = await httpsGet(url);
      data = JSON.parse(response);
    }

    if (!data.results || data.results.length === 0) {
      return { source: 'none', error: 'App not found in iTunes' };
    }

    const app: iTunesAppData = data.results[0];
    const screenshots: string[] = [];

    // Combine both iPhone and iPad screenshots
    if (app.screenshotUrls && Array.isArray(app.screenshotUrls)) {
      screenshots.push(...app.screenshotUrls);
    }
    if (app.ipadScreenshotUrls && Array.isArray(app.ipadScreenshotUrls)) {
      screenshots.push(...app.ipadScreenshotUrls);
    }

    // Take up to 5 screenshots
    const selectedScreenshots = screenshots.slice(0, 5);

    return {
      screenshot1: selectedScreenshots[0] || '',
      screenshot2: selectedScreenshots[1] || '',
      screenshot3: selectedScreenshots[2] || '',
      screenshot4: selectedScreenshots[3] || '',
      screenshot5: selectedScreenshots[4] || '',
      source: screenshots.length > 0 ? 'iTunes' : 'none',
      needsReview: screenshots.length > 0 ? 'yes' : 'no'
    };
  } catch (error) {
    return {
      source: 'none',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// ============================================
// GOOGLE PLAY STORE SCRAPING
// ============================================

async function fetchFromPlayStore(playStoreUrl: string | null): Promise<Partial<MediaResult>> {
  if (!playStoreUrl) {
    return { source: 'none', error: 'No Play Store URL' };
  }

  try {
    await delay(DELAY_BETWEEN_REQUESTS);
    const html = await httpsGet(playStoreUrl);

    // Extract screenshot URLs from Play Store HTML
    // Play Store uses data-src attributes in img tags
    const screenshots: string[] = [];

    // Pattern 1: Look for high-res screenshot URLs
    const pattern1 = /https:\/\/play-lh\.googleusercontent\.com\/[^"'\s]+/g;
    const matches1 = html.match(pattern1) || [];

    // Filter for screenshot URLs (usually contain =w followed by width)
    const screenshotUrls = matches1
      .filter(url => url.includes('=w') && !url.includes('=s') && !url.includes('icon'))
      .filter((url, index, self) => self.indexOf(url) === index) // Remove duplicates
      .slice(0, 5);

    return {
      screenshot1: screenshotUrls[0] || '',
      screenshot2: screenshotUrls[1] || '',
      screenshot3: screenshotUrls[2] || '',
      screenshot4: screenshotUrls[3] || '',
      screenshot5: screenshotUrls[4] || '',
      source: screenshotUrls.length > 0 ? 'PlayStore' : 'none',
      needsReview: screenshotUrls.length > 0 ? 'yes' : 'no'
    };
  } catch (error) {
    return {
      source: 'none',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// ============================================
// YOUTUBE DATA API
// ============================================

async function searchYouTubeVideo(gameTitle: string): Promise<Partial<MediaResult>> {
  if (!YOUTUBE_API_KEY) {
    return {
      videoUrl: '',
      videoTitle: '',
      error: 'No YouTube API key configured'
    };
  }

  try {
    await delay(DELAY_BETWEEN_API_CALLS);

    // Search query optimized for gameplay videos for kids
    const query = encodeURIComponent(`${gameTitle} gameplay kids`);
    const url = `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&` +
      `q=${query}&` +
      `type=video&` +
      `safeSearch=strict&` +
      `videoDuration=medium&` +
      `maxResults=5&` +
      `order=relevance&` +
      `key=${YOUTUBE_API_KEY}`;

    const response = await httpsGet(url);
    const data = JSON.parse(response);

    if (!data.items || data.items.length === 0) {
      return { videoUrl: '', videoTitle: '', error: 'No videos found' };
    }

    // Get the first result (most relevant)
    const video = data.items[0];
    const videoId = video.id.videoId;
    const videoTitle = video.snippet.title;

    return {
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      videoTitle: videoTitle,
      needsReview: 'yes'
    };
  } catch (error) {
    return {
      videoUrl: '',
      videoTitle: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// ============================================
// MAIN PROCESSING
// ============================================

async function processGame(game: GameSeedData): Promise<MediaResult> {
  console.log(`Processing: ${game.title}`);

  const result: MediaResult = {
    slug: game.slug,
    title: game.title,
    appStoreUrl: game.appStoreUrl,
    playStoreUrl: game.playStoreUrl,
    screenshot1: '',
    screenshot2: '',
    screenshot3: '',
    screenshot4: '',
    screenshot5: '',
    videoUrl: '',
    videoTitle: '',
    source: 'none',
    needsReview: 'no'
  };

  // Try iTunes first (preferred for iOS games)
  if (game.appStoreUrl) {
    console.log(`  Fetching from iTunes...`);
    const iTunesData = await fetchFromiTunes(game.appStoreUrl);

    if (iTunesData.screenshot1) {
      Object.assign(result, iTunesData);
      console.log(`  ✓ Found ${iTunesData.source} screenshots`);
    } else if (iTunesData.error) {
      console.log(`  ✗ iTunes error: ${iTunesData.error}`);
    }
  }

  // If no screenshots from iTunes, try Play Store
  if (!result.screenshot1 && game.playStoreUrl) {
    console.log(`  Fetching from Play Store...`);
    const playStoreData = await fetchFromPlayStore(game.playStoreUrl);

    if (playStoreData.screenshot1) {
      Object.assign(result, playStoreData);
      console.log(`  ✓ Found ${playStoreData.source} screenshots`);
    } else if (playStoreData.error) {
      console.log(`  ✗ Play Store error: ${playStoreData.error}`);
    }
  }

  // Search for YouTube video
  console.log(`  Searching YouTube...`);
  const youtubeData = await searchYouTubeVideo(game.title);

  if (youtubeData.videoUrl) {
    result.videoUrl = youtubeData.videoUrl;
    result.videoTitle = youtubeData.videoTitle || '';
    console.log(`  ✓ Found YouTube video`);
  } else if (youtubeData.error) {
    console.log(`  ✗ YouTube error: ${youtubeData.error}`);
  }

  // Mark for review if we found any media
  if (result.screenshot1 || result.videoUrl) {
    result.needsReview = 'yes';
  }

  console.log('');
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
  console.log(`YouTube API configured: ${YOUTUBE_API_KEY ? 'Yes' : 'No'}\n`);
  console.log('='.repeat(60) + '\n');

  const results: MediaResult[] = [];

  for (const game of allGames) {
    const result = await processGame(game);
    results.push(result);

    // Progress indicator
    console.log(`Progress: ${results.length}/${allGames.length} games processed\n`);
  }

  return results;
}

// ============================================
// CSV EXPORT
// ============================================

function exportToCSV(results: MediaResult[]): void {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // CSV header
  const header = [
    'slug',
    'title',
    'appStoreUrl',
    'playStoreUrl',
    'screenshot1',
    'screenshot2',
    'screenshot3',
    'screenshot4',
    'screenshot5',
    'videoUrl',
    'videoTitle',
    'source',
    'needsReview',
    'approved',
    'notes'
  ].join(',');

  // CSV rows
  const rows = results.map(r => [
    sanitizeForCSV(r.slug),
    sanitizeForCSV(r.title),
    sanitizeForCSV(r.appStoreUrl || ''),
    sanitizeForCSV(r.playStoreUrl || ''),
    sanitizeForCSV(r.screenshot1),
    sanitizeForCSV(r.screenshot2),
    sanitizeForCSV(r.screenshot3),
    sanitizeForCSV(r.screenshot4),
    sanitizeForCSV(r.screenshot5),
    sanitizeForCSV(r.videoUrl),
    sanitizeForCSV(r.videoTitle),
    sanitizeForCSV(r.source),
    sanitizeForCSV(r.needsReview),
    '', // approved - to be filled during review
    ''  // notes - to be filled during review
  ].join(','));

  const csv = [header, ...rows].join('\n');

  fs.writeFileSync(OUTPUT_FILE, csv, 'utf-8');
  console.log(`\n✅ CSV exported to: ${OUTPUT_FILE}\n`);
}

// ============================================
// STATISTICS
// ============================================

function printStatistics(results: MediaResult[]): void {
  const withScreenshots = results.filter(r => r.screenshot1).length;
  const withVideos = results.filter(r => r.videoUrl).length;
  const withBoth = results.filter(r => r.screenshot1 && r.videoUrl).length;
  const fromItunes = results.filter(r => r.source === 'iTunes').length;
  const fromPlayStore = results.filter(r => r.source === 'PlayStore').length;

  console.log('\n' + '='.repeat(60));
  console.log('STATISTICS');
  console.log('='.repeat(60));
  console.log(`Total games processed: ${results.length}`);
  console.log(`\nScreenshots:`);
  console.log(`  - Games with screenshots: ${withScreenshots} (${Math.round(withScreenshots/results.length*100)}%)`);
  console.log(`  - From iTunes: ${fromItunes}`);
  console.log(`  - From Play Store: ${fromPlayStore}`);
  console.log(`\nVideos:`);
  console.log(`  - Games with videos: ${withVideos} (${Math.round(withVideos/results.length*100)}%)`);
  console.log(`\nCombined:`);
  console.log(`  - Games with both: ${withBoth} (${Math.round(withBoth/results.length*100)}%)`);
  console.log('='.repeat(60) + '\n');
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n🎮 GAME MEDIA FETCHER\n');
  console.log('This script will fetch screenshots and videos for all games.');
  console.log('Results will be saved to a CSV file for manual review.\n');

  if (!YOUTUBE_API_KEY) {
    console.log('⚠️  WARNING: YOUTUBE_API_KEY not configured in .env');
    console.log('   Video search will be skipped.\n');
  }

  const results = await processAllGames();
  exportToCSV(results);
  printStatistics(results);

  console.log('Next steps:');
  console.log('1. Review the CSV file at: scripts/output/media-suggestions.csv');
  console.log('2. Mark approved games and add notes');
  console.log('3. Save as: scripts/output/media-approved.csv');
  console.log('4. Run: npm run update-game-media\n');
}

main()
  .catch(console.error)
  .finally(() => {
    console.log('Done!');
    process.exit(0);
  });
