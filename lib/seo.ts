import type { Metadata } from 'next';
import { locales, routing, type Locale } from '@/i18n/routing';

// ─── Site constants ─────────────────────────────────────────────
// Canonical domain. Overridable via env for staging; falls back to the
// production domain implied by the contact email (omar@ootravel.com.br).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://ootravel.com.br'
).replace(/\/$/, '');

export const SITE_NAME = 'OO Travel';
export const OG_IMAGE = '/og/og-default.png'; // 1200×630
export const LOGO_PATH = '/brand/oo-travel-logo.png';

export const CONTACT = {
  email: 'omar@ootravel.com.br',
  phone: '+5511933210241',
  whatsapp: 'https://wa.me/5511933210241',
  city: 'São Paulo',
  region: 'SP',
  country: 'BR',
  geo: { lat: -23.5505, lng: -46.6333 },
  cnpj: '63.588.045/0001-49',
  legalName: '63.588.045 OMAR OUKHIRA',
  founder: 'Omar Oukhira',
} as const;

const defaultLocale = routing.defaultLocale as Locale;

// hreflang codes (Google expects language or language-region). Exported so
// the root layout can reuse the same codes for <meta content-language> (Bing
// treats hreflang as a weak signal and leans on this tag more).
export const HREFLANG: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en',
  fr: 'fr',
  ar: 'ar',
};

// Open Graph locale codes.
const OG_LOCALE: Record<Locale, string> = {
  pt: 'pt_BR',
  en: 'en_US',
  fr: 'fr_FR',
  ar: 'ar_AR',
};

// ─── Localized SEO copy ─────────────────────────────────────────
export type PageKey = 'home' | 'about' | 'services' | 'contact' | 'faq';
interface SeoEntry {
  title: string;
  description: string;
}
interface LocaleSeo {
  keywords: string[];
  pages: Record<PageKey, SeoEntry>;
}

