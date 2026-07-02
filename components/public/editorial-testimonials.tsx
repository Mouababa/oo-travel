'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Editorial testimonial carousel.
 *
 * Adapted from the 21st.dev "Editorial Testimonial" pattern (Magic MCP) into
 * the OO Travel design system: Cormorant italic quotes, gold oversized index,
 * flag avatars, glass surface, and full RTL support. Pure CSS transitions —
 * no framer-motion dependency, and the global prefers-reduced-motion rule
 * neutralises the fades automatically.
 */
export function EditorialTestimonials() {
  const tt = useTranslations('home.testimonials');

  const items = [
    { quote: tt('t1Quote'), name: tt('t1Name'), trip: tt('t1Trip'), flag: tt('t1Flag') },
    { quote: tt('t2Quote'), name: tt('t2Name'), trip: tt('t2Trip'), flag: tt('t2Flag') },
    { quote: tt('t3Quote'), name: tt('t3Name'), trip: tt('t3Trip'), flag: tt('t3Flag') },
  ];

  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  function change(index: number) {
    if (index === active || transitioning) return;
    setTransitioning(true);
    window.setTimeout(() => {
      setActive(index);
      window.setTimeout(() => setTransitioning(false), 50);
    }, 280);
  }

  const prev = () => change(active === 0 ? items.length - 1 : active - 1);
  const next = () => change(active === items.length - 1 ? 0 : active + 1);

  const current = items[active];
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="glass iridescent-ring mx-auto mt-10 max-w-3xl rounded-2xl p-8 md:p-12">
      <div className="flex items-start gap-6 md:gap-8">
        {/* Oversized index numeral — quiet luxury punctuation. */}
        <span
          className="select-none font-heading text-7xl font-semibold leading-none text-gold/15 md:text-8xl"
          style={{ fontFeatureSettings: '"tnum"' }}
          aria-hidden
        >
          {pad(active + 1)}
        </span>

        <div className="flex-1 pt-2">
          <div className="mb-4 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} className="h-4 w-4 fill-gold text-gold" />
            ))}
          </div>

          <blockquote
            className={cn(
              'font-heading text-2xl font-medium italic leading-snug text-text-primary transition-all duration-300 md:text-3xl',
              transitioning
                ? 'translate-x-4 opacity-0 rtl:-translate-x-4'
                : 'translate-x-0 opacity-100',
            )}
          >
            “{current.quote}”
          </blockquote>

          <figcaption
            className={cn(
              'mt-8 flex items-center gap-4 transition-opacity duration-300',
              transitioning ? 'opacity-0' : 'opacity-100',
            )}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-xl">
              {current.flag}
            </span>
            <span>
              <span className="block font-display text-sm font-medium text-text-primary">
                {current.name}
              </span>
              <span className="block font-display text-xs text-text-muted">
                {current.trip}
              </span>
            </span>
          </figcaption>
        </div>
      </div>

      {/* Vertical-line selector + counter + arrows. */}
      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            {items.map((item, index) => (
              <button
                key={item.name}
                onClick={() => change(index)}
                className="group relative cursor-pointer py-3"
                aria-label={`${item.name} — ${index + 1}`}
                aria-current={index === active}
              >
                <span
                  className={cn(
                    'block h-px transition-all duration-500 ease-out',
                    index === active
                      ? 'w-12 bg-gold'
                      : 'w-6 bg-text-muted/30 group-hover:w-8 group-hover:bg-text-muted/60',
                  )}
                />
              </button>
            ))}
          </div>
          <span className="font-display text-xs uppercase tracking-eyebrow text-text-muted">
            {pad(active + 1)} / {pad(items.length)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            aria-label="Previous"
            className="cursor-pointer rounded-full p-2 text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary"
          >
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="cursor-pointer rounded-full p-2 text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary"
          >
            <ChevronRight className="h-5 w-5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
