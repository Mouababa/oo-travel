'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Check, X, Landmark, Inbox, ExternalLink, Loader2 } from 'lucide-react';
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
import { useToast } from '@/lib/use-toast';
import { verifyPaymentProofAction } from '@/lib/actions';
import { formatBRL, formatDate, intlLocale } from '@/lib/utils';
import type { Invoice } from '@/lib/types';

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
      <TableCell className="text-end font-medium">{formatBRL(invoice.total_brl)}</TableCell>
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
}: {
  initialInvoices: Invoice[];
  names: Record<string, string>;
}) {
  const t = useTranslations('admin.invoices');
  const ti = useTranslations('portal.invoices');
  const locale = useLocale();

  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);

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
                    clientName={inv.client_id ? (names[inv.client_id] ?? '—') : '—'}
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
      )}
    </>
  );
}
