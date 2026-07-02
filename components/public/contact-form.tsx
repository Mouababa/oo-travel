'use client';

import { useTranslations } from 'next-intl';
import { MapPin, Mail } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/whatsapp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/lib/use-toast';
import { whatsappLink } from '@/lib/constants';

export function ContactContent() {
  const t = useTranslations('contact');
  const tc = useTranslations('common');
  const { toast } = useToast();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast({ title: t('sent'), variant: 'success' });
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="container max-w-5xl py-16">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold md:text-4xl">{t('title')}</h1>
        <p className="mt-3 text-lg text-text-secondary">{t('subtitle')}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">{t('name')}</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">{t('phone')}</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>
              <div>
                <Label htmlFor="message">{t('message')}</Label>
                <Textarea id="message" name="message" rows={5} required />
              </div>
              <Button type="submit">{t('send')}</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 pt-6 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                {t('location')}
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                omar@ootravel.com.br
              </div>
            </CardContent>
          </Card>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" className="w-full gap-2">
              <WhatsAppIcon className="h-5 w-5" />
              {tc('talkOnWhatsapp')}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
