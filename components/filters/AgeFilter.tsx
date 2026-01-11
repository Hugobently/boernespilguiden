'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { forwardRef, HTMLAttributes } from 'react';
import { AgeGroup } from '@/lib/types';
import { ageGroups, AgeGroupConfig } from '@/lib/config/age-groups';

// ============================================================================
// AGE CHIP (Interactive button)
// ============================================================================

interface AgeChipProps {
  config: AgeGroupConfig;
  selected: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}

function AgeChip({ config, selected, onClick, size = 'md' }: AgeChipProps) {
  const sizeStyles = {
    sm: { padding: 'px-3 py-1.5', text: 'text-sm', emoji: 'text-lg', gap: 'gap-1.5' },
    md: { padding: 'px-4 py-2', text: 'text-base', emoji: 'text-xl', gap: 'gap-2' },
    lg: { padding: 'px-5 py-3', text: 'text-lg', emoji: 'text-2xl', gap: 'gap-2.5' },
  };

  const styles = sizeStyles[size];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center rounded-full font-semibold transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        styles.padding,
        styles.text,
        styles.gap,
        selected
          ? 'shadow-[0_4px_0_0_var(--shadow-color)] hover:shadow-[0_2px_0_0_var(--shadow-color)] hover:translate-y-0.5 active:shadow-none active:translate-y-1'
          : 'shadow-sm hover:shadow-md hover:-translate-y-0.5'
      )}
      style={{
        backgroundColor: selected ? config.color.bgSelected : config.color.bg,
        color: config.color.text,
        '--shadow-color': config.color.shadow,
        borderColor: selected ? config.color.border : 'transparent',
        borderWidth: '2px',
      } as React.CSSProperties}
    >
      <span className={styles.emoji}>{config.emoji}</span>
      <span>{config.label}</span>

      {selected && (
        <span className="ml-1 w-5 h-5 rounded-full bg-white/50 flex items-center justify-center">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  );
}

// ============================================================================
// AGE CARD (Visual variant for larger displays)
// ============================================================================

interface AgeCardProps {
  config: AgeGroupConfig;
  selected: boolean;
  onClick: () => void;
}

