import type { Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Børnespilguiden - De bedste spil til børn',
    template: '%s | Børnespilguiden',
  },
  description:
    'Find de bedste digitale spil og brætspil til børn i alle aldre. Anmeldelser, anbefalinger og guides til forældre.',
  keywords: [
    'børnespil',
    'spil til børn',
    'brætspil',
    'digitale spil',
    'computerspil',
    'familiespil',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
