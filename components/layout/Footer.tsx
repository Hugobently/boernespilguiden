import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';
import { FoxFace } from '@/components/brand/FoxMascot';
import { Icon, type IconName } from '@/components/ui/Icon';

// ============================================================================
// AGE GROUP CONFIG
// ============================================================================

const ageCategories: Array<{
  slug: string;
  labelKey: string;
  icon: IconName;
  color: string;
}> = [
  { slug: '0-3', labelKey: '0-3', icon: 'blocks', color: 'hover:text-[#FFD1DC]' },
  { slug: '3-6', labelKey: '3-6', icon: 'kite', color: 'hover:text-[#BAFFC9]' },
  { slug: '7+', labelKey: '7+', icon: 'rocket', color: 'hover:text-[#BAE1FF]' },
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
      <div className="w-12 h-12 flex items-center justify-center transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
        <FoxFace className="w-11 h-11" />
      </div>
      <div>
        <span className="font-display font-bold text-xl text-white block">
          Børnespilguiden
        </span>
        <span className="text-sm text-[#6B7280]">
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
  icon: IconName;
  titleColor: string;
  links: Array<{
    href: string;
    label: string;
    icon?: IconName;
    hoverColor?: string;
  }>;
}

function FooterLinkSection({ title, icon, titleColor, links }: FooterLinkSectionProps) {
  return (
    <div>
      <h4 className={cn('font-bold text-lg mb-4 flex items-center gap-2', titleColor)}>
        <Icon name={icon} className="w-5 h-5" />
        <span>{title}</span>
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'text-[#9C948A] hover:text-white transition-colors text-sm flex items-center gap-2',
                link.hoverColor
              )}
            >
              {link.icon && <Icon name={link.icon} className="w-4 h-4 opacity-70" />}
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// FOOTER COMPONENT (Server Component)
// ============================================================================

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const t = await getTranslations();

  return (
    <footer className="relative bg-[#2B2620] text-white mt-20">
      {/* Decorative wave */}
      <FooterWave />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand & description */}
          <div className="lg:col-span-1">
            <FooterLogo />
            <p className="text-[#9C948A] text-sm mt-4 leading-relaxed">
              {t('home.heroDescription')}
            </p>
          </div>

          {/* Digital games */}
          <FooterLinkSection
            title={t('footer.digitalGames')}
            icon="gamepad"
            titleColor="text-[#A2D2FF]"
            links={ageCategories.map((age) => ({
              href: `/spil/kategori/${age.slug}`,
              label: t(`ageGroups.${age.labelKey}`),
              icon: age.icon,
              hoverColor: age.color,
            }))}
          />

          {/* Board games */}
          <FooterLinkSection
            title={t('footer.boardGames')}
            icon="dice"
            titleColor="text-[#FFE66D]"
            links={ageCategories.map((age) => ({
              href: `/braetspil/kategori/${age.slug}`,
              label: t(`ageGroups.${age.labelKey}`),
              icon: age.icon,
              hoverColor: age.color,
            }))}
          />

          {/* Popular topics */}
          <FooterLinkSection
            title={t('footer.topics')}
            icon="star"
            titleColor="text-[#B8E0D2]"
            links={[
              { href: '/spil/uden-reklamer', label: 'Spil uden reklamer', icon: 'shield' },
              { href: '/spil/gratis', label: 'Gratis spil', icon: 'check' },
              { href: '/spil/emne/laeringsspil', label: 'Læringsspil', icon: 'book' },
              { href: '/spil/offline', label: 'Offline spil', icon: 'gamepad' },
              { href: '/spil/paa-dansk', label: 'Spil på dansk' },
            ]}
          />

          {/* Quick links */}
          <FooterLinkSection
            title={t('footer.information')}
            icon="info"
            titleColor="text-[#FFB5A7]"
            links={[
              { href: '/om', label: t('nav.about'), icon: 'smile' },
              { href: '/saadan-tester-vi', label: 'Sådan tester vi', icon: 'search' },
              { href: '/kontakt', label: t('nav.contact') },
              { href: '/privatlivspolitik', label: t('nav.privacy') },
              { href: '/cookiepolitik', label: t('nav.cookies') },
            ]}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          {/* Copyright */}
          <p className="text-[#9C948A] text-sm text-center">
            © {currentYear} Børnespilguiden. {t('footer.copyright')}
          </p>
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
