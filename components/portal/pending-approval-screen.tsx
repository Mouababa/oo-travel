'use client';

import { useTranslations } from 'next-intl';
import { Clock, XCircle, LogOut, MessageCircle } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { whatsappLink } from '@/lib/constants';

const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

export function PendingApprovalScreen({ status }: { status: 'pending' | 'rejected' }) {
  const t = useTranslations('portal.pendingApproval');
  const router = useRouter();
  const rejected = status === 'rejected';

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center pt-8 text-center">
          <span
            className={
              rejected
                ? 'mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger'
                : 'mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold'
            }
          >
            {rejected ? <XCircle className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
          </span>
          <h1 className="text-xl font-semibold">
            {rejected ? t('rejectedTitle') : t('pendingTitle')}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            {rejected ? t('rejectedBody') : t('pendingBody')}
          </p>

          <div className="mt-6 flex w-full flex-col gap-2">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button variant="whatsapp" className="w-full gap-2">
                <MessageCircle className="h-4 w-4" />
                {t('contactWhatsapp')}
              </Button>
            </a>
            <Button
              variant="ghost"
              className="w-full gap-2"
              onClick={async () => {
                if (!MOCK_MODE) await createClient().auth.signOut();
                router.push('/login');
              }}
            >
              <LogOut className="h-4 w-4" />
              {t('logout')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
