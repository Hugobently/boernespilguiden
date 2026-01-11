import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#FFB5A7] to-[#F8A99B] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-6xl mb-4 block">👋</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('pageTitle')}
          </h1>
          <p className="text-xl text-white/90">
            {t('pageSubtitle')}
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission */}
        <section className="mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]">
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              {t('missionTitle')}
            </h2>
            <p className="text-[#7A7A7A] leading-relaxed mb-4">
              {t('missionText1')}
            </p>
            <p className="text-[#7A7A7A] leading-relaxed">
              {t('missionText2')}
            </p>
          </div>
        </section>

        {/* What we do */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-6 flex items-center gap-3">
            <span className="text-3xl">✨</span>
            {t('whatWeDoTitle')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#BAFFC9]/20 rounded-2xl p-6">
              <span className="text-4xl mb-3 block">🎮</span>
              <h3 className="font-bold text-[#2D6A4F] mb-2">{t('digitalGamesTitle')}</h3>
              <p className="text-[#7A7A7A] text-sm">
                {t('digitalGamesDesc')}
              </p>
            </div>
            <div className="bg-[#BAE1FF]/20 rounded-2xl p-6">
              <span className="text-4xl mb-3 block">🎲</span>
              <h3 className="font-bold text-[#1D4E89] mb-2">{t('boardGamesTitle')}</h3>
              <p className="text-[#7A7A7A] text-sm">
                {t('boardGamesDesc')}
              </p>
            </div>
            <div className="bg-[#FFD1DC]/20 rounded-2xl p-6">
              <span className="text-4xl mb-3 block">👨‍👩‍👧‍👦</span>
              <h3 className="font-bold text-[#8B4563] mb-2">{t('parentFocusTitle')}</h3>
              <p className="text-[#7A7A7A] text-sm">
                {t('parentFocusDesc')}
              </p>
            </div>
            <div className="bg-[#E2C2FF]/20 rounded-2xl p-6">
              <span className="text-4xl mb-3 block">📚</span>
              <h3 className="font-bold text-[#5B4670] mb-2">{t('ageAdaptedTitle')}</h3>
              <p className="text-[#7A7A7A] text-sm">
                {t('ageAdaptedDesc')}
              </p>
            </div>
          </div>
        </section>

        {/* Our values */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-[#A2D2FF]/30 to-[#CDB4DB]/30 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-6 flex items-center gap-3">
              <span className="text-3xl">💝</span>
              {t('valuesTitle')}
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-xl">🔍</span>
                <div>
                  <strong className="text-[#4A4A4A]">{t('honestyTitle')}:</strong>
                  <span className="text-[#7A7A7A]"> {t('honestyDesc')}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🛡️</span>
                <div>
                  <strong className="text-[#4A4A4A]">{t('safetyTitle')}:</strong>
                  <span className="text-[#7A7A7A]"> {t('safetyDesc')}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🎓</span>
                <div>
                  <strong className="text-[#4A4A4A]">{t('learningTitle')}:</strong>
                  <span className="text-[#7A7A7A]"> {t('learningDesc')}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🌍</span>
                <div>
                  <strong className="text-[#4A4A4A]">{t('perspectiveTitle')}:</strong>
                  <span className="text-[#7A7A7A]"> {t('perspectiveDesc')}</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]">
            <span className="text-5xl mb-4 block">💬</span>
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4">
              {t('contactTitle')}
            </h2>
            <p className="text-[#7A7A7A] mb-4">
              {t('contactText')}
            </p>
            <p className="text-[#7A7A7A] mb-6">
              <span className="mr-2">📧</span>
              <a
                href="mailto:boernespilguiden@proton.me"
                className="text-[#1D4E89] font-medium hover:underline"
              >
                boernespilguiden@proton.me
              </a>
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFB5A7] text-white font-semibold hover:bg-[#F8A99B] transition-colors"
            >
              <span>{t('contactButton')}</span>
              <span>→</span>
            </Link>
          </div>
        </section>
      </main>

    </div>
  );
}
