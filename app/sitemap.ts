import { MetadataRoute } from 'next';
import prisma from '@/lib/db';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boernespilguiden.dk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all games
  const [digitalGames, boardGames] = await Promise.all([
    prisma.game.findMany({
      select: { slug: true, updatedAt: true },
    }),
    prisma.boardGame.findMany({
      select: { slug: true, updatedAt: true },
    }),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/spil`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/braetspil`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/soeg`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/om`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privatlivspolitik`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/cookiepolitik`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Age category pages
  const ageGroups = ['0-3', '3-6', '7-10', '11-15'];
  const categoryPages: MetadataRoute.Sitemap = ageGroups.flatMap((age) => [
    {
      url: `${siteUrl}/spil/kategori/${age}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/braetspil/kategori/${age}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]);

  // Digital game pages
  const digitalGamePages: MetadataRoute.Sitemap = digitalGames.map((game) => ({
    url: `${siteUrl}/spil/${game.slug}`,
    lastModified: game.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Board game pages
  const boardGamePages: MetadataRoute.Sitemap = boardGames.map((game) => ({
    url: `${siteUrl}/braetspil/${game.slug}`,
    lastModified: game.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...digitalGamePages, ...boardGamePages];
}
