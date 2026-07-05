'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Pencil, Inbox } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Select } from '@/components/ui/select';
import { ServiceBadges } from '@/components/service-badges';
import { EmptyState } from '@/components/empty-state';
import { CreateBookingModal } from '@/components/admin/create-booking-modal';
import { EditBookingServicesModal } from '@/components/admin/edit-booking-services-modal';
import { useToast } from '@/lib/use-toast';
import { updateBookingStatusAction } from '@/lib/actions';
import { formatBRL, formatDate, intlLocale } from '@/lib/utils';
import type { Booking, BookingStatus, ServiceType, User } from '@/lib/types';

const STATUSES: BookingStatus[] = ['pending', 'processing', 'confirmed', 'cancelled'];

export function AdminBookingsClient({
  initialBookings,
  names,
  clients,
  locale,
}: {
  initialBookings: Booking[];
  names: Record<string, string>;
  clients: User[];
  locale: string;
}) {
  const t = useTranslations('admin.bookings');
  const tb = useTranslations('portal.bookings');
  const tStatus = useTranslations('status.booking');
  const ts = useTranslations('services.items');
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  function clientNameFor(clientId: string): string {
    return names[clientId] ?? clients.find((c) => c.id === clientId)?.full_name ?? '—';
  }

  function onBookingCreated(booking: Booking) {
    setBookings((list) => [booking, ...list]);
  }

  function onServicesSaved(bookingId: string, serviceTypes: ServiceType[]) {
    setBookings((list) =>
      list.map((b) => (b.id === bookingId ? { ...b, service_types: serviceTypes } : b)),
    );
  }

  async function onStatusChange(bookingId: string, status: BookingStatus) {
    const previous = bookings;
    setBookings((list) => list.map((b) => (b.id === bookingId ? { ...b, status } : b)));
    setPendingId(bookingId);

    const result = await updateBookingStatusAction(bookingId, status);
    setPendingId(null);

    if (result.ok) {
      toast({ title: t('statusUpdated'), variant: 'success' });
    } else {
      setBookings(previous);
      toast({ title: t('statusUpdateError'), variant: 'danger' });
    }
  }

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        action={
          <Button className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            {t('newBooking')}
          </Button>
        }
      />

      <CreateBookingModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        clients={clients}
        onCreated={onBookingCreated}
      />
      <EditBookingServicesModal
        booking={editingBooking}
        open={editingBooking !== null}
        onClose={() => setEditingBooking(null)}
        onSaved={onServicesSaved}
      />

      {bookings.length === 0 ? (
        <EmptyState icon={Inbox} title={t('empty')} />
      ) : (
        <Card>
          <CardContent className="px-0 py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('client')}</TableHead>
                  <TableHead>{tb('service')}</TableHead>
                  <TableHead>{tb('destination')}</TableHead>
                  <TableHead>{tb('dates')}</TableHead>
                  <TableHead>{tb('status')}</TableHead>
                  <TableHead className="text-end">{tb('amount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{clientNameFor(b.client_id)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <ServiceBadges
                          items={b.service_types.map((t) => ({ type: t, label: ts(`${t}.name`) }))}
                        />
                        <button
                          type="button"
                          onClick={() => setEditingBooking(b)}
                          className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary"
                          aria-label={t('editServices')}
                          title={t('editServices')}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary">{b.destination}</TableCell>
                    <TableCell className="whitespace-nowrap text-text-secondary">
                      {b.travel_date ? formatDate(b.travel_date, intlLocale(locale)) : '—'}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={b.status}
                        disabled={pendingId === b.id}
                        onChange={(e) => onStatusChange(b.id, e.target.value as BookingStatus)}
                        className="h-9 w-40 text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {tStatus(s)}
                          </option>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell className="text-end font-medium">
                      {b.amount_brl ? formatBRL(b.amount_brl) : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
