import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Plus, Download, CalendarX } from 'lucide-react';
import { Link } from '@/i18n/routing';
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
import { BookingStatusBadge } from '@/components/status-badge';
import { ServiceIcon } from '@/components/service-icon';
import { EmptyState } from '@/components/empty-state';
import { bookingsForClient, mockUser } from '@/lib/mock-data';
import { formatBRL, formatDate, intlLocale } from '@/lib/utils';

export default async function BookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('portal.bookings');
  const ts = await getTranslations('services.items');
  const bookings = bookingsForClient(mockUser.id);

  const newButton = (
    <Link href="/portal/bookings/new">
      <Button className="gap-2">
        <Plus className="h-4 w-4" />
        {t('new')}
      </Button>
    </Link>
  );

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} action={newButton} />

      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title={t('empty')}
          description={t('emptyDesc')}
          action={newButton}
        />
      ) : (
        <Card>
          <CardContent className="px-0 py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('service')}</TableHead>
                  <TableHead>{t('destination')}</TableHead>
                  <TableHead>{t('dates')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead className="text-end">{t('amount')}</TableHead>
                  <TableHead className="text-end">{t('itinerary')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <span className="flex items-center gap-2 font-medium">
                        <ServiceIcon
                          type={b.service_type}
                          className="h-4 w-4 text-text-secondary"
                        />
                        {ts(`${b.service_type}.name`)}
                      </span>
                    </TableCell>
                    <TableCell className="text-text-secondary">{b.destination}</TableCell>
                    <TableCell className="whitespace-nowrap text-text-secondary">
                      {b.travel_date ? formatDate(b.travel_date, intlLocale(locale)) : '—'}
                      {b.return_date
                        ? ` → ${formatDate(b.return_date, intlLocale(locale))}`
                        : ''}
                    </TableCell>
                    <TableCell>
                      <BookingStatusBadge status={b.status} />
                    </TableCell>
                    <TableCell className="text-end font-medium">
                      {b.amount_brl ? formatBRL(b.amount_brl) : '—'}
                    </TableCell>
                    <TableCell className="text-end">
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
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
