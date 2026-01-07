import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Color palette for placeholder images - vibrant and child-friendly
const colors = [
  "#FFB5A7", "#BAFFC9", "#BAE1FF", "#E2C2FF", "#FFD1DC",
  "#FFDAC1", "#B5EAD7", "#C7CEEA", "#FF9AA2", "#98DDCA",
  "#FFE5B4", "#D4A5A5", "#A8E6CF", "#DCEDC1", "#FFD3B6"
];

// Category-based emojis for digital games
const digitalEmojis: Record<string, string> = {
  "læring": "📚", "learning": "📚", "educational": "📚",
  "kreativitet": "🎨", "creative": "🎨", "creativity": "🎨",
  "eventyr": "🏰", "adventure": "🏰",
  "puslespil": "🧩", "puzzle": "🧩",
  "musik": "🎵", "music": "🎵",
  "kodning": "💻", "coding": "💻", "programming": "💻",
  "matematik": "🔢", "math": "🔢",
  "læsning": "📖", "reading": "📖",
  "sprog": "🗣️", "language": "🗣️",
  "simulation": "🌍", "world": "🌍",
  "building": "🏗️", "construction": "🏗️",
  "default": "🎮"
};

// Category-based emojis for board games
const boardEmojis: Record<string, string> = {
  "strategi": "♟️", "strategy": "♟️",
  "familie": "👨‍👩‍👧‍👦", "family": "👨‍👩‍👧‍👦",
  "samarbejde": "🤝", "cooperative": "🤝",
  "fest": "🎉", "party": "🎉",
  "kort": "🃏", "cards": "🃏",
  "hukommelse": "🧠", "memory": "🧠",
  "dexterity": "🤹", "balance": "🤹",
  "racing": "🏎️", "race": "🏎️",
  "deduction": "🔍", "mystery": "🔍",
  "default": "🎲"
};

