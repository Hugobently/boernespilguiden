// Streaming Provider Badges Component

const PROVIDERS: Record<
  string,
  {
    name: string;
    color: string;
    free?: boolean;
    hide?: boolean;  // Hide duplicates
  }
> = {
  // Primary providers
  drtv: { name: 'DR TV', color: '#9B1B30', free: true },
  netflix: { name: 'Netflix', color: '#E50914' },
  disney: { name: 'Disney+', color: '#113CCF' },
  'disney plus': { name: 'Disney+', color: '#113CCF' },
  viaplay: { name: 'Viaplay', color: '#FF5500' },
  hbo: { name: 'Max', color: '#5822B4' },
  'hbo max': { name: 'Max', color: '#5822B4' },
  max: { name: 'Max', color: '#5822B4' },
  skyshowtime: { name: 'SkyShowtime', color: '#00B2A9' },
  tv2: { name: 'TV 2 Play', color: '#E4002B' },
  'tv 2 play': { name: 'TV 2 Play', color: '#E4002B' },
  apple: { name: 'Apple TV+', color: '#000000' },
  'apple tv plus': { name: 'Apple TV+', color: '#000000' },
  prime: { name: 'Prime Video', color: '#00A8E1' },
  'prime video': { name: 'Prime Video', color: '#00A8E1' },
  'amazon prime video': { name: 'Prime Video', color: '#00A8E1' },
  filmstriben: { name: 'Filmstriben', color: '#F39200', free: true },

  // TMDB variants - map to primary or hide duplicates
  'netflix-kids': { name: 'Netflix', color: '#E50914', hide: true }, // Duplicate
  'netflix kids': { name: 'Netflix', color: '#E50914', hide: true },
  allente: { name: 'Allente', color: '#FF6B00', hide: true }, // TV package aggregator, not a streaming service
  'tv2-skyshowtime': { name: 'SkyShowtime', color: '#00B2A9', hide: true }, // Duplicate
  'tv-2 play': { name: 'TV 2 Play', color: '#E4002B' },

  // Danish/Nordic providers
  blockbuster: { name: 'Blockbuster', color: '#0066CC' },
  'sf anytime': { name: 'SF Anytime', color: '#E31837' },
  'c more': { name: 'C More', color: '#00A3E0' },
};

// Normalize provider name
function normalizeProvider(provider: string): string {
  return provider.toLowerCase().replace(/[_\s]+/g, ' ').trim();
}

interface Props {
  providers: Array<{ provider: string; isFree?: boolean }>;
  maxShow?: number;  // Max number of badges to show
  size?: 'small' | 'large';  // Badge size
}

export function StreamingBadges({ providers, maxShow = 5, size = 'small' }: Props) {
  if (!providers.length) return null;

  // Deduplicate and filter
  const seen = new Set<string>();
  const filtered = providers.filter(({ provider }) => {
    const normalized = normalizeProvider(provider);
    const info = PROVIDERS[normalized];

    // Skip if should be hidden or already seen
    if (info?.hide) return false;

    const displayName = info?.name || provider;
    if (seen.has(displayName)) return false;

    seen.add(displayName);
    return true;
  });

  const toShow = filtered.slice(0, maxShow);
  const remaining = filtered.length - maxShow;

  const isLarge = size === 'large';

  return (
    <div className={`flex flex-wrap ${isLarge ? 'gap-3' : 'gap-2'}`}>
      {toShow.map(({ provider, isFree }) => {
        const normalized = normalizeProvider(provider);
        const info = PROVIDERS[normalized] || { name: provider, color: '#666' };
        const showFree = isFree || info.free;

        return (
          <span
            key={provider}
            className={`inline-flex items-center gap-1.5 font-medium text-white shadow-sm transition-transform hover:scale-105 ${
              isLarge
                ? 'px-4 py-2.5 rounded-lg text-sm'
                : 'px-2.5 py-1 rounded-full text-xs'
            }`}
            style={{ backgroundColor: info.color }}
          >
            {info.name}
            {showFree && (
              <span className={`bg-white/25 rounded font-semibold ${
                isLarge ? 'px-1.5 py-0.5 text-xs' : 'px-1 text-[10px]'
              }`}>
                Gratis
              </span>
            )}
          </span>
        );
      })}
      {remaining > 0 && (
        <span className={`bg-gray-200 text-gray-600 ${
          isLarge
            ? 'px-4 py-2.5 rounded-lg text-sm'
            : 'px-2.5 py-1 rounded-full text-xs'
        }`}>
          +{remaining}
        </span>
      )}
    </div>
  );
}
