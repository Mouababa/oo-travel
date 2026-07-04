'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useToast } from '@/lib/use-toast';
import { createInvoiceAction } from '@/lib/actions';
import { formatBRL } from '@/lib/utils';
import type { User, Booking, Invoice, InvoiceLineItem } from '@/lib/types';

const EMPTY_ITEM: InvoiceLineItem = { label: '', amount_brl: 0 };

export function CreateInvoiceModal({
  open,
  onClose,
  clients,
  bookings,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  clients: User[];
  bookings: Booking[];
  onCreated: (invoice: Invoice) => void;
}) {
  const t = useTranslations('admin.invoices');
  const { toast } = useToast();

  const [clientId, setClientId] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<InvoiceLineItem[]>([{ ...EMPTY_ITEM }]);
  const [submitting, setSubmitting] = useState(false);

  const clientBookings = useMemo(
    () => bookings.filter((b) => b.client_id === clientId),
    [bookings, clientId],
  );
  const total = items.reduce((sum, li) => sum + (li.amount_brl || 0), 0);
  const canSubmit =
    clientId && items.length > 0 && items.every((li) => li.label.trim() && li.amount_brl > 0);

  function reset() {
    setClientId('');
    setBookingId('');
    setDueDate('');
    setItems([{ ...EMPTY_ITEM }]);
  }

  function updateItem(index: number, patch: Partial<InvoiceLineItem>) {
    setItems((list) => list.map((li, i) => (i === index ? { ...li, ...patch } : li)));
  }

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    const result = await createInvoiceAction({
      client_id: clientId,
      booking_id: bookingId || undefined,
      line_items: items,
      due_date: dueDate || undefined,
    });
    setSubmitting(false);

    if (result.ok) {
      toast({ title: t('invoiceCreated'), variant: 'success' });
      if (result.invoice) onCreated(result.invoice);
      reset();
      onClose();
    } else {
      toast({ title: t('invoiceCreateError'), variant: 'danger' });
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
          <Label htmlFor="invoice-client">{t('client')}</Label>
          <Select
            id="invoice-client"
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value);
              setBookingId('');
            }}
          >
            <option value="">{t('selectClient')}</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name}
              </option>
            ))}
          </Select>
        </div>

        {clientId && clientBookings.length > 0 && (
          <div>
            <Label htmlFor="invoice-booking">{t('linkedBooking')}</Label>
            <Select
              id="invoice-booking"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            >
              <option value="">{t('noBooking')}</option>
              {clientBookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.destination}
                  {b.travel_date ? ` · ${b.travel_date}` : ''}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="invoice-due">{t('dueDate')}</Label>
          <Input
            id="invoice-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('lineItems')}</Label>
          {items.map((li, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                placeholder={t('itemLabelPh')}
                value={li.label}
                onChange={(e) => updateItem(i, { label: e.target.value })}
                className="flex-1"
              />
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder={t('itemAmountPh')}
                value={li.amount_brl || ''}
                onChange={(e) => updateItem(i, { amount_brl: Number(e.target.value) || 0 })}
                className="w-32"
              />
              <button
                type="button"
                onClick={() => setItems((list) => list.filter((_, idx) => idx !== i))}
                disabled={items.length === 1}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-text-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={t('removeItem')}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => setItems((list) => [...list, { ...EMPTY_ITEM }])}
          >
            <Plus className="h-4 w-4" />
            {t('addItem')}
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-md border border-border bg-surface-muted px-4 py-3">
          <span className="text-sm text-text-secondary">{t('total')}</span>
          <span className="text-lg font-semibold">{formatBRL(total)}</span>
        </div>

        <Button onClick={submit} disabled={!canSubmit || submitting} className="w-full gap-2">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {t('create')}
        </Button>
      </div>
    </Dialog>
  );
}
