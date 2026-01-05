'use client';

import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onChange,
  className,
}: CategoryFilterProps) {
  const toggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      onChange(selectedCategories.filter((c) => c !== slug));
    } else {
      onChange([...selectedCategories, slug]);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="font-display text-lg font-bold text-charcoal">
        Kategorier
      </h3>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.slug);

          return (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.slug)}
              className={cn(
                'px-4 py-2 rounded-xl font-body font-medium transition-all duration-200',
                isSelected
                  ? 'bg-candy-purple text-white shadow-md'
                  : 'bg-white text-charcoal border-2 border-candy-purple/20 hover:border-candy-purple hover:text-candy-purple'
              )}
            >
              {category.icon && <span className="mr-2">{category.icon}</span>}
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
