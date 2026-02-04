/**
 * Approve All Media
 *
 * Marks all games with screenshots as approved
 */

import * as fs from 'fs';
import * as path from 'path';

const INPUT_CSV = path.join(process.cwd(), 'scripts', 'output', 'media-suggestions.csv');
const OUTPUT_CSV = path.join(process.cwd(), 'scripts', 'output', 'media-approved.csv');

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

function main() {
  console.log('\n✅ APPROVING ALL MEDIA\n');
  console.log('='.repeat(80) + '\n');

  const content = fs.readFileSync(INPUT_CSV, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  const headers = parseCSVLine(lines[0]);

  const approvedIndex = headers.indexOf('approved');
  const screenshot1Index = headers.indexOf('screenshot1');
  const titleIndex = headers.indexOf('title');

  const approvedLines: string[] = [lines[0]]; // Keep header
  let approvedCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    const hasScreenshots = fields[screenshot1Index] && fields[screenshot1Index].trim() !== '';

    if (hasScreenshots) {
      fields[approvedIndex] = 'yes';
      approvedCount++;
      console.log(`✓ Approved: ${fields[titleIndex]}`);
    }

    // Rebuild CSV line
    const line = fields.map(sanitizeForCSV).join(',');
    approvedLines.push(line);
  }

  // Write approved CSV
  fs.writeFileSync(OUTPUT_CSV, approvedLines.join('\n'), 'utf-8');

  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Games approved: ${approvedCount}`);
  console.log(`Approved file saved to: ${OUTPUT_CSV}`);
  console.log('='.repeat(80) + '\n');

  console.log('Next steps:');
  console.log('1. Run: npm run update:media');
  console.log('2. Review changes in data/games-seed.ts');
  console.log('3. Run: npm run migrate:media\n');
}

main();
