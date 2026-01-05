import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Eventyr', slug: 'eventyr', icon: '🗺️' },
  { name: 'Puslespil', slug: 'puslespil', icon: '🧩' },
  { name: 'Strategi', slug: 'strategi', icon: '♟️' },
  { name: 'Læring', slug: 'laering', icon: '📚' },
  { name: 'Action', slug: 'action', icon: '💥' },
  { name: 'Kreativt', slug: 'kreativt', icon: '🎨' },
  { name: 'Familie', slug: 'familie', icon: '👨‍👩‍👧‍👦' },
  { name: 'Party', slug: 'party', icon: '🎉' },
];

const games = [
  // Digital games
  {
    slug: 'minecraft',
    title: 'Minecraft',
    description:
      'Et kreativt sandkassespil hvor børn kan bygge og udforske uendelige verdener. Perfekt til at fremme kreativitet og problemløsning.',
    type: 'DIGITAL',
    minAge: 7,
    maxAge: 99,
    playTime: '30+ min',
    rating: 4.8,
    featured: true,
    categories: ['kreativt', 'eventyr'],
  },
  {
    slug: 'lego-spil',
    title: 'LEGO Videospil',
    description:
      'Sjove og farverige LEGO-spil med populære temaer som Star Wars, Harry Potter og Marvel. Gode til samarbejde.',
    type: 'DIGITAL',
    minAge: 5,
    maxAge: 12,
    playTime: '30-60 min',
    rating: 4.5,
    featured: false,
    categories: ['eventyr', 'action'],
  },
  {
    slug: 'animal-crossing',
    title: 'Animal Crossing',
    description:
      'Et hyggeligt simuleringsspil hvor man bygger sin egen ø og interagerer med søde dyrebeboere.',
    type: 'DIGITAL',
    minAge: 6,
    maxAge: 99,
    playTime: '15-60 min',
    rating: 4.7,
    featured: true,
    categories: ['kreativt', 'familie'],
  },
  {
    slug: 'super-mario-wonder',
    title: 'Super Mario Bros. Wonder',
    description:
      'Det nyeste Mario platformspil med farverige verdener og sjove power-ups. Perfekt til hele familien.',
    type: 'DIGITAL',
    minAge: 6,
    maxAge: 99,
    playTime: '20-40 min',
    rating: 4.9,
    featured: true,
    categories: ['action', 'familie'],
  },
  {
    slug: 'khan-academy-kids',
    title: 'Khan Academy Kids',
    description:
      'Gratis læringsspil med matematik, læsning og problemløsning. Perfekt til de små.',
    type: 'DIGITAL',
    minAge: 2,
    maxAge: 7,
    playTime: '10-20 min',
    rating: 4.6,
    featured: false,
    categories: ['laering'],
  },

  // Board games
  {
    slug: 'uno',
    title: 'UNO',
    description:
      'Det klassiske kortspil som alle kender. Nemt at lære og sjovt for hele familien.',
    type: 'BOARD',
    minAge: 7,
    maxAge: 99,
    minPlayers: 2,
    maxPlayers: 10,
    playTime: '15-30 min',
    rating: 4.3,
    featured: false,
    categories: ['familie', 'party'],
  },
  {
    slug: 'ticket-to-ride',
    title: 'Ticket to Ride',
    description:
      'Byg jernbaner på tværs af kontinenter i dette prisvindende strategispil.',
    type: 'BOARD',
    minAge: 8,
    maxAge: 99,
    minPlayers: 2,
    maxPlayers: 5,
    playTime: '30-60 min',
    rating: 4.7,
    featured: true,
    categories: ['strategi', 'familie'],
  },
  {
    slug: 'catan-junior',
    title: 'Catan Junior',
    description:
      'En børnevenlig version af det populære Catan. Perfekt introduktion til strategispil.',
    type: 'BOARD',
    minAge: 6,
    maxAge: 12,
    minPlayers: 2,
    maxPlayers: 4,
    playTime: '30 min',
    rating: 4.4,
    featured: true,
    categories: ['strategi', 'familie'],
  },
  {
    slug: 'dobble',
    title: 'Dobble',
    description:
      'Hurtigt reaktionsspil hvor man skal finde matchende symboler. Sjovt for alle aldre.',
    type: 'BOARD',
    minAge: 6,
    maxAge: 99,
    minPlayers: 2,
    maxPlayers: 8,
    playTime: '15 min',
    rating: 4.5,
    featured: false,
    categories: ['party', 'familie'],
  },
  {
    slug: 'haba-orchard',
    title: 'HABA Frugthaven',
    description:
      'Samarbejdsspil for de helt små. Hjælp hinanden med at høste frugt før ravnen kommer.',
    type: 'BOARD',
    minAge: 3,
    maxAge: 6,
    minPlayers: 1,
    maxPlayers: 8,
    playTime: '10-15 min',
    rating: 4.6,
    featured: true,
    categories: ['familie', 'laering'],
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }
  console.log('✅ Categories created');

  // Create games with categories
  for (const game of games) {
    const { categories: categorySlugs, ...gameData } = game;

    const createdGame = await prisma.game.upsert({
      where: { slug: game.slug },
      update: gameData,
      create: gameData,
    });

    // Connect categories
    await prisma.gameCategory.deleteMany({
      where: { gameId: createdGame.id },
    });

    for (const categorySlug of categorySlugs) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });

      if (category) {
        await prisma.gameCategory.create({
          data: {
            gameId: createdGame.id,
            categoryId: category.id,
          },
        });
      }
    }
  }
  console.log('✅ Games created');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
