// Film & Serier Detail Page

import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { StreamingBadges } from '@/components/media/StreamingBadges';
import { MediaParentInfo } from '@/components/media/MediaParentInfo';
import { MediaCard } from '@/components/media/MediaCard';
import { Icon } from '@/components/ui/Icon';
import { DanishFlag } from '@/components/games/GameCardBadges';
import { JsonLd, buildOpenGraph, generateBreadcrumbJsonLd, generateMediaJsonLd } from '@/lib/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Prerender all media pages at build time; unknown slugs still render on
// demand. The catalog only changes via deploys, so pages stay fresh.
export async function generateStaticParams() {
  try {
    const media = await prisma.media.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    return media.map((m) => ({ slug: m.slug }));
  } catch {
    // No database at build time (e.g. local build) — render on demand
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const media = await prisma.media.findUnique({
    where: { slug },
  });

  if (!media) {
    return {
      title: 'Ikke fundet',
    };
  }

  const typeWord = media.type === 'MOVIE' ? 'film' : 'serie';
  const ageText =
    media.ageMin != null && media.ageMax != null ? ` til børn ${media.ageMin}-${media.ageMax} år` : '';
  const title = `${media.title} – børne${typeWord}${ageText}`;
  const description =
    media.description?.slice(0, 155) ||
    `Forældreguide til ${media.title}: aldersanbefaling, indhold og hvor ${typeWord}en kan streames.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/film-serier/${slug}`,
    },
    openGraph: buildOpenGraph({
      title,
      description,
      url: `/film-serier/${slug}`,
      type: 'article',
      images: media.posterUrl ? [{ url: media.posterUrl, alt: media.title }] : undefined,
    }),
  };
}

export default async function MediaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const media = await prisma.media.findUnique({
    where: { slug },
    include: {
      streamingInfo: {
        where: { available: true },
      },
    },
  });

  if (!media) {
    notFound();
  }

  const typeLabel = media.type === 'MOVIE' ? 'Film' : 'Serie';
  const ageText =
    media.ageMin && media.ageMax ? `${media.ageMin}-${media.ageMax} år` : null;

  // Related titles: overlapping age range or shared genre
  const relatedConditions = [
    ...(media.ageMin != null && media.ageMax != null
      ? [{ ageMin: { lte: media.ageMax }, ageMax: { gte: media.ageMin } }]
      : []),
    ...(media.genres.length > 0 ? [{ genres: { hasSome: media.genres } }] : []),
  ];
  const relatedMedia = await prisma.media.findMany({
    where: {
      isActive: true,
      slug: { not: media.slug },
      ...(relatedConditions.length > 0 ? { OR: relatedConditions } : {}),
    },
    include: {
      streamingInfo: { where: { available: true } },
    },
    orderBy: [{ isFeatured: 'desc' }, { updatedAt: 'desc' }],
    take: 4,
  });

  const breadcrumbItems = [
    { name: 'Hjem', url: '/' },
    { name: 'Film & serier', url: '/film-serier' },
    { name: media.title },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={[generateMediaJsonLd(media), generateBreadcrumbJsonLd(breadcrumbItems)]} />

      {/* Breadcrumb */}
      <nav aria-label="Brødkrumme" className="mb-6 text-sm">
        <ol className="flex flex-wrap items-center gap-1 text-gray-500">
          <li>
            <Link href="/" className="text-[#C2410C] hover:underline">
              Hjem
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/film-serier" className="text-[#C2410C] hover:underline">
              Film &amp; serier
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-gray-700">
            {media.title}
          </li>
        </ol>
      </nav>

      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        {/* Poster */}
        <div className="aspect-[2/3] relative bg-gray-100 rounded-lg overflow-hidden md:sticky md:top-24 self-start">
          {media.posterUrl ? (
            <Image
              src={media.posterUrl}
              alt={media.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Intet billede
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {media.title}
              </h1>
              {media.originalTitle && media.originalTitle !== media.title && (
                <p className="text-lg text-gray-500 mb-2">
                  {media.originalTitle}
                </p>
              )}
            </div>
            {media.isDanish && (
              <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium inline-flex items-center gap-1.5">
                <DanishFlag /> Dansk
              </span>
            )}
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
            <span className="px-3 py-1 bg-gray-100 rounded">{typeLabel}</span>
            {ageText && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">
                {ageText}
              </span>
            )}
            {media.seasons && (
              <span className="px-3 py-1 bg-gray-100 rounded">
                {media.seasons} {media.seasons === 1 ? 'sæson' : 'sæsoner'}
              </span>
            )}
            {media.releaseDate && (
              <span className="px-3 py-1 bg-gray-100 rounded">
                {new Date(media.releaseDate).getFullYear()}
              </span>
            )}
            {media.hasDanishAudio && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded inline-flex items-center gap-1.5">
                <DanishFlag /> Dansk tale
              </span>
            )}
            {media.hasDanishSubtitles && !media.hasDanishAudio && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded inline-flex items-center gap-1.5">
                <DanishFlag /> Danske undertekster
              </span>
            )}
          </div>

          {/* Streaming info - Prominent section */}
          {media.streamingInfo.length > 0 && (
            <div className="mb-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-5 border border-primary-200">
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Icon name="tv" className="w-6 h-6 text-[#1D4E89]" /> Se {media.type === 'MOVIE' ? 'filmen' : 'serien'} her
              </h2>
              <StreamingBadges providers={media.streamingInfo} size="large" />
              {media.streamingInfo.some(s => s.isFree) && (
                <p className="mt-3 text-sm text-green-700 font-medium">
                  Gratis at se på udvalgte tjenester
                </p>
              )}
            </div>
          )}

          {/* Description */}
          {media.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Om {media.type === 'MOVIE' ? 'filmen' : 'serien'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {media.description}
              </p>
            </div>
          )}

          {/* Parent Info Section */}
          <MediaParentInfo
            mediaType={media.type as 'MOVIE' | 'SERIES'}
            parentInfo={media.parentInfo}
            parentTip={media.parentTip}
            pros={media.pros}
            cons={media.cons}
            hasDanishAudio={media.hasDanishAudio ?? undefined}
            hasDanishSubtitles={media.hasDanishSubtitles ?? undefined}
            hasViolence={media.hasViolence}
            hasScaryContent={media.hasScaryContent}
            hasLanguage={media.hasLanguage}
            hasEducational={media.hasEducational}
            minAge={media.ageMin}
            maxAge={media.ageMax}
            isFree={media.streamingInfo.some((s) => s.isFree)}
            streamingProviders={media.streamingInfo.map((s) => s.provider)}
          />

          {/* Review */}
          {media.review && (
            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Vores anmeldelse
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {media.review}
              </p>
            </div>
          )}

          {/* Genres */}
          {media.genres && media.genres.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Genrer:
              </h2>
              <div className="flex flex-wrap gap-2">
                {media.genres.map((genre: string) => (
                  <span
                    key={genre}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related titles */}
      {relatedMedia.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Icon name="tv" className="w-6 h-6 text-[#1D4E89]" /> Lignende film &amp; serier
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedMedia.map((related) => (
              <MediaCard
                key={related.slug}
                slug={related.slug}
                title={related.title}
                posterUrl={related.posterUrl}
                type={related.type as 'MOVIE' | 'SERIES'}
                ageMin={related.ageMin}
                ageMax={related.ageMax}
                isDanish={related.isDanish}
                streamingInfo={related.streamingInfo}
              />
            ))}
          </div>
        </div>
      )}

      {/* Attribution */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
        <p>Data fra TMDB og JustWatch</p>
      </div>
    </div>
  );
}
