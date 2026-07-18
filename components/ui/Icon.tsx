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
  | 'info'
  | 'tag'
  | 'warning'
  | 'coins'
  | 'clock'
  | 'users'
  | 'lock'
  | 'chat'
  | 'bell'
  | 'camera'
  | 'x'
  | 'heart'
  | 'lightbulb'
  | 'mail'
  | 'cookie'
  | 'world'
  | 'film'
  | 'home'
  | 'download'
  | 'filter';

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
  tag: (
    <>
      <path d="M3 3h8l10 10-8 8L3 11V3z" />
      <circle cx="8" cy="8" r="1.5" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3.5L22 20H2L12 3.5z" />
      <path d="M12 10v4.5M12 17.2h.01" />
    </>
  ),
  coins: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.8 9.3c-.5-.9-1.5-1.4-2.8-1.4-1.8 0-3 .9-3 2.1s1.2 1.8 3 2.1 3 .9 3 2.1-1.2 2.1-3 2.1c-1.3 0-2.3-.5-2.8-1.4M12 5.8v2.1M12 16.1v2.1" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5" />
      <circle cx="17.5" cy="9" r="2.8" />
      <path d="M18 14.6c2.3.5 3.8 2.3 3.8 5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2" />
    </>
  ),
  chat: (
    <path d="M12 4c5 0 9 3.4 9 7.5S17 19 12 19c-1 0-2-.1-2.9-.4L4 20l1.5-3.8C4.6 15 3 13.4 3 11.5 3 7.4 7 4 12 4z" />
  ),
  bell: (
    <>
      <path d="M18 16H6c1.2-1.2 2-2.5 2-6a4 4 0 0 1 8 0c0 3.5.8 4.8 2 6z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="3" />
      <path d="M8.5 7L10 4.5h4L15.5 7" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6L6 18" />,
  heart: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  ),
  lightbulb: (
    <>
      <path d="M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3z" />
      <path d="M9.5 20.5h5M10.5 17v3.5M13.5 17v3.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M3.5 7.5L12 13l8.5-5.5" />
    </>
  ),
  cookie: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="9.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="10" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="10" cy="14.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="12.5" r="0.5" fill="currentColor" stroke="none" />
    </>
  ),
  world: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3z" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M8 4v16M16 4v16M3 9h5M3 15h5M16 9h5M16 15h5" />
    </>
  ),
  home: (
    <>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M10 21v-6h4v6" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v11M7 10l5 5 5-5" />
      <path d="M4 20h16" />
    </>
  ),
  filter: <path d="M3 5h18l-7 8v5.5L10 21v-8L3 5z" />,
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
