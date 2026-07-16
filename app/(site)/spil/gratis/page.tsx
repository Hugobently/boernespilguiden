import { Metadata } from 'next';
import { getCuratedTopic } from '@/lib/topics';
import { TopicLandingPage } from '../topic-landing';

const topic = getCuratedTopic('gratis')!;

export const metadata: Metadata = {
  title: topic.title,
  description: topic.metaDescription,
  alternates: {
    canonical: topic.path,
  },
  openGraph: {
    title: topic.title,
    description: topic.metaDescription,
  },
};

export default function FreeGamesPage() {
  return <TopicLandingPage topic={topic} />;
}
