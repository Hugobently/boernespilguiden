'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

type SortOption = 'popular' | 'newest' | 'rating' | 'playtime';

interface FilterState {
  players?: number;
  maxPlayTime?: number;
  maxComplexity?: number;
  categories?: string[];
}

interface CategoryInfo {
  name: string;
  count: number;
}

interface Translations {
  filters: string;
  clearAll: string;
  categories: string;
  playersFilter: string;
  playTimeFilter: string;
  difficultyFilter: string;
  veryEasy: string;
  easyDifficulty: string;
  mediumDifficulty: string;
  hardDifficulty: string;
  veryHard: string;
  showResults: string;
  popular: string;
  newest: string;
  bestRated: string;
  shortestPlaytime: string;
  playersPlus: string;
  maxMinutes: string;
  difficultyLevel: string;
}

// ============================================================================
// CATEGORY CONFIG
// ============================================================================

const categoryEmojis: Record<string, string> = {
  'strategi': '🧠',
  'samarbejde': '🤝',
  'læring': '📚',
  'fest': '🎉',
  'kort': '🃏',
  'familie': '👨‍👩‍👧‍👦',
  'hukommelse': '🧩',
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  'strategi': { bg: '#BAE1FF', text: '#1D4E89' },
  'samarbejde': { bg: '#BAFFC9', text: '#2D6A4F' },
  'læring': { bg: '#D8F3DC', text: '#2D6A4F' },
  'fest': { bg: '#FFD1DC', text: '#8B4563' },
  'kort': { bg: '#E2C2FF', text: '#5B4670' },
  'familie': { bg: '#FFF3B0', text: '#7D6608' },
  'hukommelse': { bg: '#FFB5A7', text: '#6B3A2E' },
};

// ============================================================================
// SORT DROPDOWN
// ============================================================================

interface SortDropdownProps {
  currentSort: SortOption;
  ageGroup: string;
  translations: Translations;
}

export function SortDropdown({ currentSort, translations }: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const sortOptions: { value: SortOption; label: string; emoji: string }[] = [
    { value: 'popular', label: translations.popular, emoji: '🔥' },
    { value: 'newest', label: translations.newest, emoji: '✨' },
    { value: 'rating', label: translations.bestRated, emoji: '⭐' },
    { value: 'playtime', label: translations.shortestPlaytime, emoji: '⏱️' },
  ];

  const handleSortChange = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value as SortOption)}
        className={cn(
          'appearance-none px-4 py-2.5 pr-10 rounded-2xl',
          'bg-[#FFFCF7] border-2 border-[#FFE66D]/30',
          'text-[#4A4A4A] font-semibold text-sm',
          'focus:outline-none focus:border-[#FFE66D]',
          'transition-colors cursor-pointer'
        )}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.emoji} {option.label}
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

// ============================================================================
// FILTER SIDEBAR
// ============================================================================

interface FilterSidebarProps {
  ageGroup: string;
  availableCategories: CategoryInfo[];
  selectedCategories: string[];
  filters: FilterState;
  translations: Translations;
  categoryTranslations: Record<string, string>;
}

