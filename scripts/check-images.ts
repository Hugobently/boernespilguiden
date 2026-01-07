import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
  const games = await prisma.game.findMany({ select: { slug: true, iconUrl: true } });
  const boardGames = await prisma.boardGame.findMany({ select: { slug: true, imageUrl: true } });
  
  console.log("=== Digital Games ===");
  console.log("Total:", games.length);
  const noImage = games.filter(g => g.iconUrl === null || g.iconUrl === "");
  console.log("Missing images:", noImage.length);
  if (noImage.length > 0) {
    console.log("Games without images:", noImage.map(g => g.slug).slice(0, 30).join(", "));
  }
  
  console.log("\n=== Board Games ===");
  console.log("Total:", boardGames.length);
  const noImageBoard = boardGames.filter(g => g.imageUrl === null || g.imageUrl === "");
  console.log("Missing images:", noImageBoard.length);
  if (noImageBoard.length > 0) {
    console.log("Board games without images:", noImageBoard.map(g => g.slug).slice(0, 30).join(", "));
  }
  
  await prisma.$disconnect();
}
check();
