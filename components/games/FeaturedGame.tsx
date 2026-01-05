import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@/components/ui';
import { getAgeLabel } from '@/lib/utils';

interface FeaturedGameProps {
  slug: string;
  title: string;
  description: string;
  type: string;
  minAge: number;
  maxAge: number;
  imageUrl?: string | null;
}

export function FeaturedGame({
  slug,
  title,
  description,
  type,
  minAge,
  maxAge,
  imageUrl,
}: FeaturedGameProps) {
  const href = type === 'DIGITAL' ? `/spil/${slug}` : `/braetspil/${slug}`;
  const typeLabel = type === 'DIGITAL' ? 'Digitalt spil' : 'Brætspil';
  const typeEmoji = type === 'DIGITAL' ? '🎮' : '🎲';

  return (
    <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-candy-purple via-candy-pink to-candy-orange p-1">
      <div className="bg-white rounded-[1.75rem] overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image side */}
          <div className="relative aspect-square md:aspect-auto bg-gradient-to-br from-lavender to-sky">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-9xl animate-float">{typeEmoji}</span>
              </div>
            )}

            {/* Decorative elements */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-display font-bold text-candy-purple shadow-lg">
                Ugens Valg
              </span>
            </div>

            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-candy-cyan/30 blob animate-float" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-candy-yellow/30 blob-2 animate-float" style={{ animationDelay: '1s' }} />
          </div>

          {/* Content side */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={type === 'DIGITAL' ? 'blue' : 'purple'}>
                {typeEmoji} {typeLabel}
              </Badge>
              <Badge variant="green">{getAgeLabel(minAge, maxAge)}</Badge>
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
              {title}
            </h2>

            <p className="text-slate text-lg mb-6 line-clamp-3">
              {description}
            </p>

            <Link href={href}>
              <Button size="lg">
                Se mere
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
