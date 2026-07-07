import type { ServiceType, Currency } from './types';

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
  // TikTok URL pending — footer hides the icon until this is filled in.
  tiktok: '',
};

export type BankDetails = {
  bankName: string;
  bankAddress?: string;
  accountHolder: string;
  accountNumber?: string;
  iban?: string;
  rib?: string;
  swift: string;
};

export const CIH_BANK_DETAILS: BankDetails = {
  bankName: 'CIH Bank',
  accountHolder: 'KHALID OUKHIRA',
  rib: '230 780 4610278211002800 40',
  iban: 'MA64 2307 8046 1027 8211 0028 0040',
  swift: 'CIHMMAMC',
};

// Same Revolut account receives USD, EUR and CAD — Revolut settles all
// three into one multi-currency account, no separate IBAN per currency.
export const REVOLUT_BANK_DETAILS: BankDetails = {
  bankName: 'Revolut Technologies Singapore Pte. Ltd',
  bankAddress: '6 Battery Road, Floor 6-01, 049909, Singapore, Singapore',
  accountHolder: 'Omar Oukhira',
  accountNumber: '6105226606',
  swift: 'REVOSGS2',
};

const REVOLUT_CURRENCIES: Currency[] = ['USD', 'EUR', 'CAD'];

/** Bank transfer settles in MAD (CIH) or USD/EUR/CAD (Revolut) — BRL
 * invoices use PIX instead, so CIH is just the fallback for that case. */
export function bankDetailsForCurrency(currency: Currency): BankDetails {
  return REVOLUT_CURRENCIES.includes(currency) ? REVOLUT_BANK_DETAILS : CIH_BANK_DETAILS;
}
