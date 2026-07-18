'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface GameDetailImageProps {
  src: string;
  alt: string;
  title: string;
  type: 'digital' | 'board';
}

export function GameDetailImage({ src, alt, title, type }: GameDetailImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        <Icon name={type === 'digital' ? 'gamepad' : 'dice'} className="w-24 h-24 mb-4 text-[#4A443C]/50" />
        <span className="text-xl font-bold text-[#4A4A4A]/80">
          {title}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
      className="object-cover"
      priority
      onError={() => setHasError(true)}
    />
  );
}

export default GameDetailImage;
