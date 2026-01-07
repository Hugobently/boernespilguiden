import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Using reliable placeholder images based on UI Avatars service
// These will show the game's initials in a colorful circle
function generatePlaceholderUrl(title: string, bgColor: string): string {
  const encoded = encodeURIComponent(title.substring(0, 2).toUpperCase());
  return `https://ui-avatars.com/api/?name=${encoded}&background=${bgColor}&color=fff&size=512&bold=true&font-size=0.4`;
}

// Digital game placeholder colors (based on age group)
const digitalGames = [
  // 0-3 år (pink)
  { slug: 'sago-mini-world', color: 'FFD1DC' },
  { slug: 'lego-duplo-world', color: 'FFD1DC' },
  { slug: 'peek-a-zoo', color: 'FFD1DC' },
  { slug: 'pbs-kids-games', color: 'FFD1DC' },
  { slug: 'fisher-price-laugh-learn', color: 'FFD1DC' },
  { slug: 'baby-shark-world', color: 'FFD1DC' },
  { slug: 'tiny-hands-first-words', color: 'FFD1DC' },
  { slug: 'hey-duggee-big-badge-app', color: 'FFD1DC' },

  // 3-6 år (green)
  { slug: 'toca-hair-salon-4', color: 'BAFFC9' },
  { slug: 'toca-kitchen-2', color: 'BAFFC9' },
  { slug: 'toca-life-town', color: 'BAFFC9' },
  { slug: 'toca-life-world', color: 'BAFFC9' },
  { slug: 'dr-panda-town', color: 'BAFFC9' },
  { slug: 'khan-academy-kids', color: 'BAFFC9' },
  { slug: 'endless-alphabet', color: 'BAFFC9' },
  { slug: 'duolingo-abc', color: 'BAFFC9' },
  { slug: 'lego-builders-journey', color: 'BAFFC9' },
  { slug: 'pok-pok-playroom', color: 'BAFFC9' },
  { slug: 'montessori-preschool', color: 'BAFFC9' },
  { slug: 'teach-your-monster-to-read', color: 'BAFFC9' },
  { slug: 'daniel-tigers-neighborhood', color: 'BAFFC9' },

  // 7-10 år (blue)
  { slug: 'minecraft', color: 'BAE1FF' },
  { slug: 'monument-valley-2', color: 'BAE1FF' },
  { slug: 'scratch-jr', color: 'BAE1FF' },
  { slug: 'altos-odyssey', color: 'BAE1FF' },
  { slug: 'dragonbox-numbers', color: 'BAE1FF' },
  { slug: 'dragonbox-algebra', color: 'BAE1FF' },
  { slug: 'prodigy-math', color: 'BAE1FF' },
  { slug: 'lightbot-code-hour', color: 'BAE1FF' },
  { slug: 'thinkrolls-2', color: 'BAE1FF' },
  { slug: 'moose-math', color: 'BAE1FF' },
  { slug: 'todo-math', color: 'BAE1FF' },
  { slug: 'busy-shapes-colors', color: 'BAE1FF' },
  { slug: 'arties-world', color: 'BAE1FF' },
  { slug: 'human-resource-machine', color: 'BAE1FF' },
  { slug: 'stack-the-states', color: 'BAE1FF' },
  { slug: 'osmo-coding', color: 'BAE1FF' },
  { slug: 'geoguessr', color: 'BAE1FF' },
  { slug: 'tynker', color: 'BAE1FF' },
  { slug: 'brainpop-jr', color: 'BAE1FF' },
  { slug: 'hopscotch', color: 'BAE1FF' },

  // 11-15 år (purple)
  { slug: 'civilization-vi', color: 'E2C2FF' },
  { slug: 'kerbal-space-program', color: 'E2C2FF' },
  { slug: 'portal', color: 'E2C2FF' },
  { slug: 'stardew-valley', color: 'E2C2FF' },
  { slug: 'cities-skylines', color: 'E2C2FF' },
  { slug: 'duolingo', color: 'E2C2FF' },
  { slug: 'factorio', color: 'E2C2FF' },
  { slug: 'the-room', color: 'E2C2FF' },
  { slug: 'mini-metro', color: 'E2C2FF' },
  { slug: 'bloons-td-6', color: 'E2C2FF' },
];

