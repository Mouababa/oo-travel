import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { JsonLd } from '@/components/seo/json-ld';
import { metadataFrom, breadcrumbLd } from '@/lib/seo';
import { blogPosts } from '@/lib/blog';
import { formatDate, intlLocale } from '@/lib/utils';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return metadataFrom(locale as Locale, '/blog', t('title'), t('subtitle'));
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const tn = await getTranslations('nav');
  const posts = blogPosts(locale);

  return (
    <div className="container max-w-4xl py-16 md:py-24">
      <JsonLd
        data={breadcrumbLd(locale as Locale, [
          { name: tn('home'), path: '' },
          { name: tn('blog'), path: '/blog' },
        ])}
      />

      <div className="mx-auto max-w-2xl text-center">
        <hr className="rule-gold mx-auto" />
        <h1 className="mt-6 font-heading text-4xl font-semibold tracking-heading md:text-5xl">
          <span className="text-gradient">{t('title')}</span>
        </h1>
        <p className="mt-4 font-display font-light text-text-secondary">{t('subtitle')}</p>
      </div>

      {posts.length === 0 ? (
        <p className="mt-16 text-center font-display text-text-secondary">
          {t('emptyState')}
        </p>
      ) : (
        <div className="mt-12 space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="lift glass iridescent-ring block rounded-2xl p-6 sm:p-8"
            >
              <span className="eyebrow text-gold">{t(`categories.${post.category}`)}</span>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-text-primary">
                {post.title}
              </h2>
              <p className="mt-2 font-display text-sm font-light text-text-secondary">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-3 font-display text-xs text-text-muted">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt, intlLocale(locale))}
                </time>
                <span aria-hidden>·</span>
                <span>{t('readingTime', { n: post.readingMinutes })}</span>
                <ArrowRight className="ms-auto h-4 w-4 shrink-0 text-gold rtl:rotate-180" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