// Game-specific emojis for well-known games
const specificEmojis: Record<string, string> = {
  "minecraft": "⛏️",
  "duolingo": "🦉",
  "khan-academy-kids": "🎓",
  "scratch-jr": "🐱",
  "toca-life-world": "🌍",
  "toca-kitchen-2": "🍳",
  "toca-hair-salon-4": "💇",
  "pbs-kids-games": "📺",
  "lego-duplo-world": "🧱",
  "sago-mini-world": "🐶",
  "endless-alphabet": "🔤",
  "monument-valley-2": "🏛️",
  "geoguessr": "🗺️",
  "stardew-valley": "🌾",
  "kahoot": "❓",
  "prodigy-math": "⚔️",
  "catan": "🏝️",
  "pandemic": "🦠",
  "ticket-to-ride": "🚂",
  "wingspan": "🐦",
  "azul": "🔷",
  "codenames": "🕵️",
  "dixit": "🐰",
  "king-of-tokyo": "👾",
  "carcassonne": "🏰",
  "splendor": "💎",
  "kingdomino": "👑",
  "forbidden-island": "🏝️",
  "mysterium": "👻",
  "candy-land": "🍬",
  "chutes-and-ladders": "🪜",
  "rhino-hero": "🦏",
  "animal-upon-animal": "🐻",
  "outfoxed": "🦊",
  "hoot-owl-hoot": "🦉",
  "sushi-go": "🍣",
  "dobble": "👁️",
  "blokus": "🟦",
  "labyrinth": "🌀",
  "sleeping-queens": "👸",
  "castle-panic": "🏰",
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

function createPlaceholderSVG(name: string, color: string, emoji: string): string {
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

  const displayLines = lines.slice(0, 3);
  const fontSize = displayLines.some(l => l.length > 12) ? 16 : displayLines.some(l => l.length > 10) ? 18 : 22;
  const lineHeight = fontSize + 8;
  const yStart = displayLines.length === 1 ? 170 : displayLines.length === 2 ? 155 : 140;

  const textElements = displayLines.map((line, i) =>
    `<text x="128" y="${yStart + i * lineHeight}" font-family="'Segoe UI', Arial, sans-serif" font-size="${fontSize}" font-weight="600" fill="#4A4A4A" text-anchor="middle">${escapeXml(line)}</text>`
  ).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${adjustColor(color, -30)};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15"/>
    </filter>
  </defs>
  <rect width="256" height="256" fill="url(#grad)" rx="32"/>
  <circle cx="128" cy="80" r="50" fill="white" fill-opacity="0.3"/>
  <text x="128" y="95" font-family="Apple Color Emoji, Segoe UI Emoji, sans-serif" font-size="56" text-anchor="middle" filter="url(#shadow)">${emoji}</text>
  ${textElements}
</svg>`;
}

function getEmoji(slug: string, categories: string[], isDigital: boolean): string {
  // First check for specific game emojis
  if (specificEmojis[slug]) {
    return specificEmojis[slug];
  }

  // Then check categories
  const emojiMap = isDigital ? digitalEmojis : boardEmojis;
  for (const cat of categories) {
    const normalized = cat.toLowerCase();
    if (emojiMap[normalized]) return emojiMap[normalized];
  }

  return emojiMap["default"];
}

function isValidImage(filepath: string): boolean {
  if (!fs.existsSync(filepath)) return false;
  const stats = fs.statSync(filepath);
  if (stats.size < 5000) return false;

  const buffer = Buffer.alloc(16);
  const fd = fs.openSync(filepath, 'r');
  fs.readSync(fd, buffer, 0, 16, 0);
  fs.closeSync(fd);

  // PNG
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return true;
  // JPEG
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true;
  // WEBP
  if (buffer.toString('utf8', 0, 4) === 'RIFF' && buffer.toString('utf8', 8, 12) === 'WEBP') return true;
  // GIF
  if (buffer.toString('utf8', 0, 3) === 'GIF') return true;

  // SVG - check if file contains SVG markup
  try {
    const content = fs.readFileSync(filepath, 'utf8').slice(0, 500);
    if (content.includes('<svg') || (content.includes('<?xml') && content.includes('svg'))) return true;
  } catch {}

  return false;
}

async function main() {
  const digitalDir = path.join(process.cwd(), "public/images/games/digital");
  const boardDir = path.join(process.cwd(), "public/images/games/board");

  fs.mkdirSync(digitalDir, { recursive: true });
  fs.mkdirSync(boardDir, { recursive: true });

  const games = await prisma.game.findMany({
    select: { slug: true, title: true, iconUrl: true, categories: true }
  });

  const boardGames = await prisma.boardGame.findMany({
    select: { slug: true, title: true, imageUrl: true, categories: true }
  });

  console.log(`\n=== Processing ${games.length} digital games ===\n`);
  let digitalValid = 0;
  let digitalFixed = 0;

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const color = colors[i % colors.length];

    // Check existing image
    if (game.iconUrl) {
      const currentPath = path.join(process.cwd(), "public", game.iconUrl);
      if (isValidImage(currentPath)) {
        console.log(`✓ ${game.title} (valid existing image)`);
        digitalValid++;
        continue;
      }
    }

    // Create placeholder
    const categories = game.categories ? JSON.parse(game.categories) : [];
    const emoji = getEmoji(game.slug, categories, true);
    const svg = createPlaceholderSVG(game.title, color, emoji);
    const filename = `${game.slug}.svg`;
    const filepath = path.join(digitalDir, filename);

    fs.writeFileSync(filepath, svg);
    await prisma.game.update({
      where: { slug: game.slug },
      data: { iconUrl: `/images/games/digital/${filename}` }
    });
    digitalFixed++;
    console.log(`✓ ${game.title} (placeholder created)`);
  }

  console.log(`\n=== Processing ${boardGames.length} board games ===\n`);
  let boardValid = 0;
  let boardFixed = 0;

  for (let i = 0; i < boardGames.length; i++) {
    const game = boardGames[i];
    const color = colors[(i + 7) % colors.length];

    // Check existing image
    if (game.imageUrl) {
      const currentPath = path.join(process.cwd(), "public", game.imageUrl);
      if (isValidImage(currentPath)) {
        console.log(`✓ ${game.title} (valid existing image)`);
        boardValid++;
        continue;
      }
    }

    // Create placeholder
    const categories = game.categories ? JSON.parse(game.categories) : [];
    const emoji = getEmoji(game.slug, categories, false);
    const svg = createPlaceholderSVG(game.title, color, emoji);
    const filename = `${game.slug}.svg`;
    const filepath = path.join(boardDir, filename);

    fs.writeFileSync(filepath, svg);
    await prisma.boardGame.update({
      where: { slug: game.slug },
      data: { imageUrl: `/images/games/board/${filename}` }
    });
    boardFixed++;
    console.log(`✓ ${game.title} (placeholder created)`);
  }

  await prisma.$disconnect();

  console.log(`\n=== Summary ===`);
  console.log(`Digital games: ${digitalValid} valid, ${digitalFixed} placeholders created`);
  console.log(`Board games: ${boardValid} valid, ${boardFixed} placeholders created`);
  console.log(`\nAll ${games.length + boardGames.length} games now have valid images!`);
}

main().catch(console.error);
