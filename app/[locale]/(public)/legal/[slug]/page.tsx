import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Info } from 'lucide-react';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import {
  getLegalDoc,
  isLegalSlug,
  LEGAL_SLUGS,
  LEGAL_UPDATED,
  type LegalSlug,
} from '@/lib/legal';
import { formatDate, intlLocale } from '@/lib/utils';
import { metadataFrom } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLegalSlug(slug)) return {};
  const { doc } = getLegalDoc(locale, slug);
  // Legal pages are canonical but low-priority; keep them indexable with
  // proper canonical + hreflang, and cap the snippet from the intro.
  return metadataFrom(
    locale as Locale,
    `/legal/${slug}`,
    doc.title,
    doc.intro.slice(0, 155),
  );
}

const footerKey: Record<LegalSlug, string> = {
  privacy: 'privacy',
  cookies: 'cookies',
  terms: 'terms',
  'booking-terms': 'bookingTerms',
};

/** Renders paragraphs, grouping consecutive "- " lines into a bullet list. */
function Body({ lines }: { lines: string[] }) {
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flush = (key: string) => {
    if (bullets.length) {
      blocks.push(
        <ul key={key} className="ms-1 list-disc space-y-1.5 ps-4 text-text-secondary">
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

  return <div className="space-y-3">{blocks}</div>;
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isLegalSlug(slug)) notFound();

  const { doc, isFallback } = getLegalDoc(locale, slug);
  const t = await getTranslations('legal');
  const tf = await getTranslations('footer');

  return (
    <div className="container max-w-3xl py-16 md:py-24">
      <h1 className="font-heading text-3xl font-bold tracking-heading md:text-4xl">
        <span className="text-gradient">{doc.title}</span>
      </h1>
      <p className="mt-3 font-mono text-xs text-text-muted">
        {t('lastUpdated')}: {formatDate(LEGAL_UPDATED, intlLocale(locale))}
      </p>

      {isFallback && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm text-text-secondary">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span>{t('intlNotice')}</span>
        </div>
      )}

      <p className="mt-6 text-text-secondary">{doc.intro}</p>

      <div className="mt-10 space-y-10">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-3 font-heading text-lg font-medium text-text-primary">
              {section.heading}
            </h2>
            <Body lines={section.body} />
          </section>
        ))}
      </div>

      {/* Cross-links to the other policies */}
      <div className="mt-14 border-t border-border pt-6">
        <p className="mb-3 font-heading text-sm font-medium text-text-primary">
          {tf('legalTitle')}
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {LEGAL_SLUGS.map((s) => (
            <Link
              key={s}
              href={`/legal/${s}`}
              className={
                s === slug
                  ? 'text-accent'
                  : 'text-text-secondary hover:text-accent'
              }
            >
              {tf(footerKey[s])}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export const dynamicParams = false;
