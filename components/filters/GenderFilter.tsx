'use client';

import { cn } from '@/lib/utils';
import { forwardRef, HTMLAttributes } from 'react';
import { TargetGender } from '@/lib/types';

// ============================================================================
// GENDER CONFIGURATION
// ============================================================================

interface GenderConfig {
  value: TargetGender;
  label: string;
  emoji: string;
  color: {
    bg: string;
    bgSelected: string;
    text: string;
    border: string;
  };
  description: string;
}

const genderConfigs: GenderConfig[] = [
  {
    value: 'alle',
    label: 'Alle',
    emoji: '✨',
    color: {
      bg: '#FFB5A7',
      bgSelected: '#F8A99B',
      text: '#6B3A2E',
      border: '#E8958A',
    },
    description: 'Spil for alle børn',
  },
  {
    value: 'piger',
    label: 'Piger',
    emoji: '👧',
    color: {
      bg: '#FFD1DC',
      bgSelected: '#FFB6C1',
      text: '#8B4563',
      border: '#E89AAB',
    },
    description: 'Populære blandt piger',
  },
  {
    value: 'drenge',
    label: 'Drenge',
    emoji: '👦',
    color: {
      bg: '#BAE1FF',
      bgSelected: '#8ECAE6',
      text: '#1D4E89',
      border: '#6BB3D9',
    },
    description: 'Populære blandt drenge',
  },
];

// ============================================================================
// GENDER OPTION COMPONENT
// ============================================================================

interface GenderOptionProps {
  config: GenderConfig;
  selected: boolean;
  onClick: () => void;
  variant: 'pills' | 'cards' | 'buttons';
  size: 'sm' | 'md' | 'lg';
}

function GenderOption({
  config,
  selected,
  onClick,
  variant,
  size,
}: GenderOptionProps) {
  const sizeStyles = {
    sm: { padding: 'px-3 py-1.5', text: 'text-sm', emoji: 'text-lg', gap: 'gap-1.5' },
    md: { padding: 'px-4 py-2', text: 'text-base', emoji: 'text-xl', gap: 'gap-2' },
    lg: { padding: 'px-5 py-3', text: 'text-lg', emoji: 'text-2xl', gap: 'gap-2.5' },
  };

  const styles = sizeStyles[size];

  if (variant === 'cards') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex flex-col items-center p-4 rounded-2xl transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          selected ? 'shadow-lg scale-105' : 'shadow-sm hover:shadow-md hover:scale-102'
        )}
        style={{
          backgroundColor: selected ? config.color.bgSelected : config.color.bg,
          borderWidth: '3px',
          borderColor: selected ? config.color.border : 'transparent',
        }}
      >
        <span className="text-4xl mb-2">{config.emoji}</span>
        <span className="font-bold" style={{ color: config.color.text }}>
          {config.label}
        </span>
        <span className="text-xs mt-1 opacity-70" style={{ color: config.color.text }}>
          {config.description}
        </span>
        {selected && (
          <div
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
            style={{ backgroundColor: config.color.text }}
          >
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>
    );
  }

  if (variant === 'buttons') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'inline-flex items-center rounded-2xl font-semibold transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          styles.padding,
          styles.text,
          styles.gap,
          selected
            ? 'shadow-[0_4px_0_0_var(--shadow-color)]'
            : 'shadow-sm hover:shadow-md'
        )}
        style={{
          backgroundColor: selected ? config.color.bgSelected : config.color.bg,
          color: config.color.text,
          '--shadow-color': config.color.border,
        } as React.CSSProperties}
      >
        <span className={styles.emoji}>{config.emoji}</span>
        <span>{config.label}</span>
      </button>
    );
  }

  // Pills variant (default)
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full font-semibold transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        styles.padding,
        styles.text,
        styles.gap,
        selected
          ? 'shadow-md'
          : 'shadow-sm hover:shadow-md hover:-translate-y-0.5'
      )}
      style={{
        backgroundColor: selected ? config.color.bgSelected : `${config.color.bg}60`,
        color: config.color.text,
        borderWidth: '2px',
        borderColor: selected ? config.color.border : 'transparent',
      }}
    >
      <span className={styles.emoji}>{config.emoji}</span>
      <span>{config.label}</span>
      {selected && (
        <span className="w-5 h-5 rounded-full bg-white/50 flex items-center justify-center ml-0.5">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  );
}

// ============================================================================
// GENDER FILTER COMPONENT
// ============================================================================

export interface GenderFilterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  selected: TargetGender;
  onChange: (gender: TargetGender) => void;
  variant?: 'pills' | 'cards' | 'buttons';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  showDescription?: boolean;
}

export const GenderFilter = forwardRef<HTMLDivElement, GenderFilterProps>(
  (
    {
      selected,
      onChange,
      variant = 'pills',
      size = 'md',
      showLabel = true,
      label = 'Målgruppe',
      showDescription = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        {showLabel && (
          <label className="block text-sm font-semibold text-[#4A4A4A] flex items-center gap-2">
            <span>👫</span>
            <span>{label}</span>
            <span className="text-xs font-normal text-[#6B7280]">(valgfrit)</span>
          </label>
        )}

        <div
          className={cn(
            'flex',
            variant === 'cards' ? 'gap-4' : 'gap-2 flex-wrap'
          )}
          role="radiogroup"
          aria-label="Vælg målgruppe"
        >
          {genderConfigs.map((config) => (
            <GenderOption
              key={config.value}
              config={config}
              selected={selected === config.value}
              onClick={() => onChange(config.value)}
              variant={variant}
              size={size}
            />
          ))}
        </div>

        {showDescription && selected !== 'alle' && (
          <p className="text-xs text-[#7A7A7A]">
            {genderConfigs.find((c) => c.value === selected)?.description}
          </p>
        )}
      </div>
    );
  }
);

GenderFilter.displayName = 'GenderFilter';

// ============================================================================
// COMPACT GENDER SELECTOR (Dropdown)
// ============================================================================

export interface CompactGenderSelectorProps {
  selected: TargetGender;
  onChange: (gender: TargetGender) => void;
}

export function CompactGenderSelector({
  selected,
  onChange,
}: CompactGenderSelectorProps) {
  return (
    <div className="relative">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value as TargetGender)}
        className={cn(
          'w-full appearance-none px-4 py-3 pr-10 rounded-2xl',
          'bg-[#FFFCF7] border-2 border-[#FFB5A7]/30',
          'text-[#4A4A4A] font-semibold',
          'focus:outline-none focus:border-[#FFB5A7]',
          'transition-colors cursor-pointer'
        )}
      >
        {genderConfigs.map((config) => (
          <option key={config.value} value={config.value}>
            {config.emoji} {config.label}
          </option>
        ))}
      </select>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-[#7A7A7A]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}

export { genderConfigs };
export default GenderFilter;
