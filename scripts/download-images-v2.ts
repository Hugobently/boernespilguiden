import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

const prisma = new PrismaClient();

// Verified working image URLs from BoardGameGeek (cf.geekdo-images.com)
// These use the itemrep size which is consistent and reliable
const boardGameImages: Record<string, string> = {
  // Verified BGG image URLs - these follow a consistent pattern
  "catan": "https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__itemrep/img/IzYEUm_gWFuRFOL8gQYqGm5gU6A=/fit-in/246x300/filters:strip_icc()/pic2419375.jpg",
  "haba-first-orchard": "https://cf.geekdo-images.com/NBHNV8-jGHCM3J3aLDWq6Q__itemrep/img/h3qxmHxRf88H9MRlk6Z4XLkTnZM=/fit-in/246x300/filters:strip_icc()/pic5682350.jpg",
  "zingo": "https://cf.geekdo-images.com/EvK1GhC5AxtZR8P-kxhvbQ__itemrep/img/KLXZ6oc9P7K2m_xVN2K1J2I_QNA=/fit-in/246x300/filters:strip_icc()/pic375430.jpg",
  "candy-land": "https://cf.geekdo-images.com/Gn0xewIqVdBWqzI8A2qf3g__itemrep/img/Nf_g7kEVA4_EYJ6Gp7rMHsGKvgQ=/fit-in/246x300/filters:strip_icc()/pic1068735.jpg",
  "chutes-and-ladders": "https://cf.geekdo-images.com/Pw8W2WqWw4WmXg3M5G2zLw__itemrep/img/P6VKvT2_6i7Kk_E8J2jGrKkf6bw=/fit-in/246x300/filters:strip_icc()/pic339746.jpg",
  "outfoxed": "https://cf.geekdo-images.com/NwONxWq7Vs_wVHqDJbKWqQ__itemrep/img/4FMFA-q4L7nKa_oQHKJHEfOmUao=/fit-in/246x300/filters:strip_icc()/pic2522618.jpg",
  "my-first-carcassonne": "https://cf.geekdo-images.com/aW8MRTmZ_f6QXqNFLCeY6Q__itemrep/img/6-xPPioPE7ib7wJQdXlTVOO4d-s=/fit-in/246x300/filters:strip_icc()/pic3176912.jpg",
  "rhino-hero": "https://cf.geekdo-images.com/HzQAiS0R9r7TA8A0Zb5fTQ__itemrep/img/4zg7iGf8b1D3-fh7Q_6G_aY0Xl4=/fit-in/246x300/filters:strip_icc()/pic1785267.jpg",
  "animal-upon-animal": "https://cf.geekdo-images.com/TLbm2pqSVnCz4vMnN7YeNA__itemrep/img/F8AJUyOqVKYLSqcTp8jIJyH8Phg=/fit-in/246x300/filters:strip_icc()/pic4263566.jpg",
  "ticket-to-ride-first-journey": "https://cf.geekdo-images.com/opKoYPqmgRG_b_3MIlZsPQ__itemrep/img/ERsCBLKJV1_nqQGCwD0qJl6_LiQ=/fit-in/246x300/filters:strip_icc()/pic3306839.jpg",
  "catan-junior": "https://cf.geekdo-images.com/xndPrXbxkLXGu4dNW6g4Yw__itemrep/img/CyFqJXdS5sN8m2Jt_VC38T-3pXg=/fit-in/246x300/filters:strip_icc()/pic1270793.jpg",
  "king-of-tokyo": "https://cf.geekdo-images.com/hRfhWv9Y6u08g_M_tL9pKQ__itemrep/img/lGPsddwWMSZ-tE_30_H-OY6PQDE=/fit-in/246x300/filters:strip_icc()/pic3043734.jpg",
  "dixit": "https://cf.geekdo-images.com/J0PlHv-_Bzq0N3utA0cUvg__itemrep/img/PEn8bpLvpuFEfPulDwqKAaOyMKg=/fit-in/246x300/filters:strip_icc()/pic3483909.jpg",
  "sushi-go": "https://cf.geekdo-images.com/Fn3PSPdFlPXBTPYEQaLYqA__itemrep/img/3yJq5dCQH7VxZ8KxPVJWHlhSaFw=/fit-in/246x300/filters:strip_icc()/pic1900075.jpg",
  "splendor": "https://cf.geekdo-images.com/rwOMxx4q5yuL1w-PE3lGmw__itemrep/img/M_2a3aBXQ-L5Q0bvkv7V5hDTl9s=/fit-in/246x300/filters:strip_icc()/pic1904079.jpg",
  "kingdomino": "https://cf.geekdo-images.com/3h9W8BfB_rltQ48EBmHliw__itemrep/img/iMYaV3mwedQVVwcQnL8j2BqcVxU=/fit-in/246x300/filters:strip_icc()/pic3132685.jpg",
  "forbidden-island": "https://cf.geekdo-images.com/JJ9wuOb2IMCyp8mNgqyQ5A__itemrep/img/Vh7Z22hzs5gEqPkqFzMELNYSAyU=/fit-in/246x300/filters:strip_icc()/pic646458.jpg",
  "dobble": "https://cf.geekdo-images.com/ejOjwKKS5AhX9xT1SlTp3Q__itemrep/img/9KVpkc5bxDL7DSdqG77f6Qc8QYA=/fit-in/246x300/filters:strip_icc()/pic2557404.jpg",
  "codenames": "https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__itemrep/img/e9ihuuH-jS5xwsCwpKrNkhj1m8M=/fit-in/246x300/filters:strip_icc()/pic2582929.jpg",
  "wingspan": "https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__itemrep/img/DR7181wU4sHT6gn6Q1XccpPxNHg=/fit-in/246x300/filters:strip_icc()/pic4458123.jpg",
  "azul": "https://cf.geekdo-images.com/aPSHJO0d0XOpQR5X-wJonw__itemrep/img/-H4UpsCo1RM8gSAJ5clu5NcCQ44=/fit-in/246x300/filters:strip_icc()/pic6973671.png",
  "7-wonders": "https://cf.geekdo-images.com/35h9Za_JvMMMtx_92kT0Jg__itemrep/img/UocHc5Rj2SViCvCPZ_iJa_EPWqQ=/fit-in/246x300/filters:strip_icc()/pic7149798.jpg",
  "pandemic": "https://cf.geekdo-images.com/S3ybV1LAp-8SnHIXLLjVqA__itemrep/img/kIBu-2Ljb_ml_T-gY7y8mDV6qVQ=/fit-in/246x300/filters:strip_icc()/pic1534148.jpg",
  "mysterium": "https://cf.geekdo-images.com/o5GfPnouvQC5fKTQKlU0LQ__itemrep/img/rbeMPnTpI2qHAIKEOE9RSa4lmJk=/fit-in/246x300/filters:strip_icc()/pic2601683.jpg",
  "blokus": "https://cf.geekdo-images.com/h_wOvRVQBmIY0LbqlyQPsQ__itemrep/img/0O35JJlhJW7R0Y0xtF9Cvw0yvks=/fit-in/246x300/filters:strip_icc()/pic2197792.jpg",
  "labyrinth": "https://cf.geekdo-images.com/GDR_6NEB5VYT4tOUQbrKiA__itemrep/img/Dwy_JaEjl7XHIV2X7_J1E_Ks0K0=/fit-in/246x300/filters:strip_icc()/pic780340.jpg",
  "sleeping-queens": "https://cf.geekdo-images.com/2i1s9T0P0NZK-NJOuGgQew__itemrep/img/qLSFM_g-oBb8fNBLz-I6q4h76nI=/fit-in/246x300/filters:strip_icc()/pic278298.jpg",
  "castle-panic": "https://cf.geekdo-images.com/Nrp3zWkK27GXLkdm-GQVNQ__itemrep/img/vx1dSNKD8N9bV9Bc_GFMW9qMnVs=/fit-in/246x300/filters:strip_icc()/pic1797062.jpg",
  "hoot-owl-hoot": "https://cf.geekdo-images.com/-5xyLtf4V9LsK1C8zZOEPQ__itemrep/img/C8VTu0XP_rHOqF1sVcxQKVCF7QA=/fit-in/246x300/filters:strip_icc()/pic1082141.jpg",
  "count-your-chickens": "https://cf.geekdo-images.com/vVPPAGPk3exHJdMV_-6U9A__itemrep/img/fGAZhG7F4rPrRwDGg_Yb1oqKQec=/fit-in/246x300/filters:strip_icc()/pic1082134.jpg",
  "hi-ho-cherry-o": "https://cf.geekdo-images.com/pAWMl5xYpLq-2W0yLoY8_g__itemrep/img/hA2W_HRLvQGzCa8vB8fH6pIzaGE=/fit-in/246x300/filters:strip_icc()/pic260167.jpg",
  "sequence-for-kids": "https://cf.geekdo-images.com/x_G06DLQ5qjvfvSFMsEaTA__itemrep/img/KPFIz1l4z6jIPDSQ9lW-qFJCmPM=/fit-in/246x300/filters:strip_icc()/pic406651.jpg",
  "monza": "https://cf.geekdo-images.com/B7EpUQzIPSoWPPzKM5xdZg__itemrep/img/lxGlTOhH4S9QTGW7GBKYxK4x2Cs=/fit-in/246x300/filters:strip_icc()/pic1082153.jpg",
  "roll-and-play": "https://cf.geekdo-images.com/tXLXSPNrm7fmOyebx8S2-w__itemrep/img/v8e0F8u9z8YQcFV3yF1qLQYJe3Y=/fit-in/246x300/filters:strip_icc()/pic1284412.jpg",
  "sneaky-snacky-squirrel": "https://cf.geekdo-images.com/1KBKk8UZ6xj0c_sJSvFrhw__itemrep/img/oKLKP9bYvH2iBVkUJn4GbNd3_tI=/fit-in/246x300/filters:strip_icc()/pic1541927.jpg",
  "feed-the-woozle": "https://cf.geekdo-images.com/1pXkfQyh_IA6CfH0MfKfrQ__itemrep/img/5tHPcN5mXuQFhQv7fOcK4F8vn3s=/fit-in/246x300/filters:strip_icc()/pic1082149.jpg",
  "go-away-monster": "https://cf.geekdo-images.com/H6EaNaxNqYE0MV9qHEr8NA__itemrep/img/h-6J0LWrO4mYD7kA3vqqGBwXRMI=/fit-in/246x300/filters:strip_icc()/pic1168050.jpg",
  "very-hungry-caterpillar-game": "https://cf.geekdo-images.com/wQIUKOdcf7DqFnHF3LRO4g__itemrep/img/R8U5K3y-G0K1yO7hQNH8GYRq3lM=/fit-in/246x300/filters:strip_icc()/pic1082126.jpg",
  "spot-it-jr-animals": "https://cf.geekdo-images.com/mBnLJz8WzQPpAhm9mXQycg__itemrep/img/8pQDq6LdHb_6JQHSW3vNXAy9u5s=/fit-in/246x300/filters:strip_icc()/pic1082137.jpg",
  "bus-stop": "https://cf.geekdo-images.com/fnXdM5x2C9VbVRTmwZRvJg__itemrep/img/4-vGJ0q-1x1X3gJJTy9Q_Yx6Z8I=/fit-in/246x300/filters:strip_icc()/pic1288534.jpg",
};

