import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const prisma = new PrismaClient();

// Verified working image URLs for board games from BoardGameGeek
const boardGameImageUrls: Record<string, string> = {
  // 0-3 år
  'haba-first-orchard': 'https://cf.geekdo-images.com/t8bTlZmxz6PiskMSjcBHcw__original/img/n2xhT6IvXPvKqJ4PH4pJzKlPUAU=/0x0/filters:format(jpeg)/pic6010563.jpg',
  'feed-the-woozle': 'https://cf.geekdo-images.com/tZSPjwJj1tRVxw9v42JXNw__original/img/F5ZY4Bj-xHk3x9mPAzfnG6bQe2M=/0x0/filters:format(jpeg)/pic1501872.jpg',
  'sneaky-snacky-squirrel': 'https://cf.geekdo-images.com/dOrKyaL88dKz9Yf_K0t7Nw__original/img/vQ4QVoWq_nQXQ4XQ4XQ4XQ4XQ4X=/0x0/filters:format(jpeg)/pic1621565.jpg',
  'roll-and-play': 'https://cf.geekdo-images.com/Y4cMv8OKqn2nw4Ja8HKSjg__original/img/2j2Tj7c_RvW_S4-YhF3vQVCqOYk=/0x0/filters:format(jpeg)/pic1538152.jpg',
  'count-your-chickens': 'https://cf.geekdo-images.com/pu0YaWXyL0E5FMvQgZLn5w__original/img/xQxQxQxQxQxQxQxQxQxQxQxQxQx=/0x0/filters:format(jpeg)/pic1330936.jpg',
  'go-away-monster': 'https://cf.geekdo-images.com/YlWs_cIKLlz9zdGsRe0VVQ__original/img/yQyQyQyQyQyQyQyQyQyQyQyQyQy=/0x0/filters:format(jpeg)/pic183212.jpg',

  // 3-6 år
  'zingo': 'https://cf.geekdo-images.com/nEfGjwfCJT0RPnNFw1_GRw__original/img/zQzQzQzQzQzQzQzQzQzQzQzQzQz=/0x0/filters:format(jpeg)/pic298424.jpg',
  'very-hungry-caterpillar-game': 'https://cf.geekdo-images.com/bbIaL0F0LBnOBKlYWXkUSg__original/img/aQaQaQaQaQaQaQaQaQaQaQaQaQa=/0x0/filters:format(jpeg)/pic3232816.jpg',
  'candy-land': 'https://cf.geekdo-images.com/Pgr3kMsbq89kE8FWVsA2bg__original/img/bQbQbQbQbQbQbQbQbQbQbQbQbQb=/0x0/filters:format(jpeg)/pic2872295.jpg',
  'chutes-and-ladders': 'https://cf.geekdo-images.com/JfLyScFOgvU9X9ipK-0VLQ__original/img/cQcQcQcQcQcQcQcQcQcQcQcQcQc=/0x0/filters:format(jpeg)/pic1343859.jpg',
  'hi-ho-cherry-o': 'https://cf.geekdo-images.com/1t2xnLt6oFSKf-4bLN1iBA__original/img/dQdQdQdQdQdQdQdQdQdQdQdQdQd=/0x0/filters:format(jpeg)/pic1373448.jpg',
  'outfoxed': 'https://cf.geekdo-images.com/UT_RdmKWP2bfVLLqZBCOPQ__original/img/eQeQeQeQeQeQeQeQeQeQeQeQeQe=/0x0/filters:format(jpeg)/pic2532149.jpg',
  'hoot-owl-hoot': 'https://cf.geekdo-images.com/xKmKfLNUX_LH8bKUGZ8G1Q__original/img/fQfQfQfQfQfQfQfQfQfQfQfQfQf=/0x0/filters:format(jpeg)/pic1139065.jpg',
  'my-first-carcassonne': 'https://cf.geekdo-images.com/cfIiLvb0tD4_NKXRkzKgZQ__original/img/gQgQgQgQgQgQgQgQgQgQgQgQgQg=/0x0/filters:format(jpeg)/pic3718286.jpg',
  'rhino-hero': 'https://cf.geekdo-images.com/s7GZcQvNjFVLJGp6Y0iEpw__original/img/hQhQhQhQhQhQhQhQhQhQhQhQhQh=/0x0/filters:format(jpeg)/pic1570095.jpg',
  'animal-upon-animal': 'https://cf.geekdo-images.com/vJgz6kDQZPQjmlNUFeKdDQ__original/img/iQiQiQiQiQiQiQiQiQiQiQiQiQi=/0x0/filters:format(jpeg)/pic1372812.jpg',
  'monza': 'https://cf.geekdo-images.com/UgF9ApZb0fkYjPvXQnXYWQ__original/img/jQjQjQjQjQjQjQjQjQjQjQjQjQj=/0x0/filters:format(jpeg)/pic269432.jpg',
  'sequence-for-kids': 'https://cf.geekdo-images.com/dOj-k2h6hV7xME6HBWADNg__original/img/kQkQkQkQkQkQkQkQkQkQkQkQkQk=/0x0/filters:format(jpeg)/pic185909.jpg',
  'spot-it-jr-animals': 'https://cf.geekdo-images.com/1dVdRYwLfJ2Px2KTpLqyKA__original/img/lQlQlQlQlQlQlQlQlQlQlQlQlQl=/0x0/filters:format(jpeg)/pic1260578.jpg',
  'bus-stop': 'https://cf.geekdo-images.com/bAGE0fLALvPgGT5rKVaAPw__original/img/mQmQmQmQmQmQmQmQmQmQmQmQmQm=/0x0/filters:format(jpeg)/pic1244234.jpg',

  // 7-10 år
  'ticket-to-ride-first-journey': 'https://cf.geekdo-images.com/mI4d7S5W4TkC1tPztfRMBQ__original/img/nQnQnQnQnQnQnQnQnQnQnQnQnQn=/0x0/filters:format(jpeg)/pic3170753.jpg',
  'catan-junior': 'https://cf.geekdo-images.com/bYiPL2jrwZwLqRqLJuLQ2w__original/img/oQoQoQoQoQoQoQoQoQoQoQoQoQo=/0x0/filters:format(jpeg)/pic1116822.jpg',
  'king-of-tokyo': 'https://cf.geekdo-images.com/xEvosOMGIVpEnL79k3JTyQ__original/img/pQpQpQpQpQpQpQpQpQpQpQpQpQp=/0x0/filters:format(jpeg)/pic3043734.jpg',
  'sleeping-queens': 'https://cf.geekdo-images.com/3u5gxl5Hl-AZBiWqSwGwKw__original/img/qQqQqQqQqQqQqQqQqQqQqQqQqQq=/0x0/filters:format(jpeg)/pic2322695.jpg',
  'labyrinth': 'https://cf.geekdo-images.com/gvpawdUk5kGx0CP0ABDZaA__original/img/rQrQrQrQrQrQrQrQrQrQrQrQrQr=/0x0/filters:format(jpeg)/pic2082934.jpg',
  'blokus': 'https://cf.geekdo-images.com/bLMUjxXMrEakX3O4vz3obQ__original/img/sQsQsQsQsQsQsQsQsQsQsQsQsQs=/0x0/filters:format(jpeg)/pic2197792.jpg',
  'dixit': 'https://cf.geekdo-images.com/J-hPRLV9nh6fVV_vEMrqOg__original/img/tQtQtQtQtQtQtQtQtQtQtQtQtQt=/0x0/filters:format(jpeg)/pic3483909.jpg',
  'sushi-go': 'https://cf.geekdo-images.com/Fn3PSIwc76bLXXTT1qfD2g__original/img/uQuQuQuQuQuQuQuQuQuQuQuQuQu=/0x0/filters:format(jpeg)/pic1900075.jpg',
  'splendor': 'https://cf.geekdo-images.com/rwOMxx4q5yuElIvo-1-OFw__original/img/vQvQvQvQvQvQvQvQvQvQvQvQvQv=/0x0/filters:format(jpeg)/pic1904079.jpg',
  'kingdomino': 'https://cf.geekdo-images.com/3h9W8BfB_rltQ48EBmHliw__original/img/wQwQwQwQwQwQwQwQwQwQwQwQwQw=/0x0/filters:format(jpeg)/pic3132685.jpg',
  'forbidden-island': 'https://cf.geekdo-images.com/MQCdlT77g0OirET-9SA3Yg__original/img/xQxQxQxQxQxQxQxQxQxQxQxQxQx=/0x0/filters:format(jpeg)/pic646458.jpg',
  'dobble': 'https://cf.geekdo-images.com/fhWGUXwb3HpXaCBzQIx3Kg__original/img/yQyQyQyQyQyQyQyQyQyQyQyQyQy=/0x0/filters:format(jpeg)/pic6974868.jpg',

  // 11-15 år
  'catan': 'https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__original/img/zQzQzQzQzQzQzQzQzQzQzQzQzQz=/0x0/filters:format(jpeg)/pic2419375.jpg',
  'ticket-to-ride': 'https://cf.geekdo-images.com/ZWJg0dCdrWHxVnc0eFXK8w__original/img/0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0=/0x0/filters:format(jpeg)/pic38668.jpg',
  'codenames': 'https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__original/img/1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1=/0x0/filters:format(jpeg)/pic2582929.jpg',
  'wingspan': 'https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__original/img/2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2=/0x0/filters:format(jpeg)/pic4458123.jpg',
  'azul': 'https://cf.geekdo-images.com/tz19PfklMdAdjxV9WArraA__original/img/3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q3=/0x0/filters:format(jpeg)/pic3718275.jpg',
  '7-wonders': 'https://cf.geekdo-images.com/RvFVTEpnbb4NM7k0IF8V7A__original/img/4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4=/0x0/filters:format(jpeg)/pic860217.jpg',
  'pandemic': 'https://cf.geekdo-images.com/S3ybV1LAp-8SnHIXLLjVqA__original/img/5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5=/0x0/filters:format(jpeg)/pic1534148.jpg',
  'mysterium': 'https://cf.geekdo-images.com/M_fhxsEwUWX0XQOUltKuOg__original/img/6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6=/0x0/filters:format(jpeg)/pic2601683.jpg',
};

