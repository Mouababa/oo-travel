'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Check, X, Landmark, Inbox, ExternalLink, Loader2, Plus, Download } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { InvoiceStatusBadge } from '@/components/status-badge';
import { EmptyState } from '@/components/empty-state';
import { CreateInvoiceModal } from '@/components/admin/create-invoice-modal';
import { useToast } from '@/lib/use-toast';
import { verifyPaymentProofAction } from '@/lib/actions';
import { formatCurrency, formatDate, intlLocale } from '@/lib/utils';
import type { Invoice, User, Booking } from '@/lib/types';

function ReviewRow({
  invoice,
  clientName,
  onResolved,
}: {
  invoice: Invoice;
  clientName: string;
  onResolved: (id: string, status: 'approved' | 'rejected') => void;
}) {
  const t = useTranslations('admin.invoices');
  const locale = useLocale();
  const { toast } = useToast();
  const [pending, setPending] = useState<'approve' | 'reject' | 'view' | null>(null);

  async function viewSlip() {
    if (!invoice.payment_proof_path) return;
    setPending('view');
    const res = await fetch(
      `/api/documents/signed-url?path=${encodeURIComponent(invoice.payment_proof_path)}`,
    );
    const data = await res.json();
    setPending(null);
    if (data.url) window.open(data.url, '_blank', 'noopener,noreferrer');
    else toast({ title: t('slipError'), variant: 'danger' });
  }

  async function resolve(approve: boolean) {
    setPending(approve ? 'approve' : 'reject');
    const result = await verifyPaymentProofAction(invoice.id, approve);
    setPending(null);
    if (result.ok) {
      onResolved(invoice.id, approve ? 'approved' : 'rejected');
      toast({
        title: approve ? t('proofApproved') : t('proofRejected'),
        variant: approve ? 'success' : 'danger',
      });
    } else {
      toast({ title: t('proofError'), variant: 'danger' });
    }
  }

  return (
    <TableRow>
      <TableCell className="font-mono font-medium">{invoice.invoice_number}</TableCell>
      <TableCell className="text-text-secondary">{clientName}</TableCell>
      <TableCell className="text-text-secondary">
        {invoice.payment_proof_uploaded_at
          ? formatDate(invoice.payment_proof_uploaded_at, intlLocale(locale))
          : '—'}
      </TableCell>
      <TableCell className="text-end font-medium">
        {formatCurrency(invoice.total_brl, invoice.currency, intlLocale(locale))}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            disabled={pending !== null}
            onClick={viewSlip}
          >
            {pending === 'view' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
            {t('viewSlip')}
          </Button>
          <Button
            variant="success"
            size="sm"
            className="gap-1"
            disabled={pending !== null}
            onClick={() => resolve(true)}
          >
            <Check className="h-4 w-4" />
            {t('approve')}
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="gap-1"
            disabled={pending !== null}
            onClick={() => resolve(false)}
          >
            <X className="h-4 w-4" />
            {t('reject')}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function AdminInvoicesClient({
  initialInvoices,
  names,
  clients,
  bookings,
}: {
  initialInvoices: Invoice[];
  names: Record<string, string>;
  clients: User[];
  bookings: Booking[];
}) {
  const t = useTranslations('admin.invoices');
  const ti = useTranslations('portal.invoices');
  const locale = useLocale();

  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [createOpen, setCreateOpen] = useState(false);

  function onInvoiceCreated(invoice: Invoice) {
    setInvoices((list) => [invoice, ...list]);
  }

  // `names` is precomputed server-side from the initial invoice list, so a
  // just-created invoice's client won't be in it yet — fall back to the
  // full client list, which every admin page already has loaded.
  function clientNameFor(clientId?: string): string {
    if (!clientId) return '—';
    return names[clientId] ?? clients.find((c) => c.id === clientId)?.full_name ?? '—';
  }

  function onResolved(id: string, status: 'approved' | 'rejected') {
    setInvoices((list) =>
      list.map((i) =>
        i.id === id
          ? {
              ...i,
              payment_proof_status: status,
              status: status === 'approved' ? 'paid' : i.status,
              paid_at: status === 'approved' ? new Date().toISOString() : i.paid_at,
            }
          : i,
      ),
    );
  }

  const pendingProofs = invoices.filter(
    (i) => i.payment_method === 'cih_transfer' && i.payment_proof_status === 'pending',
  );

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        action={
          <Button className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            {t('create')}
          </Button>
        }
      />

      <CreateInvoiceModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        clients={clients}
        bookings={bookings}
        onCreated={onInvoiceCreated}
      />

      {pendingProofs.length > 0 && (
        <Card className="mb-6 border-warning/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-warning" />
              {t('cihQueueTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{ti('number')}</TableHead>
                  <TableHead>{t('client')}</TableHead>
                  <TableHead>{t('uploadedAt')}</TableHead>
                  <TableHead className="text-end">{ti('total')}</TableHead>
                  <TableHead className="text-end">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingProofs.map((inv) => (
                  <ReviewRow
                    key={inv.id}
                    invoice={inv}
                    clientName={clientNameFor(inv.client_id)}
                    onResolved={onResolved}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {invoices.length === 0 ? (
        <EmptyState icon={Inbox} title={t('empty')} />
      ) : (
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
                  <TableHead className="text-end">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono font-medium">
                      {inv.invoice_number}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {clientNameFor(inv.client_id)}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {inv.due_date ? formatDate(inv.due_date, intlLocale(locale)) : '—'}
                    </TableCell>
                    <TableCell>
                      <InvoiceStatusBadge status={inv.status} />
                    </TableCell>
                    <TableCell className="text-end font-medium">
                      {formatCurrency(inv.total_brl, inv.currency, intlLocale(locale))}
                    </TableCell>
                    <TableCell className="text-end">
                      <a
                        href={`/api/invoices/${inv.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary"
                        aria-label={t('downloadPdf')}
                        title={t('downloadPdf')}
                      >
                        <Download className="h-4 w-4" />
                      </a>
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
