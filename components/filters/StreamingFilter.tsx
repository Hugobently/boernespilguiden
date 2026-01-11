// Streaming Filter Component
// Shows primary streaming services with expandable secondary options

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface StreamingProvider {
  id: string;
  name: string;
  color: string;
  isFree?: boolean;
  priority: 'primary' | 'secondary';
}

const STREAMING_PROVIDERS: StreamingProvider[] = [
  // Primary - most popular in Denmark
  { id: 'drtv', name: 'DR TV', color: '#9B1B30', isFree: true, priority: 'primary' },
  { id: 'netflix', name: 'Netflix', color: '#E50914', priority: 'primary' },
  { id: 'disney', name: 'Disney+', color: '#113CCF', priority: 'primary' },
  { id: 'viaplay', name: 'Viaplay', color: '#FF5500', priority: 'primary' },
  // Secondary - less common
  { id: 'filmstriben', name: 'Filmstriben', color: '#F39200', isFree: true, priority: 'secondary' },
  { id: 'hbo', name: 'Max', color: '#5822B4', priority: 'secondary' },
  { id: 'prime', name: 'Prime Video', color: '#00A8E1', priority: 'secondary' },
  { id: 'apple', name: 'Apple TV+', color: '#000000', priority: 'secondary' },
  { id: 'tv2', name: 'TV 2 Play', color: '#E4002B', priority: 'secondary' },
  { id: 'skyshowtime', name: 'SkyShowtime', color: '#00B2A9', priority: 'secondary' },
];

interface StreamingFilterProps {
  currentStreaming?: string;
  currentType?: string;
  currentAge?: string;
  basePath?: string;
}

// Build URL with preserved filters
function buildFilterUrl(
  basePath: string,
  params: { streaming?: string; type?: string; alder?: string }
): string {
  const urlParams = new URLSearchParams();

  if (params.type) urlParams.set('type', params.type);
  if (params.streaming) urlParams.set('streaming', params.streaming);
  if (params.alder) urlParams.set('alder', params.alder);

  const queryString = urlParams.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

export function StreamingFilter({
  currentStreaming,
  currentType,
  currentAge,
  basePath = '/film-serier',
}: StreamingFilterProps) {
  const [showAll, setShowAll] = useState(false);

  const primaryProviders = STREAMING_PROVIDERS.filter((p) => p.priority === 'primary');
  const secondaryProviders = STREAMING_PROVIDERS.filter((p) => p.priority === 'secondary');

  // Check if a secondary provider is selected
  const hasSecondarySelected = secondaryProviders.some((p) => p.id === currentStreaming);

  // Auto-expand if a secondary provider is selected
  const isExpanded = showAll || hasSecondarySelected;

  // Helper to build URL with current filters
  const getUrl = (streamingId?: string) =>
    buildFilterUrl(basePath, {
      type: currentType,
      streaming: streamingId,
      alder: currentAge,
    });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Streaming-tjenester</h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-secondary hover:text-secondary-dark transition-colors flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              <span>Vis færre</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              <span>Vis alle ({STREAMING_PROVIDERS.length})</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* All button */}
        <Link
          href={getUrl(undefined)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[40px] flex items-center',
            !currentStreaming
              ? 'bg-text-primary text-white shadow-md'
              : 'bg-white text-text-secondary hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
          )}
        >
          Alle
        </Link>

        {/* Primary providers */}
        {primaryProviders.map((provider) => (
          <StreamingButton
            key={provider.id}
            provider={provider}
            isSelected={currentStreaming === provider.id}
            href={getUrl(provider.id)}
          />
        ))}

        {/* Secondary providers - collapsible */}
        {isExpanded && secondaryProviders.map((provider) => (
          <StreamingButton
            key={provider.id}
            provider={provider}
            isSelected={currentStreaming === provider.id}
            href={getUrl(provider.id)}
          />
        ))}
      </div>
    </div>
  );
}

function StreamingButton({
  provider,
  isSelected,
  href,
}: {
  provider: StreamingProvider;
  isSelected: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[40px] flex items-center gap-1.5',
        'hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm',
        isSelected
          ? 'text-white shadow-md'
          : 'bg-white text-text-secondary hover:bg-gray-50 border border-gray-200'
      )}
      style={isSelected ? { backgroundColor: provider.color } : undefined}
    >
      <span>{provider.name}</span>
      {provider.isFree && (
        <span
          className={cn(
            'text-[10px] px-1.5 py-0.5 rounded-full font-semibold',
            isSelected ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
          )}
        >
          Gratis
        </span>
      )}
    </Link>
  );
}

export default StreamingFilter;
