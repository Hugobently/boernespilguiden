'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

type SortOption = 'popular' | 'newest' | 'rating' | 'adfree';

interface FilterState {
  adFree?: boolean;
  free?: boolean;
  offline?: boolean;
  noInAppPurchases?: boolean;
  categories?: string[];
}

interface CategoryInfo {
  name: string;
  count: number;
}

interface Translations {
  filters: string;
  clearAll: string;
  parentFilters: string;
  adFree: string;
  noInAppPurchases: string;
  offline: string;
  freeOnly: string;
  categories: string;
  showResults: string;
  popular: string;
  newest: string;
  bestRated: string;
  adFreeFirst: string;
}

// ============================================================================
// CATEGORY CONFIG
// ============================================================================

const categoryEmojis: Record<string, string> = {
  'læring': '📚',
  'eventyr': '🏰',
  'puslespil': '🧩',
  'kreativ': '🎨',
  'action': '⚡',
  'musik': '🎵',
  'sport': '⚽',
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  'læring': { bg: '#D8F3DC', text: '#2D6A4F' },
  'eventyr': { bg: '#E2C2FF', text: '#5B4670' },
  'puslespil': { bg: '#BAE1FF', text: '#1D4E89' },
  'kreativ': { bg: '#FFD1DC', text: '#8B4563' },
  'action': { bg: '#FFF3B0', text: '#7D6608' },
  'musik': { bg: '#BAFFC9', text: '#2D6A4F' },
  'sport': { bg: '#FFB5A7', text: '#6B3A2E' },
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
    { value: 'adfree', label: translations.adFreeFirst, emoji: '🛡️' },
  ];

  const handleSortChange = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    params.delete('page'); // Reset to page 1 when sorting changes
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value as SortOption)}
        className={cn(
          'appearance-none px-4 py-2.5 pr-10 rounded-2xl',
          'bg-[#FFFCF7] border-2 border-[#FFB5A7]/30',
          'text-[#4A4A4A] font-semibold text-sm',
          'focus:outline-none focus:border-[#FFB5A7]',
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

  const updateFilters = (key: string, value: string | boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === false || value === '') {
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

  const hasFilters = filters.adFree || filters.free || filters.offline || filters.noInAppPurchases || selectedCategories.length > 0;

  return (
    <div className="bg-[#FFFCF7] rounded-3xl p-6 shadow-sm border border-[#FFB5A7]/10">
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

      {/* Parent Filters */}
      <div className="space-y-3 mb-8">
        <h4 className="text-sm font-semibold text-[#4A4A4A] flex items-center gap-2">
          <span>👨‍👩‍👧‍👦</span>
          <span>{translations.parentFilters}</span>
        </h4>

        <FilterToggle
          label={translations.adFree}
          emoji="🚫"
          checked={filters.adFree || false}
          onChange={(checked) => updateFilters('reklamefri', checked)}
          color="#77DD77"
        />
        <FilterToggle
          label={translations.noInAppPurchases}
          emoji="💰"
          checked={filters.noInAppPurchases || false}
          onChange={(checked) => updateFilters('ingenKob', checked)}
          color="#77DD77"
        />
        <FilterToggle
          label={translations.offline}
          emoji="📱"
          checked={filters.offline || false}
          onChange={(checked) => updateFilters('offline', checked)}
          color="#A2D2FF"
        />
        <FilterToggle
          label={translations.freeOnly}
          emoji="🆓"
          checked={filters.free || false}
          onChange={(checked) => updateFilters('gratis', checked)}
          color="#FFE66D"
        />
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
              const emoji = categoryEmojis[cat.name] || '🎮';
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
// FILTER TOGGLE
// ============================================================================

interface FilterToggleProps {
  label: string;
  emoji: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color: string;
}

function FilterToggle({ label, emoji, checked, onChange, color }: FilterToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center justify-between w-full p-3 rounded-2xl transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FFB5A7]',
        checked
          ? 'bg-white shadow-sm border-2'
          : 'bg-white/50 hover:bg-white border-2 border-transparent'
      )}
      style={{ borderColor: checked ? color : 'transparent' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <span className="font-medium text-[#4A4A4A] text-sm">{label}</span>
      </div>

      {/* Toggle switch */}
      <div
        className={cn('relative w-10 h-5 rounded-full transition-colors duration-200')}
        style={{ backgroundColor: checked ? color : '#E5E5E5' }}
      >
        <div
          className={cn(
            'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200',
            checked && 'translate-x-5'
          )}
        />
      </div>
    </button>
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
    (filters.adFree ? 1 : 0) +
    (filters.free ? 1 : 0) +
    (filters.offline ? 1 : 0) +
    (filters.noInAppPurchases ? 1 : 0) +
    selectedCategories.length;

  return (
    <>
      {/* Trigger buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold transition-all',
            'bg-[#FFFCF7] border-2 border-[#FFB5A7]/30 text-[#4A4A4A]',
            'hover:border-[#FFB5A7] active:scale-98'
          )}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>{translations.filters}</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#FFB5A7] text-white text-xs">
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
                className="w-full py-4 rounded-2xl bg-[#FFB5A7] text-white font-bold text-lg hover:bg-[#F8A99B] transition-colors"
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

  const filterLabels: { key: string; paramKey: string; label: string; emoji: string }[] = [
    { key: 'adFree', paramKey: 'reklamefri', label: translations.adFree, emoji: '🚫' },
    { key: 'free', paramKey: 'gratis', label: translations.freeOnly, emoji: '🆓' },
    { key: 'offline', paramKey: 'offline', label: translations.offline, emoji: '📱' },
    { key: 'noInAppPurchases', paramKey: 'ingenKob', label: translations.noInAppPurchases, emoji: '💰' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filterLabels.map(({ key, paramKey, label, emoji }) =>
        filters[key as keyof FilterState] ? (
          <span
            key={key}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#77DD77]/20 text-[#2D6A4F] text-sm font-medium"
          >
            <span>{emoji}</span>
            <span>{label}</span>
            <button
              onClick={() => removeFilter(paramKey)}
              className="ml-1 w-4 h-4 rounded-full bg-[#2D6A4F]/20 flex items-center justify-center hover:bg-[#2D6A4F]/30 transition-colors"
            >
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ) : null
      )}

      {selectedCategories.map((cat) => {
        const colors = categoryColors[cat] || { bg: '#F5F5F5', text: '#4A4A4A' };
        const emoji = categoryEmojis[cat] || '🎮';
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

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className="flex justify-center items-center gap-2 mt-12" aria-label="Pagination">
      {/* Previous button */}
      <Link
        href={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl transition-all',
          currentPage > 1
            ? 'bg-[#FFFCF7] text-[#4A4A4A] hover:bg-[#FFB5A7]/20 hover:shadow-sm'
            : 'bg-[#F5F5F5] text-[#6B7280] cursor-not-allowed'
        )}
        aria-disabled={currentPage <= 1}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      {/* Page numbers */}
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
                  ? 'bg-[#FFB5A7] text-white shadow-[0_4px_0_0_#E89488]'
                  : 'bg-[#FFFCF7] text-[#4A4A4A] hover:bg-[#FFB5A7]/20'
              )}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next button */}
      <Link
        href={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl transition-all',
          currentPage < totalPages
            ? 'bg-[#FFFCF7] text-[#4A4A4A] hover:bg-[#FFB5A7]/20 hover:shadow-sm'
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
