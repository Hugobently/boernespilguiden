// DR Import Service

import { prisma } from '@/lib/db';
import { DR_CHILDREN_SERIES, type DRSeries } from '@/lib/dr-data';
import { getDRImageUrl, getDRSeriesUrl } from '@/lib/dr-images';

export async function importAllDRSeries(): Promise<number> {
  let imported = 0;

  for (const series of DR_CHILDREN_SERIES) {
    try {
      await prisma.media.upsert({
        where: { drEntityId: series.entityId },
        update: {
          title: series.title,
          slug: series.slug,
          seasons: series.seasons,
          ageMin: series.ageMin,
          ageMax: series.ageMax,
          description: series.description,
          isNordic: series.isNordic ?? false,
          updatedAt: new Date(),
        },
        create: {
          drEntityId: series.entityId,
          title: series.title,
          slug: series.slug,
          type: 'SERIES',
          source: 'DR_MANUAL',
          isDanish: !series.isNordic,
          isNordic: series.isNordic ?? false,
          seasons: series.seasons,
          ageMin: series.ageMin,
          ageMax: series.ageMax,
          description: series.description,
          posterUrl: getDRImageUrl(series.entityId, 480, 720),
          backdropUrl: getDRImageUrl(series.entityId, 1280, 720),
          streamingInfo: {
            create: {
              provider: 'drtv',
              available: true,
              isFree: true,
              url: getDRSeriesUrl(series.slug, series.entityId),
            },
          },
        },
      });
      imported++;
    } catch (error) {
      console.error(`Failed to import ${series.title}:`, error);
    }
  }

  return imported;
}

// Refresh streaming info for DR (always available)
export async function refreshDRStreamingStatus(): Promise<void> {
  await prisma.streamingInfo.updateMany({
    where: { provider: 'drtv' },
    data: {
      available: true,
      lastChecked: new Date(),
    },
  });
}
