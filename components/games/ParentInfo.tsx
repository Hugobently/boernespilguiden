'use client';

import { cn } from '@/lib/utils';
import { DataCollection, PriceModel } from '@/lib/types';
import { forwardRef, HTMLAttributes } from 'react';

// ============================================================================
// STATUS INDICATOR CONFIGURATIONS
// ============================================================================

interface StatusConfig {
  label: string;
  yesLabel: string;
  noLabel: string;
  yesColor: { bg: string; text: string; border: string };
  noColor: { bg: string; text: string; border: string };
  yesIcon: string;
  noIcon: string;
  description?: { yes: string; no: string };
}

const statusConfigs: Record<string, StatusConfig> = {
  hasAds: {
    label: 'Reklamer',
    yesLabel: 'Ja',
    noLabel: 'Nej',
    yesColor: { bg: '#FFD1DC', text: '#8B4563', border: '#FFB6C1' },
    noColor: { bg: '#D8F3DC', text: '#2D6A4F', border: '#95D5B2' },
    yesIcon: '📢',
    noIcon: '🚫',
    description: {
      yes: 'Spillet indeholder reklamer',
      no: 'Ingen reklamer i spillet',
    },
  },
  hasInAppPurchases: {
    label: 'In-app køb',
    yesLabel: 'Ja',
    noLabel: 'Nej',
    yesColor: { bg: '#FFD1DC', text: '#8B4563', border: '#FFB6C1' },
    noColor: { bg: '#D8F3DC', text: '#2D6A4F', border: '#95D5B2' },
    yesIcon: '💳',
    noIcon: '🆓',
    description: {
      yes: 'Mulighed for køb i appen',
      no: 'Ingen køb i appen',
    },
  },
  offlinePlay: {
    label: 'Offline',
    yesLabel: 'Ja',
    noLabel: 'Nej',
    yesColor: { bg: '#D8F3DC', text: '#2D6A4F', border: '#95D5B2' },
    noColor: { bg: '#FFF3B0', text: '#7D6608', border: '#FFE66D' },
    yesIcon: '📱',
    noIcon: '🌐',
    description: {
      yes: 'Kan spilles uden internet',
      no: 'Kræver internetforbindelse',
    },
  },
  requiresAccount: {
    label: 'Konto påkrævet',
    yesLabel: 'Ja',
    noLabel: 'Nej',
    yesColor: { bg: '#FFF3B0', text: '#7D6608', border: '#FFE66D' },
    noColor: { bg: '#D8F3DC', text: '#2D6A4F', border: '#95D5B2' },
    yesIcon: '👤',
    noIcon: '✨',
    description: {
      yes: 'Kræver oprettelse af konto',
      no: 'Ingen konto nødvendig',
    },
  },
  socialFeatures: {
    label: 'Sociale funktioner',
    yesLabel: 'Ja',
    noLabel: 'Nej',
    yesColor: { bg: '#BAE1FF', text: '#1D4E89', border: '#8ECAE6' },
    noColor: { bg: '#F5F5F5', text: '#7A7A7A', border: '#E5E5E5' },
    yesIcon: '👥',
    noIcon: '👤',
    description: {
      yes: 'Kan interagere med andre spillere',
      no: 'Ingen sociale funktioner',
    },
  },
};

// ============================================================================
// DATA COLLECTION CONFIG
// ============================================================================

interface DataCollectionConfig {
  label: string;
  color: { bg: string; text: string; border: string };
  icon: string;
  description: string;
}

const dataCollectionConfigs: Record<DataCollection, DataCollectionConfig> = {
  ingen: {
    label: 'Ingen',
    color: { bg: '#D8F3DC', text: '#2D6A4F', border: '#95D5B2' },
    icon: '🛡️',
    description: 'Indsamler ingen persondata',
  },
  minimal: {
    label: 'Minimal',
    color: { bg: '#BAE1FF', text: '#1D4E89', border: '#8ECAE6' },
    icon: '📊',
    description: 'Indsamler kun nødvendig data',
  },
  moderat: {
    label: 'Moderat',
    color: { bg: '#FFF3B0', text: '#7D6608', border: '#FFE66D' },
    icon: '⚠️',
    description: 'Indsamler noget persondata',
  },
  omfattende: {
    label: 'Omfattende',
    color: { bg: '#FFD1DC', text: '#8B4563', border: '#FFB6C1' },
    icon: '🔴',
    description: 'Indsamler betydelig persondata',
  },
};

