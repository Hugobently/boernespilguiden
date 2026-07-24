// Media Card Component for Film & Serier
// Uses theme colors to match GameCard styling

import Image from 'next/image';
import Link from 'next/link';
import { StreamingBadges } from './StreamingBadges';
import { Icon } from '@/components/ui/Icon';
import { DanishFlag } from '@/components/games/GameCardBadges';

interface MediaCardProps {
  slug: string;
  title: string;
  posterUrl: string | null;
  type: 'MOVIE' | 'SERIES';
  ageMin?: number | null;
  ageMax?: number | null;
  isDanish?: boolean;
  streamingInfo: Array<{ provider: string; isFree?: boolean }>;
  /** Sæt på above-the-fold-kort, så plakaten ikke lazy-loader synligt sent */
  imagePriority?: boolean;
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
  imagePriority = false,
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
            priority={imagePriority}
            loading={imagePriority ? undefined : 'lazy'}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#7A7A7A]">
            <Icon name={type === 'MOVIE' ? 'film' : 'tv'} className="w-8 h-8 mb-1" />
            <span className="text-xs">Intet billede</span>
          </div>
        )}

        {isDanish && (
          <span className="absolute top-2 left-2 bg-[#9B1B30] text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm inline-flex items-center gap-1">
            <DanishFlag />
            Dansk
          </span>
        )}

        <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full inline-flex items-center gap-1">
          <Icon name={type === 'MOVIE' ? 'film' : 'tv'} className="w-3.5 h-3.5" />
          {type === 'MOVIE' ? 'Film' : 'Serie'}
        </span>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-text-primary line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {ageText && (
          <p className="text-sm text-text-secondary mb-2 flex items-center gap-1.5">
            <Icon name="users" className="w-4 h-4" /> {ageText}
          </p>
        )}

        <StreamingBadges providers={streamingInfo} />
      </div>
    </Link>
  );
}
