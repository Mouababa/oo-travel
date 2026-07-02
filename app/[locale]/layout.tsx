import type { Metadata } from 'next';
import { Montserrat, Cormorant, Alexandria, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, rtlLocales, type Locale } from '@/i18n/routing';
import { Toaster } from '@/components/ui/toaster';
import { JsonLd } from '@/components/seo/json-ld';
import { SERVICE_TYPES } from '@/lib/constants';
import {
  SITE_URL,
  SITE_NAME,
  siteDefaults,
  homeTitle,
  organizationLd,
  websiteLd,
  HREFLANG,
} from '@/lib/seo';
import '../globals.css';

// "Luxury Serif" pairing (UI/UX Pro Max recommendation for high-end
// travel): Cormorant display serif over Montserrat geometric body. Montserrat
// also doubles as the Latin body, so the brand reads identically to the Arabic
// (Alexandria is the Montserrat-Arabic lineage) — one geometric voice, 4 scripts.
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});
const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});
// Alexandria — the Google Fonts release of the Montserrat Arabic project
// (same designer/lineage): geometric, Montserrat-style, full Arabic + Latin.
const arabic = Alexandria({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-arabic',
  display: 'swap',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = (routing.locales.includes(locale as Locale) ? locale : routing.defaultLocale) as Locale;

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    // Pages set an absolute title; this template brands any that don't.
    title: {
      default: homeTitle(loc),
      template: `%s · ${SITE_NAME}`,
    },
    authors: [{ name: 'Omar Oukhira' }],
    creator: 'Omar Oukhira',
    publisher: SITE_NAME,
    formatDetection: { telephone: true, email: true, address: true },
    // Public site is fully indexable; portal/admin are blocked in robots.ts.
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    icons: {
      icon: [
        { url: '/icons/icon-16.png', sizes: '16x16', type: 'image/png' },
        { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/site.webmanifest',
    // Site-wide OG/Twitter/description defaults; pages override per route.
    ...siteDefaults(loc),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = rtlLocales.includes(locale as Locale) ? 'rtl' : 'ltr';

  // Localized service names feed the TravelAgency's makesOffer (helps AI/GEO
  // engines enumerate what the business actually offers).
  const ts = await getTranslations('services.items');
  const serviceNames = SERVICE_TYPES.map((s) => ts(`${s}.name`));
  const loc = locale as Locale;

  return (
    <html
      lang={locale}
      dir={dir}
      className={`dark ${montserrat.variable} ${cormorant.variable} ${arabic.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* Bing treats hreflang as a weak signal and leans on this tag
            instead (Google reads <html lang>, already set above). Must be a
            real httpEquiv meta — Next.js's `other` metadata field only
            renders name="", which carries less weight for Bing's parser. */}
        <meta httpEquiv="content-language" content={HREFLANG[loc]} />
      </head>
      <body className="font-sans antialiased">
        <JsonLd data={[organizationLd(loc, serviceNames), websiteLd(loc)]} />
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