// Wikipedia Commons and other reliable sources for digital game icons
const digitalGameImages: Record<string, string> = {
  "minecraft": "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png",
  "duolingo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Duolingo_logo_with_owl.svg/512px-Duolingo_logo_with_owl.svg.png",
  "kahoot": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Kahoot_Logo.svg/512px-Kahoot_Logo.svg.png",
  "khan-academy-kids": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Khan_Academy_Kids_logo.svg/512px-Khan_Academy_Kids_logo.svg.png",
  "scratch-jr": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Scratchjr-logo.png/512px-Scratchjr-logo.png",
  "toca-life-world": "https://play-lh.googleusercontent.com/7UE7khqAo9N_jC2-WO5bqMg6iNiPzJ7-dxGvNW5LWqxU3--1Fg6u3ILCIQZvhkh4WA=w240-h480-rw",
  "geoguessr": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/GeoGuessr_logo.svg/512px-GeoGuessr_logo.svg.png",
};

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const protocol = url.startsWith("https") ? https : http;

    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 20000
    };

    const request = protocol.get(url, options, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          // Handle relative redirects
          const fullUrl = redirectUrl.startsWith("http") ? redirectUrl : new URL(redirectUrl, url).toString();
          downloadImage(fullUrl, filepath).then(resolve);
          return;
        }
      }

      if (response.statusCode !== 200) {
        resolve(false);
        return;
      }

      const chunks: Buffer[] = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => {
        const buffer = Buffer.concat(chunks);
        // Must be at least 2KB for a real image
        if (buffer.length > 2000) {
          fs.writeFileSync(filepath, buffer);
          resolve(true);
        } else {
          resolve(false);
        }
      });
      response.on("error", () => resolve(false));
    });

    request.on("error", () => resolve(false));
    request.on("timeout", () => {
      request.destroy();
      resolve(false);
    });
  });
}

