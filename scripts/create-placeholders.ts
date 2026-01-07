import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Colors for different games
const colors = [
  "#FFB5A7", "#BAFFC9", "#BAE1FF", "#E2C2FF", "#FFD1DC",
  "#FFDAC1", "#B5EAD7", "#C7CEEA", "#FF9AA2", "#98DDCA"
];

function createPlaceholderSVG(name: string, color: string, emoji: string): string {
  // Split name into lines for better display
  const words = name.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (currentLine.length + word.length > 12) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + " " + word : word;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Limit to 3 lines
  const displayLines = lines.slice(0, 3);
  const yStart = displayLines.length === 1 ? 160 : displayLines.length === 2 ? 145 : 130;

  const textElements = displayLines.map((line, i) =>
    `<text x="128" y="${yStart + i * 35}" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#4A4A4A" text-anchor="middle">${escapeXml(line)}</text>`
  ).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" fill="${color}" rx="32"/>
  <text x="128" y="80" font-family="Arial, sans-serif" font-size="60" text-anchor="middle">${emoji}</text>
  ${textElements}
</svg>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function main() {
  const digitalDir = path.join(process.cwd(), "public/images/games/digital");
  const boardDir = path.join(process.cwd(), "public/images/games/board");

  // Get games without images
  const gamesWithoutImages = await prisma.game.findMany({
    where: {
      OR: [
        { iconUrl: null },
        { iconUrl: "" }
      ]
    },
    select: { slug: true, title: true }
  });

  const boardGamesWithoutImages = await prisma.boardGame.findMany({
    where: {
      OR: [
        { imageUrl: null },
        { imageUrl: "" }
      ]
    },
    select: { slug: true, title: true }
  });

  console.log(`Found ${gamesWithoutImages.length} digital games without images`);
  console.log(`Found ${boardGamesWithoutImages.length} board games without images`);

  // Create placeholders for digital games
  console.log("\n=== Creating Digital Game Placeholders ===");
  for (let i = 0; i < gamesWithoutImages.length; i++) {
    const game = gamesWithoutImages[i];
    const color = colors[i % colors.length];
    const svg = createPlaceholderSVG(game.title, color, "🎮");
    const filepath = path.join(digitalDir, `${game.slug}.svg`);

    fs.writeFileSync(filepath, svg);

    await prisma.game.update({
      where: { slug: game.slug },
      data: { iconUrl: `/images/games/digital/${game.slug}.svg` }
    });

    console.log(`✓ Created placeholder for: ${game.title}`);
  }

  // Create placeholders for board games
  console.log("\n=== Creating Board Game Placeholders ===");
  for (let i = 0; i < boardGamesWithoutImages.length; i++) {
    const game = boardGamesWithoutImages[i];
    const color = colors[(i + 5) % colors.length];
    const svg = createPlaceholderSVG(game.title, color, "🎲");
    const filepath = path.join(boardDir, `${game.slug}.svg`);

    fs.writeFileSync(filepath, svg);

    await prisma.boardGame.update({
      where: { slug: game.slug },
      data: { imageUrl: `/images/games/board/${game.slug}.svg` }
    });

    console.log(`✓ Created placeholder for: ${game.title}`);
  }

  await prisma.$disconnect();
  console.log("\nDone! All games now have placeholder images.");
}

main();
