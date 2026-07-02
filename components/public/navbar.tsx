'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { BrandMark } from '@/components/brand-mark';
import { cn } from '@/lib/utils';

export function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  // Plain anchor (not the localized <Link>) so the hash survives navigation
  // from any page back to the homepage's #request lead-capture section.
  const requestHref = `/${locale}#request`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/', label: t('home') },
    { href: '/services', label: t('services') },
    { href: '/about', label: t('about') },
    { href: '/blog', label: t('blog') },
    { href: '/contact', label: t('contact') },
  ] as const;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'glass border-b border-accent/15'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher compact />
          <Link
            href="/login"
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            {t('login')}
          </Link>
          <a href={requestHref}>
            <Button size="sm">{t('requestQuote')}</Button>
          </a>
        </div>

        <button
          className="cursor-pointer text-text-primary md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          'glass border-t border-accent/15 md:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <nav className="container flex flex-col gap-1 py-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-text-secondary hover:bg-surface-raised hover:text-text-primary"
            >
              {l.label}
            </Link>
          ))}
          <a href={requestHref} onClick={() => setOpen(false)}>
            <Button size="sm" className="w-full">
              {t('requestQuote')}
            </Button>
          </a>
          <div className="mt-2 flex items-center justify-between gap-2">
            <LocaleSwitcher compact />
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {t('login')}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
