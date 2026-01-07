import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function verifyData() {
  console.log('');
  console.log('='.repeat(60));
  console.log('  BØRNESPILGUIDEN - Data Verification Report');
  console.log('='.repeat(60));
  console.log('');

  // Verify Digital Games
  console.log('DIGITAL GAMES');
  console.log('-'.repeat(40));

  const games = await prisma.game.findMany();
  console.log(`Total games: ${games.length}`);

  const gamesWithIcon = games.filter(g => g.iconUrl);
  const gamesWithAppStore = games.filter(g => g.appStoreUrl);
  const gamesWithPlayStore = games.filter(g => g.playStoreUrl);
  const gamesWithWebsite = games.filter(g => g.websiteUrl);

  console.log(`With icon URL: ${gamesWithIcon.length}`);
  console.log(`With App Store link: ${gamesWithAppStore.length}`);
  console.log(`With Play Store link: ${gamesWithPlayStore.length}`);
  console.log(`With website: ${gamesWithWebsite.length}`);

  // Check for local image files
  const digitalImagesDir = path.join(process.cwd(), 'public/images/games/digital');
  let digitalImagesCount = 0;
  const missingDigitalImages: string[] = [];

  for (const game of games) {
    const jpgPath = path.join(digitalImagesDir, `${game.slug}.jpg`);
    const pngPath = path.join(digitalImagesDir, `${game.slug}.png`);
    const svgPath = path.join(digitalImagesDir, `${game.slug}.svg`);

    if (fs.existsSync(jpgPath) || fs.existsSync(pngPath) || fs.existsSync(svgPath)) {
      digitalImagesCount++;
    } else {
      missingDigitalImages.push(game.slug);
    }
  }

  console.log(`With local image file: ${digitalImagesCount}/${games.length}`);

  if (missingDigitalImages.length > 0 && missingDigitalImages.length <= 10) {
    console.log(`Missing images: ${missingDigitalImages.join(', ')}`);
  } else if (missingDigitalImages.length > 10) {
    console.log(`Missing images: ${missingDigitalImages.length} games`);
  }

  // Check for games without any download link
  const gamesWithoutLinks = games.filter(g => !g.appStoreUrl && !g.playStoreUrl && !g.websiteUrl);
  if (gamesWithoutLinks.length > 0) {
    console.log(`\nGames without any download link (${gamesWithoutLinks.length}):`);
    gamesWithoutLinks.forEach(g => console.log(`  - ${g.title} (${g.slug})`));
  }

  // Verify Board Games
  console.log('');
  console.log('BOARD GAMES');
  console.log('-'.repeat(40));

  const boardGames = await prisma.boardGame.findMany();
  console.log(`Total board games: ${boardGames.length}`);

  const boardGamesWithImage = boardGames.filter(g => g.imageUrl);
  const boardGamesWithAmazon = boardGames.filter(g => g.amazonUrl);

  console.log(`With image URL: ${boardGamesWithImage.length}`);
  console.log(`With Amazon link: ${boardGamesWithAmazon.length}`);

  // Check for local board game images
  const boardImagesDir = path.join(process.cwd(), 'public/images/games/board');
  let boardImagesCount = 0;
  const missingBoardImages: string[] = [];

  for (const game of boardGames) {
    const jpgPath = path.join(boardImagesDir, `${game.slug}.jpg`);
    const pngPath = path.join(boardImagesDir, `${game.slug}.png`);
    const svgPath = path.join(boardImagesDir, `${game.slug}.svg`);

    if (fs.existsSync(jpgPath) || fs.existsSync(pngPath) || fs.existsSync(svgPath)) {
      boardImagesCount++;
    } else {
      missingBoardImages.push(game.slug);
    }
  }

  console.log(`With local image file: ${boardImagesCount}/${boardGames.length}`);

  if (missingBoardImages.length > 0) {
    console.log(`Missing images: ${missingBoardImages.join(', ')}`);
  }

  // Age group distribution
  console.log('');
  console.log('AGE GROUP DISTRIBUTION');
  console.log('-'.repeat(40));

  const digitalByAge = {
    '0-3': games.filter(g => g.ageGroup === '0-3').length,
    '3-6': games.filter(g => g.ageGroup === '3-6').length,
    '7-10': games.filter(g => g.ageGroup === '7-10').length,
    '11-15': games.filter(g => g.ageGroup === '11-15').length,
  };

  const boardByAge = {
    '0-3': boardGames.filter(g => g.ageGroup === '0-3').length,
    '3-6': boardGames.filter(g => g.ageGroup === '3-6').length,
    '7-10': boardGames.filter(g => g.ageGroup === '7-10').length,
    '11-15': boardGames.filter(g => g.ageGroup === '11-15').length,
  };

  console.log('Digital games:');
  Object.entries(digitalByAge).forEach(([age, count]) => {
    console.log(`  ${age}: ${count} games`);
  });

  console.log('Board games:');
  Object.entries(boardByAge).forEach(([age, count]) => {
    console.log(`  ${age}: ${count} games`);
  });

  // Data quality checks
  console.log('');
  console.log('DATA QUALITY CHECKS');
  console.log('-'.repeat(40));

  const gamesWithoutDescription = games.filter(g => !g.description || g.description.length < 50);
  const gamesWithoutShortDesc = games.filter(g => !g.shortDescription || g.shortDescription.length < 20);
  const gamesWithoutRating = games.filter(g => !g.rating || g.rating === 0);

  console.log(`Games with short/missing description: ${gamesWithoutDescription.length}`);
  console.log(`Games with short/missing short description: ${gamesWithoutShortDesc.length}`);
  console.log(`Games without rating: ${gamesWithoutRating.length}`);

  const boardGamesWithoutDesc = boardGames.filter(g => !g.description || g.description.length < 50);
  const boardGamesWithoutRating = boardGames.filter(g => !g.rating || g.rating === 0);

  console.log(`Board games with short/missing description: ${boardGamesWithoutDesc.length}`);
  console.log(`Board games without rating: ${boardGamesWithoutRating.length}`);

  // Featured and Editor's Choice
  console.log('');
  console.log('FEATURED & EDITOR\'S CHOICE');
  console.log('-'.repeat(40));

  const featuredDigital = games.filter(g => g.featured);
  const editorChoiceDigital = games.filter(g => g.editorChoice);
  const featuredBoard = boardGames.filter(g => g.featured);
  const editorChoiceBoard = boardGames.filter(g => g.editorChoice);

  console.log(`Featured digital games: ${featuredDigital.length}`);
  console.log(`Editor's choice digital games: ${editorChoiceDigital.length}`);
  console.log(`Featured board games: ${featuredBoard.length}`);
  console.log(`Editor's choice board games: ${editorChoiceBoard.length}`);

  // Summary
  console.log('');
  console.log('='.repeat(60));
  console.log('  SUMMARY');
  console.log('='.repeat(60));
  console.log('');

  const issues: string[] = [];

  if (missingDigitalImages.length > 5) {
    issues.push(`${missingDigitalImages.length} digital games missing local images`);
  }
  if (missingBoardImages.length > 0) {
    issues.push(`${missingBoardImages.length} board games missing local images`);
  }
  if (gamesWithoutLinks.length > 0) {
    issues.push(`${gamesWithoutLinks.length} games without any download link`);
  }
  if (gamesWithoutRating.length > 0) {
    issues.push(`${gamesWithoutRating.length} games without rating`);
  }

  if (issues.length === 0) {
    console.log('All checks passed! Data looks good for launch.');
  } else {
    console.log('Issues found:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  }

  console.log('');
  console.log(`Total content: ${games.length} digital games + ${boardGames.length} board games = ${games.length + boardGames.length} games`);
  console.log('');
}

verifyData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
