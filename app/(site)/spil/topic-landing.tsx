import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { Navigation } from '@/components/layout';
import { GameGrid } from '@/components/games';
import { FloatingBlobs } from '@/components/brand';
import { getGamesWithTranslation } from '@/lib/translations';
import { toGameCardData } from '@/lib/game-card-data';
import { JsonLd, generateBreadcrumbJsonLd, siteConfig } from '@/lib/seo';
import { ALL_TOPICS, TopicConfig } from '@/lib/topics';

/**
 * Shared server component for topic landing pages
 * (/spil/uden-reklamer, /spil/emne/laeringsspil, ...).
 */
export async function TopicLandingPage({ topic }: { topic: TopicConfig }) {
  const locale = await getLocale();
  const games = await getGamesWithTranslation(
    {
      where: topic.where,
      orderBy: { rating: 'desc' },
    },
    locale
  );

  const breadcrumbItems = [
    { name: 'Forside', url: '/' },
    { name: 'Digitale spil', url: '/spil' },
    { name: topic.h1 },
  ];

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: topic.h1,
    description: topic.metaDescription,
    url: `${siteConfig.url}${topic.path}`,
    inLanguage: 'da',
    numberOfItems: games.length,
  };

  const otherTopics = ALL_TOPICS.filter((t) => t.slug !== topic.slug);

  return (
    <div className="relative min-h-screen">
      <JsonLd data={generateBreadcrumbJsonLd(breadcrumbItems)} />
      <JsonLd data={collectionJsonLd} />

      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-mint-light/30 via-transparent to-transparent pointer-events-none" />
      <FloatingBlobs className="opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Navigation
          breadcrumbs={[
            { label: 'Digitale spil', href: '/spil' },
            { label: topic.h1 },
          ]}
          className="mb-8"
        />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl sm:text-5xl">{topic.emoji}</span>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
                {topic.h1}
              </h1>
              <p className="text-text-secondary">
                {games.length} spil, sorteret efter vores vurdering
              </p>
            </div>
          </div>

          {/* Intro copy */}
          <div className="max-w-3xl space-y-4">
            {topic.intro.map((paragraph, index) => (
              <p key={index} className="text-[#4A4A4A] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <GameGrid games={games.map(toGameCardData)} type="digital" />

        {/* Cross-links to the other topic pages */}
        <section className="mt-16">
          <h2 className="text-xl font-bold text-[#4A4A4A] mb-4">
            Udforsk flere emner
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherTopics.map((t) => (
              <Link
                key={t.slug}
                href={t.path}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-sm font-medium text-[#4A4A4A] border border-[#FFB5A7]/20 shadow-sm hover:border-[#FFB5A7]/60 hover:-translate-y-0.5 transition-all"
              >
                <span>{t.emoji}</span>
                <span>{t.h1}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
