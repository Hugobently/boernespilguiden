// Streaming Provider Badges Component
import {
  STREAMING_PROVIDERS,
  normalizeProviderName,
  getProviderConfig
} from '@/lib/config/streaming';

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
    const normalized = normalizeProviderName(provider);
    const info = STREAMING_PROVIDERS[normalized];

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
        const info = getProviderConfig(provider);
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
