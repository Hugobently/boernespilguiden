'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface SearchSuggestion {
  type: 'game' | 'boardgame' | 'media' | 'category' | 'age';
  title: string;
  slug: string;
  icon: string;
}

// ============================================================================
// SEARCH INPUT COMPONENT
// ============================================================================

export function HeaderSearchInput({
  className,
  onClose,
}: {
  className?: string;
  onClose?: () => void;
}) {
  const router = useRouter();
  const t = useTranslations();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Quick suggestions when empty - memoized to prevent infinite loops
  const quickSuggestions: SearchSuggestion[] = useMemo(
    () => [
      { type: 'age', title: t('ageGroups.0-3'), slug: '0-3', icon: '👶' },
      { type: 'age', title: t('ageGroups.3-6'), slug: '3-6', icon: '🧒' },
      { type: 'age', title: t('ageGroups.7+'), slug: '7+', icon: '👦' },
      { type: 'category', title: t('categories.learning'), slug: 'laering', icon: '📚' },
      { type: 'category', title: t('games.noAds'), slug: 'ingen-reklamer', icon: '🚫' },
    ],
    [t]
  );

  // Fetch suggestions
  const fetchSuggestions = useCallback(
    async (searchQuery: string, defaultSuggestions: SearchSuggestion[]) => {
      if (searchQuery.length < 2) {
        setSuggestions(defaultSuggestions);
        return;
      }

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=6`);
        const data = await res.json();

        if (data.success) {
          const results: SearchSuggestion[] = [];

          // Add digital games
          data.data.digital?.slice(0, 2).forEach((game: { title: string; slug: string }) => {
            results.push({
              type: 'game',
              title: game.title,
              slug: game.slug,
              icon: '🎮',
            });
          });

          // Add board games
          data.data.board?.slice(0, 2).forEach((game: { title: string; slug: string }) => {
            results.push({
              type: 'boardgame',
              title: game.title,
              slug: game.slug,
              icon: '🎲',
            });
          });

          // Add Film & Serier
          data.data.media?.slice(0, 2).forEach((item: { title: string; slug: string }) => {
            results.push({
              type: 'media',
              title: item.title,
              slug: item.slug,
              icon: '📺',
            });
          });

          setSuggestions(results.length > 0 ? results : defaultSuggestions);
        }
      } catch {
        setSuggestions(defaultSuggestions);
      }
    },
    []
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(query, quickSuggestions);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, fetchSuggestions, quickSuggestions]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelect(suggestions[selectedIndex]);
      } else if (query) {
        router.push(`/soeg?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
        onClose?.();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'game':
        router.push(`/spil/${suggestion.slug}`);
        break;
      case 'boardgame':
        router.push(`/braetspil/${suggestion.slug}`);
        break;
      case 'media':
        router.push(`/film-serier/${suggestion.slug}`);
        break;
      case 'age':
        router.push(`/spil?alder=${suggestion.slug}`);
        break;
      case 'category':
        router.push(`/soeg?q=${encodeURIComponent(suggestion.title)}`);
        break;
    }
    setIsOpen(false);
    setQuery('');
    onClose?.();
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        {/* Search icon */}
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t('common.searchPlaceholder')}
          className={cn(
            'w-full pl-12 pr-4 py-3 rounded-2xl',
            'bg-[#FFFCF7] border-2 border-transparent',
            'text-[#4A4A4A] placeholder:text-[#6B7280]',
            'shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]',
            'transition-all duration-200',
            'focus:outline-none focus:border-[#FFB5A7] focus:shadow-[0_0_0_4px_rgba(255,181,167,0.2)]'
          )}
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Ryd søgefelt"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#4A4A4A]/10 transition-colors"
          >
            <svg className="w-4 h-4 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFCF7] rounded-2xl shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] border border-[#FFB5A7]/20 overflow-hidden z-50">
          <div className="p-2">
            {!query && (
              <p className="px-3 py-2 text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                {t('search.quickSearch')}
              </p>
            )}
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.slug}`}
                type="button"
                onClick={() => handleSelect(suggestion)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                  'text-left transition-colors',
                  selectedIndex === index
                    ? 'bg-[#FFB5A7]/20 text-[#4A4A4A]'
                    : 'hover:bg-[#FFB5A7]/10 text-[#4A4A4A]'
                )}
              >
                <span className="text-lg">{suggestion.icon}</span>
                <span className="font-medium">{suggestion.title}</span>
                <span className="ml-auto text-xs text-[#6B7280]">
                  {suggestion.type === 'game' && t('search.gamesCategory')}
                  {suggestion.type === 'boardgame' && t('search.boardGamesCategory')}
                  {suggestion.type === 'age' && t('search.ageCategory')}
                  {suggestion.type === 'category' && t('search.categoryCategory')}
                </span>
              </button>
            ))}
          </div>

          {query && (
            <div className="border-t border-[#FFB5A7]/10 p-2">
              <button
                type="button"
                onClick={() => {
                  router.push(`/soeg?q=${encodeURIComponent(query)}`);
                  setIsOpen(false);
                  onClose?.();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFB5A7]/10 transition-colors"
              >
                <svg className="w-5 h-5 text-[#FFB5A7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="font-medium text-[#4A4A4A]">
                  {t('search.searchFor')} &quot;{query}&quot;
                </span>
                <span className="ml-auto text-xs text-[#6B7280]">Enter ↵</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
