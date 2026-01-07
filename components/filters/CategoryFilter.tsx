'use client';

import { cn } from '@/lib/utils';
import { forwardRef, HTMLAttributes } from 'react';

// ============================================================================
// CATEGORY CONFIGURATIONS
// ============================================================================

interface CategoryConfig {
  slug: string;
  label: string;
  emoji: string;
  color: { bg: string; text: string; border: string };
}

const gameCategories: CategoryConfig[] = [
  { slug: 'læring', label: 'Læring', emoji: '📚', color: { bg: '#D8F3DC', text: '#2D6A4F', border: '#95D5B2' } },
  { slug: 'eventyr', label: 'Eventyr', emoji: '🏰', color: { bg: '#E2C2FF', text: '#5B4670', border: '#CDB4DB' } },
  { slug: 'puslespil', label: 'Puslespil', emoji: '🧩', color: { bg: '#BAE1FF', text: '#1D4E89', border: '#8ECAE6' } },
  { slug: 'kreativ', label: 'Kreativ', emoji: '🎨', color: { bg: '#FFD1DC', text: '#8B4563', border: '#FFB6C1' } },
  { slug: 'action', label: 'Action', emoji: '⚡', color: { bg: '#FFF3B0', text: '#7D6608', border: '#FFE66D' } },
  { slug: 'musik', label: 'Musik', emoji: '🎵', color: { bg: '#BAFFC9', text: '#2D6A4F', border: '#95D5A6' } },
  { slug: 'sport', label: 'Sport', emoji: '⚽', color: { bg: '#FFB5A7', text: '#6B3A2E', border: '#F8A99B' } },
];

const boardGameCategories: CategoryConfig[] = [
  { slug: 'strategi', label: 'Strategi', emoji: '🧠', color: { bg: '#BAE1FF', text: '#1D4E89', border: '#8ECAE6' } },
  { slug: 'samarbejde', label: 'Samarbejde', emoji: '🤝', color: { bg: '#BAFFC9', text: '#2D6A4F', border: '#95D5A6' } },
  { slug: 'læring', label: 'Læring', emoji: '📚', color: { bg: '#D8F3DC', text: '#2D6A4F', border: '#95D5B2' } },
  { slug: 'fest', label: 'Fest', emoji: '🎉', color: { bg: '#FFD1DC', text: '#8B4563', border: '#FFB6C1' } },
  { slug: 'kort', label: 'Kort', emoji: '🃏', color: { bg: '#E2C2FF', text: '#5B4670', border: '#CDB4DB' } },
  { slug: 'familie', label: 'Familie', emoji: '👨‍👩‍👧‍👦', color: { bg: '#FFF3B0', text: '#7D6608', border: '#FFE66D' } },
  { slug: 'hukommelse', label: 'Hukommelse', emoji: '🧠', color: { bg: '#FFB5A7', text: '#6B3A2E', border: '#F8A99B' } },
];

const skillCategories: CategoryConfig[] = [
  { slug: 'matematik', label: 'Matematik', emoji: '🔢', color: { bg: '#BAE1FF', text: '#1D4E89', border: '#8ECAE6' } },
  { slug: 'læsning', label: 'Læsning', emoji: '📖', color: { bg: '#D8F3DC', text: '#2D6A4F', border: '#95D5B2' } },
  { slug: 'logik', label: 'Logik', emoji: '🧩', color: { bg: '#E2C2FF', text: '#5B4670', border: '#CDB4DB' } },
  { slug: 'motorik', label: 'Motorik', emoji: '🏃', color: { bg: '#BAFFC9', text: '#2D6A4F', border: '#95D5A6' } },
  { slug: 'sprog', label: 'Sprog', emoji: '💬', color: { bg: '#FFD1DC', text: '#8B4563', border: '#FFB6C1' } },
  { slug: 'kreativitet', label: 'Kreativitet', emoji: '🎨', color: { bg: '#FFF3B0', text: '#7D6608', border: '#FFE66D' } },
  { slug: 'samarbejde', label: 'Samarbejde', emoji: '🤝', color: { bg: '#FFB5A7', text: '#6B3A2E', border: '#F8A99B' } },
  { slug: 'koncentration', label: 'Koncentration', emoji: '🎯', color: { bg: '#CAF0F8', text: '#1D4E89', border: '#A0D2DB' } },
];

const themeCategories: CategoryConfig[] = [
  { slug: 'dyr', label: 'Dyr', emoji: '🐾', color: { bg: '#BAFFC9', text: '#2D6A4F', border: '#95D5A6' } },
  { slug: 'rummet', label: 'Rummet', emoji: '🚀', color: { bg: '#E2C2FF', text: '#5B4670', border: '#CDB4DB' } },
  { slug: 'prinsesser', label: 'Prinsesser', emoji: '👑', color: { bg: '#FFD1DC', text: '#8B4563', border: '#FFB6C1' } },
  { slug: 'dinosaurer', label: 'Dinosaurer', emoji: '🦖', color: { bg: '#D8F3DC', text: '#2D6A4F', border: '#95D5B2' } },
  { slug: 'eventyr', label: 'Eventyr', emoji: '🏰', color: { bg: '#BAE1FF', text: '#1D4E89', border: '#8ECAE6' } },
  { slug: 'natur', label: 'Natur', emoji: '🌿', color: { bg: '#95D5B2', text: '#2D6A4F', border: '#77DD77' } },
  { slug: 'biler', label: 'Biler', emoji: '🚗', color: { bg: '#FFF3B0', text: '#7D6608', border: '#FFE66D' } },
  { slug: 'superhelte', label: 'Superhelte', emoji: '🦸', color: { bg: '#FFB5A7', text: '#6B3A2E', border: '#F8A99B' } },
];

