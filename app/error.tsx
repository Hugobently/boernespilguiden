'use client';

import { useEffect } from 'react';
import Link from 'next/link';

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
        <span className="text-8xl block mb-6">😢</span>
        <h1 className="text-3xl font-bold text-[#4A4A4A] mb-4">
          Ups! Noget gik galt
        </h1>
        <p className="text-[#7A7A7A] mb-8">
          Der opstod en uventet fejl. Prøv at genindlæse siden eller gå tilbage til forsiden.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#98DDCA] text-white font-semibold rounded-full hover:bg-[#7FC7B3] transition-colors"
          >
            Prøv igen
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-[#FFB5A7] text-white font-semibold rounded-full hover:bg-[#F8A99B] transition-colors"
          >
            Gå til forsiden
          </Link>
        </div>
      </div>
    </div>
  );
}
