'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter, locales, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const labels: Record<Locale, string> = {
  pt: 'PT',
  en: 'EN',
  fr: 'FR',
  ar: 'AR',
};

export function LocalePills() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1.5">
      {locales.map((l) => (
        <button
          key={l}
          disabled={isPending}
          onClick={() =>
            startTransition(() => router.replace(pathname, { locale: l }))
          }
          className={cn(
            'cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            l === locale
              ? 'border-accent/40 bg-accent/15 text-accent'
              : 'border-border text-text-muted hover:border-accent/30 hover:text-text-secondary',
          )}
          aria-current={l === locale ? 'true' : undefined}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
