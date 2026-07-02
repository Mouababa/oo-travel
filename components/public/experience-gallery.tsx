import { getTranslations } from 'next-intl/server';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 23 client photos served from /public/images/gallery (g01..g23).
const IMAGES = Array.from(
  { length: 23 },
  (_, i) => `/images/gallery/g${String(i + 1).padStart(2, '0')}.jpg`,
);

const ROW_ONE = IMAGES.filter((_, i) => i % 2 === 0); // 12
const ROW_TWO = IMAGES.filter((_, i) => i % 2 === 1); // 11

function Tile({ src }: { src: string }) {
  return (
    <div className="lift group relative h-44 w-44 shrink-0 overflow-hidden rounded-xl border border-accent/15 bg-surface sm:h-56 sm:w-56 hover:border-accent/40 hover:shadow-glow">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-raised to-void" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
    </div>
  );
}

function Row({
  images,
  reverse,
}: {
  images: string[];
  reverse?: boolean;
}) {
  // Duplicate the track so the translateX(-50%) loop is seamless.
  const track = [...images, ...images];
  return (
    // Force LTR: the marquee is a flex row animated with translateX(-50%).
    // Under dir="rtl" the tiles lay out right-to-left, so the duplicated
    // halves stop aligning with the leftward transform and the loop jumps.
    // The tiles are decorative (aria-hidden), so pinning LTR keeps the scroll
    // smooth and identical across all locales, Arabic included.
    <div dir="ltr" className="marquee marquee-mask overflow-hidden">
      <div
        className={`marquee-track flex w-max gap-4 ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
      >
        {track.map((src, i) => (
          <Tile key={`${src}-${i}`} src={src} />
        ))}
      </div>
    </div>
  );
}

export async function ExperienceGallery() {
  const t = await getTranslations('home.gallery');

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Futuristic dotted-grid pattern + indigo aura */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(99,102,241,0.12) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage:
            'radial-gradient(70% 60% at 50% 50%, #000 30%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(70% 60% at 50% 50%, #000 30%, transparent 80%)',
        }}
      />

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-medium text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            {t('eyebrow')}
          </span>
          <h2 className="mt-5 font-heading text-3xl font-bold tracking-heading md:text-4xl">
            <span className="text-gradient">{t('heading')}</span>
          </h2>
          <p className="mt-3 text-text-secondary">{t('subtitle')}</p>
        </div>
      </div>

      {/* Floating photo rows (full-bleed) */}
      <div className="relative mt-10 flex flex-col gap-4">
        <Row images={ROW_ONE} />
        <Row images={ROW_TWO} reverse />
      </div>

      <div className="container relative mt-12 flex justify-center">
        <a href="#request">
          <Button size="lg" className="gap-2">
            {t('cta')}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </a>
      </div>
    </section>
  );
}
