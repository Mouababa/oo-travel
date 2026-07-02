import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight, Globe, ShieldCheck, Clock, Check, Star } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';
import { pageMetadata, reviewsLd } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { WhatsAppIcon } from '@/components/icons/whatsapp';
import { ServiceCard } from '@/components/public/service-card';
import { HomeRequestForm } from '@/components/public/home-request-form';
import { TrustStats } from '@/components/public/trust-stats';
import { EditorialTestimonials } from '@/components/public/editorial-testimonials';
import { ExperienceGallery } from '@/components/public/experience-gallery';
import { RemoteImage } from '@/components/remote-image';
import { SERVICE_TYPES, whatsappLink } from '@/lib/constants';
import { scenePhoto, type Scene } from '@/lib/images';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, 'home', '');
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tt = await getTranslations('home.testimonials');

  const interest: {
    icon: typeof Globe;
    title: string;
    desc: string;
    stat: string;
    scene: Scene;
  }[] = [
    { icon: Globe, title: t('interest1Title'), desc: t('interest1Desc'), stat: t('interest1Stat'), scene: 'tokyo' },
    { icon: ShieldCheck, title: t('interest2Title'), desc: t('interest2Desc'), stat: t('interest2Stat'), scene: 'passport' },
    { icon: Clock, title: t('interest3Title'), desc: t('interest3Desc'), stat: t('interest3Stat'), scene: 'santorini' },
  ];

  // Mirrors the visible EditorialTestimonials carousel (same quotes, same
  // 5-star rating already rendered) — Review/AggregateRating schema.
  const reviews = [
    { author: tt('t1Name'), quote: tt('t1Quote') },
    { author: tt('t2Name'), quote: tt('t2Quote') },
    { author: tt('t3Name'), quote: tt('t3Quote') },
  ];

  return (
    <>
      <JsonLd data={reviewsLd(reviews)} />
      {/* ───── A · ATTENTION ───── */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        {/* Animated gradient base (always visible). */}
        <div
          className="absolute inset-0 animate-gradient-shift"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #08080F 0%, #16162A 35%, #1E1B4B 60%, #08080F 100%)',
            backgroundSize: '300% 300%',
          }}
        />
        {/* Looping aerial video (falls back to gradient + poster on failure).
            preload="none": the poster covers the initial paint, so the video
            bytes shouldn't compete with above-the-fold resources for
            bandwidth — the browser only starts fetching once autoplay kicks in. */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={scenePhoto('heroAerial', 1600, 900)}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-flying-over-the-mountains-1573/1080p.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark overlay. */}
        <div className="absolute inset-0 bg-void/55" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent" />

        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-eyebrow text-gold shadow-glow">
              <Star className="h-3 w-3 fill-gold" />
              {t('eyebrow')}
            </span>

            <h1 className="mt-7 font-heading text-6xl font-semibold leading-[1.04] tracking-heading md:text-8xl">
              <span className="text-gradient">{t('h1Line1')}</span>
              <br />
              <span className="text-gradient-iridescent italic">{t('h1Line2')}</span>
            </h1>

            <hr className="rule-gold mt-7" />

            <p className="mt-6 max-w-xl font-display text-lg font-light leading-relaxed text-text-secondary md:text-xl">
              {t('subheadline')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#request">
                <Button size="lg" className="gap-2">
                  {t('ctaPrimary')}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Button>
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="whatsapp" className="gap-2">
                  <WhatsAppIcon className="h-5 w-5" />
                  {t('ctaSecondary')}
                </Button>
              </a>
            </div>

            <p className="mt-4 text-sm text-text-muted">
              {t('ctaMicrocopy')}{' '}
              <Link href="/portal" className="font-medium text-accent hover:underline">
                {t('ctaPortalLink')}
              </Link>
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
              {[t('trust1'), t('trust2'), t('trust3')].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-success" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── Trust band (count-up social proof) ───── */}
      <TrustStats />

      {/* ───── I · INTEREST ───── */}
      <section className="relative py-16 md:py-24">
        <div className="container">
          <hr className="rule-gold mx-auto" />
          <h2 className="mt-6 text-center font-heading text-4xl font-semibold tracking-heading md:text-5xl">
            <span className="text-gradient">{t('interestHeading')}</span>
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {interest.map((card) => (
              <div
                key={card.title}
                className="lift group relative overflow-hidden rounded-xl border border-accent/15 bg-surface/70 backdrop-blur hover:border-accent/40 hover:shadow-glow"
              >
                <div className="relative h-36 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-surface-raised to-void" />
                  <RemoteImage
                    src={scenePhoto(card.scene, 600, 360)}
                    seed={`interest-${card.scene}`}
                    w={600}
                    h={360}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                  <span className="absolute bottom-3 start-3 flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-void/60 text-accent backdrop-blur">
                    <card.icon className="h-5 w-5" />
                  </span>
                </div>
                <div className="p-5">
                  <p className="eyebrow text-gold">{card.stat}</p>
                  <h3 className="mt-2 font-heading text-2xl font-semibold text-text-primary">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 font-display text-sm font-light text-text-secondary">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── D · DESIRE ───── */}
      <section className="relative py-16 md:py-24">
        <div className="container">
          <hr className="rule-gold mx-auto" />
          <h2 className="mt-6 text-center font-heading text-4xl font-semibold tracking-heading md:text-5xl">
            <span className="text-gradient">{t('desireHeading')}</span>
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICE_TYPES.map((s) => (
              <ServiceCard key={s} type={s} />
            ))}
          </div>

          {/* Social proof — interactive editorial carousel (Magic MCP pattern) */}
          <hr className="rule-gold mx-auto mt-20" />
          <h3 className="mt-6 text-center font-heading text-3xl font-semibold tracking-heading md:text-4xl">
            <span className="text-gradient">{tt('heading')}</span>
          </h3>
          <EditorialTestimonials />
        </div>
      </section>

      {/* ───── Experience gallery (floating client photos) ───── */}
      <ExperienceGallery />

      {/* ───── A · ACTION ───── */}
      <section id="request" className="relative py-16 md:py-24">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 40%, rgba(99,102,241,0.12), transparent 70%)',
          }}
        />
        <div className="container relative">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <hr className="rule-gold mx-auto" />
            <h2 className="mt-6 font-heading text-4xl font-semibold tracking-heading md:text-5xl">
              <span className="text-gradient-gold">{t('actionHeading')}</span>
            </h2>
            <p className="mt-4 font-display font-light text-text-secondary">{t('actionSubtext')}</p>
          </div>
          <HomeRequestForm />
        </div>
      </section>
    </>
  );
}
