import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Private areas and API routes must never be crawled. Locale-prefixed
        // paths mean the crawler can hit /pt/portal, /en/admin, etc.
        disallow: ['/*/portal', '/*/admin', '/*/login', '/*/signup', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
