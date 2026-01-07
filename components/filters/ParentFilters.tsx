'use client';

import { cn } from '@/lib/utils';
import { forwardRef, HTMLAttributes } from 'react';

// ============================================================================
// TOGGLE SWITCH COMPONENT
// ============================================================================

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  emoji: string;
  color: { active: string; track: string };
  size?: 'sm' | 'md';
}

function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  emoji,
  color,
  size = 'md',
}: ToggleSwitchProps) {
  const sizeStyles = {
    sm: {
      track: 'w-10 h-5',
      thumb: 'w-4 h-4',
      thumbTranslate: 'translate-x-5',
      padding: 'p-3',
      text: 'text-sm',
      emoji: 'text-lg',
    },
    md: {
      track: 'w-12 h-6',
      thumb: 'w-5 h-5',
      thumbTranslate: 'translate-x-6',
      padding: 'p-4',
      text: 'text-base',
      emoji: 'text-xl',
    },
  };

  const styles = sizeStyles[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center gap-3 w-full rounded-2xl transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FFB5A7]',
        styles.padding,
        checked
          ? 'bg-[#FFFCF7] shadow-md border-2'
          : 'bg-[#FFFCF7]/50 hover:bg-[#FFFCF7] border-2 border-transparent'
      )}
      style={{
        borderColor: checked ? color.active : 'transparent',
      }}
    >
      {/* Emoji */}
      <span className={cn(styles.emoji, 'flex-shrink-0')}>{emoji}</span>

      {/* Label and description */}
      <div className="flex-1 text-left">
        <span className={cn('font-semibold text-[#4A4A4A] block', styles.text)}>
          {label}
        </span>
        {description && (
          <span className="text-xs text-[#7A7A7A]">{description}</span>
        )}
      </div>

      {/* Toggle track */}
      <div
        className={cn(
          'relative rounded-full transition-colors duration-200 flex-shrink-0',
          styles.track
        )}
        style={{
          backgroundColor: checked ? color.active : color.track,
        }}
      >
        {/* Toggle thumb */}
        <div
          className={cn(
            'absolute top-0.5 left-0.5 bg-white rounded-full shadow-sm transition-transform duration-200',
            styles.thumb,
            checked && styles.thumbTranslate
          )}
        />
      </div>
    </button>
  );
}

// ============================================================================
// FILTER CONFIGURATION
// ============================================================================

interface FilterConfig {
  key: string;
  label: string;
  description: string;
  emoji: string;
  color: { active: string; track: string };
}

const parentFilterConfigs: FilterConfig[] = [
  {
    key: 'adFree',
    label: 'Kun reklamefri',
    description: 'Vis kun spil uden reklamer',
    emoji: '🚫',
    color: { active: '#77DD77', track: '#E5E5E5' },
  },
  {
    key: 'noInAppPurchases',
    label: 'Ingen in-app køb',
    description: 'Vis kun spil uden køb i appen',
    emoji: '💰',
    color: { active: '#77DD77', track: '#E5E5E5' },
  },
  {
    key: 'offlineOnly',
    label: 'Kun offline spil',
    description: 'Vis kun spil der virker uden internet',
    emoji: '📱',
    color: { active: '#A2D2FF', track: '#E5E5E5' },
  },
  {
    key: 'freeOnly',
    label: 'Kun gratis',
    description: 'Vis kun helt gratis spil',
    emoji: '🆓',
    color: { active: '#FFE66D', track: '#E5E5E5' },
  },
];

// ============================================================================
// PARENT FILTERS COMPONENT
// ============================================================================

export interface ParentFiltersState {
  adFree: boolean;
  noInAppPurchases: boolean;
  offlineOnly: boolean;
  freeOnly: boolean;
}

export interface ParentFiltersProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  filters: ParentFiltersState;
  onChange: (filters: ParentFiltersState) => void;
  size?: 'sm' | 'md';
  variant?: 'list' | 'grid' | 'compact';
  showLabel?: boolean;
  label?: string;
}

