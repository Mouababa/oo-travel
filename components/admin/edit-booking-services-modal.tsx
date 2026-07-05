'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Loader2 } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ServiceIcon } from '@/components/service-icon';
import { useToast } from '@/lib/use-toast';
import { updateBookingServicesAction } from '@/lib/actions';
import { SERVICE_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Booking, ServiceType } from '@/lib/types';

export function EditBookingServicesModal({
  booking,
  open,
  onClose,
  onSaved,
}: {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onSaved: (bookingId: string, serviceTypes: ServiceType[]) => void;
}) {
  const t = useTranslations('admin.bookings');
  const ts = useTranslations('services.items');
  const tc = useTranslations('common');
  const { toast } = useToast();

  const [services, setServices] = useState<ServiceType[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (booking) setServices(booking.service_types);
  }, [booking]);

  function toggleService(s: ServiceType) {
    setServices((list) => (list.includes(s) ? list.filter((x) => x !== s) : [...list, s]));
  }

  async function save() {
    if (!booking || services.length === 0) return;
    setSubmitting(true);
    const result = await updateBookingServicesAction(booking.id, services);
    setSubmitting(false);

    if (result.ok) {
      onSaved(booking.id, services);
      toast({ title: t('servicesUpdated'), variant: 'success' });
      onClose();
    } else {
      toast({ title: t('servicesUpdateError'), variant: 'danger' });
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={t('editServices')}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
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
        <Button
          onClick={save}
          disabled={services.length === 0 || submitting}
          className="w-full gap-2"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {tc('save')}
        </Button>
      </div>
    </Dialog>
  );
}
