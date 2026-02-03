'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ExpandableDescriptionProps {
  description: string;
  maxLength?: number;
}

export function ExpandableDescription({
  description,
  maxLength = 300
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if description needs expansion
  const needsExpansion = description.length > maxLength;
  const displayText = isExpanded || !needsExpansion
    ? description
    : description.substring(0, maxLength) + '...';

  return (
    <div className="space-y-3">
      <p className="text-[#4A4A4A] leading-relaxed whitespace-pre-line">
        {displayText}
      </p>

      {needsExpansion && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-xl',
            'bg-[#FFB5A7]/10 hover:bg-[#FFB5A7]/20',
            'text-[#F8A99B] font-semibold text-sm',
            'transition-colors duration-200'
          )}
        >
          <span>{isExpanded ? 'Vis mindre' : 'Læs mere'}</span>
          <svg
            className={cn(
              'w-4 h-4 transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ============================================================================
// ENHANCED PARENT INFO SECTION
// ============================================================================

interface ParentInfoSection {
  title: string;
  icon: string;
  content: string;
  bgColor: string;
  textColor: string;
}

interface EnhancedParentInfoProps {
  parentInfo?: string | null;
  parentTip?: string | null;
  minAge: number;
  maxAge: number;
}

export function EnhancedParentInfo({
  parentInfo,
  parentTip,
  minAge,
  maxAge
}: EnhancedParentInfoProps) {
  if (!parentInfo && !parentTip) return null;

  const sections: ParentInfoSection[] = [];

  // Main parent info
  if (parentInfo) {
    sections.push({
      title: 'Hvad forældre skal vide',
      icon: '👨‍👩‍👧',
      content: parentInfo,
      bgColor: 'bg-[#BAE1FF]/20',
      textColor: 'text-[#1D4E89]'
    });
  }

  // Age guidance
  const ageGuidance = getAgeGuidance(minAge, maxAge);
  if (ageGuidance) {
    sections.push({
      title: 'Aldersvejledning',
      icon: '📅',
      content: ageGuidance,
      bgColor: 'bg-[#FFE66D]/20',
      textColor: 'text-[#7D6608]'
    });
  }

  // Parent tip
  if (parentTip) {
    sections.push({
      title: 'Tip til forældre',
      icon: '💡',
      content: parentTip,
      bgColor: 'bg-[#BAFFC9]/20',
      textColor: 'text-[#2D6A4F]'
    });
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div
          key={index}
          className={cn(
            'rounded-3xl p-6 border-2',
            section.bgColor,
            'border-opacity-30'
          )}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{section.icon}</span>
            <h3 className={cn('font-bold text-lg', section.textColor)}>
              {section.title}
            </h3>
          </div>
          <ExpandableDescription description={section.content} maxLength={200} />
        </div>
      ))}
    </div>
  );
}

function getAgeGuidance(minAge: number, maxAge: number): string {
  if (minAge <= 3) {
    return 'Dette spil er designet til de mindste børn. Vær opmærksom på, at børn i denne alder har brug for supervision og hjælp til navigation. Korte sessioner anbefales for at undgå skærmtræthed.';
  } else if (minAge <= 6) {
    return 'Spillet er velegnet til børn i børnehavealderen. De kan ofte selv navigere i spillet, men det er stadig godt at være i nærheden. Husk at tage pauser og tal med dit barn om hvad de oplever i spillet.';
  } else {
    return 'Dette spil passer til skolebørn som typisk kan spille mere selvstændigt. Det er stadig vigtigt at følge med i hvad dit barn spiller og have dialog om spillets indhold. Overvej at sætte tidsbegrænsninger.';
  }
}
