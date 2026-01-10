// Streaming Provider Badges Component

const PROVIDERS: Record<
  string,
  {
    name: string;
    color: string;
    free?: boolean;
  }
> = {
  drtv: { name: 'DR TV', color: '#9B1B30', free: true },
  netflix: { name: 'Netflix', color: '#E50914' },
  disney: { name: 'Disney+', color: '#113CCF' },
  viaplay: { name: 'Viaplay', color: '#FF5500' },
  hbo: { name: 'Max', color: '#5822B4' },
  skyshowtime: { name: 'SkyShowtime', color: '#00B2A9' },
  tv2: { name: 'TV 2 Play', color: '#E4002B' },
  apple: { name: 'Apple TV+', color: '#000000' },
  prime: { name: 'Prime Video', color: '#00A8E1' },
};

interface Props {
  providers: Array<{ provider: string; isFree?: boolean }>;
}

export function StreamingBadges({ providers }: Props) {
  if (!providers.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {providers.map(({ provider, isFree }) => {
        const info = PROVIDERS[provider] || { name: provider, color: '#666' };
        const showFree = isFree || info.free;

        return (
          <span
            key={provider}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: info.color }}
          >
            {info.name}
            {showFree && (
              <span className="bg-white/20 px-1 rounded text-[10px]">
                Gratis
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
