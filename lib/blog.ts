// Blog content model for OO Travel — mirrors the structure of lib/legal.ts
// (per-locale records, paragraph arrays where "- " entries render as bullets).
//
// Content strategy (4 pillars, see project notes): visa & legal relocation,
// destination guides, practical travel logistics, business travel / moving
// to Brazil. Posts are written in the target audience's language first and
// only translated to all 4 locales once proven — avoid shipping thin,
// rushed translations (see the international-SEO guidance this project
// already follows in lib/seo.ts).

import type { Locale } from '@/i18n/routing';

export type BlogCategory = 'visa' | 'destinations' | 'logistics' | 'business';
export const BLOG_CATEGORIES: BlogCategory[] = [
  'visa',
  'destinations',
  'logistics',
  'business',
];

export interface BlogPost {
  slug: string;
  category: BlogCategory;
  publishedAt: string; // ISO date
  updatedAt?: string; // ISO date, only if genuinely revised
  /** Hand-set reading estimate — avoids pulling in a word-count dependency. */
  readingMinutes: number;
  title: string;
  excerpt: string;
  /** Paragraphs; entries starting with "- " render as a bullet list. */
  body: string[];
}

const en: BlogPost[] = [
  {
    slug: 'welcome-to-the-journal',
    category: 'business',
    publishedAt: '2026-07-01',
    readingMinutes: 2,
    title: 'Welcome to the OO Travel Journal',
    excerpt:
      "Why we're starting this journal, and what you'll find here — visa and relocation guides, destination notes, and practical travel logistics.",
    body: [
      "This is where I'll be sharing what I've learned arranging flights, visas, and relocations for clients in Portuguese, English, French, and Arabic.",
      "Most travel content online is written by people who've never actually filed a visa application or sat with a client working through relocation paperwork. This journal is different: everything here comes from real questions I've answered and real cases I've worked.",
      "You'll find three kinds of posts here: practical visa and relocation guides for the destinations I work with most, destination notes from trips I've actually arranged, and answers to the logistics questions that come up again and again — document checklists, payment methods, entry requirements.",
      '- Visa and legal relocation, in both directions: Brazilians moving abroad, and newcomers moving to Brazil.',
      '- Destination guides based on real bookings, not recycled listicles.',
      '- Practical logistics: documents, payments, entry requirements.',
      "If there's a specific question you'd like answered here, message me on WhatsApp — the next post might be the answer.",
    ],
  },
];

const pt: BlogPost[] = [
  {
    slug: 'welcome-to-the-journal',
    category: 'business',
    publishedAt: '2026-07-01',
    readingMinutes: 2,
    title: 'Bem-vindo ao Diário da OO Travel',
    excerpt:
      'Por que estamos começando este diário e o que você vai encontrar aqui — guias de visto e mudança, notas de destinos e logística prática de viagem.',
    body: [
      'Aqui vou compartilhar o que aprendi organizando passagens, vistos e mudanças para clientes em português, inglês, francês e árabe.',
      'A maior parte do conteúdo de viagem por aí é escrita por quem nunca preencheu um pedido de visto de verdade nem acompanhou um cliente na documentação de uma mudança. Este diário é diferente: tudo aqui vem de perguntas reais que já respondi e casos reais que já acompanhei.',
      'Você vai encontrar três tipos de conteúdo aqui: guias práticos de visto e mudança para os destinos que mais atendo, notas de destinos de viagens que organizei de verdade, e respostas para as dúvidas de logística que sempre aparecem — documentos, formas de pagamento, exigências de entrada.',
      '- Visto e mudança legal, nos dois sentidos: brasileiros indo para fora e estrangeiros vindo para o Brasil.',
      '- Guias de destino baseados em viagens reais, não listas genéricas.',
      '- Logística prática: documentos, pagamentos, exigências de entrada.',
      'Se tiver uma dúvida específica que gostaria de ver respondida aqui, me chame no WhatsApp — o próximo texto pode ser a resposta.',
    ],
  },
];

