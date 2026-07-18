'use client';

import { cn } from '@/lib/utils';
import { DataCollection, PriceModel } from '@/lib/types';
import { Icon, type IconName } from '@/components/ui/Icon';

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
  // Kun de vigtigste advarsler vises som badges - alle detaljer står i
  // kategorierne nedenfor, så positive badges ville blot gentage dem
  const warnings: Array<{ icon: IconName; label: string }> = [];
  if (hasAds === true) warnings.push({ icon: 'bell', label: 'Indeholder reklamer' });
  if (hasInAppPurchases === true) warnings.push({ icon: 'coins', label: 'Køb i appen' });
  if (hasChat === true) warnings.push({ icon: 'chat', label: 'Chat med fremmede' });
  if (hasManipulativeDesign === true) warnings.push({ icon: 'warning', label: 'Manipulativt design' });
  if (hasScaryContent === true) warnings.push({ icon: 'warning', label: 'Skræmmende elementer' });

  return (
    <div className="bg-gradient-to-br from-[#E8F4EA] to-[#D8F3DC] rounded-3xl overflow-hidden border border-[#95D5B2]/30">
      {/* Header */}
      <div className="bg-[#2D6A4F]/10 px-6 py-4 border-b border-[#95D5B2]/30">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Icon name="users" className="w-8 h-8 text-[#2D6A4F]" />
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
          {warnings.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {warnings.map((warning) => (
                <span
                  key={warning.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-[#FFD1DC] text-[#8B4563] border border-[#FFB6C1]"
                >
                  <Icon name={warning.icon} className="w-4 h-4" />
                  <span>{warning.label}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

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
            <Icon name="coins" className="w-5 h-5" />
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
            <Icon name="clock" className="w-5 h-5" />
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
            <Icon name="users" className="w-5 h-5" />
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
            <Icon name="lock" className="w-5 h-5" />
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
            <Icon name="world" className="w-5 h-5" />
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
              <Icon name="lightbulb" className="w-6 h-6 flex-shrink-0 text-[#9A6700]" />
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

// ============================================================================
// BOARD GAME PARENT INFO (Hvad forældre skal vide - for brætspil)
// ============================================================================

interface BoardGameParentInfoProps {
  minAge?: number;
  maxAge?: number;
  complexity: number;
  playTimeMinutes: number;
  minPlayers: number;
  maxPlayers: number;
  supportsDanish?: boolean;
  isCooperative: boolean;
  parentTip?: string | null;
}

export function BoardGameParentInfo({
  minAge,
  maxAge,
  complexity,
  playTimeMinutes,
  minPlayers,
  maxPlayers,
  supportsDanish,
  isCooperative,
  parentTip,
}: BoardGameParentInfoProps) {
  const complexityText =
    complexity <= 2
      ? 'Let at lære - børnene kan hurtigt spille selv'
      : complexity === 3
      ? 'Kræver lidt forklaring første gang - spil med de første par gange'
      : 'Kræver god forklaring og en voksen med i starten';

  const playTimeText =
    playTimeMinutes <= 15
      ? 'Kort spilletid - perfekt til små pauser eller før sengetid'
      : playTimeMinutes <= 30
      ? 'Mellemlang spilletid - passer godt til en hyggestund'
      : 'Længere spilletid - bedst når der er god tid, f.eks. i weekenden';

  return (
    <div className="bg-gradient-to-br from-[#E8F4EA] to-[#D8F3DC] rounded-3xl overflow-hidden border border-[#95D5B2]/30">
      {/* Header */}
      <div className="bg-[#2D6A4F]/10 px-6 py-4 border-b border-[#95D5B2]/30">
        <div className="flex items-center gap-3">
          <Icon name="users" className="w-8 h-8 text-[#2D6A4F]" />
          <div>
            <h2 className="font-bold text-xl text-[#2D6A4F]">
              Hvad forældre skal vide
            </h2>
            {minAge !== undefined && maxAge !== undefined && (
              <p className="text-sm text-[#2D6A4F]/70">
                Anbefalet alder: {maxAge >= 99 ? `${minAge}+` : `${minAge}-${maxAge}`} år
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Kategorier */}
      <div className="px-6 py-5 grid sm:grid-cols-2 gap-4">
        <div className="bg-white/50 rounded-2xl p-4">
          <h3 className="font-semibold text-[#2D6A4F] mb-2 flex items-center gap-2">
            <Icon name="blocks" className="w-5 h-5" />
            <span>Sværhedsgrad</span>
          </h3>
          <p className="text-sm text-[#4A4A4A]">{complexityText}</p>
        </div>

        <div className="bg-white/50 rounded-2xl p-4">
          <h3 className="font-semibold text-[#2D6A4F] mb-2 flex items-center gap-2">
            <Icon name={isCooperative ? 'users' : 'star'} className="w-5 h-5" />
            <span>{isCooperative ? 'Samarbejdsspil' : 'Konkurrencespil'}</span>
          </h3>
          <p className="text-sm text-[#4A4A4A]">
            {isCooperative
              ? 'I spiller sammen mod spillet - ingen tabere, godt til børn der har svært ved at tabe'
              : 'Der er vindere og tabere - god anledning til at øve at tabe med godt humør'}
          </p>
        </div>

        <div className="bg-white/50 rounded-2xl p-4">
          <h3 className="font-semibold text-[#2D6A4F] mb-2 flex items-center gap-2">
            <Icon name="clock" className="w-5 h-5" />
            <span>Spilletid</span>
          </h3>
          <p className="text-sm text-[#4A4A4A]">
            {playTimeText} (ca. {playTimeMinutes} min,{' '}
            {minPlayers === maxPlayers ? minPlayers : `${minPlayers}-${maxPlayers}`} spillere)
          </p>
        </div>

        <div className="bg-white/50 rounded-2xl p-4">
          <h3 className="font-semibold text-[#2D6A4F] mb-2 flex items-center gap-2">
            <Icon name="world" className="w-5 h-5" />
            <span>Sprog</span>
          </h3>
          <p className="text-sm text-[#4A4A4A] flex items-center gap-1.5 flex-wrap">
            {supportsDanish ? (
              <>
                <DanishFlag /> Fås med dansk vejledning eller er sprogneutralt
              </>
            ) : (
              'Kun udenlandsk vejledning - en voksen skal oversætte reglerne'
            )}
          </p>
        </div>
      </div>

      {/* Tip til forældre */}
      {parentTip && (
        <div className="px-6 pb-6">
          <div className="bg-[#FFF3B0]/50 rounded-2xl p-4 border border-[#FFE66D]/50">
            <div className="flex items-start gap-3">
              <Icon name="lightbulb" className="w-6 h-6 flex-shrink-0 text-[#9A6700]" />
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
