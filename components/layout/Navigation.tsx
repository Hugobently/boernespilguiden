'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

// ============================================================================
// AGE GROUP CONFIGURATION
// ============================================================================

const ageGroups = [
  {
    slug: '0-3',
    label: '0-3 år',
    shortLabel: 'Baby',
    emoji: '👶',
    color: {
      bg: '#FFD1DC',
      bgHover: '#FFBDCC',
      text: '#8B4563',
      border: '#FFB6C1',
    },
  },
  {
    slug: '3-6',
    label: '3-6 år',
    shortLabel: 'Småbørn',
    emoji: '🧒',
    color: {
      bg: '#BAFFC9',
      bgHover: '#A5F5B8',
      text: '#2D6A4F',
      border: '#95D5A6',
    },
  },
  {
    slug: '7+',
    label: '7+ år',
    shortLabel: 'Større børn',
    emoji: '👦',
    color: {
      bg: '#BAE1FF',
      bgHover: '#A5D4F5',
      text: '#1D4E89',
      border: '#8ECAE6',
    },
  },
];

// ============================================================================
// BREADCRUMB NAVIGATION
// ============================================================================

interface BreadcrumbItem {
  label: string;
  href?: string;
  emoji?: string;
}

interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items?: BreadcrumbItem[];
  breadcrumbs?: BreadcrumbItem[];
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, breadcrumbs, className, ...props }, ref) => {
    // Support both 'items' and 'breadcrumbs' prop names
    const breadcrumbItems = items || breadcrumbs || [];

    if (breadcrumbItems.length === 0) {
      return null;
    }

    return (
      <nav
        ref={ref}
        className={cn('flex items-center gap-2 text-sm', className)}
        aria-label="Brødkrummer"
        {...props}
      >
        <Link
          href="/"
          className="text-[#6B7280] hover:text-[#FFB5A7] transition-colors flex items-center gap-1"
        >
          <span>🏠</span>
          <span className="sr-only">Forside</span>
        </Link>

        {breadcrumbItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-[#6B7280]/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            {item.href ? (
              <Link
                href={item.href}
                className="text-[#6B7280] hover:text-[#FFB5A7] transition-colors flex items-center gap-1"
              >
                {item.emoji && <span>{item.emoji}</span>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="text-[#4A4A4A] font-medium flex items-center gap-1">
                {item.emoji && <span>{item.emoji}</span>}
                <span>{item.label}</span>
              </span>
            )}
          </div>
        ))}
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

// Legacy export for backwards compatibility
export const Navigation = Breadcrumb;

// ============================================================================
// AGE TABS NAVIGATION
// ============================================================================

interface AgeTabsProps extends HTMLAttributes<HTMLDivElement> {
  selectedAge?: string | null;
  onAgeChange?: (age: string | null) => void;
  baseUrl?: string;
  showAll?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pills' | 'tabs' | 'buttons';
}

export const AgeTabs = forwardRef<HTMLDivElement, AgeTabsProps>(
  (
    {
      selectedAge,
      onAgeChange,
      baseUrl = '/spil',
      showAll = true,
      size = 'md',
      variant = 'pills',
      className,
      ...props
    },
    ref
  ) => {
    const searchParams = useSearchParams();
    const currentAge = selectedAge ?? searchParams.get('alder');

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-5 py-2.5 text-lg gap-2.5',
    };

    const handleClick = (age: string | null) => {
      if (onAgeChange) {
        onAgeChange(age);
      }
    };

    const getHref = (age: string | null) => {
      if (age === null) {
        return baseUrl;
      }
      return `${baseUrl}?alder=${age}`;
    };

    const isActive = (age: string | null) => {
      if (age === null) {
        return !currentAge;
      }
      return currentAge === age;
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap gap-2',
          variant === 'tabs' && 'border-b border-[#FFB5A7]/20 pb-0 gap-0',
          className
        )}
        role="tablist"
        aria-label="Vælg aldersgruppe"
        {...props}
      >
        {/* "All" option */}
        {showAll && (
          <TabItem
            href={onAgeChange ? undefined : getHref(null)}
            onClick={onAgeChange ? () => handleClick(null) : undefined}
            isActive={isActive(null)}
            variant={variant}
            size={size}
            sizeStyles={sizeStyles}
          >
            <span>✨</span>
            <span>Alle aldre</span>
          </TabItem>
        )}

        {/* Age group options */}
        {ageGroups.map((age) => (
          <TabItem
            key={age.slug}
            href={onAgeChange ? undefined : getHref(age.slug)}
            onClick={onAgeChange ? () => handleClick(age.slug) : undefined}
            isActive={isActive(age.slug)}
            variant={variant}
            size={size}
            sizeStyles={sizeStyles}
            color={age.color}
          >
            <span>{age.emoji}</span>
            <span>{age.label}</span>
          </TabItem>
        ))}
      </div>
    );
  }
);

AgeTabs.displayName = 'AgeTabs';

// ============================================================================
// TAB ITEM (Internal component)
// ============================================================================

interface TabItemProps {
  href?: string;
  onClick?: () => void;
  isActive: boolean;
  variant: 'pills' | 'tabs' | 'buttons';
  size: 'sm' | 'md' | 'lg';
  sizeStyles: Record<string, string>;
  color?: {
    bg: string;
    bgHover: string;
    text: string;
    border: string;
  };
  children: React.ReactNode;
}

