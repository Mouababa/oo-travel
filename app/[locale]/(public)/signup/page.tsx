'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Plane, CheckCircle2 } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/lib/use-toast';
import { createClient } from '@/lib/supabase/client';
import { SITE_URL } from '@/lib/seo';

const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

export default function SignupPage() {
  const t = useTranslations('signup');
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ title: t('passwordMismatch'), variant: 'danger' });
      return;
    }
    if (password.length < 8) {
      toast({ title: t('passwordTooShort'), variant: 'danger' });
      return;
    }

    setLoading(true);

    if (MOCK_MODE) {
      setLoading(false);
      setSubmitted(true);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, preferred_language: locale },
        // Without this, Supabase falls back to the project's default Site
        // URL (still localhost:3000 from local dev) — the confirmation
        // email would send a real customer to a dead link.
        emailRedirectTo: `${SITE_URL}/api/auth/callback?locale=${locale}`,
      },
    });

    setLoading(false);
    if (error) {
      toast({ title: error.message, variant: 'danger' });
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="container flex min-h-[70vh] items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center pt-8 text-center">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <h1 className="text-xl font-semibold">{t('successTitle')}</h1>
            <p className="mt-2 text-sm text-text-secondary">{t('successBody')}</p>
            <Button className="mt-6 w-full" onClick={() => router.push('/login')}>
              {t('goToLogin')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">{t('fullName')}</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
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
              <Label htmlFor="phone">{t('phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {t('createAccount')}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-text-secondary">
            {t('haveAccount')}{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="cursor-pointer font-medium text-accent hover:underline"
            >
              {t('signInLink')}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