const SEO: Record<Locale, LocaleSeo> = {
  en: {
    keywords: [
      'travel agent São Paulo',
      'independent travel agent',
      'visa assistance Brazil',
      'flights and hotels',
      'cruise booking',
      'legal relocation Brazil',
      'multilingual travel agency',
      'Omar Oukhira',
      'OO Travel',
    ],
    pages: {
      home: {
        title: 'OO Travel — Independent Travel Agent in São Paulo',
        description:
          'Flights, hotels, visas, cruises and legal relocation, handled end to end by a licensed independent travel agent in São Paulo. Service in PT, EN, FR & AR.',
      },
      about: {
        title: 'About Omar Oukhira — Travel Agent in São Paulo',
        description:
          'Meet Omar Oukhira, a licensed independent travel agent (MEI) in São Paulo serving Brazilian, Arab, Francophone and English-speaking clients personally.',
      },
      services: {
        title: 'Travel Services — Flights, Visas, Cruises & More',
        description:
          'Flights, hotels, tours, visas, cruises, corporate travel, legal relocation and chauffeured car rental — arranged end to end by OO Travel in São Paulo.',
      },
      contact: {
        title: 'Contact OO Travel — Travel Agent in São Paulo',
        description:
          'Talk to Omar directly on WhatsApp or send a request. Personal, multilingual travel assistance from São Paulo, Brazil.',
      },
      faq: {
        title: 'Travel FAQ — Bookings, Visas & Payments',
        description:
          "Answers about OO Travel's services, languages, visa and legal help, payment by PIX, response times and licensing — an independent agent in São Paulo.",
      },
    },
  },
  pt: {
    keywords: [
      'agente de viagens São Paulo',
      'agente de viagens independente',
      'assessoria de visto',
      'passagens e hotéis',
      'cruzeiros',
      'instalação legal no exterior',
      'agência de viagens multilíngue',
      'Omar Oukhira',
      'OO Travel',
    ],
    pages: {
      home: {
        title: 'OO Travel — Agente de Viagens Independente em São Paulo',
        description:
          'Passagens, hotéis, vistos, cruzeiros e instalação legal, do início ao fim, com um agente de viagens independente licenciado em São Paulo. PT, EN, FR e AR.',
      },
      about: {
        title: 'Sobre Omar Oukhira — Agente de Viagens em São Paulo',
        description:
          'Conheça Omar Oukhira, agente de viagens independente licenciado (MEI) em São Paulo, atendendo clientes do Brasil e dos mundos árabe, francófono e anglófono.',
      },
      services: {
        title: 'Serviços de Viagem — Passagens, Vistos, Cruzeiros e Mais',
        description:
          'Passagens, hotéis, passeios, vistos, cruzeiros, viagens corporativas, instalação legal e aluguel de carro com motorista — organizados pela OO Travel.',
      },
      contact: {
        title: 'Contato OO Travel — Agente de Viagens em São Paulo',
        description:
          'Fale diretamente com o Omar no WhatsApp ou envie um pedido. Atendimento de viagens pessoal e multilíngue a partir de São Paulo, Brasil.',
      },
      faq: {
        title: 'Perguntas Frequentes — Reservas, Vistos e Pagamentos',
        description:
          'Respostas sobre os serviços da OO Travel, idiomas, vistos e apoio legal, pagamento por PIX, prazos de resposta e licenciamento — agente independente em São Paulo.',
      },
    },
  },
  fr: {
    keywords: [
      'agent de voyages São Paulo',
      'agent de voyages indépendant',
      'assistance visa Brésil',
      'vols et hôtels',
      'croisières',
      'installation légale au Brésil',
      'agence de voyages multilingue',
      'Omar Oukhira',
      'OO Travel',
    ],
    pages: {
      home: {
        title: 'OO Travel — Agent de Voyages Indépendant à São Paulo',
        description:
          'Vols, hôtels, visas, croisières et installation légale, gérés de bout en bout par un agent de voyages indépendant agréé à São Paulo. PT, EN, FR et AR.',
      },
      about: {
        title: "À propos d'Omar Oukhira — Agent de Voyages à São Paulo",
        description:
          "Découvrez Omar Oukhira, agent de voyages indépendant agréé (MEI) à São Paulo, au service des clients brésiliens, arabes, francophones et anglophones.",
      },
      services: {
        title: 'Services de Voyage — Vols, Visas, Croisières et Plus',
        description:
          'Vols, hôtels, circuits, visas, croisières, voyages d’affaires, installation légale et location de voiture avec chauffeur — organisés par OO Travel.',
      },
      contact: {
        title: 'Contact OO Travel — Agent de Voyages à São Paulo',
        description:
          'Parlez directement à Omar sur WhatsApp ou envoyez une demande. Assistance voyage personnelle et multilingue depuis São Paulo, Brésil.',
      },
      faq: {
        title: 'FAQ Voyage — Réservations, Visas et Paiements',
        description:
          "Réponses sur les services d'OO Travel, les langues, les visas et l'aide légale, le paiement par PIX, les délais de réponse et l'agrément — agent indépendant à São Paulo.",
      },
    },
  },
  ar: {
    keywords: [
      'وكيل سفر ساو باولو',
      'وكيل سفر مستقل',
      'المساعدة في التأشيرات',
      'تذاكر طيران وفنادق',
      'رحلات بحرية',
      'الاستقرار القانوني في البرازيل',
      'وكالة سفر متعددة اللغات',
      'عمر أوخيرة',
      'OO Travel',
    ],
    pages: {
      home: {
        title: 'OO Travel — وكيل سفر مستقل في ساو باولو',
        description:
          'تذاكر طيران وفنادق وتأشيرات ورحلات بحرية واستقرار قانوني، تُدار من البداية إلى النهاية على يد وكيل سفر مرخّص في ساو باولو. بالبرتغالية والإنجليزية والفرنسية والعربية.',
      },
      about: {
        title: 'عن عمر أوخيرة — وكيل سفر في ساو باولو',
        description:
          'تعرّف على عمر أوخيرة، وكيل سفر مستقل مرخّص (MEI) في ساو باولو يخدم العملاء من البرازيل والعالم العربي والفرنكوفوني والأنجلوفوني شخصيًا.',
      },
      services: {
        title: 'خدمات السفر — طيران وتأشيرات ورحلات بحرية والمزيد',
        description:
          'طيران وفنادق وجولات وتأشيرات ورحلات بحرية وسفر الأعمال والاستقرار القانوني وتأجير سيارة مع سائق — تنظّمها OO Travel في ساو باولو.',
      },
      contact: {
        title: 'تواصل مع OO Travel — وكيل سفر في ساو باولو',
        description:
          'تحدّث مع عمر مباشرة عبر واتساب أو أرسل طلبًا. مساعدة سفر شخصية ومتعددة اللغات من ساو باولو، البرازيل.',
      },
      faq: {
        title: 'الأسئلة الشائعة — الحجوزات والتأشيرات والدفع',
        description:
          'إجابات حول خدمات OO Travel واللغات والتأشيرات والدعم القانوني والدفع عبر PIX وأوقات الرد والترخيص — وكيل مستقل في ساو باولو.',
      },
    },
  },
};