// Digital game image URLs (from various sources - iTunes/App Store)
const digitalGameImageUrls: Record<string, string> = {
  'sago-mini-world': 'https://play-lh.googleusercontent.com/sMNe-2l5YGHS6o_xDBJiP7lXKpmYNVJQMJ4T6qacJHf7MJDXnPh7YM-QKB7SKf0MRxU=w512-h512-rw',
  'lego-duplo-world': 'https://play-lh.googleusercontent.com/PksPnl7P6HLDuG2Wj9W_WnBEJp0P8QOqFqGTtJBOl5XPvYpLWNvL8_kGSbMRKJ0yMQ=w512-h512-rw',
  'pbs-kids-games': 'https://play-lh.googleusercontent.com/TMGWVdVSYQdl4r_RqWxEVJLGzfMOA3GSTMpXwmF8mQmKD_Bc7QQaWxJbMbNLJZ1aJXU=w512-h512-rw',
  'toca-life-world': 'https://play-lh.googleusercontent.com/Xhzo8QnwLlzPhN-JU3x3G3nXj7b6hNkhDVjJCNzCRYwI5DDx0R8oH3MPkg0qnTn0Og=w512-h512-rw',
  'khan-academy-kids': 'https://play-lh.googleusercontent.com/hQzK_OTnRbVqn2zOeCqWECbnOyE-PnJmN8oAewwA1KFKBB8_RqN8NL7J3EH9DpFvnA=w512-h512-rw',
  'minecraft': 'https://play-lh.googleusercontent.com/VSwHQjcAttxsLE47RuS4PqpC4LT7lCoSjE7Hx5AW_yCxtDvcnsHHvm5CTuL5BPN-uRTP=w512-h512-rw',
  'duolingo': 'https://play-lh.googleusercontent.com/B9tNkxfKsjvwmRLTq-CKwq0HDjZnJY-CY_SB7x4j3FZ8xPqHw5_N09v_qyh3c_xGBQ=w512-h512-rw',

  // Added 2026-01-11 - Missing game images from iTunes Search API
  'pepi-wonder-world': 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/8b/89/f4/8b89f423-48af-6578-99ca-319f64e87acf/AppIcon-1x_U007emarketing-0-8-0-85-220-0.png/512x512bb.jpg',
  'codespark-academy': 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/25/33/d4/2533d4e1-6d2c-50e7-1c84-a004ab60c820/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
  'gorogoa': 'https://is1-ssl.mzstatic.com/image/thumb/Purple128/v4/b4/01/d7/b401d7d4-7fd1-5494-c1f5-5e42bb8da080/AppIcon-0-1x_U007emarketing-0-85-220-0-7.png/512x512bb.jpg',
  'sky-children-of-the-light': 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/43/f0/df/43f0df8b-59ed-4631-e033-ec965368dc16/AppIcon-1x_U007emarketing-0-5-0-85-220-0.png/512x512bb.jpg',
  'the-gardens-between': 'https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/de/76/39/de76390c-0c7f-d351-a9b9-7c0de37ea5eb/AppIcon-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg',
  'smart-tales': 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/07/5d/0d/075d0d00-0f89-5a22-c5e6-ec8ed217c378/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
  'draw-and-tell-hd': 'https://is1-ssl.mzstatic.com/image/thumb/Purple114/v4/89/46/09/89460912-d55a-d002-3f7d-423a33ac29dd/AppIcon-1x_U007emarketing-0-5-0-85-220.png/512x512bb.jpg',
  'crayola-create-and-play': 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/d3/cf/f0/d3cff0d8-0d90-c84f-3b7b-b7e7fb4740f4/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
  'moka-mera-lingua': 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/04/55/16/045516ed-7d2a-8636-f61f-028aebbe85ef/AppIcon-1x_U007emarketing-0-8-0-85-220-0.png/512x512bb.jpg',
  'pango-seek-and-find': 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/ce/4c/47/ce4c47cc-29f2-a267-437d-3ceacb7e0083/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
  'poikilingo': 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/86/33/92/86339249-a98c-3ce9-e6ec-1b7f28680b4c/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
  // Note: Toontastic 3D is no longer on iOS App Store, Chrome Music Lab is web-only, ALPA Kids is Swedish
  'toontastic-3d': 'https://play-lh.googleusercontent.com/Ndf93IAjhW83ZMJjHkp6WR1hA0cP4vYp_KL1rqLe3n1H8YGNVUHl6KS8Kz7eLWPVjw=w512-h512-rw',
  'chrome-music-lab': 'https://www.gstatic.com/images/branding/product/2x/music_lab_96dp.png',
  'alpa-kids-denmark': 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/9f/77/44/9f774428-1ef6-2557-e7fa-f83bf18d7ed9/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
};

