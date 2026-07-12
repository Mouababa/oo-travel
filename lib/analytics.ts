export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Fired by CookieConsent when the visitor picks 'all' or 'necessary', so
// GoogleAnalytics can react immediately without a page reload.
export const CONSENT_CHANGED_EVENT = 'oo-cookie-consent-changed';
