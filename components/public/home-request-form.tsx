'use client';

import { useTranslations } from 'next-intl';
import { Send, ArrowRight } from 'lucide-react';
import { WhatsAppLogo } from '@/components/icons/whatsapp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useToast } from '@/lib/use-toast';
import { SERVICE_TYPES, whatsappLink } from '@/lib/constants';

export function HomeRequestForm() {
  const t = useTranslations('home');
  const tf = useTranslations('home.form');
  const ts = useTranslations('services.items');
  const tc = useTranslations('common');
  const { toast } = useToast();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast({ title: tf('sent'), variant: 'success' });
    (e.target as HTMLFormElement).reset();
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="rf-whatsapp">
              {tf('whatsapp')}{' '}
              <span className="font-normal text-text-muted">({tc('optional')})</span>
            </Label>
            <Input id="rf-whatsapp" name="whatsapp" type="tel" inputMode="tel" />
          </div>
          <div>
            <Label htmlFor="rf-service">{tf('service')}</Label>
            <Select id="rf-service" name="service" defaultValue="" required>
              <option value="" disabled>
                {tf('servicePlaceholder')}
              </option>
              {SERVICE_TYPES.map((s) => (
                <option key={s} value={s}>
                  {ts(`${s}.name`)}
                </option>
              ))}
            </Select>
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
        <Button type="submit" size="lg" className="w-full gap-2">
          <Send className="h-4 w-4 rtl:rotate-180" />
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