export function FilterSidebar({
  availableCategories,
  selectedCategories,
  filters,
  translations,
  categoryTranslations,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const updateFilters = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentCategories = selectedCategories;
    let newCategories: string[];

    if (currentCategories.includes(category)) {
      newCategories = currentCategories.filter((c) => c !== category);
    } else {
      newCategories = [...currentCategories, category];
    }

    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    } else {
      params.delete('categories');
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const hasFilters = filters.players || filters.maxPlayTime || filters.maxComplexity || selectedCategories.length > 0;

  const difficultyOptions = [
    { value: 1, label: translations.veryEasy, emoji: '😊' },
    { value: 2, label: translations.easyDifficulty, emoji: '🙂' },
    { value: 3, label: translations.mediumDifficulty, emoji: '🤔' },
    { value: 4, label: translations.hardDifficulty, emoji: '😤' },
    { value: 5, label: translations.veryHard, emoji: '🧠' },
  ];

  return (
    <div className="bg-[#FFFCF7] rounded-3xl p-6 shadow-sm border border-[#FFE66D]/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-[#4A4A4A] flex items-center gap-2">
          <span>🎯</span>
          <span>{translations.filters}</span>
        </h3>
        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-[#7A7A7A] hover:text-[#F8A99B] transition-colors"
          >
            {translations.clearAll}
          </button>
        )}
      </div>

      {/* Player Count Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[#4A4A4A] flex items-center gap-2 mb-3">
          <span>👥</span>
          <span>{translations.playersFilter}</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {[2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => updateFilters('spillere', filters.players === num ? null : num)}
              className={cn(
                'px-4 py-2 rounded-xl font-semibold transition-all duration-200',
                filters.players === num
                  ? 'bg-[#FFE66D] text-[#7D6608] shadow-sm'
                  : 'bg-white text-[#4A4A4A] hover:bg-[#FFE66D]/20'
              )}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Play Time Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[#4A4A4A] flex items-center gap-2 mb-3">
          <span>⏱️</span>
          <span>{translations.playTimeFilter}</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 15, label: '15 min' },
            { value: 30, label: '30 min' },
            { value: 45, label: '45 min' },
            { value: 60, label: '60+ min' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateFilters('spilletid', filters.maxPlayTime === option.value ? null : option.value)}
              className={cn(
                'px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-200',
                filters.maxPlayTime === option.value
                  ? 'bg-[#A2D2FF] text-[#1D4E89] shadow-sm'
                  : 'bg-white text-[#4A4A4A] hover:bg-[#A2D2FF]/20'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Complexity Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[#4A4A4A] flex items-center gap-2 mb-3">
          <span>🎚️</span>
          <span>{translations.difficultyFilter}</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {difficultyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateFilters('kompleksitet', filters.maxComplexity === option.value ? null : option.value)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-200',
                filters.maxComplexity === option.value
                  ? 'bg-[#CDB4DB] text-[#5B4670] shadow-sm'
                  : 'bg-white text-[#4A4A4A] hover:bg-[#CDB4DB]/20'
              )}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      {availableCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[#4A4A4A] flex items-center gap-2 mb-3">
            <span>🏷️</span>
            <span>{translations.categories}</span>
          </h4>

          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.name);
              const colors = categoryColors[cat.name] || { bg: '#F5F5F5', text: '#4A4A4A' };
              const emoji = categoryEmojis[cat.name] || '🎲';
              const displayName = categoryTranslations[cat.name] || cat.name;

              return (
                <button
                  key={cat.name}
                  onClick={() => toggleCategory(cat.name)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                    isSelected ? 'shadow-md scale-105' : 'hover:shadow-sm hover:scale-102'
                  )}
                  style={{
                    backgroundColor: isSelected ? colors.bg : `${colors.bg}40`,
                    color: colors.text,
                    borderWidth: '2px',
                    borderColor: isSelected ? colors.text + '30' : 'transparent',
                  }}
                >
                  <span>{emoji}</span>
                  <span className="capitalize">{displayName}</span>
                  <span className="text-xs opacity-60">({cat.count})</span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-white/50 flex items-center justify-center ml-0.5">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MOBILE FILTERS
// ============================================================================

interface MobileFiltersProps {
  ageGroup: string;
  availableCategories: CategoryInfo[];
  selectedCategories: string[];
  filters: FilterState;
  sort: SortOption;
  translations: Translations;
  categoryTranslations: Record<string, string>;
}

export function MobileFilters({
  ageGroup,
  availableCategories,
  selectedCategories,
  filters,
  sort,
  translations,
  categoryTranslations,
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount =
    (filters.players ? 1 : 0) +
    (filters.maxPlayTime ? 1 : 0) +
    (filters.maxComplexity ? 1 : 0) +
    selectedCategories.length;

  return (
    <>
      {/* Trigger buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold transition-all',
            'bg-[#FFFCF7] border-2 border-[#FFE66D]/30 text-[#4A4A4A]',
            'hover:border-[#FFE66D] active:scale-98'
          )}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>{translations.filters}</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#FFE66D] text-[#7D6608] text-xs">
              {activeCount}
            </span>
          )}
        </button>

        <SortDropdown currentSort={sort} ageGroup={ageGroup} translations={translations} />
      </div>

      {/* Filter drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#FFFDF8] rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up">
            {/* Handle */}
            <div className="sticky top-0 bg-[#FFFDF8] pt-4 pb-2 px-6 z-10">
              <div className="w-12 h-1 bg-[#E5E5E5] rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xl text-[#4A4A4A]">{translations.filters}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-[#F5F5F5] transition-colors"
                >
                  <svg className="w-6 h-6 text-[#4A4A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filter content */}
            <div className="px-6 pb-8">
              <FilterSidebar
                ageGroup={ageGroup}
                availableCategories={availableCategories}
                selectedCategories={selectedCategories}
                filters={filters}
                translations={translations}
                categoryTranslations={categoryTranslations}
              />
            </div>

            {/* Apply button */}
            <div className="sticky bottom-0 bg-[#FFFDF8] p-6 border-t border-[#E5E5E5]">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-4 rounded-2xl bg-[#FFE66D] text-[#7D6608] font-bold text-lg hover:bg-[#FFD93D] transition-colors"
              >
                {translations.showResults}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// ACTIVE FILTERS
// ============================================================================

interface ActiveFiltersProps {
  filters: FilterState;
  selectedCategories: string[];
  ageGroup: string;
  translations: Translations;
  categoryTranslations: Record<string, string>;
}

export function ActiveFilters({ filters, selectedCategories, translations, categoryTranslations }: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const removeCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const newCategories = selectedCategories.filter((c) => c !== category);
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    } else {
      params.delete('categories');
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.players && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFE66D]/20 text-[#7D6608] text-sm font-medium">
          <span>👥</span>
          <span>{translations.playersPlus.replace('{num}', String(filters.players))}</span>
          <button
            onClick={() => removeFilter('spillere')}
            className="ml-1 w-4 h-4 rounded-full bg-[#7D6608]/20 flex items-center justify-center hover:bg-[#7D6608]/30 transition-colors"
          >
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      )}

      {filters.maxPlayTime && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#A2D2FF]/20 text-[#1D4E89] text-sm font-medium">
          <span>⏱️</span>
          <span>{translations.maxMinutes.replace('{time}', String(filters.maxPlayTime))}</span>
          <button
            onClick={() => removeFilter('spilletid')}
            className="ml-1 w-4 h-4 rounded-full bg-[#1D4E89]/20 flex items-center justify-center hover:bg-[#1D4E89]/30 transition-colors"
          >
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      )}

      {filters.maxComplexity && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#CDB4DB]/20 text-[#5B4670] text-sm font-medium">
          <span>🎚️</span>
          <span>{translations.difficultyLevel.replace('{level}', String(filters.maxComplexity))}</span>
          <button
            onClick={() => removeFilter('kompleksitet')}
            className="ml-1 w-4 h-4 rounded-full bg-[#5B4670]/20 flex items-center justify-center hover:bg-[#5B4670]/30 transition-colors"
          >
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      )}

      {selectedCategories.map((cat) => {
        const colors = categoryColors[cat] || { bg: '#F5F5F5', text: '#4A4A4A' };
        const emoji = categoryEmojis[cat] || '🎲';
        const displayName = categoryTranslations[cat] || cat;

        return (
          <span
            key={cat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: `${colors.bg}60`, color: colors.text }}
          >
            <span>{emoji}</span>
            <span className="capitalize">{displayName}</span>
            <button
              onClick={() => removeCategory(cat)}
              className="ml-1 w-4 h-4 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: `${colors.text}20` }}
            >
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        );
      })}
    </div>
  );
}

