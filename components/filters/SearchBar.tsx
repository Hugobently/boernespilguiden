'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// SEARCH SUGGESTION TYPES
// ============================================================================

interface SearchSuggestion {
  type: 'game' | 'category' | 'age' | 'query' | 'popular';
  label: string;
  slug?: string;
  emoji?: string;
  href?: string;
}

// ============================================================================
// POPULAR SEARCHES & QUICK SUGGESTIONS
// ============================================================================

const popularSearches: SearchSuggestion[] = [
  { type: 'popular', label: 'Læringsspil', emoji: '📚', href: '/spil?kategori=læring' },
  { type: 'popular', label: 'Spil til småbørn', emoji: '🧒', href: '/spil?alder=3-6' },
  { type: 'popular', label: 'Puslespil', emoji: '🧩', href: '/spil?kategori=puslespil' },
  { type: 'popular', label: 'Gratis spil', emoji: '🆓', href: '/spil?pris=gratis' },
  { type: 'popular', label: 'Offline spil', emoji: '📱', href: '/spil?offline=true' },
];

const quickCategories: SearchSuggestion[] = [
  { type: 'category', label: 'Læring', slug: 'læring', emoji: '📚' },
  { type: 'category', label: 'Eventyr', slug: 'eventyr', emoji: '🏰' },
  { type: 'category', label: 'Puslespil', slug: 'puslespil', emoji: '🧩' },
  { type: 'category', label: 'Kreativ', slug: 'kreativ', emoji: '🎨' },
];

// ============================================================================
// NATURAL LANGUAGE PARSER
// ============================================================================

interface ParsedQuery {
  searchTerm: string;
  filters: {
    age?: string;
    category?: string;
    free?: boolean;
    adFree?: boolean;
    offline?: boolean;
  };
}

function parseNaturalLanguage(query: string): ParsedQuery {
  const lowerQuery = query.toLowerCase();
  const result: ParsedQuery = {
    searchTerm: query,
    filters: {},
  };

  // Age detection
  const agePatterns = [
    { pattern: /(\d+)\s*-?\s*(\d+)?\s*(år|årig|arig)/i, extract: (m: RegExpMatchArray) => `${m[1]}-${m[2] || parseInt(m[1]) + 2}` },
    { pattern: /baby|spædbarn/i, extract: () => '0-3' },
    { pattern: /småbørn|småbarn|børnehave/i, extract: () => '3-6' },
    { pattern: /skolebørn|indskoling|teenager|tween|ung/i, extract: () => '7+' },
  ];

  for (const { pattern, extract } of agePatterns) {
    const match = lowerQuery.match(pattern);
    if (match) {
      result.filters.age = extract(match);
      result.searchTerm = query.replace(pattern, '').trim();
      break;
    }
  }

  // Category detection
  const categoryKeywords: Record<string, string> = {
    'læring': 'læring',
    'lære': 'læring',
    'eventyr': 'eventyr',
    'puslespil': 'puslespil',
    'puzzle': 'puslespil',
    'kreativ': 'kreativ',
    'tegne': 'kreativ',
    'male': 'kreativ',
    'action': 'action',
    'musik': 'musik',
    'sport': 'sport',
    'fodbold': 'sport',
  };

  for (const [keyword, category] of Object.entries(categoryKeywords)) {
    if (lowerQuery.includes(keyword)) {
      result.filters.category = category;
      break;
    }
  }

  // Price/feature detection
  if (/gratis|free|uden betaling/i.test(lowerQuery)) {
    result.filters.free = true;
    result.searchTerm = result.searchTerm.replace(/gratis|free|uden betaling/gi, '').trim();
  }

  if (/reklamefri|ingen reklamer|uden reklamer|ad-free/i.test(lowerQuery)) {
    result.filters.adFree = true;
  }

  if (/offline|uden internet|uden net/i.test(lowerQuery)) {
    result.filters.offline = true;
  }

  return result;
}

// ============================================================================
// DEBOUNCE HOOK
// ============================================================================

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ============================================================================
// SEARCH BAR COMPONENT
// ============================================================================

export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  showQuickSuggestions?: boolean;
  showPopularSearches?: boolean;
  variant?: 'default' | 'hero' | 'compact';
  onSearch?: (query: string, parsed: ParsedQuery) => void;
  autoFocus?: boolean;
}

