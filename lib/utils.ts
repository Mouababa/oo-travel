import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function formatDate(date: string | Date, locale = 'pt-BR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

const localeToIntl: Record<string, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  fr: 'fr-FR',
  ar: 'ar-SA',
};

export function intlLocale(locale: string): string {
  return localeToIntl[locale] ?? 'pt-BR';
}
