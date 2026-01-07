import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('cookies');
  return {
    title: t('metaTitle'),
    description: 'Learn about our use of cookies and how you can manage them.',
  };
}

export default async function CookiePolicyPage() {
  const t = await getTranslations('cookies');

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#FFE66D] to-[#FFD93D] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-6xl mb-4 block">🍪</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#7D6608] mb-4">
            {t('pageTitle')}
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]">
          <p className="text-[#7A7A7A] mb-6">
            <strong>Sidst opdateret:</strong> Januar 2025
          </p>

          <div className="prose prose-lg max-w-none text-[#4A4A4A]">
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>🤔</span> Hvad er cookies?
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed">
                Cookies er små tekstfiler, som gemmes på din computer, tablet eller
                smartphone, når du besøger en hjemmeside. Cookies bruges til at få
                hjemmesider til at fungere, huske dine præferencer og indsamle
                statistik om brugen af siden.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>📋</span> Hvilke cookies bruger vi?
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed mb-4">
                Vi bruger følgende typer af cookies på Børnespilguiden:
              </p>

              {/* Necessary cookies */}
              <div className="bg-[#BAFFC9]/20 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">✅</span>
                  <h3 className="font-bold text-[#2D6A4F]">Nødvendige cookies</h3>
                </div>
                <p className="text-[#7A7A7A] text-sm mb-3">
                  Disse cookies er nødvendige for at hjemmesiden kan fungere korrekt.
                  De kan ikke slås fra.
                </p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2D6A4F]/20">
                      <th className="text-left py-2 text-[#2D6A4F]">Cookie</th>
                      <th className="text-left py-2 text-[#2D6A4F]">Formål</th>
                      <th className="text-left py-2 text-[#2D6A4F]">Varighed</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#7A7A7A]">
                    <tr className="border-b border-[#2D6A4F]/10">
                      <td className="py-2">cookie_consent</td>
                      <td className="py-2">Husker dit cookie-samtykke</td>
                      <td className="py-2">1 år</td>
                    </tr>
                    <tr>
                      <td className="py-2">session_id</td>
                      <td className="py-2">Holder din session aktiv</td>
                      <td className="py-2">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Analytics cookies */}
              <div className="bg-[#BAE1FF]/20 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📊</span>
                  <h3 className="font-bold text-[#1D4E89]">Statistik-cookies</h3>
                </div>
                <p className="text-[#7A7A7A] text-sm mb-3">
                  Disse cookies hjælper os med at forstå, hvordan besøgende bruger
                  vores hjemmeside, så vi kan forbedre den.
                </p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1D4E89]/20">
                      <th className="text-left py-2 text-[#1D4E89]">Cookie</th>
                      <th className="text-left py-2 text-[#1D4E89]">Formål</th>
                      <th className="text-left py-2 text-[#1D4E89]">Varighed</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#7A7A7A]">
                    <tr className="border-b border-[#1D4E89]/10">
                      <td className="py-2">analytics_session</td>
                      <td className="py-2">Anonym brugsstatistik</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr>
                      <td className="py-2">_ga (hvis aktiveret)</td>
                      <td className="py-2">Google Analytics</td>
                      <td className="py-2">2 år</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Preference cookies */}
              <div className="bg-[#E2C2FF]/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">⚙️</span>
                  <h3 className="font-bold text-[#5B4670]">Præference-cookies</h3>
                </div>
                <p className="text-[#7A7A7A] text-sm mb-3">
                  Disse cookies husker dine valg og præferencer for at give dig
                  en bedre oplevelse.
                </p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#5B4670]/20">
                      <th className="text-left py-2 text-[#5B4670]">Cookie</th>
                      <th className="text-left py-2 text-[#5B4670]">Formål</th>
                      <th className="text-left py-2 text-[#5B4670]">Varighed</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#7A7A7A]">
                    <tr>
                      <td className="py-2">user_preferences</td>
                      <td className="py-2">Husker dine filtervalg</td>
                      <td className="py-2">30 dage</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>🔧</span> Sådan administrerer du cookies
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed mb-4">
                Du kan til enhver tid ændre eller tilbagetrække dit samtykke til
                cookies (undtagen de nødvendige).
              </p>
              <div className="bg-[#F5F5F5] rounded-xl p-4 space-y-3">
                <div>
                  <strong className="text-[#4A4A4A]">I din browser:</strong>
                  <p className="text-[#7A7A7A] text-sm">
                    De fleste browsere giver dig mulighed for at blokere eller slette
                    cookies via indstillingerne. Se din browsers hjælp for vejledning.
                  </p>
                </div>
                <div>
                  <strong className="text-[#4A4A4A]">Slet eksisterende cookies:</strong>
                  <p className="text-[#7A7A7A] text-sm">
                    Du kan til enhver tid slette cookies, der allerede er gemt på
                    din enhed, via din browsers indstillinger.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>🌐</span> Browserindstillinger
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed mb-4">
                Her er links til cookie-indstillinger for de mest populære browsere:
              </p>
              <ul className="space-y-2 text-[#7A7A7A]">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFB5A7] hover:underline"
                  >
                    Google Chrome →
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/da/kb/slet-cookies-fjerne-oplysninger-websteder-har-gemt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFB5A7] hover:underline"
                  >
                    Mozilla Firefox →
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/da-dk/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFB5A7] hover:underline"
                  >
                    Safari →
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/da-dk/microsoft-edge/slet-cookies-i-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFB5A7] hover:underline"
                  >
                    Microsoft Edge →
                  </a>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>🔄</span> Opdateringer
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed">
                Vi kan opdatere denne cookiepolitik fra tid til anden. Hvis vi
                foretager væsentlige ændringer, vil vi informere dig via
                hjemmesiden. Tjek &quot;Sidst opdateret&quot; datoen øverst for at se,
                hvornår politikken sidst blev ændret.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>❓</span> Spørgsmål?
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed">
                Har du spørgsmål til vores brug af cookies, er du velkommen til
                at kontakte os på{' '}
                <a
                  href="mailto:boernespislguiden@proton.me"
                  className="text-[#FFB5A7] hover:underline"
                >
                  boernespislguiden@proton.me
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E0E0E0]">
            <p className="text-[#7A7A7A] text-sm">
              Se også vores{' '}
              <Link href="/privatlivspolitik" className="text-[#FFB5A7] hover:underline">
                privatlivspolitik
              </Link>{' '}
              for information om, hvordan vi behandler dine personoplysninger.
            </p>
          </div>
        </div>
      </main>

    </div>
  );
}
