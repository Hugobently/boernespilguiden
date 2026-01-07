import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Color palette for placeholder images
const colors = [
  "#FFB5A7", "#BAFFC9", "#BAE1FF", "#E2C2FF", "#FFD1DC",
  "#FFDAC1", "#B5EAD7", "#C7CEEA", "#FF9AA2", "#98DDCA",
  "#FFE5B4", "#D4A5A5", "#A8E6CF", "#DCEDC1", "#FFD3B6"
];

// Category-based emojis for digital games
const digitalEmojis: Record<string, string> = {
  "læring": "📚",
  "kreativitet": "🎨",
  "eventyr": "🏰",
  "puslespil": "🧩",
  "musik": "🎵",
  "kodning": "💻",
  "matematik": "🔢",
  "læsning": "📖",
  "default": "🎮"
};

// Category-based emojis for board games
const boardEmojis: Record<string, string> = {
  "strategi": "♟️",
  "familie": "👨‍👩‍👧‍👦",
  "samarbejde": "🤝",
  "fest": "🎉",
  "kort": "🃏",
  "hukommelse": "🧠",
  "default": "🎲"
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function createPlaceholderSVG(name: string, color: string, emoji: string): string {
  // Split name into lines for better display
  const words = name.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (currentLine.length + word.length > 14) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + " " + word : word;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Limit to 3 lines
  const displayLines = lines.slice(0, 3);
  const fontSize = displayLines.some(l => l.length > 12) ? 18 : 22;
  const lineHeight = fontSize + 10;
  const yStart = displayLines.length === 1 ? 165 : displayLines.length === 2 ? 150 : 135;

  const textElements = displayLines.map((line, i) =>
    `<text x="128" y="${yStart + i * lineHeight}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="#4A4A4A" text-anchor="middle">${escapeXml(line)}</text>`
  ).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${adjustColor(color, -20)};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="256" height="256" fill="url(#grad)" rx="32"/>
  <text x="128" y="85" font-family="Arial, sans-serif" font-size="64" text-anchor="middle">${emoji}</text>
  ${textElements}
</svg>`;
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

function isValidImage(filepath: string): boolean {
  if (!fs.existsSync(filepath)) return false;

  const stats = fs.statSync(filepath);
  // Real images should be at least 1KB
  if (stats.size < 1000) return false;

  // Check if it's a valid image by reading first few bytes
  const buffer = Buffer.alloc(8);
  const fd = fs.openSync(filepath, 'r');
  fs.readSync(fd, buffer, 0, 8, 0);
  fs.closeSync(fd);

  // Check for PNG magic bytes
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return true;
  }

  // Check for JPEG magic bytes
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return true;
  }

  // Check for SVG (text-based)
  const content = fs.readFileSync(filepath, 'utf8').slice(0, 100);
  if (content.includes('<svg') || content.includes('<?xml')) {
    return true;
  }

  return false;
}

function getEmoji(categories: string[], isDigital: boolean): string {
  const emojiMap = isDigital ? digitalEmojis : boardEmojis;

  for (const cat of categories) {
    const normalized = cat.toLowerCase();
    if (emojiMap[normalized]) {
      return emojiMap[normalized];
    }
  }

  return emojiMap["default"];
}

async function main() {
  const digitalDir = path.join(process.cwd(), "public/images/games/digital");
  const boardDir = path.join(process.cwd(), "public/images/games/board");

  // Ensure directories exist
  fs.mkdirSync(digitalDir, { recursive: true });
  fs.mkdirSync(boardDir, { recursive: true });

  // Get all games
  const games = await prisma.game.findMany({
    select: { slug: true, title: true, iconUrl: true, categories: true }
  });

  const boardGames = await prisma.boardGame.findMany({
    select: { slug: true, title: true, imageUrl: true, categories: true }
  });

  console.log(`Processing ${games.length} digital games...`);
  console.log(`Processing ${boardGames.length} board games...`);

  let fixedDigital = 0;
  let fixedBoard = 0;

  // Fix digital games
  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const color = colors[i % colors.length];

    // Check if current image is valid
    let needsPlaceholder = true;
    if (game.iconUrl) {
      const currentPath = path.join(process.cwd(), "public", game.iconUrl);
      if (isValidImage(currentPath)) {
        needsPlaceholder = false;
      }
    }

    if (needsPlaceholder) {
      const categories = game.categories ? JSON.parse(game.categories) : [];
      const emoji = getEmoji(categories, true);
      const svg = createPlaceholderSVG(game.title, color, emoji);
      const filename = `${game.slug}.svg`;
      const filepath = path.join(digitalDir, filename);

      fs.writeFileSync(filepath, svg);

      await prisma.game.update({
        where: { slug: game.slug },
        data: { iconUrl: `/images/games/digital/${filename}` }
      });

      fixedDigital++;
      console.log(`✓ Fixed: ${game.title}`);
    }
  }

  // Fix board games
  for (let i = 0; i < boardGames.length; i++) {
    const game = boardGames[i];
    const color = colors[(i + 7) % colors.length]; // Offset for variety

    // Check if current image is valid
    let needsPlaceholder = true;
    if (game.imageUrl) {
      const currentPath = path.join(process.cwd(), "public", game.imageUrl);
      if (isValidImage(currentPath)) {
        needsPlaceholder = false;
      }
    }

    if (needsPlaceholder) {
      const categories = game.categories ? JSON.parse(game.categories) : [];
      const emoji = getEmoji(categories, false);
      const svg = createPlaceholderSVG(game.title, color, emoji);
      const filename = `${game.slug}.svg`;
      const filepath = path.join(boardDir, filename);

      fs.writeFileSync(filepath, svg);

      await prisma.boardGame.update({
        where: { slug: game.slug },
        data: { imageUrl: `/images/games/board/${filename}` }
      });

      fixedBoard++;
      console.log(`✓ Fixed: ${game.title}`);
    }
  }

  await prisma.$disconnect();

  console.log(`\n=== Summary ===`);
  console.log(`Fixed ${fixedDigital} digital games`);
  console.log(`Fixed ${fixedBoard} board games`);
  console.log(`Total: ${fixedDigital + fixedBoard} games now have valid images`);
}

main().catch(console.error);