const fr: BlogPost[] = [
  {
    slug: 'welcome-to-the-journal',
    category: 'business',
    publishedAt: '2026-07-01',
    readingMinutes: 2,
    title: "Bienvenue sur le journal d'OO Travel",
    excerpt:
      "Pourquoi nous lançons ce journal, et ce que vous y trouverez — guides de visa et d'installation, notes de destinations, et logistique pratique de voyage.",
    body: [
      "Ici, je partage ce que j'ai appris en organisant des vols, des visas et des installations pour des clients en portugais, anglais, français et arabe.",
      "La plupart des contenus voyage en ligne sont écrits par des gens qui n'ont jamais rempli une vraie demande de visa ni accompagné un client dans ses démarches d'installation. Ce journal est différent : tout vient de vraies questions auxquelles j'ai répondu et de vrais dossiers que j'ai suivis.",
      "Vous trouverez trois types d'articles : des guides pratiques de visa et d'installation pour les destinations que je traite le plus souvent, des notes de destinations issues de voyages réellement organisés, et des réponses aux questions logistiques qui reviennent sans cesse — documents, moyens de paiement, conditions d'entrée.",
      "- Visa et installation légale, dans les deux sens : Brésiliens partant à l'étranger et nouveaux arrivants au Brésil.",
      '- Guides de destination basés sur de vrais voyages organisés, pas des listes recyclées.',
      "- Logistique pratique : documents, paiements, conditions d'entrée.",
      'Si vous avez une question précise à laquelle vous aimeriez une réponse ici, écrivez-moi sur WhatsApp — le prochain article pourrait y répondre.',
    ],
  },
];

const ar: BlogPost[] = [
  {
    slug: 'welcome-to-the-journal',
    category: 'business',
    publishedAt: '2026-07-01',
    readingMinutes: 2,
    title: 'مرحبًا بكم في مدونة OO Travel',
    excerpt:
      'لماذا نبدأ هذه المدونة، وماذا ستجدون فيها — أدلة التأشيرات والاستقرار، ملاحظات عن الوجهات، ولوجستيات السفر العملية.',
    body: [
      'هنا سأشارك ما تعلمته من تنظيم رحلات الطيران والتأشيرات وعمليات الاستقرار لعملاء بالبرتغالية والإنجليزية والفرنسية والعربية.',
      'معظم محتوى السفر على الإنترنت يكتبه أشخاص لم يقدّموا طلب تأشيرة حقيقيًا قط ولم يرافقوا عميلًا في أوراق الاستقرار. هذه المدونة مختلفة: كل ما هنا ينبع من أسئلة حقيقية أجبت عنها وحالات حقيقية عملت عليها.',
      'ستجدون هنا ثلاثة أنواع من المقالات: أدلة عملية للتأشيرات والاستقرار للوجهات التي أتعامل معها كثيرًا، وملاحظات عن وجهات من رحلات نظّمتها فعليًا، وإجابات عن أسئلة اللوجستيات المتكررة — المستندات وطرق الدفع وشروط الدخول.',
      '- التأشيرة والاستقرار القانوني، في الاتجاهين: برازيليون يسافرون إلى الخارج ووافدون جدد إلى البرازيل.',
      '- أدلة وجهات مبنية على رحلات حقيقية، لا قوائم معاد تدويرها.',
      '- لوجستيات عملية: المستندات، طرق الدفع، شروط الدخول.',
      'إذا كان لديك سؤال محدد تريد إجابة عنه هنا، راسلني عبر واتساب — قد يكون المقال القادم هو الإجابة.',
    ],
  },
];

const POSTS: Record<Locale, BlogPost[]> = { en, pt, fr, ar };

/** All posts for a locale, newest first. */
export function blogPosts(locale: string): BlogPost[] {
  const posts = POSTS[locale as Locale] ?? POSTS.en;
  return [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function blogPost(locale: string, slug: string): BlogPost | undefined {
  return blogPosts(locale).find((p) => p.slug === slug);
}

/** Every slug that exists in at least one locale — used for generateStaticParams. */
export function allBlogSlugs(): string[] {
  const slugs = new Set<string>();
  for (const posts of Object.values(POSTS)) {
    for (const p of posts) slugs.add(p.slug);
  }
  return Array.from(slugs);
}
