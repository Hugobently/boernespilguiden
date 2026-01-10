// Film & Serier Detail Page

import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { StreamingBadges } from '@/components/media/StreamingBadges';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const media = await prisma.media.findUnique({
    where: { slug: params.slug },
  });

  if (!media) {
    return {
      title: 'Ikke fundet',
    };
  }

  return {
    title: `${media.title} | Film & Serier | Børnespilguiden`,
    description: media.description || `Se ${media.title} - børne${media.type === 'MOVIE' ? 'film' : 'serie'}`,
  };
}

export default async function MediaDetailPage({ params }: PageProps) {
  const media = await prisma.media.findUnique({
    where: { slug: params.slug },
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <a
        href="/film-serier"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        ← Tilbage til oversigt
      </a>

      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        {/* Poster */}
        <div className="aspect-[2/3] relative bg-gray-100 rounded-lg overflow-hidden">
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
              <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium">
                🇩🇰 Dansk
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
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded">
                🇩🇰 Dansk tale
              </span>
            )}
            {media.hasDanishSubtitles && !media.hasDanishAudio && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded">
                🇩🇰 Danske undertekster
              </span>
            )}
          </div>

          {/* Streaming info */}
          {media.streamingInfo.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Se på:
              </h2>
              <StreamingBadges providers={media.streamingInfo} />
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

          {/* Review */}
          {media.review && (
            <div className="bg-blue-50 rounded-lg p-6">
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

      {/* Attribution */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
        <p>Data fra TMDB og JustWatch</p>
      </div>
    </div>
  );
}
