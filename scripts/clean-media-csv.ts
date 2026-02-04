/**
 * Clean Media CSV
 *
 * Removes low-quality badge images from Play Store screenshots
 */

import * as fs from 'fs';
import * as path from 'path';

const INPUT_CSV = path.join(process.cwd(), 'scripts', 'output', 'media-suggestions.csv');
const OUTPUT_CSV = path.join(process.cwd(), 'scripts', 'output', 'media-suggestions-cleaned.csv');

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

function sanitizeForCSV(str: string): string {
  if (!str) return '';
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function isBadgeUrl(url: string): boolean {
  // Check if URL contains very small dimensions (likely a badge/icon)
  return url.includes('=w48-h16') ||
         url.includes('=w96-h32') ||
         url.includes('=w240-h480'); // Also remove medium quality ones for consistency
}

function main() {
  console.log('\n🧹 CLEANING MEDIA CSV\n');
  console.log('='.repeat(80) + '\n');

  const content = fs.readFileSync(INPUT_CSV, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  const headers = parseCSVLine(lines[0]);

  const screenshot1Index = headers.indexOf('screenshot1');
  const screenshot2Index = headers.indexOf('screenshot2');
  const screenshot3Index = headers.indexOf('screenshot3');
  const screenshot4Index = headers.indexOf('screenshot4');
  const screenshot5Index = headers.indexOf('screenshot5');

  const cleanedLines: string[] = [lines[0]]; // Keep header
  let gamesModified = 0;
  let urlsRemoved = 0;

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    let modified = false;

    // Check and clean screenshot4 and screenshot5
    if (fields[screenshot4Index] && isBadgeUrl(fields[screenshot4Index])) {
      fields[screenshot4Index] = '';
      modified = true;
      urlsRemoved++;
    }

    if (fields[screenshot5Index] && isBadgeUrl(fields[screenshot5Index])) {
      fields[screenshot5Index] = '';
      modified = true;
      urlsRemoved++;
    }

    // Also clean screenshot1-3 if they're badges (rare but possible)
    if (fields[screenshot1Index] && isBadgeUrl(fields[screenshot1Index])) {
      fields[screenshot1Index] = '';
      modified = true;
      urlsRemoved++;
    }

    if (fields[screenshot2Index] && isBadgeUrl(fields[screenshot2Index])) {
      fields[screenshot2Index] = '';
      modified = true;
      urlsRemoved++;
    }

    if (fields[screenshot3Index] && isBadgeUrl(fields[screenshot3Index])) {
      fields[screenshot3Index] = '';
      modified = true;
      urlsRemoved++;
    }

    if (modified) {
      gamesModified++;
      const title = fields[headers.indexOf('title')];
      console.log(`✓ Cleaned: ${title}`);
    }

    // Rebuild CSV line
    const cleanedLine = fields.map(sanitizeForCSV).join(',');
    cleanedLines.push(cleanedLine);
  }

  // Write cleaned CSV
  fs.writeFileSync(OUTPUT_CSV, cleanedLines.join('\n'), 'utf-8');

  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Games modified: ${gamesModified}`);
  console.log(`URLs removed: ${urlsRemoved}`);
  console.log(`\nCleaned file saved to: ${OUTPUT_CSV}`);
  console.log('='.repeat(80) + '\n');

  console.log('Next steps:');
  console.log('1. Review the cleaned file');
  console.log('2. Rename to media-suggestions.csv (or use as media-approved.csv)');
  console.log('3. Add YouTube videos');
  console.log('4. Mark approved games\n');
}

main();
