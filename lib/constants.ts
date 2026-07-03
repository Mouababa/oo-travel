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

// ⚠️ PLACEHOLDER — replace with Omar's real CIH Bank account details before
// this is shown to real customers. A wrong IBAN/RIB here would send real
// customer money to the wrong place, so this is intentionally left as an
// obvious placeholder rather than a guessed value.
export const CIH_BANK_DETAILS = {
  bankName: 'CIH Bank',
  accountHolder: 'REPLACE — Omar Oukhira / 63.588.045 OMAR OUKHIRA',
  iban: 'REPLACE — MA00 0000 0000 0000 0000 0000',
  swift: 'REPLACE — CIHMMAMC',
};
