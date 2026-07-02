import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Users, FileCheck, Receipt, MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { BookingStatusBadge, ReviewStatusBadge } from '@/components/status-badge';
import { ServiceIcon } from '@/components/service-icon';
import {
  mockBookings,
  mockClients,
  mockDocuments,
  mockInvoices,
  clientName,
} from '@/lib/mock-data';
import { formatBRL, formatDate, intlLocale } from '@/lib/utils';

export default async function AdminOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin.overview');
  const ts = await getTranslations('services.items');

  const pendingDocs = mockDocuments.filter((d) => d.review_status !== 'approved');
  const unpaid = mockInvoices.filter((i) => i.status !== 'paid');

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label={t('clients')} value={mockClients.length} />
        <StatCard
          icon={FileCheck}
          label={t('pendingDocs')}
          value={pendingDocs.length}
          tone="warning"
        />
        <StatCard
          icon={Receipt}
          label={t('unpaidInvoices')}
          value={unpaid.length}
          tone="danger"
        />
        <StatCard
          icon={MessageSquare}
          label={t('openMessages')}
          value={3}
          tone="success"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('recentBookings')}</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{ts('flight.name')}</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-end">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBookings.slice(0, 5).map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <ServiceIcon
                          type={b.service_type}
                          className="h-4 w-4 text-text-secondary"
                        />
                        {b.destination}
                      </span>
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {clientName(b.client_id)}
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

        <Card>
          <CardHeader>
            <CardTitle>{t('reviewQueue')}</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Arquivo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-end">Enviado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingDocs.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.file_name}</TableCell>
                    <TableCell className="text-text-secondary">
                      {clientName(d.client_id)}
                    </TableCell>
                    <TableCell>
                      <ReviewStatusBadge status={d.review_status} />
                    </TableCell>
                    <TableCell className="text-end text-text-secondary">
                      {formatDate(d.uploaded_at, intlLocale(locale))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