// Board game placeholder colors
const boardGames = [
  // 0-3 år
  { slug: 'haba-first-orchard', color: 'FFD1DC' },
  { slug: 'feed-the-woozle', color: 'FFD1DC' },
  { slug: 'sneaky-snacky-squirrel', color: 'FFD1DC' },
  { slug: 'roll-and-play', color: 'FFD1DC' },
  { slug: 'count-your-chickens', color: 'FFD1DC' },
  { slug: 'go-away-monster', color: 'FFD1DC' },

  // 3-6 år
  { slug: 'zingo', color: 'BAFFC9' },
  { slug: 'very-hungry-caterpillar-game', color: 'BAFFC9' },
  { slug: 'candy-land', color: 'BAFFC9' },
  { slug: 'chutes-and-ladders', color: 'BAFFC9' },
  { slug: 'hi-ho-cherry-o', color: 'BAFFC9' },
  { slug: 'outfoxed', color: 'BAFFC9' },
  { slug: 'hoot-owl-hoot', color: 'BAFFC9' },
  { slug: 'my-first-carcassonne', color: 'BAFFC9' },
  { slug: 'rhino-hero', color: 'BAFFC9' },
  { slug: 'animal-upon-animal', color: 'BAFFC9' },
  { slug: 'monza', color: 'BAFFC9' },
  { slug: 'sequence-for-kids', color: 'BAFFC9' },
  { slug: 'spot-it-jr-animals', color: 'BAFFC9' },
  { slug: 'bus-stop', color: 'BAFFC9' },

  // 7-10 år
  { slug: 'ticket-to-ride-first-journey', color: 'BAE1FF' },
  { slug: 'catan-junior', color: 'BAE1FF' },
  { slug: 'king-of-tokyo', color: 'BAE1FF' },
  { slug: 'sleeping-queens', color: 'BAE1FF' },
  { slug: 'labyrinth', color: 'BAE1FF' },
  { slug: 'blokus', color: 'BAE1FF' },
  { slug: 'dixit', color: 'BAE1FF' },
  { slug: 'sushi-go', color: 'BAE1FF' },
  { slug: 'splendor', color: 'BAE1FF' },
  { slug: 'kingdomino', color: 'BAE1FF' },
  { slug: 'forbidden-island', color: 'BAE1FF' },
  { slug: 'dobble', color: 'BAE1FF' },

  // 11-15 år
  { slug: 'catan', color: 'E2C2FF' },
  { slug: 'ticket-to-ride', color: 'E2C2FF' },
  { slug: 'codenames', color: 'E2C2FF' },
  { slug: 'wingspan', color: 'E2C2FF' },
  { slug: 'azul', color: 'E2C2FF' },
  { slug: '7-wonders', color: 'E2C2FF' },
  { slug: 'pandemic', color: 'E2C2FF' },
  { slug: 'mysterium', color: 'E2C2FF' },
];

async function main() {
  console.log('Updating digital game images...');

  for (const game of digitalGames) {
    try {
      const dbGame = await prisma.game.findUnique({ where: { slug: game.slug } });
      if (dbGame) {
        const iconUrl = generatePlaceholderUrl(dbGame.title, game.color);
        await prisma.game.update({
          where: { slug: game.slug },
          data: { iconUrl },
        });
        console.log(`✓ ${dbGame.title}`);
      }
    } catch (error) {
      console.log(`✗ ${game.slug}`);
    }
  }

  console.log('\nUpdating board game images...');

  for (const game of boardGames) {
    try {
      const dbGame = await prisma.boardGame.findUnique({ where: { slug: game.slug } });
      if (dbGame) {
        const imageUrl = generatePlaceholderUrl(dbGame.title, game.color);
        await prisma.boardGame.update({
          where: { slug: game.slug },
          data: { imageUrl },
        });
        console.log(`✓ ${dbGame.title}`);
      }
    } catch (error) {
      console.log(`✗ ${game.slug}`);
    }
  }

  console.log('\nDone! All games now have placeholder images.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
