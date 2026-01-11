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
      className="group block bg-[#FFFCF7] rounded-2xl shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06),0_4px_8px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-200 overflow-hidden border border-[#F5E6D3]/50"
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
        <h3 className="font-semibold text-[#4A4A4A] line-clamp-2 mb-1 group-hover:text-[#F8A99B] transition-colors">
          {title}
        </h3>

        {ageText && (
          <p className="text-sm text-[#7A7A7A] mb-2 flex items-center gap-1">
            <span>👶</span> {ageText}
          </p>
        )}

        <StreamingBadges providers={streamingInfo} />
      </div>
    </Link>
  );
}
