'use client';

import { cn } from '@/lib/utils';
import { DataCollection, PriceModel } from '@/lib/types';
import { forwardRef, HTMLAttributes } from 'react';

// ============================================================================
// DANISH FLAG SVG COMPONENT
// ============================================================================

function DanishFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 12"
      className={cn('inline-block', className)}
      style={{ width: '1.2em', height: '0.9em', verticalAlign: 'middle' }}
      aria-label="Dansk flag"
    >
      <rect width="16" height="12" fill="#C8102E" />
      <rect x="5" y="0" width="2" height="12" fill="#FFFFFF" />
      <rect x="0" y="5" width="16" height="2" fill="#FFFFFF" />
    </svg>
  );
}

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

// ============================================================================
// PARENT INFO EXPANDED (Hvad forældre skal vide - fra indholdsstrategi)
// ============================================================================

interface ParentInfoExpandedProps {
  // Tekst-baseret info
  parentInfo?: string | null; // Den dybdegående "Hvad forældre skal vide" tekst
  parentTip?: string | null;

  // Reklamer og køb
  hasAds?: boolean;
  hasInAppPurchases?: boolean;
  price?: number | null;
  priceModel?: PriceModel;

  // Skærmtid og engagement
  hasManipulativeDesign?: boolean; // FOMO, streaks, etc.
  hasNotifications?: boolean;
  typicalSessionMinutes?: number | null;

  // Social interaktion
  hasSocialFeatures?: boolean;
  hasChat?: boolean;

  // Indhold
  hasScaryContent?: boolean;

  // Privatliv
  dataCollection?: DataCollection;
  isCoppaCompliant?: boolean;

  // Tilgængelighed
  requiresReading?: boolean;
  isOfflineCapable?: boolean;

  // Sprog
  supportsDanish?: boolean;

  // Klassisk info
  minAge?: number;
  maxAge?: number;
}

