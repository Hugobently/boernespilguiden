import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Mapping of game slugs to iTunes artwork URLs
const iconUrls: Record<string, string> = {
  'sneaky-sasquatch': 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/95/79/cc/9579ccd1-1103-ec86-3070-37823b212da3/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
  'lego-brawls': 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/1f/0f/79/1f0f7916-2fdc-8342-8814-268632dfe62f/AppIcon-1x_U007emarketing-0-8-0-85-220-0.png/512x512bb.jpg',
  'cut-the-rope-3': 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/12/e1/68/12e168a4-738c-86aa-fe78-226e2ae7421d/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg',
  'crossy-road-castle': 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/2a/aa/aa/2aaaaa88-718f-2470-4220-73ddabca9cb9/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg',
  'sonic-racing': 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/35/9e/bc/359ebc45-aee3-8c99-a3f8-b2a3a6b75346/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
  'spire-blast': 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/91/74/90/917490ed-cab2-88db-ee94-2cbb02d8e697/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
  'wylde-flowers': 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/60/69/8b/60698b4c-f44b-acf4-386d-14496a56f025/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg',
  'patterned': 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/56/3f/86/563f8656-7f4b-8406-911c-630ba594a3b0/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.jpg',
  'hello-kitty-island-adventure': 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/fa/b8/a8/fab8a8c6-74a3-789c-f7dc-20921d6ef7c4/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
  'cooking-mama-cuisine': 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/cf/50/bb/cf50bb63-77b9-4200-1d39-7996a807c960/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
  'taiko-no-tatsujin': 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/a2/5c/33/a25c33b9-cd44-c70f-9e7e-6ae6211a122e/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
  'my-talking-tom-friends': 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/8c/4b/66/8c4b664b-79f3-aca2-7c6e-41011e24582e/AppIcon-0-0-1x_U007emarketing-0-9-0-85-220.png/512x512bb.jpg',
  'the-get-out-kids': 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/9b/b5/87/9bb58729-3ebc-e578-81bd-79a72cf90ca0/AppIcon-1x_U007emarketing-0-7-0-85-220-0.png/512x512bb.jpg',
  'transformers-tactical-arena': 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/d2/1c/69/d21c69ab-c06b-16c6-5bda-80c0cd769ed2/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
  'stitch': 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/d9/55/dc/d955dce9-896e-55c2-91d7-d3ab0bc8286a/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
};

const outputDir = path.join(__dirname, '../public/images/games/digital');

console.log('Downloading Apple Arcade icons...\n');

for (const [slug, url] of Object.entries(iconUrls)) {
  const outputPath = path.join(outputDir, `${slug}.jpg`);

  try {
    // Use curl to download
    execSync(`curl -s -L -o "${outputPath}" "${url}"`, { timeout: 30000 });

    // Check file size
    const stats = fs.statSync(outputPath);
    if (stats.size > 5000) {
      console.log(`✓ Downloaded: ${slug}.jpg (${Math.round(stats.size / 1024)}KB)`);
    } else {
      console.log(`✗ Failed: ${slug}.jpg (file too small: ${stats.size} bytes)`);
      // Remove failed file
      fs.unlinkSync(outputPath);
    }
  } catch (error) {
    console.log(`✗ Error downloading ${slug}: ${error}`);
  }
}

console.log('\nDone!');
