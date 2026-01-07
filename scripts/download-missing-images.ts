import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

const prisma = new PrismaClient();

// Game images mapping - using reliable placeholder/logo sources
const digitalGameImages: Record<string, string> = {
  "sago-mini-world": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/23/26/8a/23268a8c-3e16-2c89-25a2-d1f89c5a4cf7/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg",
  "peek-a-zoo": "https://is1-ssl.mzstatic.com/image/thumb/Purple114/v4/a0/4d/33/a04d3371-4f4c-ebfc-b6f3-c84d2e0f3f3c/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg",
  "tiny-hands-first-words": "https://is1-ssl.mzstatic.com/image/thumb/Purple125/v4/ed/f1/1f/edf11fca-c8ac-7b24-9e97-d8f1c3d6c9c5/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg",
  "hey-duggee-big-badge-app": "https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/4c/b2/ec/4cb2ec00-0b4a-e6f6-7d42-db0d74d7e6dc/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg",
  "dr-panda-town": "https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/1a/c9/63/1ac96368-bb31-07f9-3d3b-e6c63d4c8f2c/AppIcon-0-0-1x_U007emarketing-0-6-0-85-220.png/512x512bb.jpg",
  "pok-pok-playroom": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/2b/0f/69/2b0f69b7-6f0c-f5f0-97fc-3f4c34fa5f7b/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg",
  "montessori-preschool": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/33/68/ed/3368edcb-f7d9-c1ee-e0d1-be4a8de36b4e/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg",
  "thinkrolls-2": "https://is1-ssl.mzstatic.com/image/thumb/Purple114/v4/03/ae/a8/03aea8c7-e1c0-fc6f-b0c5-b8d78bb4e9e3/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg",
  "moose-math": "https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/3c/1d/7c/3c1d7c0f-5b56-3b9d-8ccc-d41a9b8b5a1d/AppIcon-0-0-1x_U007emarketing-0-6-0-85-220.png/512x512bb.jpg",
  "todo-math": "https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/93/12/ae/9312ae81-f2e3-01c9-be8e-a6e3c0d56a6f/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg",
  "busy-shapes-colors": "https://is1-ssl.mzstatic.com/image/thumb/Purple114/v4/8e/e1/a9/8ee1a9f8-f8d1-de0a-5c4f-1de0c0e81c12/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg",
  "arties-world": "https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/a2/b8/81/a2b88148-f5a0-91b1-c49d-1feaa3e9c4d5/AppIcon-0-0-1x_U007emarketing-0-6-0-85-220.png/512x512bb.jpg"
};

const boardGameImages: Record<string, string> = {
  "go-away-monster": "https://m.media-amazon.com/images/I/81LIZkfCy9L._AC_SL1500_.jpg",
  "bluey-board-game": "https://m.media-amazon.com/images/I/81QHVQ9tAXL._AC_SL1500_.jpg",
  "disney-hidden-realms": "https://m.media-amazon.com/images/I/91VRvgT0KBL._AC_SL1500_.jpg",
  "star-wars-super-teams": "https://m.media-amazon.com/images/I/81t4y7JJVBL._AC_SL1500_.jpg"
};

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const protocol = url.startsWith("https") ? https : http;
    
    const request = protocol.get(url, { 
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" 
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, filepath).then(resolve);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        console.log(`  Failed: HTTP ${response.statusCode}`);
        resolve(false);
        return;
      }
      
      const file = fs.createWriteStream(filepath);
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve(true);
      });
      file.on("error", () => {
        fs.unlinkSync(filepath);
        resolve(false);
      });
    });
    
    request.on("error", () => {
      resolve(false);
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function main() {
  const digitalDir = path.join(process.cwd(), "public/images/games/digital");
  const boardDir = path.join(process.cwd(), "public/images/games/board");
  
  // Download digital game images
  console.log("=== Downloading Digital Game Images ===");
  for (const [slug, url] of Object.entries(digitalGameImages)) {
    const ext = url.includes(".png") ? "png" : "jpg";
    const filepath = path.join(digitalDir, `${slug}.${ext}`);
    
    if (fs.existsSync(filepath)) {
      console.log(`✓ ${slug} already exists`);
      continue;
    }
    
    console.log(`Downloading ${slug}...`);
    const success = await downloadImage(url, filepath);
    
    if (success) {
      // Update database
      await prisma.game.update({
        where: { slug },
        data: { iconUrl: `/images/games/digital/${slug}.${ext}` }
      });
      console.log(`✓ ${slug} downloaded and database updated`);
    } else {
      console.log(`✗ ${slug} failed to download`);
    }
  }
  
  // Download board game images
  console.log("\n=== Downloading Board Game Images ===");
  for (const [slug, url] of Object.entries(boardGameImages)) {
    const ext = "jpg";
    const filepath = path.join(boardDir, `${slug}.${ext}`);
    
    if (fs.existsSync(filepath)) {
      console.log(`✓ ${slug} already exists`);
      continue;
    }
    
    console.log(`Downloading ${slug}...`);
    const success = await downloadImage(url, filepath);
    
    if (success) {
      // Update database
      await prisma.boardGame.update({
        where: { slug },
        data: { imageUrl: `/images/games/board/${slug}.${ext}` }
      });
      console.log(`✓ ${slug} downloaded and database updated`);
    } else {
      console.log(`✗ ${slug} failed to download`);
    }
  }
  
  await prisma.$disconnect();
  console.log("\nDone!");
}

main();
