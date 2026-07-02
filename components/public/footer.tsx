import { useTranslations } from 'next-intl';
import { MapPin, Mail } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { BrandMark } from '@/components/brand-mark';
import { WhatsAppLogo } from '@/components/icons/whatsapp';
import { whatsappLink } from '@/lib/constants';

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/60">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-3">
          <BrandMark />
          <p className="text-sm text-text-secondary">{t('common.tagline')}</p>
        </div>

        <div>
          <h3 className="eyebrow mb-4 text-text-secondary">
            {t('footer.servicesTitle')}
          </h3>
          <nav className="flex flex-col gap-2 text-sm">
            <Link href="/services" className="text-text-secondary hover:text-accent">
              {t('services.items.flight.name')}
            </Link>
            <Link href="/services" className="text-text-secondary hover:text-accent">
              {t('services.items.visa.name')}
            </Link>
            <Link href="/services" className="text-text-secondary hover:text-accent">
              {t('services.items.cruise.name')}
            </Link>
            <Link href="/services" className="text-text-secondary hover:text-accent">
              {t('services.items.car_rental.name')}
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="eyebrow mb-4 text-text-secondary">
            {t('footer.contactTitle')}
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-text-secondary">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              {t('contact.location')}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" />
              omar@ootravel.com.br
            </li>
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accent"
              >
                <WhatsAppLogo className="h-4 w-4" />
                {t('common.talkOnWhatsapp')}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4 text-text-secondary">
            {t('footer.legalTitle')}
          </h3>
          <nav className="flex flex-col gap-2 text-sm">
            <Link href="/faq" className="text-text-secondary hover:text-accent">
              {t('nav.faq')}
            </Link>
            <Link href="/blog" className="text-text-secondary hover:text-accent">
              {t('nav.blog')}
            </Link>
            <Link href="/legal/privacy" className="text-text-secondary hover:text-accent">
              {t('footer.privacy')}
            </Link>
            <Link href="/legal/cookies" className="text-text-secondary hover:text-accent">
              {t('footer.cookies')}
            </Link>
            <Link href="/legal/terms" className="text-text-secondary hover:text-accent">
              {t('footer.terms')}
            </Link>
            <Link
              href="/legal/booking-terms"
              className="text-text-secondary hover:text-accent"
            >
              {t('footer.bookingTerms')}
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col gap-1 py-4 text-xs text-text-muted md:flex-row md:items-center md:justify-between">
          <span>
            © {year} OO Travel. {t('footer.rights')}
          </span>
          <span>{t('footer.mei')}</span>
        </div>
      </div>
    </footer>
  );
}
