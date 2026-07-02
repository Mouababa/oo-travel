'use client';

import { useTranslations } from 'next-intl';
import { WhatsAppIcon } from '@/components/icons/whatsapp';
import { whatsappLink } from '@/lib/constants';

export function WhatsAppFab() {
  const t = useTranslations('common');
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('talkOnWhatsapp')}
      className="fixed bottom-6 end-6 z-40 flex h-14 w-14 animate-pulse-ring items-center justify-center rounded-full bg-whatsapp text-white shadow-glow-whatsapp transition-transform hover:scale-110"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
