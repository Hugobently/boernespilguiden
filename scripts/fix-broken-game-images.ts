/**
 * Fix broken game images using iTunes Search API
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const DIGITAL_DIR = path.join(process.cwd(), 'public', 'images', 'games', 'digital');

// Manual search terms for games that need special handling
// Manual image URLs for games not on iTunes
const MANUAL_URLS: Record<string, string> = {
  'taiko-no-tatsujin-pop-tap-beat': 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Taiko_no_Tatsujin_game_logo.svg/512px-Taiko_no_Tatsujin_game_logo.svg.png',
  'teach-your-monster-to-read': 'https://play-lh.googleusercontent.com/KhtM_MwM-MgKhTCQbGNjjvZz2GQNwMpGhLhMgRXzQRxNHXqUGT7xB7R_8H8RqiX7wno=w512',
  'temple-run': 'https://play-lh.googleusercontent.com/XH-Z9CfeJ4WXB6-GmLnNQB35Q4HYQ5CQ5gIXxT_Kh_xE4MYTKBaLPfQnFQN_IfC_YYc=w512',
  'thinkrolls': 'https://play-lh.googleusercontent.com/t_aP8u8OD9K7n7xQh7Cw9QvEYIkO9Rgt_W-S9vKnJc-Y1Ws9gv3KEwEDkVMJN0nAJQ=w512',
  'toontastic-3d': 'https://play-lh.googleusercontent.com/YFTO8KeHkZtKRuN_JPJX8BqJLqXq5K6vR5qT9YJHX0c-2gXhQx5lLN1bxOQ5u0xTxA=w512',
  'tynker': 'https://play-lh.googleusercontent.com/qX4u-1KCwZKX1D8gLjX5J8-RN-9bQwTxXwFGP8xKJKZ6d4cFDN4o8QkxT_5KJxQvKA=w512',
};

const SEARCH_OVERRIDES: Record<string, string> = {
  'abcmouse': 'ABCmouse',
  'khan-academy-kids': 'Khan Academy Kids',
  'duolingo': 'Duolingo ABC',
  'brainpop-jr': 'BrainPOP Jr Movie',
  'splashlearn': 'SplashLearn Kids Math',
  'homer': 'Homer Learn Read',
  'prodigy-math': 'Prodigy Math Game',
  'scratchjr': 'ScratchJr',
  'codemonkey': 'CodeMonkey Jr',
  'hopscotch': 'Hopscotch coding',
  'tynker': 'Tynker coding',
  'dragonbox-algebra': 'DragonBox Algebra',
  'dragonbox-numbers': 'DragonBox Numbers',
  'monument-valley-2': 'Monument Valley 2',
  'the-room': 'The Room puzzle',
  'thinkrolls': 'Thinkrolls',
  'osmo-coding': 'Osmo Coding',
  'peekaboo-barn': 'Peekaboo Barn',
  'daniel-tigers-neighborhood': 'Daniel Tiger Neighborhood',
  'dr-panda': 'Dr Panda Town',
  'baby-shark-world': 'Baby Shark World',
  'bluey-lets-play': 'Bluey Let\'s Play',
  'bluey-the-videogame': 'Bluey The Videogame',
  'peppa-pig-world-adventures': 'Peppa Pig World Adventures',
  'toca-life-world': 'Toca Life World',
  'toca-life-town': 'Toca Life Town',
  'toca-kitchen-2': 'Toca Kitchen 2',
  'toca-hair-salon-4': 'Toca Hair Salon 4',
  'angry-birds': 'Angry Birds Reloaded',
  'subway-surfers': 'Subway Surfers',
  'temple-run': 'Temple Run',
  'bloons-td-6': 'Bloons TD 6',
  'wheres-my-water': 'Where\'s My Water',
  'human-fall-flat': 'Human Fall Flat',
  'minecraft': 'Minecraft',
  'super-mario-bros': 'Super Mario Run',
  'pokemon-sword': 'Pokemon',
  'factorio': 'Factorio',
  'geoguessr': 'GeoGuessr',
  'endless-alphabet': 'Endless Alphabet',
  'lingokids': 'Lingokids',
  'toontastic-3d': 'Toontastic 3D',
  'altos-odyssey-lost-city': 'Alto\'s Odyssey',
  'taiko-no-tatsujin-pop-tap-beat': 'Taiko no Tatsujin',
  'adventure-academy': 'Adventure Academy',
  'human-resource-machine': 'Human Resource Machine',
  'mini-metro': 'Mini Metro',
  'lightbot-code-hour': 'Lightbot',
  'teach-your-monster-to-read': 'Teach Monster Read',
};

async function findBrokenFiles(): Promise<string[]> {
  const files = fs.readdirSync(DIGITAL_DIR);
  const broken: string[] = [];

  for (const file of files) {
    if (!file.endsWith('.jpg') && !file.endsWith('.png') && !file.endsWith('.webp')) continue;

    const filepath = path.join(DIGITAL_DIR, file);
    const content = fs.readFileSync(filepath);

    // Check if it's a real image
    const isPng = content[0] === 0x89 && content[1] === 0x50;
    const isJpeg = content[0] === 0xFF && content[1] === 0xD8;
    const isWebp = content.length > 12 && content.slice(0, 4).toString() === 'RIFF';

    if (!isPng && !isJpeg && !isWebp) {
      broken.push(file);
    }
  }

  return broken;
}

async function searchITunes(term: string): Promise<string | null> {
  return new Promise((resolve) => {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=software&limit=5&country=us`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.results && json.results.length > 0) {
            let iconUrl = json.results[0].artworkUrl512 || json.results[0].artworkUrl100;
            if (iconUrl) {
              // Get 512x512 resolution
              iconUrl = iconUrl.replace(/\d+x\d+bb/, '512x512bb');
              resolve(iconUrl);
              return;
            }
          }
          resolve(null);
        } catch (e) {
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
        // Verify it's a real image
        const content = fs.readFileSync(filepath);
        const isPng = content[0] === 0x89 && content[1] === 0x50;
        const isJpeg = content[0] === 0xFF && content[1] === 0xD8;
        if (!isPng && !isJpeg && content.length < 1000) {
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

  console.log('=== Fixing Broken Game Images ===\n');
  if (dryRun) console.log('DRY RUN - no changes will be made\n');

  const brokenFiles = await findBrokenFiles();
  console.log(`Found ${brokenFiles.length} broken image files\n`);

  let fixed = 0;
  let failed = 0;
  const failedGames: string[] = [];

  for (const file of brokenFiles) {
    const slug = file.replace(/\.(jpg|png|webp)$/, '');

    console.log(`${slug}`);

    // Check manual URLs first
    let imageUrl: string | null = MANUAL_URLS[slug] || null;
    if (imageUrl) {
      console.log(`  Using manual URL`);
    } else {
      // Get search term
      const searchTerm = SEARCH_OVERRIDES[slug] || slug.replace(/-/g, ' ');
      console.log(`  Searching: "${searchTerm}"`);
      imageUrl = await searchITunes(searchTerm);
    }

    if (!imageUrl) {
      console.log(`  ❌ Not found on iTunes`);
      failedGames.push(slug);
      failed++;
      continue;
    }

    console.log(`  Found: ${imageUrl.substring(0, 70)}...`);

    if (dryRun) {
      fixed++;
      continue;
    }

    // Delete broken file
    const oldPath = path.join(DIGITAL_DIR, file);
    fs.unlinkSync(oldPath);

    // Download new image
    const newPath = path.join(DIGITAL_DIR, `${slug}.jpg`);
    const success = await downloadImage(imageUrl, newPath);

    if (success) {
      const stats = fs.statSync(newPath);
      console.log(`  ✅ Downloaded: ${Math.round(stats.size / 1024)}KB`);
      fixed++;
    } else {
      console.log(`  ❌ Download failed`);
      failedGames.push(slug);
      failed++;
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n=== Results ===`);
  console.log(`✅ Fixed: ${fixed}`);
  console.log(`❌ Failed: ${failed}`);

  if (failedGames.length > 0) {
    console.log(`\nFailed games (need manual images):`);
    failedGames.forEach(g => console.log(`  - ${g}`));
  }
}

main().catch(console.error);
