'use client';

import { useState } from 'react';

// Big flower for dense carpet
function CarpetFlower({
  x,
  y,
  size = 50,
  color,
  rotation = 0,
  delay = 0
}: {
  x: string;
  y: string;
  size?: number;
  color: string;
  rotation?: number;
  delay?: number;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: `rotate(${rotation}deg)`,
        animation: `sway-gentle 4s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 50 50">
        {/* 8 petals for fuller flower */}
        <ellipse cx="25" cy="8" rx="10" ry="12" fill={color} opacity="0.9" />
        <ellipse cx="25" cy="42" rx="10" ry="12" fill={color} opacity="0.9" />
        <ellipse cx="8" cy="25" rx="12" ry="10" fill={color} opacity="0.9" />
        <ellipse cx="42" cy="25" rx="12" ry="10" fill={color} opacity="0.9" />
        {/* Diagonal petals */}
        <ellipse cx="12" cy="12" rx="8" ry="10" fill={color} opacity="0.85" transform="rotate(-45 12 12)" />
        <ellipse cx="38" cy="12" rx="8" ry="10" fill={color} opacity="0.85" transform="rotate(45 38 12)" />
        <ellipse cx="12" cy="38" rx="8" ry="10" fill={color} opacity="0.85" transform="rotate(45 12 38)" />
        <ellipse cx="38" cy="38" rx="8" ry="10" fill={color} opacity="0.85" transform="rotate(-45 38 38)" />
        {/* Center */}
        <circle cx="25" cy="25" r="8" fill="#FFE066" />
        <circle cx="23" cy="23" r="2.5" fill="white" opacity="0.5" />
      </svg>
    </div>
  );
}

// Interactive flower for top layer
function Flower({
  x,
  y,
  size = 30,
  petalColor,
  centerColor = "#FFD93D",
  rotation = 0,
  delay = 0
}: {
  x: string;
  y: string;
  size?: number;
  petalColor: string;
  centerColor?: string;
  rotation?: number;
  delay?: number;
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div
      className="absolute cursor-pointer transition-transform hover:scale-110"
      style={{
        left: x,
        top: y,
        transform: `rotate(${rotation}deg)`,
        animation: `sway 3s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
      onClick={handleClick}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        className={`transition-transform ${isAnimating ? 'animate-spin-slow' : ''}`}
      >
        <ellipse cx="20" cy="8" rx="6" ry="10" fill={petalColor} opacity="0.9" />
        <ellipse cx="20" cy="32" rx="6" ry="10" fill={petalColor} opacity="0.9" />
        <ellipse cx="8" cy="20" rx="10" ry="6" fill={petalColor} opacity="0.9" />
        <ellipse cx="32" cy="20" rx="10" ry="6" fill={petalColor} opacity="0.9" />
        <ellipse cx="10" cy="10" rx="5" ry="8" fill={petalColor} opacity="0.8" transform="rotate(-45 10 10)" />
        <ellipse cx="30" cy="10" rx="5" ry="8" fill={petalColor} opacity="0.8" transform="rotate(45 30 10)" />
        <ellipse cx="10" cy="30" rx="5" ry="8" fill={petalColor} opacity="0.8" transform="rotate(45 10 30)" />
        <ellipse cx="30" cy="30" rx="5" ry="8" fill={petalColor} opacity="0.8" transform="rotate(-45 30 30)" />
        <circle cx="20" cy="20" r="7" fill={centerColor} />
        <circle cx="18" cy="18" r="2" fill="white" opacity="0.4" />
      </svg>
    </div>
  );
}

