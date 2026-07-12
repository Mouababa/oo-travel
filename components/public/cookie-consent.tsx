'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Cookie } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { CONSENT_CHANGED_EVENT } from '@/lib/analytics';

const STORAGE_KEY = 'oo-cookie-consent';

/**
 * Lightweight consent banner. Choice is stored locally; advertising/analytics
 * pixels (Meta, Google, TikTok) should only initialize once consent === 'all'.
 */
export function CookieConsent() {
  const t = useTranslations('cookies');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Storage unavailable — show the banner anyway.
      setVisible(true);
    }
  }, []);

  function decide(choice: 'all' | 'necessary') {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    // Lets GoogleAnalytics (components/analytics/google-analytics.tsx) load
    // immediately on 'all' without needing a page reload.
    window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="glass-raised mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl p-4 shadow-glow sm:flex-row sm:items-center sm:p-5">
        <div className="flex flex-1 items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
            <Cookie className="h-5 w-5" />
          </span>
          <p className="text-sm text-text-secondary">
            {t('bannerText')}{' '}
            <Link href="/legal/cookies" className="font-medium text-accent hover:underline">
              {t('bannerLink')}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" size="sm" onClick={() => decide('necessary')}>
            {t('reject')}
          </Button>
          <Button size="sm" onClick={() => decide('all')}>
            {t('accept')}
          </Button>
        </div>
      </div>
    </div>
  );
}
