// Media Card Component for Film & Serier

import Image from 'next/image';
import Link from 'next/link';
import { StreamingBadges } from './StreamingBadges';

interface MediaCardProps {
  slug: string;
  title: string;
  posterUrl: string | null;
  type: 'MOVIE' | 'SERIES';
  ageMin?: number | null;
  ageMax?: number | null;
  isDanish?: boolean;
  streamingInfo: Array<{ provider: string; isFree?: boolean }>;
}

export function MediaCard({
  slug,
  title,
  posterUrl,
  type,
  ageMin,
  ageMax,
  isDanish,
  streamingInfo,
}: MediaCardProps) {
  const ageText = ageMin && ageMax ? `${ageMin}-${ageMax} år` : null;

  return (
    <Link
      href={`/film-serier/${slug}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="aspect-[2/3] relative bg-gray-100">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Intet billede
          </div>
        )}

        {isDanish && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
            🇩🇰 Dansk
          </span>
        )}

        <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
          {type === 'MOVIE' ? 'Film' : 'Serie'}
        </span>
      </div>

      <div className="p-3">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
          {title}
        </h3>

        {ageText && <p className="text-sm text-gray-500 mb-2">{ageText}</p>}

        <StreamingBadges providers={streamingInfo} />
      </div>
    </Link>
  );
}
