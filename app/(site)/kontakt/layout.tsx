import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakt os',
  description:
    'Har du spørgsmål, forslag eller feedback? Kontakt Børnespilguiden - vi svarer normalt inden for 1-2 hverdage.',
  openGraph: {
    title: 'Kontakt os | Børnespilguiden',
    description:
      'Har du spørgsmål, forslag eller feedback? Kontakt Børnespilguiden - vi svarer normalt inden for 1-2 hverdage.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
