import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sådan tester vi spil',
  description:
    'Se hvordan Børnespilguiden vurderer spil til børn: reklamer, købspres, datasikkerhed, dansk sprog, aldersvurdering og læringsværdi. Ærlige anmeldelser uden betalte placeringer.',
  alternates: {
    canonical: '/saadan-tester-vi',
  },
};

const criteria = [
  {
    emoji: '🚫',
    title: 'Reklamer',
    color: 'bg-[#FFD1DC]/20',
    titleColor: 'text-[#8B4563]',
    text: 'Vi tjekker, om spillet viser reklamer – og især om de kan lokke børn videre til andre apps eller butikker. Reklamefri spil fremhæves tydeligt med et badge.',
  },
  {
    emoji: '💳',
    title: 'Køb og købspres',
    color: 'bg-[#BAFFC9]/20',
    titleColor: 'text-[#2D6A4F]',
    text: 'Kan der købes noget inde i spillet? Vi noterer altid in-app køb og vurderer, hvor aggressivt spillet presser på – fx med nedtællinger, "tilbud" eller låst indhold midt i legen.',
  },
  {
    emoji: '🔒',
    title: 'Datasikkerhed',
    color: 'bg-[#BAE1FF]/20',
    titleColor: 'text-[#1D4E89]',
    text: 'Vi ser på, hvilke data spillet indsamler, om der kræves konto, og om spillet kan bruges offline. Jo mindre data om dit barn, jo bedre.',
  },
  {
    emoji: '🇩🇰',
    title: 'Dansk sprog',
    color: 'bg-[#FFE66D]/20',
    titleColor: 'text-[#7A6206]',
    text: 'Findes spillet på dansk – med tale, tekst eller begge dele? Det betyder meget for de mindste, så spil med dansk sprog markeres med flag.',
  },
  {
    emoji: '🎯',
    title: 'Aldersvurdering',
    color: 'bg-[#E2C2FF]/20',
    titleColor: 'text-[#5B4670]',
    text: 'Vi vurderer selv, hvilke aldre spillet reelt passer til – ud fra sværhedsgrad, læsekrav, tempo og indhold. Vores vurdering kan afvige fra butikkernes officielle aldersgrænser.',
  },
  {
    emoji: '📚',
    title: 'Læring og kvalitet',
    color: 'bg-[#B8E0D2]/20',
    titleColor: 'text-[#2D6A4F]',
    text: 'Hvad træner spillet – sprog, logik, motorik, samarbejde? Og er det overhovedet sjovt? Et spil, børn ikke gider, lærer de ingenting af.',
  },
];

const steps = [
  {
    emoji: '🔎',
    title: 'Udvælgelse',
    text: 'Vi leder efter spil, der har udmærket sig: prisvindere (fx Spiel des Jahres, Guldbrikken og Apple Design Awards), anerkendte udgivere og anbefalinger fra forældre og fagfolk. Spil kommer aldrig på siden, fordi nogen har betalt for det.',
  },
  {
    emoji: '🕹️',
    title: 'Afprøvning og research',
    text: 'Vi undersøger spillet grundigt: gameplay, butikssider, udgiverens oplysninger om reklamer, køb og data – og afprøver spillet, hvor det er muligt. Alle butikslinks kontrolleres, så de peger på det rigtige spil.',
  },
  {
    emoji: '📝',
    title: 'Vurdering og anmeldelse',
    text: 'Spillet vurderes op imod alle kriterierne ovenfor og får en samlet vurdering fra 1 til 5 stjerner. Anmeldelsen skrives, så du hurtigt kan se både fordele og ulemper – vi nævner altid begge dele.',
  },
  {
    emoji: '🔄',
    title: 'Løbende vedligeholdelse',
    text: 'Spil ændrer sig: priser stiger, apps skifter ejer, og nogle forsvinder helt fra butikkerne. Vi gennemgår løbende hele kataloget og fjerner spil, der ikke længere kan fås – så du ikke spilder tiden på at lede efter dem.',
  },
];

