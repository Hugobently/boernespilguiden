// Cohesive SVG icon set - one stroke weight, round caps, currentColor.
// Replaces emoji as UI elements (emoji render differently per platform).

import { cn } from '@/lib/utils';

export type IconName =
  | 'search'
  | 'check'
  | 'gamepad'
  | 'dice'
  | 'tv'
  | 'smile'
  | 'blocks'
  | 'kite'
  | 'rocket'
  | 'shield'
  | 'sparkle'
  | 'arrow-right'
  | 'star'
  | 'book'
  | 'info';

interface IconProps {
  name: IconName;
  className?: string;
  /** Accessible label. Omit for purely decorative icons (default aria-hidden). */
  label?: string;
}

const STROKE_ICONS: Record<IconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" />
    </>
  ),
  check: <path d="M4 12.5l5 5L20 6.5" />,
  gamepad: (
    <>
      <rect x="2" y="7" width="20" height="12" rx="6" />
      <path d="M8 11v4M6 13h4" />
      <circle cx="15.5" cy="12" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="14" r="0.5" fill="currentColor" stroke="none" />
    </>
  ),
  dice: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="15" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  tv: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="3" />
      <path d="M8 3l4 4 4-4" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 10h.01M15 10h.01M8.5 14a4 4 0 0 0 7 0" />
    </>
  ),
  blocks: (
    <>
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
      <rect x="8.5" y="4" width="7" height="7" rx="1.5" />
    </>
  ),
  kite: (
    <>
      <path d="M12 2l7 6-7 8-7-8 7-6z" />
      <path d="M12 16c-1 3-4 4-6 6" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 2c3.5 1.5 5.5 5 5.5 9l-2.5 5h-6L6.5 11c0-4 2-7.5 5.5-9z" />
      <circle cx="12" cy="9.5" r="2" />
      <path d="M9 16l-1.5 5L12 19l4.5 2L15 16" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2l8 3.5v5c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11v-5L12 2z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  sparkle: (
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM18.5 15.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z" />
  ),
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  star: (
    <path d="M12 3l2.7 5.6 6.3.9-4.5 4.3 1 6.2-5.5-3-5.5 3 1-6.2L3 9.5l6.3-.9L12 3z" />
  ),
  book: (
    <>
      <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2V4z" />
      <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7V4z" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M12 12v4" />
    </>
  ),
};

export function Icon({ name, className, label }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('w-5 h-5', className)}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {STROKE_ICONS[name]}
    </svg>
  );
}
