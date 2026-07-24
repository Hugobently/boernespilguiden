import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'cf.geekdo-images.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'is1-ssl.mzstatic.com',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: 'play-lh.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'prod95-static.dr-massive.com',
        pathname: '/api/shain/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Statiske spilbilleder ændrer sig kun ved deploy — lad CDN og
        // browser cache dem længe
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Katalogdata ændrer sig kun ved deploy — kortere CDN-cache med
        // stale-while-revalidate så API-svar ikke rammer databasen pr. request
        source: '/api/games/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/api/boardgames/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/api/search',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=600, stale-while-revalidate=3600' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