export default function HowWeTestPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#A2D2FF] to-[#8FC4F5] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-6xl mb-4 block">🔍</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Sådan tester vi
          </h1>
          <p className="text-xl text-white/90">
            Ærlige vurderinger efter faste kriterier – aldrig betalte anmeldelser
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <section className="mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]">
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              Hvad vi kigger efter
            </h2>
            <p className="text-[#7A7A7A] leading-relaxed mb-4">
              Alle spil på Børnespilguiden vurderes efter de samme seks kriterier.
              Målet er, at du på få sekunder kan se, om et spil er trygt og passer
              til dit barn – uden selv at skulle grave i butikkernes småtekst.
            </p>
            <p className="text-[#7A7A7A] leading-relaxed">
              Vi anmelder både digitale spil (apps, konsol og pc) og brætspil.
              Kriterierne er de samme, men for brætspil ser vi også på regler,
              spilletid og hvor let spillet er at gå til for familien.
            </p>
          </div>
        </section>

        {/* Criteria */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-6 flex items-center gap-3">
            <span className="text-3xl">✅</span>
            De seks kriterier
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {criteria.map((c) => (
              <div key={c.title} className={`${c.color} rounded-2xl p-6`}>
                <span className="text-4xl mb-3 block">{c.emoji}</span>
                <h3 className={`font-bold ${c.titleColor} mb-2`}>{c.title}</h3>
                <p className="text-[#7A7A7A] text-sm">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-6 flex items-center gap-3">
            <span className="text-3xl">🛤️</span>
            Fra spil til anmeldelse
          </h2>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] flex items-start gap-4"
              >
                <span className="text-3xl shrink-0">{step.emoji}</span>
                <div>
                  <h3 className="font-bold text-[#4A4A4A] mb-1">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="text-[#7A7A7A] text-sm leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Star scale */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-[#FFE66D]/30 to-[#FFB5A7]/30 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-6 flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              Sådan skal stjernerne læses
            </h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <strong className="text-[#4A4A4A] shrink-0 w-24">5 stjerner:</strong>
                <span className="text-[#7A7A7A]">Fremragende – trygt, gennemarbejdet og noget særligt. Køb det med det samme.</span>
              </li>
              <li className="flex items-start gap-3">
                <strong className="text-[#4A4A4A] shrink-0 w-24">4 stjerner:</strong>
                <span className="text-[#7A7A7A]">Rigtig godt – små skønhedsfejl, men klart anbefalelsesværdigt.</span>
              </li>
              <li className="flex items-start gap-3">
                <strong className="text-[#4A4A4A] shrink-0 w-24">3 stjerner:</strong>
                <span className="text-[#7A7A7A]">Godt – fungerer fint, men har mangler, du bør kende på forhånd.</span>
              </li>
              <li className="flex items-start gap-3">
                <strong className="text-[#4A4A4A] shrink-0 w-24">1-2 stjerner:</strong>
                <span className="text-[#7A7A7A]">Anbefales ikke – spil med den slags problemer optager vi som udgangspunkt slet ikke i guiden.</span>
              </li>
            </ul>
            <p className="text-[#7A7A7A] text-sm mt-6">
              Spil markeret med <strong className="text-[#4A4A4A]">Redaktørens valg</strong> er
              vores personlige topvalg i deres kategori.
            </p>
          </div>
        </section>

        {/* Independence */}
        <section className="mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]">
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-3">
              <span className="text-3xl">🤝</span>
              Uafhængighed
            </h2>
            <p className="text-[#7A7A7A] leading-relaxed mb-4">
              Børnespilguiden modtager ikke betaling fra spiludgivere, og ingen
              anmeldelser er sponsoreret. Links til App Store, Google Play og
              webshops er en service, så du hurtigt kan finde spillet – vi tjener
              i øjeblikket ikke kommission på dem.
            </p>
            <p className="text-[#7A7A7A] leading-relaxed">
              Skulle det ændre sig, vil det blive markeret tydeligt her på siden.
            </p>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]">
            <span className="text-5xl mb-4 block">💬</span>
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4">
              Fundet en fejl – eller et spil, vi bør teste?
            </h2>
            <p className="text-[#7A7A7A] mb-6">
              Vi bliver glade for både ris, ros og forslag til nye spil.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#A2D2FF] text-white font-semibold hover:bg-[#8FC4F5] transition-colors"
            >
              <span>Skriv til os</span>
              <span>→</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
