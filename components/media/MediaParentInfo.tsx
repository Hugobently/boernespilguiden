'use client';

import { cn } from '@/lib/utils';

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
// MEDIA PARENT INFO EXPANDED
// ============================================================================

interface MediaParentInfoProps {
  // Type
  mediaType: 'MOVIE' | 'SERIES';

  // Tekst-baseret info
  parentInfo?: string | null;
  parentTip?: string | null;
  pros?: string[];
  cons?: string[];

  // Sprog
  hasDanishAudio?: boolean;
  hasDanishSubtitles?: boolean;

  // Indhold
  hasViolence?: boolean;
  hasScaryContent?: boolean;
  hasLanguage?: boolean;
  hasEducational?: boolean;

  // Alder
  minAge?: number | null;
  maxAge?: number | null;

  // Streaming
  isFree?: boolean;
  streamingProviders?: string[];
}

export function MediaParentInfo({
  mediaType,
  parentInfo,
  parentTip,
  pros = [],
  cons = [],
  hasDanishAudio,
  hasDanishSubtitles,
  hasViolence,
  hasScaryContent,
  hasLanguage,
  hasEducational,
  minAge,
  maxAge,
  isFree,
  streamingProviders = [],
}: MediaParentInfoProps) {
  const typeLabel = mediaType === 'MOVIE' ? 'filmen' : 'serien';

  // Feature badges baseret på medie egenskaber
  const badges: Array<{ icon: React.ReactNode; label: string; positive: boolean }> = [];

  // Positive badges
  if (hasDanishAudio) badges.push({ icon: <DanishFlag />, label: 'Dansk tale', positive: true });
  if (hasDanishSubtitles && !hasDanishAudio) badges.push({ icon: <DanishFlag />, label: 'Danske undertekster', positive: true });
  if (hasEducational) badges.push({ icon: '📚', label: 'Lærerigt', positive: true });
  if (isFree) badges.push({ icon: '🆓', label: 'Gratis at se', positive: true });
  if (!hasViolence && !hasScaryContent && !hasLanguage) badges.push({ icon: '✅', label: 'Børnevenligt', positive: true });

  // Warning badges
  if (hasViolence) badges.push({ icon: '⚔️', label: 'Indeholder vold', positive: false });
  if (hasScaryContent) badges.push({ icon: '😱', label: 'Skræmmende elementer', positive: false });
  if (hasLanguage) badges.push({ icon: '💬', label: 'Upassende sprog', positive: false });

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
            {minAge !== undefined && minAge !== null && maxAge !== undefined && maxAge !== null && (
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
          <p className="text-[#4A4A4A] leading-relaxed text-base whitespace-pre-line">
            {parentInfo}
          </p>
        </div>
      )}

      {/* Pros & Cons Grid */}
      {(pros.length > 0 || cons.length > 0) && (
        <div className="px-6 pb-5 grid sm:grid-cols-2 gap-4">
          {/* Pros */}
          {pros.length > 0 && (
            <div className="bg-white/50 rounded-2xl p-4">
              <h3 className="font-semibold text-[#2D6A4F] mb-3 flex items-center gap-2">
                <span>👍</span>
                <span>Det er godt ved {typeLabel}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#4A4A4A]">
                {pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#77DD77] flex-shrink-0 mt-0.5">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cons */}
          {cons.length > 0 && (
            <div className="bg-white/50 rounded-2xl p-4">
              <h3 className="font-semibold text-[#8B4563] mb-3 flex items-center gap-2">
                <span>⚠️</span>
                <span>Vær opmærksom på</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#4A4A4A]">
                {cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#E89488] flex-shrink-0 mt-0.5">✗</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Detaljerede kategorier */}
      <div className="px-6 pb-5 grid sm:grid-cols-2 gap-4">
        {/* Sprog og tilgængelighed */}
        <div className="bg-white/50 rounded-2xl p-4">
          <h3 className="font-semibold text-[#2D6A4F] mb-2 flex items-center gap-2">
            <span>🌍</span>
            <span>Sprog</span>
          </h3>
          <ul className="space-y-1.5 text-sm text-[#4A4A4A]">
            <li className="flex items-start gap-2">
              <span className={hasDanishAudio ? 'text-[#77DD77]' : 'text-[#FFA500]'}>
                {hasDanishAudio ? '✓' : '!'}
              </span>
              <span className="flex items-center gap-1">
                {hasDanishAudio ? (
                  <>
                    <DanishFlag /> Dansk tale
                  </>
                ) : (
                  'Kun udenlandsk tale'
                )}
              </span>
            </li>
            {hasDanishSubtitles && (
              <li className="flex items-start gap-2">
                <span className="text-[#77DD77]">✓</span>
                <span className="flex items-center gap-1">
                  <DanishFlag /> Danske undertekster
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Indhold */}
        <div className="bg-white/50 rounded-2xl p-4">
          <h3 className="font-semibold text-[#2D6A4F] mb-2 flex items-center gap-2">
            <span>📺</span>
            <span>Indhold</span>
          </h3>
          <ul className="space-y-1.5 text-sm text-[#4A4A4A]">
            {hasEducational && (
              <li className="flex items-start gap-2">
                <span className="text-[#77DD77]">✓</span>
                <span>Lærerigt indhold</span>
              </li>
            )}
            {hasViolence && (
              <li className="flex items-start gap-2">
                <span className="text-[#FF6B6B]">!</span>
                <span>Indeholder vold</span>
              </li>
            )}
            {hasScaryContent && (
              <li className="flex items-start gap-2">
                <span className="text-[#FF6B6B]">!</span>
                <span>Skræmmende elementer</span>
              </li>
            )}
            {hasLanguage && (
              <li className="flex items-start gap-2">
                <span className="text-[#FFA500]">!</span>
                <span>Upassende sprog</span>
              </li>
            )}
            {!hasViolence && !hasScaryContent && !hasLanguage && !hasEducational && (
              <li className="flex items-start gap-2">
                <span className="text-[#77DD77]">✓</span>
                <span>Børnevenligt indhold</span>
              </li>
            )}
          </ul>
        </div>

        {/* Streaming tilgængelighed */}
        {streamingProviders.length > 0 && (
          <div className="bg-white/50 rounded-2xl p-4 sm:col-span-2">
            <h3 className="font-semibold text-[#2D6A4F] mb-2 flex items-center gap-2">
              <span>📱</span>
              <span>Hvor kan I se {typeLabel}?</span>
            </h3>
            <ul className="space-y-1.5 text-sm text-[#4A4A4A]">
              {isFree && (
                <li className="flex items-start gap-2">
                  <span className="text-[#77DD77]">✓</span>
                  <span>Gratis at se</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-[#7A7A7A]">•</span>
                <span>
                  Tilgængelig på: {streamingProviders.join(', ')}
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Tip til forældre */}
      {parentTip && (
        <div className="px-6 pb-6">
          <div className="bg-[#FFF3B0]/50 rounded-2xl p-4 border border-[#FFE66D]/50">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">💡</span>
              <div>
                <h4 className="font-semibold text-[#7D6608] mb-1">Tip til forældre</h4>
                <p className="text-[#4A4A4A] text-sm leading-relaxed whitespace-pre-line">
                  {parentTip}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaParentInfo;
