import { MetadataRoute } from 'next';
import prisma from '@/lib/db';
import { ALL_TOPICS } from '@/lib/topics';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xn--brnespilguiden-qqb.dk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all content. A DB hiccup must not kill the build (the sitemap is
  // prerendered) - fall back to the static pages only.
  let digitalGames: Array<{ slug: string; updatedAt: Date }> = [];
  let boardGames: Array<{ slug: string; updatedAt: Date }> = [];
  let media: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    [digitalGames, boardGames, media] = await Promise.all([
      prisma.game.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.boardGame.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.media.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);
  } catch (error) {
    console.error('Sitemap: could not fetch content from database', error);
  }

  // Use the newest content change as lastModified for listing/static pages,
  // so lastmod stays meaningful instead of changing on every request
  const allDates = [...digitalGames, ...boardGames, ...media].map((item) =>
    item.updatedAt.getTime()
  );
  const newestContentDate = allDates.length > 0 ? new Date(Math.max(...allDates)) : new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: newestContentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/spil`,
      lastModified: newestContentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/braetspil`,
      lastModified: newestContentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/film-serier`,
      lastModified: newestContentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/om`,
      lastModified: newestContentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/saadan-tester-vi`,
      lastModified: newestContentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/kontakt`,
      lastModified: newestContentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privatlivspolitik`,
      lastModified: newestContentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/cookiepolitik`,
      lastModified: newestContentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Age category pages
  const ageGroups = ['0-3', '3-6', '7+'];
  const categoryPages: MetadataRoute.Sitemap = ageGroups.flatMap((age) => [
    {
      url: `${siteUrl}/spil/kategori/${age}`,
      lastModified: newestContentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/braetspil/kategori/${age}`,
      lastModified: newestContentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]);

  // Topic landing pages (uden-reklamer, gratis, laeringsspil, ...)
  const topicPages: MetadataRoute.Sitemap = ALL_TOPICS.map((topic) => ({
    url: `${siteUrl}${topic.path}`,
    lastModified: newestContentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

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

  // Media pages (film & serier)
  const mediaPages: MetadataRoute.Sitemap = media.map((item) => ({
    url: `${siteUrl}/film-serier/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...topicPages, ...digitalGamePages, ...boardGamePages, ...mediaPages];
}
