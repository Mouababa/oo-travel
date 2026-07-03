'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { QrCode, Landmark, Receipt, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InvoiceStatusBadge } from '@/components/status-badge';
import { EmptyState } from '@/components/empty-state';
import { PixModal } from '@/components/portal/pix-modal';
import { CihTransferModal } from '@/components/portal/cih-transfer-modal';
import { useToast } from '@/lib/use-toast';
import { markInvoicePaidAction } from '@/lib/actions';
import { formatBRL, formatDate, intlLocale } from '@/lib/utils';
import type { Invoice } from '@/lib/types';

export function InvoicesClient({ initialInvoices }: { initialInvoices: Invoice[] }) {
  const t = useTranslations('portal.invoices');
  const locale = useLocale();
  const { toast } = useToast();

  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [active, setActive] = useState<Invoice | null>(null);
  const [open, setOpen] = useState(false);
  const [cihActive, setCihActive] = useState<Invoice | null>(null);
  const [cihOpen, setCihOpen] = useState(false);

  function openPix(inv: Invoice) {
    setActive(inv);
    setOpen(true);
  }

  function openCih(inv: Invoice) {
    setCihActive(inv);
    setCihOpen(true);
  }

  function onCihUploaded(id: string) {
    setInvoices((list) =>
      list.map((i) =>
        i.id === id
          ? { ...i, payment_method: 'cih_transfer', payment_proof_status: 'pending' }
          : i,
      ),
    );
  }

  async function markPaid(id: string) {
    const result = await markInvoicePaidAction(id);
    if (result.ok) {
      setInvoices((list) =>
        list.map((i) =>
          i.id === id
            ? { ...i, status: 'paid', paid_at: new Date().toISOString(), payment_method: 'pix' }
            : i,
        ),
      );
    } else {
      toast({ title: t('paymentError'), variant: 'danger' });
    }
  }

  if (invoices.length === 0) {
    return <EmptyState icon={Receipt} title={t('empty')} description={t('emptyDesc')} />;
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {invoices.map((inv) => (
          <Card key={inv.id}>
            <CardHeader className="flex-row items-start justify-between">
              <div>
                <CardTitle className="font-mono">{inv.invoice_number}</CardTitle>
                {inv.due_date && (
                  <p className="mt-1 text-sm text-text-secondary">
                    {t('dueDate')}: {formatDate(inv.due_date, intlLocale(locale))}
                  </p>
                )}
              </div>
              <InvoiceStatusBadge status={inv.status} />
            </CardHeader>
            <CardContent>
              <ul className="mb-4 space-y-1.5 border-y border-border py-3 text-sm">
                {inv.line_items.map((item, i) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span className="text-text-secondary">{item.label}</span>
                    <span className="whitespace-nowrap font-mono font-medium text-text-primary">
                      {formatBRL(item.amount_brl)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">
                  {t('total')}
                </span>
                <span className="font-mono text-xl font-semibold text-text-primary">
                  {formatBRL(inv.total_brl)}
                </span>
              </div>

              {inv.status === 'paid' ? (
                <p className="text-center text-sm font-medium text-success">
                  {inv.paid_at && formatDate(inv.paid_at, intlLocale(locale))} ·{' '}
                  {t('status')}
                </p>
              ) : inv.payment_method === 'cih_transfer' &&
                inv.payment_proof_status === 'pending' ? (
                <p className="flex items-center justify-center gap-2 rounded-md border border-warning/30 bg-warning/10 py-2.5 text-center text-sm font-medium text-warning">
                  <Clock className="h-4 w-4" />
                  {t('cihPending')}
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {inv.payment_method === 'cih_transfer' &&
                    inv.payment_proof_status === 'rejected' && (
                      <p className="flex items-center justify-center gap-2 rounded-md border border-danger/30 bg-danger/10 py-2 text-center text-xs font-medium text-danger">
                        <XCircle className="h-3.5 w-3.5" />
                        {t('cihRejected')}
                      </p>
                    )}
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      variant="success"
                      onClick={() => openPix(inv)}
                      className="flex-1 gap-2 hover:animate-pulse-ring"
                    >
                      <QrCode className="h-4 w-4" />
                      {t('payPix')}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => openCih(inv)}
                    >
                      <Landmark className="h-4 w-4" />
                      {t('payCih')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <PixModal
        invoice={active}
        open={open}
        onClose={() => setOpen(false)}
        onPaid={markPaid}
      />
      <CihTransferModal
        invoice={cihActive}
        open={cihOpen}
        onClose={() => setCihOpen(false)}
        onUploaded={onCihUploaded}
      />
    </>
  );
}
