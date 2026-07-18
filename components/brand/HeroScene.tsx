// Hero-scenen: himmel, skyer, drage, regnbue, bakker, træer og ræven.
// Bygget som absolutte SVG-lag så scenen tilpasser sig alle skærmbredder
// uden billed-requests. Al bevægelse er ren CSS på transform/opacity og
// slås fra ved prefers-reduced-motion (styles i globals.css).

import { FoxMascot } from './FoxMascot';

/** Puffy cloud - single tone, built from circles */
function Cloud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 70 34" className={className} style={style} aria-hidden="true">
      <g fill="currentColor">
        <circle cx="16" cy="20" r="12" />
        <circle cx="34" cy="14" r="15" />
        <circle cx="52" cy="20" r="11" />
        <rect x="6" y="18" width="58" height="14" rx="7" />
      </g>
    </svg>
  );
}

function Kite({ className }: { className?: string }) {
  return (
    <svg viewBox="-22 -30 44 116" className={className} aria-hidden="true">
      <g transform="rotate(14)">
        <path d="M0 -24 L15 0 L0 28 L-15 0 Z" fill="#CDB4DB" />
        <path d="M0 -24 L0 28 M-15 0 L15 0" stroke="#B08BC9" strokeWidth="1.6" />
        <path d="M0 28 Q 8 42 0 54 Q -8 66 4 78" fill="none" stroke="#B08BC9" strokeWidth="1.8" />
        <path d="M-4 46 L4 52 M4 64 L-4 70" stroke="#FFB5A7" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-10 -10 20 20" className={className} style={style} aria-hidden="true">
      <path
        d="M0 -8 Q 1.2 -1.2 8 0 Q 1.2 1.2 0 8 Q -1.2 1.2 -8 0 Q -1.2 -1.2 0 -8 Z"
        fill="#FFD45E"
      />
    </svg>
  );
}

/**
 * Bakkelandskabet i bunden af heroen: tre lag bakker, regnbue, træer,
 * blomster og badebold. Strækker sig i fuld bredde.
 */
function Hills({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 240"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      {/* bagerste bakke */}
      <path d="M0 120 Q 300 30 600 100 T 1200 70 L 1200 240 L 0 240 Z" fill="#B8E0D2" />
      {/* regnbue - stikker op bag den mellemste bakke */}
      <g fill="none" opacity=".8">
        <path d="M810 172 A 70 70 0 0 1 950 172" stroke="#FFB5A7" strokeWidth="13" />
        <path d="M826 172 A 54 54 0 0 1 934 172" stroke="#FFE66D" strokeWidth="13" />
        <path d="M842 172 A 38 38 0 0 1 918 172" stroke="#B8E0D2" strokeWidth="13" />
      </g>
      {/* mellemste bakke */}
      <path d="M0 170 Q 350 100 700 160 T 1200 140 L 1200 240 L 0 240 Z" fill="#8FCDB4" />
      {/* træer */}
      <g>
        <rect x="166" y="146" width="7" height="22" rx="3.5" fill="#8B5E3C" />
        <circle cx="169.5" cy="134" r="17" fill="#3F8E6B" />
        <circle cx="158" cy="142" r="11" fill="#4E9C77" />
        <circle cx="181" cy="142" r="11" fill="#4E9C77" />
        <rect x="298" y="166" width="5.5" height="16" rx="2.7" fill="#8B5E3C" />
        <circle cx="300.7" cy="158" r="12" fill="#4E9C77" />
        <rect x="66" y="184" width="5" height="14" rx="2.5" fill="#8B5E3C" />
        <circle cx="68.5" cy="177" r="10.5" fill="#3F8E6B" />
      </g>
      {/* forreste bakke */}
      <path d="M0 215 Q 300 185 640 210 T 1200 200 L 1200 240 L 0 240 Z" fill="#5FA985" />
      {/* blomster */}
      <g fill="#FFF6E3">
        <circle cx="352" cy="226" r="3.2" />
        <circle cx="502" cy="218" r="2.8" />
        <circle cx="622" cy="229" r="3.2" />
        <circle cx="262" cy="220" r="2.8" />
        <circle cx="1160" cy="222" r="3" />
      </g>
      <g fill="#FFE66D">
        <circle cx="352" cy="226" r="1.4" />
        <circle cx="502" cy="218" r="1.2" />
        <circle cx="622" cy="229" r="1.4" />
        <circle cx="262" cy="220" r="1.2" />
        <circle cx="1160" cy="222" r="1.3" />
      </g>
      {/* badebold */}
      <g transform="translate(806 196)">
        <circle r="16" fill="#FFB5A7" />
        <path d="M-16 0 A 16 16 0 0 0 16 0 Z" fill="#fff" />
        <ellipse rx="16" ry="5.2" fill="#FFE66D" opacity=".9" />
        <circle cx="-5.5" cy="-7" r="3.6" fill="#fff" opacity=".8" />
      </g>
    </svg>
  );
}

/**
 * Den samlede scene. Lægges som absolute lag bag hero-indholdet:
 * himmelgradienten sætter sektionen selv, scenen leverer sol, skyer,
 * drage, bakker og ræven.
 */
export function HeroScene() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* sol */}
      <div className="absolute top-6 right-[6%] sm:top-10 sm:right-[10%]">
        <div className="relative w-20 h-20 sm:w-28 sm:h-28">
          <div className="absolute inset-0 rounded-full bg-[#FFE9A8] opacity-40 scale-150" />
          <div className="absolute inset-0 rounded-full bg-[#FFE9A8]" />
          <div className="absolute inset-[18%] rounded-full bg-[#FFF2C8]" />
        </div>
      </div>

      {/* skyer - langsom drift på desktop */}
      <Cloud className="absolute top-8 left-[2%] w-24 sm:w-32 text-white/90 animate-drift" />
      <Cloud className="absolute top-24 left-[30%] w-16 text-white/60 animate-drift" style={{ animationDelay: '-6s' }} />
      <Cloud className="absolute top-16 right-[28%] w-20 sm:w-24 text-white/70 animate-drift" style={{ animationDelay: '-12s' }} />
      <Cloud className="hidden lg:block absolute top-48 right-[16%] w-28 text-white/80 animate-drift" style={{ animationDelay: '-18s' }} />

      {/* drage */}
      <Kite className="hidden sm:block absolute top-[26%] right-[34%] w-12 lg:w-14 animate-sway" />

      {/* glimt */}
      <Sparkle className="absolute bottom-[36%] left-[8%] w-4 sm:w-5 animate-sparkle" />
      <Sparkle className="absolute top-[42%] right-[8%] w-3 sm:w-4 animate-sparkle" style={{ animationDelay: '0.7s' }} />

      {/* bakker */}
      <Hills className="absolute bottom-0 left-0 w-full h-44 sm:h-64 xl:h-72" />

      {/* ræven - står på bakkerne nederst til højre */}
      <FoxMascot className="absolute bottom-2 right-[6%] w-28 sm:w-36 lg:w-44 animate-float-gentle" />
    </div>
  );
}
