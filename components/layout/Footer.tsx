import Link from 'next/link';
import { AGE_CATEGORIES } from '@/lib/utils';

export function Footer() {
  return (
    <footer className="bg-charcoal text-white mt-20">
      {/* Wave decoration */}
      <div className="relative">
        <svg
          className="absolute -top-1 left-0 w-full"
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
            fill="#2D3436"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🎮</span>
              <span className="font-display text-xl font-bold text-white">
                Børnespilguiden
              </span>
            </Link>
            <p className="text-slate text-sm">
              Din guide til de bedste spil for børn i alle aldre. Vi anmelder og anbefaler digitale spil og brætspil.
            </p>
          </div>

          {/* Digital Games */}
          <div>
            <h4 className="font-display text-lg font-bold mb-4 text-candy-cyan">
              🎮 Digitale Spil
            </h4>
            <ul className="space-y-2">
              {AGE_CATEGORIES.slice(0, 4).map((age) => (
                <li key={age.slug}>
                  <Link
                    href={`/spil/kategori/${age.slug}`}
                    className="text-slate hover:text-white transition-colors text-sm"
                  >
                    {age.emoji} {age.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Board Games */}
          <div>
            <h4 className="font-display text-lg font-bold mb-4 text-candy-orange">
              🎲 Brætspil
            </h4>
            <ul className="space-y-2">
              {AGE_CATEGORIES.slice(0, 4).map((age) => (
                <li key={age.slug}>
                  <Link
                    href={`/braetspil/kategori/${age.slug}`}
                    className="text-slate hover:text-white transition-colors text-sm"
                  >
                    {age.emoji} {age.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg font-bold mb-4 text-candy-pink">
              Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/om"
                  className="text-slate hover:text-white transition-colors text-sm"
                >
                  Om os
                </Link>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="text-slate hover:text-white transition-colors text-sm"
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <Link
                  href="/privatlivspolitik"
                  className="text-slate hover:text-white transition-colors text-sm"
                >
                  Privatlivspolitik
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate text-sm">
            © {new Date().getFullYear()} Børnespilguiden. Alle rettigheder forbeholdes.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-2xl hover:animate-wiggle cursor-pointer">🎮</span>
            <span className="text-2xl hover:animate-wiggle cursor-pointer">🎲</span>
            <span className="text-2xl hover:animate-wiggle cursor-pointer">🎯</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
