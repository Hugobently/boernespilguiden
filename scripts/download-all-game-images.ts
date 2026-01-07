import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const PUBLIC_DIR = path.join(process.cwd(), 'public', 'images', 'games');

// Verified BoardGameGeek original image URLs for board games
const boardGameImages: Record<string, string> = {
  // Games with only SVG (need real images) - verified URLs from BGG
  'animal-upon-animal': 'https://cf.geekdo-images.com/5RHnNYBqmNXYvDtIeJw3pA__original/img/v7h5wg2n4hEuvZWnP7l1XHYVA94=/0x0/filters:format(jpeg)/pic403502.jpg',
  'bluey-board-game': 'https://cf.geekdo-images.com/Fbe9yAKM8v-m7wvy2ITi7A__original/img/NvA0EvKVb7J9dLc7L9i_4zKVXYc=/0x0/filters:format(jpeg)/pic5976443.jpg',
  'bus-stop': 'https://cf.geekdo-images.com/m2bxEEzGhKbTSPXlyPXq6w__original/img/z9tNrwBxCHYjEZLV2dJGE6nKwc0=/0x0/filters:format(jpeg)/pic94284.jpg',
  'castle-panic': 'https://cf.geekdo-images.com/ryPiCH15spkrdtvUI-utuA__original/img/vJPM1hXb_5GCX4EI6hpPqRhB2iU=/0x0/filters:format(jpeg)/pic6966125.jpg',
  'catan-junior': 'https://cf.geekdo-images.com/t2L_dlodn04yyS7CmwnREQ__original/img/vC7JYG1EPMbZCzNXJUJRu1IhwAk=/0x0/filters:format(jpeg)/pic4741220.jpg',
  'count-your-chickens': 'https://cf.geekdo-images.com/ldVO4Au6YvPFrMk2h0V7rA__original/img/vIQ7F6L4JlQR1PGy_L4b6YzxKvc=/0x0/filters:format(jpeg)/pic964069.jpg',
  'feed-the-woozle': 'https://cf.geekdo-images.com/FDxZC3Px7jb0t11pXNR0eQ__original/img/IK3z0-T5VJrT5TY9F5TzPhf5Yj0=/0x0/filters:format(jpeg)/pic1467097.jpg',
  'go-away-monster': 'https://cf.geekdo-images.com/KnS6v1ZLpD4zCElng5i2Rw__original/img/L2CkJDFVKs3O6fF_JEhM6wLbH4E=/0x0/filters:format(jpeg)/pic3048467.jpg',
  'haba-first-orchard': 'https://cf.geekdo-images.com/8RKRha_bOXUtAXZ-lQdjsA__original/img/3DJNG8fY6Vk4n8k8JB0a0M-DGQ4=/0x0/filters:format(png)/pic7811919.png',
  'hoot-owl-hoot': 'https://cf.geekdo-images.com/WSJUJlQJ-YpdAijJ5NswAQ__original/img/ib67T-XbsE5HfYq9Cy7lbJH1rEA=/0x0/filters:format(jpeg)/pic957777.jpg',
  'monza': 'https://cf.geekdo-images.com/Avm_weldy7Gz0Haq4tLceQ__original/img/t6nH6tQ1n2P3Bvl1mDqg3_3RBto=/0x0/filters:format(png)/pic8894429.png',
  'my-first-carcassonne': 'https://cf.geekdo-images.com/cj1OiLMQ1tXF1VfuNXqDdA__original/img/x-yD-3F3bL9k3dVy4y2t9lT1QvY=/0x0/filters:format(png)/pic5606668.png',
  'outfoxed': 'https://cf.geekdo-images.com/v0FCI-wY8YlPn39XKd3F8w__original/img/dFlZmk2g2_3xk3EzXyAaZpYJ7aQ=/0x0/filters:format(jpeg)/pic2401324.jpg',
  'rhino-hero': 'https://cf.geekdo-images.com/UO37-aWZkmCl_Aj2M53OtA__original/img/T8K5Y7bKUqIHj8yQ1Bny2FYpM3E=/0x0/filters:format(png)/pic9267030.png',
  'roll-and-play': 'https://cf.geekdo-images.com/Isz36LR_IwR8LX_lQyaBrw__original/img/V6G9K_rH-rGF7G_0Z3z3B-n3Y5U=/0x0/filters:format(jpeg)/pic2047447.jpg',
  'sequence-for-kids': 'https://cf.geekdo-images.com/k3DHTM6He726DhUqdlfWpQ__original/img/zL1_3TfLW2kS7l8gqZBCKUPTphg=/0x0/filters:format(jpeg)/pic5828420.jpg',
  'sleeping-queens': 'https://cf.geekdo-images.com/hkJWvm7VJD4yqrbjCHmLFA__original/img/fH8gKJMvBXVkM3lzP0bKV8-xjJk=/0x0/filters:format(jpeg)/pic2401336.jpg',
  'sneaky-snacky-squirrel': 'https://cf.geekdo-images.com/qvqjv4CjRL9RoX0aeHLX8g__original/img/oOLRcfVW3C7J7hvhj5HrV3Bl7sI=/0x0/filters:format(jpeg)/pic2388611.jpg',
  'spot-it-jr-animals': 'https://cf.geekdo-images.com/rmKMQqyr5xuPaVE6l0Ny-Q__original/img/yE_JVwybpZjQbNF3wTtI0GfLXm4=/0x0/filters:format(png)/pic4681526.png',
  'sushi-go': 'https://cf.geekdo-images.com/Fn3PSPZVxa3YurlorITQ1Q__original/img/eR7Z5VvQfGp0byHnYqOoMHfSUYY=/0x0/filters:format(jpeg)/pic1900075.jpg',
  'ticket-to-ride-first-journey': 'https://cf.geekdo-images.com/bGvfrC4pLxR-xkK_nN31DA__original/img/6Q0QE-sWGMX_BEXrMvq4IHfJAFg=/0x0/filters:format(jpeg)/pic3116341.jpg',
  'very-hungry-caterpillar-game': 'https://cf.geekdo-images.com/1yTpgwzb3wZUyWv1ASi4RA__original/img/R-zD0e3RB0dz8T3jJQ1cKR-pqCQ=/0x0/filters:format(jpeg)/pic178419.jpg',
  'zingo': 'https://cf.geekdo-images.com/T_b9KBR-89HCZyBtwi8n4Q__original/img/yDpFJm0_9E8K-9wFf3xFsEdCeGQ=/0x0/filters:format(jpeg)/pic2047477.jpg',
  // disney-hidden-realms and star-wars-super-teams not found on BGG - will need manual search
};

