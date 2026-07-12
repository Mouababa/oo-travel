'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Mail, Loader2 } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/whatsapp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/lib/use-toast';
import { whatsappLink } from '@/lib/constants';
import { submitLeadAction, trackLeadConversionAction } from '@/lib/actions';
import { hasAnalyticsConsent, trackWhatsAppClick } from '@/lib/analytics';

export function ContactContent() {
  const t = useTranslations('contact');
  const tc = useTranslations('common');
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setSubmitting(true);

    const email = String(fd.get('email') ?? '');
    const phone = String(fd.get('phone') ?? '') || undefined;

    const result = await submitLeadAction({
      full_name: String(fd.get('name') ?? ''),
      email,
      whatsapp: phone,
      message: String(fd.get('message') ?? '') || undefined,
    });

    setSubmitting(false);
    if (result.ok) {
      toast({ title: t('sent'), variant: 'success' });
      form.reset();

      if (hasAnalyticsConsent()) {
        const eventId = crypto.randomUUID();
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', {}, { eventID: eventId });
        }
        trackLeadConversionAction({
          eventId,
          eventSourceUrl: window.location.href,
          email,
          phone,
        });
      }
    } else {
      toast({ title: t('error'), variant: 'danger' });
    }
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
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {t('send')}
              </Button>
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
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <span>
                  <span className="text-text-muted">{tc('generalInquiries')}: </span>
                  contact@ootravel.com.br
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <span>
                  <span className="text-text-muted">{tc('directContact')}: </span>
                  omar@ootravel.com.br
                </span>
              </div>
            </CardContent>
          </Card>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" onClick={trackWhatsAppClick}>
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
