'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/routing';
import { locales, type Locale } from '@/i18n/routing';
import { Select } from '@/components/ui/select';

const labels: Record<Locale, string> = {
  pt: 'Português',
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
};

export function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onChange(next: string) {
    startTransition(() => {
      router.replace(pathname, { locale: next as Locale });
    });
  }

  return (
    <div className="relative inline-flex items-center">
      {!compact && (
        <Globe className="pointer-events-none absolute start-3 h-4 w-4 text-text-secondary" />
      )}
      <Select
        value={locale}
        onChange={(e) => onChange(e.target.value)}
        disabled={isPending}
        aria-label="Language"
        className={compact ? 'h-9 w-[130px]' : 'h-9 w-[160px] ps-9'}
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {labels[l]}
          </option>
        ))}
      </Select>
    </div>
  );
}
