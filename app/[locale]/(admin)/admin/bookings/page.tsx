import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { BookingStatusBadge } from '@/components/status-badge';
import { ServiceIcon } from '@/components/service-icon';
import { allBookings, clientNameMap } from '@/lib/data';
import { formatBRL, formatDate, intlLocale } from '@/lib/utils';

export default async function AdminBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin.bookings');
  const tb = await getTranslations('portal.bookings');
  const ts = await getTranslations('services.items');

  const bookings = await allBookings();
  const names = await clientNameMap(bookings.map((b) => b.client_id));

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

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
                    <BookingStatusBadge status={b.status} />
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
    </>
  );
}