// Digital game images from various sources
const digitalGameImages: Record<string, string> = {
  // Games with only SVG (need real images)
  'candy-crush': 'https://play-lh.googleusercontent.com/1-hPxafOxdYpYZEOKzNIkSP43HXCNftVJVttoo4ucl7rsMASXW3Xqf6GnJuJTBxs-Q=w480-h960-rw',
  'scratch': 'https://scratch.mit.edu/images/scratch-og.png',
};

function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filepath);

    const makeRequest = (requestUrl: string, redirectCount = 0) => {
      if (redirectCount > 5) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        resolve(false);
        return;
      }

      const urlObj = new URL(requestUrl);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/*,*/*',
        }
      };

      https.get(options, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            const fullRedirectUrl = redirectUrl.startsWith('http')
              ? redirectUrl
              : `https://${urlObj.hostname}${redirectUrl}`;
            makeRequest(fullRedirectUrl, redirectCount + 1);
            return;
          }
        }

        if (response.statusCode !== 200) {
          file.close();
          if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
          console.log(`  HTTP ${response.statusCode} for ${url}`);
          resolve(false);
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          // Check if file is valid (> 1KB)
          const stats = fs.statSync(filepath);
          if (stats.size < 1000) {
            fs.unlinkSync(filepath);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      }).on('error', (err) => {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        console.log(`  Error: ${err.message}`);
        resolve(false);
      });
    };

    makeRequest(url);
  });
}

async function main() {
  const boardDir = path.join(PUBLIC_DIR, 'board');
  const digitalDir = path.join(PUBLIC_DIR, 'digital');

  if (!fs.existsSync(boardDir)) fs.mkdirSync(boardDir, { recursive: true });
  if (!fs.existsSync(digitalDir)) fs.mkdirSync(digitalDir, { recursive: true });

  console.log('🎲 Downloading board game images...\n');

  let boardSuccess = 0;
  let boardFailed = 0;
  const failedBoardGames: string[] = [];

  for (const [slug, url] of Object.entries(boardGameImages)) {
    // Determine extension from URL
    let ext = '.jpg';
    if (url.includes('format(png)') || url.endsWith('.png')) ext = '.png';

    const filepath = path.join(boardDir, `${slug}${ext}`);

    // Check if we already have this image (any format)
    const existingJpg = path.join(boardDir, `${slug}.jpg`);
    const existingPng = path.join(boardDir, `${slug}.png`);
    if (fs.existsSync(existingJpg) || fs.existsSync(existingPng)) {
      console.log(`⏭ Exists: ${slug}`);
      boardSuccess++;
      continue;
    }

    console.log(`⬇ Downloading: ${slug}...`);
    const success = await downloadImage(url, filepath);
    if (success) {
      const stats = fs.statSync(filepath);
      console.log(`  ✓ Success: ${slug} (${Math.round(stats.size / 1024)}KB)`);
      boardSuccess++;
    } else {
      console.log(`  ✗ Failed: ${slug}`);
      boardFailed++;
      failedBoardGames.push(slug);
    }

    // Small delay to be nice to servers
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n🎮 Downloading digital game images...\n');

  let digitalSuccess = 0;
  let digitalFailed = 0;
  const failedDigitalGames: string[] = [];

  for (const [slug, url] of Object.entries(digitalGameImages)) {
    let ext = '.jpg';
    if (url.includes('.png')) ext = '.png';

    const filepath = path.join(digitalDir, `${slug}${ext}`);

    const existingJpg = path.join(digitalDir, `${slug}.jpg`);
    const existingPng = path.join(digitalDir, `${slug}.png`);
    if (fs.existsSync(existingJpg) || fs.existsSync(existingPng)) {
      console.log(`⏭ Exists: ${slug}`);
      digitalSuccess++;
      continue;
    }

    console.log(`⬇ Downloading: ${slug}...`);
    const success = await downloadImage(url, filepath);
    if (success) {
      const stats = fs.statSync(filepath);
      console.log(`  ✓ Success: ${slug} (${Math.round(stats.size / 1024)}KB)`);
      digitalSuccess++;
    } else {
      console.log(`  ✗ Failed: ${slug}`);
      digitalFailed++;
      failedDigitalGames.push(slug);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n========================================');
  console.log('Summary:');
  console.log(`  Board games: ${boardSuccess} success, ${boardFailed} failed`);
  console.log(`  Digital games: ${digitalSuccess} success, ${digitalFailed} failed`);

  if (failedBoardGames.length > 0) {
    console.log(`\nFailed board games: ${failedBoardGames.join(', ')}`);
  }
  if (failedDigitalGames.length > 0) {
    console.log(`Failed digital games: ${failedDigitalGames.join(', ')}`);
  }
  console.log('========================================\n');
}

main().catch(console.error);
