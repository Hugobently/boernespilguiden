// Streaming provider configuration - centralized for consistency
// Used by StreamingBadges component and filters

export interface StreamingProviderConfig {
  name: string;
  color: string;
  free?: boolean;
  hide?: boolean; // Hide duplicates/aggregators
}

export const STREAMING_PROVIDERS: Record<string, StreamingProviderConfig> = {
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
  'netflix-kids': { name: 'Netflix', color: '#E50914', hide: true },
  'netflix kids': { name: 'Netflix', color: '#E50914', hide: true },
  allente: { name: 'Allente', color: '#FF6B00', hide: true }, // TV package aggregator
  'tv2-skyshowtime': { name: 'SkyShowtime', color: '#00B2A9', hide: true },
  'tv-2 play': { name: 'TV 2 Play', color: '#E4002B' },

  // Danish/Nordic providers
  blockbuster: { name: 'Blockbuster', color: '#0066CC' },
  'sf anytime': { name: 'SF Anytime', color: '#E31837' },
  'c more': { name: 'C More', color: '#00A3E0' },
};

// Normalize provider name for lookup
export function normalizeProviderName(provider: string): string {
  return provider.toLowerCase().replace(/[_\s]+/g, ' ').trim();
}

// Get provider config with fallback
export function getProviderConfig(
  provider: string
): StreamingProviderConfig {
  const normalized = normalizeProviderName(provider);
  return STREAMING_PROVIDERS[normalized] || {
    name: provider,
    color: '#666666'
  };
}

// Get all visible providers (non-hidden)
export function getVisibleProviders(): string[] {
  return Object.entries(STREAMING_PROVIDERS)
    .filter(([_, config]) => !config.hide)
    .map(([key, config]) => config.name)
    .filter((name, index, self) => self.indexOf(name) === index); // Deduplicate
}
