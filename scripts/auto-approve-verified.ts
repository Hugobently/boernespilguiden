/**
 * Auto-approve verified screenshot sources
 *
 * Automatically approves screenshots from trusted sources (iTunes, Play Store)
 * and keeps YouTube/Website screenshots for manual review
 */

import * as fs from 'fs';
import * as path from 'path';

const INPUT_CSV = path.join(process.cwd(), 'scripts', 'output', 'media-enhanced.csv');
const OUTPUT_CSV = path.join(process.cwd(), 'scripts', 'output', 'media-approved.csv');

interface MediaRow {
  slug: string;
  title: string;
  source: string;
  screenshot1: string;
  screenshot2: string;
  screenshot3: string;
  screenshot4: string;
  screenshot5: string;
  needsReview: string;
  approved: string;
  notes: string;
}

function parseCSV(content: string): MediaRow[] {
  const lines = content.split('\n').filter(line => line.trim());
  const header = lines[0];

  const rows: MediaRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);

    rows.push({
      slug: fields[0],
      title: fields[1],
      source: fields[2],
      screenshot1: fields[3],
      screenshot2: fields[4],
      screenshot3: fields[5],
      screenshot4: fields[6],
      screenshot5: fields[7],
      needsReview: fields[8],
      approved: fields[9],
      notes: fields[10] || ''
    });
  }

  return rows;
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

function autoApprove(rows: MediaRow[]): { approved: MediaRow[], pending: MediaRow[] } {
  const approved: MediaRow[] = [];
  const pending: MediaRow[] = [];

  // Trusted sources that can be auto-approved
  const trustedSources = ['iTunes', 'PlayStore'];

  rows.forEach(row => {
    if (trustedSources.includes(row.source)) {
      row.approved = 'yes';
      row.notes = 'Auto-approved (verified source)';
      approved.push(row);
    } else {
      row.approved = 'pending';
      row.notes = 'Needs manual review';
      pending.push(row);
    }
  });

  return { approved, pending };
}

function writeCSV(rows: MediaRow[], filename: string): void {
  const header = 'slug,title,source,screenshot1,screenshot2,screenshot3,screenshot4,screenshot5,needsReview,approved,notes';

  const csvLines = rows.map(row => {
    return [
      row.slug,
      row.title,
      row.source,
      row.screenshot1,
      row.screenshot2,
      row.screenshot3,
      row.screenshot4,
      row.screenshot5,
      row.needsReview,
      row.approved,
      row.notes
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
  });

  fs.writeFileSync(filename, [header, ...csvLines].join('\n'), 'utf-8');
}

function main() {
  console.log('\n🔍 Auto-approving verified screenshots...\n');

  const content = fs.readFileSync(INPUT_CSV, 'utf-8');
  const rows = parseCSV(content);

  const { approved, pending } = autoApprove(rows);

  console.log(`Total games: ${rows.length}`);
  console.log(`Auto-approved: ${approved.length} (iTunes + Play Store)`);
  console.log(`Pending review: ${pending.length} (YouTube + Website)\n`);

  console.log('Auto-approved sources:');
  const bySource = {
    iTunes: approved.filter(r => r.source === 'iTunes').length,
    PlayStore: approved.filter(r => r.source === 'PlayStore').length
  };
  console.log(`  - iTunes: ${bySource.iTunes}`);
  console.log(`  - Play Store: ${bySource.PlayStore}\n`);

  // Write all rows to approved CSV (both approved and pending)
  writeCSV(rows, OUTPUT_CSV);
  console.log(`✅ Saved to: ${OUTPUT_CSV}\n`);

  console.log('Next steps:');
  console.log('1. Run: npm run update:media (updates games-seed.ts with approved screenshots)');
  console.log('2. Run: npm run migrate:media (updates production database)');
  console.log('3. Review pending screenshots manually in media-approved.csv\n');
}

main();
