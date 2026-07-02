'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Globe, MapPin, Languages, Headset, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Stat = {
  icon: LucideIcon;
  /** Target number to count up to. */
  value: number;
  /** Suffix glyph shown after the number (e.g. "+", "/7"). */
  suffix?: string;
  labelKey: 'destinations' | 'trips' | 'languages' | 'support';
};

const STATS: Stat[] = [
  { icon: Globe, value: 50, suffix: '+', labelKey: 'destinations' },
  { icon: MapPin, value: 1200, suffix: '+', labelKey: 'trips' },
  { icon: Languages, value: 4, labelKey: 'languages' },
  { icon: Headset, value: 24, suffix: '/7', labelKey: 'support' },
];

const COUNT_MS = 2200;

/** Ease-out quart — fast start, luxuriously slow settle (from the source variant). */
function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function useCountUp(target: number, active: boolean) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return;

    // Respect reduced-motion: jump straight to the final value.
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setN(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / COUNT_MS, 1);
      setN(Math.floor(easeOutQuart(progress) * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setN(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);

  return n;
}

function StatCard({ stat, index, active }: { stat: Stat; index: number; active: boolean }) {
  const t = useTranslations('home.stats');
  const n = useCountUp(stat.value, active);
  const Icon = stat.icon;

  return (
    <div
      className={cn(
        'relative flex flex-col items-center px-4 py-10 text-center transition-all duration-700 ease-out md:px-6',
        active ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
      )}
      style={{ transitionDelay: active ? `${index * 110}ms` : '0ms' }}
    >
      {/* Gold-gradient icon badge. */}
      <span
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gradient-to-br from-gold/20 to-gold/5 text-gold transition-transform duration-500',
          active ? 'scale-100' : 'scale-90',
        )}
      >
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </span>

      <span className="mt-6 font-heading text-5xl font-semibold tabular-nums tracking-heading md:text-6xl">
        <span className="text-gradient-gold">
          {n.toLocaleString()}
          {stat.suffix}
        </span>
      </span>

      <span className="eyebrow mt-3 text-text-secondary">{t(stat.labelKey)}</span>
    </div>
  );
}

export function TrustStats() {
  const t = useTranslations('home.stats');
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setActive(true);
          io.disconnect(); // count once, never reset
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-16 md:py-24">
      <div className="container">
        {/* Glass container with iridescent frame + gold corner glows. */}
        <div className="glass iridescent-ring relative overflow-hidden rounded-3xl shadow-glow">
          {/* Warm gold wash + corner accents (pointer-events-none decoration). */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 80% at 50% -20%, rgba(245,158,11,0.06), transparent 60%)',
            }}
          />
          <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

          {/* Stats grid with grid-position-correct gold dividers. Uses logical
              border-s (RTL-safe) rather than divide-x, which mis-borders the
              second-row start cell on a wrapping grid. Breakpoints:
              mobile 1-col (top borders) · sm 2×2 · lg 1×4. */}
          <div
            className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 [&>*]:border-gold/15 [&>*:not(:first-child)]:border-t sm:[&>*]:border-t-0 sm:[&>*:nth-child(n+3)]:border-t sm:[&>*:nth-child(even)]:border-s lg:[&>*]:border-t-0 lg:[&>*:not(:first-child)]:border-s"
          >
            {STATS.map((stat, index) => (
              <StatCard key={stat.labelKey} stat={stat} index={index} active={active} />
            ))}
          </div>
        </div>

        <p className="mt-6 text-center font-display text-sm font-light text-text-muted">
          {t('caption')}
        </p>
      </div>
    </section>
  );
}
