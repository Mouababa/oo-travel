'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plane } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/lib/use-toast';
import { createClient } from '@/lib/supabase/client';

const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

export default function LoginPage() {
  const t = useTranslations('login');
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (MOCK_MODE) {
      // No backend in mock mode — go straight to the portal.
      router.push('/portal');
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: error.message, variant: 'danger' });
      return;
    }
    router.push('/portal');
  }

  async function onMagicLink() {
    if (MOCK_MODE) {
      toast({ title: t('magicLinkSent'), variant: 'success' });
      return;
    }
    if (!email) return;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email });
    toast({
      title: error ? error.message : t('magicLinkSent'),
      variant: error ? 'danger' : 'success',
    });
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Plane className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-semibold">{t('title')}</h1>
            <p className="mt-1 text-sm text-text-secondary">{t('subtitle')}</p>
          </div>

          <form onSubmit={onSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!MOCK_MODE}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {t('signIn')}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-text-secondary">
            <span className="h-px flex-1 bg-border" />
            {t('or')}
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full" onClick={onMagicLink}>
            {t('magicLink')}
          </Button>

          <p className="mt-6 text-center text-xs text-text-secondary">
            {t('noAccount')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
