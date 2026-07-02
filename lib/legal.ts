// Compliance content for OO Travel (63.588.045 OMAR OUKHIRA — MEI).
// Covers LGPD (Brazil), GDPR (EU/EEA), UK GDPR, CCPA/CPRA (California), the
// Brazilian Consumer Code (CDC), the ePrivacy cookie-consent regime, and the
// advertising-platform requirements of Meta, Google and TikTok.
//
// Authored in Portuguese (the operative language for a Brazilian MEI) and
// English (international). French and Arabic routes display the English text
// with a localized notice rather than machine-translated legal language.

export const LEGAL_UPDATED = '2026-06-27';

export const COMPANY = {
  legalName: '63.588.045 OMAR OUKHIRA',
  trade: 'OO Travel',
  cnpj: '63.588.045/0001-49',
  cnae: '7911-2/00',
  email: 'omar@ootravel.com.br',
  city: 'São Paulo, Brasil',
};

export type LegalSlug = 'privacy' | 'cookies' | 'terms' | 'booking-terms';
export const LEGAL_SLUGS: LegalSlug[] = ['privacy', 'cookies', 'terms', 'booking-terms'];

export interface LegalSection {
  heading: string;
  /** Each entry is a paragraph; entries starting with "- " render as bullets. */
  body: string[];
}
export interface LegalDoc {
  title: string;
  intro: string;
  sections: LegalSection[];
}

type Lang = 'pt' | 'en';

