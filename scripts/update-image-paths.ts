import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

function findBestImage(slug: string, dir: string): string | null {
  const basePath = path.join(process.cwd(), "public/images/games", dir);

  // Check for real images first (prefer jpg, then png, then webp)
  for (const ext of ["jpg", "png", "webp"]) {
    const filepath = path.join(basePath, `${slug}.${ext}`);
    if (fs.existsSync(filepath)) {
      const size = fs.statSync(filepath).size;
      if (size > 5000) {
        return `/images/games/${dir}/${slug}.${ext}`;
      }
    }
  }

  // Fall back to SVG placeholder
  const svgPath = path.join(basePath, `${slug}.svg`);
  if (fs.existsSync(svgPath)) {
    return `/images/games/${dir}/${slug}.svg`;
  }

  return null;
}

async function main() {
  console.log("=== Updating game image paths ===\n");

  // Update digital games
  const games = await prisma.game.findMany({ select: { slug: true, iconUrl: true } });
  let digitalUpdated = 0;
  let digitalReal = 0;

  for (const game of games) {
    const bestImage = findBestImage(game.slug, "digital");
    if (bestImage && bestImage !== game.iconUrl) {
      await prisma.game.update({
        where: { slug: game.slug },
        data: { iconUrl: bestImage }
      });
      digitalUpdated++;
    }
    if (bestImage && !bestImage.endsWith(".svg")) {
      digitalReal++;
    }
  }

  console.log(`Digital games: ${digitalReal}/${games.length} have real images`);
  console.log(`Updated ${digitalUpdated} digital game paths\n`);

  // Update board games
  const boardGames = await prisma.boardGame.findMany({ select: { slug: true, imageUrl: true } });
  let boardUpdated = 0;
  let boardReal = 0;

  for (const game of boardGames) {
    const bestImage = findBestImage(game.slug, "board");
    if (bestImage && bestImage !== game.imageUrl) {
      await prisma.boardGame.update({
        where: { slug: game.slug },
        data: { imageUrl: bestImage }
      });
      boardUpdated++;
    }
    if (bestImage && !bestImage.endsWith(".svg")) {
      boardReal++;
    }
  }

  console.log(`Board games: ${boardReal}/${boardGames.length} have real images`);
  console.log(`Updated ${boardUpdated} board game paths\n`);

  await prisma.$disconnect();

  console.log("=== Summary ===");
  console.log(`Total games with REAL images: ${digitalReal + boardReal}/${games.length + boardGames.length}`);
  console.log(`Games with SVG placeholders: ${(games.length - digitalReal) + (boardGames.length - boardReal)}`);
}

main().catch(console.error);