// ============================================================================
// PAGINATION
// ============================================================================

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  ageGroup: string;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className="flex justify-center items-center gap-2 mt-12" aria-label="Pagination">
      <Link
        href={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl transition-all',
          currentPage > 1
            ? 'bg-[#FFFCF7] text-[#4A4A4A] hover:bg-[#FFE66D]/20 hover:shadow-sm'
            : 'bg-[#F5F5F5] text-[#6B7280] cursor-not-allowed'
        )}
        aria-disabled={currentPage <= 1}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="w-10 text-center text-[#7A7A7A]">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-xl font-semibold transition-all',
                page === currentPage
                  ? 'bg-[#FFE66D] text-[#7D6608] shadow-[0_4px_0_0_#E6CF00]'
                  : 'bg-[#FFFCF7] text-[#4A4A4A] hover:bg-[#FFE66D]/20'
              )}
            >
              {page}
            </Link>
          )
        )}
      </div>

      <Link
        href={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl transition-all',
          currentPage < totalPages
            ? 'bg-[#FFFCF7] text-[#4A4A4A] hover:bg-[#FFE66D]/20 hover:shadow-sm'
            : 'bg-[#F5F5F5] text-[#6B7280] cursor-not-allowed'
        )}
        aria-disabled={currentPage >= totalPages}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </nav>
  );
}
