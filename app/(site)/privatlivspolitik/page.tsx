import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Footer } from '@/components/layout';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('privacy');
  return {
    title: t('metaTitle'),
    description: 'Read our privacy policy and how we protect your personal information.',
  };
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('privacy');

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#CDB4DB] to-[#B392C9] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-6xl mb-4 block">🔒</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
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
                <span>1.</span> Introduktion
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed">
                Hos Børnespilguiden tager vi dit privatliv alvorligt. Denne privatlivspolitik
                forklarer, hvordan vi indsamler, bruger og beskytter dine personoplysninger,
                når du besøger vores hjemmeside.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>2.</span> Dataansvarlig
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed">
                Børnespilguiden er dataansvarlig for behandlingen af de personoplysninger,
                som vi modtager om dig. Du kan kontakte os via:
              </p>
              <ul className="list-disc list-inside text-[#7A7A7A] mt-2 space-y-1">
                <li>Email: boernespislguiden@proton.me</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>3.</span> Hvilke oplysninger indsamler vi?
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed mb-4">
                Vi indsamler kun de oplysninger, der er nødvendige for at kunne tilbyde
                dig en god oplevelse på vores hjemmeside:
              </p>
              <div className="bg-[#F5F5F5] rounded-xl p-4 space-y-3">
                <div>
                  <strong className="text-[#4A4A4A]">Kontaktformular:</strong>
                  <p className="text-[#7A7A7A] text-sm">
                    Hvis du udfylder vores kontaktformular, gemmer vi dit navn, email
                    og din besked, så vi kan svare dig.
                  </p>
                </div>
                <div>
                  <strong className="text-[#4A4A4A]">Nyhedsbrev:</strong>
                  <p className="text-[#7A7A7A] text-sm">
                    Hvis du tilmelder dig vores nyhedsbrev, gemmer vi din email-adresse.
                  </p>
                </div>
                <div>
                  <strong className="text-[#4A4A4A]">Tekniske data:</strong>
                  <p className="text-[#7A7A7A] text-sm">
                    Vi indsamler anonyme statistikker om brug af siden (se vores cookiepolitik).
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>4.</span> Hvorfor indsamler vi data?
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed">
                Vi bruger dine oplysninger til:
              </p>
              <ul className="list-disc list-inside text-[#7A7A7A] mt-2 space-y-1">
                <li>At besvare dine henvendelser via kontaktformularen</li>
                <li>At sende dig nyhedsbrev, hvis du har tilmeldt dig</li>
                <li>At forbedre vores hjemmeside baseret på anonym brugsstatistik</li>
                <li>At huske dine præferencer (f.eks. cookie-samtykke)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>5.</span> Deling af data
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed">
                Vi sælger aldrig dine personoplysninger til tredjeparter. Vi deler kun
                data med betroede serviceudbydere, der hjælper os med at drive hjemmesiden
                (f.eks. hosting, email-service), og kun i det omfang det er nødvendigt.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>6.</span> Opbevaring af data
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed">
                Vi opbevarer dine personoplysninger så længe det er nødvendigt for det
                formål, de blev indsamlet til:
              </p>
              <ul className="list-disc list-inside text-[#7A7A7A] mt-2 space-y-1">
                <li>Kontaktformular-henvendelser: Slettes efter 12 måneder</li>
                <li>Nyhedsbrev-tilmeldinger: Opbevares indtil du afmelder dig</li>
                <li>Anonym statistik: Opbevares i op til 26 måneder</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>7.</span> Dine rettigheder
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed mb-4">
                Du har følgende rettigheder i henhold til GDPR:
              </p>
              <ul className="list-disc list-inside text-[#7A7A7A] space-y-1">
                <li><strong>Ret til indsigt:</strong> Du kan få at vide, hvilke oplysninger vi har om dig</li>
                <li><strong>Ret til berigtigelse:</strong> Du kan få rettet forkerte oplysninger</li>
                <li><strong>Ret til sletning:</strong> Du kan bede os om at slette dine data</li>
                <li><strong>Ret til begrænsning:</strong> Du kan begrænse, hvordan vi bruger dine data</li>
                <li><strong>Ret til dataportabilitet:</strong> Du kan få dine data udleveret</li>
                <li><strong>Ret til indsigelse:</strong> Du kan gøre indsigelse mod vores behandling</li>
              </ul>
              <p className="text-[#7A7A7A] leading-relaxed mt-4">
                Kontakt os på boernespislguiden@proton.me for at gøre brug af dine rettigheder.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>8.</span> Sikkerhed
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed">
                Vi bruger SSL-kryptering (HTTPS) på hele vores hjemmeside for at
                beskytte data i transit. Vi opbevarer data sikkert og begrænser
                adgangen til kun dem, der har behov for det.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>9.</span> Børns privatliv
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed">
                Vores hjemmeside er rettet mod voksne (forældre). Vi indsamler ikke
                bevidst personoplysninger fra børn under 13 år. Hvis du er forælder
                og opdager, at dit barn har delt personoplysninger med os, kontakt
                os venligst, så vi kan slette dem.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>10.</span> Ændringer til denne politik
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed">
                Vi kan opdatere denne privatlivspolitik fra tid til anden. Ved
                væsentlige ændringer vil vi informere dig via hjemmesiden.
                Datoen &quot;Sidst opdateret&quot; øverst på siden viser, hvornår politikken
                sidst blev ændret.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>11.</span> Klageadgang
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed">
                Hvis du mener, at vi ikke behandler dine personoplysninger korrekt,
                kan du klage til Datatilsynet:
              </p>
              <div className="bg-[#F5F5F5] rounded-xl p-4 mt-4 text-[#7A7A7A]">
                <p><strong>Datatilsynet</strong></p>
                <p>Carl Jacobsens Vej 35</p>
                <p>2500 Valby</p>
                <p>Telefon: 33 19 32 00</p>
                <p>Email: dt@datatilsynet.dk</p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E0E0E0]">
            <p className="text-[#7A7A7A] text-sm">
              Se også vores <Link href="/cookiepolitik" className="text-[#FFB5A7] hover:underline">cookiepolitik</Link> for
              information om, hvordan vi bruger cookies.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
