// Fix broken local image paths in database
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function fixBrokenLocalPaths() {
  const games = await prisma.game.findMany({
    select: { id: true, slug: true, iconUrl: true, appStoreUrl: true },
  });

  const imageDir = path.join(__dirname, '../public/images/games/digital');
  const extensions = ['jpg', 'png', 'webp', 'svg'];

  let fixed = 0;
  let stillBroken = [];

  for (const game of games) {
    if (!game.iconUrl || !game.iconUrl.startsWith('/images/')) continue;

    const fullPath = path.join(__dirname, '../public', game.iconUrl);

    if (fs.existsSync(fullPath)) continue;

    let found = false;
    for (const ext of extensions) {
      const testPath = path.join(imageDir, game.slug + '.' + ext);
      if (fs.existsSync(testPath)) {
        const newIconUrl = '/images/games/digital/' + game.slug + '.' + ext;
        await prisma.game.update({
          where: { id: game.id },
          data: { iconUrl: newIconUrl }
        });
        console.log('✅ Fixed', game.slug, '->', newIconUrl);
        fixed++;
        found = true;
        break;
      }
    }

    if (!found) {
      stillBroken.push(game.slug);
    }
  }

  console.log('');
  console.log('=== SUMMARY ===');
  console.log('Fixed:', fixed);
  console.log('Still broken:', stillBroken.length);
  if (stillBroken.length > 0) {
    console.log('Missing local files for:', stillBroken.join(', '));
  }

  await prisma.$disconnect();
}

fixBrokenLocalPaths().catch(console.error);
