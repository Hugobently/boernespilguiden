import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xn--brnespilguiden-qqb.dk';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
