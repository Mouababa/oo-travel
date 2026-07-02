'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { TrendingUp, Layers, Award, Languages, ArrowRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * "Journey in Numbers" — About-page credibility band.
 *
 * Combines the DNA of the 21st.dev variants 2 & 3: an editorial header
 * (eyebrow + serif headline), descriptive stat cards (icon · numeral · label ·
 * context line), a diamond gold divider, and a conversion CTA into the lead
 * form. Adapted to project tokens, Cormorant/Montserrat, 4-locale i18n + RTL,
 * pure-CSS count-up (no framer-motion), reduced-motion safe.
 */

type Stat = {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  key: 's1' | 's2' | 's3' | 's4';
};

const STATS: Stat[] = [
  { icon: TrendingUp, value: 10, suffix: '+', key: 's1' },
  { icon: Layers, value: 8, key: 's2' },
  { icon: Award, value: 98, suffix: '%', key: 's3' },
  { icon: Languages, value: 4, key: 's4' },
];

const COUNT_MS = 2200;
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

function useCountUp(target: number, active: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
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
      const p = Math.min((now - start) / COUNT_MS, 1);
      setN(Math.floor(easeOutQuart(p) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return n;
}

function JourneyCard({ stat, index, active }: { stat: Stat; index: number; active: boolean }) {
  const t = useTranslations('about.journey');
  const n = useCountUp(stat.value, active);
  const Icon = stat.icon;

  return (
    <div
      className={cn(
        'group glass iridescent-ring relative overflow-hidden rounded-3xl p-7 transition-all duration-700 ease-out hover:-translate-y-1',
        active ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
      )}
      style={{ transitionDelay: active ? `${index * 110}ms` : '0ms' }}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold transition-transform duration-500 group-hover:scale-110">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </span>

      <div className="mt-6 font-heading text-5xl font-semibold tabular-nums tracking-heading md:text-6xl">
        <span className="text-gradient-gold">
          {n.toLocaleString()}
          {stat.suffix}
        </span>
      </div>

      <p className="eyebrow mt-3 text-gold/80">{t(`${stat.key}Label`)}</p>
      <p className="mt-2 font-display text-sm font-light leading-relaxed text-text-secondary">
        {t(`${stat.key}Desc`)}
      </p>
    </div>
  );
}

export function JourneyStats() {
  const t = useTranslations('about.journey');
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative mt-20 py-4">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow text-gold">{t('eyebrow')}</p>
        <h2 className="mt-4 font-heading text-4xl font-semibold tracking-heading md:text-5xl">
          <span className="text-gradient">{t('heading')}</span>
        </h2>
        <hr className="rule-gold mx-auto mt-6" />
      </div>

      {/* Descriptive stat cards */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, index) => (
          <JourneyCard key={stat.key} stat={stat} index={index} active={active} />
        ))}
      </div>

      {/* Diamond gold divider */}
      <div className="relative mx-auto mt-14 flex max-w-md items-center justify-center">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <span className="absolute h-2 w-2 rotate-45 border border-gold/60 bg-gold/20" />
      </div>

      {/* CTA into the lead form */}
      <div className="mt-10 text-center">
        <a
          href={`/${locale}#request`}
          className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-8 py-3.5 font-display text-sm font-semibold uppercase tracking-eyebrow text-gold transition-all duration-300 hover:border-gold/60 hover:bg-gold/20 hover:shadow-glow"
        >
          {t('cta')}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </a>
      </div>
    </section>
  );
}