export const ParentFilters = forwardRef<HTMLDivElement, ParentFiltersProps>(
  (
    {
      filters,
      onChange,
      size = 'md',
      variant = 'list',
      showLabel = true,
      label = 'Forældrefiltre',
      className,
      ...props
    },
    ref
  ) => {
    const handleToggle = (key: keyof ParentFiltersState) => {
      onChange({
        ...filters,
        [key]: !filters[key],
      });
    };

    const activeCount = Object.values(filters).filter(Boolean).length;

    const handleClearAll = () => {
      onChange({
        adFree: false,
        noInAppPurchases: false,
        offlineOnly: false,
        freeOnly: false,
      });
    };

    if (variant === 'compact') {
      return (
        <div ref={ref} className={cn('space-y-3', className)} {...props}>
          {showLabel && (
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#4A4A4A] flex items-center gap-2">
                <span>👨‍👩‍👧‍👦</span>
                <span>{label}</span>
              </label>
              {activeCount > 0 && (
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
            {parentFilterConfigs.map((config) => {
              const isActive = filters[config.key as keyof ParentFiltersState];
              return (
                <button
                  key={config.key}
                  type="button"
                  onClick={() => handleToggle(config.key as keyof ParentFiltersState)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'shadow-md'
                      : 'bg-[#F5F5F5] text-[#7A7A7A] hover:bg-[#FFFCF7]'
                  )}
                  style={{
                    backgroundColor: isActive ? config.color.active : undefined,
                    color: isActive ? '#2D6A4F' : undefined,
                  }}
                >
                  <span>{config.emoji}</span>
                  <span>{config.label}</span>
                  {isActive && (
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

    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        {showLabel && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#4A4A4A] flex items-center gap-2">
              <span>👨‍👩‍👧‍👦</span>
              <span>{label}</span>
              {activeCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#77DD77] text-white text-xs">
                  {activeCount} aktiv
                </span>
              )}
            </label>
            {activeCount > 0 && (
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

        <div
          className={cn(
            variant === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-2'
          )}
        >
          {parentFilterConfigs.map((config) => (
            <ToggleSwitch
              key={config.key}
              checked={filters[config.key as keyof ParentFiltersState]}
              onChange={() => handleToggle(config.key as keyof ParentFiltersState)}
              label={config.label}
              description={variant === 'list' ? config.description : undefined}
              emoji={config.emoji}
              color={config.color}
              size={size}
            />
          ))}
        </div>
      </div>
    );
  }
);

ParentFilters.displayName = 'ParentFilters';

// ============================================================================
// QUICK PARENT FILTER (Single toggle)
// ============================================================================

interface QuickParentFilterProps {
  type: keyof ParentFiltersState;
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md';
}

export function QuickParentFilter({
  type,
  checked,
  onChange,
  size = 'md',
}: QuickParentFilterProps) {
  const config = parentFilterConfigs.find((c) => c.key === type);
  if (!config) return null;

  return (
    <ToggleSwitch
      checked={checked}
      onChange={onChange}
      label={config.label}
      description={config.description}
      emoji={config.emoji}
      color={config.color}
      size={size}
    />
  );
}

// ============================================================================
// SAFETY QUICK FILTERS (Preset combinations)
// ============================================================================

type SafetyPreset = 'safe' | 'free-safe' | 'offline-safe' | 'all';

interface SafetyQuickFiltersProps {
  selected: SafetyPreset;
  onChange: (preset: SafetyPreset) => void;
  onFiltersChange: (filters: ParentFiltersState) => void;
}

const safetyPresets: Record<SafetyPreset, { label: string; emoji: string; filters: ParentFiltersState }> = {
  all: {
    label: 'Alle spil',
    emoji: '🌟',
    filters: { adFree: false, noInAppPurchases: false, offlineOnly: false, freeOnly: false },
  },
  safe: {
    label: 'Børnesikker',
    emoji: '🛡️',
    filters: { adFree: true, noInAppPurchases: true, offlineOnly: false, freeOnly: false },
  },
  'free-safe': {
    label: 'Gratis & Sikker',
    emoji: '✨',
    filters: { adFree: true, noInAppPurchases: true, offlineOnly: false, freeOnly: true },
  },
  'offline-safe': {
    label: 'Offline & Sikker',
    emoji: '📱',
    filters: { adFree: true, noInAppPurchases: true, offlineOnly: true, freeOnly: false },
  },
};

export function SafetyQuickFilters({
  selected,
  onChange,
  onFiltersChange,
}: SafetyQuickFiltersProps) {
  const handleSelect = (preset: SafetyPreset) => {
    onChange(preset);
    onFiltersChange(safetyPresets[preset].filters);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {(Object.entries(safetyPresets) as [SafetyPreset, typeof safetyPresets[SafetyPreset]][]).map(
        ([key, preset]) => (
          <button
            key={key}
            type="button"
            onClick={() => handleSelect(key)}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold transition-all duration-200',
              selected === key
                ? 'bg-[#77DD77] text-white shadow-[0_4px_0_0_#5BC45B]'
                : 'bg-[#FFFCF7] text-[#4A4A4A] shadow-sm hover:shadow-md border-2 border-[#77DD77]/30'
            )}
          >
            <span className="text-lg">{preset.emoji}</span>
            <span>{preset.label}</span>
          </button>
        )
      )}
    </div>
  );
}

export default ParentFilters;
