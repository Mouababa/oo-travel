import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ContactContent } from '@/components/public/contact-form';
import { JsonLd } from '@/components/seo/json-ld';
import { pageMetadata, breadcrumbLd } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, 'contact', '/contact');
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tn = await getTranslations('nav');

  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale as Locale, [
          { name: tn('home'), path: '' },
          { name: tn('contact'), path: '/contact' },
        ])}
      />
      <ContactContent />
    </>
  );
}
