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

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/1Rvh5Qn9gV/?mibextid=wwXIfr',
  instagram: 'https://www.instagram.com/ootravel.oficial?igsh=aTFhMW51Zjc2eGM3&utm_source=qr',
  youtube: 'https://youtube.com/@ootraveloficial?si=_BYYgAXvRkGjrPby',
};

export const CIH_BANK_DETAILS = {
  bankName: 'CIH Bank',
  accountHolder: 'KHALID OUKHIRA',
  rib: '230 780 4610278211002800 40',
  iban: 'MA64 2307 8046 1027 8211 0028 0040',
  swift: 'CIHMMAMC',
};