const en: Record<LegalSlug, LegalDoc> = {
  privacy: {
    title: 'Privacy Policy',
    intro:
      'This Privacy Policy explains how 63.588.045 OMAR OUKHIRA ("OO Travel", "we"), CNPJ 63.588.045/0001-49, based in São Paulo, Brazil, collects, uses, shares and protects your personal data when you use our website and client portal. We act as data controller under Brazil\'s LGPD (Law 13.709/2018) and, where applicable, the EU/UK GDPR and the California CCPA/CPRA.',
    sections: [
      {
        heading: '1. Data we collect',
        body: [
          '- Identification & contact data: name, email, phone/WhatsApp number, preferred language.',
          '- Booking data: destinations, travel dates, service requests, special requirements.',
          '- Documents you upload: passport, residence and financial proof, photos and other visa or travel documents.',
          '- Payment data: invoice details and payment status. Card and PIX data are processed directly by our payment provider (Mercado Pago); we do not store full card numbers.',
          '- Communications: messages exchanged through the portal and WhatsApp.',
          '- Technical data: IP address, device and browser information, and cookie identifiers (see our Cookie Policy).',
        ],
      },
      {
        heading: '2. Why we use your data and legal bases',
        body: [
          'We process personal data to: provide and manage travel services and your account; prepare visa and relocation documentation; issue invoices and process payments; communicate with you (including AI-assisted WhatsApp replies); comply with legal obligations; and, with your consent, measure and advertise our services.',
          'Legal bases under the LGPD (Art. 7/11) and GDPR (Art. 6): performance of a contract, your consent, our legitimate interests, and compliance with legal or regulatory obligations.',
        ],
      },
      {
        heading: '3. Sharing and processors',
        body: [
          'We share data only as needed to deliver our services, with: Supabase (hosting, database and document storage); Mercado Pago (payments); Z-API and Meta WhatsApp (messaging); Resend (transactional email); Anthropic (AI assistant); and travel suppliers such as airlines, hotels, cruise lines, insurers and consulates/embassies to fulfil your bookings and visa requests.',
          'We never sell your personal data.',
        ],
      },
      {
        heading: '4. Advertising, analytics & social media platforms',
        body: [
          'With your consent, we use measurement and advertising tools from Meta Platforms (Facebook/Instagram Pixel and Conversions API), Google (Google Analytics, Google Ads and remarketing) and TikTok (TikTok Pixel). These tools may set cookies and receive hashed identifiers (such as a hashed email or device ID) to measure campaigns and show you relevant ads, including custom and lookalike audiences.',
          'These platforms act as independent or joint controllers for their own processing. You can manage or withdraw consent at any time via our cookie banner and through each platform\'s ad settings. See our Cookie Policy for the full list.',
        ],
      },
      {
        heading: '5. International transfers',
        body: [
          'Some providers process data outside Brazil (for example in the United States or the EU). We rely on adequacy decisions, Standard Contractual Clauses and equivalent safeguards permitted by the LGPD (Art. 33) and GDPR (Chapter V).',
        ],
      },
      {
        heading: '6. Your rights',
        body: [
          'Under the LGPD you may request: confirmation and access; correction; anonymization, blocking or deletion of unnecessary data; portability; information about sharing; and withdrawal of consent. GDPR adds restriction and objection rights; CCPA/CPRA residents may request to know, delete, correct and opt out of "sharing" for targeted advertising.',
          `To exercise any right, contact us at ${COMPANY.email}. You also have the right to lodge a complaint with Brazil's data authority (ANPD) or your local supervisory authority.`,
        ],
      },
      {
        heading: '7. Retention & security',
        body: [
          'We keep personal data only as long as necessary for the purposes above and to meet legal, tax and regulatory obligations, then delete or anonymize it. We apply technical and organizational safeguards including encryption in transit, access controls and per-client storage isolation (Row Level Security).',
        ],
      },
      {
        heading: '8. Children',
        body: [
          'Our services are intended for adults (18+). We do not knowingly collect data from children without parental consent; minors travelling are handled through the responsible adult\'s account.',
        ],
      },
      {
        heading: '9. Contact & changes',
        body: [
          `Data controller: ${COMPANY.legalName} (OO Travel), CNPJ ${COMPANY.cnpj}, ${COMPANY.city}. Privacy contact / DPO: ${COMPANY.email}.`,
          'We may update this policy; the "last updated" date below reflects the current version.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    intro:
      'This Cookie Policy explains how OO Travel uses cookies and similar technologies, including advertising pixels from Meta, Google and TikTok. Non-essential cookies are only set after you give consent through our cookie banner.',
    sections: [
      {
        heading: '1. What cookies are',
        body: [
          'Cookies are small files stored on your device. We also use similar technologies such as pixels, tags, local storage and SDKs. They help the site work, remember your preferences, measure performance and support advertising.',
        ],
      },
      {
        heading: '2. Categories we use',
        body: [
          '- Strictly necessary: authentication, security, session and language. Always active; no consent required.',
          '- Functional: remember preferences such as your selected language and cookie choices.',
          '- Analytics: understand how the site is used (e.g. Google Analytics). Consent-based.',
          '- Advertising / marketing: measure campaigns and personalize ads. Consent-based.',
        ],
      },
      {
        heading: '3. Third-party advertising & analytics technologies',
        body: [
          '- Meta Pixel & Conversions API (Meta Platforms): measures Facebook/Instagram campaigns and builds custom and lookalike audiences.',
          '- Google Analytics, Google Ads & remarketing (Google): measures traffic and conversions and supports retargeting across the Google network and YouTube.',
          '- TikTok Pixel (TikTok): measures TikTok campaigns and supports audience building.',
          'These providers may receive a hashed identifier and event data. They process this under their own privacy policies as independent or joint controllers.',
        ],
      },
      {
        heading: '4. Managing your consent',
        body: [
          'When you first visit, our banner lets you accept or reject non-essential cookies. You can change your choice at any time by reopening the cookie settings from the banner or by clearing cookies in your browser. Rejecting advertising cookies does not affect access to the portal.',
          'You can also opt out directly: Meta and Google ad settings, the TikTok app settings, and browser controls (including "Do Not Track" / Global Privacy Control signals, which we honor where required).',
        ],
      },
      {
        heading: '5. More information',
        body: [
          `Questions about cookies: ${COMPANY.email}. See also our Privacy Policy.`,
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Use',
    intro:
      'These Terms of Use govern your access to the OO Travel website and client portal, operated by 63.588.045 OMAR OUKHIRA (CNPJ 63.588.045/0001-49). By using the site you agree to these terms.',
    sections: [
      {
        heading: '1. Who we are',
        body: [
          'OO Travel is an independent travel agency (MEI, CNAE 7911-2/00) registered in São Paulo, Brazil. We act as an intermediary between you and travel suppliers (airlines, hotels, cruise lines, transport providers, insurers) and we assist with visa and relocation paperwork.',
        ],
      },
      {
        heading: '2. Eligibility & accounts',
        body: [
          'You must be at least 18 years old and provide accurate information. You are responsible for keeping your login credentials confidential and for activity under your account.',
        ],
      },
      {
        heading: '3. Acceptable use',
        body: [
          '- Do not use the service unlawfully, upload malicious files, or attempt to access other clients\' data.',
          '- Documents you upload must be genuine and your own (or that of travellers you are authorized to represent).',
        ],
      },
      {
        heading: '4. Our role as intermediary',
        body: [
          'Bookings are also subject to the terms of the relevant suppliers. We arrange and coordinate services but do not operate flights, hotels or other travel services, and we do not guarantee the outcome of any visa or immigration application, which is decided solely by the competent authority.',
        ],
      },
      {
        heading: '5. Intellectual property',
        body: [
          'The site, brand, text and design are owned by OO Travel or its licensors and may not be copied or reused without permission.',
        ],
      },
      {
        heading: '6. Disclaimers & liability',
        body: [
          'The service is provided "as is". To the extent permitted by law, we are not liable for indirect or consequential damages, or for supplier acts beyond our reasonable control. Nothing limits rights you have as a consumer under the Brazilian Consumer Code (CDC, Law 8.078/1990) or other mandatory law.',
        ],
      },
      {
        heading: '7. Governing law',
        body: [
          'These terms are governed by Brazilian law. Disputes are subject to the courts of São Paulo/SP, without prejudice to the consumer\'s right to sue in their own domicile.',
        ],
      },
      {
        heading: '8. Changes & contact',
        body: [
          `We may update these terms; continued use means acceptance. Contact: ${COMPANY.email}.`,
        ],
      },
    ],
  },
  'booking-terms': {
    title: 'Booking, Cancellation & Refund Terms',
    intro:
      'These terms apply to travel services arranged by OO Travel and complement our Terms of Use. They reflect the Brazilian Consumer Code (CDC) and the conditions of the underlying travel suppliers.',
    sections: [
      {
        heading: '1. Quotes & confirmation',
        body: [
          'Quotes are valid for the period stated and depend on supplier availability and price at the time of issue. A booking is confirmed only after payment (or the agreed deposit) is received and the supplier confirms.',
        ],
      },
      {
        heading: '2. Prices & payment',
        body: [
          'Prices are in Brazilian Reais (BRL) unless stated otherwise and may include service fees. We accept PIX and card installments processed by Mercado Pago. Taxes, surcharges and currency variations may apply per supplier rules.',
        ],
      },
      {
        heading: '3. Right of withdrawal (CDC Art. 49)',
        body: [
          'For purchases made remotely you may withdraw within 7 days of contracting, except where the service has already started or where suppliers (e.g. airlines, hotels) impose non-refundable conditions that were disclosed before purchase. Our service/handling fees may be retained for work already performed.',
        ],
      },
      {
        heading: '4. Cancellations & changes',
        body: [
          'Cancellations and date or name changes are subject to the rules and penalties of each supplier (fare class, hotel rate, cruise line), which may be partly or fully non-refundable. We will always show the applicable conditions before you confirm.',
        ],
      },
      {
        heading: '5. Refunds',
        body: [
          'Where a refund is due, we process it after the supplier refunds us, using the original payment method. Timelines depend on the supplier and the payment provider. Our non-refundable service fee covers the advisory and arrangement work already delivered.',
        ],
      },
      {
        heading: '6. Visas, documents & insurance',
        body: [
          'We prepare and submit documentation but cannot guarantee visa or entry approval, which is at the sole discretion of the relevant authority. Government and consular fees are non-refundable. We strongly recommend travel insurance; you are responsible for valid passports, visas and health requirements.',
        ],
      },
      {
        heading: '7. Force majeure',
        body: [
          'We are not liable for failures caused by events beyond reasonable control (natural events, strikes, government acts, pandemics). In such cases supplier policies and applicable consumer law govern any remedies.',
        ],
      },
      {
        heading: '8. Complaints',
        body: [
          `Contact us first at ${COMPANY.email} and we will work to resolve your issue. You may also use Brazil's consumer channels (consumidor.gov.br and your local PROCON).`,
        ],
      },
    ],
  },
};

const pt: Record<LegalSlug, LegalDoc> = {
  privacy: {
    title: 'Política de Privacidade',
    intro:
      'Esta Política de Privacidade explica como a 63.588.045 OMAR OUKHIRA ("OO Travel", "nós"), CNPJ 63.588.045/0001-49, com sede em São Paulo, coleta, usa, compartilha e protege seus dados pessoais quando você usa nosso site e portal do cliente. Atuamos como controladores nos termos da LGPD (Lei 13.709/2018) e, quando aplicável, do GDPR (UE/Reino Unido) e do CCPA/CPRA (Califórnia).',
    sections: [
      {
        heading: '1. Dados que coletamos',
        body: [
          '- Identificação e contato: nome, e-mail, telefone/WhatsApp, idioma preferido.',
          '- Dados de reserva: destinos, datas, solicitações de serviço, necessidades específicas.',
          '- Documentos enviados: passaporte, comprovantes de residência e financeiros, fotos e demais documentos de viagem ou visto.',
          '- Dados de pagamento: dados da fatura e status. Cartão e PIX são processados diretamente pela Mercado Pago; não armazenamos o número completo do cartão.',
          '- Comunicações: mensagens trocadas pelo portal e WhatsApp.',
          '- Dados técnicos: endereço IP, informações de dispositivo e navegador e identificadores de cookies (ver Política de Cookies).',
        ],
      },
      {
        heading: '2. Finalidades e bases legais',
        body: [
          'Tratamos dados para: prestar e gerenciar os serviços de viagem e sua conta; preparar documentação de visto e instalação; emitir faturas e processar pagamentos; comunicar com você (inclusive respostas por WhatsApp com apoio de IA); cumprir obrigações legais; e, com seu consentimento, mensurar e divulgar nossos serviços.',
          'Bases legais da LGPD (art. 7º/11) e do GDPR (art. 6º): execução de contrato, consentimento, legítimo interesse e cumprimento de obrigação legal ou regulatória.',
        ],
      },
      {
        heading: '3. Compartilhamento e operadores',
        body: [
          'Compartilhamos dados apenas para prestar os serviços, com: Supabase (hospedagem, banco de dados e armazenamento de documentos); Mercado Pago (pagamentos); Z-API e Meta WhatsApp (mensageria); Resend (e-mails transacionais); Anthropic (assistente de IA); e fornecedores como companhias aéreas, hotéis, cruzeiros, seguradoras e consulados/embaixadas para realizar suas reservas e pedidos de visto.',
          'Nunca vendemos seus dados pessoais.',
        ],
      },
      {
        heading: '4. Publicidade, análise e plataformas de redes sociais',
        body: [
          'Com seu consentimento, usamos ferramentas de mensuração e publicidade da Meta (Pixel e Conversions API do Facebook/Instagram), do Google (Google Analytics, Google Ads e remarketing) e do TikTok (TikTok Pixel). Essas ferramentas podem usar cookies e receber identificadores criptografados (como e-mail ou ID de dispositivo em hash) para medir campanhas e exibir anúncios relevantes, incluindo públicos personalizados e semelhantes.',
          'Essas plataformas atuam como controladoras independentes ou conjuntas do próprio tratamento. Você pode gerenciar ou revogar o consentimento a qualquer momento no nosso banner de cookies e nas configurações de anúncios de cada plataforma. Veja a lista completa na Política de Cookies.',
        ],
      },
      {
        heading: '5. Transferências internacionais',
        body: [
          'Alguns fornecedores tratam dados fora do Brasil (por exemplo, EUA ou UE). Utilizamos decisões de adequação, cláusulas-padrão contratuais e salvaguardas equivalentes permitidas pela LGPD (art. 33) e pelo GDPR (Capítulo V).',
        ],
      },
      {
        heading: '6. Seus direitos',
        body: [
          'Pela LGPD você pode solicitar: confirmação e acesso; correção; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade; informação sobre compartilhamento; e revogação do consentimento. O GDPR acrescenta limitação e oposição; residentes na Califórnia (CCPA/CPRA) podem solicitar conhecer, excluir, corrigir e recusar o "compartilhamento" para publicidade direcionada.',
          `Para exercer qualquer direito, escreva para ${COMPANY.email}. Você também pode peticionar à ANPD ou à autoridade de proteção de dados competente.`,
        ],
      },
      {
        heading: '7. Retenção e segurança',
        body: [
          'Mantemos os dados apenas pelo tempo necessário às finalidades acima e ao cumprimento de obrigações legais, fiscais e regulatórias, depois os eliminamos ou anonimizamos. Adotamos medidas técnicas e organizacionais, como criptografia em trânsito, controles de acesso e isolamento de armazenamento por cliente (Row Level Security).',
        ],
      },
      {
        heading: '8. Crianças e adolescentes',
        body: [
          'Nossos serviços destinam-se a maiores de 18 anos. Não coletamos dados de menores sem consentimento dos responsáveis; menores em viagem são tratados pela conta do adulto responsável.',
        ],
      },
      {
        heading: '9. Contato e alterações',
        body: [
          `Controlador: ${COMPANY.legalName} (OO Travel), CNPJ ${COMPANY.cnpj}, ${COMPANY.city}. Contato de privacidade / Encarregado: ${COMPANY.email}.`,
          'Podemos atualizar esta política; a data de "última atualização" abaixo indica a versão vigente.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Política de Cookies',
    intro:
      'Esta Política de Cookies explica como a OO Travel usa cookies e tecnologias semelhantes, incluindo pixels de publicidade da Meta, do Google e do TikTok. Cookies não essenciais só são ativados após seu consentimento no banner de cookies.',
    sections: [
      {
        heading: '1. O que são cookies',
        body: [
          'Cookies são pequenos arquivos guardados no seu dispositivo. Também usamos tecnologias semelhantes, como pixels, tags, armazenamento local e SDKs. Eles fazem o site funcionar, lembram preferências, medem desempenho e apoiam a publicidade.',
        ],
      },
      {
        heading: '2. Categorias que usamos',
        body: [
          '- Estritamente necessários: autenticação, segurança, sessão e idioma. Sempre ativos; não exigem consentimento.',
          '- Funcionais: lembram preferências, como idioma e escolhas de cookies.',
          '- Análise: entendem como o site é usado (ex.: Google Analytics). Mediante consentimento.',
          '- Publicidade / marketing: medem campanhas e personalizam anúncios. Mediante consentimento.',
        ],
      },
      {
        heading: '3. Tecnologias de terceiros (publicidade e análise)',
        body: [
          '- Meta Pixel e Conversions API (Meta): medem campanhas no Facebook/Instagram e criam públicos personalizados e semelhantes.',
          '- Google Analytics, Google Ads e remarketing (Google): medem tráfego e conversões e apoiam o retargeting na rede Google e no YouTube.',
          '- TikTok Pixel (TikTok): mede campanhas no TikTok e apoia a criação de públicos.',
          'Esses provedores podem receber um identificador em hash e dados de eventos, tratados conforme suas próprias políticas, como controladores independentes ou conjuntos.',
        ],
      },
      {
        heading: '4. Como gerenciar seu consentimento',
        body: [
          'Na primeira visita, o banner permite aceitar ou recusar cookies não essenciais. Você pode mudar sua escolha a qualquer momento reabrindo as configurações de cookies pelo banner ou limpando os cookies no navegador. Recusar cookies de publicidade não afeta o acesso ao portal.',
          'Você também pode recusar diretamente: configurações de anúncios da Meta e do Google, ajustes do app TikTok e controles do navegador (incluindo sinais "Do Not Track" / Global Privacy Control, que respeitamos quando exigido).',
        ],
      },
      {
        heading: '5. Mais informações',
        body: [`Dúvidas sobre cookies: ${COMPANY.email}. Veja também nossa Política de Privacidade.`],
      },
    ],
  },
  terms: {
    title: 'Termos de Uso',
    intro:
      'Estes Termos de Uso regem o acesso ao site e ao portal do cliente da OO Travel, operados por 63.588.045 OMAR OUKHIRA (CNPJ 63.588.045/0001-49). Ao usar o site, você concorda com estes termos.',
    sections: [
      {
        heading: '1. Quem somos',
        body: [
          'A OO Travel é uma agência de viagens independente (MEI, CNAE 7911-2/00) registrada em São Paulo. Atuamos como intermediários entre você e os fornecedores de viagem (companhias aéreas, hotéis, cruzeiros, transporte, seguros) e auxiliamos com documentação de visto e instalação.',
        ],
      },
      {
        heading: '2. Elegibilidade e contas',
        body: [
          'Você deve ter ao menos 18 anos e fornecer informações corretas. É responsável por manter suas credenciais em sigilo e pelas atividades realizadas na sua conta.',
        ],
      },
      {
        heading: '3. Uso aceitável',
        body: [
          '- Não use o serviço de forma ilícita, não envie arquivos maliciosos nem tente acessar dados de outros clientes.',
          '- Os documentos enviados devem ser verdadeiros e seus (ou de viajantes que você esteja autorizado a representar).',
        ],
      },
      {
        heading: '4. Nosso papel como intermediário',
        body: [
          'As reservas também se sujeitam aos termos dos respectivos fornecedores. Organizamos e coordenamos serviços, mas não operamos voos, hotéis ou outros serviços, nem garantimos o resultado de pedidos de visto ou imigração, decididos exclusivamente pela autoridade competente.',
        ],
      },
      {
        heading: '5. Propriedade intelectual',
        body: [
          'O site, a marca, os textos e o design pertencem à OO Travel ou a seus licenciadores e não podem ser copiados ou reutilizados sem autorização.',
        ],
      },
      {
        heading: '6. Isenções e responsabilidade',
        body: [
          'O serviço é fornecido "no estado em que se encontra". Na medida permitida em lei, não respondemos por danos indiretos ou por atos de fornecedores fora do nosso controle razoável. Nada limita os direitos que você tem como consumidor pelo Código de Defesa do Consumidor (Lei 8.078/1990) ou outra norma cogente.',
        ],
      },
      {
        heading: '7. Lei aplicável',
        body: [
          'Estes termos são regidos pela lei brasileira. Os conflitos sujeitam-se ao foro de São Paulo/SP, sem prejuízo do direito do consumidor de demandar em seu domicílio.',
        ],
      },
      {
        heading: '8. Alterações e contato',
        body: [
          `Podemos atualizar estes termos; o uso contínuo significa aceitação. Contato: ${COMPANY.email}.`,
        ],
      },
    ],
  },
  'booking-terms': {
    title: 'Termos de Reserva, Cancelamento e Reembolso',
    intro:
      'Estes termos aplicam-se aos serviços de viagem organizados pela OO Travel e complementam nossos Termos de Uso. Refletem o Código de Defesa do Consumidor (CDC) e as condições dos fornecedores de viagem.',
    sections: [
      {
        heading: '1. Orçamentos e confirmação',
        body: [
          'Os orçamentos têm validade indicada e dependem de disponibilidade e preço do fornecedor no momento da emissão. A reserva só se confirma após o pagamento (ou o sinal acordado) e a confirmação do fornecedor.',
        ],
      },
      {
        heading: '2. Preços e pagamento',
        body: [
          'Os preços são em reais (BRL), salvo indicação em contrário, e podem incluir taxas de serviço. Aceitamos PIX e parcelamento no cartão via Mercado Pago. Impostos, sobretaxas e variações cambiais podem incidir conforme as regras do fornecedor.',
        ],
      },
      {
        heading: '3. Direito de arrependimento (art. 49 do CDC)',
        body: [
          'Em compras a distância, você pode desistir em até 7 dias da contratação, salvo quando o serviço já tiver iniciado ou quando os fornecedores (ex.: companhias aéreas, hotéis) imponham condições não reembolsáveis informadas antes da compra. Nossas taxas de serviço podem ser retidas pelo trabalho já realizado.',
        ],
      },
      {
        heading: '4. Cancelamentos e alterações',
        body: [
          'Cancelamentos e mudanças de data ou nome sujeitam-se às regras e penalidades de cada fornecedor (classe tarifária, diária, cruzeiro), podendo ser parcial ou totalmente não reembolsáveis. Sempre mostraremos as condições aplicáveis antes da confirmação.',
        ],
      },
      {
        heading: '5. Reembolsos',
        body: [
          'Quando houver reembolso, nós o processamos após o reembolso do fornecedor, pelo mesmo meio de pagamento. Os prazos dependem do fornecedor e do meio de pagamento. Nossa taxa de serviço não reembolsável cobre o trabalho de consultoria e organização já entregue.',
        ],
      },
      {
        heading: '6. Vistos, documentos e seguro',
        body: [
          'Preparamos e protocolamos a documentação, mas não garantimos a aprovação de visto ou entrada, decisão exclusiva da autoridade competente. Taxas governamentais e consulares não são reembolsáveis. Recomendamos fortemente o seguro-viagem; você é responsável por passaporte, vistos e exigências sanitárias válidas.',
        ],
      },
      {
        heading: '7. Força maior',
        body: [
          'Não respondemos por falhas decorrentes de eventos fora do controle razoável (eventos da natureza, greves, atos governamentais, pandemias). Nesses casos, aplicam-se as políticas dos fornecedores e a legislação consumerista.',
        ],
      },
      {
        heading: '8. Reclamações',
        body: [
          `Fale primeiro conosco em ${COMPANY.email} e buscaremos resolver. Você também pode usar os canais de consumo (consumidor.gov.br e o PROCON da sua região).`,
        ],
      },
    ],
  },
};

const docs: Record<Lang, Record<LegalSlug, LegalDoc>> = { en, pt };

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as string[]).includes(value);
}

/** Returns the document plus whether English was used as a fallback (fr/ar). */
export function getLegalDoc(
  locale: string,
  slug: LegalSlug,
): { doc: LegalDoc; isFallback: boolean } {
  const lang: Lang = locale === 'pt' ? 'pt' : 'en';
  const isFallback = locale !== 'pt' && locale !== 'en';
  return { doc: docs[lang][slug], isFallback };
}
