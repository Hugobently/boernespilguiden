'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FoxMascot } from '@/components/brand/FoxMascot';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <FoxMascot className="w-40 h-auto mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-[#4A4A4A] mb-4">
          Ups! Noget gik galt
        </h1>
        <p className="text-[#7A7A7A] mb-8">
          Der opstod en uventet fejl. Prøv at genindlæse siden eller gå tilbage til forsiden.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#C2410C] text-white font-semibold rounded-full hover:bg-[#A93409] transition-colors"
          >
            Prøv igen
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-white text-[#2E2822] font-semibold rounded-full border border-[#EAE3D8] hover:bg-[#FBF5EC] transition-colors"
          >
            Gå til forsiden
          </Link>
        </div>
      </div>
    </div>
  );
}
