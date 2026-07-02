import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ChevronDown } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';
import { pageMetadata, breadcrumbLd, faqLd } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

// Six visible Q&A — the FAQPage schema must mirror on-page text exactly.
const IDS = [1, 2, 3, 4, 5, 6] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, 'faq', '/faq');
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('faq');
  const tn = await getTranslations('nav');

  const items = IDS.map((i) => ({
    question: t(`q${i}`),
    answer: t(`a${i}`),
  }));

  return (
    <div className="container max-w-3xl py-16 md:py-24">
      <JsonLd
        data={[
          faqLd(items),
          breadcrumbLd(locale as Locale, [
            { name: tn('home'), path: '' },
            { name: tn('faq'), path: '/faq' },
          ]),
        ]}
      />

      <div className="mx-auto max-w-2xl text-center">
        <hr className="rule-gold mx-auto" />
        <h1 className="mt-6 font-heading text-4xl font-semibold tracking-heading md:text-5xl">
          <span className="text-gradient">{t('title')}</span>
        </h1>
        <p className="mt-4 font-display font-light text-text-secondary">
          {t('subtitle')}
        </p>
      </div>

      {/* Native <details> accordion — content is always in the DOM (crawlable),
          works without JS, and is keyboard-accessible out of the box. */}
      <div className="mt-12 space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group glass rounded-2xl px-5 open:shadow-glow sm:px-6"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-start font-heading text-lg font-medium text-text-primary [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown className="h-5 w-5 shrink-0 text-gold transition-transform duration-300 group-[[open]]:rotate-180" />
            </summary>
            <p className="pb-5 font-display text-sm font-light leading-relaxed text-text-secondary">
              {item.answer}
            </p>
          </details>
        ))}
      </div>

      {/* Conversion nudge into the lead form. */}
      <div className="mt-12 text-center">
        <a
          href={`/${locale}#request`}
          className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-8 py-3.5 font-display text-sm font-semibold uppercase tracking-eyebrow text-gold transition-all duration-300 hover:border-gold/60 hover:bg-gold/20 hover:shadow-glow"
        >
          {tn('requestQuote')}
        </a>
      </div>
    </div>
  );
}