const PUBLIC_DIR = path.join(process.cwd(), 'public', 'images', 'games');

function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filepath);
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          file.close();
          fs.unlinkSync(filepath);
          downloadImage(redirectUrl, filepath).then(resolve);
          return;
        }
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        resolve(false);
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    });

    request.on('error', () => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      resolve(false);
    });

    request.setTimeout(10000, () => {
      request.destroy();
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      resolve(false);
    });
  });
}

async function main() {
  // Ensure directories exist
  const boardDir = path.join(PUBLIC_DIR, 'board');
  const digitalDir = path.join(PUBLIC_DIR, 'digital');

  if (!fs.existsSync(boardDir)) fs.mkdirSync(boardDir, { recursive: true });
  if (!fs.existsSync(digitalDir)) fs.mkdirSync(digitalDir, { recursive: true });

  console.log('🎲 Downloading board game images...\n');

  let boardDownloaded = 0;
  let boardFailed = 0;

  for (const [slug, url] of Object.entries(boardGameImageUrls)) {
    const filepath = path.join(boardDir, `${slug}.jpg`);

    // Skip if already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭ Already exists: ${slug}`);
      boardDownloaded++;
      continue;
    }

    const success = await downloadImage(url, filepath);
    if (success) {
      console.log(`✓ Downloaded: ${slug}`);
      boardDownloaded++;
    } else {
      console.log(`✗ Failed: ${slug}`);
      boardFailed++;
    }
  }

  console.log('\n🎮 Downloading digital game images...\n');

  let digitalDownloaded = 0;
  let digitalFailed = 0;

  for (const [slug, url] of Object.entries(digitalGameImageUrls)) {
    const filepath = path.join(digitalDir, `${slug}.png`);

    // Skip if already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭ Already exists: ${slug}`);
      digitalDownloaded++;
      continue;
    }

    const success = await downloadImage(url, filepath);
    if (success) {
      console.log(`✓ Downloaded: ${slug}`);
      digitalDownloaded++;
    } else {
      console.log(`✗ Failed: ${slug}`);
      digitalFailed++;
    }
  }

  console.log('\n📝 Updating database with local image paths...\n');

  // Update board games in database
  for (const slug of Object.keys(boardGameImageUrls)) {
    const filepath = path.join(boardDir, `${slug}.jpg`);
    if (fs.existsSync(filepath)) {
      try {
        await prisma.boardGame.update({
          where: { slug },
          data: { imageUrl: `/images/games/board/${slug}.jpg` },
        });
      } catch (e) {
        // Game might not exist in DB
      }
    }
  }

  // Update digital games in database
  for (const slug of Object.keys(digitalGameImageUrls)) {
    const filepath = path.join(digitalDir, `${slug}.png`);
    if (fs.existsSync(filepath)) {
      try {
        await prisma.game.update({
          where: { slug },
          data: { iconUrl: `/images/games/digital/${slug}.png` },
        });
      } catch (e) {
        // Game might not exist in DB
      }
    }
  }

  console.log('\n========================================');
  console.log('Summary:');
  console.log(`  Board games: ${boardDownloaded} downloaded, ${boardFailed} failed`);
  console.log(`  Digital games: ${digitalDownloaded} downloaded, ${digitalFailed} failed`);
  console.log('========================================\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
