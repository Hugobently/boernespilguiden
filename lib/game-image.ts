import fs from 'fs';
import path from 'path';

const IMAGE_EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png', 'svg'] as const;

/**
 * Resolves the best available image for a game, mirroring the client-side
 * fallback in GameImageWithFallback: use the DB url if set, otherwise look
 * for /images/games/{digital|board}/{slug}.{ext} on disk.
 * Returns a site-relative path, or null if no image exists.
 */
export function resolveGameImage(
  type: 'digital' | 'board',
  slug: string,
  dbUrl?: string | null
): string | null {
  if (dbUrl) return dbUrl;

  const dir = path.join(process.cwd(), 'public', 'images', 'games', type);
  for (const ext of IMAGE_EXTENSIONS) {
    if (fs.existsSync(path.join(dir, `${slug}.${ext}`))) {
      return `/images/games/${type}/${slug}.${ext}`;
    }
  }
  return null;
}
