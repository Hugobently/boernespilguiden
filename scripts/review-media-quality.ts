/**
 * Media Quality Review Script
 *
 * Reviews the fetched media and checks for quality issues
 */

import * as fs from 'fs';
import * as path from 'path';

const CSV_FILE = path.join(process.cwd(), 'scripts', 'output', 'media-suggestions.csv');

interface GameMedia {
  slug: string;
  title: string;
  screenshots: string[];
  videoUrl: string;
  source: string;
  needsReview: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function analyzeScreenshotUrl(url: string): { source: string; quality: string; issues: string[] } {
  const issues: string[] = [];
  let source = 'unknown';
  let quality = 'good';

  if (!url || url.trim() === '') {
    return { source: 'none', quality: 'none', issues: ['Empty URL'] };
  }

  // Identify source
  if (url.includes('mzstatic.com')) {
    source = 'iTunes/App Store';
  } else if (url.includes('play-lh.googleusercontent.com')) {
    source = 'Google Play Store';
  } else {
    source = 'Other';
    issues.push('Unknown source');
  }

  // Check for potential issues
  if (url.includes('=w48-h16') || url.includes('=w96-h32')) {
    issues.push('Very small dimensions (likely icon/badge)');
    quality = 'poor';
  }

  if (url.includes('=w240-h480') || url.includes('=w600-h300')) {
    quality = 'medium';
  }

  if (url.includes('=w480-h960') || url.includes('406x228') || url.includes('392x696')) {
    quality = 'good';
  }

  return { source, quality, issues };
}

function main() {
  console.log('\n📊 MEDIA QUALITY REVIEW\n');
  console.log('='.repeat(80) + '\n');

  const content = fs.readFileSync(CSV_FILE, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  const headers = parseCSVLine(lines[0]);

  const games: GameMedia[] = [];
  const qualityIssues: { game: string; issue: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    const screenshots = [
      values[headers.indexOf('screenshot1')],
      values[headers.indexOf('screenshot2')],
      values[headers.indexOf('screenshot3')],
      values[headers.indexOf('screenshot4')],
      values[headers.indexOf('screenshot5')]
    ].filter(url => url && url.trim());

    if (screenshots.length > 0) {
      games.push({
        slug: values[headers.indexOf('slug')],
        title: values[headers.indexOf('title')],
        screenshots,
        videoUrl: values[headers.indexOf('videoUrl')],
        source: values[headers.indexOf('source')],
        needsReview: values[headers.indexOf('needsReview')]
      });
    }
  }

  console.log(`Total games with screenshots: ${games.length}\n`);

  let iTunesCount = 0;
  let playStoreCount = 0;
  let poorQualityCount = 0;
  let tooManyScreenshots = 0;
  let tooFewScreenshots = 0;

  games.forEach(game => {
    const screenshotCount = game.screenshots.length;

    // Count by source
    if (game.source === 'iTunes') iTunesCount++;
    if (game.source === 'PlayStore') playStoreCount++;

    // Check screenshot count
    if (screenshotCount > 5) {
      tooManyScreenshots++;
      qualityIssues.push({
        game: game.title,
        issue: `Too many screenshots (${screenshotCount}) - should be max 5`
      });
    }

    if (screenshotCount < 3) {
      tooFewScreenshots++;
      qualityIssues.push({
        game: game.title,
        issue: `Only ${screenshotCount} screenshot(s) - recommend 3-5`
      });
    }

    // Analyze each screenshot
    game.screenshots.forEach((url, index) => {
      const analysis = analyzeScreenshotUrl(url);

      if (analysis.quality === 'poor') {
        poorQualityCount++;
        qualityIssues.push({
          game: game.title,
          issue: `Screenshot ${index + 1}: ${analysis.issues.join(', ')}`
        });
      }
    });

    // Show game details
    console.log(`✓ ${game.title}`);
    console.log(`  Slug: ${game.slug}`);
    console.log(`  Source: ${game.source}`);
    console.log(`  Screenshots: ${screenshotCount}`);

    game.screenshots.forEach((url, index) => {
      const analysis = analyzeScreenshotUrl(url);
      const qualityIcon = analysis.quality === 'good' ? '✓' : analysis.quality === 'medium' ? '○' : '✗';
      console.log(`    ${qualityIcon} Screenshot ${index + 1}: ${analysis.quality} quality (${analysis.source})`);
      if (analysis.issues.length > 0) {
        console.log(`       Issues: ${analysis.issues.join(', ')}`);
      }
    });
    console.log('');
  });

  // Summary
  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total games with screenshots: ${games.length}`);
  console.log(`  - From iTunes: ${iTunesCount}`);
  console.log(`  - From Play Store: ${playStoreCount}`);
  console.log('');
  console.log('Screenshot Quality:');
  console.log(`  - Games with poor quality screenshots: ${poorQualityCount}`);
  console.log(`  - Games with too few screenshots (<3): ${tooFewScreenshots}`);
  console.log(`  - Games with too many screenshots (>5): ${tooManyScreenshots}`);
  console.log('');

  if (qualityIssues.length > 0) {
    console.log('⚠️  ISSUES FOUND:');
    console.log('');
    qualityIssues.forEach(issue => {
      console.log(`  • ${issue.game}: ${issue.issue}`);
    });
    console.log('');
  }

  // Recommendations
  console.log('='.repeat(80));
  console.log('RECOMMENDATIONS');
  console.log('='.repeat(80));

  const gamesNeedingReview = games.filter(g =>
    g.screenshots.some(url => {
      const analysis = analyzeScreenshotUrl(url);
      return analysis.quality === 'poor';
    })
  );

  if (gamesNeedingReview.length > 0) {
    console.log('Games that need manual review:');
    gamesNeedingReview.forEach(game => {
      console.log(`  - ${game.title} (${game.slug})`);
    });
  } else {
    console.log('✓ All screenshots appear to be good quality!');
  }

  console.log('');
  console.log('Next steps:');
  console.log('1. Open scripts/preview-media.html to visually review screenshots');
  console.log('2. Remove any poor quality screenshots from the CSV');
  console.log('3. Add YouTube videos for games');
  console.log('4. Mark approved games in the CSV');
  console.log('='.repeat(80) + '\n');
}

main();