// Balloon SVG component
function Balloon({
  color,
  x,
  y,
  size = 40,
  rotation = 0,
  delay = 0
}: {
  color: string;
  x: string;
  y: string;
  size?: number;
  rotation?: number;
  delay?: number;
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div
      className="absolute cursor-pointer transition-transform hover:scale-110"
      style={{
        left: x,
        top: y,
        transform: `rotate(${rotation}deg)`,
        animation: `float 3s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
      onClick={handleClick}
    >
      <svg
        width={size}
        height={size * 1.4}
        viewBox="0 0 40 56"
        className={`transition-transform ${isAnimating ? 'animate-bounce' : ''}`}
      >
        <ellipse cx="20" cy="18" rx="18" ry="18" fill={color} className="drop-shadow-md" />
        <ellipse cx="14" cy="12" rx="5" ry="6" fill="white" opacity="0.4" />
        <polygon points="17,36 20,40 23,36" fill={color} />
        <path d="M20 40 Q22 48 18 56" stroke="#9CA3AF" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

// Heart decoration
function Heart({
  x,
  y,
  size = 20,
  color = "#FF6B6B",
  delay = 0
}: {
  x: string;
  y: string;
  size?: number;
  color?: string;
  delay?: number;
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
  };

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: x,
        top: y,
        animation: `pulse-soft 2s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
      onClick={handleClick}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={`transition-transform ${isAnimating ? 'scale-150' : ''}`}
        style={{ transition: 'transform 0.2s ease-out' }}
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={color}
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
}

// Teddy bear decoration
function TeddyBear({
  x,
  y,
  size = 32,
  flipped = false
}: {
  x: string;
  y: string;
  size?: number;
  flipped?: boolean;
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: x,
        top: y,
        transform: flipped ? 'scaleX(-1)' : 'none',
      }}
      onClick={handleClick}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        className={`transition-transform ${isAnimating ? 'animate-wiggle' : ''}`}
      >
        <circle cx="8" cy="8" r="6" fill="#D4A574" />
        <circle cx="8" cy="8" r="3" fill="#C4956A" />
        <circle cx="32" cy="8" r="6" fill="#D4A574" />
        <circle cx="32" cy="8" r="3" fill="#C4956A" />
        <circle cx="20" cy="18" r="14" fill="#D4A574" />
        <ellipse cx="20" cy="22" rx="6" ry="5" fill="#E8C9A0" />
        <ellipse cx="20" cy="20" rx="2.5" ry="2" fill="#4A3728" />
        <circle cx="14" cy="15" r="2" fill="#4A3728" />
        <circle cx="26" cy="15" r="2" fill="#4A3728" />
        <circle cx="14.5" cy="14.5" r="0.8" fill="white" />
        <circle cx="26.5" cy="14.5" r="0.8" fill="white" />
        <path d="M18 24 Q20 26 22 24" stroke="#4A3728" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

// Butterfly decoration
function Butterfly({
  x,
  y,
  size = 28,
  color = "#E2C2FF",
  delay = 0
}: {
  x: string;
  y: string;
  size?: number;
  color?: string;
  delay?: number;
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: x,
        top: y,
        animation: `flutter 2s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
      onClick={handleClick}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        className={`transition-transform ${isAnimating ? 'animate-fly' : ''}`}
      >
        <ellipse cx="8" cy="12" rx="7" ry="10" fill={color} opacity="0.8" />
        <ellipse cx="24" cy="12" rx="7" ry="10" fill={color} opacity="0.8" />
        <ellipse cx="10" cy="22" rx="5" ry="7" fill={color} opacity="0.7" />
        <ellipse cx="22" cy="22" rx="5" ry="7" fill={color} opacity="0.7" />
        <circle cx="8" cy="10" r="3" fill="white" opacity="0.4" />
        <circle cx="24" cy="10" r="3" fill="white" opacity="0.4" />
        <ellipse cx="16" cy="16" rx="2" ry="10" fill="#4A3728" />
        <path d="M15 6 Q13 2 11 3" stroke="#4A3728" strokeWidth="1" fill="none" />
        <path d="M17 6 Q19 2 21 3" stroke="#4A3728" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

// Ladybug decoration
function Ladybug({
  x,
  y,
  size = 24,
  delay = 0
}: {
  x: string;
  y: string;
  size?: number;
  delay?: number;
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: x,
        top: y,
        animation: `crawl 4s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
      onClick={handleClick}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={`transition-transform ${isAnimating ? 'animate-wiggle' : ''}`}
      >
        <ellipse cx="12" cy="14" rx="9" ry="8" fill="#FF4444" />
        <circle cx="12" cy="5" r="4" fill="#2D2D2D" />
        <line x1="12" y1="6" x2="12" y2="22" stroke="#2D2D2D" strokeWidth="1.5" />
        <circle cx="8" cy="11" r="2" fill="#2D2D2D" />
        <circle cx="16" cy="11" r="2" fill="#2D2D2D" />
        <circle cx="7" cy="16" r="1.5" fill="#2D2D2D" />
        <circle cx="17" cy="16" r="1.5" fill="#2D2D2D" />
        <circle cx="12" cy="18" r="1.5" fill="#2D2D2D" />
        <circle cx="10" cy="4" r="1" fill="white" />
        <circle cx="14" cy="4" r="1" fill="white" />
      </svg>
    </div>
  );
}

// Rainbow arc decoration
function RainbowArc({
  x,
  y,
  size = 80
}: {
  x: string;
  y: string;
  size?: number;
}) {
  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      <svg width={size} height={size * 0.5} viewBox="0 0 100 50">
        <path d="M5 50 Q5 5 50 5 Q95 5 95 50" stroke="#FF6B6B" strokeWidth="6" fill="none" opacity="0.6" />
        <path d="M12 50 Q12 12 50 12 Q88 12 88 50" stroke="#FFB347" strokeWidth="6" fill="none" opacity="0.6" />
        <path d="M19 50 Q19 19 50 19 Q81 19 81 50" stroke="#FFD93D" strokeWidth="6" fill="none" opacity="0.6" />
        <path d="M26 50 Q26 26 50 26 Q74 26 74 50" stroke="#77DD77" strokeWidth="6" fill="none" opacity="0.6" />
        <path d="M33 50 Q33 33 50 33 Q67 33 67 50" stroke="#89CFF0" strokeWidth="6" fill="none" opacity="0.6" />
        <path d="M40 50 Q40 40 50 40 Q60 40 60 50" stroke="#CDB4DB" strokeWidth="6" fill="none" opacity="0.6" />
      </svg>
    </div>
  );
}

// Cloud decoration
function Cloud({
  x,
  y,
  size = 60,
  opacity = 0.6
}: {
  x: string;
  y: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      <svg width={size} height={size * 0.6} viewBox="0 0 100 60">
        <ellipse cx="30" cy="40" rx="25" ry="18" fill="white" opacity={opacity} />
        <ellipse cx="50" cy="30" rx="30" ry="22" fill="white" opacity={opacity} />
        <ellipse cx="75" cy="38" rx="22" ry="16" fill="white" opacity={opacity} />
      </svg>
    </div>
  );
}

// Flower colors for the carpet
const flowerColors = [
  '#FFB5A7', '#BAFFC9', '#BAE1FF', '#FFD1DC', '#E2C2FF',
  '#FFDAC1', '#C7CEEA', '#B5EAD7', '#FF9AA2', '#98DDCA',
  '#FFE66D', '#A2D2FF', '#CDB4DB', '#77DD77', '#FFB347'
];

export default function DecorativeFrame() {
  // Generate dense flower carpet - LEFT side
  const leftFlowers = [];
  let colorIndex = 0;
  for (let row = 0; row < 30; row++) {
    for (let col = 0; col < 5; col++) {
      const x = col * 32 + (row % 2 === 0 ? 0 : 16) - 10;
      const y = row * 3.5;
      const size = 55 + Math.random() * 18;
      const rotation = Math.random() * 30 - 15;
      const delay = Math.random() * 2;
      leftFlowers.push(
        <CarpetFlower
          key={`left-${row}-${col}`}
          x={`${x}px`}
          y={`${y}%`}
          size={size}
          color={flowerColors[colorIndex % flowerColors.length]}
          rotation={rotation}
          delay={delay}
        />
      );
      colorIndex++;
    }
  }

  // Generate dense flower carpet - RIGHT side
  const rightFlowers = [];
  colorIndex = 7; // Start at different color
  for (let row = 0; row < 30; row++) {
    for (let col = 0; col < 5; col++) {
      const x = col * 32 + (row % 2 === 0 ? 0 : 16);
      const y = row * 3.5;
      const size = 55 + Math.random() * 18;
      const rotation = Math.random() * 30 - 15;
      const delay = Math.random() * 2;
      rightFlowers.push(
        <CarpetFlower
          key={`right-${row}-${col}`}
          x={`calc(100% - ${x + 65}px)`}
          y={`${y}%`}
          size={size}
          color={flowerColors[colorIndex % flowerColors.length]}
          rotation={rotation}
          delay={delay}
        />
      );
      colorIndex++;
    }
  }

  return (
    <>
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--rotation, 0deg)); }
          50% { transform: translateY(-8px) rotate(var(--rotation, 0deg)); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.9); }
        }

        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }

        @keyframes sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }

        @keyframes sway-gentle {
          0%, 100% { transform: rotate(-2deg) scale(1); }
          50% { transform: rotate(2deg) scale(1.02); }
        }

        @keyframes flutter {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          25% { transform: translateY(-3px) rotate(0deg); }
          50% { transform: translateY(0) rotate(5deg); }
          75% { transform: translateY(-3px) rotate(0deg); }
        }

        @keyframes crawl {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(2px) translateY(-1px); }
          50% { transform: translateX(0) translateY(-2px); }
          75% { transform: translateX(-2px) translateY(-1px); }
        }

        .animate-wiggle {
          animation: wiggle 0.3s ease-in-out 2;
        }

        .animate-spin-slow {
          animation: spin 0.6s ease-in-out;
        }

        .animate-fly {
          animation: flutter 0.2s ease-in-out 4;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* LEFT SIDE - Dense flower carpet (25% narrower) */}
      <div className="fixed left-0 top-0 h-full w-24 md:w-36 lg:w-42 pointer-events-none z-40 overflow-hidden">
        {/* Solid color base so no gaps show */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#E8F5E9] via-[#C8E6C9] to-[#A5D6A7]" />

        {/* Dense flower carpet */}
        <div className="absolute inset-0">
          {leftFlowers}
        </div>

        {/* Larger interactive decorations on top */}
        <div className="relative h-full pointer-events-auto z-10">
          <Flower x="10px" y="5%" size={62} petalColor="#FFB5A7" centerColor="#FFD93D" rotation={-10} delay={0} />
          <Flower x="55px" y="18%" size={58} petalColor="#E2C2FF" centerColor="#FFE066" rotation={15} delay={0.5} />
          <Flower x="15px" y="32%" size={60} petalColor="#BAFFC9" centerColor="#FFA500" rotation={-5} delay={1} />
          <Flower x="60px" y="45%" size={56} petalColor="#BAE1FF" centerColor="#FFD93D" rotation={8} delay={1.5} />
          <Flower x="12px" y="58%" size={62} petalColor="#FFD1DC" centerColor="#FFE066" rotation={-12} delay={2} />
          <Flower x="50px" y="72%" size={58} petalColor="#98DDCA" centerColor="#FFA500" rotation={10} delay={0.3} />
          <Flower x="20px" y="85%" size={56} petalColor="#CDB4DB" centerColor="#FFD93D" rotation={-8} delay={0.8} />

          <Balloon color="#FF9AA2" x="75px" y="10%" size={42} rotation={5} delay={0.3} />
          <Balloon color="#98DDCA" x="85px" y="40%" size={38} rotation={-8} delay={0.8} />
          <Balloon color="#A2D2FF" x="70px" y="70%" size={40} rotation={3} delay={1.3} />

          <Butterfly x="35px" y="25%" size={36} color="#E2C2FF" delay={0.4} />
          <Butterfly x="70px" y="55%" size={34} color="#FFD1DC" delay={1.2} />
          <Butterfly x="30px" y="80%" size={32} color="#BAFFC9" delay={0.7} />

          <Ladybug x="25px" y="15%" size={30} delay={0.6} />
          <Ladybug x="65px" y="62%" size={28} delay={1.4} />
          <Ladybug x="35px" y="92%" size={26} delay={0.9} />

          <Heart x="45px" y="8%" size={28} color="#FF6B6B" delay={0.5} />
          <Heart x="75px" y="35%" size={26} color="#FFB5A7" delay={1.1} />
          <Heart x="40px" y="68%" size={24} color="#FF9AA2" delay={0.2} />

          <TeddyBear x="5px" y="48%" size={46} />
          <TeddyBear x="55px" y="88%" size={44} />
        </div>

        {/* Soft gradient fade to content */}
        <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-[#FFFDF8] to-transparent pointer-events-none z-20" />
      </div>

      {/* RIGHT SIDE - Dense flower carpet (25% narrower) */}
      <div className="fixed right-0 top-0 h-full w-24 md:w-36 lg:w-42 pointer-events-none z-40 overflow-hidden">
        {/* Solid color base so no gaps show */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#E8F5E9] via-[#C8E6C9] to-[#A5D6A7]" />

        {/* Dense flower carpet */}
        <div className="absolute inset-0">
          {rightFlowers}
        </div>

        {/* Larger interactive decorations on top */}
        <div className="relative h-full pointer-events-auto z-10">
          <Flower x="calc(100% - 55px)" y="8%" size={60} petalColor="#E2C2FF" centerColor="#FFD93D" rotation={10} delay={0.2} />
          <Flower x="calc(100% - 95px)" y="22%" size={62} petalColor="#BAFFC9" centerColor="#FFE066" rotation={-15} delay={0.7} />
          <Flower x="calc(100% - 48px)" y="35%" size={56} petalColor="#FFB5A7" centerColor="#FFA500" rotation={5} delay={1.2} />
          <Flower x="calc(100% - 88px)" y="48%" size={58} petalColor="#BAE1FF" centerColor="#FFD93D" rotation={-8} delay={1.7} />
          <Flower x="calc(100% - 60px)" y="62%" size={62} petalColor="#FFD1DC" centerColor="#FFE066" rotation={12} delay={0.4} />
          <Flower x="calc(100% - 92px)" y="75%" size={56} petalColor="#77DD77" centerColor="#FFA500" rotation={-10} delay={0.9} />
          <Flower x="calc(100% - 45px)" y="88%" size={60} petalColor="#CDB4DB" centerColor="#FFD93D" rotation={8} delay={1.4} />

          <Balloon color="#A2D2FF" x="calc(100% - 105px)" y="12%" size={40} rotation={-5} delay={0.5} />
          <Balloon color="#CDB4DB" x="calc(100% - 110px)" y="45%" size={42} rotation={8} delay={1.0} />
          <Balloon color="#BAFFC9" x="calc(100% - 100px)" y="78%" size={38} rotation={-3} delay={1.5} />

          <Butterfly x="calc(100% - 70px)" y="18%" size={34} color="#BAFFC9" delay={0.6} />
          <Butterfly x="calc(100% - 100px)" y="52%" size={36} color="#FFB5A7" delay={1.4} />
          <Butterfly x="calc(100% - 65px)" y="85%" size={32} color="#E2C2FF" delay={0.3} />

          <Ladybug x="calc(100% - 60px)" y="28%" size={28} delay={0.8} />
          <Ladybug x="calc(100% - 100px)" y="65%" size={30} delay={1.6} />
          <Ladybug x="calc(100% - 55px)" y="95%" size={26} delay={0.4} />

          <Heart x="calc(100% - 78px)" y="5%" size={26} color="#FF6B6B" delay={0.3} />
          <Heart x="calc(100% - 105px)" y="38%" size={28} color="#FFB5A7" delay={0.9} />
          <Heart x="calc(100% - 72px)" y="72%" size={24} color="#FF9AA2" delay={1.2} />

          <TeddyBear x="calc(100% - 42px)" y="42%" size={44} flipped />
          <TeddyBear x="calc(100% - 95px)" y="92%" size={46} flipped />
        </div>

        {/* Soft gradient fade to content */}
        <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-[#FFFDF8] to-transparent pointer-events-none z-20" />
      </div>

      {/* TOP decorations */}
      <div className="fixed top-0 left-24 md:left-36 lg:left-42 right-24 md:right-36 lg:right-42 h-16 pointer-events-none z-30 overflow-hidden">
        <div className="relative w-full h-full">
          {/* Clouds */}
          <Cloud x="5%" y="-10px" size={60} opacity={0.5} />
          <Cloud x="20%" y="0px" size={50} opacity={0.4} />
          <Cloud x="40%" y="-5px" size={65} opacity={0.5} />
          <Cloud x="60%" y="2px" size={55} opacity={0.4} />
          <Cloud x="80%" y="-8px" size={60} opacity={0.5} />

          {/* Rainbow in corner */}
          <RainbowArc x="-30px" y="-30px" size={90} />
          <RainbowArc x="calc(100% - 60px)" y="-30px" size={90} />
        </div>
      </div>
    </>
  );
}
