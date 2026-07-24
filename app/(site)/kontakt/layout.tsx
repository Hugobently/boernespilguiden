import { Metadata } from 'next';
import { buildOpenGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Kontakt os',
  description:
    'Har du spørgsmål, forslag eller feedback? Kontakt Børnespilguiden - vi svarer normalt inden for 2-3 hverdage.',
  alternates: {
    canonical: '/kontakt',
  },
  openGraph: buildOpenGraph({
    title: 'Kontakt os | Børnespilguiden',
    description:
      'Har du spørgsmål, forslag eller feedback? Kontakt Børnespilguiden - vi svarer normalt inden for 2-3 hverdage.',
    url: '/kontakt',
  }),
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
