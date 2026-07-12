'use client';

import { trackWhatsAppClick } from '@/lib/analytics';
import { whatsappLink } from '@/lib/constants';

/**
 * Thin client wrapper so Server Component pages (page.tsx, footer.tsx)
 * can still fire the Meta Pixel 'Contact' event on click — a Server
 * Component can't attach an onClick handler to a host element itself.
 */
export function WhatsAppLink({
  children,
  className,
  message,
}: {
  children: React.ReactNode;
  className?: string;
  message?: string;
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackWhatsAppClick}
      className={className}
    >
      {children}
    </a>
  );
}