// ============================================================================
// CATEGORY PILL COMPONENT
// ============================================================================

interface CategoryPillProps {
  config: CategoryConfig;
  selected: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}

function CategoryPill({ config, selected, onClick, size = 'md' }: CategoryPillProps) {
  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1',
    md: 'px-3.5 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        sizeStyles[size],
        selected
          ? 'shadow-md scale-105'
          : 'hover:shadow-sm hover:scale-102'
      )}
      style={{
        backgroundColor: selected ? config.color.bg : `${config.color.bg}40`,
        color: config.color.text,
        borderWidth: '2px',
        borderColor: selected ? config.color.border : 'transparent',
      }}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
      {selected && (
        <span className="w-4 h-4 rounded-full bg-white/50 flex items-center justify-center ml-0.5">
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  );
}

// ============================================================================
// CATEGORY FILTER COMPONENT
// ============================================================================

export interface CategoryFilterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  type: 'game' | 'boardgame' | 'skill' | 'theme';
  selected: string[];
  onChange: (categories: string[]) => void;
  size?: 'sm' | 'md' | 'lg';
  multiSelect?: boolean;
  showLabel?: boolean;
  label?: string;
  maxVisible?: number;
}

export const CategoryFilter = forwardRef<HTMLDivElement, CategoryFilterProps>(
  (
    {
      type,
      selected,
      onChange,
      size = 'md',
      multiSelect = true,
      showLabel = true,
      label,
      maxVisible,
      className,
      ...props
    },
    ref
  ) => {
    const categoriesMap = {
      game: gameCategories,
      boardgame: boardGameCategories,
      skill: skillCategories,
      theme: themeCategories,
    };

    const defaultLabels = {
      game: 'Kategorier',
      boardgame: 'Kategorier',
      skill: 'Færdigheder',
      theme: 'Temaer',
    };

    const categories = categoriesMap[type];
    const displayLabel = label || defaultLabels[type];
    const visibleCategories = maxVisible ? categories.slice(0, maxVisible) : categories;
    const hasMore = maxVisible && categories.length > maxVisible;

    const handleToggle = (slug: string) => {
      if (multiSelect) {
        if (selected.includes(slug)) {
          onChange(selected.filter((c) => c !== slug));
        } else {
          onChange([...selected, slug]);
        }
      } else {
        onChange(selected.includes(slug) ? [] : [slug]);
      }
    };

    const handleClearAll = () => {
      onChange([]);
    };

    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        {showLabel && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#4A4A4A] flex items-center gap-2">
              <span>🏷️</span>
              <span>{displayLabel}</span>
            </label>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-[#7A7A7A] hover:text-[#F8A99B] transition-colors"
              >
                Ryd alle
              </button>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {visibleCategories.map((config) => (
            <CategoryPill
              key={config.slug}
              config={config}
              selected={selected.includes(config.slug)}
              onClick={() => handleToggle(config.slug)}
              size={size}
            />
          ))}

          {hasMore && (
            <span className="inline-flex items-center px-3 py-1.5 text-sm text-[#7A7A7A]">
              +{categories.length - maxVisible!} mere
            </span>
          )}
        </div>

        {multiSelect && selected.length > 0 && (
          <p className="text-xs text-[#7A7A7A]">
            {selected.length} valgt
          </p>
        )}
      </div>
    );
  }
);

CategoryFilter.displayName = 'CategoryFilter';

// ============================================================================
// SIMPLE CATEGORY FILTER (Legacy compatible)
// ============================================================================

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
}

interface SimpleCategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  className?: string;
}

export function SimpleCategoryFilter({
  categories,
  selectedCategories,
  onChange,
  className,
}: SimpleCategoryFilterProps) {
  const toggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      onChange(selectedCategories.filter((c) => c !== slug));
    } else {
      onChange([...selectedCategories, slug]);
    }
  };

  // Map custom categories to pill format
  const colors = [
    { bg: '#FFB5A7', text: '#6B3A2E', border: '#F8A99B' },
    { bg: '#B8E0D2', text: '#2D6A4F', border: '#95D5B2' },
    { bg: '#A2D2FF', text: '#1D4E89', border: '#8ECAE6' },
    { bg: '#FFE66D', text: '#7D6608', border: '#FFD93D' },
    { bg: '#CDB4DB', text: '#5B4670', border: '#B392C9' },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="font-bold text-lg text-[#4A4A4A] flex items-center gap-2">
        <span>🏷️</span>
        <span>Kategorier</span>
      </h3>

      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => {
          const isSelected = selectedCategories.includes(category.slug);
          const color = colors[index % colors.length];

          return (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.slug)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all duration-200',
                isSelected ? 'shadow-md scale-105' : 'hover:shadow-sm hover:scale-102'
              )}
              style={{
                backgroundColor: isSelected ? color.bg : `${color.bg}40`,
                color: color.text,
                borderWidth: '2px',
                borderColor: isSelected ? color.border : 'transparent',
              }}
            >
              {category.icon && <span>{category.icon}</span>}
              <span>{category.name}</span>
              {isSelected && (
                <span className="w-4 h-4 rounded-full bg-white/50 flex items-center justify-center">
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
  );
}

// Export category configs for use elsewhere
export { gameCategories, boardGameCategories, skillCategories, themeCategories };
export default CategoryFilter;