function TabItem({
  href,
  onClick,
  isActive,
  variant,
  size,
  sizeStyles,
  color,
  children,
}: TabItemProps) {
  const baseStyles = cn(
    'inline-flex items-center font-semibold transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    sizeStyles[size]
  );

  const getVariantStyles = () => {
    switch (variant) {
      case 'tabs':
        return cn(
          'rounded-t-xl border-b-2 -mb-px',
          isActive
            ? `bg-[${color?.bg || '#FFFCF7'}] border-[${color?.border || '#FFB5A7'}] text-[${color?.text || '#4A4A4A'}]`
            : 'bg-transparent border-transparent text-[#7A7A7A] hover:text-[#4A4A4A] hover:bg-[#4A4A4A]/5'
        );

      case 'buttons':
        return cn(
          'rounded-2xl',
          isActive
            ? `bg-[${color?.bg || '#FFB5A7'}] text-[${color?.text || '#4A4A4A'}] shadow-[0_4px_0_0_${color?.border || '#E8958A'}]`
            : `bg-[#FFFCF7] text-[#4A4A4A] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] hover:bg-[${color?.bg || '#FFB5A7'}]/20`
        );

      case 'pills':
      default:
        return cn(
          'rounded-full',
          isActive
            ? `bg-[${color?.bg || '#FFB5A7'}] text-[${color?.text || '#4A4A4A'}] shadow-md`
            : `bg-[#FFFCF7] text-[#4A4A4A] hover:bg-[${color?.bg || '#FFB5A7'}]/30`
        );
    }
  };

  const content = (
    <>
      {children}
      {isActive && variant === 'pills' && (
        <span className="sr-only">(valgt)</span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(baseStyles, getVariantStyles())}
        role="tab"
        aria-selected={isActive}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(baseStyles, getVariantStyles())}
      role="tab"
      aria-selected={isActive}
    >
      {content}
    </button>
  );
}

// ============================================================================
// CATEGORY PILLS NAVIGATION
// ============================================================================

interface CategoryPillsProps extends HTMLAttributes<HTMLDivElement> {
  categories: Array<{
    slug: string;
    label: string;
    emoji?: string;
    count?: number;
  }>;
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
  baseUrl?: string;
}

export const CategoryPills = forwardRef<HTMLDivElement, CategoryPillsProps>(
  (
    {
      categories,
      selectedCategory,
      onCategoryChange,
      baseUrl,
      className,
      ...props
    },
    ref
  ) => {
    const colors = ['coral', 'mint', 'sky', 'sunflower', 'lavender'];
    const colorMap: Record<string, { bg: string; text: string }> = {
      coral: { bg: '#FFB5A7', text: '#6B3A2E' },
      mint: { bg: '#B8E0D2', text: '#2D6A4F' },
      sky: { bg: '#A2D2FF', text: '#1D4E89' },
      sunflower: { bg: '#FFE66D', text: '#7D6608' },
      lavender: { bg: '#CDB4DB', text: '#5B4670' },
    };

    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap gap-2', className)}
        {...props}
      >
        {categories.map((category, index) => {
          const colorKey = colors[index % colors.length];
          const color = colorMap[colorKey];
          const isActive = selectedCategory === category.slug;

          const content = (
            <>
              {category.emoji && <span>{category.emoji}</span>}
              <span>{category.label}</span>
              {category.count !== undefined && (
                <span className="ml-1 text-xs opacity-70">({category.count})</span>
              )}
            </>
          );

          if (onCategoryChange) {
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() =>
                  onCategoryChange(isActive ? null : category.slug)
                }
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  isActive
                    ? `bg-[${color.bg}] text-[${color.text}] shadow-md scale-105`
                    : `bg-[${color.bg}]/20 text-[${color.text}] hover:bg-[${color.bg}]/40`
                )}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={category.slug}
              href={
                baseUrl
                  ? `${baseUrl}?kategori=${category.slug}`
                  : `?kategori=${category.slug}`
              }
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                isActive
                  ? `bg-[${color.bg}] text-[${color.text}] shadow-md scale-105`
                  : `bg-[${color.bg}]/20 text-[${color.text}] hover:bg-[${color.bg}]/40`
              )}
            >
              {content}
            </Link>
          );
        })}
      </div>
    );
  }
);

CategoryPills.displayName = 'CategoryPills';

// ============================================================================
// PAGE HEADER WITH NAVIGATION
// ============================================================================

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  emoji?: string;
  breadcrumbs?: BreadcrumbItem[];
  showAgeTabs?: boolean;
  selectedAge?: string | null;
  onAgeChange?: (age: string | null) => void;
  ageTabsBaseUrl?: string;
}

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      title,
      description,
      emoji,
      breadcrumbs,
      showAgeTabs = false,
      selectedAge,
      onAgeChange,
      ageTabsBaseUrl,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('mb-8', className)}
        {...props}
      >
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb items={breadcrumbs} className="mb-4" />
        )}

        {/* Title section */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#4A4A4A] flex items-center gap-3">
            {emoji && <span className="text-4xl md:text-5xl">{emoji}</span>}
            <span>{title}</span>
          </h1>
          {description && (
            <p className="mt-2 text-lg text-[#7A7A7A] max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {/* Age tabs */}
        {showAgeTabs && (
          <AgeTabs
            selectedAge={selectedAge}
            onAgeChange={onAgeChange}
            baseUrl={ageTabsBaseUrl}
            className="mb-6"
          />
        )}

        {/* Additional content slot */}
        {children}
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';

export default Navigation;
