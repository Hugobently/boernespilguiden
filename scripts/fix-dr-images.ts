/**
 * Fix DR shows with broken image URLs
 * Fetches og:image from DR website and downloads locally
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const prisma = new PrismaClient();

// Map of show slugs to their DR page URLs
const DR_SHOWS: Record<string, string> = {
  'restaurant-million': 'restaurant-million_355800',
  'soskende-chok': 'soskende-chok_207815',
  'kasper-og-sofie': 'kasper-og-sofie_238547',
  'oda-omvendt': 'oda-omvendt_35340',
  'mini-agenterne': 'mini-agenterne_533781',
  'hanna-og-rally': 'hanna-og-rally_133553',
  'elefantvask': 'elefantvask_390674',
  'sidste-nye-onkel-reje': 'det-sidste-nye-med-onkel-reje_489440',
  'onkel-reje-galaksen': 'onkel-reje-og-galaksens-helte_426014',
  'ramasjang-mysterie': 'det-store-ramasjang-mysterie_507846',
  'mysteriebureauet': 'mysteriebureauet_149634',
  'men-kasper-da': 'men-kasper-da_149626',
  'sommeren-med-far': 'sommeren-med-far_149622',
  'kevin-og-farfar': 'kevin-og-farfar_149627',
  'sol-snart-6': 'sol-snart-6-aar_132265',
  'bobbel-gaelle': 'bobbel-og-gaelles-mission_101437',
  'bella-boris-berta': 'bella-boris-og-berta_140053',
  'jagten-regnbuens-eliksir': 'jagten-paa-regnbuens-eliksir_480849',
  'klar-parat-skolestart': 'klar-parat-skolestart_463560',
  'heksebeth-hovedlose-magi': 'heksebeth-og-den-hovedlose-magi_472268',
  'motor-mille': 'motor-mille-og-bornebanden_6534',
};

const MEDIA_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'media');

// Ensure directory exists
if (!fs.existsSync(MEDIA_IMAGES_DIR)) {
  fs.mkdirSync(MEDIA_IMAGES_DIR, { recursive: true });
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

async function fetchPage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'da-DK,da;q=0.9'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function extractOgImage(html: string): string | null {
  // Look for og:image meta tag
  const match = html.match(/og:image"\s+content="([^"]+)"/);
  if (match) {
    // Decode HTML entities and modify to get poster aspect ratio
    let url = decodeHtmlEntities(match[1]);
    // Change dimensions to poster format (480x720)
    url = url.replace(/Width=\d+/, 'Width=480');
    url = url.replace(/Height=\d+/, 'Height=720');
    return url;
  }
  return null;
}

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filepath);

    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          file.close();
          downloadImage(redirectUrl, filepath).then(resolve);
          return;
        }
      }

      if (response.statusCode !== 200) {
        console.log(`    HTTP ${response.statusCode}`);
        file.close();
        resolve(false);
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    });

    request.on('error', (err) => {
      console.log(`    Error: ${err.message}`);
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      resolve(false);
    });
  });
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('=== Fixing DR Show Images ===\n');
  if (dryRun) console.log('DRY RUN - no changes will be made\n');

  // Find all media with broken dr-massive URLs
  const brokenMedia = await prisma.media.findMany({
    where: {
      posterUrl: { contains: 'dr-massive' }
    },
    select: { id: true, title: true, slug: true, posterUrl: true }
  });

  console.log(`Found ${brokenMedia.length} shows with broken DR URLs\n`);

  let fixed = 0;
  let failed = 0;

  for (const media of brokenMedia) {
    console.log(`${media.title} (${media.slug})`);

    const drPath = DR_SHOWS[media.slug];
    if (!drPath) {
      console.log(`  ⚠️  No DR URL mapping for this slug`);
      failed++;
      continue;
    }

    const drUrl = `https://www.dr.dk/drtv/serie/${drPath}`;
    console.log(`  Fetching: ${drUrl}`);

    try {
      const html = await fetchPage(drUrl);
      const imageUrl = extractOgImage(html);

      if (!imageUrl) {
        console.log(`  ❌ Could not find og:image`);
        failed++;
        continue;
      }

      console.log(`  Found image URL`);

      if (dryRun) {
        console.log(`  ✓ Would download`);
        fixed++;
        continue;
      }

      // Download image
      const filename = `${media.slug}.jpg`;
      const filepath = path.join(MEDIA_IMAGES_DIR, filename);

      const success = await downloadImage(imageUrl, filepath);
      if (!success) {
        console.log(`  ❌ Download failed`);
        failed++;
        continue;
      }

      // Verify file size
      const stats = fs.statSync(filepath);
      if (stats.size < 1000) {
        console.log(`  ❌ Image too small (${stats.size} bytes)`);
        fs.unlinkSync(filepath);
        failed++;
        continue;
      }

      console.log(`  Downloaded: ${Math.round(stats.size / 1024)}KB`);

      // Update database
      const localUrl = `/images/media/${filename}`;
      await prisma.media.update({
        where: { id: media.id },
        data: { posterUrl: localUrl }
      });

      console.log(`  ✅ Updated to: ${localUrl}`);
      fixed++;

      // Be nice to DR servers
      await new Promise(r => setTimeout(r, 300));

    } catch (err: any) {
      console.log(`  ❌ Error: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n=== Results ===`);
  console.log(`✅ Fixed: ${fixed}`);
  console.log(`❌ Failed: ${failed}`);

  await prisma.$disconnect();
}

main().catch(console.error);
