import type { MetadataRoute } from 'next';
import { locales, routing } from '@/i18n/routing';
import { LEGAL_SLUGS } from '@/lib/legal';
import { allBlogSlugs, blogPost } from '@/lib/blog';
import { SITE_URL, HREFLANG } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    '/about',
    '/services',
    '/faq',
    '/blog',
    '/contact',
    ...LEGAL_SLUGS.map((s) => `/legal/${s}`),
  ];
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of paths) {
    // Each URL declares its localized siblings (hreflang) for correct
    // multilingual indexing, including x-default (must match the HTML head's
    // hreflang set — Google drops a pair if the two methods disagree).
    const languages: Record<string, string> = {};
    for (const l of locales) languages[HREFLANG[l]] = `${SITE_URL}/${l}${path}`;
    languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${path}`;

    for (const l of locales) {
      entries.push({
        url: `${SITE_URL}/${l}${path}`,
        lastModified: now,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : path.startsWith('/legal') ? 0.3 : 0.8,
        alternates: { languages },
      });
    }
  }

  // Blog posts — real publish/update dates, and only the locales the post
  // actually exists in (avoids hreflang pointing at a 404).
  for (const slug of allBlogSlugs()) {
    const path = `/blog/${slug}`;
    const languages: Record<string, string> = {};
    for (const l of locales) {
      if (blogPost(l, slug)) languages[HREFLANG[l]] = `${SITE_URL}/${l}${path}`;
    }
    if (blogPost(routing.defaultLocale, slug)) {
      languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${path}`;
    }

    for (const l of locales) {
      const post = blogPost(l, slug);
      if (!post) continue;
      entries.push({
        url: `${SITE_URL}/${l}${path}`,
        lastModified: new Date(post.updatedAt ?? post.publishedAt),
        changeFrequency: 'yearly',
        priority: 0.7,
        alternates: { languages },
      });
    }
  }

  return entries;
}
