'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { META_PIXEL_ID, CONSENT_CHANGED_EVENT } from '@/lib/analytics';

const STORAGE_KEY = 'oo-cookie-consent';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Only loads once the visitor has accepted the 'all' cookie choice
 * (components/public/cookie-consent.tsx) — never on 'necessary'.
 *
 * No <noscript> fallback pixel: that's normally there for visitors with JS
 * disabled, but consent itself is only ever granted through this app's
 * client-side banner — a no-JS visitor can never reach a granted state, so
 * an unconditional <noscript> tag would fire on every page load regardless
 * of consent, defeating the point of gating this at all.
 */
export function MetaPixel() {
  const [enabled, setEnabled] = useState(false);
  const pathname = usePathname();
  const isFirstPathname = useRef(true);

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

  // Next.js routes client-side, so fbq only sees the very first URL unless
  // we re-fire PageView on route changes. The initial PageView is sent by
  // the init script itself (below), so this skips its first run to avoid
  // double-counting that same load.
  useEffect(() => {
    if (isFirstPathname.current) {
      isFirstPathname.current = false;
      return;
    }
    if (enabled && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [pathname, enabled]);

  if (!enabled || !META_PIXEL_ID) return null;

  return (
    <Script id="meta-pixel-init" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
