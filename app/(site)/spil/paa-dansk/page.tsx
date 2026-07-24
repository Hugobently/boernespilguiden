import { Metadata } from 'next';
import { getCuratedTopic } from '@/lib/topics';
import { buildOpenGraph } from '@/lib/seo';
import { TopicLandingPage } from '../topic-landing';

const topic = getCuratedTopic('paa-dansk')!;

export const metadata: Metadata = {
  title: topic.title,
  description: topic.metaDescription,
  alternates: {
    canonical: topic.path,
  },
  openGraph: buildOpenGraph({
    title: topic.title,
    description: topic.metaDescription,
    url: topic.path,
  }),
};

export default function DanishGamesPage() {
  return <TopicLandingPage topic={topic} />;
}
