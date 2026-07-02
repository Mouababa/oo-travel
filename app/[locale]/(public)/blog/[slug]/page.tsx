import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { JsonLd } from '@/components/seo/json-ld';
import { metadataFrom, blogPostingLd, breadcrumbLd } from '@/lib/seo';
import { blogPost, allBlogSlugs } from '@/lib/blog';
import { formatDate, intlLocale } from '@/lib/utils';
import type { Locale } from '@/i18n/routing';

export function generateStaticParams() {
  return allBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = blogPost(locale, slug);
  if (!post) return {};
  return metadataFrom(locale as Locale, `/blog/${slug}`, post.title, post.excerpt);
}

/** Renders paragraphs, grouping consecutive "- " lines into a bullet list
 * (same convention as the legal pages' Body component). */
function Body({ lines }: { lines: string[] }) {
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flush = (key: string) => {
    if (bullets.length) {
      blocks.push(
        <ul key={key} className="ms-1 list-disc space-y-2 ps-5 text-text-secondary">
          {bullets.map((b, i) => (
            <li key={i}>{b.replace(/^- /, '')}</li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith('- ')) {
      bullets.push(line);
    } else {
      flush(`ul-${i}`);
      blocks.push(
        <p key={`p-${i}`} className="text-text-secondary">
          {line}
        </p>,
      );
    }
  });
  flush('ul-end');

  return <div className="space-y-4 font-display text-base font-light leading-relaxed">{blocks}</div>;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = blogPost(locale, slug);
  if (!post) notFound();

  const t = await getTranslations('blog');
  const tn = await getTranslations('nav');

  return (
    <div className="container max-w-3xl py-16 md:py-24">
      <JsonLd
        data={[
          blogPostingLd(locale as Locale, post),
          breadcrumbLd(locale as Locale, [
            { name: tn('home'), path: '' },
            { name: tn('blog'), path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {t('backToBlog')}
      </Link>

      <span className="eyebrow mt-8 block text-gold">{t(`categories.${post.category}`)}</span>
      <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight tracking-heading md:text-5xl">
        <span className="text-gradient">{post.title}</span>
      </h1>

      <div className="mt-4 flex items-center gap-3 font-display text-xs text-text-muted">
        <time dateTime={post.publishedAt}>
          {formatDate(post.publishedAt, intlLocale(locale))}
        </time>
        <span aria-hidden>·</span>
        <span>{t('readingTime', { n: post.readingMinutes })}</span>
      </div>

      <hr className="rule-gold mt-8" />

      <div className="mt-8">
        <Body lines={post.body} />
      </div>
    </div>
  );
}

export const dynamicParams = false;
