// Ræven med terningen - Børnespilguidens maskot (2026 redesign).
// Ræven er den kloge, ærlige guide; terningen dækker både brætspil og
// digitale spil. Ren inline-SVG: skarp på alle skærme, ingen billed-requests.

interface FoxMascotProps {
  className?: string;
  /** Accessible label; decorative by default */
  label?: string;
}

export function FoxMascot({ className, label }: FoxMascotProps) {
  return (
    <svg
      viewBox="0 0 120 124"
      className={className}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {/* skygge */}
      <ellipse cx="60" cy="118" rx="32" ry="5.5" fill="#2E2822" opacity=".12" />
      {/* hale */}
      <ellipse cx="94" cy="88" rx="15" ry="24" fill="#F5893B" transform="rotate(-26 94 88)" />
      <ellipse cx="101" cy="72" rx="9" ry="10.5" fill="#FFF3E6" transform="rotate(-26 101 72)" />
      {/* krop */}
      <ellipse cx="60" cy="90" rx="27" ry="28" fill="#F5893B" />
      <ellipse cx="60" cy="97" rx="16.5" ry="18" fill="#FFE8D1" />
      {/* ører */}
      <path d="M36 24 L26 3 L52 13 Z" fill="#F5893B" />
      <path d="M37.5 19.5 L31.5 7.5 L46 13.5 Z" fill="#FFF3E6" />
      <path d="M84 24 L94 3 L68 13 Z" fill="#F5893B" />
      <path d="M82.5 19.5 L88.5 7.5 L74 13.5 Z" fill="#FFF3E6" />
      {/* hoved */}
      <circle cx="60" cy="46" r="29" fill="#F5893B" />
      <path d="M32 52 L23 59 L33 62 Z" fill="#F5893B" />
      <path d="M88 52 L97 59 L87 62 Z" fill="#F5893B" />
      {/* snude */}
      <ellipse cx="50" cy="57" rx="10" ry="8.5" fill="#FFF3E6" />
      <ellipse cx="70" cy="57" rx="10" ry="8.5" fill="#FFF3E6" />
      <ellipse cx="60" cy="61" rx="7" ry="5.5" fill="#FFF3E6" />
      {/* øjne */}
      <ellipse cx="45" cy="42" rx="6.5" ry="7.5" fill="#fff" />
      <ellipse cx="75" cy="42" rx="6.5" ry="7.5" fill="#fff" />
      <circle cx="46" cy="42.5" r="3.4" fill="#2D3436" />
      <circle cx="76" cy="42.5" r="3.4" fill="#2D3436" />
      <circle cx="43" cy="39.5" r="1.8" fill="#fff" />
      <circle cx="73" cy="39.5" r="1.8" fill="#fff" />
      {/* kinder */}
      <circle cx="33" cy="54" r="4.5" fill="#FFB5A7" opacity=".85" />
      <circle cx="87" cy="54" r="4.5" fill="#FFB5A7" opacity=".85" />
      {/* næse og mund */}
      <path d="M55 51 Q 60 47.5 65 51 Q 63 57 60 58 Q 57 57 55 51 Z" fill="#6B4226" />
      <path d="M60 58 Q 60 64 54 60.5" fill="none" stroke="#6B4226" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M60 58 Q 60 64 66 60.5" fill="none" stroke="#6B4226" strokeWidth="2.2" strokeLinecap="round" />
      {/* terning */}
      <g transform="rotate(-8 60 107)">
        <rect x="49" y="96" width="22" height="22" rx="5.5" fill="#FFD45E" />
        <circle cx="55" cy="102" r="2" fill="#7A4A22" />
        <circle cx="65" cy="102" r="2" fill="#7A4A22" />
        <circle cx="60" cy="107" r="2" fill="#7A4A22" />
        <circle cx="55" cy="112" r="2" fill="#7A4A22" />
        <circle cx="65" cy="112" r="2" fill="#7A4A22" />
      </g>
      {/* poter */}
      <ellipse cx="47" cy="114" rx="7" ry="5.5" fill="#E8762C" transform="rotate(-10 47 114)" />
      <ellipse cx="73" cy="114" rx="7" ry="5.5" fill="#E8762C" transform="rotate(10 73 114)" />
    </svg>
  );
}

/** Rævens ansigt til logo, badges og små flader */
export function FoxFace({ className, label }: FoxMascotProps) {
  return (
    <svg
      viewBox="0 0 50 52"
      className={className}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      <path d="M14 13 L8 2 L22 8 Z" fill="#F5893B" />
      <path d="M15 10.5 L11.5 5 L19 8 Z" fill="#FFF3E6" />
      <path d="M36 13 L42 2 L28 8 Z" fill="#F5893B" />
      <path d="M35 10.5 L38.5 5 L31 8 Z" fill="#FFF3E6" />
      <circle cx="25" cy="29" r="18.5" fill="#F5893B" />
      <ellipse cx="19" cy="35.5" rx="7" ry="6" fill="#FFF3E6" />
      <ellipse cx="31" cy="35.5" rx="7" ry="6" fill="#FFF3E6" />
      <ellipse cx="25" cy="38.5" rx="5" ry="4" fill="#FFF3E6" />
      <ellipse cx="15.5" cy="26.5" rx="4" ry="4.6" fill="#fff" />
      <ellipse cx="34.5" cy="26.5" rx="4" ry="4.6" fill="#fff" />
      <circle cx="16.2" cy="26.7" r="2.1" fill="#2D3436" />
      <circle cx="35.2" cy="26.7" r="2.1" fill="#2D3436" />
      <circle cx="14" cy="24.8" r="1.1" fill="#fff" />
      <circle cx="34" cy="24.8" r="1.1" fill="#fff" />
      <circle cx="8.5" cy="33" r="2.8" fill="#FFB5A7" opacity=".85" />
      <circle cx="41.5" cy="33" r="2.8" fill="#FFB5A7" opacity=".85" />
      <path d="M21.8 32.5 Q 25 30.5 28.2 32.5 Q 27.1 36.5 25 37.2 Q 22.9 36.5 21.8 32.5 Z" fill="#6B4226" />
      <path d="M25 37.2 Q 25 41 21.2 38.8" fill="none" stroke="#6B4226" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M25 37.2 Q 25 41 28.8 38.8" fill="none" stroke="#6B4226" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
