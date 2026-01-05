import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Navigation } from '@/components/layout';
import { Badge, Button } from '@/components/ui';
import { getAgeLabel, formatPlayTime } from '@/lib/utils';
import prisma from '@/lib/db';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const game = await prisma.game.findFirst({
    where: { slug: params.slug, type: 'BOARD' },
  });

  if (!game) return { title: 'Brætspil ikke fundet' };

  return {
    title: game.title,
    description: game.description,
  };
}

export default async function BoardGamePage({ params }: PageProps) {
  const game = await prisma.game.findFirst({
    where: { slug: params.slug, type: 'BOARD' },
    include: { categories: { include: { category: true } } },
  });

  if (!game) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Navigation
        breadcrumbs={[
          { label: 'Brætspil', href: '/braetspil' },
          { label: game.title },
        ]}
        className="mb-8"
      />

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-candy-orange/20 to-candy-yellow/20">
          {game.imageUrl ? (
            <img
              src={game.imageUrl}
              alt={game.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl animate-float">🎲</span>
            </div>
          )}

          {game.featured && (
            <div className="absolute top-4 right-4">
              <span className="bg-gradient-to-r from-candy-yellow to-candy-orange text-white px-4 py-2 rounded-full font-bold shadow-lg">
                Anbefalet
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="orange">🎲 Brætspil</Badge>
            <Badge variant="green">{getAgeLabel(game.minAge, game.maxAge)}</Badge>
            {game.categories.map(({ category }) => (
              <Badge key={category.id} variant="purple">
                {category.icon} {category.name}
              </Badge>
            ))}
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold text-charcoal mb-4">
            {game.title}
          </h1>

          {game.rating && (
            <div className="flex items-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl ${
                    i < Math.round(game.rating!) ? 'text-candy-yellow' : 'text-slate/30'
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="text-lg text-slate ml-2">
                ({game.rating.toFixed(1)})
              </span>
            </div>
          )}

          <p className="text-lg text-slate mb-8 leading-relaxed">
            {game.description}
          </p>

          <div className="bg-cream rounded-2xl p-6 mb-8">
            <h3 className="font-display text-lg font-bold text-charcoal mb-4">
              Detaljer
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-slate">Alder</dt>
                <dd className="font-semibold text-charcoal">
                  {getAgeLabel(game.minAge, game.maxAge)}
                </dd>
              </div>
              {game.minPlayers && game.maxPlayers && (
                <div>
                  <dt className="text-sm text-slate">Antal spillere</dt>
                  <dd className="font-semibold text-charcoal">
                    {game.minPlayers === game.maxPlayers
                      ? `${game.minPlayers} spillere`
                      : `${game.minPlayers}-${game.maxPlayers} spillere`}
                  </dd>
                </div>
              )}
              {game.playTime && (
                <div>
                  <dt className="text-sm text-slate">Spilletid</dt>
                  <dd className="font-semibold text-charcoal">
                    {formatPlayTime(game.playTime)}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <Button size="lg" className="w-full sm:w-auto">
            Find brætspillet
          </Button>
        </div>
      </div>
    </div>
  );
}