// ============================================================================
// PRICE MODEL CONFIG
// ============================================================================

interface PriceModelConfig {
  label: string;
  color: { bg: string; text: string };
  icon: string;
  description: string;
}

const priceModelConfigs: Record<PriceModel, PriceModelConfig> = {
  gratis: {
    label: 'Gratis',
    color: { bg: '#D8F3DC', text: '#2D6A4F' },
    icon: '🆓',
    description: 'Helt gratis at spille',
  },
  engangskøb: {
    label: 'Engangskøb',
    color: { bg: '#BAE1FF', text: '#1D4E89' },
    icon: '💰',
    description: 'Køb én gang, spil for evigt',
  },
  abonnement: {
    label: 'Abonnement',
    color: { bg: '#E2C2FF', text: '#5B4670' },
    icon: '📅',
    description: 'Månedlig eller årlig betaling',
  },
  freemium: {
    label: 'Freemium',
    color: { bg: '#FFF3B0', text: '#7D6608' },
    icon: '⭐',
    description: 'Gratis med betalte ekstra funktioner',
  },
};

// ============================================================================
// STATUS ITEM COMPONENT
// ============================================================================

interface StatusItemProps {
  type: keyof typeof statusConfigs;
  value: boolean;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function StatusItem({ type, value, showDescription = false, size = 'md' }: StatusItemProps) {
  const config = statusConfigs[type];
  const colors = value ? config.yesColor : config.noColor;
  const icon = value ? config.yesIcon : config.noIcon;
  const statusLabel = value ? config.yesLabel : config.noLabel;
  const description = config.description ? (value ? config.description.yes : config.description.no) : null;

  const sizeClasses = {
    sm: 'p-2 text-xs',
    md: 'p-3 text-sm',
    lg: 'p-4 text-base',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border-2 transition-all hover:scale-[1.02]',
        sizeClasses[size]
      )}
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold" style={{ color: colors.text }}>
          {config.label}
        </span>
        <div className="flex items-center gap-1.5">
          <span>{icon}</span>
          <span
            className="font-bold px-2 py-0.5 rounded-full bg-white/50"
            style={{ color: colors.text }}
          >
            {statusLabel}
          </span>
        </div>
      </div>
      {showDescription && description && (
        <p className="mt-1.5 text-xs opacity-80" style={{ color: colors.text }}>
          {description}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// DATA COLLECTION INDICATOR
// ============================================================================

interface DataCollectionIndicatorProps {
  level: DataCollection;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function DataCollectionIndicator({
  level,
  showDescription = false,
  size = 'md',
}: DataCollectionIndicatorProps) {
  const config = dataCollectionConfigs[level];

  const sizeClasses = {
    sm: 'p-2 text-xs',
    md: 'p-3 text-sm',
    lg: 'p-4 text-base',
  };

  // Visual indicator bars
  const levelIndex = ['ingen', 'minimal', 'moderat', 'omfattende'].indexOf(level);

  return (
    <div
      className={cn(
        'rounded-2xl border-2 transition-all hover:scale-[1.02]',
        sizeClasses[size]
      )}
      style={{
        backgroundColor: config.color.bg,
        borderColor: config.color.border,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold" style={{ color: config.color.text }}>
          Datahøstning
        </span>
        <div className="flex items-center gap-1.5">
          <span>{config.icon}</span>
          <span
            className="font-bold px-2 py-0.5 rounded-full bg-white/50"
            style={{ color: config.color.text }}
          >
            {config.label}
          </span>
        </div>
      </div>

      {/* Visual level indicator */}
      <div className="flex gap-1 mt-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all',
              i <= levelIndex ? 'opacity-100' : 'opacity-20'
            )}
            style={{
              backgroundColor: i <= levelIndex ? config.color.text : config.color.border,
            }}
          />
        ))}
      </div>

      {showDescription && (
        <p className="mt-2 text-xs opacity-80" style={{ color: config.color.text }}>
          {config.description}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// PRICE MODEL INDICATOR
// ============================================================================

interface PriceIndicatorProps {
  model: PriceModel;
  price?: number | null;
  showDescription?: boolean;
}

function PriceIndicator({ model, price, showDescription = false }: PriceIndicatorProps) {
  const config = priceModelConfigs[model];

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
    }).format(p);
  };

  return (
    <div
      className="rounded-2xl p-3 border-2 border-transparent transition-all hover:scale-[1.02]"
      style={{ backgroundColor: config.color.bg }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold" style={{ color: config.color.text }}>
          Prismodel
        </span>
        <div className="flex items-center gap-1.5">
          <span>{config.icon}</span>
          <span
            className="font-bold px-2 py-0.5 rounded-full bg-white/50"
            style={{ color: config.color.text }}
          >
            {config.label}
          </span>
        </div>
      </div>

      {price && price > 0 && (
        <div className="mt-2 text-lg font-bold" style={{ color: config.color.text }}>
          {formatPrice(price)}
        </div>
      )}

      {showDescription && (
        <p className="mt-1.5 text-xs opacity-80" style={{ color: config.color.text }}>
          {config.description}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// PARENT INFO PANEL (Main Component)
// ============================================================================

export interface ParentInfoProps extends HTMLAttributes<HTMLDivElement> {
  hasAds?: boolean;
  hasInAppPurchases?: boolean;
  offlinePlay?: boolean;
  priceModel?: PriceModel;
  price?: number | null;
  dataCollection?: DataCollection;
  requiresAccount?: boolean;
  socialFeatures?: boolean;
  showDescriptions?: boolean;
  variant?: 'compact' | 'detailed' | 'card';
}

export const ParentInfo = forwardRef<HTMLDivElement, ParentInfoProps>(
  (
    {
      hasAds,
      hasInAppPurchases,
      offlinePlay,
      priceModel,
      price,
      dataCollection,
      requiresAccount,
      socialFeatures,
      showDescriptions = true,
      variant = 'detailed',
      className,
      ...props
    },
    ref
  ) => {
    // Calculate overall safety score (for visual indicator)
    const safetyFactors = [
      hasAds === false,
      hasInAppPurchases === false,
      offlinePlay === true,
      dataCollection === 'ingen' || dataCollection === 'minimal',
      requiresAccount === false,
    ].filter((f) => f !== undefined);

    const safetyScore = safetyFactors.filter(Boolean).length;
    const maxScore = safetyFactors.length;

    const getSafetyColor = () => {
      const ratio = safetyScore / maxScore;
      if (ratio >= 0.8) return { bg: '#D8F3DC', text: '#2D6A4F', label: 'Meget sikkert' };
      if (ratio >= 0.6) return { bg: '#BAE1FF', text: '#1D4E89', label: 'Sikkert' };
      if (ratio >= 0.4) return { bg: '#FFF3B0', text: '#7D6608', label: 'Moderat' };
      return { bg: '#FFD1DC', text: '#8B4563', label: 'Vær opmærksom' };
    };

    const safetyInfo = getSafetyColor();

    if (variant === 'compact') {
      return (
        <div
          ref={ref}
          className={cn(
            'flex flex-wrap gap-2',
            className
          )}
          {...props}
        >
          {hasAds !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
                hasAds ? 'bg-[#FFD1DC] text-[#8B4563]' : 'bg-[#D8F3DC] text-[#2D6A4F]'
              )}
            >
              {hasAds ? '📢 Reklamer' : '🚫 Reklamefri'}
            </span>
          )}
          {hasInAppPurchases !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
                hasInAppPurchases ? 'bg-[#FFD1DC] text-[#8B4563]' : 'bg-[#D8F3DC] text-[#2D6A4F]'
              )}
            >
              {hasInAppPurchases ? '💳 In-app køb' : '🆓 Ingen køb'}
            </span>
          )}
          {offlinePlay !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
                offlinePlay ? 'bg-[#D8F3DC] text-[#2D6A4F]' : 'bg-[#FFF3B0] text-[#7D6608]'
              )}
            >
              {offlinePlay ? '📱 Offline' : '🌐 Online'}
            </span>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl overflow-hidden',
          variant === 'card' ? 'bg-[#FFFCF7] shadow-md border border-[#FFB5A7]/20' : '',
          className
        )}
        {...props}
      >
        {/* Header with safety indicator */}
        <div
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: safetyInfo.bg }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">👨‍👩‍👧‍👦</span>
            <div>
              <h3 className="font-bold text-lg" style={{ color: safetyInfo.text }}>
                Information til forældre
              </h3>
              <p className="text-sm opacity-80" style={{ color: safetyInfo.text }}>
                {safetyInfo.label} • {safetyScore}/{maxScore} sikkerhedspunkter
              </p>
            </div>
          </div>

