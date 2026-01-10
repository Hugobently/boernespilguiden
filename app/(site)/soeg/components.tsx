'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ============================================================================
// SEARCH TABS
// ============================================================================

interface SearchTabsProps {
  activeTab: 'alle' | 'spil' | 'braetspil' | 'film-serier';
  query: string;
}

export function SearchTabs({ activeTab }: SearchTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabs = [
    { id: 'alle', label: 'Alle', emoji: '🔍' },
    { id: 'spil', label: 'Digitale spil', emoji: '🎮' },
    { id: 'braetspil', label: 'Brætspil', emoji: '🎲' },
    { id: 'film-serier', label: 'Film & Serier', emoji: '📺' },
  ] as const;

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tabId === 'alle') {
      params.delete('tab');
    } else {
      params.set('tab', tabId);
    }
    router.push(`/soeg?${params.toString()}`);
  };

  return (
    <div className="inline-flex items-center bg-[#FFFCF7] rounded-2xl p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
            activeTab === tab.id
              ? 'bg-white text-[#4A4A4A] shadow-sm'
              : 'text-[#7A7A7A] hover:text-[#4A4A4A]'
          )}
        >
          <span>{tab.emoji}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// SEARCH FILTERS
// ============================================================================

interface SearchFiltersProps {
  activeTab: 'alle' | 'spil' | 'braetspil' | 'film-serier';
  filters: {
    adFree?: boolean;
    free?: boolean;
    offline?: boolean;
    noInAppPurchases?: boolean;
    supportsDanish?: boolean;
    ageGroup?: string;
    players?: string;
    playTime?: string;
  };
  query: string;
}