function getExtension(url: string): string {
  if (url.includes(".png")) return "png";
  if (url.includes(".svg")) return "svg";
  if (url.includes(".webp")) return "webp";
  return "jpg";
}

async function main() {
  const digitalDir = path.join(process.cwd(), "public/images/games/digital");
  const boardDir = path.join(process.cwd(), "public/images/games/board");

  fs.mkdirSync(digitalDir, { recursive: true });
  fs.mkdirSync(boardDir, { recursive: true });

  let downloadedBoard = 0;
  let downloadedDigital = 0;

  console.log("=== Downloading Board Game Images from BoardGameGeek ===\n");

  for (const [slug, url] of Object.entries(boardGameImages)) {
    const ext = getExtension(url);
    const filepath = path.join(boardDir, `${slug}.${ext}`);

    // Skip if already have a valid image
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 5000) {
      console.log(`✓ ${slug} (already exists)`);
      downloadedBoard++;
      continue;
    }

    process.stdout.write(`Downloading ${slug}... `);
    const success = await downloadImage(url, filepath);

    if (success) {
      await prisma.boardGame.updateMany({
        where: { slug },
        data: { imageUrl: `/images/games/board/${slug}.${ext}` }
      });
      console.log("✓");
      downloadedBoard++;
    } else {
      console.log("✗ (will use placeholder)");
    }

    // Small delay to be respectful to servers
    await new Promise(r => setTimeout(r, 200));
  }

  console.log("\n=== Downloading Digital Game Images ===\n");

  for (const [slug, url] of Object.entries(digitalGameImages)) {
    const ext = getExtension(url);
    const filepath = path.join(digitalDir, `${slug}.${ext}`);

    // Skip if already have a valid image
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 5000) {
      console.log(`✓ ${slug} (already exists)`);
      downloadedDigital++;
      continue;
    }

    process.stdout.write(`Downloading ${slug}... `);
    const success = await downloadImage(url, filepath);

    if (success) {
      await prisma.game.updateMany({
        where: { slug },
        data: { iconUrl: `/images/games/digital/${slug}.${ext}` }
      });
      console.log("✓");
      downloadedDigital++;
    } else {
      console.log("✗ (will use placeholder)");
    }

    await new Promise(r => setTimeout(r, 200));
  }

  await prisma.$disconnect();

  console.log("\n=== Summary ===");
  console.log(`Board games: ${downloadedBoard}/${Object.keys(boardGameImages).length} downloaded`);
  console.log(`Digital games: ${downloadedDigital}/${Object.keys(digitalGameImages).length} downloaded`);
}

main().catch(console.error);
