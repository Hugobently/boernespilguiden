/**
 * Fix missing board game images
 * Downloads from BoardGameGeek API
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const BOARD_DIR = path.join(process.cwd(), 'public', 'images', 'games', 'board');

// BoardGameGeek IDs for the missing games
const BGG_IDS: Record<string, number> = {
  'dragomino': 300010,
  'cascadia-junior': 365717,
  'topp-die-torte': 350527,
  'foxy': 316552,
  'splendor-kids': 0, // Need to find
  'micromacro-kids-crazy-city-park': 368815,
  'zombie-kidz-evolution': 256952,
  'zombie-teenz-evolution': 299867,
  'the-crew-family-adventure': 0, // Need to find
  'exit-kids-midnight-spooktacular': 0, // Need to find
  'danmarksspillet': 0, // Danish-only
  'ziggurat': 0, // Need to find
  'finspan': 0, // Need to find
};

// Alternative image URLs for games not on BGG
const MANUAL_URLS: Record<string, string> = {
  'danmarksspillet': 'https://www.legekrogen.dk/media/catalog/product/cache/2/image/700x700/17f82f742ffe127f42dca9de82fb58b1/d/a/danmarksspillet.jpg',
};

async function fetchBGGImage(bggId: number): Promise<string | null> {
  return new Promise((resolve) => {
    const url = `https://boardgamegeek.com/xmlapi2/thing?id=${bggId}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Extract image URL from XML
        const match = data.match(/<image>([^<]+)<\/image>/);
        if (match) {
          resolve(match[1]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function searchBGG(term: string): Promise<{ id: number; name: string } | null> {
  return new Promise((resolve) => {
    const url = `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(term)}&type=boardgame`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Extract first result
        const idMatch = data.match(/<item type="boardgame" id="(\d+)">/);
        const nameMatch = data.match(/<name type="primary" value="([^"]+)"/);
        if (idMatch && nameMatch) {
          resolve({ id: parseInt(idMatch[1]), name: nameMatch[1] });
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filepath);

    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        if (response.headers.location) {
          downloadImage(response.headers.location, filepath).then(resolve);
        } else {
          resolve(false);
        }
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        resolve(false);
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(filepath);
        if (stats.size < 1000) {
          fs.unlinkSync(filepath);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    }).on('error', () => {
      file.close();
      resolve(false);
    });
  });
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('=== Fixing Board Game Images ===\n');
  if (dryRun) console.log('DRY RUN - no changes will be made\n');

  // Find missing board game images
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  const boardGames = await prisma.boardGame.findMany({
    select: { id: true, title: true, slug: true }
  });

  const missing: { title: string; slug: string }[] = [];
  for (const game of boardGames) {
    const hasJpg = fs.existsSync(path.join(BOARD_DIR, `${game.slug}.jpg`));
    const hasPng = fs.existsSync(path.join(BOARD_DIR, `${game.slug}.png`));
    if (!hasJpg && !hasPng) {
      missing.push({ title: game.title, slug: game.slug });
    }
  }

  console.log(`Found ${missing.length} board games without images\n`);

  let fixed = 0;
  let failed = 0;
  const failedGames: string[] = [];

  for (const game of missing) {
    console.log(`${game.title} (${game.slug})`);

    let imageUrl: string | null = null;

    // Check manual URLs first
    if (MANUAL_URLS[game.slug]) {
      imageUrl = MANUAL_URLS[game.slug];
      console.log(`  Using manual URL`);
    }
    // Check if we have a BGG ID
    else if (BGG_IDS[game.slug] && BGG_IDS[game.slug] > 0) {
      console.log(`  Fetching from BGG ID: ${BGG_IDS[game.slug]}`);
      imageUrl = await fetchBGGImage(BGG_IDS[game.slug]);
    }
    // Search BGG
    else {
      console.log(`  Searching BGG for: "${game.title}"`);
      const result = await searchBGG(game.title);
      if (result) {
        console.log(`  Found: ${result.name} (ID: ${result.id})`);
        imageUrl = await fetchBGGImage(result.id);
      }
    }

    if (!imageUrl) {
      console.log(`  ❌ No image found`);
      failedGames.push(game.slug);
      failed++;
      continue;
    }

    console.log(`  Image: ${imageUrl.substring(0, 60)}...`);

    if (dryRun) {
      fixed++;
      continue;
    }

    // Download image
    const filepath = path.join(BOARD_DIR, `${game.slug}.jpg`);
    const success = await downloadImage(imageUrl, filepath);

    if (success) {
      const stats = fs.statSync(filepath);
      console.log(`  ✅ Downloaded: ${Math.round(stats.size / 1024)}KB`);
      fixed++;
    } else {
      console.log(`  ❌ Download failed`);
      failedGames.push(game.slug);
      failed++;
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n=== Results ===`);
  console.log(`✅ Fixed: ${fixed}`);
  console.log(`❌ Failed: ${failed}`);

  if (failedGames.length > 0) {
    console.log(`\nFailed games:`);
    failedGames.forEach(g => console.log(`  - ${g}`));
  }

  await prisma.$disconnect();
}

main().catch(console.error);
