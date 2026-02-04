/**
 * Fix Icon URL Mismatches
 *
 * This script finds games where the iconUrl in games-seed.ts references
 * a file extension that doesn't exist, and updates it to match the actual file.
 */

import * as fs from 'fs';
import * as path from 'path';

const SEED_FILE = path.join(process.cwd(), 'data', 'games-seed.ts');
const DIGITAL_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'games', 'digital');
const BOARD_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'games', 'board');

interface Mismatch {
  slug: string;
  referencedUrl: string;
  actualFile: string | null;
  suggestedUrl: string | null;
}

function findActualFile(slug: string, type: 'digital' | 'board'): string | null {
  const dir = type === 'digital' ? DIGITAL_IMAGES_DIR : BOARD_IMAGES_DIR;
  const extensions = ['.webp', '.jpg', '.jpeg', '.png', '.svg'];

  for (const ext of extensions) {
    const filePath = path.join(dir, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      return `/images/games/${type}/${slug}${ext}`;
    }
  }

  return null;
}

function findMismatches(): Mismatch[] {
  const content = fs.readFileSync(SEED_FILE, 'utf-8');
  const mismatches: Mismatch[] = [];

  // Pattern to find iconUrl references
  const iconUrlPattern = /slug:\s*"([^"]+)"[\s\S]*?iconUrl:\s*"\/images\/games\/(digital|board)\/([^"]+)"/g;

  let match;
  while ((match = iconUrlPattern.exec(content)) !== null) {
    const slug = match[1];
    const type = match[2] as 'digital' | 'board';
    const referencedFile = match[3];
    const referencedUrl = `/images/games/${type}/${referencedFile}`;

    // Check if the referenced file exists
    const filePath = path.join(process.cwd(), 'public', referencedUrl);

    if (!fs.existsSync(filePath)) {
      // File doesn't exist - find the actual file
      const actualUrl = findActualFile(slug, type);

      mismatches.push({
        slug,
        referencedUrl,
        actualFile: actualUrl,
        suggestedUrl: actualUrl
      });
    }
  }

  return mismatches;
}

function fixMismatches(mismatches: Mismatch[]): void {
  let content = fs.readFileSync(SEED_FILE, 'utf-8');
  let fixCount = 0;

  for (const mismatch of mismatches) {
    if (mismatch.suggestedUrl) {
      // Replace the old URL with the new one
      const oldPattern = new RegExp(
        `(slug:\\s*"${mismatch.slug}"[\\s\\S]*?iconUrl:\\s*)"${mismatch.referencedUrl.replace(/\//g, '\\/')}"`,
        'g'
      );

      const replacement = `$1"${mismatch.suggestedUrl}"`;
      const beforeReplace = content;
      content = content.replace(oldPattern, replacement);

      if (content !== beforeReplace) {
        fixCount++;
        console.log(`✓ Fixed ${mismatch.slug}: ${mismatch.referencedUrl} → ${mismatch.suggestedUrl}`);
      }
    } else {
      console.log(`⚠️  No file found for ${mismatch.slug} (referenced: ${mismatch.referencedUrl})`);
    }
  }

  if (fixCount > 0) {
    fs.writeFileSync(SEED_FILE, content, 'utf-8');
    console.log(`\n✅ Fixed ${fixCount} icon URL mismatches`);
  } else {
    console.log('\n✅ No fixes needed');
  }
}

function main() {
  console.log('\n🔍 Finding icon URL mismatches...\n');

  const mismatches = findMismatches();

  if (mismatches.length === 0) {
    console.log('✅ All icon URLs match existing files!\n');
    return;
  }

  console.log(`Found ${mismatches.length} mismatches:\n`);

  mismatches.forEach((m, i) => {
    console.log(`${i + 1}. ${m.slug}`);
    console.log(`   Referenced: ${m.referencedUrl}`);
    console.log(`   Actual:     ${m.actualFile || 'NOT FOUND'}\n`);
  });

  console.log('\n🔧 Applying fixes...\n');
  fixMismatches(mismatches);
}

main();
