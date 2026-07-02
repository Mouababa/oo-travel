'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { WhatsAppLogo } from '@/components/icons/whatsapp';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useToast } from '@/lib/use-toast';
import { mockUser } from '@/lib/mock-data';
import { locales } from '@/i18n/routing';

const langLabels: Record<string, string> = {
  pt: 'Português',
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
};

export default function ProfilePage() {
  const t = useTranslations('portal.profile');
  const tc = useTranslations('common');
  const { toast } = useToast();
  const [user, setUser] = useState(mockUser);

  function save(e: React.FormEvent) {
    e.preventDefault();
    toast({ title: t('saved'), variant: 'success' });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label htmlFor="name">{t('fullName')}</Label>
              <Input
                id="name"
                value={user.full_name}
                onChange={(e) => setUser({ ...user, full_name: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">{t('email')}</Label>
                <Input id="email" type="email" value={user.email} readOnly />
              </div>
              <div>
                <Label htmlFor="phone">{t('phone')}</Label>
                <Input
                  id="phone"
                  value={user.phone ?? ''}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="lang">{t('language')}</Label>
              <Select
                id="lang"
                value={user.preferred_language}
                onChange={(e) =>
                  setUser({ ...user, preferred_language: e.target.value as typeof user.preferred_language })
                }
              >
                {locales.map((l) => (
                  <option key={l} value={l}>
                    {langLabels[l]}
                  </option>
                ))}
              </Select>
            </div>

            <div className="rounded-md border border-border bg-surface-muted p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <WhatsAppLogo className="h-5 w-5" />
                  <span>
                    {t('whatsapp')}:{' '}
                    <span className="font-medium">
                      {user.whatsapp_id ?? '—'}
                    </span>
                  </span>
                </div>
                <Button type="button" variant="outline" size="sm">
                  {t('whatsappLink')}
                </Button>
              </div>
            </div>

            <Button type="submit">{tc('save')}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
