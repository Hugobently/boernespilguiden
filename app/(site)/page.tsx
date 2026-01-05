import Link from 'next/link';
import { Button, Card, CardContent } from '@/components/ui';
import { SearchBar } from '@/components/filters';
import { AGE_CATEGORIES } from '@/lib/utils';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-candy-pink/20 blob animate-float" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-candy-blue/20 blob-2 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-candy-yellow/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Floating emojis */}
            <div className="flex justify-center gap-4 mb-8">
              <span className="text-5xl animate-bounce-slow">🎮</span>
              <span className="text-5xl animate-bounce-slow stagger-2">🎲</span>
              <span className="text-5xl animate-bounce-slow stagger-4">🎯</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Find de{' '}
              <span className="gradient-text">perfekte spil</span>
              {' '}til dine børn
            </h1>

            <p className="text-lg sm:text-xl text-slate mb-8 max-w-2xl mx-auto">
              Børnespilguiden hjælper dig med at finde de bedste digitale spil og brætspil,
              tilpasset dit barns alder og interesser.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto mb-8">
              <SearchBar placeholder="Søg efter et spil..." />
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/spil">
                <Button variant="primary" size="lg">
                  🎮 Digitale Spil
                </Button>
              </Link>
              <Link href="/braetspil">
                <Button variant="secondary" size="lg">
                  🎲 Brætspil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Age Categories Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mb-4">
              Vælg aldersgruppe
            </h2>
            <p className="text-slate text-lg">
              Find spil der passer til dit barns alder
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {AGE_CATEGORIES.map((category, index) => (
              <Link
                key={category.slug}
                href={`/spil/kategori/${category.slug}`}
                className="animate-slide-up opacity-0"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'forwards',
                }}
              >
                <Card className="text-center h-full group" variant="elevated">
                  <CardContent className="py-8">
                    <span className="text-5xl sm:text-6xl block mb-4 group-hover:animate-wiggle">
                      {category.emoji}
                    </span>
                    <h3 className="font-display text-xl font-bold text-charcoal mb-1">
                      {category.label}
                    </h3>
                    <p className="text-sm text-slate">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Game Types Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Digital Games Card */}
            <Link href="/spil" className="group">
              <Card className="h-full overflow-hidden" variant="elevated">
                <div className="relative aspect-[16/10] bg-gradient-to-br from-candy-blue via-candy-cyan to-candy-green">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-9xl group-hover:animate-float">🎮</span>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/20 blob" />
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/20 blob-2" />
                </div>
                <CardContent>
                  <h3 className="font-display text-2xl font-bold text-charcoal mb-2 group-hover:text-candy-blue transition-colors">
                    Digitale Spil
                  </h3>
                  <p className="text-slate">
                    Computerspil, mobilspil og apps til alle platforme
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Board Games Card */}
            <Link href="/braetspil" className="group">
              <Card className="h-full overflow-hidden" variant="elevated">
                <div className="relative aspect-[16/10] bg-gradient-to-br from-candy-orange via-candy-yellow to-candy-pink">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-9xl group-hover:animate-float">🎲</span>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/20 blob" />
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/20 blob-2" />
                </div>
                <CardContent>
                  <h3 className="font-display text-2xl font-bold text-charcoal mb-2 group-hover:text-candy-orange transition-colors">
                    Brætspil
                  </h3>
                  <p className="text-slate">
                    Klassiske og moderne brætspil til hele familien
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-candy-purple via-candy-pink to-candy-orange p-1">
            <div className="bg-white rounded-[1.75rem] p-8 sm:p-12 text-center">
              <span className="text-5xl block mb-4">🎯</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-4">
                Kan du ikke finde det rigtige spil?
              </h2>
              <p className="text-slate mb-6 max-w-xl mx-auto">
                Brug vores søgefunktion til at finde præcis det spil du leder efter
              </p>
              <Link href="/soeg">
                <Button size="lg">
                  Søg efter spil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
