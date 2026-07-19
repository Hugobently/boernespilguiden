'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('gameDetail');

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
            'text-[#C2410C] font-semibold text-sm',
            'transition-colors duration-200'
          )}
        >
          <span>{isExpanded ? t('showLess') : t('readMore')}</span>
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
