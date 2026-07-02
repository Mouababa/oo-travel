import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { BadgeCheck, Building2, Languages } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { JourneyStats } from '@/components/public/journey-stats';
import { JsonLd } from '@/components/seo/json-ld';
import { pageMetadata, breadcrumbLd } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, 'about', '/about');
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const tn = await getTranslations('nav');

  return (
    <div className="container max-w-4xl py-16">
      <JsonLd
        data={breadcrumbLd(locale as Locale, [
          { name: tn('home'), path: '' },
          { name: tn('about'), path: '/about' },
        ])}
      />
      <h1 className="text-3xl font-semibold md:text-4xl">{t('title')}</h1>
      <p className="mt-4 text-lg text-text-secondary">{t('intro')}</p>
      <p className="mt-4 text-text-secondary">{t('bio')}</p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Card>
          <CardContent className="pt-5">
            <div className="mb-3 flex items-center gap-2 font-semibold">
              <BadgeCheck className="h-5 w-5 text-primary" />
              {t('credentialsTitle')}
            </div>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <Building2 className="h-4 w-4" /> {t('credentialsMei')}
              </li>
              <li>{t('credentialsCnpj')}</li>
              <li>{t('credentialsCnae')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="mb-3 flex items-center gap-2 font-semibold">
              <Languages className="h-5 w-5 text-primary" />
              {t('languagesTitle')}
            </div>
            <p className="text-sm text-text-secondary">{t('languages')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Credibility band — "Journey in Numbers" (variants 2 + 3) */}
      <JourneyStats />
    </div>
  );
}
