export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Fired by CookieConsent when the visitor picks 'all' or 'necessary', so
// GoogleAnalytics can react immediately without a page reload.
export const CONSENT_CHANGED_EVENT = 'oo-cookie-consent-changed';

const CONSENT_STORAGE_KEY = 'oo-cookie-consent';

export function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === 'all';
  } catch {
    return false;
  }
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fires the Meta Pixel 'Contact' event for a WhatsApp CTA click — the
 * clearest lead-intent signal on the site outside the request/contact
 * forms. No server-side (CAPI) counterpart: a raw outbound link click
 * carries no PII to match on, so the browser-side pixel event is the
 * whole story here.
 */
export function trackWhatsAppClick() {
  if (!hasAnalyticsConsent()) return;
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Contact');
  }
}
