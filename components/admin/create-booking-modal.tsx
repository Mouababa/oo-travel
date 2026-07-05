'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Loader2 } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { ServiceIcon } from '@/components/service-icon';
import { useToast } from '@/lib/use-toast';
import { createBookingForClientAction } from '@/lib/actions';
import { SERVICE_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { User, Booking, ServiceType } from '@/lib/types';

export function CreateBookingModal({
  open,
  onClose,
  clients,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  clients: User[];
  onCreated: (booking: Booking) => void;
}) {
  const t = useTranslations('admin.bookings');
  const ts = useTranslations('services.items');
  const { toast } = useToast();

  const [clientId, setClientId] = useState('');
  const [services, setServices] = useState<ServiceType[]>([]);
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = clientId && services.length > 0 && destination.trim();

  function reset() {
    setClientId('');
    setServices([]);
    setDestination('');
    setTravelDate('');
    setReturnDate('');
    setNotes('');
  }

  function toggleService(s: ServiceType) {
    setServices((list) => (list.includes(s) ? list.filter((x) => x !== s) : [...list, s]));
  }

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    const result = await createBookingForClientAction({
      client_id: clientId,
      service_types: services,
      destination,
      travel_date: travelDate || undefined,
      return_date: returnDate || undefined,
      notes: notes || undefined,
    });
    setSubmitting(false);

    if (result.ok) {
      toast({ title: t('bookingCreated'), variant: 'success' });
      if (result.booking) onCreated(result.booking);
      reset();
      onClose();
    } else {
      toast({ title: t('bookingCreateError'), variant: 'danger' });
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title={t('createTitle')}
    >
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="booking-client">{t('client')}</Label>
          <Select
            id="booking-client"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="">{t('selectClient')}</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>{t('services')}</Label>
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
                    'flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
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
          <Label htmlFor="booking-destination">{t('destination')}</Label>
          <Input
            id="booking-destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="booking-travel">{t('travelDate')}</Label>
            <Input
              id="booking-travel"
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="booking-return">{t('returnDate')}</Label>
            <Input
              id="booking-return"
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="booking-notes">{t('notes')}</Label>
          <Textarea
            id="booking-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button onClick={submit} disabled={!canSubmit || submitting} className="w-full gap-2">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {t('create')}
        </Button>
      </div>
    </Dialog>
  );
}