          {/* Safety meter */}
          <div className="hidden sm:flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-3 h-8 rounded-full transition-all',
                  i < Math.ceil((safetyScore / maxScore) * 5) ? 'opacity-100' : 'opacity-20'
                )}
                style={{
                  backgroundColor: i < Math.ceil((safetyScore / maxScore) * 5)
                    ? safetyInfo.text
                    : safetyInfo.text,
                }}
              />
            ))}
          </div>
        </div>

        {/* Content grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Ads */}
            {hasAds !== undefined && (
              <StatusItem
                type="hasAds"
                value={hasAds}
                showDescription={showDescriptions}
              />
            )}

            {/* In-app purchases */}
            {hasInAppPurchases !== undefined && (
              <StatusItem
                type="hasInAppPurchases"
                value={hasInAppPurchases}
                showDescription={showDescriptions}
              />
            )}

            {/* Offline play */}
            {offlinePlay !== undefined && (
              <StatusItem
                type="offlinePlay"
                value={offlinePlay}
                showDescription={showDescriptions}
              />
            )}

            {/* Requires account */}
            {requiresAccount !== undefined && (
              <StatusItem
                type="requiresAccount"
                value={requiresAccount}
                showDescription={showDescriptions}
              />
            )}

            {/* Price model */}
            {priceModel && (
              <PriceIndicator
                model={priceModel}
                price={price}
                showDescription={showDescriptions}
              />
            )}

            {/* Data collection */}
            {dataCollection && (
              <DataCollectionIndicator
                level={dataCollection}
                showDescription={showDescriptions}
              />
            )}

            {/* Social features */}
            {socialFeatures !== undefined && (
              <StatusItem
                type="socialFeatures"
                value={socialFeatures}
                showDescription={showDescriptions}
              />
            )}
          </div>
        </div>

        {/* Footer tip */}
        <div className="px-4 pb-4">
          <div className="bg-[#FFF3B0]/30 rounded-2xl p-3 flex items-start gap-2">
            <span className="text-lg flex-shrink-0">💡</span>
            <p className="text-sm text-[#7D6608]">
              Vi anbefaler altid at prøve spillet sammen med dit barn første gang,
              så I kan tale om indholdet og eventuelle køb sammen.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

ParentInfo.displayName = 'ParentInfo';

// ============================================================================
// SAFETY BADGE (For quick visual indicator)
// ============================================================================

interface SafetyBadgeProps {
  hasAds?: boolean;
  hasInAppPurchases?: boolean;
  dataCollection?: DataCollection;
  size?: 'sm' | 'md';
}

export function SafetyBadge({
  hasAds,
  hasInAppPurchases,
  dataCollection,
  size = 'md',
}: SafetyBadgeProps) {
  // Quick safety assessment
  const isVerySafe = hasAds === false && hasInAppPurchases === false &&
    (dataCollection === 'ingen' || dataCollection === 'minimal');
  const isSafe = hasAds === false || hasInAppPurchases === false;

  let color = { bg: '#FFF3B0', text: '#7D6608' };
  let label = 'Tjek detaljer';
  let icon = '⚠️';

  if (isVerySafe) {
    color = { bg: '#D8F3DC', text: '#2D6A4F' };
    label = 'Børnesikker';
    icon = '✅';
  } else if (isSafe) {
    color = { bg: '#BAE1FF', text: '#1D4E89' };
    label = 'Sikkert valg';
    icon = '👍';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-semibold',
        sizeClasses[size]
      )}
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}

export default ParentInfo;
