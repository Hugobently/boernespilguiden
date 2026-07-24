import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORY_TOPICS, getCategoryTopic } from '@/lib/topics';
import { buildOpenGraph } from '@/lib/seo';
import { TopicLandingPage } from '../../topic-landing';

interface PageProps {
  params: Promise<{ emne: string }>;
}

export function generateStaticParams() {
  return CATEGORY_TOPICS.map((t) => ({ emne: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { emne } = await params;
  const topic = getCategoryTopic(emne);

  if (!topic) {
    return { title: 'Emnet blev ikke fundet' };
  }

  return {
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
}

export default async function TopicPage({ params }: PageProps) {
  const { emne } = await params;
  const topic = getCategoryTopic(emne);

  if (!topic) notFound();

  return <TopicLandingPage topic={topic} />;
}