export function ParentInfoExpanded({
  parentInfo,
  parentTip,
  hasAds,
  hasInAppPurchases,
  price,
  priceModel,
  hasManipulativeDesign,
  hasNotifications,
  typicalSessionMinutes,
  hasSocialFeatures,
  hasChat,
  hasScaryContent,
  dataCollection,
  isCoppaCompliant,
  requiresReading,
  isOfflineCapable,
  supportsDanish,
  minAge,
  maxAge,
}: ParentInfoExpandedProps) {

  // Feature badges baseret på spil egenskaber
  const badges: Array<{ icon: React.ReactNode; label: string; positive: boolean }> = [];

  if (hasAds === false) badges.push({ icon: '🚫', label: 'Ingen reklamer', positive: true });
  if (hasInAppPurchases === false) badges.push({ icon: '✅', label: 'Ingen køb i app', positive: true });
  if (isOfflineCapable === true) badges.push({ icon: '📵', label: 'Offline-tilstand', positive: true });
  if (hasSocialFeatures === false && hasChat === false) badges.push({ icon: '👤', label: 'Ingen fremmede', positive: true });
  if (hasManipulativeDesign === false) badges.push({ icon: '🧘', label: 'Ingen FOMO', positive: true });
  if (hasNotifications === false) badges.push({ icon: '🔕', label: 'Ingen notifikationer', positive: true });
  if (dataCollection === 'ingen') badges.push({ icon: '🛡️', label: 'Ingen datahøstning', positive: true });
  if (isCoppaCompliant === true) badges.push({ icon: '👶', label: 'COPPA-godkendt', positive: true });
  if (requiresReading === false) badges.push({ icon: '🎨', label: 'Ingen læsning krævet', positive: true });
  if (supportsDanish === true) badges.push({ icon: <DanishFlag />, label: 'Dansk understøttet', positive: true });

  // Advarsels-badges
  if (hasAds === true) badges.push({ icon: '📢', label: 'Indeholder reklamer', positive: false });
  if (hasInAppPurchases === true) badges.push({ icon: '💳', label: 'In-app køb', positive: false });
  if (hasChat === true) badges.push({ icon: '💬', label: 'Chat med fremmede', positive: false });
  if (hasManipulativeDesign === true) badges.push({ icon: '⚠️', label: 'Manipulativt design', positive: false });
  if (hasScaryContent === true) badges.push({ icon: '😱', label: 'Skræmmende elementer', positive: false });

  return (
    <div className="bg-gradient-to-br from-[#E8F4EA] to-[#D8F3DC] rounded-3xl overflow-hidden border border-[#95D5B2]/30">
      {/* Header */}
      <div className="bg-[#2D6A4F]/10 px-6 py-4 border-b border-[#95D5B2]/30">
        <div className="flex items-center gap-3">
          <span className="text-3xl">👨‍👩‍👧‍👦</span>
          <div>
            <h2 className="font-bold text-xl text-[#2D6A4F]">
              Hvad forældre skal vide
            </h2>
            {minAge !== undefined && maxAge !== undefined && (
              <p className="text-sm text-[#2D6A4F]/70">
                Anbefalet alder: {minAge}-{maxAge} år
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="px-6 py-4 border-b border-[#95D5B2]/30">
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold',
                  badge.positive
                    ? 'bg-[#D8F3DC] text-[#2D6A4F] border border-[#95D5B2]'
                    : 'bg-[#FFD1DC] text-[#8B4563] border border-[#FFB6C1]'
                )}
              >
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hovedtekst - Hvad forældre skal vide */}
      {parentInfo && (
        <div className="px-6 py-5">
          <p className="text-[#4A4A4A] leading-relaxed text-base">
            {parentInfo}
          </p>
        </div>
      )}

      {/* Detaljerede kategorier */}
      <div className="px-6 pb-5 grid sm:grid-cols-2 gap-4">
        {/* Reklamer og køb */}
        <div className="bg-white/50 rounded-2xl p-4">
          <h3 className="font-semibold text-[#2D6A4F] mb-2 flex items-center gap-2">
            <span>💰</span>
            <span>Reklamer og køb</span>
          </h3>
          <ul className="space-y-1.5 text-sm text-[#4A4A4A]">
            <li className="flex items-start gap-2">
              <span className={hasAds ? 'text-[#FF6B6B]' : 'text-[#77DD77]'}>
                {hasAds ? '✗' : '✓'}
              </span>
              <span>{hasAds ? 'Indeholder reklamer' : 'Ingen reklamer'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={hasInAppPurchases ? 'text-[#FF6B6B]' : 'text-[#77DD77]'}>
                {hasInAppPurchases ? '✗' : '✓'}
              </span>
              <span>
                {hasInAppPurchases
                  ? `Køb i appen${price && price > 0 ? ` (op til ${price} kr)` : ''}`
                  : 'Ingen køb i appen'}
              </span>
            </li>
            {priceModel && (
              <li className="flex items-start gap-2">
                <span className="text-[#7A7A7A]">•</span>
                <span>
                  {priceModel === 'gratis' && 'Helt gratis'}
                  {priceModel === 'engangskøb' && `Engangskøb${price ? ` (${price} kr)` : ''}`}
                  {priceModel === 'abonnement' && 'Abonnement'}
                  {priceModel === 'freemium' && 'Gratis med betalte funktioner'}
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Skærmtid og engagement */}
        <div className="bg-white/50 rounded-2xl p-4">
          <h3 className="font-semibold text-[#2D6A4F] mb-2 flex items-center gap-2">
            <span>⏱️</span>
            <span>Skærmtid</span>
          </h3>
          <ul className="space-y-1.5 text-sm text-[#4A4A4A]">
            {typicalSessionMinutes && (
              <li className="flex items-start gap-2">
                <span className="text-[#7A7A7A]">•</span>
                <span>Typisk session: {typicalSessionMinutes} min</span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <span className={hasManipulativeDesign ? 'text-[#FF6B6B]' : 'text-[#77DD77]'}>
                {hasManipulativeDesign ? '✗' : '✓'}
              </span>
              <span>
                {hasManipulativeDesign
                  ? 'Bruger FOMO/streaks'
                  : 'Ingen manipulativt design'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className={hasNotifications ? 'text-[#FFA500]' : 'text-[#77DD77]'}>
                {hasNotifications ? '!' : '✓'}
              </span>
              <span>
                {hasNotifications
                  ? 'Sender notifikationer'
                  : 'Ingen notifikationer'}
              </span>
            </li>
          </ul>
        </div>

        {/* Social interaktion */}
        <div className="bg-white/50 rounded-2xl p-4">
          <h3 className="font-semibold text-[#2D6A4F] mb-2 flex items-center gap-2">
            <span>👥</span>
            <span>Social interaktion</span>
          </h3>
          <ul className="space-y-1.5 text-sm text-[#4A4A4A]">
            <li className="flex items-start gap-2">
              <span className={hasSocialFeatures ? 'text-[#FFA500]' : 'text-[#77DD77]'}>
                {hasSocialFeatures ? '!' : '✓'}
              </span>
              <span>
                {hasSocialFeatures
                  ? 'Sociale funktioner aktiveret'
                  : 'Ingen sociale funktioner'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className={hasChat ? 'text-[#FF6B6B]' : 'text-[#77DD77]'}>
                {hasChat ? '✗' : '✓'}
              </span>
              <span>
                {hasChat
                  ? 'Chat med fremmede mulig'
                  : 'Ingen chat med fremmede'}
              </span>
            </li>
          </ul>
        </div>

        {/* Privatliv */}
        <div className="bg-white/50 rounded-2xl p-4">
          <h3 className="font-semibold text-[#2D6A4F] mb-2 flex items-center gap-2">
            <span>🔒</span>
            <span>Privatliv</span>
          </h3>
          <ul className="space-y-1.5 text-sm text-[#4A4A4A]">
            {dataCollection && (
              <li className="flex items-start gap-2">
                <span className={
                  dataCollection === 'ingen' ? 'text-[#77DD77]' :
                  dataCollection === 'minimal' ? 'text-[#77DD77]' :
                  dataCollection === 'moderat' ? 'text-[#FFA500]' :
                  'text-[#FF6B6B]'
                }>
                  {dataCollection === 'ingen' || dataCollection === 'minimal' ? '✓' : '!'}
                </span>
                <span>
                  Datahøstning: {dataCollection}
                </span>
              </li>
            )}
            {isCoppaCompliant !== undefined && (
              <li className="flex items-start gap-2">
                <span className={isCoppaCompliant ? 'text-[#77DD77]' : 'text-[#FF6B6B]'}>
                  {isCoppaCompliant ? '✓' : '✗'}
                </span>
                <span>
                  {isCoppaCompliant
                    ? 'COPPA-compliant (børnevenlig)'
                    : 'Ikke COPPA-compliant'}
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Sprog og tilgængelighed */}
        <div className="bg-white/50 rounded-2xl p-4">
          <h3 className="font-semibold text-[#2D6A4F] mb-2 flex items-center gap-2">
            <span>🌍</span>
            <span>Sprog og tilgængelighed</span>
          </h3>
          <ul className="space-y-1.5 text-sm text-[#4A4A4A]">
            <li className="flex items-start gap-2">
              <span className={supportsDanish ? 'text-[#77DD77]' : 'text-[#FFA500]'}>
                {supportsDanish ? '✓' : '!'}
              </span>
              <span className="flex items-center gap-1">
                {supportsDanish
                  ? <><DanishFlag /> Dansk understøttet</>
                  : 'Kun udenlandsk sprog'}
              </span>
            </li>
            {requiresReading !== undefined && (
              <li className="flex items-start gap-2">
                <span className={requiresReading ? 'text-[#FFA500]' : 'text-[#77DD77]'}>
                  {requiresReading ? '!' : '✓'}
                </span>
                <span>
                  {requiresReading
                    ? 'Kræver læsefærdigheder'
                    : 'Kan bruges uden læsning'}
                </span>
              </li>
            )}
            {isOfflineCapable !== undefined && (
              <li className="flex items-start gap-2">
                <span className={isOfflineCapable ? 'text-[#77DD77]' : 'text-[#FFA500]'}>
                  {isOfflineCapable ? '✓' : '!'}
                </span>
                <span>
                  {isOfflineCapable
                    ? 'Kan bruges offline'
                    : 'Kræver internetforbindelse'}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Tip til forældre */}
      {parentTip && (
        <div className="px-6 pb-6">
          <div className="bg-[#FFF3B0]/50 rounded-2xl p-4 border border-[#FFE66D]/50">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">💡</span>
              <div>
                <h4 className="font-semibold text-[#7D6608] mb-1">Tip til forældre</h4>
                <p className="text-[#4A4A4A] text-sm leading-relaxed">{parentTip}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParentInfo;
