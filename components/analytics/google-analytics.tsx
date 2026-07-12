'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { GA_MEASUREMENT_ID, CONSENT_CHANGED_EVENT } from '@/lib/analytics';

const STORAGE_KEY = 'oo-cookie-consent';

/** Only loads gtag.js once the visitor has accepted the 'all' cookie
 * choice (components/public/cookie-consent.tsx) — never on 'necessary'. */
export function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    function checkConsent() {
      try {
        setEnabled(localStorage.getItem(STORAGE_KEY) === 'all');
      } catch {
        setEnabled(false);
      }
    }
    checkConsent();
    window.addEventListener(CONSENT_CHANGED_EVENT, checkConsent);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, checkConsent);
  }, []);

  if (!enabled || !GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
