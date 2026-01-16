import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Header, Footer, DecorativeFrame, CookieConsent } from '@/components/layout';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-nunito',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xn--brnespilguiden-qqb.dk';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Børnespilguiden - De bedste spil til børn',
    template: '%s | Børnespilguiden',
  },
  description:
    'Find de bedste digitale spil og brætspil til børn i alle aldre. Ærlige anmeldelser med fokus på sikkerhed, læring og sjov. Reklamefri guide til forældre.',
  keywords: [
    'børnespil',
    'spil til børn',
    'brætspil',
    'brætspil til børn',
    'digitale spil',
    'computerspil',
    'familiespil',
    'børnevenlige spil',
    'læringsspil',
    'læringsspil til børn',
    'reklamefri spil',
    'apps til børn',
    'gratis spil til børn',
    'sikre apps til børn',
    'iPad spil børn',
    'spil uden reklamer',
    'bedste børnespil',
    'anmeldelser børnespil',
  ],
  authors: [{ name: 'Børnespilguiden' }],
  creator: 'Børnespilguiden',
  publisher: 'Børnespilguiden',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'da_DK',
    url: siteUrl,
    siteName: 'Børnespilguiden',
    title: 'Børnespilguiden - De bedste spil til børn',
    description:
      'Find de bedste digitale spil og brætspil til børn i alle aldre. Ærlige anmeldelser med fokus på sikkerhed, læring og sjov.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Børnespilguiden - Find de bedste spil til dine børn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Børnespilguiden - De bedste spil til børn',
    description:
      'Find de bedste digitale spil og brætspil til børn. Ærlige anmeldelser med fokus på sikkerhed og læring.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'games',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFDF8' },
    { media: '(prefers-color-scheme: dark)', color: '#FFFDF8' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={nunito.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <DecorativeFrame />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
