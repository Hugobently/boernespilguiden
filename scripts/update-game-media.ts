/**
 * Update Game Media Script
 *
 * Reads the approved CSV file (media-approved.csv) and updates the
 * games-seed.ts file with screenshot URLs and video URLs.
 *
 * This script:
 * 1. Reads media-approved.csv
 * 2. Validates all URLs (HTTP HEAD request)
 * 3. Updates games-seed.ts with the approved media
 * 4. Generates a report
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// ============================================
// TYPES
// ============================================

interface ApprovedMedia {
  slug: string;
  title: string;
  screenshotUrls: string[];
  videoUrl: string;
  approved: boolean;
  notes: string;
}

interface ValidationResult {
  url: string;
  valid: boolean;
  statusCode?: number;
  error?: string;
}

// ============================================
// CONFIGURATION
// ============================================

const APPROVED_CSV = path.join(process.cwd(), 'scripts', 'output', 'media-approved.csv');
const SEED_FILE = path.join(process.cwd(), 'data', 'games-seed.ts');
const BACKUP_FILE = path.join(process.cwd(), 'data', 'games-seed.backup-auto.ts');

// ============================================
// UTILITY FUNCTIONS
// ============================================

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function validateUrl(url: string): Promise<ValidationResult> {
  if (!url || url.trim() === '') {
    return { url, valid: false, error: 'Empty URL' };
  }

  return new Promise((resolve) => {
    const parsedUrl = new URL(url);

    const options = {
      method: 'HEAD',
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      const isValid = res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302;
      resolve({
        url,
        valid: isValid,
        statusCode: res.statusCode
      });
    });

    req.on('error', (error) => {
      resolve({
        url,
        valid: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        valid: false,
        error: 'Timeout'
      });
    });

    req.end();
  });
}

// ============================================
// CSV PARSING
// ============================================

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      // Escaped quote
      current += '"';
      i++; // Skip next quote
    } else if (char === '"') {
      // Toggle quote mode
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

async function readApprovedMedia(): Promise<ApprovedMedia[]> {
  if (!fs.existsSync(APPROVED_CSV)) {
    throw new Error(`Approved CSV not found at: ${APPROVED_CSV}`);
  }

  const content = fs.readFileSync(APPROVED_CSV, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }

  const header = parseCSVLine(lines[0]);
  const slugIndex = header.indexOf('slug');
  const titleIndex = header.indexOf('title');
  const screenshot1Index = header.indexOf('screenshot1');
  const screenshot2Index = header.indexOf('screenshot2');
  const screenshot3Index = header.indexOf('screenshot3');
  const screenshot4Index = header.indexOf('screenshot4');
  const screenshot5Index = header.indexOf('screenshot5');
  const videoUrlIndex = header.indexOf('videoUrl');
  const approvedIndex = header.indexOf('approved');
  const notesIndex = header.indexOf('notes');

  const results: ApprovedMedia[] = [];

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);

    const approved = fields[approvedIndex]?.toLowerCase() === 'yes' ||
                     fields[approvedIndex]?.toLowerCase() === 'true';

    if (!approved) {
      continue; // Skip non-approved entries
    }

    const screenshotUrls = [
      fields[screenshot1Index],
      fields[screenshot2Index],
      fields[screenshot3Index],
      fields[screenshot4Index],
      fields[screenshot5Index]
    ].filter(url => url && url.trim() !== '');

    results.push({
      slug: fields[slugIndex],
      title: fields[titleIndex],
      screenshotUrls,
      videoUrl: fields[videoUrlIndex] || '',
      approved: true,
      notes: fields[notesIndex] || ''
    });
  }

  return results;
}

// ============================================
// URL VALIDATION
// ============================================

async function validateMediaUrls(media: ApprovedMedia[]): Promise<Map<string, ValidationResult[]>> {
  console.log('\n🔍 Validating URLs...\n');

  const results = new Map<string, ValidationResult[]>();
  let totalUrls = 0;
  let validUrls = 0;

  for (const item of media) {
    const validations: ValidationResult[] = [];

    // Validate screenshots
    for (const url of item.screenshotUrls) {
      await delay(100); // Small delay to avoid rate limiting
      const result = await validateUrl(url);
      validations.push(result);
      totalUrls++;
      if (result.valid) validUrls++;

      const status = result.valid ? '✓' : '✗';
      const statusText = result.statusCode ? `(${result.statusCode})` : `(${result.error})`;
      console.log(`  ${status} ${url.substring(0, 60)}... ${statusText}`);
    }

    // Validate video URL
    if (item.videoUrl && item.videoUrl.trim() !== '') {
      await delay(100);
      const result = await validateUrl(item.videoUrl);
      validations.push(result);
      totalUrls++;
      if (result.valid) validUrls++;

      const status = result.valid ? '✓' : '✗';
      const statusText = result.statusCode ? `(${result.statusCode})` : `(${result.error})`;
      console.log(`  ${status} ${item.videoUrl} ${statusText}`);
    }

    results.set(item.slug, validations);
    console.log('');
  }

  console.log(`Validation complete: ${validUrls}/${totalUrls} URLs valid\n`);
  return results;
}

// ============================================
// UPDATE SEED FILE
// ============================================

async function updateGamesSeedFile(media: ApprovedMedia[]): Promise<void> {
  console.log('\n📝 Updating games-seed.ts...\n');

  // Create automatic backup
  if (fs.existsSync(SEED_FILE)) {
    fs.copyFileSync(SEED_FILE, BACKUP_FILE);
    console.log(`Backup created: ${BACKUP_FILE}\n`);
  }

  let content = fs.readFileSync(SEED_FILE, 'utf-8');
  let updateCount = 0;

  for (const item of media) {
    // Find the game in the seed file
    const gamePattern = new RegExp(
      `(slug:\\s*["']${item.slug}["'],\\s*\\n[\\s\\S]*?)` +
      `(screenshotUrls:\\s*\\[)[^\\]]*\\]`,
      'g'
    );

    const screenshotsArray = item.screenshotUrls.length > 0
      ? '[\n      ' + item.screenshotUrls.map(url => `"${url}"`).join(',\n      ') + '\n    ]'
      : '[]';

    // Replace screenshots
    const newContent = content.replace(gamePattern, (match, prefix, screenshotsPrefix) => {
      return prefix + screenshotsPrefix + screenshotsArray.substring(1); // Remove leading [
    });

    // Replace video URL
    const videoPattern = new RegExp(
      `(slug:\\s*["']${item.slug}["'],\\s*\\n[\\s\\S]*?)` +
      `(videoUrl:\\s*)([^,\\n]+)`,
      'g'
    );

    const videoValue = item.videoUrl && item.videoUrl.trim() !== ''
      ? `"${item.videoUrl}"`
      : 'null';

    content = newContent.replace(videoPattern, (match, prefix, videoPrefix) => {
      return prefix + videoPrefix + videoValue;
    });

    if (newContent !== content) {
      updateCount++;
      console.log(`✓ Updated: ${item.slug}`);
    }
  }

  fs.writeFileSync(SEED_FILE, content, 'utf-8');
  console.log(`\n${updateCount} games updated in seed file\n`);
}

// ============================================
// REPORT GENERATION
// ============================================

function generateReport(
  media: ApprovedMedia[],
  validations: Map<string, ValidationResult[]>
): void {
  console.log('\n' + '='.repeat(60));
  console.log('UPDATE REPORT');
  console.log('='.repeat(60));

  const gamesWithScreenshots = media.filter(m => m.screenshotUrls.length > 0).length;
  const gamesWithVideos = media.filter(m => m.videoUrl && m.videoUrl.trim() !== '').length;
  const gamesWithBoth = media.filter(m =>
    m.screenshotUrls.length > 0 && m.videoUrl && m.videoUrl.trim() !== ''
  ).length;

  const totalScreenshots = media.reduce((sum, m) => sum + m.screenshotUrls.length, 0);
  const avgScreenshots = (totalScreenshots / media.length).toFixed(1);

  console.log(`Total games approved: ${media.length}`);
  console.log(`\nScreenshots:`);
  console.log(`  - Games with screenshots: ${gamesWithScreenshots} (${Math.round(gamesWithScreenshots/media.length*100)}%)`);
  console.log(`  - Total screenshots: ${totalScreenshots}`);
  console.log(`  - Average per game: ${avgScreenshots}`);
  console.log(`\nVideos:`);
  console.log(`  - Games with videos: ${gamesWithVideos} (${Math.round(gamesWithVideos/media.length*100)}%)`);
  console.log(`\nCombined:`);
  console.log(`  - Games with both: ${gamesWithBoth} (${Math.round(gamesWithBoth/media.length*100)}%)`);

  // Check for invalid URLs
  const invalidUrls: string[] = [];
  validations.forEach((results, slug) => {
    results.forEach(result => {
      if (!result.valid) {
        invalidUrls.push(`${slug}: ${result.url} - ${result.error}`);
      }
    });
  });

  if (invalidUrls.length > 0) {
    console.log(`\n⚠️  Invalid URLs found: ${invalidUrls.length}`);
    console.log(invalidUrls.join('\n'));
  } else {
    console.log(`\n✅ All URLs validated successfully`);
  }

  console.log('='.repeat(60) + '\n');
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n🎮 GAME MEDIA UPDATER\n');
  console.log('This script will update games-seed.ts with approved media.\n');

  // Read approved media
  console.log('📖 Reading approved media from CSV...');
  const media = await readApprovedMedia();
  console.log(`✓ Found ${media.length} approved games\n`);

  if (media.length === 0) {
    console.log('⚠️  No approved games found in CSV.');
    console.log('Make sure to mark games as approved (yes/true) in the "approved" column.\n');
    return;
  }

  // Validate URLs
  const validations = await validateMediaUrls(media);

  // Update seed file
  await updateGamesSeedFile(media);

  // Generate report
  generateReport(media, validations);

  console.log('Next steps:');
  console.log('1. Review the updated games-seed.ts file');
  console.log('2. Run: npm run db:reset && npm run db:seed');
  console.log('   OR');
  console.log('   Run: npm run migrate:media (for production)\n');
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
