'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, ArrowRight, Loader2, Check } from 'lucide-react';
import { WhatsAppLogo } from '@/components/icons/whatsapp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ServiceIcon } from '@/components/service-icon';
import { useToast } from '@/lib/use-toast';
import { SERVICE_TYPES, whatsappLink } from '@/lib/constants';
import { submitLeadAction } from '@/lib/actions';
import { cn } from '@/lib/utils';
import type { ServiceType } from '@/lib/types';

export function HomeRequestForm() {
  const t = useTranslations('home');
  const tf = useTranslations('home.form');
  const ts = useTranslations('services.items');
  const tc = useTranslations('common');
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState<ServiceType[]>([]);

  function toggleService(s: ServiceType) {
    setServices((list) => (list.includes(s) ? list.filter((x) => x !== s) : [...list, s]));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (services.length === 0) {
      toast({ title: tf('serviceRequired'), variant: 'danger' });
      return;
    }
    const form = e.currentTarget;
    const fd = new FormData(form);
    setSubmitting(true);

    const result = await submitLeadAction({
      full_name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      whatsapp: String(fd.get('whatsapp') ?? '') || undefined,
      service_types: services,
      destination: String(fd.get('destination') ?? '') || undefined,
      message: String(fd.get('message') ?? '') || undefined,
    });

    setSubmitting(false);
    if (result.ok) {
      toast({ title: tf('sent'), variant: 'success' });
      form.reset();
      setServices([]);
    } else {
      toast({ title: tf('error'), variant: 'danger' });
    }
  }

  return (
    <div className="glass-raised mx-auto w-full max-w-2xl rounded-2xl p-6 shadow-glow sm:p-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="rf-name">{tf('name')}</Label>
            <Input id="rf-name" name="name" required />
          </div>
          <div>
            <Label htmlFor="rf-email">{tf('email')}</Label>
            <Input id="rf-email" name="email" type="email" required />
          </div>
        </div>
        <div>
          <Label htmlFor="rf-whatsapp">
            {tf('whatsapp')}{' '}
            <span className="font-normal text-text-muted">({tc('optional')})</span>
          </Label>
          <Input id="rf-whatsapp" name="whatsapp" type="tel" inputMode="tel" />
        </div>
        <div>
          <Label>{tf('service')}</Label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {SERVICE_TYPES.map((s) => {
              const selected = services.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleService(s)}
                  className={cn(
                    'flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
                    selected
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-border text-text-secondary hover:bg-surface-muted',
                  )}
                >
                  {selected ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <ServiceIcon type={s} className="h-3.5 w-3.5" />
                  )}
                  {ts(`${s}.name`)}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <Label htmlFor="rf-dest">
            {tf('destination')}{' '}
            <span className="font-normal text-text-muted">({tc('optional')})</span>
          </Label>
          <Input id="rf-dest" name="destination" placeholder={tf('destinationPh')} />
        </div>
        <div>
          <Label htmlFor="rf-message">
            {tf('message')}{' '}
            <span className="font-normal text-text-muted">({tc('optional')})</span>
          </Label>
          <Textarea id="rf-message" name="message" rows={4} placeholder={tf('messagePh')} />
        </div>
        <Button type="submit" size="lg" className="w-full gap-2" disabled={submitting}>
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4 rtl:rotate-180" />
          )}
          {tf('submit')}
        </Button>
        <p className="text-center text-xs text-text-muted">{tf('privacyNote')}</p>
      </form>

      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-text-secondary">
        <span>{t('orMessage')}</span>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-whatsapp hover:underline"
        >
          <WhatsAppLogo className="h-4 w-4" />
          WhatsApp
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </a>
      </div>
    </div>
  );
}
