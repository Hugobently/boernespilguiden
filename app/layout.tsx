import type { Metadata, Viewport } from 'next';
import { Nunito, Baloo_2 } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/react';
import { Header, Footer, CookieConsent, BackToTop } from '@/components/layout';
import { GoogleAnalytics } from '@/components/tracking/GoogleAnalytics';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-nunito',
  preload: true,
});

// Display font til overskrifter ("Raffineret legende" 2026-redesign)
const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
  variable: '--font-baloo',
  preload: true,
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
    <html lang={locale} className={`${nunito.variable} ${baloo.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
          <BackToTop />
          {/* Vercel Web Analytics: cookieless page-view counting */}
          <Analytics />
          {/* GA4: loads only with NEXT_PUBLIC_GA_ID set and statistics consent */}
          <GoogleAnalytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