export function SearchFilters({ activeTab, filters, query }: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateFilter = useCallback(
    (key: string, value: string | boolean | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null || value === false || value === '') {
        params.delete(key);
      } else if (typeof value === 'boolean') {
        params.set(key, 'true');
      } else {
        params.set(key, value);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const activeFilterCount = [
    filters.adFree,
    filters.free,
    filters.offline,
    filters.noInAppPurchases,
    filters.supportsDanish,
    filters.ageGroup,
    filters.players,
    filters.playTime,
  ].filter(Boolean).length;

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (activeTab !== 'alle') params.set('tab', activeTab);
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
          'bg-[#FFFCF7] hover:bg-white shadow-sm',
          activeFilterCount > 0 ? 'text-[#FFB5A7]' : 'text-[#4A4A4A]'
        )}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span>Filtre</span>
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-[#FFB5A7] text-white rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-lg border border-[#FFB5A7]/10 z-50 overflow-hidden">
          <div className="p-4 space-y-4">
            {/* Age Group */}
            <div>
              <label className="block text-xs font-semibold text-[#7A7A7A] mb-2">
                Aldersgruppe
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['0-3', '3-6', '7+'].map((age) => (
                  <button
                    key={age}
                    onClick={() => updateFilter('alder', filters.ageGroup === age ? null : age)}
                    className={cn(
                      'px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                      filters.ageGroup === age
                        ? 'bg-[#FFB5A7] text-white'
                        : 'bg-[#FFF9F0] text-[#4A4A4A] hover:bg-[#FFB5A7]/20'
                    )}
                  >
                    {age} år
                  </button>
                ))}
              </div>
            </div>

            {/* Language filter */}
            <div className="border-t border-[#FFB5A7]/10 pt-4">
              <label className="block text-xs font-semibold text-[#7A7A7A] mb-2">
                Sprog
              </label>
              <FilterToggle
                label="🇩🇰 Dansk understøttet"
                checked={filters.supportsDanish || false}
                onChange={(checked) => updateFilter('dansk', checked ? true : null)}
              />
            </div>

            {/* Digital game filters */}
            {(activeTab === 'alle' || activeTab === 'spil') && (
              <>
                <div className="border-t border-[#FFB5A7]/10 pt-4">
                  <label className="block text-xs font-semibold text-[#7A7A7A] mb-2">
                    🎮 Digitale spil filtre
                  </label>
                  <div className="space-y-2">
                    <FilterToggle
                      label="🚫 Reklamefri"
                      checked={filters.adFree || false}
                      onChange={(checked) => updateFilter('reklamefri', checked ? true : null)}
                    />
                    <FilterToggle
                      label="🆓 Gratis"
                      checked={filters.free || false}
                      onChange={(checked) => updateFilter('gratis', checked ? true : null)}
                    />
                    <FilterToggle
                      label="📱 Offline tilgængelig"
                      checked={filters.offline || false}
                      onChange={(checked) => updateFilter('offline', checked ? true : null)}
                    />
                    <FilterToggle
                      label="💰 Ingen in-app køb"
                      checked={filters.noInAppPurchases || false}
                      onChange={(checked) => updateFilter('ingenKob', checked ? true : null)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Board game filters */}
            {(activeTab === 'alle' || activeTab === 'braetspil') && (
              <div className="border-t border-[#FFB5A7]/10 pt-4">
                <label className="block text-xs font-semibold text-[#7A7A7A] mb-2">
                  🎲 Brætspil filtre
                </label>
                <div className="space-y-3">
                  {/* Players */}
                  <div>
                    <label className="block text-xs text-[#7A7A7A] mb-1">Antal spillere</label>
                    <select
                      value={filters.players || ''}
                      onChange={(e) => updateFilter('spillere', e.target.value || null)}
                      className="w-full px-3 py-2 rounded-xl text-sm bg-[#FFF9F0] border-0 focus:ring-2 focus:ring-[#FFB5A7]"
                    >
                      <option value="">Alle</option>
                      <option value="2">2 spillere</option>
                      <option value="3">3 spillere</option>
                      <option value="4">4 spillere</option>
                      <option value="5">5+ spillere</option>
                    </select>
                  </div>

                  {/* Play time */}
                  <div>
                    <label className="block text-xs text-[#7A7A7A] mb-1">Max spilletid</label>
                    <select
                      value={filters.playTime || ''}
                      onChange={(e) => updateFilter('spilletid', e.target.value || null)}
                      className="w-full px-3 py-2 rounded-xl text-sm bg-[#FFF9F0] border-0 focus:ring-2 focus:ring-[#FFB5A7]"
                    >
                      <option value="">Alle</option>
                      <option value="15">Under 15 min</option>
                      <option value="30">Under 30 min</option>
                      <option value="60">Under 1 time</option>
                      <option value="120">Under 2 timer</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {activeFilterCount > 0 && (
            <div className="border-t border-[#FFB5A7]/10 p-3 bg-[#FFF9F0]">
              <button
                onClick={clearFilters}
                className="w-full py-2 rounded-xl text-sm font-semibold text-[#FFB5A7] hover:bg-white transition-colors"
              >
                Ryd alle filtre
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// FILTER TOGGLE
// ============================================================================

interface FilterToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function FilterToggle({ label, checked, onChange }: FilterToggleProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm text-[#4A4A4A] group-hover:text-[#FFB5A7] transition-colors">
        {label}
      </span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-10 h-6 rounded-full transition-colors',
          checked ? 'bg-[#FFB5A7]' : 'bg-[#E5E5E5]'
        )}
      >
        <span
          className={cn(
            'absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-5' : 'translate-x-1'
          )}
        />
      </button>
    </label>
  );
}

// ============================================================================
// SEARCH SUGGESTIONS (For no results)
// ============================================================================

interface SearchSuggestionsProps {
  query: string;
}

export function SearchSuggestions({ query }: SearchSuggestionsProps) {
  // Generate similar search suggestions based on the query
  const suggestions = generateSuggestions(query);

  return (
    <div className="bg-[#FFFCF7] rounded-3xl p-6">
      <h3 className="text-lg font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
        <span>💡</span> Søgte du efter...?
      </h3>

      <div className="flex flex-wrap gap-2 mb-6">
        {suggestions.map((suggestion) => (
          <Link
            key={suggestion}
            href={`/soeg?q=${encodeURIComponent(suggestion)}`}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white text-[#4A4A4A] text-sm font-medium hover:bg-[#FFB5A7] hover:text-white transition-colors shadow-sm"
          >
            {suggestion}
          </Link>
        ))}
      </div>

      <div className="border-t border-[#FFB5A7]/10 pt-6">
        <h4 className="text-sm font-bold text-[#7A7A7A] mb-3">Eller prøv disse kategorier:</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/spil/kategori/3-6"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#BAFFC9]/30 hover:bg-[#BAFFC9]/50 transition-colors"
          >
            <span className="text-2xl">🧒</span>
            <span className="text-sm font-semibold text-[#2D6A4F]">3-6 år</span>
          </Link>
          <Link
            href="/spil/kategori/7+"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#BAE1FF]/30 hover:bg-[#BAE1FF]/50 transition-colors"
          >
            <span className="text-2xl">👦</span>
            <span className="text-sm font-semibold text-[#1D4E89]">7+ år</span>
          </Link>
          <Link
            href="/soeg?reklamefri=true"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#FFB5A7]/20 hover:bg-[#FFB5A7]/40 transition-colors"
          >
            <span className="text-2xl">🚫</span>
            <span className="text-sm font-semibold text-[#6B3A2E]">Reklamefri</span>
          </Link>
          <Link
            href="/braetspil"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#FFE66D]/20 hover:bg-[#FFE66D]/40 transition-colors"
          >
            <span className="text-2xl">🎲</span>
            <span className="text-sm font-semibold text-[#7D6608]">Brætspil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SORT DROPDOWN
// ============================================================================

export type SortOption = 'relevans' | 'rating' | 'navn' | 'alder';

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortOptions: { value: SortOption; label: string; icon: string }[] = [
    { value: 'relevans', label: 'Relevans', icon: '🎯' },
    { value: 'rating', label: 'Bedst bedømt', icon: '⭐' },
    { value: 'navn', label: 'Navn (A-Å)', icon: '🔤' },
    { value: 'alder', label: 'Yngste først', icon: '👶' },
  ];

  const handleSortChange = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'relevans') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    router.push(`/soeg?${params.toString()}`);
    onSortChange(value);
  };

  return (
    <div className="relative">
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value as SortOption)}
        className={cn(
          'appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm font-semibold',
          'bg-[#FFFCF7] hover:bg-white shadow-sm cursor-pointer',
          'text-[#4A4A4A] border-0 focus:ring-2 focus:ring-[#FFB5A7]',
          'transition-all'
        )}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.icon} {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-[#7A7A7A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

// Standalone sort select for server component usage
export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get('sort') || 'relevans') as SortOption;

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'relevans', label: '🎯 Relevans' },
    { value: 'rating', label: '⭐ Bedst bedømt' },
    { value: 'navn', label: '🔤 Navn (A-Å)' },
    { value: 'alder', label: '👶 Yngste først' },
  ];

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'relevans') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    router.push(`/soeg?${params.toString()}`);
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-sm text-[#7A7A7A] hidden sm:inline">Sortér:</span>
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className={cn(
          'appearance-none px-3 py-2 pr-8 rounded-xl text-sm font-medium',
          'bg-[#FFFCF7] hover:bg-white shadow-sm cursor-pointer',
          'text-[#4A4A4A] border-0 focus:ring-2 focus:ring-[#FFB5A7]',
          'transition-all'
        )}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateSuggestions(query: string): string[] {
  const suggestions: string[] = [];

  // Common Danish children's game keywords
  const commonKeywords = [
    'læring',
    'puslespil',
    'eventyr',
    'matematik',
    'bogstaver',
    'tegne',
    'musik',
    'dyr',
    'natur',
    'logik',
    'hukommelse',
    'kreativ',
  ];

  // Try to find similar words
  const queryLower = query.toLowerCase();

  // Add the original query with a category
  suggestions.push(`${query} spil`);

  // Find similar keywords
  for (const keyword of commonKeywords) {
    if (keyword.includes(queryLower.slice(0, 3)) || queryLower.includes(keyword.slice(0, 3))) {
      suggestions.push(keyword);
    }
  }

  // Add age-related suggestions if query contains numbers
  const ageMatch = query.match(/(\d+)/);
  if (ageMatch) {
    const age = parseInt(ageMatch[1], 10);
    if (age >= 0 && age <= 3) {
      suggestions.push('spil til babyer');
    } else if (age <= 6) {
      suggestions.push('spil til børnehave');
    } else if (age <= 10) {
      suggestions.push('spil til skolebørn');
    }
  }

  // Add some default popular suggestions
  if (suggestions.length < 4) {
    suggestions.push('gratis læringsspil', 'reklamefri spil', 'offline spil');
  }

  // Remove duplicates and limit to 6
  return Array.from(new Set(suggestions)).slice(0, 6);
}
