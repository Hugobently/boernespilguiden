import Link from 'next/link';
import { FoxMascot } from '@/components/brand/FoxMascot';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <FoxMascot className="w-40 h-auto mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-[#4A4A4A] mb-4">
          Siden blev ikke fundet
        </h1>
        <p className="text-[#7A7A7A] mb-8">
          Vi kunne desværre ikke finde den side, du ledte efter. Måske er den blevet flyttet eller slettet.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#98DDCA] text-white font-semibold rounded-full hover:bg-[#7FC7B3] transition-colors"
          >
            Gå til forsiden
          </Link>
          <Link
            href="/spil"
            className="px-6 py-3 bg-[#BAE1FF] text-white font-semibold rounded-full hover:bg-[#9BCFEF] transition-colors"
          >
            Se alle spil
          </Link>
        </div>
      </div>
    </div>
  );
}
