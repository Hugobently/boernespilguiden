// Mascot Component - A friendly character for Børnespilguiden
// Can be used in hero sections, empty states, loading screens, etc.

interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'wave' | 'thinking' | 'excited';
  className?: string;
}

const sizeMap = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
};

export function Mascot({ size = 'md', variant = 'default', className = '' }: MascotProps) {
  return (
    <div className={`${sizeMap[size]} ${className} relative`}>
      {/* Main body - friendly robot/character */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Body */}
        <ellipse cx="50" cy="60" rx="35" ry="30" fill="#4ECDC4" />

        {/* Head */}
        <circle cx="50" cy="35" r="28" fill="#FF6B6B" />

        {/* Face highlights */}
        <circle cx="50" cy="35" r="24" fill="#FF8E8E" />

        {/* Eyes */}
        <ellipse cx="40" cy="32" rx="6" ry="7" fill="white" />
        <ellipse cx="60" cy="32" rx="6" ry="7" fill="white" />

        {/* Pupils */}
        <circle cx="41" cy="33" r="3" fill="#2D3436">
          <animate
            attributeName="cx"
            values="41;43;41;39;41"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="61" cy="33" r="3" fill="#2D3436">
          <animate
            attributeName="cx"
            values="61;63;61;59;61"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Eye shine */}
        <circle cx="38" cy="30" r="2" fill="white" opacity="0.8" />
        <circle cx="58" cy="30" r="2" fill="white" opacity="0.8" />

        {/* Happy mouth */}
        <path
          d="M 38 44 Q 50 54 62 44"
          fill="none"
          stroke="#2D3436"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Cheeks */}
        <circle cx="30" cy="40" r="5" fill="#FFB5A7" opacity="0.6" />
        <circle cx="70" cy="40" r="5" fill="#FFB5A7" opacity="0.6" />

        {/* Antenna */}
        <line x1="50" y1="7" x2="50" y2="15" stroke="#FFE66D" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="5" r="4" fill="#FFE66D">
          <animate
            attributeName="r"
            values="4;5;4"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Arms */}
        {variant === 'wave' ? (
          <>
            {/* Waving arm */}
            <ellipse cx="18" cy="55" rx="8" ry="12" fill="#3DBDB5" transform="rotate(-20 18 55)">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="-20 18 55;20 18 55;-20 18 55"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </ellipse>
            <ellipse cx="82" cy="60" rx="8" ry="12" fill="#3DBDB5" transform="rotate(15 82 60)" />
          </>
        ) : (
          <>
            <ellipse cx="18" cy="60" rx="8" ry="12" fill="#3DBDB5" transform="rotate(-15 18 60)" />
            <ellipse cx="82" cy="60" rx="8" ry="12" fill="#3DBDB5" transform="rotate(15 82 60)" />
          </>
        )}

        {/* Feet */}
        <ellipse cx="35" cy="88" rx="12" ry="6" fill="#E85555" />
        <ellipse cx="65" cy="88" rx="12" ry="6" fill="#E85555" />

        {/* Controller icon on belly */}
        <rect x="40" y="55" width="20" height="12" rx="3" fill="#2D3436" opacity="0.3" />
        <circle cx="45" cy="61" r="2" fill="white" opacity="0.5" />
        <circle cx="55" cy="61" r="2" fill="white" opacity="0.5" />
      </svg>

      {/* Sparkle effects for excited variant */}
      {variant === 'excited' && (
        <>
          <span className="absolute -top-2 -right-2 text-xl animate-sparkle">✨</span>
          <span className="absolute -top-1 -left-3 text-lg animate-sparkle" style={{ animationDelay: '0.3s' }}>⭐</span>
          <span className="absolute bottom-0 -right-4 text-lg animate-sparkle" style={{ animationDelay: '0.6s' }}>✨</span>
        </>
      )}
    </div>
  );
}

// Smaller, simpler mascot face for use in badges, buttons, etc.
export function MascotFace({ size = 'sm', className = '' }: { size?: 'xs' | 'sm' | 'md'; className?: string }) {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 50 50" className="w-full h-full">
        {/* Head */}
        <circle cx="25" cy="25" r="22" fill="#FF6B6B" />
        <circle cx="25" cy="25" r="19" fill="#FF8E8E" />

        {/* Eyes */}
        <ellipse cx="18" cy="22" rx="4" ry="5" fill="white" />
        <ellipse cx="32" cy="22" rx="4" ry="5" fill="white" />
        <circle cx="19" cy="23" r="2" fill="#2D3436" />
        <circle cx="33" cy="23" r="2" fill="#2D3436" />

        {/* Mouth */}
        <path d="M 18 32 Q 25 38 32 32" fill="none" stroke="#2D3436" strokeWidth="2" strokeLinecap="round" />

        {/* Cheeks */}
        <circle cx="12" cy="28" r="3" fill="#FFB5A7" opacity="0.6" />
        <circle cx="38" cy="28" r="3" fill="#FFB5A7" opacity="0.6" />
      </svg>
    </div>
  );
}

export default Mascot;
