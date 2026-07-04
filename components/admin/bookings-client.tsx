'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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
import { ServiceIcon } from '@/components/service-icon';
import { EmptyState } from '@/components/empty-state';
import { Inbox } from 'lucide-react';
import { useToast } from '@/lib/use-toast';
import { updateBookingStatusAction } from '@/lib/actions';
import { formatBRL, formatDate, intlLocale } from '@/lib/utils';
import type { Booking, BookingStatus } from '@/lib/types';

const STATUSES: BookingStatus[] = ['pending', 'processing', 'confirmed', 'cancelled'];

export function AdminBookingsClient({
  initialBookings,
  names,
  locale,
}: {
  initialBookings: Booking[];
  names: Record<string, string>;
  locale: string;
}) {
  const t = useTranslations('admin.bookings');
  const tb = useTranslations('portal.bookings');
  const tStatus = useTranslations('status.booking');
  const ts = useTranslations('services.items');
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [pendingId, setPendingId] = useState<string | null>(null);

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

  if (bookings.length === 0) {
    return <EmptyState icon={Inbox} title={t('empty')} />;
  }

  return (
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
                <TableCell className="font-medium">{names[b.client_id] ?? '—'}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-2 text-text-secondary">
                    <ServiceIcon type={b.service_type} className="h-4 w-4" />
                    {ts(`${b.service_type}.name`)}
                  </span>
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
  );
}
