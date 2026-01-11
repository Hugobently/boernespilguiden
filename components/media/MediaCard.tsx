// Media Card Component for Film & Serier
// Uses theme colors to match GameCard styling

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
      className="group block bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 overflow-hidden border border-white/50"
    >
      <div className="aspect-[2/3] relative bg-[#F5E6D3]/30">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#7A7A7A]">
            <span className="text-3xl mb-1">{type === 'MOVIE' ? '🎬' : '📺'}</span>
            <span className="text-xs">Intet billede</span>
          </div>
        )}

        {isDanish && (
          <span className="absolute top-2 left-2 bg-[#9B1B30] text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
            🇩🇰 Dansk
          </span>
        )}

        <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
          {type === 'MOVIE' ? '🎬 Film' : '📺 Serie'}
        </span>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-text-primary line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {ageText && (
          <p className="text-sm text-text-secondary mb-2 flex items-center gap-1">
            <span>👶</span> {ageText}
          </p>
        )}

        <StreamingBadges providers={streamingInfo} />
      </div>
    </Link>
  );
}
