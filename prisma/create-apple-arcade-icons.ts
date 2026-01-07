const fs = require('fs');
const path = require('path');

// Apple Arcade games that need SVG icons
const games = [
  { slug: 'sneaky-sasquatch', name: 'Sneaky Sasquatch', color: '#4A7C59', emoji: '🦶' },
  { slug: 'tangle-tower', name: 'Tangle Tower', color: '#8B4513', emoji: '🏰' },
  { slug: 'lego-brawls', name: 'LEGO Brawls', color: '#E4002B', emoji: '🧱' },
  { slug: 'patterned', name: 'Patterned', color: '#9B59B6', emoji: '🎨' },
  { slug: 'cut-the-rope-3', name: 'Cut the Rope 3', color: '#27AE60', emoji: '🍬' },
  { slug: 'crossy-road-castle', name: 'Crossy Road Castle', color: '#3498DB', emoji: '🏯' },
  { slug: 'sonic-racing', name: 'Sonic Racing', color: '#0066CC', emoji: '🏎️' },
  { slug: 'spire-blast', name: 'Spire Blast', color: '#E74C3C', emoji: '💥' },
  { slug: 'sago-mini-friends', name: 'Sago Mini Friends', color: '#FF6B9D', emoji: '🐕' },
  { slug: 'my-talking-tom-friends', name: 'My Talking Tom', color: '#95A5A6', emoji: '🐱' },
  { slug: 'the-get-out-kids', name: 'The Get Out Kids', color: '#F39C12', emoji: '🔦' },
  { slug: 'transformers-tactical-arena', name: 'Transformers', color: '#C0392B', emoji: '🤖' },
  { slug: 'wylde-flowers', name: 'Wylde Flowers', color: '#8E44AD', emoji: '🌸' },
  { slug: 'cooking-mama-cuisine', name: 'Cooking Mama', color: '#E67E22', emoji: '👩‍🍳' },
  { slug: 'mineko-night-market', name: "Mineko's Night Market", color: '#1ABC9C', emoji: '🐱' },
  { slug: 'stitch', name: 'Stitch.', color: '#E91E63', emoji: '🧵' },
  { slug: 'peppa-pig-party-time', name: 'Peppa Pig', color: '#FF69B4', emoji: '🐷' },
  { slug: 'taiko-no-tatsujin', name: 'Taiko no Tatsujin', color: '#FF5722', emoji: '🥁' },
  { slug: 'hello-kitty-island-adventure', name: 'Hello Kitty', color: '#FF1493', emoji: '🎀' },
];

// Generate SVG icon for each game
function generateSVG(game: { name: string; color: string; emoji: string }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${game.color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${adjustColor(game.color, -30)};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="90" fill="url(#bg)"/>
  <text x="256" y="280" font-size="180" text-anchor="middle" dominant-baseline="middle">${game.emoji}</text>
</svg>`;
}

// Darken/lighten color
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const outputDir = path.join(__dirname, '../public/images/games/digital');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create SVG files
games.forEach(game => {
  const svg = generateSVG(game);
  const filePath = path.join(outputDir, `${game.slug}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`✓ Created: ${game.slug}.svg`);
});

console.log('\nDone! Created SVG icons for all Apple Arcade games.');
