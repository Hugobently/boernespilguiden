import { cn } from '@/lib/utils';
import { GameCard } from './GameCard';

interface Game {
  slug: string;
  title: string;
  description: string;
  type: string;
  minAge: number;
  maxAge: number;
  imageUrl?: string | null;
  rating?: number | null;
  featured?: boolean;
}

interface GameGridProps {
  games: Game[];
  className?: string;
}

export function GameGrid({ games, className }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4 animate-bounce-slow">🎮</div>
        <h3 className="font-display text-2xl text-charcoal mb-2">
          Ingen spil fundet
        </h3>
        <p className="text-slate">
          Prøv at ændre din søgning eller filtre
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-6',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {games.map((game, index) => (
        <div
          key={game.slug}
          className="animate-slide-up opacity-0"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationFillMode: 'forwards',
          }}
        >
          <GameCard {...game} />
        </div>
      ))}
    </div>
  );
}
