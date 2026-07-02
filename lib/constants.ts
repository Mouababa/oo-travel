import type { ServiceType } from './types';

// Omar's WhatsApp contact (E.164 without the +).
export const WHATSAPP_NUMBER = '5511933210241';

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const SERVICE_TYPES: ServiceType[] = [
  'flight',
  'hotel',
  'tour',
  'visa',
  'cruise',
  'corporate',
  'legal',
  'car_rental',
];
