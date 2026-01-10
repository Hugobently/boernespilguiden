const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.POSTGRES_URL } } });

(async () => {
  const items = await prisma.media.findMany({
    where: {
      isActive: true,
      description: { not: null },
      OR: [
        { parentInfo: null },
        { pros: { equals: [] } },
      ],
    },
    take: 5,
    select: { id: true, title: true, parentInfo: true, pros: true, description: true },
  });

  console.log('Found items:', items.length);
  items.forEach(item => {
    console.log({
      title: item.title,
      hasParentInfo: item.parentInfo !== null,
      prosLength: item.pros ? item.pros.length : 0,
      hasDescription: item.description !== null
    });
  });

  await prisma.$disconnect();
})();