// ─── Alternates (canonical + hreflang) ──────────────────────────
export function alternatesFor(path: string, locale: Locale): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[HREFLANG[l]] = `${SITE_URL}/${l}${path}`;
  languages['x-default'] = `${SITE_URL}/${defaultLocale}${path}`;
  return { canonical: `${SITE_URL}/${locale}${path}`, languages };
}

// ─── Metadata builder for the fixed public pages ────────────────
export function pageMetadata(
  locale: Locale,
  page: PageKey,
  path: string,
): Metadata {
  const s = SEO[locale].pages[page];
  return metadataFrom(locale, path, s.title, s.description, SEO[locale].keywords);
}

// Generic builder (used for legal pages too).
export function metadataFrom(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  keywords?: string[],
): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: alternatesFor(path, locale),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url,
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export function homeTitle(locale: Locale): string {
  return SEO[locale].pages.home.title;
}

// Site-wide metadata defaults for the root layout — NO page-specific
// canonical/alternates (each page sets its own via pageMetadata).
export function siteDefaults(locale: Locale): Metadata {
  const home = SEO[locale].pages.home;
  return {
    description: home.description,
    keywords: SEO[locale].keywords,
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: home.title,
      description: home.description,
      locale: OG_LOCALE[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: home.title,
      description: home.description,
      images: [OG_IMAGE],
    },
  };
}

// ─── JSON-LD (structured data for SEO + generative engines) ─────
export function organizationLd(locale: Locale, serviceNames: string[] = []) {
  return {
    '@context': 'https://schema.org',
    '@type': ['TravelAgency', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: CONTACT.legalName,
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}${LOGO_PATH}`,
    image: `${SITE_URL}${OG_IMAGE}`,
    description: SEO[locale].pages.home.description,
    email: CONTACT.email,
    telephone: CONTACT.phone,
    priceRange: '$$',
    taxID: CONTACT.cnpj,
    address: {
      '@type': 'PostalAddress',
      addressLocality: CONTACT.city,
      addressRegion: CONTACT.region,
      addressCountry: CONTACT.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CONTACT.geo.lat,
      longitude: CONTACT.geo.lng,
    },
    areaServed: [{ '@type': 'Country', name: 'Brazil' }, 'Worldwide'],
    availableLanguage: ['Portuguese', 'English', 'French', 'Arabic'],
    knowsLanguage: ['pt', 'en', 'fr', 'ar'],
    founder: { '@type': 'Person', name: CONTACT.founder },
    sameAs: [CONTACT.whatsapp],
    ...(serviceNames.length
      ? {
          makesOffer: serviceNames.map((name) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name },
          })),
        }
      : {}),
  };
}

export function websiteLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/${locale}`,
    name: SITE_NAME,
    inLanguage: HREFLANG[locale],
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

// FAQPage — high-value for both rich results and generative engines, which
// lift Q&A pairs directly into AI answers. Requires the same text to be
// visible on the page (the /faq accordion renders these exact strings).
export function faqLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
}

// Review + AggregateRating — mirrors the visible testimonial carousel on the
// homepage exactly (same quotes, same 5-star rating already shown via filled
// star icons). Real reviews only; never fabricate ratings that aren't
// rendered on the page, per schema.org/Google review-snippet guidelines.
export function reviewsLd(
  reviews: { author: string; quote: string; rating?: number }[],
) {
  const ratingValue =
    reviews.reduce((sum, r) => sum + (r.rating ?? 5), 0) / reviews.length;

  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${SITE_URL}/#organization`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Number(ratingValue.toFixed(1)),
      reviewCount: reviews.length,
      bestRating: 5,
    },
    review: reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewBody: r.quote,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating ?? 5,
        bestRating: 5,
      },
    })),
  };
}

// BlogPosting — one of the content types AI engines cite most (guides/
// comparisons), per the ai-seo pass. @id ties back to the site-wide
// Organization/WebSite entities already rendered in the root layout.
export function blogPostingLd(
  locale: Locale,
  post: { slug: string; title: string; excerpt: string; publishedAt: string; updatedAt?: string },
) {
  const url = `${SITE_URL}/${locale}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}/#article`,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}${OG_IMAGE}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: HREFLANG[locale],
    author: { '@type': 'Person', name: CONTACT.founder },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function breadcrumbLd(
  locale: Locale,
  items: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}/${locale}${it.path}`,
    })),
  };
}
