// Wave and blob decorations for visual interest

interface WaveProps {
  className?: string;
  color?: string;
  flip?: boolean;
}

export function WaveTop({ className = '', color = '#FFF9F0', flip = false }: WaveProps) {
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-[60px] md:h-[80px]"
        style={{ transform: 'translateY(1px)' }}
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          fill={color}
          opacity="0.25"
        />
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          fill={color}
          opacity="0.5"
        />
        <path
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,googletag 172.46-45.71,248.8-84.81V0Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

export function WaveBottom({ className = '', color = '#FFF9F0' }: WaveProps) {
  return (
    <div className={`w-full overflow-hidden leading-none rotate-180 ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-[60px] md:h-[80px]"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,googletag 985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

// Floating decorative blobs
export function FloatingBlobs({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Primary blob - coral */}
      <div
        className="absolute w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"
        style={{ top: '-10%', left: '-5%' }}
      />

      {/* Secondary blob - turquoise */}
      <div
        className="absolute w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float-slow"
        style={{ bottom: '10%', right: '-5%', animationDelay: '1s' }}
      />

      {/* Accent blob - yellow */}
      <div
        className="absolute w-48 h-48 bg-accent/15 rounded-full blur-2xl animate-float"
        style={{ top: '40%', left: '60%', animationDelay: '2s' }}
      />

      {/* Small decorative blobs */}
      <div
        className="absolute w-24 h-24 bg-lavender/20 rounded-full blur-xl animate-float-slow"
        style={{ top: '20%', right: '20%', animationDelay: '0.5s' }}
      />
      <div
        className="absolute w-32 h-32 bg-mint/20 rounded-full blur-xl animate-float"
        style={{ bottom: '30%', left: '10%', animationDelay: '1.5s' }}
      />
    </div>
  );
}

// Decorative dots pattern
export function DotsPattern({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none opacity-30 ${className}`}>
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-primary/30" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  );
}

// Confetti-like decorative elements
export function Confetti({ className = '' }: { className?: string }) {
  const shapes = [
    { type: 'circle', color: '#FF6B6B', size: 8, x: '10%', y: '20%', delay: 0 },
    { type: 'square', color: '#4ECDC4', size: 10, x: '85%', y: '15%', delay: 0.5 },
    { type: 'triangle', color: '#FFE66D', size: 12, x: '75%', y: '70%', delay: 1 },
    { type: 'circle', color: '#CDB4DB', size: 6, x: '15%', y: '75%', delay: 1.5 },
    { type: 'square', color: '#A2D2FF', size: 8, x: '90%', y: '50%', delay: 2 },
    { type: 'circle', color: '#B8E0D2', size: 10, x: '5%', y: '45%', delay: 0.3 },
    { type: 'triangle', color: '#FF6B6B', size: 8, x: '60%', y: '10%', delay: 0.8 },
    { type: 'square', color: '#FFE66D', size: 6, x: '25%', y: '85%', delay: 1.2 },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {shapes.map((shape, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-60"
          style={{
            left: shape.x,
            top: shape.y,
            animationDelay: `${shape.delay}s`,
            animationDuration: '4s',
          }}
        >
          {shape.type === 'circle' && (
            <div
              className="rounded-full"
              style={{
                width: shape.size,
                height: shape.size,
                backgroundColor: shape.color,
              }}
            />
          )}
          {shape.type === 'square' && (
            <div
              className="rounded-sm rotate-45"
              style={{
                width: shape.size,
                height: shape.size,
                backgroundColor: shape.color,
              }}
            />
          )}
          {shape.type === 'triangle' && (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid ${shape.color}`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

const WaveDecorations = { WaveTop, WaveBottom, FloatingBlobs, DotsPattern, Confetti };
export default WaveDecorations;
