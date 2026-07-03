import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Plus } from 'lucide-react';
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
import { InvoiceStatusBadge } from '@/components/status-badge';
import { allInvoices, clientNameMap } from '@/lib/data';
import { formatBRL, formatDate, intlLocale } from '@/lib/utils';

export default async function AdminInvoicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin.invoices');
  const ti = await getTranslations('portal.invoices');

  const invoices = await allInvoices();
  const names = await clientNameMap(
    invoices.map((i) => i.client_id).filter((id): id is string => Boolean(id)),
  );

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        action={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t('create')}
          </Button>
        }
      />

      <Card>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{ti('number')}</TableHead>
                <TableHead>{t('client')}</TableHead>
                <TableHead>{ti('dueDate')}</TableHead>
                <TableHead>{ti('status')}</TableHead>
                <TableHead className="text-end">{ti('total')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono font-medium">
                    {inv.invoice_number}
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {inv.client_id ? (names[inv.client_id] ?? '—') : '—'}
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {inv.due_date ? formatDate(inv.due_date, intlLocale(locale)) : '—'}
                  </TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={inv.status} />
                  </TableCell>
                  <TableCell className="text-end font-medium">
                    {formatBRL(inv.total_brl)}
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
