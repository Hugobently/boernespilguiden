'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

// ============================================================================
// AGE GROUP CONFIG
// ============================================================================

const ageCategories = [
  { slug: '0-3', labelKey: '0-3', emoji: '👶', color: 'hover:text-[#FFD1DC]' },
  { slug: '3-6', labelKey: '3-6', emoji: '🧒', color: 'hover:text-[#BAFFC9]' },
  { slug: '7-10', labelKey: '7-10', emoji: '👦', color: 'hover:text-[#BAE1FF]' },
  { slug: '11-15', labelKey: '11-15', emoji: '🧑', color: 'hover:text-[#E2C2FF]' },
];

// ============================================================================
// FOOTER WAVE SVG
// ============================================================================

function FooterWave() {
  return (
    <svg
      className="absolute -top-px left-0 w-full h-8 md:h-12"
      viewBox="0 0 1440 48"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0 48V24C120 8 240 0 360 8C480 16 600 32 720 32C840 32 960 16 1080 8C1200 0 1320 8 1440 24V48H0Z"
        fill="#4A4A4A"
      />
    </svg>
  );
}

// ============================================================================
// FOOTER LOGO
// ============================================================================

function FooterLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFB5A7] to-[#F8A99B] flex items-center justify-center shadow-[0_4px_0_0_#E8958A] group-hover:shadow-[0_2px_0_0_#E8958A] group-hover:translate-y-0.5 transition-all">
        <span className="text-2xl">🎮</span>
      </div>
      <div>
        <span className="font-bold text-xl text-white block">
          Børnespilguiden
        </span>
        <span className="text-sm text-[#9CA3AF]">
          De bedste spil til børn
        </span>
      </div>
    </Link>
  );
}

// ============================================================================
// FOOTER LINK SECTION
// ============================================================================

interface FooterLinkSectionProps {
  title: string;
  emoji: string;
  titleColor: string;
  links: Array<{
    href: string;
    label: string;
    emoji?: string;
    hoverColor?: string;
  }>;
}

function FooterLinkSection({ title, emoji, titleColor, links }: FooterLinkSectionProps) {
  return (
    <div>
      <h4 className={cn('font-bold text-lg mb-4 flex items-center gap-2', titleColor)}>
        <span>{emoji}</span>
        <span>{title}</span>
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'text-[#9CA3AF] hover:text-white transition-colors text-sm flex items-center gap-2',
                link.hoverColor
              )}
            >
              {link.emoji && <span>{link.emoji}</span>}
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// SOCIAL ICONS (Playful bouncing)
// ============================================================================

function SocialIcons() {
  const icons = [
    { emoji: '🎮', label: 'Spil' },
    { emoji: '🎲', label: 'Brætspil' },
    { emoji: '🎯', label: 'Puslespil' },
    { emoji: '🧩', label: 'Læring' },
  ];

  return (
    <div className="flex items-center gap-3">
      {icons.map((icon, index) => (
        <div
          key={icon.label}
          className="text-2xl cursor-pointer hover:scale-125 transition-transform"
          style={{ animationDelay: `${index * 100}ms` }}
          title={icon.label}
        >
          {icon.emoji}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// NEWSLETTER SIGNUP (Optional decorative)
// ============================================================================

function NewsletterSignup() {
  const t = useTranslations('footer');

  return (
    <div className="bg-[#3D3D3D] rounded-2xl p-6">
      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
        <span>📬</span>
        <span>{t('newsletter')}</span>
      </h4>
      <p className="text-[#9CA3AF] text-sm mb-4">
        {t('newsletterDesc')}
      </p>
      <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder={t('emailPlaceholder')}
          className={cn(
            'flex-1 px-4 py-2.5 rounded-xl',
            'bg-[#4A4A4A] border border-[#5A5A5A]',
            'text-white placeholder:text-[#7A7A7A]',
            'focus:outline-none focus:border-[#FFB5A7]',
            'transition-colors text-sm'
          )}
        />
        <button
          type="submit"
          className={cn(
            'px-4 py-2.5 rounded-xl',
            'bg-gradient-to-b from-[#FFB5A7] to-[#F8A99B]',
            'text-white font-semibold text-sm',
            'shadow-[0_4px_0_0_#E8958A]',
            'hover:shadow-[0_2px_0_0_#E8958A] hover:translate-y-0.5',
            'active:shadow-none active:translate-y-1',
            'transition-all'
          )}
        >
          {t('subscribe')}
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations();

  return (
    <footer className="relative bg-[#4A4A4A] text-white mt-20">
      {/* Decorative wave */}
      <FooterWave />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & description */}
          <div className="lg:col-span-1">
            <FooterLogo />
            <p className="text-[#9CA3AF] text-sm mt-4 leading-relaxed">
              {t('home.heroDescription')}
            </p>
          </div>

          {/* Digital games */}
          <FooterLinkSection
            title={t('footer.digitalGames')}
            emoji="🎮"
            titleColor="text-[#A2D2FF]"
            links={ageCategories.map((age) => ({
              href: `/spil?alder=${age.slug}`,
              label: t(`ageGroups.${age.labelKey}`),
              emoji: age.emoji,
              hoverColor: age.color,
            }))}
          />

          {/* Board games */}
          <FooterLinkSection
            title={t('footer.boardGames')}
            emoji="🎲"
            titleColor="text-[#FFE66D]"
            links={ageCategories.map((age) => ({
              href: `/braetspil?alder=${age.slug}`,
              label: t(`ageGroups.${age.labelKey}`),
              emoji: age.emoji,
              hoverColor: age.color,
            }))}
          />

          {/* Quick links */}
          <FooterLinkSection
            title={t('footer.information')}
            emoji="📋"
            titleColor="text-[#FFB5A7]"
            links={[
              { href: '/om', label: t('nav.about'), emoji: '👋' },
              { href: '/kontakt', label: t('nav.contact'), emoji: '✉️' },
              { href: '/privatlivspolitik', label: t('nav.privacy'), emoji: '🔒' },
              { href: '/cookiepolitik', label: t('nav.cookies'), emoji: '🍪' },
            ]}
          />
        </div>

        {/* Newsletter section */}
        <div className="mb-12">
          <NewsletterSignup />
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-[#9CA3AF] text-sm text-center sm:text-left">
              © {currentYear} Børnespilguiden. {t('footer.copyright')}
            </p>

            {/* Playful icons */}
            <SocialIcons />
          </div>
        </div>

        {/* Fun decorative elements */}
        <div className="mt-8 flex justify-center gap-4 opacity-30">
          <div className="w-2 h-2 rounded-full bg-[#FFB5A7]" />
          <div className="w-2 h-2 rounded-full bg-[#B8E0D2]" />
          <div className="w-2 h-2 rounded-full bg-[#A2D2FF]" />
          <div className="w-2 h-2 rounded-full bg-[#FFE66D]" />
          <div className="w-2 h-2 rounded-full bg-[#CDB4DB]" />
        </div>
      </div>
    </footer>
  );
}
