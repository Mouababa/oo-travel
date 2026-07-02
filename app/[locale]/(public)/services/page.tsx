import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ServiceIcon } from '@/components/service-icon';
import { JsonLd } from '@/components/seo/json-ld';
import { SERVICE_TYPES } from '@/lib/constants';
import { pageMetadata, breadcrumbLd } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, 'services', '/services');
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services');
  const tn = await getTranslations('nav');

  return (
    <div className="container py-16">
      <JsonLd
        data={breadcrumbLd(locale as Locale, [
          { name: tn('home'), path: '' },
          { name: tn('services'), path: '/services' },
        ])}
      />
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold md:text-4xl">{t('title')}</h1>
        <p className="mt-3 text-lg text-text-secondary">{t('subtitle')}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {SERVICE_TYPES.map((s) => (
          <Card key={s} className="flex flex-col gap-4 p-6 sm:flex-row">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
              <ServiceIcon type={s} className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{t(`items.${s}.name`)}</h2>
              <p className="mt-1 text-sm text-text-secondary">{t(`items.${s}.desc`)}</p>
              <Link
                href="/login"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {t('requestQuote')}
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link href="/contact">
          <Button size="lg">{t('requestQuote')}</Button>
        </Link>
      </div>
    </div>
  );
}