export function SearchBar({
  placeholder = 'Søg efter spil, kategorier, alder...',
  className,
  showQuickSuggestions = true,
  showPopularSearches = true,
  variant = 'default',
  onSearch,
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Fetch suggestions with request cancellation to prevent race conditions
  useEffect(() => {
    const abortController = new AbortController();

    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`,
          { signal: abortController.signal }
        );
        if (response.ok) {
          const data = await response.json();
          const gameSuggestions: SearchSuggestion[] = (data.results || []).map((game: { slug: string; title: string; type: string }) => ({
            type: 'game' as const,
            label: game.title,
            slug: game.slug,
            emoji: game.type === 'DIGITAL' ? '🎮' : '🎲',
            href: game.type === 'DIGITAL' ? `/spil/${game.slug}` : `/braetspil/${game.slug}`,
          }));
          setSuggestions(gameSuggestions);
        }
      } catch (error) {
        // Ignore abort errors - they're expected when query changes quickly
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Search error:', error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchSuggestions();

    // Cleanup: cancel the request if query changes before it completes
    return () => abortController.abort();
  }, [debouncedQuery]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!query.trim()) return;

      const parsed = parseNaturalLanguage(query);

      if (onSearch) {
        onSearch(query, parsed);
        return;
      }

      // Build search URL with filters
      const params = new URLSearchParams();
      params.set('q', parsed.searchTerm || query);
      if (parsed.filters.age) params.set('alder', parsed.filters.age);
      if (parsed.filters.category) params.set('kategori', parsed.filters.category);
      if (parsed.filters.free) params.set('pris', 'gratis');
      if (parsed.filters.adFree) params.set('reklamefri', 'true');
      if (parsed.filters.offline) params.set('offline', 'true');

      router.push(`/soeg?${params.toString()}`);
      setIsFocused(false);
    },
    [query, router, onSearch]
  );

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.href) {
      router.push(suggestion.href);
    } else if (suggestion.type === 'category') {
      router.push(`/spil?kategori=${suggestion.slug}`);
    } else if (suggestion.type === 'age') {
      router.push(`/spil?alder=${suggestion.slug}`);
    }
    setIsFocused(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allSuggestions = [
      ...suggestions,
      ...(query.length < 2 && showPopularSearches ? popularSearches : []),
    ];

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
        e.preventDefault();
        handleSuggestionClick(allSuggestions[selectedIndex]);
      } else {
        handleSearch(e);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  const showDropdown = isFocused && (suggestions.length > 0 || (query.length < 2 && showPopularSearches));

  const variantStyles = {
    default: {
      container: 'max-w-xl',
      input: 'px-5 py-3 text-base',
      icon: 'left-3.5 w-5 h-5',
    },
    hero: {
      container: 'max-w-2xl',
      input: 'px-6 py-4 text-lg',
      icon: 'left-4 w-6 h-6',
    },
    compact: {
      container: 'max-w-md',
      input: 'px-4 py-2.5 text-sm',
      icon: 'left-2.5 w-4 h-4',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div ref={containerRef} className={cn('relative', styles.container, className)}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          {/* Search icon */}
          <div className={cn('absolute top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none', styles.icon)}>
            {isLoading ? (
              <div className="w-full h-full border-2 border-[#FFB5A7] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={cn(
              'w-full rounded-2xl pr-12',
              'bg-[#FFFCF7] border-2 border-transparent',
              'text-[#4A4A4A] placeholder:text-[#9CA3AF]',
              'focus:outline-none focus:border-[#FFB5A7] focus:shadow-[0_0_0_4px_rgba(255,181,167,0.2)]',
              'transition-all duration-200',
              variant === 'compact' ? 'pl-9' : variant === 'hero' ? 'pl-16' : 'pl-11',
              styles.input
            )}
          />

          {/* Submit button */}
          <button
            type="submit"
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2',
              'px-4 py-1.5 rounded-xl',
              'bg-gradient-to-b from-[#FFB5A7] to-[#F8A99B]',
              'text-white font-semibold text-sm',
              'shadow-[0_2px_0_0_#E8958A]',
              'hover:shadow-[0_1px_0_0_#E8958A] hover:translate-y-[1px]',
              'active:shadow-none active:translate-y-[2px]',
              'transition-all duration-150',
              variant === 'compact' && 'px-3 py-1 text-xs'
            )}
          >
            Søg
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-[#FFB5A7]/20 overflow-hidden z-50">
          {/* Suggestions from search */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-semibold text-[#9CA3AF] px-3 py-1">Spil</p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.slug || suggestion.label}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors',
                    selectedIndex === index
                      ? 'bg-[#FFB5A7]/20'
                      : 'hover:bg-[#FFF9F0]'
                  )}
                >
                  <span className="text-xl">{suggestion.emoji}</span>
                  <span className="font-medium text-[#4A4A4A]">{suggestion.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular searches */}
          {query.length < 2 && showPopularSearches && (
            <div className="p-2 border-t border-[#FFB5A7]/10">
              <p className="text-xs font-semibold text-[#9CA3AF] px-3 py-1">Populære søgninger</p>
              {popularSearches.map((search, index) => (
                <button
                  key={search.label}
                  onClick={() => handleSuggestionClick(search)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors',
                    selectedIndex === suggestions.length + index
                      ? 'bg-[#FFB5A7]/20'
                      : 'hover:bg-[#FFF9F0]'
                  )}
                >
                  <span className="text-xl">{search.emoji}</span>
                  <span className="font-medium text-[#4A4A4A]">{search.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Quick filters */}
          {query.length < 2 && showQuickSuggestions && (
            <div className="p-3 border-t border-[#FFB5A7]/10 bg-[#FFF9F0]">
              <div className="flex flex-wrap gap-2">
                {quickCategories.slice(0, 4).map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleSuggestionClick(cat)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white text-[#4A4A4A] hover:bg-[#FFB5A7]/20 transition-colors"
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Natural language hint */}
      {query.length > 0 && isFocused && (
        <div className="absolute -bottom-6 left-0 text-xs text-[#9CA3AF]">
          Prøv: &quot;gratis læringsspil til 5-årige&quot;
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SIMPLE SEARCH INPUT (Minimal version)
// ============================================================================

interface SimpleSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SimpleSearchInput({
  value,
  onChange,
  placeholder = 'Søg...',
  className,
}: SimpleSearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-4 py-2.5 rounded-xl',
          'bg-[#FFFCF7] border-2 border-transparent',
          'text-[#4A4A4A] text-sm placeholder:text-[#9CA3AF]',
          'focus:outline-none focus:border-[#FFB5A7]',
          'transition-colors'
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#9CA3AF]/20 flex items-center justify-center hover:bg-[#9CA3AF]/30 transition-colors"
        >
          <svg className="w-3 h-3 text-[#7A7A7A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export { parseNaturalLanguage };
export default SearchBar;