function AgeCard({ config, selected, onClick }: AgeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center p-4 rounded-3xl transition-all duration-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        selected ? 'shadow-lg scale-105' : 'shadow-sm hover:shadow-md hover:scale-102'
      )}
      style={{
        backgroundColor: selected ? config.color.bgSelected : config.color.bg,
        borderWidth: '3px',
        borderColor: selected ? config.color.border : 'transparent',
      }}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-transform',
          selected ? 'scale-110' : ''
        )}
        style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
      >
        <span className="text-4xl">{config.emoji}</span>
      </div>

      <span className="font-bold text-lg" style={{ color: config.color.text }}>
        {config.label}
      </span>

      <span className="text-xs mt-1 opacity-70" style={{ color: config.color.text }}>
        {config.description}
      </span>

      {selected && (
        <div
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md"
          style={{ backgroundColor: config.color.text }}
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

// ============================================================================
// AGE FILTER - CONTROLLED VERSION
// ============================================================================

export interface AgeFilterControlledProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  selected: AgeGroup[];
  onChange: (ages: AgeGroup[]) => void;
  variant?: 'chips' | 'cards';
  size?: 'sm' | 'md' | 'lg';
  multiSelect?: boolean;
  showAllOption?: boolean;
  label?: string;
}

export const AgeFilterControlled = forwardRef<HTMLDivElement, AgeFilterControlledProps>(
  (
    {
      selected,
      onChange,
      variant = 'chips',
      size = 'md',
      multiSelect = true,
      showAllOption = true,
      label,
      className,
      ...props
    },
    ref
  ) => {
    const handleToggle = (age: AgeGroup) => {
      if (multiSelect) {
        if (selected.includes(age)) {
          onChange(selected.filter((a) => a !== age));
        } else {
          onChange([...selected, age]);
        }
      } else {
        onChange(selected.includes(age) ? [] : [age]);
      }
    };

    const handleSelectAll = () => {
      onChange([]);
    };

    const allSelected = selected.length === 0;

    if (variant === 'cards') {
      return (
        <div ref={ref} className={cn('space-y-3', className)} {...props}>
          {label && (
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">{label}</label>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ageGroups.map((config) => (
              <AgeCard
                key={config.slug}
                config={config}
                selected={selected.includes(config.slug)}
                onClick={() => handleToggle(config.slug)}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        {label && (
          <label className="block text-sm font-semibold text-[#4A4A4A]">{label}</label>
        )}
        <div
          className={cn(
            'flex flex-wrap',
            size === 'sm' ? 'gap-2' : size === 'md' ? 'gap-2.5' : 'gap-3'
          )}
          role="group"
          aria-label="Vælg aldersgrupper"
        >
          {showAllOption && (
            <button
              type="button"
              onClick={handleSelectAll}
              className={cn(
                'inline-flex items-center rounded-full font-semibold transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                size === 'sm' ? 'px-3 py-1.5 text-sm gap-1.5' : size === 'md' ? 'px-4 py-2 text-base gap-2' : 'px-5 py-3 text-lg gap-2.5',
                allSelected
                  ? 'bg-[#FFB5A7] text-white shadow-[0_4px_0_0_#E8958A]'
                  : 'bg-[#FFFCF7] text-[#4A4A4A] shadow-sm hover:shadow-md border-2 border-[#FFB5A7]/30'
              )}
            >
              <span className={size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}>✨</span>
              <span>Alle aldre</span>
            </button>
          )}

          {ageGroups.map((config) => (
            <AgeChip
              key={config.slug}
              config={config}
              selected={selected.includes(config.slug)}
              onClick={() => handleToggle(config.slug)}
              size={size}
            />
          ))}
        </div>

        {multiSelect && selected.length > 0 && selected.length < ageGroups.length && (
          <p className="text-sm text-[#7A7A7A]">
            {selected.length} aldersgruppe{selected.length > 1 ? 'r' : ''} valgt
          </p>
        )}
      </div>
    );
  }
);

AgeFilterControlled.displayName = 'AgeFilterControlled';

// ============================================================================
// AGE FILTER - LINK BASED VERSION (Original)
// ============================================================================

interface AgeFilterProps {
  basePath: string;
  selectedAge?: string;
  className?: string;
}

export function AgeFilter({ basePath, selectedAge, className }: AgeFilterProps) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      <Link
        href={basePath}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200',
          !selectedAge
            ? 'bg-[#FFB5A7] text-white shadow-[0_4px_0_0_#E8958A]'
            : 'bg-[#FFFCF7] text-[#4A4A4A] shadow-sm hover:shadow-md border-2 border-[#FFB5A7]/30'
        )}
      >
        <span className="text-xl">✨</span>
        <span>Alle aldre</span>
      </Link>

      {ageGroups.map((config) => (
        <Link
          key={config.slug}
          href={`${basePath}?alder=${config.slug}`}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200',
            selectedAge === config.slug
              ? 'shadow-[0_4px_0_0_var(--shadow-color)]'
              : 'shadow-sm hover:shadow-md hover:-translate-y-0.5'
          )}
          style={{
            backgroundColor: selectedAge === config.slug ? config.color.bgSelected : config.color.bg,
            color: config.color.text,
            '--shadow-color': config.color.shadow,
            borderWidth: '2px',
            borderColor: selectedAge === config.slug ? config.color.border : 'transparent',
          } as React.CSSProperties}
        >
          <span className="text-xl">{config.emoji}</span>
          <span>{config.label}</span>
        </Link>
      ))}
    </div>
  );
}

// ============================================================================
// COMPACT AGE SELECTOR (Dropdown)
// ============================================================================

export interface CompactAgeSelectorProps {
  selected: AgeGroup | null;
  onChange: (age: AgeGroup | null) => void;
}

export function CompactAgeSelector({ selected, onChange }: CompactAgeSelectorProps) {
  return (
    <div className="relative">
      <select
        value={selected || ''}
        onChange={(e) => onChange((e.target.value as AgeGroup) || null)}
        className={cn(
          'w-full appearance-none px-4 py-3 pr-10 rounded-2xl',
          'bg-[#FFFCF7] border-2 border-[#FFB5A7]/30',
          'text-[#4A4A4A] font-semibold',
          'focus:outline-none focus:border-[#FFB5A7]',
          'transition-colors cursor-pointer'
        )}
      >
        <option value="">✨ Alle aldre</option>
        {ageGroups.map((config) => (
          <option key={config.slug} value={config.slug}>
            {config.emoji} {config.label}
          </option>
        ))}
      </select>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-5 h-5 text-[#7A7A7A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export { ageGroups };
export default AgeFilter;
