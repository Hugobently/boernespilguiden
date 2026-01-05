import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, Badge } from '@/components/ui';
import { cn, getAgeLabel } from '@/lib/utils';

interface GameCardProps {
  slug: string;
  title: string;
  description: string;
  type: string;
  minAge: number;
  maxAge: number;
  imageUrl?: string | null;
  rating?: number | null;
  featured?: boolean;
  className?: string;
}

export function GameCard({
  slug,
  title,
  description,
  type,
  minAge,
  maxAge,
  imageUrl,
  rating,
  featured,
  className,
}: GameCardProps) {
  const href = type === 'DIGITAL' ? `/spil/${slug}` : `/braetspil/${slug}`;
  const typeLabel = type === 'DIGITAL' ? 'Digitalt' : 'Brætspil';
  const typeEmoji = type === 'DIGITAL' ? '🎮' : '🎲';

  return (
    <Link href={href} className={cn('block group', className)}>
      <Card className="h-full relative overflow-hidden">
        {featured && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-gradient-to-r from-candy-yellow to-candy-orange text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse-soft">
              Anbefalet
            </span>
          </div>
        )}

        {/* Image container */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-sky to-lavender overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl animate-float">{typeEmoji}</span>
            </div>
          )}

          {/* Decorative blob */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-candy-pink/20 blob-2 transition-transform duration-500 group-hover:scale-125" />
        </div>

        <CardContent className="relative">
          {/* Type badge */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={type === 'DIGITAL' ? 'blue' : 'purple'}>
              {typeEmoji} {typeLabel}
            </Badge>
            <Badge variant="green">{getAgeLabel(minAge, maxAge)}</Badge>
          </div>

          {/* Title */}
          <h3 className="font-display text-xl font-bold text-charcoal mb-2 group-hover:text-candy-pink transition-colors line-clamp-1">
            {title}
          </h3>

          {/* Description */}
          <p className="text-slate text-sm line-clamp-2">{description}</p>

          {/* Rating */}
          {rating && (
            <div className="mt-3 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'text-lg',
                    i < Math.round(rating) ? 'text-candy-yellow' : 'text-slate/30'
                  )}
                >
                  ★
                </span>
              ))}
              <span className="text-sm text-slate ml-1">({rating.toFixed(1)})</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
